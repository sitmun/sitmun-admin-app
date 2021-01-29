(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@ag-grid-community/all-modules'), require('@angular/material/button'), require('@angular/material/icon'), require('@angular/material/checkbox'), require('@angular/forms'), require('@ngx-translate/core'), require('@angular/material/dialog'), require('@angular/common'), require('@angular/material/menu'), require('@ag-grid-community/angular'), require('@angular/common/http'), require('@angular/platform-browser/animations'), require('@angular/router'), require('@sitmun/frontend-core'), require('@angular/common/locales/ca'), require('@angular/common/locales/es'), require('@angular/cdk/a11y'), require('@angular/cdk/drag-drop'), require('@angular/cdk/portal'), require('@angular/cdk/scrolling'), require('@angular/cdk/stepper'), require('@angular/cdk/table'), require('@angular/cdk/tree'), require('@angular/material/autocomplete'), require('@angular/material/badge'), require('@angular/material/bottom-sheet'), require('@angular/material/button-toggle'), require('@angular/material/card'), require('@angular/material/chips'), require('@angular/material/stepper'), require('@angular/material/datepicker'), require('@angular/material/divider'), require('@angular/material/expansion'), require('@angular/material/grid-list'), require('@angular/material/input'), require('@angular/material/list'), require('@angular/material/core'), require('@angular/material/paginator'), require('@angular/material/progress-bar'), require('@angular/material/progress-spinner'), require('@angular/material/radio'), require('@angular/material/select'), require('@angular/material/sidenav'), require('@angular/material/slider'), require('@angular/material/slide-toggle'), require('@angular/material/snack-bar'), require('@angular/material/sort'), require('@angular/material/table'), require('@angular/material/tabs'), require('@angular/material/toolbar'), require('@angular/material/tooltip'), require('@angular/material/tree'), require('@angular/material/form-field'), require('@ngx-translate/http-loader'), require('rxjs'), require('@angular/cdk/collections')) :
    typeof define === 'function' && define.amd ? define('@sitmun/frontend-gui', ['exports', '@angular/core', '@ag-grid-community/all-modules', '@angular/material/button', '@angular/material/icon', '@angular/material/checkbox', '@angular/forms', '@ngx-translate/core', '@angular/material/dialog', '@angular/common', '@angular/material/menu', '@ag-grid-community/angular', '@angular/common/http', '@angular/platform-browser/animations', '@angular/router', '@sitmun/frontend-core', '@angular/common/locales/ca', '@angular/common/locales/es', '@angular/cdk/a11y', '@angular/cdk/drag-drop', '@angular/cdk/portal', '@angular/cdk/scrolling', '@angular/cdk/stepper', '@angular/cdk/table', '@angular/cdk/tree', '@angular/material/autocomplete', '@angular/material/badge', '@angular/material/bottom-sheet', '@angular/material/button-toggle', '@angular/material/card', '@angular/material/chips', '@angular/material/stepper', '@angular/material/datepicker', '@angular/material/divider', '@angular/material/expansion', '@angular/material/grid-list', '@angular/material/input', '@angular/material/list', '@angular/material/core', '@angular/material/paginator', '@angular/material/progress-bar', '@angular/material/progress-spinner', '@angular/material/radio', '@angular/material/select', '@angular/material/sidenav', '@angular/material/slider', '@angular/material/slide-toggle', '@angular/material/snack-bar', '@angular/material/sort', '@angular/material/table', '@angular/material/tabs', '@angular/material/toolbar', '@angular/material/tooltip', '@angular/material/tree', '@angular/material/form-field', '@ngx-translate/http-loader', 'rxjs', '@angular/cdk/collections'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global.sitmun = global.sitmun || {}, global.sitmun['frontend-gui'] = {}), global.ng.core, global.allModules, global.ng.material.button, global.ng.material.icon, global.ng.material.checkbox, global.ng.forms, global.i2$1, global.ng.material.dialog, global.ng.common, global.ng.material.menu, global.i5, global.ng.common.http, global.ng.platformBrowser.animations, global.ng.router, global.frontendCore, global.ng.common.locales.ca, global.ng.common.locales.es, global.ng.cdk.a11y, global.ng.cdk.dragDrop, global.ng.cdk.portal, global.ng.cdk.scrolling, global.ng.cdk.stepper, global.ng.cdk.table, global.ng.cdk.tree, global.ng.material.autocomplete, global.ng.material.badge, global.ng.material.bottomSheet, global.ng.material.buttonToggle, global.ng.material.card, global.ng.material.chips, global.ng.material.stepper, global.ng.material.datepicker, global.ng.material.divider, global.ng.material.expansion, global.ng.material.gridList, global.ng.material.input, global.ng.material.list, global.ng.material.core, global.ng.material.paginator, global.ng.material.progressBar, global.ng.material.progressSpinner, global.ng.material.radio, global.ng.material.select, global.ng.material.sidenav, global.ng.material.slider, global.ng.material.slideToggle, global.ng.material.snackBar, global.ng.material.sort, global.ng.material.table, global.ng.material.tabs, global.ng.material.toolbar, global.ng.material.tooltip, global.ng.material.tree, global.ng.material.formField, global.httpLoader, global.rxjs, global.ng.cdk.collections));
}(this, (function (exports, i0, allModules, i3, i2, i1, i8, i2$1, i1$1, i2$2, i4, i5, http, animations, router, frontendCore, localeCa, localeEs, a11y, dragDrop, portal, scrolling, stepper, table, tree, autocomplete, badge, bottomSheet, buttonToggle, card, chips, stepper$1, datepicker, divider, expansion, gridList, input, list, core, paginator, progressBar, progressSpinner, radio, select, sidenav, slider, slideToggle, snackBar, sort, table$1, tabs, toolbar, tooltip, i1$2, formField, httpLoader, rxjs, collections) { 'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var localeCa__default = /*#__PURE__*/_interopDefaultLegacy(localeCa);
    var localeEs__default = /*#__PURE__*/_interopDefaultLegacy(localeEs);

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
            while (_)
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
        Object.defineProperty(o, k2, { enumerable: true, get: function () { return m[k]; } });
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
    function __spreadArray(to, from) {
        for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
            to[j] = from[i];
        return to;
    }
    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }
    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n])
            i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
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
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
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
    /** @nocollapse */ BtnEditRenderedComponent.ɵfac = function BtnEditRenderedComponent_Factory(t) { return new (t || BtnEditRenderedComponent)(); };
    /** @nocollapse */ BtnEditRenderedComponent.ɵcmp = i0.ɵɵdefineComponent({ type: BtnEditRenderedComponent, selectors: [["app-btn-edit-rendered"]], decls: 3, vars: 0, consts: [["mat-mini-fab", "", "type", "button", 1, "buttonEdit", 3, "click"], ["fontSet", "material-icons-round", 1, "iconEdit"]], template: function BtnEditRenderedComponent_Template(rf, ctx) {
            if (rf & 1) {
                i0.ɵɵelementStart(0, "button", 0);
                i0.ɵɵlistener("click", function BtnEditRenderedComponent_Template_button_click_0_listener($event) { return ctx.btnClickedHandler($event); });
                i0.ɵɵelementStart(1, "mat-icon", 1);
                i0.ɵɵtext(2, " edit ");
                i0.ɵɵelementEnd();
                i0.ɵɵelementEnd();
            }
        }, directives: [i3.MatButton, i2.MatIcon], styles: [".buttonEdit[_ngcontent-%COMP%]{background-color:#ddd;box-shadow:none;color:#000;height:20px;margin-top:3px;width:20px}.iconEdit[_ngcontent-%COMP%]{font-size:13px;margin-left:-2px;margin-top:-10px}"] });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(BtnEditRenderedComponent, [{
                type: i0.Component,
                args: [{
                        selector: 'app-btn-edit-rendered',
                        templateUrl: './btn-edit-rendered.component.html',
                        styleUrls: ['./btn-edit-rendered.component.css']
                    }]
            }], null, null);
    })();

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
            var checked = !event.target.firstElementChild.checked;
            var colId = this.params.column.colId;
            this.params.value = checked;
            this.params.api.undoRedoService.isFilling = true;
            this.params.node.setDataValue(colId, checked);
        };
        BtnCheckboxRenderedComponent.prototype.getParams = function () {
            return this.params;
        };
        BtnCheckboxRenderedComponent.prototype.ngOnDestroy = function () {
            // no need to remove the button click handler 
        };
        return BtnCheckboxRenderedComponent;
    }());
    /** @nocollapse */ BtnCheckboxRenderedComponent.ɵfac = function BtnCheckboxRenderedComponent_Factory(t) { return new (t || BtnCheckboxRenderedComponent)(); };
    /** @nocollapse */ BtnCheckboxRenderedComponent.ɵcmp = i0.ɵɵdefineComponent({ type: BtnCheckboxRenderedComponent, selectors: [["app-btn-checkbox-rendered"]], decls: 1, vars: 2, consts: [[3, "value", "checked", "click"]], template: function BtnCheckboxRenderedComponent_Template(rf, ctx) {
            if (rf & 1) {
                i0.ɵɵelementStart(0, "mat-checkbox", 0);
                i0.ɵɵlistener("click", function BtnCheckboxRenderedComponent_Template_mat_checkbox_click_0_listener($event) { return ctx.btnCheckedHandler($event); });
                i0.ɵɵelementEnd();
            }
            if (rf & 2) {
                i0.ɵɵproperty("value", ctx.params.value)("checked", ctx.params.value);
            }
        }, directives: [i1.MatCheckbox], styles: [""] });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(BtnCheckboxRenderedComponent, [{
                type: i0.Component,
                args: [{
                        selector: 'app-btn-checkbox-rendered',
                        templateUrl: './btn-checkbox-rendered.component.html',
                        styleUrls: ['./btn-checkbox-rendered.component.css']
                    }]
            }], null, null);
    })();

    var _c0 = ["input"];
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
    /** @nocollapse */ BtnCheckboxFilterComponent.ɵfac = function BtnCheckboxFilterComponent_Factory(t) { return new (t || BtnCheckboxFilterComponent)(); };
    /** @nocollapse */ BtnCheckboxFilterComponent.ɵcmp = i0.ɵɵdefineComponent({ type: BtnCheckboxFilterComponent, selectors: [["app-btn-checkbox-filter"]], viewQuery: function BtnCheckboxFilterComponent_Query(rf, ctx) {
            if (rf & 1) {
                i0.ɵɵviewQuery(_c0, true, i0.ViewContainerRef);
            }
            if (rf & 2) {
                var _t;
                i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.input = _t.first);
            }
        }, hostAttrs: [1, "hostClass"], decls: 11, vars: 9, consts: [[3, "change"], ["filterSelect", ""], ["value", ""], ["value", "true"], ["value", "false"]], template: function BtnCheckboxFilterComponent_Template(rf, ctx) {
            if (rf & 1) {
                var _r1_1 = i0.ɵɵgetCurrentView();
                i0.ɵɵelementStart(0, "select", 0, 1);
                i0.ɵɵlistener("change", function BtnCheckboxFilterComponent_Template_select_change_0_listener() { i0.ɵɵrestoreView(_r1_1); var _r0 = i0.ɵɵreference(1); return ctx.onChange(_r0.value); });
                i0.ɵɵelementStart(2, "option", 2);
                i0.ɵɵtext(3);
                i0.ɵɵpipe(4, "translate");
                i0.ɵɵelementEnd();
                i0.ɵɵelementStart(5, "option", 3);
                i0.ɵɵtext(6);
                i0.ɵɵpipe(7, "translate");
                i0.ɵɵelementEnd();
                i0.ɵɵelementStart(8, "option", 4);
                i0.ɵɵtext(9);
                i0.ɵɵpipe(10, "translate");
                i0.ɵɵelementEnd();
                i0.ɵɵelementEnd();
            }
            if (rf & 2) {
                i0.ɵɵadvance(3);
                i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(4, 3, "selectAll"));
                i0.ɵɵadvance(3);
                i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(7, 5, "enabled"));
                i0.ɵɵadvance(3);
                i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(10, 7, "disabled"));
            }
        }, directives: [i8.NgSelectOption, i8.ɵangular_packages_forms_forms_x], pipes: [i2$1.TranslatePipe], styles: [".hostClass[_ngcontent-%COMP%]{width:100%}"] });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(BtnCheckboxFilterComponent, [{
                type: i0.Component,
                args: [{
                        selector: 'app-btn-checkbox-filter',
                        templateUrl: './btn-checkbox-filter.component.html',
                        styleUrls: ['./btn-checkbox-filter.component.css'],
                        host: { 'class': 'hostClass' }
                    }]
            }], null, { input: [{
                    type: i0.ViewChild,
                    args: ['input', { read: i0.ViewContainerRef }]
                }] });
    })();

    var DialogMessageComponent = /** @class */ (function () {
        function DialogMessageComponent(dialogRef) {
            this.dialogRef = dialogRef;
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
    /** @nocollapse */ DialogMessageComponent.ɵfac = function DialogMessageComponent_Factory(t) { return new (t || DialogMessageComponent)(i0.ɵɵdirectiveInject(i1$1.MatDialogRef)); };
    /** @nocollapse */ DialogMessageComponent.ɵcmp = i0.ɵɵdefineComponent({ type: DialogMessageComponent, selectors: [["app-dialog-message"]], decls: 12, vars: 8, consts: [["mat-dialog-title", ""], [1, "mat-typography"], ["align", "end"], ["mat-button", "", 3, "click"], ["mat-button", "", "cdkFocusInitial", "", 3, "click"]], template: function DialogMessageComponent_Template(rf, ctx) {
            if (rf & 1) {
                i0.ɵɵelementStart(0, "h5", 0);
                i0.ɵɵtext(1);
                i0.ɵɵelementEnd();
                i0.ɵɵelementStart(2, "mat-dialog-content", 1);
                i0.ɵɵelementStart(3, "p");
                i0.ɵɵtext(4);
                i0.ɵɵelementEnd();
                i0.ɵɵelementEnd();
                i0.ɵɵelementStart(5, "mat-dialog-actions", 2);
                i0.ɵɵelementStart(6, "button", 3);
                i0.ɵɵlistener("click", function DialogMessageComponent_Template_button_click_6_listener() { return ctx.closeDialog(); });
                i0.ɵɵtext(7);
                i0.ɵɵpipe(8, "translate");
                i0.ɵɵelementEnd();
                i0.ɵɵelementStart(9, "button", 4);
                i0.ɵɵlistener("click", function DialogMessageComponent_Template_button_click_9_listener() { return ctx.doAccept(); });
                i0.ɵɵtext(10);
                i0.ɵɵpipe(11, "translate");
                i0.ɵɵelementEnd();
                i0.ɵɵelementEnd();
            }
            if (rf & 2) {
                i0.ɵɵadvance(1);
                i0.ɵɵtextInterpolate(ctx.title);
                i0.ɵɵadvance(3);
                i0.ɵɵtextInterpolate1(" ", ctx.message, " ");
                i0.ɵɵadvance(3);
                i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(8, 4, "cancel"));
                i0.ɵɵadvance(3);
                i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(11, 6, "accept"));
            }
        }, directives: [i1$1.MatDialogTitle, i1$1.MatDialogContent, i1$1.MatDialogActions, i3.MatButton], pipes: [i2$1.TranslatePipe], styles: [""] });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(DialogMessageComponent, [{
                type: i0.Component,
                args: [{
                        selector: 'app-dialog-message',
                        templateUrl: './dialog-message.component.html',
                        styleUrls: ['./dialog-message.component.css']
                    }]
            }], function () { return [{ type: i1$1.MatDialogRef }]; }, null);
    })();

    function DataGridComponent_span_1_Template(rf, ctx) {
        if (rf & 1) {
            i0.ɵɵelement(0, "span", 17);
        }
        if (rf & 2) {
            var ctx_r0 = i0.ɵɵnextContext();
            i0.ɵɵproperty("translate", ctx_r0.title);
        }
    }
    function DataGridComponent_button_2_Template(rf, ctx) {
        if (rf & 1) {
            var _r16_1 = i0.ɵɵgetCurrentView();
            i0.ɵɵelementStart(0, "button", 18);
            i0.ɵɵlistener("click", function DataGridComponent_button_2_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r16_1); var ctx_r15 = i0.ɵɵnextContext(); return ctx_r15.deleteChanges(); });
            i0.ɵɵpipe(1, "translate");
            i0.ɵɵelementStart(2, "mat-icon", 19);
            i0.ɵɵtext(3, " close ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementEnd();
        }
        if (rf & 2) {
            var ctx_r1 = i0.ɵɵnextContext();
            i0.ɵɵpropertyInterpolate("title", i0.ɵɵpipeBind1(1, 2, "cancel"));
            i0.ɵɵproperty("disabled", ctx_r1.changeCounter <= 0);
        }
    }
    function DataGridComponent_button_3_Template(rf, ctx) {
        if (rf & 1) {
            var _r18_1 = i0.ɵɵgetCurrentView();
            i0.ɵɵelementStart(0, "button", 20);
            i0.ɵɵlistener("click", function DataGridComponent_button_3_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r18_1); var ctx_r17 = i0.ɵɵnextContext(); return ctx_r17.undo(); });
            i0.ɵɵpipe(1, "translate");
            i0.ɵɵelementStart(2, "mat-icon", 19);
            i0.ɵɵtext(3, " undo ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementEnd();
        }
        if (rf & 2) {
            var ctx_r2 = i0.ɵɵnextContext();
            i0.ɵɵpropertyInterpolate("title", i0.ɵɵpipeBind1(1, 2, "undo"));
            i0.ɵɵproperty("disabled", ctx_r2.changeCounter <= 0);
        }
    }
    function DataGridComponent_button_4_Template(rf, ctx) {
        if (rf & 1) {
            var _r20_1 = i0.ɵɵgetCurrentView();
            i0.ɵɵelementStart(0, "button", 21);
            i0.ɵɵlistener("click", function DataGridComponent_button_4_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r20_1); var ctx_r19 = i0.ɵɵnextContext(); return ctx_r19.redo(); });
            i0.ɵɵpipe(1, "translate");
            i0.ɵɵelementStart(2, "mat-icon", 19);
            i0.ɵɵtext(3, " redo ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementEnd();
        }
        if (rf & 2) {
            var ctx_r3 = i0.ɵɵnextContext();
            i0.ɵɵpropertyInterpolate("title", i0.ɵɵpipeBind1(1, 2, "redo"));
            i0.ɵɵproperty("disabled", ctx_r3.redoCounter <= 0);
        }
    }
    function DataGridComponent_button_5_Template(rf, ctx) {
        if (rf & 1) {
            var _r22_1 = i0.ɵɵgetCurrentView();
            i0.ɵɵelementStart(0, "button", 22);
            i0.ɵɵlistener("click", function DataGridComponent_button_5_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r22_1); var ctx_r21 = i0.ɵɵnextContext(); return ctx_r21.applyChanges(); });
            i0.ɵɵpipe(1, "translate");
            i0.ɵɵelementStart(2, "mat-icon", 19);
            i0.ɵɵtext(3, " check ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementEnd();
        }
        if (rf & 2) {
            var ctx_r4 = i0.ɵɵnextContext();
            i0.ɵɵpropertyInterpolate("title", i0.ɵɵpipeBind1(1, 2, "accept"));
            i0.ɵɵproperty("disabled", ctx_r4.changeCounter <= 0);
        }
    }
    function DataGridComponent_label_7_Template(rf, ctx) {
        if (rf & 1) {
            i0.ɵɵelement(0, "label", 17);
        }
        if (rf & 2) {
            i0.ɵɵproperty("translate", "search");
        }
    }
    function DataGridComponent_input_8_Template(rf, ctx) {
        if (rf & 1) {
            var _r24_1 = i0.ɵɵgetCurrentView();
            i0.ɵɵelementStart(0, "input", 23);
            i0.ɵɵlistener("keyup", function DataGridComponent_input_8_Template_input_keyup_0_listener() { i0.ɵɵrestoreView(_r24_1); var ctx_r23 = i0.ɵɵnextContext(); return ctx_r23.quickSearch(); })("ngModelChange", function DataGridComponent_input_8_Template_input_ngModelChange_0_listener($event) { i0.ɵɵrestoreView(_r24_1); var ctx_r25 = i0.ɵɵnextContext(); return ctx_r25.searchValue = $event; });
            i0.ɵɵelementEnd();
        }
        if (rf & 2) {
            var ctx_r6 = i0.ɵɵnextContext();
            i0.ɵɵproperty("ngModel", ctx_r6.searchValue);
        }
    }
    function DataGridComponent_button_9_Template(rf, ctx) {
        if (rf & 1) {
            var _r27_1 = i0.ɵɵgetCurrentView();
            i0.ɵɵelementStart(0, "button", 24);
            i0.ɵɵlistener("click", function DataGridComponent_button_9_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r27_1); var ctx_r26 = i0.ɵɵnextContext(); return ctx_r26.removeData(); });
            i0.ɵɵelementStart(1, "mat-icon", 19);
            i0.ɵɵtext(2, " delete ");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(3, "span", 17);
            i0.ɵɵelementEnd();
        }
        if (rf & 2) {
            i0.ɵɵadvance(3);
            i0.ɵɵproperty("translate", "remove");
        }
    }
    function DataGridComponent_button_10_Template(rf, ctx) {
        if (rf & 1) {
            i0.ɵɵelementStart(0, "button", 25);
            i0.ɵɵelement(1, "span", 17);
            i0.ɵɵelementStart(2, "mat-icon", 19);
            i0.ɵɵtext(3, " keyboard_arrow_down ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementEnd();
        }
        if (rf & 2) {
            i0.ɵɵnextContext();
            var _r9 = i0.ɵɵreference(12);
            i0.ɵɵproperty("matMenuTriggerFor", _r9);
            i0.ɵɵadvance(1);
            i0.ɵɵproperty("translate", "actions");
        }
    }
    function DataGridComponent_button_13_Template(rf, ctx) {
        if (rf & 1) {
            var _r29_1 = i0.ɵɵgetCurrentView();
            i0.ɵɵelementStart(0, "button", 26);
            i0.ɵɵlistener("click", function DataGridComponent_button_13_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r29_1); var ctx_r28 = i0.ɵɵnextContext(); return ctx_r28.exportData(); });
            i0.ɵɵtext(1);
            i0.ɵɵpipe(2, "translate");
            i0.ɵɵelementEnd();
        }
        if (rf & 2) {
            i0.ɵɵadvance(1);
            i0.ɵɵtextInterpolate1(" ", i0.ɵɵpipeBind1(2, 1, "export"), " ");
        }
    }
    function DataGridComponent_button_14_Template(rf, ctx) {
        if (rf & 1) {
            var _r31_1 = i0.ɵɵgetCurrentView();
            i0.ɵɵelementStart(0, "button", 26);
            i0.ɵɵlistener("click", function DataGridComponent_button_14_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r31_1); var ctx_r30 = i0.ɵɵnextContext(); return ctx_r30.onDuplicateButtonClicked(); });
            i0.ɵɵtext(1);
            i0.ɵɵpipe(2, "translate");
            i0.ɵɵelementEnd();
        }
        if (rf & 2) {
            i0.ɵɵadvance(1);
            i0.ɵɵtextInterpolate1(" ", i0.ɵɵpipeBind1(2, 1, "duplicate"), "");
        }
    }
    function DataGridComponent_button_15_Template(rf, ctx) {
        if (rf & 1) {
            i0.ɵɵelementStart(0, "button", 27);
            i0.ɵɵtext(1);
            i0.ɵɵpipe(2, "translate");
            i0.ɵɵelementEnd();
        }
        if (rf & 2) {
            i0.ɵɵadvance(1);
            i0.ɵɵtextInterpolate1(" ", i0.ɵɵpipeBind1(2, 1, "search/replace"), "");
        }
    }
    function DataGridComponent_button_16_Template(rf, ctx) {
        if (rf & 1) {
            var _r33_1 = i0.ɵɵgetCurrentView();
            i0.ɵɵelementStart(0, "button", 28);
            i0.ɵɵlistener("click", function DataGridComponent_button_16_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r33_1); var ctx_r32 = i0.ɵɵnextContext(); return ctx_r32.newData(); });
            i0.ɵɵelementStart(1, "mat-icon", 19);
            i0.ɵɵtext(2, " add_circle_outline ");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(3, "span", 17);
            i0.ɵɵelementEnd();
        }
        if (rf & 2) {
            i0.ɵɵadvance(3);
            i0.ɵɵproperty("translate", "new");
        }
    }
    function DataGridComponent_button_17_Template(rf, ctx) {
        if (rf & 1) {
            var _r35_1 = i0.ɵɵgetCurrentView();
            i0.ɵɵelementStart(0, "button", 28);
            i0.ɵɵlistener("click", function DataGridComponent_button_17_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r35_1); var ctx_r34 = i0.ɵɵnextContext(); return ctx_r34.onAddButtonClicked(); });
            i0.ɵɵelementStart(1, "mat-icon", 19);
            i0.ɵɵtext(2, " add_circle_outline ");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(3, "span", 17);
            i0.ɵɵelementEnd();
        }
        if (rf & 2) {
            i0.ɵɵadvance(3);
            i0.ɵɵproperty("translate", "add");
        }
    }
    var DataGridComponent = /** @class */ (function () {
        function DataGridComponent(dialog, translate) {
            var _this = this;
            this.dialog = dialog;
            this.translate = translate;
            this.modules = allModules.AllCommunityModules;
            this.statusColumn = false;
            this.changesMap = new Map();
            this.modificationChange = false;
            this.undoNoChanges = false; // Boolean that indicates if an undo hasn't modifications
            this.translate = translate;
            this.frameworkComponents = {
                btnEditRendererComponent: BtnEditRenderedComponent,
                btnCheckboxRendererComponent: BtnCheckboxRenderedComponent,
                btnCheckboxFilterComponent: BtnCheckboxFilterComponent
            };
            this.remove = new i0.EventEmitter();
            this.new = new i0.EventEmitter();
            this.add = new i0.EventEmitter();
            this.sendChanges = new i0.EventEmitter();
            this.getSelectedRows = new i0.EventEmitter();
            this.duplicate = new i0.EventEmitter();
            this.getAllRows = new i0.EventEmitter();
            this.changeCounter = 0;
            this.previousChangeCounter = 0;
            this.redoCounter = 0;
            this.gridOptions = {
                defaultColDef: {
                    sortable: true,
                    flex: 1,
                    filter: true,
                    editable: !this.nonEditable,
                    cellStyle: { backgroundColor: '#FFFFFF' },
                    suppressMenu: true,
                    resizable: true
                },
                columnTypes: {
                    dateColumn: {
                        filter: 'agDateColumnFilter',
                        filterParams: {
                            comparator: function (filterLocalDateAtMidnight, cellValue) {
                                var dateCellValue = new Date(cellValue);
                                var dateFilter = new Date(filterLocalDateAtMidnight);
                                if (dateCellValue.getTime() < dateFilter.getTime()) {
                                    return -1;
                                }
                                else if (dateCellValue.getTime() > dateFilter.getTime()) {
                                    return 1;
                                }
                                else {
                                    return 0;
                                }
                            },
                        },
                        suppressMenu: true
                    }
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
                this._eventGetAllRowsSubscription = this.eventGetAllRowsSubscription.subscribe(function () {
                    _this.emitAllRows();
                });
            }
            if (this.eventSaveAgGridStateSubscription) {
                this._eventSaveAgGridStateSubscription = this.eventSaveAgGridStateSubscription.subscribe(function () {
                    _this.saveAgGridState();
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
            this.getElements();
            console.log(this.columnDefs);
            try {
                for (var _b = __values(this.columnDefs), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var col = _c.value;
                    if (col.field === 'status') {
                        console.log("status column true");
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
        };
        DataGridComponent.prototype.emitSelectedRows = function () {
            var selectedNodes = this.gridApi.getSelectedNodes();
            var selectedData = selectedNodes.map(function (node) { return node.data; });
            this.getSelectedRows.emit(selectedData);
        };
        DataGridComponent.prototype.emitAllRows = function () {
            var rowData = [];
            this.gridApi.forEachNode(function (node) { return rowData.push(node.data); });
            this.getAllRows.emit(rowData);
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
                _this.rowData = items;
                _this.gridApi.setRowData(_this.rowData);
                _this.gridApi.sizeColumnsToFit();
                console.log(_this.rowData);
            });
        };
        DataGridComponent.prototype.addItems = function (newItems) {
            var _this = this;
            console.log(newItems);
            var itemsToAdd = [];
            newItems.forEach(function (item) {
                if (item.id == undefined || (_this.rowData.find(function (element) { return element.id === item.id; })) == undefined) {
                    if (_this.statusColumn) {
                        item.status = 'Pending creation';
                    }
                    itemsToAdd.push(item);
                    _this.rowData.push(item);
                }
                else {
                    console.log("Item with the ID " + item.id + " already exists");
                }
            });
            this.gridApi.updateRowData({ add: itemsToAdd });
            console.log(this.columnDefs);
            // params.oldValue!=undefined
        };
        DataGridComponent.prototype.removeData = function () {
            var e_2, _a;
            this.gridApi.stopEditing(false);
            var selectedNodes = this.gridApi.getSelectedNodes();
            var selectedData = selectedNodes.map(function (node) { return node.data; });
            this.remove.emit(selectedData);
            if (this.statusColumn) {
                var selectedRows = selectedNodes.map(function (node) { return node.id; });
                try {
                    for (var selectedRows_1 = __values(selectedRows), selectedRows_1_1 = selectedRows_1.next(); !selectedRows_1_1.done; selectedRows_1_1 = selectedRows_1.next()) {
                        var id = selectedRows_1_1.value;
                        this.gridApi.getRowNode(id).data.status = 'Deleted';
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (selectedRows_1_1 && !selectedRows_1_1.done && (_a = selectedRows_1.return)) _a.call(selectedRows_1);
                    }
                    finally { if (e_2) throw e_2.error; }
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
            this.add.emit(-1);
        };
        DataGridComponent.prototype.onDuplicateButtonClicked = function () {
            var _this = this;
            this.gridApi.stopEditing(false);
            console.log(this.changeCounter);
            if (this.changeCounter > 0) {
                var dialogRef = this.dialog.open(DialogMessageComponent);
                dialogRef.componentInstance.title = 'Caution';
                dialogRef.componentInstance.message = 'If you duplicate rows without apply changes, your modifications will be overwritted, do you want to continue?';
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
            }
        };
        DataGridComponent.prototype.applyChanges = function () {
            var e_3, _a;
            var itemsChanged = [];
            this.gridApi.stopEditing(false);
            try {
                for (var _b = __values(this.changesMap.keys()), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var key = _c.value;
                    itemsChanged.push(this.gridApi.getRowNode(key).data);
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_3) throw e_3.error; }
            }
            this.sendChanges.emit(itemsChanged);
            this.changesMap.clear();
            this.changeCounter = 0;
            this.previousChangeCounter = 0;
            this.redoCounter = 0;
            this.params.colDef.cellStyle = { backgroundColor: '#FFFFFF' };
            this.gridApi.redrawRows();
        };
        DataGridComponent.prototype.deleteChanges = function () {
            this.gridApi.stopEditing(false);
            while (this.changeCounter > 0) {
                this.undo();
            }
            this.changesMap.clear();
            //this.previousChangeCounter = 0;
            this.redoCounter = 0;
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
                this.redoCounter = 0;
                this.onCellValueChanged(e);
                this.modificationChange = false;
            }
        };
        DataGridComponent.prototype.onCellValueChanged = function (params) {
            console.log("value Change");
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
                            if (this.gridApi.getRowNode(params.node.id).data.status !== 'Pending creation') {
                                this.gridApi.getRowNode(params.node.id).data.status = 'Modified';
                            }
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
                            if (this.gridApi.getRowNode(params.node.id).data.status !== 'Pending creation') {
                                this.gridApi.getRowNode(params.node.id).data.status = '';
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
            this.changeCellStyleColumns(params, changesMap, '#E8F1DE');
            this.gridApi.redrawRows({ rowNodes: [row] });
            this.changeCellStyleColumns(params, changesMap, '#FFFFFF');
            // We will define cellStyle white to future modifications (like filter)
        };
        DataGridComponent.prototype.changeCellStyleColumns = function (params, changesMap, color) {
            var e_4, _a;
            try {
                for (var _b = __values(changesMap.get(params.node.id).keys()), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var key = _c.value;
                    var columnNumber = this.getColumnIndexByColId(this.gridColumnApi, key);
                    this.gridColumnApi.columnController.gridColumns[columnNumber].colDef.cellStyle = { backgroundColor: color };
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_4) throw e_4.error; }
            }
        };
        return DataGridComponent;
    }());
    /** @nocollapse */ DataGridComponent.ɵfac = function DataGridComponent_Factory(t) { return new (t || DataGridComponent)(i0.ɵɵdirectiveInject(i1$1.MatDialog), i0.ɵɵdirectiveInject(i2$1.TranslateService)); };
    /** @nocollapse */ DataGridComponent.ɵcmp = i0.ɵɵdefineComponent({ type: DataGridComponent, selectors: [["app-data-grid"]], inputs: { eventRefreshSubscription: "eventRefreshSubscription", eventGetSelectedRowsSubscription: "eventGetSelectedRowsSubscription", eventGetAllRowsSubscription: "eventGetAllRowsSubscription", eventSaveAgGridStateSubscription: "eventSaveAgGridStateSubscription", eventAddItemsSubscription: "eventAddItemsSubscription", frameworkComponents: "frameworkComponents", columnDefs: "columnDefs", getAll: "getAll", discardChangesButton: "discardChangesButton", id: "id", undoButton: "undoButton", redoButton: "redoButton", applyChangesButton: "applyChangesButton", deleteButton: "deleteButton", newButton: "newButton", actionButton: "actionButton", addButton: "addButton", globalSearch: "globalSearch", themeGrid: "themeGrid", singleSelection: "singleSelection", nonEditable: "nonEditable", title: "title", hideExportButton: "hideExportButton", hideDuplicateButton: "hideDuplicateButton", hideSearchReplaceButton: "hideSearchReplaceButton" }, outputs: { remove: "remove", new: "new", add: "add", sendChanges: "sendChanges", duplicate: "duplicate", getSelectedRows: "getSelectedRows", getAllRows: "getAllRows", getAgGridState: "getAgGridState" }, decls: 21, vars: 27, consts: [["id", "grup1", 1, "editDivBtns"], [3, "translate", 4, "ngIf"], ["mat-mini-fab", "", "class", "editBtn", "id", "deleteChangesButton", "type", "button", 3, "title", "disabled", "click", 4, "ngIf"], ["mat-mini-fab", "", "class", "editBtn", "id", "undo", 3, "title", "disabled", "click", 4, "ngIf"], ["mat-mini-fab", "", "class", "editBtn", "id", "redo", 3, "title", "disabled", "click", 4, "ngIf"], ["mat-mini-fab", "", "class", "editBtn", "id", "applyChangesButton", 3, "title", "disabled", "click", 4, "ngIf"], ["id", "grup2", 1, "actionsDivBtns"], ["type", "text", "class", "searchGenericInput", "placeholder", "", "ml-2", "", 3, "ngModel", "keyup", "ngModelChange", 4, "ngIf"], ["mat-stroked-button", "", "id", "deleteButton", 3, "click", 4, "ngIf"], ["mat-stroked-button", "", "id", "actionButton", 3, "matMenuTriggerFor", 4, "ngIf"], ["menu", "matMenu"], ["mat-menu-item", "", 3, "click", 4, "ngIf"], ["mat-menu-item", "", 4, "ngIf"], ["mat-stroked-button", "", "id", "newButton", 3, "click", 4, "ngIf"], [1, "row", 2, "height", "100%"], ["id", "myGrid", 2, "width", "100%", "height", "100%"], ["rowSelection", "multiple", "multiSortKey", "key", 2, "width", "100%", "height", "100%", 3, "floatingFilter", "rowData", "columnDefs", "gridOptions", "animateRows", "pagination", "modules", "undoRedoCellEditing", "undoRedoCellEditingLimit", "suppressRowClickSelection", "frameworkComponents", "filterModified", "cellEditingStopped", "cellValueChanged", "gridReady", "firstDataRendered"], [3, "translate"], ["mat-mini-fab", "", "id", "deleteChangesButton", "type", "button", 1, "editBtn", 3, "title", "disabled", "click"], ["fontSet", "material-icons-round"], ["mat-mini-fab", "", "id", "undo", 1, "editBtn", 3, "title", "disabled", "click"], ["mat-mini-fab", "", "id", "redo", 1, "editBtn", 3, "title", "disabled", "click"], ["mat-mini-fab", "", "id", "applyChangesButton", 1, "editBtn", 3, "title", "disabled", "click"], ["type", "text", "placeholder", "", "ml-2", "", 1, "searchGenericInput", 3, "ngModel", "keyup", "ngModelChange"], ["mat-stroked-button", "", "id", "deleteButton", 3, "click"], ["mat-stroked-button", "", "id", "actionButton", 3, "matMenuTriggerFor"], ["mat-menu-item", "", 3, "click"], ["mat-menu-item", ""], ["mat-stroked-button", "", "id", "newButton", 3, "click"]], template: function DataGridComponent_Template(rf, ctx) {
            if (rf & 1) {
                i0.ɵɵelementStart(0, "div", 0);
                i0.ɵɵtemplate(1, DataGridComponent_span_1_Template, 1, 1, "span", 1);
                i0.ɵɵtemplate(2, DataGridComponent_button_2_Template, 4, 4, "button", 2);
                i0.ɵɵtemplate(3, DataGridComponent_button_3_Template, 4, 4, "button", 3);
                i0.ɵɵtemplate(4, DataGridComponent_button_4_Template, 4, 4, "button", 4);
                i0.ɵɵtemplate(5, DataGridComponent_button_5_Template, 4, 4, "button", 5);
                i0.ɵɵelementEnd();
                i0.ɵɵelementStart(6, "div", 6);
                i0.ɵɵtemplate(7, DataGridComponent_label_7_Template, 1, 1, "label", 1);
                i0.ɵɵtemplate(8, DataGridComponent_input_8_Template, 1, 1, "input", 7);
                i0.ɵɵtemplate(9, DataGridComponent_button_9_Template, 4, 1, "button", 8);
                i0.ɵɵtemplate(10, DataGridComponent_button_10_Template, 4, 2, "button", 9);
                i0.ɵɵelementStart(11, "mat-menu", null, 10);
                i0.ɵɵtemplate(13, DataGridComponent_button_13_Template, 3, 3, "button", 11);
                i0.ɵɵtemplate(14, DataGridComponent_button_14_Template, 3, 3, "button", 11);
                i0.ɵɵtemplate(15, DataGridComponent_button_15_Template, 3, 3, "button", 12);
                i0.ɵɵelementEnd();
                i0.ɵɵtemplate(16, DataGridComponent_button_16_Template, 4, 1, "button", 13);
                i0.ɵɵtemplate(17, DataGridComponent_button_17_Template, 4, 1, "button", 13);
                i0.ɵɵelementEnd();
                i0.ɵɵelementStart(18, "div", 14);
                i0.ɵɵelementStart(19, "div", 15);
                i0.ɵɵelementStart(20, "ag-grid-angular", 16);
                i0.ɵɵlistener("filterModified", function DataGridComponent_Template_ag_grid_angular_filterModified_20_listener() { return ctx.onFilterModified(); })("cellEditingStopped", function DataGridComponent_Template_ag_grid_angular_cellEditingStopped_20_listener($event) { return ctx.onCellEditingStopped($event); })("cellValueChanged", function DataGridComponent_Template_ag_grid_angular_cellValueChanged_20_listener($event) { return ctx.onCellValueChanged($event); })("gridReady", function DataGridComponent_Template_ag_grid_angular_gridReady_20_listener($event) { return ctx.onGridReady($event); })("firstDataRendered", function DataGridComponent_Template_ag_grid_angular_firstDataRendered_20_listener() { return ctx.firstDataRendered(); });
                i0.ɵɵelementEnd();
                i0.ɵɵelementEnd();
                i0.ɵɵelementEnd();
            }
            if (rf & 2) {
                i0.ɵɵadvance(1);
                i0.ɵɵproperty("ngIf", ctx.title);
                i0.ɵɵadvance(1);
                i0.ɵɵproperty("ngIf", ctx.discardChangesButton);
                i0.ɵɵadvance(1);
                i0.ɵɵproperty("ngIf", ctx.undoButton);
                i0.ɵɵadvance(1);
                i0.ɵɵproperty("ngIf", ctx.redoButton);
                i0.ɵɵadvance(1);
                i0.ɵɵproperty("ngIf", ctx.applyChangesButton);
                i0.ɵɵadvance(2);
                i0.ɵɵproperty("ngIf", ctx.globalSearch);
                i0.ɵɵadvance(1);
                i0.ɵɵproperty("ngIf", ctx.globalSearch);
                i0.ɵɵadvance(1);
                i0.ɵɵproperty("ngIf", ctx.deleteButton);
                i0.ɵɵadvance(1);
                i0.ɵɵproperty("ngIf", ctx.actionButton);
                i0.ɵɵadvance(3);
                i0.ɵɵproperty("ngIf", !ctx.hideExportButton);
                i0.ɵɵadvance(1);
                i0.ɵɵproperty("ngIf", !ctx.hideDuplicateButton);
                i0.ɵɵadvance(1);
                i0.ɵɵproperty("ngIf", !ctx.hideSearchReplaceButton);
                i0.ɵɵadvance(1);
                i0.ɵɵproperty("ngIf", ctx.newButton);
                i0.ɵɵadvance(1);
                i0.ɵɵproperty("ngIf", ctx.addButton);
                i0.ɵɵadvance(3);
                i0.ɵɵclassMap(ctx.themeGrid);
                i0.ɵɵproperty("floatingFilter", true)("rowData", ctx.rowData)("columnDefs", ctx.columnDefs)("gridOptions", ctx.gridOptions)("animateRows", true)("pagination", false)("modules", ctx.modules)("undoRedoCellEditing", true)("undoRedoCellEditingLimit", 200)("suppressRowClickSelection", true)("frameworkComponents", ctx.frameworkComponents);
            }
        }, directives: [i2$2.NgIf, i4._MatMenu, i5.AgGridAngular, i2$1.TranslateDirective, i3.MatButton, i2.MatIcon, i8.DefaultValueAccessor, i8.NgControlStatus, i8.NgModel, i4.MatMenuTrigger, i4.MatMenuItem], pipes: [i2$1.TranslatePipe], styles: ["input[_ngcontent-%COMP%], label[_ngcontent-%COMP%]{display:inline-block;margin:5px 5px 5px 10px}#newButton[_ngcontent-%COMP%]{background:#68a225 0 0 no-repeat padding-box;color:#fff;margin-left:3px}#actionButton[_ngcontent-%COMP%], #deleteButton[_ngcontent-%COMP%]{background:#fff 0 0 no-repeat padding-box;margin-left:3px}#actionButton[_ngcontent-%COMP%]{text-align:center!important}#applyChangesButton[_ngcontent-%COMP%]{background:#68a225 0 0 no-repeat padding-box;color:#fff!important;margin-left:3px}#applyChangesButton[disabled][_ngcontent-%COMP%]{background:#83976c 0 0 no-repeat padding-box}#redo[_ngcontent-%COMP%]{background:#ff9300;color:#fff!important;margin-left:3px}#redo[disabled][_ngcontent-%COMP%]{background:#ffc97f;margin-left:3px}#undo[_ngcontent-%COMP%]{background:#ff9300;color:#fff!important;margin-left:3px}#undo[disabled][_ngcontent-%COMP%]{background:#ffc97f;margin-left:3px}#deleteChangesButton[_ngcontent-%COMP%]{background:#df3133;color:#fff!important}#deleteChangesButton[disabled][_ngcontent-%COMP%]{background:#da8c8e;color:#fff!important}.editDivBtns[_ngcontent-%COMP%]{height:30px!important;line-height:30px!important;margin-left:10px;text-align:start;width:130px}.actionsDivBtns[_ngcontent-%COMP%]{height:60px;text-align:end;width:calc(100% - 140px)}.actionsDivBtns[_ngcontent-%COMP%], .editDivBtns[_ngcontent-%COMP%]{display:inline-block!important}.actionsDivBtns[_ngcontent-%COMP%]   .mat-stroked-button[_ngcontent-%COMP%]{padding:5px 20px!important}.editDivBtns[_ngcontent-%COMP%]   .mat-mini-fab[_ngcontent-%COMP%]   .mat-button-wrapper[_ngcontent-%COMP%]{display:inherit!important;padding:inherit!important}.editDivBtns[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%]{bottom:5px;height:30px!important;position:relative}.editDivBtns[_ngcontent-%COMP%]   .mat-mini-fab[_ngcontent-%COMP%]{height:30px;width:30px}.actionsDivBtns[_ngcontent-%COMP%]   .searchGenericInput[_ngcontent-%COMP%]{height:45px!important;width:45%!important}.ag-body-viewport.ag-layout-normal[_ngcontent-%COMP%]   [_ngcontent-%COMP%]::-webkit-scrollbar-thumb{background:#eee}\u200B[_ngcontent-%COMP%]   .ag-body-viewport.ag-layout-normal[_ngcontent-%COMP%]   [_ngcontent-%COMP%]::-webkit-scrollbar{height:2em;width:2em}.ag-body-viewport.ag-layout-normal[_ngcontent-%COMP%]   [_ngcontent-%COMP%]::-webkit-scrollbar-button{background:#ccc}.ag-body-viewport.ag-layout-normal[_ngcontent-%COMP%]::-webkit-scrollbar-track-piece{background:#888}"] });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(DataGridComponent, [{
                type: i0.Component,
                args: [{
                        selector: 'app-data-grid',
                        templateUrl: './data-grid.component.html',
                        styleUrls: ['./data-grid.component.css']
                    }]
            }], function () { return [{ type: i1$1.MatDialog }, { type: i2$1.TranslateService }]; }, { eventRefreshSubscription: [{
                    type: i0.Input
                }], eventGetSelectedRowsSubscription: [{
                    type: i0.Input
                }], eventGetAllRowsSubscription: [{
                    type: i0.Input
                }], eventSaveAgGridStateSubscription: [{
                    type: i0.Input
                }], eventAddItemsSubscription: [{
                    type: i0.Input
                }], frameworkComponents: [{
                    type: i0.Input
                }], columnDefs: [{
                    type: i0.Input
                }], getAll: [{
                    type: i0.Input
                }], discardChangesButton: [{
                    type: i0.Input
                }], id: [{
                    type: i0.Input
                }], undoButton: [{
                    type: i0.Input
                }], redoButton: [{
                    type: i0.Input
                }], applyChangesButton: [{
                    type: i0.Input
                }], deleteButton: [{
                    type: i0.Input
                }], newButton: [{
                    type: i0.Input
                }], actionButton: [{
                    type: i0.Input
                }], addButton: [{
                    type: i0.Input
                }], globalSearch: [{
                    type: i0.Input
                }], themeGrid: [{
                    type: i0.Input
                }], singleSelection: [{
                    type: i0.Input
                }], nonEditable: [{
                    type: i0.Input
                }], title: [{
                    type: i0.Input
                }], hideExportButton: [{
                    type: i0.Input
                }], hideDuplicateButton: [{
                    type: i0.Input
                }], hideSearchReplaceButton: [{
                    type: i0.Input
                }], remove: [{
                    type: i0.Output
                }], new: [{
                    type: i0.Output
                }], add: [{
                    type: i0.Output
                }], sendChanges: [{
                    type: i0.Output
                }], duplicate: [{
                    type: i0.Output
                }], getSelectedRows: [{
                    type: i0.Output
                }], getAllRows: [{
                    type: i0.Output
                }], getAgGridState: [{
                    type: i0.Output
                }] });
    })();

    var MaterialModule = /** @class */ (function () {
        function MaterialModule() {
        }
        return MaterialModule;
    }());
    /** @nocollapse */ MaterialModule.ɵmod = i0.ɵɵdefineNgModule({ type: MaterialModule });
    /** @nocollapse */ MaterialModule.ɵinj = i0.ɵɵdefineInjector({ factory: function MaterialModule_Factory(t) { return new (t || MaterialModule)(); }, imports: [a11y.A11yModule,
            stepper.CdkStepperModule,
            table.CdkTableModule,
            tree.CdkTreeModule,
            dragDrop.DragDropModule,
            autocomplete.MatAutocompleteModule,
            badge.MatBadgeModule,
            bottomSheet.MatBottomSheetModule,
            i3.MatButtonModule,
            buttonToggle.MatButtonToggleModule,
            card.MatCardModule,
            i1.MatCheckboxModule,
            chips.MatChipsModule,
            stepper$1.MatStepperModule,
            datepicker.MatDatepickerModule,
            i1$1.MatDialogModule,
            divider.MatDividerModule,
            expansion.MatExpansionModule,
            gridList.MatGridListModule,
            i2.MatIconModule,
            input.MatInputModule,
            list.MatListModule,
            i4.MatMenuModule,
            core.MatNativeDateModule,
            paginator.MatPaginatorModule,
            progressBar.MatProgressBarModule,
            progressSpinner.MatProgressSpinnerModule,
            radio.MatRadioModule,
            core.MatRippleModule,
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
            i1$2.MatTreeModule,
            portal.PortalModule,
            scrolling.ScrollingModule,
            formField.MatFormFieldModule] });
    (function () {
        (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(MaterialModule, { exports: [a11y.A11yModule,
                stepper.CdkStepperModule,
                table.CdkTableModule,
                tree.CdkTreeModule,
                dragDrop.DragDropModule,
                autocomplete.MatAutocompleteModule,
                badge.MatBadgeModule,
                bottomSheet.MatBottomSheetModule,
                i3.MatButtonModule,
                buttonToggle.MatButtonToggleModule,
                card.MatCardModule,
                i1.MatCheckboxModule,
                chips.MatChipsModule,
                stepper$1.MatStepperModule,
                datepicker.MatDatepickerModule,
                i1$1.MatDialogModule,
                divider.MatDividerModule,
                expansion.MatExpansionModule,
                gridList.MatGridListModule,
                i2.MatIconModule,
                input.MatInputModule,
                list.MatListModule,
                i4.MatMenuModule,
                core.MatNativeDateModule,
                paginator.MatPaginatorModule,
                progressBar.MatProgressBarModule,
                progressSpinner.MatProgressSpinnerModule,
                radio.MatRadioModule,
                core.MatRippleModule,
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
                i1$2.MatTreeModule,
                portal.PortalModule,
                scrolling.ScrollingModule,
                formField.MatFormFieldModule] });
    })();
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(MaterialModule, [{
                type: i0.NgModule,
                args: [{
                        exports: [
                            a11y.A11yModule,
                            stepper.CdkStepperModule,
                            table.CdkTableModule,
                            tree.CdkTreeModule,
                            dragDrop.DragDropModule,
                            autocomplete.MatAutocompleteModule,
                            badge.MatBadgeModule,
                            bottomSheet.MatBottomSheetModule,
                            i3.MatButtonModule,
                            buttonToggle.MatButtonToggleModule,
                            card.MatCardModule,
                            i1.MatCheckboxModule,
                            chips.MatChipsModule,
                            stepper$1.MatStepperModule,
                            datepicker.MatDatepickerModule,
                            i1$1.MatDialogModule,
                            divider.MatDividerModule,
                            expansion.MatExpansionModule,
                            gridList.MatGridListModule,
                            i2.MatIconModule,
                            input.MatInputModule,
                            list.MatListModule,
                            i4.MatMenuModule,
                            core.MatNativeDateModule,
                            paginator.MatPaginatorModule,
                            progressBar.MatProgressBarModule,
                            progressSpinner.MatProgressSpinnerModule,
                            radio.MatRadioModule,
                            core.MatRippleModule,
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
                            i1$2.MatTreeModule,
                            portal.PortalModule,
                            scrolling.ScrollingModule,
                            formField.MatFormFieldModule
                        ]
                    }]
            }], null, null);
    })();

    var _c0$1 = function (a0) { return { "margin-top": a0 }; };
    function DialogGridComponent_div_3_Template(rf, ctx) {
        if (rf & 1) {
            var _r4_1 = i0.ɵɵgetCurrentView();
            i0.ɵɵelementStart(0, "div", 6);
            i0.ɵɵelementStart(1, "app-data-grid", 7);
            i0.ɵɵlistener("getSelectedRows", function DialogGridComponent_div_3_Template_app_data_grid_getSelectedRows_1_listener($event) { i0.ɵɵrestoreView(_r4_1); var ctx_r3 = i0.ɵɵnextContext(); return ctx_r3.joinRowsReceived($event); });
            i0.ɵɵelementEnd();
            i0.ɵɵelementEnd();
        }
        if (rf & 2) {
            var getAll_r1 = ctx.$implicit;
            var i_r2 = ctx.index;
            var ctx_r0 = i0.ɵɵnextContext();
            i0.ɵɵproperty("ngStyle", i0.ɵɵpureFunction1(9, _c0$1, i_r2 > 0 ? "100px" : "0px"));
            i0.ɵɵadvance(1);
            i0.ɵɵproperty("columnDefs", ctx_r0.columnDefsTable[i_r2])("themeGrid", ctx_r0.themeGrid)("getAll", getAll_r1)("globalSearch", true)("singleSelection", ctx_r0.singleSelectionTable[i_r2])("title", ctx_r0.titlesTable[i_r2])("nonEditable", ctx_r0.nonEditable)("eventGetSelectedRowsSubscription", ctx_r0.getAllRows.asObservable());
        }
    }
    var DialogGridComponent = /** @class */ (function () {
        function DialogGridComponent(dialogRef) {
            this.dialogRef = dialogRef;
            this.getAllRows = new rxjs.Subject();
            this.allRowsReceived = [];
            this.joinTables = new i0.EventEmitter();
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
    /** @nocollapse */ DialogGridComponent.ɵfac = function DialogGridComponent_Factory(t) { return new (t || DialogGridComponent)(i0.ɵɵdirectiveInject(i1$1.MatDialogRef)); };
    /** @nocollapse */ DialogGridComponent.ɵcmp = i0.ɵɵdefineComponent({ type: DialogGridComponent, selectors: [["app-dialog-grid"]], outputs: { joinTables: "joinTables" }, decls: 11, vars: 8, consts: [["mat-dialog-title", ""], [1, "dialogConent"], ["class", "appDialogDataGridDiv", 3, "ngStyle", 4, "ngFor", "ngForOf"], ["mat-dialog-actions", "", "align", "end"], ["mat-button", "", 3, "click"], ["mat-button", "", "cdkFocusInitial", "", 3, "click"], [1, "appDialogDataGridDiv", 3, "ngStyle"], [3, "columnDefs", "themeGrid", "getAll", "globalSearch", "singleSelection", "title", "nonEditable", "eventGetSelectedRowsSubscription", "getSelectedRows"]], template: function DialogGridComponent_Template(rf, ctx) {
            if (rf & 1) {
                i0.ɵɵelementStart(0, "h5", 0);
                i0.ɵɵtext(1);
                i0.ɵɵelementEnd();
                i0.ɵɵelementStart(2, "mat-dialog-content", 1);
                i0.ɵɵtemplate(3, DialogGridComponent_div_3_Template, 2, 11, "div", 2);
                i0.ɵɵelementEnd();
                i0.ɵɵelementStart(4, "div", 3);
                i0.ɵɵelementStart(5, "button", 4);
                i0.ɵɵlistener("click", function DialogGridComponent_Template_button_click_5_listener() { return ctx.closeDialog(); });
                i0.ɵɵtext(6);
                i0.ɵɵpipe(7, "translate");
                i0.ɵɵelementEnd();
                i0.ɵɵelementStart(8, "button", 5);
                i0.ɵɵlistener("click", function DialogGridComponent_Template_button_click_8_listener() { return ctx.getAllSelectedRows(); });
                i0.ɵɵtext(9);
                i0.ɵɵpipe(10, "translate");
                i0.ɵɵelementEnd();
                i0.ɵɵelementEnd();
            }
            if (rf & 2) {
                i0.ɵɵadvance(1);
                i0.ɵɵtextInterpolate(ctx.title);
                i0.ɵɵadvance(2);
                i0.ɵɵproperty("ngForOf", ctx.getAllsTable);
                i0.ɵɵadvance(3);
                i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(7, 4, "cancel"));
                i0.ɵɵadvance(3);
                i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(10, 6, "add"));
            }
        }, directives: [i1$1.MatDialogTitle, i1$1.MatDialogContent, i2$2.NgForOf, i1$1.MatDialogActions, i3.MatButton, i2$2.NgStyle, DataGridComponent], pipes: [i2$1.TranslatePipe], styles: [".dialogConent[_ngcontent-%COMP%]{height:100%;margin:inherit!important;max-height:60vh!important;overflow:auto;padding:inherit!important;width:100%}"] });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(DialogGridComponent, [{
                type: i0.Component,
                args: [{
                        selector: 'app-dialog-grid',
                        templateUrl: './dialog-grid.component.html',
                        styleUrls: ['./dialog-grid.component.css']
                    }]
            }], function () { return [{ type: i1$1.MatDialogRef }]; }, { joinTables: [{
                    type: i0.Output
                }] });
    })();

    function DialogFormComponent_ng_container_3_Template(rf, ctx) {
        if (rf & 1) {
            i0.ɵɵelementContainer(0);
        }
    }
    var DialogFormComponent = /** @class */ (function () {
        function DialogFormComponent(dialogRef) {
            this.dialogRef = dialogRef;
        }
        DialogFormComponent.prototype.ngOnInit = function () {
        };
        DialogFormComponent.prototype.doAdd = function () {
            this.dialogRef.close({ event: 'Add' });
        };
        DialogFormComponent.prototype.closeDialog = function () {
            this.dialogRef.close({ event: 'Cancel' });
        };
        return DialogFormComponent;
    }());
    /** @nocollapse */ DialogFormComponent.ɵfac = function DialogFormComponent_Factory(t) { return new (t || DialogFormComponent)(i0.ɵɵdirectiveInject(i1$1.MatDialogRef)); };
    /** @nocollapse */ DialogFormComponent.ɵcmp = i0.ɵɵdefineComponent({ type: DialogFormComponent, selectors: [["app-dialog-form"]], decls: 11, vars: 8, consts: [["mat-dialog-title", ""], [1, "mat-typography"], [4, "ngTemplateOutlet"], ["align", "end"], ["mat-button", "", 3, "click"], ["mat-button", "", "cdkFocusInitial", "", 3, "click"]], template: function DialogFormComponent_Template(rf, ctx) {
            if (rf & 1) {
                i0.ɵɵelementStart(0, "h5", 0);
                i0.ɵɵtext(1);
                i0.ɵɵelementEnd();
                i0.ɵɵelementStart(2, "mat-dialog-content", 1);
                i0.ɵɵtemplate(3, DialogFormComponent_ng_container_3_Template, 1, 0, "ng-container", 2);
                i0.ɵɵelementEnd();
                i0.ɵɵelementStart(4, "mat-dialog-actions", 3);
                i0.ɵɵelementStart(5, "button", 4);
                i0.ɵɵlistener("click", function DialogFormComponent_Template_button_click_5_listener() { return ctx.closeDialog(); });
                i0.ɵɵtext(6);
                i0.ɵɵpipe(7, "translate");
                i0.ɵɵelementEnd();
                i0.ɵɵelementStart(8, "button", 5);
                i0.ɵɵlistener("click", function DialogFormComponent_Template_button_click_8_listener() { return ctx.doAdd(); });
                i0.ɵɵtext(9);
                i0.ɵɵpipe(10, "translate");
                i0.ɵɵelementEnd();
                i0.ɵɵelementEnd();
            }
            if (rf & 2) {
                i0.ɵɵadvance(1);
                i0.ɵɵtextInterpolate(ctx.title);
                i0.ɵɵadvance(2);
                i0.ɵɵproperty("ngTemplateOutlet", ctx.HTMLReceived);
                i0.ɵɵadvance(3);
                i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(7, 4, "Cancel"));
                i0.ɵɵadvance(3);
                i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(10, 6, "Accept"));
            }
        }, directives: [i1$1.MatDialogTitle, i1$1.MatDialogContent, i2$2.NgTemplateOutlet, i1$1.MatDialogActions, i3.MatButton], pipes: [i2$1.TranslatePipe], styles: [""] });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(DialogFormComponent, [{
                type: i0.Component,
                args: [{
                        selector: 'app-dialog-form',
                        templateUrl: './dialog-form.component.html',
                        styleUrls: ['./dialog-form.component.css']
                    }]
            }], function () { return [{ type: i1$1.MatDialogRef }]; }, null);
    })();

    var _c0$2 = ["emptyItem"];
    function DataTreeComponent_mat_tree_node_1_mat_icon_2_Template(rf, ctx) {
        if (rf & 1) {
            i0.ɵɵelementStart(0, "mat-icon", 9);
            i0.ɵɵtext(1, " folder ");
            i0.ɵɵelementEnd();
        }
        if (rf & 2) {
            var node_r3 = i0.ɵɵnextContext().$implicit;
            i0.ɵɵattribute("aria-label", node_r3.type + "icon");
        }
    }
    function DataTreeComponent_mat_tree_node_1_button_4_Template(rf, ctx) {
        if (rf & 1) {
            var _r10_1 = i0.ɵɵgetCurrentView();
            i0.ɵɵelementStart(0, "button", 8);
            i0.ɵɵlistener("click", function DataTreeComponent_mat_tree_node_1_button_4_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r10_1); var node_r3 = i0.ɵɵnextContext().$implicit; var ctx_r8 = i0.ɵɵnextContext(); return ctx_r8.onButtonClicked(node_r3.id, "newFolder"); });
            i0.ɵɵelementStart(1, "mat-icon");
            i0.ɵɵtext(2, "create_new_folder");
            i0.ɵɵelementEnd();
            i0.ɵɵelementEnd();
        }
    }
    function DataTreeComponent_mat_tree_node_1_button_5_Template(rf, ctx) {
        if (rf & 1) {
            var _r13_1 = i0.ɵɵgetCurrentView();
            i0.ɵɵelementStart(0, "button", 8);
            i0.ɵɵlistener("click", function DataTreeComponent_mat_tree_node_1_button_5_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r13_1); var node_r3 = i0.ɵɵnextContext().$implicit; var ctx_r11 = i0.ɵɵnextContext(); return ctx_r11.onButtonClicked(node_r3.id, "newNode"); });
            i0.ɵɵelementStart(1, "mat-icon");
            i0.ɵɵtext(2, "playlist_add");
            i0.ɵɵelementEnd();
            i0.ɵɵelementEnd();
        }
    }
    var _c1 = function (a0, a1, a2) { return { "drop-above": a0, "drop-below": a1, "drop-center": a2 }; };
    function DataTreeComponent_mat_tree_node_1_Template(rf, ctx) {
        if (rf & 1) {
            var _r15_1 = i0.ɵɵgetCurrentView();
            i0.ɵɵelementStart(0, "mat-tree-node", 4);
            i0.ɵɵlistener("dragstart", function DataTreeComponent_mat_tree_node_1_Template_mat_tree_node_dragstart_0_listener($event) { i0.ɵɵrestoreView(_r15_1); var node_r3 = ctx.$implicit; var ctx_r14 = i0.ɵɵnextContext(); return ctx_r14.handleDragStart($event, node_r3); })("dragover", function DataTreeComponent_mat_tree_node_1_Template_mat_tree_node_dragover_0_listener($event) { i0.ɵɵrestoreView(_r15_1); var node_r3 = ctx.$implicit; var ctx_r16 = i0.ɵɵnextContext(); return ctx_r16.handleDragOver($event, node_r3); })("drop", function DataTreeComponent_mat_tree_node_1_Template_mat_tree_node_drop_0_listener($event) { i0.ɵɵrestoreView(_r15_1); var node_r3 = ctx.$implicit; var ctx_r17 = i0.ɵɵnextContext(); return ctx_r17.handleDrop($event, node_r3); })("dragend", function DataTreeComponent_mat_tree_node_1_Template_mat_tree_node_dragend_0_listener($event) { i0.ɵɵrestoreView(_r15_1); var ctx_r18 = i0.ɵɵnextContext(); return ctx_r18.handleDragEnd($event); });
            i0.ɵɵelement(1, "button", 5);
            i0.ɵɵtemplate(2, DataTreeComponent_mat_tree_node_1_mat_icon_2_Template, 2, 1, "mat-icon", 6);
            i0.ɵɵtext(3);
            i0.ɵɵtemplate(4, DataTreeComponent_mat_tree_node_1_button_4_Template, 3, 0, "button", 7);
            i0.ɵɵtemplate(5, DataTreeComponent_mat_tree_node_1_button_5_Template, 3, 0, "button", 7);
            i0.ɵɵelementStart(6, "button", 8);
            i0.ɵɵlistener("click", function DataTreeComponent_mat_tree_node_1_Template_button_click_6_listener() { i0.ɵɵrestoreView(_r15_1); var node_r3 = ctx.$implicit; var ctx_r19 = i0.ɵɵnextContext(); return ctx_r19.onButtonClicked(node_r3.id, "delete"); });
            i0.ɵɵelementStart(7, "mat-icon");
            i0.ɵɵtext(8, "delete");
            i0.ɵɵelementEnd();
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(9, "button", 8);
            i0.ɵɵlistener("click", function DataTreeComponent_mat_tree_node_1_Template_button_click_9_listener() { i0.ɵɵrestoreView(_r15_1); var node_r3 = ctx.$implicit; var ctx_r20 = i0.ɵɵnextContext(); return ctx_r20.onButtonClicked(node_r3.id, "edit"); });
            i0.ɵɵelementStart(10, "mat-icon");
            i0.ɵɵtext(11, "edit");
            i0.ɵɵelementEnd();
            i0.ɵɵelementEnd();
            i0.ɵɵelementEnd();
        }
        if (rf & 2) {
            var node_r3 = ctx.$implicit;
            var ctx_r0 = i0.ɵɵnextContext();
            i0.ɵɵproperty("ngClass", i0.ɵɵpureFunction3(5, _c1, ctx_r0.dragNodeExpandOverArea === "above" && ctx_r0.dragNodeExpandOverNode === node_r3, ctx_r0.dragNodeExpandOverArea === "below" && ctx_r0.dragNodeExpandOverNode === node_r3, ctx_r0.dragNodeExpandOverArea === "center" && ctx_r0.dragNodeExpandOverNode === node_r3));
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("ngIf", node_r3.type === "folder");
            i0.ɵɵadvance(1);
            i0.ɵɵtextInterpolate1(" ", node_r3.name, " ");
            i0.ɵɵadvance(1);
            i0.ɵɵproperty("ngIf", node_r3.type === "folder");
            i0.ɵɵadvance(1);
            i0.ɵɵproperty("ngIf", node_r3.type === "folder");
        }
    }
    function DataTreeComponent_mat_tree_node_2_button_7_Template(rf, ctx) {
        if (rf & 1) {
            var _r26_1 = i0.ɵɵgetCurrentView();
            i0.ɵɵelementStart(0, "button", 8);
            i0.ɵɵlistener("click", function DataTreeComponent_mat_tree_node_2_button_7_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r26_1); var node_r21 = i0.ɵɵnextContext().$implicit; var ctx_r24 = i0.ɵɵnextContext(); return ctx_r24.onButtonClicked(node_r21.id, "newFolder"); });
            i0.ɵɵelementStart(1, "mat-icon");
            i0.ɵɵtext(2, "create_new_folder");
            i0.ɵɵelementEnd();
            i0.ɵɵelementEnd();
        }
    }
    function DataTreeComponent_mat_tree_node_2_button_8_Template(rf, ctx) {
        if (rf & 1) {
            var _r29_1 = i0.ɵɵgetCurrentView();
            i0.ɵɵelementStart(0, "button", 8);
            i0.ɵɵlistener("click", function DataTreeComponent_mat_tree_node_2_button_8_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r29_1); var node_r21 = i0.ɵɵnextContext().$implicit; var ctx_r27 = i0.ɵɵnextContext(); return ctx_r27.onButtonClicked(node_r21.id, "newNode"); });
            i0.ɵɵelementStart(1, "mat-icon");
            i0.ɵɵtext(2, "playlist_add");
            i0.ɵɵelementEnd();
            i0.ɵɵelementEnd();
        }
    }
    function DataTreeComponent_mat_tree_node_2_Template(rf, ctx) {
        if (rf & 1) {
            var _r31_1 = i0.ɵɵgetCurrentView();
            i0.ɵɵelementStart(0, "mat-tree-node", 10);
            i0.ɵɵlistener("dragstart", function DataTreeComponent_mat_tree_node_2_Template_mat_tree_node_dragstart_0_listener($event) { i0.ɵɵrestoreView(_r31_1); var node_r21 = ctx.$implicit; var ctx_r30 = i0.ɵɵnextContext(); return ctx_r30.handleDragStart($event, node_r21); })("dragover", function DataTreeComponent_mat_tree_node_2_Template_mat_tree_node_dragover_0_listener($event) { i0.ɵɵrestoreView(_r31_1); var node_r21 = ctx.$implicit; var ctx_r32 = i0.ɵɵnextContext(); return ctx_r32.handleDragOver($event, node_r21); })("drop", function DataTreeComponent_mat_tree_node_2_Template_mat_tree_node_drop_0_listener($event) { i0.ɵɵrestoreView(_r31_1); var node_r21 = ctx.$implicit; var ctx_r33 = i0.ɵɵnextContext(); return ctx_r33.handleDrop($event, node_r21); })("dragend", function DataTreeComponent_mat_tree_node_2_Template_mat_tree_node_dragend_0_listener($event) { i0.ɵɵrestoreView(_r31_1); var ctx_r34 = i0.ɵɵnextContext(); return ctx_r34.handleDragEnd($event); });
            i0.ɵɵelementStart(1, "button", 11);
            i0.ɵɵlistener("click", function DataTreeComponent_mat_tree_node_2_Template_button_click_1_listener() { i0.ɵɵrestoreView(_r31_1); var node_r21 = ctx.$implicit; var ctx_r35 = i0.ɵɵnextContext(); return ctx_r35.expansionModel.toggle(node_r21.id); });
            i0.ɵɵelementStart(2, "mat-icon", 12);
            i0.ɵɵtext(3);
            i0.ɵɵelementEnd();
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(4, "mat-icon", 9);
            i0.ɵɵtext(5, " folder ");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(6);
            i0.ɵɵtemplate(7, DataTreeComponent_mat_tree_node_2_button_7_Template, 3, 0, "button", 7);
            i0.ɵɵtemplate(8, DataTreeComponent_mat_tree_node_2_button_8_Template, 3, 0, "button", 7);
            i0.ɵɵelementStart(9, "button", 8);
            i0.ɵɵlistener("click", function DataTreeComponent_mat_tree_node_2_Template_button_click_9_listener() { i0.ɵɵrestoreView(_r31_1); var node_r21 = ctx.$implicit; var ctx_r36 = i0.ɵɵnextContext(); return ctx_r36.onButtonClicked(node_r21.id, "delete"); });
            i0.ɵɵelementStart(10, "mat-icon");
            i0.ɵɵtext(11, "delete");
            i0.ɵɵelementEnd();
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(12, "button", 8);
            i0.ɵɵlistener("click", function DataTreeComponent_mat_tree_node_2_Template_button_click_12_listener() { i0.ɵɵrestoreView(_r31_1); var node_r21 = ctx.$implicit; var ctx_r37 = i0.ɵɵnextContext(); return ctx_r37.onButtonClicked(node_r21.id, "edit"); });
            i0.ɵɵelementStart(13, "mat-icon");
            i0.ɵɵtext(14, "edit");
            i0.ɵɵelementEnd();
            i0.ɵɵelementEnd();
            i0.ɵɵelementEnd();
        }
        if (rf & 2) {
            var node_r21 = ctx.$implicit;
            var ctx_r1 = i0.ɵɵnextContext();
            i0.ɵɵproperty("ngClass", i0.ɵɵpureFunction3(7, _c1, ctx_r1.dragNodeExpandOverArea === "above" && ctx_r1.dragNodeExpandOverNode === node_r21, ctx_r1.dragNodeExpandOverArea === "below" && ctx_r1.dragNodeExpandOverNode === node_r21, ctx_r1.dragNodeExpandOverArea === "center" && ctx_r1.dragNodeExpandOverNode === node_r21));
            i0.ɵɵadvance(1);
            i0.ɵɵattribute("aria-label", "toggle " + node_r21.name);
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate1(" ", ctx_r1.treeControl.isExpanded(node_r21) ? "expand_more" : "chevron_right", " ");
            i0.ɵɵadvance(1);
            i0.ɵɵattribute("aria-label", node_r21.type + "icon");
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate1(" ", node_r21.name, " ");
            i0.ɵɵadvance(1);
            i0.ɵɵproperty("ngIf", node_r21.type === "folder");
            i0.ɵɵadvance(1);
            i0.ɵɵproperty("ngIf", node_r21.type === "folder");
        }
    }
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
        function FileFlatNode(expandable, name, level, type, id) {
            this.expandable = expandable;
            this.name = name;
            this.level = level;
            this.type = type;
            this.id = id;
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
        FileDatabase.prototype.initialize = function (dataObj) {
            // Build the tree nodes from Json object. The result is a list of `FileNode` with nested
            //     file node as children.
            var data = this.buildFileTree(dataObj, 0);
            // Notify the change.
            this.dataChange.next(data);
        };
        /**
         * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
         * The return value is the list of `FileNode`.
         */
        FileDatabase.prototype.buildFileTree = function (arrayTreeNodes, level, parentId) {
            if (parentId === void 0) { parentId = '0'; }
            var map = {};
            arrayTreeNodes.forEach(function (treeNode) {
                var obj = treeNode;
                obj.children = [];
                obj.type = (treeNode.isFolder) ? "folder" : "node";
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
            map['root'].isFolder = true;
            return map['root'];
        };
        FileDatabase.prototype.deleteItem = function (node) {
            this.deleteNode(this.data.children, node);
            this.dataChange.next(this.data);
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
        FileDatabase.prototype.copyPasteItem = function (from, to) {
            var newItem = this.insertItem(to, from);
            return newItem;
        };
        FileDatabase.prototype.copyPasteItemAbove = function (from, to) {
            var newItem = this.insertItemAbove(to, from);
            return newItem;
        };
        FileDatabase.prototype.copyPasteItemBelow = function (from, to) {
            var newItem = this.insertItemBelow(to, from);
            return newItem;
        };
        /** Add an item to to-do list */
        FileDatabase.prototype.insertItem = function (parent, node) {
            if (!parent.children) {
                parent.children = [];
            }
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
                parent: parent.id == undefined ? null : parent.id,
                queryableActive: node.queryableActive,
                radio: node.radio,
                tooltip: node.tooltip,
                _links: node._links
            };
            parent.children.push(newItem);
            this.dataChange.next(this.data);
            return newItem;
        };
        FileDatabase.prototype.insertItemAbove = function (node, nodeDrag) {
            var parentNode = this.getParentFromNodes(node);
            var newItem = {
                name: nodeDrag.name,
                children: nodeDrag.children,
                type: nodeDrag.type,
                id: nodeDrag.id,
                active: nodeDrag.active,
                cartographyId: nodeDrag.cartographyId,
                cartographyName: nodeDrag.cartographyName,
                datasetURL: nodeDrag.datasetURL,
                description: nodeDrag.description,
                filterGetFeatureInfo: nodeDrag.filterGetFeatureInfo,
                filterGetMap: nodeDrag.filterGetMap,
                filterSelectable: nodeDrag.filterSelectable,
                isFolder: nodeDrag.isFolder,
                metadataURL: nodeDrag.metadataURL,
                order: nodeDrag.order,
                parent: parentNode.id == undefined ? null : parentNode.id,
                queryableActive: nodeDrag.queryableActive,
                radio: nodeDrag.radio,
                tooltip: nodeDrag.tooltip,
                _links: nodeDrag._links
            };
            if (parentNode != null) {
                parentNode.children.splice(parentNode.children.indexOf(node), 0, newItem);
            }
            else {
                this.data.children.splice(this.data.children.indexOf(node), 0, newItem);
            }
            this.dataChange.next(this.data);
            return newItem;
        };
        FileDatabase.prototype.insertItemBelow = function (node, nodeDrag) {
            var parentNode = this.getParentFromNodes(node);
            var newItem = {
                name: nodeDrag.name,
                children: nodeDrag.children,
                type: nodeDrag.type,
                id: nodeDrag.id,
                active: nodeDrag.active,
                cartographyId: nodeDrag.cartographyId,
                cartographyName: nodeDrag.cartographyName,
                datasetURL: nodeDrag.datasetURL,
                description: nodeDrag.description,
                filterGetFeatureInfo: nodeDrag.filterGetFeatureInfo,
                filterGetMap: nodeDrag.filterGetMap,
                filterSelectable: nodeDrag.filterSelectable,
                isFolder: nodeDrag.isFolder,
                metadataURL: nodeDrag.metadataURL,
                order: nodeDrag.order,
                parent: parentNode.id == undefined ? null : parentNode.id,
                queryableActive: nodeDrag.queryableActive,
                radio: nodeDrag.radio,
                tooltip: nodeDrag.tooltip,
                _links: nodeDrag._links
            };
            if (parentNode != null) {
                parentNode.children.splice(parentNode.children.indexOf(node) + 1, 0, newItem);
            }
            else {
                this.data.children.splice(this.data.children.indexOf(node) + 1, 0, newItem);
            }
            this.dataChange.next(this.data);
            return newItem;
        };
        FileDatabase.prototype.getParentFromNodes = function (node) {
            for (var i = 0; i < this.data.children.length; ++i) {
                var currentRoot = this.data.children[i];
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
    /** @nocollapse */ FileDatabase.ɵfac = function FileDatabase_Factory(t) { return new (t || FileDatabase)(); };
    /** @nocollapse */ FileDatabase.ɵprov = i0.ɵɵdefineInjectable({ token: FileDatabase, factory: FileDatabase.ɵfac });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(FileDatabase, [{
                type: i0.Injectable
            }], function () { return []; }, null);
    })();
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
                    : new FileFlatNode((node.children && node.children.length > 0), node.name, level, node.type, node.id);
                _this.flatNodeMap.set(flatNode, node);
                _this.nestedNodeMap.set(node, flatNode);
                return flatNode;
            };
            this._getLevel = function (node) { return node.level; };
            this._isExpandable = function (node) { return node.expandable; };
            this._getChildren = function (node) { return rxjs.of(node.children); };
            this.hasChild = function (_, _nodeData) { return _nodeData.expandable; };
            this.emitNode = new i0.EventEmitter();
            this.createNode = new i0.EventEmitter();
            this.createFolder = new i0.EventEmitter();
            this.emitAllNodes = new i0.EventEmitter();
            this.treeFlattener = new i1$2.MatTreeFlattener(this.transformer, this._getLevel, this._isExpandable, this._getChildren);
            this.treeControl = new tree.FlatTreeControl(this._getLevel, this._isExpandable);
            this.dataSource = new i1$2.MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
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
            this.getAll()
                .subscribe(function (items) {
                _this.treeData = items;
                _this.database.initialize(_this.treeData);
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
            event.preventDefault();
            if (node !== this.dragNode) {
                var newItem = void 0;
                if (this.dragNodeExpandOverArea === 'above') {
                    newItem = this.database.copyPasteItemAbove(this.flatNodeMap.get(this.dragNode), this.flatNodeMap.get(node));
                }
                else if (this.dragNodeExpandOverArea === 'below') {
                    newItem = this.database.copyPasteItemBelow(this.flatNodeMap.get(this.dragNode), this.flatNodeMap.get(node));
                }
                else {
                    newItem = this.database.copyPasteItem(this.flatNodeMap.get(this.dragNode), this.flatNodeMap.get(node));
                }
                this.database.deleteItem(this.flatNodeMap.get(this.dragNode));
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
        DataTreeComponent.prototype.rebuildTreeForData = function (data) {
            var _this = this;
            this.dataSource.data = data;
            this.expansionModel.selected.forEach(function (id) {
                var node = _this.treeControl.dataNodes.find(function (n) { return n.id === id; });
                _this.treeControl.expand(node);
            });
        };
        /**
         * Not used but you might need this to programmatically expand nodes
         * to reveal a particular node
         */
        DataTreeComponent.prototype.expandNodesById = function (flatNodes, ids) {
            var _this = this;
            if (!flatNodes || flatNodes.length === 0)
                return;
            var idSet = new Set(ids);
            return flatNodes.forEach(function (node) {
                if (idSet.has(node.id)) {
                    _this.treeControl.expand(node);
                    var parent = _this.getParentNode(node);
                    while (parent) {
                        _this.treeControl.expand(parent);
                        parent = _this.getParentNode(parent);
                    }
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
                dataToChange.push(newFolder);
            }
            else {
                var siblings = this.findNodeSiblings(dataToChange, newFolder.parent);
                var index = siblings.findIndex(function (node) { return node.id === newFolder.parent; });
                siblings[index].children.push(newFolder);
            }
            this.rebuildTreeForData(dataToChange);
        };
        DataTreeComponent.prototype.createNewNode = function (newNode) {
            newNode.type = "node";
            var dataToChange = JSON.parse(JSON.stringify(this.dataSource.data));
            var siblings = this.findNodeSiblings(dataToChange, newNode.parent);
            var index = siblings.findIndex(function (node) { return node.id === newNode.parent; });
            siblings[index].children.push(newNode);
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
                var children = this.getAllChildren(nodeClicked.children);
                children.forEach(function (children) {
                    children.status = 'Deleted';
                });
                nodeClicked.children = children;
                nodeClicked.status = 'Deleted';
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
        return DataTreeComponent;
    }());
    /** @nocollapse */ DataTreeComponent.ɵfac = function DataTreeComponent_Factory(t) { return new (t || DataTreeComponent)(i0.ɵɵdirectiveInject(FileDatabase)); };
    /** @nocollapse */ DataTreeComponent.ɵcmp = i0.ɵɵdefineComponent({ type: DataTreeComponent, selectors: [["app-data-tree"]], viewQuery: function DataTreeComponent_Query(rf, ctx) {
            if (rf & 1) {
                i0.ɵɵviewQuery(_c0$2, true);
            }
            if (rf & 2) {
                var _t;
                i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.emptyItem = _t.first);
            }
        }, inputs: { eventNodeUpdatedSubscription: "eventNodeUpdatedSubscription", eventCreateNodeSubscription: "eventCreateNodeSubscription", eventGetAllRowsSubscription: "eventGetAllRowsSubscription", getAll: "getAll" }, outputs: { createNode: "createNode", createFolder: "createFolder", emitNode: "emitNode", emitAllNodes: "emitAllNodes" }, features: [i0.ɵɵProvidersFeature([FileDatabase])], decls: 5, vars: 3, consts: [[3, "dataSource", "treeControl"], ["matTreeNodeToggle", "", "matTreeNodePadding", "", "draggable", "true", 3, "ngClass", "dragstart", "dragover", "drop", "dragend", 4, "matTreeNodeDef"], ["matTreeNodePadding", "", "draggable", "true", 3, "ngClass", "dragstart", "dragover", "drop", "dragend", 4, "matTreeNodeDef", "matTreeNodeDefWhen"], ["emptyItem", ""], ["matTreeNodeToggle", "", "matTreeNodePadding", "", "draggable", "true", 3, "ngClass", "dragstart", "dragover", "drop", "dragend"], ["mat-icon-button", "", "disabled", ""], ["class", "type-icon", 4, "ngIf"], ["mat-icon-button", "", 3, "click", 4, "ngIf"], ["mat-icon-button", "", 3, "click"], [1, "type-icon"], ["matTreeNodePadding", "", "draggable", "true", 3, "ngClass", "dragstart", "dragover", "drop", "dragend"], ["mat-icon-button", "", "matTreeNodeToggle", "", 3, "click"], [1, "mat-icon-rtl-mirror"]], template: function DataTreeComponent_Template(rf, ctx) {
            if (rf & 1) {
                i0.ɵɵelementStart(0, "mat-tree", 0);
                i0.ɵɵtemplate(1, DataTreeComponent_mat_tree_node_1_Template, 12, 9, "mat-tree-node", 1);
                i0.ɵɵtemplate(2, DataTreeComponent_mat_tree_node_2_Template, 15, 11, "mat-tree-node", 2);
                i0.ɵɵelementEnd();
                i0.ɵɵelement(3, "span", null, 3);
            }
            if (rf & 2) {
                i0.ɵɵproperty("dataSource", ctx.dataSource)("treeControl", ctx.treeControl);
                i0.ɵɵadvance(2);
                i0.ɵɵproperty("matTreeNodeDefWhen", ctx.hasChild);
            }
        }, directives: [i1$2.MatTree, i1$2.MatTreeNodeDef, i1$2.MatTreeNode, i1$2.MatTreeNodeToggle, i1$2.MatTreeNodePadding, i2$2.NgClass, i3.MatButton, i2$2.NgIf, i2.MatIcon], styles: [".mat-tree-node[_ngcontent-%COMP%]{-moz-user-select:none;-ms-user-select:none;-webkit-user-select:none;cursor:move;user-select:none}.mat-tree-node.cdk-drag-preview[_ngcontent-%COMP%]{box-shadow:0 7px 8px -4px rgba(0,0,0,.2),0 12px 17px 2px rgba(0,0,0,.14),0 5px 22px 4px rgba(0,0,0,.12)}.mat-tree-node.cdk-drag-placeholder[_ngcontent-%COMP%]{opacity:0}.cdk-drop-list-dragging[_ngcontent-%COMP%]   .mat-tree-node[_ngcontent-%COMP%]:not(.cdk-drag-placeholder){transition:transform .25s cubic-bezier(0,0,.2,1)}.cdk-drag-animating[_ngcontent-%COMP%]{transition:transform .2s cubic-bezier(0,0,.2,1)}.drop-above[_ngcontent-%COMP%]{border-top:10px solid #ddd;margin-top:-10px}.drop-below[_ngcontent-%COMP%]{border-bottom:10px solid #ddd;margin-bottom:-10px}.drop-center[_ngcontent-%COMP%]{background-color:#ddd}"] });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(DataTreeComponent, [{
                type: i0.Component,
                args: [{
                        selector: 'app-data-tree',
                        templateUrl: 'data-tree.component.html',
                        styleUrls: ['data-tree.component.scss'],
                        providers: [FileDatabase]
                    }]
            }], function () { return [{ type: FileDatabase }]; }, { createNode: [{
                    type: i0.Output
                }], createFolder: [{
                    type: i0.Output
                }], emitNode: [{
                    type: i0.Output
                }], emitAllNodes: [{
                    type: i0.Output
                }], eventNodeUpdatedSubscription: [{
                    type: i0.Input
                }], eventCreateNodeSubscription: [{
                    type: i0.Input
                }], eventGetAllRowsSubscription: [{
                    type: i0.Input
                }], getAll: [{
                    type: i0.Input
                }], emptyItem: [{
                    type: i0.ViewChild,
                    args: ['emptyItem']
                }] });
    })();

    i2$2.registerLocaleData(localeCa__default['default'], 'ca');
    i2$2.registerLocaleData(localeEs__default['default'], 'es');
    /** Load translation assets */
    function createTranslateLoader(http) {
        return new httpLoader.TranslateHttpLoader(http, '../assets/i18n/', '.json');
    }
    /** SITMUN plugin core module */
    var SitmunFrontendGuiModule = /** @class */ (function () {
        function SitmunFrontendGuiModule() {
        }
        return SitmunFrontendGuiModule;
    }());
    /** @nocollapse */ SitmunFrontendGuiModule.ɵmod = i0.ɵɵdefineNgModule({ type: SitmunFrontendGuiModule });
    /** @nocollapse */ SitmunFrontendGuiModule.ɵinj = i0.ɵɵdefineInjector({ factory: function SitmunFrontendGuiModule_Factory(t) { return new (t || SitmunFrontendGuiModule)(); }, providers: [], imports: [[
                router.RouterModule,
                http.HttpClientModule,
                i2$2.CommonModule,
                i8.FormsModule,
                animations.NoopAnimationsModule,
                frontendCore.AngularHalModule,
                i8.ReactiveFormsModule,
                animations.BrowserAnimationsModule,
                i5.AgGridModule.withComponents([]),
                frontendCore.SitmunFrontendCoreModule,
                MaterialModule,
                i2$1.TranslateModule.forRoot({
                    loader: {
                        provide: i2$1.TranslateLoader,
                        useFactory: (createTranslateLoader),
                        deps: [http.HttpClient]
                    }
                })
            ], http.HttpClientModule,
            i2$2.CommonModule,
            i8.FormsModule,
            animations.NoopAnimationsModule,
            frontendCore.AngularHalModule,
            i2$1.TranslateModule,
            i8.ReactiveFormsModule,
            frontendCore.SitmunFrontendCoreModule] });
    (function () {
        (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(SitmunFrontendGuiModule, { declarations: [DataGridComponent,
                DataTreeComponent,
                BtnEditRenderedComponent,
                BtnCheckboxRenderedComponent,
                BtnCheckboxFilterComponent,
                DialogGridComponent,
                DialogFormComponent,
                DialogMessageComponent], imports: [router.RouterModule,
                http.HttpClientModule,
                i2$2.CommonModule,
                i8.FormsModule,
                animations.NoopAnimationsModule,
                frontendCore.AngularHalModule,
                i8.ReactiveFormsModule,
                animations.BrowserAnimationsModule, i5.AgGridModule, frontendCore.SitmunFrontendCoreModule,
                MaterialModule, i2$1.TranslateModule], exports: [http.HttpClientModule,
                i2$2.CommonModule,
                i8.FormsModule,
                animations.NoopAnimationsModule,
                frontendCore.AngularHalModule,
                i2$1.TranslateModule,
                i8.ReactiveFormsModule,
                DataGridComponent,
                DataTreeComponent,
                DialogGridComponent,
                DialogFormComponent,
                DialogMessageComponent,
                frontendCore.SitmunFrontendCoreModule] });
    })();
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(SitmunFrontendGuiModule, [{
                type: i0.NgModule,
                args: [{
                        imports: [
                            router.RouterModule,
                            http.HttpClientModule,
                            i2$2.CommonModule,
                            i8.FormsModule,
                            animations.NoopAnimationsModule,
                            frontendCore.AngularHalModule,
                            i8.ReactiveFormsModule,
                            animations.BrowserAnimationsModule,
                            i5.AgGridModule.withComponents([]),
                            frontendCore.SitmunFrontendCoreModule,
                            MaterialModule,
                            i2$1.TranslateModule.forRoot({
                                loader: {
                                    provide: i2$1.TranslateLoader,
                                    useFactory: (createTranslateLoader),
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
                        ],
                        entryComponents: [],
                        providers: [],
                        exports: [
                            http.HttpClientModule,
                            i2$2.CommonModule,
                            i8.FormsModule,
                            animations.NoopAnimationsModule,
                            frontendCore.AngularHalModule,
                            i2$1.TranslateModule,
                            i8.ReactiveFormsModule,
                            DataGridComponent,
                            DataTreeComponent,
                            DialogGridComponent,
                            DialogFormComponent,
                            DialogMessageComponent,
                            frontendCore.SitmunFrontendCoreModule
                        ]
                    }]
            }], null, null);
    })();

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
    exports.DialogFormComponent = DialogFormComponent;
    exports.DialogGridComponent = DialogGridComponent;
    exports.DialogMessageComponent = DialogMessageComponent;
    exports.FileDatabase = FileDatabase;
    exports.FileFlatNode = FileFlatNode;
    exports.FileNode = FileNode;
    exports.SitmunFrontendGuiModule = SitmunFrontendGuiModule;
    exports.createTranslateLoader = createTranslateLoader;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=sitmun-frontend-gui.umd.js.map
