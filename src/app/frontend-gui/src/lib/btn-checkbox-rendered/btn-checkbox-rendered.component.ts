import { Component } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';

import { ICellRendererAngularComp } from '@ag-grid-community/angular';

@Component({
  selector: 'app-btn-checkbox-rendered',
  templateUrl: './btn-checkbox-rendered.component.html',
  styles: []
})
export class BtnCheckboxRenderedComponent implements ICellRendererAngularComp {

  public params: any;

  agInit(params: any): void {
    this.params = params;
  }

  refresh(params: any): boolean {
    this.params = params;

    return true;
  }

  public invokeParentMethod() {
    this.params.context.componentParent.methodFromParent(
      `Row: ${this.params.node.rowIndex}, Col: ${this.params.colDef.headerName}`
    );
  }

  btnCheckedHandler(event: MatCheckboxChange): void {
    if (this.params.colDef.editable) {
      const checked = event.checked;
      const colId = this.params.column.colId;
      this.params.value = checked;
      this.params.api.undoRedoService.isFilling = true;
      this.params.node.setDataValue(colId, checked);
    }
  }

  getParams(){
    return this.params;
  }

}
