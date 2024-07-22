import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import {
  IDoesFilterPassParams,
  IRowNode,
  IFloatingFilter,
  NumberFilter,
  IFloatingFilterParams,
} from '@ag-grid-community/core';
import { AgFrameworkComponent } from '@ag-grid-community/angular';

@Component({
  selector: 'app-btn-checkbox-filter',
  templateUrl: './btn-checkbox-filter.component.html',
  styleUrls: ['./btn-checkbox-filter.component.scss'],
  host: {'class': 'hostClass'}
})
export class BtnCheckboxFilterComponent implements IFloatingFilter, AgFrameworkComponent<IFloatingFilterParams>   {
  private params: IFloatingFilterParams;
  private valueGetter: (rowNode: IRowNode<any>) => any;
  public text: string = '';
  public currentValue: number;
  @ViewChild('input', { read: ViewContainerRef }) public input;

  agInit(params: IFloatingFilterParams): void {
    this.params = params;
    this.params.suppressFilterButton=true;
    this.valueGetter = (rowNode: IRowNode<any>) => params.filterParams.valueGetter({
      data: rowNode.data,
      node: rowNode,
      getValue: (field: string) => rowNode.data[field],
      column: params.column,
      colDef: params.column.getColDef(),
      api: params.api,
      context: params.context
    });
  }

  isFilterActive(): boolean {
    return this.text != null && this.text !== '';
  }

  doesFilterPass(params: IDoesFilterPassParams): boolean {
    return this.text
      .toLowerCase()
      .split(' ')
      .every(
        (filterWord) =>
          this.valueGetter(params.node)
            .toString()
            .toLowerCase()
            .indexOf(filterWord) >= 0
      );
  }

  getModel(): any {
    return { value: this.text };
  }

  setModel(model: any): void {
    this.text = model ? model.value : '';
  }

  onChange(newValue): void {
    this.params.parentFilterInstance(function (instance) {
      (<NumberFilter>instance).onFloatingFilterChanged(
        'contains',
        newValue
      );
    });
  }

  onParentModelChanged(parentModel: any): void {
    if (!parentModel) {
      this.currentValue = 0;
    } else {
      this.currentValue = parentModel.filter;
    }
  }
}