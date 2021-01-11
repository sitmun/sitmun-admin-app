import { Component, OnInit } from '@angular/core';
import { tick } from '@angular/core/testing';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators  } from '@angular/forms';
import {  ActivatedRoute,  Router} from '@angular/router';
import { UserService, UserConfigurationService, TerritoryService, RoleService, HalOptions, HalParam, Territory, User, UserConfiguration } from 'dist/sitmun-frontend-core/';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from '../../../services/utils.service';
import { map } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DialogGridComponent } from 'dist/sitmun-frontend-gui/';
import { MatDialog } from '@angular/material/dialog';
import { Role } from 'dist/sitmun-frontend-core/role/role.model';





@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
}) 
export class UserFormComponent implements OnInit {

  
 
  //Form
  userForm: FormGroup;
  userToEdit: User;
  userID = -1;
  dataLoaded: Boolean = false;
  
  //Grids
  themeGrid:any=environment.agGridTheme;
  columnDefsPermissions: any[];
  columnDefsData: any[];

  //Dialog

  columnDefsTerritoryDialog: any[];
  columnDefsRolesDialog: any[];
  columnDefsTerritoryDataDialog: any[];

  //Save button
  territorisToUpdate: Territory[] = [];
  rolesToUpdate: Role[] = [];
  dataUpdatedEvent: Subject<boolean> = new Subject <boolean>();


  
  constructor(
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private http: HttpClient,
    private utils: UtilsService,
    private userConfigurationService: UserConfigurationService,
    private roleService: RoleService,
    private territoryService: TerritoryService,
    ) {
        this.initializeUserForm();
    }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.userID = +params.id;
      if (this.userID !== -1){
        console.log(this.userID);

        this.userService.get(this.userID).subscribe(
          resp => {
            console.log(resp);
            this.userToEdit=resp;
            this.userForm.setValue({
                id:            this.userID,
                username:          this.userToEdit.username,
                firstName:     this.userToEdit.firstName,
                lastName:     this.userToEdit.firstName,
                password:      this.userToEdit.password,
                confirmPassword:      "",
                administrator: this.userToEdit.administrator,
                blocked:           this.userToEdit.blocked,
                _links:        this.userToEdit._links
              });

            this.dataLoaded = true;
          },
          error => {

          }
        );
      }
      else {
        this.userForm.patchValue({
          administrator: false,
          blocked: false
        });
      }

    },
    error => {

    });


    this.columnDefsPermissions = [

      {
        headerName: '',
        checkboxSelection: true,
        headerCheckboxSelection: true,
        editable: false,
        filter: false,
        width: 25,
        lockPosition:true,
      },
      { headerName: 'Id', field: 'id', editable: false },
      { headerName: this.utils.getTranslate('userEntity.territory'),  field: 'territory'},
      { headerName: this.utils.getTranslate('userEntity.role'),  field: 'role', },

    ];

    this.columnDefsData = [

      {
        headerName: '',
        checkboxSelection: true,
        headerCheckboxSelection: true,
        editable: false,
        filter: false,
        width: 50,
        lockPosition:true,
      },
      { headerName: this.utils.getTranslate('userEntity.territory'),  field: 'territoryName'},
      { headerName: this.utils.getTranslate('userEntity.position'),  field: 'name' },
      { headerName: this.utils.getTranslate('userEntity.organization'),  field: 'organization'},
      { headerName: this.utils.getTranslate('userEntity.mail'),  field: 'email' },
      { headerName: this.utils.getTranslate('userEntity.expirationDate'),  field: 'expirationDate'},
      { headerName: this.utils.getTranslate('userEntity.dataCreated'),  field: 'createdDate',  /*filter: 'agDateColumnFilter',*/cellRenderer: (data) => {
        return data.value ? (new Date(data.value)).toLocaleDateString() : '';
      }  
    },

    ];

    this.columnDefsTerritoryDialog = [
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
      { headerName: this.utils.getTranslate('userEntity.code'), field: 'code', editable: false },
      { headerName: this.utils.getTranslate('userEntity.name'), field: 'name', editable: false },
    ];

    this.columnDefsRolesDialog = [
      {
        headerName: '',
        checkboxSelection: true,
        headerCheckboxSelection: true,
        editable: false,
        filter: false,
        width: 50,
        lockPosition:true,
      },
      { headerName: this.utils.getTranslate('userEntity.code'), field: 'code', editable: false },
      { headerName: this.utils.getTranslate('userEntity.name'), field: 'name', editable: false },
    ];

    this.columnDefsTerritoryDataDialog = [
      {
        headerName: '',
        checkboxSelection: true,
        headerCheckboxSelection: true,
        editable: false,
        filter: false,
        width: 50,
        lockPosition:true,
      },
      { headerName: this.utils.getTranslate('userEntity.territory'),  field: 'territory'},
      { headerName: this.utils.getTranslate('userEntity.position'),  field: 'type' },
      { headerName: this.utils.getTranslate('userEntity.organization'),  field: 'organization'},
      { headerName: this.utils.getTranslate('userEntity.mail'),  field: 'email' },
      { headerName: this.utils.getTranslate('userEntity.expirationDate'),  field: 'expirationDate'},
      { headerName: this.utils.getTranslate('userEntity.dataCreated'),  field: 'createdDate'},
    ];


  }


  initializeUserForm(): void {

    this.userForm = new FormGroup({
      id: new FormControl(null, []),
      username: new FormControl(null, [
        Validators.required,
      ]),
      firstName: new FormControl(null, [
        Validators.required,
      ]),
      lastName: new FormControl(null, [
        Validators.required,
      ]),
      password: new FormControl(null, [
        Validators.required,
      ]),
      confirmPassword: new FormControl(null,[
        Validators.required, this.matchValues('password'),
      ]),
      administrator: new FormControl(null, []),
      blocked: new FormControl(null, []),
      _links: new FormControl(null, []),

    });

  }

  public  matchValues(
    matchTo: string // name of the control to match to
  ): (AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      return !!control.parent &&
        !!control.parent.value &&
        control.value === control.parent.controls[matchTo].value
        ? null
        : { isMatching: false };
    };
}

  addNewUser() {
  
    if(this.userForm.get('password').value === this.userForm.get('confirmPassword').value)
    {
      // if(this.userForm.get('administrator')==null) {
      //   this.userForm.patchValue({
      //       administrator: false
      //   })
      // }
      // if(this.userForm.get('blocked')==null) {
      //   this.userForm.patchValue({
      //       blocked: false
      //   })
      // }
      console.log(this.userForm.value);
      this.userService.create(this.userForm.value)
        .subscribe(resp => {
          console.log(resp);
          // this.router.navigate(["/company", resp.id, "formConnection"]);
        });
    }
    else{
      console.error("Password doesn't match with confirm password");
    }
  }

  updateUser() {

    console.log(this.userForm.value);

    this.userService.update(this.userForm.value)
      .subscribe(resp => {
        console.log(resp);

      });

  }

  // AG-GRID

  // ******** Permits ******** //
   getAllPermissions = (): Observable<any> => {

    let params2:HalParam[]=[];
    let param:HalParam={key:'user.id', value:this.userID}
    params2.push(param);
    let query:HalOptions={ params:params2};

    return this.userConfigurationService.getAll(query);
  }

  removeDataPermissions( data)
  {

    const promises: Promise<any>[] = [];
    data.forEach(userConfiguration => {
        this.userConfigurationService.get(userConfiguration.id).subscribe((userConfigurationToDelete) => {
          promises.push(new Promise((resolve, reject) => {​​​​​​​ this.userConfigurationService.remove(userConfigurationToDelete).toPromise().then((resp) =>{​​​​​​​resolve()}​​​​​​​)}​​​​​​​));
          Promise.all(promises).then(() => {
            this.dataUpdatedEvent.next(true);
          });
        });
    });

    
  }
  
  newDataPermissions(id: any)
  {
    // this.router.navigate(['territory', id, 'territoryForm']);
    console.log('screen in progress');
  }

  // ******** Data of Territory ******** //
   getAllDataTerritory = (): Observable<any> => {
    var urlReq=`${this.userForm.value._links.positions.href}`
    if(this.userForm.value._links.positions.templated){
      var url=new URL(urlReq.split("{")[0]);
      url.searchParams.append("projection","view")
      urlReq=url.toString();
    }
    return (this.http.get(urlReq))
    .pipe( map( data =>  data['_embedded']['user-positions']) );

  }

  removeDataData( data)
  {
    console.log(data);
  }
  
  newDataData(id: any)
  {
    // this.router.navigate(['territory', id, 'territoryForm']);
    console.log('screen in progress');
  }

   // ******** Permits Dialog  ******** //
   
   getAllTerritoriesDialog = () => {
     return this.territoryService.getAll();
  }

   getAllRolesDialog = () => {
     return this.roleService.getAll();
  }

  openPermitsDialog(data: any) {
 
    const dialogRef = this.dialog.open(DialogGridComponent);
    dialogRef.componentInstance.getAllsTable=[this.getAllTerritoriesDialog, this.getAllRolesDialog];
    dialogRef.componentInstance.singleSelectionTable=[false,false];
    dialogRef.componentInstance.columnDefsTable=[this.columnDefsTerritoryDialog, this.columnDefsRolesDialog];
    dialogRef.componentInstance.themeGrid=this.themeGrid;
    dialogRef.componentInstance.title='Permits';
    dialogRef.componentInstance.titlesTable=['Territories', 'Roles'];
    dialogRef.componentInstance.nonEditable=false;
    


    dialogRef.afterClosed().subscribe(result => {
      if(result)
      {
        if(result.event==='Add') { 
          console.log(result.data); 
          this.territorisToUpdate.push(...result.data[0]) 
          this.rolesToUpdate.push(...result.data[1]) 
          console.log(this.territorisToUpdate);
          console.log(this.rolesToUpdate);
          
        }
      }


    });

  }

    // ******** Territory Data Dialog  ******** //

    getAllTerritoryDataDialog = () => {
      const aux: Array<any> = [];
      return of(aux);
      // return this.tasksService.getAll();
    }

    openTerritoryDataDialog(data: any) {
      // const getAlls: Array<() => Observable<any>> = [this.getAllCartographiesDialog];
      // const colDefsTable: Array<any[]> = [this.columnDefsCartographiesDialog];
      // const singleSelectionTable: Array<boolean> = [false];
      // const titlesTable: Array<string> = ['Cartographies'];
      const dialogRef = this.dialog.open(DialogGridComponent);
      dialogRef.componentInstance.getAllsTable=[this.getAllTerritoryDataDialog];
      dialogRef.componentInstance.singleSelectionTable=[false];
      dialogRef.componentInstance.columnDefsTable=[this.columnDefsTerritoryDataDialog];
      dialogRef.componentInstance.themeGrid=this.themeGrid;
      dialogRef.componentInstance.title='Territory Data';
      dialogRef.componentInstance.titlesTable=['Territory Data'];
      dialogRef.componentInstance.nonEditable=false;
      
  
  
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          if( result.event==='Add') {console.log(result.data); }
        }

      });
  
    }


    updateUserConfiguration(user:User, territories: Territory[], roles: Role[] )
    {
      const promises: Promise<any>[] = [];
      territories.forEach(territory => {

        roles.forEach(role => {

          let item = {
            user: user,
            role: role,
            territory: territory,
            _links: null
          }
          promises.push(new Promise((resolve, reject) => {​​​​​​​ this.userConfigurationService.save(item).toPromise().then((resp) =>{​​​​​​​resolve()}​​​​​​​)}​​​​​​​));
          Promise.all(promises).then(() => {
            this.dataUpdatedEvent.next(true);
          });
         
        });
        
      });

    }


    onSaveButtonClicked(){

    this.updateUserConfiguration(this.userToEdit,this.territorisToUpdate,this.rolesToUpdate)
    this.dataUpdatedEvent.next(true);

    }
  

}
