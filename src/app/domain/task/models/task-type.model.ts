import { Resource } from '@app/core/hal/resource/resource.model';
/**
 * Task type model
 */
export class TaskType extends Resource {

  public id?: number;

  /** name*/
  public name: string;

  public specification: Map<string, any>;

  public title: string;
}
