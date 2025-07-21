import {Resource} from '@app/core/hal/resource/resource.model';
import {UserConfiguration} from './user-configuration.model';
import {UserPosition} from './user-position.model';

/**
 * User model
 */
export class User extends Resource {
  /** id */
  public override id: number;
  /** username */
  public username: string;
  /** password */
  public password: string;
  /** first name */
  public firstName: string;
  /** last name */
  public lastName: string;
  /** email */
  public email: string;
  /** whether user is blocked */
  public blocked: boolean;
  /** whether user is administrator */
  public administrator: boolean;
  /** Is passwordSet */
  public passwordSet: boolean;
  /** user positions */
  public positions: UserPosition[];
  /** user permissions */
  public permissions: UserConfiguration[];

  /**
   * Creates a new User instance copying only the properties declared in User and Resource classes
   * @param source The source object to copy properties from
   * @returns A new User instance with copied properties
   */
  public static fromObject(source: any): User {
    const user = new User();
    // Define the properties to copy
    const propertiesToCopy = [
      // Resource properties
      'proxyUrl', 'rootUrl', '_links', '_subtypes',
      // User properties
      'id', 'username', 'password', 'firstName', 'lastName', 'email',
      'blocked', 'administrator', 'passwordSet', 'positions', 'permissions'
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
