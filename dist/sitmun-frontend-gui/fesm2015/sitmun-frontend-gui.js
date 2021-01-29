import { ɵɵdefineComponent, ɵɵelementStart, ɵɵlistener, ɵɵtext, ɵɵelementEnd, ɵsetClassMetadata, Component, ɵɵproperty, ɵɵviewQuery, ViewContainerRef, ɵɵqueryRefresh, ɵɵloadQuery, ɵɵgetCurrentView, ɵɵrestoreView, ɵɵreference, ɵɵpipe, ɵɵadvance, ɵɵtextInterpolate, ɵɵpipeBind1, ViewChild, ɵɵdirectiveInject, ɵɵtextInterpolate1, ɵɵelement, ɵɵnextContext, ɵɵpropertyInterpolate, EventEmitter, ɵɵtemplate, ɵɵclassMap, Input, Output, ɵɵdefineNgModule, ɵɵdefineInjector, ɵɵsetNgModuleScope, NgModule, ɵɵpureFunction1, ɵɵelementContainer, ɵɵattribute, ɵɵpureFunction3, ɵɵdefineInjectable, Injectable, ɵɵProvidersFeature } from '@angular/core';
import { Subject, BehaviorSubject, of } from 'rxjs';
import { AllCommunityModules } from '@ag-grid-community/all-modules';
import { TranslatePipe, TranslateService, TranslateDirective, TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { NgSelectOption, ɵangular_packages_forms_forms_x, DefaultValueAccessor, NgControlStatus, NgModel, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NgIf, NgForOf, NgStyle, NgTemplateOutlet, NgClass, registerLocaleData, CommonModule } from '@angular/common';
import { _MatMenu, MatMenuTrigger, MatMenuItem, MatMenuModule } from '@angular/material/menu';
import { AgGridAngular, AgGridModule } from '@ag-grid-community/angular';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { NoopAnimationsModule, BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { AngularHalModule, SitmunFrontendCoreModule } from '@sitmun/frontend-core';
import localeCa from '@angular/common/locales/ca';
import localeEs from '@angular/common/locales/es';
import { A11yModule } from '@angular/cdk/a11y';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { PortalModule } from '@angular/cdk/portal';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { CdkTableModule } from '@angular/cdk/table';
import { CdkTreeModule, FlatTreeControl } from '@angular/cdk/tree';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule, MatTreeFlattener, MatTreeFlatDataSource, MatTree, MatTreeNodeDef, MatTreeNode, MatTreeNodeToggle, MatTreeNodePadding } from '@angular/material/tree';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SelectionModel } from '@angular/cdk/collections';

class BtnEditRenderedComponent {
    agInit(params) {
        this.params = params;
    }
    refresh(params) {
        return true;
    }
    btnClickedHandler($event) {
        this.params.clicked(this.params.value);
    }
    getParams() {
        return this.params;
    }
    ngOnDestroy() {
        // no need to remove the button click handler 
    }
}
/** @nocollapse */ BtnEditRenderedComponent.ɵfac = function BtnEditRenderedComponent_Factory(t) { return new (t || BtnEditRenderedComponent)(); };
/** @nocollapse */ BtnEditRenderedComponent.ɵcmp = ɵɵdefineComponent({ type: BtnEditRenderedComponent, selectors: [["app-btn-edit-rendered"]], decls: 3, vars: 0, consts: [["mat-mini-fab", "", "type", "button", 1, "buttonEdit", 3, "click"], ["fontSet", "material-icons-round", 1, "iconEdit"]], template: function BtnEditRenderedComponent_Template(rf, ctx) { if (rf & 1) {
        ɵɵelementStart(0, "button", 0);
        ɵɵlistener("click", function BtnEditRenderedComponent_Template_button_click_0_listener($event) { return ctx.btnClickedHandler($event); });
        ɵɵelementStart(1, "mat-icon", 1);
        ɵɵtext(2, " edit ");
        ɵɵelementEnd();
        ɵɵelementEnd();
    } }, directives: [MatButton, MatIcon], styles: [".buttonEdit[_ngcontent-%COMP%]{background-color:#ddd;box-shadow:none;color:#000;height:20px;margin-top:3px;width:20px}.iconEdit[_ngcontent-%COMP%]{font-size:13px;margin-left:-2px;margin-top:-10px}"] });
/*@__PURE__*/ (function () { ɵsetClassMetadata(BtnEditRenderedComponent, [{
        type: Component,
        args: [{
                selector: 'app-btn-edit-rendered',
                templateUrl: './btn-edit-rendered.component.html',
                styleUrls: ['./btn-edit-rendered.component.css']
            }]
    }], null, null); })();

class BtnCheckboxRenderedComponent {
    agInit(params) {
        this.params = params;
    }
    refresh(params) {
        this.params = params;
        return true;
    }
    invokeParentMethod() {
        this.params.context.componentParent.methodFromParent(`Row: ${this.params.node.rowIndex}, Col: ${this.params.colDef.headerName}`);
    }
    btnCheckedHandler(event) {
        let checked = !event.target.firstElementChild.checked;
        let colId = this.params.column.colId;
        this.params.value = checked;
        this.params.api.undoRedoService.isFilling = true;
        this.params.node.setDataValue(colId, checked);
    }
    getParams() {
        return this.params;
    }
    ngOnDestroy() {
        // no need to remove the button click handler 
    }
}
/** @nocollapse */ BtnCheckboxRenderedComponent.ɵfac = function BtnCheckboxRenderedComponent_Factory(t) { return new (t || BtnCheckboxRenderedComponent)(); };
/** @nocollapse */ BtnCheckboxRenderedComponent.ɵcmp = ɵɵdefineComponent({ type: BtnCheckboxRenderedComponent, selectors: [["app-btn-checkbox-rendered"]], decls: 1, vars: 2, consts: [[3, "value", "checked", "click"]], template: function BtnCheckboxRenderedComponent_Template(rf, ctx) { if (rf & 1) {
        ɵɵelementStart(0, "mat-checkbox", 0);
        ɵɵlistener("click", function BtnCheckboxRenderedComponent_Template_mat_checkbox_click_0_listener($event) { return ctx.btnCheckedHandler($event); });
        ɵɵelementEnd();
    } if (rf & 2) {
        ɵɵproperty("value", ctx.params.value)("checked", ctx.params.value);
    } }, directives: [MatCheckbox], styles: [""] });
/*@__PURE__*/ (function () { ɵsetClassMetadata(BtnCheckboxRenderedComponent, [{
        type: Component,
        args: [{
                selector: 'app-btn-checkbox-rendered',
                templateUrl: './btn-checkbox-rendered.component.html',
                styleUrls: ['./btn-checkbox-rendered.component.css']
            }]
    }], null, null); })();

const _c0 = ["input"];
class BtnCheckboxFilterComponent {
    constructor() {
        this.text = '';
    }
    agInit(params) {
        this.params = params;
        this.valueGetter = params.filterParams.valueGetter;
        this.params.suppressFilterButton = true;
    }
    isFilterActive() {
        return this.text != null && this.text !== '';
    }
    doesFilterPass(params) {
        return this.text
            .toLowerCase()
            .split(' ')
            .every((filterWord) => this.valueGetter(params.node)
            .toString()
            .toLowerCase()
            .indexOf(filterWord) >= 0);
    }
    getModel() {
        return { value: this.text };
    }
    setModel(model) {
        this.text = model ? model.value : '';
    }
    onChange(newValue) {
        this.params.parentFilterInstance(function (instance) {
            instance.onFloatingFilterChanged('contains', newValue);
        });
    }
    onParentModelChanged(parentModel) {
        if (!parentModel) {
            this.currentValue = 0;
        }
        else {
            // note that the filter could be anything here, but our purposes we're assuming a greater than filter only,
            // so just read off the value and use that
            this.currentValue = parentModel.filter;
        }
    }
}
/** @nocollapse */ BtnCheckboxFilterComponent.ɵfac = function BtnCheckboxFilterComponent_Factory(t) { return new (t || BtnCheckboxFilterComponent)(); };
/** @nocollapse */ BtnCheckboxFilterComponent.ɵcmp = ɵɵdefineComponent({ type: BtnCheckboxFilterComponent, selectors: [["app-btn-checkbox-filter"]], viewQuery: function BtnCheckboxFilterComponent_Query(rf, ctx) { if (rf & 1) {
        ɵɵviewQuery(_c0, true, ViewContainerRef);
    } if (rf & 2) {
        var _t;
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.input = _t.first);
    } }, hostAttrs: [1, "hostClass"], decls: 11, vars: 9, consts: [[3, "change"], ["filterSelect", ""], ["value", ""], ["value", "true"], ["value", "false"]], template: function BtnCheckboxFilterComponent_Template(rf, ctx) { if (rf & 1) {
        const _r1 = ɵɵgetCurrentView();
        ɵɵelementStart(0, "select", 0, 1);
        ɵɵlistener("change", function BtnCheckboxFilterComponent_Template_select_change_0_listener() { ɵɵrestoreView(_r1); const _r0 = ɵɵreference(1); return ctx.onChange(_r0.value); });
        ɵɵelementStart(2, "option", 2);
        ɵɵtext(3);
        ɵɵpipe(4, "translate");
        ɵɵelementEnd();
        ɵɵelementStart(5, "option", 3);
        ɵɵtext(6);
        ɵɵpipe(7, "translate");
        ɵɵelementEnd();
        ɵɵelementStart(8, "option", 4);
        ɵɵtext(9);
        ɵɵpipe(10, "translate");
        ɵɵelementEnd();
        ɵɵelementEnd();
    } if (rf & 2) {
        ɵɵadvance(3);
        ɵɵtextInterpolate(ɵɵpipeBind1(4, 3, "selectAll"));
        ɵɵadvance(3);
        ɵɵtextInterpolate(ɵɵpipeBind1(7, 5, "enabled"));
        ɵɵadvance(3);
        ɵɵtextInterpolate(ɵɵpipeBind1(10, 7, "disabled"));
    } }, directives: [NgSelectOption, ɵangular_packages_forms_forms_x], pipes: [TranslatePipe], styles: [".hostClass[_ngcontent-%COMP%]{width:100%}"] });
/*@__PURE__*/ (function () { ɵsetClassMetadata(BtnCheckboxFilterComponent, [{
        type: Component,
        args: [{
                selector: 'app-btn-checkbox-filter',
                templateUrl: './btn-checkbox-filter.component.html',
                styleUrls: ['./btn-checkbox-filter.component.css'],
                host: { 'class': 'hostClass' }
            }]
    }], null, { input: [{
            type: ViewChild,
            args: ['input', { read: ViewContainerRef }]
        }] }); })();

