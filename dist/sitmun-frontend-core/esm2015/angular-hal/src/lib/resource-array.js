/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { throwError as observableThrowError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ResourceHelper } from './resource-helper';
import * as url from 'url';
/**
 * REST array of resource implementation
 * @template T
 */
export class ResourceArray {
    constructor() {
        /**
         * total number of elements in this array
         */
        this.totalElements = 0;
        /**
         * total number of pages in the response
         */
        this.totalPages = 1;
        /**
         * page number in the response
         */
        this.pageNumber = 1;
        /**
         * array components
         */
        this.result = [];
        /**
         * push a new resource to the array
         */
        this.push = (/**
         * @param {?} el
         * @return {?}
         */
        (el) => {
            this.result.push(el);
        });
        /**
         * length of the array
         */
        this.length = (/**
         * @return {?}
         */
        () => {
            return this.result.length;
        });
        /**
         * load array data from REST request
         */
        this.init = (/**
         * @param {?} type
         * @param {?} response
         * @param {?} sortInfo
         * @return {?}
         */
        (type, response, sortInfo) => {
            /** @type {?} */
            const result = ResourceHelper.createEmptyResult(this._embedded);
            result.sortInfo = sortInfo;
            ResourceHelper.instantiateResourceCollection(type, response, result);
            return result;
        });
        /**
         * Load next page
         */
        this.next = (/**
         * @param {?} type
         * @return {?}
         */
        (type) => {
            if (this.next_uri) {
                return ResourceHelper.getHttp().get(ResourceHelper.getProxy(this.next_uri), { headers: ResourceHelper.headers }).pipe(map((/**
                 * @param {?} response
                 * @return {?}
                 */
                response => this.init(type, response, this.sortInfo))), catchError((/**
                 * @param {?} error
                 * @return {?}
                 */
                error => observableThrowError(error))));
            }
            return observableThrowError('no next defined');
        });
        /**
         * Load previous page
         */
        this.prev = (/**
         * @param {?} type
         * @return {?}
         */
        (type) => {
            if (this.prev_uri) {
                return ResourceHelper.getHttp().get(ResourceHelper.getProxy(this.prev_uri), { headers: ResourceHelper.headers }).pipe(map((/**
                 * @param {?} response
                 * @return {?}
                 */
                response => this.init(type, response, this.sortInfo))), catchError((/**
                 * @param {?} error
                 * @return {?}
                 */
                error => observableThrowError(error))));
            }
            return observableThrowError('no prev defined');
        });
        /**
         * Load first page
         */
        this.first = (/**
         * @param {?} type
         * @return {?}
         */
        (type) => {
            if (this.first_uri) {
                return ResourceHelper.getHttp().get(ResourceHelper.getProxy(this.first_uri), { headers: ResourceHelper.headers }).pipe(map((/**
                 * @param {?} response
                 * @return {?}
                 */
                response => this.init(type, response, this.sortInfo))), catchError((/**
                 * @param {?} error
                 * @return {?}
                 */
                error => observableThrowError(error))));
            }
            return observableThrowError('no first defined');
        });
        /**
         * Load last page
         */
        this.last = (/**
         * @param {?} type
         * @return {?}
         */
        (type) => {
            if (this.last_uri) {
                return ResourceHelper.getHttp().get(ResourceHelper.getProxy(this.last_uri), { headers: ResourceHelper.headers }).pipe(map((/**
                 * @param {?} response
                 * @return {?}
                 */
                response => this.init(type, response, this.sortInfo))), catchError((/**
                 * @param {?} error
                 * @return {?}
                 */
                error => observableThrowError(error))));
            }
            return observableThrowError('no last defined');
        });
        /**
         * Load page with given pageNumber
         */
        this.page = (/**
         * @param {?} type
         * @param {?} pageNumber
         * @return {?}
         */
        (type, pageNumber) => {
            this.self_uri = this.self_uri.replace('{?page,size,sort}', '');
            this.self_uri = this.self_uri.replace('{&sort}', '');
            /** @type {?} */
            let urlParsed = url.parse(ResourceHelper.getProxy(this.self_uri));
            /** @type {?} */
            let query = ResourceArray.replaceOrAdd(urlParsed.query, 'size', this.pageSize.toString());
            query = ResourceArray.replaceOrAdd(query, 'page', pageNumber.toString());
            /** @type {?} */
            let uri = urlParsed.query ?
                ResourceHelper.getProxy(this.self_uri).replace(urlParsed.query, query) : ResourceHelper.getProxy(this.self_uri).concat(query);
            uri = this.addSortInfo(uri);
            return ResourceHelper.getHttp().get(uri, { headers: ResourceHelper.headers }).pipe(map((/**
             * @param {?} response
             * @return {?}
             */
            response => this.init(type, response, this.sortInfo))), catchError((/**
             * @param {?} error
             * @return {?}
             */
            error => observableThrowError(error))));
        });
        /**
         * Sort collection based on given sort attribute
         */
        this.sortElements = (/**
         * @param {?} type
         * @param {...?} sort
         * @return {?}
         */
        (type, ...sort) => {
            this.self_uri = this.self_uri.replace('{?page,size,sort}', '');
            this.self_uri = this.self_uri.replace('{&sort}', '');
            /** @type {?} */
            let uri = ResourceHelper.getProxy(this.self_uri).concat('?', 'size=', this.pageSize.toString(), '&page=', this.pageNumber.toString());
            uri = this.addSortInfo(uri);
            return ResourceHelper.getHttp().get(uri, { headers: ResourceHelper.headers }).pipe(map((/**
             * @param {?} response
             * @return {?}
             */
            response => this.init(type, response, sort))), catchError((/**
             * @param {?} error
             * @return {?}
             */
            error => observableThrowError(error))));
        });
        /**
         * Load page with given size
         */
        this.size = (/**
         * @param {?} type
         * @param {?} size
         * @return {?}
         */
        (type, size) => {
            /** @type {?} */
            let uri = ResourceHelper.getProxy(this.self_uri).concat('?', 'size=', size.toString());
            uri = this.addSortInfo(uri);
            return ResourceHelper.getHttp().get(uri, { headers: ResourceHelper.headers }).pipe(map((/**
             * @param {?} response
             * @return {?}
             */
            response => this.init(type, response, this.sortInfo))), catchError((/**
             * @param {?} error
             * @return {?}
             */
            error => observableThrowError(error))));
        });
    }
    /**
     * Add sort info to given URI
     * @private
     * @param {?} uri
     * @return {?}
     */
    addSortInfo(uri) {
        if (this.sortInfo) {
            for (const item of this.sortInfo) {
                uri = uri.concat('&sort=', item.path, ',', item.order);
            }
        }
        return uri;
    }
    /**
     * Add replace or add param value to query string
     * @private
     * @param {?} query
     * @param {?} field
     * @param {?} value
     * @return {?}
     */
    static replaceOrAdd(query, field, value) {
        if (query) {
            /** @type {?} */
            let idx = query.indexOf(field);
            /** @type {?} */
            let idxNextAmp = query.indexOf('&', idx) == -1 ? query.indexOf('/', idx) : query.indexOf('&', idx);
            if (idx != -1) {
                /** @type {?} */
                let seachValue = query.substring(idx, idxNextAmp);
                query = query.replace(seachValue, field + '=' + value);
            }
            else {
                query = query.concat("&" + field + '=' + value);
            }
        }
        else {
            query = "?" + field + '=' + value;
        }
        return query;
    }
}
if (false) {
    /**
     * sorting info
     * @type {?}
     */
    ResourceArray.prototype.sortInfo;
    /**
     * proxy url
     * @type {?}
     */
    ResourceArray.prototype.proxyUrl;
    /**
     * root url
     * @type {?}
     */
    ResourceArray.prototype.rootUrl;
    /**
     * self url
     * @type {?}
     */
    ResourceArray.prototype.self_uri;
    /**
     * next resource url
     * @type {?}
     */
    ResourceArray.prototype.next_uri;
    /**
     * previous resource url
     * @type {?}
     */
    ResourceArray.prototype.prev_uri;
    /**
     * first resource url
     * @type {?}
     */
    ResourceArray.prototype.first_uri;
    /**
     * last resource url
     * @type {?}
     */
    ResourceArray.prototype.last_uri;
    /**
     * embedded array list
     * @type {?}
     */
    ResourceArray.prototype._embedded;
    /**
     * total number of elements in this array
     * @type {?}
     */
    ResourceArray.prototype.totalElements;
    /**
     * total number of pages in the response
     * @type {?}
     */
    ResourceArray.prototype.totalPages;
    /**
     * page number in the response
     * @type {?}
     */
    ResourceArray.prototype.pageNumber;
    /**
     * page size
     * @type {?}
     */
    ResourceArray.prototype.pageSize;
    /**
     * array components
     * @type {?}
     */
    ResourceArray.prototype.result;
    /**
     * push a new resource to the array
     * @type {?}
     */
    ResourceArray.prototype.push;
    /**
     * length of the array
     * @type {?}
     */
    ResourceArray.prototype.length;
    /**
     * load array data from REST request
     * @type {?}
     * @private
     */
    ResourceArray.prototype.init;
    /**
     * Load next page
     * @type {?}
     */
    ResourceArray.prototype.next;
    /**
     * Load previous page
     * @type {?}
     */
    ResourceArray.prototype.prev;
    /**
     * Load first page
     * @type {?}
     */
    ResourceArray.prototype.first;
    /**
     * Load last page
     * @type {?}
     */
    ResourceArray.prototype.last;
    /**
     * Load page with given pageNumber
     * @type {?}
     */
    ResourceArray.prototype.page;
    /**
     * Sort collection based on given sort attribute
     * @type {?}
     */
    ResourceArray.prototype.sortElements;
    /**
     * Load page with given size
     * @type {?}
     */
    ResourceArray.prototype.size;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzb3VyY2UtYXJyYXkuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvIiwic291cmNlcyI6WyJhbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlLWFycmF5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFDQSxPQUFPLEVBQUMsVUFBVSxJQUFJLG9CQUFvQixFQUFDLE1BQU0sTUFBTSxDQUFDO0FBRXhELE9BQU8sRUFBQyxVQUFVLEVBQUUsR0FBRyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFHL0MsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBRWpELE9BQU8sS0FBSyxHQUFHLE1BQU0sS0FBSyxDQUFDOzs7OztBQUkzQixNQUFNLE9BQU8sYUFBYTtJQUExQjs7OztRQXVCVyxrQkFBYSxHQUFHLENBQUMsQ0FBQzs7OztRQUVsQixlQUFVLEdBQUcsQ0FBQyxDQUFDOzs7O1FBR2YsZUFBVSxHQUFHLENBQUMsQ0FBQzs7OztRQU1mLFdBQU0sR0FBUSxFQUFFLENBQUM7Ozs7UUFHeEIsU0FBSTs7OztRQUFHLENBQUMsRUFBSyxFQUFFLEVBQUU7WUFDYixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN6QixDQUFDLEVBQUM7Ozs7UUFHRixXQUFNOzs7UUFBRyxHQUFXLEVBQUU7WUFDbEIsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUM5QixDQUFDLEVBQUM7Ozs7UUFHTSxTQUFJOzs7Ozs7UUFBRyxDQUFDLElBQWtCLEVBQUUsUUFBYSxFQUFFLFFBQWdCLEVBQW9CLEVBQUU7O2tCQUMvRSxNQUFNLEdBQXFCLGNBQWMsQ0FBQyxpQkFBaUIsQ0FBSSxJQUFJLENBQUMsU0FBUyxDQUFDO1lBQ3BGLE1BQU0sQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1lBQzNCLGNBQWMsQ0FBQyw2QkFBNkIsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLE1B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eEIsNkJBRUU7Ozs7O0lBR0YsK0JBRUU7Ozs7OztJQUdGLDZCQUtFOzs7OztJQUdGLDZCQU9FOzs7OztJQUdGLDZCQU9FOzs7OztJQUdGLDhCQU9FOzs7OztJQUdGLDZCQU9FOzs7OztJQUdGLDZCQWNFOzs7OztJQUdGLHFDQVFFOzs7OztJQUdGLDZCQU1FIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbmltcG9ydCB7dGhyb3dFcnJvciBhcyBvYnNlcnZhYmxlVGhyb3dFcnJvcn0gZnJvbSAncnhqcyc7XHJcblxyXG5pbXBvcnQge2NhdGNoRXJyb3IsIG1hcH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5pbXBvcnQge1NvcnR9IGZyb20gJy4vc29ydCc7XHJcbmltcG9ydCB7QXJyYXlJbnRlcmZhY2V9IGZyb20gJy4vYXJyYXktaW50ZXJmYWNlJztcclxuaW1wb3J0IHtSZXNvdXJjZUhlbHBlcn0gZnJvbSAnLi9yZXNvdXJjZS1oZWxwZXInO1xyXG5pbXBvcnQge1Jlc291cmNlfSBmcm9tICcuL3Jlc291cmNlJztcclxuaW1wb3J0ICogYXMgdXJsIGZyb20gJ3VybCc7XHJcbmltcG9ydCB7T2JzZXJ2YWJsZX0gZnJvbSAncnhqcyc7XHJcblxyXG4vKiogUkVTVCBhcnJheSBvZiByZXNvdXJjZSBpbXBsZW1lbnRhdGlvbiAqL1xyXG5leHBvcnQgY2xhc3MgUmVzb3VyY2VBcnJheTxUIGV4dGVuZHMgUmVzb3VyY2U+IGltcGxlbWVudHMgQXJyYXlJbnRlcmZhY2U8VD4ge1xyXG4gICAgLyoqIHNvcnRpbmcgaW5mbyAqL1xyXG4gICAgcHVibGljIHNvcnRJbmZvOiBTb3J0W107XHJcbiAgICAvKiogcHJveHkgdXJsICovXHJcbiAgICBwdWJsaWMgcHJveHlVcmw6IHN0cmluZztcclxuICAgIC8qKiByb290IHVybCAqL1xyXG4gICAgcHVibGljIHJvb3RVcmw6IHN0cmluZztcclxuXHJcbiAgICAvKiogc2VsZiB1cmwgKi9cclxuICAgIHB1YmxpYyBzZWxmX3VyaTogc3RyaW5nO1xyXG4gICAgLyoqIG5leHQgcmVzb3VyY2UgdXJsICovXHJcbiAgICBwdWJsaWMgbmV4dF91cmk6IHN0cmluZztcclxuICAgIC8qKiBwcmV2aW91cyByZXNvdXJjZSB1cmwgKi9cclxuICAgIHB1YmxpYyBwcmV2X3VyaTogc3RyaW5nO1xyXG4gICAgLyoqIGZpcnN0IHJlc291cmNlIHVybCAqL1xyXG4gICAgcHVibGljIGZpcnN0X3VyaTogc3RyaW5nO1xyXG4gICAgLyoqIGxhc3QgcmVzb3VyY2UgdXJsICovXHJcbiAgICBwdWJsaWMgbGFzdF91cmk6IHN0cmluZztcclxuXHJcbiAgICAvKiogZW1iZWRkZWQgYXJyYXkgbGlzdCAqL1xyXG4gICAgcHVibGljIF9lbWJlZGRlZDtcclxuXHJcbiAgICAvKiogdG90YWwgbnVtYmVyIG9mIGVsZW1lbnRzIGluIHRoaXMgYXJyYXkgKi9cclxuICAgIHB1YmxpYyB0b3RhbEVsZW1lbnRzID0gMDtcclxuICAgIC8qKiB0b3RhbCBudW1iZXIgb2YgcGFnZXMgaW4gdGhlIHJlc3BvbnNlICovXHJcbiAgICBwdWJsaWMgdG90YWxQYWdlcyA9IDE7XHJcbiAgICBcclxuICAgIC8qKiBwYWdlIG51bWJlciBpbiB0aGUgcmVzcG9uc2UgKi9cclxuICAgIHB1YmxpYyBwYWdlTnVtYmVyID0gMTtcclxuICAgIFxyXG4gICAgLyoqIHBhZ2Ugc2l6ZSAqL1xyXG4gICAgcHVibGljIHBhZ2VTaXplOiBudW1iZXI7XHJcblxyXG4gICAgLyoqIGFycmF5IGNvbXBvbmVudHMgKi9cclxuICAgIHB1YmxpYyByZXN1bHQ6IFRbXSA9IFtdO1xyXG5cclxuICAgIC8qKiBwdXNoIGEgbmV3IHJlc291cmNlIHRvIHRoZSBhcnJheSAqL1xyXG4gICAgcHVzaCA9IChlbDogVCkgPT4ge1xyXG4gICAgICAgIHRoaXMucmVzdWx0LnB1c2goZWwpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKiogbGVuZ3RoIG9mIHRoZSBhcnJheSAqL1xyXG4gICAgbGVuZ3RoID0gKCk6IG51bWJlciA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzdWx0Lmxlbmd0aDtcclxuICAgIH07XHJcblxyXG4gICAgLyoqIGxvYWQgYXJyYXkgZGF0YSBmcm9tIFJFU1QgcmVxdWVzdCAqL1xyXG4gICAgcHJpdmF0ZSBpbml0ID0gKHR5cGU6IHsgbmV3KCk6IFQgfSwgcmVzcG9uc2U6IGFueSwgc29ydEluZm86IFNvcnRbXSk6IFJlc291cmNlQXJyYXk8VD4gPT4ge1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdDogUmVzb3VyY2VBcnJheTxUPiA9IFJlc291cmNlSGVscGVyLmNyZWF0ZUVtcHR5UmVzdWx0PFQ+KHRoaXMuX2VtYmVkZGVkKTtcclxuICAgICAgICByZXN1bHQuc29ydEluZm8gPSBzb3J0SW5mbztcclxuICAgICAgICBSZXNvdXJjZUhlbHBlci5pbnN0YW50aWF0ZVJlc291cmNlQ29sbGVjdGlvbih0eXBlLCByZXNwb25zZSwgcmVzdWx0KTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfTtcclxuXHJcbiAgICAvKiogTG9hZCBuZXh0IHBhZ2UgKi9cclxuICAgIG5leHQgPSAodHlwZTogeyBuZXcoKTogVCB9KTogT2JzZXJ2YWJsZTxSZXNvdXJjZUFycmF5PFQ+PiA9PiB7XHJcbiAgICAgICAgaWYgKHRoaXMubmV4dF91cmkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5nZXQoUmVzb3VyY2VIZWxwZXIuZ2V0UHJveHkodGhpcy5uZXh0X3VyaSksIHtoZWFkZXJzOiBSZXNvdXJjZUhlbHBlci5oZWFkZXJzfSkucGlwZShcclxuICAgICAgICAgICAgICAgIG1hcChyZXNwb25zZSA9PiB0aGlzLmluaXQodHlwZSwgcmVzcG9uc2UsIHRoaXMuc29ydEluZm8pKSxcclxuICAgICAgICAgICAgICAgIGNhdGNoRXJyb3IoZXJyb3IgPT4gb2JzZXJ2YWJsZVRocm93RXJyb3IoZXJyb3IpKSwpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZVRocm93RXJyb3IoJ25vIG5leHQgZGVmaW5lZCcpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKiogTG9hZCBwcmV2aW91cyBwYWdlICovXHJcbiAgICBwcmV2ID0gKHR5cGU6IHsgbmV3KCk6IFQgfSk6IE9ic2VydmFibGU8UmVzb3VyY2VBcnJheTxUPj4gPT4ge1xyXG4gICAgICAgIGlmICh0aGlzLnByZXZfdXJpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkuZ2V0KFJlc291cmNlSGVscGVyLmdldFByb3h5KHRoaXMucHJldl91cmkpLCB7aGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVyc30pLnBpcGUoXHJcbiAgICAgICAgICAgICAgICBtYXAocmVzcG9uc2UgPT4gdGhpcy5pbml0KHR5cGUsIHJlc3BvbnNlLCB0aGlzLnNvcnRJbmZvKSksXHJcbiAgICAgICAgICAgICAgICBjYXRjaEVycm9yKGVycm9yID0+IG9ic2VydmFibGVUaHJvd0Vycm9yKGVycm9yKSksKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG9ic2VydmFibGVUaHJvd0Vycm9yKCdubyBwcmV2IGRlZmluZWQnKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqIExvYWQgZmlyc3QgcGFnZSAqL1xyXG4gICAgZmlyc3QgPSAodHlwZTogeyBuZXcoKTogVCB9KTogT2JzZXJ2YWJsZTxSZXNvdXJjZUFycmF5PFQ+PiA9PiB7XHJcbiAgICAgICAgaWYgKHRoaXMuZmlyc3RfdXJpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkuZ2V0KFJlc291cmNlSGVscGVyLmdldFByb3h5KHRoaXMuZmlyc3RfdXJpKSwge2hlYWRlcnM6IFJlc291cmNlSGVscGVyLmhlYWRlcnN9KS5waXBlKFxyXG4gICAgICAgICAgICAgICAgbWFwKHJlc3BvbnNlID0+IHRoaXMuaW5pdCh0eXBlLCByZXNwb25zZSwgdGhpcy5zb3J0SW5mbykpLFxyXG4gICAgICAgICAgICAgICAgY2F0Y2hFcnJvcihlcnJvciA9PiBvYnNlcnZhYmxlVGhyb3dFcnJvcihlcnJvcikpLCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBvYnNlcnZhYmxlVGhyb3dFcnJvcignbm8gZmlyc3QgZGVmaW5lZCcpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKiogTG9hZCBsYXN0IHBhZ2UgKi9cclxuICAgIGxhc3QgPSAodHlwZTogeyBuZXcoKTogVCB9KTogT2JzZXJ2YWJsZTxSZXNvdXJjZUFycmF5PFQ+PiA9PiB7XHJcbiAgICAgICAgaWYgKHRoaXMubGFzdF91cmkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5nZXQoUmVzb3VyY2VIZWxwZXIuZ2V0UHJveHkodGhpcy5sYXN0X3VyaSksIHtoZWFkZXJzOiBSZXNvdXJjZUhlbHBlci5oZWFkZXJzfSkucGlwZShcclxuICAgICAgICAgICAgICAgIG1hcChyZXNwb25zZSA9PiB0aGlzLmluaXQodHlwZSwgcmVzcG9uc2UsIHRoaXMuc29ydEluZm8pKSxcclxuICAgICAgICAgICAgICAgIGNhdGNoRXJyb3IoZXJyb3IgPT4gb2JzZXJ2YWJsZVRocm93RXJyb3IoZXJyb3IpKSwpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZVRocm93RXJyb3IoJ25vIGxhc3QgZGVmaW5lZCcpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKiogTG9hZCBwYWdlIHdpdGggZ2l2ZW4gcGFnZU51bWJlciovXHJcbiAgICBwYWdlID0gKHR5cGU6IHsgbmV3KCk6IFQgfSwgcGFnZU51bWJlcjogbnVtYmVyKTogT2JzZXJ2YWJsZTxSZXNvdXJjZUFycmF5PFQ+PiA9PiB7XHJcbiAgICAgICAgdGhpcy5zZWxmX3VyaSA9IHRoaXMuc2VsZl91cmkucmVwbGFjZSgnez9wYWdlLHNpemUsc29ydH0nLCAnJyk7XHJcbiAgICAgICAgdGhpcy5zZWxmX3VyaSA9IHRoaXMuc2VsZl91cmkucmVwbGFjZSgneyZzb3J0fScsICcnKTtcclxuICAgICAgICBsZXQgdXJsUGFyc2VkID0gdXJsLnBhcnNlKFJlc291cmNlSGVscGVyLmdldFByb3h5KHRoaXMuc2VsZl91cmkpKTtcclxuICAgICAgICBsZXQgcXVlcnk6IHN0cmluZyA9IFJlc291cmNlQXJyYXkucmVwbGFjZU9yQWRkKHVybFBhcnNlZC5xdWVyeSwgJ3NpemUnLCB0aGlzLnBhZ2VTaXplLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgIHF1ZXJ5ID0gUmVzb3VyY2VBcnJheS5yZXBsYWNlT3JBZGQocXVlcnksICdwYWdlJywgcGFnZU51bWJlci50b1N0cmluZygpKTtcclxuXHJcblxyXG4gICAgICAgIGxldCB1cmkgPSB1cmxQYXJzZWQucXVlcnkgP1xyXG4gICAgICAgICAgICBSZXNvdXJjZUhlbHBlci5nZXRQcm94eSh0aGlzLnNlbGZfdXJpKS5yZXBsYWNlKHVybFBhcnNlZC5xdWVyeSwgcXVlcnkpIDogUmVzb3VyY2VIZWxwZXIuZ2V0UHJveHkodGhpcy5zZWxmX3VyaSkuY29uY2F0KHF1ZXJ5KTtcclxuICAgICAgICB1cmkgPSB0aGlzLmFkZFNvcnRJbmZvKHVyaSk7XHJcbiAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5nZXQodXJpLCB7aGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVyc30pLnBpcGUoXHJcbiAgICAgICAgICAgIG1hcChyZXNwb25zZSA9PiB0aGlzLmluaXQodHlwZSwgcmVzcG9uc2UsIHRoaXMuc29ydEluZm8pKSxcclxuICAgICAgICAgICAgY2F0Y2hFcnJvcihlcnJvciA9PiBvYnNlcnZhYmxlVGhyb3dFcnJvcihlcnJvcikpLCk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKiBTb3J0IGNvbGxlY3Rpb24gYmFzZWQgb24gZ2l2ZW4gc29ydCBhdHRyaWJ1dGUgKi9cclxuICAgIHNvcnRFbGVtZW50cyA9ICh0eXBlOiB7IG5ldygpOiBUIH0sIC4uLnNvcnQ6IFNvcnRbXSk6IE9ic2VydmFibGU8UmVzb3VyY2VBcnJheTxUPj4gPT4ge1xyXG4gICAgICAgIHRoaXMuc2VsZl91cmkgPSB0aGlzLnNlbGZfdXJpLnJlcGxhY2UoJ3s/cGFnZSxzaXplLHNvcnR9JywgJycpO1xyXG4gICAgICAgIHRoaXMuc2VsZl91cmkgPSB0aGlzLnNlbGZfdXJpLnJlcGxhY2UoJ3smc29ydH0nLCAnJyk7XHJcbiAgICAgICAgbGV0IHVyaSA9IFJlc291cmNlSGVscGVyLmdldFByb3h5KHRoaXMuc2VsZl91cmkpLmNvbmNhdCgnPycsICdzaXplPScsIHRoaXMucGFnZVNpemUudG9TdHJpbmcoKSwgJyZwYWdlPScsIHRoaXMucGFnZU51bWJlci50b1N0cmluZygpKTtcclxuICAgICAgICB1cmkgPSB0aGlzLmFkZFNvcnRJbmZvKHVyaSk7XHJcbiAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5nZXQodXJpLCB7aGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVyc30pLnBpcGUoXHJcbiAgICAgICAgICAgIG1hcChyZXNwb25zZSA9PiB0aGlzLmluaXQodHlwZSwgcmVzcG9uc2UsIHNvcnQpKSxcclxuICAgICAgICAgICAgY2F0Y2hFcnJvcihlcnJvciA9PiBvYnNlcnZhYmxlVGhyb3dFcnJvcihlcnJvcikpLCk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKiBMb2FkIHBhZ2Ugd2l0aCBnaXZlbiBzaXplICovXHJcbiAgICBzaXplID0gKHR5cGU6IHsgbmV3KCk6IFQgfSwgc2l6ZTogbnVtYmVyKTogT2JzZXJ2YWJsZTxSZXNvdXJjZUFycmF5PFQ+PiA9PiB7XHJcbiAgICAgICAgbGV0IHVyaSA9IFJlc291cmNlSGVscGVyLmdldFByb3h5KHRoaXMuc2VsZl91cmkpLmNvbmNhdCgnPycsICdzaXplPScsIHNpemUudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgdXJpID0gdGhpcy5hZGRTb3J0SW5mbyh1cmkpO1xyXG4gICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkuZ2V0KHVyaSwge2hlYWRlcnM6IFJlc291cmNlSGVscGVyLmhlYWRlcnN9KS5waXBlKFxyXG4gICAgICAgICAgICBtYXAocmVzcG9uc2UgPT4gdGhpcy5pbml0KHR5cGUsIHJlc3BvbnNlLCB0aGlzLnNvcnRJbmZvKSksXHJcbiAgICAgICAgICAgIGNhdGNoRXJyb3IoZXJyb3IgPT4gb2JzZXJ2YWJsZVRocm93RXJyb3IoZXJyb3IpKSwpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKiogQWRkIHNvcnQgaW5mbyB0byBnaXZlbiBVUkkgKi9cclxuICAgIHByaXZhdGUgYWRkU29ydEluZm8odXJpOiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAodGhpcy5zb3J0SW5mbykge1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgdGhpcy5zb3J0SW5mbykge1xyXG4gICAgICAgICAgICAgICAgdXJpID0gdXJpLmNvbmNhdCgnJnNvcnQ9JywgaXRlbS5wYXRoLCAnLCcsIGl0ZW0ub3JkZXIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB1cmk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEFkZCByZXBsYWNlIG9yIGFkZCBwYXJhbSB2YWx1ZSB0byBxdWVyeSBzdHJpbmcgKi9cclxuICAgIHByaXZhdGUgc3RhdGljIHJlcGxhY2VPckFkZChxdWVyeTogc3RyaW5nLCBmaWVsZDogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICBpZiAocXVlcnkpIHtcclxuICAgICAgICAgICAgbGV0IGlkeDogbnVtYmVyID0gcXVlcnkuaW5kZXhPZihmaWVsZCk7XHJcbiAgICAgICAgICAgIGxldCBpZHhOZXh0QW1wOiBudW1iZXIgPSBxdWVyeS5pbmRleE9mKCcmJywgaWR4KSA9PSAtMSA/IHF1ZXJ5LmluZGV4T2YoJy8nLCBpZHgpIDogcXVlcnkuaW5kZXhPZignJicsIGlkeCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoaWR4ICE9IC0xKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgc2VhY2hWYWx1ZSA9IHF1ZXJ5LnN1YnN0cmluZyhpZHgsIGlkeE5leHRBbXApO1xyXG4gICAgICAgICAgICAgICAgcXVlcnkgPSBxdWVyeS5yZXBsYWNlKHNlYWNoVmFsdWUsIGZpZWxkICsgJz0nICsgdmFsdWUpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcXVlcnkgPSBxdWVyeS5jb25jYXQoXCImXCIgKyBmaWVsZCArICc9JyArIHZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHF1ZXJ5ID0gXCI/XCIgKyBmaWVsZCArICc9JyArIHZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcXVlcnk7XHJcbiAgICB9XHJcbn1cclxuIl19