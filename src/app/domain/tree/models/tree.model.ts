import { Resource } from '@app/core/hal/resource/resource.model';
import {TreeNode} from './tree-node.model';
import {Role} from '@app/domain/role/models/role.model';
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
  /** type */
  public type: string;
  /** image */
  public image: string;
  /** image name */
  public imageName: string;
  /** nodes */
  public nodes: TreeNode[];
  /** available roles */
  public availableRoles : Role[];

}
