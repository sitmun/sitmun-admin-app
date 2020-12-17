import { Component, OnInit } from '@angular/core';
import { User } from 'dist/sitmun-frontend-core/user/user.model';
import { UserService } from 'dist/sitmun-frontend-core/';
import { UtilsService } from '../../services/utils.service';
import { BtnEditRenderedComponent } from 'dist/sitmun-frontend-gui/';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
 

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  dataUpdatedEvent: Subject<boolean> = new Subject <boolean>();
  themeGrid: any = environment.agGridTheme;
  columnDefs: any[];
  public frameworkComponents = {
    btnEditRendererComponent: BtnEditRenderedComponent
  };

  constructor(public userService: UserService,
    private utils: UtilsService,
    private router: Router
  ) {

  }


  ngOnInit() {
    // this.headerNameColumnUser = await this.translate.get('user').toPromise();
    // this.headerNameColumnFirstName = await this.translate.get('firstname').toPromise();
    // this.headerNameColumnLastName = await this.translate.get('lastname').toPromise();
    // this.headerNameColumnStatus = await this.translate.get('status').toPromise();

    this.columnDefs = [
      {
        headerName: '',
        checkboxSelection: true,
        headerCheckboxSelection: true,
        editable: false,
        filter: false,
        width:  40,
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
      { headerName: this.utils.getTranslate('userEntity.user'), field: 'username' },
      { headerName: this.utils.getTranslate('userEntity.firstname'), field: 'firstName' },
      { headerName: this.utils.getTranslate('userEntity.lastname'), field: 'lastName' },
      { headerName: this.utils.getTranslate('userEntity.administrator'), field: 'administrator' },
      { headerName: this.utils.getTranslate('userEntity.blocked'), field: 'blocked' },
      // { headerName: this.utils.getTranslate('status'), field: 'estat'},
    ];
  }

  getAllUsers = () => {

    return this.userService.getAll();
  }

  newData(id: any) {
    this.router.navigate(['user', id, 'userForm']);
  }

  applyChanges(data: User[]) {
    const promises: Promise<any>[] = [];
    data.forEach(user => {
      promises.push(new Promise((resolve, reject) => {​​​​​​​ this.userService.update(user).toPromise().then((resp) =>{​​​​​​​resolve()}​​​​​​​)}​​​​​​​));
      Promise.all(promises).then(() => {
        this.dataUpdatedEvent.next(true);
      });
    });
  }
  add(data: User[]) {
    const promises: Promise<any>[] = [];
    data.forEach(user => {
      user.id = null;
      promises.push(new Promise((resolve, reject) => {​​​​​​​ this.userService.create(user).toPromise().then((resp) =>{​​​​​​​resolve()}​​​​​​​)}​​​​​​​));
      Promise.all(promises).then(() => {
        this.dataUpdatedEvent.next(true);
      });
    });

  }

  removeData(data: User[]) {
    const promises: Promise<any>[] = [];
    data.forEach(user => {
      promises.push(new Promise((resolve, reject) => {​​​​​​​ this.userService.delete(user).toPromise().then((resp) =>{​​​​​​​resolve()}​​​​​​​)}​​​​​​​));
      Promise.all(promises).then(() => {
        this.dataUpdatedEvent.next(true);
      });
    });

  }


}
