import {Resource} from '../angular-hal/src/lib/resource';
import { TerritoryType } from '../territory/territory-type.model';
import { Cartography } from './cartography.model';
/**
 * Cartography availability model
 */
export class CartographyFilter extends Resource {
 
  /** name*/
  public name: string;

  /** required */
  public required: boolean;

  /** type*/
  public type: string;

  /** Territorial level. */
  public territorialLevel: TerritoryType;
  
  /** column */
  public column: string;

  /** values*/  
  public values: string;

  /** value*/  
  public valueType: string;

  /** cartography*/
  public cartography: Cartography;


}
