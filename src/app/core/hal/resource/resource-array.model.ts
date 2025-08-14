import {Observable, throwError} from 'rxjs';

import {catchError, map} from 'rxjs/operators';
import {Resource, ResourceHelper, Sort} from '@app/core';
import {ArrayInterface} from '@app/core/hal/common';

// Replaced Node 'url' with Web URL/URLSearchParams

/** REST array of resource implementation */
export class ResourceArray<T extends Resource> implements ArrayInterface<T> {
    /** sorting info */
    public sortInfo: Sort[];
    /** proxy url */
    public proxyUrl: string;
    /** root url */
    public rootUrl: string;

    /** self url */
    public self_uri: string;
    /** next resource url */
    public next_uri: string;
    /** previous resource url */
    public prev_uri: string;
    /** first resource url */
    public first_uri: string;
    /** last resource url */
    public last_uri: string;

    /** embedded array list */
    public _embedded;

    /** total number of elements in this array */
    public totalElements = 0;
    /** total number of pages in the response */
    public totalPages = 1;

    /** page number in the response */
    public pageNumber = 1;

    /** page size */
    public pageSize: number;

    /** array components */
    public result: T[] = [];

    /** push a new resource to the array */
    push = (el: T) => {
        this.result.push(el);
    };

    /** length of the array */
    length = (): number => {
        return this.result.length;
    };

    /** load array data from REST request */
    private init = (type: { new(): T }, response: any, sortInfo: Sort[]): ResourceArray<T> => {
        const result: ResourceArray<T> = ResourceHelper.createEmptyResult<T>(this._embedded);
        result.sortInfo = sortInfo;
        ResourceHelper.instantiateResourceCollection(type, response, result);
        return result;
    };

    /** Load next page */
    next = (type: { new(): T }): Observable<ResourceArray<T>> => {
        if (this.next_uri) {
            return ResourceHelper.getHttp().get(ResourceHelper.getProxy(this.next_uri), {headers: ResourceHelper.headers}).pipe(
                map(response => this.init(type, response, this.sortInfo)),
              catchError(error => throwError(() => error)),);
        }
      return throwError(() => new Error('no next defined'));
    };

    /** Load previous page */
    prev = (type: { new(): T }): Observable<ResourceArray<T>> => {
        if (this.prev_uri) {
            return ResourceHelper.getHttp().get(ResourceHelper.getProxy(this.prev_uri), {headers: ResourceHelper.headers}).pipe(
                map(response => this.init(type, response, this.sortInfo)),
              catchError(error => throwError(() => error)),);
        }
      return throwError(() => new Error('no prev defined'));
    };

    /** Load first page */
    first = (type: { new(): T }): Observable<ResourceArray<T>> => {
        if (this.first_uri) {
            return ResourceHelper.getHttp().get(ResourceHelper.getProxy(this.first_uri), {headers: ResourceHelper.headers}).pipe(
                map(response => this.init(type, response, this.sortInfo)),
              catchError(error => throwError(() => error)),);
        }
      return throwError(() => new Error('no first defined'));
    };

    /** Load last page */
    last = (type: { new(): T }): Observable<ResourceArray<T>> => {
        if (this.last_uri) {
            return ResourceHelper.getHttp().get(ResourceHelper.getProxy(this.last_uri), {headers: ResourceHelper.headers}).pipe(
                map(response => this.init(type, response, this.sortInfo)),
              catchError(error => throwError(() => error)),);
        }
      return throwError(() => new Error('no last defined'));
    };

    /** Load page with given pageNumber*/
    page = (type: { new(): T }, pageNumber: number): Observable<ResourceArray<T>> => {
        this.self_uri = this.self_uri.replace('{?page,size,sort}', '');
        this.self_uri = this.self_uri.replace('{&sort}', '');
      const proxied = ResourceHelper.getProxy(this.self_uri);
      // Ensure base for relative URLs
      const base = (proxied.startsWith('http://') || proxied.startsWith('https://'))
        ? undefined
        : window.location.origin;
      const urlObj = new URL(proxied, base);
      urlObj.searchParams.set('size', String(this.pageSize));
      urlObj.searchParams.set('page', String(pageNumber));
      let uri = urlObj.toString();
        uri = this.addSortInfo(uri);
      return ResourceHelper.getHttp().get(uri, {headers: ResourceHelper.headers}).pipe(
        map(response => this.init(type, response, this.sortInfo)),
        catchError(error => throwError(() => error)),
      );
    };

    /** Sort collection based on given sort attribute */
    sortElements = (type: { new(): T }, ...sort: Sort[]): Observable<ResourceArray<T>> => {
        this.self_uri = this.self_uri.replace('{?page,size,sort}', '');
        this.self_uri = this.self_uri.replace('{&sort}', '');
      const proxied = ResourceHelper.getProxy(this.self_uri);
      const base = (proxied.startsWith('http://') || proxied.startsWith('https://'))
        ? undefined
        : window.location.origin;
      const urlObj = new URL(proxied, base);
      urlObj.searchParams.set('size', String(this.pageSize));
      urlObj.searchParams.set('page', String(this.pageNumber));
      let uri = urlObj.toString();
        uri = this.addSortInfo(uri);
      return ResourceHelper.getHttp().get(uri, {headers: ResourceHelper.headers}).pipe(
        map(response => this.init(type, response, sort)),
        catchError(error => throwError(() => error)),
      );
    };

    /** Load page with given size */
    size = (type: { new(): T }, size: number): Observable<ResourceArray<T>> => {
      const proxied = ResourceHelper.getProxy(this.self_uri);
      const base = (proxied.startsWith('http://') || proxied.startsWith('https://'))
        ? undefined
        : window.location.origin;
      const urlObj = new URL(proxied, base);
      urlObj.searchParams.set('size', String(size));
      let uri = urlObj.toString();
        uri = this.addSortInfo(uri);
      return ResourceHelper.getHttp().get(uri, {headers: ResourceHelper.headers}).pipe(
        map(response => this.init(type, response, this.sortInfo)),
        catchError(error => throwError(() => error)),
      );
    };

    /** Add sort info to given URI */
    private addSortInfo(uri: string) {
        if (this.sortInfo) {
            for (const item of this.sortInfo) {
                uri = uri.concat('&sort=', item.path, ',', item.order);
            }
        }
        return uri;
    }

    /** Add replace or add param value to query string */
    private static replaceOrAdd(query: string, field: string, value: string): string {
        if (query) {
          const idx: number = query.indexOf(field);
          const idxNextAmp: number = query.indexOf('&', idx) == -1 ? query.indexOf('/', idx) : query.indexOf('&', idx);

            if (idx != -1) {
              const seachValue = query.substring(idx, idxNextAmp);
                query = query.replace(seachValue, field + '=' + value);
            } else {
                query = query.concat("&" + field + '=' + value);
            }
        } else {
            query = "?" + field + '=' + value;
        }
        return query;
    }
}
