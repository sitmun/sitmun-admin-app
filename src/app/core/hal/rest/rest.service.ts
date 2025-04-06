import { Observable, of, throwError as observableThrowError } from 'rxjs';
import { map } from 'rxjs/operators';
import { Resource } from '../resource/resource.model';
import { ResourceArray } from '../resource/resource-array.model';
import { Sort } from './sort.model';
import { ResourceService } from '../resource/resource.service';
import { SubTypeBuilder } from '../common/subtype-builder';
import { isNullOrUndefined } from 'util';
import { Injector } from "@angular/core";

/** HAL param data model */
export type HalParam = { key: string, value: string | number | boolean };
/** HAL option data model */
export type HalOptions = { notPaged?: boolean, size?: number, sort?: Sort[], params?: HalParam[] };

/**
 * A generic service class that provides REST API access with HAL (Hypertext Application Language) support.
 * This service handles CRUD operations, pagination, and relationship navigation for HAL-compliant REST resources.
 * 
 * @template T - Type parameter that extends Resource class
 */
export class RestService<T extends Resource> {
    /** The constructor type for creating new instances of the resource */
    private type: any;
    /** The base resource path for API endpoints */
    private resource: string;
    /** Stores the current resource array with pagination information */
    public resourceArray: ResourceArray<T>;
    /** Service for handling resource operations */
    public resourceService: ResourceService;
    /** The field name for embedded resources in HAL responses */
    private _embedded: string = '_embedded';

    /**
     * Creates a new instance of RestService
     * @param type - The constructor for the resource type
     * @param resource - The base resource path
     * @param injector - Angular's dependency injector
     * @param _embedded - Optional custom field name for embedded resources
     */
    constructor(type: { new(): T },
                resource: string,
                private injector: Injector,
                _embedded?: string) {
        this.type = type;
        this.resource = resource;
        this.resourceService = injector.get(ResourceService);
        if (!isNullOrUndefined(_embedded))
            this._embedded = _embedded;
    }

    /**
     * Handles error responses from the API
     * @param error - The error object to handle
     * @returns An Observable that errors with the provided error
     */
    protected handleError(error: any):Observable<never> {
        return RestService.handleError(error);
    }

    /**
     * Static error handler method
     * @param error - The error object to handle
     * @returns An Observable that errors with the provided error
     */
    protected static handleError(error: any):Observable<never> {
        return observableThrowError(error);
    }

    /**
     * Retrieves all resources with optional pagination, sorting, and filtering
     * @param options - Optional HAL options for pagination, sorting, and additional parameters
     * @param subType - Optional builder for handling subtypes
     * @param embeddedName - Optional custom embedded resource name
     * @param ignoreProjection - Optional flag to ignore projection
     * @returns Observable of resource array
     */
    public getAll(options?: HalOptions, subType?: SubTypeBuilder, embeddedName?:String, ignoreProjection?:boolean): Observable<T[]> {
        return this.resourceService.getAll(this.type, this.resource, this._embedded, options, subType, embeddedName, ignoreProjection).pipe(
            map((resourceArray: ResourceArray<T>) => {
                if (options && options.notPaged && !isNullOrUndefined(resourceArray.first_uri)) {
                    options.notPaged = false;
                    options.size = resourceArray.totalElements;
                    return this.getAll(options).toPromise();
                } else {
                    this.resourceArray = resourceArray;
                    return resourceArray.result;
                }
            }) as any
        );
    }

    /**
     * Retrieves a single resource by its ID
     * @param id - The identifier of the resource
     * @returns Observable of single resource
     */
    public get(id: any): Observable<T> {
        return this.resourceService.get(this.type, this.resource, id);
    }

    /**
     * Retrieves a resource using its self link
     * @param selfLink - The self link URL of the resource
     * @returns Observable of single resource
     */
    public getBySelfLink(selfLink: string): Observable<T> {
        return this.resourceService.getBySelfLink(this.type, selfLink);
    }

    /**
     * Searches for resources using a query string
     * @param query - The search query string
     * @param options - Optional HAL options for pagination and sorting
     * @returns Observable of resource array
     */
    public search(query: string, options?: HalOptions): Observable<T[]> {
        return this.resourceService.search(this.type, query, this.resource, this._embedded, options).pipe(
            map((resourceArray: ResourceArray<T>) => {
                if (options && options.notPaged && !isNullOrUndefined(resourceArray.first_uri)) {
                    options.notPaged = false;
                    options.size = resourceArray.totalElements;
                    return this.search(query, options).toPromise();
                } else {
                    this.resourceArray = resourceArray;
                    return resourceArray.result;
                }
            }) as any
        );
    }

    /**
     * Searches for a single resource using a query string
     * @param query - The search query string
     * @param options - Optional HAL options
     * @returns Observable of single resource
     */
    public searchSingle(query: string, options?: HalOptions): Observable<T> {
        return this.resourceService.searchSingle(this.type, query, this.resource, options);
    }

    /**
     * Executes a custom query against the API
     * @param query - The custom query string
     * @param options - Optional HAL options
     * @returns Observable of resource array
     */
    public customQuery(query: string, options?: HalOptions): Observable<T[]> {
        return this.resourceService.customQuery(this.type, query, this.resource, this._embedded, options).pipe(
            map((resourceArray: ResourceArray<T>) => {
                if (options && options.notPaged && !isNullOrUndefined(resourceArray.first_uri)) {
                    options.notPaged = false;
                    options.size = resourceArray.totalElements;
                    return this.customQuery(query, options).toPromise();
                } else {
                    this.resourceArray = resourceArray;
                    return resourceArray.result;
                }
            }) as any
        );
    }

