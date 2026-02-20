import { Resource } from '@app/core/hal/resource/resource.model';
/**
 * Code List Value model
 */
export class CodeList extends Resource {
  /** id */
  public override id: number;
  /** code list name */
  public codeListName: string;
  /** value */
  public value: string;
  /** description */
  public description: string;
  /** default code flag */
  public defaultCode: boolean;
  /** system flag (read-only, immutable if true) */
  public system: boolean;

  /**
   * Creates a new CodeList instance copying only the properties declared in CodeList and Resource classes
   * @param source The source object to copy properties from
   * @returns A new CodeList instance with copied properties
   */
  public static fromObject(source: any): CodeList {
    const codeList = new CodeList();
    const propertiesToCopy = [
      'proxyUrl', 'rootUrl', '_links', '_subtypes',
      'id', 'codeListName', 'value', 'description', 'defaultCode', 'system'
    ];
    propertiesToCopy.forEach(prop => {
      if (source[prop] !== undefined) {
        codeList[prop] = source[prop];
      }
    });
    return codeList;
  }
}
