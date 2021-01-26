import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { OnDestroy } from '@angular/core';
import * as i0 from "@angular/core";
export declare class BtnCheckboxRenderedComponent implements ICellRendererAngularComp, OnDestroy {
    params: any;
    agInit(params: any): void;
    refresh(params: any): boolean;
    invokeParentMethod(): void;
    btnCheckedHandler(event: any): void;
    getParams(): any;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDef<BtnCheckboxRenderedComponent, never>;
    static ɵcmp: i0.ɵɵComponentDefWithMeta<BtnCheckboxRenderedComponent, "app-btn-checkbox-rendered", never, {}, {}, never, never>;
}
