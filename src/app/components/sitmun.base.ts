import {Resource} from "@app/core";
import {config} from "@config";
import {constants} from "@environments/constants";
import {UntypedFormGroup} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";
import {Subject} from "rxjs";
import {detectchangeMixin} from "@app/mixins/detectchange.mixin";
import {codeListMixin} from "@app/mixins/codelist.mixin";
import {translatableMixin} from "@app/mixins/translatable.mixin";
import {activeTabMixin} from "@app/mixins/activetab.mixin";
import {Service} from "@app/domain";

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
export class SitmunBase<T extends Resource> {

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
   */
  constructor(
    protected translateService: TranslateService,
  ) {
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
  duplicate<T>(type: { new(): T; }, items: (T & { name: string }) [], subject: Subject<T[]>): void {
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
 */
export function sitmunMixedBase<T extends Resource>() {
  return detectchangeMixin(codeListMixin(translatableMixin(activeTabMixin(SitmunBase<T>))));
}
