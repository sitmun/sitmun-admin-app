import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../../services/utils.service';
import { BtnEditRenderedComponent } from 'dist/sitmun-frontend-gui/';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-tasks-thematic',
  templateUrl: './tasks-thematic.component.html',
  styleUrls: ['./tasks-thematic.component.scss']
})
export class TasksThematicComponent implements OnInit {

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
        width: 50,
        lockPosition:true,
      },
      {
        headerName: '',
        field: 'id',
        editable: false,
        filter: false,
        width: 50,
        lockPosition:true,
        cellRenderer: 'btnEditRendererComponent',
        cellRendererParams: {
          clicked: this.newData.bind(this)
        },
      },
      { headerName: 'ID',  field: 'id', editable: false},
      { headerName: this.utils.getTranslate('tasksTHematicEntity.name'),  field: 'name'},
      { headerName: this.utils.getTranslate('tasksTHematicEntity.origin'),  field: 'origin'},
      { headerName: this.utils.getTranslate('tasksTHematicEntity.creator'),  field: 'creator'},
      { headerName: this.utils.getTranslate('tasksTHematicEntity.dataCreated'),  field: 'dataCreated' }
    ];
  }



  getAllTasksThematic = () => {
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
