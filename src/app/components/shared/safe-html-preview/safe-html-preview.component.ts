import { AfterViewInit, Component, ElementRef, Input, OnChanges, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-safe-html-preview',
  templateUrl: './safe-html-preview.component.html',
  styleUrl: './safe-html-preview.component.scss',
  standalone: false,
})
export class SafeHtmlPreviewComponent implements AfterViewInit, OnChanges {
  @Input() html = '';

  @ViewChild('previewFrame') private previewFrame?: ElementRef<HTMLIFrameElement>;

  constructor(private readonly renderer: Renderer2) {}

  ngAfterViewInit(): void {
    this.updateSrcdoc();
  }

  ngOnChanges(): void {
    this.updateSrcdoc();
  }

  private updateSrcdoc(): void {
    if (this.previewFrame) {
      this.renderer.setProperty(this.previewFrame.nativeElement, 'srcdoc', this.html || '');
    }
  }
}
