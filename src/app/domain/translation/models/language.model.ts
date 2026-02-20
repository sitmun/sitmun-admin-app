import { Resource } from '@app/core/hal/resource/resource.model';


/** Language model */
export class Language extends Resource {
  /** id */
  public override id: number;
  /** BCP 47 language tag */
  public shortname: string;
  /** Language name */
  public name: string;

  /**
   * Creates a new Language instance copying only the properties declared in Language and Resource classes
   * @param source The source object to copy properties from
   * @returns A new Language instance with copied properties
   */
  public static fromObject(source: any): Language {
    const language = new Language();
    const propertiesToCopy = [
      'proxyUrl', 'rootUrl', '_links', '_subtypes',
      'id', 'shortname', 'name'
    ];
    propertiesToCopy.forEach(prop => {
      if (source[prop] !== undefined) {
        language[prop] = source[prop];
      }
    });
    return language;
  }
}
