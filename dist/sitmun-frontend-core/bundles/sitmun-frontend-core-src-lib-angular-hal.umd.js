(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common/http'), require('rxjs'), require('rxjs/operators'), require('url'), require('util')) :
    typeof define === 'function' && define.amd ? define('@sitmun/frontend-core/src/lib/angular-hal', ['exports', '@angular/core', '@angular/common/http', 'rxjs', 'rxjs/operators', 'url', 'util'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global.sitmun = global.sitmun || {}, global.sitmun['frontend-core'] = global.sitmun['frontend-core'] || {}, global.sitmun['frontend-core'].src = global.sitmun['frontend-core'].src || {}, global.sitmun['frontend-core'].src.lib = global.sitmun['frontend-core'].src.lib || {}, global.sitmun['frontend-core'].src.lib['angular-hal'] = {}), global.ng.core, global.ng.common.http, global.rxjs, global.rxjs.operators, global.url, global.util));
}(this, (function (exports, i0, http, rxjs, operators, url, util) { 'use strict';

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
    ResourceHelper.headers = new http.HttpHeaders();
    /** Proxy URL */
    ResourceHelper.proxy_uri = null;
    /** Root URL */
    ResourceHelper.root_uri = null;
    /** HttpClient */
    ResourceHelper.http = null;

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
            var params = ResourceHelper.optionParams(new http.HttpParams(), options);
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
            var params = ResourceHelper.optionParams(new http.HttpParams(), options);
            var result = ResourceHelper.createEmptyResult(_embedded);
            this.setUrls(result);
            var observable = ResourceHelper.getHttp().get(uri, { headers: ResourceHelper.headers, params: params });
            return observable.pipe(operators.map(function (response) { return ResourceHelper.instantiateResourceCollection(type, response, result); }), operators.catchError(function (error) { return rxjs.throwError(error); }));
        };
        /** search a single resource from a given base path, query and options */
        ResourceService.prototype.searchSingle = function (type, query, resource, options) {
            var uri = this.getResourceUrl(resource).concat('/search/', query);
            var params = ResourceHelper.optionParams(new http.HttpParams(), options);
            var result = new type();
            this.setUrlsResource(result);
            var observable = ResourceHelper.getHttp().get(uri, { headers: ResourceHelper.headers, params: params });
            return observable.pipe(operators.map(function (response) { return ResourceHelper.instantiateResource(result, response); }), operators.catchError(function (error) { return rxjs.throwError(error); }));
        };
        /** search resources from a given base path, custom query and options */
        ResourceService.prototype.customQuery = function (type, query, resource, _embedded, options) {
            var uri = this.getResourceUrl(resource + query);
            var params = ResourceHelper.optionParams(new http.HttpParams(), options);
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
            var params = ResourceHelper.optionParams(new http.HttpParams(), options);
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

    /** Angular HAL module */
    var AngularHalModule = /** @class */ (function () {
        function AngularHalModule() {
        }
        AngularHalModule.forRoot = function () {
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
        return AngularHalModule;
    }());
    AngularHalModule.ɵmod = i0.ɵɵdefineNgModule({ type: AngularHalModule });
    AngularHalModule.ɵinj = i0.ɵɵdefineInjector({ factory: function AngularHalModule_Factory(t) { return new (t || AngularHalModule)(); }, providers: [
            ExternalService,
            http.HttpClient,
            {
                provide: ResourceService,
                useClass: ResourceService,
                deps: [ExternalService]
            }
        ], imports: [[http.HttpClientModule], http.HttpClientModule] });
    (function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(AngularHalModule, { imports: [http.HttpClientModule], exports: [http.HttpClientModule] }); })();
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(AngularHalModule, [{
                type: i0.NgModule,
                args: [{
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
                    }]
            }], null, null);
    })();

    /*
     * Public API Surface of angular-hal
     */

    /**
     * Generated bundle index. Do not edit.
     */

    exports.AngularHalModule = AngularHalModule;
    exports.ExternalService = ExternalService;
    exports.Resource = Resource;
    exports.ResourceArray = ResourceArray;
    exports.ResourceHelper = ResourceHelper;
    exports.ResourceService = ResourceService;
    exports.RestService = RestService;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=sitmun-frontend-core-src-lib-angular-hal.umd.js.map
