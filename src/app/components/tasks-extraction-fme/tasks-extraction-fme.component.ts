import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../../services/utils.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-tasks-extraction-fme',
  templateUrl: './tasks-extraction-fme.component.html',
  styleUrls: ['./tasks-extraction-fme.component.scss']
})
export class TasksExtractionFmeComponent implements OnInit {

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
      { headerName: this.utils.getTranslate('tasksExtractionFMEEntity.cartography'),  field: 'cartography'},
      { headerName: this.utils.getTranslate('tasksExtractionFMEEntity.service'),  field: 'service'},
      { headerName: this.utils.getTranslate('tasksExtractionFMEEntity.layer'),  field: 'layer'},
      { headerName: this.utils.getTranslate('tasksExtractionFMEEntity.dataCreated'),  field: 'dataCreated' }
    ];
  }



  getAllTasksExtractionFME = () => {
    const aux:Array<any> = [];
    return of(aux);
  }

  removeData( data: any[])
  {
    console.log(data);
  }
  
  newData(id: any)
  {
    this.router.navigate(['tasksExtractionFME', id, 'tasksExtractionFMEForm']);
  }
  
  applyChanges( data: any[])
  {
        console.log(data);
  }

}
