import { OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
export declare class DialogTranslationComponent implements OnInit {
    private dialogRef;
    translationForm: FormGroup;
    column: string;
    elementId: string;
    languageId: string;
    catalanValue: string;
    spanishValue: string;
    englishValue: string;
    constructor(dialogRef: MatDialogRef<DialogTranslationComponent>);
    ngOnInit(): void;
    initializeTranslationForm(): void;
    doAccept(): void;
    doDelete(): void;
    closeDialog(): void;
}
