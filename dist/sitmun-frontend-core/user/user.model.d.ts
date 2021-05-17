import { Resource } from '../angular-hal/src/lib/resource';
import { UserConfiguration } from './user-configuration.model';
import { UserPosition } from './user-position.model';
/**
 * User model
 */
export declare class User extends Resource {
    /** id */
    id: number;
    /** username */
    username: string;
    /** password */
    password: string;
    /** first name */
    firstName: string;
    /** last name */
    lastName: string;
    /** whether user is blocked */
    blocked: boolean;
    /** whether user is administrator */
    administrator: boolean;
    /** Is passwordSet */
    passwordSet: boolean;
    /** user positions */
    positions: UserPosition[];
    /** user permissions */
    permissions: UserConfiguration[];
}
