import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { TranslateModule } from '@ngx-translate/core';

/**
 * Component for displaying image preview with dimensions and download functionality.
 * Handles both base64 data URIs and URL images.
 */
@Component({
    selector: 'app-image-preview',
    templateUrl: './image-preview.component.html',
    styleUrls: ['./image-preview.component.scss'],
  standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        TranslateModule
    ]
})
export class ImagePreviewComponent implements OnChanges, AfterViewInit {
  @Input() imageSource: string | null = null;
  @Input() imageName: string | null = null;
  @Input() previewId = 'imagePreview';
  @Input() showDownload = true;
  @Input() maxWidth = 80;
  @Input() maxHeight = 80;

  @ViewChild('previewImage', { static: false }) previewImageRef!: ElementRef<HTMLImageElement>;
  @ViewChild('previewContainer', { static: false }) previewContainerRef!: ElementRef<HTMLDivElement>;

  originalImageWidth: number | null = null;
  originalImageHeight: number | null = null;
  isVisible = false;

  ngAfterViewInit(): void {
    if (this.imageSource) {
      this.loadImage(this.imageSource);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['imageSource'] && this.previewImageRef) {
      this.loadImage(changes['imageSource'].currentValue);
    }
  }

  private loadImage(source: string | null): void {
    if (!this.previewImageRef || !this.previewContainerRef) {
      return;
    }

    const imgPreview = this.previewImageRef.nativeElement;
    const container = this.previewContainerRef.nativeElement;

    if (source) {
      // Reset dimensions before loading new image
      imgPreview.style.width = '';
      imgPreview.style.height = '';

      // Set up load handlers before setting src
      imgPreview.onload = () => {
        // Store original dimensions only if valid
        if (imgPreview.naturalWidth > 0 && imgPreview.naturalHeight > 0) {
          this.originalImageWidth = imgPreview.naturalWidth;
          this.originalImageHeight = imgPreview.naturalHeight;
          // Use original image dimensions
          imgPreview.style.width = imgPreview.naturalWidth + 'px';
          imgPreview.style.height = imgPreview.naturalHeight + 'px';
          container.hidden = false;
          this.isVisible = true;
        } else {
          this.originalImageWidth = null;
          this.originalImageHeight = null;
          container.hidden = true;
          this.isVisible = false;
        }
      };

      imgPreview.onerror = () => {
        // Hide preview if image fails to load
        this.originalImageWidth = null;
        this.originalImageHeight = null;
        container.hidden = true;
        this.isVisible = false;
      };

      imgPreview.src = source;

      // Handle case where image might already be cached
      if (imgPreview.complete && imgPreview.naturalWidth > 0 && imgPreview.naturalHeight > 0) {
        // Store original dimensions
        this.originalImageWidth = imgPreview.naturalWidth;
        this.originalImageHeight = imgPreview.naturalHeight;
        imgPreview.style.width = imgPreview.naturalWidth + 'px';
        imgPreview.style.height = imgPreview.naturalHeight + 'px';
        container.hidden = false;
        this.isVisible = true;
      }
    } else {
      // Reset dimensions when hiding
      imgPreview.style.width = '';
      imgPreview.style.height = '';
      this.originalImageWidth = null;
      this.originalImageHeight = null;
      container.hidden = true;
      this.isVisible = false;
    }
  }

  downloadImage(): void {
    if (!this.imageSource) {
      return;
    }

    const imageName = this.imageName || 'image';

    // Check if it's a base64 data URI
    if (this.imageSource.startsWith('data:')) {
      // Convert base64 to blob and download
      const byteString = atob(this.imageSource.split(',')[1]);
      const mimeString = this.imageSource.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = imageName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } else {
      // For URL images, create a link and trigger download
      const link = document.createElement('a');
      link.href = this.imageSource;
      link.download = imageName;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}

