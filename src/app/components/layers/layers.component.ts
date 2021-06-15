import { Component, OnInit } from '@angular/core';
import { CartographyService, Cartography, Service } from 'dist/sitmun-frontend-core/';
import { UtilsService } from '../../services/utils.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { config } from 'src/config';
import { Observable, Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogMessageComponent } from 'dist/sitmun-frontend-gui/';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-layers',
  templateUrl: './layers.component.html',
  styleUrls: ['./layers.component.scss']
})
export class LayersComponent implements OnInit {
  saveAgGridStateEvent: Subject<boolean> = new Subject<boolean>();
  dataUpdatedEvent: Subject<boolean> = new Subject <boolean>();
  themeGrid: any = config.agGridTheme;
  columnDefs: any[];
  gridModified = false;

  constructor(public dialog: MatDialog,
    public cartographyService: CartographyService,
    private utils: UtilsService,
    private router: Router,
    private http: HttpClient,
  ) {

  }

  ngOnInit() {

    var columnEditBtn=this.utils.getEditBtnColumnDef();
    columnEditBtn['cellRendererParams']= {
      clicked: this.newData.bind(this)
    }

    this.columnDefs = [
      this.utils.getSelCheckboxColumnDef(),
      columnEditBtn,
      this.utils.getIdColumnDef(),
      this.utils.getEditableColumnDef('layersEntity.name', 'name'),
     //{ headerName: this.utils.getTranslate('layersEntity.serviceName'), field: 'serviceName',editable: false }, //service
      this.utils.getEditableColumnDef('layersEntity.order', 'order'),
      this.utils.getEditableColumnDef('layersEntity.layers', 'layers'),
      this.utils.getDateColumnDef('layersEntity.createdDate', 'createdDate'),
      //{ headerName: this.utils.getTranslate('layersEntity.minimumScale'), field: 'minimumScale' },
      //{ headerName: this.utils.getTranslate('layersEntity.maximumScale'), field: 'maximumScale' },
      //{ headerName: this.utils.getTranslate('layersEntity.metadataURL'), field: 'metadataURL' },
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

  getAllLayers = () => {
    return this.cartographyService.getAll();
  }

  newData(id: any) {
    this.saveAgGridStateEvent.next(true);
    this.router.navigate(['layers', id, 'layersForm']);
  }

  applyChanges(data: Cartography[]) {
    const promises: Promise<any>[] = [];
    data.forEach(cartography => {
      promises.push(new Promise((resolve, reject) => {​​​​​​​ this.cartographyService.update(cartography).subscribe((resp) =>{​​​​​​​resolve(true)}​​​​​​​)}​​​​​​​));
      Promise.all(promises).then(() => {
        this.dataUpdatedEvent.next(true);
      });
    });
  }

  add(data: Cartography[]) {
    this.router.navigate(['layers', -1, 'layersForm', data[0].id]);

    // const promises: Promise<any>[] = [];
    // data.forEach(cartography => {
    //   let newCartography: Cartography = cartography;
    //   this.http.get(cartography._links.service.href).subscribe( (result:Service) => {
    //     newCartography.id = null;
    //     newCartography.service=result;
    //     newCartography.createdDate = new Date();
    //     newCartography._links = null;
    //     newCartography.name = this.utils.getTranslate('copy_').concat(newCartography.name)
    //     console.log(newCartography);
    //     promises.push(new Promise((resolve, reject) => {​​​​​​​ this.cartographyService.save(newCartography).subscribe((resp) =>{​​​​​​​resolve(true)}​​​​​​​)}​​​​​​​));
    //     Promise.all(promises).then(() => {
    //       this.dataUpdatedEvent.next(true);
    //     });
    //   }, error => {
    //     console.log(error);
    //   })

    // });

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
            promises.push(new Promise((resolve, reject) => {​​​​​​​ this.cartographyService.delete(cartography).subscribe((resp) =>{​​​​​​​resolve(true)}​​​​​​​)}​​​​​​​));
            Promise.all(promises).then(() => {
              this.dataUpdatedEvent.next(true);
            });
          });
      
       }
      }
    });

  }

}
