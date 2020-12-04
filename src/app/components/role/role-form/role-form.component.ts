import { Component, OnInit } from '@angular/core';
import { tick } from '@angular/core/testing';
import { FormControl, FormGroup, Validators  } from '@angular/forms';
import {  ActivatedRoute,  Router} from '@angular/router';
import { RoleService, UserService, User } from 'dist/sitmun-frontend-core/';
import { Connection } from 'dist/sitmun-frontend-core/connection/connection.model';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from '../../../services/utils.service';
import { BtnEditRenderedComponent } from 'dist/sitmun-frontend-gui/';

@Component({
  selector: 'app-role-form',
  templateUrl: './role-form.component.html',
  styleUrls: ['./role-form.component.scss']
})
export class RoleFormComponent implements OnInit {

  columnDefs: any[];
  public frameworkComponents = {
    btnEditRendererComponent: BtnEditRenderedComponent
  };


  formRole: FormGroup;
  roleToEdit;
  stopID: number = -1;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private roleService: RoleService,
    private userService: UserService,
    private http: HttpClient,
    private utils: UtilsService,
    ) {
        this.initializeLayersPermitsForm();
    }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.stopID = +params.id;
      if (this.stopID !== -1){
        console.log(this.stopID);

        this.roleService.get(this.stopID).subscribe(
          resp => {
            console.log(resp);
            this.roleToEdit=resp;
            this.formRole.setValue({
                id:           this.stopID,
                name:         this.roleToEdit.name,
                description:  this.roleToEdit.description,
                _links:       this.roleToEdit._links
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
        width: 50,
        lockPosition:true,
      },
      {
        headerName: '',
        field: 'id',
        editable: false,
        filter: false,
        width: 70,
        lockPosition:true,
        cellRenderer: 'btnEditRendererComponent',
        cellRendererParams: {
          clicked: this.newDataUsers.bind(this)
        },
      },
      { headerName: 'ID',  field: 'id', editable: false},
      { headerName: this.utils.getTranslate('userEntity.user'), field: 'username' },
      { headerName: this.utils.getTranslate('userEntity.firstname'),  field: 'firstName' },
      { headerName: this.utils.getTranslate('userEntity.lastname'),  field: 'lastName'},
      { headerName: this.utils.getTranslate('userEntity.administrator'), field: 'administrator'},
      { headerName: this.utils.getTranslate('userEntity.blocked'), field: 'blocked'}
      // { headerName: this.translate.instant, field: 'username', checkboxSelection: true, },
      // { headerName: this.headerNameColumnFirstName,  field: 'firstName' },
      // { headerName: this.headerNameColumnLastName,  field: 'lastName'},
      // { headerName: this.headerNameColumnStatus, field: 'estat'},
    ];

  }


  initializeLayersPermitsForm(): void {

    this.formRole = new FormGroup({
      id: new FormControl(null, []),
      name: new FormControl(null, [
        Validators.required,
      ]),
      description: new FormControl(null, [
        Validators.required,
      ]),
      _links: new FormControl(null, []),

    })

  }

  addNewConnection() {
    console.log(this.formRole.value);
    this.roleService.create(this.formRole.value)
      .subscribe(resp => {
        console.log(resp);
        // this.router.navigate(["/company", resp.id, "formConnection"]);
      });


  }

  updateConnection() {

    console.log(this.formRole.value);

    this.roleService.update(this.formRole.value)
      .subscribe(resp => {
        console.log(resp);

      });

  }


  //AG GRID

     /*
      Important! Aquesta és la funció que li passarem al data grid a través de l'html per obtenir les files de la taula,
      de moment no he trobat cap altre manera de que funcioni sense posar la nomenclatura = () =>,
      pel que de moment hem dit de deixar-ho així!
    */
   getAllUsers = () => {

    return this.userService.getAll();
  }

  /*Les dues funcions que venen ara s'activaran quan es cliqui el botó de remove o el de new a la taula,
    si volguessim canviar el nom de la funció o qualsevol cosa, cal mirar l'html, allà es on es crida la funció
    corresponent!
  */

  removeDataUsers( data: User[])
  {
    console.log(data);
  }

  newDataUsers(id: any)
  {
    this.router.navigate(['user', id, 'userForm']);
  }



}