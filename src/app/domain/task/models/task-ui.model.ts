import { Resource } from '@app/core/hal/resource/resource.model';

/**
 * Task UI model
 */
export class TaskUI extends Resource {
  /** name*/
  public name: string;

  /** tooltip*/
  public tooltip: string;

  /** type*/
  public type: string;

  /** order*/
  public order: number;

  /** id */
  public override id: number;

  /**
   * Creates a new TaskUI instance copying only the properties declared in TaskUI and Resource classes
   * @param source The source object to copy properties from
   * @returns A new TaskUI instance with copied properties
   */
  public static fromObject(source: any): TaskUI {
    const taskUI = new TaskUI();
    // Define the properties to copy
    const propertiesToCopy = [
      // Resource properties
      'proxyUrl', 'rootUrl', '_links', '_subtypes',
      // TaskUI properties
      'id', 'name', 'tooltip', 'type', 'order'
    ];
    // Copy only defined properties that exist in our class
    propertiesToCopy.forEach(prop => {
      if (source[prop] !== undefined) {
        taskUI[prop] = source[prop];
      }
    });
    return taskUI;
  }
}
