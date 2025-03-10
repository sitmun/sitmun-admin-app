import {Component, OnInit} from '@angular/core';
import {TaskGroupService, TaskGroup} from '@app/frontend-core/src/lib/public_api';
import {UtilsService} from '@app/services/utils.service';
import {Router} from '@angular/router';
import {config} from '@config';
import {Observable, Subject} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {DialogMessageComponent} from '@app/frontend-gui/src/lib/public_api';

@Component({
  selector: 'app-task-group',
  templateUrl: './task-group.component.html',
  styles: []
})
export class TaskGroupComponent implements OnInit {
  saveAgGridStateEvent: Subject<boolean> = new Subject<boolean>();
  dataUpdatedEvent: Subject<boolean> = new Subject<boolean>();
  themeGrid: any = config.agGridTheme;
  columnDefs: any[];
  gridModified = false;

  constructor(public dialog: MatDialog,
              public taskGroupService: TaskGroupService,
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
      this.utils.getEditableColumnDef('taskGroupEntity.name', 'name'),
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


  getAllTaskGroups = () => {

    return this.taskGroupService.getAll();
  };

  newData(id: any) {
    this.saveAgGridStateEvent.next(true);
    this.router.navigate(['taskGroup', id, 'taskGroupForm']);
  }

  applyChanges(data: TaskGroup[]) {
    const promises: Promise<any>[] = [];
    data.forEach(taskGroup => {
      promises.push(new Promise((resolve, ) => {
        this.taskGroupService.update(taskGroup).subscribe(() => {
          resolve(true);
        });
      }))
      ;
      Promise.all(promises).then(() => {
        this.dataUpdatedEvent.next(true);
      });
    });
  }

  add(data: TaskGroup[]) {
    this.router.navigate(['taskGroup', -1, 'taskGroupForm', data[0].id]);
  }

  removeData(data: TaskGroup[]) {

    const dialogRef = this.dialog.open(DialogMessageComponent);
    dialogRef.componentInstance.title = this.utils.getTranslate('caution');
    dialogRef.componentInstance.message = this.utils.getTranslate('removeMessage');
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.event === 'Accept') {
          const promises: Promise<any>[] = [];
          data.forEach(taskGroup => {
            promises.push(new Promise((resolve, ) => {
              this.taskGroupService.delete(taskGroup).subscribe(() => {
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

