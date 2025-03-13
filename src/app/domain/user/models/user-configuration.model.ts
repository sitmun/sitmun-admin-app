import { Resource } from '@app/core/hal/resource/resource.model';
import { Role } from '@app/domain/role/models/role.model';
import { Territory } from '@app/domain/territory/models/territory.model';
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
