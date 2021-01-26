import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../../services/utils.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TaskService, HalOptions, HalParam } from '@sitmun/frontend-core';

@Component({
  selector: 'app-tasks-locator',
  templateUrl: './tasks-locator.component.html',
  styleUrls: ['./tasks-locator.component.scss']
})
export class TasksLocatorComponent implements OnInit {

  themeGrid:any=environment.agGridTheme;
  columnDefs: any[];

  constructor(private utils: UtilsService,
              private router: Router,
              public taskService: TaskService
              )
              { }


  ngOnInit()  {

    var columnEditBtn=environment.editBtnColumnDef;
    columnEditBtn['cellRendererParams']= {
      clicked: this.newData.bind(this)
    }


    this.columnDefs = [
      environment.selCheckboxColumnDef,
      columnEditBtn,
      { headerName: 'ID',  field: 'id', editable: false},
      { headerName: this.utils.getTranslate('tasksLocatorEntity.task'),  field: 'name'},
      { headerName: this.utils.getTranslate('tasksLocatorEntity.informationType'),  field: 'groupName',editable: false},
      { headerName: this.utils.getTranslate('tasksLocatorEntity.accesType'),  field: 'accesType'},
      { headerName: this.utils.getTranslate('tasksLocatorEntity.command'),  field: 'order'},
      { headerName: this.utils.getTranslate('tasksLocatorEntity.connection'),  field: 'connection',editable: false},
      { headerName: this.utils.getTranslate('tasksLocatorEntity.associatedLayer'),  field: 'associatedLayer' }
    ];
  }



  getAllTasksLocator = () => {
    let taskTypeID=environment.tasksTypes['locator'];
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
    this.router.navigate(['tasksLocator', id, 'tasksLocatorForm']);

  }
  
  applyChanges( data: any[])
  {
        console.log(data);
  }

}
 