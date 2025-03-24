import {Component, OnInit} from '@angular/core';
import {ConnectionService, Connection} from '@app/domain';
import {UtilsService} from '@app/services/utils.service';

import {Router} from '@angular/router';
import {config} from '@config';
import {Observable, Subject} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {DialogMessageComponent} from '@app/frontend-gui/src/lib/public_api';

@Component({
  selector: 'app-connection',
  templateUrl: './connection.component.html',
  styles: []
})
export class ConnectionComponent implements OnInit {

  dataUpdatedEvent: Subject<boolean> = new Subject<boolean>();
  saveAgGridStateEvent: Subject<boolean> = new Subject<boolean>();
  themeGrid: any = config.agGridTheme;
  columnDefs: any[];
  driversList = [];
  driversListDescription = [];
  gridModified = false;
  loaded = false;

  constructor(public dialog: MatDialog,
              public connectionService: ConnectionService,
              private utils: UtilsService,
              private router: Router,
  ) {

  }

  async ngOnInit() {

    const drivers = await this.utils.getCodeListValues('databaseConnection.driver').toPromise();
    drivers.forEach(element => {
      this.driversList.push(element);
      this.driversListDescription.push(element.description);
    });

    const columnEditBtn = this.utils.getEditBtnColumnDef();
    columnEditBtn['cellRendererParams'] = {
      clicked: this.newData.bind(this)
    };
    this.columnDefs = [
      columnEditBtn,
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getIdColumnDef(),
      this.utils.getEditableColumnDef('connectionEntity.name', 'name'),
      this.utils.getSelectColumnDef('connectionEntity.driver', 'driver', true, this.driversListDescription, true, this.driversList),
      this.utils.getEditableColumnDef('connectionEntity.connection', 'url'),
    ];

    this.loaded = true;
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
    return this.connectionService.getAll();
  };


  newData(id: any) {
    this.saveAgGridStateEvent.next(true);
    this.router.navigate(['connection', id, 'connectionForm']);
  }

  applyChanges(data: Connection[]) {
    const promises: Promise<any>[] = [];
    data.forEach(connection => {
      promises.push(new Promise((resolve, ) => {
        this.connectionService.update(connection).subscribe(() => {
          resolve(true);
        });
      }));
      Promise.all(promises).then(() => {
        this.dataUpdatedEvent.next(true);
      });
    });
  }

  add(data: Connection[]) {
    this.router.navigate(['connection', -1, 'connectionForm', data[0].id]);
  }

  removeData(data: Connection[]) {

    const dialogRef = this.dialog.open(DialogMessageComponent);
    dialogRef.componentInstance.title = this.utils.getTranslate('caution');
    dialogRef.componentInstance.message = this.utils.getTranslate('removeMessage');
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.event === 'Accept') {
          const promises: Promise<any>[] = [];
          data.forEach(connection => {
            promises.push(new Promise((resolve,) => {
              this.connectionService.delete(connection).subscribe(() => {
                resolve(true);
              });
            }));
            Promise.all(promises).then(() => {
              this.dataUpdatedEvent.next(true);
            });
          });
        }
      }
    });
  }

}
