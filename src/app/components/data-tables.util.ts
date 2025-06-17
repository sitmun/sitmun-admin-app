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
export class DataTableDefinition<RELATION, TARGET> implements DataTableSpec {
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
    private readonly errorHandler: ErrorHandlerService,
    private readonly fieldRestriction: string[]
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
   * Implements a delay to prevent stale data when backend processing is delayed.
   * 
   * @param event - Grid event containing data to save
   * @throws Error if save operation fails
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
   * Handles form initialization and processes dialog results.
   * Adds new relations to the table if dialog is confirmed.
   * 
   * @param name - Name of the template dialog to open
   * @throws Error if dialog template is not found or dialog operation fails
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
      error: (error) => {
        this.errorHandler.handleError(error, 'common.error.dialogOperationFailed')
      }
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
          nonEditable: false,
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
 * Defines the configuration and behavior of a data table with dual target selection.
 * Manages the relationship between primary entities (RELATION) and two types of selectable entities (TARGET_LEFT and TARGET_RIGHT).
 * 
 * This class handles:
 * - Table column definitions for relations and both target types
 * - Data fetching and filtering for all entity types
 * - CRUD operations
 * - Dialog management for dual target selection
 * - Events for table refresh and data operations
 * 
 * @template RELATION - The type of entity displayed in the main relationship table
 * @template TARGET_LEFT - The type of entity available for selection in the left target dialog
 * @template TARGET_RIGHT - The type of entity available for selection in the right target dialog
 */
export class DataTable2Definition<RELATION, TARGET_LEFT, TARGET_RIGHT> implements DataTableSpec {
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
   * Creates a new DataTable2Definition instance.
   * 
   * @param relationsColumnsDefs - Column definitions for the relations grid
   * @param relationsFetchFn - Function to fetch relation entities
   * @param relationsDuplicateFn - Function to create duplicates of relation entities
   * @param relationsUpdateFn - Function to update relation entities
   * @param relationsOrder - Default sorting field for relations
   * @param targetsDialog - Dialog service for opening target selection dialogs
   * @param targetsLeftColumnsDefs - Column definitions for left target selection grid
   * @param targetsRightColumnsDefs - Column definitions for right target selection grid
   * @param targetsLeftFetchFn - Function to fetch available left target entities
   * @param targetLeftIncludeFn - Function to filter which left targets should be shown
   * @param targetsRightFetchFn - Function to fetch available right target entities
   * @param targetRightIncludeFn - Function to filter which right targets should be shown
   * @param targetsTitle - Title for the combined target selection dialog
   * @param targetsLeftTitle - Title for the left target selection grid
   * @param targetsRightTitle - Title for the right target selection grid
   * @param targetsOrder - Default sorting field for targets
   * @param targetToRelationFn - Function to convert selected targets to relations
   * @param errorHandler - Service for handling and displaying errors
   */
  constructor(
    public readonly relationsColumnsDefs: any[],
    public readonly relationsFetchFn: () => Observable<RELATION[]>,
    public readonly relationsDuplicateFn: (relation: RELATION) => RELATION,
    private readonly relationsUpdateFn: (relations: (RELATION & Status)[]) => Promise<void>,
    private readonly relationsOrder: string,
    public readonly targetsDialog: MatDialog,
    public readonly targetsLeftColumnsDefs: any[],
    public readonly targetsRightColumnsDefs: any[],
    private readonly targetsLeftFetchFn: () => Observable<TARGET_LEFT[]>,
    private readonly targetLeftIncludeFn: (R: RELATION[]) => ((T: TARGET_LEFT) => boolean),
    private readonly targetsRightFetchFn: () => Observable<TARGET_RIGHT[]>,
    private readonly targetRightIncludeFn: (R: RELATION[]) => ((T: TARGET_RIGHT) => boolean),
    private readonly targetsTitle: string,
    private readonly targetsLeftTitle: string,
    private readonly targetsRightTitle: string,
    public readonly targetsOrder: string,
    private readonly targetToRelationFn: (left: TARGET_LEFT[], right: TARGET_RIGHT[]) => RELATION[],
    private readonly errorHandler: ErrorHandlerService,
  ) {

  }

