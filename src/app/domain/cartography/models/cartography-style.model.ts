import { Resource } from '@app/core/hal/resource/resource.model';
import {Cartography} from '@app/domain';
/**
 * Cartography style model
 */
export class CartographyStyle extends Resource {

  /** id*/
  public id: number;

  /** name*/
  public name: string;

  /** title*/
  public title: string;

  /** description*/
  public description: string;

  /** cartography*/
  public cartography: Cartography;

  public defaultStyle: boolean;

  /** legend URL online resource*/
  public legendURL: LegendURL;

}

export class LegendURL {
  /** legend URL format*/
  public format: string;

  /** legend URL width */
  public width: number;

  /** legend URL height*/
  public height: number;

  /** legend URL online resource*/
  public onlineResource: any;

}
