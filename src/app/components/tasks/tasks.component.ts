import { Component, OnInit } from '@angular/core';
import { TaskService, Task, TaskGroupService } from 'dist/sitmun-frontend-core/';
import { UtilsService } from '../../services/utils.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { config } from 'src/config';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogMessageComponent } from 'dist/sitmun-frontend-gui/';

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

  constructor(public dialog: MatDialog,
    public tasksService: TaskService,
    public taskGroupService: TaskGroupService,
    private utils: UtilsService,
    private router: Router,
  ) { }


  ngOnInit() {

    var columnEditBtn=config.editBtnColumnDef;
    columnEditBtn['cellRendererParams']= {
      clicked: this.newData.bind(this)
    }


    this.columnDefs = [
      config.selCheckboxColumnDef,
      columnEditBtn,
      { headerName: 'Id', field: 'id', editable: false },
      { headerName: this.utils.getTranslate('tasksEntity.task'), field: 'name' },
      { headerName: this.utils.getTranslate('tasksEntity.groupTask'), field: 'groupName', editable: false },
    ];
  }

  getAllTasks = () => {
    return this.tasksService.getAll(undefined,undefined,"tasks");

  };

  newData(id: any) {
    this.saveAgGridStateEvent.next(true);
    this.router.navigate(['tasks', id, 'tasksForm']);
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
      newTask.name = 'copia_'.concat(newTask.name)
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
