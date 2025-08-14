import { Resource } from '@app/core/hal/resource/resource.model';

/**
 * Territory type model
 */
export class TerritoryGroupType extends Resource {
  /** id */
  public override id: number;  
  /** name */
  public name: string;
}
