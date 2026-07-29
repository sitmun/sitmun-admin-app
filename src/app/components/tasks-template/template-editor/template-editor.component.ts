import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { Editor } from '@tiptap/core';
import { Node as ProseMirrorNode } from '@tiptap/pm/model';
import { NodeSelection, Selection } from '@tiptap/pm/state';
import { CellSelection, findTable, isInTable, selectionCell, TableMap } from '@tiptap/pm/tables';
import { html as beautifyHtml } from 'js-beautify';

import { handlebarsBlockHtmlAttribute } from './handlebars-block.extension';
import { handlebarsExpressionHtmlAttribute } from './handlebars-expression.extension';
import {
  handlebarsSystemVariableHtmlAttribute,
  isSystemVariableMustache,
  SYSTEM_VARIABLE_MUSTACHE_PATTERN,
} from './handlebars-system-variable.extension';
import { createTemplateEditorExtensions } from './template-editor-extensions';
import { TemplateHtmlValidatorService, TemplateValidationResult } from './template-html-validator.service';
import { translationLiteralHtmlAttribute, translationLiteralSelector } from './translation-literal.extension';

const HANDLEBARS_TABLE_ROW_ATTR = handlebarsBlockHtmlAttribute;

export function normalizeHandlebarsMarkup(html: string): string {
  return (html || '').replace(/\{\{[\s\S]*?}}/g, (placeholder) => {
    if (/<\/?(?:p|div|section|article|table|thead|tbody|tfoot|tr|td|th|ul|ol|li|h[1-6]|blockquote|pre|br)\b/i.test(placeholder)) {
      return placeholder;
    }

    return placeholder.replace(/<[^>]+>/g, '');
  });
}

export function normalizeEditorColorValue(value: string | null | undefined, fallback: string): string {
  if (!value) {
    return fallback;
  }

  const normalizedValue = value.trim();
  if (/^#[0-9a-f]{6}$/i.test(normalizedValue)) {
    return normalizedValue;
  }

  const shortHexMatch = normalizedValue.match(/^#([0-9a-f]{3})$/i);
  if (shortHexMatch) {
    return `#${shortHexMatch[1].split('').map((part) => `${part}${part}`).join('')}`;
  }

  const rgbMatch = normalizedValue.match(/^rgba?\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*[\d.]+)?\)$/i);
  if (rgbMatch) {
    return `#${rgbMatch
      .slice(1, 4)
      .map((part) => Number(part).toString(16).padStart(2, '0'))
      .join('')}`;
  }

  return fallback;
}

