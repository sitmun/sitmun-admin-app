import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { provideRouter, RouterModule } from '@angular/router';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import {EntityListComponent} from '@app/components/shared/entity-list/entity-list.component';
import { ExternalConfigurationService } from '@app/core/config/external-configuration.service';
import {ExternalService, ResourceService} from '@app/core/hal';
import { CartographyService, CodeListService, TranslationService } from '@app/domain';
import { SitmunFrontendGuiModule } from '@app/frontend-gui/src/lib/public_api';
import { MaterialModule } from '@app/material-module';

import { LayersComponent } from './layers.component';

describe('LayersComponent', () => {
  let component: LayersComponent;
  let fixture: ComponentFixture<LayersComponent>;
  let cartographyService: CartographyService;
  let codeListService: CodeListService;
  let translationService: TranslationService;
  let resourceService: ResourceService;
  let externalService: ExternalService;
  let httpMock: HttpTestingController;

  beforeAll(async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await TestBed.configureTestingModule({
      teardown: { destroyAfterEach: 0 as any },
      declarations: [ LayersComponent, EntityListComponent ],
      imports : [SitmunFrontendGuiModule, MatIconTestingModule,
         MaterialModule, RouterModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: () => ({
              getTranslation: () => of({})
            })
          }
        })],
      providers: [
        CartographyService,
        CodeListService,
        TranslationService,
        ResourceService,
        ExternalService,
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService },
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ]
    })
    .compileComponents();
  });

  beforeEach(async () => {
    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(LayersComponent);
    component = fixture.componentInstance;
    cartographyService = TestBed.inject(CartographyService);
    codeListService = TestBed.inject(CodeListService);
    translationService = TestBed.inject(TranslationService);
    resourceService = TestBed.inject(ResourceService);
    externalService = TestBed.inject(ExternalService);
    fixture.detectChanges();
    await new Promise((r) => setTimeout(r, 0));
    httpMock.match((req) => req.url.includes('codelist-values')).forEach((req) =>
      req.flush({ _embedded: { 'codelist-values': [] } })
    );
    await fixture.whenStable();
  });

  afterEach(() => {
    fixture?.destroy();
    httpMock.verify();
  });

  afterAll(() => TestBed.resetTestingModule());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should instantiate cartographyService', () => {
    expect(cartographyService).toBeTruthy();
  });

  it('should instantiate codeListService', () => {
    expect(codeListService).toBeTruthy();
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

  it('uses row-only checkbox selection in infinite mode', async () => {
    await component.postFetchData();

    const checkboxColumn = component.entityListConfig.columnDefs[0] as any;

    expect(checkboxColumn).not.toHaveProperty('headerCheckboxSelection');
    expect(checkboxColumn.valueGetter()).toBe('');
    expect(checkboxColumn.checkboxSelection({data: undefined})).toBe(false);
    expect(checkboxColumn.checkboxSelection({data: {id: 1}})).toBe(true);
    expect(checkboxColumn.cellClass({data: undefined})).toBe(
      'sitmun-centered-cell sitmun-loading-checkbox-cell'
    );
    expect(checkboxColumn.cellClass({data: {id: 1}})).toBe('sitmun-centered-cell');
  });

  it('uses backend search and disables progressive local filtering', () => {
    expect(component.entityListConfig.backendSearch).toBe(true);
    expect(component.entityListConfig.progressiveLocalFilter).toBe(false);
  });

  it('routes non-blank infinite block search through cartography text search', (done) => {
    const getPageSpy = jest.spyOn(cartographyService, 'fetchPage');
    const searchSpy = jest.spyOn(cartographyService, 'searchTextPage').mockReturnValue(of({
      rows: [{id: 1, name: 'Road layer'} as any],
      pageNumber: 0,
      pageSize: 10,
      totalElements: 1,
      totalPages: 1,
    }));

    component.entityListConfig.infiniteBlockFetcher({
      page: 0,
      size: 10,
      sort: [{path: 'name', order: 'ASC'}, {path: 'id', order: 'ASC'}],
      searchText: 'road',
    }).subscribe((page) => {
      expect(searchSpy).toHaveBeenCalledWith('road', {
        page: 0,
        size: 10,
        sort: [{path: 'name', order: 'ASC'}, {path: 'id', order: 'ASC'}],
      });
      expect(getPageSpy).not.toHaveBeenCalled();
      expect(page.totalElements).toBe(1);
      done();
    });
  });

  it('routes blank infinite block search through normal cartography paging', (done) => {
    const searchSpy = jest.spyOn(cartographyService, 'searchTextPage');
    const getPageSpy = jest.spyOn(cartographyService, 'fetchPage').mockReturnValue(of({
      rows: [{id: 2, name: 'Any layer'} as any],
      pageNumber: 0,
      pageSize: 10,
      totalElements: 2,
      totalPages: 1,
    }));

    component.entityListConfig.infiniteBlockFetcher({
      page: 0,
      size: 10,
      sort: [{path: 'name', order: 'ASC'}, {path: 'id', order: 'ASC'}],
    }).subscribe((page) => {
      expect(getPageSpy).toHaveBeenCalledWith({
        page: 0,
        size: 10,
        sort: [{path: 'name', order: 'ASC'}, {path: 'id', order: 'ASC'}],
      });
      expect(searchSpy).not.toHaveBeenCalled();
      expect(page.totalElements).toBe(2);
      done();
    });
  });
});
