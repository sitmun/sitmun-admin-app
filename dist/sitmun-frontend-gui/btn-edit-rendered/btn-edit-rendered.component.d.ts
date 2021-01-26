import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { OnDestroy } from '@angular/core';
import * as i0 from "@angular/core";
export declare class BtnEditRenderedComponent implements ICellRendererAngularComp, OnDestroy {
    params: any;
    agInit(params: any): void;
    refresh(params: any): boolean;
    btnClickedHandler($event: any): void;
    getParams(): any;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDef<BtnEditRenderedComponent, never>;
    static ɵcmp: i0.ɵɵComponentDefWithMeta<BtnEditRenderedComponent, "app-btn-edit-rendered", never, {}, {}, never, never>;
}
