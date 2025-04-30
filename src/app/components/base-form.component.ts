import {HalOptions, HalParam, Resource} from "@app/core";
import {config} from "@config";
import {constants} from "@environments/constants";
import {UntypedFormGroup} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";
import {firstValueFrom, Subject} from "rxjs";
import {ErrorHandlerService} from "@app/services/error-handler.service";
import {DataTablesRegistry} from "@app/components/data-tables.util";
import {ActivatedRoute, Router} from "@angular/router";
import {Component, OnDestroy, OnInit} from "@angular/core";
import {CodeList, CodeListService, Language, Translation, TranslationService} from "@app/domain";
import {MatDialog} from "@angular/material/dialog";
import {map, tap} from "rxjs/operators";
import {DialogTranslationComponent} from "@app/frontend-gui/src/lib/dialog-translation/dialog-translation.component";
import { LoggerService } from "@app/services/logger.service";

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
 * - Internationalization and translation management
 *
 * @template T Type of the resource entity being managed, must extend the Resource base class
 */
@Component({ template: '' })
export class BaseFormComponent<T extends Resource> implements OnInit, OnDestroy {

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
  entityToEdit: T = null;

  /**
   * Registry for managing data tables within the component.
   * Handles registration, saving, and cleanup of all data tables.
   */
  dataTables: DataTablesRegistry = new DataTablesRegistry()

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
  public entityForm: UntypedFormGroup = null;

  /** Map of property names to their translations */
  propertyTranslations: Map<string, PropertyTranslations> = new Map();

  /** Map of code list names to their associated values */
  private codelists: Map<string, CodeList[]> = new Map();

  /** Stores the initial values of form controls for comparison */
  private initialFormValues: { [key: string]: any } = {};

  /** Name of the entity being translated */
  private propertyTranslationsEntity: string;

  /**
   * Creates an instance of SitmunBaseComponent.
   *
   * @param {MatDialog} dialog - Angular Material dialog service for opening modal dialogs
   * @param {TranslateService} translateService - Angular service for handling i18n translations
   * @param {TranslationService} translationService - Service for managing entity translations
   * @param {CodeListService} codeListService - Service for retrieving code lists
   * @param {ErrorHandlerService} errorHandler - Service for handling and displaying errors
   * @param {ActivatedRoute} activatedRoute - Angular service for accessing route parameters
   * @param {Router} router - Angular service for navigation
   */
  constructor(
    protected dialog: MatDialog,
    protected translateService: TranslateService,
    protected translationService: TranslationService,
    protected codeListService: CodeListService,
    protected loggerService: LoggerService,
    protected errorHandler: ErrorHandlerService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
  ) {
  }

