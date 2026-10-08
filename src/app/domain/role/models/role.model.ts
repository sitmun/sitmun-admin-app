import { Resource } from '@app/core/hal/resource/resource.model';

import {Application} from '../../application/models/application.model';
import {Task} from '../../task/models/task.model';

/**
 * Role model
 */
export class Role extends Resource {
  public override id: number;
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
    const propertiesToCopy = [
      'proxyUrl', 'rootUrl', '_links', '_subtypes',
      // Role properties
      'id', 'name', 'description', 'applications', 'tasks',
      'permissions', 'trees', 'userConfigurations'
    ];
    propertiesToCopy.forEach(prop => {
      if (source[prop] !== undefined) {
        role[prop] = source[prop];
      }
    });
    return role;
  }
}
