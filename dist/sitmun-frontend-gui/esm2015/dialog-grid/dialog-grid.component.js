import { Component, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import * as i0 from "@angular/core";
import * as i1 from "@angular/material/dialog";
import * as i2 from "@angular/common";
import * as i3 from "@angular/material/button";
import * as i4 from "../data-grid/data-grid.component";
import * as i5 from "@ngx-translate/core";
const _c0 = function (a0) { return { "margin-top": a0 }; };
function DialogGridComponent_div_3_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 6);
    i0.ɵɵelementStart(1, "app-data-grid", 7);
    i0.ɵɵlistener("getSelectedRows", function DialogGridComponent_div_3_Template_app_data_grid_getSelectedRows_1_listener($event) { i0.ɵɵrestoreView(_r4); const ctx_r3 = i0.ɵɵnextContext(); return ctx_r3.joinRowsReceived($event); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const getAll_r1 = ctx.$implicit;
    const i_r2 = ctx.index;
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵproperty("ngStyle", i0.ɵɵpureFunction1(9, _c0, i_r2 > 0 ? "100px" : "0px"));
    i0.ɵɵadvance(1);
    i0.ɵɵproperty("columnDefs", ctx_r0.columnDefsTable[i_r2])("themeGrid", ctx_r0.themeGrid)("getAll", getAll_r1)("globalSearch", true)("singleSelection", ctx_r0.singleSelectionTable[i_r2])("title", ctx_r0.titlesTable[i_r2])("nonEditable", ctx_r0.nonEditable)("eventGetSelectedRowsSubscription", ctx_r0.getAllRows.asObservable());
} }
export class DialogGridComponent {
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
/** @nocollapse */ DialogGridComponent.ɵfac = function DialogGridComponent_Factory(t) { return new (t || DialogGridComponent)(i0.ɵɵdirectiveInject(i1.MatDialogRef)); };
/** @nocollapse */ DialogGridComponent.ɵcmp = i0.ɵɵdefineComponent({ type: DialogGridComponent, selectors: [["app-dialog-grid"]], outputs: { joinTables: "joinTables" }, decls: 11, vars: 8, consts: [["mat-dialog-title", ""], [1, "dialogConent"], ["class", "appDialogDataGridDiv", 3, "ngStyle", 4, "ngFor", "ngForOf"], ["mat-dialog-actions", "", "align", "end"], ["mat-button", "", 3, "click"], ["mat-button", "", "cdkFocusInitial", "", 3, "click"], [1, "appDialogDataGridDiv", 3, "ngStyle"], [3, "columnDefs", "themeGrid", "getAll", "globalSearch", "singleSelection", "title", "nonEditable", "eventGetSelectedRowsSubscription", "getSelectedRows"]], template: function DialogGridComponent_Template(rf, ctx) { if (rf & 1) {
        i0.ɵɵelementStart(0, "h4", 0);
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
    } if (rf & 2) {
        i0.ɵɵadvance(1);
        i0.ɵɵtextInterpolate(ctx.title);
        i0.ɵɵadvance(2);
        i0.ɵɵproperty("ngForOf", ctx.getAllsTable);
        i0.ɵɵadvance(3);
        i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(7, 4, "cancel"));
        i0.ɵɵadvance(3);
        i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(10, 6, "add"));
    } }, directives: [i1.MatDialogTitle, i1.MatDialogContent, i2.NgForOf, i1.MatDialogActions, i3.MatButton, i2.NgStyle, i4.DataGridComponent], pipes: [i5.TranslatePipe], styles: [".dialogConent[_ngcontent-%COMP%]{height:100%;margin:inherit!important;max-height:60vh!important;overflow:auto;padding:inherit!important;width:100%}"] });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(DialogGridComponent, [{
        type: Component,
        args: [{
                selector: 'app-dialog-grid',
                templateUrl: './dialog-grid.component.html',
                styleUrls: ['./dialog-grid.component.css']
            }]
    }], function () { return [{ type: i1.MatDialogRef }]; }, { joinTables: [{
            type: Output
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLWdyaWQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Ii4uLy4uLy4uL3NyYy9tYWluL2FuZ3VsYXItbGlicmFyeS9wcm9qZWN0cy9zaXRtdW4tZnJvbnRlbmQtZ3VpL3NyYy9saWIvIiwic291cmNlcyI6WyJkaWFsb2ctZ3JpZC9kaWFsb2ctZ3JpZC5jb21wb25lbnQudHMiLCJkaWFsb2ctZ3JpZC9kaWFsb2ctZ3JpZC5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFpQixNQUFNLEVBQUUsWUFBWSxFQUFVLE1BQU0sZUFBZSxDQUFDO0FBQ3ZGLE9BQU8sRUFBYyxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDM0MsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLDBCQUEwQixDQUFDOzs7Ozs7Ozs7O0lDQXRELDhCQUNFO0lBQUEsd0NBR2dCO0lBRG9HLG9PQUE0QztJQUNoSyxpQkFBZ0I7SUFDbEIsaUJBQU07Ozs7O0lBTGdGLGdGQUE2QztJQUVqSSxlQUFpQztJQUFqQyx5REFBaUMsK0JBQUEscUJBQUEsc0JBQUEsc0RBQUEsbUNBQUEsbUNBQUEsc0VBQUE7O0FEWXJDLE1BQU0sT0FBTyxtQkFBbUI7SUF1QjlCLFlBQW9CLFNBQTRDO1FBQTVDLGNBQVMsR0FBVCxTQUFTLENBQW1DO1FBcEJoRSxlQUFVLEdBQXFCLElBQUksT0FBTyxFQUFZLENBQUM7UUFHdkQsb0JBQWUsR0FBaUIsRUFBRSxDQUFDO1FBbUJqQyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFDckMsMkJBQTJCO1FBQzNCLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUVGLFFBQVE7UUFFTixJQUFJLElBQUksQ0FBQyw0QkFBNEIsRUFBRTtZQUNyQyxJQUFJLENBQUMsNkJBQTZCLEdBQUcsSUFBSSxDQUFDLDRCQUE0QixDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUU7Z0JBQ3BGLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1lBQzVCLENBQUMsQ0FBQyxDQUFDO1NBQ0o7SUFFSCxDQUFDO0lBRUQsa0JBQWtCO1FBQ2hCLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFFRCxnQkFBZ0IsQ0FBQyxJQUFXO1FBRXhCLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1FBQzdCLElBQUcsSUFBSSxDQUFDLHFCQUFxQixLQUFLLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUMxRDtZQUNFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQ2pDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1NBQ25DO0lBQ0wsQ0FBQztJQUVELEtBQUssQ0FBQyxTQUFTO1FBQ2IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBQyxLQUFLLEVBQUMsS0FBSyxFQUFDLElBQUksRUFBRSxTQUFTLEVBQUMsQ0FBQyxDQUFDO0lBQ3RELENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBQyxLQUFLLEVBQUMsUUFBUSxFQUFDLENBQUMsQ0FBQztJQUN6QyxDQUFDOzt5R0E3RFUsbUJBQW1COzJFQUFuQixtQkFBbUI7UUNoQmhDLDZCQUFxQjtRQUFBLFlBQVM7UUFBQSxpQkFBSztRQUNuQyw2Q0FDRTtRQUFBLHFFQUNFO1FBS0osaUJBQXFCO1FBQ3JCLDhCQUNFO1FBQUEsaUNBQTRDO1FBQXhCLGdHQUFTLGlCQUFhLElBQUM7UUFBQyxZQUF3Qjs7UUFBQSxpQkFBUztRQUM3RSxpQ0FBbUU7UUFBL0MsZ0dBQVMsd0JBQW9CLElBQUM7UUFBaUIsWUFBcUI7O1FBQUEsaUJBQVM7UUFDbkcsaUJBQU07O1FBWmUsZUFBUztRQUFULCtCQUFTO1FBRXZCLGVBQWtEO1FBQWxELDBDQUFrRDtRQVFYLGVBQXdCO1FBQXhCLG9EQUF3QjtRQUNELGVBQXFCO1FBQXJCLGtEQUFxQjs7a0RESzdFLG1CQUFtQjtjQUwvQixTQUFTO2VBQUM7Z0JBQ1QsUUFBUSxFQUFFLGlCQUFpQjtnQkFDM0IsV0FBVyxFQUFFLDhCQUE4QjtnQkFDM0MsU0FBUyxFQUFFLENBQUMsNkJBQTZCLENBQUM7YUFDM0M7K0RBbUJXLFVBQVU7a0JBQW5CLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyLCBJbmplY3QgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBNYXREaWFsb2dSZWYgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9kaWFsb2cnO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBEaWFsb2dEYXRhIHtcclxuICBfR2V0QWxsc1RhYmxlOiAgQXJyYXk8KCkgPT4gT2JzZXJ2YWJsZTxhbnk+PjtcclxuICBfY29sdW1uRGVmc1RhYmxlOiBBcnJheTxhbnlbXT47XHJcbiAgX3NpbmdsZVNlbGVjdGlvblRhYmxlOiBBcnJheTxib29sZWFuPjtcclxufVxyXG5cclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnYXBwLWRpYWxvZy1ncmlkJyxcclxuICB0ZW1wbGF0ZVVybDogJy4vZGlhbG9nLWdyaWQuY29tcG9uZW50Lmh0bWwnLFxyXG4gIHN0eWxlVXJsczogWycuL2RpYWxvZy1ncmlkLmNvbXBvbmVudC5jc3MnXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgRGlhbG9nR3JpZENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcblxyXG4gIHRpdGxlOiBzdHJpbmc7XHJcbiAgZ2V0QWxsUm93czogU3ViamVjdDxib29sZWFuPiA9IG5ldyBTdWJqZWN0IDxib29sZWFuPigpO1xyXG4gIHByaXZhdGUgX2FkZEJ1dHRvbkNsaWNrZWRTdWJzY3JpcHRpb246IGFueTtcclxuICB0YWJsZXNSZWNlaXZlZENvdW50ZXI6IG51bWJlcjtcclxuICBhbGxSb3dzUmVjZWl2ZWQ6IEFycmF5PGFueVtdPiA9IFtdO1xyXG5cclxuICAvL0lucHV0c1xyXG4gIHRoZW1lR3JpZDogYW55O1xyXG4gIGdldEFsbHNUYWJsZTogQXJyYXk8KCkgPT4gT2JzZXJ2YWJsZTxhbnk+PjtcclxuICBjb2x1bW5EZWZzVGFibGU6IEFycmF5PGFueVtdPjtcclxuICBzaW5nbGVTZWxlY3Rpb25UYWJsZTogQXJyYXk8Ym9vbGVhbj47XHJcbiAgdGl0bGVzVGFibGU6IEFycmF5PHN0cmluZz47XHJcbiAgYWRkQnV0dG9uQ2xpY2tlZFN1YnNjcmlwdGlvbjogT2JzZXJ2YWJsZSA8Ym9vbGVhbj4gO1xyXG4gIG5vbkVkaXRhYmxlOiBib29sZWFuO1xyXG5cclxuICAvL091dHB1dHNcclxuICBAT3V0cHV0KCkgam9pblRhYmxlcyA6IEV2ZW50RW1pdHRlcjxBcnJheTxhbnlbXT4+O1xyXG5cclxuICBcclxuXHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZGlhbG9nUmVmOiBNYXREaWFsb2dSZWY8RGlhbG9nR3JpZENvbXBvbmVudD4pIHtcclxuICAgIFxyXG4gICAgdGhpcy5qb2luVGFibGVzID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gICAgLy8gdGhpcy5ub25FZGl0YWJsZSA9IHRydWU7XHJcbiAgICB0aGlzLnRhYmxlc1JlY2VpdmVkQ291bnRlciA9IDA7XHJcbiAgIH1cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcblxyXG4gICAgaWYgKHRoaXMuYWRkQnV0dG9uQ2xpY2tlZFN1YnNjcmlwdGlvbikge1xyXG4gICAgICB0aGlzLl9hZGRCdXR0b25DbGlja2VkU3Vic2NyaXB0aW9uID0gdGhpcy5hZGRCdXR0b25DbGlja2VkU3Vic2NyaXB0aW9uLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5nZXRBbGxTZWxlY3RlZFJvd3MoKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcbiAgZ2V0QWxsU2VsZWN0ZWRSb3dzKCkge1xyXG4gICAgdGhpcy5nZXRBbGxSb3dzLm5leHQodHJ1ZSk7XHJcbiAgfVxyXG5cclxuICBqb2luUm93c1JlY2VpdmVkKGRhdGE6IGFueVtdKVxyXG4gIHtcclxuICAgICAgdGhpcy5hbGxSb3dzUmVjZWl2ZWQucHVzaChkYXRhKTtcclxuICAgICAgdGhpcy50YWJsZXNSZWNlaXZlZENvdW50ZXIrKztcclxuICAgICAgaWYodGhpcy50YWJsZXNSZWNlaXZlZENvdW50ZXIgPT09IHRoaXMuZ2V0QWxsc1RhYmxlLmxlbmd0aClcclxuICAgICAge1xyXG4gICAgICAgIHRoaXMuZG9BZGQodGhpcy5hbGxSb3dzUmVjZWl2ZWQpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMuYWxsUm93c1JlY2VpdmVkKTtcclxuICAgICAgfVxyXG4gIH1cclxuXHJcbiAgZG9BZGQocm93c1RvQWRkKXtcclxuICAgIHRoaXMuZGlhbG9nUmVmLmNsb3NlKHtldmVudDonQWRkJyxkYXRhOiByb3dzVG9BZGR9KTtcclxuICB9XHJcblxyXG4gIGNsb3NlRGlhbG9nKCl7XHJcbiAgICB0aGlzLmRpYWxvZ1JlZi5jbG9zZSh7ZXZlbnQ6J0NhbmNlbCd9KTtcclxuICB9XHJcblxyXG59XHJcbiIsIjxoNCBtYXQtZGlhbG9nLXRpdGxlPnt7dGl0bGV9fTwvaDQ+XHJcbjxtYXQtZGlhbG9nLWNvbnRlbnQgY2xhc3M9XCJkaWFsb2dDb25lbnRcIj5cclxuICA8ZGl2ICpuZ0Zvcj1cImxldCBnZXRBbGwgb2YgZ2V0QWxsc1RhYmxlOyBsZXQgaSA9IGluZGV4XCIgY2xhc3M9XCJhcHBEaWFsb2dEYXRhR3JpZERpdlwiICBbbmdTdHlsZV09XCJ7J21hcmdpbi10b3AnOiBpPjA/JzEwMHB4JzonMHB4J31cIj5cclxuICAgIDxhcHAtZGF0YS1ncmlkIFxyXG4gICAgW2NvbHVtbkRlZnNdPVwiY29sdW1uRGVmc1RhYmxlW2ldXCIgW3RoZW1lR3JpZF09J3RoZW1lR3JpZCcgIFtnZXRBbGxdPSdnZXRBbGwnIFtnbG9iYWxTZWFyY2hdPXRydWUgW3NpbmdsZVNlbGVjdGlvbl09XCJzaW5nbGVTZWxlY3Rpb25UYWJsZVtpXVwiXHJcbiAgICBbdGl0bGVdPVwidGl0bGVzVGFibGVbaV1cIiBbbm9uRWRpdGFibGVdPSdub25FZGl0YWJsZScgW2V2ZW50R2V0U2VsZWN0ZWRSb3dzU3Vic2NyaXB0aW9uXT1cImdldEFsbFJvd3MuYXNPYnNlcnZhYmxlKClcIiAoZ2V0U2VsZWN0ZWRSb3dzKT0nam9pblJvd3NSZWNlaXZlZCgkZXZlbnQpJyA+XHJcbiAgICA8L2FwcC1kYXRhLWdyaWQ+XHJcbiAgPC9kaXY+XHJcbjwvbWF0LWRpYWxvZy1jb250ZW50PlxyXG48ZGl2IG1hdC1kaWFsb2ctYWN0aW9ucyBhbGlnbj1cImVuZFwiPlxyXG4gIDxidXR0b24gbWF0LWJ1dHRvbiAgKGNsaWNrKT1cImNsb3NlRGlhbG9nKClcIj57e1wiY2FuY2VsXCIgfCB0cmFuc2xhdGV9fTwvYnV0dG9uPlxyXG4gIDxidXR0b24gbWF0LWJ1dHRvbiAgKGNsaWNrKT1cImdldEFsbFNlbGVjdGVkUm93cygpXCIgY2RrRm9jdXNJbml0aWFsPnt7XCJhZGRcIiB8IHRyYW5zbGF0ZX19PC9idXR0b24+XHJcbjwvZGl2PlxyXG4iXX0=