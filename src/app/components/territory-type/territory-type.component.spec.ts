import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { provideRouter, Router } from '@angular/router';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { EntityListComponent } from '@app/components/shared/entity-list/entity-list.component';
import { Configuration } from '@app/core/config/configuration';
import { ExternalConfigurationService } from '@app/core/config/external-configuration.service';
import { ExternalService, ResourceService } from '@app/core/hal';
import { CodeListService, TerritoryType, TerritoryTypeService, TranslationService } from '@app/domain';
import { SitmunFrontendGuiModule } from '@app/frontend-gui/src/lib/public_api';
import { MaterialModule } from '@app/material-module';
import { UtilsService } from '@app/services/utils.service';

import { TerritoryTypeComponent } from './territory-type.component';

describe('TerritoryTypeComponent', () => {
  let component: TerritoryTypeComponent;
  let fixture: ComponentFixture<TerritoryTypeComponent>;
  let router: Router;
  let territoryTypeService: TerritoryTypeService;
  let _utils: UtilsService;

  beforeAll(async () => {
     
    await TestBed.configureTestingModule({
      teardown: { destroyAfterEach: 0 as any },
      declarations: [TerritoryTypeComponent, EntityListComponent],
      imports: [
        SitmunFrontendGuiModule,
        MaterialModule,
        MatIconTestingModule,
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
        UtilsService,
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService },
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TerritoryTypeComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    territoryTypeService = TestBed.inject(TerritoryTypeService);
    _utils = TestBed.inject(UtilsService);
    jest.spyOn(router, 'navigate').mockResolvedValue(true);
  });

  afterEach(() => {
    fixture?.destroy();
    jest.restoreAllMocks();
  });

  afterAll(() => TestBed.resetTestingModule());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('uses TERRITORY_TYPE configuration and default name sorting', () => {
    expect(component.entityListConfig.entityLabel).toBe(Configuration.TERRITORY_TYPE.labelPlural);
    expect(component.entityListConfig.iconName).toBe(Configuration.TERRITORY_TYPE.icon);
    expect(component.entityListConfig.defaultColumnSorting).toEqual(['name']);
    expect(component.entityListConfig.gridOptions.newButton).toBe(true);
    expect(component.entityListConfig.gridOptions.deleteButton).toBe(true);
    expect(component.entityListConfig.gridOptions.applyChangesButton).toBe(false);
  });

  it('postFetchData builds checkbox, name link, and boolean columns', async () => {
    await component.postFetchData();

    expect(component.entityListConfig.columnDefs).toHaveLength(5);
    expect(component.entityListConfig.columnDefs[0].field).toBe('__loadingSelection');
    expect(component.entityListConfig.columnDefs[1].field).toBe('name');
    expect(component.entityListConfig.columnDefs[2].field).toBe('official');
    expect(component.entityListConfig.columnDefs[3].field).toBe('topType');
    expect(component.entityListConfig.columnDefs[4].field).toBe('bottomType');
  });

  it('newData navigates to create form route', async () => {
    await component.newData();
    expect(router.navigate).toHaveBeenCalledWith(['territoryType', -1, 'territoryTypeForm']);
  });

  it('duplicateItem navigates to duplicate form route', async () => {
    await component.duplicateItem(7);
    expect(router.navigate).toHaveBeenCalledWith(['territoryType', -1, 'territoryTypeForm', 7]);
  });

  it('delegates update and delete to TerritoryTypeService', async () => {
    const entity = { id: 3, name: 'Test' } as TerritoryType;
    const updateSpy = jest.spyOn(territoryTypeService, 'update').mockReturnValue(of(entity));
    const deleteSpy = jest.spyOn(territoryTypeService, 'delete').mockReturnValue(of(undefined));

    await component.dataUpdateFn(entity);
    await component.dataDeleteFn(entity);

    expect(updateSpy).toHaveBeenCalledWith(entity);
    expect(deleteSpy).toHaveBeenCalledWith(entity);
  });
});
