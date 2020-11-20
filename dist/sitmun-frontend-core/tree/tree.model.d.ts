import { Resource } from '../angular-hal/src/lib/resource';
import { TreeNode } from './tree-node.model';
import { Role } from '../role/role.model';
/**
 * Tree model
 */
export declare class Tree extends Resource {
    /** name */
    name: string;
    /** nodes */
    nodes: TreeNode[];
    /** available roles */
    availableRoles: Role[];
}