  /**
   * Creates a builder for constructing DataTable2Definition instances.
   * Simplifies the complex configuration process through a fluent API.
   * 
   * @template RELATION - The type of entity displayed in the main relationship table
   * @template TARGET_LEFT - The type of entity available for selection in the left target dialog
   * @template TARGET_RIGHT - The type of entity available for selection in the right target dialog
   * @param dialog - MatDialog service for creating dialogs
   * @param errorHandler - Service for handling errors
   * @returns A DataTable2DefinitionBuilder instance
   */
  static builder<RELATION, TARGET_LEFT, TARGET_RIGHT>(
    dialog: MatDialog, 
    errorHandler: ErrorHandlerService
  ): DataTable2DefinitionBuilder<RELATION, TARGET_LEFT, TARGET_RIGHT> {
    return new DataTable2DefinitionBuilder<RELATION, TARGET_LEFT, TARGET_RIGHT>(dialog, errorHandler);
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
   * Implements a delay to prevent stale data when backend processing is delayed.
   * 
   * @param event - Grid event containing data to save
   * @throws Error if save operation fails
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
  composeFilter<TARGET>(f: () => Observable<TARGET[]>, g: (R: RELATION[]) => ((T: TARGET) => boolean), data: RELATION[]): () => Observable<TARGET[]> {
    return () => f().pipe(map(items => items.filter(g(data))));
  }

  /**
   * Opens a dialog for selecting target entities to add as relations.
   * Configures the dialog with current data and handles selection results.
   * Supports dual target selection with separate grids for left and right targets.
   * 
   * @param relations - Current relations to filter available targets
   * @throws Error if dialog operation fails
   */
  openDialog(relations: RELATION[]) {
    try {
      const dialogRef = this.targetsDialog.open<DialogGridComponent, DialogGridData, DialogGridResult>(DialogGridComponent, {
        panelClass: 'gridDialogs',
        data: {
          orderTable: this.defaultTargetsSorting(),
          getAllsTable: [
            this.composeFilter(this.targetsLeftFetchFn, this.targetLeftIncludeFn, relations),
            this.composeFilter(this.targetsRightFetchFn, this.targetRightIncludeFn, relations)
          ],
          singleSelectionTable: [false, false],
          columnDefsTable: [this.targetsLeftColumnsDefs, this.targetsRightColumnsDefs],
          themeGrid: null,
          title: this.targetsTitle,
          titlesTable: [this.targetsLeftTitle, this.targetsRightTitle],
          currentData: [relations],
          nonEditable: false,
        }
      });

      dialogRef.afterClosed().subscribe({
        next: (result) => {
          if (isDialogGridAddEvent(result)) {
            const newRelations = this.targetToRelationFn(result.data[0] as TARGET_LEFT[], result.data[1] as TARGET_RIGHT[]);
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
 * Interface defining the core functionality required for data table implementations.
 * Provides methods for saving data and managing table lifecycle.
 */
export interface DataTableSpec {
  /** Observable that emits when the table should be refreshed */
  refreshCommandEvent$: Observable<boolean>;
  
  /** Triggers a save operation on the table */
  save(): void;
  
  /** Completes all subjects to prevent memory leaks */
  complete(): void;
}

/**
 * Registry for managing multiple data tables within a component.
 * Provides centralized control of table operations like saving and cleanup.
 */
export class DataTablesRegistry {
  /**
   * Array of registered data table definitions.
   */
  private readonly registry: DataTableSpec[] = [];
  
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
  register(spec: DataTableSpec) {
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

  private fieldRestriction: string[] = [];

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

  withFieldRestriction(field: string): this {
    this.fieldRestriction.push(field);
    return this;
  }

  withFieldRestrictions(fields: string[]): this {
    this.fieldRestriction.push(...fields);
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
      this.errorHandler,
      this.fieldRestriction
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
 * Builder for creating DataTable2Definition instances.
 * Provides a fluent API for configuring complex data table definitions with dual target selection.
 * 
 * @template RELATION - The type of entity displayed in the main relationship table
 * @template TARGET_LEFT - The type of entity available for selection in the left target dialog
 * @template TARGET_RIGHT - The type of entity available for selection in the right target dialog
 */
class DataTable2DefinitionBuilder<RELATION, TARGET_LEFT, TARGET_RIGHT> {
  /**
   * Column definitions for the relations grid.
   */
  private relationsColumnsDefs: any[] = [];
  
  /**
   * Column definitions for the target selection grid.
   */
  private targetLeftColumnsDefs: any[] = [];
  private targetRightColumnsDefs: any[] = [];
  
  /**
   * Function to create duplicates of relation entities.
   */
  private relationsDuplicateFn: (relation: RELATION) => RELATION;
  
  /**
   * Title for the target selection dialog.
   */
  private targetsTitle = '';

  private targetsLeftTitle = '';

  private targetsRightTitle = '';
  
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

  private fieldRestriction: string[] = [];

  /**
   * Creates a new DataTable2DefinitionBuilder.
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
  withTargetsLeftColumns(columns: any[]): this {
    this.targetLeftColumnsDefs = columns;
    return this;
  }

  withTargetsRightColumns(columns: any[]): this {
    this.targetRightColumnsDefs = columns;
    return this;
  }

  withFieldRestriction(field: string): this {
    this.fieldRestriction.push(field);
    return this;
  }

  withFieldRestrictions(fields: string[]): this {
    this.fieldRestriction.push(...fields);
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
  withTargetsLeftFetcher(fn: () => Observable<TARGET_LEFT[]>): this {
    this.targetsLeftFetchFn = fn;
    return this;
  }

  withTargetsRightFetcher(fn: () => Observable<TARGET_RIGHT[]>): this {
    this.targetsRightFetchFn = fn;
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

  withTargetsLeftTitle(title: string): this {
    this.targetsLeftTitle = title;
    return this;
  }

  withTargetsRightTitle(title: string): this {
    this.targetsRightTitle = title;
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
  withTargetToRelation(fn: (left: TARGET_LEFT[], right: TARGET_RIGHT[]) => RELATION[]): this {
    this.targetToRelationFn = fn;
    return this;
  }

  /**
   * Sets the function to filter which targets should be shown.
   * 
   * @param fn - Function that creates a filter predicate based on current relations
   * @returns This builder instance for method chaining
   */
  withTargetLeftInclude(fn: (R: RELATION[]) => ((TL: TARGET_LEFT) => boolean)): this {
    this.targetLeftIncludeFn = fn;
    return this;
  }

  /**
   * Sets the function to filter which targets should be shown.
   * 
   * @param fn - Function that creates a filter predicate based on current relations
   * @returns This builder instance for method chaining
   */
  withTargetRightInclude(fn: (R: RELATION[]) => ((TL: TARGET_RIGHT) => boolean)): this {
    this.targetRightIncludeFn = fn;
    return this;
  }

  /**
   * Builds a DataTableDefinition with the configured properties.
   * 
   * @returns A new DataTableDefinition instance
   */
  build(): DataTable2Definition<RELATION, TARGET_LEFT, TARGET_RIGHT> {
    return new DataTable2Definition<RELATION, TARGET_LEFT, TARGET_RIGHT>(
      this.relationsColumnsDefs,
      this.relationsFetchFn,
      this.relationsDuplicateFn,
      this.relationsUpdateFn,
      this.relationsOrder,
      this.targetsDialog,
      this.targetLeftColumnsDefs,
      this.targetRightColumnsDefs,
      this.targetsLeftFetchFn,
      this.targetLeftIncludeFn,
      this.targetsRightFetchFn,
      this.targetRightIncludeFn,
      this.targetsTitle,
      this.targetsLeftTitle,
      this.targetsRightTitle,
      this.targetsOrder,  
      this.targetToRelationFn,
      this.errorHandler,
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
  private targetsLeftFetchFn: () => Observable<TARGET_LEFT[]> = () => of([]);
  
  private targetsRightFetchFn: () => Observable<TARGET_RIGHT[]> = () => of([]);

  /**
   * Default function to filter which targets should be shown.
   * Shows all targets if not overridden.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private targetLeftIncludeFn: (relations: RELATION[]) => ((target: TARGET_LEFT) => boolean) = (relations) => ((target) => true);

  private targetRightIncludeFn: (relations: RELATION[]) => ((target: TARGET_RIGHT) => boolean) = (relations) => ((target) => true);

  /**
   * Default function to convert selected targets to relations.
   * Performs a simple type cast if not overridden.
   */
  private targetToRelationFn: (targetLeft: TARGET_LEFT[], targetRight: TARGET_RIGHT[]) => RELATION[] = (items) => items as unknown as RELATION[];

  /**
   * Default function to update relation entities.
   * Does nothing if not overridden.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private relationsUpdateFn: (relations: (RELATION & Status)[]) => Promise<void> = async () => {
  };

}

/**
 * Represents a dialog template with associated form and behavior.
 * Used for creating and editing entities in a consistent way.
 * Provides a reusable dialog configuration that can be instantiated multiple times.
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
     * Defines the HTML structure of the dialog.
     */
    public reference: TemplateRef<any>,
    
    /**
     * Title for the dialog.
     * Displayed in the dialog header.
     */
    public title: string,
    
    /**
     * Form group for the dialog.
     * Manages form controls and validation.
     */
    public form: FormGroup,
    
    /**
     * Function to call before opening the dialog.
     * Can be used to initialize or reset the form state.
     */
    public preOpenFn: (form: FormGroup) => void
  ) {
  }

  /**
   * Creates a builder for constructing TemplateDialog instances.
   * Provides a fluent API for configuring dialog templates.
   * 
   * @returns A new TemplateDialogBuilder instance
   */
  static builder(): TemplateDialogBuilder {
    return new TemplateDialogBuilder();
  }
}

/**
 * Builder for creating TemplateDialog instances.
 * Provides a fluent API for configuring dialog templates.
 * Ensures all required properties are set before building.
 */
export class TemplateDialogBuilder {
  /**
   * Template reference for the dialog content.
   * Defines the HTML structure of the dialog.
   */
  private _reference: TemplateRef<any>;
  
  /**
   * Title for the dialog.
   * Displayed in the dialog header.
   */
  private _title = '';
  
  /**
   * Form group for the dialog.
   * Manages form controls and validation.
   */
  private _form: FormGroup;
  
  /**
   * Function to call before opening the dialog.
   * Can be used to initialize or reset the form state.
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
   * Validates that all required properties are set.
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


