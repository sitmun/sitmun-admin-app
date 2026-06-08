import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
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
  @Input() targetWidth: number | null = null;
  @Input() targetHeight: number | null = null;
  @Input() imageState: 'uploaded' | 'stored' | null = null;

  @ViewChild('previewImage', { static: false }) previewImageRef!: ElementRef<HTMLImageElement>;
  imageWidth: number | null = null;
  imageHeight: number | null = null;
  isVisible = false;

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    if (this.imageSource) {
      // Avoid NG0100 by not flipping template-bound visibility during the same view-init check cycle.
      queueMicrotask(() => this.loadImage(this.imageSource));
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['imageSource'] && this.previewImageRef) {
      this.loadImage(changes['imageSource'].currentValue);
    }
  }

  private setVisibleDeferred(visible: boolean): void {
    queueMicrotask(() => {
      this.isVisible = visible;
      this.cdr.markForCheck();
    });
  }

  private loadImage(source: string | null): void {
    if (!this.previewImageRef) {
      return;
    }

    const imgPreview = this.previewImageRef.nativeElement;

    if (source) {
      // Reset dimensions before loading new image
      imgPreview.style.width = '';
      imgPreview.style.height = '';

      // Set up load handlers before setting src
      imgPreview.onload = () => {
        // Store loaded image dimensions only if valid.
        if (imgPreview.naturalWidth > 0 && imgPreview.naturalHeight > 0) {
          this.imageWidth = imgPreview.naturalWidth;
          this.imageHeight = imgPreview.naturalHeight;
          // Use intrinsic dimensions, constrained by max-width/max-height styles.
          imgPreview.style.width = imgPreview.naturalWidth + 'px';
          imgPreview.style.height = imgPreview.naturalHeight + 'px';
          this.setVisibleDeferred(true);
        } else {
          this.imageWidth = null;
          this.imageHeight = null;
          this.setVisibleDeferred(false);
        }
      };

      imgPreview.onerror = () => {
        // Hide preview if image fails to load
        this.imageWidth = null;
        this.imageHeight = null;
        this.setVisibleDeferred(false);
      };

      imgPreview.src = source;

      // Handle case where image might already be cached
      if (imgPreview.complete && imgPreview.naturalWidth > 0 && imgPreview.naturalHeight > 0) {
        this.imageWidth = imgPreview.naturalWidth;
        this.imageHeight = imgPreview.naturalHeight;
        imgPreview.style.width = imgPreview.naturalWidth + 'px';
        imgPreview.style.height = imgPreview.naturalHeight + 'px';
        this.setVisibleDeferred(true);
      }
    } else {
      // Reset dimensions when hiding
      imgPreview.style.width = '';
      imgPreview.style.height = '';
      this.imageWidth = null;
      this.imageHeight = null;
      this.setVisibleDeferred(false);
    }
  }

  get imageFormat(): string | null {
    if (this.imageSource?.startsWith('data:')) {
      const mime = this.imageSource.split(';', 1)[0].split(':', 2)[1];
      return mime?.split('/')[1]?.toUpperCase() ?? null;
    }
    const name = this.imageName || this.imageSource;
    const extension = name?.match(/\.([a-z0-9]+)(?:[?#].*)?$/i)?.[1];
    return extension ? extension.toUpperCase() : null;
  }

  get isUploadedImage(): boolean {
    if (this.imageState) {
      return this.imageState === 'uploaded';
    }
    return this.imageSource?.startsWith('data:') ?? false;
  }

  get imageInfoKey(): string {
    return this.isUploadedImage
      ? 'entity.tree.uploadedImageInfo'
      : 'entity.tree.storedImageInfo';
  }

  get imageDimensionsKey(): string {
    return this.isUploadedImage
      ? 'entity.tree.uploadedImageDimensions'
      : 'entity.tree.storedImageDimensions';
  }

  get hasTargetSize(): boolean {
    return this.targetWidth != null && this.targetHeight != null;
  }

  get uploadResizeHintKey(): string | null {
    if (!this.isUploadedImage || !this.imageWidth || !this.imageHeight || !this.hasTargetSize) {
      return null;
    }
    return this.imageWidth === this.targetWidth && this.imageHeight === this.targetHeight
      ? 'entity.tree.uploadedImageMatchesTarget'
      : 'entity.tree.uploadedImageWillBeResized';
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

