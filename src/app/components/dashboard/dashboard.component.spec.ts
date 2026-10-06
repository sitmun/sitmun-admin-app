import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter, RouterModule } from '@angular/router';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { ExternalConfigurationService } from '@app/core/config/external-configuration.service';
import {ExternalService, ResourceService} from '@app/core/hal';
import {CodeListService, DashboardService, ServiceService, TranslationService} from '@app/domain';
import { DataGridComponent } from '@app/frontend-gui/src/lib/data-grid/data-grid.component';
import { SitmunFrontendGuiModule } from '@app/frontend-gui/src/lib/public_api';
import { MaterialModule } from '@app/material-module';
import { UtilsService } from '@app/services/utils.service';

import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  // Mock Web Animations API for Jest environment
  beforeAll(() => {
    Element.prototype.animate = jest.fn(() => ({
      play: jest.fn(),
      pause: jest.fn(),
      finish: jest.fn(),
      cancel: jest.fn(),
      reverse: jest.fn(),
      updatePlaybackRate: jest.fn(),
      setCurrentTime: jest.fn(),
      setStartTime: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
      currentTime: 0,
      startTime: 0,
      playState: 'idle',
      playbackRate: 1,
      onfinish: null,
      oncancel: null,
      ready: Promise.resolve(),
      finished: Promise.resolve(),
    })) as any;
  });

  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let dashboardService: DashboardService;
  let codeListService: CodeListService;
  let resourceService: ResourceService;
  let externalService: ExternalService;

  beforeAll(async () => {
     
    await TestBed.configureTestingModule({
      teardown: { destroyAfterEach: 0 as any },
      declarations: [ DashboardComponent ],
      imports : [SitmunFrontendGuiModule, DataGridComponent, MatIconTestingModule,
         MaterialModule, RouterModule, NoopAnimationsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: () => ({
              getTranslation: () => of({})
            })
          }
        })],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),DashboardService,ServiceService,TranslationService,CodeListService,ResourceService,ExternalService,UtilsService,
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService }, ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    dashboardService= TestBed.inject(DashboardService);
    codeListService= TestBed.inject(CodeListService);
    resourceService= TestBed.inject(ResourceService);
    externalService= TestBed.inject(ExternalService);
    
    // Mock DashboardService.getAll to return empty data to prevent async operations
    jest.spyOn(dashboardService, 'getAll').mockReturnValue(
      of({
        total: { users: 0, services: 0, tasks: 0, territories: 0, cartographies: 0, applications: 0, applicationsTerritories: 0 },
        sum: { users: 0, services: 0, tasks: 0, territories: 0, cartographies: 0, applications: 0, applicationsTerritories: 0 },
        'cartographies-created-on-date': null,
        'users-created-on-date': null,
        'users-per-application': null
      }) as any
    );
    
    jest.spyOn(TestBed.inject(ServiceService), 'accessSummaries').mockReturnValue(of([]));
    jest.spyOn(TestBed.inject(ServiceService), 'affectedApplications').mockReturnValue(of([]));
    jest.spyOn(TestBed.inject(ServiceService), 'fetchAllRawItems').mockReturnValue(of([]));
    // Set dataLoaded to true to avoid triggering animations during tests
    component.dataLoaded = true;
    // Don't call detectChanges() here to avoid animation issues
    // Individual tests can call it if needed
  });

  afterEach(() => fixture?.destroy());
  afterAll(() => TestBed.resetTestingModule());

  it('renders KPI values and translated empty states', () => {
    component.dataLoaded = true;
    component.KPIsTable = [
      {text: 'Users', number: 7, icon: 'group', tooltip: 'Users tip'},
      {text: 'Services', number: 3, icon: 'cloud_queue', tooltip: 'Services tip'},
      {text: 'Tasks', number: 1, icon: 'assignment', tooltip: 'Tasks tip'},
    ];
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Users');
    expect(text).toContain('7');
    expect(text).toContain('dashboard.inventory');
    expect(fixture.nativeElement.querySelector('app-datagraph')).toBeNull();
  });

  it('links health cards and lists the worst failing services', async () => {
    jest.spyOn(TestBed.inject(ServiceService), 'accessSummaries').mockReturnValue(of([
      {serviceId: 4, status: 'timeout', statusRank: 70, observer: 'proxy', elapsedMs: 10, observedAt: '2026-10-05T11:00:00Z', detail: '', hours: []},
      {serviceId: 8, status: 'up', statusRank: 0, observer: 'backend', elapsedMs: 10, observedAt: '2026-10-05T11:00:00Z', detail: '', hours: []},
    ]) as any);
    jest.spyOn(TestBed.inject(ServiceService), 'fetchAllRawItems').mockReturnValue(of([{id: 4, name: 'Ortho'}]) as any);
    fixture.detectChanges();
    for (let attempt = 0; attempt < 5 && component.healthCards.length === 0; attempt++) {
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
    fixture.detectChanges();
    expect(component.healthCards.map((card) => card.queryParams.health)).toEqual(['failing', 'unchecked', 'healthy']);
    expect(component.healthCards.map((card) => card.display)).toEqual(['1', '0', '1']);
    const attention = fixture.nativeElement.querySelector('.attention') as HTMLElement;
    expect(attention).not.toBeNull();
    expect(component.attention.map((row) => row.name)).toEqual(['Ortho']);
    const status = component.attentionColumnDefs.find((col) => col.field === 'accessLabel');
    const dot = status.cellRenderer({data: component.attention[0]}) as HTMLElement;
    expect(dot.querySelector('.service-access-status-dot')).not.toBeNull();
    const attentionCards = attention.querySelectorAll('mat-card');
    expect(attentionCards).toHaveLength(1);
    expect(attentionCards[0].querySelector('ag-grid-angular')).not.toBeNull();
    expect(attentionCards[0].contains(attention.querySelector('#attention-title'))).toBe(false);
    expect(attention.querySelector('mat-toolbar')).toBeNull();
    expect(attention.querySelector('.ag-selection-checkbox')).toBeNull();
  });

  it('defines needing-attention columns on the shared AG Grid', () => {
    const columns = component.attentionColumnDefs;
    const name = columns.find((col) => col.field === 'name');
    expect(name.cellRenderer).toBe('routerLinkRenderer');
    expect(name.cellRendererParams).toEqual({
      route: 'service/:id/serviceForm',
      paramFields: {id: 'id'},
    });
    expect(name.sortable).toBe(true);
    expect(name.filter).toBe(true);
    for (const field of ['name', 'type', 'serviceURL', 'accessLabel']) {
      const column = columns.find((col) => col.field === field);
      expect(column.sortable).toBe(true);
      expect(column.filter).toBe(true);
    }
    const trend = columns.find((col) => col.colId === 'trend');
    expect(trend.sortable).toBe(false);
    expect(trend.filter).toBe(false);
    const strip = trend.cellRenderer({data: {summary: {hours: []}}}) as HTMLElement;
    const hours = Array.from(strip.querySelectorAll('.service-access-hour')) as HTMLElement[];
    expect(hours).toHaveLength(24);
    expect(hours.every((hour) => hour.style.backgroundColor === 'rgb(196, 196, 196)')).toBe(true);
    expect(strip.querySelector('.service-access-hour-empty')).toBeNull();
    const usage = columns.find((col) => col.field === 'usage30');
    expect(usage.cellRenderer).toEqual(expect.any(Function));
    expect(usage.filter).toBe(true);
    expect(columns.some((col) => col.checkboxSelection)).toBe(false);
    expect(component.dashboardGrid).toEqual({
      readOnly: true,
      hideExportButton: true,
    });
    const status = columns.find((col) => col.field === 'accessLabel');
    expect(status.sort).toBe('desc');
    const endpoint = columns.find((col) => col.field === 'serviceURL');
    expect(endpoint.cellRenderer).toBeUndefined();
  });

  it('hides affected applications when no service is failing', async () => {
    fixture.detectChanges();
    for (let attempt = 0; attempt < 5; attempt++) {
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.affected')).toBeNull();
  });

  it('lists affected applications when services are failing', async () => {
    jest.spyOn(TestBed.inject(ServiceService), 'accessSummaries').mockReturnValue(of([
      {serviceId: 4, status: 'timeout', statusRank: 70, observer: 'proxy', elapsedMs: 10, observedAt: '2026-10-05T11:00:00Z', detail: '', hours: []},
    ]) as any);
    jest.spyOn(TestBed.inject(ServiceService), 'affectedApplications').mockReturnValue(of([
      {applicationId: 3, applicationName: 'Atlas', failingServices: [{id: 4, name: 'Roads'}], requests30d: 12, usage: 'used'},
      {applicationId: 5, applicationName: 'Cadastre', failingServices: [{id: 4, name: 'Roads'}], requests30d: 0, usage: 'configured'},
    ]));
    fixture.detectChanges();
    for (let attempt = 0; attempt < 5 && component.affectedApplications.length === 0; attempt++) {
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
    fixture.detectChanges();
    const section = fixture.nativeElement.querySelector('.affected') as HTMLElement;
    expect(section).not.toBeNull();
    const affectedCards = section.querySelectorAll('mat-card');
    expect(affectedCards).toHaveLength(1);
    expect(affectedCards[0].querySelector('ag-grid-angular')).not.toBeNull();
    expect(affectedCards[0].contains(section.querySelector('#affected-title'))).toBe(false);
    expect(section.querySelector('mat-toolbar')).toBeNull();
    expect(section.textContent).toContain('dashboard.affected.usedCount');
    expect(section.textContent).toContain('dashboard.affected.configuredOne');
    const loaded = [...component.affectedApplications];
    component.affectedApplications = [
      {applicationId: 5, applicationName: 'Cadastre', failingServices: [{id: 4, name: 'Roads'}], requests30d: 0, usage: 'configured'},
    ];
    expect(component.affectedStatus()).toBe('dashboard.affected.noneUsed · dashboard.affected.configuredOne');
    const name = component.affectedColumnDefs.find((col) => col.field === 'applicationName');
    expect(name.cellRenderer).toBe('routerLinkRenderer');
    expect(name.cellRendererParams).toEqual({
      route: 'application/:id/applicationForm',
      paramFields: {id: 'applicationId'},
    });
    expect(component.affectedColumnDefs.some((col) => col.checkboxSelection)).toBe(false);
    const services = component.affectedColumnDefs.find((col) => col.field === 'failingServices');
    const servicesCell = services.cellRenderer({data: loaded[0]}) as HTMLElement;
    expect(servicesCell.textContent).toContain('1');
    expect(servicesCell.textContent).toContain('Roads');
    const requests = component.affectedColumnDefs.find((col) => col.field === 'requests30d');
    expect(requests.sort).toBe('desc');
    expect(requests.sortable).toBe(true);
    expect(requests.filter).toBe(true);
    const usage = component.affectedColumnDefs.find((col) => col.field === 'usage');
    const used = usage.cellRenderer({data: loaded[0]}) as HTMLElement;
    const configured = usage.cellRenderer({data: loaded[1]}) as HTMLElement;
    expect(used.textContent).toContain('dashboard.affected.used');
    expect(configured.classList.contains('cfg')).toBe(true);
    expect(configured.textContent).toContain('dashboard.affected.configured');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    // Component is created without calling detectChanges to avoid animation issues
  });

  it('should instantiate dashboardService', () => {
    expect(dashboardService).toBeTruthy();
  });

  it('should instantiate codeListService', () => {
    expect(codeListService).toBeTruthy();
  });

  it('should instantiate resourceService', () => {
    expect(resourceService).toBeTruthy();
  });

  it('should instantiate externalService', () => {
    expect(externalService).toBeTruthy();
  });
});
