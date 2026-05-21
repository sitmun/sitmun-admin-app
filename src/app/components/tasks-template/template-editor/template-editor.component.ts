import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild } from '@angular/core';

type VisualEditableElement = HTMLIFrameElement | HTMLImageElement;

type VisualEditableTagName = 'iframe' | 'img';

type SelectedVisualElementState = {
  tagName: VisualEditableTagName;
};

type ResizeOverlayState = {
  visible: boolean;
  tagName: VisualEditableTagName;
  top: number;
  left: number;
  width: number;
  height: number;
};

type ResizeSessionState = {
  startClientX: number;
  startClientY: number;
  startWidth: number;
  startHeight: number;
};

type TemplatePlaceholderKind = 'img' | 'iframe';

const TEMPLATE_PLACEHOLDER_ATTR = 'data-sitmun-template-placeholder';
const TEMPLATE_PLACEHOLDER_ORIGINAL_SRC_ATTR = 'data-sitmun-original-src';
const TEMPLATE_PLACEHOLDER_ORIGINAL_STYLE_ATTR = 'data-sitmun-original-style';
const TEMPLATE_PLACEHOLDER_WRAPPER_ATTR = 'data-sitmun-template-placeholder-wrapper';
const TEMPLATE_PLACEHOLDER_LABEL_ATTR = 'data-sitmun-template-placeholder-label';
const TEMPLATE_PLACEHOLDER_DEFAULT_WIDTH = 320;
const TEMPLATE_PLACEHOLDER_DEFAULT_HEIGHT = 180;
const TRANSPARENT_GIF_DATA_URL = 'data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=';

