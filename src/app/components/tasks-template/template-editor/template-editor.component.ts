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
    this.selectedVisualDomElement.remove();
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
    return this.quill.root.innerHTML;
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
    const styleValue = Number.parseInt(element.style[dimension] || '', 10);
    if (Number.isFinite(styleValue) && styleValue > 0) {
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
}
