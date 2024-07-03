import { Component, OnInit } from '@angular/core';
import { tick } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CartographyGroupService, RoleService, Role, CartographyService,Cartography } from '../../../frontend-core/src/lib/public_api';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from '../../../services/utils.service';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { config } from 'src/config';
import { DialogGridComponent } from '../../../frontend-gui/src/lib/public_api';
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
  duplicateID = -1;
  themeGrid: any = config.agGridTheme;
  permissionGroupTypes: Array<any> = [];
  dataLoaded: Boolean = false;

  //Grids
  columnDefsCartographies: any[];
  getAllElementsEventCartographies: Subject<string> = new Subject <string>();
  dataUpdatedEventCartographies: Subject<boolean> = new Subject<boolean>();

  columnDefsRoles: any[];
  getAllElementsEventRoles: Subject<string> = new Subject <string>();
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

    const promises: Promise<any>[] = [];
	
    promises.push(new Promise((resolve, reject) => {
      this.utils.getCodeListValues('cartographyPermission.type').subscribe(
        resp => {
          this.permissionGroupTypes.push(...resp);
          resolve(true);
        }
      );
    }));


    Promise.all(promises).then(() => {
      this.activatedRoute.params.subscribe(params => {
        this.layersPermitsID = +params.id;
        if(params.idDuplicate) { this.duplicateID = +params.idDuplicate; }
      
        if (this.layersPermitsID !== -1 || this.duplicateID != -1) {
          let idToGet = this.layersPermitsID !== -1? this.layersPermitsID: this.duplicateID  
      
          console.log(this.layersPermitsID);
  
          this.cartographyGroupService.get(idToGet).subscribe(
            resp => {
              console.log(resp);
              this.layersPermitsToEdit = resp;
              this.formLayersPermits.patchValue({
                type: this.layersPermitsToEdit.type,
                _links: this.layersPermitsToEdit._links
              });

              if(this.layersPermitsID !== -1){
                this.formLayersPermits.patchValue({
                id: this.layersPermitsID,
                name: this.layersPermitsToEdit.name,
                });
                  }
              else{
                this.formLayersPermits.patchValue({
                name: this.utils.getTranslate('copy_').concat(this.layersPermitsToEdit.name),
                });
              }
  
              this.dataLoaded = true;
            },
            error => {
  
            }
          );
        }
        else {
          this.formLayersPermits.patchValue({
            type: this.permissionGroupTypes[0].value
          })
          this.dataLoaded = true;
        }
  
      },
        error => {
  
        });
    });


    this.columnDefsCartographies = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getIdColumnDef(),
      this.utils.getEditableColumnDef('layersPermitsEntity.name', 'name'),
      this.utils.getStatusColumnDef()
    ];


    this.columnDefsRoles = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getIdColumnDef(),
      this.utils.getEditableColumnDef('layersPermitsEntity.name', 'name'),
      this.utils.getStatusColumnDef()
    ];

    this.columnDefsCartographiesDialog = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getIdColumnDef(),
      this.utils.getNonEditableColumnDef('layersPermitsEntity.name', 'name'),
      this.utils.getNonEditableColumnDef('treesEntity.serviceName', 'serviceName'),
    ];

    this.columnDefsRolesDialog = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getIdColumnDef(),
      this.utils.getEditableColumnDef('layersPermitsEntity.name', 'name'),
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

    if (this.layersPermitsID == -1 && this.duplicateID == -1) 
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

  getAllRowsCartographies(event){
    if(event.event == "save"){
      this.saveCartographies(event.data);
    }
  }


  saveCartographies(data: any[] )
  {
    let dataChanged = false;
    const promises: Promise<any>[] = [];
    let cartographiesToPut = [];
    data.forEach(cartography => {
      if(cartography.status!== 'pendingDelete') {
        if (cartography.status === 'pendingModify') {
          if(cartography.newItem){ dataChanged = true; }
          promises.push(new Promise((resolve, reject) => { this.cartographyService.update(cartography).subscribe((resp) => { resolve(true) }) }));
        }
        else if (cartography.status === 'pendingCreation') {
          dataChanged = true;
        }
        cartographiesToPut.push(cartography._links.self.href) 
      }
      else {
        dataChanged = true;
      }
    });
    Promise.all(promises).then(() => {
      if(dataChanged){
        let url=this.layersPermitsToEdit._links.members.href.split('{', 1)[0];
        this.utils.updateUriList(url,cartographiesToPut, this.dataUpdatedEventCartographies)
      }
      else { this.dataUpdatedEventCartographies.next(true) }
    });
  }

  // ******** Roles  ******** //
  getAllRoles = () => {

    if (this.layersPermitsID == -1 && this.duplicateID == -1) 
    {
      const aux: Array<any> = [];
      return of(aux);
    }

    var urlReq = `${this.layersPermitsToEdit._links.roles.href}`
    if (this.layersPermitsToEdit._links.roles.templated) {
      var url = new URL(urlReq.split("{")[0]);
      url.searchParams.append("projection", "view")
      urlReq = url.toString();
    }
   
    return (this.http.get(urlReq))
       .pipe(map(data => data['_embedded']['roles']));

  }

  getAllRowsRoles(event){
    if(event.event == "save"){
      this.saveRoles(event.data);
    }
  }

  saveRoles(data: any[] )
  {
    let dataChanged = false;
    const promises: Promise<any>[] = [];
    let rolesToPut = [];
    data.forEach(role => {
      if(role.status!== 'pendingDelete') {
        if (role.status === 'pendingModify') {
          if(role.newItem){ dataChanged = true; }
          promises.push(new Promise((resolve, reject) => { this.roleService.update(role).subscribe((resp) => { resolve(true) }) }));

        }
        else if(role.status === 'pendingCreation'){
          dataChanged = true;
        }
        rolesToPut.push(role._links.self.href)
      }
      else{
        dataChanged = true;
      }
    });
    Promise.all(promises).then(() => {
      if(dataChanged)
      {
        let url=this.layersPermitsToEdit._links.roles.href.split('{', 1)[0];
        this.utils.updateUriList(url,rolesToPut, this.dataUpdatedEventRoles)
      }
      else { this.dataUpdatedEventRoles.next(true) }
    });
  }

  // ******** Cartography Dialog  ******** //

  getAllCartographiesDialog = () => {
    return this.cartographyService.getAll();
  }

  openCartographyDialog(data: any) {
    const dialogRef = this.dialog.open(DialogGridComponent, {panelClass:'gridDialogs'});
    dialogRef.componentInstance.orderTable = ['name'];
    dialogRef.componentInstance.getAllsTable=[this.getAllCartographiesDialog];
    dialogRef.componentInstance.singleSelectionTable=[false];
    dialogRef.componentInstance.columnDefsTable=[this.columnDefsCartographiesDialog];
    dialogRef.componentInstance.themeGrid=this.themeGrid;
    dialogRef.componentInstance.title=this.utils.getTranslate('layersPermitsEntity.cartographiesConfiguration');
    dialogRef.componentInstance.currentData=[data];
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
    dialogRef.componentInstance.orderTable = ['name'];
    dialogRef.componentInstance.getAllsTable=[this.getAllRolesDialog];
    dialogRef.componentInstance.singleSelectionTable=[false];
    dialogRef.componentInstance.columnDefsTable=[this.columnDefsRolesDialog];
    dialogRef.componentInstance.themeGrid=this.themeGrid;
    dialogRef.componentInstance.title=this.utils.getTranslate('layersPermitsEntity.roles');
    dialogRef.componentInstance.currentData=[data];
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

    if(this.formLayersPermits.value.type)

    if(this.formLayersPermits.valid)
    {

      if (this.layersPermitsID == -1 && this.duplicateID != -1) {
        this.formLayersPermits.patchValue({
          _links: null
        })
      }

        this.cartographyGroupService.save(this.formLayersPermits.value)
        .subscribe(resp => {
          console.log(resp);
          this.layersPermitsToEdit=resp;
          this.layersPermitsID=resp.id
          this.formLayersPermits.patchValue({
            id: resp.id,
            _links: resp._links
          })
          this.getAllElementsEventCartographies.next('save');
          this.getAllElementsEventRoles.next('save');
        },
        error => {
          console.log(error);
        });
    }
    else {
      this.utils.showRequiredFieldsError();
    }

  }

  

}


