import { throwError, Observable, of } from 'rxjs';
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

/** ResourceService */
@Injectable()
export class ResourceService {


    /** constructor */
    constructor(private externalService: ExternalService, private loggerService: LoggerService) { }


    /** get URL */
    private static getURL(): string {
        return ResourceHelper.getURL();
    }

    /** get all resources from a base URI of a given type */
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

    /** get resource from a base URI and a given id */
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

    /** get resource from its selflink */
    public getBySelfLink<T extends Resource>(type: { new(): T }, resourceLink: string): Observable<T> {
        this.loggerService.trace("ResourceService.getBySelfLink:", type.name, resourceLink);
        const result: T = new type();

        this.setUrlsResource(result);
        let observable = ResourceHelper.getHttp().get(ResourceHelper.getProxy(resourceLink), { headers: ResourceHelper.headers });
        return observable.pipe(map(data => ResourceHelper.instantiateResource(result, data)),
            catchError(error => throwError(() => error)));
    }

    /** search resources from a given base path, query and options */
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

    /** search a single resource from a given base path, query and options */
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

    /** search resources from a given base path, custom query and options */
    public customQuery<T extends Resource>(type: { new(): T }, query: string, resource: string, _embedded: string, options?: HalOptions): Observable<ResourceArray<T>> {
        this.loggerService.trace("ResourceService.customQuery:", type.name, query, resource, _embedded, options);
        const uri = this.getResourceUrl(resource + query);
        const params = ResourceHelper.optionParams(new HttpParams(), options);
        const result: ResourceArray<T> = ResourceHelper.createEmptyResult<T>(_embedded);

        this.setUrls(result);
        let observable = ResourceHelper.getHttp().get(uri, { headers: ResourceHelper.headers, params: params });
        return observable.pipe(map(response => ResourceHelper.instantiateResourceCollection(type, response, result)),
            catchError(error => throwError(() => error)));
    }

    /** get resource given a relation link */
    public getByRelation<T extends Resource>(type: { new(): T }, resourceLink: string): Observable<T> {
        this.loggerService.trace("ResourceService.getByRelation:", type.name, resourceLink);
        let result: T = new type();

        this.setUrlsResource(result);
        let observable = ResourceHelper.getHttp().get(resourceLink, { headers: ResourceHelper.headers });
        return observable.pipe(map(data => ResourceHelper.instantiateResource(result, data)),
            catchError(error => throwError(() => error)));
    }

    /** get resource array given a relation link */
    public getByRelationArray<T extends Resource>(type: { new(): T }, resourceLink: string, _embedded: string, builder?: SubTypeBuilder): Observable<ResourceArray<T>> {
        this.loggerService.trace("ResourceService.getByRelationArray:", type.name, resourceLink, _embedded, builder);
        const result: ResourceArray<T> = ResourceHelper.createEmptyResult<T>(_embedded);
        this.setUrls(result);
        let observable = ResourceHelper.getHttp().get(resourceLink, { headers: ResourceHelper.headers });
        return observable.pipe(map(response => ResourceHelper.instantiateResourceCollection(type, response, result, builder)),
            catchError(error => throwError(() => error)));
    }

    /** count resources given a path */
    public count(resource: string): Observable<number> {
        this.loggerService.trace("ResourceService.count:", resource);
        const uri = this.getResourceUrl(resource).concat('/search/countAll');

        return ResourceHelper.getHttp().get(uri, { headers: ResourceHelper.headers, observe: 'body' }).pipe(
            map((response: Response) => Number(response.body)),
            catchError(error => throwError(() => error)));
    }

