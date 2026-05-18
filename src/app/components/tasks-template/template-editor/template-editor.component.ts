import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';

import {TranslateService} from '@ngx-translate/core';

export function normalizeHandlebarsMarkup(html: string): string {
  return (html || '').replace(/\{\{[\s\S]*?}}/g, (placeholder) => {
    if (/<\/?(?:p|div|section|article|table|thead|tbody|tfoot|tr|td|th|ul|ol|li|h[1-6]|blockquote|pre|t|br)\b/i.test(placeholder)) {
      return placeholder;
    }

    return placeholder.replace(/<[^>]+>/g, '');
  });
}

@Component({
  selector: 'app-template-editor',
  templateUrl: './template-editor.component.html',
  styleUrl: './template-editor.component.scss',
  standalone: false,
})
export class TemplateEditorComponent implements AfterViewInit, OnChanges, OnDestroy {
  private static tableBetterRegistered = false;

  @Input() html = '';
  @Output() htmlChange = new EventEmitter<string>();

  @ViewChild('editorHost', { static: true })
  private readonly editorHost!: ElementRef<HTMLDivElement>;

  @ViewChild('htmlEditor')
  private readonly htmlEditor?: ElementRef<HTMLTextAreaElement>;

  editorMode: 'visual' | 'html' = 'visual';
  htmlSource = '';
  private quill: any = null;
  private syncingFromInput = false;
  private readonly syncEditorDomAfterMouseup = () => {
    setTimeout(() => this.syncHtmlSourceFromEditorDom(), 0);
  };

  constructor(
    private readonly translateService: TranslateService,
  ) {}

