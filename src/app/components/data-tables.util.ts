import {map, Observable, of, Subject, ReplaySubject, firstValueFrom, race, timer} from "rxjs";
import {GridEvent, GridEventType, isSave, Status} from "@app/frontend-gui/src/lib/data-grid/data-grid.component";
import {MatDialog} from "@angular/material/dialog";
import {ErrorHandlerService} from "@app/services/error-handler.service";
import {
  DialogFormComponent,
  DialogFormData,
  DialogFormResult
} from "@app/frontend-gui/src/lib/dialog-form/dialog-form.component";
import {
  DialogGridComponent,
  DialogGridData,
  DialogGridResult,
  isDialogGridAddEvent
} from "@app/frontend-gui/src/lib/dialog-grid/dialog-grid.component";
import {TemplateRef} from "@angular/core";
import {FormGroup} from "@angular/forms";

/**
 * Defines the configuration and behavior of a data table in the application.
 * Manages the relationship between primary entities (RELATION) and selectable entities (TARGET).
 * 
 * This class handles:
 * - Table column definitions
 * - Data fetching and filtering
 * - CRUD operations
 * - Dialog management for entity selection
 * - Events for table refresh and data operations
 * 
 * @template RELATION - The type of entity displayed in the main relationship table
 * @template TARGET - The type of entity available for selection in target dialogs
 */
export class DataTableDefinition<RELATION, TARGET> {
  /**
   * The delay in milliseconds before refreshing data after a save operation.
   * Helps prevent stale data when backend processing is delayed.
   */
  private readonly DELAY = 500;
  
  /**
   * Subject that emits events when relations should be added to the table.
   * Used to signal the data grid to add new rows.
   */
  addCommandEvent$ = new Subject<RELATION[]>();
  
  /**
   * Subject that emits events when the table should be refreshed.
   * Uses ReplaySubject to ensure late subscribers receive the latest value.
   */
  refreshCommandEvent$ = new ReplaySubject<boolean>(1);
  
  /**
   * Subject that emits save command events to trigger save operations.
   * Emitting "save" to this subject will trigger the save operation.
   */
  saveCommandEvent$ = new Subject<GridEventType>();
  
  /**
   * Map of dialog templates indexed by name.
   * Used to cache template dialog configurations.
   */
  private dialogs = new Map<string, TemplateDialog>()

  /**
   * Creates a new DataTableDefinition instance.
   * 
   * @param relationsColumnsDefs - Column definitions for the relations grid
   * @param relationsFetchFn - Function to fetch relation entities
   * @param relationsDuplicateFn - Function to create duplicates of relation entities
   * @param relationsUpdateFn - Function to update relation entities
   * @param relationsOrder - Default sorting field for relations
   * @param targetsDialog - Dialog service for opening target selection dialogs
   * @param targetsColumnsDefs - Column definitions for target selection grid
   * @param targetsFetchFn - Function to fetch available target entities
   * @param targetIncludeFn - Function to filter which targets should be shown
   * @param targetsTitle - Title for the target selection dialog
   * @param targetsOrder - Default sorting field for targets
   * @param targetToRelationFn - Function to convert selected targets to relations
   * @param templateDialogs - Map of template dialog factory functions
   * @param errorHandler - Service for handling and displaying errors
   */
  constructor(
    public readonly relationsColumnsDefs: any[],
    public readonly relationsFetchFn: () => Observable<RELATION[]>,
    public readonly relationsDuplicateFn: (relation: RELATION) => RELATION,
    private readonly relationsUpdateFn: (relations: (RELATION & Status)[]) => Promise<void>,
    private readonly relationsOrder: string,
    public readonly targetsDialog: MatDialog,
    public readonly targetsColumnsDefs: any[],
    private readonly targetsFetchFn: () => Observable<TARGET[]>,
    private readonly targetIncludeFn: (R: RELATION[]) => ((T: TARGET) => boolean),
    private readonly targetsTitle: string,
    public readonly targetsOrder: string,
    private readonly targetToRelationFn: (targets: TARGET[]) => RELATION[],
    private readonly templateDialogs: Map<string, () => TemplateDialog>,
    private readonly errorHandler: ErrorHandlerService
  ) {

  }

