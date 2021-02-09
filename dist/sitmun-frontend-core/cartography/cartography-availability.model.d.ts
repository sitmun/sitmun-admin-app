import { Resource } from '../angular-hal/src/lib/resource';
import { Territory } from '../territory/territory.model';
import { Cartography } from './cartography.model';
/**
 * Cartography availability model
 */
export declare class CartographyAvailability extends Resource {
    /** territory*/
    territory: Territory;
    /** system created date*/
    createdDate: any;
    /** cartography*/
    cartography: Cartography;
}
