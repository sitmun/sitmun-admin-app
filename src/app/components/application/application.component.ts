import { Component, OnInit } from '@angular/core';
import { ApplicationService, Application } from '../../frontend-core/src/lib/public_api';
import { UtilsService } from '../../services/utils.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { config } from 'src/config';
import { Observable, Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogMessageComponent } from '../../frontend-gui/src/lib/public_api';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss']
})
export class ApplicationComponent implements OnInit {
  saveAgGridStateEvent: Subject<boolean> = new Subject<boolean>();
  dataUpdatedEvent: Subject<boolean> = new Subject<boolean>();
  themeGrid: any = config.agGridTheme;
  columnDefs: any[];
  gridModified = false;
	
  applicationTypes: Array<any> = [];

  constructor(public dialog: MatDialog,
    public applicationService: ApplicationService,
    private utils: UtilsService,
    private router: Router,
  ) {

  }

  ngOnInit() {


    this.utils.getCodeListValues('application.type').subscribe(
      resp => {
        this.applicationTypes.push(...resp);
      }
    );


    var columnEditBtn = this.utils.getEditBtnColumnDef();
    columnEditBtn['cellRendererParams'] = {
      clicked: this.newData.bind(this)
    }

    this.columnDefs = [
      this.utils.getSelCheckboxColumnDef(),
      columnEditBtn,
      this.utils.getIdColumnDef(),
      this.utils.getEditableColumnDef('applicationEntity.name','name'),
      {
        headerName: this.utils.getTranslate('applicationEntity.type'),  editable: false,
        valueGetter: (params) => {
          var alias = this.applicationTypes.filter((type) => type.value == params.data.type)[0];
          return alias != undefined ? alias.description : params.data.type
        }
      },
      this.utils.getEditableColumnDef('applicationEntity.theme','theme'),
      this.utils.getEditableColumnDef('applicationEntity.srs','srs'),
      this.utils.getDateColumnDef('applicationEntity.createdDate','createdDate')
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
  

  getAllApplications = () => {
    return this.applicationService.getAll();
  }

  newData(id: any) {
    this.saveAgGridStateEvent.next(true);
    this.router.navigate(['application', id, 'applicationForm']);
  }

  applyChanges(data: Application[]) {
    const promises: Promise<any>[] = [];
    data.forEach(application => {
      promises.push(new Promise((resolve, reject) => { this.applicationService.update(application).subscribe((resp) => { resolve(true) }) }));
      Promise.all(promises).then(() => {
        this.dataUpdatedEvent.next(true);
      });
    });
  }

  add(data: Application[]) {
    const promises: Promise<any>[] = [];
    this.saveAgGridStateEvent.next(true);
    this.router.navigate(['application', -1, 'applicationForm', data[0].id]);
  }

  removeData(data: Application[]) {

    const dialogRef = this.dialog.open(DialogMessageComponent);
    dialogRef.componentInstance.title = this.utils.getTranslate("caution");
    dialogRef.componentInstance.message = this.utils.getTranslate("removeMessage");
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.event === 'Accept') {
          const promises: Promise<any>[] = [];
          data.forEach(application => {
            promises.push(new Promise((resolve, reject) => { this.applicationService.delete(application).subscribe((resp) => { resolve(true) }) }));
            Promise.all(promises).then(() => {
              this.dataUpdatedEvent.next(true);
            });
          });
        }
      }
    });



  }
}
