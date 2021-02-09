import { Resource } from '../angular-hal/src/lib/resource';
import { Role } from '../role/role.model';
import { Territory } from '../territory/territory.model';
import { User } from './user.model';
/**
 * User permission model
 */
export declare class UserConfiguration extends Resource {
    /** role */
    role: Role;
    /** territory */
    territory: Territory;
    /** user */
    user: User;
}
