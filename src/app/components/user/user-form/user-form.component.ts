import { Component, OnInit } from '@angular/core';
import { tick } from '@angular/core/testing';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService, UserPositionService, UserConfigurationService, TerritoryService, RoleService, HalOptions, HalParam, Territory, User, UserConfiguration,Role } from '@sitmun/frontend-core';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from '../../../services/utils.service';
import { map } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DialogGridComponent } from 'dist/sitmun-frontend-gui/';
import { MatDialog } from '@angular/material/dialog';




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
  themeGrid: any = environment.agGridTheme;
  columnDefsPermits: any[];
  addElementsEventPermits: Subject<any[]> = new Subject<any[]>();
  columnDefsData: any[];
  addElementsEventTerritoryData: Subject<any[]> = new Subject<any[]>();

  //Dialog

  columnDefsTerritoryDialog: any[];
  columnDefsRolesDialog: any[];
  getAllElementsEventPermits: Subject<boolean> = new Subject <boolean>();
  columnDefsTerritoryDataDialog: any[];
  getAllElementsEventTerritoryData: Subject<boolean> = new Subject <boolean>();

  //Save button
  territorisToUpdate: Territory[] = [];
  rolesToUpdate: Role[] = [];
  dataUpdatedEvent: Subject<boolean> = new Subject<boolean>();




  constructor(
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private http: HttpClient,
    private utils: UtilsService,
    private userConfigurationService: UserConfigurationService,
    private roleService: RoleService,
    private userPositionService: UserPositionService,
    private territoryService: TerritoryService,
  ) {
    this.initializeUserForm();
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.userID = +params.id;
      if (this.userID !== -1) {
        console.log(this.userID);

        this.userService.get(this.userID).subscribe(
          resp => {
            console.log(resp);
            this.userToEdit = resp;
            this.userForm.setValue({
              id: this.userID,
              username: this.userToEdit.username,
              firstName: this.userToEdit.firstName,
              lastName: this.userToEdit.firstName,
              password: this.userToEdit.password,
              confirmPassword: "",
              administrator: this.userToEdit.administrator,
              blocked: this.userToEdit.blocked,
              _links: this.userToEdit._links
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


    this.columnDefsPermits = [

      environment.selCheckboxColumnDef,
      { headerName: 'Id', field: 'id', editable: false },
      { headerName: this.utils.getTranslate('userEntity.territory'), field: 'territory', editable:false },
      { headerName: this.utils.getTranslate('userEntity.role'), field: 'role', editable:false },
      { headerName: this.utils.getTranslate('territoryEntity.status'), field: 'status', editable:false },

    ];

    this.columnDefsData = [

      environment.selCheckboxColumnDef,
      { headerName: this.utils.getTranslate('userEntity.territory'), field: 'territoryName' },
      { headerName: this.utils.getTranslate('userEntity.position'), field: 'name' },
      { headerName: this.utils.getTranslate('userEntity.organization'), field: 'organization' },
      { headerName: this.utils.getTranslate('userEntity.mail'), field: 'email' },
      { headerName: this.utils.getTranslate('userEntity.expirationDate'), field: 'expirationDate' },
      { headerName: this.utils.getTranslate('territoryEntity.status'), field: 'status', editable:false },
      {
        headerName: this.utils.getTranslate('userEntity.dataCreated'), field: 'createdDate',  /*filter: 'agDateColumnFilter',*/cellRenderer: (data) => {
          return data.value ? (new Date(data.value)).toLocaleDateString() : '';
        }
      },

    ];

    this.columnDefsTerritoryDialog = [
      environment.selCheckboxColumnDef,
      { headerName: 'ID', field: 'id', editable: false },
      { headerName: this.utils.getTranslate('userEntity.code'), field: 'code', editable: false },
      { headerName: this.utils.getTranslate('userEntity.name'), field: 'name', editable: false },
    ];

    this.columnDefsRolesDialog = [
      environment.selCheckboxColumnDef,
      { headerName: this.utils.getTranslate('userEntity.code'), field: 'code', editable: false },
      { headerName: this.utils.getTranslate('userEntity.name'), field: 'name', editable: false },
    ];

    this.columnDefsTerritoryDataDialog = [
      environment.selCheckboxColumnDef,
      { headerName: this.utils.getTranslate('userEntity.territory'), field: 'territory' },
      { headerName: this.utils.getTranslate('userEntity.position'), field: 'type' },
      { headerName: this.utils.getTranslate('userEntity.organization'), field: 'organization' },
      { headerName: this.utils.getTranslate('userEntity.mail'), field: 'email' },
      {
        headerName: this.utils.getTranslate('userEntity.expirationDate'), field: 'expirationDate',
        filter: 'agDateColumnFilter', filterParams: this.utils.getDateFilterParams(),
        editable: false, cellRenderer: (data) => { return this.utils.getDateFormated(data) }
      },
      {
        headerName: this.utils.getTranslate('userEntity.createdDate'), field: 'createdDate',
        filter: 'agDateColumnFilter', filterParams: this.utils.getDateFilterParams(),
        editable: false, cellRenderer: (data) => { return this.utils.getDateFormated(data) }
      }
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
      confirmPassword: new FormControl(null, [
        Validators.required, this.matchValues('password'),
      ]),
      administrator: new FormControl(null, []),
      blocked: new FormControl(null, []),
      _links: new FormControl(null, []),

    });

  }

  public matchValues(
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

  // AG-GRID

  // ******** Permits ******** //
  getAllPermits = (): Observable<any> => {

    if(this.userID == -1)
    {
      const aux: Array<any> = [];
      return of(aux);
    }

    let params2: HalParam[] = [];
    let param: HalParam = { key: 'user.id', value: this.userID }
    params2.push(param);
    let query: HalOptions = { params: params2 };

    return this.userConfigurationService.getAll(query);
  }




  getAllRowsPermits(data: any[]) {
    
    let usersConfToCreate = [];
    let usersConfDelete = [];
    data.forEach(userConf => {
      let item = {
        role:  userConf.roleComplete,
        territory: userConf.territoryComplete,
        user:  this.userToEdit,
      }
      if (userConf.status === 'Pending creation') {usersConfToCreate.push(item) }
      if(userConf.status === 'Deleted') {usersConfDelete.push(userConf) }
    });

    usersConfToCreate.forEach(newElement => {

      this.userConfigurationService.save(newElement).subscribe(
        result => {
          console.log(result)
        })

      
    });

    usersConfDelete.forEach(deletedElement => {
    
      if(deletedElement._links)
      {
        this.userConfigurationService.remove(deletedElement).subscribe(
          result => {
            console.log(result)
          })
      }
      
    });

  }

  // ******** Data of Territory ******** //
  getAllDataTerritory = (): Observable<any> => {

    if(this.userID == -1)
    {
      const aux: Array<any> = [];
      return of(aux);
    }

    var urlReq = `${this.userForm.value._links.positions.href}`
    if (this.userForm.value._links.positions.templated) {
      var url = new URL(urlReq.split("{")[0]);
      url.searchParams.append("projection", "view")
      urlReq = url.toString();
    }
    return (this.http.get(urlReq))
      .pipe(map(data => data['_embedded']['user-positions']));

  }


  newDataData(id: any) {
    // this.router.navigate(['territory', id, 'territoryForm']);
    console.log('screen in progress');
  }

 
  getAllRowsDataTerritories(data: any[] ){
    // let territoriesToCreate = [];
    // let territoriesToDelete = [];
    // data.forEach(territory => {
    //   if (territory.status === 'Pending creation') {territoriesToCreate.push(territory) }
    //   if(territory.status === 'Deleted') {territoriesToDelete.push(territory._links.self.href) }
    // });

    // territoriesToCreate.forEach(newElement => {

    //   this.userPositionService.save(newElement).subscribe(
    //     result => {
    //       console.log(result)
    //     }
    //   )

    // });

    // territoriesToDelete.forEach(deletedElement => {

    //   this.userPositionService.remove(deletedElement).subscribe(
    //     result => {
    //       console.log(result)
    //     }
    //   )
      
    // });
	
  }

  updateTerritories(territoriesModified: Territory[], territoriesToPut: Territory[])
  {
    const promises: Promise<any>[] = [];
    territoriesModified.forEach(territory => {
      //TODO Table STM_POST
      // promises.push(new Promise((resolve, reject) => { this.territoryService.update(territory).toPromise().then((resp) => { resolve() }) }));
    });
    Promise.all(promises).then(() => {
      let url=this.userToEdit._links.positions.href.split('{', 1)[0];
      this.utils.updateUriList(url,territoriesToPut)
    });
  }
  
  // ******** Permits Dialog  ******** //

  getAllTerritoriesDialog = () => {
    return this.territoryService.getAll();
  }

  getAllRolesDialog = () => {
    return this.roleService.getAll();
  }

  openPermitsDialog(data: any) {

    const dialogRef = this.dialog.open(DialogGridComponent, { panelClass: 'gridDialogs' });
    dialogRef.componentInstance.getAllsTable = [this.getAllTerritoriesDialog, this.getAllRolesDialog];
    dialogRef.componentInstance.singleSelectionTable = [false, false];
    dialogRef.componentInstance.columnDefsTable = [this.columnDefsTerritoryDialog, this.columnDefsRolesDialog];
    dialogRef.componentInstance.themeGrid = this.themeGrid;
    dialogRef.componentInstance.title = this.utils.getTranslate('userEntity.permissions');
    dialogRef.componentInstance.titlesTable = [this.utils.getTranslate('userEntity.territories'), this.utils.getTranslate('userEntity.roles')];
    dialogRef.componentInstance.nonEditable = false;



    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.event === 'Add') {
          console.log(result.data);
          let rowsToAdd = this.getRowsToAddPermits(this.userToEdit, result.data[0], result.data[1])
          console.log(rowsToAdd);
          this.addElementsEventPermits.next(rowsToAdd);
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

    const dialogRef = this.dialog.open(DialogGridComponent, { panelClass: 'gridDialogs' });
    dialogRef.componentInstance.getAllsTable = [this.getAllTerritoryDataDialog];
    dialogRef.componentInstance.singleSelectionTable = [false];
    dialogRef.componentInstance.columnDefsTable = [this.columnDefsTerritoryDataDialog];
    dialogRef.componentInstance.themeGrid = this.themeGrid;
    dialogRef.componentInstance.title = this.utils.getTranslate('userEntity.dataOfTerritory');
    dialogRef.componentInstance.titlesTable = [''];
    dialogRef.componentInstance.nonEditable = false;



    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.event === 'Add') {
          this.addElementsEventTerritoryData.next(this.adaptFormatTerritory(result.data[0]))
        }
      }

    });

  }

  adaptFormatTerritory(dataToAdapt: Territory[])
  {
    let newData: any[] = [];
    
    dataToAdapt.forEach(element => {
      let item = {
        //TODO Put fields when backend return them
        id: null,
        territory: element,
        user: this.userToEdit,

      }
      newData.push(item);
      
    });

    return newData;
  }


  // updateUserConfiguration(user:User, territories: Territory[], roles: Role[] )
  // {
  //   const promises: Promise<any>[] = [];
  //   territories.forEach(territory => {

  //     roles.forEach(role => {

  //       let item = {
  //         user: user,
  //         role: role,
  //         territory: territory,
  //         _links: null
  //       }
  //       promises.push(new Promise((resolve, reject) => {​​​​​​​ this.userConfigurationService.save(item).toPromise().then((resp) =>{​​​​​​​resolve()}​​​​​​​)}​​​​​​​));
  //       Promise.all(promises).then(() => {
  //         this.dataUpdatedEvent.next(true);
  //       });

  //     });

  //   });

  // }

  getRowsToAddPermits(user: User, territories: Territory[], roles: Role[]) {
    let itemsToAdd: any[] = [];
    territories.forEach(territory => {

      roles.forEach(role => {
        let item = {
          role: role.name,
          roleComplete: role,
          territory: territory.name,
          territoryComplete: territory,
        }
        itemsToAdd.push(item);
      })
    })
    return itemsToAdd;
  }



  onSaveButtonClicked(){

    if(this.userForm.value.password === this.userForm.value.confirmPassword)
    {
      this.userService.save(this.userForm.value)
      .subscribe(resp => {
        console.log(resp);
        this.userToEdit=resp;
        this.getAllElementsEventTerritoryData.next(true);
        this.getAllElementsEventPermits.next(true);
  
      },
      error => {
        console.log(error)
      });     
    }






  }


}
