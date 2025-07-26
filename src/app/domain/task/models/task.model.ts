import { Resource } from '@app/core/hal/resource/resource.model';

import { Connection } from '@app/domain/connection/models/connection.model';
import { Role } from '@app/domain/role/models/role.model';
import { TaskType } from './task-type.model';
import { TaskGroup } from './task-group.model';
import { TaskAvailability } from './task-availability.model';
import { TaskParameter } from './task-parameter.model';
import { TaskUI } from './task-ui.model';
import { Cartography } from '@app/domain/cartography/models/cartography.model';
import { Service } from '@app/domain/service/models/service.model';

//FIXME ensure task creation in admin app upon initialization (as it is done with Roles and default Users)
/** GEOADMIN_task id */
export const GEOADMIN_TREE_TASK_ID = "geoadmin";

/** Task properties interface */
export interface TaskProperties {
  /** Query scope */
  scope: string | null;
  /** Query command */
  command: string | null;
  /** Result format */
  format: string | null;
  /** Path for target resource */
  path: string | null;
  /** Basic and Query parameters */
  parameters: any[];
  /** Cartography Query fields */
  fields: any[];
}

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
    // Ensure properties are initialized
    task.properties = Task.validateProperties(source.properties);
    return task;
  }

  /**
   * Validates and normalizes task properties structure
   * @param properties The properties object to validate
   * @returns A normalized TaskProperties object
   */
  static validateProperties(properties: any): TaskProperties {
    if (!properties || !(properties instanceof Object)) {
      return {
        scope: null,
        command: null,
        format: null,
        path: null,
        parameters: [],
        fields: []
      };
    }

    const result = { ...properties };

    result.scope = result?.scope ?? null;
    result.command = result?.command ?? null;
    result.format = result?.format ?? null;
    result.path = result?.path ?? null;

    if (!result?.parameters || !Array.isArray(result?.parameters) || !result?.parameters?.some(item => item instanceof Object)) {
      result.parameters = [];
    }

    if (!result?.fields || !Array.isArray(result?.fields) || !result?.fields?.some(item => item instanceof Object)) {
      result.fields = [];
    }

    return result;
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
  properties: TaskProperties = {
    scope: null,
    command: null,
    format: null,
    path: null,
    parameters: [],
    fields: []
  };
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
    // Ensure properties are initialized
    projection.properties = Task.validateProperties(source.properties);
    return projection;
  }
}
