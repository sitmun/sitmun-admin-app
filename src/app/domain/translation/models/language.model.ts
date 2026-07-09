import { Resource } from '@app/core/hal/resource/resource.model';


/** Language model */
export class Language extends Resource {
  /** id */
  public override id: number;
  /** BCP 47 language tag */
  public shortname: string;
  /** Language name */
  public name: string;
  /** Display order */
  public order: number;
  /** Whether this language is the system default */
  public defaultLanguage: boolean;

  /**
   * Creates a new Language instance copying only the properties declared in Language and Resource classes
   * @param source The source object to copy properties from
   * @returns A new Language instance with copied properties
   */
  public static fromObject(source: any): Language {
    const language = new Language();
    const propertiesToCopy = [
      'proxyUrl', 'rootUrl', '_links', '_subtypes',
      'id', 'shortname', 'name', 'order', 'defaultLanguage'
    ];
    propertiesToCopy.forEach(prop => {
      if (source[prop] !== undefined) {
        language[prop] = source[prop];
      }
    });
    return language;
  }
}

type LanguageOrderFields = Pick<Language, 'id' | 'order'>;

export function compareLanguagesByOrder(left: Partial<LanguageOrderFields>, right: Partial<LanguageOrderFields>): number {
  const leftOrder = typeof left.order === 'number' ? left.order : Number.MAX_SAFE_INTEGER;
  const rightOrder = typeof right.order === 'number' ? right.order : Number.MAX_SAFE_INTEGER;
  if (leftOrder !== rightOrder) {
    return leftOrder - rightOrder;
  }
  return (left.id ?? 0) - (right.id ?? 0);
}

export function sortLanguagesByOrder<T extends Partial<LanguageOrderFields>>(languages: readonly T[]): T[] {
  return [...languages].sort(compareLanguagesByOrder);
}
