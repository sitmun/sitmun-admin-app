import { Resource } from '@app/core/hal/resource/resource.model';
import {Service} from '@app/domain/service/models/service.model';
import {CartographyAvailability, CartographyParameter, Connection} from '@app/domain';
import { CartographyStyle } from '@app/domain';
import {CartographyFilter, CartographyGroup, TreeNode} from "@app/domain";
/**
 * Represents a cartography resource in the system.
 * A cartography defines a map layer with its associated properties, services, and display settings.
 * @extends Resource
 */
export class Cartography extends Resource {
  /** Unique identifier for the cartography */
  public id: number;

  /** Display name of the cartography */
  public name: string;

  /** Detailed description of the cartography */
  public description: string;

  /** Array of layer names included in this cartography */
  public layers: string[];

  /** Minimum scale at which the cartography should be visible */
  public minimumScale: number;

  /** Maximum scale at which the cartography should be visible */
  public maximumScale: number;

  /** Display order of the cartography in the layer list */
  public order: number;

  /** Opacity/transparency level of the cartography (0-1) */
  public transparency: number;

  /** Indicates if filters should be applied to GetMap operations */
  public applyFilterToGetMap: boolean;

  /** Indicates if queryable features are available */
  public queryableFeatureAvailable: boolean;

  /** Indicates if queryable feature functionality is enabled */
  public queryableFeatureEnabled: boolean;

  /** Array of layer names that support querying */
  public queryableLayers: string[];

  /** Indicates if filters should be applied to GetFeatureInfo operations */
  public applyFilterToGetFeatureInfo: boolean;

  /** Type of the cartography (e.g., WMS, WFS) */
  public type: string;

  /** Associated service for this cartography */
  public service: Service;

  /** Indicates if feature selection is enabled */
  public selectableFeatureEnabled: boolean;

  /** Array of layer names that can be selected in this cartography */
  public selectableLayers: string[];

  /** Indicates if filters should be applied to spatial selection operations */
  public applyFilterToSpatialSelection: boolean;

  public spatialSelectionService: Service;

  /** Type of legend to be used (e.g., 'image', 'dynamic') */
  public legendType: string;

  /** URL to the legend image or service */
  public legendURL: string;

  /** Timestamp when the cartography was created */
  public createdDate: string;

  public spatialSelectionConnection: Connection;

  /** URL to the metadata information */
  public metadataURL: string;

  /** URL to the dataset information */
  public datasetURL: string;

  /** Indicates if the cartography supports thematic mapping */
  public thematic: boolean;

  /** Type of geometry used in the cartography (e.g., 'point', 'polygon') */
  public geometryType: string;

  /** Source information or origin of the cartography data */
  public source: string;

  /** Array of availability settings for this cartography */
  public availabilities: CartographyAvailability[];

  /** Optional array of style configurations for this cartography */
  public styles?: CartographyStyle[]

  /** Indicates if all available styles should be used */
  public useAllStyles: boolean;

  public defaultStyleName: CartographyStyle;

  /** Indicates if the cartography is blocked from being used */
  public blocked: boolean;

  public filters: CartographyFilter[]

  public parameters: CartographyParameter[]

  public treeNodes: TreeNode[]

  public permission: CartographyGroup[]

  /**
   * Creates a new Cartography instance copying only the properties declared in Cartography and Resource classes
   * @param source The source object to copy properties from
   * @returns A new Cartography instance with copied properties
   */
  public static fromObject(source: any): Cartography {
    const cartography = new Cartography();
    // Define the properties to copy
    const propertiesToCopy = [
      // Resource properties
      'proxyUrl', 'rootUrl', '_links', '_subtypes',
      // Cartography properties
      'id', 'name', 'description', 'layers', 'minimumScale', 'maximumScale',
      'order', 'transparency', 'applyFilterToGetMap', 'queryableFeatureAvailable',
      'queryableFeatureEnabled', 'queryableLayers', 'applyFilterToGetFeatureInfo',
      'type', 'service', 'selectableFeatureEnabled', 'selectableLayers',
      'applyFilterToSpatialSelection', 'spatialSelectionService', 'legendType',
      'legendURL', 'createdDate', 'spatialSelectionConnection', 'metadataURL',
      'datasetURL', 'thematic', 'geometryType', 'source', 'availabilities',
      'styles', 'useAllStyles', 'defaultStyleName', 'blocked', 'filters',
      'parameters', 'treeNodes', 'permission'
    ];
    // Copy only defined properties that exist in our class
    propertiesToCopy.forEach(prop => {
      if (source[prop] !== undefined) {
        cartography[prop] = source[prop];
      }
    });
    return cartography;
  }
}

export class CartographyProjection extends Resource {
  public id: number
  public name: string
  public description: string
  public layers: string[]
  public minimumScale: number
  public maximumScale: number
  public order: number
  public transparency: number
  public applyFilterToGetMap: boolean
  public queryableFeatureAvailable: boolean
  public queryableFeatureEnabled: boolean
  public queryableLayers: string[]
  public applyFilterToGetFeatureInfo: boolean
  public type: string
  public selectableFeatureEnabled: boolean
  public selectableLayers: string[]
  public applyFilterToSpatialSelection: boolean
  public legendType: string
  public legendURL: string
  public createdDate: string
  public metadataURL: string
  public datasetURL: string
  public thematic: boolean
  public geometryType: string
  public source: string
  public blocked: boolean
  public serviceId: number
  public serviceName: string
  public spatialSelectionServiceId: number
  public spatialSelectionServiceName: string
  public useAllStyles: boolean
  public stylesNames: string[]

  /**
   * Creates a new CartographyProjection instance copying only the properties declared in CartographyProjection and Resource classes
   * @param source The source object to copy properties from
   * @returns A new CartographyProjection instance with copied properties
   */
  public static fromObject(source: any): CartographyProjection {
    const projection = new CartographyProjection();
    // Define the properties to copy
    const propertiesToCopy = [
      // Resource properties
      'proxyUrl', 'rootUrl', '_links', '_subtypes',
      // CartographyProjection properties
      'id', 'name', 'description', 'layers', 'minimumScale', 'maximumScale',
      'order', 'transparency', 'applyFilterToGetMap', 'queryableFeatureAvailable',
      'queryableFeatureEnabled', 'queryableLayers', 'applyFilterToGetFeatureInfo',
      'type', 'selectableFeatureEnabled', 'selectableLayers',
      'applyFilterToSpatialSelection', 'legendType', 'legendURL', 'createdDate',
      'metadataURL', 'datasetURL', 'thematic', 'geometryType', 'source',
      'blocked', 'serviceId', 'serviceName', 'spatialSelectionServiceId',
      'spatialSelectionServiceName', 'useAllStyles', 'stylesNames'
    ];
    // Copy only defined properties that exist in our class
    propertiesToCopy.forEach(prop => {
      if (source[prop] !== undefined) {
        projection[prop] = source[prop];
      }
    });
    return projection;
  }
}
