import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

/**
 * AG Grid cell renderer that converts cell values into Angular router links.
 * Supports dynamic route parameters using :paramName syntax in route definitions.
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
    <a [routerLink]="getRouterLink()" class="router-link">
      {{ params.value }}
    </a>
  `,
  standalone: true,
  imports: [RouterModule]
})
export class RouterLinkRendererComponent implements ICellRendererAngularComp {
  /** AG Grid cell renderer parameters */
  public params: {
    value: string;
    route: string;
    paramFields: Record<string, string>;
    data: Record<string, any>;
  };

  constructor(private router: Router) {}

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
} 