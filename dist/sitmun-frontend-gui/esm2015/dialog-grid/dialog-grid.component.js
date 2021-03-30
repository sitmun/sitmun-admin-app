/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
/**
 * @record
 */
export function DialogData() { }
/** @type {?} */
DialogData.prototype._GetAllsTable;
/** @type {?} */
DialogData.prototype._columnDefsTable;
/** @type {?} */
DialogData.prototype._singleSelectionTable;
export class DialogGridComponent {
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
DialogGridComponent.decorators = [
    { type: Component, args: [{
                selector: 'app-dialog-grid',
                template: "<h5 mat-dialog-title class=\"titleDialog\">{{title}}</h5>\r\n<mat-dialog-content class=\"dialogConent\">\r\n  <div *ngFor=\"let getAll of getAllsTable; let i = index\" class=\"appDialogDataGridDiv\"  [ngStyle]=\"{'margin-top': i>0?'100px':'0px'}\">\r\n    <app-data-grid \r\n    [columnDefs]=\"columnDefsTable[i]\" [themeGrid]='themeGrid' [changeHeightButton]='changeHeightButton' [defaultHeight]='heightByDefault'  [getAll]='getAll' [globalSearch]=true [singleSelection]=\"singleSelectionTable[i]\"\r\n    [title]=\"titlesTable[i]\" [nonEditable]='nonEditable' [eventGetSelectedRowsSubscription]=\"getAllRows.asObservable()\" (getSelectedRows)='joinRowsReceived($event)' >\r\n    </app-data-grid>\r\n  </div>\r\n</mat-dialog-content>\r\n<div mat-dialog-actions align=\"end\">\r\n  <button mat-flat-button class=\"returnButton\" (click)=\"closeDialog()\">{{\"cancel\" | translate}}</button>\r\n  <button mat-flat-button class=\"saveButton\" (click)=\"getAllSelectedRows()\" cdkFocusInitial>{{\"add\" | translate}}</button>\r\n</div>\r\n\r\n",
                styles: [".dialogConent{height:100%;margin:inherit!important;max-height:60vh!important;overflow:auto;padding:inherit!important;width:100%}.titleDialog{margin-bottom:15px!important;margin-top:inherit!important}"]
            }] }
];
/** @nocollapse */
DialogGridComponent.ctorParameters = () => [
    { type: MatDialogRef }
];
DialogGridComponent.propDecorators = {
    joinTables: [{ type: Output }]
};
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
    DialogGridComponent.prototype.changeHeightButton;
    /** @type {?} */
    DialogGridComponent.prototype.heightByDefault;
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLWdyaWQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Ii4uLy4uLy4uL3NyYy9tYWluL2FuZ3VsYXItbGlicmFyeS9wcm9qZWN0cy9zaXRtdW4tZnJvbnRlbmQtZ3VpL3NyYy9saWIvIiwic291cmNlcyI6WyJkaWFsb2ctZ3JpZC9kaWFsb2ctZ3JpZC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQWlCLE1BQU0sRUFBRSxZQUFZLEVBQVUsTUFBTSxlQUFlLENBQUM7QUFDdkYsT0FBTyxFQUFjLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUMzQyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7Ozs7Ozs7Ozs7O0FBY3hELE1BQU0sT0FBTyxtQkFBbUI7Ozs7SUF5QjlCLFlBQW9CLFNBQTRDO1FBQTVDLGNBQVMsR0FBVCxTQUFTLENBQW1DOzBCQXRCakMsSUFBSSxPQUFPLEVBQVk7K0JBR3RCLEVBQUU7UUFxQmhDLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQzs7UUFFckMsSUFBSSxDQUFDLHFCQUFxQixHQUFHLENBQUMsQ0FBQztLQUMvQjs7OztJQUVGLFFBQVE7UUFFTixJQUFJLElBQUksQ0FBQyw0QkFBNEIsRUFBRTtZQUNyQyxJQUFJLENBQUMsNkJBQTZCLEdBQUcsSUFBSSxDQUFDLDRCQUE0QixDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUU7Z0JBQ3BGLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO2FBQzNCLENBQUMsQ0FBQztTQUNKO0tBRUY7Ozs7SUFFRCxrQkFBa0I7UUFDaEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDNUI7Ozs7O0lBRUQsZ0JBQWdCLENBQUMsSUFBVztRQUV4QixJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNoQyxJQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQztRQUM3QixJQUFHLElBQUksQ0FBQyxxQkFBcUIsS0FBSyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFDMUQ7WUFDRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUNqQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztTQUNuQztLQUNKOzs7OztJQUVELEtBQUssQ0FBQyxTQUFTO1FBQ2IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBQyxLQUFLLEVBQUMsS0FBSyxFQUFDLElBQUksRUFBRSxTQUFTLEVBQUMsQ0FBQyxDQUFDO0tBQ3JEOzs7O0lBRUQsV0FBVztRQUNULElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEVBQUMsS0FBSyxFQUFDLFFBQVEsRUFBQyxDQUFDLENBQUM7S0FDeEM7OztZQXBFRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGlCQUFpQjtnQkFDM0IsNGhDQUEyQzs7YUFFNUM7Ozs7WUFiUSxZQUFZOzs7eUJBa0NsQixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIElucHV0LCBPdXRwdXQsIEV2ZW50RW1pdHRlciwgSW5qZWN0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUsIFN1YmplY3QgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgTWF0RGlhbG9nUmVmIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvZGlhbG9nJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgRGlhbG9nRGF0YSB7XHJcbiAgX0dldEFsbHNUYWJsZTogIEFycmF5PCgpID0+IE9ic2VydmFibGU8YW55Pj47XHJcbiAgX2NvbHVtbkRlZnNUYWJsZTogQXJyYXk8YW55W10+O1xyXG4gIF9zaW5nbGVTZWxlY3Rpb25UYWJsZTogQXJyYXk8Ym9vbGVhbj47XHJcbn1cclxuXHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2FwcC1kaWFsb2ctZ3JpZCcsXHJcbiAgdGVtcGxhdGVVcmw6ICcuL2RpYWxvZy1ncmlkLmNvbXBvbmVudC5odG1sJyxcclxuICBzdHlsZVVybHM6IFsnLi9kaWFsb2ctZ3JpZC5jb21wb25lbnQuc2NzcyddXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBEaWFsb2dHcmlkQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuXHJcbiAgdGl0bGU6IHN0cmluZztcclxuICBnZXRBbGxSb3dzOiBTdWJqZWN0PGJvb2xlYW4+ID0gbmV3IFN1YmplY3QgPGJvb2xlYW4+KCk7XHJcbiAgcHJpdmF0ZSBfYWRkQnV0dG9uQ2xpY2tlZFN1YnNjcmlwdGlvbjogYW55O1xyXG4gIHRhYmxlc1JlY2VpdmVkQ291bnRlcjogbnVtYmVyO1xyXG4gIGFsbFJvd3NSZWNlaXZlZDogQXJyYXk8YW55W10+ID0gW107XHJcbiAgY2hhbmdlSGVpZ2h0QnV0dG9uIDogYm9vbGVhbjtcclxuICBoZWlnaHRCeURlZmF1bHQgOiBhbnk7XHJcblxyXG4gIC8vSW5wdXRzXHJcbiAgdGhlbWVHcmlkOiBhbnk7XHJcbiAgZ2V0QWxsc1RhYmxlOiBBcnJheTwoKSA9PiBPYnNlcnZhYmxlPGFueT4+O1xyXG4gIGNvbHVtbkRlZnNUYWJsZTogQXJyYXk8YW55W10+O1xyXG4gIHNpbmdsZVNlbGVjdGlvblRhYmxlOiBBcnJheTxib29sZWFuPjtcclxuICB0aXRsZXNUYWJsZTogQXJyYXk8c3RyaW5nPjtcclxuICBhZGRCdXR0b25DbGlja2VkU3Vic2NyaXB0aW9uOiBPYnNlcnZhYmxlIDxib29sZWFuPiA7XHJcbiAgbm9uRWRpdGFibGU6IGJvb2xlYW47XHJcblxyXG4gIC8vT3V0cHV0c1xyXG4gIEBPdXRwdXQoKSBqb2luVGFibGVzIDogRXZlbnRFbWl0dGVyPEFycmF5PGFueVtdPj47XHJcblxyXG4gIFxyXG5cclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBkaWFsb2dSZWY6IE1hdERpYWxvZ1JlZjxEaWFsb2dHcmlkQ29tcG9uZW50Pikge1xyXG4gICAgXHJcbiAgICB0aGlzLmpvaW5UYWJsZXMgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgICAvLyB0aGlzLm5vbkVkaXRhYmxlID0gdHJ1ZTtcclxuICAgIHRoaXMudGFibGVzUmVjZWl2ZWRDb3VudGVyID0gMDtcclxuICAgfVxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuXHJcbiAgICBpZiAodGhpcy5hZGRCdXR0b25DbGlja2VkU3Vic2NyaXB0aW9uKSB7XHJcbiAgICAgIHRoaXMuX2FkZEJ1dHRvbkNsaWNrZWRTdWJzY3JpcHRpb24gPSB0aGlzLmFkZEJ1dHRvbkNsaWNrZWRTdWJzY3JpcHRpb24uc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgICB0aGlzLmdldEFsbFNlbGVjdGVkUm93cygpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxuICBnZXRBbGxTZWxlY3RlZFJvd3MoKSB7XHJcbiAgICB0aGlzLmdldEFsbFJvd3MubmV4dCh0cnVlKTtcclxuICB9XHJcblxyXG4gIGpvaW5Sb3dzUmVjZWl2ZWQoZGF0YTogYW55W10pXHJcbiAge1xyXG4gICAgICB0aGlzLmFsbFJvd3NSZWNlaXZlZC5wdXNoKGRhdGEpO1xyXG4gICAgICB0aGlzLnRhYmxlc1JlY2VpdmVkQ291bnRlcisrO1xyXG4gICAgICBpZih0aGlzLnRhYmxlc1JlY2VpdmVkQ291bnRlciA9PT0gdGhpcy5nZXRBbGxzVGFibGUubGVuZ3RoKVxyXG4gICAgICB7XHJcbiAgICAgICAgdGhpcy5kb0FkZCh0aGlzLmFsbFJvd3NSZWNlaXZlZCk7XHJcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5hbGxSb3dzUmVjZWl2ZWQpO1xyXG4gICAgICB9XHJcbiAgfVxyXG5cclxuICBkb0FkZChyb3dzVG9BZGQpe1xyXG4gICAgdGhpcy5kaWFsb2dSZWYuY2xvc2Uoe2V2ZW50OidBZGQnLGRhdGE6IHJvd3NUb0FkZH0pO1xyXG4gIH1cclxuXHJcbiAgY2xvc2VEaWFsb2coKXtcclxuICAgIHRoaXMuZGlhbG9nUmVmLmNsb3NlKHtldmVudDonQ2FuY2VsJ30pO1xyXG4gIH1cclxuXHJcbn1cclxuIl19