import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Resource } from './resource';
import { ResourceArray } from './resource-array';
import { HalOptions } from './rest.service';
import { SubTypeBuilder } from './subtype-builder';
/** REST API access helper */
export declare class ResourceHelper {
    /** HttpHeaders */
    static headers: HttpHeaders;
    /** Proxy URL */
    private static proxy_uri;
    /** Root URL */
    private static root_uri;
    /** HttpClient */
    private static http;
    /** get request headers */
    /** set request headers */
    /** get request option params */
    static optionParams(params: HttpParams, options?: HalOptions): HttpParams;
    /** resolve resource relations */
    static resolveRelations(resource: Resource): Object;
    /** create an empty resource from embedded data*/
    static createEmptyResult<T extends Resource>(_embedded: string): ResourceArray<T>;
    /** get resource class name*/
    static getClassName(obj: any): string;
    /** get resource class name from a prototype object*/
    static className(objProto: any): string[];
    /** instantiate a ResourceCollection from response embedded data*/
    static instantiateResourceCollection<T extends Resource>(type: {
        new (): T;
    }, payload: any, result: ResourceArray<T>, builder?: SubTypeBuilder): ResourceArray<T>;
    /** search subtypes*/
    static searchSubtypes<T extends Resource>(builder: SubTypeBuilder, embeddedClassName: string, instance: T): T;
    /** instantiate a Resource from response */
    static instantiateResource<T extends Resource>(entity: T, payload: Object): T;
    /** set proxy URL */
    static setProxyUri(proxy_uri: string): void;
    /** set Root URI */
    static setRootUri(root_uri: string): void;
    /** get proxy URL */
    static getURL(): string;
    /** add slash to URI */
    private static addSlash(uri);
    /** get proxy from URL */
    static getProxy(url: string): string;
    /** set HttpClient*/
    static setHttp(http: HttpClient): void;
    /** get HttpClient*/
    static getHttp(): HttpClient;
    /** get root URI*/
    static getRootUri(): string;
}