class DialogMessageComponent {
    constructor(dialogRef) {
        this.dialogRef = dialogRef;
    }
    ngOnInit() {
    }
    doAccept() {
        this.dialogRef.close({ event: 'Accept' });
    }
    closeDialog() {
        this.dialogRef.close({ event: 'Cancel' });
    }
}
/** @nocollapse */ DialogMessageComponent.ɵfac = function DialogMessageComponent_Factory(t) { return new (t || DialogMessageComponent)(ɵɵdirectiveInject(MatDialogRef)); };
/** @nocollapse */ DialogMessageComponent.ɵcmp = ɵɵdefineComponent({ type: DialogMessageComponent, selectors: [["app-dialog-message"]], decls: 12, vars: 8, consts: [["mat-dialog-title", ""], [1, "mat-typography"], ["align", "end"], ["mat-button", "", 3, "click"], ["mat-button", "", "cdkFocusInitial", "", 3, "click"]], template: function DialogMessageComponent_Template(rf, ctx) { if (rf & 1) {
        ɵɵelementStart(0, "h5", 0);
        ɵɵtext(1);
        ɵɵelementEnd();
        ɵɵelementStart(2, "mat-dialog-content", 1);
        ɵɵelementStart(3, "p");
        ɵɵtext(4);
        ɵɵelementEnd();
        ɵɵelementEnd();
        ɵɵelementStart(5, "mat-dialog-actions", 2);
        ɵɵelementStart(6, "button", 3);
        ɵɵlistener("click", function DialogMessageComponent_Template_button_click_6_listener() { return ctx.closeDialog(); });
        ɵɵtext(7);
        ɵɵpipe(8, "translate");
        ɵɵelementEnd();
        ɵɵelementStart(9, "button", 4);
        ɵɵlistener("click", function DialogMessageComponent_Template_button_click_9_listener() { return ctx.doAccept(); });
        ɵɵtext(10);
        ɵɵpipe(11, "translate");
        ɵɵelementEnd();
        ɵɵelementEnd();
    } if (rf & 2) {
        ɵɵadvance(1);
        ɵɵtextInterpolate(ctx.title);
        ɵɵadvance(3);
        ɵɵtextInterpolate1(" ", ctx.message, " ");
        ɵɵadvance(3);
        ɵɵtextInterpolate(ɵɵpipeBind1(8, 4, "cancel"));
        ɵɵadvance(3);
        ɵɵtextInterpolate(ɵɵpipeBind1(11, 6, "accept"));
    } }, directives: [MatDialogTitle, MatDialogContent, MatDialogActions, MatButton], pipes: [TranslatePipe], styles: [""] });
/*@__PURE__*/ (function () { ɵsetClassMetadata(DialogMessageComponent, [{
        type: Component,
        args: [{
                selector: 'app-dialog-message',
                templateUrl: './dialog-message.component.html',
                styleUrls: ['./dialog-message.component.css']
            }]
    }], function () { return [{ type: MatDialogRef }]; }, null); })();

