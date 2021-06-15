import { Component, OnInit } from '@angular/core';
import { ConnectionService, Connection } from 'dist/sitmun-frontend-core/';
import { UtilsService } from '../../services/utils.service';

import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { config } from 'src/config';
import { Observable, Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogMessageComponent } from 'dist/sitmun-frontend-gui/';

@Component({
  selector: 'app-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.scss']
})
export class ConnectionComponent implements OnInit {

  dataUpdatedEvent: Subject<boolean> = new Subject<boolean>();
  saveAgGridStateEvent: Subject<boolean> = new Subject<boolean>();
  themeGrid: any = config.agGridTheme;
  columnDefs: any[];
  gridModified = false;

  constructor(public dialog: MatDialog,
    public connectionService: ConnectionService,
    private utils: UtilsService,
    private router: Router,
  ) {

  }

  ngOnInit() {

    var columnEditBtn = this.utils.getEditBtnColumnDef();
    columnEditBtn['cellRendererParams'] = {
      clicked: this.newData.bind(this)
    }


    this.columnDefs = [
      this.utils.getSelCheckboxColumnDef(),
      columnEditBtn,
      this.utils.getIdColumnDef(),
      this.utils.getEditableColumnDef('connectionEntity.name', 'name'),
      //this.utils.getEditableColumnDef('connectionEntity.user','user'),
      this.utils.getEditableColumnDef('connectionEntity.driver', 'driver'),
      this.utils.getEditableColumnDef('connectionEntity.connection', 'url'),
    ];
  }

  async canDeactivate(): Promise<boolean | Observable<boolean>> {

    if (this.gridModified) {


      let result = await this.utils.showNavigationOutDialog().toPromise();
      if(!result || result.event!=='Accept') { return false }
      else if(result.event ==='Accept') {return true;}
      else{
        return true;
      }
    }
    else return true
  }	

  setGridModifiedValue(value){
    this.gridModified=value;
  }
  
  getAllConnections = () => {
    return this.connectionService.getAll();
  }



  newData(id: any) {
    this.saveAgGridStateEvent.next(true);
    this.router.navigate(['connection', id, 'connectionForm']);
  }

  applyChanges(data: Connection[]) {
    const promises: Promise<any>[] = [];
    data.forEach(connection => {
      promises.push(new Promise((resolve, reject) => { this.connectionService.update(connection).subscribe((resp) => { resolve(true) }) }));
      Promise.all(promises).then(() => {
        this.dataUpdatedEvent.next(true);
      });
    });
  }

  add(data: Connection[]) {
    this.router.navigate(['connection', -1, 'connectionForm', data[0].id]);
    // console.log(data);
    // const promises: Promise<any>[] = [];
    // data.forEach(connection => {
    //   connection.id = null;
    //   connection.name = this.utils.getTranslate('copy_').concat(connection.name)
    //   promises.push(new Promise((resolve, reject) => { this.connectionService.create(connection).subscribe((resp) => { resolve(true) }) }));
    //   Promise.all(promises).then(() => {
    //     this.dataUpdatedEvent.next(true);
    //   });
    // });

  }

  removeData(data: Connection[]) {

    const dialogRef = this.dialog.open(DialogMessageComponent);
    dialogRef.componentInstance.title = this.utils.getTranslate("caution");
    dialogRef.componentInstance.message = this.utils.getTranslate("removeMessage");
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.event === 'Accept') {
          const promises: Promise<any>[] = [];
          data.forEach(connection => {
            promises.push(new Promise((resolve, reject) => { this.connectionService.remove(connection).subscribe((resp) => { resolve(true) }) }));
            Promise.all(promises).then(() => {
              this.dataUpdatedEvent.next(true);
            });
          });
        }
      }
    });
  }

}
