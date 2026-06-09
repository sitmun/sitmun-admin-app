import {Resource} from '@app/core/hal/resource/resource.model';

/**
 * Territory type model
 */
export class TerritoryType extends Resource {
   /** id */
   public override id: number;
  /** name */
  public name: string;

  public official: boolean;

  public topType: boolean;

  public bottomType: boolean;

  /**
   * Creates a TerritoryType copying only declared Resource and TerritoryType properties.
   */
  public static fromObject(source: any): TerritoryType {
    const territoryType = new TerritoryType();
    const propertiesToCopy = [
      'proxyUrl', 'rootUrl', '_links', '_subtypes',
      'id', 'name', 'official', 'topType', 'bottomType',
    ];
    propertiesToCopy.forEach((prop) => {
      if (source[prop] !== undefined) {
        territoryType[prop] = source[prop];
      }
    });
    return territoryType;
  }
}
