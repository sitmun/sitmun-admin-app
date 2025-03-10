import {Component, OnInit} from '@angular/core';
import {CartographyService, Cartography} from '@app/frontend-core/src/lib/public_api';
import {UtilsService} from '@app/services/utils.service';
import {Router} from '@angular/router';
import {config} from '@config';
import {Observable, Subject} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {DialogMessageComponent} from '@app/frontend-gui/src/lib/public_api';

@Component({
  selector: 'app-layers',
  templateUrl: './layers.component.html',
  styles: []
})
export class LayersComponent implements OnInit {
  saveAgGridStateEvent: Subject<boolean> = new Subject<boolean>();
  dataUpdatedEvent: Subject<boolean> = new Subject<boolean>();
  themeGrid: any = config.agGridTheme;
  columnDefs: any[];
  gridModified = false;

  constructor(public dialog: MatDialog,
              public cartographyService: CartographyService,
              private utils: UtilsService,
              private router: Router,
  ) {

  }

  ngOnInit() {

    const columnEditBtn = this.utils.getEditBtnColumnDef();
    columnEditBtn['cellRendererParams'] = {
      clicked: this.newData.bind(this)
    };

    this.columnDefs = [
      columnEditBtn,
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getIdColumnDef(),
      this.utils.getEditableColumnDef('layersEntity.name', 'name', 300),
      {...this.utils.getNonEditableColumnDef('layersEntity.layers', 'layers', 300), ...this.utils.getArrayValueParser()},
      this.utils.getNonEditableColumnDef('layersEntity.serviceName', 'serviceName'),
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

  getAllLayers = () => {
    return this.cartographyService.getAll();
  };

  newData(id: any) {
    this.saveAgGridStateEvent.next(true);
    this.router.navigate(['layers', id, 'layersForm']);
  }

  applyChanges(data: Cartography[]) {
    const promises: Promise<any>[] = [];
    data.forEach(cartography => {
      promises.push(new Promise((resolve) => {
        this.cartographyService.update(cartography).subscribe(() => { resolve(true); });
      }))
      ;
      Promise.all(promises).then(() => {
        this.dataUpdatedEvent.next(true);
      });
    });
  }

  add(data: Cartography[]) {
    this.router.navigate(['layers', -1, 'layersForm', data[0].id]);
  }

  removeData(data: Cartography[]) {

    const dialogRef = this.dialog.open(DialogMessageComponent);
    dialogRef.componentInstance.title = this.utils.getTranslate('caution');
    dialogRef.componentInstance.message = this.utils.getTranslate('removeMessage');
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.event === 'Accept') {
          const promises: Promise<any>[] = [];
          data.forEach(cartography => {
            promises.push(new Promise((resolve,) => {
              this.cartographyService.delete(cartography).subscribe(() => {
                resolve(true);
              });
            }))
            ;
            Promise.all(promises).then(() => {
              this.dataUpdatedEvent.next(true);
            });
          });

        }
      }
    });

  }

}
