import { Resource } from '@app/core/hal/resource/resource.model';

import {Application} from './application.model';

/**
 * Application parameter model
 */
export class ApplicationParameter extends Resource {
  public name: string;

  public type: string;

  /** value*/
  public value: string;

  /** application*/
  public application: Application;


  public typeDescription: string;

  public override id: number;

  /**
   * Creates a new ApplicationParameter instance copying only the properties declared in ApplicationParameter and Resource classes
   * @param source The source object to copy properties from
   * @returns A new ApplicationParameter instance with copied properties
   */
  public static fromObject(source: any): ApplicationParameter {
    const param = new ApplicationParameter();
    const propertiesToCopy = [
      'proxyUrl', 'rootUrl', '_links', '_subtypes',
      // ApplicationParameter properties
      'id', 'name', 'type', 'value', 'application', 'typeDescription'
    ];
    propertiesToCopy.forEach(prop => {
      if (source[prop] !== undefined) {
        param[prop] = source[prop];
      }
    });
    return param;
  }
}
