import {Component, OnInit} from '@angular/core';
import {UserService, User} from '../../frontend-core/src/lib/public_api';
import {UtilsService} from '../../services/utils.service';
import {Router} from '@angular/router';
import {config} from 'src/config';
import {Observable, Subject} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {DialogMessageComponent} from '../../frontend-gui/src/lib/public_api';
import {constants} from '../../../environments/constants';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styles: []
})
export class UserComponent implements OnInit {
  saveAgGridStateEvent: Subject<boolean> = new Subject<boolean>();
  dataUpdatedEvent: Subject<boolean> = new Subject<boolean>();
  themeGrid: any = config.agGridTheme;
  columnDefs: any[];
  gridModified = false;

  constructor(public dialog: MatDialog,
              public userService: UserService,
              private utils: UtilsService,
              private router: Router
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
      this.utils.getNonEditableColumnDef('userEntity.user', 'username'),
      this.utils.getNonEditableColumnDef('userEntity.firstname', 'firstName'),
      this.utils.getNonEditableColumnDef('userEntity.lastname', 'lastName'),
    ];
  }

  getAllUsers = () => {

    return this.userService.getAll();
  };

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

  setGridModifiedValue(value: boolean) {
    this.gridModified = value;
  }

  newData(id: any) {
    this.saveAgGridStateEvent.next(true);
    this.router.navigate(['user', id, 'userForm']);
  }

  applyChanges(data: User[]) {
    const promises: Promise<any>[] = [];
    data.forEach(user => {
      if(!this.isPublic(user)) {
        promises.push(new Promise((resolve,) => {
          this.userService.update(user).subscribe(() => {
            resolve(true);
          });
        }));
      }
    });
    Promise.all(promises).then(() => {
      this.dataUpdatedEvent.next(true);
    });
  }

  add(data: User[]) {
    if (data.length > 0 && !this.isPublic(data[0])) {
      this.router.navigate(['user', -1, 'userForm', data[0].id]);
    }
  }

  removeData(data: User[]) {

    const dialogRef = this.dialog.open(DialogMessageComponent);
    dialogRef.componentInstance.title = this.utils.getTranslate('caution');
    dialogRef.componentInstance.message = this.utils.getTranslate('removeMessage');
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.event === 'Accept') {
          const promises: Promise<any>[] = [];
          data.forEach(user => {
            if (!this.isPublic(user)) {
              promises.push(new Promise((resolve, ) => {
                this.userService.delete(user).subscribe(() => {
                  resolve(true);
                });
              }));
            }
          });
          Promise.all(promises).then(() => {
            this.dataUpdatedEvent.next(true);
          });
        }
      }
    });


  }


  private isPublic(user: User) : boolean {
    return user.username === constants.codeValue.systemUser.public
  }
}
