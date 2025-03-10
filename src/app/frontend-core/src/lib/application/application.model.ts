import { Resource } from '@app/core/hal';
import {Tree} from '../tree/tree.model';
import {Role} from '../role/role.model';
import {CartographyGroup} from '../cartography/cartography-group.model';
import {ApplicationParameter} from './application-parameter.model';
import {ApplicationBackground} from './application-background.model';

/**
 * Application model
 */
export class Application extends Resource {
  /** id */
  public id: number;

  /** name*/
  public name: string;

  /** type*/
  public type: string;

  /** title*/
  public title: string;

  /** theme*/
  public theme: string;

  /** urlTemplate*/
  public jspTemplate: string;

  /** urlTemplate*/
  public logo: string;

  /**
   * If a user has an extended role in a territory, it can be used with this application.
   */
  public accessParentTerritory: boolean;

  /**
   * If a user has an extended role in a territory, it can be used with the territory children of such territory.
   */
  public accessChildrenTerritory: boolean;

  /** system created date*/
  public createdDate: any;

  /** available roles*/
  public availableRoles : Role[];

  /** trees*/
  public trees : Tree[];

  /** scales (comma-separated values)*/
  public scales: string[];

  /** projections(comma-separated EPSG codes)*/
  public srs: string;

  /** whether application tree will auto refresh*/
  public treeAutoRefresh: boolean;

  /** backgrounds*/
  public backgrounds: ApplicationBackground[];

  /** situation map*/
  public situationMap: CartographyGroup;

  /** parameters*/
  public parameters: ApplicationParameter[];

  public situationMapId: number;

  public passwordSet: boolean;

  public description: string;
}
