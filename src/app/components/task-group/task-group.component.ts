
import { Component, OnInit } from '@angular/core';
import { TaskGroupService, TaskGroup } from 'dist/sitmun-frontend-core/';
import { UtilsService } from '../../services/utils.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { config } from 'src/config';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogMessageComponent } from 'dist/sitmun-frontend-gui/';
 
@Component({
  selector: 'app-task-group',
  templateUrl: './task-group.component.html',
  styleUrls: ['./task-group.component.scss']
})
export class TaskGroupComponent implements OnInit {
  saveAgGridStateEvent: Subject<boolean> = new Subject<boolean>();
  dataUpdatedEvent: Subject<boolean> = new Subject <boolean>();
  themeGrid: any = config.agGridTheme;
  columnDefs: any[];

  constructor(public dialog: MatDialog,
    public taskGroupService: TaskGroupService,
    private utils: UtilsService,
    private router: Router,
  ) {

  }

  ngOnInit() {

    var columnEditBtn=config.editBtnColumnDef;
    columnEditBtn['cellRendererParams']= {
      clicked: this.newData.bind(this)
    }


    this.columnDefs = [
      config.selCheckboxColumnDef,
      columnEditBtn,
      { headerName: 'Id', field: 'id', editable: false },
      { headerName: this.utils.getTranslate('taskGroupEntity.name'), field: 'name' },
      // { headerName: this.utils.getTranslate('serviceEntity.type'), field: 'type'},
      // { headerName: this.utils.getTranslate('serviceEntity.serviceURL'), field: 'theme'},
      // { headerName: this.utils.getTranslate('serviceEntity.supportedSRS'), field: 'srs'},
      // { headerName: this.utils.getTranslate('serviceEntity.createdDate'), field: 'createdDate'} // type: 'dateColumn'
    ];

  }


  getAllTaskGroups = () => {

    return this.taskGroupService.getAll();
  }

  newData(id: any) {
    this.saveAgGridStateEvent.next(true);
    this.router.navigate(['taskGroup', id, 'taskGroupForm']);
  }

  applyChanges(data: TaskGroup[]) {
    const promises: Promise<any>[] = [];
    data.forEach(taskGroup => {
      promises.push(new Promise((resolve, reject) => {​​​​​​​ this.taskGroupService.update(taskGroup).subscribe((resp) =>{​​​​​​​resolve(true)}​​​​​​​)}​​​​​​​));
      Promise.all(promises).then(() => {
        this.dataUpdatedEvent.next(true);
      });
    });
  }

  add(data: TaskGroup[]) {
    const promises: Promise<any>[] = [];
    data.forEach(taskGroup => {
      taskGroup.id = null;
      taskGroup.name = 'copia_'.concat(taskGroup.name)
      promises.push(new Promise((resolve, reject) => {​​​​​​​ this.taskGroupService.create(taskGroup).subscribe((resp) =>{​​​​​​​resolve(true)}​​​​​​​)}​​​​​​​));
      Promise.all(promises).then(() => {
        this.dataUpdatedEvent.next(true);
      });
    });

  }

  removeData(data: TaskGroup[]) {

    const dialogRef = this.dialog.open(DialogMessageComponent);
    dialogRef.componentInstance.title=this.utils.getTranslate("caution");
    dialogRef.componentInstance.message=this.utils.getTranslate("removeMessage");
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        if(result.event==='Accept') {  
          const promises: Promise<any>[] = [];
          data.forEach(taskGroup => {
            promises.push(new Promise((resolve, reject) => {​​​​​​​ this.taskGroupService.delete(taskGroup).subscribe((resp) =>{​​​​​​​resolve(true)}​​​​​​​)}​​​​​​​));
            Promise.all(promises).then(() => {
              this.dataUpdatedEvent.next(true);
            });
          });
       }
      }
    });



  }
}

