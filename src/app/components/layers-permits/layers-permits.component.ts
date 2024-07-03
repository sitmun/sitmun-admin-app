import { Component, OnInit } from '@angular/core';
import { CartographyGroupService, CartographyGroup, HalParam, HalOptions } from '../../frontend-core/src/lib/public_api';
import { UtilsService } from '../../services/utils.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { config } from 'src/config';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogMessageComponent } from '../../frontend-gui/src/lib/public_api';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-layers-permits',
  templateUrl: './layers-permits.component.html',
  styleUrls: ['./layers-permits.component.scss']
})
export class LayersPermitsComponent implements OnInit {
  saveAgGridStateEvent: Subject<boolean> = new Subject<boolean>();
  dataUpdatedEvent: Subject<boolean> = new Subject<boolean>();
  themeGrid: any = config.agGridTheme;
  columnDefs: any[];
  gridModified = false;

  permissionGroupTypes: Array<any> = [];

  constructor(public dialog: MatDialog,
    public cartographyGroupService: CartographyGroupService,
    private utils: UtilsService,
    private router: Router
  ) {

  }

  ngOnInit() {

    this.utils.getCodeListValues('cartographyPermission.type').subscribe(
      resp => {
        this.permissionGroupTypes.push(...resp);
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
      this.utils.getEditableColumnDef('layersPermitsEntity.name', 'name'),
      this.utils.getFormattedColumnDef('layersPermitsEntity.type',this.permissionGroupTypes,'type')
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

  getAllLayersPermits = () => {
    let params2: HalParam[] = [];
    let param: HalParam[]= [{ key: 'type', value: 'I' }, { key: 'type', value: 'C' }, { key: 'type', value: 'M' }]
    params2.push(...param);
    let query: HalOptions = { params: params2 };
    return this.cartographyGroupService.getAll(query,null,null,true);
  }

  newData(id: any) {
    this.saveAgGridStateEvent.next(true);
    this.router.navigate(['layersPermits', id, 'layersPermitsForm']);
  }

  applyChanges(data: CartographyGroup[]) {
    const promises: Promise<any>[] = [];
    data.forEach(cartographyGroup => {
      promises.push(new Promise((resolve, reject) => { this.cartographyGroupService.update(cartographyGroup).subscribe((resp) => { resolve(true) }) }));
      Promise.all(promises).then(() => {
        this.dataUpdatedEvent.next(true);
      });
    });
  }

  add(data: CartographyGroup[]) {
    this.router.navigate(['layersPermits', -1, 'layersPermitsForm', data[0].id]);
  }

  removeData(data: CartographyGroup[]) {
    const dialogRef = this.dialog.open(DialogMessageComponent);
    dialogRef.componentInstance.title=this.utils.getTranslate("caution");
    dialogRef.componentInstance.message=this.utils.getTranslate("removeMessage");
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        if(result.event==='Accept') {  
          const promises: Promise<any>[] = [];
          data.forEach(cartographyGroup => {
            promises.push(new Promise((resolve, reject) => { this.cartographyGroupService.delete(cartographyGroup).subscribe((resp) => { resolve(true) }) }));
            Promise.all(promises).then(() => {
              this.dataUpdatedEvent.next(true);
            });
          });
      
       }
      }
    });

  }

}
