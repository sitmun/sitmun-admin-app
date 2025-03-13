import { Resource } from '@app/core/hal/resource/resource.model';
import { Territory } from '@app/domain/territory/models/territory.model';
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
