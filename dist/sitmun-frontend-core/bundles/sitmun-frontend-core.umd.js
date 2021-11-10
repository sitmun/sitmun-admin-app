(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('rxjs'), require('rxjs/operators'), require('url'), require('@angular/common/http'), require('util'), require('@angular/core'), require('rxjs-compat'), require('@angular/router'), require('@ngx-translate/http-loader'), require('@ngx-translate/core')) :
    typeof define === 'function' && define.amd ? define('@sitmun/frontend-core', ['exports', 'rxjs', 'rxjs/operators', 'url', '@angular/common/http', 'util', '@angular/core', 'rxjs-compat', '@angular/router', '@ngx-translate/http-loader', '@ngx-translate/core'], factory) :
    (factory((global.sitmun = global.sitmun || {}, global.sitmun['frontend-core'] = {}),global.rxjs,global.rxjs.operators,null,global.ng.common.http,null,global.ng.core,null,global.ng.router,null,null));
}(this, (function (exports,rxjs,operators,url,i1,util,i0,rxjsCompat,router,httpLoader,core) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b)
            if (b.hasOwnProperty(p))
                d[p] = b[p]; };
    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    function __values(o) {
        var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
        if (m)
            return m.call(o);
        return {
            next: function () {
                if (o && i >= o.length)
                    o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
    }
    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m)
            return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                ar.push(r.value);
        }
        catch (error) {
            e = { error: error };
        }
        finally {
            try {
                if (r && !r.done && (m = i["return"]))
                    m.call(i);
            }
            finally {
                if (e)
                    throw e.error;
            }
        }
        return ar;
    }
    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }

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
    ResourceArray = (function () {
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
                    return ResourceHelper.getHttp().get(ResourceHelper.getProxy(_this.next_uri), { headers: ResourceHelper.headers }).pipe(operators.map(function (response) { return _this.init(type, response, _this.sortInfo); }), operators.catchError(function (error) { return rxjs.throwError(error); }));
                }
                return rxjs.throwError('no next defined');
            };
            /**
             * Load previous page
             */
            this.prev = function (type) {
                if (_this.prev_uri) {
                    return ResourceHelper.getHttp().get(ResourceHelper.getProxy(_this.prev_uri), { headers: ResourceHelper.headers }).pipe(operators.map(function (response) { return _this.init(type, response, _this.sortInfo); }), operators.catchError(function (error) { return rxjs.throwError(error); }));
                }
                return rxjs.throwError('no prev defined');
            };
            /**
             * Load first page
             */
            this.first = function (type) {
                if (_this.first_uri) {
                    return ResourceHelper.getHttp().get(ResourceHelper.getProxy(_this.first_uri), { headers: ResourceHelper.headers }).pipe(operators.map(function (response) { return _this.init(type, response, _this.sortInfo); }), operators.catchError(function (error) { return rxjs.throwError(error); }));
                }
                return rxjs.throwError('no first defined');
            };
            /**
             * Load last page
             */
            this.last = function (type) {
                if (_this.last_uri) {
                    return ResourceHelper.getHttp().get(ResourceHelper.getProxy(_this.last_uri), { headers: ResourceHelper.headers }).pipe(operators.map(function (response) { return _this.init(type, response, _this.sortInfo); }), operators.catchError(function (error) { return rxjs.throwError(error); }));
                }
                return rxjs.throwError('no last defined');
            };
            /**
             * Load page with given pageNumber
             */
            this.page = function (type, pageNumber) {
                _this.self_uri = _this.self_uri.replace('{?page,size,sort}', '');
                _this.self_uri = _this.self_uri.replace('{&sort}', '');
                /** @type {?} */
                var urlParsed = url.parse(ResourceHelper.getProxy(_this.self_uri));
                /** @type {?} */
                var query = ResourceArray.replaceOrAdd(urlParsed.query, 'size', _this.pageSize.toString());
                query = ResourceArray.replaceOrAdd(query, 'page', pageNumber.toString());
                /** @type {?} */
                var uri = urlParsed.query ?
                    ResourceHelper.getProxy(_this.self_uri).replace(urlParsed.query, query) : ResourceHelper.getProxy(_this.self_uri).concat(query);
                uri = _this.addSortInfo(uri);
                return ResourceHelper.getHttp().get(uri, { headers: ResourceHelper.headers }).pipe(operators.map(function (response) { return _this.init(type, response, _this.sortInfo); }), operators.catchError(function (error) { return rxjs.throwError(error); }));
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
                return ResourceHelper.getHttp().get(uri, { headers: ResourceHelper.headers }).pipe(operators.map(function (response) { return _this.init(type, response, sort); }), operators.catchError(function (error) { return rxjs.throwError(error); }));
            };
            /**
             * Load page with given size
             */
            this.size = function (type, size) {
                /** @type {?} */
                var uri = ResourceHelper.getProxy(_this.self_uri).concat('?', 'size=', size.toString());
                uri = _this.addSortInfo(uri);
                return ResourceHelper.getHttp().get(uri, { headers: ResourceHelper.headers }).pipe(operators.map(function (response) { return _this.init(type, response, _this.sortInfo); }), operators.catchError(function (error) { return rxjs.throwError(error); }));
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
                    catch (e_1_1) {
                        e_1 = { error: e_1_1 };
                    }
                    finally {
                        try {
                            if (_b && !_b.done && (_c = _a.return))
                                _c.call(_a);
                        }
                        finally {
                            if (e_1)
                                throw e_1.error;
                        }
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
    var ResourceHelper = (function () {
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
                        catch (e_1_1) {
                            e_1 = { error: e_1_1 };
                        }
                        finally {
                            try {
                                if (_b && !_b.done && (_c = _a.return))
                                    _c.call(_a);
                            }
                            finally {
                                if (e_1)
                                    throw e_1.error;
                            }
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
                        catch (e_2_1) {
                            e_2 = { error: e_2_1 };
                        }
                        finally {
                            try {
                                if (_e && !_e.done && (_f = _d.return))
                                    _f.call(_d);
                            }
                            finally {
                                if (e_2)
                                    throw e_2.error;
                            }
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
                    if (!util.isNullOrUndefined(resource[key])) {
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
                                    if (util.isPrimitive(element)) {
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
                            catch (e_3_1) {
                                e_3 = { error: e_3_1 };
                            }
                            finally {
                                try {
                                    if (items_1_1 && !items_1_1.done && (_c = items_1.return))
                                        _c.call(items_1);
                                }
                                finally {
                                    if (e_3)
                                        throw e_3.error;
                                }
                            }
                        }
                    }
                }
                catch (e_4_1) {
                    e_4 = { error: e_4_1 };
                }
                finally {
                    try {
                        if (_b && !_b.done && (_d = _a.return))
                            _d.call(_a);
                    }
                    finally {
                        if (e_4)
                            throw e_4.error;
                    }
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
                var uriParsed = url.parse(uri);
                if (util.isNullOrUndefined(uriParsed.search) && uri && uri[uri.length - 1] != '/')
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
            function (url$$1) {
                if (!ResourceHelper.proxy_uri || ResourceHelper.proxy_uri == '')
                    return url$$1;
                return ResourceHelper.addSlash(url$$1.replace(ResourceHelper.root_uri, ResourceHelper.proxy_uri));
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
        ResourceHelper.headers = new i1.HttpHeaders();
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
    var Resource = (function () {
        /** constructor*/
        function Resource() {
        }
        Object.defineProperty(Resource.prototype, "subtypes", {
            get: /**
             * get subtypes
             * @return {?}
             */ function () {
                return this._subtypes;
            },
            set: /**
             * set subtypes
             * @param {?} _subtypes
             * @return {?}
             */ function (_subtypes) {
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
                var params = ResourceHelper.optionParams(new i1.HttpParams(), options);
                /** @type {?} */
                var result = ResourceHelper.createEmptyResult(util.isNullOrUndefined(_embedded) ? "_embedded" : _embedded);
                if (!util.isNullOrUndefined(this._links) && !util.isNullOrUndefined(this._links[relation])) {
                    /** @type {?} */
                    var observable = ResourceHelper.getHttp().get(ResourceHelper.getProxy(this._links[relation].href), {
                        headers: ResourceHelper.headers,
                        params: params
                    });
                    return observable.pipe(operators.map(function (response) { return ResourceHelper.instantiateResourceCollection(type, response, result, builder); }), operators.map(function (array) { return array.result; }));
                }
                else {
                    return rxjs.of([]);
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
                if (!util.isNullOrUndefined(this._links) && !util.isNullOrUndefined(this._links[relation])) {
                    /** @type {?} */
                    var observable = ResourceHelper.getHttp().get(ResourceHelper.getProxy(this._links[relation].href), { headers: ResourceHelper.headers });
                    return observable.pipe(operators.map(function (data) {
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
                            catch (e_1_1) {
                                e_1 = { error: e_1_1 };
                            }
                            finally {
                                try {
                                    if (_b && !_b.done && (_c = _a.return))
                                        _c.call(_a);
                                }
                                finally {
                                    if (e_1)
                                        throw e_1.error;
                                }
                            }
                        }
                        return ResourceHelper.instantiateResource(result, data);
                        var e_1, _c;
                    }));
                }
                else {
                    return rxjs.of(null);
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
                if (!util.isNullOrUndefined(this._links) && !util.isNullOrUndefined(this._links[relation])) {
                    /** @type {?} */
                    var header = ResourceHelper.headers.append('Content-Type', 'text/uri-list');
                    return ResourceHelper.getHttp().post(ResourceHelper.getProxy(this._links[relation].href), resource._links.self.href, { headers: header });
                }
                else {
                    return rxjs.throwError('no relation found');
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
                if (!util.isNullOrUndefined(this._links) && !util.isNullOrUndefined(this._links[relation])) {
                    /** @type {?} */
                    var header = ResourceHelper.headers.append('Content-Type', 'text/uri-list');
                    return ResourceHelper.getHttp().patch(ResourceHelper.getProxy(this._links[relation].href), resource._links.self.href, { headers: header });
                }
                else {
                    return rxjs.throwError('no relation found');
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
                if (!util.isNullOrUndefined(this._links) && !util.isNullOrUndefined(this._links[relation])) {
                    /** @type {?} */
                    var header = ResourceHelper.headers.append('Content-Type', 'text/uri-list');
                    return ResourceHelper.getHttp().put(ResourceHelper.getProxy(this._links[relation].href), resource._links.self.href, { headers: header });
                }
                else {
                    return rxjs.throwError('no relation found');
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
                if (!util.isNullOrUndefined(this._links) && !util.isNullOrUndefined(this._links[relation])) {
                    /** @type {?} */
                    var header = ResourceHelper.headers.append('Content-Type', 'text/uri-list');
                    return ResourceHelper.getHttp().put(ResourceHelper.getProxy(this._links[relation].href), resources.map(function (resource) { return resource._links.self.href; }), { headers: header });
                }
                else {
                    return rxjs.throwError('no relation found');
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
                if (!util.isNullOrUndefined(this._links) && !util.isNullOrUndefined(resource._links)) {
                    /** @type {?} */
                    var link = resource._links['self'].href;
                    /** @type {?} */
                    var idx = link.lastIndexOf('/') + 1;
                    if (idx == -1)
                        return rxjs.throwError('no relation found');
                    /** @type {?} */
                    var relationId = link.substring(idx);
                    return ResourceHelper.getHttp().delete(ResourceHelper.getProxy(this._links[relation].href + '/' + relationId), { headers: ResourceHelper.headers });
                }
                else {
                    return rxjs.throwError('no relation found');
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
            { type: i0.Injectable },
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
    var /**
     * User model
     */ User = (function (_super) {
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
    var ExternalService = (function () {
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
            { type: i0.Injectable },
        ];
        /** @nocollapse */
        ExternalService.ctorParameters = function () {
            return [
                { type: undefined, decorators: [{ type: i0.Inject, args: ['ExternalConfigurationService',] }] }
            ];
        };
        return ExternalService;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /**
     * ResourceService
     */
    var ResourceService = (function () {
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
         * @param {?=} ignoreProjection
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
         * @param {?=} ignoreProjection
         * @return {?}
         */
            function (type, resource, _embedded, options, subType, embeddedName, ignoreProjection) {
                /** @type {?} */
                var uri = this.getResourceUrl(resource);
                if (!ignoreProjection) {
                    uri = uri.concat('?projection=view');
                }
                /** @type {?} */
                var params = ResourceHelper.optionParams(new i1.HttpParams(), options);
                /** @type {?} */
                var result = ResourceHelper.createEmptyResult(_embedded);
                this.setUrls(result);
                result.sortInfo = options ? options.sort : undefined;
                /** @type {?} */
                var observable = ResourceHelper.getHttp().get(uri, { headers: ResourceHelper.headers, params: params });
                return observable.pipe(operators.map(function (response) { return ResourceHelper.instantiateResourceCollection(type, response, result, subType, embeddedName); }), operators.catchError(function (error) { return rxjs.throwError(error); }));
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
                return observable.pipe(operators.map(function (data) { return ResourceHelper.instantiateResource(result, data); }), operators.catchError(function (error) { return rxjs.throwError(error); }));
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
                return observable.pipe(operators.map(function (data) { return ResourceHelper.instantiateResource(result, data); }), operators.catchError(function (error) { return rxjs.throwError(error); }));
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
                var params = ResourceHelper.optionParams(new i1.HttpParams(), options);
                /** @type {?} */
                var result = ResourceHelper.createEmptyResult(_embedded);
                this.setUrls(result);
                /** @type {?} */
                var observable = ResourceHelper.getHttp().get(uri, { headers: ResourceHelper.headers, params: params });
                return observable.pipe(operators.map(function (response) { return ResourceHelper.instantiateResourceCollection(type, response, result); }), operators.catchError(function (error) { return rxjs.throwError(error); }));
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
                var params = ResourceHelper.optionParams(new i1.HttpParams(), options);
                /** @type {?} */
                var result = new type();
                this.setUrlsResource(result);
                /** @type {?} */
                var observable = ResourceHelper.getHttp().get(uri, { headers: ResourceHelper.headers, params: params });
                return observable.pipe(operators.map(function (response) { return ResourceHelper.instantiateResource(result, response); }), operators.catchError(function (error) { return rxjs.throwError(error); }));
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
                var params = ResourceHelper.optionParams(new i1.HttpParams(), options);
                /** @type {?} */
                var result = ResourceHelper.createEmptyResult(_embedded);
                this.setUrls(result);
                /** @type {?} */
                var observable = ResourceHelper.getHttp().get(uri, { headers: ResourceHelper.headers, params: params });
                return observable.pipe(operators.map(function (response) { return ResourceHelper.instantiateResourceCollection(type, response, result); }), operators.catchError(function (error) { return rxjs.throwError(error); }));
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
                return observable.pipe(operators.map(function (data) { return ResourceHelper.instantiateResource(result, data); }), operators.catchError(function (error) { return rxjs.throwError(error); }));
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
                return observable.pipe(operators.map(function (response) { return ResourceHelper.instantiateResourceCollection(type, response, result, builder); }), operators.catchError(function (error) { return rxjs.throwError(error); }));
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
                return ResourceHelper.getHttp().get(uri, { headers: ResourceHelper.headers, observe: 'body' }).pipe(operators.map(function (response) { return Number(response.body); }), operators.catchError(function (error) { return rxjs.throwError(error); }));
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
                return observable.pipe(operators.map(function (response) {
                    if (response.status >= 200 && response.status <= 207)
                        return ResourceHelper.instantiateResource(entity, response.body);
                    else if (response.status == 500) {
                        /** @type {?} */
                        var body = response.body;
                        return rxjs.throwError(body.error);
                    }
                }), operators.catchError(function (error) { return rxjs.throwError(error); }));
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
                return observable.pipe(operators.map(function (response) {
                    if (response.status >= 200 && response.status <= 207)
                        return ResourceHelper.instantiateResource(entity, response.body);
                    else if (response.status == 500) {
                        /** @type {?} */
                        var body = response.body;
                        return rxjs.throwError(body.error);
                    }
                }), operators.catchError(function (error) { return rxjs.throwError(error); }));
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
                return observable.pipe(operators.map(function (response) {
                    if (response.status >= 200 && response.status <= 207)
                        return "";
                    else if (response.status == 500) {
                        /** @type {?} */
                        var body = response.body;
                        return rxjs.throwError(body.error);
                    }
                }), operators.catchError(function (error) { return rxjs.throwError(error); }));
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
                return observable.pipe(operators.map(function (response) {
                    if (response.status >= 200 && response.status <= 207)
                        return ResourceHelper.instantiateResource(entity, response.body);
                    else if (response.status == 500) {
                        /** @type {?} */
                        var body = response.body;
                        return rxjs.throwError(body.error);
                    }
                }), operators.catchError(function (error) { return rxjs.throwError(error); }));
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
                return ResourceHelper.getHttp().delete(uri, { headers: ResourceHelper.headers }).pipe(operators.catchError(function (error) { return rxjs.throwError(error); }));
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
                var url$$1 = ResourceService.getURL();
                if (!url$$1.endsWith('/')) {
                    url$$1 = url$$1.concat('/');
                }
                if (resource) {
                    return url$$1.concat(resource);
                }
                return url$$1;
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
            { type: i0.Injectable },
        ];
        /** @nocollapse */
        ResourceService.ctorParameters = function () {
            return [
                { type: ExternalService }
            ];
        };
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
    RestService = (function () {
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
            if (!util.isNullOrUndefined(_embedded))
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
                return rxjs.throwError(error);
            };
        /**
         * get all resources with optional options an subType params
         * @param {?=} options
         * @param {?=} subType
         * @param {?=} embeddedName
         * @param {?=} ignoreProjection
         * @return {?}
         */
        RestService.prototype.getAll = /**
         * get all resources with optional options an subType params
         * @param {?=} options
         * @param {?=} subType
         * @param {?=} embeddedName
         * @param {?=} ignoreProjection
         * @return {?}
         */
            function (options, subType, embeddedName, ignoreProjection) {
                var _this = this;
                return this.resourceService.getAll(this.type, this.resource, this._embedded, options, subType, embeddedName, ignoreProjection).pipe(operators.mergeMap(function (resourceArray) {
                    if (options && options.notPaged && !util.isNullOrUndefined(resourceArray.first_uri)) {
                        options.notPaged = false;
                        options.size = resourceArray.totalElements;
                        return _this.getAll(options);
                    }
                    else {
                        _this.resourceArray = resourceArray;
                        return rxjs.of(resourceArray.result);
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
                return this.resourceService.search(this.type, query, this.resource, this._embedded, options).pipe(operators.mergeMap(function (resourceArray) {
                    if (options && options.notPaged && !util.isNullOrUndefined(resourceArray.first_uri)) {
                        options.notPaged = false;
                        options.size = resourceArray.totalElements;
                        return _this.search(query, options);
                    }
                    else {
                        _this.resourceArray = resourceArray;
                        return rxjs.of(resourceArray.result);
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
                return this.resourceService.customQuery(this.type, query, this.resource, this._embedded, options).pipe(operators.mergeMap(function (resourceArray) {
                    if (options && options.notPaged && !util.isNullOrUndefined(resourceArray.first_uri)) {
                        options.notPaged = false;
                        options.size = resourceArray.totalElements;
                        return _this.customQuery(query, options);
                    }
                    else {
                        _this.resourceArray = resourceArray;
                        return rxjs.of(resourceArray.result);
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
                return this.resourceService.getByRelationArray(this.type, relation, this._embedded, builder).pipe(operators.map(function (resourceArray) {
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
                    return this.resourceService.next(this.resourceArray, this.type).pipe(operators.map(function (resourceArray) {
                        _this.resourceArray = resourceArray;
                        return resourceArray.result;
                    }));
                else
                    rxjs.throwError('no resourceArray found');
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
                    return this.resourceService.prev(this.resourceArray, this.type).pipe(operators.map(function (resourceArray) {
                        _this.resourceArray = resourceArray;
                        return resourceArray.result;
                    }));
                else
                    rxjs.throwError('no resourceArray found');
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
                        .pipe(operators.map(function (resourceArray) {
                        _this.resourceArray = resourceArray;
                        return resourceArray.result;
                    }));
                else
                    rxjs.throwError('no resourceArray found');
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
                        .pipe(operators.map(function (resourceArray) {
                        _this.resourceArray = resourceArray;
                        return resourceArray.result;
                    }));
                else
                    rxjs.throwError('no resourceArray found');
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
                    return this.resourceService.page(this.resourceArray, this.type, pageNumber).pipe(operators.map(function (resourceArray) {
                        _this.resourceArray = resourceArray;
                        return resourceArray.result;
                    }));
                else
                    rxjs.throwError('no resourceArray found');
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
    var AccountService = (function (_super) {
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
            { type: i0.Injectable },
        ];
        /** @nocollapse */
        AccountService.ctorParameters = function () {
            return [
                { type: i0.Injector },
                { type: i1.HttpClient }
            ];
        };
        return AccountService;
    }(RestService));

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /**
     * Authentication service
     */
    var AuthService = (function () {
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
                return new rxjsCompat.Observable(function (observer) {
                    //localStorage.removeItem('authenticationToken');
                    sessionStorage.removeItem('authenticationToken');
                    //sessionStorage.removeItem('expires_at');
                    observer.complete();
                });
            };
        AuthService.decorators = [
            { type: i0.Injectable },
        ];
        /** @nocollapse */
        AuthService.ctorParameters = function () {
            return [
                { type: i1.HttpClient },
                { type: ResourceService }
            ];
        };
        return AuthService;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /**
     * Interceptor for authentication token in API requests
     */
    var /**
     * Interceptor for authentication token in API requests
     */ AuthInterceptor = (function () {
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
                if (!request || !request.url || !(request.url.includes("/api/"))) {
                    request.headers.append('Access-Control-Allow-Origin', '*');
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
    var Principal = (function () {
        /** constructor */
        function Principal(account) {
            this.account = account;
            this.authenticated = false;
            this.authenticationState = new rxjs.Subject();
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
            { type: i0.Injectable },
        ];
        /** @nocollapse */
        Principal.ctorParameters = function () {
            return [
                { type: AccountService }
            ];
        };
        return Principal;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /**
     * Interceptor for authentication expired response in API requests
     */
    var AuthExpiredInterceptor = (function () {
        /** constructor */
        function AuthExpiredInterceptor(router$$1, authService, principal) {
            this.router = router$$1;
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
                        if (err instanceof i1.HttpErrorResponse) {
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
            { type: i0.Injectable },
        ];
        /** @nocollapse */
        AuthExpiredInterceptor.ctorParameters = function () {
            return [
                { type: router.Router },
                { type: AuthService },
                { type: Principal }
            ];
        };
        return AuthExpiredInterceptor;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /**
     * Login service
     */
    var LoginService = (function () {
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
            { type: i0.Injectable },
        ];
        /** @nocollapse */
        LoginService.ctorParameters = function () {
            return [
                { type: AuthService },
                { type: Principal }
            ];
        };
        return LoginService;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var DashboardService = (function () {
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
            { type: i0.Injectable, args: [{
                        providedIn: 'root'
                    },] },
        ];
        /** @nocollapse */
        DashboardService.ctorParameters = function () {
            return [
                { type: i1.HttpClient },
                { type: ResourceService }
            ];
        };
        /** @nocollapse */ DashboardService.ngInjectableDef = i0.defineInjectable({ factory: function DashboardService_Factory() { return new DashboardService(i0.inject(i1.HttpClient), i0.inject(ResourceService)); }, token: DashboardService, providedIn: "root" });
        return DashboardService;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /**
     * User manager service
     */
    var UserService = (function (_super) {
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
            { type: i0.Injectable },
        ];
        /** @nocollapse */
        UserService.ctorParameters = function () {
            return [
                { type: i0.Injector },
                { type: i1.HttpClient }
            ];
        };
        return UserService;
    }(RestService));

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /**
     * User position model
     */
    var /**
     * User position model
     */ UserPosition = (function (_super) {
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
    var UserPositionService = (function (_super) {
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
            { type: i0.Injectable },
        ];
        /** @nocollapse */
        UserPositionService.ctorParameters = function () {
            return [
                { type: i0.Injector },
                { type: i1.HttpClient }
            ];
        };
        return UserPositionService;
    }(RestService));

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /**
     * User permission model
     */
    var /**
     * User permission model
     */ UserConfiguration = (function (_super) {
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
    var UserConfigurationService = (function (_super) {
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
            { type: i0.Injectable },
        ];
        /** @nocollapse */
        UserConfigurationService.ctorParameters = function () {
            return [
                { type: i0.Injector },
                { type: i1.HttpClient }
            ];
        };
        return UserConfigurationService;
    }(RestService));

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /**
     * Territory model
     */
    var /**
     * Territory model
     */ Territory = (function (_super) {
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
    var TerritoryService = (function (_super) {
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
                /** @type {?} */
                var territoryType = {};
                territoryType._links = {};
                territoryType._links.self = {};
                territoryType._links.self.href = "";
                if (item.type != null) {
                    territoryType = item.type;
                    if (typeof item.type._links != 'undefined') {
                        item.type = item.type._links.self.href;
                    }
                }
                if (item._links != null) {
                    //update relations
                    delete item.groupType;
                    // if (territoryGroupType._links.self.href == '') {
                    //   item.deleteRelation('groupType', territoryGroupType).subscribe(result => {
                    //   }, error => console.error(error));
                    // } else {
                    //   item.substituteRelation('groupType', territoryGroupType).subscribe(result => {
                    //   }, error => console.error(error));
                    // }
                    if (territoryType._links.self.href == '') {
                        item.deleteRelation('type', territoryType).subscribe(function (result) {
                        }, function (error) { return console.error(error); });
                    }
                    else {
                        item.substituteRelation('type', territoryType).subscribe(function (result) {
                        }, function (error) { return console.error(error); });
                    }
                    delete item.type;
                    // if (item.type != null)
                    //   item.type = item.type._links.self.href;
                    result = this.http.put(item._links.self.href, item);
                }
                else {
                    result = this.http.post(this.resourceService.getResourceUrl(this.TERRITORY_API), item);
                }
                return result;
            };
        TerritoryService.decorators = [
            { type: i0.Injectable },
        ];
        /** @nocollapse */
        TerritoryService.ctorParameters = function () {
            return [
                { type: i0.Injector },
                { type: i1.HttpClient }
            ];
        };
        return TerritoryService;
    }(RestService));

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /**
     * Territory type model
     */
    var /**
     * Territory type model
     */ TerritoryType = (function (_super) {
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
    var TerritoryTypeService = (function (_super) {
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
            { type: i0.Injectable },
        ];
        /** @nocollapse */
        TerritoryTypeService.ctorParameters = function () {
            return [
                { type: i0.Injector },
                { type: i1.HttpClient }
            ];
        };
        return TerritoryTypeService;
    }(RestService));

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /**
     * Territory type model
     */
    var /**
     * Territory type model
     */ TerritoryGroupType = (function (_super) {
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
    var TerritoryGroupTypeService = (function (_super) {
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
            { type: i0.Injectable, args: [{
                        providedIn: 'root'
                    },] },
        ];
        /** @nocollapse */
        TerritoryGroupTypeService.ctorParameters = function () {
            return [
                { type: i0.Injector },
                { type: i1.HttpClient }
            ];
        };
        /** @nocollapse */ TerritoryGroupTypeService.ngInjectableDef = i0.defineInjectable({ factory: function TerritoryGroupTypeService_Factory() { return new TerritoryGroupTypeService(i0.inject(i0.INJECTOR), i0.inject(i1.HttpClient)); }, token: TerritoryGroupTypeService, providedIn: "root" });
        return TerritoryGroupTypeService;
    }(RestService));

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /**
     * Role model
     */
    var /**
     * Role model
     */ Role = (function (_super) {
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
    var RoleService = (function (_super) {
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
            { type: i0.Injectable },
        ];
        /** @nocollapse */
        RoleService.ctorParameters = function () {
            return [
                { type: i0.Injector },
                { type: i1.HttpClient }
            ];
        };
        return RoleService;
    }(RestService));

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /**
     * Connection model
     */
    var /**
     * Connection model
     */ Connection = (function (_super) {
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
    var ConnectionService = (function (_super) {
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
            { type: i0.Injectable },
        ];
        /** @nocollapse */
        ConnectionService.ctorParameters = function () {
            return [
                { type: i0.Injector },
                { type: i1.HttpClient }
            ];
        };
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
    var /**
     * Task model
     */ Task = (function (_super) {
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
    var TaskService = (function (_super) {
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
            { type: i0.Injectable },
        ];
        /** @nocollapse */
        TaskService.ctorParameters = function () {
            return [
                { type: i0.Injector },
                { type: i1.HttpClient }
            ];
        };
        return TaskService;
    }(RestService));

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /**
     * Task type model
     */
    var /**
     * Task type model
     */ TaskType = (function (_super) {
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
    var TaskTypeService = (function (_super) {
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
            { type: i0.Injectable },
        ];
        /** @nocollapse */
        TaskTypeService.ctorParameters = function () {
            return [
                { type: i0.Injector },
                { type: i1.HttpClient }
            ];
        };
        return TaskTypeService;
    }(RestService));

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /**
     * Task group model
     */
    var /**
     * Task group model
     */ TaskGroup = (function (_super) {
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
    var TaskGroupService = (function (_super) {
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
            { type: i0.Injectable },
        ];
        /** @nocollapse */
        TaskGroupService.ctorParameters = function () {
            return [
                { type: i0.Injector },
                { type: i1.HttpClient }
            ];
        };
        return TaskGroupService;
    }(RestService));

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /**
     * Task parameter model
     */
    var /**
     * Task parameter model
     */ TaskParameter = (function (_super) {
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
    var TaskParameterService = (function (_super) {
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
            { type: i0.Injectable },
        ];
        /** @nocollapse */
        TaskParameterService.ctorParameters = function () {
            return [
                { type: i0.Injector },
                { type: i1.HttpClient }
            ];
        };
        return TaskParameterService;
    }(RestService));

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /**
     * Task availability model
     */
    var /**
     * Task availability model
     */ TaskAvailability = (function (_super) {
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
    var TaskAvailabilityService = (function (_super) {
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
            { type: i0.Injectable },
        ];
        /** @nocollapse */
        TaskAvailabilityService.ctorParameters = function () {
            return [
                { type: i0.Injector },
                { type: i1.HttpClient }
            ];
        };
        return TaskAvailabilityService;
    }(RestService));

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /**
     * Task UI model
     */
    var /**
     * Task UI model
     */ TaskUI = (function (_super) {
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
    var TaskUIService = (function (_super) {
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
            { type: i0.Injectable },
        ];
        /** @nocollapse */
        TaskUIService.ctorParameters = function () {
            return [
                { type: i0.Injector },
                { type: i1.HttpClient }
            ];
        };
        return TaskUIService;
    }(RestService));

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /**
     * Task model
     */
    var /**
     * Task model
     */ Translation = (function (_super) {
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
    var TranslationService = (function (_super) {
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
            { type: i0.Injectable, args: [{
                        providedIn: 'root'
                    },] },
        ];
        /** @nocollapse */
        TranslationService.ctorParameters = function () {
            return [
                { type: i0.Injector },
                { type: i1.HttpClient }
            ];
        };
        /** @nocollapse */ TranslationService.ngInjectableDef = i0.defineInjectable({ factory: function TranslationService_Factory() { return new TranslationService(i0.inject(i0.INJECTOR), i0.inject(i1.HttpClient)); }, token: TranslationService, providedIn: "root" });
        return TranslationService;
    }(RestService));

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /**
     * Task model
     */
    var /**
     * Task model
     */ Language = (function (_super) {
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
    var LanguageService = (function (_super) {
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
            { type: i0.Injectable, args: [{
                        providedIn: 'root'
                    },] },
        ];
        /** @nocollapse */
        LanguageService.ctorParameters = function () {
            return [
                { type: i0.Injector },
                { type: i1.HttpClient }
            ];
        };
        /** @nocollapse */ LanguageService.ngInjectableDef = i0.defineInjectable({ factory: function LanguageService_Factory() { return new LanguageService(i0.inject(i0.INJECTOR), i0.inject(i1.HttpClient)); }, token: LanguageService, providedIn: "root" });
        return LanguageService;
    }(RestService));

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /**
     * Service model
     */
    var /**
     * Service model
     */ Service = (function (_super) {
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
    var ServiceService = (function (_super) {
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
            { type: i0.Injectable },
        ];
        /** @nocollapse */
        ServiceService.ctorParameters = function () {
            return [
                { type: i0.Injector },
                { type: i1.HttpClient }
            ];
        };
        return ServiceService;
    }(RestService));

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /**
     * Service model
     */
    var /**
     * Service model
     */ ConfigurationParameter = (function (_super) {
        __extends(ConfigurationParameter, _super);
        function ConfigurationParameter() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return ConfigurationParameter;
    }(Resource));

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var ConfigurationParametersService = (function (_super) {
        __extends(ConfigurationParametersService, _super);
        /** constructor */
        function ConfigurationParametersService(injector, http) {
            var _this = _super.call(this, ConfigurationParameter, "configuration-parameters", injector) || this;
            _this.http = http;
            /**
             * API resource path
             */
            _this.CONFIGURATION_PARAMETERS_API = 'configuration-parameters';
            return _this;
        }
        ConfigurationParametersService.decorators = [
            { type: i0.Injectable, args: [{
                        providedIn: 'root'
                    },] },
        ];
        /** @nocollapse */
        ConfigurationParametersService.ctorParameters = function () {
            return [
                { type: i0.Injector },
                { type: i1.HttpClient }
            ];
        };
        /** @nocollapse */ ConfigurationParametersService.ngInjectableDef = i0.defineInjectable({ factory: function ConfigurationParametersService_Factory() { return new ConfigurationParametersService(i0.inject(i0.INJECTOR), i0.inject(i1.HttpClient)); }, token: ConfigurationParametersService, providedIn: "root" });
        return ConfigurationParametersService;
    }(RestService));

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /**
     * Service parameter model
     */
    var /**
     * Service parameter model
     */ ServiceParameter = (function (_super) {
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
    var ServiceParameterService = (function (_super) {
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
            { type: i0.Injectable },
        ];
        /** @nocollapse */
        ServiceParameterService.ctorParameters = function () {
            return [
                { type: i0.Injector },
                { type: i1.HttpClient }
            ];
        };
        return ServiceParameterService;
    }(RestService));

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /**
     * Capabilitie model
     */
    var /**
     * Capabilitie model
     */ Capabilitie = (function (_super) {
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
    var CapabilitiesService = (function (_super) {
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
            function (url$$1) {
                /** @type {?} */
                var result;
                if (url$$1) {
                    /** @type {?} */
                    var headerDict = {
                        'Charset': 'UTF-8'
                    };
                    /** @type {?} */
                    var requestOptions = {
                        headers: new i1.HttpHeaders(headerDict),
                    };
                    /** @type {?} */
                    var finalUrl = this.resourceService.getResourceUrl(this.CAPABILITIES_API);
                    finalUrl = finalUrl.concat(url$$1);
                    console.log(finalUrl);
                    result = this.http.get(finalUrl, requestOptions);
                }
                return result;
            };
        CapabilitiesService.decorators = [
            { type: i0.Injectable, args: [{
                        providedIn: 'root'
                    },] },
        ];
        /** @nocollapse */
        CapabilitiesService.ctorParameters = function () {
            return [
                { type: i0.Injector },
                { type: i1.HttpClient }
            ];
        };
        /** @nocollapse */ CapabilitiesService.ngInjectableDef = i0.defineInjectable({ factory: function CapabilitiesService_Factory() { return new CapabilitiesService(i0.inject(i0.INJECTOR), i0.inject(i1.HttpClient)); }, token: CapabilitiesService, providedIn: "root" });
        return CapabilitiesService;
    }(RestService));

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /**
     * Info model
     */
    var /**
     * Info model
     */ Info = (function (_super) {
        __extends(Info, _super);
        function Info() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Info;
    }(Resource));

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var GetInfoService = (function (_super) {
        __extends(GetInfoService, _super);
        /** constructor */
        function GetInfoService(injector, http) {
            var _this = _super.call(this, Info, "helpers/feature-type?url=", injector) || this;
            _this.http = http;
            /**
             * API resource path
             */
            _this.INFO_API = 'helpers/feature-type?url=';
            return _this;
        }
        /** save service*/
        /**
         * save service
         * @param {?} url
         * @return {?}
         */
        GetInfoService.prototype.getInfo = /**
         * save service
         * @param {?} url
         * @return {?}
         */
            function (url$$1) {
                /** @type {?} */
                var result;
                if (url$$1) {
                    /** @type {?} */
                    var headerDict = {
                        'Charset': 'UTF-8'
                    };
                    /** @type {?} */
                    var requestOptions = {
                        headers: new i1.HttpHeaders(headerDict),
                    };
                    /** @type {?} */
                    var finalUrl = this.resourceService.getResourceUrl(this.INFO_API);
                    finalUrl = finalUrl.concat(url$$1);
                    console.log(finalUrl);
                    result = this.http.get(finalUrl, requestOptions);
                }
                return result;
            };
        GetInfoService.decorators = [
            { type: i0.Injectable, args: [{
                        providedIn: 'root'
                    },] },
        ];
        /** @nocollapse */
        GetInfoService.ctorParameters = function () {
            return [
                { type: i0.Injector },
                { type: i1.HttpClient }
            ];
        };
        /** @nocollapse */ GetInfoService.ngInjectableDef = i0.defineInjectable({ factory: function GetInfoService_Factory() { return new GetInfoService(i0.inject(i0.INJECTOR), i0.inject(i1.HttpClient)); }, token: GetInfoService, providedIn: "root" });
        return GetInfoService;
    }(RestService));

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /**
     * Cartography
     */
    var /**
     * Cartography
     */ Cartography = (function (_super) {
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
    var CartographyService = (function (_super) {
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
            { type: i0.Injectable },
        ];
        /** @nocollapse */
        CartographyService.ctorParameters = function () {
            return [
                { type: i0.Injector },
                { type: i1.HttpClient }
            ];
        };
        return CartographyService;
    }(RestService));

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /**
     * Cartography group
     */
    var /**
     * Cartography group
     */ CartographyGroup = (function (_super) {
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
    var CartographyGroupService = (function (_super) {
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
            { type: i0.Injectable },
        ];
        /** @nocollapse */
        CartographyGroupService.ctorParameters = function () {
            return [
                { type: i0.Injector },
                { type: i1.HttpClient }
            ];
        };
        return CartographyGroupService;
    }(RestService));

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /**
     * Cartography availability model
     */
    var /**
     * Cartography availability model
     */ CartographyAvailability = (function (_super) {
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
    var CartographyAvailabilityService = (function (_super) {
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
            { type: i0.Injectable },
        ];
        /** @nocollapse */
        CartographyAvailabilityService.ctorParameters = function () {
            return [
                { type: i0.Injector },
                { type: i1.HttpClient }
            ];
        };
        return CartographyAvailabilityService;
    }(RestService));

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /**
     * Cartography availability model
     */
    var /**
     * Cartography availability model
     */ CartographyFilter = (function (_super) {
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
    var CartographyFilterService = (function (_super) {
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
            { type: i0.Injectable },
        ];
        /** @nocollapse */
        CartographyFilterService.ctorParameters = function () {
            return [
                { type: i0.Injector },
                { type: i1.HttpClient }
            ];
        };
        return CartographyFilterService;
    }(RestService));

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /**
     * Service parameter model
     */
    var /**
     * Service parameter model
     */ CartographyParameter = (function (_super) {
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
    var CartographyParameterService = (function (_super) {
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
            { type: i0.Injectable },
        ];
        /** @nocollapse */
        CartographyParameterService.ctorParameters = function () {
            return [
                { type: i0.Injector },
                { type: i1.HttpClient }
            ];
        };
        return CartographyParameterService;
    }(RestService));

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /**
     * Service parameter manager service
     */
    var CartographySpatialSelectionParameterService = (function (_super) {
        __extends(CartographySpatialSelectionParameterService, _super);
        /** constructor */
        function CartographySpatialSelectionParameterService(injector, http) {
            var _this = _super.call(this, CartographyParameter, "cartography-spatial-selection-parameters", injector) || this;
            _this.http = http;
            /**
             * API resource path
             */
            _this.CARTOGRAPHY_SPATIAL_SELECTION_PARAMETER_API = 'cartography-spatial-selection-parameters';
            return _this;
        }
        /** remove service parameter*/
        /**
         * remove service parameter
         * @param {?} item
         * @return {?}
         */
        CartographySpatialSelectionParameterService.prototype.remove = /**
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
        CartographySpatialSelectionParameterService.prototype.save = /**
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
                    result = this.http.post(this.resourceService.getResourceUrl(this.CARTOGRAPHY_SPATIAL_SELECTION_PARAMETER_API), item);
                }
                return result;
            };
        CartographySpatialSelectionParameterService.decorators = [
            { type: i0.Injectable },
        ];
        /** @nocollapse */
        CartographySpatialSelectionParameterService.ctorParameters = function () {
            return [
                { type: i0.Injector },
                { type: i1.HttpClient }
            ];
        };
        return CartographySpatialSelectionParameterService;
    }(RestService));

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /**
     * Cartography style model
     */
    var /**
     * Cartography style model
     */ CartographyStyle = (function (_super) {
        __extends(CartographyStyle, _super);
        function CartographyStyle() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return CartographyStyle;
    }(Resource));

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var CartographyStyleService = (function (_super) {
        __extends(CartographyStyleService, _super);
        /** constructor */
        function CartographyStyleService(injector, http) {
            var _this = _super.call(this, CartographyStyle, "cartography-styles", injector) || this;
            _this.http = http;
            /**
             * API resource path
             */
            _this.CARTOGRAPHY_STYLES_API = 'cartography-styles';
            return _this;
        }
        /** remove service parameter*/
        /**
         * remove service parameter
         * @param {?} item
         * @return {?}
         */
        CartographyStyleService.prototype.remove = /**
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
        CartographyStyleService.prototype.save = /**
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
                    result = this.http.post(this.resourceService.getResourceUrl(this.CARTOGRAPHY_STYLES_API), item);
                }
                return result;
            };
        CartographyStyleService.decorators = [
            { type: i0.Injectable, args: [{
                        providedIn: 'root'
                    },] },
        ];
        /** @nocollapse */
        CartographyStyleService.ctorParameters = function () {
            return [
                { type: i0.Injector },
                { type: i1.HttpClient }
            ];
        };
        /** @nocollapse */ CartographyStyleService.ngInjectableDef = i0.defineInjectable({ factory: function CartographyStyleService_Factory() { return new CartographyStyleService(i0.inject(i0.INJECTOR), i0.inject(i1.HttpClient)); }, token: CartographyStyleService, providedIn: "root" });
        return CartographyStyleService;
    }(RestService));

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /**
     * Background model
     */
    var /**
     * Background model
     */ Background = (function (_super) {
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
    var BackgroundService = (function (_super) {
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
            { type: i0.Injectable },
        ];
        /** @nocollapse */
        BackgroundService.ctorParameters = function () {
            return [
                { type: i0.Injector },
                { type: i1.HttpClient }
            ];
        };
        return BackgroundService;
    }(RestService));

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /**
     * Tree model
     */
    var /**
     * Tree model
     */ Tree = (function (_super) {
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
    var TreeService = (function (_super) {
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
            { type: i0.Injectable },
        ];
        /** @nocollapse */
        TreeService.ctorParameters = function () {
            return [
                { type: i0.Injector },
                { type: i1.HttpClient }
            ];
        };
        return TreeService;
    }(RestService));

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /**
     * Tree node model
     */
    var /**
     * Tree node model
     */ TreeNode = (function (_super) {
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
    var TreeNodeService = (function (_super) {
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
            { type: i0.Injectable },
        ];
        /** @nocollapse */
        TreeNodeService.ctorParameters = function () {
            return [
                { type: i0.Injector },
                { type: i1.HttpClient }
            ];
        };
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
    var /**
     * Application model
     */ Application = (function (_super) {
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
    var ApplicationService = (function (_super) {
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
            { type: i0.Injectable },
        ];
        /** @nocollapse */
        ApplicationService.ctorParameters = function () {
            return [
                { type: i0.Injector },
                { type: i1.HttpClient }
            ];
        };
        return ApplicationService;
    }(RestService));

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /**
     * Application background model
     */
    var /**
     * Application background model
     */ ApplicationBackground = (function (_super) {
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
    var ApplicationBackgroundService = (function (_super) {
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
            { type: i0.Injectable },
        ];
        /** @nocollapse */
        ApplicationBackgroundService.ctorParameters = function () {
            return [
                { type: i0.Injector },
                { type: i1.HttpClient }
            ];
        };
        return ApplicationBackgroundService;
    }(RestService));

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /**
     * Application parameter model
     */
    var /**
     * Application parameter model
     */ ApplicationParameter = (function (_super) {
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
    var ApplicationParameterService = (function (_super) {
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
            { type: i0.Injectable },
        ];
        /** @nocollapse */
        ApplicationParameterService.ctorParameters = function () {
            return [
                { type: i0.Injector },
                { type: i1.HttpClient }
            ];
        };
        return ApplicationParameterService;
    }(RestService));

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /**
     * Connection model
     */
    var /**
     * Connection model
     */ CodeList = (function (_super) {
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
    var CodeListService = (function (_super) {
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
            { type: i0.Injectable },
        ];
        /** @nocollapse */
        CodeListService.ctorParameters = function () {
            return [
                { type: i0.Injector },
                { type: i1.HttpClient }
            ];
        };
        return CodeListService;
    }(RestService));

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /**
     * Layer model: configure Layer data and displaying configuration
     */
    var /**
     * Layer model: configure Layer data and displaying configuration
     */ Layer = (function () {
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
    var /**
     * Optional parameter model: configure parameter-value pair to add to the request layer URL
     */ OptionalParameter = (function () {
        function OptionalParameter() {
        }
        return OptionalParameter;
    }());
    /**
     * Layer configuration model: modify the configuration of a layer when interacting with the map (make visible, move the layer ...)
     */
    var /**
     * Layer configuration model: modify the configuration of a layer when interacting with the map (make visible, move the layer ...)
     */ LayerConfiguration = (function () {
        function LayerConfiguration() {
        }
        return LayerConfiguration;
    }());
    /**
     * Layer group model
     */
    var /**
     * Layer group model
     */ LayerGroup = (function () {
        function LayerGroup() {
        }
        return LayerGroup;
    }());
    /**
     * Map options configuration model
     */
    var /**
     * Map options configuration model
     */ MapOptionsConfiguration = (function () {
        function MapOptionsConfiguration() {
        }
        return MapOptionsConfiguration;
    }());
    /**
     * Map component status model
     */
    var /**
     * Map component status model
     */ MapComponentStatus = (function () {
        function MapComponentStatus() {
            /**
             * loaded?
             */
            this.loaded = false;
        }
        return MapComponentStatus;
    }());
    var MapConfigurationManagerService = (function () {
        /** constructor*/
        function MapConfigurationManagerService() {
            //
            this.layersSubject = new rxjs.BehaviorSubject([]);
            this.layers = null;
            this.baseLayerGroupsSubject = new rxjs.BehaviorSubject([]);
            this.baseLayerGroups = null;
            this.layerConfigurationSubject = new rxjs.BehaviorSubject([]);
            this.addLayersSubject = new rxjs.BehaviorSubject([]);
            this.removeLayersSubject = new rxjs.BehaviorSubject([]);
            this.situationMapConfigurationSubject = new rxjs.BehaviorSubject([]);
            this.mapOptionsConfigurationSubject = new rxjs.BehaviorSubject([]);
            this.mapComponentStatusSubject = new rxjs.BehaviorSubject([]);
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
            { type: i0.Injectable, args: [{
                        providedIn: 'root'
                    },] },
        ];
        /** @nocollapse */
        MapConfigurationManagerService.ctorParameters = function () { return []; };
        /** @nocollapse */ MapConfigurationManagerService.ngInjectableDef = i0.defineInjectable({ factory: function MapConfigurationManagerService_Factory() { return new MapConfigurationManagerService(); }, token: MapConfigurationManagerService, providedIn: "root" });
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
    var HasAnyAuthorityDirective = (function () {
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
             */ function (value) {
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
            { type: i0.Directive, args: [{
                        selector: '[sitmunHasAnyAuthority]'
                    },] },
        ];
        /** @nocollapse */
        HasAnyAuthorityDirective.ctorParameters = function () {
            return [
                { type: Principal },
                { type: i0.TemplateRef },
                { type: i0.ViewContainerRef }
            ];
        };
        HasAnyAuthorityDirective.propDecorators = {
            territory: [{ type: i0.Input }],
            sitmunHasAnyAuthority: [{ type: i0.Input }]
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
    var HasAnyAuthorityOnTerritoryDirective = (function () {
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
             */ function (opts) {
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
            { type: i0.Directive, args: [{
                        selector: '[sitmunHasAnyAuthorityOnTerritory]'
                    },] },
        ];
        /** @nocollapse */
        HasAnyAuthorityOnTerritoryDirective.ctorParameters = function () {
            return [
                { type: Principal },
                { type: i0.TemplateRef },
                { type: i0.ViewContainerRef }
            ];
        };
        HasAnyAuthorityOnTerritoryDirective.propDecorators = {
            sitmunHasAnyAuthorityOnTerritory: [{ type: i0.Input }]
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
        return new httpLoader.TranslateHttpLoader(http, './assets/i18n/', '.json');
    }
    var ɵ0 = (createTranslateLoader);
    /**
     * SITMUN frontend core module
     */
    var SitmunFrontendCoreModule = (function () {
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
                        ConfigurationParametersService,
                        CapabilitiesService,
                        GetInfoService,
                        ServiceParameterService,
                        CartographyService,
                        CartographyGroupService,
                        CartographyAvailabilityService,
                        CartographyParameterService,
                        CartographySpatialSelectionParameterService,
                        CartographyStyleService,
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
                            provide: i1.HTTP_INTERCEPTORS,
                            useClass: AuthInterceptor,
                            multi: true
                        },
                        {
                            provide: i1.HTTP_INTERCEPTORS,
                            useClass: AuthExpiredInterceptor,
                            multi: true
                        }
                    ]
                };
            };
        SitmunFrontendCoreModule.decorators = [
            { type: i0.NgModule, args: [{
                        imports: [
                            /*RouterModule,
                                HttpClientModule,
                                CommonModule,
                                AngularHalModule,*/
                            core.TranslateModule.forRoot({
                                loader: {
                                    provide: core.TranslateLoader,
                                    useFactory: ɵ0,
                                    deps: [i1.HttpClient]
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
                            core.TranslateModule
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
    var AngularHalModule = (function () {
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
                        i1.HttpClient,
                        {
                            provide: ResourceService,
                            useClass: ResourceService,
                            deps: [ExternalService]
                        }
                    ]
                };
            };
        AngularHalModule.decorators = [
            { type: i0.NgModule, args: [{
                        imports: [i1.HttpClientModule],
                        declarations: [],
                        exports: [i1.HttpClientModule],
                        providers: [
                            ExternalService,
                            i1.HttpClient,
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

    exports.AccountService = AccountService;
    exports.AuthService = AuthService;
    exports.AuthInterceptor = AuthInterceptor;
    exports.AuthExpiredInterceptor = AuthExpiredInterceptor;
    exports.LoginService = LoginService;
    exports.Principal = Principal;
    exports.DashboardService = DashboardService;
    exports.User = User;
    exports.UserService = UserService;
    exports.UserPosition = UserPosition;
    exports.UserPositionService = UserPositionService;
    exports.UserConfiguration = UserConfiguration;
    exports.UserConfigurationService = UserConfigurationService;
    exports.Territory = Territory;
    exports.TerritoryService = TerritoryService;
    exports.TerritoryType = TerritoryType;
    exports.TerritoryTypeService = TerritoryTypeService;
    exports.TerritoryGroupType = TerritoryGroupType;
    exports.TerritoryGroupTypeService = TerritoryGroupTypeService;
    exports.Role = Role;
    exports.RoleService = RoleService;
    exports.Connection = Connection;
    exports.ConnectionService = ConnectionService;
    exports.GEOADMIN_TREE_TASK_ID = GEOADMIN_TREE_TASK_ID;
    exports.Task = Task;
    exports.TaskService = TaskService;
    exports.TaskType = TaskType;
    exports.TaskTypeService = TaskTypeService;
    exports.TaskGroup = TaskGroup;
    exports.TaskGroupService = TaskGroupService;
    exports.TaskParameter = TaskParameter;
    exports.TaskParameterService = TaskParameterService;
    exports.TaskAvailability = TaskAvailability;
    exports.TaskAvailabilityService = TaskAvailabilityService;
    exports.TaskUI = TaskUI;
    exports.TaskUIService = TaskUIService;
    exports.TranslationService = TranslationService;
    exports.Translation = Translation;
    exports.Language = Language;
    exports.LanguageService = LanguageService;
    exports.Service = Service;
    exports.ServiceService = ServiceService;
    exports.ConfigurationParametersService = ConfigurationParametersService;
    exports.ConfigurationParameter = ConfigurationParameter;
    exports.ServiceParameter = ServiceParameter;
    exports.ServiceParameterService = ServiceParameterService;
    exports.Capabilitie = Capabilitie;
    exports.CapabilitiesService = CapabilitiesService;
    exports.Info = Info;
    exports.GetInfoService = GetInfoService;
    exports.Cartography = Cartography;
    exports.CartographyService = CartographyService;
    exports.CartographyGroup = CartographyGroup;
    exports.CartographyGroupService = CartographyGroupService;
    exports.CartographyAvailability = CartographyAvailability;
    exports.CartographyAvailabilityService = CartographyAvailabilityService;
    exports.CartographyFilter = CartographyFilter;
    exports.CartographyFilterService = CartographyFilterService;
    exports.CartographyParameter = CartographyParameter;
    exports.CartographyParameterService = CartographyParameterService;
    exports.CartographySpatialSelectionParameterService = CartographySpatialSelectionParameterService;
    exports.CartographyStyle = CartographyStyle;
    exports.CartographyStyleService = CartographyStyleService;
    exports.Background = Background;
    exports.BackgroundService = BackgroundService;
    exports.Tree = Tree;
    exports.TreeService = TreeService;
    exports.TreeNode = TreeNode;
    exports.TreeNodeService = TreeNodeService;
    exports.TERRITORIAL_APP_NAME = TERRITORIAL_APP_NAME;
    exports.Application = Application;
    exports.ApplicationService = ApplicationService;
    exports.ApplicationBackground = ApplicationBackground;
    exports.ApplicationBackgroundService = ApplicationBackgroundService;
    exports.ApplicationParameter = ApplicationParameter;
    exports.ApplicationParameterService = ApplicationParameterService;
    exports.CodeList = CodeList;
    exports.CodeListService = CodeListService;
    exports.Layer = Layer;
    exports.OptionalParameter = OptionalParameter;
    exports.LayerConfiguration = LayerConfiguration;
    exports.LayerGroup = LayerGroup;
    exports.MapOptionsConfiguration = MapOptionsConfiguration;
    exports.MapComponentStatus = MapComponentStatus;
    exports.MapConfigurationManagerService = MapConfigurationManagerService;
    exports.createTranslateLoader = createTranslateLoader;
    exports.SitmunFrontendCoreModule = SitmunFrontendCoreModule;
    exports.ExternalService = ExternalService;
    exports.RestService = RestService;
    exports.Resource = Resource;
    exports.ResourceArray = ResourceArray;
    exports.ResourceService = ResourceService;
    exports.ResourceHelper = ResourceHelper;
    exports.AngularHalModule = AngularHalModule;
    exports.ɵb = HasAnyAuthorityOnTerritoryDirective;
    exports.ɵa = HasAnyAuthorityDirective;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2l0bXVuLWZyb250ZW5kLWNvcmUudW1kLmpzLm1hcCIsInNvdXJjZXMiOltudWxsLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlLWFycmF5LnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZS1oZWxwZXIudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvdXNlci91c2VyLm1vZGVsLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvYW5ndWxhci1oYWwvc3JjL2xpYi9leHRlcm5hbC5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZS5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS9hY2NvdW50L2FjY291bnQuc2VydmljZS50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL2F1dGgvYXV0aC5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvYXV0aC9hdXRoLmludGVyY2VwdG9yLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvYXV0aC9wcmluY2lwYWwuc2VydmljZS50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL2F1dGgvYXV0aC1leHBpcmVkLmludGVyY2VwdG9yLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvYXV0aC9sb2dpbi5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvZGFzaGJvYXJkL2Rhc2hib2FyZC5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvdXNlci91c2VyLnNlcnZpY2UudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS91c2VyL3VzZXItcG9zaXRpb24ubW9kZWwudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS91c2VyL3VzZXItcG9zaXRpb24uc2VydmljZS50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL3VzZXIvdXNlci1jb25maWd1cmF0aW9uLm1vZGVsLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvdXNlci91c2VyLWNvbmZpZ3VyYXRpb24uc2VydmljZS50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL3RlcnJpdG9yeS90ZXJyaXRvcnkubW9kZWwudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS90ZXJyaXRvcnkvdGVycml0b3J5LnNlcnZpY2UudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS90ZXJyaXRvcnkvdGVycml0b3J5LXR5cGUubW9kZWwudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS90ZXJyaXRvcnkvdGVycml0b3J5LXR5cGUuc2VydmljZS50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL3RlcnJpdG9yeS90ZXJyaXRvcnktZ3JvdXAtdHlwZS5tb2RlbC50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL3RlcnJpdG9yeS90ZXJyaXRvcnktZ3JvdXAtdHlwZS5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvcm9sZS9yb2xlLm1vZGVsLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvcm9sZS9yb2xlLnNlcnZpY2UudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS9jb25uZWN0aW9uL2Nvbm5lY3Rpb24ubW9kZWwudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS9jb25uZWN0aW9uL2Nvbm5lY3Rpb24uc2VydmljZS50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL3Rhc2svdGFzay5tb2RlbC50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL3Rhc2svdGFzay5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvdGFzay90YXNrLXR5cGUubW9kZWwudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS90YXNrL3Rhc2stdHlwZS5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvdGFzay90YXNrLWdyb3VwLm1vZGVsLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvdGFzay90YXNrLWdyb3VwLnNlcnZpY2UudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS90YXNrL3Rhc2stcGFyYW1ldGVyLm1vZGVsLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvdGFzay90YXNrLXBhcmFtZXRlci5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvdGFzay90YXNrLWF2YWlsYWJpbGl0eS5tb2RlbC50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL3Rhc2svdGFzay1hdmFpbGFiaWxpdHkuc2VydmljZS50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL3Rhc2svdGFzay11aS5tb2RlbC50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL3Rhc2svdGFzay11aS5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvdHJhbnNsYXRpb24vdHJhbnNsYXRpb24ubW9kZWwudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS90cmFuc2xhdGlvbi90cmFuc2xhdGlvbi5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvdHJhbnNsYXRpb24vbGFuZ3VhZ2UubW9kZWwudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS90cmFuc2xhdGlvbi9sYW5ndWFnZS5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvc2VydmljZS9zZXJ2aWNlLm1vZGVsLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvc2VydmljZS9zZXJ2aWNlLnNlcnZpY2UudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS9jb25maWd1cmF0aW9uL2NvbmZpZ3VyYXRpb24tcGFyYW1ldGVycy5tb2RlbC50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL2NvbmZpZ3VyYXRpb24vY29uZmlndXJhdGlvbi1wYXJhbWV0ZXJzLnNlcnZpY2UudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS9zZXJ2aWNlL3NlcnZpY2UtcGFyYW1ldGVyLm1vZGVsLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvc2VydmljZS9zZXJ2aWNlLXBhcmFtZXRlci5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvY2FwYWJpbGl0aWVzL2NhcGFiaWxpdGllLm1vZGVsLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvY2FwYWJpbGl0aWVzL2NhcGFiaWxpdGllcy5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvZ2V0SW5mby9pbmZvLm1vZGVsLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvZ2V0SW5mby9nZXRJbmZvLnNlcnZpY2UudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS9jYXJ0b2dyYXBoeS9jYXJ0b2dyYXBoeS5tb2RlbC50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL2NhcnRvZ3JhcGh5L2NhcnRvZ3JhcGh5LnNlcnZpY2UudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS9jYXJ0b2dyYXBoeS9jYXJ0b2dyYXBoeS1ncm91cC5tb2RlbC50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL2NhcnRvZ3JhcGh5L2NhcnRvZ3JhcGh5LWdyb3VwLnNlcnZpY2UudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS9jYXJ0b2dyYXBoeS9jYXJ0b2dyYXBoeS1hdmFpbGFiaWxpdHkubW9kZWwudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS9jYXJ0b2dyYXBoeS9jYXJ0b2dyYXBoeS1hdmFpbGFiaWxpdHkuc2VydmljZS50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL2NhcnRvZ3JhcGh5L2NhcnRvZ3JhcGh5LWZpbHRlci5tb2RlbC50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL2NhcnRvZ3JhcGh5L2NhcnRvZ3JhcGh5LWZpbHRlci5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvY2FydG9ncmFwaHkvY2FydG9ncmFwaHktcGFyYW1ldGVyLm1vZGVsLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvY2FydG9ncmFwaHkvY2FydG9ncmFwaHktcGFyYW1ldGVyLnNlcnZpY2UudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS9jYXJ0b2dyYXBoeS9jYXJ0b2dyYXBoeS1zcGF0aWFsLXNlbGVjdGlvbi1wYXJhbWV0ZXIuc2VydmljZS50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL2NhcnRvZ3JhcGh5L2NhcnRvZ3JhcGh5LXN0eWxlLm1vZGVsLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvY2FydG9ncmFwaHkvY2FydG9ncmFwaHktc3R5bGUuc2VydmljZS50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL2NhcnRvZ3JhcGh5L2JhY2tncm91bmQubW9kZWwudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS9jYXJ0b2dyYXBoeS9iYWNrZ3JvdW5kLnNlcnZpY2UudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS90cmVlL3RyZWUubW9kZWwudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS90cmVlL3RyZWUuc2VydmljZS50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL3RyZWUvdHJlZS1ub2RlLm1vZGVsLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvdHJlZS90cmVlLW5vZGUuc2VydmljZS50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL2FwcGxpY2F0aW9uL2FwcGxpY2F0aW9uLm1vZGVsLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvYXBwbGljYXRpb24vYXBwbGljYXRpb24uc2VydmljZS50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL2FwcGxpY2F0aW9uL2FwcGxpY2F0aW9uLWJhY2tncm91bmQubW9kZWwudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS9hcHBsaWNhdGlvbi9hcHBsaWNhdGlvbi1iYWNrZ3JvdW5kLnNlcnZpY2UudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS9hcHBsaWNhdGlvbi9hcHBsaWNhdGlvbi1wYXJhbWV0ZXIubW9kZWwudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS9hcHBsaWNhdGlvbi9hcHBsaWNhdGlvbi1wYXJhbWV0ZXIuc2VydmljZS50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL2NvZGVsaXN0L2NvZGVsaXN0Lm1vZGVsLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvY29kZWxpc3QvY29kZWxpc3Quc2VydmljZS50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL21hcC9tYXAtY29uZmlndXJhdGlvbi1tYW5hZ2VyLnNlcnZpY2UudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS9hdXRoL2hhcy1hbnktYXV0aG9yaXR5LmRpcmVjdGl2ZS50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL2F1dGgvaGFzLWFueS1hdXRob3JpdHktb24tdGVycml0b3J5LmRpcmVjdGl2ZS50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL3NpdG11bi1mcm9udGVuZC1jb3JlLm1vZHVsZS50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL2FuZ3VsYXItaGFsL3NyYy9saWIvYW5ndWxhci1oYWwubW9kdWxlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qISAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5Db3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cclxuTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlXHJcbnRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlXHJcbkxpY2Vuc2UgYXQgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcblxyXG5USElTIENPREUgSVMgUFJPVklERUQgT04gQU4gKkFTIElTKiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZXHJcbktJTkQsIEVJVEhFUiBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBXSVRIT1VUIExJTUlUQVRJT04gQU5ZIElNUExJRURcclxuV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIFRJVExFLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSxcclxuTUVSQ0hBTlRBQkxJVFkgT1IgTk9OLUlORlJJTkdFTUVOVC5cclxuXHJcblNlZSB0aGUgQXBhY2hlIFZlcnNpb24gMi4wIExpY2Vuc2UgZm9yIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9uc1xyXG5hbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXHJcbi8qIGdsb2JhbCBSZWZsZWN0LCBQcm9taXNlICovXHJcblxyXG52YXIgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHRlbmRzKGQsIGIpIHtcclxuICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxufVxyXG5cclxuZXhwb3J0IHZhciBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gX19hc3NpZ24odCkge1xyXG4gICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcclxuICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpIHRbcF0gPSBzW3BdO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3Jlc3QocywgZSkge1xyXG4gICAgdmFyIHQgPSB7fTtcclxuICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSAmJiBlLmluZGV4T2YocCkgPCAwKVxyXG4gICAgICAgIHRbcF0gPSBzW3BdO1xyXG4gICAgaWYgKHMgIT0gbnVsbCAmJiB0eXBlb2YgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyA9PT0gXCJmdW5jdGlvblwiKVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBwID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhzKTsgaSA8IHAubGVuZ3RoOyBpKyspIGlmIChlLmluZGV4T2YocFtpXSkgPCAwKVxyXG4gICAgICAgICAgICB0W3BbaV1dID0gc1twW2ldXTtcclxuICAgIHJldHVybiB0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xyXG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XHJcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xyXG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcGFyYW0ocGFyYW1JbmRleCwgZGVjb3JhdG9yKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwga2V5KSB7IGRlY29yYXRvcih0YXJnZXQsIGtleSwgcGFyYW1JbmRleCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpIHtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5tZXRhZGF0YSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gUmVmbGVjdC5tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0ZXIodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IudGhyb3codmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZShyZXN1bHQudmFsdWUpOyB9KS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XHJcbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2dlbmVyYXRvcih0aGlzQXJnLCBib2R5KSB7XHJcbiAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnO1xyXG4gICAgcmV0dXJuIGcgPSB7IG5leHQ6IHZlcmIoMCksIFwidGhyb3dcIjogdmVyYigxKSwgXCJyZXR1cm5cIjogdmVyYigyKSB9LCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcclxuICAgICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XHJcbiAgICAgICAgd2hpbGUgKF8pIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IHlbb3BbMF0gJiAyID8gXCJyZXR1cm5cIiA6IG9wWzBdID8gXCJ0aHJvd1wiIDogXCJuZXh0XCJdKSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcclxuICAgICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFswLCB0LnZhbHVlXTtcclxuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xyXG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XHJcbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4cG9ydFN0YXIobSwgZXhwb3J0cykge1xyXG4gICAgZm9yICh2YXIgcCBpbiBtKSBpZiAoIWV4cG9ydHMuaGFzT3duUHJvcGVydHkocCkpIGV4cG9ydHNbcF0gPSBtW3BdO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX192YWx1ZXMobykge1xyXG4gICAgdmFyIG0gPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdLCBpID0gMDtcclxuICAgIGlmIChtKSByZXR1cm4gbS5jYWxsKG8pO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBuZXh0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmIChvICYmIGkgPj0gby5sZW5ndGgpIG8gPSB2b2lkIDA7XHJcbiAgICAgICAgICAgIHJldHVybiB7IHZhbHVlOiBvICYmIG9baSsrXSwgZG9uZTogIW8gfTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZWFkKG8sIG4pIHtcclxuICAgIHZhciBtID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXTtcclxuICAgIGlmICghbSkgcmV0dXJuIG87XHJcbiAgICB2YXIgaSA9IG0uY2FsbChvKSwgciwgYXIgPSBbXSwgZTtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgd2hpbGUgKChuID09PSB2b2lkIDAgfHwgbi0tID4gMCkgJiYgIShyID0gaS5uZXh0KCkpLmRvbmUpIGFyLnB1c2goci52YWx1ZSk7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZXJyb3IpIHsgZSA9IHsgZXJyb3I6IGVycm9yIH07IH1cclxuICAgIGZpbmFsbHkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChyICYmICFyLmRvbmUgJiYgKG0gPSBpW1wicmV0dXJuXCJdKSkgbS5jYWxsKGkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmaW5hbGx5IHsgaWYgKGUpIHRocm93IGUuZXJyb3I7IH1cclxuICAgIH1cclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkKCkge1xyXG4gICAgZm9yICh2YXIgYXIgPSBbXSwgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgYXIgPSBhci5jb25jYXQoX19yZWFkKGFyZ3VtZW50c1tpXSkpO1xyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdCh2KSB7XHJcbiAgICByZXR1cm4gdGhpcyBpbnN0YW5jZW9mIF9fYXdhaXQgPyAodGhpcy52ID0gdiwgdGhpcykgOiBuZXcgX19hd2FpdCh2KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNHZW5lcmF0b3IodGhpc0FyZywgX2FyZ3VtZW50cywgZ2VuZXJhdG9yKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIGcgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSksIGksIHEgPSBbXTtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyBpZiAoZ1tuXSkgaVtuXSA9IGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAoYSwgYikgeyBxLnB1c2goW24sIHYsIGEsIGJdKSA+IDEgfHwgcmVzdW1lKG4sIHYpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gcmVzdW1lKG4sIHYpIHsgdHJ5IHsgc3RlcChnW25dKHYpKTsgfSBjYXRjaCAoZSkgeyBzZXR0bGUocVswXVszXSwgZSk7IH0gfVxyXG4gICAgZnVuY3Rpb24gc3RlcChyKSB7IHIudmFsdWUgaW5zdGFuY2VvZiBfX2F3YWl0ID8gUHJvbWlzZS5yZXNvbHZlKHIudmFsdWUudikudGhlbihmdWxmaWxsLCByZWplY3QpIDogc2V0dGxlKHFbMF1bMl0sIHIpOyAgfVxyXG4gICAgZnVuY3Rpb24gZnVsZmlsbCh2YWx1ZSkgeyByZXN1bWUoXCJuZXh0XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gcmVqZWN0KHZhbHVlKSB7IHJlc3VtZShcInRocm93XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKGYsIHYpIHsgaWYgKGYodiksIHEuc2hpZnQoKSwgcS5sZW5ndGgpIHJlc3VtZShxWzBdWzBdLCBxWzBdWzFdKTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0RlbGVnYXRvcihvKSB7XHJcbiAgICB2YXIgaSwgcDtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiwgZnVuY3Rpb24gKGUpIHsgdGhyb3cgZTsgfSksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4sIGYpIHsgaWYgKG9bbl0pIGlbbl0gPSBmdW5jdGlvbiAodikgeyByZXR1cm4gKHAgPSAhcCkgPyB7IHZhbHVlOiBfX2F3YWl0KG9bbl0odikpLCBkb25lOiBuID09PSBcInJldHVyblwiIH0gOiBmID8gZih2KSA6IHY7IH07IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNWYWx1ZXMobykge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBtID0gb1tTeW1ib2wuYXN5bmNJdGVyYXRvcl07XHJcbiAgICByZXR1cm4gbSA/IG0uY2FsbChvKSA6IHR5cGVvZiBfX3ZhbHVlcyA9PT0gXCJmdW5jdGlvblwiID8gX192YWx1ZXMobykgOiBvW1N5bWJvbC5pdGVyYXRvcl0oKTtcclxufSIsIlxyXG5pbXBvcnQge3Rocm93RXJyb3IgYXMgb2JzZXJ2YWJsZVRocm93RXJyb3J9IGZyb20gJ3J4anMnO1xyXG5cclxuaW1wb3J0IHtjYXRjaEVycm9yLCBtYXB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuaW1wb3J0IHtTb3J0fSBmcm9tICcuL3NvcnQnO1xyXG5pbXBvcnQge0FycmF5SW50ZXJmYWNlfSBmcm9tICcuL2FycmF5LWludGVyZmFjZSc7XHJcbmltcG9ydCB7UmVzb3VyY2VIZWxwZXJ9IGZyb20gJy4vcmVzb3VyY2UtaGVscGVyJztcclxuaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi9yZXNvdXJjZSc7XHJcbmltcG9ydCAqIGFzIHVybCBmcm9tICd1cmwnO1xyXG5pbXBvcnQge09ic2VydmFibGV9IGZyb20gJ3J4anMnO1xyXG5cclxuLyoqIFJFU1QgYXJyYXkgb2YgcmVzb3VyY2UgaW1wbGVtZW50YXRpb24gKi9cclxuZXhwb3J0IGNsYXNzIFJlc291cmNlQXJyYXk8VCBleHRlbmRzIFJlc291cmNlPiBpbXBsZW1lbnRzIEFycmF5SW50ZXJmYWNlPFQ+IHtcclxuICAgIC8qKiBzb3J0aW5nIGluZm8gKi9cclxuICAgIHB1YmxpYyBzb3J0SW5mbzogU29ydFtdO1xyXG4gICAgLyoqIHByb3h5IHVybCAqL1xyXG4gICAgcHVibGljIHByb3h5VXJsOiBzdHJpbmc7XHJcbiAgICAvKiogcm9vdCB1cmwgKi9cclxuICAgIHB1YmxpYyByb290VXJsOiBzdHJpbmc7XHJcblxyXG4gICAgLyoqIHNlbGYgdXJsICovXHJcbiAgICBwdWJsaWMgc2VsZl91cmk6IHN0cmluZztcclxuICAgIC8qKiBuZXh0IHJlc291cmNlIHVybCAqL1xyXG4gICAgcHVibGljIG5leHRfdXJpOiBzdHJpbmc7XHJcbiAgICAvKiogcHJldmlvdXMgcmVzb3VyY2UgdXJsICovXHJcbiAgICBwdWJsaWMgcHJldl91cmk6IHN0cmluZztcclxuICAgIC8qKiBmaXJzdCByZXNvdXJjZSB1cmwgKi9cclxuICAgIHB1YmxpYyBmaXJzdF91cmk6IHN0cmluZztcclxuICAgIC8qKiBsYXN0IHJlc291cmNlIHVybCAqL1xyXG4gICAgcHVibGljIGxhc3RfdXJpOiBzdHJpbmc7XHJcblxyXG4gICAgLyoqIGVtYmVkZGVkIGFycmF5IGxpc3QgKi9cclxuICAgIHB1YmxpYyBfZW1iZWRkZWQ7XHJcblxyXG4gICAgLyoqIHRvdGFsIG51bWJlciBvZiBlbGVtZW50cyBpbiB0aGlzIGFycmF5ICovXHJcbiAgICBwdWJsaWMgdG90YWxFbGVtZW50cyA9IDA7XHJcbiAgICAvKiogdG90YWwgbnVtYmVyIG9mIHBhZ2VzIGluIHRoZSByZXNwb25zZSAqL1xyXG4gICAgcHVibGljIHRvdGFsUGFnZXMgPSAxO1xyXG4gICAgXHJcbiAgICAvKiogcGFnZSBudW1iZXIgaW4gdGhlIHJlc3BvbnNlICovXHJcbiAgICBwdWJsaWMgcGFnZU51bWJlciA9IDE7XHJcbiAgICBcclxuICAgIC8qKiBwYWdlIHNpemUgKi9cclxuICAgIHB1YmxpYyBwYWdlU2l6ZTogbnVtYmVyO1xyXG5cclxuICAgIC8qKiBhcnJheSBjb21wb25lbnRzICovXHJcbiAgICBwdWJsaWMgcmVzdWx0OiBUW10gPSBbXTtcclxuXHJcbiAgICAvKiogcHVzaCBhIG5ldyByZXNvdXJjZSB0byB0aGUgYXJyYXkgKi9cclxuICAgIHB1c2ggPSAoZWw6IFQpID0+IHtcclxuICAgICAgICB0aGlzLnJlc3VsdC5wdXNoKGVsKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqIGxlbmd0aCBvZiB0aGUgYXJyYXkgKi9cclxuICAgIGxlbmd0aCA9ICgpOiBudW1iZXIgPT4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJlc3VsdC5sZW5ndGg7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKiBsb2FkIGFycmF5IGRhdGEgZnJvbSBSRVNUIHJlcXVlc3QgKi9cclxuICAgIHByaXZhdGUgaW5pdCA9ICh0eXBlOiB7IG5ldygpOiBUIH0sIHJlc3BvbnNlOiBhbnksIHNvcnRJbmZvOiBTb3J0W10pOiBSZXNvdXJjZUFycmF5PFQ+ID0+IHtcclxuICAgICAgICBjb25zdCByZXN1bHQ6IFJlc291cmNlQXJyYXk8VD4gPSBSZXNvdXJjZUhlbHBlci5jcmVhdGVFbXB0eVJlc3VsdDxUPih0aGlzLl9lbWJlZGRlZCk7XHJcbiAgICAgICAgcmVzdWx0LnNvcnRJbmZvID0gc29ydEluZm87XHJcbiAgICAgICAgUmVzb3VyY2VIZWxwZXIuaW5zdGFudGlhdGVSZXNvdXJjZUNvbGxlY3Rpb24odHlwZSwgcmVzcG9uc2UsIHJlc3VsdCk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH07XHJcblxyXG4gICAgLyoqIExvYWQgbmV4dCBwYWdlICovXHJcbiAgICBuZXh0ID0gKHR5cGU6IHsgbmV3KCk6IFQgfSk6IE9ic2VydmFibGU8UmVzb3VyY2VBcnJheTxUPj4gPT4ge1xyXG4gICAgICAgIGlmICh0aGlzLm5leHRfdXJpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkuZ2V0KFJlc291cmNlSGVscGVyLmdldFByb3h5KHRoaXMubmV4dF91cmkpLCB7aGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVyc30pLnBpcGUoXHJcbiAgICAgICAgICAgICAgICBtYXAocmVzcG9uc2UgPT4gdGhpcy5pbml0KHR5cGUsIHJlc3BvbnNlLCB0aGlzLnNvcnRJbmZvKSksXHJcbiAgICAgICAgICAgICAgICBjYXRjaEVycm9yKGVycm9yID0+IG9ic2VydmFibGVUaHJvd0Vycm9yKGVycm9yKSksKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG9ic2VydmFibGVUaHJvd0Vycm9yKCdubyBuZXh0IGRlZmluZWQnKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqIExvYWQgcHJldmlvdXMgcGFnZSAqL1xyXG4gICAgcHJldiA9ICh0eXBlOiB7IG5ldygpOiBUIH0pOiBPYnNlcnZhYmxlPFJlc291cmNlQXJyYXk8VD4+ID0+IHtcclxuICAgICAgICBpZiAodGhpcy5wcmV2X3VyaSkge1xyXG4gICAgICAgICAgICByZXR1cm4gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLmdldChSZXNvdXJjZUhlbHBlci5nZXRQcm94eSh0aGlzLnByZXZfdXJpKSwge2hlYWRlcnM6IFJlc291cmNlSGVscGVyLmhlYWRlcnN9KS5waXBlKFxyXG4gICAgICAgICAgICAgICAgbWFwKHJlc3BvbnNlID0+IHRoaXMuaW5pdCh0eXBlLCByZXNwb25zZSwgdGhpcy5zb3J0SW5mbykpLFxyXG4gICAgICAgICAgICAgICAgY2F0Y2hFcnJvcihlcnJvciA9PiBvYnNlcnZhYmxlVGhyb3dFcnJvcihlcnJvcikpLCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBvYnNlcnZhYmxlVGhyb3dFcnJvcignbm8gcHJldiBkZWZpbmVkJyk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKiBMb2FkIGZpcnN0IHBhZ2UgKi9cclxuICAgIGZpcnN0ID0gKHR5cGU6IHsgbmV3KCk6IFQgfSk6IE9ic2VydmFibGU8UmVzb3VyY2VBcnJheTxUPj4gPT4ge1xyXG4gICAgICAgIGlmICh0aGlzLmZpcnN0X3VyaSkge1xyXG4gICAgICAgICAgICByZXR1cm4gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLmdldChSZXNvdXJjZUhlbHBlci5nZXRQcm94eSh0aGlzLmZpcnN0X3VyaSksIHtoZWFkZXJzOiBSZXNvdXJjZUhlbHBlci5oZWFkZXJzfSkucGlwZShcclxuICAgICAgICAgICAgICAgIG1hcChyZXNwb25zZSA9PiB0aGlzLmluaXQodHlwZSwgcmVzcG9uc2UsIHRoaXMuc29ydEluZm8pKSxcclxuICAgICAgICAgICAgICAgIGNhdGNoRXJyb3IoZXJyb3IgPT4gb2JzZXJ2YWJsZVRocm93RXJyb3IoZXJyb3IpKSwpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZVRocm93RXJyb3IoJ25vIGZpcnN0IGRlZmluZWQnKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqIExvYWQgbGFzdCBwYWdlICovXHJcbiAgICBsYXN0ID0gKHR5cGU6IHsgbmV3KCk6IFQgfSk6IE9ic2VydmFibGU8UmVzb3VyY2VBcnJheTxUPj4gPT4ge1xyXG4gICAgICAgIGlmICh0aGlzLmxhc3RfdXJpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkuZ2V0KFJlc291cmNlSGVscGVyLmdldFByb3h5KHRoaXMubGFzdF91cmkpLCB7aGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVyc30pLnBpcGUoXHJcbiAgICAgICAgICAgICAgICBtYXAocmVzcG9uc2UgPT4gdGhpcy5pbml0KHR5cGUsIHJlc3BvbnNlLCB0aGlzLnNvcnRJbmZvKSksXHJcbiAgICAgICAgICAgICAgICBjYXRjaEVycm9yKGVycm9yID0+IG9ic2VydmFibGVUaHJvd0Vycm9yKGVycm9yKSksKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG9ic2VydmFibGVUaHJvd0Vycm9yKCdubyBsYXN0IGRlZmluZWQnKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqIExvYWQgcGFnZSB3aXRoIGdpdmVuIHBhZ2VOdW1iZXIqL1xyXG4gICAgcGFnZSA9ICh0eXBlOiB7IG5ldygpOiBUIH0sIHBhZ2VOdW1iZXI6IG51bWJlcik6IE9ic2VydmFibGU8UmVzb3VyY2VBcnJheTxUPj4gPT4ge1xyXG4gICAgICAgIHRoaXMuc2VsZl91cmkgPSB0aGlzLnNlbGZfdXJpLnJlcGxhY2UoJ3s/cGFnZSxzaXplLHNvcnR9JywgJycpO1xyXG4gICAgICAgIHRoaXMuc2VsZl91cmkgPSB0aGlzLnNlbGZfdXJpLnJlcGxhY2UoJ3smc29ydH0nLCAnJyk7XHJcbiAgICAgICAgbGV0IHVybFBhcnNlZCA9IHVybC5wYXJzZShSZXNvdXJjZUhlbHBlci5nZXRQcm94eSh0aGlzLnNlbGZfdXJpKSk7XHJcbiAgICAgICAgbGV0IHF1ZXJ5OiBzdHJpbmcgPSBSZXNvdXJjZUFycmF5LnJlcGxhY2VPckFkZCh1cmxQYXJzZWQucXVlcnksICdzaXplJywgdGhpcy5wYWdlU2l6ZS50b1N0cmluZygpKTtcclxuICAgICAgICBxdWVyeSA9IFJlc291cmNlQXJyYXkucmVwbGFjZU9yQWRkKHF1ZXJ5LCAncGFnZScsIHBhZ2VOdW1iZXIudG9TdHJpbmcoKSk7XHJcblxyXG5cclxuICAgICAgICBsZXQgdXJpID0gdXJsUGFyc2VkLnF1ZXJ5ID9cclxuICAgICAgICAgICAgUmVzb3VyY2VIZWxwZXIuZ2V0UHJveHkodGhpcy5zZWxmX3VyaSkucmVwbGFjZSh1cmxQYXJzZWQucXVlcnksIHF1ZXJ5KSA6IFJlc291cmNlSGVscGVyLmdldFByb3h5KHRoaXMuc2VsZl91cmkpLmNvbmNhdChxdWVyeSk7XHJcbiAgICAgICAgdXJpID0gdGhpcy5hZGRTb3J0SW5mbyh1cmkpO1xyXG4gICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkuZ2V0KHVyaSwge2hlYWRlcnM6IFJlc291cmNlSGVscGVyLmhlYWRlcnN9KS5waXBlKFxyXG4gICAgICAgICAgICBtYXAocmVzcG9uc2UgPT4gdGhpcy5pbml0KHR5cGUsIHJlc3BvbnNlLCB0aGlzLnNvcnRJbmZvKSksXHJcbiAgICAgICAgICAgIGNhdGNoRXJyb3IoZXJyb3IgPT4gb2JzZXJ2YWJsZVRocm93RXJyb3IoZXJyb3IpKSwpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKiogU29ydCBjb2xsZWN0aW9uIGJhc2VkIG9uIGdpdmVuIHNvcnQgYXR0cmlidXRlICovXHJcbiAgICBzb3J0RWxlbWVudHMgPSAodHlwZTogeyBuZXcoKTogVCB9LCAuLi5zb3J0OiBTb3J0W10pOiBPYnNlcnZhYmxlPFJlc291cmNlQXJyYXk8VD4+ID0+IHtcclxuICAgICAgICB0aGlzLnNlbGZfdXJpID0gdGhpcy5zZWxmX3VyaS5yZXBsYWNlKCd7P3BhZ2Usc2l6ZSxzb3J0fScsICcnKTtcclxuICAgICAgICB0aGlzLnNlbGZfdXJpID0gdGhpcy5zZWxmX3VyaS5yZXBsYWNlKCd7JnNvcnR9JywgJycpO1xyXG4gICAgICAgIGxldCB1cmkgPSBSZXNvdXJjZUhlbHBlci5nZXRQcm94eSh0aGlzLnNlbGZfdXJpKS5jb25jYXQoJz8nLCAnc2l6ZT0nLCB0aGlzLnBhZ2VTaXplLnRvU3RyaW5nKCksICcmcGFnZT0nLCB0aGlzLnBhZ2VOdW1iZXIudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgdXJpID0gdGhpcy5hZGRTb3J0SW5mbyh1cmkpO1xyXG4gICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkuZ2V0KHVyaSwge2hlYWRlcnM6IFJlc291cmNlSGVscGVyLmhlYWRlcnN9KS5waXBlKFxyXG4gICAgICAgICAgICBtYXAocmVzcG9uc2UgPT4gdGhpcy5pbml0KHR5cGUsIHJlc3BvbnNlLCBzb3J0KSksXHJcbiAgICAgICAgICAgIGNhdGNoRXJyb3IoZXJyb3IgPT4gb2JzZXJ2YWJsZVRocm93RXJyb3IoZXJyb3IpKSwpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKiogTG9hZCBwYWdlIHdpdGggZ2l2ZW4gc2l6ZSAqL1xyXG4gICAgc2l6ZSA9ICh0eXBlOiB7IG5ldygpOiBUIH0sIHNpemU6IG51bWJlcik6IE9ic2VydmFibGU8UmVzb3VyY2VBcnJheTxUPj4gPT4ge1xyXG4gICAgICAgIGxldCB1cmkgPSBSZXNvdXJjZUhlbHBlci5nZXRQcm94eSh0aGlzLnNlbGZfdXJpKS5jb25jYXQoJz8nLCAnc2l6ZT0nLCBzaXplLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgIHVyaSA9IHRoaXMuYWRkU29ydEluZm8odXJpKTtcclxuICAgICAgICByZXR1cm4gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLmdldCh1cmksIHtoZWFkZXJzOiBSZXNvdXJjZUhlbHBlci5oZWFkZXJzfSkucGlwZShcclxuICAgICAgICAgICAgbWFwKHJlc3BvbnNlID0+IHRoaXMuaW5pdCh0eXBlLCByZXNwb25zZSwgdGhpcy5zb3J0SW5mbykpLFxyXG4gICAgICAgICAgICBjYXRjaEVycm9yKGVycm9yID0+IG9ic2VydmFibGVUaHJvd0Vycm9yKGVycm9yKSksKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqIEFkZCBzb3J0IGluZm8gdG8gZ2l2ZW4gVVJJICovXHJcbiAgICBwcml2YXRlIGFkZFNvcnRJbmZvKHVyaTogc3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuc29ydEluZm8pIHtcclxuICAgICAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIHRoaXMuc29ydEluZm8pIHtcclxuICAgICAgICAgICAgICAgIHVyaSA9IHVyaS5jb25jYXQoJyZzb3J0PScsIGl0ZW0ucGF0aCwgJywnLCBpdGVtLm9yZGVyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdXJpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBBZGQgcmVwbGFjZSBvciBhZGQgcGFyYW0gdmFsdWUgdG8gcXVlcnkgc3RyaW5nICovXHJcbiAgICBwcml2YXRlIHN0YXRpYyByZXBsYWNlT3JBZGQocXVlcnk6IHN0cmluZywgZmllbGQ6IHN0cmluZywgdmFsdWU6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgaWYgKHF1ZXJ5KSB7XHJcbiAgICAgICAgICAgIGxldCBpZHg6IG51bWJlciA9IHF1ZXJ5LmluZGV4T2YoZmllbGQpO1xyXG4gICAgICAgICAgICBsZXQgaWR4TmV4dEFtcDogbnVtYmVyID0gcXVlcnkuaW5kZXhPZignJicsIGlkeCkgPT0gLTEgPyBxdWVyeS5pbmRleE9mKCcvJywgaWR4KSA6IHF1ZXJ5LmluZGV4T2YoJyYnLCBpZHgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGlkeCAhPSAtMSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHNlYWNoVmFsdWUgPSBxdWVyeS5zdWJzdHJpbmcoaWR4LCBpZHhOZXh0QW1wKTtcclxuICAgICAgICAgICAgICAgIHF1ZXJ5ID0gcXVlcnkucmVwbGFjZShzZWFjaFZhbHVlLCBmaWVsZCArICc9JyArIHZhbHVlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHF1ZXJ5ID0gcXVlcnkuY29uY2F0KFwiJlwiICsgZmllbGQgKyAnPScgKyB2YWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBxdWVyeSA9IFwiP1wiICsgZmllbGQgKyAnPScgKyB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHF1ZXJ5O1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7SHR0cENsaWVudCwgSHR0cEhlYWRlcnMsIEh0dHBQYXJhbXN9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi9yZXNvdXJjZSc7XHJcbmltcG9ydCB7UmVzb3VyY2VBcnJheX0gZnJvbSAnLi9yZXNvdXJjZS1hcnJheSc7XHJcbmltcG9ydCB7SGFsT3B0aW9uc30gZnJvbSAnLi9yZXN0LnNlcnZpY2UnO1xyXG5pbXBvcnQge1N1YlR5cGVCdWlsZGVyfSBmcm9tICcuL3N1YnR5cGUtYnVpbGRlcic7XHJcbmltcG9ydCB7aXNOdWxsT3JVbmRlZmluZWQsIGlzUHJpbWl0aXZlfSBmcm9tICd1dGlsJztcclxuaW1wb3J0ICogYXMgdXJsIGZyb20gJ3VybCc7XHJcblxyXG4vKiogUkVTVCBBUEkgYWNjZXNzIGhlbHBlciAqL1xyXG5leHBvcnQgY2xhc3MgUmVzb3VyY2VIZWxwZXIge1xyXG5cclxuICAgIC8qKiBIdHRwSGVhZGVycyAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBoZWFkZXJzOiBIdHRwSGVhZGVycyA9IG5ldyBIdHRwSGVhZGVycygpO1xyXG4gICAgLyoqIFByb3h5IFVSTCAqL1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgcHJveHlfdXJpOiBzdHJpbmcgPSBudWxsO1xyXG4gICAgLyoqIFJvb3QgVVJMICovXHJcbiAgICBwcml2YXRlIHN0YXRpYyByb290X3VyaTogc3RyaW5nID0gbnVsbDtcclxuICAgIC8qKiBIdHRwQ2xpZW50ICovXHJcbiAgICBwcml2YXRlIHN0YXRpYyBodHRwOiBIdHRwQ2xpZW50ID0gbnVsbDtcclxuXHJcbiAgICAvKiogZ2V0IHJlcXVlc3QgaGVhZGVycyAqL1xyXG4gICAgLypwdWJsaWMgc3RhdGljIGdldCBoZWFkZXJzKCk6IEh0dHBIZWFkZXJzIHtcclxuICAgICAgICBpZiAoaXNOdWxsT3JVbmRlZmluZWQodGhpcy5faGVhZGVycykpXHJcbiAgICAgICAgICBSZXNvdXJjZUhlbHBlci5faGVhZGVycyA9IG5ldyBIdHRwSGVhZGVycygpO1xyXG4gICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5faGVhZGVycztcclxuICAgIH0qL1xyXG5cclxuICAgIC8qKiBzZXQgcmVxdWVzdCBoZWFkZXJzICovXHJcbiAgICAvKnB1YmxpYyBzdGF0aWMgc2V0IGhlYWRlcnMoaGVhZGVyczogSHR0cEhlYWRlcnMpIHtcclxuICAgICAgUmVzb3VyY2VIZWxwZXIuX2hlYWRlcnMgPSBoZWFkZXJzO1xyXG4gICAgfSovXHJcblxyXG4gICAgLyoqIGdldCByZXF1ZXN0IG9wdGlvbiBwYXJhbXMgKi9cclxuICAgIHN0YXRpYyBvcHRpb25QYXJhbXMocGFyYW1zOiBIdHRwUGFyYW1zLCBvcHRpb25zPzogSGFsT3B0aW9ucyk6IEh0dHBQYXJhbXMge1xyXG4gICAgICAgIGlmIChvcHRpb25zKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5wYXJhbXMpIHtcclxuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgcGFyYW0gb2Ygb3B0aW9ucy5wYXJhbXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBwYXJhbXMgPSBwYXJhbXMuYXBwZW5kKHBhcmFtLmtleSwgcGFyYW0udmFsdWUudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChvcHRpb25zLnNpemUpIHtcclxuICAgICAgICAgICAgICAgIHBhcmFtcyA9IHBhcmFtcy5hcHBlbmQoJ3NpemUnLCBvcHRpb25zLnNpemUudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChvcHRpb25zLnNvcnQpIHtcclxuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgcyBvZiBvcHRpb25zLnNvcnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgc29ydFN0cmluZyA9ICcnO1xyXG4gICAgICAgICAgICAgICAgICAgIHNvcnRTdHJpbmcgPSBzLnBhdGggPyBzb3J0U3RyaW5nLmNvbmNhdChzLnBhdGgpIDogc29ydFN0cmluZztcclxuICAgICAgICAgICAgICAgICAgICBzb3J0U3RyaW5nID0gcy5vcmRlciA/IHNvcnRTdHJpbmcuY29uY2F0KCcsJykuY29uY2F0KHMub3JkZXIpIDogc29ydFN0cmluZztcclxuICAgICAgICAgICAgICAgICAgICBwYXJhbXMgPSBwYXJhbXMuYXBwZW5kKCdzb3J0Jywgc29ydFN0cmluZyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBwYXJhbXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHJlc29sdmUgcmVzb3VyY2UgcmVsYXRpb25zICovXHJcbiAgICBzdGF0aWMgcmVzb2x2ZVJlbGF0aW9ucyhyZXNvdXJjZTogUmVzb3VyY2UpOiBPYmplY3Qge1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdDogYW55ID0ge307XHJcbiAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gcmVzb3VyY2UpIHtcclxuICAgICAgICAgICAgaWYgKCFpc051bGxPclVuZGVmaW5lZChyZXNvdXJjZVtrZXldKSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKFJlc291cmNlSGVscGVyLmNsYXNzTmFtZShyZXNvdXJjZVtrZXldKVxyXG4gICAgICAgICAgICAgICAgICAgIC5maW5kKChjbGFzc05hbWU6IHN0cmluZykgPT4gY2xhc3NOYW1lID09ICdSZXNvdXJjZScpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc291cmNlW2tleV1bJ19saW5rcyddKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRba2V5XSA9IHJlc291cmNlW2tleV1bJ19saW5rcyddWydzZWxmJ11bJ2hyZWYnXTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShyZXNvdXJjZVtrZXldKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBhcnJheTogYW55W10gPSByZXNvdXJjZVtrZXldO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhcnJheSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRba2V5XSA9IG5ldyBBcnJheSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhcnJheS5mb3JFYWNoKChlbGVtZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNQcmltaXRpdmUoZWxlbWVudCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRba2V5XS5wdXNoKGVsZW1lbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0W2tleV0ucHVzaCh0aGlzLnJlc29sdmVSZWxhdGlvbnMoZWxlbWVudCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdFtrZXldID0gcmVzb3VyY2Vba2V5XTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0IGFzIE9iamVjdDtcclxuICAgIH1cclxuXHJcbiAgICAvKiogY3JlYXRlIGFuIGVtcHR5IHJlc291cmNlIGZyb20gZW1iZWRkZWQgZGF0YSovXHJcbiAgICBzdGF0aWMgY3JlYXRlRW1wdHlSZXN1bHQ8VCBleHRlbmRzIFJlc291cmNlPihfZW1iZWRkZWQ6IHN0cmluZyk6IFJlc291cmNlQXJyYXk8VD4ge1xyXG4gICAgICAgIGxldCByZXNvdXJjZUFycmF5OiBSZXNvdXJjZUFycmF5PFQ+ID0gbmV3IFJlc291cmNlQXJyYXk8VD4oKTtcclxuICAgICAgICByZXNvdXJjZUFycmF5Ll9lbWJlZGRlZCA9IF9lbWJlZGRlZDtcclxuICAgICAgICByZXR1cm4gcmVzb3VyY2VBcnJheTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHJlc291cmNlIGNsYXNzIG5hbWUqL1xyXG4gICAgc3RhdGljIGdldENsYXNzTmFtZShvYmo6IGFueSk6IHN0cmluZyB7XHJcbiAgICAgICAgdmFyIGZ1bmNOYW1lUmVnZXggPSAvZnVuY3Rpb24gKC4rPylcXCgvO1xyXG4gICAgICAgIHZhciByZXN1bHRzID0gKGZ1bmNOYW1lUmVnZXgpLmV4ZWMob2JqLmNvbnN0cnVjdG9yLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgIHJldHVybiAocmVzdWx0cyAmJiByZXN1bHRzLmxlbmd0aCA+IDEpID8gcmVzdWx0c1sxXSA6ICcnO1xyXG4gICAgfVxyXG5cclxuICAgIFxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBjbGFzcyBuYW1lIGZyb20gYSBwcm90b3R5cGUgb2JqZWN0Ki9cclxuICAgIHN0YXRpYyBjbGFzc05hbWUob2JqUHJvdG86IGFueSk6IHN0cmluZ1tdIHtcclxuICAgICAgICBsZXQgY2xhc3NOYW1lcyA9IFtdO1xyXG4gICAgICAgIGxldCBvYmogPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqUHJvdG8pO1xyXG4gICAgICAgIGxldCBjbGFzc05hbWU6IHN0cmluZztcclxuXHJcbiAgICAgICAgd2hpbGUgKChjbGFzc05hbWUgPSBSZXNvdXJjZUhlbHBlci5nZXRDbGFzc05hbWUob2JqKSkgIT09ICdPYmplY3QnKSB7XHJcbiAgICAgICAgICAgIGNsYXNzTmFtZXMucHVzaChjbGFzc05hbWUpO1xyXG4gICAgICAgICAgICBvYmogPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBjbGFzc05hbWVzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBpbnN0YW50aWF0ZSBhIFJlc291cmNlQ29sbGVjdGlvbiBmcm9tIHJlc3BvbnNlIGVtYmVkZGVkIGRhdGEqL1xyXG4gICAgc3RhdGljIGluc3RhbnRpYXRlUmVzb3VyY2VDb2xsZWN0aW9uPFQgZXh0ZW5kcyBSZXNvdXJjZT4odHlwZTogeyBuZXcoKTogVCB9LCBwYXlsb2FkOiBhbnksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQ6IFJlc291cmNlQXJyYXk8VD4sIGJ1aWxkZXI/OiBTdWJUeXBlQnVpbGRlcixlbWJlZGRlZE5hbWU/OlN0cmluZyk6IFJlc291cmNlQXJyYXk8VD4ge1xyXG4gICAgICAgIGZvciAoY29uc3QgZW1iZWRkZWRDbGFzc05hbWUgb2YgT2JqZWN0LmtleXMocGF5bG9hZFtyZXN1bHQuX2VtYmVkZGVkXSkpIHtcclxuICAgICAgICAgICAgaWYoIWVtYmVkZGVkTmFtZSB8fCAoZW1iZWRkZWROYW1lICYmIGVtYmVkZGVkQ2xhc3NOYW1lPT1lbWJlZGRlZE5hbWUpKXtcclxuICAgICAgICAgICAgICAgIGxldCBlbWJlZGRlZDogYW55ID0gcGF5bG9hZFtyZXN1bHQuX2VtYmVkZGVkXTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW1zID0gZW1iZWRkZWRbZW1iZWRkZWRDbGFzc05hbWVdO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaXRlbSBvZiBpdGVtcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBpbnN0YW5jZTogVCA9IG5ldyB0eXBlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5zdGFuY2UgPSB0aGlzLnNlYXJjaFN1YnR5cGVzKGJ1aWxkZXIsIGVtYmVkZGVkQ2xhc3NOYW1lLCBpbnN0YW5jZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5zdGFudGlhdGVSZXNvdXJjZShpbnN0YW5jZSwgaXRlbSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goaW5zdGFuY2UpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXN1bHQudG90YWxFbGVtZW50cyA9IHBheWxvYWQucGFnZSA/IHBheWxvYWQucGFnZS50b3RhbEVsZW1lbnRzIDogcmVzdWx0Lmxlbmd0aDtcclxuICAgICAgICByZXN1bHQudG90YWxQYWdlcyA9IHBheWxvYWQucGFnZSA/IHBheWxvYWQucGFnZS50b3RhbFBhZ2VzIDogMTtcclxuICAgICAgICByZXN1bHQucGFnZU51bWJlciA9IHBheWxvYWQucGFnZSA/IHBheWxvYWQucGFnZS5udW1iZXIgOiAxO1xyXG4gICAgICAgIHJlc3VsdC5wYWdlU2l6ZSA9IHBheWxvYWQucGFnZSA/IHBheWxvYWQucGFnZS5zaXplIDogMjA7XHJcblxyXG4gICAgICAgIHJlc3VsdC5zZWxmX3VyaSA9IHBheWxvYWQuX2xpbmtzICYmIHBheWxvYWQuX2xpbmtzLnNlbGYgPyBwYXlsb2FkLl9saW5rcy5zZWxmLmhyZWYgOiB1bmRlZmluZWQ7XHJcbiAgICAgICAgcmVzdWx0Lm5leHRfdXJpID0gcGF5bG9hZC5fbGlua3MgJiYgcGF5bG9hZC5fbGlua3MubmV4dCA/IHBheWxvYWQuX2xpbmtzLm5leHQuaHJlZiA6IHVuZGVmaW5lZDtcclxuICAgICAgICByZXN1bHQucHJldl91cmkgPSBwYXlsb2FkLl9saW5rcyAmJiBwYXlsb2FkLl9saW5rcy5wcmV2ID8gcGF5bG9hZC5fbGlua3MucHJldi5ocmVmIDogdW5kZWZpbmVkO1xyXG4gICAgICAgIHJlc3VsdC5maXJzdF91cmkgPSBwYXlsb2FkLl9saW5rcyAmJiBwYXlsb2FkLl9saW5rcy5maXJzdCA/IHBheWxvYWQuX2xpbmtzLmZpcnN0LmhyZWYgOiB1bmRlZmluZWQ7XHJcbiAgICAgICAgcmVzdWx0Lmxhc3RfdXJpID0gcGF5bG9hZC5fbGlua3MgJiYgcGF5bG9hZC5fbGlua3MubGFzdCA/IHBheWxvYWQuX2xpbmtzLmxhc3QuaHJlZiA6IHVuZGVmaW5lZDtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBzZWFyY2ggc3VidHlwZXMqL1xyXG4gICAgc3RhdGljIHNlYXJjaFN1YnR5cGVzPFQgZXh0ZW5kcyBSZXNvdXJjZT4oYnVpbGRlcjogU3ViVHlwZUJ1aWxkZXIsIGVtYmVkZGVkQ2xhc3NOYW1lOiBzdHJpbmcsIGluc3RhbmNlOiBUKSB7XHJcbiAgICAgICAgaWYgKGJ1aWxkZXIgJiYgYnVpbGRlci5zdWJ0eXBlcykge1xyXG4gICAgICAgICAgICBsZXQga2V5cyA9IGJ1aWxkZXIuc3VidHlwZXMua2V5cygpO1xyXG4gICAgICAgICAgICBBcnJheS5mcm9tKGtleXMpLmZvckVhY2goKHN1YnR5cGVLZXk6IHN0cmluZykgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGVtYmVkZGVkQ2xhc3NOYW1lLnRvTG93ZXJDYXNlKCkuc3RhcnRzV2l0aChzdWJ0eXBlS2V5LnRvTG93ZXJDYXNlKCkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHN1YnR5cGU6IHsgbmV3KCk6IGFueSB9ID0gYnVpbGRlci5zdWJ0eXBlcy5nZXQoc3VidHlwZUtleSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5zdGFuY2UgPSBuZXcgc3VidHlwZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBpbnN0YW50aWF0ZSBhIFJlc291cmNlIGZyb20gcmVzcG9uc2UgKi9cclxuICAgIHN0YXRpYyBpbnN0YW50aWF0ZVJlc291cmNlPFQgZXh0ZW5kcyBSZXNvdXJjZT4oZW50aXR5OiBULCBwYXlsb2FkOiBPYmplY3QpOiBUIHtcclxuICAgICAgICBmb3IgKGNvbnN0IHAgaW4gcGF5bG9hZCkge1xyXG4gICAgICAgICAgICAvL1RPRE8gYXJyYXkgaW5pdFxyXG4gICAgICAgICAgICAvKiBpZihlbnRpdHlbcF0uY29uc3RydWN0b3IgPT09IEFycmF5ICYmIGlzTnVsbE9yVW5kZWZpbmVkKHBheWxvYWRbcF0pKVxyXG4gICAgICAgICAgICAgICAgIGVudGl0eVtwXSA9IFtdO1xyXG4gICAgICAgICAgICAgZWxzZSovXHJcbiAgICAgICAgICAgIGVudGl0eVtwXSA9IHBheWxvYWRbcF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBlbnRpdHk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHNldCBwcm94eSBVUkwgKi9cclxuICAgIHN0YXRpYyBzZXRQcm94eVVyaShwcm94eV91cmk6IHN0cmluZykge1xyXG4gICAgICAgIFJlc291cmNlSGVscGVyLnByb3h5X3VyaSA9IHByb3h5X3VyaTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogc2V0IFJvb3QgVVJJICovXHJcbiAgICBzdGF0aWMgc2V0Um9vdFVyaShyb290X3VyaTogc3RyaW5nKSB7XHJcbiAgICAgICAgUmVzb3VyY2VIZWxwZXIucm9vdF91cmkgPSByb290X3VyaTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHByb3h5IFVSTCAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBnZXRVUkwoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gUmVzb3VyY2VIZWxwZXIucHJveHlfdXJpICYmIFJlc291cmNlSGVscGVyLnByb3h5X3VyaSAhPSAnJyA/XHJcbiAgICAgICAgICAgIFJlc291cmNlSGVscGVyLmFkZFNsYXNoKFJlc291cmNlSGVscGVyLnByb3h5X3VyaSkgOlxyXG4gICAgICAgICAgICBSZXNvdXJjZUhlbHBlci5hZGRTbGFzaChSZXNvdXJjZUhlbHBlci5yb290X3VyaSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGFkZCBzbGFzaCB0byBVUkkgKi9cclxuICAgIHByaXZhdGUgc3RhdGljIGFkZFNsYXNoKHVyaTogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICBsZXQgdXJpUGFyc2VkID0gdXJsLnBhcnNlKHVyaSk7XHJcbiAgICAgICAgaWYgKGlzTnVsbE9yVW5kZWZpbmVkKHVyaVBhcnNlZC5zZWFyY2gpICYmIHVyaSAmJiB1cmlbdXJpLmxlbmd0aCAtIDFdICE9ICcvJylcclxuICAgICAgICAgICAgcmV0dXJuIHVyaSArICcvJztcclxuICAgICAgICByZXR1cm4gdXJpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgcHJveHkgZnJvbSBVUkwgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0UHJveHkodXJsOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgIGlmICghUmVzb3VyY2VIZWxwZXIucHJveHlfdXJpIHx8IFJlc291cmNlSGVscGVyLnByb3h5X3VyaSA9PSAnJylcclxuICAgICAgICAgICAgcmV0dXJuIHVybDtcclxuICAgICAgICByZXR1cm4gUmVzb3VyY2VIZWxwZXIuYWRkU2xhc2godXJsLnJlcGxhY2UoUmVzb3VyY2VIZWxwZXIucm9vdF91cmksIFJlc291cmNlSGVscGVyLnByb3h5X3VyaSkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBzZXQgSHR0cENsaWVudCovXHJcbiAgICBwdWJsaWMgc3RhdGljIHNldEh0dHAoaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgICAgIFJlc291cmNlSGVscGVyLmh0dHAgPSBodHRwO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgSHR0cENsaWVudCovXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldEh0dHAoKTogSHR0cENsaWVudCB7XHJcbiAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLmh0dHA7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCByb290IFVSSSovXHJcbiAgICBzdGF0aWMgZ2V0Um9vdFVyaSgpIHtcclxuICAgICAgICByZXR1cm4gUmVzb3VyY2VIZWxwZXIucm9vdF91cmk7XHJcbiAgICB9XHJcbn1cclxuIiwiXHJcbmltcG9ydCB7dGhyb3dFcnJvciBhcyBvYnNlcnZhYmxlVGhyb3dFcnJvciwgb2YgYXMgb2JzZXJ2YWJsZU9mfSBmcm9tICdyeGpzJztcclxuXHJcbmltcG9ydCB7bWFwfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcblxyXG5cclxuaW1wb3J0IHtIdHRwUGFyYW1zfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7UmVzb3VyY2VIZWxwZXJ9IGZyb20gJy4vcmVzb3VyY2UtaGVscGVyJztcclxuaW1wb3J0IHtSZXNvdXJjZUFycmF5fSBmcm9tICcuL3Jlc291cmNlLWFycmF5JztcclxuaW1wb3J0IHtpc051bGxPclVuZGVmaW5lZH0gZnJvbSAndXRpbCc7XHJcblxyXG5pbXBvcnQge0hhbE9wdGlvbnN9IGZyb20gJy4vcmVzdC5zZXJ2aWNlJztcclxuaW1wb3J0IHtTdWJUeXBlQnVpbGRlcn0gZnJvbSAnLi9zdWJ0eXBlLWJ1aWxkZXInO1xyXG5pbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge09ic2VydmFibGV9IGZyb20gJ3J4anMnO1xyXG5cclxuLyoqIEFic3RyYWN0IHJlc291cmNlIGNsYXNzKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgUmVzb3VyY2Uge1xyXG5cclxuICAgIC8qKiBwcm94eSBVUkwgKi9cclxuICAgIHB1YmxpYyBwcm94eVVybDogc3RyaW5nO1xyXG4gICAgLyoqIHJvb3QgVVJMICovXHJcbiAgICBwdWJsaWMgcm9vdFVybDogc3RyaW5nO1xyXG5cclxuICAgIC8qKiBsaW5rcyAqL1xyXG4gICAgcHVibGljIF9saW5rczogYW55O1xyXG4gICAgLyoqIHN1YnR5cGVzICovXHJcbiAgICBwdWJsaWMgX3N1YnR5cGVzOiBNYXA8c3RyaW5nLCBhbnk+O1xyXG5cclxuICAgIFxyXG4gICAgLyoqIGdldCBzdWJ0eXBlcyAqLyAgICBcclxuICAgIHB1YmxpYyBnZXQgc3VidHlwZXMoKTogTWFwPHN0cmluZywgYW55PiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3N1YnR5cGVzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBzZXQgc3VidHlwZXMgKi9cclxuICAgIHB1YmxpYyBzZXQgc3VidHlwZXMoX3N1YnR5cGVzOiBNYXA8c3RyaW5nLCBhbnk+KSB7XHJcbiAgICAgICAgdGhpcy5fc3VidHlwZXMgPSBfc3VidHlwZXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGNvbnN0cnVjdG9yKi9cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBHZXQgY29sbGVjdGlvbiBvZiByZWxhdGVkIHJlc291cmNlcyAqL1xyXG4gICAgcHVibGljIGdldFJlbGF0aW9uQXJyYXk8VCBleHRlbmRzIFJlc291cmNlPih0eXBlOiB7IG5ldygpOiBUIH0sIHJlbGF0aW9uOiBzdHJpbmcsIF9lbWJlZGRlZD86IHN0cmluZywgb3B0aW9ucz86IEhhbE9wdGlvbnMsIGJ1aWxkZXI/OiBTdWJUeXBlQnVpbGRlcik6IE9ic2VydmFibGU8VFtdPiB7XHJcblxyXG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IFJlc291cmNlSGVscGVyLm9wdGlvblBhcmFtcyhuZXcgSHR0cFBhcmFtcygpLCBvcHRpb25zKTtcclxuICAgICAgICBjb25zdCByZXN1bHQ6IFJlc291cmNlQXJyYXk8VD4gPSBSZXNvdXJjZUhlbHBlci5jcmVhdGVFbXB0eVJlc3VsdDxUPihpc051bGxPclVuZGVmaW5lZChfZW1iZWRkZWQpID8gXCJfZW1iZWRkZWRcIiA6IF9lbWJlZGRlZCk7XHJcbiAgICAgICAgaWYgKCFpc051bGxPclVuZGVmaW5lZCh0aGlzLl9saW5rcykgJiYgIWlzTnVsbE9yVW5kZWZpbmVkKHRoaXMuX2xpbmtzW3JlbGF0aW9uXSkpIHtcclxuICAgICAgICAgICAgbGV0IG9ic2VydmFibGUgPSBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkuZ2V0KFJlc291cmNlSGVscGVyLmdldFByb3h5KHRoaXMuX2xpbmtzW3JlbGF0aW9uXS5ocmVmKSwge1xyXG4gICAgICAgICAgICAgICAgaGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVycyxcclxuICAgICAgICAgICAgICAgIHBhcmFtczogcGFyYW1zXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZS5waXBlKG1hcChyZXNwb25zZSA9PiBSZXNvdXJjZUhlbHBlci5pbnN0YW50aWF0ZVJlc291cmNlQ29sbGVjdGlvbjxUPih0eXBlLCByZXNwb25zZSwgcmVzdWx0LCBidWlsZGVyKSksXHJcbiAgICAgICAgICAgICAgICBtYXAoKGFycmF5OiBSZXNvdXJjZUFycmF5PFQ+KSA9PiBhcnJheS5yZXN1bHQpLCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIG9ic2VydmFibGVPZihbXSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKiBHZXQgcmVsYXRlZCByZXNvdXJjZSAqL1xyXG4gICAgcHVibGljIGdldFJlbGF0aW9uPFQgZXh0ZW5kcyBSZXNvdXJjZT4odHlwZTogeyBuZXcoKTogVCB9LCByZWxhdGlvbjogc3RyaW5nLCBidWlsZGVyPzogU3ViVHlwZUJ1aWxkZXIpOiBPYnNlcnZhYmxlPFQ+IHtcclxuICAgICAgICBsZXQgcmVzdWx0OiBUID0gbmV3IHR5cGUoKTtcclxuICAgICAgICBpZiAoIWlzTnVsbE9yVW5kZWZpbmVkKHRoaXMuX2xpbmtzKSAmJiAhaXNOdWxsT3JVbmRlZmluZWQodGhpcy5fbGlua3NbcmVsYXRpb25dKSkge1xyXG4gICAgICAgICAgICBsZXQgb2JzZXJ2YWJsZSA9IFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5nZXQoUmVzb3VyY2VIZWxwZXIuZ2V0UHJveHkodGhpcy5fbGlua3NbcmVsYXRpb25dLmhyZWYpLCB7aGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVyc30pO1xyXG4gICAgICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZS5waXBlKG1hcCgoZGF0YTogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYnVpbGRlcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgZW1iZWRkZWRDbGFzc05hbWUgb2YgT2JqZWN0LmtleXMoZGF0YVsnX2xpbmtzJ10pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlbWJlZGRlZENsYXNzTmFtZSA9PSAnc2VsZicpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBocmVmOiBzdHJpbmcgPSBkYXRhLl9saW5rc1tlbWJlZGRlZENsYXNzTmFtZV0uaHJlZjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBpZHg6IG51bWJlciA9IGhyZWYubGFzdEluZGV4T2YoJy8nKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZWFsQ2xhc3NOYW1lID0gaHJlZi5yZXBsYWNlKFJlc291cmNlSGVscGVyLmdldFJvb3RVcmkoKSwgXCJcIikuc3Vic3RyaW5nKDAsIGlkeCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBSZXNvdXJjZUhlbHBlci5zZWFyY2hTdWJ0eXBlcyhidWlsZGVyLCByZWFsQ2xhc3NOYW1lLCByZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gUmVzb3VyY2VIZWxwZXIuaW5zdGFudGlhdGVSZXNvdXJjZShyZXN1bHQsIGRhdGEpO1xyXG4gICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIG9ic2VydmFibGVPZihudWxsKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEFkZHMgdGhlIGdpdmVuIHJlc291cmNlIHRvIHRoZSBib3VuZCBjb2xsZWN0aW9uIGJ5IHRoZSByZWxhdGlvbiAqL1xyXG4gICAgcHVibGljIGFkZFJlbGF0aW9uPFQgZXh0ZW5kcyBSZXNvdXJjZT4ocmVsYXRpb246IHN0cmluZywgcmVzb3VyY2U6IFQpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgICAgIGlmICghaXNOdWxsT3JVbmRlZmluZWQodGhpcy5fbGlua3MpICYmICFpc051bGxPclVuZGVmaW5lZCh0aGlzLl9saW5rc1tyZWxhdGlvbl0pKSB7XHJcbiAgICAgICAgICAgIGxldCBoZWFkZXIgPSBSZXNvdXJjZUhlbHBlci5oZWFkZXJzLmFwcGVuZCgnQ29udGVudC1UeXBlJywgJ3RleHQvdXJpLWxpc3QnKTtcclxuICAgICAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5wb3N0KFJlc291cmNlSGVscGVyLmdldFByb3h5KHRoaXMuX2xpbmtzW3JlbGF0aW9uXS5ocmVmKSwgcmVzb3VyY2UuX2xpbmtzLnNlbGYuaHJlZiwge2hlYWRlcnM6IGhlYWRlcn0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBvYnNlcnZhYmxlVGhyb3dFcnJvcignbm8gcmVsYXRpb24gZm91bmQnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEJpbmQgdGhlIGdpdmVuIHJlc291cmNlIHRvIHRoaXMgcmVzb3VyY2UgYnkgdGhlIGdpdmVuIHJlbGF0aW9uKi9cclxuICAgIHB1YmxpYyB1cGRhdGVSZWxhdGlvbjxUIGV4dGVuZHMgUmVzb3VyY2U+KHJlbGF0aW9uOiBzdHJpbmcsIHJlc291cmNlOiBUKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgICAgICBpZiAoIWlzTnVsbE9yVW5kZWZpbmVkKHRoaXMuX2xpbmtzKSAmJiAhaXNOdWxsT3JVbmRlZmluZWQodGhpcy5fbGlua3NbcmVsYXRpb25dKSkge1xyXG4gICAgICAgICAgICBsZXQgaGVhZGVyID0gUmVzb3VyY2VIZWxwZXIuaGVhZGVycy5hcHBlbmQoJ0NvbnRlbnQtVHlwZScsICd0ZXh0L3VyaS1saXN0Jyk7XHJcbiAgICAgICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkucGF0Y2goUmVzb3VyY2VIZWxwZXIuZ2V0UHJveHkodGhpcy5fbGlua3NbcmVsYXRpb25dLmhyZWYpLCByZXNvdXJjZS5fbGlua3Muc2VsZi5ocmVmLCB7aGVhZGVyczogaGVhZGVyfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIG9ic2VydmFibGVUaHJvd0Vycm9yKCdubyByZWxhdGlvbiBmb3VuZCcpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKiogQmluZCB0aGUgZ2l2ZW4gcmVzb3VyY2UgdG8gdGhpcyByZXNvdXJjZSBieSB0aGUgZ2l2ZW4gcmVsYXRpb24qL1xyXG4gICAgcHVibGljIHN1YnN0aXR1dGVSZWxhdGlvbjxUIGV4dGVuZHMgUmVzb3VyY2U+KHJlbGF0aW9uOiBzdHJpbmcsIHJlc291cmNlOiBUKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgICAgICBpZiAoIWlzTnVsbE9yVW5kZWZpbmVkKHRoaXMuX2xpbmtzKSAmJiAhaXNOdWxsT3JVbmRlZmluZWQodGhpcy5fbGlua3NbcmVsYXRpb25dKSkge1xyXG4gICAgICAgICAgICBsZXQgaGVhZGVyID0gUmVzb3VyY2VIZWxwZXIuaGVhZGVycy5hcHBlbmQoJ0NvbnRlbnQtVHlwZScsICd0ZXh0L3VyaS1saXN0Jyk7XHJcbiAgICAgICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkucHV0KFJlc291cmNlSGVscGVyLmdldFByb3h5KHRoaXMuX2xpbmtzW3JlbGF0aW9uXS5ocmVmKSwgcmVzb3VyY2UuX2xpbmtzLnNlbGYuaHJlZiwge2hlYWRlcnM6IGhlYWRlcn0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBvYnNlcnZhYmxlVGhyb3dFcnJvcignbm8gcmVsYXRpb24gZm91bmQnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIFxyXG4gICAgLyoqIEJpbmQgdGhlIGdpdmVuIHJlc291cmNlIHRvIHRoaXMgcmVzb3VyY2UgYnkgdGhlIGdpdmVuIHJlbGF0aW9uKi9cclxuICAgIHB1YmxpYyBzdWJzdGl0dXRlQWxsUmVsYXRpb248VCBleHRlbmRzIFJlc291cmNlPihyZWxhdGlvbjogc3RyaW5nLCByZXNvdXJjZXM6IFJlc291cmNlW10pOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgICAgIGlmICghaXNOdWxsT3JVbmRlZmluZWQodGhpcy5fbGlua3MpICYmICFpc051bGxPclVuZGVmaW5lZCh0aGlzLl9saW5rc1tyZWxhdGlvbl0pKSB7XHJcbiAgICAgICAgICAgIGxldCBoZWFkZXIgPSBSZXNvdXJjZUhlbHBlci5oZWFkZXJzLmFwcGVuZCgnQ29udGVudC1UeXBlJywgJ3RleHQvdXJpLWxpc3QnKTtcclxuICAgICAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5wdXQoUmVzb3VyY2VIZWxwZXIuZ2V0UHJveHkodGhpcy5fbGlua3NbcmVsYXRpb25dLmhyZWYpLCByZXNvdXJjZXMubWFwKChyZXNvdXJjZSkgPT4gcmVzb3VyY2UuX2xpbmtzLnNlbGYuaHJlZiksIHtoZWFkZXJzOiBoZWFkZXJ9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZVRocm93RXJyb3IoJ25vIHJlbGF0aW9uIGZvdW5kJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgLyoqIFVuYmluZCB0aGUgcmVzb3VyY2Ugd2l0aCB0aGUgZ2l2ZW4gcmVsYXRpb24gZnJvbSB0aGlzIHJlc291cmNlKi9cclxuICAgIHB1YmxpYyBkZWxldGVSZWxhdGlvbjxUIGV4dGVuZHMgUmVzb3VyY2U+KHJlbGF0aW9uOiBzdHJpbmcsIHJlc291cmNlOiBUKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgICAgICBpZiAoIWlzTnVsbE9yVW5kZWZpbmVkKHRoaXMuX2xpbmtzKSAmJiAhaXNOdWxsT3JVbmRlZmluZWQocmVzb3VyY2UuX2xpbmtzKSkge1xyXG4gICAgICAgICAgICBsZXQgbGluazogc3RyaW5nID0gcmVzb3VyY2UuX2xpbmtzWydzZWxmJ10uaHJlZjtcclxuICAgICAgICAgICAgbGV0IGlkeDogbnVtYmVyID0gbGluay5sYXN0SW5kZXhPZignLycpICsgMTtcclxuXHJcbiAgICAgICAgICAgIGlmIChpZHggPT0gLTEpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZVRocm93RXJyb3IoJ25vIHJlbGF0aW9uIGZvdW5kJyk7XHJcblxyXG4gICAgICAgICAgICBsZXQgcmVsYXRpb25JZDogc3RyaW5nID0gbGluay5zdWJzdHJpbmcoaWR4KTtcclxuICAgICAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5kZWxldGUoUmVzb3VyY2VIZWxwZXIuZ2V0UHJveHkodGhpcy5fbGlua3NbcmVsYXRpb25dLmhyZWYgKyAnLycgKyByZWxhdGlvbklkKSwge2hlYWRlcnM6IFJlc291cmNlSGVscGVyLmhlYWRlcnN9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZVRocm93RXJyb3IoJ25vIHJlbGF0aW9uIGZvdW5kJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKiogVW5iaW5kIHRoZSByZXNvdXJjZSB3aXRoIHRoZSBnaXZlbiByZWxhdGlvbiBmcm9tIHRoaXMgcmVzb3VyY2UqL1xyXG4gICAgcHVibGljIGRlbGV0ZUFsbFJlbGF0aW9uPFQgZXh0ZW5kcyBSZXNvdXJjZT4ocmVsYXRpb246IHN0cmluZyk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5kZWxldGUoUmVzb3VyY2VIZWxwZXIuZ2V0UHJveHkodGhpcy5fbGlua3NbcmVsYXRpb25dLmhyZWYgKSwge2hlYWRlcnM6IFJlc291cmNlSGVscGVyLmhlYWRlcnN9KTtcclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbn0iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuaW1wb3J0IHsgVXNlckNvbmZpZ3VyYXRpb24gfSBmcm9tICcuL3VzZXItY29uZmlndXJhdGlvbi5tb2RlbCc7XHJcbmltcG9ydCB7IFVzZXJQb3NpdGlvbiB9IGZyb20gJy4vdXNlci1wb3NpdGlvbi5tb2RlbCc7XHJcblxyXG4vKipcclxuICogVXNlciBtb2RlbFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFVzZXIgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgLyoqIGlkICovXHJcbiAgcHVibGljIGlkOiBudW1iZXI7ICBcclxuICAvKiogdXNlcm5hbWUgKi9cclxuICBwdWJsaWMgdXNlcm5hbWU6IHN0cmluZztcclxuICAvKiogcGFzc3dvcmQgKi9cclxuICBwdWJsaWMgcGFzc3dvcmQ6IHN0cmluZztcclxuICAvKiogZmlyc3QgbmFtZSAqL1xyXG4gIHB1YmxpYyBmaXJzdE5hbWU6IHN0cmluZztcclxuICAvKiogbGFzdCBuYW1lICovXHJcbiAgcHVibGljIGxhc3ROYW1lOiBzdHJpbmc7XHJcbiAgLyoqIHdoZXRoZXIgdXNlciBpcyBibG9ja2VkICovXHJcbiAgcHVibGljIGJsb2NrZWQ6IGJvb2xlYW47XHJcbiAgLyoqIHdoZXRoZXIgdXNlciBpcyBhZG1pbmlzdHJhdG9yICovXHJcbiAgcHVibGljIGFkbWluaXN0cmF0b3I6IGJvb2xlYW47XHJcbiAgLyoqIElzIHBhc3N3b3JkU2V0ICovXHJcbiAgcHVibGljIHBhc3N3b3JkU2V0OiBib29sZWFuO1xyXG4gIC8qKiB1c2VyIHBvc2l0aW9ucyAqL1xyXG4gIHB1YmxpYyBwb3NpdGlvbnM6IFVzZXJQb3NpdGlvbltdO1xyXG4gIC8qKiB1c2VyIHBlcm1pc3Npb25zICovXHJcbiAgcHVibGljIHBlcm1pc3Npb25zOiBVc2VyQ29uZmlndXJhdGlvbltdO1xyXG59XHJcbiIsImltcG9ydCB7SHR0cENsaWVudH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQge0luamVjdCwgSW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7UmVzb3VyY2VIZWxwZXJ9IGZyb20gJy4vcmVzb3VyY2UtaGVscGVyJztcclxuaW1wb3J0IHtFeHRlcm5hbENvbmZpZ3VyYXRpb25IYW5kbGVySW50ZXJmYWNlfSBmcm9tICcuL2V4dGVybmFsLWNvbmZpZ3VyYXRpb24uaGFuZGxlcic7XHJcbmltcG9ydCB7RXh0ZXJuYWxDb25maWd1cmF0aW9ufSBmcm9tICcuL0V4dGVybmFsQ29uZmlndXJhdGlvbic7XHJcblxyXG5cclxuLyoqIEV4dGVybmFsU2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBFeHRlcm5hbFNlcnZpY2Uge1xyXG5cclxuICAgIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gICAgY29uc3RydWN0b3IoQEluamVjdCgnRXh0ZXJuYWxDb25maWd1cmF0aW9uU2VydmljZScpIHByaXZhdGUgZXh0ZXJuYWxDb25maWd1cmF0aW9uU2VydmljZTogRXh0ZXJuYWxDb25maWd1cmF0aW9uSGFuZGxlckludGVyZmFjZSkge1xyXG4gICAgICAgIFJlc291cmNlSGVscGVyLnNldFByb3h5VXJpKGV4dGVybmFsQ29uZmlndXJhdGlvblNlcnZpY2UuZ2V0UHJveHlVcmkoKSk7XHJcbiAgICAgICAgUmVzb3VyY2VIZWxwZXIuc2V0Um9vdFVyaShleHRlcm5hbENvbmZpZ3VyYXRpb25TZXJ2aWNlLmdldFJvb3RVcmkoKSk7XHJcbiAgICAgICAgUmVzb3VyY2VIZWxwZXIuc2V0SHR0cChleHRlcm5hbENvbmZpZ3VyYXRpb25TZXJ2aWNlLmdldEh0dHAoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHVwZGF0ZSBFeHRlcm5hbENvbmZpZ3VyYXRpb25IYW5kbGVyICovXHJcbiAgICBwdWJsaWMgdXBkYXRlRXh0ZXJuYWxDb25maWd1cmF0aW9uSGFuZGxlckludGVyZmFjZShleHRlcm5hbENvbmZpZ3VyYXRpb25TZXJ2aWNlOiBFeHRlcm5hbENvbmZpZ3VyYXRpb25IYW5kbGVySW50ZXJmYWNlKSB7XHJcblx0dGhpcy5leHRlcm5hbENvbmZpZ3VyYXRpb25TZXJ2aWNlID0gZXh0ZXJuYWxDb25maWd1cmF0aW9uU2VydmljZTtcclxuXHJcbiAgICAgICAgUmVzb3VyY2VIZWxwZXIuc2V0UHJveHlVcmkoZXh0ZXJuYWxDb25maWd1cmF0aW9uU2VydmljZS5nZXRQcm94eVVyaSgpKTtcclxuICAgICAgICBSZXNvdXJjZUhlbHBlci5zZXRSb290VXJpKGV4dGVybmFsQ29uZmlndXJhdGlvblNlcnZpY2UuZ2V0Um9vdFVyaSgpKTtcclxuICAgICAgICBSZXNvdXJjZUhlbHBlci5zZXRIdHRwKGV4dGVybmFsQ29uZmlndXJhdGlvblNlcnZpY2UuZ2V0SHR0cCgpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IEV4dGVybmFsQ29uZmlndXJhdGlvbiAqL1xyXG4gICAgcHVibGljIGdldEV4dGVybmFsQ29uZmlndXJhdGlvbigpOiBFeHRlcm5hbENvbmZpZ3VyYXRpb24ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmV4dGVybmFsQ29uZmlndXJhdGlvblNlcnZpY2UuZ2V0RXh0ZXJuYWxDb25maWd1cmF0aW9uKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCBwcm94eSBVUkwgKi9cclxuICAgIHB1YmxpYyBnZXRQcm94eVVyaSgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmV4dGVybmFsQ29uZmlndXJhdGlvblNlcnZpY2UuZ2V0UHJveHlVcmkoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IFJvb3QgVVJJICovXHJcbiAgICBwdWJsaWMgZ2V0Um9vdFVyaSgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmV4dGVybmFsQ29uZmlndXJhdGlvblNlcnZpY2UuZ2V0Um9vdFVyaSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgVVJMICovXHJcbiAgICBwdWJsaWMgZ2V0VVJMKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLmdldFVSTCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgSHR0cENsaWVudCAqL1xyXG4gICAgcHVibGljIGdldEh0dHAoKTogSHR0cENsaWVudCB7XHJcbiAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLmdldEh0dHAoKTtcclxuICAgIH1cclxufVxyXG4iLCJcclxuaW1wb3J0IHsgdGhyb3dFcnJvciBhcyBvYnNlcnZhYmxlVGhyb3dFcnJvciB9IGZyb20gJ3J4anMnO1xyXG5cclxuaW1wb3J0IHsgY2F0Y2hFcnJvciwgbWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5pbXBvcnQgeyBSZXNvdXJjZSB9IGZyb20gJy4vcmVzb3VyY2UnO1xyXG5pbXBvcnQgeyBSZXNvdXJjZUhlbHBlciB9IGZyb20gJy4vcmVzb3VyY2UtaGVscGVyJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwUGFyYW1zLCBIdHRwUmVzcG9uc2UgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IFNvcnQgfSBmcm9tICcuL3NvcnQnO1xyXG5pbXBvcnQgeyBSZXNvdXJjZUFycmF5IH0gZnJvbSAnLi9yZXNvdXJjZS1hcnJheSc7XHJcbmltcG9ydCB7IEV4dGVybmFsU2VydmljZSB9IGZyb20gJy4vZXh0ZXJuYWwuc2VydmljZSc7XHJcbmltcG9ydCB7IEhhbE9wdGlvbnMgfSBmcm9tICcuL3Jlc3Quc2VydmljZSc7XHJcbmltcG9ydCB7IFN1YlR5cGVCdWlsZGVyIH0gZnJvbSAnLi9zdWJ0eXBlLWJ1aWxkZXInO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcblxyXG4vKiogUmVzb3VyY2VTZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFJlc291cmNlU2VydmljZSB7XHJcblxyXG5cclxuICAgIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBleHRlcm5hbFNlcnZpY2U6IEV4dGVybmFsU2VydmljZSkgeyB9XHJcblxyXG5cclxuICAgIC8qKiBnZXQgVVJMICovXHJcbiAgICBwcml2YXRlIHN0YXRpYyBnZXRVUkwoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gUmVzb3VyY2VIZWxwZXIuZ2V0VVJMKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCBhbGwgcmVzb3VyY2VzIGZyb20gYSBiYXNlIFVSSSBvZiBhIGdpdmVuIHR5cGUgKi9cclxuICAgIHB1YmxpYyBnZXRBbGw8VCBleHRlbmRzIFJlc291cmNlPih0eXBlOiB7IG5ldygpOiBUIH0sIHJlc291cmNlOiBzdHJpbmcsIF9lbWJlZGRlZDogc3RyaW5nLCBvcHRpb25zPzogSGFsT3B0aW9ucywgc3ViVHlwZT86IFN1YlR5cGVCdWlsZGVyLCBlbWJlZGRlZE5hbWU/OlN0cmluZywgaWdub3JlUHJvamVjdGlvbj86Ym9vbGVhbik6IE9ic2VydmFibGU8UmVzb3VyY2VBcnJheTxUPj4ge1xyXG4gICAgICAgIGxldCB1cmkgPSB0aGlzLmdldFJlc291cmNlVXJsKHJlc291cmNlKTtcclxuICAgICAgICBpZighaWdub3JlUHJvamVjdGlvbil7XHJcbiAgICAgICAgICAgIHVyaSA9IHVyaS5jb25jYXQoJz9wcm9qZWN0aW9uPXZpZXcnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgcGFyYW1zID0gUmVzb3VyY2VIZWxwZXIub3B0aW9uUGFyYW1zKG5ldyBIdHRwUGFyYW1zKCksIG9wdGlvbnMpO1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdDogUmVzb3VyY2VBcnJheTxUPiA9IFJlc291cmNlSGVscGVyLmNyZWF0ZUVtcHR5UmVzdWx0PFQ+KF9lbWJlZGRlZCk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0VXJscyhyZXN1bHQpO1xyXG4gICAgICAgIHJlc3VsdC5zb3J0SW5mbyA9IG9wdGlvbnMgPyBvcHRpb25zLnNvcnQgOiB1bmRlZmluZWQ7XHJcbiAgICAgICAgbGV0IG9ic2VydmFibGUgPSBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkuZ2V0KHVyaSwgeyBoZWFkZXJzOiBSZXNvdXJjZUhlbHBlci5oZWFkZXJzLCBwYXJhbXM6IHBhcmFtcyB9KTtcclxuICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZS5waXBlKG1hcChyZXNwb25zZSA9PiBSZXNvdXJjZUhlbHBlci5pbnN0YW50aWF0ZVJlc291cmNlQ29sbGVjdGlvbih0eXBlLCByZXNwb25zZSwgcmVzdWx0LCBzdWJUeXBlLGVtYmVkZGVkTmFtZSkpLFxyXG4gICAgICAgICAgICBjYXRjaEVycm9yKGVycm9yID0+IG9ic2VydmFibGVUaHJvd0Vycm9yKGVycm9yKSkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgcmVzb3VyY2UgZnJvbSBhIGJhc2UgVVJJIGFuZCBhIGdpdmVuIGlkICovXHJcbiAgICBwdWJsaWMgZ2V0PFQgZXh0ZW5kcyBSZXNvdXJjZT4odHlwZTogeyBuZXcoKTogVCB9LCByZXNvdXJjZTogc3RyaW5nLCBpZDogYW55KTogT2JzZXJ2YWJsZTxUPiB7XHJcbiAgICAgICAgY29uc3QgdXJpID0gdGhpcy5nZXRSZXNvdXJjZVVybChyZXNvdXJjZSkuY29uY2F0KCcvJywgaWQsICc/cHJvamVjdGlvbj12aWV3Jyk7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0OiBUID0gbmV3IHR5cGUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRVcmxzUmVzb3VyY2UocmVzdWx0KTtcclxuICAgICAgICBsZXQgb2JzZXJ2YWJsZSA9IFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5nZXQodXJpLCB7IGhlYWRlcnM6IFJlc291cmNlSGVscGVyLmhlYWRlcnMgfSk7XHJcbiAgICAgICAgcmV0dXJuIG9ic2VydmFibGUucGlwZShtYXAoZGF0YSA9PiBSZXNvdXJjZUhlbHBlci5pbnN0YW50aWF0ZVJlc291cmNlKHJlc3VsdCwgZGF0YSkpLFxyXG4gICAgICAgICAgICBjYXRjaEVycm9yKGVycm9yID0+IG9ic2VydmFibGVUaHJvd0Vycm9yKGVycm9yKSkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgcmVzb3VyY2UgZnJvbSBpdHMgc2VsZmxpbmsgKi9cclxuICAgIHB1YmxpYyBnZXRCeVNlbGZMaW5rPFQgZXh0ZW5kcyBSZXNvdXJjZT4odHlwZTogeyBuZXcoKTogVCB9LCByZXNvdXJjZUxpbms6IHN0cmluZyk6IE9ic2VydmFibGU8VD4ge1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdDogVCA9IG5ldyB0eXBlKCk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0VXJsc1Jlc291cmNlKHJlc3VsdCk7XHJcbiAgICAgICAgbGV0IG9ic2VydmFibGUgPSBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkuZ2V0KFJlc291cmNlSGVscGVyLmdldFByb3h5KHJlc291cmNlTGluayksIHsgaGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVycyB9KTtcclxuICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZS5waXBlKG1hcChkYXRhID0+IFJlc291cmNlSGVscGVyLmluc3RhbnRpYXRlUmVzb3VyY2UocmVzdWx0LCBkYXRhKSksXHJcbiAgICAgICAgICAgIGNhdGNoRXJyb3IoZXJyb3IgPT4gb2JzZXJ2YWJsZVRocm93RXJyb3IoZXJyb3IpKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHNlYXJjaCByZXNvdXJjZXMgZnJvbSBhIGdpdmVuIGJhc2UgcGF0aCwgcXVlcnkgYW5kIG9wdGlvbnMgKi9cclxuICAgIHB1YmxpYyBzZWFyY2g8VCBleHRlbmRzIFJlc291cmNlPih0eXBlOiB7IG5ldygpOiBUIH0sIHF1ZXJ5OiBzdHJpbmcsIHJlc291cmNlOiBzdHJpbmcsIF9lbWJlZGRlZDogc3RyaW5nLCBvcHRpb25zPzogSGFsT3B0aW9ucyk6IE9ic2VydmFibGU8UmVzb3VyY2VBcnJheTxUPj4ge1xyXG4gICAgICAgIGNvbnN0IHVyaSA9IHRoaXMuZ2V0UmVzb3VyY2VVcmwocmVzb3VyY2UpLmNvbmNhdCgnL3NlYXJjaC8nLCBxdWVyeSk7XHJcbiAgICAgICAgY29uc3QgcGFyYW1zID0gUmVzb3VyY2VIZWxwZXIub3B0aW9uUGFyYW1zKG5ldyBIdHRwUGFyYW1zKCksIG9wdGlvbnMpO1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdDogUmVzb3VyY2VBcnJheTxUPiA9IFJlc291cmNlSGVscGVyLmNyZWF0ZUVtcHR5UmVzdWx0PFQ+KF9lbWJlZGRlZCk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0VXJscyhyZXN1bHQpO1xyXG4gICAgICAgIGxldCBvYnNlcnZhYmxlID0gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLmdldCh1cmksIHsgaGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVycywgcGFyYW1zOiBwYXJhbXMgfSk7XHJcbiAgICAgICAgcmV0dXJuIG9ic2VydmFibGUucGlwZShtYXAocmVzcG9uc2UgPT4gUmVzb3VyY2VIZWxwZXIuaW5zdGFudGlhdGVSZXNvdXJjZUNvbGxlY3Rpb24odHlwZSwgcmVzcG9uc2UsIHJlc3VsdCkpLFxyXG4gICAgICAgICAgICBjYXRjaEVycm9yKGVycm9yID0+IG9ic2VydmFibGVUaHJvd0Vycm9yKGVycm9yKSkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBzZWFyY2ggYSBzaW5nbGUgcmVzb3VyY2UgZnJvbSBhIGdpdmVuIGJhc2UgcGF0aCwgcXVlcnkgYW5kIG9wdGlvbnMgKi9cclxuICAgIHB1YmxpYyBzZWFyY2hTaW5nbGU8VCBleHRlbmRzIFJlc291cmNlPih0eXBlOiB7IG5ldygpOiBUIH0sIHF1ZXJ5OiBzdHJpbmcsIHJlc291cmNlOiBzdHJpbmcsIG9wdGlvbnM/OiBIYWxPcHRpb25zKTogT2JzZXJ2YWJsZTxUPiB7XHJcbiAgICAgICAgY29uc3QgdXJpID0gdGhpcy5nZXRSZXNvdXJjZVVybChyZXNvdXJjZSkuY29uY2F0KCcvc2VhcmNoLycsIHF1ZXJ5KTtcclxuICAgICAgICBjb25zdCBwYXJhbXMgPSBSZXNvdXJjZUhlbHBlci5vcHRpb25QYXJhbXMobmV3IEh0dHBQYXJhbXMoKSwgb3B0aW9ucyk7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0OiBUID0gbmV3IHR5cGUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRVcmxzUmVzb3VyY2UocmVzdWx0KTtcclxuICAgICAgICBsZXQgb2JzZXJ2YWJsZSA9IFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5nZXQodXJpLCB7IGhlYWRlcnM6IFJlc291cmNlSGVscGVyLmhlYWRlcnMsIHBhcmFtczogcGFyYW1zIH0pO1xyXG4gICAgICAgIHJldHVybiBvYnNlcnZhYmxlLnBpcGUobWFwKHJlc3BvbnNlID0+IFJlc291cmNlSGVscGVyLmluc3RhbnRpYXRlUmVzb3VyY2UocmVzdWx0LCByZXNwb25zZSkpLFxyXG4gICAgICAgICAgICBjYXRjaEVycm9yKGVycm9yID0+IG9ic2VydmFibGVUaHJvd0Vycm9yKGVycm9yKSkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBzZWFyY2ggcmVzb3VyY2VzIGZyb20gYSBnaXZlbiBiYXNlIHBhdGgsIGN1c3RvbSBxdWVyeSBhbmQgb3B0aW9ucyAqL1xyXG4gICAgcHVibGljIGN1c3RvbVF1ZXJ5PFQgZXh0ZW5kcyBSZXNvdXJjZT4odHlwZTogeyBuZXcoKTogVCB9LCBxdWVyeTogc3RyaW5nLCByZXNvdXJjZTogc3RyaW5nLCBfZW1iZWRkZWQ6IHN0cmluZywgb3B0aW9ucz86IEhhbE9wdGlvbnMpOiBPYnNlcnZhYmxlPFJlc291cmNlQXJyYXk8VD4+IHtcclxuICAgICAgICBjb25zdCB1cmkgPSB0aGlzLmdldFJlc291cmNlVXJsKHJlc291cmNlICsgcXVlcnkpO1xyXG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IFJlc291cmNlSGVscGVyLm9wdGlvblBhcmFtcyhuZXcgSHR0cFBhcmFtcygpLCBvcHRpb25zKTtcclxuICAgICAgICBjb25zdCByZXN1bHQ6IFJlc291cmNlQXJyYXk8VD4gPSBSZXNvdXJjZUhlbHBlci5jcmVhdGVFbXB0eVJlc3VsdDxUPihfZW1iZWRkZWQpO1xyXG5cclxuICAgICAgICB0aGlzLnNldFVybHMocmVzdWx0KTtcclxuICAgICAgICBsZXQgb2JzZXJ2YWJsZSA9IFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5nZXQodXJpLCB7IGhlYWRlcnM6IFJlc291cmNlSGVscGVyLmhlYWRlcnMsIHBhcmFtczogcGFyYW1zIH0pO1xyXG4gICAgICAgIHJldHVybiBvYnNlcnZhYmxlLnBpcGUobWFwKHJlc3BvbnNlID0+IFJlc291cmNlSGVscGVyLmluc3RhbnRpYXRlUmVzb3VyY2VDb2xsZWN0aW9uKHR5cGUsIHJlc3BvbnNlLCByZXN1bHQpKSxcclxuICAgICAgICAgICAgY2F0Y2hFcnJvcihlcnJvciA9PiBvYnNlcnZhYmxlVGhyb3dFcnJvcihlcnJvcikpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHJlc291cmNlIGdpdmVuIGEgcmVsYXRpb24gbGluayAqL1xyXG4gICAgcHVibGljIGdldEJ5UmVsYXRpb248VCBleHRlbmRzIFJlc291cmNlPih0eXBlOiB7IG5ldygpOiBUIH0sIHJlc291cmNlTGluazogc3RyaW5nKTogT2JzZXJ2YWJsZTxUPiB7XHJcbiAgICAgICAgbGV0IHJlc3VsdDogVCA9IG5ldyB0eXBlKCk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0VXJsc1Jlc291cmNlKHJlc3VsdCk7XHJcbiAgICAgICAgbGV0IG9ic2VydmFibGUgPSBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkuZ2V0KHJlc291cmNlTGluaywgeyBoZWFkZXJzOiBSZXNvdXJjZUhlbHBlci5oZWFkZXJzIH0pO1xyXG4gICAgICAgIHJldHVybiBvYnNlcnZhYmxlLnBpcGUobWFwKGRhdGEgPT4gUmVzb3VyY2VIZWxwZXIuaW5zdGFudGlhdGVSZXNvdXJjZShyZXN1bHQsIGRhdGEpKSxcclxuICAgICAgICAgICAgY2F0Y2hFcnJvcihlcnJvciA9PiBvYnNlcnZhYmxlVGhyb3dFcnJvcihlcnJvcikpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHJlc291cmNlIGFycmF5IGdpdmVuIGEgcmVsYXRpb24gbGluayAqL1xyXG4gICAgcHVibGljIGdldEJ5UmVsYXRpb25BcnJheTxUIGV4dGVuZHMgUmVzb3VyY2U+KHR5cGU6IHsgbmV3KCk6IFQgfSwgcmVzb3VyY2VMaW5rOiBzdHJpbmcsIF9lbWJlZGRlZDogc3RyaW5nLCBidWlsZGVyPzogU3ViVHlwZUJ1aWxkZXIpOiBPYnNlcnZhYmxlPFJlc291cmNlQXJyYXk8VD4+IHtcclxuICAgICAgICBjb25zdCByZXN1bHQ6IFJlc291cmNlQXJyYXk8VD4gPSBSZXNvdXJjZUhlbHBlci5jcmVhdGVFbXB0eVJlc3VsdDxUPihfZW1iZWRkZWQpO1xyXG5cclxuICAgICAgICB0aGlzLnNldFVybHMocmVzdWx0KTtcclxuICAgICAgICBsZXQgb2JzZXJ2YWJsZSA9IFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5nZXQocmVzb3VyY2VMaW5rLCB7IGhlYWRlcnM6IFJlc291cmNlSGVscGVyLmhlYWRlcnMgfSk7XHJcbiAgICAgICAgcmV0dXJuIG9ic2VydmFibGUucGlwZShtYXAocmVzcG9uc2UgPT4gUmVzb3VyY2VIZWxwZXIuaW5zdGFudGlhdGVSZXNvdXJjZUNvbGxlY3Rpb24odHlwZSwgcmVzcG9uc2UsIHJlc3VsdCwgYnVpbGRlcikpLFxyXG4gICAgICAgICAgICBjYXRjaEVycm9yKGVycm9yID0+IG9ic2VydmFibGVUaHJvd0Vycm9yKGVycm9yKSkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBjb3VudCByZXNvdXJjZXMgZ2l2ZW4gYSBwYXRoICovXHJcbiAgICBwdWJsaWMgY291bnQocmVzb3VyY2U6IHN0cmluZyk6IE9ic2VydmFibGU8bnVtYmVyPiB7XHJcbiAgICAgICAgY29uc3QgdXJpID0gdGhpcy5nZXRSZXNvdXJjZVVybChyZXNvdXJjZSkuY29uY2F0KCcvc2VhcmNoL2NvdW50QWxsJyk7XHJcblxyXG4gICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkuZ2V0KHVyaSwgeyBoZWFkZXJzOiBSZXNvdXJjZUhlbHBlci5oZWFkZXJzLCBvYnNlcnZlOiAnYm9keScgfSkucGlwZShcclxuICAgICAgICAgICAgbWFwKChyZXNwb25zZTogUmVzcG9uc2UpID0+IE51bWJlcihyZXNwb25zZS5ib2R5KSksXHJcbiAgICAgICAgICAgIGNhdGNoRXJyb3IoZXJyb3IgPT4gb2JzZXJ2YWJsZVRocm93RXJyb3IoZXJyb3IpKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGNyZWF0ZSByZXNvdXJjZSBmcm9tIHNlbGYgbGluayBhbmQgZW50aXR5IGRhdGEqL1xyXG4gICAgcHVibGljIGNyZWF0ZTxUIGV4dGVuZHMgUmVzb3VyY2U+KHNlbGZSZXNvdXJjZTogc3RyaW5nLCBlbnRpdHk6IFQpIHtcclxuICAgICAgICBjb25zdCB1cmkgPSBSZXNvdXJjZUhlbHBlci5nZXRVUkwoKSArIHNlbGZSZXNvdXJjZTtcclxuICAgICAgICBjb25zdCBwYXlsb2FkID0gUmVzb3VyY2VIZWxwZXIucmVzb2x2ZVJlbGF0aW9ucyhlbnRpdHkpO1xyXG5cclxuICAgICAgICB0aGlzLnNldFVybHNSZXNvdXJjZShlbnRpdHkpO1xyXG4gICAgICAgIGxldCBvYnNlcnZhYmxlID0gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLnBvc3QodXJpLCBwYXlsb2FkLCB7IGhlYWRlcnM6IFJlc291cmNlSGVscGVyLmhlYWRlcnMsIG9ic2VydmU6ICdyZXNwb25zZScgfSk7XHJcbiAgICAgICAgcmV0dXJuIG9ic2VydmFibGUucGlwZShtYXAoKHJlc3BvbnNlOiBIdHRwUmVzcG9uc2U8c3RyaW5nPikgPT4ge1xyXG4gICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID49IDIwMCAmJiByZXNwb25zZS5zdGF0dXMgPD0gMjA3KVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLmluc3RhbnRpYXRlUmVzb3VyY2UoZW50aXR5LCByZXNwb25zZS5ib2R5KTtcclxuICAgICAgICAgICAgZWxzZSBpZiAocmVzcG9uc2Uuc3RhdHVzID09IDUwMCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGJvZHk6IGFueSA9IHJlc3BvbnNlLmJvZHk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZVRocm93RXJyb3IoYm9keS5lcnJvcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KSwgY2F0Y2hFcnJvcihlcnJvciA9PiBvYnNlcnZhYmxlVGhyb3dFcnJvcihlcnJvcikpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogdXBkYXRlIHJlc291cmNlIGZyb20gYSBnaXZlbiBlbnRpdHkgZGF0YSovXHJcbiAgICBwdWJsaWMgdXBkYXRlPFQgZXh0ZW5kcyBSZXNvdXJjZT4oZW50aXR5OiBUKSB7XHJcbiAgICAgICAgY29uc3QgdXJpID0gUmVzb3VyY2VIZWxwZXIuZ2V0UHJveHkoZW50aXR5Ll9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICAgICAgIGNvbnN0IHBheWxvYWQgPSBSZXNvdXJjZUhlbHBlci5yZXNvbHZlUmVsYXRpb25zKGVudGl0eSk7XHJcbiAgICAgICAgdGhpcy5zZXRVcmxzUmVzb3VyY2UoZW50aXR5KTtcclxuICAgICAgICBsZXQgb2JzZXJ2YWJsZSA9IFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5wdXQodXJpLCBwYXlsb2FkLCB7IGhlYWRlcnM6IFJlc291cmNlSGVscGVyLmhlYWRlcnMsIG9ic2VydmU6ICdyZXNwb25zZScgfSk7XHJcbiAgICAgICAgcmV0dXJuIG9ic2VydmFibGUucGlwZShtYXAoKHJlc3BvbnNlOiBIdHRwUmVzcG9uc2U8c3RyaW5nPikgPT4ge1xyXG4gICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID49IDIwMCAmJiByZXNwb25zZS5zdGF0dXMgPD0gMjA3KVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLmluc3RhbnRpYXRlUmVzb3VyY2UoZW50aXR5LCByZXNwb25zZS5ib2R5KTtcclxuICAgICAgICAgICAgZWxzZSBpZiAocmVzcG9uc2Uuc3RhdHVzID09IDUwMCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGJvZHk6IGFueSA9IHJlc3BvbnNlLmJvZHk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZVRocm93RXJyb3IoYm9keS5lcnJvcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KSwgY2F0Y2hFcnJvcihlcnJvciA9PiBvYnNlcnZhYmxlVGhyb3dFcnJvcihlcnJvcikpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogdXBkYXRlIHJlc291cmNlIGZyb20gYSBnaXZlbiBlbnRpdHkgZGF0YSovXHJcbiAgICBwdWJsaWMgdXBkYXRlQ29sbGVjdGlvbjxUIGV4dGVuZHMgUmVzb3VyY2U+KHJlc291cmNlQXJyYXk6IFJlc291cmNlQXJyYXk8VD4sIHJlc291cmNlTGluazogc3RyaW5nKSB7XHJcbiAgICAgICAgY29uc3QgdXJpID0gUmVzb3VyY2VIZWxwZXIuZ2V0UHJveHkocmVzb3VyY2VMaW5rKTtcclxuICAgICAgICAvL2NvbnN0IHBheWxvYWQgPSBSZXNvdXJjZUhlbHBlci5yZXNvbHZlUmVsYXRpb25zKGVudGl0eSk7XHJcbiAgICAgICAgLy90aGlzLnNldFVybHNSZXNvdXJjZShlbnRpdHkpO1xyXG4gICAgICAgIHZhciBoZWFkZXJzUmVxID0gUmVzb3VyY2VIZWxwZXIuaGVhZGVycztcclxuICAgICAgICBoZWFkZXJzUmVxLnNldChcIkNvbnRlbnQtVHlwZVwiLCBcInRleHQvdXJpLWxpc3RcIik7XHJcbiAgICAgICAgbGV0IG9ic2VydmFibGUgPSBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkucHV0KHVyaSwgcmVzb3VyY2VBcnJheSwgeyBoZWFkZXJzOiBoZWFkZXJzUmVxLCBvYnNlcnZlOiAncmVzcG9uc2UnIH0pO1xyXG4gICAgICAgIHJldHVybiBvYnNlcnZhYmxlLnBpcGUobWFwKChyZXNwb25zZTogSHR0cFJlc3BvbnNlPHN0cmluZz4pID0+IHtcclxuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA+PSAyMDAgJiYgcmVzcG9uc2Uuc3RhdHVzIDw9IDIwNylcclxuICAgICAgICAgICAgICAgIHJldHVybiBcIlwiO1xyXG4gICAgICAgICAgICBlbHNlIGlmIChyZXNwb25zZS5zdGF0dXMgPT0gNTAwKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgYm9keTogYW55ID0gcmVzcG9uc2UuYm9keTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBvYnNlcnZhYmxlVGhyb3dFcnJvcihib2R5LmVycm9yKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pLCBjYXRjaEVycm9yKGVycm9yID0+IG9ic2VydmFibGVUaHJvd0Vycm9yKGVycm9yKSkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBwYXRjaCByZXNvdXJjZSBmcm9tIGEgZ2l2ZW4gZW50aXR5IGRhdGEqL1xyXG4gICAgcHVibGljIHBhdGNoPFQgZXh0ZW5kcyBSZXNvdXJjZT4oZW50aXR5OiBUKSB7XHJcbiAgICAgICAgY29uc3QgdXJpID0gUmVzb3VyY2VIZWxwZXIuZ2V0UHJveHkoZW50aXR5Ll9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICAgICAgIGNvbnN0IHBheWxvYWQgPSBSZXNvdXJjZUhlbHBlci5yZXNvbHZlUmVsYXRpb25zKGVudGl0eSk7XHJcbiAgICAgICAgdGhpcy5zZXRVcmxzUmVzb3VyY2UoZW50aXR5KTtcclxuICAgICAgICBsZXQgb2JzZXJ2YWJsZSA9IFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5wYXRjaCh1cmksIHBheWxvYWQsIHsgaGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVycywgb2JzZXJ2ZTogJ3Jlc3BvbnNlJyB9KTtcclxuICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZS5waXBlKG1hcCgocmVzcG9uc2U6IEh0dHBSZXNwb25zZTxzdHJpbmc+KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPj0gMjAwICYmIHJlc3BvbnNlLnN0YXR1cyA8PSAyMDcpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gUmVzb3VyY2VIZWxwZXIuaW5zdGFudGlhdGVSZXNvdXJjZShlbnRpdHksIHJlc3BvbnNlLmJvZHkpO1xyXG4gICAgICAgICAgICBlbHNlIGlmIChyZXNwb25zZS5zdGF0dXMgPT0gNTAwKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgYm9keTogYW55ID0gcmVzcG9uc2UuYm9keTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBvYnNlcnZhYmxlVGhyb3dFcnJvcihib2R5LmVycm9yKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pLCBjYXRjaEVycm9yKGVycm9yID0+IG9ic2VydmFibGVUaHJvd0Vycm9yKGVycm9yKSkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBkZWxldGUgcmVzb3VyY2UgZnJvbSBhIGdpdmVuIGVudGl0eSBkYXRhKi9cclxuICAgIHB1YmxpYyBkZWxldGU8VCBleHRlbmRzIFJlc291cmNlPihlbnRpdHk6IFQpOiBPYnNlcnZhYmxlPE9iamVjdD4ge1xyXG4gICAgICAgIGNvbnN0IHVyaSA9IFJlc291cmNlSGVscGVyLmdldFByb3h5KGVudGl0eS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgICAgICByZXR1cm4gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLmRlbGV0ZSh1cmksIHsgaGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVycyB9KS5waXBlKGNhdGNoRXJyb3IoZXJyb3IgPT4gb2JzZXJ2YWJsZVRocm93RXJyb3IoZXJyb3IpKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHdoZXRoZXIgYSByZXNvdXJjZSBhcnJheSBoYXMgbmV4dCBwYWdlIG9mIHJlc3VsdHMqL1xyXG4gICAgcHVibGljIGhhc05leHQ8VCBleHRlbmRzIFJlc291cmNlPihyZXNvdXJjZUFycmF5OiBSZXNvdXJjZUFycmF5PFQ+KTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHJlc291cmNlQXJyYXkubmV4dF91cmkgIT0gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiB3aGV0aGVyIGEgcmVzb3VyY2UgYXJyYXkgaGFzIHByZXZpb3VzIHBhZ2Ugb2YgcmVzdWx0cyovXHJcbiAgICBwdWJsaWMgaGFzUHJldjxUIGV4dGVuZHMgUmVzb3VyY2U+KHJlc291cmNlQXJyYXk6IFJlc291cmNlQXJyYXk8VD4pOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gcmVzb3VyY2VBcnJheS5wcmV2X3VyaSAhPSB1bmRlZmluZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHdoZXRoZXIgYSByZXNvdXJjZSBhcnJheSBoYXMgZmlyc3QgcGFnZSBvZiByZXN1bHRzKi9cclxuICAgIHB1YmxpYyBoYXNGaXJzdDxUIGV4dGVuZHMgUmVzb3VyY2U+KHJlc291cmNlQXJyYXk6IFJlc291cmNlQXJyYXk8VD4pOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gcmVzb3VyY2VBcnJheS5maXJzdF91cmkgIT0gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiB3aGV0aGVyIGEgcmVzb3VyY2UgYXJyYXkgaGFzIGxhc3QgcGFnZSBvZiByZXN1bHRzKi9cclxuICAgIHB1YmxpYyBoYXNMYXN0PFQgZXh0ZW5kcyBSZXNvdXJjZT4ocmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPik6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiByZXNvdXJjZUFycmF5Lmxhc3RfdXJpICE9IHVuZGVmaW5lZDtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHJlc291cmNlIGFycmF5IG5leHQgcGFnZSBvZiByZXN1bHRzKi9cclxuICAgIHB1YmxpYyBuZXh0PFQgZXh0ZW5kcyBSZXNvdXJjZT4ocmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPiwgdHlwZTogeyBuZXcoKTogVCB9KTogT2JzZXJ2YWJsZTxSZXNvdXJjZUFycmF5PFQ+PiB7XHJcbiAgICAgICAgcmV0dXJuIHJlc291cmNlQXJyYXkubmV4dCh0eXBlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHJlc291cmNlIGFycmF5IHByZXZpb3VzIHBhZ2Ugb2YgcmVzdWx0cyovXHJcbiAgICBwdWJsaWMgcHJldjxUIGV4dGVuZHMgUmVzb3VyY2U+KHJlc291cmNlQXJyYXk6IFJlc291cmNlQXJyYXk8VD4sIHR5cGU6IHsgbmV3KCk6IFQgfSk6IE9ic2VydmFibGU8UmVzb3VyY2VBcnJheTxUPj4ge1xyXG4gICAgICAgIHJldHVybiByZXNvdXJjZUFycmF5LnByZXYodHlwZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBhcnJheSBmaXJzdCBwYWdlIG9mIHJlc3VsdHMqL1xyXG4gICAgcHVibGljIGZpcnN0PFQgZXh0ZW5kcyBSZXNvdXJjZT4ocmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPiwgdHlwZTogeyBuZXcoKTogVCB9KTogT2JzZXJ2YWJsZTxSZXNvdXJjZUFycmF5PFQ+PiB7XHJcbiAgICAgICAgcmV0dXJuIHJlc291cmNlQXJyYXkuZmlyc3QodHlwZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBhcnJheSBsYXN0IHBhZ2Ugb2YgcmVzdWx0cyovXHJcbiAgICBwdWJsaWMgbGFzdDxUIGV4dGVuZHMgUmVzb3VyY2U+KHJlc291cmNlQXJyYXk6IFJlc291cmNlQXJyYXk8VD4sIHR5cGU6IHsgbmV3KCk6IFQgfSk6IE9ic2VydmFibGU8UmVzb3VyY2VBcnJheTxUPj4ge1xyXG4gICAgICAgIHJldHVybiByZXNvdXJjZUFycmF5Lmxhc3QodHlwZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBhcnJheSBwYWdlIG9mIHJlc3VsdHMgZ2l2ZW4gYSBwYWdlIG51bWJlciovXHJcbiAgICBwdWJsaWMgcGFnZTxUIGV4dGVuZHMgUmVzb3VyY2U+KHJlc291cmNlQXJyYXk6IFJlc291cmNlQXJyYXk8VD4sIHR5cGU6IHsgbmV3KCk6IFQgfSwgaWQ6IG51bWJlcik6IE9ic2VydmFibGU8UmVzb3VyY2VBcnJheTxUPj4ge1xyXG4gICAgICAgIHJldHVybiByZXNvdXJjZUFycmF5LnBhZ2UodHlwZSwgaWQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBzb3J0IHJlc291cmNlIGFycmF5IHdpdGggYSBnaXZlbiBzb3J0aW5nIHBhcmFtcyAqL1xyXG4gICAgcHVibGljIHNvcnRFbGVtZW50czxUIGV4dGVuZHMgUmVzb3VyY2U+KHJlc291cmNlQXJyYXk6IFJlc291cmNlQXJyYXk8VD4sIHR5cGU6IHsgbmV3KCk6IFQgfSwgLi4uc29ydDogU29ydFtdKTogT2JzZXJ2YWJsZTxSZXNvdXJjZUFycmF5PFQ+PiB7XHJcbiAgICAgICAgcmV0dXJuIHJlc291cmNlQXJyYXkuc29ydEVsZW1lbnRzKHR5cGUsIC4uLnNvcnQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgcmVzb3VyY2UgYXJyYXkgc2l6ZSovXHJcbiAgICBwdWJsaWMgc2l6ZTxUIGV4dGVuZHMgUmVzb3VyY2U+KHJlc291cmNlQXJyYXk6IFJlc291cmNlQXJyYXk8VD4sIHR5cGU6IHsgbmV3KCk6IFQgfSwgc2l6ZTogbnVtYmVyKTogT2JzZXJ2YWJsZTxSZXNvdXJjZUFycmF5PFQ+PiB7XHJcbiAgICAgICAgcmV0dXJuIHJlc291cmNlQXJyYXkuc2l6ZSh0eXBlLCBzaXplKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHJlc291cmNlIFVSTCBmcm9tIGEgZ2l2ZW4gcGF0aCovXHJcbiAgICBwdWJsaWMgZ2V0UmVzb3VyY2VVcmwocmVzb3VyY2U/OiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgIGxldCB1cmwgPSBSZXNvdXJjZVNlcnZpY2UuZ2V0VVJMKCk7XHJcbiAgICAgICAgaWYgKCF1cmwuZW5kc1dpdGgoJy8nKSkge1xyXG4gICAgICAgICAgICB1cmwgPSB1cmwuY29uY2F0KCcvJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChyZXNvdXJjZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdXJsLmNvbmNhdChyZXNvdXJjZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB1cmw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHNldCBwcm94eSBhbmQgcm9vdCB1cmxzIG9mIGdpdmVuIHJlc291cmNlIGFycmF5ICovXHJcbiAgICBwcml2YXRlIHNldFVybHM8VCBleHRlbmRzIFJlc291cmNlPihyZXN1bHQ6IFJlc291cmNlQXJyYXk8VD4pIHtcclxuICAgICAgICByZXN1bHQucHJveHlVcmwgPSB0aGlzLmV4dGVybmFsU2VydmljZS5nZXRQcm94eVVyaSgpO1xyXG4gICAgICAgIHJlc3VsdC5yb290VXJsID0gdGhpcy5leHRlcm5hbFNlcnZpY2UuZ2V0Um9vdFVyaSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBzZXQgcHJveHkgYW5kIHJvb3QgdXJscyBvZiBnaXZlbiByZXNvdXJjZSAqL1xyXG4gICAgcHJpdmF0ZSBzZXRVcmxzUmVzb3VyY2U8VCBleHRlbmRzIFJlc291cmNlPihyZXN1bHQ6IFQpIHtcclxuICAgICAgICByZXN1bHQucHJveHlVcmwgPSB0aGlzLmV4dGVybmFsU2VydmljZS5nZXRQcm94eVVyaSgpO1xyXG4gICAgICAgIHJlc3VsdC5yb290VXJsID0gdGhpcy5leHRlcm5hbFNlcnZpY2UuZ2V0Um9vdFVyaSgpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7b2YgYXMgb2JzZXJ2YWJsZU9mLCB0aHJvd0Vycm9yIGFzIG9ic2VydmFibGVUaHJvd0Vycm9yfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHttYXAsIG1lcmdlTWFwfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcbmltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4vcmVzb3VyY2UnO1xyXG5pbXBvcnQge1Jlc291cmNlQXJyYXl9IGZyb20gJy4vcmVzb3VyY2UtYXJyYXknO1xyXG5pbXBvcnQge1NvcnR9IGZyb20gJy4vc29ydCc7XHJcbmltcG9ydCB7UmVzb3VyY2VTZXJ2aWNlfSBmcm9tICcuL3Jlc291cmNlLnNlcnZpY2UnO1xyXG5pbXBvcnQge1N1YlR5cGVCdWlsZGVyfSBmcm9tICcuL3N1YnR5cGUtYnVpbGRlcic7XHJcbmltcG9ydCB7aXNOdWxsT3JVbmRlZmluZWR9IGZyb20gJ3V0aWwnO1xyXG5pbXBvcnQge09ic2VydmFibGV9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge0luamVjdG9yfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xyXG5cclxuLyoqIEhBTCBwYXJhbSBkYXRhIG1vZGVsICovXHJcbmV4cG9ydCB0eXBlIEhhbFBhcmFtID0geyBrZXk6IHN0cmluZywgdmFsdWU6IHN0cmluZyB8IG51bWJlciB8IGJvb2xlYW4gfTtcclxuLyoqIEhBTCBvcHRpb24gZGF0YSBtb2RlbCAqL1xyXG5leHBvcnQgdHlwZSBIYWxPcHRpb25zID0geyBub3RQYWdlZD86IGJvb2xlYW4sIHNpemU/OiBudW1iZXIsIHNvcnQ/OiBTb3J0W10sIHBhcmFtcz86IEhhbFBhcmFtW10gfTtcclxuXHJcbi8qKiBSRVNUIEFQSSBhY2Nlc3MgaW50ZXJmYWNlICovXHJcbmV4cG9ydCBjbGFzcyBSZXN0U2VydmljZTxUIGV4dGVuZHMgUmVzb3VyY2U+IHtcclxuICAgIC8qKiByZXNvdXJjZSB0eXBlICovXHJcbiAgICBwcml2YXRlIHR5cGU6IGFueTtcclxuICAgIC8qKiByZXNvdXJjZSBwYXRoICovXHJcbiAgICBwcml2YXRlIHJlc291cmNlOiBzdHJpbmc7XHJcbiAgICAvKiogcmVzb3VyY2UgYXJyYXkgKi9cclxuICAgIHB1YmxpYyByZXNvdXJjZUFycmF5OiBSZXNvdXJjZUFycmF5PFQ+O1xyXG4gICAgLyoqIHJlc291cmNlIHNlcnZpY2UgKi9cclxuICAgIHB1YmxpYyByZXNvdXJjZVNlcnZpY2U6IFJlc291cmNlU2VydmljZTtcclxuICAgIC8qKiBfZW1iZWRkZWQgZmllbGQgbmFtZSAqL1xyXG4gICAgcHJpdmF0ZSBfZW1iZWRkZWQ6IHN0cmluZyA9ICdfZW1iZWRkZWQnO1xyXG5cclxuICAgIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gICAgY29uc3RydWN0b3IodHlwZTogeyBuZXcoKTogVCB9LFxyXG4gICAgICAgICAgICAgICAgcmVzb3VyY2U6IHN0cmluZyxcclxuICAgICAgICAgICAgICAgIHByaXZhdGUgaW5qZWN0b3I6IEluamVjdG9yLFxyXG4gICAgICAgICAgICAgICAgX2VtYmVkZGVkPzogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy50eXBlID0gdHlwZTtcclxuICAgICAgICB0aGlzLnJlc291cmNlID0gcmVzb3VyY2U7XHJcbiAgICAgICAgdGhpcy5yZXNvdXJjZVNlcnZpY2UgPSBpbmplY3Rvci5nZXQoUmVzb3VyY2VTZXJ2aWNlKTtcclxuICAgICAgICBpZiAoIWlzTnVsbE9yVW5kZWZpbmVkKF9lbWJlZGRlZCkpXHJcbiAgICAgICAgICAgIHRoaXMuX2VtYmVkZGVkID0gX2VtYmVkZGVkO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBlcnJvciBoYW5kbGVyICovXHJcbiAgICBwcm90ZWN0ZWQgaGFuZGxlRXJyb3IoZXJyb3I6IGFueSk6T2JzZXJ2YWJsZTxuZXZlcj4ge1xyXG4gICAgICAgIHJldHVybiBSZXN0U2VydmljZS5oYW5kbGVFcnJvcihlcnJvcik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGVycm9yIGhhbmRsZXIgKi9cclxuICAgIHByb3RlY3RlZCBzdGF0aWMgaGFuZGxlRXJyb3IoZXJyb3I6IGFueSk6T2JzZXJ2YWJsZTxuZXZlcj4ge1xyXG4gICAgICAgIHJldHVybiBvYnNlcnZhYmxlVGhyb3dFcnJvcihlcnJvcik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCBhbGwgcmVzb3VyY2VzIHdpdGggb3B0aW9uYWwgb3B0aW9ucyBhbiBzdWJUeXBlIHBhcmFtcyAqL1xyXG4gICAgcHVibGljIGdldEFsbChvcHRpb25zPzogSGFsT3B0aW9ucywgc3ViVHlwZT86IFN1YlR5cGVCdWlsZGVyLCBlbWJlZGRlZE5hbWU/OlN0cmluZywgaWdub3JlUHJvamVjdGlvbj86Ym9vbGVhbik6IE9ic2VydmFibGU8VFtdPiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldEFsbCh0aGlzLnR5cGUsIHRoaXMucmVzb3VyY2UsIHRoaXMuX2VtYmVkZGVkLCBvcHRpb25zLCBzdWJUeXBlLGVtYmVkZGVkTmFtZSwgaWdub3JlUHJvamVjdGlvbikucGlwZShcclxuICAgICAgICAgICAgbWVyZ2VNYXAoKHJlc291cmNlQXJyYXk6IFJlc291cmNlQXJyYXk8VD4pID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMubm90UGFnZWQgJiYgIWlzTnVsbE9yVW5kZWZpbmVkKHJlc291cmNlQXJyYXkuZmlyc3RfdXJpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMubm90UGFnZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLnNpemUgPSByZXNvdXJjZUFycmF5LnRvdGFsRWxlbWVudHM7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0QWxsKG9wdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlc291cmNlQXJyYXkgPSByZXNvdXJjZUFycmF5O1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvYnNlcnZhYmxlT2YocmVzb3VyY2VBcnJheS5yZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBmcm9tIGEgZ2l2ZW4gaWQgKi9cclxuICAgIHB1YmxpYyBnZXQoaWQ6IGFueSk6IE9ic2VydmFibGU8VD4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5nZXQodGhpcy50eXBlLCB0aGlzLnJlc291cmNlLCBpZCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBmcm9tIHNlbGYgbGluayAqL1xyXG4gICAgcHVibGljIGdldEJ5U2VsZkxpbmsoc2VsZkxpbms6IHN0cmluZyk6IE9ic2VydmFibGU8VD4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5nZXRCeVNlbGZMaW5rKHRoaXMudHlwZSwgc2VsZkxpbmspO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBzZWFyY2ggcmVzb3VyY2VzIGZyb20gYSBnaXZlbiBxdWVyeSBzdHJpbmcgYW5kIG9wdGlvbmFsIG9wdGlvbnMgcGFyYW1zICovXHJcbiAgICBwdWJsaWMgc2VhcmNoKHF1ZXJ5OiBzdHJpbmcsIG9wdGlvbnM/OiBIYWxPcHRpb25zKTogT2JzZXJ2YWJsZTxUW10+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZVNlcnZpY2Uuc2VhcmNoKHRoaXMudHlwZSwgcXVlcnksIHRoaXMucmVzb3VyY2UsIHRoaXMuX2VtYmVkZGVkLCBvcHRpb25zKS5waXBlKFxyXG4gICAgICAgICAgICBtZXJnZU1hcCgocmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPikgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5ub3RQYWdlZCAmJiAhaXNOdWxsT3JVbmRlZmluZWQocmVzb3VyY2VBcnJheS5maXJzdF91cmkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5ub3RQYWdlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuc2l6ZSA9IHJlc291cmNlQXJyYXkudG90YWxFbGVtZW50cztcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zZWFyY2gocXVlcnksIG9wdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlc291cmNlQXJyYXkgPSByZXNvdXJjZUFycmF5O1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvYnNlcnZhYmxlT2YocmVzb3VyY2VBcnJheS5yZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHNlYXJjaCByZXNvdXJjZSBmcm9tIGEgZ2l2ZW4gcXVlcnkgc3RyaW5nIGFuZCBvcHRpb25hbCBvcHRpb25zIHBhcmFtcyAqL1xyXG4gICAgcHVibGljIHNlYXJjaFNpbmdsZShxdWVyeTogc3RyaW5nLCBvcHRpb25zPzogSGFsT3B0aW9ucyk6IE9ic2VydmFibGU8VD4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5zZWFyY2hTaW5nbGUodGhpcy50eXBlLCBxdWVyeSwgdGhpcy5yZXNvdXJjZSwgb3B0aW9ucyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHNlYXJjaCByZXNvdXJjZXMgZnJvbSBhIGdpdmVuIGN1c3RvbSBxdWVyeSBzdHJpbmcgYW5kIG9wdGlvbmFsIG9wdGlvbnMgcGFyYW1zICovXHJcbiAgICBwdWJsaWMgY3VzdG9tUXVlcnkocXVlcnk6IHN0cmluZywgb3B0aW9ucz86IEhhbE9wdGlvbnMpOiBPYnNlcnZhYmxlPFRbXT4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5jdXN0b21RdWVyeSh0aGlzLnR5cGUsIHF1ZXJ5LCB0aGlzLnJlc291cmNlLCB0aGlzLl9lbWJlZGRlZCwgb3B0aW9ucykucGlwZShcclxuICAgICAgICAgICAgbWVyZ2VNYXAoKHJlc291cmNlQXJyYXk6IFJlc291cmNlQXJyYXk8VD4pID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMubm90UGFnZWQgJiYgIWlzTnVsbE9yVW5kZWZpbmVkKHJlc291cmNlQXJyYXkuZmlyc3RfdXJpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMubm90UGFnZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLnNpemUgPSByZXNvdXJjZUFycmF5LnRvdGFsRWxlbWVudHM7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3VzdG9tUXVlcnkocXVlcnksIG9wdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlc291cmNlQXJyYXkgPSByZXNvdXJjZUFycmF5O1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvYnNlcnZhYmxlT2YocmVzb3VyY2VBcnJheS5yZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KSk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKiBnZXQgcmVzb3VyY2UgYXJyYXkgZ2l2ZW4gYSByZWxhdGlvbiBsaW5rICovXHJcbiAgICBwdWJsaWMgZ2V0QnlSZWxhdGlvbkFycmF5KHJlbGF0aW9uOiBzdHJpbmcsIGJ1aWxkZXI/OiBTdWJUeXBlQnVpbGRlcik6IE9ic2VydmFibGU8VFtdPiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldEJ5UmVsYXRpb25BcnJheSh0aGlzLnR5cGUsIHJlbGF0aW9uLCB0aGlzLl9lbWJlZGRlZCwgYnVpbGRlcikucGlwZShcclxuICAgICAgICAgICAgbWFwKChyZXNvdXJjZUFycmF5OiBSZXNvdXJjZUFycmF5PFQ+KSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlc291cmNlQXJyYXkgPSByZXNvdXJjZUFycmF5O1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc291cmNlQXJyYXkucmVzdWx0O1xyXG4gICAgICAgICAgICB9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBnaXZlbiBhIHJlbGF0aW9uIGxpbmsgKi9cclxuICAgIHB1YmxpYyBnZXRCeVJlbGF0aW9uKHJlbGF0aW9uOiBzdHJpbmcpOiBPYnNlcnZhYmxlPFQ+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0QnlSZWxhdGlvbih0aGlzLnR5cGUsIHJlbGF0aW9uKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogY291bnQgcmVzb3VyY2VzIGdpdmVuIGEgcGF0aCAqL1xyXG4gICAgcHVibGljIGNvdW50KCk6IE9ic2VydmFibGU8bnVtYmVyPiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLmNvdW50KHRoaXMucmVzb3VyY2UpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBjcmVhdGUgcmVzb3VyY2UgZnJvbSBzZWxmIGxpbmsgYW5kIGVudGl0eSBkYXRhKi9cclxuICAgIHB1YmxpYyBjcmVhdGUoZW50aXR5OiBUKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLmNyZWF0ZSh0aGlzLnJlc291cmNlLCBlbnRpdHkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiB1cGRhdGUgcmVzb3VyY2UgZnJvbSBhIGdpdmVuIGVudGl0eSBkYXRhKi9cclxuICAgIHB1YmxpYyB1cGRhdGUoZW50aXR5OiBUKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLnVwZGF0ZShlbnRpdHkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBwYXRjaCByZXNvdXJjZSBmcm9tIGEgZ2l2ZW4gZW50aXR5IGRhdGEqL1xyXG4gICAgcHVibGljIHBhdGNoKGVudGl0eTogVCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5wYXRjaChlbnRpdHkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBkZWxldGUgcmVzb3VyY2UgZnJvbSBhIGdpdmVuIGVudGl0eSBkYXRhKi9cclxuICAgIHB1YmxpYyBkZWxldGUoZW50aXR5OiBUKTogT2JzZXJ2YWJsZTxPYmplY3Q+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZVNlcnZpY2UuZGVsZXRlKGVudGl0eSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCB0b3RhbCBudW1iZXIgb2YgZWxlbWVudHMgb2YgcmVzb3VyY2UgYXJyYXkgKi9cclxuICAgIHB1YmxpYyB0b3RhbEVsZW1lbnQoKTogbnVtYmVyIHtcclxuICAgICAgICBpZiAodGhpcy5yZXNvdXJjZUFycmF5ICYmIHRoaXMucmVzb3VyY2VBcnJheS50b3RhbEVsZW1lbnRzKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZUFycmF5LnRvdGFsRWxlbWVudHM7XHJcbiAgICAgICAgcmV0dXJuIDA7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHdoZXRoZXIgYSByZXNvdXJjZSBhcnJheSBoYXMgZmlyc3QgcGFnZSBvZiByZXN1bHRzKi9cclxuICAgIHB1YmxpYyBoYXNGaXJzdCgpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAodGhpcy5yZXNvdXJjZUFycmF5KVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZVNlcnZpY2UuaGFzRmlyc3QodGhpcy5yZXNvdXJjZUFycmF5KTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHdoZXRoZXIgYSByZXNvdXJjZSBhcnJheSBoYXMgbmV4dCBwYWdlIG9mIHJlc3VsdHMqL1xyXG4gICAgcHVibGljIGhhc05leHQoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKHRoaXMucmVzb3VyY2VBcnJheSlcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLmhhc05leHQodGhpcy5yZXNvdXJjZUFycmF5KTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHdoZXRoZXIgYSByZXNvdXJjZSBhcnJheSBoYXMgcHJldmlvdXMgcGFnZSBvZiByZXN1bHRzKi9cclxuICAgIHB1YmxpYyBoYXNQcmV2KCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICh0aGlzLnJlc291cmNlQXJyYXkpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5oYXNQcmV2KHRoaXMucmVzb3VyY2VBcnJheSk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiB3aGV0aGVyIGEgcmVzb3VyY2UgYXJyYXkgaGFzIGxhc3QgcGFnZSBvZiByZXN1bHRzKi9cclxuICAgIHB1YmxpYyBoYXNMYXN0KCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICh0aGlzLnJlc291cmNlQXJyYXkpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5oYXNMYXN0KHRoaXMucmVzb3VyY2VBcnJheSk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgcmVzb3VyY2UgYXJyYXkgbmV4dCBwYWdlIG9mIHJlc3VsdHMqL1xyXG4gICAgcHVibGljIG5leHQoKTogT2JzZXJ2YWJsZTxUW10+IHtcclxuICAgICAgICBpZiAodGhpcy5yZXNvdXJjZUFycmF5KVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZVNlcnZpY2UubmV4dCh0aGlzLnJlc291cmNlQXJyYXksIHRoaXMudHlwZSkucGlwZShcclxuICAgICAgICAgICAgICAgIG1hcCgocmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVzb3VyY2VBcnJheSA9IHJlc291cmNlQXJyYXk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc291cmNlQXJyYXkucmVzdWx0O1xyXG4gICAgICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgb2JzZXJ2YWJsZVRocm93RXJyb3IoJ25vIHJlc291cmNlQXJyYXkgZm91bmQnKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHJlc291cmNlIGFycmF5IHByZXZpb3VzIHBhZ2Ugb2YgcmVzdWx0cyovXHJcbiAgICBwdWJsaWMgcHJldigpOiBPYnNlcnZhYmxlPFRbXT4ge1xyXG4gICAgICAgIGlmICh0aGlzLnJlc291cmNlQXJyYXkpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5wcmV2KHRoaXMucmVzb3VyY2VBcnJheSwgdGhpcy50eXBlKS5waXBlKFxyXG4gICAgICAgICAgICAgICAgbWFwKChyZXNvdXJjZUFycmF5OiBSZXNvdXJjZUFycmF5PFQ+KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXNvdXJjZUFycmF5ID0gcmVzb3VyY2VBcnJheTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzb3VyY2VBcnJheS5yZXN1bHQ7XHJcbiAgICAgICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBvYnNlcnZhYmxlVGhyb3dFcnJvcignbm8gcmVzb3VyY2VBcnJheSBmb3VuZCcpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgcmVzb3VyY2UgYXJyYXkgZmlyc3QgcGFnZSBvZiByZXN1bHRzKi9cclxuICAgIHB1YmxpYyBmaXJzdCgpOiBPYnNlcnZhYmxlPFRbXT4ge1xyXG4gICAgICAgIGlmICh0aGlzLnJlc291cmNlQXJyYXkpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5maXJzdCh0aGlzLnJlc291cmNlQXJyYXksIHRoaXMudHlwZSlcclxuICAgICAgICAgICAgICAgIC5waXBlKFxyXG4gICAgICAgICAgICAgICAgICAgIG1hcCgocmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlc291cmNlQXJyYXkgPSByZXNvdXJjZUFycmF5O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzb3VyY2VBcnJheS5yZXN1bHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBvYnNlcnZhYmxlVGhyb3dFcnJvcignbm8gcmVzb3VyY2VBcnJheSBmb3VuZCcpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgcmVzb3VyY2UgYXJyYXkgbGFzdCBwYWdlIG9mIHJlc3VsdHMqL1xyXG4gICAgcHVibGljIGxhc3QoKTogT2JzZXJ2YWJsZTxUW10+IHtcclxuICAgICAgICBpZiAodGhpcy5yZXNvdXJjZUFycmF5KVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZVNlcnZpY2UubGFzdCh0aGlzLnJlc291cmNlQXJyYXksIHRoaXMudHlwZSlcclxuICAgICAgICAgICAgICAgIC5waXBlKFxyXG4gICAgICAgICAgICAgICAgICAgIG1hcCgocmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlc291cmNlQXJyYXkgPSByZXNvdXJjZUFycmF5O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzb3VyY2VBcnJheS5yZXN1bHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBvYnNlcnZhYmxlVGhyb3dFcnJvcignbm8gcmVzb3VyY2VBcnJheSBmb3VuZCcpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgcmVzb3VyY2UgYXJyYXkgcGFnZSBvZiByZXN1bHRzIGdpdmVuIGEgcGFnZSBudW1iZXIqL1xyXG4gICAgcHVibGljIHBhZ2UocGFnZU51bWJlcjogbnVtYmVyKTogT2JzZXJ2YWJsZTxUW10+IHtcclxuICAgICAgICBpZiAodGhpcy5yZXNvdXJjZUFycmF5KVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZVNlcnZpY2UucGFnZSh0aGlzLnJlc291cmNlQXJyYXksIHRoaXMudHlwZSwgcGFnZU51bWJlcikucGlwZShcclxuICAgICAgICAgICAgICAgIG1hcCgocmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVzb3VyY2VBcnJheSA9IHJlc291cmNlQXJyYXk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc291cmNlQXJyYXkucmVzdWx0O1xyXG4gICAgICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgb2JzZXJ2YWJsZVRocm93RXJyb3IoJ25vIHJlc291cmNlQXJyYXkgZm91bmQnKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBVc2VyIH0gZnJvbSAnLi4vdXNlci91c2VyLm1vZGVsJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcblxyXG5cclxuLyoqIEFjY291bnQgbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIEFjY291bnRTZXJ2aWNlIGV4dGVuZHMgUmVzdFNlcnZpY2U8VXNlcj4ge1xyXG4gIFxyXG5cclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgQUNDT1VOVF9BUEkgPSAnYWNjb3VudCc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKFVzZXIsIFwiYWNjb3VudFwiLCBpbmplY3Rvcik7XHJcbiAgfVxyXG5cclxuICAvKiogZ2V0IGxvZ2dlZCBpbiB1c2VyIGFjY291bnQqL1xyXG4gIGdldCgpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgcmVzdWx0ID0gdGhpcy5odHRwLmdldCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLkFDQ09VTlRfQVBJKSk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBcclxuICAvKiogc2F2ZSBhY2NvdW50Ki9cclxuICBzYXZlKGl0ZW06IGFueSk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLkFDQ09VTlRfQVBJKSAsIGl0ZW0pO1xyXG5cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG5cclxuICAvKiogY2hhbmdlIGxvZ2dlZCBpbiB1c2VyIGFjY291bnQqLyAgXHJcbiAgY2hhbmdlUGFzc3dvcmQoaXRlbTogYW55KTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuQUNDT1VOVF9BUEkrXCIvY2hhbmdlLXBhc3N3b3JkXCIpICwgaXRlbSk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBcclxufVxyXG4iLCJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGV9IGZyb20gJ3J4anMtY29tcGF0JztcclxuaW1wb3J0IHtSZXNvdXJjZVNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2Uuc2VydmljZSc7XHJcbi8vaW1wb3J0ICogYXMgbW9tZW50IGZyb20gJ21vbWVudCc7XHJcblxyXG4vKiogQXV0aGVudGljYXRpb24gc2VydmljZSovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIEF1dGhTZXJ2aWNlIHtcclxuICAgIFxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBBVVRIX0FQSSA9ICdhdXRoZW50aWNhdGUnO1xyXG5cclxuICAgIC8qKiBjb25zdHJ1Y3RvciovXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQsXHJcbiAgICAgICAgcHJpdmF0ZSByZXNvdXJjZVNlcnZpY2U6IFJlc291cmNlU2VydmljZVxyXG4gICAgKSB7fVxyXG4gICAgXHJcbiAgICAvKiogZ2V0IGN1cnJlbnQgdXNlciBqd3QgdG9rZW4gZnJvbSBzZXNzaW9uIHN0b3JhZ2UqL1xyXG4gICAgZ2V0VG9rZW4oKSB7XHJcbiAgICAgICAgcmV0dXJuICBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdhdXRoZW50aWNhdGlvblRva2VuJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGxvZ2luIG9wZXJhdGlvbiAqL1xyXG4gICAgbG9naW4oY3JlZGVudGlhbHMpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG5cclxuICAgICAgICBjb25zdCBkYXRhID0ge1xyXG4gICAgICAgICAgICB1c2VybmFtZTogY3JlZGVudGlhbHMudXNlcm5hbWUsXHJcbiAgICAgICAgICAgIHBhc3N3b3JkOiBjcmVkZW50aWFscy5wYXNzd29yZFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuQVVUSF9BUEkpLCBkYXRhLCB7b2JzZXJ2ZSA6ICdyZXNwb25zZSd9KS5tYXAoYXV0aGVudGljYXRlU3VjY2Vzcy5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gYXV0aGVudGljYXRlU3VjY2VzcyhyZXNwKSB7XHJcbiAgICAgICAgICAgIGlmIChyZXNwLm9rKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBqd3QgPSByZXNwLmJvZHkuaWRfdG9rZW47XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0b3JlQXV0aGVudGljYXRpb25Ub2tlbihqd3QpO1xyXG4gICAgICAgICAgICAgICAgLy9jb25zdCBleHBpcmVzQXQgPSBtb21lbnQoKS5hZGQoIHJlc3AuaGVhZGVycy5nZXQoJ1Rva2VuLVZhbGlkaXR5JyksJ21pbGlzZWNvbmQnKTtcclxuICAgICAgICAgICAgICAgIC8vc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgnZXhwaXJlc19hdCcsIEpTT04uc3RyaW5naWZ5KGV4cGlyZXNBdC52YWx1ZU9mKCkpKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBqd3Q7XHJcbiAgICAgICAgICAgIH0gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoqIGxvZ2luIG9wZXJhdGlvbiB3aXRoIGp3dCB0b2tlbiAqL1xyXG4gICAgbG9naW5XaXRoVG9rZW4oand0KSB7XHJcbiAgICAgICAgaWYgKGp3dCkge1xyXG4gICAgICAgICAgICB0aGlzLnN0b3JlQXV0aGVudGljYXRpb25Ub2tlbihqd3QpO1xyXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGp3dCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KCdhdXRoLWp3dC1zZXJ2aWNlIFByb21pc2UgcmVqZWN0Jyk7IC8vIFB1dCBhcHByb3ByaWF0ZSBlcnJvciBtZXNzYWdlIGhlcmVcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHN0b3JlIGp3dCB0b2tlbiBpbiBzZXNzaW9uIHN0b3JhZ2UqL1xyXG4gICAgc3RvcmVBdXRoZW50aWNhdGlvblRva2VuKGp3dCkge1xyXG4gICAgICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgnYXV0aGVudGljYXRpb25Ub2tlbicsIGp3dCk7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKiBjaGVjayB3aGV0aGVyIGN1cnJlbnQgdXNlciBpcyBsb2dnZWQgaW4qL1xyXG4gICAgcHVibGljIGlzTG9nZ2VkSW4oKSB7XHJcbiAgICAgICAgLy9yZXR1cm4gbW9tZW50KCkuaXNCZWZvcmUodGhpcy5nZXRFeHBpcmF0aW9uKCkpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmdldFRva2VuKCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKiBjaGVjayB3aGV0aGVyIGN1cnJlbnQgdXNlciBpcyBsb2dnZWQgb3V0Ki9cclxuICAgIGlzTG9nZ2VkT3V0KCkge1xyXG4gICAgICAgIHJldHVybiAhdGhpcy5pc0xvZ2dlZEluKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGxvZ291dCBvcGVyYXRpb24gKi9cclxuICAgIGxvZ291dCgpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG5cclxuICAgICAgICByZXR1cm4gbmV3IE9ic2VydmFibGUoKG9ic2VydmVyKSA9PiB7XHJcbiAgICAgICAgICAgIC8vbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ2F1dGhlbnRpY2F0aW9uVG9rZW4nKTtcclxuICAgICAgICAgICAgc2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbSgnYXV0aGVudGljYXRpb25Ub2tlbicpO1xyXG4gICAgICAgICAgICAvL3Nlc3Npb25TdG9yYWdlLnJlbW92ZUl0ZW0oJ2V4cGlyZXNfYXQnKTtcclxuICAgICAgICAgICAgb2JzZXJ2ZXIuY29tcGxldGUoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgXHJcbn1cclxuIiwiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBIdHRwSW50ZXJjZXB0b3IsIEh0dHBSZXF1ZXN0LCBIdHRwSGFuZGxlciwgSHR0cEV2ZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5cclxuLyoqIEludGVyY2VwdG9yIGZvciBhdXRoZW50aWNhdGlvbiB0b2tlbiBpbiBBUEkgcmVxdWVzdHMgKi9cclxuZXhwb3J0IGNsYXNzIEF1dGhJbnRlcmNlcHRvciBpbXBsZW1lbnRzIEh0dHBJbnRlcmNlcHRvciB7XHJcblxyXG4gICAgLyoqIGNvbnN0cnVjdG9yKi9cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgKSB7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKiByZXF1ZXN0IGhhbmRsZXIgKi9cclxuICAgIGludGVyY2VwdChyZXF1ZXN0OiBIdHRwUmVxdWVzdDxhbnk+LCBuZXh0OiBIdHRwSGFuZGxlcik6IE9ic2VydmFibGU8SHR0cEV2ZW50PGFueT4+IHtcclxuICAgICAgICBpZiAoIXJlcXVlc3QgfHwgIXJlcXVlc3QudXJsIHx8ICEocmVxdWVzdC51cmwuaW5jbHVkZXMoXCIvYXBpL1wiKSkgKSB7XHJcbiAgICAgICAgICAgIHJlcXVlc3QuaGVhZGVycy5hcHBlbmQoJ0FjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbicsICcqJylcclxuICAgICAgICAgICAgcmV0dXJuIG5leHQuaGFuZGxlKHJlcXVlc3QpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCB0b2tlbiA9IHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ2F1dGhlbnRpY2F0aW9uVG9rZW4nKTtcclxuICAgICAgICBpZiAoISF0b2tlbikge1xyXG4gICAgICAgICAgICByZXF1ZXN0ID0gcmVxdWVzdC5jbG9uZSh7XHJcbiAgICAgICAgICAgICAgICBzZXRIZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgQXV0aG9yaXphdGlvbjogJ0JlYXJlciAnICsgdG9rZW5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuZXh0LmhhbmRsZShyZXF1ZXN0KTtcclxuICAgIH1cclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBTdWJqZWN0LCBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IEFjY291bnRTZXJ2aWNlIH0gZnJvbSAnLi4vYWNjb3VudC9hY2NvdW50LnNlcnZpY2UnO1xyXG5cclxuLyoqIFByaW5jaXBhbCBzZXJ2aWNlKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgUHJpbmNpcGFsIHtcclxuICAgIHByaXZhdGUgdXNlcklkZW50aXR5OiBhbnk7XHJcbiAgICBwcml2YXRlIGF1dGhlbnRpY2F0ZWQgPSBmYWxzZTtcclxuICAgIHByaXZhdGUgYXV0aGVudGljYXRpb25TdGF0ZSA9IG5ldyBTdWJqZWN0PGFueT4oKTtcclxuXHJcbiAgICAvKiogY29uc3RydWN0b3IgKi9cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHByaXZhdGUgYWNjb3VudDogQWNjb3VudFNlcnZpY2VcclxuICAgICkge31cclxuXHJcbiAgICAvKiogYXV0aGVudGljYXRlIHdpdGggZ2l2ZW4gaWRlbnRpdHkqL1xyXG4gICAgYXV0aGVudGljYXRlKGlkZW50aXR5KSB7XHJcbiAgICAgICAgdGhpcy51c2VySWRlbnRpdHkgPSBpZGVudGl0eTtcclxuICAgICAgICB0aGlzLmF1dGhlbnRpY2F0ZWQgPSBpZGVudGl0eSAhPT0gbnVsbDtcclxuICAgICAgICB0aGlzLmF1dGhlbnRpY2F0aW9uU3RhdGUubmV4dCh0aGlzLnVzZXJJZGVudGl0eSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGNoZWNrIHdoZXRoZXIgY3VycmVudCB1c2VyIGhhcyBhbnkgb2YgdGhlIGdpdmVuIGF1dGhvcml0aWVzICovXHJcbiAgICBoYXNBbnlBdXRob3JpdHkoYXV0aG9yaXRpZXM6IHN0cmluZ1tdKTogUHJvbWlzZTxib29sZWFuPiB7XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzLmhhc0FueUF1dGhvcml0eURpcmVjdChhdXRob3JpdGllcykpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBjaGVjayB3aGV0aGVyIGN1cnJlbnQgdXNlciBoYXMgYW55IG9mIHRoZSBnaXZlbiBhdXRob3JpdGllcyBvbiB0aGUgZ2l2ZW4gdGVycml0b3J5ICovXHJcbiAgICBoYXNBbnlBdXRob3JpdHlPblRlcnJpdG9yeShhdXRob3JpdGllczogc3RyaW5nW10sdGVycml0b3J5OiBzdHJpbmcgKTogUHJvbWlzZTxib29sZWFuPiB7XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzLmhhc0FueUF1dGhvcml0eURpcmVjdE9uVGVycml0b3J5KGF1dGhvcml0aWVzLHRlcnJpdG9yeSkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBjaGVjayB3aGV0aGVyIGN1cnJlbnQgdXNlciBoYXMgYW55IG9mIHRoZSBnaXZlbiBhdXRob3JpdGllcyB3aXRob3V0IHJlc29sdmluZyBwcm9taXNlcyovXHJcbiAgICBoYXNBbnlBdXRob3JpdHlEaXJlY3QoYXV0aG9yaXRpZXM6IHN0cmluZ1tdKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmF1dGhlbnRpY2F0ZWQgfHwgIXRoaXMudXNlcklkZW50aXR5IHx8ICF0aGlzLnVzZXJJZGVudGl0eS5hdXRob3JpdGllcykge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGF1dGhvcml0aWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnVzZXJJZGVudGl0eS5hdXRob3JpdGllcy5pbmNsdWRlcyhhdXRob3JpdGllc1tpXSkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGNoZWNrIHdoZXRoZXIgY3VycmVudCB1c2VyIGhhcyBhbnkgb2YgdGhlIGdpdmVuIGF1dGhvcml0aWVzIG9uIHRoZSBnaXZlbiB0ZXJyaXRvcnkgd2l0aG91dCByZXNvbHZpbmcgcHJvbWlzZXMgKi9cclxuICAgIGhhc0FueUF1dGhvcml0eURpcmVjdE9uVGVycml0b3J5KGF1dGhvcml0aWVzOiBzdHJpbmdbXSx0ZXJyaXRvcnk6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICghdGhpcy5hdXRoZW50aWNhdGVkIHx8ICF0aGlzLnVzZXJJZGVudGl0eSB8fCAhdGhpcy51c2VySWRlbnRpdHkuYXV0aG9yaXRpZXMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhdXRob3JpdGllcy5sZW5ndGg7IGkrKykge1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMudXNlcklkZW50aXR5LmF1dGhvcml0aWVzUGVyVGVycml0b3J5W3RlcnJpdG9yeV0gJiYgdGhpcy51c2VySWRlbnRpdHkuYXV0aG9yaXRpZXNQZXJUZXJyaXRvcnlbdGVycml0b3J5XS5pbmNsdWRlcyhhdXRob3JpdGllc1tpXSkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGNoZWNrIHdoZXRoZXIgY3VycmVudCB1c2VyIGhhcyB0aGUgZ2l2ZW4gYXV0aG9yaXR5ICovXHJcbiAgICBoYXNBdXRob3JpdHkoYXV0aG9yaXR5OiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+IHtcclxuICAgICAgICBpZiAoIXRoaXMuYXV0aGVudGljYXRlZCkge1xyXG4gICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoZmFsc2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaWRlbnRpdHkoKS50aGVuKChpZCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGlkLmF1dGhvcml0aWVzICYmIGlkLmF1dGhvcml0aWVzLmluY2x1ZGVzKGF1dGhvcml0eSkpO1xyXG4gICAgICAgIH0sICgpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShmYWxzZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGNoZWNrIHdoZXRoZXIgY3VycmVudCB1c2VyIGhhcyB0aGUgZ2l2ZW4gYXV0aG9yaXR5IG9uIHRoZSBnaXZlbiB0ZXJyaXRvcnkqL1xyXG4gICAgaGFzQXV0aG9yaXR5T25UZXJyaXRvcnkoYXV0aG9yaXR5OiBzdHJpbmcsdGVycml0b3J5OiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+IHtcclxuICAgICAgICBpZiAoIXRoaXMuYXV0aGVudGljYXRlZCkge1xyXG4gICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoZmFsc2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaWRlbnRpdHkoKS50aGVuKChpZCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGlkLmF1dGhvcml0aWVzUGVyVGVycml0b3J5ICYmIGlkLmF1dGhvcml0aWVzUGVyVGVycml0b3J5W3RlcnJpdG9yeV0gJiYgaWQuYXV0aG9yaXRpZXNQZXJUZXJyaXRvcnlbdGVycml0b3J5XS5pbmNsdWRlcyhhdXRob3JpdHkpKTtcclxuICAgICAgICB9LCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoZmFsc2UpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBjaGVjayB1c2VyIGlkZW50aXR5Ki9cclxuICAgIGlkZW50aXR5KGZvcmNlPzogYm9vbGVhbik6IFByb21pc2U8YW55PiB7XHJcbiAgICAgICAgaWYgKGZvcmNlID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIHRoaXMudXNlcklkZW50aXR5ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gY2hlY2sgYW5kIHNlZSBpZiB3ZSBoYXZlIHJldHJpZXZlZCB0aGUgdXNlcklkZW50aXR5IGRhdGEgZnJvbSB0aGUgc2VydmVyLlxyXG4gICAgICAgIC8vIGlmIHdlIGhhdmUsIHJldXNlIGl0IGJ5IGltbWVkaWF0ZWx5IHJlc29sdmluZ1xyXG4gICAgICAgIGlmICh0aGlzLnVzZXJJZGVudGl0eSkge1xyXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMudXNlcklkZW50aXR5KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHJldHJpZXZlIHRoZSB1c2VySWRlbnRpdHkgZGF0YSBmcm9tIHRoZSBzZXJ2ZXIsIHVwZGF0ZSB0aGUgaWRlbnRpdHkgb2JqZWN0LCBhbmQgdGhlbiByZXNvbHZlLlxyXG4gICAgICAgIHJldHVybiB0aGlzLmFjY291bnQuZ2V0KCkudG9Qcm9taXNlKCkudGhlbigocmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgYWNjb3VudCA9IHJlc3BvbnNlO1xyXG4gICAgICAgICAgICBpZiAoYWNjb3VudCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy51c2VySWRlbnRpdHkgPSBhY2NvdW50O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hdXRoZW50aWNhdGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudXNlcklkZW50aXR5ID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXV0aGVudGljYXRlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuYXV0aGVudGljYXRpb25TdGF0ZS5uZXh0KHRoaXMudXNlcklkZW50aXR5KTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudXNlcklkZW50aXR5O1xyXG4gICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcclxuICAgICAgICAgICAgdGhpcy51c2VySWRlbnRpdHkgPSBudWxsO1xyXG4gICAgICAgICAgICB0aGlzLmF1dGhlbnRpY2F0ZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5hdXRoZW50aWNhdGlvblN0YXRlLm5leHQodGhpcy51c2VySWRlbnRpdHkpO1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogY2hlY2sgd2hldGhlciBjdXJyZW50IHVzZXIgaXMgYXV0aGVudGljYXRlZCAqL1xyXG4gICAgaXNBdXRoZW50aWNhdGVkKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmF1dGhlbnRpY2F0ZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGNoZWNrIHdoZXRoZXIgY3VycmVudCB1c2VyIGlkZW50aXR5IGlzIHJlc29sdmVkICovXHJcbiAgICBpc0lkZW50aXR5UmVzb2x2ZWQoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudXNlcklkZW50aXR5ICE9PSB1bmRlZmluZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCBjdXJyZW50IHVzZXIgYXV0aGVudGljYXRpb24gc3RhdGUgKi9cclxuICAgIGdldEF1dGhlbnRpY2F0aW9uU3RhdGUoKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hdXRoZW50aWNhdGlvblN0YXRlLmFzT2JzZXJ2YWJsZSgpO1xyXG4gICAgfVxyXG5cclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgSW5qZWN0b3IsIEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cEludGVyY2VwdG9yLCBIdHRwUmVxdWVzdCwgSHR0cEhhbmRsZXIsIEh0dHBFdmVudCwgSHR0cEVycm9yUmVzcG9uc2UgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgQXV0aFNlcnZpY2UgfSBmcm9tICcuL2F1dGguc2VydmljZSc7XHJcbmltcG9ydCB7IEFjdGl2YXRlZFJvdXRlLCBSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xyXG5pbXBvcnQgeyBQcmluY2lwYWwgfSBmcm9tICcuL3ByaW5jaXBhbC5zZXJ2aWNlJztcclxuXHJcbi8qKiBJbnRlcmNlcHRvciBmb3IgYXV0aGVudGljYXRpb24gZXhwaXJlZCByZXNwb25zZSBpbiBBUEkgcmVxdWVzdHMgKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgQXV0aEV4cGlyZWRJbnRlcmNlcHRvciBpbXBsZW1lbnRzIEh0dHBJbnRlcmNlcHRvciB7XHJcblxyXG4gICAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBwcml2YXRlIHJvdXRlcjogUm91dGVyLCAgICAgXHJcbiAgICAgICAgcHJpdmF0ZSBhdXRoU2VydmljZTogQXV0aFNlcnZpY2UsIFxyXG4gICAgICAgIHByaXZhdGUgcHJpbmNpcGFsOiBQcmluY2lwYWxcclxuICAgICkge31cclxuXHJcbiAgICAvKiogcmVxdWVzdCBoYW5kbGVyICovXHJcbiAgICBpbnRlcmNlcHQocmVxdWVzdDogSHR0cFJlcXVlc3Q8YW55PiwgbmV4dDogSHR0cEhhbmRsZXIpOiBPYnNlcnZhYmxlPEh0dHBFdmVudDxhbnk+PiB7XHJcbiAgICAgICAgcmV0dXJuIG5leHQuaGFuZGxlKHJlcXVlc3QpLmRvKChldmVudDogSHR0cEV2ZW50PGFueT4pID0+IHt9LCAoZXJyOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgaW50ZXJjZXB0OiBib29sZWFuID0gcmVxdWVzdC51cmwuaW5kZXhPZihcIi9hcGkvXCIpICE9IC0xO1xyXG4gICAgICAgICAgICAvL3RyYWN0ZW0gcmVxdWVzdFxyXG4gICAgICAgICAgICBpZiAoaW50ZXJjZXB0KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZXJyIGluc3RhbmNlb2YgSHR0cEVycm9yUmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZXJyLnN0YXR1cyA9PT0gNDAxKSB7ICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hdXRoU2VydmljZS5sb2dvdXQoKS5zdWJzY3JpYmUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcmluY2lwYWwuYXV0aGVudGljYXRlKG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbJy8nXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBBdXRoU2VydmljZSB9IGZyb20gJy4vYXV0aC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgUHJpbmNpcGFsIH0gZnJvbSAnLi9wcmluY2lwYWwuc2VydmljZSc7XHJcblxyXG4vKiogTG9naW4gc2VydmljZSovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIExvZ2luU2VydmljZSB7XHJcbiAgICBcclxuICAgIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgcHJpdmF0ZSBhdXRoU2VydmVyUHJvdmlkZXI6IEF1dGhTZXJ2aWNlLCBcclxuICAgICAgICBwcml2YXRlIHByaW5jaXBhbDogUHJpbmNpcGFsXHJcbiAgICApIHt9XHJcblxyXG4gICAgLyoqTG9naW4gb3BlcmF0aW9uKi9cclxuICAgIGxvZ2luKGNyZWRlbnRpYWxzLCBjYWxsYmFjaz8pIHtcclxuICAgICAgICBjb25zdCBjYiA9IGNhbGxiYWNrIHx8IGZ1bmN0aW9uKCkge307XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuYXV0aFNlcnZlclByb3ZpZGVyLmxvZ2luKGNyZWRlbnRpYWxzKS5zdWJzY3JpYmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMucHJpbmNpcGFsLmlkZW50aXR5KHRydWUpLnRoZW4oKGFjY291bnQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBBZnRlciB0aGUgbG9naW4gdGhlIGxhbmd1YWdlIHdpbGwgYmUgY2hhbmdlZCB0b1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHRoZSBsYW5ndWFnZSBzZWxlY3RlZCBieSB0aGUgdXNlciBkdXJpbmcgaGlzIHJlZ2lzdHJhdGlvblxyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY2IoKTtcclxuICAgICAgICAgICAgfSwgKGVycikgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2dvdXQoKTtcclxuICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNiKGVycik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgLyoqbG9naW4gd2l0aCBqd3QgdG9rZW4gKi9cclxuICAgIGxvZ2luV2l0aFRva2VuKGp3dCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmF1dGhTZXJ2ZXJQcm92aWRlci5sb2dpbldpdGhUb2tlbihqd3QpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBsb2dvdXQgb3BlcmF0aW9uICovXHJcbiAgICBsb2dvdXQoKSB7XHJcbiAgICAgICB0aGlzLmF1dGhTZXJ2ZXJQcm92aWRlci5sb2dvdXQoKS5zdWJzY3JpYmUoKTtcclxuICAgICAgIHRoaXMucHJpbmNpcGFsLmF1dGhlbnRpY2F0ZShudWxsKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7UmVzb3VyY2VTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlLnNlcnZpY2UnO1xyXG5cclxuQEluamVjdGFibGUoe1xyXG4gIHByb3ZpZGVkSW46ICdyb290J1xyXG59KVxyXG5leHBvcnQgY2xhc3MgRGFzaGJvYXJkU2VydmljZXtcclxuXHJcbiAgICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICAgIHB1YmxpYyBEQVNIQk9BUkRfQVBJID0gJ2Rhc2hib2FyZC9pbmZvJztcclxuICAgIHB1YmxpYyBEQVNIQk9BUkRfRU1CRURERUQ9ICdkYXNoYm9hcmQnO1xyXG4gICAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgICBjb25zdHJ1Y3RvciggICAgICAgXHJcbiAgICAgIHByaXZhdGUgaHR0cDogSHR0cENsaWVudCxcclxuICAgICAgcHJpdmF0ZSByZXNvdXJjZVNlcnZpY2U6IFJlc291cmNlU2VydmljZSkge1xyXG4gICAgfVxyXG4gIFxyXG4gICAgLyoqIGdldCBhbGwga3BpICovXHJcbiAgICBnZXRBbGwoKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5EQVNIQk9BUkRfQVBJKSkubWFwKHJlc3BvbnNlID0+IHJlc3BvbnNlW3RoaXMuREFTSEJPQVJEX0VNQkVEREVEXSk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBVc2VyIH0gZnJvbSAnLi91c2VyLm1vZGVsJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5cclxuLyoqIFVzZXIgbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFVzZXJTZXJ2aWNlIGV4dGVuZHMgUmVzdFNlcnZpY2U8VXNlcj4ge1xyXG4gIFxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBVU0VSX0FQSSA9J3VzZXJzJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoVXNlciwgXCJ1c2Vyc1wiLCBpbmplY3Rvcik7XHJcbiAgfVxyXG4gIFxyXG4gIC8qKiByZW1vdmUgdXNlciovXHJcbiAgcmVtb3ZlKGl0ZW06IFVzZXIpIHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKGl0ZW0uX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgIFxyXG4gIH1cclxuICBcclxuICAvKiogc2F2ZSB1c2VyKi9cclxuICBzYXZlKGl0ZW06IGFueSk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICBpZiAoaXRlbS5fbGlua3MhPW51bGwpIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5VU0VSX0FQSSkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gICAgXHJcbiAgLyoqIGNoYW5nZSBwYXNzd29yZCBvIGdpdmVuIHVzZXIgaWQgKi9cclxuICBjaGFuZ2VQYXNzd29yZChpZCxpdGVtOiBhbnkpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5VU0VSX0FQSStcIi9cIitpZCtcIi9jaGFuZ2UtcGFzc3dvcmRcIikgLCBpdGVtKTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG5pbXBvcnQgeyBUZXJyaXRvcnkgfSBmcm9tICcuLi90ZXJyaXRvcnkvdGVycml0b3J5Lm1vZGVsJztcclxuaW1wb3J0IHsgVXNlciB9IGZyb20gJy4vdXNlci5tb2RlbCc7XHJcbi8qKlxyXG4gKiBVc2VyIHBvc2l0aW9uIG1vZGVsXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgVXNlclBvc2l0aW9uIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiBuYW1lICovXHJcbiAgcHVibGljIG5hbWU6IHN0cmluZztcclxuICAvKiogZW1haWwgKi9cclxuICBwdWJsaWMgZW1haWw6IHN0cmluZztcclxuICAvKiogb3JnYW5pemF0aW9uIG5hbWUqL1xyXG4gIHB1YmxpYyBvcmdhbml6YXRpb246IHN0cmluZztcclxuICAvKiogc3lzdGVtIGNyZWF0ZWQgZGF0ZSovXHJcbiAgcHVibGljIGNyZWF0ZWREYXRlOiBhbnk7XHJcbiAgLyoqIHN5c3RlbSBkYXRlZCBkYXRlKi9cclxuICBwdWJsaWMgZGF0ZWREYXRlOiBhbnk7XHJcbiAgLyoqIHBvc2l0aW9uIHRlcnJpdG9yeSovXHJcbiAgcHVibGljIHRlcnJpdG9yeTogVGVycml0b3J5O1xyXG4gIC8qKiB1c2VyKi9cclxuICBwdWJsaWMgdXNlcjogVXNlcjtcclxufVxyXG4iLCJpbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcbmltcG9ydCB7IFVzZXJQb3NpdGlvbiB9IGZyb20gJy4vdXNlci1wb3NpdGlvbi5tb2RlbCc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuXHJcbi8qKiBVc2VyIHBvc2l0aW9uIG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBVc2VyUG9zaXRpb25TZXJ2aWNlICBleHRlbmRzIFJlc3RTZXJ2aWNlPFVzZXJQb3NpdGlvbj4ge1xyXG4gIFxyXG5cclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgVVNFUl9QT1NJVElPTl9BUEkgPSAndXNlci1wb3NpdGlvbnMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihVc2VyUG9zaXRpb24sIFwidXNlci1wb3NpdGlvbnNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIHVzZXIgcG9zaXRpb24qL1xyXG4gIHJlbW92ZShpdGVtOiBVc2VyUG9zaXRpb24pIHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKGl0ZW0uX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgIFxyXG4gIH1cclxuICBcclxuICAvKiogc2F2ZSB1c2VyIHBvc2l0aW9uKi9cclxuICBzYXZlKGl0ZW06IGFueSk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICBpZiAoaXRlbS5fbGlua3MhPW51bGwpIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgICBpZiAoaXRlbS51c2VyICE9bnVsbCl7XHJcbiAgICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbigndXNlcicsaXRlbS51c2VyKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgXHJcbiAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoaXRlbS50ZXJyaXRvcnkgIT1udWxsKXtcclxuICAgICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCd0ZXJyaXRvcnknLGl0ZW0udGVycml0b3J5KS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgXHJcbiAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaXRlbS50ZXJyaXRvcnkgPSBpdGVtLnRlcnJpdG9yeS5fbGlua3Muc2VsZi5ocmVmO1xyXG4gICAgICBpdGVtLnVzZXIgPSBpdGVtLnVzZXIuX2xpbmtzLnNlbGYuaHJlZjtcclxuICBcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5VU0VSX1BPU0lUSU9OX0FQSSkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG5pbXBvcnQgeyBSb2xlIH0gZnJvbSAnLi4vcm9sZS9yb2xlLm1vZGVsJztcclxuaW1wb3J0IHsgVGVycml0b3J5IH0gZnJvbSAnLi4vdGVycml0b3J5L3RlcnJpdG9yeS5tb2RlbCc7XHJcbmltcG9ydCB7IFVzZXIgfSBmcm9tICcuL3VzZXIubW9kZWwnO1xyXG5cclxuLyoqXHJcbiAqIFVzZXIgcGVybWlzc2lvbiBtb2RlbFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFVzZXJDb25maWd1cmF0aW9uIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiByb2xlICovICBcclxuICBwdWJsaWMgcm9sZTogUm9sZTtcclxuXHJcbiAgLyoqIHJvbGUgQ2hpbGRyZW4gKi8gIFxyXG4gIHB1YmxpYyByb2xlQ2hpbGRyZW46IFJvbGU7XHJcbiAgXHJcbiAgLyoqIHRlcnJpdG9yeSAqLyBcclxuICBwdWJsaWMgdGVycml0b3J5OiBUZXJyaXRvcnk7XHJcbiAgLyoqIHVzZXIgKi9cclxuICBwdWJsaWMgdXNlcjogVXNlcjtcclxufVxyXG4iLCJpbXBvcnQgeyBSZXN0U2VydmljZSB9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgVXNlckNvbmZpZ3VyYXRpb24gfSBmcm9tICcuL3VzZXItY29uZmlndXJhdGlvbi5tb2RlbCc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuXHJcbi8qKiBVc2VyIGNvbmZpZ3VyYXRpb24gbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFVzZXJDb25maWd1cmF0aW9uU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPFVzZXJDb25maWd1cmF0aW9uPiB7XHJcblxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBVU0VSX0NPTkZJR1VSQVRJT05fQVBJID0gJ3VzZXItY29uZmlndXJhdGlvbnMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IsIHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoVXNlckNvbmZpZ3VyYXRpb24sIFwidXNlci1jb25maWd1cmF0aW9uc1wiLCBpbmplY3Rvcik7XHJcbiAgfVxyXG5cclxuICAvKiogcmVtb3ZlIHVzZXIgY29uZmlndXJhdGlvbiovXHJcbiAgcmVtb3ZlKGl0ZW06IFVzZXJDb25maWd1cmF0aW9uKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG5cclxuICB9XHJcblxyXG4gIC8qKiBzYXZlIHVzZXIgY29uZmlndXJhdGlvbiovXHJcbiAgc2F2ZShpdGVtOiBhbnkpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzICE9IG51bGwpIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaXRlbS50ZXJyaXRvcnkgPSBpdGVtLnRlcnJpdG9yeS5fbGlua3Muc2VsZi5ocmVmO1xyXG4gICAgICBpdGVtLnJvbGUgPSBpdGVtLnJvbGUhPW51bGw/aXRlbS5yb2xlLl9saW5rcy5zZWxmLmhyZWY6bnVsbDtcclxuICAgICAgaXRlbS51c2VyID0gaXRlbS51c2VyLl9saW5rcy5zZWxmLmhyZWY7XHJcbiAgICAgIGl0ZW0ucm9sZUNoaWxkcmVuID0gaXRlbS5yb2xlQ2hpbGRyZW4hPW51bGw/aXRlbS5yb2xlQ2hpbGRyZW4uX2xpbmtzLnNlbGYuaHJlZjpudWxsO1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLlVTRVJfQ09ORklHVVJBVElPTl9BUEkpLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG5cclxufVxyXG4iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuaW1wb3J0IHsgVGVycml0b3J5R3JvdXBUeXBlIH0gZnJvbSAnLi90ZXJyaXRvcnktZ3JvdXAtdHlwZS5tb2RlbCc7XHJcbmltcG9ydCB7IFRlcnJpdG9yeVR5cGUgfSBmcm9tICcuL3RlcnJpdG9yeS10eXBlLm1vZGVsJztcclxuXHJcbi8qKlxyXG4gKiBUZXJyaXRvcnkgbW9kZWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBUZXJyaXRvcnkgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgLyoqIGlkICovXHJcbiAgcHVibGljIGlkOiBudW1iZXI7ICBcclxuICAvKiogY29kZSAqL1xyXG4gIHB1YmxpYyBjb2RlOiBzdHJpbmc7XHJcbiAgLyoqIG5hbWUgKi9cclxuICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG4gIC8qKiBhZGRyZXNzKi9cclxuICBwdWJsaWMgdGVycml0b3JpYWxBdXRob3JpdHlBZGRyZXNzOiBzdHJpbmc7XHJcbiAgLyoqIGFkbWluICovXHJcbiAgcHVibGljIHRlcnJpdG9yaWFsQXV0aG9yaXR5TmFtZTogc3RyaW5nO1xyXG4gIC8qKiB3aGV0aGVyIHRlcnJpdG9yeSBpcyBibG9ja2VkKi9cclxuICBwdWJsaWMgYmxvY2tlZDogYm9vbGVhbjtcclxuICAvKiogY29tbWVudHMqL1xyXG4gIHB1YmxpYyBub3RlOiBzdHJpbmc7XHJcbiAgLyoqIHN5c3RlbSBjcmVhdGVkIGRhdGUqL1xyXG4gIHB1YmxpYyBjcmVhdGVkRGF0ZTogYW55O1xyXG4gIC8qKiBjb250YWN0IGVtYWlsICovICBcclxuICBwdWJsaWMgdGVycml0b3JpYWxBdXRob3JpdHlFbWFpbDogc3RyaW5nO1xyXG4gIC8qKiBleHRlbnNpb24gKi9cclxuICBwdWJsaWMgZXh0ZW50OiBzdHJpbmc7XHJcbiAgLyoqIGxvZ28gaW1hZ2UgVVJMICovXHJcbiAgcHVibGljIHRlcnJpdG9yaWFsQXV0aG9yaXR5TG9nbzogc3RyaW5nO1xyXG4gIC8qKiBjb250YWN0IG9yZ2FuaXphdGlvbiBuYW1lICovXHJcbiAgLy8gcHVibGljIG9yZ2FuaXphdGlvbk5hbWU6IHN0cmluZztcclxuICAvKiogc2NvcGUqL1xyXG4gIHB1YmxpYyBzY29wZTogc3RyaW5nO1xyXG4gIC8qKiB0eXBlICovICBcclxuICBwdWJsaWMgdHlwZTogVGVycml0b3J5VHlwZTtcclxuICAvKiogZ3JvdXAgdHlwZSAqL1xyXG4gIHB1YmxpYyBncm91cFR5cGU6IFRlcnJpdG9yeUdyb3VwVHlwZTtcclxuICAvKiogdGVycml0b3J5IG1lbWJlcnMqL1xyXG4gIHB1YmxpYyBtZW1iZXJzOiBUZXJyaXRvcnlbXTtcclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgVGVycml0b3J5IH0gZnJvbSAnLi90ZXJyaXRvcnkubW9kZWwnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IFJlc3RTZXJ2aWNlIH0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5cclxuLyoqIFRlcnJpdG9yeSBtYW5hZ2VyIHNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgVGVycml0b3J5U2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPFRlcnJpdG9yeT4ge1xyXG5cclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgVEVSUklUT1JZX0FQSSA9ICd0ZXJyaXRvcmllcyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3RvciwgcHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihUZXJyaXRvcnksIFwidGVycml0b3JpZXNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuXHJcbiAgLyoqIHJlbW92ZSB0ZXJyaXRvcnkqL1xyXG4gIHJlbW92ZShpdGVtOiBUZXJyaXRvcnkpIHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKGl0ZW0uX2xpbmtzLnNlbGYuaHJlZik7XHJcblxyXG4gIH1cclxuXHJcbiAgLyoqIHNhdmUgdGVycml0b3J5Ki9cclxuICBzYXZlKGl0ZW06IFRlcnJpdG9yeSk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcblxyXG4gICAgbGV0IHRlcnJpdG9yeUdyb3VwVHlwZTphbnkgPSB7fVxyXG4gICAgdGVycml0b3J5R3JvdXBUeXBlLl9saW5rcyA9IHt9O1xyXG4gICAgdGVycml0b3J5R3JvdXBUeXBlLl9saW5rcy5zZWxmID0ge307XHJcbiAgICB0ZXJyaXRvcnlHcm91cFR5cGUuX2xpbmtzLnNlbGYuaHJlZiA9IFwiXCI7XHJcblxyXG4gICAgbGV0IHRlcnJpdG9yeVR5cGU6YW55ID0ge31cclxuICAgIHRlcnJpdG9yeVR5cGUuX2xpbmtzID0ge307XHJcbiAgICB0ZXJyaXRvcnlUeXBlLl9saW5rcy5zZWxmID0ge307XHJcbiAgICB0ZXJyaXRvcnlUeXBlLl9saW5rcy5zZWxmLmhyZWYgPSBcIlwiO1xyXG5cclxuICAgIGlmIChpdGVtLnR5cGUgIT0gbnVsbCkge1xyXG4gICAgICB0ZXJyaXRvcnlUeXBlID0gaXRlbS50eXBlO1xyXG4gICAgICBpZiAodHlwZW9mIGl0ZW0udHlwZS5fbGlua3MgIT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICBpdGVtLnR5cGUgPSBpdGVtLnR5cGUuX2xpbmtzLnNlbGYuaHJlZjtcclxuICAgICAgfSBcclxuICAgIH1cclxuXHJcbiAgICBpZiAoaXRlbS5fbGlua3MgIT0gbnVsbCkge1xyXG4gICAgICAvL3VwZGF0ZSByZWxhdGlvbnNcclxuICAgICAgZGVsZXRlIGl0ZW0uZ3JvdXBUeXBlO1xyXG5cclxuXHJcbiAgICAgIC8vIGlmICh0ZXJyaXRvcnlHcm91cFR5cGUuX2xpbmtzLnNlbGYuaHJlZiA9PSAnJykge1xyXG4gICAgICAvLyAgIGl0ZW0uZGVsZXRlUmVsYXRpb24oJ2dyb3VwVHlwZScsIHRlcnJpdG9yeUdyb3VwVHlwZSkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgIC8vICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG5cclxuICAgICAgLy8gfSBlbHNlIHtcclxuICAgICAgLy8gICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbignZ3JvdXBUeXBlJywgdGVycml0b3J5R3JvdXBUeXBlKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgLy8gICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIC8vIH1cclxuXHJcbiAgICAgIGlmICh0ZXJyaXRvcnlUeXBlLl9saW5rcy5zZWxmLmhyZWYgPT0gJycpIHtcclxuICAgICAgICBpdGVtLmRlbGV0ZVJlbGF0aW9uKCd0eXBlJywgdGVycml0b3J5VHlwZSkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG5cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbigndHlwZScsIHRlcnJpdG9yeVR5cGUpLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZGVsZXRlIGl0ZW0udHlwZTtcclxuICAgICAgLy8gaWYgKGl0ZW0udHlwZSAhPSBudWxsKVxyXG4gICAgICAvLyAgIGl0ZW0udHlwZSA9IGl0ZW0udHlwZS5fbGlua3Muc2VsZi5ocmVmO1xyXG5cclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5URVJSSVRPUllfQVBJKSwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuXHJcbn1cclxuIiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcblxyXG4vKipcclxuICogVGVycml0b3J5IHR5cGUgbW9kZWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBUZXJyaXRvcnlUeXBlIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gICAvKiogaWQgKi9cclxuICAgcHVibGljIGlkOiBudW1iZXI7ICBcclxuICAvKiogbmFtZSAqL1xyXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbn1cclxuIiwiaW1wb3J0IHsgVGVycml0b3J5IH0gZnJvbSAnLi90ZXJyaXRvcnkubW9kZWwnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgVGVycml0b3J5VHlwZSB9IGZyb20gJy4vdGVycml0b3J5LXR5cGUubW9kZWwnO1xyXG5cclxuLyoqIFRlcnJpdG9yeVR5cGUgbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFRlcnJpdG9yeVR5cGVTZXJ2aWNlIGV4dGVuZHMgUmVzdFNlcnZpY2U8VGVycml0b3J5VHlwZT4ge1xyXG4gIFxyXG5cclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgVEVSUklUT1JZVFlQRV9BUEkgPSAndGVycml0b3J5LXR5cGVzJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoVGVycml0b3J5VHlwZSwgXCJ0ZXJyaXRvcnktdHlwZXNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIHRlcnJpdG9yeSB0eXBlKi9cclxuICByZW1vdmUoaXRlbTogVGVycml0b3J5VHlwZSkge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIHRlcnJpdG9yeSB0eXBlKi9cclxuICBzYXZlKGl0ZW06IGFueSk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICBpZiAoaXRlbS5fbGlua3MhPW51bGwpIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5URVJSSVRPUllUWVBFX0FQSSkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG5cclxuLyoqXHJcbiAqIFRlcnJpdG9yeSB0eXBlIG1vZGVsXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgVGVycml0b3J5R3JvdXBUeXBlIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiBpZCAqL1xyXG4gIHB1YmxpYyBpZDogbnVtYmVyOyAgXHJcbiAgLyoqIG5hbWUgKi9cclxuICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG59XHJcbiIsImltcG9ydCB7IFRlcnJpdG9yeUdyb3VwVHlwZSB9IGZyb20gJy4vdGVycml0b3J5LWdyb3VwLXR5cGUubW9kZWwnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuQEluamVjdGFibGUoe1xyXG4gIHByb3ZpZGVkSW46ICdyb290J1xyXG59KVxyXG5leHBvcnQgY2xhc3MgVGVycml0b3J5R3JvdXBUeXBlU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPFRlcnJpdG9yeUdyb3VwVHlwZT4ge1xyXG4gIFxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBURVJSSVRPUllHUk9VUFRZUEVfQVBJID0gJ3RlcnJpdG9yeS1ncm91cC10eXBlcyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKFRlcnJpdG9yeUdyb3VwVHlwZSwgXCJ0ZXJyaXRvcnktZ3JvdXAtdHlwZXNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIHRlcnJpdG9yeSovXHJcbiAgcmVtb3ZlKGl0ZW06IFRlcnJpdG9yeUdyb3VwVHlwZSkge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIHRlcnJpdG9yeSovXHJcbiAgc2F2ZShpdGVtOiBhbnkpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuVEVSUklUT1JZR1JPVVBUWVBFX0FQSSkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG59IiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcblxyXG4vKipcclxuICogUm9sZSBtb2RlbFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFJvbGUgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgLyoqIGlkICovXHJcbiAgcHVibGljIGlkOiBudW1iZXI7XHJcbiAgLyoqIG5hbWUqL1xyXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgLyoqIGNvbW1lbnRzKi9cclxuICBwdWJsaWMgZGVzY3JpcHRpb246IHN0cmluZztcclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgUm9sZSB9IGZyb20gJy4vcm9sZS5tb2RlbCc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5cclxuLyoqIFJvbGUgbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFJvbGVTZXJ2aWNlIGV4dGVuZHMgUmVzdFNlcnZpY2U8Um9sZT4ge1xyXG4gIFxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBST0xFX0FQSSA9ICdyb2xlcyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKFJvbGUsIFwicm9sZXNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIHJvbGUqL1xyXG4gIHJlbW92ZShpdGVtOiBSb2xlKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgcm9sZSovXHJcbiAgc2F2ZShpdGVtOiBhbnkpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuUk9MRV9BUEkpICwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBcclxufVxyXG4iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuLyoqXHJcbiAqIENvbm5lY3Rpb24gbW9kZWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBDb25uZWN0aW9uIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiBpZCAqL1xyXG4gIHB1YmxpYyBpZDogbnVtYmVyO1xyXG4gIC8qKiBuYW1lKi9cclxuICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG4gIC8qKiB0eXBlKi9cclxuICBwdWJsaWMgdHlwZTogc3RyaW5nO1xyXG4gIC8qKiB1c2VyKi9cclxuICBwdWJsaWMgdXNlcjogc3RyaW5nO1xyXG4gIC8qKiBwYXNzd29yZCovXHJcbiAgcHVibGljIHBhc3N3b3JkOiBzdHJpbmc7XHJcbiAgLyoqIGNvbm5lY3Rpb24gc3RyaW5nKi9cclxuICBwdWJsaWMgY29ubmVjdGlvblN0cmluZzogc3RyaW5nO1xyXG5cclxufVxyXG4iLCJpbXBvcnQgeyBDb25uZWN0aW9uIH0gZnJvbSAnLi9jb25uZWN0aW9uLm1vZGVsJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcblxyXG4vKiogQ29ubmVjdGlvbiBtYW5hZ2VyIHNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgQ29ubmVjdGlvblNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxDb25uZWN0aW9uPiB7XHJcbiAgXHJcblxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBDT05ORUNUSU9OX0FQSSA9ICdjb25uZWN0aW9ucyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKENvbm5lY3Rpb24sIFwiY29ubmVjdGlvbnNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIGNvbm5lY3Rpb24qL1xyXG4gIHJlbW92ZShpdGVtOiBDb25uZWN0aW9uKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgY29ubmVjdGlvbiovXHJcbiAgc2F2ZShpdGVtOiBDb25uZWN0aW9uKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgIGlmIChpdGVtLl9saW5rcyE9bnVsbCkge1xyXG4gICAgICBcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5DT05ORUNUSU9OX0FQSSkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG5cclxuICB0ZXN0Q29ubmVjdGlvbihpdGVtOmFueSk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICByZXN1bHQ9dGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5DT05ORUNUSU9OX0FQSSkrXCIvdGVzdFwiICwgaXRlbSk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBcclxufVxyXG4iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuXHJcbmltcG9ydCB7IENvbm5lY3Rpb24gfSBmcm9tICcuLi9jb25uZWN0aW9uL2Nvbm5lY3Rpb24ubW9kZWwnO1xyXG5pbXBvcnQgeyBSb2xlIH0gZnJvbSAnLi4vcm9sZS9yb2xlLm1vZGVsJztcclxuaW1wb3J0IHsgVGFza1R5cGUgfSBmcm9tICcuL3Rhc2stdHlwZS5tb2RlbCc7XHJcbmltcG9ydCB7IFRhc2tHcm91cCB9IGZyb20gJy4vdGFzay1ncm91cC5tb2RlbCc7XHJcbmltcG9ydCB7IFRhc2tBdmFpbGFiaWxpdHkgfSBmcm9tICcuL3Rhc2stYXZhaWxhYmlsaXR5Lm1vZGVsJztcclxuaW1wb3J0IHsgVGFza1BhcmFtZXRlciB9IGZyb20gJy4vdGFzay1wYXJhbWV0ZXIubW9kZWwnO1xyXG5cclxuLy9GSVhNRSBlbnN1cmUgdGFzayBjcmVhdGlvbiBpbiBhZG1pbiBhcHAgdXBvbiBpbml0aWFsaXphdGlvbiAoYXMgaXQgaXMgZG9uZSB3aXRoIFJvbGVzIGFuZCBkZWZhdWx0IFVzZXJzKVxyXG4vKiogR0VPQURNSU5fdGFzayBpZCAqL1xyXG5leHBvcnQgY29uc3QgR0VPQURNSU5fVFJFRV9UQVNLX0lEOnN0cmluZyAgPSBcImdlb2FkbWluXCI7XHJcblxyXG5pbXBvcnQgeyBUYXNrVUkgfSBmcm9tICcuL3Rhc2stdWkubW9kZWwnO1xyXG5pbXBvcnQgeyBDYXJ0b2dyYXBoeSB9IGZyb20gJy4uL2NhcnRvZ3JhcGh5L2NhcnRvZ3JhcGh5Lm1vZGVsJztcclxuaW1wb3J0IHsgU2VydmljZSB9IGZyb20gJy4uL3NlcnZpY2Uvc2VydmljZS5tb2RlbCc7XHJcbi8qKiBUYXNrIG1vZGVsICovXHJcbmV4cG9ydCBjbGFzcyBUYXNrIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiBpZCAqL1xyXG4gIHB1YmxpYyBpZD86IG51bWJlcjtcclxuICAvKiogbmFtZSAqLyAgXHJcbiAgcHVibGljIG5hbWU/OiBzdHJpbmc7XHJcbiAgLyoqIG9yZGVyKi9cclxuICBwdWJsaWMgb3JkZXI/OiBOdW1iZXI7XHJcbiAgLyoqIHN5c3RlbSBjcmVhdGVkIGRhdGUqL1xyXG4gIHB1YmxpYyBjcmVhdGVkRGF0ZT86IGFueTtcclxuICAvKiogdGFzayBncm91cCovXHJcbiAgcHVibGljIGdyb3VwPzogVGFza0dyb3VwO1xyXG4gIC8qKiB0YXNrIHR5cGUqL1xyXG4gIHB1YmxpYyB0eXBlPzogVGFza1R5cGU7XHJcbiAgLyoqIHRhc2sgVUkqL1xyXG4gIHB1YmxpYyB1aT86IFRhc2tVSTtcclxuICAvKiogcGFyYW1ldGVycyovXHJcbiAgcHVibGljIHBhcmFtZXRlcnM/OiBUYXNrUGFyYW1ldGVyW107XHJcbiAgLyoqIGNvbm5lY3Rpb24qL1xyXG4gIHB1YmxpYyBjb25uZWN0aW9uPzogQ29ubmVjdGlvbjtcclxuICAvKiogcm9sZXMqL1xyXG4gIHB1YmxpYyByb2xlcz86IFJvbGVbXTtcclxuICAvKiogYXZhaWxhYmlsaXRpZXMqL1xyXG4gIHB1YmxpYyBhdmFpbGFiaWxpdGllcz86IFRhc2tBdmFpbGFiaWxpdHlbXTtcclxuXHJcbiAgcHVibGljIGNhcnRvZ3JhcGh5PzogQ2FydG9ncmFwaHk7XHJcblxyXG4gIHB1YmxpYyBzZXJ2aWNlPzogU2VydmljZTtcclxuXHJcbiAgcHVibGljIHByb3BlcnRpZXM/O1xyXG59XHJcbiIsImltcG9ydCB7IFRhc2sgfSBmcm9tICcuL3Rhc2subW9kZWwnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuXHJcbi8qKiBUYXNrIG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBUYXNrU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPFRhc2s+IHtcclxuXHJcbiAgICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICAgIHB1YmxpYyBDT05ORUNUSU9OX0FQSSA9ICd0YXNrcyc7XHJcblxyXG4gICAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IsIHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgICAgIHN1cGVyKFRhc2ssIFwidGFza3NcIiwgaW5qZWN0b3IpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiByZW1vdmUgdGFzayovXHJcbiAgICByZW1vdmUoaXRlbTogVGFzaykge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKGl0ZW0uX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKiBzYXZlIHRhc2sqL1xyXG4gICAgc2F2ZShpdGVtOiBUYXNrKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgICAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcblxyXG4gICAgICAgIGlmIChpdGVtLl9saW5rcyAhPSBudWxsKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoIWl0ZW0uc2VydmljZSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHNlcnZpY2U6YW55ID0ge31cclxuICAgICAgICAgICAgICAgIHNlcnZpY2UuX2xpbmtzID0ge307XHJcbiAgICAgICAgICAgICAgICBzZXJ2aWNlLl9saW5rcy5zZWxmID0ge307XHJcbiAgICAgICAgICAgICAgICBzZXJ2aWNlLl9saW5rcy5zZWxmLmhyZWYgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgaXRlbS5kZWxldGVSZWxhdGlvbignc2VydmljZScsIHNlcnZpY2UpLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICAgICAgICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpOyBcclxuICAgICAgICAgICAgfWVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaXRlbS5zZXJ2aWNlLl9saW5rcy5zZWxmLmhyZWY9aXRlbS5zZXJ2aWNlLl9saW5rcy5zZWxmLmhyZWYuc3BsaXQoXCJ7XCIpWzBdXHJcbiAgICAgICAgICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbignc2VydmljZScsIGl0ZW0uc2VydmljZSkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgICAgICAgICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgICAgICAgICAgICBpdGVtLnNlcnZpY2UgPSBpdGVtLnNlcnZpY2UuX2xpbmtzLnNlbGYuaHJlZlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghaXRlbS5jYXJ0b2dyYXBoeSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGNhcnRvZ3JhcGh5OmFueSA9IHt9XHJcbiAgICAgICAgICAgICAgICBjYXJ0b2dyYXBoeS5fbGlua3MgPSB7fTtcclxuICAgICAgICAgICAgICAgIGNhcnRvZ3JhcGh5Ll9saW5rcy5zZWxmID0ge307XHJcbiAgICAgICAgICAgICAgICBjYXJ0b2dyYXBoeS5fbGlua3Muc2VsZi5ocmVmID0gXCJcIjtcclxuICAgICAgICAgICAgICAgIGl0ZW0uZGVsZXRlUmVsYXRpb24oJ2NhcnRvZ3JhcGh5JywgY2FydG9ncmFwaHkpLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICAgICAgICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpOyBcclxuICAgICAgICAgICAgfWVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaXRlbS5jYXJ0b2dyYXBoeS5fbGlua3Muc2VsZi5ocmVmPWl0ZW0uY2FydG9ncmFwaHkuX2xpbmtzLnNlbGYuaHJlZi5zcGxpdChcIntcIilbMF1cclxuICAgICAgICAgICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCdjYXJ0b2dyYXBoeScsIGl0ZW0uY2FydG9ncmFwaHkpLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICAgICAgICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG4gICAgICAgICAgICAgICAgaXRlbS5jYXJ0b2dyYXBoeSA9IGl0ZW0uY2FydG9ncmFwaHkuX2xpbmtzLnNlbGYuaHJlZlxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIWl0ZW0uY29ubmVjdGlvbikge1xyXG4gICAgICAgICAgICAgICAgbGV0IGNvbm5lY3Rpb246YW55ID0ge31cclxuICAgICAgICAgICAgICAgIGNvbm5lY3Rpb24uX2xpbmtzID0ge307XHJcbiAgICAgICAgICAgICAgICBjb25uZWN0aW9uLl9saW5rcy5zZWxmID0ge307XHJcbiAgICAgICAgICAgICAgICBjb25uZWN0aW9uLl9saW5rcy5zZWxmLmhyZWYgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgaXRlbS5kZWxldGVSZWxhdGlvbignY29ubmVjdGlvbicsIGNvbm5lY3Rpb24pLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICAgICAgICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpOyBcclxuICAgICAgICAgICAgfWVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaXRlbS5jb25uZWN0aW9uLl9saW5rcy5zZWxmLmhyZWY9aXRlbS5jb25uZWN0aW9uLl9saW5rcy5zZWxmLmhyZWYuc3BsaXQoXCJ7XCIpWzBdXHJcbiAgICAgICAgICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbignY29ubmVjdGlvbicsIGl0ZW0uY29ubmVjdGlvbikuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgICAgICAgICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgICAgICAgICAgICBpdGVtLmNvbm5lY3Rpb24gPSBpdGVtLmNvbm5lY3Rpb24uX2xpbmtzLnNlbGYuaHJlZlxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIWl0ZW0udWkpIHtcclxuICAgICAgICAgICAgICAgIC8vIGl0ZW0uZGVsZXRlUmVsYXRpb24oJ3VpJywgaXRlbS51aSkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgICAgICAgICAgICAvLyB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7IFxyXG4gICAgICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLnVpLl9saW5rcy5zZWxmLmhyZWY9aXRlbS51aS5fbGlua3Muc2VsZi5ocmVmLnNwbGl0KFwie1wiKVswXVxyXG4gICAgICAgICAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ3VpJywgaXRlbS51aSkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgICAgICAgICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgICAgICAgICAgICBpdGVtLnVpID0gaXRlbS51aS5fbGlua3Muc2VsZi5ocmVmXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICghaXRlbS5ncm91cCkge1xyXG4gICAgICAgICAgICAgICAgLy8gaXRlbS5kZWxldGVSZWxhdGlvbignZ3JvdXAnLCBpdGVtLmdyb3VwKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTsgXHJcbiAgICAgICAgICAgIH1lbHNlIHtcclxuICAgICAgICAgICAgICAgIGl0ZW0uZ3JvdXAuX2xpbmtzLnNlbGYuaHJlZj1pdGVtLmdyb3VwLl9saW5rcy5zZWxmLmhyZWYuc3BsaXQoXCJ7XCIpWzBdXHJcbiAgICAgICAgICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbignZ3JvdXAnLCBpdGVtLmdyb3VwKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgICAgICAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgICAgICAgICAgIGl0ZW0uZ3JvdXAgPSBpdGVtLmdyb3VwLl9saW5rcy5zZWxmLmhyZWZcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCFpdGVtLnR5cGUpIHtcclxuICAgICAgICAgICAgICAgIC8vIGl0ZW0uZGVsZXRlUmVsYXRpb24oJ3R5cGUnLCBpdGVtLnR5cGUpLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICAgICAgICAgICAgLy8gfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpOyBcclxuICAgICAgICAgICAgfWVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaXRlbS50eXBlLl9saW5rcy5zZWxmLmhyZWY9aXRlbS50eXBlLl9saW5rcy5zZWxmLmhyZWYuc3BsaXQoXCJ7XCIpWzBdXHJcbiAgICAgICAgICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbigndHlwZScsIGl0ZW0udHlwZSkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgICAgICAgICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgICAgICAgICAgICBpdGVtLnR5cGUgPSBpdGVtLnR5cGUuX2xpbmtzLnNlbGYuaHJlZlxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZihpdGVtLnJvbGVzKXtcclxuICAgICAgICAgICAgICAgIGxldCByb2xlcyA9IFsuLi5pdGVtLnJvbGVzXTtcclxuICAgICAgICAgICAgICAgIGRlbGV0ZSBpdGVtLnJvbGVzO1xyXG4gICAgICAgICAgICAgICAgaXRlbS5zdWJzdGl0dXRlQWxsUmVsYXRpb24oJ3JvbGVzJyxyb2xlcykuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgICAgICAgICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTsgICAgICAgICAgICBcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZihpdGVtLmNhcnRvZ3JhcGh5KXtcclxuICAgICAgICAgICAgICAgIGl0ZW0uY2FydG9ncmFwaHkgPSBpdGVtLmNhcnRvZ3JhcGh5Ll9saW5rcy5zZWxmLmhyZWZcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZihpdGVtLmNvbm5lY3Rpb24pe1xyXG4gICAgICAgICAgICAgICAgaXRlbS5jb25uZWN0aW9uID0gaXRlbS5jb25uZWN0aW9uLl9saW5rcy5zZWxmLmhyZWZcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZihpdGVtLnNlcnZpY2Upe1xyXG4gICAgICAgICAgICAgICAgaXRlbS5zZXJ2aWNlID0gaXRlbS5zZXJ2aWNlLl9saW5rcy5zZWxmLmhyZWZcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZihpdGVtLnVpKXtcclxuICAgICAgICAgICAgICAgIGl0ZW0udWkgPSBpdGVtLnVpLl9saW5rcy5zZWxmLmhyZWZcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZihpdGVtLmdyb3VwKXtcclxuICAgICAgICAgICAgICAgIGl0ZW0uZ3JvdXAgPSBpdGVtLmdyb3VwLl9saW5rcy5zZWxmLmhyZWZcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZihpdGVtLnR5cGUpe1xyXG4gICAgICAgICAgICAgICAgaXRlbS50eXBlID0gaXRlbS50eXBlLl9saW5rcy5zZWxmLmhyZWZcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLkNPTk5FQ1RJT05fQVBJKSwgaXRlbSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG4vKipcclxuICogVGFzayB0eXBlIG1vZGVsXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgVGFza1R5cGUgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgLyoqIG5hbWUqLyAgXHJcbiAgcHVibGljIG5hbWU6IHN0cmluZztcclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgVGFza1R5cGUgfSBmcm9tICcuL3Rhc2stdHlwZS5tb2RlbCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5cclxuLyoqIFRhc2tUeXBlIG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBUYXNrVHlwZVNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxUYXNrVHlwZT4ge1xyXG4gIFxyXG5cclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgQ09OTkVDVElPTl9BUEkgPSAndGFzay10eXBlcyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKFRhc2tUeXBlLCBcInRhc2stdHlwZXNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIHRhc2sgdHlwZSovXHJcbiAgcmVtb3ZlKGl0ZW06IFRhc2tUeXBlKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgdGFzayB0eXBlKi9cclxuICBzYXZlKGl0ZW06IFRhc2tUeXBlKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgIGlmIChpdGVtLl9saW5rcyE9bnVsbCkge1xyXG4gICAgICBcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5DT05ORUNUSU9OX0FQSSkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG4vKipcclxuICogVGFzayBncm91cCBtb2RlbFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFRhc2tHcm91cCBleHRlbmRzIFJlc291cmNlIHtcclxuICAvKiogaWQgKi9cclxuICBwdWJsaWMgaWQ6IG51bWJlcjsgIFxyXG4gIC8qKiBuYW1lKi8gIFxyXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcblxyXG59XHJcbiIsImltcG9ydCB7IFRhc2tHcm91cCB9IGZyb20gJy4vdGFzay1ncm91cC5tb2RlbCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5cclxuLyoqIFRhc2sgZ3JvdXAgbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFRhc2tHcm91cFNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxUYXNrR3JvdXA+IHtcclxuICBcclxuXHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIENPTk5FQ1RJT05fQVBJID0gJ3Rhc2stZ3JvdXBzJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoVGFza0dyb3VwLCBcInRhc2stZ3JvdXBzXCIsIGluamVjdG9yKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqIHJlbW92ZSB0YXNrIGdyb3VwKi9cclxuICByZW1vdmUoaXRlbTogVGFza0dyb3VwKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgdGFzayBncm91cCovXHJcbiAgc2F2ZShpdGVtOiBUYXNrR3JvdXApOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIFxyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucHV0KGl0ZW0uX2xpbmtzLnNlbGYuaHJlZiwgaXRlbSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLkNPTk5FQ1RJT05fQVBJKSAsIGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgXHJcbn1cclxuIiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcbmltcG9ydCB7VGFza30gZnJvbSAnLi90YXNrLm1vZGVsJzsgIFxyXG4vKipcclxuICogVGFzayBwYXJhbWV0ZXIgbW9kZWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBUYXNrUGFyYW1ldGVyIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiBuYW1lKi8gIFxyXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgXHJcbiAgLyoqIHR5cGUqL1xyXG4gIHB1YmxpYyB0eXBlOiBzdHJpbmc7XHJcbiAgICBcclxuICAvKiogdmFsdWUqL1xyXG4gIHB1YmxpYyB2YWx1ZTogc3RyaW5nO1xyXG4gIFxyXG4gIC8qKiBvcmRlciovICBcclxuICBwdWJsaWMgb3JkZXI6IE51bWJlcjtcclxuICBcclxuICAvKiogdGFzayovICBcclxuICBwdWJsaWMgdGFzazpUYXNrO1xyXG5cclxufVxyXG4iLCJpbXBvcnQgeyBUYXNrUGFyYW1ldGVyIH0gZnJvbSAnLi90YXNrLXBhcmFtZXRlci5tb2RlbCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5cclxuLyoqIFRhc2sgcGFyYW1ldGVyIG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpIFxyXG5leHBvcnQgY2xhc3MgVGFza1BhcmFtZXRlclNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxUYXNrUGFyYW1ldGVyPiB7XHJcbiAgXHJcblxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBUQVNLX1BBUkFNRVRFUl9BUEkgPSAndGFzay1wYXJhbWV0ZXJzJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoVGFza1BhcmFtZXRlciwgXCJ0YXNrLXBhcmFtZXRlcnNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIHRhc2sgcGFyYW1ldGVyKi9cclxuICByZW1vdmUoaXRlbTogVGFza1BhcmFtZXRlcikge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIHRhc2sgcGFyYW1ldGVyKi9cclxuICBzYXZlKGl0ZW06IFRhc2tQYXJhbWV0ZXIpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuICAgICAgaWYgKGl0ZW0udGFzayAhPW51bGwpe1xyXG4gICAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ3Rhc2snLGl0ZW0udGFzaykuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgIFxyXG4gICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpdGVtLnRhc2sgPSBpdGVtLnRhc2suX2xpbmtzLnNlbGYuaHJlZjtcclxuICBcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5UQVNLX1BBUkFNRVRFUl9BUEkpICwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBcclxufVxyXG4iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuaW1wb3J0IHsgVGVycml0b3J5IH0gZnJvbSAnLi4vdGVycml0b3J5L3RlcnJpdG9yeS5tb2RlbCc7XHJcbmltcG9ydCB7IFRhc2sgfSBmcm9tICcuL3Rhc2subW9kZWwnO1xyXG4vKipcclxuICogVGFzayBhdmFpbGFiaWxpdHkgbW9kZWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBUYXNrQXZhaWxhYmlsaXR5IGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiB0ZXJyaXRvcnkqL1xyXG4gIHB1YmxpYyB0ZXJyaXRvcnk6IFRlcnJpdG9yeTtcclxuICAvKiogdGFzayovXHJcbiAgcHVibGljIHRhc2s6IFRhc2s7XHJcbn1cclxuIiwiaW1wb3J0IHsgVGFza0F2YWlsYWJpbGl0eSB9IGZyb20gJy4vdGFzay1hdmFpbGFiaWxpdHkubW9kZWwnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuXHJcbi8qKiBUYXNrIGF2YWlsYWJpbGl0eSBtYW5hZ2VyIHNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKSBcclxuZXhwb3J0IGNsYXNzIFRhc2tBdmFpbGFiaWxpdHlTZXJ2aWNlIGV4dGVuZHMgUmVzdFNlcnZpY2U8VGFza0F2YWlsYWJpbGl0eT4ge1xyXG4gIFxyXG5cclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgVEFTS19BVkFJTEFCSUxJVFlfQVBJID0gJ3Rhc2stYXZhaWxhYmlsaXRpZXMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihUYXNrQXZhaWxhYmlsaXR5LCBcInRhc2stYXZhaWxhYmlsaXRpZXNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIHRhc2sgYXZhaWxhYmlsaXR5Ki9cclxuICByZW1vdmUoaXRlbTogVGFza0F2YWlsYWJpbGl0eSkge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIHRhc2sgYXZhaWxhYmlsaXR5Ki9cclxuICBzYXZlKGl0ZW06IFRhc2tBdmFpbGFiaWxpdHkpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuICAgICAgaWYgKGl0ZW0udGFzayAhPW51bGwpe1xyXG4gICAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ3Rhc2snLGl0ZW0udGFzaykuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgIFxyXG4gICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGl0ZW0udGVycml0b3J5ICE9bnVsbCl7XHJcbiAgICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbigndGVycml0b3J5JyxpdGVtLnRlcnJpdG9yeSkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgIFxyXG4gICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGl0ZW0udGVycml0b3J5ID0gaXRlbS50ZXJyaXRvcnkuX2xpbmtzLnNlbGYuaHJlZjtcclxuICAgICAgaXRlbS50YXNrID0gaXRlbS50YXNrLl9saW5rcy5zZWxmLmhyZWY7XHJcbiAgXHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuVEFTS19BVkFJTEFCSUxJVFlfQVBJKSAsIGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgXHJcbn1cclxuIiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcbi8qKlxyXG4gKiBUYXNrIFVJIG1vZGVsXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgVGFza1VJIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiBuYW1lKi9cclxuICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG4gIFxyXG4gIC8qKiB0b29sdGlwKi8gIFxyXG4gIHB1YmxpYyB0b29sdGlwOiBzdHJpbmc7XHJcbiAgICBcclxuICAvKiogb3JkZXIqLyBcclxuICBwdWJsaWMgb3JkZXI6IG51bWJlcjtcclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgVGFza1VJIH0gZnJvbSAnLi90YXNrLXVpLm1vZGVsJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcblxyXG4vKiogVGFzayBVSSBtYW5hZ2VyIHNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgVGFza1VJU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPFRhc2tVST4ge1xyXG4gIFxyXG5cclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgQ09OTkVDVElPTl9BUEkgPSAndGFzay11aXMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihUYXNrVUksIFwidGFzay11aXNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIHRhc2sgVUkqL1xyXG4gIHJlbW92ZShpdGVtOiBUYXNrVUkpIHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKGl0ZW0uX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgIFxyXG4gIH1cclxuICBcclxuICAvKiogc2F2ZSB0YXNrIFVJKi9cclxuICBzYXZlKGl0ZW06IFRhc2tVSSk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICBpZiAoaXRlbS5fbGlua3MhPW51bGwpIHsgICAgICBcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5DT05ORUNUSU9OX0FQSSkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG5pbXBvcnQgeyBMYW5ndWFnZSB9IGZyb20gJy4vbGFuZ3VhZ2UubW9kZWwnO1xyXG5cclxuXHJcbi8qKiBUYXNrIG1vZGVsICovXHJcbmV4cG9ydCBjbGFzcyBUcmFuc2xhdGlvbiBleHRlbmRzIFJlc291cmNlIHtcclxuICAvKiogaWQgKi9cclxuICBwdWJsaWMgaWQ6IG51bWJlcjtcclxuICAvKiogaWQgKi9cclxuICBwdWJsaWMgZWxlbWVudDogbnVtYmVyO1xyXG4gIC8qKiBuYW1lICovXHJcbiAgcHVibGljIHRyYW5zbGF0aW9uOiBzdHJpbmc7XHJcbiAgLyoqIGNvbHVtbiAqL1xyXG4gIHB1YmxpYyBjb2x1bW46IHN0cmluZztcclxuICAvKiogbmFtZSAqL1xyXG4gIHB1YmxpYyBsYW5ndWFnZTogTGFuZ3VhZ2U7XHJcbiAgLyoqIG5hbWUgKi9cclxuICBwdWJsaWMgbGFuZ3VhZ2VOYW1lPzogc3RyaW5nO1xyXG4gIC8qKiBuYW1lICovXHJcbiAgcHVibGljIGxhbmd1YWdlU2hvcnRuYW1lPzogc3RyaW5nO1xyXG5cclxuXHJcblxyXG59XHJcbiIsImltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBUcmFuc2xhdGlvbiB9IGZyb20gJy4vdHJhbnNsYXRpb24ubW9kZWwnO1xyXG5cclxuXHJcbkBJbmplY3RhYmxlKHtcclxuICBwcm92aWRlZEluOiAncm9vdCdcclxufSlcclxuZXhwb3J0IGNsYXNzIFRyYW5zbGF0aW9uU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPFRyYW5zbGF0aW9uPiB7XHJcblxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBUUkFOU0xBVElPTl9BUEkgPSAndHJhbnNsYXRpb25zJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoVHJhbnNsYXRpb24sIFwidHJhbnNsYXRpb25zXCIsIGluamVjdG9yKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqIHJlbW92ZSB0cmFuc2xhdGlvbiovXHJcbiAgcmVtb3ZlKGl0ZW06IFRyYW5zbGF0aW9uKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgdHJhbnNsYXRpb24qL1xyXG4gIHNhdmUoaXRlbTogVHJhbnNsYXRpb24pOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG5cclxuICAgIGxldCBsYW5ndWFnZTphbnkgPSB7fVxyXG4gICAgbGFuZ3VhZ2UuX2xpbmtzID0ge307XHJcbiAgICBsYW5ndWFnZS5fbGlua3Muc2VsZiA9IHt9O1xyXG4gICAgbGFuZ3VhZ2UuX2xpbmtzLnNlbGYuaHJlZiA9IFwiXCI7XHJcblxyXG4gICAgaWYgKGl0ZW0ubGFuZ3VhZ2UgIT0gbnVsbCkge1xyXG4gICAgICBsYW5ndWFnZSA9IGl0ZW0ubGFuZ3VhZ2U7XHJcbiAgICAgIGlmICh0eXBlb2YgaXRlbS5sYW5ndWFnZS5fbGlua3MgIT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICBpdGVtLmxhbmd1YWdlID0gaXRlbS5sYW5ndWFnZS5fbGlua3Muc2VsZi5ocmVmO1xyXG4gICAgICB9IFxyXG4gICAgfVxyXG5cclxuICAgIGlmIChpdGVtLl9saW5rcyE9bnVsbCkge1xyXG4gICAgICBkZWxldGUgaXRlbS5sYW5ndWFnZTtcclxuICAgICAgLy8gaWYgKGxhbmd1YWdlLl9saW5rcy5zZWxmLmhyZWYgPT0gJycpIHtcclxuICAgICAgLy8gICBpdGVtLmRlbGV0ZVJlbGF0aW9uKCdsYW5ndWFnZScsIGxhbmd1YWdlKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgLy8gICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcblxyXG4gICAgICAvLyB9IGVsc2Uge1xyXG4gICAgICAvLyAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCdsYW5ndWFnZScsIGxhbmd1YWdlKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgLy8gICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIC8vIH1cclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5UUkFOU0xBVElPTl9BUEkpICwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuXHJcblxyXG4vKiogVGFzayBtb2RlbCAqL1xyXG5leHBvcnQgY2xhc3MgTGFuZ3VhZ2UgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgLyoqIGlkICovXHJcbiAgcHVibGljIGlkOiBudW1iZXI7XHJcbiAgLyoqIG5hbWUgKi9cclxuICBwdWJsaWMgc2hvcnRuYW1lOiBzdHJpbmc7XHJcbiAgLyoqIG5hbWUgKi9cclxuICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG59XHJcbiIsImltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBMYW5ndWFnZSB9IGZyb20gJy4vbGFuZ3VhZ2UubW9kZWwnO1xyXG5cclxuXHJcbkBJbmplY3RhYmxlKHtcclxuICBwcm92aWRlZEluOiAncm9vdCdcclxufSlcclxuZXhwb3J0IGNsYXNzIExhbmd1YWdlU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPExhbmd1YWdlPiB7XHJcblxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBMQU5HVUFHRVNfQVBJID0gJ2xhbmd1YWdlcyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKExhbmd1YWdlLCBcImxhbmd1YWdlc1wiLCBpbmplY3Rvcik7XHJcbiAgfVxyXG4gIFxyXG4gIC8qKiByZW1vdmUgdHJhbnNsYXRpb24qL1xyXG4gIHJlbW92ZShpdGVtOiBMYW5ndWFnZSkge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIHRyYW5zbGF0aW9uKi9cclxuICBzYXZlKGl0ZW06IExhbmd1YWdlKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgIGlmIChpdGVtLl9saW5rcyE9bnVsbCkge1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucHV0KGl0ZW0uX2xpbmtzLnNlbGYuaHJlZiwgaXRlbSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLkxBTkdVQUdFU19BUEkpICwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuaW1wb3J0IHtDb25uZWN0aW9ufSBmcm9tICcuLi9jb25uZWN0aW9uL2Nvbm5lY3Rpb24ubW9kZWwnO1xyXG5pbXBvcnQge1NlcnZpY2VQYXJhbWV0ZXJ9IGZyb20gJy4vc2VydmljZS1wYXJhbWV0ZXIubW9kZWwnO1xyXG4vKipcclxuICogU2VydmljZSBtb2RlbFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFNlcnZpY2UgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgLyoqIGlkICovXHJcbiAgcHVibGljIGlkOiBudW1iZXI7XHJcbiAgLyoqIG5hbWUqL1xyXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgICBcclxuICAvKiogdHlwZSovXHJcbiAgcHVibGljIHR5cGU6IHN0cmluZztcclxuXHJcbiAgLyoqIHVybCovICBcclxuICBwdWJsaWMgc2VydmljZVVSTDogc3RyaW5nO1xyXG5cclxuICAvKiogcHJvamVjdGlvbnMqLyAgXHJcbiAgcHVibGljIHN1cHBvcnRlZFNSUzogc3RyaW5nO1xyXG4gIFxyXG4gIC8qKiBsZWdlbmQqL1xyXG4gIHB1YmxpYyBsZWdlbmQ6IHN0cmluZztcclxuXHJcbiAgLyoqIGluZm9VcmwqLyAgXHJcbiAgcHVibGljIGluZm9Vcmw6IHN0cmluZztcclxuICBcclxuICAvKiogc3lzdGVtIGNyZWF0ZWQgZGF0ZSovXHJcbiAgcHVibGljIGNyZWF0ZWREYXRlOiBhbnk7XHJcblxyXG4gIC8qKiBjb25uZWN0aW9uKi9cclxuICBwdWJsaWMgY29ubmVjdGlvbjogQ29ubmVjdGlvbjtcclxuICBcclxuICAvKiogcGFyYW1ldGVycyovICBcclxuICBwdWJsaWMgcGFyYW1ldGVyczogU2VydmljZVBhcmFtZXRlcltdO1xyXG5cclxuICAvKiogd2hldGhlciBzZXJ2aWNlIGlzIGJsb2NrZWQqL1xyXG4gIHB1YmxpYyBibG9ja2VkOiBib29sZWFuO1xyXG59XHJcbiIsImltcG9ydCB7IFNlcnZpY2UgfSBmcm9tICcuL3NlcnZpY2UubW9kZWwnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuXHJcbi8qKiBTZXJ2aWNlIG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBTZXJ2aWNlU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPFNlcnZpY2U+IHtcclxuXHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIFNFUlZJQ0VfQVBJID0gJ3NlcnZpY2VzJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoU2VydmljZSwgXCJzZXJ2aWNlc1wiLCBpbmplY3Rvcik7XHJcbiAgfVxyXG4gIFxyXG4gIC8qKiByZW1vdmUgc2VydmljZSovXHJcbiAgcmVtb3ZlKGl0ZW06IFNlcnZpY2UpIHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKGl0ZW0uX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgIFxyXG4gIH1cclxuICBcclxuICAvKiogc2F2ZSBzZXJ2aWNlKi9cclxuICBzYXZlKGl0ZW06IFNlcnZpY2UpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgbGV0IHNlcnZpY2VDb25uZWN0aW9uID0gaXRlbS5jb25uZWN0aW9uO1xyXG5cclxuICAgIGlmIChpdGVtLmNvbm5lY3Rpb24hPW51bGwpe1xyXG4gICAgICAgIGlmICh0eXBlb2YgaXRlbS5jb25uZWN0aW9uLl9saW5rcyE9ICd1bmRlZmluZWQnKSB7IFxyXG4gICAgICAgICAgICBpdGVtLmNvbm5lY3Rpb24gPSBpdGVtLmNvbm5lY3Rpb24uX2xpbmtzLnNlbGYuaHJlZjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBzZXJ2aWNlQ29ubmVjdGlvbi5fbGlua3M9IHt9O1xyXG4gICAgICAgICAgICBzZXJ2aWNlQ29ubmVjdGlvbi5fbGlua3Muc2VsZiA9IHt9O1xyXG4gICAgICAgICAgICBzZXJ2aWNlQ29ubmVjdGlvbi5fbGlua3Muc2VsZi5ocmVmPVwiXCI7XHJcbiAgICAgICAgfSAgICAgICAgXHJcbiAgICAgfVxyXG5cclxuICAgIGlmIChpdGVtLl9saW5rcyE9bnVsbCkgeyAgICAgXHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTsgICAgICAgXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLlNFUlZJQ0VfQVBJKSAsIGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgXHJcbn1cclxuIiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcblxyXG4vKipcclxuICogU2VydmljZSBtb2RlbFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIENvbmZpZ3VyYXRpb25QYXJhbWV0ZXIgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgLyoqIGlkICovXHJcbiAgcHVibGljIGlkOiBudW1iZXI7XHJcbiAgLyoqIG5hbWUqL1xyXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgICBcclxuICAvKiogdmFsdWUqL1xyXG4gIHB1YmxpYyB2YWx1ZTogc3RyaW5nO1xyXG5cclxufVxyXG4iLCJpbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBDb25maWd1cmF0aW9uUGFyYW1ldGVyIH0gZnJvbSAnLi9jb25maWd1cmF0aW9uLXBhcmFtZXRlcnMubW9kZWwnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcblxyXG5ASW5qZWN0YWJsZSh7XHJcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBDb25maWd1cmF0aW9uUGFyYW1ldGVyc1NlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxDb25maWd1cmF0aW9uUGFyYW1ldGVyPiB7XHJcblxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBDT05GSUdVUkFUSU9OX1BBUkFNRVRFUlNfQVBJID0gJ2NvbmZpZ3VyYXRpb24tcGFyYW1ldGVycyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKENvbmZpZ3VyYXRpb25QYXJhbWV0ZXIsIFwiY29uZmlndXJhdGlvbi1wYXJhbWV0ZXJzXCIsIGluamVjdG9yKTtcclxuICB9XHJcbiAgXHJcbiAgXHJcbn1cclxuIiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcbmltcG9ydCB7U2VydmljZX0gZnJvbSAnLi9zZXJ2aWNlLm1vZGVsJzsgXHJcbi8qKlxyXG4gKiBTZXJ2aWNlIHBhcmFtZXRlciBtb2RlbFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFNlcnZpY2VQYXJhbWV0ZXIgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgLyoqIG5hbWUqL1xyXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgXHJcbiAgLyoqIHR5cGUqL1xyXG4gIHB1YmxpYyB0eXBlOiBzdHJpbmc7XHJcbiAgICBcclxuICAvKiogdmFsdWUqLyAgXHJcbiAgcHVibGljIHZhbHVlOiBzdHJpbmc7XHJcbiAgXHJcbiAgLyoqIHNlcnZpY2UqL1xyXG4gIHB1YmxpYyBzZXJ2aWNlOiBTZXJ2aWNlO1xyXG5cclxufVxyXG4iLCJpbXBvcnQgeyBTZXJ2aWNlUGFyYW1ldGVyIH0gZnJvbSAnLi9zZXJ2aWNlLXBhcmFtZXRlci5tb2RlbCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5cclxuLyoqIFNlcnZpY2UgcGFyYW1ldGVyIG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpIFxyXG5leHBvcnQgY2xhc3MgU2VydmljZVBhcmFtZXRlclNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxTZXJ2aWNlUGFyYW1ldGVyPiB7XHJcblxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBTRVJWSUNFX1BBUkFNRVRFUl9BUEkgPSAnc2VydmljZS1wYXJhbWV0ZXJzJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoU2VydmljZVBhcmFtZXRlciwgXCJzZXJ2aWNlLXBhcmFtZXRlcnNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIHNlcnZpY2UgcGFyYW1ldGVyKi9cclxuICByZW1vdmUoaXRlbTogU2VydmljZVBhcmFtZXRlcikge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIHNlcnZpY2UgcGFyYW1ldGVyKi9cclxuICBzYXZlKGl0ZW06IFNlcnZpY2VQYXJhbWV0ZXIpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIFxyXG4gICAgICBcclxuICAgICAgaWYgKGl0ZW0uc2VydmljZSAhPW51bGwpe1xyXG4gICAgICAgICAgbGV0IHNlcnZpY2UgPSAgaXRlbS5zZXJ2aWNlO1xyXG4gICAgICAgICAgZGVsZXRlIGl0ZW0uc2VydmljZTtcclxuICAgICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCdzZXJ2aWNlJyxzZXJ2aWNlKS5zdWJzY3JpYmUocmVzdWx0ID0+IHsgICAgICAgICAgICBcclxuICAgICAgICAgIFxyXG4gICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH1cclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgICBcclxuICAgICAgXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpdGVtLnNlcnZpY2UgPSBpdGVtLnNlcnZpY2UuX2xpbmtzLnNlbGYuaHJlZjtcclxuICBcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5TRVJWSUNFX1BBUkFNRVRFUl9BUEkpICwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBcclxufVxyXG4iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuLyoqXHJcbiAqIENhcGFiaWxpdGllIG1vZGVsXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgQ2FwYWJpbGl0aWUgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgLyoqIHVybCAqL1xyXG4gIHB1YmxpYyB1cmw6IHN0cmluZztcclxufVxyXG4iLCJpbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50LCBIdHRwSGVhZGVycyB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcbmltcG9ydCB7IENhcGFiaWxpdGllIH0gZnJvbSAnLi9jYXBhYmlsaXRpZS5tb2RlbCc7XHJcblxyXG5cclxuQEluamVjdGFibGUoe1xyXG4gIHByb3ZpZGVkSW46ICdyb290J1xyXG59KVxyXG5leHBvcnQgY2xhc3MgQ2FwYWJpbGl0aWVzU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPENhcGFiaWxpdGllPiAge1xyXG5cclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgQ0FQQUJJTElUSUVTX0FQSSA9ICdoZWxwZXJzL2NhcGFiaWxpdGllcz91cmw9JztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoQ2FwYWJpbGl0aWUsIFwiaGVscGVycy9jYXBhYmlsaXRpZXM/dXJsPVwiLCBpbmplY3Rvcik7XHJcbiAgfVxyXG5cclxuICAgIC8qKiBzYXZlIHNlcnZpY2UqL1xyXG4gICAgZ2V0SW5mbyh1cmw6IHN0cmluZyk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgICAgaWYodXJsKXtcclxuICAgICAgICBjb25zdCBoZWFkZXJEaWN0ID0ge1xyXG4gICAgICAgICAgJ0NoYXJzZXQnOiAnVVRGLTgnXHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IHJlcXVlc3RPcHRpb25zID0geyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgaGVhZGVyczogbmV3IEh0dHBIZWFkZXJzKGhlYWRlckRpY3QpLCBcclxuICAgICAgICB9O1xyXG4gICAgICAgIGxldCBmaW5hbFVybCA9IHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuQ0FQQUJJTElUSUVTX0FQSSk7XHJcbiAgICAgICAgZmluYWxVcmwgPSBmaW5hbFVybC5jb25jYXQodXJsKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhmaW5hbFVybCk7XHJcbiAgICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLmdldChmaW5hbFVybCwgcmVxdWVzdE9wdGlvbnMpO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiByZXN1bHQ7XHJcbiBcclxuICAgIH1cclxuICBcclxufVxyXG4iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuLyoqXHJcbiAqIEluZm8gbW9kZWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBJbmZvIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiB1cmwgKi9cclxuICBwdWJsaWMgdXJsOiBzdHJpbmc7XHJcbn1cclxuIiwiaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCwgSHR0cEhlYWRlcnMgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBJbmZvIH0gZnJvbSAnLi9pbmZvLm1vZGVsJztcclxuXHJcblxyXG5ASW5qZWN0YWJsZSh7XHJcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBHZXRJbmZvU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPEluZm8+ICB7XHJcblxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBJTkZPX0FQSSA9ICdoZWxwZXJzL2ZlYXR1cmUtdHlwZT91cmw9JztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoSW5mbywgXCJoZWxwZXJzL2ZlYXR1cmUtdHlwZT91cmw9XCIsIGluamVjdG9yKTtcclxuICB9XHJcblxyXG4gICAgLyoqIHNhdmUgc2VydmljZSovXHJcbiAgICBnZXRJbmZvKHVybDogc3RyaW5nKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgICBpZih1cmwpe1xyXG4gICAgICAgIGNvbnN0IGhlYWRlckRpY3QgPSB7XHJcbiAgICAgICAgICAnQ2hhcnNldCc6ICdVVEYtOCdcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3QgcmVxdWVzdE9wdGlvbnMgPSB7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICBoZWFkZXJzOiBuZXcgSHR0cEhlYWRlcnMoaGVhZGVyRGljdCksIFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgbGV0IGZpbmFsVXJsID0gdGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5JTkZPX0FQSSk7XHJcbiAgICAgICAgZmluYWxVcmwgPSBmaW5hbFVybC5jb25jYXQodXJsKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhmaW5hbFVybCk7XHJcbiAgICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLmdldChmaW5hbFVybCwgcmVxdWVzdE9wdGlvbnMpO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiByZXN1bHQ7XHJcbiBcclxuICAgIH1cclxuICBcclxufVxyXG4iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuaW1wb3J0IHtTZXJ2aWNlfSBmcm9tICcuLi9zZXJ2aWNlL3NlcnZpY2UubW9kZWwnO1xyXG5pbXBvcnQge0Nvbm5lY3Rpb259IGZyb20gJy4uL2Nvbm5lY3Rpb24vY29ubmVjdGlvbi5tb2RlbCc7XHJcbmltcG9ydCB7Q2FydG9ncmFwaHlBdmFpbGFiaWxpdHl9IGZyb20gJy4vY2FydG9ncmFwaHktYXZhaWxhYmlsaXR5Lm1vZGVsJztcclxuaW1wb3J0IHsgQ2FydG9ncmFwaHlTdHlsZSB9IGZyb20gJy4vY2FydG9ncmFwaHktc3R5bGUubW9kZWwnO1xyXG4vKipcclxuICogQ2FydG9ncmFwaHlcclxuICovXHJcbmV4cG9ydCBjbGFzcyBDYXJ0b2dyYXBoeSBleHRlbmRzIFJlc291cmNlIHtcclxuICAvKiogaWQgKi9cclxuICBwdWJsaWMgaWQ6IG51bWJlcjsgIFxyXG4gIC8qKiBuYW1lKi9cclxuICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG4gIFxyXG4gIC8qKiB0eXBlKi9cclxuICBwdWJsaWMgdHlwZSA6IHN0cmluZztcclxuXHJcbiAgLyoqIHNlcnZpY2UqL1xyXG4gIHB1YmxpYyBzZXJ2aWNlIDogU2VydmljZTtcclxuXHJcbiAgLyoqIG9yZGVyKi8gIFxyXG4gIHB1YmxpYyBvcmRlcjogTnVtYmVyOyBcclxuXHJcbiAgLyoqIGRlc2NyaXB0aW9uKi8gIFxyXG4gIHB1YmxpYyBkZXNjcmlwdGlvbjogU3RyaW5nO1xyXG5cclxuICAvKiogc291cmNlKi8gIFxyXG4gIHB1YmxpYyBzb3VyY2U6IFN0cmluZztcclxuXHJcbiAgLyoqIHdoZXRoZXIgY2FydG9ncmFwaHkgaXMgYmxvY2tlZCovXHJcbiAgcHVibGljIGJsb2NrZWQ6IGJvb2xlYW47ICBcclxuXHJcbiAgLyoqIGFwcGx5IGZpbHRlciB0byBnZXQgbWFwKi9cclxuICBwdWJsaWMgYXBwbHlGaWx0ZXJUb0dldE1hcDogYm9vbGVhbjsgIFxyXG5cclxuICAvKiogYXBwbHkgZmlsdGVyIHRvIGdldCBmZWF0dXJlIGluZm9ybWF0aW9uKi9cclxuICBwdWJsaWMgYXBwbHlGaWx0ZXJUb0dldEZlYXR1cmVJbmZvOiBib29sZWFuOyAgXHJcblxyXG4gIC8qKiBhcHBseSBmaWx0ZXIgdG8gc3BhdGlhbCBzZWxlY3Rpb24qL1xyXG4gIHB1YmxpYyBhcHBseUZpbHRlclRvU3BhdGlhbFNlbGVjdGlvbjogYm9vbGVhbjsgIFxyXG5cclxuICAvKiogc2VsZWN0YWJsZSBsYXllcnMqL1xyXG4gIHB1YmxpYyBzZWxlY3RhYmxlTGF5ZXJzOiBzdHJpbmdbXTtcclxuXHJcbiAgLyoqIHRyYW5zcGFyZW5jeSovIFxyXG4gIHB1YmxpYyB0cmFuc3BhcmVuY3k6IE51bWJlcjtcclxuXHJcbiAgLyoqIHdoZXRoZXIgbGF5ZXIgaXMgcXVlcnlhYmxlKi8gIFxyXG4gIHB1YmxpYyBxdWVyeWFibGU6IEJvb2xlYW47XHJcblxyXG4gIC8qKiB3aGV0aGVyIGxheWVyIGlzIHF1ZXJ5YWJsZSovIFxyXG4gIHB1YmxpYyBxdWVyeUFjdDogQm9vbGVhbjtcclxuXHJcbiAgLyoqIHF1ZXJ5IGxheWVyKi9cclxuICBwdWJsaWMgcXVlcnlMYXk6IHN0cmluZztcclxuXHJcbiAgLyoqIHN5c3RlbSBjcmVhdGVkIGRhdGUqL1xyXG4gIHB1YmxpYyBjcmVhdGVkRGF0ZTogYW55O1xyXG5cclxuICAvKiogbWluaW11bSBzY2FsZSovXHJcbiAgcHVibGljIG1pbmltdW1TY2FsZTogTnVtYmVyO1xyXG5cclxuICAvKiogbWF4aW11bSBzY2FsZSovXHJcbiAgcHVibGljIG1heGltdW1TY2FsZTogTnVtYmVyO1xyXG5cclxuICAvKiogbGF5ZXJzKi8gIFxyXG4gIHB1YmxpYyBsYXllcnM6IHN0cmluZztcclxuICBcclxuICAvKiogY29ubmVjdGlvbiovXHJcbiAgcHVibGljIGNvbm5lY3Rpb246IENvbm5lY3Rpb247XHJcblxyXG4gIC8qKiBxdWVyeWFibGVGZWF0dXJlRW5hYmxlZCAqL1xyXG4gIHB1YmxpYyBxdWVyeWFibGVGZWF0dXJlRW5hYmxlZDogQm9vbGVhbjtcclxuXHJcbiAgICAvKiogcXVlcnlhYmxlTGF5ZXJzICovXHJcbiAgcHVibGljIHF1ZXJ5YWJsZUZlYXR1cmVBdmFpbGFibGU6IEJvb2xlYW47XHJcblxyXG4gICAgLyoqIHF1ZXJ5YWJsZUxheWVycyAqL1xyXG4gIHB1YmxpYyBxdWVyeWFibGVMYXllcnM6IHN0cmluZ1tdO1xyXG5cclxuICAvKiogYXZhaWxhYmlsaXRpZXMqL1xyXG4gIHB1YmxpYyBhdmFpbGFiaWxpdGllcyA6IENhcnRvZ3JhcGh5QXZhaWxhYmlsaXR5W107XHJcblxyXG4gIC8qKiB3aGV0aGVyIGxheWVyIGlzIHF1ZXJ5YWJsZSovIFxyXG4gIHB1YmxpYyBzZWxlY3RhYmxlRmVhdHVyZUVuYWJsZWQ6IEJvb2xlYW47XHJcblxyXG4gIC8qKiBzZWxlY3Rpb24gbGF5ZXIqL1xyXG4gIHB1YmxpYyBzZWxlY3Rpb25MYXllcjogc3RyaW5nO1xyXG5cclxuICAvKiogc2VsZWN0aW9uIHNlcnZpY2UqLyAgXHJcbiAgcHVibGljIHNlbGVjdGlvblNlcnZpY2U6IFNlcnZpY2U7XHJcblxyXG4gIC8qKiBsZWdlbmQgdGlwKi8gIFxyXG4gIHB1YmxpYyBsZWdlbmRUeXBlOiBzdHJpbmc7XHJcbiAgXHJcbiAgLyoqIGxlZ2VuZCB1cmwqL1xyXG4gIHB1YmxpYyBsZWdlbmRVUkw6IHN0cmluZztcclxuXHJcbiAgLyoqIHdoZXRoZXIgbGF5ZXIgaXMgZWRpdGFibGUqL1xyXG4gIHB1YmxpYyBlZGl0YWJsZTogQm9vbGVhbjtcclxuXHJcbiAgLyoqIG1ldGFkYXRhIFVSTCovXHJcbiAgcHVibGljIG1ldGFkYXRhVVJMOiBzdHJpbmc7XHJcblxyXG4gIC8qKiBtZXRhZGF0YSBVUkwqL1xyXG4gIHB1YmxpYyBkYXRhc2V0VVJMOiBzdHJpbmc7XHJcblxyXG4gIC8qKiB3aGV0aGVyIGxheWVyIGlzIHRoZW1hYmxlKi9cclxuICBwdWJsaWMgdGhlbWF0aWM6IEJvb2xlYW47XHJcbiAgXHJcbiAgLyoqIGdlb21ldHJ5IHR5cGUqL1xyXG4gIHB1YmxpYyBnZW9tZXRyeVR5cGU6IHN0cmluZztcclxuXHJcbiAgcHVibGljIHN0eWxlcz86IENhcnRvZ3JhcGh5U3R5bGVbXVxyXG5cclxuICBwdWJsaWMgdXNlQWxsU3R5bGVzOiBib29sZWFuO1xyXG4gIFxyXG5cclxufVxyXG4iLCJpbXBvcnQgeyBDYXJ0b2dyYXBoeSB9IGZyb20gJy4vY2FydG9ncmFwaHkubW9kZWwnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IFJlc3RTZXJ2aWNlIH0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBDb25uZWN0aW9uIH0gZnJvbSAnLi4vY29ubmVjdGlvbi9jb25uZWN0aW9uLm1vZGVsJztcclxuaW1wb3J0IHsgU2VydmljZSB9IGZyb20gJy4uL3NlcnZpY2Uvc2VydmljZS5tb2RlbCc7XHJcblxyXG4vKiogQ2FydG9ncmFwaHkgbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIENhcnRvZ3JhcGh5U2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPENhcnRvZ3JhcGh5PiB7XHJcblxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBDQVJUT0dSQVBIWV9BUEkgPSAnY2FydG9ncmFwaGllcyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3RvciwgcHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihDYXJ0b2dyYXBoeSwgXCJjYXJ0b2dyYXBoaWVzXCIsIGluamVjdG9yKTtcclxuICB9XHJcblxyXG4gIC8qKiByZW1vdmUgY2FydG9ncmFwaHkqL1xyXG4gIHJlbW92ZShpdGVtOiBDYXJ0b2dyYXBoeSkge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuXHJcbiAgfVxyXG5cclxuICAvKiogc2F2ZSBjYXJ0b2dyYXBoeSovXHJcbiAgc2F2ZShpdGVtOiBDYXJ0b2dyYXBoeSk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcblxyXG4gICAgbGV0IGNhcnRvZ3JhcGh5Q29ubmVjdGlvbjphbnk9e307XHJcbiAgICBjYXJ0b2dyYXBoeUNvbm5lY3Rpb24uX2xpbmtzID0ge307XHJcbiAgICBjYXJ0b2dyYXBoeUNvbm5lY3Rpb24uX2xpbmtzLnNlbGYgPSB7fTtcclxuICAgIGNhcnRvZ3JhcGh5Q29ubmVjdGlvbi5fbGlua3Muc2VsZi5ocmVmID0gXCJcIjtcclxuICAgICBcclxuICAgIGxldCBjYXJ0b2dyYXBoeVNlcnZpY2U6YW55PXt9O1xyXG4gICAgY2FydG9ncmFwaHlTZXJ2aWNlLl9saW5rcyA9IHt9O1xyXG4gICAgY2FydG9ncmFwaHlTZXJ2aWNlLl9saW5rcy5zZWxmID0ge307XHJcbiAgICBjYXJ0b2dyYXBoeVNlcnZpY2UuX2xpbmtzLnNlbGYuaHJlZiA9IFwiXCI7XHJcbiAgICBcclxuICAgIGxldCBjYXJ0b2dyYXBoeVNlbGVjdGlvblNlcnZpY2U6YW55ID0ge307XHJcbiAgICBjYXJ0b2dyYXBoeVNlbGVjdGlvblNlcnZpY2UuX2xpbmtzID0ge307XHJcbiAgICBjYXJ0b2dyYXBoeVNlbGVjdGlvblNlcnZpY2UuX2xpbmtzLnNlbGYgPSB7fTtcclxuICAgIGNhcnRvZ3JhcGh5U2VsZWN0aW9uU2VydmljZS5fbGlua3Muc2VsZi5ocmVmID0gXCJcIjtcclxuXHJcbiAgICBpZiAoaXRlbS5zZXJ2aWNlICE9IG51bGwpIHtcclxuICAgICAgY2FydG9ncmFwaHlTZXJ2aWNlPSAgaXRlbS5zZXJ2aWNlO1xyXG4gICAgICBpZiAodHlwZW9mIGl0ZW0uc2VydmljZS5fbGlua3MgIT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICBpdGVtLnNlcnZpY2UgPSBpdGVtLnNlcnZpY2UuX2xpbmtzLnNlbGYuaHJlZjtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChpdGVtLnNlbGVjdGlvblNlcnZpY2UgIT0gbnVsbCkge1xyXG4gICAgICBjYXJ0b2dyYXBoeVNlbGVjdGlvblNlcnZpY2UgPSBpdGVtLnNlbGVjdGlvblNlcnZpY2VcclxuICAgICAgaWYgKHR5cGVvZiBpdGVtLnNlbGVjdGlvblNlcnZpY2UuX2xpbmtzICE9ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgaXRlbS5zZWxlY3Rpb25TZXJ2aWNlID0gaXRlbS5zZWxlY3Rpb25TZXJ2aWNlLl9saW5rcy5zZWxmLmhyZWY7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAoaXRlbS5jb25uZWN0aW9uICE9IG51bGwpIHtcclxuICAgICAgY2FydG9ncmFwaHlDb25uZWN0aW9uPSAgaXRlbS5jb25uZWN0aW9uO1xyXG4gICAgICBpZiAodHlwZW9mIGl0ZW0uY29ubmVjdGlvbi5fbGlua3MgIT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICBpdGVtLmNvbm5lY3Rpb24gPSBpdGVtLmNvbm5lY3Rpb24uX2xpbmtzLnNlbGYuaHJlZjtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChpdGVtLl9saW5rcyAhPSBudWxsKSB7XHJcblxyXG4gICAgICAvL3VwZGF0ZSByZWxhdGlvbnNcclxuICAgICAgZGVsZXRlIGl0ZW0uY29ubmVjdGlvbjtcclxuICAgICAgZGVsZXRlIGl0ZW0uc2VydmljZTtcclxuICAgICAgZGVsZXRlIGl0ZW0uc2VsZWN0aW9uU2VydmljZTtcclxuXHJcbiAgICAgIC8vIGlmIChjYXJ0b2dyYXBoeUNvbm5lY3Rpb24uX2xpbmtzLnNlbGYuaHJlZiA9PSAnJyAmJiBjYXJ0b2dyYXBoeUNvbm5lY3Rpb24pIHtcclxuICAgICAgLy8gICBpdGVtLmRlbGV0ZVJlbGF0aW9uKCdzcGF0aWFsU2VsZWN0aW9uQ29ubmVjdGlvbicsIGNhcnRvZ3JhcGh5Q29ubmVjdGlvbikuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgIC8vICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG4gICAgICAvLyB9IGVsc2Uge1xyXG4gICAgICAvLyAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCdzcGF0aWFsU2VsZWN0aW9uQ29ubmVjdGlvbicsIGNhcnRvZ3JhcGh5Q29ubmVjdGlvbikuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgIC8vICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG4gICAgICAvLyB9XHJcblxyXG4gICAgICBpZiAoY2FydG9ncmFwaHlTZXJ2aWNlLl9saW5rcy5zZWxmLmhyZWYgPT0gJycpIHtcclxuICAgICAgICBpdGVtLmRlbGV0ZVJlbGF0aW9uKCdzZXJ2aWNlJywgY2FydG9ncmFwaHlTZXJ2aWNlKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ3NlcnZpY2UnLCBjYXJ0b2dyYXBoeVNlcnZpY2UpLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGNhcnRvZ3JhcGh5U2VsZWN0aW9uU2VydmljZS5fbGlua3Muc2VsZi5ocmVmID09ICcnICYmIGNhcnRvZ3JhcGh5U2VsZWN0aW9uU2VydmljZSkge1xyXG4gICAgICAgIGl0ZW0uZGVsZXRlUmVsYXRpb24oJ3NwYXRpYWxTZWxlY3Rpb25TZXJ2aWNlJywgY2FydG9ncmFwaHlTZWxlY3Rpb25TZXJ2aWNlKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ3NwYXRpYWxTZWxlY3Rpb25TZXJ2aWNlJywgY2FydG9ncmFwaHlTZWxlY3Rpb25TZXJ2aWNlKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLkNBUlRPR1JBUEhZX0FQSSksIGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcblxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG5pbXBvcnQge0NhcnRvZ3JhcGh5fSBmcm9tICcuL2NhcnRvZ3JhcGh5Lm1vZGVsJztcclxuaW1wb3J0IHtSb2xlfSBmcm9tICcuLi9yb2xlL3JvbGUubW9kZWwnO1xyXG4vKipcclxuICogQ2FydG9ncmFwaHkgZ3JvdXBcclxuICovXHJcbmV4cG9ydCBjbGFzcyBDYXJ0b2dyYXBoeUdyb3VwIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiBpZCAqL1xyXG4gIHB1YmxpYyBpZDogbnVtYmVyOyAgXHJcbiAgLyoqIG5hbWUqL1xyXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgLyoqIHR5cGUqL1xyXG4gIHB1YmxpYyB0eXBlOiBzdHJpbmc7XHJcbiAgLyoqIG1lbWJlcnMqL1xyXG4gIHB1YmxpYyBtZW1iZXJzOiBDYXJ0b2dyYXBoeVtdO1xyXG4gIC8qKiByb2xlcyovXHJcbiAgcHVibGljIHJvbGVzOiBSb2xlW107XHJcblxyXG59XHJcbiIsImltcG9ydCB7IENhcnRvZ3JhcGh5R3JvdXAgfSBmcm9tICcuL2NhcnRvZ3JhcGh5LWdyb3VwLm1vZGVsJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcblxyXG4vKiogQ2FydG9ncmFwaHlHcm91cCBtYW5hZ2VyIHNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgQ2FydG9ncmFwaHlHcm91cFNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxDYXJ0b2dyYXBoeUdyb3VwPiB7XHJcbiAgXHJcblxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBDQVJUT0dSQVBIWV9HUk9VUF9BUEkgPSdjYXJ0b2dyYXBoeS1ncm91cHMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihDYXJ0b2dyYXBoeUdyb3VwLCBcImNhcnRvZ3JhcGh5LWdyb3Vwc1wiLCBpbmplY3Rvcik7XHJcbiAgfVxyXG4gIFxyXG4gIC8qKiByZW1vdmUgY2FydG9ncmFwaHkgZ3JvdXAqL1xyXG4gIHJlbW92ZShpdGVtOiBDYXJ0b2dyYXBoeUdyb3VwKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgY2FydG9ncmFwaHkgZ3JvdXAqL1xyXG4gIHNhdmUoaXRlbTogQ2FydG9ncmFwaHlHcm91cCk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICBpZiAoaXRlbS5fbGlua3MhPW51bGwpIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5DQVJUT0dSQVBIWV9HUk9VUF9BUEkpICwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBcclxufVxyXG4iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuaW1wb3J0IHsgVGVycml0b3J5IH0gZnJvbSAnLi4vdGVycml0b3J5L3RlcnJpdG9yeS5tb2RlbCc7XHJcbmltcG9ydCB7IENhcnRvZ3JhcGh5IH0gZnJvbSAnLi9jYXJ0b2dyYXBoeS5tb2RlbCc7XHJcbi8qKlxyXG4gKiBDYXJ0b2dyYXBoeSBhdmFpbGFiaWxpdHkgbW9kZWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBDYXJ0b2dyYXBoeUF2YWlsYWJpbGl0eSBleHRlbmRzIFJlc291cmNlIHtcclxuICAvKiogdGVycml0b3J5Ki9cclxuICBwdWJsaWMgdGVycml0b3J5OiBUZXJyaXRvcnk7XHJcbiAgXHJcbiAgLyoqIHN5c3RlbSBjcmVhdGVkIGRhdGUqL1xyXG4gIHB1YmxpYyBjcmVhdGVkRGF0ZTogYW55O1xyXG4gIFxyXG4gIC8qKiBjYXJ0b2dyYXBoeSovXHJcbiAgcHVibGljIGNhcnRvZ3JhcGh5OiBDYXJ0b2dyYXBoeTtcclxufVxyXG4iLCJpbXBvcnQgeyBDYXJ0b2dyYXBoeUF2YWlsYWJpbGl0eSB9IGZyb20gJy4vY2FydG9ncmFwaHktYXZhaWxhYmlsaXR5Lm1vZGVsJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcblxyXG4vKiogQ2FydG9ncmFwaHlBdmFpbGFiaWxpdHkgbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKCkgXHJcbmV4cG9ydCBjbGFzcyBDYXJ0b2dyYXBoeUF2YWlsYWJpbGl0eVNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxDYXJ0b2dyYXBoeUF2YWlsYWJpbGl0eT4ge1xyXG4gIFxyXG5cclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgQ0FSVE9HUkFQSFlfQVZBSUxBQklMSVRZX0FQSSA9ICdjYXJ0b2dyYXBoeS1hdmFpbGFiaWxpdGllcyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKENhcnRvZ3JhcGh5QXZhaWxhYmlsaXR5LCBcImNhcnRvZ3JhcGh5LWF2YWlsYWJpbGl0aWVzXCIsIGluamVjdG9yKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqIHJlbW92ZSBjYXJ0b2dyYXBoeSBhdmFpbGFiaWxpdHkqL1xyXG4gIHJlbW92ZShpdGVtOiBDYXJ0b2dyYXBoeUF2YWlsYWJpbGl0eSkge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIGNhcnRvZ3JhcGh5IGF2YWlsYWJpbGl0eSovXHJcbiAgc2F2ZShpdGVtOiBDYXJ0b2dyYXBoeUF2YWlsYWJpbGl0eSk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICBpZiAoaXRlbS5fbGlua3MhPW51bGwpIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgICBpZiAoaXRlbS5jYXJ0b2dyYXBoeSAhPW51bGwpe1xyXG4gICAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ2NhcnRvZ3JhcGh5JyxpdGVtLmNhcnRvZ3JhcGh5KS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgXHJcbiAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoaXRlbS50ZXJyaXRvcnkgIT1udWxsKXtcclxuICAgICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCd0ZXJyaXRvcnknLGl0ZW0udGVycml0b3J5KS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgXHJcbiAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaXRlbS50ZXJyaXRvcnkgPSBpdGVtLnRlcnJpdG9yeS5fbGlua3Muc2VsZi5ocmVmO1xyXG4gICAgICBpdGVtLmNhcnRvZ3JhcGh5ID0gaXRlbS5jYXJ0b2dyYXBoeS5fbGlua3Muc2VsZi5ocmVmO1xyXG4gIFxyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLkNBUlRPR1JBUEhZX0FWQUlMQUJJTElUWV9BUEkpICwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBcclxufVxyXG4iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuaW1wb3J0IHsgVGVycml0b3J5VHlwZSB9IGZyb20gJy4uL3RlcnJpdG9yeS90ZXJyaXRvcnktdHlwZS5tb2RlbCc7XHJcbmltcG9ydCB7IENhcnRvZ3JhcGh5IH0gZnJvbSAnLi9jYXJ0b2dyYXBoeS5tb2RlbCc7XHJcbi8qKlxyXG4gKiBDYXJ0b2dyYXBoeSBhdmFpbGFiaWxpdHkgbW9kZWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBDYXJ0b2dyYXBoeUZpbHRlciBleHRlbmRzIFJlc291cmNlIHtcclxuIFxyXG4gIC8qKiBuYW1lKi9cclxuICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG5cclxuICAvKiogcmVxdWlyZWQgKi9cclxuICBwdWJsaWMgcmVxdWlyZWQ6IGJvb2xlYW47XHJcblxyXG4gIC8qKiB0eXBlKi9cclxuICBwdWJsaWMgdHlwZTogc3RyaW5nO1xyXG5cclxuICAvKiogVGVycml0b3JpYWwgbGV2ZWwuICovXHJcbiAgcHVibGljIHRlcnJpdG9yaWFsTGV2ZWw6IFRlcnJpdG9yeVR5cGU7XHJcbiAgXHJcbiAgLyoqIGNvbHVtbiAqL1xyXG4gIHB1YmxpYyBjb2x1bW46IHN0cmluZztcclxuXHJcbiAgLyoqIHZhbHVlcyovICBcclxuICBwdWJsaWMgdmFsdWVzOiBzdHJpbmc7XHJcblxyXG4gIC8qKiB2YWx1ZSovICBcclxuICBwdWJsaWMgdmFsdWVUeXBlOiBzdHJpbmc7XHJcblxyXG4gIC8qKiBjYXJ0b2dyYXBoeSovXHJcbiAgcHVibGljIGNhcnRvZ3JhcGh5OiBDYXJ0b2dyYXBoeTtcclxuXHJcblxyXG59XHJcbiIsImltcG9ydCB7IENhcnRvZ3JhcGh5RmlsdGVyIH0gZnJvbSAnLi9jYXJ0b2dyYXBoeS1maWx0ZXIubW9kZWwnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuXHJcbi8qKiBDYXJ0b2dyYXBoeUZpbHRlciBtYW5hZ2VyIHNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKSBcclxuZXhwb3J0IGNsYXNzIENhcnRvZ3JhcGh5RmlsdGVyU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPENhcnRvZ3JhcGh5RmlsdGVyPiB7XHJcbiAgXHJcblxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBDQVJUT0dSQVBIWV9GSUxURVJfQVBJID0gJ2NhcnRvZ3JhcGh5LWZpbHRlcnMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihDYXJ0b2dyYXBoeUZpbHRlciwgXCJjYXJ0b2dyYXBoeS1maWx0ZXJzXCIsIGluamVjdG9yKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqIHJlbW92ZSBjYXJ0b2dyYXBoeSBmaWx0ZXIqL1xyXG4gIHJlbW92ZShpdGVtOiBDYXJ0b2dyYXBoeUZpbHRlcikge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIGNhcnRvZ3JhcGh5IGF2YWlsYWJpbGl0eSovXHJcbiAgc2F2ZShpdGVtOiBDYXJ0b2dyYXBoeUZpbHRlcik6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICBpZiAoaXRlbS5fbGlua3MhPW51bGwpIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgICBpZiAoaXRlbS5jYXJ0b2dyYXBoeSAhPW51bGwpe1xyXG4gICAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ2NhcnRvZ3JhcGh5JyxpdGVtLmNhcnRvZ3JhcGh5KS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZihpdGVtLnRlcnJpdG9yaWFsTGV2ZWwgIT0gbnVsbCAmJiBpdGVtLnRlcnJpdG9yaWFsTGV2ZWwgIT0gdW5kZWZpbmVkICl7XHJcbiAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ3RlcnJpdG9yaWFsTGV2ZWwnLGl0ZW0udGVycml0b3JpYWxMZXZlbCkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG4gICAgICB9XHJcbiAgICAgXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBcclxuICAgICAgaXRlbS5jYXJ0b2dyYXBoeSA9IGl0ZW0uY2FydG9ncmFwaHkuX2xpbmtzLnNlbGYuaHJlZjtcclxuICAgICAgaXRlbS50ZXJyaXRvcmlhbExldmVsPWl0ZW0udGVycml0b3JpYWxMZXZlbC5fbGlua3Muc2VsZi5ocmVmO1xyXG4gICAgICBcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5DQVJUT0dSQVBIWV9GSUxURVJfQVBJKSAsIGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgXHJcbn1cclxuIiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcbmltcG9ydCB7Q2FydG9ncmFwaHl9IGZyb20gJy4vY2FydG9ncmFwaHkubW9kZWwnOyBcclxuLyoqXHJcbiAqIFNlcnZpY2UgcGFyYW1ldGVyIG1vZGVsXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgQ2FydG9ncmFwaHlQYXJhbWV0ZXIgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgLyoqIG5hbWUqL1xyXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgXHJcbiAgLyoqIHR5cGUqL1xyXG4gIHB1YmxpYyB0eXBlOiBzdHJpbmc7XHJcbiAgICBcclxuICAvKiogdmFsdWUqLyAgXHJcbiAgcHVibGljIHZhbHVlOiBzdHJpbmc7XHJcbiAgXHJcbiAgLyoqIG9yZGVyKi8gIFxyXG4gIHB1YmxpYyBvcmRlcjogc3RyaW5nO1xyXG5cclxuICAvKiogY2FydG9ncmFwaHkqL1xyXG4gIHB1YmxpYyBjYXJ0b2dyYXBoeTogQ2FydG9ncmFwaHk7XHJcblxyXG59XHJcbiIsImltcG9ydCB7IENhcnRvZ3JhcGh5UGFyYW1ldGVyIH0gZnJvbSAnLi9jYXJ0b2dyYXBoeS1wYXJhbWV0ZXIubW9kZWwnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuXHJcbi8qKiBTZXJ2aWNlIHBhcmFtZXRlciBtYW5hZ2VyIHNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKSBcclxuZXhwb3J0IGNsYXNzIENhcnRvZ3JhcGh5UGFyYW1ldGVyU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPENhcnRvZ3JhcGh5UGFyYW1ldGVyPiB7XHJcblxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBDQVJUT0dSQVBIWV9QQVJBTUVURVJfQVBJID0gJ2NhcnRvZ3JhcGh5LXBhcmFtZXRlcnMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihDYXJ0b2dyYXBoeVBhcmFtZXRlciwgXCJjYXJ0b2dyYXBoeS1wYXJhbWV0ZXJzXCIsIGluamVjdG9yKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqIHJlbW92ZSBzZXJ2aWNlIHBhcmFtZXRlciovXHJcbiAgcmVtb3ZlKGl0ZW06IENhcnRvZ3JhcGh5UGFyYW1ldGVyKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgc2VydmljZSBwYXJhbWV0ZXIqL1xyXG4gIHNhdmUoaXRlbTogQ2FydG9ncmFwaHlQYXJhbWV0ZXIpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIFxyXG4gICAgICBcclxuICAgICAgaWYgKGl0ZW0uY2FydG9ncmFwaHkgIT1udWxsKXtcclxuICAgICAgICAgIGxldCBjYXJ0b2dyYXBoeSA9ICBpdGVtLmNhcnRvZ3JhcGh5O1xyXG4gICAgICAgICAgZGVsZXRlIGl0ZW0uY2FydG9ncmFwaHk7XHJcbiAgICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbignY2FydG9ncmFwaHknLGNhcnRvZ3JhcGh5KS5zdWJzY3JpYmUocmVzdWx0ID0+IHsgICAgICAgICAgICBcclxuICAgICAgICAgIFxyXG4gICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH1cclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgICBcclxuICAgICAgXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpdGVtLmNhcnRvZ3JhcGh5ID0gaXRlbS5jYXJ0b2dyYXBoeS5fbGlua3Muc2VsZi5ocmVmO1xyXG4gIFxyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLkNBUlRPR1JBUEhZX1BBUkFNRVRFUl9BUEkpICwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBcclxufVxyXG4iLCJpbXBvcnQgeyBDYXJ0b2dyYXBoeVBhcmFtZXRlciB9IGZyb20gJy4vY2FydG9ncmFwaHktcGFyYW1ldGVyLm1vZGVsJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcblxyXG4vKiogU2VydmljZSBwYXJhbWV0ZXIgbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKCkgXHJcbmV4cG9ydCBjbGFzcyBDYXJ0b2dyYXBoeVNwYXRpYWxTZWxlY3Rpb25QYXJhbWV0ZXJTZXJ2aWNlIGV4dGVuZHMgUmVzdFNlcnZpY2U8Q2FydG9ncmFwaHlQYXJhbWV0ZXI+IHtcclxuXHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIENBUlRPR1JBUEhZX1NQQVRJQUxfU0VMRUNUSU9OX1BBUkFNRVRFUl9BUEkgPSAnY2FydG9ncmFwaHktc3BhdGlhbC1zZWxlY3Rpb24tcGFyYW1ldGVycyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKENhcnRvZ3JhcGh5UGFyYW1ldGVyLCBcImNhcnRvZ3JhcGh5LXNwYXRpYWwtc2VsZWN0aW9uLXBhcmFtZXRlcnNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIHNlcnZpY2UgcGFyYW1ldGVyKi9cclxuICByZW1vdmUoaXRlbTogQ2FydG9ncmFwaHlQYXJhbWV0ZXIpIHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKGl0ZW0uX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgIFxyXG4gIH1cclxuICBcclxuICAvKiogc2F2ZSBzZXJ2aWNlIHBhcmFtZXRlciovXHJcbiAgc2F2ZShpdGVtOiBDYXJ0b2dyYXBoeVBhcmFtZXRlcik6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICBpZiAoaXRlbS5fbGlua3MhPW51bGwpIHtcclxuICAgICAgXHJcbiAgICAgIFxyXG4gICAgICBpZiAoaXRlbS5jYXJ0b2dyYXBoeSAhPW51bGwpe1xyXG4gICAgICAgICAgbGV0IGNhcnRvZ3JhcGh5ID0gIGl0ZW0uY2FydG9ncmFwaHk7XHJcbiAgICAgICAgICBkZWxldGUgaXRlbS5jYXJ0b2dyYXBoeTtcclxuICAgICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCdjYXJ0b2dyYXBoeScsY2FydG9ncmFwaHkpLnN1YnNjcmliZShyZXN1bHQgPT4geyAgICAgICAgICAgIFxyXG4gICAgICAgICAgXHJcbiAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgfVxyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucHV0KGl0ZW0uX2xpbmtzLnNlbGYuaHJlZiwgaXRlbSk7XHJcbiAgICAgIFxyXG4gICAgICBcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGl0ZW0uY2FydG9ncmFwaHkgPSBpdGVtLmNhcnRvZ3JhcGh5Ll9saW5rcy5zZWxmLmhyZWY7XHJcbiAgXHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuQ0FSVE9HUkFQSFlfU1BBVElBTF9TRUxFQ1RJT05fUEFSQU1FVEVSX0FQSSkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG5pbXBvcnQge0NhcnRvZ3JhcGh5fSBmcm9tICcuL2NhcnRvZ3JhcGh5Lm1vZGVsJzsgXHJcbi8qKlxyXG4gKiBDYXJ0b2dyYXBoeSBzdHlsZSBtb2RlbFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIENhcnRvZ3JhcGh5U3R5bGUgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgLyoqIG5hbWUqL1xyXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgXHJcbiAgLyoqIHRpdGxlKi9cclxuICBwdWJsaWMgdGl0bGU6IHN0cmluZztcclxuICAgIFxyXG4gIC8qKiBkZXNjcmlwdGlvbiovICBcclxuICBwdWJsaWMgZGVzY3JpcHRpb246IHN0cmluZztcclxuICBcclxuICAvKiogZm9ybWF0Ki8gIFxyXG4gIHB1YmxpYyBmb3JtYXQ6IHN0cmluZztcclxuICBcclxuICAvKiogd2lkdGgqLyAgXHJcbiAgcHVibGljIHdpZHRoOiBudW1iZXI7XHJcbiAgXHJcbiAgLyoqIGhlaWdodCovICBcclxuICBwdWJsaWMgaGVpZ2h0OiBudW1iZXI7XHJcbiAgXHJcbiAgLyoqIHVybCovICBcclxuICBwdWJsaWMgdXJsOiBzdHJpbmc7XHJcblxyXG4gIC8qKiBjYXJ0b2dyYXBoeSovXHJcbiAgcHVibGljIGNhcnRvZ3JhcGh5OiBDYXJ0b2dyYXBoeTtcclxuXHJcbiAgcHVibGljIGRlZmF1bHRTdHlsZTogYm9vbGVhbjtcclxuXHJcbiAgcHVibGljIGxlZ2VuZFVSTDogYW55O1xyXG4gIFxyXG5cclxufVxyXG4iLCJpbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQ2FydG9ncmFwaHlTdHlsZSB9IGZyb20gJy4vY2FydG9ncmFwaHktc3R5bGUubW9kZWwnO1xyXG5cclxuQEluamVjdGFibGUoe1xyXG4gIHByb3ZpZGVkSW46ICdyb290J1xyXG59KVxyXG5leHBvcnQgY2xhc3MgQ2FydG9ncmFwaHlTdHlsZVNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxDYXJ0b2dyYXBoeVN0eWxlPiB7XHJcblxyXG4gLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIENBUlRPR1JBUEhZX1NUWUxFU19BUEkgPSAnY2FydG9ncmFwaHktc3R5bGVzJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoQ2FydG9ncmFwaHlTdHlsZSwgXCJjYXJ0b2dyYXBoeS1zdHlsZXNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIHNlcnZpY2UgcGFyYW1ldGVyKi9cclxuICByZW1vdmUoaXRlbTogQ2FydG9ncmFwaHlTdHlsZSkge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIHNlcnZpY2UgcGFyYW1ldGVyKi9cclxuICBzYXZlKGl0ZW06IENhcnRvZ3JhcGh5U3R5bGUpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIFxyXG4gICAgICBcclxuICAgICAgaWYgKGl0ZW0uY2FydG9ncmFwaHkgIT1udWxsKXtcclxuICAgICAgICAgIGxldCBjYXJ0b2dyYXBoeSA9ICBpdGVtLmNhcnRvZ3JhcGh5O1xyXG4gICAgICAgICAgZGVsZXRlIGl0ZW0uY2FydG9ncmFwaHk7XHJcbiAgICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbignY2FydG9ncmFwaHknLGNhcnRvZ3JhcGh5KS5zdWJzY3JpYmUocmVzdWx0ID0+IHsgICAgICAgICAgICBcclxuICAgICAgICAgIFxyXG4gICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH1cclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgICBcclxuICAgICAgXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpdGVtLmNhcnRvZ3JhcGh5ID0gaXRlbS5jYXJ0b2dyYXBoeS5fbGlua3Muc2VsZi5ocmVmO1xyXG4gIFxyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLkNBUlRPR1JBUEhZX1NUWUxFU19BUEkpICwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBcclxufVxyXG4iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuaW1wb3J0IHtDYXJ0b2dyYXBoeUdyb3VwfSBmcm9tICcuL2NhcnRvZ3JhcGh5LWdyb3VwLm1vZGVsJztcclxuLyoqXHJcbiAqIEJhY2tncm91bmQgbW9kZWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBCYWNrZ3JvdW5kIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiBpZCAqL1xyXG4gIHB1YmxpYyBpZDogbnVtYmVyOyAgXHJcbiAgXHJcbiAgLyoqIG5hbWUqL1xyXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcblxyXG4gIC8qKiBkZXNjcmlwdGlvbiovXHJcbiAgcHVibGljIGRlc2NyaXB0aW9uOiBzdHJpbmc7XHJcblxyXG4gIC8qKiBpbWFnZSAqL1xyXG4gIHB1YmxpYyBpbWFnZTogc3RyaW5nO1xyXG5cclxuICAvKiogd2hldGhlciBiYWNrZ3JvdW5kIGlzIGFjdGl2ZSovXHJcbiAgcHVibGljIGFjdGl2ZTogQm9vbGVhbjtcclxuICBcclxuICAvKiogc3lzdGVtIGNyZWF0ZWQgZGF0ZSovXHJcbiAgcHVibGljIGNyZWF0ZWREYXRlOiBhbnk7XHJcblxyXG4gIC8qKiBjYXJ0b2dyYXBoeSBncm91cCovXHJcbiAgcHVibGljIGNhcnRvZ3JhcGh5R3JvdXA6IENhcnRvZ3JhcGh5R3JvdXA7XHJcbn1cclxuIiwiaW1wb3J0IHsgQmFja2dyb3VuZCB9IGZyb20gJy4vYmFja2dyb3VuZC5tb2RlbCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5cclxuLyoqIEJhY2tncm91bmQgbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIEJhY2tncm91bmRTZXJ2aWNlIGV4dGVuZHMgUmVzdFNlcnZpY2U8QmFja2dyb3VuZD4ge1xyXG5cclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgQkFDS0dST1VORF9BUEkgPSAnYmFja2dyb3VuZHMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihCYWNrZ3JvdW5kLCBcImJhY2tncm91bmRzXCIsIGluamVjdG9yKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqIHJlbW92ZSBiYWNrZ3JvdW5kKi9cclxuICByZW1vdmUoaXRlbTogQmFja2dyb3VuZCkge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTsgICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgYmFja2dyb3VuZCovXHJcbiAgc2F2ZShpdGVtOiBCYWNrZ3JvdW5kKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgIGxldCBiYWNrZ3JvdW5kQ2FydG9ncmFwaHlHcm91cDphbnkgPSB7fSAgICAgICAgIFxyXG4gICAgXHJcbiAgICBiYWNrZ3JvdW5kQ2FydG9ncmFwaHlHcm91cC5fbGlua3M9IHt9O1xyXG4gICAgYmFja2dyb3VuZENhcnRvZ3JhcGh5R3JvdXAuX2xpbmtzLnNlbGYgPSB7fTtcclxuICAgIGJhY2tncm91bmRDYXJ0b2dyYXBoeUdyb3VwLl9saW5rcy5zZWxmLmhyZWY9XCJcIjtcclxuICAgIGl0ZW0uY2FydG9ncmFwaHlHcm91cDtcclxuXHJcbiAgICBpZiAoaXRlbS5jYXJ0b2dyYXBoeUdyb3VwIT1udWxsKXtcclxuICAgICAgYmFja2dyb3VuZENhcnRvZ3JhcGh5R3JvdXAgPSBpdGVtLmNhcnRvZ3JhcGh5R3JvdXA7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBpdGVtLmNhcnRvZ3JhcGh5R3JvdXAuX2xpbmtzIT0gJ3VuZGVmaW5lZCcpIHsgXHJcbiAgICAgICAgICAgIGl0ZW0uY2FydG9ncmFwaHlHcm91cCA9IGl0ZW0uY2FydG9ncmFwaHlHcm91cC5fbGlua3Muc2VsZi5ocmVmO1xyXG4gICAgICAgIH0gICAgXHJcbiAgICAgfVxyXG5cclxuICAgIGlmIChpdGVtLl9saW5rcyE9bnVsbCkge1xyXG4gICAgICAvL3VwZGF0ZSByZWxhdGlvbnNcclxuICAgICAgZGVsZXRlIGl0ZW0uY2FydG9ncmFwaHlHcm91cDsgICAgICAgIFxyXG4gICAgICBcclxuICAgICAgaWYgKGJhY2tncm91bmRDYXJ0b2dyYXBoeUdyb3VwLl9saW5rcy5zZWxmLmhyZWY9PScnKXtcclxuICAgICAgICAgaXRlbS5kZWxldGVSZWxhdGlvbignY2FydG9ncmFwaHlHcm91cCcsYmFja2dyb3VuZENhcnRvZ3JhcGh5R3JvdXApLnN1YnNjcmliZShyZXN1bHQgPT4geyAgICAgXHJcblxyXG4gICAgICAgICAgXHJcbiAgICAgICAgICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgICAgICBcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCdjYXJ0b2dyYXBoeUdyb3VwJyxiYWNrZ3JvdW5kQ2FydG9ncmFwaHlHcm91cCkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgICAgIFxyXG5cclxuICAgICAgXHJcbiAgICAgICAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTsgICAgICAgICAgIFxyXG4gICAgICAgfSBcclxuICAgICAgIFxyXG4gICAgICAgICBcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG5cclxuICAgICAgICAgICBcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuQkFDS0dST1VORF9BUEkpICwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBcclxufVxyXG4iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuaW1wb3J0IHtUcmVlTm9kZX0gZnJvbSAnLi90cmVlLW5vZGUubW9kZWwnO1xyXG5pbXBvcnQge1JvbGV9IGZyb20gJy4uL3JvbGUvcm9sZS5tb2RlbCc7ICAgIFxyXG4vKipcclxuICogVHJlZSBtb2RlbFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFRyZWUgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgLyoqIGlkICovXHJcbiAgcHVibGljIGlkOiBudW1iZXI7XHJcbiAgLyoqIG5hbWUgKi9cclxuICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG4gIC8qKiBkZXNjcmlwdGlvbiAqL1xyXG4gIHB1YmxpYyBkZXNjcmlwdGlvbjogc3RyaW5nO1xyXG4gIC8qKiBpbWFnZSAqL1xyXG4gIHB1YmxpYyBpbWFnZTogc3RyaW5nO1xyXG4gIC8qKiBub2RlcyAqL1xyXG4gIHB1YmxpYyBub2RlczogVHJlZU5vZGVbXTtcclxuICAvKiogYXZhaWxhYmxlIHJvbGVzICovXHJcbiAgcHVibGljIGF2YWlsYWJsZVJvbGVzIDogUm9sZVtdO1xyXG5cclxufVxyXG4iLCJpbXBvcnQgeyBUcmVlIH0gZnJvbSAnLi90cmVlLm1vZGVsJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcblxyXG4vKiogVHJlZSBtYW5hZ2VyIHNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgVHJlZVNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxUcmVlPiB7XHJcbiAgXHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIFRSRUVfQVBJID0gJ3RyZWVzJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoVHJlZSwgXCJ0cmVlc1wiLCBpbmplY3Rvcik7XHJcbiAgfVxyXG4gIFxyXG4gIC8qKiByZW1vdmUgdHJlZSovXHJcbiAgcmVtb3ZlKGl0ZW06IFRyZWUpIHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKGl0ZW0uX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgIFxyXG4gIH1cclxuICBcclxuICAvKiogc2F2ZSB0cmVlKi9cclxuICBzYXZlKGl0ZW06IFRyZWUpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIFxyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucHV0KGl0ZW0uX2xpbmtzLnNlbGYuaHJlZiwgaXRlbSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLlRSRUVfQVBJKSAsIGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgXHJcbn1cclxuIiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcbmltcG9ydCB7Q2FydG9ncmFwaHl9IGZyb20gJy4uL2NhcnRvZ3JhcGh5L2NhcnRvZ3JhcGh5Lm1vZGVsJztcclxuaW1wb3J0IHtUcmVlfSBmcm9tICcuL3RyZWUubW9kZWwnO1xyXG4vKipcclxuICogVHJlZSBub2RlIG1vZGVsXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgVHJlZU5vZGUgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgLyoqIG5hbWUgKi9cclxuICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG4gIC8qKiB0b29sdGlwKi9cclxuICBwdWJsaWMgdG9vbHRpcDogc3RyaW5nO1xyXG4gIC8qKiBkZXNjcmlwdGlvbiovXHJcbiAgcHVibGljIGRlc2NyaXB0aW9uOiBzdHJpbmc7XHJcbiAgLyoqIGRhdGFzZXRVUkwqL1xyXG4gIHB1YmxpYyBkYXRhc2V0VVJMOiBzdHJpbmc7XHJcbiAgLyoqIG1ldGFkYXRhVVJMKi9cclxuICBwdWJsaWMgbWV0YWRhdGFVUkw6IHN0cmluZztcclxuICAvKiogb3JkZXIqL1xyXG4gIHB1YmxpYyBvcmRlciA6IG51bWJlcjtcclxuICAvKiogd2hldGhlciB0cmVlIG5vZGUgaXMgYWN0aXZlKi9cclxuICBwdWJsaWMgYWN0aXZlOiBib29sZWFuO1xyXG4gIC8qKiBwYXJlbnQgdHJlZSBub2RlICovXHJcbiAgcHVibGljIHJhZGlvOiBib29sZWFuO1xyXG4gIC8qKiBwYXJlbnQgdHJlZSBub2RlICovXHJcbiAgcHVibGljIHBhcmVudDogVHJlZU5vZGU7XHJcbiAgLyoqIGRpc3BsYXllZCBjYXJ0b2dyYXBoeSAqLyAgXHJcbiAgcHVibGljIGNhcnRvZ3JhcGh5OiBDYXJ0b2dyYXBoeTtcclxuICAvKiogdHJlZSAqLyAgXHJcbiAgcHVibGljIHRyZWU6IFRyZWU7XHJcbiAgLyoqIGZpbHRlckdldEZlYXR1cmVJbmZvICovICBcclxuICBwdWJsaWMgZmlsdGVyR2V0RmVhdHVyZUluZm86IGJvb2xlYW47XHJcbiAgLyoqIGZpbHRlckdldE1hcCAqLyAgXHJcbiAgcHVibGljIGZpbHRlckdldE1hcDogYm9vbGVhbjtcclxuICAvKiogZmlsdGVyU2VsZWN0YWJsZSAqLyAgXHJcbiAgcHVibGljIGZpbHRlclNlbGVjdGFibGU6IGJvb2xlYW47XHJcbiAgLyoqIHN0eWxlICovICBcclxuICBwdWJsaWMgc3R5bGU6IHN0cmluZztcclxuICBcclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgVHJlZU5vZGUgfSBmcm9tICcuL3RyZWUtbm9kZS5tb2RlbCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5cclxuLyoqIFRyZWUgbm9kZSBtYW5hZ2VyIHNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKSBcclxuZXhwb3J0IGNsYXNzIFRyZWVOb2RlU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPFRyZWVOb2RlPiB7XHJcbiAgXHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIFRSRUVfTk9ERV9BUEkgPSAndHJlZS1ub2Rlcyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKFRyZWVOb2RlLCBcInRyZWUtbm9kZXNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIHRyZWUgbm9kZSovXHJcbiAgcmVtb3ZlKGl0ZW06IFRyZWVOb2RlKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgdHJlZSBub2RlKi9cclxuICBzYXZlKGl0ZW06IFRyZWVOb2RlKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgIGlmIChpdGVtLl9saW5rcyE9bnVsbCkge1xyXG4gICAgICBjb25zdCBpdGVtVHJlZSA9IGl0ZW0udHJlZTtcclxuICAgICAgY29uc3QgaXRlbUNhcnRvZ3JhcGh5ID0gaXRlbS5jYXJ0b2dyYXBoeTtcclxuICAgICAgY29uc3QgaXRlbVBhcmVudCA9IGl0ZW0ucGFyZW50O1xyXG4gICAgICAgIFxyXG4gICAgICBkZWxldGUgaXRlbS50cmVlO1xyXG4gICAgICBkZWxldGUgaXRlbS5jYXJ0b2dyYXBoeTtcclxuICAgICAgZGVsZXRlIGl0ZW0ucGFyZW50O1xyXG4gICAgICAgIFxyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucHV0KGl0ZW0uX2xpbmtzLnNlbGYuaHJlZiwgaXRlbSk7XHJcbiAgICAgIGlmIChpdGVtVHJlZSAhPW51bGwpe1xyXG4gICAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ3RyZWUnLGl0ZW1UcmVlKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgXHJcbiAgICAgICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGl0ZW1DYXJ0b2dyYXBoeSAhPW51bGwpe1xyXG4gICAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ2NhcnRvZ3JhcGh5JyxpdGVtQ2FydG9ncmFwaHkpLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICBcclxuICAgICAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoaXRlbVBhcmVudCAhPW51bGwpe1xyXG4gICAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ3BhcmVudCcsaXRlbVBhcmVudCkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgIFxyXG4gICAgICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2V7XHJcbiAgICAgICAgICBsZXQgdHJlZU5vZGVQYXJlbnQ6YW55ID0ge307XHJcbiAgICAgICAgICB0cmVlTm9kZVBhcmVudC5fbGlua3M9IHt9O1xyXG4gICAgICAgICAgdHJlZU5vZGVQYXJlbnQuX2xpbmtzLnNlbGYgPSB7fTtcclxuICAgICAgICAgIHRyZWVOb2RlUGFyZW50Ll9saW5rcy5zZWxmLmhyZWY9XCJcIjtcclxuICAgICAgICAgIGl0ZW0uZGVsZXRlUmVsYXRpb24oJ3BhcmVudCcsIHRyZWVOb2RlUGFyZW50KS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAoaXRlbS50cmVlICYmIGl0ZW0udHJlZS5fbGlua3MgJiYgaXRlbS50cmVlLl9saW5rcy5zZWxmKSB7XHJcbiAgICAgICAgaXRlbS50cmVlID0gaXRlbS50cmVlLl9saW5rcy5zZWxmLmhyZWY7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGl0ZW0uY2FydG9ncmFwaHkgJiYgaXRlbS5jYXJ0b2dyYXBoeS5fbGlua3MgJiYgaXRlbS5jYXJ0b2dyYXBoeS5fbGlua3Muc2VsZikge1xyXG4gICAgICAgIGl0ZW0uY2FydG9ncmFwaHkgPSBpdGVtLmNhcnRvZ3JhcGh5Ll9saW5rcy5zZWxmLmhyZWY7XHJcbiAgICAgIH0gICAgICBcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5UUkVFX05PREVfQVBJKSAsIGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgXHJcbn1cclxuIiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcbmltcG9ydCB7VHJlZX0gZnJvbSAnLi4vdHJlZS90cmVlLm1vZGVsJztcclxuaW1wb3J0IHtSb2xlfSBmcm9tICcuLi9yb2xlL3JvbGUubW9kZWwnO1xyXG5pbXBvcnQge0NhcnRvZ3JhcGh5R3JvdXB9IGZyb20gJy4uL2NhcnRvZ3JhcGh5L2NhcnRvZ3JhcGh5LWdyb3VwLm1vZGVsJztcclxuaW1wb3J0IHtBcHBsaWNhdGlvblBhcmFtZXRlcn0gZnJvbSAnLi9hcHBsaWNhdGlvbi1wYXJhbWV0ZXIubW9kZWwnO1xyXG5pbXBvcnQge0FwcGxpY2F0aW9uQmFja2dyb3VuZH0gZnJvbSAnLi9hcHBsaWNhdGlvbi1iYWNrZ3JvdW5kLm1vZGVsJztcclxuXHJcbi8vRklYTUUgZW5zdXJlIGFwcGxpY2F0aW9uIGNyZWF0aW9uIGluIGFkbWluIGFwcCB1cG9uIGluaXRpYWxpemF0aW9uIChhcyBpdCBpcyBkb25lIHdpdGggUm9sZXMgYW5kIGRlZmF1bHQgVXNlcnMpXHJcbi8qKiBUZXJyaXRvcmlhbCBhcHBsaWN0aW9uIG5hbWUgKi9cclxuZXhwb3J0IGNvbnN0IFRFUlJJVE9SSUFMX0FQUF9OQU1FOnN0cmluZyAgPSBcIkFwbGljYWNpw4PCs24gVGVycml0b3JpYWxcIjtcclxuXHJcbi8qKlxyXG4gKiBBcHBsaWNhdGlvbiBtb2RlbFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEFwcGxpY2F0aW9uIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiBpZCAqL1xyXG4gIHB1YmxpYyBpZDogbnVtYmVyOyAgXHJcbiAgXHJcbiAgLyoqIG5hbWUqL1xyXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcblxyXG4gIC8qKiB0eXBlKi9cclxuICBwdWJsaWMgdHlwZTogc3RyaW5nO1xyXG4gIFxyXG4gIC8qKiB0aXRsZSovXHJcbiAgcHVibGljIHRpdGxlOiBzdHJpbmc7XHJcbiAgXHJcbiAgLyoqIHRoZW1lKi9cclxuICBwdWJsaWMgdGhlbWU6IHN0cmluZztcclxuXHJcbiAgICBcclxuICAvKiogdXJsVGVtcGxhdGUqL1xyXG4gIHB1YmxpYyBqc3BUZW1wbGF0ZTogc3RyaW5nO1xyXG4gIFxyXG4gIFxyXG4gIC8qKiBzeXN0ZW0gY3JlYXRlZCBkYXRlKi9cclxuICBwdWJsaWMgY3JlYXRlZERhdGU6IGFueTtcclxuICBcclxuICAvKiogYXZhaWxhYmxlIHJvbGVzKi9cclxuICBwdWJsaWMgYXZhaWxhYmxlUm9sZXMgOiBSb2xlW107XHJcbiAgXHJcbiAgLyoqIHRyZWVzKi9cclxuICBwdWJsaWMgdHJlZXMgOiBUcmVlW107XHJcbiAgXHJcbiAgLyoqIHNjYWxlcyAoY29tbWEtc2VwYXJhdGVkIHZhbHVlcykqL1xyXG4gIHB1YmxpYyBzY2FsZXM6IHN0cmluZ1tdO1xyXG4gIFxyXG4gIC8qKiBwcm9qZWN0aW9ucyhjb21tYS1zZXBhcmF0ZWQgRVBTRyBjb2RlcykqL1xyXG4gIHB1YmxpYyBzcnM6IHN0cmluZztcclxuICBcclxuICAvKiogd2hldGhlciBhcHBsaWNhdGlvbiB0cmVlIHdpbGwgYXV0byByZWZyZXNoKi8gIFxyXG4gIHB1YmxpYyB0cmVlQXV0b1JlZnJlc2g6IEJvb2xlYW47XHJcblxyXG4gIC8qKiBiYWNrZ3JvdW5kcyovXHJcbiAgcHVibGljIGJhY2tncm91bmRzOiBBcHBsaWNhdGlvbkJhY2tncm91bmRbXTtcclxuXHJcbiAgLyoqIHNpdHVhdGlvbiBtYXAqL1xyXG4gIHB1YmxpYyBzaXR1YXRpb25NYXA6IENhcnRvZ3JhcGh5R3JvdXA7ICAgIFxyXG4gIFxyXG4gIC8qKiBwYXJhbWV0ZXJzKi9cclxuICBwdWJsaWMgcGFyYW1ldGVyczogQXBwbGljYXRpb25QYXJhbWV0ZXJbXTtcclxufVxyXG4iLCJpbXBvcnQgeyBBcHBsaWNhdGlvbiB9IGZyb20gJy4vYXBwbGljYXRpb24ubW9kZWwnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQ2FydG9ncmFwaHlHcm91cCB9IGZyb20gJy4uL2NhcnRvZ3JhcGh5L2NhcnRvZ3JhcGh5LWdyb3VwLm1vZGVsJztcclxuXHJcbi8qKiBBcHBsaWNhdGlvbiBtYW5hZ2VyIHNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgQXBwbGljYXRpb25TZXJ2aWNlIGV4dGVuZHMgUmVzdFNlcnZpY2U8QXBwbGljYXRpb24+IHtcclxuICBcclxuXHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIEFQUExJQ0FUSU9OX0FQSSA9ICdhcHBsaWNhdGlvbnMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihBcHBsaWNhdGlvbiwgXCJhcHBsaWNhdGlvbnNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIGFwcGxpY2F0aW9uKi9cclxuICByZW1vdmUoaXRlbTogQXBwbGljYXRpb24pIHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKGl0ZW0uX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgIFxyXG4gIH1cclxuICBcclxuICAvKiogc2F2ZSBhcHBsaWNhdGlvbiovXHJcbiAgc2F2ZShpdGVtOiBBcHBsaWNhdGlvbik6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcblxyXG4gICAgbGV0IGFwcGxpY2F0aW9uU2l0dWF0aW9uTWFwOmFueSA9IHt9O1xyXG4gICAgYXBwbGljYXRpb25TaXR1YXRpb25NYXAuX2xpbmtzPSB7fTtcclxuICAgIGFwcGxpY2F0aW9uU2l0dWF0aW9uTWFwLl9saW5rcy5zZWxmID0ge307XHJcbiAgICBhcHBsaWNhdGlvblNpdHVhdGlvbk1hcC5fbGlua3Muc2VsZi5ocmVmPVwiXCI7XHJcbiAgICAgXHJcbiAgICBpZiAoaXRlbS5zaXR1YXRpb25NYXAhPW51bGwpe1xyXG4gICAgICAgIGFwcGxpY2F0aW9uU2l0dWF0aW9uTWFwPWl0ZW0uc2l0dWF0aW9uTWFwO1xyXG4gICAgICAgIGlmICh0eXBlb2YgaXRlbS5zaXR1YXRpb25NYXAuX2xpbmtzIT0gJ3VuZGVmaW5lZCcpIHsgXHJcbiAgICAgICAgICAgIGl0ZW0uc2l0dWF0aW9uTWFwID0gaXRlbS5zaXR1YXRpb25NYXAuX2xpbmtzLnNlbGYuaHJlZjtcclxuICAgICAgICB9ICAgICAgIFxyXG4gICAgIH1cclxuXHJcbiAgICBpZiAoaXRlbS5fbGlua3MhPW51bGwpIHtcclxuICAgICAgLy91cGRhdGUgcmVsYXRpb25zXHJcbiAgICAgIGRlbGV0ZSBpdGVtLnNpdHVhdGlvbk1hcDsgICAgICAgIFxyXG4gICAgICBcclxuICAgICAgaWYgKGFwcGxpY2F0aW9uU2l0dWF0aW9uTWFwLl9saW5rcy5zZWxmLmhyZWY9PScnKXtcclxuICAgICAgICAgaXRlbS5kZWxldGVSZWxhdGlvbignc2l0dWF0aW9uTWFwJyxhcHBsaWNhdGlvblNpdHVhdGlvbk1hcCkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7ICAgICBcclxuICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG4gICAgICAgICAgXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbignc2l0dWF0aW9uTWFwJyxhcHBsaWNhdGlvblNpdHVhdGlvbk1hcCkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgICAgIFxyXG4gICAgICBcclxuICAgICAgICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpOyAgICAgICAgICAgXHJcbiAgICAgICB9IFxyXG4gICAgICAgXHJcbiAgICAgICAgIFxyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucHV0KGl0ZW0uX2xpbmtzLnNlbGYuaHJlZiwgaXRlbSk7XHJcblxyXG4gICAgICAgICAgIFxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5BUFBMSUNBVElPTl9BUEkpICwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICAgIFxyXG4gICAgXHJcbiAgXHJcbn1cclxuIiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcbmltcG9ydCB7QmFja2dyb3VuZH0gZnJvbSAnLi4vY2FydG9ncmFwaHkvYmFja2dyb3VuZC5tb2RlbCc7XHJcbmltcG9ydCB7QXBwbGljYXRpb259IGZyb20gJy4vYXBwbGljYXRpb24ubW9kZWwnOyBcclxuXHJcbi8qKlxyXG4gKiBBcHBsaWNhdGlvbiBiYWNrZ3JvdW5kIG1vZGVsXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgQXBwbGljYXRpb25CYWNrZ3JvdW5kIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiBvcmRlciovXHJcbiAgcHVibGljIG9yZGVyOiBOdW1iZXI7XHJcbiAgXHJcbiAgLyoqIGJhY2tncm91bmQqL1xyXG4gIHB1YmxpYyBiYWNrZ3JvdW5kOiBCYWNrZ3JvdW5kO1xyXG4gIFxyXG4gIC8qKiBhcHBsaWNhdGlvbiovXHJcbiAgcHVibGljIGFwcGxpY2F0aW9uOiBBcHBsaWNhdGlvbjtcclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgQXBwbGljYXRpb25CYWNrZ3JvdW5kIH0gZnJvbSAnLi9hcHBsaWNhdGlvbi1iYWNrZ3JvdW5kLm1vZGVsJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcblxyXG4vKiogQXBwbGljYXRpb24gYmFja2dyb3VuZCBtYW5hZ2VyIHNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKSBcclxuZXhwb3J0IGNsYXNzIEFwcGxpY2F0aW9uQmFja2dyb3VuZFNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxBcHBsaWNhdGlvbkJhY2tncm91bmQ+IHtcclxuICBcclxuXHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIEFQUExJQ0FUSU9OX0JBQ0tHUk9VTkRfQVBJID0nYXBwbGljYXRpb24tYmFja2dyb3VuZHMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihBcHBsaWNhdGlvbkJhY2tncm91bmQsIFwiYXBwbGljYXRpb24tYmFja2dyb3VuZHNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIGFwcGxpY2F0aW9uIGJhY2tncm91bmQqL1xyXG4gIHJlbW92ZShpdGVtOiBBcHBsaWNhdGlvbkJhY2tncm91bmQpIHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKGl0ZW0uX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgIFxyXG4gIH1cclxuICBcclxuICAvKiogc2F2ZSBhcHBsaWNhdGlvbiBiYWNrZ3JvdW5kKi9cclxuICBzYXZlKGl0ZW06IEFwcGxpY2F0aW9uQmFja2dyb3VuZCk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICBpZiAoaXRlbS5fbGlua3MhPW51bGwpIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgICBpZiAoaXRlbS5hcHBsaWNhdGlvbiAhPW51bGwpe1xyXG4gICAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ2FwcGxpY2F0aW9uJyxpdGVtLmFwcGxpY2F0aW9uKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgXHJcbiAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoaXRlbS5iYWNrZ3JvdW5kICE9bnVsbCl7XHJcbiAgICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbignYmFja2dyb3VuZCcsaXRlbS5iYWNrZ3JvdW5kKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgXHJcbiAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGl0ZW0uYXBwbGljYXRpb24gPSBpdGVtLmFwcGxpY2F0aW9uLl9saW5rcy5zZWxmLmhyZWY7XHJcbiAgICAgIGl0ZW0uYmFja2dyb3VuZCA9IGl0ZW0uYmFja2dyb3VuZC5fbGlua3Muc2VsZi5ocmVmO1xyXG4gIFxyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLkFQUExJQ0FUSU9OX0JBQ0tHUk9VTkRfQVBJKSAsIGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgXHJcbn1cclxuIiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcbmltcG9ydCB7QXBwbGljYXRpb259IGZyb20gJy4vYXBwbGljYXRpb24ubW9kZWwnOyBcclxuXHJcbi8qKlxyXG4gKiBBcHBsaWNhdGlvbiBwYXJhbWV0ZXIgbW9kZWwgXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgQXBwbGljYXRpb25QYXJhbWV0ZXIgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgLyoqIG5hbWUqL1xyXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgXHJcbiAgLyoqIHR5cGUqL1xyXG4gIHB1YmxpYyB0eXBlOiBzdHJpbmc7XHJcbiAgXHJcbiAgLyoqIHZhbHVlKi8gICAgXHJcbiAgcHVibGljIHZhbHVlOiBzdHJpbmc7XHJcbiAgXHJcbiAgLyoqIGFwcGxpY2F0aW9uKi9cclxuICBwdWJsaWMgYXBwbGljYXRpb246IEFwcGxpY2F0aW9uO1xyXG5cclxufVxyXG4iLCJpbXBvcnQgeyBBcHBsaWNhdGlvblBhcmFtZXRlciB9IGZyb20gJy4vYXBwbGljYXRpb24tcGFyYW1ldGVyLm1vZGVsJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcblxyXG4vKiogQXBwbGljYXRpb24gcGFyYW1ldGVyIG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpIFxyXG5leHBvcnQgY2xhc3MgQXBwbGljYXRpb25QYXJhbWV0ZXJTZXJ2aWNlIGV4dGVuZHMgUmVzdFNlcnZpY2U8QXBwbGljYXRpb25QYXJhbWV0ZXI+IHtcclxuICBcclxuXHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIEFQUExJQ0FUSU9OX1BBUkFNRVRFUl9BUEkgPSAnYXBwbGljYXRpb24tcGFyYW1ldGVycyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKEFwcGxpY2F0aW9uUGFyYW1ldGVyLCBcImFwcGxpY2F0aW9uLXBhcmFtZXRlcnNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIGFwcGxpY2F0aW9uKi9cclxuICByZW1vdmUoaXRlbTogQXBwbGljYXRpb25QYXJhbWV0ZXIpIHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKGl0ZW0uX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgIFxyXG4gIH1cclxuICBcclxuICAvKiogc2F2ZSBhcHBsaWNhdGlvbiovXHJcbiAgc2F2ZShpdGVtOiBBcHBsaWNhdGlvblBhcmFtZXRlcik6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICBpZiAoaXRlbS5fbGlua3MhPW51bGwpIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgICBpZiAoaXRlbS5hcHBsaWNhdGlvbiAhPW51bGwpe1xyXG4gICAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ2FwcGxpY2F0aW9uJyxpdGVtLmFwcGxpY2F0aW9uKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgXHJcbiAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGl0ZW0uYXBwbGljYXRpb24gPSBpdGVtLmFwcGxpY2F0aW9uLl9saW5rcy5zZWxmLmhyZWY7XHJcbiAgXHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuQVBQTElDQVRJT05fUEFSQU1FVEVSX0FQSSkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG4vKipcclxuICogQ29ubmVjdGlvbiBtb2RlbFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIENvZGVMaXN0IGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiBpZCAqL1xyXG4gIHB1YmxpYyBpZDogbnVtYmVyO1xyXG4gIC8qKiBuYW1lKi9cclxuICBwdWJsaWMgY29kZUxpc3ROYW1lOiBzdHJpbmc7XHJcbiAgLyoqIHR5cGUqL1xyXG4gIHB1YmxpYyB2YWx1ZTogc3RyaW5nO1xyXG4gIC8qKiB1c2VyKi9cclxuICBwdWJsaWMgZGVzY3JpcHRpb246IHN0cmluZztcclxuXHJcblxyXG59XHJcbiIsImltcG9ydCB7IENvZGVMaXN0IH0gZnJvbSAnLi9jb2RlbGlzdC5tb2RlbCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5cclxuLyoqIENvbm5lY3Rpb24gbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIENvZGVMaXN0U2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPENvZGVMaXN0PiB7XHJcbiAgXHJcbiBcclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgQ09ERUxJU1RfQVBJID0gJ2NvZGVsaXN0LXZhbHVlcyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKENvZGVMaXN0LCBcImNvZGVsaXN0LXZhbHVlc1wiLCBpbmplY3Rvcik7XHJcbiAgfVxyXG4gIFxyXG4gIC8qKiByZW1vdmUgY29ubmVjdGlvbiovXHJcbiAgcmVtb3ZlKGl0ZW06IENvZGVMaXN0KSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgY29ubmVjdGlvbiovXHJcbiAgc2F2ZShpdGVtOiBDb2RlTGlzdCk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICBpZiAoaXRlbS5fbGlua3MhPW51bGwpIHtcclxuICAgICAgXHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuQ09ERUxJU1RfQVBJICksIGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgXHJcbn1cclxuIiwiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBCZWhhdmlvclN1YmplY3QsIE9ic2VydmFibGUsIG9mIH0gZnJvbSAncnhqcyc7XHJcblxyXG4vKiogTGF5ZXIgbW9kZWw6IGNvbmZpZ3VyZSBMYXllciBkYXRhIGFuZCBkaXNwbGF5aW5nIGNvbmZpZ3VyYXRpb24gKi8gXHJcbmV4cG9ydCBjbGFzcyBMYXllciB7XHJcbiAgLy8gRGlzcGxheSBkYXRhXHJcbiAgLyoqIGxheWVyIHZpc2liaWxpdHkqLyAgXHJcbiAgdmlzaWJpbGl0eTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIC8qKiBUcmFuc3BhcmVuY3kgKFRyYW5zcGFyZW50KSAwLTEgKE9wYXF1ZSkqL1xyXG4gIG9wYWNpdHk6IG51bWJlciA9IDEuMDtcclxuXHJcbiAgLy8gQ29uZmlndXJhdGlvbiBkYXRhXHJcbiAgLyoqIHRpdGxlKi9cclxuICB0aXRsZTogc3RyaW5nO1xyXG4gIFxyXG4gIC8qKiBJZCB0byBpbmRleCovXHJcbiAgaWQ6IGFueTtcclxuICBcclxuICAvKiogU2VydmljZSBOYW1lKi9cclxuICBzZXJ2ZXJOYW1lOiBzdHJpbmc7XHJcblxyXG4gIC8qKiBTZXJ2aWNlIGF0dHJpYnV0aW9ucyovXHJcbiAgYXR0cmlidXRpb25zOiBzdHJpbmcgPSBcIlwiO1xyXG5cclxuICAvKiogUmVxdWVzdCBmb3JtYXQgKGltYWdlL2pwZywgLi4uKSovXHJcbiAgZm9ybWF0OiBzdHJpbmc7XHJcbiAgXHJcbiAgLyoqIFJlcXVlc3Qgc2VydmljZSB2ZXJzaW9uKi9cclxuICB2ZXJzaW9uOnN0cmluZztcclxuXHJcbiAgLyoqIFNlcnZpY2UgdXJsKi9cclxuICB1cmw6IHN0cmluZztcclxuXHJcbiAgLyoqIElzIGJhc2UgbGF5ZXI/Ki9cclxuICBpc0Jhc2VMYXllcjogYm9vbGVhbjtcclxuXHJcbiAgLyoqIFJlcXVlc3QgbGF5ZXIgbmFtZSovXHJcbiAgbmFtZTogc3RyaW5nO1xyXG5cclxuICAvKiogSXMgdGlsZWQ/Ki9cclxuICB0aWxlZDogYm9vbGVhbjtcclxuICBcclxuICAvKiogRGVzY3JpcHRpb24qL1xyXG4gIGRlc2M6IHN0cmluZyA9IFwiXCI7XHJcbiAgXHJcbiAgLyoqICBUcmFuc3BhcmVudCByZXF1ZXN0IHBhcmFtZXRlcj8qL1xyXG4gIHVybF90cmFuc3BhcmVudDogc3RyaW5nID0gXCJ0cnVlXCI7XHJcbiAgXHJcbiAgLyoqIFJlcXVlc3QgQmFja2dyb3VuZCBwYXJhbWV0ZXIgY29sb3IgKEhleGEpKi9cclxuICB1cmxfYmdjb2xvcjogc3RyaW5nID0gXCIweDAwMDAwMFwiO1xyXG4gIFxyXG4gIC8qKiBSZXF1ZXN0IEV4Y2VwdGlvbiBVUkwqL1xyXG4gIHVybF9leGNlcHRpb246IHN0cmluZztcclxuICBcclxuICAvKiogRXh0ZW50IGZvciB0aWxlZCBzZXJ2aWNlcyovXHJcbiAgZXh0ZW50OiBhbnkgPSBudWxsO1xyXG5cclxuICAvKiogVGlsZSBoZWlnaHQgKGlmIG5vdCBkZWZpbmVkLCB0aGUgZGVmYXVsdCBtYXAgaXMgdGFrZW4pKi9cclxuICB0aWxlSGVpZ2h0PzpudW1iZXI7XHJcbiAgXHJcbiAgLyoqIFRpbGUgd2lkdGggKGlmIG5vdCBkZWZpbmVkLCB0aGUgZGVmYXVsdCBtYXAgaXMgdGFrZW4pKi9cclxuICB0aWxlV2lkdGg/Om51bWJlcjtcclxuICBcclxuICAvKiogRW5hYmxlZCBmb3IgR2V0RmVhdHVyZUluZm8gcmVxdWVzdHMgKGVuYWJsZWQgdG8gdXNlIHRoZSB2aWV3ZXIgZmVhdHVyZXMgaW5mb3JtYXRpb24gdG9vbCkqL1xyXG4gIHF1ZXJ5YWJsZT86Ym9vbGVhbiA9IGZhbHNlO1xyXG4gIFxyXG4gIC8qKiBNaW5pbXVtIHNjYWxlKi9cclxuICBtaW5pbXVtU2NhbGU/Om51bWJlcjtcclxuICBcclxuICAvKiogTWF4aW11bSBzY2FsZSovXHJcbiAgbWF4aW11bVNjYWxlPzpudW1iZXI7XHJcbiAgXHJcbiAgLyoqIExpc3Qgb2YgYXZhaWxhYmxlIENSUyovXHJcbiAgcHJvamVjdGlvbnM/OnN0cmluZztcclxuICBcclxuICAvKiogRmVhdHVyZXMgaW5mb3JtYXRpb24gVVJMKi9cclxuICBpbmZvVXJsPzpzdHJpbmc7XHJcbiAgXHJcbiAgLyoqIE1ldGFkYXRhIGluZm9ybWF0aW9uIFVSTCovXHJcbiAgbWV0YWRhdGFVcmw/OnN0cmluZztcclxuICBcclxuICAvKiogTGVnZW5kIFVSTCovXHJcbiAgbGVnZW5kVXJsPzpzdHJpbmc7XHJcbiAgXHJcbiAgLyoqIEFycmF5IG9mIE9wdGlvbmFsUGFyYW1ldGVyIG9iamVjdCB0aGF0IGRlZmluZXMgb3RoZXIgb3B0aW9uYWwgcGFyYW1ldGVyLXZhbHVlIHBhaXJzIGZvciB0aGUgcmVxdWVzdCAoVElNRSAuLi4pKi9cclxuICBvcHRpb25hbFBhcmFtZXRlcnM/OkFycmF5PE9wdGlvbmFsUGFyYW1ldGVyPjtcclxufVxyXG5cclxuLyoqIE9wdGlvbmFsIHBhcmFtZXRlciBtb2RlbDogY29uZmlndXJlIHBhcmFtZXRlci12YWx1ZSBwYWlyIHRvIGFkZCB0byB0aGUgcmVxdWVzdCBsYXllciBVUkwgKi9cclxuZXhwb3J0IGNsYXNzIE9wdGlvbmFsUGFyYW1ldGVyIHtcclxuICAvKioga2V5Ki9rZXk6c3RyaW5nO1xyXG4gIC8qKiB2YWx1ZSovdmFsdWU6c3RyaW5nO1xyXG59XHJcblxyXG4vKiogTGF5ZXIgY29uZmlndXJhdGlvbiBtb2RlbDogbW9kaWZ5IHRoZSBjb25maWd1cmF0aW9uIG9mIGEgbGF5ZXIgd2hlbiBpbnRlcmFjdGluZyB3aXRoIHRoZSBtYXAgKG1ha2UgdmlzaWJsZSwgbW92ZSB0aGUgbGF5ZXIgLi4uKSAqL1xyXG5leHBvcnQgY2xhc3MgTGF5ZXJDb25maWd1cmF0aW9uIHtcclxuICAvKiogSWRlbnRpZmllciB0byBpbmRleCovaWQ6IGFueTtcclxuICAvKiogTGF5ZXIgdmlzaWJpbGl0eSovdmlzaWJpbGl0eTogYm9vbGVhbjtcclxuICAvKiogTGF5ZXIgdHJhbnNwYXJlbmN5IChUcmFuc3BhcmVudCkgMC0xIChPcGFxdWUpKi9vcGFjaXR5OiBudW1iZXI7XHJcbiAgLyoqIExheWVyIHBvc2l0aW9uKi9wb3NpdGlvbjogbnVtYmVyO1xyXG59XHJcblxyXG4vKiogTGF5ZXIgZ3JvdXAgbW9kZWwqL1xyXG5leHBvcnQgY2xhc3MgTGF5ZXJHcm91cCB7XHJcbiAgLyoqIGluaXRpYWxseSBhY3RpdmF0ZWQgKGFsbCB2aXNpYmxlIGxheWVycykqL2FjdGl2ZT86Ym9vbGVhbjtcclxuICAvKiogZ3JvdXAgbmFtZSovbmFtZT86IFN0cmluZztcclxuICAvKiogZ3JvdXAgaWQqL2lkOiBTdHJpbmc7XHJcbiAgLyoqIGFycmF5IG9mIGNoaWxkIExheWVycyovbGF5ZXJzOiBBcnJheTxMYXllcj47XHJcbn1cclxuXHJcbi8qKiBNYXAgb3B0aW9ucyBjb25maWd1cmF0aW9uIG1vZGVsKi9cclxuZXhwb3J0IGNsYXNzIE1hcE9wdGlvbnNDb25maWd1cmF0aW9uIHtcclxuICAvKiogc2NhbGVzKi9zY2FsZXM/OiBzdHJpbmc7XHJcbiAgLyoqIHByb2plY3Rpb25zKi9wcm9qZWN0aW9ucz86IHN0cmluZztcclxuICAvKiogbWluaW11bSBzY2FsZSovbWluU2NhbGU/Om51bWJlcjtcclxuICAvKiogbWF4aW11bSBzY2FsZSovbWF4U2NhbGU/Om51bWJlcjtcclxuICAvKiogZXh0ZW50Ki9leHRlbnQ/OmFueTtcclxuICAvKiogbWF4aW11bSBleHRlbnQqL21heEV4dGVudD86YW55O1xyXG4gIC8qKiB0aWxlIHdpZHRoKi90aWxlV2lkdGg/Om51bWJlcjtcclxuICAvKiogdGlsZSBoZWlnaHQqL3RpbGVIZWlnaHQ/Om51bWJlcjtcclxuICAvKiogcGFyYW1ldGVycyovcGFyYW1ldGVycz86IEFycmF5PE9wdGlvbmFsUGFyYW1ldGVyPlxyXG59XHJcblxyXG4vKiogTWFwIGNvbXBvbmVudCBzdGF0dXMgbW9kZWwqL1xyXG5leHBvcnQgY2xhc3MgTWFwQ29tcG9uZW50U3RhdHVzIHtcclxuICAgIC8qKiBsb2FkZWQ/Ki9sb2FkZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxufVxyXG5cclxuQEluamVjdGFibGUoe1xyXG4gIHByb3ZpZGVkSW46ICdyb290J1xyXG59KVxyXG5cclxuLyoqIE1hcCBjb25maWd1cmF0aW9uIG1hbmFnZXIgc2VydmljZSovXHJcbmV4cG9ydCBjbGFzcyBNYXBDb25maWd1cmF0aW9uTWFuYWdlclNlcnZpY2Uge1xyXG4gIHByaXZhdGUgbGF5ZXJzU3ViamVjdCA9IG5ldyBCZWhhdmlvclN1YmplY3QoW10pO1xyXG4gIHByaXZhdGUgbGF5ZXJzOiBBcnJheTxMYXllcj4gPSBudWxsO1xyXG5cclxuICBwcml2YXRlIGJhc2VMYXllckdyb3Vwc1N1YmplY3QgPSBuZXcgQmVoYXZpb3JTdWJqZWN0KFtdKTtcclxuICBwcml2YXRlIGJhc2VMYXllckdyb3VwczogQXJyYXk8TGF5ZXJHcm91cD4gPSBudWxsO1xyXG5cclxuICBwcml2YXRlIGxheWVyQ29uZmlndXJhdGlvblN1YmplY3QgPSBuZXcgQmVoYXZpb3JTdWJqZWN0KFtdKTtcclxuXHJcbiAgcHJpdmF0ZSBhZGRMYXllcnNTdWJqZWN0ID0gbmV3IEJlaGF2aW9yU3ViamVjdChbXSk7XHJcbiAgcHJpdmF0ZSByZW1vdmVMYXllcnNTdWJqZWN0ID0gbmV3IEJlaGF2aW9yU3ViamVjdChbXSk7XHJcblxyXG4gIHByaXZhdGUgc2l0dWF0aW9uTWFwQ29uZmlndXJhdGlvblN1YmplY3QgPSBuZXcgQmVoYXZpb3JTdWJqZWN0KFtdKTtcclxuICBwcml2YXRlIG1hcE9wdGlvbnNDb25maWd1cmF0aW9uU3ViamVjdCA9IG5ldyBCZWhhdmlvclN1YmplY3QoW10pO1xyXG5cclxuICBwcml2YXRlIG1hcENvbXBvbmVudFN0YXR1c1N1YmplY3QgPSBuZXcgQmVoYXZpb3JTdWJqZWN0KFtdKTtcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yKi9cclxuICBjb25zdHJ1Y3RvcigpIHsgXHJcbiAgIC8vXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBsYXllciBjb3VudCAqL1xyXG4gIGNvdW50ID0gMDtcclxuXHJcbiAgLyoqIGNvbmZpZ3VyZSB0aGUgb3ZlcmxheSBsYXllcnMgb2YgdGhlIG1hcCwgYnkgcGFzc2luZyBhcyBhIHBhcmFtZXRlciBhbiBhcnJheSBvZiBvYmplY3RzIG9mIHR5cGUgTGF5ZXIgb2JqZWN0cyBkZWZpbmluZyB0aGUgbGF5ZXJzIHRvIGxvYWQuKi9cclxuICBsb2FkTGF5ZXJzQ29uZmlndXJhdGlvbihjb25maWd1cmF0aW9uKSB7XHJcbiAgICBpZiAodGhpcy5sYXllcnMgIT0gbnVsbCkge1xyXG4gICAgICB0aGlzLmNsZWFyTGF5ZXJzKGZhbHNlKTtcclxuICAgIH1cclxuICAgIHRoaXMuc2V0TGF5ZXJzKGNvbmZpZ3VyYXRpb24pO1xyXG4gIH1cclxuICBcclxuICAvKipjb25maWd1cmUgdGhlIGJhc2UgbGF5ZXJzIG9mIHRoZSBtYXAgYnkgcGFzc2luZyBhcyBhIHBhcmFtZXRlciBhbiBhcnJheSBvZiBvYmplY3RzIG9mIHR5cGUgTGF5ZXJHcm91cCBlYWNoIG9mIHRoZW0gd2l0aCB0aGUgY29ycmVzcG9uZGluZyBMYXllciBvYmplY3RzIGRlZmluaW5nIHRoZSBsYXllcnMgdG8gbG9hZC4qL1xyXG4gIGxvYWRCYXNlTGF5ZXJzQ29uZmlndXJhdGlvbihjb25maWd1cmF0aW9uKSB7XHJcbiAgICB0aGlzLnNldEJhc2VMYXllckdyb3Vwcyhjb25maWd1cmF0aW9uKTtcclxuICB9XHJcblxyXG4gIC8qKiBnZXQgYmFzZSBsYXllciBncm91cHMqL1xyXG4gIGdldEJhc2VMYXllckdyb3VwcygpOiBPYnNlcnZhYmxlPExheWVyR3JvdXBbXT4ge1xyXG4gICAgcmV0dXJuIHRoaXMuYmFzZUxheWVyR3JvdXBzU3ViamVjdC5hc09ic2VydmFibGUoKTtcclxuICB9XHJcblxyXG4gIC8qKiBzZXQgYmFzZSBsYXllciBncm91cHMqL1xyXG4gIHNldEJhc2VMYXllckdyb3Vwcyhncm91cHM6QXJyYXk8TGF5ZXJHcm91cD4pIHtcclxuICAgIHRoaXMuYmFzZUxheWVyR3JvdXBzID0gZ3JvdXBzO1xyXG4gICAgdGhpcy5yZWZyZXNoQmFzZUxheWVyR3JvdXBzKCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHJlZnJlc2hCYXNlTGF5ZXJHcm91cHMoKSB7XHJcbiAgICAvLyBTZW5kIHRoZSBuZXcgdmFsdWVzIHNvIHRoYXQgYWxsIHN1YnNjcmliZXJzIGFyZSB1cGRhdGVkXHJcbiAgICB0aGlzLmJhc2VMYXllckdyb3Vwc1N1YmplY3QubmV4dCh0aGlzLmJhc2VMYXllckdyb3Vwcyk7XHJcbiAgfVxyXG5cclxuICAvKiogZ2V0IGxheWVycyovXHJcbiAgZ2V0TGF5ZXJzKCk6IE9ic2VydmFibGU8TGF5ZXJbXT4ge1xyXG4gICAgcmV0dXJuIHRoaXMubGF5ZXJzU3ViamVjdC5hc09ic2VydmFibGUoKTtcclxuICB9XHJcblxyXG4gIC8qKiByZW1vdmUgYWxsIGxheWVycyBmcm9tIG1hcCovXHJcbiAgY2xlYXJMYXllcnMocmVmcmVzaDpib29sZWFuKSB7XHJcbiAgICB3aGlsZSh0aGlzLmxheWVycy5sZW5ndGgpIHtcclxuICAgICAgdGhpcy5sYXllcnMucG9wKCk7XHJcbiAgICB9XHJcbiAgICBpZiAocmVmcmVzaCkge1xyXG4gICAgICB0aGlzLnJlZnJlc2hMYXllcnMoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKiBzZXQgbGF5ZXJzKi9cclxuICBzZXRMYXllcnMobGF5ZXJzOkFycmF5PExheWVyPikge1xyXG4gICAgdGhpcy5sYXllcnMgPSBsYXllcnM7XHJcbiAgICB0aGlzLnJlZnJlc2hMYXllcnMoKTtcclxuICB9XHJcblxyXG4gIC8qKiBhZGQgZ2l2ZW4gbGF5ZXIgdG8gbWFwKi9cclxuICBhZGRMYXllcihsYXllcjpMYXllcikge1xyXG4gICAgdGhpcy5sYXllcnMucHVzaChsYXllcik7XHJcbiAgICB0aGlzLnJlZnJlc2hBZGRMYXllcnMobGF5ZXIpO1xyXG4gIH1cclxuXHJcbiAgLyoqIGFkZCBnaXZlbiBsYXllciB0byBtYXAgYXQgZ2l2ZW4gaW5kZXgqL1xyXG4gIGFkZExheWVyQXQobGF5ZXI6TGF5ZXIsIGluZGV4Om51bWJlcikge1xyXG4gICAgaWYgKGluZGV4ID09IDApIHtcclxuICAgICAgdGhpcy5sYXllcnMgPSBbbGF5ZXJdLmNvbmNhdCh0aGlzLmxheWVycyk7XHJcbiAgICB9IGVsc2UgaWYgKGluZGV4ID49IHRoaXMubGF5ZXJzLmxlbmd0aCkge1xyXG4gICAgICB0aGlzLmxheWVycy5wdXNoKGxheWVyKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMubGF5ZXJzID0gdGhpcy5sYXllcnMuc2xpY2UoMCwgaW5kZXgpXHJcbiAgICAgICAgICAgICAgICAgICAgLmNvbmNhdChbbGF5ZXJdKVxyXG4gICAgICAgICAgICAgICAgICAgIC5jb25jYXQodGhpcy5sYXllcnMuc2xpY2UoaW5kZXgsIHRoaXMubGF5ZXJzLmxlbmd0aCkpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5yZWZyZXNoQWRkTGF5ZXJzKGxheWVyKTtcclxuICAgIHRoaXMucmVmcmVzaExheWVyQ29uZmlndXJhdGlvbihsYXllci5pZCwgbnVsbCwgbnVsbCwgaW5kZXgpO1xyXG4gIH1cclxuXHJcbiAgLyoqIHJlbW92ZSBnaXZlbiBsYXllciBmcm9tIG1hcCovXHJcbiAgcmVtb3ZlTGF5ZXIobGF5ZXI6TGF5ZXIpIHtcclxuICAgIHZhciBpbmRleCA9IHRoaXMubGF5ZXJzLmluZGV4T2YobGF5ZXIpO1xyXG4gICAgdGhpcy5yZW1vdmVMYXllckluZGV4KGluZGV4KTtcclxuICB9XHJcblxyXG4gIC8qKiByZW1vdmUgbGF5ZXIgd2l0aCBnaXZlbiBpZCBmcm9tIG1hcCAqL1xyXG4gIHJlbW92ZUxheWVySWQoaWQpIHtcclxuICAgIHZhciBpbmRleCA9IC0xO1xyXG4gICAgZm9yICh2YXIgaSA9IDAsIGlMZW4gPSB0aGlzLmxheWVycy5sZW5ndGg7IGkgPCBpTGVuOyBpKyspIHtcclxuICAgICAgaWYgKHRoaXMubGF5ZXJzW2ldLmlkID09IGlkKSB7XHJcbiAgICAgICAgaW5kZXggPSBpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICB0aGlzLnJlbW92ZUxheWVySW5kZXgoaW5kZXgpO1xyXG4gIH1cclxuXHJcbiAgLyoqIHJlbW92ZSBsYXllciBhdCBnaXZlbiBpbmRleCBmcm9tIG1hcCAqL1xyXG4gIHJlbW92ZUxheWVySW5kZXgoaW5kZXg6bnVtYmVyKSB7XHJcbiAgICB2YXIgbGF5ZXIgPSB0aGlzLmxheWVyc1tpbmRleF07XHJcbiAgICB0aGlzLmxheWVycy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgdGhpcy5yZWZyZXNoUmVtb3ZlTGF5ZXJzKGxheWVyKTtcclxuICB9XHJcblxyXG4gIC8qKiByZWZyZXNoIGxheWVycyAqL1xyXG4gIHByaXZhdGUgcmVmcmVzaExheWVycygpIHtcclxuICAgIC8vIFNlbmQgdGhlIG5ldyB2YWx1ZXMgc28gdGhhdCBhbGwgc3Vic2NyaWJlcnMgYXJlIHVwZGF0ZWRcclxuICAgIHRoaXMubGF5ZXJzU3ViamVjdC5uZXh0KHRoaXMubGF5ZXJzKTtcclxuICB9XHJcblxyXG4gIC8qKiBPYnNlcnZhYmxlIGZvciBsYXllcnMgYWRkZWQgKi9cclxuICBnZXRMYXllcnNBZGRlZCgpOiBPYnNlcnZhYmxlPExheWVyW10+IHtcclxuICAgIHJldHVybiB0aGlzLmFkZExheWVyc1N1YmplY3QuYXNPYnNlcnZhYmxlKCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHJlZnJlc2hBZGRMYXllcnMobGF5ZXI6TGF5ZXIpIHtcclxuICAgIC8vIFNlbmQgdGhlIG5ldyB2YWx1ZXMgc28gdGhhdCBhbGwgc3Vic2NyaWJlcnMgYXJlIHVwZGF0ZWRcclxuICAgIHRoaXMuYWRkTGF5ZXJzU3ViamVjdC5uZXh0KFtsYXllcl0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0TGF5ZXJzUmVtb3ZlZCgpOiBPYnNlcnZhYmxlPExheWVyW10+IHtcclxuICAgIHJldHVybiB0aGlzLnJlbW92ZUxheWVyc1N1YmplY3QuYXNPYnNlcnZhYmxlKCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHJlZnJlc2hSZW1vdmVMYXllcnMobGF5ZXI6TGF5ZXIpIHtcclxuICAgIC8vIFNlbmQgdGhlIG5ldyB2YWx1ZXMgc28gdGhhdCBhbGwgc3Vic2NyaWJlcnMgYXJlIHVwZGF0ZWRcclxuICAgIHRoaXMucmVtb3ZlTGF5ZXJzU3ViamVjdC5uZXh0KFtsYXllcl0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0TGF5ZXJDb25maWd1cmF0aW9uTGlzdGVuZXIoKTogT2JzZXJ2YWJsZTxMYXllckNvbmZpZ3VyYXRpb25bXT4ge1xyXG4gICAgcmV0dXJuIHRoaXMubGF5ZXJDb25maWd1cmF0aW9uU3ViamVjdC5hc09ic2VydmFibGUoKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZ2V0TGF5ZXJJbmRleEJ5SWQoaWQ6c3RyaW5nKTpudW1iZXJ7XHJcbiAgICB2YXIgaW5kZXggPSAtMTtcclxuICAgIGZvciAodmFyIGkgPSAwLCBpTGVuID0gdGhpcy5sYXllcnMubGVuZ3RoOyBpIDwgaUxlbjsgaSsrKSB7XHJcbiAgICAgIGlmICh0aGlzLmxheWVyc1tpXS5pZCA9PSBpZCkge1xyXG4gICAgICAgIGluZGV4ID0gaTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGluZGV4O1xyXG4gIH1cclxuICBcclxuICAvKiogbW92ZSBsYXllciB3aXRoIGdpdmVuIGlkIHRvIHRoZSBnaXZlbiBpbmRleCovXHJcbiAgbW92ZUxheWVyKGlkLCBpbmRleCkge1xyXG4gICAgdmFyIGxheWVySW5kZXggPSB0aGlzLmdldExheWVySW5kZXhCeUlkKGlkKTtcclxuICAgIGlmIChsYXllckluZGV4ICE9IC0xKSB7XHJcbiAgICAgIHZhciBsYXllciA9IHRoaXMubGF5ZXJzLnNwbGljZShsYXllckluZGV4LCAxKTtcclxuICAgICAgdGhpcy5sYXllcnMgPSBcclxuICAgICAgICB0aGlzLmxheWVycy5zbGljZSgwLCBpbmRleClcclxuICAgICAgICAuY29uY2F0KGxheWVyKVxyXG4gICAgICAgIC5jb25jYXQodGhpcy5sYXllcnMuc2xpY2UoaW5kZXgsIHRoaXMubGF5ZXJzLmxlbmd0aCkpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5yZWZyZXNoTGF5ZXJDb25maWd1cmF0aW9uKGlkLCBudWxsLCBudWxsLCBpbmRleCk7XHJcbiAgfVxyXG5cclxuICAvKiogY2hhbmdlIHZpc2liaWxpdHkgb2YgbGF5ZXIgd2l0aCBnaXZlbiBpZCB0byB0aGUgZ2l2ZW4gdmFsdWUqL1xyXG4gIGNoYW5nZUxheWVyVmlzaWJpbGl0eShpZCwgdmlzaWJpbGl0eSkge1xyXG4gICAgdGhpcy5yZWZyZXNoTGF5ZXJDb25maWd1cmF0aW9uKGlkLCBudWxsLCB2aXNpYmlsaXR5LCBudWxsKTtcclxuICB9XHJcblxyXG4gIC8qKiBjaGFuZ2Ugb3BhY2l0eSBvZiBsYXllciB3aXRoIGdpdmVuIGlkIHRvIHRoZSBnaXZlbiB2YWx1ZSovXHJcbiAgY2hhbmdlTGF5ZXJPcGFjaXR5KGlkLCBvcGFjaXR5KSB7XHJcbiAgICB0aGlzLnJlZnJlc2hMYXllckNvbmZpZ3VyYXRpb24oaWQsIG9wYWNpdHksIG51bGwsIG51bGwpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSByZWZyZXNoTGF5ZXJDb25maWd1cmF0aW9uKGlkLCBvcGFjaXR5LCB2aXNpYmlsaXR5LCBwb3NpdGlvbikge1xyXG4gICAgLy8gU2VuZCB0aGUgbmV3IHZhbHVlcyBzbyB0aGF0IGFsbCBzdWJzY3JpYmVycyBhcmUgdXBkYXRlZFxyXG4gICAgdmFyIGxheWVyID0gbmV3IExheWVyQ29uZmlndXJhdGlvbigpO1xyXG4gICAgbGF5ZXIuaWQgPSBpZDtcclxuICAgIGxheWVyLm9wYWNpdHkgPSBvcGFjaXR5O1xyXG4gICAgbGF5ZXIudmlzaWJpbGl0eSA9IHZpc2liaWxpdHk7XHJcbiAgICBsYXllci5wb3NpdGlvbiA9IHBvc2l0aW9uO1xyXG4gICAgdGhpcy5sYXllckNvbmZpZ3VyYXRpb25TdWJqZWN0Lm5leHQoW2xheWVyXSk7XHJcbiAgfVxyXG5cclxuICBnZXRTaXR1YXRpb25NYXBDb25maWd1cmF0aW9uTGlzdGVuZXIoKTogT2JzZXJ2YWJsZTxMYXllcltdPiB7XHJcbiAgICByZXR1cm4gdGhpcy5zaXR1YXRpb25NYXBDb25maWd1cmF0aW9uU3ViamVjdC5hc09ic2VydmFibGUoKTtcclxuICB9XHJcblxyXG4gIC8qKiBjb25maWd1cmUgdGhlIHNpdHVhdGlvbiBtYXAgb2YgdGhlIG1hcCBjb21wb25lbnQgYnkgcGFzc2luZyBhcyBhIHBhcmFtZXRlciBhbiBhcnJheSBvZiBvYmplY3RzIG9mIHR5cGUgTGF5ZXJHcm91cCwgZWFjaCBvZiB0aGVtIHdpdGggdGhlIGNvcnJlc3BvbmRpbmcgTGF5ZXIgb2JqZWN0cyBkZWZpbmluZyB0aGUgbGF5ZXJzIHRvIGxvYWQgYXMgc2l0dWF0aW9uIG1hcC4qL1xyXG4gIGxvYWRTaXR1YXRpb25NYXBDb25maWd1cmF0aW9uKGxheWVyczpBcnJheTxMYXllcj4pIHtcclxuICAgIC8vIFNlbmQgdGhlIG5ldyB2YWx1ZXMgc28gdGhhdCBhbGwgc3Vic2NyaWJlcnMgYXJlIHVwZGF0ZWRcclxuICAgIHRoaXMuc2l0dWF0aW9uTWFwQ29uZmlndXJhdGlvblN1YmplY3QubmV4dChsYXllcnMpO1xyXG4gIH1cclxuXHJcbiAgZ2V0TWFwT3B0aW9uc0NvbmZpZ3VyYXRpb25MaXN0ZW5lcigpOiBPYnNlcnZhYmxlPE1hcE9wdGlvbnNDb25maWd1cmF0aW9uW10+IHtcclxuICAgIHJldHVybiB0aGlzLm1hcE9wdGlvbnNDb25maWd1cmF0aW9uU3ViamVjdC5hc09ic2VydmFibGUoKTtcclxuICB9XHJcblxyXG4gIC8qKiBsb2FkIG1hcCBvcHRpb25zIGNvbmZpZ3VyYXRpb24gKi9cclxuICBsb2FkTWFwT3B0aW9uc0NvbmZpZ3VyYXRpb24oY29uZmlndXJhdGlvbjpNYXBPcHRpb25zQ29uZmlndXJhdGlvbikge1xyXG4gICAgLy8gU2VuZCB0aGUgbmV3IHZhbHVlcyBzbyB0aGF0IGFsbCBzdWJzY3JpYmVycyBhcmUgdXBkYXRlZFxyXG4gICAgdGhpcy5tYXBPcHRpb25zQ29uZmlndXJhdGlvblN1YmplY3QubmV4dChbY29uZmlndXJhdGlvbl0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0TWFwQ29tcG9uZW50U3RhdHVzTGlzdGVuZXIoKTogT2JzZXJ2YWJsZTxNYXBDb21wb25lbnRTdGF0dXNbXT4ge1xyXG4gICAgcmV0dXJuIHRoaXMubWFwQ29tcG9uZW50U3RhdHVzU3ViamVjdC5hc09ic2VydmFibGUoKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNldCBtYXAgY29tcG9uZW50IHN0YXR1cyAqL1xyXG4gIHNldE1hcENvbXBvbmVudFN0YXR1cyhzdGF0dXM6TWFwQ29tcG9uZW50U3RhdHVzKSB7XHJcbiAgICAvL05vdGlmeSB0aGUgbWFwIGNvbXBvbmVudCBzdGF0dXNcclxuICAgIHRoaXMubWFwQ29tcG9uZW50U3RhdHVzU3ViamVjdC5uZXh0KFtzdGF0dXNdKTtcclxuICB9XHJcblxyXG59XHJcbiIsImltcG9ydCB7IERpcmVjdGl2ZSwgSW5wdXQsIFRlbXBsYXRlUmVmLCBWaWV3Q29udGFpbmVyUmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFByaW5jaXBhbCB9IGZyb20gJy4vcHJpbmNpcGFsLnNlcnZpY2UnO1xyXG5cclxuLyoqXHJcbiAqIEB3aGF0SXREb2VzIENvbmRpdGlvbmFsbHkgaW5jbHVkZXMgYW4gSFRNTCBlbGVtZW50IGlmIGN1cnJlbnQgdXNlciBoYXMgYW55XHJcbiAqIG9mIHRoZSBhdXRob3JpdGllcyBwYXNzZWQgYXMgdGhlIGBleHByZXNzaW9uYC5cclxuICpcclxuICogQGhvd1RvVXNlXHJcbiAqIGBgYFxyXG4gKiAgICAgPHNvbWUtZWxlbWVudCAqc2l0bXVuSGFzQW55QXV0aG9yaXR5PVwiJ1JPTEVfQURNSU4nXCI+Li4uPC9zb21lLWVsZW1lbnQ+XHJcbiAqXHJcbiAqICAgICA8c29tZS1lbGVtZW50ICpzaXRtdW5IYXNBbnlBdXRob3JpdHk9XCJbJ1JPTEVfQURNSU4nLCAnUk9MRV9VU0VSJ11cIj4uLi48L3NvbWUtZWxlbWVudD5cclxuICogYGBgXHJcbiAqL1xyXG5ARGlyZWN0aXZlKHtcclxuICAgIHNlbGVjdG9yOiAnW3NpdG11bkhhc0FueUF1dGhvcml0eV0nXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBIYXNBbnlBdXRob3JpdHlEaXJlY3RpdmUge1xyXG4gICAgXHJcbiAgICAvKiogYXV0aG9yaXRpZXMgdG8gY2hlY2sgKi9cclxuICAgIHB1YmxpYyBhdXRob3JpdGllczogc3RyaW5nW107IFxyXG4gICAgXHJcbiAgICAvKiogY29uc3RydWN0b3IgKi9cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcHJpbmNpcGFsOiBQcmluY2lwYWwsIHByaXZhdGUgdGVtcGxhdGVSZWY6IFRlbXBsYXRlUmVmPGFueT4sIHByaXZhdGUgdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZikge1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKiogdGVycml0b3J5IHRvIGNoZWNrIGF1dGhvcml0aWVzKi9cclxuICAgIEBJbnB1dCgpIHRlcnJpdG9yeTogc3RyaW5nO1xyXG4gICAgXHJcbiAgICAvKiogU2V0IHdoZXRoZXIgY3VycmVudCB1c2VyIGhhcyBhbnkgb2YgdGhlIGdpdmVuIGF1dGhvcml0aWVzICovXHJcbiAgICBASW5wdXQoKVxyXG4gICAgc2V0IHNpdG11bkhhc0FueUF1dGhvcml0eSh2YWx1ZTogc3RyaW5nfHN0cmluZ1tdKSB7XHJcbiAgICAgICAgdGhpcy5hdXRob3JpdGllcyA9IHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgPyBbIDxzdHJpbmc+IHZhbHVlIF0gOiA8c3RyaW5nW10+IHZhbHVlO1xyXG4gICAgICAgIHRoaXMudXBkYXRlVmlldygpO1xyXG4gICAgICAgIC8vIEdldCBub3RpZmllZCBlYWNoIHRpbWUgYXV0aGVudGljYXRpb24gc3RhdGUgY2hhbmdlcy5cclxuICAgICAgICB0aGlzLnByaW5jaXBhbC5nZXRBdXRoZW50aWNhdGlvblN0YXRlKCkuc3Vic2NyaWJlKChpZGVudGl0eSkgPT4gdGhpcy51cGRhdGVWaWV3KCkpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKiogdXBkYXRlIHZpZXcgKi9cclxuICAgIHByaXZhdGUgdXBkYXRlVmlldygpOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy50ZXJyaXRvcnkpe1xyXG4gICAgICAgIHRoaXMucHJpbmNpcGFsLmhhc0FueUF1dGhvcml0eU9uVGVycml0b3J5KHRoaXMuYXV0aG9yaXRpZXMsdGhpcy50ZXJyaXRvcnkpLnRoZW4oKHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnZpZXdDb250YWluZXJSZWYuY2xlYXIoKTtcclxuICAgICAgICAgICAgaWYgKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy52aWV3Q29udGFpbmVyUmVmLmNyZWF0ZUVtYmVkZGVkVmlldyh0aGlzLnRlbXBsYXRlUmVmKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMucHJpbmNpcGFsLmhhc0FueUF1dGhvcml0eSh0aGlzLmF1dGhvcml0aWVzKS50aGVuKChyZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgdGhpcy52aWV3Q29udGFpbmVyUmVmLmNsZWFyKCk7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudmlld0NvbnRhaW5lclJlZi5jcmVhdGVFbWJlZGRlZFZpZXcodGhpcy50ZW1wbGF0ZVJlZik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgRGlyZWN0aXZlLCBJbnB1dCwgVGVtcGxhdGVSZWYsIFZpZXdDb250YWluZXJSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgUHJpbmNpcGFsIH0gZnJvbSAnLi9wcmluY2lwYWwuc2VydmljZSc7XHJcblxyXG4vKipcclxuICogQHdoYXRJdERvZXMgQ29uZGl0aW9uYWxseSBpbmNsdWRlcyBhbiBIVE1MIGVsZW1lbnQgaWYgY3VycmVudCB1c2VyIGhhcyBhbnlcclxuICogb2YgdGhlIGF1dGhvcml0aWVzIHBhc3NlZCBhcyB0aGUgYGV4cHJlc3Npb25gLlxyXG4gKlxyXG4gKiBAaG93VG9Vc2VcclxuICogYGBgXHJcbiAqICAgICA8c29tZS1lbGVtZW50ICpzaXRtdW5IYXNBbnlBdXRob3JpdHk9XCInUk9MRV9BRE1JTidcIj4uLi48L3NvbWUtZWxlbWVudD5cclxuICpcclxuICogICAgIDxzb21lLWVsZW1lbnQgKnNpdG11bkhhc0FueUF1dGhvcml0eT1cIlsnUk9MRV9BRE1JTicsICdST0xFX1VTRVInXVwiPi4uLjwvc29tZS1lbGVtZW50PlxyXG4gKiBgYGBcclxuICovXHJcbkBEaXJlY3RpdmUoe1xyXG4gICAgc2VsZWN0b3I6ICdbc2l0bXVuSGFzQW55QXV0aG9yaXR5T25UZXJyaXRvcnldJ1xyXG59KVxyXG5leHBvcnQgY2xhc3MgSGFzQW55QXV0aG9yaXR5T25UZXJyaXRvcnlEaXJlY3RpdmUge1xyXG5cclxuICAgIC8qKiBhdXRob3JpdGllcyB0byBjaGVjayAqL1xyXG4gICAgcHVibGljIGF1dGhvcml0aWVzOiBzdHJpbmdbXTsgXHJcblxyXG4gICAgLyoqIHRlcnJpdG9yeSB0byBjaGVjayBhdXRob3JpdGllcyovXHJcbiAgICBwdWJsaWMgdGVycml0b3J5OiBzdHJpbmc7IFxyXG5cclxuICAgIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBwcmluY2lwYWw6IFByaW5jaXBhbCwgcHJpdmF0ZSB0ZW1wbGF0ZVJlZjogVGVtcGxhdGVSZWY8YW55PiwgcHJpdmF0ZSB2aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmKSB7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKiBTZXQgd2hldGhlciBjdXJyZW50IHVzZXIgaGFzIGFueSBvZiB0aGUgZ2l2ZW4gYXV0aG9yaXRpZXMgb24gdGVycml0b3J5ICovXHJcbiAgICBASW5wdXQoKVxyXG4gICAgc2V0IHNpdG11bkhhc0FueUF1dGhvcml0eU9uVGVycml0b3J5KG9wdHM6IGFueSkge1xyXG5cclxuICAgICAgICB0aGlzLmF1dGhvcml0aWVzID0gdHlwZW9mIG9wdHMuYXV0aG9yaXRpZXMgPT09ICdzdHJpbmcnID8gWyA8c3RyaW5nPiBvcHRzLmF1dGhvcml0aWVzIF0gOiA8c3RyaW5nW10+IG9wdHMuYXV0aG9yaXRpZXM7XHJcbiAgICAgICAgdGhpcy50ZXJyaXRvcnkgPSBvcHRzLnRlcnJpdG9yeTtcclxuICAgICAgICB0aGlzLnVwZGF0ZVZpZXcoKTtcclxuICAgICAgICAvLyBHZXQgbm90aWZpZWQgZWFjaCB0aW1lIGF1dGhlbnRpY2F0aW9uIHN0YXRlIGNoYW5nZXMuXHJcbiAgICAgICAgdGhpcy5wcmluY2lwYWwuZ2V0QXV0aGVudGljYXRpb25TdGF0ZSgpLnN1YnNjcmliZSgoaWRlbnRpdHkpID0+IHRoaXMudXBkYXRlVmlldygpKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoqIHVwZGF0ZSB2aWV3ICovXHJcbiAgICBwcml2YXRlIHVwZGF0ZVZpZXcoKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMudGVycml0b3J5KXtcclxuICAgICAgICB0aGlzLnByaW5jaXBhbC5oYXNBbnlBdXRob3JpdHlPblRlcnJpdG9yeSh0aGlzLmF1dGhvcml0aWVzLHRoaXMudGVycml0b3J5KS50aGVuKChyZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgdGhpcy52aWV3Q29udGFpbmVyUmVmLmNsZWFyKCk7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudmlld0NvbnRhaW5lclJlZi5jcmVhdGVFbWJlZGRlZFZpZXcodGhpcy50ZW1wbGF0ZVJlZik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLnByaW5jaXBhbC5oYXNBbnlBdXRob3JpdHkodGhpcy5hdXRob3JpdGllcykudGhlbigocmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMudmlld0NvbnRhaW5lclJlZi5jbGVhcigpO1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZpZXdDb250YWluZXJSZWYuY3JlYXRlRW1iZWRkZWRWaWV3KHRoaXMudGVtcGxhdGVSZWYpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IE5nTW9kdWxlLCBNb2R1bGVXaXRoUHJvdmlkZXJzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xyXG5pbXBvcnQge0h0dHBDbGllbnRNb2R1bGUsIEhUVFBfSU5URVJDRVBUT1JTLCBIdHRwQ2xpZW50fSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IFJvdXRlck1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XHJcbi8vaW1wb3J0IHsgQW5ndWxhckhhbE1vZHVsZSB9IGZyb20gJy4uLy4uL2xpYi9hbmd1bGFyLWhhbCc7XHJcbmltcG9ydCB7Q29kZUxpc3RTZXJ2aWNlfSBmcm9tICcuL2NvZGVsaXN0L2NvZGVsaXN0LnNlcnZpY2UnO1xyXG5pbXBvcnQge1RlcnJpdG9yeVNlcnZpY2V9IGZyb20gJy4vdGVycml0b3J5L3RlcnJpdG9yeS5zZXJ2aWNlJztcclxuaW1wb3J0IHtUZXJyaXRvcnlUeXBlU2VydmljZX0gZnJvbSAnLi90ZXJyaXRvcnkvdGVycml0b3J5LXR5cGUuc2VydmljZSc7XHJcbmltcG9ydCB7VGVycml0b3J5R3JvdXBUeXBlU2VydmljZX0gZnJvbSAnLi90ZXJyaXRvcnkvdGVycml0b3J5LWdyb3VwLXR5cGUuc2VydmljZSc7XHJcbmltcG9ydCB7VXNlclBvc2l0aW9uU2VydmljZX0gZnJvbSAnLi91c2VyL3VzZXItcG9zaXRpb24uc2VydmljZSc7XHJcbmltcG9ydCB7VXNlckNvbmZpZ3VyYXRpb25TZXJ2aWNlfSBmcm9tICcuL3VzZXIvdXNlci1jb25maWd1cmF0aW9uLnNlcnZpY2UnO1xyXG5pbXBvcnQge1JvbGVTZXJ2aWNlfSBmcm9tICcuL3JvbGUvcm9sZS5zZXJ2aWNlJztcclxuaW1wb3J0IHtVc2VyU2VydmljZX0gZnJvbSAnLi91c2VyL3VzZXIuc2VydmljZSc7XHJcbmltcG9ydCB7Q29ubmVjdGlvblNlcnZpY2V9IGZyb20gJy4vY29ubmVjdGlvbi9jb25uZWN0aW9uLnNlcnZpY2UnO1xyXG5pbXBvcnQge1Rhc2tTZXJ2aWNlfSBmcm9tICcuL3Rhc2svdGFzay5zZXJ2aWNlJztcclxuaW1wb3J0IHtUYXNrVHlwZVNlcnZpY2V9IGZyb20gJy4vdGFzay90YXNrLXR5cGUuc2VydmljZSc7XHJcbmltcG9ydCB7VGFza0dyb3VwU2VydmljZX0gZnJvbSAnLi90YXNrL3Rhc2stZ3JvdXAuc2VydmljZSc7XHJcbmltcG9ydCB7VGFza1BhcmFtZXRlclNlcnZpY2V9IGZyb20gJy4vdGFzay90YXNrLXBhcmFtZXRlci5zZXJ2aWNlJztcclxuaW1wb3J0IHtUYXNrQXZhaWxhYmlsaXR5U2VydmljZX0gZnJvbSAnLi90YXNrL3Rhc2stYXZhaWxhYmlsaXR5LnNlcnZpY2UnO1xyXG5pbXBvcnQge1Rhc2tVSVNlcnZpY2V9IGZyb20gJy4vdGFzay90YXNrLXVpLnNlcnZpY2UnO1xyXG5pbXBvcnQge1NlcnZpY2VTZXJ2aWNlfSBmcm9tICcuL3NlcnZpY2Uvc2VydmljZS5zZXJ2aWNlJztcclxuaW1wb3J0IHtTZXJ2aWNlUGFyYW1ldGVyU2VydmljZX0gZnJvbSAnLi9zZXJ2aWNlL3NlcnZpY2UtcGFyYW1ldGVyLnNlcnZpY2UnO1xyXG5pbXBvcnQge0NhcnRvZ3JhcGh5U2VydmljZX0gZnJvbSAnLi9jYXJ0b2dyYXBoeS9jYXJ0b2dyYXBoeS5zZXJ2aWNlJztcclxuaW1wb3J0IHtDYXJ0b2dyYXBoeUF2YWlsYWJpbGl0eVNlcnZpY2V9IGZyb20gJy4vY2FydG9ncmFwaHkvY2FydG9ncmFwaHktYXZhaWxhYmlsaXR5LnNlcnZpY2UnO1xyXG5pbXBvcnQge0NhcnRvZ3JhcGh5RmlsdGVyU2VydmljZX0gZnJvbSAnLi9jYXJ0b2dyYXBoeS9jYXJ0b2dyYXBoeS1maWx0ZXIuc2VydmljZSc7XHJcbmltcG9ydCB7Q2FydG9ncmFwaHlHcm91cFNlcnZpY2V9IGZyb20gJy4vY2FydG9ncmFwaHkvY2FydG9ncmFwaHktZ3JvdXAuc2VydmljZSc7XHJcbmltcG9ydCB7Q2FydG9ncmFwaHlQYXJhbWV0ZXJTZXJ2aWNlfSBmcm9tICcuL2NhcnRvZ3JhcGh5L2NhcnRvZ3JhcGh5LXBhcmFtZXRlci5zZXJ2aWNlJztcclxuaW1wb3J0IHtCYWNrZ3JvdW5kU2VydmljZX0gZnJvbSAnLi9jYXJ0b2dyYXBoeS9iYWNrZ3JvdW5kLnNlcnZpY2UnO1xyXG5pbXBvcnQge1RyZWVTZXJ2aWNlfSBmcm9tICcuL3RyZWUvdHJlZS5zZXJ2aWNlJztcclxuaW1wb3J0IHtUcmVlTm9kZVNlcnZpY2V9IGZyb20gJy4vdHJlZS90cmVlLW5vZGUuc2VydmljZSc7XHJcbmltcG9ydCB7QXBwbGljYXRpb25TZXJ2aWNlfSBmcm9tICcuL2FwcGxpY2F0aW9uL2FwcGxpY2F0aW9uLnNlcnZpY2UnO1xyXG5pbXBvcnQge0FwcGxpY2F0aW9uUGFyYW1ldGVyU2VydmljZX0gZnJvbSAnLi9hcHBsaWNhdGlvbi9hcHBsaWNhdGlvbi1wYXJhbWV0ZXIuc2VydmljZSc7XHJcbmltcG9ydCB7QXBwbGljYXRpb25CYWNrZ3JvdW5kU2VydmljZX0gZnJvbSAnLi9hcHBsaWNhdGlvbi9hcHBsaWNhdGlvbi1iYWNrZ3JvdW5kLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBNYXBDb25maWd1cmF0aW9uTWFuYWdlclNlcnZpY2UgfSBmcm9tICcuL21hcC9tYXAtY29uZmlndXJhdGlvbi1tYW5hZ2VyLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBBdXRoU2VydmljZSB9IGZyb20gJy4vYXV0aC9hdXRoLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBQcmluY2lwYWwgfSBmcm9tICcuL2F1dGgvcHJpbmNpcGFsLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBBdXRoSW50ZXJjZXB0b3IgfSBmcm9tICcuL2F1dGgvYXV0aC5pbnRlcmNlcHRvcic7XHJcbmltcG9ydCB7IEF1dGhFeHBpcmVkSW50ZXJjZXB0b3IgfSBmcm9tICcuL2F1dGgvYXV0aC1leHBpcmVkLmludGVyY2VwdG9yJztcclxuaW1wb3J0IHsgSGFzQW55QXV0aG9yaXR5RGlyZWN0aXZlIH0gZnJvbSAnLi9hdXRoL2hhcy1hbnktYXV0aG9yaXR5LmRpcmVjdGl2ZSc7XHJcbmltcG9ydCB7IEhhc0FueUF1dGhvcml0eU9uVGVycml0b3J5RGlyZWN0aXZlIH0gZnJvbSAnLi9hdXRoL2hhcy1hbnktYXV0aG9yaXR5LW9uLXRlcnJpdG9yeS5kaXJlY3RpdmUnO1xyXG5pbXBvcnQgeyBMb2dpblNlcnZpY2UgfSBmcm9tICcuL2F1dGgvbG9naW4uc2VydmljZSc7XHJcbmltcG9ydCB7IEFjY291bnRTZXJ2aWNlIH0gZnJvbSAnLi9hY2NvdW50L2FjY291bnQuc2VydmljZSc7XHJcbmltcG9ydCB7VHJhbnNsYXRlSHR0cExvYWRlcn0gZnJvbSAnQG5neC10cmFuc2xhdGUvaHR0cC1sb2FkZXInO1xyXG5pbXBvcnQge1RyYW5zbGF0ZUxvYWRlciwgVHJhbnNsYXRlTW9kdWxlfSBmcm9tICdAbmd4LXRyYW5zbGF0ZS9jb3JlJztcclxuaW1wb3J0IHsgVHJhbnNsYXRpb25TZXJ2aWNlIH0gZnJvbSAnLi90cmFuc2xhdGlvbi90cmFuc2xhdGlvbi5zZXJ2aWNlJztcclxuaW1wb3J0IHsgTGFuZ3VhZ2VTZXJ2aWNlIH0gZnJvbSAnLi90cmFuc2xhdGlvbi9sYW5ndWFnZS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgRGFzaGJvYXJkU2VydmljZSB9IGZyb20gJy4vZGFzaGJvYXJkL2Rhc2hib2FyZC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQ2FwYWJpbGl0aWVzU2VydmljZSB9IGZyb20gJy4vY2FwYWJpbGl0aWVzL2NhcGFiaWxpdGllcy5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQ29uZmlndXJhdGlvblBhcmFtZXRlcnNTZXJ2aWNlIH0gZnJvbSAnLi9jb25maWd1cmF0aW9uL2NvbmZpZ3VyYXRpb24tcGFyYW1ldGVycy5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQ2FydG9ncmFwaHlTdHlsZVNlcnZpY2UgfSBmcm9tICcuL2NhcnRvZ3JhcGh5L2NhcnRvZ3JhcGh5LXN0eWxlLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBDYXJ0b2dyYXBoeVNwYXRpYWxTZWxlY3Rpb25QYXJhbWV0ZXJTZXJ2aWNlIH0gZnJvbSAnLi9jYXJ0b2dyYXBoeS9jYXJ0b2dyYXBoeS1zcGF0aWFsLXNlbGVjdGlvbi1wYXJhbWV0ZXIuc2VydmljZSc7XHJcbmltcG9ydCB7IEdldEluZm9TZXJ2aWNlIH0gZnJvbSAnLi9nZXRJbmZvL2dldEluZm8uc2VydmljZSc7XHJcbi8qKiBsb2FkIGkxOG4gYXNzZXRzKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVRyYW5zbGF0ZUxvYWRlcihodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgcmV0dXJuIG5ldyBUcmFuc2xhdGVIdHRwTG9hZGVyKGh0dHAsICcuL2Fzc2V0cy9pMThuLycsICcuanNvbicpO1xyXG59XHJcblxyXG5cclxuLyoqIFNJVE1VTiBmcm9udGVuZCBjb3JlIG1vZHVsZSAqL1xyXG5ATmdNb2R1bGUoe1xyXG4gIGltcG9ydHM6IFtcclxuICAgIC8qUm91dGVyTW9kdWxlLFxyXG4gICAgSHR0cENsaWVudE1vZHVsZSxcclxuICAgIENvbW1vbk1vZHVsZSxcclxuICAgIEFuZ3VsYXJIYWxNb2R1bGUsKi9cclxuICAgIFRyYW5zbGF0ZU1vZHVsZS5mb3JSb290KHtcclxuICAgICAgbG9hZGVyOiB7XHJcbiAgICAgICAgcHJvdmlkZTogVHJhbnNsYXRlTG9hZGVyLFxyXG4gICAgICAgIHVzZUZhY3Rvcnk6IChjcmVhdGVUcmFuc2xhdGVMb2FkZXIpLFxyXG4gICAgICAgIGRlcHM6IFtIdHRwQ2xpZW50XVxyXG4gICAgICB9XHJcbiAgICB9KSxcclxuICBdLFxyXG4gIGRlY2xhcmF0aW9uczogW1xyXG4gICAgSGFzQW55QXV0aG9yaXR5RGlyZWN0aXZlLFxyXG4gICAgSGFzQW55QXV0aG9yaXR5T25UZXJyaXRvcnlEaXJlY3RpdmUsXHJcbiAgXSxcclxuICBleHBvcnRzOiBbXHJcbiAgICBIYXNBbnlBdXRob3JpdHlEaXJlY3RpdmUsXHJcbiAgICBIYXNBbnlBdXRob3JpdHlPblRlcnJpdG9yeURpcmVjdGl2ZSxcclxuICAgIFRyYW5zbGF0ZU1vZHVsZVxyXG4gIF1cclxufSlcclxuZXhwb3J0IGNsYXNzIFNpdG11bkZyb250ZW5kQ29yZU1vZHVsZSB7XHJcbiAgc3RhdGljIGZvclJvb3QoKTogTW9kdWxlV2l0aFByb3ZpZGVycyB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBuZ01vZHVsZTogU2l0bXVuRnJvbnRlbmRDb3JlTW9kdWxlLFxyXG4gICAgICBwcm92aWRlcnM6IFtcclxuICAgICAgICBDb2RlTGlzdFNlcnZpY2UsXHJcbiAgICAgICAgVGVycml0b3J5U2VydmljZSxcclxuICAgICAgICBUZXJyaXRvcnlUeXBlU2VydmljZSxcclxuICAgICAgICBUZXJyaXRvcnlHcm91cFR5cGVTZXJ2aWNlLFxyXG4gICAgICAgIFJvbGVTZXJ2aWNlLFxyXG4gICAgICAgIEFjY291bnRTZXJ2aWNlLFxyXG4gICAgICAgIEF1dGhTZXJ2aWNlLFxyXG4gICAgICAgIFVzZXJTZXJ2aWNlLFxyXG4gICAgICAgIENvbm5lY3Rpb25TZXJ2aWNlLFxyXG4gICAgICAgIFRhc2tTZXJ2aWNlLFxyXG4gICAgICAgIFRhc2tUeXBlU2VydmljZSxcclxuICAgICAgICBUYXNrVUlTZXJ2aWNlLFxyXG4gICAgICAgIFRhc2tHcm91cFNlcnZpY2UsXHJcbiAgICAgICAgVGFza1BhcmFtZXRlclNlcnZpY2UsXHJcbiAgICAgICAgVGFza0F2YWlsYWJpbGl0eVNlcnZpY2UsXHJcbiAgICAgICAgU2VydmljZVNlcnZpY2UsXHJcbiAgICAgICAgQ29uZmlndXJhdGlvblBhcmFtZXRlcnNTZXJ2aWNlLFxyXG4gICAgICAgIENhcGFiaWxpdGllc1NlcnZpY2UsXHJcbiAgICAgICAgR2V0SW5mb1NlcnZpY2UsXHJcbiAgICAgICAgU2VydmljZVBhcmFtZXRlclNlcnZpY2UsXHJcbiAgICAgICAgQ2FydG9ncmFwaHlTZXJ2aWNlLFxyXG4gICAgICAgIENhcnRvZ3JhcGh5R3JvdXBTZXJ2aWNlLFxyXG4gICAgICAgIENhcnRvZ3JhcGh5QXZhaWxhYmlsaXR5U2VydmljZSxcclxuICAgICAgICBDYXJ0b2dyYXBoeVBhcmFtZXRlclNlcnZpY2UsXHJcbiAgICAgICAgQ2FydG9ncmFwaHlTcGF0aWFsU2VsZWN0aW9uUGFyYW1ldGVyU2VydmljZSxcclxuICAgICAgICBDYXJ0b2dyYXBoeVN0eWxlU2VydmljZSxcclxuICAgICAgICBDYXJ0b2dyYXBoeUZpbHRlclNlcnZpY2UsXHJcbiAgICAgICAgQmFja2dyb3VuZFNlcnZpY2UsXHJcbiAgICAgICAgVHJlZVNlcnZpY2UsXHJcbiAgICAgICAgVHJlZU5vZGVTZXJ2aWNlLFxyXG4gICAgICAgIEFwcGxpY2F0aW9uU2VydmljZSxcclxuICAgICAgICBBcHBsaWNhdGlvblBhcmFtZXRlclNlcnZpY2UsXHJcbiAgICAgICAgQXBwbGljYXRpb25CYWNrZ3JvdW5kU2VydmljZSxcclxuICAgICAgICBBdXRoSW50ZXJjZXB0b3IsXHJcbiAgICAgICAgQXV0aEV4cGlyZWRJbnRlcmNlcHRvcixcclxuICAgICAgICBQcmluY2lwYWwsXHJcbiAgICAgICAgVXNlclBvc2l0aW9uU2VydmljZSxcclxuICAgICAgICBVc2VyQ29uZmlndXJhdGlvblNlcnZpY2UsXHJcbiAgICAgICAgTG9naW5TZXJ2aWNlLFxyXG4gICAgICAgIFRyYW5zbGF0aW9uU2VydmljZSxcclxuICAgICAgICBMYW5ndWFnZVNlcnZpY2UsXHJcbiAgICAgICAgRGFzaGJvYXJkU2VydmljZSxcclxuICAgICAgICBNYXBDb25maWd1cmF0aW9uTWFuYWdlclNlcnZpY2UsXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgcHJvdmlkZTogSFRUUF9JTlRFUkNFUFRPUlMsXHJcbiAgICAgICAgICB1c2VDbGFzczogQXV0aEludGVyY2VwdG9yLFxyXG4gICAgICAgICAgbXVsdGk6IHRydWVcclxuICAgICAgICB9XHJcbiAgICAgICAgLCB7XHJcbiAgICAgICAgICBwcm92aWRlOiBIVFRQX0lOVEVSQ0VQVE9SUyxcclxuICAgICAgICAgIHVzZUNsYXNzOiBBdXRoRXhwaXJlZEludGVyY2VwdG9yLFxyXG4gICAgICAgICAgbXVsdGk6IHRydWVcclxuICAgICAgICB9XHJcbiAgICAgIF1cclxuICAgIH07XHJcbiAgfVxyXG59XHJcblxyXG4iLCJpbXBvcnQge01vZHVsZVdpdGhQcm92aWRlcnMsIE5nTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtIdHRwQ2xpZW50LCBIdHRwQ2xpZW50TW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7SGFsUGFyYW0sIFJlc3RTZXJ2aWNlfSBmcm9tICcuL3Jlc3Quc2VydmljZSc7XHJcbmltcG9ydCB7RXh0ZXJuYWxTZXJ2aWNlfSBmcm9tICcuL2V4dGVybmFsLnNlcnZpY2UnO1xyXG5pbXBvcnQge1Jlc291cmNlU2VydmljZX0gZnJvbSAnLi9yZXNvdXJjZS5zZXJ2aWNlJztcclxuaW1wb3J0IHtFeHRlcm5hbENvbmZpZ3VyYXRpb25IYW5kbGVySW50ZXJmYWNlfSBmcm9tICcuL2V4dGVybmFsLWNvbmZpZ3VyYXRpb24uaGFuZGxlcic7XHJcblxyXG5pbXBvcnQgJ3J4anMnO1xyXG5cclxuaW1wb3J0IHtTdWJUeXBlQnVpbGRlcn0gZnJvbSAnLi9zdWJ0eXBlLWJ1aWxkZXInO1xyXG5cclxuZXhwb3J0IHtFeHRlcm5hbFNlcnZpY2V9IGZyb20gJy4vZXh0ZXJuYWwuc2VydmljZSc7XHJcbmV4cG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4vcmVzdC5zZXJ2aWNlJztcclxuZXhwb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi9yZXNvdXJjZSc7XHJcbmV4cG9ydCB7UmVzb3VyY2VBcnJheX0gZnJvbSAnLi9yZXNvdXJjZS1hcnJheSc7XHJcbmV4cG9ydCB7UmVzb3VyY2VTZXJ2aWNlfSBmcm9tICcuL3Jlc291cmNlLnNlcnZpY2UnO1xyXG5leHBvcnQge1NvcnR9IGZyb20gJy4vc29ydCc7XHJcbmV4cG9ydCB7UmVzb3VyY2VIZWxwZXJ9IGZyb20gJy4vcmVzb3VyY2UtaGVscGVyJztcclxuZXhwb3J0IHtFeHRlcm5hbENvbmZpZ3VyYXRpb259IGZyb20gJy4vRXh0ZXJuYWxDb25maWd1cmF0aW9uJztcclxuZXhwb3J0IHtFeHRlcm5hbENvbmZpZ3VyYXRpb25IYW5kbGVySW50ZXJmYWNlfSBmcm9tICcuL2V4dGVybmFsLWNvbmZpZ3VyYXRpb24uaGFuZGxlcic7XHJcbmV4cG9ydCB7SGFsT3B0aW9ucywgSGFsUGFyYW19IGZyb20gJy4vcmVzdC5zZXJ2aWNlJztcclxuZXhwb3J0IHtTdWJUeXBlQnVpbGRlcn0gZnJvbSAnLi9zdWJ0eXBlLWJ1aWxkZXInO1xyXG5cclxuXHJcbi8qKiBBbmd1bGFyIEhBTCBtb2R1bGUgKi9cclxuQE5nTW9kdWxlKHtcclxuICAgIGltcG9ydHM6IFtIdHRwQ2xpZW50TW9kdWxlXSxcclxuICAgIGRlY2xhcmF0aW9uczogW10sXHJcbiAgICBleHBvcnRzOiBbSHR0cENsaWVudE1vZHVsZV0sXHJcbiAgICBwcm92aWRlcnM6IFtcclxuICAgICAgICBFeHRlcm5hbFNlcnZpY2UsXHJcbiAgICAgICAgSHR0cENsaWVudCxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHByb3ZpZGU6IFJlc291cmNlU2VydmljZSxcclxuICAgICAgICAgICAgdXNlQ2xhc3M6IFJlc291cmNlU2VydmljZSxcclxuICAgICAgICAgICAgZGVwczogW0V4dGVybmFsU2VydmljZV1cclxuICAgICAgICB9XVxyXG59KVxyXG5leHBvcnQgY2xhc3MgQW5ndWxhckhhbE1vZHVsZSB7XHJcbiAgICBzdGF0aWMgZm9yUm9vdCgpOiBNb2R1bGVXaXRoUHJvdmlkZXJzIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBuZ01vZHVsZTogQW5ndWxhckhhbE1vZHVsZSxcclxuICAgICAgICAgICAgcHJvdmlkZXJzOiBbXHJcbiAgICAgICAgICAgICAgICBFeHRlcm5hbFNlcnZpY2UsXHJcbiAgICAgICAgICAgICAgICBIdHRwQ2xpZW50LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHByb3ZpZGU6IFJlc291cmNlU2VydmljZSxcclxuICAgICAgICAgICAgICAgICAgICB1c2VDbGFzczogUmVzb3VyY2VTZXJ2aWNlLFxyXG4gICAgICAgICAgICAgICAgICAgIGRlcHM6IFtFeHRlcm5hbFNlcnZpY2VdXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59Il0sIm5hbWVzIjpbIm1hcCIsImNhdGNoRXJyb3IiLCJvYnNlcnZhYmxlVGhyb3dFcnJvciIsInVybC5wYXJzZSIsInRzbGliXzEuX192YWx1ZXMiLCJpc051bGxPclVuZGVmaW5lZCIsImlzUHJpbWl0aXZlIiwidXJsIiwiSHR0cEhlYWRlcnMiLCJIdHRwUGFyYW1zIiwib2JzZXJ2YWJsZU9mIiwiSW5qZWN0YWJsZSIsInRzbGliXzEuX19leHRlbmRzIiwiSW5qZWN0IiwibWVyZ2VNYXAiLCJJbmplY3RvciIsIkh0dHBDbGllbnQiLCJPYnNlcnZhYmxlIiwiU3ViamVjdCIsInJvdXRlciIsIkh0dHBFcnJvclJlc3BvbnNlIiwiUm91dGVyIiwiQmVoYXZpb3JTdWJqZWN0IiwiRGlyZWN0aXZlIiwiVGVtcGxhdGVSZWYiLCJWaWV3Q29udGFpbmVyUmVmIiwiSW5wdXQiLCJUcmFuc2xhdGVIdHRwTG9hZGVyIiwiSFRUUF9JTlRFUkNFUFRPUlMiLCJOZ01vZHVsZSIsIlRyYW5zbGF0ZU1vZHVsZSIsIlRyYW5zbGF0ZUxvYWRlciIsIkh0dHBDbGllbnRNb2R1bGUiXSwibWFwcGluZ3MiOiI7Ozs7OztJQUFBOzs7Ozs7Ozs7Ozs7OztJQWNBO0lBRUEsSUFBSSxhQUFhLEdBQUcsTUFBTSxDQUFDLGNBQWM7U0FDcEMsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFLFlBQVksS0FBSyxJQUFJLFVBQVUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDNUUsVUFBVSxDQUFDLEVBQUUsQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQztZQUFFLElBQUksQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7Z0JBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFFL0UsdUJBQTBCLENBQUMsRUFBRSxDQUFDO1FBQzFCLGFBQWEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDcEIsZ0JBQWdCLElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDLEVBQUU7UUFDdkMsQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLEtBQUssSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLFNB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