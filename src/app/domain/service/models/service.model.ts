import {Resource} from '@app/core/hal/resource/resource.model';
import {Connection} from '@app/domain/connection/models/connection.model';
import {ServiceParameter} from './service-parameter.model';

/**
 * Service model
 */
export class Service extends Resource {
  /** id */
  public override id: number;
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

  /**
   * Creates a new Service instance copying only the properties declared in Service and Resource classes
   * @param source The source object to copy properties from
   * @returns A new Service instance with copied properties
   */
  public static fromObject(source: any): Service {
    const service = new Service();
    // Define the properties to copy
    const propertiesToCopy = [
      // Resource properties
      'proxyUrl', 'rootUrl', '_links', '_subtypes',
      // Service properties
      'id', 'name', 'type', 'serviceURL', 'supportedSRS',
      'legend', 'infoUrl', 'createdDate', 'connection',
      'parameters', 'blocked', 'isProxied', 'description',
      'getInformationURL', 'user', 'password', 'authenticationMode'
    ];
    // Copy only defined properties that exist in our class
    propertiesToCopy.forEach(prop => {
      if (source[prop] !== undefined) {
        service[prop] = source[prop];
      }
    });
    return service;
  }
}
