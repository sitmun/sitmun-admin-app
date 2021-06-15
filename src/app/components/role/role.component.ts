import { Component, OnInit } from '@angular/core';
import { RoleService, Role} from 'dist/sitmun-frontend-core/';
import { UtilsService } from '../../services/utils.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { config } from 'src/config';
import { Observable, Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogMessageComponent } from 'dist/sitmun-frontend-gui/';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {
  saveAgGridStateEvent: Subject<boolean> = new Subject<boolean>();
  dataUpdatedEvent: Subject<boolean> = new Subject <boolean>();
  themeGrid: any = config.agGridTheme;
  columnDefs: any[];
  gridModified = false;

  constructor(public dialog: MatDialog,
    public roleService: RoleService,
    private utils: UtilsService,
    private router: Router,
  ) { }


  ngOnInit() {

    var columnEditBtn=this.utils.getEditBtnColumnDef();
    columnEditBtn['cellRendererParams']= {
      clicked: this.newData.bind(this)
    }

    this.columnDefs = [
      this.utils.getSelCheckboxColumnDef(),
      columnEditBtn,
      this.utils.getIdColumnDef(),
      this.utils.getEditableColumnDef('roleEntity.name', 'name'),
      this.utils.getEditableColumnDef('roleEntity.note', 'description'),
      // { headerName: this.utils.getTranslate('application'),  field: 'application' },
    ];
  }

  async canDeactivate(): Promise<boolean | Observable<boolean>> {

    if (this.gridModified) {


      let result = await this.utils.showNavigationOutDialog().toPromise();
      if(!result || result.event!=='Accept') { return false }
      else if(result.event ==='Accept') {return true;}
      else{
        return true;
      }
    }
    else return true
  }	

  setGridModifiedValue(value){
    this.gridModified=value;
  }
  

  getAllRoles = () => {
    return this.roleService.getAll();
  };

  newData(id: any) {
    this.saveAgGridStateEvent.next(true);
    this.router.navigate(['role', id, 'roleForm']);
  }

  applyChanges(data: Role[]) {
    const promises: Promise<any>[] = [];
    data.forEach(role => {
      promises.push(new Promise((resolve, reject) => {​​​​​​​ this.roleService.update(role).subscribe((resp) =>{​​​​​​​resolve(true)}​​​​​​​)}​​​​​​​));
      Promise.all(promises).then(() => {
        this.dataUpdatedEvent.next(true);
      });
    });
  }

  add(data: Role[]) {
    this.router.navigate(['role', -1, 'roleForm', data[0].id]);
    // const promises: Promise<any>[] = [];
    // data.forEach(role => {
    //   role.id = null;
    //   role.name = this.utils.getTranslate('copy_').concat(role.name)
    //   promises.push(new Promise((resolve, reject) => {​​​​​​​ this.roleService.create(role).subscribe((resp) =>{​​​​​​​resolve(true)}​​​​​​​)}​​​​​​​));
    //   Promise.all(promises).then(() => {
    //     this.dataUpdatedEvent.next(true);
    //   });
    // });

  }

  removeData(data: Role[]) {
    const dialogRef = this.dialog.open(DialogMessageComponent);
    dialogRef.componentInstance.title=this.utils.getTranslate("caution");
    dialogRef.componentInstance.message=this.utils.getTranslate("removeMessage");
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        if(result.event==='Accept') {  
          const promises: Promise<any>[] = [];
          data.forEach(role => {
            promises.push(new Promise((resolve, reject) => {​​​​​​​ this.roleService.delete(role).subscribe((resp) =>{​​​​​​​resolve(true)}​​​​​​​)}​​​​​​​));
            Promise.all(promises).then(() => {
              this.dataUpdatedEvent.next(true);
            });
          });
       }
      }
    });



  }

}
