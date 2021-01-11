import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../../services/utils.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-tasks-report',
  templateUrl: './tasks-report.component.html',
  styleUrls: ['./tasks-report.component.scss']
})
export class TasksReportComponent implements OnInit {

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
        width: 40,
        lockPosition:true,
      },
      {
        headerName: '',
        field: 'id',
        editable: false,
        filter: false,
        width: 35,
        lockPosition:true,
        cellRenderer: 'btnEditRendererComponent',
        cellRendererParams: {
          clicked: this.newData.bind(this)
        },
      },
      { headerName: 'ID',  field: 'id', editable: false},
      { headerName: this.utils.getTranslate('tasksReportEntity.task'),  field: 'task'},
      { headerName: this.utils.getTranslate('tasksReportEntity.informationType'),  field: 'informationType'},
      { headerName: this.utils.getTranslate('tasksReportEntity.template'),  field: 'template' }
    ];
  }



  getAllTasksReport = () => {
    const aux:Array<any> = [];
    return of(aux);
  }

  removeData( data: any[])
  {
    console.log(data);
  }
  
  newData(id: any)
  {
    this.router.navigate(['tasksReport', id, 'tasksReportForm']);  
  }
  
  applyChanges( data: any[])
  {
        console.log(data);
  }

}
