import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../../services/utils.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HalOptions, HalParam, TaskService } from '@sitmun/frontend-core';

@Component({
  selector: 'app-tasks-document',
  templateUrl: './tasks-document.component.html',
  styleUrls: ['./tasks-document.component.scss']
})
export class TasksDocumentComponent implements OnInit {

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
      { headerName: this.utils.getTranslate('tasksDocumentEntity.task'),  field: 'name'},
      { headerName: this.utils.getTranslate('tasksDocumentEntity.informationType'),  field: 'groupName', editable: false},
      { headerName: this.utils.getTranslate('tasksDocumentEntity.path'),  field: 'path' },
      { headerName: this.utils.getTranslate('tasksDocumentEntity.extent'),  field: 'extent' },
      { headerName: this.utils.getTranslate('tasksDocumentEntity.associatedLayer'),  field: 'associatedLayer' }
    ];
  }



  getAllTasksDocument = () => {
    
    let taskTypeID=environment.tasksTypes['document'];
    console.log(environment.tasksTypes);
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
    this.router.navigate(['tasksDocument', id, 'tasksDocumentForm']);
  }
  
  applyChanges( data: any[])
  {
        console.log(data);
  }

}