function DataGridComponent_span_1_Template(rf, ctx) { if (rf & 1) {
    ɵɵelement(0, "span", 17);
} if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵproperty("translate", ctx_r0.title);
} }
function DataGridComponent_button_2_Template(rf, ctx) { if (rf & 1) {
    const _r16 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "button", 18);
    ɵɵlistener("click", function DataGridComponent_button_2_Template_button_click_0_listener() { ɵɵrestoreView(_r16); const ctx_r15 = ɵɵnextContext(); return ctx_r15.deleteChanges(); });
    ɵɵpipe(1, "translate");
    ɵɵelementStart(2, "mat-icon", 19);
    ɵɵtext(3, " close ");
    ɵɵelementEnd();
    ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = ɵɵnextContext();
    ɵɵpropertyInterpolate("title", ɵɵpipeBind1(1, 2, "cancel"));
    ɵɵproperty("disabled", ctx_r1.changeCounter <= 0);
} }
function DataGridComponent_button_3_Template(rf, ctx) { if (rf & 1) {
    const _r18 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "button", 20);
    ɵɵlistener("click", function DataGridComponent_button_3_Template_button_click_0_listener() { ɵɵrestoreView(_r18); const ctx_r17 = ɵɵnextContext(); return ctx_r17.undo(); });
    ɵɵpipe(1, "translate");
    ɵɵelementStart(2, "mat-icon", 19);
    ɵɵtext(3, " undo ");
    ɵɵelementEnd();
    ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = ɵɵnextContext();
    ɵɵpropertyInterpolate("title", ɵɵpipeBind1(1, 2, "undo"));
    ɵɵproperty("disabled", ctx_r2.changeCounter <= 0);
} }
function DataGridComponent_button_4_Template(rf, ctx) { if (rf & 1) {
    const _r20 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "button", 21);
    ɵɵlistener("click", function DataGridComponent_button_4_Template_button_click_0_listener() { ɵɵrestoreView(_r20); const ctx_r19 = ɵɵnextContext(); return ctx_r19.redo(); });
    ɵɵpipe(1, "translate");
    ɵɵelementStart(2, "mat-icon", 19);
    ɵɵtext(3, " redo ");
    ɵɵelementEnd();
    ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r3 = ɵɵnextContext();
    ɵɵpropertyInterpolate("title", ɵɵpipeBind1(1, 2, "redo"));
    ɵɵproperty("disabled", ctx_r3.redoCounter <= 0);
} }
function DataGridComponent_button_5_Template(rf, ctx) { if (rf & 1) {
    const _r22 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "button", 22);
    ɵɵlistener("click", function DataGridComponent_button_5_Template_button_click_0_listener() { ɵɵrestoreView(_r22); const ctx_r21 = ɵɵnextContext(); return ctx_r21.applyChanges(); });
    ɵɵpipe(1, "translate");
    ɵɵelementStart(2, "mat-icon", 19);
    ɵɵtext(3, " check ");
    ɵɵelementEnd();
    ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r4 = ɵɵnextContext();
    ɵɵpropertyInterpolate("title", ɵɵpipeBind1(1, 2, "accept"));
    ɵɵproperty("disabled", ctx_r4.changeCounter <= 0);
} }
function DataGridComponent_label_7_Template(rf, ctx) { if (rf & 1) {
    ɵɵelement(0, "label", 17);
} if (rf & 2) {
    ɵɵproperty("translate", "search");
} }
function DataGridComponent_input_8_Template(rf, ctx) { if (rf & 1) {
    const _r24 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "input", 23);
    ɵɵlistener("keyup", function DataGridComponent_input_8_Template_input_keyup_0_listener() { ɵɵrestoreView(_r24); const ctx_r23 = ɵɵnextContext(); return ctx_r23.quickSearch(); })("ngModelChange", function DataGridComponent_input_8_Template_input_ngModelChange_0_listener($event) { ɵɵrestoreView(_r24); const ctx_r25 = ɵɵnextContext(); return ctx_r25.searchValue = $event; });
    ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r6 = ɵɵnextContext();
    ɵɵproperty("ngModel", ctx_r6.searchValue);
} }
function DataGridComponent_button_9_Template(rf, ctx) { if (rf & 1) {
    const _r27 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "button", 24);
    ɵɵlistener("click", function DataGridComponent_button_9_Template_button_click_0_listener() { ɵɵrestoreView(_r27); const ctx_r26 = ɵɵnextContext(); return ctx_r26.removeData(); });
    ɵɵelementStart(1, "mat-icon", 19);
    ɵɵtext(2, " delete ");
    ɵɵelementEnd();
    ɵɵelement(3, "span", 17);
    ɵɵelementEnd();
} if (rf & 2) {
    ɵɵadvance(3);
    ɵɵproperty("translate", "remove");
} }
function DataGridComponent_button_10_Template(rf, ctx) { if (rf & 1) {
    ɵɵelementStart(0, "button", 25);
    ɵɵelement(1, "span", 17);
    ɵɵelementStart(2, "mat-icon", 19);
    ɵɵtext(3, " keyboard_arrow_down ");
    ɵɵelementEnd();
    ɵɵelementEnd();
} if (rf & 2) {
    ɵɵnextContext();
    const _r9 = ɵɵreference(12);
    ɵɵproperty("matMenuTriggerFor", _r9);
    ɵɵadvance(1);
    ɵɵproperty("translate", "actions");
} }
function DataGridComponent_button_13_Template(rf, ctx) { if (rf & 1) {
    const _r29 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "button", 26);
    ɵɵlistener("click", function DataGridComponent_button_13_Template_button_click_0_listener() { ɵɵrestoreView(_r29); const ctx_r28 = ɵɵnextContext(); return ctx_r28.exportData(); });
    ɵɵtext(1);
    ɵɵpipe(2, "translate");
    ɵɵelementEnd();
} if (rf & 2) {
    ɵɵadvance(1);
    ɵɵtextInterpolate1(" ", ɵɵpipeBind1(2, 1, "export"), " ");
} }
function DataGridComponent_button_14_Template(rf, ctx) { if (rf & 1) {
    const _r31 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "button", 26);
    ɵɵlistener("click", function DataGridComponent_button_14_Template_button_click_0_listener() { ɵɵrestoreView(_r31); const ctx_r30 = ɵɵnextContext(); return ctx_r30.onDuplicateButtonClicked(); });
    ɵɵtext(1);
    ɵɵpipe(2, "translate");
    ɵɵelementEnd();
} if (rf & 2) {
    ɵɵadvance(1);
    ɵɵtextInterpolate1(" ", ɵɵpipeBind1(2, 1, "duplicate"), "");
} }
function DataGridComponent_button_15_Template(rf, ctx) { if (rf & 1) {
    ɵɵelementStart(0, "button", 27);
    ɵɵtext(1);
    ɵɵpipe(2, "translate");
    ɵɵelementEnd();
} if (rf & 2) {
    ɵɵadvance(1);
    ɵɵtextInterpolate1(" ", ɵɵpipeBind1(2, 1, "search/replace"), "");
} }
function DataGridComponent_button_16_Template(rf, ctx) { if (rf & 1) {
    const _r33 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "button", 28);
    ɵɵlistener("click", function DataGridComponent_button_16_Template_button_click_0_listener() { ɵɵrestoreView(_r33); const ctx_r32 = ɵɵnextContext(); return ctx_r32.newData(); });
    ɵɵelementStart(1, "mat-icon", 19);
    ɵɵtext(2, " add_circle_outline ");
    ɵɵelementEnd();
    ɵɵelement(3, "span", 17);
    ɵɵelementEnd();
} if (rf & 2) {
    ɵɵadvance(3);
    ɵɵproperty("translate", "new");
} }
function DataGridComponent_button_17_Template(rf, ctx) { if (rf & 1) {
    const _r35 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "button", 28);
    ɵɵlistener("click", function DataGridComponent_button_17_Template_button_click_0_listener() { ɵɵrestoreView(_r35); const ctx_r34 = ɵɵnextContext(); return ctx_r34.onAddButtonClicked(); });
    ɵɵelementStart(1, "mat-icon", 19);
    ɵɵtext(2, " add_circle_outline ");
    ɵɵelementEnd();
    ɵɵelement(3, "span", 17);
    ɵɵelementEnd();
} if (rf & 2) {
    ɵɵadvance(3);
    ɵɵproperty("translate", "add");
} }
class DataGridComponent {
    constructor(dialog, translate) {
        this.dialog = dialog;
        this.translate = translate;
        this.modules = AllCommunityModules;
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
        this.remove = new EventEmitter();
        this.new = new EventEmitter();
        this.add = new EventEmitter();
        this.sendChanges = new EventEmitter();
        this.getSelectedRows = new EventEmitter();
        this.duplicate = new EventEmitter();
        this.getAllRows = new EventEmitter();
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
                        comparator(filterLocalDateAtMidnight, cellValue) {
                            const dateCellValue = new Date(cellValue);
                            const dateFilter = new Date(filterLocalDateAtMidnight);
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
            localeTextFunc: (key, defaultValue) => {
                const data = this.translate.instant(key);
                return data === key ? defaultValue : data;
            }
        };
    }
    ngOnInit() {
        if (this.eventRefreshSubscription) {
            this._eventRefreshSubscription = this.eventRefreshSubscription.subscribe(() => {
                this.changesMap.clear();
                this.changeCounter = 0;
                this.previousChangeCounter = 0;
                this.redoCounter = 0;
                this.getElements();
            });
        }
        if (this.eventGetSelectedRowsSubscription) {
            this._eventGetSelectedRowsSubscription = this.eventGetSelectedRowsSubscription.subscribe(() => {
                this.emitSelectedRows();
            });
        }
        if (this.eventGetAllRowsSubscription) {
            this._eventGetAllRowsSubscription = this.eventGetAllRowsSubscription.subscribe(() => {
                this.emitAllRows();
            });
        }
        if (this.eventSaveAgGridStateSubscription) {
            this._eventSaveAgGridStateSubscription = this.eventSaveAgGridStateSubscription.subscribe(() => {
                this.saveAgGridState();
            });
        }
        if (this.eventAddItemsSubscription) {
            this.eventAddItemsSubscription.subscribe((items) => {
                this.addItems(items);
            });
        }
    }
    firstDataRendered() {
        if (localStorage.agGridState != undefined) {
            let agGridState = JSON.parse(localStorage.agGridState);
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
    }
    onGridReady(params) {
        if (this.singleSelection) {
            this.gridOptions.rowSelection = 'single';
        }
        // if (this.nonEditable) {this.gridOptions.defaultColDef.editable = false}
        this.params = params;
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        this.getElements();
        console.log(this.columnDefs);
        for (const col of this.columnDefs) {
            if (col.field === 'status') {
                console.log("status column true");
                this.statusColumn = true;
            }
        }
    }
    emitSelectedRows() {
        const selectedNodes = this.gridApi.getSelectedNodes();
        const selectedData = selectedNodes.map(node => node.data);
        this.getSelectedRows.emit(selectedData);
    }
    emitAllRows() {
        let rowData = [];
        this.gridApi.forEachNode(node => rowData.push(node.data));
        this.getAllRows.emit(rowData);
    }
    saveAgGridState() {
        let agGridState = {
            idAgGrid: this.id,
            colState: this.gridColumnApi.getColumnState(),
            filterState: this.gridApi.getFilterModel(),
            sortState: this.gridApi.getSortModel(),
            valueSearchGeneric: this.searchValue
        };
        localStorage.setItem("agGridState", JSON.stringify(agGridState));
    }
    removeAgGridState() {
        localStorage.removeItem("agGridState");
    }
    getColumnKeysAndHeaders(columnkeys) {
        let header = [];
        if (this.columnDefs.length == 0) {
            return '';
        }
        ;
        let allColumnKeys = this.gridOptions.columnApi.getAllDisplayedColumns();
        // console.log(allColumnKeys);
        allColumnKeys.forEach(element => {
            if (element.userProvidedColDef.headerName !== '') {
                columnkeys.push(element.userProvidedColDef.field);
                header.push(element.userProvidedColDef.headerName);
            }
        });
        return header.join(",");
    }
    exportData() {
        let columnkeys = [];
        let customHeader = '';
        customHeader = this.getColumnKeysAndHeaders(columnkeys);
        let params = {
            onlySelected: true,
            columnKeys: columnkeys,
            customHeader: customHeader,
            skipHeader: true
        };
        this.gridApi.exportDataAsCsv(params);
    }
    quickSearch() {
        this.gridApi.setQuickFilter(this.searchValue);
    }
    getElements() {
        this.getAll()
            .subscribe((items) => {
            this.rowData = items;
            this.gridApi.setRowData(this.rowData);
            this.gridApi.sizeColumnsToFit();
            console.log(this.rowData);
        });
    }
    addItems(newItems) {
        console.log(newItems);
        let itemsToAdd = [];
        newItems.forEach(item => {
            if (item.id == undefined || (this.rowData.find(element => element.id === item.id)) == undefined) {
                if (this.statusColumn) {
                    item.status = 'Pending creation';
                }
                itemsToAdd.push(item);
                this.rowData.push(item);
            }
            else {
                console.log(`Item with the ID ${item.id} already exists`);
            }
        });
        this.gridApi.updateRowData({ add: itemsToAdd });
        console.log(this.columnDefs);
        // params.oldValue!=undefined
    }
    removeData() {
        this.gridApi.stopEditing(false);
        const selectedNodes = this.gridApi.getSelectedNodes();
        const selectedData = selectedNodes.map(node => node.data);
        this.remove.emit(selectedData);
        if (this.statusColumn) {
            const selectedRows = selectedNodes.map(node => node.id);
            for (const id of selectedRows) {
                this.gridApi.getRowNode(id).data.status = 'Deleted';
            }
            this.gridOptions.api.refreshCells();
        }
        this.gridOptions.api.deselectAll();
    }
    newData() {
        this.gridApi.stopEditing(false);
        this.new.emit(-1);
    }
    onAddButtonClicked() {
        this.gridApi.stopEditing(false);
        this.add.emit(-1);
    }
    onDuplicateButtonClicked() {
        this.gridApi.stopEditing(false);
        console.log(this.changeCounter);
        if (this.changeCounter > 0) {
            const dialogRef = this.dialog.open(DialogMessageComponent);
            dialogRef.componentInstance.title = 'Caution';
            dialogRef.componentInstance.message = 'If you duplicate rows without apply changes, your modifications will be overwritted, do you want to continue?';
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    if (result.event === 'Accept') {
                        const selectedNodes = this.gridApi.getSelectedNodes();
                        const selectedData = selectedNodes.map(node => node.data);
                        this.duplicate.emit(selectedData);
                    }
                }
            });
        }
        else {
            const selectedNodes = this.gridApi.getSelectedNodes();
            const selectedData = selectedNodes.map(node => node.data);
            this.duplicate.emit(selectedData);
        }
    }
    applyChanges() {
        const itemsChanged = [];
        this.gridApi.stopEditing(false);
        for (const key of this.changesMap.keys()) {
            itemsChanged.push(this.gridApi.getRowNode(key).data);
        }
        this.sendChanges.emit(itemsChanged);
        this.changesMap.clear();
        this.changeCounter = 0;
        this.previousChangeCounter = 0;
        this.redoCounter = 0;
        this.params.colDef.cellStyle = { backgroundColor: '#FFFFFF' };
        this.gridApi.redrawRows();
    }
    deleteChanges() {
        this.gridApi.stopEditing(false);
        while (this.changeCounter > 0) {
            this.undo();
        }
        this.changesMap.clear();
        //this.previousChangeCounter = 0;
        this.redoCounter = 0;
        //this.params.colDef.cellStyle =  {backgroundColor: '#FFFFFF'};
        //this.gridApi.redrawRows();
    }
    onFilterModified() {
        this.deleteChanges();
    }
    undo() {
        this.gridApi.stopEditing(false);
        this.gridApi.undoCellEditing();
        this.changeCounter -= 1;
        this.redoCounter += 1;
    }
    redo() {
        this.gridApi.stopEditing(false);
        this.gridApi.redoCellEditing();
        this.changeCounter += 1;
        this.redoCounter -= 1;
    }
    onCellEditingStopped(e) {
        if (this.modificationChange) {
            this.changeCounter++;
            this.redoCounter = 0;
            this.onCellValueChanged(e);
            this.modificationChange = false;
        }
    }
    onCellValueChanged(params) {
        console.log("value Change");
        this.params = params;
        if (this.changeCounter > this.previousChangeCounter) 
        // True if we have edited some cell or we have done a redo 
        {
            if (params.oldValue !== params.value && !(params.oldValue == null && params.value === '')) {
                if (!this.changesMap.has(params.node.id)) // If it's firts edit of a cell, we add it to the map and we paint it
                 {
                    const addMap = new Map();
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
                        const currentChanges = this.changesMap.get(params.node.id).get(params.colDef.field);
                        this.changesMap.get(params.node.id).set(params.colDef.field, (currentChanges + 1));
                    }
                }
                this.paintCells(params, this.changesMap); //We paint the row of the edited cell 
                this.previousChangeCounter++; //We match the current previousChangeCounter with changeCounter
            }
        }
        else if (this.changeCounter < this.previousChangeCounter) { // True if we have done an undo
            let currentChanges = -1;
            if (this.changesMap.has(params.node.id)) {
                currentChanges = this.changesMap.get(params.node.id).get(params.colDef.field);
            }
            if (currentChanges === 1) { //Once the undo it's done, cell is in his initial status
                this.changesMap.get(params.node.id).delete(params.colDef.field);
                if (this.changesMap.get(params.node.id).size === 0) { // No more modifications in this row
                    this.changesMap.delete(params.node.id);
                    const row = this.gridApi.getDisplayedRowAtIndex(params.rowIndex);
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
                let newValue;
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
    }
    modificationWithoutChanges(params) {
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
    }
    getColumnIndexByColId(api, colId) {
        return api.getAllColumns().findIndex(col => col.getColId() === colId);
    }
    paintCells(params, changesMap) {
        const row = this.gridApi.getDisplayedRowAtIndex(params.rowIndex);
        this.changeCellStyleColumns(params, changesMap, '#E8F1DE');
        this.gridApi.redrawRows({ rowNodes: [row] });
        this.changeCellStyleColumns(params, changesMap, '#FFFFFF');
        // We will define cellStyle white to future modifications (like filter)
    }
    changeCellStyleColumns(params, changesMap, color) {
        for (const key of changesMap.get(params.node.id).keys()) {
            const columnNumber = this.getColumnIndexByColId(this.gridColumnApi, key);
            this.gridColumnApi.columnController.gridColumns[columnNumber].colDef.cellStyle = { backgroundColor: color };
        }
    }
}
/** @nocollapse */ DataGridComponent.ɵfac = function DataGridComponent_Factory(t) { return new (t || DataGridComponent)(ɵɵdirectiveInject(MatDialog), ɵɵdirectiveInject(TranslateService)); };
/** @nocollapse */ DataGridComponent.ɵcmp = ɵɵdefineComponent({ type: DataGridComponent, selectors: [["app-data-grid"]], inputs: { eventRefreshSubscription: "eventRefreshSubscription", eventGetSelectedRowsSubscription: "eventGetSelectedRowsSubscription", eventGetAllRowsSubscription: "eventGetAllRowsSubscription", eventSaveAgGridStateSubscription: "eventSaveAgGridStateSubscription", eventAddItemsSubscription: "eventAddItemsSubscription", frameworkComponents: "frameworkComponents", columnDefs: "columnDefs", getAll: "getAll", discardChangesButton: "discardChangesButton", id: "id", undoButton: "undoButton", redoButton: "redoButton", applyChangesButton: "applyChangesButton", deleteButton: "deleteButton", newButton: "newButton", actionButton: "actionButton", addButton: "addButton", globalSearch: "globalSearch", themeGrid: "themeGrid", singleSelection: "singleSelection", nonEditable: "nonEditable", title: "title", hideExportButton: "hideExportButton", hideDuplicateButton: "hideDuplicateButton", hideSearchReplaceButton: "hideSearchReplaceButton" }, outputs: { remove: "remove", new: "new", add: "add", sendChanges: "sendChanges", duplicate: "duplicate", getSelectedRows: "getSelectedRows", getAllRows: "getAllRows", getAgGridState: "getAgGridState" }, decls: 21, vars: 27, consts: [["id", "grup1", 1, "editDivBtns"], [3, "translate", 4, "ngIf"], ["mat-mini-fab", "", "class", "editBtn", "id", "deleteChangesButton", "type", "button", 3, "title", "disabled", "click", 4, "ngIf"], ["mat-mini-fab", "", "class", "editBtn", "id", "undo", 3, "title", "disabled", "click", 4, "ngIf"], ["mat-mini-fab", "", "class", "editBtn", "id", "redo", 3, "title", "disabled", "click", 4, "ngIf"], ["mat-mini-fab", "", "class", "editBtn", "id", "applyChangesButton", 3, "title", "disabled", "click", 4, "ngIf"], ["id", "grup2", 1, "actionsDivBtns"], ["type", "text", "class", "searchGenericInput", "placeholder", "", "ml-2", "", 3, "ngModel", "keyup", "ngModelChange", 4, "ngIf"], ["mat-stroked-button", "", "id", "deleteButton", 3, "click", 4, "ngIf"], ["mat-stroked-button", "", "id", "actionButton", 3, "matMenuTriggerFor", 4, "ngIf"], ["menu", "matMenu"], ["mat-menu-item", "", 3, "click", 4, "ngIf"], ["mat-menu-item", "", 4, "ngIf"], ["mat-stroked-button", "", "id", "newButton", 3, "click", 4, "ngIf"], [1, "row", 2, "height", "100%"], ["id", "myGrid", 2, "width", "100%", "height", "100%"], ["rowSelection", "multiple", "multiSortKey", "key", 2, "width", "100%", "height", "100%", 3, "floatingFilter", "rowData", "columnDefs", "gridOptions", "animateRows", "pagination", "modules", "undoRedoCellEditing", "undoRedoCellEditingLimit", "suppressRowClickSelection", "frameworkComponents", "filterModified", "cellEditingStopped", "cellValueChanged", "gridReady", "firstDataRendered"], [3, "translate"], ["mat-mini-fab", "", "id", "deleteChangesButton", "type", "button", 1, "editBtn", 3, "title", "disabled", "click"], ["fontSet", "material-icons-round"], ["mat-mini-fab", "", "id", "undo", 1, "editBtn", 3, "title", "disabled", "click"], ["mat-mini-fab", "", "id", "redo", 1, "editBtn", 3, "title", "disabled", "click"], ["mat-mini-fab", "", "id", "applyChangesButton", 1, "editBtn", 3, "title", "disabled", "click"], ["type", "text", "placeholder", "", "ml-2", "", 1, "searchGenericInput", 3, "ngModel", "keyup", "ngModelChange"], ["mat-stroked-button", "", "id", "deleteButton", 3, "click"], ["mat-stroked-button", "", "id", "actionButton", 3, "matMenuTriggerFor"], ["mat-menu-item", "", 3, "click"], ["mat-menu-item", ""], ["mat-stroked-button", "", "id", "newButton", 3, "click"]], template: function DataGridComponent_Template(rf, ctx) { if (rf & 1) {
        ɵɵelementStart(0, "div", 0);
        ɵɵtemplate(1, DataGridComponent_span_1_Template, 1, 1, "span", 1);
        ɵɵtemplate(2, DataGridComponent_button_2_Template, 4, 4, "button", 2);
        ɵɵtemplate(3, DataGridComponent_button_3_Template, 4, 4, "button", 3);
        ɵɵtemplate(4, DataGridComponent_button_4_Template, 4, 4, "button", 4);
        ɵɵtemplate(5, DataGridComponent_button_5_Template, 4, 4, "button", 5);
        ɵɵelementEnd();
        ɵɵelementStart(6, "div", 6);
        ɵɵtemplate(7, DataGridComponent_label_7_Template, 1, 1, "label", 1);
        ɵɵtemplate(8, DataGridComponent_input_8_Template, 1, 1, "input", 7);
        ɵɵtemplate(9, DataGridComponent_button_9_Template, 4, 1, "button", 8);
        ɵɵtemplate(10, DataGridComponent_button_10_Template, 4, 2, "button", 9);
        ɵɵelementStart(11, "mat-menu", null, 10);
        ɵɵtemplate(13, DataGridComponent_button_13_Template, 3, 3, "button", 11);
        ɵɵtemplate(14, DataGridComponent_button_14_Template, 3, 3, "button", 11);
        ɵɵtemplate(15, DataGridComponent_button_15_Template, 3, 3, "button", 12);
        ɵɵelementEnd();
        ɵɵtemplate(16, DataGridComponent_button_16_Template, 4, 1, "button", 13);
        ɵɵtemplate(17, DataGridComponent_button_17_Template, 4, 1, "button", 13);
        ɵɵelementEnd();
        ɵɵelementStart(18, "div", 14);
        ɵɵelementStart(19, "div", 15);
        ɵɵelementStart(20, "ag-grid-angular", 16);
        ɵɵlistener("filterModified", function DataGridComponent_Template_ag_grid_angular_filterModified_20_listener() { return ctx.onFilterModified(); })("cellEditingStopped", function DataGridComponent_Template_ag_grid_angular_cellEditingStopped_20_listener($event) { return ctx.onCellEditingStopped($event); })("cellValueChanged", function DataGridComponent_Template_ag_grid_angular_cellValueChanged_20_listener($event) { return ctx.onCellValueChanged($event); })("gridReady", function DataGridComponent_Template_ag_grid_angular_gridReady_20_listener($event) { return ctx.onGridReady($event); })("firstDataRendered", function DataGridComponent_Template_ag_grid_angular_firstDataRendered_20_listener() { return ctx.firstDataRendered(); });
        ɵɵelementEnd();
        ɵɵelementEnd();
        ɵɵelementEnd();
    } if (rf & 2) {
        ɵɵadvance(1);
        ɵɵproperty("ngIf", ctx.title);
        ɵɵadvance(1);
        ɵɵproperty("ngIf", ctx.discardChangesButton);
        ɵɵadvance(1);
        ɵɵproperty("ngIf", ctx.undoButton);
        ɵɵadvance(1);
        ɵɵproperty("ngIf", ctx.redoButton);
        ɵɵadvance(1);
        ɵɵproperty("ngIf", ctx.applyChangesButton);
        ɵɵadvance(2);
        ɵɵproperty("ngIf", ctx.globalSearch);
        ɵɵadvance(1);
        ɵɵproperty("ngIf", ctx.globalSearch);
        ɵɵadvance(1);
        ɵɵproperty("ngIf", ctx.deleteButton);
        ɵɵadvance(1);
        ɵɵproperty("ngIf", ctx.actionButton);
        ɵɵadvance(3);
        ɵɵproperty("ngIf", !ctx.hideExportButton);
        ɵɵadvance(1);
        ɵɵproperty("ngIf", !ctx.hideDuplicateButton);
        ɵɵadvance(1);
        ɵɵproperty("ngIf", !ctx.hideSearchReplaceButton);
        ɵɵadvance(1);
        ɵɵproperty("ngIf", ctx.newButton);
        ɵɵadvance(1);
        ɵɵproperty("ngIf", ctx.addButton);
        ɵɵadvance(3);
        ɵɵclassMap(ctx.themeGrid);
        ɵɵproperty("floatingFilter", true)("rowData", ctx.rowData)("columnDefs", ctx.columnDefs)("gridOptions", ctx.gridOptions)("animateRows", true)("pagination", false)("modules", ctx.modules)("undoRedoCellEditing", true)("undoRedoCellEditingLimit", 200)("suppressRowClickSelection", true)("frameworkComponents", ctx.frameworkComponents);
    } }, directives: [NgIf, _MatMenu, AgGridAngular, TranslateDirective, MatButton, MatIcon, DefaultValueAccessor, NgControlStatus, NgModel, MatMenuTrigger, MatMenuItem], pipes: [TranslatePipe], styles: ["input[_ngcontent-%COMP%], label[_ngcontent-%COMP%]{display:inline-block;margin:5px 5px 5px 10px}#newButton[_ngcontent-%COMP%]{background:#68a225 0 0 no-repeat padding-box;color:#fff;margin-left:3px}#actionButton[_ngcontent-%COMP%], #deleteButton[_ngcontent-%COMP%]{background:#fff 0 0 no-repeat padding-box;margin-left:3px}#actionButton[_ngcontent-%COMP%]{text-align:center!important}#applyChangesButton[_ngcontent-%COMP%]{background:#68a225 0 0 no-repeat padding-box;color:#fff!important;margin-left:3px}#applyChangesButton[disabled][_ngcontent-%COMP%]{background:#83976c 0 0 no-repeat padding-box}#redo[_ngcontent-%COMP%]{background:#ff9300;color:#fff!important;margin-left:3px}#redo[disabled][_ngcontent-%COMP%]{background:#ffc97f;margin-left:3px}#undo[_ngcontent-%COMP%]{background:#ff9300;color:#fff!important;margin-left:3px}#undo[disabled][_ngcontent-%COMP%]{background:#ffc97f;margin-left:3px}#deleteChangesButton[_ngcontent-%COMP%]{background:#df3133;color:#fff!important}#deleteChangesButton[disabled][_ngcontent-%COMP%]{background:#da8c8e;color:#fff!important}.editDivBtns[_ngcontent-%COMP%]{height:30px!important;line-height:30px!important;margin-left:10px;text-align:start;width:130px}.actionsDivBtns[_ngcontent-%COMP%]{height:60px;text-align:end;width:calc(100% - 140px)}.actionsDivBtns[_ngcontent-%COMP%], .editDivBtns[_ngcontent-%COMP%]{display:inline-block!important}.actionsDivBtns[_ngcontent-%COMP%]   .mat-stroked-button[_ngcontent-%COMP%]{padding:5px 20px!important}.editDivBtns[_ngcontent-%COMP%]   .mat-mini-fab[_ngcontent-%COMP%]   .mat-button-wrapper[_ngcontent-%COMP%]{display:inherit!important;padding:inherit!important}.editDivBtns[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%]{bottom:5px;height:30px!important;position:relative}.editDivBtns[_ngcontent-%COMP%]   .mat-mini-fab[_ngcontent-%COMP%]{height:30px;width:30px}.actionsDivBtns[_ngcontent-%COMP%]   .searchGenericInput[_ngcontent-%COMP%]{height:45px!important;width:45%!important}.ag-body-viewport.ag-layout-normal[_ngcontent-%COMP%]   [_ngcontent-%COMP%]::-webkit-scrollbar-thumb{background:#eee}\u200B[_ngcontent-%COMP%]   .ag-body-viewport.ag-layout-normal[_ngcontent-%COMP%]   [_ngcontent-%COMP%]::-webkit-scrollbar{height:2em;width:2em}.ag-body-viewport.ag-layout-normal[_ngcontent-%COMP%]   [_ngcontent-%COMP%]::-webkit-scrollbar-button{background:#ccc}.ag-body-viewport.ag-layout-normal[_ngcontent-%COMP%]::-webkit-scrollbar-track-piece{background:#888}"] });
/*@__PURE__*/ (function () { ɵsetClassMetadata(DataGridComponent, [{
        type: Component,
        args: [{
                selector: 'app-data-grid',
                templateUrl: './data-grid.component.html',
                styleUrls: ['./data-grid.component.css']
            }]
    }], function () { return [{ type: MatDialog }, { type: TranslateService }]; }, { eventRefreshSubscription: [{
            type: Input
        }], eventGetSelectedRowsSubscription: [{
            type: Input
        }], eventGetAllRowsSubscription: [{
            type: Input
        }], eventSaveAgGridStateSubscription: [{
            type: Input
        }], eventAddItemsSubscription: [{
            type: Input
        }], frameworkComponents: [{
            type: Input
        }], columnDefs: [{
            type: Input
        }], getAll: [{
            type: Input
        }], discardChangesButton: [{
            type: Input
        }], id: [{
            type: Input
        }], undoButton: [{
            type: Input
        }], redoButton: [{
            type: Input
        }], applyChangesButton: [{
            type: Input
        }], deleteButton: [{
            type: Input
        }], newButton: [{
            type: Input
        }], actionButton: [{
            type: Input
        }], addButton: [{
            type: Input
        }], globalSearch: [{
            type: Input
        }], themeGrid: [{
            type: Input
        }], singleSelection: [{
            type: Input
        }], nonEditable: [{
            type: Input
        }], title: [{
            type: Input
        }], hideExportButton: [{
            type: Input
        }], hideDuplicateButton: [{
            type: Input
        }], hideSearchReplaceButton: [{
            type: Input
        }], remove: [{
            type: Output
        }], new: [{
            type: Output
        }], add: [{
            type: Output
        }], sendChanges: [{
            type: Output
        }], duplicate: [{
            type: Output
        }], getSelectedRows: [{
            type: Output
        }], getAllRows: [{
            type: Output
        }], getAgGridState: [{
            type: Output
        }] }); })();

class MaterialModule {
}
/** @nocollapse */ MaterialModule.ɵmod = ɵɵdefineNgModule({ type: MaterialModule });
/** @nocollapse */ MaterialModule.ɵinj = ɵɵdefineInjector({ factory: function MaterialModule_Factory(t) { return new (t || MaterialModule)(); }, imports: [A11yModule,
        CdkStepperModule,
        CdkTableModule,
        CdkTreeModule,
        DragDropModule,
        MatAutocompleteModule,
        MatBadgeModule,
        MatBottomSheetModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatCardModule,
        MatCheckboxModule,
        MatChipsModule,
        MatStepperModule,
        MatDatepickerModule,
        MatDialogModule,
        MatDividerModule,
        MatExpansionModule,
        MatGridListModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatMenuModule,
        MatNativeDateModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatRadioModule,
        MatRippleModule,
        MatSelectModule,
        MatSidenavModule,
        MatSliderModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatSortModule,
        MatTableModule,
        MatTabsModule,
        MatToolbarModule,
        MatTooltipModule,
        MatTreeModule,
        PortalModule,
        ScrollingModule,
        MatFormFieldModule] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && ɵɵsetNgModuleScope(MaterialModule, { exports: [A11yModule,
        CdkStepperModule,
        CdkTableModule,
        CdkTreeModule,
        DragDropModule,
        MatAutocompleteModule,
        MatBadgeModule,
        MatBottomSheetModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatCardModule,
        MatCheckboxModule,
        MatChipsModule,
        MatStepperModule,
        MatDatepickerModule,
        MatDialogModule,
        MatDividerModule,
        MatExpansionModule,
        MatGridListModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatMenuModule,
        MatNativeDateModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatRadioModule,
        MatRippleModule,
        MatSelectModule,
        MatSidenavModule,
        MatSliderModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatSortModule,
        MatTableModule,
        MatTabsModule,
        MatToolbarModule,
        MatTooltipModule,
        MatTreeModule,
        PortalModule,
        ScrollingModule,
        MatFormFieldModule] }); })();
/*@__PURE__*/ (function () { ɵsetClassMetadata(MaterialModule, [{
        type: NgModule,
        args: [{
                exports: [
                    A11yModule,
                    CdkStepperModule,
                    CdkTableModule,
                    CdkTreeModule,
                    DragDropModule,
                    MatAutocompleteModule,
                    MatBadgeModule,
                    MatBottomSheetModule,
                    MatButtonModule,
                    MatButtonToggleModule,
                    MatCardModule,
                    MatCheckboxModule,
                    MatChipsModule,
                    MatStepperModule,
                    MatDatepickerModule,
                    MatDialogModule,
                    MatDividerModule,
                    MatExpansionModule,
                    MatGridListModule,
                    MatIconModule,
                    MatInputModule,
                    MatListModule,
                    MatMenuModule,
                    MatNativeDateModule,
                    MatPaginatorModule,
                    MatProgressBarModule,
                    MatProgressSpinnerModule,
                    MatRadioModule,
                    MatRippleModule,
                    MatSelectModule,
                    MatSidenavModule,
                    MatSliderModule,
                    MatSlideToggleModule,
                    MatSnackBarModule,
                    MatSortModule,
                    MatTableModule,
                    MatTabsModule,
                    MatToolbarModule,
                    MatTooltipModule,
                    MatTreeModule,
                    PortalModule,
                    ScrollingModule,
                    MatFormFieldModule
                ]
            }]
    }], null, null); })();

const _c0$1 = function (a0) { return { "margin-top": a0 }; };
function DialogGridComponent_div_3_Template(rf, ctx) { if (rf & 1) {
    const _r4 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "div", 6);
    ɵɵelementStart(1, "app-data-grid", 7);
    ɵɵlistener("getSelectedRows", function DialogGridComponent_div_3_Template_app_data_grid_getSelectedRows_1_listener($event) { ɵɵrestoreView(_r4); const ctx_r3 = ɵɵnextContext(); return ctx_r3.joinRowsReceived($event); });
    ɵɵelementEnd();
    ɵɵelementEnd();
} if (rf & 2) {
    const getAll_r1 = ctx.$implicit;
    const i_r2 = ctx.index;
    const ctx_r0 = ɵɵnextContext();
    ɵɵproperty("ngStyle", ɵɵpureFunction1(9, _c0$1, i_r2 > 0 ? "100px" : "0px"));
    ɵɵadvance(1);
    ɵɵproperty("columnDefs", ctx_r0.columnDefsTable[i_r2])("themeGrid", ctx_r0.themeGrid)("getAll", getAll_r1)("globalSearch", true)("singleSelection", ctx_r0.singleSelectionTable[i_r2])("title", ctx_r0.titlesTable[i_r2])("nonEditable", ctx_r0.nonEditable)("eventGetSelectedRowsSubscription", ctx_r0.getAllRows.asObservable());
} }
class DialogGridComponent {
    constructor(dialogRef) {
        this.dialogRef = dialogRef;
        this.getAllRows = new Subject();
        this.allRowsReceived = [];
        this.joinTables = new EventEmitter();
        // this.nonEditable = true;
        this.tablesReceivedCounter = 0;
    }
    ngOnInit() {
        if (this.addButtonClickedSubscription) {
            this._addButtonClickedSubscription = this.addButtonClickedSubscription.subscribe(() => {
                this.getAllSelectedRows();
            });
        }
    }
    getAllSelectedRows() {
        this.getAllRows.next(true);
    }
    joinRowsReceived(data) {
        this.allRowsReceived.push(data);
        this.tablesReceivedCounter++;
        if (this.tablesReceivedCounter === this.getAllsTable.length) {
            this.doAdd(this.allRowsReceived);
            console.log(this.allRowsReceived);
        }
    }
    doAdd(rowsToAdd) {
        this.dialogRef.close({ event: 'Add', data: rowsToAdd });
    }
    closeDialog() {
        this.dialogRef.close({ event: 'Cancel' });
    }
}
/** @nocollapse */ DialogGridComponent.ɵfac = function DialogGridComponent_Factory(t) { return new (t || DialogGridComponent)(ɵɵdirectiveInject(MatDialogRef)); };
/** @nocollapse */ DialogGridComponent.ɵcmp = ɵɵdefineComponent({ type: DialogGridComponent, selectors: [["app-dialog-grid"]], outputs: { joinTables: "joinTables" }, decls: 11, vars: 8, consts: [["mat-dialog-title", ""], [1, "dialogConent"], ["class", "appDialogDataGridDiv", 3, "ngStyle", 4, "ngFor", "ngForOf"], ["mat-dialog-actions", "", "align", "end"], ["mat-button", "", 3, "click"], ["mat-button", "", "cdkFocusInitial", "", 3, "click"], [1, "appDialogDataGridDiv", 3, "ngStyle"], [3, "columnDefs", "themeGrid", "getAll", "globalSearch", "singleSelection", "title", "nonEditable", "eventGetSelectedRowsSubscription", "getSelectedRows"]], template: function DialogGridComponent_Template(rf, ctx) { if (rf & 1) {
        ɵɵelementStart(0, "h5", 0);
        ɵɵtext(1);
        ɵɵelementEnd();
        ɵɵelementStart(2, "mat-dialog-content", 1);
        ɵɵtemplate(3, DialogGridComponent_div_3_Template, 2, 11, "div", 2);
        ɵɵelementEnd();
        ɵɵelementStart(4, "div", 3);
        ɵɵelementStart(5, "button", 4);
        ɵɵlistener("click", function DialogGridComponent_Template_button_click_5_listener() { return ctx.closeDialog(); });
        ɵɵtext(6);
        ɵɵpipe(7, "translate");
        ɵɵelementEnd();
        ɵɵelementStart(8, "button", 5);
        ɵɵlistener("click", function DialogGridComponent_Template_button_click_8_listener() { return ctx.getAllSelectedRows(); });
        ɵɵtext(9);
        ɵɵpipe(10, "translate");
        ɵɵelementEnd();
        ɵɵelementEnd();
    } if (rf & 2) {
        ɵɵadvance(1);
        ɵɵtextInterpolate(ctx.title);
        ɵɵadvance(2);
        ɵɵproperty("ngForOf", ctx.getAllsTable);
        ɵɵadvance(3);
        ɵɵtextInterpolate(ɵɵpipeBind1(7, 4, "cancel"));
        ɵɵadvance(3);
        ɵɵtextInterpolate(ɵɵpipeBind1(10, 6, "add"));
    } }, directives: [MatDialogTitle, MatDialogContent, NgForOf, MatDialogActions, MatButton, NgStyle, DataGridComponent], pipes: [TranslatePipe], styles: [".dialogConent[_ngcontent-%COMP%]{height:100%;margin:inherit!important;max-height:60vh!important;overflow:auto;padding:inherit!important;width:100%}"] });
