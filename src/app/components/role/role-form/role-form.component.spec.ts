
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {of} from 'rxjs';

import {EntityFormAlertsComponent} from '@app/components/shared/entity-form-alerts/entity-form-alerts.component';
import {FormToolbarComponent} from '@app/components/shared/form-toolbar/form-toolbar.component';
import { ExternalConfigurationService } from '@app/core/config/external-configuration.service';
import {ExternalService, ResourceService} from '@app/core/hal';
import {
  ApplicationService, CartographyGroupService, CartographyService, CodeListService, RoleService,
  TaskService, TerritoryService, UserConfigurationService, UserService
} from '@app/domain';
import { SitmunFrontendGuiModule } from '@app/frontend-gui/src/lib/public_api';
import { MaterialModule } from '@app/material-module';
import {LoggerService} from '@app/services/logger.service';
import {configureLoggerForTests, provideErrorHandlerForTests} from '@app/testing/test-helpers';

import { RoleFormComponent } from './role-form.component';

describe('RoleFormComponent', () => {
  let component: RoleFormComponent;
  let fixture: ComponentFixture<RoleFormComponent>;

  beforeAll(async () => {
     
    await TestBed.configureTestingModule({
      teardown: { destroyAfterEach: 0 as any },
      declarations: [ RoleFormComponent, FormToolbarComponent ],
      imports: [FormsModule, ReactiveFormsModule,RouterModule.forRoot([], {}), SitmunFrontendGuiModule, EntityFormAlertsComponent, MaterialModule, RouterModule, MatIconTestingModule, BrowserAnimationsModule,
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: () => ({
            getTranslation: () => of({})
          })
        }
      })],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideErrorHandlerForTests(), RoleService, UserService, TerritoryService, ApplicationService, CodeListService,
        CartographyGroupService,UserConfigurationService, CartographyService, TaskService,ResourceService,ExternalService,
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService }, ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleFormComponent);
    component = fixture.componentInstance;
    // Suppress debug logs in tests to reduce console noise
    const loggerService = TestBed.inject(LoggerService);
    configureLoggerForTests(loggerService);

    if (!component.entityForm) {
      component.entityToEdit = component.empty();
      component.postFetchData();
    }
    fixture.detectChanges();
  });

  afterEach(() => fixture?.destroy());
  afterAll(() => TestBed.resetTestingModule());

  

  it('requires a name', () => {
    expect(component.entityForm.get('name')?.hasError('required')).toBe(true);
  });

  it('requires a name when a description is set', () => {
    component.entityForm.patchValue({
      description: 'missDescription',
    });
    expect(component.entityForm.get('name')?.hasError('required')).toBe(true);
  });

  it('accepts a name and a description', () => {
    component.entityForm.patchValue({
      name: 'name',
      description: 'description',
    });
    expect(component.entityForm.valid).toBe(true);
  });

  describe('Grid capability classification', () => {
    it('userConfigurationsTable should have picker, updater, and status capabilities (dual-target)', () => {
      const table = component['userConfigurationsTable'];
      expect(table.hasPickerAdd()).toBe(true);
      expect(table.hasRelationsUpdater()).toBe(true);
      expect(table.hasStatusColumn()).toBe(true);
      expect(table.hasTemplateDialogs()).toBe(false);
    });

    it('tasksTable should have picker, updater, and status capabilities', () => {
      const table = component['tasksTable'];
      expect(table.hasPickerAdd()).toBe(true);
      expect(table.hasRelationsUpdater()).toBe(true);
      expect(table.hasStatusColumn()).toBe(true);
      expect(table.hasTemplateDialogs()).toBe(false);
    });

    it('applicationsTable should have picker, updater, and status capabilities', () => {
      const table = component['applicationsTable'];
      expect(table.hasPickerAdd()).toBe(true);
      expect(table.hasRelationsUpdater()).toBe(true);
      expect(table.hasStatusColumn()).toBe(true);
      expect(table.hasTemplateDialogs()).toBe(false);
    });
  });

  describe('userConfigurationsTable field restrictions', () => {
    it('exposes composite restrictions including appliesToChildrenTerritories', () => {
      const table = component['userConfigurationsTable'];
      expect(table.addFieldRestriction).toEqual(['userId', 'territoryId', 'appliesToChildrenTerritories']);
    });
  });

  describe('userConfigurationsTable column types', () => {
    it('appliesToChildrenTerritories uses editable boolean renderer', () => {
      const columns = component['userConfigurationsTable'].relationsColumnsDefs;
      const col = columns.find((c: any) => c.field === 'appliesToChildrenTerritories');
      expect(col?.cellRenderer).toBe('btnCheckboxRendererComponent');
    });
  });

});

