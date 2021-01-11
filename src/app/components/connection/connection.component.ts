import { Component, OnInit } from '@angular/core';
import { Connection } from 'dist/sitmun-frontend-core/connection/connection.model';
import { ConnectionService } from 'dist/sitmun-frontend-core/';
import { UtilsService } from '../../services/utils.service';

import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.scss']
})
export class ConnectionComponent implements OnInit {

  dataUpdatedEvent: Subject<boolean> = new Subject <boolean>();
  themeGrid: any = environment.agGridTheme;
  columnDefs: any[];

  constructor(public connectionService: ConnectionService,
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
        width: 48,
        lockPosition: true,
        cellRenderer: 'btnEditRendererComponent',
        cellRendererParams: {
          clicked: this.newData.bind(this)
        },
      },
      { headerName: 'Id', field: 'id', editable: false },
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
    this.router.navigate(['connection', id, 'connectionForm']);
  }

  applyChanges(data: Connection[]) {
    const promises: Promise<any>[] = [];
    data.forEach(connection => {
      promises.push(new Promise((resolve, reject) => {​​​​​​​ this.connectionService.update(connection).toPromise().then((resp) =>{​​​​​​​resolve()}​​​​​​​)}​​​​​​​));
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
      promises.push(new Promise((resolve, reject) => {​​​​​​​ this.connectionService.create(connection).toPromise().then((resp) =>{​​​​​​​resolve()}​​​​​​​)}​​​​​​​));
      Promise.all(promises).then(() => {
        this.dataUpdatedEvent.next(true);
      });
    });

  }

  removeData(data: Connection[]) {
    const promises: Promise<any>[] = [];
    data.forEach(connection => {
      promises.push(new Promise((resolve, reject) => {​​​​​​​ this.connectionService.delete(connection).toPromise().then((resp) =>{​​​​​​​resolve()}​​​​​​​)}​​​​​​​));
      Promise.all(promises).then(() => {
        this.dataUpdatedEvent.next(true);
      });
    });

  }

}
