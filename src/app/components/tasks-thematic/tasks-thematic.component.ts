import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../../services/utils.service';
import { Router } from '@angular/router';
import { of,Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { config } from 'src/config';
import { HalOptions, HalParam, TaskService } from 'dist/sitmun-frontend-core/';

@Component({
  selector: 'app-tasks-thematic',
  templateUrl: './tasks-thematic.component.html',
  styleUrls: ['./tasks-thematic.component.scss']
})
export class TasksThematicComponent implements OnInit {
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
      this.utils.getIdColumnDef(),
      this.utils.getEditableColumnDef('tasksThematicEntity.name', 'name'),
      this.utils.getEditableColumnDef('tasksThematicEntity.origin', 'origin'),
      this.utils.getEditableColumnDef('tasksThematicEntity.creator', 'creator'),
      this.utils.getDateColumnDef('tasksThematicEntity.dataCreated', 'createdDate'),
    ];
  }



  getAllTasksThematic = () => {
    let taskTypeID=config.tasksTypes['thematic'];
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
    this.router.navigate(["taskForm", id, config.tasksTypesNames.thematic]);

  }
  
  applyChanges( data: any[])
  {
        console.log(data);
  }

}
