import {Resource} from '@app/core/hal/resource/resource.model';

/**
 * Task type model
 */
export class TaskType extends Resource {

  public override id: number;

  /** name */
  public name: string;

  /** title */
  public title: string;

  /** enabled flag */
  public enabled: boolean;

  /** parent task type */
  public parent: TaskType;

  /** parent task type ID (from API) */
  public parentId: number;

  /** order */
  public order: number;

  /** specification (JSON) */
  public specification: Map<string, any>;

  /** whether this task type has children (computed property from backend) */
  public folder: boolean;

  /**
   * Creates a new TaskType instance copying only the properties declared in TaskType and Resource classes
   * @param source The source object to copy properties from
   * @returns A new TaskType instance with copied properties
   */
  public static fromObject(source: any): TaskType {
    const taskType = new TaskType();
    const propertiesToCopy = [
      'proxyUrl', 'rootUrl', '_links', '_subtypes',
      'id', 'name', 'title', 'enabled', 'parent', 'parentId', 'order', 'specification', 'folder'
    ];
    propertiesToCopy.forEach(prop => {
      if (source[prop] !== undefined) {
        taskType[prop] = source[prop];
      }
    });
    return taskType;
  }
}

/**
 * Task type projection model with parent relationship
 */
export class TaskTypeProjection extends Resource {

  public override id: number;

  /** name */
  public name: string;

  /** title */
  public title: string;

  /** enabled flag */
  public enabled: boolean;

  /** parent task type */
  public parent: TaskType;

  /** parent task type ID (from API) */
  public parentId: number;

  /** order */
  public order: number;

  /** specification (JSON) */
  public specification: Map<string, any>;

  /** whether this task type has children (computed property from backend) */
  public folder: boolean;

  /**
   * Creates a new TaskTypeProjection instance copying only the properties declared in TaskTypeProjection and Resource classes
   * @param source The source object to copy properties from
   * @returns A new TaskTypeProjection instance with copied properties
   */
  public static fromObject(source: any): TaskTypeProjection {
    const taskType = new TaskTypeProjection();
    const propertiesToCopy = [
      'proxyUrl', 'rootUrl', '_links', '_subtypes',
      'id', 'name', 'title', 'enabled', 'parent', 'parentId', 'order', 'specification', 'folder'
    ];
    propertiesToCopy.forEach(prop => {
      if (source[prop] !== undefined) {
        taskType[prop] = source[prop];
      }
    });
    return taskType;
  }
}
