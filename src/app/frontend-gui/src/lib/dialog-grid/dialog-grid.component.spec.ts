import { readFileSync } from 'fs';
import { join } from 'path';

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

import { DIALOG_GRID_EVENTS, DialogGridComponent, calculateDialogWidth } from './dialog-grid.component';

const dialogGridTemplate = readFileSync(join(__dirname, 'dialog-grid.component.html'), 'utf8');

describe('calculateDialogWidth', () => {
  it('returns 640 floor when column defs are empty', () => {
    expect(calculateDialogWidth([])).toBe(640);
  });

  it('uses minWidth when width and maxWidth are absent', () => {
    expect(calculateDialogWidth([[{ minWidth: 200 }, { minWidth: 300 }]])).toBe(640);
  });

  it('sums explicit widths plus padding', () => {
    expect(calculateDialogWidth([[{ width: 56 }, { width: 200 }, { width: 400 }]])).toBe(724);
  });

  it('allocates extra width for flex columns beyond the floor', () => {
    const width = calculateDialogWidth([
      [{ width: 56 }, { flex: 1, minWidth: 400 }, { minWidth: 300 }]
    ]);
    expect(width).toBeGreaterThan(640);
  });

  it('does not max out width for a small flex table', () => {
    const maxWidth = Math.min(900, window.innerWidth * 0.9);
    const width = calculateDialogWidth([[{ width: 56 }, { flex: 1, minWidth: 80 }]]);
    expect(width).toBeLessThan(maxWidth);
  });
});

describe('DialogGridComponent', () => {
  let component: DialogGridComponent;
  let fixture: ComponentFixture<DialogGridComponent>;
  let dialogRefClose: jest.Mock;

  beforeEach(waitForAsync(() => {
    dialogRefClose = jest.fn();

    TestBed.configureTestingModule({
      imports: [
        DialogGridComponent,
        MatDialogModule,
        NoopAnimationsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: () => ({
              getTranslation: () => of({})
            })
          }
        })
      ],
      providers: [
        { provide: MatDialogRef, useValue: { close: dialogRefClose } },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        TranslateService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogGridComponent);
    component = fixture.componentInstance;
    component.getAllsTable = [];
    component.columnDefsTable = [];
    component.singleSelectionTable = [];
    component.titlesTable = ['Test Title'];
    component.title = 'Test Dialog';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getAllSelectedRows', () => {
    it('resets collection state before emitting', () => {
      component.allRowsReceived = [[{ id: 1 }]];
      component.tablesReceivedCounter = 1;
      const nextSpy = jest.spyOn(component.getAllRows, 'next');

      component.getAllSelectedRows();

      expect(component.allRowsReceived).toEqual([]);
      expect(component.tablesReceivedCounter).toBe(0);
      expect(nextSpy).toHaveBeenCalledWith(true);
    });
  });

  describe('joinRowsReceived', () => {
    it('closes with per-table selections for a single grid', () => {
      const selectedRows = [{ id: 1 }, { id: 2 }];
      component.getAllsTable = [() => of([])];

      component.joinRowsReceived(selectedRows);

      expect(dialogRefClose).toHaveBeenCalledWith(
        DIALOG_GRID_EVENTS.ADD([selectedRows])
      );
    });

    it('waits for all grids before closing with per-table selections', () => {
      const leftRows = [{ id: 1 }];
      const rightRows = [{ id: 2 }];
      component.getAllsTable = [() => of([]), () => of([])];

      component.joinRowsReceived(leftRows);
      expect(dialogRefClose).not.toHaveBeenCalled();

      component.joinRowsReceived(rightRows);
      expect(dialogRefClose).toHaveBeenCalledWith(
        DIALOG_GRID_EVENTS.ADD([leftRows, rightRows])
      );
    });

    it('does not append stale rows from prior collection attempts', () => {
      component.getAllsTable = [() => of([]), () => of([])];
      component.joinRowsReceived([{ id: 'stale' }]);

      component.getAllSelectedRows();
      component.joinRowsReceived([{ id: 'fresh-left' }]);
      component.joinRowsReceived([{ id: 'fresh-right' }]);

      expect(dialogRefClose).toHaveBeenCalledWith(
        DIALOG_GRID_EVENTS.ADD([[{ id: 'fresh-left' }], [{ id: 'fresh-right' }]])
      );
    });
  });

  describe('index guard helpers', () => {
    beforeEach(() => {
      component.orderTable = ['name', 'code'];
      component.addFieldRestriction = ['a', 'b'];
      component.currentData = ['x', 'y'];
      component.fieldRestrictionWithDifferentName = ['p', 'q'];
    });

    it('returns configured values for valid indexes', () => {
      expect(component.getOrderTable(0)).toBe('name');
      expect(component.getAddFieldRestriction(1)).toBe('b');
      expect(component.getCurrentData(0)).toBe('x');
      expect(component.getFieldRestrictionWithDifferentName(1)).toBe('q');
    });

    it('returns null when index equals array length', () => {
      expect(component.getOrderTable(2)).toBeNull();
      expect(component.getAddFieldRestriction(2)).toBeNull();
      expect(component.getCurrentData(2)).toBeNull();
      expect(component.getFieldRestrictionWithDifferentName(2)).toBeNull();
    });

    it('returns null for negative indexes', () => {
      expect(component.getOrderTable(-1)).toBeNull();
      expect(component.getAddFieldRestriction(-1)).toBeNull();
      expect(component.getCurrentData(-1)).toBeNull();
      expect(component.getFieldRestrictionWithDifferentName(-1)).toBeNull();
    });
  });

  describe('template', () => {
    it('preserves inactive tab content when multiple grids are shown', () => {
      expect(dialogGridTemplate).toContain('preserveContent="true"');
    });
  });
});
