import { Component, OnInit } from '@angular/core';
import { TerritoryService,Territory } from 'dist/sitmun-frontend-core/';
import { UtilsService } from '../../services/utils.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
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
  themeGrid: any = environment.agGridTheme;
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

    var columnEditBtn=environment.editBtnColumnDef;
    columnEditBtn['cellRendererParams']= {
      clicked: this.newData.bind(this)
    }


    this.columnDefs = [
      environment.selCheckboxColumnDef,
      columnEditBtn,
      { headerName: 'Id', field: 'id', editable: false },
      { headerName: this.utils.getTranslate('territoryEntity.code'), field: 'code' },
      { headerName: this.utils.getTranslate('territoryEntity.name'), field: 'name' },
      {
        headerName: this.utils.getTranslate('territoryEntity.scope'),
        valueGetter: (params) => {
          var alias = this.scopeTypes.filter((type) => type.value == params.data.scope)[0];
          return alias != undefined ? alias.description : params.data.scope
        }
      },
      {
        headerName: this.utils.getTranslate('territoryEntity.createdDate'), field: 'createdDate',
        filter: 'agDateColumnFilter', filterParams: this.utils.getDateFilterParams(),
        editable: false, cellRenderer: (data) => { return this.utils.getDateFormated(data) }
      }, // type: 'dateColumn'
      { headerName: this.utils.getTranslate('territoryEntity.administrator'), field: 'territorialAuthorityName' },
      { headerName: this.utils.getTranslate('territoryEntity.email'), field: 'territorialAuthorityEmail' },
      { headerName: this.utils.getTranslate('territoryEntity.address'), field: 'territorialAuthorityAddress' },
      { headerName: this.utils.getTranslate('territoryEntity.extent'), field: 'extent' },
      { headerName: this.utils.getTranslate('territoryEntity.note'), field: 'note' },
      { headerName: this.utils.getTranslate('territoryEntity.blocked'), field: 'blocked', editable: false,
      cellRenderer: 'btnCheckboxRendererComponent', floatingFilterComponent: 'btnCheckboxFilterComponent',
      floatingFilterComponentParams: { suppressFilterButton: true }, },
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
