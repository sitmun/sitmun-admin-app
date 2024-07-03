import {Resource} from '../angular-hal/src/lib/resource';
import { Role } from '../role/role.model';
import { Territory } from '../territory/territory.model';
import { User } from './user.model';

/**
 * User permission model
 */
export class UserConfiguration extends Resource {
  /** role */  
  public role: Role;

  /** role Children */  
  public roleChildren: Role;
  
  /** territory */ 
  public territory: Territory;
  /** user */
  public user: User;
}
