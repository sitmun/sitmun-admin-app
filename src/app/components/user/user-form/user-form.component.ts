import { Component, OnInit } from '@angular/core';
import { tick } from '@angular/core/testing';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators  } from '@angular/forms';
import {  ActivatedRoute,  Router} from '@angular/router';
import { UserService } from 'dist/sitmun-frontend-core/';
import { Connection } from 'dist/sitmun-frontend-core/connection/connection.model';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from '../../../services/utils.service';
import { BtnEditRenderedComponent } from 'dist/sitmun-frontend-gui/';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {

  
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private http: HttpClient,
    private utils: UtilsService,
    ) {
        this.initializeConnectionForm();
    }


  userForm: FormGroup;
  userToEdit;
  userID = -1;

  columnDefsPermissions: any[];
  public frameworkComponents = {
    btnEditRendererComponent: BtnEditRenderedComponent
  };



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


          },
          error => {

          }
        );
      }

    },
    error => {

    });


    this.columnDefsPermissions = [

      // { headerName: 'ID',  field: 'id', editable: false},
      { headerName: this.utils.getTranslate('layersEntity.code'),  field: 'code' },
      { headerName: this.utils.getTranslate('layersEntity.territory'),  field: 'territory'},
      { headerName: this.utils.getTranslate('layersEntity.role'),  field: 'role', },

    ];

  }


  initializeConnectionForm(): void {

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
      console.log(this.userForm.get('administrator'));
      if(this.userForm.get('administrator')==null) {
        this.userForm.patchValue({
            administrator: false
        })
      }
      if(this.userForm.get('blocked')==null) {
        this.userForm.patchValue({
            blocked: false
        })
      }
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

      /*
    Important! Aquesta és la funció que li passarem al data grid a través de l'html per obtenir les files de la taula,
    de moment no he trobat cap altre manera de que funcioni sense posar la nomenclatura = () =>,
    pel que de moment hem dit de deixar-ho així!
  */
   getAllPermissions = (): Observable<any> => {
    return (this.http.get(`http://localhost:8080/api/users/${this.userID}/permissions`))
    .pipe( map( data =>  data['_embedded']['user-configurations']) );
  }
  
  /*Les dues funcions que venen ara s'activaran quan es cliqui el botó de remove o el de new a la taula,
    si volguessim canviar el nom de la funció o qualsevol cosa, cal mirar l'html, allà es on es crida la funció
    corresponent!
  */
  
  removeDataPermissions( data)
  {
    console.log(data);
  }
  
  newDataPermissions(id: any)
  {
    // this.router.navigate(['territory', id, 'territoryForm']);
    console.log('screen in progress');
  }
  

}
