import { Resource } from '@app/core/hal';
/**
 * Task type model
 */
export class TaskType extends Resource {
  /** name*/
  public name: string;

  public specification: Map<string, any>;
}
