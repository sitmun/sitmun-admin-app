import { Resource } from '@app/core/hal/resource/resource.model';

import {Service} from './service.model';
/**
 * Service parameter model
 */
export class ServiceParameter extends Resource {
  public name: string;

  public type: string;

  /** value*/
  public value: string;

  /** service*/
  public service: Service;

}
