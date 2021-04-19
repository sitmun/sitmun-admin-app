import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../../services/utils.service';
import { Router } from '@angular/router';
import { of,Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { config } from 'src/config';
import { HalOptions, HalParam, TaskService } from 'dist/sitmun-frontend-core/';

@Component({
  selector: 'app-tasks-extraction-fme',
  templateUrl: './tasks-extraction-fme.component.html',
  styleUrls: ['./tasks-extraction-fme.component.scss']
})
export class TasksExtractionFmeComponent implements OnInit {
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
      { headerName: this.utils.getTranslate('tasksExtractionFMEEntity.cartography'),  field: 'cartography',editable: false},
      { headerName: this.utils.getTranslate('tasksExtractionFMEEntity.service'),  field: 'service',editable: false,},
      { headerName: this.utils.getTranslate('tasksExtractionFMEEntity.layer'),  field: 'layer'},
      {
        headerName: this.utils.getTranslate('tasksExtractionFMEEntity.dataCreated'), field: 'createdDate',
        filter: 'agDateColumnFilter', filterParams: this.utils.getDateFilterParams(),
        editable: false, cellRenderer: (data) => { return this.utils.getDateFormated(data) }
      }
    ];
  }



  getAllTasksExtractionFME = () => {
    let taskTypeID=config.tasksTypes['extraction'];
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
    this.router.navigate(["taskForm", id, config.tasksTypesNames.extraction]);
  }
  
  applyChanges( data: any[])
  {
        console.log(data);
  }

}
