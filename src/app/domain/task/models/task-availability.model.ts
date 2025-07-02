import { Resource } from '@app/core/hal/resource/resource.model';
import {Territory, TerritoryProjection} from '@app/domain/territory/models/territory.model';
import {Task, TaskProjection} from './task.model';
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
  taskGroupName: string;
  static of(task: TaskProjection, territory: TerritoryProjection): TaskAvailabilityProjection {
    const item = new TaskAvailabilityProjection();
    item.territoryId = territory.id;
    item.territoryName = territory.name;
    item.territoryCode = territory.code;
    item.territoryTypeName = territory.typeName;
    item.taskId = task.id;
    item.taskGroupName = task.groupName;
    return item;
  }
}
