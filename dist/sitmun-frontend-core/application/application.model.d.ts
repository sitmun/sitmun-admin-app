import { Resource } from '../angular-hal/src/lib/resource';
import { Tree } from '../tree/tree.model';
import { Role } from '../role/role.model';
import { CartographyGroup } from '../cartography/cartography-group.model';
import { ApplicationParameter } from './application-parameter.model';
import { ApplicationBackground } from './application-background.model';
/** Territorial appliction name */
export declare const TERRITORIAL_APP_NAME: string;
/**
 * Application model
 */
export declare class Application extends Resource {
    /** name*/
    name: string;
    /** type*/
    type: string;
    /** title*/
    title: string;
    /** theme*/
    theme: string;
    /** system created date*/
    createdDate: any;
    /** available roles*/
    availableRoles: Role[];
    /** trees*/
    trees: Tree[];
    /** scales (comma-separated values)*/
    scales: string;
    /** projections(comma-separated EPSG codes)*/
    projections: string;
    /** whether application tree will auto refresh*/
    treeAutoRefresh: Boolean;
    /** backgrounds*/
    backgrounds: ApplicationBackground[];
    /** situation map*/
    situationMap: CartographyGroup;
    /** parameters*/
    parameters: ApplicationParameter[];
}