/*@__PURE__*/ (function () { ɵsetClassMetadata(DialogGridComponent, [{
        type: Component,
        args: [{
                selector: 'app-dialog-grid',
                templateUrl: './dialog-grid.component.html',
                styleUrls: ['./dialog-grid.component.css']
            }]
    }], function () { return [{ type: MatDialogRef }]; }, { joinTables: [{
            type: Output
        }] }); })();

function DialogFormComponent_ng_container_3_Template(rf, ctx) { if (rf & 1) {
    ɵɵelementContainer(0);
} }
class DialogFormComponent {
    constructor(dialogRef) {
        this.dialogRef = dialogRef;
    }
    ngOnInit() {
    }
    doAdd() {
        this.dialogRef.close({ event: 'Add' });
    }
    closeDialog() {
        this.dialogRef.close({ event: 'Cancel' });
    }
}
/** @nocollapse */ DialogFormComponent.ɵfac = function DialogFormComponent_Factory(t) { return new (t || DialogFormComponent)(ɵɵdirectiveInject(MatDialogRef)); };
/** @nocollapse */ DialogFormComponent.ɵcmp = ɵɵdefineComponent({ type: DialogFormComponent, selectors: [["app-dialog-form"]], decls: 11, vars: 8, consts: [["mat-dialog-title", ""], [1, "mat-typography"], [4, "ngTemplateOutlet"], ["align", "end"], ["mat-button", "", 3, "click"], ["mat-button", "", "cdkFocusInitial", "", 3, "click"]], template: function DialogFormComponent_Template(rf, ctx) { if (rf & 1) {
        ɵɵelementStart(0, "h5", 0);
        ɵɵtext(1);
        ɵɵelementEnd();
        ɵɵelementStart(2, "mat-dialog-content", 1);
        ɵɵtemplate(3, DialogFormComponent_ng_container_3_Template, 1, 0, "ng-container", 2);
        ɵɵelementEnd();
        ɵɵelementStart(4, "mat-dialog-actions", 3);
        ɵɵelementStart(5, "button", 4);
        ɵɵlistener("click", function DialogFormComponent_Template_button_click_5_listener() { return ctx.closeDialog(); });
        ɵɵtext(6);
        ɵɵpipe(7, "translate");
        ɵɵelementEnd();
        ɵɵelementStart(8, "button", 5);
        ɵɵlistener("click", function DialogFormComponent_Template_button_click_8_listener() { return ctx.doAdd(); });
        ɵɵtext(9);
        ɵɵpipe(10, "translate");
        ɵɵelementEnd();
        ɵɵelementEnd();
    } if (rf & 2) {
        ɵɵadvance(1);
        ɵɵtextInterpolate(ctx.title);
        ɵɵadvance(2);
        ɵɵproperty("ngTemplateOutlet", ctx.HTMLReceived);
        ɵɵadvance(3);
        ɵɵtextInterpolate(ɵɵpipeBind1(7, 4, "Cancel"));
        ɵɵadvance(3);
        ɵɵtextInterpolate(ɵɵpipeBind1(10, 6, "Accept"));
    } }, directives: [MatDialogTitle, MatDialogContent, NgTemplateOutlet, MatDialogActions, MatButton], pipes: [TranslatePipe], styles: [""] });
