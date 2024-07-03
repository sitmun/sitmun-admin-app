import {Resource} from '../angular-hal/src/lib/resource';
import {Cartography} from './cartography.model'; 
/**
 * Service parameter model
 */
export class CartographyParameter extends Resource {
  /** name*/
  public name: string;
  
  /** type*/
  public type: string;
    
  /** value*/  
  public value: string;
  
  /** order*/  
  public order: string;

  /** cartography*/
  public cartography: Cartography;

}
