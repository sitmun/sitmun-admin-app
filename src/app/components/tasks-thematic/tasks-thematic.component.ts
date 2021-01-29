import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../../services/utils.service';
import { Router } from '@angular/router';
import { of,Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HalOptions, HalParam, TaskService } from '@sitmun/frontend-core';

@Component({
  selector: 'app-tasks-thematic',
  templateUrl: './tasks-thematic.component.html',
  styleUrls: ['./tasks-thematic.component.scss']
})
export class TasksThematicComponent implements OnInit {
  saveAgGridStateEvent: Subject<boolean> = new Subject<boolean>();
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
      { headerName: this.utils.getTranslate('tasksThematicEntity.name'),  field: 'name'},
      { headerName: this.utils.getTranslate('tasksThematicEntity.origin'),  field: 'origin'},
      { headerName: this.utils.getTranslate('tasksThematicEntity.creator'),  field: 'creator'},
      {
        headerName: this.utils.getTranslate('tasksThematicEntity.dataCreated'), field: 'createdDate',
        filter: 'agDateColumnFilter', filterParams: this.utils.getDateFilterParams(),
        editable: false, cellRenderer: (data) => { return this.utils.getDateFormated(data) }
      }
    ];
  }



  getAllTasksThematic = () => {
    let taskTypeID=environment.tasksTypes['thematic'];
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
    this.router.navigate(['tasksThematic', id, 'tasksThematicForm']);

  }
  
  applyChanges( data: any[])
  {
        console.log(data);
  }

}
