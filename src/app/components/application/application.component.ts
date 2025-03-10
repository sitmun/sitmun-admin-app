import {Component, OnInit} from '@angular/core';
import {ApplicationService, Application} from '@app/frontend-core/src/lib/public_api';
import {UtilsService} from '@app/services/utils.service';
import {Router} from '@angular/router';
import {config} from '@config';
import {Observable, Subject} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {DialogMessageComponent} from '@app/frontend-gui/src/lib/public_api';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styles: []
})
export class ApplicationComponent implements OnInit {
  saveAgGridStateEvent: Subject<boolean> = new Subject<boolean>();
  dataUpdatedEvent: Subject<boolean> = new Subject<boolean>();
  themeGrid: any = config.agGridTheme;
  columnDefs: any[];
  gridModified = false;

  applicationTypes: any[] = [];

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


    const columnEditBtn = this.utils.getEditBtnColumnDef();
    columnEditBtn['cellRendererParams'] = {
      clicked: this.newData.bind(this)
    };

    this.columnDefs = [
      columnEditBtn,
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getIdColumnDef(),
      this.utils.getEditableColumnDef('applicationEntity.name', 'name'),
      {
        headerName: this.utils.getTranslate('applicationEntity.type'), editable: false,
        valueGetter: (params) => {
          const alias = this.applicationTypes.filter((type) => type.value == params.data.type)[0];
          return alias != undefined ? alias.description : params.data.type;
        }
      },
      this.utils.getEditableColumnDef('applicationEntity.theme', 'theme'),
      this.utils.getEditableColumnDef('applicationEntity.srs', 'srs'),
      this.utils.getDateColumnDef('applicationEntity.createdDate', 'createdDate')
    ];

  }

  async canDeactivate(): Promise<boolean | Observable<boolean>> {

    if (this.gridModified) {


      const result = await this.utils.showNavigationOutDialog().toPromise();
      if (!result || result.event !== 'Accept') {
        return false;
      } else if (result.event === 'Accept') {
        return true;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }

  setGridModifiedValue(value) {
    this.gridModified = value;
  }


  getAllApplications = () => {
    return this.applicationService.getAll();
  };

  newData(id: any) {
    this.saveAgGridStateEvent.next(true);
    this.router.navigate(['application', id, 'applicationForm']);
  }

  applyChanges(data: Application[]) {
    const promises: Promise<any>[] = [];
    data.forEach(application => {
      promises.push(new Promise((resolve,) => {
        this.applicationService.update(application).subscribe(() => {
          resolve(true);
        });
      }));
      Promise.all(promises).then(() => {
        this.dataUpdatedEvent.next(true);
      });
    });
  }

  add(data: Application[]) {
    this.saveAgGridStateEvent.next(true);
    this.router.navigate(['application', -1, 'applicationForm', data[0].id]);
  }

  removeData(data: Application[]) {

    const dialogRef = this.dialog.open(DialogMessageComponent);
    dialogRef.componentInstance.title = this.utils.getTranslate('caution');
    dialogRef.componentInstance.message = this.utils.getTranslate('removeMessage');
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.event === 'Accept') {
          const promises: Promise<any>[] = [];
          data.forEach(application => {
            promises.push(new Promise((resolve,) => {
              this.applicationService.delete(application).subscribe(() => {
                resolve(true);
              });
            }));
            Promise.all(promises).then(() => {
              this.dataUpdatedEvent.next(true);
            });
          });
        }
      }
    });
  }
}
