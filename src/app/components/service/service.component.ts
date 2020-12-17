import { Component, OnInit } from '@angular/core';
import { ServiceService, Service } from 'dist/sitmun-frontend-core/';
import { UtilsService } from '../../services/utils.service';
import { BtnEditRenderedComponent } from 'dist/sitmun-frontend-gui/';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss']
})
export class ServiceComponent implements OnInit {

  dataUpdatedEvent: Subject<boolean> = new Subject <boolean>();
  themeGrid: any = environment.agGridTheme;
  columnDefs: any[];
  public frameworkComponents = {
    btnEditRendererComponent: BtnEditRenderedComponent
  };

  constructor(public serviceService: ServiceService,
    private utils: UtilsService,
    private router: Router,
  ) {

  }

  ngOnInit() {
    this.columnDefs = [
      {
        headerName: '',
        checkboxSelection: true,
        headerCheckboxSelection: true,
        editable: false,
        filter: false,
        width: 40,
        lockPosition: true,
      },
      {
        headerName: '',
        field: 'id',
        editable: false,
        filter: false,
        width: 55,
        lockPosition: true,
        cellRenderer: 'btnEditRendererComponent',
        cellRendererParams: {
          clicked: this.newData.bind(this)
        },
      },
      { headerName: 'Id', field: 'id', editable: false },
      { headerName: this.utils.getTranslate('serviceEntity.name'), field: 'name' },
      { headerName: this.utils.getTranslate('serviceEntity.type'), field: 'type' },
      { headerName: this.utils.getTranslate('serviceEntity.serviceURL'), field: 'serviceURL' },
      { headerName: this.utils.getTranslate('serviceEntity.supportedSRS'), field: 'supportedSRS' },
      { headerName: this.utils.getTranslate('serviceEntity.createdDate'), field: 'createdDate' } // type: 'dateColumn'
    ];
  }

  getAllConnections = () => {

    return this.serviceService.getAll();
  }

  newData(id: any) {
    this.router.navigate(['service', id, 'serviceForm']);
  }

  applyChanges(data: Service[]) {
    const promises: Promise<any>[] = [];
    data.forEach(service => {
      promises.push(new Promise((resolve, reject) => {​​​​​​​ this.serviceService.update(service).toPromise().then((resp) =>{​​​​​​​resolve()}​​​​​​​)}​​​​​​​));
      Promise.all(promises).then(() => {
        this.dataUpdatedEvent.next(true);
      });
    });
  }
  
  add(data: Service[]) {
    const promises: Promise<any>[] = [];
    data.forEach(service => {
      service.id = null;
      promises.push(new Promise((resolve, reject) => {​​​​​​​ this.serviceService.create(service).toPromise().then((resp) =>{​​​​​​​resolve()}​​​​​​​)}​​​​​​​));
      Promise.all(promises).then(() => {
        this.dataUpdatedEvent.next(true);
      });
    });

  }

  removeData(data: Service[]) {
    const promises: Promise<any>[] = [];
    data.forEach(service => {
      promises.push(new Promise((resolve, reject) => {​​​​​​​ this.serviceService.delete(service).toPromise().then((resp) =>{​​​​​​​resolve()}​​​​​​​)}​​​​​​​));
      Promise.all(promises).then(() => {
        this.dataUpdatedEvent.next(true);
      });
    });

  }


}
