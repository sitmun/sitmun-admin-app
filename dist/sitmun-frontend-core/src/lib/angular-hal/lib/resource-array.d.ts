import { Sort } from './sort';
import { ArrayInterface } from './array-interface';
import { Resource } from './resource';
import { Observable } from 'rxjs';
/** REST array of resource implementation */
export declare class ResourceArray<T extends Resource> implements ArrayInterface<T> {
    /** sorting info */
    sortInfo: Sort[];
    /** proxy url */
    proxyUrl: string;
    /** root url */
    rootUrl: string;
    /** self url */
    self_uri: string;
    /** next resource url */
    next_uri: string;
    /** previous resource url */
    prev_uri: string;
    /** first resource url */
    first_uri: string;
    /** last resource url */
    last_uri: string;
    /** embedded array list */
    _embedded: any;
    /** total number of elements in this array */
    totalElements: number;
    /** total number of pages in the response */
    totalPages: number;
    /** page number in the response */
    pageNumber: number;
    /** page size */
    pageSize: number;
    /** array components */
    result: T[];
    /** push a new resource to the array */
    push: (el: T) => void;
    /** length of the array */
    length: () => number;
    /** load array data from REST request */
    private init;
    /** Load next page */
    next: (type: new () => T) => Observable<ResourceArray<T>>;
    /** Load previous page */
    prev: (type: new () => T) => Observable<ResourceArray<T>>;
    /** Load first page */
    first: (type: new () => T) => Observable<ResourceArray<T>>;
    /** Load last page */
    last: (type: new () => T) => Observable<ResourceArray<T>>;
    /** Load page with given pageNumber*/
    page: (type: new () => T, pageNumber: number) => Observable<ResourceArray<T>>;
    /** Sort collection based on given sort attribute */
    sortElements: (type: new () => T, ...sort: Sort[]) => Observable<ResourceArray<T>>;
    /** Load page with given size */
    size: (type: new () => T, size: number) => Observable<ResourceArray<T>>;
    /** Add sort info to given URI */
    private addSortInfo(uri);
    /** Add replace or add param value to query string */
    private static replaceOrAdd(query, field, value);
}
