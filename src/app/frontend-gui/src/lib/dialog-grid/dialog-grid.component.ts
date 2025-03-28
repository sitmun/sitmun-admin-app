import {Component, OnInit, Output, EventEmitter, inject} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface DialogGridData {
  title: string;
  themeGrid: any;
  getAllsTable: (() => Observable<any>)[];
  columnDefsTable: any[][];
  singleSelectionTable: boolean[];
  titlesTable: string[];
  orderTable: string[];
  nonEditable: boolean;
  addFieldRestriction?: any[];
  fieldRestrictionWithDifferentName?: any[];
  currentData: any[];
  changeHeightButton? : boolean;
  heightByDefault? : any;
}

export const DIALOG_GRID_EVENTS = {
  ADD: (data: any[]) => { return { event: 'Add', data: data } as DialogGridResult },
  CANCEL: { event: 'Cancel' } as DialogGridResult
} as const;

export interface DialogGridResult {
  event: 'Add' | 'Cancel';
  data?: any[];
}

export function isDialogGridAddEvent(result: DialogGridResult): boolean {
  return result.event === 'Add'
}

@Component({
  selector: 'app-dialog-grid',
  templateUrl: './dialog-grid.component.html',
  styles: []
})
export class DialogGridComponent implements OnInit {
  readonly data = inject<DialogGridData>(MAT_DIALOG_DATA);

  title: string;
  getAllRows: Subject<boolean> = new Subject <boolean>();
  tablesReceivedCounter: number;
  allRowsReceived: Array<any[]> = [];
  changeHeightButton : boolean;
  heightByDefault : any;

  //Inputs
  themeGrid: any;
  getAllsTable: (() => Observable<any>)[];
  columnDefsTable: any[][];
  singleSelectionTable: boolean[];
  titlesTable: string[];
  orderTable: string[] = [];
  addButtonClickedSubscription: Observable<boolean> ;
  nonEditable: boolean;
  addFieldRestriction: any[] = [];
  fieldRestrictionWithDifferentName: any[] = [];
  currentData: any[] = [];

  //Outputs
  @Output() joinTables : EventEmitter<any[][]>;

  constructor(private dialogRef: MatDialogRef<DialogGridComponent>) {
    this.joinTables = new EventEmitter();
    this.tablesReceivedCounter = 0;
   }

  ngOnInit() {
    if (this.data) {
      Object.assign(this, { ...this.data});
    }
    if (this.addButtonClickedSubscription) {
      this.addButtonClickedSubscription.subscribe(() => {
        this.getAllSelectedRows();
      });
    }
  }

  getAllSelectedRows() {
    this.getAllRows.next(true);
  }

  joinRowsReceived(data: any[])
  {
      this.allRowsReceived.push(data);
      this.tablesReceivedCounter++;
      if(this.tablesReceivedCounter === this.getAllsTable.length) {
        this.doAdd(this.allRowsReceived);
      }
  }

  doAdd(rowsToAdd: any[]){
    this.dialogRef.close(DIALOG_GRID_EVENTS.ADD(rowsToAdd));
  }

  closeDialog(){
    this.dialogRef.close(DIALOG_GRID_EVENTS.CANCEL);
  }
}
