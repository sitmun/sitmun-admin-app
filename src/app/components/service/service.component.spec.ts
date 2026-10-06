import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { provideRouter, RouterModule } from '@angular/router';

import {TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {of} from 'rxjs';

import {EntityListComponent} from '@app/components/shared/entity-list/entity-list.component';
import { ExternalConfigurationService } from '@app/core/config/external-configuration.service';
import {ExternalService, ResourceService} from '@app/core/hal';
import {CodeListService, ServiceService, TranslationService} from '@app/domain';
import { SitmunFrontendGuiModule } from '@app/frontend-gui/src/lib/public_api';
import { MaterialModule } from '@app/material-module';

import { ServiceHealthFilterComponent } from './service-health-filter.component';
import { ServiceComponent } from './service.component';

describe('ServiceComponent', () => {
  let component: ServiceComponent;
  let fixture: ComponentFixture<ServiceComponent>;
  let serviceService: ServiceService;
  let codeListService: CodeListService;
  let translationService: TranslationService;
  let resourceService: ResourceService;
  let externalService: ExternalService;
  let httpMock: HttpTestingController;

  beforeAll(async () => {
     
    await TestBed.configureTestingModule({
      teardown: { destroyAfterEach: 0 as any },
      declarations: [ ServiceComponent, EntityListComponent ],
      imports : [SitmunFrontendGuiModule, MaterialModule, MatIconTestingModule, RouterModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: () => ({
              getTranslation: () => of({})
            })
          }
        })],
      providers: [
        ServiceService,
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
    fixture = TestBed.createComponent(ServiceComponent);
    component = fixture.componentInstance;
    serviceService = TestBed.inject(ServiceService);
    codeListService = TestBed.inject(CodeListService);
    translationService = TestBed.inject(TranslationService);
    resourceService = TestBed.inject(ResourceService);
    externalService = TestBed.inject(ExternalService);
    fixture.detectChanges();
    await new Promise((r) => setTimeout(r, 0));
    httpMock.match((req) => req.url.includes('codelist-values')).forEach((req) =>
      req.flush({ _embedded: { 'codelist-values': [] } })
    );
    await new Promise((r) => setTimeout(r, 0));
    httpMock.match((req) => req.url.includes('access-summaries')).forEach((req) => req.flush([]));
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

  it('should instantiate serviceService', () => {
    expect(serviceService).toBeTruthy();
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

  it('joins the summary status onto the status column', async () => {
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('es', {'entity.service.access.status.up': 'Operativo'}, true);
    translate.use('es');

    const loaded = component.postFetchData();
    const request = httpMock.expectOne((req) => req.method === 'GET' && req.url.includes('/access-summaries'));
    request.flush([
      {
        serviceId: 7,
        status: 'up',
        statusRank: 0,
        observer: 'proxy',
        elapsedMs: 12,
        observedAt: '2026-10-05T11:30:00Z',
        detail: 'hidden',
        hours: [{status: 'server_error', statusRank: 50}, null, {status: 'up', statusRank: 0}],
      },
    ]);
    await loaded;

    const statusCol = component.entityListConfig.columnDefs.find((column) => column.field === 'accessStatus');
    expect(statusCol.valueGetter({data: {id: 7}})).toBe('Operativo');
    expect(statusCol.valueGetter({data: {id: 8}})).toBe('');

    const headers = component.entityListConfig.columnDefs.map((column) => column.field ?? column.colId);
    expect(headers).not.toContain('observer');
    expect(headers).not.toContain('elapsedMs');
    expect(headers).not.toContain('detail');
    expect(headers).not.toContain('accessTrend');
    expect(headers).not.toContain('usage30');
  });

  it('drops the 24 h and usage columns and gives that width to the name', async () => {
    const loaded = component.postFetchData();
    httpMock.expectOne((req) => req.method === 'GET' && req.url.includes('/access-summaries')).flush([]);
    await loaded;

    const columns = component.entityListConfig.columnDefs;
    const nameCol = columns.find((column) => column.field === 'name');
    const typeCol = columns.find((column) => column.field === 'type');
    const endpointCol = columns.find((column) => column.field === 'serviceURL');
    const statusCol = columns.find((column) => column.field === 'accessStatus');

    expect(columns.map((column) => column.field ?? column.colId)).toEqual([
      '__loadingSelection',
      'name',
      'type',
      'serviceURL',
      'accessStatus',
    ]);
    expect(columns.find((column) => column.colId === 'accessTrend')).toBeUndefined();
    expect(columns.find((column) => column.colId === 'usage30')).toBeUndefined();
    expect(nameCol.cellRenderer).toBe('routerLinkRenderer');
    expect(nameCol.sortable).toBe(true);
    expect(nameCol.flex).toBeGreaterThan(2);
    expect(nameCol.flex).toBeGreaterThan(endpointCol.flex);
    expect(endpointCol.flex).toBe(4);
    expect(typeCol.resizable).toBe(true);
    expect(typeCol.flex).toBe(0);
    expect(typeCol.width).toBe(108);
    expect(typeCol.maxWidth).toBeUndefined();
    expect(statusCol.flex).toBe(0);
    expect(statusCol.width).toBe(168);
    expect(statusCol.resizable).toBe(true);
    expect(statusCol.maxWidth).toBeUndefined();

    const minimums = columns.reduce((sum, column) => sum + (column.flex ? column.minWidth ?? 0 : column.width ?? column.minWidth ?? 56), 0);
    expect(minimums).toBeLessThanOrEqual(1142);
  });

  it('still omits 24 h and usage when access summaries are unavailable', async () => {
    const loaded = component.postFetchData();
    httpMock.expectOne((req) => req.method === 'GET' && req.url.includes('/access-summaries'))
      .flush(null, {status: 404, statusText: 'Not Found'});
    await loaded;

    const columns = component.entityListConfig.columnDefs;
    expect(columns.find((column) => column.colId === 'accessTrend')).toBeUndefined();
    expect(columns.find((column) => column.colId === 'usage30')).toBeUndefined();
    expect(columns.find((column) => column.field === 'accessStatus')).toBeTruthy();
    expect(columns.find((column) => column.field === 'name').flex).toBeGreaterThan(2);
  });

  it('filters health from the status column header and sorts status by access rank', async () => {
    const loaded = component.postFetchData();
    httpMock.expectOne((req) => req.method === 'GET' && req.url.includes('/access-summaries')).flush([]);
    await loaded;
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('mat-chip-listbox')).toBeNull();
    expect(component.entityListConfig.gridComponents?.serviceHealthFilter).toBe(ServiceHealthFilterComponent);

    const status = component.entityListConfig.columnDefs.find((column) => column.field === 'accessStatus');
    expect(status.sortable).toBe(true);
    expect(status.cellRendererParams.sortField).toBe('accessRank');
    expect(status.filter).toBe('serviceHealthFilter');
    expect(status.headerClass).toBe('sitmun-access-status-header');
    expect(status.icons.menu).toContain('ag-icon-filter');
    expect(status.filterParams.options.map((option) => option.id)).toEqual(['all', 'failing', 'healthy', 'unchecked']);
    expect(status.filterParams.options[0].label).toBe('entity.service.health.all');

    status.filterParams.onHealth('failing');
    expect(component.health).toBe('failing');
    expect(status.filterParams.health()).toBe('failing');
    status.filterParams.onHealth(null);
    expect(status.filterParams.health()).toBeNull();

    const dot = status.cellRenderer({data: {id: 9}}) as HTMLElement;
    expect(dot.querySelector('.service-access-status-dot.service-access-status-halo')).toBeTruthy();
  });

  it('leaves the infinite loading placeholder blank and still paints a service with no summary', async () => {
    const loaded = component.postFetchData();
    httpMock.expectOne((req) => req.method === 'GET' && req.url.includes('/access-summaries')).flush([]);
    await loaded;

    const status = component.entityListConfig.columnDefs.find((column) => column.field === 'accessStatus');

    expect(status.cellRenderer({})).toBe('');

    const empty = status.cellRenderer({data: {id: 999}}) as HTMLElement;
    expect(empty.querySelector('.service-access-status-dot')).toBeTruthy();
  });
});
