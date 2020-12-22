import { Component, OnInit } from '@angular/core';
import { tick } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceService } from 'dist/sitmun-frontend-core/';
import { Connection } from 'dist/sitmun-frontend-core/connection/connection.model';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from '../../../services/utils.service';
import { BtnEditRenderedComponent } from 'dist/sitmun-frontend-gui/';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MatChipInputEvent } from '@angular/material/chips';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-service-form',
  templateUrl: './service-form.component.html',
  styleUrls: ['./service-form.component.scss']
})
export class ServiceFormComponent implements OnInit {

  themeGrid: any = environment.agGridTheme;
  columnDefsLayers: any[];
  columnDefsParameters: any[];

  public frameworkComponents = {
    btnEditRendererComponent: BtnEditRenderedComponent
  };
  dataLoaded: Boolean = false;
  private parametersUrl: string;

  serviceForm: FormGroup;
  serviceToEdit;
  serviceID = -1;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  projections: Array<string>;
  serviceTypes: Array<any> = [];


  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private serviceService: ServiceService,
    private http: HttpClient,
    private utils: UtilsService,
    public dialog: MatDialog
  ) {
    this.initializeServiceForm();
    this.projections = [];
    this.activatedRoute.params.subscribe(params => {
      this.serviceID = +params.id;
      if (this.serviceID !== -1) {
        this.serviceService.get(this.serviceID).subscribe(
          resp => {
            console.log(resp);
            this.serviceToEdit = resp;
            if (this.serviceToEdit.supportedSRS !== null) {
              this.serviceToEdit.supportedSRS.forEach((projection) => {
                this.projections.push(projection);
              });

            }
            // this.projections = this.serviceToEdit.supportedSRS.split(';');
            this.parametersUrl = this.serviceToEdit._links.parameters.href;
            this.serviceForm.setValue({
              id: this.serviceID,
              name: this.serviceToEdit.name,
              type: this.serviceToEdit.type,
              serviceURL: this.serviceToEdit.serviceURL,
              connection: ' ',
              supportedSRS: ' ',
              metadataURL: this.serviceToEdit.getInformationURL,
              _links: this.serviceToEdit._links
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


  }

  ngOnInit(): void {


    let serviceTypeByDefault = {
      value: null,
      description: '-------'
    }
    this.serviceTypes.push(serviceTypeByDefault);

    this.utils.getCodeListValues('service.type').subscribe(
      resp => {
        this.serviceTypes.push(...resp);
      }
    );

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
      { headerName: this.utils.getTranslate('serviceEntity.name'), field: 'name' },
      { headerName: this.utils.getTranslate('serviceEntity.parameter'), field: 'type', },
      { headerName: this.utils.getTranslate('serviceEntity.value'), field: 'value' },

    ];

    this.columnDefsLayers = [

      {
        headerName: '',
        checkboxSelection: true,
        headerCheckboxSelection: true,
        editable: false,
        filter: false,
        width: 35,
        lockPosition: true,
      },
      { headerName: 'Id', field: 'id' },
      { headerName: this.utils.getTranslate('serviceEntity.name'), field: 'name' },
      { headerName: this.utils.getTranslate('serviceEntity.description'), field: 'description', },
      { headerName: this.utils.getTranslate('serviceEntity.status'), field: 'status' },

    ];

  }

  initializeServiceForm(): void {

    this.serviceForm = new FormGroup({
      id: new FormControl(null, []),
      name: new FormControl(null, [
        Validators.required,
      ]),
      type: new FormControl(null, [
        Validators.required,
      ]),
      serviceURL: new FormControl(null, [
        Validators.required,
      ]),
      connection: new FormControl(null, [
        Validators.required,
      ]),
      supportedSRS: new FormControl(null, [
        Validators.required,
      ]),
      metadataURL: new FormControl(null, [
        Validators.required,
      ]),
      _links: new FormControl(null, []),
    });

  }

  addProjection(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.projections.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeProjection(projection: string): void {
    const index = this.projections.indexOf(projection);

    if (index >= 0) {
      this.projections.splice(index, 1);
    }
  }



  addNewLayer() {
    // this.serviceForm.patchValue({
    //   supportedSRS: this.projections.join(';')
    // })
    this.serviceForm.patchValue({
      supportedSRS: this.projections
    });
    console.log(this.serviceForm.value);
    this.serviceService.create(this.serviceForm.value)
      .subscribe(resp => {
        console.log(resp);
        // this.router.navigate(["/company", resp.id, "formConnection"]);
      });


  }

  updateLayer() {
    // this.serviceForm.patchValue({
    //   supportedSRS: this.projections.join(';')
    // })
    this.serviceForm.patchValue({
      supportedSRS: this.projections
    });
    console.log(this.serviceForm.value);
    this.serviceService.update(this.serviceForm.value)
      .subscribe(resp => {
        console.log(resp);

      });

  }

  // AG-GRID

  // ******** Parameters configuration ******** //
  getAllParameters = (): Observable<any> => {
    return (this.http.get(`${this.serviceForm.value._links.parameters.href}`))
      .pipe(map(data => data[`_embedded`][`service-parameters`]));
  }

  removeParameters(data: any[]) {
    console.log(data);
  }

  newDataParameters(id: any) {
    // this.router.navigate(['territory', id, 'territoryForm']);
    console.log('screen in progress');
  }

  // ******** Layers ******** //
  getAllLayers = (): Observable<any> => {
    return (this.http.get(`${this.serviceForm.value._links.parameters.href}`))
      .pipe(map(data => data[`_embedded`][`service-parameters`]));
  }

  removeLayers(data: any[]) {
    console.log(data);
  }

  newDataLayers(id: any) {
    // this.router.navigate(['territory', id, 'territoryForm']);
    console.log('screen in progress');
  }

  // DIALOG-GRID

  openDialog() {
    // const dialogRef = this.dialog.open();

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log(`Dialog result: ${result}`);
    // });
  }



}