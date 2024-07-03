import {Resource} from '../angular-hal/src/lib/resource';
import { UserConfiguration } from './user-configuration.model';
import { UserPosition } from './user-position.model';

/**
 * User model
 */
export class User extends Resource {
  /** id */
  public id: number;  
  /** username */
  public username: string;
  /** password */
  public password: string;
  /** first name */
  public firstName: string;
  /** last name */
  public lastName: string;
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
}
