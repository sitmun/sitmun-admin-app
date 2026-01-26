import {CommonModule} from '@angular/common';
import {
  Component, 
  OnInit,
  HostBinding,
  inject
} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {
  MAT_DIALOG_DATA, 
  MatDialog, 
  MatDialogRef,
  MatDialogModule
} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTooltipModule} from '@angular/material/tooltip';

import {TranslateModule} from '@ngx-translate/core';
import { Observable, Subject, forkJoin, of, firstValueFrom } from 'rxjs';

import { LoadingOverlayService } from '@app/services/loading-overlay.service';

import {DataGridComponent} from '../data-grid/data-grid.component';

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
export async function openDialogGridWithPreload(
  dialog: MatDialog,
  loadingService: LoadingOverlayService,
  config: { panelClass?: string; data: DialogGridData }
): Promise<MatDialogRef<DialogGridComponent, DialogGridResult>> {
  const { data } = config;
  
  if (!data.getAllsTable || data.getAllsTable.length === 0) {
    return dialog.open(DialogGridComponent, config);
  }

  // Show loading overlay
  const overlay = loadingService.show({ message: 'Loading data...' });
  
  try {
    const dataObservables = data.getAllsTable.map(fn => fn());
    const results = await firstValueFrom(forkJoin(dataObservables));
    
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
    // Preserve setTimeout timing for dialog opening
    await new Promise(resolve => setTimeout(resolve, 100));
    return dialog.open(DialogGridComponent, preloadedConfig);
  } catch (error) {
    console.error('Error preloading data:', error);
    loadingService.hide(overlay);
    return dialog.open(DialogGridComponent, config);
  }
}

@Component({
    selector: 'app-dialog-grid',
    templateUrl: './dialog-grid.component.html',
    imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatTabsModule,
        MatTooltipModule,
        TranslateModule,
        DataGridComponent
    ],
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
