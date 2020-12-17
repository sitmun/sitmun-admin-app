import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../../services/utils.service';
import { BtnEditRenderedComponent } from 'dist/sitmun-frontend-gui/';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-tasks-locator',
  templateUrl: './tasks-locator.component.html',
  styleUrls: ['./tasks-locator.component.scss']
})
export class TasksLocatorComponent implements OnInit {

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
      { headerName: this.utils.getTranslate('tasksLocatorEntity.task'),  field: 'task'},
      { headerName: this.utils.getTranslate('tasksLocatorEntity.informationType'),  field: 'informationType'},
      { headerName: this.utils.getTranslate('tasksLocatorEntity.accesType'),  field: 'accesType'},
      { headerName: this.utils.getTranslate('tasksLocatorEntity.command'),  field: 'command'},
      { headerName: this.utils.getTranslate('tasksLocatorEntity.connection'),  field: 'connection'},
      { headerName: this.utils.getTranslate('tasksLocatorEntity.associatedLayer'),  field: 'associatedLayer' }
    ];
  }



  getAllTasksLocator = () => {
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
 