import { Component, OnInit } from '@angular/core';
import { tick } from '@angular/core/testing';
import { FormControl, FormGroup, Validators  } from '@angular/forms';
import {  ActivatedRoute,  Router} from '@angular/router';
import { CartographyGroupService, RoleService, Role } from 'dist/sitmun-frontend-core/';
import { Connection } from 'dist/sitmun-frontend-core/connection/connection.model';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from '../../../services/utils.service';
import { BtnEditRenderedComponent } from 'dist/sitmun-frontend-gui/';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-layers-permits-form',
  templateUrl: './layers-permits-form.component.html',
  styleUrls: ['./layers-permits-form.component.scss']
})
export class LayersPermitsFormComponent implements OnInit {

  columnDefs: any[];
  public frameworkComponents = {
    btnEditRendererComponent: BtnEditRenderedComponent
  };
  formLayersPermits: FormGroup;
  layersPermitsToEdit;
  layersPermitsID = -1;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cartographyGroupService: CartographyGroupService,
    private roleService: RoleService,
    private http: HttpClient,
    private utils: UtilsService,
    ) {
        this.initializeLayersPermitsForm();
    }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.layersPermitsID = +params.id;
      if (this.layersPermitsID !== -1){
        console.log(this.layersPermitsID);

        this.cartographyGroupService.get(this.layersPermitsID).subscribe(
          resp => {
            console.log(resp);
            this.layersPermitsToEdit=resp;
            this.formLayersPermits.setValue({
                id:       this.layersPermitsID,
                name:     this.layersPermitsToEdit.name,
                type:   this.layersPermitsToEdit.type,
                _links:   this.layersPermitsToEdit._links
              });


          },
          error => {

          }
        );
      }

    },
    error => {

    });



    this.columnDefs = [
      {
        headerName: '',
        checkboxSelection: true,
        headerCheckboxSelection: true,
        editable: false,
        filter: false,
        width: 40,
        lockPosition:true,
      },
      {
        headerName: '',
        field: 'id',
        editable: false,
        filter: false,
        width: 40,
        lockPosition:true,
        cellRenderer: 'btnEditRendererComponent',
        cellRendererParams: {
          clicked: this.newDataRole.bind(this)
        },
      },
      { headerName: 'ID',  field: 'id', editable: false},
      { headerName: this.utils.getTranslate('roleEntity.name'),  field: 'name'},
      { headerName: this.utils.getTranslate('roleEntity.note'),  field: 'description' },
     // { headerName: this.utils.getTranslate('application'),  field: 'application' },
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

       /*
      Important! Aquesta és la funció que li passarem al data grid a través de l'html per obtenir les files de la taula,
      de moment no he trobat cap altre manera de que funcioni sense posar la nomenclatura = () =>,
      pel que de moment hem dit de deixar-ho així!
    */
    getAllRoles = () => {
      return (this.http.get(`http://localhost:8080/api/cartography-groups/${this.layersPermitsID}/roles`))
      .pipe( map( data =>  data['_embedded']['roles']) );
  }
  
    /*Les dues funcions que venen ara s'activaran quan es cliqui el botó de remove o el de new a la taula,
      si volguessim canviar el nom de la funció o qualsevol cosa, cal mirar l'html, allà es on es crida la funció
      corresponent!
    */
  
  removeDataRole( data: Role[])
  {
    console.log(data);
  }
  
  newDataRole(id: any)
  {
    this.router.navigate(['role', id, 'roleForm']);
  }
  
  applyChangesRole( data: Role[])
  {
        console.log(data);
  }

}


