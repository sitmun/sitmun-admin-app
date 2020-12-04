import { Component, OnInit } from '@angular/core';
import { User } from 'dist/sitmun-frontend-core/user/user.model';
import { UserService } from 'dist/sitmun-frontend-core/';
import { UtilsService } from '../../services/utils.service';
import { BtnEditRenderedComponent } from 'dist/sitmun-frontend-gui/';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit  {


  columnDefs: any[];
  public frameworkComponents = {
    btnEditRendererComponent: BtnEditRenderedComponent
  };

    constructor(public userService: UserService,
                private utils: UtilsService,
                private router: Router
                ) {

    }

    
    ngOnInit()  {
      // this.headerNameColumnUser = await this.translate.get('user').toPromise();
      // this.headerNameColumnFirstName = await this.translate.get('firstname').toPromise();
      // this.headerNameColumnLastName = await this.translate.get('lastname').toPromise();
      // this.headerNameColumnStatus = await this.translate.get('status').toPromise();

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
          width: 65,
          lockPosition:true,
          cellRenderer: 'btnEditRendererComponent',
          cellRendererParams: {
            clicked: this.newData.bind(this)
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

    removeData( data: User[])
    {
      console.log(data);
    }

    newData(id: any)
    {
      this.router.navigate(['user', id, 'userForm']);
    }

    applyChanges( data: User[])
    {
      console.log(data);
    }

  }
