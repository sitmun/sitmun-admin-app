import {Directive, ElementRef, HostListener, Input, OnInit} from '@angular/core';

@Directive({
  selector: '[appUrlInput]'
})
export class UrlInputDirective implements OnInit {
  @Input() appUrlInput: string = '';

  constructor(private el: ElementRef) {
  }

  ngOnInit() {
    this.updateDisplay();
  }

  @HostListener('input', ['$event'])
  onInput(event: any) {
    this.updateDisplay();
  }

  @HostListener('blur')
  onBlur() {
    this.updateDisplay();
  }

  @HostListener('focus')
  onFocus() {
    this.updateDisplay();
  }

  @HostListener('click', ['$event'])
  onClick(event: any) {
    const input = this.el.nativeElement as HTMLInputElement;
    const value = input.value;

    if (this.isUrl(value)) {
      // Open URL in new tab
      window.open(value, '_blank');
      event.preventDefault();
      event.stopPropagation();
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: any) {
    const input = this.el.nativeElement as HTMLInputElement;
    const value = input.value;

    // Open URL on Enter key if it's a valid URL
    if (event.key === 'Enter' && this.isUrl(value)) {
      window.open(value, '_blank');
      event.preventDefault();
      event.stopPropagation();
    }
  }

  private isUrl(value: string): boolean {
    if (!value || typeof value !== 'string') return false;
    try {
      const url = new URL(value);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  }

  private updateDisplay() {
    const input = this.el.nativeElement as HTMLInputElement;
    const value = input.value;

    if (this.isUrl(value)) {
      // Add visual indicator that this is a URL
      input.style.color = '#007bff';
      input.style.textDecoration = 'underline';
      input.style.cursor = 'pointer';

      // Add a small indicator icon if possible
      const parent = input.parentElement;
      if (parent) {
        // Remove existing icon if any
        const existingIcon = parent.querySelector('.url-indicator');
        if (existingIcon) {
          existingIcon.remove();
        }

        // Add new icon
        const icon = document.createElement('span');
        icon.className = 'url-indicator';
        icon.innerHTML = ' ↗';
        icon.style.color = '#007bff';
        icon.style.fontSize = '0.8em';
        icon.style.marginLeft = '4px';
        icon.style.opacity = '0.7';
        icon.style.position = 'absolute';
        icon.style.right = '8px';
        icon.style.top = '50%';
        icon.style.transform = 'translateY(-50%)';
        icon.style.pointerEvents = 'none';

        parent.style.position = 'relative';
        parent.appendChild(icon);
      }
    } else {
      // Reset styling
      input.style.color = '';
      input.style.textDecoration = '';
      input.style.cursor = '';

      // Remove icon
      const parent = input.parentElement;
      if (parent) {
        const existingIcon = parent.querySelector('.url-indicator');
        if (existingIcon) {
          existingIcon.remove();
        }
      }
    }
  }
}
