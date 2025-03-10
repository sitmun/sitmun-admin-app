import { Resource } from '@app/core/hal';
import {CartographyGroup} from './cartography-group.model';
/**
 * Background model
 */
export class Background extends Resource {
  /** id */
  public id: number;  
  
  /** name*/
  public name: string;

  /** description*/
  public description: string;

  /** image */
  public image: string;

  /** whether background is active*/
  public active: Boolean;
  
  /** system created date*/
  public createdDate: any;

  /** cartography group*/
  public cartographyGroup: CartographyGroup;
}
