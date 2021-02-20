import { Resource } from '../angular-hal/src/lib/resource';
import { Service } from '../service/service.model';
import { Connection } from '../connection/connection.model';
import { CartographyAvailability } from './cartography-availability.model';
/**
 * Cartography
 */
export declare class Cartography extends Resource {
    /** id */
    id: number;
    /** name*/
    name: string;
    /** type*/
    type: string;
    /** service*/
    service: Service;
    /** order*/
    order: Number;
    /** description*/
    description: String;
    /** source*/
    source: String;
    /** whether cartography is blocked*/
    blocked: boolean;
    /** apply filter to get map*/
    applyFilterToGetMap: String;
    /** apply filter to get feature information*/
    applyFilterToGetFeatureInfo: boolean;
    /** apply filter to spatial selection*/
    applyFilterToSpatialSelection: boolean;
    /** selectable layers*/
    selectableLayers: string[];
    /** transparency*/
    transparency: Number;
    /** whether layer is queryable*/
    queryable: Boolean;
    /** whether layer is queryable*/
    queryAct: Boolean;
    /** query layer*/
    queryLay: string;
    /** system created date*/
    createdDate: any;
    /** minimum scale*/
    minimumScale: Number;
    /** maximum scale*/
    maximumScale: Number;
    /** layers*/
    layers: string;
    /** connection*/
    connection: Connection;
    /** queryableFeatureEnabled */
    queryableFeatureEnabled: Boolean;
    /** queryableLayers */
    queryableFeatureAvailable: Boolean;
    /** queryableLayers */
    queryableLayers: string[];
    /** availabilities*/
    availabilities: CartographyAvailability[];
    /** whether layer is queryable*/
    selectableFeatureEnabled: Boolean;
    /** selection layer*/
    selectionLayer: string;
    /** selection service*/
    selectionService: Service;
    /** legend tip*/
    legendType: string;
    /** legend url*/
    legendURL: string;
    /** whether layer is editable*/
    editable: Boolean;
    /** metadata URL*/
    metadataURL: string;
    /** metadata URL*/
    datasetURL: string;
    /** whether layer is themable*/
    thematic: Boolean;
    /** geometry type*/
    geometryType: string;
}
