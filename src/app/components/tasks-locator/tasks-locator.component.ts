import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../../services/utils.service';
import { Router } from '@angular/router';
import { Observable,Subject } from 'rxjs';
import { config } from 'src/config';
import { TaskService, Task, HalOptions, HalParam } from '../../frontend-core/src/lib/public_api';
import { MatDialog } from '@angular/material/dialog';
import { DialogMessageComponent } from '../../frontend-gui/src/lib/public_api';

@Component({
  selector: 'app-tasks-locator',
  templateUrl: './tasks-locator.component.html',
  styleUrls: ['./tasks-locator.component.scss']
})
export class TasksLocatorComponent implements OnInit {

  dataUpdatedEvent: Subject<boolean> = new Subject <boolean>();
  saveAgGridStateEvent: Subject<boolean> = new Subject<boolean>();
  themeGrid:any=config.agGridTheme;
  columnDefs: any[];
  gridModified = false;

  constructor(private utils: UtilsService,
              private router: Router,
              public taskService: TaskService,
              public dialog: MatDialog,
              )
              { }


  ngOnInit()  {

    var columnEditBtn=this.utils.getEditBtnColumnDef();
    columnEditBtn['cellRendererParams']= {
      clicked: this.newData.bind(this)
    }


    this.columnDefs = [

      this.utils.getSelCheckboxColumnDef(),
      columnEditBtn,
      this.utils.getIdColumnDef(),
      this.utils.getEditableColumnDef('tasksLocatorEntity.task', 'name'),
      this.utils.getNonEditableColumnDef('tasksLocatorEntity.informationType', 'groupName'),
      this.utils.getNonEditableColumnDef('tasksLocatorEntity.accesType', 'properties.scope'),
      this.utils.getNonEditableColumnDef('tasksLocatorEntity.command', 'properties.command'),
      this.utils.getNonEditableColumnDef('tasksLocatorEntity.connection', 'connection'),
      this.utils.getNonEditableColumnDef('tasksLocatorEntity.associatedLayer', 'cartographyName'),

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
  

  getAllTasksLocator = () => {
    let taskTypeID=config.tasksTypes['locator'];
    let params2:HalParam[]=[];
    let param:HalParam={key:'type.id', value:taskTypeID}
    params2.push(param);
    let query:HalOptions={ params:params2};
    return this.taskService.getAll(query,undefined,"tasks");
  }

  removeData(data: []) {

    const dialogRef = this.dialog.open(DialogMessageComponent);
    dialogRef.componentInstance.title=this.utils.getTranslate("caution");
    dialogRef.componentInstance.message=this.utils.getTranslate("removeMessage");
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        if(result.event==='Accept') {  
          const promises: Promise<any>[] = [];
          data.forEach(task => {
            promises.push(new Promise((resolve, reject) => {​​​​​​​ this.taskService.delete(task).subscribe((resp) =>{​​​​​​​resolve(true)}​​​​​​​)}​​​​​​​));
            Promise.all(promises).then(() => {
              this.dataUpdatedEvent.next(true);
            });
          });
       }
      }
    });

  }
  
  newData(id: any)
  {
    this.saveAgGridStateEvent.next(true);
    this.router.navigate(["taskForm", id, config.tasksTypesNames.locator]);

  }
  
  applyChanges(data: Task[]) {
    const promises: Promise<any>[] = [];
    data.forEach(task => {
      promises.push(new Promise((resolve, reject) => {​​​​​​​ this.taskService.update(task).subscribe((resp) =>{​​​​​​​resolve(true)}​​​​​​​)}​​​​​​​));
      Promise.all(promises).then(() => {
        this.dataUpdatedEvent.next(true);
      });
    });
  }

}
 