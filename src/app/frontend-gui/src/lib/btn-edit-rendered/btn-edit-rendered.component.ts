import { Component, OnDestroy} from '@angular/core';

import { ICellRendererAngularComp } from '@ag-grid-community/angular';


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

  refresh(_params: any): boolean {
    return true;
  }

  btnClickedHandler(_$event) {
    this.params.clicked(this.params.value);
  }

  getParams(){
    return this.params;
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnDestroy() {
    // no need to remove the button click handler
  }

}
