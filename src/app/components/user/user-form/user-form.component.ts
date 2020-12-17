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
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
 
  themeGrid:any=environment.agGridTheme;
  userForm: FormGroup;
  userToEdit;
  userID = -1;
  columnDefsPermissions: any[];
  columnDefsData: any[];
  dataLoaded: Boolean = false;

  public frameworkComponents = {
    btnEditRendererComponent: BtnEditRenderedComponent
  };
  
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private http: HttpClient,
    private utils: UtilsService,
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
      { headerName: this.utils.getTranslate('userEntity.code'),  field: 'code' },
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
      { headerName: this.utils.getTranslate('userEntity.territory'),  field: 'territory'},
      { headerName: this.utils.getTranslate('userEntity.position'),  field: 'position', },
      { headerName: this.utils.getTranslate('userEntity.organization'),  field: 'organization', },
      { headerName: this.utils.getTranslate('userEntity.mail'),  field: 'mail', },
      { headerName: this.utils.getTranslate('userEntity.field'),  field: 'caducity', },
      { headerName: this.utils.getTranslate('userEntity.dataCreated'),  field: 'dataCreated', },

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
     //TODO Arreglar problema de permisos
    // return (this.http.get(`${this.userForm.value._links.permissions.href}`))
    // .pipe( map( data =>  data['_embedded']['user-configurations']) );
    const aux:Array<any> = [];
    return of(aux);
  }

  removeDataPermissions( data)
  {
    console.log(data);
  }
  
  newDataPermissions(id: any)
  {
    // this.router.navigate(['territory', id, 'territoryForm']);
    console.log('screen in progress');
  }

  // ******** Data of Territory ******** //
   getAllData = (): Observable<any> => {
    //TODO Arreglar problema de permisos
    // return (this.http.get(`${this.userForm.value._links.permissions.href}`))
    // .pipe( map( data =>  data['_embedded']['user-configurations']) );
    const aux:Array<any> = [];
    return of(aux);
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
  

}
