import { Component, HostBinding} from '@angular/core';

import { IFloatingFilterAngularComp } from '@ag-grid-community/angular';
import {
  IFloatingFilterParams,
} from '@ag-grid-community/core';


@Component({
  selector: 'app-btn-checkbox-filter',
  templateUrl: './btn-checkbox-filter.component.html',
  styles: []
})
export class BtnCheckboxFilterComponent implements IFloatingFilterAngularComp  {
  @HostBinding('class') hostClass = 'hostClass';
  private params: IFloatingFilterParams;
  public currentValue = '';

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

    this.currentValue = newValue;
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
