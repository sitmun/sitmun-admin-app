import {throwError, Observable, of, switchMap, empty, EMPTY} from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Resource } from './resource.model';
import { ResourceHelper } from './resource-helper';
import { Injectable } from '@angular/core';
import { HttpParams, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Sort } from '../rest/sort.model';
import { ResourceArray } from './resource-array.model';
import { ExternalService } from '../services';
import { HalOptions } from '../rest/rest.service';
import { SubTypeBuilder } from '../common/subtype-builder';
import { LoggerService } from '@app/services/logger.service';

/**
 * Service for handling HAL (Hypertext Application Language) REST API interactions.
 * Provides methods for CRUD operations, pagination, and resource relationship management
 * following the HAL specification. This service works with Resource objects that
 * represent HAL-compliant resources with _links and other HAL properties.
 */
@Injectable()
export class ResourceService {

    /**
     * Creates a new ResourceService instance
     * @param externalService Service for handling external service configurations
     * @param loggerService Service for logging operations
     */
    constructor(private externalService: ExternalService, private loggerService: LoggerService) { }

    /**
     * Gets the base URL for HAL resources
     * @returns The base URL string for HAL resources
     */
    private static getURL(): string {
        return ResourceHelper.getURL();
    }

    /**
     * Retrieves all resources of a given type from a base URI
     * @param type The resource type constructor
     * @param resource The resource path/endpoint
     * @param _embedded The name of the embedded collection in the response
     * @param options Optional HAL query parameters (pagination, sorting, etc.)
     * @param subType Optional builder for handling subtypes
     * @param embeddedName Optional custom name for embedded resources
     * @param ignoreProjection Whether to ignore the default 'view' projection
     * @returns Observable of ResourceArray containing the retrieved resources
     */
    public getAll<T extends Resource>(type: { new(): T }, resource: string, _embedded: string, options?: HalOptions, subType?: SubTypeBuilder, embeddedName?:String, ignoreProjection?:boolean): Observable<ResourceArray<T>> {
        this.loggerService.trace("ResourceService.getAll:", {type: type.name, resource: resource, _embedded: _embedded, options: options, subType: subType, embeddedName: embeddedName, ignoreProjection: ignoreProjection});
        let uri = this.getResourceUrl(resource);
        let params = ResourceHelper.optionParams(new HttpParams(), options);

        // Add projection parameter to params if not ignored
        if (!ignoreProjection) {
            params = params.append('projection', 'view');
        }

        const result: ResourceArray<T> = ResourceHelper.createEmptyResult<T>(_embedded);

        this.setUrls(result);
        result.sortInfo = options ? options.sort : undefined;
        let observable = ResourceHelper.getHttp().get(uri, { headers: ResourceHelper.headers, params: params });
        return observable.pipe(map(response => ResourceHelper.instantiateResourceCollection(type, response, result, subType,embeddedName)),
            catchError(error => throwError(() => error)));
    }

  public getAllEx<T extends Resource>(type: { new(): T }, resource: string, _embedded: string, options?: HalOptions, subType?: SubTypeBuilder, embeddedName?:String) {
    this.loggerService.trace("ResourceService.getAllEx:", {type: type.name, resource: resource, _embedded: _embedded, options: options, subType: subType, embeddedName: embeddedName});
    const uri = this.getResourceUrl(resource);
    const params = ResourceHelper.optionParams(new HttpParams(), options);

    // Add projection parameter to params if not ignored
    const result: ResourceArray<T> = ResourceHelper.createEmptyResult<T>(_embedded);

    this.setUrls(result);
    result.sortInfo = options ? options.sort : undefined;
    const observable = ResourceHelper.getHttp().get(uri, { headers: ResourceHelper.headers, params: params });
    return observable.pipe(map(response => ResourceHelper.instantiateResourceCollection(type, response, result, subType,embeddedName)),
      catchError(error => throwError(() => error)));
  }


  /**
     * Retrieves a single resource by ID
     * @param type The resource type constructor
     * @param resource The resource path/endpoint
     * @param id The ID of the resource to retrieve
     * @returns Observable of the retrieved resource
     */
    public get<T extends Resource>(type: { new(): T }, resource: string, id: any): Observable<T> {
        this.loggerService.trace("ResourceService.get:", type.name, resource, id);
        const uri = this.getResourceUrl(resource).concat('/', id);
        const params = new HttpParams().append('projection', 'view');
        const result: T = new type();

        this.setUrlsResource(result);
        let observable = ResourceHelper.getHttp().get(uri, { headers: ResourceHelper.headers, params: params });
        return observable.pipe(map(data => ResourceHelper.instantiateResource(result, data)),
            catchError(error => throwError(() => error)));
    }

