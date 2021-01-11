import { Component, OnInit } from '@angular/core';
import { BackgroundService, Background } from 'dist/sitmun-frontend-core/';
import { UtilsService } from '../../services/utils.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-background-layers',
  templateUrl: './background-layers.component.html',
  styleUrls: ['./background-layers.component.scss']
})
export class BackgroundLayersComponent implements OnInit {

  dataUpdatedEvent: Subject<boolean> = new Subject <boolean>();
  themeGrid: any = environment.agGridTheme;
  columnDefs: any[];


  constructor(public backgroundService: BackgroundService,
    private utils: UtilsService,
    private router: Router,

  ) {

  }

  ngOnInit() {



    this.columnDefs = [
      {
        headerName: '',
        checkboxSelection: true,
        headerCheckboxSelection: true,
        editable: false,
        filter: false,
        width: 30,
        lockPosition: true,
      },
      {
        headerName: '',
        field: 'id',
        editable: false,
        filter: false,
        width: 35,
        lockPosition: true,
        cellRenderer: 'btnEditRendererComponent',
        cellRendererParams: {
          clicked: this.newData.bind(this)
        },
      },
      { headerName: 'Id', field: 'id', editable: false },
      { headerName: this.utils.getTranslate('backgroundEntity.name'), field: 'name' },
      { headerName: this.utils.getTranslate('backgroundEntity.description'), field: 'description' },
      { headerName: this.utils.getTranslate('backgroundEntity.active'), field: 'active' },
      { headerName: this.utils.getTranslate('backgroundEntity.cartographyGroup'), field: 'cartographyGroupName' }
    ];

  }


 
  getAllBackgroundLayers = () => {

    return this.backgroundService.getAll()
  }

  newData(id: any) {
    this.router.navigate(['backgroundLayers', id, 'backgroundLayersForm']);
  }

  applyChanges(data: Background[]) {
    const promises: Promise<any>[] = [];
    data.forEach(background => {
      promises.push(new Promise((resolve, reject) => {​​​​​​​ this.backgroundService.update(background).toPromise().then((resp) =>{​​​​​​​resolve()}​​​​​​​)}​​​​​​​));
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
      let newCartographyGroup = {
        id: background[`cartographyGroup.id`],
        name: background.cartographyGroupName
      }
      background.cartographyGroup = newCartographyGroup;
      console.log(background);
      promises.push(new Promise((resolve, reject) => {​​​​​​​ this.backgroundService.create(background).toPromise().then((resp) =>{​​​​​​​resolve()}​​​​​​​)}​​​​​​​));
      Promise.all(promises).then(() => {
        this.dataUpdatedEvent.next(true);
      });
    });

  }

  removeData(data: Background[]) {
    const promises: Promise<any>[] = [];
    data.forEach(background => {
      promises.push(new Promise((resolve, reject) => {​​​​​​​ this.backgroundService.delete(background).toPromise().then((resp) =>{​​​​​​​resolve()}​​​​​​​)}​​​​​​​));
      Promise.all(promises).then(() => {
        this.dataUpdatedEvent.next(true);
      });
    });

  }

}
