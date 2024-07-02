(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@ag-grid-community/all-modules'), require('@ngx-translate/core'), require('@angular/material/dialog'), require('@angular/forms'), require('@angular/common'), require('@angular/common/http'), require('@angular/platform-browser/animations'), require('@angular/router'), require('@angular/common/locales/ca'), require('@angular/common/locales/es'), require('@ag-grid-community/angular'), require('@angular/cdk/a11y'), require('@angular/cdk/drag-drop'), require('@angular/cdk/portal'), require('@angular/cdk/scrolling'), require('@angular/cdk/stepper'), require('@angular/cdk/table'), require('@angular/cdk/tree'), require('@angular/material/autocomplete'), require('@angular/material/badge'), require('@angular/material/bottom-sheet'), require('@angular/material/button'), require('@angular/material/button-toggle'), require('@angular/material/card'), require('@angular/material/checkbox'), require('@angular/material/chips'), require('@angular/material/stepper'), require('@angular/material/datepicker'), require('@angular/material/divider'), require('@angular/material/expansion'), require('@angular/material/grid-list'), require('@angular/material/icon'), require('@angular/material/input'), require('@angular/material/list'), require('@angular/material/menu'), require('@angular/material/core'), require('@angular/material/paginator'), require('@angular/material/progress-bar'), require('@angular/material/progress-spinner'), require('@angular/material/radio'), require('@angular/material/select'), require('@angular/material/sidenav'), require('@angular/material/slider'), require('@angular/material/slide-toggle'), require('@angular/material/snack-bar'), require('@angular/material/sort'), require('@angular/material/table'), require('@angular/material/tabs'), require('@angular/material/toolbar'), require('@angular/material/tooltip'), require('@angular/material/tree'), require('@angular/material/form-field'), require('@ngx-translate/http-loader'), require('rxjs'), require('@angular/cdk/collections'), require('@angular/platform-browser'), require('d3')) :
  typeof define === 'function' && define.amd ? define('@sitmun/frontend-gui', ['exports', '@angular/core', '@ag-grid-community/all-modules', '@ngx-translate/core', '@angular/material/dialog', '@angular/forms', '@angular/common', '@angular/common/http', '@angular/platform-browser/animations', '@angular/router', '@angular/common/locales/ca', '@angular/common/locales/es', '@ag-grid-community/angular', '@angular/cdk/a11y', '@angular/cdk/drag-drop', '@angular/cdk/portal', '@angular/cdk/scrolling', '@angular/cdk/stepper', '@angular/cdk/table', '@angular/cdk/tree', '@angular/material/autocomplete', '@angular/material/badge', '@angular/material/bottom-sheet', '@angular/material/button', '@angular/material/button-toggle', '@angular/material/card', '@angular/material/checkbox', '@angular/material/chips', '@angular/material/stepper', '@angular/material/datepicker', '@angular/material/divider', '@angular/material/expansion', '@angular/material/grid-list', '@angular/material/icon', '@angular/material/input', '@angular/material/list', '@angular/material/menu', '@angular/material/core', '@angular/material/paginator', '@angular/material/progress-bar', '@angular/material/progress-spinner', '@angular/material/radio', '@angular/material/select', '@angular/material/sidenav', '@angular/material/slider', '@angular/material/slide-toggle', '@angular/material/snack-bar', '@angular/material/sort', '@angular/material/table', '@angular/material/tabs', '@angular/material/toolbar', '@angular/material/tooltip', '@angular/material/tree', '@angular/material/form-field', '@ngx-translate/http-loader', 'rxjs', '@angular/cdk/collections', '@angular/platform-browser', 'd3'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global.sitmun = global.sitmun || {}, global.sitmun["frontend-gui"] = {}), global.ng.core, global.allModules, global.core$1, global.ng.material.dialog, global.ng.forms, global.ng.common, global.ng.common.http, global.ng.platformBrowser.animations, global.ng.router, global.ng.common.locales.ca, global.ng.common.locales.es, global.angular, global.ng.cdk.a11y, global.ng.cdk.dragDrop, global.ng.cdk.portal, global.ng.cdk.scrolling, global.ng.cdk.stepper, global.ng.cdk.table, global.ng.cdk.tree, global.ng.material.autocomplete, global.ng.material.badge, global.ng.material.bottomSheet, global.ng.material.button, global.ng.material.buttonToggle, global.ng.material.card, global.ng.material.checkbox, global.ng.material.chips, global.ng.material.stepper, global.ng.material.datepicker, global.ng.material.divider, global.ng.material.expansion, global.ng.material.gridList, global.ng.material.icon, global.ng.material.input, global.ng.material.list, global.ng.material.menu, global.ng.material.core, global.ng.material.paginator, global.ng.material.progressBar, global.ng.material.progressSpinner, global.ng.material.radio, global.ng.material.select, global.ng.material.sidenav, global.ng.material.slider, global.ng.material.slideToggle, global.ng.material.snackBar, global.ng.material.sort, global.ng.material.table, global.ng.material.tabs, global.ng.material.toolbar, global.ng.material.tooltip, global.ng.material.tree, global.ng.material.formField, global.httpLoader, global.rxjs, global.ng.cdk.collections, global.ng.platformBrowser, global.d3));
})(this, (function (exports, core, allModules, core$1, dialog, forms, common, http, animations, router, localeCa, localeEs, angular, a11y, dragDrop, portal, scrolling, stepper, table, tree, autocomplete, badge, bottomSheet, button, buttonToggle, card, checkbox, chips, stepper$1, datepicker, divider, expansion, gridList, icon, input, list, menu, core$2, paginator, progressBar, progressSpinner, radio, select, sidenav, slider, slideToggle, snackBar, sort, table$1, tabs, toolbar, tooltip, tree$1, formField, httpLoader, rxjs, collections, platformBrowser, d3) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
      Object.keys(e).forEach(function (k) {
        if (k !== 'default') {
          var d = Object.getOwnPropertyDescriptor(e, k);
          Object.defineProperty(n, k, d.get ? d : {
            enumerable: true,
            get: function () { return e[k]; }
          });
        }
      });
    }
    n["default"] = e;
    return Object.freeze(n);
  }

  var localeCa__default = /*#__PURE__*/_interopDefaultLegacy(localeCa);
  var localeEs__default = /*#__PURE__*/_interopDefaultLegacy(localeEs);
  var d3__namespace = /*#__PURE__*/_interopNamespace(d3);

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

  var BtnEditRenderedComponent = /** @class */ (function () {
      function BtnEditRenderedComponent() {
      }
      BtnEditRenderedComponent.prototype.agInit = function (params) {
          this.params = params;
      };
      BtnEditRenderedComponent.prototype.refresh = function (params) {
          return true;
      };
      BtnEditRenderedComponent.prototype.btnClickedHandler = function ($event) {
          this.params.clicked(this.params.value);
      };
      BtnEditRenderedComponent.prototype.getParams = function () {
          return this.params;
      };
      BtnEditRenderedComponent.prototype.ngOnDestroy = function () {
          // no need to remove the button click handler 
      };
      return BtnEditRenderedComponent;
  }());
  BtnEditRenderedComponent.decorators = [
      { type: core.Component, args: [{
                  selector: 'app-btn-edit-rendered',
                  template: "<button mat-mini-fab class=\"buttonEdit\"  type=\"button\"  (click)=\"btnClickedHandler($event)\" >\r\n  <mat-icon class=\"iconEdit\"   fontSet=\"material-icons-round\" > edit </mat-icon>\r\n</button> ",
                  styles: [".buttonEdit{color:#000;background-color:#ddd;width:20px;margin-top:3px;height:20px;box-shadow:none}.iconEdit{font-size:13px;margin-top:-10px;margin-left:-2px}"]
              },] }
  ];

  var BtnCheckboxRenderedComponent = /** @class */ (function () {
      function BtnCheckboxRenderedComponent() {
      }
      BtnCheckboxRenderedComponent.prototype.agInit = function (params) {
          this.params = params;
      };
      BtnCheckboxRenderedComponent.prototype.refresh = function (params) {
          this.params = params;
          return true;
      };
      BtnCheckboxRenderedComponent.prototype.invokeParentMethod = function () {
          this.params.context.componentParent.methodFromParent("Row: " + this.params.node.rowIndex + ", Col: " + this.params.colDef.headerName);
      };
      BtnCheckboxRenderedComponent.prototype.btnCheckedHandler = function (event) {
          if (this.params.colDef.editable) {
              var checked = !event.target.firstElementChild.checked;
              var colId = this.params.column.colId;
              this.params.value = checked;
              this.params.api.undoRedoService.isFilling = true;
              this.params.node.setDataValue(colId, checked);
          }
          else {
              event.preventDefault();
          }
      };
      BtnCheckboxRenderedComponent.prototype.getParams = function () {
          return this.params;
      };
      BtnCheckboxRenderedComponent.prototype.ngOnDestroy = function () {
          // no need to remove the button click handler 
      };
      return BtnCheckboxRenderedComponent;
  }());
  BtnCheckboxRenderedComponent.decorators = [
      { type: core.Component, args: [{
                  selector: 'app-btn-checkbox-rendered',
                  template: "<mat-checkbox (click)=\"btnCheckedHandler($event)\" [value]=\"params.value\" [checked]=\"params.value\"> </mat-checkbox>",
                  styles: [""]
              },] }
  ];

  var BtnCheckboxFilterComponent = /** @class */ (function () {
      function BtnCheckboxFilterComponent() {
          this.text = '';
      }
      BtnCheckboxFilterComponent.prototype.agInit = function (params) {
          this.params = params;
          this.valueGetter = params.filterParams.valueGetter;
          this.params.suppressFilterButton = true;
      };
      BtnCheckboxFilterComponent.prototype.isFilterActive = function () {
          return this.text != null && this.text !== '';
      };
      BtnCheckboxFilterComponent.prototype.doesFilterPass = function (params) {
          var _this = this;
          return this.text
              .toLowerCase()
              .split(' ')
              .every(function (filterWord) { return _this.valueGetter(params.node)
              .toString()
              .toLowerCase()
              .indexOf(filterWord) >= 0; });
      };
      BtnCheckboxFilterComponent.prototype.getModel = function () {
          return { value: this.text };
      };
      BtnCheckboxFilterComponent.prototype.setModel = function (model) {
          this.text = model ? model.value : '';
      };
      BtnCheckboxFilterComponent.prototype.onChange = function (newValue) {
          this.params.parentFilterInstance(function (instance) {
              instance.onFloatingFilterChanged('contains', newValue);
          });
      };
      BtnCheckboxFilterComponent.prototype.onParentModelChanged = function (parentModel) {
          if (!parentModel) {
              this.currentValue = 0;
          }
          else {
              // note that the filter could be anything here, but our purposes we're assuming a greater than filter only,
              // so just read off the value and use that
              this.currentValue = parentModel.filter;
          }
      };
      return BtnCheckboxFilterComponent;
  }());
  BtnCheckboxFilterComponent.decorators = [
      { type: core.Component, args: [{
                  selector: 'app-btn-checkbox-filter',
                  template: "<select  #filterSelect  (change)='onChange(filterSelect.value)'>\r\n    <option value=\"\">{{\"selectAll\" | translate}}</option>\r\n    <option value=\"true\">{{\"enabled\" | translate}}</option>\r\n    <option value=\"false\">{{\"disabled\" | translate}}</option>\r\n  </select>",
                  host: { 'class': 'hostClass' },
                  styles: [".hostClass{width:100%}"]
              },] }
  ];
  BtnCheckboxFilterComponent.propDecorators = {
      input: [{ type: core.ViewChild, args: ['input', { read: core.ViewContainerRef },] }]
  };

  var DialogMessageComponent = /** @class */ (function () {
      function DialogMessageComponent(dialogRef) {
          this.dialogRef = dialogRef;
          this.hideCancelButton = false;
      }
      DialogMessageComponent.prototype.ngOnInit = function () {
      };
      DialogMessageComponent.prototype.doAccept = function () {
          this.dialogRef.close({ event: 'Accept' });
      };
      DialogMessageComponent.prototype.closeDialog = function () {
          this.dialogRef.close({ event: 'Cancel' });
      };
      return DialogMessageComponent;
  }());
  DialogMessageComponent.decorators = [
      { type: core.Component, args: [{
                  selector: 'app-dialog-message',
                  template: "<h5 mat-dialog-title class=\"titleDialog\">{{title}}</h5>\r\n<mat-dialog-content class=\"mat-typography\">\r\n  <p>\r\n    {{message}}\r\n  </p>\r\n</mat-dialog-content>\r\n<mat-dialog-actions align=\"end\">\r\n  <button mat-flat-button class=\"returnButton\"  *ngIf=\"!hideCancelButton\" (click)=\"closeDialog()\">{{\"cancel\" | translate}}</button>\r\n  <button mat-flat-button class=\"saveButton\"  (click)=\"doAccept()\" cdkFocusInitial>{{\"accept\" | translate}}</button>\r\n</mat-dialog-actions>",
                  styles: [".titleDialog{margin-top:inherit!important;margin-bottom:15px!important}"]
              },] }
  ];
  /** @nocollapse */
  DialogMessageComponent.ctorParameters = function () { return [
      { type: dialog.MatDialogRef }
  ]; };

  var DataGridComponent = /** @class */ (function () {
      function DataGridComponent(dialog, translate, elRef) {
          var _this = this;
          this.dialog = dialog;
          this.translate = translate;
          this.elRef = elRef;
          this.modules = allModules.AllCommunityModules;
          this.statusColumn = false;
          this.someColumnIsEditable = false;
          this.changesMap = new Map();
          this.modificationChange = false;
          this.undoNoChanges = false; // Boolean that indicates if an undo hasn't modifications
          this.someStatusHasChangedToDelete = false;
          this.currentData = null;
          this.translate = translate;
          this.frameworkComponents = {
              btnEditRendererComponent: BtnEditRenderedComponent,
              btnCheckboxRendererComponent: BtnCheckboxRenderedComponent,
              btnCheckboxFilterComponent: BtnCheckboxFilterComponent
          };
          this.components = {
              datePicker: this.getDatePicker()
          };
          this.remove = new core.EventEmitter();
          this.new = new core.EventEmitter();
          this.add = new core.EventEmitter();
          this.discardChanges = new core.EventEmitter();
          this.sendChanges = new core.EventEmitter();
          this.getSelectedRows = new core.EventEmitter();
          this.duplicate = new core.EventEmitter();
          this.getAllRows = new core.EventEmitter();
          this.gridModified = new core.EventEmitter();
          this.changeCounter = 0;
          this.previousChangeCounter = 0;
          this.redoCounter = 0;
          this.gridOptions = {
              defaultColDef: {
                  sortable: true,
                  flex: 1,
                  filter: true,
                  editable: !this.nonEditable,
                  suppressMenu: true,
                  resizable: true,
                  cellStyle: function (params) {
                      if (params.value && params.colDef.editable) {
                          if (_this.changesMap.has(params.node.id) && _this.changesMap.get(params.node.id).has(params.colDef.field)) {
                              return { 'background-color': '#E8F1DE' };
                          }
                          else {
                              return { 'background-color': 'white' };
                          }
                      }
                      else {
                          return { 'background-color': 'white' };
                      }
                  },
              },
              rowSelection: 'multiple',
              singleClickEdit: true,
              // suppressHorizontalScroll: true,
              localeTextFunc: function (key, defaultValue) {
                  var data = _this.translate.instant(key);
                  return data === key ? defaultValue : data;
              }
          };
      }
      DataGridComponent.prototype.ngOnInit = function () {
          var _this = this;
          if (this.eventRefreshSubscription) {
              this._eventRefreshSubscription = this.eventRefreshSubscription.subscribe(function () {
                  _this.changesMap.clear();
                  _this.someStatusHasChangedToDelete = false;
                  _this.changeCounter = 0;
                  _this.previousChangeCounter = 0;
                  _this.redoCounter = 0;
                  _this.getElements();
              });
          }
          if (this.eventGetSelectedRowsSubscription) {
              this._eventGetSelectedRowsSubscription = this.eventGetSelectedRowsSubscription.subscribe(function () {
                  _this.emitSelectedRows();
              });
          }
          if (this.eventGetAllRowsSubscription) {
              this._eventGetAllRowsSubscription = this.eventGetAllRowsSubscription.subscribe(function (event) {
                  _this.emitAllRows(event);
              });
          }
          if (this.eventSaveAgGridStateSubscription) {
              this._eventSaveAgGridStateSubscription = this.eventSaveAgGridStateSubscription.subscribe(function () {
                  _this.saveAgGridState();
              });
          }
          if (this.eventModifyStatusOfSelectedCells) {
              this._eventModifyStatusOfSelectedCells = this.eventModifyStatusOfSelectedCells.subscribe(function (status) {
                  _this.modifyStatusSelected(status);
              });
          }
          if (this.eventAddItemsSubscription) {
              this.eventAddItemsSubscription.subscribe(function (items) {
                  _this.addItems(items);
              });
          }
      };
      DataGridComponent.prototype.firstDataRendered = function () {
          if (localStorage.agGridState != undefined) {
              var agGridState = JSON.parse(localStorage.agGridState);
              if (agGridState.idAgGrid != undefined && agGridState.idAgGrid == this.id) {
                  this.gridApi.setFilterModel(agGridState.filterState);
                  this.gridColumnApi.setColumnState(agGridState.colState);
                  this.gridApi.setSortModel(agGridState.sortState);
                  this.searchValue = agGridState.valueSearchGeneric;
                  this.quickSearch();
                  this.removeAgGridState();
              }
              else if (this.id != undefined) {
                  this.removeAgGridState();
              }
          }
      };
      DataGridComponent.prototype.onGridReady = function (params) {
          var e_1, _a;
          if (this.singleSelection) {
              this.gridOptions.rowSelection = 'single';
          }
          // if (this.nonEditable) {this.gridOptions.defaultColDef.editable = false}
          this.params = params;
          this.gridApi = params.api;
          this.gridColumnApi = params.columnApi;
          try {
              for (var _b = __values(this.columnDefs), _c = _b.next(); !_c.done; _c = _b.next()) {
                  var col = _c.value;
                  if (!this.someColumnIsEditable && col.editable) {
                      this.someColumnIsEditable = true;
                  }
                  if (col.field === 'status') {
                      this.statusColumn = true;
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
          this.getElements();
          console.log(this.columnDefs);
          if (this.defaultColumnSorting) {
              if (!Array.isArray(this.defaultColumnSorting)) {
                  var sortModel = [
                      { colId: this.defaultColumnSorting, sort: 'asc' }
                  ];
                  this.gridApi.setSortModel(sortModel);
              }
              else {
                  var sortModel_1 = [];
                  this.defaultColumnSorting.forEach(function (element) {
                      sortModel_1.push({ colId: element, sort: 'asc' });
                  });
                  this.gridApi.setSortModel(sortModel_1);
              }
          }
          if (this.defaultHeight != null && this.defaultHeight != undefined) {
              this.changeHeight(this.defaultHeight);
          }
      };
      DataGridComponent.prototype.getDatePicker = function () {
          function Datepicker() { }
          Datepicker.prototype.init = function (params) {
              this.eInput = document.createElement('input');
              this.eInput.value = params.value;
              this.eInput.classList.add('ag-input');
              this.eInput.style.height = '100%';
              $(this.eInput).datepicker({ dateFormat: 'mm/dd/yy' });
          };
          Datepicker.prototype.getGui = function () {
              return this.eInput;
          };
          Datepicker.prototype.afterGuiAttached = function () {
              this.eInput.focus();
              this.eInput.select();
          };
          Datepicker.prototype.getValue = function () {
              return this.eInput.value;
          };
          Datepicker.prototype.destroy = function () { };
          Datepicker.prototype.isPopup = function () {
              return false;
          };
          return Datepicker;
      };
      DataGridComponent.prototype.areRowsSelected = function () {
          return (this.gridApi != null && this.gridApi.getSelectedNodes().length > 0) ? true : false;
          // if (this.gridApi != null && this.gridApi.getSelectedNodes().length > 0) {
          //   return true
          // } else {
          //   return false
          // }
      };
      DataGridComponent.prototype.emitSelectedRows = function () {
          var selectedNodes = this.gridApi.getSelectedNodes();
          var selectedData = selectedNodes.map(function (node) { return node.data; });
          this.getSelectedRows.emit(selectedData);
      };
      DataGridComponent.prototype.emitAllRows = function (event) {
          // let rowData = [];
          // this.gridApi.forEachNode(node => rowData.push(node.data));
          this.getAllRows.emit({ data: this.getAllCurrentData(), event: event });
      };
      DataGridComponent.prototype.getAllCurrentData = function () {
          var rowData = [];
          this.gridApi.forEachNode(function (node) { return rowData.push(node.data); });
          return rowData;
      };
      DataGridComponent.prototype.modifyStatusSelected = function (status) {
          var newStatus = status ? status : this.newStatusRegister;
          var selectedNodes = this.gridApi.getSelectedNodes();
          selectedNodes.map(function (node) {
              node.data.status = newStatus;
              node.selected = false;
          });
          this.gridApi.redrawRows();
      };
      DataGridComponent.prototype.saveAgGridState = function () {
          var agGridState = {
              idAgGrid: this.id,
              colState: this.gridColumnApi.getColumnState(),
              filterState: this.gridApi.getFilterModel(),
              sortState: this.gridApi.getSortModel(),
              valueSearchGeneric: this.searchValue
          };
          localStorage.setItem("agGridState", JSON.stringify(agGridState));
      };
      DataGridComponent.prototype.removeAgGridState = function () {
          localStorage.removeItem("agGridState");
      };
      DataGridComponent.prototype.getColumnKeysAndHeaders = function (columnkeys) {
          var header = [];
          if (this.columnDefs.length == 0) {
              return '';
          }
          ;
          var allColumnKeys = this.gridOptions.columnApi.getAllDisplayedColumns();
          // console.log(allColumnKeys);
          allColumnKeys.forEach(function (element) {
              if (element.userProvidedColDef.headerName !== '') {
                  columnkeys.push(element.userProvidedColDef.field);
                  header.push(element.userProvidedColDef.headerName);
              }
          });
          return header.join(",");
      };
      DataGridComponent.prototype.exportData = function () {
          var columnkeys = [];
          var customHeader = '';
          customHeader = this.getColumnKeysAndHeaders(columnkeys);
          var params = {
              onlySelected: true,
              columnKeys: columnkeys,
              customHeader: customHeader,
              skipHeader: true
          };
          this.gridApi.exportDataAsCsv(params);
      };
      DataGridComponent.prototype.quickSearch = function () {
          this.gridApi.setQuickFilter(this.searchValue);
      };
      DataGridComponent.prototype.getElements = function () {
          var _this = this;
          this.getAll()
              .subscribe(function (items) {
              var status = _this.allNewElements ? 'pendingCreation' : 'statusOK';
              var newItems = [];
              var condition = (_this.addFieldRestriction) ? _this.addFieldRestriction : 'id';
              items.forEach(function (element) {
                  if (_this.statusColumn) {
                      if (element.status != "notAvailable" && element.status != "pendingCreation" && element.status != "pendingRegistration" && element.status != "unregisteredLayer") {
                          element.status = status;
                      }
                      if (_this.allNewElements) {
                          element.new = true;
                      }
                  }
                  if (_this.currentData) {
                      if (_this.checkElementAllowedToAdd(condition, element, _this.currentData)) {
                          newItems.push(element);
                      }
                  }
              });
              // if(this.statusColumn){
              //   let status = this.allNewElements?'pendingCreation':'statusOK'
              //   items.forEach(element => {
              //     if(element.status != "notAvailable" && element.status != "pendingCreation" && element.status != "pendingRegistration" && element.status != "unregisteredLayer"){
              //       element.status=status
              //     }
              //     if(this.allNewElements) { element.new = true; }
              //   });
              // }
              _this.rowData = _this.currentData ? newItems : items;
              _this.gridApi.setRowData(_this.rowData);
              _this.setSize();
              // this.gridApi.sizeColumnsToFit()
              console.log(_this.rowData);
          });
      };
      DataGridComponent.prototype.setSize = function () {
          var allColumnIds = [];
          var columns = this.gridOptions.columnApi.getAllColumns();
          columns.forEach(function (column) {
              allColumnIds.push(column.colId);
          });
          this.gridOptions.columnApi.autoSizeColumns(allColumnIds);
          var grid = this.gridOptions.api;
          var availableWidth = grid.gridPanel.eBodyViewport.clientWidth;
          var usedWidth = grid.gridPanel.columnController.getWidthOfColsInList(columns);
          if (usedWidth < availableWidth) {
              grid.sizeColumnsToFit();
          }
      };
      DataGridComponent.prototype.addItems = function (newItems) {
          var _this = this;
          console.log(newItems);
          var itemsToAdd = [];
          var condition = (this.addFieldRestriction) ? this.addFieldRestriction : 'id';
          newItems.forEach(function (item) {
              if (_this.checkElementAllowedToAdd(condition, item, _this.rowData)) {
                  if (_this.statusColumn) {
                      item.status = 'pendingCreation';
                      item.newItem = true;
                  }
                  itemsToAdd.push(item);
                  _this.rowData.push(item);
              }
              else {
                  console.log("Item already exists");
              }
          });
          this.gridApi.updateRowData({ add: itemsToAdd });
          console.log(this.columnDefs);
          // params.oldValue!=undefined
      };
      DataGridComponent.prototype.checkElementAllowedToAdd = function (condition, item, data) {
          var e_2, _a, e_3, _b;
          var _this = this;
          var finalAddition = true;
          if (Array.isArray(condition)) {
              try {
                  for (var data_1 = __values(data), data_1_1 = data_1.next(); !data_1_1.done; data_1_1 = data_1.next()) {
                      var element = data_1_1.value;
                      var canAdd = false;
                      try {
                          for (var condition_1 = (e_3 = void 0, __values(condition)), condition_1_1 = condition_1.next(); !condition_1_1.done; condition_1_1 = condition_1.next()) {
                              var currentCondition = condition_1_1.value;
                              if (element[currentCondition] != item[currentCondition]) {
                                  canAdd = true;
                                  break;
                              }
                          }
                      }
                      catch (e_3_1) { e_3 = { error: e_3_1 }; }
                      finally {
                          try {
                              if (condition_1_1 && !condition_1_1.done && (_b = condition_1.return)) _b.call(condition_1);
                          }
                          finally { if (e_3) throw e_3.error; }
                      }
                      if (!canAdd) {
                          finalAddition = false;
                          break;
                      }
                  }
              }
              catch (e_2_1) { e_2 = { error: e_2_1 }; }
              finally {
                  try {
                      if (data_1_1 && !data_1_1.done && (_a = data_1.return)) _a.call(data_1);
                  }
                  finally { if (e_2) throw e_2.error; }
              }
              return finalAddition;
          }
          else {
              if (this.fieldRestrictionWithDifferentName) {
                  return (item[condition] == undefined || (data.find(function (element) { return element[_this.fieldRestrictionWithDifferentName] == item[condition]; })) == undefined);
              }
              return (item[condition] == undefined || (data.find(function (element) { return element[condition] == item[condition]; })) == undefined);
          }
      };
      DataGridComponent.prototype.changeHeight = function (value) {
          var pixels = "";
          if (value === '5') {
              pixels = "200px";
          }
          else if (value === '10') {
              pixels = "315px";
          }
          else if (value === '20') {
              pixels = "630px";
          }
          else {
              pixels = "1550px";
          }
          this.elRef.nativeElement.parentElement.style.height = pixels;
      };
      DataGridComponent.prototype.removeData = function () {
          var e_4, _a;
          this.gridApi.stopEditing(false);
          var selectedNodes = this.gridApi.getSelectedNodes();
          var selectedData = selectedNodes.map(function (node) { return node.data; });
          this.remove.emit(selectedData);
          if (this.statusColumn) {
              var selectedRows = selectedNodes.map(function (node) { return node.id; });
              if (selectedRows.length > 0) {
                  this.someStatusHasChangedToDelete = true;
              }
              try {
                  for (var selectedRows_1 = __values(selectedRows), selectedRows_1_1 = selectedRows_1.next(); !selectedRows_1_1.done; selectedRows_1_1 = selectedRows_1.next()) {
                      var id = selectedRows_1_1.value;
                      this.gridApi.getRowNode(id).data.status = 'pendingDelete';
                  }
              }
              catch (e_4_1) { e_4 = { error: e_4_1 }; }
              finally {
                  try {
                      if (selectedRows_1_1 && !selectedRows_1_1.done && (_a = selectedRows_1.return)) _a.call(selectedRows_1);
                  }
                  finally { if (e_4) throw e_4.error; }
              }
              this.gridOptions.api.refreshCells();
          }
          this.gridOptions.api.deselectAll();
      };
      DataGridComponent.prototype.newData = function () {
          this.gridApi.stopEditing(false);
          this.new.emit(-1);
      };
      DataGridComponent.prototype.onAddButtonClicked = function () {
          this.gridApi.stopEditing(false);
          this.add.emit(this.getAllCurrentData());
      };
      DataGridComponent.prototype.onDuplicateButtonClicked = function () {
          var _this = this;
          this.gridApi.stopEditing(false);
          if (this.changeCounter > 0) {
              var dialogRef = this.dialog.open(DialogMessageComponent);
              dialogRef.componentInstance.title = this.translate.instant('caution');
              dialogRef.componentInstance.message = this.translate.instant('duplicateMessage');
              dialogRef.afterClosed().subscribe(function (result) {
                  if (result) {
                      if (result.event === 'Accept') {
                          var selectedNodes = _this.gridApi.getSelectedNodes();
                          var selectedData = selectedNodes.map(function (node) { return node.data; });
                          _this.duplicate.emit(selectedData);
                      }
                  }
              });
          }
          else {
              var selectedNodes = this.gridApi.getSelectedNodes();
              var selectedData = selectedNodes.map(function (node) { return node.data; });
              this.duplicate.emit(selectedData);
              this.gridOptions.api.deselectAll();
          }
      };
      DataGridComponent.prototype.applyChanges = function () {
          var e_5, _a;
          var itemsChanged = [];
          this.gridApi.stopEditing(false);
          try {
              for (var _b = __values(this.changesMap.keys()), _c = _b.next(); !_c.done; _c = _b.next()) {
                  var key = _c.value;
                  itemsChanged.push(this.gridApi.getRowNode(key).data);
              }
          }
          catch (e_5_1) { e_5 = { error: e_5_1 }; }
          finally {
              try {
                  if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
              }
              finally { if (e_5) throw e_5.error; }
          }
          this.sendChanges.emit(itemsChanged);
          this.gridModified.emit(false);
          this.changesMap.clear();
          this.changeCounter = 0;
          this.previousChangeCounter = 0;
          this.redoCounter = 0;
          this.someStatusHasChangedToDelete = false;
          // this.params.colDef.cellStyle = { backgroundColor: '#FFFFFF' };
          this.gridApi.redrawRows();
      };
      DataGridComponent.prototype.deleteChanges = function () {
          this.gridApi.stopEditing(false);
          var newElementsActived = this.allNewElements;
          while (this.changeCounter > 0) {
              this.undo();
          }
          this.changesMap.clear();
          //this.previousChangeCounter = 0;
          this.redoCounter = 0;
          if (this.statusColumn && !this.discardNonReverseStatus) {
              var rowsWithStatusModified_1 = [];
              this.gridApi.forEachNode(function (node) {
                  if (node.data.status === 'pendingModify' || node.data.status === 'pendingDelete') {
                      if (node.data.status === 'pendingDelete') {
                          rowsWithStatusModified_1.push(node.data);
                      }
                      if (node.data.newItem || newElementsActived) {
                          node.data.status = 'pendingCreation';
                      }
                      else {
                          node.data.status = 'statusOK';
                      }
                  }
              });
              this.someStatusHasChangedToDelete = false;
              this.discardChanges.emit(rowsWithStatusModified_1);
              this.gridModified.emit(false);
          }
          this.gridApi.redrawRows();
          //this.params.colDef.cellStyle =  {backgroundColor: '#FFFFFF'};
          //this.gridApi.redrawRows();
      };
      DataGridComponent.prototype.onFilterModified = function () {
          this.deleteChanges();
      };
      DataGridComponent.prototype.undo = function () {
          this.gridApi.stopEditing(false);
          this.gridApi.undoCellEditing();
          this.changeCounter -= 1;
          if (this.changeCounter == 0) {
              this.gridModified.emit(false);
          }
          this.redoCounter += 1;
      };
      DataGridComponent.prototype.redo = function () {
          this.gridApi.stopEditing(false);
          this.gridApi.redoCellEditing();
          this.changeCounter += 1;
          this.redoCounter -= 1;
      };
      DataGridComponent.prototype.onCellEditingStopped = function (e) {
          if (this.modificationChange) {
              this.changeCounter++;
              if (this.changeCounter == 1) {
                  this.gridModified.emit(true);
              }
              this.redoCounter = 0;
              this.onCellValueChanged(e);
              this.modificationChange = false;
          }
      };
      DataGridComponent.prototype.onCellValueChanged = function (params) {
          this.params = params;
          if (this.changeCounter > this.previousChangeCounter) 
          // True if we have edited some cell or we have done a redo 
          {
              if (params.oldValue !== params.value && !(params.oldValue == null && params.value === '')) {
                  if (!this.changesMap.has(params.node.id)) // If it's firts edit of a cell, we add it to the map and we paint it
                   {
                      var addMap = new Map();
                      addMap.set(params.colDef.field, 1);
                      this.changesMap.set(params.node.id, addMap);
                      if (this.statusColumn) {
                          // if (this.gridApi.getRowNode(params.node.id).data.status !== 'pendingCreation') {
                          this.gridApi.getRowNode(params.node.id).data.status = 'pendingModify';
                          // }
                      }
                  }
                  else {
                      if (!this.changesMap.get(params.node.id).has(params.colDef.field)) {
                          this.changesMap.get(params.node.id).set(params.colDef.field, 1);
                      }
                      else {
                          // We already had edited this cell, so we only increment number of changes of it on the map 
                          var currentChanges = this.changesMap.get(params.node.id).get(params.colDef.field);
                          this.changesMap.get(params.node.id).set(params.colDef.field, (currentChanges + 1));
                      }
                  }
                  this.paintCells(params, this.changesMap); //We paint the row of the edited cell 
                  this.previousChangeCounter++; //We match the current previousChangeCounter with changeCounter
              }
          }
          else if (this.changeCounter < this.previousChangeCounter) { // True if we have done an undo
              var currentChanges = -1;
              if (this.changesMap.has(params.node.id)) {
                  currentChanges = this.changesMap.get(params.node.id).get(params.colDef.field);
              }
              if (currentChanges === 1) { //Once the undo it's done, cell is in his initial status
                  this.changesMap.get(params.node.id).delete(params.colDef.field);
                  if (this.changesMap.get(params.node.id).size === 0) { // No more modifications in this row
                      this.changesMap.delete(params.node.id);
                      var row = this.gridApi.getDisplayedRowAtIndex(params.rowIndex);
                      if (this.statusColumn) {
                          if (this.gridApi.getRowNode(params.node.id).data.status !== 'pendingCreation') {
                              this.gridApi.getRowNode(params.node.id).data.status = 'statusOK';
                          }
                      }
                      ;
                      // We paint it white
                      this.gridApi.redrawRows({ rowNodes: [row] });
                  }
                  else {
                      this.paintCells(params, this.changesMap);
                  }
              }
              else if (currentChanges > 1) // The cell isn't in his initial state yet
               { //We can't do else because we can be doing an undo without changes 
                  this.changesMap.get(params.node.id).set(params.colDef.field, (currentChanges - 1));
                  this.paintCells(params, this.changesMap); //Not initial state -> green background
              }
              this.previousChangeCounter--; //We decrement previousChangeCounter because we have done undo
          }
          else { // Control of modifications without changes
              if (!(params.oldValue == null && params.value === '')) {
                  var newValue = void 0;
                  if (params.value == null) {
                      newValue = '';
                  }
                  else {
                      newValue = params.value.toString();
                  }
                  if ((params.oldValue != undefined && params.oldValue != null && params.oldValue.toString() !== newValue.toString())
                      || ((params.oldValue == undefined || params.oldValue == null) && newValue != null)) {
                      this.modificationChange = true;
                      if (params.colDef.cellRenderer == "btnCheckboxRendererComponent") {
                          var undoRedoActions = {
                              cellValueChanges: this.gridApi.undoRedoService.cellValueChanges
                          };
                          this.gridApi.undoRedoService.pushActionsToUndoStack(undoRedoActions);
                          this.gridApi.undoRedoService.isFilling = false;
                          this.onCellEditingStopped(params);
                      }
                  }
                  else {
                      this.modificationWithoutChanges(params);
                  }
              }
              else {
                  this.modificationWithoutChanges(params);
              }
          }
      };
      DataGridComponent.prototype.modificationWithoutChanges = function (params) {
          if (this.changesMap.has(params.node.id)) //Modification without changes in en edited cell
           {
              if (!this.undoNoChanges) {
                  this.gridApi.undoCellEditing(); // Undo to delete the change without changes internally 
                  this.undoNoChanges = true;
                  this.paintCells(params, this.changesMap); //The cell has modifications yet -> green background 
              }
              else {
                  this.undoNoChanges = false;
              }
          }
          else {
              //With the internally undo will enter at this function, so we have to control when done the undo or not 
              if (!this.undoNoChanges) {
                  this.gridApi.undoCellEditing(); // Undo to delete the change internally
                  this.undoNoChanges = true;
              }
              else {
                  this.undoNoChanges = false;
              }
          }
      };
      DataGridComponent.prototype.getColumnIndexByColId = function (api, colId) {
          return api.getAllColumns().findIndex(function (col) { return col.getColId() === colId; });
      };
      DataGridComponent.prototype.paintCells = function (params, changesMap) {
          var row = this.gridApi.getDisplayedRowAtIndex(params.rowIndex);
          // this.changeCellStyleColumns(params, changesMap, '#E8F1DE');
          this.gridApi.redrawRows({ rowNodes: [row] });
          // this.changeCellStyleColumns(params, changesMap, '#FFFFFF');
          // We will define cellStyle white to future modifications (like filter)
      };
      return DataGridComponent;
  }());
  DataGridComponent.decorators = [
      { type: core.Component, args: [{
                  selector: 'app-data-grid',
                  template: "<div id=grup1 class=\"editDivBtns\">\r\n    <span *ngIf=\"title\" [translate]=\"title\"> </span>\r\n    <button type=\"button\" title=\"{{ 'cancel' | translate }}\" mat-mini-fab class=\"mini-fab mat-red\" *ngIf=\"discardChangesButton\"\r\n        id=\"deleteChangesButton\" type=\"button\" (click)=\"deleteChanges()\" [disabled]=\"changeCounter <= 0 && (!someStatusHasChangedToDelete || discardNonReverseStatus  )\">\r\n        <mat-icon fontSet=\"material-icons-round\"> close </mat-icon>\r\n    </button>\r\n    <button type=\"button\" title=\"{{ 'undo' | translate }}\" mat-mini-fab class=\"mini-fab mat-orange\" *ngIf=\"undoButton && someColumnIsEditable\"\r\n        id=\"undo\" (click)=\"undo()\" [disabled]=\"changeCounter <= 0\">\r\n        <mat-icon fontSet=\"material-icons-round\"> undo </mat-icon>\r\n    </button>\r\n    <button type=\"button\" title=\"{{ 'redo' | translate }}\" mat-mini-fab class=\"mini-fab mat-orange\" *ngIf=\"redoButton && someColumnIsEditable\"\r\n        id=\"redo\" (click)=\"redo()\" [disabled]=\"redoCounter <= 0\">\r\n        <mat-icon fontSet=\"material-icons-round\"> redo </mat-icon>\r\n    </button>\r\n    <button type=\"button\" title=\"{{ 'accept' | translate }}\" mat-mini-fab class=\"mini-fab mat-green\"\r\n        *ngIf=\"applyChangesButton\" id=\"applyChangesButton\" (click)=\"applyChanges()\" [disabled]=\"changeCounter <= 0\">\r\n        <mat-icon fontSet=\"material-icons-round\"> check </mat-icon>\r\n    </button>\r\n</div>\r\n\r\n<div id=grup2 class=\"actionsDivBtns\">\r\n    <label *ngIf=\"globalSearch\" [translate]=\"'search'\"> </label>\r\n    <input *ngIf=\"globalSearch\" type=\"text\" class=\"searchGenericInput\" placeholder=\"\" (keyup)=\"quickSearch()\"\r\n        [(ngModel)]=\"searchValue\" ml-2>\r\n    <label *ngIf=\"changeHeightButton\" [translate]=\"'rowsToShow'\"> </label>\r\n    <mat-button-toggle-group *ngIf=\"changeHeightButton\" class=\"toogleButton\" name=\"fontStyle\" aria-label=\"Font Style\"  value=\"5\">\r\n        <mat-button-toggle value=\"5\" (change)=\"changeHeight($event.value)\">5</mat-button-toggle>\r\n        <mat-button-toggle value=\"20\" (change)=\"changeHeight($event.value)\">20</mat-button-toggle>\r\n        <mat-button-toggle value=\"50\" (change)=\"changeHeight($event.value)\">50</mat-button-toggle>\r\n    </mat-button-toggle-group>\r\n\r\n    <button type=\"button\" *ngIf=\"deleteButton\" mat-flat-button id=\"deleteButton\" class=\"deleteButton\"\r\n        (click)=\"removeData()\" [disabled]=\"!areRowsSelected()\">\r\n        <mat-icon fontSet=\"material-icons-round\"> delete </mat-icon>\r\n        <span [translate]=\"'remove'\"> </span>\r\n\r\n    </button>\r\n    <button type=\"button\" *ngIf=\"actionButton\" mat-flat-button [matMenuTriggerFor]=\"menu\" id=\"actionButton\"\r\n        class=\"actionButton\">\r\n        <span [translate]=\"'actions'\"> </span>\r\n        <mat-icon fontSet=\"material-icons-round\"> keyboard_arrow_down </mat-icon>\r\n    </button>\r\n    <mat-menu #menu=\"matMenu\">\r\n        <button type=\"button\" mat-menu-item *ngIf=\"!hideExportButton\" [disabled]=\"!areRowsSelected()\" (click)=\"exportData()\"> {{\"export\" | translate}}\r\n        </button>\r\n        <button type=\"button\" mat-menu-item *ngIf=\"!hideDuplicateButton\" [disabled]=\"!areRowsSelected()\" (click)=\"onDuplicateButtonClicked()\">\r\n            {{\"duplicate\" |\r\n            translate}}</button>\r\n        <button type=\"button\" mat-menu-item *ngIf=\"!hideSearchReplaceButton && false\"> {{\"search/replace\" | translate}}</button>\r\n    </mat-menu>\r\n\r\n    <button type=\"button\" *ngIf=\"newButton\" mat-flat-button class=\"newButton\" (click)=\"newData()\">\r\n        <mat-icon fontSet=\"material-icons-round\"> add_circle_outline </mat-icon>\r\n        <span [translate]=\"'new'\"> </span>\r\n    </button>\r\n    <button type=\"button\" *ngIf=\"addButton\" mat-flat-button class=\"newButton\" (click)=\"onAddButtonClicked()\">\r\n        <mat-icon fontSet=\"material-icons-round\"> add_circle_outline </mat-icon>\r\n        <span [translate]=\"'add'\"> </span>\r\n    </button>\r\n    <button type=\"button\" *ngIf=\"registerButton\" mat-flat-button class=\"newButton\" (click)=\"modifyStatusSelected()\">\r\n        <mat-icon fontSet=\"material-icons-round\"> add_circle_outline </mat-icon>\r\n        <span [translate]=\"'register'\"> </span>\r\n    </button>\r\n\r\n</div>\r\n\r\n<div class=\"row\" style=\" height: 100%\">\r\n    <div id=\"myGrid\" style=\" width:100%; height: 100%\">\r\n        <ag-grid-angular style=\"width: 100%; height: 100%;min-height: 200px;\" [class]=\"themeGrid\"\r\n            [floatingFilter]=\"true\" [rowData]=\"rowData\" [columnDefs]=\"columnDefs\" [gridOptions]=\"gridOptions\"\r\n            [animateRows]=\"true\" [pagination]=\"false\" [modules]=\"modules\" [undoRedoCellEditing]=\"true\"\r\n            [undoRedoCellEditingLimit]=200 [suppressRowClickSelection]=true [frameworkComponents]=\"frameworkComponents\" [components]=\"components\"\r\n            rowSelection=\"multiple\" multiSortKey=\"key\" (filterModified)=\"onFilterModified()\"\r\n            (cellEditingStopped)=\"onCellEditingStopped($event)\" (cellValueChanged)=\"onCellValueChanged($event)\"\r\n            (gridReady)=\"onGridReady($event)\" (firstDataRendered)=\"firstDataRendered()\">\r\n        </ag-grid-angular>\r\n    </div>\r\n</div>",
                  styles: ["@charset \"UTF-8\";input,label{display:inline-block;margin:5px 5px 5px 10px}.mat-flat-button.mat-orange,.mat-icon.mat-orange,.mat-mini-fab.mat-orange,.mat-raised-button.mat-orange{background-color:#ff9300!important;color:#fff!important}.mat-flat-button.mat-orange:disabled,.mat-icon.mat-orange:disabled,.mat-mini-fab.mat-orange:disabled,.mat-raised-button.mat-orange:disabled{background:#ffc97f!important;color:#fff!important}.mat-flat-button.mat-green,.mat-icon.mat-green,.mat-mini-fab.mat-green,.mat-raised-button.mat-green{background-color:#68a225!important;color:#fff!important}.mat-flat-button.mat-green:disabled,.mat-icon.mat-green:disabled,.mat-mini-fab.mat-green:disabled,.mat-raised-button.mat-green:disabled{background-color:#83976c!important;color:#fff!important}.mat-flat-button.mat-red,.mat-icon.mat-red,.mat-mini-fab.mat-red,.mat-raised-button.mat-red{background-color:#bf0000!important;color:#fff!important}.mat-flat-button.mat-red:disabled,.mat-icon.mat-red:disabled,.mat-mini-fab.mat-red:disabled,.mat-raised-button.mat-red:disabled{background-color:#da8c8e!important;color:#fff!important}.validateButton{background-color:#ff9300;color:#fff;min-width:85px;margin-top:34px!important}.deleteButton,.validateButton{height:40px;justify-self:right!important}.deleteButton{color:#bf0000;border:1px solid #bf0000!important;min-width:85px!important;float:inherit!important}.deleteButton:disabled{background-color:inherit!important;border:1px solid rgba(0,0,0,.26)!important;color:rgba(0,0,0,.26) solid 1px!important}.actionButton,.returnButton{color:#ff9300;border:1px solid #ff9300!important}.actionButton,.newButton,.returnButton,.saveButton{min-width:85px!important;height:40px;justify-self:right!important;float:inherit!important}.newButton,.saveButton{background-color:#68a225;color:#fff}.editDivBtns{margin-left:10px;text-align:start;width:130px;height:30px!important;line-height:30px!important}.actionsDivBtns{text-align:end;width:calc(100% - 140px);height:50px}.actionsDivBtns,.editDivBtns{display:inline-block!important}.actionsDivBtns .searchGenericInput{height:41px!important;width:45%!important;display:inline-block!important;margin:0 5px 5px 10px!important}.ag-body-viewport.ag-layout-normal ::-webkit-scrollbar-thumb{background:#eee}\u200B .ag-body-viewport.ag-layout-normal ::-webkit-scrollbar{width:2em;height:2em}.ag-body-viewport.ag-layout-normal ::-webkit-scrollbar-button{background:#ccc}.ag-body-viewport.ag-layout-normal::-webkit-scrollbar-track-piece{background:#888}.mini-fab{width:28px!important;height:28px!important;line-height:22px!important;margin-top:7px!important;margin-right:3px!important}.mini-fab .mat-button-wrapper{padding:1px 0!important;line-height:22px!important;width:24px!important;height:24px!important}.mini-fab .mat-button-wrapper .mat-icon{font-size:20px;padding-right:0;line-height:22px}.toogleButton{height:40px;margin-right:10px;vertical-align:bottom;align-items:center}"]
              },] }
  ];
  /** @nocollapse */
  DataGridComponent.ctorParameters = function () { return [
      { type: dialog.MatDialog },
      { type: core$1.TranslateService },
      { type: core.ElementRef }
  ]; };
  DataGridComponent.propDecorators = {
      eventRefreshSubscription: [{ type: core.Input }],
      eventGetSelectedRowsSubscription: [{ type: core.Input }],
      eventGetAllRowsSubscription: [{ type: core.Input }],
      eventSaveAgGridStateSubscription: [{ type: core.Input }],
      eventModifyStatusOfSelectedCells: [{ type: core.Input }],
      eventAddItemsSubscription: [{ type: core.Input }],
      frameworkComponents: [{ type: core.Input }],
      components: [{ type: core.Input }],
      columnDefs: [{ type: core.Input }],
      getAll: [{ type: core.Input }],
      discardChangesButton: [{ type: core.Input }],
      discardNonReverseStatus: [{ type: core.Input }],
      id: [{ type: core.Input }],
      undoButton: [{ type: core.Input }],
      defaultColumnSorting: [{ type: core.Input }],
      redoButton: [{ type: core.Input }],
      applyChangesButton: [{ type: core.Input }],
      deleteButton: [{ type: core.Input }],
      newButton: [{ type: core.Input }],
      actionButton: [{ type: core.Input }],
      addButton: [{ type: core.Input }],
      registerButton: [{ type: core.Input }],
      newStatusRegister: [{ type: core.Input }],
      globalSearch: [{ type: core.Input }],
      changeHeightButton: [{ type: core.Input }],
      defaultHeight: [{ type: core.Input }],
      themeGrid: [{ type: core.Input }],
      singleSelection: [{ type: core.Input }],
      nonEditable: [{ type: core.Input }],
      title: [{ type: core.Input }],
      hideExportButton: [{ type: core.Input }],
      hideDuplicateButton: [{ type: core.Input }],
      hideSearchReplaceButton: [{ type: core.Input }],
      addFieldRestriction: [{ type: core.Input }],
      allNewElements: [{ type: core.Input }],
      currentData: [{ type: core.Input }],
      fieldRestrictionWithDifferentName: [{ type: core.Input }],
      remove: [{ type: core.Output }],
      new: [{ type: core.Output }],
      add: [{ type: core.Output }],
      discardChanges: [{ type: core.Output }],
      sendChanges: [{ type: core.Output }],
      duplicate: [{ type: core.Output }],
      getSelectedRows: [{ type: core.Output }],
      getAllRows: [{ type: core.Output }],
      getAgGridState: [{ type: core.Output }],
      gridModified: [{ type: core.Output }]
  };

  var MaterialModule = /** @class */ (function () {
      function MaterialModule() {
      }
      return MaterialModule;
  }());
  MaterialModule.decorators = [
      { type: core.NgModule, args: [{
                  exports: [
                      a11y.A11yModule,
                      stepper.CdkStepperModule,
                      table.CdkTableModule,
                      tree.CdkTreeModule,
                      dragDrop.DragDropModule,
                      autocomplete.MatAutocompleteModule,
                      badge.MatBadgeModule,
                      bottomSheet.MatBottomSheetModule,
                      button.MatButtonModule,
                      buttonToggle.MatButtonToggleModule,
                      card.MatCardModule,
                      checkbox.MatCheckboxModule,
                      chips.MatChipsModule,
                      stepper$1.MatStepperModule,
                      datepicker.MatDatepickerModule,
                      dialog.MatDialogModule,
                      divider.MatDividerModule,
                      expansion.MatExpansionModule,
                      gridList.MatGridListModule,
                      icon.MatIconModule,
                      input.MatInputModule,
                      list.MatListModule,
                      menu.MatMenuModule,
                      core$2.MatNativeDateModule,
                      paginator.MatPaginatorModule,
                      progressBar.MatProgressBarModule,
                      progressSpinner.MatProgressSpinnerModule,
                      radio.MatRadioModule,
                      core$2.MatRippleModule,
                      select.MatSelectModule,
                      sidenav.MatSidenavModule,
                      slider.MatSliderModule,
                      slideToggle.MatSlideToggleModule,
                      snackBar.MatSnackBarModule,
                      sort.MatSortModule,
                      table$1.MatTableModule,
                      tabs.MatTabsModule,
                      toolbar.MatToolbarModule,
                      tooltip.MatTooltipModule,
                      tree$1.MatTreeModule,
                      portal.PortalModule,
                      scrolling.ScrollingModule,
                      formField.MatFormFieldModule
                  ]
              },] }
  ];

  var DialogGridComponent = /** @class */ (function () {
      function DialogGridComponent(dialogRef) {
          this.dialogRef = dialogRef;
          this.getAllRows = new rxjs.Subject();
          this.allRowsReceived = [];
          this.orderTable = [];
          this.addFieldRestriction = [];
          this.fieldRestrictionWithDifferentName = [];
          this.currentData = [];
          this.joinTables = new core.EventEmitter();
          // this.nonEditable = true;
          this.tablesReceivedCounter = 0;
      }
      DialogGridComponent.prototype.ngOnInit = function () {
          var _this = this;
          if (this.addButtonClickedSubscription) {
              this._addButtonClickedSubscription = this.addButtonClickedSubscription.subscribe(function () {
                  _this.getAllSelectedRows();
              });
          }
      };
      DialogGridComponent.prototype.getAllSelectedRows = function () {
          this.getAllRows.next(true);
      };
      DialogGridComponent.prototype.joinRowsReceived = function (data) {
          this.allRowsReceived.push(data);
          this.tablesReceivedCounter++;
          if (this.tablesReceivedCounter === this.getAllsTable.length) {
              this.doAdd(this.allRowsReceived);
              console.log(this.allRowsReceived);
          }
      };
      DialogGridComponent.prototype.doAdd = function (rowsToAdd) {
          this.dialogRef.close({ event: 'Add', data: rowsToAdd });
      };
      DialogGridComponent.prototype.closeDialog = function () {
          this.dialogRef.close({ event: 'Cancel' });
      };
      return DialogGridComponent;
  }());
  DialogGridComponent.decorators = [
      { type: core.Component, args: [{
                  selector: 'app-dialog-grid',
                  template: "<h5 mat-dialog-title class=\"titleDialog\">{{title}}</h5>\r\n<mat-dialog-content class=\"dialogConent\">\r\n  <div *ngFor=\"let getAll of getAllsTable; let i = index\" class=\"appDialogDataGridDiv\"  [ngStyle]=\"{'margin-top': i>0?'100px':'0px'}\">\r\n    <app-data-grid \r\n    [columnDefs]=\"columnDefsTable[i]\" [themeGrid]='themeGrid' [changeHeightButton]='changeHeightButton' [defaultHeight]='heightByDefault'  [getAll]='getAll' [globalSearch]=true [singleSelection]=\"singleSelectionTable[i]\"\r\n    [title]=\"titlesTable[i]\" [defaultColumnSorting]='orderTable.length>=i?orderTable[i]:null' [nonEditable]='nonEditable'\r\n     [eventGetSelectedRowsSubscription]=\"getAllRows.asObservable()\" [addFieldRestriction]='addFieldRestriction.length>=i?addFieldRestriction[i]:null' \r\n     [currentData]='currentData.length>=i?currentData[i]:null' [fieldRestrictionWithDifferentName]='fieldRestrictionWithDifferentName.length>=i?fieldRestrictionWithDifferentName[i]:null' (getSelectedRows)='joinRowsReceived($event)' >\r\n    </app-data-grid>\r\n  </div>\r\n</mat-dialog-content>\r\n<div mat-dialog-actions align=\"end\">\r\n  <button mat-flat-button class=\"returnButton\" (click)=\"closeDialog()\">{{\"cancel\" | translate}}</button>\r\n  <button mat-flat-button class=\"saveButton\" (click)=\"getAllSelectedRows()\" cdkFocusInitial>{{\"add\" | translate}}</button>\r\n</div>\r\n\r\n",
                  styles: [".dialogConent{margin:inherit!important;padding:inherit!important;max-height:60vh!important;height:100%;width:100%;overflow:auto}.titleDialog{margin-top:inherit!important;margin-bottom:15px!important}"]
              },] }
  ];
  /** @nocollapse */
  DialogGridComponent.ctorParameters = function () { return [
      { type: dialog.MatDialogRef }
  ]; };
  DialogGridComponent.propDecorators = {
      joinTables: [{ type: core.Output }]
  };

  var DialogFormComponent = /** @class */ (function () {
      function DialogFormComponent(dialogRef, dialog, translate) {
          this.dialogRef = dialogRef;
          this.dialog = dialog;
          this.translate = translate;
      }
      DialogFormComponent.prototype.ngOnInit = function () {
      };
      DialogFormComponent.prototype.doAdd = function () {
          if (this.form.valid) {
              this.dialogRef.close({ event: 'Add' });
          }
          else {
              var dialogRef = this.dialog.open(DialogMessageComponent);
              dialogRef.componentInstance.title = this.translate.instant("atention");
              dialogRef.componentInstance.message = this.translate.instant("requiredFieldMessage");
              dialogRef.componentInstance.hideCancelButton = true;
              dialogRef.afterClosed().subscribe();
          }
      };
      DialogFormComponent.prototype.closeDialog = function () {
          this.dialogRef.close({ event: 'Cancel' });
      };
      return DialogFormComponent;
  }());
  DialogFormComponent.decorators = [
      { type: core.Component, args: [{
                  selector: 'app-dialog-form',
                  template: "<h5 mat-dialog-title>{{title}}</h5>\r\n<mat-dialog-content class=\"mat-typography\">\r\n  <ng-container *ngTemplateOutlet=\"HTMLReceived\">\r\n  </ng-container> \r\n</mat-dialog-content>\r\n<mat-dialog-actions align=\"end\">\r\n  <button mat-flat-button class=\"returnButton\"  (click)=\"closeDialog()\">{{\"cancel\" | translate}}</button>\r\n  <button mat-flat-button class=\"saveButton\"  (click)=\"doAdd()\" cdkFocusInitial>{{\"accept\" | translate}}</button>\r\n</mat-dialog-actions>",
                  styles: [""]
              },] }
  ];
  /** @nocollapse */
  DialogFormComponent.ctorParameters = function () { return [
      { type: dialog.MatDialogRef },
      { type: dialog.MatDialog },
      { type: core$1.TranslateService }
  ]; };

  /**
   * File node data with nested structure.
   * Each node has a name, and a type or a list of children.
   */
  var FileNode = /** @class */ (function () {
      function FileNode() {
      }
      return FileNode;
  }());
  /** Flat node with expandable and level information */
  var FileFlatNode = /** @class */ (function () {
      function FileFlatNode(expandable, name, level, type, id, status) {
          this.expandable = expandable;
          this.name = name;
          this.level = level;
          this.type = type;
          this.id = id;
          this.status = status;
      }
      return FileFlatNode;
  }());
  /**
   * File database, it can build a tree structured Json object from string.
   * Each node in Json object represents a file or a directory. For a file, it has name and type.
   * For a directory, it has name and children (a list of files or directories).
   * The input will be a json object string, and the output is a list of `FileNode` with nested
   * structure.
   */
  var FileDatabase = /** @class */ (function () {
      function FileDatabase() {
          this.dataChange = new rxjs.BehaviorSubject([]);
      }
      Object.defineProperty(FileDatabase.prototype, "data", {
          get: function () { return this.dataChange.value; },
          enumerable: false,
          configurable: true
      });
      FileDatabase.prototype.initialize = function (dataObj, allNewElements) {
          // Build the tree nodes from Json object. The result is a list of `FileNode` with nested
          //     file node as children.
          var data = this.buildFileTree(dataObj, 0, allNewElements);
          // Notify the change.
          this.dataChange.next(data);
      };
      /**
       * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
       * The return value is the list of `FileNode`.
       */
      FileDatabase.prototype.buildFileTree = function (arrayTreeNodes, level, allNewElements) {
          var map = {};
          if (arrayTreeNodes.length === 0) {
              var root = {
                  isFolder: true,
                  name: 'Root',
                  type: 'folder',
                  isRoot: true,
                  order: 0,
                  children: [],
                  id: 0
              };
              map['root'] = root;
          }
          else {
              arrayTreeNodes.forEach(function (treeNode) {
                  var obj = treeNode;
                  obj.children = [];
                  obj.type = (treeNode.isFolder) ? "folder" : "node";
                  if (allNewElements) {
                      obj.status = 'pendingCreation';
                      if (obj.id) {
                          obj.id = obj.id * -1;
                      }
                      if (obj.parent) {
                          obj.parent = obj.parent * -1;
                      }
                  }
                  if (!map[obj.id]) {
                      map[obj.id] = obj;
                  }
                  else {
                      var previousChildren = map[obj.id].children;
                      map[obj.id] = obj;
                      map[obj.id].children = previousChildren;
                  }
                  var parent = obj.parent || 'root';
                  if (!map[parent]) {
                      map[parent] = {
                          children: []
                      };
                  }
                  map[parent].children.push(obj);
              });
              map['root'].type = 'folder';
              map['root'].name = 'Root';
              map['root'].order = 0;
              map['root'].isFolder = true;
              map['root'].isRoot = true;
          }
          return map['root'];
      };
      FileDatabase.prototype.deleteItem = function (node, changedData) {
          this.deleteNode(changedData.children, node);
          this.dataChange.next(changedData);
      };
      FileDatabase.prototype.deleteNode = function (nodes, nodeToDelete) {
          var _this = this;
          var index = nodes.indexOf(nodeToDelete, 0);
          if (index > -1) {
              nodes.splice(index, 1);
          }
          else {
              nodes.forEach(function (node) {
                  if (node.children && node.children.length > 0) {
                      _this.deleteNode(node.children, nodeToDelete);
                  }
              });
          }
      };
      FileDatabase.prototype.setOrder = function (data) {
          for (var i = 0; i < data.length; i++) {
              data[i].order = i;
              if (!data[i].status) {
                  data[i].status = "Modified";
              }
          }
          return data;
      };
      FileDatabase.prototype.copyPasteItem = function (from, to, changedData) {
          var newItem = this.insertItem(to, from, changedData);
          return newItem;
      };
      FileDatabase.prototype.copyPasteItemAbove = function (from, to, changedData) {
          var newItem = this.insertItemAbove(to, from, changedData);
          return newItem;
      };
      FileDatabase.prototype.copyPasteItemBelow = function (from, to, changedData) {
          var newItem = this.insertItemBelow(to, from, changedData);
          return newItem;
      };
      /** Add an item to to-do list */
      FileDatabase.prototype.getNewItem = function (node) {
          var newItem = {
              name: node.name,
              children: node.children,
              type: node.type,
              id: node.id,
              active: node.active,
              cartographyId: node.cartographyId,
              cartographyName: node.cartographyName,
              datasetURL: node.datasetURL,
              description: node.description,
              filterGetFeatureInfo: node.filterGetFeatureInfo,
              filterGetMap: node.filterGetMap,
              filterSelectable: node.filterSelectable,
              isFolder: node.isFolder,
              metadataURL: node.metadataURL,
              order: node.order,
              queryableActive: node.queryableActive,
              radio: node.radio,
              tooltip: node.tooltip,
              _links: node._links
          };
          return newItem;
      };
      FileDatabase.prototype.insertItem = function (parent, node, changedData) {
          if (!parent.children) {
              parent.children = [];
          }
          var newItem = this.getNewItem(node);
          newItem.parent = parent == null || parent.id == undefined ? null : parent.id;
          parent.children.push(newItem);
          this.setOrder(parent.children);
          this.dataChange.next(changedData);
          return newItem;
      };
      FileDatabase.prototype.insertItemAbove = function (node, nodeDrag, changedData) {
          var parentNode = this.getParentFromNodes(node, changedData);
          var newItem = this.getNewItem(nodeDrag);
          newItem.parent = parentNode == null || parentNode.id == undefined ? null : parentNode.id;
          if (parentNode != null) {
              parentNode.children.splice(parentNode.children.indexOf(node), 0, newItem);
              this.setOrder(parentNode.children);
          }
          else {
              changedData.children.splice(changedData.children.indexOf(node), 0, newItem);
              this.setOrder(changedData.children);
          }
          this.dataChange.next(changedData);
          return newItem;
      };
      FileDatabase.prototype.insertItemBelow = function (node, nodeDrag, changedData) {
          var parentNode = this.getParentFromNodes(node, changedData);
          var newItem = this.getNewItem(nodeDrag);
          newItem.parent = parentNode == null || parentNode.id == undefined ? null : parentNode.id;
          if (parentNode != null) {
              parentNode.children.splice(parentNode.children.indexOf(node) + 1, 0, newItem);
              this.setOrder(parentNode.children);
          }
          else {
              changedData.children.splice(changedData.children.indexOf(node) + 1, 0, newItem);
              this.setOrder(changedData.children);
          }
          this.dataChange.next(changedData);
          return newItem;
      };
      FileDatabase.prototype.getParentFromNodes = function (node, changedData) {
          for (var i = 0; i < changedData.children.length; ++i) {
              var currentRoot = changedData.children[i];
              var parent = this.getParent(currentRoot, node);
              if (parent != null) {
                  return parent;
              }
          }
          return null;
      };
      FileDatabase.prototype.getParent = function (currentRoot, node) {
          if (currentRoot.children && currentRoot.children.length > 0) {
              for (var i = 0; i < currentRoot.children.length; ++i) {
                  var child = currentRoot.children[i];
                  if (child === node) {
                      return currentRoot;
                  }
                  else if (child.children && child.children.length > 0) {
                      var parent = this.getParent(child, node);
                      if (parent != null) {
                          return parent;
                      }
                  }
              }
          }
          return null;
      };
      return FileDatabase;
  }());
  FileDatabase.decorators = [
      { type: core.Injectable }
  ];
  /** @nocollapse */
  FileDatabase.ctorParameters = function () { return []; };
  /**
   * @title Tree with flat nodes
   */
  var DataTreeComponent = /** @class */ (function () {
      function DataTreeComponent(database) {
          var _this = this;
          this.database = database;
          // expansion model tracks expansion state
          this.expansionModel = new collections.SelectionModel(true);
          this.dragging = false;
          this.expandDelay = 1000;
          this.validateDrop = false;
          this.dragNodeExpandOverWaitTimeMs = 1500;
          /** Map from flat node to nested node. This helps us finding the nested node to be modified */
          this.flatNodeMap = new Map();
          /** Map from nested node to flattened node. This helps us to keep the same object for selection */
          this.nestedNodeMap = new Map();
          this.transformer = function (node, level) {
              var existingNode = _this.nestedNodeMap.get(node);
              var flatNode = existingNode && existingNode.name === node.name
                  ? existingNode
                  : new FileFlatNode((node.children && node.children.length > 0), node.name, level, node.type, node.id, node.status);
              _this.flatNodeMap.set(flatNode, node);
              _this.nestedNodeMap.set(node, flatNode);
              return flatNode;
          };
          this._getLevel = function (node) { return node.level; };
          this._isExpandable = function (node) { return node.expandable; };
          this._getChildren = function (node) { return rxjs.of(node.children); };
          this.hasChild = function (_, _nodeData) { return _nodeData.expandable; };
          this.emitNode = new core.EventEmitter();
          this.createNode = new core.EventEmitter();
          this.createFolder = new core.EventEmitter();
          this.emitAllNodes = new core.EventEmitter();
          this.treeFlattener = new tree$1.MatTreeFlattener(this.transformer, this._getLevel, this._isExpandable, this._getChildren);
          this.treeControl = new tree.FlatTreeControl(this._getLevel, this._isExpandable);
          this.dataSource = new tree$1.MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
      }
      DataTreeComponent.prototype.ngOnInit = function () {
          var _this = this;
          if (this.eventNodeUpdatedSubscription) {
              this.eventNodeUpdatedSubscription.subscribe(function (node) {
                  _this.updateNode(node);
              });
          }
          if (this.eventCreateNodeSubscription) {
              this.eventCreateNodeSubscription.subscribe(function (node) {
                  if (node.isFolder)
                      _this.createNewFolder(node);
                  else
                      _this.createNewNode(node);
              });
          }
          if (this.eventGetAllRowsSubscription) {
              this._eventGetAllRowsSubscription = this.eventGetAllRowsSubscription.subscribe(function () {
                  _this.emitAllRows();
              });
          }
          if (this.eventRefreshSubscription) {
              this._eventRefreshSubscription = this.eventRefreshSubscription.subscribe(function () {
                  _this.getElements();
              });
          }
          this.getElements();
      };
      DataTreeComponent.prototype.getElements = function () {
          var _this = this;
          this.getAll()
              .subscribe(function (items) {
              _this.treeData = items;
              _this.database.initialize(_this.treeData, _this.allNewElements);
              _this.database.dataChange.subscribe(function (data) { return _this.rebuildTreeForData([data]); });
          });
      };
      /**
       * This constructs an array of nodes that matches the DOM
       */
      DataTreeComponent.prototype.visibleNodes = function () {
          var _this = this;
          var result = [];
          function addExpandedChildren(node, expanded) {
              result.push(node);
              if (expanded.indexOf(node.id) != -1) {
                  node.children.map(function (child) { return addExpandedChildren(child, expanded); });
              }
          }
          this.dataSource.data.forEach(function (node) {
              addExpandedChildren(node, _this.expansionModel.selected);
          });
          return result;
      };
      DataTreeComponent.prototype.findNodeSiblings = function (arr, id) {
          var _this = this;
          var result, subResult;
          arr.forEach(function (item, i) {
              if (item.id === id) {
                  result = arr;
              }
              else if (item.children) {
                  subResult = _this.findNodeSiblings(item.children, id);
                  if (subResult)
                      result = subResult;
              }
          });
          return result;
      };
      DataTreeComponent.prototype.handleDragStart = function (event, node) {
          // Required by Firefox (https://stackoverflow.com/questions/19055264/why-doesnt-html5-drag-and-drop-work-in-firefox)
          event.dataTransfer.setData('foo', 'bar');
          event.dataTransfer.setDragImage(this.emptyItem.nativeElement, 0, 0);
          this.dragNode = node;
          this.treeControl.collapse(node);
      };
      DataTreeComponent.prototype.handleDragOver = function (event, node) {
          event.preventDefault();
          // Handle node expand
          if (node === this.dragNodeExpandOverNode) {
              if (this.dragNode !== node && !this.treeControl.isExpanded(node)) {
                  if ((new Date().getTime() - this.dragNodeExpandOverTime) > this.dragNodeExpandOverWaitTimeMs) {
                      this.treeControl.expand(node);
                  }
              }
          }
          else {
              this.dragNodeExpandOverNode = node;
              this.dragNodeExpandOverTime = new Date().getTime();
          }
          // Handle drag area
          var percentageX = event.offsetX / event.target.clientWidth;
          var percentageY = event.offsetY / event.target.clientHeight;
          if (percentageY < 0.25) {
              this.dragNodeExpandOverArea = 'above';
          }
          else if (percentageY > 0.75) {
              this.dragNodeExpandOverArea = 'below';
          }
          else {
              this.dragNodeExpandOverArea = 'center';
          }
      };
      DataTreeComponent.prototype.handleDrop = function (event, node) {
          var _this = this;
          event.preventDefault();
          var changedData = JSON.parse(JSON.stringify(this.dataSource.data));
          var toFlatNode;
          if (node.id === undefined) {
              toFlatNode = changedData[0];
          }
          else {
              toFlatNode = this.findNodeSiblings(changedData[0].children, node.id).find(function (nodeAct) { return nodeAct.id === node.id; });
          }
          var fromFlatNode;
          if (this.dragNode.id === undefined) {
              fromFlatNode = changedData[0];
          }
          else {
              fromFlatNode = this.findNodeSiblings(changedData[0].children, this.dragNode.id).find(function (nodeAct) { return nodeAct.id === _this.dragNode.id; });
          }
          if (this.dragNode.status != "pendingDelete" && node !== this.dragNode && (this.dragNodeExpandOverArea !== 'center' || (this.dragNodeExpandOverArea === 'center' && toFlatNode.isFolder))) {
              var newItem = void 0;
              if (this.dragNodeExpandOverArea === 'above') {
                  newItem = this.database.copyPasteItemAbove(fromFlatNode, toFlatNode, changedData[0]);
              }
              else if (this.dragNodeExpandOverArea === 'below') {
                  newItem = this.database.copyPasteItemBelow(fromFlatNode, toFlatNode, changedData[0]);
              }
              else {
                  newItem = this.database.copyPasteItem(fromFlatNode, toFlatNode, changedData[0]);
              }
              var parentLvl_1 = this.treeControl.dataNodes.find(function (n) { return n.id === fromFlatNode.id; }).level;
              fromFlatNode.children.forEach(function (child) {
                  _this.treeControl.dataNodes.find(function (n) { return n.id === child.id; }).level = parentLvl_1 + 1;
              });
              this.database.deleteItem(fromFlatNode, changedData[0]);
              this.treeControl.expandDescendants(this.nestedNodeMap.get(newItem));
          }
          this.dragNode = null;
          this.dragNodeExpandOverNode = null;
          this.dragNodeExpandOverTime = 0;
      };
      DataTreeComponent.prototype.handleDragEnd = function (event) {
          this.dragNode = null;
          this.dragNodeExpandOverNode = null;
          this.dragNodeExpandOverTime = 0;
      };
      /**
       * The following methods are for persisting the tree expand state
       * after being rebuilt
       */
      DataTreeComponent.prototype.sortByOrder = function (data) {
          var _this = this;
          // data.sort((a,b) => a.order.toString().localeCompare( b.order.toString()));
          data.sort(function (a, b) { return (a.order > b.order) ? 1 : ((b.order > a.order) ? -1 : 0); });
          data.forEach(function (item) {
              if (item.children.length > 0) {
                  _this.sortByOrder(item.children);
              }
          });
      };
      DataTreeComponent.prototype.setOrder = function (data) {
          for (var i = 0; i < data.length; i++) {
              data[i].order = i;
              if (!data[i].status) {
                  data[i].status = "Modified";
              }
          }
          return data;
      };
      DataTreeComponent.prototype.rebuildTreeForData = function (data) {
          var _this = this;
          //this.dataSource.data = data;
          this.sortByOrder(data);
          this.dataSource.data = [];
          this.dataSource.data = data;
          this.treeControl.expansionModel.selected.forEach(function (nodeAct) {
              if (nodeAct) {
                  var node = _this.treeControl.dataNodes.find(function (n) { return n.id === nodeAct.id; });
                  _this.treeControl.expand(node);
              }
          });
      };
      DataTreeComponent.prototype.getParentNode = function (node) {
          var currentLevel = node.level;
          if (currentLevel < 1) {
              return null;
          }
          var startIndex = this.treeControl.dataNodes.indexOf(node) - 1;
          for (var i = startIndex; i >= 0; i--) {
              var currentNode = this.treeControl.dataNodes[i];
              if (currentNode.level < currentLevel) {
                  return currentNode;
              }
          }
          return null;
      };
      DataTreeComponent.prototype.updateNode = function (nodeUpdated) {
          var dataToChange = JSON.parse(JSON.stringify(this.dataSource.data));
          var siblings = this.findNodeSiblings(dataToChange, nodeUpdated.id);
          var index = siblings.findIndex(function (node) { return node.id === nodeUpdated.id; });
          siblings[index] = nodeUpdated;
          this.rebuildTreeForData(dataToChange);
      };
      DataTreeComponent.prototype.createNewFolder = function (newFolder) {
          newFolder.type = "folder";
          var dataToChange = JSON.parse(JSON.stringify(this.dataSource.data));
          if (newFolder.parent === null) {
              newFolder.order = dataToChange[0].children.length;
              dataToChange[0].children.push(newFolder);
          }
          else {
              var siblings = this.findNodeSiblings(dataToChange, newFolder.parent);
              var index = siblings.findIndex(function (node) { return node.id === newFolder.parent; });
              newFolder.order = siblings[index].children.length;
              siblings[index].children.push(newFolder);
          }
          this.rebuildTreeForData(dataToChange);
      };
      DataTreeComponent.prototype.createNewNode = function (newNode) {
          newNode.type = "node";
          var dataToChange = JSON.parse(JSON.stringify(this.dataSource.data));
          if (newNode.parent === null) {
              newNode.order = dataToChange[0].children.length;
              dataToChange[0].children.push(newNode);
          }
          else {
              var siblings = this.findNodeSiblings(dataToChange, newNode.parent);
              var index = siblings.findIndex(function (node) { return node.id === newNode.parent; });
              newNode.order = siblings[index].children.length;
              siblings[index].children.push(newNode);
          }
          this.rebuildTreeForData(dataToChange);
      };
      DataTreeComponent.prototype.onButtonClicked = function (id, button) {
          var changedData = JSON.parse(JSON.stringify(this.dataSource.data));
          var siblings = this.findNodeSiblings(changedData, id);
          var nodeClicked = siblings.find(function (node) { return node.id === id; });
          if (button === 'edit') {
              this.emitNode.emit(nodeClicked);
          }
          else if (button === 'newFolder') {
              this.createFolder.emit(nodeClicked);
          }
          else if (button === 'newNode') {
              this.createNode.emit(nodeClicked);
          }
          else if (button === 'delete') {
              // let children= this.getAllChildren(nodeClicked.children)
              // children.forEach(children => {
              //   children.status='pendingDelete';
              // });
              this.deleteChildren(nodeClicked.children);
              // nodeClicked.children=children
              nodeClicked.status = 'pendingDelete';
              this.rebuildTreeForData(changedData);
          }
      };
      DataTreeComponent.prototype.emitAllRows = function () {
          var dataToEmit = JSON.parse(JSON.stringify(this.dataSource.data));
          var allRows = this.getAllChildren(dataToEmit);
          this.emitAllNodes.emit(allRows);
      };
      DataTreeComponent.prototype.getAllChildren = function (arr) {
          var _this = this;
          var result = [];
          var subResult;
          arr.forEach(function (item, i) {
              if (item.children.length > 0) {
                  subResult = _this.getAllChildren(item.children);
                  if (subResult)
                      result.push.apply(result, __spread(subResult));
              }
              result.push(item);
          });
          return result;
      };
      DataTreeComponent.prototype.deleteChildren = function (arr) {
          var _this = this;
          arr.forEach(function (item, i) {
              if (item.children.length > 0) {
                  _this.deleteChildren(item.children);
              }
              item.status = 'pendingDelete';
          });
      };
      return DataTreeComponent;
  }());
  DataTreeComponent.decorators = [
      { type: core.Component, args: [{
                  selector: 'app-data-tree',
                  template: "<button mat-flat-button type=\"button\" (click)=\"treeControl.expandAll()\" title=\"{{ 'expandAll' | translate }}\"  type=\"button\" >\r\n\t<mat-icon fontSet=\"material-icons-round\"> expand_more </mat-icon>\r\n\t{{ \"expandAll\" | translate }}\r\n</button>\r\n<button mat-flat-button type=\"button\" (click)=\"treeControl.collapseAll()\" title=\"{{ 'expandAll' | translate }}\"  type=\"button\" >\r\n\t<mat-icon fontSet=\"material-icons-round\"> expand_less </mat-icon>\r\n\t{{ \"collapseAll\" | translate }}\r\n</button>\r\n<mat-tree [dataSource]=\"dataSource\" [treeControl]=\"treeControl\" >\r\n\t<mat-tree-node *matTreeNodeDef=\"let node\" matTreeNodeToggle matTreeNodePadding  draggable=\"true\"\r\n\t(dragstart)=\"handleDragStart($event, node);\" \t(dragover)=\"handleDragOver($event, node);\"\r\n\t(drop)=\"handleDrop($event, node);\" \t(dragend)=\"handleDragEnd($event);\"                  \r\n\t  [ngClass]=\"{'drop-above': dragNodeExpandOverArea === 'above' && dragNodeExpandOverNode === node,\r\n\t'drop-below': dragNodeExpandOverArea === 'below' && dragNodeExpandOverNode === node,\r\n\t'drop-center': dragNodeExpandOverArea === 'center' && dragNodeExpandOverNode === node,\r\n\t'deletedNode': node.status=='pendingDelete'}\">\r\n\t\t<button mat-icon-button disabled></button>\r\n\t\t<mat-icon *ngIf=\"node.type ==='folder'&& node.status!='pendingDelete'\" class=\"type-icon\" [attr.aria-label]=\"node.type + 'icon'\">\r\n\t\t\tfolder\r\n\t\t</mat-icon>\r\n\t\t<span *ngIf=\"node.status=='pendingDelete'\">({{\"pendingDelete\" | translate}})-</span>\r\n\t\t{{node.name}}\r\n\t\r\n\t\t<button *ngIf=\"node.type ==='folder' && node.status!='pendingDelete'\" (click)=\"onButtonClicked(node.id, 'newFolder')\" mat-icon-button>\r\n\t\t\t<mat-icon>create_new_folder</mat-icon>\r\n\t\t</button>\r\n\t\t<button *ngIf=\"node.type ==='folder' && node.status!='pendingDelete'\" (click)=\"onButtonClicked(node.id, 'newNode')\" mat-icon-button>\r\n\t\t\t<mat-icon>playlist_add</mat-icon>\r\n\t\t</button>\r\n\t\t<button *ngIf=\"node.id !== undefined && node.status!='pendingDelete'\" mat-icon-button (click)=\"onButtonClicked(node.id, 'delete')\">\r\n\t\t\t<mat-icon>delete</mat-icon>\r\n\t\t</button>\r\n\t\t<button *ngIf=\"node.id !== undefined && node.status!='pendingDelete'\" mat-icon-button (click)=\"onButtonClicked(node.id, 'edit')\">\r\n\t\t\t<mat-icon>edit</mat-icon>\r\n\t\t</button>\r\n\r\n\t</mat-tree-node>\r\n\r\n\t<mat-tree-node *matTreeNodeDef=\"let node;when: hasChild\" matTreeNodePadding  draggable=\"true\"\r\n\t(dragstart)=\"handleDragStart($event, node);\" \t(dragover)=\"handleDragOver($event, node);\"\r\n\t(drop)=\"handleDrop($event, node);\" \t(dragend)=\"handleDragEnd($event);\"                  \r\n\t [ngClass]=\"{'drop-above': dragNodeExpandOverArea === 'above' && dragNodeExpandOverNode === node,\r\n\t'drop-below': dragNodeExpandOverArea === 'below' && dragNodeExpandOverNode === node,\r\n\t'drop-center': dragNodeExpandOverArea === 'center' && dragNodeExpandOverNode === node,\r\n\t'deletedNode': node.status=='pendingDelete'}\">\r\n\t\t<button mat-icon-button matTreeNodeToggle (click)=\"expansionModel.toggle(node.id)\"\r\n\t\t\t[attr.aria-label]=\"'toggle ' + node.name\">\r\n\t\t\t<mat-icon class=\"mat-icon-rtl-mirror\">\r\n\t\t\t\t{{treeControl.isExpanded(node) ? 'expand_more' : 'chevron_right'}}\r\n\t\t\t</mat-icon>\r\n\t\t</button>\r\n\t\t<mat-icon class=\"type-icon\" [attr.aria-label]=\"node.type + 'icon'\">\r\n\t\t\tfolder\r\n\t\t</mat-icon>\r\n\t\t<span *ngIf=\"node.status=='pendingDelete'\">({{\"pendingDelete\" | translate}})-</span>\r\n\t\t{{node.name}}\r\n\t\t<button *ngIf=\"node.type ==='folder' && node.status!='pendingDelete'\" (click)=\"onButtonClicked(node.id, 'newFolder')\" mat-icon-button>\r\n\t\t\t<mat-icon>create_new_folder</mat-icon>\r\n\t\t</button>\r\n\t\t<button *ngIf=\"node.type ==='folder' && node.status!='pendingDelete'\" (click)=\"onButtonClicked(node.id, 'newNode')\" mat-icon-button>\r\n\t\t\t<mat-icon>playlist_add</mat-icon>\r\n\t\t</button>\r\n\t\t<button *ngIf=\"node.id !== undefined && node.status!='pendingDelete'\" mat-icon-button (click)=\"onButtonClicked(node.id, 'delete')\">\r\n\t\t\t<mat-icon>delete</mat-icon>\r\n\t\t</button>\r\n\t\t<button *ngIf=\"node.id !== undefined && node.status!='pendingDelete'\"  mat-icon-button (click)=\"onButtonClicked(node.id, 'edit')\">\r\n\t\t\t<mat-icon>edit</mat-icon>\r\n\t\t</button>\r\n\t\t\r\n\t</mat-tree-node>\r\n</mat-tree>\r\n\r\n<span #emptyItem></span>\r\n",
                  providers: [FileDatabase],
                  styles: [".mat-tree-node{-webkit-user-select:none;-moz-user-select:none;user-select:none;cursor:move}.mat-tree-node.cdk-drag-preview{box-shadow:0 7px 8px -4px rgba(0,0,0,.2),0 12px 17px 2px rgba(0,0,0,.14),0 5px 22px 4px rgba(0,0,0,.12)}.mat-tree-node.cdk-drag-placeholder{opacity:0}.cdk-drop-list-dragging .mat-tree-node:not(.cdk-drag-placeholder){transition:transform .25s cubic-bezier(0,0,.2,1)}.cdk-drag-animating{transition:transform .2s cubic-bezier(0,0,.2,1)}.drop-above{border-top:10px solid #ddd;margin-top:-10px}.drop-below{border-bottom:10px solid #ddd;margin-bottom:-10px}.drop-center{background-color:#ddd}.deletedNode{color:red;font-style:italic}"]
              },] }
  ];
  /** @nocollapse */
  DataTreeComponent.ctorParameters = function () { return [
      { type: FileDatabase }
  ]; };
  DataTreeComponent.propDecorators = {
      createNode: [{ type: core.Output }],
      createFolder: [{ type: core.Output }],
      emitNode: [{ type: core.Output }],
      emitAllNodes: [{ type: core.Output }],
      eventNodeUpdatedSubscription: [{ type: core.Input }],
      eventCreateNodeSubscription: [{ type: core.Input }],
      eventGetAllRowsSubscription: [{ type: core.Input }],
      eventRefreshSubscription: [{ type: core.Input }],
      getAll: [{ type: core.Input }],
      allNewElements: [{ type: core.Input }],
      emptyItem: [{ type: core.ViewChild, args: ['emptyItem',] }]
  };

  var DialogTranslationComponent = /** @class */ (function () {
      function DialogTranslationComponent(dialogRef, matIconRegistry, domSanitizer) {
          this.dialogRef = dialogRef;
          this.matIconRegistry = matIconRegistry;
          this.domSanitizer = domSanitizer;
          this.catalanAvailable = false;
          this.spanishAvailable = false;
          this.englishAvailable = false;
          this.araneseAvailable = false;
          this.frenchAvailable = false;
          this.initializeTranslationForm();
          this.matIconRegistry.addSvgIcon("icon_lang_ca", this.domSanitizer.bypassSecurityTrustResourceUrl('assets/img/flag_ca.svg'));
          this.matIconRegistry.addSvgIcon("icon_lang_es", this.domSanitizer.bypassSecurityTrustResourceUrl('assets/img/flag_es.svg'));
          this.matIconRegistry.addSvgIcon("icon_lang_en", this.domSanitizer.bypassSecurityTrustResourceUrl('assets/img/flag_en.svg'));
          this.matIconRegistry.addSvgIcon("icon_lang_oc", this.domSanitizer.bypassSecurityTrustResourceUrl('assets/img/flag_oc.svg'));
          this.matIconRegistry.addSvgIcon("icon_lang_fr", this.domSanitizer.bypassSecurityTrustResourceUrl('assets/img/flag_fr.svg'));
      }
      DialogTranslationComponent.prototype.ngOnInit = function () {
          this.checkLanguagesAvailables();
          this.checkTranslationsAlreadyDone();
          // if(this.catalanValue != null){
          //   this.translationForm.patchValue({
          //     catalanValue: this.catalanValue
          //   })
          // }
          // if(this.spanishValue != null){
          //   this.translationForm.patchValue({
          //     spanishValue: this.spanishValue
          //   })
          // }
          // if(this.englishValue != null){
          //   this.translationForm.patchValue({
          //     englishValue: this.englishValue
          //   })
          // }
          // if(this.araneseValue != null){
          //   this.translationForm.patchValue({
          //     araneseValue: this.araneseValue
          //   })
          // }
          // if(this.frenchValue != null){
          //   this.translationForm.patchValue({
          //     frenchValue: this.frenchValue
          //   })
          // }
      };
      DialogTranslationComponent.prototype.checkLanguagesAvailables = function () {
          var _this = this;
          this.languagesAvailables.forEach(function (element) {
              if (element.shortname == 'ca' && _this.languageByDefault != 'ca') {
                  _this.catalanAvailable = true;
              }
              if (element.shortname == 'es' && _this.languageByDefault != 'es') {
                  _this.spanishAvailable = true;
              }
              if (element.shortname == 'en' && _this.languageByDefault != 'en') {
                  _this.englishAvailable = true;
              }
              if (element.shortname == 'oc-aranes' && _this.languageByDefault != 'oc-aranes') {
                  _this.araneseAvailable = true;
              }
              if (element.shortname == 'fr' && _this.languageByDefault != 'fr') {
                  _this.frenchAvailable = true;
              }
          });
      };
      DialogTranslationComponent.prototype.checkTranslationsAlreadyDone = function () {
          var _this = this;
          this.translationsMap.forEach(function (value, key) {
              if (key == 'ca' && value && value.translation) {
                  _this.translationForm.patchValue({ catalanValue: value.translation });
              }
              if (key == 'es' && value && value.translation) {
                  _this.translationForm.patchValue({ spanishValue: value.translation });
              }
              if (key == 'en' && value && value.translation) {
                  _this.translationForm.patchValue({ englishValue: value.translation });
              }
              if (key == 'oc-aranes' && value && value.translation) {
                  _this.translationForm.patchValue({ araneseValue: value.translation });
              }
              if (key == 'fr' && value && value.translation) {
                  _this.translationForm.patchValue({ frenchValue: value.translation });
              }
          });
      };
      DialogTranslationComponent.prototype.initializeTranslationForm = function () {
          this.translationForm = new forms.FormGroup({
              catalanValue: new forms.FormControl(null, []),
              spanishValue: new forms.FormControl(null, []),
              englishValue: new forms.FormControl(null, []),
              araneseValue: new forms.FormControl(null, []),
              frenchValue: new forms.FormControl(null, []),
          });
      };
      DialogTranslationComponent.prototype.doAccept = function () {
          if (this.translationsMap.has("ca") && this.translationForm.value.catalanValue) {
              this.translationsMap.get('ca').translation = this.translationForm.value.catalanValue;
          }
          if (this.translationsMap.has("es") && this.translationForm.value.spanishValue) {
              this.translationsMap.get('es').translation = this.translationForm.value.spanishValue;
          }
          if (this.translationsMap.has("en") && this.translationForm.value.englishValue) {
              this.translationsMap.get('en').translation = this.translationForm.value.englishValue;
          }
          if (this.translationsMap.has("oc-aranes") && this.translationForm.value.araneseValue) {
              this.translationsMap.get('oc-aranes').translation = this.translationForm.value.araneseValue;
          }
          if (this.translationsMap.has("fr") && this.translationForm.value.frenchValue) {
              this.translationsMap.get('fr').translation = this.translationForm.value.frenchValue;
          }
          this.dialogRef.close({ event: 'Accept', data: this.translationsMap });
      };
      DialogTranslationComponent.prototype.closeDialog = function () {
          this.dialogRef.close({ event: 'Cancel' });
      };
      return DialogTranslationComponent;
  }());
  DialogTranslationComponent.decorators = [
      { type: core.Component, args: [{
                  selector: 'app-dialog-translation',
                  template: "\r\n\r\n<form [formGroup]='translationForm' #f=\"ngForm\">\r\n\r\n\r\n        <div class=\"displayInline\" *ngIf=\"catalanAvailable\">\r\n            <label class=\"formLabelDialog\">\r\n                {{'Valor'}}\r\n            </label>\r\n            <mat-form-field appearance=\"outline\">\r\n            <input matInput type=\"text\" formControlName=\"catalanValue\" required>\r\n            </mat-form-field>\r\n            <mat-icon class=\"icon\" svgIcon=\"icon_lang_ca\"></mat-icon>\r\n        </div>\r\n\r\n        <div class=\"displayInline\"  *ngIf=\"spanishAvailable\">\r\n            <label class=\"formLabelDialog\">\r\n                {{'Valor'}}\r\n            </label>\r\n\r\n            <mat-form-field appearance=\"outline\">\r\n            <input matInput type=\"text\" formControlName=\"spanishValue\">\r\n            </mat-form-field>\r\n            <mat-icon class=\"icon\" svgIcon=\"icon_lang_es\"></mat-icon>\r\n        </div>\r\n\r\n        <div class=\"displayInline\" *ngIf=\"englishAvailable\" >\r\n            <label class=\"formLabelDialog\">\r\n                {{'Value'}}\r\n            </label>\r\n            <mat-form-field appearance=\"outline\">\r\n            <input matInput type=\"text\" formControlName=\"englishValue\">\r\n            </mat-form-field>\r\n            <mat-icon class=\"icon\" svgIcon=\"icon_lang_en\"></mat-icon>\r\n        </div>\r\n\r\n        <div class=\"displayInline\" *ngIf=\"araneseAvailable\" >\r\n            <label class=\"formLabelDialog\">\r\n                {{'Valor'}}\r\n            </label>\r\n            <mat-form-field appearance=\"outline\">\r\n            <input matInput type=\"text\" formControlName=\"araneseValue\">\r\n            </mat-form-field>\r\n            <mat-icon class=\"icon\" svgIcon=\"icon_lang_oc\"></mat-icon>\r\n        </div>\r\n        <div class=\"displayInline\">\r\n            <label class=\"formLabelDialog\" *ngIf=\"frenchAvailable\">\r\n                {{'Valeur'}}\r\n            </label>\r\n            <mat-form-field appearance=\"outline\">\r\n            <input matInput type=\"text\" formControlName=\"frenchValue\">\r\n            </mat-form-field>\r\n            <mat-icon class=\"icon\" svgIcon=\"icon_lang_fr\"></mat-icon>\r\n        </div>\r\n\r\n  </form>\r\n\r\n<div>\r\n    <div mat-dialog-actions >\r\n        <button  mat-flat-button class=\"returnButton\" (click)=\"closeDialog()\">{{\"cancel\" | translate}}</button>\r\n        <button  mat-flat-button class=\"saveButton\"  (click)=\"doAccept()\" cdkFocusInitial>{{\"accept\" | translate}}</button>\r\n    </div>\r\n</div>",
                  styles: [".displayInline{display:flex!important}.mat-dialog-actions{justify-content:flex-end}.icon{height:50px!important;width:40px!important;margin-left:30px}.formLabelDialog{width:10%!important}.mat-dialog-container{height:-moz-max-content!important;height:max-content!important}"]
              },] }
  ];
  /** @nocollapse */
  DialogTranslationComponent.ctorParameters = function () { return [
      { type: dialog.MatDialogRef },
      { type: icon.MatIconRegistry },
      { type: platformBrowser.DomSanitizer }
  ]; };

  var DatagraphComponent = /** @class */ (function () {
      function DatagraphComponent() {
          this.margin = { top: 20, bottom: 60, left: 40, right: 40 };
          this.margin2 = 80;
      }
      DatagraphComponent.prototype.ngOnInit = function () {
          if (this.type == "bar") {
              this.createBarChart();
              if (this.data) {
                  this.updateBarChart();
              }
          }
      };
      DatagraphComponent.prototype.ngOnChanges = function () {
          if (this.type == "bar") {
              if (this.chart) {
                  this.updateBarChart();
              }
          }
      };
      DatagraphComponent.prototype.createBarChart = function () {
          var _this = this;
          var element = this.chartContainer.nativeElement;
          this.width = element.offsetWidth - this.margin.left - this.margin.right;
          this.height = element.offsetHeight - this.margin.top - this.margin.bottom;
          var svg = d3__namespace.select(element).append('svg')
              .attr('width', '100%')
              .attr("height", '100%');
          // chart plot area
          this.chart = svg.append('g')
              .attr('class', 'bars')
              .attr('transform', "translate(" + this.margin.left + ", " + this.margin.top + ")");
          var barGroups = this.chart.selectAll()
              .data(this.data)
              .enter()
              .append('g');
          // define X & Y domains
          var xDomain = this.data.map(function (d) { return d.index; });
          var yDomain = [0, (d3__namespace.max(this.data, function (d) { return d.value; }))];
          // create scales
          this.xScale = d3__namespace.scaleBand().padding(0.3).domain(xDomain).rangeRound([0, this.width]);
          this.yScale = d3__namespace.scaleLinear().domain(yDomain).range([this.height, 0]);
          // bar colors
          // this.colors = d3.scaleLinear().domain([0, this.data.length]).range(<any[]>['red', 'blue']);
          barGroups
              .append('text')
              .attr('class', 'value')
              .attr('x', function (a) { return _this.xScale(a.index) + _this.xScale.bandwidth() / 2; })
              .attr('y', function (a) { return _this.yScale(a.value) - 5; })
              .attr('text-anchor', 'middle')
              .style("font-size", 9)
              .style("fill", "black")
              .text(function (a) { return "" + a.value; });
          // x & y axis
          this.xAxis = svg.append('g')
              .attr('class', 'axis axis-x')
              .attr('transform', "translate(" + this.margin.left + ", " + (this.margin.top + this.height) + ")")
              .call(d3__namespace.axisBottom(this.xScale))
              .selectAll("text")
              .attr("transform", "translate(-10,0)rotate(-45)")
              .style("text-anchor", "end")
              .style("font-size", 9)
              .style("fill", "black");
          this.yAxis = svg.append('g')
              .attr('class', 'axis axis-y')
              .attr('transform', "translate(" + this.margin.left + ", " + this.margin.top + ")")
              .call(d3__namespace.axisLeft(this.yScale))
              .selectAll("text")
              .style("font-size", 9)
              .style("fill", "black");
      };
      DatagraphComponent.prototype.updateBarChart = function () {
          var _this = this;
          // update scales & axis
          this.xScale.domain(this.data.map(function (d) { return d.index; }));
          this.yScale.domain([0, (d3__namespace.max(this.data, function (d) { return d.value; }))]);
          this.xAxis.transition().call(d3__namespace.axisBottom(this.xScale));
          this.yAxis.transition().call(d3__namespace.axisLeft(this.yScale));
          var update = this.chart.selectAll('.bar')
              .data(this.data);
          // remove exiting bars
          update.exit().remove();
          // update existing bars
          this.chart.selectAll('.bar').transition()
              .attr('x', function (d) { return _this.xScale(d.index); })
              .attr('y', function (d) { return _this.yScale(d.value); })
              .attr('width', function (d) { return _this.xScale.bandwidth(); })
              .attr('height', function (d) { return _this.height - _this.yScale(d[1]); })
              .style('fill', '#be7d27');
          // add new bars
          update
              .enter()
              .append('rect')
              .attr('class', 'bar')
              .attr('x', function (d) { return _this.xScale(d.index); })
              .attr('y', function (d) { return _this.yScale(d.value); })
              .attr('height', function (d) { return _this.height - _this.yScale(d.value); })
              .attr('width', this.xScale.bandwidth())
              .style('fill', '#be7d27')
              .transition()
              .delay(function (d, i) { return i * 10; });
      };
      return DatagraphComponent;
  }());
  DatagraphComponent.decorators = [
      { type: core.Component, args: [{
                  selector: 'app-datagraph',
                  template: "<div class=\"d3-chart\" #chart></div>",
                  styles: [".d3-chart{width:100%;height:400px;margin:auto;background-color:rgba(189,185,181,.6156862745)}.d3-chart .axis line,.d3-chart .axis path{stroke:#999}.d3-chart .axis text{fill:#999}body{font-family:Open Sans,sans-serif}div#layout{text-align:center}svg{width:100%;height:100%}.bar{fill:#be7d27}text{font-size:8px!important;fill:#fff}line,path{stroke:grey}line#limit{stroke:#fed966;stroke-width:3;stroke-dasharray:3 6}.grid path{stroke-width:0}.grid .tick line{stroke:#9faaae;stroke-opacity:.3}text.divergence{font-size:12px;fill:#2f4a6d}.bars.value{font-size:8px!important;z-index:132132132}text.title{font-size:22px;font-weight:600}text.label{font-weight:400}text.label,text.source{font-size:8px!important}"]
              },] }
  ];
  /** @nocollapse */
  DatagraphComponent.ctorParameters = function () { return []; };
  DatagraphComponent.propDecorators = {
      chartContainer: [{ type: core.ViewChild, args: ['chart', { static: true },] }],
      data: [{ type: core.Input }],
      type: [{ type: core.Input }]
  };

  common.registerLocaleData(localeCa__default["default"], 'ca');
  common.registerLocaleData(localeEs__default["default"], 'es');
  /** Load translation assets */
  function createTranslateLoader(http) {
      return new httpLoader.TranslateHttpLoader(http, '../assets/i18n/', '.json');
  }
  var ɵ0 = (createTranslateLoader);
  /** SITMUN plugin core module */
  var SitmunFrontendGuiModule = /** @class */ (function () {
      function SitmunFrontendGuiModule() {
      }
      return SitmunFrontendGuiModule;
  }());
  SitmunFrontendGuiModule.decorators = [
      { type: core.NgModule, args: [{
                  imports: [
                      router.RouterModule,
                      http.HttpClientModule,
                      common.CommonModule,
                      forms.FormsModule,
                      animations.NoopAnimationsModule,
                      //AngularHalModule,
                      forms.ReactiveFormsModule,
                      animations.BrowserAnimationsModule,
                      angular.AgGridModule,
                      // SitmunFrontendCoreModule,
                      MaterialModule,
                      core$1.TranslateModule.forRoot({
                          loader: {
                              provide: core$1.TranslateLoader,
                              useFactory: ɵ0,
                              deps: [http.HttpClient]
                          }
                      })
                  ],
                  declarations: [
                      DataGridComponent,
                      DataTreeComponent,
                      BtnEditRenderedComponent,
                      BtnCheckboxRenderedComponent,
                      BtnCheckboxFilterComponent,
                      DialogGridComponent,
                      DialogFormComponent,
                      DialogMessageComponent,
                      DialogTranslationComponent,
                      DatagraphComponent
                  ],
                  entryComponents: [],
                  providers: [],
                  exports: [
                      http.HttpClientModule,
                      common.CommonModule,
                      forms.FormsModule,
                      animations.NoopAnimationsModule,
                      //AngularHalModule,
                      core$1.TranslateModule,
                      forms.ReactiveFormsModule,
                      DataGridComponent,
                      DataTreeComponent,
                      DialogGridComponent,
                      DialogFormComponent,
                      DialogMessageComponent,
                      DialogTranslationComponent,
                      DatagraphComponent,
                  ]
              },] }
  ];

  /*
   * Public API Surface of sitmun-frontend-gui
   */

  /**
   * Generated bundle index. Do not edit.
   */

  exports.BtnCheckboxFilterComponent = BtnCheckboxFilterComponent;
  exports.BtnCheckboxRenderedComponent = BtnCheckboxRenderedComponent;
  exports.BtnEditRenderedComponent = BtnEditRenderedComponent;
  exports.DataGridComponent = DataGridComponent;
  exports.DataTreeComponent = DataTreeComponent;
  exports.DatagraphComponent = DatagraphComponent;
  exports.DialogFormComponent = DialogFormComponent;
  exports.DialogGridComponent = DialogGridComponent;
  exports.DialogMessageComponent = DialogMessageComponent;
  exports.DialogTranslationComponent = DialogTranslationComponent;
  exports.FileDatabase = FileDatabase;
  exports.FileFlatNode = FileFlatNode;
  exports.FileNode = FileNode;
  exports.SitmunFrontendGuiModule = SitmunFrontendGuiModule;
  exports.createTranslateLoader = createTranslateLoader;
  exports["ɵ0"] = ɵ0;
  exports["ɵa"] = MaterialModule;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=sitmun-frontend-gui.umd.js.map
