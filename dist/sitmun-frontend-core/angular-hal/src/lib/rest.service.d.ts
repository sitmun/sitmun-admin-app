import { Resource } from './resource';
import { ResourceArray } from './resource-array';
import { Sort } from './sort';
import { ResourceService } from './resource.service';
import { SubTypeBuilder } from './subtype-builder';
import { Observable } from 'rxjs';
import { Injector } from "@angular/core";
/** HAL param data model */
export declare type HalParam = {
    key: string;
    value: string | number | boolean;
};
/** HAL option data model */
export declare type HalOptions = {
    notPaged?: boolean;
    size?: number;
    sort?: Sort[];
    params?: HalParam[];
};
/** REST API access interface */
export declare class RestService<T extends Resource> {
    private injector;
    /** resource type */
    private type;
    /** resource path */
    private resource;
    /** resource array */
    resourceArray: ResourceArray<T>;
    /** resource service */
    resourceService: ResourceService;
    /** _embedded field name */
    private _embedded;
    /** constructor */
    constructor(type: {
        new (): T;
    }, resource: string, injector: Injector, _embedded?: string);
    /** error handler */
    protected handleError(error: any): Observable<never>;
    /** error handler */
    protected static handleError(error: any): Observable<never>;
    /** get all resources with optional options an subType params */
    getAll(options?: HalOptions, subType?: SubTypeBuilder, embeddedName?: String): Observable<T[]>;
    /** get resource from a given id */
    get(id: any): Observable<T>;
    /** get resource from self link */
    getBySelfLink(selfLink: string): Observable<T>;
    /** search resources from a given query string and optional options params */
    search(query: string, options?: HalOptions): Observable<T[]>;
    /** search resource from a given query string and optional options params */
    searchSingle(query: string, options?: HalOptions): Observable<T>;
    /** search resources from a given custom query string and optional options params */
    customQuery(query: string, options?: HalOptions): Observable<T[]>;
    /** get resource array given a relation link */
    getByRelationArray(relation: string, builder?: SubTypeBuilder): Observable<T[]>;
    /** get resource given a relation link */
    getByRelation(relation: string): Observable<T>;
    /** count resources given a path */
    count(): Observable<number>;
    /** create resource from self link and entity data*/
    create(entity: T): Observable<Observable<never> | T>;
    /** update resource from a given entity data*/
    update(entity: T): Observable<Observable<never> | T>;
    /** patch resource from a given entity data*/
    patch(entity: T): Observable<Observable<never> | T>;
    /** delete resource from a given entity data*/
    delete(entity: T): Observable<Object>;
    /** get total number of elements of resource array */
    totalElement(): number;
    /** whether a resource array has first page of results*/
    hasFirst(): boolean;
    /** whether a resource array has next page of results*/
    hasNext(): boolean;
    /** whether a resource array has previous page of results*/
    hasPrev(): boolean;
    /** whether a resource array has last page of results*/
    hasLast(): boolean;
    /** get resource array next page of results*/
    next(): Observable<T[]>;
    /** get resource array previous page of results*/
    prev(): Observable<T[]>;
    /** get resource array first page of results*/
    first(): Observable<T[]>;
    /** get resource array last page of results*/
    last(): Observable<T[]>;
    /** get resource array page of results given a page number*/
    page(pageNumber: number): Observable<T[]>;
}