  // ==================================================
  //                    Common logic
  // ==================================================

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
    return this.entityForm?.get(propertyName)?.value ?? ''
  }

  /**
   * Angular lifecycle hook that is called after the component is initialized.
   * Initiates data fetching and setup for the component.
   *
   * @returns {void}
   */
  ngOnInit(): void {
    this.fetchData().then(() => this.afterFetch()).catch((reason) => this.errorHandler.handleError('Error in ngOnInit:', reason));
  }

  /**
   * Lifecycle hook called after entity data is fetched.
   * Sets up form change subscriptions to track modifications.
   *
   * @returns {void}
   */
  afterFetch() {
    this.subscribeToFormChanges(this.entityForm)
  }

  /**
   * Lifecycle hook called after the entity is successfully saved.
   * Resets the form to a clean state with the current values.
   */
  afterSave() {
    this.resetToFormModifiedState(this.entityForm);
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
   *
   * @returns {void}
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
    this.loggerService.info('onSaveButtonClicked', this.explainFormValidity());
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

  // ==================================================
  //                     Utilities
  // ==================================================

  /**
   * Determines if the entity can be saved.
   * By default, checks if the form is valid.
   * Can be overridden by child classes to add custom validation.
   *
   * @returns {boolean} true if the entity can be saved, false otherwise
   */
  canSave(): boolean {
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
   * @returns {void}
   */
  duplicate<T>(type: { new(): T; }, items: (T & { name: string })[], subject: Subject<T[]>): void {
    subject.next(items.map(item => Object.assign(new type(), {
      ...item,
      id: undefined,
      _links: undefined,
      name: this.translateService.instant('copy_').concat(item.name)
    })));
  }

  /**
   * Retrieves all values for a specific code list.
   *
   * @param {string} code - The code list name to retrieve
   * @returns {CodeList[]} Array of CodeList items for the specified code
   */
  codeList(code: string): CodeList[] {
    if (!this.codelists.has(code)) {
      console.error(`Code list ${code} not initialized`);
    }
    return this.codelists.get(code) || [];
  }

  /**
   * Gets the first item in a code list.
   *
   * @param {string} code - The code list name
   * @returns {CodeList} The first CodeList item or undefined if the list is empty
   */
  firstInCodeList(code: string): CodeList {
    return this.codeList(code)[0];
  }

  /**
   * Finds a specific item in a code list by its value.
   *
   * @param {string} code - The code list name to search in
   * @param {string} value - The value to find in the code list
   * @returns {CodeList} The matching CodeList item or undefined if not found
   */
  findInCodeList(code: string, value: string): CodeList {
    return this.codeList(code).find(c => c.value === value);
  }

  /**
   * Initializes multiple code lists by fetching their values from the service.
   * Stores the sorted results in the codelists map.
   *
   * @param {string[]} codeList - Array of code list names to initialize
   * @returns {Promise<void[]>} Promise that resolves when all code lists are initialized
   */
  async initCodeLists(codeList: string[]): Promise<void[]> {
    return Promise.all(codeList.map(async code => {
      const list: CodeList[] = await firstValueFrom(this.getCodeListValues(code))
      this.codelists.set(code, [...list].sort((a, b) => a.description.localeCompare(b.description)));
    }));
  }

  /**
   * Initializes form change detection by storing initial values and setting up change subscriptions.
   * Adds visual indicators when form fields are modified.
   *
   * @param {UntypedFormGroup} form - The Angular form group to monitor for changes
   */
  public subscribeToFormChanges(form: UntypedFormGroup) {
    // Store initial form values after data is loaded
    for (const key in form.controls) {
      this.initialFormValues[key] = form.get(key).value
    }

    // Subscribe to form changes
    Object.keys(form.controls).forEach(key => {
      const control = form.get(key);
      if (control) {
        control.valueChanges.subscribe(() => {
          this.checkControlModified(form, key);
        });
      }
    });
  }

  /**
   * Resets the form's modification tracking state.
   * Updates the stored initial values to the current form values and removes all modification indicators.
   *
   * @param {UntypedFormGroup} form - The form group to reset
   */
  public resetToFormModifiedState(form): void {
    // Update initial form values to reset modified state
    this.initialFormValues = form.getRawValue();

    // Remove modified styling from all form fields
    Object.keys(form.controls).forEach(key => {
      const element = document.querySelector(`[formControlName="${key}"]`)?.closest('mat-form-field');
      if (element) {
        element.classList.remove('input-modified');
      }
    });
  }

  /**
   * Initializes translation maps for all translatable properties of an entity.
   * Creates empty translation objects for each supported language.
   *
   * @param {string} entity - The name of the entity class being translated
   * @param {string[]} translatedProperties - Array of property names that need translation
   */
  initTranslations(
    entity: string,
    translatedProperties: string[],
  ): void {
    this.propertyTranslationsEntity = entity;
    translatedProperties.forEach(property => {
      this.propertyTranslations.set(property, {
        property: property,
        map: this.createTranslationsList(`${this.propertyTranslationsEntity}.${property}`),
        modified: false
      });
    });
  }

  /**
   * Loads existing translations for an entity from the database.
   * Filters translations by entity ID and updates the translation maps.
   *
   * @param {Object} entity - The entity object containing an ID to load translations for
   * @param {number} entity.id - The ID of the entity
   * @returns {Promise<void>} Promise that resolves when translations are loaded
   */
  async loadTranslations(entity: { id: number }): Promise<void> {
    const allTranslations = await firstValueFrom(this.translationService.getAll().pipe(
      map((data: any[]) => data.filter(elem => elem.element === entity.id))
    ));
    this.propertyTranslations.forEach((value: PropertyTranslations, property: string) => {
      allTranslations.filter(t => t.column === `${this.propertyTranslationsEntity}.${property}`).forEach(t => value.map.set(t.languageShortname, t));
      value.modified = false;
    });
    return Promise.resolve();
  }

  /**
   * Persists all translations for an entity to the database.
   * Saves each modified property's translations.
   *
   * @param {Object} entity - The entity object containing an ID to save translations for
   * @param {number} entity.id - The ID of the entity
   * @returns {Promise<void[]>} Promise resolving to an array of void promises, one for each saved translation
   */
  async saveTranslations(entity: { id: number }): Promise<void[]> {
    return Promise.all(Array.from(this.propertyTranslations.values()).map(async (value: PropertyTranslations) => {
      await this.saveTranslation(entity.id, value.map, entity[value.property], value.modified);
      value.modified = false;
    }));
  }

  /**
   * Handles the translation event for a specific property.
   * Opens a dialog for editing translations and marks the property as modified if changes are accepted.
   *
   * @param {string} property - The name of the property being translated
   * @returns {Promise<void>} Promise that resolves when the translation dialog is closed
   */
  async onTranslated(property: string) {
    const dialogResult = await this.openTranslationDialog(this.propertyTranslations.get(property).map);
    if (dialogResult && dialogResult.event == 'Accept') {
      this.propertyTranslations.get(property).modified = true;
    }
  }

  /**
   * Fetches code list values from the service with appropriate parameters.
   *
   * @param {string} valueList - The name of the code list to fetch
   * @param {boolean} [notTraduction] - Optional flag to skip language parameter
   * @returns {Observable<CodeList[]>} Observable of CodeList array
   * @private
   */
  private getCodeListValues(valueList, notTraduction?) {
    const query: HalOptions = {
      params: [
        { key: 'codeListName', value: valueList }
      ]
    };
    if (!notTraduction) {
      let codelistLangValue = config.defaultLang;
      if (localStorage.lang) {
        codelistLangValue = localStorage.lang;
      }
      const param: HalParam = { key: 'lang', value: codelistLangValue };
      query.params.push(param);
    }

    return this.codeListService.getAll(query);
  }

  /**
   * Checks if a form control's current value differs from its initial value.
   * Handles both primitive values and arrays.
   *
   * @param {UntypedFormGroup} form - The form group containing the control
   * @param {string} controlName - The name of the control to check
   * @returns {boolean} True if the control value has been modified, false otherwise
   * @private
   */
  private isControlModified(form: UntypedFormGroup, controlName: string): boolean {
    const control = form.get(controlName);
    if (!control) return false;

    const currentValue = control.value;
    const initialValue = this.initialFormValues[controlName];

    // Handle arrays (like supportedSRS)
    if (Array.isArray(currentValue) && Array.isArray(initialValue)) {
      return JSON.stringify(currentValue) !== JSON.stringify(initialValue);
    }

    return currentValue !== initialValue;
  }

  /**
   * Updates the visual state of a form control to indicate modification.
   * Adds or removes the 'input-modified' class based on whether the field has been modified.
   * Works with both Material form fields and regular form controls.
   *
   * @param {UntypedFormGroup} form - The form group containing the control
   * @param {string} controlName - The name of the control to update
   * @private
   */
  private checkControlModified(form, controlName: string): void {
    const isModified = this.isControlModified(form, controlName);
    let element = document.querySelector(`[formControlName="${controlName}"]`)?.closest('mat-form-field');
    if (!element) {
      element = document.querySelector(`[formControlName="${controlName}"]`);
    }

    if (element) {
      if (isModified) {
        element.classList.add('input-modified');
      } else {
        element.classList.remove('input-modified');
      }
    }
  }

  /**
   * Saves translations for a specific property to the database.
   * Handles special cases for default language and empty translations.
   *
   * @param {number} id - The entity ID
   * @param {Map<string, Translation>} translationMap - Map of language codes to translation objects
   * @param {string} internationalValue - The default value in the default language
   * @param {boolean} modifications - Flag indicating if translations were modified
   * @returns {Promise<Map<string, Translation>>} Promise resolving to the updated translation map
   * @private
   */
  private async saveTranslation(
    id: number,
    translationMap: Map<string, Translation>,
    internationalValue: string,
    modifications: boolean
  ): Promise<Map<string, Translation>> {
    if (!translationMap) return Promise.resolve(new Map<string, Translation>());

    const defaultLanguage = config.defaultLang;
    const promises: Promise<any>[] = [];

    translationMap.forEach((value: Translation, key: string) => {
      // Skip if not default language and no modifications needed
      if (key !== defaultLanguage && !modifications) return;

      // Skip non-default languages with empty translations
      if (key !== defaultLanguage && !value?.translation) return;

      // Skip default language with no international value
      if (key === defaultLanguage && !internationalValue) return;

      // Set element ID
      value.element = id;

      // Set translation for default language
      if (key === defaultLanguage) {
        value.translation = internationalValue;
      }

      // Save translation
      promises.push(firstValueFrom(
        this.translationService.save(value).pipe(
          tap(result => translationMap.set(key, result))
        )
      ));
    });

    await Promise.all(promises);
    return translationMap;
  }

  /**
   * Creates a map of empty translation objects for all supported languages.
   * Uses either configured languages or languages stored in localStorage.
   *
   * @param {string} columnName - The column name for the translations
   * @returns {Map<string, Translation>} Map of language codes to empty translation objects
   * @private
   */
  private createTranslationsList(columnName: string): Map<string, Translation> {
    const translationsList: Map<string, Translation> = new Map<
      string,
      Translation
    >();

    const languagesToUse = config.languagesToUse ?? JSON.parse(localStorage.getItem('languages'));
    if (languagesToUse) {
      languagesToUse.forEach((language: Language) => {
        const currentTranslation: Translation = new Translation();
        currentTranslation.translation = null;
        currentTranslation.column = columnName;
        currentTranslation.language = language;
        translationsList.set(language.shortname, currentTranslation);
      });
    }
    return translationsList;
  }

  /**
   * Opens a dialog for editing translations.
   * Configures the dialog with available languages and current translations.
   *
   * @param {Map<string, Translation>} translationsMap - Map of current translations to edit
   * @returns {Promise<any>} Promise resolving to the dialog result
   * @private
   */
  private async openTranslationDialog(translationsMap: Map<string, Translation>) {
    const dialogRef = this.dialog.open(DialogTranslationComponent, {
      panelClass: 'translateDialogs',
    });
    dialogRef.componentInstance.translationsMap = translationsMap;
    dialogRef.componentInstance.languageByDefault = config.defaultLang;
    dialogRef.componentInstance.languagesAvailables = config.languagesToUse;

    const result = await firstValueFrom(dialogRef.afterClosed());
    if (result) {
      return result;
    } else {
      return null;
    }
  }

  /**
   * Provides detailed explanation of form validity status
   * Examines each control's validation status and error messages
   * 
   * @returns A string with detailed validation information
   */
  explainFormValidity(): string {
    if (!this.entityForm) {
      return 'Form is not initialized';
    }

    let explanation = `Form valid: ${this.entityForm.valid}\n`;
    explanation += 'Field validation details:\n';

    // Check each control in the form
    Object.keys(this.entityForm.controls).forEach(key => {
      const control = this.entityForm.get(key);
      explanation += `- ${key}: ${control.valid ? 'Valid' : 'Invalid'}`;
      
      if (!control.valid) {
        explanation += ', Errors: ';
        if (control.errors) {
          Object.keys(control.errors).forEach(errorKey => {
            explanation += `${errorKey}`;
            
            // Add details for specific validation errors
            if (errorKey === 'required') {
              explanation += ' (Field is required)';
            } else if (errorKey === 'maxlength') {
              explanation += ` (Max length: ${control.errors.maxlength.requiredLength}, Current length: ${control.errors.maxlength.actualLength})`;
            }
            explanation += ', ';
          });
        }
        
        // Show the current value if it might help debugging
        explanation += `Current value: "${control.value}"`;
      }
      
      explanation += '\n';
    });
    
    // Explain form pristine state
    explanation += `Form pristine: ${this.entityForm.pristine}\n`;
    explanation += `Form touched: ${this.entityForm.touched}\n`;
    
    return explanation;
  }
}

/**
 * Type representing translations for a specific property of an entity.
 */
export type PropertyTranslations = {
  /** The name of the property being translated */
  property: string,
  /** Map of language codes to their respective Translation objects */
  map: Map<string, Translation>,
  /** Indicates whether translations have been modified and need saving */
  modified: boolean
}
