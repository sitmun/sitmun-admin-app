import { Resource } from '../angular-hal/src/lib/resource';
import { Territory } from '../territory/territory.model';
import { Task } from './task.model';
/**
 * Task availability model
 */
export declare class TaskAvailability extends Resource {
    /** territory*/
    territory: Territory;
    /** task*/
    task: Task;
}
