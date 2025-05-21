import {Resource} from '@app/core/hal/resource/resource.model';
import {Tree} from '@app/domain/tree/models/tree.model';
import {Role} from '@app/domain/role/models/role.model';
import {CartographyGroup} from '@app/domain/cartography/models/cartography-group.model';
import {ApplicationParameter} from './application-parameter.model';
import {ApplicationBackground} from './application-background.model';
import {ApplicationTerritory} from "@app/domain/application/models/application-territory.model";
import {constants} from "@environments/constants";

/**
 * Application model
 */

export class Application extends Resource {
  /** id */
  public id: number;

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

  public static allProperties: string [] = [
    // Resource properties
    'proxyUrl', 'rootUrl', '_links', '_subtypes',
    // Application properties
    'id', 'name', 'description', 'logo', 'type', 'title', 'theme',
    'scales', 'srs', 'jspTemplate', 'treeAutoRefresh',
    'accessParentTerritory', 'accessChildrenTerritory',
    'situationMap', 'createdDate', 'parameters', 'availableRoles',
    'trees', 'backgrounds', 'territories', 'maintenanceInformation',
    'lastUpdate', 'creatorId', 'isUnavailable'
  ];

  public static externalApp: string [] = [
    // Resource properties
    'proxyUrl', 'rootUrl', '_links', '_subtypes',
    // Common application properties
    'id',  'name', 'description', 'logo', 'type',
    'createdDate', 'parameters', 'availableRoles',
    'trees', 'backgrounds', 'territories',
    // Specific application properties
    'jspTemplate', 'maintenanceInformation',
    'lastUpdate', 'creatorId', 'isUnavailable'
  ]

  public static internalApp: string [] = [
    // Resource properties
    'proxyUrl', 'rootUrl', '_links', '_subtypes',
    // Common application properties
    'id',  'name', 'description', 'logo', 'type',
    'createdDate', 'parameters', 'availableRoles',
    'trees', 'backgrounds', 'territories',
    // Specific application properties
    'title', 'theme', 'scales', 'srs', 'treeAutoRefresh',
    'accessParentTerritory', 'accessChildrenTerritory',
    'situationMap', 'maintenanceInformation',
    'lastUpdate', 'creatorId', 'isUnavailable'
  ]

  public static touristicApp: string [] = [
    // Resource properties
    'proxyUrl', 'rootUrl', '_links', '_subtypes',
    // Common application properties
    'id',  'name', 'description', 'logo', 'type',
    'createdDate', 'parameters', 'availableRoles',
    'trees', 'backgrounds', 'territories', 'maintenanceInformation',
    'lastUpdate', 'creatorId', 'isUnavailable'
  ]
}

export class ApplicationProjection extends Resource {
  id: number;
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
      'situationMapId', 'createdDate', 'logo', 'description', 'maintenanceInformation',
      'lastUpdate', 'creatorId', 'isUnavailable'
    ];
    propertiesToCopy.forEach(prop => {
      if (source[prop] !== undefined) {
        projection[prop] = source[prop];
      }
    });
    return projection;
  }
}

