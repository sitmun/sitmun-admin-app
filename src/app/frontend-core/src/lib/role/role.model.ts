import {Resource} from '../angular-hal/src/lib/resource';

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
