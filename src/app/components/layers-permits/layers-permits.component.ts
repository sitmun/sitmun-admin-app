import { Component, OnInit } from '@angular/core';
import { CartographyGroupService, CartographyGroup } from 'dist/sitmun-frontend-core/';
import { UtilsService } from '../../services/utils.service';
import { BtnEditRenderedComponent } from 'dist/sitmun-frontend-gui/';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-layers-permits',
  templateUrl: './layers-permits.component.html',
  styleUrls: ['./layers-permits.component.scss']
})
export class LayersPermitsComponent implements OnInit {

  dataUpdatedEvent: Subject<boolean> = new Subject<boolean>();
  themeGrid: any = environment.agGridTheme;
  columnDefs: any[];
  public frameworkComponents = {
    btnEditRendererComponent: BtnEditRenderedComponent
  };

  permissionGroupTypes: Array<any> = [];

  constructor(public cartographyGroupService: CartographyGroupService,
    private utils: UtilsService,
    private router: Router
  ) {

  }

  ngOnInit() {

    this.utils.getCodeListValues('cartographyPermission.type').subscribe(
      resp => {
        this.permissionGroupTypes.push(...resp);
      }
    );

    this.columnDefs = [
      {
        headerName: '',

        checkboxSelection: true,
        headerCheckboxSelection: true,
        editable: false,
        filter: false,
        width: 20,
        lockPosition: true,
      },
      {
        headerName: '',
        field: 'id',
        editable: false,
        filter: false,
        width: 27.5,
        lockPosition: true,
        cellRenderer: 'btnEditRendererComponent',
        cellRendererParams: {
          clicked: this.newData.bind(this)
        },
      },
      { headerName: 'Id', field: 'id', editable: false },
      { headerName: this.utils.getTranslate('layersPermitsEntity.name'), field: 'name' },
      {
        headerName: this.utils.getTranslate('layersPermitsEntity.type'),
        valueGetter: (params) => { 
          var alias=this.permissionGroupTypes.filter((type) => type.value == params.data.type)[0];
          return alias!=undefined? alias.description: params.data.type
        }
      },
    ];

  }

  getAllLayersPermits = () => {

    return this.cartographyGroupService.getAll();
  }

  newData(id: any) {
    this.router.navigate(['layersPermits', id, 'layersPermitsForm']);
  }

  applyChanges(data: CartographyGroup[]) {
    const promises: Promise<any>[] = [];
    data.forEach(cartographyGroup => {
      promises.push(new Promise((resolve, reject) => { this.cartographyGroupService.update(cartographyGroup).toPromise().then((resp) => { resolve() }) }));
      Promise.all(promises).then(() => {
        this.dataUpdatedEvent.next(true);
      });
    });
  }

  add(data: CartographyGroup[]) {
    const promises: Promise<any>[] = [];
    data.forEach(cartographyGroup => {
      cartographyGroup.id = null;
      promises.push(new Promise((resolve, reject) => { this.cartographyGroupService.create(cartographyGroup).toPromise().then((resp) => { resolve() }) }));
      Promise.all(promises).then(() => {
        this.dataUpdatedEvent.next(true);
      });
    });

  }

  removeData(data: CartographyGroup[]) {
    const promises: Promise<any>[] = [];
    data.forEach(cartographyGroup => {
      promises.push(new Promise((resolve, reject) => { this.cartographyGroupService.delete(cartographyGroup).toPromise().then((resp) => { resolve() }) }));
      Promise.all(promises).then(() => {
        this.dataUpdatedEvent.next(true);
      });
    });

  }

}