/*@__PURE__*/ (function () { ɵsetClassMetadata(DialogFormComponent, [{
        type: Component,
        args: [{
                selector: 'app-dialog-form',
                templateUrl: './dialog-form.component.html',
                styleUrls: ['./dialog-form.component.css']
            }]
    }], function () { return [{ type: MatDialogRef }]; }, null); })();

const _c0$2 = ["emptyItem"];
function DataTreeComponent_mat_tree_node_1_mat_icon_2_Template(rf, ctx) { if (rf & 1) {
    ɵɵelementStart(0, "mat-icon", 9);
    ɵɵtext(1, " folder ");
    ɵɵelementEnd();
} if (rf & 2) {
    const node_r3 = ɵɵnextContext().$implicit;
    ɵɵattribute("aria-label", node_r3.type + "icon");
} }
function DataTreeComponent_mat_tree_node_1_button_4_Template(rf, ctx) { if (rf & 1) {
    const _r10 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "button", 8);
    ɵɵlistener("click", function DataTreeComponent_mat_tree_node_1_button_4_Template_button_click_0_listener() { ɵɵrestoreView(_r10); const node_r3 = ɵɵnextContext().$implicit; const ctx_r8 = ɵɵnextContext(); return ctx_r8.onButtonClicked(node_r3.id, "newFolder"); });
    ɵɵelementStart(1, "mat-icon");
    ɵɵtext(2, "create_new_folder");
    ɵɵelementEnd();
    ɵɵelementEnd();
} }
function DataTreeComponent_mat_tree_node_1_button_5_Template(rf, ctx) { if (rf & 1) {
    const _r13 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "button", 8);
    ɵɵlistener("click", function DataTreeComponent_mat_tree_node_1_button_5_Template_button_click_0_listener() { ɵɵrestoreView(_r13); const node_r3 = ɵɵnextContext().$implicit; const ctx_r11 = ɵɵnextContext(); return ctx_r11.onButtonClicked(node_r3.id, "newNode"); });
    ɵɵelementStart(1, "mat-icon");
    ɵɵtext(2, "playlist_add");
    ɵɵelementEnd();
    ɵɵelementEnd();
} }
const _c1 = function (a0, a1, a2) { return { "drop-above": a0, "drop-below": a1, "drop-center": a2 }; };
function DataTreeComponent_mat_tree_node_1_Template(rf, ctx) { if (rf & 1) {
    const _r15 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "mat-tree-node", 4);
    ɵɵlistener("dragstart", function DataTreeComponent_mat_tree_node_1_Template_mat_tree_node_dragstart_0_listener($event) { ɵɵrestoreView(_r15); const node_r3 = ctx.$implicit; const ctx_r14 = ɵɵnextContext(); return ctx_r14.handleDragStart($event, node_r3); })("dragover", function DataTreeComponent_mat_tree_node_1_Template_mat_tree_node_dragover_0_listener($event) { ɵɵrestoreView(_r15); const node_r3 = ctx.$implicit; const ctx_r16 = ɵɵnextContext(); return ctx_r16.handleDragOver($event, node_r3); })("drop", function DataTreeComponent_mat_tree_node_1_Template_mat_tree_node_drop_0_listener($event) { ɵɵrestoreView(_r15); const node_r3 = ctx.$implicit; const ctx_r17 = ɵɵnextContext(); return ctx_r17.handleDrop($event, node_r3); })("dragend", function DataTreeComponent_mat_tree_node_1_Template_mat_tree_node_dragend_0_listener($event) { ɵɵrestoreView(_r15); const ctx_r18 = ɵɵnextContext(); return ctx_r18.handleDragEnd($event); });
    ɵɵelement(1, "button", 5);
    ɵɵtemplate(2, DataTreeComponent_mat_tree_node_1_mat_icon_2_Template, 2, 1, "mat-icon", 6);
    ɵɵtext(3);
    ɵɵtemplate(4, DataTreeComponent_mat_tree_node_1_button_4_Template, 3, 0, "button", 7);
    ɵɵtemplate(5, DataTreeComponent_mat_tree_node_1_button_5_Template, 3, 0, "button", 7);
    ɵɵelementStart(6, "button", 8);
    ɵɵlistener("click", function DataTreeComponent_mat_tree_node_1_Template_button_click_6_listener() { ɵɵrestoreView(_r15); const node_r3 = ctx.$implicit; const ctx_r19 = ɵɵnextContext(); return ctx_r19.onButtonClicked(node_r3.id, "delete"); });
    ɵɵelementStart(7, "mat-icon");
    ɵɵtext(8, "delete");
    ɵɵelementEnd();
    ɵɵelementEnd();
    ɵɵelementStart(9, "button", 8);
    ɵɵlistener("click", function DataTreeComponent_mat_tree_node_1_Template_button_click_9_listener() { ɵɵrestoreView(_r15); const node_r3 = ctx.$implicit; const ctx_r20 = ɵɵnextContext(); return ctx_r20.onButtonClicked(node_r3.id, "edit"); });
    ɵɵelementStart(10, "mat-icon");
    ɵɵtext(11, "edit");
    ɵɵelementEnd();
    ɵɵelementEnd();
    ɵɵelementEnd();
} if (rf & 2) {
    const node_r3 = ctx.$implicit;
    const ctx_r0 = ɵɵnextContext();
    ɵɵproperty("ngClass", ɵɵpureFunction3(5, _c1, ctx_r0.dragNodeExpandOverArea === "above" && ctx_r0.dragNodeExpandOverNode === node_r3, ctx_r0.dragNodeExpandOverArea === "below" && ctx_r0.dragNodeExpandOverNode === node_r3, ctx_r0.dragNodeExpandOverArea === "center" && ctx_r0.dragNodeExpandOverNode === node_r3));
    ɵɵadvance(2);
    ɵɵproperty("ngIf", node_r3.type === "folder");
    ɵɵadvance(1);
    ɵɵtextInterpolate1(" ", node_r3.name, " ");
    ɵɵadvance(1);
    ɵɵproperty("ngIf", node_r3.type === "folder");
    ɵɵadvance(1);
    ɵɵproperty("ngIf", node_r3.type === "folder");
} }
function DataTreeComponent_mat_tree_node_2_button_7_Template(rf, ctx) { if (rf & 1) {
    const _r26 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "button", 8);
    ɵɵlistener("click", function DataTreeComponent_mat_tree_node_2_button_7_Template_button_click_0_listener() { ɵɵrestoreView(_r26); const node_r21 = ɵɵnextContext().$implicit; const ctx_r24 = ɵɵnextContext(); return ctx_r24.onButtonClicked(node_r21.id, "newFolder"); });
    ɵɵelementStart(1, "mat-icon");
    ɵɵtext(2, "create_new_folder");
    ɵɵelementEnd();
    ɵɵelementEnd();
} }
function DataTreeComponent_mat_tree_node_2_button_8_Template(rf, ctx) { if (rf & 1) {
    const _r29 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "button", 8);
    ɵɵlistener("click", function DataTreeComponent_mat_tree_node_2_button_8_Template_button_click_0_listener() { ɵɵrestoreView(_r29); const node_r21 = ɵɵnextContext().$implicit; const ctx_r27 = ɵɵnextContext(); return ctx_r27.onButtonClicked(node_r21.id, "newNode"); });
    ɵɵelementStart(1, "mat-icon");
    ɵɵtext(2, "playlist_add");
    ɵɵelementEnd();
    ɵɵelementEnd();
} }
function DataTreeComponent_mat_tree_node_2_Template(rf, ctx) { if (rf & 1) {
    const _r31 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "mat-tree-node", 10);
    ɵɵlistener("dragstart", function DataTreeComponent_mat_tree_node_2_Template_mat_tree_node_dragstart_0_listener($event) { ɵɵrestoreView(_r31); const node_r21 = ctx.$implicit; const ctx_r30 = ɵɵnextContext(); return ctx_r30.handleDragStart($event, node_r21); })("dragover", function DataTreeComponent_mat_tree_node_2_Template_mat_tree_node_dragover_0_listener($event) { ɵɵrestoreView(_r31); const node_r21 = ctx.$implicit; const ctx_r32 = ɵɵnextContext(); return ctx_r32.handleDragOver($event, node_r21); })("drop", function DataTreeComponent_mat_tree_node_2_Template_mat_tree_node_drop_0_listener($event) { ɵɵrestoreView(_r31); const node_r21 = ctx.$implicit; const ctx_r33 = ɵɵnextContext(); return ctx_r33.handleDrop($event, node_r21); })("dragend", function DataTreeComponent_mat_tree_node_2_Template_mat_tree_node_dragend_0_listener($event) { ɵɵrestoreView(_r31); const ctx_r34 = ɵɵnextContext(); return ctx_r34.handleDragEnd($event); });
    ɵɵelementStart(1, "button", 11);
    ɵɵlistener("click", function DataTreeComponent_mat_tree_node_2_Template_button_click_1_listener() { ɵɵrestoreView(_r31); const node_r21 = ctx.$implicit; const ctx_r35 = ɵɵnextContext(); return ctx_r35.expansionModel.toggle(node_r21.id); });
    ɵɵelementStart(2, "mat-icon", 12);
    ɵɵtext(3);
    ɵɵelementEnd();
    ɵɵelementEnd();
    ɵɵelementStart(4, "mat-icon", 9);
    ɵɵtext(5, " folder ");
    ɵɵelementEnd();
    ɵɵtext(6);
    ɵɵtemplate(7, DataTreeComponent_mat_tree_node_2_button_7_Template, 3, 0, "button", 7);
    ɵɵtemplate(8, DataTreeComponent_mat_tree_node_2_button_8_Template, 3, 0, "button", 7);
    ɵɵelementStart(9, "button", 8);
    ɵɵlistener("click", function DataTreeComponent_mat_tree_node_2_Template_button_click_9_listener() { ɵɵrestoreView(_r31); const node_r21 = ctx.$implicit; const ctx_r36 = ɵɵnextContext(); return ctx_r36.onButtonClicked(node_r21.id, "delete"); });
    ɵɵelementStart(10, "mat-icon");
    ɵɵtext(11, "delete");
    ɵɵelementEnd();
    ɵɵelementEnd();
    ɵɵelementStart(12, "button", 8);
    ɵɵlistener("click", function DataTreeComponent_mat_tree_node_2_Template_button_click_12_listener() { ɵɵrestoreView(_r31); const node_r21 = ctx.$implicit; const ctx_r37 = ɵɵnextContext(); return ctx_r37.onButtonClicked(node_r21.id, "edit"); });
    ɵɵelementStart(13, "mat-icon");
    ɵɵtext(14, "edit");
    ɵɵelementEnd();
    ɵɵelementEnd();
    ɵɵelementEnd();
} if (rf & 2) {
    const node_r21 = ctx.$implicit;
    const ctx_r1 = ɵɵnextContext();
    ɵɵproperty("ngClass", ɵɵpureFunction3(7, _c1, ctx_r1.dragNodeExpandOverArea === "above" && ctx_r1.dragNodeExpandOverNode === node_r21, ctx_r1.dragNodeExpandOverArea === "below" && ctx_r1.dragNodeExpandOverNode === node_r21, ctx_r1.dragNodeExpandOverArea === "center" && ctx_r1.dragNodeExpandOverNode === node_r21));
    ɵɵadvance(1);
    ɵɵattribute("aria-label", "toggle " + node_r21.name);
    ɵɵadvance(2);
    ɵɵtextInterpolate1(" ", ctx_r1.treeControl.isExpanded(node_r21) ? "expand_more" : "chevron_right", " ");
    ɵɵadvance(1);
    ɵɵattribute("aria-label", node_r21.type + "icon");
    ɵɵadvance(2);
    ɵɵtextInterpolate1(" ", node_r21.name, " ");
    ɵɵadvance(1);
    ɵɵproperty("ngIf", node_r21.type === "folder");
    ɵɵadvance(1);
    ɵɵproperty("ngIf", node_r21.type === "folder");
} }
/**
 * File node data with nested structure.
 * Each node has a name, and a type or a list of children.
 */
