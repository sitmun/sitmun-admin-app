import {Resource} from '../angular-hal/src/lib/resource';
import {Tree} from '../tree/tree.model';
import {Role} from '../role/role.model';
import {CartographyGroup} from '../cartography/cartography-group.model';
import {ApplicationParameter} from './application-parameter.model';
import {ApplicationBackground} from './application-background.model';

//FIXME ensure application creation in admin app upon initialization (as it is done with Roles and default Users)
/** Territorial appliction name */
export const TERRITORIAL_APP_NAME:string  = "Aplicación Territorial";

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
  public treeAutoRefresh: Boolean;

  /** backgrounds*/
  public backgrounds: ApplicationBackground[];

  /** situation map*/
  public situationMap: CartographyGroup;    
  
  /** parameters*/
  public parameters: ApplicationParameter[];
}