export function protectTableHandlebarsBlocks(html: string): string {
  return (html || '').replace(
    /(<(?:tbody|thead|tfoot)\b[^>]*>|<\/tr>)\s*(\{\{[#/][\s\S]*?}})\s*(?=<tr\b|<\/(?:tbody|thead|tfoot)>)/gi,
    (_match, previousTag: string, block: string) => `${previousTag}<tr ${HANDLEBARS_TABLE_ROW_ATTR}="${encodeURIComponent(block)}"><td><p>Handlebars block</p></td></tr>`,
  );
}

/** Inline chips for {@code {{#APP_NAME}}} (backend system vars). Runs before structural blocks. */
export function protectSystemVariableMustaches(html: string): string {
  // Clone global pattern so callers cannot leave a dirty lastIndex.
  const pattern = new RegExp(SYSTEM_VARIABLE_MUSTACHE_PATTERN.source, 'g');
  return (html || '').replace(pattern, (match) => {
    if (match.includes(handlebarsSystemVariableHtmlAttribute)) {
      return match;
    }

    return `<span ${handlebarsSystemVariableHtmlAttribute}="${encodeURIComponent(match)}" class="sitmun-handlebars-system-variable-node">${escapeHtml(match)}</span>`;
  });
}

/** True when visual HTML still has raw mustaches outside chip wrappers (needs re-protect). */
export function editorHtmlHasUnprotectedMustaches(editorHtml: string): boolean {
  const withoutChips = (editorHtml || '')
    .replace(/<span\b[^>]*\bdata-sitmun-handlebars-sysvar\b[^>]*>[\s\S]*?<\/span>/gi, '')
    .replace(/<span\b[^>]*\bdata-sitmun-handlebars-expr\b[^>]*>[\s\S]*?<\/span>/gi, '')
    .replace(/<div\b[^>]*\bdata-sitmun-handlebars-block\b[^>]*>[\s\S]*?<\/div>/gi, '')
    .replace(/<tr\b[^>]*\bdata-sitmun-handlebars-block\b[^>]*>[\s\S]*?<\/tr>/gi, '');
  return /\{\{\s*[/#]?[\s\S]*?}}/.test(withoutChips);
}

export function protectStructuralHandlebarsBlocks(html: string): string {
  return protectTableHandlebarsBlocks(html || '').replace(
    /\{\{\s*(?:[#/][^}]+|else)\s*}}/gi,
    (block) => {
      if (isSystemVariableMustache(block) || block.includes(handlebarsSystemVariableHtmlAttribute)) {
        return block;
      }

      return `<div ${handlebarsBlockHtmlAttribute}="${encodeURIComponent(block)}">${escapeHtml(block)}</div>`;
    },
  );
}

/** Wrap non-structural mustaches after structural protect. Order: sysvar → structural → expressions. */
export function protectHandlebarsExpressions(html: string): string {
  return (html || '').replace(/\{\{\{[\s\S]*?\}\}\}|\{\{[\s\S]*?\}\}/g, (match) => {
    if (
      match.includes(handlebarsExpressionHtmlAttribute)
      || match.includes(handlebarsBlockHtmlAttribute)
      || match.includes(handlebarsSystemVariableHtmlAttribute)
    ) {
      return match;
    }

    if (/^\{\{\s*(?:[#/]|else\b)/i.test(match)) {
      return match;
    }

    return `<span ${handlebarsExpressionHtmlAttribute}="${encodeURIComponent(match)}" class="sitmun-handlebars-expression-node">${escapeHtml(match)}</span>`;
  });
}

export function protectTemplateEditorHtml(html: string): string {
  return protectHandlebarsExpressions(
    protectStructuralHandlebarsBlocks(protectSystemVariableMustaches(html || '')),
  );
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

type SelectedNodeType = 'none' | 'image' | 'iframe' | 'translationLiteral' | 'table';
type TableSelectionMode = 'none' | 'cell' | 'row' | 'column' | 'table';

@Component({
  selector: 'app-template-editor',
  templateUrl: './template-editor.component.html',
  styleUrl: './template-editor.component.scss',
  standalone: false,
})
export class TemplateEditorComponent implements AfterViewInit, OnChanges, OnDestroy {
  private static readonly FONT_SIZE_OPTIONS = ['12px', '14px', '16px', '18px', '24px', '32px'];

  @Input() html = '';
  @Input() readonly = false;
  @Input() referenceAliases: string[] = [];
  /** When true, parent shows the preview pane beside the editor. */
  @Input() previewOpen = false;
  @Output() htmlChange = new EventEmitter<string>();
  @Output() validationChange = new EventEmitter<TemplateValidationResult>();
  @Output() previewOpenChange = new EventEmitter<boolean>();

  @ViewChild('editorHost', { static: true })
  private readonly editorHost!: ElementRef<HTMLDivElement>;

  editorMode: 'visual' | 'html' = 'visual';
  htmlSource = '';
  validationErrors: string[] = [];
  interactionErrors: string[] = [];
  selectedElementWidth = '';
  selectedElementHeight = '';
  selectedTextColor = '#000000';
  selectedHighlightColor = '#ffffff';
  selectedFontSize = '';
  selectedTableCellBackground = '#ffffff';
  selectedTableCellBorderColor = '#000000';
  selectedTableCellBorderWidth: string | number = '0';
  selectedTableEachAlias = '';
  selectedNodeType: SelectedNodeType = 'none';
  tableSelectionMode: TableSelectionMode = 'none';
  canDeleteSelection = false;
  editorFocused = false;
  componentFocusedWithin = false;

  readonly fontSizeOptions = TemplateEditorComponent.FONT_SIZE_OPTIONS;

  private editor: Editor | null = null;
  private lastEmittedHtml = '';
  private lastTablePosition: number | null = null;
  private syncingFromInput = false;

  constructor(
    private readonly validator: TemplateHtmlValidatorService,
    private readonly translateService: TranslateService,
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngAfterViewInit(): void {
    this.editor = new Editor({
      element: this.editorHost.nativeElement,
      editable: !this.readonly,
      extensions: createTemplateEditorExtensions(),
      content: '',
      onUpdate: () => {
        if (this.syncingFromInput || this.editorMode !== 'visual') {
          return;
        }

        this.syncFromVisualEditor();
        this.syncSelectionState();
      },
      onSelectionUpdate: () => {
        this.syncSelectionState();
      },
      onFocus: () => {
        this.editorFocused = true;
        this.syncSelectionState();
      },
      onBlur: () => {
        this.editorFocused = false;
        this.syncSelectionState();
      },
    });

    // Prefer htmlSource when OnChanges already captured the bound value before the editor existed.
    this.applyIncomingHtml(this.htmlSource || this.html || '', true);
    this.syncSelectionState();
    queueMicrotask(() => this.reprotectVisualMustachesIfNeeded());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['html']) {
      return;
    }

    const nextHtml = normalizeHandlebarsMarkup(changes['html'].currentValue || '');
    if (this.syncingFromInput) {
      return;
    }

    // Same serialized HTML can still need a visual re-chip pass (e.g. after parent echo).
    if (nextHtml === this.lastEmittedHtml) {
      this.reprotectVisualMustachesIfNeeded();
      return;
    }

    this.applyIncomingHtml(nextHtml, false);
  }

  onComponentFocusIn(): void {
    this.componentFocusedWithin = true;
  }

  onComponentFocusOut(event: FocusEvent): void {
    const currentTarget = event.currentTarget as HTMLElement | null;
    const nextFocusedElement = event.relatedTarget as Node | null;
    if (currentTarget?.contains(nextFocusedElement)) {
      return;
    }

    this.componentFocusedWithin = false;
    this.resetSelectionState();
    this.changeDetectorRef.detectChanges();
  }

  togglePreview(): void {
    this.previewOpenChange.emit(!this.previewOpen);
  }

  setEditorMode(mode: 'visual' | 'html'): void {
    if (mode === 'html') {
      if (this.editor) {
        this.htmlSource = this.serializeEditorHtml();
      }
      this.publishValidation(this.validator.validate(this.htmlSource));
      this.editorMode = 'html';
      return;
    }

    const validation = this.validator.validate(this.htmlSource);
    this.publishValidation(validation);
    if (!validation.valid) {
      this.editorMode = 'html';
      return;
    }

    this.editorMode = 'visual';
    this.loadHtmlIntoEditor(this.htmlSource);
  }

  onHtmlSourceChanged(html: string): void {
    const normalizedHtml = normalizeHandlebarsMarkup(html);
    this.htmlSource = normalizedHtml;

    const validation = this.validator.validate(normalizedHtml);
    this.publishValidation(validation);
    if (validation.valid) {
      this.emitHtml(normalizedHtml);
    }
  }

  setParagraph(): void {
    this.editor?.chain().focus().setParagraph().run();
  }

  toggleHeading(level: 1 | 2 | 3): void {
    this.editor?.chain().focus().toggleHeading({ level }).run();
  }

  toggleBold(): void {
    this.editor?.chain().focus().toggleBold().run();
  }

  toggleItalic(): void {
    this.editor?.chain().focus().toggleItalic().run();
  }

  toggleUnderline(): void {
    this.editor?.chain().focus().toggleUnderline().run();
  }

  toggleBulletList(): void {
    this.editor?.chain().focus().toggleBulletList().run();
  }

  toggleOrderedList(): void {
    this.editor?.chain().focus().toggleOrderedList().run();
  }

  toggleTextAlign(alignment: 'left' | 'center' | 'right' | 'justify'): void {
    this.editor?.chain().focus().setTextAlign(alignment).run();
    this.syncSelectionState();
  }

  toggleLink(): void {
    if (!this.editor) {
      return;
    }

    const previousUrl = this.editor.getAttributes('link')['href'] as string | undefined;
    const nextUrl = window.prompt(this.translateService.instant('entity.task.template.editor.linkPrompt'), previousUrl || 'https://');
    if (nextUrl == null) {
      return;
    }

    if (nextUrl.trim().length === 0) {
      this.editor.chain().focus().unsetLink().run();
      return;
    }

    this.editor.chain().focus().setLink({ href: nextUrl.trim() }).run();
  }

  insertImage(): void {
    if (!this.editor) {
      return;
    }

    const src = window.prompt(this.translateService.instant('entity.task.template.editor.imagePrompt'), 'https://');
    if (!src || src.trim().length === 0) {
      return;
    }

    this.editor.chain().focus().setImage({ src: src.trim() }).run();
  }

  insertTable(): void {
    this.editor?.chain().focus().insertTable({ rows: 1, cols: 1, withHeaderRow: false }).run();
  }

  addColumnAfter(): void {
    this.editor?.chain().focus().addColumnAfter().run();
  }

  addRowAfter(): void {
    this.editor?.chain().focus().addRowAfter().run();
  }

  deleteTable(): void {
    this.deleteCurrentTable();
    this.syncSelectionState();
  }

  deleteRow(): void {
    if (!this.editor || !this.isTableContextVisible()) {
      return;
    }

    const tableInfo = this.getCurrentTableInfo();
    if (tableInfo?.rowCount === 1) {
      this.deleteCurrentTable();
    } else {
      this.editor.chain().focus().deleteRow().run();
    }
    this.syncSelectionState();
  }

  deleteColumn(): void {
    if (!this.editor || !this.isTableContextVisible()) {
      return;
    }

    const tableInfo = this.getCurrentTableInfo();
    if (tableInfo?.columnCount === 1) {
      this.deleteCurrentTable();
    } else {
      this.editor.chain().focus().deleteColumn().run();
    }
    this.syncSelectionState();
  }

  deleteSelectedElement(): void {
    if (!this.editor || (!this.canDeleteSelection && !this.isTableContextVisible())) {
      return;
    }

    const { selection } = this.editor.state;
    if (selection instanceof CellSelection) {
      if (selection.isRowSelection()) {
        const tableInfo = this.getCurrentTableInfo();
        if (tableInfo?.rowCount === 1) {
          this.deleteCurrentTable();
        } else {
          this.editor.commands.deleteRow();
        }
      } else if (selection.isColSelection()) {
        const tableInfo = this.getCurrentTableInfo();
        if (tableInfo?.columnCount === 1) {
          this.deleteCurrentTable();
        } else {
          this.editor.commands.deleteColumn();
        }
      } else {
        const tableInfo = this.getCurrentTableInfo();
        if (tableInfo?.rowCount === 1 && tableInfo.columnCount === 1) {
          this.deleteCurrentTable();
        } else {
          this.editor.commands.deleteSelection();
        }
      }
      this.syncSelectionState();
      return;
    }

    if (this.tableSelectionMode === 'table' || (selection instanceof NodeSelection && selection.node.type.name === 'table')) {
      this.deleteCurrentTable();
      this.syncSelectionState();
      return;
    }

    if (this.isTableContextVisible()) {
      const tableInfo = this.getCurrentTableInfo();
      if (tableInfo?.rowCount === 1 && tableInfo.columnCount === 1) {
        this.deleteCurrentTable();
      } else {
        this.editor.commands.deleteSelection();
      }
      this.syncSelectionState();
      return;
    }

    this.editor.chain().focus().deleteSelection().run();
    this.syncSelectionState();
  }

  selectCurrentCell(): void {
    if (!this.editor || !this.isTableContextVisible()) {
      return;
    }

    const cell = selectionCell(this.editor.state);
    this.editor.commands.setCellSelection({ anchorCell: cell.pos, headCell: cell.pos });
    this.syncSelectionState();
  }

  selectCurrentRow(): void {
    if (!this.editor || !this.isTableContextVisible()) {
      return;
    }

    const cell = selectionCell(this.editor.state);
    const transaction = this.editor.state.tr.setSelection(CellSelection.rowSelection(cell));
    this.editor.view.dispatch(transaction);
    this.syncSelectionState();
  }

  selectCurrentColumn(): void {
    if (!this.editor || !this.isTableContextVisible()) {
      return;
    }

    const cell = selectionCell(this.editor.state);
    const transaction = this.editor.state.tr.setSelection(CellSelection.colSelection(cell));
    this.editor.view.dispatch(transaction);
    this.syncSelectionState();
  }

  selectCurrentTable(): void {
    if (!this.editor || !this.isTableContextVisible()) {
      return;
    }

    const cell = selectionCell(this.editor.state);
    const table = findTable(cell);
    if (!table) {
      return;
    }

    const transaction = this.editor.state.tr.setSelection(NodeSelection.create(this.editor.state.doc, table.pos));
    this.editor.view.dispatch(transaction);
    this.lastTablePosition = table.pos;
    this.syncSelectionState();
  }

  setTableCellBackground(color: string): void {
    this.selectedTableCellBackground = color;
    this.updateSelectedTableCellsStyle({ 'background-color': color });
  }

  clearTableCellBackground(): void {
    this.updateSelectedTableCellsStyle({ 'background-color': null });
  }

  setTableCellBorderColor(color: string): void {
    this.selectedTableCellBorderColor = color;
    this.applyTableCellBorder();
  }

  setTableCellBorderWidth(width: string | number): void {
    this.selectedTableCellBorderWidth = width;
    this.applyTableCellBorder();
  }

  clearTableCellBorder(): void {
    this.updateSelectedTableCellsStyle({
      border: null,
      'border-color': null,
      'border-style': null,
      'border-width': null,
    });
  }

  setTextColor(color: string): void {
    if (!this.editor) {
      return;
    }

    this.selectedTextColor = color;
    this.editor.chain().focus().setColor(color).run();
    this.syncSelectionState();
  }

  clearTextColor(): void {
    this.editor?.chain().focus().unsetColor().run();
    this.syncSelectionState();
  }

  setHighlightColor(color: string): void {
    if (!this.editor) {
      return;
    }

    this.selectedHighlightColor = color;
    this.editor.chain().focus().setHighlight({ color }).run();
    this.syncSelectionState();
  }

  clearHighlightColor(): void {
    this.editor?.chain().focus().unsetHighlight().run();
    this.syncSelectionState();
  }

  setFontSize(fontSize: string): void {
    if (!this.editor) {
      return;
    }

    this.selectedFontSize = fontSize;
    if (!fontSize) {
      this.editor.chain().focus().unsetFontSize().run();
    } else {
      this.editor.chain().focus().setFontSize(fontSize).run();
    }

    this.syncSelectionState();
  }

  updateSelectedElementSize(dimension: 'width' | 'height', value: string | number): void {
    if (!this.editor || !this.isSizeControlVisible()) {
      return;
    }

    const trimmedValue = String(value ?? '').trim();
    const attrs = {
      width: dimension === 'width' ? (trimmedValue || null) : (this.selectedElementWidth || null),
      height: dimension === 'height' ? (trimmedValue || null) : (this.selectedElementHeight || null),
    };

    if (this.selectedNodeType === 'image') {
      this.editor.chain().focus().updateAttributes('image', attrs).run();
    } else if (this.selectedNodeType === 'iframe') {
      this.editor.chain().focus().updateAttributes('iframe', attrs).run();
    }

    this.syncSelectionState();
  }

  formatHtmlSource(): void {
    this.onHtmlSourceChanged(beautifyHtml(this.htmlSource || '', {
      indent_size: 2,
      wrap_line_length: 0,
      preserve_newlines: false,
      end_with_newline: false,
    }));
  }

  wrapSelectionInTranslationLiteral(): void {
    if (!this.editor || this.readonly) {
      return;
    }

    const { selection } = this.editor.state;
    if (selection.empty) {
      this.showInteractionError('entity.task.template.editor.selectBeforeT');
      return;
    }

    if (!selection.$from.sameParent || !selection.$from.parent.isTextblock) {
      this.showInteractionError('entity.task.template.editor.singleBlockT');
      return;
    }

    const domSelection = window.getSelection();
    if (!domSelection || domSelection.rangeCount === 0) {
      this.showInteractionError('entity.task.template.editor.noSelection');
      return;
    }

    const range = domSelection.getRangeAt(0);
    const editorDom = this.editor.view.dom;
    const commonAncestor = range.commonAncestorContainer instanceof Element
      ? range.commonAncestorContainer
      : range.commonAncestorContainer.parentElement;
    if (!commonAncestor || !editorDom.contains(commonAncestor)) {
      this.showInteractionError('entity.task.template.editor.selectionOutside');
      return;
    }

    if (commonAncestor.closest(translationLiteralSelector)) {
      this.showInteractionError('entity.task.template.editor.nestedTError');
      return;
    }

    const container = document.createElement('div');
    container.appendChild(range.cloneContents());
    const selectedHtml = normalizeHandlebarsMarkup(container.innerHTML || domSelection.toString());
    if (!selectedHtml.trim()) {
      this.showInteractionError('entity.task.template.editor.invalidSelection');
      return;
    }

    if (/<\s*t\b/i.test(selectedHtml) || selectedHtml.includes('data-sitmun-translation-literal')) {
      this.showInteractionError('entity.task.template.editor.nestedTError');
      return;
    }

    this.interactionErrors = [];
    this.editor.chain().focus().deleteSelection().insertContent({
      type: 'translationLiteral',
      attrs: { html: selectedHtml },
    }).run();
  }

  isActive(name: string, attributes?: Record<string, unknown>): boolean {
    return this.editor?.isActive(name, attributes) ?? false;
  }

  isTextAlignActive(alignment: 'left' | 'center' | 'right' | 'justify'): boolean {
    return this.editor?.isActive({ textAlign: alignment }) ?? false;
  }

  isSizeControlVisible(): boolean {
    return this.selectedNodeType === 'image' || this.selectedNodeType === 'iframe';
  }

  isTableContextVisible(): boolean {
    return this.componentFocusedWithin && !!this.editor && (this.selectedNodeType === 'table' || isInTable(this.editor.state));
  }

  get hasOrphanTableEachAlias(): boolean {
    return !!this.selectedTableEachAlias && !this.referenceAliases.includes(this.selectedTableEachAlias);
  }

  setTableEachAlias(alias: string): void {
    if (!this.editor || this.readonly || !this.isTableContextVisible()) {
      return;
    }

    const nextAlias = (alias || '').trim();
    this.selectedTableEachAlias = nextAlias;
    this.editor
      .chain()
      .focus()
      .updateAttributes('table', { sitmunEach: nextAlias ? `${nextAlias}.rows` : null })
      .run();
    this.syncFromVisualEditor();
  }

  isTableSelectionActive(mode: Exclude<TableSelectionMode, 'none'>): boolean {
    return this.tableSelectionMode === mode;
  }

  ngOnDestroy(): void {
    this.editor?.destroy();
    this.editor = null;
  }

  private applyIncomingHtml(nextHtml: string, initialLoad: boolean): void {
    this.htmlSource = normalizeHandlebarsMarkup(nextHtml || '');
    const validation = this.validator.validate(this.htmlSource);
    this.publishValidation(validation);

    if (!this.editor) {
      if (!validation.valid) {
        this.editorMode = 'html';
      }
      return;
    }

    if (!validation.valid) {
      this.editorMode = 'html';
      return;
    }

    if (this.editorMode === 'visual' || initialLoad) {
      this.loadHtmlIntoEditor(this.htmlSource);
      this.reprotectVisualMustachesIfNeeded();
    }

    this.lastEmittedHtml = this.htmlSource;
  }

  private syncFromVisualEditor(): void {
    if (!this.editor) {
      return;
    }

    const nextHtml = this.serializeEditorHtml();
    const validation = this.validator.validate(nextHtml);
    this.publishValidation(validation);
    if (!validation.valid) {
      return;
    }

    this.htmlSource = nextHtml;
    this.emitHtml(nextHtml);
    this.reprotectVisualMustachesIfNeeded();
  }

  private loadHtmlIntoEditor(html: string): void {
    if (!this.editor) {
      return;
    }

    this.syncingFromInput = true;
    this.editor.commands.setContent(protectTemplateEditorHtml(html || ''), false);
    this.syncingFromInput = false;
    this.syncSelectionState();
  }

  /** Re-run protect when visual doc still has raw {{…}} text (typed/pasted or failed first paint). */
  private reprotectVisualMustachesIfNeeded(): void {
    if (!this.editor || this.editorMode !== 'visual' || this.syncingFromInput) {
      return;
    }

    if (!editorHtmlHasUnprotectedMustaches(this.editor.getHTML())) {
      return;
    }

    const selectionFrom = this.editor.state.selection.from;
    this.loadHtmlIntoEditor(this.serializeEditorHtml());
    const maxPos = this.editor.state.doc.content.size;
    this.editor.commands.setTextSelection(Math.min(Math.max(selectionFrom, 1), maxPos));
  }

  private serializeEditorHtml(): string {
    if (!this.editor) {
      return normalizeHandlebarsMarkup(this.htmlSource || '');
    }

    const doc = new DOMParser().parseFromString(this.editor.getHTML(), 'text/html');
    for (const table of Array.from(doc.body.querySelectorAll('table[data-sitmun-each-alias]'))) {
      table.removeAttribute('data-sitmun-each-alias');
    }

    const handlebarsRows = Array.from(doc.body.querySelectorAll<HTMLTableRowElement>(`tr[${HANDLEBARS_TABLE_ROW_ATTR}]`));
    for (const row of handlebarsRows) {
      row.replaceWith(doc.createTextNode(`\n${this.decodeStoredHtml(row.getAttribute(HANDLEBARS_TABLE_ROW_ATTR))}\n`));
    }

    const handlebarsBlocks = Array.from(doc.body.querySelectorAll<HTMLElement>(`div[${handlebarsBlockHtmlAttribute}]`));
    for (const block of handlebarsBlocks) {
      block.replaceWith(doc.createTextNode(this.decodeStoredHtml(block.getAttribute(handlebarsBlockHtmlAttribute))));
    }

    const systemVariableNodes = Array.from(
      doc.body.querySelectorAll<HTMLElement>(`span[${handlebarsSystemVariableHtmlAttribute}]`),
    );
    for (const node of systemVariableNodes) {
      node.replaceWith(
        doc.createTextNode(this.decodeStoredHtml(node.getAttribute(handlebarsSystemVariableHtmlAttribute))),
      );
    }

    const expressionNodes = Array.from(doc.body.querySelectorAll<HTMLElement>(`span[${handlebarsExpressionHtmlAttribute}]`));
    for (const node of expressionNodes) {
      node.replaceWith(doc.createTextNode(this.decodeStoredHtml(node.getAttribute(handlebarsExpressionHtmlAttribute))));
    }

    const translationNodes = Array.from(doc.body.querySelectorAll<HTMLElement>(translationLiteralSelector));
    for (const node of translationNodes) {
      const literal = doc.createElement('t');
      literal.innerHTML = this.decodeStoredHtml(node.getAttribute(translationLiteralHtmlAttribute));
      node.replaceWith(literal);
    }

    return normalizeHandlebarsMarkup(doc.body.innerHTML);
  }

  private publishValidation(validation: TemplateValidationResult): void {
    this.validationErrors = validation.errors;
    this.validationChange.emit(validation);
  }

  private showInteractionError(translationKey: string): void {
    this.interactionErrors = [this.translateService.instant(translationKey)];
  }

  private emitHtml(html: string): void {
    if (html === this.lastEmittedHtml) {
      return;
    }

    this.interactionErrors = [];
    this.lastEmittedHtml = html;
    this.htmlChange.emit(html);
  }

  private decodeStoredHtml(value: string | null): string {
    if (!value) {
      return '';
    }

    try {
      return decodeURIComponent(value);
    } catch {
      return value;
    }
  }

  private syncSelectionState(): void {
    if (!this.editor) {
      return;
    }

    this.editorFocused = this.editor.isFocused;

    if (!this.componentFocusedWithin) {
      this.resetSelectionState();
      this.changeDetectorRef.detectChanges();
      return;
    }

    const { selection } = this.editor.state;
    this.canDeleteSelection = !selection.empty || isInTable(this.editor.state);
    this.selectedNodeType = this.resolveSelectedNodeType(selection);
    this.tableSelectionMode = this.resolveTableSelectionMode(selection);
    this.rememberCurrentTablePosition(selection);

    const textStyleAttributes = this.editor.getAttributes('textStyle') as Record<string, string | null | undefined>;
    const highlightAttributes = this.editor.getAttributes('highlight') as Record<string, string | null | undefined>;
    this.selectedTextColor = this.normalizeColorValue(textStyleAttributes['color'], '#000000');
    this.selectedHighlightColor = this.normalizeColorValue(highlightAttributes['color'], '#fff59d');
    this.selectedFontSize = this.normalizeFontSize(textStyleAttributes['fontSize']);
    this.syncTableCellStyleState();
    this.syncTableEachAliasState();

    if (!this.isSizeControlVisible()) {
      this.selectedElementWidth = '';
      this.selectedElementHeight = '';
      this.changeDetectorRef.detectChanges();
      return;
    }

    const attributes = this.editor.getAttributes(this.selectedNodeType) as Record<string, string | null | undefined>;
    this.selectedElementWidth = this.normalizeDimensionValue(attributes['width']);
    this.selectedElementHeight = this.normalizeDimensionValue(attributes['height']);
    this.changeDetectorRef.detectChanges();
  }

  private resetSelectionState(): void {
    this.canDeleteSelection = false;
    this.selectedNodeType = 'none';
    this.tableSelectionMode = 'none';
    this.selectedElementWidth = '';
    this.selectedElementHeight = '';
    this.selectedTextColor = '#000000';
    this.selectedHighlightColor = '#fff59d';
    this.selectedFontSize = '';
    this.selectedTableCellBackground = '#ffffff';
    this.selectedTableCellBorderColor = '#000000';
    this.selectedTableCellBorderWidth = '1';
    this.selectedTableEachAlias = '';
  }

  private syncTableEachAliasState(): void {
    if (!this.editor || !this.isTableContextVisible()) {
      this.selectedTableEachAlias = '';
      return;
    }

    const sitmunEach = this.editor.getAttributes('table')['sitmunEach'];
    this.selectedTableEachAlias = sitmunEach ? String(sitmunEach).replace(/\.rows$/i, '') : '';
  }

  private resolveSelectedNodeType(selection: Selection): SelectedNodeType {
    if (!(selection instanceof NodeSelection)) {
      return 'none';
    }

    const nodeType = selection.node.type.name;
    if (nodeType === 'image' || nodeType === 'iframe' || nodeType === 'translationLiteral' || nodeType === 'table') {
      return nodeType;
    }

    return 'none';
  }

  private resolveTableSelectionMode(selection: Selection): TableSelectionMode {
    if (selection instanceof NodeSelection && selection.node.type.name === 'table') {
      return 'table';
    }

    if (!(selection instanceof CellSelection)) {
      return 'none';
    }

    if (selection.isRowSelection()) {
      return 'row';
    }

    if (selection.isColSelection()) {
      return 'column';
    }

    return 'cell';
  }

  private normalizeColorValue(value: string | null | undefined, fallback: string): string {
    return normalizeEditorColorValue(value, fallback);
  }

  private normalizeFontSize(value: string | null | undefined): string {
    return TemplateEditorComponent.FONT_SIZE_OPTIONS.includes(value || '') ? value || '' : '';
  }

  private normalizeDimensionValue(value: string | null | undefined): string {
    if (!value) {
      return '';
    }

    return value.replace(/px$/i, '').trim();
  }

  private applyTableCellBorder(): void {
    const width = String(this.selectedTableCellBorderWidth ?? '').trim();
    const numericWidth = width && Number(width) > 0 ? width : '1';
    this.selectedTableCellBorderWidth = numericWidth;
    this.updateSelectedTableCellsStyle({ border: `${numericWidth}px solid ${this.selectedTableCellBorderColor}` });
  }

  private updateSelectedTableCellsStyle(styles: Record<string, string | null>): void {
    if (!this.editor || !this.isTableContextVisible()) {
      return;
    }

    const cells = this.getSelectedTableCells();
    if (cells.length === 0) {
      return;
    }

    let transaction = this.editor.state.tr;
    for (const cell of cells) {
      const nextStyle = this.mergeInlineStyle(String(cell.node.attrs['style'] || ''), styles);
      transaction = transaction.setNodeMarkup(cell.pos, undefined, {
        ...cell.node.attrs,
        style: nextStyle || null,
      });
    }

    if (transaction.docChanged) {
      this.editor.view.dispatch(transaction);
      this.syncSelectionState();
    }
  }

  private getSelectedTableCells(): Array<{ node: ProseMirrorNode; pos: number }> {
    if (!this.editor) {
      return [];
    }

    const { selection } = this.editor.state;
    if (selection instanceof CellSelection) {
      const cells: Array<{ node: ProseMirrorNode; pos: number }> = [];
      selection.forEachCell((node, pos) => cells.push({ node, pos }));
      return cells;
    }

    const tablePosition = this.getCurrentTablePosition();
    const tableNode = tablePosition == null ? null : this.editor.state.doc.nodeAt(tablePosition);
    if (this.tableSelectionMode === 'table' && tableNode?.type.name === 'table') {
      const cells: Array<{ node: ProseMirrorNode; pos: number }> = [];
      tableNode.descendants((node, pos) => {
        if (node.type.name === 'tableCell' || node.type.name === 'tableHeader') {
          cells.push({ node, pos: tablePosition + 1 + pos });
        }
      });
      return cells;
    }

    if (isInTable(this.editor.state)) {
      const cell = selectionCell(this.editor.state);
      const node = cell.nodeAfter;
      if (node?.type.name === 'tableCell' || node?.type.name === 'tableHeader') {
        return [{ node, pos: cell.pos }];
      }
    }

    return [];
  }

  private syncTableCellStyleState(): void {
    if (!this.editor || !this.isTableContextVisible()) {
      this.selectedTableCellBackground = '#ffffff';
      this.selectedTableCellBorderColor = '#000000';
      this.selectedTableCellBorderWidth = '1';
      return;
    }

    const cell = this.getSelectedTableCells()[0];
    const style = this.parseInlineStyle(String(cell?.node.attrs['style'] || ''));
    this.selectedTableCellBackground = this.normalizeColorValue(style['background-color'], '#ffffff');
    this.selectedTableCellBorderColor = this.normalizeColorValue(style['border-color'] || this.extractBorderColor(style['border']), '#000000');
    this.selectedTableCellBorderWidth = this.extractBorderWidth(style['border-width'] || style['border']) || '1';
  }

  private parseInlineStyle(style: string): Record<string, string> {
    return style.split(';').reduce((acc, declaration) => {
      const separatorIndex = declaration.indexOf(':');
      if (separatorIndex < 0) {
        return acc;
      }

      const property = declaration.slice(0, separatorIndex).trim().toLowerCase();
      const value = declaration.slice(separatorIndex + 1).trim();
      if (property && value) {
        acc[property] = value;
      }
      return acc;
    }, {} as Record<string, string>);
  }

  private mergeInlineStyle(style: string, updates: Record<string, string | null>): string {
    const styles = this.parseInlineStyle(style);
    for (const [property, value] of Object.entries(updates)) {
      if (value == null || value.trim().length === 0) {
        delete styles[property];
      } else {
        styles[property] = value.trim();
      }
    }

    return Object.entries(styles).map(([property, value]) => `${property}: ${value}`).join('; ');
  }

  private extractBorderColor(value: string | undefined): string | null {
    const colorMatch = value?.match(/(?:#[0-9a-f]{3,6}\b|rgba?\([^)]*\))/i)?.[0] || null;
    if (!colorMatch) {
      return null;
    }

    return this.normalizeColorValue(colorMatch, '#000000');
  }

  private extractBorderWidth(value: string | undefined): string | null {
    return value?.match(/(\d+(?:\.\d+)?)px\b/i)?.[1] || null;
  }

  private getCurrentTableInfo(): { rowCount: number; columnCount: number } | null {
    if (!this.editor || !isInTable(this.editor.state)) {
      return null;
    }

    const cell = selectionCell(this.editor.state);
    const table = findTable(cell);
    if (!table) {
      return null;
    }

    const map = TableMap.get(table.node);
    return {
      rowCount: map.height,
      columnCount: map.width,
    };
  }

  private deleteCurrentTable(): boolean {
    if (!this.editor) {
      return false;
    }

    const tablePosition = this.getCurrentTablePosition();
    if (tablePosition == null) {
      return this.editor.commands.deleteTable();
    }

    const tableNode = this.editor.state.doc.nodeAt(tablePosition);
    if (!tableNode || tableNode.type.name !== 'table') {
      return this.editor.commands.deleteTable();
    }

    const transaction = this.editor.state.tr.delete(tablePosition, tablePosition + tableNode.nodeSize);
    this.editor.view.dispatch(transaction);
    this.lastTablePosition = null;
    return true;
  }

  private getCurrentTablePosition(): number | null {
    if (!this.editor) {
      return null;
    }

    const { selection } = this.editor.state;
    if (selection instanceof NodeSelection && selection.node.type.name === 'table') {
      return selection.from;
    }

    if (isInTable(this.editor.state)) {
      const cell = selectionCell(this.editor.state);
      return findTable(cell)?.pos ?? null;
    }

    return this.lastTablePosition;
  }

  private rememberCurrentTablePosition(selection: Selection): void {
    if (!this.editor) {
      return;
    }

    if (selection instanceof NodeSelection && selection.node.type.name === 'table') {
      this.lastTablePosition = selection.from;
      return;
    }

    if (isInTable(this.editor.state)) {
      const cell = selectionCell(this.editor.state);
      this.lastTablePosition = findTable(cell)?.pos ?? this.lastTablePosition;
    }
  }
}
