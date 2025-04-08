import { Resource } from '@app/core/hal/resource/resource.model';
import {Application, Background, Cartography} from '@app/domain';
import {Role} from '@app/domain/role/models/role.model';
/**
 * Cartography group
 */
export class CartographyGroup extends Resource {
  /** id */
  public id: number;
  /** name*/
  public name: string;
  /** type*/
  public type: string;
  /** members*/
  public members: Cartography[];
  /** roles*/
  public roles: Role[];

  public backgrounds: Background[];

  public applications: Application[];

  /**
   * Creates a new CartographyGroup instance copying only the properties declared in CartographyGroup and Resource classes
   * @param source The source object to copy properties from
   * @returns A new CartographyGroup instance with copied properties
   */
  public static fromObject(source: any): CartographyGroup {
    const group = new CartographyGroup();
    // Define the properties to copy
    const propertiesToCopy = [
      // Resource properties
      'proxyUrl', 'rootUrl', '_links', '_subtypes',
      // CartographyGroup properties
      'id', 'name', 'type', 'members', 'roles',
      'backgrounds', 'applications'
    ];
    // Copy only defined properties that exist in our class
    propertiesToCopy.forEach(prop => {
      if (source[prop] !== undefined) {
        group[prop] = source[prop];
      }
    });
    return group;
  }
}

export class CartographyGroupProjection extends Resource {
  public id: number;

  public name: string;

  public type: string;

  public roleNames: string[];

  /**
   * Creates a new CartographyGroupProjection instance copying only the properties declared in CartographyGroupProjection and Resource classes
   * @param source The source object to copy properties from
   * @returns A new CartographyGroupProjection instance with copied properties
   */
  public static fromObject(source: any): CartographyGroupProjection {
    const projection = new CartographyGroupProjection();
    // Define the properties to copy
    const propertiesToCopy = [
      // Resource properties
      'proxyUrl', 'rootUrl', '_links', '_subtypes',
      // CartographyGroupProjection properties
      'id', 'name', 'type', 'roleNames'
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
