import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Role } from 'dist/sitmun-frontend-core/role/role.model';
import { RoleService } from 'dist/sitmun-frontend-core/';
import { ApplicationService } from 'dist/sitmun-frontend-core/';
import { BtnEditRenderedComponent, DialogGridComponent } from 'dist/sitmun-frontend-gui/';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-prova-dialog',
  templateUrl: './prova-dialog.component.html',
  styleUrls: ['./prova-dialog.component.scss']
})
export class ProvaDialogComponent{

  buttonAddClicked: Subject<boolean> = new Subject <boolean>();
  themeGrid: any = environment.agGridTheme;
  getAlls: Array<() => Observable<any>> = [];
  colDefs: Array<any[]> = [];
  singleSelectionTable: Array<boolean> = [];
  titlesTable: Array<string> = [];
  public frameworkComponents = {
    btnEditRendererComponent: BtnEditRenderedComponent
  };
columnDefs = [
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
    { headerName: 'Name', field: 'name' },
    { headerName: 'CreatedDAte', field: 'createdDate'} //  valueFormatter: this.dateFormatter,
  ];



  constructor(public dialog: MatDialog,
              private http: HttpClient,
              public applicationService: ApplicationService,
              ) {
                console.log('TAMO EN PRUEBA O NO');
                this.getAlls.push(this.getAllApplications);
                this.getAlls.push(this.getAllApplications);
                this.getAlls.push(this.getAllApplications);
                this.colDefs.push(this.columnDefs);
                this.colDefs.push(this.columnDefs);
                this.colDefs.push(this.columnDefs);
                this.singleSelectionTable.push(true);
                this.singleSelectionTable.push(false);
                this.singleSelectionTable.push(false);
                this.titlesTable.push('Table1');
                this.titlesTable.push('Table2');
                this.titlesTable.push('Table3');
  }


  getAllApplications = () => {
    return this.applicationService.getAll();
  }

  joinTables(data: any[]){
      console.log(data);
  }

  onAddButtonClicked()
  {

    const dialogRef = this.dialog.open(DialogGridComponent);
    dialogRef.componentInstance.getAllsTable=this.getAlls;
    dialogRef.componentInstance.singleSelectionTable=this.singleSelectionTable;
    dialogRef.componentInstance.columnDefsTable=this.colDefs;
    dialogRef.componentInstance.themeGrid=this.themeGrid;
    dialogRef.componentInstance.title='TITLE';
    dialogRef.componentInstance.titlesTable=this.titlesTable;



    dialogRef.afterClosed().subscribe(result => {
      if(result.event==='Add') {      console.log(result.data); }
      else { console.log(' Cancelled ');}

    });
  }


}


 