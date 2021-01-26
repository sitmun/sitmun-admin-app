import { OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import * as i0 from "@angular/core";
export declare class DialogFormComponent implements OnInit {
    private dialogRef;
    form: FormGroup;
    title: string;
    HTMLReceived: any;
    constructor(dialogRef: MatDialogRef<DialogFormComponent>);
    ngOnInit(): void;
    doAdd(): void;
    closeDialog(): void;
    static ɵfac: i0.ɵɵFactoryDef<DialogFormComponent, never>;
    static ɵcmp: i0.ɵɵComponentDefWithMeta<DialogFormComponent, "app-dialog-form", never, {}, {}, never, never>;
}
