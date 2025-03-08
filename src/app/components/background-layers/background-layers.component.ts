import { Component, OnInit } from '@angular/core';
import { BackgroundService, Background } from '../../frontend-core/src/lib/public_api';
import { UtilsService } from '../../services/utils.service';
import { Router } from '@angular/router';
import { config } from 'src/config';
import { Subject, Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogMessageComponent } from '../../frontend-gui/src/lib/public_api';

@Component({
  selector: 'app-background-layers',
  templateUrl: './background-layers.component.html',
  styles: []
})
export class BackgroundLayersComponent implements OnInit {
  saveAgGridStateEvent: Subject<boolean> = new Subject<boolean>();
  dataUpdatedEvent: Subject<boolean> = new Subject <boolean>();
  themeGrid: any = config.agGridTheme;
  columnDefs: any[];
  gridModified = false;

  constructor(public dialog: MatDialog,
    public backgroundService: BackgroundService,
    private utils: UtilsService,
    private router: Router,
  ) {

  }

  ngOnInit() {

    const columnEditBtn=this.utils.getEditBtnColumnDef();
    columnEditBtn['cellRendererParams']= {
      clicked: this.newData.bind(this)
    }


    this.columnDefs = [
      columnEditBtn,
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getIdColumnDef(),
      this.utils.getEditableColumnDef('backgroundEntity.name','name'),
      this.utils.getEditableColumnDef('backgroundEntity.description','description'),
      this.utils.getBooleanColumnDef('backgroundEntity.active', 'active', true),
      this.utils.getNonEditableColumnDef('backgroundEntity.cartographyGroup','cartographyGroupName'),
      this.utils.getDateColumnDef('backgroundEntity.createdDate','createdDates')
    ];

  }

  async canDeactivate(): Promise<boolean | Observable<boolean>> {

    if (this.gridModified) {


      const result = await this.utils.showNavigationOutDialog().toPromise();
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

  getAllBackgroundLayers = () => {

    return this.backgroundService.getAll()
  }

  newData(id: any) {
    this.saveAgGridStateEvent.next(true);
    this.router.navigate(['backgroundLayers', id, 'backgroundLayersForm']);
  }

  applyChanges(data: Background[]) {
    const promises: Promise<any>[] = [];
    data.forEach(background => {
      promises.push(new Promise((resolve, ) => {this.backgroundService.update(background).subscribe(() =>{ resolve(true)})}));
      Promise.all(promises).then(() => {
        this.dataUpdatedEvent.next(true);
      });
    });
  }

  add(data: any[]) {
    this.saveAgGridStateEvent.next(true);
    this.router.navigate(['backgroundLayers', -1, 'backgroundLayersForm', data[0].id]);

  }

  removeData(data: Background[]) {

    const dialogRef = this.dialog.open(DialogMessageComponent);
    dialogRef.componentInstance.title=this.utils.getTranslate("caution");
    dialogRef.componentInstance.message=this.utils.getTranslate("removeMessage");
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        if(result.event==='Accept') {
          const promises: Promise<any>[] = [];
          data.forEach(background => {
            promises.push(new Promise((resolve, ) => { this.backgroundService.delete(background).subscribe(() =>{resolve(true)})}));
            Promise.all(promises).then(() => {
              this.dataUpdatedEvent.next(true);
            });
          });
       }
      }
    });



  }

}
