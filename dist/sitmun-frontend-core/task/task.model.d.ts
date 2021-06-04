import { Resource } from '../angular-hal/src/lib/resource';
import { Connection } from '../connection/connection.model';
import { Role } from '../role/role.model';
import { TaskType } from './task-type.model';
import { TaskGroup } from './task-group.model';
import { TaskAvailability } from './task-availability.model';
import { TaskParameter } from './task-parameter.model';
/** GEOADMIN_task id */
export declare const GEOADMIN_TREE_TASK_ID: string;
import { TaskUI } from './task-ui.model';
import { Cartography } from '../cartography/cartography.model';
import { Service } from '../service/service.model';
/** Task model */
export declare class Task extends Resource {
    /** id */
    id?: number;
    /** name */
    name?: string;
    /** order*/
    order?: Number;
    /** system created date*/
    createdDate?: any;
    /** task group*/
    group?: TaskGroup;
    /** task type*/
    type?: TaskType;
    /** task UI*/
    ui?: TaskUI;
    /** parameters*/
    parameters?: TaskParameter[];
    /** connection*/
    connection?: Connection;
    /** roles*/
    roles?: Role[];
    /** availabilities*/
    availabilities?: TaskAvailability[];
    cartography?: Cartography;
    service?: Service;
    properties?: any;
}
