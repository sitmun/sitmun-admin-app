import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';

import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { TranslateModule } from '@ngx-translate/core';

/**
 * AG Grid cell renderer that converts cell values into Angular router links.
 * Supports dynamic route parameters using :paramName syntax in route definitions.
 *
 * Dual affordance: text opens in the current tab; icon opens the same route in a new tab.
 *
 * @example
 * // In AG Grid column definition:
 * {
 *   field: 'name',
 *   cellRenderer: RouterLinkRendererComponent,
 *   cellRendererParams: {
 *     route: '/users/:id',
 *     paramFields: { id: 'userId' }
 *   }
 * }
 */
@Component({
    selector: 'app-router-link-renderer',
    template: `
    <div *ngIf="canNavigate(); else plainValue" class="dual-internal-link-cell">
      <a [routerLink]="getRouterLink()"
         class="router-link dual-internal-link-cell__text"
         (click)="$event.stopPropagation()">
        {{ params.value }}
      </a>
      <a [routerLink]="getRouterLink()"
         class="dual-internal-link-cell__new-tab related-entity-open-link"
         target="_blank"
         rel="noopener"
         (click)="$event.stopPropagation()"
         [matTooltip]="'common.relation.openNewTab' | translate"
         [attr.aria-label]="'common.relation.openNewTab' | translate">
        <mat-icon class="related-entity-link-icon">open_in_new</mat-icon>
      </a>
    </div>
    <ng-template #plainValue>
      <span>{{ params?.value }}</span>
    </ng-template>
  `,
    styles: [`
    :host {
      display: block;
      width: 100%;
      min-width: 0;
    }

    .dual-internal-link-cell {
      display: flex;
      align-items: center;
      gap: 2px;
      width: 100%;
      min-width: 0;
    }

    .dual-internal-link-cell__text {
      flex: 1 1 auto;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .dual-internal-link-cell__new-tab {
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

    .dual-internal-link-cell__new-tab .related-entity-link-icon,
    .dual-internal-link-cell__new-tab mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      margin: 0;
    }
  `],
    standalone: true,
    imports: [CommonModule, RouterModule, MatIconModule, MatTooltipModule, TranslateModule]
})
export class RouterLinkRendererComponent implements ICellRendererAngularComp {
  /** AG Grid cell renderer parameters */
  public params: {
    value: string;
    route: string;
    paramFields: Record<string, string>;
    data: Record<string, any>;
  };

  /**
   * Initializes the cell renderer with AG Grid parameters
   * @param params AG Grid cell renderer parameters
   */
  agInit(params: any): void {
    this.params = params;
  }

  /**
   * Updates the cell renderer with new parameters
   * @param params New AG Grid cell renderer parameters
   * @returns true to indicate successful refresh
   */
  refresh(params: any): boolean {
    this.params = params;
    return true;
  }

  /**
   * Generates router link segments from the configured route and data
   * @returns Array of route segments for Angular router
   */
  getRouterLink(): any[] {
    // Guard: return empty route if data is not yet loaded (infinite row model)
    if (!this.params.data) {
      return [];
    }

    // Split the route into segments
    const segments = this.params.route.split('/');

    // Map each segment, replacing :paramName with actual values
    const routeSegments = segments.map(segment => {
      if (segment.startsWith(':')) {
        // Remove the : prefix and get the value from data
        const paramName = segment.substring(1);
        const dataField = this.params.paramFields[paramName];
        return this.params.data[dataField];
      }
      return segment;
    }).filter(segment => segment !== ''); // Remove empty segments

    // For absolute routes, add an empty string as the first segment
    return ['', ...routeSegments];
  }

  /**
   * Whether every route placeholder resolves to a non-empty value on the row.
   * Unregistered or incomplete rows render as plain text instead of broken links.
   */
  canNavigate(): boolean {
    if (!this.params?.data || !this.params.route || !this.params.paramFields) {
      return false;
    }

    return Object.values(this.params.paramFields).every(dataField => {
      const value = this.params.data[dataField];
      return value !== null && value !== undefined && value !== '';
    });
  }
}
