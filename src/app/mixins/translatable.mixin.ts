/**
 * @fileoverview Provides translation functionality for Angular components through a mixin pattern.
 * This module enables multilingual support for entity properties by managing translations in different languages.
 */

import {Language, Translation, TranslationService} from "@app/domain";
import {firstValueFrom} from "rxjs";
import {map, tap} from "rxjs/operators";
import {config} from "@config";
import {DialogTranslationComponent} from "@app/frontend-gui/src/lib/dialog-translation/dialog-translation.component";
import {MatDialog} from "@angular/material/dialog";
import { Constructor } from "./common";

/**
 * Interface defining the methods required for translatable entities.
 * Any class that implements this mixin must provide these methods.
 */
interface TranslatableMixin {
  /**
   * Initializes translation maps for all translatable properties of an entity.
   * @param className - The name of the entity class being translated
   * @param translatedProperties - Array of property names that need translation
   */
  initTranslations(className: string, translatedProperties: string[]): void;

  /**
   * Loads existing translations for an entity from the database.
   * @param entity - The entity object containing an ID to load translations for
   * @returns Promise that resolves when translations are loaded
   */
  loadTranslations(entity: { id: number }): Promise<void>;

  /**
   * Persists all translations for an entity to the database.
   * @param entity - The entity object containing an ID to save translations for
   * @returns Promise resolving to an array of void promises, one for each saved translation
   */
  saveTranslations(entity: { id: number }): Promise<void[]>;

  /**
   * Handles the translation event for a specific property.
   * Opens a dialog for editing translations.
   * @param property - The name of the property being translated
   */
  onTranslated(property: string);

  /**
   * Map storing translations for each translatable property.
   * Keys are property names, values are PropertyTranslations objects.
   */
  propertyTranslations: Map<string, PropertyTranslations>;
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

/**
 * Creates a mixin that adds translation capabilities to a base class.
 * This mixin provides functionality for managing, loading, and saving translations
 * for entity properties in multiple languages.
 *
 * @template TBase - The type of the base class
 * @param Base - The base class to extend with translation functionality
 * @returns A new class that extends the base class with translation capabilities
 *
 * @example
 * ```typescript
 * class MyComponent extends translatableMixin(BaseComponent) {
 *   constructor() {
 *     super();
 *     this.initTranslations('MyEntity', ['name', 'description']);
 *   }
 * }
 * ```
 */
export function translatableMixin<TBase extends Constructor>(Base: TBase) {
  return class extends Base implements TranslatableMixin {
    /** Service for managing translations */
    protected translationService: TranslationService;
    /** Dialog service for displaying translation UI */
    protected dialog: MatDialog;
    /** Map of property names to their translations */
    propertyTranslations: Map<string, PropertyTranslations> = new Map();
    /** Name of the entity being translated */
    private propertyTranslationsEntity: string;

    /**
     * Initializes translation maps for all translatable properties of an entity.
     * Creates empty translation objects for each supported language.
     *
     * @param entity - The name of the entity class being translated
     * @param translatedProperties - Array of property names that need translation
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
     * @param entity - The entity object containing an ID to load translations for
     * @returns Promise that resolves when translations are loaded
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
     * @param entity - The entity object containing an ID to save translations for
     * @returns Promise resolving to an array of void promises, one for each saved translation
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
     * @param property - The name of the property being translated
     */
    async onTranslated(property: string) {
      const dialogResult = await this.openTranslationDialog(this.propertyTranslations.get(property).map);
      if (dialogResult && dialogResult.event == 'Accept') {
        this.propertyTranslations.get(property).modified = true;
      }
    }

    /**
     * Saves translations for a specific property to the database.
     * Handles special cases for default language and empty translations.
     *
     * @param id - The entity ID
     * @param translationMap - Map of language codes to translation objects
     * @param internationalValue - The default value in the default language
     * @param modifications - Flag indicating if translations were modified
     * @returns Promise resolving to the updated translation map
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
     * @param columnName - The column name for the translations
     * @returns Map of language codes to empty translation objects
     * @private
     */
    private createTranslationsList(columnName: string): Map<string, Translation> {
      const translationsList: Map<string, Translation> = new Map<
        string,
        Translation
      >();

      const languagesToUse = config.languagesToUse
        ? config.languagesToUse
        : JSON.parse(localStorage.getItem('languages'));
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
     * @param translationsMap - Map of current translations to edit
     * @returns Promise resolving to the dialog result
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
  };
}
