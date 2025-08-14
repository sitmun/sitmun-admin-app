import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import {CUSTOM_ELEMENTS_SCHEMA, Component, NgModule, OnDestroy} from '@angular/core';
import { MatIconModule } from '@angular/material/icon'


@Component({
  selector: 'app-btn-edit-rendered',
  templateUrl: './btn-edit-rendered.component.html',
  styles: []
})
export class BtnEditRenderedComponent implements ICellRendererAngularComp, OnDestroy {

  public params: any;

  agInit(params: any): void {
    this.params = params;
  }

  refresh(params: any): boolean {
    return true;
  }

  btnClickedHandler($event) {
    this.params.clicked(this.params.value);
  }

  getParams(){
    return this.params;
  }

  ngOnDestroy() {
    // no need to remove the button click handler
  }

}
