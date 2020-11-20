import { Resource } from '../angular-hal/src/lib/resource';
import { Territory } from '../territory/territory.model';
import { User } from './user.model';
/**
 * User position model
 */
export declare class UserPosition extends Resource {
    /** name */
    name: string;
    /** email */
    email: string;
    /** organization name*/
    organization: string;
    /** system created date*/
    createdDate: any;
    /** system dated date*/
    datedDate: any;
    /** position territory*/
    territory: Territory;
    /** user*/
    user: User;
}