    /**
     * Retrieves an array of related resources
     * @param relation - The relation link name
     * @param builder - Optional subtype builder
     * @returns Observable of resource array
     */
    public getByRelationArray(relation: string, builder?: SubTypeBuilder): Observable<T[]> {
        return this.resourceService.getByRelationArray(this.type, relation, this._embedded, builder).pipe(
            map((resourceArray: ResourceArray<T>) => {
                this.resourceArray = resourceArray;
                return resourceArray.result;
            }));
    }

    /**
     * Retrieves a single related resource
     * @param relation - The relation link name
     * @returns Observable of single resource
     */
    public getByRelation(relation: string): Observable<T> {
        return this.resourceService.getByRelation(this.type, relation);
    }

    /**
     * Counts the total number of resources
     * @returns Observable of resource count
     */
    public count(): Observable<number> {
        return this.resourceService.count(this.resource);
    }

    /**
     * Creates a new resource
     * @param entity - The resource entity to create
     * @returns Observable of the created resource
     */
    public create(entity: T) {
        return this.resourceService.create(this.resource, entity);
    }

    /**
     * Updates an existing resource
     * @param entity - The resource entity to update
     * @returns Observable of the updated resource
     */
    public update(entity: T) {
        return this.resourceService.update(entity);
    }

    /**
     * Partially updates a resource
     * @param entity - The resource entity to patch
     * @returns Observable of the patched resource
     */
    public patch(entity: T) {
        return this.resourceService.patch(entity);
    }

    /**
     * Deletes a resource
     * @param entity - The resource entity to delete
     * @returns Observable of the operation result
     */
    public delete(entity: T) {
        return this.resourceService.delete(entity);
    }

    /**
     * Gets the total number of elements in the current resource array
     * @returns The total number of elements
     */
    public totalElement(): number {
        if (this.resourceArray && this.resourceArray.totalElements)
            return this.resourceArray.totalElements;
        return 0;
    }

    /**
     * Checks if the resource array has a first page
     * @returns True if first page exists
     */
    public hasFirst(): boolean {
        if (this.resourceArray)
            return this.resourceService.hasFirst(this.resourceArray);
        return false;
    }

    /**
     * Checks if the resource array has a next page
     * @returns True if next page exists
     */
    public hasNext(): boolean {
        if (this.resourceArray)
            return this.resourceService.hasNext(this.resourceArray);
        return false;
    }

    /**
     * Checks if the resource array has a previous page
     * @returns True if previous page exists
     */
    public hasPrev(): boolean {
        if (this.resourceArray)
            return this.resourceService.hasPrev(this.resourceArray);
        return false;
    }

    /**
     * Checks if the resource array has a last page
     * @returns True if last page exists
     */
    public hasLast(): boolean {
        if (this.resourceArray)
            return this.resourceService.hasLast(this.resourceArray);
        return false;
    }

    /**
     * Navigates to the next page of results
     * @returns Observable of the next page's resource array
     */
    public next(): Observable<T[]> {
        if (this.resourceArray)
            return this.resourceService.next(this.resourceArray, this.type).pipe(
                map((resourceArray: ResourceArray<T>) => {
                    this.resourceArray = resourceArray;
                    return resourceArray.result;
                }));
        else
            return of([]);
    }

    /**
     * Navigates to the previous page of results
     * @returns Observable of the previous page's resource array
     */
    public prev(): Observable<T[]> {
        if (this.resourceArray)
            return this.resourceService.prev(this.resourceArray, this.type).pipe(
                map((resourceArray: ResourceArray<T>) => {
                    this.resourceArray = resourceArray;
                    return resourceArray.result;
                }));
        else
            return of([]);
    }

    /**
     * Navigates to the first page of results
     * @returns Observable of the first page's resource array
     */
    public first(): Observable<T[]> {
        if (this.resourceArray)
            return this.resourceService.first(this.resourceArray, this.type).pipe(
                map((resourceArray: ResourceArray<T>) => {
                    this.resourceArray = resourceArray;
                    return resourceArray.result;
                }));
        else
            return of([]);
    }

    /**
     * Navigates to the last page of results
     * @returns Observable of the last page's resource array
     */
    public last(): Observable<T[]> {
        if (this.resourceArray)
            return this.resourceService.last(this.resourceArray, this.type).pipe(
                map((resourceArray: ResourceArray<T>) => {
                    this.resourceArray = resourceArray;
                    return resourceArray.result;
                }));
        else
            return of([]);
    }

    /**
     * Navigates to a specific page of results
     * @param pageNumber - The page number to navigate to
     * @returns Observable of the specified page's resource array
     */
    public page(pageNumber: number): Observable<T[]> {
        if (this.resourceArray)
            return this.resourceService.page(this.resourceArray, this.type, pageNumber).pipe(
                map((resourceArray: ResourceArray<T>) => {
                    this.resourceArray = resourceArray;
                    return resourceArray.result;
                }));
        else
            return of([]);
    }
}
