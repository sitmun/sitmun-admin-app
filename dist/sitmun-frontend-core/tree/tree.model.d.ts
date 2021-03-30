import { Resource } from '../angular-hal/src/lib/resource';
import { TreeNode } from './tree-node.model';
import { Role } from '../role/role.model';
/**
 * Tree model
 */
export declare class Tree extends Resource {
    /** id */
    id: number;
    /** name */
    name: string;
    /** description */
    description: string;
    /** image */
    image: string;
    /** nodes */
    nodes: TreeNode[];
    /** available roles */
    availableRoles: Role[];
}
