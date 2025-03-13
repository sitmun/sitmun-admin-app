import { Resource } from '@app/core/hal/resource/resource.model';
import { Territory } from '@app/domain/territory/models/territory.model';
import { Cartography } from './cartography.model';
/**
 * Cartography availability model
 */
export class CartographyAvailability extends Resource {
  /** territory*/
  public territory: Territory;
  
  /** system created date*/
  public createdDate: any;
  
  /** cartography*/
  public cartography: Cartography;
}
