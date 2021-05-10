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
    catalanValue: string;
    spanishValue: string;
    englishValue: string;
    araneseValue: string;
    constructor(dialogRef: MatDialogRef<DialogTranslationComponent>, matIconRegistry: MatIconRegistry, domSanitizer: DomSanitizer);
    ngOnInit(): void;
    initializeTranslationForm(): void;
    doAccept(): void;
    closeDialog(): void;
}
