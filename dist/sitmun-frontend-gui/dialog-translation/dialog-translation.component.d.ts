import { OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import * as ɵngcc0 from '@angular/core';
export declare class DialogTranslationComponent implements OnInit {
    private dialogRef;
    private matIconRegistry;
    private domSanitizer;
    translationForm: FormGroup;
    translationsMap: Map<string, any>;
    languageByDefault: string;
    languagesAvailables: Array<any>;
    catalanAvailable: boolean;
    catalanValue: string;
    spanishAvailable: boolean;
    spanishValue: string;
    englishAvailable: boolean;
    englishValue: string;
    araneseAvailable: boolean;
    araneseValue: string;
    frenchAvailable: boolean;
    frenchValue: string;
    constructor(dialogRef: MatDialogRef<DialogTranslationComponent>, matIconRegistry: MatIconRegistry, domSanitizer: DomSanitizer);
    ngOnInit(): void;
    checkLanguagesAvailables(): void;
    checkTranslationsAlreadyDone(): void;
    initializeTranslationForm(): void;
    doAccept(): void;
    closeDialog(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<DialogTranslationComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<DialogTranslationComponent, "app-dialog-translation", never, {}, {}, never, never>;
}

//# sourceMappingURL=dialog-translation.component.d.ts.map