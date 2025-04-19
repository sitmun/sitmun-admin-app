import { Resource } from "@app/core";
import { config } from "@config";
import { constants } from "@environments/constants";
import { UntypedFormGroup } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { firstValueFrom, Subject } from "rxjs";
import { detectchangeMixin } from "@app/mixins/detectchange.mixin";
import { codeListMixin } from "@app/mixins/codelist.mixin";
import { translatableMixin } from "@app/mixins/translatable.mixin";
import { activeTabMixin } from "@app/mixins/activetab.mixin";
import { ErrorHandlerService } from "@app/services/error-handler.service";
import { DataTablesRegistry } from "@app/components/data-tables.util";
import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { TranslationService } from "@app/domain";

/**
 * Base class for SITMUN components that handle resource entities.
 * Provides common functionality for managing entity lifecycle including creation,
 * editing, and duplication of resources. This class serves as the foundation for
 * components that need to handle CRUD operations on SITMUN resources.
 *
 * The class includes:
 * - Entity state management (new/edit/duplicate modes)
 * - Form handling with validation
 * - Grid configuration
 * - Utility methods for entity operations
 *
 * @template T Type of the resource entity being managed, must extend the Resource base class
 */
@Component({ template: '' })
export class SitmunBaseComponent<T extends Resource> implements OnInit, OnDestroy {

  /**
   * Tracks the ID of the entity currently being edited.
   * A value of -1 indicates that no entity is currently in edit mode.
   * This is used to determine the component's current operation mode.
   */
  entityID = -1;

  /**
   * Tracks the ID of the entity being duplicated.
   * A value of -1 indicates that no entity is currently being duplicated.
   * Used in conjunction with entityID to determine if we're in duplication mode.
   */
  duplicateID = -1;

  /**
   * The current entity instance being edited or duplicated.
   * This property holds the working copy of the entity that reflects current form state.
   */
  entityToEdit: T;

  /**
   * Registry for managing data tables within the component.
   * Handles registration, saving, and cleanup of all data tables.
   */
  dataTables: DataTablesRegistry = new DataTablesRegistry()

  /**
   * Determines if the component is in creation mode.
   * Creation mode is active when neither editing nor duplicating an existing entity.
   *
   * @returns {boolean} true if creating a new entity (both entityID and duplicateID are -1),
   *                    false if editing or duplicating
   */
  isNew(): boolean {
    return this.entityID == -1 && this.duplicateID == -1
  }

  /**
   * Determines if the entity is either new or being duplicated.
   * This is useful for operations that should occur in both creation and duplication modes.
   *
   * @returns {boolean} true if the entity is new or being duplicated (entityID is -1),
   *                    false if editing an existing entity
   */
  isNewOrDuplicated(): boolean {
    return this.entityID == -1
  }

  /**
   * Determines if the component is in edit mode.
   * Edit mode is active when modifying an existing entity.
   *
   * @returns {boolean} true if editing an existing entity (entityID is not -1),
   *                    false if creating or duplicating
   */
  isEdition(): boolean {
    return this.entityID != -1
  }

  /**
   * Determines if the component is in duplication mode.
   * Duplication mode is active when creating a new entity based on an existing one.
   *
   * @returns {boolean} true if duplicating an entity (entityID is -1 and duplicateID is not -1),
   *                    false otherwise
   */
  isDuplicated(): boolean {
    return this.entityID == -1 && this.duplicateID != -1
  }

  /**
   * Retrieves the value of a specified property from the entity form.
   * Useful for displaying entity properties in templates.
   *
   * @param {string} propertyName - The name of the property to retrieve
   * @returns {string} The value of the property or an empty string if not found
   */
  itemName(propertyName: string): string {
    return this.entityForm?.get(propertyName)?.value || ''
  }

  /**
   * Configuration object for AG Grid theme styling.
   * Contains theme-specific settings from the global configuration.
   */
  themeGrid: any = config.agGridTheme;

  /**
   * Application-wide constants for code values.
   * Provides access to standardized codes used across the application.
   */
  codeValues = constants.codeValue;

  /**
   * Flag indicating whether all required data has been loaded.
   * Used to control the rendering of form elements and prevent premature operations.
   * Components should set this to true once all necessary data is available.
   */
  dataLoaded = false;

  /**
   * The main form group for the entity.
   * Handles form validation and provides access to form controls.
   * Child classes should initialize this with appropriate form controls.
   */
  public entityForm: UntypedFormGroup;

