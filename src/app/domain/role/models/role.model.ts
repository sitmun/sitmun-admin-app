import { Resource } from '@app/core/hal/resource/resource.model';

/**
 * Role model
 */
export class Role extends Resource {
  /** id */
  public id: number;
  /** name*/
  public name: string;
  /** comments*/
  public description: string;

}
