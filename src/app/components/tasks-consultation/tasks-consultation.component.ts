import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../../services/utils.service';
import { BtnEditRenderedComponent } from 'dist/sitmun-frontend-gui/';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-tasks-consultation',
  templateUrl: './tasks-consultation.component.html',
  styleUrls: ['./tasks-consultation.component.scss']
})
export class TasksConsultationComponent implements OnInit {

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
      { headerName: this.utils.getTranslate('tasksConsultationEntity.name'),  field: 'name'},
      { headerName: this.utils.getTranslate('tasksConsultationEntity.task'),  field: 'task'},
      { headerName: this.utils.getTranslate('tasksConsultationEntity.informationType'),  field: 'informationType' },
      { headerName: this.utils.getTranslate('tasksConsultationEntity.accesType'),  field: 'accesType' },
      { headerName: this.utils.getTranslate('tasksConsultationEntity.command'),  field: 'command' },
      { headerName: this.utils.getTranslate('tasksConsultationEntity.connection'),  field: 'connection' },
      { headerName: this.utils.getTranslate('tasksConsultationEntity.associatedLayer'),  field: 'associatedLayer' }
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
    // this.router.navigate(['territory', id, 'territoryForm']);
  }
  
  applyChanges( data: any[])
  {
        console.log(data);
  }

}
