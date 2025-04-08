import { Resource } from '@app/core/hal/resource/resource.model';
/**
 * Task UI model
 */
export class TaskUI extends Resource {
  /** name*/
  public name: string;

  /** tooltip*/
  public tooltip: string;

  /** order*/
  public order: number;

  public id: number;
}
