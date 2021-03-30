import { OnInit, EventEmitter } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
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
    changeHeightButton: boolean;
    heightByDefault: any;
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
}
