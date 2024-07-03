import {Resource} from '../angular-hal/src/lib/resource';
import {Cartography} from '../cartography/cartography.model';
import {Tree} from './tree.model';
/**
 * Tree node model
 */
export class TreeNode extends Resource {
  /** name */
  public name: string;
  /** tooltip*/
  public tooltip: string;
  /** description*/
  public description: string;
  /** datasetURL*/
  public datasetURL: string;
  /** metadataURL*/
  public metadataURL: string;
  /** order*/
  public order : number;
  /** whether tree node is active*/
  public active: boolean;
  /** parent tree node */
  public radio: boolean;
  /** parent tree node */
  public parent: TreeNode;
  /** displayed cartography */  
  public cartography: Cartography;
  /** tree */  
  public tree: Tree;
  /** filterGetFeatureInfo */  
  public filterGetFeatureInfo: boolean;
  /** filterGetMap */  
  public filterGetMap: boolean;
  /** filterSelectable */  
  public filterSelectable: boolean;
  /** style */  
  public style: string;
  

}
