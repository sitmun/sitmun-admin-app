import { Resource } from '@app/core/hal/resource/resource.model';
import {Cartography} from './cartography.model';
import {Role} from '@app/domain/role/models/role.model';
/**
 * Cartography group
 */
export class CartographyGroup extends Resource {
  /** id */
  public id: number;  
  /** name*/
  public name: string;
  /** type*/
  public type: string;
  /** members*/
  public members: Cartography[];
  /** roles*/
  public roles: Role[];

}
