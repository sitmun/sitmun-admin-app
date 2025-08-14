import {Resource} from '@app/core/hal/resource/resource.model';

/**
 * Territory type model
 */
export class TerritoryType extends Resource {
   /** id */
   public override id: number;
  /** name */
  public name: string;

  public official: boolean;

  public topType: boolean;

  public bottomType: boolean;
}
