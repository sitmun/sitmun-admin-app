import { Resource } from '@app/core/hal/resource/resource.model';
import {Cartography} from '@app/domain/cartography/models/cartography.model';
import { Task } from '@app/domain/task/models/task.model';
import {Tree} from '@app/domain';
/**
 * Tree node model
 */
export class TreeNode extends Resource {
  /** id */
  public id: number;
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

  public loadData: boolean;
  public queryableActive: boolean;
  public image: string;
  public imageName: string;
  public task: Task;
  public viewMode: string;
  public filterable: boolean;
  public mapping: Map<string, any>;

  /**
   * Creates a new TreeNode instance copying only the properties declared in TreeNode and Resource classes
   * @param source The source object to copy properties from
   * @returns A new TreeNode instance with copied properties
   */
  public static fromObject(source: any): TreeNode {
    const node = new TreeNode();
    // Define the properties to copy
    const propertiesToCopy = [
      // Resource properties
      'proxyUrl', 'rootUrl', '_links', '_subtypes',
      // TreeNode properties
      'id', 'name', 'type', 'tooltip', 'description', 'datasetURL', 'metadataURL',
      'order', 'active', 'radio', 'parent', 'cartography', 'tree', 'filterGetFeatureInfo',
      'filterGetMap', 'filterSelectable', 'style', 'loadData', 'queryableActive',
      'image', 'imageName', 'task', 'viewMode', 'filterable', 'mapping'
    ];
    // Copy only defined properties that exist in our class
    propertiesToCopy.forEach(prop => {
      if (source[prop] !== undefined) {
        node[prop] = source[prop];
      }
    });
    return node;
  }
}

export class TreeNodeProjection extends Resource {
  parent: number;
  id: number;
  name: string;
  description: string;
  nodeType: string;
  tooltip: string;
  active: boolean;
  radio: boolean;
  order: number;
  metadataURL: string;
  datasetURL: string;
  filterGetMap: boolean;
  filterGetFeatureInfo: boolean;
  queryableActive: boolean;
  filterSelectable: boolean;
  isFolder: boolean;
  cartographyName: string;
  cartographyId: number;
  taskName: string;
  taskId: number;
  treeId: number;
  treeName: string;
  style: string;
  image: string;
  imageName: string;
  viewMode: string;
  filterable: boolean;
  mapping: Map<string, any>;

  /**
   * Creates a new TreeNodeProjection instance copying only the properties declared in TreeNodeProjection and Resource classes
   * @param source The source object to copy properties from
   * @returns A new TreeNodeProjection instance with copied properties
   */
  public static fromObject(source: any): TreeNodeProjection {
    const projection = new TreeNodeProjection();
    // Define the properties to copy
    const propertiesToCopy = [
      // Resource properties
      'proxyUrl', 'rootUrl', '_links', '_subtypes',
      // TreeNodeProjection properties
      'parent', 'id', 'name', 'description', 'nodeType', 'tooltip', 'active',
      'radio', 'order', 'metadataURL', 'datasetURL', 'filterGetMap',
      'filterGetFeatureInfo', 'queryableActive', 'filterSelectable', 'isFolder',
      'cartographyName', 'cartographyId', 'taskName', 'taskId', 'treeId',
      'treeName', 'style', 'image', 'imageName', 'viewMode', 'filterable', 'mapping'
    ];
    // Copy only defined properties that exist in our class
    propertiesToCopy.forEach(prop => {
      if (source[prop] !== undefined) {
        projection[prop] = source[prop];
      }
    });
    return projection;
  }
}