  async ngAfterViewInit(): Promise<void> {
    const [{ default: Quill }, { default: QuillTableBetter }] = await Promise.all([
      import('quill'),
      import('quill-table-better'),
    ]);

    if (!TemplateEditorComponent.tableBetterRegistered) {
      const Parchment = Quill.import('parchment') as any;
      const Inline = Quill.import('blots/inline') as any;

      class TranslationBlot extends Inline {
        static blotName = 'translation';
        static tagName = 't';

        static create() {
          return super.create();
        }

        static formats() {
          return true;
        }
      }

      const SitmunTableEachAttribute = new Parchment.Attributor(
        'sitmun-table-each',
        'data-sitmun-each',
        { scope: Parchment.Scope.ANY },
      );
      Quill.register({
        'modules/table-better': QuillTableBetter,
        'formats/translation': TranslationBlot
      }, true);
      Quill.register(SitmunTableEachAttribute, true);
      TemplateEditorComponent.tableBetterRegistered = true;
    }

    this.quill = new Quill(this.editorHost.nativeElement, {
      theme: 'snow',
      modules: {
        table: false,
        toolbar: {
          container: [
            [{ header: [1, 2, 3, false] }],
            [{ font: [] }, { size: ['small', false, 'large', 'huge'] }],
            ['bold', 'italic', 'underline'],
            [{ color: [] }, { background: [] }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['table-better'],
            ['link', 'image'],
            ['translation'],
            ['clean'],
          ],
          handlers: {
            translation: () => {
              if (this.editorMode === 'visual') {
                const range = this.quill.getSelection(true);
                if (range) {
                  if (range.length > 0) {
                    this.quill.format('translation', true);
                  } else {
                    // Use insertEmbed or direct delta to avoid raw text escaping
                    this.quill.insertText(range.index, ' ', 'translation', true);
                    this.quill.setSelection(range.index + 1, 0);
                  }
                }
              } else if (this.editorMode === 'html' && this.htmlEditor) {
                const textarea = this.htmlEditor.nativeElement;
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const text = textarea.value;
                const selected = text.substring(start, end);
                const replacement = `<t>${selected}</t>`;

                // Save scroll position
                const scrollTop = textarea.scrollTop;

                textarea.value = text.substring(0, start) + replacement + text.substring(end);
                this.onHtmlSourceChanged(textarea.value);

                // Restore scroll and set selection
                textarea.scrollTop = scrollTop;
                const newPos = start + 3 + selected.length;
                textarea.setSelectionRange(newPos, newPos);
                textarea.focus();
              }
            }
          }
        },
        'table-better': {
          language: 'en_US',
          menus: ['column', 'row', 'merge', 'table', 'cell', 'wrap', 'copy', 'delete'],
          toolbarTable: true,
        },
        keyboard: {
          bindings: QuillTableBetter.keyboardBindings,
        },
      },
    });

    const toolbar = this.quill.getModule('toolbar');
    const translationButton = toolbar.container.querySelector('.ql-translation');
    if (translationButton) {
      translationButton.innerHTML = '<span style="font-weight: bold; font-size: 1.1em; color: #323232;"><span class="material-symbols-outlined">\n' +
        'translate\n' +
        '</span></span>';
      translationButton.title = this.translateService.instant('entity.task.template.translationTooltip');
    }

    this.loadHtmlIntoEditor(this.html || '');
    this.htmlSource = normalizeHandlebarsMarkup(this.html || '');
    document.addEventListener('mouseup', this.syncEditorDomAfterMouseup);
    this.quill.on('text-change', () => {
      if (this.syncingFromInput || !this.quill || this.editorMode !== 'visual') {
        return;
      }

      const currentHtml = this.getEditorHtml();
      const normalizedHtml = normalizeHandlebarsMarkup(currentHtml);
      this.htmlSource = normalizedHtml;
      this.htmlChange.emit(normalizedHtml);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.quill || !changes['html']) {
      return;
    }

    const nextHtml = normalizeHandlebarsMarkup(changes['html'].currentValue || '');
    this.htmlSource = nextHtml;

    if (this.editorMode === 'html') {
      return;
    }

    const currentHtml = normalizeHandlebarsMarkup(this.getEditorHtml());
    if (nextHtml === currentHtml) {
      return;
    }

    this.syncingFromInput = true;
    this.loadHtmlIntoEditor(nextHtml);
    this.syncingFromInput = false;
  }

  setEditorMode(mode: 'visual' | 'html'): void {
    if (mode === 'html') {
      if (this.quill) {
        this.syncHtmlSourceFromEditorDom();
      } else {
        this.htmlSource = normalizeHandlebarsMarkup(this.htmlSource || this.html || '');
      }
    }

    this.editorMode = mode;

    if (mode === 'visual' && this.quill) {
      this.syncingFromInput = true;
      this.loadHtmlIntoEditor(this.htmlSource);
      this.syncingFromInput = false;
    }
  }

  onHtmlSourceChanged(html: string): void {
    const normalizedHtml = normalizeHandlebarsMarkup(html);
    if (normalizedHtml === this.htmlSource) {
      return;
    }

    this.htmlSource = normalizedHtml;
    this.htmlChange.emit(normalizedHtml);
  }

  ngOnDestroy(): void {
    document.removeEventListener('mouseup', this.syncEditorDomAfterMouseup);
    this.quill?.off('text-change');
    this.quill = null;
  }

  private syncHtmlSourceFromEditorDom(): void {
    if (!this.quill || this.syncingFromInput || this.editorMode !== 'visual') {
      return;
    }

    const normalizedHtml = normalizeHandlebarsMarkup(this.getEditorHtml());
    if (normalizedHtml === this.htmlSource) {
      return;
    }

    this.htmlSource = normalizedHtml;
    this.htmlChange.emit(normalizedHtml);
  }

  private loadHtmlIntoEditor(html: string): void {
    if (!this.quill) {
      return;
    }

    const delta = this.quill.clipboard.convert({ html });
    this.quill.setContents([], 'silent');
    this.quill.updateContents(delta, 'silent');
  }

  private getEditorHtml(): string {
    if (!this.quill) {
      return '';
    }

    this.quill.getModule('table-better')?.hideTools?.();
    return this.quill.root.innerHTML;
  }
}
