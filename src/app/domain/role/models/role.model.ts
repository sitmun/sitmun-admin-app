import { Resource } from '@app/core/hal/resource/resource.model';
import {Application, Task} from "@app/domain";

/**
 * Role model
 */
export class Role extends Resource {
  /** id */
  public id: number;
  /** name*/
  public name: string;
  /** comments*/
  public description: string;

  public applications: Application[]

  public tasks: Task[]

  public permissions: Task[]

  public trees: Task[]

  public userConfigurations: Task[]
}
