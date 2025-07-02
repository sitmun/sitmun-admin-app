import { Resource } from '@app/core/hal/resource/resource.model';
import { TerritoryType } from '@app/domain/territory/models/territory-type.model';
import { Cartography } from '@app/domain';
/**
 * Cartography availability model
 */
export class CartographyFilter extends Resource {

  /** id*/
  public override id: number;

  /** name*/
  public name: string;

  /** required */
  public required: boolean;

  /** type*/
  public type: string;

  /** Territorial level. */
  public territorialLevel: TerritoryType;

  /** column */
  public column: string;

  /** values*/
  public values: string[];

  /** value*/
  public valueType: string;

  /** cartography*/
  public cartography: Cartography;

  /**
   * Creates a new CartographyFilter instance copying only the properties declared in CartographyFilter and Resource classes
   * @param source The source object to copy properties from
   * @returns A new CartographyFilter instance with copied properties
   */
  public static fromObject(source: any): CartographyFilter {
    const filter = new CartographyFilter();
    // Define the properties to copy
    const propertiesToCopy = [
      // Resource properties
      'proxyUrl', 'rootUrl', '_links', '_subtypes',
      // CartographyFilter properties
      'id', 'name', 'required', 'type', 'territorialLevel',
      'column', 'values', 'valueType', 'cartography'
    ];
    // Copy only defined properties that exist in our class
    propertiesToCopy.forEach(prop => {
      if (source[prop] !== undefined) {
        filter[prop] = source[prop];
      }
    });
    return filter;
  }
}


export class CartographyFilterProjection extends Resource {

  public override id: number;

  public name: string;

  public required: boolean;

  public type: string;

  public territorialLevelId: number;

  public territorialLevelName: string;

  public column: string;

  public values: string[];

  public valueType: string;

  /**
   * Creates a new CartographyFilterProjection instance copying only the properties declared in CartographyFilterProjection and Resource classes
   * @param source The source object to copy properties from
   * @returns A new CartographyFilterProjection instance with copied properties
   */
  public static fromObject(source: any): CartographyFilterProjection {
    const projection = new CartographyFilterProjection();
    // Define the properties to copy
    const propertiesToCopy = [
      // Resource properties
      'proxyUrl', 'rootUrl', '_links', '_subtypes',
      // CartographyFilterProjection properties
      'id', 'name', 'required', 'type', 'territorialLevelId',
      'territorialLevelName', 'column', 'values', 'valueType'
    ];
    // Copy only defined properties that exist in our class
    propertiesToCopy.forEach(prop => {
      if (source[prop] !== undefined) {
        projection[prop] = source[prop];
      }
    });
    return projection;
  }
}
