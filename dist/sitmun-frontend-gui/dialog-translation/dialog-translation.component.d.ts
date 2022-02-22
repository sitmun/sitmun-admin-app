import { OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
export declare class DialogTranslationComponent implements OnInit {
    private dialogRef;
    private matIconRegistry;
    private domSanitizer;
    translationForm: FormGroup;
    translationsMap: Map<string, any>;
    languageByDefault: string;
    languagesAvailables: Array<any>;
    loading: boolean;
    constructor(dialogRef: MatDialogRef<DialogTranslationComponent>, matIconRegistry: MatIconRegistry, domSanitizer: DomSanitizer);
    ngOnInit(): void;
    initializeDialog(): void;
    registerIcon(elementShortname: any): void;
    initializeForm(elementShortname: any): void;
    getIconName(elementShortname: any): string;
    doAccept(): void;
    closeDialog(): void;
}
