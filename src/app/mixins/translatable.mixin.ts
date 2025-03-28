import {Language, Translation, TranslationService} from "@app/domain";
import {firstValueFrom} from "rxjs";
import {map, tap} from "rxjs/operators";
import {config} from "@config";
import {DialogTranslationComponent} from "@app/frontend-gui/src/lib/dialog-translation/dialog-translation.component";
import {MatDialog} from "@angular/material/dialog";

/**
 * Interface defining the methods required for translatable entities
 */
interface TranslatableMixin {
  /**
   * Initializes translation maps for all translatable properties
   */
  initTranslations( className: string,
                    translatedProperties: string[],
  ): void

  /**
   * Loads translations for an entity from the database
   * @param entity - The entity with an ID to load translations for
   */
  loadTranslations(entity: { id: number }): Promise<void>

  /**
   * Saves all translations for an entity to the database
   * @param entity - The entity with an ID to save translations for
   * @returns Promise resolving when all translations are saved
   */
  saveTranslations(entity: { id: number }): Promise<void[]>

  onTranslated(property: string)
}

/**
 * Type representing translations for a specific property
 */
export type PropertyTranslations = {
  /** The property name */
  property: string,
  /** Map of language codes to translation objects */
  map: Map<string, Translation>,
  /** Flag indicating if translations were modified */
  modified: boolean
}

/**
 * Mixin that adds translation capabilities to a class
 *
 * @param Base - The base class to extend with translation functionality
 * @returns A class with translation capabilities
 */
export function translatableMixin<TBase extends Constructor>(Base: TBase) {
  return class extends Base implements TranslatableMixin {

    protected translationService: TranslationService
    protected dialog: MatDialog
    private propertyTranslations: Map<string, PropertyTranslations> = new Map();
    private propertyTranslationsEntity: string

    /**
     * Initializes translation maps for all translatable properties
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
     * Loads translations for an entity from the database
     * @param entity - The entity with an ID to load translations for
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
     * Saves all translations for an entity to the database
     * @param entity - The entity with an ID to save translations for
     * @returns Promise resolving when all translations are saved
     */
    async saveTranslations(entity: { id: number }): Promise<void[]> {
      return Promise.all(Array.from(this.propertyTranslations.values()).map(async (value: PropertyTranslations) => {
        await this.saveTranslation(entity.id, value.map, entity[value.property], value.modified);
        value.modified = false;
      }));
    }

    async onTranslated(property: string) {
      const dialogResult = await this.openTranslationDialog(this.propertyTranslations.get(property).map);
      if (dialogResult && dialogResult.event == 'Accept') {
        this.propertyTranslations.get(property).modified = true;
      }
    }

    /**
     * Saves translations for a specific property to the database
     * @param id - The entity ID
     * @param translationMap - Map of language codes to translation objects
     * @param internationalValue - The default value in the default language
     * @param modifications - Flag indicating if translations were modified
     * @returns Promise resolving to the updated translation map
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
        if (key !== defaultLanguage && (!value || !value.translation)) return;

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
     * Creates a map of empty translation objects for all supported languages
     * @param columnName - The column name for the translations
     * @returns Map of language codes to empty translation objects
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
