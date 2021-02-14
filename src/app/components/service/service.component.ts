import { Component, OnInit } from '@angular/core';
import { ServiceService, Service } from 'dist/sitmun-frontend-core/';
import { UtilsService } from '../../services/utils.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { config } from 'src/config';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogMessageComponent } from 'dist/sitmun-frontend-gui/';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss']
})
export class ServiceComponent implements OnInit {
  saveAgGridStateEvent: Subject<boolean> = new Subject<boolean>();
  dataUpdatedEvent: Subject<boolean> = new Subject <boolean>();
  themeGrid: any = config.agGridTheme;
  columnDefs: any[];

  constructor(public dialog: MatDialog,
    public serviceService: ServiceService,
    private utils: UtilsService,
    private router: Router,
  ) {

  }

  ngOnInit() {

    var columnEditBtn=config.editBtnColumnDef;
    columnEditBtn['cellRendererParams']= {
      clicked: this.newData.bind(this)
    }

    this.columnDefs = [
      config.selCheckboxColumnDef,
      columnEditBtn,
      { headerName: 'Id', field: 'id', editable: false },
      { headerName: this.utils.getTranslate('serviceEntity.name'), field: 'name' },
      { headerName: this.utils.getTranslate('serviceEntity.type'), field: 'type', editable: false },
      { headerName: this.utils.getTranslate('serviceEntity.serviceURL'), field: 'serviceURL' },
      { headerName: this.utils.getTranslate('serviceEntity.supportedSRS'), field: 'supportedSRS' },
      {
        headerName: this.utils.getTranslate('serviceEntity.createdDate'), field: 'createdDate',
        filter: 'agDateColumnFilter', filterParams: this.utils.getDateFilterParams(),
        editable: false, cellRenderer: (data) => { return this.utils.getDateFormated(data) }
      }// type: 'dateColumn'
    ];
  }

  getAllConnections = () => {

    return this.serviceService.getAll();
  }

  newData(id: any) {
    this.saveAgGridStateEvent.next(true);
    this.router.navigate(['service', id, 'serviceForm']);
  }

  applyChanges(data: Service[]) {
    const promises: Promise<any>[] = [];
    data.forEach(service => {
      promises.push(new Promise((resolve, reject) => {​​​​​​​ this.serviceService.update(service).subscribe((resp) =>{​​​​​​​resolve(true)}​​​​​​​)}​​​​​​​));
      Promise.all(promises).then(() => {
        this.dataUpdatedEvent.next(true);
      });
    });
  }
  
  add(data: Service[]) {
    const promises: Promise<any>[] = [];
    data.forEach(service => {
      service.id = null;
      service.createdDate = new Date();
      service.name = 'copia_'.concat(service.name)
      promises.push(new Promise((resolve, reject) => {​​​​​​​ this.serviceService.create(service).subscribe((resp) =>{​​​​​​​resolve(true)}​​​​​​​)}​​​​​​​));
      Promise.all(promises).then(() => {
        this.dataUpdatedEvent.next(true);
      });
    });

  }

  removeData(data: Service[]) {

    
    const dialogRef = this.dialog.open(DialogMessageComponent);
    dialogRef.componentInstance.title=this.utils.getTranslate("caution");
    dialogRef.componentInstance.message=this.utils.getTranslate("removeMessage");
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        if(result.event==='Accept') {  
          const promises: Promise<any>[] = [];
          data.forEach(service => {
            promises.push(new Promise((resolve, reject) => {​​​​​​​ this.serviceService.delete(service).subscribe((resp) =>{​​​​​​​resolve(true)}​​​​​​​)}​​​​​​​));
            Promise.all(promises).then(() => {
              this.dataUpdatedEvent.next(true);
            });
          });
       }
      }
    });



  }


}
