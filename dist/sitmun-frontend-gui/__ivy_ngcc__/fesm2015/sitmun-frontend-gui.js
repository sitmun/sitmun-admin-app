import { Component, ViewChild, ViewContainerRef, EventEmitter, Input, Output, NgModule, Injectable } from '@angular/core';
import { Subject, BehaviorSubject, of } from 'rxjs';
import { AllCommunityModules } from '@ag-grid-community/all-modules';
import { TranslateService, TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { MatDialogRef, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { MatIconModule } from '@angular/material/icon';
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
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
import * as ɵngcc10 from '@angular/material/tree';

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
    ɵngcc0.ɵɵelement(0, "span", 17);
} if (rf & 2) {
    const ctx_r0 = ɵngcc0.ɵɵnextContext();
    ɵngcc0.ɵɵproperty("translate", ctx_r0.title);
} }
function DataGridComponent_button_2_Template(rf, ctx) { if (rf & 1) {
    const _r16 = ɵngcc0.ɵɵgetCurrentView();
    ɵngcc0.ɵɵelementStart(0, "button", 18);
    ɵngcc0.ɵɵlistener("click", function DataGridComponent_button_2_Template_button_click_0_listener() { ɵngcc0.ɵɵrestoreView(_r16); const ctx_r15 = ɵngcc0.ɵɵnextContext(); return ctx_r15.deleteChanges(); });
    ɵngcc0.ɵɵpipe(1, "translate");
    ɵngcc0.ɵɵelementStart(2, "mat-icon", 19);
    ɵngcc0.ɵɵtext(3, " close ");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = ɵngcc0.ɵɵnextContext();
    ɵngcc0.ɵɵpropertyInterpolate("title", ɵngcc0.ɵɵpipeBind1(1, 2, "cancel"));
    ɵngcc0.ɵɵproperty("disabled", ctx_r1.changeCounter <= 0);
} }
function DataGridComponent_button_3_Template(rf, ctx) { if (rf & 1) {
    const _r18 = ɵngcc0.ɵɵgetCurrentView();
    ɵngcc0.ɵɵelementStart(0, "button", 20);
    ɵngcc0.ɵɵlistener("click", function DataGridComponent_button_3_Template_button_click_0_listener() { ɵngcc0.ɵɵrestoreView(_r18); const ctx_r17 = ɵngcc0.ɵɵnextContext(); return ctx_r17.undo(); });
    ɵngcc0.ɵɵpipe(1, "translate");
    ɵngcc0.ɵɵelementStart(2, "mat-icon", 19);
    ɵngcc0.ɵɵtext(3, " undo ");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = ɵngcc0.ɵɵnextContext();
    ɵngcc0.ɵɵpropertyInterpolate("title", ɵngcc0.ɵɵpipeBind1(1, 2, "undo"));
    ɵngcc0.ɵɵproperty("disabled", ctx_r2.changeCounter <= 0);
} }
function DataGridComponent_button_4_Template(rf, ctx) { if (rf & 1) {
    const _r20 = ɵngcc0.ɵɵgetCurrentView();
    ɵngcc0.ɵɵelementStart(0, "button", 21);
    ɵngcc0.ɵɵlistener("click", function DataGridComponent_button_4_Template_button_click_0_listener() { ɵngcc0.ɵɵrestoreView(_r20); const ctx_r19 = ɵngcc0.ɵɵnextContext(); return ctx_r19.redo(); });
    ɵngcc0.ɵɵpipe(1, "translate");
    ɵngcc0.ɵɵelementStart(2, "mat-icon", 19);
    ɵngcc0.ɵɵtext(3, " redo ");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r3 = ɵngcc0.ɵɵnextContext();
    ɵngcc0.ɵɵpropertyInterpolate("title", ɵngcc0.ɵɵpipeBind1(1, 2, "redo"));
    ɵngcc0.ɵɵproperty("disabled", ctx_r3.redoCounter <= 0);
} }
function DataGridComponent_button_5_Template(rf, ctx) { if (rf & 1) {
    const _r22 = ɵngcc0.ɵɵgetCurrentView();
    ɵngcc0.ɵɵelementStart(0, "button", 22);
    ɵngcc0.ɵɵlistener("click", function DataGridComponent_button_5_Template_button_click_0_listener() { ɵngcc0.ɵɵrestoreView(_r22); const ctx_r21 = ɵngcc0.ɵɵnextContext(); return ctx_r21.applyChanges(); });
    ɵngcc0.ɵɵpipe(1, "translate");
    ɵngcc0.ɵɵelementStart(2, "mat-icon", 19);
    ɵngcc0.ɵɵtext(3, " check ");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r4 = ɵngcc0.ɵɵnextContext();
    ɵngcc0.ɵɵpropertyInterpolate("title", ɵngcc0.ɵɵpipeBind1(1, 2, "accept"));
    ɵngcc0.ɵɵproperty("disabled", ctx_r4.changeCounter <= 0);
} }
function DataGridComponent_label_7_Template(rf, ctx) { if (rf & 1) {
    ɵngcc0.ɵɵelement(0, "label", 17);
} if (rf & 2) {
    ɵngcc0.ɵɵproperty("translate", "search");
} }
function DataGridComponent_input_8_Template(rf, ctx) { if (rf & 1) {
    const _r24 = ɵngcc0.ɵɵgetCurrentView();
    ɵngcc0.ɵɵelementStart(0, "input", 23);
    ɵngcc0.ɵɵlistener("keyup", function DataGridComponent_input_8_Template_input_keyup_0_listener() { ɵngcc0.ɵɵrestoreView(_r24); const ctx_r23 = ɵngcc0.ɵɵnextContext(); return ctx_r23.quickSearch(); })("ngModelChange", function DataGridComponent_input_8_Template_input_ngModelChange_0_listener($event) { ɵngcc0.ɵɵrestoreView(_r24); const ctx_r25 = ɵngcc0.ɵɵnextContext(); return ctx_r25.searchValue = $event; });
    ɵngcc0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r6 = ɵngcc0.ɵɵnextContext();
    ɵngcc0.ɵɵproperty("ngModel", ctx_r6.searchValue);
} }
function DataGridComponent_button_9_Template(rf, ctx) { if (rf & 1) {
    const _r27 = ɵngcc0.ɵɵgetCurrentView();
    ɵngcc0.ɵɵelementStart(0, "button", 24);
    ɵngcc0.ɵɵlistener("click", function DataGridComponent_button_9_Template_button_click_0_listener() { ɵngcc0.ɵɵrestoreView(_r27); const ctx_r26 = ɵngcc0.ɵɵnextContext(); return ctx_r26.removeData(); });
    ɵngcc0.ɵɵelementStart(1, "mat-icon", 19);
    ɵngcc0.ɵɵtext(2, " delete ");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelement(3, "span", 17);
    ɵngcc0.ɵɵelementEnd();
} if (rf & 2) {
    ɵngcc0.ɵɵadvance(3);
    ɵngcc0.ɵɵproperty("translate", "remove");
} }
function DataGridComponent_button_10_Template(rf, ctx) { if (rf & 1) {
    ɵngcc0.ɵɵelementStart(0, "button", 25);
    ɵngcc0.ɵɵelement(1, "span", 17);
    ɵngcc0.ɵɵelementStart(2, "mat-icon", 19);
    ɵngcc0.ɵɵtext(3, " keyboard_arrow_down ");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementEnd();
} if (rf & 2) {
    ɵngcc0.ɵɵnextContext();
    const _r9 = ɵngcc0.ɵɵreference(12);
    ɵngcc0.ɵɵproperty("matMenuTriggerFor", _r9);
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵproperty("translate", "actions");
} }
function DataGridComponent_button_13_Template(rf, ctx) { if (rf & 1) {
    const _r29 = ɵngcc0.ɵɵgetCurrentView();
    ɵngcc0.ɵɵelementStart(0, "button", 26);
    ɵngcc0.ɵɵlistener("click", function DataGridComponent_button_13_Template_button_click_0_listener() { ɵngcc0.ɵɵrestoreView(_r29); const ctx_r28 = ɵngcc0.ɵɵnextContext(); return ctx_r28.exportData(); });
    ɵngcc0.ɵɵtext(1);
    ɵngcc0.ɵɵpipe(2, "translate");
    ɵngcc0.ɵɵelementEnd();
} if (rf & 2) {
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵtextInterpolate1(" ", ɵngcc0.ɵɵpipeBind1(2, 1, "export"), " ");
} }
function DataGridComponent_button_14_Template(rf, ctx) { if (rf & 1) {
    const _r31 = ɵngcc0.ɵɵgetCurrentView();
    ɵngcc0.ɵɵelementStart(0, "button", 26);
    ɵngcc0.ɵɵlistener("click", function DataGridComponent_button_14_Template_button_click_0_listener() { ɵngcc0.ɵɵrestoreView(_r31); const ctx_r30 = ɵngcc0.ɵɵnextContext(); return ctx_r30.onDuplicateButtonClicked(); });
    ɵngcc0.ɵɵtext(1);
    ɵngcc0.ɵɵpipe(2, "translate");
    ɵngcc0.ɵɵelementEnd();
} if (rf & 2) {
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵtextInterpolate1(" ", ɵngcc0.ɵɵpipeBind1(2, 1, "duplicate"), "");
} }
function DataGridComponent_button_15_Template(rf, ctx) { if (rf & 1) {
    ɵngcc0.ɵɵelementStart(0, "button", 27);
    ɵngcc0.ɵɵtext(1);
    ɵngcc0.ɵɵpipe(2, "translate");
    ɵngcc0.ɵɵelementEnd();
} if (rf & 2) {
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵtextInterpolate1(" ", ɵngcc0.ɵɵpipeBind1(2, 1, "search/replace"), "");
} }
function DataGridComponent_button_16_Template(rf, ctx) { if (rf & 1) {
    const _r33 = ɵngcc0.ɵɵgetCurrentView();
    ɵngcc0.ɵɵelementStart(0, "button", 28);
    ɵngcc0.ɵɵlistener("click", function DataGridComponent_button_16_Template_button_click_0_listener() { ɵngcc0.ɵɵrestoreView(_r33); const ctx_r32 = ɵngcc0.ɵɵnextContext(); return ctx_r32.newData(); });
    ɵngcc0.ɵɵelementStart(1, "mat-icon", 19);
    ɵngcc0.ɵɵtext(2, " add_circle_outline ");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelement(3, "span", 17);
    ɵngcc0.ɵɵelementEnd();
} if (rf & 2) {
    ɵngcc0.ɵɵadvance(3);
    ɵngcc0.ɵɵproperty("translate", "new");
} }
function DataGridComponent_button_17_Template(rf, ctx) { if (rf & 1) {
    const _r35 = ɵngcc0.ɵɵgetCurrentView();
    ɵngcc0.ɵɵelementStart(0, "button", 28);
    ɵngcc0.ɵɵlistener("click", function DataGridComponent_button_17_Template_button_click_0_listener() { ɵngcc0.ɵɵrestoreView(_r35); const ctx_r34 = ɵngcc0.ɵɵnextContext(); return ctx_r34.onAddButtonClicked(); });
    ɵngcc0.ɵɵelementStart(1, "mat-icon", 19);
    ɵngcc0.ɵɵtext(2, " add_circle_outline ");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelement(3, "span", 17);
    ɵngcc0.ɵɵelementEnd();
} if (rf & 2) {
    ɵngcc0.ɵɵadvance(3);
    ɵngcc0.ɵɵproperty("translate", "add");
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
    ɵngcc0.ɵɵproperty("ngStyle", ɵngcc0.ɵɵpureFunction1(9, _c1, i_r2 > 0 ? "100px" : "0px"));
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵproperty("columnDefs", ctx_r0.columnDefsTable[i_r2])("themeGrid", ctx_r0.themeGrid)("getAll", getAll_r1)("globalSearch", true)("singleSelection", ctx_r0.singleSelectionTable[i_r2])("title", ctx_r0.titlesTable[i_r2])("nonEditable", ctx_r0.nonEditable)("eventGetSelectedRowsSubscription", ctx_r0.getAllRows.asObservable());
} }
function DialogFormComponent_ng_container_3_Template(rf, ctx) { if (rf & 1) {
    ɵngcc0.ɵɵelementContainer(0);
} }
const _c2 = ["emptyItem"];
function DataTreeComponent_mat_tree_node_1_mat_icon_2_Template(rf, ctx) { if (rf & 1) {
    ɵngcc0.ɵɵelementStart(0, "mat-icon", 9);
    ɵngcc0.ɵɵtext(1, " folder ");
    ɵngcc0.ɵɵelementEnd();
} if (rf & 2) {
    const node_r3 = ɵngcc0.ɵɵnextContext().$implicit;
    ɵngcc0.ɵɵattribute("aria-label", node_r3.type + "icon");
} }
function DataTreeComponent_mat_tree_node_1_button_4_Template(rf, ctx) { if (rf & 1) {
    const _r10 = ɵngcc0.ɵɵgetCurrentView();
    ɵngcc0.ɵɵelementStart(0, "button", 8);
    ɵngcc0.ɵɵlistener("click", function DataTreeComponent_mat_tree_node_1_button_4_Template_button_click_0_listener() { ɵngcc0.ɵɵrestoreView(_r10); const node_r3 = ɵngcc0.ɵɵnextContext().$implicit; const ctx_r8 = ɵngcc0.ɵɵnextContext(); return ctx_r8.onButtonClicked(node_r3.id, "newFolder"); });
    ɵngcc0.ɵɵelementStart(1, "mat-icon");
    ɵngcc0.ɵɵtext(2, "create_new_folder");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementEnd();
} }
function DataTreeComponent_mat_tree_node_1_button_5_Template(rf, ctx) { if (rf & 1) {
    const _r13 = ɵngcc0.ɵɵgetCurrentView();
    ɵngcc0.ɵɵelementStart(0, "button", 8);
    ɵngcc0.ɵɵlistener("click", function DataTreeComponent_mat_tree_node_1_button_5_Template_button_click_0_listener() { ɵngcc0.ɵɵrestoreView(_r13); const node_r3 = ɵngcc0.ɵɵnextContext().$implicit; const ctx_r11 = ɵngcc0.ɵɵnextContext(); return ctx_r11.onButtonClicked(node_r3.id, "newNode"); });
    ɵngcc0.ɵɵelementStart(1, "mat-icon");
    ɵngcc0.ɵɵtext(2, "playlist_add");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementEnd();
} }
const _c3 = function (a0, a1, a2) { return { "drop-above": a0, "drop-below": a1, "drop-center": a2 }; };
function DataTreeComponent_mat_tree_node_1_Template(rf, ctx) { if (rf & 1) {
    const _r15 = ɵngcc0.ɵɵgetCurrentView();
    ɵngcc0.ɵɵelementStart(0, "mat-tree-node", 4);
    ɵngcc0.ɵɵlistener("dragstart", function DataTreeComponent_mat_tree_node_1_Template_mat_tree_node_dragstart_0_listener($event) { ɵngcc0.ɵɵrestoreView(_r15); const node_r3 = ctx.$implicit; const ctx_r14 = ɵngcc0.ɵɵnextContext(); return ctx_r14.handleDragStart($event, node_r3); })("dragover", function DataTreeComponent_mat_tree_node_1_Template_mat_tree_node_dragover_0_listener($event) { ɵngcc0.ɵɵrestoreView(_r15); const node_r3 = ctx.$implicit; const ctx_r16 = ɵngcc0.ɵɵnextContext(); return ctx_r16.handleDragOver($event, node_r3); })("drop", function DataTreeComponent_mat_tree_node_1_Template_mat_tree_node_drop_0_listener($event) { ɵngcc0.ɵɵrestoreView(_r15); const node_r3 = ctx.$implicit; const ctx_r17 = ɵngcc0.ɵɵnextContext(); return ctx_r17.handleDrop($event, node_r3); })("dragend", function DataTreeComponent_mat_tree_node_1_Template_mat_tree_node_dragend_0_listener($event) { ɵngcc0.ɵɵrestoreView(_r15); const ctx_r18 = ɵngcc0.ɵɵnextContext(); return ctx_r18.handleDragEnd($event); });
    ɵngcc0.ɵɵelement(1, "button", 5);
    ɵngcc0.ɵɵtemplate(2, DataTreeComponent_mat_tree_node_1_mat_icon_2_Template, 2, 1, "mat-icon", 6);
    ɵngcc0.ɵɵtext(3);
    ɵngcc0.ɵɵtemplate(4, DataTreeComponent_mat_tree_node_1_button_4_Template, 3, 0, "button", 7);
    ɵngcc0.ɵɵtemplate(5, DataTreeComponent_mat_tree_node_1_button_5_Template, 3, 0, "button", 7);
    ɵngcc0.ɵɵelementStart(6, "button", 8);
    ɵngcc0.ɵɵlistener("click", function DataTreeComponent_mat_tree_node_1_Template_button_click_6_listener() { ɵngcc0.ɵɵrestoreView(_r15); const node_r3 = ctx.$implicit; const ctx_r19 = ɵngcc0.ɵɵnextContext(); return ctx_r19.onButtonClicked(node_r3.id, "delete"); });
    ɵngcc0.ɵɵelementStart(7, "mat-icon");
    ɵngcc0.ɵɵtext(8, "delete");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(9, "button", 8);
    ɵngcc0.ɵɵlistener("click", function DataTreeComponent_mat_tree_node_1_Template_button_click_9_listener() { ɵngcc0.ɵɵrestoreView(_r15); const node_r3 = ctx.$implicit; const ctx_r20 = ɵngcc0.ɵɵnextContext(); return ctx_r20.onButtonClicked(node_r3.id, "edit"); });
    ɵngcc0.ɵɵelementStart(10, "mat-icon");
    ɵngcc0.ɵɵtext(11, "edit");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementEnd();
} if (rf & 2) {
    const node_r3 = ctx.$implicit;
    const ctx_r0 = ɵngcc0.ɵɵnextContext();
    ɵngcc0.ɵɵproperty("ngClass", ɵngcc0.ɵɵpureFunction3(5, _c3, ctx_r0.dragNodeExpandOverArea === "above" && ctx_r0.dragNodeExpandOverNode === node_r3, ctx_r0.dragNodeExpandOverArea === "below" && ctx_r0.dragNodeExpandOverNode === node_r3, ctx_r0.dragNodeExpandOverArea === "center" && ctx_r0.dragNodeExpandOverNode === node_r3));
    ɵngcc0.ɵɵadvance(2);
    ɵngcc0.ɵɵproperty("ngIf", node_r3.type === "folder");
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵtextInterpolate1(" ", node_r3.name, " ");
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵproperty("ngIf", node_r3.type === "folder");
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵproperty("ngIf", node_r3.type === "folder");
} }
function DataTreeComponent_mat_tree_node_2_button_7_Template(rf, ctx) { if (rf & 1) {
    const _r26 = ɵngcc0.ɵɵgetCurrentView();
    ɵngcc0.ɵɵelementStart(0, "button", 8);
    ɵngcc0.ɵɵlistener("click", function DataTreeComponent_mat_tree_node_2_button_7_Template_button_click_0_listener() { ɵngcc0.ɵɵrestoreView(_r26); const node_r21 = ɵngcc0.ɵɵnextContext().$implicit; const ctx_r24 = ɵngcc0.ɵɵnextContext(); return ctx_r24.onButtonClicked(node_r21.id, "newFolder"); });
    ɵngcc0.ɵɵelementStart(1, "mat-icon");
    ɵngcc0.ɵɵtext(2, "create_new_folder");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementEnd();
} }
function DataTreeComponent_mat_tree_node_2_button_8_Template(rf, ctx) { if (rf & 1) {
    const _r29 = ɵngcc0.ɵɵgetCurrentView();
    ɵngcc0.ɵɵelementStart(0, "button", 8);
    ɵngcc0.ɵɵlistener("click", function DataTreeComponent_mat_tree_node_2_button_8_Template_button_click_0_listener() { ɵngcc0.ɵɵrestoreView(_r29); const node_r21 = ɵngcc0.ɵɵnextContext().$implicit; const ctx_r27 = ɵngcc0.ɵɵnextContext(); return ctx_r27.onButtonClicked(node_r21.id, "newNode"); });
    ɵngcc0.ɵɵelementStart(1, "mat-icon");
    ɵngcc0.ɵɵtext(2, "playlist_add");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementEnd();
} }
function DataTreeComponent_mat_tree_node_2_Template(rf, ctx) { if (rf & 1) {
    const _r31 = ɵngcc0.ɵɵgetCurrentView();
    ɵngcc0.ɵɵelementStart(0, "mat-tree-node", 10);
    ɵngcc0.ɵɵlistener("dragstart", function DataTreeComponent_mat_tree_node_2_Template_mat_tree_node_dragstart_0_listener($event) { ɵngcc0.ɵɵrestoreView(_r31); const node_r21 = ctx.$implicit; const ctx_r30 = ɵngcc0.ɵɵnextContext(); return ctx_r30.handleDragStart($event, node_r21); })("dragover", function DataTreeComponent_mat_tree_node_2_Template_mat_tree_node_dragover_0_listener($event) { ɵngcc0.ɵɵrestoreView(_r31); const node_r21 = ctx.$implicit; const ctx_r32 = ɵngcc0.ɵɵnextContext(); return ctx_r32.handleDragOver($event, node_r21); })("drop", function DataTreeComponent_mat_tree_node_2_Template_mat_tree_node_drop_0_listener($event) { ɵngcc0.ɵɵrestoreView(_r31); const node_r21 = ctx.$implicit; const ctx_r33 = ɵngcc0.ɵɵnextContext(); return ctx_r33.handleDrop($event, node_r21); })("dragend", function DataTreeComponent_mat_tree_node_2_Template_mat_tree_node_dragend_0_listener($event) { ɵngcc0.ɵɵrestoreView(_r31); const ctx_r34 = ɵngcc0.ɵɵnextContext(); return ctx_r34.handleDragEnd($event); });
    ɵngcc0.ɵɵelementStart(1, "button", 11);
    ɵngcc0.ɵɵlistener("click", function DataTreeComponent_mat_tree_node_2_Template_button_click_1_listener() { ɵngcc0.ɵɵrestoreView(_r31); const node_r21 = ctx.$implicit; const ctx_r35 = ɵngcc0.ɵɵnextContext(); return ctx_r35.expansionModel.toggle(node_r21.id); });
    ɵngcc0.ɵɵelementStart(2, "mat-icon", 12);
    ɵngcc0.ɵɵtext(3);
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(4, "mat-icon", 9);
    ɵngcc0.ɵɵtext(5, " folder ");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵtext(6);
    ɵngcc0.ɵɵtemplate(7, DataTreeComponent_mat_tree_node_2_button_7_Template, 3, 0, "button", 7);
    ɵngcc0.ɵɵtemplate(8, DataTreeComponent_mat_tree_node_2_button_8_Template, 3, 0, "button", 7);
    ɵngcc0.ɵɵelementStart(9, "button", 8);
    ɵngcc0.ɵɵlistener("click", function DataTreeComponent_mat_tree_node_2_Template_button_click_9_listener() { ɵngcc0.ɵɵrestoreView(_r31); const node_r21 = ctx.$implicit; const ctx_r36 = ɵngcc0.ɵɵnextContext(); return ctx_r36.onButtonClicked(node_r21.id, "delete"); });
    ɵngcc0.ɵɵelementStart(10, "mat-icon");
    ɵngcc0.ɵɵtext(11, "delete");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(12, "button", 8);
    ɵngcc0.ɵɵlistener("click", function DataTreeComponent_mat_tree_node_2_Template_button_click_12_listener() { ɵngcc0.ɵɵrestoreView(_r31); const node_r21 = ctx.$implicit; const ctx_r37 = ɵngcc0.ɵɵnextContext(); return ctx_r37.onButtonClicked(node_r21.id, "edit"); });
    ɵngcc0.ɵɵelementStart(13, "mat-icon");
    ɵngcc0.ɵɵtext(14, "edit");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementEnd();
} if (rf & 2) {
    const node_r21 = ctx.$implicit;
    const ctx_r1 = ɵngcc0.ɵɵnextContext();
    ɵngcc0.ɵɵproperty("ngClass", ɵngcc0.ɵɵpureFunction3(7, _c3, ctx_r1.dragNodeExpandOverArea === "above" && ctx_r1.dragNodeExpandOverNode === node_r21, ctx_r1.dragNodeExpandOverArea === "below" && ctx_r1.dragNodeExpandOverNode === node_r21, ctx_r1.dragNodeExpandOverArea === "center" && ctx_r1.dragNodeExpandOverNode === node_r21));
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵattribute("aria-label", "toggle " + node_r21.name);
    ɵngcc0.ɵɵadvance(2);
    ɵngcc0.ɵɵtextInterpolate1(" ", ctx_r1.treeControl.isExpanded(node_r21) ? "expand_more" : "chevron_right", " ");
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵattribute("aria-label", node_r21.type + "icon");
    ɵngcc0.ɵɵadvance(2);
    ɵngcc0.ɵɵtextInterpolate1(" ", node_r21.name, " ");
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵproperty("ngIf", node_r21.type === "folder");
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵproperty("ngIf", node_r21.type === "folder");
} }
class BtnEditRenderedComponent {
    /**
     * @param {?} params
     * @return {?}
     */
    agInit(params) {
        this.params = params;
    }
    /**
     * @param {?} params
     * @return {?}
     */
    refresh(params) {
        return true;
    }
    /**
     * @param {?} $event
     * @return {?}
     */
    btnClickedHandler($event) {
        this.params.clicked(this.params.value);
    }
    /**
     * @return {?}
     */
    getParams() {
        return this.params;
    }
    /**
     * @return {?}
     */
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
    } }, directives: [ɵngcc1.MatButton, ɵngcc2.MatIcon], styles: [".buttonEdit[_ngcontent-%COMP%]{background-color:#ddd;box-shadow:none;color:#000;height:20px;margin-top:3px;width:20px}.iconEdit[_ngcontent-%COMP%]{font-size:13px;margin-left:-2px;margin-top:-10px}"] });
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(BtnEditRenderedComponent, [{
        type: Component,
        args: [{
                selector: 'app-btn-edit-rendered',
                template: "<button mat-mini-fab class=\"buttonEdit\"  type=\"button\"  (click)=\"btnClickedHandler($event)\" >\r\n  <mat-icon class=\"iconEdit\"   fontSet=\"material-icons-round\" > edit </mat-icon>\r\n</button> ",
                styles: [".buttonEdit{background-color:#ddd;box-shadow:none;color:#000;height:20px;margin-top:3px;width:20px}.iconEdit{font-size:13px;margin-left:-2px;margin-top:-10px}"]
            }]
    }], null, null); })();
