import { Component, OnInit } from '@angular/core';
import { tick } from '@angular/core/testing';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService, UserPositionService, UserConfigurationService, TerritoryService, RoleService, HalOptions, HalParam, Territory, User, UserConfiguration, Role } from 'dist/sitmun-frontend-core/';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from '../../../services/utils.service';
import { map } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { config } from 'src/config';
import { DialogGridComponent, DialogMessageComponent } from 'dist/sitmun-frontend-gui/';
import { MatDialog } from '@angular/material/dialog';




@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {

  hidePassword = true;
  hideConfirmPassword = true;

  //Form
  userForm: FormGroup;
  userToEdit: User;
  userID = -1;
  dataLoaded: Boolean = false;

  //Grids
  themeGrid: any = config.agGridTheme;
  columnDefsPermits: any[];
  addElementsEventPermits: Subject<any[]> = new Subject<any[]>();
  dataUpdatedEventPermits: Subject<boolean> = new Subject<boolean>();

  columnDefsData: any[];
  addElementsEventTerritoryData: Subject<any[]> = new Subject<any[]>();
  dataUpdatedEventTerritoryData: Subject<boolean> = new Subject<boolean>();

  //Dialog

  columnDefsTerritoryDialog: any[];
  columnDefsRolesDialog: any[];
  getAllElementsEventPermits: Subject<boolean> = new Subject<boolean>();
  columnDefsTerritoryDataDialog: any[];
  getAllElementsEventTerritoryData: Subject<boolean> = new Subject<boolean>();

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
    public utils: UtilsService,
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
              confirmPassword: this.userToEdit.password,
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
        this.dataLoaded = true;
      }

    },
      error => {

      });


    this.columnDefsPermits = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getIdColumnDef(),
      this.utils.getNonEditableColumnDef('userEntity.territory', 'territory'),
      this.utils.getNonEditableColumnDef('userEntity.role', 'role'),
      this.utils.getBooleanColumnDef('userEntity.appliesToChildrenTerritories', 'appliesToChildrenTerritories'),
      this.utils.getStatusColumnDef()
    ];

    this.columnDefsData = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getEditableColumnDef('userEntity.territory', 'territoryName'),
      this.utils.getEditableColumnDef('userEntity.position', 'name'),
      this.utils.getEditableColumnDef('userEntity.organization', 'organization'),
      this.utils.getEditableColumnDef('userEntity.mail', 'email'),
      this.utils.getDateColumnDef('userEntity.expirationDate', 'expirationDate'),
      this.utils.getDateColumnDef('userEntity.dataCreated', 'createdDate'),
      this.utils.getStatusColumnDef()
    ];

    this.columnDefsTerritoryDialog = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getIdColumnDef(),
      this.utils.getNonEditableColumnDef('userEntity.code', 'code'),
      this.utils.getNonEditableColumnDef('userEntity.name', 'name'),

    ];

    this.columnDefsRolesDialog = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getIdColumnDef(),
      this.utils.getNonEditableColumnDef('userEntity.name', 'name'),
    ];

    this.columnDefsTerritoryDataDialog = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getNonEditableColumnDef('userEntity.territory', 'territoryName'),
      this.utils.getNonEditableColumnDef('userEntity.position', 'name'),
      this.utils.getNonEditableColumnDef('userEntity.organization', 'organization'),
      this.utils.getNonEditableColumnDef('userEntity.mail', 'email'),
      this.utils.getDateColumnDef('userEntity.expirationDate', 'expirationDate'),
      this.utils.getDateColumnDef('userEntity.dataCreated', 'createdDate'),
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
      lastName: new FormControl(null),
      password: new FormControl(null),
      confirmPassword: new FormControl(null,), // [this.matchValues('password'),]
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

    if (this.userID == -1) {
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

      if (userConf.status === 'pendingCreation') {
        let item = {
          role: userConf.roleComplete,
          appliesToChildrenTerritories: userConf.appliesToChildrenTerritories,
          territory: userConf.territoryComplete,
          user: this.userToEdit
        }
        let index;
        item.role = userConf.roleComplete,
          index = data.findIndex(element => element.roleId === item.role.id && element.territoryId === item.territory.id &&
            element.appliesToChildrenTerritories === item.appliesToChildrenTerritories && !element.new)

        if (index === -1) {
          userConf.new = false;
          usersConfToCreate.push(item)
        }
      }
      if (userConf.status === 'pendingDelete' && userConf._links) { usersConfDelete.push(userConf) }
    });
    const promises: Promise<any>[] = [];
    usersConfToCreate.forEach(newElement => {
      promises.push(new Promise((resolve, reject) => { this.userConfigurationService.save(newElement).subscribe((resp) => { resolve(true) }) }));
    });

    usersConfDelete.forEach(deletedElement => {

      if (deletedElement._links) {
        promises.push(new Promise((resolve, reject) => { this.userConfigurationService.remove(deletedElement).subscribe((resp) => { resolve(true) }) }));

      }

    });

    Promise.all(promises).then(() => {
      this.dataUpdatedEventPermits.next(true);
    });

  }

  // ******** Data of Territory ******** //
  getAllDataTerritory = (): Observable<any> => {

    if (this.userID == -1) {
      const aux: Array<any> = [];
      return of(aux);
    }

    var urlReq = `${this.userToEdit._links.positions.href}`
    if (this.userToEdit._links.positions.templated) {
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


  getAllRowsDataTerritories(data: any[]) {
    // let territoriesToCreate = [];
    // let territoriesToDelete = [];
    // data.forEach(territory => {
    //   if (territory.status === 'pendingCreation') {territoriesToCreate.push(territory) }
    //   if(territory.status === 'pendingDelete' && territory._links) {territoriesToDelete.push(territory._links.self.href) }
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

  updateTerritories(territoriesModified: Territory[], territoriesToPut: Territory[]) {
    const promises: Promise<any>[] = [];
    territoriesModified.forEach(territory => {
      //TODO Table STM_POST
      // promises.push(new Promise((resolve, reject) => { this.territoryService.update(territory).subscribe((resp) => { resolve(true) }) }));
    });
    Promise.all(promises).then(() => {
      let url = this.userToEdit._links.positions.href.split('{', 1)[0];
      this.utils.updateUriList(url, territoriesToPut)
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
    dialogRef.componentInstance.singleSelectionTable = [true, false];
    dialogRef.componentInstance.columnDefsTable = [this.columnDefsTerritoryDialog, this.columnDefsRolesDialog];
    dialogRef.componentInstance.themeGrid = this.themeGrid;
    dialogRef.componentInstance.title = this.utils.getTranslate('userEntity.permissions');
    dialogRef.componentInstance.titlesTable = [this.utils.getTranslate('userEntity.territories'), this.utils.getTranslate('userEntity.roles')];
    dialogRef.componentInstance.nonEditable = false;



    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.event === 'Add') {
          console.log(result.data);
          let territorySelected = result.data[0][0];
          console.log(territorySelected);
          this.addElementsEventPermits.next(this.getRowsToAddPermits(this.userToEdit, territorySelected, result.data[1], false));
          // rowsToAdd.push(...tableUserConfWithoutRoleM);
           if(territorySelected.scope==="R" && result.data[1].length>0) {
            const dialogChildRolesWantedMessageRef = this.dialog.open(DialogMessageComponent);
            dialogChildRolesWantedMessageRef.componentInstance.title = this.utils.getTranslate("atention");
            dialogChildRolesWantedMessageRef.componentInstance.message = this.utils.getTranslate("addChildRoles");
            dialogChildRolesWantedMessageRef.afterClosed().subscribe(messageResult => {
              if (messageResult) {
                if (messageResult.event === 'Accept') {
                  const dialogRefChildRoles = this.dialog.open(DialogGridComponent, { panelClass: 'gridDialogs' });
                  dialogRefChildRoles.componentInstance.getAllsTable = [this.getAllRolesDialog];
                  dialogRefChildRoles.componentInstance.singleSelectionTable = [false];
                  dialogRefChildRoles.componentInstance.columnDefsTable = [this.columnDefsRolesDialog];
                  dialogRefChildRoles.componentInstance.themeGrid = this.themeGrid;
                  dialogRefChildRoles.componentInstance.title = this.utils.getTranslate('userEntity.permissions');
                  dialogRefChildRoles.componentInstance.titlesTable = [this.utils.getTranslate('userEntity.roles')];
                  dialogRefChildRoles.componentInstance.nonEditable = false;
                  dialogRefChildRoles.afterClosed().subscribe(childsResult => {
                    if (childsResult) {
                      if (childsResult.event === 'Add') {
                        this.addElementsEventPermits.next(this.getRowsToAddPermits(this.userToEdit, territorySelected, childsResult.data[0], true));
                      }
                    }

                  });
                }
              }
            });

          }
          // console.log(rowsToAdd);
          // this.addElementsEventPermits.next(rowsToAdd);



        }
      }


    });

  }

  getRowsToAddPermits(user: User, territory: Territory, roles: Role[], rolesAreChildren: Boolean) {
    let itemsToAdd: any[] = [];
    roles.forEach(role => {
      let item;
      item = {
        role: role.name,
        roleComplete: role,
        roleId: role.id,
        territory: territory.name,
        territoryComplete: territory,
        territoryId: territory.id,
        userId: this.userID,
        new: true,
        appliesToChildrenTerritories: rolesAreChildren
      }


      if (this.userToEdit) { item.userId = this.userToEdit.id }
      itemsToAdd.push(item);
    })

    return itemsToAdd;
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

  adaptFormatTerritory(dataToAdapt: Territory[]) {
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




  onSaveButtonClicked() {

    if (this.userForm.valid) {

      if (this.userForm.value.password === this.userForm.value.confirmPassword) {
        let userObj: User = new User();
        userObj.username = this.userForm.value.username;
        userObj.password = this.userForm.value.password;
        userObj.firstName = this.userForm.value.firstName;
        userObj.lastName = this.userForm.value.lastName;
        userObj.blocked = this.userForm.value.blocked;
        userObj.administrator = this.userForm.value.administrator;
        userObj._links = this.userForm.value._links;

        this.userService.save(userObj)
          .subscribe(resp => {
            console.log(resp)
            // this.userToEdit = resp
            // this.userID = resp.id;
            // this.userForm.patchValue({
            // id: resp.id,
            // _links: resp._links
            // })
            console.log(this.userToEdit);
            this.getAllElementsEventTerritoryData.next(true);
            this.getAllElementsEventPermits.next(true);
          }, error => {
            console.log(error)
          });

      }
      else {

        const dialogRef = this.dialog.open(DialogMessageComponent);
        dialogRef.componentInstance.title = "Error";
        dialogRef.componentInstance.message = this.utils.getTranslate("passwordMessage");
        dialogRef.componentInstance.hideCancelButton = true;
        dialogRef.afterClosed().subscribe();

      }


    }
    else {
      this.utils.showRequiredFieldsError();
    }


  }


}
