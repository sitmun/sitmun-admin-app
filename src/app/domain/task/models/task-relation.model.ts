import { Resource } from '@app/core/hal/resource/resource.model';
import {Task} from "@app/domain";
/**
 * Task type model
 */
export class TaskRelation extends Resource {

  public id?: number;

  /** name*/
  public task: Task;

  public relationType: string;

  public relatedTask: Task;
}
