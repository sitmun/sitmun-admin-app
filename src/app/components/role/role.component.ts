import { Component, OnInit } from '@angular/core';
import { Role } from 'dist/sitmun-frontend-core/role/role.model';
import { RoleService } from 'dist/sitmun-frontend-core/';
import { UtilsService } from '../../services/utils.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {

  dataUpdatedEvent: Subject<boolean> = new Subject <boolean>();
  themeGrid: any = environment.agGridTheme;
  columnDefs: any[];

  constructor(public roleService: RoleService,
    private utils: UtilsService,
    private router: Router,
  ) { }


  ngOnInit() {

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
        width: 21,
        lockPosition: true,
        cellRenderer: 'btnEditRendererComponent',
        cellRendererParams: {
          clicked: this.newData.bind(this)
        },
      },
      { headerName: 'Id', field: 'id', editable: false },
      { headerName: this.utils.getTranslate('roleEntity.name'), field: 'name' },
      { headerName: this.utils.getTranslate('roleEntity.note'), field: 'description' },
      // { headerName: this.utils.getTranslate('application'),  field: 'application' },
    ];
  }

  getAllRoles = () => {
    return this.roleService.getAll();
  };

  newData(id: any) {
    this.router.navigate(['role', id, 'roleForm']);
  }

  applyChanges(data: Role[]) {
    const promises: Promise<any>[] = [];
    data.forEach(role => {
      promises.push(new Promise((resolve, reject) => {​​​​​​​ this.roleService.update(role).toPromise().then((resp) =>{​​​​​​​resolve()}​​​​​​​)}​​​​​​​));
      Promise.all(promises).then(() => {
        this.dataUpdatedEvent.next(true);
      });
    });
  }

  add(data: Role[]) {
    const promises: Promise<any>[] = [];
    data.forEach(role => {
      role.id = null;
      promises.push(new Promise((resolve, reject) => {​​​​​​​ this.roleService.create(role).toPromise().then((resp) =>{​​​​​​​resolve()}​​​​​​​)}​​​​​​​));
      Promise.all(promises).then(() => {
        this.dataUpdatedEvent.next(true);
      });
    });

  }

  removeData(data: Role[]) {
    const promises: Promise<any>[] = [];
    data.forEach(role => {
      promises.push(new Promise((resolve, reject) => {​​​​​​​ this.roleService.delete(role).toPromise().then((resp) =>{​​​​​​​resolve()}​​​​​​​)}​​​​​​​));
      Promise.all(promises).then(() => {
        this.dataUpdatedEvent.next(true);
      });
    });

  }

}
