import { Component, OnInit } from '@angular/core';
import { TerritoryService,Territory } from 'dist/sitmun-frontend-core/';
import { UtilsService } from '../../services/utils.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { config } from 'src/config';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogMessageComponent } from 'dist/sitmun-frontend-gui/';

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



  constructor(public dialog: MatDialog,
    public territoryService: TerritoryService,
    private utils: UtilsService,
    private router: Router,
  ) { }


  ngOnInit() {

    this.utils.getCodeListValues('territory.scope').subscribe(
      resp => {
        this.scopeTypes.push(...resp);
      }
    );

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
      this.utils.getFormattedColumnDef('territoryEntity.scope',this.scopeTypes,'scope'),
      this.utils.getDateColumnDef('territoryEntity.createdDate','createdDate')
      //{ headerName: this.utils.getTranslate('territoryEntity.administrator'), field: 'territorialAuthorityName' },
      //{ headerName: this.utils.getTranslate('territoryEntity.email'), field: 'territorialAuthorityEmail' },
      //{ headerName: this.utils.getTranslate('territoryEntity.address'), field: 'territorialAuthorityAddress' },
      //{ headerName: this.utils.getTranslate('territoryEntity.extent'), field: 'extent' },
      //{ headerName: this.utils.getTranslate('territoryEntity.note'), field: 'note' },
      /*{ headerName: this.utils.getTranslate('territoryEntity.blocked'), field: 'blocked', editable: false,
      cellRenderer: 'btnCheckboxRendererComponent', floatingFilterComponent: 'btnCheckboxFilterComponent',
      floatingFilterComponentParams: { suppressFilterButton: true }, },*/
    ];
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
    const promises: Promise<any>[] = [];
    data.forEach(territory => {
      territory.id = null;
      territory.createdDate = new Date();
      territory.name = 'copia_'.concat(territory.name)
      promises.push(new Promise((resolve, reject) => { this.territoryService.create(territory).subscribe((resp) => { resolve(true) }) }));
      Promise.all(promises).then(() => {
        this.dataUpdatedEvent.next(true);
      });
    });

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
