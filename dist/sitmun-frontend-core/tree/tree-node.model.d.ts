import { Resource } from '../angular-hal/src/lib/resource';
import { Cartography } from '../cartography/cartography.model';
import { Tree } from './tree.model';
/**
 * Tree node model
 */
export declare class TreeNode extends Resource {
    /** name */
    name: string;
    /** tooltip*/
    tooltip: string;
    /** description*/
    description: string;
    /** datasetURL*/
    datasetURL: string;
    /** metadataURL*/
    metadataURL: string;
    /** order*/
    order: number;
    /** whether tree node is active*/
    active: boolean;
    /** parent tree node */
    radio: boolean;
    /** parent tree node */
    parent: TreeNode;
    /** displayed cartography */
    cartography: Cartography;
    /** tree */
    tree: Tree;
}
