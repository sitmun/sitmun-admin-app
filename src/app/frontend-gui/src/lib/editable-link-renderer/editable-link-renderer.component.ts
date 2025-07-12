import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { Component } from '@angular/core';
import { NgIf } from '@angular/common';

/**
 * AG Grid cell renderer that renders cell values as clickable links while maintaining editability.
 * The link is clickable but the text can also be edited.
 */
@Component({
  selector: 'app-editable-link-renderer',
  template: `
    <div class="editable-link-container">
      <a *ngIf="!isEditing" 
         [href]="params.value" 
         [target]="openInNewTab ? '_blank' : '_self'"
         [rel]="openInNewTab ? 'noopener noreferrer' : ''"
         class="editable-link"
         (click)="onLinkClick($event)">
        {{ params.value }}
      </a>
      <span *ngIf="isEditing">{{ params.value }}</span>
    </div>
  `,
  styles: [`
    .editable-link-container {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
    }
    .editable-link {
      color: #007bff;
      text-decoration: none;
      cursor: pointer;
      width: 100%;
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .editable-link:hover {
      text-decoration: underline;
    }
  `],
  standalone: true,
  imports: [NgIf]
})
export class EditableLinkRendererComponent implements ICellRendererAngularComp {
  /** AG Grid cell renderer parameters */
  public params: any;
  /** Flag indicating if the cell is being edited */
  public isEditing = false;
  /** Flag indicating if the link should open in a new tab */
  public openInNewTab = true;

  /**
   * Initializes the cell renderer with AG Grid parameters
   * @param params AG Grid cell renderer parameters
   */
  agInit(params: any): void {
    this.params = params;
    this.isEditing = params.node.isEditing;
    // Get the openInNewTab configuration from cellRendererParams or default to true
    this.openInNewTab = params.cellRendererParams?.openInNewTab ?? true;
  }

  /**
   * Updates the cell renderer with new parameters
   * @param params New AG Grid cell renderer parameters
   * @returns true to indicate successful refresh
   */
  refresh(params: any): boolean {
    this.params = params;
    this.isEditing = params.node.isEditing;
    this.openInNewTab = params.cellRendererParams?.openInNewTab ?? true;
    return true;
  }

  /**
   * Handles click events on the link
   * @param event Click event
   */
  onLinkClick(event: MouseEvent): void {
    // If the cell is not in edit mode, allow the link to open
    if (!this.isEditing) {
      return;
    }
    // If in edit mode, prevent the link from opening
    event.preventDefault();
  }
} 