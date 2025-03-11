import {Component, OnInit} from '@angular/core';
import {TaskService, Task, TaskGroupService, HalParam, HalOptions} from '@app/domain';
import {UtilsService} from '@app/services/utils.service';
import {Router} from '@angular/router';
import {config} from '@config';
import {Observable, Subject} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {DialogMessageComponent} from '@app/frontend-gui/src/lib/public_api';
import { LoggerService } from '@app/services/logger.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styles: []
})
export class TasksComponent implements OnInit {
  saveAgGridStateEvent: Subject<boolean> = new Subject<boolean>();
  dataUpdatedEvent: Subject<boolean> = new Subject<boolean>();
  themeGrid: any = config.agGridTheme;
  columnDefs: any[];
  gridModified = false;

  constructor(public dialog: MatDialog,
              public tasksService: TaskService,
              public taskGroupService: TaskGroupService,
              private utils: UtilsService,
              private router: Router,
              private loggerService: LoggerService
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
      this.utils.getEditableColumnDef('tasksEntity.task', 'name'),
      this.utils.getNonEditableColumnDef('tasksEntity.groupTask', 'groupName'),

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

  getAllTasks = () => {
    const taskTypeID = config.tasksTypes['basic'];
    const params2: HalParam[] = [];
    const param: HalParam = {key: 'type.id', value: taskTypeID};
    params2.push(param);
    const query: HalOptions = {params: params2};
    return this.tasksService.getAll(query, undefined, 'tasks');

  };

  newData(id: any) {
    this.saveAgGridStateEvent.next(true);
    this.router.navigate(['taskForm', id, config.tasksTypesNames.basic]);
  }

  applyChanges(data: Task[]) {
    const promises: Promise<any>[] = [];
    data.forEach(task => {
      promises.push(new Promise((resolve,) => {
        this.tasksService.update(task).subscribe(() => {
          resolve(true);
        });
      }));
      Promise.all(promises).then(() => {
        this.dataUpdatedEvent.next(true);
      });
    });
  }

  add(data: Task[]) {
    const promises: Promise<any>[] = [];
    data.forEach(task => {
      const newTask: any = task;
      newTask.id = null;
      newTask.name = this.utils.getTranslate('copy_').concat(newTask.name);
      this.taskGroupService.get(newTask.groupId).subscribe(
        result => {
          newTask.group = result;
          newTask._links = null;

          promises.push(new Promise((resolve,) => {
            this.tasksService.create(newTask).subscribe(() => {
              resolve(true);
            });
          }));
          Promise.all(promises).then(() => {
            this.dataUpdatedEvent.next(true);
          });
        },
        error => {
          this.loggerService.error('Error adding task group', error);
        }
      );

    });

  }

  removeData(data: Task[]) {

    const dialogRef = this.dialog.open(DialogMessageComponent);
    dialogRef.componentInstance.title = this.utils.getTranslate('caution');
    dialogRef.componentInstance.message = this.utils.getTranslate('removeMessage');
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.event === 'Accept') {
          const promises: Promise<any>[] = [];
          data.forEach(task => {
            promises.push(new Promise((resolve, ) => {
              this.tasksService.delete(task).subscribe(() => {
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
