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

  /** format*/
  public format: string;

  /** fraction digits for N and P*/
  public fractionDigits: number;

  /** pad fraction digits for N and P*/
  public padFractionDigits: boolean;

  /** date or datetime for F*/
  public dateStyle: string;

  /** cartography*/
  public cartography: Cartography;

}
