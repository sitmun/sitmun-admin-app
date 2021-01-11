import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../../services/utils.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-tasks-edition',
  templateUrl: './tasks-edition.component.html',
  styleUrls: ['./tasks-edition.component.scss']
})
export class TasksEditionComponent implements OnInit {

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
        width: 50,
        lockPosition:true,
      },
      {
        headerName: '',
        field: 'id',
        editable: false,
        filter: false,
        width: 45,
        lockPosition:true,
        cellRenderer: 'btnEditRendererComponent',
        cellRendererParams: {
          clicked: this.newData.bind(this)
        },
      },
      { headerName: 'ID',  field: 'id', editable: false},
      { headerName: this.utils.getTranslate('tasksEditionEntity.name'),  field: 'name'},
      { headerName: this.utils.getTranslate('tasksEditionEntity.associatedLayer'),  field: 'associatedLayer'},
      { headerName: this.utils.getTranslate('tasksEditionEntity.informationType'),  field: 'informationType'},
      { headerName: this.utils.getTranslate('tasksEditionEntity.dataCreated'),  field: 'dataCreated'}
    ];
  }



  getAllTasksEdit = () => {
    const aux:Array<any> = [];
    return of(aux);
  }

  removeData( data: any[])
  {
    console.log(data);
  }
  
  newData(id: any)
  {
    this.router.navigate(['tasksEdition', id, 'tasksEditionForm']);
  }
  
  applyChanges( data: any[])
  {
        console.log(data);
  }

}
