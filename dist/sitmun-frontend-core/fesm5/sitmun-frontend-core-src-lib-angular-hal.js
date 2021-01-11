import { __spread, __values } from 'tslib';
import { throwError, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { parse } from 'url';
import { HttpHeaders, HttpParams, HttpClient, HttpClientModule } from '@angular/common/http';
import { isNullOrUndefined, isPrimitive } from 'util';
import { Inject, Injectable, NgModule } from '@angular/core';
import 'rxjs/add/observable/concat';
import 'rxjs/add/observable/defer';
import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/concatMap';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/expand';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/let';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/publishReplay';
import 'rxjs/add/operator/reduce';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/takeWhile';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
// unsupported: template constraints.
/**
 * REST array of resource implementation
 * @template T
 */
var  
// unsupported: template constraints.
/**
 * REST array of resource implementation
 * @template T
 */
ResourceArray = /** @class */ (function () {
    function ResourceArray() {
        var _this = this;
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
        this.push = function (el) {
            _this.result.push(el);
        };
        /**
         * length of the array
         */
        this.length = function () {
            return _this.result.length;
        };
        /**
         * load array data from REST request
         */
        this.init = function (type, response, sortInfo) {
            /** @type {?} */
            var result = ResourceHelper.createEmptyResult(_this._embedded);
            result.sortInfo = sortInfo;
            ResourceHelper.instantiateResourceCollection(type, response, result);
            return result;
        };
        /**
         * Load next page
         */
        this.next = function (type) {
            if (_this.next_uri) {
                return ResourceHelper.getHttp().get(ResourceHelper.getProxy(_this.next_uri), { headers: ResourceHelper.headers }).pipe(map(function (response) { return _this.init(type, response, _this.sortInfo); }), catchError(function (error) { return throwError(error); }));
            }
            return throwError('no next defined');
        };
        /**
         * Load previous page
         */
        this.prev = function (type) {
            if (_this.prev_uri) {
                return ResourceHelper.getHttp().get(ResourceHelper.getProxy(_this.prev_uri), { headers: ResourceHelper.headers }).pipe(map(function (response) { return _this.init(type, response, _this.sortInfo); }), catchError(function (error) { return throwError(error); }));
            }
            return throwError('no prev defined');
        };
        /**
         * Load first page
         */
        this.first = function (type) {
            if (_this.first_uri) {
                return ResourceHelper.getHttp().get(ResourceHelper.getProxy(_this.first_uri), { headers: ResourceHelper.headers }).pipe(map(function (response) { return _this.init(type, response, _this.sortInfo); }), catchError(function (error) { return throwError(error); }));
            }
            return throwError('no first defined');
        };
        /**
         * Load last page
         */
        this.last = function (type) {
            if (_this.last_uri) {
                return ResourceHelper.getHttp().get(ResourceHelper.getProxy(_this.last_uri), { headers: ResourceHelper.headers }).pipe(map(function (response) { return _this.init(type, response, _this.sortInfo); }), catchError(function (error) { return throwError(error); }));
            }
            return throwError('no last defined');
        };
        /**
         * Load page with given pageNumber
         */
        this.page = function (type, pageNumber) {
            _this.self_uri = _this.self_uri.replace('{?page,size,sort}', '');
            _this.self_uri = _this.self_uri.replace('{&sort}', '');
            /** @type {?} */
            var urlParsed = parse(ResourceHelper.getProxy(_this.self_uri));
            /** @type {?} */
            var query = ResourceArray.replaceOrAdd(urlParsed.query, 'size', _this.pageSize.toString());
            query = ResourceArray.replaceOrAdd(query, 'page', pageNumber.toString());
            /** @type {?} */
            var uri = urlParsed.query ?
                ResourceHelper.getProxy(_this.self_uri).replace(urlParsed.query, query) : ResourceHelper.getProxy(_this.self_uri).concat(query);
            uri = _this.addSortInfo(uri);
            return ResourceHelper.getHttp().get(uri, { headers: ResourceHelper.headers }).pipe(map(function (response) { return _this.init(type, response, _this.sortInfo); }), catchError(function (error) { return throwError(error); }));
        };
        /**
         * Sort collection based on given sort attribute
         */
        this.sortElements = function (type) {
            var sort = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                sort[_i - 1] = arguments[_i];
            }
            _this.self_uri = _this.self_uri.replace('{?page,size,sort}', '');
            _this.self_uri = _this.self_uri.replace('{&sort}', '');
            /** @type {?} */
            var uri = ResourceHelper.getProxy(_this.self_uri).concat('?', 'size=', _this.pageSize.toString(), '&page=', _this.pageNumber.toString());
            uri = _this.addSortInfo(uri);
            return ResourceHelper.getHttp().get(uri, { headers: ResourceHelper.headers }).pipe(map(function (response) { return _this.init(type, response, sort); }), catchError(function (error) { return throwError(error); }));
        };
        /**
         * Load page with given size
         */
        this.size = function (type, size) {
            /** @type {?} */
            var uri = ResourceHelper.getProxy(_this.self_uri).concat('?', 'size=', size.toString());
            uri = _this.addSortInfo(uri);
            return ResourceHelper.getHttp().get(uri, { headers: ResourceHelper.headers }).pipe(map(function (response) { return _this.init(type, response, _this.sortInfo); }), catchError(function (error) { return throwError(error); }));
        };
    }
    /**
     * Add sort info to given URI
     * @param {?} uri
     * @return {?}
     */
    ResourceArray.prototype.addSortInfo = /**
     * Add sort info to given URI
     * @param {?} uri
     * @return {?}
     */
    function (uri) {
        if (this.sortInfo) {
            try {
                for (var _a = __values(this.sortInfo), _b = _a.next(); !_b.done; _b = _a.next()) {
                    var item = _b.value;
                    uri = uri.concat('&sort=', item.path, ',', item.order);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        return uri;
        var e_1, _c;
    };
    /**
     * Add replace or add param value to query string
     * @param {?} query
     * @param {?} field
     * @param {?} value
     * @return {?}
     */
    ResourceArray.replaceOrAdd = /**
     * Add replace or add param value to query string
     * @param {?} query
     * @param {?} field
     * @param {?} value
     * @return {?}
     */
    function (query, field, value) {
        if (query) {
            /** @type {?} */
            var idx = query.indexOf(field);
            /** @type {?} */
            var idxNextAmp = query.indexOf('&', idx) == -1 ? query.indexOf('/', idx) : query.indexOf('&', idx);
            if (idx != -1) {
                /** @type {?} */
                var seachValue = query.substring(idx, idxNextAmp);
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
    };
    return ResourceArray;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * REST API access helper
 */
var ResourceHelper = /** @class */ (function () {
    function ResourceHelper() {
    }
    /** get request headers */
    /*public static get headers(): HttpHeaders {
        if (isNullOrUndefined(this._headers))
          ResourceHelper._headers = new HttpHeaders();
        return ResourceHelper._headers;
    }*/
    /** set request headers */
    /*public static set headers(headers: HttpHeaders) {
      ResourceHelper._headers = headers;
    }*/
    /** get request option params */
    /**
     * get request option params
     * @param {?} params
     * @param {?=} options
     * @return {?}
     */
    ResourceHelper.optionParams = /**
     * get request option params
     * @param {?} params
     * @param {?=} options
     * @return {?}
     */
    function (params, options) {
        if (options) {
            if (options.params) {
                try {
                    for (var _a = __values(options.params), _b = _a.next(); !_b.done; _b = _a.next()) {
                        var param = _b.value;
                        params = params.append(param.key, param.value.toString());
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
            if (options.size) {
                params = params.append('size', options.size.toString());
            }
            if (options.sort) {
                try {
                    for (var _d = __values(options.sort), _e = _d.next(); !_e.done; _e = _d.next()) {
                        var s = _e.value;
                        /** @type {?} */
                        var sortString = '';
                        sortString = s.path ? sortString.concat(s.path) : sortString;
                        sortString = s.order ? sortString.concat(',').concat(s.order) : sortString;
                        params = params.append('sort', sortString);
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_e && !_e.done && (_f = _d.return)) _f.call(_d);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
        }
        return params;
        var e_1, _c, e_2, _f;
    };
    /** resolve resource relations */
    /**
     * resolve resource relations
     * @param {?} resource
     * @return {?}
     */
    ResourceHelper.resolveRelations = /**
     * resolve resource relations
     * @param {?} resource
     * @return {?}
     */
    function (resource) {
        var _this = this;
        /** @type {?} */
        var result = {};
        var _loop_1 = function (key) {
            if (!isNullOrUndefined(resource[key])) {
                if (ResourceHelper.className(resource[key])
                    .find(function (className) { return className == 'Resource'; })) {
                    if (resource[key]['_links'])
                        result[key] = resource[key]['_links']['self']['href'];
                }
                else if (Array.isArray(resource[key])) {
                    /** @type {?} */
                    var array = resource[key];
                    if (array) {
                        result[key] = new Array();
                        array.forEach(function (element) {
                            if (isPrimitive(element)) {
                                result[key].push(element);
                            }
                            else {
                                result[key].push(_this.resolveRelations(element));
                            }
                        });
                    }
                }
                else {
                    result[key] = resource[key];
                }
            }
        };
        for (var key in resource) {
            _loop_1(key);
        }
        return /** @type {?} */ (result);
    };
    /** create an empty resource from embedded data*/
    /**
     * create an empty resource from embedded data
     * @template T
     * @param {?} _embedded
     * @return {?}
     */
    ResourceHelper.createEmptyResult = /**
     * create an empty resource from embedded data
     * @template T
     * @param {?} _embedded
     * @return {?}
     */
    function (_embedded) {
        /** @type {?} */
        var resourceArray = new ResourceArray();
        resourceArray._embedded = _embedded;
        return resourceArray;
    };
    /** get resource class name*/
    /**
     * get resource class name
     * @param {?} obj
     * @return {?}
     */
    ResourceHelper.getClassName = /**
     * get resource class name
     * @param {?} obj
     * @return {?}
     */
    function (obj) {
        /** @type {?} */
        var funcNameRegex = /function (.+?)\(/;
        /** @type {?} */
        var results = (funcNameRegex).exec(obj.constructor.toString());
        return (results && results.length > 1) ? results[1] : '';
    };
    /** get resource class name from a prototype object*/
    /**
     * get resource class name from a prototype object
     * @param {?} objProto
     * @return {?}
     */
    ResourceHelper.className = /**
     * get resource class name from a prototype object
     * @param {?} objProto
     * @return {?}
     */
    function (objProto) {
        /** @type {?} */
        var classNames = [];
        /** @type {?} */
        var obj = Object.getPrototypeOf(objProto);
        /** @type {?} */
        var className;
        while ((className = ResourceHelper.getClassName(obj)) !== 'Object') {
            classNames.push(className);
            obj = Object.getPrototypeOf(obj);
        }
        return classNames;
    };
    /** instantiate a ResourceCollection from response embedded data*/
    /**
     * instantiate a ResourceCollection from response embedded data
     * @template T
     * @param {?} type
     * @param {?} payload
     * @param {?} result
     * @param {?=} builder
     * @return {?}
     */
    ResourceHelper.instantiateResourceCollection = /**
     * instantiate a ResourceCollection from response embedded data
     * @template T
     * @param {?} type
     * @param {?} payload
     * @param {?} result
     * @param {?=} builder
     * @return {?}
     */
    function (type, payload, result, builder) {
        try {
            for (var _a = __values(Object.keys(payload[result._embedded])), _b = _a.next(); !_b.done; _b = _a.next()) {
                var embeddedClassName = _b.value;
                /** @type {?} */
                var embedded = payload[result._embedded];
                /** @type {?} */
                var items = embedded[embeddedClassName];
                try {
                    for (var items_1 = __values(items), items_1_1 = items_1.next(); !items_1_1.done; items_1_1 = items_1.next()) {
                        var item = items_1_1.value;
                        /** @type {?} */
                        var instance = new type();
                        instance = this.searchSubtypes(builder, embeddedClassName, instance);
                        this.instantiateResource(instance, item);
                        result.push(instance);
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (items_1_1 && !items_1_1.done && (_c = items_1.return)) _c.call(items_1);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_d = _a.return)) _d.call(_a);
            }
            finally { if (e_4) throw e_4.error; }
        }
        result.totalElements = payload.page ? payload.page.totalElements : result.length;
        result.totalPages = payload.page ? payload.page.totalPages : 1;
        result.pageNumber = payload.page ? payload.page.number : 1;
        result.pageSize = payload.page ? payload.page.size : 20;
        result.self_uri = payload._links && payload._links.self ? payload._links.self.href : undefined;
        result.next_uri = payload._links && payload._links.next ? payload._links.next.href : undefined;
        result.prev_uri = payload._links && payload._links.prev ? payload._links.prev.href : undefined;
        result.first_uri = payload._links && payload._links.first ? payload._links.first.href : undefined;
        result.last_uri = payload._links && payload._links.last ? payload._links.last.href : undefined;
        return result;
        var e_4, _d, e_3, _c;
    };
    /** search subtypes*/
    /**
     * search subtypes
     * @template T
     * @param {?} builder
     * @param {?} embeddedClassName
     * @param {?} instance
     * @return {?}
     */
    ResourceHelper.searchSubtypes = /**
     * search subtypes
     * @template T
     * @param {?} builder
     * @param {?} embeddedClassName
     * @param {?} instance
     * @return {?}
     */
    function (builder, embeddedClassName, instance) {
        if (builder && builder.subtypes) {
            /** @type {?} */
            var keys = builder.subtypes.keys();
            Array.from(keys).forEach(function (subtypeKey) {
                if (embeddedClassName.toLowerCase().startsWith(subtypeKey.toLowerCase())) {
                    /** @type {?} */
                    var subtype = builder.subtypes.get(subtypeKey);
                    instance = new subtype();
                }
            });
        }
        return instance;
    };
    /** instantiate a Resource from response */
    /**
     * instantiate a Resource from response
     * @template T
     * @param {?} entity
     * @param {?} payload
     * @return {?}
     */
    ResourceHelper.instantiateResource = /**
     * instantiate a Resource from response
     * @template T
     * @param {?} entity
     * @param {?} payload
     * @return {?}
     */
    function (entity, payload) {
        for (var p in payload) {
            //TODO array init
            /* if(entity[p].constructor === Array && isNullOrUndefined(payload[p]))
                             entity[p] = [];
                         else*/
            entity[p] = payload[p];
        }
        return entity;
    };
    /** set proxy URL */
    /**
     * set proxy URL
     * @param {?} proxy_uri
     * @return {?}
     */
    ResourceHelper.setProxyUri = /**
     * set proxy URL
     * @param {?} proxy_uri
     * @return {?}
     */
    function (proxy_uri) {
        ResourceHelper.proxy_uri = proxy_uri;
    };
    /** set Root URI */
    /**
     * set Root URI
     * @param {?} root_uri
     * @return {?}
     */
    ResourceHelper.setRootUri = /**
     * set Root URI
     * @param {?} root_uri
     * @return {?}
     */
    function (root_uri) {
        ResourceHelper.root_uri = root_uri;
    };
    /**
     * get proxy URL
     * @return {?}
     */
    ResourceHelper.getURL = /**
     * get proxy URL
     * @return {?}
     */
    function () {
        return ResourceHelper.proxy_uri && ResourceHelper.proxy_uri != '' ?
            ResourceHelper.addSlash(ResourceHelper.proxy_uri) :
            ResourceHelper.addSlash(ResourceHelper.root_uri);
    };
    /**
     * add slash to URI
     * @param {?} uri
     * @return {?}
     */
    ResourceHelper.addSlash = /**
     * add slash to URI
     * @param {?} uri
     * @return {?}
     */
    function (uri) {
        /** @type {?} */
        var uriParsed = parse(uri);
        if (isNullOrUndefined(uriParsed.search) && uri && uri[uri.length - 1] != '/')
            return uri + '/';
        return uri;
    };
    /**
     * get proxy from URL
     * @param {?} url
     * @return {?}
     */
    ResourceHelper.getProxy = /**
     * get proxy from URL
     * @param {?} url
     * @return {?}
     */
    function (url) {
        if (!ResourceHelper.proxy_uri || ResourceHelper.proxy_uri == '')
            return url;
        return ResourceHelper.addSlash(url.replace(ResourceHelper.root_uri, ResourceHelper.proxy_uri));
    };
    /**
     * set HttpClient
     * @param {?} http
     * @return {?}
     */
    ResourceHelper.setHttp = /**
     * set HttpClient
     * @param {?} http
     * @return {?}
     */
    function (http) {
        ResourceHelper.http = http;
    };
    /**
     * get HttpClient
     * @return {?}
     */
    ResourceHelper.getHttp = /**
     * get HttpClient
     * @return {?}
     */
    function () {
        return ResourceHelper.http;
    };
    /** get root URI*/
    /**
     * get root URI
     * @return {?}
     */
    ResourceHelper.getRootUri = /**
     * get root URI
     * @return {?}
     */
    function () {
        return ResourceHelper.root_uri;
    };
    /**
     * HttpHeaders
     */
    ResourceHelper.headers = new HttpHeaders();
    /**
     * Proxy URL
     */
    ResourceHelper.proxy_uri = null;
    /**
     * Root URL
     */
    ResourceHelper.root_uri = null;
    /**
     * HttpClient
     */
    ResourceHelper.http = null;
    return ResourceHelper;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * ExternalService
 */
var ExternalService = /** @class */ (function () {
    /** constructor */
    function ExternalService(externalConfigurationService) {
        this.externalConfigurationService = externalConfigurationService;
        ResourceHelper.setProxyUri(externalConfigurationService.getProxyUri());
        ResourceHelper.setRootUri(externalConfigurationService.getRootUri());
        ResourceHelper.setHttp(externalConfigurationService.getHttp());
    }
    /**
     * update ExternalConfigurationHandler
     * @param {?} externalConfigurationService
     * @return {?}
     */
    ExternalService.prototype.updateExternalConfigurationHandlerInterface = /**
     * update ExternalConfigurationHandler
     * @param {?} externalConfigurationService
     * @return {?}
     */
    function (externalConfigurationService) {
        this.externalConfigurationService = externalConfigurationService;
        ResourceHelper.setProxyUri(externalConfigurationService.getProxyUri());
        ResourceHelper.setRootUri(externalConfigurationService.getRootUri());
        ResourceHelper.setHttp(externalConfigurationService.getHttp());
    };
    /**
     * get ExternalConfiguration
     * @return {?}
     */
    ExternalService.prototype.getExternalConfiguration = /**
     * get ExternalConfiguration
     * @return {?}
     */
    function () {
        return this.externalConfigurationService.getExternalConfiguration();
    };
    /**
     * get proxy URL
     * @return {?}
     */
    ExternalService.prototype.getProxyUri = /**
     * get proxy URL
     * @return {?}
     */
    function () {
        return this.externalConfigurationService.getProxyUri();
    };
    /**
     * get Root URI
     * @return {?}
     */
    ExternalService.prototype.getRootUri = /**
     * get Root URI
     * @return {?}
     */
    function () {
        return this.externalConfigurationService.getRootUri();
    };
    /**
     * get URL
     * @return {?}
     */
    ExternalService.prototype.getURL = /**
     * get URL
     * @return {?}
     */
    function () {
        return ResourceHelper.getURL();
    };
    /**
     * get HttpClient
     * @return {?}
     */
    ExternalService.prototype.getHttp = /**
     * get HttpClient
     * @return {?}
     */
    function () {
        return ResourceHelper.getHttp();
    };
    ExternalService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    ExternalService.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: Inject, args: ['ExternalConfigurationService',] }] }
    ]; };
    return ExternalService;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * ResourceService
 */
var ResourceService = /** @class */ (function () {
    /** constructor */
    function ResourceService(externalService) {
        this.externalService = externalService;
    }
    /**
     * get URL
     * @return {?}
     */
    ResourceService.getURL = /**
     * get URL
     * @return {?}
     */
    function () {
        return ResourceHelper.getURL();
    };
    /**
     * get all resources from a base URI of a given type
     * @template T
     * @param {?} type
     * @param {?} resource
     * @param {?} _embedded
     * @param {?=} options
     * @param {?=} subType
     * @return {?}
     */
    ResourceService.prototype.getAll = /**
     * get all resources from a base URI of a given type
     * @template T
     * @param {?} type
     * @param {?} resource
     * @param {?} _embedded
     * @param {?=} options
     * @param {?=} subType
     * @return {?}
     */
    function (type, resource, _embedded, options, subType) {
        /** @type {?} */
        var uri = this.getResourceUrl(resource).concat('?projection=view');
        /** @type {?} */
        var params = ResourceHelper.optionParams(new HttpParams(), options);
        /** @type {?} */
        var result = ResourceHelper.createEmptyResult(_embedded);
        this.setUrls(result);
        result.sortInfo = options ? options.sort : undefined;
        /** @type {?} */
        var observable = ResourceHelper.getHttp().get(uri, { headers: ResourceHelper.headers, params: params });
        return observable.pipe(map(function (response) { return ResourceHelper.instantiateResourceCollection(type, response, result, subType); }), catchError(function (error) { return throwError(error); }));
    };
    /**
     * get resource from a base URI and a given id
     * @template T
     * @param {?} type
     * @param {?} resource
     * @param {?} id
     * @return {?}
     */
    ResourceService.prototype.get = /**
     * get resource from a base URI and a given id
     * @template T
     * @param {?} type
     * @param {?} resource
     * @param {?} id
     * @return {?}
     */
    function (type, resource, id) {
        /** @type {?} */
        var uri = this.getResourceUrl(resource).concat('/', id, '?projection=view');
        /** @type {?} */
        var result = new type();
        this.setUrlsResource(result);
        /** @type {?} */
        var observable = ResourceHelper.getHttp().get(uri, { headers: ResourceHelper.headers });
        return observable.pipe(map(function (data) { return ResourceHelper.instantiateResource(result, data); }), catchError(function (error) { return throwError(error); }));
    };
    /**
     * get resource from its selflink
     * @template T
     * @param {?} type
     * @param {?} resourceLink
     * @return {?}
     */
    ResourceService.prototype.getBySelfLink = /**
     * get resource from its selflink
     * @template T
     * @param {?} type
     * @param {?} resourceLink
     * @return {?}
     */
    function (type, resourceLink) {
        /** @type {?} */
        var result = new type();
        this.setUrlsResource(result);
        /** @type {?} */
        var observable = ResourceHelper.getHttp().get(ResourceHelper.getProxy(resourceLink), { headers: ResourceHelper.headers });
        return observable.pipe(map(function (data) { return ResourceHelper.instantiateResource(result, data); }), catchError(function (error) { return throwError(error); }));
    };
    /**
     * search resources from a given base path, query and options
     * @template T
     * @param {?} type
     * @param {?} query
     * @param {?} resource
     * @param {?} _embedded
     * @param {?=} options
     * @return {?}
     */
    ResourceService.prototype.search = /**
     * search resources from a given base path, query and options
     * @template T
     * @param {?} type
     * @param {?} query
     * @param {?} resource
     * @param {?} _embedded
     * @param {?=} options
     * @return {?}
     */
    function (type, query, resource, _embedded, options) {
        /** @type {?} */
        var uri = this.getResourceUrl(resource).concat('/search/', query);
        /** @type {?} */
        var params = ResourceHelper.optionParams(new HttpParams(), options);
        /** @type {?} */
        var result = ResourceHelper.createEmptyResult(_embedded);
        this.setUrls(result);
        /** @type {?} */
        var observable = ResourceHelper.getHttp().get(uri, { headers: ResourceHelper.headers, params: params });
        return observable.pipe(map(function (response) { return ResourceHelper.instantiateResourceCollection(type, response, result); }), catchError(function (error) { return throwError(error); }));
    };
    /**
     * search a single resource from a given base path, query and options
     * @template T
     * @param {?} type
     * @param {?} query
     * @param {?} resource
     * @param {?=} options
     * @return {?}
     */
    ResourceService.prototype.searchSingle = /**
     * search a single resource from a given base path, query and options
     * @template T
     * @param {?} type
     * @param {?} query
     * @param {?} resource
     * @param {?=} options
     * @return {?}
     */
    function (type, query, resource, options) {
        /** @type {?} */
        var uri = this.getResourceUrl(resource).concat('/search/', query);
        /** @type {?} */
        var params = ResourceHelper.optionParams(new HttpParams(), options);
        /** @type {?} */
        var result = new type();
        this.setUrlsResource(result);
        /** @type {?} */
        var observable = ResourceHelper.getHttp().get(uri, { headers: ResourceHelper.headers, params: params });
        return observable.pipe(map(function (response) { return ResourceHelper.instantiateResource(result, response); }), catchError(function (error) { return throwError(error); }));
    };
    /**
     * search resources from a given base path, custom query and options
     * @template T
     * @param {?} type
     * @param {?} query
     * @param {?} resource
     * @param {?} _embedded
     * @param {?=} options
     * @return {?}
     */
    ResourceService.prototype.customQuery = /**
     * search resources from a given base path, custom query and options
     * @template T
     * @param {?} type
     * @param {?} query
     * @param {?} resource
     * @param {?} _embedded
     * @param {?=} options
     * @return {?}
     */
    function (type, query, resource, _embedded, options) {
        /** @type {?} */
        var uri = this.getResourceUrl(resource + query);
        /** @type {?} */
        var params = ResourceHelper.optionParams(new HttpParams(), options);
        /** @type {?} */
        var result = ResourceHelper.createEmptyResult(_embedded);
        this.setUrls(result);
        /** @type {?} */
        var observable = ResourceHelper.getHttp().get(uri, { headers: ResourceHelper.headers, params: params });
        return observable.pipe(map(function (response) { return ResourceHelper.instantiateResourceCollection(type, response, result); }), catchError(function (error) { return throwError(error); }));
    };
    /**
     * get resource given a relation link
     * @template T
     * @param {?} type
     * @param {?} resourceLink
     * @return {?}
     */
    ResourceService.prototype.getByRelation = /**
     * get resource given a relation link
     * @template T
     * @param {?} type
     * @param {?} resourceLink
     * @return {?}
     */
    function (type, resourceLink) {
        /** @type {?} */
        var result = new type();
        this.setUrlsResource(result);
        /** @type {?} */
        var observable = ResourceHelper.getHttp().get(resourceLink, { headers: ResourceHelper.headers });
        return observable.pipe(map(function (data) { return ResourceHelper.instantiateResource(result, data); }), catchError(function (error) { return throwError(error); }));
    };
    /**
     * get resource array given a relation link
     * @template T
     * @param {?} type
     * @param {?} resourceLink
     * @param {?} _embedded
     * @param {?=} builder
     * @return {?}
     */
    ResourceService.prototype.getByRelationArray = /**
     * get resource array given a relation link
     * @template T
     * @param {?} type
     * @param {?} resourceLink
     * @param {?} _embedded
     * @param {?=} builder
     * @return {?}
     */
    function (type, resourceLink, _embedded, builder) {
        /** @type {?} */
        var result = ResourceHelper.createEmptyResult(_embedded);
        this.setUrls(result);
        /** @type {?} */
        var observable = ResourceHelper.getHttp().get(resourceLink, { headers: ResourceHelper.headers });
        return observable.pipe(map(function (response) { return ResourceHelper.instantiateResourceCollection(type, response, result, builder); }), catchError(function (error) { return throwError(error); }));
    };
    /**
     * count resources given a path
     * @param {?} resource
     * @return {?}
     */
    ResourceService.prototype.count = /**
     * count resources given a path
     * @param {?} resource
     * @return {?}
     */
    function (resource) {
        /** @type {?} */
        var uri = this.getResourceUrl(resource).concat('/search/countAll');
        return ResourceHelper.getHttp().get(uri, { headers: ResourceHelper.headers, observe: 'body' }).pipe(map(function (response) { return Number(response.body); }), catchError(function (error) { return throwError(error); }));
    };
    /**
     * create resource from self link and entity data
     * @template T
     * @param {?} selfResource
     * @param {?} entity
     * @return {?}
     */
    ResourceService.prototype.create = /**
     * create resource from self link and entity data
     * @template T
     * @param {?} selfResource
     * @param {?} entity
     * @return {?}
     */
    function (selfResource, entity) {
        /** @type {?} */
        var uri = ResourceHelper.getURL() + selfResource;
        /** @type {?} */
        var payload = ResourceHelper.resolveRelations(entity);
        this.setUrlsResource(entity);
        /** @type {?} */
        var observable = ResourceHelper.getHttp().post(uri, payload, { headers: ResourceHelper.headers, observe: 'response' });
        return observable.pipe(map(function (response) {
            if (response.status >= 200 && response.status <= 207)
                return ResourceHelper.instantiateResource(entity, response.body);
            else if (response.status == 500) {
                /** @type {?} */
                var body = response.body;
                return throwError(body.error);
            }
        }), catchError(function (error) { return throwError(error); }));
    };
    /**
     * update resource from a given entity data
     * @template T
     * @param {?} entity
     * @return {?}
     */
    ResourceService.prototype.update = /**
     * update resource from a given entity data
     * @template T
     * @param {?} entity
     * @return {?}
     */
    function (entity) {
        /** @type {?} */
        var uri = ResourceHelper.getProxy(entity._links.self.href);
        /** @type {?} */
        var payload = ResourceHelper.resolveRelations(entity);
        this.setUrlsResource(entity);
        /** @type {?} */
        var observable = ResourceHelper.getHttp().put(uri, payload, { headers: ResourceHelper.headers, observe: 'response' });
        return observable.pipe(map(function (response) {
            if (response.status >= 200 && response.status <= 207)
                return ResourceHelper.instantiateResource(entity, response.body);
            else if (response.status == 500) {
                /** @type {?} */
                var body = response.body;
                return throwError(body.error);
            }
        }), catchError(function (error) { return throwError(error); }));
    };
    /**
     * patch resource from a given entity data
     * @template T
     * @param {?} entity
     * @return {?}
     */
    ResourceService.prototype.patch = /**
     * patch resource from a given entity data
     * @template T
     * @param {?} entity
     * @return {?}
     */
    function (entity) {
        /** @type {?} */
        var uri = ResourceHelper.getProxy(entity._links.self.href);
        /** @type {?} */
        var payload = ResourceHelper.resolveRelations(entity);
        this.setUrlsResource(entity);
        /** @type {?} */
        var observable = ResourceHelper.getHttp().patch(uri, payload, { headers: ResourceHelper.headers, observe: 'response' });
        return observable.pipe(map(function (response) {
            if (response.status >= 200 && response.status <= 207)
                return ResourceHelper.instantiateResource(entity, response.body);
            else if (response.status == 500) {
                /** @type {?} */
                var body = response.body;
                return throwError(body.error);
            }
        }), catchError(function (error) { return throwError(error); }));
    };
    /**
     * delete resource from a given entity data
     * @template T
     * @param {?} entity
     * @return {?}
     */
    ResourceService.prototype.delete = /**
     * delete resource from a given entity data
     * @template T
     * @param {?} entity
     * @return {?}
     */
    function (entity) {
        /** @type {?} */
        var uri = ResourceHelper.getProxy(entity._links.self.href);
        return ResourceHelper.getHttp().delete(uri, { headers: ResourceHelper.headers }).pipe(catchError(function (error) { return throwError(error); }));
    };
    /**
     * whether a resource array has next page of results
     * @template T
     * @param {?} resourceArray
     * @return {?}
     */
    ResourceService.prototype.hasNext = /**
     * whether a resource array has next page of results
     * @template T
     * @param {?} resourceArray
     * @return {?}
     */
    function (resourceArray) {
        return resourceArray.next_uri != undefined;
    };
    /**
     * whether a resource array has previous page of results
     * @template T
     * @param {?} resourceArray
     * @return {?}
     */
    ResourceService.prototype.hasPrev = /**
     * whether a resource array has previous page of results
     * @template T
     * @param {?} resourceArray
     * @return {?}
     */
    function (resourceArray) {
        return resourceArray.prev_uri != undefined;
    };
    /**
     * whether a resource array has first page of results
     * @template T
     * @param {?} resourceArray
     * @return {?}
     */
    ResourceService.prototype.hasFirst = /**
     * whether a resource array has first page of results
     * @template T
     * @param {?} resourceArray
     * @return {?}
     */
    function (resourceArray) {
        return resourceArray.first_uri != undefined;
    };
    /**
     * whether a resource array has last page of results
     * @template T
     * @param {?} resourceArray
     * @return {?}
     */
    ResourceService.prototype.hasLast = /**
     * whether a resource array has last page of results
     * @template T
     * @param {?} resourceArray
     * @return {?}
     */
    function (resourceArray) {
        return resourceArray.last_uri != undefined;
    };
    /**
     * get resource array next page of results
     * @template T
     * @param {?} resourceArray
     * @param {?} type
     * @return {?}
     */
    ResourceService.prototype.next = /**
     * get resource array next page of results
     * @template T
     * @param {?} resourceArray
     * @param {?} type
     * @return {?}
     */
    function (resourceArray, type) {
        return resourceArray.next(type);
    };
    /**
     * get resource array previous page of results
     * @template T
     * @param {?} resourceArray
     * @param {?} type
     * @return {?}
     */
    ResourceService.prototype.prev = /**
     * get resource array previous page of results
     * @template T
     * @param {?} resourceArray
     * @param {?} type
     * @return {?}
     */
    function (resourceArray, type) {
        return resourceArray.prev(type);
    };
    /**
     * get resource array first page of results
     * @template T
     * @param {?} resourceArray
     * @param {?} type
     * @return {?}
     */
    ResourceService.prototype.first = /**
     * get resource array first page of results
     * @template T
     * @param {?} resourceArray
     * @param {?} type
     * @return {?}
     */
    function (resourceArray, type) {
        return resourceArray.first(type);
    };
    /**
     * get resource array last page of results
     * @template T
     * @param {?} resourceArray
     * @param {?} type
     * @return {?}
     */
    ResourceService.prototype.last = /**
     * get resource array last page of results
     * @template T
     * @param {?} resourceArray
     * @param {?} type
     * @return {?}
     */
    function (resourceArray, type) {
        return resourceArray.last(type);
    };
    /**
     * get resource array page of results given a page number
     * @template T
     * @param {?} resourceArray
     * @param {?} type
     * @param {?} id
     * @return {?}
     */
    ResourceService.prototype.page = /**
     * get resource array page of results given a page number
     * @template T
     * @param {?} resourceArray
     * @param {?} type
     * @param {?} id
     * @return {?}
     */
    function (resourceArray, type, id) {
        return resourceArray.page(type, id);
    };
    /**
     * sort resource array with a given sorting params
     * @template T
     * @param {?} resourceArray
     * @param {?} type
     * @param {...?} sort
     * @return {?}
     */
    ResourceService.prototype.sortElements = /**
     * sort resource array with a given sorting params
     * @template T
     * @param {?} resourceArray
     * @param {?} type
     * @param {...?} sort
     * @return {?}
     */
    function (resourceArray, type) {
        var sort = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            sort[_i - 2] = arguments[_i];
        }
        return resourceArray.sortElements.apply(resourceArray, __spread([type], sort));
    };
    /**
     * get resource array size
     * @template T
     * @param {?} resourceArray
     * @param {?} type
     * @param {?} size
     * @return {?}
     */
    ResourceService.prototype.size = /**
     * get resource array size
     * @template T
     * @param {?} resourceArray
     * @param {?} type
     * @param {?} size
     * @return {?}
     */
    function (resourceArray, type, size) {
        return resourceArray.size(type, size);
    };
    /**
     * get resource URL from a given path
     * @param {?=} resource
     * @return {?}
     */
    ResourceService.prototype.getResourceUrl = /**
     * get resource URL from a given path
     * @param {?=} resource
     * @return {?}
     */
    function (resource) {
        /** @type {?} */
        var url = ResourceService.getURL();
        if (!url.endsWith('/')) {
            url = url.concat('/');
        }
        if (resource) {
            return url.concat(resource);
        }
        return url;
    };
    /**
     * set proxy and root urls of given resource array
     * @template T
     * @param {?} result
     * @return {?}
     */
    ResourceService.prototype.setUrls = /**
     * set proxy and root urls of given resource array
     * @template T
     * @param {?} result
     * @return {?}
     */
    function (result) {
        result.proxyUrl = this.externalService.getProxyUri();
        result.rootUrl = this.externalService.getRootUri();
    };
    /**
     * set proxy and root urls of given resource
     * @template T
     * @param {?} result
     * @return {?}
     */
    ResourceService.prototype.setUrlsResource = /**
     * set proxy and root urls of given resource
     * @template T
     * @param {?} result
     * @return {?}
     */
    function (result) {
        result.proxyUrl = this.externalService.getProxyUri();
        result.rootUrl = this.externalService.getRootUri();
    };
    ResourceService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    ResourceService.ctorParameters = function () { return [
        { type: ExternalService }
    ]; };
    return ResourceService;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
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
        return throwError(error);
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
                return of(resourceArray.result);
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
                return of(resourceArray.result);
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
                return of(resourceArray.result);
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
            throwError('no resourceArray found');
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
            throwError('no resourceArray found');
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
            throwError('no resourceArray found');
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
            throwError('no resourceArray found');
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
            throwError('no resourceArray found');
    };
    return RestService;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Abstract resource class
 * @abstract
 */
var Resource = /** @class */ (function () {
    /** constructor*/
    function Resource() {
    }
    Object.defineProperty(Resource.prototype, "subtypes", {
        get: /**
         * get subtypes
         * @return {?}
         */
        function () {
            return this._subtypes;
        },
        set: /**
         * set subtypes
         * @param {?} _subtypes
         * @return {?}
         */
        function (_subtypes) {
            this._subtypes = _subtypes;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Get collection of related resources
     * @template T
     * @param {?} type
     * @param {?} relation
     * @param {?=} _embedded
     * @param {?=} options
     * @param {?=} builder
     * @return {?}
     */
    Resource.prototype.getRelationArray = /**
     * Get collection of related resources
     * @template T
     * @param {?} type
     * @param {?} relation
     * @param {?=} _embedded
     * @param {?=} options
     * @param {?=} builder
     * @return {?}
     */
    function (type, relation, _embedded, options, builder) {
        /** @type {?} */
        var params = ResourceHelper.optionParams(new HttpParams(), options);
        /** @type {?} */
        var result = ResourceHelper.createEmptyResult(isNullOrUndefined(_embedded) ? "_embedded" : _embedded);
        if (!isNullOrUndefined(this._links) && !isNullOrUndefined(this._links[relation])) {
            /** @type {?} */
            var observable = ResourceHelper.getHttp().get(ResourceHelper.getProxy(this._links[relation].href), {
                headers: ResourceHelper.headers,
                params: params
            });
            return observable.pipe(map(function (response) { return ResourceHelper.instantiateResourceCollection(type, response, result, builder); }), map(function (array) { return array.result; }));
        }
        else {
            return of([]);
        }
    };
    /**
     * Get related resource
     * @template T
     * @param {?} type
     * @param {?} relation
     * @param {?=} builder
     * @return {?}
     */
    Resource.prototype.getRelation = /**
     * Get related resource
     * @template T
     * @param {?} type
     * @param {?} relation
     * @param {?=} builder
     * @return {?}
     */
    function (type, relation, builder) {
        /** @type {?} */
        var result = new type();
        if (!isNullOrUndefined(this._links) && !isNullOrUndefined(this._links[relation])) {
            /** @type {?} */
            var observable = ResourceHelper.getHttp().get(ResourceHelper.getProxy(this._links[relation].href), { headers: ResourceHelper.headers });
            return observable.pipe(map(function (data) {
                if (builder) {
                    try {
                        for (var _a = __values(Object.keys(data['_links'])), _b = _a.next(); !_b.done; _b = _a.next()) {
                            var embeddedClassName = _b.value;
                            if (embeddedClassName == 'self') {
                                /** @type {?} */
                                var href = data._links[embeddedClassName].href;
                                /** @type {?} */
                                var idx = href.lastIndexOf('/');
                                /** @type {?} */
                                var realClassName = href.replace(ResourceHelper.getRootUri(), "").substring(0, idx);
                                result = ResourceHelper.searchSubtypes(builder, realClassName, result);
                                break;
                            }
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                }
                return ResourceHelper.instantiateResource(result, data);
                var e_1, _c;
            }));
        }
        else {
            return of(null);
        }
    };
    /**
     * Adds the given resource to the bound collection by the relation
     * @template T
     * @param {?} relation
     * @param {?} resource
     * @return {?}
     */
    Resource.prototype.addRelation = /**
     * Adds the given resource to the bound collection by the relation
     * @template T
     * @param {?} relation
     * @param {?} resource
     * @return {?}
     */
    function (relation, resource) {
        if (!isNullOrUndefined(this._links) && !isNullOrUndefined(this._links[relation])) {
            /** @type {?} */
            var header = ResourceHelper.headers.append('Content-Type', 'text/uri-list');
            return ResourceHelper.getHttp().post(ResourceHelper.getProxy(this._links[relation].href), resource._links.self.href, { headers: header });
        }
        else {
            return throwError('no relation found');
        }
    };
    /**
     * Bind the given resource to this resource by the given relation
     * @template T
     * @param {?} relation
     * @param {?} resource
     * @return {?}
     */
    Resource.prototype.updateRelation = /**
     * Bind the given resource to this resource by the given relation
     * @template T
     * @param {?} relation
     * @param {?} resource
     * @return {?}
     */
    function (relation, resource) {
        if (!isNullOrUndefined(this._links) && !isNullOrUndefined(this._links[relation])) {
            /** @type {?} */
            var header = ResourceHelper.headers.append('Content-Type', 'text/uri-list');
            return ResourceHelper.getHttp().patch(ResourceHelper.getProxy(this._links[relation].href), resource._links.self.href, { headers: header });
        }
        else {
            return throwError('no relation found');
        }
    };
    /**
     * Bind the given resource to this resource by the given relation
     * @template T
     * @param {?} relation
     * @param {?} resource
     * @return {?}
     */
    Resource.prototype.substituteRelation = /**
     * Bind the given resource to this resource by the given relation
     * @template T
     * @param {?} relation
     * @param {?} resource
     * @return {?}
     */
    function (relation, resource) {
        if (!isNullOrUndefined(this._links) && !isNullOrUndefined(this._links[relation])) {
            /** @type {?} */
            var header = ResourceHelper.headers.append('Content-Type', 'text/uri-list');
            return ResourceHelper.getHttp().put(ResourceHelper.getProxy(this._links[relation].href), resource._links.self.href, { headers: header });
        }
        else {
            return throwError('no relation found');
        }
    };
    /**
     * Bind the given resource to this resource by the given relation
     * @template T
     * @param {?} relation
     * @param {?} resources
     * @return {?}
     */
    Resource.prototype.substituteAllRelation = /**
     * Bind the given resource to this resource by the given relation
     * @template T
     * @param {?} relation
     * @param {?} resources
     * @return {?}
     */
    function (relation, resources) {
        if (!isNullOrUndefined(this._links) && !isNullOrUndefined(this._links[relation])) {
            /** @type {?} */
            var header = ResourceHelper.headers.append('Content-Type', 'text/uri-list');
            return ResourceHelper.getHttp().put(ResourceHelper.getProxy(this._links[relation].href), resources.map(function (resource) { return resource._links.self.href; }), { headers: header });
        }
        else {
            return throwError('no relation found');
        }
    };
    /**
     * Unbind the resource with the given relation from this resource
     * @template T
     * @param {?} relation
     * @param {?} resource
     * @return {?}
     */
    Resource.prototype.deleteRelation = /**
     * Unbind the resource with the given relation from this resource
     * @template T
     * @param {?} relation
     * @param {?} resource
     * @return {?}
     */
    function (relation, resource) {
        if (!isNullOrUndefined(this._links) && !isNullOrUndefined(resource._links)) {
            /** @type {?} */
            var link = resource._links['self'].href;
            /** @type {?} */
            var idx = link.lastIndexOf('/') + 1;
            if (idx == -1)
                return throwError('no relation found');
            /** @type {?} */
            var relationId = link.substring(idx);
            return ResourceHelper.getHttp().delete(ResourceHelper.getProxy(this._links[relation].href + '/' + relationId), { headers: ResourceHelper.headers });
        }
        else {
            return throwError('no relation found');
        }
    };
    /**
     * Unbind the resource with the given relation from this resource
     * @template T
     * @param {?} relation
     * @return {?}
     */
    Resource.prototype.deleteAllRelation = /**
     * Unbind the resource with the given relation from this resource
     * @template T
     * @param {?} relation
     * @return {?}
     */
    function (relation) {
        return ResourceHelper.getHttp().delete(ResourceHelper.getProxy(this._links[relation].href), { headers: ResourceHelper.headers });
    };
    Resource.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    Resource.ctorParameters = function () { return []; };
    return Resource;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Angular HAL module
 */
var AngularHalModule = /** @class */ (function () {
    function AngularHalModule() {
    }
    /**
     * @return {?}
     */
    AngularHalModule.forRoot = /**
     * @return {?}
     */
    function () {
        return {
            ngModule: AngularHalModule,
            providers: [
                ExternalService,
                HttpClient,
                {
                    provide: ResourceService,
                    useClass: ResourceService,
                    deps: [ExternalService]
                }
            ]
        };
    };
    AngularHalModule.decorators = [
        { type: NgModule, args: [{
                    imports: [HttpClientModule],
                    declarations: [],
                    exports: [HttpClientModule],
                    providers: [
                        ExternalService,
                        HttpClient,
                        {
                            provide: ResourceService,
                            useClass: ResourceService,
                            deps: [ExternalService]
                        }
                    ]
                },] },
    ];
    return AngularHalModule;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

export { ExternalService, RestService, Resource, ResourceArray, ResourceHelper, AngularHalModule, ResourceService as ɵa };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2l0bXVuLWZyb250ZW5kLWNvcmUtc3JjLWxpYi1hbmd1bGFyLWhhbC5qcy5tYXAiLCJzb3VyY2VzIjpbIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL3NyYy9saWIvYW5ndWxhci1oYWwvbGliL3Jlc291cmNlLWFycmF5LnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvc3JjL2xpYi9hbmd1bGFyLWhhbC9saWIvcmVzb3VyY2UtaGVscGVyLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvc3JjL2xpYi9hbmd1bGFyLWhhbC9saWIvZXh0ZXJuYWwuc2VydmljZS50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL3NyYy9saWIvYW5ndWxhci1oYWwvbGliL3Jlc291cmNlLnNlcnZpY2UudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS9zcmMvbGliL2FuZ3VsYXItaGFsL2xpYi9yZXN0LnNlcnZpY2UudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS9zcmMvbGliL2FuZ3VsYXItaGFsL2xpYi9yZXNvdXJjZS50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL3NyYy9saWIvYW5ndWxhci1oYWwvbGliL2FuZ3VsYXItaGFsLm1vZHVsZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcclxuaW1wb3J0IHt0aHJvd0Vycm9yIGFzIG9ic2VydmFibGVUaHJvd0Vycm9yfSBmcm9tICdyeGpzJztcclxuXHJcbmltcG9ydCB7Y2F0Y2hFcnJvciwgbWFwfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcbmltcG9ydCB7U29ydH0gZnJvbSAnLi9zb3J0JztcclxuaW1wb3J0IHtBcnJheUludGVyZmFjZX0gZnJvbSAnLi9hcnJheS1pbnRlcmZhY2UnO1xyXG5pbXBvcnQge1Jlc291cmNlSGVscGVyfSBmcm9tICcuL3Jlc291cmNlLWhlbHBlcic7XHJcbmltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4vcmVzb3VyY2UnO1xyXG5pbXBvcnQgKiBhcyB1cmwgZnJvbSAndXJsJztcclxuaW1wb3J0IHtPYnNlcnZhYmxlfSBmcm9tICdyeGpzL2ludGVybmFsL09ic2VydmFibGUnO1xyXG5cclxuLyoqIFJFU1QgYXJyYXkgb2YgcmVzb3VyY2UgaW1wbGVtZW50YXRpb24gKi9cclxuZXhwb3J0IGNsYXNzIFJlc291cmNlQXJyYXk8VCBleHRlbmRzIFJlc291cmNlPiBpbXBsZW1lbnRzIEFycmF5SW50ZXJmYWNlPFQ+IHtcclxuICAgIC8qKiBzb3J0aW5nIGluZm8gKi9cclxuICAgIHB1YmxpYyBzb3J0SW5mbzogU29ydFtdO1xyXG4gICAgLyoqIHByb3h5IHVybCAqL1xyXG4gICAgcHVibGljIHByb3h5VXJsOiBzdHJpbmc7XHJcbiAgICAvKiogcm9vdCB1cmwgKi9cclxuICAgIHB1YmxpYyByb290VXJsOiBzdHJpbmc7XHJcblxyXG4gICAgLyoqIHNlbGYgdXJsICovXHJcbiAgICBwdWJsaWMgc2VsZl91cmk6IHN0cmluZztcclxuICAgIC8qKiBuZXh0IHJlc291cmNlIHVybCAqL1xyXG4gICAgcHVibGljIG5leHRfdXJpOiBzdHJpbmc7XHJcbiAgICAvKiogcHJldmlvdXMgcmVzb3VyY2UgdXJsICovXHJcbiAgICBwdWJsaWMgcHJldl91cmk6IHN0cmluZztcclxuICAgIC8qKiBmaXJzdCByZXNvdXJjZSB1cmwgKi9cclxuICAgIHB1YmxpYyBmaXJzdF91cmk6IHN0cmluZztcclxuICAgIC8qKiBsYXN0IHJlc291cmNlIHVybCAqL1xyXG4gICAgcHVibGljIGxhc3RfdXJpOiBzdHJpbmc7XHJcblxyXG4gICAgLyoqIGVtYmVkZGVkIGFycmF5IGxpc3QgKi9cclxuICAgIHB1YmxpYyBfZW1iZWRkZWQ7XHJcblxyXG4gICAgLyoqIHRvdGFsIG51bWJlciBvZiBlbGVtZW50cyBpbiB0aGlzIGFycmF5ICovXHJcbiAgICBwdWJsaWMgdG90YWxFbGVtZW50cyA9IDA7XHJcbiAgICAvKiogdG90YWwgbnVtYmVyIG9mIHBhZ2VzIGluIHRoZSByZXNwb25zZSAqL1xyXG4gICAgcHVibGljIHRvdGFsUGFnZXMgPSAxO1xyXG4gICAgXHJcbiAgICAvKiogcGFnZSBudW1iZXIgaW4gdGhlIHJlc3BvbnNlICovXHJcbiAgICBwdWJsaWMgcGFnZU51bWJlciA9IDE7XHJcbiAgICBcclxuICAgIC8qKiBwYWdlIHNpemUgKi9cclxuICAgIHB1YmxpYyBwYWdlU2l6ZTogbnVtYmVyO1xyXG5cclxuICAgIC8qKiBhcnJheSBjb21wb25lbnRzICovXHJcbiAgICBwdWJsaWMgcmVzdWx0OiBUW10gPSBbXTtcclxuXHJcbiAgICAvKiogcHVzaCBhIG5ldyByZXNvdXJjZSB0byB0aGUgYXJyYXkgKi9cclxuICAgIHB1c2ggPSAoZWw6IFQpID0+IHtcclxuICAgICAgICB0aGlzLnJlc3VsdC5wdXNoKGVsKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqIGxlbmd0aCBvZiB0aGUgYXJyYXkgKi9cclxuICAgIGxlbmd0aCA9ICgpOiBudW1iZXIgPT4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJlc3VsdC5sZW5ndGg7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKiBsb2FkIGFycmF5IGRhdGEgZnJvbSBSRVNUIHJlcXVlc3QgKi9cclxuICAgIHByaXZhdGUgaW5pdCA9ICh0eXBlOiB7IG5ldygpOiBUIH0sIHJlc3BvbnNlOiBhbnksIHNvcnRJbmZvOiBTb3J0W10pOiBSZXNvdXJjZUFycmF5PFQ+ID0+IHtcclxuICAgICAgICBjb25zdCByZXN1bHQ6IFJlc291cmNlQXJyYXk8VD4gPSBSZXNvdXJjZUhlbHBlci5jcmVhdGVFbXB0eVJlc3VsdDxUPih0aGlzLl9lbWJlZGRlZCk7XHJcbiAgICAgICAgcmVzdWx0LnNvcnRJbmZvID0gc29ydEluZm87XHJcbiAgICAgICAgUmVzb3VyY2VIZWxwZXIuaW5zdGFudGlhdGVSZXNvdXJjZUNvbGxlY3Rpb24odHlwZSwgcmVzcG9uc2UsIHJlc3VsdCk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH07XHJcblxyXG4gICAgLyoqIExvYWQgbmV4dCBwYWdlICovXHJcbiAgICBuZXh0ID0gKHR5cGU6IHsgbmV3KCk6IFQgfSk6IE9ic2VydmFibGU8UmVzb3VyY2VBcnJheTxUPj4gPT4ge1xyXG4gICAgICAgIGlmICh0aGlzLm5leHRfdXJpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkuZ2V0KFJlc291cmNlSGVscGVyLmdldFByb3h5KHRoaXMubmV4dF91cmkpLCB7aGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVyc30pLnBpcGUoXHJcbiAgICAgICAgICAgICAgICBtYXAocmVzcG9uc2UgPT4gdGhpcy5pbml0KHR5cGUsIHJlc3BvbnNlLCB0aGlzLnNvcnRJbmZvKSksXHJcbiAgICAgICAgICAgICAgICBjYXRjaEVycm9yKGVycm9yID0+IG9ic2VydmFibGVUaHJvd0Vycm9yKGVycm9yKSksKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG9ic2VydmFibGVUaHJvd0Vycm9yKCdubyBuZXh0IGRlZmluZWQnKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqIExvYWQgcHJldmlvdXMgcGFnZSAqL1xyXG4gICAgcHJldiA9ICh0eXBlOiB7IG5ldygpOiBUIH0pOiBPYnNlcnZhYmxlPFJlc291cmNlQXJyYXk8VD4+ID0+IHtcclxuICAgICAgICBpZiAodGhpcy5wcmV2X3VyaSkge1xyXG4gICAgICAgICAgICByZXR1cm4gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLmdldChSZXNvdXJjZUhlbHBlci5nZXRQcm94eSh0aGlzLnByZXZfdXJpKSwge2hlYWRlcnM6IFJlc291cmNlSGVscGVyLmhlYWRlcnN9KS5waXBlKFxyXG4gICAgICAgICAgICAgICAgbWFwKHJlc3BvbnNlID0+IHRoaXMuaW5pdCh0eXBlLCByZXNwb25zZSwgdGhpcy5zb3J0SW5mbykpLFxyXG4gICAgICAgICAgICAgICAgY2F0Y2hFcnJvcihlcnJvciA9PiBvYnNlcnZhYmxlVGhyb3dFcnJvcihlcnJvcikpLCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBvYnNlcnZhYmxlVGhyb3dFcnJvcignbm8gcHJldiBkZWZpbmVkJyk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKiBMb2FkIGZpcnN0IHBhZ2UgKi9cclxuICAgIGZpcnN0ID0gKHR5cGU6IHsgbmV3KCk6IFQgfSk6IE9ic2VydmFibGU8UmVzb3VyY2VBcnJheTxUPj4gPT4ge1xyXG4gICAgICAgIGlmICh0aGlzLmZpcnN0X3VyaSkge1xyXG4gICAgICAgICAgICByZXR1cm4gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLmdldChSZXNvdXJjZUhlbHBlci5nZXRQcm94eSh0aGlzLmZpcnN0X3VyaSksIHtoZWFkZXJzOiBSZXNvdXJjZUhlbHBlci5oZWFkZXJzfSkucGlwZShcclxuICAgICAgICAgICAgICAgIG1hcChyZXNwb25zZSA9PiB0aGlzLmluaXQodHlwZSwgcmVzcG9uc2UsIHRoaXMuc29ydEluZm8pKSxcclxuICAgICAgICAgICAgICAgIGNhdGNoRXJyb3IoZXJyb3IgPT4gb2JzZXJ2YWJsZVRocm93RXJyb3IoZXJyb3IpKSwpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZVRocm93RXJyb3IoJ25vIGZpcnN0IGRlZmluZWQnKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqIExvYWQgbGFzdCBwYWdlICovXHJcbiAgICBsYXN0ID0gKHR5cGU6IHsgbmV3KCk6IFQgfSk6IE9ic2VydmFibGU8UmVzb3VyY2VBcnJheTxUPj4gPT4ge1xyXG4gICAgICAgIGlmICh0aGlzLmxhc3RfdXJpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkuZ2V0KFJlc291cmNlSGVscGVyLmdldFByb3h5KHRoaXMubGFzdF91cmkpLCB7aGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVyc30pLnBpcGUoXHJcbiAgICAgICAgICAgICAgICBtYXAocmVzcG9uc2UgPT4gdGhpcy5pbml0KHR5cGUsIHJlc3BvbnNlLCB0aGlzLnNvcnRJbmZvKSksXHJcbiAgICAgICAgICAgICAgICBjYXRjaEVycm9yKGVycm9yID0+IG9ic2VydmFibGVUaHJvd0Vycm9yKGVycm9yKSksKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG9ic2VydmFibGVUaHJvd0Vycm9yKCdubyBsYXN0IGRlZmluZWQnKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqIExvYWQgcGFnZSB3aXRoIGdpdmVuIHBhZ2VOdW1iZXIqL1xyXG4gICAgcGFnZSA9ICh0eXBlOiB7IG5ldygpOiBUIH0sIHBhZ2VOdW1iZXI6IG51bWJlcik6IE9ic2VydmFibGU8UmVzb3VyY2VBcnJheTxUPj4gPT4ge1xyXG4gICAgICAgIHRoaXMuc2VsZl91cmkgPSB0aGlzLnNlbGZfdXJpLnJlcGxhY2UoJ3s/cGFnZSxzaXplLHNvcnR9JywgJycpO1xyXG4gICAgICAgIHRoaXMuc2VsZl91cmkgPSB0aGlzLnNlbGZfdXJpLnJlcGxhY2UoJ3smc29ydH0nLCAnJyk7XHJcbiAgICAgICAgbGV0IHVybFBhcnNlZCA9IHVybC5wYXJzZShSZXNvdXJjZUhlbHBlci5nZXRQcm94eSh0aGlzLnNlbGZfdXJpKSk7XHJcbiAgICAgICAgbGV0IHF1ZXJ5OiBzdHJpbmcgPSBSZXNvdXJjZUFycmF5LnJlcGxhY2VPckFkZCh1cmxQYXJzZWQucXVlcnksICdzaXplJywgdGhpcy5wYWdlU2l6ZS50b1N0cmluZygpKTtcclxuICAgICAgICBxdWVyeSA9IFJlc291cmNlQXJyYXkucmVwbGFjZU9yQWRkKHF1ZXJ5LCAncGFnZScsIHBhZ2VOdW1iZXIudG9TdHJpbmcoKSk7XHJcblxyXG5cclxuICAgICAgICBsZXQgdXJpID0gdXJsUGFyc2VkLnF1ZXJ5ID9cclxuICAgICAgICAgICAgUmVzb3VyY2VIZWxwZXIuZ2V0UHJveHkodGhpcy5zZWxmX3VyaSkucmVwbGFjZSh1cmxQYXJzZWQucXVlcnksIHF1ZXJ5KSA6IFJlc291cmNlSGVscGVyLmdldFByb3h5KHRoaXMuc2VsZl91cmkpLmNvbmNhdChxdWVyeSk7XHJcbiAgICAgICAgdXJpID0gdGhpcy5hZGRTb3J0SW5mbyh1cmkpO1xyXG4gICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkuZ2V0KHVyaSwge2hlYWRlcnM6IFJlc291cmNlSGVscGVyLmhlYWRlcnN9KS5waXBlKFxyXG4gICAgICAgICAgICBtYXAocmVzcG9uc2UgPT4gdGhpcy5pbml0KHR5cGUsIHJlc3BvbnNlLCB0aGlzLnNvcnRJbmZvKSksXHJcbiAgICAgICAgICAgIGNhdGNoRXJyb3IoZXJyb3IgPT4gb2JzZXJ2YWJsZVRocm93RXJyb3IoZXJyb3IpKSwpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKiogU29ydCBjb2xsZWN0aW9uIGJhc2VkIG9uIGdpdmVuIHNvcnQgYXR0cmlidXRlICovXHJcbiAgICBzb3J0RWxlbWVudHMgPSAodHlwZTogeyBuZXcoKTogVCB9LCAuLi5zb3J0OiBTb3J0W10pOiBPYnNlcnZhYmxlPFJlc291cmNlQXJyYXk8VD4+ID0+IHtcclxuICAgICAgICB0aGlzLnNlbGZfdXJpID0gdGhpcy5zZWxmX3VyaS5yZXBsYWNlKCd7P3BhZ2Usc2l6ZSxzb3J0fScsICcnKTtcclxuICAgICAgICB0aGlzLnNlbGZfdXJpID0gdGhpcy5zZWxmX3VyaS5yZXBsYWNlKCd7JnNvcnR9JywgJycpO1xyXG4gICAgICAgIGxldCB1cmkgPSBSZXNvdXJjZUhlbHBlci5nZXRQcm94eSh0aGlzLnNlbGZfdXJpKS5jb25jYXQoJz8nLCAnc2l6ZT0nLCB0aGlzLnBhZ2VTaXplLnRvU3RyaW5nKCksICcmcGFnZT0nLCB0aGlzLnBhZ2VOdW1iZXIudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgdXJpID0gdGhpcy5hZGRTb3J0SW5mbyh1cmkpO1xyXG4gICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkuZ2V0KHVyaSwge2hlYWRlcnM6IFJlc291cmNlSGVscGVyLmhlYWRlcnN9KS5waXBlKFxyXG4gICAgICAgICAgICBtYXAocmVzcG9uc2UgPT4gdGhpcy5pbml0KHR5cGUsIHJlc3BvbnNlLCBzb3J0KSksXHJcbiAgICAgICAgICAgIGNhdGNoRXJyb3IoZXJyb3IgPT4gb2JzZXJ2YWJsZVRocm93RXJyb3IoZXJyb3IpKSwpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKiogTG9hZCBwYWdlIHdpdGggZ2l2ZW4gc2l6ZSAqL1xyXG4gICAgc2l6ZSA9ICh0eXBlOiB7IG5ldygpOiBUIH0sIHNpemU6IG51bWJlcik6IE9ic2VydmFibGU8UmVzb3VyY2VBcnJheTxUPj4gPT4ge1xyXG4gICAgICAgIGxldCB1cmkgPSBSZXNvdXJjZUhlbHBlci5nZXRQcm94eSh0aGlzLnNlbGZfdXJpKS5jb25jYXQoJz8nLCAnc2l6ZT0nLCBzaXplLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgIHVyaSA9IHRoaXMuYWRkU29ydEluZm8odXJpKTtcclxuICAgICAgICByZXR1cm4gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLmdldCh1cmksIHtoZWFkZXJzOiBSZXNvdXJjZUhlbHBlci5oZWFkZXJzfSkucGlwZShcclxuICAgICAgICAgICAgbWFwKHJlc3BvbnNlID0+IHRoaXMuaW5pdCh0eXBlLCByZXNwb25zZSwgdGhpcy5zb3J0SW5mbykpLFxyXG4gICAgICAgICAgICBjYXRjaEVycm9yKGVycm9yID0+IG9ic2VydmFibGVUaHJvd0Vycm9yKGVycm9yKSksKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqIEFkZCBzb3J0IGluZm8gdG8gZ2l2ZW4gVVJJICovXHJcbiAgICBwcml2YXRlIGFkZFNvcnRJbmZvKHVyaTogc3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuc29ydEluZm8pIHtcclxuICAgICAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIHRoaXMuc29ydEluZm8pIHtcclxuICAgICAgICAgICAgICAgIHVyaSA9IHVyaS5jb25jYXQoJyZzb3J0PScsIGl0ZW0ucGF0aCwgJywnLCBpdGVtLm9yZGVyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdXJpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBBZGQgcmVwbGFjZSBvciBhZGQgcGFyYW0gdmFsdWUgdG8gcXVlcnkgc3RyaW5nICovXHJcbiAgICBwcml2YXRlIHN0YXRpYyByZXBsYWNlT3JBZGQocXVlcnk6IHN0cmluZywgZmllbGQ6IHN0cmluZywgdmFsdWU6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgaWYgKHF1ZXJ5KSB7XHJcbiAgICAgICAgICAgIGxldCBpZHg6IG51bWJlciA9IHF1ZXJ5LmluZGV4T2YoZmllbGQpO1xyXG4gICAgICAgICAgICBsZXQgaWR4TmV4dEFtcDogbnVtYmVyID0gcXVlcnkuaW5kZXhPZignJicsIGlkeCkgPT0gLTEgPyBxdWVyeS5pbmRleE9mKCcvJywgaWR4KSA6IHF1ZXJ5LmluZGV4T2YoJyYnLCBpZHgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGlkeCAhPSAtMSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHNlYWNoVmFsdWUgPSBxdWVyeS5zdWJzdHJpbmcoaWR4LCBpZHhOZXh0QW1wKTtcclxuICAgICAgICAgICAgICAgIHF1ZXJ5ID0gcXVlcnkucmVwbGFjZShzZWFjaFZhbHVlLCBmaWVsZCArICc9JyArIHZhbHVlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHF1ZXJ5ID0gcXVlcnkuY29uY2F0KFwiJlwiICsgZmllbGQgKyAnPScgKyB2YWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBxdWVyeSA9IFwiP1wiICsgZmllbGQgKyAnPScgKyB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHF1ZXJ5O1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7SHR0cENsaWVudCwgSHR0cEhlYWRlcnMsIEh0dHBQYXJhbXN9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi9yZXNvdXJjZSc7XHJcbmltcG9ydCB7UmVzb3VyY2VBcnJheX0gZnJvbSAnLi9yZXNvdXJjZS1hcnJheSc7XHJcbmltcG9ydCB7SGFsT3B0aW9uc30gZnJvbSAnLi9yZXN0LnNlcnZpY2UnO1xyXG5pbXBvcnQge1N1YlR5cGVCdWlsZGVyfSBmcm9tICcuL3N1YnR5cGUtYnVpbGRlcic7XHJcbmltcG9ydCB7aXNOdWxsT3JVbmRlZmluZWQsIGlzUHJpbWl0aXZlfSBmcm9tICd1dGlsJztcclxuaW1wb3J0ICogYXMgdXJsIGZyb20gJ3VybCc7XHJcblxyXG4vKiogUkVTVCBBUEkgYWNjZXNzIGhlbHBlciAqL1xyXG5leHBvcnQgY2xhc3MgUmVzb3VyY2VIZWxwZXIge1xyXG5cclxuICAgIC8qKiBIdHRwSGVhZGVycyAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBoZWFkZXJzOiBIdHRwSGVhZGVycyA9IG5ldyBIdHRwSGVhZGVycygpO1xyXG4gICAgLyoqIFByb3h5IFVSTCAqL1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgcHJveHlfdXJpOiBzdHJpbmcgPSBudWxsO1xyXG4gICAgLyoqIFJvb3QgVVJMICovXHJcbiAgICBwcml2YXRlIHN0YXRpYyByb290X3VyaTogc3RyaW5nID0gbnVsbDtcclxuICAgIC8qKiBIdHRwQ2xpZW50ICovXHJcbiAgICBwcml2YXRlIHN0YXRpYyBodHRwOiBIdHRwQ2xpZW50ID0gbnVsbDtcclxuXHJcbiAgICAvKiogZ2V0IHJlcXVlc3QgaGVhZGVycyAqL1xyXG4gICAgLypwdWJsaWMgc3RhdGljIGdldCBoZWFkZXJzKCk6IEh0dHBIZWFkZXJzIHtcclxuICAgICAgICBpZiAoaXNOdWxsT3JVbmRlZmluZWQodGhpcy5faGVhZGVycykpXHJcbiAgICAgICAgICBSZXNvdXJjZUhlbHBlci5faGVhZGVycyA9IG5ldyBIdHRwSGVhZGVycygpO1xyXG4gICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5faGVhZGVycztcclxuICAgIH0qL1xyXG5cclxuICAgIC8qKiBzZXQgcmVxdWVzdCBoZWFkZXJzICovXHJcbiAgICAvKnB1YmxpYyBzdGF0aWMgc2V0IGhlYWRlcnMoaGVhZGVyczogSHR0cEhlYWRlcnMpIHtcclxuICAgICAgUmVzb3VyY2VIZWxwZXIuX2hlYWRlcnMgPSBoZWFkZXJzO1xyXG4gICAgfSovXHJcblxyXG4gICAgLyoqIGdldCByZXF1ZXN0IG9wdGlvbiBwYXJhbXMgKi9cclxuICAgIHN0YXRpYyBvcHRpb25QYXJhbXMocGFyYW1zOiBIdHRwUGFyYW1zLCBvcHRpb25zPzogSGFsT3B0aW9ucyk6IEh0dHBQYXJhbXMge1xyXG4gICAgICAgIGlmIChvcHRpb25zKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5wYXJhbXMpIHtcclxuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgcGFyYW0gb2Ygb3B0aW9ucy5wYXJhbXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBwYXJhbXMgPSBwYXJhbXMuYXBwZW5kKHBhcmFtLmtleSwgcGFyYW0udmFsdWUudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChvcHRpb25zLnNpemUpIHtcclxuICAgICAgICAgICAgICAgIHBhcmFtcyA9IHBhcmFtcy5hcHBlbmQoJ3NpemUnLCBvcHRpb25zLnNpemUudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChvcHRpb25zLnNvcnQpIHtcclxuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgcyBvZiBvcHRpb25zLnNvcnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgc29ydFN0cmluZyA9ICcnO1xyXG4gICAgICAgICAgICAgICAgICAgIHNvcnRTdHJpbmcgPSBzLnBhdGggPyBzb3J0U3RyaW5nLmNvbmNhdChzLnBhdGgpIDogc29ydFN0cmluZztcclxuICAgICAgICAgICAgICAgICAgICBzb3J0U3RyaW5nID0gcy5vcmRlciA/IHNvcnRTdHJpbmcuY29uY2F0KCcsJykuY29uY2F0KHMub3JkZXIpIDogc29ydFN0cmluZztcclxuICAgICAgICAgICAgICAgICAgICBwYXJhbXMgPSBwYXJhbXMuYXBwZW5kKCdzb3J0Jywgc29ydFN0cmluZyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBwYXJhbXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHJlc29sdmUgcmVzb3VyY2UgcmVsYXRpb25zICovXHJcbiAgICBzdGF0aWMgcmVzb2x2ZVJlbGF0aW9ucyhyZXNvdXJjZTogUmVzb3VyY2UpOiBPYmplY3Qge1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdDogYW55ID0ge307XHJcbiAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gcmVzb3VyY2UpIHtcclxuICAgICAgICAgICAgaWYgKCFpc051bGxPclVuZGVmaW5lZChyZXNvdXJjZVtrZXldKSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKFJlc291cmNlSGVscGVyLmNsYXNzTmFtZShyZXNvdXJjZVtrZXldKVxyXG4gICAgICAgICAgICAgICAgICAgIC5maW5kKChjbGFzc05hbWU6IHN0cmluZykgPT4gY2xhc3NOYW1lID09ICdSZXNvdXJjZScpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc291cmNlW2tleV1bJ19saW5rcyddKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRba2V5XSA9IHJlc291cmNlW2tleV1bJ19saW5rcyddWydzZWxmJ11bJ2hyZWYnXTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShyZXNvdXJjZVtrZXldKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBhcnJheTogYW55W10gPSByZXNvdXJjZVtrZXldO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhcnJheSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRba2V5XSA9IG5ldyBBcnJheSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhcnJheS5mb3JFYWNoKChlbGVtZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNQcmltaXRpdmUoZWxlbWVudCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRba2V5XS5wdXNoKGVsZW1lbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0W2tleV0ucHVzaCh0aGlzLnJlc29sdmVSZWxhdGlvbnMoZWxlbWVudCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdFtrZXldID0gcmVzb3VyY2Vba2V5XTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0IGFzIE9iamVjdDtcclxuICAgIH1cclxuXHJcbiAgICAvKiogY3JlYXRlIGFuIGVtcHR5IHJlc291cmNlIGZyb20gZW1iZWRkZWQgZGF0YSovXHJcbiAgICBzdGF0aWMgY3JlYXRlRW1wdHlSZXN1bHQ8VCBleHRlbmRzIFJlc291cmNlPihfZW1iZWRkZWQ6IHN0cmluZyk6IFJlc291cmNlQXJyYXk8VD4ge1xyXG4gICAgICAgIGxldCByZXNvdXJjZUFycmF5OiBSZXNvdXJjZUFycmF5PFQ+ID0gbmV3IFJlc291cmNlQXJyYXk8VD4oKTtcclxuICAgICAgICByZXNvdXJjZUFycmF5Ll9lbWJlZGRlZCA9IF9lbWJlZGRlZDtcclxuICAgICAgICByZXR1cm4gcmVzb3VyY2VBcnJheTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHJlc291cmNlIGNsYXNzIG5hbWUqL1xyXG4gICAgc3RhdGljIGdldENsYXNzTmFtZShvYmo6IGFueSk6IHN0cmluZyB7XHJcbiAgICAgICAgdmFyIGZ1bmNOYW1lUmVnZXggPSAvZnVuY3Rpb24gKC4rPylcXCgvO1xyXG4gICAgICAgIHZhciByZXN1bHRzID0gKGZ1bmNOYW1lUmVnZXgpLmV4ZWMob2JqLmNvbnN0cnVjdG9yLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgIHJldHVybiAocmVzdWx0cyAmJiByZXN1bHRzLmxlbmd0aCA+IDEpID8gcmVzdWx0c1sxXSA6ICcnO1xyXG4gICAgfVxyXG5cclxuICAgIFxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBjbGFzcyBuYW1lIGZyb20gYSBwcm90b3R5cGUgb2JqZWN0Ki9cclxuICAgIHN0YXRpYyBjbGFzc05hbWUob2JqUHJvdG86IGFueSk6IHN0cmluZ1tdIHtcclxuICAgICAgICBsZXQgY2xhc3NOYW1lcyA9IFtdO1xyXG4gICAgICAgIGxldCBvYmogPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqUHJvdG8pO1xyXG4gICAgICAgIGxldCBjbGFzc05hbWU6IHN0cmluZztcclxuXHJcbiAgICAgICAgd2hpbGUgKChjbGFzc05hbWUgPSBSZXNvdXJjZUhlbHBlci5nZXRDbGFzc05hbWUob2JqKSkgIT09ICdPYmplY3QnKSB7XHJcbiAgICAgICAgICAgIGNsYXNzTmFtZXMucHVzaChjbGFzc05hbWUpO1xyXG4gICAgICAgICAgICBvYmogPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBjbGFzc05hbWVzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBpbnN0YW50aWF0ZSBhIFJlc291cmNlQ29sbGVjdGlvbiBmcm9tIHJlc3BvbnNlIGVtYmVkZGVkIGRhdGEqL1xyXG4gICAgc3RhdGljIGluc3RhbnRpYXRlUmVzb3VyY2VDb2xsZWN0aW9uPFQgZXh0ZW5kcyBSZXNvdXJjZT4odHlwZTogeyBuZXcoKTogVCB9LCBwYXlsb2FkOiBhbnksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQ6IFJlc291cmNlQXJyYXk8VD4sIGJ1aWxkZXI/OiBTdWJUeXBlQnVpbGRlcik6IFJlc291cmNlQXJyYXk8VD4ge1xyXG4gICAgICAgIGZvciAoY29uc3QgZW1iZWRkZWRDbGFzc05hbWUgb2YgT2JqZWN0LmtleXMocGF5bG9hZFtyZXN1bHQuX2VtYmVkZGVkXSkpIHtcclxuICAgICAgICAgICAgbGV0IGVtYmVkZGVkOiBhbnkgPSBwYXlsb2FkW3Jlc3VsdC5fZW1iZWRkZWRdO1xyXG4gICAgICAgICAgICBjb25zdCBpdGVtcyA9IGVtYmVkZGVkW2VtYmVkZGVkQ2xhc3NOYW1lXTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaXRlbSBvZiBpdGVtcykge1xyXG4gICAgICAgICAgICAgICAgbGV0IGluc3RhbmNlOiBUID0gbmV3IHR5cGUoKTtcclxuICAgICAgICAgICAgICAgIGluc3RhbmNlID0gdGhpcy5zZWFyY2hTdWJ0eXBlcyhidWlsZGVyLCBlbWJlZGRlZENsYXNzTmFtZSwgaW5zdGFuY2UpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuaW5zdGFudGlhdGVSZXNvdXJjZShpbnN0YW5jZSwgaXRlbSk7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChpbnN0YW5jZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJlc3VsdC50b3RhbEVsZW1lbnRzID0gcGF5bG9hZC5wYWdlID8gcGF5bG9hZC5wYWdlLnRvdGFsRWxlbWVudHMgOiByZXN1bHQubGVuZ3RoO1xyXG4gICAgICAgIHJlc3VsdC50b3RhbFBhZ2VzID0gcGF5bG9hZC5wYWdlID8gcGF5bG9hZC5wYWdlLnRvdGFsUGFnZXMgOiAxO1xyXG4gICAgICAgIHJlc3VsdC5wYWdlTnVtYmVyID0gcGF5bG9hZC5wYWdlID8gcGF5bG9hZC5wYWdlLm51bWJlciA6IDE7XHJcbiAgICAgICAgcmVzdWx0LnBhZ2VTaXplID0gcGF5bG9hZC5wYWdlID8gcGF5bG9hZC5wYWdlLnNpemUgOiAyMDtcclxuXHJcbiAgICAgICAgcmVzdWx0LnNlbGZfdXJpID0gcGF5bG9hZC5fbGlua3MgJiYgcGF5bG9hZC5fbGlua3Muc2VsZiA/IHBheWxvYWQuX2xpbmtzLnNlbGYuaHJlZiA6IHVuZGVmaW5lZDtcclxuICAgICAgICByZXN1bHQubmV4dF91cmkgPSBwYXlsb2FkLl9saW5rcyAmJiBwYXlsb2FkLl9saW5rcy5uZXh0ID8gcGF5bG9hZC5fbGlua3MubmV4dC5ocmVmIDogdW5kZWZpbmVkO1xyXG4gICAgICAgIHJlc3VsdC5wcmV2X3VyaSA9IHBheWxvYWQuX2xpbmtzICYmIHBheWxvYWQuX2xpbmtzLnByZXYgPyBwYXlsb2FkLl9saW5rcy5wcmV2LmhyZWYgOiB1bmRlZmluZWQ7XHJcbiAgICAgICAgcmVzdWx0LmZpcnN0X3VyaSA9IHBheWxvYWQuX2xpbmtzICYmIHBheWxvYWQuX2xpbmtzLmZpcnN0ID8gcGF5bG9hZC5fbGlua3MuZmlyc3QuaHJlZiA6IHVuZGVmaW5lZDtcclxuICAgICAgICByZXN1bHQubGFzdF91cmkgPSBwYXlsb2FkLl9saW5rcyAmJiBwYXlsb2FkLl9saW5rcy5sYXN0ID8gcGF5bG9hZC5fbGlua3MubGFzdC5ocmVmIDogdW5kZWZpbmVkO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHNlYXJjaCBzdWJ0eXBlcyovXHJcbiAgICBzdGF0aWMgc2VhcmNoU3VidHlwZXM8VCBleHRlbmRzIFJlc291cmNlPihidWlsZGVyOiBTdWJUeXBlQnVpbGRlciwgZW1iZWRkZWRDbGFzc05hbWU6IHN0cmluZywgaW5zdGFuY2U6IFQpIHtcclxuICAgICAgICBpZiAoYnVpbGRlciAmJiBidWlsZGVyLnN1YnR5cGVzKSB7XHJcbiAgICAgICAgICAgIGxldCBrZXlzID0gYnVpbGRlci5zdWJ0eXBlcy5rZXlzKCk7XHJcbiAgICAgICAgICAgIEFycmF5LmZyb20oa2V5cykuZm9yRWFjaCgoc3VidHlwZUtleTogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZW1iZWRkZWRDbGFzc05hbWUudG9Mb3dlckNhc2UoKS5zdGFydHNXaXRoKHN1YnR5cGVLZXkudG9Mb3dlckNhc2UoKSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgc3VidHlwZTogeyBuZXcoKTogYW55IH0gPSBidWlsZGVyLnN1YnR5cGVzLmdldChzdWJ0eXBlS2V5KTtcclxuICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZSA9IG5ldyBzdWJ0eXBlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gaW5zdGFuY2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGluc3RhbnRpYXRlIGEgUmVzb3VyY2UgZnJvbSByZXNwb25zZSAqL1xyXG4gICAgc3RhdGljIGluc3RhbnRpYXRlUmVzb3VyY2U8VCBleHRlbmRzIFJlc291cmNlPihlbnRpdHk6IFQsIHBheWxvYWQ6IE9iamVjdCk6IFQge1xyXG4gICAgICAgIGZvciAoY29uc3QgcCBpbiBwYXlsb2FkKSB7XHJcbiAgICAgICAgICAgIC8vVE9ETyBhcnJheSBpbml0XHJcbiAgICAgICAgICAgIC8qIGlmKGVudGl0eVtwXS5jb25zdHJ1Y3RvciA9PT0gQXJyYXkgJiYgaXNOdWxsT3JVbmRlZmluZWQocGF5bG9hZFtwXSkpXHJcbiAgICAgICAgICAgICAgICAgZW50aXR5W3BdID0gW107XHJcbiAgICAgICAgICAgICBlbHNlKi9cclxuICAgICAgICAgICAgZW50aXR5W3BdID0gcGF5bG9hZFtwXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGVudGl0eTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogc2V0IHByb3h5IFVSTCAqL1xyXG4gICAgc3RhdGljIHNldFByb3h5VXJpKHByb3h5X3VyaTogc3RyaW5nKSB7XHJcbiAgICAgICAgUmVzb3VyY2VIZWxwZXIucHJveHlfdXJpID0gcHJveHlfdXJpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBzZXQgUm9vdCBVUkkgKi9cclxuICAgIHN0YXRpYyBzZXRSb290VXJpKHJvb3RfdXJpOiBzdHJpbmcpIHtcclxuICAgICAgICBSZXNvdXJjZUhlbHBlci5yb290X3VyaSA9IHJvb3RfdXJpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgcHJveHkgVVJMICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldFVSTCgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5wcm94eV91cmkgJiYgUmVzb3VyY2VIZWxwZXIucHJveHlfdXJpICE9ICcnID9cclxuICAgICAgICAgICAgUmVzb3VyY2VIZWxwZXIuYWRkU2xhc2goUmVzb3VyY2VIZWxwZXIucHJveHlfdXJpKSA6XHJcbiAgICAgICAgICAgIFJlc291cmNlSGVscGVyLmFkZFNsYXNoKFJlc291cmNlSGVscGVyLnJvb3RfdXJpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogYWRkIHNsYXNoIHRvIFVSSSAqL1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgYWRkU2xhc2godXJpOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgIGxldCB1cmlQYXJzZWQgPSB1cmwucGFyc2UodXJpKTtcclxuICAgICAgICBpZiAoaXNOdWxsT3JVbmRlZmluZWQodXJpUGFyc2VkLnNlYXJjaCkgJiYgdXJpICYmIHVyaVt1cmkubGVuZ3RoIC0gMV0gIT0gJy8nKVxyXG4gICAgICAgICAgICByZXR1cm4gdXJpICsgJy8nO1xyXG4gICAgICAgIHJldHVybiB1cmk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCBwcm94eSBmcm9tIFVSTCAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBnZXRQcm94eSh1cmw6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgaWYgKCFSZXNvdXJjZUhlbHBlci5wcm94eV91cmkgfHwgUmVzb3VyY2VIZWxwZXIucHJveHlfdXJpID09ICcnKVxyXG4gICAgICAgICAgICByZXR1cm4gdXJsO1xyXG4gICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5hZGRTbGFzaCh1cmwucmVwbGFjZShSZXNvdXJjZUhlbHBlci5yb290X3VyaSwgUmVzb3VyY2VIZWxwZXIucHJveHlfdXJpKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHNldCBIdHRwQ2xpZW50Ki9cclxuICAgIHB1YmxpYyBzdGF0aWMgc2V0SHR0cChodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICAgICAgUmVzb3VyY2VIZWxwZXIuaHR0cCA9IGh0dHA7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCBIdHRwQ2xpZW50Ki9cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0SHR0cCgpOiBIdHRwQ2xpZW50IHtcclxuICAgICAgICByZXR1cm4gUmVzb3VyY2VIZWxwZXIuaHR0cDtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHJvb3QgVVJJKi9cclxuICAgIHN0YXRpYyBnZXRSb290VXJpKCkge1xyXG4gICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5yb290X3VyaTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQge0h0dHBDbGllbnR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHtJbmplY3QsIEluamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge1Jlc291cmNlSGVscGVyfSBmcm9tICcuL3Jlc291cmNlLWhlbHBlcic7XHJcbmltcG9ydCB7RXh0ZXJuYWxDb25maWd1cmF0aW9uSGFuZGxlckludGVyZmFjZX0gZnJvbSAnLi9leHRlcm5hbC1jb25maWd1cmF0aW9uLmhhbmRsZXInO1xyXG5pbXBvcnQge0V4dGVybmFsQ29uZmlndXJhdGlvbn0gZnJvbSAnLi9FeHRlcm5hbENvbmZpZ3VyYXRpb24nO1xyXG5cclxuXHJcbi8qKiBFeHRlcm5hbFNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgRXh0ZXJuYWxTZXJ2aWNlIHtcclxuXHJcbiAgICAvKiogY29uc3RydWN0b3IgKi9cclxuICAgIGNvbnN0cnVjdG9yKEBJbmplY3QoJ0V4dGVybmFsQ29uZmlndXJhdGlvblNlcnZpY2UnKSBwcml2YXRlIGV4dGVybmFsQ29uZmlndXJhdGlvblNlcnZpY2U6IEV4dGVybmFsQ29uZmlndXJhdGlvbkhhbmRsZXJJbnRlcmZhY2UpIHtcclxuICAgICAgICBSZXNvdXJjZUhlbHBlci5zZXRQcm94eVVyaShleHRlcm5hbENvbmZpZ3VyYXRpb25TZXJ2aWNlLmdldFByb3h5VXJpKCkpO1xyXG4gICAgICAgIFJlc291cmNlSGVscGVyLnNldFJvb3RVcmkoZXh0ZXJuYWxDb25maWd1cmF0aW9uU2VydmljZS5nZXRSb290VXJpKCkpO1xyXG4gICAgICAgIFJlc291cmNlSGVscGVyLnNldEh0dHAoZXh0ZXJuYWxDb25maWd1cmF0aW9uU2VydmljZS5nZXRIdHRwKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiB1cGRhdGUgRXh0ZXJuYWxDb25maWd1cmF0aW9uSGFuZGxlciAqL1xyXG4gICAgcHVibGljIHVwZGF0ZUV4dGVybmFsQ29uZmlndXJhdGlvbkhhbmRsZXJJbnRlcmZhY2UoZXh0ZXJuYWxDb25maWd1cmF0aW9uU2VydmljZTogRXh0ZXJuYWxDb25maWd1cmF0aW9uSGFuZGxlckludGVyZmFjZSkge1xyXG5cdHRoaXMuZXh0ZXJuYWxDb25maWd1cmF0aW9uU2VydmljZSA9IGV4dGVybmFsQ29uZmlndXJhdGlvblNlcnZpY2U7XHJcblxyXG4gICAgICAgIFJlc291cmNlSGVscGVyLnNldFByb3h5VXJpKGV4dGVybmFsQ29uZmlndXJhdGlvblNlcnZpY2UuZ2V0UHJveHlVcmkoKSk7XHJcbiAgICAgICAgUmVzb3VyY2VIZWxwZXIuc2V0Um9vdFVyaShleHRlcm5hbENvbmZpZ3VyYXRpb25TZXJ2aWNlLmdldFJvb3RVcmkoKSk7XHJcbiAgICAgICAgUmVzb3VyY2VIZWxwZXIuc2V0SHR0cChleHRlcm5hbENvbmZpZ3VyYXRpb25TZXJ2aWNlLmdldEh0dHAoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCBFeHRlcm5hbENvbmZpZ3VyYXRpb24gKi9cclxuICAgIHB1YmxpYyBnZXRFeHRlcm5hbENvbmZpZ3VyYXRpb24oKTogRXh0ZXJuYWxDb25maWd1cmF0aW9uIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5leHRlcm5hbENvbmZpZ3VyYXRpb25TZXJ2aWNlLmdldEV4dGVybmFsQ29uZmlndXJhdGlvbigpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgcHJveHkgVVJMICovXHJcbiAgICBwdWJsaWMgZ2V0UHJveHlVcmkoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5leHRlcm5hbENvbmZpZ3VyYXRpb25TZXJ2aWNlLmdldFByb3h5VXJpKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCBSb290IFVSSSAqL1xyXG4gICAgcHVibGljIGdldFJvb3RVcmkoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5leHRlcm5hbENvbmZpZ3VyYXRpb25TZXJ2aWNlLmdldFJvb3RVcmkoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IFVSTCAqL1xyXG4gICAgcHVibGljIGdldFVSTCgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5nZXRVUkwoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IEh0dHBDbGllbnQgKi9cclxuICAgIHB1YmxpYyBnZXRIdHRwKCk6IEh0dHBDbGllbnQge1xyXG4gICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCk7XHJcbiAgICB9XHJcbn1cclxuIiwiXHJcbmltcG9ydCB7dGhyb3dFcnJvciBhcyBvYnNlcnZhYmxlVGhyb3dFcnJvcn0gZnJvbSAncnhqcyc7XHJcblxyXG5pbXBvcnQge2NhdGNoRXJyb3IsIG1hcH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5pbXBvcnQge1Jlc291cmNlfSBmcm9tICcuL3Jlc291cmNlJztcclxuaW1wb3J0IHtSZXNvdXJjZUhlbHBlcn0gZnJvbSAnLi9yZXNvdXJjZS1oZWxwZXInO1xyXG5pbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge0h0dHBQYXJhbXMsIEh0dHBSZXNwb25zZX0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQge1NvcnR9IGZyb20gJy4vc29ydCc7XHJcbmltcG9ydCB7UmVzb3VyY2VBcnJheX0gZnJvbSAnLi9yZXNvdXJjZS1hcnJheSc7XHJcbmltcG9ydCB7RXh0ZXJuYWxTZXJ2aWNlfSBmcm9tICcuL2V4dGVybmFsLnNlcnZpY2UnO1xyXG5pbXBvcnQge0hhbE9wdGlvbnN9IGZyb20gJy4vcmVzdC5zZXJ2aWNlJztcclxuaW1wb3J0IHtTdWJUeXBlQnVpbGRlcn0gZnJvbSAnLi9zdWJ0eXBlLWJ1aWxkZXInO1xyXG5pbXBvcnQge09ic2VydmFibGV9IGZyb20gJ3J4anMvaW50ZXJuYWwvT2JzZXJ2YWJsZSc7XHJcblxyXG4vKiogUmVzb3VyY2VTZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFJlc291cmNlU2VydmljZSB7XHJcblxyXG5cclxuICAgIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBleHRlcm5hbFNlcnZpY2U6IEV4dGVybmFsU2VydmljZSkge31cclxuXHJcblxyXG4gICAgLyoqIGdldCBVUkwgKi9cclxuICAgIHByaXZhdGUgc3RhdGljIGdldFVSTCgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5nZXRVUkwoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IGFsbCByZXNvdXJjZXMgZnJvbSBhIGJhc2UgVVJJIG9mIGEgZ2l2ZW4gdHlwZSAqL1xyXG4gICAgcHVibGljIGdldEFsbDxUIGV4dGVuZHMgUmVzb3VyY2U+KHR5cGU6IHsgbmV3KCk6IFQgfSwgcmVzb3VyY2U6IHN0cmluZywgX2VtYmVkZGVkOiBzdHJpbmcsIG9wdGlvbnM/OiBIYWxPcHRpb25zLCBzdWJUeXBlPzogU3ViVHlwZUJ1aWxkZXIpOiBPYnNlcnZhYmxlPFJlc291cmNlQXJyYXk8VD4+IHtcclxuICAgICAgICBjb25zdCB1cmkgPSB0aGlzLmdldFJlc291cmNlVXJsKHJlc291cmNlKS5jb25jYXQoJz9wcm9qZWN0aW9uPXZpZXcnKTtcclxuICAgICAgICBjb25zdCBwYXJhbXMgPSBSZXNvdXJjZUhlbHBlci5vcHRpb25QYXJhbXMobmV3IEh0dHBQYXJhbXMoKSwgb3B0aW9ucyk7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0OiBSZXNvdXJjZUFycmF5PFQ+ID0gUmVzb3VyY2VIZWxwZXIuY3JlYXRlRW1wdHlSZXN1bHQ8VD4oX2VtYmVkZGVkKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRVcmxzKHJlc3VsdCk7XHJcbiAgICAgICAgcmVzdWx0LnNvcnRJbmZvID0gb3B0aW9ucyA/IG9wdGlvbnMuc29ydCA6IHVuZGVmaW5lZDtcclxuICAgICAgICBsZXQgb2JzZXJ2YWJsZSA9IFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5nZXQodXJpLCB7aGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVycywgcGFyYW1zOiBwYXJhbXN9KTtcclxuICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZS5waXBlKG1hcChyZXNwb25zZSA9PiBSZXNvdXJjZUhlbHBlci5pbnN0YW50aWF0ZVJlc291cmNlQ29sbGVjdGlvbih0eXBlLCByZXNwb25zZSwgcmVzdWx0LCBzdWJUeXBlKSksXHJcbiAgICAgICAgICAgIGNhdGNoRXJyb3IoZXJyb3IgPT4gb2JzZXJ2YWJsZVRocm93RXJyb3IoZXJyb3IpKSwpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgcmVzb3VyY2UgZnJvbSBhIGJhc2UgVVJJIGFuZCBhIGdpdmVuIGlkICovXHJcbiAgICBwdWJsaWMgZ2V0PFQgZXh0ZW5kcyBSZXNvdXJjZT4odHlwZTogeyBuZXcoKTogVCB9LCByZXNvdXJjZTogc3RyaW5nLCBpZDogYW55KTogT2JzZXJ2YWJsZTxUPiB7XHJcbiAgICAgICAgY29uc3QgdXJpID0gdGhpcy5nZXRSZXNvdXJjZVVybChyZXNvdXJjZSkuY29uY2F0KCcvJywgaWQsICc/cHJvamVjdGlvbj12aWV3Jyk7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0OiBUID0gbmV3IHR5cGUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRVcmxzUmVzb3VyY2UocmVzdWx0KTtcclxuICAgICAgICBsZXQgb2JzZXJ2YWJsZSA9IFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5nZXQodXJpLCB7aGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVyc30pO1xyXG4gICAgICAgIHJldHVybiBvYnNlcnZhYmxlLnBpcGUobWFwKGRhdGEgPT4gUmVzb3VyY2VIZWxwZXIuaW5zdGFudGlhdGVSZXNvdXJjZShyZXN1bHQsIGRhdGEpKSxcclxuICAgICAgICAgICAgY2F0Y2hFcnJvcihlcnJvciA9PiBvYnNlcnZhYmxlVGhyb3dFcnJvcihlcnJvcikpLCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBmcm9tIGl0cyBzZWxmbGluayAqL1xyXG4gICAgcHVibGljIGdldEJ5U2VsZkxpbms8VCBleHRlbmRzIFJlc291cmNlPih0eXBlOiB7IG5ldygpOiBUIH0sIHJlc291cmNlTGluazogc3RyaW5nKTogT2JzZXJ2YWJsZTxUPiB7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0OiBUID0gbmV3IHR5cGUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRVcmxzUmVzb3VyY2UocmVzdWx0KTtcclxuICAgICAgICBsZXQgb2JzZXJ2YWJsZSA9IFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5nZXQoUmVzb3VyY2VIZWxwZXIuZ2V0UHJveHkocmVzb3VyY2VMaW5rKSwge2hlYWRlcnM6IFJlc291cmNlSGVscGVyLmhlYWRlcnN9KTtcclxuICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZS5waXBlKG1hcChkYXRhID0+IFJlc291cmNlSGVscGVyLmluc3RhbnRpYXRlUmVzb3VyY2UocmVzdWx0LCBkYXRhKSksXHJcbiAgICAgICAgICAgIGNhdGNoRXJyb3IoZXJyb3IgPT4gb2JzZXJ2YWJsZVRocm93RXJyb3IoZXJyb3IpKSwpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBzZWFyY2ggcmVzb3VyY2VzIGZyb20gYSBnaXZlbiBiYXNlIHBhdGgsIHF1ZXJ5IGFuZCBvcHRpb25zICovXHJcbiAgICBwdWJsaWMgc2VhcmNoPFQgZXh0ZW5kcyBSZXNvdXJjZT4odHlwZTogeyBuZXcoKTogVCB9LCBxdWVyeTogc3RyaW5nLCByZXNvdXJjZTogc3RyaW5nLCBfZW1iZWRkZWQ6IHN0cmluZywgb3B0aW9ucz86IEhhbE9wdGlvbnMpOiBPYnNlcnZhYmxlPFJlc291cmNlQXJyYXk8VD4+IHtcclxuICAgICAgICBjb25zdCB1cmkgPSB0aGlzLmdldFJlc291cmNlVXJsKHJlc291cmNlKS5jb25jYXQoJy9zZWFyY2gvJywgcXVlcnkpO1xyXG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IFJlc291cmNlSGVscGVyLm9wdGlvblBhcmFtcyhuZXcgSHR0cFBhcmFtcygpLCBvcHRpb25zKTtcclxuICAgICAgICBjb25zdCByZXN1bHQ6IFJlc291cmNlQXJyYXk8VD4gPSBSZXNvdXJjZUhlbHBlci5jcmVhdGVFbXB0eVJlc3VsdDxUPihfZW1iZWRkZWQpO1xyXG5cclxuICAgICAgICB0aGlzLnNldFVybHMocmVzdWx0KTtcclxuICAgICAgICBsZXQgb2JzZXJ2YWJsZSA9IFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5nZXQodXJpLCB7aGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVycywgcGFyYW1zOiBwYXJhbXN9KTtcclxuICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZS5waXBlKG1hcChyZXNwb25zZSA9PiBSZXNvdXJjZUhlbHBlci5pbnN0YW50aWF0ZVJlc291cmNlQ29sbGVjdGlvbih0eXBlLCByZXNwb25zZSwgcmVzdWx0KSksXHJcbiAgICAgICAgICAgIGNhdGNoRXJyb3IoZXJyb3IgPT4gb2JzZXJ2YWJsZVRocm93RXJyb3IoZXJyb3IpKSwpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBzZWFyY2ggYSBzaW5nbGUgcmVzb3VyY2UgZnJvbSBhIGdpdmVuIGJhc2UgcGF0aCwgcXVlcnkgYW5kIG9wdGlvbnMgKi9cclxuICAgIHB1YmxpYyBzZWFyY2hTaW5nbGU8VCBleHRlbmRzIFJlc291cmNlPih0eXBlOiB7IG5ldygpOiBUIH0sIHF1ZXJ5OiBzdHJpbmcsIHJlc291cmNlOiBzdHJpbmcsIG9wdGlvbnM/OiBIYWxPcHRpb25zKTogT2JzZXJ2YWJsZTxUPiB7XHJcbiAgICAgICAgY29uc3QgdXJpID0gdGhpcy5nZXRSZXNvdXJjZVVybChyZXNvdXJjZSkuY29uY2F0KCcvc2VhcmNoLycsIHF1ZXJ5KTtcclxuICAgICAgICBjb25zdCBwYXJhbXMgPSBSZXNvdXJjZUhlbHBlci5vcHRpb25QYXJhbXMobmV3IEh0dHBQYXJhbXMoKSwgb3B0aW9ucyk7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0OiBUID0gbmV3IHR5cGUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRVcmxzUmVzb3VyY2UocmVzdWx0KTtcclxuICAgICAgICBsZXQgb2JzZXJ2YWJsZSA9IFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5nZXQodXJpLCB7aGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVycywgcGFyYW1zOiBwYXJhbXN9KTtcclxuICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZS5waXBlKG1hcChyZXNwb25zZSA9PiBSZXNvdXJjZUhlbHBlci5pbnN0YW50aWF0ZVJlc291cmNlKHJlc3VsdCwgcmVzcG9uc2UpKSxcclxuICAgICAgICAgICAgY2F0Y2hFcnJvcihlcnJvciA9PiBvYnNlcnZhYmxlVGhyb3dFcnJvcihlcnJvcikpLCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHNlYXJjaCByZXNvdXJjZXMgZnJvbSBhIGdpdmVuIGJhc2UgcGF0aCwgY3VzdG9tIHF1ZXJ5IGFuZCBvcHRpb25zICovXHJcbiAgICBwdWJsaWMgY3VzdG9tUXVlcnk8VCBleHRlbmRzIFJlc291cmNlPih0eXBlOiB7IG5ldygpOiBUIH0sIHF1ZXJ5OiBzdHJpbmcsIHJlc291cmNlOiBzdHJpbmcsIF9lbWJlZGRlZDogc3RyaW5nLCBvcHRpb25zPzogSGFsT3B0aW9ucyk6IE9ic2VydmFibGU8UmVzb3VyY2VBcnJheTxUPj4ge1xyXG4gICAgICAgIGNvbnN0IHVyaSA9IHRoaXMuZ2V0UmVzb3VyY2VVcmwocmVzb3VyY2UgKyBxdWVyeSk7XHJcbiAgICAgICAgY29uc3QgcGFyYW1zID0gUmVzb3VyY2VIZWxwZXIub3B0aW9uUGFyYW1zKG5ldyBIdHRwUGFyYW1zKCksIG9wdGlvbnMpO1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdDogUmVzb3VyY2VBcnJheTxUPiA9IFJlc291cmNlSGVscGVyLmNyZWF0ZUVtcHR5UmVzdWx0PFQ+KF9lbWJlZGRlZCk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0VXJscyhyZXN1bHQpO1xyXG4gICAgICAgIGxldCBvYnNlcnZhYmxlID0gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLmdldCh1cmksIHtoZWFkZXJzOiBSZXNvdXJjZUhlbHBlci5oZWFkZXJzLCBwYXJhbXM6IHBhcmFtc30pO1xyXG4gICAgICAgIHJldHVybiBvYnNlcnZhYmxlLnBpcGUobWFwKHJlc3BvbnNlID0+IFJlc291cmNlSGVscGVyLmluc3RhbnRpYXRlUmVzb3VyY2VDb2xsZWN0aW9uKHR5cGUsIHJlc3BvbnNlLCByZXN1bHQpKSxcclxuICAgICAgICAgICAgY2F0Y2hFcnJvcihlcnJvciA9PiBvYnNlcnZhYmxlVGhyb3dFcnJvcihlcnJvcikpLCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBnaXZlbiBhIHJlbGF0aW9uIGxpbmsgKi9cclxuICAgIHB1YmxpYyBnZXRCeVJlbGF0aW9uPFQgZXh0ZW5kcyBSZXNvdXJjZT4odHlwZTogeyBuZXcoKTogVCB9LCByZXNvdXJjZUxpbms6IHN0cmluZyk6IE9ic2VydmFibGU8VD4ge1xyXG4gICAgICAgIGxldCByZXN1bHQ6IFQgPSBuZXcgdHlwZSgpO1xyXG5cclxuICAgICAgICB0aGlzLnNldFVybHNSZXNvdXJjZShyZXN1bHQpO1xyXG4gICAgICAgIGxldCBvYnNlcnZhYmxlID0gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLmdldChyZXNvdXJjZUxpbmssIHtoZWFkZXJzOiBSZXNvdXJjZUhlbHBlci5oZWFkZXJzfSk7XHJcbiAgICAgICAgcmV0dXJuIG9ic2VydmFibGUucGlwZShtYXAoZGF0YSA9PiBSZXNvdXJjZUhlbHBlci5pbnN0YW50aWF0ZVJlc291cmNlKHJlc3VsdCwgZGF0YSkpLFxyXG4gICAgICAgICAgICBjYXRjaEVycm9yKGVycm9yID0+IG9ic2VydmFibGVUaHJvd0Vycm9yKGVycm9yKSksKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHJlc291cmNlIGFycmF5IGdpdmVuIGEgcmVsYXRpb24gbGluayAqL1xyXG4gICAgcHVibGljIGdldEJ5UmVsYXRpb25BcnJheTxUIGV4dGVuZHMgUmVzb3VyY2U+KHR5cGU6IHsgbmV3KCk6IFQgfSwgcmVzb3VyY2VMaW5rOiBzdHJpbmcsIF9lbWJlZGRlZDogc3RyaW5nLCBidWlsZGVyPzogU3ViVHlwZUJ1aWxkZXIpOiBPYnNlcnZhYmxlPFJlc291cmNlQXJyYXk8VD4+IHtcclxuICAgICAgICBjb25zdCByZXN1bHQ6IFJlc291cmNlQXJyYXk8VD4gPSBSZXNvdXJjZUhlbHBlci5jcmVhdGVFbXB0eVJlc3VsdDxUPihfZW1iZWRkZWQpO1xyXG5cclxuICAgICAgICB0aGlzLnNldFVybHMocmVzdWx0KTtcclxuICAgICAgICBsZXQgb2JzZXJ2YWJsZSA9IFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5nZXQocmVzb3VyY2VMaW5rLCB7aGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVyc30pO1xyXG4gICAgICAgIHJldHVybiBvYnNlcnZhYmxlLnBpcGUobWFwKHJlc3BvbnNlID0+IFJlc291cmNlSGVscGVyLmluc3RhbnRpYXRlUmVzb3VyY2VDb2xsZWN0aW9uKHR5cGUsIHJlc3BvbnNlLCByZXN1bHQsIGJ1aWxkZXIpKSxcclxuICAgICAgICAgICAgY2F0Y2hFcnJvcihlcnJvciA9PiBvYnNlcnZhYmxlVGhyb3dFcnJvcihlcnJvcikpLCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGNvdW50IHJlc291cmNlcyBnaXZlbiBhIHBhdGggKi9cclxuICAgIHB1YmxpYyBjb3VudChyZXNvdXJjZTogc3RyaW5nKTogT2JzZXJ2YWJsZTxudW1iZXI+IHtcclxuICAgICAgICBjb25zdCB1cmkgPSB0aGlzLmdldFJlc291cmNlVXJsKHJlc291cmNlKS5jb25jYXQoJy9zZWFyY2gvY291bnRBbGwnKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5nZXQodXJpLCB7aGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVycywgb2JzZXJ2ZTogJ2JvZHknfSkucGlwZShcclxuICAgICAgICAgICAgbWFwKChyZXNwb25zZTogUmVzcG9uc2UpID0+IE51bWJlcihyZXNwb25zZS5ib2R5KSksXHJcbiAgICAgICAgICAgIGNhdGNoRXJyb3IoZXJyb3IgPT4gb2JzZXJ2YWJsZVRocm93RXJyb3IoZXJyb3IpKSwpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBjcmVhdGUgcmVzb3VyY2UgZnJvbSBzZWxmIGxpbmsgYW5kIGVudGl0eSBkYXRhKi9cclxuICAgIHB1YmxpYyBjcmVhdGU8VCBleHRlbmRzIFJlc291cmNlPihzZWxmUmVzb3VyY2U6IHN0cmluZywgZW50aXR5OiBUKSB7XHJcbiAgICAgICAgY29uc3QgdXJpID0gUmVzb3VyY2VIZWxwZXIuZ2V0VVJMKCkgKyBzZWxmUmVzb3VyY2U7XHJcbiAgICAgICAgY29uc3QgcGF5bG9hZCA9IFJlc291cmNlSGVscGVyLnJlc29sdmVSZWxhdGlvbnMoZW50aXR5KTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRVcmxzUmVzb3VyY2UoZW50aXR5KTtcclxuICAgICAgICBsZXQgb2JzZXJ2YWJsZSA9IFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5wb3N0KHVyaSwgcGF5bG9hZCwge2hlYWRlcnM6IFJlc291cmNlSGVscGVyLmhlYWRlcnMsIG9ic2VydmU6ICdyZXNwb25zZSd9KTtcclxuICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZS5waXBlKG1hcCgocmVzcG9uc2U6IEh0dHBSZXNwb25zZTxzdHJpbmc+KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPj0gMjAwICYmIHJlc3BvbnNlLnN0YXR1cyA8PSAyMDcpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gUmVzb3VyY2VIZWxwZXIuaW5zdGFudGlhdGVSZXNvdXJjZShlbnRpdHksIHJlc3BvbnNlLmJvZHkpO1xyXG4gICAgICAgICAgICBlbHNlIGlmIChyZXNwb25zZS5zdGF0dXMgPT0gNTAwKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgYm9keTogYW55ID0gcmVzcG9uc2UuYm9keTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBvYnNlcnZhYmxlVGhyb3dFcnJvcihib2R5LmVycm9yKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pLGNhdGNoRXJyb3IoZXJyb3IgPT4gb2JzZXJ2YWJsZVRocm93RXJyb3IoZXJyb3IpKSwpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiB1cGRhdGUgcmVzb3VyY2UgZnJvbSBhIGdpdmVuIGVudGl0eSBkYXRhKi9cclxuICAgIHB1YmxpYyB1cGRhdGU8VCBleHRlbmRzIFJlc291cmNlPihlbnRpdHk6IFQpIHtcclxuICAgICAgICBjb25zdCB1cmkgPSBSZXNvdXJjZUhlbHBlci5nZXRQcm94eShlbnRpdHkuX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgICAgICAgY29uc3QgcGF5bG9hZCA9IFJlc291cmNlSGVscGVyLnJlc29sdmVSZWxhdGlvbnMoZW50aXR5KTtcclxuICAgICAgICB0aGlzLnNldFVybHNSZXNvdXJjZShlbnRpdHkpO1xyXG4gICAgICAgIGxldCBvYnNlcnZhYmxlID0gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLnB1dCh1cmksIHBheWxvYWQsIHtoZWFkZXJzOiBSZXNvdXJjZUhlbHBlci5oZWFkZXJzLCBvYnNlcnZlOiAncmVzcG9uc2UnfSk7XHJcbiAgICAgICAgcmV0dXJuIG9ic2VydmFibGUucGlwZShtYXAoKHJlc3BvbnNlOiBIdHRwUmVzcG9uc2U8c3RyaW5nPikgPT4ge1xyXG4gICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID49IDIwMCAmJiByZXNwb25zZS5zdGF0dXMgPD0gMjA3KVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLmluc3RhbnRpYXRlUmVzb3VyY2UoZW50aXR5LCByZXNwb25zZS5ib2R5KTtcclxuICAgICAgICAgICAgZWxzZSBpZiAocmVzcG9uc2Uuc3RhdHVzID09IDUwMCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGJvZHk6IGFueSA9IHJlc3BvbnNlLmJvZHk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZVRocm93RXJyb3IoYm9keS5lcnJvcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KSxjYXRjaEVycm9yKGVycm9yID0+IG9ic2VydmFibGVUaHJvd0Vycm9yKGVycm9yKSksKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogcGF0Y2ggcmVzb3VyY2UgZnJvbSBhIGdpdmVuIGVudGl0eSBkYXRhKi9cclxuICAgIHB1YmxpYyBwYXRjaDxUIGV4dGVuZHMgUmVzb3VyY2U+KGVudGl0eTogVCkge1xyXG4gICAgICAgIGNvbnN0IHVyaSA9IFJlc291cmNlSGVscGVyLmdldFByb3h5KGVudGl0eS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgICAgICBjb25zdCBwYXlsb2FkID0gUmVzb3VyY2VIZWxwZXIucmVzb2x2ZVJlbGF0aW9ucyhlbnRpdHkpO1xyXG4gICAgICAgIHRoaXMuc2V0VXJsc1Jlc291cmNlKGVudGl0eSk7XHJcbiAgICAgICAgbGV0IG9ic2VydmFibGUgPSBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkucGF0Y2godXJpLCBwYXlsb2FkLCB7aGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVycywgb2JzZXJ2ZTogJ3Jlc3BvbnNlJ30pO1xyXG4gICAgICAgIHJldHVybiBvYnNlcnZhYmxlLnBpcGUobWFwKChyZXNwb25zZTogSHR0cFJlc3BvbnNlPHN0cmluZz4pID0+IHtcclxuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA+PSAyMDAgJiYgcmVzcG9uc2Uuc3RhdHVzIDw9IDIwNylcclxuICAgICAgICAgICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5pbnN0YW50aWF0ZVJlc291cmNlKGVudGl0eSwgcmVzcG9uc2UuYm9keSk7XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PSA1MDApIHtcclxuICAgICAgICAgICAgICAgIGxldCBib2R5OiBhbnkgPSByZXNwb25zZS5ib2R5O1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG9ic2VydmFibGVUaHJvd0Vycm9yKGJvZHkuZXJyb3IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSksY2F0Y2hFcnJvcihlcnJvciA9PiBvYnNlcnZhYmxlVGhyb3dFcnJvcihlcnJvcikpLCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGRlbGV0ZSByZXNvdXJjZSBmcm9tIGEgZ2l2ZW4gZW50aXR5IGRhdGEqL1xyXG4gICAgcHVibGljIGRlbGV0ZTxUIGV4dGVuZHMgUmVzb3VyY2U+KGVudGl0eTogVCk6IE9ic2VydmFibGU8T2JqZWN0PiB7XHJcbiAgICAgICAgY29uc3QgdXJpID0gUmVzb3VyY2VIZWxwZXIuZ2V0UHJveHkoZW50aXR5Ll9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkuZGVsZXRlKHVyaSwge2hlYWRlcnM6IFJlc291cmNlSGVscGVyLmhlYWRlcnN9KS5waXBlKGNhdGNoRXJyb3IoZXJyb3IgPT4gb2JzZXJ2YWJsZVRocm93RXJyb3IoZXJyb3IpKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHdoZXRoZXIgYSByZXNvdXJjZSBhcnJheSBoYXMgbmV4dCBwYWdlIG9mIHJlc3VsdHMqL1xyXG4gICAgcHVibGljIGhhc05leHQ8VCBleHRlbmRzIFJlc291cmNlPihyZXNvdXJjZUFycmF5OiBSZXNvdXJjZUFycmF5PFQ+KTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHJlc291cmNlQXJyYXkubmV4dF91cmkgIT0gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiB3aGV0aGVyIGEgcmVzb3VyY2UgYXJyYXkgaGFzIHByZXZpb3VzIHBhZ2Ugb2YgcmVzdWx0cyovXHJcbiAgICBwdWJsaWMgaGFzUHJldjxUIGV4dGVuZHMgUmVzb3VyY2U+KHJlc291cmNlQXJyYXk6IFJlc291cmNlQXJyYXk8VD4pOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gcmVzb3VyY2VBcnJheS5wcmV2X3VyaSAhPSB1bmRlZmluZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHdoZXRoZXIgYSByZXNvdXJjZSBhcnJheSBoYXMgZmlyc3QgcGFnZSBvZiByZXN1bHRzKi9cclxuICAgIHB1YmxpYyBoYXNGaXJzdDxUIGV4dGVuZHMgUmVzb3VyY2U+KHJlc291cmNlQXJyYXk6IFJlc291cmNlQXJyYXk8VD4pOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gcmVzb3VyY2VBcnJheS5maXJzdF91cmkgIT0gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiB3aGV0aGVyIGEgcmVzb3VyY2UgYXJyYXkgaGFzIGxhc3QgcGFnZSBvZiByZXN1bHRzKi9cclxuICAgIHB1YmxpYyBoYXNMYXN0PFQgZXh0ZW5kcyBSZXNvdXJjZT4ocmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPik6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiByZXNvdXJjZUFycmF5Lmxhc3RfdXJpICE9IHVuZGVmaW5lZDtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHJlc291cmNlIGFycmF5IG5leHQgcGFnZSBvZiByZXN1bHRzKi9cclxuICAgIHB1YmxpYyBuZXh0PFQgZXh0ZW5kcyBSZXNvdXJjZT4ocmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPiwgdHlwZTogeyBuZXcoKTogVCB9KTogT2JzZXJ2YWJsZTxSZXNvdXJjZUFycmF5PFQ+PiB7XHJcbiAgICAgICAgcmV0dXJuIHJlc291cmNlQXJyYXkubmV4dCh0eXBlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHJlc291cmNlIGFycmF5IHByZXZpb3VzIHBhZ2Ugb2YgcmVzdWx0cyovXHJcbiAgICBwdWJsaWMgcHJldjxUIGV4dGVuZHMgUmVzb3VyY2U+KHJlc291cmNlQXJyYXk6IFJlc291cmNlQXJyYXk8VD4sIHR5cGU6IHsgbmV3KCk6IFQgfSk6IE9ic2VydmFibGU8UmVzb3VyY2VBcnJheTxUPj4ge1xyXG4gICAgICAgIHJldHVybiByZXNvdXJjZUFycmF5LnByZXYodHlwZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBhcnJheSBmaXJzdCBwYWdlIG9mIHJlc3VsdHMqL1xyXG4gICAgcHVibGljIGZpcnN0PFQgZXh0ZW5kcyBSZXNvdXJjZT4ocmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPiwgdHlwZTogeyBuZXcoKTogVCB9KTogT2JzZXJ2YWJsZTxSZXNvdXJjZUFycmF5PFQ+PiB7XHJcbiAgICAgICAgcmV0dXJuIHJlc291cmNlQXJyYXkuZmlyc3QodHlwZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBhcnJheSBsYXN0IHBhZ2Ugb2YgcmVzdWx0cyovXHJcbiAgICBwdWJsaWMgbGFzdDxUIGV4dGVuZHMgUmVzb3VyY2U+KHJlc291cmNlQXJyYXk6IFJlc291cmNlQXJyYXk8VD4sIHR5cGU6IHsgbmV3KCk6IFQgfSk6IE9ic2VydmFibGU8UmVzb3VyY2VBcnJheTxUPj4ge1xyXG4gICAgICAgIHJldHVybiByZXNvdXJjZUFycmF5Lmxhc3QodHlwZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBhcnJheSBwYWdlIG9mIHJlc3VsdHMgZ2l2ZW4gYSBwYWdlIG51bWJlciovXHJcbiAgICBwdWJsaWMgcGFnZTxUIGV4dGVuZHMgUmVzb3VyY2U+KHJlc291cmNlQXJyYXk6IFJlc291cmNlQXJyYXk8VD4sIHR5cGU6IHsgbmV3KCk6IFQgfSwgaWQ6IG51bWJlcik6IE9ic2VydmFibGU8UmVzb3VyY2VBcnJheTxUPj4ge1xyXG4gICAgICAgIHJldHVybiByZXNvdXJjZUFycmF5LnBhZ2UodHlwZSwgaWQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBzb3J0IHJlc291cmNlIGFycmF5IHdpdGggYSBnaXZlbiBzb3J0aW5nIHBhcmFtcyAqL1xyXG4gICAgcHVibGljIHNvcnRFbGVtZW50czxUIGV4dGVuZHMgUmVzb3VyY2U+KHJlc291cmNlQXJyYXk6IFJlc291cmNlQXJyYXk8VD4sIHR5cGU6IHsgbmV3KCk6IFQgfSwgLi4uc29ydDogU29ydFtdKTogT2JzZXJ2YWJsZTxSZXNvdXJjZUFycmF5PFQ+PiB7XHJcbiAgICAgICAgcmV0dXJuIHJlc291cmNlQXJyYXkuc29ydEVsZW1lbnRzKHR5cGUsIC4uLnNvcnQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgcmVzb3VyY2UgYXJyYXkgc2l6ZSovXHJcbiAgICBwdWJsaWMgc2l6ZTxUIGV4dGVuZHMgUmVzb3VyY2U+KHJlc291cmNlQXJyYXk6IFJlc291cmNlQXJyYXk8VD4sIHR5cGU6IHsgbmV3KCk6IFQgfSwgc2l6ZTogbnVtYmVyKTogT2JzZXJ2YWJsZTxSZXNvdXJjZUFycmF5PFQ+PiB7XHJcbiAgICAgICAgcmV0dXJuIHJlc291cmNlQXJyYXkuc2l6ZSh0eXBlLCBzaXplKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHJlc291cmNlIFVSTCBmcm9tIGEgZ2l2ZW4gcGF0aCovXHJcbiAgICBwdWJsaWMgZ2V0UmVzb3VyY2VVcmwocmVzb3VyY2U/OiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgIGxldCB1cmwgPSBSZXNvdXJjZVNlcnZpY2UuZ2V0VVJMKCk7XHJcbiAgICAgICAgaWYgKCF1cmwuZW5kc1dpdGgoJy8nKSkge1xyXG4gICAgICAgICAgICB1cmwgPSB1cmwuY29uY2F0KCcvJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChyZXNvdXJjZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdXJsLmNvbmNhdChyZXNvdXJjZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB1cmw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHNldCBwcm94eSBhbmQgcm9vdCB1cmxzIG9mIGdpdmVuIHJlc291cmNlIGFycmF5ICovXHJcbiAgICBwcml2YXRlIHNldFVybHM8VCBleHRlbmRzIFJlc291cmNlPihyZXN1bHQ6IFJlc291cmNlQXJyYXk8VD4pIHtcclxuICAgICAgICByZXN1bHQucHJveHlVcmwgPSB0aGlzLmV4dGVybmFsU2VydmljZS5nZXRQcm94eVVyaSgpO1xyXG4gICAgICAgIHJlc3VsdC5yb290VXJsID0gdGhpcy5leHRlcm5hbFNlcnZpY2UuZ2V0Um9vdFVyaSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBzZXQgcHJveHkgYW5kIHJvb3QgdXJscyBvZiBnaXZlbiByZXNvdXJjZSAqL1xyXG4gICAgcHJpdmF0ZSBzZXRVcmxzUmVzb3VyY2U8VCBleHRlbmRzIFJlc291cmNlPihyZXN1bHQ6IFQpIHtcclxuICAgICAgICByZXN1bHQucHJveHlVcmwgPSB0aGlzLmV4dGVybmFsU2VydmljZS5nZXRQcm94eVVyaSgpO1xyXG4gICAgICAgIHJlc3VsdC5yb290VXJsID0gdGhpcy5leHRlcm5hbFNlcnZpY2UuZ2V0Um9vdFVyaSgpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7b2YgYXMgb2JzZXJ2YWJsZU9mLCB0aHJvd0Vycm9yIGFzIG9ic2VydmFibGVUaHJvd0Vycm9yfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHttYXAsIG1lcmdlTWFwfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcbmltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4vcmVzb3VyY2UnO1xyXG5pbXBvcnQge1Jlc291cmNlQXJyYXl9IGZyb20gJy4vcmVzb3VyY2UtYXJyYXknO1xyXG5pbXBvcnQge1NvcnR9IGZyb20gJy4vc29ydCc7XHJcbmltcG9ydCB7UmVzb3VyY2VTZXJ2aWNlfSBmcm9tICcuL3Jlc291cmNlLnNlcnZpY2UnO1xyXG5pbXBvcnQge1N1YlR5cGVCdWlsZGVyfSBmcm9tICcuL3N1YnR5cGUtYnVpbGRlcic7XHJcbmltcG9ydCB7aXNOdWxsT3JVbmRlZmluZWR9IGZyb20gJ3V0aWwnO1xyXG5pbXBvcnQge09ic2VydmFibGV9IGZyb20gJ3J4anMvaW50ZXJuYWwvT2JzZXJ2YWJsZSc7XHJcbmltcG9ydCB7SW5qZWN0b3J9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XHJcblxyXG4vKiogSEFMIHBhcmFtIGRhdGEgbW9kZWwgKi9cclxuZXhwb3J0IHR5cGUgSGFsUGFyYW0gPSB7IGtleTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nIHwgbnVtYmVyIHwgYm9vbGVhbiB9O1xyXG4vKiogSEFMIG9wdGlvbiBkYXRhIG1vZGVsICovXHJcbmV4cG9ydCB0eXBlIEhhbE9wdGlvbnMgPSB7IG5vdFBhZ2VkPzogYm9vbGVhbiwgc2l6ZT86IG51bWJlciwgc29ydD86IFNvcnRbXSwgcGFyYW1zPzogSGFsUGFyYW1bXSB9O1xyXG5cclxuLyoqIFJFU1QgQVBJIGFjY2VzcyBpbnRlcmZhY2UgKi9cclxuZXhwb3J0IGNsYXNzIFJlc3RTZXJ2aWNlPFQgZXh0ZW5kcyBSZXNvdXJjZT4ge1xyXG4gICAgLyoqIHJlc291cmNlIHR5cGUgKi9cclxuICAgIHByaXZhdGUgdHlwZTogYW55O1xyXG4gICAgLyoqIHJlc291cmNlIHBhdGggKi9cclxuICAgIHByaXZhdGUgcmVzb3VyY2U6IHN0cmluZztcclxuICAgIC8qKiByZXNvdXJjZSBhcnJheSAqL1xyXG4gICAgcHVibGljIHJlc291cmNlQXJyYXk6IFJlc291cmNlQXJyYXk8VD47XHJcbiAgICAvKiogcmVzb3VyY2Ugc2VydmljZSAqL1xyXG4gICAgcHVibGljIHJlc291cmNlU2VydmljZTogUmVzb3VyY2VTZXJ2aWNlO1xyXG4gICAgLyoqIF9lbWJlZGRlZCBmaWVsZCBuYW1lICovXHJcbiAgICBwcml2YXRlIF9lbWJlZGRlZDogc3RyaW5nID0gJ19lbWJlZGRlZCc7XHJcblxyXG4gICAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgICBjb25zdHJ1Y3Rvcih0eXBlOiB7IG5ldygpOiBUIH0sXHJcbiAgICAgICAgICAgICAgICByZXNvdXJjZTogc3RyaW5nLFxyXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSBpbmplY3RvcjogSW5qZWN0b3IsXHJcbiAgICAgICAgICAgICAgICBfZW1iZWRkZWQ/OiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLnR5cGUgPSB0eXBlO1xyXG4gICAgICAgIHRoaXMucmVzb3VyY2UgPSByZXNvdXJjZTtcclxuICAgICAgICB0aGlzLnJlc291cmNlU2VydmljZSA9IGluamVjdG9yLmdldChSZXNvdXJjZVNlcnZpY2UpO1xyXG4gICAgICAgIGlmICghaXNOdWxsT3JVbmRlZmluZWQoX2VtYmVkZGVkKSlcclxuICAgICAgICAgICAgdGhpcy5fZW1iZWRkZWQgPSBfZW1iZWRkZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGVycm9yIGhhbmRsZXIgKi9cclxuICAgIHByb3RlY3RlZCBoYW5kbGVFcnJvcihlcnJvcjogYW55KTpPYnNlcnZhYmxlPG5ldmVyPiB7XHJcbiAgICAgICAgcmV0dXJuIFJlc3RTZXJ2aWNlLmhhbmRsZUVycm9yKGVycm9yKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZXJyb3IgaGFuZGxlciAqL1xyXG4gICAgcHJvdGVjdGVkIHN0YXRpYyBoYW5kbGVFcnJvcihlcnJvcjogYW55KTpPYnNlcnZhYmxlPG5ldmVyPiB7XHJcbiAgICAgICAgcmV0dXJuIG9ic2VydmFibGVUaHJvd0Vycm9yKGVycm9yKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IGFsbCByZXNvdXJjZXMgd2l0aCBvcHRpb25hbCBvcHRpb25zIGFuIHN1YlR5cGUgcGFyYW1zICovXHJcbiAgICBwdWJsaWMgZ2V0QWxsKG9wdGlvbnM/OiBIYWxPcHRpb25zLCBzdWJUeXBlPzogU3ViVHlwZUJ1aWxkZXIpOiBPYnNlcnZhYmxlPFRbXT4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5nZXRBbGwodGhpcy50eXBlLCB0aGlzLnJlc291cmNlLCB0aGlzLl9lbWJlZGRlZCwgb3B0aW9ucywgc3ViVHlwZSkucGlwZShcclxuICAgICAgICAgICAgbWVyZ2VNYXAoKHJlc291cmNlQXJyYXk6IFJlc291cmNlQXJyYXk8VD4pID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMubm90UGFnZWQgJiYgIWlzTnVsbE9yVW5kZWZpbmVkKHJlc291cmNlQXJyYXkuZmlyc3RfdXJpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMubm90UGFnZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLnNpemUgPSByZXNvdXJjZUFycmF5LnRvdGFsRWxlbWVudHM7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0QWxsKG9wdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlc291cmNlQXJyYXkgPSByZXNvdXJjZUFycmF5O1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvYnNlcnZhYmxlT2YocmVzb3VyY2VBcnJheS5yZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBmcm9tIGEgZ2l2ZW4gaWQgKi9cclxuICAgIHB1YmxpYyBnZXQoaWQ6IGFueSk6IE9ic2VydmFibGU8VD4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5nZXQodGhpcy50eXBlLCB0aGlzLnJlc291cmNlLCBpZCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBmcm9tIHNlbGYgbGluayAqL1xyXG4gICAgcHVibGljIGdldEJ5U2VsZkxpbmsoc2VsZkxpbms6IHN0cmluZyk6IE9ic2VydmFibGU8VD4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5nZXRCeVNlbGZMaW5rKHRoaXMudHlwZSwgc2VsZkxpbmspO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBzZWFyY2ggcmVzb3VyY2VzIGZyb20gYSBnaXZlbiBxdWVyeSBzdHJpbmcgYW5kIG9wdGlvbmFsIG9wdGlvbnMgcGFyYW1zICovXHJcbiAgICBwdWJsaWMgc2VhcmNoKHF1ZXJ5OiBzdHJpbmcsIG9wdGlvbnM/OiBIYWxPcHRpb25zKTogT2JzZXJ2YWJsZTxUW10+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZVNlcnZpY2Uuc2VhcmNoKHRoaXMudHlwZSwgcXVlcnksIHRoaXMucmVzb3VyY2UsIHRoaXMuX2VtYmVkZGVkLCBvcHRpb25zKS5waXBlKFxyXG4gICAgICAgICAgICBtZXJnZU1hcCgocmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPikgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5ub3RQYWdlZCAmJiAhaXNOdWxsT3JVbmRlZmluZWQocmVzb3VyY2VBcnJheS5maXJzdF91cmkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5ub3RQYWdlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuc2l6ZSA9IHJlc291cmNlQXJyYXkudG90YWxFbGVtZW50cztcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zZWFyY2gocXVlcnksIG9wdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlc291cmNlQXJyYXkgPSByZXNvdXJjZUFycmF5O1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvYnNlcnZhYmxlT2YocmVzb3VyY2VBcnJheS5yZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHNlYXJjaCByZXNvdXJjZSBmcm9tIGEgZ2l2ZW4gcXVlcnkgc3RyaW5nIGFuZCBvcHRpb25hbCBvcHRpb25zIHBhcmFtcyAqL1xyXG4gICAgcHVibGljIHNlYXJjaFNpbmdsZShxdWVyeTogc3RyaW5nLCBvcHRpb25zPzogSGFsT3B0aW9ucyk6IE9ic2VydmFibGU8VD4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5zZWFyY2hTaW5nbGUodGhpcy50eXBlLCBxdWVyeSwgdGhpcy5yZXNvdXJjZSwgb3B0aW9ucyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHNlYXJjaCByZXNvdXJjZXMgZnJvbSBhIGdpdmVuIGN1c3RvbSBxdWVyeSBzdHJpbmcgYW5kIG9wdGlvbmFsIG9wdGlvbnMgcGFyYW1zICovXHJcbiAgICBwdWJsaWMgY3VzdG9tUXVlcnkocXVlcnk6IHN0cmluZywgb3B0aW9ucz86IEhhbE9wdGlvbnMpOiBPYnNlcnZhYmxlPFRbXT4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5jdXN0b21RdWVyeSh0aGlzLnR5cGUsIHF1ZXJ5LCB0aGlzLnJlc291cmNlLCB0aGlzLl9lbWJlZGRlZCwgb3B0aW9ucykucGlwZShcclxuICAgICAgICAgICAgbWVyZ2VNYXAoKHJlc291cmNlQXJyYXk6IFJlc291cmNlQXJyYXk8VD4pID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMubm90UGFnZWQgJiYgIWlzTnVsbE9yVW5kZWZpbmVkKHJlc291cmNlQXJyYXkuZmlyc3RfdXJpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMubm90UGFnZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLnNpemUgPSByZXNvdXJjZUFycmF5LnRvdGFsRWxlbWVudHM7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3VzdG9tUXVlcnkocXVlcnksIG9wdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlc291cmNlQXJyYXkgPSByZXNvdXJjZUFycmF5O1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvYnNlcnZhYmxlT2YocmVzb3VyY2VBcnJheS5yZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KSk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKiBnZXQgcmVzb3VyY2UgYXJyYXkgZ2l2ZW4gYSByZWxhdGlvbiBsaW5rICovXHJcbiAgICBwdWJsaWMgZ2V0QnlSZWxhdGlvbkFycmF5KHJlbGF0aW9uOiBzdHJpbmcsIGJ1aWxkZXI/OiBTdWJUeXBlQnVpbGRlcik6IE9ic2VydmFibGU8VFtdPiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldEJ5UmVsYXRpb25BcnJheSh0aGlzLnR5cGUsIHJlbGF0aW9uLCB0aGlzLl9lbWJlZGRlZCwgYnVpbGRlcikucGlwZShcclxuICAgICAgICAgICAgbWFwKChyZXNvdXJjZUFycmF5OiBSZXNvdXJjZUFycmF5PFQ+KSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlc291cmNlQXJyYXkgPSByZXNvdXJjZUFycmF5O1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc291cmNlQXJyYXkucmVzdWx0O1xyXG4gICAgICAgICAgICB9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBnaXZlbiBhIHJlbGF0aW9uIGxpbmsgKi9cclxuICAgIHB1YmxpYyBnZXRCeVJlbGF0aW9uKHJlbGF0aW9uOiBzdHJpbmcpOiBPYnNlcnZhYmxlPFQ+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0QnlSZWxhdGlvbih0aGlzLnR5cGUsIHJlbGF0aW9uKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogY291bnQgcmVzb3VyY2VzIGdpdmVuIGEgcGF0aCAqL1xyXG4gICAgcHVibGljIGNvdW50KCk6IE9ic2VydmFibGU8bnVtYmVyPiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLmNvdW50KHRoaXMucmVzb3VyY2UpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBjcmVhdGUgcmVzb3VyY2UgZnJvbSBzZWxmIGxpbmsgYW5kIGVudGl0eSBkYXRhKi9cclxuICAgIHB1YmxpYyBjcmVhdGUoZW50aXR5OiBUKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLmNyZWF0ZSh0aGlzLnJlc291cmNlLCBlbnRpdHkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiB1cGRhdGUgcmVzb3VyY2UgZnJvbSBhIGdpdmVuIGVudGl0eSBkYXRhKi9cclxuICAgIHB1YmxpYyB1cGRhdGUoZW50aXR5OiBUKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLnVwZGF0ZShlbnRpdHkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBwYXRjaCByZXNvdXJjZSBmcm9tIGEgZ2l2ZW4gZW50aXR5IGRhdGEqL1xyXG4gICAgcHVibGljIHBhdGNoKGVudGl0eTogVCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5wYXRjaChlbnRpdHkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBkZWxldGUgcmVzb3VyY2UgZnJvbSBhIGdpdmVuIGVudGl0eSBkYXRhKi9cclxuICAgIHB1YmxpYyBkZWxldGUoZW50aXR5OiBUKTogT2JzZXJ2YWJsZTxPYmplY3Q+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZVNlcnZpY2UuZGVsZXRlKGVudGl0eSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCB0b3RhbCBudW1iZXIgb2YgZWxlbWVudHMgb2YgcmVzb3VyY2UgYXJyYXkgKi9cclxuICAgIHB1YmxpYyB0b3RhbEVsZW1lbnQoKTogbnVtYmVyIHtcclxuICAgICAgICBpZiAodGhpcy5yZXNvdXJjZUFycmF5ICYmIHRoaXMucmVzb3VyY2VBcnJheS50b3RhbEVsZW1lbnRzKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZUFycmF5LnRvdGFsRWxlbWVudHM7XHJcbiAgICAgICAgcmV0dXJuIDA7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHdoZXRoZXIgYSByZXNvdXJjZSBhcnJheSBoYXMgZmlyc3QgcGFnZSBvZiByZXN1bHRzKi9cclxuICAgIHB1YmxpYyBoYXNGaXJzdCgpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAodGhpcy5yZXNvdXJjZUFycmF5KVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZVNlcnZpY2UuaGFzRmlyc3QodGhpcy5yZXNvdXJjZUFycmF5KTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHdoZXRoZXIgYSByZXNvdXJjZSBhcnJheSBoYXMgbmV4dCBwYWdlIG9mIHJlc3VsdHMqL1xyXG4gICAgcHVibGljIGhhc05leHQoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKHRoaXMucmVzb3VyY2VBcnJheSlcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLmhhc05leHQodGhpcy5yZXNvdXJjZUFycmF5KTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHdoZXRoZXIgYSByZXNvdXJjZSBhcnJheSBoYXMgcHJldmlvdXMgcGFnZSBvZiByZXN1bHRzKi9cclxuICAgIHB1YmxpYyBoYXNQcmV2KCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICh0aGlzLnJlc291cmNlQXJyYXkpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5oYXNQcmV2KHRoaXMucmVzb3VyY2VBcnJheSk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiB3aGV0aGVyIGEgcmVzb3VyY2UgYXJyYXkgaGFzIGxhc3QgcGFnZSBvZiByZXN1bHRzKi9cclxuICAgIHB1YmxpYyBoYXNMYXN0KCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICh0aGlzLnJlc291cmNlQXJyYXkpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5oYXNMYXN0KHRoaXMucmVzb3VyY2VBcnJheSk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgcmVzb3VyY2UgYXJyYXkgbmV4dCBwYWdlIG9mIHJlc3VsdHMqL1xyXG4gICAgcHVibGljIG5leHQoKTogT2JzZXJ2YWJsZTxUW10+IHtcclxuICAgICAgICBpZiAodGhpcy5yZXNvdXJjZUFycmF5KVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZVNlcnZpY2UubmV4dCh0aGlzLnJlc291cmNlQXJyYXksIHRoaXMudHlwZSkucGlwZShcclxuICAgICAgICAgICAgICAgIG1hcCgocmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVzb3VyY2VBcnJheSA9IHJlc291cmNlQXJyYXk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc291cmNlQXJyYXkucmVzdWx0O1xyXG4gICAgICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgb2JzZXJ2YWJsZVRocm93RXJyb3IoJ25vIHJlc291cmNlQXJyYXkgZm91bmQnKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHJlc291cmNlIGFycmF5IHByZXZpb3VzIHBhZ2Ugb2YgcmVzdWx0cyovXHJcbiAgICBwdWJsaWMgcHJldigpOiBPYnNlcnZhYmxlPFRbXT4ge1xyXG4gICAgICAgIGlmICh0aGlzLnJlc291cmNlQXJyYXkpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5wcmV2KHRoaXMucmVzb3VyY2VBcnJheSwgdGhpcy50eXBlKS5waXBlKFxyXG4gICAgICAgICAgICAgICAgbWFwKChyZXNvdXJjZUFycmF5OiBSZXNvdXJjZUFycmF5PFQ+KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXNvdXJjZUFycmF5ID0gcmVzb3VyY2VBcnJheTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzb3VyY2VBcnJheS5yZXN1bHQ7XHJcbiAgICAgICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBvYnNlcnZhYmxlVGhyb3dFcnJvcignbm8gcmVzb3VyY2VBcnJheSBmb3VuZCcpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgcmVzb3VyY2UgYXJyYXkgZmlyc3QgcGFnZSBvZiByZXN1bHRzKi9cclxuICAgIHB1YmxpYyBmaXJzdCgpOiBPYnNlcnZhYmxlPFRbXT4ge1xyXG4gICAgICAgIGlmICh0aGlzLnJlc291cmNlQXJyYXkpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5maXJzdCh0aGlzLnJlc291cmNlQXJyYXksIHRoaXMudHlwZSlcclxuICAgICAgICAgICAgICAgIC5waXBlKFxyXG4gICAgICAgICAgICAgICAgICAgIG1hcCgocmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlc291cmNlQXJyYXkgPSByZXNvdXJjZUFycmF5O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzb3VyY2VBcnJheS5yZXN1bHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBvYnNlcnZhYmxlVGhyb3dFcnJvcignbm8gcmVzb3VyY2VBcnJheSBmb3VuZCcpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgcmVzb3VyY2UgYXJyYXkgbGFzdCBwYWdlIG9mIHJlc3VsdHMqL1xyXG4gICAgcHVibGljIGxhc3QoKTogT2JzZXJ2YWJsZTxUW10+IHtcclxuICAgICAgICBpZiAodGhpcy5yZXNvdXJjZUFycmF5KVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZVNlcnZpY2UubGFzdCh0aGlzLnJlc291cmNlQXJyYXksIHRoaXMudHlwZSlcclxuICAgICAgICAgICAgICAgIC5waXBlKFxyXG4gICAgICAgICAgICAgICAgICAgIG1hcCgocmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlc291cmNlQXJyYXkgPSByZXNvdXJjZUFycmF5O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzb3VyY2VBcnJheS5yZXN1bHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBvYnNlcnZhYmxlVGhyb3dFcnJvcignbm8gcmVzb3VyY2VBcnJheSBmb3VuZCcpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgcmVzb3VyY2UgYXJyYXkgcGFnZSBvZiByZXN1bHRzIGdpdmVuIGEgcGFnZSBudW1iZXIqL1xyXG4gICAgcHVibGljIHBhZ2UocGFnZU51bWJlcjogbnVtYmVyKTogT2JzZXJ2YWJsZTxUW10+IHtcclxuICAgICAgICBpZiAodGhpcy5yZXNvdXJjZUFycmF5KVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZVNlcnZpY2UucGFnZSh0aGlzLnJlc291cmNlQXJyYXksIHRoaXMudHlwZSwgcGFnZU51bWJlcikucGlwZShcclxuICAgICAgICAgICAgICAgIG1hcCgocmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVzb3VyY2VBcnJheSA9IHJlc291cmNlQXJyYXk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc291cmNlQXJyYXkucmVzdWx0O1xyXG4gICAgICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgb2JzZXJ2YWJsZVRocm93RXJyb3IoJ25vIHJlc291cmNlQXJyYXkgZm91bmQnKTtcclxuICAgIH1cclxufVxyXG4iLCJcclxuaW1wb3J0IHt0aHJvd0Vycm9yIGFzIG9ic2VydmFibGVUaHJvd0Vycm9yLCBvZiBhcyBvYnNlcnZhYmxlT2Z9IGZyb20gJ3J4anMnO1xyXG5cclxuaW1wb3J0IHttYXB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuXHJcblxyXG5pbXBvcnQge0h0dHBQYXJhbXN9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHtSZXNvdXJjZUhlbHBlcn0gZnJvbSAnLi9yZXNvdXJjZS1oZWxwZXInO1xyXG5pbXBvcnQge1Jlc291cmNlQXJyYXl9IGZyb20gJy4vcmVzb3VyY2UtYXJyYXknO1xyXG5pbXBvcnQge2lzTnVsbE9yVW5kZWZpbmVkfSBmcm9tICd1dGlsJztcclxuXHJcbmltcG9ydCB7SGFsT3B0aW9uc30gZnJvbSAnLi9yZXN0LnNlcnZpY2UnO1xyXG5pbXBvcnQge1N1YlR5cGVCdWlsZGVyfSBmcm9tICcuL3N1YnR5cGUtYnVpbGRlcic7XHJcbmltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7T2JzZXJ2YWJsZX0gZnJvbSAncnhqcy9pbnRlcm5hbC9PYnNlcnZhYmxlJztcclxuXHJcbi8qKiBBYnN0cmFjdCByZXNvdXJjZSBjbGFzcyovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFJlc291cmNlIHtcclxuXHJcbiAgICAvKiogcHJveHkgVVJMICovXHJcbiAgICBwdWJsaWMgcHJveHlVcmw6IHN0cmluZztcclxuICAgIC8qKiByb290IFVSTCAqL1xyXG4gICAgcHVibGljIHJvb3RVcmw6IHN0cmluZztcclxuXHJcbiAgICAvKiogbGlua3MgKi9cclxuICAgIHB1YmxpYyBfbGlua3M6IGFueTtcclxuICAgIC8qKiBzdWJ0eXBlcyAqL1xyXG4gICAgcHVibGljIF9zdWJ0eXBlczogTWFwPHN0cmluZywgYW55PjtcclxuXHJcbiAgICBcclxuICAgIC8qKiBnZXQgc3VidHlwZXMgKi8gICAgXHJcbiAgICBwdWJsaWMgZ2V0IHN1YnR5cGVzKCk6IE1hcDxzdHJpbmcsIGFueT4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zdWJ0eXBlcztcclxuICAgIH1cclxuXHJcbiAgICAvKiogc2V0IHN1YnR5cGVzICovXHJcbiAgICBwdWJsaWMgc2V0IHN1YnR5cGVzKF9zdWJ0eXBlczogTWFwPHN0cmluZywgYW55Pikge1xyXG4gICAgICAgIHRoaXMuX3N1YnR5cGVzID0gX3N1YnR5cGVzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBjb25zdHJ1Y3RvciovXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIH1cclxuXHJcbiAgICAvKiogR2V0IGNvbGxlY3Rpb24gb2YgcmVsYXRlZCByZXNvdXJjZXMgKi9cclxuICAgIHB1YmxpYyBnZXRSZWxhdGlvbkFycmF5PFQgZXh0ZW5kcyBSZXNvdXJjZT4odHlwZTogeyBuZXcoKTogVCB9LCByZWxhdGlvbjogc3RyaW5nLCBfZW1iZWRkZWQ/OiBzdHJpbmcsIG9wdGlvbnM/OiBIYWxPcHRpb25zLCBidWlsZGVyPzogU3ViVHlwZUJ1aWxkZXIpOiBPYnNlcnZhYmxlPFRbXT4ge1xyXG5cclxuICAgICAgICBjb25zdCBwYXJhbXMgPSBSZXNvdXJjZUhlbHBlci5vcHRpb25QYXJhbXMobmV3IEh0dHBQYXJhbXMoKSwgb3B0aW9ucyk7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0OiBSZXNvdXJjZUFycmF5PFQ+ID0gUmVzb3VyY2VIZWxwZXIuY3JlYXRlRW1wdHlSZXN1bHQ8VD4oaXNOdWxsT3JVbmRlZmluZWQoX2VtYmVkZGVkKSA/IFwiX2VtYmVkZGVkXCIgOiBfZW1iZWRkZWQpO1xyXG4gICAgICAgIGlmICghaXNOdWxsT3JVbmRlZmluZWQodGhpcy5fbGlua3MpICYmICFpc051bGxPclVuZGVmaW5lZCh0aGlzLl9saW5rc1tyZWxhdGlvbl0pKSB7XHJcbiAgICAgICAgICAgIGxldCBvYnNlcnZhYmxlID0gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLmdldChSZXNvdXJjZUhlbHBlci5nZXRQcm94eSh0aGlzLl9saW5rc1tyZWxhdGlvbl0uaHJlZiksIHtcclxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IFJlc291cmNlSGVscGVyLmhlYWRlcnMsXHJcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHBhcmFtc1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIG9ic2VydmFibGUucGlwZShtYXAocmVzcG9uc2UgPT4gUmVzb3VyY2VIZWxwZXIuaW5zdGFudGlhdGVSZXNvdXJjZUNvbGxlY3Rpb248VD4odHlwZSwgcmVzcG9uc2UsIHJlc3VsdCwgYnVpbGRlcikpLFxyXG4gICAgICAgICAgICAgICAgbWFwKChhcnJheTogUmVzb3VyY2VBcnJheTxUPikgPT4gYXJyYXkucmVzdWx0KSwpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBvYnNlcnZhYmxlT2YoW10pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKiogR2V0IHJlbGF0ZWQgcmVzb3VyY2UgKi9cclxuICAgIHB1YmxpYyBnZXRSZWxhdGlvbjxUIGV4dGVuZHMgUmVzb3VyY2U+KHR5cGU6IHsgbmV3KCk6IFQgfSwgcmVsYXRpb246IHN0cmluZywgYnVpbGRlcj86IFN1YlR5cGVCdWlsZGVyKTogT2JzZXJ2YWJsZTxUPiB7XHJcbiAgICAgICAgbGV0IHJlc3VsdDogVCA9IG5ldyB0eXBlKCk7XHJcbiAgICAgICAgaWYgKCFpc051bGxPclVuZGVmaW5lZCh0aGlzLl9saW5rcykgJiYgIWlzTnVsbE9yVW5kZWZpbmVkKHRoaXMuX2xpbmtzW3JlbGF0aW9uXSkpIHtcclxuICAgICAgICAgICAgbGV0IG9ic2VydmFibGUgPSBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkuZ2V0KFJlc291cmNlSGVscGVyLmdldFByb3h5KHRoaXMuX2xpbmtzW3JlbGF0aW9uXS5ocmVmKSwge2hlYWRlcnM6IFJlc291cmNlSGVscGVyLmhlYWRlcnN9KTtcclxuICAgICAgICAgICAgcmV0dXJuIG9ic2VydmFibGUucGlwZShtYXAoKGRhdGE6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGJ1aWxkZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGVtYmVkZGVkQ2xhc3NOYW1lIG9mIE9iamVjdC5rZXlzKGRhdGFbJ19saW5rcyddKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZW1iZWRkZWRDbGFzc05hbWUgPT0gJ3NlbGYnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgaHJlZjogc3RyaW5nID0gZGF0YS5fbGlua3NbZW1iZWRkZWRDbGFzc05hbWVdLmhyZWY7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgaWR4OiBudW1iZXIgPSBocmVmLmxhc3RJbmRleE9mKCcvJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVhbENsYXNzTmFtZSA9IGhyZWYucmVwbGFjZShSZXNvdXJjZUhlbHBlci5nZXRSb290VXJpKCksIFwiXCIpLnN1YnN0cmluZygwLCBpZHgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gUmVzb3VyY2VIZWxwZXIuc2VhcmNoU3VidHlwZXMoYnVpbGRlciwgcmVhbENsYXNzTmFtZSwgcmVzdWx0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLmluc3RhbnRpYXRlUmVzb3VyY2UocmVzdWx0LCBkYXRhKTtcclxuICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBvYnNlcnZhYmxlT2YobnVsbCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKiBBZGRzIHRoZSBnaXZlbiByZXNvdXJjZSB0byB0aGUgYm91bmQgY29sbGVjdGlvbiBieSB0aGUgcmVsYXRpb24gKi9cclxuICAgIHB1YmxpYyBhZGRSZWxhdGlvbjxUIGV4dGVuZHMgUmVzb3VyY2U+KHJlbGF0aW9uOiBzdHJpbmcsIHJlc291cmNlOiBUKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgICAgICBpZiAoIWlzTnVsbE9yVW5kZWZpbmVkKHRoaXMuX2xpbmtzKSAmJiAhaXNOdWxsT3JVbmRlZmluZWQodGhpcy5fbGlua3NbcmVsYXRpb25dKSkge1xyXG4gICAgICAgICAgICBsZXQgaGVhZGVyID0gUmVzb3VyY2VIZWxwZXIuaGVhZGVycy5hcHBlbmQoJ0NvbnRlbnQtVHlwZScsICd0ZXh0L3VyaS1saXN0Jyk7XHJcbiAgICAgICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkucG9zdChSZXNvdXJjZUhlbHBlci5nZXRQcm94eSh0aGlzLl9saW5rc1tyZWxhdGlvbl0uaHJlZiksIHJlc291cmNlLl9saW5rcy5zZWxmLmhyZWYsIHtoZWFkZXJzOiBoZWFkZXJ9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZVRocm93RXJyb3IoJ25vIHJlbGF0aW9uIGZvdW5kJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKiBCaW5kIHRoZSBnaXZlbiByZXNvdXJjZSB0byB0aGlzIHJlc291cmNlIGJ5IHRoZSBnaXZlbiByZWxhdGlvbiovXHJcbiAgICBwdWJsaWMgdXBkYXRlUmVsYXRpb248VCBleHRlbmRzIFJlc291cmNlPihyZWxhdGlvbjogc3RyaW5nLCByZXNvdXJjZTogVCk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICAgICAgaWYgKCFpc051bGxPclVuZGVmaW5lZCh0aGlzLl9saW5rcykgJiYgIWlzTnVsbE9yVW5kZWZpbmVkKHRoaXMuX2xpbmtzW3JlbGF0aW9uXSkpIHtcclxuICAgICAgICAgICAgbGV0IGhlYWRlciA9IFJlc291cmNlSGVscGVyLmhlYWRlcnMuYXBwZW5kKCdDb250ZW50LVR5cGUnLCAndGV4dC91cmktbGlzdCcpO1xyXG4gICAgICAgICAgICByZXR1cm4gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLnBhdGNoKFJlc291cmNlSGVscGVyLmdldFByb3h5KHRoaXMuX2xpbmtzW3JlbGF0aW9uXS5ocmVmKSwgcmVzb3VyY2UuX2xpbmtzLnNlbGYuaHJlZiwge2hlYWRlcnM6IGhlYWRlcn0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBvYnNlcnZhYmxlVGhyb3dFcnJvcignbm8gcmVsYXRpb24gZm91bmQnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEJpbmQgdGhlIGdpdmVuIHJlc291cmNlIHRvIHRoaXMgcmVzb3VyY2UgYnkgdGhlIGdpdmVuIHJlbGF0aW9uKi9cclxuICAgIHB1YmxpYyBzdWJzdGl0dXRlUmVsYXRpb248VCBleHRlbmRzIFJlc291cmNlPihyZWxhdGlvbjogc3RyaW5nLCByZXNvdXJjZTogVCk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICAgICAgaWYgKCFpc051bGxPclVuZGVmaW5lZCh0aGlzLl9saW5rcykgJiYgIWlzTnVsbE9yVW5kZWZpbmVkKHRoaXMuX2xpbmtzW3JlbGF0aW9uXSkpIHtcclxuICAgICAgICAgICAgbGV0IGhlYWRlciA9IFJlc291cmNlSGVscGVyLmhlYWRlcnMuYXBwZW5kKCdDb250ZW50LVR5cGUnLCAndGV4dC91cmktbGlzdCcpO1xyXG4gICAgICAgICAgICByZXR1cm4gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLnB1dChSZXNvdXJjZUhlbHBlci5nZXRQcm94eSh0aGlzLl9saW5rc1tyZWxhdGlvbl0uaHJlZiksIHJlc291cmNlLl9saW5rcy5zZWxmLmhyZWYsIHtoZWFkZXJzOiBoZWFkZXJ9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZVRocm93RXJyb3IoJ25vIHJlbGF0aW9uIGZvdW5kJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBcclxuICAgIC8qKiBCaW5kIHRoZSBnaXZlbiByZXNvdXJjZSB0byB0aGlzIHJlc291cmNlIGJ5IHRoZSBnaXZlbiByZWxhdGlvbiovXHJcbiAgICBwdWJsaWMgc3Vic3RpdHV0ZUFsbFJlbGF0aW9uPFQgZXh0ZW5kcyBSZXNvdXJjZT4ocmVsYXRpb246IHN0cmluZywgcmVzb3VyY2VzOiBSZXNvdXJjZVtdKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgICAgICBpZiAoIWlzTnVsbE9yVW5kZWZpbmVkKHRoaXMuX2xpbmtzKSAmJiAhaXNOdWxsT3JVbmRlZmluZWQodGhpcy5fbGlua3NbcmVsYXRpb25dKSkge1xyXG4gICAgICAgICAgICBsZXQgaGVhZGVyID0gUmVzb3VyY2VIZWxwZXIuaGVhZGVycy5hcHBlbmQoJ0NvbnRlbnQtVHlwZScsICd0ZXh0L3VyaS1saXN0Jyk7XHJcbiAgICAgICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkucHV0KFJlc291cmNlSGVscGVyLmdldFByb3h5KHRoaXMuX2xpbmtzW3JlbGF0aW9uXS5ocmVmKSwgcmVzb3VyY2VzLm1hcCgocmVzb3VyY2UpID0+IHJlc291cmNlLl9saW5rcy5zZWxmLmhyZWYpLCB7aGVhZGVyczogaGVhZGVyfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIG9ic2VydmFibGVUaHJvd0Vycm9yKCdubyByZWxhdGlvbiBmb3VuZCcpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIC8qKiBVbmJpbmQgdGhlIHJlc291cmNlIHdpdGggdGhlIGdpdmVuIHJlbGF0aW9uIGZyb20gdGhpcyByZXNvdXJjZSovXHJcbiAgICBwdWJsaWMgZGVsZXRlUmVsYXRpb248VCBleHRlbmRzIFJlc291cmNlPihyZWxhdGlvbjogc3RyaW5nLCByZXNvdXJjZTogVCk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICAgICAgaWYgKCFpc051bGxPclVuZGVmaW5lZCh0aGlzLl9saW5rcykgJiYgIWlzTnVsbE9yVW5kZWZpbmVkKHJlc291cmNlLl9saW5rcykpIHtcclxuICAgICAgICAgICAgbGV0IGxpbms6IHN0cmluZyA9IHJlc291cmNlLl9saW5rc1snc2VsZiddLmhyZWY7XHJcbiAgICAgICAgICAgIGxldCBpZHg6IG51bWJlciA9IGxpbmsubGFzdEluZGV4T2YoJy8nKSArIDE7XHJcblxyXG4gICAgICAgICAgICBpZiAoaWR4ID09IC0xKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG9ic2VydmFibGVUaHJvd0Vycm9yKCdubyByZWxhdGlvbiBmb3VuZCcpO1xyXG5cclxuICAgICAgICAgICAgbGV0IHJlbGF0aW9uSWQ6IHN0cmluZyA9IGxpbmsuc3Vic3RyaW5nKGlkeCk7XHJcbiAgICAgICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkuZGVsZXRlKFJlc291cmNlSGVscGVyLmdldFByb3h5KHRoaXMuX2xpbmtzW3JlbGF0aW9uXS5ocmVmICsgJy8nICsgcmVsYXRpb25JZCksIHtoZWFkZXJzOiBSZXNvdXJjZUhlbHBlci5oZWFkZXJzfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIG9ic2VydmFibGVUaHJvd0Vycm9yKCdubyByZWxhdGlvbiBmb3VuZCcpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoqIFVuYmluZCB0aGUgcmVzb3VyY2Ugd2l0aCB0aGUgZ2l2ZW4gcmVsYXRpb24gZnJvbSB0aGlzIHJlc291cmNlKi9cclxuICAgIHB1YmxpYyBkZWxldGVBbGxSZWxhdGlvbjxUIGV4dGVuZHMgUmVzb3VyY2U+KHJlbGF0aW9uOiBzdHJpbmcpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkuZGVsZXRlKFJlc291cmNlSGVscGVyLmdldFByb3h5KHRoaXMuX2xpbmtzW3JlbGF0aW9uXS5ocmVmICksIHtoZWFkZXJzOiBSZXNvdXJjZUhlbHBlci5oZWFkZXJzfSk7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG59IiwiaW1wb3J0IHtNb2R1bGVXaXRoUHJvdmlkZXJzLCBOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7SHR0cENsaWVudCwgSHR0cENsaWVudE1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQge0hhbFBhcmFtLCBSZXN0U2VydmljZX0gZnJvbSAnLi9yZXN0LnNlcnZpY2UnO1xyXG5pbXBvcnQge0V4dGVybmFsU2VydmljZX0gZnJvbSAnLi9leHRlcm5hbC5zZXJ2aWNlJztcclxuaW1wb3J0IHtSZXNvdXJjZVNlcnZpY2V9IGZyb20gJy4vcmVzb3VyY2Uuc2VydmljZSc7XHJcbmltcG9ydCB7RXh0ZXJuYWxDb25maWd1cmF0aW9uSGFuZGxlckludGVyZmFjZX0gZnJvbSAnLi9leHRlcm5hbC1jb25maWd1cmF0aW9uLmhhbmRsZXInO1xyXG5cclxuaW1wb3J0ICdyeGpzJztcclxuaW1wb3J0ICdyeGpzL2FkZC9vYnNlcnZhYmxlL2NvbmNhdCc7XHJcbmltcG9ydCAncnhqcy9hZGQvb2JzZXJ2YWJsZS9kZWZlcic7XHJcbmltcG9ydCAncnhqcy9hZGQvb2JzZXJ2YWJsZS9lbXB0eSc7XHJcbmltcG9ydCAncnhqcy9hZGQvb2JzZXJ2YWJsZS9mcm9tJztcclxuaW1wb3J0ICdyeGpzL2FkZC9vYnNlcnZhYmxlL2Zyb21FdmVudCc7XHJcbmltcG9ydCAncnhqcy9hZGQvb2JzZXJ2YWJsZS9tZXJnZSc7XHJcbmltcG9ydCAncnhqcy9hZGQvb2JzZXJ2YWJsZS9vZic7XHJcbmltcG9ydCAncnhqcy9hZGQvb2JzZXJ2YWJsZS90aW1lcic7XHJcbmltcG9ydCAncnhqcy9hZGQvb3BlcmF0b3IvY29uY2F0TWFwJztcclxuaW1wb3J0ICdyeGpzL2FkZC9vcGVyYXRvci9kbyc7XHJcbmltcG9ydCAncnhqcy9hZGQvb3BlcmF0b3IvZXhwYW5kJztcclxuaW1wb3J0ICdyeGpzL2FkZC9vcGVyYXRvci9maWx0ZXInO1xyXG5pbXBvcnQgJ3J4anMvYWRkL29wZXJhdG9yL2ZpcnN0JztcclxuaW1wb3J0ICdyeGpzL2FkZC9vcGVyYXRvci9sZXQnO1xyXG5pbXBvcnQgJ3J4anMvYWRkL29wZXJhdG9yL21hcCc7XHJcbmltcG9ydCAncnhqcy9hZGQvb3BlcmF0b3IvbWVyZ2VNYXAnO1xyXG5pbXBvcnQgJ3J4anMvYWRkL29wZXJhdG9yL3B1Ymxpc2hSZXBsYXknO1xyXG5pbXBvcnQgJ3J4anMvYWRkL29wZXJhdG9yL3JlZHVjZSc7XHJcbmltcG9ydCAncnhqcy9hZGQvb3BlcmF0b3Ivc2hhcmUnO1xyXG5pbXBvcnQgJ3J4anMvYWRkL29wZXJhdG9yL3N3aXRjaE1hcCc7XHJcbmltcG9ydCAncnhqcy9hZGQvb3BlcmF0b3IvdGFrZSc7XHJcbmltcG9ydCAncnhqcy9hZGQvb3BlcmF0b3IvdGFrZVdoaWxlJztcclxuaW1wb3J0ICdyeGpzL2FkZC9vYnNlcnZhYmxlL3Rocm93JztcclxuaW1wb3J0ICdyeGpzL2FkZC9vcGVyYXRvci9jYXRjaCc7XHJcbmltcG9ydCB7U3ViVHlwZUJ1aWxkZXJ9IGZyb20gJy4vc3VidHlwZS1idWlsZGVyJztcclxuXHJcbmV4cG9ydCB7RXh0ZXJuYWxTZXJ2aWNlfSBmcm9tICcuL2V4dGVybmFsLnNlcnZpY2UnO1xyXG5leHBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuL3Jlc3Quc2VydmljZSc7XHJcbmV4cG9ydCB7UmVzb3VyY2V9IGZyb20gJy4vcmVzb3VyY2UnO1xyXG5leHBvcnQge1Jlc291cmNlQXJyYXl9IGZyb20gJy4vcmVzb3VyY2UtYXJyYXknO1xyXG5leHBvcnQge1NvcnR9IGZyb20gJy4vc29ydCc7XHJcbmV4cG9ydCB7UmVzb3VyY2VIZWxwZXJ9IGZyb20gJy4vcmVzb3VyY2UtaGVscGVyJztcclxuZXhwb3J0IHtFeHRlcm5hbENvbmZpZ3VyYXRpb259IGZyb20gJy4vRXh0ZXJuYWxDb25maWd1cmF0aW9uJztcclxuZXhwb3J0IHtFeHRlcm5hbENvbmZpZ3VyYXRpb25IYW5kbGVySW50ZXJmYWNlfSBmcm9tICcuL2V4dGVybmFsLWNvbmZpZ3VyYXRpb24uaGFuZGxlcic7XHJcbmV4cG9ydCB7SGFsT3B0aW9ucywgSGFsUGFyYW19IGZyb20gJy4vcmVzdC5zZXJ2aWNlJztcclxuZXhwb3J0IHtTdWJUeXBlQnVpbGRlcn0gZnJvbSAnLi9zdWJ0eXBlLWJ1aWxkZXInO1xyXG5cclxuXHJcbi8qKiBBbmd1bGFyIEhBTCBtb2R1bGUgKi9cclxuQE5nTW9kdWxlKHtcclxuICAgIGltcG9ydHM6IFtIdHRwQ2xpZW50TW9kdWxlXSxcclxuICAgIGRlY2xhcmF0aW9uczogW10sXHJcbiAgICBleHBvcnRzOiBbSHR0cENsaWVudE1vZHVsZV0sXHJcbiAgICBwcm92aWRlcnM6IFtcclxuICAgICAgICBFeHRlcm5hbFNlcnZpY2UsXHJcbiAgICAgICAgSHR0cENsaWVudCxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHByb3ZpZGU6IFJlc291cmNlU2VydmljZSxcclxuICAgICAgICAgICAgdXNlQ2xhc3M6IFJlc291cmNlU2VydmljZSxcclxuICAgICAgICAgICAgZGVwczogW0V4dGVybmFsU2VydmljZV1cclxuICAgICAgICB9XVxyXG59KVxyXG5leHBvcnQgY2xhc3MgQW5ndWxhckhhbE1vZHVsZSB7XHJcbiAgICBzdGF0aWMgZm9yUm9vdCgpOiBNb2R1bGVXaXRoUHJvdmlkZXJzIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBuZ01vZHVsZTogQW5ndWxhckhhbE1vZHVsZSxcclxuICAgICAgICAgICAgcHJvdmlkZXJzOiBbXHJcbiAgICAgICAgICAgICAgICBFeHRlcm5hbFNlcnZpY2UsXHJcbiAgICAgICAgICAgICAgICBIdHRwQ2xpZW50LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHByb3ZpZGU6IFJlc291cmNlU2VydmljZSxcclxuICAgICAgICAgICAgICAgICAgICB1c2VDbGFzczogUmVzb3VyY2VTZXJ2aWNlLFxyXG4gICAgICAgICAgICAgICAgICAgIGRlcHM6IFtFeHRlcm5hbFNlcnZpY2VdXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59Il0sIm5hbWVzIjpbIm9ic2VydmFibGVUaHJvd0Vycm9yIiwidXJsLnBhcnNlIiwidHNsaWJfMS5fX3ZhbHVlcyIsIm9ic2VydmFibGVPZiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFZQTs7Ozs7O0FBQUE7Ozs7Ozs2QkF1QjJCLENBQUM7Ozs7MEJBRUosQ0FBQzs7OzswQkFHRCxDQUFDOzs7O3NCQU1BLEVBQUU7Ozs7b0JBR2hCLFVBQUMsRUFBSztZQUNULEtBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQ3hCOzs7O3NCQUdRO1lBQ0wsT0FBTyxLQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztTQUM3Qjs7OztvQkFHYyxVQUFDLElBQWtCLEVBQUUsUUFBYSxFQUFFLFFBQWdCOztZQUMvRCxJQUFNLE1BQU0sR0FBcUIsY0FBYyxDQUFDLGlCQUFpQixDQUFJLEtBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUNyRixNQUFNLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztZQUMzQixjQUFjLENBQUMsNkJBQTZCLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUNyRSxPQUFPLE1BQU0sQ0FBQztTQUNqQjs7OztvQkFHTSxVQUFDLElBQWtCO1lBQ3RCLElBQUksS0FBSSxDQUFDLFFBQVEsRUFBRTtnQkFDZixPQUFPLGNBQWMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxLQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBQyxPQUFPLEVBQUUsY0FBYyxDQUFDLE9BQU8sRUFBQyxDQUFDLENBQUMsSUFBSSxDQUMvRyxHQUFHLENBQUMsVUFBQSxRQUFRLElBQUksT0FBQSxLQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsS0FBSSxDQUFDLFFBQVEsQ0FBQyxHQUFBLENBQUMsRUFDekQsVUFBVSxDQUFDLFVBQUEsS0FBSyxJQUFJLE9BQUFBLFVBQW9CLENBQUMsS0FBSyxDQUFDLEdBQUEsQ0FBQyxDQUFFLENBQUM7YUFDMUQ7WUFDRCxPQUFPQSxVQUFvQixDQUFDLGlCQUFpQixDQUFDLENBQUM7U0FDbEQ7Ozs7b0JBR00sVUFBQyxJQUFrQjtZQUN0QixJQUFJLEtBQUksQ0FBQyxRQUFRLEVBQUU7Z0JBQ2YsT0FBTyxjQUFjLENBQUMsT0FBTyxFQUFFLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsS0FBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUMsT0FBTyxFQUFFLGNBQWMsQ0FBQyxPQUFPLEVBQUMsQ0FBQyxDQUFDLElBQUksQ0FDL0csR0FBRyxDQUFDLFVBQUEsUUFBUSxJQUFJLE9BQUEsS0FBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLEtBQUksQ0FBQyxRQUFRLENBQUMsR0FBQSxDQUFDLEVBQ3pELFVBQVUsQ0FBQyxVQUFBLEtBQUssSUFBSSxPQUFBQSxVQUFvQixDQUFDLEtBQUssQ0FBQyxHQUFBLENBQUMsQ0FBRSxDQUFDO2FBQzFEO1lBQ0QsT0FBT0EsVUFBb0IsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1NBQ2xEOzs7O3FCQUdPLFVBQUMsSUFBa0I7WUFDdkIsSUFBSSxLQUFJLENBQUMsU0FBUyxFQUFFO2dCQUNoQixPQUFPLGNBQWMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxLQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsRUFBQyxPQUFPLEVBQUUsY0FBYyxDQUFDLE9BQU8sRUFBQyxDQUFDLENBQUMsSUFBSSxDQUNoSCxHQUFHLENBQUMsVUFBQSxRQUFRLElBQUksT0FBQSxLQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsS0FBSSxDQUFDLFFBQVEsQ0FBQyxHQUFBLENBQUMsRUFDekQsVUFBVSxDQUFDLFVBQUEsS0FBSyxJQUFJLE9BQUFBLFVBQW9CLENBQUMsS0FBSyxDQUFDLEdBQUEsQ0FBQyxDQUFFLENBQUM7YUFDMUQ7WUFDRCxPQUFPQSxVQUFvQixDQUFDLGtCQUFrQixDQUFDLENBQUM7U0FDbkQ7Ozs7b0JBR00sVUFBQyxJQUFrQjtZQUN0QixJQUFJLEtBQUksQ0FBQyxRQUFRLEVBQUU7Z0JBQ2YsT0FBTyxjQUFjLENBQUMsT0FBTyxFQUFFLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsS0FBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUMsT0FBTyxFQUFFLGNBQWMsQ0FBQyxPQUFPLEVBQUMsQ0FBQyxDQUFDLElBQUksQ0FDL0csR0FBRyxDQUFDLFVBQUEsUUFBUSxJQUFJLE9BQUEsS0FBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLEtBQUksQ0FBQyxRQUFRLENBQUMsR0FBQSxDQUFDLEVBQ3pELFVBQVUsQ0FBQyxVQUFBLEtBQUssSUFBSSxPQUFBQSxVQUFvQixDQUFDLEtBQUssQ0FBQyxHQUFBLENBQUMsQ0FBRSxDQUFDO2FBQzFEO1lBQ0QsT0FBT0EsVUFBb0IsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1NBQ2xEOzs7O29CQUdNLFVBQUMsSUFBa0IsRUFBRSxVQUFrQjtZQUMxQyxLQUFJLENBQUMsUUFBUSxHQUFHLEtBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLG1CQUFtQixFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQy9ELEtBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDOztZQUNyRCxJQUFJLFNBQVMsR0FBR0MsS0FBUyxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsS0FBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7O1lBQ2xFLElBQUksS0FBSyxHQUFXLGFBQWEsQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsS0FBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1lBQ2xHLEtBQUssR0FBRyxhQUFhLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7O1lBR3pFLElBQUksR0FBRyxHQUFHLFNBQVMsQ0FBQyxLQUFLO2dCQUNyQixjQUFjLENBQUMsUUFBUSxDQUFDLEtBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsR0FBRyxjQUFjLENBQUMsUUFBUSxDQUFDLEtBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDbEksR0FBRyxHQUFHLEtBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDNUIsT0FBTyxjQUFjLENBQUMsT0FBTyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxjQUFjLENBQUMsT0FBTyxFQUFDLENBQUMsQ0FBQyxJQUFJLENBQzVFLEdBQUcsQ0FBQyxVQUFBLFFBQVEsSUFBSSxPQUFBLEtBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxLQUFJLENBQUMsUUFBUSxDQUFDLEdBQUEsQ0FBQyxFQUN6RCxVQUFVLENBQUMsVUFBQSxLQUFLLElBQUksT0FBQUQsVUFBb0IsQ0FBQyxLQUFLLENBQUMsR0FBQSxDQUFDLENBQUUsQ0FBQztTQUMxRDs7Ozs0QkFHYyxVQUFDLElBQWtCO1lBQUUsY0FBZTtpQkFBZixVQUFlLEVBQWYscUJBQWUsRUFBZixJQUFlO2dCQUFmLDZCQUFlOztZQUMvQyxLQUFJLENBQUMsUUFBUSxHQUFHLEtBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLG1CQUFtQixFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQy9ELEtBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDOztZQUNyRCxJQUFJLEdBQUcsR0FBRyxjQUFjLENBQUMsUUFBUSxDQUFDLEtBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLE9BQU8sRUFBRSxLQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxFQUFFLFFBQVEsRUFBRSxLQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7WUFDdEksR0FBRyxHQUFHLEtBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDNUIsT0FBTyxjQUFjLENBQUMsT0FBTyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxjQUFjLENBQUMsT0FBTyxFQUFDLENBQUMsQ0FBQyxJQUFJLENBQzVFLEdBQUcsQ0FBQyxVQUFBLFFBQVEsSUFBSSxPQUFBLEtBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsR0FBQSxDQUFDLEVBQ2hELFVBQVUsQ0FBQyxVQUFBLEtBQUssSUFBSSxPQUFBQSxVQUFvQixDQUFDLEtBQUssQ0FBQyxHQUFBLENBQUMsQ0FBRSxDQUFDO1NBQzFEOzs7O29CQUdNLFVBQUMsSUFBa0IsRUFBRSxJQUFZOztZQUNwQyxJQUFJLEdBQUcsR0FBRyxjQUFjLENBQUMsUUFBUSxDQUFDLEtBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztZQUN2RixHQUFHLEdBQUcsS0FBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUM1QixPQUFPLGNBQWMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLGNBQWMsQ0FBQyxPQUFPLEVBQUMsQ0FBQyxDQUFDLElBQUksQ0FDNUUsR0FBRyxDQUFDLFVBQUEsUUFBUSxJQUFJLE9BQUEsS0FBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLEtBQUksQ0FBQyxRQUFRLENBQUMsR0FBQSxDQUFDLEVBQ3pELFVBQVUsQ0FBQyxVQUFBLEtBQUssSUFBSSxPQUFBQSxVQUFvQixDQUFDLEtBQUssQ0FBQyxHQUFBLENBQUMsQ0FBRSxDQUFDO1NBQzFEOzs7Ozs7O0lBR08sbUNBQVc7Ozs7O2NBQUMsR0FBVztRQUMzQixJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7O2dCQUNmLEtBQW1CLElBQUEsS0FBQUUsU0FBQSxJQUFJLENBQUMsUUFBUSxDQUFBLGdCQUFBO29CQUEzQixJQUFNLElBQUksV0FBQTtvQkFDWCxHQUFHLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2lCQUMxRDs7Ozs7Ozs7O1NBQ0o7UUFDRCxPQUFPLEdBQUcsQ0FBQzs7Ozs7Ozs7OztJQUlBLDBCQUFZOzs7Ozs7O2NBQUMsS0FBYSxFQUFFLEtBQWEsRUFBRSxLQUFhO1FBQ25FLElBQUksS0FBSyxFQUFFOztZQUNQLElBQUksR0FBRyxHQUFXLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7O1lBQ3ZDLElBQUksVUFBVSxHQUFXLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBRTNHLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQyxFQUFFOztnQkFDWCxJQUFJLFVBQVUsR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztnQkFDbEQsS0FBSyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLENBQUM7YUFDMUQ7aUJBQU07Z0JBQ0gsS0FBSyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLENBQUM7YUFDbkQ7U0FDSjthQUFNO1lBQ0gsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQztTQUNyQztRQUNELE9BQU8sS0FBSyxDQUFDOzt3QkF4S3JCO0lBMEtDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQ3pJVSwyQkFBWTs7Ozs7O0lBQW5CLFVBQW9CLE1BQWtCLEVBQUUsT0FBb0I7UUFDeEQsSUFBSSxPQUFPLEVBQUU7WUFFVCxJQUFJLE9BQU8sQ0FBQyxNQUFNLEVBQUU7O29CQUNoQixLQUFvQixJQUFBLEtBQUFBLFNBQUEsT0FBTyxDQUFDLE1BQU0sQ0FBQSxnQkFBQTt3QkFBN0IsSUFBTSxLQUFLLFdBQUE7d0JBQ1osTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7cUJBQzdEOzs7Ozs7Ozs7YUFDSjtZQUVELElBQUksT0FBTyxDQUFDLElBQUksRUFBRTtnQkFDZCxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO2FBQzNEO1lBRUQsSUFBSSxPQUFPLENBQUMsSUFBSSxFQUFFOztvQkFDZCxLQUFnQixJQUFBLEtBQUFBLFNBQUEsT0FBTyxDQUFDLElBQUksQ0FBQSxnQkFBQTt3QkFBdkIsSUFBTSxDQUFDLFdBQUE7O3dCQUNSLElBQUksVUFBVSxHQUFHLEVBQUUsQ0FBQzt3QkFDcEIsVUFBVSxHQUFHLENBQUMsQ0FBQyxJQUFJLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsVUFBVSxDQUFDO3dCQUM3RCxVQUFVLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsVUFBVSxDQUFDO3dCQUMzRSxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLENBQUM7cUJBQzlDOzs7Ozs7Ozs7YUFDSjtTQUVKO1FBQ0QsT0FBTyxNQUFNLENBQUM7O0tBQ2pCOzs7Ozs7O0lBR00sK0JBQWdCOzs7OztJQUF2QixVQUF3QixRQUFrQjtRQUExQyxpQkEyQkM7O1FBMUJHLElBQU0sTUFBTSxHQUFRLEVBQUUsQ0FBQztnQ0FDWixHQUFHO1lBQ1YsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFO2dCQUNuQyxJQUFJLGNBQWMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO3FCQUN0QyxJQUFJLENBQUMsVUFBQyxTQUFpQixJQUFLLE9BQUEsU0FBUyxJQUFJLFVBQVUsR0FBQSxDQUFDLEVBQUU7b0JBQ3ZELElBQUksUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQzt3QkFDdkIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztpQkFDN0Q7cUJBQU0sSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFOztvQkFDckMsSUFBSSxLQUFLLEdBQVUsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUNqQyxJQUFJLEtBQUssRUFBRTt3QkFDUCxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxLQUFLLEVBQUUsQ0FBQzt3QkFDMUIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFDLE9BQU87NEJBQ2xCLElBQUksV0FBVyxDQUFDLE9BQU8sQ0FBQyxFQUFFO2dDQUN0QixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDOzZCQUM3QjtpQ0FDSTtnQ0FDRCxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDOzZCQUNwRDt5QkFDSixDQUFDLENBQUM7cUJBQ047aUJBQ0o7cUJBQU07b0JBQ0gsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztpQkFDL0I7YUFDSjs7UUF0QkwsS0FBSyxJQUFNLEdBQUcsSUFBSSxRQUFRO29CQUFmLEdBQUc7U0F1QmI7UUFDRCx5QkFBTyxNQUFnQixFQUFDO0tBQzNCOzs7Ozs7OztJQUdNLGdDQUFpQjs7Ozs7O0lBQXhCLFVBQTZDLFNBQWlCOztRQUMxRCxJQUFJLGFBQWEsR0FBcUIsSUFBSSxhQUFhLEVBQUssQ0FBQztRQUM3RCxhQUFhLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztRQUNwQyxPQUFPLGFBQWEsQ0FBQztLQUN4Qjs7Ozs7OztJQUdNLDJCQUFZOzs7OztJQUFuQixVQUFvQixHQUFROztRQUN4QixJQUFJLGFBQWEsR0FBRyxrQkFBa0IsQ0FBQzs7UUFDdkMsSUFBSSxPQUFPLEdBQUcsQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUMvRCxPQUFPLENBQUMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7S0FDNUQ7Ozs7Ozs7SUFJTSx3QkFBUzs7Ozs7SUFBaEIsVUFBaUIsUUFBYTs7UUFDMUIsSUFBSSxVQUFVLEdBQUcsRUFBRSxDQUFDOztRQUNwQixJQUFJLEdBQUcsR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxDQUFDOztRQUMxQyxJQUFJLFNBQVMsQ0FBUztRQUV0QixPQUFPLENBQUMsU0FBUyxHQUFHLGNBQWMsQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLE1BQU0sUUFBUSxFQUFFO1lBQ2hFLFVBQVUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDM0IsR0FBRyxHQUFHLE1BQU0sQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDcEM7UUFFRCxPQUFPLFVBQVUsQ0FBQztLQUNyQjs7Ozs7Ozs7Ozs7SUFHTSw0Q0FBNkI7Ozs7Ozs7OztJQUFwQyxVQUF5RCxJQUFrQixFQUFFLE9BQVksRUFDaEMsTUFBd0IsRUFBRSxPQUF3Qjs7WUFDdkcsS0FBZ0MsSUFBQSxLQUFBQSxTQUFBLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFBLGdCQUFBO2dCQUFqRSxJQUFNLGlCQUFpQixXQUFBOztnQkFDeEIsSUFBSSxRQUFRLEdBQVEsT0FBTyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQzs7Z0JBQzlDLElBQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDOztvQkFDMUMsS0FBaUIsSUFBQSxVQUFBQSxTQUFBLEtBQUssQ0FBQSw0QkFBQTt3QkFBakIsSUFBSSxJQUFJLGtCQUFBOzt3QkFDVCxJQUFJLFFBQVEsR0FBTSxJQUFJLElBQUksRUFBRSxDQUFDO3dCQUM3QixRQUFRLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsUUFBUSxDQUFDLENBQUM7d0JBRXJFLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7d0JBQ3pDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7cUJBQ3pCOzs7Ozs7Ozs7YUFDSjs7Ozs7Ozs7O1FBRUQsTUFBTSxDQUFDLGFBQWEsR0FBRyxPQUFPLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDakYsTUFBTSxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQztRQUMvRCxNQUFNLENBQUMsVUFBVSxHQUFHLE9BQU8sQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQzNELE1BQU0sQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7UUFFeEQsTUFBTSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsTUFBTSxJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxTQUFTLENBQUM7UUFDL0YsTUFBTSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsTUFBTSxJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxTQUFTLENBQUM7UUFDL0YsTUFBTSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsTUFBTSxJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxTQUFTLENBQUM7UUFDL0YsTUFBTSxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUMsTUFBTSxJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxTQUFTLENBQUM7UUFDbEcsTUFBTSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsTUFBTSxJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FB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