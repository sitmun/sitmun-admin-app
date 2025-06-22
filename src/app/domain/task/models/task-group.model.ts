import { Resource } from '@app/core/hal/resource/resource.model';
/**
 * Task group model
 */
export class TaskGroup extends Resource {
  /** id */
  public id: number;  
  /** name*/  
  public name: string;

  /**
   * Creates a new TaskGroup instance copying only the properties declared in TaskGroup and Resource classes
   * @param source The source object to copy properties from
   * @returns A new TaskGroup instance with copied properties
   */
  public static fromObject(source: any): TaskGroup {
    const taskGroup = new TaskGroup();
    // Define the properties to copy
    const propertiesToCopy = [
      // Resource properties
      'proxyUrl', 'rootUrl', '_links', '_subtypes',
      // TaskGroup properties
      'id', 'name'
    ];
    // Copy only defined properties that exist in our class
    propertiesToCopy.forEach(prop => {
      if (source[prop] !== undefined) {
        taskGroup[prop] = source[prop];
      }
    });
    return taskGroup;
  }
}
