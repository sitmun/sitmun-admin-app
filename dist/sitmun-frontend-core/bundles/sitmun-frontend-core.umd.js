(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('rxjs'), require('rxjs/operators'), require('@angular/common/http'), require('url'), require('util'), require('@angular/core'), require('rxjs-compat'), require('@angular/router'), require('@ngx-translate/http-loader'), require('@ngx-translate/core')) :
    typeof define === 'function' && define.amd ? define('@sitmun/frontend-core', ['exports', 'rxjs', 'rxjs/operators', '@angular/common/http', 'url', 'util', '@angular/core', 'rxjs-compat', '@angular/router', '@ngx-translate/http-loader', '@ngx-translate/core'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global.sitmun = global.sitmun || {}, global.sitmun['frontend-core'] = {}), global.rxjs, global.rxjs.operators, global.ng.common.http, global.url, global.util, global.ng.core, global.rxjsCompat, global.ng.router, global.httpLoader, global.i1$2));
}(this, (function (exports, rxjs, operators, i1, url, util, i0, rxjsCompat, i1$1, httpLoader, i1$2) { 'use strict';

    /******************************************************************************
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
    /* global Reflect, Promise, SuppressedError, Symbol */
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b)
                if (Object.prototype.hasOwnProperty.call(b, p))
                    d[p] = b[p]; };
        return extendStatics(d, b);
    };
    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    var __assign = function () {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s)
                    if (Object.prototype.hasOwnProperty.call(s, p))
                        t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    function __rest(s, e) {
        var t = {};
        for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
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
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if (d = decorators[i])
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }
    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); };
    }
    function __esDecorate(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
        function accept(f) { if (f !== void 0 && typeof f !== "function")
            throw new TypeError("Function expected"); return f; }
        var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
        var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
        var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
        var _, done = false;
        for (var i = decorators.length - 1; i >= 0; i--) {
            var context = {};
            for (var p in contextIn)
                context[p] = p === "access" ? {} : contextIn[p];
            for (var p in contextIn.access)
                context.access[p] = contextIn.access[p];
            context.addInitializer = function (f) { if (done)
                throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
            var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
            if (kind === "accessor") {
                if (result === void 0)
                    continue;
                if (result === null || typeof result !== "object")
                    throw new TypeError("Object expected");
                if (_ = accept(result.get))
                    descriptor.get = _;
                if (_ = accept(result.set))
                    descriptor.set = _;
                if (_ = accept(result.init))
                    initializers.unshift(_);
            }
            else if (_ = accept(result)) {
                if (kind === "field")
                    initializers.unshift(_);
                else
                    descriptor[key] = _;
            }
        }
        if (target)
            Object.defineProperty(target, contextIn.name, descriptor);
        done = true;
    }
    ;
    function __runInitializers(thisArg, initializers, value) {
        var useValue = arguments.length > 2;
        for (var i = 0; i < initializers.length; i++) {
            value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
        }
        return useValue ? value : void 0;
    }
    ;
    function __propKey(x) {
        return typeof x === "symbol" ? x : "".concat(x);
    }
    ;
    function __setFunctionName(f, name, prefix) {
        if (typeof name === "symbol")
            name = name.description ? "[".concat(name.description, "]") : "";
        return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
    }
    ;
    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
            return Reflect.metadata(metadataKey, metadataValue);
    }
    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try {
                step(generator.next(value));
            }
            catch (e) {
                reject(e);
            } }
            function rejected(value) { try {
                step(generator["throw"](value));
            }
            catch (e) {
                reject(e);
            } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }
    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function () { if (t[0] & 1)
                throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f)
                throw new TypeError("Generator is already executing.");
            while (g && (g = 0, op[0] && (_ = 0)), _)
                try {
                    if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
                        return t;
                    if (y = 0, t)
                        op = [op[0] & 2, t.value];
                    switch (op[0]) {
                        case 0:
                        case 1:
                            t = op;
                            break;
                        case 4:
                            _.label++;
                            return { value: op[1], done: false };
                        case 5:
                            _.label++;
                            y = op[1];
                            op = [0];
                            continue;
                        case 7:
                            op = _.ops.pop();
                            _.trys.pop();
                            continue;
                        default:
                            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                                _ = 0;
                                continue;
                            }
                            if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                                _.label = op[1];
                                break;
                            }
                            if (op[0] === 6 && _.label < t[1]) {
                                _.label = t[1];
                                t = op;
                                break;
                            }
                            if (t && _.label < t[2]) {
                                _.label = t[2];
                                _.ops.push(op);
                                break;
                            }
                            if (t[2])
                                _.ops.pop();
                            _.trys.pop();
                            continue;
                    }
                    op = body.call(thisArg, _);
                }
                catch (e) {
                    op = [6, e];
                    y = 0;
                }
                finally {
                    f = t = 0;
                }
            if (op[0] & 5)
                throw op[1];
            return { value: op[0] ? op[1] : void 0, done: true };
        }
    }
    var __createBinding = Object.create ? (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
            desc = { enumerable: true, get: function () { return m[k]; } };
        }
        Object.defineProperty(o, k2, desc);
    }) : (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        o[k2] = m[k];
    });
    function __exportStar(m, o) {
        for (var p in m)
            if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p))
                __createBinding(o, m, p);
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
    /** @deprecated */
    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }
    /** @deprecated */
    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++)
            s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    }
    function __spreadArray(to, from, pack) {
        if (pack || arguments.length === 2)
            for (var i = 0, l = from.length, ar; i < l; i++) {
                if (ar || !(i in from)) {
                    if (!ar)
                        ar = Array.prototype.slice.call(from, 0, i);
                    ar[i] = from[i];
                }
            }
        return to.concat(ar || Array.prototype.slice.call(from));
    }
    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }
    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function () { return this; }, i;
        function awaitReturn(f) { return function (v) { return Promise.resolve(v).then(f, reject); }; }
        function verb(n, f) { if (g[n]) {
            i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); };
            if (f)
                i[n] = f(i[n]);
        } }
        function resume(n, v) { try {
            step(g[n](v));
        }
        catch (e) {
            settle(q[0][3], e);
        } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length)
            resume(q[0][0], q[0][1]); }
    }
    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: false } : f ? f(v) : v; } : f; }
    }
    function __asyncValues(o) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function (v) { resolve({ value: v, done: d }); }, reject); }
    }
    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
        }
        else {
            cooked.raw = raw;
        }
        return cooked;
    }
    ;
    var __setModuleDefault = Object.create ? (function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function (o, v) {
        o["default"] = v;
    };
    function __importStar(mod) {
        if (mod && mod.__esModule)
            return mod;
        var result = {};
        if (mod != null)
            for (var k in mod)
                if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
                    __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    }
    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }
    function __classPrivateFieldGet(receiver, state, kind, f) {
        if (kind === "a" && !f)
            throw new TypeError("Private accessor was defined without a getter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
            throw new TypeError("Cannot read private member from an object whose class did not declare it");
        return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    }
    function __classPrivateFieldSet(receiver, state, value, kind, f) {
        if (kind === "m")
            throw new TypeError("Private method is not writable");
        if (kind === "a" && !f)
            throw new TypeError("Private accessor was defined without a setter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
            throw new TypeError("Cannot write private member to an object whose class did not declare it");
        return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
    }
    function __classPrivateFieldIn(state, receiver) {
        if (receiver === null || (typeof receiver !== "object" && typeof receiver !== "function"))
            throw new TypeError("Cannot use 'in' operator on non-object");
        return typeof state === "function" ? receiver === state : state.has(receiver);
    }
    function __addDisposableResource(env, value, async) {
        if (value !== null && value !== void 0) {
            if (typeof value !== "object" && typeof value !== "function")
                throw new TypeError("Object expected.");
            var dispose, inner;
            if (async) {
                if (!Symbol.asyncDispose)
                    throw new TypeError("Symbol.asyncDispose is not defined.");
                dispose = value[Symbol.asyncDispose];
            }
            if (dispose === void 0) {
                if (!Symbol.dispose)
                    throw new TypeError("Symbol.dispose is not defined.");
                dispose = value[Symbol.dispose];
                if (async)
                    inner = dispose;
            }
            if (typeof dispose !== "function")
                throw new TypeError("Object not disposable.");
            if (inner)
                dispose = function () { try {
                    inner.call(this);
                }
                catch (e) {
                    return Promise.reject(e);
                } };
            env.stack.push({ value: value, dispose: dispose, async: async });
        }
        else if (async) {
            env.stack.push({ async: true });
        }
        return value;
    }
    var _SuppressedError = typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
        var e = new Error(message);
        return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
    };
    function __disposeResources(env) {
        function fail(e) {
            env.error = env.hasError ? new _SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
            env.hasError = true;
        }
        function next() {
            while (env.stack.length) {
                var rec = env.stack.pop();
                try {
                    var result = rec.dispose && rec.dispose.call(rec.value);
                    if (rec.async)
                        return Promise.resolve(result).then(next, function (e) { fail(e); return next(); });
                }
                catch (e) {
                    fail(e);
                }
            }
            if (env.hasError)
                throw env.error;
        }
        return next();
    }
    var tslib_es6 = {
        __extends: __extends,
        __assign: __assign,
        __rest: __rest,
        __decorate: __decorate,
        __param: __param,
        __metadata: __metadata,
        __awaiter: __awaiter,
        __generator: __generator,
        __createBinding: __createBinding,
        __exportStar: __exportStar,
        __values: __values,
        __read: __read,
        __spread: __spread,
        __spreadArrays: __spreadArrays,
        __spreadArray: __spreadArray,
        __await: __await,
        __asyncGenerator: __asyncGenerator,
        __asyncDelegator: __asyncDelegator,
        __asyncValues: __asyncValues,
        __makeTemplateObject: __makeTemplateObject,
        __importStar: __importStar,
        __importDefault: __importDefault,
        __classPrivateFieldGet: __classPrivateFieldGet,
        __classPrivateFieldSet: __classPrivateFieldSet,
        __classPrivateFieldIn: __classPrivateFieldIn,
        __addDisposableResource: __addDisposableResource,
        __disposeResources: __disposeResources,
    };

    /** REST array of resource implementation */
    var ResourceArray = /** @class */ (function () {
        function ResourceArray() {
            var _this = this;
            /** total number of elements in this array */
            this.totalElements = 0;
            /** total number of pages in the response */
            this.totalPages = 1;
            /** page number in the response */
            this.pageNumber = 1;
            /** array components */
            this.result = [];
            /** push a new resource to the array */
            this.push = function (el) {
                _this.result.push(el);
            };
            /** length of the array */
            this.length = function () {
                return _this.result.length;
            };
            /** load array data from REST request */
            this.init = function (type, response, sortInfo) {
                var result = ResourceHelper.createEmptyResult(_this._embedded);
                result.sortInfo = sortInfo;
                ResourceHelper.instantiateResourceCollection(type, response, result);
                return result;
            };
            /** Load next page */
            this.next = function (type) {
                if (_this.next_uri) {
                    return ResourceHelper.getHttp().get(ResourceHelper.getProxy(_this.next_uri), { headers: ResourceHelper.headers }).pipe(operators.map(function (response) { return _this.init(type, response, _this.sortInfo); }), operators.catchError(function (error) { return rxjs.throwError(error); }));
                }
                return rxjs.throwError('no next defined');
            };
            /** Load previous page */
            this.prev = function (type) {
                if (_this.prev_uri) {
                    return ResourceHelper.getHttp().get(ResourceHelper.getProxy(_this.prev_uri), { headers: ResourceHelper.headers }).pipe(operators.map(function (response) { return _this.init(type, response, _this.sortInfo); }), operators.catchError(function (error) { return rxjs.throwError(error); }));
                }
                return rxjs.throwError('no prev defined');
            };
            /** Load first page */
            this.first = function (type) {
                if (_this.first_uri) {
                    return ResourceHelper.getHttp().get(ResourceHelper.getProxy(_this.first_uri), { headers: ResourceHelper.headers }).pipe(operators.map(function (response) { return _this.init(type, response, _this.sortInfo); }), operators.catchError(function (error) { return rxjs.throwError(error); }));
                }
                return rxjs.throwError('no first defined');
            };
            /** Load last page */
            this.last = function (type) {
                if (_this.last_uri) {
                    return ResourceHelper.getHttp().get(ResourceHelper.getProxy(_this.last_uri), { headers: ResourceHelper.headers }).pipe(operators.map(function (response) { return _this.init(type, response, _this.sortInfo); }), operators.catchError(function (error) { return rxjs.throwError(error); }));
                }
                return rxjs.throwError('no last defined');
            };
            /** Load page with given pageNumber*/
            this.page = function (type, pageNumber) {
                _this.self_uri = _this.self_uri.replace('{?page,size,sort}', '');
                _this.self_uri = _this.self_uri.replace('{&sort}', '');
                var urlParsed = url.parse(ResourceHelper.getProxy(_this.self_uri));
                var query = ResourceArray.replaceOrAdd(urlParsed.query, 'size', _this.pageSize.toString());
                query = ResourceArray.replaceOrAdd(query, 'page', pageNumber.toString());
                var uri = urlParsed.query ?
                    ResourceHelper.getProxy(_this.self_uri).replace(urlParsed.query, query) : ResourceHelper.getProxy(_this.self_uri).concat(query);
                uri = _this.addSortInfo(uri);
                return ResourceHelper.getHttp().get(uri, { headers: ResourceHelper.headers }).pipe(operators.map(function (response) { return _this.init(type, response, _this.sortInfo); }), operators.catchError(function (error) { return rxjs.throwError(error); }));
            };
            /** Sort collection based on given sort attribute */
            this.sortElements = function (type) {
                var sort = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    sort[_i - 1] = arguments[_i];
                }
                _this.self_uri = _this.self_uri.replace('{?page,size,sort}', '');
                _this.self_uri = _this.self_uri.replace('{&sort}', '');
                var uri = ResourceHelper.getProxy(_this.self_uri).concat('?', 'size=', _this.pageSize.toString(), '&page=', _this.pageNumber.toString());
                uri = _this.addSortInfo(uri);
                return ResourceHelper.getHttp().get(uri, { headers: ResourceHelper.headers }).pipe(operators.map(function (response) { return _this.init(type, response, sort); }), operators.catchError(function (error) { return rxjs.throwError(error); }));
            };
            /** Load page with given size */
            this.size = function (type, size) {
                var uri = ResourceHelper.getProxy(_this.self_uri).concat('?', 'size=', size.toString());
                uri = _this.addSortInfo(uri);
                return ResourceHelper.getHttp().get(uri, { headers: ResourceHelper.headers }).pipe(operators.map(function (response) { return _this.init(type, response, _this.sortInfo); }), operators.catchError(function (error) { return rxjs.throwError(error); }));
            };
        }
        /** Add sort info to given URI */
        ResourceArray.prototype.addSortInfo = function (uri) {
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
        ResourceArray.replaceOrAdd = function (query, field, value) {
            if (query) {
                var idx = query.indexOf(field);
                var idxNextAmp = query.indexOf('&', idx) == -1 ? query.indexOf('/', idx) : query.indexOf('&', idx);
                if (idx != -1) {
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

    /** REST API access helper */
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
        ResourceHelper.optionParams = function (params, options) {
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
        ResourceHelper.resolveRelations = function (resource) {
            var _this = this;
            var result = {};
            var _loop_1 = function (key) {
                if (!util.isNullOrUndefined(resource[key])) {
                    if (ResourceHelper.className(resource[key])
                        .find(function (className) { return className == 'Resource'; })) {
                        if (resource[key]['_links'])
                            result[key] = resource[key]['_links']['self']['href'];
                    }
                    else if (Array.isArray(resource[key])) {
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
            return result;
        };
        /** create an empty resource from embedded data*/
        ResourceHelper.createEmptyResult = function (_embedded) {
            var resourceArray = new ResourceArray();
            resourceArray._embedded = _embedded;
            return resourceArray;
        };
        /** get resource class name*/
        ResourceHelper.getClassName = function (obj) {
            var funcNameRegex = /function (.+?)\(/;
            var results = (funcNameRegex).exec(obj.constructor.toString());
            return (results && results.length > 1) ? results[1] : '';
        };
        /** get resource class name from a prototype object*/
        ResourceHelper.className = function (objProto) {
            var classNames = [];
            var obj = Object.getPrototypeOf(objProto);
            var className;
            while ((className = ResourceHelper.getClassName(obj)) !== 'Object') {
                classNames.push(className);
                obj = Object.getPrototypeOf(obj);
            }
            return classNames;
        };
        /** instantiate a ResourceCollection from response embedded data*/
        ResourceHelper.instantiateResourceCollection = function (type, payload, result, builder, embeddedName) {
            var e_3, _a, e_4, _b;
            try {
                for (var _c = __values(Object.keys(payload[result._embedded])), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var embeddedClassName = _d.value;
                    if (!embeddedName || (embeddedName && embeddedClassName == embeddedName)) {
                        var embedded = payload[result._embedded];
                        var items = embedded[embeddedClassName];
                        try {
                            for (var items_1 = (e_4 = void 0, __values(items)), items_1_1 = items_1.next(); !items_1_1.done; items_1_1 = items_1.next()) {
                                var item = items_1_1.value;
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
        ResourceHelper.searchSubtypes = function (builder, embeddedClassName, instance) {
            if (builder && builder.subtypes) {
                var keys = builder.subtypes.keys();
                Array.from(keys).forEach(function (subtypeKey) {
                    if (embeddedClassName.toLowerCase().startsWith(subtypeKey.toLowerCase())) {
                        var subtype = builder.subtypes.get(subtypeKey);
                        instance = new subtype();
                    }
                });
            }
            return instance;
        };
        /** instantiate a Resource from response */
        ResourceHelper.instantiateResource = function (entity, payload) {
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
        ResourceHelper.setProxyUri = function (proxy_uri) {
            ResourceHelper.proxy_uri = proxy_uri;
        };
        /** set Root URI */
        ResourceHelper.setRootUri = function (root_uri) {
            ResourceHelper.root_uri = root_uri;
        };
        /** get proxy URL */
        ResourceHelper.getURL = function () {
            return ResourceHelper.proxy_uri && ResourceHelper.proxy_uri != '' ?
                ResourceHelper.addSlash(ResourceHelper.proxy_uri) :
                ResourceHelper.addSlash(ResourceHelper.root_uri);
        };
        /** add slash to URI */
        ResourceHelper.addSlash = function (uri) {
            var uriParsed = url.parse(uri);
            if (util.isNullOrUndefined(uriParsed.search) && uri && uri[uri.length - 1] != '/')
                return uri + '/';
            return uri;
        };
        /** get proxy from URL */
        ResourceHelper.getProxy = function (url) {
            if (!ResourceHelper.proxy_uri || ResourceHelper.proxy_uri == '')
                return url;
            return ResourceHelper.addSlash(url.replace(ResourceHelper.root_uri, ResourceHelper.proxy_uri));
        };
        /** set HttpClient*/
        ResourceHelper.setHttp = function (http) {
            ResourceHelper.http = http;
        };
        /** get HttpClient*/
        ResourceHelper.getHttp = function () {
            return ResourceHelper.http;
        };
        /** get root URI*/
        ResourceHelper.getRootUri = function () {
            return ResourceHelper.root_uri;
        };
        return ResourceHelper;
    }());
    /** HttpHeaders */
    ResourceHelper.headers = new i1.HttpHeaders();
    /** Proxy URL */
    ResourceHelper.proxy_uri = null;
    /** Root URL */
    ResourceHelper.root_uri = null;
    /** HttpClient */
    ResourceHelper.http = null;

    /** Abstract resource class*/
    var Resource = /** @class */ (function () {
        /** constructor*/
        function Resource() {
        }
        Object.defineProperty(Resource.prototype, "subtypes", {
            /** get subtypes */
            get: function () {
                return this._subtypes;
            },
            /** set subtypes */
            set: function (_subtypes) {
                this._subtypes = _subtypes;
            },
            enumerable: false,
            configurable: true
        });
        /** Get collection of related resources */
        Resource.prototype.getRelationArray = function (type, relation, _embedded, options, builder) {
            var params = ResourceHelper.optionParams(new i1.HttpParams(), options);
            var result = ResourceHelper.createEmptyResult(util.isNullOrUndefined(_embedded) ? "_embedded" : _embedded);
            if (!util.isNullOrUndefined(this._links) && !util.isNullOrUndefined(this._links[relation])) {
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
        /** Get related resource */
        Resource.prototype.getRelation = function (type, relation, builder) {
            var result = new type();
            if (!util.isNullOrUndefined(this._links) && !util.isNullOrUndefined(this._links[relation])) {
                var observable = ResourceHelper.getHttp().get(ResourceHelper.getProxy(this._links[relation].href), { headers: ResourceHelper.headers });
                return observable.pipe(operators.map(function (data) {
                    var e_1, _a;
                    if (builder) {
                        try {
                            for (var _b = __values(Object.keys(data['_links'])), _c = _b.next(); !_c.done; _c = _b.next()) {
                                var embeddedClassName = _c.value;
                                if (embeddedClassName == 'self') {
                                    var href = data._links[embeddedClassName].href;
                                    var idx = href.lastIndexOf('/');
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
                }));
            }
            else {
                return rxjs.of(null);
            }
        };
        /** Adds the given resource to the bound collection by the relation */
        Resource.prototype.addRelation = function (relation, resource) {
            if (!util.isNullOrUndefined(this._links) && !util.isNullOrUndefined(this._links[relation])) {
                var header = ResourceHelper.headers.append('Content-Type', 'text/uri-list');
                return ResourceHelper.getHttp().post(ResourceHelper.getProxy(this._links[relation].href), resource._links.self.href, { headers: header });
            }
            else {
                return rxjs.throwError('no relation found');
            }
        };
        /** Bind the given resource to this resource by the given relation*/
        Resource.prototype.updateRelation = function (relation, resource) {
            if (!util.isNullOrUndefined(this._links) && !util.isNullOrUndefined(this._links[relation])) {
                var header = ResourceHelper.headers.append('Content-Type', 'text/uri-list');
                return ResourceHelper.getHttp().patch(ResourceHelper.getProxy(this._links[relation].href), resource._links.self.href, { headers: header });
            }
            else {
                return rxjs.throwError('no relation found');
            }
        };
        /** Bind the given resource to this resource by the given relation*/
        Resource.prototype.substituteRelation = function (relation, resource) {
            if (!util.isNullOrUndefined(this._links) && !util.isNullOrUndefined(this._links[relation])) {
                var header = ResourceHelper.headers.append('Content-Type', 'text/uri-list');
                return ResourceHelper.getHttp().put(ResourceHelper.getProxy(this._links[relation].href), resource._links.self.href, { headers: header });
            }
            else {
                return rxjs.throwError('no relation found');
            }
        };
        /** Bind the given resource to this resource by the given relation*/
        Resource.prototype.substituteAllRelation = function (relation, resources) {
            if (!util.isNullOrUndefined(this._links) && !util.isNullOrUndefined(this._links[relation])) {
                var header = ResourceHelper.headers.append('Content-Type', 'text/uri-list');
                return ResourceHelper.getHttp().put(ResourceHelper.getProxy(this._links[relation].href), resources.map(function (resource) { return resource._links.self.href; }), { headers: header });
            }
            else {
                return rxjs.throwError('no relation found');
            }
        };
        /** Unbind the resource with the given relation from this resource*/
        Resource.prototype.deleteRelation = function (relation, resource) {
            if (!util.isNullOrUndefined(this._links) && !util.isNullOrUndefined(resource._links)) {
                var link = resource._links['self'].href;
                var idx = link.lastIndexOf('/') + 1;
                if (idx == -1)
                    return rxjs.throwError('no relation found');
                var relationId = link.substring(idx);
                return ResourceHelper.getHttp().delete(ResourceHelper.getProxy(this._links[relation].href + '/' + relationId), { headers: ResourceHelper.headers });
            }
            else {
                return rxjs.throwError('no relation found');
            }
        };
        /** Unbind the resource with the given relation from this resource*/
        Resource.prototype.deleteAllRelation = function (relation) {
            return ResourceHelper.getHttp().delete(ResourceHelper.getProxy(this._links[relation].href), { headers: ResourceHelper.headers });
        };
        return Resource;
    }());
    Resource.ɵfac = function Resource_Factory(t) { return new (t || Resource)(); };
    Resource.ɵprov = i0.ɵɵdefineInjectable({ token: Resource, factory: Resource.ɵfac });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(Resource, [{
                type: i0.Injectable
            }], function () { return []; }, null);
    })();

    /**
     * User model
     */
    var User = /** @class */ (function (_super) {
        __extends(User, _super);
        function User() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return User;
    }(Resource));

    /** ExternalService */
    var ExternalService = /** @class */ (function () {
        /** constructor */
        function ExternalService(externalConfigurationService) {
            this.externalConfigurationService = externalConfigurationService;
            ResourceHelper.setProxyUri(externalConfigurationService.getProxyUri());
            ResourceHelper.setRootUri(externalConfigurationService.getRootUri());
            ResourceHelper.setHttp(externalConfigurationService.getHttp());
        }
        /** update ExternalConfigurationHandler */
        ExternalService.prototype.updateExternalConfigurationHandlerInterface = function (externalConfigurationService) {
            this.externalConfigurationService = externalConfigurationService;
            ResourceHelper.setProxyUri(externalConfigurationService.getProxyUri());
            ResourceHelper.setRootUri(externalConfigurationService.getRootUri());
            ResourceHelper.setHttp(externalConfigurationService.getHttp());
        };
        /** get ExternalConfiguration */
        ExternalService.prototype.getExternalConfiguration = function () {
            return this.externalConfigurationService.getExternalConfiguration();
        };
        /** get proxy URL */
        ExternalService.prototype.getProxyUri = function () {
            return this.externalConfigurationService.getProxyUri();
        };
        /** get Root URI */
        ExternalService.prototype.getRootUri = function () {
            return this.externalConfigurationService.getRootUri();
        };
        /** get URL */
        ExternalService.prototype.getURL = function () {
            return ResourceHelper.getURL();
        };
        /** get HttpClient */
        ExternalService.prototype.getHttp = function () {
            return ResourceHelper.getHttp();
        };
        return ExternalService;
    }());
    ExternalService.ɵfac = function ExternalService_Factory(t) { return new (t || ExternalService)(i0.ɵɵinject('ExternalConfigurationService')); };
    ExternalService.ɵprov = i0.ɵɵdefineInjectable({ token: ExternalService, factory: ExternalService.ɵfac });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(ExternalService, [{
                type: i0.Injectable
            }], function () {
            return [{ type: undefined, decorators: [{
                            type: i0.Inject,
                            args: ['ExternalConfigurationService']
                        }] }];
        }, null);
    })();

    /** ResourceService */
    var ResourceService = /** @class */ (function () {
        /** constructor */
        function ResourceService(externalService) {
            this.externalService = externalService;
        }
        /** get URL */
        ResourceService.getURL = function () {
            return ResourceHelper.getURL();
        };
        /** get all resources from a base URI of a given type */
        ResourceService.prototype.getAll = function (type, resource, _embedded, options, subType, embeddedName, ignoreProjection) {
            var uri = this.getResourceUrl(resource);
            if (!ignoreProjection) {
                uri = uri.concat('?projection=view');
            }
            var params = ResourceHelper.optionParams(new i1.HttpParams(), options);
            var result = ResourceHelper.createEmptyResult(_embedded);
            this.setUrls(result);
            result.sortInfo = options ? options.sort : undefined;
            var observable = ResourceHelper.getHttp().get(uri, { headers: ResourceHelper.headers, params: params });
            return observable.pipe(operators.map(function (response) { return ResourceHelper.instantiateResourceCollection(type, response, result, subType, embeddedName); }), operators.catchError(function (error) { return rxjs.throwError(error); }));
        };
        /** get resource from a base URI and a given id */
        ResourceService.prototype.get = function (type, resource, id) {
            var uri = this.getResourceUrl(resource).concat('/', id, '?projection=view');
            var result = new type();
            this.setUrlsResource(result);
            var observable = ResourceHelper.getHttp().get(uri, { headers: ResourceHelper.headers });
            return observable.pipe(operators.map(function (data) { return ResourceHelper.instantiateResource(result, data); }), operators.catchError(function (error) { return rxjs.throwError(error); }));
        };
        /** get resource from its selflink */
        ResourceService.prototype.getBySelfLink = function (type, resourceLink) {
            var result = new type();
            this.setUrlsResource(result);
            var observable = ResourceHelper.getHttp().get(ResourceHelper.getProxy(resourceLink), { headers: ResourceHelper.headers });
            return observable.pipe(operators.map(function (data) { return ResourceHelper.instantiateResource(result, data); }), operators.catchError(function (error) { return rxjs.throwError(error); }));
        };
        /** search resources from a given base path, query and options */
        ResourceService.prototype.search = function (type, query, resource, _embedded, options) {
            var uri = this.getResourceUrl(resource).concat('/search/', query);
            var params = ResourceHelper.optionParams(new i1.HttpParams(), options);
            var result = ResourceHelper.createEmptyResult(_embedded);
            this.setUrls(result);
            var observable = ResourceHelper.getHttp().get(uri, { headers: ResourceHelper.headers, params: params });
            return observable.pipe(operators.map(function (response) { return ResourceHelper.instantiateResourceCollection(type, response, result); }), operators.catchError(function (error) { return rxjs.throwError(error); }));
        };
        /** search a single resource from a given base path, query and options */
        ResourceService.prototype.searchSingle = function (type, query, resource, options) {
            var uri = this.getResourceUrl(resource).concat('/search/', query);
            var params = ResourceHelper.optionParams(new i1.HttpParams(), options);
            var result = new type();
            this.setUrlsResource(result);
            var observable = ResourceHelper.getHttp().get(uri, { headers: ResourceHelper.headers, params: params });
            return observable.pipe(operators.map(function (response) { return ResourceHelper.instantiateResource(result, response); }), operators.catchError(function (error) { return rxjs.throwError(error); }));
        };
        /** search resources from a given base path, custom query and options */
        ResourceService.prototype.customQuery = function (type, query, resource, _embedded, options) {
            var uri = this.getResourceUrl(resource + query);
            var params = ResourceHelper.optionParams(new i1.HttpParams(), options);
            var result = ResourceHelper.createEmptyResult(_embedded);
            this.setUrls(result);
            var observable = ResourceHelper.getHttp().get(uri, { headers: ResourceHelper.headers, params: params });
            return observable.pipe(operators.map(function (response) { return ResourceHelper.instantiateResourceCollection(type, response, result); }), operators.catchError(function (error) { return rxjs.throwError(error); }));
        };
        /** get resource given a relation link */
        ResourceService.prototype.getByRelation = function (type, resourceLink) {
            var result = new type();
            this.setUrlsResource(result);
            var observable = ResourceHelper.getHttp().get(resourceLink, { headers: ResourceHelper.headers });
            return observable.pipe(operators.map(function (data) { return ResourceHelper.instantiateResource(result, data); }), operators.catchError(function (error) { return rxjs.throwError(error); }));
        };
        /** get resource array given a relation link */
        ResourceService.prototype.getByRelationArray = function (type, resourceLink, _embedded, builder) {
            var result = ResourceHelper.createEmptyResult(_embedded);
            this.setUrls(result);
            var observable = ResourceHelper.getHttp().get(resourceLink, { headers: ResourceHelper.headers });
            return observable.pipe(operators.map(function (response) { return ResourceHelper.instantiateResourceCollection(type, response, result, builder); }), operators.catchError(function (error) { return rxjs.throwError(error); }));
        };
        /** count resources given a path */
        ResourceService.prototype.count = function (resource) {
            var uri = this.getResourceUrl(resource).concat('/search/countAll');
            return ResourceHelper.getHttp().get(uri, { headers: ResourceHelper.headers, observe: 'body' }).pipe(operators.map(function (response) { return Number(response.body); }), operators.catchError(function (error) { return rxjs.throwError(error); }));
        };
        /** create resource from self link and entity data*/
        ResourceService.prototype.create = function (selfResource, entity) {
            var uri = ResourceHelper.getURL() + selfResource;
            var payload = ResourceHelper.resolveRelations(entity);
            this.setUrlsResource(entity);
            var observable = ResourceHelper.getHttp().post(uri, payload, { headers: ResourceHelper.headers, observe: 'response' });
            return observable.pipe(operators.map(function (response) {
                if (response.status >= 200 && response.status <= 207)
                    return ResourceHelper.instantiateResource(entity, response.body);
                else if (response.status == 500) {
                    var body = response.body;
                    return rxjs.throwError(body.error);
                }
            }), operators.catchError(function (error) { return rxjs.throwError(error); }));
        };
        /** update resource from a given entity data*/
        ResourceService.prototype.update = function (entity) {
            var uri = ResourceHelper.getProxy(entity._links.self.href);
            var payload = ResourceHelper.resolveRelations(entity);
            this.setUrlsResource(entity);
            var observable = ResourceHelper.getHttp().put(uri, payload, { headers: ResourceHelper.headers, observe: 'response' });
            return observable.pipe(operators.map(function (response) {
                if (response.status >= 200 && response.status <= 207)
                    return ResourceHelper.instantiateResource(entity, response.body);
                else if (response.status == 500) {
                    var body = response.body;
                    return rxjs.throwError(body.error);
                }
            }), operators.catchError(function (error) { return rxjs.throwError(error); }));
        };
        /** update resource from a given entity data*/
        ResourceService.prototype.updateCollection = function (resourceArray, resourceLink) {
            var uri = ResourceHelper.getProxy(resourceLink);
            //const payload = ResourceHelper.resolveRelations(entity);
            //this.setUrlsResource(entity);
            var headersReq = ResourceHelper.headers;
            headersReq.set("Content-Type", "text/uri-list");
            var observable = ResourceHelper.getHttp().put(uri, resourceArray, { headers: headersReq, observe: 'response' });
            return observable.pipe(operators.map(function (response) {
                if (response.status >= 200 && response.status <= 207)
                    return "";
                else if (response.status == 500) {
                    var body = response.body;
                    return rxjs.throwError(body.error);
                }
            }), operators.catchError(function (error) { return rxjs.throwError(error); }));
        };
        /** patch resource from a given entity data*/
        ResourceService.prototype.patch = function (entity) {
            var uri = ResourceHelper.getProxy(entity._links.self.href);
            var payload = ResourceHelper.resolveRelations(entity);
            this.setUrlsResource(entity);
            var observable = ResourceHelper.getHttp().patch(uri, payload, { headers: ResourceHelper.headers, observe: 'response' });
            return observable.pipe(operators.map(function (response) {
                if (response.status >= 200 && response.status <= 207)
                    return ResourceHelper.instantiateResource(entity, response.body);
                else if (response.status == 500) {
                    var body = response.body;
                    return rxjs.throwError(body.error);
                }
            }), operators.catchError(function (error) { return rxjs.throwError(error); }));
        };
        /** delete resource from a given entity data*/
        ResourceService.prototype.delete = function (entity) {
            var uri = ResourceHelper.getProxy(entity._links.self.href);
            return ResourceHelper.getHttp().delete(uri, { headers: ResourceHelper.headers }).pipe(operators.catchError(function (error) { return rxjs.throwError(error); }));
        };
        /** whether a resource array has next page of results*/
        ResourceService.prototype.hasNext = function (resourceArray) {
            return resourceArray.next_uri != undefined;
        };
        /** whether a resource array has previous page of results*/
        ResourceService.prototype.hasPrev = function (resourceArray) {
            return resourceArray.prev_uri != undefined;
        };
        /** whether a resource array has first page of results*/
        ResourceService.prototype.hasFirst = function (resourceArray) {
            return resourceArray.first_uri != undefined;
        };
        /** whether a resource array has last page of results*/
        ResourceService.prototype.hasLast = function (resourceArray) {
            return resourceArray.last_uri != undefined;
        };
        /** get resource array next page of results*/
        ResourceService.prototype.next = function (resourceArray, type) {
            return resourceArray.next(type);
        };
        /** get resource array previous page of results*/
        ResourceService.prototype.prev = function (resourceArray, type) {
            return resourceArray.prev(type);
        };
        /** get resource array first page of results*/
        ResourceService.prototype.first = function (resourceArray, type) {
            return resourceArray.first(type);
        };
        /** get resource array last page of results*/
        ResourceService.prototype.last = function (resourceArray, type) {
            return resourceArray.last(type);
        };
        /** get resource array page of results given a page number*/
        ResourceService.prototype.page = function (resourceArray, type, id) {
            return resourceArray.page(type, id);
        };
        /** sort resource array with a given sorting params */
        ResourceService.prototype.sortElements = function (resourceArray, type) {
            var sort = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                sort[_i - 2] = arguments[_i];
            }
            return resourceArray.sortElements.apply(resourceArray, __spread([type], sort));
        };
        /** get resource array size*/
        ResourceService.prototype.size = function (resourceArray, type, size) {
            return resourceArray.size(type, size);
        };
        /** get resource URL from a given path*/
        ResourceService.prototype.getResourceUrl = function (resource) {
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
        ResourceService.prototype.setUrls = function (result) {
            result.proxyUrl = this.externalService.getProxyUri();
            result.rootUrl = this.externalService.getRootUri();
        };
        /** set proxy and root urls of given resource */
        ResourceService.prototype.setUrlsResource = function (result) {
            result.proxyUrl = this.externalService.getProxyUri();
            result.rootUrl = this.externalService.getRootUri();
        };
        return ResourceService;
    }());
    ResourceService.ɵfac = function ResourceService_Factory(t) { return new (t || ResourceService)(i0.ɵɵinject(ExternalService)); };
    ResourceService.ɵprov = i0.ɵɵdefineInjectable({ token: ResourceService, factory: ResourceService.ɵfac });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(ResourceService, [{
                type: i0.Injectable
            }], function () { return [{ type: ExternalService }]; }, null);
    })();

    /** REST API access interface */
    var RestService = /** @class */ (function () {
        /** constructor */
        function RestService(type, resource, injector, _embedded) {
            this.injector = injector;
            /** _embedded field name */
            this._embedded = '_embedded';
            this.type = type;
            this.resource = resource;
            this.resourceService = injector.get(ResourceService);
            if (!util.isNullOrUndefined(_embedded))
                this._embedded = _embedded;
        }
        /** error handler */
        RestService.prototype.handleError = function (error) {
            return RestService.handleError(error);
        };
        /** error handler */
        RestService.handleError = function (error) {
            return rxjs.throwError(error);
        };
        /** get all resources with optional options an subType params */
        RestService.prototype.getAll = function (options, subType, embeddedName, ignoreProjection) {
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
        /** get resource from a given id */
        RestService.prototype.get = function (id) {
            return this.resourceService.get(this.type, this.resource, id);
        };
        /** get resource from self link */
        RestService.prototype.getBySelfLink = function (selfLink) {
            return this.resourceService.getBySelfLink(this.type, selfLink);
        };
        /** search resources from a given query string and optional options params */
        RestService.prototype.search = function (query, options) {
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
        /** search resource from a given query string and optional options params */
        RestService.prototype.searchSingle = function (query, options) {
            return this.resourceService.searchSingle(this.type, query, this.resource, options);
        };
        /** search resources from a given custom query string and optional options params */
        RestService.prototype.customQuery = function (query, options) {
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
        /** get resource array given a relation link */
        RestService.prototype.getByRelationArray = function (relation, builder) {
            var _this = this;
            return this.resourceService.getByRelationArray(this.type, relation, this._embedded, builder).pipe(operators.map(function (resourceArray) {
                _this.resourceArray = resourceArray;
                return resourceArray.result;
            }));
        };
        /** get resource given a relation link */
        RestService.prototype.getByRelation = function (relation) {
            return this.resourceService.getByRelation(this.type, relation);
        };
        /** count resources given a path */
        RestService.prototype.count = function () {
            return this.resourceService.count(this.resource);
        };
        /** create resource from self link and entity data*/
        RestService.prototype.create = function (entity) {
            return this.resourceService.create(this.resource, entity);
        };
        /** update resource from a given entity data*/
        RestService.prototype.update = function (entity) {
            return this.resourceService.update(entity);
        };
        /** patch resource from a given entity data*/
        RestService.prototype.patch = function (entity) {
            return this.resourceService.patch(entity);
        };
        /** delete resource from a given entity data*/
        RestService.prototype.delete = function (entity) {
            return this.resourceService.delete(entity);
        };
        /** get total number of elements of resource array */
        RestService.prototype.totalElement = function () {
            if (this.resourceArray && this.resourceArray.totalElements)
                return this.resourceArray.totalElements;
            return 0;
        };
        /** whether a resource array has first page of results*/
        RestService.prototype.hasFirst = function () {
            if (this.resourceArray)
                return this.resourceService.hasFirst(this.resourceArray);
            return false;
        };
        /** whether a resource array has next page of results*/
        RestService.prototype.hasNext = function () {
            if (this.resourceArray)
                return this.resourceService.hasNext(this.resourceArray);
            return false;
        };
        /** whether a resource array has previous page of results*/
        RestService.prototype.hasPrev = function () {
            if (this.resourceArray)
                return this.resourceService.hasPrev(this.resourceArray);
            return false;
        };
        /** whether a resource array has last page of results*/
        RestService.prototype.hasLast = function () {
            if (this.resourceArray)
                return this.resourceService.hasLast(this.resourceArray);
            return false;
        };
        /** get resource array next page of results*/
        RestService.prototype.next = function () {
            var _this = this;
            if (this.resourceArray)
                return this.resourceService.next(this.resourceArray, this.type).pipe(operators.map(function (resourceArray) {
                    _this.resourceArray = resourceArray;
                    return resourceArray.result;
                }));
            else
                rxjs.throwError('no resourceArray found');
        };
        /** get resource array previous page of results*/
        RestService.prototype.prev = function () {
            var _this = this;
            if (this.resourceArray)
                return this.resourceService.prev(this.resourceArray, this.type).pipe(operators.map(function (resourceArray) {
                    _this.resourceArray = resourceArray;
                    return resourceArray.result;
                }));
            else
                rxjs.throwError('no resourceArray found');
        };
        /** get resource array first page of results*/
        RestService.prototype.first = function () {
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
        /** get resource array last page of results*/
        RestService.prototype.last = function () {
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
        /** get resource array page of results given a page number*/
        RestService.prototype.page = function (pageNumber) {
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

    /** Account manager service */
    var AccountService = /** @class */ (function (_super) {
        __extends(AccountService, _super);
        /** constructor */
        function AccountService(injector, http) {
            var _this = _super.call(this, User, "account", injector) || this;
            _this.http = http;
            /** API resource path */
            _this.ACCOUNT_API = 'account';
            return _this;
        }
        /** get logged in user account*/
        AccountService.prototype.get = function () {
            var result;
            result = this.http.get(this.resourceService.getResourceUrl(this.ACCOUNT_API));
            return result;
        };
        /** save account*/
        AccountService.prototype.save = function (item) {
            var result;
            result = this.http.post(this.resourceService.getResourceUrl(this.ACCOUNT_API), item);
            return result;
        };
        /** change logged in user account*/
        AccountService.prototype.changePassword = function (item) {
            var result;
            result = this.http.post(this.resourceService.getResourceUrl(this.ACCOUNT_API + "/change-password"), item);
            return result;
        };
        return AccountService;
    }(RestService));
    AccountService.ɵfac = function AccountService_Factory(t) { return new (t || AccountService)(i0.ɵɵinject(i0.Injector), i0.ɵɵinject(i1.HttpClient)); };
    AccountService.ɵprov = i0.ɵɵdefineInjectable({ token: AccountService, factory: AccountService.ɵfac });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(AccountService, [{
                type: i0.Injectable
            }], function () { return [{ type: i0.Injector }, { type: i1.HttpClient }]; }, null);
    })();

    //import * as moment from 'moment';
    /** Authentication service*/
    var AuthService = /** @class */ (function () {
        /** constructor*/
        function AuthService(http, resourceService) {
            this.http = http;
            this.resourceService = resourceService;
            /** API resource path */
            this.AUTH_API = 'authenticate';
        }
        /** get current user jwt token from session storage*/
        AuthService.prototype.getToken = function () {
            return sessionStorage.getItem('authenticationToken');
        };
        /** login operation */
        AuthService.prototype.login = function (credentials) {
            var data = {
                username: credentials.username,
                password: credentials.password
            };
            return this.http.post(this.resourceService.getResourceUrl(this.AUTH_API), data, { observe: 'response' }).map(authenticateSuccess.bind(this));
            function authenticateSuccess(resp) {
                if (resp.ok) {
                    var jwt = resp.body.id_token;
                    this.storeAuthenticationToken(jwt);
                    //const expiresAt = moment().add( resp.headers.get('Token-Validity'),'milisecond');
                    //sessionStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
                    return jwt;
                }
            }
        };
        /** login operation with jwt token */
        AuthService.prototype.loginWithToken = function (jwt) {
            if (jwt) {
                this.storeAuthenticationToken(jwt);
                return Promise.resolve(jwt);
            }
            else {
                return Promise.reject('auth-jwt-service Promise reject'); // Put appropriate error message here
            }
        };
        /** store jwt token in session storage*/
        AuthService.prototype.storeAuthenticationToken = function (jwt) {
            sessionStorage.setItem('authenticationToken', jwt);
        };
        /** check whether current user is logged in*/
        AuthService.prototype.isLoggedIn = function () {
            //return moment().isBefore(this.getExpiration());
            return this.getToken();
        };
        /** check whether current user is logged out*/
        AuthService.prototype.isLoggedOut = function () {
            return !this.isLoggedIn();
        };
        /** logout operation */
        AuthService.prototype.logout = function () {
            return new rxjsCompat.Observable(function (observer) {
                //localStorage.removeItem('authenticationToken');
                sessionStorage.removeItem('authenticationToken');
                //sessionStorage.removeItem('expires_at');
                observer.complete();
            });
        };
        return AuthService;
    }());
    AuthService.ɵfac = function AuthService_Factory(t) { return new (t || AuthService)(i0.ɵɵinject(i1.HttpClient), i0.ɵɵinject(ResourceService)); };
    AuthService.ɵprov = i0.ɵɵdefineInjectable({ token: AuthService, factory: AuthService.ɵfac });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(AuthService, [{
                type: i0.Injectable
            }], function () { return [{ type: i1.HttpClient }, { type: ResourceService }]; }, null);
    })();

    /** Interceptor for authentication token in API requests */
    var AuthInterceptor = /** @class */ (function () {
        /** constructor*/
        function AuthInterceptor() {
        }
        /** request handler */
        AuthInterceptor.prototype.intercept = function (request, next) {
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

    /** Principal service*/
    var Principal = /** @class */ (function () {
        /** constructor */
        function Principal(account) {
            this.account = account;
            this.authenticated = false;
            this.authenticationState = new rxjs.Subject();
        }
        /** authenticate with given identity*/
        Principal.prototype.authenticate = function (identity) {
            this.userIdentity = identity;
            this.authenticated = identity !== null;
            this.authenticationState.next(this.userIdentity);
        };
        /** check whether current user has any of the given authorities */
        Principal.prototype.hasAnyAuthority = function (authorities) {
            return Promise.resolve(this.hasAnyAuthorityDirect(authorities));
        };
        /** check whether current user has any of the given authorities on the given territory */
        Principal.prototype.hasAnyAuthorityOnTerritory = function (authorities, territory) {
            return Promise.resolve(this.hasAnyAuthorityDirectOnTerritory(authorities, territory));
        };
        /** check whether current user has any of the given authorities without resolving promises*/
        Principal.prototype.hasAnyAuthorityDirect = function (authorities) {
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
        Principal.prototype.hasAnyAuthorityDirectOnTerritory = function (authorities, territory) {
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
        Principal.prototype.hasAuthority = function (authority) {
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
        Principal.prototype.hasAuthorityOnTerritory = function (authority, territory) {
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
        Principal.prototype.identity = function (force) {
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
        Principal.prototype.isAuthenticated = function () {
            return this.authenticated;
        };
        /** check whether current user identity is resolved */
        Principal.prototype.isIdentityResolved = function () {
            return this.userIdentity !== undefined;
        };
        /** get current user authentication state */
        Principal.prototype.getAuthenticationState = function () {
            return this.authenticationState.asObservable();
        };
        return Principal;
    }());
    Principal.ɵfac = function Principal_Factory(t) { return new (t || Principal)(i0.ɵɵinject(AccountService)); };
    Principal.ɵprov = i0.ɵɵdefineInjectable({ token: Principal, factory: Principal.ɵfac });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(Principal, [{
                type: i0.Injectable
            }], function () { return [{ type: AccountService }]; }, null);
    })();

    /** Interceptor for authentication expired response in API requests */
    var AuthExpiredInterceptor = /** @class */ (function () {
        /** constructor */
        function AuthExpiredInterceptor(router, authService, principal) {
            this.router = router;
            this.authService = authService;
            this.principal = principal;
        }
        /** request handler */
        AuthExpiredInterceptor.prototype.intercept = function (request, next) {
            var _this = this;
            return next.handle(request).do(function (event) { }, function (err) {
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
        return AuthExpiredInterceptor;
    }());
    AuthExpiredInterceptor.ɵfac = function AuthExpiredInterceptor_Factory(t) { return new (t || AuthExpiredInterceptor)(i0.ɵɵinject(i1$1.Router), i0.ɵɵinject(AuthService), i0.ɵɵinject(Principal)); };
    AuthExpiredInterceptor.ɵprov = i0.ɵɵdefineInjectable({ token: AuthExpiredInterceptor, factory: AuthExpiredInterceptor.ɵfac });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(AuthExpiredInterceptor, [{
                type: i0.Injectable
            }], function () { return [{ type: i1$1.Router }, { type: AuthService }, { type: Principal }]; }, null);
    })();

    /** Login service*/
    var LoginService = /** @class */ (function () {
        /** constructor */
        function LoginService(authServerProvider, principal) {
            this.authServerProvider = authServerProvider;
            this.principal = principal;
        }
        /**Login operation*/
        LoginService.prototype.login = function (credentials, callback) {
            var _this = this;
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
        LoginService.prototype.loginWithToken = function (jwt) {
            return this.authServerProvider.loginWithToken(jwt);
        };
        /** logout operation */
        LoginService.prototype.logout = function () {
            this.authServerProvider.logout().subscribe();
            this.principal.authenticate(null);
        };
        return LoginService;
    }());
    LoginService.ɵfac = function LoginService_Factory(t) { return new (t || LoginService)(i0.ɵɵinject(AuthService), i0.ɵɵinject(Principal)); };
    LoginService.ɵprov = i0.ɵɵdefineInjectable({ token: LoginService, factory: LoginService.ɵfac });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(LoginService, [{
                type: i0.Injectable
            }], function () { return [{ type: AuthService }, { type: Principal }]; }, null);
    })();

    var DashboardService = /** @class */ (function () {
        /** constructor */
        function DashboardService(http, resourceService) {
            this.http = http;
            this.resourceService = resourceService;
            /** API resource path */
            this.DASHBOARD_API = 'dashboard/info';
            this.DASHBOARD_EMBEDDED = 'dashboard';
        }
        /** get all kpi */
        DashboardService.prototype.getAll = function () {
            var _this = this;
            return this.http.get(this.resourceService.getResourceUrl(this.DASHBOARD_API)).map(function (response) { return response[_this.DASHBOARD_EMBEDDED]; });
        };
        return DashboardService;
    }());
    DashboardService.ɵfac = function DashboardService_Factory(t) { return new (t || DashboardService)(i0.ɵɵinject(i1.HttpClient), i0.ɵɵinject(ResourceService)); };
    DashboardService.ɵprov = i0.ɵɵdefineInjectable({ token: DashboardService, factory: DashboardService.ɵfac, providedIn: 'root' });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(DashboardService, [{
                type: i0.Injectable,
                args: [{
                        providedIn: 'root'
                    }]
            }], function () { return [{ type: i1.HttpClient }, { type: ResourceService }]; }, null);
    })();

    /** User manager service */
    var UserService = /** @class */ (function (_super) {
        __extends(UserService, _super);
        /** constructor */
        function UserService(injector, http) {
            var _this = _super.call(this, User, "users", injector) || this;
            _this.http = http;
            /** API resource path */
            _this.USER_API = 'users';
            return _this;
        }
        /** remove user*/
        UserService.prototype.remove = function (item) {
            return this.http.delete(item._links.self.href);
        };
        /** save user*/
        UserService.prototype.save = function (item) {
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
        UserService.prototype.changePassword = function (id, item) {
            var result;
            result = this.http.post(this.resourceService.getResourceUrl(this.USER_API + "/" + id + "/change-password"), item);
            return result;
        };
        return UserService;
    }(RestService));
    UserService.ɵfac = function UserService_Factory(t) { return new (t || UserService)(i0.ɵɵinject(i0.Injector), i0.ɵɵinject(i1.HttpClient)); };
    UserService.ɵprov = i0.ɵɵdefineInjectable({ token: UserService, factory: UserService.ɵfac });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(UserService, [{
                type: i0.Injectable
            }], function () { return [{ type: i0.Injector }, { type: i1.HttpClient }]; }, null);
    })();

    /**
     * User position model
     */
    var UserPosition = /** @class */ (function (_super) {
        __extends(UserPosition, _super);
        function UserPosition() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return UserPosition;
    }(Resource));

    /** User position manager service */
    var UserPositionService = /** @class */ (function (_super) {
        __extends(UserPositionService, _super);
        /** constructor */
        function UserPositionService(injector, http) {
            var _this = _super.call(this, UserPosition, "user-positions", injector) || this;
            _this.http = http;
            /** API resource path */
            _this.USER_POSITION_API = 'user-positions';
            return _this;
        }
        /** remove user position*/
        UserPositionService.prototype.remove = function (item) {
            return this.http.delete(item._links.self.href);
        };
        /** save user position*/
        UserPositionService.prototype.save = function (item) {
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
        return UserPositionService;
    }(RestService));
    UserPositionService.ɵfac = function UserPositionService_Factory(t) { return new (t || UserPositionService)(i0.ɵɵinject(i0.Injector), i0.ɵɵinject(i1.HttpClient)); };
    UserPositionService.ɵprov = i0.ɵɵdefineInjectable({ token: UserPositionService, factory: UserPositionService.ɵfac });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(UserPositionService, [{
                type: i0.Injectable
            }], function () { return [{ type: i0.Injector }, { type: i1.HttpClient }]; }, null);
    })();

    /**
     * User permission model
     */
    var UserConfiguration = /** @class */ (function (_super) {
        __extends(UserConfiguration, _super);
        function UserConfiguration() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return UserConfiguration;
    }(Resource));

    /** User configuration manager service */
    var UserConfigurationService = /** @class */ (function (_super) {
        __extends(UserConfigurationService, _super);
        /** constructor */
        function UserConfigurationService(injector, http) {
            var _this = _super.call(this, UserConfiguration, "user-configurations", injector) || this;
            _this.http = http;
            /** API resource path */
            _this.USER_CONFIGURATION_API = 'user-configurations';
            return _this;
        }
        /** remove user configuration*/
        UserConfigurationService.prototype.remove = function (item) {
            return this.http.delete(item._links.self.href);
        };
        /** save user configuration*/
        UserConfigurationService.prototype.save = function (item) {
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
        return UserConfigurationService;
    }(RestService));
    UserConfigurationService.ɵfac = function UserConfigurationService_Factory(t) { return new (t || UserConfigurationService)(i0.ɵɵinject(i0.Injector), i0.ɵɵinject(i1.HttpClient)); };
    UserConfigurationService.ɵprov = i0.ɵɵdefineInjectable({ token: UserConfigurationService, factory: UserConfigurationService.ɵfac });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(UserConfigurationService, [{
                type: i0.Injectable
            }], function () { return [{ type: i0.Injector }, { type: i1.HttpClient }]; }, null);
    })();

    /**
     * Territory model
     */
    var Territory = /** @class */ (function (_super) {
        __extends(Territory, _super);
        function Territory() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Territory;
    }(Resource));

    /** Territory manager service */
    var TerritoryService = /** @class */ (function (_super) {
        __extends(TerritoryService, _super);
        /** constructor */
        function TerritoryService(injector, http) {
            var _this = _super.call(this, Territory, "territories", injector) || this;
            _this.http = http;
            /** API resource path */
            _this.TERRITORY_API = 'territories';
            return _this;
        }
        /** remove territory*/
        TerritoryService.prototype.remove = function (item) {
            return this.http.delete(item._links.self.href);
        };
        /** save territory*/
        TerritoryService.prototype.save = function (item) {
            var result;
            var territoryGroupType = {};
            territoryGroupType._links = {};
            territoryGroupType._links.self = {};
            territoryGroupType._links.self.href = "";
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
        return TerritoryService;
    }(RestService));
    TerritoryService.ɵfac = function TerritoryService_Factory(t) { return new (t || TerritoryService)(i0.ɵɵinject(i0.Injector), i0.ɵɵinject(i1.HttpClient)); };
    TerritoryService.ɵprov = i0.ɵɵdefineInjectable({ token: TerritoryService, factory: TerritoryService.ɵfac });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(TerritoryService, [{
                type: i0.Injectable
            }], function () { return [{ type: i0.Injector }, { type: i1.HttpClient }]; }, null);
    })();

    /**
     * Territory type model
     */
    var TerritoryType = /** @class */ (function (_super) {
        __extends(TerritoryType, _super);
        function TerritoryType() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return TerritoryType;
    }(Resource));

    /** TerritoryType manager service */
    var TerritoryTypeService = /** @class */ (function (_super) {
        __extends(TerritoryTypeService, _super);
        /** constructor */
        function TerritoryTypeService(injector, http) {
            var _this = _super.call(this, TerritoryType, "territory-types", injector) || this;
            _this.http = http;
            /** API resource path */
            _this.TERRITORYTYPE_API = 'territory-types';
            return _this;
        }
        /** remove territory type*/
        TerritoryTypeService.prototype.remove = function (item) {
            return this.http.delete(item._links.self.href);
        };
        /** save territory type*/
        TerritoryTypeService.prototype.save = function (item) {
            var result;
            if (item._links != null) {
                result = this.http.put(item._links.self.href, item);
            }
            else {
                result = this.http.post(this.resourceService.getResourceUrl(this.TERRITORYTYPE_API), item);
            }
            return result;
        };
        return TerritoryTypeService;
    }(RestService));
    TerritoryTypeService.ɵfac = function TerritoryTypeService_Factory(t) { return new (t || TerritoryTypeService)(i0.ɵɵinject(i0.Injector), i0.ɵɵinject(i1.HttpClient)); };
    TerritoryTypeService.ɵprov = i0.ɵɵdefineInjectable({ token: TerritoryTypeService, factory: TerritoryTypeService.ɵfac });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(TerritoryTypeService, [{
                type: i0.Injectable
            }], function () { return [{ type: i0.Injector }, { type: i1.HttpClient }]; }, null);
    })();

    /**
     * Territory type model
     */
    var TerritoryGroupType = /** @class */ (function (_super) {
        __extends(TerritoryGroupType, _super);
        function TerritoryGroupType() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return TerritoryGroupType;
    }(Resource));

    var TerritoryGroupTypeService = /** @class */ (function (_super) {
        __extends(TerritoryGroupTypeService, _super);
        /** constructor */
        function TerritoryGroupTypeService(injector, http) {
            var _this = _super.call(this, TerritoryGroupType, "territory-group-types", injector) || this;
            _this.http = http;
            /** API resource path */
            _this.TERRITORYGROUPTYPE_API = 'territory-group-types';
            return _this;
        }
        /** remove territory*/
        TerritoryGroupTypeService.prototype.remove = function (item) {
            return this.http.delete(item._links.self.href);
        };
        /** save territory*/
        TerritoryGroupTypeService.prototype.save = function (item) {
            var result;
            if (item._links != null) {
                result = this.http.put(item._links.self.href, item);
            }
            else {
                result = this.http.post(this.resourceService.getResourceUrl(this.TERRITORYGROUPTYPE_API), item);
            }
            return result;
        };
        return TerritoryGroupTypeService;
    }(RestService));
    TerritoryGroupTypeService.ɵfac = function TerritoryGroupTypeService_Factory(t) { return new (t || TerritoryGroupTypeService)(i0.ɵɵinject(i0.Injector), i0.ɵɵinject(i1.HttpClient)); };
    TerritoryGroupTypeService.ɵprov = i0.ɵɵdefineInjectable({ token: TerritoryGroupTypeService, factory: TerritoryGroupTypeService.ɵfac, providedIn: 'root' });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(TerritoryGroupTypeService, [{
                type: i0.Injectable,
                args: [{
                        providedIn: 'root'
                    }]
            }], function () { return [{ type: i0.Injector }, { type: i1.HttpClient }]; }, null);
    })();

    /**
     * Role model
     */
    var Role = /** @class */ (function (_super) {
        __extends(Role, _super);
        function Role() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Role;
    }(Resource));

    /** Role manager service */
    var RoleService = /** @class */ (function (_super) {
        __extends(RoleService, _super);
        /** constructor */
        function RoleService(injector, http) {
            var _this = _super.call(this, Role, "roles", injector) || this;
            _this.http = http;
            /** API resource path */
            _this.ROLE_API = 'roles';
            return _this;
        }
        /** remove role*/
        RoleService.prototype.remove = function (item) {
            return this.http.delete(item._links.self.href);
        };
        /** save role*/
        RoleService.prototype.save = function (item) {
            var result;
            if (item._links != null) {
                result = this.http.put(item._links.self.href, item);
            }
            else {
                result = this.http.post(this.resourceService.getResourceUrl(this.ROLE_API), item);
            }
            return result;
        };
        return RoleService;
    }(RestService));
    RoleService.ɵfac = function RoleService_Factory(t) { return new (t || RoleService)(i0.ɵɵinject(i0.Injector), i0.ɵɵinject(i1.HttpClient)); };
    RoleService.ɵprov = i0.ɵɵdefineInjectable({ token: RoleService, factory: RoleService.ɵfac });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(RoleService, [{
                type: i0.Injectable
            }], function () { return [{ type: i0.Injector }, { type: i1.HttpClient }]; }, null);
    })();

    /**
     * Connection model
     */
    var Connection = /** @class */ (function (_super) {
        __extends(Connection, _super);
        function Connection() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Connection;
    }(Resource));

    /** Connection manager service */
    var ConnectionService = /** @class */ (function (_super) {
        __extends(ConnectionService, _super);
        /** constructor */
        function ConnectionService(injector, http) {
            var _this = _super.call(this, Connection, "connections", injector) || this;
            _this.http = http;
            /** API resource path */
            _this.CONNECTION_API = 'connections';
            return _this;
        }
        /** remove connection*/
        ConnectionService.prototype.remove = function (item) {
            return this.http.delete(item._links.self.href);
        };
        /** save connection*/
        ConnectionService.prototype.save = function (item) {
            var result;
            if (item._links != null) {
                result = this.http.put(item._links.self.href, item);
            }
            else {
                result = this.http.post(this.resourceService.getResourceUrl(this.CONNECTION_API), item);
            }
            return result;
        };
        ConnectionService.prototype.testConnection = function (item) {
            var result;
            result = this.http.post(this.resourceService.getResourceUrl(this.CONNECTION_API) + "/test", item);
            return result;
        };
        return ConnectionService;
    }(RestService));
    ConnectionService.ɵfac = function ConnectionService_Factory(t) { return new (t || ConnectionService)(i0.ɵɵinject(i0.Injector), i0.ɵɵinject(i1.HttpClient)); };
    ConnectionService.ɵprov = i0.ɵɵdefineInjectable({ token: ConnectionService, factory: ConnectionService.ɵfac });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(ConnectionService, [{
                type: i0.Injectable
            }], function () { return [{ type: i0.Injector }, { type: i1.HttpClient }]; }, null);
    })();

    //FIXME ensure task creation in admin app upon initialization (as it is done with Roles and default Users)
    /** GEOADMIN_task id */
    var GEOADMIN_TREE_TASK_ID = "geoadmin";
    /** Task model */
    var Task = /** @class */ (function (_super) {
        __extends(Task, _super);
        function Task() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Task;
    }(Resource));

    /** Task manager service */
    var TaskService = /** @class */ (function (_super) {
        __extends(TaskService, _super);
        /** constructor */
        function TaskService(injector, http) {
            var _this = _super.call(this, Task, "tasks", injector) || this;
            _this.http = http;
            /** API resource path */
            _this.CONNECTION_API = 'tasks';
            return _this;
        }
        /** remove task*/
        TaskService.prototype.remove = function (item) {
            return this.http.delete(item._links.self.href);
        };
        /** save task*/
        TaskService.prototype.save = function (item) {
            var result;
            if (item._links != null) {
                if (!item.service) {
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
                if (!item.ui) {
                    // item.deleteRelation('ui', item.ui).subscribe(result => {
                    // }, error => console.error(error)); 
                }
                else {
                    item.ui._links.self.href = item.ui._links.self.href.split("{")[0];
                    item.substituteRelation('ui', item.ui).subscribe(function (result) {
                    }, function (error) { return console.error(error); });
                    item.ui = item.ui._links.self.href;
                }
                if (!item.group) {
                    // item.deleteRelation('group', item.group).subscribe(result => {
                    // }, error => console.error(error)); 
                }
                else {
                    item.group._links.self.href = item.group._links.self.href.split("{")[0];
                    item.substituteRelation('group', item.group).subscribe(function (result) {
                    }, function (error) { return console.error(error); });
                    item.group = item.group._links.self.href;
                }
                if (!item.type) {
                    // item.deleteRelation('type', item.type).subscribe(result => {
                    // }, error => console.error(error)); 
                }
                else {
                    item.type._links.self.href = item.type._links.self.href.split("{")[0];
                    item.substituteRelation('type', item.type).subscribe(function (result) {
                    }, function (error) { return console.error(error); });
                    item.type = item.type._links.self.href;
                }
                if (item.roles) {
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
        return TaskService;
    }(RestService));
    TaskService.ɵfac = function TaskService_Factory(t) { return new (t || TaskService)(i0.ɵɵinject(i0.Injector), i0.ɵɵinject(i1.HttpClient)); };
    TaskService.ɵprov = i0.ɵɵdefineInjectable({ token: TaskService, factory: TaskService.ɵfac });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(TaskService, [{
                type: i0.Injectable
            }], function () { return [{ type: i0.Injector }, { type: i1.HttpClient }]; }, null);
    })();

    /**
     * Task type model
     */
    var TaskType = /** @class */ (function (_super) {
        __extends(TaskType, _super);
        function TaskType() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return TaskType;
    }(Resource));

    /** TaskType manager service */
    var TaskTypeService = /** @class */ (function (_super) {
        __extends(TaskTypeService, _super);
        /** constructor */
        function TaskTypeService(injector, http) {
            var _this = _super.call(this, TaskType, "task-types", injector) || this;
            _this.http = http;
            /** API resource path */
            _this.CONNECTION_API = 'task-types';
            return _this;
        }
        /** remove task type*/
        TaskTypeService.prototype.remove = function (item) {
            return this.http.delete(item._links.self.href);
        };
        /** save task type*/
        TaskTypeService.prototype.save = function (item) {
            var result;
            if (item._links != null) {
                result = this.http.put(item._links.self.href, item);
            }
            else {
                result = this.http.post(this.resourceService.getResourceUrl(this.CONNECTION_API), item);
            }
            return result;
        };
        return TaskTypeService;
    }(RestService));
    TaskTypeService.ɵfac = function TaskTypeService_Factory(t) { return new (t || TaskTypeService)(i0.ɵɵinject(i0.Injector), i0.ɵɵinject(i1.HttpClient)); };
    TaskTypeService.ɵprov = i0.ɵɵdefineInjectable({ token: TaskTypeService, factory: TaskTypeService.ɵfac });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(TaskTypeService, [{
                type: i0.Injectable
            }], function () { return [{ type: i0.Injector }, { type: i1.HttpClient }]; }, null);
    })();

    /**
     * Task group model
     */
    var TaskGroup = /** @class */ (function (_super) {
        __extends(TaskGroup, _super);
        function TaskGroup() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return TaskGroup;
    }(Resource));

    /** Task group manager service */
    var TaskGroupService = /** @class */ (function (_super) {
        __extends(TaskGroupService, _super);
        /** constructor */
        function TaskGroupService(injector, http) {
            var _this = _super.call(this, TaskGroup, "task-groups", injector) || this;
            _this.http = http;
            /** API resource path */
            _this.CONNECTION_API = 'task-groups';
            return _this;
        }
        /** remove task group*/
        TaskGroupService.prototype.remove = function (item) {
            return this.http.delete(item._links.self.href);
        };
        /** save task group*/
        TaskGroupService.prototype.save = function (item) {
            var result;
            if (item._links != null) {
                result = this.http.put(item._links.self.href, item);
            }
            else {
                result = this.http.post(this.resourceService.getResourceUrl(this.CONNECTION_API), item);
            }
            return result;
        };
        return TaskGroupService;
    }(RestService));
    TaskGroupService.ɵfac = function TaskGroupService_Factory(t) { return new (t || TaskGroupService)(i0.ɵɵinject(i0.Injector), i0.ɵɵinject(i1.HttpClient)); };
    TaskGroupService.ɵprov = i0.ɵɵdefineInjectable({ token: TaskGroupService, factory: TaskGroupService.ɵfac });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(TaskGroupService, [{
                type: i0.Injectable
            }], function () { return [{ type: i0.Injector }, { type: i1.HttpClient }]; }, null);
    })();

    /**
     * Task parameter model
     */
    var TaskParameter = /** @class */ (function (_super) {
        __extends(TaskParameter, _super);
        function TaskParameter() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return TaskParameter;
    }(Resource));

    /** Task parameter manager service */
    var TaskParameterService = /** @class */ (function (_super) {
        __extends(TaskParameterService, _super);
        /** constructor */
        function TaskParameterService(injector, http) {
            var _this = _super.call(this, TaskParameter, "task-parameters", injector) || this;
            _this.http = http;
            /** API resource path */
            _this.TASK_PARAMETER_API = 'task-parameters';
            return _this;
        }
        /** remove task parameter*/
        TaskParameterService.prototype.remove = function (item) {
            return this.http.delete(item._links.self.href);
        };
        /** save task parameter*/
        TaskParameterService.prototype.save = function (item) {
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
        return TaskParameterService;
    }(RestService));
    TaskParameterService.ɵfac = function TaskParameterService_Factory(t) { return new (t || TaskParameterService)(i0.ɵɵinject(i0.Injector), i0.ɵɵinject(i1.HttpClient)); };
    TaskParameterService.ɵprov = i0.ɵɵdefineInjectable({ token: TaskParameterService, factory: TaskParameterService.ɵfac });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(TaskParameterService, [{
                type: i0.Injectable
            }], function () { return [{ type: i0.Injector }, { type: i1.HttpClient }]; }, null);
    })();

    /**
     * Task availability model
     */
    var TaskAvailability = /** @class */ (function (_super) {
        __extends(TaskAvailability, _super);
        function TaskAvailability() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return TaskAvailability;
    }(Resource));

    /** Task availability manager service */
    var TaskAvailabilityService = /** @class */ (function (_super) {
        __extends(TaskAvailabilityService, _super);
        /** constructor */
        function TaskAvailabilityService(injector, http) {
            var _this = _super.call(this, TaskAvailability, "task-availabilities", injector) || this;
            _this.http = http;
            /** API resource path */
            _this.TASK_AVAILABILITY_API = 'task-availabilities';
            return _this;
        }
        /** remove task availability*/
        TaskAvailabilityService.prototype.remove = function (item) {
            return this.http.delete(item._links.self.href);
        };
        /** save task availability*/
        TaskAvailabilityService.prototype.save = function (item) {
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
        return TaskAvailabilityService;
    }(RestService));
    TaskAvailabilityService.ɵfac = function TaskAvailabilityService_Factory(t) { return new (t || TaskAvailabilityService)(i0.ɵɵinject(i0.Injector), i0.ɵɵinject(i1.HttpClient)); };
    TaskAvailabilityService.ɵprov = i0.ɵɵdefineInjectable({ token: TaskAvailabilityService, factory: TaskAvailabilityService.ɵfac });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(TaskAvailabilityService, [{
                type: i0.Injectable
            }], function () { return [{ type: i0.Injector }, { type: i1.HttpClient }]; }, null);
    })();

    /**
     * Task UI model
     */
    var TaskUI = /** @class */ (function (_super) {
        __extends(TaskUI, _super);
        function TaskUI() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return TaskUI;
    }(Resource));

    /** Task UI manager service */
    var TaskUIService = /** @class */ (function (_super) {
        __extends(TaskUIService, _super);
        /** constructor */
        function TaskUIService(injector, http) {
            var _this = _super.call(this, TaskUI, "task-uis", injector) || this;
            _this.http = http;
            /** API resource path */
            _this.CONNECTION_API = 'task-uis';
            return _this;
        }
        /** remove task UI*/
        TaskUIService.prototype.remove = function (item) {
            return this.http.delete(item._links.self.href);
        };
        /** save task UI*/
        TaskUIService.prototype.save = function (item) {
            var result;
            if (item._links != null) {
                result = this.http.put(item._links.self.href, item);
            }
            else {
                result = this.http.post(this.resourceService.getResourceUrl(this.CONNECTION_API), item);
            }
            return result;
        };
        return TaskUIService;
    }(RestService));
    TaskUIService.ɵfac = function TaskUIService_Factory(t) { return new (t || TaskUIService)(i0.ɵɵinject(i0.Injector), i0.ɵɵinject(i1.HttpClient)); };
    TaskUIService.ɵprov = i0.ɵɵdefineInjectable({ token: TaskUIService, factory: TaskUIService.ɵfac });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(TaskUIService, [{
                type: i0.Injectable
            }], function () { return [{ type: i0.Injector }, { type: i1.HttpClient }]; }, null);
    })();

    /** Task model */
    var Translation = /** @class */ (function (_super) {
        __extends(Translation, _super);
        function Translation() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Translation;
    }(Resource));

    var TranslationService = /** @class */ (function (_super) {
        __extends(TranslationService, _super);
        /** constructor */
        function TranslationService(injector, http) {
            var _this = _super.call(this, Translation, "translations", injector) || this;
            _this.http = http;
            /** API resource path */
            _this.TRANSLATION_API = 'translations';
            return _this;
        }
        /** remove translation*/
        TranslationService.prototype.remove = function (item) {
            return this.http.delete(item._links.self.href);
        };
        /** save translation*/
        TranslationService.prototype.save = function (item) {
            var result;
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
        return TranslationService;
    }(RestService));
    TranslationService.ɵfac = function TranslationService_Factory(t) { return new (t || TranslationService)(i0.ɵɵinject(i0.Injector), i0.ɵɵinject(i1.HttpClient)); };
    TranslationService.ɵprov = i0.ɵɵdefineInjectable({ token: TranslationService, factory: TranslationService.ɵfac, providedIn: 'root' });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(TranslationService, [{
                type: i0.Injectable,
                args: [{
                        providedIn: 'root'
                    }]
            }], function () { return [{ type: i0.Injector }, { type: i1.HttpClient }]; }, null);
    })();

    /** Task model */
    var Language = /** @class */ (function (_super) {
        __extends(Language, _super);
        function Language() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Language;
    }(Resource));

    var LanguageService = /** @class */ (function (_super) {
        __extends(LanguageService, _super);
        /** constructor */
        function LanguageService(injector, http) {
            var _this = _super.call(this, Language, "languages", injector) || this;
            _this.http = http;
            /** API resource path */
            _this.LANGUAGES_API = 'languages';
            return _this;
        }
        /** remove translation*/
        LanguageService.prototype.remove = function (item) {
            return this.http.delete(item._links.self.href);
        };
        /** save translation*/
        LanguageService.prototype.save = function (item) {
            var result;
            if (item._links != null) {
                result = this.http.put(item._links.self.href, item);
            }
            else {
                result = this.http.post(this.resourceService.getResourceUrl(this.LANGUAGES_API), item);
            }
            return result;
        };
        return LanguageService;
    }(RestService));
    LanguageService.ɵfac = function LanguageService_Factory(t) { return new (t || LanguageService)(i0.ɵɵinject(i0.Injector), i0.ɵɵinject(i1.HttpClient)); };
    LanguageService.ɵprov = i0.ɵɵdefineInjectable({ token: LanguageService, factory: LanguageService.ɵfac, providedIn: 'root' });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(LanguageService, [{
                type: i0.Injectable,
                args: [{
                        providedIn: 'root'
                    }]
            }], function () { return [{ type: i0.Injector }, { type: i1.HttpClient }]; }, null);
    })();

    /**
     * Service model
     */
    var Service = /** @class */ (function (_super) {
        __extends(Service, _super);
        function Service() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Service;
    }(Resource));

    /** Service manager service */
    var ServiceService = /** @class */ (function (_super) {
        __extends(ServiceService, _super);
        /** constructor */
        function ServiceService(injector, http) {
            var _this = _super.call(this, Service, "services", injector) || this;
            _this.http = http;
            /** API resource path */
            _this.SERVICE_API = 'services';
            return _this;
        }
        /** remove service*/
        ServiceService.prototype.remove = function (item) {
            return this.http.delete(item._links.self.href);
        };
        /** save service*/
        ServiceService.prototype.save = function (item) {
            var result;
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
        return ServiceService;
    }(RestService));
    ServiceService.ɵfac = function ServiceService_Factory(t) { return new (t || ServiceService)(i0.ɵɵinject(i0.Injector), i0.ɵɵinject(i1.HttpClient)); };
    ServiceService.ɵprov = i0.ɵɵdefineInjectable({ token: ServiceService, factory: ServiceService.ɵfac });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(ServiceService, [{
                type: i0.Injectable
            }], function () { return [{ type: i0.Injector }, { type: i1.HttpClient }]; }, null);
    })();

    /**
     * Service model
     */
    var ConfigurationParameter = /** @class */ (function (_super) {
        __extends(ConfigurationParameter, _super);
        function ConfigurationParameter() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return ConfigurationParameter;
    }(Resource));

    var ConfigurationParametersService = /** @class */ (function (_super) {
        __extends(ConfigurationParametersService, _super);
        /** constructor */
        function ConfigurationParametersService(injector, http) {
            var _this = _super.call(this, ConfigurationParameter, "configuration-parameters", injector) || this;
            _this.http = http;
            /** API resource path */
            _this.CONFIGURATION_PARAMETERS_API = 'configuration-parameters';
            return _this;
        }
        return ConfigurationParametersService;
    }(RestService));
    ConfigurationParametersService.ɵfac = function ConfigurationParametersService_Factory(t) { return new (t || ConfigurationParametersService)(i0.ɵɵinject(i0.Injector), i0.ɵɵinject(i1.HttpClient)); };
    ConfigurationParametersService.ɵprov = i0.ɵɵdefineInjectable({ token: ConfigurationParametersService, factory: ConfigurationParametersService.ɵfac, providedIn: 'root' });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(ConfigurationParametersService, [{
                type: i0.Injectable,
                args: [{
                        providedIn: 'root'
                    }]
            }], function () { return [{ type: i0.Injector }, { type: i1.HttpClient }]; }, null);
    })();

    /**
     * Service parameter model
     */
    var ServiceParameter = /** @class */ (function (_super) {
        __extends(ServiceParameter, _super);
        function ServiceParameter() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return ServiceParameter;
    }(Resource));

    /** Service parameter manager service */
    var ServiceParameterService = /** @class */ (function (_super) {
        __extends(ServiceParameterService, _super);
        /** constructor */
        function ServiceParameterService(injector, http) {
            var _this = _super.call(this, ServiceParameter, "service-parameters", injector) || this;
            _this.http = http;
            /** API resource path */
            _this.SERVICE_PARAMETER_API = 'service-parameters';
            return _this;
        }
        /** remove service parameter*/
        ServiceParameterService.prototype.remove = function (item) {
            return this.http.delete(item._links.self.href);
        };
        /** save service parameter*/
        ServiceParameterService.prototype.save = function (item) {
            var result;
            if (item._links != null) {
                if (item.service != null) {
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
        return ServiceParameterService;
    }(RestService));
    ServiceParameterService.ɵfac = function ServiceParameterService_Factory(t) { return new (t || ServiceParameterService)(i0.ɵɵinject(i0.Injector), i0.ɵɵinject(i1.HttpClient)); };
    ServiceParameterService.ɵprov = i0.ɵɵdefineInjectable({ token: ServiceParameterService, factory: ServiceParameterService.ɵfac });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(ServiceParameterService, [{
                type: i0.Injectable
            }], function () { return [{ type: i0.Injector }, { type: i1.HttpClient }]; }, null);
    })();

    /**
     * Capabilitie model
     */
    var Capabilitie = /** @class */ (function (_super) {
        __extends(Capabilitie, _super);
        function Capabilitie() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Capabilitie;
    }(Resource));

    var CapabilitiesService = /** @class */ (function (_super) {
        __extends(CapabilitiesService, _super);
        /** constructor */
        function CapabilitiesService(injector, http) {
            var _this = _super.call(this, Capabilitie, "helpers/capabilities?url=", injector) || this;
            _this.http = http;
            /** API resource path */
            _this.CAPABILITIES_API = 'helpers/capabilities?url=';
            return _this;
        }
        /** save service*/
        CapabilitiesService.prototype.getInfo = function (url) {
            var result;
            if (url) {
                var headerDict = {
                    'Charset': 'UTF-8'
                };
                var requestOptions = {
                    headers: new i1.HttpHeaders(headerDict),
                };
                var finalUrl = this.resourceService.getResourceUrl(this.CAPABILITIES_API);
                finalUrl = finalUrl.concat(url);
                console.log(finalUrl);
                result = this.http.get(finalUrl, requestOptions);
            }
            return result;
        };
        return CapabilitiesService;
    }(RestService));
    CapabilitiesService.ɵfac = function CapabilitiesService_Factory(t) { return new (t || CapabilitiesService)(i0.ɵɵinject(i0.Injector), i0.ɵɵinject(i1.HttpClient)); };
    CapabilitiesService.ɵprov = i0.ɵɵdefineInjectable({ token: CapabilitiesService, factory: CapabilitiesService.ɵfac, providedIn: 'root' });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(CapabilitiesService, [{
                type: i0.Injectable,
                args: [{
                        providedIn: 'root'
                    }]
            }], function () { return [{ type: i0.Injector }, { type: i1.HttpClient }]; }, null);
    })();

    /**
     * Info model
     */
    var Info = /** @class */ (function (_super) {
        __extends(Info, _super);
        function Info() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Info;
    }(Resource));

    var GetInfoService = /** @class */ (function (_super) {
        __extends(GetInfoService, _super);
        /** constructor */
        function GetInfoService(injector, http) {
            var _this = _super.call(this, Info, "helpers/feature-type?url=", injector) || this;
            _this.http = http;
            /** API resource path */
            _this.INFO_API = 'helpers/feature-type?url=';
            return _this;
        }
        /** save service*/
        GetInfoService.prototype.getInfo = function (url) {
            var result;
            if (url) {
                var headerDict = {
                    'Charset': 'UTF-8'
                };
                var requestOptions = {
                    headers: new i1.HttpHeaders(headerDict),
                };
                var finalUrl = this.resourceService.getResourceUrl(this.INFO_API);
                finalUrl = finalUrl.concat(url);
                console.log(finalUrl);
                result = this.http.get(finalUrl, requestOptions);
            }
            return result;
        };
        return GetInfoService;
    }(RestService));
    GetInfoService.ɵfac = function GetInfoService_Factory(t) { return new (t || GetInfoService)(i0.ɵɵinject(i0.Injector), i0.ɵɵinject(i1.HttpClient)); };
    GetInfoService.ɵprov = i0.ɵɵdefineInjectable({ token: GetInfoService, factory: GetInfoService.ɵfac, providedIn: 'root' });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(GetInfoService, [{
                type: i0.Injectable,
                args: [{
                        providedIn: 'root'
                    }]
            }], function () { return [{ type: i0.Injector }, { type: i1.HttpClient }]; }, null);
    })();

    /**
     * Cartography
     */
    var Cartography = /** @class */ (function (_super) {
        __extends(Cartography, _super);
        function Cartography() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Cartography;
    }(Resource));

    /** Cartography manager service */
    var CartographyService = /** @class */ (function (_super) {
        __extends(CartographyService, _super);
        /** constructor */
        function CartographyService(injector, http) {
            var _this = _super.call(this, Cartography, "cartographies", injector) || this;
            _this.http = http;
            /** API resource path */
            _this.CARTOGRAPHY_API = 'cartographies';
            return _this;
        }
        /** remove cartography*/
        CartographyService.prototype.remove = function (item) {
            return this.http.delete(item._links.self.href);
        };
        /** save cartography*/
        CartographyService.prototype.save = function (item) {
            var result;
            var cartographyConnection = {};
            cartographyConnection._links = {};
            cartographyConnection._links.self = {};
            cartographyConnection._links.self.href = "";
            var cartographyService = {};
            cartographyService._links = {};
            cartographyService._links.self = {};
            cartographyService._links.self.href = "";
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
        return CartographyService;
    }(RestService));
    CartographyService.ɵfac = function CartographyService_Factory(t) { return new (t || CartographyService)(i0.ɵɵinject(i0.Injector), i0.ɵɵinject(i1.HttpClient)); };
    CartographyService.ɵprov = i0.ɵɵdefineInjectable({ token: CartographyService, factory: CartographyService.ɵfac });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(CartographyService, [{
                type: i0.Injectable
            }], function () { return [{ type: i0.Injector }, { type: i1.HttpClient }]; }, null);
    })();

    /**
     * Cartography group
     */
    var CartographyGroup = /** @class */ (function (_super) {
        __extends(CartographyGroup, _super);
        function CartographyGroup() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return CartographyGroup;
    }(Resource));

    /** CartographyGroup manager service */
    var CartographyGroupService = /** @class */ (function (_super) {
        __extends(CartographyGroupService, _super);
        /** constructor */
        function CartographyGroupService(injector, http) {
            var _this = _super.call(this, CartographyGroup, "cartography-groups", injector) || this;
            _this.http = http;
            /** API resource path */
            _this.CARTOGRAPHY_GROUP_API = 'cartography-groups';
            return _this;
        }
        /** remove cartography group*/
        CartographyGroupService.prototype.remove = function (item) {
            return this.http.delete(item._links.self.href);
        };
        /** save cartography group*/
        CartographyGroupService.prototype.save = function (item) {
            var result;
            if (item._links != null) {
                result = this.http.put(item._links.self.href, item);
            }
            else {
                result = this.http.post(this.resourceService.getResourceUrl(this.CARTOGRAPHY_GROUP_API), item);
            }
            return result;
        };
        return CartographyGroupService;
    }(RestService));
    CartographyGroupService.ɵfac = function CartographyGroupService_Factory(t) { return new (t || CartographyGroupService)(i0.ɵɵinject(i0.Injector), i0.ɵɵinject(i1.HttpClient)); };
    CartographyGroupService.ɵprov = i0.ɵɵdefineInjectable({ token: CartographyGroupService, factory: CartographyGroupService.ɵfac });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(CartographyGroupService, [{
                type: i0.Injectable
            }], function () { return [{ type: i0.Injector }, { type: i1.HttpClient }]; }, null);
    })();

    /**
     * Cartography availability model
     */
    var CartographyAvailability = /** @class */ (function (_super) {
        __extends(CartographyAvailability, _super);
        function CartographyAvailability() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return CartographyAvailability;
    }(Resource));

    /** CartographyAvailability manager service */
    var CartographyAvailabilityService = /** @class */ (function (_super) {
        __extends(CartographyAvailabilityService, _super);
        /** constructor */
        function CartographyAvailabilityService(injector, http) {
            var _this = _super.call(this, CartographyAvailability, "cartography-availabilities", injector) || this;
            _this.http = http;
            /** API resource path */
            _this.CARTOGRAPHY_AVAILABILITY_API = 'cartography-availabilities';
            return _this;
        }
        /** remove cartography availability*/
        CartographyAvailabilityService.prototype.remove = function (item) {
            return this.http.delete(item._links.self.href);
        };
        /** save cartography availability*/
        CartographyAvailabilityService.prototype.save = function (item) {
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
        return CartographyAvailabilityService;
    }(RestService));
    CartographyAvailabilityService.ɵfac = function CartographyAvailabilityService_Factory(t) { return new (t || CartographyAvailabilityService)(i0.ɵɵinject(i0.Injector), i0.ɵɵinject(i1.HttpClient)); };
    CartographyAvailabilityService.ɵprov = i0.ɵɵdefineInjectable({ token: CartographyAvailabilityService, factory: CartographyAvailabilityService.ɵfac });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(CartographyAvailabilityService, [{
                type: i0.Injectable
            }], function () { return [{ type: i0.Injector }, { type: i1.HttpClient }]; }, null);
    })();

    /**
     * Cartography availability model
     */
    var CartographyFilter = /** @class */ (function (_super) {
        __extends(CartographyFilter, _super);
        function CartographyFilter() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return CartographyFilter;
    }(Resource));

    /** CartographyFilter manager service */
    var CartographyFilterService = /** @class */ (function (_super) {
        __extends(CartographyFilterService, _super);
        /** constructor */
        function CartographyFilterService(injector, http) {
            var _this = _super.call(this, CartographyFilter, "cartography-filters", injector) || this;
            _this.http = http;
            /** API resource path */
            _this.CARTOGRAPHY_FILTER_API = 'cartography-filters';
            return _this;
        }
        /** remove cartography filter*/
        CartographyFilterService.prototype.remove = function (item) {
            return this.http.delete(item._links.self.href);
        };
        /** save cartography availability*/
        CartographyFilterService.prototype.save = function (item) {
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
        return CartographyFilterService;
    }(RestService));
    CartographyFilterService.ɵfac = function CartographyFilterService_Factory(t) { return new (t || CartographyFilterService)(i0.ɵɵinject(i0.Injector), i0.ɵɵinject(i1.HttpClient)); };
    CartographyFilterService.ɵprov = i0.ɵɵdefineInjectable({ token: CartographyFilterService, factory: CartographyFilterService.ɵfac });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(CartographyFilterService, [{
                type: i0.Injectable
            }], function () { return [{ type: i0.Injector }, { type: i1.HttpClient }]; }, null);
    })();

    /**
     * Service parameter model
     */
    var CartographyParameter = /** @class */ (function (_super) {
        __extends(CartographyParameter, _super);
        function CartographyParameter() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return CartographyParameter;
    }(Resource));

    /** Service parameter manager service */
    var CartographyParameterService = /** @class */ (function (_super) {
        __extends(CartographyParameterService, _super);
        /** constructor */
        function CartographyParameterService(injector, http) {
            var _this = _super.call(this, CartographyParameter, "cartography-parameters", injector) || this;
            _this.http = http;
            /** API resource path */
            _this.CARTOGRAPHY_PARAMETER_API = 'cartography-parameters';
            return _this;
        }
        /** remove service parameter*/
        CartographyParameterService.prototype.remove = function (item) {
            return this.http.delete(item._links.self.href);
        };
        /** save service parameter*/
        CartographyParameterService.prototype.save = function (item) {
            var result;
            if (item._links != null) {
                if (item.cartography != null) {
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
        return CartographyParameterService;
    }(RestService));
    CartographyParameterService.ɵfac = function CartographyParameterService_Factory(t) { return new (t || CartographyParameterService)(i0.ɵɵinject(i0.Injector), i0.ɵɵinject(i1.HttpClient)); };
    CartographyParameterService.ɵprov = i0.ɵɵdefineInjectable({ token: CartographyParameterService, factory: CartographyParameterService.ɵfac });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(CartographyParameterService, [{
                type: i0.Injectable
            }], function () { return [{ type: i0.Injector }, { type: i1.HttpClient }]; }, null);
    })();

    /** Service parameter manager service */
    var CartographySpatialSelectionParameterService = /** @class */ (function (_super) {
        __extends(CartographySpatialSelectionParameterService, _super);
        /** constructor */
        function CartographySpatialSelectionParameterService(injector, http) {
            var _this = _super.call(this, CartographyParameter, "cartography-spatial-selection-parameters", injector) || this;
            _this.http = http;
            /** API resource path */
            _this.CARTOGRAPHY_SPATIAL_SELECTION_PARAMETER_API = 'cartography-spatial-selection-parameters';
            return _this;
        }
        /** remove service parameter*/
        CartographySpatialSelectionParameterService.prototype.remove = function (item) {
            return this.http.delete(item._links.self.href);
        };
        /** save service parameter*/
        CartographySpatialSelectionParameterService.prototype.save = function (item) {
            var result;
            if (item._links != null) {
                if (item.cartography != null) {
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
        return CartographySpatialSelectionParameterService;
    }(RestService));
    CartographySpatialSelectionParameterService.ɵfac = function CartographySpatialSelectionParameterService_Factory(t) { return new (t || CartographySpatialSelectionParameterService)(i0.ɵɵinject(i0.Injector), i0.ɵɵinject(i1.HttpClient)); };
    CartographySpatialSelectionParameterService.ɵprov = i0.ɵɵdefineInjectable({ token: CartographySpatialSelectionParameterService, factory: CartographySpatialSelectionParameterService.ɵfac });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(CartographySpatialSelectionParameterService, [{
                type: i0.Injectable
            }], function () { return [{ type: i0.Injector }, { type: i1.HttpClient }]; }, null);
    })();

    /**
     * Cartography style model
     */
    var CartographyStyle = /** @class */ (function (_super) {
        __extends(CartographyStyle, _super);
        function CartographyStyle() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return CartographyStyle;
    }(Resource));

    var CartographyStyleService = /** @class */ (function (_super) {
        __extends(CartographyStyleService, _super);
        /** constructor */
        function CartographyStyleService(injector, http) {
            var _this = _super.call(this, CartographyStyle, "cartography-styles", injector) || this;
            _this.http = http;
            /** API resource path */
            _this.CARTOGRAPHY_STYLES_API = 'cartography-styles';
            return _this;
        }
        /** remove service parameter*/
        CartographyStyleService.prototype.remove = function (item) {
            return this.http.delete(item._links.self.href);
        };
        /** save service parameter*/
        CartographyStyleService.prototype.save = function (item) {
            var result;
            if (item._links != null) {
                if (item.cartography != null) {
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
        return CartographyStyleService;
    }(RestService));
    CartographyStyleService.ɵfac = function CartographyStyleService_Factory(t) { return new (t || CartographyStyleService)(i0.ɵɵinject(i0.Injector), i0.ɵɵinject(i1.HttpClient)); };
    CartographyStyleService.ɵprov = i0.ɵɵdefineInjectable({ token: CartographyStyleService, factory: CartographyStyleService.ɵfac, providedIn: 'root' });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(CartographyStyleService, [{
                type: i0.Injectable,
                args: [{
                        providedIn: 'root'
                    }]
            }], function () { return [{ type: i0.Injector }, { type: i1.HttpClient }]; }, null);
    })();

    /**
     * Background model
     */
    var Background = /** @class */ (function (_super) {
        __extends(Background, _super);
        function Background() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Background;
    }(Resource));

    /** Background manager service */
    var BackgroundService = /** @class */ (function (_super) {
        __extends(BackgroundService, _super);
        /** constructor */
        function BackgroundService(injector, http) {
            var _this = _super.call(this, Background, "backgrounds", injector) || this;
            _this.http = http;
            /** API resource path */
            _this.BACKGROUND_API = 'backgrounds';
            return _this;
        }
        /** remove background*/
        BackgroundService.prototype.remove = function (item) {
            return this.http.delete(item._links.self.href);
        };
        /** save background*/
        BackgroundService.prototype.save = function (item) {
            var result;
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
        return BackgroundService;
    }(RestService));
    BackgroundService.ɵfac = function BackgroundService_Factory(t) { return new (t || BackgroundService)(i0.ɵɵinject(i0.Injector), i0.ɵɵinject(i1.HttpClient)); };
    BackgroundService.ɵprov = i0.ɵɵdefineInjectable({ token: BackgroundService, factory: BackgroundService.ɵfac });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(BackgroundService, [{
                type: i0.Injectable
            }], function () { return [{ type: i0.Injector }, { type: i1.HttpClient }]; }, null);
    })();

    /**
     * Tree model
     */
    var Tree = /** @class */ (function (_super) {
        __extends(Tree, _super);
        function Tree() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Tree;
    }(Resource));

    /** Tree manager service */
    var TreeService = /** @class */ (function (_super) {
        __extends(TreeService, _super);
        /** constructor */
        function TreeService(injector, http) {
            var _this = _super.call(this, Tree, "trees", injector) || this;
            _this.http = http;
            /** API resource path */
            _this.TREE_API = 'trees';
            return _this;
        }
        /** remove tree*/
        TreeService.prototype.remove = function (item) {
            return this.http.delete(item._links.self.href);
        };
        /** save tree*/
        TreeService.prototype.save = function (item) {
            var result;
            if (item._links != null) {
                result = this.http.put(item._links.self.href, item);
            }
            else {
                result = this.http.post(this.resourceService.getResourceUrl(this.TREE_API), item);
            }
            return result;
        };
        return TreeService;
    }(RestService));
    TreeService.ɵfac = function TreeService_Factory(t) { return new (t || TreeService)(i0.ɵɵinject(i0.Injector), i0.ɵɵinject(i1.HttpClient)); };
    TreeService.ɵprov = i0.ɵɵdefineInjectable({ token: TreeService, factory: TreeService.ɵfac });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(TreeService, [{
                type: i0.Injectable
            }], function () { return [{ type: i0.Injector }, { type: i1.HttpClient }]; }, null);
    })();

    /**
     * Tree node model
     */
    var TreeNode = /** @class */ (function (_super) {
        __extends(TreeNode, _super);
        function TreeNode() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return TreeNode;
    }(Resource));

    /** Tree node manager service */
    var TreeNodeService = /** @class */ (function (_super) {
        __extends(TreeNodeService, _super);
        /** constructor */
        function TreeNodeService(injector, http) {
            var _this = _super.call(this, TreeNode, "tree-nodes", injector) || this;
            _this.http = http;
            /** API resource path */
            _this.TREE_NODE_API = 'tree-nodes';
            return _this;
        }
        /** remove tree node*/
        TreeNodeService.prototype.remove = function (item) {
            return this.http.delete(item._links.self.href);
        };
        /** save tree node*/
        TreeNodeService.prototype.save = function (item) {
            var result;
            if (item._links != null) {
                var itemTree = item.tree;
                var itemCartography = item.cartography;
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
        return TreeNodeService;
    }(RestService));
    TreeNodeService.ɵfac = function TreeNodeService_Factory(t) { return new (t || TreeNodeService)(i0.ɵɵinject(i0.Injector), i0.ɵɵinject(i1.HttpClient)); };
    TreeNodeService.ɵprov = i0.ɵɵdefineInjectable({ token: TreeNodeService, factory: TreeNodeService.ɵfac });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(TreeNodeService, [{
                type: i0.Injectable
            }], function () { return [{ type: i0.Injector }, { type: i1.HttpClient }]; }, null);
    })();

    //FIXME ensure application creation in admin app upon initialization (as it is done with Roles and default Users)
    /** Territorial appliction name */
    var TERRITORIAL_APP_NAME = "Aplicación Territorial";
    /**
     * Application model
     */
    var Application = /** @class */ (function (_super) {
        __extends(Application, _super);
        function Application() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Application;
    }(Resource));

    /** Application manager service */
    var ApplicationService = /** @class */ (function (_super) {
        __extends(ApplicationService, _super);
        /** constructor */
        function ApplicationService(injector, http) {
            var _this = _super.call(this, Application, "applications", injector) || this;
            _this.http = http;
            /** API resource path */
            _this.APPLICATION_API = 'applications';
            return _this;
        }
        /** remove application*/
        ApplicationService.prototype.remove = function (item) {
            return this.http.delete(item._links.self.href);
        };
        /** save application*/
        ApplicationService.prototype.save = function (item) {
            var result;
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
        return ApplicationService;
    }(RestService));
    ApplicationService.ɵfac = function ApplicationService_Factory(t) { return new (t || ApplicationService)(i0.ɵɵinject(i0.Injector), i0.ɵɵinject(i1.HttpClient)); };
    ApplicationService.ɵprov = i0.ɵɵdefineInjectable({ token: ApplicationService, factory: ApplicationService.ɵfac });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(ApplicationService, [{
                type: i0.Injectable
            }], function () { return [{ type: i0.Injector }, { type: i1.HttpClient }]; }, null);
    })();

    /**
     * Application background model
     */
    var ApplicationBackground = /** @class */ (function (_super) {
        __extends(ApplicationBackground, _super);
        function ApplicationBackground() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return ApplicationBackground;
    }(Resource));

    /** Application background manager service */
    var ApplicationBackgroundService = /** @class */ (function (_super) {
        __extends(ApplicationBackgroundService, _super);
        /** constructor */
        function ApplicationBackgroundService(injector, http) {
            var _this = _super.call(this, ApplicationBackground, "application-backgrounds", injector) || this;
            _this.http = http;
            /** API resource path */
            _this.APPLICATION_BACKGROUND_API = 'application-backgrounds';
            return _this;
        }
        /** remove application background*/
        ApplicationBackgroundService.prototype.remove = function (item) {
            return this.http.delete(item._links.self.href);
        };
        /** save application background*/
        ApplicationBackgroundService.prototype.save = function (item) {
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
        return ApplicationBackgroundService;
    }(RestService));
    ApplicationBackgroundService.ɵfac = function ApplicationBackgroundService_Factory(t) { return new (t || ApplicationBackgroundService)(i0.ɵɵinject(i0.Injector), i0.ɵɵinject(i1.HttpClient)); };
    ApplicationBackgroundService.ɵprov = i0.ɵɵdefineInjectable({ token: ApplicationBackgroundService, factory: ApplicationBackgroundService.ɵfac });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(ApplicationBackgroundService, [{
                type: i0.Injectable
            }], function () { return [{ type: i0.Injector }, { type: i1.HttpClient }]; }, null);
    })();

    /**
     * Application parameter model
     */
    var ApplicationParameter = /** @class */ (function (_super) {
        __extends(ApplicationParameter, _super);
        function ApplicationParameter() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return ApplicationParameter;
    }(Resource));

    /** Application parameter manager service */
    var ApplicationParameterService = /** @class */ (function (_super) {
        __extends(ApplicationParameterService, _super);
        /** constructor */
        function ApplicationParameterService(injector, http) {
            var _this = _super.call(this, ApplicationParameter, "application-parameters", injector) || this;
            _this.http = http;
            /** API resource path */
            _this.APPLICATION_PARAMETER_API = 'application-parameters';
            return _this;
        }
        /** remove application*/
        ApplicationParameterService.prototype.remove = function (item) {
            return this.http.delete(item._links.self.href);
        };
        /** save application*/
        ApplicationParameterService.prototype.save = function (item) {
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
        return ApplicationParameterService;
    }(RestService));
    ApplicationParameterService.ɵfac = function ApplicationParameterService_Factory(t) { return new (t || ApplicationParameterService)(i0.ɵɵinject(i0.Injector), i0.ɵɵinject(i1.HttpClient)); };
    ApplicationParameterService.ɵprov = i0.ɵɵdefineInjectable({ token: ApplicationParameterService, factory: ApplicationParameterService.ɵfac });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(ApplicationParameterService, [{
                type: i0.Injectable
            }], function () { return [{ type: i0.Injector }, { type: i1.HttpClient }]; }, null);
    })();

    /**
     * Connection model
     */
    var CodeList = /** @class */ (function (_super) {
        __extends(CodeList, _super);
        function CodeList() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return CodeList;
    }(Resource));

    /** Connection manager service */
    var CodeListService = /** @class */ (function (_super) {
        __extends(CodeListService, _super);
        /** constructor */
        function CodeListService(injector, http) {
            var _this = _super.call(this, CodeList, "codelist-values", injector) || this;
            _this.http = http;
            /** API resource path */
            _this.CODELIST_API = 'codelist-values';
            return _this;
        }
        /** remove connection*/
        CodeListService.prototype.remove = function (item) {
            return this.http.delete(item._links.self.href);
        };
        /** save connection*/
        CodeListService.prototype.save = function (item) {
            var result;
            if (item._links != null) {
                result = this.http.put(item._links.self.href, item);
            }
            else {
                result = this.http.post(this.resourceService.getResourceUrl(this.CODELIST_API), item);
            }
            return result;
        };
        return CodeListService;
    }(RestService));
    CodeListService.ɵfac = function CodeListService_Factory(t) { return new (t || CodeListService)(i0.ɵɵinject(i0.Injector), i0.ɵɵinject(i1.HttpClient)); };
    CodeListService.ɵprov = i0.ɵɵdefineInjectable({ token: CodeListService, factory: CodeListService.ɵfac });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(CodeListService, [{
                type: i0.Injectable
            }], function () { return [{ type: i0.Injector }, { type: i1.HttpClient }]; }, null);
    })();

    /** Layer model: configure Layer data and displaying configuration */
    var Layer = /** @class */ (function () {
        function Layer() {
            // Display data
            /** layer visibility*/
            this.visibility = false;
            /** Transparency (Transparent) 0-1 (Opaque)*/
            this.opacity = 1.0;
            /** Service attributions*/
            this.attributions = "";
            /** Description*/
            this.desc = "";
            /**  Transparent request parameter?*/
            this.url_transparent = "true";
            /** Request Background parameter color (Hexa)*/
            this.url_bgcolor = "0x000000";
            /** Extent for tiled services*/
            this.extent = null;
            /** Enabled for GetFeatureInfo requests (enabled to use the viewer features information tool)*/
            this.queryable = false;
        }
        return Layer;
    }());
    /** Optional parameter model: configure parameter-value pair to add to the request layer URL */
    var OptionalParameter = /** @class */ (function () {
        function OptionalParameter() {
        }
        return OptionalParameter;
    }());
    /** Layer configuration model: modify the configuration of a layer when interacting with the map (make visible, move the layer ...) */
    var LayerConfiguration = /** @class */ (function () {
        function LayerConfiguration() {
        }
        return LayerConfiguration;
    }());
    /** Layer group model*/
    var LayerGroup = /** @class */ (function () {
        function LayerGroup() {
        }
        return LayerGroup;
    }());
    /** Map options configuration model*/
    var MapOptionsConfiguration = /** @class */ (function () {
        function MapOptionsConfiguration() {
        }
        return MapOptionsConfiguration;
    }());
    /** Map component status model*/
    var MapComponentStatus = /** @class */ (function () {
        function MapComponentStatus() {
            /** loaded?*/ this.loaded = false;
        }
        return MapComponentStatus;
    }());
    /** Map configuration manager service*/
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
            /** layer count */
            this.count = 0;
            //
        }
        /** configure the overlay layers of the map, by passing as a parameter an array of objects of type Layer objects defining the layers to load.*/
        MapConfigurationManagerService.prototype.loadLayersConfiguration = function (configuration) {
            if (this.layers != null) {
                this.clearLayers(false);
            }
            this.setLayers(configuration);
        };
        /**configure the base layers of the map by passing as a parameter an array of objects of type LayerGroup each of them with the corresponding Layer objects defining the layers to load.*/
        MapConfigurationManagerService.prototype.loadBaseLayersConfiguration = function (configuration) {
            this.setBaseLayerGroups(configuration);
        };
        /** get base layer groups*/
        MapConfigurationManagerService.prototype.getBaseLayerGroups = function () {
            return this.baseLayerGroupsSubject.asObservable();
        };
        /** set base layer groups*/
        MapConfigurationManagerService.prototype.setBaseLayerGroups = function (groups) {
            this.baseLayerGroups = groups;
            this.refreshBaseLayerGroups();
        };
        MapConfigurationManagerService.prototype.refreshBaseLayerGroups = function () {
            // Send the new values so that all subscribers are updated
            this.baseLayerGroupsSubject.next(this.baseLayerGroups);
        };
        /** get layers*/
        MapConfigurationManagerService.prototype.getLayers = function () {
            return this.layersSubject.asObservable();
        };
        /** remove all layers from map*/
        MapConfigurationManagerService.prototype.clearLayers = function (refresh) {
            while (this.layers.length) {
                this.layers.pop();
            }
            if (refresh) {
                this.refreshLayers();
            }
        };
        /** set layers*/
        MapConfigurationManagerService.prototype.setLayers = function (layers) {
            this.layers = layers;
            this.refreshLayers();
        };
        /** add given layer to map*/
        MapConfigurationManagerService.prototype.addLayer = function (layer) {
            this.layers.push(layer);
            this.refreshAddLayers(layer);
        };
        /** add given layer to map at given index*/
        MapConfigurationManagerService.prototype.addLayerAt = function (layer, index) {
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
        MapConfigurationManagerService.prototype.removeLayer = function (layer) {
            var index = this.layers.indexOf(layer);
            this.removeLayerIndex(index);
        };
        /** remove layer with given id from map */
        MapConfigurationManagerService.prototype.removeLayerId = function (id) {
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
        MapConfigurationManagerService.prototype.removeLayerIndex = function (index) {
            var layer = this.layers[index];
            this.layers.splice(index, 1);
            this.refreshRemoveLayers(layer);
        };
        /** refresh layers */
        MapConfigurationManagerService.prototype.refreshLayers = function () {
            // Send the new values so that all subscribers are updated
            this.layersSubject.next(this.layers);
        };
        /** Observable for layers added */
        MapConfigurationManagerService.prototype.getLayersAdded = function () {
            return this.addLayersSubject.asObservable();
        };
        MapConfigurationManagerService.prototype.refreshAddLayers = function (layer) {
            // Send the new values so that all subscribers are updated
            this.addLayersSubject.next([layer]);
        };
        MapConfigurationManagerService.prototype.getLayersRemoved = function () {
            return this.removeLayersSubject.asObservable();
        };
        MapConfigurationManagerService.prototype.refreshRemoveLayers = function (layer) {
            // Send the new values so that all subscribers are updated
            this.removeLayersSubject.next([layer]);
        };
        MapConfigurationManagerService.prototype.getLayerConfigurationListener = function () {
            return this.layerConfigurationSubject.asObservable();
        };
        MapConfigurationManagerService.prototype.getLayerIndexById = function (id) {
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
        MapConfigurationManagerService.prototype.moveLayer = function (id, index) {
            var layerIndex = this.getLayerIndexById(id);
            if (layerIndex != -1) {
                var layer = this.layers.splice(layerIndex, 1);
                this.layers =
                    this.layers.slice(0, index)
                        .concat(layer)
                        .concat(this.layers.slice(index, this.layers.length));
            }
            this.refreshLayerConfiguration(id, null, null, index);
        };
        /** change visibility of layer with given id to the given value*/
        MapConfigurationManagerService.prototype.changeLayerVisibility = function (id, visibility) {
            this.refreshLayerConfiguration(id, null, visibility, null);
        };
        /** change opacity of layer with given id to the given value*/
        MapConfigurationManagerService.prototype.changeLayerOpacity = function (id, opacity) {
            this.refreshLayerConfiguration(id, opacity, null, null);
        };
        MapConfigurationManagerService.prototype.refreshLayerConfiguration = function (id, opacity, visibility, position) {
            // Send the new values so that all subscribers are updated
            var layer = new LayerConfiguration();
            layer.id = id;
            layer.opacity = opacity;
            layer.visibility = visibility;
            layer.position = position;
            this.layerConfigurationSubject.next([layer]);
        };
        MapConfigurationManagerService.prototype.getSituationMapConfigurationListener = function () {
            return this.situationMapConfigurationSubject.asObservable();
        };
        /** configure the situation map of the map component by passing as a parameter an array of objects of type LayerGroup, each of them with the corresponding Layer objects defining the layers to load as situation map.*/
        MapConfigurationManagerService.prototype.loadSituationMapConfiguration = function (layers) {
            // Send the new values so that all subscribers are updated
            this.situationMapConfigurationSubject.next(layers);
        };
        MapConfigurationManagerService.prototype.getMapOptionsConfigurationListener = function () {
            return this.mapOptionsConfigurationSubject.asObservable();
        };
        /** load map options configuration */
        MapConfigurationManagerService.prototype.loadMapOptionsConfiguration = function (configuration) {
            // Send the new values so that all subscribers are updated
            this.mapOptionsConfigurationSubject.next([configuration]);
        };
        MapConfigurationManagerService.prototype.getMapComponentStatusListener = function () {
            return this.mapComponentStatusSubject.asObservable();
        };
        /** set map component status */
        MapConfigurationManagerService.prototype.setMapComponentStatus = function (status) {
            //Notify the map component status
            this.mapComponentStatusSubject.next([status]);
        };
        return MapConfigurationManagerService;
    }());
    MapConfigurationManagerService.ɵfac = function MapConfigurationManagerService_Factory(t) { return new (t || MapConfigurationManagerService)(); };
    MapConfigurationManagerService.ɵprov = i0.ɵɵdefineInjectable({ token: MapConfigurationManagerService, factory: MapConfigurationManagerService.ɵfac, providedIn: 'root' });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(MapConfigurationManagerService, [{
                type: i0.Injectable,
                args: [{
                        providedIn: 'root'
                    }]
            }], function () { return []; }, null);
    })();

    /**
     * @whatItDoes Conditionally includes an HTML element if current user has any
     * of the authorities passed as the `expression`.
     *
     * @howToUse
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
            set: function (value) {
                var _this = this;
                this.authorities = typeof value === 'string' ? [value] : value;
                this.updateView();
                // Get notified each time authentication state changes.
                this.principal.getAuthenticationState().subscribe(function (identity) { return _this.updateView(); });
            },
            enumerable: false,
            configurable: true
        });
        /** update view */
        HasAnyAuthorityDirective.prototype.updateView = function () {
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
        return HasAnyAuthorityDirective;
    }());
    HasAnyAuthorityDirective.ɵfac = function HasAnyAuthorityDirective_Factory(t) { return new (t || HasAnyAuthorityDirective)(i0.ɵɵdirectiveInject(Principal), i0.ɵɵdirectiveInject(i0.TemplateRef), i0.ɵɵdirectiveInject(i0.ViewContainerRef)); };
    HasAnyAuthorityDirective.ɵdir = i0.ɵɵdefineDirective({ type: HasAnyAuthorityDirective, selectors: [["", "sitmunHasAnyAuthority", ""]], inputs: { territory: "territory", sitmunHasAnyAuthority: "sitmunHasAnyAuthority" } });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(HasAnyAuthorityDirective, [{
                type: i0.Directive,
                args: [{
                        selector: '[sitmunHasAnyAuthority]'
                    }]
            }], function () { return [{ type: Principal }, { type: i0.TemplateRef }, { type: i0.ViewContainerRef }]; }, { territory: [{
                    type: i0.Input
                }], sitmunHasAnyAuthority: [{
                    type: i0.Input
                }] });
    })();

    /**
     * @whatItDoes Conditionally includes an HTML element if current user has any
     * of the authorities passed as the `expression`.
     *
     * @howToUse
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
            set: function (opts) {
                var _this = this;
                this.authorities = typeof opts.authorities === 'string' ? [opts.authorities] : opts.authorities;
                this.territory = opts.territory;
                this.updateView();
                // Get notified each time authentication state changes.
                this.principal.getAuthenticationState().subscribe(function (identity) { return _this.updateView(); });
            },
            enumerable: false,
            configurable: true
        });
        /** update view */
        HasAnyAuthorityOnTerritoryDirective.prototype.updateView = function () {
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
        return HasAnyAuthorityOnTerritoryDirective;
    }());
    HasAnyAuthorityOnTerritoryDirective.ɵfac = function HasAnyAuthorityOnTerritoryDirective_Factory(t) { return new (t || HasAnyAuthorityOnTerritoryDirective)(i0.ɵɵdirectiveInject(Principal), i0.ɵɵdirectiveInject(i0.TemplateRef), i0.ɵɵdirectiveInject(i0.ViewContainerRef)); };
    HasAnyAuthorityOnTerritoryDirective.ɵdir = i0.ɵɵdefineDirective({ type: HasAnyAuthorityOnTerritoryDirective, selectors: [["", "sitmunHasAnyAuthorityOnTerritory", ""]], inputs: { sitmunHasAnyAuthorityOnTerritory: "sitmunHasAnyAuthorityOnTerritory" } });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(HasAnyAuthorityOnTerritoryDirective, [{
                type: i0.Directive,
                args: [{
                        selector: '[sitmunHasAnyAuthorityOnTerritory]'
                    }]
            }], function () { return [{ type: Principal }, { type: i0.TemplateRef }, { type: i0.ViewContainerRef }]; }, { sitmunHasAnyAuthorityOnTerritory: [{
                    type: i0.Input
                }] });
    })();

    /** load i18n assets*/
    function createTranslateLoader(http) {
        return new httpLoader.TranslateHttpLoader(http, './assets/i18n/', '.json');
    }
    /** SITMUN frontend core module */
    var SitmunFrontendCoreModule = /** @class */ (function () {
        function SitmunFrontendCoreModule() {
        }
        SitmunFrontendCoreModule.forRoot = function () {
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
        return SitmunFrontendCoreModule;
    }());
    SitmunFrontendCoreModule.ɵmod = i0.ɵɵdefineNgModule({ type: SitmunFrontendCoreModule });
    SitmunFrontendCoreModule.ɵinj = i0.ɵɵdefineInjector({ factory: function SitmunFrontendCoreModule_Factory(t) { return new (t || SitmunFrontendCoreModule)(); }, imports: [[
                /*RouterModule,
                HttpClientModule,
                CommonModule,
                AngularHalModule,*/
                i1$2.TranslateModule.forRoot({
                    loader: {
                        provide: i1$2.TranslateLoader,
                        useFactory: (createTranslateLoader),
                        deps: [i1.HttpClient]
                    }
                }),
            ], i1$2.TranslateModule] });
    (function () {
        (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(SitmunFrontendCoreModule, { declarations: [HasAnyAuthorityDirective,
                HasAnyAuthorityOnTerritoryDirective], imports: [i1$2.TranslateModule], exports: [HasAnyAuthorityDirective,
                HasAnyAuthorityOnTerritoryDirective,
                i1$2.TranslateModule] });
    })();
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(SitmunFrontendCoreModule, [{
                type: i0.NgModule,
                args: [{
                        imports: [
                            /*RouterModule,
                            HttpClientModule,
                            CommonModule,
                            AngularHalModule,*/
                            i1$2.TranslateModule.forRoot({
                                loader: {
                                    provide: i1$2.TranslateLoader,
                                    useFactory: (createTranslateLoader),
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
                            i1$2.TranslateModule
                        ]
                    }]
            }], null, null);
    })();

    /** Angular HAL module */
    var AngularHalModule = /** @class */ (function () {
        function AngularHalModule() {
        }
        AngularHalModule.forRoot = function () {
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
        return AngularHalModule;
    }());
    AngularHalModule.ɵmod = i0.ɵɵdefineNgModule({ type: AngularHalModule });
    AngularHalModule.ɵinj = i0.ɵɵdefineInjector({ factory: function AngularHalModule_Factory(t) { return new (t || AngularHalModule)(); }, providers: [
            ExternalService,
            i1.HttpClient,
            {
                provide: ResourceService,
                useClass: ResourceService,
                deps: [ExternalService]
            }
        ], imports: [[i1.HttpClientModule], i1.HttpClientModule] });
    (function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(AngularHalModule, { imports: [i1.HttpClientModule], exports: [i1.HttpClientModule] }); })();
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(AngularHalModule, [{
                type: i0.NgModule,
                args: [{
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
                    }]
            }], null, null);
    })();

    /*
     * Public API Surface of sitmun-plugin-core
     */

    /**
     * Generated bundle index. Do not edit.
     */

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
    exports.HasAnyAuthorityDirective = HasAnyAuthorityDirective;
    exports.HasAnyAuthorityOnTerritoryDirective = HasAnyAuthorityOnTerritoryDirective;
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

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=sitmun-frontend-core.umd.js.map
