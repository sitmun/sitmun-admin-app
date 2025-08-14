import {Cartography, CartographyProjection} from '@app/domain';
import {Territory, TerritoryProjection} from '@app/domain/territory/models/territory.model';
import {Resource} from '@app/core/hal/resource/resource.model';

/**
 * Represents the availability of a cartography for a specific territory
 * @extends Resource
 */
export class CartographyAvailability extends Resource {
  /** Unique identifier of the cartography availability */
  public override id: number;

  /** Territory where the cartography is available */
  public territory: Territory;

  /** Date when the cartography availability was created */
  public createdDate: Date;

  /** Associated cartography */
  public cartography: Cartography;

  public static of(entityToEdit: Territory, item: Cartography) {
    return Object.assign(new CartographyAvailability(), {
      territory: entityToEdit,
      cartography: item
    });
  }

  public static fromObject(source: any): CartographyAvailability {
    const availability = new CartographyAvailability();
    // Define the properties to copy
    const propertiesToCopy = [
      // Resource properties
      'proxyUrl', 'rootUrl', '_links', '_subtypes',
      // CartographyAvailability properties
      'id', 'territory', 'createdDate', 'cartography'
    ];
    // Copy only defined properties that exist in our class
    propertiesToCopy.forEach(prop => {
      if (source[prop] !== undefined) {
        availability[prop] = source[prop];
      }
    });
    return availability;
  }
}

/**
 * Projection of CartographyAvailability with flattened territory and cartography data
 * @extends Resource
 */
export class CartographyAvailabilityProjection extends Resource {
  /** Unique identifier of the cartography availability */
  public override id: number;

  /** Date when the cartography availability was created */
  public createdDate: Date;

  /** Owner of the cartography availability */
  public owner: string;

  /** ID of the territory where the cartography is available */
  public territoryId: number;

  /** Name of the territory where the cartography is available */
  public territoryName: string;

  /** Code of the territory where the cartography is available */
  public territoryCode: string;

  /** Type of the territory where the cartography is available */
  public territoryType: string;

  /** ID of the associated cartography */
  public cartographyId: number;

  /** Name of the associated cartography */
  public cartographyName: string;

  /** List of layer names in the cartography */
  public cartographyLayers: string[];

  /** Name of the cartography service */
  public cartographyServiceName: string;

  /**
   * Creates a new CartographyAvailabilityProjection instance copying only the properties declared in CartographyAvailabilityProjection and Resource classes
   * @param source The source object to copy properties from
   * @returns A new CartographyAvailabilityProjection instance with copied properties
   */
  public static fromObject(source: any): CartographyAvailabilityProjection {
    const projection = new CartographyAvailabilityProjection();
    // Define the properties to copy
    const propertiesToCopy = [
      // Resource properties
      'proxyUrl', 'rootUrl', '_links', '_subtypes',
      // CartographyAvailabilityProjection properties
      'id', 'createdDate', 'owner', 'territoryId', 'territoryName',
      'territoryCode', 'territoryType', 'cartographyId', 'cartographyName',
      'cartographyLayers', 'cartographyServiceName'
    ];
    // Copy only defined properties that exist in our class
    propertiesToCopy.forEach(prop => {
      if (source[prop] !== undefined) {
        projection[prop] = source[prop];
      }
    });
    return projection;
  }

  static of(entityToEdit: TerritoryProjection, item: CartographyProjection) {
    return Object.assign(new CartographyAvailabilityProjection(), {
      territoryId: entityToEdit.id,
      territoryName: entityToEdit.name,
      territoryCode: entityToEdit.code,
      territoryType: entityToEdit.typeName,
      cartographyId: item.id,
      cartographyName: item.name,
      cartographyLayers: item.layers,
      cartographyServiceName: item.serviceName,
    });
  }
}
