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
  public order: number; 

  /** description*/  
  public description: string;

  /** source*/  
  public source: string;

  /** whether cartography is blocked*/
  public blocked: boolean;  

  /** apply filter to GetMap*/
  public applyFilterToGetMap: boolean;  

  /** apply filter to GetFeatureInfo*/
  public applyFilterToGetFeatureInfo: boolean;  

  /** apply filter to spatial selection*/
  public applyFilterToSpatialSelection: boolean;  

  /** selectable layers*/
  public selectableLayers: string[];

  /** transparency*/ 
  public transparency: number;

  /** whether layer is queryable*/  
  public queryable: boolean;

  /** whether layer is queryable*/ 
  public queryAct: boolean;

  /** query layer*/
  public queryLay: string;

  /** system created date*/
  public createdDate: any;

  /** minimum scale*/
  public minimumScale: number;

  /** maximum scale*/
  public maximumScale: number;

  /** layers*/  
  public layers: string;
  
  /** connection*/
  public connection: Connection;

  /** queryableFeatureEnabled */
  public queryableFeatureEnabled: boolean;

    /** queryableLayers */
  public queryableFeatureAvailable: boolean;

    /** queryableLayers */
  public queryableLayers: string[];

  /** availabilities*/
  public availabilities : CartographyAvailability[];

  /** whether layer is queryable*/ 
  public selectableFeatureEnabled: boolean;

  /** selection layer*/
  public selectionLayer: string;

  /** selection service*/  
  public selectionService: Service;

  /** legend tip*/  
  public legendType: string;
  
  /** legend url*/
  public legendURL: string;

  /** whether layer is editable*/
  public editable: boolean;

  /** metadata URL*/
  public metadataURL: string;

  /** metadata URL*/
  public datasetURL: string;

  /** whether layer is themable*/
  public thematic: boolean;
  
  /** geometry type*/
  public geometryType: string;

  public styles?: CartographyStyle[]

  public useAllStyles: boolean;
  

}