class FileNode {
}
/** Flat node with expandable and level information */
class FileFlatNode {
    constructor(expandable, name, level, type, id) {
        this.expandable = expandable;
        this.name = name;
        this.level = level;
        this.type = type;
        this.id = id;
    }
}
/**
 * File database, it can build a tree structured Json object from string.
 * Each node in Json object represents a file or a directory. For a file, it has name and type.
 * For a directory, it has name and children (a list of files or directories).
 * The input will be a json object string, and the output is a list of `FileNode` with nested
 * structure.
 */
class FileDatabase {
    constructor() {
        this.dataChange = new BehaviorSubject([]);
    }
    get data() { return this.dataChange.value; }
    initialize(dataObj) {
        // Build the tree nodes from Json object. The result is a list of `FileNode` with nested
        //     file node as children.
        const data = this.buildFileTree(dataObj, 0);
        // Notify the change.
        this.dataChange.next(data);
    }
    /**
     * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
     * The return value is the list of `FileNode`.
     */
    buildFileTree(arrayTreeNodes, level, parentId = '0') {
        var map = {};
        arrayTreeNodes.forEach((treeNode) => {
            var obj = treeNode;
            obj.children = [];
            obj.type = (treeNode.isFolder) ? "folder" : "node";
            if (!map[obj.id]) {
                map[obj.id] = obj;
            }
            else {
                let previousChildren = map[obj.id].children;
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
    }
    deleteItem(node) {
        this.deleteNode(this.data.children, node);
        this.dataChange.next(this.data);
    }
    deleteNode(nodes, nodeToDelete) {
        const index = nodes.indexOf(nodeToDelete, 0);
        if (index > -1) {
            nodes.splice(index, 1);
        }
        else {
            nodes.forEach(node => {
                if (node.children && node.children.length > 0) {
                    this.deleteNode(node.children, nodeToDelete);
                }
            });
        }
    }
    copyPasteItem(from, to) {
        const newItem = this.insertItem(to, from);
        return newItem;
    }
    copyPasteItemAbove(from, to) {
        const newItem = this.insertItemAbove(to, from);
        return newItem;
    }
    copyPasteItemBelow(from, to) {
        const newItem = this.insertItemBelow(to, from);
        return newItem;
    }
    /** Add an item to to-do list */
    insertItem(parent, node) {
        if (!parent.children) {
            parent.children = [];
        }
        const newItem = {
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
    }
    insertItemAbove(node, nodeDrag) {
        const parentNode = this.getParentFromNodes(node);
        const newItem = {
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
    }
    insertItemBelow(node, nodeDrag) {
        const parentNode = this.getParentFromNodes(node);
        const newItem = {
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
    }
    getParentFromNodes(node) {
        for (let i = 0; i < this.data.children.length; ++i) {
            const currentRoot = this.data.children[i];
            const parent = this.getParent(currentRoot, node);
            if (parent != null) {
                return parent;
            }
        }
        return null;
    }
    getParent(currentRoot, node) {
        if (currentRoot.children && currentRoot.children.length > 0) {
            for (let i = 0; i < currentRoot.children.length; ++i) {
                const child = currentRoot.children[i];
                if (child === node) {
                    return currentRoot;
                }
                else if (child.children && child.children.length > 0) {
                    const parent = this.getParent(child, node);
                    if (parent != null) {
                        return parent;
                    }
                }
            }
        }
        return null;
    }
}
/** @nocollapse */ FileDatabase.ɵfac = function FileDatabase_Factory(t) { return new (t || FileDatabase)(); };
/** @nocollapse */ FileDatabase.ɵprov = ɵɵdefineInjectable({ token: FileDatabase, factory: FileDatabase.ɵfac });
/*@__PURE__*/ (function () { ɵsetClassMetadata(FileDatabase, [{
        type: Injectable
    }], function () { return []; }, null); })();
/**
 * @title Tree with flat nodes
 */
class DataTreeComponent {
    constructor(database) {
        this.database = database;
        // expansion model tracks expansion state
        this.expansionModel = new SelectionModel(true);
        this.dragging = false;
        this.expandDelay = 1000;
        this.validateDrop = false;
        this.dragNodeExpandOverWaitTimeMs = 1500;
        /** Map from flat node to nested node. This helps us finding the nested node to be modified */
        this.flatNodeMap = new Map();
        /** Map from nested node to flattened node. This helps us to keep the same object for selection */
        this.nestedNodeMap = new Map();
        this.transformer = (node, level) => {
            const existingNode = this.nestedNodeMap.get(node);
            const flatNode = existingNode && existingNode.name === node.name
                ? existingNode
                : new FileFlatNode((node.children && node.children.length > 0), node.name, level, node.type, node.id);
            this.flatNodeMap.set(flatNode, node);
            this.nestedNodeMap.set(node, flatNode);
            return flatNode;
        };
        this._getLevel = (node) => node.level;
        this._isExpandable = (node) => node.expandable;
        this._getChildren = (node) => of(node.children);
        this.hasChild = (_, _nodeData) => _nodeData.expandable;
        this.emitNode = new EventEmitter();
        this.createNode = new EventEmitter();
        this.createFolder = new EventEmitter();
        this.emitAllNodes = new EventEmitter();
        this.treeFlattener = new MatTreeFlattener(this.transformer, this._getLevel, this._isExpandable, this._getChildren);
        this.treeControl = new FlatTreeControl(this._getLevel, this._isExpandable);
        this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    }
    ngOnInit() {
        if (this.eventNodeUpdatedSubscription) {
            this.eventNodeUpdatedSubscription.subscribe((node) => {
                this.updateNode(node);
            });
        }
        if (this.eventCreateNodeSubscription) {
            this.eventCreateNodeSubscription.subscribe((node) => {
                if (node.isFolder)
                    this.createNewFolder(node);
                else
                    this.createNewNode(node);
            });
        }
        if (this.eventGetAllRowsSubscription) {
            this._eventGetAllRowsSubscription = this.eventGetAllRowsSubscription.subscribe(() => {
                this.emitAllRows();
            });
        }
        this.getAll()
            .subscribe((items) => {
            this.treeData = items;
            this.database.initialize(this.treeData);
            this.database.dataChange.subscribe(data => this.rebuildTreeForData([data]));
        });
    }
    /**
     * This constructs an array of nodes that matches the DOM
     */
    visibleNodes() {
        const result = [];
        function addExpandedChildren(node, expanded) {
            result.push(node);
            if (expanded.indexOf(node.id) != -1) {
                node.children.map((child) => addExpandedChildren(child, expanded));
            }
        }
        this.dataSource.data.forEach((node) => {
            addExpandedChildren(node, this.expansionModel.selected);
        });
        return result;
    }
    findNodeSiblings(arr, id) {
        let result, subResult;
        arr.forEach((item, i) => {
            if (item.id === id) {
                result = arr;
            }
            else if (item.children) {
                subResult = this.findNodeSiblings(item.children, id);
                if (subResult)
                    result = subResult;
            }
        });
        return result;
    }
    handleDragStart(event, node) {
        // Required by Firefox (https://stackoverflow.com/questions/19055264/why-doesnt-html5-drag-and-drop-work-in-firefox)
        event.dataTransfer.setData('foo', 'bar');
        event.dataTransfer.setDragImage(this.emptyItem.nativeElement, 0, 0);
        this.dragNode = node;
        this.treeControl.collapse(node);
    }
    handleDragOver(event, node) {
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
        const percentageX = event.offsetX / event.target.clientWidth;
        const percentageY = event.offsetY / event.target.clientHeight;
        if (percentageY < 0.25) {
            this.dragNodeExpandOverArea = 'above';
        }
        else if (percentageY > 0.75) {
            this.dragNodeExpandOverArea = 'below';
        }
        else {
            this.dragNodeExpandOverArea = 'center';
        }
    }
    handleDrop(event, node) {
        event.preventDefault();
        if (node !== this.dragNode) {
            let newItem;
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
    }
    handleDragEnd(event) {
        this.dragNode = null;
        this.dragNodeExpandOverNode = null;
        this.dragNodeExpandOverTime = 0;
    }
    /**
     * The following methods are for persisting the tree expand state
     * after being rebuilt
     */
    rebuildTreeForData(data) {
        this.dataSource.data = data;
        this.expansionModel.selected.forEach((id) => {
            const node = this.treeControl.dataNodes.find((n) => n.id === id);
            this.treeControl.expand(node);
        });
    }
    /**
     * Not used but you might need this to programmatically expand nodes
     * to reveal a particular node
     */
    expandNodesById(flatNodes, ids) {
        if (!flatNodes || flatNodes.length === 0)
            return;
        const idSet = new Set(ids);
        return flatNodes.forEach((node) => {
            if (idSet.has(node.id)) {
                this.treeControl.expand(node);
                let parent = this.getParentNode(node);
                while (parent) {
                    this.treeControl.expand(parent);
                    parent = this.getParentNode(parent);
                }
            }
        });
    }
    getParentNode(node) {
        const currentLevel = node.level;
        if (currentLevel < 1) {
            return null;
        }
        const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;
        for (let i = startIndex; i >= 0; i--) {
            const currentNode = this.treeControl.dataNodes[i];
            if (currentNode.level < currentLevel) {
                return currentNode;
            }
        }
        return null;
    }
    updateNode(nodeUpdated) {
        const dataToChange = JSON.parse(JSON.stringify(this.dataSource.data));
        const siblings = this.findNodeSiblings(dataToChange, nodeUpdated.id);
        let index = siblings.findIndex(node => node.id === nodeUpdated.id);
        siblings[index] = nodeUpdated;
        this.rebuildTreeForData(dataToChange);
    }
    createNewFolder(newFolder) {
        newFolder.type = "folder";
        const dataToChange = JSON.parse(JSON.stringify(this.dataSource.data));
        if (newFolder.parent === null) {
            dataToChange.push(newFolder);
        }
        else {
            const siblings = this.findNodeSiblings(dataToChange, newFolder.parent);
            let index = siblings.findIndex(node => node.id === newFolder.parent);
            siblings[index].children.push(newFolder);
        }
        this.rebuildTreeForData(dataToChange);
    }
    createNewNode(newNode) {
        newNode.type = "node";
        const dataToChange = JSON.parse(JSON.stringify(this.dataSource.data));
        const siblings = this.findNodeSiblings(dataToChange, newNode.parent);
        let index = siblings.findIndex(node => node.id === newNode.parent);
        siblings[index].children.push(newNode);
        this.rebuildTreeForData(dataToChange);
    }
    onButtonClicked(id, button) {
        const changedData = JSON.parse(JSON.stringify(this.dataSource.data));
        const siblings = this.findNodeSiblings(changedData, id);
        let nodeClicked = siblings.find(node => node.id === id);
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
            let children = this.getAllChildren(nodeClicked.children);
            children.forEach(children => {
                children.status = 'Deleted';
            });
            nodeClicked.children = children;
            nodeClicked.status = 'Deleted';
            this.rebuildTreeForData(changedData);
        }
    }
    emitAllRows() {
        const dataToEmit = JSON.parse(JSON.stringify(this.dataSource.data));
        let allRows = this.getAllChildren(dataToEmit);
        this.emitAllNodes.emit(allRows);
    }
    getAllChildren(arr) {
        let result = [];
        let subResult;
        arr.forEach((item, i) => {
            if (item.children.length > 0) {
                subResult = this.getAllChildren(item.children);
                if (subResult)
                    result.push(...subResult);
            }
            result.push(item);
        });
        return result;
    }
}
/** @nocollapse */ DataTreeComponent.ɵfac = function DataTreeComponent_Factory(t) { return new (t || DataTreeComponent)(ɵɵdirectiveInject(FileDatabase)); };
/** @nocollapse */ DataTreeComponent.ɵcmp = ɵɵdefineComponent({ type: DataTreeComponent, selectors: [["app-data-tree"]], viewQuery: function DataTreeComponent_Query(rf, ctx) { if (rf & 1) {
        ɵɵviewQuery(_c0$2, true);
    } if (rf & 2) {
        var _t;
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.emptyItem = _t.first);
    } }, inputs: { eventNodeUpdatedSubscription: "eventNodeUpdatedSubscription", eventCreateNodeSubscription: "eventCreateNodeSubscription", eventGetAllRowsSubscription: "eventGetAllRowsSubscription", getAll: "getAll" }, outputs: { createNode: "createNode", createFolder: "createFolder", emitNode: "emitNode", emitAllNodes: "emitAllNodes" }, features: [ɵɵProvidersFeature([FileDatabase])], decls: 5, vars: 3, consts: [[3, "dataSource", "treeControl"], ["matTreeNodeToggle", "", "matTreeNodePadding", "", "draggable", "true", 3, "ngClass", "dragstart", "dragover", "drop", "dragend", 4, "matTreeNodeDef"], ["matTreeNodePadding", "", "draggable", "true", 3, "ngClass", "dragstart", "dragover", "drop", "dragend", 4, "matTreeNodeDef", "matTreeNodeDefWhen"], ["emptyItem", ""], ["matTreeNodeToggle", "", "matTreeNodePadding", "", "draggable", "true", 3, "ngClass", "dragstart", "dragover", "drop", "dragend"], ["mat-icon-button", "", "disabled", ""], ["class", "type-icon", 4, "ngIf"], ["mat-icon-button", "", 3, "click", 4, "ngIf"], ["mat-icon-button", "", 3, "click"], [1, "type-icon"], ["matTreeNodePadding", "", "draggable", "true", 3, "ngClass", "dragstart", "dragover", "drop", "dragend"], ["mat-icon-button", "", "matTreeNodeToggle", "", 3, "click"], [1, "mat-icon-rtl-mirror"]], template: function DataTreeComponent_Template(rf, ctx) { if (rf & 1) {
        ɵɵelementStart(0, "mat-tree", 0);
        ɵɵtemplate(1, DataTreeComponent_mat_tree_node_1_Template, 12, 9, "mat-tree-node", 1);
        ɵɵtemplate(2, DataTreeComponent_mat_tree_node_2_Template, 15, 11, "mat-tree-node", 2);
        ɵɵelementEnd();
        ɵɵelement(3, "span", null, 3);
    } if (rf & 2) {
        ɵɵproperty("dataSource", ctx.dataSource)("treeControl", ctx.treeControl);
        ɵɵadvance(2);
        ɵɵproperty("matTreeNodeDefWhen", ctx.hasChild);
    } }, directives: [MatTree, MatTreeNodeDef, MatTreeNode, MatTreeNodeToggle, MatTreeNodePadding, NgClass, MatButton, NgIf, MatIcon], styles: [".mat-tree-node[_ngcontent-%COMP%]{-moz-user-select:none;-ms-user-select:none;-webkit-user-select:none;cursor:move;user-select:none}.mat-tree-node.cdk-drag-preview[_ngcontent-%COMP%]{box-shadow:0 7px 8px -4px rgba(0,0,0,.2),0 12px 17px 2px rgba(0,0,0,.14),0 5px 22px 4px rgba(0,0,0,.12)}.mat-tree-node.cdk-drag-placeholder[_ngcontent-%COMP%]{opacity:0}.cdk-drop-list-dragging[_ngcontent-%COMP%]   .mat-tree-node[_ngcontent-%COMP%]:not(.cdk-drag-placeholder){transition:transform .25s cubic-bezier(0,0,.2,1)}.cdk-drag-animating[_ngcontent-%COMP%]{transition:transform .2s cubic-bezier(0,0,.2,1)}.drop-above[_ngcontent-%COMP%]{border-top:10px solid #ddd;margin-top:-10px}.drop-below[_ngcontent-%COMP%]{border-bottom:10px solid #ddd;margin-bottom:-10px}.drop-center[_ngcontent-%COMP%]{background-color:#ddd}"] });
/*@__PURE__*/ (function () { ɵsetClassMetadata(DataTreeComponent, [{
        type: Component,
        args: [{
                selector: 'app-data-tree',
                templateUrl: 'data-tree.component.html',
                styleUrls: ['data-tree.component.scss'],
                providers: [FileDatabase]
            }]
    }], function () { return [{ type: FileDatabase }]; }, { createNode: [{
            type: Output
        }], createFolder: [{
            type: Output
        }], emitNode: [{
            type: Output
        }], emitAllNodes: [{
            type: Output
        }], eventNodeUpdatedSubscription: [{
            type: Input
        }], eventCreateNodeSubscription: [{
            type: Input
        }], eventGetAllRowsSubscription: [{
            type: Input
        }], getAll: [{
            type: Input
        }], emptyItem: [{
            type: ViewChild,
            args: ['emptyItem']
        }] }); })();

registerLocaleData(localeCa, 'ca');
registerLocaleData(localeEs, 'es');
/** Load translation assets */
function createTranslateLoader(http) {
    return new TranslateHttpLoader(http, '../assets/i18n/', '.json');
}
/** SITMUN plugin core module */
class SitmunFrontendGuiModule {
}
/** @nocollapse */ SitmunFrontendGuiModule.ɵmod = ɵɵdefineNgModule({ type: SitmunFrontendGuiModule });
/** @nocollapse */ SitmunFrontendGuiModule.ɵinj = ɵɵdefineInjector({ factory: function SitmunFrontendGuiModule_Factory(t) { return new (t || SitmunFrontendGuiModule)(); }, providers: [], imports: [[
            RouterModule,
            HttpClientModule,
            CommonModule,
            FormsModule,
            NoopAnimationsModule,
            AngularHalModule,
            ReactiveFormsModule,
            BrowserAnimationsModule,
            AgGridModule.withComponents([]),
            SitmunFrontendCoreModule,
            MaterialModule,
            TranslateModule.forRoot({
                loader: {
                    provide: TranslateLoader,
                    useFactory: (createTranslateLoader),
                    deps: [HttpClient]
                }
            })
        ], HttpClientModule,
        CommonModule,
        FormsModule,
        NoopAnimationsModule,
        AngularHalModule,
        TranslateModule,
        ReactiveFormsModule,
        SitmunFrontendCoreModule] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && ɵɵsetNgModuleScope(SitmunFrontendGuiModule, { declarations: [DataGridComponent,
        DataTreeComponent,
        BtnEditRenderedComponent,
        BtnCheckboxRenderedComponent,
        BtnCheckboxFilterComponent,
        DialogGridComponent,
        DialogFormComponent,
        DialogMessageComponent], imports: [RouterModule,
        HttpClientModule,
        CommonModule,
        FormsModule,
        NoopAnimationsModule,
        AngularHalModule,
        ReactiveFormsModule,
        BrowserAnimationsModule, AgGridModule, SitmunFrontendCoreModule,
        MaterialModule, TranslateModule], exports: [HttpClientModule,
        CommonModule,
        FormsModule,
        NoopAnimationsModule,
        AngularHalModule,
        TranslateModule,
        ReactiveFormsModule,
        DataGridComponent,
        DataTreeComponent,
        DialogGridComponent,
        DialogFormComponent,
        DialogMessageComponent,
        SitmunFrontendCoreModule] }); })();
/*@__PURE__*/ (function () { ɵsetClassMetadata(SitmunFrontendGuiModule, [{
        type: NgModule,
        args: [{
                imports: [
                    RouterModule,
                    HttpClientModule,
                    CommonModule,
                    FormsModule,
                    NoopAnimationsModule,
                    AngularHalModule,
                    ReactiveFormsModule,
                    BrowserAnimationsModule,
                    AgGridModule.withComponents([]),
                    SitmunFrontendCoreModule,
                    MaterialModule,
                    TranslateModule.forRoot({
                        loader: {
                            provide: TranslateLoader,
                            useFactory: (createTranslateLoader),
                            deps: [HttpClient]
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
                    HttpClientModule,
                    CommonModule,
                    FormsModule,
                    NoopAnimationsModule,
                    AngularHalModule,
                    TranslateModule,
                    ReactiveFormsModule,
                    DataGridComponent,
                    DataTreeComponent,
                    DialogGridComponent,
                    DialogFormComponent,
                    DialogMessageComponent,
                    SitmunFrontendCoreModule
                ]
            }]
    }], null, null); })();

/*
 * Public API Surface of sitmun-frontend-gui
 */

/**
 * Generated bundle index. Do not edit.
 */

export { BtnCheckboxFilterComponent, BtnCheckboxRenderedComponent, BtnEditRenderedComponent, DataGridComponent, DataTreeComponent, DialogFormComponent, DialogGridComponent, DialogMessageComponent, FileDatabase, FileFlatNode, FileNode, SitmunFrontendGuiModule, createTranslateLoader };
//# sourceMappingURL=sitmun-frontend-gui.js.map
