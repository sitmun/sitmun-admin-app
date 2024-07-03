import {Resource} from '../angular-hal/src/lib/resource';

/**
 * Service model
 */
export class ConfigurationParameter extends Resource {
  /** id */
  public id: number;
  /** name*/
  public name: string;
    
  /** value*/
  public value: string;

}
