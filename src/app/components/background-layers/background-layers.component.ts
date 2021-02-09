import { Component, OnInit } from '@angular/core';
import { BackgroundService, Background } from 'dist/sitmun-frontend-core/';
import { UtilsService } from '../../services/utils.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogMessageComponent } from 'dist/sitmun-frontend-gui/';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-background-layers',
  templateUrl: './background-layers.component.html',
  styleUrls: ['./background-layers.component.scss']
})
export class BackgroundLayersComponent implements OnInit {
  saveAgGridStateEvent: Subject<boolean> = new Subject<boolean>();
  dataUpdatedEvent: Subject<boolean> = new Subject <boolean>();
  themeGrid: any = environment.agGridTheme;
  columnDefs: any[];


  constructor(public dialog: MatDialog,
    public backgroundService: BackgroundService,
    private utils: UtilsService,
    private router: Router,
    private http: HttpClient,

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
      { headerName: this.utils.getTranslate('backgroundEntity.name'), field: 'name' },
      { headerName: this.utils.getTranslate('backgroundEntity.description'), field: 'description' },
      { headerName: this.utils.getTranslate('backgroundEntity.active'), field: 'active', editable: false,
      cellRenderer: 'btnCheckboxRendererComponent', floatingFilterComponent: 'btnCheckboxFilterComponent',
      floatingFilterComponentParams: { suppressFilterButton: true }, },
      { headerName: this.utils.getTranslate('backgroundEntity.cartographyGroup'), editable: false, field: 'cartographyGroupName' }
    ];

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
      promises.push(new Promise((resolve, reject) => {​​​​​​​ this.backgroundService.update(background).subscribe((resp) =>{​​​​​​​resolve(true)}​​​​​​​)}​​​​​​​));
      Promise.all(promises).then(() => {
        this.dataUpdatedEvent.next(true);
      });
    });
  }

  add(data: any[]) {
    console.log(data);
    const promises: Promise<any>[] = [];
    data.forEach(background => {
      background.id = null;
      this.http.get(background._links.cartographyGroup.href).subscribe( (cartographyGroup) => {

        background.cartographyGroup = cartographyGroup;
        background.name = 'copia_'.concat(background.name)
        background._links=null;
        console.log(background);
        promises.push(new Promise((resolve, reject) => {​​​​​​​ this.backgroundService.save(background).subscribe((resp) =>{​​​​​​​resolve(true)}​​​​​​​)}​​​​​​​));
        Promise.all(promises).then(() => {
          this.dataUpdatedEvent.next(true);
        });

      });

    });

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
            promises.push(new Promise((resolve, reject) => {​​​​​​​ this.backgroundService.delete(background).subscribe((resp) =>{​​​​​​​resolve(true)}​​​​​​​)}​​​​​​​));
            Promise.all(promises).then(() => {
              this.dataUpdatedEvent.next(true);
            });
          });
       }
      }
    });



  }

}
