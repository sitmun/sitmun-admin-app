import {Component, OnInit} from '@angular/core';
import {ServiceService, Service} from '@app/frontend-core/src/lib/public_api';
import {UtilsService} from '@app/services/utils.service';
import {Router} from '@angular/router';
import {config} from '@config';
import {Observable, Subject} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {DialogMessageComponent} from '@app/frontend-gui/src/lib/public_api';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss']
})
export class ServiceComponent implements OnInit {
  saveAgGridStateEvent: Subject<boolean> = new Subject<boolean>();
  dataUpdatedEvent: Subject<boolean> = new Subject<boolean>();
  themeGrid: any = config.agGridTheme;
  columnDefs: any[];
  gridModified = false;

  constructor(public dialog: MatDialog,
              public serviceService: ServiceService,
              private utils: UtilsService,
              private router: Router,
  ) {

  }

  ngOnInit() {

    const columnEditBtn = this.utils.getEditBtnColumnDef();
    columnEditBtn['cellRendererParams'] = {
      clicked: this.newData.bind(this)
    };

    this.columnDefs = [
      columnEditBtn,
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getIdColumnDef(),
      this.utils.getEditableColumnDef('serviceEntity.name', 'name', 300),
      this.utils.getNonEditableColumnDef('serviceEntity.type', 'type', 120, 120),
      this.utils.getNonEditableColumnDef('serviceEntity.serviceURL', 'serviceURL'),
    ];
  }

  async canDeactivate(): Promise<boolean | Observable<boolean>> {

    if (this.gridModified) {


      const result = await this.utils.showNavigationOutDialog().toPromise();
      if (!result || result.event !== 'Accept') {
        return false;
      } else if (result.event === 'Accept') {
        return true;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }

  setGridModifiedValue(value) {
    this.gridModified = value;
  }

  getAllConnections = () => {

    return this.serviceService.getAll();
  };

  newData(id: any) {
    this.saveAgGridStateEvent.next(true);
    this.router.navigate(['service', id, 'serviceForm']);
  }

  applyChanges(data: Service[]) {
    const promises: Promise<any>[] = [];
    data.forEach(service => {
      promises.push(new Promise((resolve,) => {
        this.serviceService.update(service).subscribe(() => {
          resolve(true);
        });
      }))
      ;
      Promise.all(promises).then(() => {
        this.dataUpdatedEvent.next(true);
      });
    });
  }

  add(data: Service[]) {
    this.router.navigate(['service', -1, 'serviceForm', data[0].id]);
  }

  removeData(data: Service[]) {


    const dialogRef = this.dialog.open(DialogMessageComponent);
    dialogRef.componentInstance.title = this.utils.getTranslate('caution');
    dialogRef.componentInstance.message = this.utils.getTranslate('removeMessage');
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.event === 'Accept') {
          const promises: Promise<any>[] = [];
          data.forEach(service => {
            promises.push(new Promise((resolve, ) => {
              this.serviceService.delete(service).subscribe(() => {
                resolve(true);
              });
            }))
            ;
            Promise.all(promises).then(() => {
              this.dataUpdatedEvent.next(true);
            });
          });
        }
      }
    });


  }


}