if (false) {
    /** @type {?} */
    BtnEditRenderedComponent.prototype.params;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class BtnCheckboxRenderedComponent {
    /**
     * @param {?} params
     * @return {?}
     */
    agInit(params) {
        this.params = params;
    }
    /**
     * @param {?} params
     * @return {?}
     */
    refresh(params) {
        this.params = params;
        return true;
    }
    /**
     * @return {?}
     */
    invokeParentMethod() {
        this.params.context.componentParent.methodFromParent(`Row: ${this.params.node.rowIndex}, Col: ${this.params.colDef.headerName}`);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    btnCheckedHandler(event) {
        /** @type {?} */
        let checked = !event.target.firstElementChild.checked;
        /** @type {?} */
        let colId = this.params.column.colId;
        this.params.value = checked;
        this.params.api.undoRedoService.isFilling = true;
        this.params.node.setDataValue(colId, checked);
    }
    /**
     * @return {?}
     */
    getParams() {
        return this.params;
    }
    /**
     * @return {?}
     */
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
if (false) {
    /** @type {?} */
    BtnCheckboxRenderedComponent.prototype.params;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class BtnCheckboxFilterComponent {
    constructor() {
        this.text = '';
    }
    /**
     * @param {?} params
     * @return {?}
     */
    agInit(params) {
        this.params = params;
        this.valueGetter = params.filterParams.valueGetter;
        this.params.suppressFilterButton = true;
    }
    /**
     * @return {?}
     */
    isFilterActive() {
        return this.text != null && this.text !== '';
    }
    /**
     * @param {?} params
     * @return {?}
     */
    doesFilterPass(params) {
        return this.text
            .toLowerCase()
            .split(' ')
            .every((filterWord) => this.valueGetter(params.node)
            .toString()
            .toLowerCase()
            .indexOf(filterWord) >= 0);
    }
    /**
     * @return {?}
     */
    getModel() {
        return { value: this.text };
    }
    /**
     * @param {?} model
     * @return {?}
     */
    setModel(model) {
        this.text = model ? model.value : '';
    }
    /**
     * @param {?} newValue
     * @return {?}
     */
    onChange(newValue) {
        this.params.parentFilterInstance(function (instance) {
            instance.onFloatingFilterChanged('contains', newValue);
        });
    }
    /**
     * @param {?} parentModel
     * @return {?}
     */
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
if (false) {
    /** @type {?} */
    BtnCheckboxFilterComponent.prototype.params;
    /** @type {?} */
    BtnCheckboxFilterComponent.prototype.valueGetter;
    /** @type {?} */
    BtnCheckboxFilterComponent.prototype.text;
    /** @type {?} */
    BtnCheckboxFilterComponent.prototype.currentValue;
    /** @type {?} */
    BtnCheckboxFilterComponent.prototype.input;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class DialogMessageComponent {
    /**
     * @param {?} dialogRef
     */
    constructor(dialogRef) {
        this.dialogRef = dialogRef;
        this.hideCancelButton = false;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
    }
    /**
     * @return {?}
     */
    doAccept() {
        this.dialogRef.close({ event: 'Accept' });
    }
    /**
     * @return {?}
     */
    closeDialog() {
        this.dialogRef.close({ event: 'Cancel' });
    }
}
DialogMessageComponent.ɵfac = function DialogMessageComponent_Factory(t) { return new (t || DialogMessageComponent)(ɵngcc0.ɵɵdirectiveInject(ɵngcc6.MatDialogRef)); };
DialogMessageComponent.ɵcmp = ɵngcc0.ɵɵdefineComponent({ type: DialogMessageComponent, selectors: [["app-dialog-message"]], decls: 10, vars: 6, consts: [["mat-dialog-title", ""], [1, "mat-typography"], ["align", "end"], ["mat-flat-button", "", "class", "returnButton", 3, "click", 4, "ngIf"], ["mat-flat-button", "", "cdkFocusInitial", "", 1, "saveButton", 3, "click"], ["mat-flat-button", "", 1, "returnButton", 3, "click"]], template: function DialogMessageComponent_Template(rf, ctx) { if (rf & 1) {
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
    } }, directives: [ɵngcc6.MatDialogTitle, ɵngcc6.MatDialogContent, ɵngcc6.MatDialogActions, ɵngcc7.NgIf, ɵngcc1.MatButton], pipes: [ɵngcc5.TranslatePipe], styles: [""] });
/** @nocollapse */
DialogMessageComponent.ctorParameters = () => [
    { type: MatDialogRef }
];
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(DialogMessageComponent, [{
        type: Component,
        args: [{
                selector: 'app-dialog-message',
                template: "<h5 mat-dialog-title>{{title}}</h5>\r\n<mat-dialog-content class=\"mat-typography\">\r\n  <p>\r\n    {{message}}\r\n  </p>\r\n</mat-dialog-content>\r\n<mat-dialog-actions align=\"end\">\r\n  <button mat-flat-button class=\"returnButton\"  *ngIf=\"!hideCancelButton\" (click)=\"closeDialog()\">{{\"cancel\" | translate}}</button>\r\n  <button mat-flat-button class=\"saveButton\"  (click)=\"doAccept()\" cdkFocusInitial>{{\"accept\" | translate}}</button>\r\n</mat-dialog-actions>",
                styles: [""]
            }]
    }], function () { return [{ type: ɵngcc6.MatDialogRef }]; }, null); })();
if (false) {
    /** @type {?} */
    DialogMessageComponent.prototype.title;
    /** @type {?} */
    DialogMessageComponent.prototype.message;
    /** @type {?} */
    DialogMessageComponent.prototype.hideCancelButton;
    /** @type {?} */
    DialogMessageComponent.prototype.dialogRef;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class DataGridComponent {
    /**
     * @param {?} dialog
     * @param {?} translate
     */
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
                        /**
                         * @param {?} filterLocalDateAtMidnight
                         * @param {?} cellValue
                         * @return {?}
                         */
                        comparator(filterLocalDateAtMidnight, cellValue) {
                            /** @type {?} */
                            const dateCellValue = new Date(cellValue);
                            /** @type {?} */
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
                /** @type {?} */
                const data = this.translate.instant(key);
                return data === key ? defaultValue : data;
            }
        };
    }
    /**
     * @return {?}
     */
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
    /**
     * @return {?}
     */
    firstDataRendered() {
        if (localStorage["agGridState"] != undefined) {
            /** @type {?} */
            let agGridState = JSON.parse(localStorage["agGridState"]);
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
    /**
     * @param {?} params
     * @return {?}
     */
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
        if (this.defaultColumnSorting) {
            /** @type {?} */
            const sortModel = [
                { colId: this.defaultColumnSorting, sort: 'asc' }
            ];
            this.gridApi.setSortModel(sortModel);
        }
    }
    /**
     * @return {?}
     */
    areRowsSelected() {
        if (this.gridApi != null && this.gridApi.getSelectedNodes().length > 0) {
            return true;
        }
        else {
            return false;
        }
    }
    /**
     * @return {?}
     */
    emitSelectedRows() {
        /** @type {?} */
        const selectedNodes = this.gridApi.getSelectedNodes();
        /** @type {?} */
        const selectedData = selectedNodes.map(node => node.data);
        this.getSelectedRows.emit(selectedData);
    }
    /**
     * @return {?}
     */
    emitAllRows() {
        /** @type {?} */
        let rowData = [];
        this.gridApi.forEachNode(node => rowData.push(node.data));
        this.getAllRows.emit(rowData);
    }
    /**
     * @return {?}
     */
    saveAgGridState() {
        /** @type {?} */
        let agGridState = {
            idAgGrid: this.id,
            colState: this.gridColumnApi.getColumnState(),
            filterState: this.gridApi.getFilterModel(),
            sortState: this.gridApi.getSortModel(),
            valueSearchGeneric: this.searchValue
        };
        localStorage.setItem("agGridState", JSON.stringify(agGridState));
    }
    /**
     * @return {?}
     */
    removeAgGridState() {
        localStorage.removeItem("agGridState");
    }
    /**
     * @param {?} columnkeys
     * @return {?}
     */
    getColumnKeysAndHeaders(columnkeys) {
        /** @type {?} */
        let header = [];
        if (this.columnDefs.length == 0) {
            return '';
        }
        ;
        /** @type {?} */
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
    /**
     * @return {?}
     */
    exportData() {
        /** @type {?} */
        let columnkeys = [];
        /** @type {?} */
        let customHeader = '';
        customHeader = this.getColumnKeysAndHeaders(columnkeys);
        /** @type {?} */
        let params = {
            onlySelected: true,
            columnKeys: columnkeys,
            customHeader: customHeader,
            skipHeader: true
        };
        this.gridApi.exportDataAsCsv(params);
    }
    /**
     * @return {?}
     */
    quickSearch() {
        this.gridApi.setQuickFilter(this.searchValue);
    }
    /**
     * @return {?}
     */
    getElements() {
        this.getAll()
            .subscribe((items) => {
            this.rowData = items;
            this.gridApi.setRowData(this.rowData);
            this.gridApi.sizeColumnsToFit();
            console.log(this.rowData);
        });
    }
    /**
     * @param {?} newItems
     * @return {?}
     */
    addItems(newItems) {
        console.log(newItems);
        /** @type {?} */
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
    /**
     * @return {?}
     */
    removeData() {
        this.gridApi.stopEditing(false);
        /** @type {?} */
        const selectedNodes = this.gridApi.getSelectedNodes();
        /** @type {?} */
        const selectedData = selectedNodes.map(node => node.data);
        this.remove.emit(selectedData);
        if (this.statusColumn) {
            /** @type {?} */
            const selectedRows = selectedNodes.map(node => node.id);
            for (const id of selectedRows) {
                this.gridApi.getRowNode(id).data.status = 'Deleted';
            }
            this.gridOptions.api.refreshCells();
        }
        this.gridOptions.api.deselectAll();
    }
    /**
     * @return {?}
     */
    newData() {
        this.gridApi.stopEditing(false);
        this.new.emit(-1);
    }
    /**
     * @return {?}
     */
    onAddButtonClicked() {
        this.gridApi.stopEditing(false);
        this.add.emit(-1);
    }
    /**
     * @return {?}
     */
    onDuplicateButtonClicked() {
        this.gridApi.stopEditing(false);
        console.log(this.changeCounter);
        if (this.changeCounter > 0) {
            /** @type {?} */
            const dialogRef = this.dialog.open(DialogMessageComponent);
            dialogRef.componentInstance.title = this.translate.instant('caution');
            dialogRef.componentInstance.message = this.translate.instant('duplicateMessage');
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    if (result.event === 'Accept') {
                        /** @type {?} */
                        const selectedNodes = this.gridApi.getSelectedNodes();
                        /** @type {?} */
                        const selectedData = selectedNodes.map(node => node.data);
                        this.duplicate.emit(selectedData);
                    }
                }
            });
        }
        else {
            /** @type {?} */
            const selectedNodes = this.gridApi.getSelectedNodes();
            /** @type {?} */
            const selectedData = selectedNodes.map(node => node.data);
            this.duplicate.emit(selectedData);
        }
    }
    /**
     * @return {?}
     */
    applyChanges() {
        /** @type {?} */
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
    /**
     * @return {?}
     */
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
    /**
     * @return {?}
     */
    onFilterModified() {
        this.deleteChanges();
    }
    /**
     * @return {?}
     */
    undo() {
        this.gridApi.stopEditing(false);
        this.gridApi.undoCellEditing();
        this.changeCounter -= 1;
        this.redoCounter += 1;
    }
    /**
     * @return {?}
     */
    redo() {
        this.gridApi.stopEditing(false);
        this.gridApi.redoCellEditing();
        this.changeCounter += 1;
        this.redoCounter -= 1;
    }
    /**
     * @param {?} e
     * @return {?}
     */
    onCellEditingStopped(e) {
        if (this.modificationChange) {
            this.changeCounter++;
            this.redoCounter = 0;
            this.onCellValueChanged(e);
            this.modificationChange = false;
        }
    }
    /**
     * @param {?} params
     * @return {?}
     */
    onCellValueChanged(params) {
        console.log("value Change");
        this.params = params;
        if (this.changeCounter > this.previousChangeCounter) {
            if (params.oldValue !== params.value && !(params.oldValue == null && params.value === '')) {
                if (!this.changesMap.has(params.node.id)) // If it's firts edit of a cell, we add it to the map and we paint it
                 {
                    /** @type {?} */
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
                        /** @type {?} */
                        const currentChanges = this.changesMap.get(params.node.id).get(params.colDef.field);
                        this.changesMap.get(params.node.id).set(params.colDef.field, (currentChanges + 1));
                    }
                }
                this.paintCells(params, this.changesMap); //We paint the row of the edited cell
                this.previousChangeCounter++; //We match the current previousChangeCounter with changeCounter
            }
        }
        else if (this.changeCounter < this.previousChangeCounter) { // True if we have done an undo
            /** @type {?} */
            let currentChanges = -1;
            if (this.changesMap.has(params.node.id)) {
                currentChanges = this.changesMap.get(params.node.id).get(params.colDef.field);
            }
            if (currentChanges === 1) { //Once the undo it's done, cell is in his initial status
                //Once the undo it's done, cell is in his initial status
                this.changesMap.get(params.node.id).delete(params.colDef.field);
                if (this.changesMap.get(params.node.id).size === 0) { // No more modifications in this row
                    // No more modifications in this row
                    this.changesMap.delete(params.node.id);
                    /** @type {?} */
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
                //We can't do else because we can be doing an undo without changes
                this.changesMap.get(params.node.id).set(params.colDef.field, (currentChanges - 1));
                this.paintCells(params, this.changesMap); //Not initial state -> green background
            }
            this.previousChangeCounter--; //We decrement previousChangeCounter because we have done undo
        }
        else { // Control of modifications without changes
            // Control of modifications without changes
            if (!(params.oldValue == null && params.value === '')) {
                /** @type {?} */
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
                        /** @type {?} */
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
    /**
     * @param {?} params
     * @return {?}
     */
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
    /**
     * @param {?} api
     * @param {?} colId
     * @return {?}
     */
    getColumnIndexByColId(api, colId) {
        return api.getAllColumns().findIndex(col => col.getColId() === colId);
    }
    /**
     * @param {?} params
     * @param {?} changesMap
     * @return {?}
     */
    paintCells(params, changesMap) {
        /** @type {?} */
        const row = this.gridApi.getDisplayedRowAtIndex(params.rowIndex);
        this.changeCellStyleColumns(params, changesMap, '#E8F1DE');
        this.gridApi.redrawRows({ rowNodes: [row] });
        this.changeCellStyleColumns(params, changesMap, '#FFFFFF');
        // We will define cellStyle white to future modifications (like filter)
    }
    /**
     * @param {?} params
     * @param {?} changesMap
     * @param {?} color
     * @return {?}
     */
    changeCellStyleColumns(params, changesMap, color) {
        for (const key of changesMap.get(params.node.id).keys()) {
            /** @type {?} */
            const columnNumber = this.getColumnIndexByColId(this.gridColumnApi, key);
            this.gridColumnApi.columnController.gridColumns[columnNumber].colDef.cellStyle = { backgroundColor: color };
        }
    }
}
DataGridComponent.ɵfac = function DataGridComponent_Factory(t) { return new (t || DataGridComponent)(ɵngcc0.ɵɵdirectiveInject(ɵngcc6.MatDialog), ɵngcc0.ɵɵdirectiveInject(ɵngcc5.TranslateService)); };
DataGridComponent.ɵcmp = ɵngcc0.ɵɵdefineComponent({ type: DataGridComponent, selectors: [["app-data-grid"]], inputs: { frameworkComponents: "frameworkComponents", eventRefreshSubscription: "eventRefreshSubscription", eventGetSelectedRowsSubscription: "eventGetSelectedRowsSubscription", eventGetAllRowsSubscription: "eventGetAllRowsSubscription", eventSaveAgGridStateSubscription: "eventSaveAgGridStateSubscription", eventAddItemsSubscription: "eventAddItemsSubscription", columnDefs: "columnDefs", getAll: "getAll", discardChangesButton: "discardChangesButton", id: "id", undoButton: "undoButton", defaultColumnSorting: "defaultColumnSorting", redoButton: "redoButton", applyChangesButton: "applyChangesButton", deleteButton: "deleteButton", newButton: "newButton", actionButton: "actionButton", addButton: "addButton", globalSearch: "globalSearch", themeGrid: "themeGrid", singleSelection: "singleSelection", nonEditable: "nonEditable", title: "title", hideExportButton: "hideExportButton", hideDuplicateButton: "hideDuplicateButton", hideSearchReplaceButton: "hideSearchReplaceButton" }, outputs: { remove: "remove", new: "new", add: "add", sendChanges: "sendChanges", getSelectedRows: "getSelectedRows", duplicate: "duplicate", getAllRows: "getAllRows", getAgGridState: "getAgGridState" }, decls: 21, vars: 27, consts: [["id", "grup1", 1, "editDivBtns"], [3, "translate", 4, "ngIf"], ["type", "button", "mat-mini-fab", "", "class", "mini-fab mat-red", "id", "deleteChangesButton", "type", "button", 3, "title", "disabled", "click", 4, "ngIf"], ["type", "button", "mat-mini-fab", "", "class", "mini-fab mat-orange", "id", "undo", 3, "title", "disabled", "click", 4, "ngIf"], ["type", "button", "mat-mini-fab", "", "class", "mini-fab mat-orange", "id", "redo", 3, "title", "disabled", "click", 4, "ngIf"], ["type", "button", "mat-mini-fab", "", "class", "mini-fab mat-green", "id", "applyChangesButton", 3, "title", "disabled", "click", 4, "ngIf"], ["id", "grup2", 1, "actionsDivBtns"], ["type", "text", "class", "searchGenericInput", "placeholder", "", "ml-2", "", 3, "ngModel", "keyup", "ngModelChange", 4, "ngIf"], ["type", "button", "mat-flat-button", "", "id", "deleteButton", "class", "deleteButton", 3, "click", 4, "ngIf"], ["type", "button", "mat-flat-button", "", "id", "actionButton", "class", "actionButton", 3, "matMenuTriggerFor", 4, "ngIf"], ["menu", "matMenu"], ["type", "button", "mat-menu-item", "", 3, "click", 4, "ngIf"], ["type", "button", "mat-menu-item", "", 4, "ngIf"], ["type", "button", "mat-flat-button", "", "class", "newButton", 3, "click", 4, "ngIf"], [1, "row", 2, "height", "100%"], ["id", "myGrid", 2, "width", "100%", "height", "100%"], ["rowSelection", "multiple", "multiSortKey", "key", 2, "width", "100%", "height", "100%", "min-height", "200px", 3, "floatingFilter", "rowData", "columnDefs", "gridOptions", "animateRows", "pagination", "modules", "undoRedoCellEditing", "undoRedoCellEditingLimit", "suppressRowClickSelection", "frameworkComponents", "filterModified", "cellEditingStopped", "cellValueChanged", "gridReady", "firstDataRendered"], [3, "translate"], ["type", "button", "mat-mini-fab", "", "id", "deleteChangesButton", "type", "button", 1, "mini-fab", "mat-red", 3, "title", "disabled", "click"], ["fontSet", "material-icons-round"], ["type", "button", "mat-mini-fab", "", "id", "undo", 1, "mini-fab", "mat-orange", 3, "title", "disabled", "click"], ["type", "button", "mat-mini-fab", "", "id", "redo", 1, "mini-fab", "mat-orange", 3, "title", "disabled", "click"], ["type", "button", "mat-mini-fab", "", "id", "applyChangesButton", 1, "mini-fab", "mat-green", 3, "title", "disabled", "click"], ["type", "text", "placeholder", "", "ml-2", "", 1, "searchGenericInput", 3, "ngModel", "keyup", "ngModelChange"], ["type", "button", "mat-flat-button", "", "id", "deleteButton", 1, "deleteButton", 3, "click"], ["type", "button", "mat-flat-button", "", "id", "actionButton", 1, "actionButton", 3, "matMenuTriggerFor"], ["type", "button", "mat-menu-item", "", 3, "click"], ["type", "button", "mat-menu-item", ""], ["type", "button", "mat-flat-button", "", 1, "newButton", 3, "click"]], template: function DataGridComponent_Template(rf, ctx) { if (rf & 1) {
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
        ɵngcc0.ɵɵtemplate(9, DataGridComponent_button_9_Template, 4, 1, "button", 8);
        ɵngcc0.ɵɵtemplate(10, DataGridComponent_button_10_Template, 4, 2, "button", 9);
        ɵngcc0.ɵɵelementStart(11, "mat-menu", null, 10);
        ɵngcc0.ɵɵtemplate(13, DataGridComponent_button_13_Template, 3, 3, "button", 11);
        ɵngcc0.ɵɵtemplate(14, DataGridComponent_button_14_Template, 3, 3, "button", 11);
        ɵngcc0.ɵɵtemplate(15, DataGridComponent_button_15_Template, 3, 3, "button", 12);
        ɵngcc0.ɵɵelementEnd();
        ɵngcc0.ɵɵtemplate(16, DataGridComponent_button_16_Template, 4, 1, "button", 13);
        ɵngcc0.ɵɵtemplate(17, DataGridComponent_button_17_Template, 4, 1, "button", 13);
        ɵngcc0.ɵɵelementEnd();
        ɵngcc0.ɵɵelementStart(18, "div", 14);
        ɵngcc0.ɵɵelementStart(19, "div", 15);
        ɵngcc0.ɵɵelementStart(20, "ag-grid-angular", 16);
        ɵngcc0.ɵɵlistener("filterModified", function DataGridComponent_Template_ag_grid_angular_filterModified_20_listener() { return ctx.onFilterModified(); })("cellEditingStopped", function DataGridComponent_Template_ag_grid_angular_cellEditingStopped_20_listener($event) { return ctx.onCellEditingStopped($event); })("cellValueChanged", function DataGridComponent_Template_ag_grid_angular_cellValueChanged_20_listener($event) { return ctx.onCellValueChanged($event); })("gridReady", function DataGridComponent_Template_ag_grid_angular_gridReady_20_listener($event) { return ctx.onGridReady($event); })("firstDataRendered", function DataGridComponent_Template_ag_grid_angular_firstDataRendered_20_listener() { return ctx.firstDataRendered(); });
        ɵngcc0.ɵɵelementEnd();
        ɵngcc0.ɵɵelementEnd();
        ɵngcc0.ɵɵelementEnd();
    } if (rf & 2) {
        ɵngcc0.ɵɵadvance(1);
        ɵngcc0.ɵɵproperty("ngIf", ctx.title);
        ɵngcc0.ɵɵadvance(1);
        ɵngcc0.ɵɵproperty("ngIf", ctx.discardChangesButton);
        ɵngcc0.ɵɵadvance(1);
        ɵngcc0.ɵɵproperty("ngIf", ctx.undoButton);
        ɵngcc0.ɵɵadvance(1);
        ɵngcc0.ɵɵproperty("ngIf", ctx.redoButton);
        ɵngcc0.ɵɵadvance(1);
        ɵngcc0.ɵɵproperty("ngIf", ctx.applyChangesButton);
        ɵngcc0.ɵɵadvance(2);
        ɵngcc0.ɵɵproperty("ngIf", ctx.globalSearch);
        ɵngcc0.ɵɵadvance(1);
        ɵngcc0.ɵɵproperty("ngIf", ctx.globalSearch);
        ɵngcc0.ɵɵadvance(1);
        ɵngcc0.ɵɵproperty("ngIf", ctx.deleteButton && ctx.areRowsSelected());
        ɵngcc0.ɵɵadvance(1);
        ɵngcc0.ɵɵproperty("ngIf", ctx.actionButton);
        ɵngcc0.ɵɵadvance(3);
        ɵngcc0.ɵɵproperty("ngIf", !ctx.hideExportButton);
        ɵngcc0.ɵɵadvance(1);
        ɵngcc0.ɵɵproperty("ngIf", !ctx.hideDuplicateButton);
        ɵngcc0.ɵɵadvance(1);
        ɵngcc0.ɵɵproperty("ngIf", !ctx.hideSearchReplaceButton);
        ɵngcc0.ɵɵadvance(1);
        ɵngcc0.ɵɵproperty("ngIf", ctx.newButton);
        ɵngcc0.ɵɵadvance(1);
        ɵngcc0.ɵɵproperty("ngIf", ctx.addButton);
        ɵngcc0.ɵɵadvance(3);
        ɵngcc0.ɵɵclassMap(ctx.themeGrid);
        ɵngcc0.ɵɵproperty("floatingFilter", true)("rowData", ctx.rowData)("columnDefs", ctx.columnDefs)("gridOptions", ctx.gridOptions)("animateRows", true)("pagination", false)("modules", ctx.modules)("undoRedoCellEditing", true)("undoRedoCellEditingLimit", 200)("suppressRowClickSelection", true)("frameworkComponents", ctx.frameworkComponents);
    } }, directives: [ɵngcc7.NgIf, ɵngcc8._MatMenu, ɵngcc9.AgGridAngular, ɵngcc5.TranslateDirective, ɵngcc1.MatButton, ɵngcc2.MatIcon, ɵngcc4.DefaultValueAccessor, ɵngcc4.NgControlStatus, ɵngcc4.NgModel, ɵngcc8.MatMenuTrigger, ɵngcc8.MatMenuItem], pipes: [ɵngcc5.TranslatePipe], styles: ["@charset \"UTF-8\";input[_ngcontent-%COMP%], label[_ngcontent-%COMP%]{display:inline-block;margin:5px 5px 5px 10px}.mat-flat-button.mat-orange[_ngcontent-%COMP%], .mat-icon.mat-orange[_ngcontent-%COMP%], .mat-mini-fab.mat-orange[_ngcontent-%COMP%], .mat-raised-button.mat-orange[_ngcontent-%COMP%]{background-color:#ff9300!important;color:#fff!important}.mat-flat-button.mat-orange[_ngcontent-%COMP%]:disabled, .mat-icon.mat-orange[_ngcontent-%COMP%]:disabled, .mat-mini-fab.mat-orange[_ngcontent-%COMP%]:disabled, .mat-raised-button.mat-orange[_ngcontent-%COMP%]:disabled{background:#ffc97f!important;color:#fff!important}.mat-flat-button.mat-green[_ngcontent-%COMP%], .mat-icon.mat-green[_ngcontent-%COMP%], .mat-mini-fab.mat-green[_ngcontent-%COMP%], .mat-raised-button.mat-green[_ngcontent-%COMP%]{background-color:#68a225!important;color:#fff!important}.mat-flat-button.mat-green[_ngcontent-%COMP%]:disabled, .mat-icon.mat-green[_ngcontent-%COMP%]:disabled, .mat-mini-fab.mat-green[_ngcontent-%COMP%]:disabled, .mat-raised-button.mat-green[_ngcontent-%COMP%]:disabled{background-color:#83976c!important;color:#fff!important}.mat-flat-button.mat-red[_ngcontent-%COMP%], .mat-icon.mat-red[_ngcontent-%COMP%], .mat-mini-fab.mat-red[_ngcontent-%COMP%], .mat-raised-button.mat-red[_ngcontent-%COMP%]{background-color:#bf0000!important;color:#fff!important}.mat-flat-button.mat-red[_ngcontent-%COMP%]:disabled, .mat-icon.mat-red[_ngcontent-%COMP%]:disabled, .mat-mini-fab.mat-red[_ngcontent-%COMP%]:disabled, .mat-raised-button.mat-red[_ngcontent-%COMP%]:disabled{background-color:#da8c8e!important;color:#fff!important}.validateButton[_ngcontent-%COMP%]{background-color:#ff9300;color:#fff;margin-top:34px!important;min-width:85px}.deleteButton[_ngcontent-%COMP%], .validateButton[_ngcontent-%COMP%]{-ms-grid-column-align:right!important;height:40px;justify-self:right!important}.deleteButton[_ngcontent-%COMP%]{border:1px solid #bf0000!important;color:#bf0000;float:inherit!important;min-width:85px!important}.deleteButton[_ngcontent-%COMP%]:disabled{background-color:inherit!important;border:1px solid rgba(0,0,0,.26)!important}.actionButton[_ngcontent-%COMP%], .returnButton[_ngcontent-%COMP%]{border:1px solid #ff9300!important;color:#ff9300}.actionButton[_ngcontent-%COMP%], .newButton[_ngcontent-%COMP%], .returnButton[_ngcontent-%COMP%], .saveButton[_ngcontent-%COMP%]{-ms-grid-column-align:right!important;float:inherit!important;height:40px;justify-self:right!important;min-width:85px!important}.newButton[_ngcontent-%COMP%], .saveButton[_ngcontent-%COMP%]{background-color:#68a225;color:#fff}.editDivBtns[_ngcontent-%COMP%]{height:30px!important;line-height:30px!important;margin-left:10px;text-align:start;width:130px}.actionsDivBtns[_ngcontent-%COMP%]{height:50px;text-align:end;width:calc(100% - 140px)}.actionsDivBtns[_ngcontent-%COMP%], .editDivBtns[_ngcontent-%COMP%]{display:inline-block!important}.actionsDivBtns[_ngcontent-%COMP%]   .searchGenericInput[_ngcontent-%COMP%]{display:inline-block!important;height:41px!important;margin:0 5px 5px 10px!important;width:45%!important}.ag-body-viewport.ag-layout-normal[_ngcontent-%COMP%]   [_ngcontent-%COMP%]::-webkit-scrollbar-thumb{background:#eee}\u200B[_ngcontent-%COMP%]   .ag-body-viewport.ag-layout-normal[_ngcontent-%COMP%]   [_ngcontent-%COMP%]::-webkit-scrollbar{height:2em;width:2em}.ag-body-viewport.ag-layout-normal[_ngcontent-%COMP%]   [_ngcontent-%COMP%]::-webkit-scrollbar-button{background:#ccc}.ag-body-viewport.ag-layout-normal[_ngcontent-%COMP%]::-webkit-scrollbar-track-piece{background:#888}.mini-fab[_ngcontent-%COMP%]{height:28px!important;line-height:22px!important;margin-right:3px!important;margin-top:7px!important;width:28px!important}.mini-fab[_ngcontent-%COMP%]   .mat-button-wrapper[_ngcontent-%COMP%]{height:24px!important;line-height:22px!important;padding:1px 0!important;width:24px!important}.mini-fab[_ngcontent-%COMP%]   .mat-button-wrapper[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%]{font-size:20px;line-height:22px;padding-right:0}"] });
/** @nocollapse */
DataGridComponent.ctorParameters = () => [
    { type: MatDialog },
    { type: TranslateService }
];
DataGridComponent.propDecorators = {
    eventRefreshSubscription: [{ type: Input }],
    eventGetSelectedRowsSubscription: [{ type: Input }],
    eventGetAllRowsSubscription: [{ type: Input }],
    eventSaveAgGridStateSubscription: [{ type: Input }],
    eventAddItemsSubscription: [{ type: Input }],
    frameworkComponents: [{ type: Input }],
    columnDefs: [{ type: Input }],
    getAll: [{ type: Input }],
    discardChangesButton: [{ type: Input }],
    id: [{ type: Input }],
    undoButton: [{ type: Input }],
    defaultColumnSorting: [{ type: Input }],
    redoButton: [{ type: Input }],
    applyChangesButton: [{ type: Input }],
    deleteButton: [{ type: Input }],
    newButton: [{ type: Input }],
    actionButton: [{ type: Input }],
    addButton: [{ type: Input }],
    globalSearch: [{ type: Input }],
    themeGrid: [{ type: Input }],
    singleSelection: [{ type: Input }],
    nonEditable: [{ type: Input }],
    title: [{ type: Input }],
    hideExportButton: [{ type: Input }],
    hideDuplicateButton: [{ type: Input }],
    hideSearchReplaceButton: [{ type: Input }],
    remove: [{ type: Output }],
    new: [{ type: Output }],
    add: [{ type: Output }],
    sendChanges: [{ type: Output }],
    duplicate: [{ type: Output }],
    getSelectedRows: [{ type: Output }],
    getAllRows: [{ type: Output }],
    getAgGridState: [{ type: Output }]
};
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(DataGridComponent, [{
        type: Component,
        args: [{
                selector: 'app-data-grid',
                template: "<div id=grup1 class=\"editDivBtns\">\r\n    <span *ngIf=\"title\" [translate]=\"title\"> </span>\r\n    <button type=\"button\" title=\"{{ 'cancel' | translate }}\" mat-mini-fab class=\"mini-fab mat-red\" *ngIf=\"discardChangesButton\"\r\n        id=\"deleteChangesButton\" type=\"button\" (click)=\"deleteChanges()\" [disabled]=\"changeCounter <= 0\">\r\n        <mat-icon fontSet=\"material-icons-round\"> close </mat-icon>\r\n    </button>\r\n    <button type=\"button\" title=\"{{ 'undo' | translate }}\" mat-mini-fab class=\"mini-fab mat-orange\" *ngIf=\"undoButton\" id=\"undo\"\r\n        (click)=\"undo()\" [disabled]=\"changeCounter <= 0\">\r\n        <mat-icon fontSet=\"material-icons-round\"> undo </mat-icon>\r\n    </button>\r\n    <button type=\"button\" title=\"{{ 'redo' | translate }}\" mat-mini-fab class=\"mini-fab mat-orange\" *ngIf=\"redoButton\" id=\"redo\"\r\n        (click)=\"redo()\" [disabled]=\"redoCounter <= 0\">\r\n        <mat-icon fontSet=\"material-icons-round\"> redo </mat-icon>\r\n    </button>\r\n    <button type=\"button\" title=\"{{ 'accept' | translate }}\" mat-mini-fab class=\"mini-fab mat-green\" *ngIf=\"applyChangesButton\"\r\n        id=\"applyChangesButton\" (click)=\"applyChanges()\" [disabled]=\"changeCounter <= 0\">\r\n        <mat-icon fontSet=\"material-icons-round\"> check </mat-icon>\r\n    </button>\r\n</div>\r\n\r\n<div id=grup2 class=\"actionsDivBtns\">\r\n    <label *ngIf=\"globalSearch\" [translate]=\"'search'\"> </label>\r\n    <input *ngIf=\"globalSearch\" type=\"text\" class=\"searchGenericInput\" placeholder=\"\" (keyup)=\"quickSearch()\"\r\n        [(ngModel)]=\"searchValue\" ml-2>\r\n    <button type=\"button\" *ngIf=\"deleteButton && areRowsSelected()\" mat-flat-button id=\"deleteButton\" class=\"deleteButton\" (click)=\"removeData()\" >\r\n        <mat-icon fontSet=\"material-icons-round\"> delete </mat-icon>\r\n        <span [translate]=\"'remove'\"> </span>\r\n\r\n    </button>\r\n    <button type=\"button\" *ngIf=\"actionButton\" mat-flat-button [matMenuTriggerFor]=\"menu\" id=\"actionButton\" class=\"actionButton\">\r\n        <span [translate]=\"'actions'\"> </span>\r\n        <mat-icon fontSet=\"material-icons-round\"> keyboard_arrow_down </mat-icon>\r\n    </button>\r\n    <mat-menu #menu=\"matMenu\">\r\n        <button type=\"button\" mat-menu-item *ngIf=\"!hideExportButton\" (click)=\"exportData()\"> {{\"export\" | translate}} </button>\r\n        <button type=\"button\" mat-menu-item *ngIf=\"!hideDuplicateButton\" (click)=\"onDuplicateButtonClicked()\"> {{\"duplicate\" |\r\n            translate}}</button>\r\n        <button type=\"button\" mat-menu-item *ngIf=\"!hideSearchReplaceButton\"> {{\"search/replace\" | translate}}</button>\r\n    </mat-menu>\r\n\r\n    <button type=\"button\" *ngIf=\"newButton\" mat-flat-button class=\"newButton\" (click)=\"newData()\">\r\n        <mat-icon fontSet=\"material-icons-round\"> add_circle_outline </mat-icon>\r\n        <span [translate]=\"'new'\"> </span>\r\n    </button>\r\n    <button type=\"button\" *ngIf=\"addButton\" mat-flat-button class=\"newButton\" (click)=\"onAddButtonClicked()\">\r\n        <mat-icon fontSet=\"material-icons-round\"> add_circle_outline </mat-icon>\r\n        <span [translate]=\"'add'\"> </span>\r\n    </button>\r\n\r\n</div>\r\n\r\n\r\n\r\n<div class=\"row\" style=\" height: 100%\">\r\n    <div id=\"myGrid\" style=\" width:100%; height: 100%\">\r\n        <ag-grid-angular style=\"width: 100%; height: 100%;min-height: 200px;\" [class]=\"themeGrid\"\r\n            [floatingFilter]=\"true\" [rowData]=\"rowData\" [columnDefs]=\"columnDefs\" [gridOptions]=\"gridOptions\"\r\n            [animateRows]=\"true\" [pagination]=\"false\" [modules]=\"modules\" [undoRedoCellEditing]=\"true\"\r\n            [undoRedoCellEditingLimit]=200 [suppressRowClickSelection]=true [frameworkComponents]=\"frameworkComponents\"\r\n            rowSelection=\"multiple\" multiSortKey=\"key\" (filterModified)=\"onFilterModified()\"\r\n            (cellEditingStopped)=\"onCellEditingStopped($event)\" (cellValueChanged)=\"onCellValueChanged($event)\"\r\n            (gridReady)=\"onGridReady($event)\" (firstDataRendered)=\"firstDataRendered()\">\r\n        </ag-grid-angular>\r\n    </div>\r\n</div>",
                styles: ["@charset \"UTF-8\";input,label{display:inline-block;margin:5px 5px 5px 10px}.mat-flat-button.mat-orange,.mat-icon.mat-orange,.mat-mini-fab.mat-orange,.mat-raised-button.mat-orange{background-color:#ff9300!important;color:#fff!important}.mat-flat-button.mat-orange:disabled,.mat-icon.mat-orange:disabled,.mat-mini-fab.mat-orange:disabled,.mat-raised-button.mat-orange:disabled{background:#ffc97f!important;color:#fff!important}.mat-flat-button.mat-green,.mat-icon.mat-green,.mat-mini-fab.mat-green,.mat-raised-button.mat-green{background-color:#68a225!important;color:#fff!important}.mat-flat-button.mat-green:disabled,.mat-icon.mat-green:disabled,.mat-mini-fab.mat-green:disabled,.mat-raised-button.mat-green:disabled{background-color:#83976c!important;color:#fff!important}.mat-flat-button.mat-red,.mat-icon.mat-red,.mat-mini-fab.mat-red,.mat-raised-button.mat-red{background-color:#bf0000!important;color:#fff!important}.mat-flat-button.mat-red:disabled,.mat-icon.mat-red:disabled,.mat-mini-fab.mat-red:disabled,.mat-raised-button.mat-red:disabled{background-color:#da8c8e!important;color:#fff!important}.validateButton{background-color:#ff9300;color:#fff;margin-top:34px!important;min-width:85px}.deleteButton,.validateButton{-ms-grid-column-align:right!important;height:40px;justify-self:right!important}.deleteButton{border:1px solid #bf0000!important;color:#bf0000;float:inherit!important;min-width:85px!important}.deleteButton:disabled{background-color:inherit!important;border:1px solid rgba(0,0,0,.26)!important}.actionButton,.returnButton{border:1px solid #ff9300!important;color:#ff9300}.actionButton,.newButton,.returnButton,.saveButton{-ms-grid-column-align:right!important;float:inherit!important;height:40px;justify-self:right!important;min-width:85px!important}.newButton,.saveButton{background-color:#68a225;color:#fff}.editDivBtns{height:30px!important;line-height:30px!important;margin-left:10px;text-align:start;width:130px}.actionsDivBtns{height:50px;text-align:end;width:calc(100% - 140px)}.actionsDivBtns,.editDivBtns{display:inline-block!important}.actionsDivBtns .searchGenericInput{display:inline-block!important;height:41px!important;margin:0 5px 5px 10px!important;width:45%!important}.ag-body-viewport.ag-layout-normal ::-webkit-scrollbar-thumb{background:#eee}\u200B .ag-body-viewport.ag-layout-normal ::-webkit-scrollbar{height:2em;width:2em}.ag-body-viewport.ag-layout-normal ::-webkit-scrollbar-button{background:#ccc}.ag-body-viewport.ag-layout-normal::-webkit-scrollbar-track-piece{background:#888}.mini-fab{height:28px!important;line-height:22px!important;margin-right:3px!important;margin-top:7px!important;width:28px!important}.mini-fab .mat-button-wrapper{height:24px!important;line-height:22px!important;padding:1px 0!important;width:24px!important}.mini-fab .mat-button-wrapper .mat-icon{font-size:20px;line-height:22px;padding-right:0}"]
            }]
    }], function () { return [{ type: ɵngcc6.MatDialog }, { type: ɵngcc5.TranslateService }]; }, { frameworkComponents: [{
            type: Input
        }], remove: [{
            type: Output
        }], new: [{
            type: Output
        }], add: [{
            type: Output
        }], sendChanges: [{
            type: Output
        }], getSelectedRows: [{
            type: Output
        }], duplicate: [{
            type: Output
        }], getAllRows: [{
            type: Output
        }], eventRefreshSubscription: [{
            type: Input
        }], eventGetSelectedRowsSubscription: [{
            type: Input
        }], eventGetAllRowsSubscription: [{
            type: Input
        }], eventSaveAgGridStateSubscription: [{
            type: Input
        }], eventAddItemsSubscription: [{
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
        }], getAgGridState: [{
            type: Output
        }] }); })();
if (false) {
    /** @type {?} */
    DataGridComponent.prototype._eventRefreshSubscription;
    /** @type {?} */
    DataGridComponent.prototype._eventGetSelectedRowsSubscription;
    /** @type {?} */
    DataGridComponent.prototype._eventGetAllRowsSubscription;
    /** @type {?} */
    DataGridComponent.prototype._eventSaveAgGridStateSubscription;
    /** @type {?} */
    DataGridComponent.prototype.modules;
    /** @type {?} */
    DataGridComponent.prototype.UndeRedoActions;
    /** @type {?} */
    DataGridComponent.prototype.searchValue;
    /** @type {?} */
    DataGridComponent.prototype.gridApi;
    /** @type {?} */
    DataGridComponent.prototype.gridColumnApi;
    /** @type {?} */
    DataGridComponent.prototype.statusColumn;
    /** @type {?} */
    DataGridComponent.prototype.changesMap;
    /** @type {?} */
    DataGridComponent.prototype.params;
    /** @type {?} */
    DataGridComponent.prototype.rowData;
    /** @type {?} */
    DataGridComponent.prototype.changeCounter;
    /** @type {?} */
    DataGridComponent.prototype.previousChangeCounter;
    /** @type {?} */
    DataGridComponent.prototype.redoCounter;
    /** @type {?} */
    DataGridComponent.prototype.modificationChange;
    /** @type {?} */
    DataGridComponent.prototype.undoNoChanges;
    /** @type {?} */
    DataGridComponent.prototype.gridOptions;
    /** @type {?} */
    DataGridComponent.prototype.eventRefreshSubscription;
    /** @type {?} */
    DataGridComponent.prototype.eventGetSelectedRowsSubscription;
    /** @type {?} */
    DataGridComponent.prototype.eventGetAllRowsSubscription;
    /** @type {?} */
    DataGridComponent.prototype.eventSaveAgGridStateSubscription;
    /** @type {?} */
    DataGridComponent.prototype.eventAddItemsSubscription;
    /** @type {?} */
    DataGridComponent.prototype.frameworkComponents;
    /** @type {?} */
    DataGridComponent.prototype.columnDefs;
    /** @type {?} */
    DataGridComponent.prototype.getAll;
    /** @type {?} */
    DataGridComponent.prototype.discardChangesButton;
    /** @type {?} */
    DataGridComponent.prototype.id;
    /** @type {?} */
    DataGridComponent.prototype.undoButton;
    /** @type {?} */
    DataGridComponent.prototype.defaultColumnSorting;
    /** @type {?} */
    DataGridComponent.prototype.redoButton;
    /** @type {?} */
    DataGridComponent.prototype.applyChangesButton;
    /** @type {?} */
    DataGridComponent.prototype.deleteButton;
    /** @type {?} */
    DataGridComponent.prototype.newButton;
    /** @type {?} */
    DataGridComponent.prototype.actionButton;
    /** @type {?} */
    DataGridComponent.prototype.addButton;
    /** @type {?} */
    DataGridComponent.prototype.globalSearch;
    /** @type {?} */
    DataGridComponent.prototype.themeGrid;
    /** @type {?} */
    DataGridComponent.prototype.singleSelection;
    /** @type {?} */
    DataGridComponent.prototype.nonEditable;
    /** @type {?} */
    DataGridComponent.prototype.title;
    /** @type {?} */
    DataGridComponent.prototype.hideExportButton;
    /** @type {?} */
    DataGridComponent.prototype.hideDuplicateButton;
    /** @type {?} */
    DataGridComponent.prototype.hideSearchReplaceButton;
    /** @type {?} */
    DataGridComponent.prototype.remove;
    /** @type {?} */
    DataGridComponent.prototype.new;
    /** @type {?} */
    DataGridComponent.prototype.add;
    /** @type {?} */
    DataGridComponent.prototype.sendChanges;
    /** @type {?} */
    DataGridComponent.prototype.duplicate;
    /** @type {?} */
    DataGridComponent.prototype.getSelectedRows;
    /** @type {?} */
    DataGridComponent.prototype.getAllRows;
    /** @type {?} */
    DataGridComponent.prototype.getAgGridState;
    /** @type {?} */
    DataGridComponent.prototype.dialog;
    /** @type {?} */
    DataGridComponent.prototype.translate;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * @record
 */
function DialogData() { }
/** @type {?} */
DialogData.prototype._GetAllsTable;
/** @type {?} */
DialogData.prototype._columnDefsTable;
/** @type {?} */
DialogData.prototype._singleSelectionTable;
class DialogGridComponent {
    /**
     * @param {?} dialogRef
     */
    constructor(dialogRef) {
        this.dialogRef = dialogRef;
        this.getAllRows = new Subject();
        this.allRowsReceived = [];
        this.joinTables = new EventEmitter();
        // this.nonEditable = true;
        this.tablesReceivedCounter = 0;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        if (this.addButtonClickedSubscription) {
            this._addButtonClickedSubscription = this.addButtonClickedSubscription.subscribe(() => {
                this.getAllSelectedRows();
            });
        }
    }
    /**
     * @return {?}
     */
    getAllSelectedRows() {
        this.getAllRows.next(true);
    }
    /**
     * @param {?} data
     * @return {?}
     */
    joinRowsReceived(data) {
        this.allRowsReceived.push(data);
        this.tablesReceivedCounter++;
        if (this.tablesReceivedCounter === this.getAllsTable.length) {
            this.doAdd(this.allRowsReceived);
            console.log(this.allRowsReceived);
        }
    }
    /**
     * @param {?} rowsToAdd
     * @return {?}
     */
    doAdd(rowsToAdd) {
        this.dialogRef.close({ event: 'Add', data: rowsToAdd });
    }
    /**
     * @return {?}
     */
    closeDialog() {
        this.dialogRef.close({ event: 'Cancel' });
    }
}
DialogGridComponent.ɵfac = function DialogGridComponent_Factory(t) { return new (t || DialogGridComponent)(ɵngcc0.ɵɵdirectiveInject(ɵngcc6.MatDialogRef)); };
DialogGridComponent.ɵcmp = ɵngcc0.ɵɵdefineComponent({ type: DialogGridComponent, selectors: [["app-dialog-grid"]], outputs: { joinTables: "joinTables" }, decls: 11, vars: 8, consts: [["mat-dialog-title", ""], [1, "dialogConent"], ["class", "appDialogDataGridDiv", 3, "ngStyle", 4, "ngFor", "ngForOf"], ["mat-dialog-actions", "", "align", "end"], ["mat-flat-button", "", 1, "returnButton", 3, "click"], ["mat-flat-button", "", "cdkFocusInitial", "", 1, "saveButton", 3, "click"], [1, "appDialogDataGridDiv", 3, "ngStyle"], [3, "columnDefs", "themeGrid", "getAll", "globalSearch", "singleSelection", "title", "nonEditable", "eventGetSelectedRowsSubscription", "getSelectedRows"]], template: function DialogGridComponent_Template(rf, ctx) { if (rf & 1) {
        ɵngcc0.ɵɵelementStart(0, "h5", 0);
        ɵngcc0.ɵɵtext(1);
        ɵngcc0.ɵɵelementEnd();
        ɵngcc0.ɵɵelementStart(2, "mat-dialog-content", 1);
        ɵngcc0.ɵɵtemplate(3, DialogGridComponent_div_3_Template, 2, 11, "div", 2);
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
    } }, directives: [ɵngcc6.MatDialogTitle, ɵngcc6.MatDialogContent, ɵngcc7.NgForOf, ɵngcc6.MatDialogActions, ɵngcc1.MatButton, ɵngcc7.NgStyle, DataGridComponent], pipes: [ɵngcc5.TranslatePipe], styles: [".dialogConent[_ngcontent-%COMP%]{height:100%;margin:inherit!important;max-height:60vh!important;overflow:auto;padding:inherit!important;width:100%}"] });
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
                template: "<h5 mat-dialog-title>{{title}}</h5>\r\n<mat-dialog-content class=\"dialogConent\">\r\n  <div *ngFor=\"let getAll of getAllsTable; let i = index\" class=\"appDialogDataGridDiv\"  [ngStyle]=\"{'margin-top': i>0?'100px':'0px'}\">\r\n    <app-data-grid \r\n    [columnDefs]=\"columnDefsTable[i]\" [themeGrid]='themeGrid'  [getAll]='getAll' [globalSearch]=true [singleSelection]=\"singleSelectionTable[i]\"\r\n    [title]=\"titlesTable[i]\" [nonEditable]='nonEditable' [eventGetSelectedRowsSubscription]=\"getAllRows.asObservable()\" (getSelectedRows)='joinRowsReceived($event)' >\r\n    </app-data-grid>\r\n  </div>\r\n</mat-dialog-content>\r\n<div mat-dialog-actions align=\"end\">\r\n  <button mat-flat-button class=\"returnButton\" (click)=\"closeDialog()\">{{\"cancel\" | translate}}</button>\r\n  <button mat-flat-button class=\"saveButton\" (click)=\"getAllSelectedRows()\" cdkFocusInitial>{{\"add\" | translate}}</button>\r\n</div>\r\n\r\n",
                styles: [".dialogConent{height:100%;margin:inherit!important;max-height:60vh!important;overflow:auto;padding:inherit!important;width:100%}"]
            }]
    }], function () { return [{ type: ɵngcc6.MatDialogRef }]; }, { joinTables: [{
            type: Output
        }] }); })();
