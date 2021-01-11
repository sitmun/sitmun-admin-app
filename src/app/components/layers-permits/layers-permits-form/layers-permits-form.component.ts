import { Component, OnInit } from '@angular/core';
import { tick } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CartographyGroupService, RoleService, Role, CartographyService } from 'dist/sitmun-frontend-core/';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from '../../../services/utils.service';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { DialogGridComponent } from 'dist/sitmun-frontend-gui/';
import { MatDialog } from '@angular/material/dialog';

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
  columnDefsRoles: any[];

  //Dialog
  columnDefsRolesDialog: any[];
  columnDefsCartographiesDialog: any[];

  constructor(
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cartographyGroupService: CartographyGroupService,
    private cartographyService: CartographyService,
    private roleService: RoleService,
    private http: HttpClient,
    private utils: UtilsService,
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
      {
        headerName: '',
        checkboxSelection: true,
        headerCheckboxSelection: true,
        editable: false,
        filter: false,
        width: 20,
        lockPosition: true,
      },
      { headerName: 'Id', field: 'id', editable: false },
      { headerName: this.utils.getTranslate('layersPermitsEntity.name'), field: 'name' },
    ];


    this.columnDefsRoles = [
      {
        headerName: '',
        checkboxSelection: true,
        headerCheckboxSelection: true,
        editable: false,
        filter: false,
        width: 20,
        lockPosition: true,
      },
      { headerName: 'Id', field: 'id', editable: false },
      { headerName: this.utils.getTranslate('layersPermitsEntity.name'), field: 'name' },
    ];

    this.columnDefsCartographiesDialog = [
      {
        headerName: '',
        checkboxSelection: true,
        headerCheckboxSelection: true,
        editable: false,
        filter: false,
        width: 50,
        lockPosition:true,
      },
      { headerName: 'ID', field: 'id', editable: false },
      { headerName: this.utils.getTranslate('connectionEntity.name'), field: 'name', editable: false },
    ];

    this.columnDefsRolesDialog = [
      {
        headerName: '',
        checkboxSelection: true,
        headerCheckboxSelection: true,
        editable: false,
        filter: false,
        width: 20,
        lockPosition: true,
      },
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

  addNewConnection() {
    console.log(this.formLayersPermits.value);
    this.cartographyGroupService.create(this.formLayersPermits.value)
      .subscribe(resp => {
        console.log(resp);
        // this.router.navigate(["/company", resp.id, "formConnection"]);
      });


  }

  updateConnection() {

    console.log(this.formLayersPermits.value);

    this.cartographyGroupService.update(this.formLayersPermits.value)
      .subscribe(resp => {
        console.log(resp);

      });

  }


  // AG GRID

  // ******** Cartographies configuration ******** //
  getAllCartographies = () => {
    
    return (this.http.get(`${this.formLayersPermits.value._links.members.href}`))
     .pipe( map( data =>  data['_embedded']['cartographies']) );

  }

  removeDataCartographies(data: Role[]) {
    console.log(data);
  }

  newDataCartographies(id: any) {
    this.router.navigate(['role', id, 'roleForm']);
  }

  applyChangesCartographies(data: Role[]) {
    console.log(data);
  }


  // ******** Roles  ******** //
  getAllRoles = () => {
   
    return (this.http.get(`${this.formLayersPermits.value._links.roles.href}`))
       .pipe(map(data => data['_embedded']['roles']));

  }

  removeDataRole(data: Role[]) {
    console.log(data);
  }

  newDataRole(id: any) {
    this.router.navigate(['role', id, 'roleForm']);
  }

  applyChangesRole(data: Role[]) {
    console.log(data);
  }

  // ******** Cartography Dialog  ******** //

  getAllCartographiesDialog = () => {
    return this.cartographyService.getAll();
  }

  openCartographyDialog(data: any) {
    // const getAlls: Array<() => Observable<any>> = [this.getAllCartographiesDialog];
    // const colDefsTable: Array<any[]> = [this.columnDefsCartographiesDialog];
    // const singleSelectionTable: Array<boolean> = [false];
    // const titlesTable: Array<string> = ['Cartographies'];
    const dialogRef = this.dialog.open(DialogGridComponent);
    dialogRef.componentInstance.getAllsTable=[this.getAllCartographiesDialog];
    dialogRef.componentInstance.singleSelectionTable=[false];
    dialogRef.componentInstance.columnDefsTable=[this.columnDefsCartographiesDialog];
    dialogRef.componentInstance.themeGrid=this.themeGrid;
    dialogRef.componentInstance.title='Cartographies';
    dialogRef.componentInstance.titlesTable=['Cartographies'];
    dialogRef.componentInstance.nonEditable=false;
    


    dialogRef.afterClosed().subscribe(result => {
      if(result){
        if( result.event==='Add') {console.log(result.data); }
      }

    });

  }

   // ******** Roles Dialog  ******** //

   getAllRolesDialog = () => {
    return this.roleService.getAll();
  }

  openRolesDialog(data: any) {
    // const getAlls: Array<() => Observable<any>> = [this.getAllCartographiesDialog];
    // const colDefsTable: Array<any[]> = [this.columnDefsCartographiesDialog];
    // const singleSelectionTable: Array<boolean> = [false];
    // const titlesTable: Array<string> = ['Cartographies'];
    const dialogRef = this.dialog.open(DialogGridComponent);
    dialogRef.componentInstance.getAllsTable=[this.getAllRolesDialog];
    dialogRef.componentInstance.singleSelectionTable=[false];
    dialogRef.componentInstance.columnDefsTable=[this.columnDefsRolesDialog];
    dialogRef.componentInstance.themeGrid=this.themeGrid;
    dialogRef.componentInstance.title='Roles';
    dialogRef.componentInstance.titlesTable=['Roles'];
    dialogRef.componentInstance.nonEditable=false;
    


    dialogRef.afterClosed().subscribe(result => {
      if(result){
        if( result.event==='Add') {console.log(result.data); }
      }

    });

  }

  

}


