import {Resource} from '@app/core/hal/resource/resource.model';
import {
  Role,
  Territory,
  User
} from '@app/domain';

/**
 * User permission model
 */
export class UserConfiguration extends Resource {

  public override id: number;

  /** role */
  public role: Role;

  /** territory */
  public territory: Territory;

  /** user */
  public user: User;

  public appliesToChildrenTerritories: boolean;

  public createdDate: string;

  /**
   * Creates a new UserConfiguration instance copying only the properties declared in UserConfiguration and Resource classes
   * @param source The source object to copy properties from
   * @returns A new UserConfiguration instance with copied properties
   */
  public static fromObject(source: any): UserConfiguration {
    const config = new UserConfiguration();
    // Define the properties to copy
    const propertiesToCopy = [
      // Resource properties
      'proxyUrl', 'rootUrl', '_links', '_subtypes',
      // UserConfiguration properties
      'id', 'role', 'territory', 'user', 'appliesToChildrenTerritories', 'createdDate'
    ];
    // Copy only defined properties that exist in our class
    propertiesToCopy.forEach(prop => {
      if (source[prop] !== undefined) {
        config[prop] = source[prop];
      }
    });
    return config;
  }
}

export class UserConfigurationProjection extends Resource {
  public override id: number;
  user: string;
  userId: number;
  territory: string;
  territoryId: number;
  role: string;
  roleId: number;
  appliesToChildrenTerritories: boolean;
  createdDate: string;

  /**
   * Creates a new UserConfigurationProjection instance copying only the properties declared in UserConfigurationProjection and Resource classes
   * @param source The source object to copy properties from
   * @returns A new UserConfigurationProjection instance with copied properties
   */
  public static fromObject(source: any): UserConfigurationProjection {
    const projection = new UserConfigurationProjection();
    // Define the properties to copy
    const propertiesToCopy = [
      // Resource properties
      'proxyUrl', 'rootUrl', '_links', '_subtypes',
      // UserConfigurationProjection properties
      'id', 'user', 'userId', 'territory', 'territoryId',
      'role', 'roleId', 'appliesToChildrenTerritories', 'createdDate'
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
