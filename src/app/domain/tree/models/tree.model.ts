import {Resource} from '@app/core/hal/resource/resource.model';
import {Application, TreeNode} from '@app/domain';
import {Role} from '@app/domain/role/models/role.model';

/**
 * Tree model
 */
export class Tree extends Resource {
  /** id */
  public override id: number;
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
  public allNodes: TreeNode[];
  /** available roles */
  public availableRoles : Role[];
  /** available applications */
  public availableApplications: Application[];

  /**
   * Creates a new Tree instance copying only the properties declared in Tree and Resource classes
   * @param source The source object to copy properties from
   * @returns A new Tree instance with copied properties
   */
  public static fromObject(source: any): Tree {
    const tree = new Tree();
    // Define the properties to copy
    const propertiesToCopy = [
      // Resource properties
      'proxyUrl', 'rootUrl', '_links', '_subtypes',
      // Tree properties
      'id', 'name', 'description', 'type', 'image', 'imageName',
      'allNodes', 'availableRoles', 'availableApplications'
    ];
    // Copy only defined properties that exist in our class
    propertiesToCopy.forEach(prop => {
      if (source[prop] !== undefined) {
        tree[prop] = source[prop];
      }
    });
    return tree;
  }
}
