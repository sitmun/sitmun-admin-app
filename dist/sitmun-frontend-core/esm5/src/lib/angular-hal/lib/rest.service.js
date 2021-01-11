/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { of as observableOf, throwError as observableThrowError } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { ResourceService } from './resource.service';
import { isNullOrUndefined } from 'util';
/** @typedef {?} */
var HalParam;
export { HalParam };
/** @typedef {?} */
var HalOptions;
export { HalOptions };
// unsupported: template constraints.
/**
 * REST API access interface
 * @template T
 */
var 
// unsupported: template constraints.
/**
 * REST API access interface
 * @template T
 */
RestService = /** @class */ (function () {
    /** constructor */
    function RestService(type, resource, injector, _embedded) {
        this.injector = injector;
        /**
         * _embedded field name
         */
        this._embedded = '_embedded';
        this.type = type;
        this.resource = resource;
        this.resourceService = injector.get(ResourceService);
        if (!isNullOrUndefined(_embedded))
            this._embedded = _embedded;
    }
    /** error handler */
    /**
     * error handler
     * @param {?} error
     * @return {?}
     */
    RestService.prototype.handleError = /**
     * error handler
     * @param {?} error
     * @return {?}
     */
    function (error) {
        return RestService.handleError(error);
    };
    /** error handler */
    /**
     * error handler
     * @param {?} error
     * @return {?}
     */
    RestService.handleError = /**
     * error handler
     * @param {?} error
     * @return {?}
     */
    function (error) {
        return observableThrowError(error);
    };
    /**
     * get all resources with optional options an subType params
     * @param {?=} options
     * @param {?=} subType
     * @return {?}
     */
    RestService.prototype.getAll = /**
     * get all resources with optional options an subType params
     * @param {?=} options
     * @param {?=} subType
     * @return {?}
     */
    function (options, subType) {
        var _this = this;
        return this.resourceService.getAll(this.type, this.resource, this._embedded, options, subType).pipe(mergeMap(function (resourceArray) {
            if (options && options.notPaged && !isNullOrUndefined(resourceArray.first_uri)) {
                options.notPaged = false;
                options.size = resourceArray.totalElements;
                return _this.getAll(options);
            }
            else {
                _this.resourceArray = resourceArray;
                return observableOf(resourceArray.result);
            }
        }));
    };
    /**
     * get resource from a given id
     * @param {?} id
     * @return {?}
     */
    RestService.prototype.get = /**
     * get resource from a given id
     * @param {?} id
     * @return {?}
     */
    function (id) {
        return this.resourceService.get(this.type, this.resource, id);
    };
    /**
     * get resource from self link
     * @param {?} selfLink
     * @return {?}
     */
    RestService.prototype.getBySelfLink = /**
     * get resource from self link
     * @param {?} selfLink
     * @return {?}
     */
    function (selfLink) {
        return this.resourceService.getBySelfLink(this.type, selfLink);
    };
    /**
     * search resources from a given query string and optional options params
     * @param {?} query
     * @param {?=} options
     * @return {?}
     */
    RestService.prototype.search = /**
     * search resources from a given query string and optional options params
     * @param {?} query
     * @param {?=} options
     * @return {?}
     */
    function (query, options) {
        var _this = this;
        return this.resourceService.search(this.type, query, this.resource, this._embedded, options).pipe(mergeMap(function (resourceArray) {
            if (options && options.notPaged && !isNullOrUndefined(resourceArray.first_uri)) {
                options.notPaged = false;
                options.size = resourceArray.totalElements;
                return _this.search(query, options);
            }
            else {
                _this.resourceArray = resourceArray;
                return observableOf(resourceArray.result);
            }
        }));
    };
    /**
     * search resource from a given query string and optional options params
     * @param {?} query
     * @param {?=} options
     * @return {?}
     */
    RestService.prototype.searchSingle = /**
     * search resource from a given query string and optional options params
     * @param {?} query
     * @param {?=} options
     * @return {?}
     */
    function (query, options) {
        return this.resourceService.searchSingle(this.type, query, this.resource, options);
    };
    /**
     * search resources from a given custom query string and optional options params
     * @param {?} query
     * @param {?=} options
     * @return {?}
     */
    RestService.prototype.customQuery = /**
     * search resources from a given custom query string and optional options params
     * @param {?} query
     * @param {?=} options
     * @return {?}
     */
    function (query, options) {
        var _this = this;
        return this.resourceService.customQuery(this.type, query, this.resource, this._embedded, options).pipe(mergeMap(function (resourceArray) {
            if (options && options.notPaged && !isNullOrUndefined(resourceArray.first_uri)) {
                options.notPaged = false;
                options.size = resourceArray.totalElements;
                return _this.customQuery(query, options);
            }
            else {
                _this.resourceArray = resourceArray;
                return observableOf(resourceArray.result);
            }
        }));
    };
    /**
     * get resource array given a relation link
     * @param {?} relation
     * @param {?=} builder
     * @return {?}
     */
    RestService.prototype.getByRelationArray = /**
     * get resource array given a relation link
     * @param {?} relation
     * @param {?=} builder
     * @return {?}
     */
    function (relation, builder) {
        var _this = this;
        return this.resourceService.getByRelationArray(this.type, relation, this._embedded, builder).pipe(map(function (resourceArray) {
            _this.resourceArray = resourceArray;
            return resourceArray.result;
        }));
    };
    /**
     * get resource given a relation link
     * @param {?} relation
     * @return {?}
     */
    RestService.prototype.getByRelation = /**
     * get resource given a relation link
     * @param {?} relation
     * @return {?}
     */
    function (relation) {
        return this.resourceService.getByRelation(this.type, relation);
    };
    /**
     * count resources given a path
     * @return {?}
     */
    RestService.prototype.count = /**
     * count resources given a path
     * @return {?}
     */
    function () {
        return this.resourceService.count(this.resource);
    };
    /**
     * create resource from self link and entity data
     * @param {?} entity
     * @return {?}
     */
    RestService.prototype.create = /**
     * create resource from self link and entity data
     * @param {?} entity
     * @return {?}
     */
    function (entity) {
        return this.resourceService.create(this.resource, entity);
    };
    /**
     * update resource from a given entity data
     * @param {?} entity
     * @return {?}
     */
    RestService.prototype.update = /**
     * update resource from a given entity data
     * @param {?} entity
     * @return {?}
     */
    function (entity) {
        return this.resourceService.update(entity);
    };
    /**
     * patch resource from a given entity data
     * @param {?} entity
     * @return {?}
     */
    RestService.prototype.patch = /**
     * patch resource from a given entity data
     * @param {?} entity
     * @return {?}
     */
    function (entity) {
        return this.resourceService.patch(entity);
    };
    /**
     * delete resource from a given entity data
     * @param {?} entity
     * @return {?}
     */
    RestService.prototype.delete = /**
     * delete resource from a given entity data
     * @param {?} entity
     * @return {?}
     */
    function (entity) {
        return this.resourceService.delete(entity);
    };
    /**
     * get total number of elements of resource array
     * @return {?}
     */
    RestService.prototype.totalElement = /**
     * get total number of elements of resource array
     * @return {?}
     */
    function () {
        if (this.resourceArray && this.resourceArray.totalElements)
            return this.resourceArray.totalElements;
        return 0;
    };
    /**
     * whether a resource array has first page of results
     * @return {?}
     */
    RestService.prototype.hasFirst = /**
     * whether a resource array has first page of results
     * @return {?}
     */
    function () {
        if (this.resourceArray)
            return this.resourceService.hasFirst(this.resourceArray);
        return false;
    };
    /**
     * whether a resource array has next page of results
     * @return {?}
     */
    RestService.prototype.hasNext = /**
     * whether a resource array has next page of results
     * @return {?}
     */
    function () {
        if (this.resourceArray)
            return this.resourceService.hasNext(this.resourceArray);
        return false;
    };
    /**
     * whether a resource array has previous page of results
     * @return {?}
     */
    RestService.prototype.hasPrev = /**
     * whether a resource array has previous page of results
     * @return {?}
     */
    function () {
        if (this.resourceArray)
            return this.resourceService.hasPrev(this.resourceArray);
        return false;
    };
    /**
     * whether a resource array has last page of results
     * @return {?}
     */
    RestService.prototype.hasLast = /**
     * whether a resource array has last page of results
     * @return {?}
     */
    function () {
        if (this.resourceArray)
            return this.resourceService.hasLast(this.resourceArray);
        return false;
    };
    /**
     * get resource array next page of results
     * @return {?}
     */
    RestService.prototype.next = /**
     * get resource array next page of results
     * @return {?}
     */
    function () {
        var _this = this;
        if (this.resourceArray)
            return this.resourceService.next(this.resourceArray, this.type).pipe(map(function (resourceArray) {
                _this.resourceArray = resourceArray;
                return resourceArray.result;
            }));
        else
            observableThrowError('no resourceArray found');
    };
    /**
     * get resource array previous page of results
     * @return {?}
     */
    RestService.prototype.prev = /**
     * get resource array previous page of results
     * @return {?}
     */
    function () {
        var _this = this;
        if (this.resourceArray)
            return this.resourceService.prev(this.resourceArray, this.type).pipe(map(function (resourceArray) {
                _this.resourceArray = resourceArray;
                return resourceArray.result;
            }));
        else
            observableThrowError('no resourceArray found');
    };
    /**
     * get resource array first page of results
     * @return {?}
     */
    RestService.prototype.first = /**
     * get resource array first page of results
     * @return {?}
     */
    function () {
        var _this = this;
        if (this.resourceArray)
            return this.resourceService.first(this.resourceArray, this.type)
                .pipe(map(function (resourceArray) {
                _this.resourceArray = resourceArray;
                return resourceArray.result;
            }));
        else
            observableThrowError('no resourceArray found');
    };
    /**
     * get resource array last page of results
     * @return {?}
     */
    RestService.prototype.last = /**
     * get resource array last page of results
     * @return {?}
     */
    function () {
        var _this = this;
        if (this.resourceArray)
            return this.resourceService.last(this.resourceArray, this.type)
                .pipe(map(function (resourceArray) {
                _this.resourceArray = resourceArray;
                return resourceArray.result;
            }));
        else
            observableThrowError('no resourceArray found');
    };
    /**
     * get resource array page of results given a page number
     * @param {?} pageNumber
     * @return {?}
     */
    RestService.prototype.page = /**
     * get resource array page of results given a page number
     * @param {?} pageNumber
     * @return {?}
     */
    function (pageNumber) {
        var _this = this;
        if (this.resourceArray)
            return this.resourceService.page(this.resourceArray, this.type, pageNumber).pipe(map(function (resourceArray) {
                _this.resourceArray = resourceArray;
                return resourceArray.result;
            }));
        else
            observableThrowError('no resourceArray found');
    };
    return RestService;
}());
// unsupported: template constraints.
/**
 * REST API access interface
 * @template T
 */
