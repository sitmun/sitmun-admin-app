import { OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import * as ɵngcc0 from '@angular/core';
export declare class DialogFormComponent implements OnInit {
    private dialogRef;
    dialog: MatDialog;
    private translate;
    form: FormGroup;
    title: string;
    HTMLReceived: any;
    constructor(dialogRef: MatDialogRef<DialogFormComponent>, dialog: MatDialog, translate: TranslateService);
    ngOnInit(): void;
    doAdd(): void;
    closeDialog(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<DialogFormComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<DialogFormComponent, "app-dialog-form", never, {}, {}, never, never>;
}

//# sourceMappingURL=dialog-form.component.d.ts.map