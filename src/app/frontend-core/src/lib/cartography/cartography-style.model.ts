import {Resource} from '../angular-hal/src/lib/resource';
import {Cartography} from './cartography.model'; 
/**
 * Cartography style model
 */
export class CartographyStyle extends Resource {
  /** name*/
  public name: string;
  
  /** title*/
  public title: string;
    
  /** description*/  
  public description: string;
  
  /** format*/  
  public format: string;
  
  /** width*/  
  public width: number;
  
  /** height*/  
  public height: number;
  
  /** url*/  
  public url: string;

  /** cartography*/
  public cartography: Cartography;

  public defaultStyle: boolean;

  public legendURL: any;
  

}
