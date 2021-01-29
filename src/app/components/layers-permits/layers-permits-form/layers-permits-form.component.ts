import { Component, OnInit } from '@angular/core';
import { tick } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CartographyGroupService, RoleService, Role, CartographyService,Cartography } from '@sitmun/frontend-core';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from '../../../services/utils.service';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { DialogGridComponent } from 'dist/sitmun-frontend-gui/';
import { MatDialog } from '@angular/material/dialog';
import { of, Subject } from 'rxjs';

@Component({
  selector: 'app-layers-permits-form',
  templateUrl: './layers-permits-form.component.html',
  styleUrls: ['./layers-permits-form.component.scss']
})
export class LayersPermitsFormComponent implements OnInit {
 
  //Form
  formLayersPermits: FormGroup;
  layersPermitsToEdit;
  layersPermitsID = -1;
  themeGrid: any = environment.agGridTheme;
  permissionGroupTypes: Array<any> = [];
  dataLoaded: Boolean = false;

  //Grids
  columnDefsCartographies: any[];
  getAllElementsEventCartographies: Subject<boolean> = new Subject <boolean>();
  dataUpdatedEventCartographies: Subject<boolean> = new Subject<boolean>();

  columnDefsRoles: any[];
  getAllElementsEventRoles: Subject<boolean> = new Subject <boolean>();
  dataUpdatedEventRoles: Subject<boolean> = new Subject<boolean>();

  //Dialog
  columnDefsRolesDialog: any[];
  addElementsEventRoles: Subject<any[]> = new Subject <any[]>();
  columnDefsCartographiesDialog: any[];
  addElementsEventCartographies: Subject<any[]> = new Subject <any[]>();

  constructor(
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cartographyGroupService: CartographyGroupService,
    private cartographyService: CartographyService,
    private roleService: RoleService,
    private http: HttpClient,
    public utils: UtilsService,
  ) {
    this.initializeLayersPermitsForm();
  }

  ngOnInit(): void {
    let permissionGroupTypesByDefault = {
      value: null,
      description: '------'
    }
    this.permissionGroupTypes.push(permissionGroupTypesByDefault);

    this.utils.getCodeListValues('cartographyPermission.type').subscribe(
      resp => {
        this.permissionGroupTypes.push(...resp);
      }
    );
    this.activatedRoute.params.subscribe(params => {
      this.layersPermitsID = +params.id;
      if (this.layersPermitsID !== -1) {
        console.log(this.layersPermitsID);

        this.cartographyGroupService.get(this.layersPermitsID).subscribe(
          resp => {
            console.log(resp);
            this.layersPermitsToEdit = resp;
            this.formLayersPermits.setValue({
              id: this.layersPermitsID,
              name: this.layersPermitsToEdit.name,
              type: this.layersPermitsToEdit.type,
              _links: this.layersPermitsToEdit._links
            });

            this.dataLoaded = true;
          },
          error => {

          }
        );
      }

    },
      error => {

      });



    this.columnDefsCartographies = [
      environment.selCheckboxColumnDef,
      { headerName: 'Id', field: 'id', editable: false },
      { headerName: this.utils.getTranslate('layersPermitsEntity.name'), field: 'name' },
      { headerName: this.utils.getTranslate('layersPermitsEntity.status'), field: 'status', editable:false },
    ];


    this.columnDefsRoles = [
      environment.selCheckboxColumnDef,
      { headerName: 'Id', field: 'id', editable: false },
      { headerName: this.utils.getTranslate('layersPermitsEntity.name'), field: 'name' },
      { headerName: this.utils.getTranslate('layersPermitsEntity.status'), field: 'status', editable:false },
    ];

    this.columnDefsCartographiesDialog = [
      environment.selCheckboxColumnDef,
      { headerName: 'ID', field: 'id', editable: false },
      { headerName: this.utils.getTranslate('connectionEntity.name'), field: 'name', editable: false },
    ];

    this.columnDefsRolesDialog = [
      environment.selCheckboxColumnDef,
      { headerName: 'Id', field: 'id', editable: false },
      { headerName: this.utils.getTranslate('layersPermitsEntity.name'), field: 'name' },
    ];
  }


  initializeLayersPermitsForm(): void {

    this.formLayersPermits = new FormGroup({
      id: new FormControl(null, []),
      name: new FormControl(null, [
        Validators.required,
      ]),
      type: new FormControl(null, [
        Validators.required,
      ]),
      _links: new FormControl(null, []),

    })

  }

  // AG GRID

  // ******** Cartographies configuration ******** //
  getAllCartographies = () => {

    if(this.layersPermitsID == -1)
    {
      const aux: Array<any> = [];
      return of(aux);
    }

     var urlReq = `${this.layersPermitsToEdit._links.members.href}`
     if (this.layersPermitsToEdit._links.members.templated) {
       var url = new URL(urlReq.split("{")[0]);
       url.searchParams.append("projection", "view")
       urlReq = url.toString();
     }
     return (this.http.get(urlReq))
     .pipe(map(data => data['_embedded']['cartographies']));

  }