export { RestService };
if (false) {
    /**
     * resource type
     * @type {?}
     */
    RestService.prototype.type;
    /**
     * resource path
     * @type {?}
     */
    RestService.prototype.resource;
    /**
     * resource array
     * @type {?}
     */
    RestService.prototype.resourceArray;
    /**
     * resource service
     * @type {?}
     */
    RestService.prototype.resourceService;
    /**
     * _embedded field name
     * @type {?}
     */
    RestService.prototype._embedded;
    /** @type {?} */
    RestService.prototype.injector;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzdC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL3NyYy9saWIvYW5ndWxhci1oYWwvIiwic291cmNlcyI6WyJsaWIvcmVzdC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUMsRUFBRSxJQUFJLFlBQVksRUFBRSxVQUFVLElBQUksb0JBQW9CLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDNUUsT0FBTyxFQUFDLEdBQUcsRUFBRSxRQUFRLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUk3QyxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFFbkQsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sTUFBTSxDQUFDOzs7Ozs7Ozs7Ozs7QUFVdkM7Ozs7OztBQUFBO0lBWUksa0JBQWtCO0lBQ2xCLHFCQUFZLElBQWtCLEVBQ2xCLFFBQWdCLEVBQ1IsVUFDUixTQUFrQjtRQURWLGFBQVEsR0FBUixRQUFROzs7O3lCQUxBLFdBQVc7UUFPbkMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFDekIsSUFBSSxDQUFDLGVBQWUsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQ3JELEVBQUUsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDOUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7S0FDbEM7SUFFRCxvQkFBb0I7Ozs7OztJQUNWLGlDQUFXOzs7OztJQUFyQixVQUFzQixLQUFVO1FBQzVCLE1BQU0sQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ3pDO0lBRUQsb0JBQW9COzs7Ozs7SUFDSCx1QkFBVzs7Ozs7SUFBNUIsVUFBNkIsS0FBVTtRQUNuQyxNQUFNLENBQUMsb0JBQW9CLENB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LGFBQWEsR0FBRyxhQUFhLENBQUM7Z0JBQ25DLE1BQU0sQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDO2FBQy9CLENBQUMsQ0FBQyxDQUFDO1FBQ1osSUFBSTtZQUNBLG9CQUFvQixDQUFDLHdCQUF3QixDQUFDLENBQUM7O3NCQXZQM0Q7SUF5UEMsQ0FBQTs7Ozs7O0FBeE9ELHVCQXdPQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7b2YgYXMgb2JzZXJ2YWJsZU9mLCB0aHJvd0Vycm9yIGFzIG9ic2VydmFibGVUaHJvd0Vycm9yfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHttYXAsIG1lcmdlTWFwfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcbmltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4vcmVzb3VyY2UnO1xyXG5pbXBvcnQge1Jlc291cmNlQXJyYXl9IGZyb20gJy4vcmVzb3VyY2UtYXJyYXknO1xyXG5pbXBvcnQge1NvcnR9IGZyb20gJy4vc29ydCc7XHJcbmltcG9ydCB7UmVzb3VyY2VTZXJ2aWNlfSBmcm9tICcuL3Jlc291cmNlLnNlcnZpY2UnO1xyXG5pbXBvcnQge1N1YlR5cGVCdWlsZGVyfSBmcm9tICcuL3N1YnR5cGUtYnVpbGRlcic7XHJcbmltcG9ydCB7aXNOdWxsT3JVbmRlZmluZWR9IGZyb20gJ3V0aWwnO1xyXG5pbXBvcnQge09ic2VydmFibGV9IGZyb20gJ3J4anMvaW50ZXJuYWwvT2JzZXJ2YWJsZSc7XHJcbmltcG9ydCB7SW5qZWN0b3J9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XHJcblxyXG4vKiogSEFMIHBhcmFtIGRhdGEgbW9kZWwgKi9cclxuZXhwb3J0IHR5cGUgSGFsUGFyYW0gPSB7IGtleTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nIHwgbnVtYmVyIHwgYm9vbGVhbiB9O1xyXG4vKiogSEFMIG9wdGlvbiBkYXRhIG1vZGVsICovXHJcbmV4cG9ydCB0eXBlIEhhbE9wdGlvbnMgPSB7IG5vdFBhZ2VkPzogYm9vbGVhbiwgc2l6ZT86IG51bWJlciwgc29ydD86IFNvcnRbXSwgcGFyYW1zPzogSGFsUGFyYW1bXSB9O1xyXG5cclxuLyoqIFJFU1QgQVBJIGFjY2VzcyBpbnRlcmZhY2UgKi9cclxuZXhwb3J0IGNsYXNzIFJlc3RTZXJ2aWNlPFQgZXh0ZW5kcyBSZXNvdXJjZT4ge1xyXG4gICAgLyoqIHJlc291cmNlIHR5cGUgKi9cclxuICAgIHByaXZhdGUgdHlwZTogYW55O1xyXG4gICAgLyoqIHJlc291cmNlIHBhdGggKi9cclxuICAgIHByaXZhdGUgcmVzb3VyY2U6IHN0cmluZztcclxuICAgIC8qKiByZXNvdXJjZSBhcnJheSAqL1xyXG4gICAgcHVibGljIHJlc291cmNlQXJyYXk6IFJlc291cmNlQXJyYXk8VD47XHJcbiAgICAvKiogcmVzb3VyY2Ugc2VydmljZSAqL1xyXG4gICAgcHVibGljIHJlc291cmNlU2VydmljZTogUmVzb3VyY2VTZXJ2aWNlO1xyXG4gICAgLyoqIF9lbWJlZGRlZCBmaWVsZCBuYW1lICovXHJcbiAgICBwcml2YXRlIF9lbWJlZGRlZDogc3RyaW5nID0gJ19lbWJlZGRlZCc7XHJcblxyXG4gICAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgICBjb25zdHJ1Y3Rvcih0eXBlOiB7IG5ldygpOiBUIH0sXHJcbiAgICAgICAgICAgICAgICByZXNvdXJjZTogc3RyaW5nLFxyXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSBpbmplY3RvcjogSW5qZWN0b3IsXHJcbiAgICAgICAgICAgICAgICBfZW1iZWRkZWQ/OiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLnR5cGUgPSB0eXBlO1xyXG4gICAgICAgIHRoaXMucmVzb3VyY2UgPSByZXNvdXJjZTtcclxuICAgICAgICB0aGlzLnJlc291cmNlU2VydmljZSA9IGluamVjdG9yLmdldChSZXNvdXJjZVNlcnZpY2UpO1xyXG4gICAgICAgIGlmICghaXNOdWxsT3JVbmRlZmluZWQoX2VtYmVkZGVkKSlcclxuICAgICAgICAgICAgdGhpcy5fZW1iZWRkZWQgPSBfZW1iZWRkZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGVycm9yIGhhbmRsZXIgKi9cclxuICAgIHByb3RlY3RlZCBoYW5kbGVFcnJvcihlcnJvcjogYW55KTpPYnNlcnZhYmxlPG5ldmVyPiB7XHJcbiAgICAgICAgcmV0dXJuIFJlc3RTZXJ2aWNlLmhhbmRsZUVycm9yKGVycm9yKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZXJyb3IgaGFuZGxlciAqL1xyXG4gICAgcHJvdGVjdGVkIHN0YXRpYyBoYW5kbGVFcnJvcihlcnJvcjogYW55KTpPYnNlcnZhYmxlPG5ldmVyPiB7XHJcbiAgICAgICAgcmV0dXJuIG9ic2VydmFibGVUaHJvd0Vycm9yKGVycm9yKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IGFsbCByZXNvdXJjZXMgd2l0aCBvcHRpb25hbCBvcHRpb25zIGFuIHN1YlR5cGUgcGFyYW1zICovXHJcbiAgICBwdWJsaWMgZ2V0QWxsKG9wdGlvbnM/OiBIYWxPcHRpb25zLCBzdWJUeXBlPzogU3ViVHlwZUJ1aWxkZXIpOiBPYnNlcnZhYmxlPFRbXT4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5nZXRBbGwodGhpcy50eXBlLCB0aGlzLnJlc291cmNlLCB0aGlzLl9lbWJlZGRlZCwgb3B0aW9ucywgc3ViVHlwZSkucGlwZShcclxuICAgICAgICAgICAgbWVyZ2VNYXAoKHJlc291cmNlQXJyYXk6IFJlc291cmNlQXJyYXk8VD4pID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMubm90UGFnZWQgJiYgIWlzTnVsbE9yVW5kZWZpbmVkKHJlc291cmNlQXJyYXkuZmlyc3RfdXJpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMubm90UGFnZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLnNpemUgPSByZXNvdXJjZUFycmF5LnRvdGFsRWxlbWVudHM7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0QWxsKG9wdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlc291cmNlQXJyYXkgPSByZXNvdXJjZUFycmF5O1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvYnNlcnZhYmxlT2YocmVzb3VyY2VBcnJheS5yZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBmcm9tIGEgZ2l2ZW4gaWQgKi9cclxuICAgIHB1YmxpYyBnZXQoaWQ6IGFueSk6IE9ic2VydmFibGU8VD4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5nZXQodGhpcy50eXBlLCB0aGlzLnJlc291cmNlLCBpZCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBmcm9tIHNlbGYgbGluayAqL1xyXG4gICAgcHVibGljIGdldEJ5U2VsZkxpbmsoc2VsZkxpbms6IHN0cmluZyk6IE9ic2VydmFibGU8VD4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5nZXRCeVNlbGZMaW5rKHRoaXMudHlwZSwgc2VsZkxpbmspO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBzZWFyY2ggcmVzb3VyY2VzIGZyb20gYSBnaXZlbiBxdWVyeSBzdHJpbmcgYW5kIG9wdGlvbmFsIG9wdGlvbnMgcGFyYW1zICovXHJcbiAgICBwdWJsaWMgc2VhcmNoKHF1ZXJ5OiBzdHJpbmcsIG9wdGlvbnM/OiBIYWxPcHRpb25zKTogT2JzZXJ2YWJsZTxUW10+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZVNlcnZpY2Uuc2VhcmNoKHRoaXMudHlwZSwgcXVlcnksIHRoaXMucmVzb3VyY2UsIHRoaXMuX2VtYmVkZGVkLCBvcHRpb25zKS5waXBlKFxyXG4gICAgICAgICAgICBtZXJnZU1hcCgocmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPikgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5ub3RQYWdlZCAmJiAhaXNOdWxsT3JVbmRlZmluZWQocmVzb3VyY2VBcnJheS5maXJzdF91cmkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5ub3RQYWdlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuc2l6ZSA9IHJlc291cmNlQXJyYXkudG90YWxFbGVtZW50cztcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zZWFyY2gocXVlcnksIG9wdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlc291cmNlQXJyYXkgPSByZXNvdXJjZUFycmF5O1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvYnNlcnZhYmxlT2YocmVzb3VyY2VBcnJheS5yZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHNlYXJjaCByZXNvdXJjZSBmcm9tIGEgZ2l2ZW4gcXVlcnkgc3RyaW5nIGFuZCBvcHRpb25hbCBvcHRpb25zIHBhcmFtcyAqL1xyXG4gICAgcHVibGljIHNlYXJjaFNpbmdsZShxdWVyeTogc3RyaW5nLCBvcHRpb25zPzogSGFsT3B0aW9ucyk6IE9ic2VydmFibGU8VD4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5zZWFyY2hTaW5nbGUodGhpcy50eXBlLCBxdWVyeSwgdGhpcy5yZXNvdXJjZSwgb3B0aW9ucyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHNlYXJjaCByZXNvdXJjZXMgZnJvbSBhIGdpdmVuIGN1c3RvbSBxdWVyeSBzdHJpbmcgYW5kIG9wdGlvbmFsIG9wdGlvbnMgcGFyYW1zICovXHJcbiAgICBwdWJsaWMgY3VzdG9tUXVlcnkocXVlcnk6IHN0cmluZywgb3B0aW9ucz86IEhhbE9wdGlvbnMpOiBPYnNlcnZhYmxlPFRbXT4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5jdXN0b21RdWVyeSh0aGlzLnR5cGUsIHF1ZXJ5LCB0aGlzLnJlc291cmNlLCB0aGlzLl9lbWJlZGRlZCwgb3B0aW9ucykucGlwZShcclxuICAgICAgICAgICAgbWVyZ2VNYXAoKHJlc291cmNlQXJyYXk6IFJlc291cmNlQXJyYXk8VD4pID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMubm90UGFnZWQgJiYgIWlzTnVsbE9yVW5kZWZpbmVkKHJlc291cmNlQXJyYXkuZmlyc3RfdXJpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMubm90UGFnZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLnNpemUgPSByZXNvdXJjZUFycmF5LnRvdGFsRWxlbWVudHM7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3VzdG9tUXVlcnkocXVlcnksIG9wdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlc291cmNlQXJyYXkgPSByZXNvdXJjZUFycmF5O1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvYnNlcnZhYmxlT2YocmVzb3VyY2VBcnJheS5yZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KSk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKiBnZXQgcmVzb3VyY2UgYXJyYXkgZ2l2ZW4gYSByZWxhdGlvbiBsaW5rICovXHJcbiAgICBwdWJsaWMgZ2V0QnlSZWxhdGlvbkFycmF5KHJlbGF0aW9uOiBzdHJpbmcsIGJ1aWxkZXI/OiBTdWJUeXBlQnVpbGRlcik6IE9ic2VydmFibGU8VFtdPiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldEJ5UmVsYXRpb25BcnJheSh0aGlzLnR5cGUsIHJlbGF0aW9uLCB0aGlzLl9lbWJlZGRlZCwgYnVpbGRlcikucGlwZShcclxuICAgICAgICAgICAgbWFwKChyZXNvdXJjZUFycmF5OiBSZXNvdXJjZUFycmF5PFQ+KSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlc291cmNlQXJyYXkgPSByZXNvdXJjZUFycmF5O1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc291cmNlQXJyYXkucmVzdWx0O1xyXG4gICAgICAgICAgICB9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBnaXZlbiBhIHJlbGF0aW9uIGxpbmsgKi9cclxuICAgIHB1YmxpYyBnZXRCeVJlbGF0aW9uKHJlbGF0aW9uOiBzdHJpbmcpOiBPYnNlcnZhYmxlPFQ+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0QnlSZWxhdGlvbih0aGlzLnR5cGUsIHJlbGF0aW9uKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogY291bnQgcmVzb3VyY2VzIGdpdmVuIGEgcGF0aCAqL1xyXG4gICAgcHVibGljIGNvdW50KCk6IE9ic2VydmFibGU8bnVtYmVyPiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLmNvdW50KHRoaXMucmVzb3VyY2UpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBjcmVhdGUgcmVzb3VyY2UgZnJvbSBzZWxmIGxpbmsgYW5kIGVudGl0eSBkYXRhKi9cclxuICAgIHB1YmxpYyBjcmVhdGUoZW50aXR5OiBUKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLmNyZWF0ZSh0aGlzLnJlc291cmNlLCBlbnRpdHkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiB1cGRhdGUgcmVzb3VyY2UgZnJvbSBhIGdpdmVuIGVudGl0eSBkYXRhKi9cclxuICAgIHB1YmxpYyB1cGRhdGUoZW50aXR5OiBUKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLnVwZGF0ZShlbnRpdHkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBwYXRjaCByZXNvdXJjZSBmcm9tIGEgZ2l2ZW4gZW50aXR5IGRhdGEqL1xyXG4gICAgcHVibGljIHBhdGNoKGVudGl0eTogVCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5wYXRjaChlbnRpdHkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBkZWxldGUgcmVzb3VyY2UgZnJvbSBhIGdpdmVuIGVudGl0eSBkYXRhKi9cclxuICAgIHB1YmxpYyBkZWxldGUoZW50aXR5OiBUKTogT2JzZXJ2YWJsZTxPYmplY3Q+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZVNlcnZpY2UuZGVsZXRlKGVudGl0eSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCB0b3RhbCBudW1iZXIgb2YgZWxlbWVudHMgb2YgcmVzb3VyY2UgYXJyYXkgKi9cclxuICAgIHB1YmxpYyB0b3RhbEVsZW1lbnQoKTogbnVtYmVyIHtcclxuICAgICAgICBpZiAodGhpcy5yZXNvdXJjZUFycmF5ICYmIHRoaXMucmVzb3VyY2VBcnJheS50b3RhbEVsZW1lbnRzKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZUFycmF5LnRvdGFsRWxlbWVudHM7XHJcbiAgICAgICAgcmV0dXJuIDA7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHdoZXRoZXIgYSByZXNvdXJjZSBhcnJheSBoYXMgZmlyc3QgcGFnZSBvZiByZXN1bHRzKi9cclxuICAgIHB1YmxpYyBoYXNGaXJzdCgpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAodGhpcy5yZXNvdXJjZUFycmF5KVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZVNlcnZpY2UuaGFzRmlyc3QodGhpcy5yZXNvdXJjZUFycmF5KTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHdoZXRoZXIgYSByZXNvdXJjZSBhcnJheSBoYXMgbmV4dCBwYWdlIG9mIHJlc3VsdHMqL1xyXG4gICAgcHVibGljIGhhc05leHQoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKHRoaXMucmVzb3VyY2VBcnJheSlcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLmhhc05leHQodGhpcy5yZXNvdXJjZUFycmF5KTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHdoZXRoZXIgYSByZXNvdXJjZSBhcnJheSBoYXMgcHJldmlvdXMgcGFnZSBvZiByZXN1bHRzKi9cclxuICAgIHB1YmxpYyBoYXNQcmV2KCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICh0aGlzLnJlc291cmNlQXJyYXkpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5oYXNQcmV2KHRoaXMucmVzb3VyY2VBcnJheSk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiB3aGV0aGVyIGEgcmVzb3VyY2UgYXJyYXkgaGFzIGxhc3QgcGFnZSBvZiByZXN1bHRzKi9cclxuICAgIHB1YmxpYyBoYXNMYXN0KCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICh0aGlzLnJlc291cmNlQXJyYXkpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5oYXNMYXN0KHRoaXMucmVzb3VyY2VBcnJheSk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgcmVzb3VyY2UgYXJyYXkgbmV4dCBwYWdlIG9mIHJlc3VsdHMqL1xyXG4gICAgcHVibGljIG5leHQoKTogT2JzZXJ2YWJsZTxUW10+IHtcclxuICAgICAgICBpZiAodGhpcy5yZXNvdXJjZUFycmF5KVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZVNlcnZpY2UubmV4dCh0aGlzLnJlc291cmNlQXJyYXksIHRoaXMudHlwZSkucGlwZShcclxuICAgICAgICAgICAgICAgIG1hcCgocmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVzb3VyY2VBcnJheSA9IHJlc291cmNlQXJyYXk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc291cmNlQXJyYXkucmVzdWx0O1xyXG4gICAgICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgb2JzZXJ2YWJsZVRocm93RXJyb3IoJ25vIHJlc291cmNlQXJyYXkgZm91bmQnKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHJlc291cmNlIGFycmF5IHByZXZpb3VzIHBhZ2Ugb2YgcmVzdWx0cyovXHJcbiAgICBwdWJsaWMgcHJldigpOiBPYnNlcnZhYmxlPFRbXT4ge1xyXG4gICAgICAgIGlmICh0aGlzLnJlc291cmNlQXJyYXkpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5wcmV2KHRoaXMucmVzb3VyY2VBcnJheSwgdGhpcy50eXBlKS5waXBlKFxyXG4gICAgICAgICAgICAgICAgbWFwKChyZXNvdXJjZUFycmF5OiBSZXNvdXJjZUFycmF5PFQ+KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXNvdXJjZUFycmF5ID0gcmVzb3VyY2VBcnJheTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzb3VyY2VBcnJheS5yZXN1bHQ7XHJcbiAgICAgICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBvYnNlcnZhYmxlVGhyb3dFcnJvcignbm8gcmVzb3VyY2VBcnJheSBmb3VuZCcpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgcmVzb3VyY2UgYXJyYXkgZmlyc3QgcGFnZSBvZiByZXN1bHRzKi9cclxuICAgIHB1YmxpYyBmaXJzdCgpOiBPYnNlcnZhYmxlPFRbXT4ge1xyXG4gICAgICAgIGlmICh0aGlzLnJlc291cmNlQXJyYXkpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5maXJzdCh0aGlzLnJlc291cmNlQXJyYXksIHRoaXMudHlwZSlcclxuICAgICAgICAgICAgICAgIC5waXBlKFxyXG4gICAgICAgICAgICAgICAgICAgIG1hcCgocmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlc291cmNlQXJyYXkgPSByZXNvdXJjZUFycmF5O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzb3VyY2VBcnJheS5yZXN1bHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBvYnNlcnZhYmxlVGhyb3dFcnJvcignbm8gcmVzb3VyY2VBcnJheSBmb3VuZCcpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgcmVzb3VyY2UgYXJyYXkgbGFzdCBwYWdlIG9mIHJlc3VsdHMqL1xyXG4gICAgcHVibGljIGxhc3QoKTogT2JzZXJ2YWJsZTxUW10+IHtcclxuICAgICAgICBpZiAodGhpcy5yZXNvdXJjZUFycmF5KVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZVNlcnZpY2UubGFzdCh0aGlzLnJlc291cmNlQXJyYXksIHRoaXMudHlwZSlcclxuICAgICAgICAgICAgICAgIC5waXBlKFxyXG4gICAgICAgICAgICAgICAgICAgIG1hcCgocmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlc291cmNlQXJyYXkgPSByZXNvdXJjZUFycmF5O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzb3VyY2VBcnJheS5yZXN1bHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBvYnNlcnZhYmxlVGhyb3dFcnJvcignbm8gcmVzb3VyY2VBcnJheSBmb3VuZCcpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgcmVzb3VyY2UgYXJyYXkgcGFnZSBvZiByZXN1bHRzIGdpdmVuIGEgcGFnZSBudW1iZXIqL1xyXG4gICAgcHVibGljIHBhZ2UocGFnZU51bWJlcjogbnVtYmVyKTogT2JzZXJ2YWJsZTxUW10+IHtcclxuICAgICAgICBpZiAodGhpcy5yZXNvdXJjZUFycmF5KVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZVNlcnZpY2UucGFnZSh0aGlzLnJlc291cmNlQXJyYXksIHRoaXMudHlwZSwgcGFnZU51bWJlcikucGlwZShcclxuICAgICAgICAgICAgICAgIG1hcCgocmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVzb3VyY2VBcnJheSA9IHJlc291cmNlQXJyYXk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc291cmNlQXJyYXkucmVzdWx0O1xyXG4gICAgICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgb2JzZXJ2YWJsZVRocm93RXJyb3IoJ25vIHJlc291cmNlQXJyYXkgZm91bmQnKTtcclxuICAgIH1cclxufVxyXG4iXX0=