import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../../services/utils.service';
import {  Router } from '@angular/router';
import { Observable, of,Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { config } from 'src/config';
import { HalOptions, HalParam, TaskService } from 'dist/sitmun-frontend-core/';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-tasks-document',
  templateUrl: './tasks-document.component.html',
  styleUrls: ['./tasks-document.component.scss']
})
export class TasksDocumentComponent implements OnInit {
  saveAgGridStateEvent: Subject<boolean> = new Subject<boolean>();
  themeGrid:any=config.agGridTheme;
  columnDefs: any[];
  properties;
  gridModified = false;
  
  constructor(private utils: UtilsService,
              private router: Router,
              public taskService: TaskService,
              )
              {}


  ngOnInit()  {

    // this.taskTypeService.getAll().pipe(map((data: any[]) => data.filter(elem => elem.title=="Download"))).subscribe(
    //   result => {
    //     this.properties = result[0].specification;
    //     console.log(this.properties);

       
    //   }
    // )

    var columnEditBtn=this.utils.getEditBtnColumnDef();
    columnEditBtn['cellRendererParams']= {
      clicked: this.newData.bind(this)
    }


    this.columnDefs = [
      this.utils.getSelCheckboxColumnDef(),
      columnEditBtn,
      this.utils.getIdColumnDef(),
      this.utils.getEditableColumnDef('tasksDocumentEntity.task', 'name'),
      this.utils.getEditableColumnDef('tasksDocumentEntity.informationType', 'groupName'),
      this.utils.getEditableColumnDef('tasksDocumentEntity.extent', 'format'),
    ];
  }

  
  async canDeactivate(): Promise<boolean | Observable<boolean>> {

    if (this.gridModified) {


      let result = await this.utils.showNavigationOutDialog().toPromise();
      if(!result || result.event!=='Accept') { return false }
      else if(result.event ==='Accept') {return true;}
      else{
        return true;
      }
    }
    else return true
  }	

  setGridModifiedValue(value){
    this.gridModified=value;
  }
  

  getAllTasksDocument = () => {
    
    let taskTypeID=config.tasksTypes['document'];
    console.log(config.tasksTypes);
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
    // this.router.navigate(['tasksDocument', id, 'tasksDocumentForm']);
    this.router.navigate(["taskForm", id, config.tasksTypesNames.document]);
  }
  
  applyChanges( data: any[])
  {
        console.log(data);
  }

}
