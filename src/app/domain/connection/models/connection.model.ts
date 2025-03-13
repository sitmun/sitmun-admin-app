import { Resource } from '@app/core/hal/resource/resource.model';
/**
 * Connection model
 */
export class Connection extends Resource {
  /** id */
  public id: number;
  /** name*/
  public name: string;
  /** type*/
  public type: string;
  /** user*/
  public user: string;
  /** password*/
  public password: string;
  /** connection string*/
  public connectionString: string;

}
