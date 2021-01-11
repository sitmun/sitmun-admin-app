import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../../services/utils.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-tasks-query',
  templateUrl: './tasks-query.component.html',
  styleUrls: ['./tasks-query.component.scss']
})
export class TasksQueryComponent implements OnInit {

  themeGrid:any=environment.agGridTheme;
  columnDefs: any[];

  constructor(private utils: UtilsService,
              private router: Router,
              )
              { }


  ngOnInit()  {

    this.columnDefs = [
      {
        headerName: '',
        checkboxSelection: true,
        headerCheckboxSelection: true,
        editable: false,
        filter: false,
        width: 70,
        lockPosition:true,
      },
      {
        headerName: '',
        field: 'id',
        editable: false,
        filter: false,
        width: 70,
        lockPosition:true,
        cellRenderer: 'btnEditRendererComponent',
        cellRendererParams: {
          clicked: this.newData.bind(this)
        },
      },
      { headerName: 'ID',  field: 'id', editable: false},
      { headerName: this.utils.getTranslate('tasksQueryEntity.name'),  field: 'name'},
      { headerName: this.utils.getTranslate('tasksQueryEntity.task'),  field: 'task'},
      { headerName: this.utils.getTranslate('tasksQueryEntity.informationType'),  field: 'informationType' },
      { headerName: this.utils.getTranslate('tasksQueryEntity.accesType'),  field: 'accesType' },
      { headerName: this.utils.getTranslate('tasksQueryEntity.command'),  field: 'command' },
      { headerName: this.utils.getTranslate('tasksQueryEntity.connection'),  field: 'connection' },
      { headerName: this.utils.getTranslate('tasksQueryEntity.associatedLayer'),  field: 'associatedLayer' }
    ];
  }

  getAllTasksQuery = () => {
    const aux:Array<any> = [];
    return of(aux);
  }

  removeData( data: any[])
  {
    console.log(data);
  }
  
  newData(id: any)
  {
    this.router.navigate(['tasksQuery', id, 'tasksQueryForm']);  
  }
  
  applyChanges( data: any[])
  {
        console.log(data);
  }

}
