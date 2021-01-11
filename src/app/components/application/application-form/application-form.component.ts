import { Component, OnInit } from '@angular/core';
import { tick } from '@angular/core/testing';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationService, RoleService, HalOptions, HalParam,CartographyGroupService } from 'dist/sitmun-frontend-core/';

import { HttpClient } from '@angular/common/http';
import { UtilsService } from '../../../services/utils.service';

import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DialogGridComponent } from 'dist/sitmun-frontend-gui/';
import { MatDialog } from '@angular/material/dialog';



@Component({
  selector: 'app-application-form',
  templateUrl: './application-form.component.html',
  styleUrls: ['./application-form.component.scss']
})
export class ApplicationFormComponent implements OnInit {

  situationMapList: Array<any> = [];

  //Dialog
  applicationForm: FormGroup;
  applicationToEdit;
  applicationID = -1;
  dataLoaded: Boolean = false;
  themeGrid: any = environment.agGridTheme;

  //Grids
  columnDefsParameters: any[];
  columnDefsTemplates: any[];
  columnDefsRoles: any[];
  columnDefsBackgrounds: any[];
  applicationTypes: Array<any> = [];

  //Dialogs
  
  columnDefsParametersDialog: any[];
  columnDefsTemplateConfigurationDialog: any[];
  columnDefsRolesDialog: any[];
  columnDefsBackgroundDialog: any[];

  constructor(
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private applicationService: ApplicationService,
    private roleService: RoleService,
    private http: HttpClient,
    private utils: UtilsService,
    private cartographyGroupService:CartographyGroupService,
  ) {
    this.initializeApplicationForm();
  }



  ngOnInit(): void {

    this.utils.getCodeListValues('application.type').subscribe(
      resp => {
        this.applicationTypes.push(...resp);
      }
    );

    let situationMapByDefault = {
      id: -1,
      name: '-------'
    }
    this.situationMapList.push(situationMapByDefault);

    this.getSituationMapList().subscribe(
      resp => {
        this.situationMapList.push(...resp);
      }
    );

    this.activatedRoute.params.subscribe(params => {
      this.applicationID = +params.id;
      if (this.applicationID !== -1) {
        console.log(this.applicationID);

        this.applicationService.get(this.applicationID).subscribe(
          resp => {
            console.log(resp);
            this.applicationToEdit = resp;

            
            this.applicationForm.setValue({
              id: this.applicationID,
              name: this.applicationToEdit.name,
              type: this.applicationToEdit.type,
              title: this.applicationToEdit.title,
              tree: ' ',
              desktopUrl: this.applicationToEdit.jspTemplate,
              desktopCSS: this.applicationToEdit.theme,
              situationMap: this.applicationToEdit.situationMapId,
              scales: this.applicationToEdit.scales,
              srs: this.applicationToEdit.srs,
              treeAutoRefresh: this.applicationToEdit.treeAutoRefresh,
              _links: this.applicationToEdit._links
            });

            this.dataLoaded = true;
          },
          error => {

          }
        );
      }
      else {
        this.applicationForm.patchValue({
          moveSupramunicipal: false,
          treeAutorefresh: false,
        });
      }

    },
      error => {

      });


    this.columnDefsParameters = [

      {
        headerName: '',
        checkboxSelection: true,
        headerCheckboxSelection: true,
        editable: false,
        filter: false,
        width: 25,
        lockPosition: true,
      },
      { headerName: this.utils.getTranslate('applicationEntity.name'), field: 'name' },
      { headerName: this.utils.getTranslate('applicationEntity.value'), field: 'value', },
      { headerName: this.utils.getTranslate('applicationEntity.type'), field: 'type' },

    ];

    this.columnDefsTemplates = [

      {
        headerName: '',
        checkboxSelection: true,
        headerCheckboxSelection: true,
        editable: false,
        filter: false,
        width: 25,
        lockPosition: true,
      },
      { headerName: this.utils.getTranslate('applicationEntity.name'), field: 'name' },
      { headerName: this.utils.getTranslate('applicationEntity.value'), field: 'value', },
    ];

    this.columnDefsRoles = [

      {
        headerName: '',
        checkboxSelection: true,
        headerCheckboxSelection: true,
        editable: false,
        filter: false,
        width: 15,
        lockPosition: true,
      },
      { headerName: "Id", field: 'id' },
      { headerName: this.utils.getTranslate('applicationEntity.name'), field: 'name' },

    ];

    this.columnDefsBackgrounds = [

      {
        headerName: '',
        checkboxSelection: true,
        headerCheckboxSelection: true,
        editable: false,
        filter: false,
        width: 25,
        lockPosition: true,
      },
      { headerName: this.utils.getTranslate('applicationEntity.background'), field: 'background' },
      { headerName: this.utils.getTranslate('applicationEntity.selectedBackground'), field: 'selectedBackground' },

    ];

    this.columnDefsParametersDialog = [
      {
        headerName: '',
        checkboxSelection: true,
        headerCheckboxSelection: true,
        editable: false,
        filter: false,
        width: 50,
        lockPosition:true,
      },
      { headerName: this.utils.getTranslate('applicationEntity.name'), field: 'name',  editable: false  },
      { headerName: this.utils.getTranslate('applicationEntity.value'), field: 'value',  editable: false  },
      { headerName: this.utils.getTranslate('applicationEntity.type'), field: 'type',  editable: false  },
    ];

    this.columnDefsTemplateConfigurationDialog = [
      {
        headerName: '',
        checkboxSelection: true,
        headerCheckboxSelection: true,
        editable: false,
        filter: false,
        width: 50,
        lockPosition:true,
      },
      { headerName: this.utils.getTranslate('applicationEntity.name'), field: 'name',  editable: false  },
      { headerName: this.utils.getTranslate('applicationEntity.value'), field: 'value',  editable: false  },
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
      { headerName: 'ID', field: 'id', editable: false },
      { headerName: this.utils.getTranslate('applicationEntity.name'), field: 'name',  editable: false  },
      { headerName: this.utils.getTranslate('applicationEntity.note'), field: 'description' },
      { headerName: this.utils.getTranslate('applicationEntity.application'), field: 'application' },

    ];

    this.columnDefsBackgroundDialog = [
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
      { headerName: this.utils.getTranslate('applicationEntity.name'), field: 'name',  editable: false  },
    ];

  }
  getSituationMapList() {
    let params2:HalParam[]=[];
    let param:HalParam={key:'type', value:'M'}
    params2.push(param);
    let query:HalOptions={ params:params2};

    return this.cartographyGroupService.getAll(query);
  }