  /**
   * Creates a builder for constructing DataTableDefinition instances.
   * Simplifies the complex configuration process through a fluent API.
   * 
   * @template RELATION - The type of entity displayed in the main relationship table
   * @template TARGET - The type of entity available for selection in target dialogs
   * @param dialog - MatDialog service for creating dialogs
   * @param errorHandler - Service for handling errors
   * @returns A DataTableDefinitionBuilder instance
   */
  static builder<RELATION, TARGET>(dialog: MatDialog, errorHandler: ErrorHandlerService): DataTableDefinitionBuilder<RELATION, TARGET> {
    return new DataTableDefinitionBuilder<RELATION, TARGET>(dialog, errorHandler);
  }

  /**
   * Gets the default sorting configuration for relations grid.
   * 
   * @returns Array of field names to sort by, or empty array if no default sorting
   */
  defaultRelationsSorting() {
    return this.relationsOrder ? [this.relationsOrder] : []
  }

  /**
   * Gets the default sorting configuration for targets grid.
   * 
   * @returns Array of field names to sort by, or empty array if no default sorting
   */
  defaultTargetsSorting() {
    return this.targetsOrder ? [this.targetsOrder] : []
  }

  /**
   * Triggers a save operation on the data table.
   * Emits a "save" event to the saveCommandEvent$ subject.
   */
  save() {
    this.saveCommandEvent$.next("save");
  }

  /**
   * Completes all subjects to prevent memory leaks.
   * Should be called when the component using this data table is destroyed.
   */
  complete() {
    this.saveCommandEvent$.complete();
    this.addCommandEvent$.complete();
    this.refreshCommandEvent$.complete();
  }

  /**
   * Creates duplicates of the selected relations.
   * Emits the duplicated relations to the addCommandEvent$ subject.
   * 
   * @param relations - Array of relations to duplicate
   */
  async duplicateRelations(relations: RELATION[]) {
    this.addCommandEvent$.next(relations.map(value => this.relationsDuplicateFn(value)));
  }

  /**
   * Handles save events from the data grid.
   * Updates relations and refreshes the grid after a successful save.
   * 
   * @param event - Grid event containing data to save
   */
  async handleSaveRelations(event: GridEvent<RELATION & Status>) {
    if (isSave(event)) {
      try {
        await this.relationsUpdateFn(event.data);
        // Caveat: This event triggers an HTTP request to reload the data in AG-grid.
        // If the backend is under pressure, the returned data may be stale if the request is immediate.
        // So we should wait a bit before sending the end save event
        // TODO: Review backend cache policy
        await new Promise(resolve => setTimeout(resolve, this.DELAY));
        this.refreshCommandEvent$.next(true);
      } catch (error) {
        this.errorHandler.handleError(error, 'common.error.saveFailed');
      }
    }
  }

  /**
   * Composes a filter function that combines target fetching with filtering.
   * Used to filter available targets based on current relations.
   * 
   * @param f - Function to fetch all potential targets
   * @param g - Function to create a filter predicate based on current relations
   * @param data - Current relations data
   * @returns Function that returns an Observable of filtered targets
   */
  composeFilter(f: () => Observable<TARGET[]>, g: (R: RELATION[]) => ((T: TARGET) => boolean), data: RELATION[]): () => Observable<TARGET[]> {
    return () => f().pipe(map(items => items.filter(g(data))));
  }

  /**
   * Retrieves a template dialog by name.
   * Creates and caches the dialog if it doesn't exist yet.
   * 
   * @param name - Name of the template dialog
   * @returns The template dialog instance
   * @throws Error if the dialog template is not found
   */
  templateDialog(name: string): TemplateDialog {
    if (!this.dialogs.has(name)) {
      const dialogFn = this.templateDialogs.get(name)
      if (!dialogFn) {
        throw new Error(`Dialog template ${name} not found`);
      }
      const dialog = dialogFn();
      this.dialogs.set(name, dialog);
      return dialog;
    }
    return this.dialogs.get(name)
  }

  /**
   * Opens a template dialog for creating or editing an entity.
   * Handles form initialization and processing dialog results.
   * 
   * @param name - Name of the template dialog to open
   */
  openTemplateDialog(name: string) {
    const dialog = this.templateDialog(name);
    dialog.preOpenFn(dialog.form);
    const dialogRef = this.targetsDialog.open<DialogFormComponent, DialogFormData, DialogFormResult>(
      DialogFormComponent, {
        data: {
          HTMLReceived: dialog.reference,
          title: dialog.title,
          form: dialog.form
        }
      }
    );
    dialogRef.afterClosed().subscribe({
      next: next => {
        if (isDialogGridAddEvent(next)) {
          const newRelations = this.targetToRelationFn([dialog.form.value] as TARGET[]);
          this.addCommandEvent$.next(newRelations);
        }
      },
      error: (error) => this.errorHandler.handleError(error, 'common.error.dialogOperationFailed')
    });
  }

