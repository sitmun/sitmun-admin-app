import { __extends, __spread, __values } from 'tslib';
import { throwError, of, Subject, BehaviorSubject } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { parse } from 'url';
import { HttpHeaders, HttpParams, HttpClient, HttpErrorResponse, HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { isNullOrUndefined, isPrimitive } from 'util';
import { Injectable, Inject, Injector, Directive, Input, TemplateRef, ViewContainerRef, NgModule, defineInjectable, inject, INJECTOR } from '@angular/core';
import { Observable } from 'rxjs-compat';
import { Router } from '@angular/router';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

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
     * @param {?=} embeddedName
     * @return {?}
     */
    ResourceHelper.instantiateResourceCollection = /**
     * instantiate a ResourceCollection from response embedded data
     * @template T
     * @param {?} type
     * @param {?} payload
     * @param {?} result
     * @param {?=} builder
     * @param {?=} embeddedName
     * @return {?}
     */
    function (type, payload, result, builder, embeddedName) {
        try {
            for (var _a = __values(Object.keys(payload[result._embedded])), _b = _a.next(); !_b.done; _b = _a.next()) {
                var embeddedClassName = _b.value;
                if (!embeddedName || (embeddedName && embeddedClassName == embeddedName)) {
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
     * @param {?=} embeddedName
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
     * @param {?=} embeddedName
     * @return {?}
     */
    function (type, resource, _embedded, options, subType, embeddedName) {
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
        return observable.pipe(map(function (response) { return ResourceHelper.instantiateResourceCollection(type, response, result, subType, embeddedName); }), catchError(function (error) { return throwError(error); }));
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
     * update resource from a given entity data
     * @template T
     * @param {?} resourceArray
     * @param {?} resourceLink
     * @return {?}
     */
    ResourceService.prototype.updateCollection = /**
     * update resource from a given entity data
     * @template T
     * @param {?} resourceArray
     * @param {?} resourceLink
     * @return {?}
     */
    function (resourceArray, resourceLink) {
        /** @type {?} */
        var uri = ResourceHelper.getProxy(resourceLink);
        /** @type {?} */
        var headersReq = ResourceHelper.headers;
        headersReq.set("Content-Type", "text/uri-list");
        /** @type {?} */
        var observable = ResourceHelper.getHttp().put(uri, resourceArray, { headers: headersReq, observe: 'response' });
        return observable.pipe(map(function (response) {
            if (response.status >= 200 && response.status <= 207)
                return "";
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
     * @param {?=} embeddedName
     * @return {?}
     */
    RestService.prototype.getAll = /**
     * get all resources with optional options an subType params
     * @param {?=} options
     * @param {?=} subType
     * @param {?=} embeddedName
     * @return {?}
     */
    function (options, subType, embeddedName) {
        var _this = this;
        return this.resourceService.getAll(this.type, this.resource, this._embedded, options, subType, embeddedName).pipe(mergeMap(function (resourceArray) {
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
            /** @type {?} */
            var intercept = request.url.indexOf("/api/") != -1;
            //tractem request
            if (intercept) {
                if (err instanceof HttpErrorResponse) {
                    if (err.status === 401) {
                        _this.authService.logout().subscribe();
                        _this.principal.authenticate(null);
                        _this.router.navigate(['/']);
                    }
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
var DashboardService = /** @class */ (function () {
    /** constructor */
    function DashboardService(http, resourceService) {
        this.http = http;
        this.resourceService = resourceService;
        /**
         * API resource path
         */
        this.DASHBOARD_API = 'dashboard/info';
        this.DASHBOARD_EMBEDDED = 'dashboard';
    }
    /** get all kpi */
    /**
     * get all kpi
     * @return {?}
     */
    DashboardService.prototype.getAll = /**
     * get all kpi
     * @return {?}
     */
    function () {
        var _this = this;
        return this.http.get(this.resourceService.getResourceUrl(this.DASHBOARD_API)).map(function (response) { return response[_this.DASHBOARD_EMBEDDED]; });
    };
    DashboardService.decorators = [
        { type: Injectable, args: [{
                    providedIn: 'root'
                },] },
    ];
    /** @nocollapse */
    DashboardService.ctorParameters = function () { return [
        { type: HttpClient },
        { type: ResourceService }
    ]; };
    /** @nocollapse */ DashboardService.ngInjectableDef = defineInjectable({ factory: function DashboardService_Factory() { return new DashboardService(inject(HttpClient), inject(ResourceService)); }, token: DashboardService, providedIn: "root" });
    return DashboardService;
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
            result = this.http.post(this.resourceService.getResourceUrl(this.USER_API), item);
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
            if (item.roleChildren != null) {
                item.substituteRelation('roleChildren', item.roleChildren).subscribe(function (result) {
                }, function (error) { return console.error(error); });
            }
        }
        else {
            item.territory = item.territory._links.self.href;
            item.role = item.role != null ? item.role._links.self.href : null;
            item.user = item.user._links.self.href;
            item.roleChildren = item.roleChildren != null ? item.roleChildren._links.self.href : null;
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
        /** @type {?} */
        var territoryGroupType = {};
        territoryGroupType._links = {};
        territoryGroupType._links.self = {};
        territoryGroupType._links.self.href = "";
        if (item.groupType != null) {
            territoryGroupType = item.groupType;
            if (typeof item.groupType._links != 'undefined') {
                item.groupType = item.groupType._links.self.href;
            }
        }
        if (item._links != null) {
            //update relations
            delete item.groupType;
            if (territoryGroupType._links.self.href == '') {
                item.deleteRelation('groupType', territoryGroupType).subscribe(function (result) {
                }, function (error) { return console.error(error); });
            }
            else {
                item.substituteRelation('groupType', territoryGroupType).subscribe(function (result) {
                }, function (error) { return console.error(error); });
            }
            if (item.type != null)
                item.type = item.type._links.self.href;
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
    /**
     * @param {?} item
     * @return {?}
     */
    ConnectionService.prototype.testConnection = /**
     * @param {?} item
     * @return {?}
     */
    function (item) {
        /** @type {?} */
        var result;
        result = this.http.post(this.resourceService.getResourceUrl(this.CONNECTION_API) + "/test", item);
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
        if (item._links != null) {
            if (!item.service) {
                /** @type {?} */
                var service = {};
                service._links = {};
                service._links.self = {};
                service._links.self.href = "";
                item.deleteRelation('service', service).subscribe(function (result) {
                }, function (error) { return console.error(error); });
            }
            else {
                item.service._links.self.href = item.service._links.self.href.split("{")[0];
                item.substituteRelation('service', item.service).subscribe(function (result) {
                }, function (error) { return console.error(error); });
                item.service = item.service._links.self.href;
            }
            if (!item.cartography) {
                /** @type {?} */
                var cartography = {};
                cartography._links = {};
                cartography._links.self = {};
                cartography._links.self.href = "";
                item.deleteRelation('cartography', cartography).subscribe(function (result) {
                }, function (error) { return console.error(error); });
            }
            else {
                item.cartography._links.self.href = item.cartography._links.self.href.split("{")[0];
                item.substituteRelation('cartography', item.cartography).subscribe(function (result) {
                }, function (error) { return console.error(error); });
                item.cartography = item.cartography._links.self.href;
            }
            if (!item.connection) {
                /** @type {?} */
                var connection = {};
                connection._links = {};
                connection._links.self = {};
                connection._links.self.href = "";
                item.deleteRelation('connection', connection).subscribe(function (result) {
                }, function (error) { return console.error(error); });
            }
            else {
                item.connection._links.self.href = item.connection._links.self.href.split("{")[0];
                item.substituteRelation('connection', item.connection).subscribe(function (result) {
                }, function (error) { return console.error(error); });
                item.connection = item.connection._links.self.href;
            }
            if (!item.ui) ;
            else {
                item.ui._links.self.href = item.ui._links.self.href.split("{")[0];
                item.substituteRelation('ui', item.ui).subscribe(function (result) {
                }, function (error) { return console.error(error); });
                item.ui = item.ui._links.self.href;
            }
            if (!item.group) ;
            else {
                item.group._links.self.href = item.group._links.self.href.split("{")[0];
                item.substituteRelation('group', item.group).subscribe(function (result) {
                }, function (error) { return console.error(error); });
                item.group = item.group._links.self.href;
            }
            if (!item.type) ;
            else {
                item.type._links.self.href = item.type._links.self.href.split("{")[0];
                item.substituteRelation('type', item.type).subscribe(function (result) {
                }, function (error) { return console.error(error); });
                item.type = item.type._links.self.href;
            }
            if (item.roles) {
                /** @type {?} */
                var roles = __spread(item.roles);
                delete item.roles;
                item.substituteAllRelation('roles', roles).subscribe(function (result) {
                }, function (error) { return console.error(error); });
            }
            result = this.http.put(item._links.self.href, item);
        }
        else {
            if (item.cartography) {
                item.cartography = item.cartography._links.self.href;
            }
            if (item.connection) {
                item.connection = item.connection._links.self.href;
            }
            if (item.service) {
                item.service = item.service._links.self.href;
            }
            if (item.ui) {
                item.ui = item.ui._links.self.href;
            }
            if (item.group) {
                item.group = item.group._links.self.href;
            }
            if (item.type) {
                item.type = item.type._links.self.href;
            }
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
 * Task model
 */
var  /**
 * Task model
 */
Translation = /** @class */ (function (_super) {
    __extends(Translation, _super);
    function Translation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Translation;
}(Resource));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var TranslationService = /** @class */ (function (_super) {
    __extends(TranslationService, _super);
    /** constructor */
    function TranslationService(injector, http) {
        var _this = _super.call(this, Translation, "translations", injector) || this;
        _this.http = http;
        /**
         * API resource path
         */
        _this.TRANSLATION_API = 'translations';
        return _this;
    }
    /** remove translation*/
    /**
     * remove translation
     * @param {?} item
     * @return {?}
     */
    TranslationService.prototype.remove = /**
     * remove translation
     * @param {?} item
     * @return {?}
     */
    function (item) {
        return this.http.delete(item._links.self.href);
    };
    /** save translation*/
    /**
     * save translation
     * @param {?} item
     * @return {?}
     */
    TranslationService.prototype.save = /**
     * save translation
     * @param {?} item
     * @return {?}
     */
    function (item) {
        /** @type {?} */
        var result;
        /** @type {?} */
        var language = {};
        language._links = {};
        language._links.self = {};
        language._links.self.href = "";
        if (item.language != null) {
            language = item.language;
            if (typeof item.language._links != 'undefined') {
                item.language = item.language._links.self.href;
            }
        }
        if (item._links != null) {
            delete item.language;
            // if (language._links.self.href == '') {
            //   item.deleteRelation('language', language).subscribe(result => {
            //   }, error => console.error(error));
            // } else {
            //   item.substituteRelation('language', language).subscribe(result => {
            //   }, error => console.error(error));
            // }
            result = this.http.put(item._links.self.href, item);
        }
        else {
            result = this.http.post(this.resourceService.getResourceUrl(this.TRANSLATION_API), item);
        }
        return result;
    };
    TranslationService.decorators = [
        { type: Injectable, args: [{
                    providedIn: 'root'
                },] },
    ];
    /** @nocollapse */
    TranslationService.ctorParameters = function () { return [
        { type: Injector },
        { type: HttpClient }
    ]; };
    /** @nocollapse */ TranslationService.ngInjectableDef = defineInjectable({ factory: function TranslationService_Factory() { return new TranslationService(inject(INJECTOR), inject(HttpClient)); }, token: TranslationService, providedIn: "root" });
    return TranslationService;
}(RestService));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Task model
 */
var  /**
 * Task model
 */
Language = /** @class */ (function (_super) {
    __extends(Language, _super);
    function Language() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Language;
}(Resource));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var LanguageService = /** @class */ (function (_super) {
    __extends(LanguageService, _super);
    /** constructor */
    function LanguageService(injector, http) {
        var _this = _super.call(this, Language, "languages", injector) || this;
        _this.http = http;
        /**
         * API resource path
         */
        _this.LANGUAGES_API = 'languages';
        return _this;
    }
    /** remove translation*/
    /**
     * remove translation
     * @param {?} item
     * @return {?}
     */
    LanguageService.prototype.remove = /**
     * remove translation
     * @param {?} item
     * @return {?}
     */
    function (item) {
        return this.http.delete(item._links.self.href);
    };
    /** save translation*/
    /**
     * save translation
     * @param {?} item
     * @return {?}
     */
    LanguageService.prototype.save = /**
     * save translation
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
            result = this.http.post(this.resourceService.getResourceUrl(this.LANGUAGES_API), item);
        }
        return result;
    };
    LanguageService.decorators = [
        { type: Injectable, args: [{
                    providedIn: 'root'
                },] },
    ];
    /** @nocollapse */
    LanguageService.ctorParameters = function () { return [
        { type: Injector },
        { type: HttpClient }
    ]; };
    /** @nocollapse */ LanguageService.ngInjectableDef = defineInjectable({ factory: function LanguageService_Factory() { return new LanguageService(inject(INJECTOR), inject(HttpClient)); }, token: LanguageService, providedIn: "root" });
    return LanguageService;
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
 * Capabilitie model
 */
var  /**
 * Capabilitie model
 */
Capabilitie = /** @class */ (function (_super) {
    __extends(Capabilitie, _super);
    function Capabilitie() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Capabilitie;
}(Resource));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var CapabilitiesService = /** @class */ (function (_super) {
    __extends(CapabilitiesService, _super);
    /** constructor */
    function CapabilitiesService(injector, http) {
        var _this = _super.call(this, Capabilitie, "helpers/capabilities?url=", injector) || this;
        _this.http = http;
        /**
         * API resource path
         */
        _this.CAPABILITIES_API = 'helpers/capabilities?url=';
        return _this;
    }
    /** save service*/
    /**
     * save service
     * @param {?} url
     * @return {?}
     */
    CapabilitiesService.prototype.getInfo = /**
     * save service
     * @param {?} url
     * @return {?}
     */
    function (url) {
        /** @type {?} */
        var result;
        if (url) {
            /** @type {?} */
            var finalUrl = this.resourceService.getResourceUrl(this.CAPABILITIES_API);
            finalUrl = finalUrl.concat(url);
            console.log(finalUrl);
            result = this.http.get(finalUrl);
        }
        return result;
    };
    CapabilitiesService.decorators = [
        { type: Injectable, args: [{
                    providedIn: 'root'
                },] },
    ];
    /** @nocollapse */
    CapabilitiesService.ctorParameters = function () { return [
        { type: Injector },
        { type: HttpClient }
    ]; };
    /** @nocollapse */ CapabilitiesService.ngInjectableDef = defineInjectable({ factory: function CapabilitiesService_Factory() { return new CapabilitiesService(inject(INJECTOR), inject(HttpClient)); }, token: CapabilitiesService, providedIn: "root" });
    return CapabilitiesService;
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
        var cartographyConnection = {};
        cartographyConnection._links = {};
        cartographyConnection._links.self = {};
        cartographyConnection._links.self.href = "";
        /** @type {?} */
        var cartographyService = {};
        cartographyService._links = {};
        cartographyService._links.self = {};
        cartographyService._links.self.href = "";
        /** @type {?} */
        var cartographySelectionService = {};
        cartographySelectionService._links = {};
        cartographySelectionService._links.self = {};
        cartographySelectionService._links.self.href = "";
        if (item.service != null) {
            cartographyService = item.service;
            if (typeof item.service._links != 'undefined') {
                item.service = item.service._links.self.href;
            }
        }
        if (item.selectionService != null) {
            cartographySelectionService = item.selectionService;
            if (typeof item.selectionService._links != 'undefined') {
                item.selectionService = item.selectionService._links.self.href;
            }
        }
        if (item.connection != null) {
            cartographyConnection = item.connection;
            if (typeof item.connection._links != 'undefined') {
                item.connection = item.connection._links.self.href;
            }
        }
        if (item._links != null) {
            //update relations
            delete item.connection;
            delete item.service;
            delete item.selectionService;
            // if (cartographyConnection._links.self.href == '' && cartographyConnection) {
            //   item.deleteRelation('spatialSelectionConnection', cartographyConnection).subscribe(result => {
            //   }, error => console.error(error));
            // } else {
            //   item.substituteRelation('spatialSelectionConnection', cartographyConnection).subscribe(result => {
            //   }, error => console.error(error));
            // }
            if (cartographyService._links.self.href == '') {
                item.deleteRelation('service', cartographyService).subscribe(function (result) {
                }, function (error) { return console.error(error); });
            }
            else {
                item.substituteRelation('service', cartographyService).subscribe(function (result) {
                }, function (error) { return console.error(error); });
            }
            if (cartographySelectionService._links.self.href == '' && cartographySelectionService) {
                item.deleteRelation('spatialSelectionService', cartographySelectionService).subscribe(function (result) {
                }, function (error) { return console.error(error); });
            }
            else {
                item.substituteRelation('spatialSelectionService', cartographySelectionService).subscribe(function (result) {
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
 * Cartography availability model
 */
var  /**
 * Cartography availability model
 */
CartographyFilter = /** @class */ (function (_super) {
    __extends(CartographyFilter, _super);
    function CartographyFilter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CartographyFilter;
}(Resource));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * CartographyFilter manager service
 */
var CartographyFilterService = /** @class */ (function (_super) {
    __extends(CartographyFilterService, _super);
    /** constructor */
    function CartographyFilterService(injector, http) {
        var _this = _super.call(this, CartographyFilter, "cartography-filters", injector) || this;
        _this.http = http;
        /**
         * API resource path
         */
        _this.CARTOGRAPHY_FILTER_API = 'cartography-filters';
        return _this;
    }
    /** remove cartography filter*/
    /**
     * remove cartography filter
     * @param {?} item
     * @return {?}
     */
    CartographyFilterService.prototype.remove = /**
     * remove cartography filter
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
    CartographyFilterService.prototype.save = /**
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
            if (item.territorialLevel != null && item.territorialLevel != undefined) {
                item.substituteRelation('territorialLevel', item.territorialLevel).subscribe(function (result) {
                }, function (error) { return console.error(error); });
            }
        }
        else {
            item.cartography = item.cartography._links.self.href;
            item.territorialLevel = item.territorialLevel._links.self.href;
            result = this.http.post(this.resourceService.getResourceUrl(this.CARTOGRAPHY_FILTER_API), item);
        }
        return result;
    };
    CartographyFilterService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    CartographyFilterService.ctorParameters = function () { return [
        { type: Injector },
        { type: HttpClient }
    ]; };
    return CartographyFilterService;
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
CartographyParameter = /** @class */ (function (_super) {
    __extends(CartographyParameter, _super);
    function CartographyParameter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CartographyParameter;
}(Resource));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Service parameter manager service
 */
var CartographyParameterService = /** @class */ (function (_super) {
    __extends(CartographyParameterService, _super);
    /** constructor */
    function CartographyParameterService(injector, http) {
        var _this = _super.call(this, CartographyParameter, "cartography-parameters", injector) || this;
        _this.http = http;
        /**
         * API resource path
         */
        _this.CARTOGRAPHY_PARAMETER_API = 'cartography-parameters';
        return _this;
    }
    /** remove service parameter*/
    /**
     * remove service parameter
     * @param {?} item
     * @return {?}
     */
    CartographyParameterService.prototype.remove = /**
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
    CartographyParameterService.prototype.save = /**
     * save service parameter
     * @param {?} item
     * @return {?}
     */
    function (item) {
        /** @type {?} */
        var result;
        if (item._links != null) {
            if (item.cartography != null) {
                /** @type {?} */
                var cartography = item.cartography;
                delete item.cartography;
                item.substituteRelation('cartography', cartography).subscribe(function (result) {
                }, function (error) { return console.error(error); });
            }
            result = this.http.put(item._links.self.href, item);
        }
        else {
            item.cartography = item.cartography._links.self.href;
            result = this.http.post(this.resourceService.getResourceUrl(this.CARTOGRAPHY_PARAMETER_API), item);
        }
        return result;
    };
    CartographyParameterService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    CartographyParameterService.ctorParameters = function () { return [
        { type: Injector },
        { type: HttpClient }
    ]; };
    return CartographyParameterService;
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
        var backgroundCartographyGroup = {};
        backgroundCartographyGroup._links = {};
        backgroundCartographyGroup._links.self = {};
        backgroundCartographyGroup._links.self.href = "";
        item.cartographyGroup;
        if (item.cartographyGroup != null) {
            backgroundCartographyGroup = item.cartographyGroup;
            if (typeof item.cartographyGroup._links != 'undefined') {
                item.cartographyGroup = item.cartographyGroup._links.self.href;
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
            else {
                /** @type {?} */
                var treeNodeParent = {};
                treeNodeParent._links = {};
                treeNodeParent._links.self = {};
                treeNodeParent._links.self.href = "";
                item.deleteRelation('parent', treeNodeParent).subscribe(function (result) {
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
        var applicationSituationMap = {};
        applicationSituationMap._links = {};
        applicationSituationMap._links.self = {};
        applicationSituationMap._links.self.href = "";
        if (item.situationMap != null) {
            applicationSituationMap = item.situationMap;
            if (typeof item.situationMap._links != 'undefined') {
                item.situationMap = item.situationMap._links.self.href;
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
                CapabilitiesService,
                ServiceParameterService,
                CartographyService,
                CartographyGroupService,
                CartographyAvailabilityService,
                CartographyParameterService,
                CartographyFilterService,
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
                TranslationService,
                LanguageService,
                DashboardService,
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

export { AccountService, AuthService, AuthInterceptor, AuthExpiredInterceptor, LoginService, Principal, DashboardService, User, UserService, UserPosition, UserPositionService, UserConfiguration, UserConfigurationService, Territory, TerritoryService, TerritoryType, TerritoryTypeService, TerritoryGroupType, TerritoryGroupTypeService, Role, RoleService, Connection, ConnectionService, GEOADMIN_TREE_TASK_ID, Task, TaskService, TaskType, TaskTypeService, TaskGroup, TaskGroupService, TaskParameter, TaskParameterService, TaskAvailability, TaskAvailabilityService, TaskUI, TaskUIService, TranslationService, Translation, Language, LanguageService, Service, ServiceService, ServiceParameter, ServiceParameterService, Capabilitie, CapabilitiesService, Cartography, CartographyService, CartographyGroup, CartographyGroupService, CartographyAvailability, CartographyAvailabilityService, CartographyFilter, CartographyFilterService, CartographyParameter, CartographyParameterService, Background, BackgroundService, Tree, TreeService, TreeNode, TreeNodeService, TERRITORIAL_APP_NAME, Application, ApplicationService, ApplicationBackground, ApplicationBackgroundService, ApplicationParameter, ApplicationParameterService, CodeList, CodeListService, Layer, OptionalParameter, LayerConfiguration, LayerGroup, MapOptionsConfiguration, MapComponentStatus, MapConfigurationManagerService, createTranslateLoader, SitmunFrontendCoreModule, ExternalService, RestService, Resource, ResourceArray, ResourceService, ResourceHelper, AngularHalModule, HasAnyAuthorityOnTerritoryDirective as ɵb, HasAnyAuthorityDirective as ɵa };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2l0bXVuLWZyb250ZW5kLWNvcmUuanMubWFwIiwic291cmNlcyI6WyJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlLWFycmF5LnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZS1oZWxwZXIudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvdXNlci91c2VyLm1vZGVsLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvYW5ndWxhci1oYWwvc3JjL2xpYi9leHRlcm5hbC5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZS5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS9hY2NvdW50L2FjY291bnQuc2VydmljZS50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL2F1dGgvYXV0aC5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvYXV0aC9hdXRoLmludGVyY2VwdG9yLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvYXV0aC9wcmluY2lwYWwuc2VydmljZS50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL2F1dGgvYXV0aC1leHBpcmVkLmludGVyY2VwdG9yLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvYXV0aC9sb2dpbi5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvZGFzaGJvYXJkL2Rhc2hib2FyZC5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvdXNlci91c2VyLnNlcnZpY2UudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS91c2VyL3VzZXItcG9zaXRpb24ubW9kZWwudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS91c2VyL3VzZXItcG9zaXRpb24uc2VydmljZS50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL3VzZXIvdXNlci1jb25maWd1cmF0aW9uLm1vZGVsLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvdXNlci91c2VyLWNvbmZpZ3VyYXRpb24uc2VydmljZS50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL3RlcnJpdG9yeS90ZXJyaXRvcnkubW9kZWwudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS90ZXJyaXRvcnkvdGVycml0b3J5LnNlcnZpY2UudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS90ZXJyaXRvcnkvdGVycml0b3J5LXR5cGUubW9kZWwudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS90ZXJyaXRvcnkvdGVycml0b3J5LXR5cGUuc2VydmljZS50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL3RlcnJpdG9yeS90ZXJyaXRvcnktZ3JvdXAtdHlwZS5tb2RlbC50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL3RlcnJpdG9yeS90ZXJyaXRvcnktZ3JvdXAtdHlwZS5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvcm9sZS9yb2xlLm1vZGVsLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvcm9sZS9yb2xlLnNlcnZpY2UudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS9jb25uZWN0aW9uL2Nvbm5lY3Rpb24ubW9kZWwudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS9jb25uZWN0aW9uL2Nvbm5lY3Rpb24uc2VydmljZS50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL3Rhc2svdGFzay5tb2RlbC50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL3Rhc2svdGFzay5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvdGFzay90YXNrLXR5cGUubW9kZWwudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS90YXNrL3Rhc2stdHlwZS5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvdGFzay90YXNrLWdyb3VwLm1vZGVsLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvdGFzay90YXNrLWdyb3VwLnNlcnZpY2UudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS90YXNrL3Rhc2stcGFyYW1ldGVyLm1vZGVsLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvdGFzay90YXNrLXBhcmFtZXRlci5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvdGFzay90YXNrLWF2YWlsYWJpbGl0eS5tb2RlbC50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL3Rhc2svdGFzay1hdmFpbGFiaWxpdHkuc2VydmljZS50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL3Rhc2svdGFzay11aS5tb2RlbC50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL3Rhc2svdGFzay11aS5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvdHJhbnNsYXRpb24vdHJhbnNsYXRpb24ubW9kZWwudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS90cmFuc2xhdGlvbi90cmFuc2xhdGlvbi5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvdHJhbnNsYXRpb24vbGFuZ3VhZ2UubW9kZWwudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS90cmFuc2xhdGlvbi9sYW5ndWFnZS5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvc2VydmljZS9zZXJ2aWNlLm1vZGVsLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvc2VydmljZS9zZXJ2aWNlLnNlcnZpY2UudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS9zZXJ2aWNlL3NlcnZpY2UtcGFyYW1ldGVyLm1vZGVsLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvc2VydmljZS9zZXJ2aWNlLXBhcmFtZXRlci5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvY2FwYWJpbGl0aWVzL2NhcGFiaWxpdGllLm1vZGVsLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvY2FwYWJpbGl0aWVzL2NhcGFiaWxpdGllcy5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvY2FydG9ncmFwaHkvY2FydG9ncmFwaHkubW9kZWwudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS9jYXJ0b2dyYXBoeS9jYXJ0b2dyYXBoeS5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvY2FydG9ncmFwaHkvY2FydG9ncmFwaHktZ3JvdXAubW9kZWwudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS9jYXJ0b2dyYXBoeS9jYXJ0b2dyYXBoeS1ncm91cC5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvY2FydG9ncmFwaHkvY2FydG9ncmFwaHktYXZhaWxhYmlsaXR5Lm1vZGVsLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvY2FydG9ncmFwaHkvY2FydG9ncmFwaHktYXZhaWxhYmlsaXR5LnNlcnZpY2UudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS9jYXJ0b2dyYXBoeS9jYXJ0b2dyYXBoeS1maWx0ZXIubW9kZWwudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS9jYXJ0b2dyYXBoeS9jYXJ0b2dyYXBoeS1maWx0ZXIuc2VydmljZS50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL2NhcnRvZ3JhcGh5L2NhcnRvZ3JhcGh5LXBhcmFtZXRlci5tb2RlbC50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL2NhcnRvZ3JhcGh5L2NhcnRvZ3JhcGh5LXBhcmFtZXRlci5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvY2FydG9ncmFwaHkvYmFja2dyb3VuZC5tb2RlbC50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL2NhcnRvZ3JhcGh5L2JhY2tncm91bmQuc2VydmljZS50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL3RyZWUvdHJlZS5tb2RlbC50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL3RyZWUvdHJlZS5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvdHJlZS90cmVlLW5vZGUubW9kZWwudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS90cmVlL3RyZWUtbm9kZS5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvYXBwbGljYXRpb24vYXBwbGljYXRpb24ubW9kZWwudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS9hcHBsaWNhdGlvbi9hcHBsaWNhdGlvbi5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvYXBwbGljYXRpb24vYXBwbGljYXRpb24tYmFja2dyb3VuZC5tb2RlbC50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL2FwcGxpY2F0aW9uL2FwcGxpY2F0aW9uLWJhY2tncm91bmQuc2VydmljZS50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL2FwcGxpY2F0aW9uL2FwcGxpY2F0aW9uLXBhcmFtZXRlci5tb2RlbC50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL2FwcGxpY2F0aW9uL2FwcGxpY2F0aW9uLXBhcmFtZXRlci5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvY29kZWxpc3QvY29kZWxpc3QubW9kZWwudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS9jb2RlbGlzdC9jb2RlbGlzdC5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvbWFwL21hcC1jb25maWd1cmF0aW9uLW1hbmFnZXIuc2VydmljZS50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL2F1dGgvaGFzLWFueS1hdXRob3JpdHkuZGlyZWN0aXZlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvYXV0aC9oYXMtYW55LWF1dGhvcml0eS1vbi10ZXJyaXRvcnkuZGlyZWN0aXZlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvc2l0bXVuLWZyb250ZW5kLWNvcmUubW9kdWxlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvYW5ndWxhci1oYWwvc3JjL2xpYi9hbmd1bGFyLWhhbC5tb2R1bGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiXHJcbmltcG9ydCB7dGhyb3dFcnJvciBhcyBvYnNlcnZhYmxlVGhyb3dFcnJvcn0gZnJvbSAncnhqcyc7XHJcblxyXG5pbXBvcnQge2NhdGNoRXJyb3IsIG1hcH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5pbXBvcnQge1NvcnR9IGZyb20gJy4vc29ydCc7XHJcbmltcG9ydCB7QXJyYXlJbnRlcmZhY2V9IGZyb20gJy4vYXJyYXktaW50ZXJmYWNlJztcclxuaW1wb3J0IHtSZXNvdXJjZUhlbHBlcn0gZnJvbSAnLi9yZXNvdXJjZS1oZWxwZXInO1xyXG5pbXBvcnQge1Jlc291cmNlfSBmcm9tICcuL3Jlc291cmNlJztcclxuaW1wb3J0ICogYXMgdXJsIGZyb20gJ3VybCc7XHJcbmltcG9ydCB7T2JzZXJ2YWJsZX0gZnJvbSAncnhqcyc7XHJcblxyXG4vKiogUkVTVCBhcnJheSBvZiByZXNvdXJjZSBpbXBsZW1lbnRhdGlvbiAqL1xyXG5leHBvcnQgY2xhc3MgUmVzb3VyY2VBcnJheTxUIGV4dGVuZHMgUmVzb3VyY2U+IGltcGxlbWVudHMgQXJyYXlJbnRlcmZhY2U8VD4ge1xyXG4gICAgLyoqIHNvcnRpbmcgaW5mbyAqL1xyXG4gICAgcHVibGljIHNvcnRJbmZvOiBTb3J0W107XHJcbiAgICAvKiogcHJveHkgdXJsICovXHJcbiAgICBwdWJsaWMgcHJveHlVcmw6IHN0cmluZztcclxuICAgIC8qKiByb290IHVybCAqL1xyXG4gICAgcHVibGljIHJvb3RVcmw6IHN0cmluZztcclxuXHJcbiAgICAvKiogc2VsZiB1cmwgKi9cclxuICAgIHB1YmxpYyBzZWxmX3VyaTogc3RyaW5nO1xyXG4gICAgLyoqIG5leHQgcmVzb3VyY2UgdXJsICovXHJcbiAgICBwdWJsaWMgbmV4dF91cmk6IHN0cmluZztcclxuICAgIC8qKiBwcmV2aW91cyByZXNvdXJjZSB1cmwgKi9cclxuICAgIHB1YmxpYyBwcmV2X3VyaTogc3RyaW5nO1xyXG4gICAgLyoqIGZpcnN0IHJlc291cmNlIHVybCAqL1xyXG4gICAgcHVibGljIGZpcnN0X3VyaTogc3RyaW5nO1xyXG4gICAgLyoqIGxhc3QgcmVzb3VyY2UgdXJsICovXHJcbiAgICBwdWJsaWMgbGFzdF91cmk6IHN0cmluZztcclxuXHJcbiAgICAvKiogZW1iZWRkZWQgYXJyYXkgbGlzdCAqL1xyXG4gICAgcHVibGljIF9lbWJlZGRlZDtcclxuXHJcbiAgICAvKiogdG90YWwgbnVtYmVyIG9mIGVsZW1lbnRzIGluIHRoaXMgYXJyYXkgKi9cclxuICAgIHB1YmxpYyB0b3RhbEVsZW1lbnRzID0gMDtcclxuICAgIC8qKiB0b3RhbCBudW1iZXIgb2YgcGFnZXMgaW4gdGhlIHJlc3BvbnNlICovXHJcbiAgICBwdWJsaWMgdG90YWxQYWdlcyA9IDE7XHJcbiAgICBcclxuICAgIC8qKiBwYWdlIG51bWJlciBpbiB0aGUgcmVzcG9uc2UgKi9cclxuICAgIHB1YmxpYyBwYWdlTnVtYmVyID0gMTtcclxuICAgIFxyXG4gICAgLyoqIHBhZ2Ugc2l6ZSAqL1xyXG4gICAgcHVibGljIHBhZ2VTaXplOiBudW1iZXI7XHJcblxyXG4gICAgLyoqIGFycmF5IGNvbXBvbmVudHMgKi9cclxuICAgIHB1YmxpYyByZXN1bHQ6IFRbXSA9IFtdO1xyXG5cclxuICAgIC8qKiBwdXNoIGEgbmV3IHJlc291cmNlIHRvIHRoZSBhcnJheSAqL1xyXG4gICAgcHVzaCA9IChlbDogVCkgPT4ge1xyXG4gICAgICAgIHRoaXMucmVzdWx0LnB1c2goZWwpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKiogbGVuZ3RoIG9mIHRoZSBhcnJheSAqL1xyXG4gICAgbGVuZ3RoID0gKCk6IG51bWJlciA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzdWx0Lmxlbmd0aDtcclxuICAgIH07XHJcblxyXG4gICAgLyoqIGxvYWQgYXJyYXkgZGF0YSBmcm9tIFJFU1QgcmVxdWVzdCAqL1xyXG4gICAgcHJpdmF0ZSBpbml0ID0gKHR5cGU6IHsgbmV3KCk6IFQgfSwgcmVzcG9uc2U6IGFueSwgc29ydEluZm86IFNvcnRbXSk6IFJlc291cmNlQXJyYXk8VD4gPT4ge1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdDogUmVzb3VyY2VBcnJheTxUPiA9IFJlc291cmNlSGVscGVyLmNyZWF0ZUVtcHR5UmVzdWx0PFQ+KHRoaXMuX2VtYmVkZGVkKTtcclxuICAgICAgICByZXN1bHQuc29ydEluZm8gPSBzb3J0SW5mbztcclxuICAgICAgICBSZXNvdXJjZUhlbHBlci5pbnN0YW50aWF0ZVJlc291cmNlQ29sbGVjdGlvbih0eXBlLCByZXNwb25zZSwgcmVzdWx0KTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfTtcclxuXHJcbiAgICAvKiogTG9hZCBuZXh0IHBhZ2UgKi9cclxuICAgIG5leHQgPSAodHlwZTogeyBuZXcoKTogVCB9KTogT2JzZXJ2YWJsZTxSZXNvdXJjZUFycmF5PFQ+PiA9PiB7XHJcbiAgICAgICAgaWYgKHRoaXMubmV4dF91cmkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5nZXQoUmVzb3VyY2VIZWxwZXIuZ2V0UHJveHkodGhpcy5uZXh0X3VyaSksIHtoZWFkZXJzOiBSZXNvdXJjZUhlbHBlci5oZWFkZXJzfSkucGlwZShcclxuICAgICAgICAgICAgICAgIG1hcChyZXNwb25zZSA9PiB0aGlzLmluaXQodHlwZSwgcmVzcG9uc2UsIHRoaXMuc29ydEluZm8pKSxcclxuICAgICAgICAgICAgICAgIGNhdGNoRXJyb3IoZXJyb3IgPT4gb2JzZXJ2YWJsZVRocm93RXJyb3IoZXJyb3IpKSwpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZVRocm93RXJyb3IoJ25vIG5leHQgZGVmaW5lZCcpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKiogTG9hZCBwcmV2aW91cyBwYWdlICovXHJcbiAgICBwcmV2ID0gKHR5cGU6IHsgbmV3KCk6IFQgfSk6IE9ic2VydmFibGU8UmVzb3VyY2VBcnJheTxUPj4gPT4ge1xyXG4gICAgICAgIGlmICh0aGlzLnByZXZfdXJpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkuZ2V0KFJlc291cmNlSGVscGVyLmdldFByb3h5KHRoaXMucHJldl91cmkpLCB7aGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVyc30pLnBpcGUoXHJcbiAgICAgICAgICAgICAgICBtYXAocmVzcG9uc2UgPT4gdGhpcy5pbml0KHR5cGUsIHJlc3BvbnNlLCB0aGlzLnNvcnRJbmZvKSksXHJcbiAgICAgICAgICAgICAgICBjYXRjaEVycm9yKGVycm9yID0+IG9ic2VydmFibGVUaHJvd0Vycm9yKGVycm9yKSksKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG9ic2VydmFibGVUaHJvd0Vycm9yKCdubyBwcmV2IGRlZmluZWQnKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqIExvYWQgZmlyc3QgcGFnZSAqL1xyXG4gICAgZmlyc3QgPSAodHlwZTogeyBuZXcoKTogVCB9KTogT2JzZXJ2YWJsZTxSZXNvdXJjZUFycmF5PFQ+PiA9PiB7XHJcbiAgICAgICAgaWYgKHRoaXMuZmlyc3RfdXJpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkuZ2V0KFJlc291cmNlSGVscGVyLmdldFByb3h5KHRoaXMuZmlyc3RfdXJpKSwge2hlYWRlcnM6IFJlc291cmNlSGVscGVyLmhlYWRlcnN9KS5waXBlKFxyXG4gICAgICAgICAgICAgICAgbWFwKHJlc3BvbnNlID0+IHRoaXMuaW5pdCh0eXBlLCByZXNwb25zZSwgdGhpcy5zb3J0SW5mbykpLFxyXG4gICAgICAgICAgICAgICAgY2F0Y2hFcnJvcihlcnJvciA9PiBvYnNlcnZhYmxlVGhyb3dFcnJvcihlcnJvcikpLCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBvYnNlcnZhYmxlVGhyb3dFcnJvcignbm8gZmlyc3QgZGVmaW5lZCcpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKiogTG9hZCBsYXN0IHBhZ2UgKi9cclxuICAgIGxhc3QgPSAodHlwZTogeyBuZXcoKTogVCB9KTogT2JzZXJ2YWJsZTxSZXNvdXJjZUFycmF5PFQ+PiA9PiB7XHJcbiAgICAgICAgaWYgKHRoaXMubGFzdF91cmkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5nZXQoUmVzb3VyY2VIZWxwZXIuZ2V0UHJveHkodGhpcy5sYXN0X3VyaSksIHtoZWFkZXJzOiBSZXNvdXJjZUhlbHBlci5oZWFkZXJzfSkucGlwZShcclxuICAgICAgICAgICAgICAgIG1hcChyZXNwb25zZSA9PiB0aGlzLmluaXQodHlwZSwgcmVzcG9uc2UsIHRoaXMuc29ydEluZm8pKSxcclxuICAgICAgICAgICAgICAgIGNhdGNoRXJyb3IoZXJyb3IgPT4gb2JzZXJ2YWJsZVRocm93RXJyb3IoZXJyb3IpKSwpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZVRocm93RXJyb3IoJ25vIGxhc3QgZGVmaW5lZCcpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKiogTG9hZCBwYWdlIHdpdGggZ2l2ZW4gcGFnZU51bWJlciovXHJcbiAgICBwYWdlID0gKHR5cGU6IHsgbmV3KCk6IFQgfSwgcGFnZU51bWJlcjogbnVtYmVyKTogT2JzZXJ2YWJsZTxSZXNvdXJjZUFycmF5PFQ+PiA9PiB7XHJcbiAgICAgICAgdGhpcy5zZWxmX3VyaSA9IHRoaXMuc2VsZl91cmkucmVwbGFjZSgnez9wYWdlLHNpemUsc29ydH0nLCAnJyk7XHJcbiAgICAgICAgdGhpcy5zZWxmX3VyaSA9IHRoaXMuc2VsZl91cmkucmVwbGFjZSgneyZzb3J0fScsICcnKTtcclxuICAgICAgICBsZXQgdXJsUGFyc2VkID0gdXJsLnBhcnNlKFJlc291cmNlSGVscGVyLmdldFByb3h5KHRoaXMuc2VsZl91cmkpKTtcclxuICAgICAgICBsZXQgcXVlcnk6IHN0cmluZyA9IFJlc291cmNlQXJyYXkucmVwbGFjZU9yQWRkKHVybFBhcnNlZC5xdWVyeSwgJ3NpemUnLCB0aGlzLnBhZ2VTaXplLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgIHF1ZXJ5ID0gUmVzb3VyY2VBcnJheS5yZXBsYWNlT3JBZGQocXVlcnksICdwYWdlJywgcGFnZU51bWJlci50b1N0cmluZygpKTtcclxuXHJcblxyXG4gICAgICAgIGxldCB1cmkgPSB1cmxQYXJzZWQucXVlcnkgP1xyXG4gICAgICAgICAgICBSZXNvdXJjZUhlbHBlci5nZXRQcm94eSh0aGlzLnNlbGZfdXJpKS5yZXBsYWNlKHVybFBhcnNlZC5xdWVyeSwgcXVlcnkpIDogUmVzb3VyY2VIZWxwZXIuZ2V0UHJveHkodGhpcy5zZWxmX3VyaSkuY29uY2F0KHF1ZXJ5KTtcclxuICAgICAgICB1cmkgPSB0aGlzLmFkZFNvcnRJbmZvKHVyaSk7XHJcbiAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5nZXQodXJpLCB7aGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVyc30pLnBpcGUoXHJcbiAgICAgICAgICAgIG1hcChyZXNwb25zZSA9PiB0aGlzLmluaXQodHlwZSwgcmVzcG9uc2UsIHRoaXMuc29ydEluZm8pKSxcclxuICAgICAgICAgICAgY2F0Y2hFcnJvcihlcnJvciA9PiBvYnNlcnZhYmxlVGhyb3dFcnJvcihlcnJvcikpLCk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKiBTb3J0IGNvbGxlY3Rpb24gYmFzZWQgb24gZ2l2ZW4gc29ydCBhdHRyaWJ1dGUgKi9cclxuICAgIHNvcnRFbGVtZW50cyA9ICh0eXBlOiB7IG5ldygpOiBUIH0sIC4uLnNvcnQ6IFNvcnRbXSk6IE9ic2VydmFibGU8UmVzb3VyY2VBcnJheTxUPj4gPT4ge1xyXG4gICAgICAgIHRoaXMuc2VsZl91cmkgPSB0aGlzLnNlbGZfdXJpLnJlcGxhY2UoJ3s/cGFnZSxzaXplLHNvcnR9JywgJycpO1xyXG4gICAgICAgIHRoaXMuc2VsZl91cmkgPSB0aGlzLnNlbGZfdXJpLnJlcGxhY2UoJ3smc29ydH0nLCAnJyk7XHJcbiAgICAgICAgbGV0IHVyaSA9IFJlc291cmNlSGVscGVyLmdldFByb3h5KHRoaXMuc2VsZl91cmkpLmNvbmNhdCgnPycsICdzaXplPScsIHRoaXMucGFnZVNpemUudG9TdHJpbmcoKSwgJyZwYWdlPScsIHRoaXMucGFnZU51bWJlci50b1N0cmluZygpKTtcclxuICAgICAgICB1cmkgPSB0aGlzLmFkZFNvcnRJbmZvKHVyaSk7XHJcbiAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5nZXQodXJpLCB7aGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVyc30pLnBpcGUoXHJcbiAgICAgICAgICAgIG1hcChyZXNwb25zZSA9PiB0aGlzLmluaXQodHlwZSwgcmVzcG9uc2UsIHNvcnQpKSxcclxuICAgICAgICAgICAgY2F0Y2hFcnJvcihlcnJvciA9PiBvYnNlcnZhYmxlVGhyb3dFcnJvcihlcnJvcikpLCk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKiBMb2FkIHBhZ2Ugd2l0aCBnaXZlbiBzaXplICovXHJcbiAgICBzaXplID0gKHR5cGU6IHsgbmV3KCk6IFQgfSwgc2l6ZTogbnVtYmVyKTogT2JzZXJ2YWJsZTxSZXNvdXJjZUFycmF5PFQ+PiA9PiB7XHJcbiAgICAgICAgbGV0IHVyaSA9IFJlc291cmNlSGVscGVyLmdldFByb3h5KHRoaXMuc2VsZl91cmkpLmNvbmNhdCgnPycsICdzaXplPScsIHNpemUudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgdXJpID0gdGhpcy5hZGRTb3J0SW5mbyh1cmkpO1xyXG4gICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkuZ2V0KHVyaSwge2hlYWRlcnM6IFJlc291cmNlSGVscGVyLmhlYWRlcnN9KS5waXBlKFxyXG4gICAgICAgICAgICBtYXAocmVzcG9uc2UgPT4gdGhpcy5pbml0KHR5cGUsIHJlc3BvbnNlLCB0aGlzLnNvcnRJbmZvKSksXHJcbiAgICAgICAgICAgIGNhdGNoRXJyb3IoZXJyb3IgPT4gb2JzZXJ2YWJsZVRocm93RXJyb3IoZXJyb3IpKSwpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKiogQWRkIHNvcnQgaW5mbyB0byBnaXZlbiBVUkkgKi9cclxuICAgIHByaXZhdGUgYWRkU29ydEluZm8odXJpOiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAodGhpcy5zb3J0SW5mbykge1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgdGhpcy5zb3J0SW5mbykge1xyXG4gICAgICAgICAgICAgICAgdXJpID0gdXJpLmNvbmNhdCgnJnNvcnQ9JywgaXRlbS5wYXRoLCAnLCcsIGl0ZW0ub3JkZXIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB1cmk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEFkZCByZXBsYWNlIG9yIGFkZCBwYXJhbSB2YWx1ZSB0byBxdWVyeSBzdHJpbmcgKi9cclxuICAgIHByaXZhdGUgc3RhdGljIHJlcGxhY2VPckFkZChxdWVyeTogc3RyaW5nLCBmaWVsZDogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICBpZiAocXVlcnkpIHtcclxuICAgICAgICAgICAgbGV0IGlkeDogbnVtYmVyID0gcXVlcnkuaW5kZXhPZihmaWVsZCk7XHJcbiAgICAgICAgICAgIGxldCBpZHhOZXh0QW1wOiBudW1iZXIgPSBxdWVyeS5pbmRleE9mKCcmJywgaWR4KSA9PSAtMSA/IHF1ZXJ5LmluZGV4T2YoJy8nLCBpZHgpIDogcXVlcnkuaW5kZXhPZignJicsIGlkeCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoaWR4ICE9IC0xKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgc2VhY2hWYWx1ZSA9IHF1ZXJ5LnN1YnN0cmluZyhpZHgsIGlkeE5leHRBbXApO1xyXG4gICAgICAgICAgICAgICAgcXVlcnkgPSBxdWVyeS5yZXBsYWNlKHNlYWNoVmFsdWUsIGZpZWxkICsgJz0nICsgdmFsdWUpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcXVlcnkgPSBxdWVyeS5jb25jYXQoXCImXCIgKyBmaWVsZCArICc9JyArIHZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHF1ZXJ5ID0gXCI/XCIgKyBmaWVsZCArICc9JyArIHZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcXVlcnk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHtIdHRwQ2xpZW50LCBIdHRwSGVhZGVycywgSHR0cFBhcmFtc30gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQge1Jlc291cmNlfSBmcm9tICcuL3Jlc291cmNlJztcclxuaW1wb3J0IHtSZXNvdXJjZUFycmF5fSBmcm9tICcuL3Jlc291cmNlLWFycmF5JztcclxuaW1wb3J0IHtIYWxPcHRpb25zfSBmcm9tICcuL3Jlc3Quc2VydmljZSc7XHJcbmltcG9ydCB7U3ViVHlwZUJ1aWxkZXJ9IGZyb20gJy4vc3VidHlwZS1idWlsZGVyJztcclxuaW1wb3J0IHtpc051bGxPclVuZGVmaW5lZCwgaXNQcmltaXRpdmV9IGZyb20gJ3V0aWwnO1xyXG5pbXBvcnQgKiBhcyB1cmwgZnJvbSAndXJsJztcclxuXHJcbi8qKiBSRVNUIEFQSSBhY2Nlc3MgaGVscGVyICovXHJcbmV4cG9ydCBjbGFzcyBSZXNvdXJjZUhlbHBlciB7XHJcblxyXG4gICAgLyoqIEh0dHBIZWFkZXJzICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGhlYWRlcnM6IEh0dHBIZWFkZXJzID0gbmV3IEh0dHBIZWFkZXJzKCk7XHJcbiAgICAvKiogUHJveHkgVVJMICovXHJcbiAgICBwcml2YXRlIHN0YXRpYyBwcm94eV91cmk6IHN0cmluZyA9IG51bGw7XHJcbiAgICAvKiogUm9vdCBVUkwgKi9cclxuICAgIHByaXZhdGUgc3RhdGljIHJvb3RfdXJpOiBzdHJpbmcgPSBudWxsO1xyXG4gICAgLyoqIEh0dHBDbGllbnQgKi9cclxuICAgIHByaXZhdGUgc3RhdGljIGh0dHA6IEh0dHBDbGllbnQgPSBudWxsO1xyXG5cclxuICAgIC8qKiBnZXQgcmVxdWVzdCBoZWFkZXJzICovXHJcbiAgICAvKnB1YmxpYyBzdGF0aWMgZ2V0IGhlYWRlcnMoKTogSHR0cEhlYWRlcnMge1xyXG4gICAgICAgIGlmIChpc051bGxPclVuZGVmaW5lZCh0aGlzLl9oZWFkZXJzKSlcclxuICAgICAgICAgIFJlc291cmNlSGVscGVyLl9oZWFkZXJzID0gbmV3IEh0dHBIZWFkZXJzKCk7XHJcbiAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLl9oZWFkZXJzO1xyXG4gICAgfSovXHJcblxyXG4gICAgLyoqIHNldCByZXF1ZXN0IGhlYWRlcnMgKi9cclxuICAgIC8qcHVibGljIHN0YXRpYyBzZXQgaGVhZGVycyhoZWFkZXJzOiBIdHRwSGVhZGVycykge1xyXG4gICAgICBSZXNvdXJjZUhlbHBlci5faGVhZGVycyA9IGhlYWRlcnM7XHJcbiAgICB9Ki9cclxuXHJcbiAgICAvKiogZ2V0IHJlcXVlc3Qgb3B0aW9uIHBhcmFtcyAqL1xyXG4gICAgc3RhdGljIG9wdGlvblBhcmFtcyhwYXJhbXM6IEh0dHBQYXJhbXMsIG9wdGlvbnM/OiBIYWxPcHRpb25zKTogSHR0cFBhcmFtcyB7XHJcbiAgICAgICAgaWYgKG9wdGlvbnMpIHtcclxuXHJcbiAgICAgICAgICAgIGlmIChvcHRpb25zLnBhcmFtcykge1xyXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBwYXJhbSBvZiBvcHRpb25zLnBhcmFtcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtcyA9IHBhcmFtcy5hcHBlbmQocGFyYW0ua2V5LCBwYXJhbS52YWx1ZS50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKG9wdGlvbnMuc2l6ZSkge1xyXG4gICAgICAgICAgICAgICAgcGFyYW1zID0gcGFyYW1zLmFwcGVuZCgnc2l6ZScsIG9wdGlvbnMuc2l6ZS50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKG9wdGlvbnMuc29ydCkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBzIG9mIG9wdGlvbnMuc29ydCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBzb3J0U3RyaW5nID0gJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgc29ydFN0cmluZyA9IHMucGF0aCA/IHNvcnRTdHJpbmcuY29uY2F0KHMucGF0aCkgOiBzb3J0U3RyaW5nO1xyXG4gICAgICAgICAgICAgICAgICAgIHNvcnRTdHJpbmcgPSBzLm9yZGVyID8gc29ydFN0cmluZy5jb25jYXQoJywnKS5jb25jYXQocy5vcmRlcikgOiBzb3J0U3RyaW5nO1xyXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtcyA9IHBhcmFtcy5hcHBlbmQoJ3NvcnQnLCBzb3J0U3RyaW5nKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHBhcmFtcztcclxuICAgIH1cclxuXHJcbiAgICAvKiogcmVzb2x2ZSByZXNvdXJjZSByZWxhdGlvbnMgKi9cclxuICAgIHN0YXRpYyByZXNvbHZlUmVsYXRpb25zKHJlc291cmNlOiBSZXNvdXJjZSk6IE9iamVjdCB7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0OiBhbnkgPSB7fTtcclxuICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiByZXNvdXJjZSkge1xyXG4gICAgICAgICAgICBpZiAoIWlzTnVsbE9yVW5kZWZpbmVkKHJlc291cmNlW2tleV0pKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoUmVzb3VyY2VIZWxwZXIuY2xhc3NOYW1lKHJlc291cmNlW2tleV0pXHJcbiAgICAgICAgICAgICAgICAgICAgLmZpbmQoKGNsYXNzTmFtZTogc3RyaW5nKSA9PiBjbGFzc05hbWUgPT0gJ1Jlc291cmNlJykpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzb3VyY2Vba2V5XVsnX2xpbmtzJ10pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFtrZXldID0gcmVzb3VyY2Vba2V5XVsnX2xpbmtzJ11bJ3NlbGYnXVsnaHJlZiddO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KHJlc291cmNlW2tleV0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGFycmF5OiBhbnlbXSA9IHJlc291cmNlW2tleV07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFtrZXldID0gbmV3IEFycmF5KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFycmF5LmZvckVhY2goKGVsZW1lbnQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc1ByaW1pdGl2ZShlbGVtZW50KSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFtrZXldLnB1c2goZWxlbWVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRba2V5XS5wdXNoKHRoaXMucmVzb2x2ZVJlbGF0aW9ucyhlbGVtZW50KSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0W2tleV0gPSByZXNvdXJjZVtrZXldO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQgYXMgT2JqZWN0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBjcmVhdGUgYW4gZW1wdHkgcmVzb3VyY2UgZnJvbSBlbWJlZGRlZCBkYXRhKi9cclxuICAgIHN0YXRpYyBjcmVhdGVFbXB0eVJlc3VsdDxUIGV4dGVuZHMgUmVzb3VyY2U+KF9lbWJlZGRlZDogc3RyaW5nKTogUmVzb3VyY2VBcnJheTxUPiB7XHJcbiAgICAgICAgbGV0IHJlc291cmNlQXJyYXk6IFJlc291cmNlQXJyYXk8VD4gPSBuZXcgUmVzb3VyY2VBcnJheTxUPigpO1xyXG4gICAgICAgIHJlc291cmNlQXJyYXkuX2VtYmVkZGVkID0gX2VtYmVkZGVkO1xyXG4gICAgICAgIHJldHVybiByZXNvdXJjZUFycmF5O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgcmVzb3VyY2UgY2xhc3MgbmFtZSovXHJcbiAgICBzdGF0aWMgZ2V0Q2xhc3NOYW1lKG9iajogYW55KTogc3RyaW5nIHtcclxuICAgICAgICB2YXIgZnVuY05hbWVSZWdleCA9IC9mdW5jdGlvbiAoLis/KVxcKC87XHJcbiAgICAgICAgdmFyIHJlc3VsdHMgPSAoZnVuY05hbWVSZWdleCkuZXhlYyhvYmouY29uc3RydWN0b3IudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgcmV0dXJuIChyZXN1bHRzICYmIHJlc3VsdHMubGVuZ3RoID4gMSkgPyByZXN1bHRzWzFdIDogJyc7XHJcbiAgICB9XHJcblxyXG4gICAgXHJcbiAgICAvKiogZ2V0IHJlc291cmNlIGNsYXNzIG5hbWUgZnJvbSBhIHByb3RvdHlwZSBvYmplY3QqL1xyXG4gICAgc3RhdGljIGNsYXNzTmFtZShvYmpQcm90bzogYW55KTogc3RyaW5nW10ge1xyXG4gICAgICAgIGxldCBjbGFzc05hbWVzID0gW107XHJcbiAgICAgICAgbGV0IG9iaiA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmpQcm90byk7XHJcbiAgICAgICAgbGV0IGNsYXNzTmFtZTogc3RyaW5nO1xyXG5cclxuICAgICAgICB3aGlsZSAoKGNsYXNzTmFtZSA9IFJlc291cmNlSGVscGVyLmdldENsYXNzTmFtZShvYmopKSAhPT0gJ09iamVjdCcpIHtcclxuICAgICAgICAgICAgY2xhc3NOYW1lcy5wdXNoKGNsYXNzTmFtZSk7XHJcbiAgICAgICAgICAgIG9iaiA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmopO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGNsYXNzTmFtZXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGluc3RhbnRpYXRlIGEgUmVzb3VyY2VDb2xsZWN0aW9uIGZyb20gcmVzcG9uc2UgZW1iZWRkZWQgZGF0YSovXHJcbiAgICBzdGF0aWMgaW5zdGFudGlhdGVSZXNvdXJjZUNvbGxlY3Rpb248VCBleHRlbmRzIFJlc291cmNlPih0eXBlOiB7IG5ldygpOiBUIH0sIHBheWxvYWQ6IGFueSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdDogUmVzb3VyY2VBcnJheTxUPiwgYnVpbGRlcj86IFN1YlR5cGVCdWlsZGVyLGVtYmVkZGVkTmFtZT86U3RyaW5nKTogUmVzb3VyY2VBcnJheTxUPiB7XHJcbiAgICAgICAgZm9yIChjb25zdCBlbWJlZGRlZENsYXNzTmFtZSBvZiBPYmplY3Qua2V5cyhwYXlsb2FkW3Jlc3VsdC5fZW1iZWRkZWRdKSkge1xyXG4gICAgICAgICAgICBpZighZW1iZWRkZWROYW1lIHx8IChlbWJlZGRlZE5hbWUgJiYgZW1iZWRkZWRDbGFzc05hbWU9PWVtYmVkZGVkTmFtZSkpe1xyXG4gICAgICAgICAgICAgICAgbGV0IGVtYmVkZGVkOiBhbnkgPSBwYXlsb2FkW3Jlc3VsdC5fZW1iZWRkZWRdO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaXRlbXMgPSBlbWJlZGRlZFtlbWJlZGRlZENsYXNzTmFtZV07XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpdGVtIG9mIGl0ZW1zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGluc3RhbmNlOiBUID0gbmV3IHR5cGUoKTtcclxuICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZSA9IHRoaXMuc2VhcmNoU3VidHlwZXMoYnVpbGRlciwgZW1iZWRkZWRDbGFzc05hbWUsIGluc3RhbmNlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbnN0YW50aWF0ZVJlc291cmNlKGluc3RhbmNlLCBpdGVtKTtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaChpbnN0YW5jZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJlc3VsdC50b3RhbEVsZW1lbnRzID0gcGF5bG9hZC5wYWdlID8gcGF5bG9hZC5wYWdlLnRvdGFsRWxlbWVudHMgOiByZXN1bHQubGVuZ3RoO1xyXG4gICAgICAgIHJlc3VsdC50b3RhbFBhZ2VzID0gcGF5bG9hZC5wYWdlID8gcGF5bG9hZC5wYWdlLnRvdGFsUGFnZXMgOiAxO1xyXG4gICAgICAgIHJlc3VsdC5wYWdlTnVtYmVyID0gcGF5bG9hZC5wYWdlID8gcGF5bG9hZC5wYWdlLm51bWJlciA6IDE7XHJcbiAgICAgICAgcmVzdWx0LnBhZ2VTaXplID0gcGF5bG9hZC5wYWdlID8gcGF5bG9hZC5wYWdlLnNpemUgOiAyMDtcclxuXHJcbiAgICAgICAgcmVzdWx0LnNlbGZfdXJpID0gcGF5bG9hZC5fbGlua3MgJiYgcGF5bG9hZC5fbGlua3Muc2VsZiA/IHBheWxvYWQuX2xpbmtzLnNlbGYuaHJlZiA6IHVuZGVmaW5lZDtcclxuICAgICAgICByZXN1bHQubmV4dF91cmkgPSBwYXlsb2FkLl9saW5rcyAmJiBwYXlsb2FkLl9saW5rcy5uZXh0ID8gcGF5bG9hZC5fbGlua3MubmV4dC5ocmVmIDogdW5kZWZpbmVkO1xyXG4gICAgICAgIHJlc3VsdC5wcmV2X3VyaSA9IHBheWxvYWQuX2xpbmtzICYmIHBheWxvYWQuX2xpbmtzLnByZXYgPyBwYXlsb2FkLl9saW5rcy5wcmV2LmhyZWYgOiB1bmRlZmluZWQ7XHJcbiAgICAgICAgcmVzdWx0LmZpcnN0X3VyaSA9IHBheWxvYWQuX2xpbmtzICYmIHBheWxvYWQuX2xpbmtzLmZpcnN0ID8gcGF5bG9hZC5fbGlua3MuZmlyc3QuaHJlZiA6IHVuZGVmaW5lZDtcclxuICAgICAgICByZXN1bHQubGFzdF91cmkgPSBwYXlsb2FkLl9saW5rcyAmJiBwYXlsb2FkLl9saW5rcy5sYXN0ID8gcGF5bG9hZC5fbGlua3MubGFzdC5ocmVmIDogdW5kZWZpbmVkO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHNlYXJjaCBzdWJ0eXBlcyovXHJcbiAgICBzdGF0aWMgc2VhcmNoU3VidHlwZXM8VCBleHRlbmRzIFJlc291cmNlPihidWlsZGVyOiBTdWJUeXBlQnVpbGRlciwgZW1iZWRkZWRDbGFzc05hbWU6IHN0cmluZywgaW5zdGFuY2U6IFQpIHtcclxuICAgICAgICBpZiAoYnVpbGRlciAmJiBidWlsZGVyLnN1YnR5cGVzKSB7XHJcbiAgICAgICAgICAgIGxldCBrZXlzID0gYnVpbGRlci5zdWJ0eXBlcy5rZXlzKCk7XHJcbiAgICAgICAgICAgIEFycmF5LmZyb20oa2V5cykuZm9yRWFjaCgoc3VidHlwZUtleTogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZW1iZWRkZWRDbGFzc05hbWUudG9Mb3dlckNhc2UoKS5zdGFydHNXaXRoKHN1YnR5cGVLZXkudG9Mb3dlckNhc2UoKSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgc3VidHlwZTogeyBuZXcoKTogYW55IH0gPSBidWlsZGVyLnN1YnR5cGVzLmdldChzdWJ0eXBlS2V5KTtcclxuICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZSA9IG5ldyBzdWJ0eXBlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gaW5zdGFuY2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGluc3RhbnRpYXRlIGEgUmVzb3VyY2UgZnJvbSByZXNwb25zZSAqL1xyXG4gICAgc3RhdGljIGluc3RhbnRpYXRlUmVzb3VyY2U8VCBleHRlbmRzIFJlc291cmNlPihlbnRpdHk6IFQsIHBheWxvYWQ6IE9iamVjdCk6IFQge1xyXG4gICAgICAgIGZvciAoY29uc3QgcCBpbiBwYXlsb2FkKSB7XHJcbiAgICAgICAgICAgIC8vVE9ETyBhcnJheSBpbml0XHJcbiAgICAgICAgICAgIC8qIGlmKGVudGl0eVtwXS5jb25zdHJ1Y3RvciA9PT0gQXJyYXkgJiYgaXNOdWxsT3JVbmRlZmluZWQocGF5bG9hZFtwXSkpXHJcbiAgICAgICAgICAgICAgICAgZW50aXR5W3BdID0gW107XHJcbiAgICAgICAgICAgICBlbHNlKi9cclxuICAgICAgICAgICAgZW50aXR5W3BdID0gcGF5bG9hZFtwXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGVudGl0eTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogc2V0IHByb3h5IFVSTCAqL1xyXG4gICAgc3RhdGljIHNldFByb3h5VXJpKHByb3h5X3VyaTogc3RyaW5nKSB7XHJcbiAgICAgICAgUmVzb3VyY2VIZWxwZXIucHJveHlfdXJpID0gcHJveHlfdXJpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBzZXQgUm9vdCBVUkkgKi9cclxuICAgIHN0YXRpYyBzZXRSb290VXJpKHJvb3RfdXJpOiBzdHJpbmcpIHtcclxuICAgICAgICBSZXNvdXJjZUhlbHBlci5yb290X3VyaSA9IHJvb3RfdXJpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgcHJveHkgVVJMICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldFVSTCgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5wcm94eV91cmkgJiYgUmVzb3VyY2VIZWxwZXIucHJveHlfdXJpICE9ICcnID9cclxuICAgICAgICAgICAgUmVzb3VyY2VIZWxwZXIuYWRkU2xhc2goUmVzb3VyY2VIZWxwZXIucHJveHlfdXJpKSA6XHJcbiAgICAgICAgICAgIFJlc291cmNlSGVscGVyLmFkZFNsYXNoKFJlc291cmNlSGVscGVyLnJvb3RfdXJpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogYWRkIHNsYXNoIHRvIFVSSSAqL1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgYWRkU2xhc2godXJpOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgIGxldCB1cmlQYXJzZWQgPSB1cmwucGFyc2UodXJpKTtcclxuICAgICAgICBpZiAoaXNOdWxsT3JVbmRlZmluZWQodXJpUGFyc2VkLnNlYXJjaCkgJiYgdXJpICYmIHVyaVt1cmkubGVuZ3RoIC0gMV0gIT0gJy8nKVxyXG4gICAgICAgICAgICByZXR1cm4gdXJpICsgJy8nO1xyXG4gICAgICAgIHJldHVybiB1cmk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCBwcm94eSBmcm9tIFVSTCAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBnZXRQcm94eSh1cmw6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgaWYgKCFSZXNvdXJjZUhlbHBlci5wcm94eV91cmkgfHwgUmVzb3VyY2VIZWxwZXIucHJveHlfdXJpID09ICcnKVxyXG4gICAgICAgICAgICByZXR1cm4gdXJsO1xyXG4gICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5hZGRTbGFzaCh1cmwucmVwbGFjZShSZXNvdXJjZUhlbHBlci5yb290X3VyaSwgUmVzb3VyY2VIZWxwZXIucHJveHlfdXJpKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHNldCBIdHRwQ2xpZW50Ki9cclxuICAgIHB1YmxpYyBzdGF0aWMgc2V0SHR0cChodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICAgICAgUmVzb3VyY2VIZWxwZXIuaHR0cCA9IGh0dHA7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCBIdHRwQ2xpZW50Ki9cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0SHR0cCgpOiBIdHRwQ2xpZW50IHtcclxuICAgICAgICByZXR1cm4gUmVzb3VyY2VIZWxwZXIuaHR0cDtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHJvb3QgVVJJKi9cclxuICAgIHN0YXRpYyBnZXRSb290VXJpKCkge1xyXG4gICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5yb290X3VyaTtcclxuICAgIH1cclxufVxyXG4iLCJcclxuaW1wb3J0IHt0aHJvd0Vycm9yIGFzIG9ic2VydmFibGVUaHJvd0Vycm9yLCBvZiBhcyBvYnNlcnZhYmxlT2Z9IGZyb20gJ3J4anMnO1xyXG5cclxuaW1wb3J0IHttYXB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuXHJcblxyXG5pbXBvcnQge0h0dHBQYXJhbXN9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHtSZXNvdXJjZUhlbHBlcn0gZnJvbSAnLi9yZXNvdXJjZS1oZWxwZXInO1xyXG5pbXBvcnQge1Jlc291cmNlQXJyYXl9IGZyb20gJy4vcmVzb3VyY2UtYXJyYXknO1xyXG5pbXBvcnQge2lzTnVsbE9yVW5kZWZpbmVkfSBmcm9tICd1dGlsJztcclxuXHJcbmltcG9ydCB7SGFsT3B0aW9uc30gZnJvbSAnLi9yZXN0LnNlcnZpY2UnO1xyXG5pbXBvcnQge1N1YlR5cGVCdWlsZGVyfSBmcm9tICcuL3N1YnR5cGUtYnVpbGRlcic7XHJcbmltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7T2JzZXJ2YWJsZX0gZnJvbSAncnhqcyc7XHJcblxyXG4vKiogQWJzdHJhY3QgcmVzb3VyY2UgY2xhc3MqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBSZXNvdXJjZSB7XHJcblxyXG4gICAgLyoqIHByb3h5IFVSTCAqL1xyXG4gICAgcHVibGljIHByb3h5VXJsOiBzdHJpbmc7XHJcbiAgICAvKiogcm9vdCBVUkwgKi9cclxuICAgIHB1YmxpYyByb290VXJsOiBzdHJpbmc7XHJcblxyXG4gICAgLyoqIGxpbmtzICovXHJcbiAgICBwdWJsaWMgX2xpbmtzOiBhbnk7XHJcbiAgICAvKiogc3VidHlwZXMgKi9cclxuICAgIHB1YmxpYyBfc3VidHlwZXM6IE1hcDxzdHJpbmcsIGFueT47XHJcblxyXG4gICAgXHJcbiAgICAvKiogZ2V0IHN1YnR5cGVzICovICAgIFxyXG4gICAgcHVibGljIGdldCBzdWJ0eXBlcygpOiBNYXA8c3RyaW5nLCBhbnk+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc3VidHlwZXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHNldCBzdWJ0eXBlcyAqL1xyXG4gICAgcHVibGljIHNldCBzdWJ0eXBlcyhfc3VidHlwZXM6IE1hcDxzdHJpbmcsIGFueT4pIHtcclxuICAgICAgICB0aGlzLl9zdWJ0eXBlcyA9IF9zdWJ0eXBlcztcclxuICAgIH1cclxuXHJcbiAgICAvKiogY29uc3RydWN0b3IqL1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEdldCBjb2xsZWN0aW9uIG9mIHJlbGF0ZWQgcmVzb3VyY2VzICovXHJcbiAgICBwdWJsaWMgZ2V0UmVsYXRpb25BcnJheTxUIGV4dGVuZHMgUmVzb3VyY2U+KHR5cGU6IHsgbmV3KCk6IFQgfSwgcmVsYXRpb246IHN0cmluZywgX2VtYmVkZGVkPzogc3RyaW5nLCBvcHRpb25zPzogSGFsT3B0aW9ucywgYnVpbGRlcj86IFN1YlR5cGVCdWlsZGVyKTogT2JzZXJ2YWJsZTxUW10+IHtcclxuXHJcbiAgICAgICAgY29uc3QgcGFyYW1zID0gUmVzb3VyY2VIZWxwZXIub3B0aW9uUGFyYW1zKG5ldyBIdHRwUGFyYW1zKCksIG9wdGlvbnMpO1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdDogUmVzb3VyY2VBcnJheTxUPiA9IFJlc291cmNlSGVscGVyLmNyZWF0ZUVtcHR5UmVzdWx0PFQ+KGlzTnVsbE9yVW5kZWZpbmVkKF9lbWJlZGRlZCkgPyBcIl9lbWJlZGRlZFwiIDogX2VtYmVkZGVkKTtcclxuICAgICAgICBpZiAoIWlzTnVsbE9yVW5kZWZpbmVkKHRoaXMuX2xpbmtzKSAmJiAhaXNOdWxsT3JVbmRlZmluZWQodGhpcy5fbGlua3NbcmVsYXRpb25dKSkge1xyXG4gICAgICAgICAgICBsZXQgb2JzZXJ2YWJsZSA9IFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5nZXQoUmVzb3VyY2VIZWxwZXIuZ2V0UHJveHkodGhpcy5fbGlua3NbcmVsYXRpb25dLmhyZWYpLCB7XHJcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiBSZXNvdXJjZUhlbHBlci5oZWFkZXJzLFxyXG4gICAgICAgICAgICAgICAgcGFyYW1zOiBwYXJhbXNcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiBvYnNlcnZhYmxlLnBpcGUobWFwKHJlc3BvbnNlID0+IFJlc291cmNlSGVscGVyLmluc3RhbnRpYXRlUmVzb3VyY2VDb2xsZWN0aW9uPFQ+KHR5cGUsIHJlc3BvbnNlLCByZXN1bHQsIGJ1aWxkZXIpKSxcclxuICAgICAgICAgICAgICAgIG1hcCgoYXJyYXk6IFJlc291cmNlQXJyYXk8VD4pID0+IGFycmF5LnJlc3VsdCksKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZU9mKFtdKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEdldCByZWxhdGVkIHJlc291cmNlICovXHJcbiAgICBwdWJsaWMgZ2V0UmVsYXRpb248VCBleHRlbmRzIFJlc291cmNlPih0eXBlOiB7IG5ldygpOiBUIH0sIHJlbGF0aW9uOiBzdHJpbmcsIGJ1aWxkZXI/OiBTdWJUeXBlQnVpbGRlcik6IE9ic2VydmFibGU8VD4ge1xyXG4gICAgICAgIGxldCByZXN1bHQ6IFQgPSBuZXcgdHlwZSgpO1xyXG4gICAgICAgIGlmICghaXNOdWxsT3JVbmRlZmluZWQodGhpcy5fbGlua3MpICYmICFpc051bGxPclVuZGVmaW5lZCh0aGlzLl9saW5rc1tyZWxhdGlvbl0pKSB7XHJcbiAgICAgICAgICAgIGxldCBvYnNlcnZhYmxlID0gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLmdldChSZXNvdXJjZUhlbHBlci5nZXRQcm94eSh0aGlzLl9saW5rc1tyZWxhdGlvbl0uaHJlZiksIHtoZWFkZXJzOiBSZXNvdXJjZUhlbHBlci5oZWFkZXJzfSk7XHJcbiAgICAgICAgICAgIHJldHVybiBvYnNlcnZhYmxlLnBpcGUobWFwKChkYXRhOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChidWlsZGVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBlbWJlZGRlZENsYXNzTmFtZSBvZiBPYmplY3Qua2V5cyhkYXRhWydfbGlua3MnXSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVtYmVkZGVkQ2xhc3NOYW1lID09ICdzZWxmJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGhyZWY6IHN0cmluZyA9IGRhdGEuX2xpbmtzW2VtYmVkZGVkQ2xhc3NOYW1lXS5ocmVmO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGlkeDogbnVtYmVyID0gaHJlZi5sYXN0SW5kZXhPZignLycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlYWxDbGFzc05hbWUgPSBocmVmLnJlcGxhY2UoUmVzb3VyY2VIZWxwZXIuZ2V0Um9vdFVyaSgpLCBcIlwiKS5zdWJzdHJpbmcoMCwgaWR4KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IFJlc291cmNlSGVscGVyLnNlYXJjaFN1YnR5cGVzKGJ1aWxkZXIsIHJlYWxDbGFzc05hbWUsIHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5pbnN0YW50aWF0ZVJlc291cmNlKHJlc3VsdCwgZGF0YSk7XHJcbiAgICAgICAgICAgIH0pKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZU9mKG51bGwpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKiogQWRkcyB0aGUgZ2l2ZW4gcmVzb3VyY2UgdG8gdGhlIGJvdW5kIGNvbGxlY3Rpb24gYnkgdGhlIHJlbGF0aW9uICovXHJcbiAgICBwdWJsaWMgYWRkUmVsYXRpb248VCBleHRlbmRzIFJlc291cmNlPihyZWxhdGlvbjogc3RyaW5nLCByZXNvdXJjZTogVCk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICAgICAgaWYgKCFpc051bGxPclVuZGVmaW5lZCh0aGlzLl9saW5rcykgJiYgIWlzTnVsbE9yVW5kZWZpbmVkKHRoaXMuX2xpbmtzW3JlbGF0aW9uXSkpIHtcclxuICAgICAgICAgICAgbGV0IGhlYWRlciA9IFJlc291cmNlSGVscGVyLmhlYWRlcnMuYXBwZW5kKCdDb250ZW50LVR5cGUnLCAndGV4dC91cmktbGlzdCcpO1xyXG4gICAgICAgICAgICByZXR1cm4gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLnBvc3QoUmVzb3VyY2VIZWxwZXIuZ2V0UHJveHkodGhpcy5fbGlua3NbcmVsYXRpb25dLmhyZWYpLCByZXNvdXJjZS5fbGlua3Muc2VsZi5ocmVmLCB7aGVhZGVyczogaGVhZGVyfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIG9ic2VydmFibGVUaHJvd0Vycm9yKCdubyByZWxhdGlvbiBmb3VuZCcpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKiogQmluZCB0aGUgZ2l2ZW4gcmVzb3VyY2UgdG8gdGhpcyByZXNvdXJjZSBieSB0aGUgZ2l2ZW4gcmVsYXRpb24qL1xyXG4gICAgcHVibGljIHVwZGF0ZVJlbGF0aW9uPFQgZXh0ZW5kcyBSZXNvdXJjZT4ocmVsYXRpb246IHN0cmluZywgcmVzb3VyY2U6IFQpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgICAgIGlmICghaXNOdWxsT3JVbmRlZmluZWQodGhpcy5fbGlua3MpICYmICFpc051bGxPclVuZGVmaW5lZCh0aGlzLl9saW5rc1tyZWxhdGlvbl0pKSB7XHJcbiAgICAgICAgICAgIGxldCBoZWFkZXIgPSBSZXNvdXJjZUhlbHBlci5oZWFkZXJzLmFwcGVuZCgnQ29udGVudC1UeXBlJywgJ3RleHQvdXJpLWxpc3QnKTtcclxuICAgICAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5wYXRjaChSZXNvdXJjZUhlbHBlci5nZXRQcm94eSh0aGlzLl9saW5rc1tyZWxhdGlvbl0uaHJlZiksIHJlc291cmNlLl9saW5rcy5zZWxmLmhyZWYsIHtoZWFkZXJzOiBoZWFkZXJ9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZVRocm93RXJyb3IoJ25vIHJlbGF0aW9uIGZvdW5kJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKiBCaW5kIHRoZSBnaXZlbiByZXNvdXJjZSB0byB0aGlzIHJlc291cmNlIGJ5IHRoZSBnaXZlbiByZWxhdGlvbiovXHJcbiAgICBwdWJsaWMgc3Vic3RpdHV0ZVJlbGF0aW9uPFQgZXh0ZW5kcyBSZXNvdXJjZT4ocmVsYXRpb246IHN0cmluZywgcmVzb3VyY2U6IFQpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgICAgIGlmICghaXNOdWxsT3JVbmRlZmluZWQodGhpcy5fbGlua3MpICYmICFpc051bGxPclVuZGVmaW5lZCh0aGlzLl9saW5rc1tyZWxhdGlvbl0pKSB7XHJcbiAgICAgICAgICAgIGxldCBoZWFkZXIgPSBSZXNvdXJjZUhlbHBlci5oZWFkZXJzLmFwcGVuZCgnQ29udGVudC1UeXBlJywgJ3RleHQvdXJpLWxpc3QnKTtcclxuICAgICAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5wdXQoUmVzb3VyY2VIZWxwZXIuZ2V0UHJveHkodGhpcy5fbGlua3NbcmVsYXRpb25dLmhyZWYpLCByZXNvdXJjZS5fbGlua3Muc2VsZi5ocmVmLCB7aGVhZGVyczogaGVhZGVyfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIG9ic2VydmFibGVUaHJvd0Vycm9yKCdubyByZWxhdGlvbiBmb3VuZCcpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgXHJcbiAgICAvKiogQmluZCB0aGUgZ2l2ZW4gcmVzb3VyY2UgdG8gdGhpcyByZXNvdXJjZSBieSB0aGUgZ2l2ZW4gcmVsYXRpb24qL1xyXG4gICAgcHVibGljIHN1YnN0aXR1dGVBbGxSZWxhdGlvbjxUIGV4dGVuZHMgUmVzb3VyY2U+KHJlbGF0aW9uOiBzdHJpbmcsIHJlc291cmNlczogUmVzb3VyY2VbXSk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICAgICAgaWYgKCFpc051bGxPclVuZGVmaW5lZCh0aGlzLl9saW5rcykgJiYgIWlzTnVsbE9yVW5kZWZpbmVkKHRoaXMuX2xpbmtzW3JlbGF0aW9uXSkpIHtcclxuICAgICAgICAgICAgbGV0IGhlYWRlciA9IFJlc291cmNlSGVscGVyLmhlYWRlcnMuYXBwZW5kKCdDb250ZW50LVR5cGUnLCAndGV4dC91cmktbGlzdCcpO1xyXG4gICAgICAgICAgICByZXR1cm4gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLnB1dChSZXNvdXJjZUhlbHBlci5nZXRQcm94eSh0aGlzLl9saW5rc1tyZWxhdGlvbl0uaHJlZiksIHJlc291cmNlcy5tYXAoKHJlc291cmNlKSA9PiByZXNvdXJjZS5fbGlua3Muc2VsZi5ocmVmKSwge2hlYWRlcnM6IGhlYWRlcn0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBvYnNlcnZhYmxlVGhyb3dFcnJvcignbm8gcmVsYXRpb24gZm91bmQnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICAvKiogVW5iaW5kIHRoZSByZXNvdXJjZSB3aXRoIHRoZSBnaXZlbiByZWxhdGlvbiBmcm9tIHRoaXMgcmVzb3VyY2UqL1xyXG4gICAgcHVibGljIGRlbGV0ZVJlbGF0aW9uPFQgZXh0ZW5kcyBSZXNvdXJjZT4ocmVsYXRpb246IHN0cmluZywgcmVzb3VyY2U6IFQpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgICAgIGlmICghaXNOdWxsT3JVbmRlZmluZWQodGhpcy5fbGlua3MpICYmICFpc051bGxPclVuZGVmaW5lZChyZXNvdXJjZS5fbGlua3MpKSB7XHJcbiAgICAgICAgICAgIGxldCBsaW5rOiBzdHJpbmcgPSByZXNvdXJjZS5fbGlua3NbJ3NlbGYnXS5ocmVmO1xyXG4gICAgICAgICAgICBsZXQgaWR4OiBudW1iZXIgPSBsaW5rLmxhc3RJbmRleE9mKCcvJykgKyAxO1xyXG5cclxuICAgICAgICAgICAgaWYgKGlkeCA9PSAtMSlcclxuICAgICAgICAgICAgICAgIHJldHVybiBvYnNlcnZhYmxlVGhyb3dFcnJvcignbm8gcmVsYXRpb24gZm91bmQnKTtcclxuXHJcbiAgICAgICAgICAgIGxldCByZWxhdGlvbklkOiBzdHJpbmcgPSBsaW5rLnN1YnN0cmluZyhpZHgpO1xyXG4gICAgICAgICAgICByZXR1cm4gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLmRlbGV0ZShSZXNvdXJjZUhlbHBlci5nZXRQcm94eSh0aGlzLl9saW5rc1tyZWxhdGlvbl0uaHJlZiArICcvJyArIHJlbGF0aW9uSWQpLCB7aGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVyc30pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBvYnNlcnZhYmxlVGhyb3dFcnJvcignbm8gcmVsYXRpb24gZm91bmQnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKiBVbmJpbmQgdGhlIHJlc291cmNlIHdpdGggdGhlIGdpdmVuIHJlbGF0aW9uIGZyb20gdGhpcyByZXNvdXJjZSovXHJcbiAgICBwdWJsaWMgZGVsZXRlQWxsUmVsYXRpb248VCBleHRlbmRzIFJlc291cmNlPihyZWxhdGlvbjogc3RyaW5nKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgICAgICByZXR1cm4gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLmRlbGV0ZShSZXNvdXJjZUhlbHBlci5nZXRQcm94eSh0aGlzLl9saW5rc1tyZWxhdGlvbl0uaHJlZiApLCB7aGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVyc30pO1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxufSIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG5pbXBvcnQgeyBVc2VyQ29uZmlndXJhdGlvbiB9IGZyb20gJy4vdXNlci1jb25maWd1cmF0aW9uLm1vZGVsJztcclxuaW1wb3J0IHsgVXNlclBvc2l0aW9uIH0gZnJvbSAnLi91c2VyLXBvc2l0aW9uLm1vZGVsJztcclxuXHJcbi8qKlxyXG4gKiBVc2VyIG1vZGVsXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgVXNlciBleHRlbmRzIFJlc291cmNlIHtcclxuICAvKiogaWQgKi9cclxuICBwdWJsaWMgaWQ6IG51bWJlcjsgIFxyXG4gIC8qKiB1c2VybmFtZSAqL1xyXG4gIHB1YmxpYyB1c2VybmFtZTogc3RyaW5nO1xyXG4gIC8qKiBwYXNzd29yZCAqL1xyXG4gIHB1YmxpYyBwYXNzd29yZDogc3RyaW5nO1xyXG4gIC8qKiBmaXJzdCBuYW1lICovXHJcbiAgcHVibGljIGZpcnN0TmFtZTogc3RyaW5nO1xyXG4gIC8qKiBsYXN0IG5hbWUgKi9cclxuICBwdWJsaWMgbGFzdE5hbWU6IHN0cmluZztcclxuICAvKiogd2hldGhlciB1c2VyIGlzIGJsb2NrZWQgKi9cclxuICBwdWJsaWMgYmxvY2tlZDogYm9vbGVhbjtcclxuICAvKiogd2hldGhlciB1c2VyIGlzIGFkbWluaXN0cmF0b3IgKi9cclxuICBwdWJsaWMgYWRtaW5pc3RyYXRvcjogYm9vbGVhbjtcclxuICAvKiogSXMgcGFzc3dvcmRTZXQgKi9cclxuICBwdWJsaWMgcGFzc3dvcmRTZXQ6IGJvb2xlYW47XHJcbiAgLyoqIHVzZXIgcG9zaXRpb25zICovXHJcbiAgcHVibGljIHBvc2l0aW9uczogVXNlclBvc2l0aW9uW107XHJcbiAgLyoqIHVzZXIgcGVybWlzc2lvbnMgKi9cclxuICBwdWJsaWMgcGVybWlzc2lvbnM6IFVzZXJDb25maWd1cmF0aW9uW107XHJcbn1cclxuIiwiaW1wb3J0IHtIdHRwQ2xpZW50fSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7SW5qZWN0LCBJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtSZXNvdXJjZUhlbHBlcn0gZnJvbSAnLi9yZXNvdXJjZS1oZWxwZXInO1xyXG5pbXBvcnQge0V4dGVybmFsQ29uZmlndXJhdGlvbkhhbmRsZXJJbnRlcmZhY2V9IGZyb20gJy4vZXh0ZXJuYWwtY29uZmlndXJhdGlvbi5oYW5kbGVyJztcclxuaW1wb3J0IHtFeHRlcm5hbENvbmZpZ3VyYXRpb259IGZyb20gJy4vRXh0ZXJuYWxDb25maWd1cmF0aW9uJztcclxuXHJcblxyXG4vKiogRXh0ZXJuYWxTZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIEV4dGVybmFsU2VydmljZSB7XHJcblxyXG4gICAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgICBjb25zdHJ1Y3RvcihASW5qZWN0KCdFeHRlcm5hbENvbmZpZ3VyYXRpb25TZXJ2aWNlJykgcHJpdmF0ZSBleHRlcm5hbENvbmZpZ3VyYXRpb25TZXJ2aWNlOiBFeHRlcm5hbENvbmZpZ3VyYXRpb25IYW5kbGVySW50ZXJmYWNlKSB7XHJcbiAgICAgICAgUmVzb3VyY2VIZWxwZXIuc2V0UHJveHlVcmkoZXh0ZXJuYWxDb25maWd1cmF0aW9uU2VydmljZS5nZXRQcm94eVVyaSgpKTtcclxuICAgICAgICBSZXNvdXJjZUhlbHBlci5zZXRSb290VXJpKGV4dGVybmFsQ29uZmlndXJhdGlvblNlcnZpY2UuZ2V0Um9vdFVyaSgpKTtcclxuICAgICAgICBSZXNvdXJjZUhlbHBlci5zZXRIdHRwKGV4dGVybmFsQ29uZmlndXJhdGlvblNlcnZpY2UuZ2V0SHR0cCgpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogdXBkYXRlIEV4dGVybmFsQ29uZmlndXJhdGlvbkhhbmRsZXIgKi9cclxuICAgIHB1YmxpYyB1cGRhdGVFeHRlcm5hbENvbmZpZ3VyYXRpb25IYW5kbGVySW50ZXJmYWNlKGV4dGVybmFsQ29uZmlndXJhdGlvblNlcnZpY2U6IEV4dGVybmFsQ29uZmlndXJhdGlvbkhhbmRsZXJJbnRlcmZhY2UpIHtcclxuXHR0aGlzLmV4dGVybmFsQ29uZmlndXJhdGlvblNlcnZpY2UgPSBleHRlcm5hbENvbmZpZ3VyYXRpb25TZXJ2aWNlO1xyXG5cclxuICAgICAgICBSZXNvdXJjZUhlbHBlci5zZXRQcm94eVVyaShleHRlcm5hbENvbmZpZ3VyYXRpb25TZXJ2aWNlLmdldFByb3h5VXJpKCkpO1xyXG4gICAgICAgIFJlc291cmNlSGVscGVyLnNldFJvb3RVcmkoZXh0ZXJuYWxDb25maWd1cmF0aW9uU2VydmljZS5nZXRSb290VXJpKCkpO1xyXG4gICAgICAgIFJlc291cmNlSGVscGVyLnNldEh0dHAoZXh0ZXJuYWxDb25maWd1cmF0aW9uU2VydmljZS5nZXRIdHRwKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgRXh0ZXJuYWxDb25maWd1cmF0aW9uICovXHJcbiAgICBwdWJsaWMgZ2V0RXh0ZXJuYWxDb25maWd1cmF0aW9uKCk6IEV4dGVybmFsQ29uZmlndXJhdGlvbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZXh0ZXJuYWxDb25maWd1cmF0aW9uU2VydmljZS5nZXRFeHRlcm5hbENvbmZpZ3VyYXRpb24oKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHByb3h5IFVSTCAqL1xyXG4gICAgcHVibGljIGdldFByb3h5VXJpKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZXh0ZXJuYWxDb25maWd1cmF0aW9uU2VydmljZS5nZXRQcm94eVVyaSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgUm9vdCBVUkkgKi9cclxuICAgIHB1YmxpYyBnZXRSb290VXJpKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZXh0ZXJuYWxDb25maWd1cmF0aW9uU2VydmljZS5nZXRSb290VXJpKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCBVUkwgKi9cclxuICAgIHB1YmxpYyBnZXRVUkwoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gUmVzb3VyY2VIZWxwZXIuZ2V0VVJMKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCBIdHRwQ2xpZW50ICovXHJcbiAgICBwdWJsaWMgZ2V0SHR0cCgpOiBIdHRwQ2xpZW50IHtcclxuICAgICAgICByZXR1cm4gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpO1xyXG4gICAgfVxyXG59XHJcbiIsIlxyXG5pbXBvcnQgeyB0aHJvd0Vycm9yIGFzIG9ic2VydmFibGVUaHJvd0Vycm9yIH0gZnJvbSAncnhqcyc7XHJcblxyXG5pbXBvcnQgeyBjYXRjaEVycm9yLCBtYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcbmltcG9ydCB7IFJlc291cmNlIH0gZnJvbSAnLi9yZXNvdXJjZSc7XHJcbmltcG9ydCB7IFJlc291cmNlSGVscGVyIH0gZnJvbSAnLi9yZXNvdXJjZS1oZWxwZXInO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBQYXJhbXMsIEh0dHBSZXNwb25zZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgU29ydCB9IGZyb20gJy4vc29ydCc7XHJcbmltcG9ydCB7IFJlc291cmNlQXJyYXkgfSBmcm9tICcuL3Jlc291cmNlLWFycmF5JztcclxuaW1wb3J0IHsgRXh0ZXJuYWxTZXJ2aWNlIH0gZnJvbSAnLi9leHRlcm5hbC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgSGFsT3B0aW9ucyB9IGZyb20gJy4vcmVzdC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgU3ViVHlwZUJ1aWxkZXIgfSBmcm9tICcuL3N1YnR5cGUtYnVpbGRlcic7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuXHJcbi8qKiBSZXNvdXJjZVNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgUmVzb3VyY2VTZXJ2aWNlIHtcclxuXHJcblxyXG4gICAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGV4dGVybmFsU2VydmljZTogRXh0ZXJuYWxTZXJ2aWNlKSB7IH1cclxuXHJcblxyXG4gICAgLyoqIGdldCBVUkwgKi9cclxuICAgIHByaXZhdGUgc3RhdGljIGdldFVSTCgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5nZXRVUkwoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IGFsbCByZXNvdXJjZXMgZnJvbSBhIGJhc2UgVVJJIG9mIGEgZ2l2ZW4gdHlwZSAqL1xyXG4gICAgcHVibGljIGdldEFsbDxUIGV4dGVuZHMgUmVzb3VyY2U+KHR5cGU6IHsgbmV3KCk6IFQgfSwgcmVzb3VyY2U6IHN0cmluZywgX2VtYmVkZGVkOiBzdHJpbmcsIG9wdGlvbnM/OiBIYWxPcHRpb25zLCBzdWJUeXBlPzogU3ViVHlwZUJ1aWxkZXIsIGVtYmVkZGVkTmFtZT86U3RyaW5nKTogT2JzZXJ2YWJsZTxSZXNvdXJjZUFycmF5PFQ+PiB7XHJcbiAgICAgICAgY29uc3QgdXJpID0gdGhpcy5nZXRSZXNvdXJjZVVybChyZXNvdXJjZSkuY29uY2F0KCc/cHJvamVjdGlvbj12aWV3Jyk7XHJcbiAgICAgICAgY29uc3QgcGFyYW1zID0gUmVzb3VyY2VIZWxwZXIub3B0aW9uUGFyYW1zKG5ldyBIdHRwUGFyYW1zKCksIG9wdGlvbnMpO1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdDogUmVzb3VyY2VBcnJheTxUPiA9IFJlc291cmNlSGVscGVyLmNyZWF0ZUVtcHR5UmVzdWx0PFQ+KF9lbWJlZGRlZCk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0VXJscyhyZXN1bHQpO1xyXG4gICAgICAgIHJlc3VsdC5zb3J0SW5mbyA9IG9wdGlvbnMgPyBvcHRpb25zLnNvcnQgOiB1bmRlZmluZWQ7XHJcbiAgICAgICAgbGV0IG9ic2VydmFibGUgPSBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkuZ2V0KHVyaSwgeyBoZWFkZXJzOiBSZXNvdXJjZUhlbHBlci5oZWFkZXJzLCBwYXJhbXM6IHBhcmFtcyB9KTtcclxuICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZS5waXBlKG1hcChyZXNwb25zZSA9PiBSZXNvdXJjZUhlbHBlci5pbnN0YW50aWF0ZVJlc291cmNlQ29sbGVjdGlvbih0eXBlLCByZXNwb25zZSwgcmVzdWx0LCBzdWJUeXBlLGVtYmVkZGVkTmFtZSkpLFxyXG4gICAgICAgICAgICBjYXRjaEVycm9yKGVycm9yID0+IG9ic2VydmFibGVUaHJvd0Vycm9yKGVycm9yKSkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgcmVzb3VyY2UgZnJvbSBhIGJhc2UgVVJJIGFuZCBhIGdpdmVuIGlkICovXHJcbiAgICBwdWJsaWMgZ2V0PFQgZXh0ZW5kcyBSZXNvdXJjZT4odHlwZTogeyBuZXcoKTogVCB9LCByZXNvdXJjZTogc3RyaW5nLCBpZDogYW55KTogT2JzZXJ2YWJsZTxUPiB7XHJcbiAgICAgICAgY29uc3QgdXJpID0gdGhpcy5nZXRSZXNvdXJjZVVybChyZXNvdXJjZSkuY29uY2F0KCcvJywgaWQsICc/cHJvamVjdGlvbj12aWV3Jyk7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0OiBUID0gbmV3IHR5cGUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRVcmxzUmVzb3VyY2UocmVzdWx0KTtcclxuICAgICAgICBsZXQgb2JzZXJ2YWJsZSA9IFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5nZXQodXJpLCB7IGhlYWRlcnM6IFJlc291cmNlSGVscGVyLmhlYWRlcnMgfSk7XHJcbiAgICAgICAgcmV0dXJuIG9ic2VydmFibGUucGlwZShtYXAoZGF0YSA9PiBSZXNvdXJjZUhlbHBlci5pbnN0YW50aWF0ZVJlc291cmNlKHJlc3VsdCwgZGF0YSkpLFxyXG4gICAgICAgICAgICBjYXRjaEVycm9yKGVycm9yID0+IG9ic2VydmFibGVUaHJvd0Vycm9yKGVycm9yKSkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgcmVzb3VyY2UgZnJvbSBpdHMgc2VsZmxpbmsgKi9cclxuICAgIHB1YmxpYyBnZXRCeVNlbGZMaW5rPFQgZXh0ZW5kcyBSZXNvdXJjZT4odHlwZTogeyBuZXcoKTogVCB9LCByZXNvdXJjZUxpbms6IHN0cmluZyk6IE9ic2VydmFibGU8VD4ge1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdDogVCA9IG5ldyB0eXBlKCk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0VXJsc1Jlc291cmNlKHJlc3VsdCk7XHJcbiAgICAgICAgbGV0IG9ic2VydmFibGUgPSBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkuZ2V0KFJlc291cmNlSGVscGVyLmdldFByb3h5KHJlc291cmNlTGluayksIHsgaGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVycyB9KTtcclxuICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZS5waXBlKG1hcChkYXRhID0+IFJlc291cmNlSGVscGVyLmluc3RhbnRpYXRlUmVzb3VyY2UocmVzdWx0LCBkYXRhKSksXHJcbiAgICAgICAgICAgIGNhdGNoRXJyb3IoZXJyb3IgPT4gb2JzZXJ2YWJsZVRocm93RXJyb3IoZXJyb3IpKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHNlYXJjaCByZXNvdXJjZXMgZnJvbSBhIGdpdmVuIGJhc2UgcGF0aCwgcXVlcnkgYW5kIG9wdGlvbnMgKi9cclxuICAgIHB1YmxpYyBzZWFyY2g8VCBleHRlbmRzIFJlc291cmNlPih0eXBlOiB7IG5ldygpOiBUIH0sIHF1ZXJ5OiBzdHJpbmcsIHJlc291cmNlOiBzdHJpbmcsIF9lbWJlZGRlZDogc3RyaW5nLCBvcHRpb25zPzogSGFsT3B0aW9ucyk6IE9ic2VydmFibGU8UmVzb3VyY2VBcnJheTxUPj4ge1xyXG4gICAgICAgIGNvbnN0IHVyaSA9IHRoaXMuZ2V0UmVzb3VyY2VVcmwocmVzb3VyY2UpLmNvbmNhdCgnL3NlYXJjaC8nLCBxdWVyeSk7XHJcbiAgICAgICAgY29uc3QgcGFyYW1zID0gUmVzb3VyY2VIZWxwZXIub3B0aW9uUGFyYW1zKG5ldyBIdHRwUGFyYW1zKCksIG9wdGlvbnMpO1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdDogUmVzb3VyY2VBcnJheTxUPiA9IFJlc291cmNlSGVscGVyLmNyZWF0ZUVtcHR5UmVzdWx0PFQ+KF9lbWJlZGRlZCk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0VXJscyhyZXN1bHQpO1xyXG4gICAgICAgIGxldCBvYnNlcnZhYmxlID0gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLmdldCh1cmksIHsgaGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVycywgcGFyYW1zOiBwYXJhbXMgfSk7XHJcbiAgICAgICAgcmV0dXJuIG9ic2VydmFibGUucGlwZShtYXAocmVzcG9uc2UgPT4gUmVzb3VyY2VIZWxwZXIuaW5zdGFudGlhdGVSZXNvdXJjZUNvbGxlY3Rpb24odHlwZSwgcmVzcG9uc2UsIHJlc3VsdCkpLFxyXG4gICAgICAgICAgICBjYXRjaEVycm9yKGVycm9yID0+IG9ic2VydmFibGVUaHJvd0Vycm9yKGVycm9yKSkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBzZWFyY2ggYSBzaW5nbGUgcmVzb3VyY2UgZnJvbSBhIGdpdmVuIGJhc2UgcGF0aCwgcXVlcnkgYW5kIG9wdGlvbnMgKi9cclxuICAgIHB1YmxpYyBzZWFyY2hTaW5nbGU8VCBleHRlbmRzIFJlc291cmNlPih0eXBlOiB7IG5ldygpOiBUIH0sIHF1ZXJ5OiBzdHJpbmcsIHJlc291cmNlOiBzdHJpbmcsIG9wdGlvbnM/OiBIYWxPcHRpb25zKTogT2JzZXJ2YWJsZTxUPiB7XHJcbiAgICAgICAgY29uc3QgdXJpID0gdGhpcy5nZXRSZXNvdXJjZVVybChyZXNvdXJjZSkuY29uY2F0KCcvc2VhcmNoLycsIHF1ZXJ5KTtcclxuICAgICAgICBjb25zdCBwYXJhbXMgPSBSZXNvdXJjZUhlbHBlci5vcHRpb25QYXJhbXMobmV3IEh0dHBQYXJhbXMoKSwgb3B0aW9ucyk7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0OiBUID0gbmV3IHR5cGUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRVcmxzUmVzb3VyY2UocmVzdWx0KTtcclxuICAgICAgICBsZXQgb2JzZXJ2YWJsZSA9IFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5nZXQodXJpLCB7IGhlYWRlcnM6IFJlc291cmNlSGVscGVyLmhlYWRlcnMsIHBhcmFtczogcGFyYW1zIH0pO1xyXG4gICAgICAgIHJldHVybiBvYnNlcnZhYmxlLnBpcGUobWFwKHJlc3BvbnNlID0+IFJlc291cmNlSGVscGVyLmluc3RhbnRpYXRlUmVzb3VyY2UocmVzdWx0LCByZXNwb25zZSkpLFxyXG4gICAgICAgICAgICBjYXRjaEVycm9yKGVycm9yID0+IG9ic2VydmFibGVUaHJvd0Vycm9yKGVycm9yKSkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBzZWFyY2ggcmVzb3VyY2VzIGZyb20gYSBnaXZlbiBiYXNlIHBhdGgsIGN1c3RvbSBxdWVyeSBhbmQgb3B0aW9ucyAqL1xyXG4gICAgcHVibGljIGN1c3RvbVF1ZXJ5PFQgZXh0ZW5kcyBSZXNvdXJjZT4odHlwZTogeyBuZXcoKTogVCB9LCBxdWVyeTogc3RyaW5nLCByZXNvdXJjZTogc3RyaW5nLCBfZW1iZWRkZWQ6IHN0cmluZywgb3B0aW9ucz86IEhhbE9wdGlvbnMpOiBPYnNlcnZhYmxlPFJlc291cmNlQXJyYXk8VD4+IHtcclxuICAgICAgICBjb25zdCB1cmkgPSB0aGlzLmdldFJlc291cmNlVXJsKHJlc291cmNlICsgcXVlcnkpO1xyXG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IFJlc291cmNlSGVscGVyLm9wdGlvblBhcmFtcyhuZXcgSHR0cFBhcmFtcygpLCBvcHRpb25zKTtcclxuICAgICAgICBjb25zdCByZXN1bHQ6IFJlc291cmNlQXJyYXk8VD4gPSBSZXNvdXJjZUhlbHBlci5jcmVhdGVFbXB0eVJlc3VsdDxUPihfZW1iZWRkZWQpO1xyXG5cclxuICAgICAgICB0aGlzLnNldFVybHMocmVzdWx0KTtcclxuICAgICAgICBsZXQgb2JzZXJ2YWJsZSA9IFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5nZXQodXJpLCB7IGhlYWRlcnM6IFJlc291cmNlSGVscGVyLmhlYWRlcnMsIHBhcmFtczogcGFyYW1zIH0pO1xyXG4gICAgICAgIHJldHVybiBvYnNlcnZhYmxlLnBpcGUobWFwKHJlc3BvbnNlID0+IFJlc291cmNlSGVscGVyLmluc3RhbnRpYXRlUmVzb3VyY2VDb2xsZWN0aW9uKHR5cGUsIHJlc3BvbnNlLCByZXN1bHQpKSxcclxuICAgICAgICAgICAgY2F0Y2hFcnJvcihlcnJvciA9PiBvYnNlcnZhYmxlVGhyb3dFcnJvcihlcnJvcikpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHJlc291cmNlIGdpdmVuIGEgcmVsYXRpb24gbGluayAqL1xyXG4gICAgcHVibGljIGdldEJ5UmVsYXRpb248VCBleHRlbmRzIFJlc291cmNlPih0eXBlOiB7IG5ldygpOiBUIH0sIHJlc291cmNlTGluazogc3RyaW5nKTogT2JzZXJ2YWJsZTxUPiB7XHJcbiAgICAgICAgbGV0IHJlc3VsdDogVCA9IG5ldyB0eXBlKCk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0VXJsc1Jlc291cmNlKHJlc3VsdCk7XHJcbiAgICAgICAgbGV0IG9ic2VydmFibGUgPSBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkuZ2V0KHJlc291cmNlTGluaywgeyBoZWFkZXJzOiBSZXNvdXJjZUhlbHBlci5oZWFkZXJzIH0pO1xyXG4gICAgICAgIHJldHVybiBvYnNlcnZhYmxlLnBpcGUobWFwKGRhdGEgPT4gUmVzb3VyY2VIZWxwZXIuaW5zdGFudGlhdGVSZXNvdXJjZShyZXN1bHQsIGRhdGEpKSxcclxuICAgICAgICAgICAgY2F0Y2hFcnJvcihlcnJvciA9PiBvYnNlcnZhYmxlVGhyb3dFcnJvcihlcnJvcikpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHJlc291cmNlIGFycmF5IGdpdmVuIGEgcmVsYXRpb24gbGluayAqL1xyXG4gICAgcHVibGljIGdldEJ5UmVsYXRpb25BcnJheTxUIGV4dGVuZHMgUmVzb3VyY2U+KHR5cGU6IHsgbmV3KCk6IFQgfSwgcmVzb3VyY2VMaW5rOiBzdHJpbmcsIF9lbWJlZGRlZDogc3RyaW5nLCBidWlsZGVyPzogU3ViVHlwZUJ1aWxkZXIpOiBPYnNlcnZhYmxlPFJlc291cmNlQXJyYXk8VD4+IHtcclxuICAgICAgICBjb25zdCByZXN1bHQ6IFJlc291cmNlQXJyYXk8VD4gPSBSZXNvdXJjZUhlbHBlci5jcmVhdGVFbXB0eVJlc3VsdDxUPihfZW1iZWRkZWQpO1xyXG5cclxuICAgICAgICB0aGlzLnNldFVybHMocmVzdWx0KTtcclxuICAgICAgICBsZXQgb2JzZXJ2YWJsZSA9IFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5nZXQocmVzb3VyY2VMaW5rLCB7IGhlYWRlcnM6IFJlc291cmNlSGVscGVyLmhlYWRlcnMgfSk7XHJcbiAgICAgICAgcmV0dXJuIG9ic2VydmFibGUucGlwZShtYXAocmVzcG9uc2UgPT4gUmVzb3VyY2VIZWxwZXIuaW5zdGFudGlhdGVSZXNvdXJjZUNvbGxlY3Rpb24odHlwZSwgcmVzcG9uc2UsIHJlc3VsdCwgYnVpbGRlcikpLFxyXG4gICAgICAgICAgICBjYXRjaEVycm9yKGVycm9yID0+IG9ic2VydmFibGVUaHJvd0Vycm9yKGVycm9yKSkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBjb3VudCByZXNvdXJjZXMgZ2l2ZW4gYSBwYXRoICovXHJcbiAgICBwdWJsaWMgY291bnQocmVzb3VyY2U6IHN0cmluZyk6IE9ic2VydmFibGU8bnVtYmVyPiB7XHJcbiAgICAgICAgY29uc3QgdXJpID0gdGhpcy5nZXRSZXNvdXJjZVVybChyZXNvdXJjZSkuY29uY2F0KCcvc2VhcmNoL2NvdW50QWxsJyk7XHJcblxyXG4gICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkuZ2V0KHVyaSwgeyBoZWFkZXJzOiBSZXNvdXJjZUhlbHBlci5oZWFkZXJzLCBvYnNlcnZlOiAnYm9keScgfSkucGlwZShcclxuICAgICAgICAgICAgbWFwKChyZXNwb25zZTogUmVzcG9uc2UpID0+IE51bWJlcihyZXNwb25zZS5ib2R5KSksXHJcbiAgICAgICAgICAgIGNhdGNoRXJyb3IoZXJyb3IgPT4gb2JzZXJ2YWJsZVRocm93RXJyb3IoZXJyb3IpKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGNyZWF0ZSByZXNvdXJjZSBmcm9tIHNlbGYgbGluayBhbmQgZW50aXR5IGRhdGEqL1xyXG4gICAgcHVibGljIGNyZWF0ZTxUIGV4dGVuZHMgUmVzb3VyY2U+KHNlbGZSZXNvdXJjZTogc3RyaW5nLCBlbnRpdHk6IFQpIHtcclxuICAgICAgICBjb25zdCB1cmkgPSBSZXNvdXJjZUhlbHBlci5nZXRVUkwoKSArIHNlbGZSZXNvdXJjZTtcclxuICAgICAgICBjb25zdCBwYXlsb2FkID0gUmVzb3VyY2VIZWxwZXIucmVzb2x2ZVJlbGF0aW9ucyhlbnRpdHkpO1xyXG5cclxuICAgICAgICB0aGlzLnNldFVybHNSZXNvdXJjZShlbnRpdHkpO1xyXG4gICAgICAgIGxldCBvYnNlcnZhYmxlID0gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLnBvc3QodXJpLCBwYXlsb2FkLCB7IGhlYWRlcnM6IFJlc291cmNlSGVscGVyLmhlYWRlcnMsIG9ic2VydmU6ICdyZXNwb25zZScgfSk7XHJcbiAgICAgICAgcmV0dXJuIG9ic2VydmFibGUucGlwZShtYXAoKHJlc3BvbnNlOiBIdHRwUmVzcG9uc2U8c3RyaW5nPikgPT4ge1xyXG4gICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID49IDIwMCAmJiByZXNwb25zZS5zdGF0dXMgPD0gMjA3KVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLmluc3RhbnRpYXRlUmVzb3VyY2UoZW50aXR5LCByZXNwb25zZS5ib2R5KTtcclxuICAgICAgICAgICAgZWxzZSBpZiAocmVzcG9uc2Uuc3RhdHVzID09IDUwMCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGJvZHk6IGFueSA9IHJlc3BvbnNlLmJvZHk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZVRocm93RXJyb3IoYm9keS5lcnJvcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KSwgY2F0Y2hFcnJvcihlcnJvciA9PiBvYnNlcnZhYmxlVGhyb3dFcnJvcihlcnJvcikpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogdXBkYXRlIHJlc291cmNlIGZyb20gYSBnaXZlbiBlbnRpdHkgZGF0YSovXHJcbiAgICBwdWJsaWMgdXBkYXRlPFQgZXh0ZW5kcyBSZXNvdXJjZT4oZW50aXR5OiBUKSB7XHJcbiAgICAgICAgY29uc3QgdXJpID0gUmVzb3VyY2VIZWxwZXIuZ2V0UHJveHkoZW50aXR5Ll9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICAgICAgIGNvbnN0IHBheWxvYWQgPSBSZXNvdXJjZUhlbHBlci5yZXNvbHZlUmVsYXRpb25zKGVudGl0eSk7XHJcbiAgICAgICAgdGhpcy5zZXRVcmxzUmVzb3VyY2UoZW50aXR5KTtcclxuICAgICAgICBsZXQgb2JzZXJ2YWJsZSA9IFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5wdXQodXJpLCBwYXlsb2FkLCB7IGhlYWRlcnM6IFJlc291cmNlSGVscGVyLmhlYWRlcnMsIG9ic2VydmU6ICdyZXNwb25zZScgfSk7XHJcbiAgICAgICAgcmV0dXJuIG9ic2VydmFibGUucGlwZShtYXAoKHJlc3BvbnNlOiBIdHRwUmVzcG9uc2U8c3RyaW5nPikgPT4ge1xyXG4gICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID49IDIwMCAmJiByZXNwb25zZS5zdGF0dXMgPD0gMjA3KVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLmluc3RhbnRpYXRlUmVzb3VyY2UoZW50aXR5LCByZXNwb25zZS5ib2R5KTtcclxuICAgICAgICAgICAgZWxzZSBpZiAocmVzcG9uc2Uuc3RhdHVzID09IDUwMCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGJvZHk6IGFueSA9IHJlc3BvbnNlLmJvZHk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZVRocm93RXJyb3IoYm9keS5lcnJvcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KSwgY2F0Y2hFcnJvcihlcnJvciA9PiBvYnNlcnZhYmxlVGhyb3dFcnJvcihlcnJvcikpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogdXBkYXRlIHJlc291cmNlIGZyb20gYSBnaXZlbiBlbnRpdHkgZGF0YSovXHJcbiAgICBwdWJsaWMgdXBkYXRlQ29sbGVjdGlvbjxUIGV4dGVuZHMgUmVzb3VyY2U+KHJlc291cmNlQXJyYXk6IFJlc291cmNlQXJyYXk8VD4sIHJlc291cmNlTGluazogc3RyaW5nKSB7XHJcbiAgICAgICAgY29uc3QgdXJpID0gUmVzb3VyY2VIZWxwZXIuZ2V0UHJveHkocmVzb3VyY2VMaW5rKTtcclxuICAgICAgICAvL2NvbnN0IHBheWxvYWQgPSBSZXNvdXJjZUhlbHBlci5yZXNvbHZlUmVsYXRpb25zKGVudGl0eSk7XHJcbiAgICAgICAgLy90aGlzLnNldFVybHNSZXNvdXJjZShlbnRpdHkpO1xyXG4gICAgICAgIHZhciBoZWFkZXJzUmVxID0gUmVzb3VyY2VIZWxwZXIuaGVhZGVycztcclxuICAgICAgICBoZWFkZXJzUmVxLnNldChcIkNvbnRlbnQtVHlwZVwiLCBcInRleHQvdXJpLWxpc3RcIik7XHJcbiAgICAgICAgbGV0IG9ic2VydmFibGUgPSBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkucHV0KHVyaSwgcmVzb3VyY2VBcnJheSwgeyBoZWFkZXJzOiBoZWFkZXJzUmVxLCBvYnNlcnZlOiAncmVzcG9uc2UnIH0pO1xyXG4gICAgICAgIHJldHVybiBvYnNlcnZhYmxlLnBpcGUobWFwKChyZXNwb25zZTogSHR0cFJlc3BvbnNlPHN0cmluZz4pID0+IHtcclxuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA+PSAyMDAgJiYgcmVzcG9uc2Uuc3RhdHVzIDw9IDIwNylcclxuICAgICAgICAgICAgICAgIHJldHVybiBcIlwiO1xyXG4gICAgICAgICAgICBlbHNlIGlmIChyZXNwb25zZS5zdGF0dXMgPT0gNTAwKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgYm9keTogYW55ID0gcmVzcG9uc2UuYm9keTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBvYnNlcnZhYmxlVGhyb3dFcnJvcihib2R5LmVycm9yKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pLCBjYXRjaEVycm9yKGVycm9yID0+IG9ic2VydmFibGVUaHJvd0Vycm9yKGVycm9yKSkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBwYXRjaCByZXNvdXJjZSBmcm9tIGEgZ2l2ZW4gZW50aXR5IGRhdGEqL1xyXG4gICAgcHVibGljIHBhdGNoPFQgZXh0ZW5kcyBSZXNvdXJjZT4oZW50aXR5OiBUKSB7XHJcbiAgICAgICAgY29uc3QgdXJpID0gUmVzb3VyY2VIZWxwZXIuZ2V0UHJveHkoZW50aXR5Ll9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICAgICAgIGNvbnN0IHBheWxvYWQgPSBSZXNvdXJjZUhlbHBlci5yZXNvbHZlUmVsYXRpb25zKGVudGl0eSk7XHJcbiAgICAgICAgdGhpcy5zZXRVcmxzUmVzb3VyY2UoZW50aXR5KTtcclxuICAgICAgICBsZXQgb2JzZXJ2YWJsZSA9IFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5wYXRjaCh1cmksIHBheWxvYWQsIHsgaGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVycywgb2JzZXJ2ZTogJ3Jlc3BvbnNlJyB9KTtcclxuICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZS5waXBlKG1hcCgocmVzcG9uc2U6IEh0dHBSZXNwb25zZTxzdHJpbmc+KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPj0gMjAwICYmIHJlc3BvbnNlLnN0YXR1cyA8PSAyMDcpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gUmVzb3VyY2VIZWxwZXIuaW5zdGFudGlhdGVSZXNvdXJjZShlbnRpdHksIHJlc3BvbnNlLmJvZHkpO1xyXG4gICAgICAgICAgICBlbHNlIGlmIChyZXNwb25zZS5zdGF0dXMgPT0gNTAwKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgYm9keTogYW55ID0gcmVzcG9uc2UuYm9keTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBvYnNlcnZhYmxlVGhyb3dFcnJvcihib2R5LmVycm9yKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pLCBjYXRjaEVycm9yKGVycm9yID0+IG9ic2VydmFibGVUaHJvd0Vycm9yKGVycm9yKSkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBkZWxldGUgcmVzb3VyY2UgZnJvbSBhIGdpdmVuIGVudGl0eSBkYXRhKi9cclxuICAgIHB1YmxpYyBkZWxldGU8VCBleHRlbmRzIFJlc291cmNlPihlbnRpdHk6IFQpOiBPYnNlcnZhYmxlPE9iamVjdD4ge1xyXG4gICAgICAgIGNvbnN0IHVyaSA9IFJlc291cmNlSGVscGVyLmdldFByb3h5KGVudGl0eS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgICAgICByZXR1cm4gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLmRlbGV0ZSh1cmksIHsgaGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVycyB9KS5waXBlKGNhdGNoRXJyb3IoZXJyb3IgPT4gb2JzZXJ2YWJsZVRocm93RXJyb3IoZXJyb3IpKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHdoZXRoZXIgYSByZXNvdXJjZSBhcnJheSBoYXMgbmV4dCBwYWdlIG9mIHJlc3VsdHMqL1xyXG4gICAgcHVibGljIGhhc05leHQ8VCBleHRlbmRzIFJlc291cmNlPihyZXNvdXJjZUFycmF5OiBSZXNvdXJjZUFycmF5PFQ+KTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHJlc291cmNlQXJyYXkubmV4dF91cmkgIT0gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiB3aGV0aGVyIGEgcmVzb3VyY2UgYXJyYXkgaGFzIHByZXZpb3VzIHBhZ2Ugb2YgcmVzdWx0cyovXHJcbiAgICBwdWJsaWMgaGFzUHJldjxUIGV4dGVuZHMgUmVzb3VyY2U+KHJlc291cmNlQXJyYXk6IFJlc291cmNlQXJyYXk8VD4pOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gcmVzb3VyY2VBcnJheS5wcmV2X3VyaSAhPSB1bmRlZmluZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHdoZXRoZXIgYSByZXNvdXJjZSBhcnJheSBoYXMgZmlyc3QgcGFnZSBvZiByZXN1bHRzKi9cclxuICAgIHB1YmxpYyBoYXNGaXJzdDxUIGV4dGVuZHMgUmVzb3VyY2U+KHJlc291cmNlQXJyYXk6IFJlc291cmNlQXJyYXk8VD4pOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gcmVzb3VyY2VBcnJheS5maXJzdF91cmkgIT0gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiB3aGV0aGVyIGEgcmVzb3VyY2UgYXJyYXkgaGFzIGxhc3QgcGFnZSBvZiByZXN1bHRzKi9cclxuICAgIHB1YmxpYyBoYXNMYXN0PFQgZXh0ZW5kcyBSZXNvdXJjZT4ocmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPik6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiByZXNvdXJjZUFycmF5Lmxhc3RfdXJpICE9IHVuZGVmaW5lZDtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHJlc291cmNlIGFycmF5IG5leHQgcGFnZSBvZiByZXN1bHRzKi9cclxuICAgIHB1YmxpYyBuZXh0PFQgZXh0ZW5kcyBSZXNvdXJjZT4ocmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPiwgdHlwZTogeyBuZXcoKTogVCB9KTogT2JzZXJ2YWJsZTxSZXNvdXJjZUFycmF5PFQ+PiB7XHJcbiAgICAgICAgcmV0dXJuIHJlc291cmNlQXJyYXkubmV4dCh0eXBlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHJlc291cmNlIGFycmF5IHByZXZpb3VzIHBhZ2Ugb2YgcmVzdWx0cyovXHJcbiAgICBwdWJsaWMgcHJldjxUIGV4dGVuZHMgUmVzb3VyY2U+KHJlc291cmNlQXJyYXk6IFJlc291cmNlQXJyYXk8VD4sIHR5cGU6IHsgbmV3KCk6IFQgfSk6IE9ic2VydmFibGU8UmVzb3VyY2VBcnJheTxUPj4ge1xyXG4gICAgICAgIHJldHVybiByZXNvdXJjZUFycmF5LnByZXYodHlwZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBhcnJheSBmaXJzdCBwYWdlIG9mIHJlc3VsdHMqL1xyXG4gICAgcHVibGljIGZpcnN0PFQgZXh0ZW5kcyBSZXNvdXJjZT4ocmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPiwgdHlwZTogeyBuZXcoKTogVCB9KTogT2JzZXJ2YWJsZTxSZXNvdXJjZUFycmF5PFQ+PiB7XHJcbiAgICAgICAgcmV0dXJuIHJlc291cmNlQXJyYXkuZmlyc3QodHlwZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBhcnJheSBsYXN0IHBhZ2Ugb2YgcmVzdWx0cyovXHJcbiAgICBwdWJsaWMgbGFzdDxUIGV4dGVuZHMgUmVzb3VyY2U+KHJlc291cmNlQXJyYXk6IFJlc291cmNlQXJyYXk8VD4sIHR5cGU6IHsgbmV3KCk6IFQgfSk6IE9ic2VydmFibGU8UmVzb3VyY2VBcnJheTxUPj4ge1xyXG4gICAgICAgIHJldHVybiByZXNvdXJjZUFycmF5Lmxhc3QodHlwZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBhcnJheSBwYWdlIG9mIHJlc3VsdHMgZ2l2ZW4gYSBwYWdlIG51bWJlciovXHJcbiAgICBwdWJsaWMgcGFnZTxUIGV4dGVuZHMgUmVzb3VyY2U+KHJlc291cmNlQXJyYXk6IFJlc291cmNlQXJyYXk8VD4sIHR5cGU6IHsgbmV3KCk6IFQgfSwgaWQ6IG51bWJlcik6IE9ic2VydmFibGU8UmVzb3VyY2VBcnJheTxUPj4ge1xyXG4gICAgICAgIHJldHVybiByZXNvdXJjZUFycmF5LnBhZ2UodHlwZSwgaWQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBzb3J0IHJlc291cmNlIGFycmF5IHdpdGggYSBnaXZlbiBzb3J0aW5nIHBhcmFtcyAqL1xyXG4gICAgcHVibGljIHNvcnRFbGVtZW50czxUIGV4dGVuZHMgUmVzb3VyY2U+KHJlc291cmNlQXJyYXk6IFJlc291cmNlQXJyYXk8VD4sIHR5cGU6IHsgbmV3KCk6IFQgfSwgLi4uc29ydDogU29ydFtdKTogT2JzZXJ2YWJsZTxSZXNvdXJjZUFycmF5PFQ+PiB7XHJcbiAgICAgICAgcmV0dXJuIHJlc291cmNlQXJyYXkuc29ydEVsZW1lbnRzKHR5cGUsIC4uLnNvcnQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgcmVzb3VyY2UgYXJyYXkgc2l6ZSovXHJcbiAgICBwdWJsaWMgc2l6ZTxUIGV4dGVuZHMgUmVzb3VyY2U+KHJlc291cmNlQXJyYXk6IFJlc291cmNlQXJyYXk8VD4sIHR5cGU6IHsgbmV3KCk6IFQgfSwgc2l6ZTogbnVtYmVyKTogT2JzZXJ2YWJsZTxSZXNvdXJjZUFycmF5PFQ+PiB7XHJcbiAgICAgICAgcmV0dXJuIHJlc291cmNlQXJyYXkuc2l6ZSh0eXBlLCBzaXplKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHJlc291cmNlIFVSTCBmcm9tIGEgZ2l2ZW4gcGF0aCovXHJcbiAgICBwdWJsaWMgZ2V0UmVzb3VyY2VVcmwocmVzb3VyY2U/OiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgIGxldCB1cmwgPSBSZXNvdXJjZVNlcnZpY2UuZ2V0VVJMKCk7XHJcbiAgICAgICAgaWYgKCF1cmwuZW5kc1dpdGgoJy8nKSkge1xyXG4gICAgICAgICAgICB1cmwgPSB1cmwuY29uY2F0KCcvJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChyZXNvdXJjZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdXJsLmNvbmNhdChyZXNvdXJjZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB1cmw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHNldCBwcm94eSBhbmQgcm9vdCB1cmxzIG9mIGdpdmVuIHJlc291cmNlIGFycmF5ICovXHJcbiAgICBwcml2YXRlIHNldFVybHM8VCBleHRlbmRzIFJlc291cmNlPihyZXN1bHQ6IFJlc291cmNlQXJyYXk8VD4pIHtcclxuICAgICAgICByZXN1bHQucHJveHlVcmwgPSB0aGlzLmV4dGVybmFsU2VydmljZS5nZXRQcm94eVVyaSgpO1xyXG4gICAgICAgIHJlc3VsdC5yb290VXJsID0gdGhpcy5leHRlcm5hbFNlcnZpY2UuZ2V0Um9vdFVyaSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBzZXQgcHJveHkgYW5kIHJvb3QgdXJscyBvZiBnaXZlbiByZXNvdXJjZSAqL1xyXG4gICAgcHJpdmF0ZSBzZXRVcmxzUmVzb3VyY2U8VCBleHRlbmRzIFJlc291cmNlPihyZXN1bHQ6IFQpIHtcclxuICAgICAgICByZXN1bHQucHJveHlVcmwgPSB0aGlzLmV4dGVybmFsU2VydmljZS5nZXRQcm94eVVyaSgpO1xyXG4gICAgICAgIHJlc3VsdC5yb290VXJsID0gdGhpcy5leHRlcm5hbFNlcnZpY2UuZ2V0Um9vdFVyaSgpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7b2YgYXMgb2JzZXJ2YWJsZU9mLCB0aHJvd0Vycm9yIGFzIG9ic2VydmFibGVUaHJvd0Vycm9yfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHttYXAsIG1lcmdlTWFwfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcbmltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4vcmVzb3VyY2UnO1xyXG5pbXBvcnQge1Jlc291cmNlQXJyYXl9IGZyb20gJy4vcmVzb3VyY2UtYXJyYXknO1xyXG5pbXBvcnQge1NvcnR9IGZyb20gJy4vc29ydCc7XHJcbmltcG9ydCB7UmVzb3VyY2VTZXJ2aWNlfSBmcm9tICcuL3Jlc291cmNlLnNlcnZpY2UnO1xyXG5pbXBvcnQge1N1YlR5cGVCdWlsZGVyfSBmcm9tICcuL3N1YnR5cGUtYnVpbGRlcic7XHJcbmltcG9ydCB7aXNOdWxsT3JVbmRlZmluZWR9IGZyb20gJ3V0aWwnO1xyXG5pbXBvcnQge09ic2VydmFibGV9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge0luamVjdG9yfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xyXG5cclxuLyoqIEhBTCBwYXJhbSBkYXRhIG1vZGVsICovXHJcbmV4cG9ydCB0eXBlIEhhbFBhcmFtID0geyBrZXk6IHN0cmluZywgdmFsdWU6IHN0cmluZyB8IG51bWJlciB8IGJvb2xlYW4gfTtcclxuLyoqIEhBTCBvcHRpb24gZGF0YSBtb2RlbCAqL1xyXG5leHBvcnQgdHlwZSBIYWxPcHRpb25zID0geyBub3RQYWdlZD86IGJvb2xlYW4sIHNpemU/OiBudW1iZXIsIHNvcnQ/OiBTb3J0W10sIHBhcmFtcz86IEhhbFBhcmFtW10gfTtcclxuXHJcbi8qKiBSRVNUIEFQSSBhY2Nlc3MgaW50ZXJmYWNlICovXHJcbmV4cG9ydCBjbGFzcyBSZXN0U2VydmljZTxUIGV4dGVuZHMgUmVzb3VyY2U+IHtcclxuICAgIC8qKiByZXNvdXJjZSB0eXBlICovXHJcbiAgICBwcml2YXRlIHR5cGU6IGFueTtcclxuICAgIC8qKiByZXNvdXJjZSBwYXRoICovXHJcbiAgICBwcml2YXRlIHJlc291cmNlOiBzdHJpbmc7XHJcbiAgICAvKiogcmVzb3VyY2UgYXJyYXkgKi9cclxuICAgIHB1YmxpYyByZXNvdXJjZUFycmF5OiBSZXNvdXJjZUFycmF5PFQ+O1xyXG4gICAgLyoqIHJlc291cmNlIHNlcnZpY2UgKi9cclxuICAgIHB1YmxpYyByZXNvdXJjZVNlcnZpY2U6IFJlc291cmNlU2VydmljZTtcclxuICAgIC8qKiBfZW1iZWRkZWQgZmllbGQgbmFtZSAqL1xyXG4gICAgcHJpdmF0ZSBfZW1iZWRkZWQ6IHN0cmluZyA9ICdfZW1iZWRkZWQnO1xyXG5cclxuICAgIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gICAgY29uc3RydWN0b3IodHlwZTogeyBuZXcoKTogVCB9LFxyXG4gICAgICAgICAgICAgICAgcmVzb3VyY2U6IHN0cmluZyxcclxuICAgICAgICAgICAgICAgIHByaXZhdGUgaW5qZWN0b3I6IEluamVjdG9yLFxyXG4gICAgICAgICAgICAgICAgX2VtYmVkZGVkPzogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy50eXBlID0gdHlwZTtcclxuICAgICAgICB0aGlzLnJlc291cmNlID0gcmVzb3VyY2U7XHJcbiAgICAgICAgdGhpcy5yZXNvdXJjZVNlcnZpY2UgPSBpbmplY3Rvci5nZXQoUmVzb3VyY2VTZXJ2aWNlKTtcclxuICAgICAgICBpZiAoIWlzTnVsbE9yVW5kZWZpbmVkKF9lbWJlZGRlZCkpXHJcbiAgICAgICAgICAgIHRoaXMuX2VtYmVkZGVkID0gX2VtYmVkZGVkO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBlcnJvciBoYW5kbGVyICovXHJcbiAgICBwcm90ZWN0ZWQgaGFuZGxlRXJyb3IoZXJyb3I6IGFueSk6T2JzZXJ2YWJsZTxuZXZlcj4ge1xyXG4gICAgICAgIHJldHVybiBSZXN0U2VydmljZS5oYW5kbGVFcnJvcihlcnJvcik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGVycm9yIGhhbmRsZXIgKi9cclxuICAgIHByb3RlY3RlZCBzdGF0aWMgaGFuZGxlRXJyb3IoZXJyb3I6IGFueSk6T2JzZXJ2YWJsZTxuZXZlcj4ge1xyXG4gICAgICAgIHJldHVybiBvYnNlcnZhYmxlVGhyb3dFcnJvcihlcnJvcik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCBhbGwgcmVzb3VyY2VzIHdpdGggb3B0aW9uYWwgb3B0aW9ucyBhbiBzdWJUeXBlIHBhcmFtcyAqL1xyXG4gICAgcHVibGljIGdldEFsbChvcHRpb25zPzogSGFsT3B0aW9ucywgc3ViVHlwZT86IFN1YlR5cGVCdWlsZGVyLCBlbWJlZGRlZE5hbWU/OlN0cmluZyk6IE9ic2VydmFibGU8VFtdPiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldEFsbCh0aGlzLnR5cGUsIHRoaXMucmVzb3VyY2UsIHRoaXMuX2VtYmVkZGVkLCBvcHRpb25zLCBzdWJUeXBlLGVtYmVkZGVkTmFtZSkucGlwZShcclxuICAgICAgICAgICAgbWVyZ2VNYXAoKHJlc291cmNlQXJyYXk6IFJlc291cmNlQXJyYXk8VD4pID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMubm90UGFnZWQgJiYgIWlzTnVsbE9yVW5kZWZpbmVkKHJlc291cmNlQXJyYXkuZmlyc3RfdXJpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMubm90UGFnZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLnNpemUgPSByZXNvdXJjZUFycmF5LnRvdGFsRWxlbWVudHM7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0QWxsKG9wdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlc291cmNlQXJyYXkgPSByZXNvdXJjZUFycmF5O1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvYnNlcnZhYmxlT2YocmVzb3VyY2VBcnJheS5yZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBmcm9tIGEgZ2l2ZW4gaWQgKi9cclxuICAgIHB1YmxpYyBnZXQoaWQ6IGFueSk6IE9ic2VydmFibGU8VD4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5nZXQodGhpcy50eXBlLCB0aGlzLnJlc291cmNlLCBpZCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBmcm9tIHNlbGYgbGluayAqL1xyXG4gICAgcHVibGljIGdldEJ5U2VsZkxpbmsoc2VsZkxpbms6IHN0cmluZyk6IE9ic2VydmFibGU8VD4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5nZXRCeVNlbGZMaW5rKHRoaXMudHlwZSwgc2VsZkxpbmspO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBzZWFyY2ggcmVzb3VyY2VzIGZyb20gYSBnaXZlbiBxdWVyeSBzdHJpbmcgYW5kIG9wdGlvbmFsIG9wdGlvbnMgcGFyYW1zICovXHJcbiAgICBwdWJsaWMgc2VhcmNoKHF1ZXJ5OiBzdHJpbmcsIG9wdGlvbnM/OiBIYWxPcHRpb25zKTogT2JzZXJ2YWJsZTxUW10+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZVNlcnZpY2Uuc2VhcmNoKHRoaXMudHlwZSwgcXVlcnksIHRoaXMucmVzb3VyY2UsIHRoaXMuX2VtYmVkZGVkLCBvcHRpb25zKS5waXBlKFxyXG4gICAgICAgICAgICBtZXJnZU1hcCgocmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPikgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5ub3RQYWdlZCAmJiAhaXNOdWxsT3JVbmRlZmluZWQocmVzb3VyY2VBcnJheS5maXJzdF91cmkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5ub3RQYWdlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuc2l6ZSA9IHJlc291cmNlQXJyYXkudG90YWxFbGVtZW50cztcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zZWFyY2gocXVlcnksIG9wdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlc291cmNlQXJyYXkgPSByZXNvdXJjZUFycmF5O1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvYnNlcnZhYmxlT2YocmVzb3VyY2VBcnJheS5yZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHNlYXJjaCByZXNvdXJjZSBmcm9tIGEgZ2l2ZW4gcXVlcnkgc3RyaW5nIGFuZCBvcHRpb25hbCBvcHRpb25zIHBhcmFtcyAqL1xyXG4gICAgcHVibGljIHNlYXJjaFNpbmdsZShxdWVyeTogc3RyaW5nLCBvcHRpb25zPzogSGFsT3B0aW9ucyk6IE9ic2VydmFibGU8VD4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5zZWFyY2hTaW5nbGUodGhpcy50eXBlLCBxdWVyeSwgdGhpcy5yZXNvdXJjZSwgb3B0aW9ucyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHNlYXJjaCByZXNvdXJjZXMgZnJvbSBhIGdpdmVuIGN1c3RvbSBxdWVyeSBzdHJpbmcgYW5kIG9wdGlvbmFsIG9wdGlvbnMgcGFyYW1zICovXHJcbiAgICBwdWJsaWMgY3VzdG9tUXVlcnkocXVlcnk6IHN0cmluZywgb3B0aW9ucz86IEhhbE9wdGlvbnMpOiBPYnNlcnZhYmxlPFRbXT4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5jdXN0b21RdWVyeSh0aGlzLnR5cGUsIHF1ZXJ5LCB0aGlzLnJlc291cmNlLCB0aGlzLl9lbWJlZGRlZCwgb3B0aW9ucykucGlwZShcclxuICAgICAgICAgICAgbWVyZ2VNYXAoKHJlc291cmNlQXJyYXk6IFJlc291cmNlQXJyYXk8VD4pID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMubm90UGFnZWQgJiYgIWlzTnVsbE9yVW5kZWZpbmVkKHJlc291cmNlQXJyYXkuZmlyc3RfdXJpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMubm90UGFnZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLnNpemUgPSByZXNvdXJjZUFycmF5LnRvdGFsRWxlbWVudHM7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3VzdG9tUXVlcnkocXVlcnksIG9wdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlc291cmNlQXJyYXkgPSByZXNvdXJjZUFycmF5O1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvYnNlcnZhYmxlT2YocmVzb3VyY2VBcnJheS5yZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KSk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKiBnZXQgcmVzb3VyY2UgYXJyYXkgZ2l2ZW4gYSByZWxhdGlvbiBsaW5rICovXHJcbiAgICBwdWJsaWMgZ2V0QnlSZWxhdGlvbkFycmF5KHJlbGF0aW9uOiBzdHJpbmcsIGJ1aWxkZXI/OiBTdWJUeXBlQnVpbGRlcik6IE9ic2VydmFibGU8VFtdPiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldEJ5UmVsYXRpb25BcnJheSh0aGlzLnR5cGUsIHJlbGF0aW9uLCB0aGlzLl9lbWJlZGRlZCwgYnVpbGRlcikucGlwZShcclxuICAgICAgICAgICAgbWFwKChyZXNvdXJjZUFycmF5OiBSZXNvdXJjZUFycmF5PFQ+KSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlc291cmNlQXJyYXkgPSByZXNvdXJjZUFycmF5O1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc291cmNlQXJyYXkucmVzdWx0O1xyXG4gICAgICAgICAgICB9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBnaXZlbiBhIHJlbGF0aW9uIGxpbmsgKi9cclxuICAgIHB1YmxpYyBnZXRCeVJlbGF0aW9uKHJlbGF0aW9uOiBzdHJpbmcpOiBPYnNlcnZhYmxlPFQ+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0QnlSZWxhdGlvbih0aGlzLnR5cGUsIHJlbGF0aW9uKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogY291bnQgcmVzb3VyY2VzIGdpdmVuIGEgcGF0aCAqL1xyXG4gICAgcHVibGljIGNvdW50KCk6IE9ic2VydmFibGU8bnVtYmVyPiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLmNvdW50KHRoaXMucmVzb3VyY2UpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBjcmVhdGUgcmVzb3VyY2UgZnJvbSBzZWxmIGxpbmsgYW5kIGVudGl0eSBkYXRhKi9cclxuICAgIHB1YmxpYyBjcmVhdGUoZW50aXR5OiBUKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLmNyZWF0ZSh0aGlzLnJlc291cmNlLCBlbnRpdHkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiB1cGRhdGUgcmVzb3VyY2UgZnJvbSBhIGdpdmVuIGVudGl0eSBkYXRhKi9cclxuICAgIHB1YmxpYyB1cGRhdGUoZW50aXR5OiBUKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLnVwZGF0ZShlbnRpdHkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBwYXRjaCByZXNvdXJjZSBmcm9tIGEgZ2l2ZW4gZW50aXR5IGRhdGEqL1xyXG4gICAgcHVibGljIHBhdGNoKGVudGl0eTogVCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5wYXRjaChlbnRpdHkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBkZWxldGUgcmVzb3VyY2UgZnJvbSBhIGdpdmVuIGVudGl0eSBkYXRhKi9cclxuICAgIHB1YmxpYyBkZWxldGUoZW50aXR5OiBUKTogT2JzZXJ2YWJsZTxPYmplY3Q+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZVNlcnZpY2UuZGVsZXRlKGVudGl0eSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCB0b3RhbCBudW1iZXIgb2YgZWxlbWVudHMgb2YgcmVzb3VyY2UgYXJyYXkgKi9cclxuICAgIHB1YmxpYyB0b3RhbEVsZW1lbnQoKTogbnVtYmVyIHtcclxuICAgICAgICBpZiAodGhpcy5yZXNvdXJjZUFycmF5ICYmIHRoaXMucmVzb3VyY2VBcnJheS50b3RhbEVsZW1lbnRzKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZUFycmF5LnRvdGFsRWxlbWVudHM7XHJcbiAgICAgICAgcmV0dXJuIDA7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHdoZXRoZXIgYSByZXNvdXJjZSBhcnJheSBoYXMgZmlyc3QgcGFnZSBvZiByZXN1bHRzKi9cclxuICAgIHB1YmxpYyBoYXNGaXJzdCgpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAodGhpcy5yZXNvdXJjZUFycmF5KVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZVNlcnZpY2UuaGFzRmlyc3QodGhpcy5yZXNvdXJjZUFycmF5KTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHdoZXRoZXIgYSByZXNvdXJjZSBhcnJheSBoYXMgbmV4dCBwYWdlIG9mIHJlc3VsdHMqL1xyXG4gICAgcHVibGljIGhhc05leHQoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKHRoaXMucmVzb3VyY2VBcnJheSlcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLmhhc05leHQodGhpcy5yZXNvdXJjZUFycmF5KTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHdoZXRoZXIgYSByZXNvdXJjZSBhcnJheSBoYXMgcHJldmlvdXMgcGFnZSBvZiByZXN1bHRzKi9cclxuICAgIHB1YmxpYyBoYXNQcmV2KCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICh0aGlzLnJlc291cmNlQXJyYXkpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5oYXNQcmV2KHRoaXMucmVzb3VyY2VBcnJheSk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiB3aGV0aGVyIGEgcmVzb3VyY2UgYXJyYXkgaGFzIGxhc3QgcGFnZSBvZiByZXN1bHRzKi9cclxuICAgIHB1YmxpYyBoYXNMYXN0KCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICh0aGlzLnJlc291cmNlQXJyYXkpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5oYXNMYXN0KHRoaXMucmVzb3VyY2VBcnJheSk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgcmVzb3VyY2UgYXJyYXkgbmV4dCBwYWdlIG9mIHJlc3VsdHMqL1xyXG4gICAgcHVibGljIG5leHQoKTogT2JzZXJ2YWJsZTxUW10+IHtcclxuICAgICAgICBpZiAodGhpcy5yZXNvdXJjZUFycmF5KVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZVNlcnZpY2UubmV4dCh0aGlzLnJlc291cmNlQXJyYXksIHRoaXMudHlwZSkucGlwZShcclxuICAgICAgICAgICAgICAgIG1hcCgocmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVzb3VyY2VBcnJheSA9IHJlc291cmNlQXJyYXk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc291cmNlQXJyYXkucmVzdWx0O1xyXG4gICAgICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgb2JzZXJ2YWJsZVRocm93RXJyb3IoJ25vIHJlc291cmNlQXJyYXkgZm91bmQnKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHJlc291cmNlIGFycmF5IHByZXZpb3VzIHBhZ2Ugb2YgcmVzdWx0cyovXHJcbiAgICBwdWJsaWMgcHJldigpOiBPYnNlcnZhYmxlPFRbXT4ge1xyXG4gICAgICAgIGlmICh0aGlzLnJlc291cmNlQXJyYXkpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5wcmV2KHRoaXMucmVzb3VyY2VBcnJheSwgdGhpcy50eXBlKS5waXBlKFxyXG4gICAgICAgICAgICAgICAgbWFwKChyZXNvdXJjZUFycmF5OiBSZXNvdXJjZUFycmF5PFQ+KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXNvdXJjZUFycmF5ID0gcmVzb3VyY2VBcnJheTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzb3VyY2VBcnJheS5yZXN1bHQ7XHJcbiAgICAgICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBvYnNlcnZhYmxlVGhyb3dFcnJvcignbm8gcmVzb3VyY2VBcnJheSBmb3VuZCcpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgcmVzb3VyY2UgYXJyYXkgZmlyc3QgcGFnZSBvZiByZXN1bHRzKi9cclxuICAgIHB1YmxpYyBmaXJzdCgpOiBPYnNlcnZhYmxlPFRbXT4ge1xyXG4gICAgICAgIGlmICh0aGlzLnJlc291cmNlQXJyYXkpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5maXJzdCh0aGlzLnJlc291cmNlQXJyYXksIHRoaXMudHlwZSlcclxuICAgICAgICAgICAgICAgIC5waXBlKFxyXG4gICAgICAgICAgICAgICAgICAgIG1hcCgocmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlc291cmNlQXJyYXkgPSByZXNvdXJjZUFycmF5O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzb3VyY2VBcnJheS5yZXN1bHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBvYnNlcnZhYmxlVGhyb3dFcnJvcignbm8gcmVzb3VyY2VBcnJheSBmb3VuZCcpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgcmVzb3VyY2UgYXJyYXkgbGFzdCBwYWdlIG9mIHJlc3VsdHMqL1xyXG4gICAgcHVibGljIGxhc3QoKTogT2JzZXJ2YWJsZTxUW10+IHtcclxuICAgICAgICBpZiAodGhpcy5yZXNvdXJjZUFycmF5KVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZVNlcnZpY2UubGFzdCh0aGlzLnJlc291cmNlQXJyYXksIHRoaXMudHlwZSlcclxuICAgICAgICAgICAgICAgIC5waXBlKFxyXG4gICAgICAgICAgICAgICAgICAgIG1hcCgocmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlc291cmNlQXJyYXkgPSByZXNvdXJjZUFycmF5O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzb3VyY2VBcnJheS5yZXN1bHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBvYnNlcnZhYmxlVGhyb3dFcnJvcignbm8gcmVzb3VyY2VBcnJheSBmb3VuZCcpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgcmVzb3VyY2UgYXJyYXkgcGFnZSBvZiByZXN1bHRzIGdpdmVuIGEgcGFnZSBudW1iZXIqL1xyXG4gICAgcHVibGljIHBhZ2UocGFnZU51bWJlcjogbnVtYmVyKTogT2JzZXJ2YWJsZTxUW10+IHtcclxuICAgICAgICBpZiAodGhpcy5yZXNvdXJjZUFycmF5KVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZVNlcnZpY2UucGFnZSh0aGlzLnJlc291cmNlQXJyYXksIHRoaXMudHlwZSwgcGFnZU51bWJlcikucGlwZShcclxuICAgICAgICAgICAgICAgIG1hcCgocmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVzb3VyY2VBcnJheSA9IHJlc291cmNlQXJyYXk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc291cmNlQXJyYXkucmVzdWx0O1xyXG4gICAgICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgb2JzZXJ2YWJsZVRocm93RXJyb3IoJ25vIHJlc291cmNlQXJyYXkgZm91bmQnKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBVc2VyIH0gZnJvbSAnLi4vdXNlci91c2VyLm1vZGVsJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcblxyXG5cclxuLyoqIEFjY291bnQgbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIEFjY291bnRTZXJ2aWNlIGV4dGVuZHMgUmVzdFNlcnZpY2U8VXNlcj4ge1xyXG4gIFxyXG5cclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgQUNDT1VOVF9BUEkgPSAnYWNjb3VudCc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKFVzZXIsIFwiYWNjb3VudFwiLCBpbmplY3Rvcik7XHJcbiAgfVxyXG5cclxuICAvKiogZ2V0IGxvZ2dlZCBpbiB1c2VyIGFjY291bnQqL1xyXG4gIGdldCgpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgcmVzdWx0ID0gdGhpcy5odHRwLmdldCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLkFDQ09VTlRfQVBJKSk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBcclxuICAvKiogc2F2ZSBhY2NvdW50Ki9cclxuICBzYXZlKGl0ZW06IGFueSk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLkFDQ09VTlRfQVBJKSAsIGl0ZW0pO1xyXG5cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG5cclxuICAvKiogY2hhbmdlIGxvZ2dlZCBpbiB1c2VyIGFjY291bnQqLyAgXHJcbiAgY2hhbmdlUGFzc3dvcmQoaXRlbTogYW55KTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuQUNDT1VOVF9BUEkrXCIvY2hhbmdlLXBhc3N3b3JkXCIpICwgaXRlbSk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBcclxufVxyXG4iLCJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGV9IGZyb20gJ3J4anMtY29tcGF0JztcclxuaW1wb3J0IHtSZXNvdXJjZVNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2Uuc2VydmljZSc7XHJcbi8vaW1wb3J0ICogYXMgbW9tZW50IGZyb20gJ21vbWVudCc7XHJcblxyXG4vKiogQXV0aGVudGljYXRpb24gc2VydmljZSovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIEF1dGhTZXJ2aWNlIHtcclxuICAgIFxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBBVVRIX0FQSSA9ICdhdXRoZW50aWNhdGUnO1xyXG5cclxuICAgIC8qKiBjb25zdHJ1Y3RvciovXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQsXHJcbiAgICAgICAgcHJpdmF0ZSByZXNvdXJjZVNlcnZpY2U6IFJlc291cmNlU2VydmljZVxyXG4gICAgKSB7fVxyXG4gICAgXHJcbiAgICAvKiogZ2V0IGN1cnJlbnQgdXNlciBqd3QgdG9rZW4gZnJvbSBzZXNzaW9uIHN0b3JhZ2UqL1xyXG4gICAgZ2V0VG9rZW4oKSB7XHJcbiAgICAgICAgcmV0dXJuICBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdhdXRoZW50aWNhdGlvblRva2VuJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGxvZ2luIG9wZXJhdGlvbiAqL1xyXG4gICAgbG9naW4oY3JlZGVudGlhbHMpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG5cclxuICAgICAgICBjb25zdCBkYXRhID0ge1xyXG4gICAgICAgICAgICB1c2VybmFtZTogY3JlZGVudGlhbHMudXNlcm5hbWUsXHJcbiAgICAgICAgICAgIHBhc3N3b3JkOiBjcmVkZW50aWFscy5wYXNzd29yZFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuQVVUSF9BUEkpLCBkYXRhLCB7b2JzZXJ2ZSA6ICdyZXNwb25zZSd9KS5tYXAoYXV0aGVudGljYXRlU3VjY2Vzcy5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gYXV0aGVudGljYXRlU3VjY2VzcyhyZXNwKSB7XHJcbiAgICAgICAgICAgIGlmIChyZXNwLm9rKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBqd3QgPSByZXNwLmJvZHkuaWRfdG9rZW47XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0b3JlQXV0aGVudGljYXRpb25Ub2tlbihqd3QpO1xyXG4gICAgICAgICAgICAgICAgLy9jb25zdCBleHBpcmVzQXQgPSBtb21lbnQoKS5hZGQoIHJlc3AuaGVhZGVycy5nZXQoJ1Rva2VuLVZhbGlkaXR5JyksJ21pbGlzZWNvbmQnKTtcclxuICAgICAgICAgICAgICAgIC8vc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgnZXhwaXJlc19hdCcsIEpTT04uc3RyaW5naWZ5KGV4cGlyZXNBdC52YWx1ZU9mKCkpKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBqd3Q7XHJcbiAgICAgICAgICAgIH0gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoqIGxvZ2luIG9wZXJhdGlvbiB3aXRoIGp3dCB0b2tlbiAqL1xyXG4gICAgbG9naW5XaXRoVG9rZW4oand0KSB7XHJcbiAgICAgICAgaWYgKGp3dCkge1xyXG4gICAgICAgICAgICB0aGlzLnN0b3JlQXV0aGVudGljYXRpb25Ub2tlbihqd3QpO1xyXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGp3dCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KCdhdXRoLWp3dC1zZXJ2aWNlIFByb21pc2UgcmVqZWN0Jyk7IC8vIFB1dCBhcHByb3ByaWF0ZSBlcnJvciBtZXNzYWdlIGhlcmVcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHN0b3JlIGp3dCB0b2tlbiBpbiBzZXNzaW9uIHN0b3JhZ2UqL1xyXG4gICAgc3RvcmVBdXRoZW50aWNhdGlvblRva2VuKGp3dCkge1xyXG4gICAgICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgnYXV0aGVudGljYXRpb25Ub2tlbicsIGp3dCk7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKiBjaGVjayB3aGV0aGVyIGN1cnJlbnQgdXNlciBpcyBsb2dnZWQgaW4qL1xyXG4gICAgcHVibGljIGlzTG9nZ2VkSW4oKSB7XHJcbiAgICAgICAgLy9yZXR1cm4gbW9tZW50KCkuaXNCZWZvcmUodGhpcy5nZXRFeHBpcmF0aW9uKCkpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmdldFRva2VuKCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKiBjaGVjayB3aGV0aGVyIGN1cnJlbnQgdXNlciBpcyBsb2dnZWQgb3V0Ki9cclxuICAgIGlzTG9nZ2VkT3V0KCkge1xyXG4gICAgICAgIHJldHVybiAhdGhpcy5pc0xvZ2dlZEluKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGxvZ291dCBvcGVyYXRpb24gKi9cclxuICAgIGxvZ291dCgpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG5cclxuICAgICAgICByZXR1cm4gbmV3IE9ic2VydmFibGUoKG9ic2VydmVyKSA9PiB7XHJcbiAgICAgICAgICAgIC8vbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ2F1dGhlbnRpY2F0aW9uVG9rZW4nKTtcclxuICAgICAgICAgICAgc2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbSgnYXV0aGVudGljYXRpb25Ub2tlbicpO1xyXG4gICAgICAgICAgICAvL3Nlc3Npb25TdG9yYWdlLnJlbW92ZUl0ZW0oJ2V4cGlyZXNfYXQnKTtcclxuICAgICAgICAgICAgb2JzZXJ2ZXIuY29tcGxldGUoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgXHJcbn1cclxuIiwiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBIdHRwSW50ZXJjZXB0b3IsIEh0dHBSZXF1ZXN0LCBIdHRwSGFuZGxlciwgSHR0cEV2ZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5cclxuLyoqIEludGVyY2VwdG9yIGZvciBhdXRoZW50aWNhdGlvbiB0b2tlbiBpbiBBUEkgcmVxdWVzdHMgKi9cclxuZXhwb3J0IGNsYXNzIEF1dGhJbnRlcmNlcHRvciBpbXBsZW1lbnRzIEh0dHBJbnRlcmNlcHRvciB7XHJcblxyXG4gICAgLyoqIGNvbnN0cnVjdG9yKi9cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgKSB7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKiByZXF1ZXN0IGhhbmRsZXIgKi9cclxuICAgIGludGVyY2VwdChyZXF1ZXN0OiBIdHRwUmVxdWVzdDxhbnk+LCBuZXh0OiBIdHRwSGFuZGxlcik6IE9ic2VydmFibGU8SHR0cEV2ZW50PGFueT4+IHtcclxuXHJcbiAgICAgICAgY29uc3QgdG9rZW4gPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdhdXRoZW50aWNhdGlvblRva2VuJyk7XHJcbiAgICAgICAgaWYgKCEhdG9rZW4pIHtcclxuICAgICAgICAgICAgcmVxdWVzdCA9IHJlcXVlc3QuY2xvbmUoe1xyXG4gICAgICAgICAgICAgICAgc2V0SGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgICAgIEF1dGhvcml6YXRpb246ICdCZWFyZXIgJyArIHRva2VuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV4dC5oYW5kbGUocmVxdWVzdCk7XHJcbiAgICB9XHJcblxyXG59XHJcbiIsImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgU3ViamVjdCwgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBBY2NvdW50U2VydmljZSB9IGZyb20gJy4uL2FjY291bnQvYWNjb3VudC5zZXJ2aWNlJztcclxuXHJcbi8qKiBQcmluY2lwYWwgc2VydmljZSovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFByaW5jaXBhbCB7XHJcbiAgICBwcml2YXRlIHVzZXJJZGVudGl0eTogYW55O1xyXG4gICAgcHJpdmF0ZSBhdXRoZW50aWNhdGVkID0gZmFsc2U7XHJcbiAgICBwcml2YXRlIGF1dGhlbnRpY2F0aW9uU3RhdGUgPSBuZXcgU3ViamVjdDxhbnk+KCk7XHJcblxyXG4gICAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBwcml2YXRlIGFjY291bnQ6IEFjY291bnRTZXJ2aWNlXHJcbiAgICApIHt9XHJcblxyXG4gICAgLyoqIGF1dGhlbnRpY2F0ZSB3aXRoIGdpdmVuIGlkZW50aXR5Ki9cclxuICAgIGF1dGhlbnRpY2F0ZShpZGVudGl0eSkge1xyXG4gICAgICAgIHRoaXMudXNlcklkZW50aXR5ID0gaWRlbnRpdHk7XHJcbiAgICAgICAgdGhpcy5hdXRoZW50aWNhdGVkID0gaWRlbnRpdHkgIT09IG51bGw7XHJcbiAgICAgICAgdGhpcy5hdXRoZW50aWNhdGlvblN0YXRlLm5leHQodGhpcy51c2VySWRlbnRpdHkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBjaGVjayB3aGV0aGVyIGN1cnJlbnQgdXNlciBoYXMgYW55IG9mIHRoZSBnaXZlbiBhdXRob3JpdGllcyAqL1xyXG4gICAgaGFzQW55QXV0aG9yaXR5KGF1dGhvcml0aWVzOiBzdHJpbmdbXSk6IFByb21pc2U8Ym9vbGVhbj4ge1xyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5oYXNBbnlBdXRob3JpdHlEaXJlY3QoYXV0aG9yaXRpZXMpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogY2hlY2sgd2hldGhlciBjdXJyZW50IHVzZXIgaGFzIGFueSBvZiB0aGUgZ2l2ZW4gYXV0aG9yaXRpZXMgb24gdGhlIGdpdmVuIHRlcnJpdG9yeSAqL1xyXG4gICAgaGFzQW55QXV0aG9yaXR5T25UZXJyaXRvcnkoYXV0aG9yaXRpZXM6IHN0cmluZ1tdLHRlcnJpdG9yeTogc3RyaW5nICk6IFByb21pc2U8Ym9vbGVhbj4ge1xyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5oYXNBbnlBdXRob3JpdHlEaXJlY3RPblRlcnJpdG9yeShhdXRob3JpdGllcyx0ZXJyaXRvcnkpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogY2hlY2sgd2hldGhlciBjdXJyZW50IHVzZXIgaGFzIGFueSBvZiB0aGUgZ2l2ZW4gYXV0aG9yaXRpZXMgd2l0aG91dCByZXNvbHZpbmcgcHJvbWlzZXMqL1xyXG4gICAgaGFzQW55QXV0aG9yaXR5RGlyZWN0KGF1dGhvcml0aWVzOiBzdHJpbmdbXSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICghdGhpcy5hdXRoZW50aWNhdGVkIHx8ICF0aGlzLnVzZXJJZGVudGl0eSB8fCAhdGhpcy51c2VySWRlbnRpdHkuYXV0aG9yaXRpZXMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhdXRob3JpdGllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy51c2VySWRlbnRpdHkuYXV0aG9yaXRpZXMuaW5jbHVkZXMoYXV0aG9yaXRpZXNbaV0pKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBjaGVjayB3aGV0aGVyIGN1cnJlbnQgdXNlciBoYXMgYW55IG9mIHRoZSBnaXZlbiBhdXRob3JpdGllcyBvbiB0aGUgZ2l2ZW4gdGVycml0b3J5IHdpdGhvdXQgcmVzb2x2aW5nIHByb21pc2VzICovXHJcbiAgICBoYXNBbnlBdXRob3JpdHlEaXJlY3RPblRlcnJpdG9yeShhdXRob3JpdGllczogc3RyaW5nW10sdGVycml0b3J5OiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAoIXRoaXMuYXV0aGVudGljYXRlZCB8fCAhdGhpcy51c2VySWRlbnRpdHkgfHwgIXRoaXMudXNlcklkZW50aXR5LmF1dGhvcml0aWVzKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXV0aG9yaXRpZXMubGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnVzZXJJZGVudGl0eS5hdXRob3JpdGllc1BlclRlcnJpdG9yeVt0ZXJyaXRvcnldICYmIHRoaXMudXNlcklkZW50aXR5LmF1dGhvcml0aWVzUGVyVGVycml0b3J5W3RlcnJpdG9yeV0uaW5jbHVkZXMoYXV0aG9yaXRpZXNbaV0pKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBjaGVjayB3aGV0aGVyIGN1cnJlbnQgdXNlciBoYXMgdGhlIGdpdmVuIGF1dGhvcml0eSAqL1xyXG4gICAgaGFzQXV0aG9yaXR5KGF1dGhvcml0eTogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPiB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmF1dGhlbnRpY2F0ZWQpIHtcclxuICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGZhbHNlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmlkZW50aXR5KCkudGhlbigoaWQpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShpZC5hdXRob3JpdGllcyAmJiBpZC5hdXRob3JpdGllcy5pbmNsdWRlcyhhdXRob3JpdHkpKTtcclxuICAgICAgICB9LCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoZmFsc2UpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBjaGVjayB3aGV0aGVyIGN1cnJlbnQgdXNlciBoYXMgdGhlIGdpdmVuIGF1dGhvcml0eSBvbiB0aGUgZ2l2ZW4gdGVycml0b3J5Ki9cclxuICAgIGhhc0F1dGhvcml0eU9uVGVycml0b3J5KGF1dGhvcml0eTogc3RyaW5nLHRlcnJpdG9yeTogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPiB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmF1dGhlbnRpY2F0ZWQpIHtcclxuICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGZhbHNlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmlkZW50aXR5KCkudGhlbigoaWQpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShpZC5hdXRob3JpdGllc1BlclRlcnJpdG9yeSAmJiBpZC5hdXRob3JpdGllc1BlclRlcnJpdG9yeVt0ZXJyaXRvcnldICYmIGlkLmF1dGhvcml0aWVzUGVyVGVycml0b3J5W3RlcnJpdG9yeV0uaW5jbHVkZXMoYXV0aG9yaXR5KSk7XHJcbiAgICAgICAgfSwgKCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGZhbHNlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogY2hlY2sgdXNlciBpZGVudGl0eSovXHJcbiAgICBpZGVudGl0eShmb3JjZT86IGJvb2xlYW4pOiBQcm9taXNlPGFueT4ge1xyXG4gICAgICAgIGlmIChmb3JjZSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLnVzZXJJZGVudGl0eSA9IHVuZGVmaW5lZDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGNoZWNrIGFuZCBzZWUgaWYgd2UgaGF2ZSByZXRyaWV2ZWQgdGhlIHVzZXJJZGVudGl0eSBkYXRhIGZyb20gdGhlIHNlcnZlci5cclxuICAgICAgICAvLyBpZiB3ZSBoYXZlLCByZXVzZSBpdCBieSBpbW1lZGlhdGVseSByZXNvbHZpbmdcclxuICAgICAgICBpZiAodGhpcy51c2VySWRlbnRpdHkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzLnVzZXJJZGVudGl0eSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyByZXRyaWV2ZSB0aGUgdXNlcklkZW50aXR5IGRhdGEgZnJvbSB0aGUgc2VydmVyLCB1cGRhdGUgdGhlIGlkZW50aXR5IG9iamVjdCwgYW5kIHRoZW4gcmVzb2x2ZS5cclxuICAgICAgICByZXR1cm4gdGhpcy5hY2NvdW50LmdldCgpLnRvUHJvbWlzZSgpLnRoZW4oKHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGFjY291bnQgPSByZXNwb25zZTtcclxuICAgICAgICAgICAgaWYgKGFjY291bnQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudXNlcklkZW50aXR5ID0gYWNjb3VudDtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXV0aGVudGljYXRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVzZXJJZGVudGl0eSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmF1dGhlbnRpY2F0ZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmF1dGhlbnRpY2F0aW9uU3RhdGUubmV4dCh0aGlzLnVzZXJJZGVudGl0eSk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnVzZXJJZGVudGl0eTtcclxuICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMudXNlcklkZW50aXR5ID0gbnVsbDtcclxuICAgICAgICAgICAgdGhpcy5hdXRoZW50aWNhdGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMuYXV0aGVudGljYXRpb25TdGF0ZS5uZXh0KHRoaXMudXNlcklkZW50aXR5KTtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGNoZWNrIHdoZXRoZXIgY3VycmVudCB1c2VyIGlzIGF1dGhlbnRpY2F0ZWQgKi9cclxuICAgIGlzQXV0aGVudGljYXRlZCgpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hdXRoZW50aWNhdGVkO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBjaGVjayB3aGV0aGVyIGN1cnJlbnQgdXNlciBpZGVudGl0eSBpcyByZXNvbHZlZCAqL1xyXG4gICAgaXNJZGVudGl0eVJlc29sdmVkKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnVzZXJJZGVudGl0eSAhPT0gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgY3VycmVudCB1c2VyIGF1dGhlbnRpY2F0aW9uIHN0YXRlICovXHJcbiAgICBnZXRBdXRoZW50aWNhdGlvblN0YXRlKCk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXV0aGVudGljYXRpb25TdGF0ZS5hc09ic2VydmFibGUoKTtcclxuICAgIH1cclxuXHJcblxyXG59XHJcbiIsImltcG9ydCB7IEluamVjdG9yLCBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBJbnRlcmNlcHRvciwgSHR0cFJlcXVlc3QsIEh0dHBIYW5kbGVyLCBIdHRwRXZlbnQsIEh0dHBFcnJvclJlc3BvbnNlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IEF1dGhTZXJ2aWNlIH0gZnJvbSAnLi9hdXRoLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBBY3RpdmF0ZWRSb3V0ZSwgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcclxuaW1wb3J0IHsgUHJpbmNpcGFsIH0gZnJvbSAnLi9wcmluY2lwYWwuc2VydmljZSc7XHJcblxyXG4vKiogSW50ZXJjZXB0b3IgZm9yIGF1dGhlbnRpY2F0aW9uIGV4cGlyZWQgcmVzcG9uc2UgaW4gQVBJIHJlcXVlc3RzICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIEF1dGhFeHBpcmVkSW50ZXJjZXB0b3IgaW1wbGVtZW50cyBIdHRwSW50ZXJjZXB0b3Ige1xyXG5cclxuICAgIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgcHJpdmF0ZSByb3V0ZXI6IFJvdXRlciwgICAgIFxyXG4gICAgICAgIHByaXZhdGUgYXV0aFNlcnZpY2U6IEF1dGhTZXJ2aWNlLCBcclxuICAgICAgICBwcml2YXRlIHByaW5jaXBhbDogUHJpbmNpcGFsXHJcbiAgICApIHt9XHJcblxyXG4gICAgLyoqIHJlcXVlc3QgaGFuZGxlciAqL1xyXG4gICAgaW50ZXJjZXB0KHJlcXVlc3Q6IEh0dHBSZXF1ZXN0PGFueT4sIG5leHQ6IEh0dHBIYW5kbGVyKTogT2JzZXJ2YWJsZTxIdHRwRXZlbnQ8YW55Pj4ge1xyXG4gICAgICAgIHJldHVybiBuZXh0LmhhbmRsZShyZXF1ZXN0KS5kbygoZXZlbnQ6IEh0dHBFdmVudDxhbnk+KSA9PiB7fSwgKGVycjogYW55KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGludGVyY2VwdDogYm9vbGVhbiA9IHJlcXVlc3QudXJsLmluZGV4T2YoXCIvYXBpL1wiKSAhPSAtMTtcclxuICAgICAgICAgICAgLy90cmFjdGVtIHJlcXVlc3RcclxuICAgICAgICAgICAgaWYgKGludGVyY2VwdCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGVyciBpbnN0YW5jZW9mIEh0dHBFcnJvclJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVyci5zdGF0dXMgPT09IDQwMSkgeyAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYXV0aFNlcnZpY2UubG9nb3V0KCkuc3Vic2NyaWJlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJpbmNpcGFsLmF1dGhlbnRpY2F0ZShudWxsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoWycvJ10pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQXV0aFNlcnZpY2UgfSBmcm9tICcuL2F1dGguc2VydmljZSc7XHJcbmltcG9ydCB7IFByaW5jaXBhbCB9IGZyb20gJy4vcHJpbmNpcGFsLnNlcnZpY2UnO1xyXG5cclxuLyoqIExvZ2luIHNlcnZpY2UqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBMb2dpblNlcnZpY2Uge1xyXG4gICAgXHJcbiAgICAvKiogY29uc3RydWN0b3IgKi9cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHByaXZhdGUgYXV0aFNlcnZlclByb3ZpZGVyOiBBdXRoU2VydmljZSwgXHJcbiAgICAgICAgcHJpdmF0ZSBwcmluY2lwYWw6IFByaW5jaXBhbFxyXG4gICAgKSB7fVxyXG5cclxuICAgIC8qKkxvZ2luIG9wZXJhdGlvbiovXHJcbiAgICBsb2dpbihjcmVkZW50aWFscywgY2FsbGJhY2s/KSB7XHJcbiAgICAgICAgY29uc3QgY2IgPSBjYWxsYmFjayB8fCBmdW5jdGlvbigpIHt9O1xyXG5cclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmF1dGhTZXJ2ZXJQcm92aWRlci5sb2dpbihjcmVkZW50aWFscykuc3Vic2NyaWJlKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnByaW5jaXBhbC5pZGVudGl0eSh0cnVlKS50aGVuKChhY2NvdW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gQWZ0ZXIgdGhlIGxvZ2luIHRoZSBsYW5ndWFnZSB3aWxsIGJlIGNoYW5nZWQgdG9cclxuICAgICAgICAgICAgICAgICAgICAvLyB0aGUgbGFuZ3VhZ2Ugc2VsZWN0ZWQgYnkgdGhlIHVzZXIgZHVyaW5nIGhpcyByZWdpc3RyYXRpb25cclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNiKCk7XHJcbiAgICAgICAgICAgIH0sIChlcnIpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9nb3V0KCk7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjYihlcnIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIC8qKmxvZ2luIHdpdGggand0IHRva2VuICovXHJcbiAgICBsb2dpbldpdGhUb2tlbihqd3QpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hdXRoU2VydmVyUHJvdmlkZXIubG9naW5XaXRoVG9rZW4oand0KTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogbG9nb3V0IG9wZXJhdGlvbiAqL1xyXG4gICAgbG9nb3V0KCkge1xyXG4gICAgICAgdGhpcy5hdXRoU2VydmVyUHJvdmlkZXIubG9nb3V0KCkuc3Vic2NyaWJlKCk7XHJcbiAgICAgICB0aGlzLnByaW5jaXBhbC5hdXRoZW50aWNhdGUobnVsbCk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge1Jlc291cmNlU2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZS5zZXJ2aWNlJztcclxuXHJcbkBJbmplY3RhYmxlKHtcclxuICBwcm92aWRlZEluOiAncm9vdCdcclxufSlcclxuZXhwb3J0IGNsYXNzIERhc2hib2FyZFNlcnZpY2V7XHJcblxyXG4gICAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgICBwdWJsaWMgREFTSEJPQVJEX0FQSSA9ICdkYXNoYm9hcmQvaW5mbyc7XHJcbiAgICBwdWJsaWMgREFTSEJPQVJEX0VNQkVEREVEPSAnZGFzaGJvYXJkJztcclxuICAgIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gICAgY29uc3RydWN0b3IoICAgICAgIFxyXG4gICAgICBwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQsXHJcbiAgICAgIHByaXZhdGUgcmVzb3VyY2VTZXJ2aWNlOiBSZXNvdXJjZVNlcnZpY2UpIHtcclxuICAgIH1cclxuICBcclxuICAgIC8qKiBnZXQgYWxsIGtwaSAqL1xyXG4gICAgZ2V0QWxsKCk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuREFTSEJPQVJEX0FQSSkpLm1hcChyZXNwb25zZSA9PiByZXNwb25zZVt0aGlzLkRBU0hCT0FSRF9FTUJFRERFRF0pO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgVXNlciB9IGZyb20gJy4vdXNlci5tb2RlbCc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuXHJcbi8qKiBVc2VyIG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBVc2VyU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPFVzZXI+IHtcclxuICBcclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgVVNFUl9BUEkgPSd1c2Vycyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKFVzZXIsIFwidXNlcnNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIHVzZXIqL1xyXG4gIHJlbW92ZShpdGVtOiBVc2VyKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgdXNlciovXHJcbiAgc2F2ZShpdGVtOiBhbnkpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuVVNFUl9BUEkpICwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICAgIFxyXG4gIC8qKiBjaGFuZ2UgcGFzc3dvcmQgbyBnaXZlbiB1c2VyIGlkICovXHJcbiAgY2hhbmdlUGFzc3dvcmQoaWQsaXRlbTogYW55KTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuVVNFUl9BUEkrXCIvXCIraWQrXCIvY2hhbmdlLXBhc3N3b3JkXCIpICwgaXRlbSk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuaW1wb3J0IHsgVGVycml0b3J5IH0gZnJvbSAnLi4vdGVycml0b3J5L3RlcnJpdG9yeS5tb2RlbCc7XHJcbmltcG9ydCB7IFVzZXIgfSBmcm9tICcuL3VzZXIubW9kZWwnO1xyXG4vKipcclxuICogVXNlciBwb3NpdGlvbiBtb2RlbFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFVzZXJQb3NpdGlvbiBleHRlbmRzIFJlc291cmNlIHtcclxuICAvKiogbmFtZSAqL1xyXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgLyoqIGVtYWlsICovXHJcbiAgcHVibGljIGVtYWlsOiBzdHJpbmc7XHJcbiAgLyoqIG9yZ2FuaXphdGlvbiBuYW1lKi9cclxuICBwdWJsaWMgb3JnYW5pemF0aW9uOiBzdHJpbmc7XHJcbiAgLyoqIHN5c3RlbSBjcmVhdGVkIGRhdGUqL1xyXG4gIHB1YmxpYyBjcmVhdGVkRGF0ZTogYW55O1xyXG4gIC8qKiBzeXN0ZW0gZGF0ZWQgZGF0ZSovXHJcbiAgcHVibGljIGRhdGVkRGF0ZTogYW55O1xyXG4gIC8qKiBwb3NpdGlvbiB0ZXJyaXRvcnkqL1xyXG4gIHB1YmxpYyB0ZXJyaXRvcnk6IFRlcnJpdG9yeTtcclxuICAvKiogdXNlciovXHJcbiAgcHVibGljIHVzZXI6IFVzZXI7XHJcbn1cclxuIiwiaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBVc2VyUG9zaXRpb24gfSBmcm9tICcuL3VzZXItcG9zaXRpb24ubW9kZWwnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcblxyXG4vKiogVXNlciBwb3NpdGlvbiBtYW5hZ2VyIHNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgVXNlclBvc2l0aW9uU2VydmljZSAgZXh0ZW5kcyBSZXN0U2VydmljZTxVc2VyUG9zaXRpb24+IHtcclxuICBcclxuXHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIFVTRVJfUE9TSVRJT05fQVBJID0gJ3VzZXItcG9zaXRpb25zJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoVXNlclBvc2l0aW9uLCBcInVzZXItcG9zaXRpb25zXCIsIGluamVjdG9yKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqIHJlbW92ZSB1c2VyIHBvc2l0aW9uKi9cclxuICByZW1vdmUoaXRlbTogVXNlclBvc2l0aW9uKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgdXNlciBwb3NpdGlvbiovXHJcbiAgc2F2ZShpdGVtOiBhbnkpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuICAgICAgaWYgKGl0ZW0udXNlciAhPW51bGwpe1xyXG4gICAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ3VzZXInLGl0ZW0udXNlcikuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgIFxyXG4gICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGl0ZW0udGVycml0b3J5ICE9bnVsbCl7XHJcbiAgICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbigndGVycml0b3J5JyxpdGVtLnRlcnJpdG9yeSkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgIFxyXG4gICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGl0ZW0udGVycml0b3J5ID0gaXRlbS50ZXJyaXRvcnkuX2xpbmtzLnNlbGYuaHJlZjtcclxuICAgICAgaXRlbS51c2VyID0gaXRlbS51c2VyLl9saW5rcy5zZWxmLmhyZWY7XHJcbiAgXHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuVVNFUl9QT1NJVElPTl9BUEkpICwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBcclxufVxyXG4iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuaW1wb3J0IHsgUm9sZSB9IGZyb20gJy4uL3JvbGUvcm9sZS5tb2RlbCc7XHJcbmltcG9ydCB7IFRlcnJpdG9yeSB9IGZyb20gJy4uL3RlcnJpdG9yeS90ZXJyaXRvcnkubW9kZWwnO1xyXG5pbXBvcnQgeyBVc2VyIH0gZnJvbSAnLi91c2VyLm1vZGVsJztcclxuXHJcbi8qKlxyXG4gKiBVc2VyIHBlcm1pc3Npb24gbW9kZWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBVc2VyQ29uZmlndXJhdGlvbiBleHRlbmRzIFJlc291cmNlIHtcclxuICAvKiogcm9sZSAqLyAgXHJcbiAgcHVibGljIHJvbGU6IFJvbGU7XHJcblxyXG4gIC8qKiByb2xlIENoaWxkcmVuICovICBcclxuICBwdWJsaWMgcm9sZUNoaWxkcmVuOiBSb2xlO1xyXG4gIFxyXG4gIC8qKiB0ZXJyaXRvcnkgKi8gXHJcbiAgcHVibGljIHRlcnJpdG9yeTogVGVycml0b3J5O1xyXG4gIC8qKiB1c2VyICovXHJcbiAgcHVibGljIHVzZXI6IFVzZXI7XHJcbn1cclxuIiwiaW1wb3J0IHsgUmVzdFNlcnZpY2UgfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcbmltcG9ydCB7IFVzZXJDb25maWd1cmF0aW9uIH0gZnJvbSAnLi91c2VyLWNvbmZpZ3VyYXRpb24ubW9kZWwnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcblxyXG4vKiogVXNlciBjb25maWd1cmF0aW9uIG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBVc2VyQ29uZmlndXJhdGlvblNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxVc2VyQ29uZmlndXJhdGlvbj4ge1xyXG5cclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgVVNFUl9DT05GSUdVUkFUSU9OX0FQSSA9ICd1c2VyLWNvbmZpZ3VyYXRpb25zJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLCBwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKFVzZXJDb25maWd1cmF0aW9uLCBcInVzZXItY29uZmlndXJhdGlvbnNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuXHJcbiAgLyoqIHJlbW92ZSB1c2VyIGNvbmZpZ3VyYXRpb24qL1xyXG4gIHJlbW92ZShpdGVtOiBVc2VyQ29uZmlndXJhdGlvbikge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuXHJcbiAgfVxyXG5cclxuICAvKiogc2F2ZSB1c2VyIGNvbmZpZ3VyYXRpb24qL1xyXG4gIHNhdmUoaXRlbTogYW55KTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgIGlmIChpdGVtLl9saW5rcyAhPSBudWxsKSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuICAgICAgaWYgKGl0ZW0udXNlciAhPSBudWxsKSB7XHJcbiAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ3VzZXInLCBpdGVtLnVzZXIpLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG5cclxuICAgICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGl0ZW0udGVycml0b3J5ICE9IG51bGwpIHtcclxuICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbigndGVycml0b3J5JywgaXRlbS50ZXJyaXRvcnkpLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG5cclxuICAgICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGl0ZW0ucm9sZSAhPSBudWxsKSB7XHJcbiAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ3JvbGUnLCBpdGVtLnJvbGUpLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG5cclxuICAgICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGl0ZW0ucm9sZUNoaWxkcmVuICE9IG51bGwpIHtcclxuICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbigncm9sZUNoaWxkcmVuJywgaXRlbS5yb2xlQ2hpbGRyZW4pLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG5cclxuICAgICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGl0ZW0udGVycml0b3J5ID0gaXRlbS50ZXJyaXRvcnkuX2xpbmtzLnNlbGYuaHJlZjtcclxuICAgICAgaXRlbS5yb2xlID0gaXRlbS5yb2xlIT1udWxsP2l0ZW0ucm9sZS5fbGlua3Muc2VsZi5ocmVmOm51bGw7XHJcbiAgICAgIGl0ZW0udXNlciA9IGl0ZW0udXNlci5fbGlua3Muc2VsZi5ocmVmO1xyXG4gICAgICBpdGVtLnJvbGVDaGlsZHJlbiA9IGl0ZW0ucm9sZUNoaWxkcmVuIT1udWxsP2l0ZW0ucm9sZUNoaWxkcmVuLl9saW5rcy5zZWxmLmhyZWY6bnVsbDtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5VU0VSX0NPTkZJR1VSQVRJT05fQVBJKSwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuXHJcbn1cclxuIiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcbmltcG9ydCB7IFRlcnJpdG9yeUdyb3VwVHlwZSB9IGZyb20gJy4vdGVycml0b3J5LWdyb3VwLXR5cGUubW9kZWwnO1xyXG5pbXBvcnQgeyBUZXJyaXRvcnlUeXBlIH0gZnJvbSAnLi90ZXJyaXRvcnktdHlwZS5tb2RlbCc7XHJcblxyXG4vKipcclxuICogVGVycml0b3J5IG1vZGVsXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgVGVycml0b3J5IGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiBpZCAqL1xyXG4gIHB1YmxpYyBpZDogbnVtYmVyOyAgXHJcbiAgLyoqIGNvZGUgKi9cclxuICBwdWJsaWMgY29kZTogc3RyaW5nO1xyXG4gIC8qKiBuYW1lICovXHJcbiAgcHVibGljIG5hbWU6IHN0cmluZztcclxuICAvKiogYWRkcmVzcyovXHJcbiAgcHVibGljIHRlcnJpdG9yaWFsQXV0aG9yaXR5QWRkcmVzczogc3RyaW5nO1xyXG4gIC8qKiBhZG1pbiAqL1xyXG4gIHB1YmxpYyB0ZXJyaXRvcmlhbEF1dGhvcml0eU5hbWU6IHN0cmluZztcclxuICAvKiogd2hldGhlciB0ZXJyaXRvcnkgaXMgYmxvY2tlZCovXHJcbiAgcHVibGljIGJsb2NrZWQ6IGJvb2xlYW47XHJcbiAgLyoqIGNvbW1lbnRzKi9cclxuICBwdWJsaWMgbm90ZTogc3RyaW5nO1xyXG4gIC8qKiBzeXN0ZW0gY3JlYXRlZCBkYXRlKi9cclxuICBwdWJsaWMgY3JlYXRlZERhdGU6IGFueTtcclxuICAvKiogY29udGFjdCBlbWFpbCAqLyAgXHJcbiAgcHVibGljIHRlcnJpdG9yaWFsQXV0aG9yaXR5RW1haWw6IHN0cmluZztcclxuICAvKiogZXh0ZW5zaW9uICovXHJcbiAgcHVibGljIGV4dGVudDogc3RyaW5nO1xyXG4gIC8qKiBsb2dvIGltYWdlIFVSTCAqL1xyXG4gIHB1YmxpYyB0ZXJyaXRvcmlhbEF1dGhvcml0eUxvZ286IHN0cmluZztcclxuICAvKiogY29udGFjdCBvcmdhbml6YXRpb24gbmFtZSAqL1xyXG4gIC8vIHB1YmxpYyBvcmdhbml6YXRpb25OYW1lOiBzdHJpbmc7XHJcbiAgLyoqIHNjb3BlKi9cclxuICBwdWJsaWMgc2NvcGU6IHN0cmluZztcclxuICAvKiogdHlwZSAqLyAgXHJcbiAgcHVibGljIHR5cGU6IFRlcnJpdG9yeVR5cGU7XHJcbiAgLyoqIGdyb3VwIHR5cGUgKi9cclxuICBwdWJsaWMgZ3JvdXBUeXBlOiBUZXJyaXRvcnlHcm91cFR5cGU7XHJcbiAgLyoqIHRlcnJpdG9yeSBtZW1iZXJzKi9cclxuICBwdWJsaWMgbWVtYmVyczogVGVycml0b3J5W107XHJcblxyXG59XHJcbiIsImltcG9ydCB7IFRlcnJpdG9yeSB9IGZyb20gJy4vdGVycml0b3J5Lm1vZGVsJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBSZXN0U2VydmljZSB9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuXHJcbi8qKiBUZXJyaXRvcnkgbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFRlcnJpdG9yeVNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxUZXJyaXRvcnk+IHtcclxuXHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIFRFUlJJVE9SWV9BUEkgPSAndGVycml0b3JpZXMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IsIHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoVGVycml0b3J5LCBcInRlcnJpdG9yaWVzXCIsIGluamVjdG9yKTtcclxuICB9XHJcblxyXG4gIC8qKiByZW1vdmUgdGVycml0b3J5Ki9cclxuICByZW1vdmUoaXRlbTogVGVycml0b3J5KSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG5cclxuICB9XHJcblxyXG4gIC8qKiBzYXZlIHRlcnJpdG9yeSovXHJcbiAgc2F2ZShpdGVtOiBUZXJyaXRvcnkpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG5cclxuICAgIGxldCB0ZXJyaXRvcnlHcm91cFR5cGU6YW55ID0ge31cclxuICAgIHRlcnJpdG9yeUdyb3VwVHlwZS5fbGlua3MgPSB7fTtcclxuICAgIHRlcnJpdG9yeUdyb3VwVHlwZS5fbGlua3Muc2VsZiA9IHt9O1xyXG4gICAgdGVycml0b3J5R3JvdXBUeXBlLl9saW5rcy5zZWxmLmhyZWYgPSBcIlwiO1xyXG5cclxuICAgIGlmIChpdGVtLmdyb3VwVHlwZSAhPSBudWxsKSB7XHJcbiAgICAgIHRlcnJpdG9yeUdyb3VwVHlwZSA9IGl0ZW0uZ3JvdXBUeXBlO1xyXG4gICAgICBpZiAodHlwZW9mIGl0ZW0uZ3JvdXBUeXBlLl9saW5rcyAhPSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIGl0ZW0uZ3JvdXBUeXBlID0gaXRlbS5ncm91cFR5cGUuX2xpbmtzLnNlbGYuaHJlZjtcclxuICAgICAgfSBcclxuICAgIH1cclxuXHJcbiAgICBpZiAoaXRlbS5fbGlua3MgIT0gbnVsbCkge1xyXG4gICAgICAvL3VwZGF0ZSByZWxhdGlvbnNcclxuICAgICAgZGVsZXRlIGl0ZW0uZ3JvdXBUeXBlO1xyXG5cclxuICAgICAgaWYgKHRlcnJpdG9yeUdyb3VwVHlwZS5fbGlua3Muc2VsZi5ocmVmID09ICcnKSB7XHJcbiAgICAgICAgaXRlbS5kZWxldGVSZWxhdGlvbignZ3JvdXBUeXBlJywgdGVycml0b3J5R3JvdXBUeXBlKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcblxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCdncm91cFR5cGUnLCB0ZXJyaXRvcnlHcm91cFR5cGUpLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGl0ZW0udHlwZSAhPSBudWxsKVxyXG4gICAgICAgIGl0ZW0udHlwZSA9IGl0ZW0udHlwZS5fbGlua3Muc2VsZi5ocmVmO1xyXG5cclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5URVJSSVRPUllfQVBJKSwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuXHJcbn1cclxuIiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcblxyXG4vKipcclxuICogVGVycml0b3J5IHR5cGUgbW9kZWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBUZXJyaXRvcnlUeXBlIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gICAvKiogaWQgKi9cclxuICAgcHVibGljIGlkOiBudW1iZXI7ICBcclxuICAvKiogbmFtZSAqL1xyXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbn1cclxuIiwiaW1wb3J0IHsgVGVycml0b3J5IH0gZnJvbSAnLi90ZXJyaXRvcnkubW9kZWwnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgVGVycml0b3J5VHlwZSB9IGZyb20gJy4vdGVycml0b3J5LXR5cGUubW9kZWwnO1xyXG5cclxuLyoqIFRlcnJpdG9yeVR5cGUgbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFRlcnJpdG9yeVR5cGVTZXJ2aWNlIGV4dGVuZHMgUmVzdFNlcnZpY2U8VGVycml0b3J5VHlwZT4ge1xyXG4gIFxyXG5cclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgVEVSUklUT1JZVFlQRV9BUEkgPSAndGVycml0b3J5LXR5cGVzJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoVGVycml0b3J5VHlwZSwgXCJ0ZXJyaXRvcnktdHlwZXNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIHRlcnJpdG9yeSB0eXBlKi9cclxuICByZW1vdmUoaXRlbTogVGVycml0b3J5VHlwZSkge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIHRlcnJpdG9yeSB0eXBlKi9cclxuICBzYXZlKGl0ZW06IGFueSk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICBpZiAoaXRlbS5fbGlua3MhPW51bGwpIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5URVJSSVRPUllUWVBFX0FQSSkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG5cclxuLyoqXHJcbiAqIFRlcnJpdG9yeSB0eXBlIG1vZGVsXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgVGVycml0b3J5R3JvdXBUeXBlIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiBpZCAqL1xyXG4gIHB1YmxpYyBpZDogbnVtYmVyOyAgXHJcbiAgLyoqIG5hbWUgKi9cclxuICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG59XHJcbiIsImltcG9ydCB7IFRlcnJpdG9yeUdyb3VwVHlwZSB9IGZyb20gJy4vdGVycml0b3J5LWdyb3VwLXR5cGUubW9kZWwnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuQEluamVjdGFibGUoe1xyXG4gIHByb3ZpZGVkSW46ICdyb290J1xyXG59KVxyXG5leHBvcnQgY2xhc3MgVGVycml0b3J5R3JvdXBUeXBlU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPFRlcnJpdG9yeUdyb3VwVHlwZT4ge1xyXG4gIFxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBURVJSSVRPUllHUk9VUFRZUEVfQVBJID0gJ3RlcnJpdG9yeS1ncm91cC10eXBlcyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKFRlcnJpdG9yeUdyb3VwVHlwZSwgXCJ0ZXJyaXRvcnktZ3JvdXAtdHlwZXNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIHRlcnJpdG9yeSovXHJcbiAgcmVtb3ZlKGl0ZW06IFRlcnJpdG9yeUdyb3VwVHlwZSkge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIHRlcnJpdG9yeSovXHJcbiAgc2F2ZShpdGVtOiBhbnkpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuVEVSUklUT1JZR1JPVVBUWVBFX0FQSSkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG59IiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcblxyXG4vKipcclxuICogUm9sZSBtb2RlbFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFJvbGUgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgLyoqIGlkICovXHJcbiAgcHVibGljIGlkOiBudW1iZXI7XHJcbiAgLyoqIG5hbWUqL1xyXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgLyoqIGNvbW1lbnRzKi9cclxuICBwdWJsaWMgZGVzY3JpcHRpb246IHN0cmluZztcclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgUm9sZSB9IGZyb20gJy4vcm9sZS5tb2RlbCc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5cclxuLyoqIFJvbGUgbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFJvbGVTZXJ2aWNlIGV4dGVuZHMgUmVzdFNlcnZpY2U8Um9sZT4ge1xyXG4gIFxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBST0xFX0FQSSA9ICdyb2xlcyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKFJvbGUsIFwicm9sZXNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIHJvbGUqL1xyXG4gIHJlbW92ZShpdGVtOiBSb2xlKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgcm9sZSovXHJcbiAgc2F2ZShpdGVtOiBhbnkpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuUk9MRV9BUEkpICwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBcclxufVxyXG4iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuLyoqXHJcbiAqIENvbm5lY3Rpb24gbW9kZWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBDb25uZWN0aW9uIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiBpZCAqL1xyXG4gIHB1YmxpYyBpZDogbnVtYmVyO1xyXG4gIC8qKiBuYW1lKi9cclxuICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG4gIC8qKiB0eXBlKi9cclxuICBwdWJsaWMgdHlwZTogc3RyaW5nO1xyXG4gIC8qKiB1c2VyKi9cclxuICBwdWJsaWMgdXNlcjogc3RyaW5nO1xyXG4gIC8qKiBwYXNzd29yZCovXHJcbiAgcHVibGljIHBhc3N3b3JkOiBzdHJpbmc7XHJcbiAgLyoqIGNvbm5lY3Rpb24gc3RyaW5nKi9cclxuICBwdWJsaWMgY29ubmVjdGlvblN0cmluZzogc3RyaW5nO1xyXG5cclxufVxyXG4iLCJpbXBvcnQgeyBDb25uZWN0aW9uIH0gZnJvbSAnLi9jb25uZWN0aW9uLm1vZGVsJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcblxyXG4vKiogQ29ubmVjdGlvbiBtYW5hZ2VyIHNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgQ29ubmVjdGlvblNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxDb25uZWN0aW9uPiB7XHJcbiAgXHJcblxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBDT05ORUNUSU9OX0FQSSA9ICdjb25uZWN0aW9ucyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKENvbm5lY3Rpb24sIFwiY29ubmVjdGlvbnNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIGNvbm5lY3Rpb24qL1xyXG4gIHJlbW92ZShpdGVtOiBDb25uZWN0aW9uKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgY29ubmVjdGlvbiovXHJcbiAgc2F2ZShpdGVtOiBDb25uZWN0aW9uKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgIGlmIChpdGVtLl9saW5rcyE9bnVsbCkge1xyXG4gICAgICBcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5DT05ORUNUSU9OX0FQSSkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG5cclxuICB0ZXN0Q29ubmVjdGlvbihpdGVtOmFueSk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICByZXN1bHQ9dGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5DT05ORUNUSU9OX0FQSSkrXCIvdGVzdFwiICwgaXRlbSk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBcclxufVxyXG4iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuXHJcbmltcG9ydCB7IENvbm5lY3Rpb24gfSBmcm9tICcuLi9jb25uZWN0aW9uL2Nvbm5lY3Rpb24ubW9kZWwnO1xyXG5pbXBvcnQgeyBSb2xlIH0gZnJvbSAnLi4vcm9sZS9yb2xlLm1vZGVsJztcclxuaW1wb3J0IHsgVGFza1R5cGUgfSBmcm9tICcuL3Rhc2stdHlwZS5tb2RlbCc7XHJcbmltcG9ydCB7IFRhc2tHcm91cCB9IGZyb20gJy4vdGFzay1ncm91cC5tb2RlbCc7XHJcbmltcG9ydCB7IFRhc2tBdmFpbGFiaWxpdHkgfSBmcm9tICcuL3Rhc2stYXZhaWxhYmlsaXR5Lm1vZGVsJztcclxuaW1wb3J0IHsgVGFza1BhcmFtZXRlciB9IGZyb20gJy4vdGFzay1wYXJhbWV0ZXIubW9kZWwnO1xyXG5cclxuLy9GSVhNRSBlbnN1cmUgdGFzayBjcmVhdGlvbiBpbiBhZG1pbiBhcHAgdXBvbiBpbml0aWFsaXphdGlvbiAoYXMgaXQgaXMgZG9uZSB3aXRoIFJvbGVzIGFuZCBkZWZhdWx0IFVzZXJzKVxyXG4vKiogR0VPQURNSU5fdGFzayBpZCAqL1xyXG5leHBvcnQgY29uc3QgR0VPQURNSU5fVFJFRV9UQVNLX0lEOnN0cmluZyAgPSBcImdlb2FkbWluXCI7XHJcblxyXG5pbXBvcnQgeyBUYXNrVUkgfSBmcm9tICcuL3Rhc2stdWkubW9kZWwnO1xyXG5pbXBvcnQgeyBDYXJ0b2dyYXBoeSB9IGZyb20gJy4uL2NhcnRvZ3JhcGh5L2NhcnRvZ3JhcGh5Lm1vZGVsJztcclxuaW1wb3J0IHsgU2VydmljZSB9IGZyb20gJy4uL3NlcnZpY2Uvc2VydmljZS5tb2RlbCc7XHJcbi8qKiBUYXNrIG1vZGVsICovXHJcbmV4cG9ydCBjbGFzcyBUYXNrIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiBpZCAqL1xyXG4gIHB1YmxpYyBpZD86IG51bWJlcjtcclxuICAvKiogbmFtZSAqLyAgXHJcbiAgcHVibGljIG5hbWU/OiBzdHJpbmc7XHJcbiAgLyoqIG9yZGVyKi9cclxuICBwdWJsaWMgb3JkZXI/OiBOdW1iZXI7XHJcbiAgLyoqIHN5c3RlbSBjcmVhdGVkIGRhdGUqL1xyXG4gIHB1YmxpYyBjcmVhdGVkRGF0ZT86IGFueTtcclxuICAvKiogdGFzayBncm91cCovXHJcbiAgcHVibGljIGdyb3VwPzogVGFza0dyb3VwO1xyXG4gIC8qKiB0YXNrIHR5cGUqL1xyXG4gIHB1YmxpYyB0eXBlPzogVGFza1R5cGU7XHJcbiAgLyoqIHRhc2sgVUkqL1xyXG4gIHB1YmxpYyB1aT86IFRhc2tVSTtcclxuICAvKiogcGFyYW1ldGVycyovXHJcbiAgcHVibGljIHBhcmFtZXRlcnM/OiBUYXNrUGFyYW1ldGVyW107XHJcbiAgLyoqIGNvbm5lY3Rpb24qL1xyXG4gIHB1YmxpYyBjb25uZWN0aW9uPzogQ29ubmVjdGlvbjtcclxuICAvKiogcm9sZXMqL1xyXG4gIHB1YmxpYyByb2xlcz86IFJvbGVbXTtcclxuICAvKiogYXZhaWxhYmlsaXRpZXMqL1xyXG4gIHB1YmxpYyBhdmFpbGFiaWxpdGllcz86IFRhc2tBdmFpbGFiaWxpdHlbXTtcclxuXHJcbiAgcHVibGljIGNhcnRvZ3JhcGh5PzogQ2FydG9ncmFwaHk7XHJcblxyXG4gIHB1YmxpYyBzZXJ2aWNlPzogU2VydmljZTtcclxuXHJcbiAgcHVibGljIHByb3BlcnRpZXM/O1xyXG59XHJcbiIsImltcG9ydCB7IFRhc2sgfSBmcm9tICcuL3Rhc2subW9kZWwnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuXHJcbi8qKiBUYXNrIG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBUYXNrU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPFRhc2s+IHtcclxuXHJcbiAgICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICAgIHB1YmxpYyBDT05ORUNUSU9OX0FQSSA9ICd0YXNrcyc7XHJcblxyXG4gICAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IsIHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgICAgIHN1cGVyKFRhc2ssIFwidGFza3NcIiwgaW5qZWN0b3IpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiByZW1vdmUgdGFzayovXHJcbiAgICByZW1vdmUoaXRlbTogVGFzaykge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKGl0ZW0uX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKiBzYXZlIHRhc2sqL1xyXG4gICAgc2F2ZShpdGVtOiBUYXNrKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgICAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcblxyXG4gICAgICAgIGlmIChpdGVtLl9saW5rcyAhPSBudWxsKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoIWl0ZW0uc2VydmljZSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHNlcnZpY2U6YW55ID0ge31cclxuICAgICAgICAgICAgICAgIHNlcnZpY2UuX2xpbmtzID0ge307XHJcbiAgICAgICAgICAgICAgICBzZXJ2aWNlLl9saW5rcy5zZWxmID0ge307XHJcbiAgICAgICAgICAgICAgICBzZXJ2aWNlLl9saW5rcy5zZWxmLmhyZWYgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgaXRlbS5kZWxldGVSZWxhdGlvbignc2VydmljZScsIHNlcnZpY2UpLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICAgICAgICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpOyBcclxuICAgICAgICAgICAgfWVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaXRlbS5zZXJ2aWNlLl9saW5rcy5zZWxmLmhyZWY9aXRlbS5zZXJ2aWNlLl9saW5rcy5zZWxmLmhyZWYuc3BsaXQoXCJ7XCIpWzBdXHJcbiAgICAgICAgICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbignc2VydmljZScsIGl0ZW0uc2VydmljZSkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgICAgICAgICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgICAgICAgICAgICBpdGVtLnNlcnZpY2UgPSBpdGVtLnNlcnZpY2UuX2xpbmtzLnNlbGYuaHJlZlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghaXRlbS5jYXJ0b2dyYXBoeSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGNhcnRvZ3JhcGh5OmFueSA9IHt9XHJcbiAgICAgICAgICAgICAgICBjYXJ0b2dyYXBoeS5fbGlua3MgPSB7fTtcclxuICAgICAgICAgICAgICAgIGNhcnRvZ3JhcGh5Ll9saW5rcy5zZWxmID0ge307XHJcbiAgICAgICAgICAgICAgICBjYXJ0b2dyYXBoeS5fbGlua3Muc2VsZi5ocmVmID0gXCJcIjtcclxuICAgICAgICAgICAgICAgIGl0ZW0uZGVsZXRlUmVsYXRpb24oJ2NhcnRvZ3JhcGh5JywgY2FydG9ncmFwaHkpLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICAgICAgICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpOyBcclxuICAgICAgICAgICAgfWVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaXRlbS5jYXJ0b2dyYXBoeS5fbGlua3Muc2VsZi5ocmVmPWl0ZW0uY2FydG9ncmFwaHkuX2xpbmtzLnNlbGYuaHJlZi5zcGxpdChcIntcIilbMF1cclxuICAgICAgICAgICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCdjYXJ0b2dyYXBoeScsIGl0ZW0uY2FydG9ncmFwaHkpLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICAgICAgICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG4gICAgICAgICAgICAgICAgaXRlbS5jYXJ0b2dyYXBoeSA9IGl0ZW0uY2FydG9ncmFwaHkuX2xpbmtzLnNlbGYuaHJlZlxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIWl0ZW0uY29ubmVjdGlvbikge1xyXG4gICAgICAgICAgICAgICAgbGV0IGNvbm5lY3Rpb246YW55ID0ge31cclxuICAgICAgICAgICAgICAgIGNvbm5lY3Rpb24uX2xpbmtzID0ge307XHJcbiAgICAgICAgICAgICAgICBjb25uZWN0aW9uLl9saW5rcy5zZWxmID0ge307XHJcbiAgICAgICAgICAgICAgICBjb25uZWN0aW9uLl9saW5rcy5zZWxmLmhyZWYgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgaXRlbS5kZWxldGVSZWxhdGlvbignY29ubmVjdGlvbicsIGNvbm5lY3Rpb24pLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICAgICAgICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpOyBcclxuICAgICAgICAgICAgfWVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaXRlbS5jb25uZWN0aW9uLl9saW5rcy5zZWxmLmhyZWY9aXRlbS5jb25uZWN0aW9uLl9saW5rcy5zZWxmLmhyZWYuc3BsaXQoXCJ7XCIpWzBdXHJcbiAgICAgICAgICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbignY29ubmVjdGlvbicsIGl0ZW0uY29ubmVjdGlvbikuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgICAgICAgICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgICAgICAgICAgICBpdGVtLmNvbm5lY3Rpb24gPSBpdGVtLmNvbm5lY3Rpb24uX2xpbmtzLnNlbGYuaHJlZlxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIWl0ZW0udWkpIHtcclxuICAgICAgICAgICAgICAgIC8vIGl0ZW0uZGVsZXRlUmVsYXRpb24oJ3VpJywgaXRlbS51aSkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgICAgICAgICAgICAvLyB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7IFxyXG4gICAgICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLnVpLl9saW5rcy5zZWxmLmhyZWY9aXRlbS51aS5fbGlua3Muc2VsZi5ocmVmLnNwbGl0KFwie1wiKVswXVxyXG4gICAgICAgICAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ3VpJywgaXRlbS51aSkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgICAgICAgICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgICAgICAgICAgICBpdGVtLnVpID0gaXRlbS51aS5fbGlua3Muc2VsZi5ocmVmXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICghaXRlbS5ncm91cCkge1xyXG4gICAgICAgICAgICAgICAgLy8gaXRlbS5kZWxldGVSZWxhdGlvbignZ3JvdXAnLCBpdGVtLmdyb3VwKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTsgXHJcbiAgICAgICAgICAgIH1lbHNlIHtcclxuICAgICAgICAgICAgICAgIGl0ZW0uZ3JvdXAuX2xpbmtzLnNlbGYuaHJlZj1pdGVtLmdyb3VwLl9saW5rcy5zZWxmLmhyZWYuc3BsaXQoXCJ7XCIpWzBdXHJcbiAgICAgICAgICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbignZ3JvdXAnLCBpdGVtLmdyb3VwKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgICAgICAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgICAgICAgICAgIGl0ZW0uZ3JvdXAgPSBpdGVtLmdyb3VwLl9saW5rcy5zZWxmLmhyZWZcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCFpdGVtLnR5cGUpIHtcclxuICAgICAgICAgICAgICAgIC8vIGl0ZW0uZGVsZXRlUmVsYXRpb24oJ3R5cGUnLCBpdGVtLnR5cGUpLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICAgICAgICAgICAgLy8gfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpOyBcclxuICAgICAgICAgICAgfWVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaXRlbS50eXBlLl9saW5rcy5zZWxmLmhyZWY9aXRlbS50eXBlLl9saW5rcy5zZWxmLmhyZWYuc3BsaXQoXCJ7XCIpWzBdXHJcbiAgICAgICAgICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbigndHlwZScsIGl0ZW0udHlwZSkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgICAgICAgICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgICAgICAgICAgICBpdGVtLnR5cGUgPSBpdGVtLnR5cGUuX2xpbmtzLnNlbGYuaHJlZlxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZihpdGVtLnJvbGVzKXtcclxuICAgICAgICAgICAgICAgIGxldCByb2xlcyA9IFsuLi5pdGVtLnJvbGVzXTtcclxuICAgICAgICAgICAgICAgIGRlbGV0ZSBpdGVtLnJvbGVzO1xyXG4gICAgICAgICAgICAgICAgaXRlbS5zdWJzdGl0dXRlQWxsUmVsYXRpb24oJ3JvbGVzJyxyb2xlcykuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgICAgICAgICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTsgICAgICAgICAgICBcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZihpdGVtLmNhcnRvZ3JhcGh5KXtcclxuICAgICAgICAgICAgICAgIGl0ZW0uY2FydG9ncmFwaHkgPSBpdGVtLmNhcnRvZ3JhcGh5Ll9saW5rcy5zZWxmLmhyZWZcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZihpdGVtLmNvbm5lY3Rpb24pe1xyXG4gICAgICAgICAgICAgICAgaXRlbS5jb25uZWN0aW9uID0gaXRlbS5jb25uZWN0aW9uLl9saW5rcy5zZWxmLmhyZWZcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZihpdGVtLnNlcnZpY2Upe1xyXG4gICAgICAgICAgICAgICAgaXRlbS5zZXJ2aWNlID0gaXRlbS5zZXJ2aWNlLl9saW5rcy5zZWxmLmhyZWZcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZihpdGVtLnVpKXtcclxuICAgICAgICAgICAgICAgIGl0ZW0udWkgPSBpdGVtLnVpLl9saW5rcy5zZWxmLmhyZWZcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZihpdGVtLmdyb3VwKXtcclxuICAgICAgICAgICAgICAgIGl0ZW0uZ3JvdXAgPSBpdGVtLmdyb3VwLl9saW5rcy5zZWxmLmhyZWZcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZihpdGVtLnR5cGUpe1xyXG4gICAgICAgICAgICAgICAgaXRlbS50eXBlID0gaXRlbS50eXBlLl9saW5rcy5zZWxmLmhyZWZcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLkNPTk5FQ1RJT05fQVBJKSwgaXRlbSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG4vKipcclxuICogVGFzayB0eXBlIG1vZGVsXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgVGFza1R5cGUgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgLyoqIG5hbWUqLyAgXHJcbiAgcHVibGljIG5hbWU6IHN0cmluZztcclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgVGFza1R5cGUgfSBmcm9tICcuL3Rhc2stdHlwZS5tb2RlbCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5cclxuLyoqIFRhc2tUeXBlIG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBUYXNrVHlwZVNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxUYXNrVHlwZT4ge1xyXG4gIFxyXG5cclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgQ09OTkVDVElPTl9BUEkgPSAndGFzay10eXBlcyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKFRhc2tUeXBlLCBcInRhc2stdHlwZXNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIHRhc2sgdHlwZSovXHJcbiAgcmVtb3ZlKGl0ZW06IFRhc2tUeXBlKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgdGFzayB0eXBlKi9cclxuICBzYXZlKGl0ZW06IFRhc2tUeXBlKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgIGlmIChpdGVtLl9saW5rcyE9bnVsbCkge1xyXG4gICAgICBcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5DT05ORUNUSU9OX0FQSSkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG4vKipcclxuICogVGFzayBncm91cCBtb2RlbFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFRhc2tHcm91cCBleHRlbmRzIFJlc291cmNlIHtcclxuICAvKiogaWQgKi9cclxuICBwdWJsaWMgaWQ6IG51bWJlcjsgIFxyXG4gIC8qKiBuYW1lKi8gIFxyXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcblxyXG59XHJcbiIsImltcG9ydCB7IFRhc2tHcm91cCB9IGZyb20gJy4vdGFzay1ncm91cC5tb2RlbCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5cclxuLyoqIFRhc2sgZ3JvdXAgbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFRhc2tHcm91cFNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxUYXNrR3JvdXA+IHtcclxuICBcclxuXHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIENPTk5FQ1RJT05fQVBJID0gJ3Rhc2stZ3JvdXBzJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoVGFza0dyb3VwLCBcInRhc2stZ3JvdXBzXCIsIGluamVjdG9yKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqIHJlbW92ZSB0YXNrIGdyb3VwKi9cclxuICByZW1vdmUoaXRlbTogVGFza0dyb3VwKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgdGFzayBncm91cCovXHJcbiAgc2F2ZShpdGVtOiBUYXNrR3JvdXApOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIFxyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucHV0KGl0ZW0uX2xpbmtzLnNlbGYuaHJlZiwgaXRlbSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLkNPTk5FQ1RJT05fQVBJKSAsIGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgXHJcbn1cclxuIiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcbmltcG9ydCB7VGFza30gZnJvbSAnLi90YXNrLm1vZGVsJzsgIFxyXG4vKipcclxuICogVGFzayBwYXJhbWV0ZXIgbW9kZWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBUYXNrUGFyYW1ldGVyIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiBuYW1lKi8gIFxyXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgXHJcbiAgLyoqIHR5cGUqL1xyXG4gIHB1YmxpYyB0eXBlOiBzdHJpbmc7XHJcbiAgICBcclxuICAvKiogdmFsdWUqL1xyXG4gIHB1YmxpYyB2YWx1ZTogc3RyaW5nO1xyXG4gIFxyXG4gIC8qKiBvcmRlciovICBcclxuICBwdWJsaWMgb3JkZXI6IE51bWJlcjtcclxuICBcclxuICAvKiogdGFzayovICBcclxuICBwdWJsaWMgdGFzazpUYXNrO1xyXG5cclxufVxyXG4iLCJpbXBvcnQgeyBUYXNrUGFyYW1ldGVyIH0gZnJvbSAnLi90YXNrLXBhcmFtZXRlci5tb2RlbCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5cclxuLyoqIFRhc2sgcGFyYW1ldGVyIG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpIFxyXG5leHBvcnQgY2xhc3MgVGFza1BhcmFtZXRlclNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxUYXNrUGFyYW1ldGVyPiB7XHJcbiAgXHJcblxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBUQVNLX1BBUkFNRVRFUl9BUEkgPSAndGFzay1wYXJhbWV0ZXJzJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoVGFza1BhcmFtZXRlciwgXCJ0YXNrLXBhcmFtZXRlcnNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIHRhc2sgcGFyYW1ldGVyKi9cclxuICByZW1vdmUoaXRlbTogVGFza1BhcmFtZXRlcikge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIHRhc2sgcGFyYW1ldGVyKi9cclxuICBzYXZlKGl0ZW06IFRhc2tQYXJhbWV0ZXIpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuICAgICAgaWYgKGl0ZW0udGFzayAhPW51bGwpe1xyXG4gICAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ3Rhc2snLGl0ZW0udGFzaykuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgIFxyXG4gICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpdGVtLnRhc2sgPSBpdGVtLnRhc2suX2xpbmtzLnNlbGYuaHJlZjtcclxuICBcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5UQVNLX1BBUkFNRVRFUl9BUEkpICwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBcclxufVxyXG4iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuaW1wb3J0IHsgVGVycml0b3J5IH0gZnJvbSAnLi4vdGVycml0b3J5L3RlcnJpdG9yeS5tb2RlbCc7XHJcbmltcG9ydCB7IFRhc2sgfSBmcm9tICcuL3Rhc2subW9kZWwnO1xyXG4vKipcclxuICogVGFzayBhdmFpbGFiaWxpdHkgbW9kZWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBUYXNrQXZhaWxhYmlsaXR5IGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiB0ZXJyaXRvcnkqL1xyXG4gIHB1YmxpYyB0ZXJyaXRvcnk6IFRlcnJpdG9yeTtcclxuICAvKiogdGFzayovXHJcbiAgcHVibGljIHRhc2s6IFRhc2s7XHJcbn1cclxuIiwiaW1wb3J0IHsgVGFza0F2YWlsYWJpbGl0eSB9IGZyb20gJy4vdGFzay1hdmFpbGFiaWxpdHkubW9kZWwnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuXHJcbi8qKiBUYXNrIGF2YWlsYWJpbGl0eSBtYW5hZ2VyIHNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKSBcclxuZXhwb3J0IGNsYXNzIFRhc2tBdmFpbGFiaWxpdHlTZXJ2aWNlIGV4dGVuZHMgUmVzdFNlcnZpY2U8VGFza0F2YWlsYWJpbGl0eT4ge1xyXG4gIFxyXG5cclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgVEFTS19BVkFJTEFCSUxJVFlfQVBJID0gJ3Rhc2stYXZhaWxhYmlsaXRpZXMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihUYXNrQXZhaWxhYmlsaXR5LCBcInRhc2stYXZhaWxhYmlsaXRpZXNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIHRhc2sgYXZhaWxhYmlsaXR5Ki9cclxuICByZW1vdmUoaXRlbTogVGFza0F2YWlsYWJpbGl0eSkge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIHRhc2sgYXZhaWxhYmlsaXR5Ki9cclxuICBzYXZlKGl0ZW06IFRhc2tBdmFpbGFiaWxpdHkpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuICAgICAgaWYgKGl0ZW0udGFzayAhPW51bGwpe1xyXG4gICAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ3Rhc2snLGl0ZW0udGFzaykuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgIFxyXG4gICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGl0ZW0udGVycml0b3J5ICE9bnVsbCl7XHJcbiAgICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbigndGVycml0b3J5JyxpdGVtLnRlcnJpdG9yeSkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgIFxyXG4gICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGl0ZW0udGVycml0b3J5ID0gaXRlbS50ZXJyaXRvcnkuX2xpbmtzLnNlbGYuaHJlZjtcclxuICAgICAgaXRlbS50YXNrID0gaXRlbS50YXNrLl9saW5rcy5zZWxmLmhyZWY7XHJcbiAgXHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuVEFTS19BVkFJTEFCSUxJVFlfQVBJKSAsIGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgXHJcbn1cclxuIiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcbi8qKlxyXG4gKiBUYXNrIFVJIG1vZGVsXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgVGFza1VJIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiBuYW1lKi9cclxuICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG4gIFxyXG4gIC8qKiB0b29sdGlwKi8gIFxyXG4gIHB1YmxpYyB0b29sdGlwOiBzdHJpbmc7XHJcbiAgICBcclxuICAvKiogb3JkZXIqLyBcclxuICBwdWJsaWMgb3JkZXI6IG51bWJlcjtcclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgVGFza1VJIH0gZnJvbSAnLi90YXNrLXVpLm1vZGVsJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcblxyXG4vKiogVGFzayBVSSBtYW5hZ2VyIHNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgVGFza1VJU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPFRhc2tVST4ge1xyXG4gIFxyXG5cclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgQ09OTkVDVElPTl9BUEkgPSAndGFzay11aXMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihUYXNrVUksIFwidGFzay11aXNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIHRhc2sgVUkqL1xyXG4gIHJlbW92ZShpdGVtOiBUYXNrVUkpIHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKGl0ZW0uX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgIFxyXG4gIH1cclxuICBcclxuICAvKiogc2F2ZSB0YXNrIFVJKi9cclxuICBzYXZlKGl0ZW06IFRhc2tVSSk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICBpZiAoaXRlbS5fbGlua3MhPW51bGwpIHsgICAgICBcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5DT05ORUNUSU9OX0FQSSkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG5pbXBvcnQgeyBMYW5ndWFnZSB9IGZyb20gJy4vbGFuZ3VhZ2UubW9kZWwnO1xyXG5cclxuXHJcbi8qKiBUYXNrIG1vZGVsICovXHJcbmV4cG9ydCBjbGFzcyBUcmFuc2xhdGlvbiBleHRlbmRzIFJlc291cmNlIHtcclxuICAvKiogaWQgKi9cclxuICBwdWJsaWMgaWQ6IG51bWJlcjtcclxuICAvKiogaWQgKi9cclxuICBwdWJsaWMgZWxlbWVudDogbnVtYmVyO1xyXG4gIC8qKiBuYW1lICovXHJcbiAgcHVibGljIHRyYW5zbGF0aW9uOiBzdHJpbmc7XHJcbiAgLyoqIGNvbHVtbiAqL1xyXG4gIHB1YmxpYyBjb2x1bW46IHN0cmluZztcclxuICAvKiogbmFtZSAqL1xyXG4gIHB1YmxpYyBsYW5ndWFnZTogTGFuZ3VhZ2U7XHJcblxyXG5cclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcbmltcG9ydCB7IFRyYW5zbGF0aW9uIH0gZnJvbSAnLi90cmFuc2xhdGlvbi5tb2RlbCc7XHJcblxyXG5cclxuQEluamVjdGFibGUoe1xyXG4gIHByb3ZpZGVkSW46ICdyb290J1xyXG59KVxyXG5leHBvcnQgY2xhc3MgVHJhbnNsYXRpb25TZXJ2aWNlIGV4dGVuZHMgUmVzdFNlcnZpY2U8VHJhbnNsYXRpb24+IHtcclxuXHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIFRSQU5TTEFUSU9OX0FQSSA9ICd0cmFuc2xhdGlvbnMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihUcmFuc2xhdGlvbiwgXCJ0cmFuc2xhdGlvbnNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIHRyYW5zbGF0aW9uKi9cclxuICByZW1vdmUoaXRlbTogVHJhbnNsYXRpb24pIHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKGl0ZW0uX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgIFxyXG4gIH1cclxuICBcclxuICAvKiogc2F2ZSB0cmFuc2xhdGlvbiovXHJcbiAgc2F2ZShpdGVtOiBUcmFuc2xhdGlvbik6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcblxyXG4gICAgbGV0IGxhbmd1YWdlOmFueSA9IHt9XHJcbiAgICBsYW5ndWFnZS5fbGlua3MgPSB7fTtcclxuICAgIGxhbmd1YWdlLl9saW5rcy5zZWxmID0ge307XHJcbiAgICBsYW5ndWFnZS5fbGlua3Muc2VsZi5ocmVmID0gXCJcIjtcclxuXHJcbiAgICBpZiAoaXRlbS5sYW5ndWFnZSAhPSBudWxsKSB7XHJcbiAgICAgIGxhbmd1YWdlID0gaXRlbS5sYW5ndWFnZTtcclxuICAgICAgaWYgKHR5cGVvZiBpdGVtLmxhbmd1YWdlLl9saW5rcyAhPSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIGl0ZW0ubGFuZ3VhZ2UgPSBpdGVtLmxhbmd1YWdlLl9saW5rcy5zZWxmLmhyZWY7XHJcbiAgICAgIH0gXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIGRlbGV0ZSBpdGVtLmxhbmd1YWdlO1xyXG4gICAgICAvLyBpZiAobGFuZ3VhZ2UuX2xpbmtzLnNlbGYuaHJlZiA9PSAnJykge1xyXG4gICAgICAvLyAgIGl0ZW0uZGVsZXRlUmVsYXRpb24oJ2xhbmd1YWdlJywgbGFuZ3VhZ2UpLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICAvLyAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuXHJcbiAgICAgIC8vIH0gZWxzZSB7XHJcbiAgICAgIC8vICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ2xhbmd1YWdlJywgbGFuZ3VhZ2UpLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICAvLyAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgLy8gfVxyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucHV0KGl0ZW0uX2xpbmtzLnNlbGYuaHJlZiwgaXRlbSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLlRSQU5TTEFUSU9OX0FQSSkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG5cclxuXHJcbi8qKiBUYXNrIG1vZGVsICovXHJcbmV4cG9ydCBjbGFzcyBMYW5ndWFnZSBleHRlbmRzIFJlc291cmNlIHtcclxuICAvKiogaWQgKi9cclxuICBwdWJsaWMgaWQ6IG51bWJlcjtcclxuICAvKiogbmFtZSAqL1xyXG4gIHB1YmxpYyBzaG9ydG5hbWU6IHN0cmluZztcclxuICAvKiogbmFtZSAqL1xyXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbn1cclxuIiwiaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcbmltcG9ydCB7IExhbmd1YWdlIH0gZnJvbSAnLi9sYW5ndWFnZS5tb2RlbCc7XHJcblxyXG5cclxuQEluamVjdGFibGUoe1xyXG4gIHByb3ZpZGVkSW46ICdyb290J1xyXG59KVxyXG5leHBvcnQgY2xhc3MgTGFuZ3VhZ2VTZXJ2aWNlIGV4dGVuZHMgUmVzdFNlcnZpY2U8TGFuZ3VhZ2U+IHtcclxuXHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIExBTkdVQUdFU19BUEkgPSAnbGFuZ3VhZ2VzJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoTGFuZ3VhZ2UsIFwibGFuZ3VhZ2VzXCIsIGluamVjdG9yKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqIHJlbW92ZSB0cmFuc2xhdGlvbiovXHJcbiAgcmVtb3ZlKGl0ZW06IExhbmd1YWdlKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgdHJhbnNsYXRpb24qL1xyXG4gIHNhdmUoaXRlbTogTGFuZ3VhZ2UpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuTEFOR1VBR0VTX0FQSSkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG5pbXBvcnQge0Nvbm5lY3Rpb259IGZyb20gJy4uL2Nvbm5lY3Rpb24vY29ubmVjdGlvbi5tb2RlbCc7XHJcbmltcG9ydCB7U2VydmljZVBhcmFtZXRlcn0gZnJvbSAnLi9zZXJ2aWNlLXBhcmFtZXRlci5tb2RlbCc7XHJcbi8qKlxyXG4gKiBTZXJ2aWNlIG1vZGVsXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgU2VydmljZSBleHRlbmRzIFJlc291cmNlIHtcclxuICAvKiogaWQgKi9cclxuICBwdWJsaWMgaWQ6IG51bWJlcjtcclxuICAvKiogbmFtZSovXHJcbiAgcHVibGljIG5hbWU6IHN0cmluZztcclxuICAgIFxyXG4gIC8qKiB0eXBlKi9cclxuICBwdWJsaWMgdHlwZTogc3RyaW5nO1xyXG5cclxuICAvKiogdXJsKi8gIFxyXG4gIHB1YmxpYyBzZXJ2aWNlVVJMOiBzdHJpbmc7XHJcblxyXG4gIC8qKiBwcm9qZWN0aW9ucyovICBcclxuICBwdWJsaWMgc3VwcG9ydGVkU1JTOiBzdHJpbmc7XHJcbiAgXHJcbiAgLyoqIGxlZ2VuZCovXHJcbiAgcHVibGljIGxlZ2VuZDogc3RyaW5nO1xyXG5cclxuICAvKiogaW5mb1VybCovICBcclxuICBwdWJsaWMgaW5mb1VybDogc3RyaW5nO1xyXG4gIFxyXG4gIC8qKiBzeXN0ZW0gY3JlYXRlZCBkYXRlKi9cclxuICBwdWJsaWMgY3JlYXRlZERhdGU6IGFueTtcclxuXHJcbiAgLyoqIGNvbm5lY3Rpb24qL1xyXG4gIHB1YmxpYyBjb25uZWN0aW9uOiBDb25uZWN0aW9uO1xyXG4gIFxyXG4gIC8qKiBwYXJhbWV0ZXJzKi8gIFxyXG4gIHB1YmxpYyBwYXJhbWV0ZXJzOiBTZXJ2aWNlUGFyYW1ldGVyW107XHJcblxyXG4gIC8qKiB3aGV0aGVyIHNlcnZpY2UgaXMgYmxvY2tlZCovXHJcbiAgcHVibGljIGJsb2NrZWQ6IGJvb2xlYW47XHJcbn1cclxuIiwiaW1wb3J0IHsgU2VydmljZSB9IGZyb20gJy4vc2VydmljZS5tb2RlbCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5cclxuLyoqIFNlcnZpY2UgbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFNlcnZpY2VTZXJ2aWNlIGV4dGVuZHMgUmVzdFNlcnZpY2U8U2VydmljZT4ge1xyXG5cclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgU0VSVklDRV9BUEkgPSAnc2VydmljZXMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihTZXJ2aWNlLCBcInNlcnZpY2VzXCIsIGluamVjdG9yKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqIHJlbW92ZSBzZXJ2aWNlKi9cclxuICByZW1vdmUoaXRlbTogU2VydmljZSkge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIHNlcnZpY2UqL1xyXG4gIHNhdmUoaXRlbTogU2VydmljZSk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICBsZXQgc2VydmljZUNvbm5lY3Rpb24gPSBpdGVtLmNvbm5lY3Rpb247XHJcblxyXG4gICAgaWYgKGl0ZW0uY29ubmVjdGlvbiE9bnVsbCl7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBpdGVtLmNvbm5lY3Rpb24uX2xpbmtzIT0gJ3VuZGVmaW5lZCcpIHsgXHJcbiAgICAgICAgICAgIGl0ZW0uY29ubmVjdGlvbiA9IGl0ZW0uY29ubmVjdGlvbi5fbGlua3Muc2VsZi5ocmVmO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHNlcnZpY2VDb25uZWN0aW9uLl9saW5rcz0ge307XHJcbiAgICAgICAgICAgIHNlcnZpY2VDb25uZWN0aW9uLl9saW5rcy5zZWxmID0ge307XHJcbiAgICAgICAgICAgIHNlcnZpY2VDb25uZWN0aW9uLl9saW5rcy5zZWxmLmhyZWY9XCJcIjtcclxuICAgICAgICB9ICAgICAgICBcclxuICAgICB9XHJcblxyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7ICAgICBcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pOyAgICAgICBcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuU0VSVklDRV9BUEkpICwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBcclxufVxyXG4iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuaW1wb3J0IHtTZXJ2aWNlfSBmcm9tICcuL3NlcnZpY2UubW9kZWwnOyBcclxuLyoqXHJcbiAqIFNlcnZpY2UgcGFyYW1ldGVyIG1vZGVsXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgU2VydmljZVBhcmFtZXRlciBleHRlbmRzIFJlc291cmNlIHtcclxuICAvKiogbmFtZSovXHJcbiAgcHVibGljIG5hbWU6IHN0cmluZztcclxuICBcclxuICAvKiogdHlwZSovXHJcbiAgcHVibGljIHR5cGU6IHN0cmluZztcclxuICAgIFxyXG4gIC8qKiB2YWx1ZSovICBcclxuICBwdWJsaWMgdmFsdWU6IHN0cmluZztcclxuICBcclxuICAvKiogc2VydmljZSovXHJcbiAgcHVibGljIHNlcnZpY2U6IFNlcnZpY2U7XHJcblxyXG59XHJcbiIsImltcG9ydCB7IFNlcnZpY2VQYXJhbWV0ZXIgfSBmcm9tICcuL3NlcnZpY2UtcGFyYW1ldGVyLm1vZGVsJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcblxyXG4vKiogU2VydmljZSBwYXJhbWV0ZXIgbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKCkgXHJcbmV4cG9ydCBjbGFzcyBTZXJ2aWNlUGFyYW1ldGVyU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPFNlcnZpY2VQYXJhbWV0ZXI+IHtcclxuXHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIFNFUlZJQ0VfUEFSQU1FVEVSX0FQSSA9ICdzZXJ2aWNlLXBhcmFtZXRlcnMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihTZXJ2aWNlUGFyYW1ldGVyLCBcInNlcnZpY2UtcGFyYW1ldGVyc1wiLCBpbmplY3Rvcik7XHJcbiAgfVxyXG4gIFxyXG4gIC8qKiByZW1vdmUgc2VydmljZSBwYXJhbWV0ZXIqL1xyXG4gIHJlbW92ZShpdGVtOiBTZXJ2aWNlUGFyYW1ldGVyKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgc2VydmljZSBwYXJhbWV0ZXIqL1xyXG4gIHNhdmUoaXRlbTogU2VydmljZVBhcmFtZXRlcik6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICBpZiAoaXRlbS5fbGlua3MhPW51bGwpIHtcclxuICAgICAgXHJcbiAgICAgIFxyXG4gICAgICBpZiAoaXRlbS5zZXJ2aWNlICE9bnVsbCl7XHJcbiAgICAgICAgICBsZXQgc2VydmljZSA9ICBpdGVtLnNlcnZpY2U7XHJcbiAgICAgICAgICBkZWxldGUgaXRlbS5zZXJ2aWNlO1xyXG4gICAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ3NlcnZpY2UnLHNlcnZpY2UpLnN1YnNjcmliZShyZXN1bHQgPT4geyAgICAgICAgICAgIFxyXG4gICAgICAgICAgXHJcbiAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgfVxyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucHV0KGl0ZW0uX2xpbmtzLnNlbGYuaHJlZiwgaXRlbSk7XHJcbiAgICAgIFxyXG4gICAgICBcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGl0ZW0uc2VydmljZSA9IGl0ZW0uc2VydmljZS5fbGlua3Muc2VsZi5ocmVmO1xyXG4gIFxyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLlNFUlZJQ0VfUEFSQU1FVEVSX0FQSSkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG4vKipcclxuICogQ2FwYWJpbGl0aWUgbW9kZWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBDYXBhYmlsaXRpZSBleHRlbmRzIFJlc291cmNlIHtcclxuICAvKiogdXJsICovXHJcbiAgcHVibGljIHVybDogc3RyaW5nO1xyXG59XHJcbiIsImltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBDYXBhYmlsaXRpZSB9IGZyb20gJy4vY2FwYWJpbGl0aWUubW9kZWwnO1xyXG5cclxuXHJcbkBJbmplY3RhYmxlKHtcclxuICBwcm92aWRlZEluOiAncm9vdCdcclxufSlcclxuZXhwb3J0IGNsYXNzIENhcGFiaWxpdGllc1NlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxDYXBhYmlsaXRpZT4gIHtcclxuXHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIENBUEFCSUxJVElFU19BUEkgPSAnaGVscGVycy9jYXBhYmlsaXRpZXM/dXJsPSc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKENhcGFiaWxpdGllLCBcImhlbHBlcnMvY2FwYWJpbGl0aWVzP3VybD1cIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuXHJcbiAgICAvKiogc2F2ZSBzZXJ2aWNlKi9cclxuICAgIGdldEluZm8odXJsOiBzdHJpbmcpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICAgIGlmKHVybCl7XHJcbiAgICAgICAgbGV0IGZpbmFsVXJsID0gdGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5DQVBBQklMSVRJRVNfQVBJKTtcclxuICAgICAgICBmaW5hbFVybCA9IGZpbmFsVXJsLmNvbmNhdCh1cmwpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGZpbmFsVXJsKTtcclxuICAgICAgICByZXN1bHQgPSB0aGlzLmh0dHAuZ2V0KGZpbmFsVXJsKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gcmVzdWx0O1xyXG4gXHJcbiAgICB9XHJcbiAgXHJcbn1cclxuIiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcbmltcG9ydCB7U2VydmljZX0gZnJvbSAnLi4vc2VydmljZS9zZXJ2aWNlLm1vZGVsJztcclxuaW1wb3J0IHtDb25uZWN0aW9ufSBmcm9tICcuLi9jb25uZWN0aW9uL2Nvbm5lY3Rpb24ubW9kZWwnO1xyXG5pbXBvcnQge0NhcnRvZ3JhcGh5QXZhaWxhYmlsaXR5fSBmcm9tICcuL2NhcnRvZ3JhcGh5LWF2YWlsYWJpbGl0eS5tb2RlbCc7XHJcbi8qKlxyXG4gKiBDYXJ0b2dyYXBoeVxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIENhcnRvZ3JhcGh5IGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiBpZCAqL1xyXG4gIHB1YmxpYyBpZDogbnVtYmVyOyAgXHJcbiAgLyoqIG5hbWUqL1xyXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgXHJcbiAgLyoqIHR5cGUqL1xyXG4gIHB1YmxpYyB0eXBlIDogc3RyaW5nO1xyXG5cclxuICAvKiogc2VydmljZSovXHJcbiAgcHVibGljIHNlcnZpY2UgOiBTZXJ2aWNlO1xyXG5cclxuICAvKiogb3JkZXIqLyAgXHJcbiAgcHVibGljIG9yZGVyOiBOdW1iZXI7IFxyXG5cclxuICAvKiogZGVzY3JpcHRpb24qLyAgXHJcbiAgcHVibGljIGRlc2NyaXB0aW9uOiBTdHJpbmc7XHJcblxyXG4gIC8qKiBzb3VyY2UqLyAgXHJcbiAgcHVibGljIHNvdXJjZTogU3RyaW5nO1xyXG5cclxuICAvKiogd2hldGhlciBjYXJ0b2dyYXBoeSBpcyBibG9ja2VkKi9cclxuICBwdWJsaWMgYmxvY2tlZDogYm9vbGVhbjsgIFxyXG5cclxuICAvKiogYXBwbHkgZmlsdGVyIHRvIGdldCBtYXAqL1xyXG4gIHB1YmxpYyBhcHBseUZpbHRlclRvR2V0TWFwOiBTdHJpbmc7ICBcclxuXHJcbiAgLyoqIGFwcGx5IGZpbHRlciB0byBnZXQgZmVhdHVyZSBpbmZvcm1hdGlvbiovXHJcbiAgcHVibGljIGFwcGx5RmlsdGVyVG9HZXRGZWF0dXJlSW5mbzogYm9vbGVhbjsgIFxyXG5cclxuICAvKiogYXBwbHkgZmlsdGVyIHRvIHNwYXRpYWwgc2VsZWN0aW9uKi9cclxuICBwdWJsaWMgYXBwbHlGaWx0ZXJUb1NwYXRpYWxTZWxlY3Rpb246IGJvb2xlYW47ICBcclxuXHJcbiAgLyoqIHNlbGVjdGFibGUgbGF5ZXJzKi9cclxuICBwdWJsaWMgc2VsZWN0YWJsZUxheWVyczogc3RyaW5nW107XHJcblxyXG4gIC8qKiB0cmFuc3BhcmVuY3kqLyBcclxuICBwdWJsaWMgdHJhbnNwYXJlbmN5OiBOdW1iZXI7XHJcblxyXG4gIC8qKiB3aGV0aGVyIGxheWVyIGlzIHF1ZXJ5YWJsZSovICBcclxuICBwdWJsaWMgcXVlcnlhYmxlOiBCb29sZWFuO1xyXG5cclxuICAvKiogd2hldGhlciBsYXllciBpcyBxdWVyeWFibGUqLyBcclxuICBwdWJsaWMgcXVlcnlBY3Q6IEJvb2xlYW47XHJcblxyXG4gIC8qKiBxdWVyeSBsYXllciovXHJcbiAgcHVibGljIHF1ZXJ5TGF5OiBzdHJpbmc7XHJcblxyXG4gIC8qKiBzeXN0ZW0gY3JlYXRlZCBkYXRlKi9cclxuICBwdWJsaWMgY3JlYXRlZERhdGU6IGFueTtcclxuXHJcbiAgLyoqIG1pbmltdW0gc2NhbGUqL1xyXG4gIHB1YmxpYyBtaW5pbXVtU2NhbGU6IE51bWJlcjtcclxuXHJcbiAgLyoqIG1heGltdW0gc2NhbGUqL1xyXG4gIHB1YmxpYyBtYXhpbXVtU2NhbGU6IE51bWJlcjtcclxuXHJcbiAgLyoqIGxheWVycyovICBcclxuICBwdWJsaWMgbGF5ZXJzOiBzdHJpbmc7XHJcbiAgXHJcbiAgLyoqIGNvbm5lY3Rpb24qL1xyXG4gIHB1YmxpYyBjb25uZWN0aW9uOiBDb25uZWN0aW9uO1xyXG5cclxuICAvKiogcXVlcnlhYmxlRmVhdHVyZUVuYWJsZWQgKi9cclxuICBwdWJsaWMgcXVlcnlhYmxlRmVhdHVyZUVuYWJsZWQ6IEJvb2xlYW47XHJcblxyXG4gICAgLyoqIHF1ZXJ5YWJsZUxheWVycyAqL1xyXG4gIHB1YmxpYyBxdWVyeWFibGVGZWF0dXJlQXZhaWxhYmxlOiBCb29sZWFuO1xyXG5cclxuICAgIC8qKiBxdWVyeWFibGVMYXllcnMgKi9cclxuICBwdWJsaWMgcXVlcnlhYmxlTGF5ZXJzOiBzdHJpbmdbXTtcclxuXHJcbiAgLyoqIGF2YWlsYWJpbGl0aWVzKi9cclxuICBwdWJsaWMgYXZhaWxhYmlsaXRpZXMgOiBDYXJ0b2dyYXBoeUF2YWlsYWJpbGl0eVtdO1xyXG5cclxuICAvKiogd2hldGhlciBsYXllciBpcyBxdWVyeWFibGUqLyBcclxuICBwdWJsaWMgc2VsZWN0YWJsZUZlYXR1cmVFbmFibGVkOiBCb29sZWFuO1xyXG5cclxuICAvKiogc2VsZWN0aW9uIGxheWVyKi9cclxuICBwdWJsaWMgc2VsZWN0aW9uTGF5ZXI6IHN0cmluZztcclxuXHJcbiAgLyoqIHNlbGVjdGlvbiBzZXJ2aWNlKi8gIFxyXG4gIHB1YmxpYyBzZWxlY3Rpb25TZXJ2aWNlOiBTZXJ2aWNlO1xyXG5cclxuICAvKiogbGVnZW5kIHRpcCovICBcclxuICBwdWJsaWMgbGVnZW5kVHlwZTogc3RyaW5nO1xyXG4gIFxyXG4gIC8qKiBsZWdlbmQgdXJsKi9cclxuICBwdWJsaWMgbGVnZW5kVVJMOiBzdHJpbmc7XHJcblxyXG4gIC8qKiB3aGV0aGVyIGxheWVyIGlzIGVkaXRhYmxlKi9cclxuICBwdWJsaWMgZWRpdGFibGU6IEJvb2xlYW47XHJcblxyXG4gIC8qKiBtZXRhZGF0YSBVUkwqL1xyXG4gIHB1YmxpYyBtZXRhZGF0YVVSTDogc3RyaW5nO1xyXG5cclxuICAvKiogbWV0YWRhdGEgVVJMKi9cclxuICBwdWJsaWMgZGF0YXNldFVSTDogc3RyaW5nO1xyXG5cclxuICAvKiogd2hldGhlciBsYXllciBpcyB0aGVtYWJsZSovXHJcbiAgcHVibGljIHRoZW1hdGljOiBCb29sZWFuO1xyXG4gIFxyXG4gIC8qKiBnZW9tZXRyeSB0eXBlKi9cclxuICBwdWJsaWMgZ2VvbWV0cnlUeXBlOiBzdHJpbmc7XHJcbiAgXHJcblxyXG59XHJcbiIsImltcG9ydCB7IENhcnRvZ3JhcGh5IH0gZnJvbSAnLi9jYXJ0b2dyYXBoeS5tb2RlbCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgUmVzdFNlcnZpY2UgfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcbmltcG9ydCB7IENvbm5lY3Rpb24gfSBmcm9tICcuLi9jb25uZWN0aW9uL2Nvbm5lY3Rpb24ubW9kZWwnO1xyXG5pbXBvcnQgeyBTZXJ2aWNlIH0gZnJvbSAnLi4vc2VydmljZS9zZXJ2aWNlLm1vZGVsJztcclxuXHJcbi8qKiBDYXJ0b2dyYXBoeSBtYW5hZ2VyIHNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgQ2FydG9ncmFwaHlTZXJ2aWNlIGV4dGVuZHMgUmVzdFNlcnZpY2U8Q2FydG9ncmFwaHk+IHtcclxuXHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIENBUlRPR1JBUEhZX0FQSSA9ICdjYXJ0b2dyYXBoaWVzJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLCBwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKENhcnRvZ3JhcGh5LCBcImNhcnRvZ3JhcGhpZXNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuXHJcbiAgLyoqIHJlbW92ZSBjYXJ0b2dyYXBoeSovXHJcbiAgcmVtb3ZlKGl0ZW06IENhcnRvZ3JhcGh5KSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG5cclxuICB9XHJcblxyXG4gIC8qKiBzYXZlIGNhcnRvZ3JhcGh5Ki9cclxuICBzYXZlKGl0ZW06IENhcnRvZ3JhcGh5KTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuXHJcbiAgICBsZXQgY2FydG9ncmFwaHlDb25uZWN0aW9uOmFueT17fTtcclxuICAgIGNhcnRvZ3JhcGh5Q29ubmVjdGlvbi5fbGlua3MgPSB7fTtcclxuICAgIGNhcnRvZ3JhcGh5Q29ubmVjdGlvbi5fbGlua3Muc2VsZiA9IHt9O1xyXG4gICAgY2FydG9ncmFwaHlDb25uZWN0aW9uLl9saW5rcy5zZWxmLmhyZWYgPSBcIlwiO1xyXG4gICAgIFxyXG4gICAgbGV0IGNhcnRvZ3JhcGh5U2VydmljZTphbnk9e307XHJcbiAgICBjYXJ0b2dyYXBoeVNlcnZpY2UuX2xpbmtzID0ge307XHJcbiAgICBjYXJ0b2dyYXBoeVNlcnZpY2UuX2xpbmtzLnNlbGYgPSB7fTtcclxuICAgIGNhcnRvZ3JhcGh5U2VydmljZS5fbGlua3Muc2VsZi5ocmVmID0gXCJcIjtcclxuICAgIFxyXG4gICAgbGV0IGNhcnRvZ3JhcGh5U2VsZWN0aW9uU2VydmljZTphbnkgPSB7fTtcclxuICAgIGNhcnRvZ3JhcGh5U2VsZWN0aW9uU2VydmljZS5fbGlua3MgPSB7fTtcclxuICAgIGNhcnRvZ3JhcGh5U2VsZWN0aW9uU2VydmljZS5fbGlua3Muc2VsZiA9IHt9O1xyXG4gICAgY2FydG9ncmFwaHlTZWxlY3Rpb25TZXJ2aWNlLl9saW5rcy5zZWxmLmhyZWYgPSBcIlwiO1xyXG5cclxuICAgIGlmIChpdGVtLnNlcnZpY2UgIT0gbnVsbCkge1xyXG4gICAgICBjYXJ0b2dyYXBoeVNlcnZpY2U9ICBpdGVtLnNlcnZpY2U7XHJcbiAgICAgIGlmICh0eXBlb2YgaXRlbS5zZXJ2aWNlLl9saW5rcyAhPSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIGl0ZW0uc2VydmljZSA9IGl0ZW0uc2VydmljZS5fbGlua3Muc2VsZi5ocmVmO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGl0ZW0uc2VsZWN0aW9uU2VydmljZSAhPSBudWxsKSB7XHJcbiAgICAgIGNhcnRvZ3JhcGh5U2VsZWN0aW9uU2VydmljZSA9IGl0ZW0uc2VsZWN0aW9uU2VydmljZVxyXG4gICAgICBpZiAodHlwZW9mIGl0ZW0uc2VsZWN0aW9uU2VydmljZS5fbGlua3MgIT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICBpdGVtLnNlbGVjdGlvblNlcnZpY2UgPSBpdGVtLnNlbGVjdGlvblNlcnZpY2UuX2xpbmtzLnNlbGYuaHJlZjtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChpdGVtLmNvbm5lY3Rpb24gIT0gbnVsbCkge1xyXG4gICAgICBjYXJ0b2dyYXBoeUNvbm5lY3Rpb249ICBpdGVtLmNvbm5lY3Rpb247XHJcbiAgICAgIGlmICh0eXBlb2YgaXRlbS5jb25uZWN0aW9uLl9saW5rcyAhPSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIGl0ZW0uY29ubmVjdGlvbiA9IGl0ZW0uY29ubmVjdGlvbi5fbGlua3Muc2VsZi5ocmVmO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGl0ZW0uX2xpbmtzICE9IG51bGwpIHtcclxuXHJcbiAgICAgIC8vdXBkYXRlIHJlbGF0aW9uc1xyXG4gICAgICBkZWxldGUgaXRlbS5jb25uZWN0aW9uO1xyXG4gICAgICBkZWxldGUgaXRlbS5zZXJ2aWNlO1xyXG4gICAgICBkZWxldGUgaXRlbS5zZWxlY3Rpb25TZXJ2aWNlO1xyXG5cclxuICAgICAgLy8gaWYgKGNhcnRvZ3JhcGh5Q29ubmVjdGlvbi5fbGlua3Muc2VsZi5ocmVmID09ICcnICYmIGNhcnRvZ3JhcGh5Q29ubmVjdGlvbikge1xyXG4gICAgICAvLyAgIGl0ZW0uZGVsZXRlUmVsYXRpb24oJ3NwYXRpYWxTZWxlY3Rpb25Db25uZWN0aW9uJywgY2FydG9ncmFwaHlDb25uZWN0aW9uKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgLy8gICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIC8vIH0gZWxzZSB7XHJcbiAgICAgIC8vICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ3NwYXRpYWxTZWxlY3Rpb25Db25uZWN0aW9uJywgY2FydG9ncmFwaHlDb25uZWN0aW9uKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgLy8gICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIC8vIH1cclxuXHJcbiAgICAgIGlmIChjYXJ0b2dyYXBoeVNlcnZpY2UuX2xpbmtzLnNlbGYuaHJlZiA9PSAnJykge1xyXG4gICAgICAgIGl0ZW0uZGVsZXRlUmVsYXRpb24oJ3NlcnZpY2UnLCBjYXJ0b2dyYXBoeVNlcnZpY2UpLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbignc2VydmljZScsIGNhcnRvZ3JhcGh5U2VydmljZSkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoY2FydG9ncmFwaHlTZWxlY3Rpb25TZXJ2aWNlLl9saW5rcy5zZWxmLmhyZWYgPT0gJycgJiYgY2FydG9ncmFwaHlTZWxlY3Rpb25TZXJ2aWNlKSB7XHJcbiAgICAgICAgaXRlbS5kZWxldGVSZWxhdGlvbignc3BhdGlhbFNlbGVjdGlvblNlcnZpY2UnLCBjYXJ0b2dyYXBoeVNlbGVjdGlvblNlcnZpY2UpLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbignc3BhdGlhbFNlbGVjdGlvblNlcnZpY2UnLCBjYXJ0b2dyYXBoeVNlbGVjdGlvblNlcnZpY2UpLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG5cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuQ0FSVE9HUkFQSFlfQVBJKSwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuXHJcbn1cclxuIiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcbmltcG9ydCB7Q2FydG9ncmFwaHl9IGZyb20gJy4vY2FydG9ncmFwaHkubW9kZWwnO1xyXG5pbXBvcnQge1JvbGV9IGZyb20gJy4uL3JvbGUvcm9sZS5tb2RlbCc7XHJcbi8qKlxyXG4gKiBDYXJ0b2dyYXBoeSBncm91cFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIENhcnRvZ3JhcGh5R3JvdXAgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgLyoqIGlkICovXHJcbiAgcHVibGljIGlkOiBudW1iZXI7ICBcclxuICAvKiogbmFtZSovXHJcbiAgcHVibGljIG5hbWU6IHN0cmluZztcclxuICAvKiogdHlwZSovXHJcbiAgcHVibGljIHR5cGU6IHN0cmluZztcclxuICAvKiogbWVtYmVycyovXHJcbiAgcHVibGljIG1lbWJlcnM6IENhcnRvZ3JhcGh5W107XHJcbiAgLyoqIHJvbGVzKi9cclxuICBwdWJsaWMgcm9sZXM6IFJvbGVbXTtcclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgQ2FydG9ncmFwaHlHcm91cCB9IGZyb20gJy4vY2FydG9ncmFwaHktZ3JvdXAubW9kZWwnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuXHJcbi8qKiBDYXJ0b2dyYXBoeUdyb3VwIG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBDYXJ0b2dyYXBoeUdyb3VwU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPENhcnRvZ3JhcGh5R3JvdXA+IHtcclxuICBcclxuXHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIENBUlRPR1JBUEhZX0dST1VQX0FQSSA9J2NhcnRvZ3JhcGh5LWdyb3Vwcyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKENhcnRvZ3JhcGh5R3JvdXAsIFwiY2FydG9ncmFwaHktZ3JvdXBzXCIsIGluamVjdG9yKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqIHJlbW92ZSBjYXJ0b2dyYXBoeSBncm91cCovXHJcbiAgcmVtb3ZlKGl0ZW06IENhcnRvZ3JhcGh5R3JvdXApIHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKGl0ZW0uX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgIFxyXG4gIH1cclxuICBcclxuICAvKiogc2F2ZSBjYXJ0b2dyYXBoeSBncm91cCovXHJcbiAgc2F2ZShpdGVtOiBDYXJ0b2dyYXBoeUdyb3VwKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgIGlmIChpdGVtLl9saW5rcyE9bnVsbCkge1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucHV0KGl0ZW0uX2xpbmtzLnNlbGYuaHJlZiwgaXRlbSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLkNBUlRPR1JBUEhZX0dST1VQX0FQSSkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG5pbXBvcnQgeyBUZXJyaXRvcnkgfSBmcm9tICcuLi90ZXJyaXRvcnkvdGVycml0b3J5Lm1vZGVsJztcclxuaW1wb3J0IHsgQ2FydG9ncmFwaHkgfSBmcm9tICcuL2NhcnRvZ3JhcGh5Lm1vZGVsJztcclxuLyoqXHJcbiAqIENhcnRvZ3JhcGh5IGF2YWlsYWJpbGl0eSBtb2RlbFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIENhcnRvZ3JhcGh5QXZhaWxhYmlsaXR5IGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiB0ZXJyaXRvcnkqL1xyXG4gIHB1YmxpYyB0ZXJyaXRvcnk6IFRlcnJpdG9yeTtcclxuICBcclxuICAvKiogc3lzdGVtIGNyZWF0ZWQgZGF0ZSovXHJcbiAgcHVibGljIGNyZWF0ZWREYXRlOiBhbnk7XHJcbiAgXHJcbiAgLyoqIGNhcnRvZ3JhcGh5Ki9cclxuICBwdWJsaWMgY2FydG9ncmFwaHk6IENhcnRvZ3JhcGh5O1xyXG59XHJcbiIsImltcG9ydCB7IENhcnRvZ3JhcGh5QXZhaWxhYmlsaXR5IH0gZnJvbSAnLi9jYXJ0b2dyYXBoeS1hdmFpbGFiaWxpdHkubW9kZWwnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuXHJcbi8qKiBDYXJ0b2dyYXBoeUF2YWlsYWJpbGl0eSBtYW5hZ2VyIHNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKSBcclxuZXhwb3J0IGNsYXNzIENhcnRvZ3JhcGh5QXZhaWxhYmlsaXR5U2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPENhcnRvZ3JhcGh5QXZhaWxhYmlsaXR5PiB7XHJcbiAgXHJcblxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBDQVJUT0dSQVBIWV9BVkFJTEFCSUxJVFlfQVBJID0gJ2NhcnRvZ3JhcGh5LWF2YWlsYWJpbGl0aWVzJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoQ2FydG9ncmFwaHlBdmFpbGFiaWxpdHksIFwiY2FydG9ncmFwaHktYXZhaWxhYmlsaXRpZXNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIGNhcnRvZ3JhcGh5IGF2YWlsYWJpbGl0eSovXHJcbiAgcmVtb3ZlKGl0ZW06IENhcnRvZ3JhcGh5QXZhaWxhYmlsaXR5KSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgY2FydG9ncmFwaHkgYXZhaWxhYmlsaXR5Ki9cclxuICBzYXZlKGl0ZW06IENhcnRvZ3JhcGh5QXZhaWxhYmlsaXR5KTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgIGlmIChpdGVtLl9saW5rcyE9bnVsbCkge1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucHV0KGl0ZW0uX2xpbmtzLnNlbGYuaHJlZiwgaXRlbSk7XHJcbiAgICAgIGlmIChpdGVtLmNhcnRvZ3JhcGh5ICE9bnVsbCl7XHJcbiAgICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbignY2FydG9ncmFwaHknLGl0ZW0uY2FydG9ncmFwaHkpLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICBcclxuICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChpdGVtLnRlcnJpdG9yeSAhPW51bGwpe1xyXG4gICAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ3RlcnJpdG9yeScsaXRlbS50ZXJyaXRvcnkpLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICBcclxuICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpdGVtLnRlcnJpdG9yeSA9IGl0ZW0udGVycml0b3J5Ll9saW5rcy5zZWxmLmhyZWY7XHJcbiAgICAgIGl0ZW0uY2FydG9ncmFwaHkgPSBpdGVtLmNhcnRvZ3JhcGh5Ll9saW5rcy5zZWxmLmhyZWY7XHJcbiAgXHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuQ0FSVE9HUkFQSFlfQVZBSUxBQklMSVRZX0FQSSkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG5pbXBvcnQgeyBUZXJyaXRvcnlUeXBlIH0gZnJvbSAnLi4vdGVycml0b3J5L3RlcnJpdG9yeS10eXBlLm1vZGVsJztcclxuaW1wb3J0IHsgQ2FydG9ncmFwaHkgfSBmcm9tICcuL2NhcnRvZ3JhcGh5Lm1vZGVsJztcclxuLyoqXHJcbiAqIENhcnRvZ3JhcGh5IGF2YWlsYWJpbGl0eSBtb2RlbFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIENhcnRvZ3JhcGh5RmlsdGVyIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gXHJcbiAgLyoqIG5hbWUqL1xyXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcblxyXG4gIC8qKiByZXF1aXJlZCAqL1xyXG4gIHB1YmxpYyByZXF1aXJlZDogYm9vbGVhbjtcclxuXHJcbiAgLyoqIHR5cGUqL1xyXG4gIHB1YmxpYyB0eXBlOiBzdHJpbmc7XHJcblxyXG4gIC8qKiBUZXJyaXRvcmlhbCBsZXZlbC4gKi9cclxuICBwdWJsaWMgdGVycml0b3JpYWxMZXZlbDogVGVycml0b3J5VHlwZTtcclxuICBcclxuICAvKiogY29sdW1uICovXHJcbiAgcHVibGljIGNvbHVtbjogc3RyaW5nO1xyXG5cclxuICAvKiogdmFsdWVzKi8gIFxyXG4gIHB1YmxpYyB2YWx1ZXM6IHN0cmluZztcclxuXHJcbiAgLyoqIHZhbHVlKi8gIFxyXG4gIHB1YmxpYyB2YWx1ZVR5cGU6IHN0cmluZztcclxuXHJcbiAgLyoqIGNhcnRvZ3JhcGh5Ki9cclxuICBwdWJsaWMgY2FydG9ncmFwaHk6IENhcnRvZ3JhcGh5O1xyXG5cclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgQ2FydG9ncmFwaHlGaWx0ZXIgfSBmcm9tICcuL2NhcnRvZ3JhcGh5LWZpbHRlci5tb2RlbCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5cclxuLyoqIENhcnRvZ3JhcGh5RmlsdGVyIG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpIFxyXG5leHBvcnQgY2xhc3MgQ2FydG9ncmFwaHlGaWx0ZXJTZXJ2aWNlIGV4dGVuZHMgUmVzdFNlcnZpY2U8Q2FydG9ncmFwaHlGaWx0ZXI+IHtcclxuICBcclxuXHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIENBUlRPR1JBUEhZX0ZJTFRFUl9BUEkgPSAnY2FydG9ncmFwaHktZmlsdGVycyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKENhcnRvZ3JhcGh5RmlsdGVyLCBcImNhcnRvZ3JhcGh5LWZpbHRlcnNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIGNhcnRvZ3JhcGh5IGZpbHRlciovXHJcbiAgcmVtb3ZlKGl0ZW06IENhcnRvZ3JhcGh5RmlsdGVyKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgY2FydG9ncmFwaHkgYXZhaWxhYmlsaXR5Ki9cclxuICBzYXZlKGl0ZW06IENhcnRvZ3JhcGh5RmlsdGVyKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgIGlmIChpdGVtLl9saW5rcyE9bnVsbCkge1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucHV0KGl0ZW0uX2xpbmtzLnNlbGYuaHJlZiwgaXRlbSk7XHJcbiAgICAgIGlmIChpdGVtLmNhcnRvZ3JhcGh5ICE9bnVsbCl7XHJcbiAgICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbignY2FydG9ncmFwaHknLGl0ZW0uY2FydG9ncmFwaHkpLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmKGl0ZW0udGVycml0b3JpYWxMZXZlbCAhPSBudWxsICYmIGl0ZW0udGVycml0b3JpYWxMZXZlbCAhPSB1bmRlZmluZWQgKXtcclxuICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbigndGVycml0b3JpYWxMZXZlbCcsaXRlbS50ZXJyaXRvcmlhbExldmVsKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH1cclxuICAgICBcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIFxyXG4gICAgICBpdGVtLmNhcnRvZ3JhcGh5ID0gaXRlbS5jYXJ0b2dyYXBoeS5fbGlua3Muc2VsZi5ocmVmO1xyXG4gICAgICBpdGVtLnRlcnJpdG9yaWFsTGV2ZWw9aXRlbS50ZXJyaXRvcmlhbExldmVsLl9saW5rcy5zZWxmLmhyZWY7XHJcbiAgICAgIFxyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLkNBUlRPR1JBUEhZX0ZJTFRFUl9BUEkpICwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBcclxufVxyXG4iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuaW1wb3J0IHtDYXJ0b2dyYXBoeX0gZnJvbSAnLi9jYXJ0b2dyYXBoeS5tb2RlbCc7IFxyXG4vKipcclxuICogU2VydmljZSBwYXJhbWV0ZXIgbW9kZWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBDYXJ0b2dyYXBoeVBhcmFtZXRlciBleHRlbmRzIFJlc291cmNlIHtcclxuICAvKiogbmFtZSovXHJcbiAgcHVibGljIG5hbWU6IHN0cmluZztcclxuICBcclxuICAvKiogdHlwZSovXHJcbiAgcHVibGljIHR5cGU6IHN0cmluZztcclxuICAgIFxyXG4gIC8qKiB2YWx1ZSovICBcclxuICBwdWJsaWMgdmFsdWU6IHN0cmluZztcclxuICBcclxuICAvKiogb3JkZXIqLyAgXHJcbiAgcHVibGljIG9yZGVyOiBzdHJpbmc7XHJcblxyXG4gIC8qKiBjYXJ0b2dyYXBoeSovXHJcbiAgcHVibGljIGNhcnRvZ3JhcGh5OiBDYXJ0b2dyYXBoeTtcclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgQ2FydG9ncmFwaHlQYXJhbWV0ZXIgfSBmcm9tICcuL2NhcnRvZ3JhcGh5LXBhcmFtZXRlci5tb2RlbCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5cclxuLyoqIFNlcnZpY2UgcGFyYW1ldGVyIG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpIFxyXG5leHBvcnQgY2xhc3MgQ2FydG9ncmFwaHlQYXJhbWV0ZXJTZXJ2aWNlIGV4dGVuZHMgUmVzdFNlcnZpY2U8Q2FydG9ncmFwaHlQYXJhbWV0ZXI+IHtcclxuXHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIENBUlRPR1JBUEhZX1BBUkFNRVRFUl9BUEkgPSAnY2FydG9ncmFwaHktcGFyYW1ldGVycyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKENhcnRvZ3JhcGh5UGFyYW1ldGVyLCBcImNhcnRvZ3JhcGh5LXBhcmFtZXRlcnNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIHNlcnZpY2UgcGFyYW1ldGVyKi9cclxuICByZW1vdmUoaXRlbTogQ2FydG9ncmFwaHlQYXJhbWV0ZXIpIHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKGl0ZW0uX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgIFxyXG4gIH1cclxuICBcclxuICAvKiogc2F2ZSBzZXJ2aWNlIHBhcmFtZXRlciovXHJcbiAgc2F2ZShpdGVtOiBDYXJ0b2dyYXBoeVBhcmFtZXRlcik6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICBpZiAoaXRlbS5fbGlua3MhPW51bGwpIHtcclxuICAgICAgXHJcbiAgICAgIFxyXG4gICAgICBpZiAoaXRlbS5jYXJ0b2dyYXBoeSAhPW51bGwpe1xyXG4gICAgICAgICAgbGV0IGNhcnRvZ3JhcGh5ID0gIGl0ZW0uY2FydG9ncmFwaHk7XHJcbiAgICAgICAgICBkZWxldGUgaXRlbS5jYXJ0b2dyYXBoeTtcclxuICAgICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCdjYXJ0b2dyYXBoeScsY2FydG9ncmFwaHkpLnN1YnNjcmliZShyZXN1bHQgPT4geyAgICAgICAgICAgIFxyXG4gICAgICAgICAgXHJcbiAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgfVxyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucHV0KGl0ZW0uX2xpbmtzLnNlbGYuaHJlZiwgaXRlbSk7XHJcbiAgICAgIFxyXG4gICAgICBcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGl0ZW0uY2FydG9ncmFwaHkgPSBpdGVtLmNhcnRvZ3JhcGh5Ll9saW5rcy5zZWxmLmhyZWY7XHJcbiAgXHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuQ0FSVE9HUkFQSFlfUEFSQU1FVEVSX0FQSSkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG5pbXBvcnQge0NhcnRvZ3JhcGh5R3JvdXB9IGZyb20gJy4vY2FydG9ncmFwaHktZ3JvdXAubW9kZWwnO1xyXG4vKipcclxuICogQmFja2dyb3VuZCBtb2RlbFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEJhY2tncm91bmQgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgLyoqIGlkICovXHJcbiAgcHVibGljIGlkOiBudW1iZXI7ICBcclxuICBcclxuICAvKiogbmFtZSovXHJcbiAgcHVibGljIG5hbWU6IHN0cmluZztcclxuXHJcbiAgLyoqIGRlc2NyaXB0aW9uKi9cclxuICBwdWJsaWMgZGVzY3JpcHRpb246IHN0cmluZztcclxuXHJcbiAgLyoqIGltYWdlICovXHJcbiAgcHVibGljIGltYWdlOiBzdHJpbmc7XHJcblxyXG4gIC8qKiB3aGV0aGVyIGJhY2tncm91bmQgaXMgYWN0aXZlKi9cclxuICBwdWJsaWMgYWN0aXZlOiBCb29sZWFuO1xyXG4gIFxyXG4gIC8qKiBzeXN0ZW0gY3JlYXRlZCBkYXRlKi9cclxuICBwdWJsaWMgY3JlYXRlZERhdGU6IGFueTtcclxuXHJcbiAgLyoqIGNhcnRvZ3JhcGh5IGdyb3VwKi9cclxuICBwdWJsaWMgY2FydG9ncmFwaHlHcm91cDogQ2FydG9ncmFwaHlHcm91cDtcclxufVxyXG4iLCJpbXBvcnQgeyBCYWNrZ3JvdW5kIH0gZnJvbSAnLi9iYWNrZ3JvdW5kLm1vZGVsJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcblxyXG4vKiogQmFja2dyb3VuZCBtYW5hZ2VyIHNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgQmFja2dyb3VuZFNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxCYWNrZ3JvdW5kPiB7XHJcblxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBCQUNLR1JPVU5EX0FQSSA9ICdiYWNrZ3JvdW5kcyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKEJhY2tncm91bmQsIFwiYmFja2dyb3VuZHNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIGJhY2tncm91bmQqL1xyXG4gIHJlbW92ZShpdGVtOiBCYWNrZ3JvdW5kKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpOyAgIFxyXG4gIH1cclxuICBcclxuICAvKiogc2F2ZSBiYWNrZ3JvdW5kKi9cclxuICBzYXZlKGl0ZW06IEJhY2tncm91bmQpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgbGV0IGJhY2tncm91bmRDYXJ0b2dyYXBoeUdyb3VwOmFueSA9IHt9ICAgICAgICAgXHJcbiAgICBcclxuICAgIGJhY2tncm91bmRDYXJ0b2dyYXBoeUdyb3VwLl9saW5rcz0ge307XHJcbiAgICBiYWNrZ3JvdW5kQ2FydG9ncmFwaHlHcm91cC5fbGlua3Muc2VsZiA9IHt9O1xyXG4gICAgYmFja2dyb3VuZENhcnRvZ3JhcGh5R3JvdXAuX2xpbmtzLnNlbGYuaHJlZj1cIlwiO1xyXG4gICAgaXRlbS5jYXJ0b2dyYXBoeUdyb3VwO1xyXG5cclxuICAgIGlmIChpdGVtLmNhcnRvZ3JhcGh5R3JvdXAhPW51bGwpe1xyXG4gICAgICBiYWNrZ3JvdW5kQ2FydG9ncmFwaHlHcm91cCA9IGl0ZW0uY2FydG9ncmFwaHlHcm91cDtcclxuICAgICAgICBpZiAodHlwZW9mIGl0ZW0uY2FydG9ncmFwaHlHcm91cC5fbGlua3MhPSAndW5kZWZpbmVkJykgeyBcclxuICAgICAgICAgICAgaXRlbS5jYXJ0b2dyYXBoeUdyb3VwID0gaXRlbS5jYXJ0b2dyYXBoeUdyb3VwLl9saW5rcy5zZWxmLmhyZWY7XHJcbiAgICAgICAgfSAgICBcclxuICAgICB9XHJcblxyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIC8vdXBkYXRlIHJlbGF0aW9uc1xyXG4gICAgICBkZWxldGUgaXRlbS5jYXJ0b2dyYXBoeUdyb3VwOyAgICAgICAgXHJcbiAgICAgIFxyXG4gICAgICBpZiAoYmFja2dyb3VuZENhcnRvZ3JhcGh5R3JvdXAuX2xpbmtzLnNlbGYuaHJlZj09Jycpe1xyXG4gICAgICAgICBpdGVtLmRlbGV0ZVJlbGF0aW9uKCdjYXJ0b2dyYXBoeUdyb3VwJyxiYWNrZ3JvdW5kQ2FydG9ncmFwaHlHcm91cCkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7ICAgICBcclxuXHJcbiAgICAgICAgICBcclxuICAgICAgICAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgICAgIFxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ2NhcnRvZ3JhcGh5R3JvdXAnLGJhY2tncm91bmRDYXJ0b2dyYXBoeUdyb3VwKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgICAgXHJcblxyXG4gICAgICBcclxuICAgICAgICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpOyAgICAgICAgICAgXHJcbiAgICAgICB9IFxyXG4gICAgICAgXHJcbiAgICAgICAgIFxyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucHV0KGl0ZW0uX2xpbmtzLnNlbGYuaHJlZiwgaXRlbSk7XHJcblxyXG4gICAgICAgICAgIFxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5CQUNLR1JPVU5EX0FQSSkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG5pbXBvcnQge1RyZWVOb2RlfSBmcm9tICcuL3RyZWUtbm9kZS5tb2RlbCc7XHJcbmltcG9ydCB7Um9sZX0gZnJvbSAnLi4vcm9sZS9yb2xlLm1vZGVsJzsgICAgXHJcbi8qKlxyXG4gKiBUcmVlIG1vZGVsXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgVHJlZSBleHRlbmRzIFJlc291cmNlIHtcclxuICAvKiogaWQgKi9cclxuICBwdWJsaWMgaWQ6IG51bWJlcjtcclxuICAvKiogbmFtZSAqL1xyXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgLyoqIGRlc2NyaXB0aW9uICovXHJcbiAgcHVibGljIGRlc2NyaXB0aW9uOiBzdHJpbmc7XHJcbiAgLyoqIGltYWdlICovXHJcbiAgcHVibGljIGltYWdlOiBzdHJpbmc7XHJcbiAgLyoqIG5vZGVzICovXHJcbiAgcHVibGljIG5vZGVzOiBUcmVlTm9kZVtdO1xyXG4gIC8qKiBhdmFpbGFibGUgcm9sZXMgKi9cclxuICBwdWJsaWMgYXZhaWxhYmxlUm9sZXMgOiBSb2xlW107XHJcblxyXG59XHJcbiIsImltcG9ydCB7IFRyZWUgfSBmcm9tICcuL3RyZWUubW9kZWwnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuXHJcbi8qKiBUcmVlIG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBUcmVlU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPFRyZWU+IHtcclxuICBcclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgVFJFRV9BUEkgPSAndHJlZXMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihUcmVlLCBcInRyZWVzXCIsIGluamVjdG9yKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqIHJlbW92ZSB0cmVlKi9cclxuICByZW1vdmUoaXRlbTogVHJlZSkge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIHRyZWUqL1xyXG4gIHNhdmUoaXRlbTogVHJlZSk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICBpZiAoaXRlbS5fbGlua3MhPW51bGwpIHtcclxuICAgICAgXHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuVFJFRV9BUEkpICwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBcclxufVxyXG4iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuaW1wb3J0IHtDYXJ0b2dyYXBoeX0gZnJvbSAnLi4vY2FydG9ncmFwaHkvY2FydG9ncmFwaHkubW9kZWwnO1xyXG5pbXBvcnQge1RyZWV9IGZyb20gJy4vdHJlZS5tb2RlbCc7XHJcbi8qKlxyXG4gKiBUcmVlIG5vZGUgbW9kZWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBUcmVlTm9kZSBleHRlbmRzIFJlc291cmNlIHtcclxuICAvKiogbmFtZSAqL1xyXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgLyoqIHRvb2x0aXAqL1xyXG4gIHB1YmxpYyB0b29sdGlwOiBzdHJpbmc7XHJcbiAgLyoqIGRlc2NyaXB0aW9uKi9cclxuICBwdWJsaWMgZGVzY3JpcHRpb246IHN0cmluZztcclxuICAvKiogZGF0YXNldFVSTCovXHJcbiAgcHVibGljIGRhdGFzZXRVUkw6IHN0cmluZztcclxuICAvKiogbWV0YWRhdGFVUkwqL1xyXG4gIHB1YmxpYyBtZXRhZGF0YVVSTDogc3RyaW5nO1xyXG4gIC8qKiBvcmRlciovXHJcbiAgcHVibGljIG9yZGVyIDogbnVtYmVyO1xyXG4gIC8qKiB3aGV0aGVyIHRyZWUgbm9kZSBpcyBhY3RpdmUqL1xyXG4gIHB1YmxpYyBhY3RpdmU6IGJvb2xlYW47XHJcbiAgLyoqIHBhcmVudCB0cmVlIG5vZGUgKi9cclxuICBwdWJsaWMgcmFkaW86IGJvb2xlYW47XHJcbiAgLyoqIHBhcmVudCB0cmVlIG5vZGUgKi9cclxuICBwdWJsaWMgcGFyZW50OiBUcmVlTm9kZTtcclxuICAvKiogZGlzcGxheWVkIGNhcnRvZ3JhcGh5ICovICBcclxuICBwdWJsaWMgY2FydG9ncmFwaHk6IENhcnRvZ3JhcGh5O1xyXG4gIC8qKiB0cmVlICovICBcclxuICBwdWJsaWMgdHJlZTogVHJlZTtcclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgVHJlZU5vZGUgfSBmcm9tICcuL3RyZWUtbm9kZS5tb2RlbCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5cclxuLyoqIFRyZWUgbm9kZSBtYW5hZ2VyIHNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKSBcclxuZXhwb3J0IGNsYXNzIFRyZWVOb2RlU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPFRyZWVOb2RlPiB7XHJcbiAgXHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIFRSRUVfTk9ERV9BUEkgPSAndHJlZS1ub2Rlcyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKFRyZWVOb2RlLCBcInRyZWUtbm9kZXNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIHRyZWUgbm9kZSovXHJcbiAgcmVtb3ZlKGl0ZW06IFRyZWVOb2RlKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgdHJlZSBub2RlKi9cclxuICBzYXZlKGl0ZW06IFRyZWVOb2RlKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgIGlmIChpdGVtLl9saW5rcyE9bnVsbCkge1xyXG4gICAgICBjb25zdCBpdGVtVHJlZSA9IGl0ZW0udHJlZTtcclxuICAgICAgY29uc3QgaXRlbUNhcnRvZ3JhcGh5ID0gaXRlbS5jYXJ0b2dyYXBoeTtcclxuICAgICAgY29uc3QgaXRlbVBhcmVudCA9IGl0ZW0ucGFyZW50O1xyXG4gICAgICAgIFxyXG4gICAgICBkZWxldGUgaXRlbS50cmVlO1xyXG4gICAgICBkZWxldGUgaXRlbS5jYXJ0b2dyYXBoeTtcclxuICAgICAgZGVsZXRlIGl0ZW0ucGFyZW50O1xyXG4gICAgICAgIFxyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucHV0KGl0ZW0uX2xpbmtzLnNlbGYuaHJlZiwgaXRlbSk7XHJcbiAgICAgIGlmIChpdGVtVHJlZSAhPW51bGwpe1xyXG4gICAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ3RyZWUnLGl0ZW1UcmVlKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgXHJcbiAgICAgICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGl0ZW1DYXJ0b2dyYXBoeSAhPW51bGwpe1xyXG4gICAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ2NhcnRvZ3JhcGh5JyxpdGVtQ2FydG9ncmFwaHkpLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICBcclxuICAgICAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoaXRlbVBhcmVudCAhPW51bGwpe1xyXG4gICAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ3BhcmVudCcsaXRlbVBhcmVudCkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgIFxyXG4gICAgICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2V7XHJcbiAgICAgICAgICBsZXQgdHJlZU5vZGVQYXJlbnQ6YW55ID0ge307XHJcbiAgICAgICAgICB0cmVlTm9kZVBhcmVudC5fbGlua3M9IHt9O1xyXG4gICAgICAgICAgdHJlZU5vZGVQYXJlbnQuX2xpbmtzLnNlbGYgPSB7fTtcclxuICAgICAgICAgIHRyZWVOb2RlUGFyZW50Ll9saW5rcy5zZWxmLmhyZWY9XCJcIjtcclxuICAgICAgICAgIGl0ZW0uZGVsZXRlUmVsYXRpb24oJ3BhcmVudCcsIHRyZWVOb2RlUGFyZW50KS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAoaXRlbS50cmVlICYmIGl0ZW0udHJlZS5fbGlua3MgJiYgaXRlbS50cmVlLl9saW5rcy5zZWxmKSB7XHJcbiAgICAgICAgaXRlbS50cmVlID0gaXRlbS50cmVlLl9saW5rcy5zZWxmLmhyZWY7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGl0ZW0uY2FydG9ncmFwaHkgJiYgaXRlbS5jYXJ0b2dyYXBoeS5fbGlua3MgJiYgaXRlbS5jYXJ0b2dyYXBoeS5fbGlua3Muc2VsZikge1xyXG4gICAgICAgIGl0ZW0uY2FydG9ncmFwaHkgPSBpdGVtLmNhcnRvZ3JhcGh5Ll9saW5rcy5zZWxmLmhyZWY7XHJcbiAgICAgIH0gICAgICBcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5UUkVFX05PREVfQVBJKSAsIGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgXHJcbn1cclxuIiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcbmltcG9ydCB7VHJlZX0gZnJvbSAnLi4vdHJlZS90cmVlLm1vZGVsJztcclxuaW1wb3J0IHtSb2xlfSBmcm9tICcuLi9yb2xlL3JvbGUubW9kZWwnO1xyXG5pbXBvcnQge0NhcnRvZ3JhcGh5R3JvdXB9IGZyb20gJy4uL2NhcnRvZ3JhcGh5L2NhcnRvZ3JhcGh5LWdyb3VwLm1vZGVsJztcclxuaW1wb3J0IHtBcHBsaWNhdGlvblBhcmFtZXRlcn0gZnJvbSAnLi9hcHBsaWNhdGlvbi1wYXJhbWV0ZXIubW9kZWwnO1xyXG5pbXBvcnQge0FwcGxpY2F0aW9uQmFja2dyb3VuZH0gZnJvbSAnLi9hcHBsaWNhdGlvbi1iYWNrZ3JvdW5kLm1vZGVsJztcclxuXHJcbi8vRklYTUUgZW5zdXJlIGFwcGxpY2F0aW9uIGNyZWF0aW9uIGluIGFkbWluIGFwcCB1cG9uIGluaXRpYWxpemF0aW9uIChhcyBpdCBpcyBkb25lIHdpdGggUm9sZXMgYW5kIGRlZmF1bHQgVXNlcnMpXHJcbi8qKiBUZXJyaXRvcmlhbCBhcHBsaWN0aW9uIG5hbWUgKi9cclxuZXhwb3J0IGNvbnN0IFRFUlJJVE9SSUFMX0FQUF9OQU1FOnN0cmluZyAgPSBcIkFwbGljYWNpw4PCs24gVGVycml0b3JpYWxcIjtcclxuXHJcbi8qKlxyXG4gKiBBcHBsaWNhdGlvbiBtb2RlbFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEFwcGxpY2F0aW9uIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiBpZCAqL1xyXG4gIHB1YmxpYyBpZDogbnVtYmVyOyAgXHJcbiAgXHJcbiAgLyoqIG5hbWUqL1xyXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcblxyXG4gIC8qKiB0eXBlKi9cclxuICBwdWJsaWMgdHlwZTogc3RyaW5nO1xyXG4gIFxyXG4gIC8qKiB0aXRsZSovXHJcbiAgcHVibGljIHRpdGxlOiBzdHJpbmc7XHJcbiAgXHJcbiAgLyoqIHRoZW1lKi9cclxuICBwdWJsaWMgdGhlbWU6IHN0cmluZztcclxuXHJcbiAgICBcclxuICAvKiogdXJsVGVtcGxhdGUqL1xyXG4gIHB1YmxpYyBqc3BUZW1wbGF0ZTogc3RyaW5nO1xyXG4gIFxyXG4gIFxyXG4gIC8qKiBzeXN0ZW0gY3JlYXRlZCBkYXRlKi9cclxuICBwdWJsaWMgY3JlYXRlZERhdGU6IGFueTtcclxuICBcclxuICAvKiogYXZhaWxhYmxlIHJvbGVzKi9cclxuICBwdWJsaWMgYXZhaWxhYmxlUm9sZXMgOiBSb2xlW107XHJcbiAgXHJcbiAgLyoqIHRyZWVzKi9cclxuICBwdWJsaWMgdHJlZXMgOiBUcmVlW107XHJcbiAgXHJcbiAgLyoqIHNjYWxlcyAoY29tbWEtc2VwYXJhdGVkIHZhbHVlcykqL1xyXG4gIHB1YmxpYyBzY2FsZXM6IHN0cmluZ1tdO1xyXG4gIFxyXG4gIC8qKiBwcm9qZWN0aW9ucyhjb21tYS1zZXBhcmF0ZWQgRVBTRyBjb2RlcykqL1xyXG4gIHB1YmxpYyBzcnM6IHN0cmluZztcclxuICBcclxuICAvKiogd2hldGhlciBhcHBsaWNhdGlvbiB0cmVlIHdpbGwgYXV0byByZWZyZXNoKi8gIFxyXG4gIHB1YmxpYyB0cmVlQXV0b1JlZnJlc2g6IEJvb2xlYW47XHJcblxyXG4gIC8qKiBiYWNrZ3JvdW5kcyovXHJcbiAgcHVibGljIGJhY2tncm91bmRzOiBBcHBsaWNhdGlvbkJhY2tncm91bmRbXTtcclxuXHJcbiAgLyoqIHNpdHVhdGlvbiBtYXAqL1xyXG4gIHB1YmxpYyBzaXR1YXRpb25NYXA6IENhcnRvZ3JhcGh5R3JvdXA7ICAgIFxyXG4gIFxyXG4gIC8qKiBwYXJhbWV0ZXJzKi9cclxuICBwdWJsaWMgcGFyYW1ldGVyczogQXBwbGljYXRpb25QYXJhbWV0ZXJbXTtcclxufVxyXG4iLCJpbXBvcnQgeyBBcHBsaWNhdGlvbiB9IGZyb20gJy4vYXBwbGljYXRpb24ubW9kZWwnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQ2FydG9ncmFwaHlHcm91cCB9IGZyb20gJy4uL2NhcnRvZ3JhcGh5L2NhcnRvZ3JhcGh5LWdyb3VwLm1vZGVsJztcclxuXHJcbi8qKiBBcHBsaWNhdGlvbiBtYW5hZ2VyIHNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgQXBwbGljYXRpb25TZXJ2aWNlIGV4dGVuZHMgUmVzdFNlcnZpY2U8QXBwbGljYXRpb24+IHtcclxuICBcclxuXHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIEFQUExJQ0FUSU9OX0FQSSA9ICdhcHBsaWNhdGlvbnMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihBcHBsaWNhdGlvbiwgXCJhcHBsaWNhdGlvbnNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIGFwcGxpY2F0aW9uKi9cclxuICByZW1vdmUoaXRlbTogQXBwbGljYXRpb24pIHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKGl0ZW0uX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgIFxyXG4gIH1cclxuICBcclxuICAvKiogc2F2ZSBhcHBsaWNhdGlvbiovXHJcbiAgc2F2ZShpdGVtOiBBcHBsaWNhdGlvbik6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcblxyXG4gICAgbGV0IGFwcGxpY2F0aW9uU2l0dWF0aW9uTWFwOmFueSA9IHt9O1xyXG4gICAgYXBwbGljYXRpb25TaXR1YXRpb25NYXAuX2xpbmtzPSB7fTtcclxuICAgIGFwcGxpY2F0aW9uU2l0dWF0aW9uTWFwLl9saW5rcy5zZWxmID0ge307XHJcbiAgICBhcHBsaWNhdGlvblNpdHVhdGlvbk1hcC5fbGlua3Muc2VsZi5ocmVmPVwiXCI7XHJcbiAgICAgXHJcbiAgICBpZiAoaXRlbS5zaXR1YXRpb25NYXAhPW51bGwpe1xyXG4gICAgICAgIGFwcGxpY2F0aW9uU2l0dWF0aW9uTWFwPWl0ZW0uc2l0dWF0aW9uTWFwO1xyXG4gICAgICAgIGlmICh0eXBlb2YgaXRlbS5zaXR1YXRpb25NYXAuX2xpbmtzIT0gJ3VuZGVmaW5lZCcpIHsgXHJcbiAgICAgICAgICAgIGl0ZW0uc2l0dWF0aW9uTWFwID0gaXRlbS5zaXR1YXRpb25NYXAuX2xpbmtzLnNlbGYuaHJlZjtcclxuICAgICAgICB9ICAgICAgIFxyXG4gICAgIH1cclxuXHJcbiAgICBpZiAoaXRlbS5fbGlua3MhPW51bGwpIHtcclxuICAgICAgLy91cGRhdGUgcmVsYXRpb25zXHJcbiAgICAgIGRlbGV0ZSBpdGVtLnNpdHVhdGlvbk1hcDsgICAgICAgIFxyXG4gICAgICBcclxuICAgICAgaWYgKGFwcGxpY2F0aW9uU2l0dWF0aW9uTWFwLl9saW5rcy5zZWxmLmhyZWY9PScnKXtcclxuICAgICAgICAgaXRlbS5kZWxldGVSZWxhdGlvbignc2l0dWF0aW9uTWFwJyxhcHBsaWNhdGlvblNpdHVhdGlvbk1hcCkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7ICAgICBcclxuICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG4gICAgICAgICAgXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbignc2l0dWF0aW9uTWFwJyxhcHBsaWNhdGlvblNpdHVhdGlvbk1hcCkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgICAgIFxyXG4gICAgICBcclxuICAgICAgICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpOyAgICAgICAgICAgXHJcbiAgICAgICB9IFxyXG4gICAgICAgXHJcbiAgICAgICAgIFxyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucHV0KGl0ZW0uX2xpbmtzLnNlbGYuaHJlZiwgaXRlbSk7XHJcblxyXG4gICAgICAgICAgIFxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5BUFBMSUNBVElPTl9BUEkpICwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICAgIFxyXG4gICAgXHJcbiAgXHJcbn1cclxuIiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcbmltcG9ydCB7QmFja2dyb3VuZH0gZnJvbSAnLi4vY2FydG9ncmFwaHkvYmFja2dyb3VuZC5tb2RlbCc7XHJcbmltcG9ydCB7QXBwbGljYXRpb259IGZyb20gJy4vYXBwbGljYXRpb24ubW9kZWwnOyBcclxuXHJcbi8qKlxyXG4gKiBBcHBsaWNhdGlvbiBiYWNrZ3JvdW5kIG1vZGVsXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgQXBwbGljYXRpb25CYWNrZ3JvdW5kIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiBvcmRlciovXHJcbiAgcHVibGljIG9yZGVyOiBOdW1iZXI7XHJcbiAgXHJcbiAgLyoqIGJhY2tncm91bmQqL1xyXG4gIHB1YmxpYyBiYWNrZ3JvdW5kOiBCYWNrZ3JvdW5kO1xyXG4gIFxyXG4gIC8qKiBhcHBsaWNhdGlvbiovXHJcbiAgcHVibGljIGFwcGxpY2F0aW9uOiBBcHBsaWNhdGlvbjtcclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgQXBwbGljYXRpb25CYWNrZ3JvdW5kIH0gZnJvbSAnLi9hcHBsaWNhdGlvbi1iYWNrZ3JvdW5kLm1vZGVsJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcblxyXG4vKiogQXBwbGljYXRpb24gYmFja2dyb3VuZCBtYW5hZ2VyIHNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKSBcclxuZXhwb3J0IGNsYXNzIEFwcGxpY2F0aW9uQmFja2dyb3VuZFNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxBcHBsaWNhdGlvbkJhY2tncm91bmQ+IHtcclxuICBcclxuXHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIEFQUExJQ0FUSU9OX0JBQ0tHUk9VTkRfQVBJID0nYXBwbGljYXRpb24tYmFja2dyb3VuZHMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihBcHBsaWNhdGlvbkJhY2tncm91bmQsIFwiYXBwbGljYXRpb24tYmFja2dyb3VuZHNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIGFwcGxpY2F0aW9uIGJhY2tncm91bmQqL1xyXG4gIHJlbW92ZShpdGVtOiBBcHBsaWNhdGlvbkJhY2tncm91bmQpIHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKGl0ZW0uX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgIFxyXG4gIH1cclxuICBcclxuICAvKiogc2F2ZSBhcHBsaWNhdGlvbiBiYWNrZ3JvdW5kKi9cclxuICBzYXZlKGl0ZW06IEFwcGxpY2F0aW9uQmFja2dyb3VuZCk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICBpZiAoaXRlbS5fbGlua3MhPW51bGwpIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgICBpZiAoaXRlbS5hcHBsaWNhdGlvbiAhPW51bGwpe1xyXG4gICAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ2FwcGxpY2F0aW9uJyxpdGVtLmFwcGxpY2F0aW9uKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgXHJcbiAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoaXRlbS5iYWNrZ3JvdW5kICE9bnVsbCl7XHJcbiAgICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbignYmFja2dyb3VuZCcsaXRlbS5iYWNrZ3JvdW5kKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgXHJcbiAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGl0ZW0uYXBwbGljYXRpb24gPSBpdGVtLmFwcGxpY2F0aW9uLl9saW5rcy5zZWxmLmhyZWY7XHJcbiAgICAgIGl0ZW0uYmFja2dyb3VuZCA9IGl0ZW0uYmFja2dyb3VuZC5fbGlua3Muc2VsZi5ocmVmO1xyXG4gIFxyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLkFQUExJQ0FUSU9OX0JBQ0tHUk9VTkRfQVBJKSAsIGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgXHJcbn1cclxuIiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcbmltcG9ydCB7QXBwbGljYXRpb259IGZyb20gJy4vYXBwbGljYXRpb24ubW9kZWwnOyBcclxuXHJcbi8qKlxyXG4gKiBBcHBsaWNhdGlvbiBwYXJhbWV0ZXIgbW9kZWwgXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgQXBwbGljYXRpb25QYXJhbWV0ZXIgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgLyoqIG5hbWUqL1xyXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgXHJcbiAgLyoqIHR5cGUqL1xyXG4gIHB1YmxpYyB0eXBlOiBzdHJpbmc7XHJcbiAgXHJcbiAgLyoqIHZhbHVlKi8gICAgXHJcbiAgcHVibGljIHZhbHVlOiBzdHJpbmc7XHJcbiAgXHJcbiAgLyoqIGFwcGxpY2F0aW9uKi9cclxuICBwdWJsaWMgYXBwbGljYXRpb246IEFwcGxpY2F0aW9uO1xyXG5cclxufVxyXG4iLCJpbXBvcnQgeyBBcHBsaWNhdGlvblBhcmFtZXRlciB9IGZyb20gJy4vYXBwbGljYXRpb24tcGFyYW1ldGVyLm1vZGVsJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcblxyXG4vKiogQXBwbGljYXRpb24gcGFyYW1ldGVyIG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpIFxyXG5leHBvcnQgY2xhc3MgQXBwbGljYXRpb25QYXJhbWV0ZXJTZXJ2aWNlIGV4dGVuZHMgUmVzdFNlcnZpY2U8QXBwbGljYXRpb25QYXJhbWV0ZXI+IHtcclxuICBcclxuXHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIEFQUExJQ0FUSU9OX1BBUkFNRVRFUl9BUEkgPSAnYXBwbGljYXRpb24tcGFyYW1ldGVycyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKEFwcGxpY2F0aW9uUGFyYW1ldGVyLCBcImFwcGxpY2F0aW9uLXBhcmFtZXRlcnNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIGFwcGxpY2F0aW9uKi9cclxuICByZW1vdmUoaXRlbTogQXBwbGljYXRpb25QYXJhbWV0ZXIpIHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKGl0ZW0uX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgIFxyXG4gIH1cclxuICBcclxuICAvKiogc2F2ZSBhcHBsaWNhdGlvbiovXHJcbiAgc2F2ZShpdGVtOiBBcHBsaWNhdGlvblBhcmFtZXRlcik6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICBpZiAoaXRlbS5fbGlua3MhPW51bGwpIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgICBpZiAoaXRlbS5hcHBsaWNhdGlvbiAhPW51bGwpe1xyXG4gICAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ2FwcGxpY2F0aW9uJyxpdGVtLmFwcGxpY2F0aW9uKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgXHJcbiAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGl0ZW0uYXBwbGljYXRpb24gPSBpdGVtLmFwcGxpY2F0aW9uLl9saW5rcy5zZWxmLmhyZWY7XHJcbiAgXHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuQVBQTElDQVRJT05fUEFSQU1FVEVSX0FQSSkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG4vKipcclxuICogQ29ubmVjdGlvbiBtb2RlbFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIENvZGVMaXN0IGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiBpZCAqL1xyXG4gIHB1YmxpYyBpZDogbnVtYmVyO1xyXG4gIC8qKiBuYW1lKi9cclxuICBwdWJsaWMgY29kZUxpc3ROYW1lOiBzdHJpbmc7XHJcbiAgLyoqIHR5cGUqL1xyXG4gIHB1YmxpYyB2YWx1ZTogc3RyaW5nO1xyXG4gIC8qKiB1c2VyKi9cclxuICBwdWJsaWMgZGVzY3JpcHRpb246IHN0cmluZztcclxuXHJcblxyXG59XHJcbiIsImltcG9ydCB7IENvZGVMaXN0IH0gZnJvbSAnLi9jb2RlbGlzdC5tb2RlbCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5cclxuLyoqIENvbm5lY3Rpb24gbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIENvZGVMaXN0U2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPENvZGVMaXN0PiB7XHJcbiAgXHJcbiBcclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgQ09ERUxJU1RfQVBJID0gJ2NvZGVsaXN0LXZhbHVlcyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKENvZGVMaXN0LCBcImNvZGVsaXN0LXZhbHVlc1wiLCBpbmplY3Rvcik7XHJcbiAgfVxyXG4gIFxyXG4gIC8qKiByZW1vdmUgY29ubmVjdGlvbiovXHJcbiAgcmVtb3ZlKGl0ZW06IENvZGVMaXN0KSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgY29ubmVjdGlvbiovXHJcbiAgc2F2ZShpdGVtOiBDb2RlTGlzdCk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICBpZiAoaXRlbS5fbGlua3MhPW51bGwpIHtcclxuICAgICAgXHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuQ09ERUxJU1RfQVBJICksIGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgXHJcbn1cclxuIiwiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBCZWhhdmlvclN1YmplY3QsIE9ic2VydmFibGUsIG9mIH0gZnJvbSAncnhqcyc7XHJcblxyXG4vKiogTGF5ZXIgbW9kZWw6IGNvbmZpZ3VyZSBMYXllciBkYXRhIGFuZCBkaXNwbGF5aW5nIGNvbmZpZ3VyYXRpb24gKi8gXHJcbmV4cG9ydCBjbGFzcyBMYXllciB7XHJcbiAgLy8gRGlzcGxheSBkYXRhXHJcbiAgLyoqIGxheWVyIHZpc2liaWxpdHkqLyAgXHJcbiAgdmlzaWJpbGl0eTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIC8qKiBUcmFuc3BhcmVuY3kgKFRyYW5zcGFyZW50KSAwLTEgKE9wYXF1ZSkqL1xyXG4gIG9wYWNpdHk6IG51bWJlciA9IDEuMDtcclxuXHJcbiAgLy8gQ29uZmlndXJhdGlvbiBkYXRhXHJcbiAgLyoqIHRpdGxlKi9cclxuICB0aXRsZTogc3RyaW5nO1xyXG4gIFxyXG4gIC8qKiBJZCB0byBpbmRleCovXHJcbiAgaWQ6IGFueTtcclxuICBcclxuICAvKiogU2VydmljZSBOYW1lKi9cclxuICBzZXJ2ZXJOYW1lOiBzdHJpbmc7XHJcblxyXG4gIC8qKiBTZXJ2aWNlIGF0dHJpYnV0aW9ucyovXHJcbiAgYXR0cmlidXRpb25zOiBzdHJpbmcgPSBcIlwiO1xyXG5cclxuICAvKiogUmVxdWVzdCBmb3JtYXQgKGltYWdlL2pwZywgLi4uKSovXHJcbiAgZm9ybWF0OiBzdHJpbmc7XHJcbiAgXHJcbiAgLyoqIFJlcXVlc3Qgc2VydmljZSB2ZXJzaW9uKi9cclxuICB2ZXJzaW9uOnN0cmluZztcclxuXHJcbiAgLyoqIFNlcnZpY2UgdXJsKi9cclxuICB1cmw6IHN0cmluZztcclxuXHJcbiAgLyoqIElzIGJhc2UgbGF5ZXI/Ki9cclxuICBpc0Jhc2VMYXllcjogYm9vbGVhbjtcclxuXHJcbiAgLyoqIFJlcXVlc3QgbGF5ZXIgbmFtZSovXHJcbiAgbmFtZTogc3RyaW5nO1xyXG5cclxuICAvKiogSXMgdGlsZWQ/Ki9cclxuICB0aWxlZDogYm9vbGVhbjtcclxuICBcclxuICAvKiogRGVzY3JpcHRpb24qL1xyXG4gIGRlc2M6IHN0cmluZyA9IFwiXCI7XHJcbiAgXHJcbiAgLyoqICBUcmFuc3BhcmVudCByZXF1ZXN0IHBhcmFtZXRlcj8qL1xyXG4gIHVybF90cmFuc3BhcmVudDogc3RyaW5nID0gXCJ0cnVlXCI7XHJcbiAgXHJcbiAgLyoqIFJlcXVlc3QgQmFja2dyb3VuZCBwYXJhbWV0ZXIgY29sb3IgKEhleGEpKi9cclxuICB1cmxfYmdjb2xvcjogc3RyaW5nID0gXCIweDAwMDAwMFwiO1xyXG4gIFxyXG4gIC8qKiBSZXF1ZXN0IEV4Y2VwdGlvbiBVUkwqL1xyXG4gIHVybF9leGNlcHRpb246IHN0cmluZztcclxuICBcclxuICAvKiogRXh0ZW50IGZvciB0aWxlZCBzZXJ2aWNlcyovXHJcbiAgZXh0ZW50OiBhbnkgPSBudWxsO1xyXG5cclxuICAvKiogVGlsZSBoZWlnaHQgKGlmIG5vdCBkZWZpbmVkLCB0aGUgZGVmYXVsdCBtYXAgaXMgdGFrZW4pKi9cclxuICB0aWxlSGVpZ2h0PzpudW1iZXI7XHJcbiAgXHJcbiAgLyoqIFRpbGUgd2lkdGggKGlmIG5vdCBkZWZpbmVkLCB0aGUgZGVmYXVsdCBtYXAgaXMgdGFrZW4pKi9cclxuICB0aWxlV2lkdGg/Om51bWJlcjtcclxuICBcclxuICAvKiogRW5hYmxlZCBmb3IgR2V0RmVhdHVyZUluZm8gcmVxdWVzdHMgKGVuYWJsZWQgdG8gdXNlIHRoZSB2aWV3ZXIgZmVhdHVyZXMgaW5mb3JtYXRpb24gdG9vbCkqL1xyXG4gIHF1ZXJ5YWJsZT86Ym9vbGVhbiA9IGZhbHNlO1xyXG4gIFxyXG4gIC8qKiBNaW5pbXVtIHNjYWxlKi9cclxuICBtaW5pbXVtU2NhbGU/Om51bWJlcjtcclxuICBcclxuICAvKiogTWF4aW11bSBzY2FsZSovXHJcbiAgbWF4aW11bVNjYWxlPzpudW1iZXI7XHJcbiAgXHJcbiAgLyoqIExpc3Qgb2YgYXZhaWxhYmxlIENSUyovXHJcbiAgcHJvamVjdGlvbnM/OnN0cmluZztcclxuICBcclxuICAvKiogRmVhdHVyZXMgaW5mb3JtYXRpb24gVVJMKi9cclxuICBpbmZvVXJsPzpzdHJpbmc7XHJcbiAgXHJcbiAgLyoqIE1ldGFkYXRhIGluZm9ybWF0aW9uIFVSTCovXHJcbiAgbWV0YWRhdGFVcmw/OnN0cmluZztcclxuICBcclxuICAvKiogTGVnZW5kIFVSTCovXHJcbiAgbGVnZW5kVXJsPzpzdHJpbmc7XHJcbiAgXHJcbiAgLyoqIEFycmF5IG9mIE9wdGlvbmFsUGFyYW1ldGVyIG9iamVjdCB0aGF0IGRlZmluZXMgb3RoZXIgb3B0aW9uYWwgcGFyYW1ldGVyLXZhbHVlIHBhaXJzIGZvciB0aGUgcmVxdWVzdCAoVElNRSAuLi4pKi9cclxuICBvcHRpb25hbFBhcmFtZXRlcnM/OkFycmF5PE9wdGlvbmFsUGFyYW1ldGVyPjtcclxufVxyXG5cclxuLyoqIE9wdGlvbmFsIHBhcmFtZXRlciBtb2RlbDogY29uZmlndXJlIHBhcmFtZXRlci12YWx1ZSBwYWlyIHRvIGFkZCB0byB0aGUgcmVxdWVzdCBsYXllciBVUkwgKi9cclxuZXhwb3J0IGNsYXNzIE9wdGlvbmFsUGFyYW1ldGVyIHtcclxuICAvKioga2V5Ki9rZXk6c3RyaW5nO1xyXG4gIC8qKiB2YWx1ZSovdmFsdWU6c3RyaW5nO1xyXG59XHJcblxyXG4vKiogTGF5ZXIgY29uZmlndXJhdGlvbiBtb2RlbDogbW9kaWZ5IHRoZSBjb25maWd1cmF0aW9uIG9mIGEgbGF5ZXIgd2hlbiBpbnRlcmFjdGluZyB3aXRoIHRoZSBtYXAgKG1ha2UgdmlzaWJsZSwgbW92ZSB0aGUgbGF5ZXIgLi4uKSAqL1xyXG5leHBvcnQgY2xhc3MgTGF5ZXJDb25maWd1cmF0aW9uIHtcclxuICAvKiogSWRlbnRpZmllciB0byBpbmRleCovaWQ6IGFueTtcclxuICAvKiogTGF5ZXIgdmlzaWJpbGl0eSovdmlzaWJpbGl0eTogYm9vbGVhbjtcclxuICAvKiogTGF5ZXIgdHJhbnNwYXJlbmN5IChUcmFuc3BhcmVudCkgMC0xIChPcGFxdWUpKi9vcGFjaXR5OiBudW1iZXI7XHJcbiAgLyoqIExheWVyIHBvc2l0aW9uKi9wb3NpdGlvbjogbnVtYmVyO1xyXG59XHJcblxyXG4vKiogTGF5ZXIgZ3JvdXAgbW9kZWwqL1xyXG5leHBvcnQgY2xhc3MgTGF5ZXJHcm91cCB7XHJcbiAgLyoqIGluaXRpYWxseSBhY3RpdmF0ZWQgKGFsbCB2aXNpYmxlIGxheWVycykqL2FjdGl2ZT86Ym9vbGVhbjtcclxuICAvKiogZ3JvdXAgbmFtZSovbmFtZT86IFN0cmluZztcclxuICAvKiogZ3JvdXAgaWQqL2lkOiBTdHJpbmc7XHJcbiAgLyoqIGFycmF5IG9mIGNoaWxkIExheWVycyovbGF5ZXJzOiBBcnJheTxMYXllcj47XHJcbn1cclxuXHJcbi8qKiBNYXAgb3B0aW9ucyBjb25maWd1cmF0aW9uIG1vZGVsKi9cclxuZXhwb3J0IGNsYXNzIE1hcE9wdGlvbnNDb25maWd1cmF0aW9uIHtcclxuICAvKiogc2NhbGVzKi9zY2FsZXM/OiBzdHJpbmc7XHJcbiAgLyoqIHByb2plY3Rpb25zKi9wcm9qZWN0aW9ucz86IHN0cmluZztcclxuICAvKiogbWluaW11bSBzY2FsZSovbWluU2NhbGU/Om51bWJlcjtcclxuICAvKiogbWF4aW11bSBzY2FsZSovbWF4U2NhbGU/Om51bWJlcjtcclxuICAvKiogZXh0ZW50Ki9leHRlbnQ/OmFueTtcclxuICAvKiogbWF4aW11bSBleHRlbnQqL21heEV4dGVudD86YW55O1xyXG4gIC8qKiB0aWxlIHdpZHRoKi90aWxlV2lkdGg/Om51bWJlcjtcclxuICAvKiogdGlsZSBoZWlnaHQqL3RpbGVIZWlnaHQ/Om51bWJlcjtcclxuICAvKiogcGFyYW1ldGVycyovcGFyYW1ldGVycz86IEFycmF5PE9wdGlvbmFsUGFyYW1ldGVyPlxyXG59XHJcblxyXG4vKiogTWFwIGNvbXBvbmVudCBzdGF0dXMgbW9kZWwqL1xyXG5leHBvcnQgY2xhc3MgTWFwQ29tcG9uZW50U3RhdHVzIHtcclxuICAgIC8qKiBsb2FkZWQ/Ki9sb2FkZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxufVxyXG5cclxuQEluamVjdGFibGUoe1xyXG4gIHByb3ZpZGVkSW46ICdyb290J1xyXG59KVxyXG5cclxuLyoqIE1hcCBjb25maWd1cmF0aW9uIG1hbmFnZXIgc2VydmljZSovXHJcbmV4cG9ydCBjbGFzcyBNYXBDb25maWd1cmF0aW9uTWFuYWdlclNlcnZpY2Uge1xyXG4gIHByaXZhdGUgbGF5ZXJzU3ViamVjdCA9IG5ldyBCZWhhdmlvclN1YmplY3QoW10pO1xyXG4gIHByaXZhdGUgbGF5ZXJzOiBBcnJheTxMYXllcj4gPSBudWxsO1xyXG5cclxuICBwcml2YXRlIGJhc2VMYXllckdyb3Vwc1N1YmplY3QgPSBuZXcgQmVoYXZpb3JTdWJqZWN0KFtdKTtcclxuICBwcml2YXRlIGJhc2VMYXllckdyb3VwczogQXJyYXk8TGF5ZXJHcm91cD4gPSBudWxsO1xyXG5cclxuICBwcml2YXRlIGxheWVyQ29uZmlndXJhdGlvblN1YmplY3QgPSBuZXcgQmVoYXZpb3JTdWJqZWN0KFtdKTtcclxuXHJcbiAgcHJpdmF0ZSBhZGRMYXllcnNTdWJqZWN0ID0gbmV3IEJlaGF2aW9yU3ViamVjdChbXSk7XHJcbiAgcHJpdmF0ZSByZW1vdmVMYXllcnNTdWJqZWN0ID0gbmV3IEJlaGF2aW9yU3ViamVjdChbXSk7XHJcblxyXG4gIHByaXZhdGUgc2l0dWF0aW9uTWFwQ29uZmlndXJhdGlvblN1YmplY3QgPSBuZXcgQmVoYXZpb3JTdWJqZWN0KFtdKTtcclxuICBwcml2YXRlIG1hcE9wdGlvbnNDb25maWd1cmF0aW9uU3ViamVjdCA9IG5ldyBCZWhhdmlvclN1YmplY3QoW10pO1xyXG5cclxuICBwcml2YXRlIG1hcENvbXBvbmVudFN0YXR1c1N1YmplY3QgPSBuZXcgQmVoYXZpb3JTdWJqZWN0KFtdKTtcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yKi9cclxuICBjb25zdHJ1Y3RvcigpIHsgXHJcbiAgIC8vXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBsYXllciBjb3VudCAqL1xyXG4gIGNvdW50ID0gMDtcclxuXHJcbiAgLyoqIGNvbmZpZ3VyZSB0aGUgb3ZlcmxheSBsYXllcnMgb2YgdGhlIG1hcCwgYnkgcGFzc2luZyBhcyBhIHBhcmFtZXRlciBhbiBhcnJheSBvZiBvYmplY3RzIG9mIHR5cGUgTGF5ZXIgb2JqZWN0cyBkZWZpbmluZyB0aGUgbGF5ZXJzIHRvIGxvYWQuKi9cclxuICBsb2FkTGF5ZXJzQ29uZmlndXJhdGlvbihjb25maWd1cmF0aW9uKSB7XHJcbiAgICBpZiAodGhpcy5sYXllcnMgIT0gbnVsbCkge1xyXG4gICAgICB0aGlzLmNsZWFyTGF5ZXJzKGZhbHNlKTtcclxuICAgIH1cclxuICAgIHRoaXMuc2V0TGF5ZXJzKGNvbmZpZ3VyYXRpb24pO1xyXG4gIH1cclxuICBcclxuICAvKipjb25maWd1cmUgdGhlIGJhc2UgbGF5ZXJzIG9mIHRoZSBtYXAgYnkgcGFzc2luZyBhcyBhIHBhcmFtZXRlciBhbiBhcnJheSBvZiBvYmplY3RzIG9mIHR5cGUgTGF5ZXJHcm91cCBlYWNoIG9mIHRoZW0gd2l0aCB0aGUgY29ycmVzcG9uZGluZyBMYXllciBvYmplY3RzIGRlZmluaW5nIHRoZSBsYXllcnMgdG8gbG9hZC4qL1xyXG4gIGxvYWRCYXNlTGF5ZXJzQ29uZmlndXJhdGlvbihjb25maWd1cmF0aW9uKSB7XHJcbiAgICB0aGlzLnNldEJhc2VMYXllckdyb3Vwcyhjb25maWd1cmF0aW9uKTtcclxuICB9XHJcblxyXG4gIC8qKiBnZXQgYmFzZSBsYXllciBncm91cHMqL1xyXG4gIGdldEJhc2VMYXllckdyb3VwcygpOiBPYnNlcnZhYmxlPExheWVyR3JvdXBbXT4ge1xyXG4gICAgcmV0dXJuIHRoaXMuYmFzZUxheWVyR3JvdXBzU3ViamVjdC5hc09ic2VydmFibGUoKTtcclxuICB9XHJcblxyXG4gIC8qKiBzZXQgYmFzZSBsYXllciBncm91cHMqL1xyXG4gIHNldEJhc2VMYXllckdyb3Vwcyhncm91cHM6QXJyYXk8TGF5ZXJHcm91cD4pIHtcclxuICAgIHRoaXMuYmFzZUxheWVyR3JvdXBzID0gZ3JvdXBzO1xyXG4gICAgdGhpcy5yZWZyZXNoQmFzZUxheWVyR3JvdXBzKCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHJlZnJlc2hCYXNlTGF5ZXJHcm91cHMoKSB7XHJcbiAgICAvLyBTZW5kIHRoZSBuZXcgdmFsdWVzIHNvIHRoYXQgYWxsIHN1YnNjcmliZXJzIGFyZSB1cGRhdGVkXHJcbiAgICB0aGlzLmJhc2VMYXllckdyb3Vwc1N1YmplY3QubmV4dCh0aGlzLmJhc2VMYXllckdyb3Vwcyk7XHJcbiAgfVxyXG5cclxuICAvKiogZ2V0IGxheWVycyovXHJcbiAgZ2V0TGF5ZXJzKCk6IE9ic2VydmFibGU8TGF5ZXJbXT4ge1xyXG4gICAgcmV0dXJuIHRoaXMubGF5ZXJzU3ViamVjdC5hc09ic2VydmFibGUoKTtcclxuICB9XHJcblxyXG4gIC8qKiByZW1vdmUgYWxsIGxheWVycyBmcm9tIG1hcCovXHJcbiAgY2xlYXJMYXllcnMocmVmcmVzaDpib29sZWFuKSB7XHJcbiAgICB3aGlsZSh0aGlzLmxheWVycy5sZW5ndGgpIHtcclxuICAgICAgdGhpcy5sYXllcnMucG9wKCk7XHJcbiAgICB9XHJcbiAgICBpZiAocmVmcmVzaCkge1xyXG4gICAgICB0aGlzLnJlZnJlc2hMYXllcnMoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKiBzZXQgbGF5ZXJzKi9cclxuICBzZXRMYXllcnMobGF5ZXJzOkFycmF5PExheWVyPikge1xyXG4gICAgdGhpcy5sYXllcnMgPSBsYXllcnM7XHJcbiAgICB0aGlzLnJlZnJlc2hMYXllcnMoKTtcclxuICB9XHJcblxyXG4gIC8qKiBhZGQgZ2l2ZW4gbGF5ZXIgdG8gbWFwKi9cclxuICBhZGRMYXllcihsYXllcjpMYXllcikge1xyXG4gICAgdGhpcy5sYXllcnMucHVzaChsYXllcik7XHJcbiAgICB0aGlzLnJlZnJlc2hBZGRMYXllcnMobGF5ZXIpO1xyXG4gIH1cclxuXHJcbiAgLyoqIGFkZCBnaXZlbiBsYXllciB0byBtYXAgYXQgZ2l2ZW4gaW5kZXgqL1xyXG4gIGFkZExheWVyQXQobGF5ZXI6TGF5ZXIsIGluZGV4Om51bWJlcikge1xyXG4gICAgaWYgKGluZGV4ID09IDApIHtcclxuICAgICAgdGhpcy5sYXllcnMgPSBbbGF5ZXJdLmNvbmNhdCh0aGlzLmxheWVycyk7XHJcbiAgICB9IGVsc2UgaWYgKGluZGV4ID49IHRoaXMubGF5ZXJzLmxlbmd0aCkge1xyXG4gICAgICB0aGlzLmxheWVycy5wdXNoKGxheWVyKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMubGF5ZXJzID0gdGhpcy5sYXllcnMuc2xpY2UoMCwgaW5kZXgpXHJcbiAgICAgICAgICAgICAgICAgICAgLmNvbmNhdChbbGF5ZXJdKVxyXG4gICAgICAgICAgICAgICAgICAgIC5jb25jYXQodGhpcy5sYXllcnMuc2xpY2UoaW5kZXgsIHRoaXMubGF5ZXJzLmxlbmd0aCkpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5yZWZyZXNoQWRkTGF5ZXJzKGxheWVyKTtcclxuICAgIHRoaXMucmVmcmVzaExheWVyQ29uZmlndXJhdGlvbihsYXllci5pZCwgbnVsbCwgbnVsbCwgaW5kZXgpO1xyXG4gIH1cclxuXHJcbiAgLyoqIHJlbW92ZSBnaXZlbiBsYXllciBmcm9tIG1hcCovXHJcbiAgcmVtb3ZlTGF5ZXIobGF5ZXI6TGF5ZXIpIHtcclxuICAgIHZhciBpbmRleCA9IHRoaXMubGF5ZXJzLmluZGV4T2YobGF5ZXIpO1xyXG4gICAgdGhpcy5yZW1vdmVMYXllckluZGV4KGluZGV4KTtcclxuICB9XHJcblxyXG4gIC8qKiByZW1vdmUgbGF5ZXIgd2l0aCBnaXZlbiBpZCBmcm9tIG1hcCAqL1xyXG4gIHJlbW92ZUxheWVySWQoaWQpIHtcclxuICAgIHZhciBpbmRleCA9IC0xO1xyXG4gICAgZm9yICh2YXIgaSA9IDAsIGlMZW4gPSB0aGlzLmxheWVycy5sZW5ndGg7IGkgPCBpTGVuOyBpKyspIHtcclxuICAgICAgaWYgKHRoaXMubGF5ZXJzW2ldLmlkID09IGlkKSB7XHJcbiAgICAgICAgaW5kZXggPSBpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICB0aGlzLnJlbW92ZUxheWVySW5kZXgoaW5kZXgpO1xyXG4gIH1cclxuXHJcbiAgLyoqIHJlbW92ZSBsYXllciBhdCBnaXZlbiBpbmRleCBmcm9tIG1hcCAqL1xyXG4gIHJlbW92ZUxheWVySW5kZXgoaW5kZXg6bnVtYmVyKSB7XHJcbiAgICB2YXIgbGF5ZXIgPSB0aGlzLmxheWVyc1tpbmRleF07XHJcbiAgICB0aGlzLmxheWVycy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgdGhpcy5yZWZyZXNoUmVtb3ZlTGF5ZXJzKGxheWVyKTtcclxuICB9XHJcblxyXG4gIC8qKiByZWZyZXNoIGxheWVycyAqL1xyXG4gIHByaXZhdGUgcmVmcmVzaExheWVycygpIHtcclxuICAgIC8vIFNlbmQgdGhlIG5ldyB2YWx1ZXMgc28gdGhhdCBhbGwgc3Vic2NyaWJlcnMgYXJlIHVwZGF0ZWRcclxuICAgIHRoaXMubGF5ZXJzU3ViamVjdC5uZXh0KHRoaXMubGF5ZXJzKTtcclxuICB9XHJcblxyXG4gIC8qKiBPYnNlcnZhYmxlIGZvciBsYXllcnMgYWRkZWQgKi9cclxuICBnZXRMYXllcnNBZGRlZCgpOiBPYnNlcnZhYmxlPExheWVyW10+IHtcclxuICAgIHJldHVybiB0aGlzLmFkZExheWVyc1N1YmplY3QuYXNPYnNlcnZhYmxlKCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHJlZnJlc2hBZGRMYXllcnMobGF5ZXI6TGF5ZXIpIHtcclxuICAgIC8vIFNlbmQgdGhlIG5ldyB2YWx1ZXMgc28gdGhhdCBhbGwgc3Vic2NyaWJlcnMgYXJlIHVwZGF0ZWRcclxuICAgIHRoaXMuYWRkTGF5ZXJzU3ViamVjdC5uZXh0KFtsYXllcl0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0TGF5ZXJzUmVtb3ZlZCgpOiBPYnNlcnZhYmxlPExheWVyW10+IHtcclxuICAgIHJldHVybiB0aGlzLnJlbW92ZUxheWVyc1N1YmplY3QuYXNPYnNlcnZhYmxlKCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHJlZnJlc2hSZW1vdmVMYXllcnMobGF5ZXI6TGF5ZXIpIHtcclxuICAgIC8vIFNlbmQgdGhlIG5ldyB2YWx1ZXMgc28gdGhhdCBhbGwgc3Vic2NyaWJlcnMgYXJlIHVwZGF0ZWRcclxuICAgIHRoaXMucmVtb3ZlTGF5ZXJzU3ViamVjdC5uZXh0KFtsYXllcl0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0TGF5ZXJDb25maWd1cmF0aW9uTGlzdGVuZXIoKTogT2JzZXJ2YWJsZTxMYXllckNvbmZpZ3VyYXRpb25bXT4ge1xyXG4gICAgcmV0dXJuIHRoaXMubGF5ZXJDb25maWd1cmF0aW9uU3ViamVjdC5hc09ic2VydmFibGUoKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZ2V0TGF5ZXJJbmRleEJ5SWQoaWQ6c3RyaW5nKTpudW1iZXJ7XHJcbiAgICB2YXIgaW5kZXggPSAtMTtcclxuICAgIGZvciAodmFyIGkgPSAwLCBpTGVuID0gdGhpcy5sYXllcnMubGVuZ3RoOyBpIDwgaUxlbjsgaSsrKSB7XHJcbiAgICAgIGlmICh0aGlzLmxheWVyc1tpXS5pZCA9PSBpZCkge1xyXG4gICAgICAgIGluZGV4ID0gaTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGluZGV4O1xyXG4gIH1cclxuICBcclxuICAvKiogbW92ZSBsYXllciB3aXRoIGdpdmVuIGlkIHRvIHRoZSBnaXZlbiBpbmRleCovXHJcbiAgbW92ZUxheWVyKGlkLCBpbmRleCkge1xyXG4gICAgdmFyIGxheWVySW5kZXggPSB0aGlzLmdldExheWVySW5kZXhCeUlkKGlkKTtcclxuICAgIGlmIChsYXllckluZGV4ICE9IC0xKSB7XHJcbiAgICAgIHZhciBsYXllciA9IHRoaXMubGF5ZXJzLnNwbGljZShsYXllckluZGV4LCAxKTtcclxuICAgICAgdGhpcy5sYXllcnMgPSBcclxuICAgICAgICB0aGlzLmxheWVycy5zbGljZSgwLCBpbmRleClcclxuICAgICAgICAuY29uY2F0KGxheWVyKVxyXG4gICAgICAgIC5jb25jYXQodGhpcy5sYXllcnMuc2xpY2UoaW5kZXgsIHRoaXMubGF5ZXJzLmxlbmd0aCkpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5yZWZyZXNoTGF5ZXJDb25maWd1cmF0aW9uKGlkLCBudWxsLCBudWxsLCBpbmRleCk7XHJcbiAgfVxyXG5cclxuICAvKiogY2hhbmdlIHZpc2liaWxpdHkgb2YgbGF5ZXIgd2l0aCBnaXZlbiBpZCB0byB0aGUgZ2l2ZW4gdmFsdWUqL1xyXG4gIGNoYW5nZUxheWVyVmlzaWJpbGl0eShpZCwgdmlzaWJpbGl0eSkge1xyXG4gICAgdGhpcy5yZWZyZXNoTGF5ZXJDb25maWd1cmF0aW9uKGlkLCBudWxsLCB2aXNpYmlsaXR5LCBudWxsKTtcclxuICB9XHJcblxyXG4gIC8qKiBjaGFuZ2Ugb3BhY2l0eSBvZiBsYXllciB3aXRoIGdpdmVuIGlkIHRvIHRoZSBnaXZlbiB2YWx1ZSovXHJcbiAgY2hhbmdlTGF5ZXJPcGFjaXR5KGlkLCBvcGFjaXR5KSB7XHJcbiAgICB0aGlzLnJlZnJlc2hMYXllckNvbmZpZ3VyYXRpb24oaWQsIG9wYWNpdHksIG51bGwsIG51bGwpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSByZWZyZXNoTGF5ZXJDb25maWd1cmF0aW9uKGlkLCBvcGFjaXR5LCB2aXNpYmlsaXR5LCBwb3NpdGlvbikge1xyXG4gICAgLy8gU2VuZCB0aGUgbmV3IHZhbHVlcyBzbyB0aGF0IGFsbCBzdWJzY3JpYmVycyBhcmUgdXBkYXRlZFxyXG4gICAgdmFyIGxheWVyID0gbmV3IExheWVyQ29uZmlndXJhdGlvbigpO1xyXG4gICAgbGF5ZXIuaWQgPSBpZDtcclxuICAgIGxheWVyLm9wYWNpdHkgPSBvcGFjaXR5O1xyXG4gICAgbGF5ZXIudmlzaWJpbGl0eSA9IHZpc2liaWxpdHk7XHJcbiAgICBsYXllci5wb3NpdGlvbiA9IHBvc2l0aW9uO1xyXG4gICAgdGhpcy5sYXllckNvbmZpZ3VyYXRpb25TdWJqZWN0Lm5leHQoW2xheWVyXSk7XHJcbiAgfVxyXG5cclxuICBnZXRTaXR1YXRpb25NYXBDb25maWd1cmF0aW9uTGlzdGVuZXIoKTogT2JzZXJ2YWJsZTxMYXllcltdPiB7XHJcbiAgICByZXR1cm4gdGhpcy5zaXR1YXRpb25NYXBDb25maWd1cmF0aW9uU3ViamVjdC5hc09ic2VydmFibGUoKTtcclxuICB9XHJcblxyXG4gIC8qKiBjb25maWd1cmUgdGhlIHNpdHVhdGlvbiBtYXAgb2YgdGhlIG1hcCBjb21wb25lbnQgYnkgcGFzc2luZyBhcyBhIHBhcmFtZXRlciBhbiBhcnJheSBvZiBvYmplY3RzIG9mIHR5cGUgTGF5ZXJHcm91cCwgZWFjaCBvZiB0aGVtIHdpdGggdGhlIGNvcnJlc3BvbmRpbmcgTGF5ZXIgb2JqZWN0cyBkZWZpbmluZyB0aGUgbGF5ZXJzIHRvIGxvYWQgYXMgc2l0dWF0aW9uIG1hcC4qL1xyXG4gIGxvYWRTaXR1YXRpb25NYXBDb25maWd1cmF0aW9uKGxheWVyczpBcnJheTxMYXllcj4pIHtcclxuICAgIC8vIFNlbmQgdGhlIG5ldyB2YWx1ZXMgc28gdGhhdCBhbGwgc3Vic2NyaWJlcnMgYXJlIHVwZGF0ZWRcclxuICAgIHRoaXMuc2l0dWF0aW9uTWFwQ29uZmlndXJhdGlvblN1YmplY3QubmV4dChsYXllcnMpO1xyXG4gIH1cclxuXHJcbiAgZ2V0TWFwT3B0aW9uc0NvbmZpZ3VyYXRpb25MaXN0ZW5lcigpOiBPYnNlcnZhYmxlPE1hcE9wdGlvbnNDb25maWd1cmF0aW9uW10+IHtcclxuICAgIHJldHVybiB0aGlzLm1hcE9wdGlvbnNDb25maWd1cmF0aW9uU3ViamVjdC5hc09ic2VydmFibGUoKTtcclxuICB9XHJcblxyXG4gIC8qKiBsb2FkIG1hcCBvcHRpb25zIGNvbmZpZ3VyYXRpb24gKi9cclxuICBsb2FkTWFwT3B0aW9uc0NvbmZpZ3VyYXRpb24oY29uZmlndXJhdGlvbjpNYXBPcHRpb25zQ29uZmlndXJhdGlvbikge1xyXG4gICAgLy8gU2VuZCB0aGUgbmV3IHZhbHVlcyBzbyB0aGF0IGFsbCBzdWJzY3JpYmVycyBhcmUgdXBkYXRlZFxyXG4gICAgdGhpcy5tYXBPcHRpb25zQ29uZmlndXJhdGlvblN1YmplY3QubmV4dChbY29uZmlndXJhdGlvbl0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0TWFwQ29tcG9uZW50U3RhdHVzTGlzdGVuZXIoKTogT2JzZXJ2YWJsZTxNYXBDb21wb25lbnRTdGF0dXNbXT4ge1xyXG4gICAgcmV0dXJuIHRoaXMubWFwQ29tcG9uZW50U3RhdHVzU3ViamVjdC5hc09ic2VydmFibGUoKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNldCBtYXAgY29tcG9uZW50IHN0YXR1cyAqL1xyXG4gIHNldE1hcENvbXBvbmVudFN0YXR1cyhzdGF0dXM6TWFwQ29tcG9uZW50U3RhdHVzKSB7XHJcbiAgICAvL05vdGlmeSB0aGUgbWFwIGNvbXBvbmVudCBzdGF0dXNcclxuICAgIHRoaXMubWFwQ29tcG9uZW50U3RhdHVzU3ViamVjdC5uZXh0KFtzdGF0dXNdKTtcclxuICB9XHJcblxyXG59XHJcbiIsImltcG9ydCB7IERpcmVjdGl2ZSwgSW5wdXQsIFRlbXBsYXRlUmVmLCBWaWV3Q29udGFpbmVyUmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFByaW5jaXBhbCB9IGZyb20gJy4vcHJpbmNpcGFsLnNlcnZpY2UnO1xyXG5cclxuLyoqXHJcbiAqIEB3aGF0SXREb2VzIENvbmRpdGlvbmFsbHkgaW5jbHVkZXMgYW4gSFRNTCBlbGVtZW50IGlmIGN1cnJlbnQgdXNlciBoYXMgYW55XHJcbiAqIG9mIHRoZSBhdXRob3JpdGllcyBwYXNzZWQgYXMgdGhlIGBleHByZXNzaW9uYC5cclxuICpcclxuICogQGhvd1RvVXNlXHJcbiAqIGBgYFxyXG4gKiAgICAgPHNvbWUtZWxlbWVudCAqc2l0bXVuSGFzQW55QXV0aG9yaXR5PVwiJ1JPTEVfQURNSU4nXCI+Li4uPC9zb21lLWVsZW1lbnQ+XHJcbiAqXHJcbiAqICAgICA8c29tZS1lbGVtZW50ICpzaXRtdW5IYXNBbnlBdXRob3JpdHk9XCJbJ1JPTEVfQURNSU4nLCAnUk9MRV9VU0VSJ11cIj4uLi48L3NvbWUtZWxlbWVudD5cclxuICogYGBgXHJcbiAqL1xyXG5ARGlyZWN0aXZlKHtcclxuICAgIHNlbGVjdG9yOiAnW3NpdG11bkhhc0FueUF1dGhvcml0eV0nXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBIYXNBbnlBdXRob3JpdHlEaXJlY3RpdmUge1xyXG4gICAgXHJcbiAgICAvKiogYXV0aG9yaXRpZXMgdG8gY2hlY2sgKi9cclxuICAgIHB1YmxpYyBhdXRob3JpdGllczogc3RyaW5nW107IFxyXG4gICAgXHJcbiAgICAvKiogY29uc3RydWN0b3IgKi9cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcHJpbmNpcGFsOiBQcmluY2lwYWwsIHByaXZhdGUgdGVtcGxhdGVSZWY6IFRlbXBsYXRlUmVmPGFueT4sIHByaXZhdGUgdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZikge1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKiogdGVycml0b3J5IHRvIGNoZWNrIGF1dGhvcml0aWVzKi9cclxuICAgIEBJbnB1dCgpIHRlcnJpdG9yeTogc3RyaW5nO1xyXG4gICAgXHJcbiAgICAvKiogU2V0IHdoZXRoZXIgY3VycmVudCB1c2VyIGhhcyBhbnkgb2YgdGhlIGdpdmVuIGF1dGhvcml0aWVzICovXHJcbiAgICBASW5wdXQoKVxyXG4gICAgc2V0IHNpdG11bkhhc0FueUF1dGhvcml0eSh2YWx1ZTogc3RyaW5nfHN0cmluZ1tdKSB7XHJcbiAgICAgICAgdGhpcy5hdXRob3JpdGllcyA9IHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgPyBbIDxzdHJpbmc+IHZhbHVlIF0gOiA8c3RyaW5nW10+IHZhbHVlO1xyXG4gICAgICAgIHRoaXMudXBkYXRlVmlldygpO1xyXG4gICAgICAgIC8vIEdldCBub3RpZmllZCBlYWNoIHRpbWUgYXV0aGVudGljYXRpb24gc3RhdGUgY2hhbmdlcy5cclxuICAgICAgICB0aGlzLnByaW5jaXBhbC5nZXRBdXRoZW50aWNhdGlvblN0YXRlKCkuc3Vic2NyaWJlKChpZGVudGl0eSkgPT4gdGhpcy51cGRhdGVWaWV3KCkpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKiogdXBkYXRlIHZpZXcgKi9cclxuICAgIHByaXZhdGUgdXBkYXRlVmlldygpOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy50ZXJyaXRvcnkpe1xyXG4gICAgICAgIHRoaXMucHJpbmNpcGFsLmhhc0FueUF1dGhvcml0eU9uVGVycml0b3J5KHRoaXMuYXV0aG9yaXRpZXMsdGhpcy50ZXJyaXRvcnkpLnRoZW4oKHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnZpZXdDb250YWluZXJSZWYuY2xlYXIoKTtcclxuICAgICAgICAgICAgaWYgKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy52aWV3Q29udGFpbmVyUmVmLmNyZWF0ZUVtYmVkZGVkVmlldyh0aGlzLnRlbXBsYXRlUmVmKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMucHJpbmNpcGFsLmhhc0FueUF1dGhvcml0eSh0aGlzLmF1dGhvcml0aWVzKS50aGVuKChyZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgdGhpcy52aWV3Q29udGFpbmVyUmVmLmNsZWFyKCk7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudmlld0NvbnRhaW5lclJlZi5jcmVhdGVFbWJlZGRlZFZpZXcodGhpcy50ZW1wbGF0ZVJlZik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgRGlyZWN0aXZlLCBJbnB1dCwgVGVtcGxhdGVSZWYsIFZpZXdDb250YWluZXJSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgUHJpbmNpcGFsIH0gZnJvbSAnLi9wcmluY2lwYWwuc2VydmljZSc7XHJcblxyXG4vKipcclxuICogQHdoYXRJdERvZXMgQ29uZGl0aW9uYWxseSBpbmNsdWRlcyBhbiBIVE1MIGVsZW1lbnQgaWYgY3VycmVudCB1c2VyIGhhcyBhbnlcclxuICogb2YgdGhlIGF1dGhvcml0aWVzIHBhc3NlZCBhcyB0aGUgYGV4cHJlc3Npb25gLlxyXG4gKlxyXG4gKiBAaG93VG9Vc2VcclxuICogYGBgXHJcbiAqICAgICA8c29tZS1lbGVtZW50ICpzaXRtdW5IYXNBbnlBdXRob3JpdHk9XCInUk9MRV9BRE1JTidcIj4uLi48L3NvbWUtZWxlbWVudD5cclxuICpcclxuICogICAgIDxzb21lLWVsZW1lbnQgKnNpdG11bkhhc0FueUF1dGhvcml0eT1cIlsnUk9MRV9BRE1JTicsICdST0xFX1VTRVInXVwiPi4uLjwvc29tZS1lbGVtZW50PlxyXG4gKiBgYGBcclxuICovXHJcbkBEaXJlY3RpdmUoe1xyXG4gICAgc2VsZWN0b3I6ICdbc2l0bXVuSGFzQW55QXV0aG9yaXR5T25UZXJyaXRvcnldJ1xyXG59KVxyXG5leHBvcnQgY2xhc3MgSGFzQW55QXV0aG9yaXR5T25UZXJyaXRvcnlEaXJlY3RpdmUge1xyXG5cclxuICAgIC8qKiBhdXRob3JpdGllcyB0byBjaGVjayAqL1xyXG4gICAgcHVibGljIGF1dGhvcml0aWVzOiBzdHJpbmdbXTsgXHJcblxyXG4gICAgLyoqIHRlcnJpdG9yeSB0byBjaGVjayBhdXRob3JpdGllcyovXHJcbiAgICBwdWJsaWMgdGVycml0b3J5OiBzdHJpbmc7IFxyXG5cclxuICAgIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBwcmluY2lwYWw6IFByaW5jaXBhbCwgcHJpdmF0ZSB0ZW1wbGF0ZVJlZjogVGVtcGxhdGVSZWY8YW55PiwgcHJpdmF0ZSB2aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmKSB7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKiBTZXQgd2hldGhlciBjdXJyZW50IHVzZXIgaGFzIGFueSBvZiB0aGUgZ2l2ZW4gYXV0aG9yaXRpZXMgb24gdGVycml0b3J5ICovXHJcbiAgICBASW5wdXQoKVxyXG4gICAgc2V0IHNpdG11bkhhc0FueUF1dGhvcml0eU9uVGVycml0b3J5KG9wdHM6IGFueSkge1xyXG5cclxuICAgICAgICB0aGlzLmF1dGhvcml0aWVzID0gdHlwZW9mIG9wdHMuYXV0aG9yaXRpZXMgPT09ICdzdHJpbmcnID8gWyA8c3RyaW5nPiBvcHRzLmF1dGhvcml0aWVzIF0gOiA8c3RyaW5nW10+IG9wdHMuYXV0aG9yaXRpZXM7XHJcbiAgICAgICAgdGhpcy50ZXJyaXRvcnkgPSBvcHRzLnRlcnJpdG9yeTtcclxuICAgICAgICB0aGlzLnVwZGF0ZVZpZXcoKTtcclxuICAgICAgICAvLyBHZXQgbm90aWZpZWQgZWFjaCB0aW1lIGF1dGhlbnRpY2F0aW9uIHN0YXRlIGNoYW5nZXMuXHJcbiAgICAgICAgdGhpcy5wcmluY2lwYWwuZ2V0QXV0aGVudGljYXRpb25TdGF0ZSgpLnN1YnNjcmliZSgoaWRlbnRpdHkpID0+IHRoaXMudXBkYXRlVmlldygpKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoqIHVwZGF0ZSB2aWV3ICovXHJcbiAgICBwcml2YXRlIHVwZGF0ZVZpZXcoKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMudGVycml0b3J5KXtcclxuICAgICAgICB0aGlzLnByaW5jaXBhbC5oYXNBbnlBdXRob3JpdHlPblRlcnJpdG9yeSh0aGlzLmF1dGhvcml0aWVzLHRoaXMudGVycml0b3J5KS50aGVuKChyZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgdGhpcy52aWV3Q29udGFpbmVyUmVmLmNsZWFyKCk7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudmlld0NvbnRhaW5lclJlZi5jcmVhdGVFbWJlZGRlZFZpZXcodGhpcy50ZW1wbGF0ZVJlZik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLnByaW5jaXBhbC5oYXNBbnlBdXRob3JpdHkodGhpcy5hdXRob3JpdGllcykudGhlbigocmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMudmlld0NvbnRhaW5lclJlZi5jbGVhcigpO1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZpZXdDb250YWluZXJSZWYuY3JlYXRlRW1iZWRkZWRWaWV3KHRoaXMudGVtcGxhdGVSZWYpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IE5nTW9kdWxlLCBNb2R1bGVXaXRoUHJvdmlkZXJzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xyXG5pbXBvcnQge0h0dHBDbGllbnRNb2R1bGUsIEhUVFBfSU5URVJDRVBUT1JTLCBIdHRwQ2xpZW50fSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IFJvdXRlck1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XHJcbi8vaW1wb3J0IHsgQW5ndWxhckhhbE1vZHVsZSB9IGZyb20gJy4uLy4uL2xpYi9hbmd1bGFyLWhhbCc7XHJcbmltcG9ydCB7Q29kZUxpc3RTZXJ2aWNlfSBmcm9tICcuL2NvZGVsaXN0L2NvZGVsaXN0LnNlcnZpY2UnO1xyXG5pbXBvcnQge1RlcnJpdG9yeVNlcnZpY2V9IGZyb20gJy4vdGVycml0b3J5L3RlcnJpdG9yeS5zZXJ2aWNlJztcclxuaW1wb3J0IHtUZXJyaXRvcnlUeXBlU2VydmljZX0gZnJvbSAnLi90ZXJyaXRvcnkvdGVycml0b3J5LXR5cGUuc2VydmljZSc7XHJcbmltcG9ydCB7VGVycml0b3J5R3JvdXBUeXBlU2VydmljZX0gZnJvbSAnLi90ZXJyaXRvcnkvdGVycml0b3J5LWdyb3VwLXR5cGUuc2VydmljZSc7XHJcbmltcG9ydCB7VXNlclBvc2l0aW9uU2VydmljZX0gZnJvbSAnLi91c2VyL3VzZXItcG9zaXRpb24uc2VydmljZSc7XHJcbmltcG9ydCB7VXNlckNvbmZpZ3VyYXRpb25TZXJ2aWNlfSBmcm9tICcuL3VzZXIvdXNlci1jb25maWd1cmF0aW9uLnNlcnZpY2UnO1xyXG5pbXBvcnQge1JvbGVTZXJ2aWNlfSBmcm9tICcuL3JvbGUvcm9sZS5zZXJ2aWNlJztcclxuaW1wb3J0IHtVc2VyU2VydmljZX0gZnJvbSAnLi91c2VyL3VzZXIuc2VydmljZSc7XHJcbmltcG9ydCB7Q29ubmVjdGlvblNlcnZpY2V9IGZyb20gJy4vY29ubmVjdGlvbi9jb25uZWN0aW9uLnNlcnZpY2UnO1xyXG5pbXBvcnQge1Rhc2tTZXJ2aWNlfSBmcm9tICcuL3Rhc2svdGFzay5zZXJ2aWNlJztcclxuaW1wb3J0IHtUYXNrVHlwZVNlcnZpY2V9IGZyb20gJy4vdGFzay90YXNrLXR5cGUuc2VydmljZSc7XHJcbmltcG9ydCB7VGFza0dyb3VwU2VydmljZX0gZnJvbSAnLi90YXNrL3Rhc2stZ3JvdXAuc2VydmljZSc7XHJcbmltcG9ydCB7VGFza1BhcmFtZXRlclNlcnZpY2V9IGZyb20gJy4vdGFzay90YXNrLXBhcmFtZXRlci5zZXJ2aWNlJztcclxuaW1wb3J0IHtUYXNrQXZhaWxhYmlsaXR5U2VydmljZX0gZnJvbSAnLi90YXNrL3Rhc2stYXZhaWxhYmlsaXR5LnNlcnZpY2UnO1xyXG5pbXBvcnQge1Rhc2tVSVNlcnZpY2V9IGZyb20gJy4vdGFzay90YXNrLXVpLnNlcnZpY2UnO1xyXG5pbXBvcnQge1NlcnZpY2VTZXJ2aWNlfSBmcm9tICcuL3NlcnZpY2Uvc2VydmljZS5zZXJ2aWNlJztcclxuaW1wb3J0IHtTZXJ2aWNlUGFyYW1ldGVyU2VydmljZX0gZnJvbSAnLi9zZXJ2aWNlL3NlcnZpY2UtcGFyYW1ldGVyLnNlcnZpY2UnO1xyXG5pbXBvcnQge0NhcnRvZ3JhcGh5U2VydmljZX0gZnJvbSAnLi9jYXJ0b2dyYXBoeS9jYXJ0b2dyYXBoeS5zZXJ2aWNlJztcclxuaW1wb3J0IHtDYXJ0b2dyYXBoeUF2YWlsYWJpbGl0eVNlcnZpY2V9IGZyb20gJy4vY2FydG9ncmFwaHkvY2FydG9ncmFwaHktYXZhaWxhYmlsaXR5LnNlcnZpY2UnO1xyXG5pbXBvcnQge0NhcnRvZ3JhcGh5RmlsdGVyU2VydmljZX0gZnJvbSAnLi9jYXJ0b2dyYXBoeS9jYXJ0b2dyYXBoeS1maWx0ZXIuc2VydmljZSc7XHJcbmltcG9ydCB7Q2FydG9ncmFwaHlHcm91cFNlcnZpY2V9IGZyb20gJy4vY2FydG9ncmFwaHkvY2FydG9ncmFwaHktZ3JvdXAuc2VydmljZSc7XHJcbmltcG9ydCB7Q2FydG9ncmFwaHlQYXJhbWV0ZXJTZXJ2aWNlfSBmcm9tICcuL2NhcnRvZ3JhcGh5L2NhcnRvZ3JhcGh5LXBhcmFtZXRlci5zZXJ2aWNlJztcclxuaW1wb3J0IHtCYWNrZ3JvdW5kU2VydmljZX0gZnJvbSAnLi9jYXJ0b2dyYXBoeS9iYWNrZ3JvdW5kLnNlcnZpY2UnO1xyXG5pbXBvcnQge1RyZWVTZXJ2aWNlfSBmcm9tICcuL3RyZWUvdHJlZS5zZXJ2aWNlJztcclxuaW1wb3J0IHtUcmVlTm9kZVNlcnZpY2V9IGZyb20gJy4vdHJlZS90cmVlLW5vZGUuc2VydmljZSc7XHJcbmltcG9ydCB7QXBwbGljYXRpb25TZXJ2aWNlfSBmcm9tICcuL2FwcGxpY2F0aW9uL2FwcGxpY2F0aW9uLnNlcnZpY2UnO1xyXG5pbXBvcnQge0FwcGxpY2F0aW9uUGFyYW1ldGVyU2VydmljZX0gZnJvbSAnLi9hcHBsaWNhdGlvbi9hcHBsaWNhdGlvbi1wYXJhbWV0ZXIuc2VydmljZSc7XHJcbmltcG9ydCB7QXBwbGljYXRpb25CYWNrZ3JvdW5kU2VydmljZX0gZnJvbSAnLi9hcHBsaWNhdGlvbi9hcHBsaWNhdGlvbi1iYWNrZ3JvdW5kLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBNYXBDb25maWd1cmF0aW9uTWFuYWdlclNlcnZpY2UgfSBmcm9tICcuL21hcC9tYXAtY29uZmlndXJhdGlvbi1tYW5hZ2VyLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBBdXRoU2VydmljZSB9IGZyb20gJy4vYXV0aC9hdXRoLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBQcmluY2lwYWwgfSBmcm9tICcuL2F1dGgvcHJpbmNpcGFsLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBBdXRoSW50ZXJjZXB0b3IgfSBmcm9tICcuL2F1dGgvYXV0aC5pbnRlcmNlcHRvcic7XHJcbmltcG9ydCB7IEF1dGhFeHBpcmVkSW50ZXJjZXB0b3IgfSBmcm9tICcuL2F1dGgvYXV0aC1leHBpcmVkLmludGVyY2VwdG9yJztcclxuaW1wb3J0IHsgSGFzQW55QXV0aG9yaXR5RGlyZWN0aXZlIH0gZnJvbSAnLi9hdXRoL2hhcy1hbnktYXV0aG9yaXR5LmRpcmVjdGl2ZSc7XHJcbmltcG9ydCB7IEhhc0FueUF1dGhvcml0eU9uVGVycml0b3J5RGlyZWN0aXZlIH0gZnJvbSAnLi9hdXRoL2hhcy1hbnktYXV0aG9yaXR5LW9uLXRlcnJpdG9yeS5kaXJlY3RpdmUnO1xyXG5pbXBvcnQgeyBMb2dpblNlcnZpY2UgfSBmcm9tICcuL2F1dGgvbG9naW4uc2VydmljZSc7XHJcbmltcG9ydCB7IEFjY291bnRTZXJ2aWNlIH0gZnJvbSAnLi9hY2NvdW50L2FjY291bnQuc2VydmljZSc7XHJcbmltcG9ydCB7VHJhbnNsYXRlSHR0cExvYWRlcn0gZnJvbSAnQG5neC10cmFuc2xhdGUvaHR0cC1sb2FkZXInO1xyXG5pbXBvcnQge1RyYW5zbGF0ZUxvYWRlciwgVHJhbnNsYXRlTW9kdWxlfSBmcm9tICdAbmd4LXRyYW5zbGF0ZS9jb3JlJztcclxuaW1wb3J0IHsgVHJhbnNsYXRpb25TZXJ2aWNlIH0gZnJvbSAnLi90cmFuc2xhdGlvbi90cmFuc2xhdGlvbi5zZXJ2aWNlJztcclxuaW1wb3J0IHsgTGFuZ3VhZ2VTZXJ2aWNlIH0gZnJvbSAnLi90cmFuc2xhdGlvbi9sYW5ndWFnZS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgRGFzaGJvYXJkU2VydmljZSB9IGZyb20gJy4vZGFzaGJvYXJkL2Rhc2hib2FyZC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQ2FwYWJpbGl0aWVzU2VydmljZSB9IGZyb20gJy4vY2FwYWJpbGl0aWVzL2NhcGFiaWxpdGllcy5zZXJ2aWNlJztcclxuLyoqIGxvYWQgaTE4biBhc3NldHMqL1xyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlVHJhbnNsYXRlTG9hZGVyKGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICByZXR1cm4gbmV3IFRyYW5zbGF0ZUh0dHBMb2FkZXIoaHR0cCwgJy4vYXNzZXRzL2kxOG4vJywgJy5qc29uJyk7XHJcbn1cclxuXHJcblxyXG4vKiogU0lUTVVOIGZyb250ZW5kIGNvcmUgbW9kdWxlICovXHJcbkBOZ01vZHVsZSh7XHJcbiAgaW1wb3J0czogW1xyXG4gICAgLypSb3V0ZXJNb2R1bGUsXHJcbiAgICBIdHRwQ2xpZW50TW9kdWxlLFxyXG4gICAgQ29tbW9uTW9kdWxlLFxyXG4gICAgQW5ndWxhckhhbE1vZHVsZSwqL1xyXG4gICAgVHJhbnNsYXRlTW9kdWxlLmZvclJvb3Qoe1xyXG4gICAgICBsb2FkZXI6IHtcclxuICAgICAgICBwcm92aWRlOiBUcmFuc2xhdGVMb2FkZXIsXHJcbiAgICAgICAgdXNlRmFjdG9yeTogKGNyZWF0ZVRyYW5zbGF0ZUxvYWRlciksXHJcbiAgICAgICAgZGVwczogW0h0dHBDbGllbnRdXHJcbiAgICAgIH1cclxuICAgIH0pLFxyXG4gIF0sXHJcbiAgZGVjbGFyYXRpb25zOiBbXHJcbiAgICBIYXNBbnlBdXRob3JpdHlEaXJlY3RpdmUsXHJcbiAgICBIYXNBbnlBdXRob3JpdHlPblRlcnJpdG9yeURpcmVjdGl2ZSxcclxuICBdLFxyXG4gIGV4cG9ydHM6IFtcclxuICAgIEhhc0FueUF1dGhvcml0eURpcmVjdGl2ZSxcclxuICAgIEhhc0FueUF1dGhvcml0eU9uVGVycml0b3J5RGlyZWN0aXZlLFxyXG4gICAgVHJhbnNsYXRlTW9kdWxlXHJcbiAgXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgU2l0bXVuRnJvbnRlbmRDb3JlTW9kdWxlIHtcclxuICBzdGF0aWMgZm9yUm9vdCgpOiBNb2R1bGVXaXRoUHJvdmlkZXJzIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIG5nTW9kdWxlOiBTaXRtdW5Gcm9udGVuZENvcmVNb2R1bGUsXHJcbiAgICAgIHByb3ZpZGVyczogW1xyXG4gICAgICAgIENvZGVMaXN0U2VydmljZSxcclxuICAgICAgICBUZXJyaXRvcnlTZXJ2aWNlLFxyXG4gICAgICAgIFRlcnJpdG9yeVR5cGVTZXJ2aWNlLFxyXG4gICAgICAgIFRlcnJpdG9yeUdyb3VwVHlwZVNlcnZpY2UsXHJcbiAgICAgICAgUm9sZVNlcnZpY2UsXHJcbiAgICAgICAgQWNjb3VudFNlcnZpY2UsXHJcbiAgICAgICAgQXV0aFNlcnZpY2UsXHJcbiAgICAgICAgVXNlclNlcnZpY2UsXHJcbiAgICAgICAgQ29ubmVjdGlvblNlcnZpY2UsXHJcbiAgICAgICAgVGFza1NlcnZpY2UsXHJcbiAgICAgICAgVGFza1R5cGVTZXJ2aWNlLFxyXG4gICAgICAgIFRhc2tVSVNlcnZpY2UsXHJcbiAgICAgICAgVGFza0dyb3VwU2VydmljZSxcclxuICAgICAgICBUYXNrUGFyYW1ldGVyU2VydmljZSxcclxuICAgICAgICBUYXNrQXZhaWxhYmlsaXR5U2VydmljZSxcclxuICAgICAgICBTZXJ2aWNlU2VydmljZSxcclxuICAgICAgICBDYXBhYmlsaXRpZXNTZXJ2aWNlLFxyXG4gICAgICAgIFNlcnZpY2VQYXJhbWV0ZXJTZXJ2aWNlLFxyXG4gICAgICAgIENhcnRvZ3JhcGh5U2VydmljZSxcclxuICAgICAgICBDYXJ0b2dyYXBoeUdyb3VwU2VydmljZSxcclxuICAgICAgICBDYXJ0b2dyYXBoeUF2YWlsYWJpbGl0eVNlcnZpY2UsXHJcbiAgICAgICAgQ2FydG9ncmFwaHlQYXJhbWV0ZXJTZXJ2aWNlLFxyXG4gICAgICAgIENhcnRvZ3JhcGh5RmlsdGVyU2VydmljZSxcclxuICAgICAgICBCYWNrZ3JvdW5kU2VydmljZSxcclxuICAgICAgICBUcmVlU2VydmljZSxcclxuICAgICAgICBUcmVlTm9kZVNlcnZpY2UsXHJcbiAgICAgICAgQXBwbGljYXRpb25TZXJ2aWNlLFxyXG4gICAgICAgIEFwcGxpY2F0aW9uUGFyYW1ldGVyU2VydmljZSxcclxuICAgICAgICBBcHBsaWNhdGlvbkJhY2tncm91bmRTZXJ2aWNlLFxyXG4gICAgICAgIEF1dGhJbnRlcmNlcHRvcixcclxuICAgICAgICBBdXRoRXhwaXJlZEludGVyY2VwdG9yLFxyXG4gICAgICAgIFByaW5jaXBhbCxcclxuICAgICAgICBVc2VyUG9zaXRpb25TZXJ2aWNlLFxyXG4gICAgICAgIFVzZXJDb25maWd1cmF0aW9uU2VydmljZSxcclxuICAgICAgICBMb2dpblNlcnZpY2UsXHJcbiAgICAgICAgVHJhbnNsYXRpb25TZXJ2aWNlLFxyXG4gICAgICAgIExhbmd1YWdlU2VydmljZSxcclxuICAgICAgICBEYXNoYm9hcmRTZXJ2aWNlLFxyXG4gICAgICAgIE1hcENvbmZpZ3VyYXRpb25NYW5hZ2VyU2VydmljZSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBwcm92aWRlOiBIVFRQX0lOVEVSQ0VQVE9SUyxcclxuICAgICAgICAgIHVzZUNsYXNzOiBBdXRoSW50ZXJjZXB0b3IsXHJcbiAgICAgICAgICBtdWx0aTogdHJ1ZVxyXG4gICAgICAgIH1cclxuICAgICAgICAsIHtcclxuICAgICAgICAgIHByb3ZpZGU6IEhUVFBfSU5URVJDRVBUT1JTLFxyXG4gICAgICAgICAgdXNlQ2xhc3M6IEF1dGhFeHBpcmVkSW50ZXJjZXB0b3IsXHJcbiAgICAgICAgICBtdWx0aTogdHJ1ZVxyXG4gICAgICAgIH1cclxuICAgICAgXVxyXG4gICAgfTtcclxuICB9XHJcbn1cclxuXHJcbiIsImltcG9ydCB7TW9kdWxlV2l0aFByb3ZpZGVycywgTmdNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge0h0dHBDbGllbnQsIEh0dHBDbGllbnRNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHtIYWxQYXJhbSwgUmVzdFNlcnZpY2V9IGZyb20gJy4vcmVzdC5zZXJ2aWNlJztcclxuaW1wb3J0IHtFeHRlcm5hbFNlcnZpY2V9IGZyb20gJy4vZXh0ZXJuYWwuc2VydmljZSc7XHJcbmltcG9ydCB7UmVzb3VyY2VTZXJ2aWNlfSBmcm9tICcuL3Jlc291cmNlLnNlcnZpY2UnO1xyXG5pbXBvcnQge0V4dGVybmFsQ29uZmlndXJhdGlvbkhhbmRsZXJJbnRlcmZhY2V9IGZyb20gJy4vZXh0ZXJuYWwtY29uZmlndXJhdGlvbi5oYW5kbGVyJztcclxuXHJcbmltcG9ydCAncnhqcyc7XHJcblxyXG5pbXBvcnQge1N1YlR5cGVCdWlsZGVyfSBmcm9tICcuL3N1YnR5cGUtYnVpbGRlcic7XHJcblxyXG5leHBvcnQge0V4dGVybmFsU2VydmljZX0gZnJvbSAnLi9leHRlcm5hbC5zZXJ2aWNlJztcclxuZXhwb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi9yZXN0LnNlcnZpY2UnO1xyXG5leHBvcnQge1Jlc291cmNlfSBmcm9tICcuL3Jlc291cmNlJztcclxuZXhwb3J0IHtSZXNvdXJjZUFycmF5fSBmcm9tICcuL3Jlc291cmNlLWFycmF5JztcclxuZXhwb3J0IHtSZXNvdXJjZVNlcnZpY2V9IGZyb20gJy4vcmVzb3VyY2Uuc2VydmljZSc7XHJcbmV4cG9ydCB7U29ydH0gZnJvbSAnLi9zb3J0JztcclxuZXhwb3J0IHtSZXNvdXJjZUhlbHBlcn0gZnJvbSAnLi9yZXNvdXJjZS1oZWxwZXInO1xyXG5leHBvcnQge0V4dGVybmFsQ29uZmlndXJhdGlvbn0gZnJvbSAnLi9FeHRlcm5hbENvbmZpZ3VyYXRpb24nO1xyXG5leHBvcnQge0V4dGVybmFsQ29uZmlndXJhdGlvbkhhbmRsZXJJbnRlcmZhY2V9IGZyb20gJy4vZXh0ZXJuYWwtY29uZmlndXJhdGlvbi5oYW5kbGVyJztcclxuZXhwb3J0IHtIYWxPcHRpb25zLCBIYWxQYXJhbX0gZnJvbSAnLi9yZXN0LnNlcnZpY2UnO1xyXG5leHBvcnQge1N1YlR5cGVCdWlsZGVyfSBmcm9tICcuL3N1YnR5cGUtYnVpbGRlcic7XHJcblxyXG5cclxuLyoqIEFuZ3VsYXIgSEFMIG1vZHVsZSAqL1xyXG5ATmdNb2R1bGUoe1xyXG4gICAgaW1wb3J0czogW0h0dHBDbGllbnRNb2R1bGVdLFxyXG4gICAgZGVjbGFyYXRpb25zOiBbXSxcclxuICAgIGV4cG9ydHM6IFtIdHRwQ2xpZW50TW9kdWxlXSxcclxuICAgIHByb3ZpZGVyczogW1xyXG4gICAgICAgIEV4dGVybmFsU2VydmljZSxcclxuICAgICAgICBIdHRwQ2xpZW50LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcHJvdmlkZTogUmVzb3VyY2VTZXJ2aWNlLFxyXG4gICAgICAgICAgICB1c2VDbGFzczogUmVzb3VyY2VTZXJ2aWNlLFxyXG4gICAgICAgICAgICBkZXBzOiBbRXh0ZXJuYWxTZXJ2aWNlXVxyXG4gICAgICAgIH1dXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBBbmd1bGFySGFsTW9kdWxlIHtcclxuICAgIHN0YXRpYyBmb3JSb290KCk6IE1vZHVsZVdpdGhQcm92aWRlcnMge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIG5nTW9kdWxlOiBBbmd1bGFySGFsTW9kdWxlLFxyXG4gICAgICAgICAgICBwcm92aWRlcnM6IFtcclxuICAgICAgICAgICAgICAgIEV4dGVybmFsU2VydmljZSxcclxuICAgICAgICAgICAgICAgIEh0dHBDbGllbnQsXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvdmlkZTogUmVzb3VyY2VTZXJ2aWNlLFxyXG4gICAgICAgICAgICAgICAgICAgIHVzZUNsYXNzOiBSZXNvdXJjZVNlcnZpY2UsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVwczogW0V4dGVybmFsU2VydmljZV1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn0iXSwibmFtZXMiOlsib2JzZXJ2YWJsZVRocm93RXJyb3IiLCJ1cmwucGFyc2UiLCJ0c2xpYl8xLl9fdmFsdWVzIiwib2JzZXJ2YWJsZU9mIiwidHNsaWJfMS5f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