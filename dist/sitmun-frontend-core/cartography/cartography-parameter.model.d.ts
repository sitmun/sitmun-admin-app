import { Resource } from '../angular-hal/src/lib/resource';
import { Cartography } from './cartography.model';
/**
 * Service parameter model
 */
export declare class CartographyParameter extends Resource {
    /** name*/
    name: string;
    /** type*/
    type: string;
    /** value*/
    value: string;
    /** order*/
    order: string;
    /** cartography*/
    cartography: Cartography;
}
