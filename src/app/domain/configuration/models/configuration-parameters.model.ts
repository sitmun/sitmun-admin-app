import {Resource} from '@app/core/hal/resource/resource.model';

/**
 * Service model
 */
export class ConfigurationParameter extends Resource {
  /** id */
  public override id: number;
  /** name*/
  public name: string;

  /** value*/
  public value: string;

}
