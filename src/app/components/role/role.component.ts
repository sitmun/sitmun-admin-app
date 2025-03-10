import {Component, OnInit} from '@angular/core';
import {RoleService, Role} from '@app/frontend-core/src/lib/public_api';
import {UtilsService} from '@app/services/utils.service';
import {Router} from '@angular/router';
import {config} from '@config';
import {Observable, Subject} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {DialogMessageComponent} from '@app/frontend-gui/src/lib/public_api';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styles: []
})
export class RoleComponent implements OnInit {
  saveAgGridStateEvent: Subject<boolean> = new Subject<boolean>();
  dataUpdatedEvent: Subject<boolean> = new Subject<boolean>();
  themeGrid: any = config.agGridTheme;
  columnDefs: any[];
  gridModified = false;

  constructor(public dialog: MatDialog,
              public roleService: RoleService,
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
      this.utils.getEditableColumnDef('roleEntity.name', 'name'),
      this.utils.getEditableColumnDef('roleEntity.note', 'description'),
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

  setGridModifiedValue(value: boolean) {
    this.gridModified = value;
  }


  getAllRoles = () => {
    return this.roleService.getAll();
  };

  newData(id: any) {
    this.saveAgGridStateEvent.next(true);
    this.router.navigate(['role', id, 'roleForm']);
  }

  applyChanges(data: Role[]) {
    const promises: Promise<any>[] = [];
    data.forEach(role => {
      promises.push(new Promise((resolve, ) => {
        this.roleService.update(role).subscribe(() => {
          resolve(true);
        });
      }));
      Promise.all(promises).then(() => {
        this.dataUpdatedEvent.next(true);
      });
    });
  }

  add(data: Role[]) {
    this.router.navigate(['role', -1, 'roleForm', data[0].id]);
  }

  removeData(data: Role[]) {
    const dialogRef = this.dialog.open(DialogMessageComponent);
    dialogRef.componentInstance.title = this.utils.getTranslate('caution');
    dialogRef.componentInstance.message = this.utils.getTranslate('removeMessage');
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.event === 'Accept') {
          const promises: Promise<any>[] = [];
          data.forEach(role => {
            promises.push(new Promise((resolve, ) => { this.roleService.delete(role).subscribe(() => { resolve(true);
            })
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
