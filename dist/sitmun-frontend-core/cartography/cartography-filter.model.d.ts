import { Resource } from '../angular-hal/src/lib/resource';
import { TerritoryType } from '../territory/territory-type.model';
import { Cartography } from './cartography.model';
/**
 * Cartography availability model
 */
export declare class CartographyFilter extends Resource {
    /** name*/
    name: string;
    /** required */
    required: boolean;
    /** type*/
    type: string;
    /** Territorial level. */
    territorialLevel: TerritoryType;
    /** column */
    column: string;
    /** values*/
    values: string;
    /** value*/
    valueType: string;
    /** cartography*/
    cartography: Cartography;
}
