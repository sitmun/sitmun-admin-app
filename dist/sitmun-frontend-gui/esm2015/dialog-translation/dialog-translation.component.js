/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
export class DialogTranslationComponent {
    /**
     * @param {?} dialogRef
     * @param {?} matIconRegistry
     * @param {?} domSanitizer
     */
    constructor(dialogRef, matIconRegistry, domSanitizer) {
        this.dialogRef = dialogRef;
        this.matIconRegistry = matIconRegistry;
        this.domSanitizer = domSanitizer;
        this.initializeTranslationForm();
        this.matIconRegistry.addSvgIcon(`icon_lang_ca`, this.domSanitizer.bypassSecurityTrustResourceUrl('../../assets/img/flag_ca.svg'));
        this.matIconRegistry.addSvgIcon(`icon_lang_es`, this.domSanitizer.bypassSecurityTrustResourceUrl('../../assets/img/flag_es.svg'));
        this.matIconRegistry.addSvgIcon(`icon_lang_en`, this.domSanitizer.bypassSecurityTrustResourceUrl('../../assets/img/flag_en.svg'));
        this.matIconRegistry.addSvgIcon(`icon_lang_oc`, this.domSanitizer.bypassSecurityTrustResourceUrl('../../assets/img/flag_oc.svg'));
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        if (this.catalanValue != null) {
            this.translationForm.patchValue({
                catalanValue: this.catalanValue
            });
        }
        if (this.spanishValue != null) {
            this.translationForm.patchValue({
                spanishValue: this.spanishValue
            });
        }
        if (this.englishValue != null) {
            this.translationForm.patchValue({
                englishValue: this.englishValue
            });
        }
        if (this.araneseValue != null) {
            this.translationForm.patchValue({
                araneseValue: this.araneseValue
            });
        }
    }
    /**
     * @return {?}
     */
    initializeTranslationForm() {
        this.translationForm = new FormGroup({
            catalanValue: new FormControl(null, []),
            spanishValue: new FormControl(null, []),
            englishValue: new FormControl(null, []),
            araneseValue: new FormControl(null, []),
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
            araneseValue: this.translationForm.value.araneseValue,
        };
        this.dialogRef.close({ event: 'Accept', data: data });
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
                template: "\r\n\r\n<form [formGroup]='translationForm' #f=\"ngForm\">\r\n\r\n\r\n        <div class=\"displayInline\">\r\n            <label class=\"formLabelDialog\">\r\n                {{'Valor'}}\r\n            </label>\r\n            <mat-form-field appearance=\"outline\">\r\n            <input matInput type=\"text\" formControlName=\"catalanValue\" required>\r\n            </mat-form-field>\r\n            <mat-icon class=\"icon\" svgIcon=\"icon_lang_ca\"></mat-icon>\r\n        </div>\r\n\r\n        <div class=\"displayInline\">\r\n            <label class=\"formLabelDialog\">\r\n                {{'Valor'}}\r\n            </label>\r\n\r\n            <mat-form-field appearance=\"outline\">\r\n            <input matInput type=\"text\" formControlName=\"spanishValue\">\r\n            </mat-form-field>\r\n            <mat-icon class=\"icon\" svgIcon=\"icon_lang_es\"></mat-icon>\r\n        </div>\r\n\r\n        <div class=\"displayInline\">\r\n            <label class=\"formLabelDialog\">\r\n                {{'Value'}}\r\n            </label>\r\n            <mat-form-field appearance=\"outline\">\r\n            <input matInput type=\"text\" formControlName=\"englishValue\">\r\n            </mat-form-field>\r\n            <mat-icon class=\"icon\" svgIcon=\"icon_lang_en\"></mat-icon>\r\n        </div>\r\n\r\n        <div class=\"displayInline\">\r\n            <label class=\"formLabelDialog\">\r\n                {{'Valor'}}\r\n            </label>\r\n            <mat-form-field appearance=\"outline\">\r\n            <input matInput type=\"text\" formControlName=\"araneseValue\">\r\n            </mat-form-field>\r\n            <mat-icon class=\"icon\" svgIcon=\"icon_lang_oc\"></mat-icon>\r\n        </div>\r\n\r\n\r\n  </form>\r\n\r\n<div>\r\n    <div mat-dialog-actions >\r\n        <button  mat-flat-button class=\"returnButton\" (click)=\"closeDialog()\">{{\"cancel\" | translate}}</button>\r\n        <button  mat-flat-button class=\"saveButton\"  (click)=\"doAccept()\" cdkFocusInitial>{{\"accept\" | translate}}</button>\r\n    </div>\r\n</div>",
                styles: [".displayInline{display:flex!important}.mat-dialog-actions{justify-content:flex-end}.icon{height:50px!important;margin-left:30px;width:40px!important}.formLabelDialog{width:10%!important}.mat-dialog-container{height:-webkit-max-content!important;height:-moz-max-content!important;height:max-content!important}"]
            }] }
];
/** @nocollapse */
DialogTranslationComponent.ctorParameters = () => [
    { type: MatDialogRef },
    { type: MatIconRegistry },
    { type: DomSanitizer }
];
if (false) {
    /** @type {?} */
    DialogTranslationComponent.prototype.translationForm;
    /** @type {?} */
    DialogTranslationComponent.prototype.catalanValue;
    /** @type {?} */
    DialogTranslationComponent.prototype.spanishValue;
    /** @type {?} */
    DialogTranslationComponent.prototype.englishValue;
    /** @type {?} */
    DialogTranslationComponent.prototype.araneseValue;
    /** @type {?} */
    DialogTranslationComponent.prototype.dialogRef;
    /** @type {?} */
    DialogTranslationComponent.prototype.matIconRegistry;
    /** @type {?} */
    DialogTranslationComponent.prototype.domSanitizer;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLXRyYW5zbGF0aW9uLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi9zcmMvbWFpbi9hbmd1bGFyLWxpYnJhcnkvcHJvamVjdHMvc2l0bXVuLWZyb250ZW5kLWd1aS9zcmMvbGliLyIsInNvdXJjZXMiOlsiZGlhbG9nLXRyYW5zbGF0aW9uL2RpYWxvZy10cmFuc2xhdGlvbi5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQVUsTUFBTSxlQUFlLENBQUM7QUFDbEQsT0FBTyxFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUN4RCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDeEQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ3pELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQVF6RCxNQUFNLE9BQU8sMEJBQTBCOzs7Ozs7SUFRckMsWUFBb0IsU0FBbUQsRUFDN0QsaUJBQ0E7UUFGVSxjQUFTLEdBQVQsU0FBUyxDQUEwQztRQUM3RCxvQkFBZSxHQUFmLGVBQWU7UUFDZixpQkFBWSxHQUFaLFlBQVk7UUFDcEIsSUFBSSxDQUFDLHlCQUF5QixFQUFFLENBQUM7UUFDakMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQzdCLGNBQWMsRUFDZCxJQUFJLENBQUMsWUFBWSxDQUFDLDhCQUE4QixDQUFDLDhCQUE4QixDQUFDLENBQ2pGLENBQUM7UUFDRixJQUFJLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FDN0IsY0FBYyxFQUNkLElBQUksQ0FBQyxZQUFZLENBQUMsOEJBQThCLENBQUMsOEJBQThCLENBQUMsQ0FDakYsQ0FBQztRQUNGLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUM3QixjQUFjLEVBQ2QsSUFBSSxDQUFDLFlBQVksQ0FBQyw4QkFBOEIsQ0FBQyw4QkFBOEIsQ0FBQyxDQUNqRixDQUFDO1FBQ0YsSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQzdCLGNBQWMsRUFDZCxJQUFJLENBQUMsWUFBWSxDQUFDLDhCQUE4QixDQUFDLDhCQUE4QixDQUFDLENBQ2pGLENBQUM7S0FDSDs7OztJQUVELFFBQVE7UUFDTixJQUFHLElBQUksQ0FBQyxZQUFZLElBQUksSUFBSSxFQUFDO1lBQzNCLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDO2dCQUM5QixZQUFZLEVBQUUsSUFBSSxDQUFDLFlBQVk7YUFDaEMsQ0FBQyxDQUFBO1NBQ0g7UUFDRCxJQUFHLElBQUksQ0FBQyxZQUFZLElBQUksSUFBSSxFQUFDO1lBQzNCLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDO2dCQUM5QixZQUFZLEVBQUUsSUFBSSxDQUFDLFlBQVk7YUFDaEMsQ0FBQyxDQUFBO1NBQ0g7UUFDRCxJQUFHLElBQUksQ0FBQyxZQUFZLElBQUksSUFBSSxFQUFDO1lBQzNCLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDO2dCQUM5QixZQUFZLEVBQUUsSUFBSSxDQUFDLFlBQVk7YUFDaEMsQ0FBQyxDQUFBO1NBQ0g7UUFDRCxJQUFHLElBQUksQ0FBQyxZQUFZLElBQUksSUFBSSxFQUFDO1lBQzNCLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDO2dCQUM5QixZQUFZLEVBQUUsSUFBSSxDQUFDLFlBQVk7YUFDaEMsQ0FBQyxDQUFBO1NBQ0g7S0FDRjs7OztJQUVELHlCQUF5QjtRQUV2QixJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksU0FBUyxDQUFDO1lBQ25DLFlBQVksRUFBRSxJQUFJLFdBQVcsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDO1lBQ3ZDLFlBQVksRUFBRSxJQUFJLFdBQVcsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDO1lBQ3ZDLFlBQVksRUFBRSxJQUFJLFdBQVcsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDO1lBQ3ZDLFlBQVksRUFBRSxJQUFJLFdBQVcsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDO1NBQ3hDLENBQUMsQ0FBQTtLQUNIOzs7O0lBRUQsUUFBUTs7UUFDTixJQUFJLElBQUksR0FBRztZQUNULFlBQVksRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxZQUFZO1lBQ3JELFlBQVksRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxZQUFZO1lBQ3JELFlBQVksRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxZQUFZO1lBQ3JELFlBQVksRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxZQUFZO1NBQ3RELENBQUE7UUFDRCxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFDLEtBQUssRUFBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7S0FDcEQ7Ozs7SUFFRCxXQUFXO1FBQ1QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBQyxLQUFLLEVBQUMsUUFBUSxFQUFDLENBQUMsQ0FBQztLQUN4Qzs7O1lBaEZGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsd0JBQXdCO2dCQUNsQyw0aEVBQWtEOzthQUVuRDs7OztZQVRRLFlBQVk7WUFDWixlQUFlO1lBQ2YsWUFBWSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEZvcm1Db250cm9sLCBGb3JtR3JvdXAgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XHJcbmltcG9ydCB7IE1hdERpYWxvZ1JlZiB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2RpYWxvZyc7XHJcbmltcG9ydCB7IE1hdEljb25SZWdpc3RyeSB9IGZyb20gXCJAYW5ndWxhci9tYXRlcmlhbC9pY29uXCI7XHJcbmltcG9ydCB7IERvbVNhbml0aXplciB9IGZyb20gXCJAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyXCI7XHJcblxyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdhcHAtZGlhbG9nLXRyYW5zbGF0aW9uJyxcclxuICB0ZW1wbGF0ZVVybDogJy4vZGlhbG9nLXRyYW5zbGF0aW9uLmNvbXBvbmVudC5odG1sJyxcclxuICBzdHlsZVVybHM6IFsnLi9kaWFsb2ctdHJhbnNsYXRpb24uY29tcG9uZW50LnNjc3MnXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgRGlhbG9nVHJhbnNsYXRpb25Db21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG5cclxuICB0cmFuc2xhdGlvbkZvcm06IEZvcm1Hcm91cDtcclxuICBjYXRhbGFuVmFsdWU6IHN0cmluZztcclxuICBzcGFuaXNoVmFsdWU6IHN0cmluZztcclxuICBlbmdsaXNoVmFsdWU6IHN0cmluZztcclxuICBhcmFuZXNlVmFsdWU6IHN0cmluZztcclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBkaWFsb2dSZWY6IE1hdERpYWxvZ1JlZjxEaWFsb2dUcmFuc2xhdGlvbkNvbXBvbmVudD4sXHJcbiAgICBwcml2YXRlIG1hdEljb25SZWdpc3RyeTogTWF0SWNvblJlZ2lzdHJ5LFxyXG4gICAgcHJpdmF0ZSBkb21TYW5pdGl6ZXI6IERvbVNhbml0aXplcikgeyBcclxuICAgIHRoaXMuaW5pdGlhbGl6ZVRyYW5zbGF0aW9uRm9ybSgpO1xyXG4gICAgdGhpcy5tYXRJY29uUmVnaXN0cnkuYWRkU3ZnSWNvbihcclxuICAgICAgYGljb25fbGFuZ19jYWAsXHJcbiAgICAgIHRoaXMuZG9tU2FuaXRpemVyLmJ5cGFzc1NlY3VyaXR5VHJ1c3RSZXNvdXJjZVVybCgnLi4vLi4vYXNzZXRzL2ltZy9mbGFnX2NhLnN2ZycpXHJcbiAgICApO1xyXG4gICAgdGhpcy5tYXRJY29uUmVnaXN0cnkuYWRkU3ZnSWNvbihcclxuICAgICAgYGljb25fbGFuZ19lc2AsXHJcbiAgICAgIHRoaXMuZG9tU2FuaXRpemVyLmJ5cGFzc1NlY3VyaXR5VHJ1c3RSZXNvdXJjZVVybCgnLi4vLi4vYXNzZXRzL2ltZy9mbGFnX2VzLnN2ZycpXHJcbiAgICApO1xyXG4gICAgdGhpcy5tYXRJY29uUmVnaXN0cnkuYWRkU3ZnSWNvbihcclxuICAgICAgYGljb25fbGFuZ19lbmAsXHJcbiAgICAgIHRoaXMuZG9tU2FuaXRpemVyLmJ5cGFzc1NlY3VyaXR5VHJ1c3RSZXNvdXJjZVVybCgnLi4vLi4vYXNzZXRzL2ltZy9mbGFnX2VuLnN2ZycpXHJcbiAgICApO1xyXG4gICAgdGhpcy5tYXRJY29uUmVnaXN0cnkuYWRkU3ZnSWNvbihcclxuICAgICAgYGljb25fbGFuZ19vY2AsXHJcbiAgICAgIHRoaXMuZG9tU2FuaXRpemVyLmJ5cGFzc1NlY3VyaXR5VHJ1c3RSZXNvdXJjZVVybCgnLi4vLi4vYXNzZXRzL2ltZy9mbGFnX29jLnN2ZycpXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgbmdPbkluaXQoKTogdm9pZCB7XHJcbiAgICBpZih0aGlzLmNhdGFsYW5WYWx1ZSAhPSBudWxsKXtcclxuICAgICAgdGhpcy50cmFuc2xhdGlvbkZvcm0ucGF0Y2hWYWx1ZSh7XHJcbiAgICAgICAgY2F0YWxhblZhbHVlOiB0aGlzLmNhdGFsYW5WYWx1ZVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gICAgaWYodGhpcy5zcGFuaXNoVmFsdWUgIT0gbnVsbCl7XHJcbiAgICAgIHRoaXMudHJhbnNsYXRpb25Gb3JtLnBhdGNoVmFsdWUoe1xyXG4gICAgICAgIHNwYW5pc2hWYWx1ZTogdGhpcy5zcGFuaXNoVmFsdWVcclxuICAgICAgfSlcclxuICAgIH1cclxuICAgIGlmKHRoaXMuZW5nbGlzaFZhbHVlICE9IG51bGwpe1xyXG4gICAgICB0aGlzLnRyYW5zbGF0aW9uRm9ybS5wYXRjaFZhbHVlKHtcclxuICAgICAgICBlbmdsaXNoVmFsdWU6IHRoaXMuZW5nbGlzaFZhbHVlXHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgICBpZih0aGlzLmFyYW5lc2VWYWx1ZSAhPSBudWxsKXtcclxuICAgICAgdGhpcy50cmFuc2xhdGlvbkZvcm0ucGF0Y2hWYWx1ZSh7XHJcbiAgICAgICAgYXJhbmVzZVZhbHVlOiB0aGlzLmFyYW5lc2VWYWx1ZVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaW5pdGlhbGl6ZVRyYW5zbGF0aW9uRm9ybSgpOiB2b2lkIHtcclxuXHJcbiAgICB0aGlzLnRyYW5zbGF0aW9uRm9ybSA9IG5ldyBGb3JtR3JvdXAoe1xyXG4gICAgICBjYXRhbGFuVmFsdWU6IG5ldyBGb3JtQ29udHJvbChudWxsLCBbXSksXHJcbiAgICAgIHNwYW5pc2hWYWx1ZTogbmV3IEZvcm1Db250cm9sKG51bGwsIFtdKSxcclxuICAgICAgZW5nbGlzaFZhbHVlOiBuZXcgRm9ybUNvbnRyb2wobnVsbCwgW10pLFxyXG4gICAgICBhcmFuZXNlVmFsdWU6IG5ldyBGb3JtQ29udHJvbChudWxsLCBbXSksXHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgZG9BY2NlcHQoKXtcclxuICAgIGxldCBkYXRhID0ge1xyXG4gICAgICBjYXRhbGFuVmFsdWU6IHRoaXMudHJhbnNsYXRpb25Gb3JtLnZhbHVlLmNhdGFsYW5WYWx1ZSxcclxuICAgICAgc3BhbmlzaFZhbHVlOiB0aGlzLnRyYW5zbGF0aW9uRm9ybS52YWx1ZS5zcGFuaXNoVmFsdWUsXHJcbiAgICAgIGVuZ2xpc2hWYWx1ZTogdGhpcy50cmFuc2xhdGlvbkZvcm0udmFsdWUuZW5nbGlzaFZhbHVlLFxyXG4gICAgICBhcmFuZXNlVmFsdWU6IHRoaXMudHJhbnNsYXRpb25Gb3JtLnZhbHVlLmFyYW5lc2VWYWx1ZSxcclxuICAgIH1cclxuICAgIHRoaXMuZGlhbG9nUmVmLmNsb3NlKHtldmVudDonQWNjZXB0JywgZGF0YTogZGF0YX0pO1xyXG4gIH1cclxuXHJcbiAgY2xvc2VEaWFsb2coKXtcclxuICAgIHRoaXMuZGlhbG9nUmVmLmNsb3NlKHtldmVudDonQ2FuY2VsJ30pO1xyXG4gIH1cclxuXHJcbn1cclxuIl19