  onSelectionTypeAppChanged({ value }) {
    debugger;
    if (value === 'E') {
      this.applicationForm.get('title').disable();
      this.applicationForm.get('tree').disable();
      this.applicationForm.get('scales').disable();
      this.applicationForm.get('srs').disable();
      this.applicationForm.get('situationMap').disable();
      this.applicationForm.get('treeAutoRefresh').disable();
      this.applicationForm.get('desktopCSS').disable();
    } else {
      this.applicationForm.get('title').enable();
      this.applicationForm.get('tree').enable();
      this.applicationForm.get('scales').enable();
      this.applicationForm.get('srs').enable();
      this.applicationForm.get('situationMap').enable();
      this.applicationForm.get('treeAutoRefresh').enable();
      this.applicationForm.get('desktopCSS').enable();
    }
  }

  initializeApplicationForm(): void {

    this.applicationForm = new FormGroup({
      id: new FormControl(null, []),
      name: new FormControl(null, [
        Validators.required,
      ]),
      type: new FormControl(null, [
        Validators.required,
      ]),
      title: new FormControl(null, [
        Validators.required,
      ]),
      tree: new FormControl(null, [
        Validators.required,
      ]),
      desktopUrl: new FormControl(null, [
        Validators.required,
      ]),
      desktopCSS: new FormControl(null, [
        Validators.required,
      ]),
      /*mobileUrl: new FormControl(null, [
        Validators.required,
      ]),
      mobileCSS: new FormControl(null, [
        Validators.required,
      ]),
      defaultTool: new FormControl(null, [
        Validators.required,
      ]),
      moveSupramunicipal: new FormControl(null, [
        Validators.required,
      ]),*/
      situationMap: new FormControl(null, [
        Validators.required,
      ]),
      scales: new FormControl(null, [
        Validators.required,
      ]),
      srs: new FormControl(null, [
        Validators.required,
      ]),
      treeAutoRefresh: new FormControl(null, [
        Validators.required,
      ]),
      _links: new FormControl(null, []),

    });

  }

  addNewApplication() {
    console.log(this.applicationForm.value);
    this.applicationService.create(this.applicationForm.value)
      .subscribe(resp => {
        console.log(resp);
        // this.router.navigate(["/company", resp.id, "formConnection"]);
      });
  }

  updateApplication() {

    console.log(this.applicationForm.value);
    const situationMap = {
      id: this.applicationID,
      name: this.applicationForm.value.name,
      type: this.applicationForm.value.type,
    }
    this.applicationForm.patchValue({
      situationMap: situationMap,
    });


    this.applicationService.update(this.applicationForm.value)
      .subscribe(resp => {
        console.log(resp);

      });

  }


  // AG-GRID


  // ******** Parameters configuration ******** //

