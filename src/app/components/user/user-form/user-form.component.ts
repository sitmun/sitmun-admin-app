import { Component, OnInit } from '@angular/core';
import { tick } from '@angular/core/testing';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService, UserPositionService, UserConfigurationService, 
  TerritoryService, RoleService, HalOptions, HalParam, Territory, User, UserConfiguration, Role } from '../../../frontend-core/src/lib/public_api';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from '../../../services/utils.service';
import { map } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { config } from 'src/config';
import { DialogGridComponent, DialogMessageComponent } from '../../../frontend-gui/src/lib/public_api';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { resolve } from 'dns';




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
  duplicateID = -1;
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
  getAllElementsEventPermits: Subject<string> = new Subject<string>();
  columnDefsTerritoryDataDialog: any[];
  getAllElementsEventTerritoryData: Subject<string> = new Subject<string>();

  //Save button
  territorisToUpdate: Territory[] = [];
  rolesToUpdate: Role[] = [];
  dataUpdatedEvent: Subject<boolean> = new Subject<boolean>();

  
  userPositionTypes: Array<any> = [];
  userPositionTypesDescription: Array<any> = [];



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

    const promises: Promise<any>[] = [];

    promises.push(new Promise((resolve, reject) => {
      this.utils.getCodeListValues('userPosition.type').subscribe(
        resp => {
          resp.forEach(element => {
            this.userPositionTypes.push(element);
            this.userPositionTypesDescription.push(element.description);
          });
          resolve(true);
        }
      )
    }));

    this.columnDefsPermits = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getIdColumnDef(),
      this.utils.getNonEditableColumnDef('userEntity.territory', 'territory'),
      this.utils.getNonEditableColumnDef('userEntity.role', 'role'),
      this.utils.getBooleanColumnDef('userEntity.appliesToChildrenTerritories', 'appliesToChildrenTerritories', true),
      this.utils.getStatusColumnDef()
    ];

    this.columnDefsData = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getNonEditableColumnDef('userEntity.territory', 'territoryName'),
      this.utils.getEditableColumnDef('userEntity.position', 'name'),
      this.utils.getEditableColumnDef('userEntity.organization', 'organization'),
      this.utils.getEditableColumnDef('userEntity.mail', 'email'),
      // this.utils.getEditableColumnDef('userEntity.type', 'type'),
      this.utils.getSelectColumnDef('userEntity.type', 'type',true,this.userPositionTypesDescription, true, this.userPositionTypes),
      this.utils.getDateColumnDef('userEntity.expirationDate', 'expirationDate',true),
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
      this.utils.getBooleanColumnDef('userEntity.appliesToChildrenTerritories', 'appliesToChildrenTerritories', true),
    ];


    Promise.all(promises).then(() => { 

    this.activatedRoute.params.subscribe(params => {
      this.userID = +params.id;
      if(params.idDuplicate) { this.duplicateID = +params.idDuplicate; }
      
      if (this.userID !== -1 || this.duplicateID != -1) {
        let idToGet = this.userID !== -1? this.userID: this.duplicateID  
        console.log(this.userID);

        this.userService.get(idToGet).subscribe(
          resp => {
            console.log(resp);
            this.userToEdit = resp;
            this.userForm.patchValue({
              firstName: this.userToEdit.firstName,
              lastName: this.userToEdit.lastName,
              password: null,
              confirmPassword: null,
              administrator: this.userToEdit.administrator,
              blocked: this.userToEdit.blocked,
              _links: this.userToEdit._links
            });

            if(this.userID !== -1){
                this.userForm.patchValue({
                id: this.userID,
                username: this.userToEdit.username,
                passwordSet: this.userToEdit.passwordSet,
              });
            }
            else{
              this.userForm.patchValue({
              username: this.utils.getTranslate('copy_').concat(this.userToEdit.username),
              passwordSet: false,
              });
            }

            this.dataLoaded = true;
          },
          error => {

          }
        );
      }
      else {
        this.userForm.patchValue({
          administrator: false,
          blocked: false,
          passwordSet: false
        });
        this.dataLoaded = true;
      }

    },
      error => {

      });

    })


  
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
      passwordSet: new FormControl(null),
      password: new FormControl(null),
      confirmPassword: new FormControl(null,),
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

    if (this.userID == -1 && this.duplicateID == -1)  {
      const aux: Array<any> = [];
      return of(aux);
    }

    let params2: HalParam[] = [];
    let param: HalParam = { key: 'user.id', value: this.userID!=-1?this.userID:this.duplicateID }
    params2.push(param);
    let query: HalOptions = { params: params2 };

    return this.userConfigurationService.getAll(query);
  }


  getAllRowsPermits(event){
    if(event.event == "save"){
      this.savePermits(event.data);
    }
  }


  async savePermits(data: any[]) {


    let territoriesToDelete= [];
    let territoriesToAdd= [];
    const promises: Promise<any>[] = [];  
    const promisesDuplicate: Promise<any>[] = [];
    const promisesCurrentUserConf: Promise<any>[] = [];
    const promisesCheckTerritories: Promise<any>[] = [];
    const promisesTerritories: Promise<any>[] = [];
    let showDialog = false;
    // data.forEach(userConf => {
    for(let i = 0; i<data.length; i++){
      let userConf= data[i];

      if (userConf.status === 'pendingCreation' || (userConf.status === 'pendingModify' && !userConf._links)) {

        let item;


        let itemTerritory;

        if(userConf._links){

          let index = data.findIndex(element =>  (element.roleId === userConf.roleId && element.territoryId === userConf.territoryId &&
                element.appliesToChildrenTerritories === userConf.appliesToChildrenTerritories && !element.newItem))
          if (index === -1) {

            let indexTerritory = data.findIndex(element => element.territoryId === userConf.territoryId && !element.newItem  )
            userConf.newItem = false;

            let roleComplete;
            let territoryComplete;
  
            let urlReqRole = `${userConf._links.role.href}`
            if (userConf._links.role.href) {
              let url = new URL(urlReqRole.split("{")[0]);
              url.searchParams.append("projection", "view")
              urlReqRole = url.toString();
            }
  
            
            let urlReqTerritory = `${userConf._links.territory.href}`
            if (userConf._links.territory.href) {
              let url = new URL(urlReqTerritory.split("{")[0]);
              url.searchParams.append("projection", "view")
              urlReqTerritory = url.toString();
            }
  
  
            promisesDuplicate.push(new Promise((resolve, reject) => {
  
              promisesCurrentUserConf.push(new Promise((resolve, reject) => {
                this.http.get(urlReqRole).subscribe(result => {
                  roleComplete = result;
                  resolve(true);
                })
              
              }))
  
              promisesCurrentUserConf.push(new Promise((resolve, reject) => {
                this.http.get(urlReqTerritory).subscribe(result => {
                  territoryComplete = result;
                  resolve(true);
                })
              
              }))
  
  
              Promise.all(promisesCurrentUserConf).then( () =>{
                item = {
                  role: roleComplete,
                  appliesToChildrenTerritories: userConf.appliesToChildrenTerritories,
                  territory: territoryComplete,
                   user: this.userToEdit
                 }
                 promises.push(new Promise((resolve, reject) => { this.userConfigurationService.save(item).subscribe((resp) => { resolve(true) }) }));
  
                 if(indexTerritory === -1 && !territoriesToAdd.includes(userConf.territoryId))
                 {
                     territoriesToAdd.push(userConf.territoryId);
                     itemTerritory = {
                       territory: territoryComplete,
                       user: this.userToEdit,
                       id: null,
                       _links: null,
                     }
                    //  territoriesToAdd.push(itemTerritory)
                    promisesTerritories.push(new Promise((resolve, reject) => { this.userPositionService.save(itemTerritory).subscribe((resp) => { resolve(true) }) }));

        
                 }
                resolve(true);
              })
  
            }))
  

          }



        }
        else{
          item = {
            role: userConf.roleComplete,
            appliesToChildrenTerritories: userConf.appliesToChildrenTerritories,
            territory: userConf.territoryComplete,
            user: this.userToEdit
          }

          let index;
          index = data.findIndex(element => element.roleId === item.role.id && element.territoryId === item.territory.id &&
            element.appliesToChildrenTerritories === item.appliesToChildrenTerritories && !element.newItem)

          let indexTerritory = data.findIndex(element => element.territoryId === userConf.territoryComplete.id && !element.newItem && element.status == 'pendingCreation' && !element._links)

          if(index === -1) {
            userConf.newItem = false;
            promises.push(new Promise((resolve, reject) => { this.userConfigurationService.save(item).subscribe((resp) => { resolve(true) }) }));
          }

          if(indexTerritory === -1 && !territoriesToAdd.includes(userConf.territoryId))
          {
            userConf.newItem = false;
            promisesCheckTerritories.push(new Promise((resolve, reject) => {
              this.userPositionService.getAll()
              .pipe(map((data: any[]) => data.filter(elem => elem.territoryName === userConf.territory && elem.userId === this.userID )
              )).subscribe(data => {
                if(data.length == 0){
                  if(!territoriesToAdd.includes(userConf.territoryId)){
                    territoriesToAdd.push(userConf.territoryId);
                    itemTerritory = {
                      territory: userConf.territoryComplete,
                      user: this.userToEdit,
                      id: null,
                      _links: null,
                    }
                    promisesTerritories.push(new Promise((resolve, reject) => { this.userPositionService.save(itemTerritory).subscribe((resp) => { resolve(true) }) }));
                  }



                }
                  // promisesTerritories.push(new Promise((resolve, reject) => { this.userPositionService.remove(data[0]).subscribe((resp) => { resolve(true) }) }));
                resolve(true);
              })
            }));
            territoriesToAdd.push(userConf.territoryId)
            itemTerritory = {
              territory: userConf.territoryComplete,
              user: this.userToEdit,
            }
               
            // territoriesToAdd.push(itemTerritory)
            promisesTerritories.push(new Promise((resolve, reject) => { this.userPositionService.save(itemTerritory).subscribe((resp) => { resolve(true) }) }));

          }

        }



      }
      if (userConf.status === 'pendingModify' && userConf._links) {


        let roleComplete;
        let territoryComplete;

        let urlReqRole = `${userConf._links.role.href}`
        if (userConf._links.role.href) {
          let url = new URL(urlReqRole.split("{")[0]);
          url.searchParams.append("projection", "view")
          urlReqRole = url.toString();
        }

        
        let urlReqTerritory = `${userConf._links.territory.href}`
        if (userConf._links.territory.href) {
          let url = new URL(urlReqTerritory.split("{")[0]);
          url.searchParams.append("projection", "view")
          urlReqTerritory = url.toString();
        }


        promisesDuplicate.push(new Promise((resolve, reject) => {

          promisesCurrentUserConf.push(new Promise((resolve, reject) => {
            this.http.get(urlReqRole).subscribe(result => {
              roleComplete = result;
              resolve(true);
            })
          
          }))

          promisesCurrentUserConf.push(new Promise((resolve, reject) => {
            this.http.get(urlReqTerritory).subscribe(result => {
              territoryComplete = result;
              resolve(true);
            })
          
          }))


          Promise.all(promisesCurrentUserConf).then( () =>{
            let item = {
              appliesToChildrenTerritories: userConf.appliesToChildrenTerritories,
              role: roleComplete,
              territory: territoryComplete,
              user: userConf._links.user.href,
              _links: userConf._links
            }
             promises.push(new Promise((resolve, reject) => { this.userConfigurationService.save(item).subscribe((resp) => { resolve(true) }) }));
            resolve(true);
          })

        }))


        // promises.push(new Promise((resolve, reject) => { this.userConfigurationService.save(item).subscribe((resp) => { resolve(true) }) }));
      }
      if (userConf.status === 'pendingDelete' && userConf._links && !userConf.newItem ) {

        
        let indexTerritory = data.findIndex(element =>  element.territoryId === userConf.territoryId && element.status !== 'pendingDelete' )
        if(indexTerritory === -1 && !territoriesToDelete.includes(userConf.territoryId))
        {
          showDialog = true;
          territoriesToDelete.push(userConf.territoryId)
          // promisesCheckTerritories.push(new Promise((resolve, reject) => {
          //   this.userPositionService.getAll()
          //   .pipe(map((data: any[]) => data.filter(elem => elem.territoryName === userConf.territory && elem.userId === this.userID )
          //   )).subscribe(data => {
          //     console.log(data);
          //       promisesTerritories.push(new Promise((resolve, reject) => { this.userPositionService.remove(data[0]).subscribe((resp) => { resolve(true) }) }));
          //     resolve(true);
          //   })
          // }));

        }

        promises.push(new Promise((resolve, reject) => { this.userConfigurationService.remove(userConf).subscribe((resp) => { resolve(true) }) }));
        }
    };


          
    Promise.all([...promises,...promisesDuplicate]).then(() => {
      Promise.all(promises).then(() => {
        this.dataUpdatedEventPermits.next(true);
      })
    });
    
    Promise.all([...promisesTerritories,...promisesDuplicate,...promisesCheckTerritories]).then(() => {
      Promise.all(promisesTerritories).then(() => {
        this.dataUpdatedEventTerritoryData.next(true);
        if(showDialog) {this.showNoRelationshipwithPermissions();}
      });
    });

  }


  // ******** Data of Territory ******** //
  getAllDataTerritory = (): Observable<any> => {

    if (this.userID == -1 && this.duplicateID == -1)  {
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

  getAllRowsDataTerritories(event){
    if(event.event == "save"){
      this.saveTerritories(event.data);
    }
  }

  saveTerritories(data: any[]) {
    let territoriesToEdit = [];
    const promises: Promise<any>[] = [];
    data.forEach(territory => {
      if (territory.status === 'pendingModify' || territory.status === 'pendingCreation') {
        if(territory.expirationDate != null)
        {
          let date = new Date(territory.expirationDate)
          territory.expirationDate=date.toISOString();
          console.log(territory.expirationDate)
        }

        if(territory.type)
        {
          let currentType = this.userPositionTypes.find(element => element.description == territory.type);
          if(currentType) { territory.type= currentType.value }
        }

        // if(territory.status == 'pendingCreation'){
        //   let item ={
        //     createdDate: new Date(),
        //     territory:{ _links:{self:{href:territory._links.territory.href.split("{")[0]}} },
        //     user: this.userToEdit
        //   }
        //   territoriesToEdit.push(item)  
        //   //      item.territory = item.territory._links.self.href;
        // }
        promises.push(new Promise((resolve, reject) => { this.userPositionService.save(territory).subscribe((resp) => { resolve(true) }) }));

        

       }
       else if(territory.status === 'pendingDelete'){
        promises.push(new Promise((resolve, reject) => { this.userPositionService.remove(territory).subscribe((resp) => { resolve(true) }) }));

       }
    });

    Promise.all(promises).then(() => {
      this.dataUpdatedEventTerritoryData.next(true);
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
    dialogRef.componentInstance.orderTable = ['name', 'name'];
    dialogRef.componentInstance.getAllsTable = [this.getAllTerritoriesDialog, this.getAllRolesDialog];
    dialogRef.componentInstance.singleSelectionTable = [true, false];
    dialogRef.componentInstance.columnDefsTable = [this.columnDefsTerritoryDialog, this.columnDefsRolesDialog];
    dialogRef.componentInstance.themeGrid = this.themeGrid;
    dialogRef.componentInstance.changeHeightButton = true;
    dialogRef.componentInstance.heightByDefault = '10';
    dialogRef.componentInstance.title = this.utils.getTranslate('userEntity.permissions');
    dialogRef.componentInstance.titlesTable = [this.utils.getTranslate('userEntity.territories'), this.utils.getTranslate('userEntity.roles')];
    dialogRef.componentInstance.nonEditable = false;



    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.event === 'Add') {
          if(result.data[0].length>0 && result.data[1].length>0){

            console.log(result.data);
            let territorySelected = result.data[0][0];
            console.log(territorySelected);
              this.addElementsEventPermits.next(this.getRowsToAddPermits(this.userToEdit, territorySelected, result.data[1], false));
            // this.addElementsEventPermits.next(this.getRowsToAddPermits(this.userToEdit, territorySelected, result.data[1], false));
            // rowsToAdd.push(...tableUserConfWithoutRoleM);
            //  if(territorySelected.scope==="R" ) {
            //   const dialogChildRolesWantedMessageRef = this.dialog.open(DialogMessageComponent);
            //   dialogChildRolesWantedMessageRef.componentInstance.title = this.utils.getTranslate("atention");
            //   dialogChildRolesWantedMessageRef.componentInstance.message = this.utils.getTranslate("addChildRoles");
            //   dialogChildRolesWantedMessageRef.afterClosed().subscribe(messageResult => {
            //     if (messageResult) {
            //       if (messageResult.event === 'Accept') {
            //         const dialogRefChildRoles = this.dialog.open(DialogGridComponent, { panelClass: 'gridDialogs' });
            //         dialogRefChildRoles.componentInstance.getAllsTable = [this.getAllRolesDialog];
            //         dialogRefChildRoles.componentInstance.orderTable = ['name'];
            //         dialogRefChildRoles.componentInstance.singleSelectionTable = [false];
            //         dialogRefChildRoles.componentInstance.columnDefsTable = [this.columnDefsRolesDialog];
            //         dialogRefChildRoles.componentInstance.themeGrid = this.themeGrid;
            //         dialogRefChildRoles.componentInstance.title = this.utils.getTranslate('userEntity.permissions');
            //         dialogRefChildRoles.componentInstance.titlesTable = [this.utils.getTranslate('userEntity.roles')];
            //         dialogRefChildRoles.componentInstance.nonEditable = false;
            //         dialogRefChildRoles.afterClosed().subscribe(childsResult => {
            //           if (childsResult) {
            //             if (childsResult.event === 'Add') {
            //               this.addElementsEventPermits.next(this.getRowsToAddPermits(this.userToEdit, territorySelected, childsResult.data[0], true));
            //               this.addElementsEventPermits.next(this.getRowsToAddPermits(this.userToEdit, territorySelected, result.data[1], false));
            //             }
            //             else{
            //               this.addElementsEventPermits.next(this.getRowsToAddPermits(this.userToEdit, territorySelected, result.data[1], false));
            //             }
            //           }
            //           else{
            //             this.addElementsEventPermits.next(this.getRowsToAddPermits(this.userToEdit, territorySelected, result.data[1], false));
            //           }
  
            //         });
            //       }
            //       else{
            //         this.addElementsEventPermits.next(this.getRowsToAddPermits(this.userToEdit, territorySelected, result.data[1], false));
            //       }
            //     }
            //     else{
            //       this.addElementsEventPermits.next(this.getRowsToAddPermits(this.userToEdit, territorySelected, result.data[1], false));
            //     }
            //   });
  
            // }
            // else{
            //   this.addElementsEventPermits.next(this.getRowsToAddPermits(this.userToEdit, territorySelected, result.data[1], false));
            // }
            // console.log(rowsToAdd);
            // this.addElementsEventPermits.next(rowsToAdd);

          }
          else{
            const dialogRef = this.dialog.open(DialogMessageComponent);
            dialogRef.componentInstance.title = this.utils.getTranslate("atention");
            dialogRef.componentInstance.message = this.utils.getTranslate("doubleSelectionMessage");
            dialogRef.componentInstance.hideCancelButton = true;
            dialogRef.afterClosed().subscribe();
          }

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
        territoryName: territory.name,
        territoryId: territory.id,
        userId: this.userID,
        appliesToChildrenTerritories: role['appliesToChildrenTerritories']?true:false,
        new: true,
      }
      if (this.userToEdit) { item.userId = this.userToEdit.id }
      itemsToAdd.push(item);
      if(role['appliesToChildrenTerritories']) { delete role['appliesToChildrenTerritories'] }
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

        if (this.userID == -1 && this.duplicateID != -1) {
          this.userForm.patchValue({
            _links: null
          })
        }

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
            this.userToEdit = resp
            this.userID = resp.id;
            this.userForm.patchValue({
             id: resp.id,
             passwordSet: resp.passwordSet,
            _links: resp._links
            })
            console.log(this.userToEdit);
            this.getAllElementsEventTerritoryData.next('save');
            this.getAllElementsEventPermits.next('save');
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

  showNoRelationshipwithPermissions(){
    const dialogRef = this.dialog.open(DialogMessageComponent);
    dialogRef.componentInstance.title = this.utils.getTranslate("atention")
    dialogRef.componentInstance.message = this.utils.getTranslate("permissionsNoRelationship")
    dialogRef.componentInstance.hideCancelButton = true;
    dialogRef.afterClosed().subscribe();
  }


}
