import { Resource } from '../angular-hal/src/lib/resource';
import { Cartography } from './cartography.model';
/**
 * Cartography style model
 */
export declare class CartographyStyle extends Resource {
    /** name*/
    name: string;
    /** title*/
    title: string;
    /** description*/
    description: string;
    /** format*/
    format: string;
    /** width*/
    width: number;
    /** height*/
    height: number;
    /** url*/
    url: string;
    /** cartography*/
    cartography: Cartography;
    defaultStyle: boolean;
    legendURL: any;
}
