import {
  Component, 
  OnInit,
  HostBinding,
  inject,
  Injectable
} from '@angular/core';
import { Observable, Subject, forkJoin, of } from 'rxjs';
import {
  MAT_DIALOG_DATA, 
  MatDialog, 
  MatDialogRef 
} from '@angular/material/dialog';
import { LoadingOverlayService } from '@app/services/loading-overlay.service';

export interface DialogGridData {
  title: string;
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

/**
 * Calculates optimal dialog width from column definitions
 */
function calculateDialogWidth(columnDefsTable: any[][]): number {
  const DEFAULT_COLUMN_WIDTH = 150;
  const ACTION_COLUMN_WIDTH = 120;
  const DIALOG_PADDING = 48;
  const SCROLLBAR_WIDTH = 20;
  const MIN_WIDTH = 500;
  const MAX_WIDTH = Math.min(900, window.innerWidth * 0.9);
  
  let maxWidth = 0;
  
  if (!columnDefsTable || columnDefsTable.length === 0) {
    return MIN_WIDTH;
  }
  
  for (const columnDefs of columnDefsTable) {
    let tableWidth = 0;
    
    for (const col of columnDefs || []) {
      if (col.width) {
        tableWidth += col.width;
      } else if (col.maxWidth) {
        tableWidth += col.maxWidth;
      } else if (col.field === 'actions' || col.field === 'action') {
        tableWidth += ACTION_COLUMN_WIDTH;
      } else {
        tableWidth += DEFAULT_COLUMN_WIDTH;
      }
    }
    
    maxWidth = Math.max(maxWidth, tableWidth);
  }
  
  const calculatedWidth = maxWidth + DIALOG_PADDING + SCROLLBAR_WIDTH;
  return Math.max(MIN_WIDTH, Math.min(calculatedWidth, MAX_WIDTH));
}

/**
 * Opens dialog with pre-loaded data to avoid visual glitches
 * @param dialog MatDialog service
 * @param loadingService LoadingOverlayService for showing spinner
 * @param config Dialog configuration
 * @returns Promise resolving to dialogRef
 */
export function openDialogGridWithPreload(
  dialog: MatDialog,
  loadingService: LoadingOverlayService,
  config: { panelClass?: string; data: DialogGridData }
): Promise<MatDialogRef<DialogGridComponent, DialogGridResult>> {
  return new Promise((resolve) => {
    const { data } = config;
    
    if (!data.getAllsTable || data.getAllsTable.length === 0) {
      const dialogRef = dialog.open(DialogGridComponent, config);
      resolve(dialogRef);
      return;
    }

    // Show loading overlay
    const overlay = loadingService.show({ message: 'Loading data...' });
    
    const dataObservables = data.getAllsTable.map(fn => fn());
    
    forkJoin(dataObservables).subscribe({
      next: (results) => {
        // Replace getAllsTable with functions that return pre-loaded data
        const preloadedGetAlls = results.map(result => () => of(result));
        
        // Calculate optimal width before opening
        const maxWidth = calculateDialogWidth(data.columnDefsTable);
        
        const preloadedConfig = {
          ...config,
          width: `${maxWidth}px`,
          data: {
            ...data,
            getAllsTable: preloadedGetAlls,
            currentData: data.currentData || []
          }
        };
        
        // Remove loading overlay and open dialog
        loadingService.hide(overlay);
        setTimeout(() => {
          const dialogRef = dialog.open(DialogGridComponent, preloadedConfig);
          resolve(dialogRef);
        }, 100);
      },
      error: (error) => {
        console.error('Error preloading data:', error);
        loadingService.hide(overlay);
        const dialogRef = dialog.open(DialogGridComponent, config);
        resolve(dialogRef);
      }
    });
  });
}

@Component({
  selector: 'app-dialog-grid',
  templateUrl: './dialog-grid.component.html',
  styles: [`
    :host {
      display: block;
    }

    :host.loading h2 {
      visibility: hidden;
    }

    :host.loading mat-dialog-actions {
      visibility: hidden;
    }

    :host.loading .content-container {
      display: none;
    }

    mat-dialog-content {
      overflow: auto;
      display: flex;
      flex-direction: column;
      min-height: 300px;
    }

    .loading-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 300px;
      width: 100%;
      position: relative;
      z-index: 1000;
    }

    .loading-container mat-spinner {
      position: relative;
      z-index: 1001;
    }

    .content-container {
      display: flex;
      flex-direction: column;
      width: 100%;
    }

    mat-card {
      margin-bottom: 16px;
    }

    mat-tab-group {
      flex: 1;
      overflow: hidden;
    }
  `]
})
export class DialogGridComponent implements OnInit {
  readonly data = inject<DialogGridData>(MAT_DIALOG_DATA);

  @HostBinding('class.loading') get isLoading() {
    return !this.contentVisible;
  }

  title: string;
  getAllRows: Subject<boolean> = new Subject <boolean>();
  tablesReceivedCounter: number;
  allRowsReceived: Array<any[]> = [];
  changeHeightButton : boolean;
  heightByDefault : any;
  contentVisible = false;

  //Inputs
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

  constructor(private dialogRef: MatDialogRef<DialogGridComponent>) {
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
    
    // Data is already preloaded and width is set via openDialogGridWithPreload
    // Show content immediately
    this.contentVisible = true;
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

  getOrderTable(index: number): string | null {
    return this.orderTable.length >= index ? 
      this.orderTable[index] : null;
  }

  getAddFieldRestriction(index: number): any {
    return this.addFieldRestriction.length >= index ? 
      this.addFieldRestriction[index] : null;
  }

  getCurrentData(index: number): any {
    return this.currentData.length >= index ? 
      this.currentData[index] : null;
  }

  getFieldRestrictionWithDifferentName(index: number): any {
    return this.fieldRestrictionWithDifferentName.length >= index ? 
      this.fieldRestrictionWithDifferentName[index] : null;
  }

}
