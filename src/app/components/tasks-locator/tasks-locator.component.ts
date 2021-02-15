import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../../services/utils.service';
import { Router } from '@angular/router';
import { of,Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { config } from 'src/config';
import { TaskService, HalOptions, HalParam } from 'dist/sitmun-frontend-core/';

@Component({
  selector: 'app-tasks-locator',
  templateUrl: './tasks-locator.component.html',
  styleUrls: ['./tasks-locator.component.scss']
})
export class TasksLocatorComponent implements OnInit {
  saveAgGridStateEvent: Subject<boolean> = new Subject<boolean>();
  themeGrid:any=config.agGridTheme;
  columnDefs: any[];

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
    let taskTypeID=config.tasksTypes['locator'];
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
    this.router.navigate(['tasksLocator', id, 'tasksLocatorForm']);

  }
  
  applyChanges( data: any[])
  {
        console.log(data);
  }

}
 