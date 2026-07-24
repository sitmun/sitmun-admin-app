import { readFileSync } from 'fs';
import { join } from 'path';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {of} from 'rxjs';

import {FormToolbarComponent} from '@app/components/shared/form-toolbar/form-toolbar.component';
import { ExternalConfigurationService } from '@app/core/config/external-configuration.service';
import {ExternalService, ResourceService} from '@app/core/hal';
import {
  ApplicationBackgroundService,
  ApplicationService,
  BackgroundService,
  CartographyGroupService,
  CartographyService,
  CodeListService,
  RoleService,
  TranslationService
} from '@app/domain';
import { SitmunFrontendGuiModule } from '@app/frontend-gui/src/lib/public_api';
import { MaterialModule } from '@app/material-module';
import {LoggerService} from '@app/services/logger.service';
import {configureLoggerForTests, provideErrorHandlerForTests} from '@app/testing/test-helpers';

import { BackgroundLayersFormComponent } from './background-layers-form.component';

const backgroundLayersFormTemplate = readFileSync(
  join(__dirname, 'background-layers-form.component.html'),
  'utf8',
);

describe('BackgroundLayersFormComponent', () => {
  let component: BackgroundLayersFormComponent;
  let fixture: ComponentFixture<BackgroundLayersFormComponent>;
  let roleService: RoleService;
  let cartographyService: CartographyService;
  let codeListService: CodeListService;
  let cartographyGroupService: CartographyGroupService;
  let backgroundService: BackgroundService;
  let applicationService: ApplicationService;
  let applicationBackgroundService: ApplicationBackgroundService;
  let translationService: TranslationService;
  let resourceService: ResourceService;
  let externalService: ExternalService;

  beforeAll(async () => {
     
    await TestBed.configureTestingModule({
      teardown: { destroyAfterEach: 0 as any },
      declarations: [ BackgroundLayersFormComponent, FormToolbarComponent ],
      imports: [FormsModule, ReactiveFormsModule,RouterModule.forRoot([], {}), SitmunFrontendGuiModule, MaterialModule, RouterModule, MatIconTestingModule, TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: () => ({
            getTranslation: () => of({})
          })
        }
      }), BrowserAnimationsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideErrorHandlerForTests(),
        BackgroundService,
        RoleService,
        ApplicationBackgroundService,
        ApplicationService,
        CartographyService,
        CodeListService,
        CartographyGroupService,
        TranslationService,
        ResourceService,
        ExternalService,
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BackgroundLayersFormComponent);
    component = fixture.componentInstance;
    // Suppress debug logs in tests to reduce console noise
    const loggerService = TestBed.inject(LoggerService);
    configureLoggerForTests(loggerService);
    roleService= TestBed.inject(RoleService);
    cartographyService= TestBed.inject(CartographyService);
    codeListService= TestBed.inject(CodeListService);
    cartographyGroupService= TestBed.inject(CartographyGroupService);
    backgroundService= TestBed.inject(BackgroundService);
    applicationService= TestBed.inject(ApplicationService);
    applicationBackgroundService= TestBed.inject(ApplicationBackgroundService);
    translationService= TestBed.inject(TranslationService);
    resourceService= TestBed.inject(ResourceService);
    externalService= TestBed.inject(ExternalService);
    // Initialize form if not already initialized
    if (!component.entityForm) {
      component.entityToEdit = component.empty();
      component.postFetchData();
    }
    fixture.detectChanges();
  });

  afterEach(() => fixture?.destroy());
  afterAll(() => TestBed.resetTestingModule());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should instantiate roleService', () => {
    expect(roleService).toBeTruthy();
  });

  it('should instantiate cartographyService', () => {
    expect(cartographyService).toBeTruthy();
  });

  it('should instantiate codeListService', () => {
    expect(codeListService).toBeTruthy();
  });

  it('should instantiate cartographyGroupService', () => {
    expect(cartographyGroupService).toBeTruthy();
  });

  it('should instantiate backgroundService', () => {
    expect(backgroundService).toBeTruthy();
  });

  it('should instantiate applicationService', () => {
    expect(applicationService).toBeTruthy();
  });

  it('should instantiate applicationBackgroundService', () => {
    expect(applicationBackgroundService).toBeTruthy();
  });

  it('should instantiate translationService', () => {
    expect(translationService).toBeTruthy();
  });

  it('should instantiate resourceService', () => {
    expect(resourceService).toBeTruthy();
  });

  it('should instantiate externalService', () => {
    expect(externalService).toBeTruthy();
  });
  it('form invalid when empty', () => {
    expect(component.entityForm.valid).toBeFalsy();
  });

  it('form invalid when mid-empty', () => {
    component.entityForm.patchValue({
      description: 'desc',
      image: 'https://example.com/bg.png',
      active: true
    })
    //Miss name
    expect(component.entityForm.valid).toBeFalsy();
  });

  it('form valid', () => {
    component.entityForm.patchValue({
      name: 'name',
      description: 'desc',
      image: 'https://example.com/bg.png',
      active: true
    })
    expect(component.entityForm.valid).toBeTruthy();
  });

  it('image rejects non-http values and accepts blank or http(s) URLs', () => {
    const image = component.entityForm.get('image');
    image?.setValue('image');
    expect(image?.hasError('optionalHttpUrl')).toBe(true);

    image?.setValue('');
    expect(image?.valid).toBe(true);

    image?.setValue('https://example.com/bg.png');
    expect(image?.valid).toBe(true);
  });

  it('Background layers form fields', () => {
    expect(component.entityForm.get('name')).toBeTruthy();
    expect(component.entityForm.get('description')).toBeTruthy();
    expect(component.entityForm.get('image')).toBeTruthy();
    expect(component.entityForm.get('active')).toBeTruthy();
  });

  describe('Grid capability classification', () => {
    it('membersTable should have picker, updater, and status capabilities', () => {
      const table = component['membersTable'];
      expect(table.hasPickerAdd()).toBe(true);
      expect(table.hasRelationsUpdater()).toBe(true);
      expect(table.hasStatusColumn()).toBe(true);
      expect(table.hasTemplateDialogs()).toBe(false);
    });

    it('rolesTable should have picker, updater, and status capabilities', () => {
      const table = component['rolesTable'];
      expect(table.hasPickerAdd()).toBe(true);
      expect(table.hasRelationsUpdater()).toBe(true);
      expect(table.hasStatusColumn()).toBe(true);
      expect(table.hasTemplateDialogs()).toBe(false);
    });

    it('applicationBackgroundsTable should have picker, updater, and status capabilities with custom mapper', () => {
      const table = component['applicationBackgroundsTable'];
      expect(table.hasPickerAdd()).toBe(true);
      expect(table.hasRelationsUpdater()).toBe(true);
      expect(table.hasStatusColumn()).toBe(true);
      expect(table.hasTemplateDialogs()).toBe(false);
    });

    it('no grids in this form should be read-only', () => {
      const membersTable = component['membersTable'];
      const rolesTable = component['rolesTable'];
      const applicationBackgroundsTable = component['applicationBackgroundsTable'];
      
      expect(membersTable.hasRelationsUpdater()).toBe(true);
      expect(rolesTable.hasRelationsUpdater()).toBe(true);
      expect(applicationBackgroundsTable.hasRelationsUpdater()).toBe(true);
    });
  });

  describe('Picker deduplication', () => {
    it('rolesTable excludes already-added roles from the picker', () => {
      const relations = [{ id: 10 }, { id: 20 }] as any;
      const predicate = (component['rolesTable'] as any).targetIncludeFn(relations);
      expect(predicate({ id: 10 })).toBe(false);
      expect(predicate({ id: 30 })).toBe(true);
    });
  });

  describe('template markup', () => {
    it('uses entity.background tab headers and card-wrapped relation grids', () => {
      expect(backgroundLayersFormTemplate).toContain("'entity.background.layers.header'");
      expect(backgroundLayersFormTemplate).toContain("'entity.background.roles.header'");
      expect(backgroundLayersFormTemplate).toContain("'entity.background.applications.header'");
      expect(backgroundLayersFormTemplate).not.toContain("'entity.permissionGroup.");
      expect(backgroundLayersFormTemplate).toMatch(/<mat-card[\s\S]*<app-relation-grid/);
    });
  });

});
