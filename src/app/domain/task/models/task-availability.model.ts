import {Resource} from '@app/core/hal/resource/resource.model';

import {Task, TaskProjection} from './task.model';
import {Territory, TerritoryProjection} from '../../territory/models/territory.model';

/**
 * Task availability model
 */
export class TaskAvailability extends Resource {
  /** id */
  public override id: number;

  public createdDate: string;

  /** territory*/
  public territory: Territory;
  /** task*/
  public task: Task;

  static of(task: Task, territory: Territory): TaskAvailability {
    const taskAvailability = new TaskAvailability();
    taskAvailability.task = task;
    taskAvailability.territory = territory;
    return taskAvailability;
  }
}

export class TaskAvailabilityProjection extends Resource{
  override id: number;
  createdDate: string;
  territoryId: number;
  territoryName: string;
  territoryCode: string;
  territoryTypeName: string;
  taskId: number;

  taskName: string;

  taskTypeName: string;
  taskGroupName: string;
  static of(task: TaskProjection, territory: TerritoryProjection): TaskAvailabilityProjection {
    const item = new TaskAvailabilityProjection();
    item.territoryId = territory.id;
    item.territoryName = territory.name;
    item.territoryCode = territory.code;
    item.territoryTypeName = territory.typeName;
    item.taskId = task.id;
    item.taskName = task.name;
    item.taskTypeName = task.typeName;
    item.taskGroupName = task.groupName;
    return item;
  }
}
