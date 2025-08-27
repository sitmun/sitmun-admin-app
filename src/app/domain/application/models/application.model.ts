import {ApplicationBackground, ApplicationParameter, User} from '@app/domain';
import {ApplicationTerritory} from "@app/domain/application/models/application-territory.model";
import {CartographyGroup} from '@app/domain/cartography/models/cartography-group.model';
import {Resource} from '@app/core/hal/resource/resource.model';
import {Role} from '@app/domain/role/models/role.model';
import {Tree} from '@app/domain/tree/models/tree.model';

import {constants} from "@environments/constants";

/**
 * Application model
 */

export class Application extends Resource {
  /** id */
  public override id: number;

  /** name*/
  public name: string;

  public description: string;

  public logo: string;

  /** type*/
  public type: string;

  /** title*/
  public title: string;

  /** theme*/
  public theme: string;

  public scales: string[];

  public srs: string

  /** urlTemplate*/
  public jspTemplate: string;

  public treeAutoRefresh: boolean;

  public accessParentTerritory: boolean;

  public accessChildrenTerritory: boolean;

  public situationMap: CartographyGroup;

  public createdDate: string;

  public parameters: ApplicationParameter[];

  public availableRoles: Role[];

  public trees: Tree[];

  public backgrounds: ApplicationBackground[];

  public territories: ApplicationTerritory[];

  public maintenanceInformation : string;

  public lastUpdate : Date;

  public creator? : User;

  public isUnavailable : boolean;

  public static readonly allProperties: string [] = [
    // Resource properties
    'proxyUrl', 'rootUrl', '_links', '_subtypes',
    // Application properties
    'id', 'name', 'description', 'logo', 'type', 'title', 'theme',
    'scales', 'srs', 'jspTemplate', 'treeAutoRefresh',
    'accessParentTerritory', 'accessChildrenTerritory',
    'situationMap', 'createdDate', 'parameters', 'availableRoles',
    'trees', 'backgrounds', 'territories', 'maintenanceInformation',
    'lastUpdate', 'creator', 'isUnavailable', 'appPrivate'
  ];

  /**
   * Creates a new Application instance copying only the properties declared in Application and Resource classes
   * @param source The source object to copy properties from
   * @returns A new Application instance with copied properties
   */
  public static fromObject(source: any): Application {
    const application = new Application();
    // Define the properties to copy
    let propertiesToCopy: string[];
    if (source.type === constants.codeValue.applicationType.internalApp) {
      propertiesToCopy = Application.internalApp
    } else if (source.type === constants.codeValue.applicationType.externalApp) {
      propertiesToCopy = Application.externalApp
    } else if (source.type === constants.codeValue.applicationType.touristicApp) {
      propertiesToCopy = Application.touristicApp
    } else {
      propertiesToCopy = Application.allProperties
    }
    // Copy only defined properties that exist in our class
    propertiesToCopy.forEach(prop => {
      if (source[prop] !== undefined) {
        application[prop] = source[prop];
      }
    });
    return application;
  }

  public static readonly externalApp: string [] = [
    // Resource properties
    'proxyUrl', 'rootUrl', '_links', '_subtypes',
    // Common application properties
    'id',  'name', 'description', 'logo', 'type',
    'createdDate', 'parameters', 'availableRoles',
    'trees', 'backgrounds', 'territories', 'maintenanceInformation',
    'lastUpdate', 'creator', 'isUnavailable', 'headerParams',
    // Specific application properties
    'jspTemplate', 'appPrivate'
  ]

  public static readonly internalApp: string [] = [
    // Resource properties
    'proxyUrl', 'rootUrl', '_links', '_subtypes',
    // Common application properties
    'id',  'name', 'description', 'logo', 'type',
    'createdDate', 'parameters', 'availableRoles',
    'trees', 'backgrounds', 'territories', 'maintenanceInformation',
    'lastUpdate', 'creator', 'isUnavailable',
    // Specific application properties
    'title', 'theme', 'scales', 'srs', 'treeAutoRefresh',
    'accessParentTerritory', 'accessChildrenTerritory',
    'situationMap', 'appPrivate', 'headerParams'
  ]

  public static readonly touristicApp: string [] = [
    // Resource properties
    'proxyUrl', 'rootUrl', '_links', '_subtypes',
    // Common application properties
    'id',  'name', 'description', 'logo', 'type',
    'createdDate', 'parameters', 'availableRoles',
    'trees', 'backgrounds', 'territories', 'maintenanceInformation',
    'lastUpdate', 'creator', 'isUnavailable', 'appPrivate', 'headerParams'
  ]

  public appPrivate: boolean;
}

export class ApplicationProjection extends Resource {
  override id: number;
  name: string;
  type: string;
  title: string;
  theme: string;
  scales: string[];
  srs: string;
  jspTemplate: string;
  treeAutoRefresh: boolean;
  accessParentTerritory: boolean;
  accessChildrenTerritory: boolean;
  situationMapId: number;
  createdDate: string;
  logo: string;
  description: string;
  maintenanceInformation : string;
  lastUpdate : Date;
  creatorId : string;
  isUnavailable : boolean;

  appPrivate: boolean;

  warnings?: string[];

  headerParams: any;

  /**
   * Creates a new ApplicationProjection instance copying only the properties declared in ApplicationProjection and Resource classes
   * @param source The source object to copy properties from
   * @returns A new ApplicationProjection instance with copied properties
   */
  public static fromObject(source: any): ApplicationProjection {
    const projection = new ApplicationProjection();
    const propertiesToCopy = [
      // Resource properties
      'proxyUrl', 'rootUrl', '_links', '_subtypes',
      // ApplicationProjection properties
      'id', 'name', 'type', 'title', 'theme', 'scales', 'srs', 'jspTemplate',
      'treeAutoRefresh', 'accessParentTerritory', 'accessChildrenTerritory',
      'situationMapId', 'createdDate', 'logo', 'description',
      'maintenanceInformation', 'lastUpdate', 'creatorId', 'isUnavailable',
      'appPrivate', 'warnings'
    ];
    propertiesToCopy.forEach(prop => {
      if (source[prop] !== undefined) {
        projection[prop] = source[prop];
      }
    });
    return projection;
  }
}

