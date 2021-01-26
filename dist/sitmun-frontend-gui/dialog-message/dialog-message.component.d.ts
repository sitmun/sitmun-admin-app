import { OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import * as i0 from "@angular/core";
export declare class DialogMessageComponent implements OnInit {
    private dialogRef;
    title: string;
    message: string;
    constructor(dialogRef: MatDialogRef<DialogMessageComponent>);
    ngOnInit(): void;
    doAccept(): void;
    closeDialog(): void;
    static ɵfac: i0.ɵɵFactoryDef<DialogMessageComponent, never>;
    static ɵcmp: i0.ɵɵComponentDefWithMeta<DialogMessageComponent, "app-dialog-message", never, {}, {}, never, never>;
}
