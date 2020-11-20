import { Resource } from '../angular-hal/src/lib/resource';
import { Service } from '../service/service.model';
import { Connection } from '../connection/connection.model';
import { CartographyAvailability } from './cartography-availability.model';
/**
 * Cartography
 */
export declare class Cartography extends Resource {
    /** name*/
    name: string;
    /** type*/
    type: string;
    /** whether layer is visible*/
    visible: Boolean;
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
    /** order*/
    order: Number;
    /** minimum scale*/
    minimumScale: Number;
    /** maximum scale*/
    maximumScale: Number;
    /** layers*/
    layers: string;
    /** service*/
    service: Service;
    /** connection*/
    connection: Connection;
    /** availabilities*/
    availabilities: CartographyAvailability[];
    /** whether layer is queryable*/
    selectable: Boolean;
    /** selection layer*/
    selectionLayer: string;
    /** selection service*/
    selectionService: Service;
    /** legend tip*/
    legendTip: string;
    /** legend url*/
    legendUrl: string;
    /** whether layer is editable*/
    editable: Boolean;
    /** metadata URL*/
    metadataUrl: string;
    /** whether layer is themable*/
    themeable: Boolean;
    /** geometry type*/
    geometryType: string;
}
