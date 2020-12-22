import { OnInit, EventEmitter } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import * as ɵngcc0 from '@angular/core';
export interface DialogData {
    _GetAllsTable: Array<() => Observable<any>>;
    _columnDefsTable: Array<any[]>;
    _singleSelectionTable: Array<boolean>;
}
export declare class DialogGridComponent implements OnInit {
    private dialogRef;
    title: string;
    getAllRows: Subject<boolean>;
    private _addButtonClickedSubscription;
    tablesReceivedCounter: number;
    allRowsReceived: Array<any[]>;
    themeGrid: any;
    getAllsTable: Array<() => Observable<any>>;
    columnDefsTable: Array<any[]>;
    singleSelectionTable: Array<boolean>;
    titlesTable: Array<string>;
    addButtonClickedSubscription: Observable<boolean>;
    nonEditable: boolean;
    joinTables: EventEmitter<Array<any[]>>;
    constructor(dialogRef: MatDialogRef<DialogGridComponent>);
    ngOnInit(): void;
    getAllSelectedRows(): void;
    joinRowsReceived(data: any[]): void;
    doAdd(rowsToAdd: any): void;
    closeDialog(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<DialogGridComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<DialogGridComponent, "app-dialog-grid", never, {}, { "joinTables": "joinTables"; }, never, never>;
}

//# sourceMappingURL=dialog-grid.component.d.ts.map