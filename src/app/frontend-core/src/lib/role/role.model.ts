import { Resource } from '@app/core/hal';

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
