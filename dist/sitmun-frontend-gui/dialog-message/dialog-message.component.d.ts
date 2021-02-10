import { OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import * as ɵngcc0 from '@angular/core';
export declare class DialogMessageComponent implements OnInit {
    private dialogRef;
    title: string;
    message: string;
    hideCancelButton: boolean;
    constructor(dialogRef: MatDialogRef<DialogMessageComponent>);
    ngOnInit(): void;
    doAccept(): void;
    closeDialog(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<DialogMessageComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<DialogMessageComponent, "app-dialog-message", never, {}, {}, never, never>;
}

//# sourceMappingURL=dialog-message.component.d.ts.map