  public getOriginal<T extends Resource>(type: { new(): T }, resource: string, id: any): Observable<T> {
    this.loggerService.trace("ResourceService.get:", type.name, resource, id);
    const uri = this.getResourceUrl(resource).concat('/', id);
    const params = new HttpParams();
    const result: T = new type();
    this.setUrlsResource(result);
    const observable = ResourceHelper.getHttp().get(uri, { headers: ResourceHelper.headers, params: params });
    return observable.pipe(map(data => ResourceHelper.instantiateResource(result, data)),
      catchError(error => throwError(() => error)));
  }

  public self

  /**
     * Retrieves a resource using its self link
     * @param type The resource type constructor
     * @param resourceLink The self link URL of the resource
     * @returns Observable of the retrieved resource
     */
    public getBySelfLink<T extends Resource>(type: { new(): T }, resourceLink: string): Observable<T> {
        this.loggerService.trace("ResourceService.getBySelfLink:", type.name, resourceLink);
        const result: T = new type();

        this.setUrlsResource(result);
        let observable = ResourceHelper.getHttp().get(ResourceHelper.getProxy(resourceLink), { headers: ResourceHelper.headers });
        return observable.pipe(map(data => ResourceHelper.instantiateResource(result, data)),
            catchError(error => throwError(() => error)));
    }

    /**
     * Searches for resources using a predefined search endpoint
     * @param type The resource type constructor
     * @param query The search query endpoint name
     * @param resource The base resource path
     * @param _embedded The name of the embedded collection in the response
     * @param options Optional HAL query parameters
     * @returns Observable of ResourceArray containing the search results
     */
    public search<T extends Resource>(type: { new(): T }, query: string, resource: string, _embedded: string, options?: HalOptions): Observable<ResourceArray<T>> {
        this.loggerService.trace("ResourceService.search:", type.name, query, resource, _embedded, options);
        const uri = this.getResourceUrl(resource).concat('/search/', query);
        const params = ResourceHelper.optionParams(new HttpParams(), options);
        const result: ResourceArray<T> = ResourceHelper.createEmptyResult<T>(_embedded);

        this.setUrls(result);
        let observable = ResourceHelper.getHttp().get(uri, { headers: ResourceHelper.headers, params: params });
        return observable.pipe(map(response => ResourceHelper.instantiateResourceCollection(type, response, result)),
            catchError(error => throwError(() => error)));
    }

    /**
     * Searches for a single resource using a predefined search endpoint
     * @param type The resource type constructor
     * @param query The search query endpoint name
     * @param resource The base resource path
     * @param options Optional HAL query parameters
     * @returns Observable of the found resource
     */
    public searchSingle<T extends Resource>(type: { new(): T }, query: string, resource: string, options?: HalOptions): Observable<T> {
        this.loggerService.trace("ResourceService.searchSingle:", type.name, query, resource, options);
        const uri = this.getResourceUrl(resource).concat('/search/', query);
        const params = ResourceHelper.optionParams(new HttpParams(), options);
        const result: T = new type();

        this.setUrlsResource(result);
        let observable = ResourceHelper.getHttp().get(uri, { headers: ResourceHelper.headers, params: params });
        return observable.pipe(map(response => ResourceHelper.instantiateResource(result, response)),
            catchError(error => throwError(() => error)));
    }

    /**
     * Executes a custom query against the API
     * @param type The resource type constructor
     * @param query The custom query string to append to the resource URL
     * @param resource The base resource path
     * @param _embedded The name of the embedded collection in the response
     * @param options Optional HAL query parameters
     * @returns Observable of ResourceArray containing the query results
     */
    public customQuery<T extends Resource>(type: { new(): T }, query: string, resource: string, _embedded: string, options?: HalOptions): Observable<ResourceArray<T>> {
        this.loggerService.trace("ResourceService.customQuery:", type.name, query, resource, _embedded, options);
        const uri = this.getResourceUrl(resource + '?' + query);
        const params = ResourceHelper.optionParams(new HttpParams(), options);
        const result: ResourceArray<T> = ResourceHelper.createEmptyResult<T>(_embedded);
        this.setUrls(result);
        let observable = ResourceHelper.getHttp().get(uri, { headers: ResourceHelper.headers, params: params });
        return observable.pipe(map(response => ResourceHelper.instantiateResourceCollection(type, response, result)),
            catchError(error => throwError(() => error)));
    }

