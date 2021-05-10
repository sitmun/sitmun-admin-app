import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { OnDestroy } from '@angular/core';
export declare class BtnEditRenderedComponent implements ICellRendererAngularComp, OnDestroy {
    params: any;
    agInit(params: any): void;
    refresh(params: any): boolean;
    btnClickedHandler($event: any): void;
    getParams(): any;
    ngOnDestroy(): void;
}
