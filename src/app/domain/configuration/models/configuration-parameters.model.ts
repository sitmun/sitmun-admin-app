import {Resource} from '@app/core/hal/resource/resource.model';

/**
 * Configuration Parameter model
 */
export class ConfigurationParameter extends Resource {
  /** id */
  public override id: number;
  /** name */
  public name: string;
  /** value */
  public value: string;

  /**
   * Creates a new ConfigurationParameter instance copying only the properties declared in ConfigurationParameter and Resource classes
   * @param source The source object to copy properties from
   * @returns A new ConfigurationParameter instance with copied properties
   */
  public static fromObject(source: any): ConfigurationParameter {
    const param = new ConfigurationParameter();
    const propertiesToCopy = [
      'proxyUrl', 'rootUrl', '_links', '_subtypes',
      'id', 'name', 'value'
    ];
    propertiesToCopy.forEach(prop => {
      if (source[prop] !== undefined) {
        param[prop] = source[prop];
      }
    });
    return param;
  }
}
