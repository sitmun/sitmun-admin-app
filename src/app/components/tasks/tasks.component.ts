import { Component, OnInit } from '@angular/core';
import { TaskService, Task, TaskGroupService, HalParam, HalOptions } from '../../frontend-core/src/lib/public_api';
import { UtilsService } from '../../services/utils.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { config } from 'src/config';
import { Observable, Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogMessageComponent } from '../../frontend-gui/src/lib/public_api';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {
  saveAgGridStateEvent: Subject<boolean> = new Subject<boolean>();
  dataUpdatedEvent: Subject<boolean> = new Subject <boolean>();
  themeGrid: any = config.agGridTheme;
  columnDefs: any[];
  gridModified = false;
  
  constructor(public dialog: MatDialog,
    public tasksService: TaskService,
    public taskGroupService: TaskGroupService,
    private utils: UtilsService,
    private router: Router,
  ) { }


  ngOnInit() {

    var columnEditBtn=this.utils.getEditBtnColumnDef();
    columnEditBtn['cellRendererParams']= {
      clicked: this.newData.bind(this)
    }


    this.columnDefs = [
      this.utils.getSelCheckboxColumnDef(),
      columnEditBtn,
      this.utils.getIdColumnDef(),
      this.utils.getEditableColumnDef('tasksEntity.task', 'name'),
      this.utils.getNonEditableColumnDef('tasksEntity.groupTask', 'groupName'),

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

  getAllTasks = () => {
    let taskTypeID=config.tasksTypes['basic'];
    let params2:HalParam[]=[];
    let param:HalParam={key:'type.id', value:taskTypeID}
    params2.push(param);
    let query:HalOptions={ params:params2};
    return this.tasksService.getAll(query,undefined,"tasks");

  };

  newData(id: any) {
    this.saveAgGridStateEvent.next(true);
    this.router.navigate(["taskForm", id, config.tasksTypesNames.basic]);
  }

  applyChanges(data: Task[]) {
    const promises: Promise<any>[] = [];
    data.forEach(task => {
      promises.push(new Promise((resolve, reject) => {​​​​​​​ this.tasksService.update(task).subscribe((resp) =>{​​​​​​​resolve(true)}​​​​​​​)}​​​​​​​));
      Promise.all(promises).then(() => {
        this.dataUpdatedEvent.next(true);
      });
    });
  }

  add(data: Task[]) {
    const promises: Promise<any>[] = [];
    data.forEach(task => {
      let newTask: any = task;
      newTask.id = null;
      newTask.name = this.utils.getTranslate('copy_').concat(newTask.name)
      this.taskGroupService.get(newTask.groupId).subscribe(
        result => {
          newTask.group=result;
          newTask._links= null;
          console.log(newTask)
          promises.push(new Promise((resolve, reject) => {​​​​​​​ this.tasksService.create(newTask).subscribe((resp) =>{​​​​​​​resolve(true)}​​​​​​​)}​​​​​​​));
          Promise.all(promises).then(() => {
            this.dataUpdatedEvent.next(true);
          });
        },
        error => {
          console.log(error)
        }
      )

    });

  }

  removeData(data: Task[]) {

    const dialogRef = this.dialog.open(DialogMessageComponent);
    dialogRef.componentInstance.title=this.utils.getTranslate("caution");
    dialogRef.componentInstance.message=this.utils.getTranslate("removeMessage");
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        if(result.event==='Accept') {  
          const promises: Promise<any>[] = [];
          data.forEach(task => {
            promises.push(new Promise((resolve, reject) => {​​​​​​​ this.tasksService.delete(task).subscribe((resp) =>{​​​​​​​resolve(true)}​​​​​​​)}​​​​​​​));
            Promise.all(promises).then(() => {
              this.dataUpdatedEvent.next(true);
            });
          });
       }
      }
    });

  }

}