export function normalizeHandlebarsMarkup(html: string): string {
  return (html || '').replace(/\{\{[\s\S]*?}}/g, (placeholder) => {
    if (/<\/?(?:p|div|section|article|table|thead|tbody|tfoot|tr|td|th|ul|ol|li|h[1-6]|blockquote|pre|br)\b/i.test(placeholder)) {
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

  @ViewChild('visualSurface', { static: true })
  private readonly visualSurface!: ElementRef<HTMLDivElement>;

  editorMode: 'visual' | 'html' = 'visual';
  htmlSource = '';
  selectedVisualElement: SelectedVisualElementState | null = null;
  resizeOverlay: ResizeOverlayState | null = null;
  private quill: any = null;
  private selectedVisualDomElement: VisualEditableElement | null = null;
  private resizeSession: ResizeSessionState | null = null;
  private syncingFromInput = false;
  private overlayViewportListenersBound = false;
  private readonly syncEditorDomAfterMouseup = () => {
    setTimeout(() => this.syncHtmlSourceFromEditorDom(), 0);
  };
  private readonly onDocumentMouseMove = (event: MouseEvent) => {
    this.updateVisualResize(event);
  };
  private readonly onDocumentMouseUp = () => {
    this.endVisualResize();
  };
  private readonly onOverlayViewportChange = () => {
    if (!this.selectedVisualDomElement) {
      return;
    }

    this.refreshSelectedVisualOverlay();
  };

  async ngAfterViewInit(): Promise<void> {
    const [{ default: Quill }, { default: QuillTableBetter }] = await Promise.all([
      import('quill'),
      import('quill-table-better'),
    ]);

    if (!TemplateEditorComponent.tableBetterRegistered) {
      const Parchment = Quill.import('parchment') as any;
      const SitmunTableEachAttribute = new Parchment.Attributor(
        'sitmun-table-each',
        'data-sitmun-each',
        { scope: Parchment.Scope.ANY },
      );
      Quill.register({
        'modules/table-better': QuillTableBetter,
      }, true);
      Quill.register(SitmunTableEachAttribute, true);
      TemplateEditorComponent.tableBetterRegistered = true;
    }

    this.initializeQuill(Quill, QuillTableBetter);

    this.loadHtmlIntoEditor(this.html || '');
    this.htmlSource = normalizeHandlebarsMarkup(this.html || '');
    this.ensureOverlayViewportListeners();
    document.addEventListener('mouseup', this.syncEditorDomAfterMouseup);
    document.addEventListener('mousemove', this.onDocumentMouseMove);
    document.addEventListener('mouseup', this.onDocumentMouseUp);
    this.quill.on('text-change', () => {
      if (this.syncingFromInput || !this.quill || this.editorMode !== 'visual') {
        return;
      }

      const currentHtml = this.getEditorHtml();
      const normalizedHtml = normalizeHandlebarsMarkup(currentHtml);
      if (normalizedHtml !== currentHtml) {
        this.syncingFromInput = true;
        this.loadHtmlIntoEditor(normalizedHtml);
        this.syncingFromInput = false;
      }

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
      this.clearSelectedVisualElement();

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

  onEditorHostClick(event: MouseEvent): void {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      this.clearSelectedVisualElement();
      return;
    }

    const editableElement = this.resolveVisualEditableElement(target, event);
    if (editableElement instanceof HTMLIFrameElement || editableElement instanceof HTMLImageElement) {
      this.selectVisualElement(editableElement);
      return;
    }

    this.clearSelectedVisualElement();
  }

  onEditorHostKeydown(event: KeyboardEvent): void {
    if (!this.selectedVisualDomElement || !['Delete', 'Backspace'].includes(event.key)) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    this.removeSelectedVisualDomElement();
    this.clearSelectedVisualElement();
    this.syncHtmlSourceFromEditorDom();
  }

  selectVisualElement(element: VisualEditableElement): void {
    this.ensureOverlayViewportListeners();
    this.selectedVisualDomElement = element;
    this.selectedVisualElement = {
      tagName: element.tagName.toLowerCase() as VisualEditableTagName,
    };
    this.refreshSelectedVisualOverlay();
  }

  startVisualResize(event: MouseEvent): void {
    if (!this.selectedVisualDomElement || !this.resizeOverlay) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    this.resizeSession = {
      startClientX: event.clientX,
      startClientY: event.clientY,
      startWidth: this.resizeOverlay.width,
      startHeight: this.resizeOverlay.height,
    };
  }

  updateVisualResize(event: Pick<MouseEvent, 'clientX' | 'clientY'>): void {
    if (!this.selectedVisualDomElement || !this.resizeSession) {
      return;
    }

    const nextWidth = Math.max(40, Math.round(this.resizeSession.startWidth + (event.clientX - this.resizeSession.startClientX)));
    const nextHeight = Math.max(40, Math.round(this.resizeSession.startHeight + (event.clientY - this.resizeSession.startClientY)));

    this.applyDimensionsToSelectedElement(`${nextWidth}`, `${nextHeight}`);
    this.resizeOverlay = this.resizeOverlay
      ? {
        ...this.resizeOverlay,
        width: nextWidth,
        height: nextHeight,
      }
      : this.resizeOverlay;
  }

  endVisualResize(): void {
    if (!this.resizeSession) {
      return;
    }

    this.resizeSession = null;
    this.refreshSelectedVisualOverlay();
    this.syncHtmlSourceFromEditorDom();
  }

  ngOnDestroy(): void {
    this.removeOverlayViewportListeners();
    document.removeEventListener('mouseup', this.syncEditorDomAfterMouseup);
    document.removeEventListener('mousemove', this.onDocumentMouseMove);
    document.removeEventListener('mouseup', this.onDocumentMouseUp);
    this.quill?.off('text-change');
    this.quill = null;
  }

  refreshSelectedVisualOverlay(): void {
    if (!this.selectedVisualDomElement || !this.visualSurface?.nativeElement) {
      this.resizeOverlay = null;
      return;
    }

    const surfaceRect = this.visualSurface.nativeElement.getBoundingClientRect();
    const elementRect = this.selectedVisualDomElement.getBoundingClientRect();
    const appliedWidth = this.readAppliedElementDimension(this.selectedVisualDomElement, 'width');
    const appliedHeight = this.readAppliedElementDimension(this.selectedVisualDomElement, 'height');
    const overlayWidth = Math.round(this.resolveOverlayDimension(elementRect.width, appliedWidth, this.selectedVisualDomElement));
    const overlayHeight = Math.round(this.resolveOverlayDimension(elementRect.height, appliedHeight, this.selectedVisualDomElement));
    this.resizeOverlay = {
      visible: true,
      tagName: this.selectedVisualElement?.tagName || (this.selectedVisualDomElement.tagName.toLowerCase() as VisualEditableTagName),
      top: Math.round(elementRect.top - surfaceRect.top + this.visualSurface.nativeElement.scrollTop),
      left: Math.round(elementRect.left - surfaceRect.left + this.visualSurface.nativeElement.scrollLeft),
      width: overlayWidth,
      height: overlayHeight,
    };
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

  private clearSelectedVisualElement(): void {
    this.resizeSession = null;
    this.selectedVisualDomElement = null;
    this.selectedVisualElement = null;
    this.resizeOverlay = null;
  }

  private loadHtmlIntoEditor(html: string): void {
    if (!this.quill) {
      return;
    }

    this.clearSelectedVisualElement();

    const delta = this.quill.clipboard.convert({ html });
    this.quill.setContents([], 'silent');
    this.quill.updateContents(delta, 'silent');
    if (this.quill.root?.querySelectorAll) {
      this.applyEditorOnlyTemplatePlaceholders(this.quill.root);
    }
  }

  private resolveVisualEditableElement(target: HTMLElement, event: MouseEvent): VisualEditableElement | null {
    const directMatch = target.closest('iframe, img');
    if (directMatch instanceof HTMLIFrameElement || directMatch instanceof HTMLImageElement) {
      return directMatch;
    }

    return this.resolveIframeAtPoint(event.clientX, event.clientY);
  }

  private resolveIframeAtPoint(clientX: number, clientY: number): HTMLIFrameElement | null {
    if (!Number.isFinite(clientX) || !Number.isFinite(clientY)) {
      return null;
    }

    const root = this.quill?.root || this.editorHost?.nativeElement;
    const iframes = Array.from(root?.querySelectorAll?.('iframe') || []) as HTMLIFrameElement[];
    return iframes.reverse().find((iframe) => {
      const rect = iframe.getBoundingClientRect();
      return clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;
    }) || null;
  }

  private ensureOverlayViewportListeners(): void {
    if (this.overlayViewportListenersBound || !this.editorHost?.nativeElement || !this.visualSurface?.nativeElement) {
      return;
    }

    this.editorHost.nativeElement.addEventListener('scroll', this.onOverlayViewportChange);
    this.visualSurface.nativeElement.addEventListener('scroll', this.onOverlayViewportChange);
    window.addEventListener('resize', this.onOverlayViewportChange);
    this.overlayViewportListenersBound = true;
  }

  private removeOverlayViewportListeners(): void {
    if (!this.overlayViewportListenersBound) {
      return;
    }

    this.editorHost?.nativeElement.removeEventListener('scroll', this.onOverlayViewportChange);
    this.visualSurface?.nativeElement.removeEventListener('scroll', this.onOverlayViewportChange);
    window.removeEventListener('resize', this.onOverlayViewportChange);
    this.overlayViewportListenersBound = false;
  }

  private initializeQuill(Quill: any, QuillTableBetter: any): void {
    this.quill = new Quill(this.editorHost.nativeElement, {
      theme: 'snow',
      modules: this.buildQuillModules(QuillTableBetter),
    });
  }

  private buildQuillModules(QuillTableBetter: any): Record<string, unknown> {
    return {
      table: false,
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        [{ font: [] }, { size: ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline'],
        [{ color: [] }, { background: [] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['table-better'],
        ['link', 'image'],
        ['clean'],
      ],
      'table-better': {
        language: 'en_US',
        menus: ['column', 'row', 'merge', 'table', 'cell', 'wrap', 'copy', 'delete'],
        toolbarTable: true,
      },
      keyboard: {
        bindings: QuillTableBetter.keyboardBindings,
      },
    };
  }

  private getEditorHtml(): string {
    if (!this.quill) {
      return '';
    }

    this.quill.getModule('table-better')?.hideTools?.();
    const rootClone = this.cloneEditorRoot(this.quill.root);
    this.restoreEditorOnlyTemplatePlaceholders(rootClone);
    return rootClone.innerHTML;
  }

  private updateElementDimensionAttribute(element: VisualEditableElement, attribute: 'width' | 'height', value: string): void {
    const normalizedValue = value.trim();
    if (normalizedValue) {
      element.setAttribute(attribute, normalizedValue);
      return;
    }

    element.removeAttribute(attribute);
  }

  private applyDimensionsToSelectedElement(width: string, height: string): void {
    if (!this.selectedVisualDomElement) {
      return;
    }

    this.updateElementDimensionAttribute(this.selectedVisualDomElement, 'width', width);
    this.updateElementDimensionAttribute(this.selectedVisualDomElement, 'height', height);

    if (this.selectedVisualDomElement instanceof HTMLIFrameElement || this.selectedVisualDomElement instanceof HTMLImageElement) {
      this.updateElementDimensionStyle(this.selectedVisualDomElement, 'width', width);
      this.updateElementDimensionStyle(this.selectedVisualDomElement, 'height', height);
    }

    this.syncImagePlaceholderWrapperDimensions(this.selectedVisualDomElement, width, height);

    this.selectedVisualElement = {
      tagName: this.selectedVisualDomElement.tagName.toLowerCase() as VisualEditableTagName,
    };
  }

  private updateElementDimensionStyle(element: VisualEditableElement, property: 'width' | 'height', value: string): void {
    const numericValue = Number.parseInt(value.trim(), 10);
    if (Number.isFinite(numericValue) && numericValue > 0) {
      element.style[property] = `${numericValue}px`;
      return;
    }

    element.style.removeProperty(property);
    if (!element.getAttribute('style')) {
      element.removeAttribute('style');
    }
  }

  private readAppliedElementDimension(element: VisualEditableElement, dimension: 'width' | 'height'): number | null {
    const styleValue = this.readStylePixelDimension(element.style[dimension] || '');
    if (styleValue) {
      return styleValue;
    }

    const attributeValue = Number.parseInt(element.getAttribute(dimension) || '', 10);
    return Number.isFinite(attributeValue) && attributeValue > 0 ? attributeValue : null;
  }

  private resolveOverlayDimension(renderedDimension: number, appliedDimension: number | undefined, element: VisualEditableElement): number {
    if (element instanceof HTMLImageElement && this.isTemplateImageSource(element) && appliedDimension && renderedDimension < appliedDimension) {
      return appliedDimension;
    }

    if (renderedDimension > 24 || !appliedDimension) {
      return renderedDimension;
    }

    return appliedDimension;
  }

  private isTemplateImageSource(element: HTMLImageElement): boolean {
    return element.getAttribute('src')?.includes('{{') || false;
  }

  private applyEditorOnlyTemplatePlaceholders(root: ParentNode): void {
    const editableElements = Array.from(root.querySelectorAll('img, iframe')) as VisualEditableElement[];
    editableElements.forEach((element) => {
      if (element.hasAttribute(TEMPLATE_PLACEHOLDER_ATTR)) {
        return;
      }

      const originalSrc = element.getAttribute('src');
      if (!this.isUnresolvedTemplateSource(originalSrc)) {
        return;
      }

      if (element instanceof HTMLImageElement) {
        this.applyImageTemplatePlaceholder(element, originalSrc);
        return;
      }

      if (element instanceof HTMLIFrameElement) {
        this.applyIframeTemplatePlaceholder(element, originalSrc);
      }
    });
  }

  private restoreEditorOnlyTemplatePlaceholders(root: ParentNode): void {
    const editableElements = Array.from(root.querySelectorAll(`img[${TEMPLATE_PLACEHOLDER_ATTR}], iframe[${TEMPLATE_PLACEHOLDER_ATTR}]`)) as VisualEditableElement[];
    editableElements.forEach((element) => {
      const originalSrc = element.getAttribute(TEMPLATE_PLACEHOLDER_ORIGINAL_SRC_ATTR);
      if (!originalSrc) {
        return;
      }

      element.setAttribute('src', originalSrc);
      element.removeAttribute(TEMPLATE_PLACEHOLDER_ATTR);
      element.removeAttribute(TEMPLATE_PLACEHOLDER_ORIGINAL_SRC_ATTR);
      this.restoreEditorOnlyPlaceholderStyles(element);
      this.unwrapImageTemplatePlaceholder(element);
      if (element instanceof HTMLIFrameElement) {
        element.removeAttribute('srcdoc');
      }
    });
  }

  private applyImageTemplatePlaceholder(element: HTMLImageElement, originalSrc: string): void {
    this.storeOriginalEditorPlaceholderStyle(element);
    element.setAttribute(TEMPLATE_PLACEHOLDER_ATTR, 'img');
    element.setAttribute(TEMPLATE_PLACEHOLDER_ORIGINAL_SRC_ATTR, originalSrc);
    element.setAttribute('src', TRANSPARENT_GIF_DATA_URL);
    this.wrapImageTemplatePlaceholder(element);
  }

  private applyIframeTemplatePlaceholder(element: HTMLIFrameElement, originalSrc: string): void {
    this.storeOriginalEditorPlaceholderStyle(element);
    element.setAttribute(TEMPLATE_PLACEHOLDER_ATTR, 'iframe');
    element.setAttribute(TEMPLATE_PLACEHOLDER_ORIGINAL_SRC_ATTR, originalSrc);
    element.setAttribute('src', 'about:blank');
    element.setAttribute('srcdoc', this.buildIframeTemplatePlaceholderMarkup(element));
  }

  private isUnresolvedTemplateSource(src: string | null): boolean {
    return src?.includes('{{') || false;
  }

  private buildImageTemplatePlaceholderSrc(element: HTMLImageElement): string {
    const label = this.resolveTemplatePlaceholderLabel(element, 'Imagen binaria');
    const width = this.readPlaceholderDimension(element, 'width', TEMPLATE_PLACEHOLDER_DEFAULT_WIDTH);
    const height = this.readPlaceholderDimension(element, 'height', TEMPLATE_PLACEHOLDER_DEFAULT_HEIGHT);
    return this.buildSvgPlaceholderDataUrl(label, width, height, 'image');
  }

  private buildIframeTemplatePlaceholderMarkup(element: HTMLIFrameElement): string {
    const label = this.resolveTemplatePlaceholderLabel(element, 'Documento embebido');
    return `<!doctype html><html><body style="margin:0;"><div style="width:100%;height:100%;box-sizing:border-box;display:flex;align-items:center;justify-content:center;padding:12px;border:1px dashed #94a3b8;background:#f8fafc;color:#475569;font:600 14px/1.4 Arial, sans-serif;text-align:center;">${this.escapeHtml(label)}</div></body></html>`;
  }

  private buildSvgPlaceholderDataUrl(label: string, width: number, height: number, kind: string): string {
    const safeLabel = this.escapeHtml(label);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="100%" height="100%" fill="#f8fafc" stroke="#94a3b8" stroke-dasharray="6 4"/><text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" font-size="12" font-weight="600" fill="#475569">${safeLabel}</text><text x="50%" y="calc(50% + 18px)" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" font-size="12" fill="#64748b">${kind}</text></svg>`;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }

  private resolveTemplatePlaceholderLabel(element: HTMLElement, fallback: string): string {
    return element.getAttribute('alt')
      || element.getAttribute('title')
      || element.getAttribute('aria-label')
      || element.getAttribute('name')
      || fallback;
  }

  private readPlaceholderDimension(element: VisualEditableElement, dimension: 'width' | 'height', fallback: number): number {
    return this.readAppliedElementDimension(element, dimension) || fallback;
  }

  private escapeHtml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  private cloneEditorRoot(root: { innerHTML?: string; cloneNode?: (deep?: boolean) => Node; }): HTMLElement {
    if (typeof root?.cloneNode === 'function') {
      return root.cloneNode(true) as HTMLElement;
    }

    const container = document.createElement('div');
    container.innerHTML = root?.innerHTML || '';
    return container;
  }

  private storeOriginalEditorPlaceholderStyle(element: VisualEditableElement): void {
    element.setAttribute(TEMPLATE_PLACEHOLDER_ORIGINAL_STYLE_ATTR, element.getAttribute('style') || '');
  }

  private wrapImageTemplatePlaceholder(element: HTMLImageElement): void {
    const wrapper = document.createElement('span');
    const label = document.createElement('span');
    const width = this.readPlaceholderDimension(element, 'width', TEMPLATE_PLACEHOLDER_DEFAULT_WIDTH);
    const height = this.readPlaceholderDimension(element, 'height', TEMPLATE_PLACEHOLDER_DEFAULT_HEIGHT);

    wrapper.setAttribute(TEMPLATE_PLACEHOLDER_WRAPPER_ATTR, 'img');
    wrapper.setAttribute('style', [
      'position: relative',
      'display: inline-block',
      'line-height: 0',
      `width: ${width}px`,
      `height: ${height}px`,
      'max-width: 100%',
      'background: #f8fafc',
      'border: 1px dashed #94a3b8',
      'box-sizing: border-box',
      'overflow: hidden',
    ].join('; '));

    label.setAttribute(TEMPLATE_PLACEHOLDER_LABEL_ATTR, 'img');
    label.setAttribute('style', [
      'position: absolute',
      'inset: 0',
      'display: flex',
      'align-items: center',
      'justify-content: center',
      'padding: 12px',
      'box-sizing: border-box',
      'text-align: center',
      'color: #475569',
      'font-family: Arial, sans-serif',
      'font-size: 12px',
      'font-weight: 600',
      'line-height: 1.4',
      'pointer-events: none',
      'word-break: break-word',
    ].join('; '));
    label.textContent = this.resolveTemplatePlaceholderLabel(element, 'Imagen binaria');

    const parent = element.parentNode;
    if (!parent) {
      return;
    }

    parent.insertBefore(wrapper, element);
    wrapper.appendChild(element);
    wrapper.appendChild(label);

    element.style.display = 'block';
    element.style.width = '100%';
    element.style.height = '100%';
    element.style.opacity = '0';
  }

  private unwrapImageTemplatePlaceholder(element: VisualEditableElement): void {
    if (!(element instanceof HTMLImageElement)) {
      return;
    }

    const wrapper = element.parentElement;
    if (!wrapper?.hasAttribute(TEMPLATE_PLACEHOLDER_WRAPPER_ATTR)) {
      return;
    }

    wrapper.replaceWith(element);
  }

  private removeSelectedVisualDomElement(): void {
    if (!this.selectedVisualDomElement) {
      return;
    }

    const imageWrapper = this.selectedVisualDomElement instanceof HTMLImageElement
      ? this.selectedVisualDomElement.parentElement
      : null;

    if (imageWrapper?.hasAttribute(TEMPLATE_PLACEHOLDER_WRAPPER_ATTR)) {
      imageWrapper.remove();
      return;
    }

    this.selectedVisualDomElement.remove();
  }

  private syncImagePlaceholderWrapperDimensions(element: VisualEditableElement, width: string, height: string): void {
    if (!(element instanceof HTMLImageElement)) {
      return;
    }

    const wrapper = element.parentElement;
    if (!wrapper?.hasAttribute(TEMPLATE_PLACEHOLDER_WRAPPER_ATTR)) {
      return;
    }

    this.updateWrapperPlaceholderDimensionStyle(wrapper, 'width', width);
    this.updateWrapperPlaceholderDimensionStyle(wrapper, 'height', height);
  }

  private updateWrapperPlaceholderDimensionStyle(wrapper: HTMLElement, property: 'width' | 'height', value: string): void {
    const numericValue = Number.parseInt(value.trim(), 10);
    if (Number.isFinite(numericValue) && numericValue > 0) {
      wrapper.style[property] = `${numericValue}px`;
    }
  }

  private restoreEditorOnlyPlaceholderStyles(element: VisualEditableElement): void {
    const originalStyle = element.getAttribute(TEMPLATE_PLACEHOLDER_ORIGINAL_STYLE_ATTR);
    element.removeAttribute(TEMPLATE_PLACEHOLDER_ORIGINAL_STYLE_ATTR);

    if (originalStyle) {
      element.setAttribute('style', originalStyle);
      return;
    }

    element.removeAttribute('style');
    if (!element.getAttribute('style')) {
      element.removeAttribute('style');
    }
  }

  private readStylePixelDimension(styleValue: string): number | null {
    const normalizedValue = styleValue.trim().toLowerCase();
    if (!normalizedValue.endsWith('px')) {
      return null;
    }

    const numericValue = Number.parseInt(normalizedValue, 10);
    return Number.isFinite(numericValue) && numericValue > 0 ? numericValue : null;
  }
}
