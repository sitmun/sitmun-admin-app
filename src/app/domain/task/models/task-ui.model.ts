import { Resource } from '@app/core/hal/resource/resource.model';

/**
 * Task UI model
 */
export class TaskUI extends Resource {
  public name: string;

  /** tooltip*/
  public tooltip: string;

  public type: string;

  public order: number;

  public override id: number;

  /**
   * Creates a new TaskUI instance copying only the properties declared in TaskUI and Resource classes
   * @param source The source object to copy properties from
   * @returns A new TaskUI instance with copied properties
   */
  public static fromObject(source: any): TaskUI {
    const taskUI = new TaskUI();
    const propertiesToCopy = [
      'proxyUrl', 'rootUrl', '_links', '_subtypes',
      // TaskUI properties
      'id', 'name', 'tooltip', 'type', 'order'
    ];
    propertiesToCopy.forEach(prop => {
      if (source[prop] !== undefined) {
        taskUI[prop] = source[prop];
      }
    });
    return taskUI;
  }
}