  /**
   * Creates an instance of SitmunBase.
   *
   * @param {TranslateService} translateService - Angular service for handling i18n translations
   * @param {TranslationService} translationService - Service for managing entity translations
   * @param {ErrorHandlerService} errorHandler - Service for handling and displaying errors
   * @param {ActivatedRoute} activatedRoute - Angular service for accessing route parameters
   * @param {Router} router - Angular service for navigation
   */
  constructor(
    protected translateService: TranslateService,
    protected translationService: TranslationService,
    protected errorHandler: ErrorHandlerService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router
  ) {
  }

  // ==================================================
  //                    Common logic
  // ==================================================

  /**
   * Angular lifecycle hook that is called after the component is initialized.
   * Initiates data fetching and setup for the component.
   */
  ngOnInit(): void {
    this.fetchData().then(() => this.afterFetch()).catch((reason) => this.errorHandler.handleError('Error in ngOnInit:', reason));
  }

  /**
   * Hook called after data fetching completes successfully.
   * Can be overridden by child classes to perform additional setup after data is loaded.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  afterFetch() {
  }

  /**
   * Fetches all necessary data for the component.
   * This method coordinates the overall data loading process:
   * 1. Process route parameters to determine operation mode
   * 2. Run pre-fetch operations
   * 3. Load the entity based on mode (original, copy, or new)
   * 4. Fetch related data if needed
   * 5. Set up the form and complete initialization
   *
   * @returns {Promise<void>} Promise that resolves when all data is loaded
   */
  async fetchData(): Promise<void> {
    try {
      await this.processRouteParams();
      await this.preFetchData();
      if (!this.isNewOrDuplicated()) {
        this.entityToEdit = await this.fetchOriginal();
        await this.fetchRelatedData()
      } else if (this.isDuplicated()) {
        this.entityToEdit = await this.fetchCopy();
        await this.fetchRelatedData()
      } else {
        this.entityToEdit = this.empty();
      }
      this.postFetchData();
      this.dataLoaded = true;
    } catch (error) {
      this.errorHandler.handleError(error, 'common.error.loadingFailed');
    }
  }

  /**
   * Processes route parameters to extract entity IDs.
   * Sets the entityID and duplicateID properties based on the current route.
   *
   * @returns {Promise<void>} Promise that resolves when parameters are processed
   */
  async processRouteParams() {
    const params = await firstValueFrom(this.activatedRoute.params);
    this.entityID = params.id ?? -1;
    this.duplicateID = params.idDuplicate ?? -1;
  }

  /**
   * Hook for performing operations before fetching the main entity.
   * Can be overridden by child classes to initialize resources needed
   * before the main entity is loaded.
   *
   * @returns {Promise<void>} Promise that resolves when pre-fetch operations complete
   */
  async preFetchData(): Promise<void> {
    return Promise.resolve()
  }

  /**
   * Hook for fetching data related to the main entity.
   * Can be overridden by child classes to load additional data
   * that depends on the main entity.
   *
   * @returns {Promise<void>} Promise that resolves when related data is loaded
   */
  async fetchRelatedData(): Promise<void> {
    return Promise.resolve()
  }

  /**
   * Fetches the original entity for editing.
   * Should be overridden by child classes to load the entity from the appropriate service.
   *
   * @returns {Promise<T>} Promise that resolves with the loaded entity
   */
  async fetchOriginal(): Promise<T> {
    return Promise.resolve(this.empty())
  }

  /**
   * Fetches a copy of an existing entity for duplication.
   * Should be overridden by child classes to create a proper copy of an entity.
   *
   * @returns {Promise<T>} Promise that resolves with the copied entity
   */
  async fetchCopy(): Promise<T> {
    return Promise.resolve(this.empty())
  }

  /**
   * Hook called after the entity is loaded but before the component is fully initialized.
   * Should be overridden by child classes to set up the form and perform additional initialization.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  postFetchData(): void {
  }

  /**
   * Creates an empty entity instance with default values.
   * Should be overridden by child classes to provide appropriate defaults for new entities.
   *
   * @returns {T} A new entity instance with default values
   */
  empty(): T {
    return {} as T
  }

  /**
   * Angular lifecycle hook that is called when the component is destroyed.
   * Performs cleanup of resources, particularly data table subscriptions.
   */
  ngOnDestroy(): void {
    this.dataTables.completeAll();
  }

