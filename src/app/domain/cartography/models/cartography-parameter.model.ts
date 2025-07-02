import { Resource } from '@app/core/hal/resource/resource.model';
import {Cartography} from './cartography.model';
/**
 * Service parameter model
 */
export class CartographyParameter extends Resource {

  public override id: number;

  /** name*/
  public name: string;

  /** type*/
  public type: string;

  /** value*/
  public value: string;

  /** order*/
  public order: string;

  /** cartography*/
  public cartography: Cartography;

}
