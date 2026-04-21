import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild } from '@angular/core';

export function normalizeHandlebarsMarkup(html: string): string {
  return (html || '').replace(/\{\{[\s\S]*?}}/g, (placeholder) => placeholder.replace(/<[^>]+>/g, ''));
}

@Component({
  selector: 'app-template-editor',
  templateUrl: './template-editor.component.html',
  styleUrl: './template-editor.component.scss',
  standalone: false,
})
export class TemplateEditorComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() html = '';
  @Output() htmlChange = new EventEmitter<string>();

  @ViewChild('editorHost', { static: true })
  private readonly editorHost!: ElementRef<HTMLDivElement>;

  editorMode: 'visual' | 'html' = 'visual';
  htmlSource = '';
  private quill: any = null;
  private syncingFromInput = false;

  async ngAfterViewInit(): Promise<void> {
    const { default: Quill } = await import('quill');

    this.quill = new Quill(this.editorHost.nativeElement, {
      theme: 'snow',
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ['bold', 'italic', 'underline'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link', 'image'],
          ['clean'],
        ],
      },
    });

    this.quill.clipboard.dangerouslyPasteHTML(this.html || '');
    this.htmlSource = normalizeHandlebarsMarkup(this.html || '');
    this.quill.on('text-change', () => {
      if (this.syncingFromInput || !this.quill || this.editorMode !== 'visual') {
        return;
      }

      const normalizedHtml = normalizeHandlebarsMarkup(this.quill.root.innerHTML);
      if (normalizedHtml !== this.quill.root.innerHTML) {
        this.syncingFromInput = true;
        this.quill.clipboard.dangerouslyPasteHTML(normalizedHtml);
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

    if (nextHtml === this.quill.root.innerHTML) {
      return;
    }

    this.syncingFromInput = true;
    this.quill.clipboard.dangerouslyPasteHTML(nextHtml);
    this.syncingFromInput = false;
  }

  setEditorMode(mode: 'visual' | 'html'): void {
    this.editorMode = mode;
    this.htmlSource = normalizeHandlebarsMarkup(this.htmlSource || this.html || this.quill?.root?.innerHTML || '');

    if (mode === 'visual' && this.quill) {
      this.syncingFromInput = true;
      this.quill.clipboard.dangerouslyPasteHTML(this.htmlSource);
      this.syncingFromInput = false;
    }
  }

  onHtmlSourceChanged(html: string): void {
    const normalizedHtml = normalizeHandlebarsMarkup(html);
    this.htmlSource = normalizedHtml;
    this.htmlChange.emit(normalizedHtml);
  }

  ngOnDestroy(): void {
    this.quill?.off('text-change');
    this.quill = null;
  }
}
