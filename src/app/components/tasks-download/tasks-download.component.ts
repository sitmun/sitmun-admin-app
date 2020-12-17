import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../../services/utils.service';
import { BtnEditRenderedComponent } from 'dist/sitmun-frontend-gui/';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-tasks-download',
  templateUrl: './tasks-download.component.html',
  styleUrls: ['./tasks-download.component.scss']
})
export class TasksDownloadComponent implements OnInit {

  themeGrid:any=environment.agGridTheme;
  columnDefs: any[];
  public frameworkComponents = {
    btnEditRendererComponent: BtnEditRenderedComponent
  };


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
        width: 40,
        lockPosition:true,
        cellRenderer: 'btnEditRendererComponent',
        cellRendererParams: {
          clicked: this.newData.bind(this)
        },
      },
      { headerName: 'ID',  field: 'id', editable: false},
      { headerName: this.utils.getTranslate('tasksDownloadEntity.name'),  field: 'name'},
      { headerName: this.utils.getTranslate('tasksDownloadEntity.observations'),  field: 'observations'},
      { headerName: this.utils.getTranslate('tasksDownloadEntity.application'),  field: 'application' }
    ];
  }



  getAllTasksDownload = () => {
    const aux:Array<any> = [];
    return of(aux);
  }

  removeData( data: any[])
  {
    console.log(data);
  }
  
  newData(id: any)
  {
    // this.router.navigate(['territory', id, 'territoryForm']);
  }
  
  applyChanges( data: any[])
  {
        console.log(data);
  }

}
