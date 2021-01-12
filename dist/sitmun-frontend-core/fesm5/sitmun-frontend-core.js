import { __extends, __spread, __values } from 'tslib';
import { throwError, of, Subject, BehaviorSubject } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { parse } from 'url';
import { HttpHeaders, HttpParams, HttpClient, HttpErrorResponse, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { isNullOrUndefined, isPrimitive } from 'util';
import { Injectable, Inject, Injector, Directive, Input, TemplateRef, ViewContainerRef, NgModule, defineInjectable, inject, INJECTOR } from '@angular/core';
import { Observable } from 'rxjs-compat';
import { Router } from '@angular/router';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
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
 * User model
 */
var  /**
 * User model
 */
User = /** @class */ (function (_super) {
    __extends(User, _super);
    function User() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return User;
}(Resource));

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
 * Account manager service
 */
var AccountService = /** @class */ (function (_super) {
    __extends(AccountService, _super);
    /** constructor */
    function AccountService(injector, http) {
        var _this = _super.call(this, User, "account", injector) || this;
        _this.http = http;
        /**
         * API resource path
         */
        _this.ACCOUNT_API = 'account';
        return _this;
    }
    /** get logged in user account*/
    /**
     * get logged in user account
     * @return {?}
     */
    AccountService.prototype.get = /**
     * get logged in user account
     * @return {?}
     */
    function () {
        /** @type {?} */
        var result;
        result = this.http.get(this.resourceService.getResourceUrl(this.ACCOUNT_API));
        return result;
    };
    /** save account*/
    /**
     * save account
     * @param {?} item
     * @return {?}
     */
    AccountService.prototype.save = /**
     * save account
     * @param {?} item
     * @return {?}
     */
    function (item) {
        /** @type {?} */
        var result;
        result = this.http.post(this.resourceService.getResourceUrl(this.ACCOUNT_API), item);
        return result;
    };
    /** change logged in user account*/
    /**
     * change logged in user account
     * @param {?} item
     * @return {?}
     */
    AccountService.prototype.changePassword = /**
     * change logged in user account
     * @param {?} item
     * @return {?}
     */
    function (item) {
        /** @type {?} */
        var result;
        result = this.http.post(this.resourceService.getResourceUrl(this.ACCOUNT_API + "/change-password"), item);
        return result;
    };
    AccountService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    AccountService.ctorParameters = function () { return [
        { type: Injector },
        { type: HttpClient }
    ]; };
    return AccountService;
}(RestService));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Authentication service
 */
var AuthService = /** @class */ (function () {
    /** constructor*/
    function AuthService(http, resourceService) {
        this.http = http;
        this.resourceService = resourceService;
        /**
         * API resource path
         */
        this.AUTH_API = 'authenticate';
    }
    /** get current user jwt token from session storage*/
    /**
     * get current user jwt token from session storage
     * @return {?}
     */
    AuthService.prototype.getToken = /**
     * get current user jwt token from session storage
     * @return {?}
     */
    function () {
        return sessionStorage.getItem('authenticationToken');
    };
    /** login operation */
    /**
     * login operation
     * @param {?} credentials
     * @return {?}
     */
    AuthService.prototype.login = /**
     * login operation
     * @param {?} credentials
     * @return {?}
     */
    function (credentials) {
        /** @type {?} */
        var data = {
            username: credentials.username,
            password: credentials.password
        };
        return this.http.post(this.resourceService.getResourceUrl(this.AUTH_API), data, { observe: 'response' }).map(authenticateSuccess.bind(this));
        /**
         * @param {?} resp
         * @return {?}
         */
        function authenticateSuccess(resp) {
            if (resp.ok) {
                /** @type {?} */
                var jwt = resp.body.id_token;
                this.storeAuthenticationToken(jwt);
                //const expiresAt = moment().add( resp.headers.get('Token-Validity'),'milisecond');
                //sessionStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
                return jwt;
            }
        }
    };
    /** login operation with jwt token */
    /**
     * login operation with jwt token
     * @param {?} jwt
     * @return {?}
     */
    AuthService.prototype.loginWithToken = /**
     * login operation with jwt token
     * @param {?} jwt
     * @return {?}
     */
    function (jwt) {
        if (jwt) {
            this.storeAuthenticationToken(jwt);
            return Promise.resolve(jwt);
        }
        else {
            return Promise.reject('auth-jwt-service Promise reject'); // Put appropriate error message here
        }
    };
    /** store jwt token in session storage*/
    /**
     * store jwt token in session storage
     * @param {?} jwt
     * @return {?}
     */
    AuthService.prototype.storeAuthenticationToken = /**
     * store jwt token in session storage
     * @param {?} jwt
     * @return {?}
     */
    function (jwt) {
        sessionStorage.setItem('authenticationToken', jwt);
    };
    /**
     * check whether current user is logged in
     * @return {?}
     */
    AuthService.prototype.isLoggedIn = /**
     * check whether current user is logged in
     * @return {?}
     */
    function () {
        //return moment().isBefore(this.getExpiration());
        return this.getToken();
    };
    /** check whether current user is logged out*/
    /**
     * check whether current user is logged out
     * @return {?}
     */
    AuthService.prototype.isLoggedOut = /**
     * check whether current user is logged out
     * @return {?}
     */
    function () {
        return !this.isLoggedIn();
    };
    /** logout operation */
    /**
     * logout operation
     * @return {?}
     */
    AuthService.prototype.logout = /**
     * logout operation
     * @return {?}
     */
    function () {
        return new Observable(function (observer) {
            //localStorage.removeItem('authenticationToken');
            sessionStorage.removeItem('authenticationToken');
            //sessionStorage.removeItem('expires_at');
            observer.complete();
        });
    };
    AuthService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    AuthService.ctorParameters = function () { return [
        { type: HttpClient },
        { type: ResourceService }
    ]; };
    return AuthService;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Interceptor for authentication token in API requests
 */
var  /**
 * Interceptor for authentication token in API requests
 */
AuthInterceptor = /** @class */ (function () {
    /** constructor*/
    function AuthInterceptor() {
    }
    /** request handler */
    /**
     * request handler
     * @param {?} request
     * @param {?} next
     * @return {?}
     */
    AuthInterceptor.prototype.intercept = /**
     * request handler
     * @param {?} request
     * @param {?} next
     * @return {?}
     */
    function (request, next) {
        if (!request || !request.url || !(request.url.includes("api"))) {
            return next.handle(request);
        }
        /** @type {?} */
        var token = sessionStorage.getItem('authenticationToken');
        if (!!token) {
            request = request.clone({
                setHeaders: {
                    Authorization: 'Bearer ' + token
                }
            });
        }
        return next.handle(request);
    };
    return AuthInterceptor;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Principal service
 */
var Principal = /** @class */ (function () {
    /** constructor */
    function Principal(account) {
        this.account = account;
        this.authenticated = false;
        this.authenticationState = new Subject();
    }
    /** authenticate with given identity*/
    /**
     * authenticate with given identity
     * @param {?} identity
     * @return {?}
     */
    Principal.prototype.authenticate = /**
     * authenticate with given identity
     * @param {?} identity
     * @return {?}
     */
    function (identity) {
        this.userIdentity = identity;
        this.authenticated = identity !== null;
        this.authenticationState.next(this.userIdentity);
    };
    /** check whether current user has any of the given authorities */
    /**
     * check whether current user has any of the given authorities
     * @param {?} authorities
     * @return {?}
     */
    Principal.prototype.hasAnyAuthority = /**
     * check whether current user has any of the given authorities
     * @param {?} authorities
     * @return {?}
     */
    function (authorities) {
        return Promise.resolve(this.hasAnyAuthorityDirect(authorities));
    };
    /** check whether current user has any of the given authorities on the given territory */
    /**
     * check whether current user has any of the given authorities on the given territory
     * @param {?} authorities
     * @param {?} territory
     * @return {?}
     */
    Principal.prototype.hasAnyAuthorityOnTerritory = /**
     * check whether current user has any of the given authorities on the given territory
     * @param {?} authorities
     * @param {?} territory
     * @return {?}
     */
    function (authorities, territory) {
        return Promise.resolve(this.hasAnyAuthorityDirectOnTerritory(authorities, territory));
    };
    /** check whether current user has any of the given authorities without resolving promises*/
    /**
     * check whether current user has any of the given authorities without resolving promises
     * @param {?} authorities
     * @return {?}
     */
    Principal.prototype.hasAnyAuthorityDirect = /**
     * check whether current user has any of the given authorities without resolving promises
     * @param {?} authorities
     * @return {?}
     */
    function (authorities) {
        if (!this.authenticated || !this.userIdentity || !this.userIdentity.authorities) {
            return false;
        }
        for (var i = 0; i < authorities.length; i++) {
            if (this.userIdentity.authorities.includes(authorities[i])) {
                return true;
            }
        }
        return false;
    };
    /** check whether current user has any of the given authorities on the given territory without resolving promises */
    /**
     * check whether current user has any of the given authorities on the given territory without resolving promises
     * @param {?} authorities
     * @param {?} territory
     * @return {?}
     */
    Principal.prototype.hasAnyAuthorityDirectOnTerritory = /**
     * check whether current user has any of the given authorities on the given territory without resolving promises
     * @param {?} authorities
     * @param {?} territory
     * @return {?}
     */
    function (authorities, territory) {
        if (!this.authenticated || !this.userIdentity || !this.userIdentity.authorities) {
            return false;
        }
        for (var i = 0; i < authorities.length; i++) {
            if (this.userIdentity.authoritiesPerTerritory[territory] && this.userIdentity.authoritiesPerTerritory[territory].includes(authorities[i])) {
                return true;
            }
        }
        return false;
    };
    /** check whether current user has the given authority */
    /**
     * check whether current user has the given authority
     * @param {?} authority
     * @return {?}
     */
    Principal.prototype.hasAuthority = /**
     * check whether current user has the given authority
     * @param {?} authority
     * @return {?}
     */
    function (authority) {
        if (!this.authenticated) {
            return Promise.resolve(false);
        }
        return this.identity().then(function (id) {
            return Promise.resolve(id.authorities && id.authorities.includes(authority));
        }, function () {
            return Promise.resolve(false);
        });
    };
    /** check whether current user has the given authority on the given territory*/
    /**
     * check whether current user has the given authority on the given territory
     * @param {?} authority
     * @param {?} territory
     * @return {?}
     */
    Principal.prototype.hasAuthorityOnTerritory = /**
     * check whether current user has the given authority on the given territory
     * @param {?} authority
     * @param {?} territory
     * @return {?}
     */
    function (authority, territory) {
        if (!this.authenticated) {
            return Promise.resolve(false);
        }
        return this.identity().then(function (id) {
            return Promise.resolve(id.authoritiesPerTerritory && id.authoritiesPerTerritory[territory] && id.authoritiesPerTerritory[territory].includes(authority));
        }, function () {
            return Promise.resolve(false);
        });
    };
    /** check user identity*/
    /**
     * check user identity
     * @param {?=} force
     * @return {?}
     */
    Principal.prototype.identity = /**
     * check user identity
     * @param {?=} force
     * @return {?}
     */
    function (force) {
        var _this = this;
        if (force === true) {
            this.userIdentity = undefined;
        }
        // check and see if we have retrieved the userIdentity data from the server.
        // if we have, reuse it by immediately resolving
        if (this.userIdentity) {
            return Promise.resolve(this.userIdentity);
        }
        // retrieve the userIdentity data from the server, update the identity object, and then resolve.
        return this.account.get().toPromise().then(function (response) {
            /** @type {?} */
            var account = response;
            if (account) {
                _this.userIdentity = account;
                _this.authenticated = true;
            }
            else {
                _this.userIdentity = null;
                _this.authenticated = false;
            }
            _this.authenticationState.next(_this.userIdentity);
            return _this.userIdentity;
        }).catch(function (err) {
            _this.userIdentity = null;
            _this.authenticated = false;
            _this.authenticationState.next(_this.userIdentity);
            return null;
        });
    };
    /** check whether current user is authenticated */
    /**
     * check whether current user is authenticated
     * @return {?}
     */
    Principal.prototype.isAuthenticated = /**
     * check whether current user is authenticated
     * @return {?}
     */
    function () {
        return this.authenticated;
    };
    /** check whether current user identity is resolved */
    /**
     * check whether current user identity is resolved
     * @return {?}
     */
    Principal.prototype.isIdentityResolved = /**
     * check whether current user identity is resolved
     * @return {?}
     */
    function () {
        return this.userIdentity !== undefined;
    };
    /** get current user authentication state */
    /**
     * get current user authentication state
     * @return {?}
     */
    Principal.prototype.getAuthenticationState = /**
     * get current user authentication state
     * @return {?}
     */
    function () {
        return this.authenticationState.asObservable();
    };
    Principal.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    Principal.ctorParameters = function () { return [
        { type: AccountService }
    ]; };
    return Principal;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Interceptor for authentication expired response in API requests
 */
var AuthExpiredInterceptor = /** @class */ (function () {
    /** constructor */
    function AuthExpiredInterceptor(router, authService, principal) {
        this.router = router;
        this.authService = authService;
        this.principal = principal;
    }
    /** request handler */
    /**
     * request handler
     * @param {?} request
     * @param {?} next
     * @return {?}
     */
    AuthExpiredInterceptor.prototype.intercept = /**
     * request handler
     * @param {?} request
     * @param {?} next
     * @return {?}
     */
    function (request, next) {
        var _this = this;
        return next.handle(request).do(function (event) { }, function (err) {
            if (err instanceof HttpErrorResponse) {
                if (err.status === 401) {
                    _this.authService.logout().subscribe();
                    _this.principal.authenticate(null);
                    _this.router.navigate(['/']);
                }
            }
        });
    };
    AuthExpiredInterceptor.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    AuthExpiredInterceptor.ctorParameters = function () { return [
        { type: Router },
        { type: AuthService },
        { type: Principal }
    ]; };
    return AuthExpiredInterceptor;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Login service
 */
var LoginService = /** @class */ (function () {
    /** constructor */
    function LoginService(authServerProvider, principal) {
        this.authServerProvider = authServerProvider;
        this.principal = principal;
    }
    /**Login operation*/
    /**
     * Login operation
     * @param {?} credentials
     * @param {?=} callback
     * @return {?}
     */
    LoginService.prototype.login = /**
     * Login operation
     * @param {?} credentials
     * @param {?=} callback
     * @return {?}
     */
    function (credentials, callback) {
        var _this = this;
        /** @type {?} */
        var cb = callback || function () { };
        return new Promise(function (resolve, reject) {
            _this.authServerProvider.login(credentials).subscribe(function (data) {
                _this.principal.identity(true).then(function (account) {
                    // After the login the language will be changed to
                    // the language selected by the user during his registration
                    resolve(data);
                });
                return cb();
            }, function (err) {
                _this.logout();
                reject(err);
                return cb(err);
            });
        });
    };
    /**login with jwt token */
    /**
     * login with jwt token
     * @param {?} jwt
     * @return {?}
     */
    LoginService.prototype.loginWithToken = /**
     * login with jwt token
     * @param {?} jwt
     * @return {?}
     */
    function (jwt) {
        return this.authServerProvider.loginWithToken(jwt);
    };
    /** logout operation */
    /**
     * logout operation
     * @return {?}
     */
    LoginService.prototype.logout = /**
     * logout operation
     * @return {?}
     */
    function () {
        this.authServerProvider.logout().subscribe();
        this.principal.authenticate(null);
    };
    LoginService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    LoginService.ctorParameters = function () { return [
        { type: AuthService },
        { type: Principal }
    ]; };
    return LoginService;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * User manager service
 */
var UserService = /** @class */ (function (_super) {
    __extends(UserService, _super);
    /** constructor */
    function UserService(injector, http) {
        var _this = _super.call(this, User, "users", injector) || this;
        _this.http = http;
        /**
         * API resource path
         */
        _this.USER_API = 'users';
        return _this;
    }
    /** remove user*/
    /**
     * remove user
     * @param {?} item
     * @return {?}
     */
    UserService.prototype.remove = /**
     * remove user
     * @param {?} item
     * @return {?}
     */
    function (item) {
        return this.http.delete(item._links.self.href);
    };
    /** save user*/
    /**
     * save user
     * @param {?} item
     * @return {?}
     */
    UserService.prototype.save = /**
     * save user
     * @param {?} item
     * @return {?}
     */
    function (item) {
        /** @type {?} */
        var result;
        if (item._links != null) {
            result = this.http.put(item._links.self.href, item);
        }
        else {
            result = this.http.post(this.USER_API, item);
        }
        return result;
    };
    /** change password o given user id */
    /**
     * change password o given user id
     * @param {?} id
     * @param {?} item
     * @return {?}
     */
    UserService.prototype.changePassword = /**
     * change password o given user id
     * @param {?} id
     * @param {?} item
     * @return {?}
     */
    function (id, item) {
        /** @type {?} */
        var result;
        result = this.http.post(this.resourceService.getResourceUrl(this.USER_API + "/" + id + "/change-password"), item);
        return result;
    };
    UserService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    UserService.ctorParameters = function () { return [
        { type: Injector },
        { type: HttpClient }
    ]; };
    return UserService;
}(RestService));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * User position model
 */
var  /**
 * User position model
 */
UserPosition = /** @class */ (function (_super) {
    __extends(UserPosition, _super);
    function UserPosition() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return UserPosition;
}(Resource));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * User position manager service
 */
var UserPositionService = /** @class */ (function (_super) {
    __extends(UserPositionService, _super);
    /** constructor */
    function UserPositionService(injector, http) {
        var _this = _super.call(this, UserPosition, "user-positions", injector) || this;
        _this.http = http;
        /**
         * API resource path
         */
        _this.USER_POSITION_API = 'user-positions';
        return _this;
    }
    /** remove user position*/
    /**
     * remove user position
     * @param {?} item
     * @return {?}
     */
    UserPositionService.prototype.remove = /**
     * remove user position
     * @param {?} item
     * @return {?}
     */
    function (item) {
        return this.http.delete(item._links.self.href);
    };
    /** save user position*/
    /**
     * save user position
     * @param {?} item
     * @return {?}
     */
    UserPositionService.prototype.save = /**
     * save user position
     * @param {?} item
     * @return {?}
     */
    function (item) {
        /** @type {?} */
        var result;
        if (item._links != null) {
            result = this.http.put(item._links.self.href, item);
            if (item.user != null) {
                item.substituteRelation('user', item.user).subscribe(function (result) {
                }, function (error) { return console.error(error); });
            }
            if (item.territory != null) {
                item.substituteRelation('territory', item.territory).subscribe(function (result) {
                }, function (error) { return console.error(error); });
            }
        }
        else {
            item.territory = item.territory._links.self.href;
            item.user = item.user._links.self.href;
            result = this.http.post(this.resourceService.getResourceUrl(this.USER_POSITION_API), item);
        }
        return result;
    };
    UserPositionService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    UserPositionService.ctorParameters = function () { return [
        { type: Injector },
        { type: HttpClient }
    ]; };
    return UserPositionService;
}(RestService));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * User permission model
 */
var  /**
 * User permission model
 */
UserConfiguration = /** @class */ (function (_super) {
    __extends(UserConfiguration, _super);
    function UserConfiguration() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return UserConfiguration;
}(Resource));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * User configuration manager service
 */
var UserConfigurationService = /** @class */ (function (_super) {
    __extends(UserConfigurationService, _super);
    /** constructor */
    function UserConfigurationService(injector, http) {
        var _this = _super.call(this, UserConfiguration, "user-configurations", injector) || this;
        _this.http = http;
        /**
         * API resource path
         */
        _this.USER_CONFIGURATION_API = 'user-configurations';
        return _this;
    }
    /** remove user configuration*/
    /**
     * remove user configuration
     * @param {?} item
     * @return {?}
     */
    UserConfigurationService.prototype.remove = /**
     * remove user configuration
     * @param {?} item
     * @return {?}
     */
    function (item) {
        return this.http.delete(item._links.self.href);
    };
    /** save user configuration*/
    /**
     * save user configuration
     * @param {?} item
     * @return {?}
     */
    UserConfigurationService.prototype.save = /**
     * save user configuration
     * @param {?} item
     * @return {?}
     */
    function (item) {
        /** @type {?} */
        var result;
        if (item._links != null) {
            result = this.http.put(item._links.self.href, item);
            if (item.user != null) {
                item.substituteRelation('user', item.user).subscribe(function (result) {
                }, function (error) { return console.error(error); });
            }
            if (item.territory != null) {
                item.substituteRelation('territory', item.territory).subscribe(function (result) {
                }, function (error) { return console.error(error); });
            }
            if (item.role != null) {
                item.substituteRelation('role', item.role).subscribe(function (result) {
                }, function (error) { return console.error(error); });
            }
        }
        else {
            item.territory = item.territory._links.self.href;
            item.role = item.role._links.self.href;
            item.user = item.user._links.self.href;
            result = this.http.post(this.resourceService.getResourceUrl(this.USER_CONFIGURATION_API), item);
        }
        return result;
    };
    UserConfigurationService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    UserConfigurationService.ctorParameters = function () { return [
        { type: Injector },
        { type: HttpClient }
    ]; };
    return UserConfigurationService;
}(RestService));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Territory model
 */
var  /**
 * Territory model
 */
Territory = /** @class */ (function (_super) {
    __extends(Territory, _super);
    function Territory() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Territory;
}(Resource));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Territory manager service
 */
var TerritoryService = /** @class */ (function (_super) {
    __extends(TerritoryService, _super);
    /** constructor */
    function TerritoryService(injector, http) {
        var _this = _super.call(this, Territory, "territories", injector) || this;
        _this.http = http;
        /**
         * API resource path
         */
        _this.TERRITORY_API = 'territories';
        return _this;
    }
    /** remove territory*/
    /**
     * remove territory
     * @param {?} item
     * @return {?}
     */
    TerritoryService.prototype.remove = /**
     * remove territory
     * @param {?} item
     * @return {?}
     */
    function (item) {
        return this.http.delete(item._links.self.href);
    };
    /** save territory*/
    /**
     * save territory
     * @param {?} item
     * @return {?}
     */
    TerritoryService.prototype.save = /**
     * save territory
     * @param {?} item
     * @return {?}
     */
    function (item) {
        /** @type {?} */
        var result;
        if (item.type != null)
            item.type = item.type._links.self.href;
        if (item._links != null) {
            result = this.http.put(item._links.self.href, item);
        }
        else {
            result = this.http.post(this.resourceService.getResourceUrl(this.TERRITORY_API), item);
        }
        return result;
    };
    TerritoryService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    TerritoryService.ctorParameters = function () { return [
        { type: Injector },
        { type: HttpClient }
    ]; };
    return TerritoryService;
}(RestService));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Territory type model
 */
var  /**
 * Territory type model
 */
TerritoryType = /** @class */ (function (_super) {
    __extends(TerritoryType, _super);
    function TerritoryType() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return TerritoryType;
}(Resource));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * TerritoryType manager service
 */
var TerritoryTypeService = /** @class */ (function (_super) {
    __extends(TerritoryTypeService, _super);
    /** constructor */
    function TerritoryTypeService(injector, http) {
        var _this = _super.call(this, TerritoryType, "territory-types", injector) || this;
        _this.http = http;
        /**
         * API resource path
         */
        _this.TERRITORYTYPE_API = 'territory-types';
        return _this;
    }
    /** remove territory type*/
    /**
     * remove territory type
     * @param {?} item
     * @return {?}
     */
    TerritoryTypeService.prototype.remove = /**
     * remove territory type
     * @param {?} item
     * @return {?}
     */
    function (item) {
        return this.http.delete(item._links.self.href);
    };
    /** save territory type*/
    /**
     * save territory type
     * @param {?} item
     * @return {?}
     */
    TerritoryTypeService.prototype.save = /**
     * save territory type
     * @param {?} item
     * @return {?}
     */
    function (item) {
        /** @type {?} */
        var result;
        if (item._links != null) {
            result = this.http.put(item._links.self.href, item);
        }
        else {
            result = this.http.post(this.resourceService.getResourceUrl(this.TERRITORYTYPE_API), item);
        }
        return result;
    };
    TerritoryTypeService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    TerritoryTypeService.ctorParameters = function () { return [
        { type: Injector },
        { type: HttpClient }
    ]; };
    return TerritoryTypeService;
}(RestService));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Territory type model
 */
var  /**
 * Territory type model
 */
TerritoryGroupType = /** @class */ (function (_super) {
    __extends(TerritoryGroupType, _super);
    function TerritoryGroupType() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return TerritoryGroupType;
}(Resource));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var TerritoryGroupTypeService = /** @class */ (function (_super) {
    __extends(TerritoryGroupTypeService, _super);
    /** constructor */
    function TerritoryGroupTypeService(injector, http) {
        var _this = _super.call(this, TerritoryGroupType, "territory-group-types", injector) || this;
        _this.http = http;
        /**
         * API resource path
         */
        _this.TERRITORYGROUPTYPE_API = 'territory-group-types';
        return _this;
    }
    /** remove territory*/
    /**
     * remove territory
     * @param {?} item
     * @return {?}
     */
    TerritoryGroupTypeService.prototype.remove = /**
     * remove territory
     * @param {?} item
     * @return {?}
     */
    function (item) {
        return this.http.delete(item._links.self.href);
    };
    /** save territory*/
    /**
     * save territory
     * @param {?} item
     * @return {?}
     */
    TerritoryGroupTypeService.prototype.save = /**
     * save territory
     * @param {?} item
     * @return {?}
     */
    function (item) {
        /** @type {?} */
        var result;
        if (item._links != null) {
            result = this.http.put(item._links.self.href, item);
        }
        else {
            result = this.http.post(this.resourceService.getResourceUrl(this.TERRITORYGROUPTYPE_API), item);
        }
        return result;
    };
    TerritoryGroupTypeService.decorators = [
        { type: Injectable, args: [{
                    providedIn: 'root'
                },] },
    ];
    /** @nocollapse */
    TerritoryGroupTypeService.ctorParameters = function () { return [
        { type: Injector },
        { type: HttpClient }
    ]; };
    /** @nocollapse */ TerritoryGroupTypeService.ngInjectableDef = defineInjectable({ factory: function TerritoryGroupTypeService_Factory() { return new TerritoryGroupTypeService(inject(INJECTOR), inject(HttpClient)); }, token: TerritoryGroupTypeService, providedIn: "root" });
    return TerritoryGroupTypeService;
}(RestService));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Role model
 */
var  /**
 * Role model
 */
Role = /** @class */ (function (_super) {
    __extends(Role, _super);
    function Role() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Role;
}(Resource));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Role manager service
 */
var RoleService = /** @class */ (function (_super) {
    __extends(RoleService, _super);
    /** constructor */
    function RoleService(injector, http) {
        var _this = _super.call(this, Role, "roles", injector) || this;
        _this.http = http;
        /**
         * API resource path
         */
        _this.ROLE_API = 'roles';
        return _this;
    }
    /** remove role*/
    /**
     * remove role
     * @param {?} item
     * @return {?}
     */
    RoleService.prototype.remove = /**
     * remove role
     * @param {?} item
     * @return {?}
     */
    function (item) {
        return this.http.delete(item._links.self.href);
    };
    /** save role*/
    /**
     * save role
     * @param {?} item
     * @return {?}
     */
    RoleService.prototype.save = /**
     * save role
     * @param {?} item
     * @return {?}
     */
    function (item) {
        /** @type {?} */
        var result;
        if (item._links != null) {
            result = this.http.put(item._links.self.href, item);
        }
        else {
            result = this.http.post(this.resourceService.getResourceUrl(this.ROLE_API), item);
        }
        return result;
    };
    RoleService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    RoleService.ctorParameters = function () { return [
        { type: Injector },
        { type: HttpClient }
    ]; };
    return RoleService;
}(RestService));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Connection model
 */
var  /**
 * Connection model
 */
Connection = /** @class */ (function (_super) {
    __extends(Connection, _super);
    function Connection() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Connection;
}(Resource));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Connection manager service
 */
var ConnectionService = /** @class */ (function (_super) {
    __extends(ConnectionService, _super);
    /** constructor */
    function ConnectionService(injector, http) {
        var _this = _super.call(this, Connection, "connections", injector) || this;
        _this.http = http;
        /**
         * API resource path
         */
        _this.CONNECTION_API = 'connections';
        return _this;
    }
    /** remove connection*/
    /**
     * remove connection
     * @param {?} item
     * @return {?}
     */
    ConnectionService.prototype.remove = /**
     * remove connection
     * @param {?} item
     * @return {?}
     */
    function (item) {
        return this.http.delete(item._links.self.href);
    };
    /** save connection*/
    /**
     * save connection
     * @param {?} item
     * @return {?}
     */
    ConnectionService.prototype.save = /**
     * save connection
     * @param {?} item
     * @return {?}
     */
    function (item) {
        /** @type {?} */
        var result;
        if (item._links != null) {
            result = this.http.put(item._links.self.href, item);
        }
        else {
            result = this.http.post(this.resourceService.getResourceUrl(this.CONNECTION_API), item);
        }
        return result;
    };
    ConnectionService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    ConnectionService.ctorParameters = function () { return [
        { type: Injector },
        { type: HttpClient }
    ]; };
    return ConnectionService;
}(RestService));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** *
 * GEOADMIN_task id
  @type {?} */
var GEOADMIN_TREE_TASK_ID = "geoadmin";
/**
 * Task model
 */
var  /**
 * Task model
 */
Task = /** @class */ (function (_super) {
    __extends(Task, _super);
    function Task() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Task;
}(Resource));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Task manager service
 */
var TaskService = /** @class */ (function (_super) {
    __extends(TaskService, _super);
    /** constructor */
    function TaskService(injector, http) {
        var _this = _super.call(this, Task, "tasks", injector) || this;
        _this.http = http;
        /**
         * API resource path
         */
        _this.CONNECTION_API = 'tasks';
        return _this;
    }
    /** remove task*/
    /**
     * remove task
     * @param {?} item
     * @return {?}
     */
    TaskService.prototype.remove = /**
     * remove task
     * @param {?} item
     * @return {?}
     */
    function (item) {
        return this.http.delete(item._links.self.href);
    };
    /** save task*/
    /**
     * save task
     * @param {?} item
     * @return {?}
     */
    TaskService.prototype.save = /**
     * save task
     * @param {?} item
     * @return {?}
     */
    function (item) {
        /** @type {?} */
        var result;
        /** @type {?} */
        var taskType = item.type;
        /** @type {?} */
        var taskGroup = item.group;
        /** @type {?} */
        var taskConnection = item.connection;
        /** @type {?} */
        var taskUI = item.ui;
        if (item._links != null) {
            result = this.http.put(item._links.self.href, item);
        }
        else {
            result = this.http.post(this.resourceService.getResourceUrl(this.CONNECTION_API), item);
        }
        return result;
    };
    TaskService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    TaskService.ctorParameters = function () { return [
        { type: Injector },
        { type: HttpClient }
    ]; };
    return TaskService;
}(RestService));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Task type model
 */
var  /**
 * Task type model
 */
TaskType = /** @class */ (function (_super) {
    __extends(TaskType, _super);
    function TaskType() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return TaskType;
}(Resource));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * TaskType manager service
 */
var TaskTypeService = /** @class */ (function (_super) {
    __extends(TaskTypeService, _super);
    /** constructor */
    function TaskTypeService(injector, http) {
        var _this = _super.call(this, TaskType, "task-types", injector) || this;
        _this.http = http;
        /**
         * API resource path
         */
        _this.CONNECTION_API = 'task-types';
        return _this;
    }
    /** remove task type*/
    /**
     * remove task type
     * @param {?} item
     * @return {?}
     */
    TaskTypeService.prototype.remove = /**
     * remove task type
     * @param {?} item
     * @return {?}
     */
    function (item) {
        return this.http.delete(item._links.self.href);
    };
    /** save task type*/
    /**
     * save task type
     * @param {?} item
     * @return {?}
     */
    TaskTypeService.prototype.save = /**
     * save task type
     * @param {?} item
     * @return {?}
     */
    function (item) {
        /** @type {?} */
        var result;
        if (item._links != null) {
            result = this.http.put(item._links.self.href, item);
        }
        else {
            result = this.http.post(this.resourceService.getResourceUrl(this.CONNECTION_API), item);
        }
        return result;
    };
    TaskTypeService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    TaskTypeService.ctorParameters = function () { return [
        { type: Injector },
        { type: HttpClient }
    ]; };
    return TaskTypeService;
}(RestService));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Task group model
 */
var  /**
 * Task group model
 */
TaskGroup = /** @class */ (function (_super) {
    __extends(TaskGroup, _super);
    function TaskGroup() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return TaskGroup;
}(Resource));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Task group manager service
 */
var TaskGroupService = /** @class */ (function (_super) {
    __extends(TaskGroupService, _super);
    /** constructor */
    function TaskGroupService(injector, http) {
        var _this = _super.call(this, TaskGroup, "task-groups", injector) || this;
        _this.http = http;
        /**
         * API resource path
         */
        _this.CONNECTION_API = 'task-groups';
        return _this;
    }
    /** remove task group*/
    /**
     * remove task group
     * @param {?} item
     * @return {?}
     */
    TaskGroupService.prototype.remove = /**
     * remove task group
     * @param {?} item
     * @return {?}
     */
    function (item) {
        return this.http.delete(item._links.self.href);
    };
    /** save task group*/
    /**
     * save task group
     * @param {?} item
     * @return {?}
     */
    TaskGroupService.prototype.save = /**
     * save task group
     * @param {?} item
     * @return {?}
     */
    function (item) {
        /** @type {?} */
        var result;
        if (item._links != null) {
            result = this.http.put(item._links.self.href, item);
        }
        else {
            result = this.http.post(this.resourceService.getResourceUrl(this.CONNECTION_API), item);
        }
        return result;
    };
    TaskGroupService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    TaskGroupService.ctorParameters = function () { return [
        { type: Injector },
        { type: HttpClient }
    ]; };
    return TaskGroupService;
}(RestService));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Task parameter model
 */
var  /**
 * Task parameter model
 */
TaskParameter = /** @class */ (function (_super) {
    __extends(TaskParameter, _super);
    function TaskParameter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return TaskParameter;
}(Resource));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Task parameter manager service
 */
var TaskParameterService = /** @class */ (function (_super) {
    __extends(TaskParameterService, _super);
    /** constructor */
    function TaskParameterService(injector, http) {
        var _this = _super.call(this, TaskParameter, "task-parameters", injector) || this;
        _this.http = http;
        /**
         * API resource path
         */
        _this.TASK_PARAMETER_API = 'task-parameters';
        return _this;
    }
    /** remove task parameter*/
    /**
     * remove task parameter
     * @param {?} item
     * @return {?}
     */
    TaskParameterService.prototype.remove = /**
     * remove task parameter
     * @param {?} item
     * @return {?}
     */
    function (item) {
        return this.http.delete(item._links.self.href);
    };
    /** save task parameter*/
    /**
     * save task parameter
     * @param {?} item
     * @return {?}
     */
    TaskParameterService.prototype.save = /**
     * save task parameter
     * @param {?} item
     * @return {?}
     */
    function (item) {
        /** @type {?} */
        var result;
        if (item._links != null) {
            result = this.http.put(item._links.self.href, item);
            if (item.task != null) {
                item.substituteRelation('task', item.task).subscribe(function (result) {
                }, function (error) { return console.error(error); });
            }
        }
        else {
            item.task = item.task._links.self.href;
            result = this.http.post(this.resourceService.getResourceUrl(this.TASK_PARAMETER_API), item);
        }
        return result;
    };
    TaskParameterService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    TaskParameterService.ctorParameters = function () { return [
        { type: Injector },
        { type: HttpClient }
    ]; };
    return TaskParameterService;
}(RestService));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Task availability model
 */
var  /**
 * Task availability model
 */
TaskAvailability = /** @class */ (function (_super) {
    __extends(TaskAvailability, _super);
    function TaskAvailability() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return TaskAvailability;
}(Resource));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Task availability manager service
 */
var TaskAvailabilityService = /** @class */ (function (_super) {
    __extends(TaskAvailabilityService, _super);
    /** constructor */
    function TaskAvailabilityService(injector, http) {
        var _this = _super.call(this, TaskAvailability, "task-availabilities", injector) || this;
        _this.http = http;
        /**
         * API resource path
         */
        _this.TASK_AVAILABILITY_API = 'task-availabilities';
        return _this;
    }
    /** remove task availability*/
    /**
     * remove task availability
     * @param {?} item
     * @return {?}
     */
    TaskAvailabilityService.prototype.remove = /**
     * remove task availability
     * @param {?} item
     * @return {?}
     */
    function (item) {
        return this.http.delete(item._links.self.href);
    };
    /** save task availability*/
    /**
     * save task availability
     * @param {?} item
     * @return {?}
     */
    TaskAvailabilityService.prototype.save = /**
     * save task availability
     * @param {?} item
     * @return {?}
     */
    function (item) {
        /** @type {?} */
        var result;
        if (item._links != null) {
            result = this.http.put(item._links.self.href, item);
            if (item.task != null) {
                item.substituteRelation('task', item.task).subscribe(function (result) {
                }, function (error) { return console.error(error); });
            }
            if (item.territory != null) {
                item.substituteRelation('territory', item.territory).subscribe(function (result) {
                }, function (error) { return console.error(error); });
            }
        }
        else {
            item.territory = item.territory._links.self.href;
            item.task = item.task._links.self.href;
            result = this.http.post(this.resourceService.getResourceUrl(this.TASK_AVAILABILITY_API), item);
        }
        return result;
    };
    TaskAvailabilityService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    TaskAvailabilityService.ctorParameters = function () { return [
        { type: Injector },
        { type: HttpClient }
    ]; };
    return TaskAvailabilityService;
}(RestService));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Task UI model
 */
var  /**
 * Task UI model
 */
TaskUI = /** @class */ (function (_super) {
    __extends(TaskUI, _super);
    function TaskUI() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return TaskUI;
}(Resource));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Task UI manager service
 */
var TaskUIService = /** @class */ (function (_super) {
    __extends(TaskUIService, _super);
    /** constructor */
    function TaskUIService(injector, http) {
        var _this = _super.call(this, TaskUI, "task-uis", injector) || this;
        _this.http = http;
        /**
         * API resource path
         */
        _this.CONNECTION_API = 'task-uis';
        return _this;
    }
    /** remove task UI*/
    /**
     * remove task UI
     * @param {?} item
     * @return {?}
     */
    TaskUIService.prototype.remove = /**
     * remove task UI
     * @param {?} item
     * @return {?}
     */
    function (item) {
        return this.http.delete(item._links.self.href);
    };
    /** save task UI*/
    /**
     * save task UI
     * @param {?} item
     * @return {?}
     */
    TaskUIService.prototype.save = /**
     * save task UI
     * @param {?} item
     * @return {?}
     */
    function (item) {
        /** @type {?} */
        var result;
        if (item._links != null) {
            result = this.http.put(item._links.self.href, item);
        }
        else {
            result = this.http.post(this.resourceService.getResourceUrl(this.CONNECTION_API), item);
        }
        return result;
    };
    TaskUIService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    TaskUIService.ctorParameters = function () { return [
        { type: Injector },
        { type: HttpClient }
    ]; };
    return TaskUIService;
}(RestService));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Service model
 */
var  /**
 * Service model
 */
Service = /** @class */ (function (_super) {
    __extends(Service, _super);
    function Service() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Service;
}(Resource));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Service manager service
 */
var ServiceService = /** @class */ (function (_super) {
    __extends(ServiceService, _super);
    /** constructor */
    function ServiceService(injector, http) {
        var _this = _super.call(this, Service, "services", injector) || this;
        _this.http = http;
        /**
         * API resource path
         */
        _this.SERVICE_API = 'services';
        return _this;
    }
    /** remove service*/
    /**
     * remove service
     * @param {?} item
     * @return {?}
     */
    ServiceService.prototype.remove = /**
     * remove service
     * @param {?} item
     * @return {?}
     */
    function (item) {
        return this.http.delete(item._links.self.href);
    };
    /** save service*/
    /**
     * save service
     * @param {?} item
     * @return {?}
     */
    ServiceService.prototype.save = /**
     * save service
     * @param {?} item
     * @return {?}
     */
    function (item) {
        /** @type {?} */
        var result;
        /** @type {?} */
        var serviceConnection = item.connection;
        if (item.connection != null) {
            if (typeof item.connection._links != 'undefined') {
                item.connection = item.connection._links.self.href;
            }
            else {
                serviceConnection._links = {};
                serviceConnection._links.self = {};
                serviceConnection._links.self.href = "";
            }
        }
        if (item._links != null) {
            //update relations
            delete item.connection;
            if (serviceConnection._links.self.href == '') {
                item.deleteRelation('connection', serviceConnection).subscribe(function (result) {
                }, function (error) { return console.error(error); });
            }
            else {
                item.substituteRelation('connection', serviceConnection).subscribe(function (result) {
                }, function (error) { return console.error(error); });
            }
            result = this.http.put(item._links.self.href, item);
        }
        else {
            result = this.http.post(this.resourceService.getResourceUrl(this.SERVICE_API), item);
        }
        return result;
    };
    ServiceService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    ServiceService.ctorParameters = function () { return [
        { type: Injector },
        { type: HttpClient }
    ]; };
    return ServiceService;
}(RestService));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Service parameter model
 */
var  /**
 * Service parameter model
 */
ServiceParameter = /** @class */ (function (_super) {
    __extends(ServiceParameter, _super);
    function ServiceParameter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ServiceParameter;
}(Resource));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Service parameter manager service
 */
var ServiceParameterService = /** @class */ (function (_super) {
    __extends(ServiceParameterService, _super);
    /** constructor */
    function ServiceParameterService(injector, http) {
        var _this = _super.call(this, ServiceParameter, "service-parameters", injector) || this;
        _this.http = http;
        /**
         * API resource path
         */
        _this.SERVICE_PARAMETER_API = 'service-parameters';
        return _this;
    }
    /** remove service parameter*/
    /**
     * remove service parameter
     * @param {?} item
     * @return {?}
     */
    ServiceParameterService.prototype.remove = /**
     * remove service parameter
     * @param {?} item
     * @return {?}
     */
    function (item) {
        return this.http.delete(item._links.self.href);
    };
    /** save service parameter*/
    /**
     * save service parameter
     * @param {?} item
     * @return {?}
     */
    ServiceParameterService.prototype.save = /**
     * save service parameter
     * @param {?} item
     * @return {?}
     */
    function (item) {
        /** @type {?} */
        var result;
        if (item._links != null) {
            if (item.service != null) {
                /** @type {?} */
                var service = item.service;
                delete item.service;
                item.substituteRelation('service', service).subscribe(function (result) {
                }, function (error) { return console.error(error); });
            }
            result = this.http.put(item._links.self.href, item);
        }
        else {
            item.service = item.service._links.self.href;
            result = this.http.post(this.resourceService.getResourceUrl(this.SERVICE_PARAMETER_API), item);
        }
        return result;
    };
    ServiceParameterService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    ServiceParameterService.ctorParameters = function () { return [
        { type: Injector },
        { type: HttpClient }
    ]; };
    return ServiceParameterService;
}(RestService));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Cartography
 */
var  /**
 * Cartography
 */
Cartography = /** @class */ (function (_super) {
    __extends(Cartography, _super);
    function Cartography() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Cartography;
}(Resource));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Cartography manager service
 */
var CartographyService = /** @class */ (function (_super) {
    __extends(CartographyService, _super);
    /** constructor */
    function CartographyService(injector, http) {
        var _this = _super.call(this, Cartography, "cartographies", injector) || this;
        _this.http = http;
        /**
         * API resource path
         */
        _this.CARTOGRAPHY_API = 'cartographies';
        return _this;
    }
    /** remove cartography*/
    /**
     * remove cartography
     * @param {?} item
     * @return {?}
     */
    CartographyService.prototype.remove = /**
     * remove cartography
     * @param {?} item
     * @return {?}
     */
    function (item) {
        return this.http.delete(item._links.self.href);
    };
    /** save cartography*/
    /**
     * save cartography
     * @param {?} item
     * @return {?}
     */
    CartographyService.prototype.save = /**
     * save cartography
     * @param {?} item
     * @return {?}
     */
    function (item) {
        /** @type {?} */
        var result;
        /** @type {?} */
        var cartographyConnection = item.connection;
        /** @type {?} */
        var cartographyService = item.service;
        /** @type {?} */
        var cartographySelectionService = item.selectionService;
        if (item.service != null)
            item.service = item.service._links.self.href;
        if (item.selectionService != null)
            item.selectionService = item.selectionService._links.self.href;
        if (item.connection != null) {
            if (typeof item.connection._links != 'undefined') {
                item.connection = item.connection._links.self.href;
            }
            else {
                cartographyConnection._links = {};
                cartographyConnection._links.self = {};
                cartographyConnection._links.self.href = "";
            }
        }
        if (item._links != null) {
            //update relations
            delete item.connection;
            delete item.service;
            delete item.selectionService;
            if (cartographyConnection._links.self.href == '') {
                item.deleteRelation('connection', cartographyConnection).subscribe(function (result) {
                    item.substituteRelation('service', cartographyService).subscribe(function (result) {
                        item.substituteRelation('selectionService', cartographySelectionService).subscribe(function (result) {
                        }, function (error) { return console.error(error); });
                    }, function (error) { return console.error(error); });
                }, function (error) { return console.error(error); });
            }
            else {
                item.substituteRelation('connection', cartographyConnection).subscribe(function (result) {
                    item.substituteRelation('service', cartographyService).subscribe(function (result) {
                        item.substituteRelation('selectionService', cartographySelectionService).subscribe(function (result) {
                        }, function (error) { return console.error(error); });
                    }, function (error) { return console.error(error); });
                }, function (error) { return console.error(error); });
            }
            result = this.http.put(item._links.self.href, item);
        }
        else {
            result = this.http.post(this.resourceService.getResourceUrl(this.CARTOGRAPHY_API), item);
        }
        return result;
    };
    CartographyService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    CartographyService.ctorParameters = function () { return [
        { type: Injector },
        { type: HttpClient }
    ]; };
    return CartographyService;
}(RestService));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Cartography group
 */
var  /**
 * Cartography group
 */
CartographyGroup = /** @class */ (function (_super) {
    __extends(CartographyGroup, _super);
    function CartographyGroup() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CartographyGroup;
}(Resource));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * CartographyGroup manager service
 */
var CartographyGroupService = /** @class */ (function (_super) {
    __extends(CartographyGroupService, _super);
    /** constructor */
    function CartographyGroupService(injector, http) {
        var _this = _super.call(this, CartographyGroup, "cartography-groups", injector) || this;
        _this.http = http;
        /**
         * API resource path
         */
        _this.CARTOGRAPHY_GROUP_API = 'cartography-groups';
        return _this;
    }
    /** remove cartography group*/
    /**
     * remove cartography group
     * @param {?} item
     * @return {?}
     */
    CartographyGroupService.prototype.remove = /**
     * remove cartography group
     * @param {?} item
     * @return {?}
     */
    function (item) {
        return this.http.delete(item._links.self.href);
    };
    /** save cartography group*/
    /**
     * save cartography group
     * @param {?} item
     * @return {?}
     */
    CartographyGroupService.prototype.save = /**
     * save cartography group
     * @param {?} item
     * @return {?}
     */
    function (item) {
        /** @type {?} */
        var result;
        if (item._links != null) {
            result = this.http.put(item._links.self.href, item);
        }
        else {
            result = this.http.post(this.resourceService.getResourceUrl(this.CARTOGRAPHY_GROUP_API), item);
        }
        return result;
    };
    CartographyGroupService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    CartographyGroupService.ctorParameters = function () { return [
        { type: Injector },
        { type: HttpClient }
    ]; };
    return CartographyGroupService;
}(RestService));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Cartography availability model
 */
var  /**
 * Cartography availability model
 */
CartographyAvailability = /** @class */ (function (_super) {
    __extends(CartographyAvailability, _super);
    function CartographyAvailability() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CartographyAvailability;
}(Resource));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * CartographyAvailability manager service
 */
var CartographyAvailabilityService = /** @class */ (function (_super) {
    __extends(CartographyAvailabilityService, _super);
    /** constructor */
    function CartographyAvailabilityService(injector, http) {
        var _this = _super.call(this, CartographyAvailability, "cartography-availabilities", injector) || this;
        _this.http = http;
        /**
         * API resource path
         */
        _this.CARTOGRAPHY_AVAILABILITY_API = 'cartography-availabilities';
        return _this;
    }
    /** remove cartography availability*/
    /**
     * remove cartography availability
     * @param {?} item
     * @return {?}
     */
    CartographyAvailabilityService.prototype.remove = /**
     * remove cartography availability
     * @param {?} item
     * @return {?}
     */
    function (item) {
        return this.http.delete(item._links.self.href);
    };
    /** save cartography availability*/
    /**
     * save cartography availability
     * @param {?} item
     * @return {?}
     */
    CartographyAvailabilityService.prototype.save = /**
     * save cartography availability
     * @param {?} item
     * @return {?}
     */
    function (item) {
        /** @type {?} */
        var result;
        if (item._links != null) {
            result = this.http.put(item._links.self.href, item);
            if (item.cartography != null) {
                item.substituteRelation('cartography', item.cartography).subscribe(function (result) {
                }, function (error) { return console.error(error); });
            }
            if (item.territory != null) {
                item.substituteRelation('territory', item.territory).subscribe(function (result) {
                }, function (error) { return console.error(error); });
            }
        }
        else {
            item.territory = item.territory._links.self.href;
            item.cartography = item.cartography._links.self.href;
            result = this.http.post(this.resourceService.getResourceUrl(this.CARTOGRAPHY_AVAILABILITY_API), item);
        }
        return result;
    };
    CartographyAvailabilityService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    CartographyAvailabilityService.ctorParameters = function () { return [
        { type: Injector },
        { type: HttpClient }
    ]; };
    return CartographyAvailabilityService;
}(RestService));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Background model
 */
var  /**
 * Background model
 */
Background = /** @class */ (function (_super) {
    __extends(Background, _super);
    function Background() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Background;
}(Resource));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Background manager service
 */
var BackgroundService = /** @class */ (function (_super) {
    __extends(BackgroundService, _super);
    /** constructor */
    function BackgroundService(injector, http) {
        var _this = _super.call(this, Background, "backgrounds", injector) || this;
        _this.http = http;
        /**
         * API resource path
         */
        _this.BACKGROUND_API = 'backgrounds';
        return _this;
    }
    /** remove background*/
    /**
     * remove background
     * @param {?} item
     * @return {?}
     */
    BackgroundService.prototype.remove = /**
     * remove background
     * @param {?} item
     * @return {?}
     */
    function (item) {
        return this.http.delete(item._links.self.href);
    };
    /** save background*/
    /**
     * save background
     * @param {?} item
     * @return {?}
     */
    BackgroundService.prototype.save = /**
     * save background
     * @param {?} item
     * @return {?}
     */
    function (item) {
        /** @type {?} */
        var result;
        /** @type {?} */
        var backgroundCartographyGroup = item.cartographyGroup;
        if (item.cartographyGroup != null) {
            if (typeof item.cartographyGroup._links != 'undefined') {
                item.cartographyGroup = item.cartographyGroup._links.self.href;
            }
            else {
                backgroundCartographyGroup._links = {};
                backgroundCartographyGroup._links.self = {};
                backgroundCartographyGroup._links.self.href = "";
            }
        }
        if (item._links != null) {
            //update relations
            delete item.cartographyGroup;
            if (backgroundCartographyGroup._links.self.href == '') {
                item.deleteRelation('cartographyGroup', backgroundCartographyGroup).subscribe(function (result) {
                }, function (error) { return console.error(error); });
            }
            else {
                item.substituteRelation('cartographyGroup', backgroundCartographyGroup).subscribe(function (result) {
                }, function (error) { return console.error(error); });
            }
            result = this.http.put(item._links.self.href, item);
        }
        else {
            result = this.http.post(this.resourceService.getResourceUrl(this.BACKGROUND_API), item);
        }
        return result;
    };
    BackgroundService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    BackgroundService.ctorParameters = function () { return [
        { type: Injector },
        { type: HttpClient }
    ]; };
    return BackgroundService;
}(RestService));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Tree model
 */
var  /**
 * Tree model
 */
Tree = /** @class */ (function (_super) {
    __extends(Tree, _super);
    function Tree() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Tree;
}(Resource));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Tree manager service
 */
var TreeService = /** @class */ (function (_super) {
    __extends(TreeService, _super);
    /** constructor */
    function TreeService(injector, http) {
        var _this = _super.call(this, Tree, "trees", injector) || this;
        _this.http = http;
        /**
         * API resource path
         */
        _this.TREE_API = 'trees';
        return _this;
    }
    /** remove tree*/
    /**
     * remove tree
     * @param {?} item
     * @return {?}
     */
    TreeService.prototype.remove = /**
     * remove tree
     * @param {?} item
     * @return {?}
     */
    function (item) {
        return this.http.delete(item._links.self.href);
    };
    /** save tree*/
    /**
     * save tree
     * @param {?} item
     * @return {?}
     */
    TreeService.prototype.save = /**
     * save tree
     * @param {?} item
     * @return {?}
     */
    function (item) {
        /** @type {?} */
        var result;
        if (item._links != null) {
            result = this.http.put(item._links.self.href, item);
        }
        else {
            result = this.http.post(this.resourceService.getResourceUrl(this.TREE_API), item);
        }
        return result;
    };
    TreeService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    TreeService.ctorParameters = function () { return [
        { type: Injector },
        { type: HttpClient }
    ]; };
    return TreeService;
}(RestService));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Tree node model
 */
var  /**
 * Tree node model
 */
TreeNode = /** @class */ (function (_super) {
    __extends(TreeNode, _super);
    function TreeNode() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return TreeNode;
}(Resource));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Tree node manager service
 */
var TreeNodeService = /** @class */ (function (_super) {
    __extends(TreeNodeService, _super);
    /** constructor */
    function TreeNodeService(injector, http) {
        var _this = _super.call(this, TreeNode, "tree-nodes", injector) || this;
        _this.http = http;
        /**
         * API resource path
         */
        _this.TREE_NODE_API = 'tree-nodes';
        return _this;
    }
    /** remove tree node*/
    /**
     * remove tree node
     * @param {?} item
     * @return {?}
     */
    TreeNodeService.prototype.remove = /**
     * remove tree node
     * @param {?} item
     * @return {?}
     */
    function (item) {
        return this.http.delete(item._links.self.href);
    };
    /** save tree node*/
    /**
     * save tree node
     * @param {?} item
     * @return {?}
     */
    TreeNodeService.prototype.save = /**
     * save tree node
     * @param {?} item
     * @return {?}
     */
    function (item) {
        /** @type {?} */
        var result;
        if (item._links != null) {
            /** @type {?} */
            var itemTree = item.tree;
            /** @type {?} */
            var itemCartography = item.cartography;
            /** @type {?} */
            var itemParent = item.parent;
            delete item.tree;
            delete item.cartography;
            delete item.parent;
            result = this.http.put(item._links.self.href, item);
            if (itemTree != null) {
                item.substituteRelation('tree', itemTree).subscribe(function (result) {
                }, function (error) { return console.error(error); });
            }
            if (itemCartography != null) {
                item.substituteRelation('cartography', itemCartography).subscribe(function (result) {
                }, function (error) { return console.error(error); });
            }
            if (itemParent != null) {
                item.substituteRelation('parent', itemParent).subscribe(function (result) {
                }, function (error) { return console.error(error); });
            }
        }
        else {
            if (item.tree && item.tree._links && item.tree._links.self) {
                item.tree = item.tree._links.self.href;
            }
            if (item.cartography && item.cartography._links && item.cartography._links.self) {
                item.cartography = item.cartography._links.self.href;
            }
            result = this.http.post(this.resourceService.getResourceUrl(this.TREE_NODE_API), item);
        }
        return result;
    };
    TreeNodeService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    TreeNodeService.ctorParameters = function () { return [
        { type: Injector },
        { type: HttpClient }
    ]; };
    return TreeNodeService;
}(RestService));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** *
 * Territorial appliction name
  @type {?} */
var TERRITORIAL_APP_NAME = "Aplicación Territorial";
/**
 * Application model
 */
var  /**
 * Application model
 */
Application = /** @class */ (function (_super) {
    __extends(Application, _super);
    function Application() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Application;
}(Resource));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Application manager service
 */
var ApplicationService = /** @class */ (function (_super) {
    __extends(ApplicationService, _super);
    /** constructor */
    function ApplicationService(injector, http) {
        var _this = _super.call(this, Application, "applications", injector) || this;
        _this.http = http;
        /**
         * API resource path
         */
        _this.APPLICATION_API = 'applications';
        return _this;
    }
    /** remove application*/
    /**
     * remove application
     * @param {?} item
     * @return {?}
     */
    ApplicationService.prototype.remove = /**
     * remove application
     * @param {?} item
     * @return {?}
     */
    function (item) {
        return this.http.delete(item._links.self.href);
    };
    /** save application*/
    /**
     * save application
     * @param {?} item
     * @return {?}
     */
    ApplicationService.prototype.save = /**
     * save application
     * @param {?} item
     * @return {?}
     */
    function (item) {
        /** @type {?} */
        var result;
        /** @type {?} */
        var applicationSituationMap = item.situationMap;
        if (item.situationMap != null) {
            if (typeof item.situationMap._links != 'undefined') {
                item.situationMap = item.situationMap._links.self.href;
            }
            else {
                applicationSituationMap._links = {};
                applicationSituationMap._links.self = {};
                applicationSituationMap._links.self.href = "";
            }
        }
        if (item._links != null) {
            //update relations
            delete item.situationMap;
            if (applicationSituationMap._links.self.href == '') {
                item.deleteRelation('situationMap', applicationSituationMap).subscribe(function (result) {
                }, function (error) { return console.error(error); });
            }
            else {
                item.substituteRelation('situationMap', applicationSituationMap).subscribe(function (result) {
                }, function (error) { return console.error(error); });
            }
            result = this.http.put(item._links.self.href, item);
        }
        else {
            result = this.http.post(this.resourceService.getResourceUrl(this.APPLICATION_API), item);
        }
        return result;
    };
    ApplicationService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    ApplicationService.ctorParameters = function () { return [
        { type: Injector },
        { type: HttpClient }
    ]; };
    return ApplicationService;
}(RestService));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Application background model
 */
var  /**
 * Application background model
 */
ApplicationBackground = /** @class */ (function (_super) {
    __extends(ApplicationBackground, _super);
    function ApplicationBackground() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ApplicationBackground;
}(Resource));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Application background manager service
 */
var ApplicationBackgroundService = /** @class */ (function (_super) {
    __extends(ApplicationBackgroundService, _super);
    /** constructor */
    function ApplicationBackgroundService(injector, http) {
        var _this = _super.call(this, ApplicationBackground, "application-backgrounds", injector) || this;
        _this.http = http;
        /**
         * API resource path
         */
        _this.APPLICATION_BACKGROUND_API = 'application-backgrounds';
        return _this;
    }
    /** remove application background*/
    /**
     * remove application background
     * @param {?} item
     * @return {?}
     */
    ApplicationBackgroundService.prototype.remove = /**
     * remove application background
     * @param {?} item
     * @return {?}
     */
    function (item) {
        return this.http.delete(item._links.self.href);
    };
    /** save application background*/
    /**
     * save application background
     * @param {?} item
     * @return {?}
     */
    ApplicationBackgroundService.prototype.save = /**
     * save application background
     * @param {?} item
     * @return {?}
     */
    function (item) {
        /** @type {?} */
        var result;
        if (item._links != null) {
            result = this.http.put(item._links.self.href, item);
            if (item.application != null) {
                item.substituteRelation('application', item.application).subscribe(function (result) {
                }, function (error) { return console.error(error); });
            }
            if (item.background != null) {
                item.substituteRelation('background', item.background).subscribe(function (result) {
                }, function (error) { return console.error(error); });
            }
        }
        else {
            item.application = item.application._links.self.href;
            item.background = item.background._links.self.href;
            result = this.http.post(this.resourceService.getResourceUrl(this.APPLICATION_BACKGROUND_API), item);
        }
        return result;
    };
    ApplicationBackgroundService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    ApplicationBackgroundService.ctorParameters = function () { return [
        { type: Injector },
        { type: HttpClient }
    ]; };
    return ApplicationBackgroundService;
}(RestService));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Application parameter model
 */
var  /**
 * Application parameter model
 */
ApplicationParameter = /** @class */ (function (_super) {
    __extends(ApplicationParameter, _super);
    function ApplicationParameter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ApplicationParameter;
}(Resource));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Application parameter manager service
 */
var ApplicationParameterService = /** @class */ (function (_super) {
    __extends(ApplicationParameterService, _super);
    /** constructor */
    function ApplicationParameterService(injector, http) {
        var _this = _super.call(this, ApplicationParameter, "application-parameters", injector) || this;
        _this.http = http;
        /**
         * API resource path
         */
        _this.APPLICATION_PARAMETER_API = 'application-parameters';
        return _this;
    }
    /** remove application*/
    /**
     * remove application
     * @param {?} item
     * @return {?}
     */
    ApplicationParameterService.prototype.remove = /**
     * remove application
     * @param {?} item
     * @return {?}
     */
    function (item) {
        return this.http.delete(item._links.self.href);
    };
    /** save application*/
    /**
     * save application
     * @param {?} item
     * @return {?}
     */
    ApplicationParameterService.prototype.save = /**
     * save application
     * @param {?} item
     * @return {?}
     */
    function (item) {
        /** @type {?} */
        var result;
        if (item._links != null) {
            result = this.http.put(item._links.self.href, item);
            if (item.application != null) {
                item.substituteRelation('application', item.application).subscribe(function (result) {
                }, function (error) { return console.error(error); });
            }
        }
        else {
            item.application = item.application._links.self.href;
            result = this.http.post(this.resourceService.getResourceUrl(this.APPLICATION_PARAMETER_API), item);
        }
        return result;
    };
    ApplicationParameterService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    ApplicationParameterService.ctorParameters = function () { return [
        { type: Injector },
        { type: HttpClient }
    ]; };
    return ApplicationParameterService;
}(RestService));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Connection model
 */
var  /**
 * Connection model
 */
CodeList = /** @class */ (function (_super) {
    __extends(CodeList, _super);
    function CodeList() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CodeList;
}(Resource));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Connection manager service
 */
var CodeListService = /** @class */ (function (_super) {
    __extends(CodeListService, _super);
    /** constructor */
    function CodeListService(injector, http) {
        var _this = _super.call(this, CodeList, "codelist-values", injector) || this;
        _this.http = http;
        /**
         * API resource path
         */
        _this.CODELIST_API = 'codelist-values';
        return _this;
    }
    /** remove connection*/
    /**
     * remove connection
     * @param {?} item
     * @return {?}
     */
    CodeListService.prototype.remove = /**
     * remove connection
     * @param {?} item
     * @return {?}
     */
    function (item) {
        return this.http.delete(item._links.self.href);
    };
    /** save connection*/
    /**
     * save connection
     * @param {?} item
     * @return {?}
     */
    CodeListService.prototype.save = /**
     * save connection
     * @param {?} item
     * @return {?}
     */
    function (item) {
        /** @type {?} */
        var result;
        if (item._links != null) {
            result = this.http.put(item._links.self.href, item);
        }
        else {
            result = this.http.post(this.resourceService.getResourceUrl(this.CODELIST_API), item);
        }
        return result;
    };
    CodeListService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    CodeListService.ctorParameters = function () { return [
        { type: Injector },
        { type: HttpClient }
    ]; };
    return CodeListService;
}(RestService));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Layer model: configure Layer data and displaying configuration
 */
var  /**
 * Layer model: configure Layer data and displaying configuration
 */
Layer = /** @class */ (function () {
    function Layer() {
        /**
         * layer visibility
         */
        this.visibility = false;
        /**
         * Transparency (Transparent) 0-1 (Opaque)
         */
        this.opacity = 1.0;
        /**
         * Service attributions
         */
        this.attributions = "";
        /**
         * Description
         */
        this.desc = "";
        /**
         * Transparent request parameter?
         */
        this.url_transparent = "true";
        /**
         * Request Background parameter color (Hexa)
         */
        this.url_bgcolor = "0x000000";
        /**
         * Extent for tiled services
         */
        this.extent = null;
        /**
         * Enabled for GetFeatureInfo requests (enabled to use the viewer features information tool)
         */
        this.queryable = false;
    }
    return Layer;
}());
/**
 * Optional parameter model: configure parameter-value pair to add to the request layer URL
 */
var  /**
 * Optional parameter model: configure parameter-value pair to add to the request layer URL
 */
OptionalParameter = /** @class */ (function () {
    function OptionalParameter() {
    }
    return OptionalParameter;
}());
/**
 * Layer configuration model: modify the configuration of a layer when interacting with the map (make visible, move the layer ...)
 */
var  /**
 * Layer configuration model: modify the configuration of a layer when interacting with the map (make visible, move the layer ...)
 */
LayerConfiguration = /** @class */ (function () {
    function LayerConfiguration() {
    }
    return LayerConfiguration;
}());
/**
 * Layer group model
 */
var  /**
 * Layer group model
 */
LayerGroup = /** @class */ (function () {
    function LayerGroup() {
    }
    return LayerGroup;
}());
/**
 * Map options configuration model
 */
var  /**
 * Map options configuration model
 */
MapOptionsConfiguration = /** @class */ (function () {
    function MapOptionsConfiguration() {
    }
    return MapOptionsConfiguration;
}());
/**
 * Map component status model
 */
var  /**
 * Map component status model
 */
MapComponentStatus = /** @class */ (function () {
    function MapComponentStatus() {
        /**
         * loaded?
         */
        this.loaded = false;
    }
    return MapComponentStatus;
}());
var MapConfigurationManagerService = /** @class */ (function () {
    /** constructor*/
    function MapConfigurationManagerService() {
        //
        this.layersSubject = new BehaviorSubject([]);
        this.layers = null;
        this.baseLayerGroupsSubject = new BehaviorSubject([]);
        this.baseLayerGroups = null;
        this.layerConfigurationSubject = new BehaviorSubject([]);
        this.addLayersSubject = new BehaviorSubject([]);
        this.removeLayersSubject = new BehaviorSubject([]);
        this.situationMapConfigurationSubject = new BehaviorSubject([]);
        this.mapOptionsConfigurationSubject = new BehaviorSubject([]);
        this.mapComponentStatusSubject = new BehaviorSubject([]);
        /**
         * layer count
         */
        this.count = 0;
    }
    /** configure the overlay layers of the map, by passing as a parameter an array of objects of type Layer objects defining the layers to load.*/
    /**
     * configure the overlay layers of the map, by passing as a parameter an array of objects of type Layer objects defining the layers to load.
     * @param {?} configuration
     * @return {?}
     */
    MapConfigurationManagerService.prototype.loadLayersConfiguration = /**
     * configure the overlay layers of the map, by passing as a parameter an array of objects of type Layer objects defining the layers to load.
     * @param {?} configuration
     * @return {?}
     */
    function (configuration) {
        if (this.layers != null) {
            this.clearLayers(false);
        }
        this.setLayers(configuration);
    };
    /**configure the base layers of the map by passing as a parameter an array of objects of type LayerGroup each of them with the corresponding Layer objects defining the layers to load.*/
    /**
     * configure the base layers of the map by passing as a parameter an array of objects of type LayerGroup each of them with the corresponding Layer objects defining the layers to load.
     * @param {?} configuration
     * @return {?}
     */
    MapConfigurationManagerService.prototype.loadBaseLayersConfiguration = /**
     * configure the base layers of the map by passing as a parameter an array of objects of type LayerGroup each of them with the corresponding Layer objects defining the layers to load.
     * @param {?} configuration
     * @return {?}
     */
    function (configuration) {
        this.setBaseLayerGroups(configuration);
    };
    /** get base layer groups*/
    /**
     * get base layer groups
     * @return {?}
     */
    MapConfigurationManagerService.prototype.getBaseLayerGroups = /**
     * get base layer groups
     * @return {?}
     */
    function () {
        return this.baseLayerGroupsSubject.asObservable();
    };
    /** set base layer groups*/
    /**
     * set base layer groups
     * @param {?} groups
     * @return {?}
     */
    MapConfigurationManagerService.prototype.setBaseLayerGroups = /**
     * set base layer groups
     * @param {?} groups
     * @return {?}
     */
    function (groups) {
        this.baseLayerGroups = groups;
        this.refreshBaseLayerGroups();
    };
    /**
     * @return {?}
     */
    MapConfigurationManagerService.prototype.refreshBaseLayerGroups = /**
     * @return {?}
     */
    function () {
        // Send the new values so that all subscribers are updated
        this.baseLayerGroupsSubject.next(this.baseLayerGroups);
    };
    /** get layers*/
    /**
     * get layers
     * @return {?}
     */
    MapConfigurationManagerService.prototype.getLayers = /**
     * get layers
     * @return {?}
     */
    function () {
        return this.layersSubject.asObservable();
    };
    /** remove all layers from map*/
    /**
     * remove all layers from map
     * @param {?} refresh
     * @return {?}
     */
    MapConfigurationManagerService.prototype.clearLayers = /**
     * remove all layers from map
     * @param {?} refresh
     * @return {?}
     */
    function (refresh) {
        while (this.layers.length) {
            this.layers.pop();
        }
        if (refresh) {
            this.refreshLayers();
        }
    };
    /** set layers*/
    /**
     * set layers
     * @param {?} layers
     * @return {?}
     */
    MapConfigurationManagerService.prototype.setLayers = /**
     * set layers
     * @param {?} layers
     * @return {?}
     */
    function (layers) {
        this.layers = layers;
        this.refreshLayers();
    };
    /** add given layer to map*/
    /**
     * add given layer to map
     * @param {?} layer
     * @return {?}
     */
    MapConfigurationManagerService.prototype.addLayer = /**
     * add given layer to map
     * @param {?} layer
     * @return {?}
     */
    function (layer) {
        this.layers.push(layer);
        this.refreshAddLayers(layer);
    };
    /** add given layer to map at given index*/
    /**
     * add given layer to map at given index
     * @param {?} layer
     * @param {?} index
     * @return {?}
     */
    MapConfigurationManagerService.prototype.addLayerAt = /**
     * add given layer to map at given index
     * @param {?} layer
     * @param {?} index
     * @return {?}
     */
    function (layer, index) {
        if (index == 0) {
            this.layers = [layer].concat(this.layers);
        }
        else if (index >= this.layers.length) {
            this.layers.push(layer);
        }
        else {
            this.layers = this.layers.slice(0, index)
                .concat([layer])
                .concat(this.layers.slice(index, this.layers.length));
        }
        this.refreshAddLayers(layer);
        this.refreshLayerConfiguration(layer.id, null, null, index);
    };
    /** remove given layer from map*/
    /**
     * remove given layer from map
     * @param {?} layer
     * @return {?}
     */
    MapConfigurationManagerService.prototype.removeLayer = /**
     * remove given layer from map
     * @param {?} layer
     * @return {?}
     */
    function (layer) {
        /** @type {?} */
        var index = this.layers.indexOf(layer);
        this.removeLayerIndex(index);
    };
    /** remove layer with given id from map */
    /**
     * remove layer with given id from map
     * @param {?} id
     * @return {?}
     */
    MapConfigurationManagerService.prototype.removeLayerId = /**
     * remove layer with given id from map
     * @param {?} id
     * @return {?}
     */
    function (id) {
        /** @type {?} */
        var index = -1;
        for (var i = 0, iLen = this.layers.length; i < iLen; i++) {
            if (this.layers[i].id == id) {
                index = i;
                break;
            }
        }
        this.removeLayerIndex(index);
    };
    /** remove layer at given index from map */
    /**
     * remove layer at given index from map
     * @param {?} index
     * @return {?}
     */
    MapConfigurationManagerService.prototype.removeLayerIndex = /**
     * remove layer at given index from map
     * @param {?} index
     * @return {?}
     */
    function (index) {
        /** @type {?} */
        var layer = this.layers[index];
        this.layers.splice(index, 1);
        this.refreshRemoveLayers(layer);
    };
    /**
     * refresh layers
     * @return {?}
     */
    MapConfigurationManagerService.prototype.refreshLayers = /**
     * refresh layers
     * @return {?}
     */
    function () {
        // Send the new values so that all subscribers are updated
        this.layersSubject.next(this.layers);
    };
    /** Observable for layers added */
    /**
     * Observable for layers added
     * @return {?}
     */
    MapConfigurationManagerService.prototype.getLayersAdded = /**
     * Observable for layers added
     * @return {?}
     */
    function () {
        return this.addLayersSubject.asObservable();
    };
    /**
     * @param {?} layer
     * @return {?}
     */
    MapConfigurationManagerService.prototype.refreshAddLayers = /**
     * @param {?} layer
     * @return {?}
     */
    function (layer) {
        // Send the new values so that all subscribers are updated
        this.addLayersSubject.next([layer]);
    };
    /**
     * @return {?}
     */
    MapConfigurationManagerService.prototype.getLayersRemoved = /**
     * @return {?}
     */
    function () {
        return this.removeLayersSubject.asObservable();
    };
    /**
     * @param {?} layer
     * @return {?}
     */
    MapConfigurationManagerService.prototype.refreshRemoveLayers = /**
     * @param {?} layer
     * @return {?}
     */
    function (layer) {
        // Send the new values so that all subscribers are updated
        this.removeLayersSubject.next([layer]);
    };
    /**
     * @return {?}
     */
    MapConfigurationManagerService.prototype.getLayerConfigurationListener = /**
     * @return {?}
     */
    function () {
        return this.layerConfigurationSubject.asObservable();
    };
    /**
     * @param {?} id
     * @return {?}
     */
    MapConfigurationManagerService.prototype.getLayerIndexById = /**
     * @param {?} id
     * @return {?}
     */
    function (id) {
        /** @type {?} */
        var index = -1;
        for (var i = 0, iLen = this.layers.length; i < iLen; i++) {
            if (this.layers[i].id == id) {
                index = i;
                break;
            }
        }
        return index;
    };
    /** move layer with given id to the given index*/
    /**
     * move layer with given id to the given index
     * @param {?} id
     * @param {?} index
     * @return {?}
     */
    MapConfigurationManagerService.prototype.moveLayer = /**
     * move layer with given id to the given index
     * @param {?} id
     * @param {?} index
     * @return {?}
     */
    function (id, index) {
        /** @type {?} */
        var layerIndex = this.getLayerIndexById(id);
        if (layerIndex != -1) {
            /** @type {?} */
            var layer = this.layers.splice(layerIndex, 1);
            this.layers =
                this.layers.slice(0, index)
                    .concat(layer)
                    .concat(this.layers.slice(index, this.layers.length));
        }
        this.refreshLayerConfiguration(id, null, null, index);
    };
    /** change visibility of layer with given id to the given value*/
    /**
     * change visibility of layer with given id to the given value
     * @param {?} id
     * @param {?} visibility
     * @return {?}
     */
    MapConfigurationManagerService.prototype.changeLayerVisibility = /**
     * change visibility of layer with given id to the given value
     * @param {?} id
     * @param {?} visibility
     * @return {?}
     */
    function (id, visibility) {
        this.refreshLayerConfiguration(id, null, visibility, null);
    };
    /** change opacity of layer with given id to the given value*/
    /**
     * change opacity of layer with given id to the given value
     * @param {?} id
     * @param {?} opacity
     * @return {?}
     */
    MapConfigurationManagerService.prototype.changeLayerOpacity = /**
     * change opacity of layer with given id to the given value
     * @param {?} id
     * @param {?} opacity
     * @return {?}
     */
    function (id, opacity) {
        this.refreshLayerConfiguration(id, opacity, null, null);
    };
    /**
     * @param {?} id
     * @param {?} opacity
     * @param {?} visibility
     * @param {?} position
     * @return {?}
     */
    MapConfigurationManagerService.prototype.refreshLayerConfiguration = /**
     * @param {?} id
     * @param {?} opacity
     * @param {?} visibility
     * @param {?} position
     * @return {?}
     */
    function (id, opacity, visibility, position) {
        /** @type {?} */
        var layer = new LayerConfiguration();
        layer.id = id;
        layer.opacity = opacity;
        layer.visibility = visibility;
        layer.position = position;
        this.layerConfigurationSubject.next([layer]);
    };
    /**
     * @return {?}
     */
    MapConfigurationManagerService.prototype.getSituationMapConfigurationListener = /**
     * @return {?}
     */
    function () {
        return this.situationMapConfigurationSubject.asObservable();
    };
    /** configure the situation map of the map component by passing as a parameter an array of objects of type LayerGroup, each of them with the corresponding Layer objects defining the layers to load as situation map.*/
    /**
     * configure the situation map of the map component by passing as a parameter an array of objects of type LayerGroup, each of them with the corresponding Layer objects defining the layers to load as situation map.
     * @param {?} layers
     * @return {?}
     */
    MapConfigurationManagerService.prototype.loadSituationMapConfiguration = /**
     * configure the situation map of the map component by passing as a parameter an array of objects of type LayerGroup, each of them with the corresponding Layer objects defining the layers to load as situation map.
     * @param {?} layers
     * @return {?}
     */
    function (layers) {
        // Send the new values so that all subscribers are updated
        this.situationMapConfigurationSubject.next(layers);
    };
    /**
     * @return {?}
     */
    MapConfigurationManagerService.prototype.getMapOptionsConfigurationListener = /**
     * @return {?}
     */
    function () {
        return this.mapOptionsConfigurationSubject.asObservable();
    };
    /** load map options configuration */
    /**
     * load map options configuration
     * @param {?} configuration
     * @return {?}
     */
    MapConfigurationManagerService.prototype.loadMapOptionsConfiguration = /**
     * load map options configuration
     * @param {?} configuration
     * @return {?}
     */
    function (configuration) {
        // Send the new values so that all subscribers are updated
        this.mapOptionsConfigurationSubject.next([configuration]);
    };
    /**
     * @return {?}
     */
    MapConfigurationManagerService.prototype.getMapComponentStatusListener = /**
     * @return {?}
     */
    function () {
        return this.mapComponentStatusSubject.asObservable();
    };
    /** set map component status */
    /**
     * set map component status
     * @param {?} status
     * @return {?}
     */
    MapConfigurationManagerService.prototype.setMapComponentStatus = /**
     * set map component status
     * @param {?} status
     * @return {?}
     */
    function (status) {
        //Notify the map component status
        this.mapComponentStatusSubject.next([status]);
    };
    MapConfigurationManagerService.decorators = [
        { type: Injectable, args: [{
                    providedIn: 'root'
                },] },
    ];
    /** @nocollapse */
    MapConfigurationManagerService.ctorParameters = function () { return []; };
    /** @nocollapse */ MapConfigurationManagerService.ngInjectableDef = defineInjectable({ factory: function MapConfigurationManagerService_Factory() { return new MapConfigurationManagerService(); }, token: MapConfigurationManagerService, providedIn: "root" });
    return MapConfigurationManagerService;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * \@whatItDoes Conditionally includes an HTML element if current user has any
 * of the authorities passed as the `expression`.
 *
 * \@howToUse
 * ```
 *     <some-element *sitmunHasAnyAuthority="'ROLE_ADMIN'">...</some-element>
 *
 *     <some-element *sitmunHasAnyAuthority="['ROLE_ADMIN', 'ROLE_USER']">...</some-element>
 * ```
 */
var HasAnyAuthorityDirective = /** @class */ (function () {
    /** constructor */
    function HasAnyAuthorityDirective(principal, templateRef, viewContainerRef) {
        this.principal = principal;
        this.templateRef = templateRef;
        this.viewContainerRef = viewContainerRef;
    }
    Object.defineProperty(HasAnyAuthorityDirective.prototype, "sitmunHasAnyAuthority", {
        /** Set whether current user has any of the given authorities */
        set: /**
         * Set whether current user has any of the given authorities
         * @param {?} value
         * @return {?}
         */
        function (value) {
            var _this = this;
            this.authorities = typeof value === 'string' ? [/** @type {?} */ (value)] : /** @type {?} */ (value);
            this.updateView();
            // Get notified each time authentication state changes.
            this.principal.getAuthenticationState().subscribe(function (identity) { return _this.updateView(); });
        },
        enumerable: true,
        configurable: true
    });
    /**
     * update view
     * @return {?}
     */
    HasAnyAuthorityDirective.prototype.updateView = /**
     * update view
     * @return {?}
     */
    function () {
        var _this = this;
        if (this.territory) {
            this.principal.hasAnyAuthorityOnTerritory(this.authorities, this.territory).then(function (result) {
                _this.viewContainerRef.clear();
                if (result) {
                    _this.viewContainerRef.createEmbeddedView(_this.templateRef);
                }
            });
        }
        else {
            this.principal.hasAnyAuthority(this.authorities).then(function (result) {
                _this.viewContainerRef.clear();
                if (result) {
                    _this.viewContainerRef.createEmbeddedView(_this.templateRef);
                }
            });
        }
    };
    HasAnyAuthorityDirective.decorators = [
        { type: Directive, args: [{
                    selector: '[sitmunHasAnyAuthority]'
                },] },
    ];
    /** @nocollapse */
    HasAnyAuthorityDirective.ctorParameters = function () { return [
        { type: Principal },
        { type: TemplateRef },
        { type: ViewContainerRef }
    ]; };
    HasAnyAuthorityDirective.propDecorators = {
        territory: [{ type: Input }],
        sitmunHasAnyAuthority: [{ type: Input }]
    };
    return HasAnyAuthorityDirective;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * \@whatItDoes Conditionally includes an HTML element if current user has any
 * of the authorities passed as the `expression`.
 *
 * \@howToUse
 * ```
 *     <some-element *sitmunHasAnyAuthority="'ROLE_ADMIN'">...</some-element>
 *
 *     <some-element *sitmunHasAnyAuthority="['ROLE_ADMIN', 'ROLE_USER']">...</some-element>
 * ```
 */
var HasAnyAuthorityOnTerritoryDirective = /** @class */ (function () {
    /** constructor */
    function HasAnyAuthorityOnTerritoryDirective(principal, templateRef, viewContainerRef) {
        this.principal = principal;
        this.templateRef = templateRef;
        this.viewContainerRef = viewContainerRef;
    }
    Object.defineProperty(HasAnyAuthorityOnTerritoryDirective.prototype, "sitmunHasAnyAuthorityOnTerritory", {
        /** Set whether current user has any of the given authorities on territory */
        set: /**
         * Set whether current user has any of the given authorities on territory
         * @param {?} opts
         * @return {?}
         */
        function (opts) {
            var _this = this;
            this.authorities = typeof opts.authorities === 'string' ? [/** @type {?} */ (opts.authorities)] : /** @type {?} */ (opts.authorities);
            this.territory = opts.territory;
            this.updateView();
            // Get notified each time authentication state changes.
            this.principal.getAuthenticationState().subscribe(function (identity) { return _this.updateView(); });
        },
        enumerable: true,
        configurable: true
    });
    /**
     * update view
     * @return {?}
     */
    HasAnyAuthorityOnTerritoryDirective.prototype.updateView = /**
     * update view
     * @return {?}
     */
    function () {
        var _this = this;
        if (this.territory) {
            this.principal.hasAnyAuthorityOnTerritory(this.authorities, this.territory).then(function (result) {
                _this.viewContainerRef.clear();
                if (result) {
                    _this.viewContainerRef.createEmbeddedView(_this.templateRef);
                }
            });
        }
        else {
            this.principal.hasAnyAuthority(this.authorities).then(function (result) {
                _this.viewContainerRef.clear();
                if (result) {
                    _this.viewContainerRef.createEmbeddedView(_this.templateRef);
                }
            });
        }
    };
    HasAnyAuthorityOnTerritoryDirective.decorators = [
        { type: Directive, args: [{
                    selector: '[sitmunHasAnyAuthorityOnTerritory]'
                },] },
    ];
    /** @nocollapse */
    HasAnyAuthorityOnTerritoryDirective.ctorParameters = function () { return [
        { type: Principal },
        { type: TemplateRef },
        { type: ViewContainerRef }
    ]; };
    HasAnyAuthorityOnTerritoryDirective.propDecorators = {
        sitmunHasAnyAuthorityOnTerritory: [{ type: Input }]
    };
    return HasAnyAuthorityOnTerritoryDirective;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * load i18n assets
 * @param {?} http
 * @return {?}
 */
function createTranslateLoader(http) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
var ɵ0 = (createTranslateLoader);
/**
 * SITMUN frontend core module
 */
var SitmunFrontendCoreModule = /** @class */ (function () {
    function SitmunFrontendCoreModule() {
    }
    /**
     * @return {?}
     */
    SitmunFrontendCoreModule.forRoot = /**
     * @return {?}
     */
    function () {
        return {
            ngModule: SitmunFrontendCoreModule,
            providers: [
                CodeListService,
                TerritoryService,
                TerritoryTypeService,
                TerritoryGroupTypeService,
                RoleService,
                AccountService,
                AuthService,
                UserService,
                ConnectionService,
                TaskService,
                TaskTypeService,
                TaskUIService,
                TaskGroupService,
                TaskParameterService,
                TaskAvailabilityService,
                ServiceService,
                ServiceParameterService,
                CartographyService,
                CartographyGroupService,
                CartographyAvailabilityService,
                BackgroundService,
                TreeService,
                TreeNodeService,
                ApplicationService,
                ApplicationParameterService,
                ApplicationBackgroundService,
                AuthInterceptor,
                AuthExpiredInterceptor,
                Principal,
                UserPositionService,
                UserConfigurationService,
                LoginService,
                MapConfigurationManagerService,
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: AuthInterceptor,
                    multi: true
                },
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: AuthExpiredInterceptor,
                    multi: true
                }
            ]
        };
    };
    SitmunFrontendCoreModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        /*RouterModule,
                            HttpClientModule,
                            CommonModule,
                            AngularHalModule,*/
                        TranslateModule.forRoot({
                            loader: {
                                provide: TranslateLoader,
                                useFactory: ɵ0,
                                deps: [HttpClient]
                            }
                        }),
                    ],
                    declarations: [
                        HasAnyAuthorityDirective,
                        HasAnyAuthorityOnTerritoryDirective,
                    ],
                    exports: [
                        HasAnyAuthorityDirective,
                        HasAnyAuthorityOnTerritoryDirective,
                        TranslateModule
                    ]
                },] },
    ];
    return SitmunFrontendCoreModule;
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

export { AccountService, AuthService, AuthInterceptor, AuthExpiredInterceptor, LoginService, Principal, User, UserService, UserPosition, UserPositionService, UserConfiguration, UserConfigurationService, Territory, TerritoryService, TerritoryType, TerritoryTypeService, TerritoryGroupType, TerritoryGroupTypeService, Role, RoleService, Connection, ConnectionService, GEOADMIN_TREE_TASK_ID, Task, TaskService, TaskType, TaskTypeService, TaskGroup, TaskGroupService, TaskParameter, TaskParameterService, TaskAvailability, TaskAvailabilityService, TaskUI, TaskUIService, Service, ServiceService, ServiceParameter, ServiceParameterService, Cartography, CartographyService, CartographyGroup, CartographyGroupService, CartographyAvailability, CartographyAvailabilityService, Background, BackgroundService, Tree, TreeService, TreeNode, TreeNodeService, TERRITORIAL_APP_NAME, Application, ApplicationService, ApplicationBackground, ApplicationBackgroundService, ApplicationParameter, ApplicationParameterService, CodeList, CodeListService, Layer, OptionalParameter, LayerConfiguration, LayerGroup, MapOptionsConfiguration, MapComponentStatus, MapConfigurationManagerService, createTranslateLoader, SitmunFrontendCoreModule, ExternalService, RestService, Resource, ResourceArray, ResourceHelper, AngularHalModule, ResourceService as ɵa, HasAnyAuthorityOnTerritoryDirective as ɵc, HasAnyAuthorityDirective as ɵb };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2l0bXVuLWZyb250ZW5kLWNvcmUuanMubWFwIiwic291cmNlcyI6WyJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlLWFycmF5LnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZS1oZWxwZXIudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvdXNlci91c2VyLm1vZGVsLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvYW5ndWxhci1oYWwvc3JjL2xpYi9leHRlcm5hbC5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZS5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS9hY2NvdW50L2FjY291bnQuc2VydmljZS50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL2F1dGgvYXV0aC5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvYXV0aC9hdXRoLmludGVyY2VwdG9yLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvYXV0aC9wcmluY2lwYWwuc2VydmljZS50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL2F1dGgvYXV0aC1leHBpcmVkLmludGVyY2VwdG9yLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvYXV0aC9sb2dpbi5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvdXNlci91c2VyLnNlcnZpY2UudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS91c2VyL3VzZXItcG9zaXRpb24ubW9kZWwudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS91c2VyL3VzZXItcG9zaXRpb24uc2VydmljZS50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL3VzZXIvdXNlci1jb25maWd1cmF0aW9uLm1vZGVsLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvdXNlci91c2VyLWNvbmZpZ3VyYXRpb24uc2VydmljZS50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL3RlcnJpdG9yeS90ZXJyaXRvcnkubW9kZWwudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS90ZXJyaXRvcnkvdGVycml0b3J5LnNlcnZpY2UudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS90ZXJyaXRvcnkvdGVycml0b3J5LXR5cGUubW9kZWwudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS90ZXJyaXRvcnkvdGVycml0b3J5LXR5cGUuc2VydmljZS50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL3RlcnJpdG9yeS90ZXJyaXRvcnktZ3JvdXAtdHlwZS5tb2RlbC50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL3RlcnJpdG9yeS90ZXJyaXRvcnktZ3JvdXAtdHlwZS5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvcm9sZS9yb2xlLm1vZGVsLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvcm9sZS9yb2xlLnNlcnZpY2UudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS9jb25uZWN0aW9uL2Nvbm5lY3Rpb24ubW9kZWwudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS9jb25uZWN0aW9uL2Nvbm5lY3Rpb24uc2VydmljZS50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL3Rhc2svdGFzay5tb2RlbC50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL3Rhc2svdGFzay5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvdGFzay90YXNrLXR5cGUubW9kZWwudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS90YXNrL3Rhc2stdHlwZS5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvdGFzay90YXNrLWdyb3VwLm1vZGVsLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvdGFzay90YXNrLWdyb3VwLnNlcnZpY2UudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS90YXNrL3Rhc2stcGFyYW1ldGVyLm1vZGVsLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvdGFzay90YXNrLXBhcmFtZXRlci5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvdGFzay90YXNrLWF2YWlsYWJpbGl0eS5tb2RlbC50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL3Rhc2svdGFzay1hdmFpbGFiaWxpdHkuc2VydmljZS50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL3Rhc2svdGFzay11aS5tb2RlbC50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL3Rhc2svdGFzay11aS5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvc2VydmljZS9zZXJ2aWNlLm1vZGVsLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvc2VydmljZS9zZXJ2aWNlLnNlcnZpY2UudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS9zZXJ2aWNlL3NlcnZpY2UtcGFyYW1ldGVyLm1vZGVsLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvc2VydmljZS9zZXJ2aWNlLXBhcmFtZXRlci5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvY2FydG9ncmFwaHkvY2FydG9ncmFwaHkubW9kZWwudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS9jYXJ0b2dyYXBoeS9jYXJ0b2dyYXBoeS5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvY2FydG9ncmFwaHkvY2FydG9ncmFwaHktZ3JvdXAubW9kZWwudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS9jYXJ0b2dyYXBoeS9jYXJ0b2dyYXBoeS1ncm91cC5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvY2FydG9ncmFwaHkvY2FydG9ncmFwaHktYXZhaWxhYmlsaXR5Lm1vZGVsLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvY2FydG9ncmFwaHkvY2FydG9ncmFwaHktYXZhaWxhYmlsaXR5LnNlcnZpY2UudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS9jYXJ0b2dyYXBoeS9iYWNrZ3JvdW5kLm1vZGVsLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvY2FydG9ncmFwaHkvYmFja2dyb3VuZC5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvdHJlZS90cmVlLm1vZGVsLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvdHJlZS90cmVlLnNlcnZpY2UudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS90cmVlL3RyZWUtbm9kZS5tb2RlbC50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL3RyZWUvdHJlZS1ub2RlLnNlcnZpY2UudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS9hcHBsaWNhdGlvbi9hcHBsaWNhdGlvbi5tb2RlbC50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL2FwcGxpY2F0aW9uL2FwcGxpY2F0aW9uLnNlcnZpY2UudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS9hcHBsaWNhdGlvbi9hcHBsaWNhdGlvbi1iYWNrZ3JvdW5kLm1vZGVsLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvYXBwbGljYXRpb24vYXBwbGljYXRpb24tYmFja2dyb3VuZC5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvYXBwbGljYXRpb24vYXBwbGljYXRpb24tcGFyYW1ldGVyLm1vZGVsLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvYXBwbGljYXRpb24vYXBwbGljYXRpb24tcGFyYW1ldGVyLnNlcnZpY2UudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS9jb2RlbGlzdC9jb2RlbGlzdC5tb2RlbC50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL2NvZGVsaXN0L2NvZGVsaXN0LnNlcnZpY2UudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS9tYXAvbWFwLWNvbmZpZ3VyYXRpb24tbWFuYWdlci5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvYXV0aC9oYXMtYW55LWF1dGhvcml0eS5kaXJlY3RpdmUudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS9hdXRoL2hhcy1hbnktYXV0aG9yaXR5LW9uLXRlcnJpdG9yeS5kaXJlY3RpdmUudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS9zaXRtdW4tZnJvbnRlbmQtY29yZS5tb2R1bGUudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS9hbmd1bGFyLWhhbC9zcmMvbGliL2FuZ3VsYXItaGFsLm1vZHVsZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcclxuaW1wb3J0IHt0aHJvd0Vycm9yIGFzIG9ic2VydmFibGVUaHJvd0Vycm9yfSBmcm9tICdyeGpzJztcclxuXHJcbmltcG9ydCB7Y2F0Y2hFcnJvciwgbWFwfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcbmltcG9ydCB7U29ydH0gZnJvbSAnLi9zb3J0JztcclxuaW1wb3J0IHtBcnJheUludGVyZmFjZX0gZnJvbSAnLi9hcnJheS1pbnRlcmZhY2UnO1xyXG5pbXBvcnQge1Jlc291cmNlSGVscGVyfSBmcm9tICcuL3Jlc291cmNlLWhlbHBlcic7XHJcbmltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4vcmVzb3VyY2UnO1xyXG5pbXBvcnQgKiBhcyB1cmwgZnJvbSAndXJsJztcclxuaW1wb3J0IHtPYnNlcnZhYmxlfSBmcm9tICdyeGpzL2ludGVybmFsL09ic2VydmFibGUnO1xyXG5cclxuLyoqIFJFU1QgYXJyYXkgb2YgcmVzb3VyY2UgaW1wbGVtZW50YXRpb24gKi9cclxuZXhwb3J0IGNsYXNzIFJlc291cmNlQXJyYXk8VCBleHRlbmRzIFJlc291cmNlPiBpbXBsZW1lbnRzIEFycmF5SW50ZXJmYWNlPFQ+IHtcclxuICAgIC8qKiBzb3J0aW5nIGluZm8gKi9cclxuICAgIHB1YmxpYyBzb3J0SW5mbzogU29ydFtdO1xyXG4gICAgLyoqIHByb3h5IHVybCAqL1xyXG4gICAgcHVibGljIHByb3h5VXJsOiBzdHJpbmc7XHJcbiAgICAvKiogcm9vdCB1cmwgKi9cclxuICAgIHB1YmxpYyByb290VXJsOiBzdHJpbmc7XHJcblxyXG4gICAgLyoqIHNlbGYgdXJsICovXHJcbiAgICBwdWJsaWMgc2VsZl91cmk6IHN0cmluZztcclxuICAgIC8qKiBuZXh0IHJlc291cmNlIHVybCAqL1xyXG4gICAgcHVibGljIG5leHRfdXJpOiBzdHJpbmc7XHJcbiAgICAvKiogcHJldmlvdXMgcmVzb3VyY2UgdXJsICovXHJcbiAgICBwdWJsaWMgcHJldl91cmk6IHN0cmluZztcclxuICAgIC8qKiBmaXJzdCByZXNvdXJjZSB1cmwgKi9cclxuICAgIHB1YmxpYyBmaXJzdF91cmk6IHN0cmluZztcclxuICAgIC8qKiBsYXN0IHJlc291cmNlIHVybCAqL1xyXG4gICAgcHVibGljIGxhc3RfdXJpOiBzdHJpbmc7XHJcblxyXG4gICAgLyoqIGVtYmVkZGVkIGFycmF5IGxpc3QgKi9cclxuICAgIHB1YmxpYyBfZW1iZWRkZWQ7XHJcblxyXG4gICAgLyoqIHRvdGFsIG51bWJlciBvZiBlbGVtZW50cyBpbiB0aGlzIGFycmF5ICovXHJcbiAgICBwdWJsaWMgdG90YWxFbGVtZW50cyA9IDA7XHJcbiAgICAvKiogdG90YWwgbnVtYmVyIG9mIHBhZ2VzIGluIHRoZSByZXNwb25zZSAqL1xyXG4gICAgcHVibGljIHRvdGFsUGFnZXMgPSAxO1xyXG4gICAgXHJcbiAgICAvKiogcGFnZSBudW1iZXIgaW4gdGhlIHJlc3BvbnNlICovXHJcbiAgICBwdWJsaWMgcGFnZU51bWJlciA9IDE7XHJcbiAgICBcclxuICAgIC8qKiBwYWdlIHNpemUgKi9cclxuICAgIHB1YmxpYyBwYWdlU2l6ZTogbnVtYmVyO1xyXG5cclxuICAgIC8qKiBhcnJheSBjb21wb25lbnRzICovXHJcbiAgICBwdWJsaWMgcmVzdWx0OiBUW10gPSBbXTtcclxuXHJcbiAgICAvKiogcHVzaCBhIG5ldyByZXNvdXJjZSB0byB0aGUgYXJyYXkgKi9cclxuICAgIHB1c2ggPSAoZWw6IFQpID0+IHtcclxuICAgICAgICB0aGlzLnJlc3VsdC5wdXNoKGVsKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqIGxlbmd0aCBvZiB0aGUgYXJyYXkgKi9cclxuICAgIGxlbmd0aCA9ICgpOiBudW1iZXIgPT4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJlc3VsdC5sZW5ndGg7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKiBsb2FkIGFycmF5IGRhdGEgZnJvbSBSRVNUIHJlcXVlc3QgKi9cclxuICAgIHByaXZhdGUgaW5pdCA9ICh0eXBlOiB7IG5ldygpOiBUIH0sIHJlc3BvbnNlOiBhbnksIHNvcnRJbmZvOiBTb3J0W10pOiBSZXNvdXJjZUFycmF5PFQ+ID0+IHtcclxuICAgICAgICBjb25zdCByZXN1bHQ6IFJlc291cmNlQXJyYXk8VD4gPSBSZXNvdXJjZUhlbHBlci5jcmVhdGVFbXB0eVJlc3VsdDxUPih0aGlzLl9lbWJlZGRlZCk7XHJcbiAgICAgICAgcmVzdWx0LnNvcnRJbmZvID0gc29ydEluZm87XHJcbiAgICAgICAgUmVzb3VyY2VIZWxwZXIuaW5zdGFudGlhdGVSZXNvdXJjZUNvbGxlY3Rpb24odHlwZSwgcmVzcG9uc2UsIHJlc3VsdCk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH07XHJcblxyXG4gICAgLyoqIExvYWQgbmV4dCBwYWdlICovXHJcbiAgICBuZXh0ID0gKHR5cGU6IHsgbmV3KCk6IFQgfSk6IE9ic2VydmFibGU8UmVzb3VyY2VBcnJheTxUPj4gPT4ge1xyXG4gICAgICAgIGlmICh0aGlzLm5leHRfdXJpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkuZ2V0KFJlc291cmNlSGVscGVyLmdldFByb3h5KHRoaXMubmV4dF91cmkpLCB7aGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVyc30pLnBpcGUoXHJcbiAgICAgICAgICAgICAgICBtYXAocmVzcG9uc2UgPT4gdGhpcy5pbml0KHR5cGUsIHJlc3BvbnNlLCB0aGlzLnNvcnRJbmZvKSksXHJcbiAgICAgICAgICAgICAgICBjYXRjaEVycm9yKGVycm9yID0+IG9ic2VydmFibGVUaHJvd0Vycm9yKGVycm9yKSksKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG9ic2VydmFibGVUaHJvd0Vycm9yKCdubyBuZXh0IGRlZmluZWQnKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqIExvYWQgcHJldmlvdXMgcGFnZSAqL1xyXG4gICAgcHJldiA9ICh0eXBlOiB7IG5ldygpOiBUIH0pOiBPYnNlcnZhYmxlPFJlc291cmNlQXJyYXk8VD4+ID0+IHtcclxuICAgICAgICBpZiAodGhpcy5wcmV2X3VyaSkge1xyXG4gICAgICAgICAgICByZXR1cm4gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLmdldChSZXNvdXJjZUhlbHBlci5nZXRQcm94eSh0aGlzLnByZXZfdXJpKSwge2hlYWRlcnM6IFJlc291cmNlSGVscGVyLmhlYWRlcnN9KS5waXBlKFxyXG4gICAgICAgICAgICAgICAgbWFwKHJlc3BvbnNlID0+IHRoaXMuaW5pdCh0eXBlLCByZXNwb25zZSwgdGhpcy5zb3J0SW5mbykpLFxyXG4gICAgICAgICAgICAgICAgY2F0Y2hFcnJvcihlcnJvciA9PiBvYnNlcnZhYmxlVGhyb3dFcnJvcihlcnJvcikpLCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBvYnNlcnZhYmxlVGhyb3dFcnJvcignbm8gcHJldiBkZWZpbmVkJyk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKiBMb2FkIGZpcnN0IHBhZ2UgKi9cclxuICAgIGZpcnN0ID0gKHR5cGU6IHsgbmV3KCk6IFQgfSk6IE9ic2VydmFibGU8UmVzb3VyY2VBcnJheTxUPj4gPT4ge1xyXG4gICAgICAgIGlmICh0aGlzLmZpcnN0X3VyaSkge1xyXG4gICAgICAgICAgICByZXR1cm4gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLmdldChSZXNvdXJjZUhlbHBlci5nZXRQcm94eSh0aGlzLmZpcnN0X3VyaSksIHtoZWFkZXJzOiBSZXNvdXJjZUhlbHBlci5oZWFkZXJzfSkucGlwZShcclxuICAgICAgICAgICAgICAgIG1hcChyZXNwb25zZSA9PiB0aGlzLmluaXQodHlwZSwgcmVzcG9uc2UsIHRoaXMuc29ydEluZm8pKSxcclxuICAgICAgICAgICAgICAgIGNhdGNoRXJyb3IoZXJyb3IgPT4gb2JzZXJ2YWJsZVRocm93RXJyb3IoZXJyb3IpKSwpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZVRocm93RXJyb3IoJ25vIGZpcnN0IGRlZmluZWQnKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqIExvYWQgbGFzdCBwYWdlICovXHJcbiAgICBsYXN0ID0gKHR5cGU6IHsgbmV3KCk6IFQgfSk6IE9ic2VydmFibGU8UmVzb3VyY2VBcnJheTxUPj4gPT4ge1xyXG4gICAgICAgIGlmICh0aGlzLmxhc3RfdXJpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkuZ2V0KFJlc291cmNlSGVscGVyLmdldFByb3h5KHRoaXMubGFzdF91cmkpLCB7aGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVyc30pLnBpcGUoXHJcbiAgICAgICAgICAgICAgICBtYXAocmVzcG9uc2UgPT4gdGhpcy5pbml0KHR5cGUsIHJlc3BvbnNlLCB0aGlzLnNvcnRJbmZvKSksXHJcbiAgICAgICAgICAgICAgICBjYXRjaEVycm9yKGVycm9yID0+IG9ic2VydmFibGVUaHJvd0Vycm9yKGVycm9yKSksKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG9ic2VydmFibGVUaHJvd0Vycm9yKCdubyBsYXN0IGRlZmluZWQnKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqIExvYWQgcGFnZSB3aXRoIGdpdmVuIHBhZ2VOdW1iZXIqL1xyXG4gICAgcGFnZSA9ICh0eXBlOiB7IG5ldygpOiBUIH0sIHBhZ2VOdW1iZXI6IG51bWJlcik6IE9ic2VydmFibGU8UmVzb3VyY2VBcnJheTxUPj4gPT4ge1xyXG4gICAgICAgIHRoaXMuc2VsZl91cmkgPSB0aGlzLnNlbGZfdXJpLnJlcGxhY2UoJ3s/cGFnZSxzaXplLHNvcnR9JywgJycpO1xyXG4gICAgICAgIHRoaXMuc2VsZl91cmkgPSB0aGlzLnNlbGZfdXJpLnJlcGxhY2UoJ3smc29ydH0nLCAnJyk7XHJcbiAgICAgICAgbGV0IHVybFBhcnNlZCA9IHVybC5wYXJzZShSZXNvdXJjZUhlbHBlci5nZXRQcm94eSh0aGlzLnNlbGZfdXJpKSk7XHJcbiAgICAgICAgbGV0IHF1ZXJ5OiBzdHJpbmcgPSBSZXNvdXJjZUFycmF5LnJlcGxhY2VPckFkZCh1cmxQYXJzZWQucXVlcnksICdzaXplJywgdGhpcy5wYWdlU2l6ZS50b1N0cmluZygpKTtcclxuICAgICAgICBxdWVyeSA9IFJlc291cmNlQXJyYXkucmVwbGFjZU9yQWRkKHF1ZXJ5LCAncGFnZScsIHBhZ2VOdW1iZXIudG9TdHJpbmcoKSk7XHJcblxyXG5cclxuICAgICAgICBsZXQgdXJpID0gdXJsUGFyc2VkLnF1ZXJ5ID9cclxuICAgICAgICAgICAgUmVzb3VyY2VIZWxwZXIuZ2V0UHJveHkodGhpcy5zZWxmX3VyaSkucmVwbGFjZSh1cmxQYXJzZWQucXVlcnksIHF1ZXJ5KSA6IFJlc291cmNlSGVscGVyLmdldFByb3h5KHRoaXMuc2VsZl91cmkpLmNvbmNhdChxdWVyeSk7XHJcbiAgICAgICAgdXJpID0gdGhpcy5hZGRTb3J0SW5mbyh1cmkpO1xyXG4gICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkuZ2V0KHVyaSwge2hlYWRlcnM6IFJlc291cmNlSGVscGVyLmhlYWRlcnN9KS5waXBlKFxyXG4gICAgICAgICAgICBtYXAocmVzcG9uc2UgPT4gdGhpcy5pbml0KHR5cGUsIHJlc3BvbnNlLCB0aGlzLnNvcnRJbmZvKSksXHJcbiAgICAgICAgICAgIGNhdGNoRXJyb3IoZXJyb3IgPT4gb2JzZXJ2YWJsZVRocm93RXJyb3IoZXJyb3IpKSwpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKiogU29ydCBjb2xsZWN0aW9uIGJhc2VkIG9uIGdpdmVuIHNvcnQgYXR0cmlidXRlICovXHJcbiAgICBzb3J0RWxlbWVudHMgPSAodHlwZTogeyBuZXcoKTogVCB9LCAuLi5zb3J0OiBTb3J0W10pOiBPYnNlcnZhYmxlPFJlc291cmNlQXJyYXk8VD4+ID0+IHtcclxuICAgICAgICB0aGlzLnNlbGZfdXJpID0gdGhpcy5zZWxmX3VyaS5yZXBsYWNlKCd7P3BhZ2Usc2l6ZSxzb3J0fScsICcnKTtcclxuICAgICAgICB0aGlzLnNlbGZfdXJpID0gdGhpcy5zZWxmX3VyaS5yZXBsYWNlKCd7JnNvcnR9JywgJycpO1xyXG4gICAgICAgIGxldCB1cmkgPSBSZXNvdXJjZUhlbHBlci5nZXRQcm94eSh0aGlzLnNlbGZfdXJpKS5jb25jYXQoJz8nLCAnc2l6ZT0nLCB0aGlzLnBhZ2VTaXplLnRvU3RyaW5nKCksICcmcGFnZT0nLCB0aGlzLnBhZ2VOdW1iZXIudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgdXJpID0gdGhpcy5hZGRTb3J0SW5mbyh1cmkpO1xyXG4gICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkuZ2V0KHVyaSwge2hlYWRlcnM6IFJlc291cmNlSGVscGVyLmhlYWRlcnN9KS5waXBlKFxyXG4gICAgICAgICAgICBtYXAocmVzcG9uc2UgPT4gdGhpcy5pbml0KHR5cGUsIHJlc3BvbnNlLCBzb3J0KSksXHJcbiAgICAgICAgICAgIGNhdGNoRXJyb3IoZXJyb3IgPT4gb2JzZXJ2YWJsZVRocm93RXJyb3IoZXJyb3IpKSwpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKiogTG9hZCBwYWdlIHdpdGggZ2l2ZW4gc2l6ZSAqL1xyXG4gICAgc2l6ZSA9ICh0eXBlOiB7IG5ldygpOiBUIH0sIHNpemU6IG51bWJlcik6IE9ic2VydmFibGU8UmVzb3VyY2VBcnJheTxUPj4gPT4ge1xyXG4gICAgICAgIGxldCB1cmkgPSBSZXNvdXJjZUhlbHBlci5nZXRQcm94eSh0aGlzLnNlbGZfdXJpKS5jb25jYXQoJz8nLCAnc2l6ZT0nLCBzaXplLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgIHVyaSA9IHRoaXMuYWRkU29ydEluZm8odXJpKTtcclxuICAgICAgICByZXR1cm4gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLmdldCh1cmksIHtoZWFkZXJzOiBSZXNvdXJjZUhlbHBlci5oZWFkZXJzfSkucGlwZShcclxuICAgICAgICAgICAgbWFwKHJlc3BvbnNlID0+IHRoaXMuaW5pdCh0eXBlLCByZXNwb25zZSwgdGhpcy5zb3J0SW5mbykpLFxyXG4gICAgICAgICAgICBjYXRjaEVycm9yKGVycm9yID0+IG9ic2VydmFibGVUaHJvd0Vycm9yKGVycm9yKSksKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqIEFkZCBzb3J0IGluZm8gdG8gZ2l2ZW4gVVJJICovXHJcbiAgICBwcml2YXRlIGFkZFNvcnRJbmZvKHVyaTogc3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuc29ydEluZm8pIHtcclxuICAgICAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIHRoaXMuc29ydEluZm8pIHtcclxuICAgICAgICAgICAgICAgIHVyaSA9IHVyaS5jb25jYXQoJyZzb3J0PScsIGl0ZW0ucGF0aCwgJywnLCBpdGVtLm9yZGVyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdXJpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBBZGQgcmVwbGFjZSBvciBhZGQgcGFyYW0gdmFsdWUgdG8gcXVlcnkgc3RyaW5nICovXHJcbiAgICBwcml2YXRlIHN0YXRpYyByZXBsYWNlT3JBZGQocXVlcnk6IHN0cmluZywgZmllbGQ6IHN0cmluZywgdmFsdWU6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgaWYgKHF1ZXJ5KSB7XHJcbiAgICAgICAgICAgIGxldCBpZHg6IG51bWJlciA9IHF1ZXJ5LmluZGV4T2YoZmllbGQpO1xyXG4gICAgICAgICAgICBsZXQgaWR4TmV4dEFtcDogbnVtYmVyID0gcXVlcnkuaW5kZXhPZignJicsIGlkeCkgPT0gLTEgPyBxdWVyeS5pbmRleE9mKCcvJywgaWR4KSA6IHF1ZXJ5LmluZGV4T2YoJyYnLCBpZHgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGlkeCAhPSAtMSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHNlYWNoVmFsdWUgPSBxdWVyeS5zdWJzdHJpbmcoaWR4LCBpZHhOZXh0QW1wKTtcclxuICAgICAgICAgICAgICAgIHF1ZXJ5ID0gcXVlcnkucmVwbGFjZShzZWFjaFZhbHVlLCBmaWVsZCArICc9JyArIHZhbHVlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHF1ZXJ5ID0gcXVlcnkuY29uY2F0KFwiJlwiICsgZmllbGQgKyAnPScgKyB2YWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBxdWVyeSA9IFwiP1wiICsgZmllbGQgKyAnPScgKyB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHF1ZXJ5O1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7SHR0cENsaWVudCwgSHR0cEhlYWRlcnMsIEh0dHBQYXJhbXN9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi9yZXNvdXJjZSc7XHJcbmltcG9ydCB7UmVzb3VyY2VBcnJheX0gZnJvbSAnLi9yZXNvdXJjZS1hcnJheSc7XHJcbmltcG9ydCB7SGFsT3B0aW9uc30gZnJvbSAnLi9yZXN0LnNlcnZpY2UnO1xyXG5pbXBvcnQge1N1YlR5cGVCdWlsZGVyfSBmcm9tICcuL3N1YnR5cGUtYnVpbGRlcic7XHJcbmltcG9ydCB7aXNOdWxsT3JVbmRlZmluZWQsIGlzUHJpbWl0aXZlfSBmcm9tICd1dGlsJztcclxuaW1wb3J0ICogYXMgdXJsIGZyb20gJ3VybCc7XHJcblxyXG4vKiogUkVTVCBBUEkgYWNjZXNzIGhlbHBlciAqL1xyXG5leHBvcnQgY2xhc3MgUmVzb3VyY2VIZWxwZXIge1xyXG5cclxuICAgIC8qKiBIdHRwSGVhZGVycyAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBoZWFkZXJzOiBIdHRwSGVhZGVycyA9IG5ldyBIdHRwSGVhZGVycygpO1xyXG4gICAgLyoqIFByb3h5IFVSTCAqL1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgcHJveHlfdXJpOiBzdHJpbmcgPSBudWxsO1xyXG4gICAgLyoqIFJvb3QgVVJMICovXHJcbiAgICBwcml2YXRlIHN0YXRpYyByb290X3VyaTogc3RyaW5nID0gbnVsbDtcclxuICAgIC8qKiBIdHRwQ2xpZW50ICovXHJcbiAgICBwcml2YXRlIHN0YXRpYyBodHRwOiBIdHRwQ2xpZW50ID0gbnVsbDtcclxuXHJcbiAgICAvKiogZ2V0IHJlcXVlc3QgaGVhZGVycyAqL1xyXG4gICAgLypwdWJsaWMgc3RhdGljIGdldCBoZWFkZXJzKCk6IEh0dHBIZWFkZXJzIHtcclxuICAgICAgICBpZiAoaXNOdWxsT3JVbmRlZmluZWQodGhpcy5faGVhZGVycykpXHJcbiAgICAgICAgICBSZXNvdXJjZUhlbHBlci5faGVhZGVycyA9IG5ldyBIdHRwSGVhZGVycygpO1xyXG4gICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5faGVhZGVycztcclxuICAgIH0qL1xyXG5cclxuICAgIC8qKiBzZXQgcmVxdWVzdCBoZWFkZXJzICovXHJcbiAgICAvKnB1YmxpYyBzdGF0aWMgc2V0IGhlYWRlcnMoaGVhZGVyczogSHR0cEhlYWRlcnMpIHtcclxuICAgICAgUmVzb3VyY2VIZWxwZXIuX2hlYWRlcnMgPSBoZWFkZXJzO1xyXG4gICAgfSovXHJcblxyXG4gICAgLyoqIGdldCByZXF1ZXN0IG9wdGlvbiBwYXJhbXMgKi9cclxuICAgIHN0YXRpYyBvcHRpb25QYXJhbXMocGFyYW1zOiBIdHRwUGFyYW1zLCBvcHRpb25zPzogSGFsT3B0aW9ucyk6IEh0dHBQYXJhbXMge1xyXG4gICAgICAgIGlmIChvcHRpb25zKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5wYXJhbXMpIHtcclxuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgcGFyYW0gb2Ygb3B0aW9ucy5wYXJhbXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBwYXJhbXMgPSBwYXJhbXMuYXBwZW5kKHBhcmFtLmtleSwgcGFyYW0udmFsdWUudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChvcHRpb25zLnNpemUpIHtcclxuICAgICAgICAgICAgICAgIHBhcmFtcyA9IHBhcmFtcy5hcHBlbmQoJ3NpemUnLCBvcHRpb25zLnNpemUudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChvcHRpb25zLnNvcnQpIHtcclxuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgcyBvZiBvcHRpb25zLnNvcnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgc29ydFN0cmluZyA9ICcnO1xyXG4gICAgICAgICAgICAgICAgICAgIHNvcnRTdHJpbmcgPSBzLnBhdGggPyBzb3J0U3RyaW5nLmNvbmNhdChzLnBhdGgpIDogc29ydFN0cmluZztcclxuICAgICAgICAgICAgICAgICAgICBzb3J0U3RyaW5nID0gcy5vcmRlciA/IHNvcnRTdHJpbmcuY29uY2F0KCcsJykuY29uY2F0KHMub3JkZXIpIDogc29ydFN0cmluZztcclxuICAgICAgICAgICAgICAgICAgICBwYXJhbXMgPSBwYXJhbXMuYXBwZW5kKCdzb3J0Jywgc29ydFN0cmluZyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBwYXJhbXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHJlc29sdmUgcmVzb3VyY2UgcmVsYXRpb25zICovXHJcbiAgICBzdGF0aWMgcmVzb2x2ZVJlbGF0aW9ucyhyZXNvdXJjZTogUmVzb3VyY2UpOiBPYmplY3Qge1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdDogYW55ID0ge307XHJcbiAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gcmVzb3VyY2UpIHtcclxuICAgICAgICAgICAgaWYgKCFpc051bGxPclVuZGVmaW5lZChyZXNvdXJjZVtrZXldKSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKFJlc291cmNlSGVscGVyLmNsYXNzTmFtZShyZXNvdXJjZVtrZXldKVxyXG4gICAgICAgICAgICAgICAgICAgIC5maW5kKChjbGFzc05hbWU6IHN0cmluZykgPT4gY2xhc3NOYW1lID09ICdSZXNvdXJjZScpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc291cmNlW2tleV1bJ19saW5rcyddKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRba2V5XSA9IHJlc291cmNlW2tleV1bJ19saW5rcyddWydzZWxmJ11bJ2hyZWYnXTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShyZXNvdXJjZVtrZXldKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBhcnJheTogYW55W10gPSByZXNvdXJjZVtrZXldO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhcnJheSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRba2V5XSA9IG5ldyBBcnJheSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhcnJheS5mb3JFYWNoKChlbGVtZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNQcmltaXRpdmUoZWxlbWVudCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRba2V5XS5wdXNoKGVsZW1lbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0W2tleV0ucHVzaCh0aGlzLnJlc29sdmVSZWxhdGlvbnMoZWxlbWVudCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdFtrZXldID0gcmVzb3VyY2Vba2V5XTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0IGFzIE9iamVjdDtcclxuICAgIH1cclxuXHJcbiAgICAvKiogY3JlYXRlIGFuIGVtcHR5IHJlc291cmNlIGZyb20gZW1iZWRkZWQgZGF0YSovXHJcbiAgICBzdGF0aWMgY3JlYXRlRW1wdHlSZXN1bHQ8VCBleHRlbmRzIFJlc291cmNlPihfZW1iZWRkZWQ6IHN0cmluZyk6IFJlc291cmNlQXJyYXk8VD4ge1xyXG4gICAgICAgIGxldCByZXNvdXJjZUFycmF5OiBSZXNvdXJjZUFycmF5PFQ+ID0gbmV3IFJlc291cmNlQXJyYXk8VD4oKTtcclxuICAgICAgICByZXNvdXJjZUFycmF5Ll9lbWJlZGRlZCA9IF9lbWJlZGRlZDtcclxuICAgICAgICByZXR1cm4gcmVzb3VyY2VBcnJheTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHJlc291cmNlIGNsYXNzIG5hbWUqL1xyXG4gICAgc3RhdGljIGdldENsYXNzTmFtZShvYmo6IGFueSk6IHN0cmluZyB7XHJcbiAgICAgICAgdmFyIGZ1bmNOYW1lUmVnZXggPSAvZnVuY3Rpb24gKC4rPylcXCgvO1xyXG4gICAgICAgIHZhciByZXN1bHRzID0gKGZ1bmNOYW1lUmVnZXgpLmV4ZWMob2JqLmNvbnN0cnVjdG9yLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgIHJldHVybiAocmVzdWx0cyAmJiByZXN1bHRzLmxlbmd0aCA+IDEpID8gcmVzdWx0c1sxXSA6ICcnO1xyXG4gICAgfVxyXG5cclxuICAgIFxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBjbGFzcyBuYW1lIGZyb20gYSBwcm90b3R5cGUgb2JqZWN0Ki9cclxuICAgIHN0YXRpYyBjbGFzc05hbWUob2JqUHJvdG86IGFueSk6IHN0cmluZ1tdIHtcclxuICAgICAgICBsZXQgY2xhc3NOYW1lcyA9IFtdO1xyXG4gICAgICAgIGxldCBvYmogPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqUHJvdG8pO1xyXG4gICAgICAgIGxldCBjbGFzc05hbWU6IHN0cmluZztcclxuXHJcbiAgICAgICAgd2hpbGUgKChjbGFzc05hbWUgPSBSZXNvdXJjZUhlbHBlci5nZXRDbGFzc05hbWUob2JqKSkgIT09ICdPYmplY3QnKSB7XHJcbiAgICAgICAgICAgIGNsYXNzTmFtZXMucHVzaChjbGFzc05hbWUpO1xyXG4gICAgICAgICAgICBvYmogPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBjbGFzc05hbWVzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBpbnN0YW50aWF0ZSBhIFJlc291cmNlQ29sbGVjdGlvbiBmcm9tIHJlc3BvbnNlIGVtYmVkZGVkIGRhdGEqL1xyXG4gICAgc3RhdGljIGluc3RhbnRpYXRlUmVzb3VyY2VDb2xsZWN0aW9uPFQgZXh0ZW5kcyBSZXNvdXJjZT4odHlwZTogeyBuZXcoKTogVCB9LCBwYXlsb2FkOiBhbnksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQ6IFJlc291cmNlQXJyYXk8VD4sIGJ1aWxkZXI/OiBTdWJUeXBlQnVpbGRlcik6IFJlc291cmNlQXJyYXk8VD4ge1xyXG4gICAgICAgIGZvciAoY29uc3QgZW1iZWRkZWRDbGFzc05hbWUgb2YgT2JqZWN0LmtleXMocGF5bG9hZFtyZXN1bHQuX2VtYmVkZGVkXSkpIHtcclxuICAgICAgICAgICAgbGV0IGVtYmVkZGVkOiBhbnkgPSBwYXlsb2FkW3Jlc3VsdC5fZW1iZWRkZWRdO1xyXG4gICAgICAgICAgICBjb25zdCBpdGVtcyA9IGVtYmVkZGVkW2VtYmVkZGVkQ2xhc3NOYW1lXTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaXRlbSBvZiBpdGVtcykge1xyXG4gICAgICAgICAgICAgICAgbGV0IGluc3RhbmNlOiBUID0gbmV3IHR5cGUoKTtcclxuICAgICAgICAgICAgICAgIGluc3RhbmNlID0gdGhpcy5zZWFyY2hTdWJ0eXBlcyhidWlsZGVyLCBlbWJlZGRlZENsYXNzTmFtZSwgaW5zdGFuY2UpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuaW5zdGFudGlhdGVSZXNvdXJjZShpbnN0YW5jZSwgaXRlbSk7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChpbnN0YW5jZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJlc3VsdC50b3RhbEVsZW1lbnRzID0gcGF5bG9hZC5wYWdlID8gcGF5bG9hZC5wYWdlLnRvdGFsRWxlbWVudHMgOiByZXN1bHQubGVuZ3RoO1xyXG4gICAgICAgIHJlc3VsdC50b3RhbFBhZ2VzID0gcGF5bG9hZC5wYWdlID8gcGF5bG9hZC5wYWdlLnRvdGFsUGFnZXMgOiAxO1xyXG4gICAgICAgIHJlc3VsdC5wYWdlTnVtYmVyID0gcGF5bG9hZC5wYWdlID8gcGF5bG9hZC5wYWdlLm51bWJlciA6IDE7XHJcbiAgICAgICAgcmVzdWx0LnBhZ2VTaXplID0gcGF5bG9hZC5wYWdlID8gcGF5bG9hZC5wYWdlLnNpemUgOiAyMDtcclxuXHJcbiAgICAgICAgcmVzdWx0LnNlbGZfdXJpID0gcGF5bG9hZC5fbGlua3MgJiYgcGF5bG9hZC5fbGlua3Muc2VsZiA/IHBheWxvYWQuX2xpbmtzLnNlbGYuaHJlZiA6IHVuZGVmaW5lZDtcclxuICAgICAgICByZXN1bHQubmV4dF91cmkgPSBwYXlsb2FkLl9saW5rcyAmJiBwYXlsb2FkLl9saW5rcy5uZXh0ID8gcGF5bG9hZC5fbGlua3MubmV4dC5ocmVmIDogdW5kZWZpbmVkO1xyXG4gICAgICAgIHJlc3VsdC5wcmV2X3VyaSA9IHBheWxvYWQuX2xpbmtzICYmIHBheWxvYWQuX2xpbmtzLnByZXYgPyBwYXlsb2FkLl9saW5rcy5wcmV2LmhyZWYgOiB1bmRlZmluZWQ7XHJcbiAgICAgICAgcmVzdWx0LmZpcnN0X3VyaSA9IHBheWxvYWQuX2xpbmtzICYmIHBheWxvYWQuX2xpbmtzLmZpcnN0ID8gcGF5bG9hZC5fbGlua3MuZmlyc3QuaHJlZiA6IHVuZGVmaW5lZDtcclxuICAgICAgICByZXN1bHQubGFzdF91cmkgPSBwYXlsb2FkLl9saW5rcyAmJiBwYXlsb2FkLl9saW5rcy5sYXN0ID8gcGF5bG9hZC5fbGlua3MubGFzdC5ocmVmIDogdW5kZWZpbmVkO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHNlYXJjaCBzdWJ0eXBlcyovXHJcbiAgICBzdGF0aWMgc2VhcmNoU3VidHlwZXM8VCBleHRlbmRzIFJlc291cmNlPihidWlsZGVyOiBTdWJUeXBlQnVpbGRlciwgZW1iZWRkZWRDbGFzc05hbWU6IHN0cmluZywgaW5zdGFuY2U6IFQpIHtcclxuICAgICAgICBpZiAoYnVpbGRlciAmJiBidWlsZGVyLnN1YnR5cGVzKSB7XHJcbiAgICAgICAgICAgIGxldCBrZXlzID0gYnVpbGRlci5zdWJ0eXBlcy5rZXlzKCk7XHJcbiAgICAgICAgICAgIEFycmF5LmZyb20oa2V5cykuZm9yRWFjaCgoc3VidHlwZUtleTogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZW1iZWRkZWRDbGFzc05hbWUudG9Mb3dlckNhc2UoKS5zdGFydHNXaXRoKHN1YnR5cGVLZXkudG9Mb3dlckNhc2UoKSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgc3VidHlwZTogeyBuZXcoKTogYW55IH0gPSBidWlsZGVyLnN1YnR5cGVzLmdldChzdWJ0eXBlS2V5KTtcclxuICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZSA9IG5ldyBzdWJ0eXBlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gaW5zdGFuY2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGluc3RhbnRpYXRlIGEgUmVzb3VyY2UgZnJvbSByZXNwb25zZSAqL1xyXG4gICAgc3RhdGljIGluc3RhbnRpYXRlUmVzb3VyY2U8VCBleHRlbmRzIFJlc291cmNlPihlbnRpdHk6IFQsIHBheWxvYWQ6IE9iamVjdCk6IFQge1xyXG4gICAgICAgIGZvciAoY29uc3QgcCBpbiBwYXlsb2FkKSB7XHJcbiAgICAgICAgICAgIC8vVE9ETyBhcnJheSBpbml0XHJcbiAgICAgICAgICAgIC8qIGlmKGVudGl0eVtwXS5jb25zdHJ1Y3RvciA9PT0gQXJyYXkgJiYgaXNOdWxsT3JVbmRlZmluZWQocGF5bG9hZFtwXSkpXHJcbiAgICAgICAgICAgICAgICAgZW50aXR5W3BdID0gW107XHJcbiAgICAgICAgICAgICBlbHNlKi9cclxuICAgICAgICAgICAgZW50aXR5W3BdID0gcGF5bG9hZFtwXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGVudGl0eTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogc2V0IHByb3h5IFVSTCAqL1xyXG4gICAgc3RhdGljIHNldFByb3h5VXJpKHByb3h5X3VyaTogc3RyaW5nKSB7XHJcbiAgICAgICAgUmVzb3VyY2VIZWxwZXIucHJveHlfdXJpID0gcHJveHlfdXJpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBzZXQgUm9vdCBVUkkgKi9cclxuICAgIHN0YXRpYyBzZXRSb290VXJpKHJvb3RfdXJpOiBzdHJpbmcpIHtcclxuICAgICAgICBSZXNvdXJjZUhlbHBlci5yb290X3VyaSA9IHJvb3RfdXJpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgcHJveHkgVVJMICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldFVSTCgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5wcm94eV91cmkgJiYgUmVzb3VyY2VIZWxwZXIucHJveHlfdXJpICE9ICcnID9cclxuICAgICAgICAgICAgUmVzb3VyY2VIZWxwZXIuYWRkU2xhc2goUmVzb3VyY2VIZWxwZXIucHJveHlfdXJpKSA6XHJcbiAgICAgICAgICAgIFJlc291cmNlSGVscGVyLmFkZFNsYXNoKFJlc291cmNlSGVscGVyLnJvb3RfdXJpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogYWRkIHNsYXNoIHRvIFVSSSAqL1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgYWRkU2xhc2godXJpOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgIGxldCB1cmlQYXJzZWQgPSB1cmwucGFyc2UodXJpKTtcclxuICAgICAgICBpZiAoaXNOdWxsT3JVbmRlZmluZWQodXJpUGFyc2VkLnNlYXJjaCkgJiYgdXJpICYmIHVyaVt1cmkubGVuZ3RoIC0gMV0gIT0gJy8nKVxyXG4gICAgICAgICAgICByZXR1cm4gdXJpICsgJy8nO1xyXG4gICAgICAgIHJldHVybiB1cmk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCBwcm94eSBmcm9tIFVSTCAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBnZXRQcm94eSh1cmw6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgaWYgKCFSZXNvdXJjZUhlbHBlci5wcm94eV91cmkgfHwgUmVzb3VyY2VIZWxwZXIucHJveHlfdXJpID09ICcnKVxyXG4gICAgICAgICAgICByZXR1cm4gdXJsO1xyXG4gICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5hZGRTbGFzaCh1cmwucmVwbGFjZShSZXNvdXJjZUhlbHBlci5yb290X3VyaSwgUmVzb3VyY2VIZWxwZXIucHJveHlfdXJpKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHNldCBIdHRwQ2xpZW50Ki9cclxuICAgIHB1YmxpYyBzdGF0aWMgc2V0SHR0cChodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICAgICAgUmVzb3VyY2VIZWxwZXIuaHR0cCA9IGh0dHA7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCBIdHRwQ2xpZW50Ki9cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0SHR0cCgpOiBIdHRwQ2xpZW50IHtcclxuICAgICAgICByZXR1cm4gUmVzb3VyY2VIZWxwZXIuaHR0cDtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHJvb3QgVVJJKi9cclxuICAgIHN0YXRpYyBnZXRSb290VXJpKCkge1xyXG4gICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5yb290X3VyaTtcclxuICAgIH1cclxufVxyXG4iLCJcclxuaW1wb3J0IHt0aHJvd0Vycm9yIGFzIG9ic2VydmFibGVUaHJvd0Vycm9yLCBvZiBhcyBvYnNlcnZhYmxlT2Z9IGZyb20gJ3J4anMnO1xyXG5cclxuaW1wb3J0IHttYXB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuXHJcblxyXG5pbXBvcnQge0h0dHBQYXJhbXN9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHtSZXNvdXJjZUhlbHBlcn0gZnJvbSAnLi9yZXNvdXJjZS1oZWxwZXInO1xyXG5pbXBvcnQge1Jlc291cmNlQXJyYXl9IGZyb20gJy4vcmVzb3VyY2UtYXJyYXknO1xyXG5pbXBvcnQge2lzTnVsbE9yVW5kZWZpbmVkfSBmcm9tICd1dGlsJztcclxuXHJcbmltcG9ydCB7SGFsT3B0aW9uc30gZnJvbSAnLi9yZXN0LnNlcnZpY2UnO1xyXG5pbXBvcnQge1N1YlR5cGVCdWlsZGVyfSBmcm9tICcuL3N1YnR5cGUtYnVpbGRlcic7XHJcbmltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7T2JzZXJ2YWJsZX0gZnJvbSAncnhqcy9pbnRlcm5hbC9PYnNlcnZhYmxlJztcclxuXHJcbi8qKiBBYnN0cmFjdCByZXNvdXJjZSBjbGFzcyovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFJlc291cmNlIHtcclxuXHJcbiAgICAvKiogcHJveHkgVVJMICovXHJcbiAgICBwdWJsaWMgcHJveHlVcmw6IHN0cmluZztcclxuICAgIC8qKiByb290IFVSTCAqL1xyXG4gICAgcHVibGljIHJvb3RVcmw6IHN0cmluZztcclxuXHJcbiAgICAvKiogbGlua3MgKi9cclxuICAgIHB1YmxpYyBfbGlua3M6IGFueTtcclxuICAgIC8qKiBzdWJ0eXBlcyAqL1xyXG4gICAgcHVibGljIF9zdWJ0eXBlczogTWFwPHN0cmluZywgYW55PjtcclxuXHJcbiAgICBcclxuICAgIC8qKiBnZXQgc3VidHlwZXMgKi8gICAgXHJcbiAgICBwdWJsaWMgZ2V0IHN1YnR5cGVzKCk6IE1hcDxzdHJpbmcsIGFueT4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zdWJ0eXBlcztcclxuICAgIH1cclxuXHJcbiAgICAvKiogc2V0IHN1YnR5cGVzICovXHJcbiAgICBwdWJsaWMgc2V0IHN1YnR5cGVzKF9zdWJ0eXBlczogTWFwPHN0cmluZywgYW55Pikge1xyXG4gICAgICAgIHRoaXMuX3N1YnR5cGVzID0gX3N1YnR5cGVzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBjb25zdHJ1Y3RvciovXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIH1cclxuXHJcbiAgICAvKiogR2V0IGNvbGxlY3Rpb24gb2YgcmVsYXRlZCByZXNvdXJjZXMgKi9cclxuICAgIHB1YmxpYyBnZXRSZWxhdGlvbkFycmF5PFQgZXh0ZW5kcyBSZXNvdXJjZT4odHlwZTogeyBuZXcoKTogVCB9LCByZWxhdGlvbjogc3RyaW5nLCBfZW1iZWRkZWQ/OiBzdHJpbmcsIG9wdGlvbnM/OiBIYWxPcHRpb25zLCBidWlsZGVyPzogU3ViVHlwZUJ1aWxkZXIpOiBPYnNlcnZhYmxlPFRbXT4ge1xyXG5cclxuICAgICAgICBjb25zdCBwYXJhbXMgPSBSZXNvdXJjZUhlbHBlci5vcHRpb25QYXJhbXMobmV3IEh0dHBQYXJhbXMoKSwgb3B0aW9ucyk7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0OiBSZXNvdXJjZUFycmF5PFQ+ID0gUmVzb3VyY2VIZWxwZXIuY3JlYXRlRW1wdHlSZXN1bHQ8VD4oaXNOdWxsT3JVbmRlZmluZWQoX2VtYmVkZGVkKSA/IFwiX2VtYmVkZGVkXCIgOiBfZW1iZWRkZWQpO1xyXG4gICAgICAgIGlmICghaXNOdWxsT3JVbmRlZmluZWQodGhpcy5fbGlua3MpICYmICFpc051bGxPclVuZGVmaW5lZCh0aGlzLl9saW5rc1tyZWxhdGlvbl0pKSB7XHJcbiAgICAgICAgICAgIGxldCBvYnNlcnZhYmxlID0gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLmdldChSZXNvdXJjZUhlbHBlci5nZXRQcm94eSh0aGlzLl9saW5rc1tyZWxhdGlvbl0uaHJlZiksIHtcclxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IFJlc291cmNlSGVscGVyLmhlYWRlcnMsXHJcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHBhcmFtc1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIG9ic2VydmFibGUucGlwZShtYXAocmVzcG9uc2UgPT4gUmVzb3VyY2VIZWxwZXIuaW5zdGFudGlhdGVSZXNvdXJjZUNvbGxlY3Rpb248VD4odHlwZSwgcmVzcG9uc2UsIHJlc3VsdCwgYnVpbGRlcikpLFxyXG4gICAgICAgICAgICAgICAgbWFwKChhcnJheTogUmVzb3VyY2VBcnJheTxUPikgPT4gYXJyYXkucmVzdWx0KSwpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBvYnNlcnZhYmxlT2YoW10pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKiogR2V0IHJlbGF0ZWQgcmVzb3VyY2UgKi9cclxuICAgIHB1YmxpYyBnZXRSZWxhdGlvbjxUIGV4dGVuZHMgUmVzb3VyY2U+KHR5cGU6IHsgbmV3KCk6IFQgfSwgcmVsYXRpb246IHN0cmluZywgYnVpbGRlcj86IFN1YlR5cGVCdWlsZGVyKTogT2JzZXJ2YWJsZTxUPiB7XHJcbiAgICAgICAgbGV0IHJlc3VsdDogVCA9IG5ldyB0eXBlKCk7XHJcbiAgICAgICAgaWYgKCFpc051bGxPclVuZGVmaW5lZCh0aGlzLl9saW5rcykgJiYgIWlzTnVsbE9yVW5kZWZpbmVkKHRoaXMuX2xpbmtzW3JlbGF0aW9uXSkpIHtcclxuICAgICAgICAgICAgbGV0IG9ic2VydmFibGUgPSBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkuZ2V0KFJlc291cmNlSGVscGVyLmdldFByb3h5KHRoaXMuX2xpbmtzW3JlbGF0aW9uXS5ocmVmKSwge2hlYWRlcnM6IFJlc291cmNlSGVscGVyLmhlYWRlcnN9KTtcclxuICAgICAgICAgICAgcmV0dXJuIG9ic2VydmFibGUucGlwZShtYXAoKGRhdGE6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGJ1aWxkZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGVtYmVkZGVkQ2xhc3NOYW1lIG9mIE9iamVjdC5rZXlzKGRhdGFbJ19saW5rcyddKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZW1iZWRkZWRDbGFzc05hbWUgPT0gJ3NlbGYnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgaHJlZjogc3RyaW5nID0gZGF0YS5fbGlua3NbZW1iZWRkZWRDbGFzc05hbWVdLmhyZWY7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgaWR4OiBudW1iZXIgPSBocmVmLmxhc3RJbmRleE9mKCcvJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVhbENsYXNzTmFtZSA9IGhyZWYucmVwbGFjZShSZXNvdXJjZUhlbHBlci5nZXRSb290VXJpKCksIFwiXCIpLnN1YnN0cmluZygwLCBpZHgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gUmVzb3VyY2VIZWxwZXIuc2VhcmNoU3VidHlwZXMoYnVpbGRlciwgcmVhbENsYXNzTmFtZSwgcmVzdWx0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLmluc3RhbnRpYXRlUmVzb3VyY2UocmVzdWx0LCBkYXRhKTtcclxuICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBvYnNlcnZhYmxlT2YobnVsbCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKiBBZGRzIHRoZSBnaXZlbiByZXNvdXJjZSB0byB0aGUgYm91bmQgY29sbGVjdGlvbiBieSB0aGUgcmVsYXRpb24gKi9cclxuICAgIHB1YmxpYyBhZGRSZWxhdGlvbjxUIGV4dGVuZHMgUmVzb3VyY2U+KHJlbGF0aW9uOiBzdHJpbmcsIHJlc291cmNlOiBUKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgICAgICBpZiAoIWlzTnVsbE9yVW5kZWZpbmVkKHRoaXMuX2xpbmtzKSAmJiAhaXNOdWxsT3JVbmRlZmluZWQodGhpcy5fbGlua3NbcmVsYXRpb25dKSkge1xyXG4gICAgICAgICAgICBsZXQgaGVhZGVyID0gUmVzb3VyY2VIZWxwZXIuaGVhZGVycy5hcHBlbmQoJ0NvbnRlbnQtVHlwZScsICd0ZXh0L3VyaS1saXN0Jyk7XHJcbiAgICAgICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkucG9zdChSZXNvdXJjZUhlbHBlci5nZXRQcm94eSh0aGlzLl9saW5rc1tyZWxhdGlvbl0uaHJlZiksIHJlc291cmNlLl9saW5rcy5zZWxmLmhyZWYsIHtoZWFkZXJzOiBoZWFkZXJ9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZVRocm93RXJyb3IoJ25vIHJlbGF0aW9uIGZvdW5kJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKiBCaW5kIHRoZSBnaXZlbiByZXNvdXJjZSB0byB0aGlzIHJlc291cmNlIGJ5IHRoZSBnaXZlbiByZWxhdGlvbiovXHJcbiAgICBwdWJsaWMgdXBkYXRlUmVsYXRpb248VCBleHRlbmRzIFJlc291cmNlPihyZWxhdGlvbjogc3RyaW5nLCByZXNvdXJjZTogVCk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICAgICAgaWYgKCFpc051bGxPclVuZGVmaW5lZCh0aGlzLl9saW5rcykgJiYgIWlzTnVsbE9yVW5kZWZpbmVkKHRoaXMuX2xpbmtzW3JlbGF0aW9uXSkpIHtcclxuICAgICAgICAgICAgbGV0IGhlYWRlciA9IFJlc291cmNlSGVscGVyLmhlYWRlcnMuYXBwZW5kKCdDb250ZW50LVR5cGUnLCAndGV4dC91cmktbGlzdCcpO1xyXG4gICAgICAgICAgICByZXR1cm4gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLnBhdGNoKFJlc291cmNlSGVscGVyLmdldFByb3h5KHRoaXMuX2xpbmtzW3JlbGF0aW9uXS5ocmVmKSwgcmVzb3VyY2UuX2xpbmtzLnNlbGYuaHJlZiwge2hlYWRlcnM6IGhlYWRlcn0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBvYnNlcnZhYmxlVGhyb3dFcnJvcignbm8gcmVsYXRpb24gZm91bmQnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEJpbmQgdGhlIGdpdmVuIHJlc291cmNlIHRvIHRoaXMgcmVzb3VyY2UgYnkgdGhlIGdpdmVuIHJlbGF0aW9uKi9cclxuICAgIHB1YmxpYyBzdWJzdGl0dXRlUmVsYXRpb248VCBleHRlbmRzIFJlc291cmNlPihyZWxhdGlvbjogc3RyaW5nLCByZXNvdXJjZTogVCk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICAgICAgaWYgKCFpc051bGxPclVuZGVmaW5lZCh0aGlzLl9saW5rcykgJiYgIWlzTnVsbE9yVW5kZWZpbmVkKHRoaXMuX2xpbmtzW3JlbGF0aW9uXSkpIHtcclxuICAgICAgICAgICAgbGV0IGhlYWRlciA9IFJlc291cmNlSGVscGVyLmhlYWRlcnMuYXBwZW5kKCdDb250ZW50LVR5cGUnLCAndGV4dC91cmktbGlzdCcpO1xyXG4gICAgICAgICAgICByZXR1cm4gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLnB1dChSZXNvdXJjZUhlbHBlci5nZXRQcm94eSh0aGlzLl9saW5rc1tyZWxhdGlvbl0uaHJlZiksIHJlc291cmNlLl9saW5rcy5zZWxmLmhyZWYsIHtoZWFkZXJzOiBoZWFkZXJ9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZVRocm93RXJyb3IoJ25vIHJlbGF0aW9uIGZvdW5kJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBcclxuICAgIC8qKiBCaW5kIHRoZSBnaXZlbiByZXNvdXJjZSB0byB0aGlzIHJlc291cmNlIGJ5IHRoZSBnaXZlbiByZWxhdGlvbiovXHJcbiAgICBwdWJsaWMgc3Vic3RpdHV0ZUFsbFJlbGF0aW9uPFQgZXh0ZW5kcyBSZXNvdXJjZT4ocmVsYXRpb246IHN0cmluZywgcmVzb3VyY2VzOiBSZXNvdXJjZVtdKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgICAgICBpZiAoIWlzTnVsbE9yVW5kZWZpbmVkKHRoaXMuX2xpbmtzKSAmJiAhaXNOdWxsT3JVbmRlZmluZWQodGhpcy5fbGlua3NbcmVsYXRpb25dKSkge1xyXG4gICAgICAgICAgICBsZXQgaGVhZGVyID0gUmVzb3VyY2VIZWxwZXIuaGVhZGVycy5hcHBlbmQoJ0NvbnRlbnQtVHlwZScsICd0ZXh0L3VyaS1saXN0Jyk7XHJcbiAgICAgICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkucHV0KFJlc291cmNlSGVscGVyLmdldFByb3h5KHRoaXMuX2xpbmtzW3JlbGF0aW9uXS5ocmVmKSwgcmVzb3VyY2VzLm1hcCgocmVzb3VyY2UpID0+IHJlc291cmNlLl9saW5rcy5zZWxmLmhyZWYpLCB7aGVhZGVyczogaGVhZGVyfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIG9ic2VydmFibGVUaHJvd0Vycm9yKCdubyByZWxhdGlvbiBmb3VuZCcpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIC8qKiBVbmJpbmQgdGhlIHJlc291cmNlIHdpdGggdGhlIGdpdmVuIHJlbGF0aW9uIGZyb20gdGhpcyByZXNvdXJjZSovXHJcbiAgICBwdWJsaWMgZGVsZXRlUmVsYXRpb248VCBleHRlbmRzIFJlc291cmNlPihyZWxhdGlvbjogc3RyaW5nLCByZXNvdXJjZTogVCk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICAgICAgaWYgKCFpc051bGxPclVuZGVmaW5lZCh0aGlzLl9saW5rcykgJiYgIWlzTnVsbE9yVW5kZWZpbmVkKHJlc291cmNlLl9saW5rcykpIHtcclxuICAgICAgICAgICAgbGV0IGxpbms6IHN0cmluZyA9IHJlc291cmNlLl9saW5rc1snc2VsZiddLmhyZWY7XHJcbiAgICAgICAgICAgIGxldCBpZHg6IG51bWJlciA9IGxpbmsubGFzdEluZGV4T2YoJy8nKSArIDE7XHJcblxyXG4gICAgICAgICAgICBpZiAoaWR4ID09IC0xKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG9ic2VydmFibGVUaHJvd0Vycm9yKCdubyByZWxhdGlvbiBmb3VuZCcpO1xyXG5cclxuICAgICAgICAgICAgbGV0IHJlbGF0aW9uSWQ6IHN0cmluZyA9IGxpbmsuc3Vic3RyaW5nKGlkeCk7XHJcbiAgICAgICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkuZGVsZXRlKFJlc291cmNlSGVscGVyLmdldFByb3h5KHRoaXMuX2xpbmtzW3JlbGF0aW9uXS5ocmVmICsgJy8nICsgcmVsYXRpb25JZCksIHtoZWFkZXJzOiBSZXNvdXJjZUhlbHBlci5oZWFkZXJzfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIG9ic2VydmFibGVUaHJvd0Vycm9yKCdubyByZWxhdGlvbiBmb3VuZCcpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoqIFVuYmluZCB0aGUgcmVzb3VyY2Ugd2l0aCB0aGUgZ2l2ZW4gcmVsYXRpb24gZnJvbSB0aGlzIHJlc291cmNlKi9cclxuICAgIHB1YmxpYyBkZWxldGVBbGxSZWxhdGlvbjxUIGV4dGVuZHMgUmVzb3VyY2U+KHJlbGF0aW9uOiBzdHJpbmcpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkuZGVsZXRlKFJlc291cmNlSGVscGVyLmdldFByb3h5KHRoaXMuX2xpbmtzW3JlbGF0aW9uXS5ocmVmICksIHtoZWFkZXJzOiBSZXNvdXJjZUhlbHBlci5oZWFkZXJzfSk7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG59IiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcbmltcG9ydCB7IFVzZXJDb25maWd1cmF0aW9uIH0gZnJvbSAnLi91c2VyLWNvbmZpZ3VyYXRpb24ubW9kZWwnO1xyXG5pbXBvcnQgeyBVc2VyUG9zaXRpb24gfSBmcm9tICcuL3VzZXItcG9zaXRpb24ubW9kZWwnO1xyXG5cclxuLyoqXHJcbiAqIFVzZXIgbW9kZWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBVc2VyIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiBpZCAqL1xyXG4gIHB1YmxpYyBpZDogbnVtYmVyOyAgXHJcbiAgLyoqIHVzZXJuYW1lICovXHJcbiAgcHVibGljIHVzZXJuYW1lOiBzdHJpbmc7XHJcbiAgLyoqIHBhc3N3b3JkICovXHJcbiAgcHVibGljIHBhc3N3b3JkOiBzdHJpbmc7XHJcbiAgLyoqIGZpcnN0IG5hbWUgKi9cclxuICBwdWJsaWMgZmlyc3ROYW1lOiBzdHJpbmc7XHJcbiAgLyoqIGxhc3QgbmFtZSAqL1xyXG4gIHB1YmxpYyBsYXN0TmFtZTogc3RyaW5nO1xyXG4gIC8qKiB3aGV0aGVyIHVzZXIgaXMgYmxvY2tlZCAqL1xyXG4gIHB1YmxpYyBibG9ja2VkOiBib29sZWFuO1xyXG4gIC8qKiB3aGV0aGVyIHVzZXIgaXMgYWRtaW5pc3RyYXRvciAqL1xyXG4gIHB1YmxpYyBhZG1pbmlzdHJhdG9yOiBib29sZWFuO1xyXG4gIC8qKiB1c2VyIHBvc2l0aW9ucyAqL1xyXG4gIHB1YmxpYyBwb3NpdGlvbnM6IFVzZXJQb3NpdGlvbltdO1xyXG4gIC8qKiB1c2VyIHBlcm1pc3Npb25zICovXHJcbiAgcHVibGljIHBlcm1pc3Npb25zOiBVc2VyQ29uZmlndXJhdGlvbltdO1xyXG59XHJcbiIsImltcG9ydCB7SHR0cENsaWVudH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQge0luamVjdCwgSW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7UmVzb3VyY2VIZWxwZXJ9IGZyb20gJy4vcmVzb3VyY2UtaGVscGVyJztcclxuaW1wb3J0IHtFeHRlcm5hbENvbmZpZ3VyYXRpb25IYW5kbGVySW50ZXJmYWNlfSBmcm9tICcuL2V4dGVybmFsLWNvbmZpZ3VyYXRpb24uaGFuZGxlcic7XHJcbmltcG9ydCB7RXh0ZXJuYWxDb25maWd1cmF0aW9ufSBmcm9tICcuL0V4dGVybmFsQ29uZmlndXJhdGlvbic7XHJcblxyXG5cclxuLyoqIEV4dGVybmFsU2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBFeHRlcm5hbFNlcnZpY2Uge1xyXG5cclxuICAgIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gICAgY29uc3RydWN0b3IoQEluamVjdCgnRXh0ZXJuYWxDb25maWd1cmF0aW9uU2VydmljZScpIHByaXZhdGUgZXh0ZXJuYWxDb25maWd1cmF0aW9uU2VydmljZTogRXh0ZXJuYWxDb25maWd1cmF0aW9uSGFuZGxlckludGVyZmFjZSkge1xyXG4gICAgICAgIFJlc291cmNlSGVscGVyLnNldFByb3h5VXJpKGV4dGVybmFsQ29uZmlndXJhdGlvblNlcnZpY2UuZ2V0UHJveHlVcmkoKSk7XHJcbiAgICAgICAgUmVzb3VyY2VIZWxwZXIuc2V0Um9vdFVyaShleHRlcm5hbENvbmZpZ3VyYXRpb25TZXJ2aWNlLmdldFJvb3RVcmkoKSk7XHJcbiAgICAgICAgUmVzb3VyY2VIZWxwZXIuc2V0SHR0cChleHRlcm5hbENvbmZpZ3VyYXRpb25TZXJ2aWNlLmdldEh0dHAoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHVwZGF0ZSBFeHRlcm5hbENvbmZpZ3VyYXRpb25IYW5kbGVyICovXHJcbiAgICBwdWJsaWMgdXBkYXRlRXh0ZXJuYWxDb25maWd1cmF0aW9uSGFuZGxlckludGVyZmFjZShleHRlcm5hbENvbmZpZ3VyYXRpb25TZXJ2aWNlOiBFeHRlcm5hbENvbmZpZ3VyYXRpb25IYW5kbGVySW50ZXJmYWNlKSB7XHJcblx0dGhpcy5leHRlcm5hbENvbmZpZ3VyYXRpb25TZXJ2aWNlID0gZXh0ZXJuYWxDb25maWd1cmF0aW9uU2VydmljZTtcclxuXHJcbiAgICAgICAgUmVzb3VyY2VIZWxwZXIuc2V0UHJveHlVcmkoZXh0ZXJuYWxDb25maWd1cmF0aW9uU2VydmljZS5nZXRQcm94eVVyaSgpKTtcclxuICAgICAgICBSZXNvdXJjZUhlbHBlci5zZXRSb290VXJpKGV4dGVybmFsQ29uZmlndXJhdGlvblNlcnZpY2UuZ2V0Um9vdFVyaSgpKTtcclxuICAgICAgICBSZXNvdXJjZUhlbHBlci5zZXRIdHRwKGV4dGVybmFsQ29uZmlndXJhdGlvblNlcnZpY2UuZ2V0SHR0cCgpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IEV4dGVybmFsQ29uZmlndXJhdGlvbiAqL1xyXG4gICAgcHVibGljIGdldEV4dGVybmFsQ29uZmlndXJhdGlvbigpOiBFeHRlcm5hbENvbmZpZ3VyYXRpb24ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmV4dGVybmFsQ29uZmlndXJhdGlvblNlcnZpY2UuZ2V0RXh0ZXJuYWxDb25maWd1cmF0aW9uKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCBwcm94eSBVUkwgKi9cclxuICAgIHB1YmxpYyBnZXRQcm94eVVyaSgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmV4dGVybmFsQ29uZmlndXJhdGlvblNlcnZpY2UuZ2V0UHJveHlVcmkoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IFJvb3QgVVJJICovXHJcbiAgICBwdWJsaWMgZ2V0Um9vdFVyaSgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmV4dGVybmFsQ29uZmlndXJhdGlvblNlcnZpY2UuZ2V0Um9vdFVyaSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgVVJMICovXHJcbiAgICBwdWJsaWMgZ2V0VVJMKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLmdldFVSTCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgSHR0cENsaWVudCAqL1xyXG4gICAgcHVibGljIGdldEh0dHAoKTogSHR0cENsaWVudCB7XHJcbiAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLmdldEh0dHAoKTtcclxuICAgIH1cclxufVxyXG4iLCJcclxuaW1wb3J0IHt0aHJvd0Vycm9yIGFzIG9ic2VydmFibGVUaHJvd0Vycm9yfSBmcm9tICdyeGpzJztcclxuXHJcbmltcG9ydCB7Y2F0Y2hFcnJvciwgbWFwfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcbmltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4vcmVzb3VyY2UnO1xyXG5pbXBvcnQge1Jlc291cmNlSGVscGVyfSBmcm9tICcuL3Jlc291cmNlLWhlbHBlcic7XHJcbmltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7SHR0cFBhcmFtcywgSHR0cFJlc3BvbnNlfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7U29ydH0gZnJvbSAnLi9zb3J0JztcclxuaW1wb3J0IHtSZXNvdXJjZUFycmF5fSBmcm9tICcuL3Jlc291cmNlLWFycmF5JztcclxuaW1wb3J0IHtFeHRlcm5hbFNlcnZpY2V9IGZyb20gJy4vZXh0ZXJuYWwuc2VydmljZSc7XHJcbmltcG9ydCB7SGFsT3B0aW9uc30gZnJvbSAnLi9yZXN0LnNlcnZpY2UnO1xyXG5pbXBvcnQge1N1YlR5cGVCdWlsZGVyfSBmcm9tICcuL3N1YnR5cGUtYnVpbGRlcic7XHJcbmltcG9ydCB7T2JzZXJ2YWJsZX0gZnJvbSAncnhqcy9pbnRlcm5hbC9PYnNlcnZhYmxlJztcclxuXHJcbi8qKiBSZXNvdXJjZVNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgUmVzb3VyY2VTZXJ2aWNlIHtcclxuXHJcblxyXG4gICAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGV4dGVybmFsU2VydmljZTogRXh0ZXJuYWxTZXJ2aWNlKSB7fVxyXG5cclxuXHJcbiAgICAvKiogZ2V0IFVSTCAqL1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZ2V0VVJMKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLmdldFVSTCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgYWxsIHJlc291cmNlcyBmcm9tIGEgYmFzZSBVUkkgb2YgYSBnaXZlbiB0eXBlICovXHJcbiAgICBwdWJsaWMgZ2V0QWxsPFQgZXh0ZW5kcyBSZXNvdXJjZT4odHlwZTogeyBuZXcoKTogVCB9LCByZXNvdXJjZTogc3RyaW5nLCBfZW1iZWRkZWQ6IHN0cmluZywgb3B0aW9ucz86IEhhbE9wdGlvbnMsIHN1YlR5cGU/OiBTdWJUeXBlQnVpbGRlcik6IE9ic2VydmFibGU8UmVzb3VyY2VBcnJheTxUPj4ge1xyXG4gICAgICAgIGNvbnN0IHVyaSA9IHRoaXMuZ2V0UmVzb3VyY2VVcmwocmVzb3VyY2UpLmNvbmNhdCgnP3Byb2plY3Rpb249dmlldycpO1xyXG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IFJlc291cmNlSGVscGVyLm9wdGlvblBhcmFtcyhuZXcgSHR0cFBhcmFtcygpLCBvcHRpb25zKTtcclxuICAgICAgICBjb25zdCByZXN1bHQ6IFJlc291cmNlQXJyYXk8VD4gPSBSZXNvdXJjZUhlbHBlci5jcmVhdGVFbXB0eVJlc3VsdDxUPihfZW1iZWRkZWQpO1xyXG5cclxuICAgICAgICB0aGlzLnNldFVybHMocmVzdWx0KTtcclxuICAgICAgICByZXN1bHQuc29ydEluZm8gPSBvcHRpb25zID8gb3B0aW9ucy5zb3J0IDogdW5kZWZpbmVkO1xyXG4gICAgICAgIGxldCBvYnNlcnZhYmxlID0gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLmdldCh1cmksIHtoZWFkZXJzOiBSZXNvdXJjZUhlbHBlci5oZWFkZXJzLCBwYXJhbXM6IHBhcmFtc30pO1xyXG4gICAgICAgIHJldHVybiBvYnNlcnZhYmxlLnBpcGUobWFwKHJlc3BvbnNlID0+IFJlc291cmNlSGVscGVyLmluc3RhbnRpYXRlUmVzb3VyY2VDb2xsZWN0aW9uKHR5cGUsIHJlc3BvbnNlLCByZXN1bHQsIHN1YlR5cGUpKSxcclxuICAgICAgICAgICAgY2F0Y2hFcnJvcihlcnJvciA9PiBvYnNlcnZhYmxlVGhyb3dFcnJvcihlcnJvcikpLCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBmcm9tIGEgYmFzZSBVUkkgYW5kIGEgZ2l2ZW4gaWQgKi9cclxuICAgIHB1YmxpYyBnZXQ8VCBleHRlbmRzIFJlc291cmNlPih0eXBlOiB7IG5ldygpOiBUIH0sIHJlc291cmNlOiBzdHJpbmcsIGlkOiBhbnkpOiBPYnNlcnZhYmxlPFQ+IHtcclxuICAgICAgICBjb25zdCB1cmkgPSB0aGlzLmdldFJlc291cmNlVXJsKHJlc291cmNlKS5jb25jYXQoJy8nLCBpZCwgJz9wcm9qZWN0aW9uPXZpZXcnKTtcclxuICAgICAgICBjb25zdCByZXN1bHQ6IFQgPSBuZXcgdHlwZSgpO1xyXG5cclxuICAgICAgICB0aGlzLnNldFVybHNSZXNvdXJjZShyZXN1bHQpO1xyXG4gICAgICAgIGxldCBvYnNlcnZhYmxlID0gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLmdldCh1cmksIHtoZWFkZXJzOiBSZXNvdXJjZUhlbHBlci5oZWFkZXJzfSk7XHJcbiAgICAgICAgcmV0dXJuIG9ic2VydmFibGUucGlwZShtYXAoZGF0YSA9PiBSZXNvdXJjZUhlbHBlci5pbnN0YW50aWF0ZVJlc291cmNlKHJlc3VsdCwgZGF0YSkpLFxyXG4gICAgICAgICAgICBjYXRjaEVycm9yKGVycm9yID0+IG9ic2VydmFibGVUaHJvd0Vycm9yKGVycm9yKSksKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHJlc291cmNlIGZyb20gaXRzIHNlbGZsaW5rICovXHJcbiAgICBwdWJsaWMgZ2V0QnlTZWxmTGluazxUIGV4dGVuZHMgUmVzb3VyY2U+KHR5cGU6IHsgbmV3KCk6IFQgfSwgcmVzb3VyY2VMaW5rOiBzdHJpbmcpOiBPYnNlcnZhYmxlPFQ+IHtcclxuICAgICAgICBjb25zdCByZXN1bHQ6IFQgPSBuZXcgdHlwZSgpO1xyXG5cclxuICAgICAgICB0aGlzLnNldFVybHNSZXNvdXJjZShyZXN1bHQpO1xyXG4gICAgICAgIGxldCBvYnNlcnZhYmxlID0gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLmdldChSZXNvdXJjZUhlbHBlci5nZXRQcm94eShyZXNvdXJjZUxpbmspLCB7aGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVyc30pO1xyXG4gICAgICAgIHJldHVybiBvYnNlcnZhYmxlLnBpcGUobWFwKGRhdGEgPT4gUmVzb3VyY2VIZWxwZXIuaW5zdGFudGlhdGVSZXNvdXJjZShyZXN1bHQsIGRhdGEpKSxcclxuICAgICAgICAgICAgY2F0Y2hFcnJvcihlcnJvciA9PiBvYnNlcnZhYmxlVGhyb3dFcnJvcihlcnJvcikpLCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHNlYXJjaCByZXNvdXJjZXMgZnJvbSBhIGdpdmVuIGJhc2UgcGF0aCwgcXVlcnkgYW5kIG9wdGlvbnMgKi9cclxuICAgIHB1YmxpYyBzZWFyY2g8VCBleHRlbmRzIFJlc291cmNlPih0eXBlOiB7IG5ldygpOiBUIH0sIHF1ZXJ5OiBzdHJpbmcsIHJlc291cmNlOiBzdHJpbmcsIF9lbWJlZGRlZDogc3RyaW5nLCBvcHRpb25zPzogSGFsT3B0aW9ucyk6IE9ic2VydmFibGU8UmVzb3VyY2VBcnJheTxUPj4ge1xyXG4gICAgICAgIGNvbnN0IHVyaSA9IHRoaXMuZ2V0UmVzb3VyY2VVcmwocmVzb3VyY2UpLmNvbmNhdCgnL3NlYXJjaC8nLCBxdWVyeSk7XHJcbiAgICAgICAgY29uc3QgcGFyYW1zID0gUmVzb3VyY2VIZWxwZXIub3B0aW9uUGFyYW1zKG5ldyBIdHRwUGFyYW1zKCksIG9wdGlvbnMpO1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdDogUmVzb3VyY2VBcnJheTxUPiA9IFJlc291cmNlSGVscGVyLmNyZWF0ZUVtcHR5UmVzdWx0PFQ+KF9lbWJlZGRlZCk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0VXJscyhyZXN1bHQpO1xyXG4gICAgICAgIGxldCBvYnNlcnZhYmxlID0gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLmdldCh1cmksIHtoZWFkZXJzOiBSZXNvdXJjZUhlbHBlci5oZWFkZXJzLCBwYXJhbXM6IHBhcmFtc30pO1xyXG4gICAgICAgIHJldHVybiBvYnNlcnZhYmxlLnBpcGUobWFwKHJlc3BvbnNlID0+IFJlc291cmNlSGVscGVyLmluc3RhbnRpYXRlUmVzb3VyY2VDb2xsZWN0aW9uKHR5cGUsIHJlc3BvbnNlLCByZXN1bHQpKSxcclxuICAgICAgICAgICAgY2F0Y2hFcnJvcihlcnJvciA9PiBvYnNlcnZhYmxlVGhyb3dFcnJvcihlcnJvcikpLCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHNlYXJjaCBhIHNpbmdsZSByZXNvdXJjZSBmcm9tIGEgZ2l2ZW4gYmFzZSBwYXRoLCBxdWVyeSBhbmQgb3B0aW9ucyAqL1xyXG4gICAgcHVibGljIHNlYXJjaFNpbmdsZTxUIGV4dGVuZHMgUmVzb3VyY2U+KHR5cGU6IHsgbmV3KCk6IFQgfSwgcXVlcnk6IHN0cmluZywgcmVzb3VyY2U6IHN0cmluZywgb3B0aW9ucz86IEhhbE9wdGlvbnMpOiBPYnNlcnZhYmxlPFQ+IHtcclxuICAgICAgICBjb25zdCB1cmkgPSB0aGlzLmdldFJlc291cmNlVXJsKHJlc291cmNlKS5jb25jYXQoJy9zZWFyY2gvJywgcXVlcnkpO1xyXG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IFJlc291cmNlSGVscGVyLm9wdGlvblBhcmFtcyhuZXcgSHR0cFBhcmFtcygpLCBvcHRpb25zKTtcclxuICAgICAgICBjb25zdCByZXN1bHQ6IFQgPSBuZXcgdHlwZSgpO1xyXG5cclxuICAgICAgICB0aGlzLnNldFVybHNSZXNvdXJjZShyZXN1bHQpO1xyXG4gICAgICAgIGxldCBvYnNlcnZhYmxlID0gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLmdldCh1cmksIHtoZWFkZXJzOiBSZXNvdXJjZUhlbHBlci5oZWFkZXJzLCBwYXJhbXM6IHBhcmFtc30pO1xyXG4gICAgICAgIHJldHVybiBvYnNlcnZhYmxlLnBpcGUobWFwKHJlc3BvbnNlID0+IFJlc291cmNlSGVscGVyLmluc3RhbnRpYXRlUmVzb3VyY2UocmVzdWx0LCByZXNwb25zZSkpLFxyXG4gICAgICAgICAgICBjYXRjaEVycm9yKGVycm9yID0+IG9ic2VydmFibGVUaHJvd0Vycm9yKGVycm9yKSksKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogc2VhcmNoIHJlc291cmNlcyBmcm9tIGEgZ2l2ZW4gYmFzZSBwYXRoLCBjdXN0b20gcXVlcnkgYW5kIG9wdGlvbnMgKi9cclxuICAgIHB1YmxpYyBjdXN0b21RdWVyeTxUIGV4dGVuZHMgUmVzb3VyY2U+KHR5cGU6IHsgbmV3KCk6IFQgfSwgcXVlcnk6IHN0cmluZywgcmVzb3VyY2U6IHN0cmluZywgX2VtYmVkZGVkOiBzdHJpbmcsIG9wdGlvbnM/OiBIYWxPcHRpb25zKTogT2JzZXJ2YWJsZTxSZXNvdXJjZUFycmF5PFQ+PiB7XHJcbiAgICAgICAgY29uc3QgdXJpID0gdGhpcy5nZXRSZXNvdXJjZVVybChyZXNvdXJjZSArIHF1ZXJ5KTtcclxuICAgICAgICBjb25zdCBwYXJhbXMgPSBSZXNvdXJjZUhlbHBlci5vcHRpb25QYXJhbXMobmV3IEh0dHBQYXJhbXMoKSwgb3B0aW9ucyk7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0OiBSZXNvdXJjZUFycmF5PFQ+ID0gUmVzb3VyY2VIZWxwZXIuY3JlYXRlRW1wdHlSZXN1bHQ8VD4oX2VtYmVkZGVkKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRVcmxzKHJlc3VsdCk7XHJcbiAgICAgICAgbGV0IG9ic2VydmFibGUgPSBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkuZ2V0KHVyaSwge2hlYWRlcnM6IFJlc291cmNlSGVscGVyLmhlYWRlcnMsIHBhcmFtczogcGFyYW1zfSk7XHJcbiAgICAgICAgcmV0dXJuIG9ic2VydmFibGUucGlwZShtYXAocmVzcG9uc2UgPT4gUmVzb3VyY2VIZWxwZXIuaW5zdGFudGlhdGVSZXNvdXJjZUNvbGxlY3Rpb24odHlwZSwgcmVzcG9uc2UsIHJlc3VsdCkpLFxyXG4gICAgICAgICAgICBjYXRjaEVycm9yKGVycm9yID0+IG9ic2VydmFibGVUaHJvd0Vycm9yKGVycm9yKSksKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHJlc291cmNlIGdpdmVuIGEgcmVsYXRpb24gbGluayAqL1xyXG4gICAgcHVibGljIGdldEJ5UmVsYXRpb248VCBleHRlbmRzIFJlc291cmNlPih0eXBlOiB7IG5ldygpOiBUIH0sIHJlc291cmNlTGluazogc3RyaW5nKTogT2JzZXJ2YWJsZTxUPiB7XHJcbiAgICAgICAgbGV0IHJlc3VsdDogVCA9IG5ldyB0eXBlKCk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0VXJsc1Jlc291cmNlKHJlc3VsdCk7XHJcbiAgICAgICAgbGV0IG9ic2VydmFibGUgPSBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkuZ2V0KHJlc291cmNlTGluaywge2hlYWRlcnM6IFJlc291cmNlSGVscGVyLmhlYWRlcnN9KTtcclxuICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZS5waXBlKG1hcChkYXRhID0+IFJlc291cmNlSGVscGVyLmluc3RhbnRpYXRlUmVzb3VyY2UocmVzdWx0LCBkYXRhKSksXHJcbiAgICAgICAgICAgIGNhdGNoRXJyb3IoZXJyb3IgPT4gb2JzZXJ2YWJsZVRocm93RXJyb3IoZXJyb3IpKSwpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgcmVzb3VyY2UgYXJyYXkgZ2l2ZW4gYSByZWxhdGlvbiBsaW5rICovXHJcbiAgICBwdWJsaWMgZ2V0QnlSZWxhdGlvbkFycmF5PFQgZXh0ZW5kcyBSZXNvdXJjZT4odHlwZTogeyBuZXcoKTogVCB9LCByZXNvdXJjZUxpbms6IHN0cmluZywgX2VtYmVkZGVkOiBzdHJpbmcsIGJ1aWxkZXI/OiBTdWJUeXBlQnVpbGRlcik6IE9ic2VydmFibGU8UmVzb3VyY2VBcnJheTxUPj4ge1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdDogUmVzb3VyY2VBcnJheTxUPiA9IFJlc291cmNlSGVscGVyLmNyZWF0ZUVtcHR5UmVzdWx0PFQ+KF9lbWJlZGRlZCk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0VXJscyhyZXN1bHQpO1xyXG4gICAgICAgIGxldCBvYnNlcnZhYmxlID0gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLmdldChyZXNvdXJjZUxpbmssIHtoZWFkZXJzOiBSZXNvdXJjZUhlbHBlci5oZWFkZXJzfSk7XHJcbiAgICAgICAgcmV0dXJuIG9ic2VydmFibGUucGlwZShtYXAocmVzcG9uc2UgPT4gUmVzb3VyY2VIZWxwZXIuaW5zdGFudGlhdGVSZXNvdXJjZUNvbGxlY3Rpb24odHlwZSwgcmVzcG9uc2UsIHJlc3VsdCwgYnVpbGRlcikpLFxyXG4gICAgICAgICAgICBjYXRjaEVycm9yKGVycm9yID0+IG9ic2VydmFibGVUaHJvd0Vycm9yKGVycm9yKSksKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogY291bnQgcmVzb3VyY2VzIGdpdmVuIGEgcGF0aCAqL1xyXG4gICAgcHVibGljIGNvdW50KHJlc291cmNlOiBzdHJpbmcpOiBPYnNlcnZhYmxlPG51bWJlcj4ge1xyXG4gICAgICAgIGNvbnN0IHVyaSA9IHRoaXMuZ2V0UmVzb3VyY2VVcmwocmVzb3VyY2UpLmNvbmNhdCgnL3NlYXJjaC9jb3VudEFsbCcpO1xyXG5cclxuICAgICAgICByZXR1cm4gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLmdldCh1cmksIHtoZWFkZXJzOiBSZXNvdXJjZUhlbHBlci5oZWFkZXJzLCBvYnNlcnZlOiAnYm9keSd9KS5waXBlKFxyXG4gICAgICAgICAgICBtYXAoKHJlc3BvbnNlOiBSZXNwb25zZSkgPT4gTnVtYmVyKHJlc3BvbnNlLmJvZHkpKSxcclxuICAgICAgICAgICAgY2F0Y2hFcnJvcihlcnJvciA9PiBvYnNlcnZhYmxlVGhyb3dFcnJvcihlcnJvcikpLCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGNyZWF0ZSByZXNvdXJjZSBmcm9tIHNlbGYgbGluayBhbmQgZW50aXR5IGRhdGEqL1xyXG4gICAgcHVibGljIGNyZWF0ZTxUIGV4dGVuZHMgUmVzb3VyY2U+KHNlbGZSZXNvdXJjZTogc3RyaW5nLCBlbnRpdHk6IFQpIHtcclxuICAgICAgICBjb25zdCB1cmkgPSBSZXNvdXJjZUhlbHBlci5nZXRVUkwoKSArIHNlbGZSZXNvdXJjZTtcclxuICAgICAgICBjb25zdCBwYXlsb2FkID0gUmVzb3VyY2VIZWxwZXIucmVzb2x2ZVJlbGF0aW9ucyhlbnRpdHkpO1xyXG5cclxuICAgICAgICB0aGlzLnNldFVybHNSZXNvdXJjZShlbnRpdHkpO1xyXG4gICAgICAgIGxldCBvYnNlcnZhYmxlID0gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLnBvc3QodXJpLCBwYXlsb2FkLCB7aGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVycywgb2JzZXJ2ZTogJ3Jlc3BvbnNlJ30pO1xyXG4gICAgICAgIHJldHVybiBvYnNlcnZhYmxlLnBpcGUobWFwKChyZXNwb25zZTogSHR0cFJlc3BvbnNlPHN0cmluZz4pID0+IHtcclxuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA+PSAyMDAgJiYgcmVzcG9uc2Uuc3RhdHVzIDw9IDIwNylcclxuICAgICAgICAgICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5pbnN0YW50aWF0ZVJlc291cmNlKGVudGl0eSwgcmVzcG9uc2UuYm9keSk7XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PSA1MDApIHtcclxuICAgICAgICAgICAgICAgIGxldCBib2R5OiBhbnkgPSByZXNwb25zZS5ib2R5O1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG9ic2VydmFibGVUaHJvd0Vycm9yKGJvZHkuZXJyb3IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSksY2F0Y2hFcnJvcihlcnJvciA9PiBvYnNlcnZhYmxlVGhyb3dFcnJvcihlcnJvcikpLCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHVwZGF0ZSByZXNvdXJjZSBmcm9tIGEgZ2l2ZW4gZW50aXR5IGRhdGEqL1xyXG4gICAgcHVibGljIHVwZGF0ZTxUIGV4dGVuZHMgUmVzb3VyY2U+KGVudGl0eTogVCkge1xyXG4gICAgICAgIGNvbnN0IHVyaSA9IFJlc291cmNlSGVscGVyLmdldFByb3h5KGVudGl0eS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgICAgICBjb25zdCBwYXlsb2FkID0gUmVzb3VyY2VIZWxwZXIucmVzb2x2ZVJlbGF0aW9ucyhlbnRpdHkpO1xyXG4gICAgICAgIHRoaXMuc2V0VXJsc1Jlc291cmNlKGVudGl0eSk7XHJcbiAgICAgICAgbGV0IG9ic2VydmFibGUgPSBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkucHV0KHVyaSwgcGF5bG9hZCwge2hlYWRlcnM6IFJlc291cmNlSGVscGVyLmhlYWRlcnMsIG9ic2VydmU6ICdyZXNwb25zZSd9KTtcclxuICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZS5waXBlKG1hcCgocmVzcG9uc2U6IEh0dHBSZXNwb25zZTxzdHJpbmc+KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPj0gMjAwICYmIHJlc3BvbnNlLnN0YXR1cyA8PSAyMDcpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gUmVzb3VyY2VIZWxwZXIuaW5zdGFudGlhdGVSZXNvdXJjZShlbnRpdHksIHJlc3BvbnNlLmJvZHkpO1xyXG4gICAgICAgICAgICBlbHNlIGlmIChyZXNwb25zZS5zdGF0dXMgPT0gNTAwKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgYm9keTogYW55ID0gcmVzcG9uc2UuYm9keTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBvYnNlcnZhYmxlVGhyb3dFcnJvcihib2R5LmVycm9yKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pLGNhdGNoRXJyb3IoZXJyb3IgPT4gb2JzZXJ2YWJsZVRocm93RXJyb3IoZXJyb3IpKSwpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBwYXRjaCByZXNvdXJjZSBmcm9tIGEgZ2l2ZW4gZW50aXR5IGRhdGEqL1xyXG4gICAgcHVibGljIHBhdGNoPFQgZXh0ZW5kcyBSZXNvdXJjZT4oZW50aXR5OiBUKSB7XHJcbiAgICAgICAgY29uc3QgdXJpID0gUmVzb3VyY2VIZWxwZXIuZ2V0UHJveHkoZW50aXR5Ll9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICAgICAgIGNvbnN0IHBheWxvYWQgPSBSZXNvdXJjZUhlbHBlci5yZXNvbHZlUmVsYXRpb25zKGVudGl0eSk7XHJcbiAgICAgICAgdGhpcy5zZXRVcmxzUmVzb3VyY2UoZW50aXR5KTtcclxuICAgICAgICBsZXQgb2JzZXJ2YWJsZSA9IFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5wYXRjaCh1cmksIHBheWxvYWQsIHtoZWFkZXJzOiBSZXNvdXJjZUhlbHBlci5oZWFkZXJzLCBvYnNlcnZlOiAncmVzcG9uc2UnfSk7XHJcbiAgICAgICAgcmV0dXJuIG9ic2VydmFibGUucGlwZShtYXAoKHJlc3BvbnNlOiBIdHRwUmVzcG9uc2U8c3RyaW5nPikgPT4ge1xyXG4gICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID49IDIwMCAmJiByZXNwb25zZS5zdGF0dXMgPD0gMjA3KVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLmluc3RhbnRpYXRlUmVzb3VyY2UoZW50aXR5LCByZXNwb25zZS5ib2R5KTtcclxuICAgICAgICAgICAgZWxzZSBpZiAocmVzcG9uc2Uuc3RhdHVzID09IDUwMCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGJvZHk6IGFueSA9IHJlc3BvbnNlLmJvZHk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZVRocm93RXJyb3IoYm9keS5lcnJvcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KSxjYXRjaEVycm9yKGVycm9yID0+IG9ic2VydmFibGVUaHJvd0Vycm9yKGVycm9yKSksKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZGVsZXRlIHJlc291cmNlIGZyb20gYSBnaXZlbiBlbnRpdHkgZGF0YSovXHJcbiAgICBwdWJsaWMgZGVsZXRlPFQgZXh0ZW5kcyBSZXNvdXJjZT4oZW50aXR5OiBUKTogT2JzZXJ2YWJsZTxPYmplY3Q+IHtcclxuICAgICAgICBjb25zdCB1cmkgPSBSZXNvdXJjZUhlbHBlci5nZXRQcm94eShlbnRpdHkuX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5kZWxldGUodXJpLCB7aGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVyc30pLnBpcGUoY2F0Y2hFcnJvcihlcnJvciA9PiBvYnNlcnZhYmxlVGhyb3dFcnJvcihlcnJvcikpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogd2hldGhlciBhIHJlc291cmNlIGFycmF5IGhhcyBuZXh0IHBhZ2Ugb2YgcmVzdWx0cyovXHJcbiAgICBwdWJsaWMgaGFzTmV4dDxUIGV4dGVuZHMgUmVzb3VyY2U+KHJlc291cmNlQXJyYXk6IFJlc291cmNlQXJyYXk8VD4pOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gcmVzb3VyY2VBcnJheS5uZXh0X3VyaSAhPSB1bmRlZmluZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHdoZXRoZXIgYSByZXNvdXJjZSBhcnJheSBoYXMgcHJldmlvdXMgcGFnZSBvZiByZXN1bHRzKi9cclxuICAgIHB1YmxpYyBoYXNQcmV2PFQgZXh0ZW5kcyBSZXNvdXJjZT4ocmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPik6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiByZXNvdXJjZUFycmF5LnByZXZfdXJpICE9IHVuZGVmaW5lZDtcclxuICAgIH1cclxuXHJcbiAgICAvKiogd2hldGhlciBhIHJlc291cmNlIGFycmF5IGhhcyBmaXJzdCBwYWdlIG9mIHJlc3VsdHMqL1xyXG4gICAgcHVibGljIGhhc0ZpcnN0PFQgZXh0ZW5kcyBSZXNvdXJjZT4ocmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPik6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiByZXNvdXJjZUFycmF5LmZpcnN0X3VyaSAhPSB1bmRlZmluZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHdoZXRoZXIgYSByZXNvdXJjZSBhcnJheSBoYXMgbGFzdCBwYWdlIG9mIHJlc3VsdHMqL1xyXG4gICAgcHVibGljIGhhc0xhc3Q8VCBleHRlbmRzIFJlc291cmNlPihyZXNvdXJjZUFycmF5OiBSZXNvdXJjZUFycmF5PFQ+KTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHJlc291cmNlQXJyYXkubGFzdF91cmkgIT0gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgcmVzb3VyY2UgYXJyYXkgbmV4dCBwYWdlIG9mIHJlc3VsdHMqL1xyXG4gICAgcHVibGljIG5leHQ8VCBleHRlbmRzIFJlc291cmNlPihyZXNvdXJjZUFycmF5OiBSZXNvdXJjZUFycmF5PFQ+LCB0eXBlOiB7IG5ldygpOiBUIH0pOiBPYnNlcnZhYmxlPFJlc291cmNlQXJyYXk8VD4+IHtcclxuICAgICAgICByZXR1cm4gcmVzb3VyY2VBcnJheS5uZXh0KHR5cGUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgcmVzb3VyY2UgYXJyYXkgcHJldmlvdXMgcGFnZSBvZiByZXN1bHRzKi9cclxuICAgIHB1YmxpYyBwcmV2PFQgZXh0ZW5kcyBSZXNvdXJjZT4ocmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPiwgdHlwZTogeyBuZXcoKTogVCB9KTogT2JzZXJ2YWJsZTxSZXNvdXJjZUFycmF5PFQ+PiB7XHJcbiAgICAgICAgcmV0dXJuIHJlc291cmNlQXJyYXkucHJldih0eXBlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHJlc291cmNlIGFycmF5IGZpcnN0IHBhZ2Ugb2YgcmVzdWx0cyovXHJcbiAgICBwdWJsaWMgZmlyc3Q8VCBleHRlbmRzIFJlc291cmNlPihyZXNvdXJjZUFycmF5OiBSZXNvdXJjZUFycmF5PFQ+LCB0eXBlOiB7IG5ldygpOiBUIH0pOiBPYnNlcnZhYmxlPFJlc291cmNlQXJyYXk8VD4+IHtcclxuICAgICAgICByZXR1cm4gcmVzb3VyY2VBcnJheS5maXJzdCh0eXBlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHJlc291cmNlIGFycmF5IGxhc3QgcGFnZSBvZiByZXN1bHRzKi9cclxuICAgIHB1YmxpYyBsYXN0PFQgZXh0ZW5kcyBSZXNvdXJjZT4ocmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPiwgdHlwZTogeyBuZXcoKTogVCB9KTogT2JzZXJ2YWJsZTxSZXNvdXJjZUFycmF5PFQ+PiB7XHJcbiAgICAgICAgcmV0dXJuIHJlc291cmNlQXJyYXkubGFzdCh0eXBlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHJlc291cmNlIGFycmF5IHBhZ2Ugb2YgcmVzdWx0cyBnaXZlbiBhIHBhZ2UgbnVtYmVyKi9cclxuICAgIHB1YmxpYyBwYWdlPFQgZXh0ZW5kcyBSZXNvdXJjZT4ocmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPiwgdHlwZTogeyBuZXcoKTogVCB9LCBpZDogbnVtYmVyKTogT2JzZXJ2YWJsZTxSZXNvdXJjZUFycmF5PFQ+PiB7XHJcbiAgICAgICAgcmV0dXJuIHJlc291cmNlQXJyYXkucGFnZSh0eXBlLCBpZCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHNvcnQgcmVzb3VyY2UgYXJyYXkgd2l0aCBhIGdpdmVuIHNvcnRpbmcgcGFyYW1zICovXHJcbiAgICBwdWJsaWMgc29ydEVsZW1lbnRzPFQgZXh0ZW5kcyBSZXNvdXJjZT4ocmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPiwgdHlwZTogeyBuZXcoKTogVCB9LCAuLi5zb3J0OiBTb3J0W10pOiBPYnNlcnZhYmxlPFJlc291cmNlQXJyYXk8VD4+IHtcclxuICAgICAgICByZXR1cm4gcmVzb3VyY2VBcnJheS5zb3J0RWxlbWVudHModHlwZSwgLi4uc29ydCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBhcnJheSBzaXplKi9cclxuICAgIHB1YmxpYyBzaXplPFQgZXh0ZW5kcyBSZXNvdXJjZT4ocmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPiwgdHlwZTogeyBuZXcoKTogVCB9LCBzaXplOiBudW1iZXIpOiBPYnNlcnZhYmxlPFJlc291cmNlQXJyYXk8VD4+IHtcclxuICAgICAgICByZXR1cm4gcmVzb3VyY2VBcnJheS5zaXplKHR5cGUsIHNpemUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgcmVzb3VyY2UgVVJMIGZyb20gYSBnaXZlbiBwYXRoKi9cclxuICAgIHB1YmxpYyBnZXRSZXNvdXJjZVVybChyZXNvdXJjZT86IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgbGV0IHVybCA9IFJlc291cmNlU2VydmljZS5nZXRVUkwoKTtcclxuICAgICAgICBpZiAoIXVybC5lbmRzV2l0aCgnLycpKSB7XHJcbiAgICAgICAgICAgIHVybCA9IHVybC5jb25jYXQoJy8nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHJlc291cmNlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB1cmwuY29uY2F0KHJlc291cmNlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHVybDtcclxuICAgIH1cclxuXHJcbiAgICAvKiogc2V0IHByb3h5IGFuZCByb290IHVybHMgb2YgZ2l2ZW4gcmVzb3VyY2UgYXJyYXkgKi9cclxuICAgIHByaXZhdGUgc2V0VXJsczxUIGV4dGVuZHMgUmVzb3VyY2U+KHJlc3VsdDogUmVzb3VyY2VBcnJheTxUPikge1xyXG4gICAgICAgIHJlc3VsdC5wcm94eVVybCA9IHRoaXMuZXh0ZXJuYWxTZXJ2aWNlLmdldFByb3h5VXJpKCk7XHJcbiAgICAgICAgcmVzdWx0LnJvb3RVcmwgPSB0aGlzLmV4dGVybmFsU2VydmljZS5nZXRSb290VXJpKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHNldCBwcm94eSBhbmQgcm9vdCB1cmxzIG9mIGdpdmVuIHJlc291cmNlICovXHJcbiAgICBwcml2YXRlIHNldFVybHNSZXNvdXJjZTxUIGV4dGVuZHMgUmVzb3VyY2U+KHJlc3VsdDogVCkge1xyXG4gICAgICAgIHJlc3VsdC5wcm94eVVybCA9IHRoaXMuZXh0ZXJuYWxTZXJ2aWNlLmdldFByb3h5VXJpKCk7XHJcbiAgICAgICAgcmVzdWx0LnJvb3RVcmwgPSB0aGlzLmV4dGVybmFsU2VydmljZS5nZXRSb290VXJpKCk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHtvZiBhcyBvYnNlcnZhYmxlT2YsIHRocm93RXJyb3IgYXMgb2JzZXJ2YWJsZVRocm93RXJyb3J9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge21hcCwgbWVyZ2VNYXB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi9yZXNvdXJjZSc7XHJcbmltcG9ydCB7UmVzb3VyY2VBcnJheX0gZnJvbSAnLi9yZXNvdXJjZS1hcnJheSc7XHJcbmltcG9ydCB7U29ydH0gZnJvbSAnLi9zb3J0JztcclxuaW1wb3J0IHtSZXNvdXJjZVNlcnZpY2V9IGZyb20gJy4vcmVzb3VyY2Uuc2VydmljZSc7XHJcbmltcG9ydCB7U3ViVHlwZUJ1aWxkZXJ9IGZyb20gJy4vc3VidHlwZS1idWlsZGVyJztcclxuaW1wb3J0IHtpc051bGxPclVuZGVmaW5lZH0gZnJvbSAndXRpbCc7XHJcbmltcG9ydCB7T2JzZXJ2YWJsZX0gZnJvbSAncnhqcy9pbnRlcm5hbC9PYnNlcnZhYmxlJztcclxuaW1wb3J0IHtJbmplY3Rvcn0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcclxuXHJcbi8qKiBIQUwgcGFyYW0gZGF0YSBtb2RlbCAqL1xyXG5leHBvcnQgdHlwZSBIYWxQYXJhbSA9IHsga2V5OiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcgfCBudW1iZXIgfCBib29sZWFuIH07XHJcbi8qKiBIQUwgb3B0aW9uIGRhdGEgbW9kZWwgKi9cclxuZXhwb3J0IHR5cGUgSGFsT3B0aW9ucyA9IHsgbm90UGFnZWQ/OiBib29sZWFuLCBzaXplPzogbnVtYmVyLCBzb3J0PzogU29ydFtdLCBwYXJhbXM/OiBIYWxQYXJhbVtdIH07XHJcblxyXG4vKiogUkVTVCBBUEkgYWNjZXNzIGludGVyZmFjZSAqL1xyXG5leHBvcnQgY2xhc3MgUmVzdFNlcnZpY2U8VCBleHRlbmRzIFJlc291cmNlPiB7XHJcbiAgICAvKiogcmVzb3VyY2UgdHlwZSAqL1xyXG4gICAgcHJpdmF0ZSB0eXBlOiBhbnk7XHJcbiAgICAvKiogcmVzb3VyY2UgcGF0aCAqL1xyXG4gICAgcHJpdmF0ZSByZXNvdXJjZTogc3RyaW5nO1xyXG4gICAgLyoqIHJlc291cmNlIGFycmF5ICovXHJcbiAgICBwdWJsaWMgcmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPjtcclxuICAgIC8qKiByZXNvdXJjZSBzZXJ2aWNlICovXHJcbiAgICBwdWJsaWMgcmVzb3VyY2VTZXJ2aWNlOiBSZXNvdXJjZVNlcnZpY2U7XHJcbiAgICAvKiogX2VtYmVkZGVkIGZpZWxkIG5hbWUgKi9cclxuICAgIHByaXZhdGUgX2VtYmVkZGVkOiBzdHJpbmcgPSAnX2VtYmVkZGVkJztcclxuXHJcbiAgICAvKiogY29uc3RydWN0b3IgKi9cclxuICAgIGNvbnN0cnVjdG9yKHR5cGU6IHsgbmV3KCk6IFQgfSxcclxuICAgICAgICAgICAgICAgIHJlc291cmNlOiBzdHJpbmcsXHJcbiAgICAgICAgICAgICAgICBwcml2YXRlIGluamVjdG9yOiBJbmplY3RvcixcclxuICAgICAgICAgICAgICAgIF9lbWJlZGRlZD86IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMudHlwZSA9IHR5cGU7XHJcbiAgICAgICAgdGhpcy5yZXNvdXJjZSA9IHJlc291cmNlO1xyXG4gICAgICAgIHRoaXMucmVzb3VyY2VTZXJ2aWNlID0gaW5qZWN0b3IuZ2V0KFJlc291cmNlU2VydmljZSk7XHJcbiAgICAgICAgaWYgKCFpc051bGxPclVuZGVmaW5lZChfZW1iZWRkZWQpKVxyXG4gICAgICAgICAgICB0aGlzLl9lbWJlZGRlZCA9IF9lbWJlZGRlZDtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZXJyb3IgaGFuZGxlciAqL1xyXG4gICAgcHJvdGVjdGVkIGhhbmRsZUVycm9yKGVycm9yOiBhbnkpOk9ic2VydmFibGU8bmV2ZXI+IHtcclxuICAgICAgICByZXR1cm4gUmVzdFNlcnZpY2UuaGFuZGxlRXJyb3IoZXJyb3IpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBlcnJvciBoYW5kbGVyICovXHJcbiAgICBwcm90ZWN0ZWQgc3RhdGljIGhhbmRsZUVycm9yKGVycm9yOiBhbnkpOk9ic2VydmFibGU8bmV2ZXI+IHtcclxuICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZVRocm93RXJyb3IoZXJyb3IpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgYWxsIHJlc291cmNlcyB3aXRoIG9wdGlvbmFsIG9wdGlvbnMgYW4gc3ViVHlwZSBwYXJhbXMgKi9cclxuICAgIHB1YmxpYyBnZXRBbGwob3B0aW9ucz86IEhhbE9wdGlvbnMsIHN1YlR5cGU/OiBTdWJUeXBlQnVpbGRlcik6IE9ic2VydmFibGU8VFtdPiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldEFsbCh0aGlzLnR5cGUsIHRoaXMucmVzb3VyY2UsIHRoaXMuX2VtYmVkZGVkLCBvcHRpb25zLCBzdWJUeXBlKS5waXBlKFxyXG4gICAgICAgICAgICBtZXJnZU1hcCgocmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPikgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5ub3RQYWdlZCAmJiAhaXNOdWxsT3JVbmRlZmluZWQocmVzb3VyY2VBcnJheS5maXJzdF91cmkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5ub3RQYWdlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuc2l6ZSA9IHJlc291cmNlQXJyYXkudG90YWxFbGVtZW50cztcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRBbGwob3B0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVzb3VyY2VBcnJheSA9IHJlc291cmNlQXJyYXk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9ic2VydmFibGVPZihyZXNvdXJjZUFycmF5LnJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHJlc291cmNlIGZyb20gYSBnaXZlbiBpZCAqL1xyXG4gICAgcHVibGljIGdldChpZDogYW55KTogT2JzZXJ2YWJsZTxUPiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldCh0aGlzLnR5cGUsIHRoaXMucmVzb3VyY2UsIGlkKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHJlc291cmNlIGZyb20gc2VsZiBsaW5rICovXHJcbiAgICBwdWJsaWMgZ2V0QnlTZWxmTGluayhzZWxmTGluazogc3RyaW5nKTogT2JzZXJ2YWJsZTxUPiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldEJ5U2VsZkxpbmsodGhpcy50eXBlLCBzZWxmTGluayk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHNlYXJjaCByZXNvdXJjZXMgZnJvbSBhIGdpdmVuIHF1ZXJ5IHN0cmluZyBhbmQgb3B0aW9uYWwgb3B0aW9ucyBwYXJhbXMgKi9cclxuICAgIHB1YmxpYyBzZWFyY2gocXVlcnk6IHN0cmluZywgb3B0aW9ucz86IEhhbE9wdGlvbnMpOiBPYnNlcnZhYmxlPFRbXT4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5zZWFyY2godGhpcy50eXBlLCBxdWVyeSwgdGhpcy5yZXNvdXJjZSwgdGhpcy5fZW1iZWRkZWQsIG9wdGlvbnMpLnBpcGUoXHJcbiAgICAgICAgICAgIG1lcmdlTWFwKChyZXNvdXJjZUFycmF5OiBSZXNvdXJjZUFycmF5PFQ+KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLm5vdFBhZ2VkICYmICFpc051bGxPclVuZGVmaW5lZChyZXNvdXJjZUFycmF5LmZpcnN0X3VyaSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLm5vdFBhZ2VkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5zaXplID0gcmVzb3VyY2VBcnJheS50b3RhbEVsZW1lbnRzO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnNlYXJjaChxdWVyeSwgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVzb3VyY2VBcnJheSA9IHJlc291cmNlQXJyYXk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9ic2VydmFibGVPZihyZXNvdXJjZUFycmF5LnJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogc2VhcmNoIHJlc291cmNlIGZyb20gYSBnaXZlbiBxdWVyeSBzdHJpbmcgYW5kIG9wdGlvbmFsIG9wdGlvbnMgcGFyYW1zICovXHJcbiAgICBwdWJsaWMgc2VhcmNoU2luZ2xlKHF1ZXJ5OiBzdHJpbmcsIG9wdGlvbnM/OiBIYWxPcHRpb25zKTogT2JzZXJ2YWJsZTxUPiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLnNlYXJjaFNpbmdsZSh0aGlzLnR5cGUsIHF1ZXJ5LCB0aGlzLnJlc291cmNlLCBvcHRpb25zKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogc2VhcmNoIHJlc291cmNlcyBmcm9tIGEgZ2l2ZW4gY3VzdG9tIHF1ZXJ5IHN0cmluZyBhbmQgb3B0aW9uYWwgb3B0aW9ucyBwYXJhbXMgKi9cclxuICAgIHB1YmxpYyBjdXN0b21RdWVyeShxdWVyeTogc3RyaW5nLCBvcHRpb25zPzogSGFsT3B0aW9ucyk6IE9ic2VydmFibGU8VFtdPiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLmN1c3RvbVF1ZXJ5KHRoaXMudHlwZSwgcXVlcnksIHRoaXMucmVzb3VyY2UsIHRoaXMuX2VtYmVkZGVkLCBvcHRpb25zKS5waXBlKFxyXG4gICAgICAgICAgICBtZXJnZU1hcCgocmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPikgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5ub3RQYWdlZCAmJiAhaXNOdWxsT3JVbmRlZmluZWQocmVzb3VyY2VBcnJheS5maXJzdF91cmkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5ub3RQYWdlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuc2l6ZSA9IHJlc291cmNlQXJyYXkudG90YWxFbGVtZW50cztcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jdXN0b21RdWVyeShxdWVyeSwgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVzb3VyY2VBcnJheSA9IHJlc291cmNlQXJyYXk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9ic2VydmFibGVPZihyZXNvdXJjZUFycmF5LnJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBhcnJheSBnaXZlbiBhIHJlbGF0aW9uIGxpbmsgKi9cclxuICAgIHB1YmxpYyBnZXRCeVJlbGF0aW9uQXJyYXkocmVsYXRpb246IHN0cmluZywgYnVpbGRlcj86IFN1YlR5cGVCdWlsZGVyKTogT2JzZXJ2YWJsZTxUW10+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0QnlSZWxhdGlvbkFycmF5KHRoaXMudHlwZSwgcmVsYXRpb24sIHRoaXMuX2VtYmVkZGVkLCBidWlsZGVyKS5waXBlKFxyXG4gICAgICAgICAgICBtYXAoKHJlc291cmNlQXJyYXk6IFJlc291cmNlQXJyYXk8VD4pID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVzb3VyY2VBcnJheSA9IHJlc291cmNlQXJyYXk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzb3VyY2VBcnJheS5yZXN1bHQ7XHJcbiAgICAgICAgICAgIH0pKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHJlc291cmNlIGdpdmVuIGEgcmVsYXRpb24gbGluayAqL1xyXG4gICAgcHVibGljIGdldEJ5UmVsYXRpb24ocmVsYXRpb246IHN0cmluZyk6IE9ic2VydmFibGU8VD4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5nZXRCeVJlbGF0aW9uKHRoaXMudHlwZSwgcmVsYXRpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBjb3VudCByZXNvdXJjZXMgZ2l2ZW4gYSBwYXRoICovXHJcbiAgICBwdWJsaWMgY291bnQoKTogT2JzZXJ2YWJsZTxudW1iZXI+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZVNlcnZpY2UuY291bnQodGhpcy5yZXNvdXJjZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGNyZWF0ZSByZXNvdXJjZSBmcm9tIHNlbGYgbGluayBhbmQgZW50aXR5IGRhdGEqL1xyXG4gICAgcHVibGljIGNyZWF0ZShlbnRpdHk6IFQpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZVNlcnZpY2UuY3JlYXRlKHRoaXMucmVzb3VyY2UsIGVudGl0eSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHVwZGF0ZSByZXNvdXJjZSBmcm9tIGEgZ2l2ZW4gZW50aXR5IGRhdGEqL1xyXG4gICAgcHVibGljIHVwZGF0ZShlbnRpdHk6IFQpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZVNlcnZpY2UudXBkYXRlKGVudGl0eSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHBhdGNoIHJlc291cmNlIGZyb20gYSBnaXZlbiBlbnRpdHkgZGF0YSovXHJcbiAgICBwdWJsaWMgcGF0Y2goZW50aXR5OiBUKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLnBhdGNoKGVudGl0eSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGRlbGV0ZSByZXNvdXJjZSBmcm9tIGEgZ2l2ZW4gZW50aXR5IGRhdGEqL1xyXG4gICAgcHVibGljIGRlbGV0ZShlbnRpdHk6IFQpOiBPYnNlcnZhYmxlPE9iamVjdD4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5kZWxldGUoZW50aXR5KTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHRvdGFsIG51bWJlciBvZiBlbGVtZW50cyBvZiByZXNvdXJjZSBhcnJheSAqL1xyXG4gICAgcHVibGljIHRvdGFsRWxlbWVudCgpOiBudW1iZXIge1xyXG4gICAgICAgIGlmICh0aGlzLnJlc291cmNlQXJyYXkgJiYgdGhpcy5yZXNvdXJjZUFycmF5LnRvdGFsRWxlbWVudHMpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlQXJyYXkudG90YWxFbGVtZW50cztcclxuICAgICAgICByZXR1cm4gMDtcclxuICAgIH1cclxuXHJcbiAgICAvKiogd2hldGhlciBhIHJlc291cmNlIGFycmF5IGhhcyBmaXJzdCBwYWdlIG9mIHJlc3VsdHMqL1xyXG4gICAgcHVibGljIGhhc0ZpcnN0KCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICh0aGlzLnJlc291cmNlQXJyYXkpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5oYXNGaXJzdCh0aGlzLnJlc291cmNlQXJyYXkpO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogd2hldGhlciBhIHJlc291cmNlIGFycmF5IGhhcyBuZXh0IHBhZ2Ugb2YgcmVzdWx0cyovXHJcbiAgICBwdWJsaWMgaGFzTmV4dCgpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAodGhpcy5yZXNvdXJjZUFycmF5KVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZVNlcnZpY2UuaGFzTmV4dCh0aGlzLnJlc291cmNlQXJyYXkpO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogd2hldGhlciBhIHJlc291cmNlIGFycmF5IGhhcyBwcmV2aW91cyBwYWdlIG9mIHJlc3VsdHMqL1xyXG4gICAgcHVibGljIGhhc1ByZXYoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKHRoaXMucmVzb3VyY2VBcnJheSlcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLmhhc1ByZXYodGhpcy5yZXNvdXJjZUFycmF5KTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHdoZXRoZXIgYSByZXNvdXJjZSBhcnJheSBoYXMgbGFzdCBwYWdlIG9mIHJlc3VsdHMqL1xyXG4gICAgcHVibGljIGhhc0xhc3QoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKHRoaXMucmVzb3VyY2VBcnJheSlcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLmhhc0xhc3QodGhpcy5yZXNvdXJjZUFycmF5KTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBhcnJheSBuZXh0IHBhZ2Ugb2YgcmVzdWx0cyovXHJcbiAgICBwdWJsaWMgbmV4dCgpOiBPYnNlcnZhYmxlPFRbXT4ge1xyXG4gICAgICAgIGlmICh0aGlzLnJlc291cmNlQXJyYXkpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5uZXh0KHRoaXMucmVzb3VyY2VBcnJheSwgdGhpcy50eXBlKS5waXBlKFxyXG4gICAgICAgICAgICAgICAgbWFwKChyZXNvdXJjZUFycmF5OiBSZXNvdXJjZUFycmF5PFQ+KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXNvdXJjZUFycmF5ID0gcmVzb3VyY2VBcnJheTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzb3VyY2VBcnJheS5yZXN1bHQ7XHJcbiAgICAgICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBvYnNlcnZhYmxlVGhyb3dFcnJvcignbm8gcmVzb3VyY2VBcnJheSBmb3VuZCcpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgcmVzb3VyY2UgYXJyYXkgcHJldmlvdXMgcGFnZSBvZiByZXN1bHRzKi9cclxuICAgIHB1YmxpYyBwcmV2KCk6IE9ic2VydmFibGU8VFtdPiB7XHJcbiAgICAgICAgaWYgKHRoaXMucmVzb3VyY2VBcnJheSlcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLnByZXYodGhpcy5yZXNvdXJjZUFycmF5LCB0aGlzLnR5cGUpLnBpcGUoXHJcbiAgICAgICAgICAgICAgICBtYXAoKHJlc291cmNlQXJyYXk6IFJlc291cmNlQXJyYXk8VD4pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlc291cmNlQXJyYXkgPSByZXNvdXJjZUFycmF5O1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNvdXJjZUFycmF5LnJlc3VsdDtcclxuICAgICAgICAgICAgICAgIH0pKTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIG9ic2VydmFibGVUaHJvd0Vycm9yKCdubyByZXNvdXJjZUFycmF5IGZvdW5kJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBhcnJheSBmaXJzdCBwYWdlIG9mIHJlc3VsdHMqL1xyXG4gICAgcHVibGljIGZpcnN0KCk6IE9ic2VydmFibGU8VFtdPiB7XHJcbiAgICAgICAgaWYgKHRoaXMucmVzb3VyY2VBcnJheSlcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLmZpcnN0KHRoaXMucmVzb3VyY2VBcnJheSwgdGhpcy50eXBlKVxyXG4gICAgICAgICAgICAgICAgLnBpcGUoXHJcbiAgICAgICAgICAgICAgICAgICAgbWFwKChyZXNvdXJjZUFycmF5OiBSZXNvdXJjZUFycmF5PFQ+KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVzb3VyY2VBcnJheSA9IHJlc291cmNlQXJyYXk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNvdXJjZUFycmF5LnJlc3VsdDtcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIG9ic2VydmFibGVUaHJvd0Vycm9yKCdubyByZXNvdXJjZUFycmF5IGZvdW5kJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBhcnJheSBsYXN0IHBhZ2Ugb2YgcmVzdWx0cyovXHJcbiAgICBwdWJsaWMgbGFzdCgpOiBPYnNlcnZhYmxlPFRbXT4ge1xyXG4gICAgICAgIGlmICh0aGlzLnJlc291cmNlQXJyYXkpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5sYXN0KHRoaXMucmVzb3VyY2VBcnJheSwgdGhpcy50eXBlKVxyXG4gICAgICAgICAgICAgICAgLnBpcGUoXHJcbiAgICAgICAgICAgICAgICAgICAgbWFwKChyZXNvdXJjZUFycmF5OiBSZXNvdXJjZUFycmF5PFQ+KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVzb3VyY2VBcnJheSA9IHJlc291cmNlQXJyYXk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNvdXJjZUFycmF5LnJlc3VsdDtcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIG9ic2VydmFibGVUaHJvd0Vycm9yKCdubyByZXNvdXJjZUFycmF5IGZvdW5kJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBhcnJheSBwYWdlIG9mIHJlc3VsdHMgZ2l2ZW4gYSBwYWdlIG51bWJlciovXHJcbiAgICBwdWJsaWMgcGFnZShwYWdlTnVtYmVyOiBudW1iZXIpOiBPYnNlcnZhYmxlPFRbXT4ge1xyXG4gICAgICAgIGlmICh0aGlzLnJlc291cmNlQXJyYXkpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5wYWdlKHRoaXMucmVzb3VyY2VBcnJheSwgdGhpcy50eXBlLCBwYWdlTnVtYmVyKS5waXBlKFxyXG4gICAgICAgICAgICAgICAgbWFwKChyZXNvdXJjZUFycmF5OiBSZXNvdXJjZUFycmF5PFQ+KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXNvdXJjZUFycmF5ID0gcmVzb3VyY2VBcnJheTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzb3VyY2VBcnJheS5yZXN1bHQ7XHJcbiAgICAgICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBvYnNlcnZhYmxlVGhyb3dFcnJvcignbm8gcmVzb3VyY2VBcnJheSBmb3VuZCcpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IFVzZXIgfSBmcm9tICcuLi91c2VyL3VzZXIubW9kZWwnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuXHJcblxyXG4vKiogQWNjb3VudCBtYW5hZ2VyIHNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgQWNjb3VudFNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxVc2VyPiB7XHJcbiAgXHJcblxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBBQ0NPVU5UX0FQSSA9ICdhY2NvdW50JztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoVXNlciwgXCJhY2NvdW50XCIsIGluamVjdG9yKTtcclxuICB9XHJcblxyXG4gIC8qKiBnZXQgbG9nZ2VkIGluIHVzZXIgYWNjb3VudCovXHJcbiAgZ2V0KCk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICByZXN1bHQgPSB0aGlzLmh0dHAuZ2V0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuQUNDT1VOVF9BUEkpKTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIGFjY291bnQqL1xyXG4gIHNhdmUoaXRlbTogYW55KTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuQUNDT1VOVF9BUEkpICwgaXRlbSk7XHJcblxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcblxyXG4gIC8qKiBjaGFuZ2UgbG9nZ2VkIGluIHVzZXIgYWNjb3VudCovICBcclxuICBjaGFuZ2VQYXNzd29yZChpdGVtOiBhbnkpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5BQ0NPVU5UX0FQSStcIi9jaGFuZ2UtcGFzc3dvcmRcIikgLCBpdGVtKTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG59XHJcbiIsImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZX0gZnJvbSAncnhqcy1jb21wYXQnO1xyXG5pbXBvcnQge1Jlc291cmNlU2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZS5zZXJ2aWNlJztcclxuLy9pbXBvcnQgKiBhcyBtb21lbnQgZnJvbSAnbW9tZW50JztcclxuXHJcbi8qKiBBdXRoZW50aWNhdGlvbiBzZXJ2aWNlKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgQXV0aFNlcnZpY2Uge1xyXG4gICAgXHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIEFVVEhfQVBJID0gJ2F1dGhlbnRpY2F0ZSc7XHJcblxyXG4gICAgLyoqIGNvbnN0cnVjdG9yKi9cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHByaXZhdGUgaHR0cDogSHR0cENsaWVudCxcclxuICAgICAgICBwcml2YXRlIHJlc291cmNlU2VydmljZTogUmVzb3VyY2VTZXJ2aWNlXHJcbiAgICApIHt9XHJcbiAgICBcclxuICAgIC8qKiBnZXQgY3VycmVudCB1c2VyIGp3dCB0b2tlbiBmcm9tIHNlc3Npb24gc3RvcmFnZSovXHJcbiAgICBnZXRUb2tlbigpIHtcclxuICAgICAgICByZXR1cm4gIHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ2F1dGhlbnRpY2F0aW9uVG9rZW4nKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogbG9naW4gb3BlcmF0aW9uICovXHJcbiAgICBsb2dpbihjcmVkZW50aWFscyk6IE9ic2VydmFibGU8YW55PiB7XHJcblxyXG4gICAgICAgIGNvbnN0IGRhdGEgPSB7XHJcbiAgICAgICAgICAgIHVzZXJuYW1lOiBjcmVkZW50aWFscy51c2VybmFtZSxcclxuICAgICAgICAgICAgcGFzc3dvcmQ6IGNyZWRlbnRpYWxzLnBhc3N3b3JkXHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5BVVRIX0FQSSksIGRhdGEsIHtvYnNlcnZlIDogJ3Jlc3BvbnNlJ30pLm1hcChhdXRoZW50aWNhdGVTdWNjZXNzLmJpbmQodGhpcykpO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBhdXRoZW50aWNhdGVTdWNjZXNzKHJlc3ApIHtcclxuICAgICAgICAgICAgaWYgKHJlc3Aub2spIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGp3dCA9IHJlc3AuYm9keS5pZF90b2tlbjtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RvcmVBdXRoZW50aWNhdGlvblRva2VuKGp3dCk7XHJcbiAgICAgICAgICAgICAgICAvL2NvbnN0IGV4cGlyZXNBdCA9IG1vbWVudCgpLmFkZCggcmVzcC5oZWFkZXJzLmdldCgnVG9rZW4tVmFsaWRpdHknKSwnbWlsaXNlY29uZCcpO1xyXG4gICAgICAgICAgICAgICAgLy9zZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCdleHBpcmVzX2F0JywgSlNPTi5zdHJpbmdpZnkoZXhwaXJlc0F0LnZhbHVlT2YoKSkpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGp3dDtcclxuICAgICAgICAgICAgfSAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKiogbG9naW4gb3BlcmF0aW9uIHdpdGggand0IHRva2VuICovXHJcbiAgICBsb2dpbldpdGhUb2tlbihqd3QpIHtcclxuICAgICAgICBpZiAoand0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RvcmVBdXRoZW50aWNhdGlvblRva2VuKGp3dCk7XHJcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoand0KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoJ2F1dGgtand0LXNlcnZpY2UgUHJvbWlzZSByZWplY3QnKTsgLy8gUHV0IGFwcHJvcHJpYXRlIGVycm9yIG1lc3NhZ2UgaGVyZVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKiogc3RvcmUgand0IHRva2VuIGluIHNlc3Npb24gc3RvcmFnZSovXHJcbiAgICBzdG9yZUF1dGhlbnRpY2F0aW9uVG9rZW4oand0KSB7XHJcbiAgICAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCdhdXRoZW50aWNhdGlvblRva2VuJywgand0KTtcclxuICAgICAgICBcclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoqIGNoZWNrIHdoZXRoZXIgY3VycmVudCB1c2VyIGlzIGxvZ2dlZCBpbiovXHJcbiAgICBwdWJsaWMgaXNMb2dnZWRJbigpIHtcclxuICAgICAgICAvL3JldHVybiBtb21lbnQoKS5pc0JlZm9yZSh0aGlzLmdldEV4cGlyYXRpb24oKSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0VG9rZW4oKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoqIGNoZWNrIHdoZXRoZXIgY3VycmVudCB1c2VyIGlzIGxvZ2dlZCBvdXQqL1xyXG4gICAgaXNMb2dnZWRPdXQoKSB7XHJcbiAgICAgICAgcmV0dXJuICF0aGlzLmlzTG9nZ2VkSW4oKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogbG9nb3V0IG9wZXJhdGlvbiAqL1xyXG4gICAgbG9nb3V0KCk6IE9ic2VydmFibGU8YW55PiB7XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZSgob2JzZXJ2ZXIpID0+IHtcclxuICAgICAgICAgICAgLy9sb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgnYXV0aGVudGljYXRpb25Ub2tlbicpO1xyXG4gICAgICAgICAgICBzZXNzaW9uU3RvcmFnZS5yZW1vdmVJdGVtKCdhdXRoZW50aWNhdGlvblRva2VuJyk7XHJcbiAgICAgICAgICAgIC8vc2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbSgnZXhwaXJlc19hdCcpO1xyXG4gICAgICAgICAgICBvYnNlcnZlci5jb21wbGV0ZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBcclxufVxyXG4iLCJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IEh0dHBJbnRlcmNlcHRvciwgSHR0cFJlcXVlc3QsIEh0dHBIYW5kbGVyLCBIdHRwRXZlbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcblxyXG4vKiogSW50ZXJjZXB0b3IgZm9yIGF1dGhlbnRpY2F0aW9uIHRva2VuIGluIEFQSSByZXF1ZXN0cyAqL1xyXG5leHBvcnQgY2xhc3MgQXV0aEludGVyY2VwdG9yIGltcGxlbWVudHMgSHR0cEludGVyY2VwdG9yIHtcclxuXHJcbiAgICAvKiogY29uc3RydWN0b3IqL1xyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICApIHtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoqIHJlcXVlc3QgaGFuZGxlciAqL1xyXG4gICAgaW50ZXJjZXB0KHJlcXVlc3Q6IEh0dHBSZXF1ZXN0PGFueT4sIG5leHQ6IEh0dHBIYW5kbGVyKTogT2JzZXJ2YWJsZTxIdHRwRXZlbnQ8YW55Pj4ge1xyXG4gICAgICAgIGlmICghcmVxdWVzdCB8fCAhcmVxdWVzdC51cmwgfHwgIShyZXF1ZXN0LnVybC5pbmNsdWRlcyhcImFwaVwiKSkgKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXh0LmhhbmRsZShyZXF1ZXN0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgdG9rZW4gPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdhdXRoZW50aWNhdGlvblRva2VuJyk7XHJcbiAgICAgICAgaWYgKCEhdG9rZW4pIHtcclxuICAgICAgICAgICAgcmVxdWVzdCA9IHJlcXVlc3QuY2xvbmUoe1xyXG4gICAgICAgICAgICAgICAgc2V0SGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgICAgIEF1dGhvcml6YXRpb246ICdCZWFyZXIgJyArIHRva2VuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV4dC5oYW5kbGUocmVxdWVzdCk7XHJcbiAgICB9XHJcblxyXG59XHJcbiIsImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgU3ViamVjdCwgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBBY2NvdW50U2VydmljZSB9IGZyb20gJy4uL2FjY291bnQvYWNjb3VudC5zZXJ2aWNlJztcclxuXHJcbi8qKiBQcmluY2lwYWwgc2VydmljZSovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFByaW5jaXBhbCB7XHJcbiAgICBwcml2YXRlIHVzZXJJZGVudGl0eTogYW55O1xyXG4gICAgcHJpdmF0ZSBhdXRoZW50aWNhdGVkID0gZmFsc2U7XHJcbiAgICBwcml2YXRlIGF1dGhlbnRpY2F0aW9uU3RhdGUgPSBuZXcgU3ViamVjdDxhbnk+KCk7XHJcblxyXG4gICAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBwcml2YXRlIGFjY291bnQ6IEFjY291bnRTZXJ2aWNlXHJcbiAgICApIHt9XHJcblxyXG4gICAgLyoqIGF1dGhlbnRpY2F0ZSB3aXRoIGdpdmVuIGlkZW50aXR5Ki9cclxuICAgIGF1dGhlbnRpY2F0ZShpZGVudGl0eSkge1xyXG4gICAgICAgIHRoaXMudXNlcklkZW50aXR5ID0gaWRlbnRpdHk7XHJcbiAgICAgICAgdGhpcy5hdXRoZW50aWNhdGVkID0gaWRlbnRpdHkgIT09IG51bGw7XHJcbiAgICAgICAgdGhpcy5hdXRoZW50aWNhdGlvblN0YXRlLm5leHQodGhpcy51c2VySWRlbnRpdHkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBjaGVjayB3aGV0aGVyIGN1cnJlbnQgdXNlciBoYXMgYW55IG9mIHRoZSBnaXZlbiBhdXRob3JpdGllcyAqL1xyXG4gICAgaGFzQW55QXV0aG9yaXR5KGF1dGhvcml0aWVzOiBzdHJpbmdbXSk6IFByb21pc2U8Ym9vbGVhbj4ge1xyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5oYXNBbnlBdXRob3JpdHlEaXJlY3QoYXV0aG9yaXRpZXMpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogY2hlY2sgd2hldGhlciBjdXJyZW50IHVzZXIgaGFzIGFueSBvZiB0aGUgZ2l2ZW4gYXV0aG9yaXRpZXMgb24gdGhlIGdpdmVuIHRlcnJpdG9yeSAqL1xyXG4gICAgaGFzQW55QXV0aG9yaXR5T25UZXJyaXRvcnkoYXV0aG9yaXRpZXM6IHN0cmluZ1tdLHRlcnJpdG9yeTogc3RyaW5nICk6IFByb21pc2U8Ym9vbGVhbj4ge1xyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5oYXNBbnlBdXRob3JpdHlEaXJlY3RPblRlcnJpdG9yeShhdXRob3JpdGllcyx0ZXJyaXRvcnkpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogY2hlY2sgd2hldGhlciBjdXJyZW50IHVzZXIgaGFzIGFueSBvZiB0aGUgZ2l2ZW4gYXV0aG9yaXRpZXMgd2l0aG91dCByZXNvbHZpbmcgcHJvbWlzZXMqL1xyXG4gICAgaGFzQW55QXV0aG9yaXR5RGlyZWN0KGF1dGhvcml0aWVzOiBzdHJpbmdbXSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICghdGhpcy5hdXRoZW50aWNhdGVkIHx8ICF0aGlzLnVzZXJJZGVudGl0eSB8fCAhdGhpcy51c2VySWRlbnRpdHkuYXV0aG9yaXRpZXMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhdXRob3JpdGllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy51c2VySWRlbnRpdHkuYXV0aG9yaXRpZXMuaW5jbHVkZXMoYXV0aG9yaXRpZXNbaV0pKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBjaGVjayB3aGV0aGVyIGN1cnJlbnQgdXNlciBoYXMgYW55IG9mIHRoZSBnaXZlbiBhdXRob3JpdGllcyBvbiB0aGUgZ2l2ZW4gdGVycml0b3J5IHdpdGhvdXQgcmVzb2x2aW5nIHByb21pc2VzICovXHJcbiAgICBoYXNBbnlBdXRob3JpdHlEaXJlY3RPblRlcnJpdG9yeShhdXRob3JpdGllczogc3RyaW5nW10sdGVycml0b3J5OiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAoIXRoaXMuYXV0aGVudGljYXRlZCB8fCAhdGhpcy51c2VySWRlbnRpdHkgfHwgIXRoaXMudXNlcklkZW50aXR5LmF1dGhvcml0aWVzKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXV0aG9yaXRpZXMubGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnVzZXJJZGVudGl0eS5hdXRob3JpdGllc1BlclRlcnJpdG9yeVt0ZXJyaXRvcnldICYmIHRoaXMudXNlcklkZW50aXR5LmF1dGhvcml0aWVzUGVyVGVycml0b3J5W3RlcnJpdG9yeV0uaW5jbHVkZXMoYXV0aG9yaXRpZXNbaV0pKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBjaGVjayB3aGV0aGVyIGN1cnJlbnQgdXNlciBoYXMgdGhlIGdpdmVuIGF1dGhvcml0eSAqL1xyXG4gICAgaGFzQXV0aG9yaXR5KGF1dGhvcml0eTogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPiB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmF1dGhlbnRpY2F0ZWQpIHtcclxuICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGZhbHNlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmlkZW50aXR5KCkudGhlbigoaWQpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShpZC5hdXRob3JpdGllcyAmJiBpZC5hdXRob3JpdGllcy5pbmNsdWRlcyhhdXRob3JpdHkpKTtcclxuICAgICAgICB9LCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoZmFsc2UpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBjaGVjayB3aGV0aGVyIGN1cnJlbnQgdXNlciBoYXMgdGhlIGdpdmVuIGF1dGhvcml0eSBvbiB0aGUgZ2l2ZW4gdGVycml0b3J5Ki9cclxuICAgIGhhc0F1dGhvcml0eU9uVGVycml0b3J5KGF1dGhvcml0eTogc3RyaW5nLHRlcnJpdG9yeTogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPiB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmF1dGhlbnRpY2F0ZWQpIHtcclxuICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGZhbHNlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmlkZW50aXR5KCkudGhlbigoaWQpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShpZC5hdXRob3JpdGllc1BlclRlcnJpdG9yeSAmJiBpZC5hdXRob3JpdGllc1BlclRlcnJpdG9yeVt0ZXJyaXRvcnldICYmIGlkLmF1dGhvcml0aWVzUGVyVGVycml0b3J5W3RlcnJpdG9yeV0uaW5jbHVkZXMoYXV0aG9yaXR5KSk7XHJcbiAgICAgICAgfSwgKCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGZhbHNlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogY2hlY2sgdXNlciBpZGVudGl0eSovXHJcbiAgICBpZGVudGl0eShmb3JjZT86IGJvb2xlYW4pOiBQcm9taXNlPGFueT4ge1xyXG4gICAgICAgIGlmIChmb3JjZSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLnVzZXJJZGVudGl0eSA9IHVuZGVmaW5lZDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGNoZWNrIGFuZCBzZWUgaWYgd2UgaGF2ZSByZXRyaWV2ZWQgdGhlIHVzZXJJZGVudGl0eSBkYXRhIGZyb20gdGhlIHNlcnZlci5cclxuICAgICAgICAvLyBpZiB3ZSBoYXZlLCByZXVzZSBpdCBieSBpbW1lZGlhdGVseSByZXNvbHZpbmdcclxuICAgICAgICBpZiAodGhpcy51c2VySWRlbnRpdHkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzLnVzZXJJZGVudGl0eSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyByZXRyaWV2ZSB0aGUgdXNlcklkZW50aXR5IGRhdGEgZnJvbSB0aGUgc2VydmVyLCB1cGRhdGUgdGhlIGlkZW50aXR5IG9iamVjdCwgYW5kIHRoZW4gcmVzb2x2ZS5cclxuICAgICAgICByZXR1cm4gdGhpcy5hY2NvdW50LmdldCgpLnRvUHJvbWlzZSgpLnRoZW4oKHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGFjY291bnQgPSByZXNwb25zZTtcclxuICAgICAgICAgICAgaWYgKGFjY291bnQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudXNlcklkZW50aXR5ID0gYWNjb3VudDtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXV0aGVudGljYXRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVzZXJJZGVudGl0eSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmF1dGhlbnRpY2F0ZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmF1dGhlbnRpY2F0aW9uU3RhdGUubmV4dCh0aGlzLnVzZXJJZGVudGl0eSk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnVzZXJJZGVudGl0eTtcclxuICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMudXNlcklkZW50aXR5ID0gbnVsbDtcclxuICAgICAgICAgICAgdGhpcy5hdXRoZW50aWNhdGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMuYXV0aGVudGljYXRpb25TdGF0ZS5uZXh0KHRoaXMudXNlcklkZW50aXR5KTtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGNoZWNrIHdoZXRoZXIgY3VycmVudCB1c2VyIGlzIGF1dGhlbnRpY2F0ZWQgKi9cclxuICAgIGlzQXV0aGVudGljYXRlZCgpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hdXRoZW50aWNhdGVkO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBjaGVjayB3aGV0aGVyIGN1cnJlbnQgdXNlciBpZGVudGl0eSBpcyByZXNvbHZlZCAqL1xyXG4gICAgaXNJZGVudGl0eVJlc29sdmVkKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnVzZXJJZGVudGl0eSAhPT0gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgY3VycmVudCB1c2VyIGF1dGhlbnRpY2F0aW9uIHN0YXRlICovXHJcbiAgICBnZXRBdXRoZW50aWNhdGlvblN0YXRlKCk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXV0aGVudGljYXRpb25TdGF0ZS5hc09ic2VydmFibGUoKTtcclxuICAgIH1cclxuXHJcblxyXG59XHJcbiIsImltcG9ydCB7IEluamVjdG9yLCBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBJbnRlcmNlcHRvciwgSHR0cFJlcXVlc3QsIEh0dHBIYW5kbGVyLCBIdHRwRXZlbnQsIEh0dHBFcnJvclJlc3BvbnNlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IEF1dGhTZXJ2aWNlIH0gZnJvbSAnLi9hdXRoLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBBY3RpdmF0ZWRSb3V0ZSwgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcclxuaW1wb3J0IHsgUHJpbmNpcGFsIH0gZnJvbSAnLi9wcmluY2lwYWwuc2VydmljZSc7XHJcblxyXG4vKiogSW50ZXJjZXB0b3IgZm9yIGF1dGhlbnRpY2F0aW9uIGV4cGlyZWQgcmVzcG9uc2UgaW4gQVBJIHJlcXVlc3RzICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIEF1dGhFeHBpcmVkSW50ZXJjZXB0b3IgaW1wbGVtZW50cyBIdHRwSW50ZXJjZXB0b3Ige1xyXG5cclxuICAgIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgcHJpdmF0ZSByb3V0ZXI6IFJvdXRlciwgICAgIFxyXG4gICAgICAgIHByaXZhdGUgYXV0aFNlcnZpY2U6IEF1dGhTZXJ2aWNlLCBcclxuICAgICAgICBwcml2YXRlIHByaW5jaXBhbDogUHJpbmNpcGFsXHJcbiAgICApIHt9XHJcblxyXG4gICAgLyoqIHJlcXVlc3QgaGFuZGxlciAqL1xyXG4gICAgaW50ZXJjZXB0KHJlcXVlc3Q6IEh0dHBSZXF1ZXN0PGFueT4sIG5leHQ6IEh0dHBIYW5kbGVyKTogT2JzZXJ2YWJsZTxIdHRwRXZlbnQ8YW55Pj4ge1xyXG4gICAgICAgIHJldHVybiBuZXh0LmhhbmRsZShyZXF1ZXN0KS5kbygoZXZlbnQ6IEh0dHBFdmVudDxhbnk+KSA9PiB7fSwgKGVycjogYW55KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChlcnIgaW5zdGFuY2VvZiBIdHRwRXJyb3JSZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGVyci5zdGF0dXMgPT09IDQwMSkgeyAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hdXRoU2VydmljZS5sb2dvdXQoKS5zdWJzY3JpYmUoKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnByaW5jaXBhbC5hdXRoZW50aWNhdGUobnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoWycvJ10pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBBdXRoU2VydmljZSB9IGZyb20gJy4vYXV0aC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgUHJpbmNpcGFsIH0gZnJvbSAnLi9wcmluY2lwYWwuc2VydmljZSc7XHJcblxyXG4vKiogTG9naW4gc2VydmljZSovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIExvZ2luU2VydmljZSB7XHJcbiAgICBcclxuICAgIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgcHJpdmF0ZSBhdXRoU2VydmVyUHJvdmlkZXI6IEF1dGhTZXJ2aWNlLCBcclxuICAgICAgICBwcml2YXRlIHByaW5jaXBhbDogUHJpbmNpcGFsXHJcbiAgICApIHt9XHJcblxyXG4gICAgLyoqTG9naW4gb3BlcmF0aW9uKi9cclxuICAgIGxvZ2luKGNyZWRlbnRpYWxzLCBjYWxsYmFjaz8pIHtcclxuICAgICAgICBjb25zdCBjYiA9IGNhbGxiYWNrIHx8IGZ1bmN0aW9uKCkge307XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuYXV0aFNlcnZlclByb3ZpZGVyLmxvZ2luKGNyZWRlbnRpYWxzKS5zdWJzY3JpYmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMucHJpbmNpcGFsLmlkZW50aXR5KHRydWUpLnRoZW4oKGFjY291bnQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBBZnRlciB0aGUgbG9naW4gdGhlIGxhbmd1YWdlIHdpbGwgYmUgY2hhbmdlZCB0b1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHRoZSBsYW5ndWFnZSBzZWxlY3RlZCBieSB0aGUgdXNlciBkdXJpbmcgaGlzIHJlZ2lzdHJhdGlvblxyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY2IoKTtcclxuICAgICAgICAgICAgfSwgKGVycikgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2dvdXQoKTtcclxuICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNiKGVycik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgLyoqbG9naW4gd2l0aCBqd3QgdG9rZW4gKi9cclxuICAgIGxvZ2luV2l0aFRva2VuKGp3dCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmF1dGhTZXJ2ZXJQcm92aWRlci5sb2dpbldpdGhUb2tlbihqd3QpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBsb2dvdXQgb3BlcmF0aW9uICovXHJcbiAgICBsb2dvdXQoKSB7XHJcbiAgICAgICB0aGlzLmF1dGhTZXJ2ZXJQcm92aWRlci5sb2dvdXQoKS5zdWJzY3JpYmUoKTtcclxuICAgICAgIHRoaXMucHJpbmNpcGFsLmF1dGhlbnRpY2F0ZShudWxsKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcbmltcG9ydCB7IFVzZXIgfSBmcm9tICcuL3VzZXIubW9kZWwnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcblxyXG4vKiogVXNlciBtYW5hZ2VyIHNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgVXNlclNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxVc2VyPiB7XHJcbiAgXHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIFVTRVJfQVBJID0ndXNlcnMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihVc2VyLCBcInVzZXJzXCIsIGluamVjdG9yKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqIHJlbW92ZSB1c2VyKi9cclxuICByZW1vdmUoaXRlbTogVXNlcikge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIHVzZXIqL1xyXG4gIHNhdmUoaXRlbTogYW55KTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgIGlmIChpdGVtLl9saW5rcyE9bnVsbCkge1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucHV0KGl0ZW0uX2xpbmtzLnNlbGYuaHJlZiwgaXRlbSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLlVTRVJfQVBJICwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICAgIFxyXG4gIC8qKiBjaGFuZ2UgcGFzc3dvcmQgbyBnaXZlbiB1c2VyIGlkICovXHJcbiAgY2hhbmdlUGFzc3dvcmQoaWQsaXRlbTogYW55KTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuVVNFUl9BUEkrXCIvXCIraWQrXCIvY2hhbmdlLXBhc3N3b3JkXCIpICwgaXRlbSk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuaW1wb3J0IHsgVGVycml0b3J5IH0gZnJvbSAnLi4vdGVycml0b3J5L3RlcnJpdG9yeS5tb2RlbCc7XHJcbmltcG9ydCB7IFVzZXIgfSBmcm9tICcuL3VzZXIubW9kZWwnO1xyXG4vKipcclxuICogVXNlciBwb3NpdGlvbiBtb2RlbFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFVzZXJQb3NpdGlvbiBleHRlbmRzIFJlc291cmNlIHtcclxuICAvKiogbmFtZSAqL1xyXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgLyoqIGVtYWlsICovXHJcbiAgcHVibGljIGVtYWlsOiBzdHJpbmc7XHJcbiAgLyoqIG9yZ2FuaXphdGlvbiBuYW1lKi9cclxuICBwdWJsaWMgb3JnYW5pemF0aW9uOiBzdHJpbmc7XHJcbiAgLyoqIHN5c3RlbSBjcmVhdGVkIGRhdGUqL1xyXG4gIHB1YmxpYyBjcmVhdGVkRGF0ZTogYW55O1xyXG4gIC8qKiBzeXN0ZW0gZGF0ZWQgZGF0ZSovXHJcbiAgcHVibGljIGRhdGVkRGF0ZTogYW55O1xyXG4gIC8qKiBwb3NpdGlvbiB0ZXJyaXRvcnkqL1xyXG4gIHB1YmxpYyB0ZXJyaXRvcnk6IFRlcnJpdG9yeTtcclxuICAvKiogdXNlciovXHJcbiAgcHVibGljIHVzZXI6IFVzZXI7XHJcbn1cclxuIiwiaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBVc2VyUG9zaXRpb24gfSBmcm9tICcuL3VzZXItcG9zaXRpb24ubW9kZWwnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcblxyXG4vKiogVXNlciBwb3NpdGlvbiBtYW5hZ2VyIHNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgVXNlclBvc2l0aW9uU2VydmljZSAgZXh0ZW5kcyBSZXN0U2VydmljZTxVc2VyUG9zaXRpb24+IHtcclxuICBcclxuXHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIFVTRVJfUE9TSVRJT05fQVBJID0gJ3VzZXItcG9zaXRpb25zJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoVXNlclBvc2l0aW9uLCBcInVzZXItcG9zaXRpb25zXCIsIGluamVjdG9yKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqIHJlbW92ZSB1c2VyIHBvc2l0aW9uKi9cclxuICByZW1vdmUoaXRlbTogVXNlclBvc2l0aW9uKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgdXNlciBwb3NpdGlvbiovXHJcbiAgc2F2ZShpdGVtOiBhbnkpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuICAgICAgaWYgKGl0ZW0udXNlciAhPW51bGwpe1xyXG4gICAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ3VzZXInLGl0ZW0udXNlcikuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgIFxyXG4gICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGl0ZW0udGVycml0b3J5ICE9bnVsbCl7XHJcbiAgICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbigndGVycml0b3J5JyxpdGVtLnRlcnJpdG9yeSkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgIFxyXG4gICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGl0ZW0udGVycml0b3J5ID0gaXRlbS50ZXJyaXRvcnkuX2xpbmtzLnNlbGYuaHJlZjtcclxuICAgICAgaXRlbS51c2VyID0gaXRlbS51c2VyLl9saW5rcy5zZWxmLmhyZWY7XHJcbiAgXHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuVVNFUl9QT1NJVElPTl9BUEkpICwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBcclxufVxyXG4iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuaW1wb3J0IHsgUm9sZSB9IGZyb20gJy4uL3JvbGUvcm9sZS5tb2RlbCc7XHJcbmltcG9ydCB7IFRlcnJpdG9yeSB9IGZyb20gJy4uL3RlcnJpdG9yeS90ZXJyaXRvcnkubW9kZWwnO1xyXG5pbXBvcnQgeyBVc2VyIH0gZnJvbSAnLi91c2VyLm1vZGVsJztcclxuXHJcbi8qKlxyXG4gKiBVc2VyIHBlcm1pc3Npb24gbW9kZWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBVc2VyQ29uZmlndXJhdGlvbiBleHRlbmRzIFJlc291cmNlIHtcclxuICAvKiogcm9sZSAqLyAgXHJcbiAgcHVibGljIHJvbGU6IFJvbGU7XHJcbiAgLyoqIHRlcnJpdG9yeSAqLyBcclxuICBwdWJsaWMgdGVycml0b3J5OiBUZXJyaXRvcnk7XHJcbiAgLyoqIHVzZXIgKi9cclxuICBwdWJsaWMgdXNlcjogVXNlcjtcclxufVxyXG4iLCJpbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcbmltcG9ydCB7IFVzZXJDb25maWd1cmF0aW9uIH0gZnJvbSAnLi91c2VyLWNvbmZpZ3VyYXRpb24ubW9kZWwnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcblxyXG4vKiogVXNlciBjb25maWd1cmF0aW9uIG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBVc2VyQ29uZmlndXJhdGlvblNlcnZpY2UgIGV4dGVuZHMgUmVzdFNlcnZpY2U8VXNlckNvbmZpZ3VyYXRpb24+IHtcclxuXHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIFVTRVJfQ09ORklHVVJBVElPTl9BUEkgPSAndXNlci1jb25maWd1cmF0aW9ucyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKFVzZXJDb25maWd1cmF0aW9uLCBcInVzZXItY29uZmlndXJhdGlvbnNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIHVzZXIgY29uZmlndXJhdGlvbiovXHJcbiAgcmVtb3ZlKGl0ZW06IFVzZXJDb25maWd1cmF0aW9uKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgdXNlciBjb25maWd1cmF0aW9uKi9cclxuICBzYXZlKGl0ZW06IGFueSk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICBpZiAoaXRlbS5fbGlua3MhPW51bGwpIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgICBpZiAoaXRlbS51c2VyICE9bnVsbCl7XHJcbiAgICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbigndXNlcicsaXRlbS51c2VyKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgXHJcbiAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoaXRlbS50ZXJyaXRvcnkgIT1udWxsKXtcclxuICAgICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCd0ZXJyaXRvcnknLGl0ZW0udGVycml0b3J5KS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgXHJcbiAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoaXRlbS5yb2xlICE9bnVsbCl7XHJcbiAgICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbigncm9sZScsaXRlbS5yb2xlKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgXHJcbiAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaXRlbS50ZXJyaXRvcnkgPSBpdGVtLnRlcnJpdG9yeS5fbGlua3Muc2VsZi5ocmVmO1xyXG4gICAgICBpdGVtLnJvbGUgPSBpdGVtLnJvbGUuX2xpbmtzLnNlbGYuaHJlZjtcclxuICAgICAgaXRlbS51c2VyID0gaXRlbS51c2VyLl9saW5rcy5zZWxmLmhyZWY7XHJcbiAgXHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuVVNFUl9DT05GSUdVUkFUSU9OX0FQSSkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG5pbXBvcnQgeyBUZXJyaXRvcnlUeXBlIH0gZnJvbSAnLi90ZXJyaXRvcnktdHlwZS5tb2RlbCc7XHJcblxyXG4vKipcclxuICogVGVycml0b3J5IG1vZGVsXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgVGVycml0b3J5IGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiBpZCAqL1xyXG4gIHB1YmxpYyBpZDogbnVtYmVyOyAgXHJcbiAgLyoqIGNvZGUgKi9cclxuICBwdWJsaWMgY29kZTogc3RyaW5nO1xyXG4gIC8qKiBuYW1lICovXHJcbiAgcHVibGljIG5hbWU6IHN0cmluZztcclxuICAvKiogYWRkcmVzcyovXHJcbiAgcHVibGljIHRlcnJpdG9yaWFsQXV0aG9yaXR5QWRkcmVzczogc3RyaW5nO1xyXG4gIC8qKiBhZG1pbiAqL1xyXG4gIHB1YmxpYyB0ZXJyaXRvcmlhbEF1dGhvcml0eU5hbWU6IHN0cmluZztcclxuICAvKiogd2hldGhlciB0ZXJyaXRvcnkgaXMgYmxvY2tlZCovXHJcbiAgcHVibGljIGJsb2NrZWQ6IGJvb2xlYW47XHJcbiAgLyoqIGNvbW1lbnRzKi9cclxuICBwdWJsaWMgY29tbWVudHM6IHN0cmluZztcclxuICAvKiogc3lzdGVtIGNyZWF0ZWQgZGF0ZSovXHJcbiAgcHVibGljIGNyZWF0ZWREYXRlOiBhbnk7XHJcbiAgLyoqIGNvbnRhY3QgZW1haWwgKi8gIFxyXG4gIHB1YmxpYyB0ZXJyaXRvcmlhbEF1dGhvcml0eUVtYWlsOiBzdHJpbmc7XHJcbiAgLyoqIGV4dGVuc2lvbiAqL1xyXG4gIHB1YmxpYyBleHRlbnQ6IHN0cmluZztcclxuICAvKiogbG9nbyBpbWFnZSBVUkwgKi9cclxuICBwdWJsaWMgdGVycml0b3JpYWxBdXRob3JpdHlMb2dvOiBzdHJpbmc7XHJcbiAgLyoqIGNvbnRhY3Qgb3JnYW5pemF0aW9uIG5hbWUgKi9cclxuICAvLyBwdWJsaWMgb3JnYW5pemF0aW9uTmFtZTogc3RyaW5nO1xyXG4gIC8qKiBzY29wZSovXHJcbiAgcHVibGljIHNjb3BlOiBzdHJpbmc7XHJcbiAgLyoqIHR5cGUgKi8gIFxyXG4gIHB1YmxpYyB0eXBlOiBUZXJyaXRvcnlUeXBlO1xyXG4gIC8qKiBncm91cCB0eXBlICovXHJcbiAgZ3JvdXBUeXBlOiB7XHJcbiAgICBpZDogMCxcclxuICAgIG5hbWU6IHN0cmluZ1xyXG4gIH07XHJcbiAgLyoqIHRlcnJpdG9yeSBtZW1iZXJzKi9cclxuICBwdWJsaWMgbWVtYmVyczogVGVycml0b3J5W107XHJcblxyXG59XHJcbiIsImltcG9ydCB7IFRlcnJpdG9yeSB9IGZyb20gJy4vdGVycml0b3J5Lm1vZGVsJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMvT2JzZXJ2YWJsZSc7XHJcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuXHJcbi8qKiBUZXJyaXRvcnkgbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFRlcnJpdG9yeVNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxUZXJyaXRvcnk+IHtcclxuICBcclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgVEVSUklUT1JZX0FQSSA9ICd0ZXJyaXRvcmllcyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKFRlcnJpdG9yeSwgXCJ0ZXJyaXRvcmllc1wiLCBpbmplY3Rvcik7XHJcbiAgfVxyXG4gIFxyXG4gIC8qKiByZW1vdmUgdGVycml0b3J5Ki9cclxuICByZW1vdmUoaXRlbTogVGVycml0b3J5KSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgdGVycml0b3J5Ki9cclxuICBzYXZlKGl0ZW06IFRlcnJpdG9yeSk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICBpZiAoaXRlbS50eXBlIT1udWxsKVxyXG4gICAgICBpdGVtLnR5cGUgPSBpdGVtLnR5cGUuX2xpbmtzLnNlbGYuaHJlZjtcclxuICAgIGlmIChpdGVtLl9saW5rcyE9bnVsbCkge1xyXG4gICAgICBcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5URVJSSVRPUllfQVBJKSAsIGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgXHJcbn1cclxuIiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcblxyXG4vKipcclxuICogVGVycml0b3J5IHR5cGUgbW9kZWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBUZXJyaXRvcnlUeXBlIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gICAvKiogaWQgKi9cclxuICAgcHVibGljIGlkOiBudW1iZXI7ICBcclxuICAvKiogbmFtZSAqL1xyXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbn1cclxuIiwiaW1wb3J0IHsgVGVycml0b3J5IH0gZnJvbSAnLi90ZXJyaXRvcnkubW9kZWwnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcy9PYnNlcnZhYmxlJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBUZXJyaXRvcnlUeXBlIH0gZnJvbSAnLi90ZXJyaXRvcnktdHlwZS5tb2RlbCc7XHJcblxyXG4vKiogVGVycml0b3J5VHlwZSBtYW5hZ2VyIHNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgVGVycml0b3J5VHlwZVNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxUZXJyaXRvcnlUeXBlPiB7XHJcbiAgXHJcblxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBURVJSSVRPUllUWVBFX0FQSSA9ICd0ZXJyaXRvcnktdHlwZXMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihUZXJyaXRvcnlUeXBlLCBcInRlcnJpdG9yeS10eXBlc1wiLCBpbmplY3Rvcik7XHJcbiAgfVxyXG4gIFxyXG4gIC8qKiByZW1vdmUgdGVycml0b3J5IHR5cGUqL1xyXG4gIHJlbW92ZShpdGVtOiBUZXJyaXRvcnlUeXBlKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgdGVycml0b3J5IHR5cGUqL1xyXG4gIHNhdmUoaXRlbTogYW55KTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgIGlmIChpdGVtLl9saW5rcyE9bnVsbCkge1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucHV0KGl0ZW0uX2xpbmtzLnNlbGYuaHJlZiwgaXRlbSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLlRFUlJJVE9SWVRZUEVfQVBJKSAsIGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgXHJcbn1cclxuIiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcblxyXG4vKipcclxuICogVGVycml0b3J5IHR5cGUgbW9kZWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBUZXJyaXRvcnlHcm91cFR5cGUgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgLyoqIGlkICovXHJcbiAgcHVibGljIGlkOiBudW1iZXI7ICBcclxuICAvKiogbmFtZSAqL1xyXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbn1cclxuIiwiaW1wb3J0IHsgVGVycml0b3J5R3JvdXBUeXBlIH0gZnJvbSAnLi90ZXJyaXRvcnktZ3JvdXAtdHlwZS5tb2RlbCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzL09ic2VydmFibGUnO1xyXG5pbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcbkBJbmplY3RhYmxlKHtcclxuICBwcm92aWRlZEluOiAncm9vdCdcclxufSlcclxuZXhwb3J0IGNsYXNzIFRlcnJpdG9yeUdyb3VwVHlwZVNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxUZXJyaXRvcnlHcm91cFR5cGU+IHtcclxuICBcclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgVEVSUklUT1JZR1JPVVBUWVBFX0FQSSA9ICd0ZXJyaXRvcnktZ3JvdXAtdHlwZXMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihUZXJyaXRvcnlHcm91cFR5cGUsIFwidGVycml0b3J5LWdyb3VwLXR5cGVzXCIsIGluamVjdG9yKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqIHJlbW92ZSB0ZXJyaXRvcnkqL1xyXG4gIHJlbW92ZShpdGVtOiBUZXJyaXRvcnlHcm91cFR5cGUpIHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKGl0ZW0uX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgIFxyXG4gIH1cclxuICBcclxuICAvKiogc2F2ZSB0ZXJyaXRvcnkqL1xyXG4gIHNhdmUoaXRlbTogYW55KTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgIGlmIChpdGVtLl9saW5rcyE9bnVsbCkge1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucHV0KGl0ZW0uX2xpbmtzLnNlbGYuaHJlZiwgaXRlbSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLlRFUlJJVE9SWUdST1VQVFlQRV9BUEkpICwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBcclxufSIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG5cclxuLyoqXHJcbiAqIFJvbGUgbW9kZWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBSb2xlIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiBpZCAqL1xyXG4gIHB1YmxpYyBpZDogbnVtYmVyO1xyXG4gIC8qKiBuYW1lKi9cclxuICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG4gIC8qKiBjb21tZW50cyovXHJcbiAgcHVibGljIGRlc2NyaXB0aW9uOiBzdHJpbmc7XHJcblxyXG59XHJcbiIsImltcG9ydCB7IFJvbGUgfSBmcm9tICcuL3JvbGUubW9kZWwnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuXHJcbi8qKiBSb2xlIG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBSb2xlU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPFJvbGU+IHtcclxuICBcclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgUk9MRV9BUEkgPSAncm9sZXMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihSb2xlLCBcInJvbGVzXCIsIGluamVjdG9yKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqIHJlbW92ZSByb2xlKi9cclxuICByZW1vdmUoaXRlbTogUm9sZSkge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIHJvbGUqL1xyXG4gIHNhdmUoaXRlbTogYW55KTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgIGlmIChpdGVtLl9saW5rcyE9bnVsbCkge1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucHV0KGl0ZW0uX2xpbmtzLnNlbGYuaHJlZiwgaXRlbSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLlJPTEVfQVBJKSAsIGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgXHJcbn1cclxuIiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcbi8qKlxyXG4gKiBDb25uZWN0aW9uIG1vZGVsXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgQ29ubmVjdGlvbiBleHRlbmRzIFJlc291cmNlIHtcclxuICAvKiogaWQgKi9cclxuICBwdWJsaWMgaWQ6IG51bWJlcjtcclxuICAvKiogbmFtZSovXHJcbiAgcHVibGljIG5hbWU6IHN0cmluZztcclxuICAvKiogdHlwZSovXHJcbiAgcHVibGljIHR5cGU6IHN0cmluZztcclxuICAvKiogdXNlciovXHJcbiAgcHVibGljIHVzZXI6IHN0cmluZztcclxuICAvKiogcGFzc3dvcmQqL1xyXG4gIHB1YmxpYyBwYXNzd29yZDogc3RyaW5nO1xyXG4gIC8qKiBjb25uZWN0aW9uIHN0cmluZyovXHJcbiAgcHVibGljIGNvbm5lY3Rpb25TdHJpbmc6IHN0cmluZztcclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgQ29ubmVjdGlvbiB9IGZyb20gJy4vY29ubmVjdGlvbi5tb2RlbCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzL09ic2VydmFibGUnO1xyXG5pbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcblxyXG4vKiogQ29ubmVjdGlvbiBtYW5hZ2VyIHNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgQ29ubmVjdGlvblNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxDb25uZWN0aW9uPiB7XHJcbiAgXHJcblxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBDT05ORUNUSU9OX0FQSSA9ICdjb25uZWN0aW9ucyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKENvbm5lY3Rpb24sIFwiY29ubmVjdGlvbnNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIGNvbm5lY3Rpb24qL1xyXG4gIHJlbW92ZShpdGVtOiBDb25uZWN0aW9uKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgY29ubmVjdGlvbiovXHJcbiAgc2F2ZShpdGVtOiBDb25uZWN0aW9uKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgIGlmIChpdGVtLl9saW5rcyE9bnVsbCkge1xyXG4gICAgICBcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5DT05ORUNUSU9OX0FQSSkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG5cclxuaW1wb3J0IHsgQ29ubmVjdGlvbiB9IGZyb20gJy4uL2Nvbm5lY3Rpb24vY29ubmVjdGlvbi5tb2RlbCc7XHJcbmltcG9ydCB7IFJvbGUgfSBmcm9tICcuLi9yb2xlL3JvbGUubW9kZWwnO1xyXG5pbXBvcnQgeyBUYXNrVHlwZSB9IGZyb20gJy4vdGFzay10eXBlLm1vZGVsJztcclxuaW1wb3J0IHsgVGFza0dyb3VwIH0gZnJvbSAnLi90YXNrLWdyb3VwLm1vZGVsJztcclxuaW1wb3J0IHsgVGFza0F2YWlsYWJpbGl0eSB9IGZyb20gJy4vdGFzay1hdmFpbGFiaWxpdHkubW9kZWwnO1xyXG5pbXBvcnQgeyBUYXNrUGFyYW1ldGVyIH0gZnJvbSAnLi90YXNrLXBhcmFtZXRlci5tb2RlbCc7XHJcblxyXG4vL0ZJWE1FIGVuc3VyZSB0YXNrIGNyZWF0aW9uIGluIGFkbWluIGFwcCB1cG9uIGluaXRpYWxpemF0aW9uIChhcyBpdCBpcyBkb25lIHdpdGggUm9sZXMgYW5kIGRlZmF1bHQgVXNlcnMpXHJcbi8qKiBHRU9BRE1JTl90YXNrIGlkICovXHJcbmV4cG9ydCBjb25zdCBHRU9BRE1JTl9UUkVFX1RBU0tfSUQ6c3RyaW5nICA9IFwiZ2VvYWRtaW5cIjtcclxuXHJcbmltcG9ydCB7IFRhc2tVSSB9IGZyb20gJy4vdGFzay11aS5tb2RlbCc7XHJcbi8qKiBUYXNrIG1vZGVsICovXHJcbmV4cG9ydCBjbGFzcyBUYXNrIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiBpZCAqL1xyXG4gIHB1YmxpYyBpZDogbnVtYmVyO1xyXG4gIC8qKiBuYW1lICovICBcclxuICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG4gIC8qKiBvcmRlciovXHJcbiAgcHVibGljIG9yZGVyOiBOdW1iZXI7XHJcbiAgLyoqIHN5c3RlbSBjcmVhdGVkIGRhdGUqL1xyXG4gIHB1YmxpYyBjcmVhdGVkRGF0ZTogYW55O1xyXG4gIC8qKiB0YXNrIGdyb3VwKi9cclxuICBwdWJsaWMgZ3JvdXA6IFRhc2tHcm91cDtcclxuICAvKiogdGFzayB0eXBlKi9cclxuICBwdWJsaWMgdHlwZTogVGFza1R5cGU7XHJcbiAgLyoqIHRhc2sgVUkqL1xyXG4gIHB1YmxpYyB1aTogVGFza1VJO1xyXG4gIC8qKiBwYXJhbWV0ZXJzKi9cclxuICBwdWJsaWMgcGFyYW1ldGVyczogVGFza1BhcmFtZXRlcltdO1xyXG4gIC8qKiBjb25uZWN0aW9uKi9cclxuICBwdWJsaWMgY29ubmVjdGlvbjogQ29ubmVjdGlvbjtcclxuICAvKiogcm9sZXMqL1xyXG4gIHB1YmxpYyByb2xlczogUm9sZVtdO1xyXG4gIC8qKiBhdmFpbGFiaWxpdGllcyovXHJcbiAgcHVibGljIGF2YWlsYWJpbGl0aWVzOiBUYXNrQXZhaWxhYmlsaXR5W107XHJcbn1cclxuIiwiaW1wb3J0IHsgVGFzayB9IGZyb20gJy4vdGFzay5tb2RlbCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzL09ic2VydmFibGUnO1xyXG5pbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcblxyXG4vKiogVGFzayBtYW5hZ2VyIHNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgVGFza1NlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxUYXNrPiB7XHJcblxyXG4gICAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgICBwdWJsaWMgQ09OTkVDVElPTl9BUEkgPSAndGFza3MnO1xyXG5cclxuICAgIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gICAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLCBwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgICAgICBzdXBlcihUYXNrLCBcInRhc2tzXCIsIGluamVjdG9yKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogcmVtb3ZlIHRhc2sqL1xyXG4gICAgcmVtb3ZlKGl0ZW06IFRhc2spIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKiogc2F2ZSB0YXNrKi9cclxuICAgIHNhdmUoaXRlbTogVGFzayk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICAgICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgICAgIGNvbnN0IHRhc2tUeXBlID0gaXRlbS50eXBlO1xyXG4gICAgICAgIGNvbnN0IHRhc2tHcm91cCA9IGl0ZW0uZ3JvdXA7XHJcbiAgICAgICAgbGV0IHRhc2tDb25uZWN0aW9uID0gaXRlbS5jb25uZWN0aW9uO1xyXG4gICAgICAgIGxldCB0YXNrVUkgPSBpdGVtLnVpO1xyXG4gICAgICAgIGlmIChpdGVtLl9saW5rcyAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLkNPTk5FQ1RJT05fQVBJKSwgaXRlbSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG4vKipcclxuICogVGFzayB0eXBlIG1vZGVsXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgVGFza1R5cGUgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgLyoqIG5hbWUqLyAgXHJcbiAgcHVibGljIG5hbWU6IHN0cmluZztcclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgVGFza1R5cGUgfSBmcm9tICcuL3Rhc2stdHlwZS5tb2RlbCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzL09ic2VydmFibGUnO1xyXG5pbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcblxyXG4vKiogVGFza1R5cGUgbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFRhc2tUeXBlU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPFRhc2tUeXBlPiB7XHJcbiAgXHJcblxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBDT05ORUNUSU9OX0FQSSA9ICd0YXNrLXR5cGVzJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoVGFza1R5cGUsIFwidGFzay10eXBlc1wiLCBpbmplY3Rvcik7XHJcbiAgfVxyXG4gIFxyXG4gIC8qKiByZW1vdmUgdGFzayB0eXBlKi9cclxuICByZW1vdmUoaXRlbTogVGFza1R5cGUpIHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKGl0ZW0uX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgIFxyXG4gIH1cclxuICBcclxuICAvKiogc2F2ZSB0YXNrIHR5cGUqL1xyXG4gIHNhdmUoaXRlbTogVGFza1R5cGUpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIFxyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucHV0KGl0ZW0uX2xpbmtzLnNlbGYuaHJlZiwgaXRlbSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLkNPTk5FQ1RJT05fQVBJKSAsIGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgXHJcbn1cclxuIiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcbi8qKlxyXG4gKiBUYXNrIGdyb3VwIG1vZGVsXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgVGFza0dyb3VwIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiBpZCAqL1xyXG4gIHB1YmxpYyBpZDogbnVtYmVyOyAgXHJcbiAgLyoqIG5hbWUqLyAgXHJcbiAgcHVibGljIG5hbWU6IHN0cmluZztcclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgVGFza0dyb3VwIH0gZnJvbSAnLi90YXNrLWdyb3VwLm1vZGVsJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMvT2JzZXJ2YWJsZSc7XHJcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuXHJcbi8qKiBUYXNrIGdyb3VwIG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBUYXNrR3JvdXBTZXJ2aWNlIGV4dGVuZHMgUmVzdFNlcnZpY2U8VGFza0dyb3VwPiB7XHJcbiAgXHJcblxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBDT05ORUNUSU9OX0FQSSA9ICd0YXNrLWdyb3Vwcyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKFRhc2tHcm91cCwgXCJ0YXNrLWdyb3Vwc1wiLCBpbmplY3Rvcik7XHJcbiAgfVxyXG4gIFxyXG4gIC8qKiByZW1vdmUgdGFzayBncm91cCovXHJcbiAgcmVtb3ZlKGl0ZW06IFRhc2tHcm91cCkge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIHRhc2sgZ3JvdXAqL1xyXG4gIHNhdmUoaXRlbTogVGFza0dyb3VwKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgIGlmIChpdGVtLl9saW5rcyE9bnVsbCkge1xyXG4gICAgICBcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5DT05ORUNUSU9OX0FQSSkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG5pbXBvcnQge1Rhc2t9IGZyb20gJy4vdGFzay5tb2RlbCc7ICBcclxuLyoqXHJcbiAqIFRhc2sgcGFyYW1ldGVyIG1vZGVsXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgVGFza1BhcmFtZXRlciBleHRlbmRzIFJlc291cmNlIHtcclxuICAvKiogbmFtZSovICBcclxuICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG4gIFxyXG4gIC8qKiB0eXBlKi9cclxuICBwdWJsaWMgdHlwZTogc3RyaW5nO1xyXG4gICAgXHJcbiAgLyoqIHZhbHVlKi9cclxuICBwdWJsaWMgdmFsdWU6IHN0cmluZztcclxuICBcclxuICAvKiogb3JkZXIqLyAgXHJcbiAgcHVibGljIG9yZGVyOiBOdW1iZXI7XHJcbiAgXHJcbiAgLyoqIHRhc2sqLyAgXHJcbiAgcHVibGljIHRhc2s6VGFzaztcclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgVGFza1BhcmFtZXRlciB9IGZyb20gJy4vdGFzay1wYXJhbWV0ZXIubW9kZWwnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcy9PYnNlcnZhYmxlJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5cclxuLyoqIFRhc2sgcGFyYW1ldGVyIG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpIFxyXG5leHBvcnQgY2xhc3MgVGFza1BhcmFtZXRlclNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxUYXNrUGFyYW1ldGVyPiB7XHJcbiAgXHJcblxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBUQVNLX1BBUkFNRVRFUl9BUEkgPSAndGFzay1wYXJhbWV0ZXJzJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoVGFza1BhcmFtZXRlciwgXCJ0YXNrLXBhcmFtZXRlcnNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIHRhc2sgcGFyYW1ldGVyKi9cclxuICByZW1vdmUoaXRlbTogVGFza1BhcmFtZXRlcikge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIHRhc2sgcGFyYW1ldGVyKi9cclxuICBzYXZlKGl0ZW06IFRhc2tQYXJhbWV0ZXIpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuICAgICAgaWYgKGl0ZW0udGFzayAhPW51bGwpe1xyXG4gICAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ3Rhc2snLGl0ZW0udGFzaykuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgIFxyXG4gICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpdGVtLnRhc2sgPSBpdGVtLnRhc2suX2xpbmtzLnNlbGYuaHJlZjtcclxuICBcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5UQVNLX1BBUkFNRVRFUl9BUEkpICwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBcclxufVxyXG4iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuaW1wb3J0IHsgVGVycml0b3J5IH0gZnJvbSAnLi4vdGVycml0b3J5L3RlcnJpdG9yeS5tb2RlbCc7XHJcbmltcG9ydCB7IFRhc2sgfSBmcm9tICcuL3Rhc2subW9kZWwnO1xyXG4vKipcclxuICogVGFzayBhdmFpbGFiaWxpdHkgbW9kZWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBUYXNrQXZhaWxhYmlsaXR5IGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiB0ZXJyaXRvcnkqL1xyXG4gIHB1YmxpYyB0ZXJyaXRvcnk6IFRlcnJpdG9yeTtcclxuICAvKiogdGFzayovXHJcbiAgcHVibGljIHRhc2s6IFRhc2s7XHJcbn1cclxuIiwiaW1wb3J0IHsgVGFza0F2YWlsYWJpbGl0eSB9IGZyb20gJy4vdGFzay1hdmFpbGFiaWxpdHkubW9kZWwnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcy9PYnNlcnZhYmxlJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5cclxuLyoqIFRhc2sgYXZhaWxhYmlsaXR5IG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpIFxyXG5leHBvcnQgY2xhc3MgVGFza0F2YWlsYWJpbGl0eVNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxUYXNrQXZhaWxhYmlsaXR5PiB7XHJcbiAgXHJcblxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBUQVNLX0FWQUlMQUJJTElUWV9BUEkgPSAndGFzay1hdmFpbGFiaWxpdGllcyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKFRhc2tBdmFpbGFiaWxpdHksIFwidGFzay1hdmFpbGFiaWxpdGllc1wiLCBpbmplY3Rvcik7XHJcbiAgfVxyXG4gIFxyXG4gIC8qKiByZW1vdmUgdGFzayBhdmFpbGFiaWxpdHkqL1xyXG4gIHJlbW92ZShpdGVtOiBUYXNrQXZhaWxhYmlsaXR5KSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgdGFzayBhdmFpbGFiaWxpdHkqL1xyXG4gIHNhdmUoaXRlbTogVGFza0F2YWlsYWJpbGl0eSk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICBpZiAoaXRlbS5fbGlua3MhPW51bGwpIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgICBpZiAoaXRlbS50YXNrICE9bnVsbCl7XHJcbiAgICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbigndGFzaycsaXRlbS50YXNrKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgXHJcbiAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoaXRlbS50ZXJyaXRvcnkgIT1udWxsKXtcclxuICAgICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCd0ZXJyaXRvcnknLGl0ZW0udGVycml0b3J5KS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgXHJcbiAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaXRlbS50ZXJyaXRvcnkgPSBpdGVtLnRlcnJpdG9yeS5fbGlua3Muc2VsZi5ocmVmO1xyXG4gICAgICBpdGVtLnRhc2sgPSBpdGVtLnRhc2suX2xpbmtzLnNlbGYuaHJlZjtcclxuICBcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5UQVNLX0FWQUlMQUJJTElUWV9BUEkpICwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBcclxufVxyXG4iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuLyoqXHJcbiAqIFRhc2sgVUkgbW9kZWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBUYXNrVUkgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgLyoqIG5hbWUqL1xyXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgXHJcbiAgLyoqIHRvb2x0aXAqLyAgXHJcbiAgcHVibGljIHRvb2x0aXA6IHN0cmluZztcclxuICAgIFxyXG4gIC8qKiBvcmRlciovIFxyXG4gIHB1YmxpYyBvcmRlcjogbnVtYmVyO1xyXG5cclxufVxyXG4iLCJpbXBvcnQgeyBUYXNrVUkgfSBmcm9tICcuL3Rhc2stdWkubW9kZWwnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcy9PYnNlcnZhYmxlJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5cclxuLyoqIFRhc2sgVUkgbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFRhc2tVSVNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxUYXNrVUk+IHtcclxuICBcclxuXHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIENPTk5FQ1RJT05fQVBJID0gJ3Rhc2stdWlzJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoVGFza1VJLCBcInRhc2stdWlzXCIsIGluamVjdG9yKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqIHJlbW92ZSB0YXNrIFVJKi9cclxuICByZW1vdmUoaXRlbTogVGFza1VJKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgdGFzayBVSSovXHJcbiAgc2F2ZShpdGVtOiBUYXNrVUkpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7ICAgICAgXHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuQ09OTkVDVElPTl9BUEkpICwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBcclxufVxyXG4iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuaW1wb3J0IHtDb25uZWN0aW9ufSBmcm9tICcuLi9jb25uZWN0aW9uL2Nvbm5lY3Rpb24ubW9kZWwnO1xyXG5pbXBvcnQge1NlcnZpY2VQYXJhbWV0ZXJ9IGZyb20gJy4vc2VydmljZS1wYXJhbWV0ZXIubW9kZWwnO1xyXG4vKipcclxuICogU2VydmljZSBtb2RlbFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFNlcnZpY2UgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgLyoqIGlkICovXHJcbiAgcHVibGljIGlkOiBudW1iZXI7XHJcbiAgLyoqIG5hbWUqL1xyXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgICBcclxuICAvKiogdHlwZSovXHJcbiAgcHVibGljIHR5cGU6IHN0cmluZztcclxuXHJcbiAgLyoqIHVybCovICBcclxuICBwdWJsaWMgc2VydmljZVVSTDogc3RyaW5nO1xyXG5cclxuICAvKiogcHJvamVjdGlvbnMqLyAgXHJcbiAgcHVibGljIHN1cHBvcnRlZFNSUzogc3RyaW5nO1xyXG4gIFxyXG4gIC8qKiBsZWdlbmQqL1xyXG4gIHB1YmxpYyBsZWdlbmQ6IHN0cmluZztcclxuXHJcbiAgLyoqIGluZm9VcmwqLyAgXHJcbiAgcHVibGljIGluZm9Vcmw6IHN0cmluZztcclxuICBcclxuICAvKiogc3lzdGVtIGNyZWF0ZWQgZGF0ZSovXHJcbiAgcHVibGljIGNyZWF0ZWREYXRlOiBhbnk7XHJcblxyXG4gIC8qKiBjb25uZWN0aW9uKi9cclxuICBwdWJsaWMgY29ubmVjdGlvbjogQ29ubmVjdGlvbjtcclxuICBcclxuICAvKiogcGFyYW1ldGVycyovICBcclxuICBwdWJsaWMgcGFyYW1ldGVyczogU2VydmljZVBhcmFtZXRlcltdO1xyXG59XHJcbiIsImltcG9ydCB7IFNlcnZpY2UgfSBmcm9tICcuL3NlcnZpY2UubW9kZWwnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcy9PYnNlcnZhYmxlJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5cclxuLyoqIFNlcnZpY2UgbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFNlcnZpY2VTZXJ2aWNlIGV4dGVuZHMgUmVzdFNlcnZpY2U8U2VydmljZT4ge1xyXG5cclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgU0VSVklDRV9BUEkgPSAnc2VydmljZXMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihTZXJ2aWNlLCBcInNlcnZpY2VzXCIsIGluamVjdG9yKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqIHJlbW92ZSBzZXJ2aWNlKi9cclxuICByZW1vdmUoaXRlbTogU2VydmljZSkge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIHNlcnZpY2UqL1xyXG4gIHNhdmUoaXRlbTogU2VydmljZSk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICBsZXQgc2VydmljZUNvbm5lY3Rpb24gPSBpdGVtLmNvbm5lY3Rpb247XHJcblxyXG4gICAgaWYgKGl0ZW0uY29ubmVjdGlvbiE9bnVsbCl7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBpdGVtLmNvbm5lY3Rpb24uX2xpbmtzIT0gJ3VuZGVmaW5lZCcpIHsgXHJcbiAgICAgICAgICAgIGl0ZW0uY29ubmVjdGlvbiA9IGl0ZW0uY29ubmVjdGlvbi5fbGlua3Muc2VsZi5ocmVmO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHNlcnZpY2VDb25uZWN0aW9uLl9saW5rcz0ge307XHJcbiAgICAgICAgICAgIHNlcnZpY2VDb25uZWN0aW9uLl9saW5rcy5zZWxmID0ge307XHJcbiAgICAgICAgICAgIHNlcnZpY2VDb25uZWN0aW9uLl9saW5rcy5zZWxmLmhyZWY9XCJcIjtcclxuICAgICAgICB9ICAgICAgICBcclxuICAgICB9XHJcblxyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIC8vdXBkYXRlIHJlbGF0aW9uc1xyXG4gICAgICBkZWxldGUgaXRlbS5jb25uZWN0aW9uOyAgICAgICAgXHJcbiAgICAgIFxyXG4gICAgICBpZiAoc2VydmljZUNvbm5lY3Rpb24uX2xpbmtzLnNlbGYuaHJlZj09Jycpe1xyXG4gICAgICAgICBpdGVtLmRlbGV0ZVJlbGF0aW9uKCdjb25uZWN0aW9uJyxzZXJ2aWNlQ29ubmVjdGlvbikuc3Vic2NyaWJlKHJlc3VsdCA9PiB7ICAgICBcclxuXHJcbiAgICAgICAgICBcclxuICAgICAgICAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgICAgIFxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ2Nvbm5lY3Rpb24nLHNlcnZpY2VDb25uZWN0aW9uKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgICAgXHJcblxyXG4gICAgICBcclxuICAgICAgICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpOyAgICAgICAgICAgXHJcbiAgICAgICB9IFxyXG4gICAgICAgXHJcbiAgICAgICAgIFxyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucHV0KGl0ZW0uX2xpbmtzLnNlbGYuaHJlZiwgaXRlbSk7XHJcblxyXG4gICAgICAgICAgIFxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5TRVJWSUNFX0FQSSkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG5pbXBvcnQge1NlcnZpY2V9IGZyb20gJy4vc2VydmljZS5tb2RlbCc7IFxyXG4vKipcclxuICogU2VydmljZSBwYXJhbWV0ZXIgbW9kZWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBTZXJ2aWNlUGFyYW1ldGVyIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiBuYW1lKi9cclxuICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG4gIFxyXG4gIC8qKiB0eXBlKi9cclxuICBwdWJsaWMgdHlwZTogc3RyaW5nO1xyXG4gICAgXHJcbiAgLyoqIHZhbHVlKi8gIFxyXG4gIHB1YmxpYyB2YWx1ZTogc3RyaW5nO1xyXG4gIFxyXG4gIC8qKiBzZXJ2aWNlKi9cclxuICBwdWJsaWMgc2VydmljZTogU2VydmljZTtcclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgU2VydmljZVBhcmFtZXRlciB9IGZyb20gJy4vc2VydmljZS1wYXJhbWV0ZXIubW9kZWwnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcy9PYnNlcnZhYmxlJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5cclxuLyoqIFNlcnZpY2UgcGFyYW1ldGVyIG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpIFxyXG5leHBvcnQgY2xhc3MgU2VydmljZVBhcmFtZXRlclNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxTZXJ2aWNlUGFyYW1ldGVyPiB7XHJcblxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBTRVJWSUNFX1BBUkFNRVRFUl9BUEkgPSAnc2VydmljZS1wYXJhbWV0ZXJzJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoU2VydmljZVBhcmFtZXRlciwgXCJzZXJ2aWNlLXBhcmFtZXRlcnNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIHNlcnZpY2UgcGFyYW1ldGVyKi9cclxuICByZW1vdmUoaXRlbTogU2VydmljZVBhcmFtZXRlcikge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIHNlcnZpY2UgcGFyYW1ldGVyKi9cclxuICBzYXZlKGl0ZW06IFNlcnZpY2VQYXJhbWV0ZXIpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIFxyXG4gICAgICBcclxuICAgICAgaWYgKGl0ZW0uc2VydmljZSAhPW51bGwpe1xyXG4gICAgICAgICAgbGV0IHNlcnZpY2UgPSAgaXRlbS5zZXJ2aWNlO1xyXG4gICAgICAgICAgZGVsZXRlIGl0ZW0uc2VydmljZTtcclxuICAgICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCdzZXJ2aWNlJyxzZXJ2aWNlKS5zdWJzY3JpYmUocmVzdWx0ID0+IHsgICAgICAgICAgICBcclxuICAgICAgICAgIFxyXG4gICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH1cclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgICBcclxuICAgICAgXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpdGVtLnNlcnZpY2UgPSBpdGVtLnNlcnZpY2UuX2xpbmtzLnNlbGYuaHJlZjtcclxuICBcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5TRVJWSUNFX1BBUkFNRVRFUl9BUEkpICwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBcclxufVxyXG4iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuaW1wb3J0IHtTZXJ2aWNlfSBmcm9tICcuLi9zZXJ2aWNlL3NlcnZpY2UubW9kZWwnO1xyXG5pbXBvcnQge0Nvbm5lY3Rpb259IGZyb20gJy4uL2Nvbm5lY3Rpb24vY29ubmVjdGlvbi5tb2RlbCc7XHJcbmltcG9ydCB7Q2FydG9ncmFwaHlBdmFpbGFiaWxpdHl9IGZyb20gJy4vY2FydG9ncmFwaHktYXZhaWxhYmlsaXR5Lm1vZGVsJztcclxuLyoqXHJcbiAqIENhcnRvZ3JhcGh5XHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgQ2FydG9ncmFwaHkgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgLyoqIGlkICovXHJcbiAgcHVibGljIGlkOiBudW1iZXI7ICBcclxuICAvKiogbmFtZSovXHJcbiAgcHVibGljIG5hbWU6IHN0cmluZztcclxuICBcclxuICAvKiogdHlwZSovXHJcbiAgcHVibGljIHR5cGUgOiBzdHJpbmc7XHJcblxyXG4gIC8qKiB3aGV0aGVyIGxheWVyIGlzIHZpc2libGUqL1xyXG4gIHB1YmxpYyB2aXNpYmxlOiBCb29sZWFuO1xyXG5cclxuICAvKiogdHJhbnNwYXJlbmN5Ki8gXHJcbiAgcHVibGljIHRyYW5zcGFyZW5jeTogTnVtYmVyO1xyXG5cclxuICAvKiogd2hldGhlciBsYXllciBpcyBxdWVyeWFibGUqLyAgXHJcbiAgcHVibGljIHF1ZXJ5YWJsZTogQm9vbGVhbjtcclxuXHJcbiAgLyoqIHdoZXRoZXIgbGF5ZXIgaXMgcXVlcnlhYmxlKi8gXHJcbiAgcHVibGljIHF1ZXJ5QWN0OiBCb29sZWFuO1xyXG5cclxuICAvKiogcXVlcnkgbGF5ZXIqL1xyXG4gIHB1YmxpYyBxdWVyeUxheTogc3RyaW5nO1xyXG5cclxuICAvKiogc3lzdGVtIGNyZWF0ZWQgZGF0ZSovXHJcbiAgcHVibGljIGNyZWF0ZWREYXRlOiBhbnk7XHJcblxyXG4gIC8qKiBvcmRlciovICBcclxuICBwdWJsaWMgb3JkZXI6IE51bWJlcjsgXHJcbiAgXHJcbiAgLyoqIG1pbmltdW0gc2NhbGUqL1xyXG4gIHB1YmxpYyBtaW5pbXVtU2NhbGU6IE51bWJlcjtcclxuXHJcbiAgLyoqIG1heGltdW0gc2NhbGUqL1xyXG4gIHB1YmxpYyBtYXhpbXVtU2NhbGU6IE51bWJlcjtcclxuXHJcbiAgLyoqIGxheWVycyovICBcclxuICBwdWJsaWMgbGF5ZXJzOiBzdHJpbmc7XHJcblxyXG4gIC8qKiBzZXJ2aWNlKi9cclxuICBwdWJsaWMgc2VydmljZSA6IFNlcnZpY2U7XHJcbiAgXHJcbiAgLyoqIGNvbm5lY3Rpb24qL1xyXG4gIHB1YmxpYyBjb25uZWN0aW9uOiBDb25uZWN0aW9uO1xyXG5cclxuICAvKiogYXZhaWxhYmlsaXRpZXMqL1xyXG4gIHB1YmxpYyBhdmFpbGFiaWxpdGllcyA6IENhcnRvZ3JhcGh5QXZhaWxhYmlsaXR5W107XHJcblxyXG4gIC8qKiB3aGV0aGVyIGxheWVyIGlzIHF1ZXJ5YWJsZSovIFxyXG4gIHB1YmxpYyBzZWxlY3RhYmxlOiBCb29sZWFuO1xyXG5cclxuICAvKiogc2VsZWN0aW9uIGxheWVyKi9cclxuICBwdWJsaWMgc2VsZWN0aW9uTGF5ZXI6IHN0cmluZztcclxuXHJcbiAgLyoqIHNlbGVjdGlvbiBzZXJ2aWNlKi8gIFxyXG4gIHB1YmxpYyBzZWxlY3Rpb25TZXJ2aWNlOiBTZXJ2aWNlO1xyXG5cclxuICAvKiogbGVnZW5kIHRpcCovICBcclxuICBwdWJsaWMgbGVnZW5kVGlwOiBzdHJpbmc7XHJcbiAgXHJcbiAgLyoqIGxlZ2VuZCB1cmwqL1xyXG4gIHB1YmxpYyBsZWdlbmRVcmw6IHN0cmluZztcclxuXHJcbiAgLyoqIHdoZXRoZXIgbGF5ZXIgaXMgZWRpdGFibGUqL1xyXG4gIHB1YmxpYyBlZGl0YWJsZTogQm9vbGVhbjtcclxuXHJcbiAgLyoqIG1ldGFkYXRhIFVSTCovXHJcbiAgcHVibGljIG1ldGFkYXRhVXJsOiBzdHJpbmc7XHJcblxyXG4gIC8qKiB3aGV0aGVyIGxheWVyIGlzIHRoZW1hYmxlKi9cclxuICBwdWJsaWMgdGhlbWVhYmxlOiBCb29sZWFuO1xyXG4gIFxyXG4gIC8qKiBnZW9tZXRyeSB0eXBlKi9cclxuICBwdWJsaWMgZ2VvbWV0cnlUeXBlOiBzdHJpbmc7XHJcbiAgXHJcblxyXG59XHJcbiIsImltcG9ydCB7IENhcnRvZ3JhcGh5IH0gZnJvbSAnLi9jYXJ0b2dyYXBoeS5tb2RlbCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzL09ic2VydmFibGUnO1xyXG5pbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcblxyXG4vKiogQ2FydG9ncmFwaHkgbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIENhcnRvZ3JhcGh5U2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPENhcnRvZ3JhcGh5PiB7XHJcblxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBDQVJUT0dSQVBIWV9BUEkgPSAnY2FydG9ncmFwaGllcyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKENhcnRvZ3JhcGh5LCBcImNhcnRvZ3JhcGhpZXNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIGNhcnRvZ3JhcGh5Ki9cclxuICByZW1vdmUoaXRlbTogQ2FydG9ncmFwaHkpIHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKGl0ZW0uX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgIFxyXG4gIH1cclxuICBcclxuICAvKiogc2F2ZSBjYXJ0b2dyYXBoeSovXHJcbiAgc2F2ZShpdGVtOiBDYXJ0b2dyYXBoeSk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICBsZXQgY2FydG9ncmFwaHlDb25uZWN0aW9uID0gaXRlbS5jb25uZWN0aW9uO1xyXG5cclxuICAgIGNvbnN0IGNhcnRvZ3JhcGh5U2VydmljZSA9IGl0ZW0uc2VydmljZTtcclxuICAgIGNvbnN0IGNhcnRvZ3JhcGh5U2VsZWN0aW9uU2VydmljZSA9IGl0ZW0uc2VsZWN0aW9uU2VydmljZTtcclxuICAgIFxyXG4gICAgICBcclxuICAgIGlmIChpdGVtLnNlcnZpY2UhPW51bGwpXHJcbiAgICAgIGl0ZW0uc2VydmljZSA9IGl0ZW0uc2VydmljZS5fbGlua3Muc2VsZi5ocmVmO1xyXG4gICAgaWYgKGl0ZW0uc2VsZWN0aW9uU2VydmljZSE9bnVsbClcclxuICAgICAgaXRlbS5zZWxlY3Rpb25TZXJ2aWNlID0gaXRlbS5zZWxlY3Rpb25TZXJ2aWNlLl9saW5rcy5zZWxmLmhyZWY7ICBcclxuICAgIGlmIChpdGVtLmNvbm5lY3Rpb24hPW51bGwpe1xyXG4gICAgICAgIGlmICh0eXBlb2YgaXRlbS5jb25uZWN0aW9uLl9saW5rcyE9ICd1bmRlZmluZWQnKSB7IFxyXG4gICAgICAgICAgICBpdGVtLmNvbm5lY3Rpb24gPSBpdGVtLmNvbm5lY3Rpb24uX2xpbmtzLnNlbGYuaHJlZjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjYXJ0b2dyYXBoeUNvbm5lY3Rpb24uX2xpbmtzPSB7fTtcclxuICAgICAgICAgICAgY2FydG9ncmFwaHlDb25uZWN0aW9uLl9saW5rcy5zZWxmID0ge307XHJcbiAgICAgICAgICAgIGNhcnRvZ3JhcGh5Q29ubmVjdGlvbi5fbGlua3Muc2VsZi5ocmVmPVwiXCI7XHJcbiAgICAgICAgfSAgICAgICAgXHJcbiAgICAgfVxyXG5cclxuICAgIGlmIChpdGVtLl9saW5rcyE9bnVsbCkge1xyXG4gICAgICAgIFxyXG4gICAgICAvL3VwZGF0ZSByZWxhdGlvbnNcclxuICAgICAgZGVsZXRlIGl0ZW0uY29ubmVjdGlvbjtcclxuICAgICAgZGVsZXRlIGl0ZW0uc2VydmljZTsgICAgICAgICAgICBcclxuICAgICAgZGVsZXRlIGl0ZW0uc2VsZWN0aW9uU2VydmljZTtcclxuICAgICAgXHJcbiAgICAgaWYgKGNhcnRvZ3JhcGh5Q29ubmVjdGlvbi5fbGlua3Muc2VsZi5ocmVmPT0nJyl7XHJcbiAgICAgICAgIGl0ZW0uZGVsZXRlUmVsYXRpb24oJ2Nvbm5lY3Rpb24nLGNhcnRvZ3JhcGh5Q29ubmVjdGlvbikuc3Vic2NyaWJlKHJlc3VsdCA9PiB7ICAgICBcclxuICAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ3NlcnZpY2UnLGNhcnRvZ3JhcGh5U2VydmljZSkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbignc2VsZWN0aW9uU2VydmljZScsY2FydG9ncmFwaHlTZWxlY3Rpb25TZXJ2aWNlKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgXHJcbiAgICAgICAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTsgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgICAgICBcclxuICAgICAgICAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgICAgIFxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ2Nvbm5lY3Rpb24nLGNhcnRvZ3JhcGh5Q29ubmVjdGlvbikuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbignc2VydmljZScsY2FydG9ncmFwaHlTZXJ2aWNlKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbignc2VsZWN0aW9uU2VydmljZScsY2FydG9ncmFwaHlTZWxlY3Rpb25TZXJ2aWNlKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgXHJcbiAgICAgICAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTsgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgICAgIFxyXG5cclxuICAgICAgXHJcbiAgICAgICAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTsgICAgICAgICAgIFxyXG4gICAgICAgfSBcclxuICAgICAgICAgXHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuXHJcbiAgICAgICAgICAgXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLkNBUlRPR1JBUEhZX0FQSSkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG5pbXBvcnQge0NhcnRvZ3JhcGh5fSBmcm9tICcuL2NhcnRvZ3JhcGh5Lm1vZGVsJztcclxuaW1wb3J0IHtSb2xlfSBmcm9tICcuLi9yb2xlL3JvbGUubW9kZWwnO1xyXG4vKipcclxuICogQ2FydG9ncmFwaHkgZ3JvdXBcclxuICovXHJcbmV4cG9ydCBjbGFzcyBDYXJ0b2dyYXBoeUdyb3VwIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiBpZCAqL1xyXG4gIHB1YmxpYyBpZDogbnVtYmVyOyAgXHJcbiAgLyoqIG5hbWUqL1xyXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgLyoqIHR5cGUqL1xyXG4gIHB1YmxpYyB0eXBlOiBzdHJpbmc7XHJcbiAgLyoqIG1lbWJlcnMqL1xyXG4gIHB1YmxpYyBtZW1iZXJzOiBDYXJ0b2dyYXBoeVtdO1xyXG4gIC8qKiByb2xlcyovXHJcbiAgcHVibGljIHJvbGVzOiBSb2xlW107XHJcblxyXG59XHJcbiIsImltcG9ydCB7IENhcnRvZ3JhcGh5R3JvdXAgfSBmcm9tICcuL2NhcnRvZ3JhcGh5LWdyb3VwLm1vZGVsJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMvT2JzZXJ2YWJsZSc7XHJcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuXHJcbi8qKiBDYXJ0b2dyYXBoeUdyb3VwIG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBDYXJ0b2dyYXBoeUdyb3VwU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPENhcnRvZ3JhcGh5R3JvdXA+IHtcclxuICBcclxuXHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIENBUlRPR1JBUEhZX0dST1VQX0FQSSA9J2NhcnRvZ3JhcGh5LWdyb3Vwcyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKENhcnRvZ3JhcGh5R3JvdXAsIFwiY2FydG9ncmFwaHktZ3JvdXBzXCIsIGluamVjdG9yKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqIHJlbW92ZSBjYXJ0b2dyYXBoeSBncm91cCovXHJcbiAgcmVtb3ZlKGl0ZW06IENhcnRvZ3JhcGh5R3JvdXApIHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKGl0ZW0uX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgIFxyXG4gIH1cclxuICBcclxuICAvKiogc2F2ZSBjYXJ0b2dyYXBoeSBncm91cCovXHJcbiAgc2F2ZShpdGVtOiBDYXJ0b2dyYXBoeUdyb3VwKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgIGlmIChpdGVtLl9saW5rcyE9bnVsbCkge1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucHV0KGl0ZW0uX2xpbmtzLnNlbGYuaHJlZiwgaXRlbSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLkNBUlRPR1JBUEhZX0dST1VQX0FQSSkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG5pbXBvcnQgeyBUZXJyaXRvcnkgfSBmcm9tICcuLi90ZXJyaXRvcnkvdGVycml0b3J5Lm1vZGVsJztcclxuaW1wb3J0IHsgQ2FydG9ncmFwaHkgfSBmcm9tICcuL2NhcnRvZ3JhcGh5Lm1vZGVsJztcclxuLyoqXHJcbiAqIENhcnRvZ3JhcGh5IGF2YWlsYWJpbGl0eSBtb2RlbFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIENhcnRvZ3JhcGh5QXZhaWxhYmlsaXR5IGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiB0ZXJyaXRvcnkqL1xyXG4gIHB1YmxpYyB0ZXJyaXRvcnk6IFRlcnJpdG9yeTtcclxuICBcclxuICAvKiogc3lzdGVtIGNyZWF0ZWQgZGF0ZSovXHJcbiAgcHVibGljIGNyZWF0ZWREYXRlOiBhbnk7XHJcbiAgXHJcbiAgLyoqIGNhcnRvZ3JhcGh5Ki9cclxuICBwdWJsaWMgY2FydG9ncmFwaHk6IENhcnRvZ3JhcGh5O1xyXG59XHJcbiIsImltcG9ydCB7IENhcnRvZ3JhcGh5QXZhaWxhYmlsaXR5IH0gZnJvbSAnLi9jYXJ0b2dyYXBoeS1hdmFpbGFiaWxpdHkubW9kZWwnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcy9PYnNlcnZhYmxlJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5cclxuLyoqIENhcnRvZ3JhcGh5QXZhaWxhYmlsaXR5IG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpIFxyXG5leHBvcnQgY2xhc3MgQ2FydG9ncmFwaHlBdmFpbGFiaWxpdHlTZXJ2aWNlIGV4dGVuZHMgUmVzdFNlcnZpY2U8Q2FydG9ncmFwaHlBdmFpbGFiaWxpdHk+IHtcclxuICBcclxuXHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIENBUlRPR1JBUEhZX0FWQUlMQUJJTElUWV9BUEkgPSAnY2FydG9ncmFwaHktYXZhaWxhYmlsaXRpZXMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihDYXJ0b2dyYXBoeUF2YWlsYWJpbGl0eSwgXCJjYXJ0b2dyYXBoeS1hdmFpbGFiaWxpdGllc1wiLCBpbmplY3Rvcik7XHJcbiAgfVxyXG4gIFxyXG4gIC8qKiByZW1vdmUgY2FydG9ncmFwaHkgYXZhaWxhYmlsaXR5Ki9cclxuICByZW1vdmUoaXRlbTogQ2FydG9ncmFwaHlBdmFpbGFiaWxpdHkpIHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKGl0ZW0uX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgIFxyXG4gIH1cclxuICBcclxuICAvKiogc2F2ZSBjYXJ0b2dyYXBoeSBhdmFpbGFiaWxpdHkqL1xyXG4gIHNhdmUoaXRlbTogQ2FydG9ncmFwaHlBdmFpbGFiaWxpdHkpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuICAgICAgaWYgKGl0ZW0uY2FydG9ncmFwaHkgIT1udWxsKXtcclxuICAgICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCdjYXJ0b2dyYXBoeScsaXRlbS5jYXJ0b2dyYXBoeSkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgIFxyXG4gICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGl0ZW0udGVycml0b3J5ICE9bnVsbCl7XHJcbiAgICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbigndGVycml0b3J5JyxpdGVtLnRlcnJpdG9yeSkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgIFxyXG4gICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGl0ZW0udGVycml0b3J5ID0gaXRlbS50ZXJyaXRvcnkuX2xpbmtzLnNlbGYuaHJlZjtcclxuICAgICAgaXRlbS5jYXJ0b2dyYXBoeSA9IGl0ZW0uY2FydG9ncmFwaHkuX2xpbmtzLnNlbGYuaHJlZjtcclxuICBcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5DQVJUT0dSQVBIWV9BVkFJTEFCSUxJVFlfQVBJKSAsIGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgXHJcbn1cclxuIiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcbmltcG9ydCB7Q2FydG9ncmFwaHlHcm91cH0gZnJvbSAnLi9jYXJ0b2dyYXBoeS1ncm91cC5tb2RlbCc7XHJcbi8qKlxyXG4gKiBCYWNrZ3JvdW5kIG1vZGVsXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgQmFja2dyb3VuZCBleHRlbmRzIFJlc291cmNlIHtcclxuICAvKiogaWQgKi9cclxuICBwdWJsaWMgaWQ6IG51bWJlcjsgIFxyXG4gIFxyXG4gIC8qKiBuYW1lKi9cclxuICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG5cclxuICAvKiogZGVzY3JpcHRpb24qL1xyXG4gIHB1YmxpYyBkZXNjcmlwdGlvbjogc3RyaW5nO1xyXG4gIFxyXG4gIC8qKiB3aGV0aGVyIGJhY2tncm91bmQgaXMgYWN0aXZlKi9cclxuICBwdWJsaWMgYWN0aXZlOiBCb29sZWFuO1xyXG4gIFxyXG4gIC8qKiBzeXN0ZW0gY3JlYXRlZCBkYXRlKi9cclxuICBwdWJsaWMgY3JlYXRlZERhdGU6IGFueTtcclxuXHJcbiAgLyoqIGNhcnRvZ3JhcGh5IGdyb3VwKi9cclxuICBwdWJsaWMgY2FydG9ncmFwaHlHcm91cDogQ2FydG9ncmFwaHlHcm91cDtcclxufVxyXG4iLCJpbXBvcnQgeyBCYWNrZ3JvdW5kIH0gZnJvbSAnLi9iYWNrZ3JvdW5kLm1vZGVsJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMvT2JzZXJ2YWJsZSc7XHJcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuXHJcbi8qKiBCYWNrZ3JvdW5kIG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBCYWNrZ3JvdW5kU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPEJhY2tncm91bmQ+IHtcclxuXHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIEJBQ0tHUk9VTkRfQVBJID0gJ2JhY2tncm91bmRzJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoQmFja2dyb3VuZCwgXCJiYWNrZ3JvdW5kc1wiLCBpbmplY3Rvcik7XHJcbiAgfVxyXG4gIFxyXG4gIC8qKiByZW1vdmUgYmFja2dyb3VuZCovXHJcbiAgcmVtb3ZlKGl0ZW06IEJhY2tncm91bmQpIHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKGl0ZW0uX2xpbmtzLnNlbGYuaHJlZik7ICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIGJhY2tncm91bmQqL1xyXG4gIHNhdmUoaXRlbTogQmFja2dyb3VuZCk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICBsZXQgYmFja2dyb3VuZENhcnRvZ3JhcGh5R3JvdXAgPSBpdGVtLmNhcnRvZ3JhcGh5R3JvdXA7XHJcblxyXG4gICAgaWYgKGl0ZW0uY2FydG9ncmFwaHlHcm91cCE9bnVsbCl7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBpdGVtLmNhcnRvZ3JhcGh5R3JvdXAuX2xpbmtzIT0gJ3VuZGVmaW5lZCcpIHsgXHJcbiAgICAgICAgICAgIGl0ZW0uY2FydG9ncmFwaHlHcm91cCA9IGl0ZW0uY2FydG9ncmFwaHlHcm91cC5fbGlua3Muc2VsZi5ocmVmO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmRDYXJ0b2dyYXBoeUdyb3VwLl9saW5rcz0ge307XHJcbiAgICAgICAgICAgIGJhY2tncm91bmRDYXJ0b2dyYXBoeUdyb3VwLl9saW5rcy5zZWxmID0ge307XHJcbiAgICAgICAgICAgIGJhY2tncm91bmRDYXJ0b2dyYXBoeUdyb3VwLl9saW5rcy5zZWxmLmhyZWY9XCJcIjtcclxuICAgICAgICB9ICAgICAgICBcclxuICAgICB9XHJcblxyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIC8vdXBkYXRlIHJlbGF0aW9uc1xyXG4gICAgICBkZWxldGUgaXRlbS5jYXJ0b2dyYXBoeUdyb3VwOyAgICAgICAgXHJcbiAgICAgIFxyXG4gICAgICBpZiAoYmFja2dyb3VuZENhcnRvZ3JhcGh5R3JvdXAuX2xpbmtzLnNlbGYuaHJlZj09Jycpe1xyXG4gICAgICAgICBpdGVtLmRlbGV0ZVJlbGF0aW9uKCdjYXJ0b2dyYXBoeUdyb3VwJyxiYWNrZ3JvdW5kQ2FydG9ncmFwaHlHcm91cCkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7ICAgICBcclxuXHJcbiAgICAgICAgICBcclxuICAgICAgICAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgICAgIFxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ2NhcnRvZ3JhcGh5R3JvdXAnLGJhY2tncm91bmRDYXJ0b2dyYXBoeUdyb3VwKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgICAgXHJcblxyXG4gICAgICBcclxuICAgICAgICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpOyAgICAgICAgICAgXHJcbiAgICAgICB9IFxyXG4gICAgICAgXHJcbiAgICAgICAgIFxyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucHV0KGl0ZW0uX2xpbmtzLnNlbGYuaHJlZiwgaXRlbSk7XHJcblxyXG4gICAgICAgICAgIFxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5CQUNLR1JPVU5EX0FQSSkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG5pbXBvcnQge1RyZWVOb2RlfSBmcm9tICcuL3RyZWUtbm9kZS5tb2RlbCc7XHJcbmltcG9ydCB7Um9sZX0gZnJvbSAnLi4vcm9sZS9yb2xlLm1vZGVsJzsgICAgXHJcbi8qKlxyXG4gKiBUcmVlIG1vZGVsXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgVHJlZSBleHRlbmRzIFJlc291cmNlIHtcclxuICAvKiogaWQgKi9cclxuICBwdWJsaWMgaWQ6IG51bWJlcjtcclxuICAvKiogbmFtZSAqL1xyXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgLyoqIG5vZGVzICovXHJcbiAgcHVibGljIG5vZGVzOiBUcmVlTm9kZVtdO1xyXG4gIC8qKiBhdmFpbGFibGUgcm9sZXMgKi9cclxuICBwdWJsaWMgYXZhaWxhYmxlUm9sZXMgOiBSb2xlW107XHJcblxyXG59XHJcbiIsImltcG9ydCB7IFRyZWUgfSBmcm9tICcuL3RyZWUubW9kZWwnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcy9PYnNlcnZhYmxlJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5cclxuLyoqIFRyZWUgbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFRyZWVTZXJ2aWNlIGV4dGVuZHMgUmVzdFNlcnZpY2U8VHJlZT4ge1xyXG4gIFxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBUUkVFX0FQSSA9ICd0cmVlcyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKFRyZWUsIFwidHJlZXNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIHRyZWUqL1xyXG4gIHJlbW92ZShpdGVtOiBUcmVlKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgdHJlZSovXHJcbiAgc2F2ZShpdGVtOiBUcmVlKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgIGlmIChpdGVtLl9saW5rcyE9bnVsbCkge1xyXG4gICAgICBcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5UUkVFX0FQSSkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG5pbXBvcnQge0NhcnRvZ3JhcGh5fSBmcm9tICcuLi9jYXJ0b2dyYXBoeS9jYXJ0b2dyYXBoeS5tb2RlbCc7XHJcbmltcG9ydCB7VHJlZX0gZnJvbSAnLi90cmVlLm1vZGVsJztcclxuLyoqXHJcbiAqIFRyZWUgbm9kZSBtb2RlbFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFRyZWVOb2RlIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiBuYW1lICovXHJcbiAgcHVibGljIG5hbWU6IHN0cmluZztcclxuICAvKiogdG9vbHRpcCovXHJcbiAgcHVibGljIHRvb2x0aXA6IHN0cmluZztcclxuICAvKiogb3JkZXIqL1xyXG4gIHB1YmxpYyBvcmRlbiA6IG51bWJlcjtcclxuICAvKiogd2hldGhlciB0cmVlIG5vZGUgaXMgYWN0aXZlKi9cclxuICBwdWJsaWMgYWN0aXZlOiBib29sZWFuO1xyXG4gIC8qKiBwYXJlbnQgdHJlZSBub2RlICovXHJcbiAgcHVibGljIHBhcmVudDogVHJlZU5vZGU7XHJcbiAgLyoqIGRpc3BsYXllZCBjYXJ0b2dyYXBoeSAqLyAgXHJcbiAgcHVibGljIGNhcnRvZ3JhcGh5OiBDYXJ0b2dyYXBoeTtcclxuICAvKiogdHJlZSAqLyAgXHJcbiAgcHVibGljIHRyZWU6IFRyZWU7XHJcblxyXG59XHJcbiIsImltcG9ydCB7IFRyZWVOb2RlIH0gZnJvbSAnLi90cmVlLW5vZGUubW9kZWwnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcy9PYnNlcnZhYmxlJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5cclxuLyoqIFRyZWUgbm9kZSBtYW5hZ2VyIHNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKSBcclxuZXhwb3J0IGNsYXNzIFRyZWVOb2RlU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPFRyZWVOb2RlPiB7XHJcbiAgXHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIFRSRUVfTk9ERV9BUEkgPSAndHJlZS1ub2Rlcyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKFRyZWVOb2RlLCBcInRyZWUtbm9kZXNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIHRyZWUgbm9kZSovXHJcbiAgcmVtb3ZlKGl0ZW06IFRyZWVOb2RlKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgdHJlZSBub2RlKi9cclxuICBzYXZlKGl0ZW06IFRyZWVOb2RlKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgIGlmIChpdGVtLl9saW5rcyE9bnVsbCkge1xyXG4gICAgICBjb25zdCBpdGVtVHJlZSA9IGl0ZW0udHJlZTtcclxuICAgICAgY29uc3QgaXRlbUNhcnRvZ3JhcGh5ID0gaXRlbS5jYXJ0b2dyYXBoeTtcclxuICAgICAgY29uc3QgaXRlbVBhcmVudCA9IGl0ZW0ucGFyZW50O1xyXG4gICAgICAgIFxyXG4gICAgICBkZWxldGUgaXRlbS50cmVlO1xyXG4gICAgICBkZWxldGUgaXRlbS5jYXJ0b2dyYXBoeTtcclxuICAgICAgZGVsZXRlIGl0ZW0ucGFyZW50O1xyXG4gICAgICAgIFxyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucHV0KGl0ZW0uX2xpbmtzLnNlbGYuaHJlZiwgaXRlbSk7XHJcbiAgICAgIGlmIChpdGVtVHJlZSAhPW51bGwpe1xyXG4gICAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ3RyZWUnLGl0ZW1UcmVlKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgXHJcbiAgICAgICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGl0ZW1DYXJ0b2dyYXBoeSAhPW51bGwpe1xyXG4gICAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ2NhcnRvZ3JhcGh5JyxpdGVtQ2FydG9ncmFwaHkpLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICBcclxuICAgICAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoaXRlbVBhcmVudCAhPW51bGwpe1xyXG4gICAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ3BhcmVudCcsaXRlbVBhcmVudCkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgIFxyXG4gICAgICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaWYgKGl0ZW0udHJlZSAmJiBpdGVtLnRyZWUuX2xpbmtzICYmIGl0ZW0udHJlZS5fbGlua3Muc2VsZikge1xyXG4gICAgICAgIGl0ZW0udHJlZSA9IGl0ZW0udHJlZS5fbGlua3Muc2VsZi5ocmVmO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChpdGVtLmNhcnRvZ3JhcGh5ICYmIGl0ZW0uY2FydG9ncmFwaHkuX2xpbmtzICYmIGl0ZW0uY2FydG9ncmFwaHkuX2xpbmtzLnNlbGYpIHtcclxuICAgICAgICBpdGVtLmNhcnRvZ3JhcGh5ID0gaXRlbS5jYXJ0b2dyYXBoeS5fbGlua3Muc2VsZi5ocmVmO1xyXG4gICAgICB9ICAgICAgXHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuVFJFRV9OT0RFX0FQSSkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG5pbXBvcnQge1RyZWV9IGZyb20gJy4uL3RyZWUvdHJlZS5tb2RlbCc7XHJcbmltcG9ydCB7Um9sZX0gZnJvbSAnLi4vcm9sZS9yb2xlLm1vZGVsJztcclxuaW1wb3J0IHtDYXJ0b2dyYXBoeUdyb3VwfSBmcm9tICcuLi9jYXJ0b2dyYXBoeS9jYXJ0b2dyYXBoeS1ncm91cC5tb2RlbCc7XHJcbmltcG9ydCB7QXBwbGljYXRpb25QYXJhbWV0ZXJ9IGZyb20gJy4vYXBwbGljYXRpb24tcGFyYW1ldGVyLm1vZGVsJztcclxuaW1wb3J0IHtBcHBsaWNhdGlvbkJhY2tncm91bmR9IGZyb20gJy4vYXBwbGljYXRpb24tYmFja2dyb3VuZC5tb2RlbCc7XHJcblxyXG4vL0ZJWE1FIGVuc3VyZSBhcHBsaWNhdGlvbiBjcmVhdGlvbiBpbiBhZG1pbiBhcHAgdXBvbiBpbml0aWFsaXphdGlvbiAoYXMgaXQgaXMgZG9uZSB3aXRoIFJvbGVzIGFuZCBkZWZhdWx0IFVzZXJzKVxyXG4vKiogVGVycml0b3JpYWwgYXBwbGljdGlvbiBuYW1lICovXHJcbmV4cG9ydCBjb25zdCBURVJSSVRPUklBTF9BUFBfTkFNRTpzdHJpbmcgID0gXCJBcGxpY2FjacODwrNuIFRlcnJpdG9yaWFsXCI7XHJcblxyXG4vKipcclxuICogQXBwbGljYXRpb24gbW9kZWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBBcHBsaWNhdGlvbiBleHRlbmRzIFJlc291cmNlIHtcclxuICAvKiogaWQgKi9cclxuICBwdWJsaWMgaWQ6IG51bWJlcjsgIFxyXG4gIFxyXG4gIC8qKiBuYW1lKi9cclxuICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG5cclxuICAvKiogdHlwZSovXHJcbiAgcHVibGljIHR5cGU6IHN0cmluZztcclxuICBcclxuICAvKiogdGl0bGUqL1xyXG4gIHB1YmxpYyB0aXRsZTogc3RyaW5nO1xyXG4gIFxyXG4gIC8qKiB0aGVtZSovXHJcbiAgcHVibGljIHRoZW1lOiBzdHJpbmc7XHJcbiAgXHJcbiAgLyoqIHN5c3RlbSBjcmVhdGVkIGRhdGUqL1xyXG4gIHB1YmxpYyBjcmVhdGVkRGF0ZTogYW55O1xyXG4gIFxyXG4gIC8qKiBhdmFpbGFibGUgcm9sZXMqL1xyXG4gIHB1YmxpYyBhdmFpbGFibGVSb2xlcyA6IFJvbGVbXTtcclxuICBcclxuICAvKiogdHJlZXMqL1xyXG4gIHB1YmxpYyB0cmVlcyA6IFRyZWVbXTtcclxuICBcclxuICAvKiogc2NhbGVzIChjb21tYS1zZXBhcmF0ZWQgdmFsdWVzKSovXHJcbiAgcHVibGljIHNjYWxlczogc3RyaW5nW107XHJcbiAgXHJcbiAgLyoqIHByb2plY3Rpb25zKGNvbW1hLXNlcGFyYXRlZCBFUFNHIGNvZGVzKSovXHJcbiAgcHVibGljIHNyczogc3RyaW5nO1xyXG4gIFxyXG4gIC8qKiB3aGV0aGVyIGFwcGxpY2F0aW9uIHRyZWUgd2lsbCBhdXRvIHJlZnJlc2gqLyAgXHJcbiAgcHVibGljIHRyZWVBdXRvUmVmcmVzaDogQm9vbGVhbjtcclxuXHJcbiAgLyoqIGJhY2tncm91bmRzKi9cclxuICBwdWJsaWMgYmFja2dyb3VuZHM6IEFwcGxpY2F0aW9uQmFja2dyb3VuZFtdO1xyXG5cclxuICAvKiogc2l0dWF0aW9uIG1hcCovXHJcbiAgcHVibGljIHNpdHVhdGlvbk1hcDogQ2FydG9ncmFwaHlHcm91cDsgICAgXHJcbiAgXHJcbiAgLyoqIHBhcmFtZXRlcnMqL1xyXG4gIHB1YmxpYyBwYXJhbWV0ZXJzOiBBcHBsaWNhdGlvblBhcmFtZXRlcltdO1xyXG59XHJcbiIsImltcG9ydCB7IEFwcGxpY2F0aW9uIH0gZnJvbSAnLi9hcHBsaWNhdGlvbi5tb2RlbCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzL09ic2VydmFibGUnO1xyXG5pbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcblxyXG4vKiogQXBwbGljYXRpb24gbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIEFwcGxpY2F0aW9uU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPEFwcGxpY2F0aW9uPiB7XHJcbiAgXHJcblxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBBUFBMSUNBVElPTl9BUEkgPSAnYXBwbGljYXRpb25zJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoQXBwbGljYXRpb24sIFwiYXBwbGljYXRpb25zXCIsIGluamVjdG9yKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqIHJlbW92ZSBhcHBsaWNhdGlvbiovXHJcbiAgcmVtb3ZlKGl0ZW06IEFwcGxpY2F0aW9uKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgYXBwbGljYXRpb24qL1xyXG4gIHNhdmUoaXRlbTogQXBwbGljYXRpb24pOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgbGV0IGFwcGxpY2F0aW9uU2l0dWF0aW9uTWFwID0gaXRlbS5zaXR1YXRpb25NYXA7XHJcblxyXG4gICAgaWYgKGl0ZW0uc2l0dWF0aW9uTWFwIT1udWxsKXtcclxuICAgICAgICBpZiAodHlwZW9mIGl0ZW0uc2l0dWF0aW9uTWFwLl9saW5rcyE9ICd1bmRlZmluZWQnKSB7IFxyXG4gICAgICAgICAgICBpdGVtLnNpdHVhdGlvbk1hcCA9IGl0ZW0uc2l0dWF0aW9uTWFwLl9saW5rcy5zZWxmLmhyZWY7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgYXBwbGljYXRpb25TaXR1YXRpb25NYXAuX2xpbmtzPSB7fTtcclxuICAgICAgICAgICAgYXBwbGljYXRpb25TaXR1YXRpb25NYXAuX2xpbmtzLnNlbGYgPSB7fTtcclxuICAgICAgICAgICAgYXBwbGljYXRpb25TaXR1YXRpb25NYXAuX2xpbmtzLnNlbGYuaHJlZj1cIlwiO1xyXG4gICAgICAgIH0gICAgICAgIFxyXG4gICAgIH1cclxuXHJcbiAgICBpZiAoaXRlbS5fbGlua3MhPW51bGwpIHtcclxuICAgICAgLy91cGRhdGUgcmVsYXRpb25zXHJcbiAgICAgIGRlbGV0ZSBpdGVtLnNpdHVhdGlvbk1hcDsgICAgICAgIFxyXG4gICAgICBcclxuICAgICAgaWYgKGFwcGxpY2F0aW9uU2l0dWF0aW9uTWFwLl9saW5rcy5zZWxmLmhyZWY9PScnKXtcclxuICAgICAgICAgaXRlbS5kZWxldGVSZWxhdGlvbignc2l0dWF0aW9uTWFwJyxhcHBsaWNhdGlvblNpdHVhdGlvbk1hcCkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7ICAgICBcclxuICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG4gICAgICAgICAgXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbignc2l0dWF0aW9uTWFwJyxhcHBsaWNhdGlvblNpdHVhdGlvbk1hcCkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgICAgIFxyXG4gICAgICBcclxuICAgICAgICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpOyAgICAgICAgICAgXHJcbiAgICAgICB9IFxyXG4gICAgICAgXHJcbiAgICAgICAgIFxyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucHV0KGl0ZW0uX2xpbmtzLnNlbGYuaHJlZiwgaXRlbSk7XHJcblxyXG4gICAgICAgICAgIFxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5BUFBMSUNBVElPTl9BUEkpICwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICAgIFxyXG4gICAgXHJcbiAgXHJcbn1cclxuIiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcbmltcG9ydCB7QmFja2dyb3VuZH0gZnJvbSAnLi4vY2FydG9ncmFwaHkvYmFja2dyb3VuZC5tb2RlbCc7XHJcbmltcG9ydCB7QXBwbGljYXRpb259IGZyb20gJy4vYXBwbGljYXRpb24ubW9kZWwnOyBcclxuXHJcbi8qKlxyXG4gKiBBcHBsaWNhdGlvbiBiYWNrZ3JvdW5kIG1vZGVsXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgQXBwbGljYXRpb25CYWNrZ3JvdW5kIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiBvcmRlciovXHJcbiAgcHVibGljIG9yZGVyOiBOdW1iZXI7XHJcbiAgXHJcbiAgLyoqIGJhY2tncm91bmQqL1xyXG4gIHB1YmxpYyBiYWNrZ3JvdW5kOiBCYWNrZ3JvdW5kO1xyXG4gIFxyXG4gIC8qKiBhcHBsaWNhdGlvbiovXHJcbiAgcHVibGljIGFwcGxpY2F0aW9uOiBBcHBsaWNhdGlvbjtcclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgQXBwbGljYXRpb25CYWNrZ3JvdW5kIH0gZnJvbSAnLi9hcHBsaWNhdGlvbi1iYWNrZ3JvdW5kLm1vZGVsJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMvT2JzZXJ2YWJsZSc7XHJcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuXHJcbi8qKiBBcHBsaWNhdGlvbiBiYWNrZ3JvdW5kIG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpIFxyXG5leHBvcnQgY2xhc3MgQXBwbGljYXRpb25CYWNrZ3JvdW5kU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPEFwcGxpY2F0aW9uQmFja2dyb3VuZD4ge1xyXG4gIFxyXG5cclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgQVBQTElDQVRJT05fQkFDS0dST1VORF9BUEkgPSdhcHBsaWNhdGlvbi1iYWNrZ3JvdW5kcyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKEFwcGxpY2F0aW9uQmFja2dyb3VuZCwgXCJhcHBsaWNhdGlvbi1iYWNrZ3JvdW5kc1wiLCBpbmplY3Rvcik7XHJcbiAgfVxyXG4gIFxyXG4gIC8qKiByZW1vdmUgYXBwbGljYXRpb24gYmFja2dyb3VuZCovXHJcbiAgcmVtb3ZlKGl0ZW06IEFwcGxpY2F0aW9uQmFja2dyb3VuZCkge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIGFwcGxpY2F0aW9uIGJhY2tncm91bmQqL1xyXG4gIHNhdmUoaXRlbTogQXBwbGljYXRpb25CYWNrZ3JvdW5kKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgIGlmIChpdGVtLl9saW5rcyE9bnVsbCkge1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucHV0KGl0ZW0uX2xpbmtzLnNlbGYuaHJlZiwgaXRlbSk7XHJcbiAgICAgIGlmIChpdGVtLmFwcGxpY2F0aW9uICE9bnVsbCl7XHJcbiAgICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbignYXBwbGljYXRpb24nLGl0ZW0uYXBwbGljYXRpb24pLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICBcclxuICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChpdGVtLmJhY2tncm91bmQgIT1udWxsKXtcclxuICAgICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCdiYWNrZ3JvdW5kJyxpdGVtLmJhY2tncm91bmQpLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICBcclxuICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaXRlbS5hcHBsaWNhdGlvbiA9IGl0ZW0uYXBwbGljYXRpb24uX2xpbmtzLnNlbGYuaHJlZjtcclxuICAgICAgaXRlbS5iYWNrZ3JvdW5kID0gaXRlbS5iYWNrZ3JvdW5kLl9saW5rcy5zZWxmLmhyZWY7XHJcbiAgXHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuQVBQTElDQVRJT05fQkFDS0dST1VORF9BUEkpICwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBcclxufVxyXG4iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuaW1wb3J0IHtBcHBsaWNhdGlvbn0gZnJvbSAnLi9hcHBsaWNhdGlvbi5tb2RlbCc7IFxyXG5cclxuLyoqXHJcbiAqIEFwcGxpY2F0aW9uIHBhcmFtZXRlciBtb2RlbCBcclxuICovXHJcbmV4cG9ydCBjbGFzcyBBcHBsaWNhdGlvblBhcmFtZXRlciBleHRlbmRzIFJlc291cmNlIHtcclxuICAvKiogbmFtZSovXHJcbiAgcHVibGljIG5hbWU6IHN0cmluZztcclxuICBcclxuICAvKiogdHlwZSovXHJcbiAgcHVibGljIHR5cGU6IHN0cmluZztcclxuICBcclxuICAvKiogdmFsdWUqLyAgICBcclxuICBwdWJsaWMgdmFsdWU6IHN0cmluZztcclxuICBcclxuICAvKiogYXBwbGljYXRpb24qL1xyXG4gIHB1YmxpYyBhcHBsaWNhdGlvbjogQXBwbGljYXRpb247XHJcblxyXG59XHJcbiIsImltcG9ydCB7IEFwcGxpY2F0aW9uUGFyYW1ldGVyIH0gZnJvbSAnLi9hcHBsaWNhdGlvbi1wYXJhbWV0ZXIubW9kZWwnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcy9PYnNlcnZhYmxlJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5cclxuLyoqIEFwcGxpY2F0aW9uIHBhcmFtZXRlciBtYW5hZ2VyIHNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKSBcclxuZXhwb3J0IGNsYXNzIEFwcGxpY2F0aW9uUGFyYW1ldGVyU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPEFwcGxpY2F0aW9uUGFyYW1ldGVyPiB7XHJcbiAgXHJcblxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBBUFBMSUNBVElPTl9QQVJBTUVURVJfQVBJID0gJ2FwcGxpY2F0aW9uLXBhcmFtZXRlcnMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihBcHBsaWNhdGlvblBhcmFtZXRlciwgXCJhcHBsaWNhdGlvbi1wYXJhbWV0ZXJzXCIsIGluamVjdG9yKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqIHJlbW92ZSBhcHBsaWNhdGlvbiovXHJcbiAgcmVtb3ZlKGl0ZW06IEFwcGxpY2F0aW9uUGFyYW1ldGVyKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgYXBwbGljYXRpb24qL1xyXG4gIHNhdmUoaXRlbTogQXBwbGljYXRpb25QYXJhbWV0ZXIpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuICAgICAgaWYgKGl0ZW0uYXBwbGljYXRpb24gIT1udWxsKXtcclxuICAgICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCdhcHBsaWNhdGlvbicsaXRlbS5hcHBsaWNhdGlvbikuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgIFxyXG4gICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpdGVtLmFwcGxpY2F0aW9uID0gaXRlbS5hcHBsaWNhdGlvbi5fbGlua3Muc2VsZi5ocmVmO1xyXG4gIFxyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLkFQUExJQ0FUSU9OX1BBUkFNRVRFUl9BUEkpICwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBcclxufVxyXG4iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuLyoqXHJcbiAqIENvbm5lY3Rpb24gbW9kZWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBDb2RlTGlzdCBleHRlbmRzIFJlc291cmNlIHtcclxuICAvKiogaWQgKi9cclxuICBwdWJsaWMgaWQ6IG51bWJlcjtcclxuICAvKiogbmFtZSovXHJcbiAgcHVibGljIGNvZGVMaXN0TmFtZTogc3RyaW5nO1xyXG4gIC8qKiB0eXBlKi9cclxuICBwdWJsaWMgdmFsdWU6IHN0cmluZztcclxuICAvKiogdXNlciovXHJcbiAgcHVibGljIGRlc2NyaXB0aW9uOiBzdHJpbmc7XHJcblxyXG5cclxufVxyXG4iLCJpbXBvcnQgeyBDb2RlTGlzdCB9IGZyb20gJy4vY29kZWxpc3QubW9kZWwnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcy9PYnNlcnZhYmxlJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5cclxuLyoqIENvbm5lY3Rpb24gbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIENvZGVMaXN0U2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPENvZGVMaXN0PiB7XHJcbiAgXHJcbiBcclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgQ09ERUxJU1RfQVBJID0gJ2NvZGVsaXN0LXZhbHVlcyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKENvZGVMaXN0LCBcImNvZGVsaXN0LXZhbHVlc1wiLCBpbmplY3Rvcik7XHJcbiAgfVxyXG4gIFxyXG4gIC8qKiByZW1vdmUgY29ubmVjdGlvbiovXHJcbiAgcmVtb3ZlKGl0ZW06IENvZGVMaXN0KSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgY29ubmVjdGlvbiovXHJcbiAgc2F2ZShpdGVtOiBDb2RlTGlzdCk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICBpZiAoaXRlbS5fbGlua3MhPW51bGwpIHtcclxuICAgICAgXHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuQ09ERUxJU1RfQVBJICksIGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgXHJcbn1cclxuIiwiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBCZWhhdmlvclN1YmplY3QsIE9ic2VydmFibGUsIG9mIH0gZnJvbSAncnhqcyc7XHJcblxyXG4vKiogTGF5ZXIgbW9kZWw6IGNvbmZpZ3VyZSBMYXllciBkYXRhIGFuZCBkaXNwbGF5aW5nIGNvbmZpZ3VyYXRpb24gKi8gXHJcbmV4cG9ydCBjbGFzcyBMYXllciB7XHJcbiAgLy8gRGlzcGxheSBkYXRhXHJcbiAgLyoqIGxheWVyIHZpc2liaWxpdHkqLyAgXHJcbiAgdmlzaWJpbGl0eTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIC8qKiBUcmFuc3BhcmVuY3kgKFRyYW5zcGFyZW50KSAwLTEgKE9wYXF1ZSkqL1xyXG4gIG9wYWNpdHk6IG51bWJlciA9IDEuMDtcclxuXHJcbiAgLy8gQ29uZmlndXJhdGlvbiBkYXRhXHJcbiAgLyoqIHRpdGxlKi9cclxuICB0aXRsZTogc3RyaW5nO1xyXG4gIFxyXG4gIC8qKiBJZCB0byBpbmRleCovXHJcbiAgaWQ6IGFueTtcclxuICBcclxuICAvKiogU2VydmljZSBOYW1lKi9cclxuICBzZXJ2ZXJOYW1lOiBzdHJpbmc7XHJcblxyXG4gIC8qKiBTZXJ2aWNlIGF0dHJpYnV0aW9ucyovXHJcbiAgYXR0cmlidXRpb25zOiBzdHJpbmcgPSBcIlwiO1xyXG5cclxuICAvKiogUmVxdWVzdCBmb3JtYXQgKGltYWdlL2pwZywgLi4uKSovXHJcbiAgZm9ybWF0OiBzdHJpbmc7XHJcbiAgXHJcbiAgLyoqIFJlcXVlc3Qgc2VydmljZSB2ZXJzaW9uKi9cclxuICB2ZXJzaW9uOnN0cmluZztcclxuXHJcbiAgLyoqIFNlcnZpY2UgdXJsKi9cclxuICB1cmw6IHN0cmluZztcclxuXHJcbiAgLyoqIElzIGJhc2UgbGF5ZXI/Ki9cclxuICBpc0Jhc2VMYXllcjogYm9vbGVhbjtcclxuXHJcbiAgLyoqIFJlcXVlc3QgbGF5ZXIgbmFtZSovXHJcbiAgbmFtZTogc3RyaW5nO1xyXG5cclxuICAvKiogSXMgdGlsZWQ/Ki9cclxuICB0aWxlZDogYm9vbGVhbjtcclxuICBcclxuICAvKiogRGVzY3JpcHRpb24qL1xyXG4gIGRlc2M6IHN0cmluZyA9IFwiXCI7XHJcbiAgXHJcbiAgLyoqICBUcmFuc3BhcmVudCByZXF1ZXN0IHBhcmFtZXRlcj8qL1xyXG4gIHVybF90cmFuc3BhcmVudDogc3RyaW5nID0gXCJ0cnVlXCI7XHJcbiAgXHJcbiAgLyoqIFJlcXVlc3QgQmFja2dyb3VuZCBwYXJhbWV0ZXIgY29sb3IgKEhleGEpKi9cclxuICB1cmxfYmdjb2xvcjogc3RyaW5nID0gXCIweDAwMDAwMFwiO1xyXG4gIFxyXG4gIC8qKiBSZXF1ZXN0IEV4Y2VwdGlvbiBVUkwqL1xyXG4gIHVybF9leGNlcHRpb246IHN0cmluZztcclxuICBcclxuICAvKiogRXh0ZW50IGZvciB0aWxlZCBzZXJ2aWNlcyovXHJcbiAgZXh0ZW50OiBhbnkgPSBudWxsO1xyXG5cclxuICAvKiogVGlsZSBoZWlnaHQgKGlmIG5vdCBkZWZpbmVkLCB0aGUgZGVmYXVsdCBtYXAgaXMgdGFrZW4pKi9cclxuICB0aWxlSGVpZ2h0PzpudW1iZXI7XHJcbiAgXHJcbiAgLyoqIFRpbGUgd2lkdGggKGlmIG5vdCBkZWZpbmVkLCB0aGUgZGVmYXVsdCBtYXAgaXMgdGFrZW4pKi9cclxuICB0aWxlV2lkdGg/Om51bWJlcjtcclxuICBcclxuICAvKiogRW5hYmxlZCBmb3IgR2V0RmVhdHVyZUluZm8gcmVxdWVzdHMgKGVuYWJsZWQgdG8gdXNlIHRoZSB2aWV3ZXIgZmVhdHVyZXMgaW5mb3JtYXRpb24gdG9vbCkqL1xyXG4gIHF1ZXJ5YWJsZT86Ym9vbGVhbiA9IGZhbHNlO1xyXG4gIFxyXG4gIC8qKiBNaW5pbXVtIHNjYWxlKi9cclxuICBtaW5pbXVtU2NhbGU/Om51bWJlcjtcclxuICBcclxuICAvKiogTWF4aW11bSBzY2FsZSovXHJcbiAgbWF4aW11bVNjYWxlPzpudW1iZXI7XHJcbiAgXHJcbiAgLyoqIExpc3Qgb2YgYXZhaWxhYmxlIENSUyovXHJcbiAgcHJvamVjdGlvbnM/OnN0cmluZztcclxuICBcclxuICAvKiogRmVhdHVyZXMgaW5mb3JtYXRpb24gVVJMKi9cclxuICBpbmZvVXJsPzpzdHJpbmc7XHJcbiAgXHJcbiAgLyoqIE1ldGFkYXRhIGluZm9ybWF0aW9uIFVSTCovXHJcbiAgbWV0YWRhdGFVcmw/OnN0cmluZztcclxuICBcclxuICAvKiogTGVnZW5kIFVSTCovXHJcbiAgbGVnZW5kVXJsPzpzdHJpbmc7XHJcbiAgXHJcbiAgLyoqIEFycmF5IG9mIE9wdGlvbmFsUGFyYW1ldGVyIG9iamVjdCB0aGF0IGRlZmluZXMgb3RoZXIgb3B0aW9uYWwgcGFyYW1ldGVyLXZhbHVlIHBhaXJzIGZvciB0aGUgcmVxdWVzdCAoVElNRSAuLi4pKi9cclxuICBvcHRpb25hbFBhcmFtZXRlcnM/OkFycmF5PE9wdGlvbmFsUGFyYW1ldGVyPjtcclxufVxyXG5cclxuLyoqIE9wdGlvbmFsIHBhcmFtZXRlciBtb2RlbDogY29uZmlndXJlIHBhcmFtZXRlci12YWx1ZSBwYWlyIHRvIGFkZCB0byB0aGUgcmVxdWVzdCBsYXllciBVUkwgKi9cclxuZXhwb3J0IGNsYXNzIE9wdGlvbmFsUGFyYW1ldGVyIHtcclxuICAvKioga2V5Ki9rZXk6c3RyaW5nO1xyXG4gIC8qKiB2YWx1ZSovdmFsdWU6c3RyaW5nO1xyXG59XHJcblxyXG4vKiogTGF5ZXIgY29uZmlndXJhdGlvbiBtb2RlbDogbW9kaWZ5IHRoZSBjb25maWd1cmF0aW9uIG9mIGEgbGF5ZXIgd2hlbiBpbnRlcmFjdGluZyB3aXRoIHRoZSBtYXAgKG1ha2UgdmlzaWJsZSwgbW92ZSB0aGUgbGF5ZXIgLi4uKSAqL1xyXG5leHBvcnQgY2xhc3MgTGF5ZXJDb25maWd1cmF0aW9uIHtcclxuICAvKiogSWRlbnRpZmllciB0byBpbmRleCovaWQ6IGFueTtcclxuICAvKiogTGF5ZXIgdmlzaWJpbGl0eSovdmlzaWJpbGl0eTogYm9vbGVhbjtcclxuICAvKiogTGF5ZXIgdHJhbnNwYXJlbmN5IChUcmFuc3BhcmVudCkgMC0xIChPcGFxdWUpKi9vcGFjaXR5OiBudW1iZXI7XHJcbiAgLyoqIExheWVyIHBvc2l0aW9uKi9wb3NpdGlvbjogbnVtYmVyO1xyXG59XHJcblxyXG4vKiogTGF5ZXIgZ3JvdXAgbW9kZWwqL1xyXG5leHBvcnQgY2xhc3MgTGF5ZXJHcm91cCB7XHJcbiAgLyoqIGluaXRpYWxseSBhY3RpdmF0ZWQgKGFsbCB2aXNpYmxlIGxheWVycykqL2FjdGl2ZT86Ym9vbGVhbjtcclxuICAvKiogZ3JvdXAgbmFtZSovbmFtZT86IFN0cmluZztcclxuICAvKiogZ3JvdXAgaWQqL2lkOiBTdHJpbmc7XHJcbiAgLyoqIGFycmF5IG9mIGNoaWxkIExheWVycyovbGF5ZXJzOiBBcnJheTxMYXllcj47XHJcbn1cclxuXHJcbi8qKiBNYXAgb3B0aW9ucyBjb25maWd1cmF0aW9uIG1vZGVsKi9cclxuZXhwb3J0IGNsYXNzIE1hcE9wdGlvbnNDb25maWd1cmF0aW9uIHtcclxuICAvKiogc2NhbGVzKi9zY2FsZXM/OiBzdHJpbmc7XHJcbiAgLyoqIHByb2plY3Rpb25zKi9wcm9qZWN0aW9ucz86IHN0cmluZztcclxuICAvKiogbWluaW11bSBzY2FsZSovbWluU2NhbGU/Om51bWJlcjtcclxuICAvKiogbWF4aW11bSBzY2FsZSovbWF4U2NhbGU/Om51bWJlcjtcclxuICAvKiogZXh0ZW50Ki9leHRlbnQ/OmFueTtcclxuICAvKiogbWF4aW11bSBleHRlbnQqL21heEV4dGVudD86YW55O1xyXG4gIC8qKiB0aWxlIHdpZHRoKi90aWxlV2lkdGg/Om51bWJlcjtcclxuICAvKiogdGlsZSBoZWlnaHQqL3RpbGVIZWlnaHQ/Om51bWJlcjtcclxuICAvKiogcGFyYW1ldGVycyovcGFyYW1ldGVycz86IEFycmF5PE9wdGlvbmFsUGFyYW1ldGVyPlxyXG59XHJcblxyXG4vKiogTWFwIGNvbXBvbmVudCBzdGF0dXMgbW9kZWwqL1xyXG5leHBvcnQgY2xhc3MgTWFwQ29tcG9uZW50U3RhdHVzIHtcclxuICAgIC8qKiBsb2FkZWQ/Ki9sb2FkZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxufVxyXG5cclxuQEluamVjdGFibGUoe1xyXG4gIHByb3ZpZGVkSW46ICdyb290J1xyXG59KVxyXG5cclxuLyoqIE1hcCBjb25maWd1cmF0aW9uIG1hbmFnZXIgc2VydmljZSovXHJcbmV4cG9ydCBjbGFzcyBNYXBDb25maWd1cmF0aW9uTWFuYWdlclNlcnZpY2Uge1xyXG4gIHByaXZhdGUgbGF5ZXJzU3ViamVjdCA9IG5ldyBCZWhhdmlvclN1YmplY3QoW10pO1xyXG4gIHByaXZhdGUgbGF5ZXJzOiBBcnJheTxMYXllcj4gPSBudWxsO1xyXG5cclxuICBwcml2YXRlIGJhc2VMYXllckdyb3Vwc1N1YmplY3QgPSBuZXcgQmVoYXZpb3JTdWJqZWN0KFtdKTtcclxuICBwcml2YXRlIGJhc2VMYXllckdyb3VwczogQXJyYXk8TGF5ZXJHcm91cD4gPSBudWxsO1xyXG5cclxuICBwcml2YXRlIGxheWVyQ29uZmlndXJhdGlvblN1YmplY3QgPSBuZXcgQmVoYXZpb3JTdWJqZWN0KFtdKTtcclxuXHJcbiAgcHJpdmF0ZSBhZGRMYXllcnNTdWJqZWN0ID0gbmV3IEJlaGF2aW9yU3ViamVjdChbXSk7XHJcbiAgcHJpdmF0ZSByZW1vdmVMYXllcnNTdWJqZWN0ID0gbmV3IEJlaGF2aW9yU3ViamVjdChbXSk7XHJcblxyXG4gIHByaXZhdGUgc2l0dWF0aW9uTWFwQ29uZmlndXJhdGlvblN1YmplY3QgPSBuZXcgQmVoYXZpb3JTdWJqZWN0KFtdKTtcclxuICBwcml2YXRlIG1hcE9wdGlvbnNDb25maWd1cmF0aW9uU3ViamVjdCA9IG5ldyBCZWhhdmlvclN1YmplY3QoW10pO1xyXG5cclxuICBwcml2YXRlIG1hcENvbXBvbmVudFN0YXR1c1N1YmplY3QgPSBuZXcgQmVoYXZpb3JTdWJqZWN0KFtdKTtcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yKi9cclxuICBjb25zdHJ1Y3RvcigpIHsgXHJcbiAgIC8vXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBsYXllciBjb3VudCAqL1xyXG4gIGNvdW50ID0gMDtcclxuXHJcbiAgLyoqIGNvbmZpZ3VyZSB0aGUgb3ZlcmxheSBsYXllcnMgb2YgdGhlIG1hcCwgYnkgcGFzc2luZyBhcyBhIHBhcmFtZXRlciBhbiBhcnJheSBvZiBvYmplY3RzIG9mIHR5cGUgTGF5ZXIgb2JqZWN0cyBkZWZpbmluZyB0aGUgbGF5ZXJzIHRvIGxvYWQuKi9cclxuICBsb2FkTGF5ZXJzQ29uZmlndXJhdGlvbihjb25maWd1cmF0aW9uKSB7XHJcbiAgICBpZiAodGhpcy5sYXllcnMgIT0gbnVsbCkge1xyXG4gICAgICB0aGlzLmNsZWFyTGF5ZXJzKGZhbHNlKTtcclxuICAgIH1cclxuICAgIHRoaXMuc2V0TGF5ZXJzKGNvbmZpZ3VyYXRpb24pO1xyXG4gIH1cclxuICBcclxuICAvKipjb25maWd1cmUgdGhlIGJhc2UgbGF5ZXJzIG9mIHRoZSBtYXAgYnkgcGFzc2luZyBhcyBhIHBhcmFtZXRlciBhbiBhcnJheSBvZiBvYmplY3RzIG9mIHR5cGUgTGF5ZXJHcm91cCBlYWNoIG9mIHRoZW0gd2l0aCB0aGUgY29ycmVzcG9uZGluZyBMYXllciBvYmplY3RzIGRlZmluaW5nIHRoZSBsYXllcnMgdG8gbG9hZC4qL1xyXG4gIGxvYWRCYXNlTGF5ZXJzQ29uZmlndXJhdGlvbihjb25maWd1cmF0aW9uKSB7XHJcbiAgICB0aGlzLnNldEJhc2VMYXllckdyb3Vwcyhjb25maWd1cmF0aW9uKTtcclxuICB9XHJcblxyXG4gIC8qKiBnZXQgYmFzZSBsYXllciBncm91cHMqL1xyXG4gIGdldEJhc2VMYXllckdyb3VwcygpOiBPYnNlcnZhYmxlPExheWVyR3JvdXBbXT4ge1xyXG4gICAgcmV0dXJuIHRoaXMuYmFzZUxheWVyR3JvdXBzU3ViamVjdC5hc09ic2VydmFibGUoKTtcclxuICB9XHJcblxyXG4gIC8qKiBzZXQgYmFzZSBsYXllciBncm91cHMqL1xyXG4gIHNldEJhc2VMYXllckdyb3Vwcyhncm91cHM6QXJyYXk8TGF5ZXJHcm91cD4pIHtcclxuICAgIHRoaXMuYmFzZUxheWVyR3JvdXBzID0gZ3JvdXBzO1xyXG4gICAgdGhpcy5yZWZyZXNoQmFzZUxheWVyR3JvdXBzKCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHJlZnJlc2hCYXNlTGF5ZXJHcm91cHMoKSB7XHJcbiAgICAvLyBTZW5kIHRoZSBuZXcgdmFsdWVzIHNvIHRoYXQgYWxsIHN1YnNjcmliZXJzIGFyZSB1cGRhdGVkXHJcbiAgICB0aGlzLmJhc2VMYXllckdyb3Vwc1N1YmplY3QubmV4dCh0aGlzLmJhc2VMYXllckdyb3Vwcyk7XHJcbiAgfVxyXG5cclxuICAvKiogZ2V0IGxheWVycyovXHJcbiAgZ2V0TGF5ZXJzKCk6IE9ic2VydmFibGU8TGF5ZXJbXT4ge1xyXG4gICAgcmV0dXJuIHRoaXMubGF5ZXJzU3ViamVjdC5hc09ic2VydmFibGUoKTtcclxuICB9XHJcblxyXG4gIC8qKiByZW1vdmUgYWxsIGxheWVycyBmcm9tIG1hcCovXHJcbiAgY2xlYXJMYXllcnMocmVmcmVzaDpib29sZWFuKSB7XHJcbiAgICB3aGlsZSh0aGlzLmxheWVycy5sZW5ndGgpIHtcclxuICAgICAgdGhpcy5sYXllcnMucG9wKCk7XHJcbiAgICB9XHJcbiAgICBpZiAocmVmcmVzaCkge1xyXG4gICAgICB0aGlzLnJlZnJlc2hMYXllcnMoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKiBzZXQgbGF5ZXJzKi9cclxuICBzZXRMYXllcnMobGF5ZXJzOkFycmF5PExheWVyPikge1xyXG4gICAgdGhpcy5sYXllcnMgPSBsYXllcnM7XHJcbiAgICB0aGlzLnJlZnJlc2hMYXllcnMoKTtcclxuICB9XHJcblxyXG4gIC8qKiBhZGQgZ2l2ZW4gbGF5ZXIgdG8gbWFwKi9cclxuICBhZGRMYXllcihsYXllcjpMYXllcikge1xyXG4gICAgdGhpcy5sYXllcnMucHVzaChsYXllcik7XHJcbiAgICB0aGlzLnJlZnJlc2hBZGRMYXllcnMobGF5ZXIpO1xyXG4gIH1cclxuXHJcbiAgLyoqIGFkZCBnaXZlbiBsYXllciB0byBtYXAgYXQgZ2l2ZW4gaW5kZXgqL1xyXG4gIGFkZExheWVyQXQobGF5ZXI6TGF5ZXIsIGluZGV4Om51bWJlcikge1xyXG4gICAgaWYgKGluZGV4ID09IDApIHtcclxuICAgICAgdGhpcy5sYXllcnMgPSBbbGF5ZXJdLmNvbmNhdCh0aGlzLmxheWVycyk7XHJcbiAgICB9IGVsc2UgaWYgKGluZGV4ID49IHRoaXMubGF5ZXJzLmxlbmd0aCkge1xyXG4gICAgICB0aGlzLmxheWVycy5wdXNoKGxheWVyKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMubGF5ZXJzID0gdGhpcy5sYXllcnMuc2xpY2UoMCwgaW5kZXgpXHJcbiAgICAgICAgICAgICAgICAgICAgLmNvbmNhdChbbGF5ZXJdKVxyXG4gICAgICAgICAgICAgICAgICAgIC5jb25jYXQodGhpcy5sYXllcnMuc2xpY2UoaW5kZXgsIHRoaXMubGF5ZXJzLmxlbmd0aCkpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5yZWZyZXNoQWRkTGF5ZXJzKGxheWVyKTtcclxuICAgIHRoaXMucmVmcmVzaExheWVyQ29uZmlndXJhdGlvbihsYXllci5pZCwgbnVsbCwgbnVsbCwgaW5kZXgpO1xyXG4gIH1cclxuXHJcbiAgLyoqIHJlbW92ZSBnaXZlbiBsYXllciBmcm9tIG1hcCovXHJcbiAgcmVtb3ZlTGF5ZXIobGF5ZXI6TGF5ZXIpIHtcclxuICAgIHZhciBpbmRleCA9IHRoaXMubGF5ZXJzLmluZGV4T2YobGF5ZXIpO1xyXG4gICAgdGhpcy5yZW1vdmVMYXllckluZGV4KGluZGV4KTtcclxuICB9XHJcblxyXG4gIC8qKiByZW1vdmUgbGF5ZXIgd2l0aCBnaXZlbiBpZCBmcm9tIG1hcCAqL1xyXG4gIHJlbW92ZUxheWVySWQoaWQpIHtcclxuICAgIHZhciBpbmRleCA9IC0xO1xyXG4gICAgZm9yICh2YXIgaSA9IDAsIGlMZW4gPSB0aGlzLmxheWVycy5sZW5ndGg7IGkgPCBpTGVuOyBpKyspIHtcclxuICAgICAgaWYgKHRoaXMubGF5ZXJzW2ldLmlkID09IGlkKSB7XHJcbiAgICAgICAgaW5kZXggPSBpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICB0aGlzLnJlbW92ZUxheWVySW5kZXgoaW5kZXgpO1xyXG4gIH1cclxuXHJcbiAgLyoqIHJlbW92ZSBsYXllciBhdCBnaXZlbiBpbmRleCBmcm9tIG1hcCAqL1xyXG4gIHJlbW92ZUxheWVySW5kZXgoaW5kZXg6bnVtYmVyKSB7XHJcbiAgICB2YXIgbGF5ZXIgPSB0aGlzLmxheWVyc1tpbmRleF07XHJcbiAgICB0aGlzLmxheWVycy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgdGhpcy5yZWZyZXNoUmVtb3ZlTGF5ZXJzKGxheWVyKTtcclxuICB9XHJcblxyXG4gIC8qKiByZWZyZXNoIGxheWVycyAqL1xyXG4gIHByaXZhdGUgcmVmcmVzaExheWVycygpIHtcclxuICAgIC8vIFNlbmQgdGhlIG5ldyB2YWx1ZXMgc28gdGhhdCBhbGwgc3Vic2NyaWJlcnMgYXJlIHVwZGF0ZWRcclxuICAgIHRoaXMubGF5ZXJzU3ViamVjdC5uZXh0KHRoaXMubGF5ZXJzKTtcclxuICB9XHJcblxyXG4gIC8qKiBPYnNlcnZhYmxlIGZvciBsYXllcnMgYWRkZWQgKi9cclxuICBnZXRMYXllcnNBZGRlZCgpOiBPYnNlcnZhYmxlPExheWVyW10+IHtcclxuICAgIHJldHVybiB0aGlzLmFkZExheWVyc1N1YmplY3QuYXNPYnNlcnZhYmxlKCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHJlZnJlc2hBZGRMYXllcnMobGF5ZXI6TGF5ZXIpIHtcclxuICAgIC8vIFNlbmQgdGhlIG5ldyB2YWx1ZXMgc28gdGhhdCBhbGwgc3Vic2NyaWJlcnMgYXJlIHVwZGF0ZWRcclxuICAgIHRoaXMuYWRkTGF5ZXJzU3ViamVjdC5uZXh0KFtsYXllcl0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0TGF5ZXJzUmVtb3ZlZCgpOiBPYnNlcnZhYmxlPExheWVyW10+IHtcclxuICAgIHJldHVybiB0aGlzLnJlbW92ZUxheWVyc1N1YmplY3QuYXNPYnNlcnZhYmxlKCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHJlZnJlc2hSZW1vdmVMYXllcnMobGF5ZXI6TGF5ZXIpIHtcclxuICAgIC8vIFNlbmQgdGhlIG5ldyB2YWx1ZXMgc28gdGhhdCBhbGwgc3Vic2NyaWJlcnMgYXJlIHVwZGF0ZWRcclxuICAgIHRoaXMucmVtb3ZlTGF5ZXJzU3ViamVjdC5uZXh0KFtsYXllcl0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0TGF5ZXJDb25maWd1cmF0aW9uTGlzdGVuZXIoKTogT2JzZXJ2YWJsZTxMYXllckNvbmZpZ3VyYXRpb25bXT4ge1xyXG4gICAgcmV0dXJuIHRoaXMubGF5ZXJDb25maWd1cmF0aW9uU3ViamVjdC5hc09ic2VydmFibGUoKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZ2V0TGF5ZXJJbmRleEJ5SWQoaWQ6c3RyaW5nKTpudW1iZXJ7XHJcbiAgICB2YXIgaW5kZXggPSAtMTtcclxuICAgIGZvciAodmFyIGkgPSAwLCBpTGVuID0gdGhpcy5sYXllcnMubGVuZ3RoOyBpIDwgaUxlbjsgaSsrKSB7XHJcbiAgICAgIGlmICh0aGlzLmxheWVyc1tpXS5pZCA9PSBpZCkge1xyXG4gICAgICAgIGluZGV4ID0gaTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGluZGV4O1xyXG4gIH1cclxuICBcclxuICAvKiogbW92ZSBsYXllciB3aXRoIGdpdmVuIGlkIHRvIHRoZSBnaXZlbiBpbmRleCovXHJcbiAgbW92ZUxheWVyKGlkLCBpbmRleCkge1xyXG4gICAgdmFyIGxheWVySW5kZXggPSB0aGlzLmdldExheWVySW5kZXhCeUlkKGlkKTtcclxuICAgIGlmIChsYXllckluZGV4ICE9IC0xKSB7XHJcbiAgICAgIHZhciBsYXllciA9IHRoaXMubGF5ZXJzLnNwbGljZShsYXllckluZGV4LCAxKTtcclxuICAgICAgdGhpcy5sYXllcnMgPSBcclxuICAgICAgICB0aGlzLmxheWVycy5zbGljZSgwLCBpbmRleClcclxuICAgICAgICAuY29uY2F0KGxheWVyKVxyXG4gICAgICAgIC5jb25jYXQodGhpcy5sYXllcnMuc2xpY2UoaW5kZXgsIHRoaXMubGF5ZXJzLmxlbmd0aCkpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5yZWZyZXNoTGF5ZXJDb25maWd1cmF0aW9uKGlkLCBudWxsLCBudWxsLCBpbmRleCk7XHJcbiAgfVxyXG5cclxuICAvKiogY2hhbmdlIHZpc2liaWxpdHkgb2YgbGF5ZXIgd2l0aCBnaXZlbiBpZCB0byB0aGUgZ2l2ZW4gdmFsdWUqL1xyXG4gIGNoYW5nZUxheWVyVmlzaWJpbGl0eShpZCwgdmlzaWJpbGl0eSkge1xyXG4gICAgdGhpcy5yZWZyZXNoTGF5ZXJDb25maWd1cmF0aW9uKGlkLCBudWxsLCB2aXNpYmlsaXR5LCBudWxsKTtcclxuICB9XHJcblxyXG4gIC8qKiBjaGFuZ2Ugb3BhY2l0eSBvZiBsYXllciB3aXRoIGdpdmVuIGlkIHRvIHRoZSBnaXZlbiB2YWx1ZSovXHJcbiAgY2hhbmdlTGF5ZXJPcGFjaXR5KGlkLCBvcGFjaXR5KSB7XHJcbiAgICB0aGlzLnJlZnJlc2hMYXllckNvbmZpZ3VyYXRpb24oaWQsIG9wYWNpdHksIG51bGwsIG51bGwpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSByZWZyZXNoTGF5ZXJDb25maWd1cmF0aW9uKGlkLCBvcGFjaXR5LCB2aXNpYmlsaXR5LCBwb3NpdGlvbikge1xyXG4gICAgLy8gU2VuZCB0aGUgbmV3IHZhbHVlcyBzbyB0aGF0IGFsbCBzdWJzY3JpYmVycyBhcmUgdXBkYXRlZFxyXG4gICAgdmFyIGxheWVyID0gbmV3IExheWVyQ29uZmlndXJhdGlvbigpO1xyXG4gICAgbGF5ZXIuaWQgPSBpZDtcclxuICAgIGxheWVyLm9wYWNpdHkgPSBvcGFjaXR5O1xyXG4gICAgbGF5ZXIudmlzaWJpbGl0eSA9IHZpc2liaWxpdHk7XHJcbiAgICBsYXllci5wb3NpdGlvbiA9IHBvc2l0aW9uO1xyXG4gICAgdGhpcy5sYXllckNvbmZpZ3VyYXRpb25TdWJqZWN0Lm5leHQoW2xheWVyXSk7XHJcbiAgfVxyXG5cclxuICBnZXRTaXR1YXRpb25NYXBDb25maWd1cmF0aW9uTGlzdGVuZXIoKTogT2JzZXJ2YWJsZTxMYXllcltdPiB7XHJcbiAgICByZXR1cm4gdGhpcy5zaXR1YXRpb25NYXBDb25maWd1cmF0aW9uU3ViamVjdC5hc09ic2VydmFibGUoKTtcclxuICB9XHJcblxyXG4gIC8qKiBjb25maWd1cmUgdGhlIHNpdHVhdGlvbiBtYXAgb2YgdGhlIG1hcCBjb21wb25lbnQgYnkgcGFzc2luZyBhcyBhIHBhcmFtZXRlciBhbiBhcnJheSBvZiBvYmplY3RzIG9mIHR5cGUgTGF5ZXJHcm91cCwgZWFjaCBvZiB0aGVtIHdpdGggdGhlIGNvcnJlc3BvbmRpbmcgTGF5ZXIgb2JqZWN0cyBkZWZpbmluZyB0aGUgbGF5ZXJzIHRvIGxvYWQgYXMgc2l0dWF0aW9uIG1hcC4qL1xyXG4gIGxvYWRTaXR1YXRpb25NYXBDb25maWd1cmF0aW9uKGxheWVyczpBcnJheTxMYXllcj4pIHtcclxuICAgIC8vIFNlbmQgdGhlIG5ldyB2YWx1ZXMgc28gdGhhdCBhbGwgc3Vic2NyaWJlcnMgYXJlIHVwZGF0ZWRcclxuICAgIHRoaXMuc2l0dWF0aW9uTWFwQ29uZmlndXJhdGlvblN1YmplY3QubmV4dChsYXllcnMpO1xyXG4gIH1cclxuXHJcbiAgZ2V0TWFwT3B0aW9uc0NvbmZpZ3VyYXRpb25MaXN0ZW5lcigpOiBPYnNlcnZhYmxlPE1hcE9wdGlvbnNDb25maWd1cmF0aW9uW10+IHtcclxuICAgIHJldHVybiB0aGlzLm1hcE9wdGlvbnNDb25maWd1cmF0aW9uU3ViamVjdC5hc09ic2VydmFibGUoKTtcclxuICB9XHJcblxyXG4gIC8qKiBsb2FkIG1hcCBvcHRpb25zIGNvbmZpZ3VyYXRpb24gKi9cclxuICBsb2FkTWFwT3B0aW9uc0NvbmZpZ3VyYXRpb24oY29uZmlndXJhdGlvbjpNYXBPcHRpb25zQ29uZmlndXJhdGlvbikge1xyXG4gICAgLy8gU2VuZCB0aGUgbmV3IHZhbHVlcyBzbyB0aGF0IGFsbCBzdWJzY3JpYmVycyBhcmUgdXBkYXRlZFxyXG4gICAgdGhpcy5tYXBPcHRpb25zQ29uZmlndXJhdGlvblN1YmplY3QubmV4dChbY29uZmlndXJhdGlvbl0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0TWFwQ29tcG9uZW50U3RhdHVzTGlzdGVuZXIoKTogT2JzZXJ2YWJsZTxNYXBDb21wb25lbnRTdGF0dXNbXT4ge1xyXG4gICAgcmV0dXJuIHRoaXMubWFwQ29tcG9uZW50U3RhdHVzU3ViamVjdC5hc09ic2VydmFibGUoKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNldCBtYXAgY29tcG9uZW50IHN0YXR1cyAqL1xyXG4gIHNldE1hcENvbXBvbmVudFN0YXR1cyhzdGF0dXM6TWFwQ29tcG9uZW50U3RhdHVzKSB7XHJcbiAgICAvL05vdGlmeSB0aGUgbWFwIGNvbXBvbmVudCBzdGF0dXNcclxuICAgIHRoaXMubWFwQ29tcG9uZW50U3RhdHVzU3ViamVjdC5uZXh0KFtzdGF0dXNdKTtcclxuICB9XHJcblxyXG59XHJcbiIsImltcG9ydCB7IERpcmVjdGl2ZSwgSW5wdXQsIFRlbXBsYXRlUmVmLCBWaWV3Q29udGFpbmVyUmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFByaW5jaXBhbCB9IGZyb20gJy4vcHJpbmNpcGFsLnNlcnZpY2UnO1xyXG5cclxuLyoqXHJcbiAqIEB3aGF0SXREb2VzIENvbmRpdGlvbmFsbHkgaW5jbHVkZXMgYW4gSFRNTCBlbGVtZW50IGlmIGN1cnJlbnQgdXNlciBoYXMgYW55XHJcbiAqIG9mIHRoZSBhdXRob3JpdGllcyBwYXNzZWQgYXMgdGhlIGBleHByZXNzaW9uYC5cclxuICpcclxuICogQGhvd1RvVXNlXHJcbiAqIGBgYFxyXG4gKiAgICAgPHNvbWUtZWxlbWVudCAqc2l0bXVuSGFzQW55QXV0aG9yaXR5PVwiJ1JPTEVfQURNSU4nXCI+Li4uPC9zb21lLWVsZW1lbnQ+XHJcbiAqXHJcbiAqICAgICA8c29tZS1lbGVtZW50ICpzaXRtdW5IYXNBbnlBdXRob3JpdHk9XCJbJ1JPTEVfQURNSU4nLCAnUk9MRV9VU0VSJ11cIj4uLi48L3NvbWUtZWxlbWVudD5cclxuICogYGBgXHJcbiAqL1xyXG5ARGlyZWN0aXZlKHtcclxuICAgIHNlbGVjdG9yOiAnW3NpdG11bkhhc0FueUF1dGhvcml0eV0nXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBIYXNBbnlBdXRob3JpdHlEaXJlY3RpdmUge1xyXG4gICAgXHJcbiAgICAvKiogYXV0aG9yaXRpZXMgdG8gY2hlY2sgKi9cclxuICAgIHB1YmxpYyBhdXRob3JpdGllczogc3RyaW5nW107IFxyXG4gICAgXHJcbiAgICAvKiogY29uc3RydWN0b3IgKi9cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcHJpbmNpcGFsOiBQcmluY2lwYWwsIHByaXZhdGUgdGVtcGxhdGVSZWY6IFRlbXBsYXRlUmVmPGFueT4sIHByaXZhdGUgdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZikge1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKiogdGVycml0b3J5IHRvIGNoZWNrIGF1dGhvcml0aWVzKi9cclxuICAgIEBJbnB1dCgpIHRlcnJpdG9yeTogc3RyaW5nO1xyXG4gICAgXHJcbiAgICAvKiogU2V0IHdoZXRoZXIgY3VycmVudCB1c2VyIGhhcyBhbnkgb2YgdGhlIGdpdmVuIGF1dGhvcml0aWVzICovXHJcbiAgICBASW5wdXQoKVxyXG4gICAgc2V0IHNpdG11bkhhc0FueUF1dGhvcml0eSh2YWx1ZTogc3RyaW5nfHN0cmluZ1tdKSB7XHJcbiAgICAgICAgdGhpcy5hdXRob3JpdGllcyA9IHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgPyBbIDxzdHJpbmc+IHZhbHVlIF0gOiA8c3RyaW5nW10+IHZhbHVlO1xyXG4gICAgICAgIHRoaXMudXBkYXRlVmlldygpO1xyXG4gICAgICAgIC8vIEdldCBub3RpZmllZCBlYWNoIHRpbWUgYXV0aGVudGljYXRpb24gc3RhdGUgY2hhbmdlcy5cclxuICAgICAgICB0aGlzLnByaW5jaXBhbC5nZXRBdXRoZW50aWNhdGlvblN0YXRlKCkuc3Vic2NyaWJlKChpZGVudGl0eSkgPT4gdGhpcy51cGRhdGVWaWV3KCkpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKiogdXBkYXRlIHZpZXcgKi9cclxuICAgIHByaXZhdGUgdXBkYXRlVmlldygpOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy50ZXJyaXRvcnkpe1xyXG4gICAgICAgIHRoaXMucHJpbmNpcGFsLmhhc0FueUF1dGhvcml0eU9uVGVycml0b3J5KHRoaXMuYXV0aG9yaXRpZXMsdGhpcy50ZXJyaXRvcnkpLnRoZW4oKHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnZpZXdDb250YWluZXJSZWYuY2xlYXIoKTtcclxuICAgICAgICAgICAgaWYgKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy52aWV3Q29udGFpbmVyUmVmLmNyZWF0ZUVtYmVkZGVkVmlldyh0aGlzLnRlbXBsYXRlUmVmKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMucHJpbmNpcGFsLmhhc0FueUF1dGhvcml0eSh0aGlzLmF1dGhvcml0aWVzKS50aGVuKChyZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgdGhpcy52aWV3Q29udGFpbmVyUmVmLmNsZWFyKCk7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudmlld0NvbnRhaW5lclJlZi5jcmVhdGVFbWJlZGRlZFZpZXcodGhpcy50ZW1wbGF0ZVJlZik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgRGlyZWN0aXZlLCBJbnB1dCwgVGVtcGxhdGVSZWYsIFZpZXdDb250YWluZXJSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgUHJpbmNpcGFsIH0gZnJvbSAnLi9wcmluY2lwYWwuc2VydmljZSc7XHJcblxyXG4vKipcclxuICogQHdoYXRJdERvZXMgQ29uZGl0aW9uYWxseSBpbmNsdWRlcyBhbiBIVE1MIGVsZW1lbnQgaWYgY3VycmVudCB1c2VyIGhhcyBhbnlcclxuICogb2YgdGhlIGF1dGhvcml0aWVzIHBhc3NlZCBhcyB0aGUgYGV4cHJlc3Npb25gLlxyXG4gKlxyXG4gKiBAaG93VG9Vc2VcclxuICogYGBgXHJcbiAqICAgICA8c29tZS1lbGVtZW50ICpzaXRtdW5IYXNBbnlBdXRob3JpdHk9XCInUk9MRV9BRE1JTidcIj4uLi48L3NvbWUtZWxlbWVudD5cclxuICpcclxuICogICAgIDxzb21lLWVsZW1lbnQgKnNpdG11bkhhc0FueUF1dGhvcml0eT1cIlsnUk9MRV9BRE1JTicsICdST0xFX1VTRVInXVwiPi4uLjwvc29tZS1lbGVtZW50PlxyXG4gKiBgYGBcclxuICovXHJcbkBEaXJlY3RpdmUoe1xyXG4gICAgc2VsZWN0b3I6ICdbc2l0bXVuSGFzQW55QXV0aG9yaXR5T25UZXJyaXRvcnldJ1xyXG59KVxyXG5leHBvcnQgY2xhc3MgSGFzQW55QXV0aG9yaXR5T25UZXJyaXRvcnlEaXJlY3RpdmUge1xyXG5cclxuICAgIC8qKiBhdXRob3JpdGllcyB0byBjaGVjayAqL1xyXG4gICAgcHVibGljIGF1dGhvcml0aWVzOiBzdHJpbmdbXTsgXHJcblxyXG4gICAgLyoqIHRlcnJpdG9yeSB0byBjaGVjayBhdXRob3JpdGllcyovXHJcbiAgICBwdWJsaWMgdGVycml0b3J5OiBzdHJpbmc7IFxyXG5cclxuICAgIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBwcmluY2lwYWw6IFByaW5jaXBhbCwgcHJpdmF0ZSB0ZW1wbGF0ZVJlZjogVGVtcGxhdGVSZWY8YW55PiwgcHJpdmF0ZSB2aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmKSB7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKiBTZXQgd2hldGhlciBjdXJyZW50IHVzZXIgaGFzIGFueSBvZiB0aGUgZ2l2ZW4gYXV0aG9yaXRpZXMgb24gdGVycml0b3J5ICovXHJcbiAgICBASW5wdXQoKVxyXG4gICAgc2V0IHNpdG11bkhhc0FueUF1dGhvcml0eU9uVGVycml0b3J5KG9wdHM6IGFueSkge1xyXG5cclxuICAgICAgICB0aGlzLmF1dGhvcml0aWVzID0gdHlwZW9mIG9wdHMuYXV0aG9yaXRpZXMgPT09ICdzdHJpbmcnID8gWyA8c3RyaW5nPiBvcHRzLmF1dGhvcml0aWVzIF0gOiA8c3RyaW5nW10+IG9wdHMuYXV0aG9yaXRpZXM7XHJcbiAgICAgICAgdGhpcy50ZXJyaXRvcnkgPSBvcHRzLnRlcnJpdG9yeTtcclxuICAgICAgICB0aGlzLnVwZGF0ZVZpZXcoKTtcclxuICAgICAgICAvLyBHZXQgbm90aWZpZWQgZWFjaCB0aW1lIGF1dGhlbnRpY2F0aW9uIHN0YXRlIGNoYW5nZXMuXHJcbiAgICAgICAgdGhpcy5wcmluY2lwYWwuZ2V0QXV0aGVudGljYXRpb25TdGF0ZSgpLnN1YnNjcmliZSgoaWRlbnRpdHkpID0+IHRoaXMudXBkYXRlVmlldygpKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoqIHVwZGF0ZSB2aWV3ICovXHJcbiAgICBwcml2YXRlIHVwZGF0ZVZpZXcoKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMudGVycml0b3J5KXtcclxuICAgICAgICB0aGlzLnByaW5jaXBhbC5oYXNBbnlBdXRob3JpdHlPblRlcnJpdG9yeSh0aGlzLmF1dGhvcml0aWVzLHRoaXMudGVycml0b3J5KS50aGVuKChyZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgdGhpcy52aWV3Q29udGFpbmVyUmVmLmNsZWFyKCk7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudmlld0NvbnRhaW5lclJlZi5jcmVhdGVFbWJlZGRlZFZpZXcodGhpcy50ZW1wbGF0ZVJlZik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLnByaW5jaXBhbC5oYXNBbnlBdXRob3JpdHkodGhpcy5hdXRob3JpdGllcykudGhlbigocmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMudmlld0NvbnRhaW5lclJlZi5jbGVhcigpO1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZpZXdDb250YWluZXJSZWYuY3JlYXRlRW1iZWRkZWRWaWV3KHRoaXMudGVtcGxhdGVSZWYpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IE5nTW9kdWxlLCBNb2R1bGVXaXRoUHJvdmlkZXJzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xyXG5pbXBvcnQge0h0dHBDbGllbnRNb2R1bGUsIEhUVFBfSU5URVJDRVBUT1JTLCBIdHRwQ2xpZW50fSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IFJvdXRlck1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XHJcbi8vaW1wb3J0IHsgQW5ndWxhckhhbE1vZHVsZSB9IGZyb20gJy4uLy4uL2xpYi9hbmd1bGFyLWhhbCc7XHJcbmltcG9ydCB7Q29kZUxpc3RTZXJ2aWNlfSBmcm9tICcuL2NvZGVsaXN0L2NvZGVsaXN0LnNlcnZpY2UnO1xyXG5pbXBvcnQge1RlcnJpdG9yeVNlcnZpY2V9IGZyb20gJy4vdGVycml0b3J5L3RlcnJpdG9yeS5zZXJ2aWNlJztcclxuaW1wb3J0IHtUZXJyaXRvcnlUeXBlU2VydmljZX0gZnJvbSAnLi90ZXJyaXRvcnkvdGVycml0b3J5LXR5cGUuc2VydmljZSc7XHJcbmltcG9ydCB7VGVycml0b3J5R3JvdXBUeXBlU2VydmljZX0gZnJvbSAnLi90ZXJyaXRvcnkvdGVycml0b3J5LWdyb3VwLXR5cGUuc2VydmljZSc7XHJcbmltcG9ydCB7VXNlclBvc2l0aW9uU2VydmljZX0gZnJvbSAnLi91c2VyL3VzZXItcG9zaXRpb24uc2VydmljZSc7XHJcbmltcG9ydCB7VXNlckNvbmZpZ3VyYXRpb25TZXJ2aWNlfSBmcm9tICcuL3VzZXIvdXNlci1jb25maWd1cmF0aW9uLnNlcnZpY2UnO1xyXG5pbXBvcnQge1JvbGVTZXJ2aWNlfSBmcm9tICcuL3JvbGUvcm9sZS5zZXJ2aWNlJztcclxuaW1wb3J0IHtVc2VyU2VydmljZX0gZnJvbSAnLi91c2VyL3VzZXIuc2VydmljZSc7XHJcbmltcG9ydCB7Q29ubmVjdGlvblNlcnZpY2V9IGZyb20gJy4vY29ubmVjdGlvbi9jb25uZWN0aW9uLnNlcnZpY2UnO1xyXG5pbXBvcnQge1Rhc2tTZXJ2aWNlfSBmcm9tICcuL3Rhc2svdGFzay5zZXJ2aWNlJztcclxuaW1wb3J0IHtUYXNrVHlwZVNlcnZpY2V9IGZyb20gJy4vdGFzay90YXNrLXR5cGUuc2VydmljZSc7XHJcbmltcG9ydCB7VGFza0dyb3VwU2VydmljZX0gZnJvbSAnLi90YXNrL3Rhc2stZ3JvdXAuc2VydmljZSc7XHJcbmltcG9ydCB7VGFza1BhcmFtZXRlclNlcnZpY2V9IGZyb20gJy4vdGFzay90YXNrLXBhcmFtZXRlci5zZXJ2aWNlJztcclxuaW1wb3J0IHtUYXNrQXZhaWxhYmlsaXR5U2VydmljZX0gZnJvbSAnLi90YXNrL3Rhc2stYXZhaWxhYmlsaXR5LnNlcnZpY2UnO1xyXG5pbXBvcnQge1Rhc2tVSVNlcnZpY2V9IGZyb20gJy4vdGFzay90YXNrLXVpLnNlcnZpY2UnO1xyXG5pbXBvcnQge1NlcnZpY2VTZXJ2aWNlfSBmcm9tICcuL3NlcnZpY2Uvc2VydmljZS5zZXJ2aWNlJztcclxuaW1wb3J0IHtTZXJ2aWNlUGFyYW1ldGVyU2VydmljZX0gZnJvbSAnLi9zZXJ2aWNlL3NlcnZpY2UtcGFyYW1ldGVyLnNlcnZpY2UnO1xyXG5pbXBvcnQge0NhcnRvZ3JhcGh5U2VydmljZX0gZnJvbSAnLi9jYXJ0b2dyYXBoeS9jYXJ0b2dyYXBoeS5zZXJ2aWNlJztcclxuaW1wb3J0IHtDYXJ0b2dyYXBoeUF2YWlsYWJpbGl0eVNlcnZpY2V9IGZyb20gJy4vY2FydG9ncmFwaHkvY2FydG9ncmFwaHktYXZhaWxhYmlsaXR5LnNlcnZpY2UnO1xyXG5pbXBvcnQge0NhcnRvZ3JhcGh5R3JvdXBTZXJ2aWNlfSBmcm9tICcuL2NhcnRvZ3JhcGh5L2NhcnRvZ3JhcGh5LWdyb3VwLnNlcnZpY2UnO1xyXG5pbXBvcnQge0JhY2tncm91bmRTZXJ2aWNlfSBmcm9tICcuL2NhcnRvZ3JhcGh5L2JhY2tncm91bmQuc2VydmljZSc7XHJcbmltcG9ydCB7VHJlZVNlcnZpY2V9IGZyb20gJy4vdHJlZS90cmVlLnNlcnZpY2UnO1xyXG5pbXBvcnQge1RyZWVOb2RlU2VydmljZX0gZnJvbSAnLi90cmVlL3RyZWUtbm9kZS5zZXJ2aWNlJztcclxuaW1wb3J0IHtBcHBsaWNhdGlvblNlcnZpY2V9IGZyb20gJy4vYXBwbGljYXRpb24vYXBwbGljYXRpb24uc2VydmljZSc7XHJcbmltcG9ydCB7QXBwbGljYXRpb25QYXJhbWV0ZXJTZXJ2aWNlfSBmcm9tICcuL2FwcGxpY2F0aW9uL2FwcGxpY2F0aW9uLXBhcmFtZXRlci5zZXJ2aWNlJztcclxuaW1wb3J0IHtBcHBsaWNhdGlvbkJhY2tncm91bmRTZXJ2aWNlfSBmcm9tICcuL2FwcGxpY2F0aW9uL2FwcGxpY2F0aW9uLWJhY2tncm91bmQuc2VydmljZSc7XHJcbmltcG9ydCB7IE1hcENvbmZpZ3VyYXRpb25NYW5hZ2VyU2VydmljZSB9IGZyb20gJy4vbWFwL21hcC1jb25maWd1cmF0aW9uLW1hbmFnZXIuc2VydmljZSc7XHJcbmltcG9ydCB7IEF1dGhTZXJ2aWNlIH0gZnJvbSAnLi9hdXRoL2F1dGguc2VydmljZSc7XHJcbmltcG9ydCB7IFByaW5jaXBhbCB9IGZyb20gJy4vYXV0aC9wcmluY2lwYWwuc2VydmljZSc7XHJcbmltcG9ydCB7IEF1dGhJbnRlcmNlcHRvciB9IGZyb20gJy4vYXV0aC9hdXRoLmludGVyY2VwdG9yJztcclxuaW1wb3J0IHsgQXV0aEV4cGlyZWRJbnRlcmNlcHRvciB9IGZyb20gJy4vYXV0aC9hdXRoLWV4cGlyZWQuaW50ZXJjZXB0b3InO1xyXG5pbXBvcnQgeyBIYXNBbnlBdXRob3JpdHlEaXJlY3RpdmUgfSBmcm9tICcuL2F1dGgvaGFzLWFueS1hdXRob3JpdHkuZGlyZWN0aXZlJztcclxuaW1wb3J0IHsgSGFzQW55QXV0aG9yaXR5T25UZXJyaXRvcnlEaXJlY3RpdmUgfSBmcm9tICcuL2F1dGgvaGFzLWFueS1hdXRob3JpdHktb24tdGVycml0b3J5LmRpcmVjdGl2ZSc7XHJcbmltcG9ydCB7IExvZ2luU2VydmljZSB9IGZyb20gJy4vYXV0aC9sb2dpbi5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQWNjb3VudFNlcnZpY2UgfSBmcm9tICcuL2FjY291bnQvYWNjb3VudC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgVXNlclBvc2l0aW9ufSBmcm9tICcuL3VzZXIvdXNlci1wb3NpdGlvbi5tb2RlbCc7XHJcbmltcG9ydCB7VHJhbnNsYXRlSHR0cExvYWRlcn0gZnJvbSAnQG5neC10cmFuc2xhdGUvaHR0cC1sb2FkZXInO1xyXG5pbXBvcnQge1RyYW5zbGF0ZUxvYWRlciwgVHJhbnNsYXRlTW9kdWxlfSBmcm9tICdAbmd4LXRyYW5zbGF0ZS9jb3JlJztcclxuXHJcbi8qKiBsb2FkIGkxOG4gYXNzZXRzKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVRyYW5zbGF0ZUxvYWRlcihodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgcmV0dXJuIG5ldyBUcmFuc2xhdGVIdHRwTG9hZGVyKGh0dHAsICcuL2Fzc2V0cy9pMThuLycsICcuanNvbicpO1xyXG59XHJcblxyXG5cclxuLyoqIFNJVE1VTiBmcm9udGVuZCBjb3JlIG1vZHVsZSAqL1xyXG5ATmdNb2R1bGUoe1xyXG4gIGltcG9ydHM6IFtcclxuICAgIC8qUm91dGVyTW9kdWxlLFxyXG4gICAgSHR0cENsaWVudE1vZHVsZSxcclxuICAgIENvbW1vbk1vZHVsZSxcclxuICAgIEFuZ3VsYXJIYWxNb2R1bGUsKi9cclxuICAgIFRyYW5zbGF0ZU1vZHVsZS5mb3JSb290KHtcclxuICAgICAgbG9hZGVyOiB7XHJcbiAgICAgICAgcHJvdmlkZTogVHJhbnNsYXRlTG9hZGVyLFxyXG4gICAgICAgIHVzZUZhY3Rvcnk6IChjcmVhdGVUcmFuc2xhdGVMb2FkZXIpLFxyXG4gICAgICAgIGRlcHM6IFtIdHRwQ2xpZW50XVxyXG4gICAgICB9XHJcbiAgICB9KSxcclxuICBdLFxyXG4gIGRlY2xhcmF0aW9uczogW1xyXG4gICAgSGFzQW55QXV0aG9yaXR5RGlyZWN0aXZlLFxyXG4gICAgSGFzQW55QXV0aG9yaXR5T25UZXJyaXRvcnlEaXJlY3RpdmUsXHJcbiAgXSxcclxuICBleHBvcnRzOiBbXHJcbiAgICBIYXNBbnlBdXRob3JpdHlEaXJlY3RpdmUsXHJcbiAgICBIYXNBbnlBdXRob3JpdHlPblRlcnJpdG9yeURpcmVjdGl2ZSxcclxuICAgIFRyYW5zbGF0ZU1vZHVsZVxyXG4gIF1cclxufSlcclxuZXhwb3J0IGNsYXNzIFNpdG11bkZyb250ZW5kQ29yZU1vZHVsZSB7XHJcbiAgc3RhdGljIGZvclJvb3QoKTogTW9kdWxlV2l0aFByb3ZpZGVycyB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBuZ01vZHVsZTogU2l0bXVuRnJvbnRlbmRDb3JlTW9kdWxlLFxyXG4gICAgICBwcm92aWRlcnM6IFtcclxuICAgICAgICBDb2RlTGlzdFNlcnZpY2UsXHJcbiAgICAgICAgVGVycml0b3J5U2VydmljZSxcclxuICAgICAgICBUZXJyaXRvcnlUeXBlU2VydmljZSxcclxuICAgICAgICBUZXJyaXRvcnlHcm91cFR5cGVTZXJ2aWNlLFxyXG4gICAgICAgIFJvbGVTZXJ2aWNlLFxyXG4gICAgICAgIEFjY291bnRTZXJ2aWNlLFxyXG4gICAgICAgIEF1dGhTZXJ2aWNlLFxyXG4gICAgICAgIFVzZXJTZXJ2aWNlLFxyXG4gICAgICAgIENvbm5lY3Rpb25TZXJ2aWNlLFxyXG4gICAgICAgIFRhc2tTZXJ2aWNlLFxyXG4gICAgICAgIFRhc2tUeXBlU2VydmljZSxcclxuICAgICAgICBUYXNrVUlTZXJ2aWNlLFxyXG4gICAgICAgIFRhc2tHcm91cFNlcnZpY2UsXHJcbiAgICAgICAgVGFza1BhcmFtZXRlclNlcnZpY2UsXHJcbiAgICAgICAgVGFza0F2YWlsYWJpbGl0eVNlcnZpY2UsXHJcbiAgICAgICAgU2VydmljZVNlcnZpY2UsXHJcbiAgICAgICAgU2VydmljZVBhcmFtZXRlclNlcnZpY2UsXHJcbiAgICAgICAgQ2FydG9ncmFwaHlTZXJ2aWNlLFxyXG4gICAgICAgIENhcnRvZ3JhcGh5R3JvdXBTZXJ2aWNlLFxyXG4gICAgICAgIENhcnRvZ3JhcGh5QXZhaWxhYmlsaXR5U2VydmljZSxcclxuICAgICAgICBCYWNrZ3JvdW5kU2VydmljZSxcclxuICAgICAgICBUcmVlU2VydmljZSxcclxuICAgICAgICBUcmVlTm9kZVNlcnZpY2UsXHJcbiAgICAgICAgQXBwbGljYXRpb25TZXJ2aWNlLFxyXG4gICAgICAgIEFwcGxpY2F0aW9uUGFyYW1ldGVyU2VydmljZSxcclxuICAgICAgICBBcHBsaWNhdGlvbkJhY2tncm91bmRTZXJ2aWNlLFxyXG4gICAgICAgIEF1dGhJbnRlcmNlcHRvcixcclxuICAgICAgICBBdXRoRXhwaXJlZEludGVyY2VwdG9yLFxyXG4gICAgICAgIFByaW5jaXBhbCxcclxuICAgICAgICBVc2VyUG9zaXRpb25TZXJ2aWNlLFxyXG4gICAgICAgIFVzZXJDb25maWd1cmF0aW9uU2VydmljZSxcclxuICAgICAgICBMb2dpblNlcnZpY2UsXHJcbiAgICAgICAgTWFwQ29uZmlndXJhdGlvbk1hbmFnZXJTZXJ2aWNlLFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHByb3ZpZGU6IEhUVFBfSU5URVJDRVBUT1JTLFxyXG4gICAgICAgICAgdXNlQ2xhc3M6IEF1dGhJbnRlcmNlcHRvcixcclxuICAgICAgICAgIG11bHRpOiB0cnVlXHJcbiAgICAgICAgfVxyXG4gICAgICAgICwge1xyXG4gICAgICAgICAgcHJvdmlkZTogSFRUUF9JTlRFUkNFUFRPUlMsXHJcbiAgICAgICAgICB1c2VDbGFzczogQXV0aEV4cGlyZWRJbnRlcmNlcHRvcixcclxuICAgICAgICAgIG11bHRpOiB0cnVlXHJcbiAgICAgICAgfVxyXG4gICAgICBdXHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG5cclxuIiwiaW1wb3J0IHtNb2R1bGVXaXRoUHJvdmlkZXJzLCBOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7SHR0cENsaWVudCwgSHR0cENsaWVudE1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQge0hhbFBhcmFtLCBSZXN0U2VydmljZX0gZnJvbSAnLi9yZXN0LnNlcnZpY2UnO1xyXG5pbXBvcnQge0V4dGVybmFsU2VydmljZX0gZnJvbSAnLi9leHRlcm5hbC5zZXJ2aWNlJztcclxuaW1wb3J0IHtSZXNvdXJjZVNlcnZpY2V9IGZyb20gJy4vcmVzb3VyY2Uuc2VydmljZSc7XHJcbmltcG9ydCB7RXh0ZXJuYWxDb25maWd1cmF0aW9uSGFuZGxlckludGVyZmFjZX0gZnJvbSAnLi9leHRlcm5hbC1jb25maWd1cmF0aW9uLmhhbmRsZXInO1xyXG5cclxuaW1wb3J0ICdyeGpzJztcclxuaW1wb3J0ICdyeGpzL2FkZC9vYnNlcnZhYmxlL2NvbmNhdCc7XHJcbmltcG9ydCAncnhqcy9hZGQvb2JzZXJ2YWJsZS9kZWZlcic7XHJcbmltcG9ydCAncnhqcy9hZGQvb2JzZXJ2YWJsZS9lbXB0eSc7XHJcbmltcG9ydCAncnhqcy9hZGQvb2JzZXJ2YWJsZS9mcm9tJztcclxuaW1wb3J0ICdyeGpzL2FkZC9vYnNlcnZhYmxlL2Zyb21FdmVudCc7XHJcbmltcG9ydCAncnhqcy9hZGQvb2JzZXJ2YWJsZS9tZXJnZSc7XHJcbmltcG9ydCAncnhqcy9hZGQvb2JzZXJ2YWJsZS9vZic7XHJcbmltcG9ydCAncnhqcy9hZGQvb2JzZXJ2YWJsZS90aW1lcic7XHJcbmltcG9ydCAncnhqcy9hZGQvb3BlcmF0b3IvY29uY2F0TWFwJztcclxuaW1wb3J0ICdyeGpzL2FkZC9vcGVyYXRvci9kbyc7XHJcbmltcG9ydCAncnhqcy9hZGQvb3BlcmF0b3IvZXhwYW5kJztcclxuaW1wb3J0ICdyeGpzL2FkZC9vcGVyYXRvci9maWx0ZXInO1xyXG5pbXBvcnQgJ3J4anMvYWRkL29wZXJhdG9yL2ZpcnN0JztcclxuaW1wb3J0ICdyeGpzL2FkZC9vcGVyYXRvci9sZXQnO1xyXG5pbXBvcnQgJ3J4anMvYWRkL29wZXJhdG9yL21hcCc7XHJcbmltcG9ydCAncnhqcy9hZGQvb3BlcmF0b3IvbWVyZ2VNYXAnO1xyXG5pbXBvcnQgJ3J4anMvYWRkL29wZXJhdG9yL3B1Ymxpc2hSZXBsYXknO1xyXG5pbXBvcnQgJ3J4anMvYWRkL29wZXJhdG9yL3JlZHVjZSc7XHJcbmltcG9ydCAncnhqcy9hZGQvb3BlcmF0b3Ivc2hhcmUnO1xyXG5pbXBvcnQgJ3J4anMvYWRkL29wZXJhdG9yL3N3aXRjaE1hcCc7XHJcbmltcG9ydCAncnhqcy9hZGQvb3BlcmF0b3IvdGFrZSc7XHJcbmltcG9ydCAncnhqcy9hZGQvb3BlcmF0b3IvdGFrZVdoaWxlJztcclxuaW1wb3J0ICdyeGpzL2FkZC9vYnNlcnZhYmxlL3Rocm93JztcclxuaW1wb3J0ICdyeGpzL2FkZC9vcGVyYXRvci9jYXRjaCc7XHJcbmltcG9ydCB7U3ViVHlwZUJ1aWxkZXJ9IGZyb20gJy4vc3VidHlwZS1idWlsZGVyJztcclxuXHJcbmV4cG9ydCB7RXh0ZXJuYWxTZXJ2aWNlfSBmcm9tICcuL2V4dGVybmFsLnNlcnZpY2UnO1xyXG5leHBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuL3Jlc3Quc2VydmljZSc7XHJcbmV4cG9ydCB7UmVzb3VyY2V9IGZyb20gJy4vcmVzb3VyY2UnO1xyXG5leHBvcnQge1Jlc291cmNlQXJyYXl9IGZyb20gJy4vcmVzb3VyY2UtYXJyYXknO1xyXG5leHBvcnQge1NvcnR9IGZyb20gJy4vc29ydCc7XHJcbmV4cG9ydCB7UmVzb3VyY2VIZWxwZXJ9IGZyb20gJy4vcmVzb3VyY2UtaGVscGVyJztcclxuZXhwb3J0IHtFeHRlcm5hbENvbmZpZ3VyYXRpb259IGZyb20gJy4vRXh0ZXJuYWxDb25maWd1cmF0aW9uJztcclxuZXhwb3J0IHtFeHRlcm5hbENvbmZpZ3VyYXRpb25IYW5kbGVySW50ZXJmYWNlfSBmcm9tICcuL2V4dGVybmFsLWNvbmZpZ3VyYXRpb24uaGFuZGxlcic7XHJcbmV4cG9ydCB7SGFsT3B0aW9ucywgSGFsUGFyYW19IGZyb20gJy4vcmVzdC5zZXJ2aWNlJztcclxuZXhwb3J0IHtTdWJUeXBlQnVpbGRlcn0gZnJvbSAnLi9zdWJ0eXBlLWJ1aWxkZXInO1xyXG5cclxuXHJcbi8qKiBBbmd1bGFyIEhBTCBtb2R1bGUgKi9cclxuQE5nTW9kdWxlKHtcclxuICAgIGltcG9ydHM6IFtIdHRwQ2xpZW50TW9kdWxlXSxcclxuICAgIGRlY2xhcmF0aW9uczogW10sXHJcbiAgICBleHBvcnRzOiBbSHR0cENsaWVudE1vZHVsZV0sXHJcbiAgICBwcm92aWRlcnM6IFtcclxuICAgICAgICBFeHRlcm5hbFNlcnZpY2UsXHJcbiAgICAgICAgSHR0cENsaWVudCxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHByb3ZpZGU6IFJlc291cmNlU2VydmljZSxcclxuICAgICAgICAgICAgdXNlQ2xhc3M6IFJlc291cmNlU2VydmljZSxcclxuICAgICAgICAgICAgZGVwczogW0V4dGVybmFsU2VydmljZV1cclxuICAgICAgICB9XVxyXG59KVxyXG5leHBvcnQgY2xhc3MgQW5ndWxhckhhbE1vZHVsZSB7XHJcbiAgICBzdGF0aWMgZm9yUm9vdCgpOiBNb2R1bGVXaXRoUHJvdmlkZXJzIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBuZ01vZHVsZTogQW5ndWxhckhhbE1vZHVsZSxcclxuICAgICAgICAgICAgcHJvdmlkZXJzOiBbXHJcbiAgICAgICAgICAgICAgICBFeHRlcm5hbFNlcnZpY2UsXHJcbiAgICAgICAgICAgICAgICBIdHRwQ2xpZW50LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHByb3ZpZGU6IFJlc291cmNlU2VydmljZSxcclxuICAgICAgICAgICAgICAgICAgICB1c2VDbGFzczogUmVzb3VyY2VTZXJ2aWNlLFxyXG4gICAgICAgICAgICAgICAgICAgIGRlcHM6IFtFeHRlcm5hbFNlcnZpY2VdXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59Il0sIm5hbWVzIjpbIm9ic2VydmFibGVUaHJvd0Vycm9yIiwidXJsLnBhcnNlIiwidHNsaWJfMS5fX3ZhbHVlcyIsIm9ic2VydmFibGVPZiIsInRzbGliXzEuX19leHRlbmRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFZQTs7Ozs7O0FBQUE7Ozs7Ozs2QkF1QjJCLENBQUM7Ozs7MEJBRUosQ0FBQzs7OzswQkFHRCxDQUFDOzs7O3NCQU1BLEVBQUU7Ozs7b0JBR2hCLFVBQUMsRUFBSztZQUNULEtBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQ3hCOzs7O3NCQUdRO1lBQ0wsT0FBTyxLQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztTQUM3Qjs7OztvQkFHYyxVQUFDLElBQWtCLEVBQUUsUUFBYSxFQUFFLFFBQWdCOztZQUMvRCxJQUFNLE1BQU0sR0FBcUIsY0FBYyxDQUFDLGlCQUFpQixDQUFJLEtBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUNyRixNQUFNLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztZQUMzQixjQUFjLENBQUMsNkJBQTZCLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUNyRSxPQUFPLE1BQU0sQ0FBQztTQUNq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