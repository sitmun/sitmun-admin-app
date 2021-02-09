import { Component, OnInit } from '@angular/core';
import { ConnectionService, Connection } from 'dist/sitmun-frontend-core/';
import { UtilsService } from '../../services/utils.service';

import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogMessageComponent } from 'dist/sitmun-frontend-gui/';

@Component({
  selector: 'app-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.scss']
})
export class ConnectionComponent implements OnInit {

  dataUpdatedEvent: Subject<boolean> = new Subject <boolean>();
  saveAgGridStateEvent: Subject<boolean> = new Subject<boolean>();
  themeGrid: any = environment.agGridTheme;
  columnDefs: any[];

  constructor(public dialog: MatDialog,
    public connectionService: ConnectionService,
    private utils: UtilsService,
    private router: Router,
  ) {

  }

  ngOnInit() {

    var columnEditBtn=environment.editBtnColumnDef;
    columnEditBtn['cellRendererParams']= {
      clicked: this.newData.bind(this)
    }


    this.columnDefs = [
      environment.selCheckboxColumnDef,
     columnEditBtn,
      { headerName: 'Id', field: 'id', editable: false},
      { headerName: this.utils.getTranslate('connectionEntity.name'), field: 'name' },
      { headerName: this.utils.getTranslate('connectionEntity.user'), field: 'user' },
      { headerName: this.utils.getTranslate('connectionEntity.driver'), field: 'driver' },
      { headerName: this.utils.getTranslate('connectionEntity.connection'), field: 'url' }
    ];
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
      promises.push(new Promise((resolve, reject) => {​​​​​​​ this.connectionService.update(connection).subscribe((resp) =>{​​​​​​​resolve(true)}​​​​​​​)}​​​​​​​));
      Promise.all(promises).then(() => {
        this.dataUpdatedEvent.next(true);
      });
    });
  }

  add(data: Connection[]) {
    console.log(data);
    const promises: Promise<any>[] = [];
    data.forEach(connection => {
      connection.id = null;
      connection.name = 'copia_'.concat(connection.name)
      promises.push(new Promise((resolve, reject) => {​​​​​​​ this.connectionService.create(connection).subscribe((resp) =>{​​​​​​​resolve(true)}​​​​​​​)}​​​​​​​));
      Promise.all(promises).then(() => {
        this.dataUpdatedEvent.next(true);
      });
    });

  }

  removeData(data: Connection[]) {

    const dialogRef = this.dialog.open(DialogMessageComponent);
    dialogRef.componentInstance.title=this.utils.getTranslate("caution");
    dialogRef.componentInstance.message=this.utils.getTranslate("removeMessage");
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        if(result.event==='Accept') {  
          const promises: Promise<any>[] = [];
          data.forEach(connection => {
            promises.push(new Promise((resolve, reject) => {​​​​​​​ this.connectionService.remove(connection).subscribe((resp) =>{​​​​​​​resolve(true)}​​​​​​​)}​​​​​​​));
            Promise.all(promises).then(() => {
              this.dataUpdatedEvent.next(true);
            });
          });
       }
      }
    });
  }

}
