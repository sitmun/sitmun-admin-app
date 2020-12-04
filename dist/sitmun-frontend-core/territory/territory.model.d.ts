import { Resource } from '../angular-hal/src/lib/resource';
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
    comments: string;
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
    groupType: {
        id: 0;
        name: string;
    };
    /** territory members*/
    members: Territory[];
}
