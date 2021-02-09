import { Resource } from '../angular-hal/src/lib/resource';
import { TerritoryGroupType } from './territory-group-type.model';
import { TerritoryType } from './territory-type.model';
/**
 * Territory model
 */
export declare class Territory extends Resource {
    /** id */
    id: number;
    /** code */
    code: string;
    /** name */
    name: string;
    /** address*/
    territorialAuthorityAddress: string;
    /** admin */
    territorialAuthorityName: string;
    /** whether territory is blocked*/
    blocked: boolean;
    /** comments*/
    note: string;
    /** system created date*/
    createdDate: any;
    /** contact email */
    territorialAuthorityEmail: string;
    /** extension */
    extent: string;
    /** logo image URL */
    territorialAuthorityLogo: string;
    /** contact organization name */
    /** scope*/
    scope: string;
    /** type */
    type: TerritoryType;
    /** group type */
    groupType: TerritoryGroupType;
    /** territory members*/
    members: Territory[];
}
