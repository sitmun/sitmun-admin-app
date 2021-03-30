import { IDoesFilterPassParams, IFloatingFilter, IFloatingFilterParams } from '@ag-grid-community/all-modules';
import { AgFrameworkComponent } from '@ag-grid-community/angular';
import * as ɵngcc0 from '@angular/core';
export declare class BtnCheckboxFilterComponent implements IFloatingFilter, AgFrameworkComponent<IFloatingFilterParams> {
    private params;
    private valueGetter;
    text: string;
    currentValue: number;
    input: any;
    agInit(params: IFloatingFilterParams): void;
    isFilterActive(): boolean;
    doesFilterPass(params: IDoesFilterPassParams): boolean;
    getModel(): any;
    setModel(model: any): void;
    onChange(newValue: any): void;
    onParentModelChanged(parentModel: any): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<BtnCheckboxFilterComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<BtnCheckboxFilterComponent, "app-btn-checkbox-filter", never, {}, {}, never, never>;
}

//# sourceMappingURL=btn-checkbox-filter.component.d.ts.map