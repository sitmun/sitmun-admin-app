import {Resource} from '../angular-hal/src/lib/resource';
import {TreeNode} from './tree-node.model';
import {Role} from '../role/role.model';    
/**
 * Tree model
 */
export class Tree extends Resource {
  /** id */
  public id: number;
  /** name */
  public name: string;
  /** description */
  public description: string;
  /** image */
  public image: string;
  /** nodes */
  public nodes: TreeNode[];
  /** available roles */
  public availableRoles : Role[];

}
