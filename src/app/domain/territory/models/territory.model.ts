import {
  ApplicationTerritory,
  TaskAvailability,
  TerritoryGroupType,
  TerritoryType,
  UserConfiguration,
  UserPosition,
} from "@app/domain";
import {Resource} from '@app/core/hal/resource/resource.model';

export class Envelope {
  public minX: number;

  public minY: number;

  public maxX: number;

  public maxY: number;
}

export class Point {
  public x: number;

  public y: number;
}

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
  public extent: Envelope;

  public center: Point;
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

  /**
   * Creates a new Territory instance copying only the properties declared in Territory and Resource classes
   * @param source The source object to copy properties from
   * @returns A new Territory instance with copied properties
   */
  public static fromObject(source: any): Territory {
    const territory = new Territory();
    // Define the properties to copy
    const propertiesToCopy = [
      // Resource properties
      'proxyUrl', 'rootUrl', '_links', '_subtypes',
      // Territory properties
      'id', 'code', 'name', 'description', 'territorialAuthorityAddress',
      'territorialAuthorityName', 'blocked', 'note', 'createdDate',
      'territorialAuthorityEmail', 'extent', 'center', 'territorialAuthorityLogo',
      'scope', 'type', 'groupType', 'members', 'defaultZoomLevel', 'legal',
      'srs', 'membersOf', 'taskAvailability', 'positions', 'userConfigurations',
      'applications'
    ];
    // Copy only defined properties that exist in our class
    propertiesToCopy.forEach(prop => {
      if (source[prop] !== undefined) {
        territory[prop] = source[prop];
      }
    });
    return territory;
  }
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

  extent: Envelope;
  blocked: boolean;
  note: string;

  createdDate: any;
  groupTypeId: number;
  groupTypeName: string;
  typeId: number;
  typeName: string;
  typeTopType: boolean;
  typeBottomType: boolean;

  center: Point;
  defaultZoomLevel: number;
  srs: string;

  /**
   * Creates a new TerritoryProjection instance copying only the properties declared in TerritoryProjection and Resource classes
   * @param source The source object to copy properties from
   * @returns A new TerritoryProjection instance with copied properties
   */
  public static fromObject(source: any): TerritoryProjection {
    const projection = new TerritoryProjection();
    // Define the properties to copy
    const propertiesToCopy = [
      // Resource properties
      'proxyUrl', 'rootUrl', '_links', '_subtypes',
      // TerritoryProjection properties
      'id', 'code', 'name', 'description', 'territorialAuthorityName',
      'territorialAuthorityAddress', 'territorialAuthorityEmail', 'scope',
      'territorialAuthorityLogo', 'extent', 'blocked', 'note', 'createdDate',
      'groupTypeId', 'groupTypeName', 'typeId', 'typeName', 'typeTopType',
      'typeBottomType', 'center', 'defaultZoomLevel', 'srs'
    ];
    // Copy only defined properties that exist in our class
    propertiesToCopy.forEach(prop => {
      if (source[prop] !== undefined) {
        projection[prop] = source[prop];
      }
    });
    return projection;
  }
}