    /**
     * Retrieves a related resource using its relation link
     * @param type The resource type constructor
     * @param resourceLink The relation link URL
     * @returns Observable of the related resource
     */
    public getByRelation<T extends Resource>(type: { new(): T }, resourceLink: string): Observable<T> {
        this.loggerService.trace("ResourceService.getByRelation:", type.name, resourceLink);
        let result: T = new type();

        this.setUrlsResource(result);
        let observable = ResourceHelper.getHttp().get(resourceLink, { headers: ResourceHelper.headers });
        return observable.pipe(map(data => ResourceHelper.instantiateResource(result, data)),
            catchError(error => throwError(() => error)));
    }

    /**
     * Retrieves an array of related resources using a relation link
     * @param type The resource type constructor
     * @param resourceLink The relation link URL
     * @param _embedded The name of the embedded collection
     * @param builder Optional builder for handling subtypes
     * @returns Observable of ResourceArray containing the related resources
     */
    public getByRelationArray<T extends Resource>(type: { new(): T }, resourceLink: string, _embedded: string, builder?: SubTypeBuilder): Observable<ResourceArray<T>> {
        this.loggerService.trace("ResourceService.getByRelationArray:", type.name, resourceLink, _embedded, builder);
        const result: ResourceArray<T> = ResourceHelper.createEmptyResult<T>(_embedded);
        this.setUrls(result);
        let observable = ResourceHelper.getHttp().get(resourceLink, { headers: ResourceHelper.headers });
        return observable.pipe(map(response => ResourceHelper.instantiateResourceCollection(type, response, result, builder)),
            catchError(error => throwError(() => error)));
    }

    /**
     * Counts the total number of resources
     * @param resource The resource path/endpoint
     * @returns Observable of the count number
     */
    public count(resource: string): Observable<number> {
        this.loggerService.trace("ResourceService.count:", resource);
        const uri = this.getResourceUrl(resource).concat('/search/countAll');

        return ResourceHelper.getHttp().get(uri, { headers: ResourceHelper.headers, observe: 'body' }).pipe(
            map((response: Response) => Number(response.body)),
            catchError(error => throwError(() => error)));
    }

    /**
     * Creates a new resource
     * @param selfResource The resource endpoint
     * @param entity The resource entity to create
     * @returns Observable of the created resource
     */
    public create<T extends Resource>(selfResource: string, entity: T) {
        this.loggerService.trace("ResourceService.create:", selfResource, entity);
        const uri = ResourceHelper.getURL() + selfResource;

        const payload = ResourceHelper.resolveRelations(entity);

        this.setUrlsResource(entity);
        const observable = ResourceHelper.getHttp().post(uri, payload, { headers: ResourceHelper.headers, observe: 'response' });
        return observable.pipe(switchMap((response: HttpResponse<string>) => {
            if (response.status >= 200 && response.status <= 207)
                return of(ResourceHelper.instantiateResource(entity, response.body));
            else if (response.status == 500) {
                const body: any = response.body;
                return throwError(() => body.error);
            }
            // Add default return
            return EMPTY;
        }));
    }

    /**
     * Updates an existing resource
     * @param entity The resource entity to update
     * @returns Observable of the updated resource
     */
    public update<T extends Resource>(entity: T) {
        this.loggerService.trace("ResourceService.update:", entity);
        if (!entity._links) {
            return throwError(() => 'no links found');
        }

        if (!entity._links.self) {
            return throwError(() => 'no self link found');
        }

        const uri = ResourceHelper.getProxy(entity._links.self.href);
        const payload = ResourceHelper.resolveRelations(entity);

      const observable = ResourceHelper.getHttp().put(uri, payload, { headers: ResourceHelper.headers, observe: 'response' });
      return observable.pipe(
        switchMap((response: HttpResponse<string>) => {
          if (response.status >= 200 && response.status <= 207) {
            return of(ResourceHelper.instantiateResource(entity, response.body));
          } else if (response.status === 500) {
            return throwError(() => response.body);
          }
          return EMPTY;
        })
      );
    }

