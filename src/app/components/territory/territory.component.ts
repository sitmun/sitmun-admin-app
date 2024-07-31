import { Component, OnInit } from '@angular/core';
import { TerritoryService, Territory, TerritoryTypeService } from '../../frontend-core/src/lib/public_api';
import { UtilsService } from '../../services/utils.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { config } from 'src/config';
import { Observable, Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogMessageComponent } from '../../frontend-gui/src/lib/public_api';

@Component({
  selector: 'app-territory',
  templateUrl: './territory.component.html',
  styleUrls: ['./territory.component.scss']
})
export class TerritoryComponent implements OnInit {
  saveAgGridStateEvent: Subject<boolean> = new Subject<boolean>();
  dataUpdatedEvent: Subject<boolean> = new Subject<boolean>();
  themeGrid: any = config.agGridTheme;
  columnDefs: any[];
  scopeTypes: Array<any> = [];
  territoryTypes: Array<any> = [];
  gridModified = false;
  dataLoaded = false;


  constructor(public dialog: MatDialog,
    public territoryService: TerritoryService,
    public territoryTypeService: TerritoryTypeService,
    private utils: UtilsService,
    private router: Router,
  ) { }


  ngOnInit() {

    const promises: Promise<any>[] = [];
    promises.push(new Promise((resolve, reject) => {
      this.territoryTypeService.getAll().subscribe(
        resp => {
          this.territoryTypes.push(...resp);
          resolve(true);
        }
      )
    }));


    var columnEditBtn=this.utils.getEditBtnColumnDef();
    columnEditBtn['cellRendererParams']= {
      clicked: this.newData.bind(this)
    }


    this.columnDefs = [
      this.utils.getSelCheckboxColumnDef(),
      columnEditBtn,
      this.utils.getIdColumnDef(),
      this.utils.getEditableColumnDef('territoryEntity.code', 'code'),
      this.utils.getEditableColumnDef('territoryEntity.name', 'name'),
      this.utils.getFormattedColumnDef('layersPermitsEntity.type',this.territoryTypes,'typeId','id', 'name'),
      this.utils.getDateColumnDef('territoryEntity.createdDate','createdDate')
    ];
    Promise.all(promises).then(()=>{
      this.dataLoaded=true;
    });
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

  getAllTerritories = () => {
    return this.territoryService.getAll();
  }

  newData(id: any) {
    this.saveAgGridStateEvent.next(true);
    this.router.navigate(['territory', id, 'territoryForm']);
  }

  applyChanges(data: Territory[]) {
    const promises: Promise<any>[] = [];
    data.forEach(territory => {
      promises.push(new Promise((resolve, reject) => { this.territoryService.update(territory).subscribe((resp) => { resolve(true) }) }));
      Promise.all(promises).then(() => {
        this.dataUpdatedEvent.next(true);
      });
    });
  }

  add(data: Territory[]) {
    this.router.navigate(['territory', -1, 'territoryForm', data[0].id]);
  }

  removeData(data: Territory[]) {

    const dialogRef = this.dialog.open(DialogMessageComponent);
    dialogRef.componentInstance.title=this.utils.getTranslate("caution");
    dialogRef.componentInstance.message=this.utils.getTranslate("removeMessage");
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        if(result.event==='Accept') {  
          const promises: Promise<any>[] = [];
          data.forEach(territory => {
            promises.push(new Promise((resolve, reject) => { this.territoryService.delete(territory).subscribe((resp) => { resolve(true) }) }));
            Promise.all(promises).then(() => {
              this.dataUpdatedEvent.next(true);
            });
          });
       }
      }
    });



  }

}
