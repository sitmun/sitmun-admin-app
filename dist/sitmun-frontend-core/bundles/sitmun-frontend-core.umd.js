(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('rxjs'), require('rxjs/operators'), require('url'), require('@angular/common/http'), require('util'), require('@angular/core'), require('rxjs-compat'), require('@angular/router'), require('@ngx-translate/http-loader'), require('@ngx-translate/core')) :
    typeof define === 'function' && define.amd ? define('@sitmun/frontend-core', ['exports', 'rxjs', 'rxjs/operators', 'url', '@angular/common/http', 'util', '@angular/core', 'rxjs-compat', '@angular/router', '@ngx-translate/http-loader', '@ngx-translate/core'], factory) :
    (factory((global.sitmun = global.sitmun || {}, global.sitmun['frontend-core'] = {}),global.rxjs,global.rxjs.operators,null,global.ng.common.http,null,global.ng.core,null,global.ng.router,null,null));
}(this, (function (exports,rxjs,operators,url,i1,util,i0,rxjsCompat,router,httpLoader,core) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b)
                if (b.hasOwnProperty(p))
                    d[p] = b[p]; };
        return extendStatics(d, b);
    };
    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m)
            return m.call(o);
        if (o && typeof o.length === "number")
            return {
                next: function () {
                    if (o && i >= o.length)
                        o = void 0;
                    return { value: o && o[i++], done: !o };
                }
            };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
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
                var e_1, _a;
                if (this.sortInfo) {
                    try {
                        for (var _b = __values(this.sortInfo), _c = _b.next(); !_c.done; _c = _b.next()) {
                            var item = _c.value;
                            uri = uri.concat('&sort=', item.path, ',', item.order);
                        }
                    }
                    catch (e_1_1) {
                        e_1 = { error: e_1_1 };
                    }
                    finally {
                        try {
                            if (_c && !_c.done && (_a = _b.return))
                                _a.call(_b);
                        }
                        finally {
                            if (e_1)
                                throw e_1.error;
                        }
                    }
                }
                return uri;
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
                var e_1, _a, e_2, _b;
                if (options) {
                    if (options.params) {
                        try {
                            for (var _c = __values(options.params), _d = _c.next(); !_d.done; _d = _c.next()) {
                                var param = _d.value;
                                params = params.append(param.key, param.value.toString());
                            }
                        }
                        catch (e_1_1) {
                            e_1 = { error: e_1_1 };
                        }
                        finally {
                            try {
                                if (_d && !_d.done && (_a = _c.return))
                                    _a.call(_c);
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
                            for (var _e = __values(options.sort), _f = _e.next(); !_f.done; _f = _e.next()) {
                                var s = _f.value;
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
                                if (_f && !_f.done && (_b = _e.return))
                                    _b.call(_e);
                            }
                            finally {
                                if (e_2)
                                    throw e_2.error;
                            }
                        }
                    }
                }
                return params;
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
                var e_3, _a, e_4, _b;
                try {
                    for (var _c = __values(Object.keys(payload[result._embedded])), _d = _c.next(); !_d.done; _d = _c.next()) {
                        var embeddedClassName = _d.value;
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
                            catch (e_4_1) {
                                e_4 = { error: e_4_1 };
                            }
                            finally {
                                try {
                                    if (items_1_1 && !items_1_1.done && (_b = items_1.return))
                                        _b.call(items_1);
                                }
                                finally {
                                    if (e_4)
                                        throw e_4.error;
                                }
                            }
                        }
                    }
                }
                catch (e_3_1) {
                    e_3 = { error: e_3_1 };
                }
                finally {
                    try {
                        if (_d && !_d.done && (_a = _c.return))
                            _a.call(_c);
                    }
                    finally {
                        if (e_3)
                            throw e_3.error;
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
    var Resource = /** @class */ (function () {
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
                        var e_1, _a;
                        if (builder) {
                            try {
                                for (var _b = __values(Object.keys(data['_links'])), _c = _b.next(); !_c.done; _c = _b.next()) {
                                    var embeddedClassName = _c.value;
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
                                    if (_c && !_c.done && (_a = _b.return))
                                        _a.call(_b);
                                }
                                finally {
                                    if (e_1)
                                        throw e_1.error;
                                }
                            }
                        }
                        return ResourceHelper.instantiateResource(result, data);
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
     */ User = /** @class */ (function (_super) {
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
     */ AuthInterceptor = /** @class */ (function () {
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
    var AuthExpiredInterceptor = /** @class */ (function () {
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
     */ UserPosition = /** @class */ (function (_super) {
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
     */ UserConfiguration = /** @class */ (function (_super) {
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
     */ Territory = /** @class */ (function (_super) {
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
     */ TerritoryType = /** @class */ (function (_super) {
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
     */ TerritoryGroupType = /** @class */ (function (_super) {
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
     */ Role = /** @class */ (function (_super) {
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
     */ Connection = /** @class */ (function (_super) {
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
     */ Task = /** @class */ (function (_super) {
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
     */ TaskType = /** @class */ (function (_super) {
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
     */ TaskGroup = /** @class */ (function (_super) {
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
     */ TaskParameter = /** @class */ (function (_super) {
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
     */ TaskAvailability = /** @class */ (function (_super) {
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
     */ TaskUI = /** @class */ (function (_super) {
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
     */ Translation = /** @class */ (function (_super) {
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
     */ Language = /** @class */ (function (_super) {
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
     */ Service = /** @class */ (function (_super) {
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
     */ ConfigurationParameter = /** @class */ (function (_super) {
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
    var ConfigurationParametersService = /** @class */ (function (_super) {
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
     */ ServiceParameter = /** @class */ (function (_super) {
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
     */ Capabilitie = /** @class */ (function (_super) {
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
     */ Info = /** @class */ (function (_super) {
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
    var GetInfoService = /** @class */ (function (_super) {
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
     */ Cartography = /** @class */ (function (_super) {
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
     */ CartographyGroup = /** @class */ (function (_super) {
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
     */ CartographyAvailability = /** @class */ (function (_super) {
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
     */ CartographyFilter = /** @class */ (function (_super) {
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
     */ CartographyParameter = /** @class */ (function (_super) {
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
    var CartographySpatialSelectionParameterService = /** @class */ (function (_super) {
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
     */ CartographyStyle = /** @class */ (function (_super) {
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
    var CartographyStyleService = /** @class */ (function (_super) {
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
     */ Background = /** @class */ (function (_super) {
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
     */ Tree = /** @class */ (function (_super) {
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
     */ TreeNode = /** @class */ (function (_super) {
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
     */ Application = /** @class */ (function (_super) {
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
     */ ApplicationBackground = /** @class */ (function (_super) {
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
     */ ApplicationParameter = /** @class */ (function (_super) {
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
     */ CodeList = /** @class */ (function (_super) {
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
     */ Layer = /** @class */ (function () {
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
     */ OptionalParameter = /** @class */ (function () {
        function OptionalParameter() {
        }
        return OptionalParameter;
    }());
    /**
     * Layer configuration model: modify the configuration of a layer when interacting with the map (make visible, move the layer ...)
     */
    var /**
     * Layer configuration model: modify the configuration of a layer when interacting with the map (make visible, move the layer ...)
     */ LayerConfiguration = /** @class */ (function () {
        function LayerConfiguration() {
        }
        return LayerConfiguration;
    }());
    /**
     * Layer group model
     */
    var /**
     * Layer group model
     */ LayerGroup = /** @class */ (function () {
        function LayerGroup() {
        }
        return LayerGroup;
    }());
    /**
     * Map options configuration model
     */
    var /**
     * Map options configuration model
     */ MapOptionsConfiguration = /** @class */ (function () {
        function MapOptionsConfiguration() {
        }
        return MapOptionsConfiguration;
    }());
    /**
     * Map component status model
     */
    var /**
     * Map component status model
     */ MapComponentStatus = /** @class */ (function () {
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2l0bXVuLWZyb250ZW5kLWNvcmUudW1kLmpzLm1hcCIsInNvdXJjZXMiOltudWxsLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlLWFycmF5LnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZS1oZWxwZXIudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvdXNlci91c2VyLm1vZGVsLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvYW5ndWxhci1oYWwvc3JjL2xpYi9leHRlcm5hbC5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZS5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS9hY2NvdW50L2FjY291bnQuc2VydmljZS50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL2F1dGgvYXV0aC5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvYXV0aC9hdXRoLmludGVyY2VwdG9yLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvYXV0aC9wcmluY2lwYWwuc2VydmljZS50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL2F1dGgvYXV0aC1leHBpcmVkLmludGVyY2VwdG9yLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvYXV0aC9sb2dpbi5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvZGFzaGJvYXJkL2Rhc2hib2FyZC5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvdXNlci91c2VyLnNlcnZpY2UudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS91c2VyL3VzZXItcG9zaXRpb24ubW9kZWwudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS91c2VyL3VzZXItcG9zaXRpb24uc2VydmljZS50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL3VzZXIvdXNlci1jb25maWd1cmF0aW9uLm1vZGVsLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvdXNlci91c2VyLWNvbmZpZ3VyYXRpb24uc2VydmljZS50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL3RlcnJpdG9yeS90ZXJyaXRvcnkubW9kZWwudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS90ZXJyaXRvcnkvdGVycml0b3J5LnNlcnZpY2UudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS90ZXJyaXRvcnkvdGVycml0b3J5LXR5cGUubW9kZWwudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS90ZXJyaXRvcnkvdGVycml0b3J5LXR5cGUuc2VydmljZS50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL3RlcnJpdG9yeS90ZXJyaXRvcnktZ3JvdXAtdHlwZS5tb2RlbC50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL3RlcnJpdG9yeS90ZXJyaXRvcnktZ3JvdXAtdHlwZS5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvcm9sZS9yb2xlLm1vZGVsLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvcm9sZS9yb2xlLnNlcnZpY2UudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS9jb25uZWN0aW9uL2Nvbm5lY3Rpb24ubW9kZWwudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS9jb25uZWN0aW9uL2Nvbm5lY3Rpb24uc2VydmljZS50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL3Rhc2svdGFzay5tb2RlbC50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL3Rhc2svdGFzay5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvdGFzay90YXNrLXR5cGUubW9kZWwudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS90YXNrL3Rhc2stdHlwZS5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvdGFzay90YXNrLWdyb3VwLm1vZGVsLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvdGFzay90YXNrLWdyb3VwLnNlcnZpY2UudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS90YXNrL3Rhc2stcGFyYW1ldGVyLm1vZGVsLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvdGFzay90YXNrLXBhcmFtZXRlci5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvdGFzay90YXNrLWF2YWlsYWJpbGl0eS5tb2RlbC50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL3Rhc2svdGFzay1hdmFpbGFiaWxpdHkuc2VydmljZS50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL3Rhc2svdGFzay11aS5tb2RlbC50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL3Rhc2svdGFzay11aS5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvdHJhbnNsYXRpb24vdHJhbnNsYXRpb24ubW9kZWwudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS90cmFuc2xhdGlvbi90cmFuc2xhdGlvbi5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvdHJhbnNsYXRpb24vbGFuZ3VhZ2UubW9kZWwudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS90cmFuc2xhdGlvbi9sYW5ndWFnZS5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvc2VydmljZS9zZXJ2aWNlLm1vZGVsLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvc2VydmljZS9zZXJ2aWNlLnNlcnZpY2UudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS9jb25maWd1cmF0aW9uL2NvbmZpZ3VyYXRpb24tcGFyYW1ldGVycy5tb2RlbC50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL2NvbmZpZ3VyYXRpb24vY29uZmlndXJhdGlvbi1wYXJhbWV0ZXJzLnNlcnZpY2UudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS9zZXJ2aWNlL3NlcnZpY2UtcGFyYW1ldGVyLm1vZGVsLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvc2VydmljZS9zZXJ2aWNlLXBhcmFtZXRlci5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvY2FwYWJpbGl0aWVzL2NhcGFiaWxpdGllLm1vZGVsLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvY2FwYWJpbGl0aWVzL2NhcGFiaWxpdGllcy5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvZ2V0SW5mby9pbmZvLm1vZGVsLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvZ2V0SW5mby9nZXRJbmZvLnNlcnZpY2UudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS9jYXJ0b2dyYXBoeS9jYXJ0b2dyYXBoeS5tb2RlbC50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL2NhcnRvZ3JhcGh5L2NhcnRvZ3JhcGh5LnNlcnZpY2UudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS9jYXJ0b2dyYXBoeS9jYXJ0b2dyYXBoeS1ncm91cC5tb2RlbC50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL2NhcnRvZ3JhcGh5L2NhcnRvZ3JhcGh5LWdyb3VwLnNlcnZpY2UudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS9jYXJ0b2dyYXBoeS9jYXJ0b2dyYXBoeS1hdmFpbGFiaWxpdHkubW9kZWwudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS9jYXJ0b2dyYXBoeS9jYXJ0b2dyYXBoeS1hdmFpbGFiaWxpdHkuc2VydmljZS50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL2NhcnRvZ3JhcGh5L2NhcnRvZ3JhcGh5LWZpbHRlci5tb2RlbC50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL2NhcnRvZ3JhcGh5L2NhcnRvZ3JhcGh5LWZpbHRlci5zZXJ2aWNlLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvY2FydG9ncmFwaHkvY2FydG9ncmFwaHktcGFyYW1ldGVyLm1vZGVsLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvY2FydG9ncmFwaHkvY2FydG9ncmFwaHktcGFyYW1ldGVyLnNlcnZpY2UudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS9jYXJ0b2dyYXBoeS9jYXJ0b2dyYXBoeS1zcGF0aWFsLXNlbGVjdGlvbi1wYXJhbWV0ZXIuc2VydmljZS50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL2NhcnRvZ3JhcGh5L2NhcnRvZ3JhcGh5LXN0eWxlLm1vZGVsLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvY2FydG9ncmFwaHkvY2FydG9ncmFwaHktc3R5bGUuc2VydmljZS50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL2NhcnRvZ3JhcGh5L2JhY2tncm91bmQubW9kZWwudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS9jYXJ0b2dyYXBoeS9iYWNrZ3JvdW5kLnNlcnZpY2UudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS90cmVlL3RyZWUubW9kZWwudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS90cmVlL3RyZWUuc2VydmljZS50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL3RyZWUvdHJlZS1ub2RlLm1vZGVsLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvdHJlZS90cmVlLW5vZGUuc2VydmljZS50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL2FwcGxpY2F0aW9uL2FwcGxpY2F0aW9uLm1vZGVsLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvYXBwbGljYXRpb24vYXBwbGljYXRpb24uc2VydmljZS50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL2FwcGxpY2F0aW9uL2FwcGxpY2F0aW9uLWJhY2tncm91bmQubW9kZWwudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS9hcHBsaWNhdGlvbi9hcHBsaWNhdGlvbi1iYWNrZ3JvdW5kLnNlcnZpY2UudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS9hcHBsaWNhdGlvbi9hcHBsaWNhdGlvbi1wYXJhbWV0ZXIubW9kZWwudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS9hcHBsaWNhdGlvbi9hcHBsaWNhdGlvbi1wYXJhbWV0ZXIuc2VydmljZS50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL2NvZGVsaXN0L2NvZGVsaXN0Lm1vZGVsLnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvY29kZWxpc3QvY29kZWxpc3Quc2VydmljZS50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL21hcC9tYXAtY29uZmlndXJhdGlvbi1tYW5hZ2VyLnNlcnZpY2UudHMiLCJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS9hdXRoL2hhcy1hbnktYXV0aG9yaXR5LmRpcmVjdGl2ZS50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL2F1dGgvaGFzLWFueS1hdXRob3JpdHktb24tdGVycml0b3J5LmRpcmVjdGl2ZS50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL3NpdG11bi1mcm9udGVuZC1jb3JlLm1vZHVsZS50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL2FuZ3VsYXItaGFsL3NyYy9saWIvYW5ndWxhci1oYWwubW9kdWxlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qISAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5Db3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi5cclxuXHJcblBlcm1pc3Npb24gdG8gdXNlLCBjb3B5LCBtb2RpZnksIGFuZC9vciBkaXN0cmlidXRlIHRoaXMgc29mdHdhcmUgZm9yIGFueVxyXG5wdXJwb3NlIHdpdGggb3Igd2l0aG91dCBmZWUgaXMgaGVyZWJ5IGdyYW50ZWQuXHJcblxyXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiIEFORCBUSEUgQVVUSE9SIERJU0NMQUlNUyBBTEwgV0FSUkFOVElFUyBXSVRIXHJcblJFR0FSRCBUTyBUSElTIFNPRlRXQVJFIElOQ0xVRElORyBBTEwgSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWVxyXG5BTkQgRklUTkVTUy4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUiBCRSBMSUFCTEUgRk9SIEFOWSBTUEVDSUFMLCBESVJFQ1QsXHJcbklORElSRUNULCBPUiBDT05TRVFVRU5USUFMIERBTUFHRVMgT1IgQU5ZIERBTUFHRVMgV0hBVFNPRVZFUiBSRVNVTFRJTkcgRlJPTVxyXG5MT1NTIE9GIFVTRSwgREFUQSBPUiBQUk9GSVRTLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgTkVHTElHRU5DRSBPUlxyXG5PVEhFUiBUT1JUSU9VUyBBQ1RJT04sIEFSSVNJTkcgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgVVNFIE9SXHJcblBFUkZPUk1BTkNFIE9GIFRISVMgU09GVFdBUkUuXHJcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXHJcbi8qIGdsb2JhbCBSZWZsZWN0LCBQcm9taXNlICovXHJcblxyXG52YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uKGQsIGIpIHtcclxuICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICByZXR1cm4gZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4dGVuZHMoZCwgYikge1xyXG4gICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG59XHJcblxyXG5leHBvcnQgdmFyIF9fYXNzaWduID0gZnVuY3Rpb24oKSB7XHJcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gX19hc3NpZ24odCkge1xyXG4gICAgICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpIHRbcF0gPSBzW3BdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdDtcclxuICAgIH1cclxuICAgIHJldHVybiBfX2Fzc2lnbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZXN0KHMsIGUpIHtcclxuICAgIHZhciB0ID0ge307XHJcbiAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkgJiYgZS5pbmRleE9mKHApIDwgMClcclxuICAgICAgICB0W3BdID0gc1twXTtcclxuICAgIGlmIChzICE9IG51bGwgJiYgdHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPT09IFwiZnVuY3Rpb25cIilcclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgcCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMocyk7IGkgPCBwLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChlLmluZGV4T2YocFtpXSkgPCAwICYmIE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGUuY2FsbChzLCBwW2ldKSlcclxuICAgICAgICAgICAgICAgIHRbcFtpXV0gPSBzW3BbaV1dO1xyXG4gICAgICAgIH1cclxuICAgIHJldHVybiB0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xyXG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XHJcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xyXG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcGFyYW0ocGFyYW1JbmRleCwgZGVjb3JhdG9yKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwga2V5KSB7IGRlY29yYXRvcih0YXJnZXQsIGtleSwgcGFyYW1JbmRleCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpIHtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5tZXRhZGF0YSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gUmVmbGVjdC5tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0ZXIodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19nZW5lcmF0b3IodGhpc0FyZywgYm9keSkge1xyXG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZztcclxuICAgIHJldHVybiBnID0geyBuZXh0OiB2ZXJiKDApLCBcInRocm93XCI6IHZlcmIoMSksIFwicmV0dXJuXCI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XHJcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xyXG4gICAgICAgIHdoaWxlIChfKSB0cnkge1xyXG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XHJcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbb3BbMF0gJiAyLCB0LnZhbHVlXTtcclxuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xyXG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XHJcbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2NyZWF0ZUJpbmRpbmcobywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICBvW2syXSA9IG1ba107XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4cG9ydFN0YXIobSwgZXhwb3J0cykge1xyXG4gICAgZm9yICh2YXIgcCBpbiBtKSBpZiAocCAhPT0gXCJkZWZhdWx0XCIgJiYgIWV4cG9ydHMuaGFzT3duUHJvcGVydHkocCkpIGV4cG9ydHNbcF0gPSBtW3BdO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX192YWx1ZXMobykge1xyXG4gICAgdmFyIHMgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgU3ltYm9sLml0ZXJhdG9yLCBtID0gcyAmJiBvW3NdLCBpID0gMDtcclxuICAgIGlmIChtKSByZXR1cm4gbS5jYWxsKG8pO1xyXG4gICAgaWYgKG8gJiYgdHlwZW9mIG8ubGVuZ3RoID09PSBcIm51bWJlclwiKSByZXR1cm4ge1xyXG4gICAgICAgIG5leHQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKG8gJiYgaSA+PSBvLmxlbmd0aCkgbyA9IHZvaWQgMDtcclxuICAgICAgICAgICAgcmV0dXJuIHsgdmFsdWU6IG8gJiYgb1tpKytdLCBkb25lOiAhbyB9O1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKHMgPyBcIk9iamVjdCBpcyBub3QgaXRlcmFibGUuXCIgOiBcIlN5bWJvbC5pdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3JlYWQobywgbikge1xyXG4gICAgdmFyIG0gPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdO1xyXG4gICAgaWYgKCFtKSByZXR1cm4gbztcclxuICAgIHZhciBpID0gbS5jYWxsKG8pLCByLCBhciA9IFtdLCBlO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICB3aGlsZSAoKG4gPT09IHZvaWQgMCB8fCBuLS0gPiAwKSAmJiAhKHIgPSBpLm5leHQoKSkuZG9uZSkgYXIucHVzaChyLnZhbHVlKTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlcnJvcikgeyBlID0geyBlcnJvcjogZXJyb3IgfTsgfVxyXG4gICAgZmluYWxseSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKHIgJiYgIXIuZG9uZSAmJiAobSA9IGlbXCJyZXR1cm5cIl0pKSBtLmNhbGwoaSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpbmFsbHkgeyBpZiAoZSkgdGhyb3cgZS5lcnJvcjsgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWQoKSB7XHJcbiAgICBmb3IgKHZhciBhciA9IFtdLCBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKylcclxuICAgICAgICBhciA9IGFyLmNvbmNhdChfX3JlYWQoYXJndW1lbnRzW2ldKSk7XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZEFycmF5cygpIHtcclxuICAgIGZvciAodmFyIHMgPSAwLCBpID0gMCwgaWwgPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgaWw7IGkrKykgcyArPSBhcmd1bWVudHNbaV0ubGVuZ3RoO1xyXG4gICAgZm9yICh2YXIgciA9IEFycmF5KHMpLCBrID0gMCwgaSA9IDA7IGkgPCBpbDsgaSsrKVxyXG4gICAgICAgIGZvciAodmFyIGEgPSBhcmd1bWVudHNbaV0sIGogPSAwLCBqbCA9IGEubGVuZ3RoOyBqIDwgamw7IGorKywgaysrKVxyXG4gICAgICAgICAgICByW2tdID0gYVtqXTtcclxuICAgIHJldHVybiByO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXQodikge1xyXG4gICAgcmV0dXJuIHRoaXMgaW5zdGFuY2VvZiBfX2F3YWl0ID8gKHRoaXMudiA9IHYsIHRoaXMpIDogbmV3IF9fYXdhaXQodik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jR2VuZXJhdG9yKHRoaXNBcmcsIF9hcmd1bWVudHMsIGdlbmVyYXRvcikge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBnID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pLCBpLCBxID0gW107XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaWYgKGdbbl0pIGlbbl0gPSBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKGEsIGIpIHsgcS5wdXNoKFtuLCB2LCBhLCBiXSkgPiAxIHx8IHJlc3VtZShuLCB2KTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHJlc3VtZShuLCB2KSB7IHRyeSB7IHN0ZXAoZ1tuXSh2KSk7IH0gY2F0Y2ggKGUpIHsgc2V0dGxlKHFbMF1bM10sIGUpOyB9IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAocikgeyByLnZhbHVlIGluc3RhbmNlb2YgX19hd2FpdCA/IFByb21pc2UucmVzb2x2ZShyLnZhbHVlLnYpLnRoZW4oZnVsZmlsbCwgcmVqZWN0KSA6IHNldHRsZShxWzBdWzJdLCByKTsgfVxyXG4gICAgZnVuY3Rpb24gZnVsZmlsbCh2YWx1ZSkgeyByZXN1bWUoXCJuZXh0XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gcmVqZWN0KHZhbHVlKSB7IHJlc3VtZShcInRocm93XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKGYsIHYpIHsgaWYgKGYodiksIHEuc2hpZnQoKSwgcS5sZW5ndGgpIHJlc3VtZShxWzBdWzBdLCBxWzBdWzFdKTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0RlbGVnYXRvcihvKSB7XHJcbiAgICB2YXIgaSwgcDtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiwgZnVuY3Rpb24gKGUpIHsgdGhyb3cgZTsgfSksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4sIGYpIHsgaVtuXSA9IG9bbl0gPyBmdW5jdGlvbiAodikgeyByZXR1cm4gKHAgPSAhcCkgPyB7IHZhbHVlOiBfX2F3YWl0KG9bbl0odikpLCBkb25lOiBuID09PSBcInJldHVyblwiIH0gOiBmID8gZih2KSA6IHY7IH0gOiBmOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jVmFsdWVzKG8pIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgbSA9IG9bU3ltYm9sLmFzeW5jSXRlcmF0b3JdLCBpO1xyXG4gICAgcmV0dXJuIG0gPyBtLmNhbGwobykgOiAobyA9IHR5cGVvZiBfX3ZhbHVlcyA9PT0gXCJmdW5jdGlvblwiID8gX192YWx1ZXMobykgOiBvW1N5bWJvbC5pdGVyYXRvcl0oKSwgaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGkpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlbbl0gPSBvW25dICYmIGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7IHYgPSBvW25dKHYpLCBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCB2LmRvbmUsIHYudmFsdWUpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgZCwgdikgeyBQcm9taXNlLnJlc29sdmUodikudGhlbihmdW5jdGlvbih2KSB7IHJlc29sdmUoeyB2YWx1ZTogdiwgZG9uZTogZCB9KTsgfSwgcmVqZWN0KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tYWtlVGVtcGxhdGVPYmplY3QoY29va2VkLCByYXcpIHtcclxuICAgIGlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvb2tlZCwgXCJyYXdcIiwgeyB2YWx1ZTogcmF3IH0pOyB9IGVsc2UgeyBjb29rZWQucmF3ID0gcmF3OyB9XHJcbiAgICByZXR1cm4gY29va2VkO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0U3Rhcihtb2QpIHtcclxuICAgIGlmIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpIHJldHVybiBtb2Q7XHJcbiAgICB2YXIgcmVzdWx0ID0ge307XHJcbiAgICBpZiAobW9kICE9IG51bGwpIGZvciAodmFyIGsgaW4gbW9kKSBpZiAoT2JqZWN0Lmhhc093blByb3BlcnR5LmNhbGwobW9kLCBrKSkgcmVzdWx0W2tdID0gbW9kW2tdO1xyXG4gICAgcmVzdWx0LmRlZmF1bHQgPSBtb2Q7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnREZWZhdWx0KG1vZCkge1xyXG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBkZWZhdWx0OiBtb2QgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fY2xhc3NQcml2YXRlRmllbGRHZXQocmVjZWl2ZXIsIHByaXZhdGVNYXApIHtcclxuICAgIGlmICghcHJpdmF0ZU1hcC5oYXMocmVjZWl2ZXIpKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcImF0dGVtcHRlZCB0byBnZXQgcHJpdmF0ZSBmaWVsZCBvbiBub24taW5zdGFuY2VcIik7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcHJpdmF0ZU1hcC5nZXQocmVjZWl2ZXIpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19jbGFzc1ByaXZhdGVGaWVsZFNldChyZWNlaXZlciwgcHJpdmF0ZU1hcCwgdmFsdWUpIHtcclxuICAgIGlmICghcHJpdmF0ZU1hcC5oYXMocmVjZWl2ZXIpKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcImF0dGVtcHRlZCB0byBzZXQgcHJpdmF0ZSBmaWVsZCBvbiBub24taW5zdGFuY2VcIik7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlTWFwLnNldChyZWNlaXZlciwgdmFsdWUpO1xyXG4gICAgcmV0dXJuIHZhbHVlO1xyXG59XHJcbiIsIlxyXG5pbXBvcnQge3Rocm93RXJyb3IgYXMgb2JzZXJ2YWJsZVRocm93RXJyb3J9IGZyb20gJ3J4anMnO1xyXG5cclxuaW1wb3J0IHtjYXRjaEVycm9yLCBtYXB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuaW1wb3J0IHtTb3J0fSBmcm9tICcuL3NvcnQnO1xyXG5pbXBvcnQge0FycmF5SW50ZXJmYWNlfSBmcm9tICcuL2FycmF5LWludGVyZmFjZSc7XHJcbmltcG9ydCB7UmVzb3VyY2VIZWxwZXJ9IGZyb20gJy4vcmVzb3VyY2UtaGVscGVyJztcclxuaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi9yZXNvdXJjZSc7XHJcbmltcG9ydCAqIGFzIHVybCBmcm9tICd1cmwnO1xyXG5pbXBvcnQge09ic2VydmFibGV9IGZyb20gJ3J4anMnO1xyXG5cclxuLyoqIFJFU1QgYXJyYXkgb2YgcmVzb3VyY2UgaW1wbGVtZW50YXRpb24gKi9cclxuZXhwb3J0IGNsYXNzIFJlc291cmNlQXJyYXk8VCBleHRlbmRzIFJlc291cmNlPiBpbXBsZW1lbnRzIEFycmF5SW50ZXJmYWNlPFQ+IHtcclxuICAgIC8qKiBzb3J0aW5nIGluZm8gKi9cclxuICAgIHB1YmxpYyBzb3J0SW5mbzogU29ydFtdO1xyXG4gICAgLyoqIHByb3h5IHVybCAqL1xyXG4gICAgcHVibGljIHByb3h5VXJsOiBzdHJpbmc7XHJcbiAgICAvKiogcm9vdCB1cmwgKi9cclxuICAgIHB1YmxpYyByb290VXJsOiBzdHJpbmc7XHJcblxyXG4gICAgLyoqIHNlbGYgdXJsICovXHJcbiAgICBwdWJsaWMgc2VsZl91cmk6IHN0cmluZztcclxuICAgIC8qKiBuZXh0IHJlc291cmNlIHVybCAqL1xyXG4gICAgcHVibGljIG5leHRfdXJpOiBzdHJpbmc7XHJcbiAgICAvKiogcHJldmlvdXMgcmVzb3VyY2UgdXJsICovXHJcbiAgICBwdWJsaWMgcHJldl91cmk6IHN0cmluZztcclxuICAgIC8qKiBmaXJzdCByZXNvdXJjZSB1cmwgKi9cclxuICAgIHB1YmxpYyBmaXJzdF91cmk6IHN0cmluZztcclxuICAgIC8qKiBsYXN0IHJlc291cmNlIHVybCAqL1xyXG4gICAgcHVibGljIGxhc3RfdXJpOiBzdHJpbmc7XHJcblxyXG4gICAgLyoqIGVtYmVkZGVkIGFycmF5IGxpc3QgKi9cclxuICAgIHB1YmxpYyBfZW1iZWRkZWQ7XHJcblxyXG4gICAgLyoqIHRvdGFsIG51bWJlciBvZiBlbGVtZW50cyBpbiB0aGlzIGFycmF5ICovXHJcbiAgICBwdWJsaWMgdG90YWxFbGVtZW50cyA9IDA7XHJcbiAgICAvKiogdG90YWwgbnVtYmVyIG9mIHBhZ2VzIGluIHRoZSByZXNwb25zZSAqL1xyXG4gICAgcHVibGljIHRvdGFsUGFnZXMgPSAxO1xyXG4gICAgXHJcbiAgICAvKiogcGFnZSBudW1iZXIgaW4gdGhlIHJlc3BvbnNlICovXHJcbiAgICBwdWJsaWMgcGFnZU51bWJlciA9IDE7XHJcbiAgICBcclxuICAgIC8qKiBwYWdlIHNpemUgKi9cclxuICAgIHB1YmxpYyBwYWdlU2l6ZTogbnVtYmVyO1xyXG5cclxuICAgIC8qKiBhcnJheSBjb21wb25lbnRzICovXHJcbiAgICBwdWJsaWMgcmVzdWx0OiBUW10gPSBbXTtcclxuXHJcbiAgICAvKiogcHVzaCBhIG5ldyByZXNvdXJjZSB0byB0aGUgYXJyYXkgKi9cclxuICAgIHB1c2ggPSAoZWw6IFQpID0+IHtcclxuICAgICAgICB0aGlzLnJlc3VsdC5wdXNoKGVsKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqIGxlbmd0aCBvZiB0aGUgYXJyYXkgKi9cclxuICAgIGxlbmd0aCA9ICgpOiBudW1iZXIgPT4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJlc3VsdC5sZW5ndGg7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKiBsb2FkIGFycmF5IGRhdGEgZnJvbSBSRVNUIHJlcXVlc3QgKi9cclxuICAgIHByaXZhdGUgaW5pdCA9ICh0eXBlOiB7IG5ldygpOiBUIH0sIHJlc3BvbnNlOiBhbnksIHNvcnRJbmZvOiBTb3J0W10pOiBSZXNvdXJjZUFycmF5PFQ+ID0+IHtcclxuICAgICAgICBjb25zdCByZXN1bHQ6IFJlc291cmNlQXJyYXk8VD4gPSBSZXNvdXJjZUhlbHBlci5jcmVhdGVFbXB0eVJlc3VsdDxUPih0aGlzLl9lbWJlZGRlZCk7XHJcbiAgICAgICAgcmVzdWx0LnNvcnRJbmZvID0gc29ydEluZm87XHJcbiAgICAgICAgUmVzb3VyY2VIZWxwZXIuaW5zdGFudGlhdGVSZXNvdXJjZUNvbGxlY3Rpb24odHlwZSwgcmVzcG9uc2UsIHJlc3VsdCk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH07XHJcblxyXG4gICAgLyoqIExvYWQgbmV4dCBwYWdlICovXHJcbiAgICBuZXh0ID0gKHR5cGU6IHsgbmV3KCk6IFQgfSk6IE9ic2VydmFibGU8UmVzb3VyY2VBcnJheTxUPj4gPT4ge1xyXG4gICAgICAgIGlmICh0aGlzLm5leHRfdXJpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkuZ2V0KFJlc291cmNlSGVscGVyLmdldFByb3h5KHRoaXMubmV4dF91cmkpLCB7aGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVyc30pLnBpcGUoXHJcbiAgICAgICAgICAgICAgICBtYXAocmVzcG9uc2UgPT4gdGhpcy5pbml0KHR5cGUsIHJlc3BvbnNlLCB0aGlzLnNvcnRJbmZvKSksXHJcbiAgICAgICAgICAgICAgICBjYXRjaEVycm9yKGVycm9yID0+IG9ic2VydmFibGVUaHJvd0Vycm9yKGVycm9yKSksKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG9ic2VydmFibGVUaHJvd0Vycm9yKCdubyBuZXh0IGRlZmluZWQnKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqIExvYWQgcHJldmlvdXMgcGFnZSAqL1xyXG4gICAgcHJldiA9ICh0eXBlOiB7IG5ldygpOiBUIH0pOiBPYnNlcnZhYmxlPFJlc291cmNlQXJyYXk8VD4+ID0+IHtcclxuICAgICAgICBpZiAodGhpcy5wcmV2X3VyaSkge1xyXG4gICAgICAgICAgICByZXR1cm4gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLmdldChSZXNvdXJjZUhlbHBlci5nZXRQcm94eSh0aGlzLnByZXZfdXJpKSwge2hlYWRlcnM6IFJlc291cmNlSGVscGVyLmhlYWRlcnN9KS5waXBlKFxyXG4gICAgICAgICAgICAgICAgbWFwKHJlc3BvbnNlID0+IHRoaXMuaW5pdCh0eXBlLCByZXNwb25zZSwgdGhpcy5zb3J0SW5mbykpLFxyXG4gICAgICAgICAgICAgICAgY2F0Y2hFcnJvcihlcnJvciA9PiBvYnNlcnZhYmxlVGhyb3dFcnJvcihlcnJvcikpLCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBvYnNlcnZhYmxlVGhyb3dFcnJvcignbm8gcHJldiBkZWZpbmVkJyk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKiBMb2FkIGZpcnN0IHBhZ2UgKi9cclxuICAgIGZpcnN0ID0gKHR5cGU6IHsgbmV3KCk6IFQgfSk6IE9ic2VydmFibGU8UmVzb3VyY2VBcnJheTxUPj4gPT4ge1xyXG4gICAgICAgIGlmICh0aGlzLmZpcnN0X3VyaSkge1xyXG4gICAgICAgICAgICByZXR1cm4gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLmdldChSZXNvdXJjZUhlbHBlci5nZXRQcm94eSh0aGlzLmZpcnN0X3VyaSksIHtoZWFkZXJzOiBSZXNvdXJjZUhlbHBlci5oZWFkZXJzfSkucGlwZShcclxuICAgICAgICAgICAgICAgIG1hcChyZXNwb25zZSA9PiB0aGlzLmluaXQodHlwZSwgcmVzcG9uc2UsIHRoaXMuc29ydEluZm8pKSxcclxuICAgICAgICAgICAgICAgIGNhdGNoRXJyb3IoZXJyb3IgPT4gb2JzZXJ2YWJsZVRocm93RXJyb3IoZXJyb3IpKSwpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZVRocm93RXJyb3IoJ25vIGZpcnN0IGRlZmluZWQnKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqIExvYWQgbGFzdCBwYWdlICovXHJcbiAgICBsYXN0ID0gKHR5cGU6IHsgbmV3KCk6IFQgfSk6IE9ic2VydmFibGU8UmVzb3VyY2VBcnJheTxUPj4gPT4ge1xyXG4gICAgICAgIGlmICh0aGlzLmxhc3RfdXJpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkuZ2V0KFJlc291cmNlSGVscGVyLmdldFByb3h5KHRoaXMubGFzdF91cmkpLCB7aGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVyc30pLnBpcGUoXHJcbiAgICAgICAgICAgICAgICBtYXAocmVzcG9uc2UgPT4gdGhpcy5pbml0KHR5cGUsIHJlc3BvbnNlLCB0aGlzLnNvcnRJbmZvKSksXHJcbiAgICAgICAgICAgICAgICBjYXRjaEVycm9yKGVycm9yID0+IG9ic2VydmFibGVUaHJvd0Vycm9yKGVycm9yKSksKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG9ic2VydmFibGVUaHJvd0Vycm9yKCdubyBsYXN0IGRlZmluZWQnKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqIExvYWQgcGFnZSB3aXRoIGdpdmVuIHBhZ2VOdW1iZXIqL1xyXG4gICAgcGFnZSA9ICh0eXBlOiB7IG5ldygpOiBUIH0sIHBhZ2VOdW1iZXI6IG51bWJlcik6IE9ic2VydmFibGU8UmVzb3VyY2VBcnJheTxUPj4gPT4ge1xyXG4gICAgICAgIHRoaXMuc2VsZl91cmkgPSB0aGlzLnNlbGZfdXJpLnJlcGxhY2UoJ3s/cGFnZSxzaXplLHNvcnR9JywgJycpO1xyXG4gICAgICAgIHRoaXMuc2VsZl91cmkgPSB0aGlzLnNlbGZfdXJpLnJlcGxhY2UoJ3smc29ydH0nLCAnJyk7XHJcbiAgICAgICAgbGV0IHVybFBhcnNlZCA9IHVybC5wYXJzZShSZXNvdXJjZUhlbHBlci5nZXRQcm94eSh0aGlzLnNlbGZfdXJpKSk7XHJcbiAgICAgICAgbGV0IHF1ZXJ5OiBzdHJpbmcgPSBSZXNvdXJjZUFycmF5LnJlcGxhY2VPckFkZCh1cmxQYXJzZWQucXVlcnksICdzaXplJywgdGhpcy5wYWdlU2l6ZS50b1N0cmluZygpKTtcclxuICAgICAgICBxdWVyeSA9IFJlc291cmNlQXJyYXkucmVwbGFjZU9yQWRkKHF1ZXJ5LCAncGFnZScsIHBhZ2VOdW1iZXIudG9TdHJpbmcoKSk7XHJcblxyXG5cclxuICAgICAgICBsZXQgdXJpID0gdXJsUGFyc2VkLnF1ZXJ5ID9cclxuICAgICAgICAgICAgUmVzb3VyY2VIZWxwZXIuZ2V0UHJveHkodGhpcy5zZWxmX3VyaSkucmVwbGFjZSh1cmxQYXJzZWQucXVlcnksIHF1ZXJ5KSA6IFJlc291cmNlSGVscGVyLmdldFByb3h5KHRoaXMuc2VsZl91cmkpLmNvbmNhdChxdWVyeSk7XHJcbiAgICAgICAgdXJpID0gdGhpcy5hZGRTb3J0SW5mbyh1cmkpO1xyXG4gICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkuZ2V0KHVyaSwge2hlYWRlcnM6IFJlc291cmNlSGVscGVyLmhlYWRlcnN9KS5waXBlKFxyXG4gICAgICAgICAgICBtYXAocmVzcG9uc2UgPT4gdGhpcy5pbml0KHR5cGUsIHJlc3BvbnNlLCB0aGlzLnNvcnRJbmZvKSksXHJcbiAgICAgICAgICAgIGNhdGNoRXJyb3IoZXJyb3IgPT4gb2JzZXJ2YWJsZVRocm93RXJyb3IoZXJyb3IpKSwpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKiogU29ydCBjb2xsZWN0aW9uIGJhc2VkIG9uIGdpdmVuIHNvcnQgYXR0cmlidXRlICovXHJcbiAgICBzb3J0RWxlbWVudHMgPSAodHlwZTogeyBuZXcoKTogVCB9LCAuLi5zb3J0OiBTb3J0W10pOiBPYnNlcnZhYmxlPFJlc291cmNlQXJyYXk8VD4+ID0+IHtcclxuICAgICAgICB0aGlzLnNlbGZfdXJpID0gdGhpcy5zZWxmX3VyaS5yZXBsYWNlKCd7P3BhZ2Usc2l6ZSxzb3J0fScsICcnKTtcclxuICAgICAgICB0aGlzLnNlbGZfdXJpID0gdGhpcy5zZWxmX3VyaS5yZXBsYWNlKCd7JnNvcnR9JywgJycpO1xyXG4gICAgICAgIGxldCB1cmkgPSBSZXNvdXJjZUhlbHBlci5nZXRQcm94eSh0aGlzLnNlbGZfdXJpKS5jb25jYXQoJz8nLCAnc2l6ZT0nLCB0aGlzLnBhZ2VTaXplLnRvU3RyaW5nKCksICcmcGFnZT0nLCB0aGlzLnBhZ2VOdW1iZXIudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgdXJpID0gdGhpcy5hZGRTb3J0SW5mbyh1cmkpO1xyXG4gICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkuZ2V0KHVyaSwge2hlYWRlcnM6IFJlc291cmNlSGVscGVyLmhlYWRlcnN9KS5waXBlKFxyXG4gICAgICAgICAgICBtYXAocmVzcG9uc2UgPT4gdGhpcy5pbml0KHR5cGUsIHJlc3BvbnNlLCBzb3J0KSksXHJcbiAgICAgICAgICAgIGNhdGNoRXJyb3IoZXJyb3IgPT4gb2JzZXJ2YWJsZVRocm93RXJyb3IoZXJyb3IpKSwpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKiogTG9hZCBwYWdlIHdpdGggZ2l2ZW4gc2l6ZSAqL1xyXG4gICAgc2l6ZSA9ICh0eXBlOiB7IG5ldygpOiBUIH0sIHNpemU6IG51bWJlcik6IE9ic2VydmFibGU8UmVzb3VyY2VBcnJheTxUPj4gPT4ge1xyXG4gICAgICAgIGxldCB1cmkgPSBSZXNvdXJjZUhlbHBlci5nZXRQcm94eSh0aGlzLnNlbGZfdXJpKS5jb25jYXQoJz8nLCAnc2l6ZT0nLCBzaXplLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgIHVyaSA9IHRoaXMuYWRkU29ydEluZm8odXJpKTtcclxuICAgICAgICByZXR1cm4gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLmdldCh1cmksIHtoZWFkZXJzOiBSZXNvdXJjZUhlbHBlci5oZWFkZXJzfSkucGlwZShcclxuICAgICAgICAgICAgbWFwKHJlc3BvbnNlID0+IHRoaXMuaW5pdCh0eXBlLCByZXNwb25zZSwgdGhpcy5zb3J0SW5mbykpLFxyXG4gICAgICAgICAgICBjYXRjaEVycm9yKGVycm9yID0+IG9ic2VydmFibGVUaHJvd0Vycm9yKGVycm9yKSksKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqIEFkZCBzb3J0IGluZm8gdG8gZ2l2ZW4gVVJJICovXHJcbiAgICBwcml2YXRlIGFkZFNvcnRJbmZvKHVyaTogc3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuc29ydEluZm8pIHtcclxuICAgICAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIHRoaXMuc29ydEluZm8pIHtcclxuICAgICAgICAgICAgICAgIHVyaSA9IHVyaS5jb25jYXQoJyZzb3J0PScsIGl0ZW0ucGF0aCwgJywnLCBpdGVtLm9yZGVyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdXJpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBBZGQgcmVwbGFjZSBvciBhZGQgcGFyYW0gdmFsdWUgdG8gcXVlcnkgc3RyaW5nICovXHJcbiAgICBwcml2YXRlIHN0YXRpYyByZXBsYWNlT3JBZGQocXVlcnk6IHN0cmluZywgZmllbGQ6IHN0cmluZywgdmFsdWU6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgaWYgKHF1ZXJ5KSB7XHJcbiAgICAgICAgICAgIGxldCBpZHg6IG51bWJlciA9IHF1ZXJ5LmluZGV4T2YoZmllbGQpO1xyXG4gICAgICAgICAgICBsZXQgaWR4TmV4dEFtcDogbnVtYmVyID0gcXVlcnkuaW5kZXhPZignJicsIGlkeCkgPT0gLTEgPyBxdWVyeS5pbmRleE9mKCcvJywgaWR4KSA6IHF1ZXJ5LmluZGV4T2YoJyYnLCBpZHgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGlkeCAhPSAtMSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHNlYWNoVmFsdWUgPSBxdWVyeS5zdWJzdHJpbmcoaWR4LCBpZHhOZXh0QW1wKTtcclxuICAgICAgICAgICAgICAgIHF1ZXJ5ID0gcXVlcnkucmVwbGFjZShzZWFjaFZhbHVlLCBmaWVsZCArICc9JyArIHZhbHVlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHF1ZXJ5ID0gcXVlcnkuY29uY2F0KFwiJlwiICsgZmllbGQgKyAnPScgKyB2YWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBxdWVyeSA9IFwiP1wiICsgZmllbGQgKyAnPScgKyB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHF1ZXJ5O1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7SHR0cENsaWVudCwgSHR0cEhlYWRlcnMsIEh0dHBQYXJhbXN9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi9yZXNvdXJjZSc7XHJcbmltcG9ydCB7UmVzb3VyY2VBcnJheX0gZnJvbSAnLi9yZXNvdXJjZS1hcnJheSc7XHJcbmltcG9ydCB7SGFsT3B0aW9uc30gZnJvbSAnLi9yZXN0LnNlcnZpY2UnO1xyXG5pbXBvcnQge1N1YlR5cGVCdWlsZGVyfSBmcm9tICcuL3N1YnR5cGUtYnVpbGRlcic7XHJcbmltcG9ydCB7aXNOdWxsT3JVbmRlZmluZWQsIGlzUHJpbWl0aXZlfSBmcm9tICd1dGlsJztcclxuaW1wb3J0ICogYXMgdXJsIGZyb20gJ3VybCc7XHJcblxyXG4vKiogUkVTVCBBUEkgYWNjZXNzIGhlbHBlciAqL1xyXG5leHBvcnQgY2xhc3MgUmVzb3VyY2VIZWxwZXIge1xyXG5cclxuICAgIC8qKiBIdHRwSGVhZGVycyAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBoZWFkZXJzOiBIdHRwSGVhZGVycyA9IG5ldyBIdHRwSGVhZGVycygpO1xyXG4gICAgLyoqIFByb3h5IFVSTCAqL1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgcHJveHlfdXJpOiBzdHJpbmcgPSBudWxsO1xyXG4gICAgLyoqIFJvb3QgVVJMICovXHJcbiAgICBwcml2YXRlIHN0YXRpYyByb290X3VyaTogc3RyaW5nID0gbnVsbDtcclxuICAgIC8qKiBIdHRwQ2xpZW50ICovXHJcbiAgICBwcml2YXRlIHN0YXRpYyBodHRwOiBIdHRwQ2xpZW50ID0gbnVsbDtcclxuXHJcbiAgICAvKiogZ2V0IHJlcXVlc3QgaGVhZGVycyAqL1xyXG4gICAgLypwdWJsaWMgc3RhdGljIGdldCBoZWFkZXJzKCk6IEh0dHBIZWFkZXJzIHtcclxuICAgICAgICBpZiAoaXNOdWxsT3JVbmRlZmluZWQodGhpcy5faGVhZGVycykpXHJcbiAgICAgICAgICBSZXNvdXJjZUhlbHBlci5faGVhZGVycyA9IG5ldyBIdHRwSGVhZGVycygpO1xyXG4gICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5faGVhZGVycztcclxuICAgIH0qL1xyXG5cclxuICAgIC8qKiBzZXQgcmVxdWVzdCBoZWFkZXJzICovXHJcbiAgICAvKnB1YmxpYyBzdGF0aWMgc2V0IGhlYWRlcnMoaGVhZGVyczogSHR0cEhlYWRlcnMpIHtcclxuICAgICAgUmVzb3VyY2VIZWxwZXIuX2hlYWRlcnMgPSBoZWFkZXJzO1xyXG4gICAgfSovXHJcblxyXG4gICAgLyoqIGdldCByZXF1ZXN0IG9wdGlvbiBwYXJhbXMgKi9cclxuICAgIHN0YXRpYyBvcHRpb25QYXJhbXMocGFyYW1zOiBIdHRwUGFyYW1zLCBvcHRpb25zPzogSGFsT3B0aW9ucyk6IEh0dHBQYXJhbXMge1xyXG4gICAgICAgIGlmIChvcHRpb25zKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5wYXJhbXMpIHtcclxuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgcGFyYW0gb2Ygb3B0aW9ucy5wYXJhbXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBwYXJhbXMgPSBwYXJhbXMuYXBwZW5kKHBhcmFtLmtleSwgcGFyYW0udmFsdWUudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChvcHRpb25zLnNpemUpIHtcclxuICAgICAgICAgICAgICAgIHBhcmFtcyA9IHBhcmFtcy5hcHBlbmQoJ3NpemUnLCBvcHRpb25zLnNpemUudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChvcHRpb25zLnNvcnQpIHtcclxuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgcyBvZiBvcHRpb25zLnNvcnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgc29ydFN0cmluZyA9ICcnO1xyXG4gICAgICAgICAgICAgICAgICAgIHNvcnRTdHJpbmcgPSBzLnBhdGggPyBzb3J0U3RyaW5nLmNvbmNhdChzLnBhdGgpIDogc29ydFN0cmluZztcclxuICAgICAgICAgICAgICAgICAgICBzb3J0U3RyaW5nID0gcy5vcmRlciA/IHNvcnRTdHJpbmcuY29uY2F0KCcsJykuY29uY2F0KHMub3JkZXIpIDogc29ydFN0cmluZztcclxuICAgICAgICAgICAgICAgICAgICBwYXJhbXMgPSBwYXJhbXMuYXBwZW5kKCdzb3J0Jywgc29ydFN0cmluZyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBwYXJhbXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHJlc29sdmUgcmVzb3VyY2UgcmVsYXRpb25zICovXHJcbiAgICBzdGF0aWMgcmVzb2x2ZVJlbGF0aW9ucyhyZXNvdXJjZTogUmVzb3VyY2UpOiBPYmplY3Qge1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdDogYW55ID0ge307XHJcbiAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gcmVzb3VyY2UpIHtcclxuICAgICAgICAgICAgaWYgKCFpc051bGxPclVuZGVmaW5lZChyZXNvdXJjZVtrZXldKSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKFJlc291cmNlSGVscGVyLmNsYXNzTmFtZShyZXNvdXJjZVtrZXldKVxyXG4gICAgICAgICAgICAgICAgICAgIC5maW5kKChjbGFzc05hbWU6IHN0cmluZykgPT4gY2xhc3NOYW1lID09ICdSZXNvdXJjZScpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc291cmNlW2tleV1bJ19saW5rcyddKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRba2V5XSA9IHJlc291cmNlW2tleV1bJ19saW5rcyddWydzZWxmJ11bJ2hyZWYnXTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShyZXNvdXJjZVtrZXldKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBhcnJheTogYW55W10gPSByZXNvdXJjZVtrZXldO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhcnJheSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRba2V5XSA9IG5ldyBBcnJheSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhcnJheS5mb3JFYWNoKChlbGVtZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNQcmltaXRpdmUoZWxlbWVudCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRba2V5XS5wdXNoKGVsZW1lbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0W2tleV0ucHVzaCh0aGlzLnJlc29sdmVSZWxhdGlvbnMoZWxlbWVudCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdFtrZXldID0gcmVzb3VyY2Vba2V5XTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0IGFzIE9iamVjdDtcclxuICAgIH1cclxuXHJcbiAgICAvKiogY3JlYXRlIGFuIGVtcHR5IHJlc291cmNlIGZyb20gZW1iZWRkZWQgZGF0YSovXHJcbiAgICBzdGF0aWMgY3JlYXRlRW1wdHlSZXN1bHQ8VCBleHRlbmRzIFJlc291cmNlPihfZW1iZWRkZWQ6IHN0cmluZyk6IFJlc291cmNlQXJyYXk8VD4ge1xyXG4gICAgICAgIGxldCByZXNvdXJjZUFycmF5OiBSZXNvdXJjZUFycmF5PFQ+ID0gbmV3IFJlc291cmNlQXJyYXk8VD4oKTtcclxuICAgICAgICByZXNvdXJjZUFycmF5Ll9lbWJlZGRlZCA9IF9lbWJlZGRlZDtcclxuICAgICAgICByZXR1cm4gcmVzb3VyY2VBcnJheTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHJlc291cmNlIGNsYXNzIG5hbWUqL1xyXG4gICAgc3RhdGljIGdldENsYXNzTmFtZShvYmo6IGFueSk6IHN0cmluZyB7XHJcbiAgICAgICAgdmFyIGZ1bmNOYW1lUmVnZXggPSAvZnVuY3Rpb24gKC4rPylcXCgvO1xyXG4gICAgICAgIHZhciByZXN1bHRzID0gKGZ1bmNOYW1lUmVnZXgpLmV4ZWMob2JqLmNvbnN0cnVjdG9yLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgIHJldHVybiAocmVzdWx0cyAmJiByZXN1bHRzLmxlbmd0aCA+IDEpID8gcmVzdWx0c1sxXSA6ICcnO1xyXG4gICAgfVxyXG5cclxuICAgIFxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBjbGFzcyBuYW1lIGZyb20gYSBwcm90b3R5cGUgb2JqZWN0Ki9cclxuICAgIHN0YXRpYyBjbGFzc05hbWUob2JqUHJvdG86IGFueSk6IHN0cmluZ1tdIHtcclxuICAgICAgICBsZXQgY2xhc3NOYW1lcyA9IFtdO1xyXG4gICAgICAgIGxldCBvYmogPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqUHJvdG8pO1xyXG4gICAgICAgIGxldCBjbGFzc05hbWU6IHN0cmluZztcclxuXHJcbiAgICAgICAgd2hpbGUgKChjbGFzc05hbWUgPSBSZXNvdXJjZUhlbHBlci5nZXRDbGFzc05hbWUob2JqKSkgIT09ICdPYmplY3QnKSB7XHJcbiAgICAgICAgICAgIGNsYXNzTmFtZXMucHVzaChjbGFzc05hbWUpO1xyXG4gICAgICAgICAgICBvYmogPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBjbGFzc05hbWVzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBpbnN0YW50aWF0ZSBhIFJlc291cmNlQ29sbGVjdGlvbiBmcm9tIHJlc3BvbnNlIGVtYmVkZGVkIGRhdGEqL1xyXG4gICAgc3RhdGljIGluc3RhbnRpYXRlUmVzb3VyY2VDb2xsZWN0aW9uPFQgZXh0ZW5kcyBSZXNvdXJjZT4odHlwZTogeyBuZXcoKTogVCB9LCBwYXlsb2FkOiBhbnksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQ6IFJlc291cmNlQXJyYXk8VD4sIGJ1aWxkZXI/OiBTdWJUeXBlQnVpbGRlcixlbWJlZGRlZE5hbWU/OlN0cmluZyk6IFJlc291cmNlQXJyYXk8VD4ge1xyXG4gICAgICAgIGZvciAoY29uc3QgZW1iZWRkZWRDbGFzc05hbWUgb2YgT2JqZWN0LmtleXMocGF5bG9hZFtyZXN1bHQuX2VtYmVkZGVkXSkpIHtcclxuICAgICAgICAgICAgaWYoIWVtYmVkZGVkTmFtZSB8fCAoZW1iZWRkZWROYW1lICYmIGVtYmVkZGVkQ2xhc3NOYW1lPT1lbWJlZGRlZE5hbWUpKXtcclxuICAgICAgICAgICAgICAgIGxldCBlbWJlZGRlZDogYW55ID0gcGF5bG9hZFtyZXN1bHQuX2VtYmVkZGVkXTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW1zID0gZW1iZWRkZWRbZW1iZWRkZWRDbGFzc05hbWVdO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaXRlbSBvZiBpdGVtcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBpbnN0YW5jZTogVCA9IG5ldyB0eXBlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5zdGFuY2UgPSB0aGlzLnNlYXJjaFN1YnR5cGVzKGJ1aWxkZXIsIGVtYmVkZGVkQ2xhc3NOYW1lLCBpbnN0YW5jZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5zdGFudGlhdGVSZXNvdXJjZShpbnN0YW5jZSwgaXRlbSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goaW5zdGFuY2UpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXN1bHQudG90YWxFbGVtZW50cyA9IHBheWxvYWQucGFnZSA/IHBheWxvYWQucGFnZS50b3RhbEVsZW1lbnRzIDogcmVzdWx0Lmxlbmd0aDtcclxuICAgICAgICByZXN1bHQudG90YWxQYWdlcyA9IHBheWxvYWQucGFnZSA/IHBheWxvYWQucGFnZS50b3RhbFBhZ2VzIDogMTtcclxuICAgICAgICByZXN1bHQucGFnZU51bWJlciA9IHBheWxvYWQucGFnZSA/IHBheWxvYWQucGFnZS5udW1iZXIgOiAxO1xyXG4gICAgICAgIHJlc3VsdC5wYWdlU2l6ZSA9IHBheWxvYWQucGFnZSA/IHBheWxvYWQucGFnZS5zaXplIDogMjA7XHJcblxyXG4gICAgICAgIHJlc3VsdC5zZWxmX3VyaSA9IHBheWxvYWQuX2xpbmtzICYmIHBheWxvYWQuX2xpbmtzLnNlbGYgPyBwYXlsb2FkLl9saW5rcy5zZWxmLmhyZWYgOiB1bmRlZmluZWQ7XHJcbiAgICAgICAgcmVzdWx0Lm5leHRfdXJpID0gcGF5bG9hZC5fbGlua3MgJiYgcGF5bG9hZC5fbGlua3MubmV4dCA/IHBheWxvYWQuX2xpbmtzLm5leHQuaHJlZiA6IHVuZGVmaW5lZDtcclxuICAgICAgICByZXN1bHQucHJldl91cmkgPSBwYXlsb2FkLl9saW5rcyAmJiBwYXlsb2FkLl9saW5rcy5wcmV2ID8gcGF5bG9hZC5fbGlua3MucHJldi5ocmVmIDogdW5kZWZpbmVkO1xyXG4gICAgICAgIHJlc3VsdC5maXJzdF91cmkgPSBwYXlsb2FkLl9saW5rcyAmJiBwYXlsb2FkLl9saW5rcy5maXJzdCA/IHBheWxvYWQuX2xpbmtzLmZpcnN0LmhyZWYgOiB1bmRlZmluZWQ7XHJcbiAgICAgICAgcmVzdWx0Lmxhc3RfdXJpID0gcGF5bG9hZC5fbGlua3MgJiYgcGF5bG9hZC5fbGlua3MubGFzdCA/IHBheWxvYWQuX2xpbmtzLmxhc3QuaHJlZiA6IHVuZGVmaW5lZDtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBzZWFyY2ggc3VidHlwZXMqL1xyXG4gICAgc3RhdGljIHNlYXJjaFN1YnR5cGVzPFQgZXh0ZW5kcyBSZXNvdXJjZT4oYnVpbGRlcjogU3ViVHlwZUJ1aWxkZXIsIGVtYmVkZGVkQ2xhc3NOYW1lOiBzdHJpbmcsIGluc3RhbmNlOiBUKSB7XHJcbiAgICAgICAgaWYgKGJ1aWxkZXIgJiYgYnVpbGRlci5zdWJ0eXBlcykge1xyXG4gICAgICAgICAgICBsZXQga2V5cyA9IGJ1aWxkZXIuc3VidHlwZXMua2V5cygpO1xyXG4gICAgICAgICAgICBBcnJheS5mcm9tKGtleXMpLmZvckVhY2goKHN1YnR5cGVLZXk6IHN0cmluZykgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGVtYmVkZGVkQ2xhc3NOYW1lLnRvTG93ZXJDYXNlKCkuc3RhcnRzV2l0aChzdWJ0eXBlS2V5LnRvTG93ZXJDYXNlKCkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHN1YnR5cGU6IHsgbmV3KCk6IGFueSB9ID0gYnVpbGRlci5zdWJ0eXBlcy5nZXQoc3VidHlwZUtleSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5zdGFuY2UgPSBuZXcgc3VidHlwZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBpbnN0YW50aWF0ZSBhIFJlc291cmNlIGZyb20gcmVzcG9uc2UgKi9cclxuICAgIHN0YXRpYyBpbnN0YW50aWF0ZVJlc291cmNlPFQgZXh0ZW5kcyBSZXNvdXJjZT4oZW50aXR5OiBULCBwYXlsb2FkOiBPYmplY3QpOiBUIHtcclxuICAgICAgICBmb3IgKGNvbnN0IHAgaW4gcGF5bG9hZCkge1xyXG4gICAgICAgICAgICAvL1RPRE8gYXJyYXkgaW5pdFxyXG4gICAgICAgICAgICAvKiBpZihlbnRpdHlbcF0uY29uc3RydWN0b3IgPT09IEFycmF5ICYmIGlzTnVsbE9yVW5kZWZpbmVkKHBheWxvYWRbcF0pKVxyXG4gICAgICAgICAgICAgICAgIGVudGl0eVtwXSA9IFtdO1xyXG4gICAgICAgICAgICAgZWxzZSovXHJcbiAgICAgICAgICAgIGVudGl0eVtwXSA9IHBheWxvYWRbcF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBlbnRpdHk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHNldCBwcm94eSBVUkwgKi9cclxuICAgIHN0YXRpYyBzZXRQcm94eVVyaShwcm94eV91cmk6IHN0cmluZykge1xyXG4gICAgICAgIFJlc291cmNlSGVscGVyLnByb3h5X3VyaSA9IHByb3h5X3VyaTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogc2V0IFJvb3QgVVJJICovXHJcbiAgICBzdGF0aWMgc2V0Um9vdFVyaShyb290X3VyaTogc3RyaW5nKSB7XHJcbiAgICAgICAgUmVzb3VyY2VIZWxwZXIucm9vdF91cmkgPSByb290X3VyaTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHByb3h5IFVSTCAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBnZXRVUkwoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gUmVzb3VyY2VIZWxwZXIucHJveHlfdXJpICYmIFJlc291cmNlSGVscGVyLnByb3h5X3VyaSAhPSAnJyA/XHJcbiAgICAgICAgICAgIFJlc291cmNlSGVscGVyLmFkZFNsYXNoKFJlc291cmNlSGVscGVyLnByb3h5X3VyaSkgOlxyXG4gICAgICAgICAgICBSZXNvdXJjZUhlbHBlci5hZGRTbGFzaChSZXNvdXJjZUhlbHBlci5yb290X3VyaSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGFkZCBzbGFzaCB0byBVUkkgKi9cclxuICAgIHByaXZhdGUgc3RhdGljIGFkZFNsYXNoKHVyaTogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICBsZXQgdXJpUGFyc2VkID0gdXJsLnBhcnNlKHVyaSk7XHJcbiAgICAgICAgaWYgKGlzTnVsbE9yVW5kZWZpbmVkKHVyaVBhcnNlZC5zZWFyY2gpICYmIHVyaSAmJiB1cmlbdXJpLmxlbmd0aCAtIDFdICE9ICcvJylcclxuICAgICAgICAgICAgcmV0dXJuIHVyaSArICcvJztcclxuICAgICAgICByZXR1cm4gdXJpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgcHJveHkgZnJvbSBVUkwgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0UHJveHkodXJsOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgIGlmICghUmVzb3VyY2VIZWxwZXIucHJveHlfdXJpIHx8IFJlc291cmNlSGVscGVyLnByb3h5X3VyaSA9PSAnJylcclxuICAgICAgICAgICAgcmV0dXJuIHVybDtcclxuICAgICAgICByZXR1cm4gUmVzb3VyY2VIZWxwZXIuYWRkU2xhc2godXJsLnJlcGxhY2UoUmVzb3VyY2VIZWxwZXIucm9vdF91cmksIFJlc291cmNlSGVscGVyLnByb3h5X3VyaSkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBzZXQgSHR0cENsaWVudCovXHJcbiAgICBwdWJsaWMgc3RhdGljIHNldEh0dHAoaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgICAgIFJlc291cmNlSGVscGVyLmh0dHAgPSBodHRwO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgSHR0cENsaWVudCovXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldEh0dHAoKTogSHR0cENsaWVudCB7XHJcbiAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLmh0dHA7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCByb290IFVSSSovXHJcbiAgICBzdGF0aWMgZ2V0Um9vdFVyaSgpIHtcclxuICAgICAgICByZXR1cm4gUmVzb3VyY2VIZWxwZXIucm9vdF91cmk7XHJcbiAgICB9XHJcbn1cclxuIiwiXHJcbmltcG9ydCB7dGhyb3dFcnJvciBhcyBvYnNlcnZhYmxlVGhyb3dFcnJvciwgb2YgYXMgb2JzZXJ2YWJsZU9mfSBmcm9tICdyeGpzJztcclxuXHJcbmltcG9ydCB7bWFwfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcblxyXG5cclxuaW1wb3J0IHtIdHRwUGFyYW1zfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7UmVzb3VyY2VIZWxwZXJ9IGZyb20gJy4vcmVzb3VyY2UtaGVscGVyJztcclxuaW1wb3J0IHtSZXNvdXJjZUFycmF5fSBmcm9tICcuL3Jlc291cmNlLWFycmF5JztcclxuaW1wb3J0IHtpc051bGxPclVuZGVmaW5lZH0gZnJvbSAndXRpbCc7XHJcblxyXG5pbXBvcnQge0hhbE9wdGlvbnN9IGZyb20gJy4vcmVzdC5zZXJ2aWNlJztcclxuaW1wb3J0IHtTdWJUeXBlQnVpbGRlcn0gZnJvbSAnLi9zdWJ0eXBlLWJ1aWxkZXInO1xyXG5pbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge09ic2VydmFibGV9IGZyb20gJ3J4anMnO1xyXG5cclxuLyoqIEFic3RyYWN0IHJlc291cmNlIGNsYXNzKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgUmVzb3VyY2Uge1xyXG5cclxuICAgIC8qKiBwcm94eSBVUkwgKi9cclxuICAgIHB1YmxpYyBwcm94eVVybDogc3RyaW5nO1xyXG4gICAgLyoqIHJvb3QgVVJMICovXHJcbiAgICBwdWJsaWMgcm9vdFVybDogc3RyaW5nO1xyXG5cclxuICAgIC8qKiBsaW5rcyAqL1xyXG4gICAgcHVibGljIF9saW5rczogYW55O1xyXG4gICAgLyoqIHN1YnR5cGVzICovXHJcbiAgICBwdWJsaWMgX3N1YnR5cGVzOiBNYXA8c3RyaW5nLCBhbnk+O1xyXG5cclxuICAgIFxyXG4gICAgLyoqIGdldCBzdWJ0eXBlcyAqLyAgICBcclxuICAgIHB1YmxpYyBnZXQgc3VidHlwZXMoKTogTWFwPHN0cmluZywgYW55PiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3N1YnR5cGVzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBzZXQgc3VidHlwZXMgKi9cclxuICAgIHB1YmxpYyBzZXQgc3VidHlwZXMoX3N1YnR5cGVzOiBNYXA8c3RyaW5nLCBhbnk+KSB7XHJcbiAgICAgICAgdGhpcy5fc3VidHlwZXMgPSBfc3VidHlwZXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGNvbnN0cnVjdG9yKi9cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBHZXQgY29sbGVjdGlvbiBvZiByZWxhdGVkIHJlc291cmNlcyAqL1xyXG4gICAgcHVibGljIGdldFJlbGF0aW9uQXJyYXk8VCBleHRlbmRzIFJlc291cmNlPih0eXBlOiB7IG5ldygpOiBUIH0sIHJlbGF0aW9uOiBzdHJpbmcsIF9lbWJlZGRlZD86IHN0cmluZywgb3B0aW9ucz86IEhhbE9wdGlvbnMsIGJ1aWxkZXI/OiBTdWJUeXBlQnVpbGRlcik6IE9ic2VydmFibGU8VFtdPiB7XHJcblxyXG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IFJlc291cmNlSGVscGVyLm9wdGlvblBhcmFtcyhuZXcgSHR0cFBhcmFtcygpLCBvcHRpb25zKTtcclxuICAgICAgICBjb25zdCByZXN1bHQ6IFJlc291cmNlQXJyYXk8VD4gPSBSZXNvdXJjZUhlbHBlci5jcmVhdGVFbXB0eVJlc3VsdDxUPihpc051bGxPclVuZGVmaW5lZChfZW1iZWRkZWQpID8gXCJfZW1iZWRkZWRcIiA6IF9lbWJlZGRlZCk7XHJcbiAgICAgICAgaWYgKCFpc051bGxPclVuZGVmaW5lZCh0aGlzLl9saW5rcykgJiYgIWlzTnVsbE9yVW5kZWZpbmVkKHRoaXMuX2xpbmtzW3JlbGF0aW9uXSkpIHtcclxuICAgICAgICAgICAgbGV0IG9ic2VydmFibGUgPSBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkuZ2V0KFJlc291cmNlSGVscGVyLmdldFByb3h5KHRoaXMuX2xpbmtzW3JlbGF0aW9uXS5ocmVmKSwge1xyXG4gICAgICAgICAgICAgICAgaGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVycyxcclxuICAgICAgICAgICAgICAgIHBhcmFtczogcGFyYW1zXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZS5waXBlKG1hcChyZXNwb25zZSA9PiBSZXNvdXJjZUhlbHBlci5pbnN0YW50aWF0ZVJlc291cmNlQ29sbGVjdGlvbjxUPih0eXBlLCByZXNwb25zZSwgcmVzdWx0LCBidWlsZGVyKSksXHJcbiAgICAgICAgICAgICAgICBtYXAoKGFycmF5OiBSZXNvdXJjZUFycmF5PFQ+KSA9PiBhcnJheS5yZXN1bHQpLCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIG9ic2VydmFibGVPZihbXSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKiBHZXQgcmVsYXRlZCByZXNvdXJjZSAqL1xyXG4gICAgcHVibGljIGdldFJlbGF0aW9uPFQgZXh0ZW5kcyBSZXNvdXJjZT4odHlwZTogeyBuZXcoKTogVCB9LCByZWxhdGlvbjogc3RyaW5nLCBidWlsZGVyPzogU3ViVHlwZUJ1aWxkZXIpOiBPYnNlcnZhYmxlPFQ+IHtcclxuICAgICAgICBsZXQgcmVzdWx0OiBUID0gbmV3IHR5cGUoKTtcclxuICAgICAgICBpZiAoIWlzTnVsbE9yVW5kZWZpbmVkKHRoaXMuX2xpbmtzKSAmJiAhaXNOdWxsT3JVbmRlZmluZWQodGhpcy5fbGlua3NbcmVsYXRpb25dKSkge1xyXG4gICAgICAgICAgICBsZXQgb2JzZXJ2YWJsZSA9IFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5nZXQoUmVzb3VyY2VIZWxwZXIuZ2V0UHJveHkodGhpcy5fbGlua3NbcmVsYXRpb25dLmhyZWYpLCB7aGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVyc30pO1xyXG4gICAgICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZS5waXBlKG1hcCgoZGF0YTogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYnVpbGRlcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgZW1iZWRkZWRDbGFzc05hbWUgb2YgT2JqZWN0LmtleXMoZGF0YVsnX2xpbmtzJ10pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlbWJlZGRlZENsYXNzTmFtZSA9PSAnc2VsZicpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBocmVmOiBzdHJpbmcgPSBkYXRhLl9saW5rc1tlbWJlZGRlZENsYXNzTmFtZV0uaHJlZjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBpZHg6IG51bWJlciA9IGhyZWYubGFzdEluZGV4T2YoJy8nKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZWFsQ2xhc3NOYW1lID0gaHJlZi5yZXBsYWNlKFJlc291cmNlSGVscGVyLmdldFJvb3RVcmkoKSwgXCJcIikuc3Vic3RyaW5nKDAsIGlkeCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBSZXNvdXJjZUhlbHBlci5zZWFyY2hTdWJ0eXBlcyhidWlsZGVyLCByZWFsQ2xhc3NOYW1lLCByZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gUmVzb3VyY2VIZWxwZXIuaW5zdGFudGlhdGVSZXNvdXJjZShyZXN1bHQsIGRhdGEpO1xyXG4gICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIG9ic2VydmFibGVPZihudWxsKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEFkZHMgdGhlIGdpdmVuIHJlc291cmNlIHRvIHRoZSBib3VuZCBjb2xsZWN0aW9uIGJ5IHRoZSByZWxhdGlvbiAqL1xyXG4gICAgcHVibGljIGFkZFJlbGF0aW9uPFQgZXh0ZW5kcyBSZXNvdXJjZT4ocmVsYXRpb246IHN0cmluZywgcmVzb3VyY2U6IFQpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgICAgIGlmICghaXNOdWxsT3JVbmRlZmluZWQodGhpcy5fbGlua3MpICYmICFpc051bGxPclVuZGVmaW5lZCh0aGlzLl9saW5rc1tyZWxhdGlvbl0pKSB7XHJcbiAgICAgICAgICAgIGxldCBoZWFkZXIgPSBSZXNvdXJjZUhlbHBlci5oZWFkZXJzLmFwcGVuZCgnQ29udGVudC1UeXBlJywgJ3RleHQvdXJpLWxpc3QnKTtcclxuICAgICAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5wb3N0KFJlc291cmNlSGVscGVyLmdldFByb3h5KHRoaXMuX2xpbmtzW3JlbGF0aW9uXS5ocmVmKSwgcmVzb3VyY2UuX2xpbmtzLnNlbGYuaHJlZiwge2hlYWRlcnM6IGhlYWRlcn0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBvYnNlcnZhYmxlVGhyb3dFcnJvcignbm8gcmVsYXRpb24gZm91bmQnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEJpbmQgdGhlIGdpdmVuIHJlc291cmNlIHRvIHRoaXMgcmVzb3VyY2UgYnkgdGhlIGdpdmVuIHJlbGF0aW9uKi9cclxuICAgIHB1YmxpYyB1cGRhdGVSZWxhdGlvbjxUIGV4dGVuZHMgUmVzb3VyY2U+KHJlbGF0aW9uOiBzdHJpbmcsIHJlc291cmNlOiBUKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgICAgICBpZiAoIWlzTnVsbE9yVW5kZWZpbmVkKHRoaXMuX2xpbmtzKSAmJiAhaXNOdWxsT3JVbmRlZmluZWQodGhpcy5fbGlua3NbcmVsYXRpb25dKSkge1xyXG4gICAgICAgICAgICBsZXQgaGVhZGVyID0gUmVzb3VyY2VIZWxwZXIuaGVhZGVycy5hcHBlbmQoJ0NvbnRlbnQtVHlwZScsICd0ZXh0L3VyaS1saXN0Jyk7XHJcbiAgICAgICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkucGF0Y2goUmVzb3VyY2VIZWxwZXIuZ2V0UHJveHkodGhpcy5fbGlua3NbcmVsYXRpb25dLmhyZWYpLCByZXNvdXJjZS5fbGlua3Muc2VsZi5ocmVmLCB7aGVhZGVyczogaGVhZGVyfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIG9ic2VydmFibGVUaHJvd0Vycm9yKCdubyByZWxhdGlvbiBmb3VuZCcpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKiogQmluZCB0aGUgZ2l2ZW4gcmVzb3VyY2UgdG8gdGhpcyByZXNvdXJjZSBieSB0aGUgZ2l2ZW4gcmVsYXRpb24qL1xyXG4gICAgcHVibGljIHN1YnN0aXR1dGVSZWxhdGlvbjxUIGV4dGVuZHMgUmVzb3VyY2U+KHJlbGF0aW9uOiBzdHJpbmcsIHJlc291cmNlOiBUKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgICAgICBpZiAoIWlzTnVsbE9yVW5kZWZpbmVkKHRoaXMuX2xpbmtzKSAmJiAhaXNOdWxsT3JVbmRlZmluZWQodGhpcy5fbGlua3NbcmVsYXRpb25dKSkge1xyXG4gICAgICAgICAgICBsZXQgaGVhZGVyID0gUmVzb3VyY2VIZWxwZXIuaGVhZGVycy5hcHBlbmQoJ0NvbnRlbnQtVHlwZScsICd0ZXh0L3VyaS1saXN0Jyk7XHJcbiAgICAgICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkucHV0KFJlc291cmNlSGVscGVyLmdldFByb3h5KHRoaXMuX2xpbmtzW3JlbGF0aW9uXS5ocmVmKSwgcmVzb3VyY2UuX2xpbmtzLnNlbGYuaHJlZiwge2hlYWRlcnM6IGhlYWRlcn0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBvYnNlcnZhYmxlVGhyb3dFcnJvcignbm8gcmVsYXRpb24gZm91bmQnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIFxyXG4gICAgLyoqIEJpbmQgdGhlIGdpdmVuIHJlc291cmNlIHRvIHRoaXMgcmVzb3VyY2UgYnkgdGhlIGdpdmVuIHJlbGF0aW9uKi9cclxuICAgIHB1YmxpYyBzdWJzdGl0dXRlQWxsUmVsYXRpb248VCBleHRlbmRzIFJlc291cmNlPihyZWxhdGlvbjogc3RyaW5nLCByZXNvdXJjZXM6IFJlc291cmNlW10pOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgICAgIGlmICghaXNOdWxsT3JVbmRlZmluZWQodGhpcy5fbGlua3MpICYmICFpc051bGxPclVuZGVmaW5lZCh0aGlzLl9saW5rc1tyZWxhdGlvbl0pKSB7XHJcbiAgICAgICAgICAgIGxldCBoZWFkZXIgPSBSZXNvdXJjZUhlbHBlci5oZWFkZXJzLmFwcGVuZCgnQ29udGVudC1UeXBlJywgJ3RleHQvdXJpLWxpc3QnKTtcclxuICAgICAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5wdXQoUmVzb3VyY2VIZWxwZXIuZ2V0UHJveHkodGhpcy5fbGlua3NbcmVsYXRpb25dLmhyZWYpLCByZXNvdXJjZXMubWFwKChyZXNvdXJjZSkgPT4gcmVzb3VyY2UuX2xpbmtzLnNlbGYuaHJlZiksIHtoZWFkZXJzOiBoZWFkZXJ9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZVRocm93RXJyb3IoJ25vIHJlbGF0aW9uIGZvdW5kJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgLyoqIFVuYmluZCB0aGUgcmVzb3VyY2Ugd2l0aCB0aGUgZ2l2ZW4gcmVsYXRpb24gZnJvbSB0aGlzIHJlc291cmNlKi9cclxuICAgIHB1YmxpYyBkZWxldGVSZWxhdGlvbjxUIGV4dGVuZHMgUmVzb3VyY2U+KHJlbGF0aW9uOiBzdHJpbmcsIHJlc291cmNlOiBUKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgICAgICBpZiAoIWlzTnVsbE9yVW5kZWZpbmVkKHRoaXMuX2xpbmtzKSAmJiAhaXNOdWxsT3JVbmRlZmluZWQocmVzb3VyY2UuX2xpbmtzKSkge1xyXG4gICAgICAgICAgICBsZXQgbGluazogc3RyaW5nID0gcmVzb3VyY2UuX2xpbmtzWydzZWxmJ10uaHJlZjtcclxuICAgICAgICAgICAgbGV0IGlkeDogbnVtYmVyID0gbGluay5sYXN0SW5kZXhPZignLycpICsgMTtcclxuXHJcbiAgICAgICAgICAgIGlmIChpZHggPT0gLTEpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZVRocm93RXJyb3IoJ25vIHJlbGF0aW9uIGZvdW5kJyk7XHJcblxyXG4gICAgICAgICAgICBsZXQgcmVsYXRpb25JZDogc3RyaW5nID0gbGluay5zdWJzdHJpbmcoaWR4KTtcclxuICAgICAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5kZWxldGUoUmVzb3VyY2VIZWxwZXIuZ2V0UHJveHkodGhpcy5fbGlua3NbcmVsYXRpb25dLmhyZWYgKyAnLycgKyByZWxhdGlvbklkKSwge2hlYWRlcnM6IFJlc291cmNlSGVscGVyLmhlYWRlcnN9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZVRocm93RXJyb3IoJ25vIHJlbGF0aW9uIGZvdW5kJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKiogVW5iaW5kIHRoZSByZXNvdXJjZSB3aXRoIHRoZSBnaXZlbiByZWxhdGlvbiBmcm9tIHRoaXMgcmVzb3VyY2UqL1xyXG4gICAgcHVibGljIGRlbGV0ZUFsbFJlbGF0aW9uPFQgZXh0ZW5kcyBSZXNvdXJjZT4ocmVsYXRpb246IHN0cmluZyk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5kZWxldGUoUmVzb3VyY2VIZWxwZXIuZ2V0UHJveHkodGhpcy5fbGlua3NbcmVsYXRpb25dLmhyZWYgKSwge2hlYWRlcnM6IFJlc291cmNlSGVscGVyLmhlYWRlcnN9KTtcclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbn0iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuaW1wb3J0IHsgVXNlckNvbmZpZ3VyYXRpb24gfSBmcm9tICcuL3VzZXItY29uZmlndXJhdGlvbi5tb2RlbCc7XHJcbmltcG9ydCB7IFVzZXJQb3NpdGlvbiB9IGZyb20gJy4vdXNlci1wb3NpdGlvbi5tb2RlbCc7XHJcblxyXG4vKipcclxuICogVXNlciBtb2RlbFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFVzZXIgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgLyoqIGlkICovXHJcbiAgcHVibGljIGlkOiBudW1iZXI7ICBcclxuICAvKiogdXNlcm5hbWUgKi9cclxuICBwdWJsaWMgdXNlcm5hbWU6IHN0cmluZztcclxuICAvKiogcGFzc3dvcmQgKi9cclxuICBwdWJsaWMgcGFzc3dvcmQ6IHN0cmluZztcclxuICAvKiogZmlyc3QgbmFtZSAqL1xyXG4gIHB1YmxpYyBmaXJzdE5hbWU6IHN0cmluZztcclxuICAvKiogbGFzdCBuYW1lICovXHJcbiAgcHVibGljIGxhc3ROYW1lOiBzdHJpbmc7XHJcbiAgLyoqIHdoZXRoZXIgdXNlciBpcyBibG9ja2VkICovXHJcbiAgcHVibGljIGJsb2NrZWQ6IGJvb2xlYW47XHJcbiAgLyoqIHdoZXRoZXIgdXNlciBpcyBhZG1pbmlzdHJhdG9yICovXHJcbiAgcHVibGljIGFkbWluaXN0cmF0b3I6IGJvb2xlYW47XHJcbiAgLyoqIElzIHBhc3N3b3JkU2V0ICovXHJcbiAgcHVibGljIHBhc3N3b3JkU2V0OiBib29sZWFuO1xyXG4gIC8qKiB1c2VyIHBvc2l0aW9ucyAqL1xyXG4gIHB1YmxpYyBwb3NpdGlvbnM6IFVzZXJQb3NpdGlvbltdO1xyXG4gIC8qKiB1c2VyIHBlcm1pc3Npb25zICovXHJcbiAgcHVibGljIHBlcm1pc3Npb25zOiBVc2VyQ29uZmlndXJhdGlvbltdO1xyXG59XHJcbiIsImltcG9ydCB7SHR0cENsaWVudH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQge0luamVjdCwgSW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7UmVzb3VyY2VIZWxwZXJ9IGZyb20gJy4vcmVzb3VyY2UtaGVscGVyJztcclxuaW1wb3J0IHtFeHRlcm5hbENvbmZpZ3VyYXRpb25IYW5kbGVySW50ZXJmYWNlfSBmcm9tICcuL2V4dGVybmFsLWNvbmZpZ3VyYXRpb24uaGFuZGxlcic7XHJcbmltcG9ydCB7RXh0ZXJuYWxDb25maWd1cmF0aW9ufSBmcm9tICcuL0V4dGVybmFsQ29uZmlndXJhdGlvbic7XHJcblxyXG5cclxuLyoqIEV4dGVybmFsU2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBFeHRlcm5hbFNlcnZpY2Uge1xyXG5cclxuICAgIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gICAgY29uc3RydWN0b3IoQEluamVjdCgnRXh0ZXJuYWxDb25maWd1cmF0aW9uU2VydmljZScpIHByaXZhdGUgZXh0ZXJuYWxDb25maWd1cmF0aW9uU2VydmljZTogRXh0ZXJuYWxDb25maWd1cmF0aW9uSGFuZGxlckludGVyZmFjZSkge1xyXG4gICAgICAgIFJlc291cmNlSGVscGVyLnNldFByb3h5VXJpKGV4dGVybmFsQ29uZmlndXJhdGlvblNlcnZpY2UuZ2V0UHJveHlVcmkoKSk7XHJcbiAgICAgICAgUmVzb3VyY2VIZWxwZXIuc2V0Um9vdFVyaShleHRlcm5hbENvbmZpZ3VyYXRpb25TZXJ2aWNlLmdldFJvb3RVcmkoKSk7XHJcbiAgICAgICAgUmVzb3VyY2VIZWxwZXIuc2V0SHR0cChleHRlcm5hbENvbmZpZ3VyYXRpb25TZXJ2aWNlLmdldEh0dHAoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHVwZGF0ZSBFeHRlcm5hbENvbmZpZ3VyYXRpb25IYW5kbGVyICovXHJcbiAgICBwdWJsaWMgdXBkYXRlRXh0ZXJuYWxDb25maWd1cmF0aW9uSGFuZGxlckludGVyZmFjZShleHRlcm5hbENvbmZpZ3VyYXRpb25TZXJ2aWNlOiBFeHRlcm5hbENvbmZpZ3VyYXRpb25IYW5kbGVySW50ZXJmYWNlKSB7XHJcblx0dGhpcy5leHRlcm5hbENvbmZpZ3VyYXRpb25TZXJ2aWNlID0gZXh0ZXJuYWxDb25maWd1cmF0aW9uU2VydmljZTtcclxuXHJcbiAgICAgICAgUmVzb3VyY2VIZWxwZXIuc2V0UHJveHlVcmkoZXh0ZXJuYWxDb25maWd1cmF0aW9uU2VydmljZS5nZXRQcm94eVVyaSgpKTtcclxuICAgICAgICBSZXNvdXJjZUhlbHBlci5zZXRSb290VXJpKGV4dGVybmFsQ29uZmlndXJhdGlvblNlcnZpY2UuZ2V0Um9vdFVyaSgpKTtcclxuICAgICAgICBSZXNvdXJjZUhlbHBlci5zZXRIdHRwKGV4dGVybmFsQ29uZmlndXJhdGlvblNlcnZpY2UuZ2V0SHR0cCgpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IEV4dGVybmFsQ29uZmlndXJhdGlvbiAqL1xyXG4gICAgcHVibGljIGdldEV4dGVybmFsQ29uZmlndXJhdGlvbigpOiBFeHRlcm5hbENvbmZpZ3VyYXRpb24ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmV4dGVybmFsQ29uZmlndXJhdGlvblNlcnZpY2UuZ2V0RXh0ZXJuYWxDb25maWd1cmF0aW9uKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCBwcm94eSBVUkwgKi9cclxuICAgIHB1YmxpYyBnZXRQcm94eVVyaSgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmV4dGVybmFsQ29uZmlndXJhdGlvblNlcnZpY2UuZ2V0UHJveHlVcmkoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IFJvb3QgVVJJICovXHJcbiAgICBwdWJsaWMgZ2V0Um9vdFVyaSgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmV4dGVybmFsQ29uZmlndXJhdGlvblNlcnZpY2UuZ2V0Um9vdFVyaSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgVVJMICovXHJcbiAgICBwdWJsaWMgZ2V0VVJMKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLmdldFVSTCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgSHR0cENsaWVudCAqL1xyXG4gICAgcHVibGljIGdldEh0dHAoKTogSHR0cENsaWVudCB7XHJcbiAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLmdldEh0dHAoKTtcclxuICAgIH1cclxufVxyXG4iLCJcclxuaW1wb3J0IHsgdGhyb3dFcnJvciBhcyBvYnNlcnZhYmxlVGhyb3dFcnJvciB9IGZyb20gJ3J4anMnO1xyXG5cclxuaW1wb3J0IHsgY2F0Y2hFcnJvciwgbWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5pbXBvcnQgeyBSZXNvdXJjZSB9IGZyb20gJy4vcmVzb3VyY2UnO1xyXG5pbXBvcnQgeyBSZXNvdXJjZUhlbHBlciB9IGZyb20gJy4vcmVzb3VyY2UtaGVscGVyJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwUGFyYW1zLCBIdHRwUmVzcG9uc2UgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IFNvcnQgfSBmcm9tICcuL3NvcnQnO1xyXG5pbXBvcnQgeyBSZXNvdXJjZUFycmF5IH0gZnJvbSAnLi9yZXNvdXJjZS1hcnJheSc7XHJcbmltcG9ydCB7IEV4dGVybmFsU2VydmljZSB9IGZyb20gJy4vZXh0ZXJuYWwuc2VydmljZSc7XHJcbmltcG9ydCB7IEhhbE9wdGlvbnMgfSBmcm9tICcuL3Jlc3Quc2VydmljZSc7XHJcbmltcG9ydCB7IFN1YlR5cGVCdWlsZGVyIH0gZnJvbSAnLi9zdWJ0eXBlLWJ1aWxkZXInO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcblxyXG4vKiogUmVzb3VyY2VTZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFJlc291cmNlU2VydmljZSB7XHJcblxyXG5cclxuICAgIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBleHRlcm5hbFNlcnZpY2U6IEV4dGVybmFsU2VydmljZSkgeyB9XHJcblxyXG5cclxuICAgIC8qKiBnZXQgVVJMICovXHJcbiAgICBwcml2YXRlIHN0YXRpYyBnZXRVUkwoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gUmVzb3VyY2VIZWxwZXIuZ2V0VVJMKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCBhbGwgcmVzb3VyY2VzIGZyb20gYSBiYXNlIFVSSSBvZiBhIGdpdmVuIHR5cGUgKi9cclxuICAgIHB1YmxpYyBnZXRBbGw8VCBleHRlbmRzIFJlc291cmNlPih0eXBlOiB7IG5ldygpOiBUIH0sIHJlc291cmNlOiBzdHJpbmcsIF9lbWJlZGRlZDogc3RyaW5nLCBvcHRpb25zPzogSGFsT3B0aW9ucywgc3ViVHlwZT86IFN1YlR5cGVCdWlsZGVyLCBlbWJlZGRlZE5hbWU/OlN0cmluZywgaWdub3JlUHJvamVjdGlvbj86Ym9vbGVhbik6IE9ic2VydmFibGU8UmVzb3VyY2VBcnJheTxUPj4ge1xyXG4gICAgICAgIGxldCB1cmkgPSB0aGlzLmdldFJlc291cmNlVXJsKHJlc291cmNlKTtcclxuICAgICAgICBpZighaWdub3JlUHJvamVjdGlvbil7XHJcbiAgICAgICAgICAgIHVyaSA9IHVyaS5jb25jYXQoJz9wcm9qZWN0aW9uPXZpZXcnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgcGFyYW1zID0gUmVzb3VyY2VIZWxwZXIub3B0aW9uUGFyYW1zKG5ldyBIdHRwUGFyYW1zKCksIG9wdGlvbnMpO1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdDogUmVzb3VyY2VBcnJheTxUPiA9IFJlc291cmNlSGVscGVyLmNyZWF0ZUVtcHR5UmVzdWx0PFQ+KF9lbWJlZGRlZCk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0VXJscyhyZXN1bHQpO1xyXG4gICAgICAgIHJlc3VsdC5zb3J0SW5mbyA9IG9wdGlvbnMgPyBvcHRpb25zLnNvcnQgOiB1bmRlZmluZWQ7XHJcbiAgICAgICAgbGV0IG9ic2VydmFibGUgPSBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkuZ2V0KHVyaSwgeyBoZWFkZXJzOiBSZXNvdXJjZUhlbHBlci5oZWFkZXJzLCBwYXJhbXM6IHBhcmFtcyB9KTtcclxuICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZS5waXBlKG1hcChyZXNwb25zZSA9PiBSZXNvdXJjZUhlbHBlci5pbnN0YW50aWF0ZVJlc291cmNlQ29sbGVjdGlvbih0eXBlLCByZXNwb25zZSwgcmVzdWx0LCBzdWJUeXBlLGVtYmVkZGVkTmFtZSkpLFxyXG4gICAgICAgICAgICBjYXRjaEVycm9yKGVycm9yID0+IG9ic2VydmFibGVUaHJvd0Vycm9yKGVycm9yKSkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgcmVzb3VyY2UgZnJvbSBhIGJhc2UgVVJJIGFuZCBhIGdpdmVuIGlkICovXHJcbiAgICBwdWJsaWMgZ2V0PFQgZXh0ZW5kcyBSZXNvdXJjZT4odHlwZTogeyBuZXcoKTogVCB9LCByZXNvdXJjZTogc3RyaW5nLCBpZDogYW55KTogT2JzZXJ2YWJsZTxUPiB7XHJcbiAgICAgICAgY29uc3QgdXJpID0gdGhpcy5nZXRSZXNvdXJjZVVybChyZXNvdXJjZSkuY29uY2F0KCcvJywgaWQsICc/cHJvamVjdGlvbj12aWV3Jyk7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0OiBUID0gbmV3IHR5cGUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRVcmxzUmVzb3VyY2UocmVzdWx0KTtcclxuICAgICAgICBsZXQgb2JzZXJ2YWJsZSA9IFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5nZXQodXJpLCB7IGhlYWRlcnM6IFJlc291cmNlSGVscGVyLmhlYWRlcnMgfSk7XHJcbiAgICAgICAgcmV0dXJuIG9ic2VydmFibGUucGlwZShtYXAoZGF0YSA9PiBSZXNvdXJjZUhlbHBlci5pbnN0YW50aWF0ZVJlc291cmNlKHJlc3VsdCwgZGF0YSkpLFxyXG4gICAgICAgICAgICBjYXRjaEVycm9yKGVycm9yID0+IG9ic2VydmFibGVUaHJvd0Vycm9yKGVycm9yKSkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgcmVzb3VyY2UgZnJvbSBpdHMgc2VsZmxpbmsgKi9cclxuICAgIHB1YmxpYyBnZXRCeVNlbGZMaW5rPFQgZXh0ZW5kcyBSZXNvdXJjZT4odHlwZTogeyBuZXcoKTogVCB9LCByZXNvdXJjZUxpbms6IHN0cmluZyk6IE9ic2VydmFibGU8VD4ge1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdDogVCA9IG5ldyB0eXBlKCk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0VXJsc1Jlc291cmNlKHJlc3VsdCk7XHJcbiAgICAgICAgbGV0IG9ic2VydmFibGUgPSBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkuZ2V0KFJlc291cmNlSGVscGVyLmdldFByb3h5KHJlc291cmNlTGluayksIHsgaGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVycyB9KTtcclxuICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZS5waXBlKG1hcChkYXRhID0+IFJlc291cmNlSGVscGVyLmluc3RhbnRpYXRlUmVzb3VyY2UocmVzdWx0LCBkYXRhKSksXHJcbiAgICAgICAgICAgIGNhdGNoRXJyb3IoZXJyb3IgPT4gb2JzZXJ2YWJsZVRocm93RXJyb3IoZXJyb3IpKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHNlYXJjaCByZXNvdXJjZXMgZnJvbSBhIGdpdmVuIGJhc2UgcGF0aCwgcXVlcnkgYW5kIG9wdGlvbnMgKi9cclxuICAgIHB1YmxpYyBzZWFyY2g8VCBleHRlbmRzIFJlc291cmNlPih0eXBlOiB7IG5ldygpOiBUIH0sIHF1ZXJ5OiBzdHJpbmcsIHJlc291cmNlOiBzdHJpbmcsIF9lbWJlZGRlZDogc3RyaW5nLCBvcHRpb25zPzogSGFsT3B0aW9ucyk6IE9ic2VydmFibGU8UmVzb3VyY2VBcnJheTxUPj4ge1xyXG4gICAgICAgIGNvbnN0IHVyaSA9IHRoaXMuZ2V0UmVzb3VyY2VVcmwocmVzb3VyY2UpLmNvbmNhdCgnL3NlYXJjaC8nLCBxdWVyeSk7XHJcbiAgICAgICAgY29uc3QgcGFyYW1zID0gUmVzb3VyY2VIZWxwZXIub3B0aW9uUGFyYW1zKG5ldyBIdHRwUGFyYW1zKCksIG9wdGlvbnMpO1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdDogUmVzb3VyY2VBcnJheTxUPiA9IFJlc291cmNlSGVscGVyLmNyZWF0ZUVtcHR5UmVzdWx0PFQ+KF9lbWJlZGRlZCk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0VXJscyhyZXN1bHQpO1xyXG4gICAgICAgIGxldCBvYnNlcnZhYmxlID0gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLmdldCh1cmksIHsgaGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVycywgcGFyYW1zOiBwYXJhbXMgfSk7XHJcbiAgICAgICAgcmV0dXJuIG9ic2VydmFibGUucGlwZShtYXAocmVzcG9uc2UgPT4gUmVzb3VyY2VIZWxwZXIuaW5zdGFudGlhdGVSZXNvdXJjZUNvbGxlY3Rpb24odHlwZSwgcmVzcG9uc2UsIHJlc3VsdCkpLFxyXG4gICAgICAgICAgICBjYXRjaEVycm9yKGVycm9yID0+IG9ic2VydmFibGVUaHJvd0Vycm9yKGVycm9yKSkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBzZWFyY2ggYSBzaW5nbGUgcmVzb3VyY2UgZnJvbSBhIGdpdmVuIGJhc2UgcGF0aCwgcXVlcnkgYW5kIG9wdGlvbnMgKi9cclxuICAgIHB1YmxpYyBzZWFyY2hTaW5nbGU8VCBleHRlbmRzIFJlc291cmNlPih0eXBlOiB7IG5ldygpOiBUIH0sIHF1ZXJ5OiBzdHJpbmcsIHJlc291cmNlOiBzdHJpbmcsIG9wdGlvbnM/OiBIYWxPcHRpb25zKTogT2JzZXJ2YWJsZTxUPiB7XHJcbiAgICAgICAgY29uc3QgdXJpID0gdGhpcy5nZXRSZXNvdXJjZVVybChyZXNvdXJjZSkuY29uY2F0KCcvc2VhcmNoLycsIHF1ZXJ5KTtcclxuICAgICAgICBjb25zdCBwYXJhbXMgPSBSZXNvdXJjZUhlbHBlci5vcHRpb25QYXJhbXMobmV3IEh0dHBQYXJhbXMoKSwgb3B0aW9ucyk7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0OiBUID0gbmV3IHR5cGUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRVcmxzUmVzb3VyY2UocmVzdWx0KTtcclxuICAgICAgICBsZXQgb2JzZXJ2YWJsZSA9IFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5nZXQodXJpLCB7IGhlYWRlcnM6IFJlc291cmNlSGVscGVyLmhlYWRlcnMsIHBhcmFtczogcGFyYW1zIH0pO1xyXG4gICAgICAgIHJldHVybiBvYnNlcnZhYmxlLnBpcGUobWFwKHJlc3BvbnNlID0+IFJlc291cmNlSGVscGVyLmluc3RhbnRpYXRlUmVzb3VyY2UocmVzdWx0LCByZXNwb25zZSkpLFxyXG4gICAgICAgICAgICBjYXRjaEVycm9yKGVycm9yID0+IG9ic2VydmFibGVUaHJvd0Vycm9yKGVycm9yKSkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBzZWFyY2ggcmVzb3VyY2VzIGZyb20gYSBnaXZlbiBiYXNlIHBhdGgsIGN1c3RvbSBxdWVyeSBhbmQgb3B0aW9ucyAqL1xyXG4gICAgcHVibGljIGN1c3RvbVF1ZXJ5PFQgZXh0ZW5kcyBSZXNvdXJjZT4odHlwZTogeyBuZXcoKTogVCB9LCBxdWVyeTogc3RyaW5nLCByZXNvdXJjZTogc3RyaW5nLCBfZW1iZWRkZWQ6IHN0cmluZywgb3B0aW9ucz86IEhhbE9wdGlvbnMpOiBPYnNlcnZhYmxlPFJlc291cmNlQXJyYXk8VD4+IHtcclxuICAgICAgICBjb25zdCB1cmkgPSB0aGlzLmdldFJlc291cmNlVXJsKHJlc291cmNlICsgcXVlcnkpO1xyXG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IFJlc291cmNlSGVscGVyLm9wdGlvblBhcmFtcyhuZXcgSHR0cFBhcmFtcygpLCBvcHRpb25zKTtcclxuICAgICAgICBjb25zdCByZXN1bHQ6IFJlc291cmNlQXJyYXk8VD4gPSBSZXNvdXJjZUhlbHBlci5jcmVhdGVFbXB0eVJlc3VsdDxUPihfZW1iZWRkZWQpO1xyXG5cclxuICAgICAgICB0aGlzLnNldFVybHMocmVzdWx0KTtcclxuICAgICAgICBsZXQgb2JzZXJ2YWJsZSA9IFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5nZXQodXJpLCB7IGhlYWRlcnM6IFJlc291cmNlSGVscGVyLmhlYWRlcnMsIHBhcmFtczogcGFyYW1zIH0pO1xyXG4gICAgICAgIHJldHVybiBvYnNlcnZhYmxlLnBpcGUobWFwKHJlc3BvbnNlID0+IFJlc291cmNlSGVscGVyLmluc3RhbnRpYXRlUmVzb3VyY2VDb2xsZWN0aW9uKHR5cGUsIHJlc3BvbnNlLCByZXN1bHQpKSxcclxuICAgICAgICAgICAgY2F0Y2hFcnJvcihlcnJvciA9PiBvYnNlcnZhYmxlVGhyb3dFcnJvcihlcnJvcikpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHJlc291cmNlIGdpdmVuIGEgcmVsYXRpb24gbGluayAqL1xyXG4gICAgcHVibGljIGdldEJ5UmVsYXRpb248VCBleHRlbmRzIFJlc291cmNlPih0eXBlOiB7IG5ldygpOiBUIH0sIHJlc291cmNlTGluazogc3RyaW5nKTogT2JzZXJ2YWJsZTxUPiB7XHJcbiAgICAgICAgbGV0IHJlc3VsdDogVCA9IG5ldyB0eXBlKCk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0VXJsc1Jlc291cmNlKHJlc3VsdCk7XHJcbiAgICAgICAgbGV0IG9ic2VydmFibGUgPSBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkuZ2V0KHJlc291cmNlTGluaywgeyBoZWFkZXJzOiBSZXNvdXJjZUhlbHBlci5oZWFkZXJzIH0pO1xyXG4gICAgICAgIHJldHVybiBvYnNlcnZhYmxlLnBpcGUobWFwKGRhdGEgPT4gUmVzb3VyY2VIZWxwZXIuaW5zdGFudGlhdGVSZXNvdXJjZShyZXN1bHQsIGRhdGEpKSxcclxuICAgICAgICAgICAgY2F0Y2hFcnJvcihlcnJvciA9PiBvYnNlcnZhYmxlVGhyb3dFcnJvcihlcnJvcikpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHJlc291cmNlIGFycmF5IGdpdmVuIGEgcmVsYXRpb24gbGluayAqL1xyXG4gICAgcHVibGljIGdldEJ5UmVsYXRpb25BcnJheTxUIGV4dGVuZHMgUmVzb3VyY2U+KHR5cGU6IHsgbmV3KCk6IFQgfSwgcmVzb3VyY2VMaW5rOiBzdHJpbmcsIF9lbWJlZGRlZDogc3RyaW5nLCBidWlsZGVyPzogU3ViVHlwZUJ1aWxkZXIpOiBPYnNlcnZhYmxlPFJlc291cmNlQXJyYXk8VD4+IHtcclxuICAgICAgICBjb25zdCByZXN1bHQ6IFJlc291cmNlQXJyYXk8VD4gPSBSZXNvdXJjZUhlbHBlci5jcmVhdGVFbXB0eVJlc3VsdDxUPihfZW1iZWRkZWQpO1xyXG5cclxuICAgICAgICB0aGlzLnNldFVybHMocmVzdWx0KTtcclxuICAgICAgICBsZXQgb2JzZXJ2YWJsZSA9IFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5nZXQocmVzb3VyY2VMaW5rLCB7IGhlYWRlcnM6IFJlc291cmNlSGVscGVyLmhlYWRlcnMgfSk7XHJcbiAgICAgICAgcmV0dXJuIG9ic2VydmFibGUucGlwZShtYXAocmVzcG9uc2UgPT4gUmVzb3VyY2VIZWxwZXIuaW5zdGFudGlhdGVSZXNvdXJjZUNvbGxlY3Rpb24odHlwZSwgcmVzcG9uc2UsIHJlc3VsdCwgYnVpbGRlcikpLFxyXG4gICAgICAgICAgICBjYXRjaEVycm9yKGVycm9yID0+IG9ic2VydmFibGVUaHJvd0Vycm9yKGVycm9yKSkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBjb3VudCByZXNvdXJjZXMgZ2l2ZW4gYSBwYXRoICovXHJcbiAgICBwdWJsaWMgY291bnQocmVzb3VyY2U6IHN0cmluZyk6IE9ic2VydmFibGU8bnVtYmVyPiB7XHJcbiAgICAgICAgY29uc3QgdXJpID0gdGhpcy5nZXRSZXNvdXJjZVVybChyZXNvdXJjZSkuY29uY2F0KCcvc2VhcmNoL2NvdW50QWxsJyk7XHJcblxyXG4gICAgICAgIHJldHVybiBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkuZ2V0KHVyaSwgeyBoZWFkZXJzOiBSZXNvdXJjZUhlbHBlci5oZWFkZXJzLCBvYnNlcnZlOiAnYm9keScgfSkucGlwZShcclxuICAgICAgICAgICAgbWFwKChyZXNwb25zZTogUmVzcG9uc2UpID0+IE51bWJlcihyZXNwb25zZS5ib2R5KSksXHJcbiAgICAgICAgICAgIGNhdGNoRXJyb3IoZXJyb3IgPT4gb2JzZXJ2YWJsZVRocm93RXJyb3IoZXJyb3IpKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGNyZWF0ZSByZXNvdXJjZSBmcm9tIHNlbGYgbGluayBhbmQgZW50aXR5IGRhdGEqL1xyXG4gICAgcHVibGljIGNyZWF0ZTxUIGV4dGVuZHMgUmVzb3VyY2U+KHNlbGZSZXNvdXJjZTogc3RyaW5nLCBlbnRpdHk6IFQpIHtcclxuICAgICAgICBjb25zdCB1cmkgPSBSZXNvdXJjZUhlbHBlci5nZXRVUkwoKSArIHNlbGZSZXNvdXJjZTtcclxuICAgICAgICBjb25zdCBwYXlsb2FkID0gUmVzb3VyY2VIZWxwZXIucmVzb2x2ZVJlbGF0aW9ucyhlbnRpdHkpO1xyXG5cclxuICAgICAgICB0aGlzLnNldFVybHNSZXNvdXJjZShlbnRpdHkpO1xyXG4gICAgICAgIGxldCBvYnNlcnZhYmxlID0gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLnBvc3QodXJpLCBwYXlsb2FkLCB7IGhlYWRlcnM6IFJlc291cmNlSGVscGVyLmhlYWRlcnMsIG9ic2VydmU6ICdyZXNwb25zZScgfSk7XHJcbiAgICAgICAgcmV0dXJuIG9ic2VydmFibGUucGlwZShtYXAoKHJlc3BvbnNlOiBIdHRwUmVzcG9uc2U8c3RyaW5nPikgPT4ge1xyXG4gICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID49IDIwMCAmJiByZXNwb25zZS5zdGF0dXMgPD0gMjA3KVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLmluc3RhbnRpYXRlUmVzb3VyY2UoZW50aXR5LCByZXNwb25zZS5ib2R5KTtcclxuICAgICAgICAgICAgZWxzZSBpZiAocmVzcG9uc2Uuc3RhdHVzID09IDUwMCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGJvZHk6IGFueSA9IHJlc3BvbnNlLmJvZHk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZVRocm93RXJyb3IoYm9keS5lcnJvcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KSwgY2F0Y2hFcnJvcihlcnJvciA9PiBvYnNlcnZhYmxlVGhyb3dFcnJvcihlcnJvcikpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogdXBkYXRlIHJlc291cmNlIGZyb20gYSBnaXZlbiBlbnRpdHkgZGF0YSovXHJcbiAgICBwdWJsaWMgdXBkYXRlPFQgZXh0ZW5kcyBSZXNvdXJjZT4oZW50aXR5OiBUKSB7XHJcbiAgICAgICAgY29uc3QgdXJpID0gUmVzb3VyY2VIZWxwZXIuZ2V0UHJveHkoZW50aXR5Ll9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICAgICAgIGNvbnN0IHBheWxvYWQgPSBSZXNvdXJjZUhlbHBlci5yZXNvbHZlUmVsYXRpb25zKGVudGl0eSk7XHJcbiAgICAgICAgdGhpcy5zZXRVcmxzUmVzb3VyY2UoZW50aXR5KTtcclxuICAgICAgICBsZXQgb2JzZXJ2YWJsZSA9IFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5wdXQodXJpLCBwYXlsb2FkLCB7IGhlYWRlcnM6IFJlc291cmNlSGVscGVyLmhlYWRlcnMsIG9ic2VydmU6ICdyZXNwb25zZScgfSk7XHJcbiAgICAgICAgcmV0dXJuIG9ic2VydmFibGUucGlwZShtYXAoKHJlc3BvbnNlOiBIdHRwUmVzcG9uc2U8c3RyaW5nPikgPT4ge1xyXG4gICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID49IDIwMCAmJiByZXNwb25zZS5zdGF0dXMgPD0gMjA3KVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFJlc291cmNlSGVscGVyLmluc3RhbnRpYXRlUmVzb3VyY2UoZW50aXR5LCByZXNwb25zZS5ib2R5KTtcclxuICAgICAgICAgICAgZWxzZSBpZiAocmVzcG9uc2Uuc3RhdHVzID09IDUwMCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGJvZHk6IGFueSA9IHJlc3BvbnNlLmJvZHk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZVRocm93RXJyb3IoYm9keS5lcnJvcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KSwgY2F0Y2hFcnJvcihlcnJvciA9PiBvYnNlcnZhYmxlVGhyb3dFcnJvcihlcnJvcikpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogdXBkYXRlIHJlc291cmNlIGZyb20gYSBnaXZlbiBlbnRpdHkgZGF0YSovXHJcbiAgICBwdWJsaWMgdXBkYXRlQ29sbGVjdGlvbjxUIGV4dGVuZHMgUmVzb3VyY2U+KHJlc291cmNlQXJyYXk6IFJlc291cmNlQXJyYXk8VD4sIHJlc291cmNlTGluazogc3RyaW5nKSB7XHJcbiAgICAgICAgY29uc3QgdXJpID0gUmVzb3VyY2VIZWxwZXIuZ2V0UHJveHkocmVzb3VyY2VMaW5rKTtcclxuICAgICAgICAvL2NvbnN0IHBheWxvYWQgPSBSZXNvdXJjZUhlbHBlci5yZXNvbHZlUmVsYXRpb25zKGVudGl0eSk7XHJcbiAgICAgICAgLy90aGlzLnNldFVybHNSZXNvdXJjZShlbnRpdHkpO1xyXG4gICAgICAgIHZhciBoZWFkZXJzUmVxID0gUmVzb3VyY2VIZWxwZXIuaGVhZGVycztcclxuICAgICAgICBoZWFkZXJzUmVxLnNldChcIkNvbnRlbnQtVHlwZVwiLCBcInRleHQvdXJpLWxpc3RcIik7XHJcbiAgICAgICAgbGV0IG9ic2VydmFibGUgPSBSZXNvdXJjZUhlbHBlci5nZXRIdHRwKCkucHV0KHVyaSwgcmVzb3VyY2VBcnJheSwgeyBoZWFkZXJzOiBoZWFkZXJzUmVxLCBvYnNlcnZlOiAncmVzcG9uc2UnIH0pO1xyXG4gICAgICAgIHJldHVybiBvYnNlcnZhYmxlLnBpcGUobWFwKChyZXNwb25zZTogSHR0cFJlc3BvbnNlPHN0cmluZz4pID0+IHtcclxuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA+PSAyMDAgJiYgcmVzcG9uc2Uuc3RhdHVzIDw9IDIwNylcclxuICAgICAgICAgICAgICAgIHJldHVybiBcIlwiO1xyXG4gICAgICAgICAgICBlbHNlIGlmIChyZXNwb25zZS5zdGF0dXMgPT0gNTAwKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgYm9keTogYW55ID0gcmVzcG9uc2UuYm9keTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBvYnNlcnZhYmxlVGhyb3dFcnJvcihib2R5LmVycm9yKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pLCBjYXRjaEVycm9yKGVycm9yID0+IG9ic2VydmFibGVUaHJvd0Vycm9yKGVycm9yKSkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBwYXRjaCByZXNvdXJjZSBmcm9tIGEgZ2l2ZW4gZW50aXR5IGRhdGEqL1xyXG4gICAgcHVibGljIHBhdGNoPFQgZXh0ZW5kcyBSZXNvdXJjZT4oZW50aXR5OiBUKSB7XHJcbiAgICAgICAgY29uc3QgdXJpID0gUmVzb3VyY2VIZWxwZXIuZ2V0UHJveHkoZW50aXR5Ll9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICAgICAgIGNvbnN0IHBheWxvYWQgPSBSZXNvdXJjZUhlbHBlci5yZXNvbHZlUmVsYXRpb25zKGVudGl0eSk7XHJcbiAgICAgICAgdGhpcy5zZXRVcmxzUmVzb3VyY2UoZW50aXR5KTtcclxuICAgICAgICBsZXQgb2JzZXJ2YWJsZSA9IFJlc291cmNlSGVscGVyLmdldEh0dHAoKS5wYXRjaCh1cmksIHBheWxvYWQsIHsgaGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVycywgb2JzZXJ2ZTogJ3Jlc3BvbnNlJyB9KTtcclxuICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZS5waXBlKG1hcCgocmVzcG9uc2U6IEh0dHBSZXNwb25zZTxzdHJpbmc+KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPj0gMjAwICYmIHJlc3BvbnNlLnN0YXR1cyA8PSAyMDcpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gUmVzb3VyY2VIZWxwZXIuaW5zdGFudGlhdGVSZXNvdXJjZShlbnRpdHksIHJlc3BvbnNlLmJvZHkpO1xyXG4gICAgICAgICAgICBlbHNlIGlmIChyZXNwb25zZS5zdGF0dXMgPT0gNTAwKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgYm9keTogYW55ID0gcmVzcG9uc2UuYm9keTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBvYnNlcnZhYmxlVGhyb3dFcnJvcihib2R5LmVycm9yKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pLCBjYXRjaEVycm9yKGVycm9yID0+IG9ic2VydmFibGVUaHJvd0Vycm9yKGVycm9yKSkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBkZWxldGUgcmVzb3VyY2UgZnJvbSBhIGdpdmVuIGVudGl0eSBkYXRhKi9cclxuICAgIHB1YmxpYyBkZWxldGU8VCBleHRlbmRzIFJlc291cmNlPihlbnRpdHk6IFQpOiBPYnNlcnZhYmxlPE9iamVjdD4ge1xyXG4gICAgICAgIGNvbnN0IHVyaSA9IFJlc291cmNlSGVscGVyLmdldFByb3h5KGVudGl0eS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgICAgICByZXR1cm4gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpLmRlbGV0ZSh1cmksIHsgaGVhZGVyczogUmVzb3VyY2VIZWxwZXIuaGVhZGVycyB9KS5waXBlKGNhdGNoRXJyb3IoZXJyb3IgPT4gb2JzZXJ2YWJsZVRocm93RXJyb3IoZXJyb3IpKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHdoZXRoZXIgYSByZXNvdXJjZSBhcnJheSBoYXMgbmV4dCBwYWdlIG9mIHJlc3VsdHMqL1xyXG4gICAgcHVibGljIGhhc05leHQ8VCBleHRlbmRzIFJlc291cmNlPihyZXNvdXJjZUFycmF5OiBSZXNvdXJjZUFycmF5PFQ+KTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHJlc291cmNlQXJyYXkubmV4dF91cmkgIT0gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiB3aGV0aGVyIGEgcmVzb3VyY2UgYXJyYXkgaGFzIHByZXZpb3VzIHBhZ2Ugb2YgcmVzdWx0cyovXHJcbiAgICBwdWJsaWMgaGFzUHJldjxUIGV4dGVuZHMgUmVzb3VyY2U+KHJlc291cmNlQXJyYXk6IFJlc291cmNlQXJyYXk8VD4pOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gcmVzb3VyY2VBcnJheS5wcmV2X3VyaSAhPSB1bmRlZmluZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHdoZXRoZXIgYSByZXNvdXJjZSBhcnJheSBoYXMgZmlyc3QgcGFnZSBvZiByZXN1bHRzKi9cclxuICAgIHB1YmxpYyBoYXNGaXJzdDxUIGV4dGVuZHMgUmVzb3VyY2U+KHJlc291cmNlQXJyYXk6IFJlc291cmNlQXJyYXk8VD4pOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gcmVzb3VyY2VBcnJheS5maXJzdF91cmkgIT0gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiB3aGV0aGVyIGEgcmVzb3VyY2UgYXJyYXkgaGFzIGxhc3QgcGFnZSBvZiByZXN1bHRzKi9cclxuICAgIHB1YmxpYyBoYXNMYXN0PFQgZXh0ZW5kcyBSZXNvdXJjZT4ocmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPik6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiByZXNvdXJjZUFycmF5Lmxhc3RfdXJpICE9IHVuZGVmaW5lZDtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHJlc291cmNlIGFycmF5IG5leHQgcGFnZSBvZiByZXN1bHRzKi9cclxuICAgIHB1YmxpYyBuZXh0PFQgZXh0ZW5kcyBSZXNvdXJjZT4ocmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPiwgdHlwZTogeyBuZXcoKTogVCB9KTogT2JzZXJ2YWJsZTxSZXNvdXJjZUFycmF5PFQ+PiB7XHJcbiAgICAgICAgcmV0dXJuIHJlc291cmNlQXJyYXkubmV4dCh0eXBlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHJlc291cmNlIGFycmF5IHByZXZpb3VzIHBhZ2Ugb2YgcmVzdWx0cyovXHJcbiAgICBwdWJsaWMgcHJldjxUIGV4dGVuZHMgUmVzb3VyY2U+KHJlc291cmNlQXJyYXk6IFJlc291cmNlQXJyYXk8VD4sIHR5cGU6IHsgbmV3KCk6IFQgfSk6IE9ic2VydmFibGU8UmVzb3VyY2VBcnJheTxUPj4ge1xyXG4gICAgICAgIHJldHVybiByZXNvdXJjZUFycmF5LnByZXYodHlwZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBhcnJheSBmaXJzdCBwYWdlIG9mIHJlc3VsdHMqL1xyXG4gICAgcHVibGljIGZpcnN0PFQgZXh0ZW5kcyBSZXNvdXJjZT4ocmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPiwgdHlwZTogeyBuZXcoKTogVCB9KTogT2JzZXJ2YWJsZTxSZXNvdXJjZUFycmF5PFQ+PiB7XHJcbiAgICAgICAgcmV0dXJuIHJlc291cmNlQXJyYXkuZmlyc3QodHlwZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBhcnJheSBsYXN0IHBhZ2Ugb2YgcmVzdWx0cyovXHJcbiAgICBwdWJsaWMgbGFzdDxUIGV4dGVuZHMgUmVzb3VyY2U+KHJlc291cmNlQXJyYXk6IFJlc291cmNlQXJyYXk8VD4sIHR5cGU6IHsgbmV3KCk6IFQgfSk6IE9ic2VydmFibGU8UmVzb3VyY2VBcnJheTxUPj4ge1xyXG4gICAgICAgIHJldHVybiByZXNvdXJjZUFycmF5Lmxhc3QodHlwZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBhcnJheSBwYWdlIG9mIHJlc3VsdHMgZ2l2ZW4gYSBwYWdlIG51bWJlciovXHJcbiAgICBwdWJsaWMgcGFnZTxUIGV4dGVuZHMgUmVzb3VyY2U+KHJlc291cmNlQXJyYXk6IFJlc291cmNlQXJyYXk8VD4sIHR5cGU6IHsgbmV3KCk6IFQgfSwgaWQ6IG51bWJlcik6IE9ic2VydmFibGU8UmVzb3VyY2VBcnJheTxUPj4ge1xyXG4gICAgICAgIHJldHVybiByZXNvdXJjZUFycmF5LnBhZ2UodHlwZSwgaWQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBzb3J0IHJlc291cmNlIGFycmF5IHdpdGggYSBnaXZlbiBzb3J0aW5nIHBhcmFtcyAqL1xyXG4gICAgcHVibGljIHNvcnRFbGVtZW50czxUIGV4dGVuZHMgUmVzb3VyY2U+KHJlc291cmNlQXJyYXk6IFJlc291cmNlQXJyYXk8VD4sIHR5cGU6IHsgbmV3KCk6IFQgfSwgLi4uc29ydDogU29ydFtdKTogT2JzZXJ2YWJsZTxSZXNvdXJjZUFycmF5PFQ+PiB7XHJcbiAgICAgICAgcmV0dXJuIHJlc291cmNlQXJyYXkuc29ydEVsZW1lbnRzKHR5cGUsIC4uLnNvcnQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgcmVzb3VyY2UgYXJyYXkgc2l6ZSovXHJcbiAgICBwdWJsaWMgc2l6ZTxUIGV4dGVuZHMgUmVzb3VyY2U+KHJlc291cmNlQXJyYXk6IFJlc291cmNlQXJyYXk8VD4sIHR5cGU6IHsgbmV3KCk6IFQgfSwgc2l6ZTogbnVtYmVyKTogT2JzZXJ2YWJsZTxSZXNvdXJjZUFycmF5PFQ+PiB7XHJcbiAgICAgICAgcmV0dXJuIHJlc291cmNlQXJyYXkuc2l6ZSh0eXBlLCBzaXplKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHJlc291cmNlIFVSTCBmcm9tIGEgZ2l2ZW4gcGF0aCovXHJcbiAgICBwdWJsaWMgZ2V0UmVzb3VyY2VVcmwocmVzb3VyY2U/OiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgIGxldCB1cmwgPSBSZXNvdXJjZVNlcnZpY2UuZ2V0VVJMKCk7XHJcbiAgICAgICAgaWYgKCF1cmwuZW5kc1dpdGgoJy8nKSkge1xyXG4gICAgICAgICAgICB1cmwgPSB1cmwuY29uY2F0KCcvJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChyZXNvdXJjZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdXJsLmNvbmNhdChyZXNvdXJjZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB1cmw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHNldCBwcm94eSBhbmQgcm9vdCB1cmxzIG9mIGdpdmVuIHJlc291cmNlIGFycmF5ICovXHJcbiAgICBwcml2YXRlIHNldFVybHM8VCBleHRlbmRzIFJlc291cmNlPihyZXN1bHQ6IFJlc291cmNlQXJyYXk8VD4pIHtcclxuICAgICAgICByZXN1bHQucHJveHlVcmwgPSB0aGlzLmV4dGVybmFsU2VydmljZS5nZXRQcm94eVVyaSgpO1xyXG4gICAgICAgIHJlc3VsdC5yb290VXJsID0gdGhpcy5leHRlcm5hbFNlcnZpY2UuZ2V0Um9vdFVyaSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBzZXQgcHJveHkgYW5kIHJvb3QgdXJscyBvZiBnaXZlbiByZXNvdXJjZSAqL1xyXG4gICAgcHJpdmF0ZSBzZXRVcmxzUmVzb3VyY2U8VCBleHRlbmRzIFJlc291cmNlPihyZXN1bHQ6IFQpIHtcclxuICAgICAgICByZXN1bHQucHJveHlVcmwgPSB0aGlzLmV4dGVybmFsU2VydmljZS5nZXRQcm94eVVyaSgpO1xyXG4gICAgICAgIHJlc3VsdC5yb290VXJsID0gdGhpcy5leHRlcm5hbFNlcnZpY2UuZ2V0Um9vdFVyaSgpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHtvZiBhcyBvYnNlcnZhYmxlT2YsIHRocm93RXJyb3IgYXMgb2JzZXJ2YWJsZVRocm93RXJyb3J9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge21hcCwgbWVyZ2VNYXB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi9yZXNvdXJjZSc7XHJcbmltcG9ydCB7UmVzb3VyY2VBcnJheX0gZnJvbSAnLi9yZXNvdXJjZS1hcnJheSc7XHJcbmltcG9ydCB7U29ydH0gZnJvbSAnLi9zb3J0JztcclxuaW1wb3J0IHtSZXNvdXJjZVNlcnZpY2V9IGZyb20gJy4vcmVzb3VyY2Uuc2VydmljZSc7XHJcbmltcG9ydCB7U3ViVHlwZUJ1aWxkZXJ9IGZyb20gJy4vc3VidHlwZS1idWlsZGVyJztcclxuaW1wb3J0IHtpc051bGxPclVuZGVmaW5lZH0gZnJvbSAndXRpbCc7XHJcbmltcG9ydCB7T2JzZXJ2YWJsZX0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7SW5qZWN0b3J9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XHJcblxyXG4vKiogSEFMIHBhcmFtIGRhdGEgbW9kZWwgKi9cclxuZXhwb3J0IHR5cGUgSGFsUGFyYW0gPSB7IGtleTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nIHwgbnVtYmVyIHwgYm9vbGVhbiB9O1xyXG4vKiogSEFMIG9wdGlvbiBkYXRhIG1vZGVsICovXHJcbmV4cG9ydCB0eXBlIEhhbE9wdGlvbnMgPSB7IG5vdFBhZ2VkPzogYm9vbGVhbiwgc2l6ZT86IG51bWJlciwgc29ydD86IFNvcnRbXSwgcGFyYW1zPzogSGFsUGFyYW1bXSB9O1xyXG5cclxuLyoqIFJFU1QgQVBJIGFjY2VzcyBpbnRlcmZhY2UgKi9cclxuZXhwb3J0IGNsYXNzIFJlc3RTZXJ2aWNlPFQgZXh0ZW5kcyBSZXNvdXJjZT4ge1xyXG4gICAgLyoqIHJlc291cmNlIHR5cGUgKi9cclxuICAgIHByaXZhdGUgdHlwZTogYW55O1xyXG4gICAgLyoqIHJlc291cmNlIHBhdGggKi9cclxuICAgIHByaXZhdGUgcmVzb3VyY2U6IHN0cmluZztcclxuICAgIC8qKiByZXNvdXJjZSBhcnJheSAqL1xyXG4gICAgcHVibGljIHJlc291cmNlQXJyYXk6IFJlc291cmNlQXJyYXk8VD47XHJcbiAgICAvKiogcmVzb3VyY2Ugc2VydmljZSAqL1xyXG4gICAgcHVibGljIHJlc291cmNlU2VydmljZTogUmVzb3VyY2VTZXJ2aWNlO1xyXG4gICAgLyoqIF9lbWJlZGRlZCBmaWVsZCBuYW1lICovXHJcbiAgICBwcml2YXRlIF9lbWJlZGRlZDogc3RyaW5nID0gJ19lbWJlZGRlZCc7XHJcblxyXG4gICAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgICBjb25zdHJ1Y3Rvcih0eXBlOiB7IG5ldygpOiBUIH0sXHJcbiAgICAgICAgICAgICAgICByZXNvdXJjZTogc3RyaW5nLFxyXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSBpbmplY3RvcjogSW5qZWN0b3IsXHJcbiAgICAgICAgICAgICAgICBfZW1iZWRkZWQ/OiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLnR5cGUgPSB0eXBlO1xyXG4gICAgICAgIHRoaXMucmVzb3VyY2UgPSByZXNvdXJjZTtcclxuICAgICAgICB0aGlzLnJlc291cmNlU2VydmljZSA9IGluamVjdG9yLmdldChSZXNvdXJjZVNlcnZpY2UpO1xyXG4gICAgICAgIGlmICghaXNOdWxsT3JVbmRlZmluZWQoX2VtYmVkZGVkKSlcclxuICAgICAgICAgICAgdGhpcy5fZW1iZWRkZWQgPSBfZW1iZWRkZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGVycm9yIGhhbmRsZXIgKi9cclxuICAgIHByb3RlY3RlZCBoYW5kbGVFcnJvcihlcnJvcjogYW55KTpPYnNlcnZhYmxlPG5ldmVyPiB7XHJcbiAgICAgICAgcmV0dXJuIFJlc3RTZXJ2aWNlLmhhbmRsZUVycm9yKGVycm9yKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZXJyb3IgaGFuZGxlciAqL1xyXG4gICAgcHJvdGVjdGVkIHN0YXRpYyBoYW5kbGVFcnJvcihlcnJvcjogYW55KTpPYnNlcnZhYmxlPG5ldmVyPiB7XHJcbiAgICAgICAgcmV0dXJuIG9ic2VydmFibGVUaHJvd0Vycm9yKGVycm9yKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IGFsbCByZXNvdXJjZXMgd2l0aCBvcHRpb25hbCBvcHRpb25zIGFuIHN1YlR5cGUgcGFyYW1zICovXHJcbiAgICBwdWJsaWMgZ2V0QWxsKG9wdGlvbnM/OiBIYWxPcHRpb25zLCBzdWJUeXBlPzogU3ViVHlwZUJ1aWxkZXIsIGVtYmVkZGVkTmFtZT86U3RyaW5nLCBpZ25vcmVQcm9qZWN0aW9uPzpib29sZWFuKTogT2JzZXJ2YWJsZTxUW10+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0QWxsKHRoaXMudHlwZSwgdGhpcy5yZXNvdXJjZSwgdGhpcy5fZW1iZWRkZWQsIG9wdGlvbnMsIHN1YlR5cGUsZW1iZWRkZWROYW1lLCBpZ25vcmVQcm9qZWN0aW9uKS5waXBlKFxyXG4gICAgICAgICAgICBtZXJnZU1hcCgocmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPikgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5ub3RQYWdlZCAmJiAhaXNOdWxsT3JVbmRlZmluZWQocmVzb3VyY2VBcnJheS5maXJzdF91cmkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5ub3RQYWdlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuc2l6ZSA9IHJlc291cmNlQXJyYXkudG90YWxFbGVtZW50cztcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRBbGwob3B0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVzb3VyY2VBcnJheSA9IHJlc291cmNlQXJyYXk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9ic2VydmFibGVPZihyZXNvdXJjZUFycmF5LnJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHJlc291cmNlIGZyb20gYSBnaXZlbiBpZCAqL1xyXG4gICAgcHVibGljIGdldChpZDogYW55KTogT2JzZXJ2YWJsZTxUPiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldCh0aGlzLnR5cGUsIHRoaXMucmVzb3VyY2UsIGlkKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHJlc291cmNlIGZyb20gc2VsZiBsaW5rICovXHJcbiAgICBwdWJsaWMgZ2V0QnlTZWxmTGluayhzZWxmTGluazogc3RyaW5nKTogT2JzZXJ2YWJsZTxUPiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldEJ5U2VsZkxpbmsodGhpcy50eXBlLCBzZWxmTGluayk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHNlYXJjaCByZXNvdXJjZXMgZnJvbSBhIGdpdmVuIHF1ZXJ5IHN0cmluZyBhbmQgb3B0aW9uYWwgb3B0aW9ucyBwYXJhbXMgKi9cclxuICAgIHB1YmxpYyBzZWFyY2gocXVlcnk6IHN0cmluZywgb3B0aW9ucz86IEhhbE9wdGlvbnMpOiBPYnNlcnZhYmxlPFRbXT4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5zZWFyY2godGhpcy50eXBlLCBxdWVyeSwgdGhpcy5yZXNvdXJjZSwgdGhpcy5fZW1iZWRkZWQsIG9wdGlvbnMpLnBpcGUoXHJcbiAgICAgICAgICAgIG1lcmdlTWFwKChyZXNvdXJjZUFycmF5OiBSZXNvdXJjZUFycmF5PFQ+KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLm5vdFBhZ2VkICYmICFpc051bGxPclVuZGVmaW5lZChyZXNvdXJjZUFycmF5LmZpcnN0X3VyaSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLm5vdFBhZ2VkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5zaXplID0gcmVzb3VyY2VBcnJheS50b3RhbEVsZW1lbnRzO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnNlYXJjaChxdWVyeSwgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVzb3VyY2VBcnJheSA9IHJlc291cmNlQXJyYXk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9ic2VydmFibGVPZihyZXNvdXJjZUFycmF5LnJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogc2VhcmNoIHJlc291cmNlIGZyb20gYSBnaXZlbiBxdWVyeSBzdHJpbmcgYW5kIG9wdGlvbmFsIG9wdGlvbnMgcGFyYW1zICovXHJcbiAgICBwdWJsaWMgc2VhcmNoU2luZ2xlKHF1ZXJ5OiBzdHJpbmcsIG9wdGlvbnM/OiBIYWxPcHRpb25zKTogT2JzZXJ2YWJsZTxUPiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLnNlYXJjaFNpbmdsZSh0aGlzLnR5cGUsIHF1ZXJ5LCB0aGlzLnJlc291cmNlLCBvcHRpb25zKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogc2VhcmNoIHJlc291cmNlcyBmcm9tIGEgZ2l2ZW4gY3VzdG9tIHF1ZXJ5IHN0cmluZyBhbmQgb3B0aW9uYWwgb3B0aW9ucyBwYXJhbXMgKi9cclxuICAgIHB1YmxpYyBjdXN0b21RdWVyeShxdWVyeTogc3RyaW5nLCBvcHRpb25zPzogSGFsT3B0aW9ucyk6IE9ic2VydmFibGU8VFtdPiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLmN1c3RvbVF1ZXJ5KHRoaXMudHlwZSwgcXVlcnksIHRoaXMucmVzb3VyY2UsIHRoaXMuX2VtYmVkZGVkLCBvcHRpb25zKS5waXBlKFxyXG4gICAgICAgICAgICBtZXJnZU1hcCgocmVzb3VyY2VBcnJheTogUmVzb3VyY2VBcnJheTxUPikgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5ub3RQYWdlZCAmJiAhaXNOdWxsT3JVbmRlZmluZWQocmVzb3VyY2VBcnJheS5maXJzdF91cmkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5ub3RQYWdlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuc2l6ZSA9IHJlc291cmNlQXJyYXkudG90YWxFbGVtZW50cztcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jdXN0b21RdWVyeShxdWVyeSwgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVzb3VyY2VBcnJheSA9IHJlc291cmNlQXJyYXk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9ic2VydmFibGVPZihyZXNvdXJjZUFycmF5LnJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBhcnJheSBnaXZlbiBhIHJlbGF0aW9uIGxpbmsgKi9cclxuICAgIHB1YmxpYyBnZXRCeVJlbGF0aW9uQXJyYXkocmVsYXRpb246IHN0cmluZywgYnVpbGRlcj86IFN1YlR5cGVCdWlsZGVyKTogT2JzZXJ2YWJsZTxUW10+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0QnlSZWxhdGlvbkFycmF5KHRoaXMudHlwZSwgcmVsYXRpb24sIHRoaXMuX2VtYmVkZGVkLCBidWlsZGVyKS5waXBlKFxyXG4gICAgICAgICAgICBtYXAoKHJlc291cmNlQXJyYXk6IFJlc291cmNlQXJyYXk8VD4pID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVzb3VyY2VBcnJheSA9IHJlc291cmNlQXJyYXk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzb3VyY2VBcnJheS5yZXN1bHQ7XHJcbiAgICAgICAgICAgIH0pKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHJlc291cmNlIGdpdmVuIGEgcmVsYXRpb24gbGluayAqL1xyXG4gICAgcHVibGljIGdldEJ5UmVsYXRpb24ocmVsYXRpb246IHN0cmluZyk6IE9ic2VydmFibGU8VD4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5nZXRCeVJlbGF0aW9uKHRoaXMudHlwZSwgcmVsYXRpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBjb3VudCByZXNvdXJjZXMgZ2l2ZW4gYSBwYXRoICovXHJcbiAgICBwdWJsaWMgY291bnQoKTogT2JzZXJ2YWJsZTxudW1iZXI+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZVNlcnZpY2UuY291bnQodGhpcy5yZXNvdXJjZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGNyZWF0ZSByZXNvdXJjZSBmcm9tIHNlbGYgbGluayBhbmQgZW50aXR5IGRhdGEqL1xyXG4gICAgcHVibGljIGNyZWF0ZShlbnRpdHk6IFQpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZVNlcnZpY2UuY3JlYXRlKHRoaXMucmVzb3VyY2UsIGVudGl0eSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHVwZGF0ZSByZXNvdXJjZSBmcm9tIGEgZ2l2ZW4gZW50aXR5IGRhdGEqL1xyXG4gICAgcHVibGljIHVwZGF0ZShlbnRpdHk6IFQpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZVNlcnZpY2UudXBkYXRlKGVudGl0eSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHBhdGNoIHJlc291cmNlIGZyb20gYSBnaXZlbiBlbnRpdHkgZGF0YSovXHJcbiAgICBwdWJsaWMgcGF0Y2goZW50aXR5OiBUKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLnBhdGNoKGVudGl0eSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGRlbGV0ZSByZXNvdXJjZSBmcm9tIGEgZ2l2ZW4gZW50aXR5IGRhdGEqL1xyXG4gICAgcHVibGljIGRlbGV0ZShlbnRpdHk6IFQpOiBPYnNlcnZhYmxlPE9iamVjdD4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5kZWxldGUoZW50aXR5KTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHRvdGFsIG51bWJlciBvZiBlbGVtZW50cyBvZiByZXNvdXJjZSBhcnJheSAqL1xyXG4gICAgcHVibGljIHRvdGFsRWxlbWVudCgpOiBudW1iZXIge1xyXG4gICAgICAgIGlmICh0aGlzLnJlc291cmNlQXJyYXkgJiYgdGhpcy5yZXNvdXJjZUFycmF5LnRvdGFsRWxlbWVudHMpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlQXJyYXkudG90YWxFbGVtZW50cztcclxuICAgICAgICByZXR1cm4gMDtcclxuICAgIH1cclxuXHJcbiAgICAvKiogd2hldGhlciBhIHJlc291cmNlIGFycmF5IGhhcyBmaXJzdCBwYWdlIG9mIHJlc3VsdHMqL1xyXG4gICAgcHVibGljIGhhc0ZpcnN0KCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICh0aGlzLnJlc291cmNlQXJyYXkpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5oYXNGaXJzdCh0aGlzLnJlc291cmNlQXJyYXkpO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogd2hldGhlciBhIHJlc291cmNlIGFycmF5IGhhcyBuZXh0IHBhZ2Ugb2YgcmVzdWx0cyovXHJcbiAgICBwdWJsaWMgaGFzTmV4dCgpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAodGhpcy5yZXNvdXJjZUFycmF5KVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZVNlcnZpY2UuaGFzTmV4dCh0aGlzLnJlc291cmNlQXJyYXkpO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogd2hldGhlciBhIHJlc291cmNlIGFycmF5IGhhcyBwcmV2aW91cyBwYWdlIG9mIHJlc3VsdHMqL1xyXG4gICAgcHVibGljIGhhc1ByZXYoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKHRoaXMucmVzb3VyY2VBcnJheSlcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLmhhc1ByZXYodGhpcy5yZXNvdXJjZUFycmF5KTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHdoZXRoZXIgYSByZXNvdXJjZSBhcnJheSBoYXMgbGFzdCBwYWdlIG9mIHJlc3VsdHMqL1xyXG4gICAgcHVibGljIGhhc0xhc3QoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKHRoaXMucmVzb3VyY2VBcnJheSlcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLmhhc0xhc3QodGhpcy5yZXNvdXJjZUFycmF5KTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBhcnJheSBuZXh0IHBhZ2Ugb2YgcmVzdWx0cyovXHJcbiAgICBwdWJsaWMgbmV4dCgpOiBPYnNlcnZhYmxlPFRbXT4ge1xyXG4gICAgICAgIGlmICh0aGlzLnJlc291cmNlQXJyYXkpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5uZXh0KHRoaXMucmVzb3VyY2VBcnJheSwgdGhpcy50eXBlKS5waXBlKFxyXG4gICAgICAgICAgICAgICAgbWFwKChyZXNvdXJjZUFycmF5OiBSZXNvdXJjZUFycmF5PFQ+KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXNvdXJjZUFycmF5ID0gcmVzb3VyY2VBcnJheTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzb3VyY2VBcnJheS5yZXN1bHQ7XHJcbiAgICAgICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBvYnNlcnZhYmxlVGhyb3dFcnJvcignbm8gcmVzb3VyY2VBcnJheSBmb3VuZCcpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgcmVzb3VyY2UgYXJyYXkgcHJldmlvdXMgcGFnZSBvZiByZXN1bHRzKi9cclxuICAgIHB1YmxpYyBwcmV2KCk6IE9ic2VydmFibGU8VFtdPiB7XHJcbiAgICAgICAgaWYgKHRoaXMucmVzb3VyY2VBcnJheSlcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLnByZXYodGhpcy5yZXNvdXJjZUFycmF5LCB0aGlzLnR5cGUpLnBpcGUoXHJcbiAgICAgICAgICAgICAgICBtYXAoKHJlc291cmNlQXJyYXk6IFJlc291cmNlQXJyYXk8VD4pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlc291cmNlQXJyYXkgPSByZXNvdXJjZUFycmF5O1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNvdXJjZUFycmF5LnJlc3VsdDtcclxuICAgICAgICAgICAgICAgIH0pKTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIG9ic2VydmFibGVUaHJvd0Vycm9yKCdubyByZXNvdXJjZUFycmF5IGZvdW5kJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBhcnJheSBmaXJzdCBwYWdlIG9mIHJlc3VsdHMqL1xyXG4gICAgcHVibGljIGZpcnN0KCk6IE9ic2VydmFibGU8VFtdPiB7XHJcbiAgICAgICAgaWYgKHRoaXMucmVzb3VyY2VBcnJheSlcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTZXJ2aWNlLmZpcnN0KHRoaXMucmVzb3VyY2VBcnJheSwgdGhpcy50eXBlKVxyXG4gICAgICAgICAgICAgICAgLnBpcGUoXHJcbiAgICAgICAgICAgICAgICAgICAgbWFwKChyZXNvdXJjZUFycmF5OiBSZXNvdXJjZUFycmF5PFQ+KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVzb3VyY2VBcnJheSA9IHJlc291cmNlQXJyYXk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNvdXJjZUFycmF5LnJlc3VsdDtcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIG9ic2VydmFibGVUaHJvd0Vycm9yKCdubyByZXNvdXJjZUFycmF5IGZvdW5kJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBhcnJheSBsYXN0IHBhZ2Ugb2YgcmVzdWx0cyovXHJcbiAgICBwdWJsaWMgbGFzdCgpOiBPYnNlcnZhYmxlPFRbXT4ge1xyXG4gICAgICAgIGlmICh0aGlzLnJlc291cmNlQXJyYXkpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5sYXN0KHRoaXMucmVzb3VyY2VBcnJheSwgdGhpcy50eXBlKVxyXG4gICAgICAgICAgICAgICAgLnBpcGUoXHJcbiAgICAgICAgICAgICAgICAgICAgbWFwKChyZXNvdXJjZUFycmF5OiBSZXNvdXJjZUFycmF5PFQ+KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVzb3VyY2VBcnJheSA9IHJlc291cmNlQXJyYXk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNvdXJjZUFycmF5LnJlc3VsdDtcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIG9ic2VydmFibGVUaHJvd0Vycm9yKCdubyByZXNvdXJjZUFycmF5IGZvdW5kJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCByZXNvdXJjZSBhcnJheSBwYWdlIG9mIHJlc3VsdHMgZ2l2ZW4gYSBwYWdlIG51bWJlciovXHJcbiAgICBwdWJsaWMgcGFnZShwYWdlTnVtYmVyOiBudW1iZXIpOiBPYnNlcnZhYmxlPFRbXT4ge1xyXG4gICAgICAgIGlmICh0aGlzLnJlc291cmNlQXJyYXkpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU2VydmljZS5wYWdlKHRoaXMucmVzb3VyY2VBcnJheSwgdGhpcy50eXBlLCBwYWdlTnVtYmVyKS5waXBlKFxyXG4gICAgICAgICAgICAgICAgbWFwKChyZXNvdXJjZUFycmF5OiBSZXNvdXJjZUFycmF5PFQ+KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXNvdXJjZUFycmF5ID0gcmVzb3VyY2VBcnJheTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzb3VyY2VBcnJheS5yZXN1bHQ7XHJcbiAgICAgICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBvYnNlcnZhYmxlVGhyb3dFcnJvcignbm8gcmVzb3VyY2VBcnJheSBmb3VuZCcpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IFVzZXIgfSBmcm9tICcuLi91c2VyL3VzZXIubW9kZWwnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuXHJcblxyXG4vKiogQWNjb3VudCBtYW5hZ2VyIHNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgQWNjb3VudFNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxVc2VyPiB7XHJcbiAgXHJcblxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBBQ0NPVU5UX0FQSSA9ICdhY2NvdW50JztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoVXNlciwgXCJhY2NvdW50XCIsIGluamVjdG9yKTtcclxuICB9XHJcblxyXG4gIC8qKiBnZXQgbG9nZ2VkIGluIHVzZXIgYWNjb3VudCovXHJcbiAgZ2V0KCk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICByZXN1bHQgPSB0aGlzLmh0dHAuZ2V0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuQUNDT1VOVF9BUEkpKTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIGFjY291bnQqL1xyXG4gIHNhdmUoaXRlbTogYW55KTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuQUNDT1VOVF9BUEkpICwgaXRlbSk7XHJcblxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcblxyXG4gIC8qKiBjaGFuZ2UgbG9nZ2VkIGluIHVzZXIgYWNjb3VudCovICBcclxuICBjaGFuZ2VQYXNzd29yZChpdGVtOiBhbnkpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5BQ0NPVU5UX0FQSStcIi9jaGFuZ2UtcGFzc3dvcmRcIikgLCBpdGVtKTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG59XHJcbiIsImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZX0gZnJvbSAncnhqcy1jb21wYXQnO1xyXG5pbXBvcnQge1Jlc291cmNlU2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZS5zZXJ2aWNlJztcclxuLy9pbXBvcnQgKiBhcyBtb21lbnQgZnJvbSAnbW9tZW50JztcclxuXHJcbi8qKiBBdXRoZW50aWNhdGlvbiBzZXJ2aWNlKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgQXV0aFNlcnZpY2Uge1xyXG4gICAgXHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIEFVVEhfQVBJID0gJ2F1dGhlbnRpY2F0ZSc7XHJcblxyXG4gICAgLyoqIGNvbnN0cnVjdG9yKi9cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHByaXZhdGUgaHR0cDogSHR0cENsaWVudCxcclxuICAgICAgICBwcml2YXRlIHJlc291cmNlU2VydmljZTogUmVzb3VyY2VTZXJ2aWNlXHJcbiAgICApIHt9XHJcbiAgICBcclxuICAgIC8qKiBnZXQgY3VycmVudCB1c2VyIGp3dCB0b2tlbiBmcm9tIHNlc3Npb24gc3RvcmFnZSovXHJcbiAgICBnZXRUb2tlbigpIHtcclxuICAgICAgICByZXR1cm4gIHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ2F1dGhlbnRpY2F0aW9uVG9rZW4nKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogbG9naW4gb3BlcmF0aW9uICovXHJcbiAgICBsb2dpbihjcmVkZW50aWFscyk6IE9ic2VydmFibGU8YW55PiB7XHJcblxyXG4gICAgICAgIGNvbnN0IGRhdGEgPSB7XHJcbiAgICAgICAgICAgIHVzZXJuYW1lOiBjcmVkZW50aWFscy51c2VybmFtZSxcclxuICAgICAgICAgICAgcGFzc3dvcmQ6IGNyZWRlbnRpYWxzLnBhc3N3b3JkXHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5BVVRIX0FQSSksIGRhdGEsIHtvYnNlcnZlIDogJ3Jlc3BvbnNlJ30pLm1hcChhdXRoZW50aWNhdGVTdWNjZXNzLmJpbmQodGhpcykpO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBhdXRoZW50aWNhdGVTdWNjZXNzKHJlc3ApIHtcclxuICAgICAgICAgICAgaWYgKHJlc3Aub2spIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGp3dCA9IHJlc3AuYm9keS5pZF90b2tlbjtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RvcmVBdXRoZW50aWNhdGlvblRva2VuKGp3dCk7XHJcbiAgICAgICAgICAgICAgICAvL2NvbnN0IGV4cGlyZXNBdCA9IG1vbWVudCgpLmFkZCggcmVzcC5oZWFkZXJzLmdldCgnVG9rZW4tVmFsaWRpdHknKSwnbWlsaXNlY29uZCcpO1xyXG4gICAgICAgICAgICAgICAgLy9zZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCdleHBpcmVzX2F0JywgSlNPTi5zdHJpbmdpZnkoZXhwaXJlc0F0LnZhbHVlT2YoKSkpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGp3dDtcclxuICAgICAgICAgICAgfSAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKiogbG9naW4gb3BlcmF0aW9uIHdpdGggand0IHRva2VuICovXHJcbiAgICBsb2dpbldpdGhUb2tlbihqd3QpIHtcclxuICAgICAgICBpZiAoand0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RvcmVBdXRoZW50aWNhdGlvblRva2VuKGp3dCk7XHJcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoand0KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoJ2F1dGgtand0LXNlcnZpY2UgUHJvbWlzZSByZWplY3QnKTsgLy8gUHV0IGFwcHJvcHJpYXRlIGVycm9yIG1lc3NhZ2UgaGVyZVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKiogc3RvcmUgand0IHRva2VuIGluIHNlc3Npb24gc3RvcmFnZSovXHJcbiAgICBzdG9yZUF1dGhlbnRpY2F0aW9uVG9rZW4oand0KSB7XHJcbiAgICAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCdhdXRoZW50aWNhdGlvblRva2VuJywgand0KTtcclxuICAgICAgICBcclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoqIGNoZWNrIHdoZXRoZXIgY3VycmVudCB1c2VyIGlzIGxvZ2dlZCBpbiovXHJcbiAgICBwdWJsaWMgaXNMb2dnZWRJbigpIHtcclxuICAgICAgICAvL3JldHVybiBtb21lbnQoKS5pc0JlZm9yZSh0aGlzLmdldEV4cGlyYXRpb24oKSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0VG9rZW4oKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoqIGNoZWNrIHdoZXRoZXIgY3VycmVudCB1c2VyIGlzIGxvZ2dlZCBvdXQqL1xyXG4gICAgaXNMb2dnZWRPdXQoKSB7XHJcbiAgICAgICAgcmV0dXJuICF0aGlzLmlzTG9nZ2VkSW4oKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogbG9nb3V0IG9wZXJhdGlvbiAqL1xyXG4gICAgbG9nb3V0KCk6IE9ic2VydmFibGU8YW55PiB7XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZSgob2JzZXJ2ZXIpID0+IHtcclxuICAgICAgICAgICAgLy9sb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgnYXV0aGVudGljYXRpb25Ub2tlbicpO1xyXG4gICAgICAgICAgICBzZXNzaW9uU3RvcmFnZS5yZW1vdmVJdGVtKCdhdXRoZW50aWNhdGlvblRva2VuJyk7XHJcbiAgICAgICAgICAgIC8vc2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbSgnZXhwaXJlc19hdCcpO1xyXG4gICAgICAgICAgICBvYnNlcnZlci5jb21wbGV0ZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBcclxufVxyXG4iLCJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IEh0dHBJbnRlcmNlcHRvciwgSHR0cFJlcXVlc3QsIEh0dHBIYW5kbGVyLCBIdHRwRXZlbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcblxyXG4vKiogSW50ZXJjZXB0b3IgZm9yIGF1dGhlbnRpY2F0aW9uIHRva2VuIGluIEFQSSByZXF1ZXN0cyAqL1xyXG5leHBvcnQgY2xhc3MgQXV0aEludGVyY2VwdG9yIGltcGxlbWVudHMgSHR0cEludGVyY2VwdG9yIHtcclxuXHJcbiAgICAvKiogY29uc3RydWN0b3IqL1xyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICApIHtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoqIHJlcXVlc3QgaGFuZGxlciAqL1xyXG4gICAgaW50ZXJjZXB0KHJlcXVlc3Q6IEh0dHBSZXF1ZXN0PGFueT4sIG5leHQ6IEh0dHBIYW5kbGVyKTogT2JzZXJ2YWJsZTxIdHRwRXZlbnQ8YW55Pj4ge1xyXG5cclxuICAgICAgICBjb25zdCB0b2tlbiA9IHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ2F1dGhlbnRpY2F0aW9uVG9rZW4nKTtcclxuICAgICAgICBpZiAoISF0b2tlbikge1xyXG4gICAgICAgICAgICByZXF1ZXN0ID0gcmVxdWVzdC5jbG9uZSh7XHJcbiAgICAgICAgICAgICAgICBzZXRIZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgQXV0aG9yaXphdGlvbjogJ0JlYXJlciAnICsgdG9rZW5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuZXh0LmhhbmRsZShyZXF1ZXN0KTtcclxuICAgIH1cclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBTdWJqZWN0LCBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IEFjY291bnRTZXJ2aWNlIH0gZnJvbSAnLi4vYWNjb3VudC9hY2NvdW50LnNlcnZpY2UnO1xyXG5cclxuLyoqIFByaW5jaXBhbCBzZXJ2aWNlKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgUHJpbmNpcGFsIHtcclxuICAgIHByaXZhdGUgdXNlcklkZW50aXR5OiBhbnk7XHJcbiAgICBwcml2YXRlIGF1dGhlbnRpY2F0ZWQgPSBmYWxzZTtcclxuICAgIHByaXZhdGUgYXV0aGVudGljYXRpb25TdGF0ZSA9IG5ldyBTdWJqZWN0PGFueT4oKTtcclxuXHJcbiAgICAvKiogY29uc3RydWN0b3IgKi9cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHByaXZhdGUgYWNjb3VudDogQWNjb3VudFNlcnZpY2VcclxuICAgICkge31cclxuXHJcbiAgICAvKiogYXV0aGVudGljYXRlIHdpdGggZ2l2ZW4gaWRlbnRpdHkqL1xyXG4gICAgYXV0aGVudGljYXRlKGlkZW50aXR5KSB7XHJcbiAgICAgICAgdGhpcy51c2VySWRlbnRpdHkgPSBpZGVudGl0eTtcclxuICAgICAgICB0aGlzLmF1dGhlbnRpY2F0ZWQgPSBpZGVudGl0eSAhPT0gbnVsbDtcclxuICAgICAgICB0aGlzLmF1dGhlbnRpY2F0aW9uU3RhdGUubmV4dCh0aGlzLnVzZXJJZGVudGl0eSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGNoZWNrIHdoZXRoZXIgY3VycmVudCB1c2VyIGhhcyBhbnkgb2YgdGhlIGdpdmVuIGF1dGhvcml0aWVzICovXHJcbiAgICBoYXNBbnlBdXRob3JpdHkoYXV0aG9yaXRpZXM6IHN0cmluZ1tdKTogUHJvbWlzZTxib29sZWFuPiB7XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzLmhhc0FueUF1dGhvcml0eURpcmVjdChhdXRob3JpdGllcykpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBjaGVjayB3aGV0aGVyIGN1cnJlbnQgdXNlciBoYXMgYW55IG9mIHRoZSBnaXZlbiBhdXRob3JpdGllcyBvbiB0aGUgZ2l2ZW4gdGVycml0b3J5ICovXHJcbiAgICBoYXNBbnlBdXRob3JpdHlPblRlcnJpdG9yeShhdXRob3JpdGllczogc3RyaW5nW10sdGVycml0b3J5OiBzdHJpbmcgKTogUHJvbWlzZTxib29sZWFuPiB7XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzLmhhc0FueUF1dGhvcml0eURpcmVjdE9uVGVycml0b3J5KGF1dGhvcml0aWVzLHRlcnJpdG9yeSkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBjaGVjayB3aGV0aGVyIGN1cnJlbnQgdXNlciBoYXMgYW55IG9mIHRoZSBnaXZlbiBhdXRob3JpdGllcyB3aXRob3V0IHJlc29sdmluZyBwcm9taXNlcyovXHJcbiAgICBoYXNBbnlBdXRob3JpdHlEaXJlY3QoYXV0aG9yaXRpZXM6IHN0cmluZ1tdKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmF1dGhlbnRpY2F0ZWQgfHwgIXRoaXMudXNlcklkZW50aXR5IHx8ICF0aGlzLnVzZXJJZGVudGl0eS5hdXRob3JpdGllcykge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGF1dGhvcml0aWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnVzZXJJZGVudGl0eS5hdXRob3JpdGllcy5pbmNsdWRlcyhhdXRob3JpdGllc1tpXSkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGNoZWNrIHdoZXRoZXIgY3VycmVudCB1c2VyIGhhcyBhbnkgb2YgdGhlIGdpdmVuIGF1dGhvcml0aWVzIG9uIHRoZSBnaXZlbiB0ZXJyaXRvcnkgd2l0aG91dCByZXNvbHZpbmcgcHJvbWlzZXMgKi9cclxuICAgIGhhc0FueUF1dGhvcml0eURpcmVjdE9uVGVycml0b3J5KGF1dGhvcml0aWVzOiBzdHJpbmdbXSx0ZXJyaXRvcnk6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICghdGhpcy5hdXRoZW50aWNhdGVkIHx8ICF0aGlzLnVzZXJJZGVudGl0eSB8fCAhdGhpcy51c2VySWRlbnRpdHkuYXV0aG9yaXRpZXMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhdXRob3JpdGllcy5sZW5ndGg7IGkrKykge1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMudXNlcklkZW50aXR5LmF1dGhvcml0aWVzUGVyVGVycml0b3J5W3RlcnJpdG9yeV0gJiYgdGhpcy51c2VySWRlbnRpdHkuYXV0aG9yaXRpZXNQZXJUZXJyaXRvcnlbdGVycml0b3J5XS5pbmNsdWRlcyhhdXRob3JpdGllc1tpXSkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGNoZWNrIHdoZXRoZXIgY3VycmVudCB1c2VyIGhhcyB0aGUgZ2l2ZW4gYXV0aG9yaXR5ICovXHJcbiAgICBoYXNBdXRob3JpdHkoYXV0aG9yaXR5OiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+IHtcclxuICAgICAgICBpZiAoIXRoaXMuYXV0aGVudGljYXRlZCkge1xyXG4gICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoZmFsc2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaWRlbnRpdHkoKS50aGVuKChpZCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGlkLmF1dGhvcml0aWVzICYmIGlkLmF1dGhvcml0aWVzLmluY2x1ZGVzKGF1dGhvcml0eSkpO1xyXG4gICAgICAgIH0sICgpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShmYWxzZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGNoZWNrIHdoZXRoZXIgY3VycmVudCB1c2VyIGhhcyB0aGUgZ2l2ZW4gYXV0aG9yaXR5IG9uIHRoZSBnaXZlbiB0ZXJyaXRvcnkqL1xyXG4gICAgaGFzQXV0aG9yaXR5T25UZXJyaXRvcnkoYXV0aG9yaXR5OiBzdHJpbmcsdGVycml0b3J5OiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+IHtcclxuICAgICAgICBpZiAoIXRoaXMuYXV0aGVudGljYXRlZCkge1xyXG4gICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoZmFsc2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaWRlbnRpdHkoKS50aGVuKChpZCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGlkLmF1dGhvcml0aWVzUGVyVGVycml0b3J5ICYmIGlkLmF1dGhvcml0aWVzUGVyVGVycml0b3J5W3RlcnJpdG9yeV0gJiYgaWQuYXV0aG9yaXRpZXNQZXJUZXJyaXRvcnlbdGVycml0b3J5XS5pbmNsdWRlcyhhdXRob3JpdHkpKTtcclxuICAgICAgICB9LCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoZmFsc2UpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBjaGVjayB1c2VyIGlkZW50aXR5Ki9cclxuICAgIGlkZW50aXR5KGZvcmNlPzogYm9vbGVhbik6IFByb21pc2U8YW55PiB7XHJcbiAgICAgICAgaWYgKGZvcmNlID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIHRoaXMudXNlcklkZW50aXR5ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gY2hlY2sgYW5kIHNlZSBpZiB3ZSBoYXZlIHJldHJpZXZlZCB0aGUgdXNlcklkZW50aXR5IGRhdGEgZnJvbSB0aGUgc2VydmVyLlxyXG4gICAgICAgIC8vIGlmIHdlIGhhdmUsIHJldXNlIGl0IGJ5IGltbWVkaWF0ZWx5IHJlc29sdmluZ1xyXG4gICAgICAgIGlmICh0aGlzLnVzZXJJZGVudGl0eSkge1xyXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMudXNlcklkZW50aXR5KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHJldHJpZXZlIHRoZSB1c2VySWRlbnRpdHkgZGF0YSBmcm9tIHRoZSBzZXJ2ZXIsIHVwZGF0ZSB0aGUgaWRlbnRpdHkgb2JqZWN0LCBhbmQgdGhlbiByZXNvbHZlLlxyXG4gICAgICAgIHJldHVybiB0aGlzLmFjY291bnQuZ2V0KCkudG9Qcm9taXNlKCkudGhlbigocmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgYWNjb3VudCA9IHJlc3BvbnNlO1xyXG4gICAgICAgICAgICBpZiAoYWNjb3VudCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy51c2VySWRlbnRpdHkgPSBhY2NvdW50O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hdXRoZW50aWNhdGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudXNlcklkZW50aXR5ID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXV0aGVudGljYXRlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuYXV0aGVudGljYXRpb25TdGF0ZS5uZXh0KHRoaXMudXNlcklkZW50aXR5KTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudXNlcklkZW50aXR5O1xyXG4gICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcclxuICAgICAgICAgICAgdGhpcy51c2VySWRlbnRpdHkgPSBudWxsO1xyXG4gICAgICAgICAgICB0aGlzLmF1dGhlbnRpY2F0ZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5hdXRoZW50aWNhdGlvblN0YXRlLm5leHQodGhpcy51c2VySWRlbnRpdHkpO1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogY2hlY2sgd2hldGhlciBjdXJyZW50IHVzZXIgaXMgYXV0aGVudGljYXRlZCAqL1xyXG4gICAgaXNBdXRoZW50aWNhdGVkKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmF1dGhlbnRpY2F0ZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGNoZWNrIHdoZXRoZXIgY3VycmVudCB1c2VyIGlkZW50aXR5IGlzIHJlc29sdmVkICovXHJcbiAgICBpc0lkZW50aXR5UmVzb2x2ZWQoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudXNlcklkZW50aXR5ICE9PSB1bmRlZmluZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCBjdXJyZW50IHVzZXIgYXV0aGVudGljYXRpb24gc3RhdGUgKi9cclxuICAgIGdldEF1dGhlbnRpY2F0aW9uU3RhdGUoKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hdXRoZW50aWNhdGlvblN0YXRlLmFzT2JzZXJ2YWJsZSgpO1xyXG4gICAgfVxyXG5cclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgSW5qZWN0b3IsIEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cEludGVyY2VwdG9yLCBIdHRwUmVxdWVzdCwgSHR0cEhhbmRsZXIsIEh0dHBFdmVudCwgSHR0cEVycm9yUmVzcG9uc2UgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgQXV0aFNlcnZpY2UgfSBmcm9tICcuL2F1dGguc2VydmljZSc7XHJcbmltcG9ydCB7IEFjdGl2YXRlZFJvdXRlLCBSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xyXG5pbXBvcnQgeyBQcmluY2lwYWwgfSBmcm9tICcuL3ByaW5jaXBhbC5zZXJ2aWNlJztcclxuXHJcbi8qKiBJbnRlcmNlcHRvciBmb3IgYXV0aGVudGljYXRpb24gZXhwaXJlZCByZXNwb25zZSBpbiBBUEkgcmVxdWVzdHMgKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgQXV0aEV4cGlyZWRJbnRlcmNlcHRvciBpbXBsZW1lbnRzIEh0dHBJbnRlcmNlcHRvciB7XHJcblxyXG4gICAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBwcml2YXRlIHJvdXRlcjogUm91dGVyLCAgICAgXHJcbiAgICAgICAgcHJpdmF0ZSBhdXRoU2VydmljZTogQXV0aFNlcnZpY2UsIFxyXG4gICAgICAgIHByaXZhdGUgcHJpbmNpcGFsOiBQcmluY2lwYWxcclxuICAgICkge31cclxuXHJcbiAgICAvKiogcmVxdWVzdCBoYW5kbGVyICovXHJcbiAgICBpbnRlcmNlcHQocmVxdWVzdDogSHR0cFJlcXVlc3Q8YW55PiwgbmV4dDogSHR0cEhhbmRsZXIpOiBPYnNlcnZhYmxlPEh0dHBFdmVudDxhbnk+PiB7XHJcbiAgICAgICAgcmV0dXJuIG5leHQuaGFuZGxlKHJlcXVlc3QpLmRvKChldmVudDogSHR0cEV2ZW50PGFueT4pID0+IHt9LCAoZXJyOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgaW50ZXJjZXB0OiBib29sZWFuID0gcmVxdWVzdC51cmwuaW5kZXhPZihcIi9hcGkvXCIpICE9IC0xO1xyXG4gICAgICAgICAgICAvL3RyYWN0ZW0gcmVxdWVzdFxyXG4gICAgICAgICAgICBpZiAoaW50ZXJjZXB0KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZXJyIGluc3RhbmNlb2YgSHR0cEVycm9yUmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZXJyLnN0YXR1cyA9PT0gNDAxKSB7ICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hdXRoU2VydmljZS5sb2dvdXQoKS5zdWJzY3JpYmUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcmluY2lwYWwuYXV0aGVudGljYXRlKG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbJy8nXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBBdXRoU2VydmljZSB9IGZyb20gJy4vYXV0aC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgUHJpbmNpcGFsIH0gZnJvbSAnLi9wcmluY2lwYWwuc2VydmljZSc7XHJcblxyXG4vKiogTG9naW4gc2VydmljZSovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIExvZ2luU2VydmljZSB7XHJcbiAgICBcclxuICAgIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgcHJpdmF0ZSBhdXRoU2VydmVyUHJvdmlkZXI6IEF1dGhTZXJ2aWNlLCBcclxuICAgICAgICBwcml2YXRlIHByaW5jaXBhbDogUHJpbmNpcGFsXHJcbiAgICApIHt9XHJcblxyXG4gICAgLyoqTG9naW4gb3BlcmF0aW9uKi9cclxuICAgIGxvZ2luKGNyZWRlbnRpYWxzLCBjYWxsYmFjaz8pIHtcclxuICAgICAgICBjb25zdCBjYiA9IGNhbGxiYWNrIHx8IGZ1bmN0aW9uKCkge307XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuYXV0aFNlcnZlclByb3ZpZGVyLmxvZ2luKGNyZWRlbnRpYWxzKS5zdWJzY3JpYmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMucHJpbmNpcGFsLmlkZW50aXR5KHRydWUpLnRoZW4oKGFjY291bnQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBBZnRlciB0aGUgbG9naW4gdGhlIGxhbmd1YWdlIHdpbGwgYmUgY2hhbmdlZCB0b1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHRoZSBsYW5ndWFnZSBzZWxlY3RlZCBieSB0aGUgdXNlciBkdXJpbmcgaGlzIHJlZ2lzdHJhdGlvblxyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY2IoKTtcclxuICAgICAgICAgICAgfSwgKGVycikgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2dvdXQoKTtcclxuICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNiKGVycik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgLyoqbG9naW4gd2l0aCBqd3QgdG9rZW4gKi9cclxuICAgIGxvZ2luV2l0aFRva2VuKGp3dCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmF1dGhTZXJ2ZXJQcm92aWRlci5sb2dpbldpdGhUb2tlbihqd3QpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBsb2dvdXQgb3BlcmF0aW9uICovXHJcbiAgICBsb2dvdXQoKSB7XHJcbiAgICAgICB0aGlzLmF1dGhTZXJ2ZXJQcm92aWRlci5sb2dvdXQoKS5zdWJzY3JpYmUoKTtcclxuICAgICAgIHRoaXMucHJpbmNpcGFsLmF1dGhlbnRpY2F0ZShudWxsKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7UmVzb3VyY2VTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlLnNlcnZpY2UnO1xyXG5cclxuQEluamVjdGFibGUoe1xyXG4gIHByb3ZpZGVkSW46ICdyb290J1xyXG59KVxyXG5leHBvcnQgY2xhc3MgRGFzaGJvYXJkU2VydmljZXtcclxuXHJcbiAgICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICAgIHB1YmxpYyBEQVNIQk9BUkRfQVBJID0gJ2Rhc2hib2FyZC9pbmZvJztcclxuICAgIHB1YmxpYyBEQVNIQk9BUkRfRU1CRURERUQ9ICdkYXNoYm9hcmQnO1xyXG4gICAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgICBjb25zdHJ1Y3RvciggICAgICAgXHJcbiAgICAgIHByaXZhdGUgaHR0cDogSHR0cENsaWVudCxcclxuICAgICAgcHJpdmF0ZSByZXNvdXJjZVNlcnZpY2U6IFJlc291cmNlU2VydmljZSkge1xyXG4gICAgfVxyXG4gIFxyXG4gICAgLyoqIGdldCBhbGwga3BpICovXHJcbiAgICBnZXRBbGwoKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5EQVNIQk9BUkRfQVBJKSkubWFwKHJlc3BvbnNlID0+IHJlc3BvbnNlW3RoaXMuREFTSEJPQVJEX0VNQkVEREVEXSk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBVc2VyIH0gZnJvbSAnLi91c2VyLm1vZGVsJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5cclxuLyoqIFVzZXIgbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFVzZXJTZXJ2aWNlIGV4dGVuZHMgUmVzdFNlcnZpY2U8VXNlcj4ge1xyXG4gIFxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBVU0VSX0FQSSA9J3VzZXJzJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoVXNlciwgXCJ1c2Vyc1wiLCBpbmplY3Rvcik7XHJcbiAgfVxyXG4gIFxyXG4gIC8qKiByZW1vdmUgdXNlciovXHJcbiAgcmVtb3ZlKGl0ZW06IFVzZXIpIHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKGl0ZW0uX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgIFxyXG4gIH1cclxuICBcclxuICAvKiogc2F2ZSB1c2VyKi9cclxuICBzYXZlKGl0ZW06IGFueSk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICBpZiAoaXRlbS5fbGlua3MhPW51bGwpIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5VU0VSX0FQSSkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gICAgXHJcbiAgLyoqIGNoYW5nZSBwYXNzd29yZCBvIGdpdmVuIHVzZXIgaWQgKi9cclxuICBjaGFuZ2VQYXNzd29yZChpZCxpdGVtOiBhbnkpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5VU0VSX0FQSStcIi9cIitpZCtcIi9jaGFuZ2UtcGFzc3dvcmRcIikgLCBpdGVtKTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG5pbXBvcnQgeyBUZXJyaXRvcnkgfSBmcm9tICcuLi90ZXJyaXRvcnkvdGVycml0b3J5Lm1vZGVsJztcclxuaW1wb3J0IHsgVXNlciB9IGZyb20gJy4vdXNlci5tb2RlbCc7XHJcbi8qKlxyXG4gKiBVc2VyIHBvc2l0aW9uIG1vZGVsXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgVXNlclBvc2l0aW9uIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiBuYW1lICovXHJcbiAgcHVibGljIG5hbWU6IHN0cmluZztcclxuICAvKiogZW1haWwgKi9cclxuICBwdWJsaWMgZW1haWw6IHN0cmluZztcclxuICAvKiogb3JnYW5pemF0aW9uIG5hbWUqL1xyXG4gIHB1YmxpYyBvcmdhbml6YXRpb246IHN0cmluZztcclxuICAvKiogc3lzdGVtIGNyZWF0ZWQgZGF0ZSovXHJcbiAgcHVibGljIGNyZWF0ZWREYXRlOiBhbnk7XHJcbiAgLyoqIHN5c3RlbSBkYXRlZCBkYXRlKi9cclxuICBwdWJsaWMgZGF0ZWREYXRlOiBhbnk7XHJcbiAgLyoqIHBvc2l0aW9uIHRlcnJpdG9yeSovXHJcbiAgcHVibGljIHRlcnJpdG9yeTogVGVycml0b3J5O1xyXG4gIC8qKiB1c2VyKi9cclxuICBwdWJsaWMgdXNlcjogVXNlcjtcclxufVxyXG4iLCJpbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcbmltcG9ydCB7IFVzZXJQb3NpdGlvbiB9IGZyb20gJy4vdXNlci1wb3NpdGlvbi5tb2RlbCc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuXHJcbi8qKiBVc2VyIHBvc2l0aW9uIG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBVc2VyUG9zaXRpb25TZXJ2aWNlICBleHRlbmRzIFJlc3RTZXJ2aWNlPFVzZXJQb3NpdGlvbj4ge1xyXG4gIFxyXG5cclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgVVNFUl9QT1NJVElPTl9BUEkgPSAndXNlci1wb3NpdGlvbnMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihVc2VyUG9zaXRpb24sIFwidXNlci1wb3NpdGlvbnNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIHVzZXIgcG9zaXRpb24qL1xyXG4gIHJlbW92ZShpdGVtOiBVc2VyUG9zaXRpb24pIHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKGl0ZW0uX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgIFxyXG4gIH1cclxuICBcclxuICAvKiogc2F2ZSB1c2VyIHBvc2l0aW9uKi9cclxuICBzYXZlKGl0ZW06IGFueSk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICBpZiAoaXRlbS5fbGlua3MhPW51bGwpIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgICBpZiAoaXRlbS51c2VyICE9bnVsbCl7XHJcbiAgICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbigndXNlcicsaXRlbS51c2VyKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgXHJcbiAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoaXRlbS50ZXJyaXRvcnkgIT1udWxsKXtcclxuICAgICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCd0ZXJyaXRvcnknLGl0ZW0udGVycml0b3J5KS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgXHJcbiAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaXRlbS50ZXJyaXRvcnkgPSBpdGVtLnRlcnJpdG9yeS5fbGlua3Muc2VsZi5ocmVmO1xyXG4gICAgICBpdGVtLnVzZXIgPSBpdGVtLnVzZXIuX2xpbmtzLnNlbGYuaHJlZjtcclxuICBcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5VU0VSX1BPU0lUSU9OX0FQSSkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG5pbXBvcnQgeyBSb2xlIH0gZnJvbSAnLi4vcm9sZS9yb2xlLm1vZGVsJztcclxuaW1wb3J0IHsgVGVycml0b3J5IH0gZnJvbSAnLi4vdGVycml0b3J5L3RlcnJpdG9yeS5tb2RlbCc7XHJcbmltcG9ydCB7IFVzZXIgfSBmcm9tICcuL3VzZXIubW9kZWwnO1xyXG5cclxuLyoqXHJcbiAqIFVzZXIgcGVybWlzc2lvbiBtb2RlbFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFVzZXJDb25maWd1cmF0aW9uIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiByb2xlICovICBcclxuICBwdWJsaWMgcm9sZTogUm9sZTtcclxuXHJcbiAgLyoqIHJvbGUgQ2hpbGRyZW4gKi8gIFxyXG4gIHB1YmxpYyByb2xlQ2hpbGRyZW46IFJvbGU7XHJcbiAgXHJcbiAgLyoqIHRlcnJpdG9yeSAqLyBcclxuICBwdWJsaWMgdGVycml0b3J5OiBUZXJyaXRvcnk7XHJcbiAgLyoqIHVzZXIgKi9cclxuICBwdWJsaWMgdXNlcjogVXNlcjtcclxufVxyXG4iLCJpbXBvcnQgeyBSZXN0U2VydmljZSB9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgVXNlckNvbmZpZ3VyYXRpb24gfSBmcm9tICcuL3VzZXItY29uZmlndXJhdGlvbi5tb2RlbCc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuXHJcbi8qKiBVc2VyIGNvbmZpZ3VyYXRpb24gbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFVzZXJDb25maWd1cmF0aW9uU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPFVzZXJDb25maWd1cmF0aW9uPiB7XHJcblxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBVU0VSX0NPTkZJR1VSQVRJT05fQVBJID0gJ3VzZXItY29uZmlndXJhdGlvbnMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IsIHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoVXNlckNvbmZpZ3VyYXRpb24sIFwidXNlci1jb25maWd1cmF0aW9uc1wiLCBpbmplY3Rvcik7XHJcbiAgfVxyXG5cclxuICAvKiogcmVtb3ZlIHVzZXIgY29uZmlndXJhdGlvbiovXHJcbiAgcmVtb3ZlKGl0ZW06IFVzZXJDb25maWd1cmF0aW9uKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG5cclxuICB9XHJcblxyXG4gIC8qKiBzYXZlIHVzZXIgY29uZmlndXJhdGlvbiovXHJcbiAgc2F2ZShpdGVtOiBhbnkpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzICE9IG51bGwpIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaXRlbS50ZXJyaXRvcnkgPSBpdGVtLnRlcnJpdG9yeS5fbGlua3Muc2VsZi5ocmVmO1xyXG4gICAgICBpdGVtLnJvbGUgPSBpdGVtLnJvbGUhPW51bGw/aXRlbS5yb2xlLl9saW5rcy5zZWxmLmhyZWY6bnVsbDtcclxuICAgICAgaXRlbS51c2VyID0gaXRlbS51c2VyLl9saW5rcy5zZWxmLmhyZWY7XHJcbiAgICAgIGl0ZW0ucm9sZUNoaWxkcmVuID0gaXRlbS5yb2xlQ2hpbGRyZW4hPW51bGw/aXRlbS5yb2xlQ2hpbGRyZW4uX2xpbmtzLnNlbGYuaHJlZjpudWxsO1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLlVTRVJfQ09ORklHVVJBVElPTl9BUEkpLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG5cclxufVxyXG4iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuaW1wb3J0IHsgVGVycml0b3J5R3JvdXBUeXBlIH0gZnJvbSAnLi90ZXJyaXRvcnktZ3JvdXAtdHlwZS5tb2RlbCc7XHJcbmltcG9ydCB7IFRlcnJpdG9yeVR5cGUgfSBmcm9tICcuL3RlcnJpdG9yeS10eXBlLm1vZGVsJztcclxuXHJcbi8qKlxyXG4gKiBUZXJyaXRvcnkgbW9kZWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBUZXJyaXRvcnkgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgLyoqIGlkICovXHJcbiAgcHVibGljIGlkOiBudW1iZXI7ICBcclxuICAvKiogY29kZSAqL1xyXG4gIHB1YmxpYyBjb2RlOiBzdHJpbmc7XHJcbiAgLyoqIG5hbWUgKi9cclxuICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG4gIC8qKiBhZGRyZXNzKi9cclxuICBwdWJsaWMgdGVycml0b3JpYWxBdXRob3JpdHlBZGRyZXNzOiBzdHJpbmc7XHJcbiAgLyoqIGFkbWluICovXHJcbiAgcHVibGljIHRlcnJpdG9yaWFsQXV0aG9yaXR5TmFtZTogc3RyaW5nO1xyXG4gIC8qKiB3aGV0aGVyIHRlcnJpdG9yeSBpcyBibG9ja2VkKi9cclxuICBwdWJsaWMgYmxvY2tlZDogYm9vbGVhbjtcclxuICAvKiogY29tbWVudHMqL1xyXG4gIHB1YmxpYyBub3RlOiBzdHJpbmc7XHJcbiAgLyoqIHN5c3RlbSBjcmVhdGVkIGRhdGUqL1xyXG4gIHB1YmxpYyBjcmVhdGVkRGF0ZTogYW55O1xyXG4gIC8qKiBjb250YWN0IGVtYWlsICovICBcclxuICBwdWJsaWMgdGVycml0b3JpYWxBdXRob3JpdHlFbWFpbDogc3RyaW5nO1xyXG4gIC8qKiBleHRlbnNpb24gKi9cclxuICBwdWJsaWMgZXh0ZW50OiBzdHJpbmc7XHJcbiAgLyoqIGxvZ28gaW1hZ2UgVVJMICovXHJcbiAgcHVibGljIHRlcnJpdG9yaWFsQXV0aG9yaXR5TG9nbzogc3RyaW5nO1xyXG4gIC8qKiBjb250YWN0IG9yZ2FuaXphdGlvbiBuYW1lICovXHJcbiAgLy8gcHVibGljIG9yZ2FuaXphdGlvbk5hbWU6IHN0cmluZztcclxuICAvKiogc2NvcGUqL1xyXG4gIHB1YmxpYyBzY29wZTogc3RyaW5nO1xyXG4gIC8qKiB0eXBlICovICBcclxuICBwdWJsaWMgdHlwZTogVGVycml0b3J5VHlwZTtcclxuICAvKiogZ3JvdXAgdHlwZSAqL1xyXG4gIHB1YmxpYyBncm91cFR5cGU6IFRlcnJpdG9yeUdyb3VwVHlwZTtcclxuICAvKiogdGVycml0b3J5IG1lbWJlcnMqL1xyXG4gIHB1YmxpYyBtZW1iZXJzOiBUZXJyaXRvcnlbXTtcclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgVGVycml0b3J5IH0gZnJvbSAnLi90ZXJyaXRvcnkubW9kZWwnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IFJlc3RTZXJ2aWNlIH0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5cclxuLyoqIFRlcnJpdG9yeSBtYW5hZ2VyIHNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgVGVycml0b3J5U2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPFRlcnJpdG9yeT4ge1xyXG5cclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgVEVSUklUT1JZX0FQSSA9ICd0ZXJyaXRvcmllcyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3RvciwgcHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihUZXJyaXRvcnksIFwidGVycml0b3JpZXNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuXHJcbiAgLyoqIHJlbW92ZSB0ZXJyaXRvcnkqL1xyXG4gIHJlbW92ZShpdGVtOiBUZXJyaXRvcnkpIHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKGl0ZW0uX2xpbmtzLnNlbGYuaHJlZik7XHJcblxyXG4gIH1cclxuXHJcbiAgLyoqIHNhdmUgdGVycml0b3J5Ki9cclxuICBzYXZlKGl0ZW06IFRlcnJpdG9yeSk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcblxyXG4gICAgbGV0IHRlcnJpdG9yeUdyb3VwVHlwZTphbnkgPSB7fVxyXG4gICAgdGVycml0b3J5R3JvdXBUeXBlLl9saW5rcyA9IHt9O1xyXG4gICAgdGVycml0b3J5R3JvdXBUeXBlLl9saW5rcy5zZWxmID0ge307XHJcbiAgICB0ZXJyaXRvcnlHcm91cFR5cGUuX2xpbmtzLnNlbGYuaHJlZiA9IFwiXCI7XHJcblxyXG4gICAgbGV0IHRlcnJpdG9yeVR5cGU6YW55ID0ge31cclxuICAgIHRlcnJpdG9yeVR5cGUuX2xpbmtzID0ge307XHJcbiAgICB0ZXJyaXRvcnlUeXBlLl9saW5rcy5zZWxmID0ge307XHJcbiAgICB0ZXJyaXRvcnlUeXBlLl9saW5rcy5zZWxmLmhyZWYgPSBcIlwiO1xyXG5cclxuICAgIGlmIChpdGVtLnR5cGUgIT0gbnVsbCkge1xyXG4gICAgICB0ZXJyaXRvcnlUeXBlID0gaXRlbS50eXBlO1xyXG4gICAgICBpZiAodHlwZW9mIGl0ZW0udHlwZS5fbGlua3MgIT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICBpdGVtLnR5cGUgPSBpdGVtLnR5cGUuX2xpbmtzLnNlbGYuaHJlZjtcclxuICAgICAgfSBcclxuICAgIH1cclxuXHJcbiAgICBpZiAoaXRlbS5fbGlua3MgIT0gbnVsbCkge1xyXG4gICAgICAvL3VwZGF0ZSByZWxhdGlvbnNcclxuICAgICAgZGVsZXRlIGl0ZW0uZ3JvdXBUeXBlO1xyXG5cclxuXHJcbiAgICAgIC8vIGlmICh0ZXJyaXRvcnlHcm91cFR5cGUuX2xpbmtzLnNlbGYuaHJlZiA9PSAnJykge1xyXG4gICAgICAvLyAgIGl0ZW0uZGVsZXRlUmVsYXRpb24oJ2dyb3VwVHlwZScsIHRlcnJpdG9yeUdyb3VwVHlwZSkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgIC8vICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG5cclxuICAgICAgLy8gfSBlbHNlIHtcclxuICAgICAgLy8gICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbignZ3JvdXBUeXBlJywgdGVycml0b3J5R3JvdXBUeXBlKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgLy8gICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIC8vIH1cclxuXHJcbiAgICAgIGlmICh0ZXJyaXRvcnlUeXBlLl9saW5rcy5zZWxmLmhyZWYgPT0gJycpIHtcclxuICAgICAgICBpdGVtLmRlbGV0ZVJlbGF0aW9uKCd0eXBlJywgdGVycml0b3J5VHlwZSkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG5cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbigndHlwZScsIHRlcnJpdG9yeVR5cGUpLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZGVsZXRlIGl0ZW0udHlwZTtcclxuICAgICAgLy8gaWYgKGl0ZW0udHlwZSAhPSBudWxsKVxyXG4gICAgICAvLyAgIGl0ZW0udHlwZSA9IGl0ZW0udHlwZS5fbGlua3Muc2VsZi5ocmVmO1xyXG5cclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5URVJSSVRPUllfQVBJKSwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuXHJcbn1cclxuIiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcblxyXG4vKipcclxuICogVGVycml0b3J5IHR5cGUgbW9kZWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBUZXJyaXRvcnlUeXBlIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gICAvKiogaWQgKi9cclxuICAgcHVibGljIGlkOiBudW1iZXI7ICBcclxuICAvKiogbmFtZSAqL1xyXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbn1cclxuIiwiaW1wb3J0IHsgVGVycml0b3J5IH0gZnJvbSAnLi90ZXJyaXRvcnkubW9kZWwnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgVGVycml0b3J5VHlwZSB9IGZyb20gJy4vdGVycml0b3J5LXR5cGUubW9kZWwnO1xyXG5cclxuLyoqIFRlcnJpdG9yeVR5cGUgbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFRlcnJpdG9yeVR5cGVTZXJ2aWNlIGV4dGVuZHMgUmVzdFNlcnZpY2U8VGVycml0b3J5VHlwZT4ge1xyXG4gIFxyXG5cclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgVEVSUklUT1JZVFlQRV9BUEkgPSAndGVycml0b3J5LXR5cGVzJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoVGVycml0b3J5VHlwZSwgXCJ0ZXJyaXRvcnktdHlwZXNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIHRlcnJpdG9yeSB0eXBlKi9cclxuICByZW1vdmUoaXRlbTogVGVycml0b3J5VHlwZSkge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIHRlcnJpdG9yeSB0eXBlKi9cclxuICBzYXZlKGl0ZW06IGFueSk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICBpZiAoaXRlbS5fbGlua3MhPW51bGwpIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5URVJSSVRPUllUWVBFX0FQSSkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG5cclxuLyoqXHJcbiAqIFRlcnJpdG9yeSB0eXBlIG1vZGVsXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgVGVycml0b3J5R3JvdXBUeXBlIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiBpZCAqL1xyXG4gIHB1YmxpYyBpZDogbnVtYmVyOyAgXHJcbiAgLyoqIG5hbWUgKi9cclxuICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG59XHJcbiIsImltcG9ydCB7IFRlcnJpdG9yeUdyb3VwVHlwZSB9IGZyb20gJy4vdGVycml0b3J5LWdyb3VwLXR5cGUubW9kZWwnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuQEluamVjdGFibGUoe1xyXG4gIHByb3ZpZGVkSW46ICdyb290J1xyXG59KVxyXG5leHBvcnQgY2xhc3MgVGVycml0b3J5R3JvdXBUeXBlU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPFRlcnJpdG9yeUdyb3VwVHlwZT4ge1xyXG4gIFxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBURVJSSVRPUllHUk9VUFRZUEVfQVBJID0gJ3RlcnJpdG9yeS1ncm91cC10eXBlcyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKFRlcnJpdG9yeUdyb3VwVHlwZSwgXCJ0ZXJyaXRvcnktZ3JvdXAtdHlwZXNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIHRlcnJpdG9yeSovXHJcbiAgcmVtb3ZlKGl0ZW06IFRlcnJpdG9yeUdyb3VwVHlwZSkge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIHRlcnJpdG9yeSovXHJcbiAgc2F2ZShpdGVtOiBhbnkpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuVEVSUklUT1JZR1JPVVBUWVBFX0FQSSkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG59IiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcblxyXG4vKipcclxuICogUm9sZSBtb2RlbFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFJvbGUgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgLyoqIGlkICovXHJcbiAgcHVibGljIGlkOiBudW1iZXI7XHJcbiAgLyoqIG5hbWUqL1xyXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgLyoqIGNvbW1lbnRzKi9cclxuICBwdWJsaWMgZGVzY3JpcHRpb246IHN0cmluZztcclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgUm9sZSB9IGZyb20gJy4vcm9sZS5tb2RlbCc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5cclxuLyoqIFJvbGUgbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFJvbGVTZXJ2aWNlIGV4dGVuZHMgUmVzdFNlcnZpY2U8Um9sZT4ge1xyXG4gIFxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBST0xFX0FQSSA9ICdyb2xlcyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKFJvbGUsIFwicm9sZXNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIHJvbGUqL1xyXG4gIHJlbW92ZShpdGVtOiBSb2xlKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgcm9sZSovXHJcbiAgc2F2ZShpdGVtOiBhbnkpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuUk9MRV9BUEkpICwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBcclxufVxyXG4iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuLyoqXHJcbiAqIENvbm5lY3Rpb24gbW9kZWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBDb25uZWN0aW9uIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiBpZCAqL1xyXG4gIHB1YmxpYyBpZDogbnVtYmVyO1xyXG4gIC8qKiBuYW1lKi9cclxuICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG4gIC8qKiB0eXBlKi9cclxuICBwdWJsaWMgdHlwZTogc3RyaW5nO1xyXG4gIC8qKiB1c2VyKi9cclxuICBwdWJsaWMgdXNlcjogc3RyaW5nO1xyXG4gIC8qKiBwYXNzd29yZCovXHJcbiAgcHVibGljIHBhc3N3b3JkOiBzdHJpbmc7XHJcbiAgLyoqIGNvbm5lY3Rpb24gc3RyaW5nKi9cclxuICBwdWJsaWMgY29ubmVjdGlvblN0cmluZzogc3RyaW5nO1xyXG5cclxufVxyXG4iLCJpbXBvcnQgeyBDb25uZWN0aW9uIH0gZnJvbSAnLi9jb25uZWN0aW9uLm1vZGVsJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcblxyXG4vKiogQ29ubmVjdGlvbiBtYW5hZ2VyIHNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgQ29ubmVjdGlvblNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxDb25uZWN0aW9uPiB7XHJcbiAgXHJcblxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBDT05ORUNUSU9OX0FQSSA9ICdjb25uZWN0aW9ucyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKENvbm5lY3Rpb24sIFwiY29ubmVjdGlvbnNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIGNvbm5lY3Rpb24qL1xyXG4gIHJlbW92ZShpdGVtOiBDb25uZWN0aW9uKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgY29ubmVjdGlvbiovXHJcbiAgc2F2ZShpdGVtOiBDb25uZWN0aW9uKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgIGlmIChpdGVtLl9saW5rcyE9bnVsbCkge1xyXG4gICAgICBcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5DT05ORUNUSU9OX0FQSSkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG5cclxuICB0ZXN0Q29ubmVjdGlvbihpdGVtOmFueSk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICByZXN1bHQ9dGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5DT05ORUNUSU9OX0FQSSkrXCIvdGVzdFwiICwgaXRlbSk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBcclxufVxyXG4iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuXHJcbmltcG9ydCB7IENvbm5lY3Rpb24gfSBmcm9tICcuLi9jb25uZWN0aW9uL2Nvbm5lY3Rpb24ubW9kZWwnO1xyXG5pbXBvcnQgeyBSb2xlIH0gZnJvbSAnLi4vcm9sZS9yb2xlLm1vZGVsJztcclxuaW1wb3J0IHsgVGFza1R5cGUgfSBmcm9tICcuL3Rhc2stdHlwZS5tb2RlbCc7XHJcbmltcG9ydCB7IFRhc2tHcm91cCB9IGZyb20gJy4vdGFzay1ncm91cC5tb2RlbCc7XHJcbmltcG9ydCB7IFRhc2tBdmFpbGFiaWxpdHkgfSBmcm9tICcuL3Rhc2stYXZhaWxhYmlsaXR5Lm1vZGVsJztcclxuaW1wb3J0IHsgVGFza1BhcmFtZXRlciB9IGZyb20gJy4vdGFzay1wYXJhbWV0ZXIubW9kZWwnO1xyXG5cclxuLy9GSVhNRSBlbnN1cmUgdGFzayBjcmVhdGlvbiBpbiBhZG1pbiBhcHAgdXBvbiBpbml0aWFsaXphdGlvbiAoYXMgaXQgaXMgZG9uZSB3aXRoIFJvbGVzIGFuZCBkZWZhdWx0IFVzZXJzKVxyXG4vKiogR0VPQURNSU5fdGFzayBpZCAqL1xyXG5leHBvcnQgY29uc3QgR0VPQURNSU5fVFJFRV9UQVNLX0lEOnN0cmluZyAgPSBcImdlb2FkbWluXCI7XHJcblxyXG5pbXBvcnQgeyBUYXNrVUkgfSBmcm9tICcuL3Rhc2stdWkubW9kZWwnO1xyXG5pbXBvcnQgeyBDYXJ0b2dyYXBoeSB9IGZyb20gJy4uL2NhcnRvZ3JhcGh5L2NhcnRvZ3JhcGh5Lm1vZGVsJztcclxuaW1wb3J0IHsgU2VydmljZSB9IGZyb20gJy4uL3NlcnZpY2Uvc2VydmljZS5tb2RlbCc7XHJcbi8qKiBUYXNrIG1vZGVsICovXHJcbmV4cG9ydCBjbGFzcyBUYXNrIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiBpZCAqL1xyXG4gIHB1YmxpYyBpZD86IG51bWJlcjtcclxuICAvKiogbmFtZSAqLyAgXHJcbiAgcHVibGljIG5hbWU/OiBzdHJpbmc7XHJcbiAgLyoqIG9yZGVyKi9cclxuICBwdWJsaWMgb3JkZXI/OiBOdW1iZXI7XHJcbiAgLyoqIHN5c3RlbSBjcmVhdGVkIGRhdGUqL1xyXG4gIHB1YmxpYyBjcmVhdGVkRGF0ZT86IGFueTtcclxuICAvKiogdGFzayBncm91cCovXHJcbiAgcHVibGljIGdyb3VwPzogVGFza0dyb3VwO1xyXG4gIC8qKiB0YXNrIHR5cGUqL1xyXG4gIHB1YmxpYyB0eXBlPzogVGFza1R5cGU7XHJcbiAgLyoqIHRhc2sgVUkqL1xyXG4gIHB1YmxpYyB1aT86IFRhc2tVSTtcclxuICAvKiogcGFyYW1ldGVycyovXHJcbiAgcHVibGljIHBhcmFtZXRlcnM/OiBUYXNrUGFyYW1ldGVyW107XHJcbiAgLyoqIGNvbm5lY3Rpb24qL1xyXG4gIHB1YmxpYyBjb25uZWN0aW9uPzogQ29ubmVjdGlvbjtcclxuICAvKiogcm9sZXMqL1xyXG4gIHB1YmxpYyByb2xlcz86IFJvbGVbXTtcclxuICAvKiogYXZhaWxhYmlsaXRpZXMqL1xyXG4gIHB1YmxpYyBhdmFpbGFiaWxpdGllcz86IFRhc2tBdmFpbGFiaWxpdHlbXTtcclxuXHJcbiAgcHVibGljIGNhcnRvZ3JhcGh5PzogQ2FydG9ncmFwaHk7XHJcblxyXG4gIHB1YmxpYyBzZXJ2aWNlPzogU2VydmljZTtcclxuXHJcbiAgcHVibGljIHByb3BlcnRpZXM/O1xyXG59XHJcbiIsImltcG9ydCB7IFRhc2sgfSBmcm9tICcuL3Rhc2subW9kZWwnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuXHJcbi8qKiBUYXNrIG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBUYXNrU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPFRhc2s+IHtcclxuXHJcbiAgICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICAgIHB1YmxpYyBDT05ORUNUSU9OX0FQSSA9ICd0YXNrcyc7XHJcblxyXG4gICAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IsIHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgICAgIHN1cGVyKFRhc2ssIFwidGFza3NcIiwgaW5qZWN0b3IpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiByZW1vdmUgdGFzayovXHJcbiAgICByZW1vdmUoaXRlbTogVGFzaykge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKGl0ZW0uX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKiBzYXZlIHRhc2sqL1xyXG4gICAgc2F2ZShpdGVtOiBUYXNrKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgICAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcblxyXG4gICAgICAgIGlmIChpdGVtLl9saW5rcyAhPSBudWxsKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoIWl0ZW0uc2VydmljZSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHNlcnZpY2U6YW55ID0ge31cclxuICAgICAgICAgICAgICAgIHNlcnZpY2UuX2xpbmtzID0ge307XHJcbiAgICAgICAgICAgICAgICBzZXJ2aWNlLl9saW5rcy5zZWxmID0ge307XHJcbiAgICAgICAgICAgICAgICBzZXJ2aWNlLl9saW5rcy5zZWxmLmhyZWYgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgaXRlbS5kZWxldGVSZWxhdGlvbignc2VydmljZScsIHNlcnZpY2UpLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICAgICAgICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpOyBcclxuICAgICAgICAgICAgfWVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaXRlbS5zZXJ2aWNlLl9saW5rcy5zZWxmLmhyZWY9aXRlbS5zZXJ2aWNlLl9saW5rcy5zZWxmLmhyZWYuc3BsaXQoXCJ7XCIpWzBdXHJcbiAgICAgICAgICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbignc2VydmljZScsIGl0ZW0uc2VydmljZSkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgICAgICAgICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgICAgICAgICAgICBpdGVtLnNlcnZpY2UgPSBpdGVtLnNlcnZpY2UuX2xpbmtzLnNlbGYuaHJlZlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghaXRlbS5jYXJ0b2dyYXBoeSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGNhcnRvZ3JhcGh5OmFueSA9IHt9XHJcbiAgICAgICAgICAgICAgICBjYXJ0b2dyYXBoeS5fbGlua3MgPSB7fTtcclxuICAgICAgICAgICAgICAgIGNhcnRvZ3JhcGh5Ll9saW5rcy5zZWxmID0ge307XHJcbiAgICAgICAgICAgICAgICBjYXJ0b2dyYXBoeS5fbGlua3Muc2VsZi5ocmVmID0gXCJcIjtcclxuICAgICAgICAgICAgICAgIGl0ZW0uZGVsZXRlUmVsYXRpb24oJ2NhcnRvZ3JhcGh5JywgY2FydG9ncmFwaHkpLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICAgICAgICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpOyBcclxuICAgICAgICAgICAgfWVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaXRlbS5jYXJ0b2dyYXBoeS5fbGlua3Muc2VsZi5ocmVmPWl0ZW0uY2FydG9ncmFwaHkuX2xpbmtzLnNlbGYuaHJlZi5zcGxpdChcIntcIilbMF1cclxuICAgICAgICAgICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCdjYXJ0b2dyYXBoeScsIGl0ZW0uY2FydG9ncmFwaHkpLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICAgICAgICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG4gICAgICAgICAgICAgICAgaXRlbS5jYXJ0b2dyYXBoeSA9IGl0ZW0uY2FydG9ncmFwaHkuX2xpbmtzLnNlbGYuaHJlZlxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIWl0ZW0uY29ubmVjdGlvbikge1xyXG4gICAgICAgICAgICAgICAgbGV0IGNvbm5lY3Rpb246YW55ID0ge31cclxuICAgICAgICAgICAgICAgIGNvbm5lY3Rpb24uX2xpbmtzID0ge307XHJcbiAgICAgICAgICAgICAgICBjb25uZWN0aW9uLl9saW5rcy5zZWxmID0ge307XHJcbiAgICAgICAgICAgICAgICBjb25uZWN0aW9uLl9saW5rcy5zZWxmLmhyZWYgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgaXRlbS5kZWxldGVSZWxhdGlvbignY29ubmVjdGlvbicsIGNvbm5lY3Rpb24pLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICAgICAgICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpOyBcclxuICAgICAgICAgICAgfWVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaXRlbS5jb25uZWN0aW9uLl9saW5rcy5zZWxmLmhyZWY9aXRlbS5jb25uZWN0aW9uLl9saW5rcy5zZWxmLmhyZWYuc3BsaXQoXCJ7XCIpWzBdXHJcbiAgICAgICAgICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbignY29ubmVjdGlvbicsIGl0ZW0uY29ubmVjdGlvbikuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgICAgICAgICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgICAgICAgICAgICBpdGVtLmNvbm5lY3Rpb24gPSBpdGVtLmNvbm5lY3Rpb24uX2xpbmtzLnNlbGYuaHJlZlxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIWl0ZW0udWkpIHtcclxuICAgICAgICAgICAgICAgIC8vIGl0ZW0uZGVsZXRlUmVsYXRpb24oJ3VpJywgaXRlbS51aSkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgICAgICAgICAgICAvLyB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7IFxyXG4gICAgICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLnVpLl9saW5rcy5zZWxmLmhyZWY9aXRlbS51aS5fbGlua3Muc2VsZi5ocmVmLnNwbGl0KFwie1wiKVswXVxyXG4gICAgICAgICAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ3VpJywgaXRlbS51aSkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgICAgICAgICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgICAgICAgICAgICBpdGVtLnVpID0gaXRlbS51aS5fbGlua3Muc2VsZi5ocmVmXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICghaXRlbS5ncm91cCkge1xyXG4gICAgICAgICAgICAgICAgLy8gaXRlbS5kZWxldGVSZWxhdGlvbignZ3JvdXAnLCBpdGVtLmdyb3VwKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTsgXHJcbiAgICAgICAgICAgIH1lbHNlIHtcclxuICAgICAgICAgICAgICAgIGl0ZW0uZ3JvdXAuX2xpbmtzLnNlbGYuaHJlZj1pdGVtLmdyb3VwLl9saW5rcy5zZWxmLmhyZWYuc3BsaXQoXCJ7XCIpWzBdXHJcbiAgICAgICAgICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbignZ3JvdXAnLCBpdGVtLmdyb3VwKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgICAgICAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgICAgICAgICAgIGl0ZW0uZ3JvdXAgPSBpdGVtLmdyb3VwLl9saW5rcy5zZWxmLmhyZWZcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCFpdGVtLnR5cGUpIHtcclxuICAgICAgICAgICAgICAgIC8vIGl0ZW0uZGVsZXRlUmVsYXRpb24oJ3R5cGUnLCBpdGVtLnR5cGUpLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICAgICAgICAgICAgLy8gfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpOyBcclxuICAgICAgICAgICAgfWVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaXRlbS50eXBlLl9saW5rcy5zZWxmLmhyZWY9aXRlbS50eXBlLl9saW5rcy5zZWxmLmhyZWYuc3BsaXQoXCJ7XCIpWzBdXHJcbiAgICAgICAgICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbigndHlwZScsIGl0ZW0udHlwZSkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgICAgICAgICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgICAgICAgICAgICBpdGVtLnR5cGUgPSBpdGVtLnR5cGUuX2xpbmtzLnNlbGYuaHJlZlxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZihpdGVtLnJvbGVzKXtcclxuICAgICAgICAgICAgICAgIGxldCByb2xlcyA9IFsuLi5pdGVtLnJvbGVzXTtcclxuICAgICAgICAgICAgICAgIGRlbGV0ZSBpdGVtLnJvbGVzO1xyXG4gICAgICAgICAgICAgICAgaXRlbS5zdWJzdGl0dXRlQWxsUmVsYXRpb24oJ3JvbGVzJyxyb2xlcykuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgICAgICAgICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTsgICAgICAgICAgICBcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZihpdGVtLmNhcnRvZ3JhcGh5KXtcclxuICAgICAgICAgICAgICAgIGl0ZW0uY2FydG9ncmFwaHkgPSBpdGVtLmNhcnRvZ3JhcGh5Ll9saW5rcy5zZWxmLmhyZWZcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZihpdGVtLmNvbm5lY3Rpb24pe1xyXG4gICAgICAgICAgICAgICAgaXRlbS5jb25uZWN0aW9uID0gaXRlbS5jb25uZWN0aW9uLl9saW5rcy5zZWxmLmhyZWZcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZihpdGVtLnNlcnZpY2Upe1xyXG4gICAgICAgICAgICAgICAgaXRlbS5zZXJ2aWNlID0gaXRlbS5zZXJ2aWNlLl9saW5rcy5zZWxmLmhyZWZcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZihpdGVtLnVpKXtcclxuICAgICAgICAgICAgICAgIGl0ZW0udWkgPSBpdGVtLnVpLl9saW5rcy5zZWxmLmhyZWZcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZihpdGVtLmdyb3VwKXtcclxuICAgICAgICAgICAgICAgIGl0ZW0uZ3JvdXAgPSBpdGVtLmdyb3VwLl9saW5rcy5zZWxmLmhyZWZcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZihpdGVtLnR5cGUpe1xyXG4gICAgICAgICAgICAgICAgaXRlbS50eXBlID0gaXRlbS50eXBlLl9saW5rcy5zZWxmLmhyZWZcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLkNPTk5FQ1RJT05fQVBJKSwgaXRlbSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG4vKipcclxuICogVGFzayB0eXBlIG1vZGVsXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgVGFza1R5cGUgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgLyoqIG5hbWUqLyAgXHJcbiAgcHVibGljIG5hbWU6IHN0cmluZztcclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgVGFza1R5cGUgfSBmcm9tICcuL3Rhc2stdHlwZS5tb2RlbCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5cclxuLyoqIFRhc2tUeXBlIG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBUYXNrVHlwZVNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxUYXNrVHlwZT4ge1xyXG4gIFxyXG5cclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgQ09OTkVDVElPTl9BUEkgPSAndGFzay10eXBlcyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKFRhc2tUeXBlLCBcInRhc2stdHlwZXNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIHRhc2sgdHlwZSovXHJcbiAgcmVtb3ZlKGl0ZW06IFRhc2tUeXBlKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgdGFzayB0eXBlKi9cclxuICBzYXZlKGl0ZW06IFRhc2tUeXBlKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgIGlmIChpdGVtLl9saW5rcyE9bnVsbCkge1xyXG4gICAgICBcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5DT05ORUNUSU9OX0FQSSkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG4vKipcclxuICogVGFzayBncm91cCBtb2RlbFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFRhc2tHcm91cCBleHRlbmRzIFJlc291cmNlIHtcclxuICAvKiogaWQgKi9cclxuICBwdWJsaWMgaWQ6IG51bWJlcjsgIFxyXG4gIC8qKiBuYW1lKi8gIFxyXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcblxyXG59XHJcbiIsImltcG9ydCB7IFRhc2tHcm91cCB9IGZyb20gJy4vdGFzay1ncm91cC5tb2RlbCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5cclxuLyoqIFRhc2sgZ3JvdXAgbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFRhc2tHcm91cFNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxUYXNrR3JvdXA+IHtcclxuICBcclxuXHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIENPTk5FQ1RJT05fQVBJID0gJ3Rhc2stZ3JvdXBzJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoVGFza0dyb3VwLCBcInRhc2stZ3JvdXBzXCIsIGluamVjdG9yKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqIHJlbW92ZSB0YXNrIGdyb3VwKi9cclxuICByZW1vdmUoaXRlbTogVGFza0dyb3VwKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgdGFzayBncm91cCovXHJcbiAgc2F2ZShpdGVtOiBUYXNrR3JvdXApOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIFxyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucHV0KGl0ZW0uX2xpbmtzLnNlbGYuaHJlZiwgaXRlbSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLkNPTk5FQ1RJT05fQVBJKSAsIGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgXHJcbn1cclxuIiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcbmltcG9ydCB7VGFza30gZnJvbSAnLi90YXNrLm1vZGVsJzsgIFxyXG4vKipcclxuICogVGFzayBwYXJhbWV0ZXIgbW9kZWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBUYXNrUGFyYW1ldGVyIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiBuYW1lKi8gIFxyXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgXHJcbiAgLyoqIHR5cGUqL1xyXG4gIHB1YmxpYyB0eXBlOiBzdHJpbmc7XHJcbiAgICBcclxuICAvKiogdmFsdWUqL1xyXG4gIHB1YmxpYyB2YWx1ZTogc3RyaW5nO1xyXG4gIFxyXG4gIC8qKiBvcmRlciovICBcclxuICBwdWJsaWMgb3JkZXI6IE51bWJlcjtcclxuICBcclxuICAvKiogdGFzayovICBcclxuICBwdWJsaWMgdGFzazpUYXNrO1xyXG5cclxufVxyXG4iLCJpbXBvcnQgeyBUYXNrUGFyYW1ldGVyIH0gZnJvbSAnLi90YXNrLXBhcmFtZXRlci5tb2RlbCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5cclxuLyoqIFRhc2sgcGFyYW1ldGVyIG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpIFxyXG5leHBvcnQgY2xhc3MgVGFza1BhcmFtZXRlclNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxUYXNrUGFyYW1ldGVyPiB7XHJcbiAgXHJcblxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBUQVNLX1BBUkFNRVRFUl9BUEkgPSAndGFzay1wYXJhbWV0ZXJzJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoVGFza1BhcmFtZXRlciwgXCJ0YXNrLXBhcmFtZXRlcnNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIHRhc2sgcGFyYW1ldGVyKi9cclxuICByZW1vdmUoaXRlbTogVGFza1BhcmFtZXRlcikge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIHRhc2sgcGFyYW1ldGVyKi9cclxuICBzYXZlKGl0ZW06IFRhc2tQYXJhbWV0ZXIpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuICAgICAgaWYgKGl0ZW0udGFzayAhPW51bGwpe1xyXG4gICAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ3Rhc2snLGl0ZW0udGFzaykuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgIFxyXG4gICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpdGVtLnRhc2sgPSBpdGVtLnRhc2suX2xpbmtzLnNlbGYuaHJlZjtcclxuICBcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5UQVNLX1BBUkFNRVRFUl9BUEkpICwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBcclxufVxyXG4iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuaW1wb3J0IHsgVGVycml0b3J5IH0gZnJvbSAnLi4vdGVycml0b3J5L3RlcnJpdG9yeS5tb2RlbCc7XHJcbmltcG9ydCB7IFRhc2sgfSBmcm9tICcuL3Rhc2subW9kZWwnO1xyXG4vKipcclxuICogVGFzayBhdmFpbGFiaWxpdHkgbW9kZWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBUYXNrQXZhaWxhYmlsaXR5IGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiB0ZXJyaXRvcnkqL1xyXG4gIHB1YmxpYyB0ZXJyaXRvcnk6IFRlcnJpdG9yeTtcclxuICAvKiogdGFzayovXHJcbiAgcHVibGljIHRhc2s6IFRhc2s7XHJcbn1cclxuIiwiaW1wb3J0IHsgVGFza0F2YWlsYWJpbGl0eSB9IGZyb20gJy4vdGFzay1hdmFpbGFiaWxpdHkubW9kZWwnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuXHJcbi8qKiBUYXNrIGF2YWlsYWJpbGl0eSBtYW5hZ2VyIHNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKSBcclxuZXhwb3J0IGNsYXNzIFRhc2tBdmFpbGFiaWxpdHlTZXJ2aWNlIGV4dGVuZHMgUmVzdFNlcnZpY2U8VGFza0F2YWlsYWJpbGl0eT4ge1xyXG4gIFxyXG5cclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgVEFTS19BVkFJTEFCSUxJVFlfQVBJID0gJ3Rhc2stYXZhaWxhYmlsaXRpZXMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihUYXNrQXZhaWxhYmlsaXR5LCBcInRhc2stYXZhaWxhYmlsaXRpZXNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIHRhc2sgYXZhaWxhYmlsaXR5Ki9cclxuICByZW1vdmUoaXRlbTogVGFza0F2YWlsYWJpbGl0eSkge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIHRhc2sgYXZhaWxhYmlsaXR5Ki9cclxuICBzYXZlKGl0ZW06IFRhc2tBdmFpbGFiaWxpdHkpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuICAgICAgaWYgKGl0ZW0udGFzayAhPW51bGwpe1xyXG4gICAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ3Rhc2snLGl0ZW0udGFzaykuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgIFxyXG4gICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGl0ZW0udGVycml0b3J5ICE9bnVsbCl7XHJcbiAgICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbigndGVycml0b3J5JyxpdGVtLnRlcnJpdG9yeSkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgIFxyXG4gICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGl0ZW0udGVycml0b3J5ID0gaXRlbS50ZXJyaXRvcnkuX2xpbmtzLnNlbGYuaHJlZjtcclxuICAgICAgaXRlbS50YXNrID0gaXRlbS50YXNrLl9saW5rcy5zZWxmLmhyZWY7XHJcbiAgXHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuVEFTS19BVkFJTEFCSUxJVFlfQVBJKSAsIGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgXHJcbn1cclxuIiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcbi8qKlxyXG4gKiBUYXNrIFVJIG1vZGVsXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgVGFza1VJIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiBuYW1lKi9cclxuICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG4gIFxyXG4gIC8qKiB0b29sdGlwKi8gIFxyXG4gIHB1YmxpYyB0b29sdGlwOiBzdHJpbmc7XHJcbiAgICBcclxuICAvKiogb3JkZXIqLyBcclxuICBwdWJsaWMgb3JkZXI6IG51bWJlcjtcclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgVGFza1VJIH0gZnJvbSAnLi90YXNrLXVpLm1vZGVsJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcblxyXG4vKiogVGFzayBVSSBtYW5hZ2VyIHNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgVGFza1VJU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPFRhc2tVST4ge1xyXG4gIFxyXG5cclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgQ09OTkVDVElPTl9BUEkgPSAndGFzay11aXMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihUYXNrVUksIFwidGFzay11aXNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIHRhc2sgVUkqL1xyXG4gIHJlbW92ZShpdGVtOiBUYXNrVUkpIHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKGl0ZW0uX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgIFxyXG4gIH1cclxuICBcclxuICAvKiogc2F2ZSB0YXNrIFVJKi9cclxuICBzYXZlKGl0ZW06IFRhc2tVSSk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICBpZiAoaXRlbS5fbGlua3MhPW51bGwpIHsgICAgICBcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5DT05ORUNUSU9OX0FQSSkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG5pbXBvcnQgeyBMYW5ndWFnZSB9IGZyb20gJy4vbGFuZ3VhZ2UubW9kZWwnO1xyXG5cclxuXHJcbi8qKiBUYXNrIG1vZGVsICovXHJcbmV4cG9ydCBjbGFzcyBUcmFuc2xhdGlvbiBleHRlbmRzIFJlc291cmNlIHtcclxuICAvKiogaWQgKi9cclxuICBwdWJsaWMgaWQ6IG51bWJlcjtcclxuICAvKiogaWQgKi9cclxuICBwdWJsaWMgZWxlbWVudDogbnVtYmVyO1xyXG4gIC8qKiBuYW1lICovXHJcbiAgcHVibGljIHRyYW5zbGF0aW9uOiBzdHJpbmc7XHJcbiAgLyoqIGNvbHVtbiAqL1xyXG4gIHB1YmxpYyBjb2x1bW46IHN0cmluZztcclxuICAvKiogbmFtZSAqL1xyXG4gIHB1YmxpYyBsYW5ndWFnZTogTGFuZ3VhZ2U7XHJcbiAgLyoqIG5hbWUgKi9cclxuICBwdWJsaWMgbGFuZ3VhZ2VOYW1lPzogc3RyaW5nO1xyXG4gIC8qKiBuYW1lICovXHJcbiAgcHVibGljIGxhbmd1YWdlU2hvcnRuYW1lPzogc3RyaW5nO1xyXG5cclxuXHJcblxyXG59XHJcbiIsImltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBUcmFuc2xhdGlvbiB9IGZyb20gJy4vdHJhbnNsYXRpb24ubW9kZWwnO1xyXG5cclxuXHJcbkBJbmplY3RhYmxlKHtcclxuICBwcm92aWRlZEluOiAncm9vdCdcclxufSlcclxuZXhwb3J0IGNsYXNzIFRyYW5zbGF0aW9uU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPFRyYW5zbGF0aW9uPiB7XHJcblxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBUUkFOU0xBVElPTl9BUEkgPSAndHJhbnNsYXRpb25zJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoVHJhbnNsYXRpb24sIFwidHJhbnNsYXRpb25zXCIsIGluamVjdG9yKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqIHJlbW92ZSB0cmFuc2xhdGlvbiovXHJcbiAgcmVtb3ZlKGl0ZW06IFRyYW5zbGF0aW9uKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgdHJhbnNsYXRpb24qL1xyXG4gIHNhdmUoaXRlbTogVHJhbnNsYXRpb24pOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG5cclxuICAgIGxldCBsYW5ndWFnZTphbnkgPSB7fVxyXG4gICAgbGFuZ3VhZ2UuX2xpbmtzID0ge307XHJcbiAgICBsYW5ndWFnZS5fbGlua3Muc2VsZiA9IHt9O1xyXG4gICAgbGFuZ3VhZ2UuX2xpbmtzLnNlbGYuaHJlZiA9IFwiXCI7XHJcblxyXG4gICAgaWYgKGl0ZW0ubGFuZ3VhZ2UgIT0gbnVsbCkge1xyXG4gICAgICBsYW5ndWFnZSA9IGl0ZW0ubGFuZ3VhZ2U7XHJcbiAgICAgIGlmICh0eXBlb2YgaXRlbS5sYW5ndWFnZS5fbGlua3MgIT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICBpdGVtLmxhbmd1YWdlID0gaXRlbS5sYW5ndWFnZS5fbGlua3Muc2VsZi5ocmVmO1xyXG4gICAgICB9IFxyXG4gICAgfVxyXG5cclxuICAgIGlmIChpdGVtLl9saW5rcyE9bnVsbCkge1xyXG4gICAgICBkZWxldGUgaXRlbS5sYW5ndWFnZTtcclxuICAgICAgLy8gaWYgKGxhbmd1YWdlLl9saW5rcy5zZWxmLmhyZWYgPT0gJycpIHtcclxuICAgICAgLy8gICBpdGVtLmRlbGV0ZVJlbGF0aW9uKCdsYW5ndWFnZScsIGxhbmd1YWdlKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgLy8gICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcblxyXG4gICAgICAvLyB9IGVsc2Uge1xyXG4gICAgICAvLyAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCdsYW5ndWFnZScsIGxhbmd1YWdlKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgLy8gICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIC8vIH1cclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5UUkFOU0xBVElPTl9BUEkpICwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuXHJcblxyXG4vKiogVGFzayBtb2RlbCAqL1xyXG5leHBvcnQgY2xhc3MgTGFuZ3VhZ2UgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgLyoqIGlkICovXHJcbiAgcHVibGljIGlkOiBudW1iZXI7XHJcbiAgLyoqIG5hbWUgKi9cclxuICBwdWJsaWMgc2hvcnRuYW1lOiBzdHJpbmc7XHJcbiAgLyoqIG5hbWUgKi9cclxuICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG59XHJcbiIsImltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBMYW5ndWFnZSB9IGZyb20gJy4vbGFuZ3VhZ2UubW9kZWwnO1xyXG5cclxuXHJcbkBJbmplY3RhYmxlKHtcclxuICBwcm92aWRlZEluOiAncm9vdCdcclxufSlcclxuZXhwb3J0IGNsYXNzIExhbmd1YWdlU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPExhbmd1YWdlPiB7XHJcblxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBMQU5HVUFHRVNfQVBJID0gJ2xhbmd1YWdlcyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKExhbmd1YWdlLCBcImxhbmd1YWdlc1wiLCBpbmplY3Rvcik7XHJcbiAgfVxyXG4gIFxyXG4gIC8qKiByZW1vdmUgdHJhbnNsYXRpb24qL1xyXG4gIHJlbW92ZShpdGVtOiBMYW5ndWFnZSkge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIHRyYW5zbGF0aW9uKi9cclxuICBzYXZlKGl0ZW06IExhbmd1YWdlKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgIGlmIChpdGVtLl9saW5rcyE9bnVsbCkge1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucHV0KGl0ZW0uX2xpbmtzLnNlbGYuaHJlZiwgaXRlbSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLkxBTkdVQUdFU19BUEkpICwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuaW1wb3J0IHtDb25uZWN0aW9ufSBmcm9tICcuLi9jb25uZWN0aW9uL2Nvbm5lY3Rpb24ubW9kZWwnO1xyXG5pbXBvcnQge1NlcnZpY2VQYXJhbWV0ZXJ9IGZyb20gJy4vc2VydmljZS1wYXJhbWV0ZXIubW9kZWwnO1xyXG4vKipcclxuICogU2VydmljZSBtb2RlbFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFNlcnZpY2UgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgLyoqIGlkICovXHJcbiAgcHVibGljIGlkOiBudW1iZXI7XHJcbiAgLyoqIG5hbWUqL1xyXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgICBcclxuICAvKiogdHlwZSovXHJcbiAgcHVibGljIHR5cGU6IHN0cmluZztcclxuXHJcbiAgLyoqIHVybCovICBcclxuICBwdWJsaWMgc2VydmljZVVSTDogc3RyaW5nO1xyXG5cclxuICAvKiogcHJvamVjdGlvbnMqLyAgXHJcbiAgcHVibGljIHN1cHBvcnRlZFNSUzogc3RyaW5nO1xyXG4gIFxyXG4gIC8qKiBsZWdlbmQqL1xyXG4gIHB1YmxpYyBsZWdlbmQ6IHN0cmluZztcclxuXHJcbiAgLyoqIGluZm9VcmwqLyAgXHJcbiAgcHVibGljIGluZm9Vcmw6IHN0cmluZztcclxuICBcclxuICAvKiogc3lzdGVtIGNyZWF0ZWQgZGF0ZSovXHJcbiAgcHVibGljIGNyZWF0ZWREYXRlOiBhbnk7XHJcblxyXG4gIC8qKiBjb25uZWN0aW9uKi9cclxuICBwdWJsaWMgY29ubmVjdGlvbjogQ29ubmVjdGlvbjtcclxuICBcclxuICAvKiogcGFyYW1ldGVycyovICBcclxuICBwdWJsaWMgcGFyYW1ldGVyczogU2VydmljZVBhcmFtZXRlcltdO1xyXG5cclxuICAvKiogd2hldGhlciBzZXJ2aWNlIGlzIGJsb2NrZWQqL1xyXG4gIHB1YmxpYyBibG9ja2VkOiBib29sZWFuO1xyXG59XHJcbiIsImltcG9ydCB7IFNlcnZpY2UgfSBmcm9tICcuL3NlcnZpY2UubW9kZWwnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuXHJcbi8qKiBTZXJ2aWNlIG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBTZXJ2aWNlU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPFNlcnZpY2U+IHtcclxuXHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIFNFUlZJQ0VfQVBJID0gJ3NlcnZpY2VzJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoU2VydmljZSwgXCJzZXJ2aWNlc1wiLCBpbmplY3Rvcik7XHJcbiAgfVxyXG4gIFxyXG4gIC8qKiByZW1vdmUgc2VydmljZSovXHJcbiAgcmVtb3ZlKGl0ZW06IFNlcnZpY2UpIHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKGl0ZW0uX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgIFxyXG4gIH1cclxuICBcclxuICAvKiogc2F2ZSBzZXJ2aWNlKi9cclxuICBzYXZlKGl0ZW06IFNlcnZpY2UpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgbGV0IHNlcnZpY2VDb25uZWN0aW9uID0gaXRlbS5jb25uZWN0aW9uO1xyXG5cclxuICAgIGlmIChpdGVtLmNvbm5lY3Rpb24hPW51bGwpe1xyXG4gICAgICAgIGlmICh0eXBlb2YgaXRlbS5jb25uZWN0aW9uLl9saW5rcyE9ICd1bmRlZmluZWQnKSB7IFxyXG4gICAgICAgICAgICBpdGVtLmNvbm5lY3Rpb24gPSBpdGVtLmNvbm5lY3Rpb24uX2xpbmtzLnNlbGYuaHJlZjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBzZXJ2aWNlQ29ubmVjdGlvbi5fbGlua3M9IHt9O1xyXG4gICAgICAgICAgICBzZXJ2aWNlQ29ubmVjdGlvbi5fbGlua3Muc2VsZiA9IHt9O1xyXG4gICAgICAgICAgICBzZXJ2aWNlQ29ubmVjdGlvbi5fbGlua3Muc2VsZi5ocmVmPVwiXCI7XHJcbiAgICAgICAgfSAgICAgICAgXHJcbiAgICAgfVxyXG5cclxuICAgIGlmIChpdGVtLl9saW5rcyE9bnVsbCkgeyAgICAgXHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTsgICAgICAgXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLlNFUlZJQ0VfQVBJKSAsIGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgXHJcbn1cclxuIiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcblxyXG4vKipcclxuICogU2VydmljZSBtb2RlbFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIENvbmZpZ3VyYXRpb25QYXJhbWV0ZXIgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgLyoqIGlkICovXHJcbiAgcHVibGljIGlkOiBudW1iZXI7XHJcbiAgLyoqIG5hbWUqL1xyXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgICBcclxuICAvKiogdmFsdWUqL1xyXG4gIHB1YmxpYyB2YWx1ZTogc3RyaW5nO1xyXG5cclxufVxyXG4iLCJpbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBDb25maWd1cmF0aW9uUGFyYW1ldGVyIH0gZnJvbSAnLi9jb25maWd1cmF0aW9uLXBhcmFtZXRlcnMubW9kZWwnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcblxyXG5ASW5qZWN0YWJsZSh7XHJcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBDb25maWd1cmF0aW9uUGFyYW1ldGVyc1NlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxDb25maWd1cmF0aW9uUGFyYW1ldGVyPiB7XHJcblxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBDT05GSUdVUkFUSU9OX1BBUkFNRVRFUlNfQVBJID0gJ2NvbmZpZ3VyYXRpb24tcGFyYW1ldGVycyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKENvbmZpZ3VyYXRpb25QYXJhbWV0ZXIsIFwiY29uZmlndXJhdGlvbi1wYXJhbWV0ZXJzXCIsIGluamVjdG9yKTtcclxuICB9XHJcbiAgXHJcbiAgXHJcbn1cclxuIiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcbmltcG9ydCB7U2VydmljZX0gZnJvbSAnLi9zZXJ2aWNlLm1vZGVsJzsgXHJcbi8qKlxyXG4gKiBTZXJ2aWNlIHBhcmFtZXRlciBtb2RlbFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFNlcnZpY2VQYXJhbWV0ZXIgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgLyoqIG5hbWUqL1xyXG4gIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgXHJcbiAgLyoqIHR5cGUqL1xyXG4gIHB1YmxpYyB0eXBlOiBzdHJpbmc7XHJcbiAgICBcclxuICAvKiogdmFsdWUqLyAgXHJcbiAgcHVibGljIHZhbHVlOiBzdHJpbmc7XHJcbiAgXHJcbiAgLyoqIHNlcnZpY2UqL1xyXG4gIHB1YmxpYyBzZXJ2aWNlOiBTZXJ2aWNlO1xyXG5cclxufVxyXG4iLCJpbXBvcnQgeyBTZXJ2aWNlUGFyYW1ldGVyIH0gZnJvbSAnLi9zZXJ2aWNlLXBhcmFtZXRlci5tb2RlbCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5cclxuLyoqIFNlcnZpY2UgcGFyYW1ldGVyIG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpIFxyXG5leHBvcnQgY2xhc3MgU2VydmljZVBhcmFtZXRlclNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxTZXJ2aWNlUGFyYW1ldGVyPiB7XHJcblxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBTRVJWSUNFX1BBUkFNRVRFUl9BUEkgPSAnc2VydmljZS1wYXJhbWV0ZXJzJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoU2VydmljZVBhcmFtZXRlciwgXCJzZXJ2aWNlLXBhcmFtZXRlcnNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIHNlcnZpY2UgcGFyYW1ldGVyKi9cclxuICByZW1vdmUoaXRlbTogU2VydmljZVBhcmFtZXRlcikge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIHNlcnZpY2UgcGFyYW1ldGVyKi9cclxuICBzYXZlKGl0ZW06IFNlcnZpY2VQYXJhbWV0ZXIpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIFxyXG4gICAgICBcclxuICAgICAgaWYgKGl0ZW0uc2VydmljZSAhPW51bGwpe1xyXG4gICAgICAgICAgbGV0IHNlcnZpY2UgPSAgaXRlbS5zZXJ2aWNlO1xyXG4gICAgICAgICAgZGVsZXRlIGl0ZW0uc2VydmljZTtcclxuICAgICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCdzZXJ2aWNlJyxzZXJ2aWNlKS5zdWJzY3JpYmUocmVzdWx0ID0+IHsgICAgICAgICAgICBcclxuICAgICAgICAgIFxyXG4gICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH1cclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgICBcclxuICAgICAgXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpdGVtLnNlcnZpY2UgPSBpdGVtLnNlcnZpY2UuX2xpbmtzLnNlbGYuaHJlZjtcclxuICBcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5TRVJWSUNFX1BBUkFNRVRFUl9BUEkpICwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBcclxufVxyXG4iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuLyoqXHJcbiAqIENhcGFiaWxpdGllIG1vZGVsXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgQ2FwYWJpbGl0aWUgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgLyoqIHVybCAqL1xyXG4gIHB1YmxpYyB1cmw6IHN0cmluZztcclxufVxyXG4iLCJpbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50LCBIdHRwSGVhZGVycyB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcbmltcG9ydCB7IENhcGFiaWxpdGllIH0gZnJvbSAnLi9jYXBhYmlsaXRpZS5tb2RlbCc7XHJcblxyXG5cclxuQEluamVjdGFibGUoe1xyXG4gIHByb3ZpZGVkSW46ICdyb290J1xyXG59KVxyXG5leHBvcnQgY2xhc3MgQ2FwYWJpbGl0aWVzU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPENhcGFiaWxpdGllPiAge1xyXG5cclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgQ0FQQUJJTElUSUVTX0FQSSA9ICdoZWxwZXJzL2NhcGFiaWxpdGllcz91cmw9JztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoQ2FwYWJpbGl0aWUsIFwiaGVscGVycy9jYXBhYmlsaXRpZXM/dXJsPVwiLCBpbmplY3Rvcik7XHJcbiAgfVxyXG5cclxuICAgIC8qKiBzYXZlIHNlcnZpY2UqL1xyXG4gICAgZ2V0SW5mbyh1cmw6IHN0cmluZyk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgICAgaWYodXJsKXtcclxuICAgICAgICBjb25zdCBoZWFkZXJEaWN0ID0ge1xyXG4gICAgICAgICAgJ0NoYXJzZXQnOiAnVVRGLTgnXHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IHJlcXVlc3RPcHRpb25zID0geyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgaGVhZGVyczogbmV3IEh0dHBIZWFkZXJzKGhlYWRlckRpY3QpLCBcclxuICAgICAgICB9O1xyXG4gICAgICAgIGxldCBmaW5hbFVybCA9IHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuQ0FQQUJJTElUSUVTX0FQSSk7XHJcbiAgICAgICAgZmluYWxVcmwgPSBmaW5hbFVybC5jb25jYXQodXJsKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhmaW5hbFVybCk7XHJcbiAgICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLmdldChmaW5hbFVybCwgcmVxdWVzdE9wdGlvbnMpO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiByZXN1bHQ7XHJcbiBcclxuICAgIH1cclxuICBcclxufVxyXG4iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuLyoqXHJcbiAqIEluZm8gbW9kZWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBJbmZvIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiB1cmwgKi9cclxuICBwdWJsaWMgdXJsOiBzdHJpbmc7XHJcbn0iLCJpbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50LCBIdHRwSGVhZGVycyB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcbmltcG9ydCB7IEluZm8gfSBmcm9tICcuL2luZm8ubW9kZWwnO1xyXG5cclxuXHJcbkBJbmplY3RhYmxlKHtcclxuICBwcm92aWRlZEluOiAncm9vdCdcclxufSlcclxuZXhwb3J0IGNsYXNzIEdldEluZm9TZXJ2aWNlIGV4dGVuZHMgUmVzdFNlcnZpY2U8SW5mbz4gIHtcclxuXHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIElORk9fQVBJID0gJ2hlbHBlcnMvZmVhdHVyZS10eXBlP3VybD0nO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihJbmZvLCBcImhlbHBlcnMvZmVhdHVyZS10eXBlP3VybD1cIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuXHJcbiAgICAvKiogc2F2ZSBzZXJ2aWNlKi9cclxuICAgIGdldEluZm8odXJsOiBzdHJpbmcpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICAgIGlmKHVybCl7XHJcbiAgICAgICAgY29uc3QgaGVhZGVyRGljdCA9IHtcclxuICAgICAgICAgICdDaGFyc2V0JzogJ1VURi04J1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBjb25zdCByZXF1ZXN0T3B0aW9ucyA9IHsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgIGhlYWRlcnM6IG5ldyBIdHRwSGVhZGVycyhoZWFkZXJEaWN0KSwgXHJcbiAgICAgICAgfTtcclxuICAgICAgICBsZXQgZmluYWxVcmwgPSB0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLklORk9fQVBJKTtcclxuICAgICAgICBmaW5hbFVybCA9IGZpbmFsVXJsLmNvbmNhdCh1cmwpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGZpbmFsVXJsKTtcclxuICAgICAgICByZXN1bHQgPSB0aGlzLmh0dHAuZ2V0KGZpbmFsVXJsLCByZXF1ZXN0T3B0aW9ucyk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHJlc3VsdDtcclxuIFxyXG4gICAgfVxyXG4gIFxyXG59IiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcbmltcG9ydCB7U2VydmljZX0gZnJvbSAnLi4vc2VydmljZS9zZXJ2aWNlLm1vZGVsJztcclxuaW1wb3J0IHtDb25uZWN0aW9ufSBmcm9tICcuLi9jb25uZWN0aW9uL2Nvbm5lY3Rpb24ubW9kZWwnO1xyXG5pbXBvcnQge0NhcnRvZ3JhcGh5QXZhaWxhYmlsaXR5fSBmcm9tICcuL2NhcnRvZ3JhcGh5LWF2YWlsYWJpbGl0eS5tb2RlbCc7XHJcbmltcG9ydCB7IENhcnRvZ3JhcGh5U3R5bGUgfSBmcm9tICcuL2NhcnRvZ3JhcGh5LXN0eWxlLm1vZGVsJztcclxuLyoqXHJcbiAqIENhcnRvZ3JhcGh5XHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgQ2FydG9ncmFwaHkgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgLyoqIGlkICovXHJcbiAgcHVibGljIGlkOiBudW1iZXI7ICBcclxuICAvKiogbmFtZSovXHJcbiAgcHVibGljIG5hbWU6IHN0cmluZztcclxuICBcclxuICAvKiogdHlwZSovXHJcbiAgcHVibGljIHR5cGUgOiBzdHJpbmc7XHJcblxyXG4gIC8qKiBzZXJ2aWNlKi9cclxuICBwdWJsaWMgc2VydmljZSA6IFNlcnZpY2U7XHJcblxyXG4gIC8qKiBvcmRlciovICBcclxuICBwdWJsaWMgb3JkZXI6IE51bWJlcjsgXHJcblxyXG4gIC8qKiBkZXNjcmlwdGlvbiovICBcclxuICBwdWJsaWMgZGVzY3JpcHRpb246IFN0cmluZztcclxuXHJcbiAgLyoqIHNvdXJjZSovICBcclxuICBwdWJsaWMgc291cmNlOiBTdHJpbmc7XHJcblxyXG4gIC8qKiB3aGV0aGVyIGNhcnRvZ3JhcGh5IGlzIGJsb2NrZWQqL1xyXG4gIHB1YmxpYyBibG9ja2VkOiBib29sZWFuOyAgXHJcblxyXG4gIC8qKiBhcHBseSBmaWx0ZXIgdG8gZ2V0IG1hcCovXHJcbiAgcHVibGljIGFwcGx5RmlsdGVyVG9HZXRNYXA6IGJvb2xlYW47ICBcclxuXHJcbiAgLyoqIGFwcGx5IGZpbHRlciB0byBnZXQgZmVhdHVyZSBpbmZvcm1hdGlvbiovXHJcbiAgcHVibGljIGFwcGx5RmlsdGVyVG9HZXRGZWF0dXJlSW5mbzogYm9vbGVhbjsgIFxyXG5cclxuICAvKiogYXBwbHkgZmlsdGVyIHRvIHNwYXRpYWwgc2VsZWN0aW9uKi9cclxuICBwdWJsaWMgYXBwbHlGaWx0ZXJUb1NwYXRpYWxTZWxlY3Rpb246IGJvb2xlYW47ICBcclxuXHJcbiAgLyoqIHNlbGVjdGFibGUgbGF5ZXJzKi9cclxuICBwdWJsaWMgc2VsZWN0YWJsZUxheWVyczogc3RyaW5nW107XHJcblxyXG4gIC8qKiB0cmFuc3BhcmVuY3kqLyBcclxuICBwdWJsaWMgdHJhbnNwYXJlbmN5OiBOdW1iZXI7XHJcblxyXG4gIC8qKiB3aGV0aGVyIGxheWVyIGlzIHF1ZXJ5YWJsZSovICBcclxuICBwdWJsaWMgcXVlcnlhYmxlOiBCb29sZWFuO1xyXG5cclxuICAvKiogd2hldGhlciBsYXllciBpcyBxdWVyeWFibGUqLyBcclxuICBwdWJsaWMgcXVlcnlBY3Q6IEJvb2xlYW47XHJcblxyXG4gIC8qKiBxdWVyeSBsYXllciovXHJcbiAgcHVibGljIHF1ZXJ5TGF5OiBzdHJpbmc7XHJcblxyXG4gIC8qKiBzeXN0ZW0gY3JlYXRlZCBkYXRlKi9cclxuICBwdWJsaWMgY3JlYXRlZERhdGU6IGFueTtcclxuXHJcbiAgLyoqIG1pbmltdW0gc2NhbGUqL1xyXG4gIHB1YmxpYyBtaW5pbXVtU2NhbGU6IE51bWJlcjtcclxuXHJcbiAgLyoqIG1heGltdW0gc2NhbGUqL1xyXG4gIHB1YmxpYyBtYXhpbXVtU2NhbGU6IE51bWJlcjtcclxuXHJcbiAgLyoqIGxheWVycyovICBcclxuICBwdWJsaWMgbGF5ZXJzOiBzdHJpbmc7XHJcbiAgXHJcbiAgLyoqIGNvbm5lY3Rpb24qL1xyXG4gIHB1YmxpYyBjb25uZWN0aW9uOiBDb25uZWN0aW9uO1xyXG5cclxuICAvKiogcXVlcnlhYmxlRmVhdHVyZUVuYWJsZWQgKi9cclxuICBwdWJsaWMgcXVlcnlhYmxlRmVhdHVyZUVuYWJsZWQ6IEJvb2xlYW47XHJcblxyXG4gICAgLyoqIHF1ZXJ5YWJsZUxheWVycyAqL1xyXG4gIHB1YmxpYyBxdWVyeWFibGVGZWF0dXJlQXZhaWxhYmxlOiBCb29sZWFuO1xyXG5cclxuICAgIC8qKiBxdWVyeWFibGVMYXllcnMgKi9cclxuICBwdWJsaWMgcXVlcnlhYmxlTGF5ZXJzOiBzdHJpbmdbXTtcclxuXHJcbiAgLyoqIGF2YWlsYWJpbGl0aWVzKi9cclxuICBwdWJsaWMgYXZhaWxhYmlsaXRpZXMgOiBDYXJ0b2dyYXBoeUF2YWlsYWJpbGl0eVtdO1xyXG5cclxuICAvKiogd2hldGhlciBsYXllciBpcyBxdWVyeWFibGUqLyBcclxuICBwdWJsaWMgc2VsZWN0YWJsZUZlYXR1cmVFbmFibGVkOiBCb29sZWFuO1xyXG5cclxuICAvKiogc2VsZWN0aW9uIGxheWVyKi9cclxuICBwdWJsaWMgc2VsZWN0aW9uTGF5ZXI6IHN0cmluZztcclxuXHJcbiAgLyoqIHNlbGVjdGlvbiBzZXJ2aWNlKi8gIFxyXG4gIHB1YmxpYyBzZWxlY3Rpb25TZXJ2aWNlOiBTZXJ2aWNlO1xyXG5cclxuICAvKiogbGVnZW5kIHRpcCovICBcclxuICBwdWJsaWMgbGVnZW5kVHlwZTogc3RyaW5nO1xyXG4gIFxyXG4gIC8qKiBsZWdlbmQgdXJsKi9cclxuICBwdWJsaWMgbGVnZW5kVVJMOiBzdHJpbmc7XHJcblxyXG4gIC8qKiB3aGV0aGVyIGxheWVyIGlzIGVkaXRhYmxlKi9cclxuICBwdWJsaWMgZWRpdGFibGU6IEJvb2xlYW47XHJcblxyXG4gIC8qKiBtZXRhZGF0YSBVUkwqL1xyXG4gIHB1YmxpYyBtZXRhZGF0YVVSTDogc3RyaW5nO1xyXG5cclxuICAvKiogbWV0YWRhdGEgVVJMKi9cclxuICBwdWJsaWMgZGF0YXNldFVSTDogc3RyaW5nO1xyXG5cclxuICAvKiogd2hldGhlciBsYXllciBpcyB0aGVtYWJsZSovXHJcbiAgcHVibGljIHRoZW1hdGljOiBCb29sZWFuO1xyXG4gIFxyXG4gIC8qKiBnZW9tZXRyeSB0eXBlKi9cclxuICBwdWJsaWMgZ2VvbWV0cnlUeXBlOiBzdHJpbmc7XHJcblxyXG4gIHB1YmxpYyBzdHlsZXM/OiBDYXJ0b2dyYXBoeVN0eWxlW11cclxuXHJcbiAgcHVibGljIHVzZUFsbFN0eWxlczogYm9vbGVhbjtcclxuICBcclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgQ2FydG9ncmFwaHkgfSBmcm9tICcuL2NhcnRvZ3JhcGh5Lm1vZGVsJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBSZXN0U2VydmljZSB9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQ29ubmVjdGlvbiB9IGZyb20gJy4uL2Nvbm5lY3Rpb24vY29ubmVjdGlvbi5tb2RlbCc7XHJcbmltcG9ydCB7IFNlcnZpY2UgfSBmcm9tICcuLi9zZXJ2aWNlL3NlcnZpY2UubW9kZWwnO1xyXG5cclxuLyoqIENhcnRvZ3JhcGh5IG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBDYXJ0b2dyYXBoeVNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxDYXJ0b2dyYXBoeT4ge1xyXG5cclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgQ0FSVE9HUkFQSFlfQVBJID0gJ2NhcnRvZ3JhcGhpZXMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IsIHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoQ2FydG9ncmFwaHksIFwiY2FydG9ncmFwaGllc1wiLCBpbmplY3Rvcik7XHJcbiAgfVxyXG5cclxuICAvKiogcmVtb3ZlIGNhcnRvZ3JhcGh5Ki9cclxuICByZW1vdmUoaXRlbTogQ2FydG9ncmFwaHkpIHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKGl0ZW0uX2xpbmtzLnNlbGYuaHJlZik7XHJcblxyXG4gIH1cclxuXHJcbiAgLyoqIHNhdmUgY2FydG9ncmFwaHkqL1xyXG4gIHNhdmUoaXRlbTogQ2FydG9ncmFwaHkpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG5cclxuICAgIGxldCBjYXJ0b2dyYXBoeUNvbm5lY3Rpb246YW55PXt9O1xyXG4gICAgY2FydG9ncmFwaHlDb25uZWN0aW9uLl9saW5rcyA9IHt9O1xyXG4gICAgY2FydG9ncmFwaHlDb25uZWN0aW9uLl9saW5rcy5zZWxmID0ge307XHJcbiAgICBjYXJ0b2dyYXBoeUNvbm5lY3Rpb24uX2xpbmtzLnNlbGYuaHJlZiA9IFwiXCI7XHJcbiAgICAgXHJcbiAgICBsZXQgY2FydG9ncmFwaHlTZXJ2aWNlOmFueT17fTtcclxuICAgIGNhcnRvZ3JhcGh5U2VydmljZS5fbGlua3MgPSB7fTtcclxuICAgIGNhcnRvZ3JhcGh5U2VydmljZS5fbGlua3Muc2VsZiA9IHt9O1xyXG4gICAgY2FydG9ncmFwaHlTZXJ2aWNlLl9saW5rcy5zZWxmLmhyZWYgPSBcIlwiO1xyXG4gICAgXHJcbiAgICBsZXQgY2FydG9ncmFwaHlTZWxlY3Rpb25TZXJ2aWNlOmFueSA9IHt9O1xyXG4gICAgY2FydG9ncmFwaHlTZWxlY3Rpb25TZXJ2aWNlLl9saW5rcyA9IHt9O1xyXG4gICAgY2FydG9ncmFwaHlTZWxlY3Rpb25TZXJ2aWNlLl9saW5rcy5zZWxmID0ge307XHJcbiAgICBjYXJ0b2dyYXBoeVNlbGVjdGlvblNlcnZpY2UuX2xpbmtzLnNlbGYuaHJlZiA9IFwiXCI7XHJcblxyXG4gICAgaWYgKGl0ZW0uc2VydmljZSAhPSBudWxsKSB7XHJcbiAgICAgIGNhcnRvZ3JhcGh5U2VydmljZT0gIGl0ZW0uc2VydmljZTtcclxuICAgICAgaWYgKHR5cGVvZiBpdGVtLnNlcnZpY2UuX2xpbmtzICE9ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgaXRlbS5zZXJ2aWNlID0gaXRlbS5zZXJ2aWNlLl9saW5rcy5zZWxmLmhyZWY7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAoaXRlbS5zZWxlY3Rpb25TZXJ2aWNlICE9IG51bGwpIHtcclxuICAgICAgY2FydG9ncmFwaHlTZWxlY3Rpb25TZXJ2aWNlID0gaXRlbS5zZWxlY3Rpb25TZXJ2aWNlXHJcbiAgICAgIGlmICh0eXBlb2YgaXRlbS5zZWxlY3Rpb25TZXJ2aWNlLl9saW5rcyAhPSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIGl0ZW0uc2VsZWN0aW9uU2VydmljZSA9IGl0ZW0uc2VsZWN0aW9uU2VydmljZS5fbGlua3Muc2VsZi5ocmVmO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGl0ZW0uY29ubmVjdGlvbiAhPSBudWxsKSB7XHJcbiAgICAgIGNhcnRvZ3JhcGh5Q29ubmVjdGlvbj0gIGl0ZW0uY29ubmVjdGlvbjtcclxuICAgICAgaWYgKHR5cGVvZiBpdGVtLmNvbm5lY3Rpb24uX2xpbmtzICE9ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgaXRlbS5jb25uZWN0aW9uID0gaXRlbS5jb25uZWN0aW9uLl9saW5rcy5zZWxmLmhyZWY7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAoaXRlbS5fbGlua3MgIT0gbnVsbCkge1xyXG5cclxuICAgICAgLy91cGRhdGUgcmVsYXRpb25zXHJcbiAgICAgIGRlbGV0ZSBpdGVtLmNvbm5lY3Rpb247XHJcbiAgICAgIGRlbGV0ZSBpdGVtLnNlcnZpY2U7XHJcbiAgICAgIGRlbGV0ZSBpdGVtLnNlbGVjdGlvblNlcnZpY2U7XHJcblxyXG4gICAgICAvLyBpZiAoY2FydG9ncmFwaHlDb25uZWN0aW9uLl9saW5rcy5zZWxmLmhyZWYgPT0gJycgJiYgY2FydG9ncmFwaHlDb25uZWN0aW9uKSB7XHJcbiAgICAgIC8vICAgaXRlbS5kZWxldGVSZWxhdGlvbignc3BhdGlhbFNlbGVjdGlvbkNvbm5lY3Rpb24nLCBjYXJ0b2dyYXBoeUNvbm5lY3Rpb24pLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICAvLyAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgLy8gfSBlbHNlIHtcclxuICAgICAgLy8gICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbignc3BhdGlhbFNlbGVjdGlvbkNvbm5lY3Rpb24nLCBjYXJ0b2dyYXBoeUNvbm5lY3Rpb24pLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICAvLyAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgLy8gfVxyXG5cclxuICAgICAgaWYgKGNhcnRvZ3JhcGh5U2VydmljZS5fbGlua3Muc2VsZi5ocmVmID09ICcnKSB7XHJcbiAgICAgICAgaXRlbS5kZWxldGVSZWxhdGlvbignc2VydmljZScsIGNhcnRvZ3JhcGh5U2VydmljZSkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCdzZXJ2aWNlJywgY2FydG9ncmFwaHlTZXJ2aWNlKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChjYXJ0b2dyYXBoeVNlbGVjdGlvblNlcnZpY2UuX2xpbmtzLnNlbGYuaHJlZiA9PSAnJyAmJiBjYXJ0b2dyYXBoeVNlbGVjdGlvblNlcnZpY2UpIHtcclxuICAgICAgICBpdGVtLmRlbGV0ZVJlbGF0aW9uKCdzcGF0aWFsU2VsZWN0aW9uU2VydmljZScsIGNhcnRvZ3JhcGh5U2VsZWN0aW9uU2VydmljZSkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCdzcGF0aWFsU2VsZWN0aW9uU2VydmljZScsIGNhcnRvZ3JhcGh5U2VsZWN0aW9uU2VydmljZSkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucHV0KGl0ZW0uX2xpbmtzLnNlbGYuaHJlZiwgaXRlbSk7XHJcblxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5DQVJUT0dSQVBIWV9BUEkpLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG5cclxufVxyXG4iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuaW1wb3J0IHtDYXJ0b2dyYXBoeX0gZnJvbSAnLi9jYXJ0b2dyYXBoeS5tb2RlbCc7XHJcbmltcG9ydCB7Um9sZX0gZnJvbSAnLi4vcm9sZS9yb2xlLm1vZGVsJztcclxuLyoqXHJcbiAqIENhcnRvZ3JhcGh5IGdyb3VwXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgQ2FydG9ncmFwaHlHcm91cCBleHRlbmRzIFJlc291cmNlIHtcclxuICAvKiogaWQgKi9cclxuICBwdWJsaWMgaWQ6IG51bWJlcjsgIFxyXG4gIC8qKiBuYW1lKi9cclxuICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG4gIC8qKiB0eXBlKi9cclxuICBwdWJsaWMgdHlwZTogc3RyaW5nO1xyXG4gIC8qKiBtZW1iZXJzKi9cclxuICBwdWJsaWMgbWVtYmVyczogQ2FydG9ncmFwaHlbXTtcclxuICAvKiogcm9sZXMqL1xyXG4gIHB1YmxpYyByb2xlczogUm9sZVtdO1xyXG5cclxufVxyXG4iLCJpbXBvcnQgeyBDYXJ0b2dyYXBoeUdyb3VwIH0gZnJvbSAnLi9jYXJ0b2dyYXBoeS1ncm91cC5tb2RlbCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5cclxuLyoqIENhcnRvZ3JhcGh5R3JvdXAgbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIENhcnRvZ3JhcGh5R3JvdXBTZXJ2aWNlIGV4dGVuZHMgUmVzdFNlcnZpY2U8Q2FydG9ncmFwaHlHcm91cD4ge1xyXG4gIFxyXG5cclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgQ0FSVE9HUkFQSFlfR1JPVVBfQVBJID0nY2FydG9ncmFwaHktZ3JvdXBzJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoQ2FydG9ncmFwaHlHcm91cCwgXCJjYXJ0b2dyYXBoeS1ncm91cHNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIGNhcnRvZ3JhcGh5IGdyb3VwKi9cclxuICByZW1vdmUoaXRlbTogQ2FydG9ncmFwaHlHcm91cCkge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIGNhcnRvZ3JhcGh5IGdyb3VwKi9cclxuICBzYXZlKGl0ZW06IENhcnRvZ3JhcGh5R3JvdXApOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuQ0FSVE9HUkFQSFlfR1JPVVBfQVBJKSAsIGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgXHJcbn1cclxuIiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcbmltcG9ydCB7IFRlcnJpdG9yeSB9IGZyb20gJy4uL3RlcnJpdG9yeS90ZXJyaXRvcnkubW9kZWwnO1xyXG5pbXBvcnQgeyBDYXJ0b2dyYXBoeSB9IGZyb20gJy4vY2FydG9ncmFwaHkubW9kZWwnO1xyXG4vKipcclxuICogQ2FydG9ncmFwaHkgYXZhaWxhYmlsaXR5IG1vZGVsXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgQ2FydG9ncmFwaHlBdmFpbGFiaWxpdHkgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgLyoqIHRlcnJpdG9yeSovXHJcbiAgcHVibGljIHRlcnJpdG9yeTogVGVycml0b3J5O1xyXG4gIFxyXG4gIC8qKiBzeXN0ZW0gY3JlYXRlZCBkYXRlKi9cclxuICBwdWJsaWMgY3JlYXRlZERhdGU6IGFueTtcclxuICBcclxuICAvKiogY2FydG9ncmFwaHkqL1xyXG4gIHB1YmxpYyBjYXJ0b2dyYXBoeTogQ2FydG9ncmFwaHk7XHJcbn1cclxuIiwiaW1wb3J0IHsgQ2FydG9ncmFwaHlBdmFpbGFiaWxpdHkgfSBmcm9tICcuL2NhcnRvZ3JhcGh5LWF2YWlsYWJpbGl0eS5tb2RlbCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5cclxuLyoqIENhcnRvZ3JhcGh5QXZhaWxhYmlsaXR5IG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpIFxyXG5leHBvcnQgY2xhc3MgQ2FydG9ncmFwaHlBdmFpbGFiaWxpdHlTZXJ2aWNlIGV4dGVuZHMgUmVzdFNlcnZpY2U8Q2FydG9ncmFwaHlBdmFpbGFiaWxpdHk+IHtcclxuICBcclxuXHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIENBUlRPR1JBUEhZX0FWQUlMQUJJTElUWV9BUEkgPSAnY2FydG9ncmFwaHktYXZhaWxhYmlsaXRpZXMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihDYXJ0b2dyYXBoeUF2YWlsYWJpbGl0eSwgXCJjYXJ0b2dyYXBoeS1hdmFpbGFiaWxpdGllc1wiLCBpbmplY3Rvcik7XHJcbiAgfVxyXG4gIFxyXG4gIC8qKiByZW1vdmUgY2FydG9ncmFwaHkgYXZhaWxhYmlsaXR5Ki9cclxuICByZW1vdmUoaXRlbTogQ2FydG9ncmFwaHlBdmFpbGFiaWxpdHkpIHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKGl0ZW0uX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgIFxyXG4gIH1cclxuICBcclxuICAvKiogc2F2ZSBjYXJ0b2dyYXBoeSBhdmFpbGFiaWxpdHkqL1xyXG4gIHNhdmUoaXRlbTogQ2FydG9ncmFwaHlBdmFpbGFiaWxpdHkpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuICAgICAgaWYgKGl0ZW0uY2FydG9ncmFwaHkgIT1udWxsKXtcclxuICAgICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCdjYXJ0b2dyYXBoeScsaXRlbS5jYXJ0b2dyYXBoeSkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgIFxyXG4gICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGl0ZW0udGVycml0b3J5ICE9bnVsbCl7XHJcbiAgICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbigndGVycml0b3J5JyxpdGVtLnRlcnJpdG9yeSkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgIFxyXG4gICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGl0ZW0udGVycml0b3J5ID0gaXRlbS50ZXJyaXRvcnkuX2xpbmtzLnNlbGYuaHJlZjtcclxuICAgICAgaXRlbS5jYXJ0b2dyYXBoeSA9IGl0ZW0uY2FydG9ncmFwaHkuX2xpbmtzLnNlbGYuaHJlZjtcclxuICBcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5DQVJUT0dSQVBIWV9BVkFJTEFCSUxJVFlfQVBJKSAsIGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgXHJcbn1cclxuIiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcbmltcG9ydCB7IFRlcnJpdG9yeVR5cGUgfSBmcm9tICcuLi90ZXJyaXRvcnkvdGVycml0b3J5LXR5cGUubW9kZWwnO1xyXG5pbXBvcnQgeyBDYXJ0b2dyYXBoeSB9IGZyb20gJy4vY2FydG9ncmFwaHkubW9kZWwnO1xyXG4vKipcclxuICogQ2FydG9ncmFwaHkgYXZhaWxhYmlsaXR5IG1vZGVsXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgQ2FydG9ncmFwaHlGaWx0ZXIgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiBcclxuICAvKiogbmFtZSovXHJcbiAgcHVibGljIG5hbWU6IHN0cmluZztcclxuXHJcbiAgLyoqIHJlcXVpcmVkICovXHJcbiAgcHVibGljIHJlcXVpcmVkOiBib29sZWFuO1xyXG5cclxuICAvKiogdHlwZSovXHJcbiAgcHVibGljIHR5cGU6IHN0cmluZztcclxuXHJcbiAgLyoqIFRlcnJpdG9yaWFsIGxldmVsLiAqL1xyXG4gIHB1YmxpYyB0ZXJyaXRvcmlhbExldmVsOiBUZXJyaXRvcnlUeXBlO1xyXG4gIFxyXG4gIC8qKiBjb2x1bW4gKi9cclxuICBwdWJsaWMgY29sdW1uOiBzdHJpbmc7XHJcblxyXG4gIC8qKiB2YWx1ZXMqLyAgXHJcbiAgcHVibGljIHZhbHVlczogc3RyaW5nO1xyXG5cclxuICAvKiogdmFsdWUqLyAgXHJcbiAgcHVibGljIHZhbHVlVHlwZTogc3RyaW5nO1xyXG5cclxuICAvKiogY2FydG9ncmFwaHkqL1xyXG4gIHB1YmxpYyBjYXJ0b2dyYXBoeTogQ2FydG9ncmFwaHk7XHJcblxyXG5cclxufVxyXG4iLCJpbXBvcnQgeyBDYXJ0b2dyYXBoeUZpbHRlciB9IGZyb20gJy4vY2FydG9ncmFwaHktZmlsdGVyLm1vZGVsJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcblxyXG4vKiogQ2FydG9ncmFwaHlGaWx0ZXIgbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKCkgXHJcbmV4cG9ydCBjbGFzcyBDYXJ0b2dyYXBoeUZpbHRlclNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxDYXJ0b2dyYXBoeUZpbHRlcj4ge1xyXG4gIFxyXG5cclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgQ0FSVE9HUkFQSFlfRklMVEVSX0FQSSA9ICdjYXJ0b2dyYXBoeS1maWx0ZXJzJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoQ2FydG9ncmFwaHlGaWx0ZXIsIFwiY2FydG9ncmFwaHktZmlsdGVyc1wiLCBpbmplY3Rvcik7XHJcbiAgfVxyXG4gIFxyXG4gIC8qKiByZW1vdmUgY2FydG9ncmFwaHkgZmlsdGVyKi9cclxuICByZW1vdmUoaXRlbTogQ2FydG9ncmFwaHlGaWx0ZXIpIHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKGl0ZW0uX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgIFxyXG4gIH1cclxuICBcclxuICAvKiogc2F2ZSBjYXJ0b2dyYXBoeSBhdmFpbGFiaWxpdHkqL1xyXG4gIHNhdmUoaXRlbTogQ2FydG9ncmFwaHlGaWx0ZXIpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuICAgICAgaWYgKGl0ZW0uY2FydG9ncmFwaHkgIT1udWxsKXtcclxuICAgICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCdjYXJ0b2dyYXBoeScsaXRlbS5jYXJ0b2dyYXBoeSkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYoaXRlbS50ZXJyaXRvcmlhbExldmVsICE9IG51bGwgJiYgaXRlbS50ZXJyaXRvcmlhbExldmVsICE9IHVuZGVmaW5lZCApe1xyXG4gICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCd0ZXJyaXRvcmlhbExldmVsJyxpdGVtLnRlcnJpdG9yaWFsTGV2ZWwpLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgfVxyXG4gICAgIFxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgXHJcbiAgICAgIGl0ZW0uY2FydG9ncmFwaHkgPSBpdGVtLmNhcnRvZ3JhcGh5Ll9saW5rcy5zZWxmLmhyZWY7XHJcbiAgICAgIGl0ZW0udGVycml0b3JpYWxMZXZlbD1pdGVtLnRlcnJpdG9yaWFsTGV2ZWwuX2xpbmtzLnNlbGYuaHJlZjtcclxuICAgICAgXHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuQ0FSVE9HUkFQSFlfRklMVEVSX0FQSSkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG5pbXBvcnQge0NhcnRvZ3JhcGh5fSBmcm9tICcuL2NhcnRvZ3JhcGh5Lm1vZGVsJzsgXHJcbi8qKlxyXG4gKiBTZXJ2aWNlIHBhcmFtZXRlciBtb2RlbFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIENhcnRvZ3JhcGh5UGFyYW1ldGVyIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiBuYW1lKi9cclxuICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG4gIFxyXG4gIC8qKiB0eXBlKi9cclxuICBwdWJsaWMgdHlwZTogc3RyaW5nO1xyXG4gICAgXHJcbiAgLyoqIHZhbHVlKi8gIFxyXG4gIHB1YmxpYyB2YWx1ZTogc3RyaW5nO1xyXG4gIFxyXG4gIC8qKiBvcmRlciovICBcclxuICBwdWJsaWMgb3JkZXI6IHN0cmluZztcclxuXHJcbiAgLyoqIGNhcnRvZ3JhcGh5Ki9cclxuICBwdWJsaWMgY2FydG9ncmFwaHk6IENhcnRvZ3JhcGh5O1xyXG5cclxufVxyXG4iLCJpbXBvcnQgeyBDYXJ0b2dyYXBoeVBhcmFtZXRlciB9IGZyb20gJy4vY2FydG9ncmFwaHktcGFyYW1ldGVyLm1vZGVsJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcblxyXG4vKiogU2VydmljZSBwYXJhbWV0ZXIgbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKCkgXHJcbmV4cG9ydCBjbGFzcyBDYXJ0b2dyYXBoeVBhcmFtZXRlclNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxDYXJ0b2dyYXBoeVBhcmFtZXRlcj4ge1xyXG5cclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgQ0FSVE9HUkFQSFlfUEFSQU1FVEVSX0FQSSA9ICdjYXJ0b2dyYXBoeS1wYXJhbWV0ZXJzJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoQ2FydG9ncmFwaHlQYXJhbWV0ZXIsIFwiY2FydG9ncmFwaHktcGFyYW1ldGVyc1wiLCBpbmplY3Rvcik7XHJcbiAgfVxyXG4gIFxyXG4gIC8qKiByZW1vdmUgc2VydmljZSBwYXJhbWV0ZXIqL1xyXG4gIHJlbW92ZShpdGVtOiBDYXJ0b2dyYXBoeVBhcmFtZXRlcikge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIHNlcnZpY2UgcGFyYW1ldGVyKi9cclxuICBzYXZlKGl0ZW06IENhcnRvZ3JhcGh5UGFyYW1ldGVyKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgIGlmIChpdGVtLl9saW5rcyE9bnVsbCkge1xyXG4gICAgICBcclxuICAgICAgXHJcbiAgICAgIGlmIChpdGVtLmNhcnRvZ3JhcGh5ICE9bnVsbCl7XHJcbiAgICAgICAgICBsZXQgY2FydG9ncmFwaHkgPSAgaXRlbS5jYXJ0b2dyYXBoeTtcclxuICAgICAgICAgIGRlbGV0ZSBpdGVtLmNhcnRvZ3JhcGh5O1xyXG4gICAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ2NhcnRvZ3JhcGh5JyxjYXJ0b2dyYXBoeSkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7ICAgICAgICAgICAgXHJcbiAgICAgICAgICBcclxuICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG4gICAgICB9XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuICAgICAgXHJcbiAgICAgIFxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaXRlbS5jYXJ0b2dyYXBoeSA9IGl0ZW0uY2FydG9ncmFwaHkuX2xpbmtzLnNlbGYuaHJlZjtcclxuICBcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5DQVJUT0dSQVBIWV9QQVJBTUVURVJfQVBJKSAsIGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgXHJcbn1cclxuIiwiaW1wb3J0IHsgQ2FydG9ncmFwaHlQYXJhbWV0ZXIgfSBmcm9tICcuL2NhcnRvZ3JhcGh5LXBhcmFtZXRlci5tb2RlbCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5cclxuLyoqIFNlcnZpY2UgcGFyYW1ldGVyIG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpIFxyXG5leHBvcnQgY2xhc3MgQ2FydG9ncmFwaHlTcGF0aWFsU2VsZWN0aW9uUGFyYW1ldGVyU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPENhcnRvZ3JhcGh5UGFyYW1ldGVyPiB7XHJcblxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBDQVJUT0dSQVBIWV9TUEFUSUFMX1NFTEVDVElPTl9QQVJBTUVURVJfQVBJID0gJ2NhcnRvZ3JhcGh5LXNwYXRpYWwtc2VsZWN0aW9uLXBhcmFtZXRlcnMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihDYXJ0b2dyYXBoeVBhcmFtZXRlciwgXCJjYXJ0b2dyYXBoeS1zcGF0aWFsLXNlbGVjdGlvbi1wYXJhbWV0ZXJzXCIsIGluamVjdG9yKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqIHJlbW92ZSBzZXJ2aWNlIHBhcmFtZXRlciovXHJcbiAgcmVtb3ZlKGl0ZW06IENhcnRvZ3JhcGh5UGFyYW1ldGVyKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgc2VydmljZSBwYXJhbWV0ZXIqL1xyXG4gIHNhdmUoaXRlbTogQ2FydG9ncmFwaHlQYXJhbWV0ZXIpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIFxyXG4gICAgICBcclxuICAgICAgaWYgKGl0ZW0uY2FydG9ncmFwaHkgIT1udWxsKXtcclxuICAgICAgICAgIGxldCBjYXJ0b2dyYXBoeSA9ICBpdGVtLmNhcnRvZ3JhcGh5O1xyXG4gICAgICAgICAgZGVsZXRlIGl0ZW0uY2FydG9ncmFwaHk7XHJcbiAgICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbignY2FydG9ncmFwaHknLGNhcnRvZ3JhcGh5KS5zdWJzY3JpYmUocmVzdWx0ID0+IHsgICAgICAgICAgICBcclxuICAgICAgICAgIFxyXG4gICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH1cclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgICBcclxuICAgICAgXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpdGVtLmNhcnRvZ3JhcGh5ID0gaXRlbS5jYXJ0b2dyYXBoeS5fbGlua3Muc2VsZi5ocmVmO1xyXG4gIFxyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLkNBUlRPR1JBUEhZX1NQQVRJQUxfU0VMRUNUSU9OX1BBUkFNRVRFUl9BUEkpICwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBcclxufVxyXG4iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuaW1wb3J0IHtDYXJ0b2dyYXBoeX0gZnJvbSAnLi9jYXJ0b2dyYXBoeS5tb2RlbCc7IFxyXG4vKipcclxuICogQ2FydG9ncmFwaHkgc3R5bGUgbW9kZWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBDYXJ0b2dyYXBoeVN0eWxlIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiBuYW1lKi9cclxuICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG4gIFxyXG4gIC8qKiB0aXRsZSovXHJcbiAgcHVibGljIHRpdGxlOiBzdHJpbmc7XHJcbiAgICBcclxuICAvKiogZGVzY3JpcHRpb24qLyAgXHJcbiAgcHVibGljIGRlc2NyaXB0aW9uOiBzdHJpbmc7XHJcbiAgXHJcbiAgLyoqIGZvcm1hdCovICBcclxuICBwdWJsaWMgZm9ybWF0OiBzdHJpbmc7XHJcbiAgXHJcbiAgLyoqIHdpZHRoKi8gIFxyXG4gIHB1YmxpYyB3aWR0aDogbnVtYmVyO1xyXG4gIFxyXG4gIC8qKiBoZWlnaHQqLyAgXHJcbiAgcHVibGljIGhlaWdodDogbnVtYmVyO1xyXG4gIFxyXG4gIC8qKiB1cmwqLyAgXHJcbiAgcHVibGljIHVybDogc3RyaW5nO1xyXG5cclxuICAvKiogY2FydG9ncmFwaHkqL1xyXG4gIHB1YmxpYyBjYXJ0b2dyYXBoeTogQ2FydG9ncmFwaHk7XHJcblxyXG4gIHB1YmxpYyBkZWZhdWx0U3R5bGU6IGJvb2xlYW47XHJcblxyXG4gIHB1YmxpYyBsZWdlbmRVUkw6IGFueTtcclxuICBcclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcbmltcG9ydCB7IENhcnRvZ3JhcGh5U3R5bGUgfSBmcm9tICcuL2NhcnRvZ3JhcGh5LXN0eWxlLm1vZGVsJztcclxuXHJcbkBJbmplY3RhYmxlKHtcclxuICBwcm92aWRlZEluOiAncm9vdCdcclxufSlcclxuZXhwb3J0IGNsYXNzIENhcnRvZ3JhcGh5U3R5bGVTZXJ2aWNlIGV4dGVuZHMgUmVzdFNlcnZpY2U8Q2FydG9ncmFwaHlTdHlsZT4ge1xyXG5cclxuIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBDQVJUT0dSQVBIWV9TVFlMRVNfQVBJID0gJ2NhcnRvZ3JhcGh5LXN0eWxlcyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKENhcnRvZ3JhcGh5U3R5bGUsIFwiY2FydG9ncmFwaHktc3R5bGVzXCIsIGluamVjdG9yKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqIHJlbW92ZSBzZXJ2aWNlIHBhcmFtZXRlciovXHJcbiAgcmVtb3ZlKGl0ZW06IENhcnRvZ3JhcGh5U3R5bGUpIHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKGl0ZW0uX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgIFxyXG4gIH1cclxuICBcclxuICAvKiogc2F2ZSBzZXJ2aWNlIHBhcmFtZXRlciovXHJcbiAgc2F2ZShpdGVtOiBDYXJ0b2dyYXBoeVN0eWxlKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgIGlmIChpdGVtLl9saW5rcyE9bnVsbCkge1xyXG4gICAgICBcclxuICAgICAgXHJcbiAgICAgIGlmIChpdGVtLmNhcnRvZ3JhcGh5ICE9bnVsbCl7XHJcbiAgICAgICAgICBsZXQgY2FydG9ncmFwaHkgPSAgaXRlbS5jYXJ0b2dyYXBoeTtcclxuICAgICAgICAgIGRlbGV0ZSBpdGVtLmNhcnRvZ3JhcGh5O1xyXG4gICAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ2NhcnRvZ3JhcGh5JyxjYXJ0b2dyYXBoeSkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7ICAgICAgICAgICAgXHJcbiAgICAgICAgICBcclxuICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG4gICAgICB9XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuICAgICAgXHJcbiAgICAgIFxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaXRlbS5jYXJ0b2dyYXBoeSA9IGl0ZW0uY2FydG9ncmFwaHkuX2xpbmtzLnNlbGYuaHJlZjtcclxuICBcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5DQVJUT0dSQVBIWV9TVFlMRVNfQVBJKSAsIGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgXHJcbn1cclxuIiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcbmltcG9ydCB7Q2FydG9ncmFwaHlHcm91cH0gZnJvbSAnLi9jYXJ0b2dyYXBoeS1ncm91cC5tb2RlbCc7XHJcbi8qKlxyXG4gKiBCYWNrZ3JvdW5kIG1vZGVsXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgQmFja2dyb3VuZCBleHRlbmRzIFJlc291cmNlIHtcclxuICAvKiogaWQgKi9cclxuICBwdWJsaWMgaWQ6IG51bWJlcjsgIFxyXG4gIFxyXG4gIC8qKiBuYW1lKi9cclxuICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG5cclxuICAvKiogZGVzY3JpcHRpb24qL1xyXG4gIHB1YmxpYyBkZXNjcmlwdGlvbjogc3RyaW5nO1xyXG5cclxuICAvKiogaW1hZ2UgKi9cclxuICBwdWJsaWMgaW1hZ2U6IHN0cmluZztcclxuXHJcbiAgLyoqIHdoZXRoZXIgYmFja2dyb3VuZCBpcyBhY3RpdmUqL1xyXG4gIHB1YmxpYyBhY3RpdmU6IEJvb2xlYW47XHJcbiAgXHJcbiAgLyoqIHN5c3RlbSBjcmVhdGVkIGRhdGUqL1xyXG4gIHB1YmxpYyBjcmVhdGVkRGF0ZTogYW55O1xyXG5cclxuICAvKiogY2FydG9ncmFwaHkgZ3JvdXAqL1xyXG4gIHB1YmxpYyBjYXJ0b2dyYXBoeUdyb3VwOiBDYXJ0b2dyYXBoeUdyb3VwO1xyXG59XHJcbiIsImltcG9ydCB7IEJhY2tncm91bmQgfSBmcm9tICcuL2JhY2tncm91bmQubW9kZWwnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuXHJcbi8qKiBCYWNrZ3JvdW5kIG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBCYWNrZ3JvdW5kU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPEJhY2tncm91bmQ+IHtcclxuXHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIEJBQ0tHUk9VTkRfQVBJID0gJ2JhY2tncm91bmRzJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoQmFja2dyb3VuZCwgXCJiYWNrZ3JvdW5kc1wiLCBpbmplY3Rvcik7XHJcbiAgfVxyXG4gIFxyXG4gIC8qKiByZW1vdmUgYmFja2dyb3VuZCovXHJcbiAgcmVtb3ZlKGl0ZW06IEJhY2tncm91bmQpIHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKGl0ZW0uX2xpbmtzLnNlbGYuaHJlZik7ICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIGJhY2tncm91bmQqL1xyXG4gIHNhdmUoaXRlbTogQmFja2dyb3VuZCk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICBsZXQgYmFja2dyb3VuZENhcnRvZ3JhcGh5R3JvdXA6YW55ID0ge30gICAgICAgICBcclxuICAgIFxyXG4gICAgYmFja2dyb3VuZENhcnRvZ3JhcGh5R3JvdXAuX2xpbmtzPSB7fTtcclxuICAgIGJhY2tncm91bmRDYXJ0b2dyYXBoeUdyb3VwLl9saW5rcy5zZWxmID0ge307XHJcbiAgICBiYWNrZ3JvdW5kQ2FydG9ncmFwaHlHcm91cC5fbGlua3Muc2VsZi5ocmVmPVwiXCI7XHJcbiAgICBpdGVtLmNhcnRvZ3JhcGh5R3JvdXA7XHJcblxyXG4gICAgaWYgKGl0ZW0uY2FydG9ncmFwaHlHcm91cCE9bnVsbCl7XHJcbiAgICAgIGJhY2tncm91bmRDYXJ0b2dyYXBoeUdyb3VwID0gaXRlbS5jYXJ0b2dyYXBoeUdyb3VwO1xyXG4gICAgICAgIGlmICh0eXBlb2YgaXRlbS5jYXJ0b2dyYXBoeUdyb3VwLl9saW5rcyE9ICd1bmRlZmluZWQnKSB7IFxyXG4gICAgICAgICAgICBpdGVtLmNhcnRvZ3JhcGh5R3JvdXAgPSBpdGVtLmNhcnRvZ3JhcGh5R3JvdXAuX2xpbmtzLnNlbGYuaHJlZjtcclxuICAgICAgICB9ICAgIFxyXG4gICAgIH1cclxuXHJcbiAgICBpZiAoaXRlbS5fbGlua3MhPW51bGwpIHtcclxuICAgICAgLy91cGRhdGUgcmVsYXRpb25zXHJcbiAgICAgIGRlbGV0ZSBpdGVtLmNhcnRvZ3JhcGh5R3JvdXA7ICAgICAgICBcclxuICAgICAgXHJcbiAgICAgIGlmIChiYWNrZ3JvdW5kQ2FydG9ncmFwaHlHcm91cC5fbGlua3Muc2VsZi5ocmVmPT0nJyl7XHJcbiAgICAgICAgIGl0ZW0uZGVsZXRlUmVsYXRpb24oJ2NhcnRvZ3JhcGh5R3JvdXAnLGJhY2tncm91bmRDYXJ0b2dyYXBoeUdyb3VwKS5zdWJzY3JpYmUocmVzdWx0ID0+IHsgICAgIFxyXG5cclxuICAgICAgICAgIFxyXG4gICAgICAgICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG4gICAgICAgICAgXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbignY2FydG9ncmFwaHlHcm91cCcsYmFja2dyb3VuZENhcnRvZ3JhcGh5R3JvdXApLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICAgICBcclxuXHJcbiAgICAgIFxyXG4gICAgICAgICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7ICAgICAgICAgICBcclxuICAgICAgIH0gXHJcbiAgICAgICBcclxuICAgICAgICAgXHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuXHJcbiAgICAgICAgICAgXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLkJBQ0tHUk9VTkRfQVBJKSAsIGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgXHJcbn1cclxuIiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcbmltcG9ydCB7VHJlZU5vZGV9IGZyb20gJy4vdHJlZS1ub2RlLm1vZGVsJztcclxuaW1wb3J0IHtSb2xlfSBmcm9tICcuLi9yb2xlL3JvbGUubW9kZWwnOyAgICBcclxuLyoqXHJcbiAqIFRyZWUgbW9kZWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBUcmVlIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiBpZCAqL1xyXG4gIHB1YmxpYyBpZDogbnVtYmVyO1xyXG4gIC8qKiBuYW1lICovXHJcbiAgcHVibGljIG5hbWU6IHN0cmluZztcclxuICAvKiogZGVzY3JpcHRpb24gKi9cclxuICBwdWJsaWMgZGVzY3JpcHRpb246IHN0cmluZztcclxuICAvKiogaW1hZ2UgKi9cclxuICBwdWJsaWMgaW1hZ2U6IHN0cmluZztcclxuICAvKiogbm9kZXMgKi9cclxuICBwdWJsaWMgbm9kZXM6IFRyZWVOb2RlW107XHJcbiAgLyoqIGF2YWlsYWJsZSByb2xlcyAqL1xyXG4gIHB1YmxpYyBhdmFpbGFibGVSb2xlcyA6IFJvbGVbXTtcclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgVHJlZSB9IGZyb20gJy4vdHJlZS5tb2RlbCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5cclxuLyoqIFRyZWUgbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFRyZWVTZXJ2aWNlIGV4dGVuZHMgUmVzdFNlcnZpY2U8VHJlZT4ge1xyXG4gIFxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBUUkVFX0FQSSA9ICd0cmVlcyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKFRyZWUsIFwidHJlZXNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIHRyZWUqL1xyXG4gIHJlbW92ZShpdGVtOiBUcmVlKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgdHJlZSovXHJcbiAgc2F2ZShpdGVtOiBUcmVlKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgIGlmIChpdGVtLl9saW5rcyE9bnVsbCkge1xyXG4gICAgICBcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5UUkVFX0FQSSkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG5pbXBvcnQge0NhcnRvZ3JhcGh5fSBmcm9tICcuLi9jYXJ0b2dyYXBoeS9jYXJ0b2dyYXBoeS5tb2RlbCc7XHJcbmltcG9ydCB7VHJlZX0gZnJvbSAnLi90cmVlLm1vZGVsJztcclxuLyoqXHJcbiAqIFRyZWUgbm9kZSBtb2RlbFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFRyZWVOb2RlIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gIC8qKiBuYW1lICovXHJcbiAgcHVibGljIG5hbWU6IHN0cmluZztcclxuICAvKiogdG9vbHRpcCovXHJcbiAgcHVibGljIHRvb2x0aXA6IHN0cmluZztcclxuICAvKiogZGVzY3JpcHRpb24qL1xyXG4gIHB1YmxpYyBkZXNjcmlwdGlvbjogc3RyaW5nO1xyXG4gIC8qKiBkYXRhc2V0VVJMKi9cclxuICBwdWJsaWMgZGF0YXNldFVSTDogc3RyaW5nO1xyXG4gIC8qKiBtZXRhZGF0YVVSTCovXHJcbiAgcHVibGljIG1ldGFkYXRhVVJMOiBzdHJpbmc7XHJcbiAgLyoqIG9yZGVyKi9cclxuICBwdWJsaWMgb3JkZXIgOiBudW1iZXI7XHJcbiAgLyoqIHdoZXRoZXIgdHJlZSBub2RlIGlzIGFjdGl2ZSovXHJcbiAgcHVibGljIGFjdGl2ZTogYm9vbGVhbjtcclxuICAvKiogcGFyZW50IHRyZWUgbm9kZSAqL1xyXG4gIHB1YmxpYyByYWRpbzogYm9vbGVhbjtcclxuICAvKiogcGFyZW50IHRyZWUgbm9kZSAqL1xyXG4gIHB1YmxpYyBwYXJlbnQ6IFRyZWVOb2RlO1xyXG4gIC8qKiBkaXNwbGF5ZWQgY2FydG9ncmFwaHkgKi8gIFxyXG4gIHB1YmxpYyBjYXJ0b2dyYXBoeTogQ2FydG9ncmFwaHk7XHJcbiAgLyoqIHRyZWUgKi8gIFxyXG4gIHB1YmxpYyB0cmVlOiBUcmVlO1xyXG4gIC8qKiBmaWx0ZXJHZXRGZWF0dXJlSW5mbyAqLyAgXHJcbiAgcHVibGljIGZpbHRlckdldEZlYXR1cmVJbmZvOiBib29sZWFuO1xyXG4gIC8qKiBmaWx0ZXJHZXRNYXAgKi8gIFxyXG4gIHB1YmxpYyBmaWx0ZXJHZXRNYXA6IGJvb2xlYW47XHJcbiAgLyoqIGZpbHRlclNlbGVjdGFibGUgKi8gIFxyXG4gIHB1YmxpYyBmaWx0ZXJTZWxlY3RhYmxlOiBib29sZWFuO1xyXG4gIC8qKiBzdHlsZSAqLyAgXHJcbiAgcHVibGljIHN0eWxlOiBzdHJpbmc7XHJcbiAgXHJcblxyXG59XHJcbiIsImltcG9ydCB7IFRyZWVOb2RlIH0gZnJvbSAnLi90cmVlLW5vZGUubW9kZWwnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuXHJcbi8qKiBUcmVlIG5vZGUgbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKCkgXHJcbmV4cG9ydCBjbGFzcyBUcmVlTm9kZVNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxUcmVlTm9kZT4ge1xyXG4gIFxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBUUkVFX05PREVfQVBJID0gJ3RyZWUtbm9kZXMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihUcmVlTm9kZSwgXCJ0cmVlLW5vZGVzXCIsIGluamVjdG9yKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqIHJlbW92ZSB0cmVlIG5vZGUqL1xyXG4gIHJlbW92ZShpdGVtOiBUcmVlTm9kZSkge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIHRyZWUgbm9kZSovXHJcbiAgc2F2ZShpdGVtOiBUcmVlTm9kZSk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICBpZiAoaXRlbS5fbGlua3MhPW51bGwpIHtcclxuICAgICAgY29uc3QgaXRlbVRyZWUgPSBpdGVtLnRyZWU7XHJcbiAgICAgIGNvbnN0IGl0ZW1DYXJ0b2dyYXBoeSA9IGl0ZW0uY2FydG9ncmFwaHk7XHJcbiAgICAgIGNvbnN0IGl0ZW1QYXJlbnQgPSBpdGVtLnBhcmVudDtcclxuICAgICAgICBcclxuICAgICAgZGVsZXRlIGl0ZW0udHJlZTtcclxuICAgICAgZGVsZXRlIGl0ZW0uY2FydG9ncmFwaHk7XHJcbiAgICAgIGRlbGV0ZSBpdGVtLnBhcmVudDtcclxuICAgICAgICBcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgICBpZiAoaXRlbVRyZWUgIT1udWxsKXtcclxuICAgICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCd0cmVlJyxpdGVtVHJlZSkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgIFxyXG4gICAgICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChpdGVtQ2FydG9ncmFwaHkgIT1udWxsKXtcclxuICAgICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCdjYXJ0b2dyYXBoeScsaXRlbUNhcnRvZ3JhcGh5KS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgXHJcbiAgICAgICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGl0ZW1QYXJlbnQgIT1udWxsKXtcclxuICAgICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCdwYXJlbnQnLGl0ZW1QYXJlbnQpLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICBcclxuICAgICAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNle1xyXG4gICAgICAgICAgbGV0IHRyZWVOb2RlUGFyZW50OmFueSA9IHt9O1xyXG4gICAgICAgICAgdHJlZU5vZGVQYXJlbnQuX2xpbmtzPSB7fTtcclxuICAgICAgICAgIHRyZWVOb2RlUGFyZW50Ll9saW5rcy5zZWxmID0ge307XHJcbiAgICAgICAgICB0cmVlTm9kZVBhcmVudC5fbGlua3Muc2VsZi5ocmVmPVwiXCI7XHJcbiAgICAgICAgICBpdGVtLmRlbGV0ZVJlbGF0aW9uKCdwYXJlbnQnLCB0cmVlTm9kZVBhcmVudCkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaWYgKGl0ZW0udHJlZSAmJiBpdGVtLnRyZWUuX2xpbmtzICYmIGl0ZW0udHJlZS5fbGlua3Muc2VsZikge1xyXG4gICAgICAgIGl0ZW0udHJlZSA9IGl0ZW0udHJlZS5fbGlua3Muc2VsZi5ocmVmO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChpdGVtLmNhcnRvZ3JhcGh5ICYmIGl0ZW0uY2FydG9ncmFwaHkuX2xpbmtzICYmIGl0ZW0uY2FydG9ncmFwaHkuX2xpbmtzLnNlbGYpIHtcclxuICAgICAgICBpdGVtLmNhcnRvZ3JhcGh5ID0gaXRlbS5jYXJ0b2dyYXBoeS5fbGlua3Muc2VsZi5ocmVmO1xyXG4gICAgICB9ICAgICAgXHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuVFJFRV9OT0RFX0FQSSkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG59XHJcbiIsImltcG9ydCB7UmVzb3VyY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2UnO1xyXG5pbXBvcnQge1RyZWV9IGZyb20gJy4uL3RyZWUvdHJlZS5tb2RlbCc7XHJcbmltcG9ydCB7Um9sZX0gZnJvbSAnLi4vcm9sZS9yb2xlLm1vZGVsJztcclxuaW1wb3J0IHtDYXJ0b2dyYXBoeUdyb3VwfSBmcm9tICcuLi9jYXJ0b2dyYXBoeS9jYXJ0b2dyYXBoeS1ncm91cC5tb2RlbCc7XHJcbmltcG9ydCB7QXBwbGljYXRpb25QYXJhbWV0ZXJ9IGZyb20gJy4vYXBwbGljYXRpb24tcGFyYW1ldGVyLm1vZGVsJztcclxuaW1wb3J0IHtBcHBsaWNhdGlvbkJhY2tncm91bmR9IGZyb20gJy4vYXBwbGljYXRpb24tYmFja2dyb3VuZC5tb2RlbCc7XHJcblxyXG4vL0ZJWE1FIGVuc3VyZSBhcHBsaWNhdGlvbiBjcmVhdGlvbiBpbiBhZG1pbiBhcHAgdXBvbiBpbml0aWFsaXphdGlvbiAoYXMgaXQgaXMgZG9uZSB3aXRoIFJvbGVzIGFuZCBkZWZhdWx0IFVzZXJzKVxyXG4vKiogVGVycml0b3JpYWwgYXBwbGljdGlvbiBuYW1lICovXHJcbmV4cG9ydCBjb25zdCBURVJSSVRPUklBTF9BUFBfTkFNRTpzdHJpbmcgID0gXCJBcGxpY2FjacOzbiBUZXJyaXRvcmlhbFwiO1xyXG5cclxuLyoqXHJcbiAqIEFwcGxpY2F0aW9uIG1vZGVsXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgQXBwbGljYXRpb24gZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgLyoqIGlkICovXHJcbiAgcHVibGljIGlkOiBudW1iZXI7ICBcclxuICBcclxuICAvKiogbmFtZSovXHJcbiAgcHVibGljIG5hbWU6IHN0cmluZztcclxuXHJcbiAgLyoqIHR5cGUqL1xyXG4gIHB1YmxpYyB0eXBlOiBzdHJpbmc7XHJcbiAgXHJcbiAgLyoqIHRpdGxlKi9cclxuICBwdWJsaWMgdGl0bGU6IHN0cmluZztcclxuICBcclxuICAvKiogdGhlbWUqL1xyXG4gIHB1YmxpYyB0aGVtZTogc3RyaW5nO1xyXG5cclxuICAgIFxyXG4gIC8qKiB1cmxUZW1wbGF0ZSovXHJcbiAgcHVibGljIGpzcFRlbXBsYXRlOiBzdHJpbmc7XHJcbiAgXHJcbiAgXHJcbiAgLyoqIHN5c3RlbSBjcmVhdGVkIGRhdGUqL1xyXG4gIHB1YmxpYyBjcmVhdGVkRGF0ZTogYW55O1xyXG4gIFxyXG4gIC8qKiBhdmFpbGFibGUgcm9sZXMqL1xyXG4gIHB1YmxpYyBhdmFpbGFibGVSb2xlcyA6IFJvbGVbXTtcclxuICBcclxuICAvKiogdHJlZXMqL1xyXG4gIHB1YmxpYyB0cmVlcyA6IFRyZWVbXTtcclxuICBcclxuICAvKiogc2NhbGVzIChjb21tYS1zZXBhcmF0ZWQgdmFsdWVzKSovXHJcbiAgcHVibGljIHNjYWxlczogc3RyaW5nW107XHJcbiAgXHJcbiAgLyoqIHByb2plY3Rpb25zKGNvbW1hLXNlcGFyYXRlZCBFUFNHIGNvZGVzKSovXHJcbiAgcHVibGljIHNyczogc3RyaW5nO1xyXG4gIFxyXG4gIC8qKiB3aGV0aGVyIGFwcGxpY2F0aW9uIHRyZWUgd2lsbCBhdXRvIHJlZnJlc2gqLyAgXHJcbiAgcHVibGljIHRyZWVBdXRvUmVmcmVzaDogQm9vbGVhbjtcclxuXHJcbiAgLyoqIGJhY2tncm91bmRzKi9cclxuICBwdWJsaWMgYmFja2dyb3VuZHM6IEFwcGxpY2F0aW9uQmFja2dyb3VuZFtdO1xyXG5cclxuICAvKiogc2l0dWF0aW9uIG1hcCovXHJcbiAgcHVibGljIHNpdHVhdGlvbk1hcDogQ2FydG9ncmFwaHlHcm91cDsgICAgXHJcbiAgXHJcbiAgLyoqIHBhcmFtZXRlcnMqL1xyXG4gIHB1YmxpYyBwYXJhbWV0ZXJzOiBBcHBsaWNhdGlvblBhcmFtZXRlcltdO1xyXG59XHJcbiIsImltcG9ydCB7IEFwcGxpY2F0aW9uIH0gZnJvbSAnLi9hcHBsaWNhdGlvbi5tb2RlbCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBDYXJ0b2dyYXBoeUdyb3VwIH0gZnJvbSAnLi4vY2FydG9ncmFwaHkvY2FydG9ncmFwaHktZ3JvdXAubW9kZWwnO1xyXG5cclxuLyoqIEFwcGxpY2F0aW9uIG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBBcHBsaWNhdGlvblNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxBcHBsaWNhdGlvbj4ge1xyXG4gIFxyXG5cclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgQVBQTElDQVRJT05fQVBJID0gJ2FwcGxpY2F0aW9ucyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKEFwcGxpY2F0aW9uLCBcImFwcGxpY2F0aW9uc1wiLCBpbmplY3Rvcik7XHJcbiAgfVxyXG4gIFxyXG4gIC8qKiByZW1vdmUgYXBwbGljYXRpb24qL1xyXG4gIHJlbW92ZShpdGVtOiBBcHBsaWNhdGlvbikge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIGFwcGxpY2F0aW9uKi9cclxuICBzYXZlKGl0ZW06IEFwcGxpY2F0aW9uKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuXHJcbiAgICBsZXQgYXBwbGljYXRpb25TaXR1YXRpb25NYXA6YW55ID0ge307XHJcbiAgICBhcHBsaWNhdGlvblNpdHVhdGlvbk1hcC5fbGlua3M9IHt9O1xyXG4gICAgYXBwbGljYXRpb25TaXR1YXRpb25NYXAuX2xpbmtzLnNlbGYgPSB7fTtcclxuICAgIGFwcGxpY2F0aW9uU2l0dWF0aW9uTWFwLl9saW5rcy5zZWxmLmhyZWY9XCJcIjtcclxuICAgICBcclxuICAgIGlmIChpdGVtLnNpdHVhdGlvbk1hcCE9bnVsbCl7XHJcbiAgICAgICAgYXBwbGljYXRpb25TaXR1YXRpb25NYXA9aXRlbS5zaXR1YXRpb25NYXA7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBpdGVtLnNpdHVhdGlvbk1hcC5fbGlua3MhPSAndW5kZWZpbmVkJykgeyBcclxuICAgICAgICAgICAgaXRlbS5zaXR1YXRpb25NYXAgPSBpdGVtLnNpdHVhdGlvbk1hcC5fbGlua3Muc2VsZi5ocmVmO1xyXG4gICAgICAgIH0gICAgICAgXHJcbiAgICAgfVxyXG5cclxuICAgIGlmIChpdGVtLl9saW5rcyE9bnVsbCkge1xyXG4gICAgICAvL3VwZGF0ZSByZWxhdGlvbnNcclxuICAgICAgZGVsZXRlIGl0ZW0uc2l0dWF0aW9uTWFwOyAgICAgICAgXHJcbiAgICAgIFxyXG4gICAgICBpZiAoYXBwbGljYXRpb25TaXR1YXRpb25NYXAuX2xpbmtzLnNlbGYuaHJlZj09Jycpe1xyXG4gICAgICAgICBpdGVtLmRlbGV0ZVJlbGF0aW9uKCdzaXR1YXRpb25NYXAnLGFwcGxpY2F0aW9uU2l0dWF0aW9uTWFwKS5zdWJzY3JpYmUocmVzdWx0ID0+IHsgICAgIFxyXG4gICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgICAgICBcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCdzaXR1YXRpb25NYXAnLGFwcGxpY2F0aW9uU2l0dWF0aW9uTWFwKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgICAgXHJcbiAgICAgIFxyXG4gICAgICAgICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7ICAgICAgICAgICBcclxuICAgICAgIH0gXHJcbiAgICAgICBcclxuICAgICAgICAgXHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuXHJcbiAgICAgICAgICAgXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLkFQUExJQ0FUSU9OX0FQSSkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gICAgXHJcbiAgICBcclxuICBcclxufVxyXG4iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuaW1wb3J0IHtCYWNrZ3JvdW5kfSBmcm9tICcuLi9jYXJ0b2dyYXBoeS9iYWNrZ3JvdW5kLm1vZGVsJztcclxuaW1wb3J0IHtBcHBsaWNhdGlvbn0gZnJvbSAnLi9hcHBsaWNhdGlvbi5tb2RlbCc7IFxyXG5cclxuLyoqXHJcbiAqIEFwcGxpY2F0aW9uIGJhY2tncm91bmQgbW9kZWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBBcHBsaWNhdGlvbkJhY2tncm91bmQgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgLyoqIG9yZGVyKi9cclxuICBwdWJsaWMgb3JkZXI6IE51bWJlcjtcclxuICBcclxuICAvKiogYmFja2dyb3VuZCovXHJcbiAgcHVibGljIGJhY2tncm91bmQ6IEJhY2tncm91bmQ7XHJcbiAgXHJcbiAgLyoqIGFwcGxpY2F0aW9uKi9cclxuICBwdWJsaWMgYXBwbGljYXRpb246IEFwcGxpY2F0aW9uO1xyXG5cclxufVxyXG4iLCJpbXBvcnQgeyBBcHBsaWNhdGlvbkJhY2tncm91bmQgfSBmcm9tICcuL2FwcGxpY2F0aW9uLWJhY2tncm91bmQubW9kZWwnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuXHJcbi8qKiBBcHBsaWNhdGlvbiBiYWNrZ3JvdW5kIG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpIFxyXG5leHBvcnQgY2xhc3MgQXBwbGljYXRpb25CYWNrZ3JvdW5kU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPEFwcGxpY2F0aW9uQmFja2dyb3VuZD4ge1xyXG4gIFxyXG5cclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgQVBQTElDQVRJT05fQkFDS0dST1VORF9BUEkgPSdhcHBsaWNhdGlvbi1iYWNrZ3JvdW5kcyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKEFwcGxpY2F0aW9uQmFja2dyb3VuZCwgXCJhcHBsaWNhdGlvbi1iYWNrZ3JvdW5kc1wiLCBpbmplY3Rvcik7XHJcbiAgfVxyXG4gIFxyXG4gIC8qKiByZW1vdmUgYXBwbGljYXRpb24gYmFja2dyb3VuZCovXHJcbiAgcmVtb3ZlKGl0ZW06IEFwcGxpY2F0aW9uQmFja2dyb3VuZCkge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIGFwcGxpY2F0aW9uIGJhY2tncm91bmQqL1xyXG4gIHNhdmUoaXRlbTogQXBwbGljYXRpb25CYWNrZ3JvdW5kKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgIGlmIChpdGVtLl9saW5rcyE9bnVsbCkge1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucHV0KGl0ZW0uX2xpbmtzLnNlbGYuaHJlZiwgaXRlbSk7XHJcbiAgICAgIGlmIChpdGVtLmFwcGxpY2F0aW9uICE9bnVsbCl7XHJcbiAgICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbignYXBwbGljYXRpb24nLGl0ZW0uYXBwbGljYXRpb24pLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICBcclxuICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChpdGVtLmJhY2tncm91bmQgIT1udWxsKXtcclxuICAgICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCdiYWNrZ3JvdW5kJyxpdGVtLmJhY2tncm91bmQpLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICBcclxuICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaXRlbS5hcHBsaWNhdGlvbiA9IGl0ZW0uYXBwbGljYXRpb24uX2xpbmtzLnNlbGYuaHJlZjtcclxuICAgICAgaXRlbS5iYWNrZ3JvdW5kID0gaXRlbS5iYWNrZ3JvdW5kLl9saW5rcy5zZWxmLmhyZWY7XHJcbiAgXHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuQVBQTElDQVRJT05fQkFDS0dST1VORF9BUEkpICwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBcclxufVxyXG4iLCJpbXBvcnQge1Jlc291cmNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc291cmNlJztcclxuaW1wb3J0IHtBcHBsaWNhdGlvbn0gZnJvbSAnLi9hcHBsaWNhdGlvbi5tb2RlbCc7IFxyXG5cclxuLyoqXHJcbiAqIEFwcGxpY2F0aW9uIHBhcmFtZXRlciBtb2RlbCBcclxuICovXHJcbmV4cG9ydCBjbGFzcyBBcHBsaWNhdGlvblBhcmFtZXRlciBleHRlbmRzIFJlc291cmNlIHtcclxuICAvKiogbmFtZSovXHJcbiAgcHVibGljIG5hbWU6IHN0cmluZztcclxuICBcclxuICAvKiogdHlwZSovXHJcbiAgcHVibGljIHR5cGU6IHN0cmluZztcclxuICBcclxuICAvKiogdmFsdWUqLyAgICBcclxuICBwdWJsaWMgdmFsdWU6IHN0cmluZztcclxuICBcclxuICAvKiogYXBwbGljYXRpb24qL1xyXG4gIHB1YmxpYyBhcHBsaWNhdGlvbjogQXBwbGljYXRpb247XHJcblxyXG59XHJcbiIsImltcG9ydCB7IEFwcGxpY2F0aW9uUGFyYW1ldGVyIH0gZnJvbSAnLi9hcHBsaWNhdGlvbi1wYXJhbWV0ZXIubW9kZWwnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuXHJcbi8qKiBBcHBsaWNhdGlvbiBwYXJhbWV0ZXIgbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKCkgXHJcbmV4cG9ydCBjbGFzcyBBcHBsaWNhdGlvblBhcmFtZXRlclNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxBcHBsaWNhdGlvblBhcmFtZXRlcj4ge1xyXG4gIFxyXG5cclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgQVBQTElDQVRJT05fUEFSQU1FVEVSX0FQSSA9ICdhcHBsaWNhdGlvbi1wYXJhbWV0ZXJzJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoQXBwbGljYXRpb25QYXJhbWV0ZXIsIFwiYXBwbGljYXRpb24tcGFyYW1ldGVyc1wiLCBpbmplY3Rvcik7XHJcbiAgfVxyXG4gIFxyXG4gIC8qKiByZW1vdmUgYXBwbGljYXRpb24qL1xyXG4gIHJlbW92ZShpdGVtOiBBcHBsaWNhdGlvblBhcmFtZXRlcikge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIGFwcGxpY2F0aW9uKi9cclxuICBzYXZlKGl0ZW06IEFwcGxpY2F0aW9uUGFyYW1ldGVyKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgIGlmIChpdGVtLl9saW5rcyE9bnVsbCkge1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucHV0KGl0ZW0uX2xpbmtzLnNlbGYuaHJlZiwgaXRlbSk7XHJcbiAgICAgIGlmIChpdGVtLmFwcGxpY2F0aW9uICE9bnVsbCl7XHJcbiAgICAgICAgICBpdGVtLnN1YnN0aXR1dGVSZWxhdGlvbignYXBwbGljYXRpb24nLGl0ZW0uYXBwbGljYXRpb24pLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICBcclxuICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaXRlbS5hcHBsaWNhdGlvbiA9IGl0ZW0uYXBwbGljYXRpb24uX2xpbmtzLnNlbGYuaHJlZjtcclxuICBcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5BUFBMSUNBVElPTl9QQVJBTUVURVJfQVBJKSAsIGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgXHJcbn1cclxuIiwiaW1wb3J0IHtSZXNvdXJjZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZSc7XHJcbi8qKlxyXG4gKiBDb25uZWN0aW9uIG1vZGVsXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgQ29kZUxpc3QgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgLyoqIGlkICovXHJcbiAgcHVibGljIGlkOiBudW1iZXI7XHJcbiAgLyoqIG5hbWUqL1xyXG4gIHB1YmxpYyBjb2RlTGlzdE5hbWU6IHN0cmluZztcclxuICAvKiogdHlwZSovXHJcbiAgcHVibGljIHZhbHVlOiBzdHJpbmc7XHJcbiAgLyoqIHVzZXIqL1xyXG4gIHB1YmxpYyBkZXNjcmlwdGlvbjogc3RyaW5nO1xyXG5cclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgQ29kZUxpc3QgfSBmcm9tICcuL2NvZGVsaXN0Lm1vZGVsJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcblxyXG4vKiogQ29ubmVjdGlvbiBtYW5hZ2VyIHNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgQ29kZUxpc3RTZXJ2aWNlIGV4dGVuZHMgUmVzdFNlcnZpY2U8Q29kZUxpc3Q+IHtcclxuICBcclxuIFxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBDT0RFTElTVF9BUEkgPSAnY29kZWxpc3QtdmFsdWVzJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoQ29kZUxpc3QsIFwiY29kZWxpc3QtdmFsdWVzXCIsIGluamVjdG9yKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqIHJlbW92ZSBjb25uZWN0aW9uKi9cclxuICByZW1vdmUoaXRlbTogQ29kZUxpc3QpIHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKGl0ZW0uX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgIFxyXG4gIH1cclxuICBcclxuICAvKiogc2F2ZSBjb25uZWN0aW9uKi9cclxuICBzYXZlKGl0ZW06IENvZGVMaXN0KTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgIGlmIChpdGVtLl9saW5rcyE9bnVsbCkge1xyXG4gICAgICBcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5DT0RFTElTVF9BUEkgKSwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBcclxufVxyXG4iLCJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCwgT2JzZXJ2YWJsZSwgb2YgfSBmcm9tICdyeGpzJztcclxuXHJcbi8qKiBMYXllciBtb2RlbDogY29uZmlndXJlIExheWVyIGRhdGEgYW5kIGRpc3BsYXlpbmcgY29uZmlndXJhdGlvbiAqLyBcclxuZXhwb3J0IGNsYXNzIExheWVyIHtcclxuICAvLyBEaXNwbGF5IGRhdGFcclxuICAvKiogbGF5ZXIgdmlzaWJpbGl0eSovICBcclxuICB2aXNpYmlsaXR5OiBib29sZWFuID0gZmFsc2U7XHJcbiAgLyoqIFRyYW5zcGFyZW5jeSAoVHJhbnNwYXJlbnQpIDAtMSAoT3BhcXVlKSovXHJcbiAgb3BhY2l0eTogbnVtYmVyID0gMS4wO1xyXG5cclxuICAvLyBDb25maWd1cmF0aW9uIGRhdGFcclxuICAvKiogdGl0bGUqL1xyXG4gIHRpdGxlOiBzdHJpbmc7XHJcbiAgXHJcbiAgLyoqIElkIHRvIGluZGV4Ki9cclxuICBpZDogYW55O1xyXG4gIFxyXG4gIC8qKiBTZXJ2aWNlIE5hbWUqL1xyXG4gIHNlcnZlck5hbWU6IHN0cmluZztcclxuXHJcbiAgLyoqIFNlcnZpY2UgYXR0cmlidXRpb25zKi9cclxuICBhdHRyaWJ1dGlvbnM6IHN0cmluZyA9IFwiXCI7XHJcblxyXG4gIC8qKiBSZXF1ZXN0IGZvcm1hdCAoaW1hZ2UvanBnLCAuLi4pKi9cclxuICBmb3JtYXQ6IHN0cmluZztcclxuICBcclxuICAvKiogUmVxdWVzdCBzZXJ2aWNlIHZlcnNpb24qL1xyXG4gIHZlcnNpb246c3RyaW5nO1xyXG5cclxuICAvKiogU2VydmljZSB1cmwqL1xyXG4gIHVybDogc3RyaW5nO1xyXG5cclxuICAvKiogSXMgYmFzZSBsYXllcj8qL1xyXG4gIGlzQmFzZUxheWVyOiBib29sZWFuO1xyXG5cclxuICAvKiogUmVxdWVzdCBsYXllciBuYW1lKi9cclxuICBuYW1lOiBzdHJpbmc7XHJcblxyXG4gIC8qKiBJcyB0aWxlZD8qL1xyXG4gIHRpbGVkOiBib29sZWFuO1xyXG4gIFxyXG4gIC8qKiBEZXNjcmlwdGlvbiovXHJcbiAgZGVzYzogc3RyaW5nID0gXCJcIjtcclxuICBcclxuICAvKiogIFRyYW5zcGFyZW50IHJlcXVlc3QgcGFyYW1ldGVyPyovXHJcbiAgdXJsX3RyYW5zcGFyZW50OiBzdHJpbmcgPSBcInRydWVcIjtcclxuICBcclxuICAvKiogUmVxdWVzdCBCYWNrZ3JvdW5kIHBhcmFtZXRlciBjb2xvciAoSGV4YSkqL1xyXG4gIHVybF9iZ2NvbG9yOiBzdHJpbmcgPSBcIjB4MDAwMDAwXCI7XHJcbiAgXHJcbiAgLyoqIFJlcXVlc3QgRXhjZXB0aW9uIFVSTCovXHJcbiAgdXJsX2V4Y2VwdGlvbjogc3RyaW5nO1xyXG4gIFxyXG4gIC8qKiBFeHRlbnQgZm9yIHRpbGVkIHNlcnZpY2VzKi9cclxuICBleHRlbnQ6IGFueSA9IG51bGw7XHJcblxyXG4gIC8qKiBUaWxlIGhlaWdodCAoaWYgbm90IGRlZmluZWQsIHRoZSBkZWZhdWx0IG1hcCBpcyB0YWtlbikqL1xyXG4gIHRpbGVIZWlnaHQ/Om51bWJlcjtcclxuICBcclxuICAvKiogVGlsZSB3aWR0aCAoaWYgbm90IGRlZmluZWQsIHRoZSBkZWZhdWx0IG1hcCBpcyB0YWtlbikqL1xyXG4gIHRpbGVXaWR0aD86bnVtYmVyO1xyXG4gIFxyXG4gIC8qKiBFbmFibGVkIGZvciBHZXRGZWF0dXJlSW5mbyByZXF1ZXN0cyAoZW5hYmxlZCB0byB1c2UgdGhlIHZpZXdlciBmZWF0dXJlcyBpbmZvcm1hdGlvbiB0b29sKSovXHJcbiAgcXVlcnlhYmxlPzpib29sZWFuID0gZmFsc2U7XHJcbiAgXHJcbiAgLyoqIE1pbmltdW0gc2NhbGUqL1xyXG4gIG1pbmltdW1TY2FsZT86bnVtYmVyO1xyXG4gIFxyXG4gIC8qKiBNYXhpbXVtIHNjYWxlKi9cclxuICBtYXhpbXVtU2NhbGU/Om51bWJlcjtcclxuICBcclxuICAvKiogTGlzdCBvZiBhdmFpbGFibGUgQ1JTKi9cclxuICBwcm9qZWN0aW9ucz86c3RyaW5nO1xyXG4gIFxyXG4gIC8qKiBGZWF0dXJlcyBpbmZvcm1hdGlvbiBVUkwqL1xyXG4gIGluZm9Vcmw/OnN0cmluZztcclxuICBcclxuICAvKiogTWV0YWRhdGEgaW5mb3JtYXRpb24gVVJMKi9cclxuICBtZXRhZGF0YVVybD86c3RyaW5nO1xyXG4gIFxyXG4gIC8qKiBMZWdlbmQgVVJMKi9cclxuICBsZWdlbmRVcmw/OnN0cmluZztcclxuICBcclxuICAvKiogQXJyYXkgb2YgT3B0aW9uYWxQYXJhbWV0ZXIgb2JqZWN0IHRoYXQgZGVmaW5lcyBvdGhlciBvcHRpb25hbCBwYXJhbWV0ZXItdmFsdWUgcGFpcnMgZm9yIHRoZSByZXF1ZXN0IChUSU1FIC4uLikqL1xyXG4gIG9wdGlvbmFsUGFyYW1ldGVycz86QXJyYXk8T3B0aW9uYWxQYXJhbWV0ZXI+O1xyXG59XHJcblxyXG4vKiogT3B0aW9uYWwgcGFyYW1ldGVyIG1vZGVsOiBjb25maWd1cmUgcGFyYW1ldGVyLXZhbHVlIHBhaXIgdG8gYWRkIHRvIHRoZSByZXF1ZXN0IGxheWVyIFVSTCAqL1xyXG5leHBvcnQgY2xhc3MgT3B0aW9uYWxQYXJhbWV0ZXIge1xyXG4gIC8qKiBrZXkqL2tleTpzdHJpbmc7XHJcbiAgLyoqIHZhbHVlKi92YWx1ZTpzdHJpbmc7XHJcbn1cclxuXHJcbi8qKiBMYXllciBjb25maWd1cmF0aW9uIG1vZGVsOiBtb2RpZnkgdGhlIGNvbmZpZ3VyYXRpb24gb2YgYSBsYXllciB3aGVuIGludGVyYWN0aW5nIHdpdGggdGhlIG1hcCAobWFrZSB2aXNpYmxlLCBtb3ZlIHRoZSBsYXllciAuLi4pICovXHJcbmV4cG9ydCBjbGFzcyBMYXllckNvbmZpZ3VyYXRpb24ge1xyXG4gIC8qKiBJZGVudGlmaWVyIHRvIGluZGV4Ki9pZDogYW55O1xyXG4gIC8qKiBMYXllciB2aXNpYmlsaXR5Ki92aXNpYmlsaXR5OiBib29sZWFuO1xyXG4gIC8qKiBMYXllciB0cmFuc3BhcmVuY3kgKFRyYW5zcGFyZW50KSAwLTEgKE9wYXF1ZSkqL29wYWNpdHk6IG51bWJlcjtcclxuICAvKiogTGF5ZXIgcG9zaXRpb24qL3Bvc2l0aW9uOiBudW1iZXI7XHJcbn1cclxuXHJcbi8qKiBMYXllciBncm91cCBtb2RlbCovXHJcbmV4cG9ydCBjbGFzcyBMYXllckdyb3VwIHtcclxuICAvKiogaW5pdGlhbGx5IGFjdGl2YXRlZCAoYWxsIHZpc2libGUgbGF5ZXJzKSovYWN0aXZlPzpib29sZWFuO1xyXG4gIC8qKiBncm91cCBuYW1lKi9uYW1lPzogU3RyaW5nO1xyXG4gIC8qKiBncm91cCBpZCovaWQ6IFN0cmluZztcclxuICAvKiogYXJyYXkgb2YgY2hpbGQgTGF5ZXJzKi9sYXllcnM6IEFycmF5PExheWVyPjtcclxufVxyXG5cclxuLyoqIE1hcCBvcHRpb25zIGNvbmZpZ3VyYXRpb24gbW9kZWwqL1xyXG5leHBvcnQgY2xhc3MgTWFwT3B0aW9uc0NvbmZpZ3VyYXRpb24ge1xyXG4gIC8qKiBzY2FsZXMqL3NjYWxlcz86IHN0cmluZztcclxuICAvKiogcHJvamVjdGlvbnMqL3Byb2plY3Rpb25zPzogc3RyaW5nO1xyXG4gIC8qKiBtaW5pbXVtIHNjYWxlKi9taW5TY2FsZT86bnVtYmVyO1xyXG4gIC8qKiBtYXhpbXVtIHNjYWxlKi9tYXhTY2FsZT86bnVtYmVyO1xyXG4gIC8qKiBleHRlbnQqL2V4dGVudD86YW55O1xyXG4gIC8qKiBtYXhpbXVtIGV4dGVudCovbWF4RXh0ZW50Pzphbnk7XHJcbiAgLyoqIHRpbGUgd2lkdGgqL3RpbGVXaWR0aD86bnVtYmVyO1xyXG4gIC8qKiB0aWxlIGhlaWdodCovdGlsZUhlaWdodD86bnVtYmVyO1xyXG4gIC8qKiBwYXJhbWV0ZXJzKi9wYXJhbWV0ZXJzPzogQXJyYXk8T3B0aW9uYWxQYXJhbWV0ZXI+XHJcbn1cclxuXHJcbi8qKiBNYXAgY29tcG9uZW50IHN0YXR1cyBtb2RlbCovXHJcbmV4cG9ydCBjbGFzcyBNYXBDb21wb25lbnRTdGF0dXMge1xyXG4gICAgLyoqIGxvYWRlZD8qL2xvYWRlZDogYm9vbGVhbiA9IGZhbHNlO1xyXG59XHJcblxyXG5ASW5qZWN0YWJsZSh7XHJcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXHJcbn0pXHJcblxyXG4vKiogTWFwIGNvbmZpZ3VyYXRpb24gbWFuYWdlciBzZXJ2aWNlKi9cclxuZXhwb3J0IGNsYXNzIE1hcENvbmZpZ3VyYXRpb25NYW5hZ2VyU2VydmljZSB7XHJcbiAgcHJpdmF0ZSBsYXllcnNTdWJqZWN0ID0gbmV3IEJlaGF2aW9yU3ViamVjdChbXSk7XHJcbiAgcHJpdmF0ZSBsYXllcnM6IEFycmF5PExheWVyPiA9IG51bGw7XHJcblxyXG4gIHByaXZhdGUgYmFzZUxheWVyR3JvdXBzU3ViamVjdCA9IG5ldyBCZWhhdmlvclN1YmplY3QoW10pO1xyXG4gIHByaXZhdGUgYmFzZUxheWVyR3JvdXBzOiBBcnJheTxMYXllckdyb3VwPiA9IG51bGw7XHJcblxyXG4gIHByaXZhdGUgbGF5ZXJDb25maWd1cmF0aW9uU3ViamVjdCA9IG5ldyBCZWhhdmlvclN1YmplY3QoW10pO1xyXG5cclxuICBwcml2YXRlIGFkZExheWVyc1N1YmplY3QgPSBuZXcgQmVoYXZpb3JTdWJqZWN0KFtdKTtcclxuICBwcml2YXRlIHJlbW92ZUxheWVyc1N1YmplY3QgPSBuZXcgQmVoYXZpb3JTdWJqZWN0KFtdKTtcclxuXHJcbiAgcHJpdmF0ZSBzaXR1YXRpb25NYXBDb25maWd1cmF0aW9uU3ViamVjdCA9IG5ldyBCZWhhdmlvclN1YmplY3QoW10pO1xyXG4gIHByaXZhdGUgbWFwT3B0aW9uc0NvbmZpZ3VyYXRpb25TdWJqZWN0ID0gbmV3IEJlaGF2aW9yU3ViamVjdChbXSk7XHJcblxyXG4gIHByaXZhdGUgbWFwQ29tcG9uZW50U3RhdHVzU3ViamVjdCA9IG5ldyBCZWhhdmlvclN1YmplY3QoW10pO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IqL1xyXG4gIGNvbnN0cnVjdG9yKCkgeyBcclxuICAgLy9cclxuICB9XHJcbiAgXHJcbiAgLyoqIGxheWVyIGNvdW50ICovXHJcbiAgY291bnQgPSAwO1xyXG5cclxuICAvKiogY29uZmlndXJlIHRoZSBvdmVybGF5IGxheWVycyBvZiB0aGUgbWFwLCBieSBwYXNzaW5nIGFzIGEgcGFyYW1ldGVyIGFuIGFycmF5IG9mIG9iamVjdHMgb2YgdHlwZSBMYXllciBvYmplY3RzIGRlZmluaW5nIHRoZSBsYXllcnMgdG8gbG9hZC4qL1xyXG4gIGxvYWRMYXllcnNDb25maWd1cmF0aW9uKGNvbmZpZ3VyYXRpb24pIHtcclxuICAgIGlmICh0aGlzLmxheWVycyAhPSBudWxsKSB7XHJcbiAgICAgIHRoaXMuY2xlYXJMYXllcnMoZmFsc2UpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5zZXRMYXllcnMoY29uZmlndXJhdGlvbik7XHJcbiAgfVxyXG4gIFxyXG4gIC8qKmNvbmZpZ3VyZSB0aGUgYmFzZSBsYXllcnMgb2YgdGhlIG1hcCBieSBwYXNzaW5nIGFzIGEgcGFyYW1ldGVyIGFuIGFycmF5IG9mIG9iamVjdHMgb2YgdHlwZSBMYXllckdyb3VwIGVhY2ggb2YgdGhlbSB3aXRoIHRoZSBjb3JyZXNwb25kaW5nIExheWVyIG9iamVjdHMgZGVmaW5pbmcgdGhlIGxheWVycyB0byBsb2FkLiovXHJcbiAgbG9hZEJhc2VMYXllcnNDb25maWd1cmF0aW9uKGNvbmZpZ3VyYXRpb24pIHtcclxuICAgIHRoaXMuc2V0QmFzZUxheWVyR3JvdXBzKGNvbmZpZ3VyYXRpb24pO1xyXG4gIH1cclxuXHJcbiAgLyoqIGdldCBiYXNlIGxheWVyIGdyb3VwcyovXHJcbiAgZ2V0QmFzZUxheWVyR3JvdXBzKCk6IE9ic2VydmFibGU8TGF5ZXJHcm91cFtdPiB7XHJcbiAgICByZXR1cm4gdGhpcy5iYXNlTGF5ZXJHcm91cHNTdWJqZWN0LmFzT2JzZXJ2YWJsZSgpO1xyXG4gIH1cclxuXHJcbiAgLyoqIHNldCBiYXNlIGxheWVyIGdyb3VwcyovXHJcbiAgc2V0QmFzZUxheWVyR3JvdXBzKGdyb3VwczpBcnJheTxMYXllckdyb3VwPikge1xyXG4gICAgdGhpcy5iYXNlTGF5ZXJHcm91cHMgPSBncm91cHM7XHJcbiAgICB0aGlzLnJlZnJlc2hCYXNlTGF5ZXJHcm91cHMoKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgcmVmcmVzaEJhc2VMYXllckdyb3VwcygpIHtcclxuICAgIC8vIFNlbmQgdGhlIG5ldyB2YWx1ZXMgc28gdGhhdCBhbGwgc3Vic2NyaWJlcnMgYXJlIHVwZGF0ZWRcclxuICAgIHRoaXMuYmFzZUxheWVyR3JvdXBzU3ViamVjdC5uZXh0KHRoaXMuYmFzZUxheWVyR3JvdXBzKTtcclxuICB9XHJcblxyXG4gIC8qKiBnZXQgbGF5ZXJzKi9cclxuICBnZXRMYXllcnMoKTogT2JzZXJ2YWJsZTxMYXllcltdPiB7XHJcbiAgICByZXR1cm4gdGhpcy5sYXllcnNTdWJqZWN0LmFzT2JzZXJ2YWJsZSgpO1xyXG4gIH1cclxuXHJcbiAgLyoqIHJlbW92ZSBhbGwgbGF5ZXJzIGZyb20gbWFwKi9cclxuICBjbGVhckxheWVycyhyZWZyZXNoOmJvb2xlYW4pIHtcclxuICAgIHdoaWxlKHRoaXMubGF5ZXJzLmxlbmd0aCkge1xyXG4gICAgICB0aGlzLmxheWVycy5wb3AoKTtcclxuICAgIH1cclxuICAgIGlmIChyZWZyZXNoKSB7XHJcbiAgICAgIHRoaXMucmVmcmVzaExheWVycygpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqIHNldCBsYXllcnMqL1xyXG4gIHNldExheWVycyhsYXllcnM6QXJyYXk8TGF5ZXI+KSB7XHJcbiAgICB0aGlzLmxheWVycyA9IGxheWVycztcclxuICAgIHRoaXMucmVmcmVzaExheWVycygpO1xyXG4gIH1cclxuXHJcbiAgLyoqIGFkZCBnaXZlbiBsYXllciB0byBtYXAqL1xyXG4gIGFkZExheWVyKGxheWVyOkxheWVyKSB7XHJcbiAgICB0aGlzLmxheWVycy5wdXNoKGxheWVyKTtcclxuICAgIHRoaXMucmVmcmVzaEFkZExheWVycyhsYXllcik7XHJcbiAgfVxyXG5cclxuICAvKiogYWRkIGdpdmVuIGxheWVyIHRvIG1hcCBhdCBnaXZlbiBpbmRleCovXHJcbiAgYWRkTGF5ZXJBdChsYXllcjpMYXllciwgaW5kZXg6bnVtYmVyKSB7XHJcbiAgICBpZiAoaW5kZXggPT0gMCkge1xyXG4gICAgICB0aGlzLmxheWVycyA9IFtsYXllcl0uY29uY2F0KHRoaXMubGF5ZXJzKTtcclxuICAgIH0gZWxzZSBpZiAoaW5kZXggPj0gdGhpcy5sYXllcnMubGVuZ3RoKSB7XHJcbiAgICAgIHRoaXMubGF5ZXJzLnB1c2gobGF5ZXIpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5sYXllcnMgPSB0aGlzLmxheWVycy5zbGljZSgwLCBpbmRleClcclxuICAgICAgICAgICAgICAgICAgICAuY29uY2F0KFtsYXllcl0pXHJcbiAgICAgICAgICAgICAgICAgICAgLmNvbmNhdCh0aGlzLmxheWVycy5zbGljZShpbmRleCwgdGhpcy5sYXllcnMubGVuZ3RoKSk7XHJcbiAgICB9XHJcbiAgICB0aGlzLnJlZnJlc2hBZGRMYXllcnMobGF5ZXIpO1xyXG4gICAgdGhpcy5yZWZyZXNoTGF5ZXJDb25maWd1cmF0aW9uKGxheWVyLmlkLCBudWxsLCBudWxsLCBpbmRleCk7XHJcbiAgfVxyXG5cclxuICAvKiogcmVtb3ZlIGdpdmVuIGxheWVyIGZyb20gbWFwKi9cclxuICByZW1vdmVMYXllcihsYXllcjpMYXllcikge1xyXG4gICAgdmFyIGluZGV4ID0gdGhpcy5sYXllcnMuaW5kZXhPZihsYXllcik7XHJcbiAgICB0aGlzLnJlbW92ZUxheWVySW5kZXgoaW5kZXgpO1xyXG4gIH1cclxuXHJcbiAgLyoqIHJlbW92ZSBsYXllciB3aXRoIGdpdmVuIGlkIGZyb20gbWFwICovXHJcbiAgcmVtb3ZlTGF5ZXJJZChpZCkge1xyXG4gICAgdmFyIGluZGV4ID0gLTE7XHJcbiAgICBmb3IgKHZhciBpID0gMCwgaUxlbiA9IHRoaXMubGF5ZXJzLmxlbmd0aDsgaSA8IGlMZW47IGkrKykge1xyXG4gICAgICBpZiAodGhpcy5sYXllcnNbaV0uaWQgPT0gaWQpIHtcclxuICAgICAgICBpbmRleCA9IGk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHRoaXMucmVtb3ZlTGF5ZXJJbmRleChpbmRleCk7XHJcbiAgfVxyXG5cclxuICAvKiogcmVtb3ZlIGxheWVyIGF0IGdpdmVuIGluZGV4IGZyb20gbWFwICovXHJcbiAgcmVtb3ZlTGF5ZXJJbmRleChpbmRleDpudW1iZXIpIHtcclxuICAgIHZhciBsYXllciA9IHRoaXMubGF5ZXJzW2luZGV4XTtcclxuICAgIHRoaXMubGF5ZXJzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICB0aGlzLnJlZnJlc2hSZW1vdmVMYXllcnMobGF5ZXIpO1xyXG4gIH1cclxuXHJcbiAgLyoqIHJlZnJlc2ggbGF5ZXJzICovXHJcbiAgcHJpdmF0ZSByZWZyZXNoTGF5ZXJzKCkge1xyXG4gICAgLy8gU2VuZCB0aGUgbmV3IHZhbHVlcyBzbyB0aGF0IGFsbCBzdWJzY3JpYmVycyBhcmUgdXBkYXRlZFxyXG4gICAgdGhpcy5sYXllcnNTdWJqZWN0Lm5leHQodGhpcy5sYXllcnMpO1xyXG4gIH1cclxuXHJcbiAgLyoqIE9ic2VydmFibGUgZm9yIGxheWVycyBhZGRlZCAqL1xyXG4gIGdldExheWVyc0FkZGVkKCk6IE9ic2VydmFibGU8TGF5ZXJbXT4ge1xyXG4gICAgcmV0dXJuIHRoaXMuYWRkTGF5ZXJzU3ViamVjdC5hc09ic2VydmFibGUoKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgcmVmcmVzaEFkZExheWVycyhsYXllcjpMYXllcikge1xyXG4gICAgLy8gU2VuZCB0aGUgbmV3IHZhbHVlcyBzbyB0aGF0IGFsbCBzdWJzY3JpYmVycyBhcmUgdXBkYXRlZFxyXG4gICAgdGhpcy5hZGRMYXllcnNTdWJqZWN0Lm5leHQoW2xheWVyXSk7XHJcbiAgfVxyXG5cclxuICBnZXRMYXllcnNSZW1vdmVkKCk6IE9ic2VydmFibGU8TGF5ZXJbXT4ge1xyXG4gICAgcmV0dXJuIHRoaXMucmVtb3ZlTGF5ZXJzU3ViamVjdC5hc09ic2VydmFibGUoKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgcmVmcmVzaFJlbW92ZUxheWVycyhsYXllcjpMYXllcikge1xyXG4gICAgLy8gU2VuZCB0aGUgbmV3IHZhbHVlcyBzbyB0aGF0IGFsbCBzdWJzY3JpYmVycyBhcmUgdXBkYXRlZFxyXG4gICAgdGhpcy5yZW1vdmVMYXllcnNTdWJqZWN0Lm5leHQoW2xheWVyXSk7XHJcbiAgfVxyXG5cclxuICBnZXRMYXllckNvbmZpZ3VyYXRpb25MaXN0ZW5lcigpOiBPYnNlcnZhYmxlPExheWVyQ29uZmlndXJhdGlvbltdPiB7XHJcbiAgICByZXR1cm4gdGhpcy5sYXllckNvbmZpZ3VyYXRpb25TdWJqZWN0LmFzT2JzZXJ2YWJsZSgpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBnZXRMYXllckluZGV4QnlJZChpZDpzdHJpbmcpOm51bWJlcntcclxuICAgIHZhciBpbmRleCA9IC0xO1xyXG4gICAgZm9yICh2YXIgaSA9IDAsIGlMZW4gPSB0aGlzLmxheWVycy5sZW5ndGg7IGkgPCBpTGVuOyBpKyspIHtcclxuICAgICAgaWYgKHRoaXMubGF5ZXJzW2ldLmlkID09IGlkKSB7XHJcbiAgICAgICAgaW5kZXggPSBpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gaW5kZXg7XHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBtb3ZlIGxheWVyIHdpdGggZ2l2ZW4gaWQgdG8gdGhlIGdpdmVuIGluZGV4Ki9cclxuICBtb3ZlTGF5ZXIoaWQsIGluZGV4KSB7XHJcbiAgICB2YXIgbGF5ZXJJbmRleCA9IHRoaXMuZ2V0TGF5ZXJJbmRleEJ5SWQoaWQpO1xyXG4gICAgaWYgKGxheWVySW5kZXggIT0gLTEpIHtcclxuICAgICAgdmFyIGxheWVyID0gdGhpcy5sYXllcnMuc3BsaWNlKGxheWVySW5kZXgsIDEpO1xyXG4gICAgICB0aGlzLmxheWVycyA9IFxyXG4gICAgICAgIHRoaXMubGF5ZXJzLnNsaWNlKDAsIGluZGV4KVxyXG4gICAgICAgIC5jb25jYXQobGF5ZXIpXHJcbiAgICAgICAgLmNvbmNhdCh0aGlzLmxheWVycy5zbGljZShpbmRleCwgdGhpcy5sYXllcnMubGVuZ3RoKSk7XHJcbiAgICB9XHJcbiAgICB0aGlzLnJlZnJlc2hMYXllckNvbmZpZ3VyYXRpb24oaWQsIG51bGwsIG51bGwsIGluZGV4KTtcclxuICB9XHJcblxyXG4gIC8qKiBjaGFuZ2UgdmlzaWJpbGl0eSBvZiBsYXllciB3aXRoIGdpdmVuIGlkIHRvIHRoZSBnaXZlbiB2YWx1ZSovXHJcbiAgY2hhbmdlTGF5ZXJWaXNpYmlsaXR5KGlkLCB2aXNpYmlsaXR5KSB7XHJcbiAgICB0aGlzLnJlZnJlc2hMYXllckNvbmZpZ3VyYXRpb24oaWQsIG51bGwsIHZpc2liaWxpdHksIG51bGwpO1xyXG4gIH1cclxuXHJcbiAgLyoqIGNoYW5nZSBvcGFjaXR5IG9mIGxheWVyIHdpdGggZ2l2ZW4gaWQgdG8gdGhlIGdpdmVuIHZhbHVlKi9cclxuICBjaGFuZ2VMYXllck9wYWNpdHkoaWQsIG9wYWNpdHkpIHtcclxuICAgIHRoaXMucmVmcmVzaExheWVyQ29uZmlndXJhdGlvbihpZCwgb3BhY2l0eSwgbnVsbCwgbnVsbCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHJlZnJlc2hMYXllckNvbmZpZ3VyYXRpb24oaWQsIG9wYWNpdHksIHZpc2liaWxpdHksIHBvc2l0aW9uKSB7XHJcbiAgICAvLyBTZW5kIHRoZSBuZXcgdmFsdWVzIHNvIHRoYXQgYWxsIHN1YnNjcmliZXJzIGFyZSB1cGRhdGVkXHJcbiAgICB2YXIgbGF5ZXIgPSBuZXcgTGF5ZXJDb25maWd1cmF0aW9uKCk7XHJcbiAgICBsYXllci5pZCA9IGlkO1xyXG4gICAgbGF5ZXIub3BhY2l0eSA9IG9wYWNpdHk7XHJcbiAgICBsYXllci52aXNpYmlsaXR5ID0gdmlzaWJpbGl0eTtcclxuICAgIGxheWVyLnBvc2l0aW9uID0gcG9zaXRpb247XHJcbiAgICB0aGlzLmxheWVyQ29uZmlndXJhdGlvblN1YmplY3QubmV4dChbbGF5ZXJdKTtcclxuICB9XHJcblxyXG4gIGdldFNpdHVhdGlvbk1hcENvbmZpZ3VyYXRpb25MaXN0ZW5lcigpOiBPYnNlcnZhYmxlPExheWVyW10+IHtcclxuICAgIHJldHVybiB0aGlzLnNpdHVhdGlvbk1hcENvbmZpZ3VyYXRpb25TdWJqZWN0LmFzT2JzZXJ2YWJsZSgpO1xyXG4gIH1cclxuXHJcbiAgLyoqIGNvbmZpZ3VyZSB0aGUgc2l0dWF0aW9uIG1hcCBvZiB0aGUgbWFwIGNvbXBvbmVudCBieSBwYXNzaW5nIGFzIGEgcGFyYW1ldGVyIGFuIGFycmF5IG9mIG9iamVjdHMgb2YgdHlwZSBMYXllckdyb3VwLCBlYWNoIG9mIHRoZW0gd2l0aCB0aGUgY29ycmVzcG9uZGluZyBMYXllciBvYmplY3RzIGRlZmluaW5nIHRoZSBsYXllcnMgdG8gbG9hZCBhcyBzaXR1YXRpb24gbWFwLiovXHJcbiAgbG9hZFNpdHVhdGlvbk1hcENvbmZpZ3VyYXRpb24obGF5ZXJzOkFycmF5PExheWVyPikge1xyXG4gICAgLy8gU2VuZCB0aGUgbmV3IHZhbHVlcyBzbyB0aGF0IGFsbCBzdWJzY3JpYmVycyBhcmUgdXBkYXRlZFxyXG4gICAgdGhpcy5zaXR1YXRpb25NYXBDb25maWd1cmF0aW9uU3ViamVjdC5uZXh0KGxheWVycyk7XHJcbiAgfVxyXG5cclxuICBnZXRNYXBPcHRpb25zQ29uZmlndXJhdGlvbkxpc3RlbmVyKCk6IE9ic2VydmFibGU8TWFwT3B0aW9uc0NvbmZpZ3VyYXRpb25bXT4ge1xyXG4gICAgcmV0dXJuIHRoaXMubWFwT3B0aW9uc0NvbmZpZ3VyYXRpb25TdWJqZWN0LmFzT2JzZXJ2YWJsZSgpO1xyXG4gIH1cclxuXHJcbiAgLyoqIGxvYWQgbWFwIG9wdGlvbnMgY29uZmlndXJhdGlvbiAqL1xyXG4gIGxvYWRNYXBPcHRpb25zQ29uZmlndXJhdGlvbihjb25maWd1cmF0aW9uOk1hcE9wdGlvbnNDb25maWd1cmF0aW9uKSB7XHJcbiAgICAvLyBTZW5kIHRoZSBuZXcgdmFsdWVzIHNvIHRoYXQgYWxsIHN1YnNjcmliZXJzIGFyZSB1cGRhdGVkXHJcbiAgICB0aGlzLm1hcE9wdGlvbnNDb25maWd1cmF0aW9uU3ViamVjdC5uZXh0KFtjb25maWd1cmF0aW9uXSk7XHJcbiAgfVxyXG5cclxuICBnZXRNYXBDb21wb25lbnRTdGF0dXNMaXN0ZW5lcigpOiBPYnNlcnZhYmxlPE1hcENvbXBvbmVudFN0YXR1c1tdPiB7XHJcbiAgICByZXR1cm4gdGhpcy5tYXBDb21wb25lbnRTdGF0dXNTdWJqZWN0LmFzT2JzZXJ2YWJsZSgpO1xyXG4gIH1cclxuICBcclxuICAvKiogc2V0IG1hcCBjb21wb25lbnQgc3RhdHVzICovXHJcbiAgc2V0TWFwQ29tcG9uZW50U3RhdHVzKHN0YXR1czpNYXBDb21wb25lbnRTdGF0dXMpIHtcclxuICAgIC8vTm90aWZ5IHRoZSBtYXAgY29tcG9uZW50IHN0YXR1c1xyXG4gICAgdGhpcy5tYXBDb21wb25lbnRTdGF0dXNTdWJqZWN0Lm5leHQoW3N0YXR1c10pO1xyXG4gIH1cclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgRGlyZWN0aXZlLCBJbnB1dCwgVGVtcGxhdGVSZWYsIFZpZXdDb250YWluZXJSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgUHJpbmNpcGFsIH0gZnJvbSAnLi9wcmluY2lwYWwuc2VydmljZSc7XHJcblxyXG4vKipcclxuICogQHdoYXRJdERvZXMgQ29uZGl0aW9uYWxseSBpbmNsdWRlcyBhbiBIVE1MIGVsZW1lbnQgaWYgY3VycmVudCB1c2VyIGhhcyBhbnlcclxuICogb2YgdGhlIGF1dGhvcml0aWVzIHBhc3NlZCBhcyB0aGUgYGV4cHJlc3Npb25gLlxyXG4gKlxyXG4gKiBAaG93VG9Vc2VcclxuICogYGBgXHJcbiAqICAgICA8c29tZS1lbGVtZW50ICpzaXRtdW5IYXNBbnlBdXRob3JpdHk9XCInUk9MRV9BRE1JTidcIj4uLi48L3NvbWUtZWxlbWVudD5cclxuICpcclxuICogICAgIDxzb21lLWVsZW1lbnQgKnNpdG11bkhhc0FueUF1dGhvcml0eT1cIlsnUk9MRV9BRE1JTicsICdST0xFX1VTRVInXVwiPi4uLjwvc29tZS1lbGVtZW50PlxyXG4gKiBgYGBcclxuICovXHJcbkBEaXJlY3RpdmUoe1xyXG4gICAgc2VsZWN0b3I6ICdbc2l0bXVuSGFzQW55QXV0aG9yaXR5XSdcclxufSlcclxuZXhwb3J0IGNsYXNzIEhhc0FueUF1dGhvcml0eURpcmVjdGl2ZSB7XHJcbiAgICBcclxuICAgIC8qKiBhdXRob3JpdGllcyB0byBjaGVjayAqL1xyXG4gICAgcHVibGljIGF1dGhvcml0aWVzOiBzdHJpbmdbXTsgXHJcbiAgICBcclxuICAgIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBwcmluY2lwYWw6IFByaW5jaXBhbCwgcHJpdmF0ZSB0ZW1wbGF0ZVJlZjogVGVtcGxhdGVSZWY8YW55PiwgcHJpdmF0ZSB2aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmKSB7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKiB0ZXJyaXRvcnkgdG8gY2hlY2sgYXV0aG9yaXRpZXMqL1xyXG4gICAgQElucHV0KCkgdGVycml0b3J5OiBzdHJpbmc7XHJcbiAgICBcclxuICAgIC8qKiBTZXQgd2hldGhlciBjdXJyZW50IHVzZXIgaGFzIGFueSBvZiB0aGUgZ2l2ZW4gYXV0aG9yaXRpZXMgKi9cclxuICAgIEBJbnB1dCgpXHJcbiAgICBzZXQgc2l0bXVuSGFzQW55QXV0aG9yaXR5KHZhbHVlOiBzdHJpbmd8c3RyaW5nW10pIHtcclxuICAgICAgICB0aGlzLmF1dGhvcml0aWVzID0gdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyA/IFsgPHN0cmluZz4gdmFsdWUgXSA6IDxzdHJpbmdbXT4gdmFsdWU7XHJcbiAgICAgICAgdGhpcy51cGRhdGVWaWV3KCk7XHJcbiAgICAgICAgLy8gR2V0IG5vdGlmaWVkIGVhY2ggdGltZSBhdXRoZW50aWNhdGlvbiBzdGF0ZSBjaGFuZ2VzLlxyXG4gICAgICAgIHRoaXMucHJpbmNpcGFsLmdldEF1dGhlbnRpY2F0aW9uU3RhdGUoKS5zdWJzY3JpYmUoKGlkZW50aXR5KSA9PiB0aGlzLnVwZGF0ZVZpZXcoKSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKiB1cGRhdGUgdmlldyAqL1xyXG4gICAgcHJpdmF0ZSB1cGRhdGVWaWV3KCk6IHZvaWQge1xyXG4gICAgICAgIGlmICh0aGlzLnRlcnJpdG9yeSl7XHJcbiAgICAgICAgdGhpcy5wcmluY2lwYWwuaGFzQW55QXV0aG9yaXR5T25UZXJyaXRvcnkodGhpcy5hdXRob3JpdGllcyx0aGlzLnRlcnJpdG9yeSkudGhlbigocmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMudmlld0NvbnRhaW5lclJlZi5jbGVhcigpO1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZpZXdDb250YWluZXJSZWYuY3JlYXRlRW1iZWRkZWRWaWV3KHRoaXMudGVtcGxhdGVSZWYpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5wcmluY2lwYWwuaGFzQW55QXV0aG9yaXR5KHRoaXMuYXV0aG9yaXRpZXMpLnRoZW4oKHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnZpZXdDb250YWluZXJSZWYuY2xlYXIoKTtcclxuICAgICAgICAgICAgaWYgKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy52aWV3Q29udGFpbmVyUmVmLmNyZWF0ZUVtYmVkZGVkVmlldyh0aGlzLnRlbXBsYXRlUmVmKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBEaXJlY3RpdmUsIElucHV0LCBUZW1wbGF0ZVJlZiwgVmlld0NvbnRhaW5lclJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBQcmluY2lwYWwgfSBmcm9tICcuL3ByaW5jaXBhbC5zZXJ2aWNlJztcclxuXHJcbi8qKlxyXG4gKiBAd2hhdEl0RG9lcyBDb25kaXRpb25hbGx5IGluY2x1ZGVzIGFuIEhUTUwgZWxlbWVudCBpZiBjdXJyZW50IHVzZXIgaGFzIGFueVxyXG4gKiBvZiB0aGUgYXV0aG9yaXRpZXMgcGFzc2VkIGFzIHRoZSBgZXhwcmVzc2lvbmAuXHJcbiAqXHJcbiAqIEBob3dUb1VzZVxyXG4gKiBgYGBcclxuICogICAgIDxzb21lLWVsZW1lbnQgKnNpdG11bkhhc0FueUF1dGhvcml0eT1cIidST0xFX0FETUlOJ1wiPi4uLjwvc29tZS1lbGVtZW50PlxyXG4gKlxyXG4gKiAgICAgPHNvbWUtZWxlbWVudCAqc2l0bXVuSGFzQW55QXV0aG9yaXR5PVwiWydST0xFX0FETUlOJywgJ1JPTEVfVVNFUiddXCI+Li4uPC9zb21lLWVsZW1lbnQ+XHJcbiAqIGBgYFxyXG4gKi9cclxuQERpcmVjdGl2ZSh7XHJcbiAgICBzZWxlY3RvcjogJ1tzaXRtdW5IYXNBbnlBdXRob3JpdHlPblRlcnJpdG9yeV0nXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBIYXNBbnlBdXRob3JpdHlPblRlcnJpdG9yeURpcmVjdGl2ZSB7XHJcblxyXG4gICAgLyoqIGF1dGhvcml0aWVzIHRvIGNoZWNrICovXHJcbiAgICBwdWJsaWMgYXV0aG9yaXRpZXM6IHN0cmluZ1tdOyBcclxuXHJcbiAgICAvKiogdGVycml0b3J5IHRvIGNoZWNrIGF1dGhvcml0aWVzKi9cclxuICAgIHB1YmxpYyB0ZXJyaXRvcnk6IHN0cmluZzsgXHJcblxyXG4gICAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHByaW5jaXBhbDogUHJpbmNpcGFsLCBwcml2YXRlIHRlbXBsYXRlUmVmOiBUZW1wbGF0ZVJlZjxhbnk+LCBwcml2YXRlIHZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWYpIHtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoqIFNldCB3aGV0aGVyIGN1cnJlbnQgdXNlciBoYXMgYW55IG9mIHRoZSBnaXZlbiBhdXRob3JpdGllcyBvbiB0ZXJyaXRvcnkgKi9cclxuICAgIEBJbnB1dCgpXHJcbiAgICBzZXQgc2l0bXVuSGFzQW55QXV0aG9yaXR5T25UZXJyaXRvcnkob3B0czogYW55KSB7XHJcblxyXG4gICAgICAgIHRoaXMuYXV0aG9yaXRpZXMgPSB0eXBlb2Ygb3B0cy5hdXRob3JpdGllcyA9PT0gJ3N0cmluZycgPyBbIDxzdHJpbmc+IG9wdHMuYXV0aG9yaXRpZXMgXSA6IDxzdHJpbmdbXT4gb3B0cy5hdXRob3JpdGllcztcclxuICAgICAgICB0aGlzLnRlcnJpdG9yeSA9IG9wdHMudGVycml0b3J5O1xyXG4gICAgICAgIHRoaXMudXBkYXRlVmlldygpO1xyXG4gICAgICAgIC8vIEdldCBub3RpZmllZCBlYWNoIHRpbWUgYXV0aGVudGljYXRpb24gc3RhdGUgY2hhbmdlcy5cclxuICAgICAgICB0aGlzLnByaW5jaXBhbC5nZXRBdXRoZW50aWNhdGlvblN0YXRlKCkuc3Vic2NyaWJlKChpZGVudGl0eSkgPT4gdGhpcy51cGRhdGVWaWV3KCkpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKiogdXBkYXRlIHZpZXcgKi9cclxuICAgIHByaXZhdGUgdXBkYXRlVmlldygpOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy50ZXJyaXRvcnkpe1xyXG4gICAgICAgIHRoaXMucHJpbmNpcGFsLmhhc0FueUF1dGhvcml0eU9uVGVycml0b3J5KHRoaXMuYXV0aG9yaXRpZXMsdGhpcy50ZXJyaXRvcnkpLnRoZW4oKHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnZpZXdDb250YWluZXJSZWYuY2xlYXIoKTtcclxuICAgICAgICAgICAgaWYgKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy52aWV3Q29udGFpbmVyUmVmLmNyZWF0ZUVtYmVkZGVkVmlldyh0aGlzLnRlbXBsYXRlUmVmKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMucHJpbmNpcGFsLmhhc0FueUF1dGhvcml0eSh0aGlzLmF1dGhvcml0aWVzKS50aGVuKChyZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgdGhpcy52aWV3Q29udGFpbmVyUmVmLmNsZWFyKCk7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudmlld0NvbnRhaW5lclJlZi5jcmVhdGVFbWJlZGRlZFZpZXcodGhpcy50ZW1wbGF0ZVJlZik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgTmdNb2R1bGUsIE1vZHVsZVdpdGhQcm92aWRlcnMgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XHJcbmltcG9ydCB7SHR0cENsaWVudE1vZHVsZSwgSFRUUF9JTlRFUkNFUFRPUlMsIEh0dHBDbGllbnR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgUm91dGVyTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcclxuLy9pbXBvcnQgeyBBbmd1bGFySGFsTW9kdWxlIH0gZnJvbSAnLi4vLi4vbGliL2FuZ3VsYXItaGFsJztcclxuaW1wb3J0IHtDb2RlTGlzdFNlcnZpY2V9IGZyb20gJy4vY29kZWxpc3QvY29kZWxpc3Quc2VydmljZSc7XHJcbmltcG9ydCB7VGVycml0b3J5U2VydmljZX0gZnJvbSAnLi90ZXJyaXRvcnkvdGVycml0b3J5LnNlcnZpY2UnO1xyXG5pbXBvcnQge1RlcnJpdG9yeVR5cGVTZXJ2aWNlfSBmcm9tICcuL3RlcnJpdG9yeS90ZXJyaXRvcnktdHlwZS5zZXJ2aWNlJztcclxuaW1wb3J0IHtUZXJyaXRvcnlHcm91cFR5cGVTZXJ2aWNlfSBmcm9tICcuL3RlcnJpdG9yeS90ZXJyaXRvcnktZ3JvdXAtdHlwZS5zZXJ2aWNlJztcclxuaW1wb3J0IHtVc2VyUG9zaXRpb25TZXJ2aWNlfSBmcm9tICcuL3VzZXIvdXNlci1wb3NpdGlvbi5zZXJ2aWNlJztcclxuaW1wb3J0IHtVc2VyQ29uZmlndXJhdGlvblNlcnZpY2V9IGZyb20gJy4vdXNlci91c2VyLWNvbmZpZ3VyYXRpb24uc2VydmljZSc7XHJcbmltcG9ydCB7Um9sZVNlcnZpY2V9IGZyb20gJy4vcm9sZS9yb2xlLnNlcnZpY2UnO1xyXG5pbXBvcnQge1VzZXJTZXJ2aWNlfSBmcm9tICcuL3VzZXIvdXNlci5zZXJ2aWNlJztcclxuaW1wb3J0IHtDb25uZWN0aW9uU2VydmljZX0gZnJvbSAnLi9jb25uZWN0aW9uL2Nvbm5lY3Rpb24uc2VydmljZSc7XHJcbmltcG9ydCB7VGFza1NlcnZpY2V9IGZyb20gJy4vdGFzay90YXNrLnNlcnZpY2UnO1xyXG5pbXBvcnQge1Rhc2tUeXBlU2VydmljZX0gZnJvbSAnLi90YXNrL3Rhc2stdHlwZS5zZXJ2aWNlJztcclxuaW1wb3J0IHtUYXNrR3JvdXBTZXJ2aWNlfSBmcm9tICcuL3Rhc2svdGFzay1ncm91cC5zZXJ2aWNlJztcclxuaW1wb3J0IHtUYXNrUGFyYW1ldGVyU2VydmljZX0gZnJvbSAnLi90YXNrL3Rhc2stcGFyYW1ldGVyLnNlcnZpY2UnO1xyXG5pbXBvcnQge1Rhc2tBdmFpbGFiaWxpdHlTZXJ2aWNlfSBmcm9tICcuL3Rhc2svdGFzay1hdmFpbGFiaWxpdHkuc2VydmljZSc7XHJcbmltcG9ydCB7VGFza1VJU2VydmljZX0gZnJvbSAnLi90YXNrL3Rhc2stdWkuc2VydmljZSc7XHJcbmltcG9ydCB7U2VydmljZVNlcnZpY2V9IGZyb20gJy4vc2VydmljZS9zZXJ2aWNlLnNlcnZpY2UnO1xyXG5pbXBvcnQge1NlcnZpY2VQYXJhbWV0ZXJTZXJ2aWNlfSBmcm9tICcuL3NlcnZpY2Uvc2VydmljZS1wYXJhbWV0ZXIuc2VydmljZSc7XHJcbmltcG9ydCB7Q2FydG9ncmFwaHlTZXJ2aWNlfSBmcm9tICcuL2NhcnRvZ3JhcGh5L2NhcnRvZ3JhcGh5LnNlcnZpY2UnO1xyXG5pbXBvcnQge0NhcnRvZ3JhcGh5QXZhaWxhYmlsaXR5U2VydmljZX0gZnJvbSAnLi9jYXJ0b2dyYXBoeS9jYXJ0b2dyYXBoeS1hdmFpbGFiaWxpdHkuc2VydmljZSc7XHJcbmltcG9ydCB7Q2FydG9ncmFwaHlGaWx0ZXJTZXJ2aWNlfSBmcm9tICcuL2NhcnRvZ3JhcGh5L2NhcnRvZ3JhcGh5LWZpbHRlci5zZXJ2aWNlJztcclxuaW1wb3J0IHtDYXJ0b2dyYXBoeUdyb3VwU2VydmljZX0gZnJvbSAnLi9jYXJ0b2dyYXBoeS9jYXJ0b2dyYXBoeS1ncm91cC5zZXJ2aWNlJztcclxuaW1wb3J0IHtDYXJ0b2dyYXBoeVBhcmFtZXRlclNlcnZpY2V9IGZyb20gJy4vY2FydG9ncmFwaHkvY2FydG9ncmFwaHktcGFyYW1ldGVyLnNlcnZpY2UnO1xyXG5pbXBvcnQge0JhY2tncm91bmRTZXJ2aWNlfSBmcm9tICcuL2NhcnRvZ3JhcGh5L2JhY2tncm91bmQuc2VydmljZSc7XHJcbmltcG9ydCB7VHJlZVNlcnZpY2V9IGZyb20gJy4vdHJlZS90cmVlLnNlcnZpY2UnO1xyXG5pbXBvcnQge1RyZWVOb2RlU2VydmljZX0gZnJvbSAnLi90cmVlL3RyZWUtbm9kZS5zZXJ2aWNlJztcclxuaW1wb3J0IHtBcHBsaWNhdGlvblNlcnZpY2V9IGZyb20gJy4vYXBwbGljYXRpb24vYXBwbGljYXRpb24uc2VydmljZSc7XHJcbmltcG9ydCB7QXBwbGljYXRpb25QYXJhbWV0ZXJTZXJ2aWNlfSBmcm9tICcuL2FwcGxpY2F0aW9uL2FwcGxpY2F0aW9uLXBhcmFtZXRlci5zZXJ2aWNlJztcclxuaW1wb3J0IHtBcHBsaWNhdGlvbkJhY2tncm91bmRTZXJ2aWNlfSBmcm9tICcuL2FwcGxpY2F0aW9uL2FwcGxpY2F0aW9uLWJhY2tncm91bmQuc2VydmljZSc7XHJcbmltcG9ydCB7IE1hcENvbmZpZ3VyYXRpb25NYW5hZ2VyU2VydmljZSB9IGZyb20gJy4vbWFwL21hcC1jb25maWd1cmF0aW9uLW1hbmFnZXIuc2VydmljZSc7XHJcbmltcG9ydCB7IEF1dGhTZXJ2aWNlIH0gZnJvbSAnLi9hdXRoL2F1dGguc2VydmljZSc7XHJcbmltcG9ydCB7IFByaW5jaXBhbCB9IGZyb20gJy4vYXV0aC9wcmluY2lwYWwuc2VydmljZSc7XHJcbmltcG9ydCB7IEF1dGhJbnRlcmNlcHRvciB9IGZyb20gJy4vYXV0aC9hdXRoLmludGVyY2VwdG9yJztcclxuaW1wb3J0IHsgQXV0aEV4cGlyZWRJbnRlcmNlcHRvciB9IGZyb20gJy4vYXV0aC9hdXRoLWV4cGlyZWQuaW50ZXJjZXB0b3InO1xyXG5pbXBvcnQgeyBIYXNBbnlBdXRob3JpdHlEaXJlY3RpdmUgfSBmcm9tICcuL2F1dGgvaGFzLWFueS1hdXRob3JpdHkuZGlyZWN0aXZlJztcclxuaW1wb3J0IHsgSGFzQW55QXV0aG9yaXR5T25UZXJyaXRvcnlEaXJlY3RpdmUgfSBmcm9tICcuL2F1dGgvaGFzLWFueS1hdXRob3JpdHktb24tdGVycml0b3J5LmRpcmVjdGl2ZSc7XHJcbmltcG9ydCB7IExvZ2luU2VydmljZSB9IGZyb20gJy4vYXV0aC9sb2dpbi5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQWNjb3VudFNlcnZpY2UgfSBmcm9tICcuL2FjY291bnQvYWNjb3VudC5zZXJ2aWNlJztcclxuaW1wb3J0IHtUcmFuc2xhdGVIdHRwTG9hZGVyfSBmcm9tICdAbmd4LXRyYW5zbGF0ZS9odHRwLWxvYWRlcic7XHJcbmltcG9ydCB7VHJhbnNsYXRlTG9hZGVyLCBUcmFuc2xhdGVNb2R1bGV9IGZyb20gJ0BuZ3gtdHJhbnNsYXRlL2NvcmUnO1xyXG5pbXBvcnQgeyBUcmFuc2xhdGlvblNlcnZpY2UgfSBmcm9tICcuL3RyYW5zbGF0aW9uL3RyYW5zbGF0aW9uLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBMYW5ndWFnZVNlcnZpY2UgfSBmcm9tICcuL3RyYW5zbGF0aW9uL2xhbmd1YWdlLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBEYXNoYm9hcmRTZXJ2aWNlIH0gZnJvbSAnLi9kYXNoYm9hcmQvZGFzaGJvYXJkLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBDYXBhYmlsaXRpZXNTZXJ2aWNlIH0gZnJvbSAnLi9jYXBhYmlsaXRpZXMvY2FwYWJpbGl0aWVzLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBDb25maWd1cmF0aW9uUGFyYW1ldGVyc1NlcnZpY2UgfSBmcm9tICcuL2NvbmZpZ3VyYXRpb24vY29uZmlndXJhdGlvbi1wYXJhbWV0ZXJzLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBDYXJ0b2dyYXBoeVN0eWxlU2VydmljZSB9IGZyb20gJy4vY2FydG9ncmFwaHkvY2FydG9ncmFwaHktc3R5bGUuc2VydmljZSc7XHJcbmltcG9ydCB7IENhcnRvZ3JhcGh5U3BhdGlhbFNlbGVjdGlvblBhcmFtZXRlclNlcnZpY2UgfSBmcm9tICcuL2NhcnRvZ3JhcGh5L2NhcnRvZ3JhcGh5LXNwYXRpYWwtc2VsZWN0aW9uLXBhcmFtZXRlci5zZXJ2aWNlJztcclxuaW1wb3J0IHsgR2V0SW5mb1NlcnZpY2UgfSBmcm9tICcuL2dldEluZm8vZ2V0SW5mby5zZXJ2aWNlJztcclxuLyoqIGxvYWQgaTE4biBhc3NldHMqL1xyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlVHJhbnNsYXRlTG9hZGVyKGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICByZXR1cm4gbmV3IFRyYW5zbGF0ZUh0dHBMb2FkZXIoaHR0cCwgJy4vYXNzZXRzL2kxOG4vJywgJy5qc29uJyk7XHJcbn1cclxuXHJcblxyXG4vKiogU0lUTVVOIGZyb250ZW5kIGNvcmUgbW9kdWxlICovXHJcbkBOZ01vZHVsZSh7XHJcbiAgaW1wb3J0czogW1xyXG4gICAgLypSb3V0ZXJNb2R1bGUsXHJcbiAgICBIdHRwQ2xpZW50TW9kdWxlLFxyXG4gICAgQ29tbW9uTW9kdWxlLFxyXG4gICAgQW5ndWxhckhhbE1vZHVsZSwqL1xyXG4gICAgVHJhbnNsYXRlTW9kdWxlLmZvclJvb3Qoe1xyXG4gICAgICBsb2FkZXI6IHtcclxuICAgICAgICBwcm92aWRlOiBUcmFuc2xhdGVMb2FkZXIsXHJcbiAgICAgICAgdXNlRmFjdG9yeTogKGNyZWF0ZVRyYW5zbGF0ZUxvYWRlciksXHJcbiAgICAgICAgZGVwczogW0h0dHBDbGllbnRdXHJcbiAgICAgIH1cclxuICAgIH0pLFxyXG4gIF0sXHJcbiAgZGVjbGFyYXRpb25zOiBbXHJcbiAgICBIYXNBbnlBdXRob3JpdHlEaXJlY3RpdmUsXHJcbiAgICBIYXNBbnlBdXRob3JpdHlPblRlcnJpdG9yeURpcmVjdGl2ZSxcclxuICBdLFxyXG4gIGV4cG9ydHM6IFtcclxuICAgIEhhc0FueUF1dGhvcml0eURpcmVjdGl2ZSxcclxuICAgIEhhc0FueUF1dGhvcml0eU9uVGVycml0b3J5RGlyZWN0aXZlLFxyXG4gICAgVHJhbnNsYXRlTW9kdWxlXHJcbiAgXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgU2l0bXVuRnJvbnRlbmRDb3JlTW9kdWxlIHtcclxuICBzdGF0aWMgZm9yUm9vdCgpOiBNb2R1bGVXaXRoUHJvdmlkZXJzIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIG5nTW9kdWxlOiBTaXRtdW5Gcm9udGVuZENvcmVNb2R1bGUsXHJcbiAgICAgIHByb3ZpZGVyczogW1xyXG4gICAgICAgIENvZGVMaXN0U2VydmljZSxcclxuICAgICAgICBUZXJyaXRvcnlTZXJ2aWNlLFxyXG4gICAgICAgIFRlcnJpdG9yeVR5cGVTZXJ2aWNlLFxyXG4gICAgICAgIFRlcnJpdG9yeUdyb3VwVHlwZVNlcnZpY2UsXHJcbiAgICAgICAgUm9sZVNlcnZpY2UsXHJcbiAgICAgICAgQWNjb3VudFNlcnZpY2UsXHJcbiAgICAgICAgQXV0aFNlcnZpY2UsXHJcbiAgICAgICAgVXNlclNlcnZpY2UsXHJcbiAgICAgICAgQ29ubmVjdGlvblNlcnZpY2UsXHJcbiAgICAgICAgVGFza1NlcnZpY2UsXHJcbiAgICAgICAgVGFza1R5cGVTZXJ2aWNlLFxyXG4gICAgICAgIFRhc2tVSVNlcnZpY2UsXHJcbiAgICAgICAgVGFza0dyb3VwU2VydmljZSxcclxuICAgICAgICBUYXNrUGFyYW1ldGVyU2VydmljZSxcclxuICAgICAgICBUYXNrQXZhaWxhYmlsaXR5U2VydmljZSxcclxuICAgICAgICBTZXJ2aWNlU2VydmljZSxcclxuICAgICAgICBDb25maWd1cmF0aW9uUGFyYW1ldGVyc1NlcnZpY2UsXHJcbiAgICAgICAgQ2FwYWJpbGl0aWVzU2VydmljZSxcclxuICAgICAgICBHZXRJbmZvU2VydmljZSxcclxuICAgICAgICBTZXJ2aWNlUGFyYW1ldGVyU2VydmljZSxcclxuICAgICAgICBDYXJ0b2dyYXBoeVNlcnZpY2UsXHJcbiAgICAgICAgQ2FydG9ncmFwaHlHcm91cFNlcnZpY2UsXHJcbiAgICAgICAgQ2FydG9ncmFwaHlBdmFpbGFiaWxpdHlTZXJ2aWNlLFxyXG4gICAgICAgIENhcnRvZ3JhcGh5UGFyYW1ldGVyU2VydmljZSxcclxuICAgICAgICBDYXJ0b2dyYXBoeVNwYXRpYWxTZWxlY3Rpb25QYXJhbWV0ZXJTZXJ2aWNlLFxyXG4gICAgICAgIENhcnRvZ3JhcGh5U3R5bGVTZXJ2aWNlLFxyXG4gICAgICAgIENhcnRvZ3JhcGh5RmlsdGVyU2VydmljZSxcclxuICAgICAgICBCYWNrZ3JvdW5kU2VydmljZSxcclxuICAgICAgICBUcmVlU2VydmljZSxcclxuICAgICAgICBUcmVlTm9kZVNlcnZpY2UsXHJcbiAgICAgICAgQXBwbGljYXRpb25TZXJ2aWNlLFxyXG4gICAgICAgIEFwcGxpY2F0aW9uUGFyYW1ldGVyU2VydmljZSxcclxuICAgICAgICBBcHBsaWNhdGlvbkJhY2tncm91bmRTZXJ2aWNlLFxyXG4gICAgICAgIEF1dGhJbnRlcmNlcHRvcixcclxuICAgICAgICBBdXRoRXhwaXJlZEludGVyY2VwdG9yLFxyXG4gICAgICAgIFByaW5jaXBhbCxcclxuICAgICAgICBVc2VyUG9zaXRpb25TZXJ2aWNlLFxyXG4gICAgICAgIFVzZXJDb25maWd1cmF0aW9uU2VydmljZSxcclxuICAgICAgICBMb2dpblNlcnZpY2UsXHJcbiAgICAgICAgVHJhbnNsYXRpb25TZXJ2aWNlLFxyXG4gICAgICAgIExhbmd1YWdlU2VydmljZSxcclxuICAgICAgICBEYXNoYm9hcmRTZXJ2aWNlLFxyXG4gICAgICAgIE1hcENvbmZpZ3VyYXRpb25NYW5hZ2VyU2VydmljZSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBwcm92aWRlOiBIVFRQX0lOVEVSQ0VQVE9SUyxcclxuICAgICAgICAgIHVzZUNsYXNzOiBBdXRoSW50ZXJjZXB0b3IsXHJcbiAgICAgICAgICBtdWx0aTogdHJ1ZVxyXG4gICAgICAgIH1cclxuICAgICAgICAsIHtcclxuICAgICAgICAgIHByb3ZpZGU6IEhUVFBfSU5URVJDRVBUT1JTLFxyXG4gICAgICAgICAgdXNlQ2xhc3M6IEF1dGhFeHBpcmVkSW50ZXJjZXB0b3IsXHJcbiAgICAgICAgICBtdWx0aTogdHJ1ZVxyXG4gICAgICAgIH1cclxuICAgICAgXVxyXG4gICAgfTtcclxuICB9XHJcbn1cclxuXHJcbiIsImltcG9ydCB7TW9kdWxlV2l0aFByb3ZpZGVycywgTmdNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge0h0dHBDbGllbnQsIEh0dHBDbGllbnRNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHtIYWxQYXJhbSwgUmVzdFNlcnZpY2V9IGZyb20gJy4vcmVzdC5zZXJ2aWNlJztcclxuaW1wb3J0IHtFeHRlcm5hbFNlcnZpY2V9IGZyb20gJy4vZXh0ZXJuYWwuc2VydmljZSc7XHJcbmltcG9ydCB7UmVzb3VyY2VTZXJ2aWNlfSBmcm9tICcuL3Jlc291cmNlLnNlcnZpY2UnO1xyXG5pbXBvcnQge0V4dGVybmFsQ29uZmlndXJhdGlvbkhhbmRsZXJJbnRlcmZhY2V9IGZyb20gJy4vZXh0ZXJuYWwtY29uZmlndXJhdGlvbi5oYW5kbGVyJztcclxuXHJcbmltcG9ydCAncnhqcyc7XHJcblxyXG5pbXBvcnQge1N1YlR5cGVCdWlsZGVyfSBmcm9tICcuL3N1YnR5cGUtYnVpbGRlcic7XHJcblxyXG5leHBvcnQge0V4dGVybmFsU2VydmljZX0gZnJvbSAnLi9leHRlcm5hbC5zZXJ2aWNlJztcclxuZXhwb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi9yZXN0LnNlcnZpY2UnO1xyXG5leHBvcnQge1Jlc291cmNlfSBmcm9tICcuL3Jlc291cmNlJztcclxuZXhwb3J0IHtSZXNvdXJjZUFycmF5fSBmcm9tICcuL3Jlc291cmNlLWFycmF5JztcclxuZXhwb3J0IHtSZXNvdXJjZVNlcnZpY2V9IGZyb20gJy4vcmVzb3VyY2Uuc2VydmljZSc7XHJcbmV4cG9ydCB7U29ydH0gZnJvbSAnLi9zb3J0JztcclxuZXhwb3J0IHtSZXNvdXJjZUhlbHBlcn0gZnJvbSAnLi9yZXNvdXJjZS1oZWxwZXInO1xyXG5leHBvcnQge0V4dGVybmFsQ29uZmlndXJhdGlvbn0gZnJvbSAnLi9FeHRlcm5hbENvbmZpZ3VyYXRpb24nO1xyXG5leHBvcnQge0V4dGVybmFsQ29uZmlndXJhdGlvbkhhbmRsZXJJbnRlcmZhY2V9IGZyb20gJy4vZXh0ZXJuYWwtY29uZmlndXJhdGlvbi5oYW5kbGVyJztcclxuZXhwb3J0IHtIYWxPcHRpb25zLCBIYWxQYXJhbX0gZnJvbSAnLi9yZXN0LnNlcnZpY2UnO1xyXG5leHBvcnQge1N1YlR5cGVCdWlsZGVyfSBmcm9tICcuL3N1YnR5cGUtYnVpbGRlcic7XHJcblxyXG5cclxuLyoqIEFuZ3VsYXIgSEFMIG1vZHVsZSAqL1xyXG5ATmdNb2R1bGUoe1xyXG4gICAgaW1wb3J0czogW0h0dHBDbGllbnRNb2R1bGVdLFxyXG4gICAgZGVjbGFyYXRpb25zOiBbXSxcclxuICAgIGV4cG9ydHM6IFtIdHRwQ2xpZW50TW9kdWxlXSxcclxuICAgIHByb3ZpZGVyczogW1xyXG4gICAgICAgIEV4dGVybmFsU2VydmljZSxcclxuICAgICAgICBIdHRwQ2xpZW50LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcHJvdmlkZTogUmVzb3VyY2VTZXJ2aWNlLFxyXG4gICAgICAgICAgICB1c2VDbGFzczogUmVzb3VyY2VTZXJ2aWNlLFxyXG4gICAgICAgICAgICBkZXBzOiBbRXh0ZXJuYWxTZXJ2aWNlXVxyXG4gICAgICAgIH1dXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBBbmd1bGFySGFsTW9kdWxlIHtcclxuICAgIHN0YXRpYyBmb3JSb290KCk6IE1vZHVsZVdpdGhQcm92aWRlcnMge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIG5nTW9kdWxlOiBBbmd1bGFySGFsTW9kdWxlLFxyXG4gICAgICAgICAgICBwcm92aWRlcnM6IFtcclxuICAgICAgICAgICAgICAgIEV4dGVybmFsU2VydmljZSxcclxuICAgICAgICAgICAgICAgIEh0dHBDbGllbnQsXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvdmlkZTogUmVzb3VyY2VTZXJ2aWNlLFxyXG4gICAgICAgICAgICAgICAgICAgIHVzZUNsYXNzOiBSZXNvdXJjZVNlcnZpY2UsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVwczogW0V4dGVybmFsU2VydmljZV1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn0iXSwibmFtZXMiOlsibWFwIiwiY2F0Y2hFcnJvciIsIm9ic2VydmFibGVUaHJvd0Vycm9yIiwidXJsLnBhcnNlIiwidHNsaWJfMS5fX3ZhbHVlcyIsImlzTnVsbE9yVW5kZWZpbmVkIiwiaXNQcmltaXRpdmUiLCJ1cmwiLCJIdHRwSGVhZGVycyIsIkh0dHBQYXJhbXMiLCJvYnNlcnZhYmxlT2YiLCJJbmplY3RhYmxlIiwidHNsaWJfMS5fX2V4dGVuZHMiLCJJbmplY3QiLCJtZXJnZU1hcCIsIkluamVjdG9yIiwiSHR0cENsaWVudCIsIk9ic2VydmFibGUiLCJTdWJqZWN0Iiwicm91dGVyIiwiSHR0cEVycm9yUmVzcG9uc2UiLCJSb3V0ZXIiLCJCZWhhdmlvclN1YmplY3QiLCJEaXJlY3RpdmUiLCJUZW1wbGF0ZVJlZiIsIlZpZXdDb250YWluZXJSZWYiLCJJbnB1dCIsIlRyYW5zbGF0ZUh0dHBMb2FkZXIiLCJIVFRQX0lOVEVSQ0VQVE9SUyIsIk5nTW9kdWxlIiwiVHJhbnNsYXRlTW9kdWxlIiwiVHJhbnNsYXRlTG9hZGVyIiwiSHR0cENsaWVudE1vZHVsZSJdLCJt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