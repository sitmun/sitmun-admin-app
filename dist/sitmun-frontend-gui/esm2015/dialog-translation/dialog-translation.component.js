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
    /**
     * @return {?}
     */
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
    /**
     * @return {?}
     */
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
    /**
     * @return {?}
     */
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
    /**
     * @return {?}
     */
    initializeTranslationForm() {
        this.translationForm = new FormGroup({
            catalanValue: new FormControl(null, []),
            spanishValue: new FormControl(null, []),
            englishValue: new FormControl(null, []),
            araneseValue: new FormControl(null, []),
            frenchValue: new FormControl(null, []),
        });
    }
    /**
     * @return {?}
     */
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
                template: "\r\n\r\n<form [formGroup]='translationForm' #f=\"ngForm\">\r\n\r\n\r\n        <div class=\"displayInline\" *ngIf=\"catalanAvailable\">\r\n            <label class=\"formLabelDialog\">\r\n                {{'Valor'}}\r\n            </label>\r\n            <mat-form-field appearance=\"outline\">\r\n            <input matInput type=\"text\" formControlName=\"catalanValue\" required>\r\n            </mat-form-field>\r\n            <mat-icon class=\"icon\" svgIcon=\"icon_lang_ca\"></mat-icon>\r\n        </div>\r\n\r\n        <div class=\"displayInline\"  *ngIf=\"spanishAvailable\">\r\n            <label class=\"formLabelDialog\">\r\n                {{'Valor'}}\r\n            </label>\r\n\r\n            <mat-form-field appearance=\"outline\">\r\n            <input matInput type=\"text\" formControlName=\"spanishValue\">\r\n            </mat-form-field>\r\n            <mat-icon class=\"icon\" svgIcon=\"icon_lang_es\"></mat-icon>\r\n        </div>\r\n\r\n        <div class=\"displayInline\" *ngIf=\"englishAvailable\" >\r\n            <label class=\"formLabelDialog\">\r\n                {{'Value'}}\r\n            </label>\r\n            <mat-form-field appearance=\"outline\">\r\n            <input matInput type=\"text\" formControlName=\"englishValue\">\r\n            </mat-form-field>\r\n            <mat-icon class=\"icon\" svgIcon=\"icon_lang_en\"></mat-icon>\r\n        </div>\r\n\r\n        <div class=\"displayInline\" *ngIf=\"araneseAvailable\" >\r\n            <label class=\"formLabelDialog\">\r\n                {{'Valor'}}\r\n            </label>\r\n            <mat-form-field appearance=\"outline\">\r\n            <input matInput type=\"text\" formControlName=\"araneseValue\">\r\n            </mat-form-field>\r\n            <mat-icon class=\"icon\" svgIcon=\"icon_lang_oc\"></mat-icon>\r\n        </div>\r\n        <div class=\"displayInline\">\r\n            <label class=\"formLabelDialog\" *ngIf=\"frenchAvailable\">\r\n                {{'Valeur'}}\r\n            </label>\r\n            <mat-form-field appearance=\"outline\">\r\n            <input matInput type=\"text\" formControlName=\"frenchValue\">\r\n            </mat-form-field>\r\n            <mat-icon class=\"icon\" svgIcon=\"icon_lang_fr\"></mat-icon>\r\n        </div>\r\n\r\n  </form>\r\n\r\n<div>\r\n    <div mat-dialog-actions >\r\n        <button  mat-flat-button class=\"returnButton\" (click)=\"closeDialog()\">{{\"cancel\" | translate}}</button>\r\n        <button  mat-flat-button class=\"saveButton\"  (click)=\"doAccept()\" cdkFocusInitial>{{\"accept\" | translate}}</button>\r\n    </div>\r\n</div>",
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
    DialogTranslationComponent.prototype.catalanAvailable;
    /** @type {?} */
    DialogTranslationComponent.prototype.catalanValue;
    /** @type {?} */
    DialogTranslationComponent.prototype.spanishAvailable;
    /** @type {?} */
    DialogTranslationComponent.prototype.spanishValue;
    /** @type {?} */
    DialogTranslationComponent.prototype.englishAvailable;
    /** @type {?} */
    DialogTranslationComponent.prototype.englishValue;
    /** @type {?} */
    DialogTranslationComponent.prototype.araneseAvailable;
    /** @type {?} */
    DialogTranslationComponent.prototype.araneseValue;
    /** @type {?} */
    DialogTranslationComponent.prototype.frenchAvailable;
    /** @type {?} */
    DialogTranslationComponent.prototype.frenchValue;
    /** @type {?} */
    DialogTranslationComponent.prototype.dialogRef;
    /** @type {?} */
    DialogTranslationComponent.prototype.matIconRegistry;
    /** @type {?} */
    DialogTranslationComponent.prototype.domSanitizer;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLXRyYW5zbGF0aW9uLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi9zcmMvbWFpbi9hbmd1bGFyLWxpYnJhcnkvcHJvamVjdHMvc2l0bXVuLWZyb250ZW5kLWd1aS9zcmMvbGliLyIsInNvdXJjZXMiOlsiZGlhbG9nLXRyYW5zbGF0aW9uL2RpYWxvZy10cmFuc2xhdGlvbi5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQVUsTUFBTSxlQUFlLENBQUM7QUFDbEQsT0FBTyxFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUN4RCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDeEQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ3pELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQVF6RCxNQUFNLE9BQU8sMEJBQTBCOzs7Ozs7SUFpQnJDLFlBQW9CLFNBQW1ELEVBQzdELGlCQUNBO1FBRlUsY0FBUyxHQUFULFNBQVMsQ0FBMEM7UUFDN0Qsb0JBQWUsR0FBZixlQUFlO1FBQ2YsaUJBQVksR0FBWixZQUFZO1FBYnRCLHdCQUFtQixLQUFLLENBQUM7UUFFekIsd0JBQW1CLEtBQUssQ0FBQztRQUV6Qix3QkFBbUIsS0FBSyxDQUFDO1FBRXpCLHdCQUFtQixLQUFLLENBQUM7UUFFekIsdUJBQWtCLEtBQUssQ0FBQztRQU10QixJQUFJLENBQUMseUJBQXlCLEVBQUUsQ0FBQztRQUNqQyxJQUFJLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FDN0IsY0FBYyxFQUNkLElBQUksQ0FBQyxZQUFZLENBQUMsOEJBQThCLENBQUMsd0JBQXdCLENBQUMsQ0FDM0UsQ0FBQztRQUNGLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUM3QixjQUFjLEVBQ2QsSUFBSSxDQUFDLFlBQVksQ0FBQyw4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b3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBGb3JtQ29udHJvbCwgRm9ybUdyb3VwIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xyXG5pbXBvcnQgeyBNYXREaWFsb2dSZWYgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9kaWFsb2cnO1xyXG5pbXBvcnQgeyBNYXRJY29uUmVnaXN0cnkgfSBmcm9tIFwiQGFuZ3VsYXIvbWF0ZXJpYWwvaWNvblwiO1xyXG5pbXBvcnQgeyBEb21TYW5pdGl6ZXIgfSBmcm9tIFwiQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3NlclwiO1xyXG5cclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnYXBwLWRpYWxvZy10cmFuc2xhdGlvbicsXHJcbiAgdGVtcGxhdGVVcmw6ICcuL2RpYWxvZy10cmFuc2xhdGlvbi5jb21wb25lbnQuaHRtbCcsXHJcbiAgc3R5bGVVcmxzOiBbJy4vZGlhbG9nLXRyYW5zbGF0aW9uLmNvbXBvbmVudC5zY3NzJ11cclxufSlcclxuZXhwb3J0IGNsYXNzIERpYWxvZ1RyYW5zbGF0aW9uQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuXHJcbiAgdHJhbnNsYXRpb25Gb3JtOiBGb3JtR3JvdXA7XHJcbiAgdHJhbnNsYXRpb25zTWFwOiAgTWFwPHN0cmluZywgYW55PjtcclxuICBsYW5ndWFnZUJ5RGVmYXVsdDogIHN0cmluZztcclxuICBsYW5ndWFnZXNBdmFpbGFibGVzOiBBcnJheTxhbnk+O1xyXG4gIGNhdGFsYW5BdmFpbGFibGUgPSBmYWxzZTtcclxuICBjYXRhbGFuVmFsdWU6IHN0cmluZztcclxuICBzcGFuaXNoQXZhaWxhYmxlID0gZmFsc2U7XHJcbiAgc3BhbmlzaFZhbHVlOiBzdHJpbmc7XHJcbiAgZW5nbGlzaEF2YWlsYWJsZSA9IGZhbHNlO1xyXG4gIGVuZ2xpc2hWYWx1ZTogc3RyaW5nO1xyXG4gIGFyYW5lc2VBdmFpbGFibGUgPSBmYWxzZTtcclxuICBhcmFuZXNlVmFsdWU6IHN0cmluZztcclxuICBmcmVuY2hBdmFpbGFibGUgPSBmYWxzZTtcclxuICBmcmVuY2hWYWx1ZTogc3RyaW5nO1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGRpYWxvZ1JlZjogTWF0RGlhbG9nUmVmPERpYWxvZ1RyYW5zbGF0aW9uQ29tcG9uZW50PixcclxuICAgIHByaXZhdGUgbWF0SWNvblJlZ2lzdHJ5OiBNYXRJY29uUmVnaXN0cnksXHJcbiAgICBwcml2YXRlIGRvbVNhbml0aXplcjogRG9tU2FuaXRpemVyKSB7IFxyXG4gICAgdGhpcy5pbml0aWFsaXplVHJhbnNsYXRpb25Gb3JtKCk7XHJcbiAgICB0aGlzLm1hdEljb25SZWdpc3RyeS5hZGRTdmdJY29uKFxyXG4gICAgICBgaWNvbl9sYW5nX2NhYCxcclxuICAgICAgdGhpcy5kb21TYW5pdGl6ZXIuYnlwYXNzU2VjdXJpdHlUcnVzdFJlc291cmNlVXJsKCdhc3NldHMvaW1nL2ZsYWdfY2Euc3ZnJylcclxuICAgICk7XHJcbiAgICB0aGlzLm1hdEljb25SZWdpc3RyeS5hZGRTdmdJY29uKFxyXG4gICAgICBgaWNvbl9sYW5nX2VzYCxcclxuICAgICAgdGhpcy5kb21TYW5pdGl6ZXIuYnlwYXNzU2VjdXJpdHlUcnVzdFJlc291cmNlVXJsKCdhc3NldHMvaW1nL2ZsYWdfZXMuc3ZnJylcclxuICAgICk7XHJcbiAgICB0aGlzLm1hdEljb25SZWdpc3RyeS5hZGRTdmdJY29uKFxyXG4gICAgICBgaWNvbl9sYW5nX2VuYCxcclxuICAgICAgdGhpcy5kb21TYW5pdGl6ZXIuYnlwYXNzU2VjdXJpdHlUcnVzdFJlc291cmNlVXJsKCdhc3NldHMvaW1nL2ZsYWdfZW4uc3ZnJylcclxuICAgICk7XHJcbiAgICB0aGlzLm1hdEljb25SZWdpc3RyeS5hZGRTdmdJY29uKFxyXG4gICAgICBgaWNvbl9sYW5nX29jYCxcclxuICAgICAgdGhpcy5kb21TYW5pdGl6ZXIuYnlwYXNzU2VjdXJpdHlUcnVzdFJlc291cmNlVXJsKCdhc3NldHMvaW1nL2ZsYWdfb2Muc3ZnJylcclxuICAgICk7XHJcbiAgICB0aGlzLm1hdEljb25SZWdpc3RyeS5hZGRTdmdJY29uKFxyXG4gICAgICBgaWNvbl9sYW5nX2ZyYCxcclxuICAgICAgdGhpcy5kb21TYW5pdGl6ZXIuYnlwYXNzU2VjdXJpdHlUcnVzdFJlc291cmNlVXJsKCdhc3NldHMvaW1nL2ZsYWdfZnIuc3ZnJylcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBuZ09uSW5pdCgpOiB2b2lkIHtcclxuXHJcbiAgICB0aGlzLmNoZWNrTGFuZ3VhZ2VzQXZhaWxhYmxlcygpO1xyXG4gICAgdGhpcy5jaGVja1RyYW5zbGF0aW9uc0FscmVhZHlEb25lKCk7XHJcbiAgICAvLyBpZih0aGlzLmNhdGFsYW5WYWx1ZSAhPSBudWxsKXtcclxuICAgIC8vICAgdGhpcy50cmFuc2xhdGlvbkZvcm0ucGF0Y2hWYWx1ZSh7XHJcbiAgICAvLyAgICAgY2F0YWxhblZhbHVlOiB0aGlzLmNhdGFsYW5WYWx1ZVxyXG4gICAgLy8gICB9KVxyXG4gICAgLy8gfVxyXG4gICAgLy8gaWYodGhpcy5zcGFuaXNoVmFsdWUgIT0gbnVsbCl7XHJcbiAgICAvLyAgIHRoaXMudHJhbnNsYXRpb25Gb3JtLnBhdGNoVmFsdWUoe1xyXG4gICAgLy8gICAgIHNwYW5pc2hWYWx1ZTogdGhpcy5zcGFuaXNoVmFsdWVcclxuICAgIC8vICAgfSlcclxuICAgIC8vIH1cclxuICAgIC8vIGlmKHRoaXMuZW5nbGlzaFZhbHVlICE9IG51bGwpe1xyXG4gICAgLy8gICB0aGlzLnRyYW5zbGF0aW9uRm9ybS5wYXRjaFZhbHVlKHtcclxuICAgIC8vICAgICBlbmdsaXNoVmFsdWU6IHRoaXMuZW5nbGlzaFZhbHVlXHJcbiAgICAvLyAgIH0pXHJcbiAgICAvLyB9XHJcbiAgICAvLyBpZih0aGlzLmFyYW5lc2VWYWx1ZSAhPSBudWxsKXtcclxuICAgIC8vICAgdGhpcy50cmFuc2xhdGlvbkZvcm0ucGF0Y2hWYWx1ZSh7XHJcbiAgICAvLyAgICAgYXJhbmVzZVZhbHVlOiB0aGlzLmFyYW5lc2VWYWx1ZVxyXG4gICAgLy8gICB9KVxyXG4gICAgLy8gfVxyXG4gICAgLy8gaWYodGhpcy5mcmVuY2hWYWx1ZSAhPSBudWxsKXtcclxuICAgIC8vICAgdGhpcy50cmFuc2xhdGlvbkZvcm0ucGF0Y2hWYWx1ZSh7XHJcbiAgICAvLyAgICAgZnJlbmNoVmFsdWU6IHRoaXMuZnJlbmNoVmFsdWVcclxuICAgIC8vICAgfSlcclxuICAgIC8vIH1cclxuICB9XHJcblxyXG4gIGNoZWNrTGFuZ3VhZ2VzQXZhaWxhYmxlcygpOiB2b2lkIHtcclxuICAgIHRoaXMubGFuZ3VhZ2VzQXZhaWxhYmxlcy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG4gICAgICBpZihlbGVtZW50LnNob3J0bmFtZSA9PSAnY2EnICYmIHRoaXMubGFuZ3VhZ2VCeURlZmF1bHQhPSAnY2EnKSB7ICB0aGlzLmNhdGFsYW5BdmFpbGFibGUgPSB0cnVlIH1cclxuICAgICAgaWYoZWxlbWVudC5zaG9ydG5hbWUgPT0gJ2VzJyAmJiB0aGlzLmxhbmd1YWdlQnlEZWZhdWx0IT0gJ2VzJykgeyAgdGhpcy5zcGFuaXNoQXZhaWxhYmxlID0gdHJ1ZSB9XHJcbiAgICAgIGlmKGVsZW1lbnQuc2hvcnRuYW1lID09ICdlbicgJiYgdGhpcy5sYW5ndWFnZUJ5RGVmYXVsdCE9ICdlbicpIHsgIHRoaXMuZW5nbGlzaEF2YWlsYWJsZSA9IHRydWUgfVxyXG4gICAgICBpZihlbGVtZW50LnNob3J0bmFtZSA9PSAnb2MtYXJhbmVzJyAmJiB0aGlzLmxhbmd1YWdlQnlEZWZhdWx0IT0gJ29jLWFyYW5lcycpIHsgIHRoaXMuYXJhbmVzZUF2YWlsYWJsZSA9IHRydWUgfVxyXG4gICAgICBpZihlbGVtZW50LnNob3J0bmFtZSA9PSAnZnInICYmIHRoaXMubGFuZ3VhZ2VCeURlZmF1bHQhPSAnZnInKSB7ICB0aGlzLmZyZW5jaEF2YWlsYWJsZSA9IHRydWUgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBjaGVja1RyYW5zbGF0aW9uc0FscmVhZHlEb25lKCk6IHZvaWQge1xyXG4gICAgdGhpcy50cmFuc2xhdGlvbnNNYXAuZm9yRWFjaCgodmFsdWU6IGFueSwga2V5OiBzdHJpbmcpID0+IHtcclxuICAgICAgaWYoa2V5ID09ICdjYScgJiYgdmFsdWUgJiYgdmFsdWUudHJhbnNsYXRpb24pIHsgdGhpcy50cmFuc2xhdGlvbkZvcm0ucGF0Y2hWYWx1ZSh7IGNhdGFsYW5WYWx1ZTogdmFsdWUudHJhbnNsYXRpb24gfSkgfVxyXG4gICAgICBpZihrZXkgPT0gJ2VzJyAmJiB2YWx1ZSAmJiB2YWx1ZS50cmFuc2xhdGlvbikgeyB0aGlzLnRyYW5zbGF0aW9uRm9ybS5wYXRjaFZhbHVlKHsgc3BhbmlzaFZhbHVlOiB2YWx1ZS50cmFuc2xhdGlvbiB9KSB9XHJcbiAgICAgIGlmKGtleSA9PSAnZW4nICYmIHZhbHVlICYmIHZhbHVlLnRyYW5zbGF0aW9uKSB7IHRoaXMudHJhbnNsYXRpb25Gb3JtLnBhdGNoVmFsdWUoeyBlbmdsaXNoVmFsdWU6IHZhbHVlLnRyYW5zbGF0aW9uIH0pIH1cclxuICAgICAgaWYoa2V5ID09ICdvYy1hcmFuZXMnICYmIHZhbHVlICYmIHZhbHVlLnRyYW5zbGF0aW9uKSB7IHRoaXMudHJhbnNsYXRpb25Gb3JtLnBhdGNoVmFsdWUoeyBhcmFuZXNlVmFsdWU6IHZhbHVlLnRyYW5zbGF0aW9uIH0pIH1cclxuICAgICAgaWYoa2V5ID09ICdmcicgJiYgdmFsdWUgJiYgdmFsdWUudHJhbnNsYXRpb24pIHsgdGhpcy50cmFuc2xhdGlvbkZvcm0ucGF0Y2hWYWx1ZSh7IGZyZW5jaFZhbHVlOiB2YWx1ZS50cmFuc2xhdGlvbiB9KSB9XHJcbiAgfSk7XHJcbiAgfVxyXG5cclxuICBpbml0aWFsaXplVHJhbnNsYXRpb25Gb3JtKCk6IHZvaWQge1xyXG5cclxuICAgIHRoaXMudHJhbnNsYXRpb25Gb3JtID0gbmV3IEZvcm1Hcm91cCh7XHJcbiAgICAgIGNhdGFsYW5WYWx1ZTogbmV3IEZvcm1Db250cm9sKG51bGwsIFtdKSxcclxuICAgICAgc3BhbmlzaFZhbHVlOiBuZXcgRm9ybUNvbnRyb2wobnVsbCwgW10pLFxyXG4gICAgICBlbmdsaXNoVmFsdWU6IG5ldyBGb3JtQ29udHJvbChudWxsLCBbXSksXHJcbiAgICAgIGFyYW5lc2VWYWx1ZTogbmV3IEZvcm1Db250cm9sKG51bGwsIFtdKSxcclxuICAgICAgZnJlbmNoVmFsdWU6IG5ldyBGb3JtQ29udHJvbChudWxsLCBbXSksXHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgZG9BY2NlcHQoKXtcclxuICAgIGlmICh0aGlzLnRyYW5zbGF0aW9uc01hcC5oYXMoXCJjYVwiKSAmJiB0aGlzLnRyYW5zbGF0aW9uRm9ybS52YWx1ZS5jYXRhbGFuVmFsdWUpIHsgdGhpcy50cmFuc2xhdGlvbnNNYXAuZ2V0KCdjYScpLnRyYW5zbGF0aW9uID0gdGhpcy50cmFuc2xhdGlvbkZvcm0udmFsdWUuY2F0YWxhblZhbHVlIH1cclxuICAgIGlmICh0aGlzLnRyYW5zbGF0aW9uc01hcC5oYXMoXCJlc1wiKSAmJiB0aGlzLnRyYW5zbGF0aW9uRm9ybS52YWx1ZS5zcGFuaXNoVmFsdWUpIHsgdGhpcy50cmFuc2xhdGlvbnNNYXAuZ2V0KCdlcycpLnRyYW5zbGF0aW9uID0gdGhpcy50cmFuc2xhdGlvbkZvcm0udmFsdWUuc3BhbmlzaFZhbHVlIH1cclxuICAgIGlmICh0aGlzLnRyYW5zbGF0aW9uc01hcC5oYXMoXCJlblwiKSAmJiB0aGlzLnRyYW5zbGF0aW9uRm9ybS52YWx1ZS5lbmdsaXNoVmFsdWUpIHsgdGhpcy50cmFuc2xhdGlvbnNNYXAuZ2V0KCdlbicpLnRyYW5zbGF0aW9uID0gdGhpcy50cmFuc2xhdGlvbkZvcm0udmFsdWUuZW5nbGlzaFZhbHVlIH1cclxuICAgIGlmICh0aGlzLnRyYW5zbGF0aW9uc01hcC5oYXMoXCJvYy1hcmFuZXNcIikgJiYgdGhpcy50cmFuc2xhdGlvbkZvcm0udmFsdWUuYXJhbmVzZVZhbHVlKSB7IHRoaXMudHJhbnNsYXRpb25zTWFwLmdldCgnb2MtYXJhbmVzJykudHJhbnNsYXRpb24gPSB0aGlzLnRyYW5zbGF0aW9uRm9ybS52YWx1ZS5hcmFuZXNlVmFsdWUgfVxyXG4gICAgaWYgKHRoaXMudHJhbnNsYXRpb25zTWFwLmhhcyhcImZyXCIpICYmIHRoaXMudHJhbnNsYXRpb25Gb3JtLnZhbHVlLmZyZW5jaFZhbHVlKSB7IHRoaXMudHJhbnNsYXRpb25zTWFwLmdldCgnZnInKS50cmFuc2xhdGlvbiA9IHRoaXMudHJhbnNsYXRpb25Gb3JtLnZhbHVlLmZyZW5jaFZhbHVlIH1cclxuICAgIHRoaXMuZGlhbG9nUmVmLmNsb3NlKHtldmVudDonQWNjZXB0JywgZGF0YTogdGhpcy50cmFuc2xhdGlvbnNNYXB9KTtcclxuICB9XHJcblxyXG4gIGNsb3NlRGlhbG9nKCl7XHJcbiAgICB0aGlzLmRpYWxvZ1JlZi5jbG9zZSh7ZXZlbnQ6J0NhbmNlbCd9KTtcclxuICB9XHJcblxyXG59XHJcbiJdfQ==