  /**
   * Opens a dialog for selecting target entities to add as relations.
   * Configures the dialog with current data and handles selection results.
   * 
   * @param relations - Current relations to filter available targets
   */
  openDialog(relations: RELATION[]) {
    try {
      const dialogRef = this.targetsDialog.open<DialogGridComponent, DialogGridData, DialogGridResult>(DialogGridComponent, {
        panelClass: 'gridDialogs',
        data: {
          orderTable: this.defaultTargetsSorting(),
          getAllsTable: [this.composeFilter(this.targetsFetchFn, this.targetIncludeFn, relations)],
          singleSelectionTable: [false],
          columnDefsTable: [this.targetsColumnsDefs],
          themeGrid: null,
          title: this.targetsTitle,
          titlesTable: [''],
          currentData: [relations],
          nonEditable: false
        }
      });

      dialogRef.afterClosed().subscribe({
        next: (result) => {
          if (isDialogGridAddEvent(result)) {
            const newRelations = this.targetToRelationFn(result.data[0] as TARGET[]);
            this.addCommandEvent$.next(newRelations);
          }
        },
        error: (error) => this.errorHandler.handleError(error, 'common.error.dialogOperationFailed')
      });
    } catch (error) {
      this.errorHandler.handleError(error, 'common.error.dialogOpenFailed');
    }
  }

}

/**
 * Registry for managing multiple data tables within a component.
 * Provides centralized control of table operations like saving and cleanup.
 */
export class DataTablesRegistry {
  /**
   * Array of registered data table definitions.
   */
  private readonly registry: DataTableDefinition<any, any>[] = [];
  
  /**
   * Timeout in milliseconds for save operations.
   * If a save operation takes longer than this, it will be considered complete anyway.
   */
  private readonly SAVE_TIMEOUT = 5000;

  /**
   * Registers a data table definition with the registry.
   * 
   * @template RELATION - The relation entity type
   * @template TARGET - The target entity type
   * @param spec - Data table definition to register
   * @returns This registry instance for method chaining
   */
  register<RELATION, TARGET>(spec: DataTableDefinition<RELATION, TARGET>) {
    this.registry.push(spec);
    return this
  }

  /**
   * Saves all registered data tables.
   * Triggers save operations on all tables and waits for them to complete.
   * 
   * @returns Promise that resolves when all tables are saved or timeout occurs
   */
  async saveAll(): Promise<void> {
    if (this.registry.length === 0) {
      return;
    }

    // Create promises that will resolve when refresh events occur
    const refreshPromises = this.registry.map(spec =>
      firstValueFrom(
        race(
          spec.refreshCommandEvent$,
          timer(this.SAVE_TIMEOUT)
        )
      )
    );

    // Trigger saves
    this.registry.forEach(spec => {
      spec.save();
    });

    try {
      await Promise.all(refreshPromises);
    } catch (error) {
      console.error('Error waiting for refresh events:', error);
    }
  }

  /**
   * Completes all subjects in all registered data tables.
   * Should be called when the component is destroyed to prevent memory leaks.
   */
  completeAll() {
    this.registry.forEach(spec => {
      spec.complete();
    });
  }
}

/**
 * Builder for creating DataTableDefinition instances.
 * Provides a fluent API for configuring complex data table definitions.
 * 
 * @template RELATION - The type of entity displayed in the main relationship table
 * @template TARGET - The type of entity available for selection in target dialogs
 */
class DataTableDefinitionBuilder<RELATION, TARGET> {
  /**
   * Column definitions for the relations grid.
   */
  private relationsColumnsDefs: any[] = [];
  
  /**
   * Column definitions for the target selection grid.
   */
  private targetColumnsDefs: any[] = [];
  
  /**
   * Function to create duplicates of relation entities.
   */
  private relationsDuplicateFn: (relation: RELATION) => RELATION;
  
  /**
   * Title for the target selection dialog.
   */
  private targetsTitle = '';
  
  /**
   * Default sorting field for targets.
   */
  private targetsOrder: string | null = null;
  
  /**
   * Default sorting field for relations.
   */
  private relationsOrder: string | null = null;
  
