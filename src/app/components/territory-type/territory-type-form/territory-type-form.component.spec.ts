import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, convertToParamMap, RouterModule } from '@angular/router';

import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

import { FormToolbarComponent } from '@app/components/shared/form-toolbar/form-toolbar.component';
import { Configuration } from '@app/core/config/configuration';
import { ExternalConfigurationService } from '@app/core/config/external-configuration.service';
import { ExternalService, ResourceService } from '@app/core/hal';
import { CodeListService, TerritoryType, TerritoryTypeService, TranslationService } from '@app/domain';
import { SitmunFrontendGuiModule } from '@app/frontend-gui/src/lib/public_api';
import { MaterialModule } from '@app/material-module';
import { provideErrorHandlerForTests } from '@app/testing/test-helpers';

import { TerritoryTypeFormComponent } from './territory-type-form.component';

describe('TerritoryTypeFormComponent', () => {
  let component: TerritoryTypeFormComponent;
  let fixture: ComponentFixture<TerritoryTypeFormComponent>;
  let territoryTypeService: TerritoryTypeService;
  let translateService: TranslateService;
  let initTranslationsSpy: jest.SpyInstance;

  beforeAll(async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await TestBed.configureTestingModule({
      teardown: { destroyAfterEach: 0 as any },
      declarations: [TerritoryTypeFormComponent, FormToolbarComponent],
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
              getTranslation: () => of({}),
            }),
          },
        }),
      ],
      providers: [
        CodeListService,
        TerritoryTypeService,
        TranslationService,
        ResourceService,
        ExternalService,
        provideErrorHandlerForTests(),
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: convertToParamMap({ id: '-1' }) },
            params: of({ id: '-1' }),
          },
        },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TerritoryTypeFormComponent);
    component = fixture.componentInstance;
    territoryTypeService = TestBed.inject(TerritoryTypeService);
    translateService = TestBed.inject(TranslateService);
    initTranslationsSpy = jest.spyOn(component, 'initTranslations').mockImplementation(async () => {});
    jest.spyOn(translateService, 'instant').mockImplementation((key: string) =>
      key === 'common.copyPrefix' ? 'Copy of ' : key
    );
  });

  afterEach(() => {
    fixture?.destroy();
    jest.restoreAllMocks();
  });

  afterAll(() => TestBed.resetTestingModule());

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.config).toBe(Configuration.TERRITORY_TYPE);
  });

  it('preFetchData initializes TerritoryType name translations', async () => {
    await component.preFetchData();
    expect(initTranslationsSpy).toHaveBeenCalledWith('TerritoryType', ['name']);
  });

  it('empty returns territory type with false booleans', () => {
    const empty = component.empty();
    expect(empty.official).toBe(false);
    expect(empty.topType).toBe(false);
    expect(empty.bottomType).toBe(false);
  });

  it('postFetchData creates required name and boolean controls', () => {
    component.entityToEdit = {
      id: 1,
      name: 'Municipality',
      official: true,
      topType: false,
      bottomType: true,
    } as TerritoryType;

    component.postFetchData();

    expect(component.entityForm.get('name')?.validator).toBeTruthy();
    expect(component.entityForm.get('official')?.value).toBe(true);
    expect(component.entityForm.get('topType')?.value).toBe(false);
    expect(component.entityForm.get('bottomType')?.value).toBe(true);
  });

  it('fetchCopy prefixes name and preserves boolean flags', async () => {
    const copy = {
      id: 2,
      name: 'Region',
      official: true,
      topType: true,
      bottomType: false,
    } as TerritoryType;
    jest.spyOn(territoryTypeService, 'get').mockReturnValue(of(copy));
    component.duplicateID = 2;

    const result = await component.fetchCopy();

    expect(result.name).toBe('Copy of Region');
    expect(result.official).toBe(true);
    expect(result.topType).toBe(true);
    expect(result.bottomType).toBe(false);
  });

  it('createObject merges form values for create and update', () => {
    component.entityToEdit = {
      id: 5,
      name: 'Old',
      official: false,
      topType: false,
      bottomType: false,
    } as TerritoryType;
    component.postFetchData();
    component.entityForm.patchValue({
      name: 'Updated',
      official: true,
      topType: true,
      bottomType: false,
    });

    const created = component.createObject();
    const updated = component.createObject(5);

    expect(created.name).toBe('Updated');
    expect(created.official).toBe(true);
    expect(created.id).toBeNull();
    expect(updated.id).toBe(5);
  });

  it('createEntity and updateEntity call TerritoryTypeService', async () => {
    component.entityToEdit = {
      name: 'New type',
      official: false,
      topType: false,
      bottomType: false,
    } as TerritoryType;
    component.postFetchData();
    const createSpy = jest
      .spyOn(territoryTypeService, 'create')
      .mockReturnValue(of({ id: 9 } as TerritoryType));
    const updateSpy = jest.spyOn(territoryTypeService, 'update').mockReturnValue(of({} as TerritoryType));

    const newId = await component.createEntity();
    component.entityID = 9;
    await component.updateEntity();

    expect(createSpy).toHaveBeenCalled();
    expect(updateSpy).toHaveBeenCalled();
    expect(newId).toBe(9);
  });

  it('itemName returns entity name or empty string', () => {
    component.entityToEdit = { name: 'Province' } as TerritoryType;
    expect(component.itemName('')).toBe('Province');
    component.entityToEdit = undefined;
    expect(component.itemName('')).toBe('');
  });
});
