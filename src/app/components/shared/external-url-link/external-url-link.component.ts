import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

import { toSafeHttpUrl } from './http-url.util';

@Component({
  selector: 'app-external-url-link',
  template: `
    @if (safeUrl) {
      <a
        mat-icon-button
        [href]="safeUrl"
        target="_blank"
        rel="noopener"
        [matTooltip]="'common.url.openNewTab' | translate"
        [attr.aria-label]="'common.url.openNewTab' | translate">
        <mat-icon>open_in_new</mat-icon>
      </a>
    }
    `,
  styles: [`
    :host {
      display: inline-flex;
      align-items: center;
    }
  `],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class ExternalUrlLinkComponent {
  private rawUrl: string | null | undefined;

  @Input()
  set url(value: string | null | undefined) {
    this.rawUrl = value;
  }

  get url(): string | null | undefined {
    return this.rawUrl;
  }

  get safeUrl(): string | null {
    return toSafeHttpUrl(this.rawUrl);
  }
}
