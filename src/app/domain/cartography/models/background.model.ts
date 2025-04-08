import { Resource } from '@app/core/hal/resource/resource.model';
import {CartographyGroup} from './cartography-group.model';
import {ApplicationBackground} from "@app/domain";
/**
 * Background model
 */

export class Background extends Resource {
  /** id */
  public id: number;

  /** name*/
  public name: string;

  /** description*/
  public description: string;

  /** image */
  public image: string;

  /** whether background is active*/
  public active: boolean;

  /** system created date*/
  public createdDate: string;

  /** cartography group*/
  public cartographyGroup: CartographyGroup;

  public applications: ApplicationBackground[];

  /**
   * Creates a new Background instance copying only the properties declared in Background and Resource classes
   * @param source The source object to copy properties from
   * @returns A new Background instance with copied properties
   */
  public static fromObject(source: any): Background {
    const background = new Background();
    // Define the properties to copy
    const propertiesToCopy = [
      // Resource properties
      'proxyUrl', 'rootUrl', '_links', '_subtypes',
      // Background properties
      'id', 'name', 'description', 'image', 'active',
      'createdDate', 'cartographyGroup', 'applications'
    ];
    // Copy only defined properties that exist in our class
    propertiesToCopy.forEach(prop => {
      if (source[prop] !== undefined) {
        background[prop] = source[prop];
      }
    });
    return background;
  }
}


export class BackgroundProjection extends Resource {
  id: number
  name: string
  description: string
  active: boolean
  createdDate: string
  cartographyGroupName: string
  cartographyGroupId: number
  image: string
  public static fromObject(source: any): BackgroundProjection {
    const background = new BackgroundProjection();
    // Define the properties to copy
    const propertiesToCopy = [
      // Resource properties
      'proxyUrl', 'rootUrl', '_links', '_subtypes',
      // Background properties
      'id', 'name', 'description', 'image', 'active',
      'createdDate', 'cartographyGroupName', 'cartographyGroupId'
    ];
    // Copy only defined properties that exist in our class
    propertiesToCopy.forEach(prop => {
      if (source[prop] !== undefined) {
        background[prop] = source[prop];
      }
    });
    return background;
  }
}
