import { Resource } from '../angular-hal/src/lib/resource';
import { Cartography } from './cartography.model';
import { Role } from '../role/role.model';
/**
 * Cartography group
 */
export declare class CartographyGroup extends Resource {
    /** id */
    id: number;
    /** name*/
    name: string;
    /** type*/
    type: string;
    /** members*/
    members: Cartography[];
    /** roles*/
    roles: Role[];
}
