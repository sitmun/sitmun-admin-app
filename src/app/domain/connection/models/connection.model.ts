import {Resource} from '@app/core/hal/resource/resource.model';

/**
 * Connection model
 */
export class Connection extends Resource {
  /** id */
  public override id: number;
  /** name*/
  public name: string;
  /** driver */
  public driver: string;
  /** url */
  public url: string;
  /** user*/
  public user: string;
  /** password*/
  public password: string;
  /** password set flag */
  public passwordSet: boolean;

  /**
   * Creates a new Connection instance copying only the properties declared in Connection and Resource classes
   * @param source The source object to copy properties from
   * @returns A new Connection instance with copied properties
   */
  public static fromObject(source: any): Connection {
    const connection = new Connection();
    // Define the properties to copy
    const propertiesToCopy = [
      // Resource properties
      'proxyUrl', 'rootUrl', '_links', '_subtypes',
      // Connection properties
      'id', 'name', 'driver', 'url', 'user', 'password', 'passwordSet'
    ];
    // Copy only defined properties that exist in our class
    propertiesToCopy.forEach(prop => {
      if (source[prop] !== undefined) {
        connection[prop] = source[prop];
      }
    });
    return connection;
  }
}
