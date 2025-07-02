import { Resource } from '@app/core/hal/resource/resource.model';
import {
  ApplicationTerritory,
  TaskAvailability,
  UserConfiguration,
  UserPosition,
  TerritoryGroupType,
  TerritoryType,
} from "@app/domain";

/**
 * Territory model
 */
export class Territory extends Resource {
  /** id */
  public override id: number;
  /** code */
  public code: string;
  /** name */
  public name: string;
  /** description */
  public description: string;
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
  public center: string;
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
  public defaultZoomLevel: number;
  public legal: string;
  public srs: string;
  public membersOf: Territory[];
  public taskAvailability: TaskAvailability[];
  public positions: UserPosition[];
  public userConfigurations: UserConfiguration[];
  public applications: ApplicationTerritory[];
}

export class TerritoryProjection extends Resource {
  override id: number;
  code: string;
  name: string;
  description: string;
  territorialAuthorityName: string;
  territorialAuthorityAddress: string;
  territorialAuthorityEmail: string;
  scope: string;
  territorialAuthorityLogo: string;
  extent: string;
  blocked: boolean;
  note: string;
  createdDate: string;
  groupTypeId: number;
  groupTypeName: string;
  typeId: number;
  typeName: string;
  typeTopType: boolean;
  typeBottomType: boolean;
  center: string;
  defaultZoomLevel: number;
  srs: string;
}

