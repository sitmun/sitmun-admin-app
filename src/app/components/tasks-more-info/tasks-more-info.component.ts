import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../../services/utils.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-tasks-more-info',
  templateUrl: './tasks-more-info.component.html',
  styleUrls: ['./tasks-more-info.component.scss']
})
export class TasksMoreInfoComponent implements OnInit {

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
        width: 60,
        lockPosition:true,
      },
      {
        headerName: '',
        field: 'id',
        editable: false,
        filter: false,
        width: 60,
        lockPosition:true,
        cellRenderer: 'btnEditRendererComponent',
        cellRendererParams: {
          clicked: this.newData.bind(this)
        },
      },
      { headerName: 'ID',  field: 'id', editable: false},
      { headerName: this.utils.getTranslate('tasksMoreInfoEntity.task'),  field: 'task'},
      { headerName: this.utils.getTranslate('tasksMoreInfoEntity.informationType'),  field: 'informationType'},
      { headerName: this.utils.getTranslate('tasksMoreInfoEntity.accesType'),  field: 'accesType'},
      { headerName: this.utils.getTranslate('tasksMoreInfoEntity.command'),  field: 'command'},
      { headerName: this.utils.getTranslate('tasksMoreInfoEntity.connection'),  field: 'connection'},
      { headerName: this.utils.getTranslate('tasksMoreInfoEntity.associatedLayer'),  field: 'associatedLayer' }
    ];
  }



  getAllTasksMoreInfo = () => {
    const aux:Array<any> = [];
    return of(aux);
  }

  removeData( data: any[])
  {
    console.log(data);
  }
  
  newData(id: any)
  {
    this.router.navigate(['tasksMoreInformation', id, 'tasksMoreInformationForm']);

  }
  
  applyChanges( data: any[])
  {
        console.log(data);
  }

}
