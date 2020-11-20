import { Resource } from './resource';
import { Sort } from './sort';
import { ResourceArray } from './resource-array';
import { ExternalService } from './external.service';
import { HalOptions } from './rest.service';
import { SubTypeBuilder } from './subtype-builder';
import { Observable } from 'rxjs/internal/Observable';
/** ResourceService */
import * as ɵngcc0 from '@angular/core';
export declare class ResourceService {
    private externalService;
    /** constructor */
    constructor(externalService: ExternalService);
    /** get URL */
    private static getURL();
    /** get all resources from a base URI of a given type */
    getAll<T extends Resource>(type: {
        new (): T;
    }, resource: string, _embedded: string, options?: HalOptions, subType?: SubTypeBuilder): Observable<ResourceArray<T>>;
    /** get resource from a base URI and a given id */
    get<T extends Resource>(type: {
        new (): T;
    }, resource: string, id: any): Observable<T>;
    /** get resource from its selflink */
    getBySelfLink<T extends Resource>(type: {
        new (): T;
    }, resourceLink: string): Observable<T>;
    /** search resources from a given base path, query and options */
    search<T extends Resource>(type: {
        new (): T;
    }, query: string, resource: string, _embedded: string, options?: HalOptions): Observable<ResourceArray<T>>;
    /** search a single resource from a given base path, query and options */
    searchSingle<T extends Resource>(type: {
        new (): T;
    }, query: string, resource: string, options?: HalOptions): Observable<T>;
    /** search resources from a given base path, custom query and options */
    customQuery<T extends Resource>(type: {
        new (): T;
    }, query: string, resource: string, _embedded: string, options?: HalOptions): Observable<ResourceArray<T>>;
    /** get resource given a relation link */
    getByRelation<T extends Resource>(type: {
        new (): T;
    }, resourceLink: string): Observable<T>;
    /** get resource array given a relation link */
    getByRelationArray<T extends Resource>(type: {
        new (): T;
    }, resourceLink: string, _embedded: string, builder?: SubTypeBuilder): Observable<ResourceArray<T>>;
    /** count resources given a path */
    count(resource: string): Observable<number>;
    /** create resource from self link and entity data*/
    create<T extends Resource>(selfResource: string, entity: T): Observable<Observable<never> | T>;
    /** update resource from a given entity data*/
    update<T extends Resource>(entity: T): Observable<Observable<never> | T>;
    /** patch resource from a given entity data*/
    patch<T extends Resource>(entity: T): Observable<Observable<never> | T>;
    /** delete resource from a given entity data*/
    delete<T extends Resource>(entity: T): Observable<Object>;
    /** whether a resource array has next page of results*/
    hasNext<T extends Resource>(resourceArray: ResourceArray<T>): boolean;
    /** whether a resource array has previous page of results*/
    hasPrev<T extends Resource>(resourceArray: ResourceArray<T>): boolean;
    /** whether a resource array has first page of results*/
    hasFirst<T extends Resource>(resourceArray: ResourceArray<T>): boolean;
    /** whether a resource array has last page of results*/
    hasLast<T extends Resource>(resourceArray: ResourceArray<T>): boolean;
    /** get resource array next page of results*/
    next<T extends Resource>(resourceArray: ResourceArray<T>, type: {
        new (): T;
    }): Observable<ResourceArray<T>>;
    /** get resource array previous page of results*/
    prev<T extends Resource>(resourceArray: ResourceArray<T>, type: {
        new (): T;
    }): Observable<ResourceArray<T>>;
    /** get resource array first page of results*/
    first<T extends Resource>(resourceArray: ResourceArray<T>, type: {
        new (): T;
    }): Observable<ResourceArray<T>>;
    /** get resource array last page of results*/
    last<T extends Resource>(resourceArray: ResourceArray<T>, type: {
        new (): T;
    }): Observable<ResourceArray<T>>;
    /** get resource array page of results given a page number*/
    page<T extends Resource>(resourceArray: ResourceArray<T>, type: {
        new (): T;
    }, id: number): Observable<ResourceArray<T>>;
    /** sort resource array with a given sorting params */
    sortElements<T extends Resource>(resourceArray: ResourceArray<T>, type: {
        new (): T;
    }, ...sort: Sort[]): Observable<ResourceArray<T>>;
    /** get resource array size*/
    size<T extends Resource>(resourceArray: ResourceArray<T>, type: {
        new (): T;
    }, size: number): Observable<ResourceArray<T>>;
    /** get resource URL from a given path*/
    private getResourceUrl(resource?);
    /** set proxy and root urls of given resource array */
    private setUrls<T>(result);
    /** set proxy and root urls of given resource */
    private setUrlsResource<T>(result);
    static ɵfac: ɵngcc0.ɵɵFactoryDef<ResourceService, never>;
    static ɵprov: ɵngcc0.ɵɵInjectableDef<ResourceService>;
}

//# sourceMappingURL=resource.service.d.ts.map