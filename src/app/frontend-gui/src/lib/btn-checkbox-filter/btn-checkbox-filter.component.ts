import { Component} from '@angular/core';
import {
  IFloatingFilterParams,
} from '@ag-grid-community/core';
import { IFloatingFilterAngularComp } from '@ag-grid-community/angular';


@Component({
  selector: 'app-btn-checkbox-filter',
  templateUrl: './btn-checkbox-filter.component.html',
  styleUrls: ['./btn-checkbox-filter.component.scss'],
  host: {'class': 'hostClass'}
})
export class BtnCheckboxFilterComponent implements IFloatingFilterAngularComp  {
  private params: IFloatingFilterParams;
  public currentValue: string = '';

  agInit(params: IFloatingFilterParams): void {
    this.params = params;
  }

  onChange(newValue): void {
    if (newValue === '') {
      this.currentValue = null;
      this.params.parentFilterInstance((instance) => {
          instance.onFloatingFilterChanged(null, null);
      });
      return;
    }

    this.currentValue = this.currentValue;
    this.params.parentFilterInstance((instance) => {
        instance.onFloatingFilterChanged('equals',newValue);
    });
  }

  onParentModelChanged(parentModel: any) {
    if (!parentModel) {
        this.currentValue = null;
    } else {
        this.currentValue = parentModel.filter;
    }
  }
}