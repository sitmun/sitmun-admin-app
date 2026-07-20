import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatIconTestingModule} from '@angular/material/icon/testing';
import {MatSelectChange} from '@angular/material/select';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';

import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {firstValueFrom, of} from 'rxjs';

import {FormToolbarComponent} from '@app/components/shared/form-toolbar/form-toolbar.component';
import {ExternalConfigurationService} from '@app/core/config/external-configuration.service';
import {ExternalService, ResourceService} from '@app/core/hal';
import {
  CartographyAvailabilityService,
  CartographyService,
  CodeListService,
  RoleService,
  TaskAvailabilityProjection,
  TaskAvailabilityService,
  TaskService,
  TerritoryGroupTypeService,
  TerritoryService,
  TerritoryTypeService,
  TranslationService,
  UserConfigurationService,
  UserPositionService,
  UserService,
  TerritoryProjection,
} from '@app/domain';
import {SitmunFrontendGuiModule} from '@app/frontend-gui/src/lib/public_api';
import {MaterialModule} from '@app/material-module';
import {LoggerService} from '@app/services/logger.service';
import {configureLoggerForTests, provideErrorHandlerForTests} from '@app/testing/test-helpers';

import {TerritoryFormComponent} from './territory-form.component';

describe('TerritoryFormComponent', () => {
  let component: TerritoryFormComponent;
  let fixture: ComponentFixture<TerritoryFormComponent>;
  let roleService: RoleService;
  let userService: UserService;
  let territoryService: TerritoryService;
  let codeListService: CodeListService;
  let territoryGroupTypeService: TerritoryGroupTypeService;
  let cartographyService: CartographyService;
  let taskAvailabilityService: TaskAvailabilityService;
  let territoryTypeService: TerritoryTypeService;
  let taskService: TaskService;
  let userPositionService: UserPositionService;
  let cartographyAvailabilityService: CartographyAvailabilityService;
  let userConfigurationService: UserConfigurationService;
  let translationService: TranslationService;
  let resourceService: ResourceService;
  let externalService: ExternalService;

  beforeAll(async () => {
     
    await TestBed.configureTestingModule({
      teardown: { destroyAfterEach: 0 as any },
      declarations: [TerritoryFormComponent, FormToolbarComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        SitmunFrontendGuiModule,
        RouterModule.forRoot([], {}),
        MaterialModule,
        MatIconTestingModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: () => ({
              getTranslation: () => of({})
            })
          }
        }),
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideErrorHandlerForTests(),
        TerritoryService,
        UserService,
        RoleService,
        TerritoryGroupTypeService,
        CartographyService,
        TaskAvailabilityService,
        TaskService,
        UserPositionService,
        TerritoryTypeService,
        CartographyAvailabilityService,
        CodeListService,
        UserConfigurationService,
        TranslationService,
        ResourceService,
        ExternalService,
        {
          provide: 'ExternalConfigurationService',
          useClass: ExternalConfigurationService,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TerritoryFormComponent);
    component = fixture.componentInstance;
    // Suppress debug logs in tests to reduce console noise
    const loggerService = TestBed.inject(LoggerService);
    configureLoggerForTests(loggerService);
    roleService = TestBed.inject(RoleService);
    userService = TestBed.inject(UserService);
    territoryService = TestBed.inject(TerritoryService);
    codeListService = TestBed.inject(CodeListService);
    territoryGroupTypeService = TestBed.inject(TerritoryGroupTypeService);
    cartographyService = TestBed.inject(CartographyService);
    taskAvailabilityService = TestBed.inject(TaskAvailabilityService);
    territoryTypeService = TestBed.inject(TerritoryTypeService);
    taskService = TestBed.inject(TaskService);
    userPositionService = TestBed.inject(UserPositionService);
    cartographyAvailabilityService = TestBed.inject(
      CartographyAvailabilityService
    );
    userConfigurationService = TestBed.inject(UserConfigurationService);
    translationService = TestBed.inject(TranslationService);
    resourceService = TestBed.inject(ResourceService);
    externalService = TestBed.inject(ExternalService);
    // Initialize territoryTypes before postFetchData (normally done in preFetchData)
    component.territoryTypes = [{ id: 1, name: 'Test Type', bottomType: true, topType: false } as any];
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

  it('should instantiate userService', () => {
    expect(userService).toBeTruthy();
  });

  it('should instantiate territoryService', () => {
    expect(territoryService).toBeTruthy();
  });

  it('should instantiate codeListService', () => {
    expect(codeListService).toBeTruthy();
  });

  it('should instantiate territoryGroupTypeService', () => {
    expect(territoryGroupTypeService).toBeTruthy();
  });

  it('should instantiate cartographyService', () => {
    expect(cartographyService).toBeTruthy();
  });

  it('should instantiate taskAvailabilityService', () => {
    expect(taskAvailabilityService).toBeTruthy();
  });

  it('should instantiate territoryTypeService', () => {
    expect(territoryTypeService).toBeTruthy();
  });

  it('should instantiate taskService', () => {
    expect(taskService).toBeTruthy();
  });

  it('should instantiate userPositionService', () => {
    expect(userPositionService).toBeTruthy();
  });

  it('should instantiate cartographyAvailabilityService', () => {
    expect(cartographyAvailabilityService).toBeTruthy();
  });

  it('should instantiate userConfigurationService', () => {
    expect(userConfigurationService).toBeTruthy();
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
      code: 1,
      territorialAuthorityAddress: 'address',
      territorialAuthorityLogo: 'urlLogo',
      typeId: 1,
      extentMinX: 1,
      extentMaxX: 2,
      extentMinY: 3,
      extentMaxY: 4,
      note: 'observations',
      blocked: false,
      defaultZoomLevel: 2,
      centerPointX: 5,
      centerPointY: 5,
    });
    //Miss name
    expect(component.entityForm.valid).toBeFalsy();
  });

  it('form valid', () => {
    component.entityForm.patchValue({
      code: 1,
      name: 'name',
      territorialAuthorityAddress: 'address',
      territorialAuthorityLogo: 'https://example.com/logo.png',
      typeId: 1,
      extentMinX: 1,
      extentMaxX: 2,
      extentMinY: 3,
      extentMaxY: 4,
      note: 'observations',
      blocked: false,
      defaultZoomLevel: 2,
      centerPointX: 5,
      centerPointY: 5,
      srs: 'EPSG:4326',
    });
    expect(component.entityForm.valid).toBeTruthy();
  });

  it('initializes extentMaxY from extent.maxY (not maxX)', () => {
    component.entityToEdit = Object.assign(new TerritoryProjection(), {
      typeId: 1,
      extent: {minX: 1, maxX: 50, minY: 2, maxY: 99},
    });
    component.postFetchData();
    expect(component.entityForm.get('extentMaxX')?.value).toBe(50);
    expect(component.entityForm.get('extentMaxY')?.value).toBe(99);
  });

  it('Territory form fields', () => {
    expect(component.entityForm.get('code')).toBeTruthy();
    expect(component.entityForm.get('name')).toBeTruthy();
    expect(
      component.entityForm.get('territorialAuthorityAddress')
    ).toBeTruthy();
    expect(
      component.entityForm.get('territorialAuthorityLogo')
    ).toBeTruthy();
    expect(component.entityForm.get('typeId')).toBeTruthy();
    expect(component.entityForm.get('extentMinX')).toBeTruthy();
    expect(component.entityForm.get('extentMaxX')).toBeTruthy();
    expect(component.entityForm.get('extentMinY')).toBeTruthy();
    expect(component.entityForm.get('extentMaxY')).toBeTruthy();
    expect(component.entityForm.get('note')).toBeTruthy();
    expect(component.entityForm.get('blocked')).toBeTruthy();
    expect(component.entityForm.get('defaultZoomLevel')).toBeTruthy();
    expect(component.entityForm.get('centerPointX')).toBeTruthy();
    expect(component.entityForm.get('centerPointY')).toBeTruthy();
    expect(component.entityForm.get('srs')).toBeTruthy();
  });

  it('Validate extent all null', () => {
    expect(component.validateEnvelope(null, null, null, null)).toBeTruthy();
  });

  it('Validate extent all with value', () => {
    expect(component.validateEnvelope(1, 2, 3, 4)).toBeTruthy();
  });

  it('Validate extent with invalid values', () => {
    expect(component.validateEnvelope(1, null, 3, 4)).toBeFalsy();
  });

  describe('Validator Tests (TDD)', () => {
    describe('Max Length Validators', () => {
      it('should reject code longer than 50 characters', () => {
        component.entityForm.patchValue({ code: 'a'.repeat(51), name: 'Test', typeId: 1 });
        expect(component.entityForm.get('code')?.hasError('maxlength')).toBeTruthy();
        expect(component.entityForm.valid).toBeFalsy();
      });

      it('should accept code with 50 characters', () => {
        component.entityForm.patchValue({ code: 'a'.repeat(50), name: 'Test', typeId: 1 });
        expect(component.entityForm.get('code')?.hasError('maxlength')).toBeFalsy();
      });

      it('should reject name longer than 250 characters', () => {
        component.entityForm.patchValue({ code: '1', name: 'a'.repeat(251), typeId: 1 });
        expect(component.entityForm.get('name')?.hasError('maxlength')).toBeTruthy();
        expect(component.entityForm.valid).toBeFalsy();
      });

      it('should accept name with 250 characters', () => {
        component.entityForm.patchValue({ code: '1', name: 'a'.repeat(250), typeId: 1 });
        expect(component.entityForm.get('name')?.hasError('maxlength')).toBeFalsy();
      });

      it('should reject description longer than 4000 characters', () => {
        component.entityForm.patchValue({ 
          code: '1', 
          name: 'Test',
          description: 'a'.repeat(4001),
          typeId: 1 
        });
        expect(component.entityForm.get('description')?.hasError('maxlength')).toBeTruthy();
      });

      it('should accept description with 4000 characters', () => {
        component.entityForm.patchValue({ 
          code: '1', 
          name: 'Test',
          description: 'a'.repeat(4000),
          typeId: 1 
        });
        expect(component.entityForm.get('description')?.hasError('maxlength')).toBeFalsy();
      });

      it('should reject note longer than 250 characters', () => {
        component.entityForm.patchValue({ 
          code: '1', 
          name: 'Test',
          note: 'a'.repeat(251),
          typeId: 1 
        });
        expect(component.entityForm.get('note')?.hasError('maxlength')).toBeTruthy();
      });

      it('should reject territorialAuthorityAddress longer than 250 characters', () => {
        component.entityForm.patchValue({ 
          code: '1', 
          name: 'Test',
          territorialAuthorityAddress: 'a'.repeat(251),
          typeId: 1 
        });
        expect(component.entityForm.get('territorialAuthorityAddress')?.hasError('maxlength')).toBeTruthy();
      });

      it('should reject territorialAuthorityLogo longer than 4000 characters', () => {
        component.entityForm.patchValue({ 
          code: '1', 
          name: 'Test',
          territorialAuthorityLogo: 'http://' + 'a'.repeat(4000),
          typeId: 1 
        });
        expect(component.entityForm.get('territorialAuthorityLogo')?.hasError('maxlength')).toBeTruthy();
      });

      it('should reject srs longer than 50 characters', () => {
        component.entityForm.patchValue({ 
          code: '1', 
          name: 'Test',
          srs: 'EPSG:' + '1'.repeat(50),
          typeId: 1 
        });
        expect(component.entityForm.get('srs')?.hasError('maxlength')).toBeTruthy();
      });
    });

    describe('HTTP URL Validator for territorialAuthorityLogo', () => {
      it('should accept valid http URL', () => {
        component.entityForm.patchValue({ 
          code: '1', 
          name: 'Test',
          territorialAuthorityLogo: 'http://example.com/logo.png',
          typeId: 1 
        });
        expect(component.entityForm.get('territorialAuthorityLogo')?.hasError('invalidUrl')).toBeFalsy();
      });

      it('should accept valid https URL', () => {
        component.entityForm.patchValue({ 
          code: '1', 
          name: 'Test',
          territorialAuthorityLogo: 'https://example.com/logo.png',
          typeId: 1 
        });
        expect(component.entityForm.get('territorialAuthorityLogo')?.hasError('invalidUrl')).toBeFalsy();
      });

      it('should reject ftp URL', () => {
        component.entityForm.patchValue({ 
          code: '1', 
          name: 'Test',
          territorialAuthorityLogo: 'ftp://example.com/logo.png',
          typeId: 1 
        });
        expect(component.entityForm.get('territorialAuthorityLogo')?.hasError('invalidUrl')).toBeTruthy();
        expect(component.entityForm.valid).toBeFalsy();
      });

      it('should reject invalid URL format', () => {
        component.entityForm.patchValue({ 
          code: '1', 
          name: 'Test',
          territorialAuthorityLogo: 'not-a-url',
          typeId: 1 
        });
        expect(component.entityForm.get('territorialAuthorityLogo')?.hasError('invalidUrl')).toBeTruthy();
        expect(component.entityForm.valid).toBeFalsy();
      });

      it('should accept empty territorialAuthorityLogo', () => {
        component.entityForm.patchValue({ 
          code: '1', 
          name: 'Test',
          territorialAuthorityLogo: '',
          typeId: 1 
        });
        expect(component.entityForm.get('territorialAuthorityLogo')?.hasError('invalidUrl')).toBeFalsy();
      });

      it('should accept null territorialAuthorityLogo', () => {
        component.entityForm.patchValue({ 
          code: '1', 
          name: 'Test',
          territorialAuthorityLogo: null,
          typeId: 1 
        });
        expect(component.entityForm.get('territorialAuthorityLogo')?.hasError('invalidUrl')).toBeFalsy();
      });
    });

    describe('SRS Pattern Validator', () => {
      it('should accept valid SRS format EPSG:4326', () => {
        component.entityForm.patchValue({ 
          code: '1', 
          name: 'Test',
          srs: 'EPSG:4326',
          typeId: 1 
        });
        expect(component.entityForm.get('srs')?.hasError('invalidSrs')).toBeFalsy();
      });

      it('should accept valid SRS format with hyphens', () => {
        component.entityForm.patchValue({ 
          code: '1', 
          name: 'Test',
          srs: 'EPSG-TEST:25830',
          typeId: 1 
        });
        expect(component.entityForm.get('srs')?.hasError('invalidSrs')).toBeFalsy();
      });

      it('should reject SRS without colon', () => {
        component.entityForm.patchValue({ 
          code: '1', 
          name: 'Test',
          srs: 'EPSG4326',
          typeId: 1 
        });
        expect(component.entityForm.get('srs')?.hasError('invalidSrs')).toBeTruthy();
        expect(component.entityForm.valid).toBeFalsy();
      });

      it('should reject SRS with lowercase', () => {
        component.entityForm.patchValue({ 
          code: '1', 
          name: 'Test',
          srs: 'epsg:4326',
          typeId: 1 
        });
        expect(component.entityForm.get('srs')?.hasError('invalidSrs')).toBeTruthy();
        expect(component.entityForm.valid).toBeFalsy();
      });

      it('should reject SRS with non-numeric code', () => {
        component.entityForm.patchValue({ 
          code: '1', 
          name: 'Test',
          srs: 'EPSG:ABC',
          typeId: 1 
        });
        expect(component.entityForm.get('srs')?.hasError('invalidSrs')).toBeTruthy();
        expect(component.entityForm.valid).toBeFalsy();
      });

      it('should accept empty SRS', () => {
        component.entityForm.patchValue({ 
          code: '1', 
          name: 'Test',
          srs: '',
          typeId: 1 
        });
        expect(component.entityForm.get('srs')?.hasError('invalidSrs')).toBeFalsy();
      });

      it('should accept null SRS', () => {
        component.entityForm.patchValue({ 
          code: '1', 
          name: 'Test',
          srs: null,
          typeId: 1 
        });
        expect(component.entityForm.get('srs')?.hasError('invalidSrs')).toBeFalsy();
      });
    });

    describe('Envelope Validator with maxX > minX and maxY > minY', () => {
      it('should accept valid envelope', () => {
        component.entityForm.patchValue({ 
          code: '1', 
          name: 'Test',
          typeId: 1,
          extentMinX: 1,
          extentMaxX: 2,
          extentMinY: 3,
          extentMaxY: 4
        });
        expect(component.canSave()).toBeTruthy();
      });

      it('should reject envelope when maxX equals minX', () => {
        component.entityForm.patchValue({ 
          code: '1', 
          name: 'Test',
          typeId: 1,
          extentMinX: 2,
          extentMaxX: 2,
          extentMinY: 3,
          extentMaxY: 4
        });
        expect(component.canSave()).toBeFalsy();
      });

      it('should reject envelope when maxX less than minX', () => {
        component.entityForm.patchValue({ 
          code: '1', 
          name: 'Test',
          typeId: 1,
          extentMinX: 3,
          extentMaxX: 2,
          extentMinY: 3,
          extentMaxY: 4
        });
        expect(component.canSave()).toBeFalsy();
      });

      it('should reject envelope when maxY equals minY', () => {
        component.entityForm.patchValue({ 
          code: '1', 
          name: 'Test',
          typeId: 1,
          extentMinX: 1,
          extentMaxX: 2,
          extentMinY: 4,
          extentMaxY: 4
        });
        expect(component.canSave()).toBeFalsy();
      });

      it('should reject envelope when maxY less than minY', () => {
        component.entityForm.patchValue({ 
          code: '1', 
          name: 'Test',
          typeId: 1,
          extentMinX: 1,
          extentMaxX: 2,
          extentMinY: 5,
          extentMaxY: 4
        });
        expect(component.canSave()).toBeFalsy();
      });

      it('should accept all envelope fields empty', () => {
        component.entityForm.patchValue({ 
          code: '1', 
          name: 'Test',
          typeId: 1,
          extentMinX: null,
          extentMaxX: null,
          extentMinY: null,
          extentMaxY: null
        });
        expect(component.canSave()).toBeTruthy();
      });

      it('should reject partial envelope', () => {
        component.entityForm.patchValue({ 
          code: '1', 
          name: 'Test',
          typeId: 1,
          extentMinX: 1,
          extentMaxX: null,
          extentMinY: 3,
          extentMaxY: 4
        });
        expect(component.canSave()).toBeFalsy();
      });
    });

    describe('Center Point Validator - both coordinates required together', () => {
      it('should accept both center coordinates provided', () => {
        component.entityForm.patchValue({ 
          code: '1', 
          name: 'Test',
          typeId: 1,
          centerPointX: 1.5,
          centerPointY: 2.5
        });
        expect(component.canSave()).toBeTruthy();
      });

      it('should accept both center coordinates empty', () => {
        component.entityForm.patchValue({ 
          code: '1', 
          name: 'Test',
          typeId: 1,
          centerPointX: null,
          centerPointY: null
        });
        expect(component.canSave()).toBeTruthy();
      });

      it('should reject only centerPointX provided', () => {
        component.entityForm.patchValue({ 
          code: '1', 
          name: 'Test',
          typeId: 1,
          centerPointX: 1.5,
          centerPointY: null
        });
        expect(component.canSave()).toBeFalsy();
      });

      it('should reject only centerPointY provided', () => {
        component.entityForm.patchValue({ 
          code: '1', 
          name: 'Test',
          typeId: 1,
          centerPointX: null,
          centerPointY: 2.5
        });
        expect(component.canSave()).toBeFalsy();
      });
    });

    describe('Integer Validator for defaultZoomLevel', () => {
      it('should accept positive integer', () => {
        component.entityForm.patchValue({ 
          code: '1', 
          name: 'Test',
          typeId: 1,
          defaultZoomLevel: 10
        });
        expect(component.entityForm.get('defaultZoomLevel')?.hasError('pattern')).toBeFalsy();
      });

      it('should accept zero', () => {
        component.entityForm.patchValue({ 
          code: '1', 
          name: 'Test',
          typeId: 1,
          defaultZoomLevel: 0
        });
        expect(component.entityForm.get('defaultZoomLevel')?.hasError('pattern')).toBeFalsy();
      });

      it('should accept negative integer', () => {
        component.entityForm.patchValue({ 
          code: '1', 
          name: 'Test',
          typeId: 1,
          defaultZoomLevel: -5
        });
        expect(component.entityForm.get('defaultZoomLevel')?.hasError('pattern')).toBeFalsy();
      });

      it('should reject decimal number', () => {
        component.entityForm.patchValue({ 
          code: '1', 
          name: 'Test',
          typeId: 1,
          defaultZoomLevel: 10.5
        });
        expect(component.entityForm.get('defaultZoomLevel')?.hasError('pattern')).toBeTruthy();
        expect(component.entityForm.valid).toBeFalsy();
      });

      it('should reject non-numeric value', () => {
        component.entityForm.patchValue({ 
          code: '1', 
          name: 'Test',
          typeId: 1,
          defaultZoomLevel: 'abc' as any
        });
        expect(component.entityForm.get('defaultZoomLevel')?.hasError('pattern')).toBeTruthy();
        expect(component.entityForm.valid).toBeFalsy();
      });

      it('should accept empty defaultZoomLevel', () => {
        component.entityForm.patchValue({ 
          code: '1', 
          name: 'Test',
          typeId: 1,
          defaultZoomLevel: null
        });
        expect(component.entityForm.get('defaultZoomLevel')?.hasError('pattern')).toBeFalsy();
      });
    });
  });

  describe('Territory hierarchy pickers', () => {
    const municipiType = {id: 6, name: 'Municipi', topType: false, bottomType: false} as any;

    const sameTypeTerritory = Object.assign(new TerritoryProjection(), {
      id: 1,
      name: 'Manlleu',
      typeId: 6,
      typeTopType: false,
      typeBottomType: false,
    });
    const provinciaTerritory = Object.assign(new TerritoryProjection(), {
      id: 2,
      name: 'Navarra',
      typeId: 8,
      typeTopType: true,
      typeBottomType: false,
    });
    const bottomTerritory = Object.assign(new TerritoryProjection(), {
      id: 3,
      name: 'Leaf',
      typeId: 9,
      typeTopType: false,
      typeBottomType: true,
    });

    const parentTargetsFetcher = () =>
      (component['membersOfTable'] as unknown as {targetsFetchFn: () => ReturnType<TerritoryService['fetchProjectionItems']>})
        .targetsFetchFn;

    const childTargetsFetcher = () =>
      (component['membersTable'] as unknown as {targetsFetchFn: () => ReturnType<TerritoryService['fetchProjectionItems']>})
        .targetsFetchFn;

    beforeEach(() => {
      component.currentTerritoryType = municipiType;
      jest.spyOn(territoryService, 'fetchProjectionItems').mockReturnValue(
        of([sameTypeTerritory, provinciaTerritory, bottomTerritory] as any)
      );
    });

    it('includes top non-bottom territories as parent candidates', async () => {
      const targets = await firstValueFrom(parentTargetsFetcher()());

      expect(targets.map(t => t.id)).toEqual([2]);
    });

    it('excludes top territories from child candidates', async () => {
      const targets = await firstValueFrom(childTargetsFetcher()());

      expect(targets.map(t => t.id)).toEqual([3]);
    });
  });

  describe('Territory type change', () => {
    const municipiType = {id: 6, name: 'Municipi', topType: false, bottomType: false} as any;
    const provinciaType = {id: 8, name: 'Provincia', topType: true, bottomType: false} as any;
    const bottomType = {id: 9, name: 'Bottom', topType: false, bottomType: true} as any;

    beforeEach(() => {
      component.territoryTypes = [municipiType, provinciaType, bottomType];
      component.currentTerritoryType = municipiType;
      component.currentTypeTop = false;
      component.currentTypeBottom = false;
      component.entityToEdit = Object.assign(new TerritoryProjection(), {
        id: 100,
        name: 'Manlleu',
        typeId: 6,
      });
      component.entityID = 100;
      component.entityForm.patchValue({
        code: 'MAN',
        name: 'Manlleu',
        typeId: 6,
      });
    });

    it('syncs currentTerritoryType when type changes without conflicting relations', async () => {
      jest.spyOn(component.entityToEdit, 'getRelationArrayEx').mockReturnValue(of([] as any));

      component.entityForm.patchValue({typeId: 8});
      await component.onTerritoryTypeChanged({value: 8} as MatSelectChange);

      expect(component.currentTerritoryType.id).toBe(8);
      expect(component.currentTypeTop).toBe(true);
      expect(component.currentTypeBottom).toBe(false);
      expect(component.entityForm.get('typeId')?.value).toBe(8);
    });

    it('rejects top type when parents exist', async () => {
      jest.spyOn(component.entityToEdit, 'getRelationArrayEx').mockImplementation((_cls, relation) => {
        if (relation === 'memberOf') {
          return of([{id: 2, name: 'Navarra'}] as any);
        }
        return of([] as any);
      });

      component.entityForm.patchValue({typeId: 8});
      await component.onTerritoryTypeChanged({value: 8} as MatSelectChange);

      expect(component.entityForm.get('typeId')?.value).toBe(6);
      expect(component.currentTerritoryType.id).toBe(6);
      expect(component.entityForm.get('typeId')?.hasError('topTypeWithParents')).toBe(true);
      expect(component.canSave()).toBe(false);
    });

    it('rejects bottom type when children exist', async () => {
      jest.spyOn(component.entityToEdit, 'getRelationArrayEx').mockImplementation((_cls, relation) => {
        if (relation === 'members') {
          return of([{id: 3, name: 'Child'}] as any);
        }
        return of([] as any);
      });

      component.entityForm.patchValue({typeId: 9});
      await component.onTerritoryTypeChanged({value: 9} as MatSelectChange);

      expect(component.entityForm.get('typeId')?.value).toBe(6);
      expect(component.currentTerritoryType.id).toBe(6);
      expect(component.entityForm.get('typeId')?.hasError('bottomTypeWithChildren')).toBe(true);
      expect(component.canSave()).toBe(false);
    });

    it('allows top type when no parents exist', async () => {
      jest.spyOn(component.entityToEdit, 'getRelationArrayEx').mockReturnValue(of([] as any));

      component.entityForm.patchValue({typeId: 8});
      await component.onTerritoryTypeChanged({value: 8} as MatSelectChange);

      expect(component.entityForm.get('typeId')?.value).toBe(8);
      expect(component.currentTerritoryType.id).toBe(8);
      expect(component.entityForm.get('typeId')?.hasError('topTypeWithParents')).toBe(false);
    });
  });

  describe('Duplicate save enablement (TDD for #384)', () => {
    it('enables save for a valid pristine duplicate form', () => {
      component.entityID = -1;
      component.duplicateID = 123;
      component.entityForm.patchValue({
        code: 'T1',
        name: 'copy_Original Territory',
        typeId: 1,
        blocked: true,
      });
      component.entityForm.markAsPristine();

      expect(component.entityForm.valid).toBe(true);
      expect(component.canSaveEntity).toBe(true);
    });

    it('keeps save disabled for a valid pristine edit form', () => {
      component.entityID = 123;
      component.duplicateID = -1;
      component.entityForm.patchValue({
        code: 'T1',
        name: 'Original Territory',
        typeId: 1,
        blocked: true,
      });
      component.entityForm.markAsPristine();

      expect(component.entityForm.valid).toBe(true);
      expect(component.canSaveEntity).toBe(false);
    });
  });

  describe('Duplicate Relation Loading (TDD for #383)', () => {
    beforeEach(() => {
      component.entityID = -1;
      component.duplicateID = 123;
      component.entityToEdit = Object.assign(new TerritoryProjection(), {
        id: 123,
        name: 'Original Territory',
        typeId: 1,
      });
    });

    it('should call getRelationArrayEx for cartographies when duplicating', () => {
      const spy = jest.spyOn(component.entityToEdit, 'getRelationArrayEx').mockReturnValue(of([] as any));

      const fetcher = component['cartographiesTable'].relationsFetchFn;
      fetcher();

      expect(spy).toHaveBeenCalledWith(expect.anything(), 'cartographyAvailabilities', {projection: 'view'});
    });

    it('should call getRelationArrayEx for tasks when duplicating', () => {
      const spy = jest.spyOn(component.entityToEdit, 'getRelationArrayEx').mockReturnValue(of([] as any));

      const fetcher = component['tasksTable'].relationsFetchFn;
      fetcher();

      expect(spy).toHaveBeenCalledWith(expect.anything(), 'taskAvailabilities', {
        projection: 'view',
        lang: expect.any(String),
      });
    });

    it('should call getRelationArrayEx for members when duplicating', () => {
      const spy = jest.spyOn(component.entityToEdit, 'getRelationArrayEx').mockReturnValue(of([] as any));

      const fetcher = component['membersTable'].relationsFetchFn;
      fetcher();

      expect(spy).toHaveBeenCalledWith(expect.anything(), 'members', {projection: 'view'});
    });

    it('should call getRelationArrayEx for memberOf when duplicating', () => {
      const spy = jest.spyOn(component.entityToEdit, 'getRelationArrayEx').mockReturnValue(of([] as any));

      const fetcher = component['membersOfTable'].relationsFetchFn;
      fetcher();

      expect(spy).toHaveBeenCalledWith(expect.anything(), 'memberOf', {projection: 'view'});
    });
  });

  describe('Relation grid dual navigation', () => {
    it('permitsTable links user and role to their forms', () => {
      const columns = component['permitsTable'].relationsColumnsDefs;
      const userColumn = columns.find((column: { field?: string }) => column.field === 'user');
      const roleColumn = columns.find((column: { field?: string }) => column.field === 'role');

      expect(userColumn?.cellRenderer).toBe('routerLinkRenderer');
      expect(userColumn?.cellRendererParams).toEqual({
        route: '/user/:id/userForm',
        paramFields: { id: 'userId' },
      });
      expect(userColumn?.flex).toBe(2);
      expect(roleColumn?.cellRenderer).toBe('routerLinkRenderer');
      expect(roleColumn?.cellRendererParams).toEqual({
        route: '/role/:id/roleForm',
        paramFields: { id: 'roleId' },
      });
      expect(roleColumn?.flex).toBe(3);
    });

    it('permitsTable applies-to-children boolean keeps a left-aligned bounded header', () => {
      const columns = component['permitsTable'].relationsColumnsDefs;
      const appliesColumn = columns.find(
        (column: { field?: string }) => column.field === 'appliesToChildrenTerritories'
      );

      expect(appliesColumn?.headerName).toBeTruthy();
      expect(appliesColumn?.headerClass).toBeUndefined();
      expect(appliesColumn?.flex).toBe(0);
      expect(appliesColumn?.minWidth).toBe(180);
      expect(appliesColumn?.maxWidth).toBe(220);
    });

    it('cartographiesTable uses name, layers, service with navigable name and service', () => {
      const columns = component['cartographiesTable'].relationsColumnsDefs;
      const fields = columns
        .map((column: { field?: string }) => column.field)
        .filter((field: string | undefined): field is string => !!field && field !== 'status');

      expect(fields).toEqual(['cartographyName', 'cartographyLayers', 'cartographyServiceName']);

      const cartographyColumn = columns.find((column: { field?: string }) => column.field === 'cartographyName');
      const serviceColumn = columns.find((column: { field?: string }) => column.field === 'cartographyServiceName');

      expect(cartographyColumn?.cellRenderer).toBe('routerLinkRenderer');
      expect(cartographyColumn?.cellRendererParams).toEqual({
        route: '/layers/:id/layersForm',
        paramFields: { id: 'cartographyId' },
      });
      expect(serviceColumn?.cellRenderer).toBe('routerLinkRenderer');
      expect(serviceColumn?.cellRendererParams).toEqual({
        route: '/service/:id/serviceForm',
        paramFields: { id: 'cartographyServiceId' },
      });
    });

    it('tasksTable links task name to the typed task form', () => {
      const columns = component['tasksTable'].relationsColumnsDefs;
      const nameColumn = columns.find((column: { field?: string }) => column.field === 'taskName');

      expect(nameColumn?.cellRenderer).toBe('routerLinkRenderer');
      expect(nameColumn?.cellRendererParams).toEqual({
        route: '/tasks/:id/:typeId',
        paramFields: { id: 'taskId', typeId: 'taskTypeId' },
      });
    });

    it('tasksTable Type column shows the localized task type title', () => {
      const columns = component['tasksTable'].relationsColumnsDefs;
      const typeColumn = columns.find((column: { field?: string }) => column.field === 'taskTypeTitle');

      expect(typeColumn).toBeTruthy();
      expect(typeColumn?.headerName).toBe('entity.taskType.label');
      expect(columns.some((column: { field?: string }) => column.field === 'taskTypeName')).toBe(false);
    });

    it('tasksTable requests task types with the UI lang so backend @I18n applies', () => {
      component.entityID = 6;
      component.entityToEdit = Object.assign(new TerritoryProjection(), {id: 6});
      const spy = jest.spyOn(component.entityToEdit, 'getRelationArrayEx').mockReturnValue(of([] as any));

      component['tasksTable'].relationsFetchFn();

      expect(spy).toHaveBeenCalledWith(
        TaskAvailabilityProjection,
        'taskAvailabilities',
        expect.objectContaining({
          projection: 'view',
          lang: expect.any(String),
        })
      );
    });
  });

  describe('permitsTable field restrictions', () => {
    it('exposes composite restrictions including appliesToChildrenTerritories', () => {
      expect(component.permitsTable.addFieldRestriction).toEqual(['userId', 'roleId', 'appliesToChildrenTerritories']);
    });
  });

  describe('Grid sort', () => {
    it('cartographiesTable default sort uses cartographyName', () => {
      const order = (component['cartographiesTable'] as any).relationsOrder;
      const orderField = Array.isArray(order) ? order[0] : order;
      expect(orderField).toBe('cartographyName');
    });
  });

  describe('Picker deduplication', () => {
    it('cartographiesTable excludes already-added cartographies from the picker', () => {
      const relations = [{ cartographyId: 10 }, { cartographyId: 20 }] as any;
      const predicate = (component['cartographiesTable'] as any).targetIncludeFn(relations);
      expect(predicate({ id: 10 })).toBe(false);
      expect(predicate({ id: 20 })).toBe(false);
      expect(predicate({ id: 30 })).toBe(true);
    });

    it('tasksTable excludes already-added tasks from the picker', () => {
      const relations = [{ taskId: 5 }, { taskId: 7 }] as any;
      const predicate = (component['tasksTable'] as any).targetIncludeFn(relations);
      expect(predicate({ id: 5 })).toBe(false);
      expect(predicate({ id: 7 })).toBe(false);
      expect(predicate({ id: 9 })).toBe(true);
    });

    it('membersOfTable excludes already-added memberOf territories from the picker', () => {
      const relations = [{ id: 3 }, { id: 4 }] as any;
      const predicate = (component['membersOfTable'] as any).targetIncludeFn(relations);
      expect(predicate({ id: 3 })).toBe(false);
      expect(predicate({ id: 5 })).toBe(true);
    });

    it('membersTable excludes already-added member territories from the picker', () => {
      const relations = [{ id: 6 }, { id: 7 }] as any;
      const predicate = (component['membersTable'] as any).targetIncludeFn(relations);
      expect(predicate({ id: 6 })).toBe(false);
      expect(predicate({ id: 8 })).toBe(true);
    });

    it('membersOfTable has picker add enabled', () => {
      expect(component.membersOfTable.hasPickerAdd()).toBe(true);
    });

    it('membersTable has picker add enabled', () => {
      expect(component.membersTable.hasPickerAdd()).toBe(true);
    });
  });
});
