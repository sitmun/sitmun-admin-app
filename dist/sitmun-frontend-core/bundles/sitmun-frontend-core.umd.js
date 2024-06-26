(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('rxjs'), require('rxjs/operators'), require('@angular/common/http'), require('url'), require('util'), require('@angular/core'), require('rxjs-compat'), require('@angular/router'), require('@ngx-translate/http-loader'), require('@ngx-translate/core')) :
    typeof define === 'function' && define.amd ? define('@sitmun/frontend-core', ['exports', 'rxjs', 'rxjs/operators', '@angular/common/http', 'url', 'util', '@angular/core', 'rxjs-compat', '@angular/router', '@ngx-translate/http-loader', '@ngx-translate/core'], factory) :
    (global = global || self, factory((global.sitmun = global.sitmun || {}, global.sitmun['frontend-core'] = {}), global.rxjs, global.rxjs.operators, global.ng.common.http, global.url, global.util, global.ng.core, global.rxjsCompat, global.ng.router, global.httpLoader, global.core$1));
}(this, (function (exports, rxjs, operators, http, url, util, core, rxjsCompat, router, httpLoader, core$1) { 'use strict';

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

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }

    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }

    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    }

    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    }

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    function __createBinding(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
    }

    function __exportStar(m, exports) {
        for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) exports[p] = m[p];
    }

    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }

    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    }

    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }

    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    };

    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }

    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
    }

    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    }

    function __asyncValues(o) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
    }

    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
        return cooked;
    };

    function __importStar(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
        result.default = mod;
        return result;
    }

    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }

    function __classPrivateFieldGet(receiver, privateMap) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to get private field on non-instance");
        }
        return privateMap.get(receiver);
    }

    function __classPrivateFieldSet(receiver, privateMap, value) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to set private field on non-instance");
        }
        privateMap.set(receiver, value);
        return value;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * REST array of resource implementation
     * @template T
     */
    var   /**
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
            this.push = (/**
             * @param {?} el
             * @return {?}
             */
            function (el) {
                _this.result.push(el);
            });
            /**
             * length of the array
             */
            this.length = (/**
             * @return {?}
             */
            function () {
                return _this.result.length;
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
            function (type, response, sortInfo) {
                /** @type {?} */
                var result = ResourceHelper.createEmptyResult(_this._embedded);
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
            function (type) {
                if (_this.next_uri) {
                    return ResourceHelper.getHttp().get(ResourceHelper.getProxy(_this.next_uri), { headers: ResourceHelper.headers }).pipe(operators.map((/**
                     * @param {?} response
                     * @return {?}
                     */
                    function (response) { return _this.init(type, response, _this.sortInfo); })), operators.catchError((/**
                     * @param {?} error
                     * @return {?}
                     */
                    function (error) { return rxjs.throwError(error); })));
                }
                return rxjs.throwError('no next defined');
            });
            /**
             * Load previous page
             */
            this.prev = (/**
             * @param {?} type
             * @return {?}
             */
            function (type) {
                if (_this.prev_uri) {
                    return ResourceHelper.getHttp().get(ResourceHelper.getProxy(_this.prev_uri), { headers: ResourceHelper.headers }).pipe(operators.map((/**
                     * @param {?} response
                     * @return {?}
                     */
                    function (response) { return _this.init(type, response, _this.sortInfo); })), operators.catchError((/**
                     * @param {?} error
                     * @return {?}
                     */
                    function (error) { return rxjs.throwError(error); })));
                }
                return rxjs.throwError('no prev defined');
            });
            /**
             * Load first page
             */
            this.first = (/**
             * @param {?} type
             * @return {?}
             */
            function (type) {
                if (_this.first_uri) {
                    return ResourceHelper.getHttp().get(ResourceHelper.getProxy(_this.first_uri), { headers: ResourceHelper.headers }).pipe(operators.map((/**
                     * @param {?} response
                     * @return {?}
                     */
                    function (response) { return _this.init(type, response, _this.sortInfo); })), operators.catchError((/**
                     * @param {?} error
                     * @return {?}
                     */
                    function (error) { return rxjs.throwError(error); })));
                }
                return rxjs.throwError('no first defined');
            });
            /**
             * Load last page
             */
            this.last = (/**
             * @param {?} type
             * @return {?}
             */
            function (type) {
                if (_this.last_uri) {
                    return ResourceHelper.getHttp().get(ResourceHelper.getProxy(_this.last_uri), { headers: ResourceHelper.headers }).pipe(operators.map((/**
                     * @param {?} response
                     * @return {?}
                     */
                    function (response) { return _this.init(type, response, _this.sortInfo); })), operators.catchError((/**
                     * @param {?} error
                     * @return {?}
                     */
                    function (error) { return rxjs.throwError(error); })));
                }
                return rxjs.throwError('no last defined');
            });
            /**
             * Load page with given pageNumber
             */
            this.page = (/**
             * @param {?} type
             * @param {?} pageNumber
             * @return {?}
             */
            function (type, pageNumber) {
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
                return ResourceHelper.getHttp().get(uri, { headers: ResourceHelper.headers }).pipe(operators.map((/**
                 * @param {?} response
                 * @return {?}
                 */
                function (response) { return _this.init(type, response, _this.sortInfo); })), operators.catchError((/**
                 * @param {?} error
                 * @return {?}
                 */
                function (error) { return rxjs.throwError(error); })));
            });
            /**
             * Sort collection based on given sort attribute
             */
            this.sortElements = (/**
             * @param {?} type
             * @param {...?} sort
             * @return {?}
             */
            function (type) {
                var sort = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    sort[_i - 1] = arguments[_i];
                }
                _this.self_uri = _this.self_uri.replace('{?page,size,sort}', '');
                _this.self_uri = _this.self_uri.replace('{&sort}', '');
                /** @type {?} */
                var uri = ResourceHelper.getProxy(_this.self_uri).concat('?', 'size=', _this.pageSize.toString(), '&page=', _this.pageNumber.toString());
                uri = _this.addSortInfo(uri);
                return ResourceHelper.getHttp().get(uri, { headers: ResourceHelper.headers }).pipe(operators.map((/**
                 * @param {?} response
                 * @return {?}
                 */
                function (response) { return _this.init(type, response, sort); })), operators.catchError((/**
                 * @param {?} error
                 * @return {?}
                 */
                function (error) { return rxjs.throwError(error); })));
            });
            /**
             * Load page with given size
             */
            this.size = (/**
             * @param {?} type
             * @param {?} size
             * @return {?}
             */
            function (type, size) {
                /** @type {?} */
                var uri = ResourceHelper.getProxy(_this.self_uri).concat('?', 'size=', size.toString());
                uri = _this.addSortInfo(uri);
                return ResourceHelper.getHttp().get(uri, { headers: ResourceHelper.headers }).pipe(operators.map((/**
                 * @param {?} response
                 * @return {?}
                 */
                function (response) { return _this.init(type, response, _this.sortInfo); })), operators.catchError((/**
                 * @param {?} error
                 * @return {?}
                 */
                function (error) { return rxjs.throwError(error); })));
            });
        }
        /** Add sort info to given URI */
        /**
         * Add sort info to given URI
         * @private
         * @param {?} uri
         * @return {?}
         */
        ResourceArray.prototype.addSortInfo = /**
         * Add sort info to given URI
         * @private
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
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
            return uri;
        };
        /** Add replace or add param value to query string */
        /**
         * Add replace or add param value to query string
         * @private
         * @param {?} query
         * @param {?} field
         * @param {?} value
         * @return {?}
         */
        ResourceArray.replaceOrAdd = /**
         * Add replace or add param value to query string
         * @private
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

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
        /**
         * get request option params
         * @param {?} params
         * @param {?=} options
         * @return {?}
         */
        ResourceHelper.optionParams = /** get request headers */
        /*public static get headers(): HttpHeaders {
                if (isNullOrUndefined(this._headers))
                  ResourceHelper._headers = new HttpHeaders();
                return ResourceHelper._headers;
            }*/
        /** set request headers */
        /*public static set headers(headers: HttpHeaders) {
              ResourceHelper._headers = headers;
            }*/
        /**
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
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                        }
                        finally { if (e_1) throw e_1.error; }
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
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                        }
                        finally { if (e_2) throw e_2.error; }
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
                        .find((/**
                     * @param {?} className
                     * @return {?}
                     */
                    function (className) { return className == 'Resource'; }))) {
                        if (resource[key]['_links'])
                            result[key] = resource[key]['_links']['self']['href'];
                    }
                    else if (Array.isArray(resource[key])) {
                        /** @type {?} */
                        var array = resource[key];
                        if (array) {
                            result[key] = new Array();
                            array.forEach((/**
                             * @param {?} element
                             * @return {?}
                             */
                            function (element) {
                                if (util.isPrimitive(element)) {
                                    result[key].push(element);
                                }
                                else {
                                    result[key].push(_this.resolveRelations(element));
                                }
                            }));
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
            return (/** @type {?} */ (result));
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
                            for (var items_1 = (e_4 = void 0, __values(items)), items_1_1 = items_1.next(); !items_1_1.done; items_1_1 = items_1.next()) {
                                var item = items_1_1.value;
                                /** @type {?} */
                                var instance = new type();
                                instance = this.searchSubtypes(builder, embeddedClassName, instance);
                                this.instantiateResource(instance, item);
                                result.push(instance);
                            }
                        }
                        catch (e_4_1) { e_4 = { error: e_4_1 }; }
                        finally {
                            try {
                                if (items_1_1 && !items_1_1.done && (_b = items_1.return)) _b.call(items_1);
                            }
                            finally { if (e_4) throw e_4.error; }
                        }
                    }
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_3) throw e_3.error; }
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
                Array.from(keys).forEach((/**
                 * @param {?} subtypeKey
                 * @return {?}
                 */
                function (subtypeKey) {
                    if (embeddedClassName.toLowerCase().startsWith(subtypeKey.toLowerCase())) {
                        /** @type {?} */
                        var subtype = builder.subtypes.get(subtypeKey);
                        instance = new subtype();
                    }
                }));
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
        /** get proxy URL */
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
        /** add slash to URI */
        /**
         * add slash to URI
         * @private
         * @param {?} uri
         * @return {?}
         */
        ResourceHelper.addSlash = /**
         * add slash to URI
         * @private
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
        /** get proxy from URL */
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
        /** set HttpClient*/
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
        /** get HttpClient*/
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
        ResourceHelper.headers = new http.HttpHeaders();
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
    if (false) {
        /**
         * HttpHeaders
         * @type {?}
         */
        ResourceHelper.headers;
        /**
         * Proxy URL
         * @type {?}
         * @private
         */
        ResourceHelper.proxy_uri;
        /**
         * Root URL
         * @type {?}
         * @private
         */
        ResourceHelper.root_uri;
        /**
         * HttpClient
         * @type {?}
         * @private
         */
        ResourceHelper.http;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
            /** get subtypes */
            get: /**
             * get subtypes
             * @return {?}
             */
            function () {
                return this._subtypes;
            },
            /** set subtypes */
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
        /** Get collection of related resources */
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
            var params = ResourceHelper.optionParams(new http.HttpParams(), options);
            /** @type {?} */
            var result = ResourceHelper.createEmptyResult(util.isNullOrUndefined(_embedded) ? "_embedded" : _embedded);
            if (!util.isNullOrUndefined(this._links) && !util.isNullOrUndefined(this._links[relation])) {
                /** @type {?} */
                var observable = ResourceHelper.getHttp().get(ResourceHelper.getProxy(this._links[relation].href), {
                    headers: ResourceHelper.headers,
                    params: params
                });
                return observable.pipe(operators.map((/**
                 * @param {?} response
                 * @return {?}
                 */
                function (response) { return ResourceHelper.instantiateResourceCollection(type, response, result, builder); })), operators.map((/**
                 * @param {?} array
                 * @return {?}
                 */
                function (array) { return array.result; })));
            }
            else {
                return rxjs.of([]);
            }
        };
        /** Get related resource */
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
                return observable.pipe(operators.map((/**
                 * @param {?} data
                 * @return {?}
                 */
                function (data) {
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
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                    }
                    return ResourceHelper.instantiateResource(result, data);
                })));
            }
            else {
                return rxjs.of(null);
            }
        };
        /** Adds the given resource to the bound collection by the relation */
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
        /** Bind the given resource to this resource by the given relation*/
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
        /** Bind the given resource to this resource by the given relation*/
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
        /** Bind the given resource to this resource by the given relation*/
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
                return ResourceHelper.getHttp().put(ResourceHelper.getProxy(this._links[relation].href), resources.map((/**
                 * @param {?} resource
                 * @return {?}
                 */
                function (resource) { return resource._links.self.href; })), { headers: header });
            }
            else {
                return rxjs.throwError('no relation found');
            }
        };
        /** Unbind the resource with the given relation from this resource*/
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
        /** Unbind the resource with the given relation from this resource*/
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
            { type: core.Injectable }
        ];
        /** @nocollapse */
        Resource.ctorParameters = function () { return []; };
        return Resource;
    }());
    if (false) {
        /**
         * proxy URL
         * @type {?}
         */
        Resource.prototype.proxyUrl;
        /**
         * root URL
         * @type {?}
         */
        Resource.prototype.rootUrl;
        /**
         * links
         * @type {?}
         */
        Resource.prototype._links;
        /**
         * subtypes
         * @type {?}
         */
        Resource.prototype._subtypes;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * User model
     */
    var   /**
     * User model
     */
    User = /** @class */ (function (_super) {
        __extends(User, _super);
        function User() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return User;
    }(Resource));
    if (false) {
        /**
         * id
         * @type {?}
         */
        User.prototype.id;
        /**
         * username
         * @type {?}
         */
        User.prototype.username;
        /**
         * password
         * @type {?}
         */
        User.prototype.password;
        /**
         * first name
         * @type {?}
         */
        User.prototype.firstName;
        /**
         * last name
         * @type {?}
         */
        User.prototype.lastName;
        /**
         * whether user is blocked
         * @type {?}
         */
        User.prototype.blocked;
        /**
         * whether user is administrator
         * @type {?}
         */
        User.prototype.administrator;
        /**
         * Is passwordSet
         * @type {?}
         */
        User.prototype.passwordSet;
        /**
         * user positions
         * @type {?}
         */
        User.prototype.positions;
        /**
         * user permissions
         * @type {?}
         */
        User.prototype.permissions;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
        /** update ExternalConfigurationHandler */
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
        /** get ExternalConfiguration */
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
        /** get proxy URL */
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
        /** get Root URI */
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
        /** get URL */
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
        /** get HttpClient */
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
            { type: core.Injectable }
        ];
        /** @nocollapse */
        ExternalService.ctorParameters = function () { return [
            { type: undefined, decorators: [{ type: core.Inject, args: ['ExternalConfigurationService',] }] }
        ]; };
        return ExternalService;
    }());
    if (false) {
        /**
         * @type {?}
         * @private
         */
        ExternalService.prototype.externalConfigurationService;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * ResourceService
     */
    var ResourceService = /** @class */ (function () {
        /** constructor */
        function ResourceService(externalService) {
            this.externalService = externalService;
        }
        /** get URL */
        /**
         * get URL
         * @private
         * @return {?}
         */
        ResourceService.getURL = /**
         * get URL
         * @private
         * @return {?}
         */
        function () {
            return ResourceHelper.getURL();
        };
        /** get all resources from a base URI of a given type */
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
            var params = ResourceHelper.optionParams(new http.HttpParams(), options);
            /** @type {?} */
            var result = ResourceHelper.createEmptyResult(_embedded);
            this.setUrls(result);
            result.sortInfo = options ? options.sort : undefined;
            /** @type {?} */
            var observable = ResourceHelper.getHttp().get(uri, { headers: ResourceHelper.headers, params: params });
            return observable.pipe(operators.map((/**
             * @param {?} response
             * @return {?}
             */
            function (response) { return ResourceHelper.instantiateResourceCollection(type, response, result, subType, embeddedName); })), operators.catchError((/**
             * @param {?} error
             * @return {?}
             */
            function (error) { return rxjs.throwError(error); })));
        };
        /** get resource from a base URI and a given id */
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
            return observable.pipe(operators.map((/**
             * @param {?} data
             * @return {?}
             */
            function (data) { return ResourceHelper.instantiateResource(result, data); })), operators.catchError((/**
             * @param {?} error
             * @return {?}
             */
            function (error) { return rxjs.throwError(error); })));
        };
        /** get resource from its selflink */
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
            return observable.pipe(operators.map((/**
             * @param {?} data
             * @return {?}
             */
            function (data) { return ResourceHelper.instantiateResource(result, data); })), operators.catchError((/**
             * @param {?} error
             * @return {?}
             */
            function (error) { return rxjs.throwError(error); })));
        };
        /** search resources from a given base path, query and options */
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
            var params = ResourceHelper.optionParams(new http.HttpParams(), options);
            /** @type {?} */
            var result = ResourceHelper.createEmptyResult(_embedded);
            this.setUrls(result);
            /** @type {?} */
            var observable = ResourceHelper.getHttp().get(uri, { headers: ResourceHelper.headers, params: params });
            return observable.pipe(operators.map((/**
             * @param {?} response
             * @return {?}
             */
            function (response) { return ResourceHelper.instantiateResourceCollection(type, response, result); })), operators.catchError((/**
             * @param {?} error
             * @return {?}
             */
            function (error) { return rxjs.throwError(error); })));
        };
        /** search a single resource from a given base path, query and options */
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
            var params = ResourceHelper.optionParams(new http.HttpParams(), options);
            /** @type {?} */
            var result = new type();
            this.setUrlsResource(result);
            /** @type {?} */
            var observable = ResourceHelper.getHttp().get(uri, { headers: ResourceHelper.headers, params: params });
            return observable.pipe(operators.map((/**
             * @param {?} response
             * @return {?}
             */
            function (response) { return ResourceHelper.instantiateResource(result, response); })), operators.catchError((/**
             * @param {?} error
             * @return {?}
             */
            function (error) { return rxjs.throwError(error); })));
        };
        /** search resources from a given base path, custom query and options */
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
            var params = ResourceHelper.optionParams(new http.HttpParams(), options);
            /** @type {?} */
            var result = ResourceHelper.createEmptyResult(_embedded);
            this.setUrls(result);
            /** @type {?} */
            var observable = ResourceHelper.getHttp().get(uri, { headers: ResourceHelper.headers, params: params });
            return observable.pipe(operators.map((/**
             * @param {?} response
             * @return {?}
             */
            function (response) { return ResourceHelper.instantiateResourceCollection(type, response, result); })), operators.catchError((/**
             * @param {?} error
             * @return {?}
             */
            function (error) { return rxjs.throwError(error); })));
        };
        /** get resource given a relation link */
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
            return observable.pipe(operators.map((/**
             * @param {?} data
             * @return {?}
             */
            function (data) { return ResourceHelper.instantiateResource(result, data); })), operators.catchError((/**
             * @param {?} error
             * @return {?}
             */
            function (error) { return rxjs.throwError(error); })));
        };
        /** get resource array given a relation link */
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
            return observable.pipe(operators.map((/**
             * @param {?} response
             * @return {?}
             */
            function (response) { return ResourceHelper.instantiateResourceCollection(type, response, result, builder); })), operators.catchError((/**
             * @param {?} error
             * @return {?}
             */
            function (error) { return rxjs.throwError(error); })));
        };
        /** count resources given a path */
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
            return ResourceHelper.getHttp().get(uri, { headers: ResourceHelper.headers, observe: 'body' }).pipe(operators.map((/**
             * @param {?} response
             * @return {?}
             */
            function (response) { return Number(response.body); })), operators.catchError((/**
             * @param {?} error
             * @return {?}
             */
            function (error) { return rxjs.throwError(error); })));
        };
        /** create resource from self link and entity data*/
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
            return observable.pipe(operators.map((/**
             * @param {?} response
             * @return {?}
             */
            function (response) {
                if (response.status >= 200 && response.status <= 207)
                    return ResourceHelper.instantiateResource(entity, response.body);
                else if (response.status == 500) {
                    /** @type {?} */
                    var body = response.body;
                    return rxjs.throwError(body.error);
                }
            })), operators.catchError((/**
             * @param {?} error
             * @return {?}
             */
            function (error) { return rxjs.throwError(error); })));
        };
        /** update resource from a given entity data*/
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
            return observable.pipe(operators.map((/**
             * @param {?} response
             * @return {?}
             */
            function (response) {
                if (response.status >= 200 && response.status <= 207)
                    return ResourceHelper.instantiateResource(entity, response.body);
                else if (response.status == 500) {
                    /** @type {?} */
                    var body = response.body;
                    return rxjs.throwError(body.error);
                }
            })), operators.catchError((/**
             * @param {?} error
             * @return {?}
             */
            function (error) { return rxjs.throwError(error); })));
        };
        /** update resource from a given entity data*/
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
            //const payload = ResourceHelper.resolveRelations(entity);
            //this.setUrlsResource(entity);
            /** @type {?} */
            var headersReq = ResourceHelper.headers;
            headersReq.set("Content-Type", "text/uri-list");
            /** @type {?} */
            var observable = ResourceHelper.getHttp().put(uri, resourceArray, { headers: headersReq, observe: 'response' });
            return observable.pipe(operators.map((/**
             * @param {?} response
             * @return {?}
             */
            function (response) {
                if (response.status >= 200 && response.status <= 207)
                    return "";
                else if (response.status == 500) {
                    /** @type {?} */
                    var body = response.body;
                    return rxjs.throwError(body.error);
                }
            })), operators.catchError((/**
             * @param {?} error
             * @return {?}
             */
            function (error) { return rxjs.throwError(error); })));
        };
        /** patch resource from a given entity data*/
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
            return observable.pipe(operators.map((/**
             * @param {?} response
             * @return {?}
             */
            function (response) {
                if (response.status >= 200 && response.status <= 207)
                    return ResourceHelper.instantiateResource(entity, response.body);
                else if (response.status == 500) {
                    /** @type {?} */
                    var body = response.body;
                    return rxjs.throwError(body.error);
                }
            })), operators.catchError((/**
             * @param {?} error
             * @return {?}
             */
            function (error) { return rxjs.throwError(error); })));
        };
        /** delete resource from a given entity data*/
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
            return ResourceHelper.getHttp().delete(uri, { headers: ResourceHelper.headers }).pipe(operators.catchError((/**
             * @param {?} error
             * @return {?}
             */
            function (error) { return rxjs.throwError(error); })));
        };
        /** whether a resource array has next page of results*/
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
        /** whether a resource array has previous page of results*/
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
        /** whether a resource array has first page of results*/
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
        /** whether a resource array has last page of results*/
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
        /** get resource array next page of results*/
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
        /** get resource array previous page of results*/
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
        /** get resource array first page of results*/
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
        /** get resource array last page of results*/
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
        /** get resource array page of results given a page number*/
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
        /** sort resource array with a given sorting params */
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
        /** get resource array size*/
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
        /** get resource URL from a given path*/
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
        /** set proxy and root urls of given resource array */
        /**
         * set proxy and root urls of given resource array
         * @private
         * @template T
         * @param {?} result
         * @return {?}
         */
        ResourceService.prototype.setUrls = /**
         * set proxy and root urls of given resource array
         * @private
         * @template T
         * @param {?} result
         * @return {?}
         */
        function (result) {
            result.proxyUrl = this.externalService.getProxyUri();
            result.rootUrl = this.externalService.getRootUri();
        };
        /** set proxy and root urls of given resource */
        /**
         * set proxy and root urls of given resource
         * @private
         * @template T
         * @param {?} result
         * @return {?}
         */
        ResourceService.prototype.setUrlsResource = /**
         * set proxy and root urls of given resource
         * @private
         * @template T
         * @param {?} result
         * @return {?}
         */
        function (result) {
            result.proxyUrl = this.externalService.getProxyUri();
            result.rootUrl = this.externalService.getRootUri();
        };
        ResourceService.decorators = [
            { type: core.Injectable }
        ];
        /** @nocollapse */
        ResourceService.ctorParameters = function () { return [
            { type: ExternalService }
        ]; };
        return ResourceService;
    }());
    if (false) {
        /**
         * @type {?}
         * @private
         */
        ResourceService.prototype.externalService;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * REST API access interface
     * @template T
     */
    var   /**
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
         * @protected
         * @param {?} error
         * @return {?}
         */
        RestService.prototype.handleError = /**
         * error handler
         * @protected
         * @param {?} error
         * @return {?}
         */
        function (error) {
            return RestService.handleError(error);
        };
        /** error handler */
        /**
         * error handler
         * @protected
         * @param {?} error
         * @return {?}
         */
        RestService.handleError = /**
         * error handler
         * @protected
         * @param {?} error
         * @return {?}
         */
        function (error) {
            return rxjs.throwError(error);
        };
        /** get all resources with optional options an subType params */
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
            return this.resourceService.getAll(this.type, this.resource, this._embedded, options, subType, embeddedName, ignoreProjection).pipe(operators.mergeMap((/**
             * @param {?} resourceArray
             * @return {?}
             */
            function (resourceArray) {
                if (options && options.notPaged && !util.isNullOrUndefined(resourceArray.first_uri)) {
                    options.notPaged = false;
                    options.size = resourceArray.totalElements;
                    return _this.getAll(options);
                }
                else {
                    _this.resourceArray = resourceArray;
                    return rxjs.of(resourceArray.result);
                }
            })));
        };
        /** get resource from a given id */
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
        /** get resource from self link */
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
        /** search resources from a given query string and optional options params */
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
            return this.resourceService.search(this.type, query, this.resource, this._embedded, options).pipe(operators.mergeMap((/**
             * @param {?} resourceArray
             * @return {?}
             */
            function (resourceArray) {
                if (options && options.notPaged && !util.isNullOrUndefined(resourceArray.first_uri)) {
                    options.notPaged = false;
                    options.size = resourceArray.totalElements;
                    return _this.search(query, options);
                }
                else {
                    _this.resourceArray = resourceArray;
                    return rxjs.of(resourceArray.result);
                }
            })));
        };
        /** search resource from a given query string and optional options params */
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
        /** search resources from a given custom query string and optional options params */
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
            return this.resourceService.customQuery(this.type, query, this.resource, this._embedded, options).pipe(operators.mergeMap((/**
             * @param {?} resourceArray
             * @return {?}
             */
            function (resourceArray) {
                if (options && options.notPaged && !util.isNullOrUndefined(resourceArray.first_uri)) {
                    options.notPaged = false;
                    options.size = resourceArray.totalElements;
                    return _this.customQuery(query, options);
                }
                else {
                    _this.resourceArray = resourceArray;
                    return rxjs.of(resourceArray.result);
                }
            })));
        };
        /** get resource array given a relation link */
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
            return this.resourceService.getByRelationArray(this.type, relation, this._embedded, builder).pipe(operators.map((/**
             * @param {?} resourceArray
             * @return {?}
             */
            function (resourceArray) {
                _this.resourceArray = resourceArray;
                return resourceArray.result;
            })));
        };
        /** get resource given a relation link */
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
        /** count resources given a path */
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
        /** create resource from self link and entity data*/
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
        /** update resource from a given entity data*/
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
        /** patch resource from a given entity data*/
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
        /** delete resource from a given entity data*/
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
        /** get total number of elements of resource array */
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
        /** whether a resource array has first page of results*/
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
        /** whether a resource array has next page of results*/
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
        /** whether a resource array has previous page of results*/
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
        /** whether a resource array has last page of results*/
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
        /** get resource array next page of results*/
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
                return this.resourceService.next(this.resourceArray, this.type).pipe(operators.map((/**
                 * @param {?} resourceArray
                 * @return {?}
                 */
                function (resourceArray) {
                    _this.resourceArray = resourceArray;
                    return resourceArray.result;
                })));
            else
                rxjs.throwError('no resourceArray found');
        };
        /** get resource array previous page of results*/
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
                return this.resourceService.prev(this.resourceArray, this.type).pipe(operators.map((/**
                 * @param {?} resourceArray
                 * @return {?}
                 */
                function (resourceArray) {
                    _this.resourceArray = resourceArray;
                    return resourceArray.result;
                })));
            else
                rxjs.throwError('no resourceArray found');
        };
        /** get resource array first page of results*/
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
                    .pipe(operators.map((/**
                 * @param {?} resourceArray
                 * @return {?}
                 */
                function (resourceArray) {
                    _this.resourceArray = resourceArray;
                    return resourceArray.result;
                })));
            else
                rxjs.throwError('no resourceArray found');
        };
        /** get resource array last page of results*/
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
                    .pipe(operators.map((/**
                 * @param {?} resourceArray
                 * @return {?}
                 */
                function (resourceArray) {
                    _this.resourceArray = resourceArray;
                    return resourceArray.result;
                })));
            else
                rxjs.throwError('no resourceArray found');
        };
        /** get resource array page of results given a page number*/
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
                return this.resourceService.page(this.resourceArray, this.type, pageNumber).pipe(operators.map((/**
                 * @param {?} resourceArray
                 * @return {?}
                 */
                function (resourceArray) {
                    _this.resourceArray = resourceArray;
                    return resourceArray.result;
                })));
            else
                rxjs.throwError('no resourceArray found');
        };
        return RestService;
    }());
    if (false) {
        /**
         * resource type
         * @type {?}
         * @private
         */
        RestService.prototype.type;
        /**
         * resource path
         * @type {?}
         * @private
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
         * @private
         */
        RestService.prototype._embedded;
        /**
         * @type {?}
         * @private
         */
        RestService.prototype.injector;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
            { type: core.Injectable }
        ];
        /** @nocollapse */
        AccountService.ctorParameters = function () { return [
            { type: core.Injector },
            { type: http.HttpClient }
        ]; };
        return AccountService;
    }(RestService));
    if (false) {
        /**
         * API resource path
         * @type {?}
         */
        AccountService.prototype.ACCOUNT_API;
        /**
         * @type {?}
         * @private
         */
        AccountService.prototype.http;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    //import * as moment from 'moment';
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
        /** check whether current user is logged in*/
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
            return new rxjsCompat.Observable((/**
             * @param {?} observer
             * @return {?}
             */
            function (observer) {
                //localStorage.removeItem('authenticationToken');
                sessionStorage.removeItem('authenticationToken');
                //sessionStorage.removeItem('expires_at');
                observer.complete();
            }));
        };
        AuthService.decorators = [
            { type: core.Injectable }
        ];
        /** @nocollapse */
        AuthService.ctorParameters = function () { return [
            { type: http.HttpClient },
            { type: ResourceService }
        ]; };
        return AuthService;
    }());
    if (false) {
        /**
         * API resource path
         * @type {?}
         */
        AuthService.prototype.AUTH_API;
        /**
         * @type {?}
         * @private
         */
        AuthService.prototype.http;
        /**
         * @type {?}
         * @private
         */
        AuthService.prototype.resourceService;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * Interceptor for authentication token in API requests
     */
    var   /**
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
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
            return this.identity().then((/**
             * @param {?} id
             * @return {?}
             */
            function (id) {
                return Promise.resolve(id.authorities && id.authorities.includes(authority));
            }), (/**
             * @return {?}
             */
            function () {
                return Promise.resolve(false);
            }));
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
            return this.identity().then((/**
             * @param {?} id
             * @return {?}
             */
            function (id) {
                return Promise.resolve(id.authoritiesPerTerritory && id.authoritiesPerTerritory[territory] && id.authoritiesPerTerritory[territory].includes(authority));
            }), (/**
             * @return {?}
             */
            function () {
                return Promise.resolve(false);
            }));
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
            return this.account.get().toPromise().then((/**
             * @param {?} response
             * @return {?}
             */
            function (response) {
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
            })).catch((/**
             * @param {?} err
             * @return {?}
             */
            function (err) {
                _this.userIdentity = null;
                _this.authenticated = false;
                _this.authenticationState.next(_this.userIdentity);
                return null;
            }));
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
            { type: core.Injectable }
        ];
        /** @nocollapse */
        Principal.ctorParameters = function () { return [
            { type: AccountService }
        ]; };
        return Principal;
    }());
    if (false) {
        /**
         * @type {?}
         * @private
         */
        Principal.prototype.userIdentity;
        /**
         * @type {?}
         * @private
         */
        Principal.prototype.authenticated;
        /**
         * @type {?}
         * @private
         */
        Principal.prototype.authenticationState;
        /**
         * @type {?}
         * @private
         */
        Principal.prototype.account;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
            return next.handle(request).do((/**
             * @param {?} event
             * @return {?}
             */
            function (event) { }), (/**
             * @param {?} err
             * @return {?}
             */
            function (err) {
                /** @type {?} */
                var intercept = request.url.indexOf("/api/") != -1;
                //tractem request
                if (intercept) {
                    if (err instanceof http.HttpErrorResponse) {
                        if (err.status === 401) {
                            _this.authService.logout().subscribe();
                            _this.principal.authenticate(null);
                            _this.router.navigate(['/']);
                        }
                    }
                }
            }));
        };
        AuthExpiredInterceptor.decorators = [
            { type: core.Injectable }
        ];
        /** @nocollapse */
        AuthExpiredInterceptor.ctorParameters = function () { return [
            { type: router.Router },
            { type: AuthService },
            { type: Principal }
        ]; };
        return AuthExpiredInterceptor;
    }());
    if (false) {
        /**
         * @type {?}
         * @private
         */
        AuthExpiredInterceptor.prototype.router;
        /**
         * @type {?}
         * @private
         */
        AuthExpiredInterceptor.prototype.authService;
        /**
         * @type {?}
         * @private
         */
        AuthExpiredInterceptor.prototype.principal;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
            var cb = callback || (/**
             * @return {?}
             */
            function () { });
            return new Promise((/**
             * @param {?} resolve
             * @param {?} reject
             * @return {?}
             */
            function (resolve, reject) {
                _this.authServerProvider.login(credentials).subscribe((/**
                 * @param {?} data
                 * @return {?}
                 */
                function (data) {
                    _this.principal.identity(true).then((/**
                     * @param {?} account
                     * @return {?}
                     */
                    function (account) {
                        // After the login the language will be changed to
                        // the language selected by the user during his registration
                        resolve(data);
                    }));
                    return cb();
                }), (/**
                 * @param {?} err
                 * @return {?}
                 */
                function (err) {
                    _this.logout();
                    reject(err);
                    return cb(err);
                }));
            }));
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
            { type: core.Injectable }
        ];
        /** @nocollapse */
        LoginService.ctorParameters = function () { return [
            { type: AuthService },
            { type: Principal }
        ]; };
        return LoginService;
    }());
    if (false) {
        /**
         * @type {?}
         * @private
         */
        LoginService.prototype.authServerProvider;
        /**
         * @type {?}
         * @private
         */
        LoginService.prototype.principal;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
            return this.http.get(this.resourceService.getResourceUrl(this.DASHBOARD_API)).map((/**
             * @param {?} response
             * @return {?}
             */
            function (response) { return response[_this.DASHBOARD_EMBEDDED]; }));
        };
        DashboardService.decorators = [
            { type: core.Injectable, args: [{
                        providedIn: 'root'
                    },] }
        ];
        /** @nocollapse */
        DashboardService.ctorParameters = function () { return [
            { type: http.HttpClient },
            { type: ResourceService }
        ]; };
        /** @nocollapse */ DashboardService.ngInjectableDef = core.ɵɵdefineInjectable({ factory: function DashboardService_Factory() { return new DashboardService(core.ɵɵinject(http.HttpClient), core.ɵɵinject(ResourceService)); }, token: DashboardService, providedIn: "root" });
        return DashboardService;
    }());
    if (false) {
        /**
         * API resource path
         * @type {?}
         */
        DashboardService.prototype.DASHBOARD_API;
        /** @type {?} */
        DashboardService.prototype.DASHBOARD_EMBEDDED;
        /**
         * @type {?}
         * @private
         */
        DashboardService.prototype.http;
        /**
         * @type {?}
         * @private
         */
        DashboardService.prototype.resourceService;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
            { type: core.Injectable }
        ];
        /** @nocollapse */
        UserService.ctorParameters = function () { return [
            { type: core.Injector },
            { type: http.HttpClient }
        ]; };
        return UserService;
    }(RestService));
    if (false) {
        /**
         * API resource path
         * @type {?}
         */
        UserService.prototype.USER_API;
        /**
         * @type {?}
         * @private
         */
        UserService.prototype.http;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * User position model
     */
    var   /**
     * User position model
     */
    UserPosition = /** @class */ (function (_super) {
        __extends(UserPosition, _super);
        function UserPosition() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return UserPosition;
    }(Resource));
    if (false) {
        /**
         * name
         * @type {?}
         */
        UserPosition.prototype.name;
        /**
         * email
         * @type {?}
         */
        UserPosition.prototype.email;
        /**
         * organization name
         * @type {?}
         */
        UserPosition.prototype.organization;
        /**
         * system created date
         * @type {?}
         */
        UserPosition.prototype.createdDate;
        /**
         * system dated date
         * @type {?}
         */
        UserPosition.prototype.datedDate;
        /**
         * position territory
         * @type {?}
         */
        UserPosition.prototype.territory;
        /**
         * user
         * @type {?}
         */
        UserPosition.prototype.user;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
                    item.substituteRelation('user', item.user).subscribe((/**
                     * @param {?} result
                     * @return {?}
                     */
                    function (result) {
                    }), (/**
                     * @param {?} error
                     * @return {?}
                     */
                    function (error) { return console.error(error); }));
                }
                if (item.territory != null) {
                    item.substituteRelation('territory', item.territory).subscribe((/**
                     * @param {?} result
                     * @return {?}
                     */
                    function (result) {
                    }), (/**
                     * @param {?} error
                     * @return {?}
                     */
                    function (error) { return console.error(error); }));
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
            { type: core.Injectable }
        ];
        /** @nocollapse */
        UserPositionService.ctorParameters = function () { return [
            { type: core.Injector },
            { type: http.HttpClient }
        ]; };
        return UserPositionService;
    }(RestService));
    if (false) {
        /**
         * API resource path
         * @type {?}
         */
        UserPositionService.prototype.USER_POSITION_API;
        /**
         * @type {?}
         * @private
         */
        UserPositionService.prototype.http;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * User permission model
     */
    var   /**
     * User permission model
     */
    UserConfiguration = /** @class */ (function (_super) {
        __extends(UserConfiguration, _super);
        function UserConfiguration() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return UserConfiguration;
    }(Resource));
    if (false) {
        /**
         * role
         * @type {?}
         */
        UserConfiguration.prototype.role;
        /**
         * role Children
         * @type {?}
         */
        UserConfiguration.prototype.roleChildren;
        /**
         * territory
         * @type {?}
         */
        UserConfiguration.prototype.territory;
        /**
         * user
         * @type {?}
         */
        UserConfiguration.prototype.user;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
            { type: core.Injectable }
        ];
        /** @nocollapse */
        UserConfigurationService.ctorParameters = function () { return [
            { type: core.Injector },
            { type: http.HttpClient }
        ]; };
        return UserConfigurationService;
    }(RestService));
    if (false) {
        /**
         * API resource path
         * @type {?}
         */
        UserConfigurationService.prototype.USER_CONFIGURATION_API;
        /**
         * @type {?}
         * @private
         */
        UserConfigurationService.prototype.http;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * Territory model
     */
    var   /**
     * Territory model
     */
    Territory = /** @class */ (function (_super) {
        __extends(Territory, _super);
        function Territory() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Territory;
    }(Resource));
    if (false) {
        /**
         * id
         * @type {?}
         */
        Territory.prototype.id;
        /**
         * code
         * @type {?}
         */
        Territory.prototype.code;
        /**
         * name
         * @type {?}
         */
        Territory.prototype.name;
        /**
         * address
         * @type {?}
         */
        Territory.prototype.territorialAuthorityAddress;
        /**
         * admin
         * @type {?}
         */
        Territory.prototype.territorialAuthorityName;
        /**
         * whether territory is blocked
         * @type {?}
         */
        Territory.prototype.blocked;
        /**
         * comments
         * @type {?}
         */
        Territory.prototype.note;
        /**
         * system created date
         * @type {?}
         */
        Territory.prototype.createdDate;
        /**
         * contact email
         * @type {?}
         */
        Territory.prototype.territorialAuthorityEmail;
        /**
         * extension
         * @type {?}
         */
        Territory.prototype.extent;
        /**
         * logo image URL
         * @type {?}
         */
        Territory.prototype.territorialAuthorityLogo;
        /**
         * scope
         * @type {?}
         */
        Territory.prototype.scope;
        /**
         * type
         * @type {?}
         */
        Territory.prototype.type;
        /**
         * group type
         * @type {?}
         */
        Territory.prototype.groupType;
        /**
         * territory members
         * @type {?}
         */
        Territory.prototype.members;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
                    item.deleteRelation('type', territoryType).subscribe((/**
                     * @param {?} result
                     * @return {?}
                     */
                    function (result) {
                    }), (/**
                     * @param {?} error
                     * @return {?}
                     */
                    function (error) { return console.error(error); }));
                }
                else {
                    item.substituteRelation('type', territoryType).subscribe((/**
                     * @param {?} result
                     * @return {?}
                     */
                    function (result) {
                    }), (/**
                     * @param {?} error
                     * @return {?}
                     */
                    function (error) { return console.error(error); }));
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
            { type: core.Injectable }
        ];
        /** @nocollapse */
        TerritoryService.ctorParameters = function () { return [
            { type: core.Injector },
            { type: http.HttpClient }
        ]; };
        return TerritoryService;
    }(RestService));
    if (false) {
        /**
         * API resource path
         * @type {?}
         */
        TerritoryService.prototype.TERRITORY_API;
        /**
         * @type {?}
         * @private
         */
        TerritoryService.prototype.http;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * Territory type model
     */
    var   /**
     * Territory type model
     */
    TerritoryType = /** @class */ (function (_super) {
        __extends(TerritoryType, _super);
        function TerritoryType() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return TerritoryType;
    }(Resource));
    if (false) {
        /**
         * id
         * @type {?}
         */
        TerritoryType.prototype.id;
        /**
         * name
         * @type {?}
         */
        TerritoryType.prototype.name;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
            { type: core.Injectable }
        ];
        /** @nocollapse */
        TerritoryTypeService.ctorParameters = function () { return [
            { type: core.Injector },
            { type: http.HttpClient }
        ]; };
        return TerritoryTypeService;
    }(RestService));
    if (false) {
        /**
         * API resource path
         * @type {?}
         */
        TerritoryTypeService.prototype.TERRITORYTYPE_API;
        /**
         * @type {?}
         * @private
         */
        TerritoryTypeService.prototype.http;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * Territory type model
     */
    var   /**
     * Territory type model
     */
    TerritoryGroupType = /** @class */ (function (_super) {
        __extends(TerritoryGroupType, _super);
        function TerritoryGroupType() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return TerritoryGroupType;
    }(Resource));
    if (false) {
        /**
         * id
         * @type {?}
         */
        TerritoryGroupType.prototype.id;
        /**
         * name
         * @type {?}
         */
        TerritoryGroupType.prototype.name;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
            { type: core.Injectable, args: [{
                        providedIn: 'root'
                    },] }
        ];
        /** @nocollapse */
        TerritoryGroupTypeService.ctorParameters = function () { return [
            { type: core.Injector },
            { type: http.HttpClient }
        ]; };
        /** @nocollapse */ TerritoryGroupTypeService.ngInjectableDef = core.ɵɵdefineInjectable({ factory: function TerritoryGroupTypeService_Factory() { return new TerritoryGroupTypeService(core.ɵɵinject(core.INJECTOR), core.ɵɵinject(http.HttpClient)); }, token: TerritoryGroupTypeService, providedIn: "root" });
        return TerritoryGroupTypeService;
    }(RestService));
    if (false) {
        /**
         * API resource path
         * @type {?}
         */
        TerritoryGroupTypeService.prototype.TERRITORYGROUPTYPE_API;
        /**
         * @type {?}
         * @private
         */
        TerritoryGroupTypeService.prototype.http;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * Role model
     */
    var   /**
     * Role model
     */
    Role = /** @class */ (function (_super) {
        __extends(Role, _super);
        function Role() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Role;
    }(Resource));
    if (false) {
        /**
         * id
         * @type {?}
         */
        Role.prototype.id;
        /**
         * name
         * @type {?}
         */
        Role.prototype.name;
        /**
         * comments
         * @type {?}
         */
        Role.prototype.description;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
            { type: core.Injectable }
        ];
        /** @nocollapse */
        RoleService.ctorParameters = function () { return [
            { type: core.Injector },
            { type: http.HttpClient }
        ]; };
        return RoleService;
    }(RestService));
    if (false) {
        /**
         * API resource path
         * @type {?}
         */
        RoleService.prototype.ROLE_API;
        /**
         * @type {?}
         * @private
         */
        RoleService.prototype.http;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * Connection model
     */
    var   /**
     * Connection model
     */
    Connection = /** @class */ (function (_super) {
        __extends(Connection, _super);
        function Connection() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Connection;
    }(Resource));
    if (false) {
        /**
         * id
         * @type {?}
         */
        Connection.prototype.id;
        /**
         * name
         * @type {?}
         */
        Connection.prototype.name;
        /**
         * type
         * @type {?}
         */
        Connection.prototype.type;
        /**
         * user
         * @type {?}
         */
        Connection.prototype.user;
        /**
         * password
         * @type {?}
         */
        Connection.prototype.password;
        /**
         * connection string
         * @type {?}
         */
        Connection.prototype.connectionString;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
            { type: core.Injectable }
        ];
        /** @nocollapse */
        ConnectionService.ctorParameters = function () { return [
            { type: core.Injector },
            { type: http.HttpClient }
        ]; };
        return ConnectionService;
    }(RestService));
    if (false) {
        /**
         * API resource path
         * @type {?}
         */
        ConnectionService.prototype.CONNECTION_API;
        /**
         * @type {?}
         * @private
         */
        ConnectionService.prototype.http;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    //FIXME ensure task creation in admin app upon initialization (as it is done with Roles and default Users)
    /**
     * GEOADMIN_task id
     * @type {?}
     */
    var GEOADMIN_TREE_TASK_ID = "geoadmin";
    /**
     * Task model
     */
    var   /**
     * Task model
     */
    Task = /** @class */ (function (_super) {
        __extends(Task, _super);
        function Task() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Task;
    }(Resource));
    if (false) {
        /**
         * id
         * @type {?}
         */
        Task.prototype.id;
        /**
         * name
         * @type {?}
         */
        Task.prototype.name;
        /**
         * order
         * @type {?}
         */
        Task.prototype.order;
        /**
         * system created date
         * @type {?}
         */
        Task.prototype.createdDate;
        /**
         * task group
         * @type {?}
         */
        Task.prototype.group;
        /**
         * task type
         * @type {?}
         */
        Task.prototype.type;
        /**
         * task UI
         * @type {?}
         */
        Task.prototype.ui;
        /**
         * parameters
         * @type {?}
         */
        Task.prototype.parameters;
        /**
         * connection
         * @type {?}
         */
        Task.prototype.connection;
        /**
         * roles
         * @type {?}
         */
        Task.prototype.roles;
        /**
         * availabilities
         * @type {?}
         */
        Task.prototype.availabilities;
        /** @type {?} */
        Task.prototype.cartography;
        /** @type {?} */
        Task.prototype.service;
        /** @type {?} */
        Task.prototype.properties;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
                    item.deleteRelation('service', service).subscribe((/**
                     * @param {?} result
                     * @return {?}
                     */
                    function (result) {
                    }), (/**
                     * @param {?} error
                     * @return {?}
                     */
                    function (error) { return console.error(error); }));
                }
                else {
                    item.service._links.self.href = item.service._links.self.href.split("{")[0];
                    item.substituteRelation('service', item.service).subscribe((/**
                     * @param {?} result
                     * @return {?}
                     */
                    function (result) {
                    }), (/**
                     * @param {?} error
                     * @return {?}
                     */
                    function (error) { return console.error(error); }));
                    item.service = item.service._links.self.href;
                }
                if (!item.cartography) {
                    /** @type {?} */
                    var cartography = {};
                    cartography._links = {};
                    cartography._links.self = {};
                    cartography._links.self.href = "";
                    item.deleteRelation('cartography', cartography).subscribe((/**
                     * @param {?} result
                     * @return {?}
                     */
                    function (result) {
                    }), (/**
                     * @param {?} error
                     * @return {?}
                     */
                    function (error) { return console.error(error); }));
                }
                else {
                    item.cartography._links.self.href = item.cartography._links.self.href.split("{")[0];
                    item.substituteRelation('cartography', item.cartography).subscribe((/**
                     * @param {?} result
                     * @return {?}
                     */
                    function (result) {
                    }), (/**
                     * @param {?} error
                     * @return {?}
                     */
                    function (error) { return console.error(error); }));
                    item.cartography = item.cartography._links.self.href;
                }
                if (!item.connection) {
                    /** @type {?} */
                    var connection = {};
                    connection._links = {};
                    connection._links.self = {};
                    connection._links.self.href = "";
                    item.deleteRelation('connection', connection).subscribe((/**
                     * @param {?} result
                     * @return {?}
                     */
                    function (result) {
                    }), (/**
                     * @param {?} error
                     * @return {?}
                     */
                    function (error) { return console.error(error); }));
                }
                else {
                    item.connection._links.self.href = item.connection._links.self.href.split("{")[0];
                    item.substituteRelation('connection', item.connection).subscribe((/**
                     * @param {?} result
                     * @return {?}
                     */
                    function (result) {
                    }), (/**
                     * @param {?} error
                     * @return {?}
                     */
                    function (error) { return console.error(error); }));
                    item.connection = item.connection._links.self.href;
                }
                if (!item.ui) {
                    // item.deleteRelation('ui', item.ui).subscribe(result => {
                    // }, error => console.error(error)); 
                }
                else {
                    item.ui._links.self.href = item.ui._links.self.href.split("{")[0];
                    item.substituteRelation('ui', item.ui).subscribe((/**
                     * @param {?} result
                     * @return {?}
                     */
                    function (result) {
                    }), (/**
                     * @param {?} error
                     * @return {?}
                     */
                    function (error) { return console.error(error); }));
                    item.ui = item.ui._links.self.href;
                }
                if (!item.group) {
                    // item.deleteRelation('group', item.group).subscribe(result => {
                    // }, error => console.error(error)); 
                }
                else {
                    item.group._links.self.href = item.group._links.self.href.split("{")[0];
                    item.substituteRelation('group', item.group).subscribe((/**
                     * @param {?} result
                     * @return {?}
                     */
                    function (result) {
                    }), (/**
                     * @param {?} error
                     * @return {?}
                     */
                    function (error) { return console.error(error); }));
                    item.group = item.group._links.self.href;
                }
                if (!item.type) {
                    // item.deleteRelation('type', item.type).subscribe(result => {
                    // }, error => console.error(error)); 
                }
                else {
                    item.type._links.self.href = item.type._links.self.href.split("{")[0];
                    item.substituteRelation('type', item.type).subscribe((/**
                     * @param {?} result
                     * @return {?}
                     */
                    function (result) {
                    }), (/**
                     * @param {?} error
                     * @return {?}
                     */
                    function (error) { return console.error(error); }));
                    item.type = item.type._links.self.href;
                }
                if (item.roles) {
                    /** @type {?} */
                    var roles = __spread(item.roles);
                    delete item.roles;
                    item.substituteAllRelation('roles', roles).subscribe((/**
                     * @param {?} result
                     * @return {?}
                     */
                    function (result) {
                    }), (/**
                     * @param {?} error
                     * @return {?}
                     */
                    function (error) { return console.error(error); }));
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
            { type: core.Injectable }
        ];
        /** @nocollapse */
        TaskService.ctorParameters = function () { return [
            { type: core.Injector },
            { type: http.HttpClient }
        ]; };
        return TaskService;
    }(RestService));
    if (false) {
        /**
         * API resource path
         * @type {?}
         */
        TaskService.prototype.CONNECTION_API;
        /**
         * @type {?}
         * @private
         */
        TaskService.prototype.http;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * Task type model
     */
    var   /**
     * Task type model
     */
    TaskType = /** @class */ (function (_super) {
        __extends(TaskType, _super);
        function TaskType() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return TaskType;
    }(Resource));
    if (false) {
        /**
         * name
         * @type {?}
         */
        TaskType.prototype.name;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
            { type: core.Injectable }
        ];
        /** @nocollapse */
        TaskTypeService.ctorParameters = function () { return [
            { type: core.Injector },
            { type: http.HttpClient }
        ]; };
        return TaskTypeService;
    }(RestService));
    if (false) {
        /**
         * API resource path
         * @type {?}
         */
        TaskTypeService.prototype.CONNECTION_API;
        /**
         * @type {?}
         * @private
         */
        TaskTypeService.prototype.http;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * Task group model
     */
    var   /**
     * Task group model
     */
    TaskGroup = /** @class */ (function (_super) {
        __extends(TaskGroup, _super);
        function TaskGroup() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return TaskGroup;
    }(Resource));
    if (false) {
        /**
         * id
         * @type {?}
         */
        TaskGroup.prototype.id;
        /**
         * name
         * @type {?}
         */
        TaskGroup.prototype.name;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
            { type: core.Injectable }
        ];
        /** @nocollapse */
        TaskGroupService.ctorParameters = function () { return [
            { type: core.Injector },
            { type: http.HttpClient }
        ]; };
        return TaskGroupService;
    }(RestService));
    if (false) {
        /**
         * API resource path
         * @type {?}
         */
        TaskGroupService.prototype.CONNECTION_API;
        /**
         * @type {?}
         * @private
         */
        TaskGroupService.prototype.http;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * Task parameter model
     */
    var   /**
     * Task parameter model
     */
    TaskParameter = /** @class */ (function (_super) {
        __extends(TaskParameter, _super);
        function TaskParameter() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return TaskParameter;
    }(Resource));
    if (false) {
        /**
         * name
         * @type {?}
         */
        TaskParameter.prototype.name;
        /**
         * type
         * @type {?}
         */
        TaskParameter.prototype.type;
        /**
         * value
         * @type {?}
         */
        TaskParameter.prototype.value;
        /**
         * order
         * @type {?}
         */
        TaskParameter.prototype.order;
        /**
         * task
         * @type {?}
         */
        TaskParameter.prototype.task;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
                    item.substituteRelation('task', item.task).subscribe((/**
                     * @param {?} result
                     * @return {?}
                     */
                    function (result) {
                    }), (/**
                     * @param {?} error
                     * @return {?}
                     */
                    function (error) { return console.error(error); }));
                }
            }
            else {
                item.task = item.task._links.self.href;
                result = this.http.post(this.resourceService.getResourceUrl(this.TASK_PARAMETER_API), item);
            }
            return result;
        };
        TaskParameterService.decorators = [
            { type: core.Injectable }
        ];
        /** @nocollapse */
        TaskParameterService.ctorParameters = function () { return [
            { type: core.Injector },
            { type: http.HttpClient }
        ]; };
        return TaskParameterService;
    }(RestService));
    if (false) {
        /**
         * API resource path
         * @type {?}
         */
        TaskParameterService.prototype.TASK_PARAMETER_API;
        /**
         * @type {?}
         * @private
         */
        TaskParameterService.prototype.http;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * Task availability model
     */
    var   /**
     * Task availability model
     */
    TaskAvailability = /** @class */ (function (_super) {
        __extends(TaskAvailability, _super);
        function TaskAvailability() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return TaskAvailability;
    }(Resource));
    if (false) {
        /**
         * territory
         * @type {?}
         */
        TaskAvailability.prototype.territory;
        /**
         * task
         * @type {?}
         */
        TaskAvailability.prototype.task;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
                    item.substituteRelation('task', item.task).subscribe((/**
                     * @param {?} result
                     * @return {?}
                     */
                    function (result) {
                    }), (/**
                     * @param {?} error
                     * @return {?}
                     */
                    function (error) { return console.error(error); }));
                }
                if (item.territory != null) {
                    item.substituteRelation('territory', item.territory).subscribe((/**
                     * @param {?} result
                     * @return {?}
                     */
                    function (result) {
                    }), (/**
                     * @param {?} error
                     * @return {?}
                     */
                    function (error) { return console.error(error); }));
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
            { type: core.Injectable }
        ];
        /** @nocollapse */
        TaskAvailabilityService.ctorParameters = function () { return [
            { type: core.Injector },
            { type: http.HttpClient }
        ]; };
        return TaskAvailabilityService;
    }(RestService));
    if (false) {
        /**
         * API resource path
         * @type {?}
         */
        TaskAvailabilityService.prototype.TASK_AVAILABILITY_API;
        /**
         * @type {?}
         * @private
         */
        TaskAvailabilityService.prototype.http;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * Task UI model
     */
    var   /**
     * Task UI model
     */
    TaskUI = /** @class */ (function (_super) {
        __extends(TaskUI, _super);
        function TaskUI() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return TaskUI;
    }(Resource));
    if (false) {
        /**
         * name
         * @type {?}
         */
        TaskUI.prototype.name;
        /**
         * tooltip
         * @type {?}
         */
        TaskUI.prototype.tooltip;
        /**
         * order
         * @type {?}
         */
        TaskUI.prototype.order;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
            { type: core.Injectable }
        ];
        /** @nocollapse */
        TaskUIService.ctorParameters = function () { return [
            { type: core.Injector },
            { type: http.HttpClient }
        ]; };
        return TaskUIService;
    }(RestService));
    if (false) {
        /**
         * API resource path
         * @type {?}
         */
        TaskUIService.prototype.CONNECTION_API;
        /**
         * @type {?}
         * @private
         */
        TaskUIService.prototype.http;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * Task model
     */
    var   /**
     * Task model
     */
    Translation = /** @class */ (function (_super) {
        __extends(Translation, _super);
        function Translation() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Translation;
    }(Resource));
    if (false) {
        /**
         * id
         * @type {?}
         */
        Translation.prototype.id;
        /**
         * id
         * @type {?}
         */
        Translation.prototype.element;
        /**
         * name
         * @type {?}
         */
        Translation.prototype.translation;
        /**
         * column
         * @type {?}
         */
        Translation.prototype.column;
        /**
         * name
         * @type {?}
         */
        Translation.prototype.language;
        /**
         * name
         * @type {?}
         */
        Translation.prototype.languageName;
        /**
         * name
         * @type {?}
         */
        Translation.prototype.languageShortname;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
            { type: core.Injectable, args: [{
                        providedIn: 'root'
                    },] }
        ];
        /** @nocollapse */
        TranslationService.ctorParameters = function () { return [
            { type: core.Injector },
            { type: http.HttpClient }
        ]; };
        /** @nocollapse */ TranslationService.ngInjectableDef = core.ɵɵdefineInjectable({ factory: function TranslationService_Factory() { return new TranslationService(core.ɵɵinject(core.INJECTOR), core.ɵɵinject(http.HttpClient)); }, token: TranslationService, providedIn: "root" });
        return TranslationService;
    }(RestService));
    if (false) {
        /**
         * API resource path
         * @type {?}
         */
        TranslationService.prototype.TRANSLATION_API;
        /**
         * @type {?}
         * @private
         */
        TranslationService.prototype.http;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * Task model
     */
    var   /**
     * Task model
     */
    Language = /** @class */ (function (_super) {
        __extends(Language, _super);
        function Language() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Language;
    }(Resource));
    if (false) {
        /**
         * id
         * @type {?}
         */
        Language.prototype.id;
        /**
         * name
         * @type {?}
         */
        Language.prototype.shortname;
        /**
         * name
         * @type {?}
         */
        Language.prototype.name;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
            { type: core.Injectable, args: [{
                        providedIn: 'root'
                    },] }
        ];
        /** @nocollapse */
        LanguageService.ctorParameters = function () { return [
            { type: core.Injector },
            { type: http.HttpClient }
        ]; };
        /** @nocollapse */ LanguageService.ngInjectableDef = core.ɵɵdefineInjectable({ factory: function LanguageService_Factory() { return new LanguageService(core.ɵɵinject(core.INJECTOR), core.ɵɵinject(http.HttpClient)); }, token: LanguageService, providedIn: "root" });
        return LanguageService;
    }(RestService));
    if (false) {
        /**
         * API resource path
         * @type {?}
         */
        LanguageService.prototype.LANGUAGES_API;
        /**
         * @type {?}
         * @private
         */
        LanguageService.prototype.http;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * Service model
     */
    var   /**
     * Service model
     */
    Service = /** @class */ (function (_super) {
        __extends(Service, _super);
        function Service() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Service;
    }(Resource));
    if (false) {
        /**
         * id
         * @type {?}
         */
        Service.prototype.id;
        /**
         * name
         * @type {?}
         */
        Service.prototype.name;
        /**
         * type
         * @type {?}
         */
        Service.prototype.type;
        /**
         * url
         * @type {?}
         */
        Service.prototype.serviceURL;
        /**
         * projections
         * @type {?}
         */
        Service.prototype.supportedSRS;
        /**
         * legend
         * @type {?}
         */
        Service.prototype.legend;
        /**
         * infoUrl
         * @type {?}
         */
        Service.prototype.infoUrl;
        /**
         * system created date
         * @type {?}
         */
        Service.prototype.createdDate;
        /**
         * connection
         * @type {?}
         */
        Service.prototype.connection;
        /**
         * parameters
         * @type {?}
         */
        Service.prototype.parameters;
        /**
         * whether service is blocked
         * @type {?}
         */
        Service.prototype.blocked;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
            { type: core.Injectable }
        ];
        /** @nocollapse */
        ServiceService.ctorParameters = function () { return [
            { type: core.Injector },
            { type: http.HttpClient }
        ]; };
        return ServiceService;
    }(RestService));
    if (false) {
        /**
         * API resource path
         * @type {?}
         */
        ServiceService.prototype.SERVICE_API;
        /**
         * @type {?}
         * @private
         */
        ServiceService.prototype.http;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * Service model
     */
    var   /**
     * Service model
     */
    ConfigurationParameter = /** @class */ (function (_super) {
        __extends(ConfigurationParameter, _super);
        function ConfigurationParameter() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return ConfigurationParameter;
    }(Resource));
    if (false) {
        /**
         * id
         * @type {?}
         */
        ConfigurationParameter.prototype.id;
        /**
         * name
         * @type {?}
         */
        ConfigurationParameter.prototype.name;
        /**
         * value
         * @type {?}
         */
        ConfigurationParameter.prototype.value;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
            { type: core.Injectable, args: [{
                        providedIn: 'root'
                    },] }
        ];
        /** @nocollapse */
        ConfigurationParametersService.ctorParameters = function () { return [
            { type: core.Injector },
            { type: http.HttpClient }
        ]; };
        /** @nocollapse */ ConfigurationParametersService.ngInjectableDef = core.ɵɵdefineInjectable({ factory: function ConfigurationParametersService_Factory() { return new ConfigurationParametersService(core.ɵɵinject(core.INJECTOR), core.ɵɵinject(http.HttpClient)); }, token: ConfigurationParametersService, providedIn: "root" });
        return ConfigurationParametersService;
    }(RestService));
    if (false) {
        /**
         * API resource path
         * @type {?}
         */
        ConfigurationParametersService.prototype.CONFIGURATION_PARAMETERS_API;
        /**
         * @type {?}
         * @private
         */
        ConfigurationParametersService.prototype.http;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * Service parameter model
     */
    var   /**
     * Service parameter model
     */
    ServiceParameter = /** @class */ (function (_super) {
        __extends(ServiceParameter, _super);
        function ServiceParameter() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return ServiceParameter;
    }(Resource));
    if (false) {
        /**
         * name
         * @type {?}
         */
        ServiceParameter.prototype.name;
        /**
         * type
         * @type {?}
         */
        ServiceParameter.prototype.type;
        /**
         * value
         * @type {?}
         */
        ServiceParameter.prototype.value;
        /**
         * service
         * @type {?}
         */
        ServiceParameter.prototype.service;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
                    item.substituteRelation('service', service).subscribe((/**
                     * @param {?} result
                     * @return {?}
                     */
                    function (result) {
                    }), (/**
                     * @param {?} error
                     * @return {?}
                     */
                    function (error) { return console.error(error); }));
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
            { type: core.Injectable }
        ];
        /** @nocollapse */
        ServiceParameterService.ctorParameters = function () { return [
            { type: core.Injector },
            { type: http.HttpClient }
        ]; };
        return ServiceParameterService;
    }(RestService));
    if (false) {
        /**
         * API resource path
         * @type {?}
         */
        ServiceParameterService.prototype.SERVICE_PARAMETER_API;
        /**
         * @type {?}
         * @private
         */
        ServiceParameterService.prototype.http;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * Capabilitie model
     */
    var   /**
     * Capabilitie model
     */
    Capabilitie = /** @class */ (function (_super) {
        __extends(Capabilitie, _super);
        function Capabilitie() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Capabilitie;
    }(Resource));
    if (false) {
        /**
         * url
         * @type {?}
         */
        Capabilitie.prototype.url;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
                var headerDict = {
                    'Charset': 'UTF-8'
                };
                /** @type {?} */
                var requestOptions = {
                    headers: new http.HttpHeaders(headerDict),
                };
                /** @type {?} */
                var finalUrl = this.resourceService.getResourceUrl(this.CAPABILITIES_API);
                finalUrl = finalUrl.concat(url);
                console.log(finalUrl);
                result = this.http.get(finalUrl, requestOptions);
            }
            return result;
        };
        CapabilitiesService.decorators = [
            { type: core.Injectable, args: [{
                        providedIn: 'root'
                    },] }
        ];
        /** @nocollapse */
        CapabilitiesService.ctorParameters = function () { return [
            { type: core.Injector },
            { type: http.HttpClient }
        ]; };
        /** @nocollapse */ CapabilitiesService.ngInjectableDef = core.ɵɵdefineInjectable({ factory: function CapabilitiesService_Factory() { return new CapabilitiesService(core.ɵɵinject(core.INJECTOR), core.ɵɵinject(http.HttpClient)); }, token: CapabilitiesService, providedIn: "root" });
        return CapabilitiesService;
    }(RestService));
    if (false) {
        /**
         * API resource path
         * @type {?}
         */
        CapabilitiesService.prototype.CAPABILITIES_API;
        /**
         * @type {?}
         * @private
         */
        CapabilitiesService.prototype.http;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * Info model
     */
    var   /**
     * Info model
     */
    Info = /** @class */ (function (_super) {
        __extends(Info, _super);
        function Info() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Info;
    }(Resource));
    if (false) {
        /**
         * url
         * @type {?}
         */
        Info.prototype.url;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
        function (url) {
            /** @type {?} */
            var result;
            if (url) {
                /** @type {?} */
                var headerDict = {
                    'Charset': 'UTF-8'
                };
                /** @type {?} */
                var requestOptions = {
                    headers: new http.HttpHeaders(headerDict),
                };
                /** @type {?} */
                var finalUrl = this.resourceService.getResourceUrl(this.INFO_API);
                finalUrl = finalUrl.concat(url);
                console.log(finalUrl);
                result = this.http.get(finalUrl, requestOptions);
            }
            return result;
        };
        GetInfoService.decorators = [
            { type: core.Injectable, args: [{
                        providedIn: 'root'
                    },] }
        ];
        /** @nocollapse */
        GetInfoService.ctorParameters = function () { return [
            { type: core.Injector },
            { type: http.HttpClient }
        ]; };
        /** @nocollapse */ GetInfoService.ngInjectableDef = core.ɵɵdefineInjectable({ factory: function GetInfoService_Factory() { return new GetInfoService(core.ɵɵinject(core.INJECTOR), core.ɵɵinject(http.HttpClient)); }, token: GetInfoService, providedIn: "root" });
        return GetInfoService;
    }(RestService));
    if (false) {
        /**
         * API resource path
         * @type {?}
         */
        GetInfoService.prototype.INFO_API;
        /**
         * @type {?}
         * @private
         */
        GetInfoService.prototype.http;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * Cartography
     */
    var   /**
     * Cartography
     */
    Cartography = /** @class */ (function (_super) {
        __extends(Cartography, _super);
        function Cartography() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Cartography;
    }(Resource));
    if (false) {
        /**
         * id
         * @type {?}
         */
        Cartography.prototype.id;
        /**
         * name
         * @type {?}
         */
        Cartography.prototype.name;
        /**
         * type
         * @type {?}
         */
        Cartography.prototype.type;
        /**
         * service
         * @type {?}
         */
        Cartography.prototype.service;
        /**
         * order
         * @type {?}
         */
        Cartography.prototype.order;
        /**
         * description
         * @type {?}
         */
        Cartography.prototype.description;
        /**
         * source
         * @type {?}
         */
        Cartography.prototype.source;
        /**
         * whether cartography is blocked
         * @type {?}
         */
        Cartography.prototype.blocked;
        /**
         * apply filter to get map
         * @type {?}
         */
        Cartography.prototype.applyFilterToGetMap;
        /**
         * apply filter to get feature information
         * @type {?}
         */
        Cartography.prototype.applyFilterToGetFeatureInfo;
        /**
         * apply filter to spatial selection
         * @type {?}
         */
        Cartography.prototype.applyFilterToSpatialSelection;
        /**
         * selectable layers
         * @type {?}
         */
        Cartography.prototype.selectableLayers;
        /**
         * transparency
         * @type {?}
         */
        Cartography.prototype.transparency;
        /**
         * whether layer is queryable
         * @type {?}
         */
        Cartography.prototype.queryable;
        /**
         * whether layer is queryable
         * @type {?}
         */
        Cartography.prototype.queryAct;
        /**
         * query layer
         * @type {?}
         */
        Cartography.prototype.queryLay;
        /**
         * system created date
         * @type {?}
         */
        Cartography.prototype.createdDate;
        /**
         * minimum scale
         * @type {?}
         */
        Cartography.prototype.minimumScale;
        /**
         * maximum scale
         * @type {?}
         */
        Cartography.prototype.maximumScale;
        /**
         * layers
         * @type {?}
         */
        Cartography.prototype.layers;
        /**
         * connection
         * @type {?}
         */
        Cartography.prototype.connection;
        /**
         * queryableFeatureEnabled
         * @type {?}
         */
        Cartography.prototype.queryableFeatureEnabled;
        /**
         * queryableLayers
         * @type {?}
         */
        Cartography.prototype.queryableFeatureAvailable;
        /**
         * queryableLayers
         * @type {?}
         */
        Cartography.prototype.queryableLayers;
        /**
         * availabilities
         * @type {?}
         */
        Cartography.prototype.availabilities;
        /**
         * whether layer is queryable
         * @type {?}
         */
        Cartography.prototype.selectableFeatureEnabled;
        /**
         * selection layer
         * @type {?}
         */
        Cartography.prototype.selectionLayer;
        /**
         * selection service
         * @type {?}
         */
        Cartography.prototype.selectionService;
        /**
         * legend tip
         * @type {?}
         */
        Cartography.prototype.legendType;
        /**
         * legend url
         * @type {?}
         */
        Cartography.prototype.legendURL;
        /**
         * whether layer is editable
         * @type {?}
         */
        Cartography.prototype.editable;
        /**
         * metadata URL
         * @type {?}
         */
        Cartography.prototype.metadataURL;
        /**
         * metadata URL
         * @type {?}
         */
        Cartography.prototype.datasetURL;
        /**
         * whether layer is themable
         * @type {?}
         */
        Cartography.prototype.thematic;
        /**
         * geometry type
         * @type {?}
         */
        Cartography.prototype.geometryType;
        /** @type {?} */
        Cartography.prototype.styles;
        /** @type {?} */
        Cartography.prototype.useAllStyles;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
                    item.deleteRelation('service', cartographyService).subscribe((/**
                     * @param {?} result
                     * @return {?}
                     */
                    function (result) {
                    }), (/**
                     * @param {?} error
                     * @return {?}
                     */
                    function (error) { return console.error(error); }));
                }
                else {
                    item.substituteRelation('service', cartographyService).subscribe((/**
                     * @param {?} result
                     * @return {?}
                     */
                    function (result) {
                    }), (/**
                     * @param {?} error
                     * @return {?}
                     */
                    function (error) { return console.error(error); }));
                }
                if (cartographySelectionService._links.self.href == '' && cartographySelectionService) {
                    item.deleteRelation('spatialSelectionService', cartographySelectionService).subscribe((/**
                     * @param {?} result
                     * @return {?}
                     */
                    function (result) {
                    }), (/**
                     * @param {?} error
                     * @return {?}
                     */
                    function (error) { return console.error(error); }));
                }
                else {
                    item.substituteRelation('spatialSelectionService', cartographySelectionService).subscribe((/**
                     * @param {?} result
                     * @return {?}
                     */
                    function (result) {
                    }), (/**
                     * @param {?} error
                     * @return {?}
                     */
                    function (error) { return console.error(error); }));
                }
                result = this.http.put(item._links.self.href, item);
            }
            else {
                result = this.http.post(this.resourceService.getResourceUrl(this.CARTOGRAPHY_API), item);
            }
            return result;
        };
        CartographyService.decorators = [
            { type: core.Injectable }
        ];
        /** @nocollapse */
        CartographyService.ctorParameters = function () { return [
            { type: core.Injector },
            { type: http.HttpClient }
        ]; };
        return CartographyService;
    }(RestService));
    if (false) {
        /**
         * API resource path
         * @type {?}
         */
        CartographyService.prototype.CARTOGRAPHY_API;
        /**
         * @type {?}
         * @private
         */
        CartographyService.prototype.http;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * Cartography group
     */
    var   /**
     * Cartography group
     */
    CartographyGroup = /** @class */ (function (_super) {
        __extends(CartographyGroup, _super);
        function CartographyGroup() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return CartographyGroup;
    }(Resource));
    if (false) {
        /**
         * id
         * @type {?}
         */
        CartographyGroup.prototype.id;
        /**
         * name
         * @type {?}
         */
        CartographyGroup.prototype.name;
        /**
         * type
         * @type {?}
         */
        CartographyGroup.prototype.type;
        /**
         * members
         * @type {?}
         */
        CartographyGroup.prototype.members;
        /**
         * roles
         * @type {?}
         */
        CartographyGroup.prototype.roles;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
            { type: core.Injectable }
        ];
        /** @nocollapse */
        CartographyGroupService.ctorParameters = function () { return [
            { type: core.Injector },
            { type: http.HttpClient }
        ]; };
        return CartographyGroupService;
    }(RestService));
    if (false) {
        /**
         * API resource path
         * @type {?}
         */
        CartographyGroupService.prototype.CARTOGRAPHY_GROUP_API;
        /**
         * @type {?}
         * @private
         */
        CartographyGroupService.prototype.http;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * Cartography availability model
     */
    var   /**
     * Cartography availability model
     */
    CartographyAvailability = /** @class */ (function (_super) {
        __extends(CartographyAvailability, _super);
        function CartographyAvailability() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return CartographyAvailability;
    }(Resource));
    if (false) {
        /**
         * territory
         * @type {?}
         */
        CartographyAvailability.prototype.territory;
        /**
         * system created date
         * @type {?}
         */
        CartographyAvailability.prototype.createdDate;
        /**
         * cartography
         * @type {?}
         */
        CartographyAvailability.prototype.cartography;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
                    item.substituteRelation('cartography', item.cartography).subscribe((/**
                     * @param {?} result
                     * @return {?}
                     */
                    function (result) {
                    }), (/**
                     * @param {?} error
                     * @return {?}
                     */
                    function (error) { return console.error(error); }));
                }
                if (item.territory != null) {
                    item.substituteRelation('territory', item.territory).subscribe((/**
                     * @param {?} result
                     * @return {?}
                     */
                    function (result) {
                    }), (/**
                     * @param {?} error
                     * @return {?}
                     */
                    function (error) { return console.error(error); }));
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
            { type: core.Injectable }
        ];
        /** @nocollapse */
        CartographyAvailabilityService.ctorParameters = function () { return [
            { type: core.Injector },
            { type: http.HttpClient }
        ]; };
        return CartographyAvailabilityService;
    }(RestService));
    if (false) {
        /**
         * API resource path
         * @type {?}
         */
        CartographyAvailabilityService.prototype.CARTOGRAPHY_AVAILABILITY_API;
        /**
         * @type {?}
         * @private
         */
        CartographyAvailabilityService.prototype.http;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * Cartography availability model
     */
    var   /**
     * Cartography availability model
     */
    CartographyFilter = /** @class */ (function (_super) {
        __extends(CartographyFilter, _super);
        function CartographyFilter() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return CartographyFilter;
    }(Resource));
    if (false) {
        /**
         * name
         * @type {?}
         */
        CartographyFilter.prototype.name;
        /**
         * required
         * @type {?}
         */
        CartographyFilter.prototype.required;
        /**
         * type
         * @type {?}
         */
        CartographyFilter.prototype.type;
        /**
         * Territorial level.
         * @type {?}
         */
        CartographyFilter.prototype.territorialLevel;
        /**
         * column
         * @type {?}
         */
        CartographyFilter.prototype.column;
        /**
         * values
         * @type {?}
         */
        CartographyFilter.prototype.values;
        /**
         * value
         * @type {?}
         */
        CartographyFilter.prototype.valueType;
        /**
         * cartography
         * @type {?}
         */
        CartographyFilter.prototype.cartography;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
                    item.substituteRelation('cartography', item.cartography).subscribe((/**
                     * @param {?} result
                     * @return {?}
                     */
                    function (result) {
                    }), (/**
                     * @param {?} error
                     * @return {?}
                     */
                    function (error) { return console.error(error); }));
                }
                if (item.territorialLevel != null && item.territorialLevel != undefined) {
                    item.substituteRelation('territorialLevel', item.territorialLevel).subscribe((/**
                     * @param {?} result
                     * @return {?}
                     */
                    function (result) {
                    }), (/**
                     * @param {?} error
                     * @return {?}
                     */
                    function (error) { return console.error(error); }));
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
            { type: core.Injectable }
        ];
        /** @nocollapse */
        CartographyFilterService.ctorParameters = function () { return [
            { type: core.Injector },
            { type: http.HttpClient }
        ]; };
        return CartographyFilterService;
    }(RestService));
    if (false) {
        /**
         * API resource path
         * @type {?}
         */
        CartographyFilterService.prototype.CARTOGRAPHY_FILTER_API;
        /**
         * @type {?}
         * @private
         */
        CartographyFilterService.prototype.http;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * Service parameter model
     */
    var   /**
     * Service parameter model
     */
    CartographyParameter = /** @class */ (function (_super) {
        __extends(CartographyParameter, _super);
        function CartographyParameter() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return CartographyParameter;
    }(Resource));
    if (false) {
        /**
         * name
         * @type {?}
         */
        CartographyParameter.prototype.name;
        /**
         * type
         * @type {?}
         */
        CartographyParameter.prototype.type;
        /**
         * value
         * @type {?}
         */
        CartographyParameter.prototype.value;
        /**
         * order
         * @type {?}
         */
        CartographyParameter.prototype.order;
        /**
         * cartography
         * @type {?}
         */
        CartographyParameter.prototype.cartography;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
                    item.substituteRelation('cartography', cartography).subscribe((/**
                     * @param {?} result
                     * @return {?}
                     */
                    function (result) {
                    }), (/**
                     * @param {?} error
                     * @return {?}
                     */
                    function (error) { return console.error(error); }));
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
            { type: core.Injectable }
        ];
        /** @nocollapse */
        CartographyParameterService.ctorParameters = function () { return [
            { type: core.Injector },
            { type: http.HttpClient }
        ]; };
        return CartographyParameterService;
    }(RestService));
    if (false) {
        /**
         * API resource path
         * @type {?}
         */
        CartographyParameterService.prototype.CARTOGRAPHY_PARAMETER_API;
        /**
         * @type {?}
         * @private
         */
        CartographyParameterService.prototype.http;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
                    item.substituteRelation('cartography', cartography).subscribe((/**
                     * @param {?} result
                     * @return {?}
                     */
                    function (result) {
                    }), (/**
                     * @param {?} error
                     * @return {?}
                     */
                    function (error) { return console.error(error); }));
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
            { type: core.Injectable }
        ];
        /** @nocollapse */
        CartographySpatialSelectionParameterService.ctorParameters = function () { return [
            { type: core.Injector },
            { type: http.HttpClient }
        ]; };
        return CartographySpatialSelectionParameterService;
    }(RestService));
    if (false) {
        /**
         * API resource path
         * @type {?}
         */
        CartographySpatialSelectionParameterService.prototype.CARTOGRAPHY_SPATIAL_SELECTION_PARAMETER_API;
        /**
         * @type {?}
         * @private
         */
        CartographySpatialSelectionParameterService.prototype.http;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * Cartography style model
     */
    var   /**
     * Cartography style model
     */
    CartographyStyle = /** @class */ (function (_super) {
        __extends(CartographyStyle, _super);
        function CartographyStyle() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return CartographyStyle;
    }(Resource));
    if (false) {
        /**
         * name
         * @type {?}
         */
        CartographyStyle.prototype.name;
        /**
         * title
         * @type {?}
         */
        CartographyStyle.prototype.title;
        /**
         * description
         * @type {?}
         */
        CartographyStyle.prototype.description;
        /**
         * format
         * @type {?}
         */
        CartographyStyle.prototype.format;
        /**
         * width
         * @type {?}
         */
        CartographyStyle.prototype.width;
        /**
         * height
         * @type {?}
         */
        CartographyStyle.prototype.height;
        /**
         * url
         * @type {?}
         */
        CartographyStyle.prototype.url;
        /**
         * cartography
         * @type {?}
         */
        CartographyStyle.prototype.cartography;
        /** @type {?} */
        CartographyStyle.prototype.defaultStyle;
        /** @type {?} */
        CartographyStyle.prototype.legendURL;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
                    item.substituteRelation('cartography', cartography).subscribe((/**
                     * @param {?} result
                     * @return {?}
                     */
                    function (result) {
                    }), (/**
                     * @param {?} error
                     * @return {?}
                     */
                    function (error) { return console.error(error); }));
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
            { type: core.Injectable, args: [{
                        providedIn: 'root'
                    },] }
        ];
        /** @nocollapse */
        CartographyStyleService.ctorParameters = function () { return [
            { type: core.Injector },
            { type: http.HttpClient }
        ]; };
        /** @nocollapse */ CartographyStyleService.ngInjectableDef = core.ɵɵdefineInjectable({ factory: function CartographyStyleService_Factory() { return new CartographyStyleService(core.ɵɵinject(core.INJECTOR), core.ɵɵinject(http.HttpClient)); }, token: CartographyStyleService, providedIn: "root" });
        return CartographyStyleService;
    }(RestService));
    if (false) {
        /**
         * API resource path
         * @type {?}
         */
        CartographyStyleService.prototype.CARTOGRAPHY_STYLES_API;
        /**
         * @type {?}
         * @private
         */
        CartographyStyleService.prototype.http;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * Background model
     */
    var   /**
     * Background model
     */
    Background = /** @class */ (function (_super) {
        __extends(Background, _super);
        function Background() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Background;
    }(Resource));
    if (false) {
        /**
         * id
         * @type {?}
         */
        Background.prototype.id;
        /**
         * name
         * @type {?}
         */
        Background.prototype.name;
        /**
         * description
         * @type {?}
         */
        Background.prototype.description;
        /**
         * image
         * @type {?}
         */
        Background.prototype.image;
        /**
         * whether background is active
         * @type {?}
         */
        Background.prototype.active;
        /**
         * system created date
         * @type {?}
         */
        Background.prototype.createdDate;
        /**
         * cartography group
         * @type {?}
         */
        Background.prototype.cartographyGroup;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
                    item.deleteRelation('cartographyGroup', backgroundCartographyGroup).subscribe((/**
                     * @param {?} result
                     * @return {?}
                     */
                    function (result) {
                    }), (/**
                     * @param {?} error
                     * @return {?}
                     */
                    function (error) { return console.error(error); }));
                }
                else {
                    item.substituteRelation('cartographyGroup', backgroundCartographyGroup).subscribe((/**
                     * @param {?} result
                     * @return {?}
                     */
                    function (result) {
                    }), (/**
                     * @param {?} error
                     * @return {?}
                     */
                    function (error) { return console.error(error); }));
                }
                result = this.http.put(item._links.self.href, item);
            }
            else {
                result = this.http.post(this.resourceService.getResourceUrl(this.BACKGROUND_API), item);
            }
            return result;
        };
        BackgroundService.decorators = [
            { type: core.Injectable }
        ];
        /** @nocollapse */
        BackgroundService.ctorParameters = function () { return [
            { type: core.Injector },
            { type: http.HttpClient }
        ]; };
        return BackgroundService;
    }(RestService));
    if (false) {
        /**
         * API resource path
         * @type {?}
         */
        BackgroundService.prototype.BACKGROUND_API;
        /**
         * @type {?}
         * @private
         */
        BackgroundService.prototype.http;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * Tree model
     */
    var   /**
     * Tree model
     */
    Tree = /** @class */ (function (_super) {
        __extends(Tree, _super);
        function Tree() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Tree;
    }(Resource));
    if (false) {
        /**
         * id
         * @type {?}
         */
        Tree.prototype.id;
        /**
         * name
         * @type {?}
         */
        Tree.prototype.name;
        /**
         * description
         * @type {?}
         */
        Tree.prototype.description;
        /**
         * image
         * @type {?}
         */
        Tree.prototype.image;
        /**
         * nodes
         * @type {?}
         */
        Tree.prototype.nodes;
        /**
         * available roles
         * @type {?}
         */
        Tree.prototype.availableRoles;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
            { type: core.Injectable }
        ];
        /** @nocollapse */
        TreeService.ctorParameters = function () { return [
            { type: core.Injector },
            { type: http.HttpClient }
        ]; };
        return TreeService;
    }(RestService));
    if (false) {
        /**
         * API resource path
         * @type {?}
         */
        TreeService.prototype.TREE_API;
        /**
         * @type {?}
         * @private
         */
        TreeService.prototype.http;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * Tree node model
     */
    var   /**
     * Tree node model
     */
    TreeNode = /** @class */ (function (_super) {
        __extends(TreeNode, _super);
        function TreeNode() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return TreeNode;
    }(Resource));
    if (false) {
        /**
         * name
         * @type {?}
         */
        TreeNode.prototype.name;
        /**
         * tooltip
         * @type {?}
         */
        TreeNode.prototype.tooltip;
        /**
         * description
         * @type {?}
         */
        TreeNode.prototype.description;
        /**
         * datasetURL
         * @type {?}
         */
        TreeNode.prototype.datasetURL;
        /**
         * metadataURL
         * @type {?}
         */
        TreeNode.prototype.metadataURL;
        /**
         * order
         * @type {?}
         */
        TreeNode.prototype.order;
        /**
         * whether tree node is active
         * @type {?}
         */
        TreeNode.prototype.active;
        /**
         * parent tree node
         * @type {?}
         */
        TreeNode.prototype.radio;
        /**
         * parent tree node
         * @type {?}
         */
        TreeNode.prototype.parent;
        /**
         * displayed cartography
         * @type {?}
         */
        TreeNode.prototype.cartography;
        /**
         * tree
         * @type {?}
         */
        TreeNode.prototype.tree;
        /**
         * filterGetFeatureInfo
         * @type {?}
         */
        TreeNode.prototype.filterGetFeatureInfo;
        /**
         * filterGetMap
         * @type {?}
         */
        TreeNode.prototype.filterGetMap;
        /**
         * filterSelectable
         * @type {?}
         */
        TreeNode.prototype.filterSelectable;
        /**
         * style
         * @type {?}
         */
        TreeNode.prototype.style;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
                    item.substituteRelation('tree', itemTree).subscribe((/**
                     * @param {?} result
                     * @return {?}
                     */
                    function (result) {
                    }), (/**
                     * @param {?} error
                     * @return {?}
                     */
                    function (error) { return console.error(error); }));
                }
                if (itemCartography != null) {
                    item.substituteRelation('cartography', itemCartography).subscribe((/**
                     * @param {?} result
                     * @return {?}
                     */
                    function (result) {
                    }), (/**
                     * @param {?} error
                     * @return {?}
                     */
                    function (error) { return console.error(error); }));
                }
                if (itemParent != null) {
                    item.substituteRelation('parent', itemParent).subscribe((/**
                     * @param {?} result
                     * @return {?}
                     */
                    function (result) {
                    }), (/**
                     * @param {?} error
                     * @return {?}
                     */
                    function (error) { return console.error(error); }));
                }
                else {
                    /** @type {?} */
                    var treeNodeParent = {};
                    treeNodeParent._links = {};
                    treeNodeParent._links.self = {};
                    treeNodeParent._links.self.href = "";
                    item.deleteRelation('parent', treeNodeParent).subscribe((/**
                     * @param {?} result
                     * @return {?}
                     */
                    function (result) {
                    }), (/**
                     * @param {?} error
                     * @return {?}
                     */
                    function (error) { return console.error(error); }));
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
            { type: core.Injectable }
        ];
        /** @nocollapse */
        TreeNodeService.ctorParameters = function () { return [
            { type: core.Injector },
            { type: http.HttpClient }
        ]; };
        return TreeNodeService;
    }(RestService));
    if (false) {
        /**
         * API resource path
         * @type {?}
         */
        TreeNodeService.prototype.TREE_NODE_API;
        /**
         * @type {?}
         * @private
         */
        TreeNodeService.prototype.http;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    //FIXME ensure application creation in admin app upon initialization (as it is done with Roles and default Users)
    /**
     * Territorial appliction name
     * @type {?}
     */
    var TERRITORIAL_APP_NAME = "Aplicación Territorial";
    /**
     * Application model
     */
    var   /**
     * Application model
     */
    Application = /** @class */ (function (_super) {
        __extends(Application, _super);
        function Application() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Application;
    }(Resource));
    if (false) {
        /**
         * id
         * @type {?}
         */
        Application.prototype.id;
        /**
         * name
         * @type {?}
         */
        Application.prototype.name;
        /**
         * type
         * @type {?}
         */
        Application.prototype.type;
        /**
         * title
         * @type {?}
         */
        Application.prototype.title;
        /**
         * theme
         * @type {?}
         */
        Application.prototype.theme;
        /**
         * urlTemplate
         * @type {?}
         */
        Application.prototype.jspTemplate;
        /**
         * system created date
         * @type {?}
         */
        Application.prototype.createdDate;
        /**
         * available roles
         * @type {?}
         */
        Application.prototype.availableRoles;
        /**
         * trees
         * @type {?}
         */
        Application.prototype.trees;
        /**
         * scales (comma-separated values)
         * @type {?}
         */
        Application.prototype.scales;
        /**
         * projections(comma-separated EPSG codes)
         * @type {?}
         */
        Application.prototype.srs;
        /**
         * whether application tree will auto refresh
         * @type {?}
         */
        Application.prototype.treeAutoRefresh;
        /**
         * backgrounds
         * @type {?}
         */
        Application.prototype.backgrounds;
        /**
         * situation map
         * @type {?}
         */
        Application.prototype.situationMap;
        /**
         * parameters
         * @type {?}
         */
        Application.prototype.parameters;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
                    item.deleteRelation('situationMap', applicationSituationMap).subscribe((/**
                     * @param {?} result
                     * @return {?}
                     */
                    function (result) {
                    }), (/**
                     * @param {?} error
                     * @return {?}
                     */
                    function (error) { return console.error(error); }));
                }
                else {
                    item.substituteRelation('situationMap', applicationSituationMap).subscribe((/**
                     * @param {?} result
                     * @return {?}
                     */
                    function (result) {
                    }), (/**
                     * @param {?} error
                     * @return {?}
                     */
                    function (error) { return console.error(error); }));
                }
                result = this.http.put(item._links.self.href, item);
            }
            else {
                result = this.http.post(this.resourceService.getResourceUrl(this.APPLICATION_API), item);
            }
            return result;
        };
        ApplicationService.decorators = [
            { type: core.Injectable }
        ];
        /** @nocollapse */
        ApplicationService.ctorParameters = function () { return [
            { type: core.Injector },
            { type: http.HttpClient }
        ]; };
        return ApplicationService;
    }(RestService));
    if (false) {
        /**
         * API resource path
         * @type {?}
         */
        ApplicationService.prototype.APPLICATION_API;
        /**
         * @type {?}
         * @private
         */
        ApplicationService.prototype.http;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * Application background model
     */
    var   /**
     * Application background model
     */
    ApplicationBackground = /** @class */ (function (_super) {
        __extends(ApplicationBackground, _super);
        function ApplicationBackground() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return ApplicationBackground;
    }(Resource));
    if (false) {
        /**
         * order
         * @type {?}
         */
        ApplicationBackground.prototype.order;
        /**
         * background
         * @type {?}
         */
        ApplicationBackground.prototype.background;
        /**
         * application
         * @type {?}
         */
        ApplicationBackground.prototype.application;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
                    item.substituteRelation('application', item.application).subscribe((/**
                     * @param {?} result
                     * @return {?}
                     */
                    function (result) {
                    }), (/**
                     * @param {?} error
                     * @return {?}
                     */
                    function (error) { return console.error(error); }));
                }
                if (item.background != null) {
                    item.substituteRelation('background', item.background).subscribe((/**
                     * @param {?} result
                     * @return {?}
                     */
                    function (result) {
                    }), (/**
                     * @param {?} error
                     * @return {?}
                     */
                    function (error) { return console.error(error); }));
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
            { type: core.Injectable }
        ];
        /** @nocollapse */
        ApplicationBackgroundService.ctorParameters = function () { return [
            { type: core.Injector },
            { type: http.HttpClient }
        ]; };
        return ApplicationBackgroundService;
    }(RestService));
    if (false) {
        /**
         * API resource path
         * @type {?}
         */
        ApplicationBackgroundService.prototype.APPLICATION_BACKGROUND_API;
        /**
         * @type {?}
         * @private
         */
        ApplicationBackgroundService.prototype.http;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * Application parameter model
     */
    var   /**
     * Application parameter model
     */
    ApplicationParameter = /** @class */ (function (_super) {
        __extends(ApplicationParameter, _super);
        function ApplicationParameter() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return ApplicationParameter;
    }(Resource));
    if (false) {
        /**
         * name
         * @type {?}
         */
        ApplicationParameter.prototype.name;
        /**
         * type
         * @type {?}
         */
        ApplicationParameter.prototype.type;
        /**
         * value
         * @type {?}
         */
        ApplicationParameter.prototype.value;
        /**
         * application
         * @type {?}
         */
        ApplicationParameter.prototype.application;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
                    item.substituteRelation('application', item.application).subscribe((/**
                     * @param {?} result
                     * @return {?}
                     */
                    function (result) {
                    }), (/**
                     * @param {?} error
                     * @return {?}
                     */
                    function (error) { return console.error(error); }));
                }
            }
            else {
                item.application = item.application._links.self.href;
                result = this.http.post(this.resourceService.getResourceUrl(this.APPLICATION_PARAMETER_API), item);
            }
            return result;
        };
        ApplicationParameterService.decorators = [
            { type: core.Injectable }
        ];
        /** @nocollapse */
        ApplicationParameterService.ctorParameters = function () { return [
            { type: core.Injector },
            { type: http.HttpClient }
        ]; };
        return ApplicationParameterService;
    }(RestService));
    if (false) {
        /**
         * API resource path
         * @type {?}
         */
        ApplicationParameterService.prototype.APPLICATION_PARAMETER_API;
        /**
         * @type {?}
         * @private
         */
        ApplicationParameterService.prototype.http;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * Connection model
     */
    var   /**
     * Connection model
     */
    CodeList = /** @class */ (function (_super) {
        __extends(CodeList, _super);
        function CodeList() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return CodeList;
    }(Resource));
    if (false) {
        /**
         * id
         * @type {?}
         */
        CodeList.prototype.id;
        /**
         * name
         * @type {?}
         */
        CodeList.prototype.codeListName;
        /**
         * type
         * @type {?}
         */
        CodeList.prototype.value;
        /**
         * user
         * @type {?}
         */
        CodeList.prototype.description;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
            { type: core.Injectable }
        ];
        /** @nocollapse */
        CodeListService.ctorParameters = function () { return [
            { type: core.Injector },
            { type: http.HttpClient }
        ]; };
        return CodeListService;
    }(RestService));
    if (false) {
        /**
         * API resource path
         * @type {?}
         */
        CodeListService.prototype.CODELIST_API;
        /**
         * @type {?}
         * @private
         */
        CodeListService.prototype.http;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * Layer model: configure Layer data and displaying configuration
     */
    var   /**
     * Layer model: configure Layer data and displaying configuration
     */
    Layer = /** @class */ (function () {
        function Layer() {
            // Display data
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
    if (false) {
        /**
         * layer visibility
         * @type {?}
         */
        Layer.prototype.visibility;
        /**
         * Transparency (Transparent) 0-1 (Opaque)
         * @type {?}
         */
        Layer.prototype.opacity;
        /**
         * title
         * @type {?}
         */
        Layer.prototype.title;
        /**
         * Id to index
         * @type {?}
         */
        Layer.prototype.id;
        /**
         * Service Name
         * @type {?}
         */
        Layer.prototype.serverName;
        /**
         * Service attributions
         * @type {?}
         */
        Layer.prototype.attributions;
        /**
         * Request format (image/jpg, ...)
         * @type {?}
         */
        Layer.prototype.format;
        /**
         * Request service version
         * @type {?}
         */
        Layer.prototype.version;
        /**
         * Service url
         * @type {?}
         */
        Layer.prototype.url;
        /**
         * Is base layer?
         * @type {?}
         */
        Layer.prototype.isBaseLayer;
        /**
         * Request layer name
         * @type {?}
         */
        Layer.prototype.name;
        /**
         * Is tiled?
         * @type {?}
         */
        Layer.prototype.tiled;
        /**
         * Description
         * @type {?}
         */
        Layer.prototype.desc;
        /**
         * Transparent request parameter?
         * @type {?}
         */
        Layer.prototype.url_transparent;
        /**
         * Request Background parameter color (Hexa)
         * @type {?}
         */
        Layer.prototype.url_bgcolor;
        /**
         * Request Exception URL
         * @type {?}
         */
        Layer.prototype.url_exception;
        /**
         * Extent for tiled services
         * @type {?}
         */
        Layer.prototype.extent;
        /**
         * Tile height (if not defined, the default map is taken)
         * @type {?}
         */
        Layer.prototype.tileHeight;
        /**
         * Tile width (if not defined, the default map is taken)
         * @type {?}
         */
        Layer.prototype.tileWidth;
        /**
         * Enabled for GetFeatureInfo requests (enabled to use the viewer features information tool)
         * @type {?}
         */
        Layer.prototype.queryable;
        /**
         * Minimum scale
         * @type {?}
         */
        Layer.prototype.minimumScale;
        /**
         * Maximum scale
         * @type {?}
         */
        Layer.prototype.maximumScale;
        /**
         * List of available CRS
         * @type {?}
         */
        Layer.prototype.projections;
        /**
         * Features information URL
         * @type {?}
         */
        Layer.prototype.infoUrl;
        /**
         * Metadata information URL
         * @type {?}
         */
        Layer.prototype.metadataUrl;
        /**
         * Legend URL
         * @type {?}
         */
        Layer.prototype.legendUrl;
        /**
         * Array of OptionalParameter object that defines other optional parameter-value pairs for the request (TIME ...)
         * @type {?}
         */
        Layer.prototype.optionalParameters;
    }
    /**
     * Optional parameter model: configure parameter-value pair to add to the request layer URL
     */
    var   /**
     * Optional parameter model: configure parameter-value pair to add to the request layer URL
     */
    OptionalParameter = /** @class */ (function () {
        function OptionalParameter() {
        }
        return OptionalParameter;
    }());
    if (false) {
        /**
         * key
         * @type {?}
         */
        OptionalParameter.prototype.key;
        /**
         * value
         * @type {?}
         */
        OptionalParameter.prototype.value;
    }
    /**
     * Layer configuration model: modify the configuration of a layer when interacting with the map (make visible, move the layer ...)
     */
    var   /**
     * Layer configuration model: modify the configuration of a layer when interacting with the map (make visible, move the layer ...)
     */
    LayerConfiguration = /** @class */ (function () {
        function LayerConfiguration() {
        }
        return LayerConfiguration;
    }());
    if (false) {
        /**
         * Identifier to index
         * @type {?}
         */
        LayerConfiguration.prototype.id;
        /**
         * Layer visibility
         * @type {?}
         */
        LayerConfiguration.prototype.visibility;
        /**
         * Layer transparency (Transparent) 0-1 (Opaque)
         * @type {?}
         */
        LayerConfiguration.prototype.opacity;
        /**
         * Layer position
         * @type {?}
         */
        LayerConfiguration.prototype.position;
    }
    /**
     * Layer group model
     */
    var   /**
     * Layer group model
     */
    LayerGroup = /** @class */ (function () {
        function LayerGroup() {
        }
        return LayerGroup;
    }());
    if (false) {
        /**
         * initially activated (all visible layers)
         * @type {?}
         */
        LayerGroup.prototype.active;
        /**
         * group name
         * @type {?}
         */
        LayerGroup.prototype.name;
        /**
         * group id
         * @type {?}
         */
        LayerGroup.prototype.id;
        /**
         * array of child Layers
         * @type {?}
         */
        LayerGroup.prototype.layers;
    }
    /**
     * Map options configuration model
     */
    var   /**
     * Map options configuration model
     */
    MapOptionsConfiguration = /** @class */ (function () {
        function MapOptionsConfiguration() {
        }
        return MapOptionsConfiguration;
    }());
    if (false) {
        /**
         * scales
         * @type {?}
         */
        MapOptionsConfiguration.prototype.scales;
        /**
         * projections
         * @type {?}
         */
        MapOptionsConfiguration.prototype.projections;
        /**
         * minimum scale
         * @type {?}
         */
        MapOptionsConfiguration.prototype.minScale;
        /**
         * maximum scale
         * @type {?}
         */
        MapOptionsConfiguration.prototype.maxScale;
        /**
         * extent
         * @type {?}
         */
        MapOptionsConfiguration.prototype.extent;
        /**
         * maximum extent
         * @type {?}
         */
        MapOptionsConfiguration.prototype.maxExtent;
        /**
         * tile width
         * @type {?}
         */
        MapOptionsConfiguration.prototype.tileWidth;
        /**
         * tile height
         * @type {?}
         */
        MapOptionsConfiguration.prototype.tileHeight;
        /**
         * parameters
         * @type {?}
         */
        MapOptionsConfiguration.prototype.parameters;
    }
    /**
     * Map component status model
     */
    var   /**
     * Map component status model
     */
    MapComponentStatus = /** @class */ (function () {
        function MapComponentStatus() {
            /**
             * loaded?
             */ this.loaded = false;
        }
        return MapComponentStatus;
    }());
    if (false) {
        /**
         * loaded?
         * @type {?}
         */
        MapComponentStatus.prototype.loaded;
    }
    var MapConfigurationManagerService = /** @class */ (function () {
        /** constructor*/
        function MapConfigurationManagerService() {
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
            //
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
         * @private
         * @return {?}
         */
        MapConfigurationManagerService.prototype.refreshBaseLayerGroups = /**
         * @private
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
        /** refresh layers */
        /**
         * refresh layers
         * @private
         * @return {?}
         */
        MapConfigurationManagerService.prototype.refreshLayers = /**
         * refresh layers
         * @private
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
         * @private
         * @param {?} layer
         * @return {?}
         */
        MapConfigurationManagerService.prototype.refreshAddLayers = /**
         * @private
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
         * @private
         * @param {?} layer
         * @return {?}
         */
        MapConfigurationManagerService.prototype.refreshRemoveLayers = /**
         * @private
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
         * @private
         * @param {?} id
         * @return {?}
         */
        MapConfigurationManagerService.prototype.getLayerIndexById = /**
         * @private
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
         * @private
         * @param {?} id
         * @param {?} opacity
         * @param {?} visibility
         * @param {?} position
         * @return {?}
         */
        MapConfigurationManagerService.prototype.refreshLayerConfiguration = /**
         * @private
         * @param {?} id
         * @param {?} opacity
         * @param {?} visibility
         * @param {?} position
         * @return {?}
         */
        function (id, opacity, visibility, position) {
            // Send the new values so that all subscribers are updated
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
            { type: core.Injectable, args: [{
                        providedIn: 'root'
                    },] }
        ];
        /** @nocollapse */
        MapConfigurationManagerService.ctorParameters = function () { return []; };
        /** @nocollapse */ MapConfigurationManagerService.ngInjectableDef = core.ɵɵdefineInjectable({ factory: function MapConfigurationManagerService_Factory() { return new MapConfigurationManagerService(); }, token: MapConfigurationManagerService, providedIn: "root" });
        return MapConfigurationManagerService;
    }());
    if (false) {
        /**
         * @type {?}
         * @private
         */
        MapConfigurationManagerService.prototype.layersSubject;
        /**
         * @type {?}
         * @private
         */
        MapConfigurationManagerService.prototype.layers;
        /**
         * @type {?}
         * @private
         */
        MapConfigurationManagerService.prototype.baseLayerGroupsSubject;
        /**
         * @type {?}
         * @private
         */
        MapConfigurationManagerService.prototype.baseLayerGroups;
        /**
         * @type {?}
         * @private
         */
        MapConfigurationManagerService.prototype.layerConfigurationSubject;
        /**
         * @type {?}
         * @private
         */
        MapConfigurationManagerService.prototype.addLayersSubject;
        /**
         * @type {?}
         * @private
         */
        MapConfigurationManagerService.prototype.removeLayersSubject;
        /**
         * @type {?}
         * @private
         */
        MapConfigurationManagerService.prototype.situationMapConfigurationSubject;
        /**
         * @type {?}
         * @private
         */
        MapConfigurationManagerService.prototype.mapOptionsConfigurationSubject;
        /**
         * @type {?}
         * @private
         */
        MapConfigurationManagerService.prototype.mapComponentStatusSubject;
        /**
         * layer count
         * @type {?}
         */
        MapConfigurationManagerService.prototype.count;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
                this.authorities = typeof value === 'string' ? [(/** @type {?} */ (value))] : (/** @type {?} */ (value));
                this.updateView();
                // Get notified each time authentication state changes.
                this.principal.getAuthenticationState().subscribe((/**
                 * @param {?} identity
                 * @return {?}
                 */
                function (identity) { return _this.updateView(); }));
            },
            enumerable: true,
            configurable: true
        });
        /** update view */
        /**
         * update view
         * @private
         * @return {?}
         */
        HasAnyAuthorityDirective.prototype.updateView = /**
         * update view
         * @private
         * @return {?}
         */
        function () {
            var _this = this;
            if (this.territory) {
                this.principal.hasAnyAuthorityOnTerritory(this.authorities, this.territory).then((/**
                 * @param {?} result
                 * @return {?}
                 */
                function (result) {
                    _this.viewContainerRef.clear();
                    if (result) {
                        _this.viewContainerRef.createEmbeddedView(_this.templateRef);
                    }
                }));
            }
            else {
                this.principal.hasAnyAuthority(this.authorities).then((/**
                 * @param {?} result
                 * @return {?}
                 */
                function (result) {
                    _this.viewContainerRef.clear();
                    if (result) {
                        _this.viewContainerRef.createEmbeddedView(_this.templateRef);
                    }
                }));
            }
        };
        HasAnyAuthorityDirective.decorators = [
            { type: core.Directive, args: [{
                        selector: '[sitmunHasAnyAuthority]'
                    },] }
        ];
        /** @nocollapse */
        HasAnyAuthorityDirective.ctorParameters = function () { return [
            { type: Principal },
            { type: core.TemplateRef },
            { type: core.ViewContainerRef }
        ]; };
        HasAnyAuthorityDirective.propDecorators = {
            territory: [{ type: core.Input }],
            sitmunHasAnyAuthority: [{ type: core.Input }]
        };
        return HasAnyAuthorityDirective;
    }());
    if (false) {
        /**
         * authorities to check
         * @type {?}
         */
        HasAnyAuthorityDirective.prototype.authorities;
        /**
         * territory to check authorities
         * @type {?}
         */
        HasAnyAuthorityDirective.prototype.territory;
        /**
         * @type {?}
         * @private
         */
        HasAnyAuthorityDirective.prototype.principal;
        /**
         * @type {?}
         * @private
         */
        HasAnyAuthorityDirective.prototype.templateRef;
        /**
         * @type {?}
         * @private
         */
        HasAnyAuthorityDirective.prototype.viewContainerRef;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
                this.authorities = typeof opts.authorities === 'string' ? [(/** @type {?} */ (opts.authorities))] : (/** @type {?} */ (opts.authorities));
                this.territory = opts.territory;
                this.updateView();
                // Get notified each time authentication state changes.
                this.principal.getAuthenticationState().subscribe((/**
                 * @param {?} identity
                 * @return {?}
                 */
                function (identity) { return _this.updateView(); }));
            },
            enumerable: true,
            configurable: true
        });
        /** update view */
        /**
         * update view
         * @private
         * @return {?}
         */
        HasAnyAuthorityOnTerritoryDirective.prototype.updateView = /**
         * update view
         * @private
         * @return {?}
         */
        function () {
            var _this = this;
            if (this.territory) {
                this.principal.hasAnyAuthorityOnTerritory(this.authorities, this.territory).then((/**
                 * @param {?} result
                 * @return {?}
                 */
                function (result) {
                    _this.viewContainerRef.clear();
                    if (result) {
                        _this.viewContainerRef.createEmbeddedView(_this.templateRef);
                    }
                }));
            }
            else {
                this.principal.hasAnyAuthority(this.authorities).then((/**
                 * @param {?} result
                 * @return {?}
                 */
                function (result) {
                    _this.viewContainerRef.clear();
                    if (result) {
                        _this.viewContainerRef.createEmbeddedView(_this.templateRef);
                    }
                }));
            }
        };
        HasAnyAuthorityOnTerritoryDirective.decorators = [
            { type: core.Directive, args: [{
                        selector: '[sitmunHasAnyAuthorityOnTerritory]'
                    },] }
        ];
        /** @nocollapse */
        HasAnyAuthorityOnTerritoryDirective.ctorParameters = function () { return [
            { type: Principal },
            { type: core.TemplateRef },
            { type: core.ViewContainerRef }
        ]; };
        HasAnyAuthorityOnTerritoryDirective.propDecorators = {
            sitmunHasAnyAuthorityOnTerritory: [{ type: core.Input }]
        };
        return HasAnyAuthorityOnTerritoryDirective;
    }());
    if (false) {
        /**
         * authorities to check
         * @type {?}
         */
        HasAnyAuthorityOnTerritoryDirective.prototype.authorities;
        /**
         * territory to check authorities
         * @type {?}
         */
        HasAnyAuthorityOnTerritoryDirective.prototype.territory;
        /**
         * @type {?}
         * @private
         */
        HasAnyAuthorityOnTerritoryDirective.prototype.principal;
        /**
         * @type {?}
         * @private
         */
        HasAnyAuthorityOnTerritoryDirective.prototype.templateRef;
        /**
         * @type {?}
         * @private
         */
        HasAnyAuthorityOnTerritoryDirective.prototype.viewContainerRef;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
                        provide: http.HTTP_INTERCEPTORS,
                        useClass: AuthInterceptor,
                        multi: true
                    },
                    {
                        provide: http.HTTP_INTERCEPTORS,
                        useClass: AuthExpiredInterceptor,
                        multi: true
                    }
                ]
            };
        };
        SitmunFrontendCoreModule.decorators = [
            { type: core.NgModule, args: [{
                        imports: [
                            /*RouterModule,
                            HttpClientModule,
                            CommonModule,
                            AngularHalModule,*/
                            core$1.TranslateModule.forRoot({
                                loader: {
                                    provide: core$1.TranslateLoader,
                                    useFactory: ɵ0,
                                    deps: [http.HttpClient]
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
                            core$1.TranslateModule
                        ]
                    },] }
        ];
        return SitmunFrontendCoreModule;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
                    http.HttpClient,
                    {
                        provide: ResourceService,
                        useClass: ResourceService,
                        deps: [ExternalService]
                    }
                ]
            };
        };
        AngularHalModule.decorators = [
            { type: core.NgModule, args: [{
                        imports: [http.HttpClientModule],
                        declarations: [],
                        exports: [http.HttpClientModule],
                        providers: [
                            ExternalService,
                            http.HttpClient,
                            {
                                provide: ResourceService,
                                useClass: ResourceService,
                                deps: [ExternalService]
                            }
                        ]
                    },] }
        ];
        return AngularHalModule;
    }());

    exports.AccountService = AccountService;
    exports.AngularHalModule = AngularHalModule;
    exports.Application = Application;
    exports.ApplicationBackground = ApplicationBackground;
    exports.ApplicationBackgroundService = ApplicationBackgroundService;
    exports.ApplicationParameter = ApplicationParameter;
    exports.ApplicationParameterService = ApplicationParameterService;
    exports.ApplicationService = ApplicationService;
    exports.AuthExpiredInterceptor = AuthExpiredInterceptor;
    exports.AuthInterceptor = AuthInterceptor;
    exports.AuthService = AuthService;
    exports.Background = Background;
    exports.BackgroundService = BackgroundService;
    exports.Capabilitie = Capabilitie;
    exports.CapabilitiesService = CapabilitiesService;
    exports.Cartography = Cartography;
    exports.CartographyAvailability = CartographyAvailability;
    exports.CartographyAvailabilityService = CartographyAvailabilityService;
    exports.CartographyFilter = CartographyFilter;
    exports.CartographyFilterService = CartographyFilterService;
    exports.CartographyGroup = CartographyGroup;
    exports.CartographyGroupService = CartographyGroupService;
    exports.CartographyParameter = CartographyParameter;
    exports.CartographyParameterService = CartographyParameterService;
    exports.CartographyService = CartographyService;
    exports.CartographySpatialSelectionParameterService = CartographySpatialSelectionParameterService;
    exports.CartographyStyle = CartographyStyle;
    exports.CartographyStyleService = CartographyStyleService;
    exports.CodeList = CodeList;
    exports.CodeListService = CodeListService;
    exports.ConfigurationParameter = ConfigurationParameter;
    exports.ConfigurationParametersService = ConfigurationParametersService;
    exports.Connection = Connection;
    exports.ConnectionService = ConnectionService;
    exports.DashboardService = DashboardService;
    exports.ExternalService = ExternalService;
    exports.GEOADMIN_TREE_TASK_ID = GEOADMIN_TREE_TASK_ID;
    exports.GetInfoService = GetInfoService;
    exports.Info = Info;
    exports.Language = Language;
    exports.LanguageService = LanguageService;
    exports.Layer = Layer;
    exports.LayerConfiguration = LayerConfiguration;
    exports.LayerGroup = LayerGroup;
    exports.LoginService = LoginService;
    exports.MapComponentStatus = MapComponentStatus;
    exports.MapConfigurationManagerService = MapConfigurationManagerService;
    exports.MapOptionsConfiguration = MapOptionsConfiguration;
    exports.OptionalParameter = OptionalParameter;
    exports.Principal = Principal;
    exports.Resource = Resource;
    exports.ResourceArray = ResourceArray;
    exports.ResourceHelper = ResourceHelper;
    exports.ResourceService = ResourceService;
    exports.RestService = RestService;
    exports.Role = Role;
    exports.RoleService = RoleService;
    exports.Service = Service;
    exports.ServiceParameter = ServiceParameter;
    exports.ServiceParameterService = ServiceParameterService;
    exports.ServiceService = ServiceService;
    exports.SitmunFrontendCoreModule = SitmunFrontendCoreModule;
    exports.TERRITORIAL_APP_NAME = TERRITORIAL_APP_NAME;
    exports.Task = Task;
    exports.TaskAvailability = TaskAvailability;
    exports.TaskAvailabilityService = TaskAvailabilityService;
    exports.TaskGroup = TaskGroup;
    exports.TaskGroupService = TaskGroupService;
    exports.TaskParameter = TaskParameter;
    exports.TaskParameterService = TaskParameterService;
    exports.TaskService = TaskService;
    exports.TaskType = TaskType;
    exports.TaskTypeService = TaskTypeService;
    exports.TaskUI = TaskUI;
    exports.TaskUIService = TaskUIService;
    exports.Territory = Territory;
    exports.TerritoryGroupType = TerritoryGroupType;
    exports.TerritoryGroupTypeService = TerritoryGroupTypeService;
    exports.TerritoryService = TerritoryService;
    exports.TerritoryType = TerritoryType;
    exports.TerritoryTypeService = TerritoryTypeService;
    exports.Translation = Translation;
    exports.TranslationService = TranslationService;
    exports.Tree = Tree;
    exports.TreeNode = TreeNode;
    exports.TreeNodeService = TreeNodeService;
    exports.TreeService = TreeService;
    exports.User = User;
    exports.UserConfiguration = UserConfiguration;
    exports.UserConfigurationService = UserConfigurationService;
    exports.UserPosition = UserPosition;
    exports.UserPositionService = UserPositionService;
    exports.UserService = UserService;
    exports.createTranslateLoader = createTranslateLoader;
    exports.ɵa = HasAnyAuthorityDirective;
    exports.ɵb = HasAnyAuthorityOnTerritoryDirective;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=sitmun-frontend-core.umd.js.map
