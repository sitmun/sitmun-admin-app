import { Resource } from '@app/core/hal';

import { Connection } from '@app/domain/connection/models/connection.model';
import { Role } from '@app/domain/role/models/role.model';
import { TaskType } from './task-type.model';
import { TaskGroup } from './task-group.model';
import { TaskAvailability } from './task-availability.model';
import { TaskParameter } from './task-parameter.model';

//FIXME ensure task creation in admin app upon initialization (as it is done with Roles and default Users)
/** GEOADMIN_task id */
export const GEOADMIN_TREE_TASK_ID:string  = "geoadmin";

import { TaskUI } from './task-ui.model';
import { Cartography } from '@app/domain/cartography/models/cartography.model';
import { Service } from '@app/domain/service/models/service.model';
/** Task model */
export class Task extends Resource {
  /** id */
  public id?: number;
  /** name */  
  public name?: string;
  /** order*/
  public order?: Number;
  /** system created date*/
  public createdDate?: any;
  /** task group*/
  public group?: TaskGroup;
  /** task type*/
  public type?: TaskType;
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

  public cartography?: Cartography;

  public service?: Service;

  public properties?;
}
