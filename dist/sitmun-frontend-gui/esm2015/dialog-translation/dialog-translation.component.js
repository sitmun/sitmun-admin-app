/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
export class DialogTranslationComponent {
    /**
     * @param {?} dialogRef
     */
    constructor(dialogRef) {
        this.dialogRef = dialogRef;
        this.initializeTranslationForm();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
    }
    /**
     * @return {?}
     */
    initializeTranslationForm() {
        this.translationForm = new FormGroup({
            catalanValue: new FormControl(null, []),
            spanishValue: new FormControl(null, []),
            englishValue: new FormControl(null, []),
        });
    }
    /**
     * @return {?}
     */
    doAccept() {
        /** @type {?} */
        let data = {
            catalanValue: this.translationForm.value.catalanValue,
            spanishValue: this.translationForm.value.spanishValue,
            englishValue: this.translationForm.value.englishValue,
        };
        this.dialogRef.close({ event: 'Accept', data: data });
    }
    /**
     * @return {?}
     */
    doDelete() {
        this.dialogRef.close({ event: 'Delete' });
    }
    /**
     * @return {?}
     */
    closeDialog() {
        this.dialogRef.close({ event: 'Cancel' });
    }
}
DialogTranslationComponent.decorators = [
    { type: Component, args: [{
                selector: 'app-dialog-translation',
                template: "\r\n\r\n<form [formGroup]='translationForm' #f=\"ngForm\">\r\n\r\n\r\n        <div class=\"displayInline\">\r\n            <label class=\"formLabelDialog\">\r\n                {{'value' | translate}}\r\n            </label>\r\n            <mat-form-field appearance=\"outline\">\r\n            <input matInput type=\"text\" formControlName=\"catalanValue\" required>\r\n            </mat-form-field>\r\n        </div>\r\n\r\n        <div class=\"displayInline\">\r\n            <label class=\"formLabelDialog\">\r\n                {{'value' | translate}}\r\n            </label>\r\n            <mat-form-field appearance=\"outline\">\r\n            <input matInput type=\"text\" formControlName=\"spanishValue\">\r\n            </mat-form-field>\r\n        </div>\r\n\r\n\r\n\r\n        <div class=\"displayInline\">\r\n            <label class=\"formLabelDialog\">\r\n                {{'value' | translate}}\r\n            </label>\r\n            <mat-form-field appearance=\"outline\">\r\n            <input matInput type=\"text\" formControlName=\"englishValue\">\r\n            </mat-form-field>\r\n        </div>\r\n\r\n\r\n  </form>\r\n\r\n<div>\r\n    <div mat-dialog-actions >\r\n        <button  mat-flat-button class=\"returnButton\" (click)=\"closeDialog()\">{{\"cancel\" | translate}}</button>\r\n        <button  mat-flat-button class=\"saveButton\"  (click)=\"doAccept()\" cdkFocusInitial>{{\"accept\" | translate}}</button>\r\n    </div>\r\n</div>",
                styles: [".displayInline{display:flex!important}.mat-dialog-actions{justify-content:flex-end}"]
            }] }
];
/** @nocollapse */
DialogTranslationComponent.ctorParameters = () => [
    { type: MatDialogRef }
];
if (false) {
    /** @type {?} */
    DialogTranslationComponent.prototype.translationForm;
    /** @type {?} */
    DialogTranslationComponent.prototype.column;
    /** @type {?} */
    DialogTranslationComponent.prototype.elementId;
    /** @type {?} */
    DialogTranslationComponent.prototype.languageId;
    /** @type {?} */
    DialogTranslationComponent.prototype.catalanValue;
    /** @type {?} */
    DialogTranslationComponent.prototype.spanishValue;
    /** @type {?} */
    DialogTranslationComponent.prototype.englishValue;
    /** @type {?} */
    DialogTranslationComponent.prototype.dialogRef;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLXRyYW5zbGF0aW9uLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi9zcmMvbWFpbi9hbmd1bGFyLWxpYnJhcnkvcHJvamVjdHMvc2l0bXVuLWZyb250ZW5kLWd1aS9zcmMvbGliLyIsInNvdXJjZXMiOlsiZGlhbG9nLXRyYW5zbGF0aW9uL2RpYWxvZy10cmFuc2xhdGlvbi5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQVUsTUFBTSxlQUFlLENBQUM7QUFDbEQsT0FBTyxFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUN4RCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFPeEQsTUFBTSxPQUFPLDBCQUEwQjs7OztJQVVyQyxZQUFvQixTQUFtRDtRQUFuRCxjQUFTLEdBQVQsU0FBUyxDQUEwQztRQUNyRSxJQUFJLENBQUMseUJBQXlCLEVBQUUsQ0FBQztLQUNsQzs7OztJQUVELFFBQVE7S0FDUDs7OztJQUVELHlCQUF5QjtRQUV2QixJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksU0FBUyxDQUFDO1lBQ25DLFlBQVksRUFBRSxJQUFJLFdBQVcsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDO1lBQ3ZDLFlBQVksRUFBRSxJQUFJLFdBQVcsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDO1lBQ3ZDLFlBQVksRUFBRSxJQUFJLFdBQVcsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDO1NBQ3hDLENBQUMsQ0FBQTtLQUNIOzs7O0lBRUQsUUFBUTs7UUFDTixJQUFJLElBQUksR0FBRztZQUNULFlBQVksRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxZQUFZO1lBQ3JELFlBQVksRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxZQUFZO1lBQ3JELFlBQVksRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxZQUFZO1NBQ3RELENBQUE7UUFDRCxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFDLEtBQUssRUFBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7S0FDcEQ7Ozs7SUFFRCxRQUFRO1FBQ04sSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBQyxLQUFLLEVBQUMsUUFBUSxFQUFDLENBQUMsQ0FBQztLQUN4Qzs7OztJQUVELFdBQVc7UUFDVCxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFDLEtBQUssRUFBQyxRQUFRLEVBQUMsQ0FBQyxDQUFDO0tBQ3hDOzs7WUE5Q0YsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSx3QkFBd0I7Z0JBQ2xDLGs4Q0FBa0Q7O2FBRW5EOzs7O1lBTlEsWUFBWSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEZvcm1Db250cm9sLCBGb3JtR3JvdXAgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XHJcbmltcG9ydCB7IE1hdERpYWxvZ1JlZiB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2RpYWxvZyc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2FwcC1kaWFsb2ctdHJhbnNsYXRpb24nLFxyXG4gIHRlbXBsYXRlVXJsOiAnLi9kaWFsb2ctdHJhbnNsYXRpb24uY29tcG9uZW50Lmh0bWwnLFxyXG4gIHN0eWxlVXJsczogWycuL2RpYWxvZy10cmFuc2xhdGlvbi5jb21wb25lbnQuc2NzcyddXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBEaWFsb2dUcmFuc2xhdGlvbkNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcblxyXG4gIHRyYW5zbGF0aW9uRm9ybTogRm9ybUdyb3VwO1xyXG4gIGNvbHVtbjogc3RyaW5nO1xyXG4gIGVsZW1lbnRJZDogc3RyaW5nO1xyXG4gIGxhbmd1YWdlSWQ6IHN0cmluZztcclxuICBjYXRhbGFuVmFsdWU6IHN0cmluZztcclxuICBzcGFuaXNoVmFsdWU6IHN0cmluZztcclxuICBlbmdsaXNoVmFsdWU6IHN0cmluZztcclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBkaWFsb2dSZWY6IE1hdERpYWxvZ1JlZjxEaWFsb2dUcmFuc2xhdGlvbkNvbXBvbmVudD4pIHsgXHJcbiAgICB0aGlzLmluaXRpYWxpemVUcmFuc2xhdGlvbkZvcm0oKTtcclxuICB9XHJcblxyXG4gIG5nT25Jbml0KCk6IHZvaWQge1xyXG4gIH1cclxuXHJcbiAgaW5pdGlhbGl6ZVRyYW5zbGF0aW9uRm9ybSgpOiB2b2lkIHtcclxuXHJcbiAgICB0aGlzLnRyYW5zbGF0aW9uRm9ybSA9IG5ldyBGb3JtR3JvdXAoe1xyXG4gICAgICBjYXRhbGFuVmFsdWU6IG5ldyBGb3JtQ29udHJvbChudWxsLCBbXSksXHJcbiAgICAgIHNwYW5pc2hWYWx1ZTogbmV3IEZvcm1Db250cm9sKG51bGwsIFtdKSxcclxuICAgICAgZW5nbGlzaFZhbHVlOiBuZXcgRm9ybUNvbnRyb2wobnVsbCwgW10pLFxyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIGRvQWNjZXB0KCl7XHJcbiAgICBsZXQgZGF0YSA9IHtcclxuICAgICAgY2F0YWxhblZhbHVlOiB0aGlzLnRyYW5zbGF0aW9uRm9ybS52YWx1ZS5jYXRhbGFuVmFsdWUsXHJcbiAgICAgIHNwYW5pc2hWYWx1ZTogdGhpcy50cmFuc2xhdGlvbkZvcm0udmFsdWUuc3BhbmlzaFZhbHVlLFxyXG4gICAgICBlbmdsaXNoVmFsdWU6IHRoaXMudHJhbnNsYXRpb25Gb3JtLnZhbHVlLmVuZ2xpc2hWYWx1ZSxcclxuICAgIH1cclxuICAgIHRoaXMuZGlhbG9nUmVmLmNsb3NlKHtldmVudDonQWNjZXB0JywgZGF0YTogZGF0YX0pO1xyXG4gIH1cclxuXHJcbiAgZG9EZWxldGUoKXtcclxuICAgIHRoaXMuZGlhbG9nUmVmLmNsb3NlKHtldmVudDonRGVsZXRlJ30pO1xyXG4gIH1cclxuXHJcbiAgY2xvc2VEaWFsb2coKXtcclxuICAgIHRoaXMuZGlhbG9nUmVmLmNsb3NlKHtldmVudDonQ2FuY2VsJ30pO1xyXG4gIH1cclxuXHJcbn1cclxuIl19