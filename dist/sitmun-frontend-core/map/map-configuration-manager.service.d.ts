import { Observable } from 'rxjs';
/** Layer model: configure Layer data and displaying configuration */
import * as ɵngcc0 from '@angular/core';
export declare class Layer {
    /** layer visibility*/
    visibility: boolean;
    /** Transparency (Transparent) 0-1 (Opaque)*/
    opacity: number;
    /** title*/
    title: string;
    /** Id to index*/
    id: any;
    /** Service Name*/
    serverName: string;
    /** Service attributions*/
    attributions: string;
    /** Request format (image/jpg, ...)*/
    format: string;
    /** Request service version*/
    version: string;
    /** Service url*/
    url: string;
    /** Is base layer?*/
    isBaseLayer: boolean;
    /** Request layer name*/
    name: string;
    /** Is tiled?*/
    tiled: boolean;
    /** Description*/
    desc: string;
    /**  Transparent request parameter?*/
    url_transparent: string;
    /** Request Background parameter color (Hexa)*/
    url_bgcolor: string;
    /** Request Exception URL*/
    url_exception: string;
    /** Extent for tiled services*/
    extent: any;
    /** Tile height (if not defined, the default map is taken)*/
    tileHeight?: number;
    /** Tile width (if not defined, the default map is taken)*/
    tileWidth?: number;
    /** Enabled for GetFeatureInfo requests (enabled to use the viewer features information tool)*/
    queryable?: boolean;
    /** Minimum scale*/
    minimumScale?: number;
    /** Maximum scale*/
    maximumScale?: number;
    /** List of available CRS*/
    projections?: string;
    /** Features information URL*/
    infoUrl?: string;
    /** Metadata information URL*/
    metadataUrl?: string;
    /** Legend URL*/
    legendUrl?: string;
    /** Array of OptionalParameter object that defines other optional parameter-value pairs for the request (TIME ...)*/
    optionalParameters?: Array<OptionalParameter>;
}
/** Optional parameter model: configure parameter-value pair to add to the request layer URL */
export declare class OptionalParameter {
    /** key*/ key: string;
    /** value*/ value: string;
}
/** Layer configuration model: modify the configuration of a layer when interacting with the map (make visible, move the layer ...) */
export declare class LayerConfiguration {
    /** Identifier to index*/ id: any;
    /** Layer visibility*/ visibility: boolean;
    /** Layer transparency (Transparent) 0-1 (Opaque)*/ opacity: number;
    /** Layer position*/ position: number;
}
/** Layer group model*/
export declare class LayerGroup {
    /** initially activated (all visible layers)*/ active?: boolean;
    /** group name*/ name?: String;
    /** group id*/ id: String;
    /** array of child Layers*/ layers: Array<Layer>;
}
/** Map options configuration model*/
export declare class MapOptionsConfiguration {
    /** scales*/ scales?: string;
    /** projections*/ projections?: string;
    /** minimum scale*/ minScale?: number;
    /** maximum scale*/ maxScale?: number;
    /** extent*/ extent?: any;
    /** maximum extent*/ maxExtent?: any;
    /** tile width*/ tileWidth?: number;
    /** tile height*/ tileHeight?: number;
    /** parameters*/ parameters?: Array<OptionalParameter>;
}
/** Map component status model*/
export declare class MapComponentStatus {
    /** loaded?*/ loaded: boolean;
}
export declare class MapConfigurationManagerService {
    private layersSubject;
    private layers;
    private baseLayerGroupsSubject;
    private baseLayerGroups;
    private layerConfigurationSubject;
    private addLayersSubject;
    private removeLayersSubject;
    private situationMapConfigurationSubject;
    private mapOptionsConfigurationSubject;
    private mapComponentStatusSubject;
    /** constructor*/
    constructor();
    /** layer count */
    count: number;
    /** configure the overlay layers of the map, by passing as a parameter an array of objects of type Layer objects defining the layers to load.*/
    loadLayersConfiguration(configuration: any): void;
    /**configure the base layers of the map by passing as a parameter an array of objects of type LayerGroup each of them with the corresponding Layer objects defining the layers to load.*/
    loadBaseLayersConfiguration(configuration: any): void;
    /** get base layer groups*/
    getBaseLayerGroups(): Observable<LayerGroup[]>;
    /** set base layer groups*/
    setBaseLayerGroups(groups: Array<LayerGroup>): void;
    private refreshBaseLayerGroups();
    /** get layers*/
    getLayers(): Observable<Layer[]>;
    /** remove all layers from map*/
    clearLayers(refresh: boolean): void;
    /** set layers*/
    setLayers(layers: Array<Layer>): void;
    /** add given layer to map*/
    addLayer(layer: Layer): void;
    /** add given layer to map at given index*/
    addLayerAt(layer: Layer, index: number): void;
    /** remove given layer from map*/
    removeLayer(layer: Layer): void;
    /** remove layer with given id from map */
    removeLayerId(id: any): void;
    /** remove layer at given index from map */
    removeLayerIndex(index: number): void;
    /** refresh layers */
    private refreshLayers();
    /** Observable for layers added */
    getLayersAdded(): Observable<Layer[]>;
    private refreshAddLayers(layer);
    getLayersRemoved(): Observable<Layer[]>;
    private refreshRemoveLayers(layer);
    getLayerConfigurationListener(): Observable<LayerConfiguration[]>;
    private getLayerIndexById(id);
    /** move layer with given id to the given index*/
    moveLayer(id: any, index: any): void;
    /** change visibility of layer with given id to the given value*/
    changeLayerVisibility(id: any, visibility: any): void;
    /** change opacity of layer with given id to the given value*/
    changeLayerOpacity(id: any, opacity: any): void;
    private refreshLayerConfiguration(id, opacity, visibility, position);
    getSituationMapConfigurationListener(): Observable<Layer[]>;
    /** configure the situation map of the map component by passing as a parameter an array of objects of type LayerGroup, each of them with the corresponding Layer objects defining the layers to load as situation map.*/
    loadSituationMapConfiguration(layers: Array<Layer>): void;
    getMapOptionsConfigurationListener(): Observable<MapOptionsConfiguration[]>;
    /** load map options configuration */
    loadMapOptionsConfiguration(configuration: MapOptionsConfiguration): void;
    getMapComponentStatusListener(): Observable<MapComponentStatus[]>;
    /** set map component status */
    setMapComponentStatus(status: MapComponentStatus): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<MapConfigurationManagerService, never>;
    static ɵprov: ɵngcc0.ɵɵInjectableDef<MapConfigurationManagerService>;
}

//# sourceMappingURL=map-configuration-manager.service.d.ts.map