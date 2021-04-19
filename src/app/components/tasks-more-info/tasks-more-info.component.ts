import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../../services/utils.service';
import { Router } from '@angular/router';
import { of,Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { config } from 'src/config';
import { HalOptions, HalParam, TaskService } from 'dist/sitmun-frontend-core/';


@Component({
  selector: 'app-tasks-more-info',
  templateUrl: './tasks-more-info.component.html',
  styleUrls: ['./tasks-more-info.component.scss']
})
export class TasksMoreInfoComponent implements OnInit {
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
      { headerName: this.utils.getTranslate('tasksMoreInfoEntity.task'),  field: 'name'},
      { headerName: this.utils.getTranslate('tasksMoreInfoEntity.informationType'),  field: 'groupName',editable: false},
      { headerName: this.utils.getTranslate('tasksMoreInfoEntity.accesType'),  field: 'accesType'},
      { headerName: this.utils.getTranslate('tasksMoreInfoEntity.command'),  field: 'order'},
      { headerName: this.utils.getTranslate('tasksMoreInfoEntity.connection'),  field: 'connection',editable: false},
      { headerName: this.utils.getTranslate('tasksMoreInfoEntity.associatedLayer'),  field: 'associatedLayer' }
    ];
  }



  getAllTasksMoreInfo = () => {
    let taskTypeID=config.tasksTypes['moreInfo'];
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
    this.router.navigate(["taskForm", id, config.tasksTypesNames.moreInfo]);

  }
  
  applyChanges( data: any[])
  {
        console.log(data);
  }

}
