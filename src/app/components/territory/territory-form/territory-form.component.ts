import { Component, OnInit } from '@angular/core';
import { tick } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Territory, TerritoryService,UserPositionService, TranslationService, Translation, TaskAvailabilityService, TerritoryGroupTypeService, CartographyAvailabilityService, UserService, RoleService, CartographyService, TaskService, UserConfigurationService, HalOptions, HalParam, User, Role, Cartography, Task, TaskAvailability } from 'dist/sitmun-frontend-core/';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from '../../../services/utils.service';
import { Observable, of, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { config } from 'src/config';
import { DialogGridComponent, DialogMessageComponent } from 'dist/sitmun-frontend-gui/';
import { MatDialog } from '@angular/material/dialog';
import { UserConfiguration } from '@sitmun/frontend-core';


@Component({
  selector: 'app-territory-form',
  templateUrl: './territory-form.component.html',
  styleUrls: ['./territory-form.component.scss']
})
export class TerritoryFormComponent implements OnInit {

  //Translations
  translationsModified: boolean = false;
  catalanTranslation: Translation = null;
  spanishTranslation: Translation = null;
  englishTranslation: Translation = null;
  araneseTranslation: Translation = null;

  //Form
  themeGrid: any = config.agGridTheme;
  scopeTypes: Array<any> = [];
  groupTypeOfThisTerritory: any;
  territoryForm: FormGroup;
  territoryToEdit: any;
  territoryID = -1;
  duplicateID = -1;
  territoryGroups: Array<any> = [];
  extensions: Array<string>;
  dataLoaded: Boolean = false;
  idGroupType: any;
  terrritoryObj: any;

  //Grids
  columnDefsPermits: any[];
  getAllElementsEventPermits: Subject<boolean> = new Subject<boolean>();
  dataUpdatedEventPermits: Subject<boolean> = new Subject<boolean>();

  columnDefsPermitsChild: any[];
  getAllElementsEventPermitsChild: Subject<boolean> = new Subject<boolean>();
  dataUpdatedEventPermitsChild: Subject<boolean> = new Subject<boolean>();

  columnDefsPermitsInherit: any[];
  dataUpdatedEventInheritPermissions: Subject<boolean> = new Subject<boolean>();

  columnDefsMemberOf: any[];
  getAllElementsEventTerritoriesMemberOf: Subject<boolean> = new Subject<boolean>();
  dataUpdatedEventMemberOf: Subject<boolean> = new Subject<boolean>();

  columnDefsMembers: any[];
  getAllElementsEventTerritoriesMembers: Subject<boolean> = new Subject<boolean>();
  dataUpdatedEventMembers: Subject<boolean> = new Subject<boolean>();

  columnDefsCartographies: any[];
  getAllElementsEventCartographies: Subject<boolean> = new Subject<boolean>();
  dataUpdatedEventCartographies: Subject<boolean> = new Subject<boolean>();

  columnDefsTasks: any[];
  getAllElementsEventTasks: Subject<boolean> = new Subject<boolean>();
  dataUpdatedEventTasks: Subject<boolean> = new Subject<boolean>();

  //Dialog
  columnDefsTasksDialog: any[];
  addElementsEventTasks: Subject<any[]> = new Subject<any[]>();
  columnDefsCartographiesDialog: any[];
  addElementsEventCartographies: Subject<any[]> = new Subject<any[]>();
  columnDefsTerritoriesDialog: any[];
  addElementsEventTerritoriesMembers: Subject<any[]> = new Subject<any[]>();
  addElementsEventTerritoriesMemberOf: Subject<any[]> = new Subject<any[]>();
  columnDefsUsersDialog: any[];
  columnDefsRolesDialog: any[];
  addElementsEventPermits: Subject<any[]> = new Subject<any[]>();
  addElementsEventChildrenPermits: Subject<any[]> = new Subject<any[]>();

  //Save button
  rolesToUpdate: Role[] = [];
  usersToUpdate: User[] = [];
  dataUpdatedEvent: Subject<boolean> = new Subject<boolean>();


  constructor(
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private territoryService: TerritoryService,
    private translationService: TranslationService,
    private userService: UserService,
    private roleService: RoleService,
    private territoryGroupTypeService: TerritoryGroupTypeService,
    private cartographyService: CartographyService,
    private cartographyAvailabilityService: CartographyAvailabilityService,
    private taskAvailabilityService: TaskAvailabilityService,
    private taskService: TaskService,
    private userConfigurationService: UserConfigurationService,
    private userPositionService: UserPositionService,
    
    private http: HttpClient,
    public utils: UtilsService,
  ) {
    this.initializeTerritoryForm();
  }

  ngOnInit(): void {

    let territoryByDefault = {
      id: -1,
      name: '-------'
    }

    const promises: Promise<any>[] = [];
    promises.push(new Promise((resolve, reject) => {
      this.getTerritoryGroups().subscribe(
        resp => {
          this.territoryGroups.push(...resp);
          this.territoryGroups.push(territoryByDefault);
          resolve(true);
        }
      )
    }));
    promises.push(new Promise((resolve, reject) => {
      this.utils.getCodeListValues('territory.scope').subscribe(
        resp => {
          this.scopeTypes.push(...resp);
          resolve(true);
        }
      )
    }));

    Promise.all(promises).then(() => {
      this.activatedRoute.params.subscribe(params => {
        this.territoryID = +params.id;
        if(params.idDuplicate) { this.duplicateID = +params.idDuplicate; }
      
        if (this.territoryID !== -1 || this.duplicateID != -1) {
          let idToGet = this.territoryID !== -1? this.territoryID: this.duplicateID  
          this.territoryService.get(idToGet).subscribe(
            resp => {
              console.log(resp);
              this.territoryToEdit = resp;
              this.territoryForm.patchValue({
                code: this.territoryToEdit.code,
                territorialAuthorityAddress: this.territoryToEdit.territorialAuthorityAddress,
                territorialAuthorityLogo: this.territoryToEdit.territorialAuthorityLogo,
                scope: this.territoryToEdit.scope,
                groupType: this.territoryToEdit.groupTypeId,
                extent: this.territoryToEdit.extent,
                extensionX0: this.territoryToEdit.extent.minX,
                extensionX1: this.territoryToEdit.extent.maxX,
                extensionY0: this.territoryToEdit.extent.minY,
                extensionY1: this.territoryToEdit.extent.maxY,
                note: this.territoryToEdit.note,
                blocked: this.territoryToEdit.blocked,
                _links: this.territoryToEdit._links
              });


              if(this.territoryID !=-1){



                this.territoryForm.patchValue({
                id: this.territoryID,
                name: this.territoryToEdit.name,
                });
                    


                this.translationService.getAll()
                .pipe(map((data: any[]) => data.filter(elem => elem.element == this.territoryID && elem.column == config.translationColumns.territoryName)
                )).subscribe( result => {
                  console.log(result);
                  result.forEach(translation => {
                    if(translation.languageName == config.languagesObjects.catalan.name){
                      this.catalanTranslation=translation
                    }
                    if(translation.languageName == config.languagesObjects.spanish.name){
                      this.spanishTranslation=translation
                    }
                    if(translation.languageName == config.languagesObjects.english.name){
                      this.englishTranslation=translation
                    }
                    if(translation.languageName == config.languagesObjects.aranese.name){
                      this.araneseTranslation=translation
                    }
                  });
                  console.log(this.catalanTranslation);
                }
          
                );;
              } 
              else{
                this.territoryForm.patchValue({
                name: this.utils.getTranslate('copy_').concat(this.territoryToEdit.name),
                });
              }


              if (!this.territoryToEdit.groupTypeId) {
                this.territoryForm.patchValue({
                  groupType: this.territoryGroups[0].id,
                })
              }
              this.dataLoaded = true;
            },
            error => {

            }
          );
        }
        else {
          this.territoryForm.patchValue({
            blocked: false,
            groupType: this.territoryGroups[this.territoryGroups.length -1].id,
            scope: this.scopeTypes[0].value
          });
          this.dataLoaded = true;
        }

      },
        error => {

        });
    });


    this.columnDefsPermits = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getIdColumnDef(),
      this.utils.getNonEditableColumnDef('territoryEntity.user', 'user'),
      this.utils.getNonEditableColumnDef('territoryEntity.role', 'role'),
      this.utils.getStatusColumnDef()

    ];

    this.columnDefsPermitsChild = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getIdColumnDef(),
      this.utils.getNonEditableColumnDef('territoryEntity.user', 'user'),
      this.utils.getNonEditableColumnDef('territoryEntity.role', 'role'),
      this.utils.getStatusColumnDef()
    ];


    this.columnDefsPermitsInherit = [
     // this.utils.getSelCheckboxColumnDef(),
      this.utils.getIdColumnDef(),
      this.utils.getNonEditableColumnDef('territoryEntity.user', 'user'),
      this.utils.getNonEditableColumnDef('territoryEntity.territory', 'territory'),
      this.utils.getNonEditableColumnDef('territoryEntity.role', 'role'),

     // { headerName: this.utils.getTranslate('territoryEntity.status'), field: 'status', editable: false },
    ];

    this.columnDefsMemberOf = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getIdColumnDef(),
      this.utils.getNonEditableColumnDef('territoryEntity.code', 'code'),
      this.utils.getEditableColumnDef('taskGroupEntity.name', 'name'),
      this.utils.getStatusColumnDef()
    ];

    this.columnDefsMembers = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getIdColumnDef(),
      this.utils.getNonEditableColumnDef('territoryEntity.code', 'code'),
      this.utils.getEditableColumnDef('taskGroupEntity.name', 'name'),
      this.utils.getStatusColumnDef()
    ];

    this.columnDefsCartographies = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getIdColumnDef('cartographyId'),
      this.utils.getNonEditableColumnDef('territoryEntity.name', 'cartographyName'),
      this.utils.getNonEditableColumnDef('territoryEntity.layers', 'cartographyLayers'),
      this.utils.getStatusColumnDef()
    ];

    this.columnDefsTasks = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getIdColumnDef('taskId'),
      this.utils.getNonEditableColumnDef('territoryEntity.taskGroup', 'taskGroupName'),
      this.utils.getStatusColumnDef()
    ];

    this.columnDefsTerritoriesDialog = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getIdColumnDef(),
      this.utils.getNonEditableColumnDef('territoryEntity.name', 'name'),
    ];

    this.columnDefsCartographiesDialog = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getIdColumnDef(),
      this.utils.getNonEditableColumnDef('territoryEntity.name', 'name'),
    ];

    this.columnDefsTasksDialog = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getIdColumnDef(),
      this.utils.getNonEditableColumnDef('territoryEntity.name', 'name'),
    ];

    this.columnDefsUsersDialog = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getIdColumnDef(),
      this.utils.getNonEditableColumnDef('territoryEntity.username', 'username'),
    ];

    this.columnDefsRolesDialog = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getIdColumnDef(),
      this.utils.getNonEditableColumnDef('territoryEntity.name', 'name'),
    ];

    this.columnDefsTerritoriesDialog = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getIdColumnDef(),
      this.utils.getNonEditableColumnDef('territoryEntity.code', 'code'),
      this.utils.getNonEditableColumnDef('territoryEntity.name', 'name'),
    ];



  }


  initializeTerritoryForm(): void {

    this.territoryForm = new FormGroup({
      id: new FormControl(null, []),
      code: new FormControl(null, [Validators.required,]),
      name: new FormControl(null, [Validators.required,]),
      territorialAuthorityAddress: new FormControl(null),
      territorialAuthorityLogo: new FormControl(null),
      scope: new FormControl(null),
      groupType: new FormControl(null),
      extensionX0: new FormControl(null),
      extensionX1: new FormControl(null),
      extensionY0: new FormControl(null),
      extensionY1: new FormControl(null),
      extent: new FormControl(null),
      note: new FormControl(null),
      blocked: new FormControl(null),
      _links: new FormControl(null),

    })

  }

  getTerritoryGroups() {
    return this.territoryGroupTypeService.getAll();
  }

  getTerritoryGroupOfThisTerritory() {
    return this.territoryGroupTypeService.get(this.territoryID);
  }

  updateExtent() {
    let extent  = {
      minX: this.territoryForm.get('extensionX0').value,
      maxX: this.territoryForm.get('extensionX1').value,
      minY: this.territoryForm.get('extensionY0').value,
      maxY: this.territoryForm.get('extensionY1').value,
    }
    // let extent = `${this.territoryForm.get('extensionX0').value} ${this.territoryForm.get('extensionX1').value} ${this.territoryForm.get('extensionY0').value} ${this.territoryForm.get('extensionY1').value}`;
    this.territoryForm.patchValue({
      extent: extent
    });
  }

  async onTranslationButtonClicked()
  {
    let dialogResult = null
    dialogResult = await this.utils.openTranslationDialog(this.catalanTranslation, this.spanishTranslation, this.englishTranslation, this.araneseTranslation, config.translationColumns.territoryName);
    if(dialogResult!=null){
      this.translationsModified=true;
      this.catalanTranslation=dialogResult[0];
      this.spanishTranslation=dialogResult[1];
      this.englishTranslation=dialogResult[2];
      this.araneseTranslation=dialogResult[3];
    }
  }


  // AG-GRID
  // ******** Permits ******** //
  getAllPermits = (): Observable<any> => {

    if (this.territoryID == -1 && this.duplicateID == -1) {
      const aux: Array<any> = [];
      return of(aux);
    }
    let idToUse = this.territoryID == -1? this.duplicateID:this.territoryID

    let params2: HalParam[] = [];
    let param: HalParam = { key: 'territory.id', value: idToUse }
    params2.push(param);
    let query: HalOptions = { params: params2 };

    return this.userConfigurationService.getAll(query)
      .pipe(map((data: any[]) => data.filter(elem => elem.appliesToChildrenTerritories == false)
      ));;
  }

  getAllPermitsChild = (): Observable<any> => {

    if (this.territoryID == -1 && this.duplicateID == -1) {
      const aux: Array<any> = [];
      return of(aux);
    }
    let idToUse = this.territoryID == -1? this.duplicateID:this.territoryID
    let params2: HalParam[] = [];
    let param: HalParam = { key: 'territory.id', value: idToUse }
    params2.push(param);
    let query: HalOptions = { params: params2 };

    return this.userConfigurationService.getAll(query)
      .pipe(map((data: any[]) => data.filter(elem => elem.appliesToChildrenTerritories == true)
      ));;
  }

  async getAllRowsPermits(data: any[], permitsChildren: boolean) {

    let usersPositionToDelete = [];
    let usersPositionToAdd = [];
    const promisesDuplicate: Promise<any>[] = [];
    const promisesCurrentUserConf: Promise<any>[] = [];
    const promises: Promise<any>[] = [];
    console.log(data);
    for(let i = 0; i<data.length; i++){
      let userConf= data[i];
      if (userConf.status === 'pendingCreation') {
        let item;
        if(userConf._links){

          let urlReqRole = `${userConf._links.role.href}`
          if (userConf._links.role.href) {
            let url = new URL(urlReqRole.split("{")[0]);
            url.searchParams.append("projection", "view")
            urlReqRole = url.toString();
          }

          let urlReqUser = `${userConf._links.user.href}`
          if (userConf._links.user.href) {
            let url = new URL(urlReqUser.split("{")[0]);
            url.searchParams.append("projection", "view")
            urlReqUser = url.toString();
          }
          let roleComplete; 
          let userComplete;

          promisesDuplicate.push(new Promise((resolve, reject) => {

            promisesCurrentUserConf.push(new Promise((resolve, reject) => {
              this.http.get(urlReqRole).subscribe(result => {
                roleComplete = result;
                resolve(true);
              })
            
            }))

            promisesCurrentUserConf.push(new Promise((resolve, reject) => {
              this.http.get(urlReqUser).subscribe(result => {
                userComplete = result;
                resolve(true);
              })
            
            }))


            Promise.all(promisesCurrentUserConf).then( () =>{
              
              item = {
                role: roleComplete,
                appliesToChildrenTerritories: permitsChildren,
                territory: this.territoryToEdit,
                user: userComplete,
              }
              let index;
              if (userConf.roleChildren == null) {
              index = data.findIndex(element => element.roleId === item.role.id && element.userId === item.user.id &&
                 element.appliesToChildrenTerritories === item.appliesToChildrenTerritories && !element.new)
              }
              else {
                index = data.findIndex(element => element.roleId === item.role.id && element.userId === item.user.id && element.appliesToChildrenTerritories && !element.new)
              }
              if (index === -1) {
                userConf.new = false;
                // usersConfToCreate.push(item)
                promises.push(new Promise((resolve, reject) => { this.userConfigurationService.save(item).subscribe((resp) => { resolve(true) }) }));

              }
              resolve(true);
            })

          }))



        }
        else{
          item = {
            role: userConf.roleComplete,
            appliesToChildrenTerritories: permitsChildren,
            territory: this.territoryToEdit,
            user: userConf.userComplete,
          }

          console.log(item);
          let index;
          if (userConf.roleChildren == null) {
          index = data.findIndex(element => element.roleId === item.role.id && element.userId === item.user.id &&
             element.appliesToChildrenTerritories === item.appliesToChildrenTerritories && !element.new)
          }
          else {
            index = data.findIndex(element => element.roleId === item.role.id && element.userId === item.user.id && element.appliesToChildrenTerritories && !element.new)
          }
          if (index === -1) {
            userConf.new = false;
            promises.push(new Promise((resolve, reject) => { this.userConfigurationService.save(item).subscribe((resp) => { resolve(true) }) }));

          }
        }

      }
      if (userConf.status === 'pendingDelete' && userConf._links  && !userConf.new ) {
        promises.push(new Promise((resolve, reject) => { this.userConfigurationService.remove(userConf).subscribe((resp) => { resolve(true) }) }));

        let indexUserPosition = data.findIndex(element =>  element.userId === userConf.userId && element.status !== 'pendingDelete' );

        if(indexUserPosition == -1 && !usersPositionToDelete.includes(userConf.userId)){
          usersPositionToDelete.push(userConf.userId);
            promises.push(new Promise((resolve, reject) => {
            this.userPositionService.getAll()
            .pipe(map((data: any[]) => data.filter(elem => elem.territoryName === userConf.territory && elem.userId === userConf.userId )
            )).subscribe(data => {
              console.log(data);
              promises.push(new Promise((resolve, reject) => { this.userPositionService.remove(data[0]).subscribe((resp) => { resolve(true) }) }));
              resolve(true);
            })
          }));

        }


      }
    };


      Promise.all([...promises,...promisesDuplicate]).then(() => {
        this.dataUpdatedEventPermits.next(true);
      });

    



  }


  // ******** InheritPermissionsOfParents ******** //

  getAllInheritPermissions = (): Observable<any> => {

    if (this.territoryID == -1) {
      const aux: Array<any> = [];
      return of(aux);
    }

    var urlReq = `${this.territoryToEdit._links.memberOf.href}`
    if (this.territoryToEdit._links.memberOf.templated) {
      var url = new URL(urlReq.split("{")[0]);
      url.searchParams.append("projection", "view")
      urlReq = url.toString();
    }


    return  this.http.get(urlReq).pipe(map(async (data:any[]) => {
      const promises: Promise<any>[] = []; 
        let rowsToShow = []
        let territoriesMemberOf = data['_embedded']['territories'];
        if (territoriesMemberOf.length > 0) {
          territoriesMemberOf.forEach(territoryMemberOf => {
            let params2: HalParam[] = [];
            let param: HalParam = { key: 'territory.id', value: territoryMemberOf.id }
            params2.push(param);
            let query: HalOptions = { params: params2 };
            promises.push(new Promise((resolve, reject) => {   
              this.userConfigurationService.getAll(query).subscribe((resp:any[]) => {
                rowsToShow=rowsToShow.concat(resp);
                resolve(true);
              }); 
            }));
          });
        
          await Promise.all(promises).then(() => {
          });   
          return  rowsToShow.filter(elem => elem.appliesToChildrenTerritories == true)    
        }else{
          const aux: Array<any> = [];
          return of(aux);

        }
      }));

 

  }


  // ******** MembersOf ******** //
  getAllMembersOf = (): Observable<any> => {
    if (this.territoryID == -1 && this.duplicateID == -1) {
      const aux: Array<any> = [];
      return of(aux);
    }

    var urlReq = `${this.territoryToEdit._links.memberOf.href}`
    if (this.territoryToEdit._links.memberOf.templated) {
      var url = new URL(urlReq.split("{")[0]);
      url.searchParams.append("projection", "view")
      urlReq = url.toString();
    }

    return (this.http.get(urlReq))
      .pipe(map(data => data['_embedded']['territories']));

  }



  getAllRowsMembersOf(data: any[]) {
    let dataChanged = false;
    let territoriesModified = [];
    let territoriesToPut = [];
    data.forEach(territory => {
      if (territory.status !== 'pendingDelete') { 
        if (territory.status === 'pendingModify') { territoriesModified.push(territory) }
        else if (territory.status === 'pendingCreation') { dataChanged = true }
        territoriesToPut.push(territory._links.self.href)
      }
      else {dataChanged = true}
    });

    console.log(territoriesModified);
    this.updateTerritoriesMembersOf(territoriesModified, territoriesToPut, dataChanged);
  }

  updateTerritoriesMembersOf(territoriesModified: Territory[], territoriesToPut: Territory[], dataChanged: boolean) {
    const promises: Promise<any>[] = [];
    territoriesModified.forEach(territory => {
      promises.push(new Promise((resolve, reject) => { this.territoryService.update(territory).subscribe((resp) => { resolve(true) }) }));
    });
    Promise.all(promises).then(() => {
      if(dataChanged){
        let url = this.territoryToEdit._links.memberOf.href.split('{', 1)[0];
        this.utils.updateUriList(url, territoriesToPut, this.dataUpdatedEventMemberOf)
      }
      else { this.dataUpdatedEventMemberOf.next(true) }
    });
  }


  // ******** Members ******** //
  getAllMembers = (): Observable<any> => {

    if (this.territoryID == -1 && this.duplicateID == -1) {
      const aux: Array<any> = [];
      return of(aux);
    }

    var urlReq = `${this.territoryToEdit._links.members.href}`
    if (this.territoryToEdit._links.members.templated) {
      var url = new URL(urlReq.split("{")[0]);
      url.searchParams.append("projection", "view")
      urlReq = url.toString();
    }

    return (this.http.get(urlReq))
      .pipe(map(data => data['_embedded']['territories']));

  }

  getAllRowsMembers(data: any[]) {
    let dataChanged = false;
    let territoriesModified = [];
    let territoriesToPut = [];
    data.forEach(territory => {
      if (territory.status !== 'pendingDelete') {
        if (territory.status === 'pendingModify') { territoriesModified.push(territory) }
        else if (territory.status === 'pendingCreation') { dataChanged=true }
        territoriesToPut.push(territory._links.self.href)
      }
      else {dataChanged = true}
    });
    console.log(territoriesModified);
    this.updateTerritoriesMembers(territoriesModified, territoriesToPut, dataChanged);

  }

  updateTerritoriesMembers(territoriesModified: Territory[], territoriesToPut: Territory[], dataChanged:boolean) {
    const promises: Promise<any>[] = [];
    territoriesModified.forEach(territory => {
      promises.push(new Promise((resolve, reject) => { this.territoryService.update(territory).subscribe((resp) => { resolve(true) }) }));
    });
    Promise.all(promises).then(() => {
      if(dataChanged){
        let url = this.territoryToEdit._links.members.href.split('{', 1)[0];
        this.utils.updateUriList(url, territoriesToPut, this.dataUpdatedEventMembers)
      }
      else{
        this.dataUpdatedEventMembers.next(true)
      }
    });
  }

  // ******** Cartography ******** //
  getAllCartographies = (): Observable<any> => {

    if (this.territoryID == -1 && this.duplicateID == -1) {
      const aux: Array<any> = [];
      return of(aux);
    }

    var urlReq = `${this.territoryToEdit._links.cartographyAvailabilities.href}`
    if (this.territoryToEdit._links.cartographyAvailabilities.templated) {
      var url = new URL(urlReq.split("{")[0]);
      url.searchParams.append("projection", "view")
      urlReq = url.toString();
    }

    return (this.http.get(urlReq))
      .pipe(map(data => data['_embedded']['cartography-availabilities']));

  }

  getAllRowsCartographies(data: any[]) {
    const promises: Promise<any>[] = [];
    const promisesDuplicate: Promise<any>[] = [];
    data.forEach(cartography => {
      cartography.territory = this.territoryToEdit;
      if (cartography.status === 'pendingCreation') {

        let index = data.findIndex(element => element.cartographyId === cartography.cartographyId && !element.new)
        if (index === -1) {
          cartography.territory= this.territoryToEdit;
          cartography.new = false;
          if(cartography._links){
            cartography.id=null;
            let urlReqCartography= `${cartography._links.cartography.href}`
            let url = new URL(urlReqCartography.split("{")[0]);
            url.searchParams.append("projection", "view")
            urlReqCartography = url.toString();
  
            cartography._links=null;
            promises.push(new Promise((resolve, reject) => {
                this.http.get(urlReqCartography).subscribe(result => {
                  cartography.cartography=result;
                  this.cartographyAvailabilityService.save(cartography).subscribe((resp) => { resolve(true) });
                })
            }))
            
  
          }
          else{
            promises.push(new Promise((resolve, reject) => { this.cartographyAvailabilityService.save(cartography).subscribe((resp) => { resolve(true) }) }));
            // cartographiesToCreate.push(cartography)
          }
        }


      }
      if (cartography.status === 'pendingDelete' && cartography._links && !cartography.new ) {
        promises.push(new Promise((resolve, reject) => { this.cartographyAvailabilityService.remove(cartography).subscribe((resp) => { resolve(true) }) }));

        //  cartographiesToDelete.push(cartography) 
        }
    });


    Promise.all(promises).then(() => {
      this.dataUpdatedEventCartographies.next(true);
    });
  }

  // ******** Task ******** //
  getAllTasks = (): Observable<any> => {

    if (this.territoryID == -1 && this.duplicateID == -1) {
      const aux: Array<any> = [];
      return of(aux);
    }

    var urlReq = `${this.territoryToEdit._links.taskAvailabilities.href}`
    if (this.territoryToEdit._links.taskAvailabilities.templated) {
      var url = new URL(urlReq.split("{")[0]);
      url.searchParams.append("projection", "view")
      urlReq = url.toString();
    }

    return (this.http.get(urlReq))
      .pipe(map(data => data['_embedded']['task-availabilities']));
  }

  getAllRowsTasks(data: any[]) {
    const promises: Promise<any>[] = [];
    data.forEach(task => {
      if (task.status === 'pendingDelete' && task._links  && !task.new ) {
        promises.push(new Promise((resolve, reject) => { this.taskAvailabilityService.remove(task).subscribe((resp) => { resolve(true) }) }));
        //  tasksToDelete.push(task) 
        }
      if (task.status === 'pendingCreation') {
        task.territory=this.territoryToEdit;
        let index = data.findIndex(element => element.taskId === task.taskId && !element.new)
        if (index === -1) {
          task.new = false;
          let taskToCreate: TaskAvailability = new TaskAvailability();
          taskToCreate.territory = this.territoryToEdit;
          if(task._links){
            task.id=null;
            let urlReqTask= `${task._links.task.href}`
            let url = new URL(urlReqTask.split("{")[0]);
            url.searchParams.append("projection", "view")
            urlReqTask = url.toString();
  
            task._links=null;

            promises.push(new Promise((resolve, reject) => {
                this.http.get(urlReqTask).subscribe(result => {
                  

                  task.task=result;
                  taskToCreate.task = task.task;
                  this.taskAvailabilityService.save(task).subscribe((resp) => { resolve(true) });
                })
            }))
            
  
          }
          else{
            taskToCreate.task = task;
            // tasksToCreate.push(taskToCreate)
            promises.push(new Promise((resolve, reject) => { this.taskAvailabilityService.save(taskToCreate).subscribe((resp) => { resolve(true) }) }));

          }


        }
      }
    });
    Promise.all(promises).then(() => {
      this.dataUpdatedEventTasks.next(true);
    });
  }

  updateTasks(tasksModified: Task[], tasksToPut: TaskAvailability[]) {
    const promises: Promise<any>[] = [];
    tasksModified.forEach(task => {
      promises.push(new Promise((resolve, reject) => { this.taskService.update(task).subscribe((resp) => { resolve(true) }) }));
    });
    Promise.all(promises).then(() => {
      // let url=this.territoryToEdit._links.taskAvailabilities.href.split('{', 1)[0];
      // this.utils.updateUriList(url,tasksToPut)
      tasksToPut.forEach(task => {
        this.taskAvailabilityService.save(task).subscribe(result => {
          console.log(result)
        })
      })

    });
  }


  // ******** Permits Dialog  ******** //

  getAllUsersDialog = () => {
    return this.userService.getAll();
  }

  getAllRolesDialog = () => {
    return this.roleService.getAll();
  }

  openPermitsDialog(data: any, childrenTable: boolean) {

    const dialogRef = this.dialog.open(DialogGridComponent, { panelClass: 'gridDialogs' });
    dialogRef.componentInstance.getAllsTable = [this.getAllUsersDialog, this.getAllRolesDialog];
    dialogRef.componentInstance.orderTable = ['username', 'name'];
    dialogRef.componentInstance.singleSelectionTable = [false, false];
    dialogRef.componentInstance.columnDefsTable = [this.columnDefsUsersDialog, this.columnDefsRolesDialog];
    dialogRef.componentInstance.themeGrid = this.themeGrid;
    dialogRef.componentInstance.changeHeightButton = true;
    dialogRef.componentInstance.heightByDefault = '5';
    if (childrenTable) {
      dialogRef.componentInstance.title = this.utils.getTranslate('territoryEntity.permissionsChildren');
    }
    else {
      dialogRef.componentInstance.title = this.utils.getTranslate('territoryEntity.permits');
    }
    dialogRef.componentInstance.titlesTable = [this.utils.getTranslate('territoryEntity.users'), this.utils.getTranslate('territoryEntity.roles')];
    dialogRef.componentInstance.nonEditable = false;

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.event === 'Add') {
          if(result.data[0].length>0 && result.data[1].length>0){
            let rowsToAdd = this.getRowsToAddPermits(this.territoryToEdit, result.data[1], result.data[0], childrenTable)
            console.log(rowsToAdd);
            if (!childrenTable) { this.addElementsEventPermits.next(rowsToAdd) }
            else { this.addElementsEventChildrenPermits.next(rowsToAdd) }
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

  // ******** Permits Children Dialog  ******** //



  // ******** Territory Member Of Dialog  ******** //
  getAllTerritoriesMemberOfDialog = () => {
    return this.territoryService.getAll().
      pipe(
        map((resp: any) => {
          let newTable: Territory[] = [];
          resp.forEach(element => {
            if (element.scope == 'R') { newTable.push(element) }
          });
          return newTable;
        })
      );
  }

  openTerritoryMemberOfDialog(data: any) {
    const dialogRef = this.dialog.open(DialogGridComponent, { panelClass: 'gridDialogs' });
    dialogRef.componentInstance.orderTable = ['name'];
    dialogRef.componentInstance.getAllsTable = [this.getAllTerritoriesMemberOfDialog];
    dialogRef.componentInstance.singleSelectionTable = [false];
    dialogRef.componentInstance.columnDefsTable = [this.columnDefsTerritoriesDialog];
    dialogRef.componentInstance.themeGrid = this.themeGrid;
    dialogRef.componentInstance.title = this.utils.getTranslate('territoryEntity.territories');
    dialogRef.componentInstance.titlesTable = [''];
    dialogRef.componentInstance.nonEditable = false;



    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.event === 'Add') {
          if (result.event === 'Add') {
            this.addElementsEventTerritoriesMemberOf.next(result.data[0])
          }
        }
      }
    });
  }

  // ******** Territory Members Dialog  ******** //
  getAllTerritoriesMembersDialog = () => {
    return this.territoryService.getAll().
      pipe(
        map((resp: any) => {
          let newTable: Territory[] = [];
          resp.forEach(element => {
            if (element.scope == 'M') { newTable.push(element) }
          });
          return newTable;
        })
      );;
  }

  openTerritoryMembersDialog(data: any) {
    const dialogRef = this.dialog.open(DialogGridComponent, { panelClass: 'gridDialogs' });
    dialogRef.componentInstance.orderTable = ['name'];
    dialogRef.componentInstance.getAllsTable = [this.getAllTerritoriesMembersDialog];
    dialogRef.componentInstance.singleSelectionTable = [false];
    dialogRef.componentInstance.columnDefsTable = [this.columnDefsTerritoriesDialog];
    dialogRef.componentInstance.themeGrid = this.themeGrid;
    dialogRef.componentInstance.title = 'Territories';
    dialogRef.componentInstance.titlesTable = ['Territories'];
    dialogRef.componentInstance.nonEditable = false;



    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.event === 'Add') {
          this.addElementsEventTerritoriesMembers.next(result.data[0])
        }
      }
    });
  }

  // ******** Cartography Dialog  ******** //
  getAllCartographiesDialog = () => {
    return this.cartographyService.getAll();
  }

  openCartographyDialog(data: any) {
    const dialogRef = this.dialog.open(DialogGridComponent, { panelClass: 'gridDialogs' });
    dialogRef.componentInstance.orderTable = ['name'];
    dialogRef.componentInstance.getAllsTable = [this.getAllCartographiesDialog];
    dialogRef.componentInstance.singleSelectionTable = [false];
    dialogRef.componentInstance.columnDefsTable = [this.columnDefsCartographiesDialog];
    dialogRef.componentInstance.themeGrid = this.themeGrid;
    dialogRef.componentInstance.title = this.utils.getTranslate('territoryEntity.layers');
    dialogRef.componentInstance.titlesTable = [''];
    dialogRef.componentInstance.nonEditable = false;

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.event === 'Add') {
          this.addElementsEventCartographies.next(this.adaptFormatCartography(result.data[0]))
        }
      }

    });

  }

  adaptFormatCartography(dataToAdapt: Cartography[]) {
    let newData: any[] = [];

    dataToAdapt.forEach(element => {
      let item = {
        //TODO Put fields when backend return them
        id: null,
        cartography: element,
        cartographyId: element.id,
        cartographyLayers: element.layers,
        cartographyName: element.name,
        new: true,
      }
      newData.push(item);

    });

    return newData;
  }

  // ******** Tasks Dialog  ******** //
  getAllTasksDialog = () => {
    return this.taskService.getAll();
  }

  openTasksDialog(data: any) {

    const dialogRef = this.dialog.open(DialogGridComponent, { panelClass: 'gridDialogs' });
    dialogRef.componentInstance.orderTable = ['name'];
    dialogRef.componentInstance.getAllsTable = [this.getAllTasksDialog];
    dialogRef.componentInstance.singleSelectionTable = [false];
    dialogRef.componentInstance.columnDefsTable = [this.columnDefsTasksDialog];
    dialogRef.componentInstance.themeGrid = this.themeGrid;
    dialogRef.componentInstance.title = this.utils.getTranslate('territoryEntity.tasks');
    dialogRef.componentInstance.titlesTable = [''];
    dialogRef.componentInstance.nonEditable = false;

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.event === 'Add') {
          this.addElementsEventTasks.next(this.adaptFormatTask(result.data[0]))
        }
      }
    });
  }

  adaptFormatTask(dataToAdapt: any[]) {
    let newData: any[] = [];

    dataToAdapt.forEach(element => {
      let item: any = { ...element }
      item.id = null;
      item.taskGroupName = element.groupName
      item.taskId = element.id
      item.new = true
      newData.push(item);
    });

    return newData;
  }

  getRowsToAddPermits(territory: Territory, roles: Role[], users: any[], childrenTable: boolean) {
    let itemsToAdd: any[] = [];

    roles.forEach(role => {
      let item;

      users.forEach(user => {

        item = {
          user: user.username,
          userId: user.id,
          userComplete: user,
          role: role.name,
          roleComplete: role,
          roleId: role.id,
          territoryId: this.territoryID,
          territoryName: territory.name,
          appliesToChildrenTerritories: childrenTable,
          new: true
        }

        itemsToAdd.push(item);
      })
    })
    return itemsToAdd;
  }

  //Save button
  onSaveButtonClicked() {

    if (this.territoryForm.valid) {
      console.log(this.territoryForm.value)

      if (this.validateExtent(this.territoryForm.value.extensionX0, this.territoryForm.value.extensionX1, this.territoryForm.value.extensionY0,
        this.territoryForm.value.extensionY1)) {
        this.updateExtent();
        let groupType = this.territoryGroups.find(element => element.id == this.territoryForm.value.groupType)
        if (groupType == undefined || groupType.id === -1) {
          groupType = null;
        }

        if (this.territoryID == -1 && this.duplicateID != -1) {
          this.territoryForm.patchValue({
            _links: null
          })
        }
      

        this.terrritoryObj = new Territory();
        this.terrritoryObj.id = this.territoryID,
          this.terrritoryObj.code = this.territoryForm.value.code,
          this.terrritoryObj.name = this.territoryForm.value.name,
          this.terrritoryObj.territorialAuthorityAddress = this.territoryForm.value.territorialAuthorityAddress,
          this.terrritoryObj.territorialAuthorityLogo = this.territoryForm.value.territorialAuthorityLogo,
          this.terrritoryObj.scope = this.territoryForm.value.scope,
          this.terrritoryObj.groupType = groupType,
          this.terrritoryObj.extent = this.territoryForm.value.extent,
          this.terrritoryObj.note = this.territoryForm.value.note,
          this.terrritoryObj.blocked = this.territoryForm.value.blocked,
          this.terrritoryObj._links = this.territoryForm.value._links

        if (this.territoryID == -1) {
          this.terrritoryObj.id = null;
        } else {
          this.terrritoryObj.id = this.territoryForm.value.id;
          this.terrritoryObj.createdDate = this.territoryToEdit.createdDate
        }
        this.territoryService.save(this.terrritoryObj)
          .subscribe(async resp => {
            console.log(resp);
            this.territoryToEdit = resp;
            this.territoryID = resp.id;
            this.territoryForm.patchValue({
              id: resp.id,
              _links: resp._links
            })


            if(this.translationsModified){
              this.catalanTranslation = await this.utils.saveTranslation(resp.id,this.catalanTranslation);
              this.spanishTranslation = await this.utils.saveTranslation(resp.id,this.spanishTranslation);
              this.englishTranslation = await this.utils.saveTranslation(resp.id,this.englishTranslation);
              this.araneseTranslation = await this.utils.saveTranslation(resp.id,this.araneseTranslation);
              this.translationsModified = false;
            }

            this.getAllElementsEventCartographies.next(true);
            this.getAllElementsEventTasks.next(true);
            this.getAllElementsEventTerritoriesMemberOf.next(true);
            this.getAllElementsEventTerritoriesMembers.next(true);
            this.getAllElementsEventPermits.next(true);
          },
            error => {
              console.log(error);
            });


      }
      else {
        this.showExtentError();
      }

    }
    else {
      this.utils.showRequiredFieldsError();
    }
  }


  validateExtent(x0, x1, y0, y1) {

    let nullCounter = 0;
    if (x0 == null || x0.length < 1 || x0 === "null") { nullCounter++ };
    if (x1 == null || x1.length < 1 || x1 === "null") { nullCounter++ };
    if (y0 == null || y0.length < 1 || y0 === "null") { nullCounter++ };
    if (y1 == null || y1.length < 1 || y1 === "null") { nullCounter++ };

    return (nullCounter === 0 || nullCounter === 4)  ? true : false;

  }

  showExtentError() {
    const dialogRef = this.dialog.open(DialogMessageComponent);
    dialogRef.componentInstance.title = "Error"
    dialogRef.componentInstance.message = this.utils.getTranslate("extentError")
    dialogRef.componentInstance.hideCancelButton = true;
    dialogRef.afterClosed().subscribe();
  }
}