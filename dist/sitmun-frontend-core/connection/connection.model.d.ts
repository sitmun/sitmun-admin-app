import { Resource } from '../angular-hal/src/lib/resource';
/**
 * Connection model
 */
export declare class Connection extends Resource {
    /** id */
    id: number;
    /** name*/
    name: string;
    /** type*/
    type: string;
    /** user*/
    user: string;
    /** password*/
    password: string;
    /** connection string*/
    connectionString: string;
}
