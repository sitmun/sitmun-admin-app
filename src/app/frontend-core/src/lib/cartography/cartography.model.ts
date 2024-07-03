import {Resource} from '../angular-hal/src/lib/resource';
import {Service} from '../service/service.model';
import {Connection} from '../connection/connection.model';
import {CartographyAvailability} from './cartography-availability.model';
import { CartographyStyle } from './cartography-style.model';
/**
 * Cartography
 */
export class Cartography extends Resource {
  /** id */
  public id: number;  
  /** name*/
  public name: string;
  
  /** type*/
  public type : string;

  /** service*/
  public service : Service;

  /** order*/  
  public order: Number; 

  /** description*/  
  public description: String;

  /** source*/  
  public source: String;

  /** whether cartography is blocked*/
  public blocked: boolean;  

  /** apply filter to get map*/
  public applyFilterToGetMap: boolean;  

  /** apply filter to get feature information*/
  public applyFilterToGetFeatureInfo: boolean;  

  /** apply filter to spatial selection*/
  public applyFilterToSpatialSelection: boolean;  

  /** selectable layers*/
  public selectableLayers: string[];

  /** transparency*/ 
  public transparency: Number;

  /** whether layer is queryable*/  
  public queryable: Boolean;

  /** whether layer is queryable*/ 
  public queryAct: Boolean;

  /** query layer*/
  public queryLay: string;

  /** system created date*/
  public createdDate: any;

  /** minimum scale*/
  public minimumScale: Number;

  /** maximum scale*/
  public maximumScale: Number;

  /** layers*/  
  public layers: string;
  
  /** connection*/
  public connection: Connection;

  /** queryableFeatureEnabled */
  public queryableFeatureEnabled: Boolean;

    /** queryableLayers */
  public queryableFeatureAvailable: Boolean;

    /** queryableLayers */
  public queryableLayers: string[];

  /** availabilities*/
  public availabilities : CartographyAvailability[];

  /** whether layer is queryable*/ 
  public selectableFeatureEnabled: Boolean;

  /** selection layer*/
  public selectionLayer: string;

  /** selection service*/  
  public selectionService: Service;

  /** legend tip*/  
  public legendType: string;
  
  /** legend url*/
  public legendURL: string;

  /** whether layer is editable*/
  public editable: Boolean;

  /** metadata URL*/
  public metadataURL: string;

  /** metadata URL*/
  public datasetURL: string;

  /** whether layer is themable*/
  public thematic: Boolean;
  
  /** geometry type*/
  public geometryType: string;

  public styles?: CartographyStyle[]

  public useAllStyles: boolean;
  

}
