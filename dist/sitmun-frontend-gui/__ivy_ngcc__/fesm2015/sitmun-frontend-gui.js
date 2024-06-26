import { Component, ViewChild, ViewContainerRef, EventEmitter, ElementRef, Input, Output, NgModule, Injectable } from '@angular/core';
import { Subject, BehaviorSubject, of } from 'rxjs';
import { AllCommunityModules } from '@ag-grid-community/all-modules';
import { TranslateService, TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { MatDialogRef, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { registerLocaleData, CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { NoopAnimationsModule, BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { AngularHalModule, SitmunFrontendCoreModule } from '@sitmun/frontend-core';
import localeCa from '@angular/common/locales/ca';
import localeEs from '@angular/common/locales/es';
import { AgGridModule } from '@ag-grid-community/angular';
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
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
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
import { MatTreeModule, MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material/tree';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SelectionModel } from '@angular/cdk/collections';
import { DomSanitizer } from '@angular/platform-browser';
import * as d3 from 'd3';

import * as ɵngcc0 from '@angular/core';
import * as ɵngcc1 from '@angular/material/button';
import * as ɵngcc2 from '@angular/material/icon';
import * as ɵngcc3 from '@angular/material/checkbox';
import * as ɵngcc4 from '@angular/forms';
import * as ɵngcc5 from '@ngx-translate/core';
import * as ɵngcc6 from '@angular/material/dialog';
import * as ɵngcc7 from '@angular/common';
import * as ɵngcc8 from '@angular/material/menu';
import * as ɵngcc9 from '@ag-grid-community/angular';
import * as ɵngcc10 from '@angular/material/button-toggle';
import * as ɵngcc11 from '@angular/material/tree';
import * as ɵngcc12 from '@angular/platform-browser';
import * as ɵngcc13 from '@angular/material/form-field';
import * as ɵngcc14 from '@angular/material/input';

const _c0 = ["input"];
function DialogMessageComponent_button_6_Template(rf, ctx) { if (rf & 1) {
    const _r2 = ɵngcc0.ɵɵgetCurrentView();
    ɵngcc0.ɵɵelementStart(0, "button", 5);
    ɵngcc0.ɵɵlistener("click", function DialogMessageComponent_button_6_Template_button_click_0_listener() { ɵngcc0.ɵɵrestoreView(_r2); const ctx_r1 = ɵngcc0.ɵɵnextContext(); return ctx_r1.closeDialog(); });
    ɵngcc0.ɵɵtext(1);
    ɵngcc0.ɵɵpipe(2, "translate");
    ɵngcc0.ɵɵelementEnd();
} if (rf & 2) {
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵtextInterpolate(ɵngcc0.ɵɵpipeBind1(2, 1, "cancel"));
} }
function DataGridComponent_span_1_Template(rf, ctx) { if (rf & 1) {
    ɵngcc0.ɵɵelement(0, "span", 18);
} if (rf & 2) {
    const ctx_r0 = ɵngcc0.ɵɵnextContext();
    ɵngcc0.ɵɵproperty("translate", ctx_r0.title);
} }
function DataGridComponent_button_2_Template(rf, ctx) { if (rf & 1) {
    const _r19 = ɵngcc0.ɵɵgetCurrentView();
    ɵngcc0.ɵɵelementStart(0, "button", 19);
    ɵngcc0.ɵɵlistener("click", function DataGridComponent_button_2_Template_button_click_0_listener() { ɵngcc0.ɵɵrestoreView(_r19); const ctx_r18 = ɵngcc0.ɵɵnextContext(); return ctx_r18.deleteChanges(); });
    ɵngcc0.ɵɵpipe(1, "translate");
    ɵngcc0.ɵɵelementStart(2, "mat-icon", 20);
    ɵngcc0.ɵɵtext(3, " close ");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = ɵngcc0.ɵɵnextContext();
    ɵngcc0.ɵɵpropertyInterpolate("title", ɵngcc0.ɵɵpipeBind1(1, 2, "cancel"));
    ɵngcc0.ɵɵproperty("disabled", ctx_r1.changeCounter <= 0 && (!ctx_r1.someStatusHasChangedToDelete || ctx_r1.discardNonReverseStatus));
} }
function DataGridComponent_button_3_Template(rf, ctx) { if (rf & 1) {
    const _r21 = ɵngcc0.ɵɵgetCurrentView();
    ɵngcc0.ɵɵelementStart(0, "button", 21);
    ɵngcc0.ɵɵlistener("click", function DataGridComponent_button_3_Template_button_click_0_listener() { ɵngcc0.ɵɵrestoreView(_r21); const ctx_r20 = ɵngcc0.ɵɵnextContext(); return ctx_r20.undo(); });
    ɵngcc0.ɵɵpipe(1, "translate");
    ɵngcc0.ɵɵelementStart(2, "mat-icon", 20);
    ɵngcc0.ɵɵtext(3, " undo ");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = ɵngcc0.ɵɵnextContext();
    ɵngcc0.ɵɵpropertyInterpolate("title", ɵngcc0.ɵɵpipeBind1(1, 2, "undo"));
    ɵngcc0.ɵɵproperty("disabled", ctx_r2.changeCounter <= 0);
} }
function DataGridComponent_button_4_Template(rf, ctx) { if (rf & 1) {
    const _r23 = ɵngcc0.ɵɵgetCurrentView();
    ɵngcc0.ɵɵelementStart(0, "button", 22);
    ɵngcc0.ɵɵlistener("click", function DataGridComponent_button_4_Template_button_click_0_listener() { ɵngcc0.ɵɵrestoreView(_r23); const ctx_r22 = ɵngcc0.ɵɵnextContext(); return ctx_r22.redo(); });
    ɵngcc0.ɵɵpipe(1, "translate");
    ɵngcc0.ɵɵelementStart(2, "mat-icon", 20);
    ɵngcc0.ɵɵtext(3, " redo ");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r3 = ɵngcc0.ɵɵnextContext();
    ɵngcc0.ɵɵpropertyInterpolate("title", ɵngcc0.ɵɵpipeBind1(1, 2, "redo"));
    ɵngcc0.ɵɵproperty("disabled", ctx_r3.redoCounter <= 0);
} }
function DataGridComponent_button_5_Template(rf, ctx) { if (rf & 1) {
    const _r25 = ɵngcc0.ɵɵgetCurrentView();
    ɵngcc0.ɵɵelementStart(0, "button", 23);
    ɵngcc0.ɵɵlistener("click", function DataGridComponent_button_5_Template_button_click_0_listener() { ɵngcc0.ɵɵrestoreView(_r25); const ctx_r24 = ɵngcc0.ɵɵnextContext(); return ctx_r24.applyChanges(); });
    ɵngcc0.ɵɵpipe(1, "translate");
    ɵngcc0.ɵɵelementStart(2, "mat-icon", 20);
    ɵngcc0.ɵɵtext(3, " check ");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r4 = ɵngcc0.ɵɵnextContext();
    ɵngcc0.ɵɵpropertyInterpolate("title", ɵngcc0.ɵɵpipeBind1(1, 2, "accept"));
    ɵngcc0.ɵɵproperty("disabled", ctx_r4.changeCounter <= 0);
} }
function DataGridComponent_label_7_Template(rf, ctx) { if (rf & 1) {
    ɵngcc0.ɵɵelement(0, "label", 18);
} if (rf & 2) {
    ɵngcc0.ɵɵproperty("translate", "search");
} }
function DataGridComponent_input_8_Template(rf, ctx) { if (rf & 1) {
    const _r27 = ɵngcc0.ɵɵgetCurrentView();
    ɵngcc0.ɵɵelementStart(0, "input", 24);
    ɵngcc0.ɵɵlistener("keyup", function DataGridComponent_input_8_Template_input_keyup_0_listener() { ɵngcc0.ɵɵrestoreView(_r27); const ctx_r26 = ɵngcc0.ɵɵnextContext(); return ctx_r26.quickSearch(); })("ngModelChange", function DataGridComponent_input_8_Template_input_ngModelChange_0_listener($event) { ɵngcc0.ɵɵrestoreView(_r27); const ctx_r28 = ɵngcc0.ɵɵnextContext(); return ctx_r28.searchValue = $event; });
    ɵngcc0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r6 = ɵngcc0.ɵɵnextContext();
    ɵngcc0.ɵɵproperty("ngModel", ctx_r6.searchValue);
} }
function DataGridComponent_label_9_Template(rf, ctx) { if (rf & 1) {
    ɵngcc0.ɵɵelement(0, "label", 18);
} if (rf & 2) {
    ɵngcc0.ɵɵproperty("translate", "rowsToShow");
} }
function DataGridComponent_mat_button_toggle_group_10_Template(rf, ctx) { if (rf & 1) {
    const _r30 = ɵngcc0.ɵɵgetCurrentView();
    ɵngcc0.ɵɵelementStart(0, "mat-button-toggle-group", 25);
    ɵngcc0.ɵɵelementStart(1, "mat-button-toggle", 26);
    ɵngcc0.ɵɵlistener("change", function DataGridComponent_mat_button_toggle_group_10_Template_mat_button_toggle_change_1_listener($event) { ɵngcc0.ɵɵrestoreView(_r30); const ctx_r29 = ɵngcc0.ɵɵnextContext(); return ctx_r29.changeHeight($event.value); });
    ɵngcc0.ɵɵtext(2, "5");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(3, "mat-button-toggle", 27);
    ɵngcc0.ɵɵlistener("change", function DataGridComponent_mat_button_toggle_group_10_Template_mat_button_toggle_change_3_listener($event) { ɵngcc0.ɵɵrestoreView(_r30); const ctx_r31 = ɵngcc0.ɵɵnextContext(); return ctx_r31.changeHeight($event.value); });
    ɵngcc0.ɵɵtext(4, "20");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(5, "mat-button-toggle", 28);
    ɵngcc0.ɵɵlistener("change", function DataGridComponent_mat_button_toggle_group_10_Template_mat_button_toggle_change_5_listener($event) { ɵngcc0.ɵɵrestoreView(_r30); const ctx_r32 = ɵngcc0.ɵɵnextContext(); return ctx_r32.changeHeight($event.value); });
    ɵngcc0.ɵɵtext(6, "50");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementEnd();
} }
function DataGridComponent_button_11_Template(rf, ctx) { if (rf & 1) {
    const _r34 = ɵngcc0.ɵɵgetCurrentView();
    ɵngcc0.ɵɵelementStart(0, "button", 29);
    ɵngcc0.ɵɵlistener("click", function DataGridComponent_button_11_Template_button_click_0_listener() { ɵngcc0.ɵɵrestoreView(_r34); const ctx_r33 = ɵngcc0.ɵɵnextContext(); return ctx_r33.removeData(); });
    ɵngcc0.ɵɵelementStart(1, "mat-icon", 20);
    ɵngcc0.ɵɵtext(2, " delete ");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelement(3, "span", 18);
    ɵngcc0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r9 = ɵngcc0.ɵɵnextContext();
    ɵngcc0.ɵɵproperty("disabled", !ctx_r9.areRowsSelected());
    ɵngcc0.ɵɵadvance(3);
    ɵngcc0.ɵɵproperty("translate", "remove");
} }
function DataGridComponent_button_12_Template(rf, ctx) { if (rf & 1) {
    ɵngcc0.ɵɵelementStart(0, "button", 30);
    ɵngcc0.ɵɵelement(1, "span", 18);
    ɵngcc0.ɵɵelementStart(2, "mat-icon", 20);
    ɵngcc0.ɵɵtext(3, " keyboard_arrow_down ");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementEnd();
} if (rf & 2) {
    ɵngcc0.ɵɵnextContext();
    const _r11 = ɵngcc0.ɵɵreference(14);
    ɵngcc0.ɵɵproperty("matMenuTriggerFor", _r11);
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵproperty("translate", "actions");
} }
function DataGridComponent_button_15_Template(rf, ctx) { if (rf & 1) {
    const _r36 = ɵngcc0.ɵɵgetCurrentView();
    ɵngcc0.ɵɵelementStart(0, "button", 31);
    ɵngcc0.ɵɵlistener("click", function DataGridComponent_button_15_Template_button_click_0_listener() { ɵngcc0.ɵɵrestoreView(_r36); const ctx_r35 = ɵngcc0.ɵɵnextContext(); return ctx_r35.exportData(); });
    ɵngcc0.ɵɵtext(1);
    ɵngcc0.ɵɵpipe(2, "translate");
    ɵngcc0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r12 = ɵngcc0.ɵɵnextContext();
    ɵngcc0.ɵɵproperty("disabled", !ctx_r12.areRowsSelected());
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵtextInterpolate1(" ", ɵngcc0.ɵɵpipeBind1(2, 2, "export"), " ");
} }
function DataGridComponent_button_16_Template(rf, ctx) { if (rf & 1) {
    const _r38 = ɵngcc0.ɵɵgetCurrentView();
    ɵngcc0.ɵɵelementStart(0, "button", 31);
    ɵngcc0.ɵɵlistener("click", function DataGridComponent_button_16_Template_button_click_0_listener() { ɵngcc0.ɵɵrestoreView(_r38); const ctx_r37 = ɵngcc0.ɵɵnextContext(); return ctx_r37.onDuplicateButtonClicked(); });
    ɵngcc0.ɵɵtext(1);
    ɵngcc0.ɵɵpipe(2, "translate");
    ɵngcc0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r13 = ɵngcc0.ɵɵnextContext();
    ɵngcc0.ɵɵproperty("disabled", !ctx_r13.areRowsSelected());
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵtextInterpolate1(" ", ɵngcc0.ɵɵpipeBind1(2, 2, "duplicate"), "");
} }
function DataGridComponent_button_17_Template(rf, ctx) { if (rf & 1) {
    ɵngcc0.ɵɵelementStart(0, "button", 32);
    ɵngcc0.ɵɵtext(1);
    ɵngcc0.ɵɵpipe(2, "translate");
    ɵngcc0.ɵɵelementEnd();
} if (rf & 2) {
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵtextInterpolate1(" ", ɵngcc0.ɵɵpipeBind1(2, 1, "search/replace"), "");
} }
function DataGridComponent_button_18_Template(rf, ctx) { if (rf & 1) {
    const _r40 = ɵngcc0.ɵɵgetCurrentView();
    ɵngcc0.ɵɵelementStart(0, "button", 33);
    ɵngcc0.ɵɵlistener("click", function DataGridComponent_button_18_Template_button_click_0_listener() { ɵngcc0.ɵɵrestoreView(_r40); const ctx_r39 = ɵngcc0.ɵɵnextContext(); return ctx_r39.newData(); });
    ɵngcc0.ɵɵelementStart(1, "mat-icon", 20);
    ɵngcc0.ɵɵtext(2, " add_circle_outline ");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelement(3, "span", 18);
    ɵngcc0.ɵɵelementEnd();
} if (rf & 2) {
    ɵngcc0.ɵɵadvance(3);
    ɵngcc0.ɵɵproperty("translate", "new");
} }
function DataGridComponent_button_19_Template(rf, ctx) { if (rf & 1) {
    const _r42 = ɵngcc0.ɵɵgetCurrentView();
    ɵngcc0.ɵɵelementStart(0, "button", 33);
    ɵngcc0.ɵɵlistener("click", function DataGridComponent_button_19_Template_button_click_0_listener() { ɵngcc0.ɵɵrestoreView(_r42); const ctx_r41 = ɵngcc0.ɵɵnextContext(); return ctx_r41.onAddButtonClicked(); });
    ɵngcc0.ɵɵelementStart(1, "mat-icon", 20);
    ɵngcc0.ɵɵtext(2, " add_circle_outline ");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelement(3, "span", 18);
    ɵngcc0.ɵɵelementEnd();
} if (rf & 2) {
    ɵngcc0.ɵɵadvance(3);
    ɵngcc0.ɵɵproperty("translate", "add");
} }
function DataGridComponent_button_20_Template(rf, ctx) { if (rf & 1) {
    const _r44 = ɵngcc0.ɵɵgetCurrentView();
    ɵngcc0.ɵɵelementStart(0, "button", 33);
    ɵngcc0.ɵɵlistener("click", function DataGridComponent_button_20_Template_button_click_0_listener() { ɵngcc0.ɵɵrestoreView(_r44); const ctx_r43 = ɵngcc0.ɵɵnextContext(); return ctx_r43.modifyStatusSelected(); });
    ɵngcc0.ɵɵelementStart(1, "mat-icon", 20);
    ɵngcc0.ɵɵtext(2, " add_circle_outline ");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelement(3, "span", 18);
    ɵngcc0.ɵɵelementEnd();
} if (rf & 2) {
    ɵngcc0.ɵɵadvance(3);
    ɵngcc0.ɵɵproperty("translate", "register");
} }
const _c1 = function (a0) { return { "margin-top": a0 }; };
function DialogGridComponent_div_3_Template(rf, ctx) { if (rf & 1) {
    const _r4 = ɵngcc0.ɵɵgetCurrentView();
    ɵngcc0.ɵɵelementStart(0, "div", 6);
    ɵngcc0.ɵɵelementStart(1, "app-data-grid", 7);
    ɵngcc0.ɵɵlistener("getSelectedRows", function DialogGridComponent_div_3_Template_app_data_grid_getSelectedRows_1_listener($event) { ɵngcc0.ɵɵrestoreView(_r4); const ctx_r3 = ɵngcc0.ɵɵnextContext(); return ctx_r3.joinRowsReceived($event); });
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementEnd();
} if (rf & 2) {
    const getAll_r1 = ctx.$implicit;
    const i_r2 = ctx.index;
    const ctx_r0 = ɵngcc0.ɵɵnextContext();
    ɵngcc0.ɵɵproperty("ngStyle", ɵngcc0.ɵɵpureFunction1(15, _c1, i_r2 > 0 ? "100px" : "0px"));
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵproperty("columnDefs", ctx_r0.columnDefsTable[i_r2])("themeGrid", ctx_r0.themeGrid)("changeHeightButton", ctx_r0.changeHeightButton)("defaultHeight", ctx_r0.heightByDefault)("getAll", getAll_r1)("globalSearch", true)("singleSelection", ctx_r0.singleSelectionTable[i_r2])("title", ctx_r0.titlesTable[i_r2])("defaultColumnSorting", ctx_r0.orderTable.length >= i_r2 ? ctx_r0.orderTable[i_r2] : null)("nonEditable", ctx_r0.nonEditable)("eventGetSelectedRowsSubscription", ctx_r0.getAllRows.asObservable())("addFieldRestriction", ctx_r0.addFieldRestriction.length >= i_r2 ? ctx_r0.addFieldRestriction[i_r2] : null)("currentData", ctx_r0.currentData.length >= i_r2 ? ctx_r0.currentData[i_r2] : null)("fieldRestrictionWithDifferentName", ctx_r0.fieldRestrictionWithDifferentName.length >= i_r2 ? ctx_r0.fieldRestrictionWithDifferentName[i_r2] : null);
} }
function DialogFormComponent_ng_container_3_Template(rf, ctx) { if (rf & 1) {
    ɵngcc0.ɵɵelementContainer(0);
} }
const _c2 = ["emptyItem"];
function DataTreeComponent_mat_tree_node_13_mat_icon_2_Template(rf, ctx) { if (rf & 1) {
    ɵngcc0.ɵɵelementStart(0, "mat-icon", 11);
    ɵngcc0.ɵɵtext(1, " folder ");
    ɵngcc0.ɵɵelementEnd();
} if (rf & 2) {
    const node_r3 = ɵngcc0.ɵɵnextContext().$implicit;
    ɵngcc0.ɵɵattribute("aria-label", node_r3.type + "icon");
} }
function DataTreeComponent_mat_tree_node_13_span_3_Template(rf, ctx) { if (rf & 1) {
    ɵngcc0.ɵɵelementStart(0, "span");
    ɵngcc0.ɵɵtext(1);
    ɵngcc0.ɵɵpipe(2, "translate");
    ɵngcc0.ɵɵelementEnd();
} if (rf & 2) {
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵtextInterpolate1("(", ɵngcc0.ɵɵpipeBind1(2, 1, "pendingDelete"), ")-");
} }
function DataTreeComponent_mat_tree_node_13_button_5_Template(rf, ctx) { if (rf & 1) {
    const _r13 = ɵngcc0.ɵɵgetCurrentView();
    ɵngcc0.ɵɵelementStart(0, "button", 12);
    ɵngcc0.ɵɵlistener("click", function DataTreeComponent_mat_tree_node_13_button_5_Template_button_click_0_listener() { ɵngcc0.ɵɵrestoreView(_r13); const node_r3 = ɵngcc0.ɵɵnextContext().$implicit; const ctx_r11 = ɵngcc0.ɵɵnextContext(); return ctx_r11.onButtonClicked(node_r3.id, "newFolder"); });
    ɵngcc0.ɵɵelementStart(1, "mat-icon");
    ɵngcc0.ɵɵtext(2, "create_new_folder");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementEnd();
} }
function DataTreeComponent_mat_tree_node_13_button_6_Template(rf, ctx) { if (rf & 1) {
    const _r16 = ɵngcc0.ɵɵgetCurrentView();
    ɵngcc0.ɵɵelementStart(0, "button", 12);
    ɵngcc0.ɵɵlistener("click", function DataTreeComponent_mat_tree_node_13_button_6_Template_button_click_0_listener() { ɵngcc0.ɵɵrestoreView(_r16); const node_r3 = ɵngcc0.ɵɵnextContext().$implicit; const ctx_r14 = ɵngcc0.ɵɵnextContext(); return ctx_r14.onButtonClicked(node_r3.id, "newNode"); });
    ɵngcc0.ɵɵelementStart(1, "mat-icon");
    ɵngcc0.ɵɵtext(2, "playlist_add");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementEnd();
} }
function DataTreeComponent_mat_tree_node_13_button_7_Template(rf, ctx) { if (rf & 1) {
    const _r19 = ɵngcc0.ɵɵgetCurrentView();
    ɵngcc0.ɵɵelementStart(0, "button", 12);
    ɵngcc0.ɵɵlistener("click", function DataTreeComponent_mat_tree_node_13_button_7_Template_button_click_0_listener() { ɵngcc0.ɵɵrestoreView(_r19); const node_r3 = ɵngcc0.ɵɵnextContext().$implicit; const ctx_r17 = ɵngcc0.ɵɵnextContext(); return ctx_r17.onButtonClicked(node_r3.id, "delete"); });
    ɵngcc0.ɵɵelementStart(1, "mat-icon");
    ɵngcc0.ɵɵtext(2, "delete");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementEnd();
} }
function DataTreeComponent_mat_tree_node_13_button_8_Template(rf, ctx) { if (rf & 1) {
    const _r22 = ɵngcc0.ɵɵgetCurrentView();
    ɵngcc0.ɵɵelementStart(0, "button", 12);
    ɵngcc0.ɵɵlistener("click", function DataTreeComponent_mat_tree_node_13_button_8_Template_button_click_0_listener() { ɵngcc0.ɵɵrestoreView(_r22); const node_r3 = ɵngcc0.ɵɵnextContext().$implicit; const ctx_r20 = ɵngcc0.ɵɵnextContext(); return ctx_r20.onButtonClicked(node_r3.id, "edit"); });
    ɵngcc0.ɵɵelementStart(1, "mat-icon");
    ɵngcc0.ɵɵtext(2, "edit");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementEnd();
} }
const _c3 = function (a0, a1, a2, a3) { return { "drop-above": a0, "drop-below": a1, "drop-center": a2, "deletedNode": a3 }; };
function DataTreeComponent_mat_tree_node_13_Template(rf, ctx) { if (rf & 1) {
    const _r24 = ɵngcc0.ɵɵgetCurrentView();
    ɵngcc0.ɵɵelementStart(0, "mat-tree-node", 6);
    ɵngcc0.ɵɵlistener("dragstart", function DataTreeComponent_mat_tree_node_13_Template_mat_tree_node_dragstart_0_listener($event) { ɵngcc0.ɵɵrestoreView(_r24); const node_r3 = ctx.$implicit; const ctx_r23 = ɵngcc0.ɵɵnextContext(); return ctx_r23.handleDragStart($event, node_r3); })("dragover", function DataTreeComponent_mat_tree_node_13_Template_mat_tree_node_dragover_0_listener($event) { ɵngcc0.ɵɵrestoreView(_r24); const node_r3 = ctx.$implicit; const ctx_r25 = ɵngcc0.ɵɵnextContext(); return ctx_r25.handleDragOver($event, node_r3); })("drop", function DataTreeComponent_mat_tree_node_13_Template_mat_tree_node_drop_0_listener($event) { ɵngcc0.ɵɵrestoreView(_r24); const node_r3 = ctx.$implicit; const ctx_r26 = ɵngcc0.ɵɵnextContext(); return ctx_r26.handleDrop($event, node_r3); })("dragend", function DataTreeComponent_mat_tree_node_13_Template_mat_tree_node_dragend_0_listener($event) { ɵngcc0.ɵɵrestoreView(_r24); const ctx_r27 = ɵngcc0.ɵɵnextContext(); return ctx_r27.handleDragEnd($event); });
    ɵngcc0.ɵɵelement(1, "button", 7);
    ɵngcc0.ɵɵtemplate(2, DataTreeComponent_mat_tree_node_13_mat_icon_2_Template, 2, 1, "mat-icon", 8);
    ɵngcc0.ɵɵtemplate(3, DataTreeComponent_mat_tree_node_13_span_3_Template, 3, 3, "span", 9);
    ɵngcc0.ɵɵtext(4);
    ɵngcc0.ɵɵtemplate(5, DataTreeComponent_mat_tree_node_13_button_5_Template, 3, 0, "button", 10);
    ɵngcc0.ɵɵtemplate(6, DataTreeComponent_mat_tree_node_13_button_6_Template, 3, 0, "button", 10);
    ɵngcc0.ɵɵtemplate(7, DataTreeComponent_mat_tree_node_13_button_7_Template, 3, 0, "button", 10);
    ɵngcc0.ɵɵtemplate(8, DataTreeComponent_mat_tree_node_13_button_8_Template, 3, 0, "button", 10);
    ɵngcc0.ɵɵelementEnd();
} if (rf & 2) {
    const node_r3 = ctx.$implicit;
    const ctx_r0 = ɵngcc0.ɵɵnextContext();
    ɵngcc0.ɵɵproperty("ngClass", ɵngcc0.ɵɵpureFunction4(8, _c3, ctx_r0.dragNodeExpandOverArea === "above" && ctx_r0.dragNodeExpandOverNode === node_r3, ctx_r0.dragNodeExpandOverArea === "below" && ctx_r0.dragNodeExpandOverNode === node_r3, ctx_r0.dragNodeExpandOverArea === "center" && ctx_r0.dragNodeExpandOverNode === node_r3, node_r3.status == "pendingDelete"));
    ɵngcc0.ɵɵadvance(2);
    ɵngcc0.ɵɵproperty("ngIf", node_r3.type === "folder" && node_r3.status != "pendingDelete");
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵproperty("ngIf", node_r3.status == "pendingDelete");
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵtextInterpolate1(" ", node_r3.name, " ");
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵproperty("ngIf", node_r3.type === "folder" && node_r3.status != "pendingDelete");
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵproperty("ngIf", node_r3.type === "folder" && node_r3.status != "pendingDelete");
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵproperty("ngIf", node_r3.id !== undefined && node_r3.status != "pendingDelete");
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵproperty("ngIf", node_r3.id !== undefined && node_r3.status != "pendingDelete");
} }
function DataTreeComponent_mat_tree_node_14_span_6_Template(rf, ctx) { if (rf & 1) {
    ɵngcc0.ɵɵelementStart(0, "span");
    ɵngcc0.ɵɵtext(1);
    ɵngcc0.ɵɵpipe(2, "translate");
    ɵngcc0.ɵɵelementEnd();
} if (rf & 2) {
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵtextInterpolate1("(", ɵngcc0.ɵɵpipeBind1(2, 1, "pendingDelete"), ")-");
} }
function DataTreeComponent_mat_tree_node_14_button_8_Template(rf, ctx) { if (rf & 1) {
    const _r36 = ɵngcc0.ɵɵgetCurrentView();
    ɵngcc0.ɵɵelementStart(0, "button", 12);
    ɵngcc0.ɵɵlistener("click", function DataTreeComponent_mat_tree_node_14_button_8_Template_button_click_0_listener() { ɵngcc0.ɵɵrestoreView(_r36); const node_r28 = ɵngcc0.ɵɵnextContext().$implicit; const ctx_r34 = ɵngcc0.ɵɵnextContext(); return ctx_r34.onButtonClicked(node_r28.id, "newFolder"); });
    ɵngcc0.ɵɵelementStart(1, "mat-icon");
    ɵngcc0.ɵɵtext(2, "create_new_folder");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementEnd();
} }
function DataTreeComponent_mat_tree_node_14_button_9_Template(rf, ctx) { if (rf & 1) {
    const _r39 = ɵngcc0.ɵɵgetCurrentView();
    ɵngcc0.ɵɵelementStart(0, "button", 12);
    ɵngcc0.ɵɵlistener("click", function DataTreeComponent_mat_tree_node_14_button_9_Template_button_click_0_listener() { ɵngcc0.ɵɵrestoreView(_r39); const node_r28 = ɵngcc0.ɵɵnextContext().$implicit; const ctx_r37 = ɵngcc0.ɵɵnextContext(); return ctx_r37.onButtonClicked(node_r28.id, "newNode"); });
    ɵngcc0.ɵɵelementStart(1, "mat-icon");
    ɵngcc0.ɵɵtext(2, "playlist_add");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementEnd();
} }
function DataTreeComponent_mat_tree_node_14_button_10_Template(rf, ctx) { if (rf & 1) {
    const _r42 = ɵngcc0.ɵɵgetCurrentView();
    ɵngcc0.ɵɵelementStart(0, "button", 12);
    ɵngcc0.ɵɵlistener("click", function DataTreeComponent_mat_tree_node_14_button_10_Template_button_click_0_listener() { ɵngcc0.ɵɵrestoreView(_r42); const node_r28 = ɵngcc0.ɵɵnextContext().$implicit; const ctx_r40 = ɵngcc0.ɵɵnextContext(); return ctx_r40.onButtonClicked(node_r28.id, "delete"); });
    ɵngcc0.ɵɵelementStart(1, "mat-icon");
    ɵngcc0.ɵɵtext(2, "delete");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementEnd();
} }
function DataTreeComponent_mat_tree_node_14_button_11_Template(rf, ctx) { if (rf & 1) {
    const _r45 = ɵngcc0.ɵɵgetCurrentView();
    ɵngcc0.ɵɵelementStart(0, "button", 12);
    ɵngcc0.ɵɵlistener("click", function DataTreeComponent_mat_tree_node_14_button_11_Template_button_click_0_listener() { ɵngcc0.ɵɵrestoreView(_r45); const node_r28 = ɵngcc0.ɵɵnextContext().$implicit; const ctx_r43 = ɵngcc0.ɵɵnextContext(); return ctx_r43.onButtonClicked(node_r28.id, "edit"); });
    ɵngcc0.ɵɵelementStart(1, "mat-icon");
    ɵngcc0.ɵɵtext(2, "edit");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementEnd();
} }
function DataTreeComponent_mat_tree_node_14_Template(rf, ctx) { if (rf & 1) {
    const _r47 = ɵngcc0.ɵɵgetCurrentView();
    ɵngcc0.ɵɵelementStart(0, "mat-tree-node", 13);
    ɵngcc0.ɵɵlistener("dragstart", function DataTreeComponent_mat_tree_node_14_Template_mat_tree_node_dragstart_0_listener($event) { ɵngcc0.ɵɵrestoreView(_r47); const node_r28 = ctx.$implicit; const ctx_r46 = ɵngcc0.ɵɵnextContext(); return ctx_r46.handleDragStart($event, node_r28); })("dragover", function DataTreeComponent_mat_tree_node_14_Template_mat_tree_node_dragover_0_listener($event) { ɵngcc0.ɵɵrestoreView(_r47); const node_r28 = ctx.$implicit; const ctx_r48 = ɵngcc0.ɵɵnextContext(); return ctx_r48.handleDragOver($event, node_r28); })("drop", function DataTreeComponent_mat_tree_node_14_Template_mat_tree_node_drop_0_listener($event) { ɵngcc0.ɵɵrestoreView(_r47); const node_r28 = ctx.$implicit; const ctx_r49 = ɵngcc0.ɵɵnextContext(); return ctx_r49.handleDrop($event, node_r28); })("dragend", function DataTreeComponent_mat_tree_node_14_Template_mat_tree_node_dragend_0_listener($event) { ɵngcc0.ɵɵrestoreView(_r47); const ctx_r50 = ɵngcc0.ɵɵnextContext(); return ctx_r50.handleDragEnd($event); });
    ɵngcc0.ɵɵelementStart(1, "button", 14);
    ɵngcc0.ɵɵlistener("click", function DataTreeComponent_mat_tree_node_14_Template_button_click_1_listener() { ɵngcc0.ɵɵrestoreView(_r47); const node_r28 = ctx.$implicit; const ctx_r51 = ɵngcc0.ɵɵnextContext(); return ctx_r51.expansionModel.toggle(node_r28.id); });
    ɵngcc0.ɵɵelementStart(2, "mat-icon", 15);
    ɵngcc0.ɵɵtext(3);
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(4, "mat-icon", 11);
    ɵngcc0.ɵɵtext(5, " folder ");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵtemplate(6, DataTreeComponent_mat_tree_node_14_span_6_Template, 3, 3, "span", 9);
    ɵngcc0.ɵɵtext(7);
    ɵngcc0.ɵɵtemplate(8, DataTreeComponent_mat_tree_node_14_button_8_Template, 3, 0, "button", 10);
    ɵngcc0.ɵɵtemplate(9, DataTreeComponent_mat_tree_node_14_button_9_Template, 3, 0, "button", 10);
    ɵngcc0.ɵɵtemplate(10, DataTreeComponent_mat_tree_node_14_button_10_Template, 3, 0, "button", 10);
    ɵngcc0.ɵɵtemplate(11, DataTreeComponent_mat_tree_node_14_button_11_Template, 3, 0, "button", 10);
    ɵngcc0.ɵɵelementEnd();
} if (rf & 2) {
    const node_r28 = ctx.$implicit;
    const ctx_r1 = ɵngcc0.ɵɵnextContext();
    ɵngcc0.ɵɵproperty("ngClass", ɵngcc0.ɵɵpureFunction4(10, _c3, ctx_r1.dragNodeExpandOverArea === "above" && ctx_r1.dragNodeExpandOverNode === node_r28, ctx_r1.dragNodeExpandOverArea === "below" && ctx_r1.dragNodeExpandOverNode === node_r28, ctx_r1.dragNodeExpandOverArea === "center" && ctx_r1.dragNodeExpandOverNode === node_r28, node_r28.status == "pendingDelete"));
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵattribute("aria-label", "toggle " + node_r28.name);
    ɵngcc0.ɵɵadvance(2);
    ɵngcc0.ɵɵtextInterpolate1(" ", ctx_r1.treeControl.isExpanded(node_r28) ? "expand_more" : "chevron_right", " ");
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵattribute("aria-label", node_r28.type + "icon");
    ɵngcc0.ɵɵadvance(2);
    ɵngcc0.ɵɵproperty("ngIf", node_r28.status == "pendingDelete");
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵtextInterpolate1(" ", node_r28.name, " ");
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵproperty("ngIf", node_r28.type === "folder" && node_r28.status != "pendingDelete");
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵproperty("ngIf", node_r28.type === "folder" && node_r28.status != "pendingDelete");
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵproperty("ngIf", node_r28.id !== undefined && node_r28.status != "pendingDelete");
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵproperty("ngIf", node_r28.id !== undefined && node_r28.status != "pendingDelete");
} }
function DialogTranslationComponent_div_2_Template(rf, ctx) { if (rf & 1) {
    ɵngcc0.ɵɵelementStart(0, "div", 3);
    ɵngcc0.ɵɵelementStart(1, "label", 11);
    ɵngcc0.ɵɵtext(2);
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(3, "mat-form-field", 5);
    ɵngcc0.ɵɵelement(4, "input", 12);
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelement(5, "mat-icon", 13);
    ɵngcc0.ɵɵelementEnd();
} if (rf & 2) {
    ɵngcc0.ɵɵadvance(2);
    ɵngcc0.ɵɵtextInterpolate1(" ", "Valor", " ");
} }
function DialogTranslationComponent_div_3_Template(rf, ctx) { if (rf & 1) {
    ɵngcc0.ɵɵelementStart(0, "div", 3);
    ɵngcc0.ɵɵelementStart(1, "label", 11);
    ɵngcc0.ɵɵtext(2);
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(3, "mat-form-field", 5);
    ɵngcc0.ɵɵelement(4, "input", 14);
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelement(5, "mat-icon", 15);
    ɵngcc0.ɵɵelementEnd();
} if (rf & 2) {
    ɵngcc0.ɵɵadvance(2);
    ɵngcc0.ɵɵtextInterpolate1(" ", "Valor", " ");
} }
function DialogTranslationComponent_div_4_Template(rf, ctx) { if (rf & 1) {
    ɵngcc0.ɵɵelementStart(0, "div", 3);
    ɵngcc0.ɵɵelementStart(1, "label", 11);
    ɵngcc0.ɵɵtext(2);
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(3, "mat-form-field", 5);
    ɵngcc0.ɵɵelement(4, "input", 16);
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelement(5, "mat-icon", 17);
    ɵngcc0.ɵɵelementEnd();
} if (rf & 2) {
    ɵngcc0.ɵɵadvance(2);
    ɵngcc0.ɵɵtextInterpolate1(" ", "Value", " ");
} }
function DialogTranslationComponent_div_5_Template(rf, ctx) { if (rf & 1) {
    ɵngcc0.ɵɵelementStart(0, "div", 3);
    ɵngcc0.ɵɵelementStart(1, "label", 11);
    ɵngcc0.ɵɵtext(2);
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(3, "mat-form-field", 5);
    ɵngcc0.ɵɵelement(4, "input", 18);
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelement(5, "mat-icon", 19);
    ɵngcc0.ɵɵelementEnd();
} if (rf & 2) {
    ɵngcc0.ɵɵadvance(2);
    ɵngcc0.ɵɵtextInterpolate1(" ", "Valor", " ");
} }
function DialogTranslationComponent_label_7_Template(rf, ctx) { if (rf & 1) {
    ɵngcc0.ɵɵelementStart(0, "label", 11);
    ɵngcc0.ɵɵtext(1);
    ɵngcc0.ɵɵelementEnd();
} if (rf & 2) {
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵtextInterpolate1(" ", "Valeur", " ");
} }
const _c4 = ["chart"];
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
BtnEditRenderedComponent.ɵfac = function BtnEditRenderedComponent_Factory(t) { return new (t || BtnEditRenderedComponent)(); };
BtnEditRenderedComponent.ɵcmp = ɵngcc0.ɵɵdefineComponent({ type: BtnEditRenderedComponent, selectors: [["app-btn-edit-rendered"]], decls: 3, vars: 0, consts: [["mat-mini-fab", "", "type", "button", 1, "buttonEdit", 3, "click"], ["fontSet", "material-icons-round", 1, "iconEdit"]], template: function BtnEditRenderedComponent_Template(rf, ctx) { if (rf & 1) {
        ɵngcc0.ɵɵelementStart(0, "button", 0);
        ɵngcc0.ɵɵlistener("click", function BtnEditRenderedComponent_Template_button_click_0_listener($event) { return ctx.btnClickedHandler($event); });
        ɵngcc0.ɵɵelementStart(1, "mat-icon", 1);
        ɵngcc0.ɵɵtext(2, " edit ");
        ɵngcc0.ɵɵelementEnd();
        ɵngcc0.ɵɵelementEnd();
    } }, directives: [ɵngcc1.MatButton, ɵngcc2.MatIcon], styles: [".buttonEdit[_ngcontent-%COMP%]{color:#000;background-color:#ddd;width:20px;margin-top:3px;height:20px;box-shadow:none}.iconEdit[_ngcontent-%COMP%]{font-size:13px;margin-top:-10px;margin-left:-2px}"] });
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(BtnEditRenderedComponent, [{
        type: Component,
        args: [{
                selector: 'app-btn-edit-rendered',
                template: "<button mat-mini-fab class=\"buttonEdit\"  type=\"button\"  (click)=\"btnClickedHandler($event)\" >\r\n  <mat-icon class=\"iconEdit\"   fontSet=\"material-icons-round\" > edit </mat-icon>\r\n</button> ",
                styles: [".buttonEdit{color:#000;background-color:#ddd;width:20px;margin-top:3px;height:20px;box-shadow:none}.iconEdit{font-size:13px;margin-top:-10px;margin-left:-2px}"]
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
        if (this.params.colDef.editable) {
            let checked = !event.target.firstElementChild.checked;
            let colId = this.params.column.colId;
            this.params.value = checked;
            this.params.api.undoRedoService.isFilling = true;
            this.params.node.setDataValue(colId, checked);
        }
        else {
            event.preventDefault();
        }
    }
    getParams() {
        return this.params;
    }
    ngOnDestroy() {
        // no need to remove the button click handler 
    }
}
BtnCheckboxRenderedComponent.ɵfac = function BtnCheckboxRenderedComponent_Factory(t) { return new (t || BtnCheckboxRenderedComponent)(); };
BtnCheckboxRenderedComponent.ɵcmp = ɵngcc0.ɵɵdefineComponent({ type: BtnCheckboxRenderedComponent, selectors: [["app-btn-checkbox-rendered"]], decls: 1, vars: 2, consts: [[3, "value", "checked", "click"]], template: function BtnCheckboxRenderedComponent_Template(rf, ctx) { if (rf & 1) {
        ɵngcc0.ɵɵelementStart(0, "mat-checkbox", 0);
        ɵngcc0.ɵɵlistener("click", function BtnCheckboxRenderedComponent_Template_mat_checkbox_click_0_listener($event) { return ctx.btnCheckedHandler($event); });
        ɵngcc0.ɵɵelementEnd();
    } if (rf & 2) {
        ɵngcc0.ɵɵproperty("value", ctx.params.value)("checked", ctx.params.value);
    } }, directives: [ɵngcc3.MatCheckbox], styles: [""] });
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(BtnCheckboxRenderedComponent, [{
        type: Component,
        args: [{
                selector: 'app-btn-checkbox-rendered',
                template: "<mat-checkbox (click)=\"btnCheckedHandler($event)\" [value]=\"params.value\" [checked]=\"params.value\"> </mat-checkbox>",
                styles: [""]
            }]
    }], null, null); })();

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
BtnCheckboxFilterComponent.ɵfac = function BtnCheckboxFilterComponent_Factory(t) { return new (t || BtnCheckboxFilterComponent)(); };
BtnCheckboxFilterComponent.ɵcmp = ɵngcc0.ɵɵdefineComponent({ type: BtnCheckboxFilterComponent, selectors: [["app-btn-checkbox-filter"]], viewQuery: function BtnCheckboxFilterComponent_Query(rf, ctx) { if (rf & 1) {
        ɵngcc0.ɵɵviewQuery(_c0, true, ViewContainerRef);
    } if (rf & 2) {
        var _t;
        ɵngcc0.ɵɵqueryRefresh(_t = ɵngcc0.ɵɵloadQuery()) && (ctx.input = _t.first);
    } }, hostAttrs: [1, "hostClass"], decls: 11, vars: 9, consts: [[3, "change"], ["filterSelect", ""], ["value", ""], ["value", "true"], ["value", "false"]], template: function BtnCheckboxFilterComponent_Template(rf, ctx) { if (rf & 1) {
        const _r1 = ɵngcc0.ɵɵgetCurrentView();
        ɵngcc0.ɵɵelementStart(0, "select", 0, 1);
        ɵngcc0.ɵɵlistener("change", function BtnCheckboxFilterComponent_Template_select_change_0_listener() { ɵngcc0.ɵɵrestoreView(_r1); const _r0 = ɵngcc0.ɵɵreference(1); return ctx.onChange(_r0.value); });
        ɵngcc0.ɵɵelementStart(2, "option", 2);
        ɵngcc0.ɵɵtext(3);
        ɵngcc0.ɵɵpipe(4, "translate");
        ɵngcc0.ɵɵelementEnd();
        ɵngcc0.ɵɵelementStart(5, "option", 3);
        ɵngcc0.ɵɵtext(6);
        ɵngcc0.ɵɵpipe(7, "translate");
        ɵngcc0.ɵɵelementEnd();
        ɵngcc0.ɵɵelementStart(8, "option", 4);
        ɵngcc0.ɵɵtext(9);
        ɵngcc0.ɵɵpipe(10, "translate");
        ɵngcc0.ɵɵelementEnd();
        ɵngcc0.ɵɵelementEnd();
    } if (rf & 2) {
        ɵngcc0.ɵɵadvance(3);
        ɵngcc0.ɵɵtextInterpolate(ɵngcc0.ɵɵpipeBind1(4, 3, "selectAll"));
        ɵngcc0.ɵɵadvance(3);
        ɵngcc0.ɵɵtextInterpolate(ɵngcc0.ɵɵpipeBind1(7, 5, "enabled"));
        ɵngcc0.ɵɵadvance(3);
        ɵngcc0.ɵɵtextInterpolate(ɵngcc0.ɵɵpipeBind1(10, 7, "disabled"));
    } }, directives: [ɵngcc4.NgSelectOption, ɵngcc4.ɵangular_packages_forms_forms_x], pipes: [ɵngcc5.TranslatePipe], styles: [".hostClass[_ngcontent-%COMP%]{width:100%}"] });
BtnCheckboxFilterComponent.propDecorators = {
    input: [{ type: ViewChild, args: ['input', { read: ViewContainerRef },] }]
};
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(BtnCheckboxFilterComponent, [{
        type: Component,
        args: [{
                selector: 'app-btn-checkbox-filter',
                template: "<select  #filterSelect  (change)='onChange(filterSelect.value)'>\r\n    <option value=\"\">{{\"selectAll\" | translate}}</option>\r\n    <option value=\"true\">{{\"enabled\" | translate}}</option>\r\n    <option value=\"false\">{{\"disabled\" | translate}}</option>\r\n  </select>",
                host: { 'class': 'hostClass' },
                styles: [".hostClass{width:100%}"]
            }]
    }], function () { return []; }, { input: [{
            type: ViewChild,
            args: ['input', { read: ViewContainerRef }]
        }] }); })();

class DialogMessageComponent {
    constructor(dialogRef) {
        this.dialogRef = dialogRef;
        this.hideCancelButton = false;
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
DialogMessageComponent.ɵfac = function DialogMessageComponent_Factory(t) { return new (t || DialogMessageComponent)(ɵngcc0.ɵɵdirectiveInject(ɵngcc6.MatDialogRef)); };
DialogMessageComponent.ɵcmp = ɵngcc0.ɵɵdefineComponent({ type: DialogMessageComponent, selectors: [["app-dialog-message"]], decls: 10, vars: 6, consts: [["mat-dialog-title", "", 1, "titleDialog"], [1, "mat-typography"], ["align", "end"], ["mat-flat-button", "", "class", "returnButton", 3, "click", 4, "ngIf"], ["mat-flat-button", "", "cdkFocusInitial", "", 1, "saveButton", 3, "click"], ["mat-flat-button", "", 1, "returnButton", 3, "click"]], template: function DialogMessageComponent_Template(rf, ctx) { if (rf & 1) {
        ɵngcc0.ɵɵelementStart(0, "h5", 0);
        ɵngcc0.ɵɵtext(1);
        ɵngcc0.ɵɵelementEnd();
        ɵngcc0.ɵɵelementStart(2, "mat-dialog-content", 1);
        ɵngcc0.ɵɵelementStart(3, "p");
        ɵngcc0.ɵɵtext(4);
        ɵngcc0.ɵɵelementEnd();
        ɵngcc0.ɵɵelementEnd();
        ɵngcc0.ɵɵelementStart(5, "mat-dialog-actions", 2);
        ɵngcc0.ɵɵtemplate(6, DialogMessageComponent_button_6_Template, 3, 3, "button", 3);
        ɵngcc0.ɵɵelementStart(7, "button", 4);
        ɵngcc0.ɵɵlistener("click", function DialogMessageComponent_Template_button_click_7_listener() { return ctx.doAccept(); });
        ɵngcc0.ɵɵtext(8);
        ɵngcc0.ɵɵpipe(9, "translate");
        ɵngcc0.ɵɵelementEnd();
        ɵngcc0.ɵɵelementEnd();
    } if (rf & 2) {
        ɵngcc0.ɵɵadvance(1);
        ɵngcc0.ɵɵtextInterpolate(ctx.title);
        ɵngcc0.ɵɵadvance(3);
        ɵngcc0.ɵɵtextInterpolate1(" ", ctx.message, " ");
        ɵngcc0.ɵɵadvance(2);
        ɵngcc0.ɵɵproperty("ngIf", !ctx.hideCancelButton);
        ɵngcc0.ɵɵadvance(2);
        ɵngcc0.ɵɵtextInterpolate(ɵngcc0.ɵɵpipeBind1(9, 4, "accept"));
    } }, directives: [ɵngcc6.MatDialogTitle, ɵngcc6.MatDialogContent, ɵngcc6.MatDialogActions, ɵngcc7.NgIf, ɵngcc1.MatButton], pipes: [ɵngcc5.TranslatePipe], styles: [".titleDialog[_ngcontent-%COMP%]{margin-top:inherit!important;margin-bottom:15px!important}"] });
/** @nocollapse */
DialogMessageComponent.ctorParameters = () => [
    { type: MatDialogRef }
];
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(DialogMessageComponent, [{
        type: Component,
        args: [{
                selector: 'app-dialog-message',
                template: "<h5 mat-dialog-title class=\"titleDialog\">{{title}}</h5>\r\n<mat-dialog-content class=\"mat-typography\">\r\n  <p>\r\n    {{message}}\r\n  </p>\r\n</mat-dialog-content>\r\n<mat-dialog-actions align=\"end\">\r\n  <button mat-flat-button class=\"returnButton\"  *ngIf=\"!hideCancelButton\" (click)=\"closeDialog()\">{{\"cancel\" | translate}}</button>\r\n  <button mat-flat-button class=\"saveButton\"  (click)=\"doAccept()\" cdkFocusInitial>{{\"accept\" | translate}}</button>\r\n</mat-dialog-actions>",
                styles: [".titleDialog{margin-top:inherit!important;margin-bottom:15px!important}"]
            }]
    }], function () { return [{ type: ɵngcc6.MatDialogRef }]; }, null); })();

class DataGridComponent {
    constructor(dialog, translate, elRef) {
        this.dialog = dialog;
        this.translate = translate;
        this.elRef = elRef;
        this.modules = AllCommunityModules;
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
        this.remove = new EventEmitter();
        this.new = new EventEmitter();
        this.add = new EventEmitter();
        this.discardChanges = new EventEmitter();
        this.sendChanges = new EventEmitter();
        this.getSelectedRows = new EventEmitter();
        this.duplicate = new EventEmitter();
        this.getAllRows = new EventEmitter();
        this.gridModified = new EventEmitter();
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
                cellStyle: (params) => {
                    if (params.value && params.colDef.editable) {
                        if (this.changesMap.has(params.node.id) && this.changesMap.get(params.node.id).has(params.colDef.field)) {
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
                this.someStatusHasChangedToDelete = false;
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
            this._eventGetAllRowsSubscription = this.eventGetAllRowsSubscription.subscribe((event) => {
                this.emitAllRows(event);
            });
        }
        if (this.eventSaveAgGridStateSubscription) {
            this._eventSaveAgGridStateSubscription = this.eventSaveAgGridStateSubscription.subscribe(() => {
                this.saveAgGridState();
            });
        }
        if (this.eventModifyStatusOfSelectedCells) {
            this._eventModifyStatusOfSelectedCells = this.eventModifyStatusOfSelectedCells.subscribe((status) => {
                this.modifyStatusSelected(status);
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
        for (const col of this.columnDefs) {
            if (!this.someColumnIsEditable && col.editable) {
                this.someColumnIsEditable = true;
            }
            if (col.field === 'status') {
                this.statusColumn = true;
            }
        }
        this.getElements();
        console.log(this.columnDefs);
        if (this.defaultColumnSorting) {
            if (!Array.isArray(this.defaultColumnSorting)) {
                const sortModel = [
                    { colId: this.defaultColumnSorting, sort: 'asc' }
                ];
                this.gridApi.setSortModel(sortModel);
            }
            else {
                let sortModel = [];
                this.defaultColumnSorting.forEach(element => {
                    sortModel.push({ colId: element, sort: 'asc' });
                });
                this.gridApi.setSortModel(sortModel);
            }
        }
        if (this.defaultHeight != null && this.defaultHeight != undefined) {
            this.changeHeight(this.defaultHeight);
        }
    }
    getDatePicker() {
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
    }
    areRowsSelected() {
        return (this.gridApi != null && this.gridApi.getSelectedNodes().length > 0) ? true : false;
        // if (this.gridApi != null && this.gridApi.getSelectedNodes().length > 0) {
        //   return true
        // } else {
        //   return false
        // }
    }
    emitSelectedRows() {
        const selectedNodes = this.gridApi.getSelectedNodes();
        const selectedData = selectedNodes.map(node => node.data);
        this.getSelectedRows.emit(selectedData);
    }
    emitAllRows(event) {
        // let rowData = [];
        // this.gridApi.forEachNode(node => rowData.push(node.data));
        this.getAllRows.emit({ data: this.getAllCurrentData(), event: event });
    }
    getAllCurrentData() {
        let rowData = [];
        this.gridApi.forEachNode(node => rowData.push(node.data));
        return rowData;
    }
    modifyStatusSelected(status) {
        let newStatus = status ? status : this.newStatusRegister;
        const selectedNodes = this.gridApi.getSelectedNodes();
        selectedNodes.map(node => {
            node.data.status = newStatus;
            node.selected = false;
        });
        this.gridApi.redrawRows();
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
            let status = this.allNewElements ? 'pendingCreation' : 'statusOK';
            let newItems = [];
            let condition = (this.addFieldRestriction) ? this.addFieldRestriction : 'id';
            items.forEach(element => {
                if (this.statusColumn) {
                    if (element.status != "notAvailable" && element.status != "pendingCreation" && element.status != "pendingRegistration" && element.status != "unregisteredLayer") {
                        element.status = status;
                    }
                    if (this.allNewElements) {
                        element.new = true;
                    }
                }
                if (this.currentData) {
                    if (this.checkElementAllowedToAdd(condition, element, this.currentData)) {
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
            this.rowData = this.currentData ? newItems : items;
            this.gridApi.setRowData(this.rowData);
            this.setSize();
            // this.gridApi.sizeColumnsToFit()
            console.log(this.rowData);
        });
    }
    setSize() {
        var allColumnIds = [];
        let columns = this.gridOptions.columnApi.getAllColumns();
        columns.forEach(function (column) {
            allColumnIds.push(column.colId);
        });
        this.gridOptions.columnApi.autoSizeColumns(allColumnIds);
        let grid = this.gridOptions.api;
        let availableWidth = grid.gridPanel.eBodyViewport.clientWidth;
        let usedWidth = grid.gridPanel.columnController.getWidthOfColsInList(columns);
        if (usedWidth < availableWidth) {
            grid.sizeColumnsToFit();
        }
    }
    addItems(newItems) {
        console.log(newItems);
        let itemsToAdd = [];
        let condition = (this.addFieldRestriction) ? this.addFieldRestriction : 'id';
        newItems.forEach(item => {
            if (this.checkElementAllowedToAdd(condition, item, this.rowData)) {
                if (this.statusColumn) {
                    item.status = 'pendingCreation';
                    item.newItem = true;
                }
                itemsToAdd.push(item);
                this.rowData.push(item);
            }
            else {
                console.log(`Item already exists`);
            }
        });
        this.gridApi.updateRowData({ add: itemsToAdd });
        console.log(this.columnDefs);
        // params.oldValue!=undefined
    }
    checkElementAllowedToAdd(condition, item, data) {
        let finalAddition = true;
        if (Array.isArray(condition)) {
            for (let element of data) {
                let canAdd = false;
                for (let currentCondition of condition) {
                    if (element[currentCondition] != item[currentCondition]) {
                        canAdd = true;
                        break;
                    }
                }
                if (!canAdd) {
                    finalAddition = false;
                    break;
                }
            }
            return finalAddition;
        }
        else {
            if (this.fieldRestrictionWithDifferentName) {
                return (item[condition] == undefined || (data.find(element => element[this.fieldRestrictionWithDifferentName] == item[condition])) == undefined);
            }
            return (item[condition] == undefined || (data.find(element => element[condition] == item[condition])) == undefined);
        }
    }
    changeHeight(value) {
        let pixels = "";
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
    }
    removeData() {
        this.gridApi.stopEditing(false);
        const selectedNodes = this.gridApi.getSelectedNodes();
        const selectedData = selectedNodes.map(node => node.data);
        this.remove.emit(selectedData);
        if (this.statusColumn) {
            const selectedRows = selectedNodes.map(node => node.id);
            if (selectedRows.length > 0) {
                this.someStatusHasChangedToDelete = true;
            }
            for (const id of selectedRows) {
                this.gridApi.getRowNode(id).data.status = 'pendingDelete';
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
        this.add.emit(this.getAllCurrentData());
    }
    onDuplicateButtonClicked() {
        this.gridApi.stopEditing(false);
        if (this.changeCounter > 0) {
            const dialogRef = this.dialog.open(DialogMessageComponent);
            dialogRef.componentInstance.title = this.translate.instant('caution');
            dialogRef.componentInstance.message = this.translate.instant('duplicateMessage');
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
            this.gridOptions.api.deselectAll();
        }
    }
    applyChanges() {
        const itemsChanged = [];
        this.gridApi.stopEditing(false);
        for (const key of this.changesMap.keys()) {
            itemsChanged.push(this.gridApi.getRowNode(key).data);
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
    }
    deleteChanges() {
        this.gridApi.stopEditing(false);
        let newElementsActived = this.allNewElements;
        while (this.changeCounter > 0) {
            this.undo();
        }
        this.changesMap.clear();
        //this.previousChangeCounter = 0;
        this.redoCounter = 0;
        if (this.statusColumn && !this.discardNonReverseStatus) {
            let rowsWithStatusModified = [];
            this.gridApi.forEachNode(function (node) {
                if (node.data.status === 'pendingModify' || node.data.status === 'pendingDelete') {
                    if (node.data.status === 'pendingDelete') {
                        rowsWithStatusModified.push(node.data);
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
            this.discardChanges.emit(rowsWithStatusModified);
            this.gridModified.emit(false);
        }
        this.gridApi.redrawRows();
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
        if (this.changeCounter == 0) {
            this.gridModified.emit(false);
        }
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
            if (this.changeCounter == 1) {
                this.gridModified.emit(true);
            }
            this.redoCounter = 0;
            this.onCellValueChanged(e);
            this.modificationChange = false;
        }
    }
    onCellValueChanged(params) {
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
        // this.changeCellStyleColumns(params, changesMap, '#E8F1DE');
        this.gridApi.redrawRows({ rowNodes: [row] });
        // this.changeCellStyleColumns(params, changesMap, '#FFFFFF');
        // We will define cellStyle white to future modifications (like filter)
    }
}
DataGridComponent.ɵfac = function DataGridComponent_Factory(t) { return new (t || DataGridComponent)(ɵngcc0.ɵɵdirectiveInject(ɵngcc6.MatDialog), ɵngcc0.ɵɵdirectiveInject(ɵngcc5.TranslateService), ɵngcc0.ɵɵdirectiveInject(ɵngcc0.ElementRef)); };
DataGridComponent.ɵcmp = ɵngcc0.ɵɵdefineComponent({ type: DataGridComponent, selectors: [["app-data-grid"]], inputs: { currentData: "currentData", frameworkComponents: "frameworkComponents", components: "components", eventRefreshSubscription: "eventRefreshSubscription", eventGetSelectedRowsSubscription: "eventGetSelectedRowsSubscription", eventGetAllRowsSubscription: "eventGetAllRowsSubscription", eventSaveAgGridStateSubscription: "eventSaveAgGridStateSubscription", eventModifyStatusOfSelectedCells: "eventModifyStatusOfSelectedCells", eventAddItemsSubscription: "eventAddItemsSubscription", columnDefs: "columnDefs", getAll: "getAll", discardChangesButton: "discardChangesButton", discardNonReverseStatus: "discardNonReverseStatus", id: "id", undoButton: "undoButton", defaultColumnSorting: "defaultColumnSorting", redoButton: "redoButton", applyChangesButton: "applyChangesButton", deleteButton: "deleteButton", newButton: "newButton", actionButton: "actionButton", addButton: "addButton", registerButton: "registerButton", newStatusRegister: "newStatusRegister", globalSearch: "globalSearch", changeHeightButton: "changeHeightButton", defaultHeight: "defaultHeight", themeGrid: "themeGrid", singleSelection: "singleSelection", nonEditable: "nonEditable", title: "title", hideExportButton: "hideExportButton", hideDuplicateButton: "hideDuplicateButton", hideSearchReplaceButton: "hideSearchReplaceButton", addFieldRestriction: "addFieldRestriction", allNewElements: "allNewElements", fieldRestrictionWithDifferentName: "fieldRestrictionWithDifferentName" }, outputs: { remove: "remove", new: "new", add: "add", discardChanges: "discardChanges", sendChanges: "sendChanges", getSelectedRows: "getSelectedRows", duplicate: "duplicate", getAllRows: "getAllRows", gridModified: "gridModified", getAgGridState: "getAgGridState" }, decls: 24, vars: 31, consts: [["id", "grup1", 1, "editDivBtns"], [3, "translate", 4, "ngIf"], ["type", "button", "mat-mini-fab", "", "class", "mini-fab mat-red", "id", "deleteChangesButton", "type", "button", 3, "title", "disabled", "click", 4, "ngIf"], ["type", "button", "mat-mini-fab", "", "class", "mini-fab mat-orange", "id", "undo", 3, "title", "disabled", "click", 4, "ngIf"], ["type", "button", "mat-mini-fab", "", "class", "mini-fab mat-orange", "id", "redo", 3, "title", "disabled", "click", 4, "ngIf"], ["type", "button", "mat-mini-fab", "", "class", "mini-fab mat-green", "id", "applyChangesButton", 3, "title", "disabled", "click", 4, "ngIf"], ["id", "grup2", 1, "actionsDivBtns"], ["type", "text", "class", "searchGenericInput", "placeholder", "", "ml-2", "", 3, "ngModel", "keyup", "ngModelChange", 4, "ngIf"], ["class", "toogleButton", "name", "fontStyle", "aria-label", "Font Style", "value", "5", 4, "ngIf"], ["type", "button", "mat-flat-button", "", "id", "deleteButton", "class", "deleteButton", 3, "disabled", "click", 4, "ngIf"], ["type", "button", "mat-flat-button", "", "id", "actionButton", "class", "actionButton", 3, "matMenuTriggerFor", 4, "ngIf"], ["menu", "matMenu"], ["type", "button", "mat-menu-item", "", 3, "disabled", "click", 4, "ngIf"], ["type", "button", "mat-menu-item", "", 4, "ngIf"], ["type", "button", "mat-flat-button", "", "class", "newButton", 3, "click", 4, "ngIf"], [1, "row", 2, "height", "100%"], ["id", "myGrid", 2, "width", "100%", "height", "100%"], ["rowSelection", "multiple", "multiSortKey", "key", 2, "width", "100%", "height", "100%", "min-height", "200px", 3, "floatingFilter", "rowData", "columnDefs", "gridOptions", "animateRows", "pagination", "modules", "undoRedoCellEditing", "undoRedoCellEditingLimit", "suppressRowClickSelection", "frameworkComponents", "components", "filterModified", "cellEditingStopped", "cellValueChanged", "gridReady", "firstDataRendered"], [3, "translate"], ["type", "button", "mat-mini-fab", "", "id", "deleteChangesButton", "type", "button", 1, "mini-fab", "mat-red", 3, "title", "disabled", "click"], ["fontSet", "material-icons-round"], ["type", "button", "mat-mini-fab", "", "id", "undo", 1, "mini-fab", "mat-orange", 3, "title", "disabled", "click"], ["type", "button", "mat-mini-fab", "", "id", "redo", 1, "mini-fab", "mat-orange", 3, "title", "disabled", "click"], ["type", "button", "mat-mini-fab", "", "id", "applyChangesButton", 1, "mini-fab", "mat-green", 3, "title", "disabled", "click"], ["type", "text", "placeholder", "", "ml-2", "", 1, "searchGenericInput", 3, "ngModel", "keyup", "ngModelChange"], ["name", "fontStyle", "aria-label", "Font Style", "value", "5", 1, "toogleButton"], ["value", "5", 3, "change"], ["value", "20", 3, "change"], ["value", "50", 3, "change"], ["type", "button", "mat-flat-button", "", "id", "deleteButton", 1, "deleteButton", 3, "disabled", "click"], ["type", "button", "mat-flat-button", "", "id", "actionButton", 1, "actionButton", 3, "matMenuTriggerFor"], ["type", "button", "mat-menu-item", "", 3, "disabled", "click"], ["type", "button", "mat-menu-item", ""], ["type", "button", "mat-flat-button", "", 1, "newButton", 3, "click"]], template: function DataGridComponent_Template(rf, ctx) { if (rf & 1) {
        ɵngcc0.ɵɵelementStart(0, "div", 0);
        ɵngcc0.ɵɵtemplate(1, DataGridComponent_span_1_Template, 1, 1, "span", 1);
        ɵngcc0.ɵɵtemplate(2, DataGridComponent_button_2_Template, 4, 4, "button", 2);
        ɵngcc0.ɵɵtemplate(3, DataGridComponent_button_3_Template, 4, 4, "button", 3);
        ɵngcc0.ɵɵtemplate(4, DataGridComponent_button_4_Template, 4, 4, "button", 4);
        ɵngcc0.ɵɵtemplate(5, DataGridComponent_button_5_Template, 4, 4, "button", 5);
        ɵngcc0.ɵɵelementEnd();
        ɵngcc0.ɵɵelementStart(6, "div", 6);
        ɵngcc0.ɵɵtemplate(7, DataGridComponent_label_7_Template, 1, 1, "label", 1);
        ɵngcc0.ɵɵtemplate(8, DataGridComponent_input_8_Template, 1, 1, "input", 7);
        ɵngcc0.ɵɵtemplate(9, DataGridComponent_label_9_Template, 1, 1, "label", 1);
        ɵngcc0.ɵɵtemplate(10, DataGridComponent_mat_button_toggle_group_10_Template, 7, 0, "mat-button-toggle-group", 8);
        ɵngcc0.ɵɵtemplate(11, DataGridComponent_button_11_Template, 4, 2, "button", 9);
        ɵngcc0.ɵɵtemplate(12, DataGridComponent_button_12_Template, 4, 2, "button", 10);
        ɵngcc0.ɵɵelementStart(13, "mat-menu", null, 11);
        ɵngcc0.ɵɵtemplate(15, DataGridComponent_button_15_Template, 3, 4, "button", 12);
        ɵngcc0.ɵɵtemplate(16, DataGridComponent_button_16_Template, 3, 4, "button", 12);
        ɵngcc0.ɵɵtemplate(17, DataGridComponent_button_17_Template, 3, 3, "button", 13);
        ɵngcc0.ɵɵelementEnd();
        ɵngcc0.ɵɵtemplate(18, DataGridComponent_button_18_Template, 4, 1, "button", 14);
        ɵngcc0.ɵɵtemplate(19, DataGridComponent_button_19_Template, 4, 1, "button", 14);
        ɵngcc0.ɵɵtemplate(20, DataGridComponent_button_20_Template, 4, 1, "button", 14);
        ɵngcc0.ɵɵelementEnd();
        ɵngcc0.ɵɵelementStart(21, "div", 15);
        ɵngcc0.ɵɵelementStart(22, "div", 16);
        ɵngcc0.ɵɵelementStart(23, "ag-grid-angular", 17);
        ɵngcc0.ɵɵlistener("filterModified", function DataGridComponent_Template_ag_grid_angular_filterModified_23_listener() { return ctx.onFilterModified(); })("cellEditingStopped", function DataGridComponent_Template_ag_grid_angular_cellEditingStopped_23_listener($event) { return ctx.onCellEditingStopped($event); })("cellValueChanged", function DataGridComponent_Template_ag_grid_angular_cellValueChanged_23_listener($event) { return ctx.onCellValueChanged($event); })("gridReady", function DataGridComponent_Template_ag_grid_angular_gridReady_23_listener($event) { return ctx.onGridReady($event); })("firstDataRendered", function DataGridComponent_Template_ag_grid_angular_firstDataRendered_23_listener() { return ctx.firstDataRendered(); });
        ɵngcc0.ɵɵelementEnd();
        ɵngcc0.ɵɵelementEnd();
        ɵngcc0.ɵɵelementEnd();
    } if (rf & 2) {
        ɵngcc0.ɵɵadvance(1);
        ɵngcc0.ɵɵproperty("ngIf", ctx.title);
        ɵngcc0.ɵɵadvance(1);
        ɵngcc0.ɵɵproperty("ngIf", ctx.discardChangesButton);
        ɵngcc0.ɵɵadvance(1);
        ɵngcc0.ɵɵproperty("ngIf", ctx.undoButton && ctx.someColumnIsEditable);
        ɵngcc0.ɵɵadvance(1);
        ɵngcc0.ɵɵproperty("ngIf", ctx.redoButton && ctx.someColumnIsEditable);
        ɵngcc0.ɵɵadvance(1);
        ɵngcc0.ɵɵproperty("ngIf", ctx.applyChangesButton);
        ɵngcc0.ɵɵadvance(2);
        ɵngcc0.ɵɵproperty("ngIf", ctx.globalSearch);
        ɵngcc0.ɵɵadvance(1);
        ɵngcc0.ɵɵproperty("ngIf", ctx.globalSearch);
        ɵngcc0.ɵɵadvance(1);
        ɵngcc0.ɵɵproperty("ngIf", ctx.changeHeightButton);
        ɵngcc0.ɵɵadvance(1);
        ɵngcc0.ɵɵproperty("ngIf", ctx.changeHeightButton);
        ɵngcc0.ɵɵadvance(1);
        ɵngcc0.ɵɵproperty("ngIf", ctx.deleteButton);
        ɵngcc0.ɵɵadvance(1);
        ɵngcc0.ɵɵproperty("ngIf", ctx.actionButton);
        ɵngcc0.ɵɵadvance(3);
        ɵngcc0.ɵɵproperty("ngIf", !ctx.hideExportButton);
        ɵngcc0.ɵɵadvance(1);
        ɵngcc0.ɵɵproperty("ngIf", !ctx.hideDuplicateButton);
        ɵngcc0.ɵɵadvance(1);
        ɵngcc0.ɵɵproperty("ngIf", !ctx.hideSearchReplaceButton && false);
        ɵngcc0.ɵɵadvance(1);
        ɵngcc0.ɵɵproperty("ngIf", ctx.newButton);
        ɵngcc0.ɵɵadvance(1);
        ɵngcc0.ɵɵproperty("ngIf", ctx.addButton);
        ɵngcc0.ɵɵadvance(1);
        ɵngcc0.ɵɵproperty("ngIf", ctx.registerButton);
        ɵngcc0.ɵɵadvance(3);
        ɵngcc0.ɵɵclassMap(ctx.themeGrid);
        ɵngcc0.ɵɵproperty("floatingFilter", true)("rowData", ctx.rowData)("columnDefs", ctx.columnDefs)("gridOptions", ctx.gridOptions)("animateRows", true)("pagination", false)("modules", ctx.modules)("undoRedoCellEditing", true)("undoRedoCellEditingLimit", 200)("suppressRowClickSelection", true)("frameworkComponents", ctx.frameworkComponents)("components", ctx.components);
    } }, directives: [ɵngcc7.NgIf, ɵngcc8._MatMenu, ɵngcc9.AgGridAngular, ɵngcc5.TranslateDirective, ɵngcc1.MatButton, ɵngcc2.MatIcon, ɵngcc4.DefaultValueAccessor, ɵngcc4.NgControlStatus, ɵngcc4.NgModel, ɵngcc10.MatButtonToggleGroup, ɵngcc10.MatButtonToggle, ɵngcc8.MatMenuTrigger, ɵngcc8.MatMenuItem], pipes: [ɵngcc5.TranslatePipe], styles: ["@charset \"UTF-8\";input[_ngcontent-%COMP%], label[_ngcontent-%COMP%]{display:inline-block;margin:5px 5px 5px 10px}.mat-flat-button.mat-orange[_ngcontent-%COMP%], .mat-icon.mat-orange[_ngcontent-%COMP%], .mat-mini-fab.mat-orange[_ngcontent-%COMP%], .mat-raised-button.mat-orange[_ngcontent-%COMP%]{background-color:#ff9300!important;color:#fff!important}.mat-flat-button.mat-orange[_ngcontent-%COMP%]:disabled, .mat-icon.mat-orange[_ngcontent-%COMP%]:disabled, .mat-mini-fab.mat-orange[_ngcontent-%COMP%]:disabled, .mat-raised-button.mat-orange[_ngcontent-%COMP%]:disabled{background:#ffc97f!important;color:#fff!important}.mat-flat-button.mat-green[_ngcontent-%COMP%], .mat-icon.mat-green[_ngcontent-%COMP%], .mat-mini-fab.mat-green[_ngcontent-%COMP%], .mat-raised-button.mat-green[_ngcontent-%COMP%]{background-color:#68a225!important;color:#fff!important}.mat-flat-button.mat-green[_ngcontent-%COMP%]:disabled, .mat-icon.mat-green[_ngcontent-%COMP%]:disabled, .mat-mini-fab.mat-green[_ngcontent-%COMP%]:disabled, .mat-raised-button.mat-green[_ngcontent-%COMP%]:disabled{background-color:#83976c!important;color:#fff!important}.mat-flat-button.mat-red[_ngcontent-%COMP%], .mat-icon.mat-red[_ngcontent-%COMP%], .mat-mini-fab.mat-red[_ngcontent-%COMP%], .mat-raised-button.mat-red[_ngcontent-%COMP%]{background-color:#bf0000!important;color:#fff!important}.mat-flat-button.mat-red[_ngcontent-%COMP%]:disabled, .mat-icon.mat-red[_ngcontent-%COMP%]:disabled, .mat-mini-fab.mat-red[_ngcontent-%COMP%]:disabled, .mat-raised-button.mat-red[_ngcontent-%COMP%]:disabled{background-color:#da8c8e!important;color:#fff!important}.validateButton[_ngcontent-%COMP%]{background-color:#ff9300;color:#fff;min-width:85px;margin-top:34px!important}.deleteButton[_ngcontent-%COMP%], .validateButton[_ngcontent-%COMP%]{height:40px;justify-self:right!important}.deleteButton[_ngcontent-%COMP%]{color:#bf0000;border:1px solid #bf0000!important;min-width:85px!important;float:inherit!important}.deleteButton[_ngcontent-%COMP%]:disabled{background-color:inherit!important;border:1px solid rgba(0,0,0,.26)!important;color:rgba(0,0,0,.26) solid 1px!important}.actionButton[_ngcontent-%COMP%], .returnButton[_ngcontent-%COMP%]{color:#ff9300;border:1px solid #ff9300!important}.actionButton[_ngcontent-%COMP%], .newButton[_ngcontent-%COMP%], .returnButton[_ngcontent-%COMP%], .saveButton[_ngcontent-%COMP%]{min-width:85px!important;height:40px;justify-self:right!important;float:inherit!important}.newButton[_ngcontent-%COMP%], .saveButton[_ngcontent-%COMP%]{background-color:#68a225;color:#fff}.editDivBtns[_ngcontent-%COMP%]{margin-left:10px;text-align:start;width:130px;height:30px!important;line-height:30px!important}.actionsDivBtns[_ngcontent-%COMP%]{text-align:end;width:calc(100% - 140px);height:50px}.actionsDivBtns[_ngcontent-%COMP%], .editDivBtns[_ngcontent-%COMP%]{display:inline-block!important}.actionsDivBtns[_ngcontent-%COMP%]   .searchGenericInput[_ngcontent-%COMP%]{height:41px!important;width:45%!important;display:inline-block!important;margin:0 5px 5px 10px!important}.ag-body-viewport.ag-layout-normal[_ngcontent-%COMP%]   [_ngcontent-%COMP%]::-webkit-scrollbar-thumb{background:#eee}\u200B[_ngcontent-%COMP%]   .ag-body-viewport.ag-layout-normal[_ngcontent-%COMP%]   [_ngcontent-%COMP%]::-webkit-scrollbar{width:2em;height:2em}.ag-body-viewport.ag-layout-normal[_ngcontent-%COMP%]   [_ngcontent-%COMP%]::-webkit-scrollbar-button{background:#ccc}.ag-body-viewport.ag-layout-normal[_ngcontent-%COMP%]::-webkit-scrollbar-track-piece{background:#888}.mini-fab[_ngcontent-%COMP%]{width:28px!important;height:28px!important;line-height:22px!important;margin-top:7px!important;margin-right:3px!important}.mini-fab[_ngcontent-%COMP%]   .mat-button-wrapper[_ngcontent-%COMP%]{padding:1px 0!important;line-height:22px!important;width:24px!important;height:24px!important}.mini-fab[_ngcontent-%COMP%]   .mat-button-wrapper[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%]{font-size:20px;padding-right:0;line-height:22px}.toogleButton[_ngcontent-%COMP%]{height:40px;margin-right:10px;vertical-align:bottom;align-items:center}"] });
/** @nocollapse */
DataGridComponent.ctorParameters = () => [
    { type: MatDialog },
    { type: TranslateService },
    { type: ElementRef }
];
DataGridComponent.propDecorators = {
    eventRefreshSubscription: [{ type: Input }],
    eventGetSelectedRowsSubscription: [{ type: Input }],
    eventGetAllRowsSubscription: [{ type: Input }],
    eventSaveAgGridStateSubscription: [{ type: Input }],
    eventModifyStatusOfSelectedCells: [{ type: Input }],
    eventAddItemsSubscription: [{ type: Input }],
    frameworkComponents: [{ type: Input }],
    components: [{ type: Input }],
    columnDefs: [{ type: Input }],
    getAll: [{ type: Input }],
    discardChangesButton: [{ type: Input }],
    discardNonReverseStatus: [{ type: Input }],
    id: [{ type: Input }],
    undoButton: [{ type: Input }],
    defaultColumnSorting: [{ type: Input }],
    redoButton: [{ type: Input }],
    applyChangesButton: [{ type: Input }],
    deleteButton: [{ type: Input }],
    newButton: [{ type: Input }],
    actionButton: [{ type: Input }],
    addButton: [{ type: Input }],
    registerButton: [{ type: Input }],
    newStatusRegister: [{ type: Input }],
    globalSearch: [{ type: Input }],
    changeHeightButton: [{ type: Input }],
    defaultHeight: [{ type: Input }],
    themeGrid: [{ type: Input }],
    singleSelection: [{ type: Input }],
    nonEditable: [{ type: Input }],
    title: [{ type: Input }],
    hideExportButton: [{ type: Input }],
    hideDuplicateButton: [{ type: Input }],
    hideSearchReplaceButton: [{ type: Input }],
    addFieldRestriction: [{ type: Input }],
    allNewElements: [{ type: Input }],
    currentData: [{ type: Input }],
    fieldRestrictionWithDifferentName: [{ type: Input }],
    remove: [{ type: Output }],
    new: [{ type: Output }],
    add: [{ type: Output }],
    discardChanges: [{ type: Output }],
    sendChanges: [{ type: Output }],
    duplicate: [{ type: Output }],
    getSelectedRows: [{ type: Output }],
    getAllRows: [{ type: Output }],
    getAgGridState: [{ type: Output }],
    gridModified: [{ type: Output }]
};
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(DataGridComponent, [{
        type: Component,
        args: [{
                selector: 'app-data-grid',
                template: "<div id=grup1 class=\"editDivBtns\">\r\n    <span *ngIf=\"title\" [translate]=\"title\"> </span>\r\n    <button type=\"button\" title=\"{{ 'cancel' | translate }}\" mat-mini-fab class=\"mini-fab mat-red\" *ngIf=\"discardChangesButton\"\r\n        id=\"deleteChangesButton\" type=\"button\" (click)=\"deleteChanges()\" [disabled]=\"changeCounter <= 0 && (!someStatusHasChangedToDelete || discardNonReverseStatus  )\">\r\n        <mat-icon fontSet=\"material-icons-round\"> close </mat-icon>\r\n    </button>\r\n    <button type=\"button\" title=\"{{ 'undo' | translate }}\" mat-mini-fab class=\"mini-fab mat-orange\" *ngIf=\"undoButton && someColumnIsEditable\"\r\n        id=\"undo\" (click)=\"undo()\" [disabled]=\"changeCounter <= 0\">\r\n        <mat-icon fontSet=\"material-icons-round\"> undo </mat-icon>\r\n    </button>\r\n    <button type=\"button\" title=\"{{ 'redo' | translate }}\" mat-mini-fab class=\"mini-fab mat-orange\" *ngIf=\"redoButton && someColumnIsEditable\"\r\n        id=\"redo\" (click)=\"redo()\" [disabled]=\"redoCounter <= 0\">\r\n        <mat-icon fontSet=\"material-icons-round\"> redo </mat-icon>\r\n    </button>\r\n    <button type=\"button\" title=\"{{ 'accept' | translate }}\" mat-mini-fab class=\"mini-fab mat-green\"\r\n        *ngIf=\"applyChangesButton\" id=\"applyChangesButton\" (click)=\"applyChanges()\" [disabled]=\"changeCounter <= 0\">\r\n        <mat-icon fontSet=\"material-icons-round\"> check </mat-icon>\r\n    </button>\r\n</div>\r\n\r\n<div id=grup2 class=\"actionsDivBtns\">\r\n    <label *ngIf=\"globalSearch\" [translate]=\"'search'\"> </label>\r\n    <input *ngIf=\"globalSearch\" type=\"text\" class=\"searchGenericInput\" placeholder=\"\" (keyup)=\"quickSearch()\"\r\n        [(ngModel)]=\"searchValue\" ml-2>\r\n    <label *ngIf=\"changeHeightButton\" [translate]=\"'rowsToShow'\"> </label>\r\n    <mat-button-toggle-group *ngIf=\"changeHeightButton\" class=\"toogleButton\" name=\"fontStyle\" aria-label=\"Font Style\"  value=\"5\">\r\n        <mat-button-toggle value=\"5\" (change)=\"changeHeight($event.value)\">5</mat-button-toggle>\r\n        <mat-button-toggle value=\"20\" (change)=\"changeHeight($event.value)\">20</mat-button-toggle>\r\n        <mat-button-toggle value=\"50\" (change)=\"changeHeight($event.value)\">50</mat-button-toggle>\r\n    </mat-button-toggle-group>\r\n\r\n    <button type=\"button\" *ngIf=\"deleteButton\" mat-flat-button id=\"deleteButton\" class=\"deleteButton\"\r\n        (click)=\"removeData()\" [disabled]=\"!areRowsSelected()\">\r\n        <mat-icon fontSet=\"material-icons-round\"> delete </mat-icon>\r\n        <span [translate]=\"'remove'\"> </span>\r\n\r\n    </button>\r\n    <button type=\"button\" *ngIf=\"actionButton\" mat-flat-button [matMenuTriggerFor]=\"menu\" id=\"actionButton\"\r\n        class=\"actionButton\">\r\n        <span [translate]=\"'actions'\"> </span>\r\n        <mat-icon fontSet=\"material-icons-round\"> keyboard_arrow_down </mat-icon>\r\n    </button>\r\n    <mat-menu #menu=\"matMenu\">\r\n        <button type=\"button\" mat-menu-item *ngIf=\"!hideExportButton\" [disabled]=\"!areRowsSelected()\" (click)=\"exportData()\"> {{\"export\" | translate}}\r\n        </button>\r\n        <button type=\"button\" mat-menu-item *ngIf=\"!hideDuplicateButton\" [disabled]=\"!areRowsSelected()\" (click)=\"onDuplicateButtonClicked()\">\r\n            {{\"duplicate\" |\r\n            translate}}</button>\r\n        <button type=\"button\" mat-menu-item *ngIf=\"!hideSearchReplaceButton && false\"> {{\"search/replace\" | translate}}</button>\r\n    </mat-menu>\r\n\r\n    <button type=\"button\" *ngIf=\"newButton\" mat-flat-button class=\"newButton\" (click)=\"newData()\">\r\n        <mat-icon fontSet=\"material-icons-round\"> add_circle_outline </mat-icon>\r\n        <span [translate]=\"'new'\"> </span>\r\n    </button>\r\n    <button type=\"button\" *ngIf=\"addButton\" mat-flat-button class=\"newButton\" (click)=\"onAddButtonClicked()\">\r\n        <mat-icon fontSet=\"material-icons-round\"> add_circle_outline </mat-icon>\r\n        <span [translate]=\"'add'\"> </span>\r\n    </button>\r\n    <button type=\"button\" *ngIf=\"registerButton\" mat-flat-button class=\"newButton\" (click)=\"modifyStatusSelected()\">\r\n        <mat-icon fontSet=\"material-icons-round\"> add_circle_outline </mat-icon>\r\n        <span [translate]=\"'register'\"> </span>\r\n    </button>\r\n\r\n</div>\r\n\r\n<div class=\"row\" style=\" height: 100%\">\r\n    <div id=\"myGrid\" style=\" width:100%; height: 100%\">\r\n        <ag-grid-angular style=\"width: 100%; height: 100%;min-height: 200px;\" [class]=\"themeGrid\"\r\n            [floatingFilter]=\"true\" [rowData]=\"rowData\" [columnDefs]=\"columnDefs\" [gridOptions]=\"gridOptions\"\r\n            [animateRows]=\"true\" [pagination]=\"false\" [modules]=\"modules\" [undoRedoCellEditing]=\"true\"\r\n            [undoRedoCellEditingLimit]=200 [suppressRowClickSelection]=true [frameworkComponents]=\"frameworkComponents\" [components]=\"components\"\r\n            rowSelection=\"multiple\" multiSortKey=\"key\" (filterModified)=\"onFilterModified()\"\r\n            (cellEditingStopped)=\"onCellEditingStopped($event)\" (cellValueChanged)=\"onCellValueChanged($event)\"\r\n            (gridReady)=\"onGridReady($event)\" (firstDataRendered)=\"firstDataRendered()\">\r\n        </ag-grid-angular>\r\n    </div>\r\n</div>",
                styles: ["@charset \"UTF-8\";input,label{display:inline-block;margin:5px 5px 5px 10px}.mat-flat-button.mat-orange,.mat-icon.mat-orange,.mat-mini-fab.mat-orange,.mat-raised-button.mat-orange{background-color:#ff9300!important;color:#fff!important}.mat-flat-button.mat-orange:disabled,.mat-icon.mat-orange:disabled,.mat-mini-fab.mat-orange:disabled,.mat-raised-button.mat-orange:disabled{background:#ffc97f!important;color:#fff!important}.mat-flat-button.mat-green,.mat-icon.mat-green,.mat-mini-fab.mat-green,.mat-raised-button.mat-green{background-color:#68a225!important;color:#fff!important}.mat-flat-button.mat-green:disabled,.mat-icon.mat-green:disabled,.mat-mini-fab.mat-green:disabled,.mat-raised-button.mat-green:disabled{background-color:#83976c!important;color:#fff!important}.mat-flat-button.mat-red,.mat-icon.mat-red,.mat-mini-fab.mat-red,.mat-raised-button.mat-red{background-color:#bf0000!important;color:#fff!important}.mat-flat-button.mat-red:disabled,.mat-icon.mat-red:disabled,.mat-mini-fab.mat-red:disabled,.mat-raised-button.mat-red:disabled{background-color:#da8c8e!important;color:#fff!important}.validateButton{background-color:#ff9300;color:#fff;min-width:85px;margin-top:34px!important}.deleteButton,.validateButton{height:40px;justify-self:right!important}.deleteButton{color:#bf0000;border:1px solid #bf0000!important;min-width:85px!important;float:inherit!important}.deleteButton:disabled{background-color:inherit!important;border:1px solid rgba(0,0,0,.26)!important;color:rgba(0,0,0,.26) solid 1px!important}.actionButton,.returnButton{color:#ff9300;border:1px solid #ff9300!important}.actionButton,.newButton,.returnButton,.saveButton{min-width:85px!important;height:40px;justify-self:right!important;float:inherit!important}.newButton,.saveButton{background-color:#68a225;color:#fff}.editDivBtns{margin-left:10px;text-align:start;width:130px;height:30px!important;line-height:30px!important}.actionsDivBtns{text-align:end;width:calc(100% - 140px);height:50px}.actionsDivBtns,.editDivBtns{display:inline-block!important}.actionsDivBtns .searchGenericInput{height:41px!important;width:45%!important;display:inline-block!important;margin:0 5px 5px 10px!important}.ag-body-viewport.ag-layout-normal ::-webkit-scrollbar-thumb{background:#eee}\u200B .ag-body-viewport.ag-layout-normal ::-webkit-scrollbar{width:2em;height:2em}.ag-body-viewport.ag-layout-normal ::-webkit-scrollbar-button{background:#ccc}.ag-body-viewport.ag-layout-normal::-webkit-scrollbar-track-piece{background:#888}.mini-fab{width:28px!important;height:28px!important;line-height:22px!important;margin-top:7px!important;margin-right:3px!important}.mini-fab .mat-button-wrapper{padding:1px 0!important;line-height:22px!important;width:24px!important;height:24px!important}.mini-fab .mat-button-wrapper .mat-icon{font-size:20px;padding-right:0;line-height:22px}.toogleButton{height:40px;margin-right:10px;vertical-align:bottom;align-items:center}"]
            }]
    }], function () { return [{ type: ɵngcc6.MatDialog }, { type: ɵngcc5.TranslateService }, { type: ɵngcc0.ElementRef }]; }, { currentData: [{
            type: Input
        }], frameworkComponents: [{
            type: Input
        }], components: [{
            type: Input
        }], remove: [{
            type: Output
        }], new: [{
            type: Output
        }], add: [{
            type: Output
        }], discardChanges: [{
            type: Output
        }], sendChanges: [{
            type: Output
        }], getSelectedRows: [{
            type: Output
        }], duplicate: [{
            type: Output
        }], getAllRows: [{
            type: Output
        }], gridModified: [{
            type: Output
        }], eventRefreshSubscription: [{
            type: Input
        }], eventGetSelectedRowsSubscription: [{
            type: Input
        }], eventGetAllRowsSubscription: [{
            type: Input
        }], eventSaveAgGridStateSubscription: [{
            type: Input
        }], eventModifyStatusOfSelectedCells: [{
            type: Input
        }], eventAddItemsSubscription: [{
            type: Input
        }], columnDefs: [{
            type: Input
        }], getAll: [{
            type: Input
        }], discardChangesButton: [{
            type: Input
        }], discardNonReverseStatus: [{
            type: Input
        }], id: [{
            type: Input
        }], undoButton: [{
            type: Input
        }], defaultColumnSorting: [{
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
        }], registerButton: [{
            type: Input
        }], newStatusRegister: [{
            type: Input
        }], globalSearch: [{
            type: Input
        }], changeHeightButton: [{
            type: Input
        }], defaultHeight: [{
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
        }], addFieldRestriction: [{
            type: Input
        }], allNewElements: [{
            type: Input
        }], fieldRestrictionWithDifferentName: [{
            type: Input
        }], getAgGridState: [{
            type: Output
        }] }); })();

class MaterialModule {
}
MaterialModule.ɵmod = ɵngcc0.ɵɵdefineNgModule({ type: MaterialModule });
MaterialModule.ɵinj = ɵngcc0.ɵɵdefineInjector({ factory: function MaterialModule_Factory(t) { return new (t || MaterialModule)(); }, imports: [A11yModule,
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
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && ɵngcc0.ɵɵsetNgModuleScope(MaterialModule, { exports: function () { return [A11yModule,
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
        MatFormFieldModule]; } }); })();
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(MaterialModule, [{
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

class DialogGridComponent {
    constructor(dialogRef) {
        this.dialogRef = dialogRef;
        this.getAllRows = new Subject();
        this.allRowsReceived = [];
        this.orderTable = [];
        this.addFieldRestriction = [];
        this.fieldRestrictionWithDifferentName = [];
        this.currentData = [];
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
DialogGridComponent.ɵfac = function DialogGridComponent_Factory(t) { return new (t || DialogGridComponent)(ɵngcc0.ɵɵdirectiveInject(ɵngcc6.MatDialogRef)); };
DialogGridComponent.ɵcmp = ɵngcc0.ɵɵdefineComponent({ type: DialogGridComponent, selectors: [["app-dialog-grid"]], outputs: { joinTables: "joinTables" }, decls: 11, vars: 8, consts: [["mat-dialog-title", "", 1, "titleDialog"], [1, "dialogConent"], ["class", "appDialogDataGridDiv", 3, "ngStyle", 4, "ngFor", "ngForOf"], ["mat-dialog-actions", "", "align", "end"], ["mat-flat-button", "", 1, "returnButton", 3, "click"], ["mat-flat-button", "", "cdkFocusInitial", "", 1, "saveButton", 3, "click"], [1, "appDialogDataGridDiv", 3, "ngStyle"], [3, "columnDefs", "themeGrid", "changeHeightButton", "defaultHeight", "getAll", "globalSearch", "singleSelection", "title", "defaultColumnSorting", "nonEditable", "eventGetSelectedRowsSubscription", "addFieldRestriction", "currentData", "fieldRestrictionWithDifferentName", "getSelectedRows"]], template: function DialogGridComponent_Template(rf, ctx) { if (rf & 1) {
        ɵngcc0.ɵɵelementStart(0, "h5", 0);
        ɵngcc0.ɵɵtext(1);
        ɵngcc0.ɵɵelementEnd();
        ɵngcc0.ɵɵelementStart(2, "mat-dialog-content", 1);
        ɵngcc0.ɵɵtemplate(3, DialogGridComponent_div_3_Template, 2, 17, "div", 2);
        ɵngcc0.ɵɵelementEnd();
        ɵngcc0.ɵɵelementStart(4, "div", 3);
        ɵngcc0.ɵɵelementStart(5, "button", 4);
        ɵngcc0.ɵɵlistener("click", function DialogGridComponent_Template_button_click_5_listener() { return ctx.closeDialog(); });
        ɵngcc0.ɵɵtext(6);
        ɵngcc0.ɵɵpipe(7, "translate");
        ɵngcc0.ɵɵelementEnd();
        ɵngcc0.ɵɵelementStart(8, "button", 5);
        ɵngcc0.ɵɵlistener("click", function DialogGridComponent_Template_button_click_8_listener() { return ctx.getAllSelectedRows(); });
        ɵngcc0.ɵɵtext(9);
        ɵngcc0.ɵɵpipe(10, "translate");
        ɵngcc0.ɵɵelementEnd();
        ɵngcc0.ɵɵelementEnd();
    } if (rf & 2) {
        ɵngcc0.ɵɵadvance(1);
        ɵngcc0.ɵɵtextInterpolate(ctx.title);
        ɵngcc0.ɵɵadvance(2);
        ɵngcc0.ɵɵproperty("ngForOf", ctx.getAllsTable);
        ɵngcc0.ɵɵadvance(3);
        ɵngcc0.ɵɵtextInterpolate(ɵngcc0.ɵɵpipeBind1(7, 4, "cancel"));
        ɵngcc0.ɵɵadvance(3);
        ɵngcc0.ɵɵtextInterpolate(ɵngcc0.ɵɵpipeBind1(10, 6, "add"));
    } }, directives: [ɵngcc6.MatDialogTitle, ɵngcc6.MatDialogContent, ɵngcc7.NgForOf, ɵngcc6.MatDialogActions, ɵngcc1.MatButton, ɵngcc7.NgStyle, DataGridComponent], pipes: [ɵngcc5.TranslatePipe], styles: [".dialogConent[_ngcontent-%COMP%]{margin:inherit!important;padding:inherit!important;max-height:60vh!important;height:100%;width:100%;overflow:auto}.titleDialog[_ngcontent-%COMP%]{margin-top:inherit!important;margin-bottom:15px!important}"] });
/** @nocollapse */
DialogGridComponent.ctorParameters = () => [
    { type: MatDialogRef }
];
DialogGridComponent.propDecorators = {
    joinTables: [{ type: Output }]
};
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(DialogGridComponent, [{
        type: Component,
        args: [{
                selector: 'app-dialog-grid',
                template: "<h5 mat-dialog-title class=\"titleDialog\">{{title}}</h5>\r\n<mat-dialog-content class=\"dialogConent\">\r\n  <div *ngFor=\"let getAll of getAllsTable; let i = index\" class=\"appDialogDataGridDiv\"  [ngStyle]=\"{'margin-top': i>0?'100px':'0px'}\">\r\n    <app-data-grid \r\n    [columnDefs]=\"columnDefsTable[i]\" [themeGrid]='themeGrid' [changeHeightButton]='changeHeightButton' [defaultHeight]='heightByDefault'  [getAll]='getAll' [globalSearch]=true [singleSelection]=\"singleSelectionTable[i]\"\r\n    [title]=\"titlesTable[i]\" [defaultColumnSorting]='orderTable.length>=i?orderTable[i]:null' [nonEditable]='nonEditable'\r\n     [eventGetSelectedRowsSubscription]=\"getAllRows.asObservable()\" [addFieldRestriction]='addFieldRestriction.length>=i?addFieldRestriction[i]:null' \r\n     [currentData]='currentData.length>=i?currentData[i]:null' [fieldRestrictionWithDifferentName]='fieldRestrictionWithDifferentName.length>=i?fieldRestrictionWithDifferentName[i]:null' (getSelectedRows)='joinRowsReceived($event)' >\r\n    </app-data-grid>\r\n  </div>\r\n</mat-dialog-content>\r\n<div mat-dialog-actions align=\"end\">\r\n  <button mat-flat-button class=\"returnButton\" (click)=\"closeDialog()\">{{\"cancel\" | translate}}</button>\r\n  <button mat-flat-button class=\"saveButton\" (click)=\"getAllSelectedRows()\" cdkFocusInitial>{{\"add\" | translate}}</button>\r\n</div>\r\n\r\n",
                styles: [".dialogConent{margin:inherit!important;padding:inherit!important;max-height:60vh!important;height:100%;width:100%;overflow:auto}.titleDialog{margin-top:inherit!important;margin-bottom:15px!important}"]
            }]
    }], function () { return [{ type: ɵngcc6.MatDialogRef }]; }, { joinTables: [{
            type: Output
        }] }); })();

class DialogFormComponent {
    constructor(dialogRef, dialog, translate) {
        this.dialogRef = dialogRef;
        this.dialog = dialog;
        this.translate = translate;
    }
    ngOnInit() {
    }
    doAdd() {
        if (this.form.valid) {
            this.dialogRef.close({ event: 'Add' });
        }
        else {
            const dialogRef = this.dialog.open(DialogMessageComponent);
            dialogRef.componentInstance.title = this.translate.instant("atention");
            dialogRef.componentInstance.message = this.translate.instant("requiredFieldMessage");
            dialogRef.componentInstance.hideCancelButton = true;
            dialogRef.afterClosed().subscribe();
        }
    }
    closeDialog() {
        this.dialogRef.close({ event: 'Cancel' });
    }
}
DialogFormComponent.ɵfac = function DialogFormComponent_Factory(t) { return new (t || DialogFormComponent)(ɵngcc0.ɵɵdirectiveInject(ɵngcc6.MatDialogRef), ɵngcc0.ɵɵdirectiveInject(ɵngcc6.MatDialog), ɵngcc0.ɵɵdirectiveInject(ɵngcc5.TranslateService)); };
DialogFormComponent.ɵcmp = ɵngcc0.ɵɵdefineComponent({ type: DialogFormComponent, selectors: [["app-dialog-form"]], decls: 11, vars: 8, consts: [["mat-dialog-title", ""], [1, "mat-typography"], [4, "ngTemplateOutlet"], ["align", "end"], ["mat-flat-button", "", 1, "returnButton", 3, "click"], ["mat-flat-button", "", "cdkFocusInitial", "", 1, "saveButton", 3, "click"]], template: function DialogFormComponent_Template(rf, ctx) { if (rf & 1) {
        ɵngcc0.ɵɵelementStart(0, "h5", 0);
        ɵngcc0.ɵɵtext(1);
        ɵngcc0.ɵɵelementEnd();
        ɵngcc0.ɵɵelementStart(2, "mat-dialog-content", 1);
        ɵngcc0.ɵɵtemplate(3, DialogFormComponent_ng_container_3_Template, 1, 0, "ng-container", 2);
        ɵngcc0.ɵɵelementEnd();
        ɵngcc0.ɵɵelementStart(4, "mat-dialog-actions", 3);
        ɵngcc0.ɵɵelementStart(5, "button", 4);
        ɵngcc0.ɵɵlistener("click", function DialogFormComponent_Template_button_click_5_listener() { return ctx.closeDialog(); });
        ɵngcc0.ɵɵtext(6);
        ɵngcc0.ɵɵpipe(7, "translate");
        ɵngcc0.ɵɵelementEnd();
        ɵngcc0.ɵɵelementStart(8, "button", 5);
        ɵngcc0.ɵɵlistener("click", function DialogFormComponent_Template_button_click_8_listener() { return ctx.doAdd(); });
        ɵngcc0.ɵɵtext(9);
        ɵngcc0.ɵɵpipe(10, "translate");
        ɵngcc0.ɵɵelementEnd();
        ɵngcc0.ɵɵelementEnd();
    } if (rf & 2) {
        ɵngcc0.ɵɵadvance(1);
        ɵngcc0.ɵɵtextInterpolate(ctx.title);
        ɵngcc0.ɵɵadvance(2);
        ɵngcc0.ɵɵproperty("ngTemplateOutlet", ctx.HTMLReceived);
        ɵngcc0.ɵɵadvance(3);
        ɵngcc0.ɵɵtextInterpolate(ɵngcc0.ɵɵpipeBind1(7, 4, "cancel"));
        ɵngcc0.ɵɵadvance(3);
        ɵngcc0.ɵɵtextInterpolate(ɵngcc0.ɵɵpipeBind1(10, 6, "accept"));
    } }, directives: [ɵngcc6.MatDialogTitle, ɵngcc6.MatDialogContent, ɵngcc7.NgTemplateOutlet, ɵngcc6.MatDialogActions, ɵngcc1.MatButton], pipes: [ɵngcc5.TranslatePipe], styles: [""] });
/** @nocollapse */
DialogFormComponent.ctorParameters = () => [
    { type: MatDialogRef },
    { type: MatDialog },
    { type: TranslateService }
];
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(DialogFormComponent, [{
        type: Component,
        args: [{
                selector: 'app-dialog-form',
                template: "<h5 mat-dialog-title>{{title}}</h5>\r\n<mat-dialog-content class=\"mat-typography\">\r\n  <ng-container *ngTemplateOutlet=\"HTMLReceived\">\r\n  </ng-container> \r\n</mat-dialog-content>\r\n<mat-dialog-actions align=\"end\">\r\n  <button mat-flat-button class=\"returnButton\"  (click)=\"closeDialog()\">{{\"cancel\" | translate}}</button>\r\n  <button mat-flat-button class=\"saveButton\"  (click)=\"doAdd()\" cdkFocusInitial>{{\"accept\" | translate}}</button>\r\n</mat-dialog-actions>",
                styles: [""]
            }]
    }], function () { return [{ type: ɵngcc6.MatDialogRef }, { type: ɵngcc6.MatDialog }, { type: ɵngcc5.TranslateService }]; }, null); })();

/**
 * File node data with nested structure.
 * Each node has a name, and a type or a list of children.
 */
class FileNode {
}
/** Flat node with expandable and level information */
class FileFlatNode {
    constructor(expandable, name, level, type, id, status) {
        this.expandable = expandable;
        this.name = name;
        this.level = level;
        this.type = type;
        this.id = id;
        this.status = status;
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
    initialize(dataObj, allNewElements) {
        // Build the tree nodes from Json object. The result is a list of `FileNode` with nested
        //     file node as children.
        const data = this.buildFileTree(dataObj, 0, allNewElements);
        // Notify the change.
        this.dataChange.next(data);
    }
    /**
     * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
     * The return value is the list of `FileNode`.
     */
    buildFileTree(arrayTreeNodes, level, allNewElements) {
        var map = {};
        if (arrayTreeNodes.length === 0) {
            let root = {
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
            arrayTreeNodes.forEach((treeNode) => {
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
            map['root'].order = 0;
            map['root'].isFolder = true;
            map['root'].isRoot = true;
        }
        return map['root'];
    }
    deleteItem(node, changedData) {
        this.deleteNode(changedData.children, node);
        this.dataChange.next(changedData);
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
    setOrder(data) {
        for (let i = 0; i < data.length; i++) {
            data[i].order = i;
            if (!data[i].status) {
                data[i].status = "Modified";
            }
        }
        return data;
    }
    copyPasteItem(from, to, changedData) {
        const newItem = this.insertItem(to, from, changedData);
        return newItem;
    }
    copyPasteItemAbove(from, to, changedData) {
        const newItem = this.insertItemAbove(to, from, changedData);
        return newItem;
    }
    copyPasteItemBelow(from, to, changedData) {
        const newItem = this.insertItemBelow(to, from, changedData);
        return newItem;
    }
    /** Add an item to to-do list */
    getNewItem(node) {
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
            queryableActive: node.queryableActive,
            radio: node.radio,
            tooltip: node.tooltip,
            _links: node._links
        };
        return newItem;
    }
    insertItem(parent, node, changedData) {
        if (!parent.children) {
            parent.children = [];
        }
        const newItem = this.getNewItem(node);
        newItem.parent = parent == null || parent.id == undefined ? null : parent.id;
        parent.children.push(newItem);
        this.setOrder(parent.children);
        this.dataChange.next(changedData);
        return newItem;
    }
    insertItemAbove(node, nodeDrag, changedData) {
        const parentNode = this.getParentFromNodes(node, changedData);
        const newItem = this.getNewItem(nodeDrag);
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
    }
    insertItemBelow(node, nodeDrag, changedData) {
        const parentNode = this.getParentFromNodes(node, changedData);
        const newItem = this.getNewItem(nodeDrag);
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
    }
    getParentFromNodes(node, changedData) {
        for (let i = 0; i < changedData.children.length; ++i) {
            const currentRoot = changedData.children[i];
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
FileDatabase.ɵfac = function FileDatabase_Factory(t) { return new (t || FileDatabase)(); };
FileDatabase.ɵprov = ɵngcc0.ɵɵdefineInjectable({ token: FileDatabase, factory: FileDatabase.ɵfac });
/** @nocollapse */
FileDatabase.ctorParameters = () => [];
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(FileDatabase, [{
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
                : new FileFlatNode((node.children && node.children.length > 0), node.name, level, node.type, node.id, node.status);
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
        if (this.eventRefreshSubscription) {
            this._eventRefreshSubscription = this.eventRefreshSubscription.subscribe(() => {
                this.getElements();
            });
        }
        this.getElements();
    }
    getElements() {
        this.getAll()
            .subscribe((items) => {
            this.treeData = items;
            this.database.initialize(this.treeData, this.allNewElements);
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
        const changedData = JSON.parse(JSON.stringify(this.dataSource.data));
        let toFlatNode;
        if (node.id === undefined) {
            toFlatNode = changedData[0];
        }
        else {
            toFlatNode = this.findNodeSiblings(changedData[0].children, node.id).find(nodeAct => nodeAct.id === node.id);
        }
        let fromFlatNode;
        if (this.dragNode.id === undefined) {
            fromFlatNode = changedData[0];
        }
        else {
            fromFlatNode = this.findNodeSiblings(changedData[0].children, this.dragNode.id).find(nodeAct => nodeAct.id === this.dragNode.id);
        }
        if (this.dragNode.status != "pendingDelete" && node !== this.dragNode && (this.dragNodeExpandOverArea !== 'center' || (this.dragNodeExpandOverArea === 'center' && toFlatNode.isFolder))) {
            let newItem;
            if (this.dragNodeExpandOverArea === 'above') {
                newItem = this.database.copyPasteItemAbove(fromFlatNode, toFlatNode, changedData[0]);
            }
            else if (this.dragNodeExpandOverArea === 'below') {
                newItem = this.database.copyPasteItemBelow(fromFlatNode, toFlatNode, changedData[0]);
            }
            else {
                newItem = this.database.copyPasteItem(fromFlatNode, toFlatNode, changedData[0]);
            }
            let parentLvl = this.treeControl.dataNodes.find((n) => n.id === fromFlatNode.id).level;
            fromFlatNode.children.forEach(child => {
                this.treeControl.dataNodes.find((n) => n.id === child.id).level = parentLvl + 1;
            });
            this.database.deleteItem(fromFlatNode, changedData[0]);
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
    sortByOrder(data) {
        // data.sort((a,b) => a.order.toString().localeCompare( b.order.toString()));
        data.sort((a, b) => (a.order > b.order) ? 1 : ((b.order > a.order) ? -1 : 0));
        data.forEach((item) => {
            if (item.children.length > 0) {
                this.sortByOrder(item.children);
            }
        });
    }
    setOrder(data) {
        for (let i = 0; i < data.length; i++) {
            data[i].order = i;
            if (!data[i].status) {
                data[i].status = "Modified";
            }
        }
        return data;
    }
    rebuildTreeForData(data) {
        //this.dataSource.data = data;
        this.sortByOrder(data);
        this.dataSource.data = [];
        this.dataSource.data = data;
        this.treeControl.expansionModel.selected.forEach((nodeAct) => {
            if (nodeAct) {
                const node = this.treeControl.dataNodes.find((n) => n.id === nodeAct.id);
                this.treeControl.expand(node);
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
            newFolder.order = dataToChange[0].children.length;
            dataToChange[0].children.push(newFolder);
        }
        else {
            const siblings = this.findNodeSiblings(dataToChange, newFolder.parent);
            let index = siblings.findIndex(node => node.id === newFolder.parent);
            newFolder.order = siblings[index].children.length;
            siblings[index].children.push(newFolder);
        }
        this.rebuildTreeForData(dataToChange);
    }
    createNewNode(newNode) {
        newNode.type = "node";
        const dataToChange = JSON.parse(JSON.stringify(this.dataSource.data));
        if (newNode.parent === null) {
            newNode.order = dataToChange[0].children.length;
            dataToChange[0].children.push(newNode);
        }
        else {
            const siblings = this.findNodeSiblings(dataToChange, newNode.parent);
            let index = siblings.findIndex(node => node.id === newNode.parent);
            newNode.order = siblings[index].children.length;
            siblings[index].children.push(newNode);
        }
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
            // let children= this.getAllChildren(nodeClicked.children)
            // children.forEach(children => {
            //   children.status='pendingDelete';
            // });
            this.deleteChildren(nodeClicked.children);
            // nodeClicked.children=children
            nodeClicked.status = 'pendingDelete';
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
    deleteChildren(arr) {
        arr.forEach((item, i) => {
            if (item.children.length > 0) {
                this.deleteChildren(item.children);
            }
            item.status = 'pendingDelete';
        });
    }
}
DataTreeComponent.ɵfac = function DataTreeComponent_Factory(t) { return new (t || DataTreeComponent)(ɵngcc0.ɵɵdirectiveInject(FileDatabase)); };
DataTreeComponent.ɵcmp = ɵngcc0.ɵɵdefineComponent({ type: DataTreeComponent, selectors: [["app-data-tree"]], viewQuery: function DataTreeComponent_Query(rf, ctx) { if (rf & 1) {
        ɵngcc0.ɵɵviewQuery(_c2, true);
    } if (rf & 2) {
        var _t;
        ɵngcc0.ɵɵqueryRefresh(_t = ɵngcc0.ɵɵloadQuery()) && (ctx.emptyItem = _t.first);
    } }, inputs: { eventNodeUpdatedSubscription: "eventNodeUpdatedSubscription", eventCreateNodeSubscription: "eventCreateNodeSubscription", eventGetAllRowsSubscription: "eventGetAllRowsSubscription", eventRefreshSubscription: "eventRefreshSubscription", getAll: "getAll", allNewElements: "allNewElements" }, outputs: { emitNode: "emitNode", createNode: "createNode", createFolder: "createFolder", emitAllNodes: "emitAllNodes" }, features: [ɵngcc0.ɵɵProvidersFeature([FileDatabase])], decls: 17, vars: 15, consts: [["mat-flat-button", "", "type", "button", "type", "button", 3, "title", "click"], ["fontSet", "material-icons-round"], [3, "dataSource", "treeControl"], ["matTreeNodeToggle", "", "matTreeNodePadding", "", "draggable", "true", 3, "ngClass", "dragstart", "dragover", "drop", "dragend", 4, "matTreeNodeDef"], ["matTreeNodePadding", "", "draggable", "true", 3, "ngClass", "dragstart", "dragover", "drop", "dragend", 4, "matTreeNodeDef", "matTreeNodeDefWhen"], ["emptyItem", ""], ["matTreeNodeToggle", "", "matTreeNodePadding", "", "draggable", "true", 3, "ngClass", "dragstart", "dragover", "drop", "dragend"], ["mat-icon-button", "", "disabled", ""], ["class", "type-icon", 4, "ngIf"], [4, "ngIf"], ["mat-icon-button", "", 3, "click", 4, "ngIf"], [1, "type-icon"], ["mat-icon-button", "", 3, "click"], ["matTreeNodePadding", "", "draggable", "true", 3, "ngClass", "dragstart", "dragover", "drop", "dragend"], ["mat-icon-button", "", "matTreeNodeToggle", "", 3, "click"], [1, "mat-icon-rtl-mirror"]], template: function DataTreeComponent_Template(rf, ctx) { if (rf & 1) {
        ɵngcc0.ɵɵelementStart(0, "button", 0);
        ɵngcc0.ɵɵlistener("click", function DataTreeComponent_Template_button_click_0_listener() { return ctx.treeControl.expandAll(); });
        ɵngcc0.ɵɵpipe(1, "translate");
        ɵngcc0.ɵɵelementStart(2, "mat-icon", 1);
        ɵngcc0.ɵɵtext(3, " expand_more ");
        ɵngcc0.ɵɵelementEnd();
        ɵngcc0.ɵɵtext(4);
        ɵngcc0.ɵɵpipe(5, "translate");
        ɵngcc0.ɵɵelementEnd();
        ɵngcc0.ɵɵelementStart(6, "button", 0);
        ɵngcc0.ɵɵlistener("click", function DataTreeComponent_Template_button_click_6_listener() { return ctx.treeControl.collapseAll(); });
        ɵngcc0.ɵɵpipe(7, "translate");
        ɵngcc0.ɵɵelementStart(8, "mat-icon", 1);
        ɵngcc0.ɵɵtext(9, " expand_less ");
        ɵngcc0.ɵɵelementEnd();
        ɵngcc0.ɵɵtext(10);
        ɵngcc0.ɵɵpipe(11, "translate");
        ɵngcc0.ɵɵelementEnd();
        ɵngcc0.ɵɵelementStart(12, "mat-tree", 2);
        ɵngcc0.ɵɵtemplate(13, DataTreeComponent_mat_tree_node_13_Template, 9, 13, "mat-tree-node", 3);
        ɵngcc0.ɵɵtemplate(14, DataTreeComponent_mat_tree_node_14_Template, 12, 15, "mat-tree-node", 4);
        ɵngcc0.ɵɵelementEnd();
        ɵngcc0.ɵɵelement(15, "span", null, 5);
    } if (rf & 2) {
        ɵngcc0.ɵɵpropertyInterpolate("title", ɵngcc0.ɵɵpipeBind1(1, 7, "expandAll"));
        ɵngcc0.ɵɵadvance(4);
        ɵngcc0.ɵɵtextInterpolate1(" ", ɵngcc0.ɵɵpipeBind1(5, 9, "expandAll"), "\n");
        ɵngcc0.ɵɵadvance(2);
        ɵngcc0.ɵɵpropertyInterpolate("title", ɵngcc0.ɵɵpipeBind1(7, 11, "expandAll"));
        ɵngcc0.ɵɵadvance(4);
        ɵngcc0.ɵɵtextInterpolate1(" ", ɵngcc0.ɵɵpipeBind1(11, 13, "collapseAll"), "\n");
        ɵngcc0.ɵɵadvance(2);
        ɵngcc0.ɵɵproperty("dataSource", ctx.dataSource)("treeControl", ctx.treeControl);
        ɵngcc0.ɵɵadvance(2);
        ɵngcc0.ɵɵproperty("matTreeNodeDefWhen", ctx.hasChild);
    } }, directives: [ɵngcc1.MatButton, ɵngcc2.MatIcon, ɵngcc11.MatTree, ɵngcc11.MatTreeNodeDef, ɵngcc11.MatTreeNode, ɵngcc11.MatTreeNodeToggle, ɵngcc11.MatTreeNodePadding, ɵngcc7.NgClass, ɵngcc7.NgIf], pipes: [ɵngcc5.TranslatePipe], styles: [".mat-tree-node[_ngcontent-%COMP%]{-webkit-user-select:none;-moz-user-select:none;user-select:none;cursor:move}.mat-tree-node.cdk-drag-preview[_ngcontent-%COMP%]{box-shadow:0 7px 8px -4px rgba(0,0,0,.2),0 12px 17px 2px rgba(0,0,0,.14),0 5px 22px 4px rgba(0,0,0,.12)}.mat-tree-node.cdk-drag-placeholder[_ngcontent-%COMP%]{opacity:0}.cdk-drop-list-dragging[_ngcontent-%COMP%]   .mat-tree-node[_ngcontent-%COMP%]:not(.cdk-drag-placeholder){transition:transform .25s cubic-bezier(0,0,.2,1)}.cdk-drag-animating[_ngcontent-%COMP%]{transition:transform .2s cubic-bezier(0,0,.2,1)}.drop-above[_ngcontent-%COMP%]{border-top:10px solid #ddd;margin-top:-10px}.drop-below[_ngcontent-%COMP%]{border-bottom:10px solid #ddd;margin-bottom:-10px}.drop-center[_ngcontent-%COMP%]{background-color:#ddd}.deletedNode[_ngcontent-%COMP%]{color:red;font-style:italic}"] });
/** @nocollapse */
DataTreeComponent.ctorParameters = () => [
    { type: FileDatabase }
];
DataTreeComponent.propDecorators = {
    createNode: [{ type: Output }],
    createFolder: [{ type: Output }],
    emitNode: [{ type: Output }],
    emitAllNodes: [{ type: Output }],
    eventNodeUpdatedSubscription: [{ type: Input }],
    eventCreateNodeSubscription: [{ type: Input }],
    eventGetAllRowsSubscription: [{ type: Input }],
    eventRefreshSubscription: [{ type: Input }],
    getAll: [{ type: Input }],
    allNewElements: [{ type: Input }],
    emptyItem: [{ type: ViewChild, args: ['emptyItem',] }]
};
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(DataTreeComponent, [{
        type: Component,
        args: [{
                selector: 'app-data-tree',
                template: "<button mat-flat-button type=\"button\" (click)=\"treeControl.expandAll()\" title=\"{{ 'expandAll' | translate }}\"  type=\"button\" >\r\n\t<mat-icon fontSet=\"material-icons-round\"> expand_more </mat-icon>\r\n\t{{ \"expandAll\" | translate }}\r\n</button>\r\n<button mat-flat-button type=\"button\" (click)=\"treeControl.collapseAll()\" title=\"{{ 'expandAll' | translate }}\"  type=\"button\" >\r\n\t<mat-icon fontSet=\"material-icons-round\"> expand_less </mat-icon>\r\n\t{{ \"collapseAll\" | translate }}\r\n</button>\r\n<mat-tree [dataSource]=\"dataSource\" [treeControl]=\"treeControl\" >\r\n\t<mat-tree-node *matTreeNodeDef=\"let node\" matTreeNodeToggle matTreeNodePadding  draggable=\"true\"\r\n\t(dragstart)=\"handleDragStart($event, node);\" \t(dragover)=\"handleDragOver($event, node);\"\r\n\t(drop)=\"handleDrop($event, node);\" \t(dragend)=\"handleDragEnd($event);\"                  \r\n\t  [ngClass]=\"{'drop-above': dragNodeExpandOverArea === 'above' && dragNodeExpandOverNode === node,\r\n\t'drop-below': dragNodeExpandOverArea === 'below' && dragNodeExpandOverNode === node,\r\n\t'drop-center': dragNodeExpandOverArea === 'center' && dragNodeExpandOverNode === node,\r\n\t'deletedNode': node.status=='pendingDelete'}\">\r\n\t\t<button mat-icon-button disabled></button>\r\n\t\t<mat-icon *ngIf=\"node.type ==='folder'&& node.status!='pendingDelete'\" class=\"type-icon\" [attr.aria-label]=\"node.type + 'icon'\">\r\n\t\t\tfolder\r\n\t\t</mat-icon>\r\n\t\t<span *ngIf=\"node.status=='pendingDelete'\">({{\"pendingDelete\" | translate}})-</span>\r\n\t\t{{node.name}}\r\n\t\r\n\t\t<button *ngIf=\"node.type ==='folder' && node.status!='pendingDelete'\" (click)=\"onButtonClicked(node.id, 'newFolder')\" mat-icon-button>\r\n\t\t\t<mat-icon>create_new_folder</mat-icon>\r\n\t\t</button>\r\n\t\t<button *ngIf=\"node.type ==='folder' && node.status!='pendingDelete'\" (click)=\"onButtonClicked(node.id, 'newNode')\" mat-icon-button>\r\n\t\t\t<mat-icon>playlist_add</mat-icon>\r\n\t\t</button>\r\n\t\t<button *ngIf=\"node.id !== undefined && node.status!='pendingDelete'\" mat-icon-button (click)=\"onButtonClicked(node.id, 'delete')\">\r\n\t\t\t<mat-icon>delete</mat-icon>\r\n\t\t</button>\r\n\t\t<button *ngIf=\"node.id !== undefined && node.status!='pendingDelete'\" mat-icon-button (click)=\"onButtonClicked(node.id, 'edit')\">\r\n\t\t\t<mat-icon>edit</mat-icon>\r\n\t\t</button>\r\n\r\n\t</mat-tree-node>\r\n\r\n\t<mat-tree-node *matTreeNodeDef=\"let node;when: hasChild\" matTreeNodePadding  draggable=\"true\"\r\n\t(dragstart)=\"handleDragStart($event, node);\" \t(dragover)=\"handleDragOver($event, node);\"\r\n\t(drop)=\"handleDrop($event, node);\" \t(dragend)=\"handleDragEnd($event);\"                  \r\n\t [ngClass]=\"{'drop-above': dragNodeExpandOverArea === 'above' && dragNodeExpandOverNode === node,\r\n\t'drop-below': dragNodeExpandOverArea === 'below' && dragNodeExpandOverNode === node,\r\n\t'drop-center': dragNodeExpandOverArea === 'center' && dragNodeExpandOverNode === node,\r\n\t'deletedNode': node.status=='pendingDelete'}\">\r\n\t\t<button mat-icon-button matTreeNodeToggle (click)=\"expansionModel.toggle(node.id)\"\r\n\t\t\t[attr.aria-label]=\"'toggle ' + node.name\">\r\n\t\t\t<mat-icon class=\"mat-icon-rtl-mirror\">\r\n\t\t\t\t{{treeControl.isExpanded(node) ? 'expand_more' : 'chevron_right'}}\r\n\t\t\t</mat-icon>\r\n\t\t</button>\r\n\t\t<mat-icon class=\"type-icon\" [attr.aria-label]=\"node.type + 'icon'\">\r\n\t\t\tfolder\r\n\t\t</mat-icon>\r\n\t\t<span *ngIf=\"node.status=='pendingDelete'\">({{\"pendingDelete\" | translate}})-</span>\r\n\t\t{{node.name}}\r\n\t\t<button *ngIf=\"node.type ==='folder' && node.status!='pendingDelete'\" (click)=\"onButtonClicked(node.id, 'newFolder')\" mat-icon-button>\r\n\t\t\t<mat-icon>create_new_folder</mat-icon>\r\n\t\t</button>\r\n\t\t<button *ngIf=\"node.type ==='folder' && node.status!='pendingDelete'\" (click)=\"onButtonClicked(node.id, 'newNode')\" mat-icon-button>\r\n\t\t\t<mat-icon>playlist_add</mat-icon>\r\n\t\t</button>\r\n\t\t<button *ngIf=\"node.id !== undefined && node.status!='pendingDelete'\" mat-icon-button (click)=\"onButtonClicked(node.id, 'delete')\">\r\n\t\t\t<mat-icon>delete</mat-icon>\r\n\t\t</button>\r\n\t\t<button *ngIf=\"node.id !== undefined && node.status!='pendingDelete'\"  mat-icon-button (click)=\"onButtonClicked(node.id, 'edit')\">\r\n\t\t\t<mat-icon>edit</mat-icon>\r\n\t\t</button>\r\n\t\t\r\n\t</mat-tree-node>\r\n</mat-tree>\r\n\r\n<span #emptyItem></span>\r\n",
                providers: [FileDatabase],
                styles: [".mat-tree-node{-webkit-user-select:none;-moz-user-select:none;user-select:none;cursor:move}.mat-tree-node.cdk-drag-preview{box-shadow:0 7px 8px -4px rgba(0,0,0,.2),0 12px 17px 2px rgba(0,0,0,.14),0 5px 22px 4px rgba(0,0,0,.12)}.mat-tree-node.cdk-drag-placeholder{opacity:0}.cdk-drop-list-dragging .mat-tree-node:not(.cdk-drag-placeholder){transition:transform .25s cubic-bezier(0,0,.2,1)}.cdk-drag-animating{transition:transform .2s cubic-bezier(0,0,.2,1)}.drop-above{border-top:10px solid #ddd;margin-top:-10px}.drop-below{border-bottom:10px solid #ddd;margin-bottom:-10px}.drop-center{background-color:#ddd}.deletedNode{color:red;font-style:italic}"]
            }]
    }], function () { return [{ type: FileDatabase }]; }, { emitNode: [{
            type: Output
        }], createNode: [{
            type: Output
        }], createFolder: [{
            type: Output
        }], emitAllNodes: [{
            type: Output
        }], eventNodeUpdatedSubscription: [{
            type: Input
        }], eventCreateNodeSubscription: [{
            type: Input
        }], eventGetAllRowsSubscription: [{
            type: Input
        }], eventRefreshSubscription: [{
            type: Input
        }], getAll: [{
            type: Input
        }], allNewElements: [{
            type: Input
        }], emptyItem: [{
            type: ViewChild,
            args: ['emptyItem']
        }] }); })();

class DialogTranslationComponent {
    constructor(dialogRef, matIconRegistry, domSanitizer) {
        this.dialogRef = dialogRef;
        this.matIconRegistry = matIconRegistry;
        this.domSanitizer = domSanitizer;
        this.catalanAvailable = false;
        this.spanishAvailable = false;
        this.englishAvailable = false;
        this.araneseAvailable = false;
        this.frenchAvailable = false;
        this.initializeTranslationForm();
        this.matIconRegistry.addSvgIcon(`icon_lang_ca`, this.domSanitizer.bypassSecurityTrustResourceUrl('assets/img/flag_ca.svg'));
        this.matIconRegistry.addSvgIcon(`icon_lang_es`, this.domSanitizer.bypassSecurityTrustResourceUrl('assets/img/flag_es.svg'));
        this.matIconRegistry.addSvgIcon(`icon_lang_en`, this.domSanitizer.bypassSecurityTrustResourceUrl('assets/img/flag_en.svg'));
        this.matIconRegistry.addSvgIcon(`icon_lang_oc`, this.domSanitizer.bypassSecurityTrustResourceUrl('assets/img/flag_oc.svg'));
        this.matIconRegistry.addSvgIcon(`icon_lang_fr`, this.domSanitizer.bypassSecurityTrustResourceUrl('assets/img/flag_fr.svg'));
    }
    ngOnInit() {
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
    }
    checkLanguagesAvailables() {
        this.languagesAvailables.forEach(element => {
            if (element.shortname == 'ca' && this.languageByDefault != 'ca') {
                this.catalanAvailable = true;
            }
            if (element.shortname == 'es' && this.languageByDefault != 'es') {
                this.spanishAvailable = true;
            }
            if (element.shortname == 'en' && this.languageByDefault != 'en') {
                this.englishAvailable = true;
            }
            if (element.shortname == 'oc-aranes' && this.languageByDefault != 'oc-aranes') {
                this.araneseAvailable = true;
            }
            if (element.shortname == 'fr' && this.languageByDefault != 'fr') {
                this.frenchAvailable = true;
            }
        });
    }
    checkTranslationsAlreadyDone() {
        this.translationsMap.forEach((value, key) => {
            if (key == 'ca' && value && value.translation) {
                this.translationForm.patchValue({ catalanValue: value.translation });
            }
            if (key == 'es' && value && value.translation) {
                this.translationForm.patchValue({ spanishValue: value.translation });
            }
            if (key == 'en' && value && value.translation) {
                this.translationForm.patchValue({ englishValue: value.translation });
            }
            if (key == 'oc-aranes' && value && value.translation) {
                this.translationForm.patchValue({ araneseValue: value.translation });
            }
            if (key == 'fr' && value && value.translation) {
                this.translationForm.patchValue({ frenchValue: value.translation });
            }
        });
    }
    initializeTranslationForm() {
        this.translationForm = new FormGroup({
            catalanValue: new FormControl(null, []),
            spanishValue: new FormControl(null, []),
            englishValue: new FormControl(null, []),
            araneseValue: new FormControl(null, []),
            frenchValue: new FormControl(null, []),
        });
    }
    doAccept() {
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
    }
    closeDialog() {
        this.dialogRef.close({ event: 'Cancel' });
    }
}
DialogTranslationComponent.ɵfac = function DialogTranslationComponent_Factory(t) { return new (t || DialogTranslationComponent)(ɵngcc0.ɵɵdirectiveInject(ɵngcc6.MatDialogRef), ɵngcc0.ɵɵdirectiveInject(ɵngcc2.MatIconRegistry), ɵngcc0.ɵɵdirectiveInject(ɵngcc12.DomSanitizer)); };
DialogTranslationComponent.ɵcmp = ɵngcc0.ɵɵdefineComponent({ type: DialogTranslationComponent, selectors: [["app-dialog-translation"]], decls: 19, vars: 12, consts: [[3, "formGroup"], ["f", "ngForm"], ["class", "displayInline", 4, "ngIf"], [1, "displayInline"], ["class", "formLabelDialog", 4, "ngIf"], ["appearance", "outline"], ["matInput", "", "type", "text", "formControlName", "frenchValue"], ["svgIcon", "icon_lang_fr", 1, "icon"], ["mat-dialog-actions", ""], ["mat-flat-button", "", 1, "returnButton", 3, "click"], ["mat-flat-button", "", "cdkFocusInitial", "", 1, "saveButton", 3, "click"], [1, "formLabelDialog"], ["matInput", "", "type", "text", "formControlName", "catalanValue", "required", ""], ["svgIcon", "icon_lang_ca", 1, "icon"], ["matInput", "", "type", "text", "formControlName", "spanishValue"], ["svgIcon", "icon_lang_es", 1, "icon"], ["matInput", "", "type", "text", "formControlName", "englishValue"], ["svgIcon", "icon_lang_en", 1, "icon"], ["matInput", "", "type", "text", "formControlName", "araneseValue"], ["svgIcon", "icon_lang_oc", 1, "icon"]], template: function DialogTranslationComponent_Template(rf, ctx) { if (rf & 1) {
        ɵngcc0.ɵɵelementStart(0, "form", 0, 1);
        ɵngcc0.ɵɵtemplate(2, DialogTranslationComponent_div_2_Template, 6, 1, "div", 2);
        ɵngcc0.ɵɵtemplate(3, DialogTranslationComponent_div_3_Template, 6, 1, "div", 2);
        ɵngcc0.ɵɵtemplate(4, DialogTranslationComponent_div_4_Template, 6, 1, "div", 2);
        ɵngcc0.ɵɵtemplate(5, DialogTranslationComponent_div_5_Template, 6, 1, "div", 2);
        ɵngcc0.ɵɵelementStart(6, "div", 3);
        ɵngcc0.ɵɵtemplate(7, DialogTranslationComponent_label_7_Template, 2, 1, "label", 4);
        ɵngcc0.ɵɵelementStart(8, "mat-form-field", 5);
        ɵngcc0.ɵɵelement(9, "input", 6);
        ɵngcc0.ɵɵelementEnd();
        ɵngcc0.ɵɵelement(10, "mat-icon", 7);
        ɵngcc0.ɵɵelementEnd();
        ɵngcc0.ɵɵelementEnd();
        ɵngcc0.ɵɵelementStart(11, "div");
        ɵngcc0.ɵɵelementStart(12, "div", 8);
        ɵngcc0.ɵɵelementStart(13, "button", 9);
        ɵngcc0.ɵɵlistener("click", function DialogTranslationComponent_Template_button_click_13_listener() { return ctx.closeDialog(); });
        ɵngcc0.ɵɵtext(14);
        ɵngcc0.ɵɵpipe(15, "translate");
        ɵngcc0.ɵɵelementEnd();
        ɵngcc0.ɵɵelementStart(16, "button", 10);
        ɵngcc0.ɵɵlistener("click", function DialogTranslationComponent_Template_button_click_16_listener() { return ctx.doAccept(); });
        ɵngcc0.ɵɵtext(17);
        ɵngcc0.ɵɵpipe(18, "translate");
        ɵngcc0.ɵɵelementEnd();
        ɵngcc0.ɵɵelementEnd();
        ɵngcc0.ɵɵelementEnd();
    } if (rf & 2) {
        ɵngcc0.ɵɵproperty("formGroup", ctx.translationForm);
        ɵngcc0.ɵɵadvance(2);
        ɵngcc0.ɵɵproperty("ngIf", ctx.catalanAvailable);
        ɵngcc0.ɵɵadvance(1);
        ɵngcc0.ɵɵproperty("ngIf", ctx.spanishAvailable);
        ɵngcc0.ɵɵadvance(1);
        ɵngcc0.ɵɵproperty("ngIf", ctx.englishAvailable);
        ɵngcc0.ɵɵadvance(1);
        ɵngcc0.ɵɵproperty("ngIf", ctx.araneseAvailable);
        ɵngcc0.ɵɵadvance(2);
        ɵngcc0.ɵɵproperty("ngIf", ctx.frenchAvailable);
        ɵngcc0.ɵɵadvance(7);
        ɵngcc0.ɵɵtextInterpolate(ɵngcc0.ɵɵpipeBind1(15, 8, "cancel"));
        ɵngcc0.ɵɵadvance(3);
        ɵngcc0.ɵɵtextInterpolate(ɵngcc0.ɵɵpipeBind1(18, 10, "accept"));
    } }, directives: [ɵngcc4.ɵangular_packages_forms_forms_y, ɵngcc4.NgControlStatusGroup, ɵngcc4.FormGroupDirective, ɵngcc7.NgIf, ɵngcc13.MatFormField, ɵngcc14.MatInput, ɵngcc4.DefaultValueAccessor, ɵngcc4.NgControlStatus, ɵngcc4.FormControlName, ɵngcc2.MatIcon, ɵngcc6.MatDialogActions, ɵngcc1.MatButton, ɵngcc4.RequiredValidator], pipes: [ɵngcc5.TranslatePipe], styles: [".displayInline[_ngcontent-%COMP%]{display:flex!important}.mat-dialog-actions[_ngcontent-%COMP%]{justify-content:flex-end}.icon[_ngcontent-%COMP%]{height:50px!important;width:40px!important;margin-left:30px}.formLabelDialog[_ngcontent-%COMP%]{width:10%!important}.mat-dialog-container[_ngcontent-%COMP%]{height:-moz-max-content!important;height:max-content!important}"] });
/** @nocollapse */
DialogTranslationComponent.ctorParameters = () => [
    { type: MatDialogRef },
    { type: MatIconRegistry },
    { type: DomSanitizer }
];
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(DialogTranslationComponent, [{
        type: Component,
        args: [{
                selector: 'app-dialog-translation',
                template: "\r\n\r\n<form [formGroup]='translationForm' #f=\"ngForm\">\r\n\r\n\r\n        <div class=\"displayInline\" *ngIf=\"catalanAvailable\">\r\n            <label class=\"formLabelDialog\">\r\n                {{'Valor'}}\r\n            </label>\r\n            <mat-form-field appearance=\"outline\">\r\n            <input matInput type=\"text\" formControlName=\"catalanValue\" required>\r\n            </mat-form-field>\r\n            <mat-icon class=\"icon\" svgIcon=\"icon_lang_ca\"></mat-icon>\r\n        </div>\r\n\r\n        <div class=\"displayInline\"  *ngIf=\"spanishAvailable\">\r\n            <label class=\"formLabelDialog\">\r\n                {{'Valor'}}\r\n            </label>\r\n\r\n            <mat-form-field appearance=\"outline\">\r\n            <input matInput type=\"text\" formControlName=\"spanishValue\">\r\n            </mat-form-field>\r\n            <mat-icon class=\"icon\" svgIcon=\"icon_lang_es\"></mat-icon>\r\n        </div>\r\n\r\n        <div class=\"displayInline\" *ngIf=\"englishAvailable\" >\r\n            <label class=\"formLabelDialog\">\r\n                {{'Value'}}\r\n            </label>\r\n            <mat-form-field appearance=\"outline\">\r\n            <input matInput type=\"text\" formControlName=\"englishValue\">\r\n            </mat-form-field>\r\n            <mat-icon class=\"icon\" svgIcon=\"icon_lang_en\"></mat-icon>\r\n        </div>\r\n\r\n        <div class=\"displayInline\" *ngIf=\"araneseAvailable\" >\r\n            <label class=\"formLabelDialog\">\r\n                {{'Valor'}}\r\n            </label>\r\n            <mat-form-field appearance=\"outline\">\r\n            <input matInput type=\"text\" formControlName=\"araneseValue\">\r\n            </mat-form-field>\r\n            <mat-icon class=\"icon\" svgIcon=\"icon_lang_oc\"></mat-icon>\r\n        </div>\r\n        <div class=\"displayInline\">\r\n            <label class=\"formLabelDialog\" *ngIf=\"frenchAvailable\">\r\n                {{'Valeur'}}\r\n            </label>\r\n            <mat-form-field appearance=\"outline\">\r\n            <input matInput type=\"text\" formControlName=\"frenchValue\">\r\n            </mat-form-field>\r\n            <mat-icon class=\"icon\" svgIcon=\"icon_lang_fr\"></mat-icon>\r\n        </div>\r\n\r\n  </form>\r\n\r\n<div>\r\n    <div mat-dialog-actions >\r\n        <button  mat-flat-button class=\"returnButton\" (click)=\"closeDialog()\">{{\"cancel\" | translate}}</button>\r\n        <button  mat-flat-button class=\"saveButton\"  (click)=\"doAccept()\" cdkFocusInitial>{{\"accept\" | translate}}</button>\r\n    </div>\r\n</div>",
                styles: [".displayInline{display:flex!important}.mat-dialog-actions{justify-content:flex-end}.icon{height:50px!important;width:40px!important;margin-left:30px}.formLabelDialog{width:10%!important}.mat-dialog-container{height:-moz-max-content!important;height:max-content!important}"]
            }]
    }], function () { return [{ type: ɵngcc6.MatDialogRef }, { type: ɵngcc2.MatIconRegistry }, { type: ɵngcc12.DomSanitizer }]; }, null); })();

class DatagraphComponent {
    constructor() {
        this.margin = { top: 20, bottom: 60, left: 40, right: 40 };
        this.margin2 = 80;
    }
    ngOnInit() {
        if (this.type == "bar") {
            this.createBarChart();
            if (this.data) {
                this.updateBarChart();
            }
        }
    }
    ngOnChanges() {
        if (this.type == "bar") {
            if (this.chart) {
                this.updateBarChart();
            }
        }
    }
    createBarChart() {
        let element = this.chartContainer.nativeElement;
        this.width = element.offsetWidth - this.margin.left - this.margin.right;
        this.height = element.offsetHeight - this.margin.top - this.margin.bottom;
        let svg = d3.select(element).append('svg')
            .attr('width', '100%')
            .attr("height", '100%');
        // chart plot area
        this.chart = svg.append('g')
            .attr('class', 'bars')
            .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
        const barGroups = this.chart.selectAll()
            .data(this.data)
            .enter()
            .append('g');
        // define X & Y domains
        let xDomain = this.data.map(d => d.index);
        let yDomain = [0, (d3.max(this.data, d => d.value))];
        // create scales
        this.xScale = d3.scaleBand().padding(0.3).domain(xDomain).rangeRound([0, this.width]);
        this.yScale = d3.scaleLinear().domain(yDomain).range([this.height, 0]);
        // bar colors
        // this.colors = d3.scaleLinear().domain([0, this.data.length]).range(<any[]>['red', 'blue']);
        barGroups
            .append('text')
            .attr('class', 'value')
            .attr('x', (a) => this.xScale(a.index) + this.xScale.bandwidth() / 2)
            .attr('y', (a) => this.yScale(a.value) - 5)
            .attr('text-anchor', 'middle')
            .style("font-size", 9)
            .style("fill", "black")
            .text((a) => `${a.value}`);
        // x & y axis
        this.xAxis = svg.append('g')
            .attr('class', 'axis axis-x')
            .attr('transform', `translate(${this.margin.left}, ${this.margin.top + this.height})`)
            .call(d3.axisBottom(this.xScale))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end")
            .style("font-size", 9)
            .style("fill", "black");
        this.yAxis = svg.append('g')
            .attr('class', 'axis axis-y')
            .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
            .call(d3.axisLeft(this.yScale))
            .selectAll("text")
            .style("font-size", 9)
            .style("fill", "black");
    }
    updateBarChart() {
        // update scales & axis
        this.xScale.domain(this.data.map(d => d.index));
        this.yScale.domain([0, (d3.max(this.data, d => d.value))]);
        this.xAxis.transition().call(d3.axisBottom(this.xScale));
        this.yAxis.transition().call(d3.axisLeft(this.yScale));
        let update = this.chart.selectAll('.bar')
            .data(this.data);
        // remove exiting bars
        update.exit().remove();
        // update existing bars
        this.chart.selectAll('.bar').transition()
            .attr('x', d => this.xScale(d.index))
            .attr('y', d => this.yScale(d.value))
            .attr('width', d => this.xScale.bandwidth())
            .attr('height', d => this.height - this.yScale(d[1]))
            .style('fill', '#be7d27');
        // add new bars
        update
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', d => this.xScale(d.index))
            .attr('y', d => this.yScale(d.value))
            .attr('height', d => this.height - this.yScale(d.value))
            .attr('width', this.xScale.bandwidth())
            .style('fill', '#be7d27')
            .transition()
            .delay((d, i) => i * 10);
    }
}
DatagraphComponent.ɵfac = function DatagraphComponent_Factory(t) { return new (t || DatagraphComponent)(); };
DatagraphComponent.ɵcmp = ɵngcc0.ɵɵdefineComponent({ type: DatagraphComponent, selectors: [["app-datagraph"]], viewQuery: function DatagraphComponent_Query(rf, ctx) { if (rf & 1) {
        ɵngcc0.ɵɵstaticViewQuery(_c4, true);
    } if (rf & 2) {
        var _t;
        ɵngcc0.ɵɵqueryRefresh(_t = ɵngcc0.ɵɵloadQuery()) && (ctx.chartContainer = _t.first);
    } }, inputs: { data: "data", type: "type" }, features: [ɵngcc0.ɵɵNgOnChangesFeature], decls: 2, vars: 0, consts: [[1, "d3-chart"], ["chart", ""]], template: function DatagraphComponent_Template(rf, ctx) { if (rf & 1) {
        ɵngcc0.ɵɵelement(0, "div", 0, 1);
    } }, styles: [".d3-chart[_ngcontent-%COMP%]{width:100%;height:400px;margin:auto;background-color:rgba(189,185,181,.6156862745)}.d3-chart[_ngcontent-%COMP%]   .axis[_ngcontent-%COMP%]   line[_ngcontent-%COMP%], .d3-chart[_ngcontent-%COMP%]   .axis[_ngcontent-%COMP%]   path[_ngcontent-%COMP%]{stroke:#999}.d3-chart[_ngcontent-%COMP%]   .axis[_ngcontent-%COMP%]   text[_ngcontent-%COMP%]{fill:#999}body[_ngcontent-%COMP%]{font-family:Open Sans,sans-serif}div#layout[_ngcontent-%COMP%]{text-align:center}svg[_ngcontent-%COMP%]{width:100%;height:100%}.bar[_ngcontent-%COMP%]{fill:#be7d27}text[_ngcontent-%COMP%]{font-size:8px!important;fill:#fff}line[_ngcontent-%COMP%], path[_ngcontent-%COMP%]{stroke:grey}line#limit[_ngcontent-%COMP%]{stroke:#fed966;stroke-width:3;stroke-dasharray:3 6}.grid[_ngcontent-%COMP%]   path[_ngcontent-%COMP%]{stroke-width:0}.grid[_ngcontent-%COMP%]   .tick[_ngcontent-%COMP%]   line[_ngcontent-%COMP%]{stroke:#9faaae;stroke-opacity:.3}text.divergence[_ngcontent-%COMP%]{font-size:12px;fill:#2f4a6d}.bars.value[_ngcontent-%COMP%]{font-size:8px!important;z-index:132132132}text.title[_ngcontent-%COMP%]{font-size:22px;font-weight:600}text.label[_ngcontent-%COMP%]{font-weight:400}text.label[_ngcontent-%COMP%], text.source[_ngcontent-%COMP%]{font-size:8px!important}"] });
/** @nocollapse */
DatagraphComponent.ctorParameters = () => [];
DatagraphComponent.propDecorators = {
    chartContainer: [{ type: ViewChild, args: ['chart', { static: true },] }],
    data: [{ type: Input }],
    type: [{ type: Input }]
};
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(DatagraphComponent, [{
        type: Component,
        args: [{
                selector: 'app-datagraph',
                template: "<div class=\"d3-chart\" #chart></div>",
                styles: [".d3-chart{width:100%;height:400px;margin:auto;background-color:rgba(189,185,181,.6156862745)}.d3-chart .axis line,.d3-chart .axis path{stroke:#999}.d3-chart .axis text{fill:#999}body{font-family:Open Sans,sans-serif}div#layout{text-align:center}svg{width:100%;height:100%}.bar{fill:#be7d27}text{font-size:8px!important;fill:#fff}line,path{stroke:grey}line#limit{stroke:#fed966;stroke-width:3;stroke-dasharray:3 6}.grid path{stroke-width:0}.grid .tick line{stroke:#9faaae;stroke-opacity:.3}text.divergence{font-size:12px;fill:#2f4a6d}.bars.value{font-size:8px!important;z-index:132132132}text.title{font-size:22px;font-weight:600}text.label{font-weight:400}text.label,text.source{font-size:8px!important}"]
            }]
    }], function () { return []; }, { chartContainer: [{
            type: ViewChild,
            args: ['chart', { static: true }]
        }], data: [{
            type: Input
        }], type: [{
            type: Input
        }] }); })();

registerLocaleData(localeCa, 'ca');
registerLocaleData(localeEs, 'es');
/** Load translation assets */
function createTranslateLoader(http) {
    return new TranslateHttpLoader(http, '../assets/i18n/', '.json');
}
const ɵ0 = (createTranslateLoader);
/** SITMUN plugin core module */
class SitmunFrontendGuiModule {
}
SitmunFrontendGuiModule.ɵmod = ɵngcc0.ɵɵdefineNgModule({ type: SitmunFrontendGuiModule });
SitmunFrontendGuiModule.ɵinj = ɵngcc0.ɵɵdefineInjector({ factory: function SitmunFrontendGuiModule_Factory(t) { return new (t || SitmunFrontendGuiModule)(); }, providers: [], imports: [[
            RouterModule,
            HttpClientModule,
            CommonModule,
            FormsModule,
            NoopAnimationsModule,
            AngularHalModule,
            ReactiveFormsModule,
            BrowserAnimationsModule,
            AgGridModule,
            SitmunFrontendCoreModule,
            MaterialModule,
            TranslateModule.forRoot({
                loader: {
                    provide: TranslateLoader,
                    useFactory: ɵ0,
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
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && ɵngcc0.ɵɵsetNgModuleScope(SitmunFrontendGuiModule, { declarations: function () { return [DataGridComponent, DataTreeComponent, BtnEditRenderedComponent, BtnCheckboxRenderedComponent, BtnCheckboxFilterComponent, DialogGridComponent, DialogFormComponent, DialogMessageComponent, DialogTranslationComponent, DatagraphComponent]; }, imports: function () { return [RouterModule,
        HttpClientModule,
        CommonModule,
        FormsModule,
        NoopAnimationsModule,
        AngularHalModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        AgGridModule,
        SitmunFrontendCoreModule, MaterialModule, ɵngcc5.TranslateModule]; }, exports: function () { return [HttpClientModule,
        CommonModule,
        FormsModule,
        NoopAnimationsModule,
        AngularHalModule,
        TranslateModule,
        ReactiveFormsModule, DataGridComponent, DataTreeComponent, DialogGridComponent, DialogFormComponent, DialogMessageComponent, DialogTranslationComponent, DatagraphComponent, SitmunFrontendCoreModule]; } }); })();
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(SitmunFrontendGuiModule, [{
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
                    AgGridModule,
                    SitmunFrontendCoreModule,
                    MaterialModule,
                    TranslateModule.forRoot({
                        loader: {
                            provide: TranslateLoader,
                            useFactory: ɵ0,
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
                    DialogTranslationComponent,
                    DatagraphComponent
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
                    DialogTranslationComponent,
                    DatagraphComponent,
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

export { BtnCheckboxFilterComponent, BtnCheckboxRenderedComponent, BtnEditRenderedComponent, DataGridComponent, DataTreeComponent, DatagraphComponent, DialogFormComponent, DialogGridComponent, DialogMessageComponent, DialogTranslationComponent, FileDatabase, FileFlatNode, FileNode, SitmunFrontendGuiModule, createTranslateLoader, ɵ0, MaterialModule as ɵa };

//# sourceMappingURL=sitmun-frontend-gui.js.map