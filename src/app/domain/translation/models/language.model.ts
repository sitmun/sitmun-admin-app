import { Resource } from '@app/core/hal/resource/resource.model';


/** Language model */
export class Language extends Resource {
  /** id */
  public override id: number;
  /** BCP 47 language tag */
  public shortname: string;
  /** Endonym (own name of the language) */
  public name: string;
  /** Display order in selectors */
  public order?: number | null;
  /** When false, language is hidden from menus and translation forms */
  public enabled?: boolean;
  /** Locale label for current ?lang= (read-only from API) */
  public translatedName?: string;

  /**
   * Creates a new Language instance copying only the properties declared in Language and Resource classes
   * @param source The source object to copy properties from
   * @returns A new Language instance with copied properties
   */
  public static fromObject(source: any): Language {
    const language = new Language();
    const propertiesToCopy = [
      'proxyUrl', 'rootUrl', '_links', '_subtypes',
      'id', 'shortname', 'name', 'order', 'enabled', 'translatedName'
    ];
    propertiesToCopy.forEach(prop => {
      if (source[prop] !== undefined) {
        language[prop] = source[prop];
      }
    });
    return language;
  }
}
