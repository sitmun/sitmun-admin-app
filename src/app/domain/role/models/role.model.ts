import { Resource } from '@app/core/hal/resource/resource.model';
import {Application, Task} from "@app/domain";

/**
 * Role model
 */
export class Role extends Resource {
  /** id */
  public override id: number;
  /** name*/
  public name: string;
  /** comments*/
  public description: string;

  public applications: Application[]

  public tasks: Task[]

  public permissions: Task[]

  public trees: Task[]

  public userConfigurations: Task[]

  /**
   * Creates a new Role instance copying only the properties declared in Role and Resource classes
   * @param source The source object to copy properties from
   * @returns A new Role instance with copied properties
   */
  public static fromObject(source: any): Role {
    const role = new Role();
    // Define the properties to copy
    const propertiesToCopy = [
      // Resource properties
      'proxyUrl', 'rootUrl', '_links', '_subtypes',
      // Role properties
      'id', 'name', 'description', 'applications', 'tasks',
      'permissions', 'trees', 'userConfigurations'
    ];
    // Copy only defined properties that exist in our class
    propertiesToCopy.forEach(prop => {
      if (source[prop] !== undefined) {
        role[prop] = source[prop];
      }
    });
    return role;
  }
}
