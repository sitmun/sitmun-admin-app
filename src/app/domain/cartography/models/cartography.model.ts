import { Resource } from '@app/core/hal/resource/resource.model';
import {Service} from '@app/domain/service/models/service.model';
import {Connection} from '@app/domain/connection/models/connection.model';
import {CartographyAvailability} from './cartography-availability.model';
import { CartographyStyle } from './cartography-style.model';
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

  /** Type of the cartography (e.g., WMS, WFS) */
  public type: string;

  /** Associated service for this cartography */
  public service: Service;

  /** Display order of the cartography in the layer list */
  public order: Number;

  /** Detailed description of the cartography */
  public description: String;

  /** Source information or origin of the cartography data */
  public source: String;

  /** Indicates if the cartography is blocked from being used */
  public blocked: boolean;

  /** Indicates if filters should be applied to GetMap operations */
  public applyFilterToGetMap: boolean;

  /** Indicates if filters should be applied to GetFeatureInfo operations */
  public applyFilterToGetFeatureInfo: boolean;

  /** Indicates if filters should be applied to spatial selection operations */
  public applyFilterToSpatialSelection: boolean;

  /** Array of layer names that can be selected in this cartography */
  public selectableLayers: string[];

  /** Opacity/transparency level of the cartography (0-1) */
  public transparency: Number;

  /** Indicates if the cartography supports feature queries */
  public queryable: Boolean;

  /** Indicates if querying is currently active */
  public queryAct: Boolean;

  /** Specific layer to be queried */
  public queryLay: string;

  /** Timestamp when the cartography was created */
  public createdDate: any;

  /** Minimum scale at which the cartography should be visible */
  public minimumScale: Number;

  /** Maximum scale at which the cartography should be visible */
  public maximumScale: Number;

  /** Array of layer names included in this cartography */
  public layers: string[];

  /** Connection configuration for accessing the cartography */
  public connection: Connection;

  /** Indicates if queryable feature functionality is enabled */
  public queryableFeatureEnabled: Boolean;

  /** Indicates if queryable features are available */
  public queryableFeatureAvailable: Boolean;

  /** Array of layer names that support querying */
  public queryableLayers: string[];

  /** Array of availability settings for this cartography */
  public availabilities: CartographyAvailability[];

  /** Indicates if feature selection is enabled */
  public selectableFeatureEnabled: Boolean;

  /** Name of the layer used for selection operations */
  public selectionLayer: string;

  /** Service used for selection operations */
  public selectionService: Service;

  /** Type of legend to be used (e.g., 'image', 'dynamic') */
  public legendType: string;

  /** URL to the legend image or service */
  public legendURL: string;

  /** Indicates if the cartography features can be edited */
  public editable: Boolean;

  /** URL to the metadata information */
  public metadataURL: string;

  /** URL to the dataset information */
  public datasetURL: string;

  /** Indicates if the cartography supports thematic mapping */
  public thematic: Boolean;

  /** Type of geometry used in the cartography (e.g., 'point', 'polygon') */
  public geometryType: string;

  /** Optional array of style configurations for this cartography */
  public styles?: CartographyStyle[]

  /** Indicates if all available styles should be used */
  public useAllStyles: boolean;
}