  /**
   * Handles the save button click event.
   * Validates the form, saves the entity, updates related data, and navigates as needed.
   *
   * @returns {Promise<void>} Promise that resolves when the save operation completes
   */
  async onSaveButtonClicked() {
    if (this.canSave()) {
      const duplicated = this.isDuplicated();
      try {
        await this.saveEntity();
        await this.dataTables.saveAll();
      } catch (error) {
        this.errorHandler.handleError(error, 'common.error.savingFailed');
      }
      // Recover the original entity (includes properties that could have been updated by data tables)
      this.entityToEdit = await this.fetchOriginal();
      this.afterSave();
      if (duplicated) {
        // Fix the navigation to correctly build the relative path
        const segments = this.activatedRoute.snapshot.url.map(segment => segment.path);
        const parentRoute = segments.slice(0, -1)
          .map(segment => segment === '-1' ? ':id' : segment)
          .join('/');
        this.router.navigate(['/' + parentRoute, this.entityID], { skipLocationChange: true });
      }
    }
  }

  /**
   * Hook called after the entity is successfully saved.
   * Can be overridden by child classes to perform additional operations after save.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  afterSave() {

  }

  /**
   * Determines if the entity can be saved.
   * By default, checks if the form is valid.
   * Can be overridden by child classes to add custom validation.
   *
   * @returns {boolean} true if the entity can be saved, false otherwise
   */
  canSave() {
    return this.entityForm.valid;
  }

  /**
   * Saves the entity and its related data.
   * Coordinates the overall save process:
   * 1. Create or update the main entity
   * 2. Refresh the entity data
   * 3. Update related data
   *
   * @returns {Promise<void>} Promise that resolves when the entity is saved
   */
  async saveEntity() {
    const isNewOrDuplicated = this.isNewOrDuplicated();
    const isDuplicated = this.isDuplicated();
    if (isNewOrDuplicated) {
      this.entityID = await this.createEntity();
    } else if (this.entityForm.dirty) {
      await this.updateEntity();
    }
    this.entityToEdit = await this.fetchOriginal()
    await this.updateDataRelated(isDuplicated);

  }

  /**
   * Creates a new entity.
   * Should be overridden by child classes to implement entity creation.
   *
   * @returns {Promise<number>} Promise that resolves with the ID of the created entity
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  createEntity(): Promise<number> {
    return Promise.resolve(null)
  }

  /**
   * Updates an existing entity.
   * Should be overridden by child classes to implement entity updates.
   *
   * @returns {Promise<void>} Promise that resolves when the entity is updated
   */
  updateEntity(): Promise<void> {
    return Promise.resolve(null)
  }

  /**
   * Updates data related to the main entity.
   * Should be overridden by child classes to save relationships and related entities.
   *
   * @param {boolean} isDuplicated - Whether the operation is a duplication
   * @returns {Promise<void>} Promise that resolves when related data is updated
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateDataRelated(isDuplicated: boolean): Promise<void> {
    return Promise.resolve()
  }

  // ==================================================
  //                     Utilities
  // ==================================================

  /**
   * Creates duplicates of items with new names and cleared identifiers.
   * This utility method is used to duplicate various entities while maintaining
   * their properties but creating new, unique instances.
   *
   * The method will:
   * 1. Create new instances of each item
   * 2. Copy all properties except id and _links
   * 3. Prefix the name with a "copy_" translation
   * 4. Emit the new array through the provided subject
   *
   * @template T - The type of items to duplicate
   * @param {new() => T} type - Constructor for the item type
   * @param {(T & { name: string })[]} items - Array of items to duplicate
   * @param {Subject<T[]>} subject - Subject to emit the duplicated items
   */
  duplicate<T>(type: { new(): T; }, items: (T & { name: string })[], subject: Subject<T[]>): void {
    subject.next(items.map(item => Object.assign(new type(), {
      ...item,
      id: undefined,
      _links: undefined,
      name: this.translateService.instant('copy_').concat(item.name)
    })));
  }
}

/**
 * A composite class that combines SitmunBase with various mixins to provide
 * additional functionality:
 * - detectchangeMixin: Handles change detection
 * - codeListMixin: Provides code list management
 * - translatableMixin: Adds translation capabilities
 * - activeTabMixin: Manages active tab state
 *
 * @template T Type of the resource entity being managed
 * @returns A class that extends SitmunBaseComponent with all mixins applied
 */
export function sitmunMixedBase<T extends Resource>() {
  return detectchangeMixin(codeListMixin(translatableMixin(activeTabMixin(SitmunBaseComponent<T>))));
}
