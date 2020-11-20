import { EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { Module } from '@ag-grid-community/all-modules';
import * as ɵngcc0 from '@angular/core';
export declare class DataGridComponent {
    modules: Module[];
    searchValue: string;
    private gridApi;
    private gridColumnApi;
    columnaEstat: boolean;
    map: Map<number, number>;
    private params;
    rowData: any[];
    comptadorCanvis: number;
    comptadorCanvisAnterior: number;
    comptadorRedo: number;
    canviAmbModificacions: boolean;
    gridOptions: any;
    columnDefs: any[];
    getAll: () => Observable<any>;
    botoDescartarCanvis: boolean;
    botoUndo: boolean;
    botoRedo: boolean;
    botoAplicarCanvis: boolean;
    botoElimina: boolean;
    botoNou: boolean;
    searchGeneral: boolean;
    remove: EventEmitter<any[]>;
    new: EventEmitter<boolean>;
    sendChanges: EventEmitter<any[]>;
    constructor();
    onGridReady(params: any): void;
    quickSearch(): void;
    getElements(): void;
    removeData(): void;
    newData(): void;
    applyChanges(): void;
    deleteChanges(): void;
    onFilterModified(): void;
    undo(): void;
    redo(): void;
    onCellEditingStopped(e: any): void;
    onCellValueChanged(params: any): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<DataGridComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<DataGridComponent, "app-data-grid", never, { "columnDefs": "columnDefs"; "getAll": "getAll"; "botoDescartarCanvis": "botoDescartarCanvis"; "botoUndo": "botoUndo"; "botoRedo": "botoRedo"; "botoAplicarCanvis": "botoAplicarCanvis"; "botoElimina": "botoElimina"; "botoNou": "botoNou"; "searchGeneral": "searchGeneral"; }, { "remove": "remove"; "new": "new"; "sendChanges": "sendChanges"; }, never, never>;
}

//# sourceMappingURL=data-grid.component.d.ts.map