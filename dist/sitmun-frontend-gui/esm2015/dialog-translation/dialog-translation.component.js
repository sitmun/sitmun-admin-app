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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLXRyYW5zbGF0aW9uLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi9zcmMvbWFpbi9hbmd1bGFyLWxpYnJhcnkvcHJvamVjdHMvc2l0bXVuLWZyb250ZW5kLWd1aS9zcmMvbGliLyIsInNvdXJjZXMiOlsiZGlhbG9nLXRyYW5zbGF0aW9uL2RpYWxvZy10cmFuc2xhdGlvbi5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQVUsTUFBTSxlQUFlLENBQUM7QUFDbEQsT0FBTyxFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUN4RCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDeEQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ3pELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQVF6RCxNQUFNLE9BQU8sMEJBQTBCOzs7Ozs7SUFpQnJDLFlBQW9CLFNBQW1ELEVBQzdELGlCQUNBO1FBRlUsY0FBUyxHQUFULFNBQVMsQ0FBMEM7UUFDN0Qsb0JBQWUsR0FBZixlQUFlO1FBQ2YsaUJBQVksR0FBWixZQUFZO1FBYnRCLHdCQUFtQixLQUFLLENBQUM7UUFFekIsd0JBQW1CLEtBQUssQ0FBQztRQUV6Qix3QkFBbUIsS0FBSyxDQUFDO1FBRXpCLHdCQUFtQixLQUFLLENBQUM7UUFFekIsdUJBQWtCLEtBQUssQ0FBQztRQU10QixJQUFJLENBQUMseUJBQXlCLEVBQUUsQ0FBQztRQUNqQyxJQUFJLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FDN0IsY0FBYyxFQUNkLElBQUksQ0FBQyxZQUFZLENBQUMsOEJBQThCLENBQUMsd0JBQXdCLENBQUMsQ0FDM0UsQ0FBQztRQUNGLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUM3QixjQUFjLEVBQ2QsSUFBSSxDQUFDLFlBQVksQ0FBQyw4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Q29tcG9uZW50LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgRm9ybUNvbnRyb2wsIEZvcm1Hcm91cCB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcclxuaW1wb3J0IHsgTWF0RGlhbG9nUmVmIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvZGlhbG9nJztcclxuaW1wb3J0IHsgTWF0SWNvblJlZ2lzdHJ5IH0gZnJvbSBcIkBhbmd1bGFyL21hdGVyaWFsL2ljb25cIjtcclxuaW1wb3J0IHsgRG9tU2FuaXRpemVyIH0gZnJvbSBcIkBhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXJcIjtcclxuXHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2FwcC1kaWFsb2ctdHJhbnNsYXRpb24nLFxyXG4gIHRlbXBsYXRlVXJsOiAnLi9kaWFsb2ctdHJhbnNsYXRpb24uY29tcG9uZW50Lmh0bWwnLFxyXG4gIHN0eWxlVXJsczogWycuL2RpYWxvZy10cmFuc2xhdGlvbi5jb21wb25lbnQuc2NzcyddXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBEaWFsb2dUcmFuc2xhdGlvbkNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcblxyXG4gIHRyYW5zbGF0aW9uRm9ybTogRm9ybUdyb3VwO1xyXG4gIHRyYW5zbGF0aW9uc01hcDogIE1hcDxzdHJpbmcsIGFueT47XHJcbiAgbGFuZ3VhZ2VCeURlZmF1bHQ6ICBzdHJpbmc7XHJcbiAgbGFuZ3VhZ2VzQXZhaWxhYmxlczogQXJyYXk8YW55PjtcclxuICBjYXRhbGFuQXZhaWxhYmxlID0gZmFsc2U7XHJcbiAgY2F0YWxhblZhbHVlOiBzdHJpbmc7XHJcbiAgc3BhbmlzaEF2YWlsYWJsZSA9IGZhbHNlO1xyXG4gIHNwYW5pc2hWYWx1ZTogc3RyaW5nO1xyXG4gIGVuZ2xpc2hBdmFpbGFibGUgPSBmYWxzZTtcclxuICBlbmdsaXNoVmFsdWU6IHN0cmluZztcclxuICBhcmFuZXNlQXZhaWxhYmxlID0gZmFsc2U7XHJcbiAgYXJhbmVzZVZhbHVlOiBzdHJpbmc7XHJcbiAgZnJlbmNoQXZhaWxhYmxlID0gZmFsc2U7XHJcbiAgZnJlbmNoVmFsdWU6IHN0cmluZztcclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBkaWFsb2dSZWY6IE1hdERpYWxvZ1JlZjxEaWFsb2dUcmFuc2xhdGlvbkNvbXBvbmVudD4sXHJcbiAgICBwcml2YXRlIG1hdEljb25SZWdpc3RyeTogTWF0SWNvblJlZ2lzdHJ5LFxyXG4gICAgcHJpdmF0ZSBkb21TYW5pdGl6ZXI6IERvbVNhbml0aXplcikgeyBcclxuICAgIHRoaXMuaW5pdGlhbGl6ZVRyYW5zbGF0aW9uRm9ybSgpO1xyXG4gICAgdGhpcy5tYXRJY29uUmVnaXN0cnkuYWRkU3ZnSWNvbihcclxuICAgICAgYGljb25fbGFuZ19jYWAsXHJcbiAgICAgIHRoaXMuZG9tU2FuaXRpemVyLmJ5cGFzc1NlY3VyaXR5VHJ1c3RSZXNvdXJjZVVybCgnYXNzZXRzL2ltZy9mbGFnX2NhLnN2ZycpXHJcbiAgICApO1xyXG4gICAgdGhpcy5tYXRJY29uUmVnaXN0cnkuYWRkU3ZnSWNvbihcclxuICAgICAgYGljb25fbGFuZ19lc2AsXHJcbiAgICAgIHRoaXMuZG9tU2FuaXRpemVyLmJ5cGFzc1NlY3VyaXR5VHJ1c3RSZXNvdXJjZVVybCgnYXNzZXRzL2ltZy9mbGFnX2VzLnN2ZycpXHJcbiAgICApO1xyXG4gICAgdGhpcy5tYXRJY29uUmVnaXN0cnkuYWRkU3ZnSWNvbihcclxuICAgICAgYGljb25fbGFuZ19lbmAsXHJcbiAgICAgIHRoaXMuZG9tU2FuaXRpemVyLmJ5cGFzc1NlY3VyaXR5VHJ1c3RSZXNvdXJjZVVybCgnYXNzZXRzL2ltZy9mbGFnX2VuLnN2ZycpXHJcbiAgICApO1xyXG4gICAgdGhpcy5tYXRJY29uUmVnaXN0cnkuYWRkU3ZnSWNvbihcclxuICAgICAgYGljb25fbGFuZ19vY2AsXHJcbiAgICAgIHRoaXMuZG9tU2FuaXRpemVyLmJ5cGFzc1NlY3VyaXR5VHJ1c3RSZXNvdXJjZVVybCgnYXNzZXRzL2ltZy9mbGFnX29jLnN2ZycpXHJcbiAgICApO1xyXG4gICAgdGhpcy5tYXRJY29uUmVnaXN0cnkuYWRkU3ZnSWNvbihcclxuICAgICAgYGljb25fbGFuZ19mcmAsXHJcbiAgICAgIHRoaXMuZG9tU2FuaXRpemVyLmJ5cGFzc1NlY3VyaXR5VHJ1c3RSZXNvdXJjZVVybCgnYXNzZXRzL2ltZy9mbGFnX2ZyLnN2ZycpXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgbmdPbkluaXQoKTogdm9pZCB7XHJcblxyXG4gICAgdGhpcy5jaGVja0xhbmd1YWdlc0F2YWlsYWJsZXMoKTtcclxuICAgIHRoaXMuY2hlY2tUcmFuc2xhdGlvbnNBbHJlYWR5RG9uZSgpO1xyXG4gIH1cclxuXHJcbiAgY2hlY2tMYW5ndWFnZXNBdmFpbGFibGVzKCk6IHZvaWQge1xyXG4gICAgdGhpcy5sYW5ndWFnZXNBdmFpbGFibGVzLmZvckVhY2goZWxlbWVudCA9PiB7XHJcbiAgICAgIGlmKGVsZW1lbnQuc2hvcnRuYW1lID09ICdjYScgJiYgdGhpcy5sYW5ndWFnZUJ5RGVmYXVsdCE9ICdjYScpIHsgIHRoaXMuY2F0YWxhbkF2YWlsYWJsZSA9IHRydWUgfVxyXG4gICAgICBpZihlbGVtZW50LnNob3J0bmFtZSA9PSAnZXMnICYmIHRoaXMubGFuZ3VhZ2VCeURlZmF1bHQhPSAnZXMnKSB7ICB0aGlzLnNwYW5pc2hBdmFpbGFibGUgPSB0cnVlIH1cclxuICAgICAgaWYoZWxlbWVudC5zaG9ydG5hbWUgPT0gJ2VuJyAmJiB0aGlzLmxhbmd1YWdlQnlEZWZhdWx0IT0gJ2VuJykgeyAgdGhpcy5lbmdsaXNoQXZhaWxhYmxlID0gdHJ1ZSB9XHJcbiAgICAgIGlmKGVsZW1lbnQuc2hvcnRuYW1lID09ICdvYy1hcmFuZXMnICYmIHRoaXMubGFuZ3VhZ2VCeURlZmF1bHQhPSAnb2MtYXJhbmVzJykgeyAgdGhpcy5hcmFuZXNlQXZhaWxhYmxlID0gdHJ1ZSB9XHJcbiAgICAgIGlmKGVsZW1lbnQuc2hvcnRuYW1lID09ICdmcicgJiYgdGhpcy5sYW5ndWFnZUJ5RGVmYXVsdCE9ICdmcicpIHsgIHRoaXMuZnJlbmNoQXZhaWxhYmxlID0gdHJ1ZSB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGNoZWNrVHJhbnNsYXRpb25zQWxyZWFkeURvbmUoKTogdm9pZCB7XHJcbiAgICB0aGlzLnRyYW5zbGF0aW9uc01hcC5mb3JFYWNoKCh2YWx1ZTogYW55LCBrZXk6IHN0cmluZykgPT4ge1xyXG4gICAgICBpZihrZXkgPT0gJ2NhJyAmJiB2YWx1ZSAmJiB2YWx1ZS50cmFuc2xhdGlvbikgeyB0aGlzLnRyYW5zbGF0aW9uRm9ybS5wYXRjaFZhbHVlKHsgY2F0YWxhblZhbHVlOiB2YWx1ZS50cmFuc2xhdGlvbiB9KSB9XHJcbiAgICAgIGlmKGtleSA9PSAnZXMnICYmIHZhbHVlICYmIHZhbHVlLnRyYW5zbGF0aW9uKSB7IHRoaXMudHJhbnNsYXRpb25Gb3JtLnBhdGNoVmFsdWUoeyBzcGFuaXNoVmFsdWU6IHZhbHVlLnRyYW5zbGF0aW9uIH0pIH1cclxuICAgICAgaWYoa2V5ID09ICdlbicgJiYgdmFsdWUgJiYgdmFsdWUudHJhbnNsYXRpb24pIHsgdGhpcy50cmFuc2xhdGlvbkZvcm0ucGF0Y2hWYWx1ZSh7IGVuZ2xpc2hWYWx1ZTogdmFsdWUudHJhbnNsYXRpb24gfSkgfVxyXG4gICAgICBpZihrZXkgPT0gJ29jLWFyYW5lcycgJiYgdmFsdWUgJiYgdmFsdWUudHJhbnNsYXRpb24pIHsgdGhpcy50cmFuc2xhdGlvbkZvcm0ucGF0Y2hWYWx1ZSh7IGFyYW5lc2VWYWx1ZTogdmFsdWUudHJhbnNsYXRpb24gfSkgfVxyXG4gICAgICBpZihrZXkgPT0gJ2ZyJyAmJiB2YWx1ZSAmJiB2YWx1ZS50cmFuc2xhdGlvbikgeyB0aGlzLnRyYW5zbGF0aW9uRm9ybS5wYXRjaFZhbHVlKHsgZnJlbmNoVmFsdWU6IHZhbHVlLnRyYW5zbGF0aW9uIH0pIH1cclxuICB9KTtcclxuICB9XHJcblxyXG4gIGluaXRpYWxpemVUcmFuc2xhdGlvbkZvcm0oKTogdm9pZCB7XHJcblxyXG4gICAgdGhpcy50cmFuc2xhdGlvbkZvcm0gPSBuZXcgRm9ybUdyb3VwKHtcclxuICAgICAgY2F0YWxhblZhbHVlOiBuZXcgRm9ybUNvbnRyb2wobnVsbCwgW10pLFxyXG4gICAgICBzcGFuaXNoVmFsdWU6IG5ldyBGb3JtQ29udHJvbChudWxsLCBbXSksXHJcbiAgICAgIGVuZ2xpc2hWYWx1ZTogbmV3IEZvcm1Db250cm9sKG51bGwsIFtdKSxcclxuICAgICAgYXJhbmVzZVZhbHVlOiBuZXcgRm9ybUNvbnRyb2wobnVsbCwgW10pLFxyXG4gICAgICBmcmVuY2hWYWx1ZTogbmV3IEZvcm1Db250cm9sKG51bGwsIFtdKSxcclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICBkb0FjY2VwdCgpe1xyXG4gICAgaWYgKHRoaXMudHJhbnNsYXRpb25zTWFwLmhhcyhcImNhXCIpICYmIHRoaXMudHJhbnNsYXRpb25Gb3JtLnZhbHVlLmNhdGFsYW5WYWx1ZSkgeyB0aGlzLnRyYW5zbGF0aW9uc01hcC5nZXQoJ2NhJykudHJhbnNsYXRpb24gPSB0aGlzLnRyYW5zbGF0aW9uRm9ybS52YWx1ZS5jYXRhbGFuVmFsdWUgfVxyXG4gICAgaWYgKHRoaXMudHJhbnNsYXRpb25zTWFwLmhhcyhcImVzXCIpICYmIHRoaXMudHJhbnNsYXRpb25Gb3JtLnZhbHVlLnNwYW5pc2hWYWx1ZSkgeyB0aGlzLnRyYW5zbGF0aW9uc01hcC5nZXQoJ2VzJykudHJhbnNsYXRpb24gPSB0aGlzLnRyYW5zbGF0aW9uRm9ybS52YWx1ZS5zcGFuaXNoVmFsdWUgfVxyXG4gICAgaWYgKHRoaXMudHJhbnNsYXRpb25zTWFwLmhhcyhcImVuXCIpICYmIHRoaXMudHJhbnNsYXRpb25Gb3JtLnZhbHVlLmVuZ2xpc2hWYWx1ZSkgeyB0aGlzLnRyYW5zbGF0aW9uc01hcC5nZXQoJ2VuJykudHJhbnNsYXRpb24gPSB0aGlzLnRyYW5zbGF0aW9uRm9ybS52YWx1ZS5lbmdsaXNoVmFsdWUgfVxyXG4gICAgaWYgKHRoaXMudHJhbnNsYXRpb25zTWFwLmhhcyhcIm9jLWFyYW5lc1wiKSAmJiB0aGlzLnRyYW5zbGF0aW9uRm9ybS52YWx1ZS5hcmFuZXNlVmFsdWUpIHsgdGhpcy50cmFuc2xhdGlvbnNNYXAuZ2V0KCdvYy1hcmFuZXMnKS50cmFuc2xhdGlvbiA9IHRoaXMudHJhbnNsYXRpb25Gb3JtLnZhbHVlLmFyYW5lc2VWYWx1ZSB9XHJcbiAgICBpZiAodGhpcy50cmFuc2xhdGlvbnNNYXAuaGFzKFwiZnJcIikgJiYgdGhpcy50cmFuc2xhdGlvbkZvcm0udmFsdWUuZnJlbmNoVmFsdWUpIHsgdGhpcy50cmFuc2xhdGlvbnNNYXAuZ2V0KCdmcicpLnRyYW5zbGF0aW9uID0gdGhpcy50cmFuc2xhdGlvbkZvcm0udmFsdWUuZnJlbmNoVmFsdWUgfVxyXG4gICAgdGhpcy5kaWFsb2dSZWYuY2xvc2Uoe2V2ZW50OidBY2NlcHQnLCBkYXRhOiB0aGlzLnRyYW5zbGF0aW9uc01hcH0pO1xyXG4gIH1cclxuXHJcbiAgY2xvc2VEaWFsb2coKXtcclxuICAgIHRoaXMuZGlhbG9nUmVmLmNsb3NlKHtldmVudDonQ2FuY2VsJ30pO1xyXG4gIH1cclxuXHJcbn1cclxuIl19