  /**
   * Map of template dialog factory functions.
   */
  private templateDialogs: Map<string, () => TemplateDialog> = new Map();

  /**
   * Creates a new DataTableDefinitionBuilder.
   * 
   * @param targetsDialog - Dialog service for opening target selection dialogs
   * @param errorHandler - Service for handling errors
   */
  constructor(
    private readonly targetsDialog: MatDialog,
    private readonly errorHandler: ErrorHandlerService
  ) {
  }

  /**
   * Sets the column definitions for the relations grid.
   * 
   * @param columns - Column definition objects
   * @returns This builder instance for method chaining
   */
  withRelationsColumns(columns: any[]): this {
    this.relationsColumnsDefs = columns;
    return this;
  }

  /**
   * Sets the column definitions for the target selection grid.
   * 
   * @param columns - Column definition objects
   * @returns This builder instance for method chaining
   */
  withTargetsColumns(columns: any[]): this {
    this.targetColumnsDefs = columns;
    return this;
  }

  /**
   * Sets the function to fetch relation entities.
   * 
   * @param fn - Function that returns an Observable of relations
   * @returns This builder instance for method chaining
   */
  withRelationsFetcher(fn: () => Observable<RELATION[]>): this {
    this.relationsFetchFn = fn;
    return this;
  }

  /**
   * Sets the function to fetch target entities.
   * 
   * @param fn - Function that returns an Observable of targets
   * @returns This builder instance for method chaining
   */
  withTargetsFetcher(fn: () => Observable<TARGET[]>): this {
    this.targetsFetchFn = fn;
    return this;
  }

  /**
   * Sets the function to create duplicates of relation entities.
   * 
   * @param fn - Function that creates a duplicate of a relation
   * @returns This builder instance for method chaining
   */
  withRelationsDuplicate(fn: (relation: RELATION) => RELATION): this {
    this.relationsDuplicateFn = fn;
    return this
  }

  /**
   * Sets the function to update relation entities.
   * 
   * @param fn - Function that updates relations and returns a Promise
   * @returns This builder instance for method chaining
   */
  withRelationsUpdater(fn: (relations: (RELATION & Status)[]) => Promise<void>): this {
    this.relationsUpdateFn = fn;
    return this;
  }

  /**
   * Sets the title for the target selection dialog.
   * 
   * @param title - Dialog title
   * @returns This builder instance for method chaining
   */
  withTargetsTitle(title: string): this {
    this.targetsTitle = title;
    return this;
  }

  /**
   * Sets the default sorting field for targets.
   * 
   * @param order - Field name to sort by
   * @returns This builder instance for method chaining
   */
  withTargetsOrder(order: string): this {
    this.targetsOrder = order;
    return this;
  }

  /**
   * Sets the default sorting field for relations.
   * 
   * @param order - Field name to sort by
   * @returns This builder instance for method chaining
   */
  withRelationsOrder(order: string): this {
    this.relationsOrder = order;
    return this;
  }

  /**
   * Sets the function to convert selected targets to relations.
   * 
   * @param fn - Function that converts targets to relations
   * @returns This builder instance for method chaining
   */
  withTargetToRelation(fn: (items: TARGET[]) => RELATION[]): this {
    this.targetToRelationFn = fn;
    return this;
  }

  /**
   * Sets the function to filter which targets should be shown.
   * 
   * @param fn - Function that creates a filter predicate based on current relations
   * @returns This builder instance for method chaining
   */
  withTargetInclude(fn: (R: RELATION[]) => ((T: TARGET) => boolean)): this {
    this.targetIncludeFn = fn;
    return this;
  }

  /**
   * Adds a template dialog factory function.
   * 
   * @param name - Name to identify the dialog
   * @param fn - Factory function that creates a TemplateDialog
   * @returns This builder instance for method chaining
   */
  withTemplateDialog(name: string, fn: () => TemplateDialog): this {
    this.templateDialogs.set(name, fn)
    return this;
  }

  /**
   * Builds a DataTableDefinition with the configured properties.
   * 
   * @returns A new DataTableDefinition instance
   */
  build(): DataTableDefinition<RELATION, TARGET> {
    return new DataTableDefinition<RELATION, TARGET>(
      this.relationsColumnsDefs,
      this.relationsFetchFn,
      this.relationsDuplicateFn,
      this.relationsUpdateFn,
      this.relationsOrder,
      this.targetsDialog,
      this.targetColumnsDefs,
      this.targetsFetchFn,
      this.targetIncludeFn,
      this.targetsTitle,
      this.targetsOrder,
      this.targetToRelationFn,
      this.templateDialogs,
      this.errorHandler
    );
  }

