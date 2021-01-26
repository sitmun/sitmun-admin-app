import { Component, OnInit } from '@angular/core';
import { CartographyService, Cartography } from '@sitmun/frontend-core';
import { UtilsService } from '../../services/utils.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogMessageComponent } from 'dist/sitmun-frontend-gui/';

@Component({
  selector: 'app-layers',
  templateUrl: './layers.component.html',
  styleUrls: ['./layers.component.scss']
})
export class LayersComponent implements OnInit {

  dataUpdatedEvent: Subject<boolean> = new Subject <boolean>();
  themeGrid: any = environment.agGridTheme;
  columnDefs: any[];

  constructor(public dialog: MatDialog,
    public cartographyService: CartographyService,
    private utils: UtilsService,
    private router: Router,
  ) {

  }

  ngOnInit() {

    var columnEditBtn=environment.editBtnColumnDef;
    columnEditBtn['cellRendererParams']= {
      clicked: this.newData.bind(this)
    }

    this.columnDefs = [
      environment.selCheckboxColumnDef,
      columnEditBtn,
      { headerName: 'Id', field: 'id', editable: false },
      { headerName: this.utils.getTranslate('layersEntity.name'), field: 'name' },
      { headerName: this.utils.getTranslate('layersEntity.serviceName'), field: 'serviceName',editable: false }, //service
      { headerName: this.utils.getTranslate('layersEntity.order'), field: 'order' },
      { headerName: this.utils.getTranslate('layersEntity.layers'), field: 'layers' },
      { headerName: this.utils.getTranslate('layersEntity.createdDate'), field: 'createdDate' }, // type: 'dateColumn'
      { headerName: this.utils.getTranslate('layersEntity.minimumScale'), field: 'minimumScale' },
      { headerName: this.utils.getTranslate('layersEntity.maximumScale'), field: 'maximumScale' },
      { headerName: this.utils.getTranslate('layersEntity.metadataURL'), field: 'metadataURL' },
    ];

  }

  getAllLayers = () => {
    return this.cartographyService.getAll();
  }

  newData(id: any) {
    this.router.navigate(['layers', id, 'layersForm']);
  }

  applyChanges(data: Cartography[]) {
    const promises: Promise<any>[] = [];
    data.forEach(cartography => {
      promises.push(new Promise((resolve, reject) => {​​​​​​​ this.cartographyService.update(cartography).toPromise().then((resp) =>{​​​​​​​resolve()}​​​​​​​)}​​​​​​​));
      Promise.all(promises).then(() => {
        this.dataUpdatedEvent.next(true);
      });
    });
  }

  add(data: Cartography[]) {
    const promises: Promise<any>[] = [];
    data.forEach(cartography => {
      cartography.id = null;
      console.log(cartography);
      promises.push(new Promise((resolve, reject) => {​​​​​​​ this.cartographyService.create(cartography).toPromise().then((resp) =>{​​​​​​​resolve()}​​​​​​​)}​​​​​​​));
      Promise.all(promises).then(() => {
        this.dataUpdatedEvent.next(true);
      });
    });

  }

  removeData(data: Cartography[]) {

    const dialogRef = this.dialog.open(DialogMessageComponent);
    dialogRef.componentInstance.title=this.utils.getTranslate("caution");
    dialogRef.componentInstance.message=this.utils.getTranslate("removeMessage");
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        if(result.event==='Accept') {  
          const promises: Promise<any>[] = [];
          data.forEach(cartography => {
            promises.push(new Promise((resolve, reject) => {​​​​​​​ this.cartographyService.delete(cartography).toPromise().then((resp) =>{​​​​​​​resolve()}​​​​​​​)}​​​​​​​));
            Promise.all(promises).then(() => {
              this.dataUpdatedEvent.next(true);
            });
          });
      
       }
      }
    });

  }

}