    /** create resource from self link and entity data*/
    public create<T extends Resource>(selfResource: string, entity: T) {
        this.loggerService.trace("ResourceService.create:", selfResource, entity);
        const uri = ResourceHelper.getURL() + selfResource;

        const payload = ResourceHelper.resolveRelations(entity);

        this.setUrlsResource(entity);
        let observable = ResourceHelper.getHttp().post(uri, payload, { headers: ResourceHelper.headers, observe: 'response' });
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

    /** update resource from a given entity data*/
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

        let observable = ResourceHelper.getHttp().put(uri, payload, { headers: ResourceHelper.headers, observe: 'response' });
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

    /** update resource from a given entity data*/
    public updateCollection<T extends Resource>(resourceArray: ResourceArray<T>, resourceLink: string) {
        this.loggerService.trace("ResourceService.updateCollection:", resourceArray, resourceLink);
        const uri = ResourceHelper.getProxy(resourceLink);
        // Create a URI list instead of resolving relations
        const payload = this.createUriList(resourceArray.result);

        // Set Content-Type to text/uri-list
        const headers = new HttpHeaders({
            'Content-Type': 'text/uri-list'
        });

        let observable = ResourceHelper.getHttp().put(uri, payload, { headers: headers, observe: 'response' });
        return observable.pipe(map((response: HttpResponse<string>) => {
            if (response.status >= 200 && response.status <= 207)
                return resourceArray;
            else if (response.status == 500) {
                let body: any = response.body;
                return throwError(() => body.error);
            }
            // Add default return
            return null;
        }));
    }

    // Helper method to create URI list
    private createUriList<T extends Resource>(resources: T[]): string {
        return resources.map(resource => resource._links.self.href).join('\n');
    }

    /** patch resource from a given entity data*/
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

    /** delete resource from a given entity data*/
    public delete<T extends Resource>(entity: T): Observable<Object> {
        this.loggerService.trace("ResourceService.delete:", entity);
        const uri = ResourceHelper.getProxy(entity._links.self.href);
        return ResourceHelper.getHttp().delete(uri, { headers: ResourceHelper.headers }).pipe(catchError(error => throwError(() => error)));
    }

    /** whether a resource array has next page of results*/
    public hasNext<T extends Resource>(resourceArray: ResourceArray<T>): boolean {
        this.loggerService.trace("ResourceService.hasNext:", resourceArray);
        return resourceArray.next_uri != undefined;
    }

    /** whether a resource array has previous page of results*/
    public hasPrev<T extends Resource>(resourceArray: ResourceArray<T>): boolean {
        this.loggerService.trace("ResourceService.hasPrev:", resourceArray);
        return resourceArray.prev_uri != undefined;
    }

    /** whether a resource array has first page of results*/
    public hasFirst<T extends Resource>(resourceArray: ResourceArray<T>): boolean {
        this.loggerService.trace("ResourceService.hasFirst:", resourceArray);
        return resourceArray.first_uri != undefined;
    }

    /** whether a resource array has last page of results*/
    public hasLast<T extends Resource>(resourceArray: ResourceArray<T>): boolean {
        this.loggerService.trace("ResourceService.hasLast:", resourceArray);
        return resourceArray.last_uri != undefined;
    }

    /** get resource array next page of results*/
    public next<T extends Resource>(resourceArray: ResourceArray<T>, type: { new(): T }): Observable<ResourceArray<T>> {
        this.loggerService.trace("ResourceService.next:", resourceArray, type);
        return resourceArray.next(type);
    }

    /** get resource array previous page of results*/
    public prev<T extends Resource>(resourceArray: ResourceArray<T>, type: { new(): T }): Observable<ResourceArray<T>> {
        this.loggerService.trace("ResourceService.prev:", resourceArray, type);
        return resourceArray.prev(type);
    }

    /** get resource array first page of results*/
    public first<T extends Resource>(resourceArray: ResourceArray<T>, type: { new(): T }): Observable<ResourceArray<T>> {
        this.loggerService.trace("ResourceService.first:", resourceArray, type);
        return resourceArray.first(type);
    }

    /** get resource array last page of results*/
    public last<T extends Resource>(resourceArray: ResourceArray<T>, type: { new(): T }): Observable<ResourceArray<T>> {
        this.loggerService.trace("ResourceService.last:", resourceArray, type);
        return resourceArray.last(type);
    }

    /** get resource array page of results given a page number*/
    public page<T extends Resource>(resourceArray: ResourceArray<T>, type: { new(): T }, id: number): Observable<ResourceArray<T>> {
        this.loggerService.trace("ResourceService.page:", resourceArray, type, id);
        return resourceArray.page(type, id);
    }

    /** sort resource array with a given sorting params */
    public sortElements<T extends Resource>(resourceArray: ResourceArray<T>, type: { new(): T }, ...sort: Sort[]): Observable<ResourceArray<T>> {
        this.loggerService.trace("ResourceService.sortElements:", resourceArray, type, sort);
        return resourceArray.sortElements(type, ...sort);
    }

    /** get resource array size*/
    public size<T extends Resource>(resourceArray: ResourceArray<T>, type: { new(): T }, size: number): Observable<ResourceArray<T>> {
        this.loggerService.trace("ResourceService.size:", resourceArray, type, size);
        return resourceArray.size(type, size);
    }

    /** get resource URL from a given path*/
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

    /** set proxy and root urls of given resource array */
    private setUrls<T extends Resource>(result: ResourceArray<T>) {
        result.proxyUrl = this.externalService.getProxyUri();
        result.rootUrl = this.externalService.getRootUri();
    }

    /** set proxy and root urls of given resource */
    private setUrlsResource<T extends Resource>(result: T) {
        result.proxyUrl = this.externalService.getProxyUri();
        result.rootUrl = this.externalService.getRootUri();
    }
}