    /**
     * Updates a collection of resources
     * @param resourceArray The array of resources to update
     * @param resourceLink The link to the collection
     * @returns Observable of the updated ResourceArray
     */
    public updateCollection<T extends Resource>(resourceArray: ResourceArray<T>, resourceLink: string) {
        this.loggerService.trace("ResourceService.updateCollection:", resourceArray, resourceLink);
        const uri = ResourceHelper.getProxy(resourceLink);
        // Create a URI list instead of resolving relations
        const payload = this.createUriList(resourceArray.result);

        // Set Content-Type to text/uri-list
        const headers = new HttpHeaders({
            'Content-Type': 'text/uri-list'
        });

        const observable: Observable<HttpResponse<any>> = ResourceHelper.getHttp().put(uri, payload, { headers: headers, observe: 'response' });
        return observable.pipe(map((response: HttpResponse<string>) => {
            if (response.status >= 200 && response.status <= 207)
                return resourceArray;
            else if (response.status == 500) {
                const body: any = response.body;
                return throwError(() => body.error);
            }
            // Add default return
            return null;
        }));
    }

    /**
     * Creates a URI list from an array of resources
     * @param resources Array of resources
     * @returns String containing URIs separated by newlines
     */
    private createUriList<T extends Resource>(resources: T[]): string {
        return resources.map(resource => resource._links.self.href).join('\n');
    }

    /**
     * Patches an existing resource
     * @param entity The resource entity to patch
     * @returns Observable of the patched resource
     */
    public patch<T extends Resource>(entity: T) {
        this.loggerService.trace("ResourceService.patch:", entity);
        if (!entity._links) {
            return throwError(() => 'no links found');
        }

        if (!entity._links.self) {
            return throwError(() => 'no self link found');
        }

        const uri = ResourceHelper.getProxy(entity._links.self.href);
        const payload = ResourceHelper.resolveRelations(entity);

        let observable = ResourceHelper.getHttp().patch(uri, payload, { headers: ResourceHelper.headers, observe: 'response' });
        return observable.pipe(map((response: HttpResponse<string>) => {
            if (response.status >= 200 && response.status <= 207)
                return ResourceHelper.instantiateResource(entity, response.body);
            else if (response.status == 500) {
                let body: any = response.body;
                return throwError(() => body.error);
            }
            // Add default return
            return null;
        }));
    }

    /**
     * Deletes a resource
     * @param entity The resource entity to delete
     * @returns Observable of the deletion operation
     */
    public delete<T extends Resource>(entity: T) {
        this.loggerService.trace("ResourceService.delete:", entity);
        const uri = ResourceHelper.getProxy(entity._links.self.href);
        return ResourceHelper.getHttp().delete<T>(uri, { headers: ResourceHelper.headers }).pipe(catchError(error => throwError(() => error)));
    }

    /**
     * Checks if a resource array has a next page
     * @param resourceArray The resource array to check
     * @returns boolean indicating if next page exists
     */
    public hasNext<T extends Resource>(resourceArray: ResourceArray<T>): boolean {
        this.loggerService.trace("ResourceService.hasNext:", resourceArray);
        return resourceArray.next_uri != undefined;
    }

    /**
     * Checks if a resource array has a previous page
     * @param resourceArray The resource array to check
     * @returns boolean indicating if previous page exists
     */
    public hasPrev<T extends Resource>(resourceArray: ResourceArray<T>): boolean {
        this.loggerService.trace("ResourceService.hasPrev:", resourceArray);
        return resourceArray.prev_uri != undefined;
    }

    /**
     * Checks if a resource array has a first page
     * @param resourceArray The resource array to check
     * @returns boolean indicating if first page exists
     */
    public hasFirst<T extends Resource>(resourceArray: ResourceArray<T>): boolean {
        this.loggerService.trace("ResourceService.hasFirst:", resourceArray);
        return resourceArray.first_uri != undefined;
    }

    /**
     * Checks if a resource array has a last page
     * @param resourceArray The resource array to check
     * @returns boolean indicating if last page exists
     */
    public hasLast<T extends Resource>(resourceArray: ResourceArray<T>): boolean {
        this.loggerService.trace("ResourceService.hasLast:", resourceArray);
        return resourceArray.last_uri != undefined;
    }

