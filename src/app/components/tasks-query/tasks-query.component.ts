import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../../services/utils.service';
import { Router } from '@angular/router';
import { Observable, of,Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { config } from 'src/config';
import { HalOptions, HalParam, TaskService } from 'dist/sitmun-frontend-core/';

@Component({
  selector: 'app-tasks-query',
  templateUrl: './tasks-query.component.html',
  styleUrls: ['./tasks-query.component.scss']
})
export class TasksQueryComponent implements OnInit {
  saveAgGridStateEvent: Subject<boolean> = new Subject<boolean>();
  themeGrid:any=config.agGridTheme;
  columnDefs: any[];
  gridModified = false;

  constructor(private utils: UtilsService,
              private router: Router,
              public taskService: TaskService
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
      this.utils.getEditableColumnDef('tasksQueryEntity.task', 'name'),
      this.utils.getNonEditableColumnDef('tasksQueryEntity.informationType', 'groupName'),
      this.utils.getEditableColumnDef('tasksQueryEntity.accessType', 'accesType'),


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
  

  getAllTasksQuery = () => {
    let taskTypeID=config.tasksTypes['query'];
    let params2:HalParam[]=[];
    let param:HalParam={key:'type.id', value:taskTypeID}
    params2.push(param);
    let query:HalOptions={ params:params2};
    return this.taskService.getAll(query,undefined,"tasks");
  }

  removeData( data: any[])
  {
    console.log(data);
  }
  
  newData(id: any)
  {
    this.saveAgGridStateEvent.next(true);
    this.router.navigate(["taskForm", id, config.tasksTypesNames.query]);

  }

  
  applyChanges( data: any[])
  {
        console.log(data);
  }

}
