import { Resource } from '@app/core/hal/resource/resource.model';
import {Connection} from '@app/domain/connection/models/connection.model';
import {ServiceParameter} from './service-parameter.model';
/**
 * Service model
 */
export class Service extends Resource {
  /** id */
  public id: number;
  /** name*/
  public name: string;

  /** type*/
  public type: string;

  /** url*/
  public serviceURL: string;

  /** projections*/
  public supportedSRS: string[];

  /** legend*/
  public legend: string;

  /** infoUrl*/
  public infoUrl: string;

  /** system created date*/
  public createdDate: any;

  /** connection*/
  public connection: Connection;

  /** parameters*/
  public parameters: ServiceParameter[];

  /** whether service is blocked*/
  public blocked: boolean;

  /** whether service is proxied*/
  public isProxied: boolean;

  description: string;

  getInformationURL: string;

  user: string;

  password: string;

  authenticationMode: string;
}