  /**
   * Default function to fetch relation entities.
   * Returns an empty array if not overridden.
   */
  private relationsFetchFn: () => Observable<RELATION[]> = () => of([]);

  /**
   * Default function to fetch target entities.
   * Returns an empty array if not overridden.
   */
  private targetsFetchFn: () => Observable<TARGET[]> = () => of([]);

  /**
   * Default function to filter which targets should be shown.
   * Shows all targets if not overridden.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private targetIncludeFn: (relations: RELATION[]) => ((target: TARGET) => boolean) = (relations) => ((target) => true);

  /**
   * Default function to convert selected targets to relations.
   * Performs a simple type cast if not overridden.
   */
  private targetToRelationFn: (targets: TARGET[]) => RELATION[] = (items) => items as unknown as RELATION[];

  /**
   * Default function to update relation entities.
   * Does nothing if not overridden.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private relationsUpdateFn: (relations: (RELATION & Status)[]) => Promise<void> = async () => {
  };

}

/**
 * Builder for creating TemplateDialog instances.
 * Provides a fluent API for configuring template dialogs.
 */
export class TemplateDialogBuilder {
  /**
   * Template reference for the dialog content.
   */
  private _reference: TemplateRef<any>;
  
  /**
   * Title for the dialog.
   */
  private _title = '';
  
  /**
   * Form group for the dialog.
   */
  private _form: FormGroup;
  
  /**
   * Function to call before opening the dialog.
   * Can be used to initialize or reset the form.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private _preOpenFn: (form: FormGroup) => void = () => {}

  /**
   * Sets the template reference for the dialog content.
   * 
   * @param reference - Angular TemplateRef for the dialog content
   * @returns This builder instance for method chaining
   */
  withReference(reference: TemplateRef<any>): TemplateDialogBuilder {
    this._reference = reference;
    return this;
  }

  /**
   * Sets the title for the dialog.
   * 
   * @param title - Dialog title
   * @returns This builder instance for method chaining
   */
  withTitle(title: string): TemplateDialogBuilder {
    this._title = title;
    return this;
  }

  /**
   * Sets the form group for the dialog.
   * 
   * @param form - Angular FormGroup for the dialog
   * @returns This builder instance for method chaining
   */
  withForm(form: FormGroup): TemplateDialogBuilder {
    this._form = form;
    return this;
  }

  /**
   * Sets the function to call before opening the dialog.
   * 
   * @param fn - Function that receives the form as parameter
   * @returns This builder instance for method chaining
   */
  withPreOpenFunction(fn: (form: FormGroup) => void): TemplateDialogBuilder {
    this._preOpenFn = fn;
    return this;
  }

  /**
   * Builds a TemplateDialog with the configured properties.
   * 
   * @returns A new TemplateDialog instance
   * @throws Error if required properties are missing
   */
  build(): TemplateDialog {
    if (!this._reference) {
      throw new Error('Template reference is required');
    }
    if (!this._form) {
      throw new Error('Form is required');
    }
    return new TemplateDialog(
      this._reference,
      this._title,
      this._form,
      this._preOpenFn
    );
  }
}

/**
 * Represents a dialog template with associated form and behavior.
 * Used for creating and editing entities in a consistent way.
 */
export class TemplateDialog {
  /**
   * Creates a new TemplateDialog instance.
   * 
   * @param reference - Angular TemplateRef for the dialog content
   * @param title - Dialog title
   * @param form - Angular FormGroup for the dialog
   * @param preOpenFn - Function to call before opening the dialog
   */
  constructor(
    /**
     * Template reference for the dialog content.
     */
    public reference: TemplateRef<any>,
    
    /**
     * Title for the dialog.
     */
    public title: string,
    
    /**
     * Form group for the dialog.
     */
    public form: FormGroup,
    
    /**
     * Function to call before opening the dialog.
     */
    public preOpenFn: (form: FormGroup) => void
  ) {
  }

  /**
   * Creates a builder for constructing TemplateDialog instances.
   * 
   * @returns A new TemplateDialogBuilder instance
   */
  static builder(): TemplateDialogBuilder {
    return new TemplateDialogBuilder();
  }
}


