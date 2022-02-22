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
        this.translationForm = new FormGroup({});
        this.loading = true;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.initializeDialog();
        this.loading = false;
    }
    /**
     * @return {?}
     */
    initializeDialog() {
        this.languagesAvailables.forEach(element => {
            this.registerIcon(element.shortname);
            this.initializeForm(element.shortname);
        });
    }
    /**
     * @param {?} elementShortname
     * @return {?}
     */
    registerIcon(elementShortname) {
        this.matIconRegistry.addSvgIcon(this.getIconName(elementShortname), this.domSanitizer.bypassSecurityTrustResourceUrl(`assets/img/flag_${elementShortname}.svg`));
    }
    /**
     * @param {?} elementShortname
     * @return {?}
     */
    initializeForm(elementShortname) {
        /** @type {?} */
        let currentValueOnMap = this.translationsMap.get(elementShortname);
        /** @type {?} */
        let valueToPutOnForm = (currentValueOnMap && currentValueOnMap.translation) ? currentValueOnMap.translation : null;
        this.translationForm.addControl(elementShortname, new FormControl(valueToPutOnForm, []));
    }
    /**
     * @param {?} elementShortname
     * @return {?}
     */
    getIconName(elementShortname) {
        return `icon_lang_${elementShortname}`;
    }
    /**
     * @return {?}
     */
    doAccept() {
        this.languagesAvailables.forEach(language => {
            var _a;
            if (this.translationsMap.has(language.shortname) && ((_a = this.translationForm.get(language.shortname)) === null || _a === void 0 ? void 0 : _a.value)) {
                this.translationsMap.get(language.shortname).translation = this.translationForm.get(language.shortname).value;
            }
        });
        this.dialogRef.close({ event: 'Accept', data: this.translationsMap });
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
                template: "\r\n\r\n<ng-container *ngIf=\"!loading\">\r\n    <form [formGroup]='translationForm' #f=\"ngForm\">\r\n\r\n        <ng-container *ngFor=\"let language of languagesAvailables\">\r\n            <div class=\"displayInline\" *ngIf=\"language.shortname != languageByDefault\">\r\n                <label class=\"formLabelDialog\">\r\n                    {{\"valor\" | translate}}\r\n                </label>\r\n                <mat-form-field appearance=\"outline\">\r\n                <input matInput type=\"text\" [formControlName]='language.shortname' required>\r\n                </mat-form-field>\r\n                <mat-icon class=\"icon\" [svgIcon]=getIconName(language.shortname)></mat-icon>\r\n            </div>\r\n        </ng-container>\r\n\r\n  </form>\r\n\r\n<div>\r\n    <div mat-dialog-actions >\r\n        <button  mat-flat-button class=\"returnButton\" (click)=\"closeDialog()\">{{\"cancel\" | translate}}</button>\r\n        <button  mat-flat-button class=\"saveButton\"  (click)=\"doAccept()\" cdkFocusInitial>{{\"accept\" | translate}}</button>\r\n    </div>\r\n</div>\r\n</ng-container>\r\n\r\n",
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
    DialogTranslationComponent.prototype.translationsMap;
    /** @type {?} */
    DialogTranslationComponent.prototype.languageByDefault;
    /** @type {?} */
    DialogTranslationComponent.prototype.languagesAvailables;
    /** @type {?} */
    DialogTranslationComponent.prototype.loading;
    /** @type {?} */
    DialogTranslationComponent.prototype.dialogRef;
    /** @type {?} */
    DialogTranslationComponent.prototype.matIconRegistry;
    /** @type {?} */
    DialogTranslationComponent.prototype.domSanitizer;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLXRyYW5zbGF0aW9uLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi9zcmMvbWFpbi9hbmd1bGFyLWxpYnJhcnkvcHJvamVjdHMvc2l0bXVuLWZyb250ZW5kLWd1aS9zcmMvbGliLyIsInNvdXJjZXMiOlsiZGlhbG9nLXRyYW5zbGF0aW9uL2RpYWxvZy10cmFuc2xhdGlvbi5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQVUsTUFBTSxlQUFlLENBQUM7QUFDbEQsT0FBTyxFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUN4RCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDeEQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ3pELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQVF6RCxNQUFNLE9BQU8sMEJBQTBCOzs7Ozs7SUFRckMsWUFBb0IsU0FBbUQsRUFDN0QsaUJBQ0E7UUFGVSxjQUFTLEdBQVQsU0FBUyxDQUEwQztRQUM3RCxvQkFBZSxHQUFmLGVBQWU7UUFDZixpQkFBWSxHQUFaLFlBQVk7K0JBUk8sSUFBSSxTQUFTLENBQUMsRUFBRSxDQUFDO1FBSTlDLGVBQVUsSUFBSSxDQUFDO0tBS2Q7Ozs7SUFFRCxRQUFRO1FBQ04sSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7UUFDeEIsSUFBSSxDQUFDLE9BQU8sR0FBQyxLQUFLLENBQUM7S0FDcEI7Ozs7SUFFRCxnQkFBZ0I7UUFDZCxJQUFJLENBQUMsbUJBQW1CLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ3pDLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFBO1lBQ3BDLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQ3hDLENBQUMsQ0FBQztLQUNKOzs7OztJQUVELFlBQVksQ0FBQyxnQkFBZ0I7UUFDM0IsSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQzdCLElBQUksQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsRUFDbEMsSUFBSSxDQUFDLFlBQVksQ0FBQyw4QkFBOEIsQ0FBQyxtQkFBbUIsZ0JBQWdCLE1BQU0sQ0FBQyxDQUM1RixDQUFDO0tBQ0g7Ozs7O0lBRUQsY0FBYyxDQUFDLGdCQUFnQjs7UUFDN0IsSUFBSSxpQkFBaUIsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDOztRQUNuRSxJQUFJLGdCQUFnQixHQUFHLENBQUMsaUJBQWlCLElBQUksaUJBQWlCLENBQUMsV0FBVyxDQUFDLENBQUEsQ0FBQyxDQUFBLGlCQUFpQixDQUFDLFdBQVcsQ0FBQSxDQUFDLENBQUEsSUFBSSxDQUFDO1FBQy9HLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLGdCQUFnQixFQUFFLElBQUksV0FBVyxDQUFDLGdCQUFnQixFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUE7S0FDekY7Ozs7O0lBRUQsV0FBVyxDQUFDLGdCQUFnQjtRQUMxQixPQUFPLGFBQWEsZ0JBQWdCLEVBQUUsQ0FBQTtLQUN2Qzs7OztJQUVELFFBQVE7UUFDTixJQUFJLENBQUMsbUJBQW1CLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxFQUFFOztZQUMxQyxJQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsV0FBSSxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLDBDQUFFLEtBQUssQ0FBQSxFQUFDO2dCQUNyRyxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxLQUFLLENBQUE7YUFDOUc7U0FDRixDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFDLEtBQUssRUFBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxlQUFlLEVBQUMsQ0FBQyxDQUFDO0tBQ3BFOzs7O0lBRUQsV0FBVztRQUNULElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEVBQUMsS0FBSyxFQUFDLFFBQVEsRUFBQyxDQUFDLENBQUM7S0FDeEM7OztZQTNERixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLHdCQUF3QjtnQkFDbEMsa21DQUFrRDs7YUFFbkQ7Ozs7WUFUUSxZQUFZO1lBQ1osZUFBZTtZQUNmLFlBQVkiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBGb3JtQ29udHJvbCwgRm9ybUdyb3VwIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xyXG5pbXBvcnQgeyBNYXREaWFsb2dSZWYgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9kaWFsb2cnO1xyXG5pbXBvcnQgeyBNYXRJY29uUmVnaXN0cnkgfSBmcm9tIFwiQGFuZ3VsYXIvbWF0ZXJpYWwvaWNvblwiO1xyXG5pbXBvcnQgeyBEb21TYW5pdGl6ZXIgfSBmcm9tIFwiQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3NlclwiO1xyXG5cclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnYXBwLWRpYWxvZy10cmFuc2xhdGlvbicsXHJcbiAgdGVtcGxhdGVVcmw6ICcuL2RpYWxvZy10cmFuc2xhdGlvbi5jb21wb25lbnQuaHRtbCcsXHJcbiAgc3R5bGVVcmxzOiBbJy4vZGlhbG9nLXRyYW5zbGF0aW9uLmNvbXBvbmVudC5zY3NzJ11cclxufSlcclxuZXhwb3J0IGNsYXNzIERpYWxvZ1RyYW5zbGF0aW9uQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuXHJcbiAgdHJhbnNsYXRpb25Gb3JtOiBGb3JtR3JvdXAgPSBuZXcgRm9ybUdyb3VwKHt9KVxyXG4gIHRyYW5zbGF0aW9uc01hcDogIE1hcDxzdHJpbmcsIGFueT47XHJcbiAgbGFuZ3VhZ2VCeURlZmF1bHQ6ICBzdHJpbmc7XHJcbiAgbGFuZ3VhZ2VzQXZhaWxhYmxlczogQXJyYXk8YW55PjtcclxuICBsb2FkaW5nID0gdHJ1ZTtcclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBkaWFsb2dSZWY6IE1hdERpYWxvZ1JlZjxEaWFsb2dUcmFuc2xhdGlvbkNvbXBvbmVudD4sXHJcbiAgICBwcml2YXRlIG1hdEljb25SZWdpc3RyeTogTWF0SWNvblJlZ2lzdHJ5LFxyXG4gICAgcHJpdmF0ZSBkb21TYW5pdGl6ZXI6IERvbVNhbml0aXplcikgeyBcclxuICB9XHJcblxyXG4gIG5nT25Jbml0KCk6IHZvaWQge1xyXG4gICAgdGhpcy5pbml0aWFsaXplRGlhbG9nKCk7XHJcbiAgICB0aGlzLmxvYWRpbmc9ZmFsc2U7XHJcbiAgfVxyXG5cclxuICBpbml0aWFsaXplRGlhbG9nKCk6IHZvaWR7XHJcbiAgICB0aGlzLmxhbmd1YWdlc0F2YWlsYWJsZXMuZm9yRWFjaChlbGVtZW50ID0+IHtcclxuICAgICAgdGhpcy5yZWdpc3Rlckljb24oZWxlbWVudC5zaG9ydG5hbWUpXHJcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZUZvcm0oZWxlbWVudC5zaG9ydG5hbWUpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICByZWdpc3Rlckljb24oZWxlbWVudFNob3J0bmFtZSl7XHJcbiAgICB0aGlzLm1hdEljb25SZWdpc3RyeS5hZGRTdmdJY29uKFxyXG4gICAgICB0aGlzLmdldEljb25OYW1lKGVsZW1lbnRTaG9ydG5hbWUpLFxyXG4gICAgICB0aGlzLmRvbVNhbml0aXplci5ieXBhc3NTZWN1cml0eVRydXN0UmVzb3VyY2VVcmwoYGFzc2V0cy9pbWcvZmxhZ18ke2VsZW1lbnRTaG9ydG5hbWV9LnN2Z2ApXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgaW5pdGlhbGl6ZUZvcm0oZWxlbWVudFNob3J0bmFtZSk6dm9pZHtcclxuICAgIGxldCBjdXJyZW50VmFsdWVPbk1hcCA9IHRoaXMudHJhbnNsYXRpb25zTWFwLmdldChlbGVtZW50U2hvcnRuYW1lKTtcclxuICAgIGxldCB2YWx1ZVRvUHV0T25Gb3JtID0gKGN1cnJlbnRWYWx1ZU9uTWFwICYmIGN1cnJlbnRWYWx1ZU9uTWFwLnRyYW5zbGF0aW9uKT9jdXJyZW50VmFsdWVPbk1hcC50cmFuc2xhdGlvbjpudWxsO1xyXG4gICAgdGhpcy50cmFuc2xhdGlvbkZvcm0uYWRkQ29udHJvbChlbGVtZW50U2hvcnRuYW1lLCBuZXcgRm9ybUNvbnRyb2wodmFsdWVUb1B1dE9uRm9ybSwgW10pKVxyXG4gIH1cclxuXHJcbiAgZ2V0SWNvbk5hbWUoZWxlbWVudFNob3J0bmFtZSk6c3RyaW5ne1xyXG4gICAgcmV0dXJuIGBpY29uX2xhbmdfJHtlbGVtZW50U2hvcnRuYW1lfWAgXHJcbiAgfVxyXG5cclxuICBkb0FjY2VwdCgpe1xyXG4gICAgdGhpcy5sYW5ndWFnZXNBdmFpbGFibGVzLmZvckVhY2gobGFuZ3VhZ2UgPT4ge1xyXG4gICAgICBpZih0aGlzLnRyYW5zbGF0aW9uc01hcC5oYXMobGFuZ3VhZ2Uuc2hvcnRuYW1lKSAmJiB0aGlzLnRyYW5zbGF0aW9uRm9ybS5nZXQobGFuZ3VhZ2Uuc2hvcnRuYW1lKT8udmFsdWUpe1xyXG4gICAgICAgIHRoaXMudHJhbnNsYXRpb25zTWFwLmdldChsYW5ndWFnZS5zaG9ydG5hbWUpLnRyYW5zbGF0aW9uID0gdGhpcy50cmFuc2xhdGlvbkZvcm0uZ2V0KGxhbmd1YWdlLnNob3J0bmFtZSkudmFsdWVcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5kaWFsb2dSZWYuY2xvc2Uoe2V2ZW50OidBY2NlcHQnLCBkYXRhOiB0aGlzLnRyYW5zbGF0aW9uc01hcH0pO1xyXG4gIH1cclxuXHJcbiAgY2xvc2VEaWFsb2coKXtcclxuICAgIHRoaXMuZGlhbG9nUmVmLmNsb3NlKHtldmVudDonQ2FuY2VsJ30pO1xyXG4gIH1cclxuXHJcbn1cclxuIl19