    /**
     * Gets the next page of results
     * @param resourceArray The current resource array
     * @param type The resource type constructor
     * @returns Observable of the next page ResourceArray
     */
    public next<T extends Resource>(resourceArray: ResourceArray<T>, type: { new(): T }): Observable<ResourceArray<T>> {
        this.loggerService.trace("ResourceService.next:", resourceArray, type);
        return resourceArray.next(type);
    }

    /**
     * Gets the previous page of results
     * @param resourceArray The current resource array
     * @param type The resource type constructor
     * @returns Observable of the previous page ResourceArray
     */
    public prev<T extends Resource>(resourceArray: ResourceArray<T>, type: { new(): T }): Observable<ResourceArray<T>> {
        this.loggerService.trace("ResourceService.prev:", resourceArray, type);
        return resourceArray.prev(type);
    }

    /**
     * Gets the first page of results
     * @param resourceArray The current resource array
     * @param type The resource type constructor
     * @returns Observable of the first page ResourceArray
     */
    public first<T extends Resource>(resourceArray: ResourceArray<T>, type: { new(): T }): Observable<ResourceArray<T>> {
        this.loggerService.trace("ResourceService.first:", resourceArray, type);
        return resourceArray.first(type);
    }

    /**
     * Gets the last page of results
     * @param resourceArray The current resource array
     * @param type The resource type constructor
     * @returns Observable of the last page ResourceArray
     */
    public last<T extends Resource>(resourceArray: ResourceArray<T>, type: { new(): T }): Observable<ResourceArray<T>> {
        this.loggerService.trace("ResourceService.last:", resourceArray, type);
        return resourceArray.last(type);
    }

    /**
     * Gets a specific page of results by page number
     * @param resourceArray The current resource array
     * @param type The resource type constructor
     * @param id The page number to retrieve
     * @returns Observable of the requested page ResourceArray
     */
    public page<T extends Resource>(resourceArray: ResourceArray<T>, type: { new(): T }, id: number): Observable<ResourceArray<T>> {
        this.loggerService.trace("ResourceService.page:", resourceArray, type, id);
        return resourceArray.page(type, id);
    }

    /**
     * Sorts the resource array using provided sort criteria
     * @param resourceArray The resource array to sort
     * @param type The resource type constructor
     * @param sort The sort criteria to apply
     * @returns Observable of the sorted ResourceArray
     */
    public sortElements<T extends Resource>(resourceArray: ResourceArray<T>, type: { new(): T }, ...sort: Sort[]): Observable<ResourceArray<T>> {
        this.loggerService.trace("ResourceService.sortElements:", resourceArray, type, sort);
        return resourceArray.sortElements(type, ...sort);
    }

    /**
     * Sets the page size for resource array results
     * @param resourceArray The resource array to modify
     * @param type The resource type constructor
     * @param size The desired page size
     * @returns Observable of the resized ResourceArray
     */
    public size<T extends Resource>(resourceArray: ResourceArray<T>, type: { new(): T }, size: number): Observable<ResourceArray<T>> {
        this.loggerService.trace("ResourceService.size:", resourceArray, type, size);
        return resourceArray.size(type, size);
    }

    /**
     * Gets the full resource URL for a given resource path
     * @param resource Optional resource path to append to the base URL
     * @returns The complete resource URL
     */
    public getResourceUrl(resource?: string): string {
        this.loggerService.trace("ResourceService.getResourceUrl:", resource);
        let url = ResourceService.getURL();
        if (!url.endsWith('/')) {
            url = url.concat('/');
        }
        if (resource) {
            return url.concat(resource);
        }
        return url;
    }

    /**
     * Sets the proxy and root URLs for a resource array
     * @param result The resource array to configure
     */
    private setUrls<T extends Resource>(result: ResourceArray<T>) {
        result.proxyUrl = this.externalService.getProxyUri();
        result.rootUrl = this.externalService.getRootUri();
    }

    /**
     * Sets the proxy and root URLs for a single resource
     * @param result The resource to configure
     */
    private setUrlsResource<T extends Resource>(result: T) {
        result.proxyUrl = this.externalService.getProxyUri();
        result.rootUrl = this.externalService.getRootUri();
    }
}
