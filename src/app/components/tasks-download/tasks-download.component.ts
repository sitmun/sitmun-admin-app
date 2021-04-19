import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../../services/utils.service';
import { Router } from '@angular/router';
import { of,Subject} from 'rxjs';
import { environment } from 'src/environments/environment';
import { config } from 'src/config';
import { HalOptions, HalParam, TaskService } from 'dist/sitmun-frontend-core/';

@Component({
  selector: 'app-tasks-download',
  templateUrl: './tasks-download.component.html',
  styleUrls: ['./tasks-download.component.scss']
})
export class TasksDownloadComponent implements OnInit {
  saveAgGridStateEvent: Subject<boolean> = new Subject<boolean>();
  themeGrid:any=config.agGridTheme;
  columnDefs: any[];

  constructor(public taskService: TaskService,
    private utils: UtilsService,
              private router: Router,
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
      { headerName: this.utils.getTranslate('tasksDownloadEntity.task'),  field: 'name'},
      { headerName: this.utils.getTranslate('tasksDownloadEntity.informationType'),  field: 'groupName', editable: false},
      { headerName: this.utils.getTranslate('tasksDownloadEntity.extent'),  field: 'format' }
    ];
  }



  getAllTasksDownload = () => {
    let taskTypeID=config.tasksTypes['download'];
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
    this.router.navigate(["taskForm", id, config.tasksTypesNames.download]);
  }
  
  applyChanges( data: any[])
  {
        console.log(data);
  }

}
