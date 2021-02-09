import { Resource } from '../angular-hal/src/lib/resource';
import { CartographyGroup } from './cartography-group.model';
/**
 * Background model
 */
export declare class Background extends Resource {
    /** id */
    id: number;
    /** name*/
    name: string;
    /** description*/
    description: string;
    /** whether background is active*/
    active: Boolean;
    /** system created date*/
    createdDate: any;
    /** cartography group*/
    cartographyGroup: CartographyGroup;
}
