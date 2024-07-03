import {Resource} from '../angular-hal/src/lib/resource';
import { TerritoryGroupType } from './territory-group-type.model';
import { TerritoryType } from './territory-type.model';

/**
 * Territory model
 */
export class Territory extends Resource {
  /** id */
  public id: number;  
  /** code */
  public code: string;
  /** name */
  public name: string;
  /** address*/
  public territorialAuthorityAddress: string;
  /** admin */
  public territorialAuthorityName: string;
  /** whether territory is blocked*/
  public blocked: boolean;
  /** comments*/
  public note: string;
  /** system created date*/
  public createdDate: any;
  /** contact email */  
  public territorialAuthorityEmail: string;
  /** extension */
  public extent: string;
  /** logo image URL */
  public territorialAuthorityLogo: string;
  /** contact organization name */
  // public organizationName: string;
  /** scope*/
  public scope: string;
  /** type */  
  public type: TerritoryType;
  /** group type */
  public groupType: TerritoryGroupType;
  /** territory members*/
  public members: Territory[];

}
