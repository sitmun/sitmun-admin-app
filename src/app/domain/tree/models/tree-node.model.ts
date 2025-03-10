import { Resource } from '@app/core/hal';
import {Cartography} from '@app/domain/cartography/models/cartography.model';
import { Task } from '@app/domain/task/models/task.model';
import {Tree} from './tree.model';
/**
 * Tree node model
 */
export class TreeNode extends Resource {
  /** name */
  public name: string;
  /** type */
  public type: string;
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

  public image: string;
  public imageName: string;
  public task: Task;
  public viewMode: string;
  public filterable: boolean;  

}
