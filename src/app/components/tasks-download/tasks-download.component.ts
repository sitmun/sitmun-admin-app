import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../../services/utils.service';
import { Router } from '@angular/router';
import { of,Subject} from 'rxjs';
import { environment } from 'src/environments/environment';
import { HalOptions, HalParam, TaskService } from 'dist/sitmun-frontend-core/';

@Component({
  selector: 'app-tasks-download',
  templateUrl: './tasks-download.component.html',
  styleUrls: ['./tasks-download.component.scss']
})
export class TasksDownloadComponent implements OnInit {
  saveAgGridStateEvent: Subject<boolean> = new Subject<boolean>();
  themeGrid:any=environment.agGridTheme;
  columnDefs: any[];

  constructor(public taskService: TaskService,
    private utils: UtilsService,
              private router: Router,
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
      { headerName: this.utils.getTranslate('tasksDownloadEntity.task'),  field: 'name'},
      { headerName: this.utils.getTranslate('tasksDownloadEntity.informationType'),  field: 'groupName', editable: false},
      { headerName: this.utils.getTranslate('tasksDownloadEntity.extent'),  field: 'format' }
    ];
  }



  getAllTasksDownload = () => {
    let taskTypeID=environment.tasksTypes['download'];
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
    this.router.navigate(['tasksDownload', id, 'tasksDownloadForm']);
  }
  
  applyChanges( data: any[])
  {
        console.log(data);
  }

}
