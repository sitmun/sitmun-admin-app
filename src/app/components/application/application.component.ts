import { Component, OnInit } from '@angular/core';
import { ApplicationService, Application } from 'dist/sitmun-frontend-core/';
import { UtilsService } from '../../services/utils.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { config } from 'src/config';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogMessageComponent } from 'dist/sitmun-frontend-gui/';

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
    data.forEach(application => {
      application.id = null;
      application.createdDate=new Date();
      application.name = this.utils.getTranslate('copy_').concat(application.name)
      promises.push(new Promise((resolve, reject) => { this.applicationService.create(application).subscribe((resp) => { resolve(true) }) }));
      Promise.all(promises).then(() => {
        this.dataUpdatedEvent.next(true);
      });
    });

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
