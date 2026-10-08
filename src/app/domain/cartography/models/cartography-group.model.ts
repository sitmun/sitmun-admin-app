import { Resource } from '@app/core/hal/resource/resource.model';

import {Background} from './background.model';
import {Cartography} from './cartography.model';
import {Application} from '../../application/models/application.model';
import {Role} from '../../role/models/role.model';
/**
 * Cartography group
 */
export class CartographyGroup extends Resource {
  public override id: number;
  public name: string;
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
    const propertiesToCopy = [
      'proxyUrl', 'rootUrl', '_links', '_subtypes',
      // CartographyGroup properties
      'id', 'name', 'type', 'members', 'roles',
      'backgrounds', 'applications'
    ];
    propertiesToCopy.forEach(prop => {
      if (source[prop] !== undefined) {
        group[prop] = source[prop];
      }
    });
    return group;
  }
}

export class CartographyGroupProjection extends Resource {
  public override id: number;

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
    const propertiesToCopy = [
      'proxyUrl', 'rootUrl', '_links', '_subtypes',
      // CartographyGroupProjection properties
      'id', 'name', 'type', 'roleNames'
    ];
    propertiesToCopy.forEach(prop => {
      if (source[prop] !== undefined) {
        projection[prop] = source[prop];
      }
    });
    return projection;
  }
}
