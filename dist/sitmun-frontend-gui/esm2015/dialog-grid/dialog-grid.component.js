import { Component, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
export class DialogGridComponent {
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
DialogGridComponent.decorators = [
    { type: Component, args: [{
                selector: 'app-dialog-grid',
                template: "<h5 mat-dialog-title class=\"titleDialog\">{{title}}</h5>\r\n<mat-dialog-content class=\"dialogConent\">\r\n  <div *ngFor=\"let getAll of getAllsTable; let i = index\" class=\"appDialogDataGridDiv\"  [ngStyle]=\"{'margin-top': i>0?'100px':'0px'}\">\r\n    <app-data-grid \r\n    [columnDefs]=\"columnDefsTable[i]\" [themeGrid]='themeGrid' [changeHeightButton]='changeHeightButton' [defaultHeight]='heightByDefault'  [getAll]='getAll' [globalSearch]=true [singleSelection]=\"singleSelectionTable[i]\"\r\n    [title]=\"titlesTable[i]\" [defaultColumnSorting]='orderTable.length>=i?orderTable[i]:null' [nonEditable]='nonEditable'\r\n     [eventGetSelectedRowsSubscription]=\"getAllRows.asObservable()\" [addFieldRestriction]='addFieldRestriction.length>=i?addFieldRestriction[i]:null' \r\n     [currentData]='currentData.length>=i?currentData[i]:null' [fieldRestrictionWithDifferentName]='fieldRestrictionWithDifferentName.length>=i?fieldRestrictionWithDifferentName[i]:null' (getSelectedRows)='joinRowsReceived($event)' >\r\n    </app-data-grid>\r\n  </div>\r\n</mat-dialog-content>\r\n<div mat-dialog-actions align=\"end\">\r\n  <button mat-flat-button class=\"returnButton\" (click)=\"closeDialog()\">{{\"cancel\" | translate}}</button>\r\n  <button mat-flat-button class=\"saveButton\" (click)=\"getAllSelectedRows()\" cdkFocusInitial>{{\"add\" | translate}}</button>\r\n</div>\r\n\r\n",
                styles: [".dialogConent{margin:inherit!important;padding:inherit!important;max-height:60vh!important;height:100%;width:100%;overflow:auto}.titleDialog{margin-top:inherit!important;margin-bottom:15px!important}"]
            },] }
];
/** @nocollapse */
DialogGridComponent.ctorParameters = () => [
    { type: MatDialogRef }
];
DialogGridComponent.propDecorators = {
    joinTables: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLWdyaWQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL21haW4vYW5ndWxhci1saWJyYXJ5L3Byb2plY3RzL3NpdG11bi1mcm9udGVuZC1ndWkvc3JjL2xpYi9kaWFsb2ctZ3JpZC9kaWFsb2ctZ3JpZC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBaUIsTUFBTSxFQUFFLFlBQVksRUFBVSxNQUFNLGVBQWUsQ0FBQztBQUN2RixPQUFPLEVBQWMsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQWN4RCxNQUFNLE9BQU8sbUJBQW1CO0lBNkI5QixZQUFvQixTQUE0QztRQUE1QyxjQUFTLEdBQVQsU0FBUyxDQUFtQztRQTFCaEUsZUFBVSxHQUFxQixJQUFJLE9BQU8sRUFBWSxDQUFDO1FBR3ZELG9CQUFlLEdBQWlCLEVBQUUsQ0FBQztRQVVuQyxlQUFVLEdBQWtCLEVBQUUsQ0FBQztRQUcvQix3QkFBbUIsR0FBZSxFQUFFLENBQUM7UUFDckMsc0NBQWlDLEdBQWUsRUFBRSxDQUFDO1FBQ25ELGdCQUFXLEdBQWUsRUFBRSxDQUFDO1FBVTNCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUNyQywyQkFBMkI7UUFDM0IsSUFBSSxDQUFDLHFCQUFxQixHQUFHLENBQUMsQ0FBQztJQUNoQyxDQUFDO0lBRUYsUUFBUTtRQUVOLElBQUksSUFBSSxDQUFDLDRCQUE0QixFQUFFO1lBQ3JDLElBQUksQ0FBQyw2QkFBNkIsR0FBRyxJQUFJLENBQUMsNEJBQTRCLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRTtnQkFDcEYsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7WUFDNUIsQ0FBQyxDQUFDLENBQUM7U0FDSjtJQUVILENBQUM7SUFFRCxrQkFBa0I7UUFDaEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQUVELGdCQUFnQixDQUFDLElBQVc7UUFFeEIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDaEMsSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7UUFDN0IsSUFBRyxJQUFJLENBQUMscUJBQXFCLEtBQUssSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQzFEO1lBQ0UsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDakMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7U0FDbkM7SUFDTCxDQUFDO0lBRUQsS0FBSyxDQUFDLFNBQVM7UUFDYixJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFDLEtBQUssRUFBQyxLQUFLLEVBQUMsSUFBSSxFQUFFLFNBQVMsRUFBQyxDQUFDLENBQUM7SUFDdEQsQ0FBQztJQUVELFdBQVc7UUFDVCxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFDLEtBQUssRUFBQyxRQUFRLEVBQUMsQ0FBQyxDQUFDO0lBQ3pDLENBQUM7OztZQXhFRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGlCQUFpQjtnQkFDM0IsczNDQUEyQzs7YUFFNUM7Ozs7WUFiUSxZQUFZOzs7eUJBc0NsQixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIElucHV0LCBPdXRwdXQsIEV2ZW50RW1pdHRlciwgSW5qZWN0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUsIFN1YmplY3QgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgTWF0RGlhbG9nUmVmIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvZGlhbG9nJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgRGlhbG9nRGF0YSB7XHJcbiAgX0dldEFsbHNUYWJsZTogIEFycmF5PCgpID0+IE9ic2VydmFibGU8YW55Pj47XHJcbiAgX2NvbHVtbkRlZnNUYWJsZTogQXJyYXk8YW55W10+O1xyXG4gIF9zaW5nbGVTZWxlY3Rpb25UYWJsZTogQXJyYXk8Ym9vbGVhbj47XHJcbn1cclxuXHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2FwcC1kaWFsb2ctZ3JpZCcsXHJcbiAgdGVtcGxhdGVVcmw6ICcuL2RpYWxvZy1ncmlkLmNvbXBvbmVudC5odG1sJyxcclxuICBzdHlsZVVybHM6IFsnLi9kaWFsb2ctZ3JpZC5jb21wb25lbnQuc2NzcyddXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBEaWFsb2dHcmlkQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuXHJcbiAgdGl0bGU6IHN0cmluZztcclxuICBnZXRBbGxSb3dzOiBTdWJqZWN0PGJvb2xlYW4+ID0gbmV3IFN1YmplY3QgPGJvb2xlYW4+KCk7XHJcbiAgcHJpdmF0ZSBfYWRkQnV0dG9uQ2xpY2tlZFN1YnNjcmlwdGlvbjogYW55O1xyXG4gIHRhYmxlc1JlY2VpdmVkQ291bnRlcjogbnVtYmVyO1xyXG4gIGFsbFJvd3NSZWNlaXZlZDogQXJyYXk8YW55W10+ID0gW107XHJcbiAgY2hhbmdlSGVpZ2h0QnV0dG9uIDogYm9vbGVhbjtcclxuICBoZWlnaHRCeURlZmF1bHQgOiBhbnk7XHJcblxyXG4gIC8vSW5wdXRzXHJcbiAgdGhlbWVHcmlkOiBhbnk7XHJcbiAgZ2V0QWxsc1RhYmxlOiBBcnJheTwoKSA9PiBPYnNlcnZhYmxlPGFueT4+O1xyXG4gIGNvbHVtbkRlZnNUYWJsZTogQXJyYXk8YW55W10+O1xyXG4gIHNpbmdsZVNlbGVjdGlvblRhYmxlOiBBcnJheTxib29sZWFuPjtcclxuICB0aXRsZXNUYWJsZTogQXJyYXk8c3RyaW5nPjtcclxuICBvcmRlclRhYmxlOiBBcnJheTxzdHJpbmc+ID0gW107XHJcbiAgYWRkQnV0dG9uQ2xpY2tlZFN1YnNjcmlwdGlvbjogT2JzZXJ2YWJsZSA8Ym9vbGVhbj4gO1xyXG4gIG5vbkVkaXRhYmxlOiBib29sZWFuO1xyXG4gIGFkZEZpZWxkUmVzdHJpY3Rpb246IEFycmF5PGFueT4gPSBbXTtcclxuICBmaWVsZFJlc3RyaWN0aW9uV2l0aERpZmZlcmVudE5hbWU6IEFycmF5PGFueT4gPSBbXTtcclxuICBjdXJyZW50RGF0YTogQXJyYXk8YW55PiA9IFtdO1xyXG5cclxuICAvL091dHB1dHNcclxuICBAT3V0cHV0KCkgam9pblRhYmxlcyA6IEV2ZW50RW1pdHRlcjxBcnJheTxhbnlbXT4+O1xyXG5cclxuICBcclxuXHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZGlhbG9nUmVmOiBNYXREaWFsb2dSZWY8RGlhbG9nR3JpZENvbXBvbmVudD4pIHtcclxuICAgIFxyXG4gICAgdGhpcy5qb2luVGFibGVzID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gICAgLy8gdGhpcy5ub25FZGl0YWJsZSA9IHRydWU7XHJcbiAgICB0aGlzLnRhYmxlc1JlY2VpdmVkQ291bnRlciA9IDA7XHJcbiAgIH1cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcblxyXG4gICAgaWYgKHRoaXMuYWRkQnV0dG9uQ2xpY2tlZFN1YnNjcmlwdGlvbikge1xyXG4gICAgICB0aGlzLl9hZGRCdXR0b25DbGlja2VkU3Vic2NyaXB0aW9uID0gdGhpcy5hZGRCdXR0b25DbGlja2VkU3Vic2NyaXB0aW9uLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5nZXRBbGxTZWxlY3RlZFJvd3MoKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcbiAgZ2V0QWxsU2VsZWN0ZWRSb3dzKCkge1xyXG4gICAgdGhpcy5nZXRBbGxSb3dzLm5leHQodHJ1ZSk7XHJcbiAgfVxyXG5cclxuICBqb2luUm93c1JlY2VpdmVkKGRhdGE6IGFueVtdKVxyXG4gIHtcclxuICAgICAgdGhpcy5hbGxSb3dzUmVjZWl2ZWQucHVzaChkYXRhKTtcclxuICAgICAgdGhpcy50YWJsZXNSZWNlaXZlZENvdW50ZXIrKztcclxuICAgICAgaWYodGhpcy50YWJsZXNSZWNlaXZlZENvdW50ZXIgPT09IHRoaXMuZ2V0QWxsc1RhYmxlLmxlbmd0aClcclxuICAgICAge1xyXG4gICAgICAgIHRoaXMuZG9BZGQodGhpcy5hbGxSb3dzUmVjZWl2ZWQpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMuYWxsUm93c1JlY2VpdmVkKTtcclxuICAgICAgfVxyXG4gIH1cclxuXHJcbiAgZG9BZGQocm93c1RvQWRkKXtcclxuICAgIHRoaXMuZGlhbG9nUmVmLmNsb3NlKHtldmVudDonQWRkJyxkYXRhOiByb3dzVG9BZGR9KTtcclxuICB9XHJcblxyXG4gIGNsb3NlRGlhbG9nKCl7XHJcbiAgICB0aGlzLmRpYWxvZ1JlZi5jbG9zZSh7ZXZlbnQ6J0NhbmNlbCd9KTtcclxuICB9XHJcblxyXG59XHJcbiJdfQ==