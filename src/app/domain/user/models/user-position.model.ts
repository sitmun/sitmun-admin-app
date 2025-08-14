import {Resource} from '@app/core/hal/resource/resource.model';
import {Territory} from '@app/domain/territory/models/territory.model';
import {User} from '@app/domain';

/**
 * User position model
 */
export class UserPosition extends Resource {

  /** name */
  public name: string;
  /** email */
  public email: string;
  /** organization name*/
  public organization: string;
  /** system created date*/
  public createdDate: any;

  /** modification date*/
  public lastModifiedDate: any;

  /** expiration date*/
  public expirationDate: any;

  /** position type */
  public type: string;
  /** position territory*/
  public territory: Territory;
  /** user*/
  public user: User;

  public static fromObject(source: any): UserPosition {
    const user = new UserPosition();
    // Define the properties to copy
    const propertiesToCopy = [
      // Resource properties
      'proxyUrl', 'rootUrl', '_links', '_subtypes',
      // User properties
      'id', 'name', 'email', 'organization', 'createdDate', 'lastModifiedDate',
      'expirationDate', 'type', 'territory', 'user'
    ];
    // Copy only defined properties that exist in our class
    propertiesToCopy.forEach(prop => {
      if (source[prop] !== undefined) {
        user[prop] = source[prop];
      }
    });
    return user;
  }

}

export class UserPositionProjection extends Resource {

  public name: string;

  public email: string;

  public organization: string;

  public createdDate: any;

  public expirationDate: any;

  public type: string;

  public territoryName: string;

  public userId: number;

  public territoryId: number;

  public static fromObject(source: any): UserPositionProjection {
    const user = new UserPositionProjection();
    // Define the properties to copy
    const propertiesToCopy = [
      // Resource properties
      'proxyUrl', 'rootUrl', '_links', '_subtypes',
      // User properties
      'id', 'name', 'email', 'organization', 'createdDate',
      'expirationDate', 'type', 'territoryName', 'userId', 'territoryId'
    ];
    // Copy only defined properties that exist in our class
    propertiesToCopy.forEach(prop => {
      if (source[prop] !== undefined) {
        user[prop] = source[prop];
      }
    });
    return user;
  }
}
