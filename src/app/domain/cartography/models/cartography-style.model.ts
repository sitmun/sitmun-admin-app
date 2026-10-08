import { Resource } from '@app/core/hal/resource/resource.model';

import {Cartography} from './cartography.model';
/**
 * Cartography style model
 */
export class CartographyStyle extends Resource {

  public override id: number;

  public name: string;

  public title: string;

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