  getAllParameters = (): Observable<any> => {
    return (this.http.get(`${this.applicationForm.value._links.parameters.href}`))
      .pipe(map(data => data[`_embedded`][`application-parameters`]));
  }

  removeParameters(data: any[]) {
    console.log(data);
  }

  newDataParameters(id: any) {
    // this.router.navigate(['territory', id, 'territoryForm']);
    console.log('screen in progress');
  }

  // ******** Template configuration ******** //

  getAllTemplates = (): Observable<any> => {
    //TODO Change the link when available
    // return (this.http.get(`${this.applicationForm.value._links.parameters.href}`))
    //   .pipe(map(data => data[`_embedded`][`application-parameters`]));
    const aux: Array<any> = [];
    return of(aux);
  }

  removeTemplates(data: any[]) {
    console.log(data);
  }

  newDataTemplates(id: any) {
    // this.router.navigate(['territory', id, 'territoryForm']);
    console.log('screen in progress');
  }


  // ******** Roles ******** //

  getAllRoles = (): Observable<any> => {
    return (this.http.get(`${this.applicationForm.value._links.availableRoles.href}`))
      .pipe(map(data => data[`_embedded`][`roles`]));
  }

  removeRoles(data: any[]) {
    console.log(data);
  }

  newDataRoles(id: any) {
    // this.router.navigate(['territory', id, 'territoryForm']);
    console.log('screen in progress');
  }


  // ******** Background ******** //

  getAllBackgrounds = (): Observable<any> => {
      var urlReq=`${this.applicationForm.value._links.backgrounds.href}`
      if(this.applicationForm.value._links.backgrounds.templated){
        var url=new URL(urlReq.split("{")[0]);
        url.searchParams.append("projection","view")
        urlReq=url.toString();
      }
  
      return (this.http.get(urlReq))
      .pipe( map( data =>  data['_embedded']['application-backgrounds']) );
  

  }

  removeBackgrounds(data: any[]) {
    console.log(data);
  }

  newDataBackgrounds(id: any) {
    // this.router.navigate(['territory', id, 'territoryForm']);
    console.log('screen in progress');
  }


  // ******** Parameters Dialog  ******** //

  getAllParametersDialog = () => {
    const aux: Array<any> = [];
    return of(aux);
    // return this.cartographyService.getAll();
  }

  openParametersDialog(data: any) {
 
    const dialogRef = this.dialog.open(DialogGridComponent);
    dialogRef.componentInstance.getAllsTable=[this.getAllParametersDialog];
    dialogRef.componentInstance.singleSelectionTable=[false];
    dialogRef.componentInstance.columnDefsTable=[this.columnDefsParametersDialog];
    dialogRef.componentInstance.themeGrid=this.themeGrid;
    dialogRef.componentInstance.title='Parameters';
    dialogRef.componentInstance.titlesTable=['Parameters'];
    dialogRef.componentInstance.nonEditable=false;
    


    dialogRef.afterClosed().subscribe(result => {
      if(result){
        if( result.event==='Add') {console.log(result.data); }
      }

    });

  }

      // ******** TemplatesConfiguration Dialog  ******** //

      getAllTemplatesConfigurationDialog = () => {
        const aux: Array<any> = [];
        return of(aux);
        // return this.cartographyService.getAll();
      }
    
      openTemplateConfigurationDialog(data: any) {
        const dialogRef = this.dialog.open(DialogGridComponent);
        dialogRef.componentInstance.getAllsTable=[this.getAllTemplatesConfigurationDialog];
        dialogRef.componentInstance.singleSelectionTable=[false];
        dialogRef.componentInstance.columnDefsTable=[this.columnDefsTemplateConfigurationDialog];
        dialogRef.componentInstance.themeGrid=this.themeGrid;
        dialogRef.componentInstance.title='Templates';
        dialogRef.componentInstance.titlesTable=['Templates'];
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


    // ******** Background Dialog  ******** //

    getAllBackgroundDialog = () => {
      const aux: Array<any> = [];
      return of(aux);
      // return this.cartographyService.getAll();
    }
  
    openBackgroundDialog(data: any) {
      const dialogRef = this.dialog.open(DialogGridComponent);
      dialogRef.componentInstance.getAllsTable=[this.getAllBackgroundDialog];
      dialogRef.componentInstance.singleSelectionTable=[false];
      dialogRef.componentInstance.columnDefsTable=[this.columnDefsBackgroundDialog];
      dialogRef.componentInstance.themeGrid=this.themeGrid;
      dialogRef.componentInstance.title='Background';
      dialogRef.componentInstance.titlesTable=['Background'];
      dialogRef.componentInstance.nonEditable=false;
      
  
  
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          if( result.event==='Add') {console.log(result.data); }
        }
  
      });
  
    }


}
