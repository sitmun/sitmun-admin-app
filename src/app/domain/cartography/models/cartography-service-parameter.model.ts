import { Resource } from '@app/core/hal/resource/resource.model';

import { Cartography } from './cartography.model';

/** Fixed OGC parameter applied when a proxied cartography is requested. */
export class CartographyServiceParameter extends Resource {
  public name: string;

  public type: string;

  public value: string;

  public cartography: Cartography;
}
