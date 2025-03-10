import { Resource } from '@app/core/hal';

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
