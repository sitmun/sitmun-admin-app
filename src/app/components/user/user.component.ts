import { Component, OnInit } from '@angular/core';
import { UserService,User } from '@sitmun/frontend-core';
import { UtilsService } from '../../services/utils.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogMessageComponent } from 'dist/sitmun-frontend-gui/';
 

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  dataUpdatedEvent: Subject<boolean> = new Subject<boolean>();
  themeGrid: any = environment.agGridTheme;
  columnDefs: any[];

  constructor(public dialog: MatDialog,
    public userService: UserService,
    private utils: UtilsService,
    private router: Router
  ) {

  }


  ngOnInit() {
    // this.headerNameColumnUser = await this.translate.get('user').toPromise();
    // this.headerNameColumnFirstName = await this.translate.get('firstname').toPromise();
    // this.headerNameColumnLastName = await this.translate.get('lastname').toPromise();
    // this.headerNameColumnStatus = await this.translate.get('status').toPromise();

    var columnEditBtn=environment.editBtnColumnDef;
    columnEditBtn['cellRendererParams']= {
      clicked: this.newData.bind(this)
    }

    this.columnDefs = [
      environment.selCheckboxColumnDef,
      columnEditBtn,
      { headerName: 'Id', field: 'id', editable: false },
      { headerName: this.utils.getTranslate('userEntity.user'), field: 'username' },
      { headerName: this.utils.getTranslate('userEntity.firstname'), field: 'firstName' },
      { headerName: this.utils.getTranslate('userEntity.lastname'), field: 'lastName' },
      {
        headerName: this.utils.getTranslate('userEntity.administrator'), field: 'administrator', editable: false,
        cellRenderer: 'btnCheckboxRendererComponent', floatingFilterComponent: 'btnCheckboxFilterComponent',
        floatingFilterComponentParams: { suppressFilterButton: true },
      },
      {
       headerName: this.utils.getTranslate('userEntity.blocked'), field: 'blocked', editable: false,
        cellRenderer: 'btnCheckboxRendererComponent', floatingFilterComponent: 'btnCheckboxFilterComponent',
        floatingFilterComponentParams: { suppressFilterButton: true },
      },
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
      promises.push(new Promise((resolve, reject) => { this.userService.update(user).toPromise().then((resp) => { resolve() }) }));
      Promise.all(promises).then(() => {
        this.dataUpdatedEvent.next(true);
      });
    });
  }
  add(data: User[]) {
    const promises: Promise<any>[] = [];
    data.forEach(user => {
      user.id = null;
      promises.push(new Promise((resolve, reject) => { this.userService.create(user).toPromise().then((resp) => { resolve() }) }));
      Promise.all(promises).then(() => {
        this.dataUpdatedEvent.next(true);
      });
    });

  }

  removeData(data: User[]) {

    const dialogRef = this.dialog.open(DialogMessageComponent);
    dialogRef.componentInstance.title=this.utils.getTranslate("caution");
    dialogRef.componentInstance.message=this.utils.getTranslate("removeMessage");
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        if(result.event==='Accept') {  
          const promises: Promise<any>[] = [];
          data.forEach(user => {
            promises.push(new Promise((resolve, reject) => {​​​​​​​ this.userService.delete(user).toPromise().then((resp) =>{​​​​​​​resolve()}​​​​​​​)}​​​​​​​));
            Promise.all(promises).then(() => {
              this.dataUpdatedEvent.next(true);
            });
          });
       }
      }
    });



  }


}
