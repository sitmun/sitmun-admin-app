import {Resource} from '../angular-hal/src/lib/resource';
import { Territory } from '../territory/territory.model';
import { Task } from './task.model';
/**
 * Task availability model
 */
export class TaskAvailability extends Resource {
  /** territory*/
  public territory: Territory;
  /** task*/
  public task: Task;
}
