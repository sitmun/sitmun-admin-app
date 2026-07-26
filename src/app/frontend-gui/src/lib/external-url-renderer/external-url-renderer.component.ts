import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { toSafeHttpUrl } from '@app/components/shared/external-url-link/http-url.util';

@Component({
  selector: 'app-external-url-renderer',
  template: `
    <ng-container *ngIf="editable; else readOnlyLink">
      <div class="external-url-cell external-url-cell--editable">
        <span class="external-url-text">{{ displayValue }}</span>
        <a *ngIf="safeUrl"
           [href]="safeUrl"
           target="_blank"
           rel="noopener"
           class="external-url-open-link"
           [matTooltip]="'common.url.openNewTab' | translate"
           [attr.aria-label]="accessibleLabel"
           (click)="$event.stopPropagation()">
          <mat-icon aria-hidden="true">open_in_new</mat-icon>
        </a>
      </div>
    </ng-container>
    <ng-template #readOnlyLink>
      <a *ngIf="safeUrl; else plainValue"
         [href]="safeUrl"
         target="_blank"
         rel="noopener"
         class="url-link external-url-cell"
         [matTooltip]="'common.url.openNewTab' | translate"
         [attr.aria-label]="accessibleLabel"
         [attr.title]="displayValue">
        <span class="external-url-text">{{ displayValue }}</span>
        <mat-icon aria-hidden="true">open_in_new</mat-icon>
      </a>
      <ng-template #plainValue>
        <span class="external-url-plain">{{ displayValue }}</span>
      </ng-template>
    </ng-template>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      min-width: 0;
    }

    .external-url-cell {
      display: inline-flex;
      align-items: center;
      gap: 2px;
      max-width: 100%;
      min-width: 0;
      text-decoration: none;
    }

    .external-url-cell--editable {
      width: 100%;
    }

    .external-url-text {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .external-url-cell--editable .external-url-text {
      flex: 1 1 auto;
    }

    .external-url-open-link {
      flex: 0 0 auto;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      line-height: 1;
      color: inherit;
      text-decoration: none;
    }

    .external-url-cell mat-icon,
    .external-url-open-link mat-icon {
      flex: 0 0 auto;
      font-size: 16px;
      width: 16px;
      height: 16px;
      line-height: 16px;
    }

    .external-url-plain {
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  `],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule, TranslateModule]
})
export class ExternalUrlRendererComponent implements ICellRendererAngularComp {
  public displayValue = '';
  public safeUrl: string | null = null;
  public accessibleLabel = '';
  public editable = false;

  constructor(private readonly translate: TranslateService) {}

  agInit(params: any): void {
    this.applyParams(params);
  }

  refresh(params: any): boolean {
    this.applyParams(params);
    return true;
  }

  private applyParams(params: any): void {
    const value = params?.value;
    this.displayValue = value == null ? '' : String(value);
    this.safeUrl = toSafeHttpUrl(this.displayValue);
    this.editable = !!(params?.editable ?? params?.cellRendererParams?.editable);
    const openLabel = this.translate.instant('common.url.openNewTab');
    this.accessibleLabel = this.safeUrl
      ? `${this.displayValue} — ${openLabel}`
      : this.displayValue;
  }
}
