import { Resource } from '../angular-hal/src/lib/resource';
import { TerritoryType } from './territory-type.model';
/**
 * Territory model
 */
export declare class Territory extends Resource {
    /** name */
    name: string;
    /** address*/
    address: string;
    /** whether territory is blocked*/
    blocked: boolean;
    /** comments*/
    comments: string;
    /** system created date*/
    createdDate: any;
    /** contact email */
    email: string;
    /** extension */
    ext: string;
    /** logo image URL */
    logo: string;
    /** contact organization name */
    organizationName: string;
    /** scope*/
    scope: string;
    /** type */
    type: TerritoryType;
    /** territory members*/
    members: Territory[];
}
