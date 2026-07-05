import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';

import { DataGridComponent } from '@app/frontend-gui/src/lib/data-grid/data-grid.component';

import { RelationGridTable } from '../../data-tables.util';

/**
 * Wrapper component for relation grids that reduces boilerplate
 * by encapsulating common DataGridComponent configuration.
 *
 * This component:
 * - Automatically wires add/delete/save subscriptions based on table capabilities
 * - Exposes its inner DataGridComponent for dirty tracking
 * - Delegates most configuration to the table definition
 */
@Component({
  selector: 'app-relation-grid',
  standalone: true,
  imports: [CommonModule, DataGridComponent],
  templateUrl: './relation-grid.component.html'
})
export class RelationGridComponent {
  /**
   * The table definition that configures this grid.
   * Required input.
   */
  @Input({ required: true }) table!: RelationGridTable;

  /**
   * Whether all elements in the grid are new (used during parent entity creation/duplication).
   * Defaults to false.
   */
  @Input() allNewElements = false;

  /**
   * Whether the grid is read-only (no add/delete/save operations).
   * Defaults to false.
   */
  @Input() readOnly = false;

  /**
   * Whether to show the global search input.
   * Defaults to true.
   */
  @Input() globalSearch = true;

  /**
   * Whether to show the change height button.
   * Defaults to true.
   */
  @Input() changeHeightButton = true;

  /**
   * Optional override for the add button visibility.
   * If not provided, defaults based on table capabilities and readOnly state.
   */
  @Input() addButton?: boolean;

  /**
   * Optional override for the delete button visibility.
   * If not provided, defaults based on table capabilities and readOnly state.
   */
  @Input() deleteButton?: boolean;

  /**
   * Optional override for the duplicate action visibility.
   * If not provided, defaults based on table capabilities and readOnly state.
   */
  @Input() duplicateButton?: boolean;

  /**
   * Template dialog name for the new-button flow (e.g. `newParameterDialog`).
   * When set and the table supports template dialogs, the grid shows a new button
   * that opens this dialog instead of the picker add flow.
   */
  @Input() templateDialogName?: string;

  /**
   * Whether to show the register action (e.g. service layer registration).
   * Explicit opt-in; no table capability flag.
   */
  @Input() registerButton?: boolean;

  /**
   * Status applied to selected rows when register is clicked.
   * Passed through to the inner data grid.
   */
  @Input() newStatusRegister?: string;

  /**
   * Reference to the inner DataGridComponent.
   * Exposed for dirty tracking by BaseFormComponent.
   */
  @ViewChild(DataGridComponent)
  readonly dataGrid?: DataGridComponent;

  /**
   * Computed flag: whether to show the add button.
   * Defaults based on readOnly state and table's picker add capability.
   */
  get showAddButton(): boolean {
    return this.addButton ?? (!this.readOnly && this.table.hasPickerAdd());
  }

  /**
   * Computed flag: whether to show the delete button.
   * Defaults based on readOnly state and table's status column capability.
   */
  get showDeleteButton(): boolean {
    return this.deleteButton ?? (!this.readOnly && this.table.hasStatusColumn());
  }

  /** Whether to show the template-dialog new button. */
  get showNewButton(): boolean {
    return !!this.templateDialogName
      && !this.readOnly
      && this.table.hasTemplateDialogs();
  }

  /** Whether to show the duplicate action. */
  get showDuplicateButton(): boolean {
    return this.duplicateButton ?? (!this.readOnly && this.table.supportsDuplicate());
  }

  /** Whether to show the register action. */
  get showRegisterButton(): boolean {
    return !!this.registerButton && !this.readOnly;
  }

  /**
   * Computed flag: whether to wire save subscriptions.
   * Save is only wired when not read-only and table has relations updater.
   */
  get shouldWireSave(): boolean {
    return !this.readOnly && this.table.hasRelationsUpdater();
  }

  /** Current backing row data from the inner grid. */
  get rowData(): any[] {
    return this.dataGrid?.rowData ?? [];
  }

  /** Live grid rows including pending add/modify/delete state. */
  getAllCurrentData(): any[] {
    return this.dataGrid?.getAllCurrentData() ?? [];
  }
}
