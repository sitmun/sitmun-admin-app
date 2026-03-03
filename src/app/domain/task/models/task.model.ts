import { Resource } from '@app/core/hal/resource/resource.model';

import {TaskAvailability} from './task-availability.model';
import {TaskGroup} from './task-group.model';
import {TaskParameter} from './task-parameter.model';
import { TaskProperties, TaskPropertiesContract } from './task-properties';
import {TaskType} from './task-type.model';
import {TaskUI} from './task-ui.model';
import { Cartography } from '../../cartography/models/cartography.model';
import { Connection } from '../../connection/models/connection.model';
import { Role } from '../../role/models/role.model';
import { Service } from '../../service/models/service.model';


//FIXME ensure task creation in admin app upon initialization (as it is done with Roles and default Users)
/** GEOADMIN_task id */
export const GEOADMIN_TREE_TASK_ID = "geoadmin";

/** Task model */
export class Task extends Resource {
  /** id */
  public override id: number;
  /** name */
  public name?: string;
  /** order*/
  public order?: number;
  /** system created date*/
  public createdDate?: any;
  /** task group*/
  public group?: TaskGroup | string;
  /** task type*/
  public type?: TaskType | string;
  /** task UI*/
  public ui?: TaskUI;
  /** parameters*/
  public parameters?: TaskParameter[];
  /** connection*/
  public connection?: Connection;
  /** roles*/
  public roles?: Role[];
  /** availabilities*/
  public availabilities?: TaskAvailability[];
  /** cartography */
  public cartography?: Cartography;
  /** service */
  public service?: Service;
  /** task properties */
  public properties?: TaskProperties;

  /**
   * Creates a new Task instance copying only the properties declared in Task and Resource classes
   * @param source The source object to copy properties from
   * @returns A new Task instance with copied properties
   */
  public static fromObject(source: any): Task {
    const task = new Task();
    // Define the properties to copy
    const propertiesToCopy = [
      // Resource properties
      'proxyUrl', 'rootUrl', '_links', '_subtypes',
      // Task properties
      'id', 'name', 'order', 'createdDate', 'group', 'type',
      'ui', 'parameters', 'connection', 'roles',
      'availabilities', 'cartography', 'service', 'properties'
    ];
    // Copy only defined properties that exist in our class
    propertiesToCopy.forEach(prop => {
      if (source[prop] !== undefined) {
        task[prop] = source[prop];
      }
    });
    // Ensure properties are initialized as opaque record.
    task.properties = TaskPropertiesContract.fromRaw(source.properties);
    return task;
  }
}

export class TaskProjection extends Resource {
  override id: number;
  name: string;
  createdDate: string;
  order: number;
  groupName: string;
  groupId: number;
  uiId: number;
  properties: TaskProperties = {};
  serviceId: number;
  serviceName: string;
  cartographyId: number;
  cartographyName: string;
  connectionId: number;
  connectionName: string;
  typeId: number;
  typeName: string;

  /**
   * Creates a new TaskProjection instance copying only the properties declared in TaskProjection and Resource classes
   * @param source The source object to copy properties from
   * @returns A new TaskProjection instance with copied properties
   */
  public static fromObject(source: any): TaskProjection {
    const projection = new TaskProjection();
    // Define the properties to copy
    const propertiesToCopy = [
      // Resource properties
      'proxyUrl', 'rootUrl', '_links', '_subtypes',
      // TaskProjection properties
      'id', 'name', 'createdDate', 'order', 'groupName', 'groupId',
      'uiId', 'properties', 'serviceId', 'serviceName',
      'cartographyId', 'cartographyName', 'typeId', 'typeName',
      'connectionId', 'connectionName'
    ];
    // Copy only defined properties that exist in our class
    propertiesToCopy.forEach(prop => {
      if (source[prop] !== undefined) {
        projection[prop] = source[prop];
      }
    });
    // Ensure properties are initialized as opaque record.
    projection.properties = TaskPropertiesContract.fromRaw(source.properties);
    return projection;
  }
}
