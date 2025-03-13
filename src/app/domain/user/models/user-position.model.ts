import { Resource } from '@app/core/hal/resource/resource.model';
import { Territory } from '@app/domain/territory/models/territory.model';
import { User } from './user.model';
/**
 * User position model
 */
export class UserPosition extends Resource {
  /** name */
  public name: string;
  /** email */
  public email: string;
  /** organization name*/
  public organization: string;
  /** system created date*/
  public createdDate: any;
  /** system dated date*/
  public datedDate: any;
  /** position territory*/
  public territory: Territory;
  /** user*/
  public user: User;
}