  getAllRowsCartographies(data: any[] )
  {
    let cartographiesModified = [];
    let cartographiesToPut = [];
    data.forEach(cartography => {
      if (cartography.status === 'Modified') {cartographiesModified.push(cartography) }
      if(cartography.status!== 'Deleted') {cartographiesToPut.push(cartography._links.self.href) }
    });
    console.log(cartographiesModified);
    this.updateCartographies(cartographiesModified, cartographiesToPut);
  }

  updateCartographies(cartographiesModified: Cartography[], cartographiesToPut: Cartography[])
  {
    const promises: Promise<any>[] = [];
    cartographiesModified.forEach(cartography => {
      promises.push(new Promise((resolve, reject) => { this.cartographyService.update(cartography).toPromise().then((resp) => { resolve() }) }));
    });
    Promise.all(promises).then(() => {
      let url=this.layersPermitsToEdit._links.members.href.split('{', 1)[0];
      this.utils.updateUriList(url,cartographiesToPut, this.dataUpdatedEventCartographies)
    });
  }




  // ******** Roles  ******** //
  getAllRoles = () => {

    if(this.layersPermitsID == -1)
    {
      const aux: Array<any> = [];
      return of(aux);
    }
   
    return (this.http.get(`${this.formLayersPermits.value._links.roles.href}`))
       .pipe(map(data => data['_embedded']['roles']));

  }

  getAllRowsRoles(data: any[] )
  {
    let rolesModified = [];
    let rolesToPut = [];
    data.forEach(role => {
      if (role.status === 'Modified') {rolesModified.push(role) }
      if(role.status!== 'Deleted') {rolesToPut.push(role._links.self.href) }
    });
    console.log(rolesModified);
    this.updateRoles(rolesModified, rolesToPut);
  }

  updateRoles(rolesModified: Role[], rolesToPut: Role[])
  {
    const promises: Promise<any>[] = [];
    rolesModified.forEach(role => {
      promises.push(new Promise((resolve, reject) => { this.roleService.update(role).toPromise().then((resp) => { resolve() }) }));
    });
    Promise.all(promises).then(() => {
      let url=this.layersPermitsToEdit._links.roles.href.split('{', 1)[0];
      this.utils.updateUriList(url,rolesToPut, this.dataUpdatedEventRoles)
    });
  }


  // ******** Cartography Dialog  ******** //

  getAllCartographiesDialog = () => {
    return this.cartographyService.getAll();
  }

  openCartographyDialog(data: any) {
    const dialogRef = this.dialog.open(DialogGridComponent, {panelClass:'gridDialogs'});
    dialogRef.componentInstance.getAllsTable=[this.getAllCartographiesDialog];
    dialogRef.componentInstance.singleSelectionTable=[false];
    dialogRef.componentInstance.columnDefsTable=[this.columnDefsCartographiesDialog];
    dialogRef.componentInstance.themeGrid=this.themeGrid;
    dialogRef.componentInstance.title=this.utils.getTranslate('layersPermitsEntity.cartographiesConfiguration');
    dialogRef.componentInstance.titlesTable=[''];
    dialogRef.componentInstance.nonEditable=false;
    


    dialogRef.afterClosed().subscribe(result => {
      if(result){
        if( result.event==='Add') { 
          this.addElementsEventCartographies.next(result.data[0])
        }
      }

    });

  }

   // ******** Roles Dialog  ******** //

   getAllRolesDialog = () => {
    return this.roleService.getAll();
  }

  openRolesDialog(data: any) {

    const dialogRef = this.dialog.open(DialogGridComponent, {panelClass:'gridDialogs'});
    dialogRef.componentInstance.getAllsTable=[this.getAllRolesDialog];
    dialogRef.componentInstance.singleSelectionTable=[false];
    dialogRef.componentInstance.columnDefsTable=[this.columnDefsRolesDialog];
    dialogRef.componentInstance.themeGrid=this.themeGrid;
    dialogRef.componentInstance.title=this.utils.getTranslate('layersPermitsEntity.roles');
    dialogRef.componentInstance.titlesTable=[''];
    dialogRef.componentInstance.nonEditable=false;
    


    dialogRef.afterClosed().subscribe(result => {
      if(result){
        if( result.event==='Add') { 
          this.addElementsEventRoles.next(result.data[0])
        }
      }

    });

  }


  // Save Button

  onSaveButtonClicked(){

    this.cartographyGroupService.save(this.formLayersPermits.value)
    .subscribe(resp => {
      console.log(resp);
      this.layersPermitsToEdit=resp;
      this.getAllElementsEventCartographies.next(true);
      this.getAllElementsEventRoles.next(true);
    },
    error => {
      console.log(error);
    });


  }

  

}


