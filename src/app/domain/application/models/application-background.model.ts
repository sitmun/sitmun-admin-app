import { Resource } from '@app/core/hal/resource/resource.model';
import {Background} from '@app/domain/cartography/models/background.model';
import {Application} from './application.model';

/**
 * Application background model
 */
export class ApplicationBackground extends Resource {
  /** order*/
  public order: number;

  /** background*/
  public background: Background;

  /** application*/
  public application: Application;

}