if (false) {
    /** @type {?} */
    DialogGridComponent.prototype.title;
    /** @type {?} */
    DialogGridComponent.prototype.getAllRows;
    /** @type {?} */
    DialogGridComponent.prototype._addButtonClickedSubscription;
    /** @type {?} */
    DialogGridComponent.prototype.tablesReceivedCounter;
    /** @type {?} */
    DialogGridComponent.prototype.allRowsReceived;
    /** @type {?} */
    DialogGridComponent.prototype.themeGrid;
    /** @type {?} */
    DialogGridComponent.prototype.getAllsTable;
    /** @type {?} */
    DialogGridComponent.prototype.columnDefsTable;
    /** @type {?} */
    DialogGridComponent.prototype.singleSelectionTable;
    /** @type {?} */
    DialogGridComponent.prototype.titlesTable;
    /** @type {?} */
    DialogGridComponent.prototype.addButtonClickedSubscription;
    /** @type {?} */
    DialogGridComponent.prototype.nonEditable;
    /** @type {?} */
    DialogGridComponent.prototype.joinTables;
    /** @type {?} */
    DialogGridComponent.prototype.dialogRef;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class DialogFormComponent {
    /**
     * @param {?} dialogRef
     * @param {?} dialog
     * @param {?} translate
     */
    constructor(dialogRef, dialog, translate) {
        this.dialogRef = dialogRef;
        this.dialog = dialog;
        this.translate = translate;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
    }
    /**
     * @return {?}
     */
    doAdd() {
        if (this.form.valid) {
            this.dialogRef.close({ event: 'Add' });
        }
        else {
            /** @type {?} */
            const dialogRef = this.dialog.open(DialogMessageComponent);
            dialogRef.componentInstance.title = this.translate.instant("atention");
            dialogRef.componentInstance.message = this.translate.instant("requiredFieldMessage");
            dialogRef.componentInstance.hideCancelButton = true;
            dialogRef.afterClosed().subscribe();
        }
    }
    /**
     * @return {?}
     */
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
if (false) {
    /** @type {?} */
    DialogFormComponent.prototype.form;
    /** @type {?} */
    DialogFormComponent.prototype.title;
    /** @type {?} */
    DialogFormComponent.prototype.HTMLReceived;
    /** @type {?} */
    DialogFormComponent.prototype.dialogRef;
    /** @type {?} */
    DialogFormComponent.prototype.dialog;
    /** @type {?} */
    DialogFormComponent.prototype.translate;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * File node data with nested structure.
 * Each node has a name, and a type or a list of children.
 */
class FileNode {
}
if (false) {
    /** @type {?} */
    FileNode.prototype.id;
    /** @type {?} */
    FileNode.prototype.children;
    /** @type {?} */
    FileNode.prototype.name;
    /** @type {?} */
    FileNode.prototype.type;
    /** @type {?} */
    FileNode.prototype.active;
    /** @type {?} */
    FileNode.prototype.cartographyId;
    /** @type {?} */
    FileNode.prototype.cartographyName;
    /** @type {?} */
    FileNode.prototype.datasetURL;
    /** @type {?} */
    FileNode.prototype.description;
    /** @type {?} */
    FileNode.prototype.filterGetFeatureInfo;
    /** @type {?} */
    FileNode.prototype.filterGetMap;
    /** @type {?} */
    FileNode.prototype.filterSelectable;
    /** @type {?} */
    FileNode.prototype.isFolder;
    /** @type {?} */
    FileNode.prototype.metadataURL;
    /** @type {?} */
    FileNode.prototype.order;
    /** @type {?} */
    FileNode.prototype.parent;
    /** @type {?} */
    FileNode.prototype.queryableActive;
    /** @type {?} */
    FileNode.prototype.radio;
    /** @type {?} */
    FileNode.prototype.tooltip;
    /** @type {?} */
    FileNode.prototype._links;
}
/**
 * Flat node with expandable and level information
 */
class FileFlatNode {
    /**
     * @param {?} expandable
     * @param {?} name
     * @param {?} level
     * @param {?} type
     * @param {?} id
     */
    constructor(expandable, name, level, type, id) {
        this.expandable = expandable;
        this.name = name;
        this.level = level;
        this.type = type;
        this.id = id;
    }
}
if (false) {
    /** @type {?} */
    FileFlatNode.prototype.expandable;
    /** @type {?} */
    FileFlatNode.prototype.name;
    /** @type {?} */
    FileFlatNode.prototype.level;
    /** @type {?} */
    FileFlatNode.prototype.type;
    /** @type {?} */
    FileFlatNode.prototype.id;
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
    /**
     * @return {?}
     */
    get data() { return this.dataChange.value; }
    /**
     * @param {?} dataObj
     * @return {?}
     */
    initialize(dataObj) {
        /** @type {?} */
        const data = this.buildFileTree(dataObj, 0);
        // Notify the change.
        this.dataChange.next(data);
    }
    /**
     * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
     * The return value is the list of `FileNode`.
     * @param {?} arrayTreeNodes
     * @param {?} level
     * @return {?}
     */
    buildFileTree(arrayTreeNodes, level) {
        /** @type {?} */
        var map = {};
        arrayTreeNodes.forEach((treeNode) => {
            /** @type {?} */
            var obj = treeNode;
            obj.children = [];
            obj.type = (treeNode.isFolder) ? "folder" : "node";
            if (!map[obj.id]) {
                map[obj.id] = obj;
            }
            else {
                /** @type {?} */
                let previousChildren = map[obj.id].children;
                map[obj.id] = obj;
                map[obj.id].children = previousChildren;
            }
            /** @type {?} */
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
    /**
     * @param {?} node
     * @return {?}
     */
    deleteItem(node) {
        this.deleteNode(this.data.children, node);
        this.dataChange.next(this.data);
    }
    /**
     * @param {?} nodes
     * @param {?} nodeToDelete
     * @return {?}
     */
    deleteNode(nodes, nodeToDelete) {
        /** @type {?} */
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
    /**
     * @param {?} from
     * @param {?} to
     * @return {?}
     */
    copyPasteItem(from, to) {
        /** @type {?} */
        const newItem = this.insertItem(to, from);
        return newItem;
    }
    /**
     * @param {?} from
     * @param {?} to
     * @return {?}
     */
    copyPasteItemAbove(from, to) {
        /** @type {?} */
        const newItem = this.insertItemAbove(to, from);
        return newItem;
    }
    /**
     * @param {?} from
     * @param {?} to
     * @return {?}
     */
    copyPasteItemBelow(from, to) {
        /** @type {?} */
        const newItem = this.insertItemBelow(to, from);
        return newItem;
    }
    /**
     * Add an item to to-do list
     * @param {?} node
     * @return {?}
     */
    getNewItem(node) {
        /** @type {?} */
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
    /**
     * @param {?} parent
     * @param {?} node
     * @return {?}
     */
    insertItem(parent, node) {
        if (!parent.children) {
            parent.children = [];
        }
        /** @type {?} */
        const newItem = this.getNewItem(node);
        newItem.parent = parent == null || parent.id == undefined ? null : parent.id;
        parent.children.push(newItem);
        this.dataChange.next(this.data);
        return newItem;
    }
    /**
     * @param {?} node
     * @param {?} nodeDrag
     * @return {?}
     */
    insertItemAbove(node, nodeDrag) {
        /** @type {?} */
        const parentNode = this.getParentFromNodes(node);
        /** @type {?} */
        const newItem = this.getNewItem(nodeDrag);
        newItem.parent = parentNode == null || parentNode.id == undefined ? null : parentNode.id;
        if (parentNode != null) {
            parentNode.children.splice(parentNode.children.indexOf(node), 0, newItem);
        }
        else {
            this.data.children.splice(this.data.children.indexOf(node), 0, newItem);
        }
        this.dataChange.next(this.data);
        return newItem;
    }
    /**
     * @param {?} node
     * @param {?} nodeDrag
     * @return {?}
     */
    insertItemBelow(node, nodeDrag) {
        /** @type {?} */
        const parentNode = this.getParentFromNodes(node);
        /** @type {?} */
        const newItem = this.getNewItem(nodeDrag);
        newItem.parent = parentNode == null || parentNode.id == undefined ? null : parentNode.id;
        if (parentNode != null) {
            parentNode.children.splice(parentNode.children.indexOf(node) + 1, 0, newItem);
        }
        else {
            this.data.children.splice(this.data.children.indexOf(node) + 1, 0, newItem);
        }
        this.dataChange.next(this.data);
        return newItem;
    }
    /**
     * @param {?} node
     * @return {?}
     */
    getParentFromNodes(node) {
        for (let i = 0; i < this.data.children.length; ++i) {
            /** @type {?} */
            const currentRoot = this.data.children[i];
            /** @type {?} */
            const parent = this.getParent(currentRoot, node);
            if (parent != null) {
                return parent;
            }
        }
        return null;
    }
    /**
     * @param {?} currentRoot
     * @param {?} node
     * @return {?}
     */
    getParent(currentRoot, node) {
        if (currentRoot.children && currentRoot.children.length > 0) {
            for (let i = 0; i < currentRoot.children.length; ++i) {
                /** @type {?} */
                const child = currentRoot.children[i];
                if (child === node) {
                    return currentRoot;
                }
                else if (child.children && child.children.length > 0) {
                    /** @type {?} */
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
if (false) {
    /** @type {?} */
    FileDatabase.prototype.dataChange;
}
/**
 * \@title Tree with flat nodes
 */
class DataTreeComponent {
    /**
     * @param {?} database
     */
    constructor(database) {
        this.database = database;
        // expansion model tracks expansion state
        this.expansionModel = new SelectionModel(true);
        this.dragging = false;
        this.expandDelay = 1000;
        this.validateDrop = false;
        this.dragNodeExpandOverWaitTimeMs = 1500;
        /**
         * Map from flat node to nested node. This helps us finding the nested node to be modified
         */
        this.flatNodeMap = new Map();
        /**
         * Map from nested node to flattened node. This helps us to keep the same object for selection
         */
        this.nestedNodeMap = new Map();
        this.transformer = (node, level) => {
            /** @type {?} */
            const existingNode = this.nestedNodeMap.get(node);
            /** @type {?} */
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
    /**
     * @return {?}
     */
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
     * @return {?}
     */
    visibleNodes() {
        /** @type {?} */
        const result = [];
        /**
         * @param {?} node
         * @param {?} expanded
         * @return {?}
         */
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
    /**
     * @param {?} arr
     * @param {?} id
     * @return {?}
     */
    findNodeSiblings(arr, id) {
        /** @type {?} */
        let result;
        /** @type {?} */
        let subResult;
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
    /**
     * @param {?} event
     * @param {?} node
     * @return {?}
     */
    handleDragStart(event, node) {
        // Required by Firefox (https://stackoverflow.com/questions/19055264/why-doesnt-html5-drag-and-drop-work-in-firefox)
        event.dataTransfer.setData('foo', 'bar');
        event.dataTransfer.setDragImage(this.emptyItem.nativeElement, 0, 0);
        this.dragNode = node;
        this.treeControl.collapse(node);
    }
    /**
     * @param {?} event
     * @param {?} node
     * @return {?}
     */
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
        /** @type {?} */
        const percentageX = event.offsetX / event.target.clientWidth;
        /** @type {?} */
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
    /**
     * @param {?} event
     * @param {?} node
     * @return {?}
     */
    handleDrop(event, node) {
        event.preventDefault();
        /** @type {?} */
        let toFlatNode = this.flatNodeMap.get(node);
        /** @type {?} */
        let fromFlatNode = this.flatNodeMap.get(this.dragNode);
        if (node !== this.dragNode && (this.dragNodeExpandOverArea !== 'center' || (this.dragNodeExpandOverArea === 'center' && toFlatNode.isFolder))) {
            /** @type {?} */
            let newItem;
            if (this.dragNodeExpandOverArea === 'above') {
                newItem = this.database.copyPasteItemAbove(fromFlatNode, toFlatNode);
            }
            else if (this.dragNodeExpandOverArea === 'below') {
                newItem = this.database.copyPasteItemBelow(fromFlatNode, toFlatNode);
            }
            else {
                newItem = this.database.copyPasteItem(fromFlatNode, toFlatNode);
            }
            /** @type {?} */
            let parentLvl = this.treeControl.dataNodes.find((n) => n.id === fromFlatNode.id).level;
            fromFlatNode.children.forEach(child => {
                this.treeControl.dataNodes.find((n) => n.id === child.id).level = parentLvl + 1;
            });
            this.database.deleteItem(this.flatNodeMap.get(this.dragNode));
            this.treeControl.expandDescendants(this.nestedNodeMap.get(newItem));
        }
        this.dragNode = null;
        this.dragNodeExpandOverNode = null;
        this.dragNodeExpandOverTime = 0;
    }
    /**
     * @param {?} event
     * @return {?}
     */
    handleDragEnd(event) {
        this.dragNode = null;
        this.dragNodeExpandOverNode = null;
        this.dragNodeExpandOverTime = 0;
    }
    /**
     * The following methods are for persisting the tree expand state
     * after being rebuilt
     * @param {?} data
     * @return {?}
     */
    rebuildTreeForData(data) {
        /*this.dataSource.data = data;
            this.expansionModel.selected.forEach((id) => {
              const node = this.treeControl.dataNodes.find((n) => n.id === id);
              this.treeControl.expand(node);
            });*/
        this.dataSource.data = [];
        this.dataSource.data = data;
    }
    /**
     * @param {?} node
     * @return {?}
     */
    getParentNode(node) {
        /** @type {?} */
        const currentLevel = node.level;
        if (currentLevel < 1) {
            return null;
        }
        /** @type {?} */
        const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;
        for (let i = startIndex; i >= 0; i--) {
            /** @type {?} */
            const currentNode = this.treeControl.dataNodes[i];
            if (currentNode.level < currentLevel) {
                return currentNode;
            }
        }
        return null;
    }
    /**
     * @param {?} nodeUpdated
     * @return {?}
     */
    updateNode(nodeUpdated) {
        /** @type {?} */
        const dataToChange = JSON.parse(JSON.stringify(this.dataSource.data));
        /** @type {?} */
        const siblings = this.findNodeSiblings(dataToChange, nodeUpdated.id);
        /** @type {?} */
        let index = siblings.findIndex(node => node.id === nodeUpdated.id);
        siblings[index] = nodeUpdated;
        this.rebuildTreeForData(dataToChange);
    }
    /**
     * @param {?} newFolder
     * @return {?}
     */
    createNewFolder(newFolder) {
        newFolder.type = "folder";
        /** @type {?} */
        const dataToChange = JSON.parse(JSON.stringify(this.dataSource.data));
        if (newFolder.parent === null) {
            dataToChange.push(newFolder);
        }
        else {
            /** @type {?} */
            const siblings = this.findNodeSiblings(dataToChange, newFolder.parent);
            /** @type {?} */
            let index = siblings.findIndex(node => node.id === newFolder.parent);
            siblings[index].children.push(newFolder);
        }
        this.rebuildTreeForData(dataToChange);
    }
    /**
     * @param {?} newNode
     * @return {?}
     */
    createNewNode(newNode) {
        newNode.type = "node";
        /** @type {?} */
        const dataToChange = JSON.parse(JSON.stringify(this.dataSource.data));
        /** @type {?} */
        const siblings = this.findNodeSiblings(dataToChange, newNode.parent);
        /** @type {?} */
        let index = siblings.findIndex(node => node.id === newNode.parent);
        siblings[index].children.push(newNode);
        this.rebuildTreeForData(dataToChange);
    }
    /**
     * @param {?} id
     * @param {?} button
     * @return {?}
     */
    onButtonClicked(id, button) {
        /** @type {?} */
        const changedData = JSON.parse(JSON.stringify(this.dataSource.data));
        /** @type {?} */
        const siblings = this.findNodeSiblings(changedData, id);
        /** @type {?} */
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
            /** @type {?} */
            let children = this.getAllChildren(nodeClicked.children);
            children.forEach(children => {
                children.status = 'Deleted';
            });
            nodeClicked.children = children;
            nodeClicked.status = 'Deleted';
            this.rebuildTreeForData(changedData);
        }
    }
    /**
     * @return {?}
     */
    emitAllRows() {
        /** @type {?} */
        const dataToEmit = JSON.parse(JSON.stringify(this.dataSource.data));
        /** @type {?} */
        let allRows = this.getAllChildren(dataToEmit);
        this.emitAllNodes.emit(allRows);
    }
    /**
     * @param {?} arr
     * @return {?}
     */
    getAllChildren(arr) {
        /** @type {?} */
        let result = [];
        /** @type {?} */
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
DataTreeComponent.ɵfac = function DataTreeComponent_Factory(t) { return new (t || DataTreeComponent)(ɵngcc0.ɵɵdirectiveInject(FileDatabase)); };
DataTreeComponent.ɵcmp = ɵngcc0.ɵɵdefineComponent({ type: DataTreeComponent, selectors: [["app-data-tree"]], viewQuery: function DataTreeComponent_Query(rf, ctx) { if (rf & 1) {
        ɵngcc0.ɵɵviewQuery(_c2, true);
    } if (rf & 2) {
        var _t;
        ɵngcc0.ɵɵqueryRefresh(_t = ɵngcc0.ɵɵloadQuery()) && (ctx.emptyItem = _t.first);
    } }, inputs: { eventNodeUpdatedSubscription: "eventNodeUpdatedSubscription", eventCreateNodeSubscription: "eventCreateNodeSubscription", eventGetAllRowsSubscription: "eventGetAllRowsSubscription", getAll: "getAll" }, outputs: { emitNode: "emitNode", createNode: "createNode", createFolder: "createFolder", emitAllNodes: "emitAllNodes" }, features: [ɵngcc0.ɵɵProvidersFeature([FileDatabase])], decls: 5, vars: 3, consts: [[3, "dataSource", "treeControl"], ["matTreeNodeToggle", "", "matTreeNodePadding", "", "draggable", "true", 3, "ngClass", "dragstart", "dragover", "drop", "dragend", 4, "matTreeNodeDef"], ["matTreeNodePadding", "", "draggable", "true", 3, "ngClass", "dragstart", "dragover", "drop", "dragend", 4, "matTreeNodeDef", "matTreeNodeDefWhen"], ["emptyItem", ""], ["matTreeNodeToggle", "", "matTreeNodePadding", "", "draggable", "true", 3, "ngClass", "dragstart", "dragover", "drop", "dragend"], ["mat-icon-button", "", "disabled", ""], ["class", "type-icon", 4, "ngIf"], ["mat-icon-button", "", 3, "click", 4, "ngIf"], ["mat-icon-button", "", 3, "click"], [1, "type-icon"], ["matTreeNodePadding", "", "draggable", "true", 3, "ngClass", "dragstart", "dragover", "drop", "dragend"], ["mat-icon-button", "", "matTreeNodeToggle", "", 3, "click"], [1, "mat-icon-rtl-mirror"]], template: function DataTreeComponent_Template(rf, ctx) { if (rf & 1) {
        ɵngcc0.ɵɵelementStart(0, "mat-tree", 0);
        ɵngcc0.ɵɵtemplate(1, DataTreeComponent_mat_tree_node_1_Template, 12, 9, "mat-tree-node", 1);
        ɵngcc0.ɵɵtemplate(2, DataTreeComponent_mat_tree_node_2_Template, 15, 11, "mat-tree-node", 2);
        ɵngcc0.ɵɵelementEnd();
        ɵngcc0.ɵɵelement(3, "span", null, 3);
    } if (rf & 2) {
        ɵngcc0.ɵɵproperty("dataSource", ctx.dataSource)("treeControl", ctx.treeControl);
        ɵngcc0.ɵɵadvance(2);
        ɵngcc0.ɵɵproperty("matTreeNodeDefWhen", ctx.hasChild);
    } }, directives: [ɵngcc10.MatTree, ɵngcc10.MatTreeNodeDef, ɵngcc10.MatTreeNode, ɵngcc10.MatTreeNodeToggle, ɵngcc10.MatTreeNodePadding, ɵngcc7.NgClass, ɵngcc1.MatButton, ɵngcc7.NgIf, ɵngcc2.MatIcon], styles: [".mat-tree-node[_ngcontent-%COMP%]{-moz-user-select:none;-ms-user-select:none;-webkit-user-select:none;cursor:move;user-select:none}.mat-tree-node.cdk-drag-preview[_ngcontent-%COMP%]{box-shadow:0 7px 8px -4px rgba(0,0,0,.2),0 12px 17px 2px rgba(0,0,0,.14),0 5px 22px 4px rgba(0,0,0,.12)}.mat-tree-node.cdk-drag-placeholder[_ngcontent-%COMP%]{opacity:0}.cdk-drop-list-dragging[_ngcontent-%COMP%]   .mat-tree-node[_ngcontent-%COMP%]:not(.cdk-drag-placeholder){transition:transform .25s cubic-bezier(0,0,.2,1)}.cdk-drag-animating[_ngcontent-%COMP%]{transition:transform .2s cubic-bezier(0,0,.2,1)}.drop-above[_ngcontent-%COMP%]{border-top:10px solid #ddd;margin-top:-10px}.drop-below[_ngcontent-%COMP%]{border-bottom:10px solid #ddd;margin-bottom:-10px}.drop-center[_ngcontent-%COMP%]{background-color:#ddd}"] });
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
    getAll: [{ type: Input }],
    emptyItem: [{ type: ViewChild, args: ['emptyItem',] }]
};
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(DataTreeComponent, [{
        type: Component,
        args: [{
                selector: 'app-data-tree',
                template: "<mat-tree [dataSource]=\"dataSource\" [treeControl]=\"treeControl\" >\r\n\t<mat-tree-node *matTreeNodeDef=\"let node\" matTreeNodeToggle matTreeNodePadding  draggable=\"true\"\r\n\t(dragstart)=\"handleDragStart($event, node);\" \t(dragover)=\"handleDragOver($event, node);\"\r\n\t(drop)=\"handleDrop($event, node);\" \t(dragend)=\"handleDragEnd($event);\"                  \r\n\t  [ngClass]=\"{'drop-above': dragNodeExpandOverArea === 'above' && dragNodeExpandOverNode === node,\r\n\t'drop-below': dragNodeExpandOverArea === 'below' && dragNodeExpandOverNode === node,\r\n\t'drop-center': dragNodeExpandOverArea === 'center' && dragNodeExpandOverNode === node}\">\r\n\t\t<button mat-icon-button disabled></button>\r\n\t\t<mat-icon *ngIf=\"node.type ==='folder'\" class=\"type-icon\" [attr.aria-label]=\"node.type + 'icon'\">\r\n\t\t\tfolder\r\n\t\t</mat-icon>\r\n\t\t{{node.name}}\r\n\t\t<button *ngIf=\"node.type ==='folder'\" (click)=\"onButtonClicked(node.id, 'newFolder')\" mat-icon-button>\r\n\t\t\t<mat-icon>create_new_folder</mat-icon>\r\n\t\t</button>\r\n\t\t<button *ngIf=\"node.type ==='folder'\" (click)=\"onButtonClicked(node.id, 'newNode')\" mat-icon-button>\r\n\t\t\t<mat-icon>playlist_add</mat-icon>\r\n\t\t</button>\r\n\t\t<button mat-icon-button (click)=\"onButtonClicked(node.id, 'delete')\">\r\n\t\t\t<mat-icon>delete</mat-icon>\r\n\t\t</button>\r\n\t\t<button mat-icon-button (click)=\"onButtonClicked(node.id, 'edit')\">\r\n\t\t\t<mat-icon>edit</mat-icon>\r\n\t\t</button>\r\n\r\n\t</mat-tree-node>\r\n\r\n\t<mat-tree-node *matTreeNodeDef=\"let node;when: hasChild\" matTreeNodePadding  draggable=\"true\"\r\n\t(dragstart)=\"handleDragStart($event, node);\" \t(dragover)=\"handleDragOver($event, node);\"\r\n\t(drop)=\"handleDrop($event, node);\" \t(dragend)=\"handleDragEnd($event);\"                  \r\n\t [ngClass]=\"{'drop-above': dragNodeExpandOverArea === 'above' && dragNodeExpandOverNode === node,\r\n\t'drop-below': dragNodeExpandOverArea === 'below' && dragNodeExpandOverNode === node,\r\n\t'drop-center': dragNodeExpandOverArea === 'center' && dragNodeExpandOverNode === node}\">\r\n\t\t<button mat-icon-button matTreeNodeToggle (click)=\"expansionModel.toggle(node.id)\"\r\n\t\t\t[attr.aria-label]=\"'toggle ' + node.name\">\r\n\t\t\t<mat-icon class=\"mat-icon-rtl-mirror\">\r\n\t\t\t\t{{treeControl.isExpanded(node) ? 'expand_more' : 'chevron_right'}}\r\n\t\t\t</mat-icon>\r\n\t\t</button>\r\n\t\t<mat-icon class=\"type-icon\" [attr.aria-label]=\"node.type + 'icon'\">\r\n\t\t\tfolder\r\n\t\t</mat-icon>\r\n\t\t{{node.name}}\r\n\t\t<button *ngIf=\"node.type ==='folder'\" (click)=\"onButtonClicked(node.id, 'newFolder')\" mat-icon-button>\r\n\t\t\t<mat-icon>create_new_folder</mat-icon>\r\n\t\t</button>\r\n\t\t<button *ngIf=\"node.type ==='folder'\" (click)=\"onButtonClicked(node.id, 'newNode')\" mat-icon-button>\r\n\t\t\t<mat-icon>playlist_add</mat-icon>\r\n\t\t</button>\r\n\t\t<button mat-icon-button (click)=\"onButtonClicked(node.id, 'delete')\">\r\n\t\t\t<mat-icon>delete</mat-icon>\r\n\t\t</button>\r\n\t\t<button mat-icon-button (click)=\"onButtonClicked(node.id, 'edit')\">\r\n\t\t\t<mat-icon>edit</mat-icon>\r\n\t\t</button>\r\n\t\t\r\n\t</mat-tree-node>\r\n</mat-tree>\r\n\r\n<span #emptyItem></span>\r\n",
                providers: [FileDatabase],
                styles: [".mat-tree-node{-moz-user-select:none;-ms-user-select:none;-webkit-user-select:none;cursor:move;user-select:none}.mat-tree-node.cdk-drag-preview{box-shadow:0 7px 8px -4px rgba(0,0,0,.2),0 12px 17px 2px rgba(0,0,0,.14),0 5px 22px 4px rgba(0,0,0,.12)}.mat-tree-node.cdk-drag-placeholder{opacity:0}.cdk-drop-list-dragging .mat-tree-node:not(.cdk-drag-placeholder){transition:transform .25s cubic-bezier(0,0,.2,1)}.cdk-drag-animating{transition:transform .2s cubic-bezier(0,0,.2,1)}.drop-above{border-top:10px solid #ddd;margin-top:-10px}.drop-below{border-bottom:10px solid #ddd;margin-bottom:-10px}.drop-center{background-color:#ddd}"]
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
        }], getAll: [{
            type: Input
        }], emptyItem: [{
            type: ViewChild,
            args: ['emptyItem']
        }] }); })();
if (false) {
    /** @type {?} */
    DataTreeComponent.prototype.createNode;
    /** @type {?} */
    DataTreeComponent.prototype.createFolder;
    /** @type {?} */
    DataTreeComponent.prototype.emitNode;
    /** @type {?} */
    DataTreeComponent.prototype.emitAllNodes;
    /** @type {?} */
    DataTreeComponent.prototype.eventNodeUpdatedSubscription;
    /** @type {?} */
    DataTreeComponent.prototype.eventCreateNodeSubscription;
    /** @type {?} */
    DataTreeComponent.prototype.eventGetAllRowsSubscription;
    /** @type {?} */
    DataTreeComponent.prototype._eventNodeUpdatedSubscription;
    /** @type {?} */
    DataTreeComponent.prototype._eventCreateNodeSubscription;
    /** @type {?} */
    DataTreeComponent.prototype._eventGetAllRowsSubscription;
    /** @type {?} */
    DataTreeComponent.prototype.treeControl;
    /** @type {?} */
    DataTreeComponent.prototype.treeFlattener;
    /** @type {?} */
    DataTreeComponent.prototype.dataSource;
    /** @type {?} */
    DataTreeComponent.prototype.expansionModel;
    /** @type {?} */
    DataTreeComponent.prototype.dragging;
    /** @type {?} */
    DataTreeComponent.prototype.expandTimeout;
    /** @type {?} */
    DataTreeComponent.prototype.expandDelay;
    /** @type {?} */
    DataTreeComponent.prototype.validateDrop;
    /** @type {?} */
    DataTreeComponent.prototype.treeData;
    /** @type {?} */
    DataTreeComponent.prototype.getAll;
    /** @type {?} */
    DataTreeComponent.prototype.dragNode;
    /** @type {?} */
    DataTreeComponent.prototype.dragNodeExpandOverWaitTimeMs;
    /** @type {?} */
    DataTreeComponent.prototype.dragNodeExpandOverNode;
    /** @type {?} */
    DataTreeComponent.prototype.dragNodeExpandOverTime;
    /** @type {?} */
    DataTreeComponent.prototype.dragNodeExpandOverArea;
    /** @type {?} */
    DataTreeComponent.prototype.emptyItem;
    /**
     * Map from flat node to nested node. This helps us finding the nested node to be modified
     * @type {?}
     */
    DataTreeComponent.prototype.flatNodeMap;
    /**
     * Map from nested node to flattened node. This helps us to keep the same object for selection
     * @type {?}
     */
    DataTreeComponent.prototype.nestedNodeMap;
    /** @type {?} */
    DataTreeComponent.prototype.transformer;
    /** @type {?} */
    DataTreeComponent.prototype._getLevel;
    /** @type {?} */
    DataTreeComponent.prototype._isExpandable;
    /** @type {?} */
    DataTreeComponent.prototype._getChildren;
    /** @type {?} */
    DataTreeComponent.prototype.hasChild;
    /** @type {?} */
    DataTreeComponent.prototype.database;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
registerLocaleData(localeCa, 'ca');
registerLocaleData(localeEs, 'es');
/**
 * Load translation assets
 * @param {?} http
 * @return {?}
 */
function createTranslateLoader(http) {
    return new TranslateHttpLoader(http, '../assets/i18n/', '.json');
}
const ɵ0 = (createTranslateLoader);
/**
 * SITMUN plugin core module
 */
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
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && ɵngcc0.ɵɵsetNgModuleScope(SitmunFrontendGuiModule, { declarations: function () { return [DataGridComponent, DataTreeComponent, BtnEditRenderedComponent, BtnCheckboxRenderedComponent, BtnCheckboxFilterComponent, DialogGridComponent, DialogFormComponent, DialogMessageComponent]; }, imports: function () { return [RouterModule,
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
        ReactiveFormsModule, DataGridComponent, DataTreeComponent, DialogGridComponent, DialogFormComponent, DialogMessageComponent, SitmunFrontendCoreModule]; } }); })();
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

export { BtnCheckboxFilterComponent, BtnCheckboxRenderedComponent, BtnEditRenderedComponent, DataGridComponent, DataTreeComponent, DialogFormComponent, DialogGridComponent, DialogMessageComponent, FileDatabase, FileFlatNode, FileNode, SitmunFrontendGuiModule, createTranslateLoader, MaterialModule as ɵa };

//# sourceMappingURL=sitmun-frontend-gui.js.map