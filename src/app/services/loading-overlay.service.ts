import { Injectable } from '@angular/core';

export interface LoadingOverlayOptions {
  message?: string;
  spinnerSize?: number;
  backdropOpacity?: number;
}

/**
 * Service to show/hide a global loading overlay
 */
@Injectable({
  providedIn: 'root'
})
export class LoadingOverlayService {
  private overlays: HTMLElement[] = [];

  /**
   * Shows a global loading overlay with spinner
   * @param options Configuration options
   * @returns Reference to the overlay element
   */
  show(options: LoadingOverlayOptions = {}): HTMLElement {
    const {
      message = 'Loading...',
      spinnerSize = 50,
      backdropOpacity = 0.5
    } = options;

    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, ${backdropOpacity});
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    `;

    const container = document.createElement('div');
    container.style.cssText = `
      display: flex;
      flex-direction: column;
      align-items: center;
    `;

    const spinner = this.createSpinnerElement(spinnerSize, {
      borderColor: 'rgba(255, 255, 255, 0.3)',
      spinnerColor: 'white'
    });

    this.ensureSpinAnimation();

    const text = document.createElement('div');
    text.textContent = message;
    text.style.cssText = `
      color: white;
      margin-top: 16px;
      font-size: 14px;
      font-family: Roboto, sans-serif;
    `;

    container.appendChild(spinner);
    container.appendChild(text);
    overlay.appendChild(container);
    document.body.appendChild(overlay);

    this.overlays.push(overlay);
    return overlay;
  }

  /**
   * Hides a specific loading overlay
   * @param overlay The overlay element to hide
   */
  hide(overlay: HTMLElement): void {
    if (overlay && overlay.parentNode) {
      overlay.parentNode.removeChild(overlay);
      this.overlays = this.overlays.filter(o => o !== overlay);
    }
  }

  /**
   * Hides all loading overlays
   */
  hideAll(): void {
    this.overlays.forEach(overlay => {
      if (overlay && overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
    });
    this.overlays = [];
  }

  /**
   * Creates a spinner DOM element
   * @param size Spinner diameter in pixels
   * @param options Color options
   * @returns HTML div element with spinner styles
   */
  private createSpinnerElement(
    size: number,
    options: {
      borderColor: string;
      spinnerColor: string;
    }
  ): HTMLDivElement {
    const spinner = document.createElement('div');
    spinner.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      border: 4px solid ${options.borderColor};
      border-top-color: ${options.spinnerColor};
      border-radius: 50%;
      animation: spin 1s linear infinite;
    `;
    return spinner;
  }

  /**
   * Ensures spin animation is added to document
   */
  private ensureSpinAnimation(): void {
    if (!document.getElementById('loading-overlay-spin-animation')) {
      const style = document.createElement('style');
      style.id = 'loading-overlay-spin-animation';
      style.textContent = `
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
    }
  }

  /**
   * Returns HTML template for spinner overlay
   * Used by AG Grid and other components that need consistent spinner
   * @param options Configuration options
   * @returns HTML string for spinner overlay
   */
  static getSpinnerTemplate(options: {
    spinnerSize?: number;
    backdropOpacity?: number;
    borderColor?: string;
    spinnerColor?: string;
  } = {}): string {
    const {
      spinnerSize = 50,
      backdropOpacity = 0.32,
      borderColor = 'rgba(255, 255, 255, 0.3)',
      spinnerColor = 'white'
    } = options;

    return `
      <div style="display: flex; 
                  align-items: center; 
                  justify-content: center; 
                  height: 100%; 
                  background: rgba(0, 0, 0, ${backdropOpacity});">
        <div style="width: ${spinnerSize}px; 
                    height: ${spinnerSize}px; 
                    border: 4px solid ${borderColor}; 
                    border-top-color: ${spinnerColor}; 
                    border-radius: 50%; 
                    animation: spin 1s linear infinite;">
        </div>
      </div>
      <style>
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      </style>
    `;
  }

  /**
   * Wraps an async operation with loading overlay
   * @param operation The async operation to execute
   * @param options Loading overlay options
   * @returns Promise resolving to operation result
   */
  async wrap<T>(
    operation: () => Promise<T>,
    options?: LoadingOverlayOptions
  ): Promise<T> {
    const overlay = this.show(options);
    try {
      return await operation();
    } finally {
      this.hide(overlay);
    }
  }
}

