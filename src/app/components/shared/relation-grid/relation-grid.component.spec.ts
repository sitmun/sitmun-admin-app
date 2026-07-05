import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of, ReplaySubject, Subject } from 'rxjs';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { RelationGridComponent } from './relation-grid.component';
import { DataGridComponent, GridEventType } from '@app/frontend-gui/src/lib/data-grid/data-grid.component';
import { RelationGridTable } from '../../data-tables.util';

describe('RelationGridComponent', () => {
  let component: RelationGridComponent;
  let fixture: ComponentFixture<RelationGridComponent>;
  let mockTable: RelationGridTable;

  beforeEach(async () => {
    mockTable = {
      relationsColumnsDefs: [{ field: 'name' }],
      relationsFetchFn: () => of([]),
      addCommandEvent$: new Subject(),
      saveCommandEvent$: new Subject<GridEventType>(),
      refreshCommandEvent$: new ReplaySubject<boolean>(1),
      defaultRelationsSorting: () => ['name'],
      openDialog: jest.fn(),
      openTemplateDialog: jest.fn(),
      handleSaveRelations: jest.fn(),
      duplicateRelations: jest.fn(),
      hasPickerAdd: jest.fn().mockReturnValue(true),
      hasRelationsUpdater: jest.fn().mockReturnValue(true),
      hasStatusColumn: jest.fn().mockReturnValue(true),
      hasTemplateDialogs: jest.fn().mockReturnValue(false),
      supportsDuplicate: jest.fn().mockReturnValue(false),
      save: jest.fn(),
      complete: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [
        RelationGridComponent,
        DataGridComponent,
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
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RelationGridComponent);
    component = fixture.componentInstance;
    component.table = mockTable;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('picker/status table', () => {
    beforeEach(() => {
      (mockTable.hasPickerAdd as jest.Mock).mockReturnValue(true);
      (mockTable.hasStatusColumn as jest.Mock).mockReturnValue(true);
      (mockTable.hasRelationsUpdater as jest.Mock).mockReturnValue(true);
      fixture.detectChanges();
    });

    it('should pass addButton true when picker add is available', () => {
      const dataGridDE = fixture.debugElement.query(By.directive(DataGridComponent));
      const dataGridComponent = dataGridDE.componentInstance as DataGridComponent;
      expect(dataGridComponent.addButton).toBe(true);
    });

    it('should pass deleteButton true when status column is present', () => {
      const dataGridDE = fixture.debugElement.query(By.directive(DataGridComponent));
      const dataGridComponent = dataGridDE.componentInstance as DataGridComponent;
      expect(dataGridComponent.deleteButton).toBe(true);
    });

    it('should pass actionButton true', () => {
      const dataGridDE = fixture.debugElement.query(By.directive(DataGridComponent));
      const dataGridComponent = dataGridDE.componentInstance as DataGridComponent;
      expect(dataGridComponent.actionButton).toBe(true);
    });

    it('should pass hideDuplicateButton true', () => {
      const dataGridDE = fixture.debugElement.query(By.directive(DataGridComponent));
      const dataGridComponent = dataGridDE.componentInstance as DataGridComponent;
      expect(dataGridComponent.hideDuplicateButton).toBe(true);
    });

    it('should pass hideReplaceButton true', () => {
      const dataGridDE = fixture.debugElement.query(By.directive(DataGridComponent));
      const dataGridComponent = dataGridDE.componentInstance as DataGridComponent;
      expect(dataGridComponent.hideReplaceButton).toBe(true);
    });
  });

  describe('read-only mode', () => {
    beforeEach(() => {
      component.readOnly = true;
      (mockTable.hasPickerAdd as jest.Mock).mockReturnValue(true);
      (mockTable.hasStatusColumn as jest.Mock).mockReturnValue(true);
      (mockTable.hasRelationsUpdater as jest.Mock).mockReturnValue(true);
      fixture.detectChanges();
    });

    it('should suppress add button when read-only', () => {
      expect(component.showAddButton).toBe(false);
      const dataGridDE = fixture.debugElement.query(By.directive(DataGridComponent));
      const dataGridComponent = dataGridDE.componentInstance as DataGridComponent;
      expect(dataGridComponent.addButton).toBe(false);
    });

    it('should suppress delete button when read-only', () => {
      expect(component.showDeleteButton).toBe(false);
      const dataGridDE = fixture.debugElement.query(By.directive(DataGridComponent));
      const dataGridComponent = dataGridDE.componentInstance as DataGridComponent;
      expect(dataGridComponent.deleteButton).toBe(false);
    });

    it('should not wire save event subscriptions when read-only', () => {
      expect(component.shouldWireSave).toBe(false);
      const dataGridDE = fixture.debugElement.query(By.directive(DataGridComponent));
      const dataGridComponent = dataGridDE.componentInstance as DataGridComponent;
      expect(dataGridComponent.eventAddItemsSubscription).toBeUndefined();
      expect(dataGridComponent.eventGetAllRowsSubscription).toBeUndefined();
    });
  });

  describe('save-capable table', () => {
    beforeEach(() => {
      (mockTable.hasRelationsUpdater as jest.Mock).mockReturnValue(true);
      fixture.detectChanges();
    });

    it('should wire eventAddItemsSubscription when save-capable', () => {
      const dataGridDE = fixture.debugElement.query(By.directive(DataGridComponent));
      const dataGridComponent = dataGridDE.componentInstance as DataGridComponent;
      expect(dataGridComponent.eventAddItemsSubscription).toBeDefined();
      // Observables from asObservable() create new instances each time, so we can't compare directly
      // Just check it's an Observable by checking if it has a subscribe method
      expect(typeof dataGridComponent.eventAddItemsSubscription?.subscribe).toBe('function');
    });

    it('should wire eventGetAllRowsSubscription when save-capable', () => {
      const dataGridDE = fixture.debugElement.query(By.directive(DataGridComponent));
      const dataGridComponent = dataGridDE.componentInstance as DataGridComponent;
      expect(dataGridComponent.eventGetAllRowsSubscription).toBeDefined();
      // Observables from asObservable() create new instances each time, so we can't compare directly
      // Just check it's an Observable by checking if it has a subscribe method
      expect(typeof dataGridComponent.eventGetAllRowsSubscription?.subscribe).toBe('function');
    });

    it('should wire getAllRows output when save-capable', () => {
      const dataGrid = fixture.debugElement.query(el => el.name === 'app-data-grid');
      expect(dataGrid.listeners.find((l: any) => l.name === 'getAllRows')).toBeDefined();
    });
  });

  describe('table without updater', () => {
    beforeEach(() => {
      (mockTable.hasRelationsUpdater as jest.Mock).mockReturnValue(false);
      fixture.detectChanges();
    });

    it('should not wire save subscriptions when no updater', () => {
      expect(component.shouldWireSave).toBe(false);
      const dataGrid = fixture.debugElement.query(el => el.name === 'app-data-grid');
      expect(dataGrid.properties['eventAddItemsSubscription']).toBeUndefined();
      expect(dataGrid.properties['eventGetAllRowsSubscription']).toBeUndefined();
    });
  });

  describe('ViewChild dataGrid', () => {
    it('should expose inner DataGridComponent', () => {
      fixture.detectChanges();
      // ViewChild is populated after view init
      expect(component.dataGrid).toBeDefined();
    });
  });

  describe('imperative read API', () => {
    it('should return empty rowData when inner grid is unavailable', () => {
      expect(component.rowData).toEqual([]);
    });

    it('should return empty array from getAllCurrentData when inner grid is unavailable', () => {
      expect(component.getAllCurrentData()).toEqual([]);
    });

    it('should delegate rowData to inner DataGridComponent', () => {
      fixture.detectChanges();
      const rows = [{ id: 1, name: 'Tree A' }];
      (component.dataGrid as DataGridComponent).rowData = rows;
      expect(component.rowData).toBe(rows);
    });

    it('should delegate getAllCurrentData to inner DataGridComponent', () => {
      fixture.detectChanges();
      const rows = [{ id: 2, name: 'App B', status: 'pendingModify' }];
      jest.spyOn(component.dataGrid as DataGridComponent, 'getAllCurrentData').mockReturnValue(rows);
      expect(component.getAllCurrentData()).toEqual(rows);
    });
  });

  describe('template-dialog table', () => {
    beforeEach(() => {
      component.templateDialogName = 'newParameterDialog';
      (mockTable.hasPickerAdd as jest.Mock).mockReturnValue(false);
      (mockTable.hasTemplateDialogs as jest.Mock).mockReturnValue(true);
      (mockTable.hasRelationsUpdater as jest.Mock).mockReturnValue(true);
      (mockTable.hasStatusColumn as jest.Mock).mockReturnValue(true);
      fixture.detectChanges();
    });

    it('should pass newButton true for template-dialog tables', () => {
      const dataGrid = fixture.debugElement.query(By.directive(DataGridComponent)).componentInstance as DataGridComponent;
      expect(dataGrid.newButton).toBe(true);
    });

    it('should call openTemplateDialog when new event is emitted', () => {
      const dataGrid = fixture.debugElement.query(el => el.name === 'app-data-grid');
      dataGrid.triggerEventHandler('new', 0);

      expect(mockTable.openTemplateDialog).toHaveBeenCalledWith('newParameterDialog');
    });

    it('should not show newButton when templateDialogName is unset', () => {
      component.templateDialogName = undefined;
      fixture.detectChanges();

      const dataGrid = fixture.debugElement.query(By.directive(DataGridComponent)).componentInstance as DataGridComponent;
      expect(dataGrid.newButton).toBe(false);
    });
  });

  describe('duplicate-capable table', () => {
    beforeEach(() => {
      (mockTable.supportsDuplicate as jest.Mock).mockReturnValue(true);
      fixture.detectChanges();
    });

    it('should expose duplicate when table supports duplicate', () => {
      const dataGrid = fixture.debugElement.query(By.directive(DataGridComponent)).componentInstance as DataGridComponent;
      expect(dataGrid.hideDuplicateButton).toBe(false);
    });

    it('should call duplicateRelations when duplicate event is emitted', () => {
      const rows = [{ id: 1 }];
      const dataGrid = fixture.debugElement.query(el => el.name === 'app-data-grid');
      dataGrid.triggerEventHandler('duplicate', rows);

      expect(mockTable.duplicateRelations).toHaveBeenCalledWith(rows);
    });
  });

  describe('read-only template-dialog and duplicate', () => {
    beforeEach(() => {
      component.readOnly = true;
      component.templateDialogName = 'newParameterDialog';
      (mockTable.hasTemplateDialogs as jest.Mock).mockReturnValue(true);
      (mockTable.supportsDuplicate as jest.Mock).mockReturnValue(true);
      fixture.detectChanges();
    });

    it('should suppress new and duplicate controls when read-only', () => {
      const dataGrid = fixture.debugElement.query(By.directive(DataGridComponent)).componentInstance as DataGridComponent;
      expect(component.showNewButton).toBe(false);
      expect(component.showDuplicateButton).toBe(false);
      expect(dataGrid.newButton).toBe(false);
      expect(dataGrid.hideDuplicateButton).toBe(true);
    });
  });

  describe('default button visibility', () => {
    it('should show add button when not read-only and table has picker add', () => {
      component.readOnly = false;
      (mockTable.hasPickerAdd as jest.Mock).mockReturnValue(true);
      expect(component.showAddButton).toBe(true);
    });

    it('should hide add button when table has no picker add', () => {
      component.readOnly = false;
      (mockTable.hasPickerAdd as jest.Mock).mockReturnValue(false);
      expect(component.showAddButton).toBe(false);
    });

    it('should show delete button when not read-only and table has status column', () => {
      component.readOnly = false;
      (mockTable.hasStatusColumn as jest.Mock).mockReturnValue(true);
      expect(component.showDeleteButton).toBe(true);
    });

    it('should hide delete button when table has no status column', () => {
      component.readOnly = false;
      (mockTable.hasStatusColumn as jest.Mock).mockReturnValue(false);
      expect(component.showDeleteButton).toBe(false);
    });
  });

  describe('button overrides', () => {
    it('should use explicit addButton value when provided', () => {
      component.addButton = false;
      (mockTable.hasPickerAdd as jest.Mock).mockReturnValue(true);
      expect(component.showAddButton).toBe(false);
    });

    it('should use explicit deleteButton value when provided', () => {
      component.deleteButton = false;
      (mockTable.hasStatusColumn as jest.Mock).mockReturnValue(true);
      expect(component.showDeleteButton).toBe(false);
    });

    it('should use explicit duplicateButton false when table supports duplicate', () => {
      component.duplicateButton = false;
      (mockTable.supportsDuplicate as jest.Mock).mockReturnValue(true);
      fixture.detectChanges();

      const dataGrid = fixture.debugElement.query(By.directive(DataGridComponent)).componentInstance as DataGridComponent;
      expect(component.showDuplicateButton).toBe(false);
      expect(dataGrid.hideDuplicateButton).toBe(true);
    });
  });

  describe('register button', () => {
    it('should pass registerButton and newStatusRegister to inner grid when enabled', () => {
      component.registerButton = true;
      component.newStatusRegister = 'pendingRegistration';
      fixture.detectChanges();

      const dataGrid = fixture.debugElement.query(By.directive(DataGridComponent)).componentInstance as DataGridComponent;
      expect(component.showRegisterButton).toBe(true);
      expect(dataGrid.registerButton).toBe(true);
      expect(dataGrid.newStatusRegister).toBe('pendingRegistration');
    });

    it('should suppress register button when read-only', () => {
      component.registerButton = true;
      component.newStatusRegister = 'pendingRegistration';
      component.readOnly = true;
      fixture.detectChanges();

      const dataGrid = fixture.debugElement.query(By.directive(DataGridComponent)).componentInstance as DataGridComponent;
      expect(component.showRegisterButton).toBe(false);
      expect(dataGrid.registerButton).toBe(false);
    });
  });

  describe('default inputs', () => {
    it('should default globalSearch to true', () => {
      expect(component.globalSearch).toBe(true);
    });

    it('should pass globalSearch true to DataGridComponent by default', () => {
      fixture.detectChanges();
      const dataGridDE = fixture.debugElement.query(By.directive(DataGridComponent));
      const dataGridComponent = dataGridDE.componentInstance as DataGridComponent;
      expect(dataGridComponent.globalSearch).toBe(true);
    });

    it('should pass explicit globalSearch false to DataGridComponent', () => {
      component.globalSearch = false;
      fixture.detectChanges();
      const dataGridDE = fixture.debugElement.query(By.directive(DataGridComponent));
      const dataGridComponent = dataGridDE.componentInstance as DataGridComponent;
      expect(dataGridComponent.globalSearch).toBe(false);
    });

    it('should default changeHeightButton to true', () => {
      expect(component.changeHeightButton).toBe(true);
    });

    it('should pass changeHeightButton true to DataGridComponent by default', () => {
      fixture.detectChanges();
      const dataGridDE = fixture.debugElement.query(By.directive(DataGridComponent));
      const dataGridComponent = dataGridDE.componentInstance as DataGridComponent;
      expect(dataGridComponent.changeHeightButton).toBe(true);
    });

    it('should pass explicit changeHeightButton false to DataGridComponent', () => {
      component.changeHeightButton = false;
      fixture.detectChanges();
      const dataGridDE = fixture.debugElement.query(By.directive(DataGridComponent));
      const dataGridComponent = dataGridDE.componentInstance as DataGridComponent;
      expect(dataGridComponent.changeHeightButton).toBe(false);
    });
  });
});
