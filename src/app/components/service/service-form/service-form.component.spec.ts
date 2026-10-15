
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

import {EntityFormAlertsComponent} from '@app/components/shared/entity-form-alerts/entity-form-alerts.component';
import {FormToolbarComponent} from '@app/components/shared/form-toolbar/form-toolbar.component';
import { ExternalConfigurationService } from '@app/core/config/external-configuration.service';
import {ExternalService, ResourceService} from '@app/core/hal';
import {SUPPRESS_HTTP_NOTIFICATION} from '@app/core/interceptors/messages.interceptor';
import {
  CartographyService,
  CartographyStyleService,
  CodeListService,
  RoleService,
  ServiceParameterService,
  ServiceService,
  TranslationService
} from '@app/domain';
import {ServiceAccessHour} from '@app/domain/service/models/service-access.model';
import { SitmunFrontendGuiModule } from '@app/frontend-gui/src/lib/public_api';
import { MaterialModule } from '@app/material-module';
import { LoggerService } from '@app/services/logger.service';
import { UtilsService } from '@app/services/utils.service';
import { WMSCapabilitiesService, WMSServiceCapabilities } from '@app/services/wms-capabilities.service';
import {configureLoggerForTests, provideErrorHandlerForTests} from '@app/testing/test-helpers';
import { config } from '@config';

import {ServiceAccessTimelineComponent} from '../service-access-timeline.component';
import { ServiceFormComponent } from './service-form.component';

describe('ServiceFormComponent', () => {
  let component: ServiceFormComponent;
  let fixture: ComponentFixture<ServiceFormComponent>;
  let serviceService: ServiceService;
  let cartographyService: CartographyService;
  let cartographyStyleService: CartographyStyleService;
  let codeListService: CodeListService;
  let translationService: TranslationService;
  let resourceService: ResourceService;
  let externalService: ExternalService;
  let _serviceParameterService: ServiceParameterService;
  let _roleService: RoleService;
  let _consoleErrorSpy: jest.SpyInstance;

  beforeAll(async () => {
     
    await TestBed.configureTestingModule({
      teardown: { destroyAfterEach: 0 as any },
      declarations: [ ServiceFormComponent, FormToolbarComponent, ServiceAccessTimelineComponent ],
      imports: [FormsModule, ReactiveFormsModule, SitmunFrontendGuiModule, EntityFormAlertsComponent, RouterModule.forRoot([], {}), MaterialModule, TranslateModule.forRoot({
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
        ServiceService,
        CartographyService,
        CartographyStyleService,
        CodeListService,
        TranslationService,
        ResourceService,
        ExternalService,
        ServiceParameterService,
        RoleService,
        UtilsService,
        WMSCapabilitiesService,
        LoggerService,
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    _consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    fixture = TestBed.createComponent(ServiceFormComponent);
    component = fixture.componentInstance;
    // Suppress debug logs in tests to reduce console noise
    const loggerService = TestBed.inject(LoggerService);
    configureLoggerForTests(loggerService);
    serviceService = TestBed.inject(ServiceService);
    cartographyService = TestBed.inject(CartographyService);
    cartographyStyleService = TestBed.inject(CartographyStyleService);
    codeListService = TestBed.inject(CodeListService);
    translationService = TestBed.inject(TranslationService);
    resourceService = TestBed.inject(ResourceService);
    externalService = TestBed.inject(ExternalService);
    _serviceParameterService = TestBed.inject(ServiceParameterService);
    _roleService = TestBed.inject(RoleService);

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

  it('should instantiate serviceService', () => {
    expect(serviceService).toBeTruthy();
  });

  it('should instantiate cartographyService', () => {
    expect(cartographyService).toBeTruthy();
  });

  it('should instantiate cartographyStyleService', () => {
    expect(cartographyStyleService).toBeTruthy();
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

  it('form invalid when empty', () => {
    expect(component.entityForm.valid).toBeFalsy();
  });

  it('form invalid when mid-empty', () => {
    component.entityForm.patchValue({
      user: 'user',
      password: 'password',
      authenticationMode: 1,
      description: 'description',
      type: 'WMS',
      serviceURL: 'urltest',
      proxyUrl: 'urltest',
      supportedSRS: ['EPSG:2831'],
      getInformationURL: 'urltest',
      blocked: true,
      isProxied: false
    })
    //Miss name (required field)
    expect(component.entityForm.valid).toBeFalsy();
  });

  it('form valid', () => {
    component.entityForm.patchValue({
      name: 'test',
      description: 'test',
      type: 'WMS',
      serviceURL: 'test',
      authenticationMode: 1
    })

    fixture.detectChanges();

    expect(component.entityForm.valid).toBeTruthy();
  });

  it('Service form fields', () => {
    expect(component.entityForm.get('name')).toBeTruthy();
    expect(component.entityForm.get('description')).toBeTruthy();
    expect(component.entityForm.get('type')).toBeTruthy();
    expect(component.entityForm.get('serviceURL')).toBeTruthy();
    expect(component.entityForm.get('getInformationURL')).toBeTruthy();
    expect(component.entityForm.get('authenticationMode')).toBeTruthy();
    expect(component.entityForm.get('user')).toBeTruthy();
    expect(component.entityForm.get('password')).toBeTruthy();
    expect(component.entityForm.get('isProxied')).toBeTruthy();
    expect(component.entityForm.get('blocked')).toBeTruthy();
  });

  it('hides the capabilities button when the type is not WMS', () => {
    component.entityForm.patchValue({
      name: 'test',
      type: 'WFS',
      serviceURL: 'test',
      authenticationMode: 1
    })

    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('#capabilitiesButton'));
    expect(button).toBeNull();
  });

  it('isWMS() should return true when type is WMS', () => {
    component.entityForm.patchValue({
      name: 'test',
      type: 'WMS',
      serviceURL: 'test',
      authenticationMode: 1
    });

    fixture.detectChanges();

    expect(component.isWMS()).toBeTruthy();
  });

  it('isWMS() should return false when type is not WMS', () => {
    component.entityForm.patchValue({
      name: 'test',
      type: 'WFS',
      serviceURL: 'test',
      authenticationMode: 1
    });

    fixture.detectChanges();

    expect(component.isWMS()).toBeFalsy();
  });

  describe('Grid capability classification', () => {
    it('parametersTable should have template-dialog, updater, and status capabilities', () => {
      const table = component['parametersTable'];
      expect(table.hasTemplateDialogs()).toBe(true);
      expect(table.hasRelationsUpdater()).toBe(true);
      expect(table.hasStatusColumn()).toBe(true);
      expect(table.supportsDuplicate()).toBe(false);
      expect(table.hasPickerAdd()).toBe(false);
    });

    it('layersTable should have updater and status, no picker/template/duplicate', () => {
      const table = component['layersTable'];
      expect(table.hasRelationsUpdater()).toBe(true);
      expect(table.hasStatusColumn()).toBe(true);
      expect(table.hasPickerAdd()).toBe(false);
      expect(table.hasTemplateDialogs()).toBe(false);
      expect(table.supportsDuplicate()).toBe(false);
    });

    it('layersTable title links existing layers to the layer form and keeps unregistered rows editable', () => {
      const table = component['layersTable'];
      const titleColumn = table.relationsColumnsDefs.find((column: { field?: string }) => column.field === 'name');

      expect(titleColumn).toBeTruthy();
      expect(titleColumn.cellRenderer).toBe('routerLinkRenderer');
      expect(titleColumn.cellRendererParams).toEqual({
        route: '/layers/:id/layersForm',
        paramFields: { id: 'id' },
      });
      expect(typeof titleColumn.editable).toBe('function');
      expect(titleColumn.editable({ data: { id: 42 } })).toBe(false);
      expect(titleColumn.editable({ data: { status: 'unregisteredLayer' } })).toBe(true);
    });
  });

  describe('onUpdateServiceMetadata multilingual translations', () => {
    let dialog: MatDialog;
    let wmsCapabilitiesService: WMSCapabilitiesService;
    const originalLanguagesToUse = config.languagesToUse;

    beforeEach(() => {
      config.languagesToUse = [
        { shortname: 'ca', name: 'Catala' } as never,
        { shortname: 'es', name: 'Castellano' } as never,
        { shortname: 'en', name: 'English' } as never,
      ];
      component.initTranslations('Service', ['description', 'name']);

      dialog = TestBed.inject(MatDialog);
      wmsCapabilitiesService = TestBed.inject(WMSCapabilitiesService);

      jest.spyOn(dialog, 'open').mockReturnValue({
        componentInstance: {},
        afterClosed: () => of({ event: 'Accept' }),
      } as never);

      component.entityForm.patchValue({
        name: 'old name',
        description: 'old description',
        type: 'WMS',
        serviceURL: 'https://example.org/wms',
        authenticationMode: 1,
      });
    });

    afterEach(() => {
      config.languagesToUse = originalLanguagesToUse;
    });

    it('applies main values and translation rows from capabilities metadata', async () => {
      jest.spyOn(wmsCapabilitiesService, 'processWMSServiceMetadata').mockResolvedValue(
        new WMSServiceCapabilities(
          {},
          'Nom catala',
          new Map([['es', 'Nombre castellano']]),
          'Descripcio catalana',
          new Map([['es', 'Descripcion castellana']]),
          ['EPSG:25831'],
        )
      );

      component.onUpdateServiceMetadata();
      await fixture.whenStable();
      await Promise.resolve();

      expect(component.entityForm.value.name).toBe('Nom catala');
      expect(component.entityForm.value.description).toBe('Descripcio catalana');
      expect(component.propertyTranslations.get('name')?.map.get('es')?.translation).toBe('Nombre castellano');
      expect(component.propertyTranslations.get('description')?.map.get('es')?.translation).toBe('Descripcion castellana');
      expect(component.propertyTranslations.get('name')?.modified).toBe(true);
      expect(component.propertyTranslations.get('description')?.modified).toBe(true);
    });

    it('applies case B main-language translation row when default lang is absent from capabilities', async () => {
      jest.spyOn(wmsCapabilitiesService, 'processWMSServiceMetadata').mockResolvedValue(
        new WMSServiceCapabilities(
          {},
          'Nom catala',
          new Map([['ca', 'Nom catala'], ['es', 'Nombre castellano']]),
          'Descripcio catalana',
          new Map([['ca', 'Descripcio catalana'], ['es', 'Descripcion castellana']]),
          ['EPSG:25831'],
        )
      );

      component.onUpdateServiceMetadata();
      await fixture.whenStable();
      await Promise.resolve();

      expect(component.propertyTranslations.get('description')?.map.get('ca')?.translation).toBe('Descripcio catalana');
      expect(component.propertyTranslations.get('description')?.map.get('es')?.translation).toBe('Descripcion castellana');
    });

    it('ignores unsupported capability languages and does not mark property modified', async () => {
      jest.spyOn(wmsCapabilitiesService, 'processWMSServiceMetadata').mockResolvedValue(
        new WMSServiceCapabilities(
          {},
          'Nom catala',
          new Map([['fr', 'Nom francais']]),
          'Descripcio catalana',
          new Map([['fr', 'Description francaise']]),
          ['EPSG:25831'],
        )
      );

      component.onUpdateServiceMetadata();
      await fixture.whenStable();
      await Promise.resolve();

      expect(component.propertyTranslations.get('name')?.modified).toBe(false);
      expect(component.propertyTranslations.get('description')?.modified).toBe(false);
    });
  });

  describe('auth implies proxy', () => {
    beforeEach(() => {
      component.dataLoaded = true;
      component.entityForm.patchValue({
        name: 'test',
        type: 'WMS',
        serviceURL: 'https://example.com/wms',
      });
      fixture.detectChanges();
    });

    it('always shows the proxy and authentication card', () => {
      component.entityForm.patchValue({isProxied: false});
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('.sitmun-service-form-proxy-auth-card'))).not.toBeNull();
    });

    it('always shows authentication fields', () => {
      component.entityForm.patchValue({isProxied: false});
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('.sitmun-service-form-auth-fields'))).not.toBeNull();
    });

    it('keeps authentication fields enabled when proxy is disabled', () => {
      component.entityForm.patchValue({isProxied: false, authenticationMode: 'None'});
      fixture.detectChanges();

      expect(component.isProxyEnabled()).toBe(false);
      expect(component.entityForm.get('authenticationMode')?.disabled).toBe(false);
      expect(component.entityForm.get('user')?.disabled).toBe(false);
      expect(component.entityForm.get('password')?.disabled).toBe(false);
    });

    it('forces proxy on when authentication is not None', () => {
      component.entityForm.patchValue({isProxied: false, authenticationMode: 'None'});
      component.entityForm.patchValue({authenticationMode: 'HTTP Basic authentication'});
      fixture.detectChanges();

      expect(component.entityForm.get('isProxied')?.value).toBe(true);
      expect(component.entityForm.get('authenticationMode')?.disabled).toBe(false);
    });

    it('snaps proxy back on if turned off while authentication is set', () => {
      component.entityForm.patchValue({
        isProxied: true,
        authenticationMode: 'HTTP Basic authentication',
        user: 'proxy-user',
        password: 'proxy-pass',
      });

      component.entityForm.patchValue({isProxied: false});
      fixture.detectChanges();

      expect(component.entityForm.get('isProxied')?.value).toBe(true);
      expect(component.entityForm.get('authenticationMode')?.value).toBe('HTTP Basic authentication');
      expect(component.entityForm.get('user')?.value).toBe('proxy-user');
      expect(component.entityForm.get('password')?.value).toBe('proxy-pass');
    });

    it('does not force proxy off when authentication is cleared to None', () => {
      component.entityForm.patchValue({
        isProxied: true,
        authenticationMode: 'HTTP Basic authentication',
      });
      component.entityForm.patchValue({authenticationMode: 'None'});
      fixture.detectChanges();

      expect(component.entityForm.get('isProxied')?.value).toBe(true);
    });

    it('preserves authentication fields for proxied services on load', () => {
      component.entityToEdit = Object.assign(component.empty(), {
        name: 'proxied-service',
        type: 'WMS',
        serviceURL: 'https://example.com/wms',
        isProxied: true,
        authenticationMode: 'HTTP Basic authentication',
        user: 'stored-user',
        password: 'stored-pass',
      });
      component.postFetchData();
      fixture.detectChanges();

      expect(component.isProxyEnabled()).toBe(true);
      expect(component.entityForm.get('authenticationMode')?.value).toBe('HTTP Basic authentication');
      expect(component.entityForm.get('user')?.value).toBe('stored-user');
      expect(component.entityForm.get('password')?.value).toBe('stored-pass');
    });

    it('forces proxy on for authenticated services on load', () => {
      component.entityToEdit = Object.assign(component.empty(), {
        name: 'authenticated-service',
        type: 'WMS',
        serviceURL: 'https://example.com/wms',
        isProxied: false,
        authenticationMode: 'HTTP Basic authentication',
        user: 'stored-user',
        password: 'stored-pass',
      });
      component.postFetchData();
      fixture.detectChanges();

      expect(component.entityForm.get('isProxied')?.value).toBe(true);
      expect(component.entityForm.get('user')?.value).toBe('stored-user');
      expect(component.entityForm.get('password')?.value).toBe('stored-pass');
    });
  });

  describe('access check', () => {
    let monitoringLabel = 'Monitorización';
    let testAccessLabel = 'Probar acceso';

    function spanishLabels(): void {
      monitoringLabel = 'Monitorización';
      testAccessLabel = 'Probar acceso';
      const translate = TestBed.inject(TranslateService);
      translate.setDefaultLang('es');
      translate.use('es');
      translate.setTranslation('es', {
        'entity.service.monitoring': 'Monitorización',
        'entity.service.button.testAccess': 'Probar acceso',
        'entity.service.access.status.up': 'Operativo',
        'entity.service.access.status.auth_failed': 'Autenticación rechazada',
        'entity.service.access.status.server_error': 'Error del servidor',
        'entity.service.access.none': 'Ninguno',
        'entity.service.access.returns': 'devuelve',
        'entity.service.accessStatus': 'Estado',
      }, true);
      fixture.detectChanges();
    }

    function englishLabels(): void {
      monitoringLabel = 'Monitoring';
      testAccessLabel = 'Test access';
      const translate = TestBed.inject(TranslateService);
      translate.setDefaultLang('en');
      translate.use('en');
      translate.setTranslation('en', {
        'entity.service.monitoring': 'Monitoring',
        'entity.service.button.testAccess': 'Test access',
        'entity.service.access.none': 'None',
        'entity.service.access.returns': 'returns',
        'entity.service.access.unknownHost': 'could not resolve the host',
      }, true);
      fixture.detectChanges();
    }

    async function probeButton(): Promise<HTMLButtonElement> {
      const tabs = Array.from(fixture.nativeElement.querySelectorAll('[role="tab"]')) as HTMLElement[];
      const monitoring = tabs.find((tab) => tab.textContent?.includes(monitoringLabel));
      expect(monitoring?.textContent).toContain(monitoringLabel);
      const group = fixture.debugElement.query(By.css('mat-tab-group'));
      group.componentInstance.selectedIndex = tabs.indexOf(monitoring!);
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 150));
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      const buttons = Array.from(fixture.nativeElement.querySelectorAll('button')) as HTMLButtonElement[];
      const button = buttons.find((candidate) => candidate.textContent?.includes(testAccessLabel));
      expect(button?.textContent ?? fixture.nativeElement.querySelector('.mat-mdc-tab-body-active')?.textContent).toContain(testAccessLabel);
      return button!;
    }

    it('posts access-check, renders Operativo, and does not save', async () => {
      spanishLabels();
      component.entityID = -1;
      component.entityForm.patchValue({blocked: true, type: 'WMS', serviceURL: 'http://127.0.0.1:9/wms'});
      fixture.detectChanges();

      const saveSpy = jest.spyOn(component, 'onSaveButtonClicked');
      const probe = await probeButton();
      expect(probe.disabled).toBe(false);
      expect(probe.type).toBe('button');
      probe.click();

      expect(saveSpy).not.toHaveBeenCalled();

      const http = TestBed.inject(HttpTestingController);
      const posted = http.match((request) => request.method === 'POST' && request.url.includes('/services/-1/access-check'));
      expect(posted).toHaveLength(1);
      expect(posted[0].request.context.get(SUPPRESS_HTTP_NOTIFICATION)).toBe(true);
      posted[0].flush({
        status: 'up',
        observer: 'backend',
        elapsedMs: 128,
        observedAt: '2026-10-05T11:30:00',
      });
      fixture.detectChanges();

      expect(fixture.nativeElement.textContent).toContain('Operativo');
      expect(fixture.nativeElement.textContent).toContain('backend');
      expect(fixture.nativeElement.textContent).toContain('128');
      expect(fixture.nativeElement.textContent).toContain('11:30');
      const cells = Array.from(fixture.nativeElement.querySelectorAll('.service-access-hour')) as HTMLElement[];
      expect(cells).toHaveLength(144);
      expect(cells[143].style.backgroundColor).toBe('rgb(46, 125, 50)');
      expect(cells.slice(0, 143).every((cell) => cell.style.backgroundColor === 'rgb(196, 196, 196)')).toBe(true);
      expect(http.match((request) => request.method === 'POST' && request.url.includes('helpers/capabilities'))).toEqual([]);
    });

    it('shows the 24 h strip as 10-minute cells before any check', async () => {
      spanishLabels();
      await probeButton();

      const cells = Array.from(fixture.nativeElement.querySelectorAll('.service-access-hour')) as HTMLElement[];
      expect(cells).toHaveLength(144);
      expect(cells.every((cell) => cell.style.backgroundColor === 'rgb(196, 196, 196)')).toBe(true);
      expect(cells.some((cell) => cell.title.includes(':10 ·'))).toBe(true);
      const http = TestBed.inject(HttpTestingController);
      expect(http.match((request) => request.method === 'POST' && request.url.includes('/access-check'))).toEqual([]);
      expect(http.match((request) => request.url.includes('/access-summaries'))).toEqual([]);
    });

    it('shows the stored latest error when an existing service opens', async () => {
      englishLabels();
      component.entityID = 7;
      component.postFetchData();
      const http = TestBed.inject(HttpTestingController);
      http.expectOne((request) => request.method === 'GET' && request.url.includes('/services/7/access-trend'))
        .flush({buckets: Array.from({length: 144}, () => null)});
      const summaries = http.expectOne((request) => request.method === 'GET' && request.url.includes('/access-summaries'));
      expect(summaries.request.url).not.toContain('/services/7/');
      summaries.flush([{
        serviceId: 7,
        status: 'client_error',
        statusRank: 40,
        observer: 'backend',
        elapsedMs: 40,
        observedAt: '2026-10-05T11:31:00',
        detail: 'GetCapabilities geoserveis.icgc.cat/icc_bt25m/wms/service | HTTP 404',
        hours: [],
      }, {
        serviceId: 9,
        status: 'up',
        statusRank: 0,
        observer: 'backend',
        elapsedMs: 1,
        observedAt: '2026-10-05T11:00:00',
        detail: '',
        hours: [],
      }]);
      fixture.detectChanges();
      await probeButton();

      const text = fixture.nativeElement.querySelector('.sitmun-service-access-panel')?.textContent ?? '';
      expect(text).toContain('client_error');
      expect(text).toContain('backend');
      expect(text).toContain('11:31');
      expect(text).toContain('40 ms');
      expect(text).toContain('GetCapabilities returns HTTP 404');
      expect(http.match((request) => request.method === 'POST' && request.url.includes('/access-check'))).toEqual([]);
    });

    it('leaves the latest error hidden when the service has no stored check', async () => {
      englishLabels();
      component.entityID = 7;
      component.postFetchData();
      const http = TestBed.inject(HttpTestingController);
      http.expectOne((request) => request.method === 'GET' && request.url.includes('/services/7/access-trend'))
        .flush({buckets: Array.from({length: 144}, () => null)});
      http.expectOne((request) => request.method === 'GET' && request.url.includes('/access-summaries')).flush([]);
      fixture.detectChanges();
      await probeButton();

      expect(fixture.nativeElement.querySelector('.sitmun-service-access')).toBeNull();
    });

    it('paints the refreshed 10-minute trend, including a proxy sample', async () => {
      spanishLabels();
      component.entityID = 7;
      component.postFetchData();
      const http = TestBed.inject(HttpTestingController);
      const buckets = Array.from({length: 144}, () => null);
      buckets[40] = {status: 'timeout', statusRank: 70, observer: 'backend'};
      buckets[41] = {status: 'server_error', statusRank: 50, observer: 'proxy'};
      const trend = http.expectOne((request) => request.method === 'GET' && request.url.includes('/services/7/access-trend'));
      expect(trend.request.params.get('bucket')).toBe('10m');
      expect(trend.request.url).not.toContain('/access-summaries');
      trend.flush({buckets});
      http.expectOne((request) => request.method === 'GET' && request.url.includes('/access-summaries')).flush([]);
      fixture.detectChanges();
      await probeButton();

      const before = Array.from(fixture.nativeElement.querySelectorAll('.service-access-hour')) as HTMLElement[];
      const beforeColors = before.map((cell) => cell.style.backgroundColor);
      expect(beforeColors).toHaveLength(144);
      expect(beforeColors[40]).toBe('rgb(198, 40, 40)');
      expect(beforeColors[41]).toBe('rgb(198, 40, 40)');
      expect(beforeColors.filter((color) => color !== 'rgb(196, 196, 196)')).toEqual([
        'rgb(198, 40, 40)',
        'rgb(198, 40, 40)',
      ]);

      (await probeButton()).click();
      const posted = http.expectOne((request) => request.method === 'POST' && request.url.includes('/access-check'));
      expect(posted.request.context.get(SUPPRESS_HTTP_NOTIFICATION)).toBe(true);
      posted.flush({
        status: 'up',
        statusRank: 0,
        observer: 'backend',
        elapsedMs: 12,
        observedAt: '2026-10-05T15:10:00',
        detail: '',
      });
      const refreshed = Array.from({length: 144}, () => null);
      refreshed[40] = {status: 'timeout', statusRank: 70};
      refreshed[143] = {status: 'up', statusRank: 0};
      http.expectOne((request) => request.method === 'GET' && request.url.includes('/services/7/access-trend')).flush({
        buckets: refreshed,
      });
      fixture.detectChanges();

      const after = Array.from(fixture.nativeElement.querySelectorAll('.service-access-hour')) as HTMLElement[];
      expect(after).toHaveLength(144);
      expect(after[40].style.backgroundColor).toBe('rgb(198, 40, 40)');
      expect(after[143].style.backgroundColor).toBe('rgb(46, 125, 50)');
      expect(fixture.nativeElement.textContent).toContain('Ninguno');
    });

    it('shows the status code when no label exists', async () => {
      spanishLabels();
      component.entityID = -1;
      (await probeButton()).click();

      const http = TestBed.inject(HttpTestingController);
      const posted = http.match((request) => request.method === 'POST' && request.url.includes('/access-check'));
      expect(posted).toHaveLength(1);
      posted[0].flush({
        status: 'maintenance',
        observer: 'backend',
        elapsedMs: 4,
        observedAt: '2026-10-05T11:30:00',
      });
      fixture.detectChanges();

      expect(fixture.nativeElement.textContent).toContain('maintenance');
    });

    async function flushAccess(body: Record<string, unknown>): Promise<string> {
      component.entityID = -1;
      (await probeButton()).click();
      const http = TestBed.inject(HttpTestingController);
      const posted = http.match((request) => request.method === 'POST' && request.url.includes('/access-check'));
      expect(posted).toHaveLength(1);
      posted[0].flush(body);
      fixture.detectChanges();
      const detail = fixture.nativeElement.querySelector('.service-access-detail-text');
      return detail?.textContent ?? '';
    }

    it.each([
      ['empty', ''],
      ['blank', '   '],
      ['null', null],
    ])('shows Ninguno when an up check detail is %s', async (_label, detail) => {
      spanishLabels();
      const latestError = await flushAccess({
        status: 'up',
        observer: 'backend',
        elapsedMs: 12,
        observedAt: '2026-10-05T11:30:00',
        detail,
      });

      expect(latestError.trim()).toBe('Ninguno');
    });

    it('keeps the shown access age when two clock reads in one check are 600ms apart', async () => {
      spanishLabels();
      TestBed.inject(TranslateService).setTranslation('es', {
        'entity.service.access.sinceStatus': 'desde las {{time}} ({{ago}})',
      }, true);
      await flushAccess({
        status: 'up',
        observer: 'backend',
        elapsedMs: 12,
        observedAt: '2026-10-05T11:30:00',
        detail: null,
      });
      const shown = fixture.nativeElement.querySelector('.access-since')?.textContent ?? '';
      const ago = shown.match(/\(([^)]+)\)/)?.[1] ?? '';
      expect(ago === 'ahora' || ago.startsWith('hace ')).toBe(true);

      const RealDate = Date;
      let accessAgoReads = 0;
      const first = Date.parse('2026-10-05T11:30:40.400Z');
      const second = first + 600;
      function Clock(this: unknown, ...args: unknown[]): Date {
        if (args.length === 0) {
          const fromAccessAgo = new Error().stack?.includes('accessAgo') ?? false;
          const time = fromAccessAgo && accessAgoReads++ > 0 ? second : first;
          return new RealDate(time);
        }
        return new RealDate(...(args as ConstructorParameters<typeof RealDate>));
      }
      Clock.prototype = RealDate.prototype;
      Clock.now = () => first;
      Clock.parse = RealDate.parse;
      Clock.UTC = RealDate.UTC;
      globalThis.Date = Clock as unknown as DateConstructor;
      try {
        expect(() => fixture.detectChanges()).not.toThrow();
        expect(fixture.nativeElement.querySelector('.access-since')?.textContent).toBe(shown);
      } finally {
        globalThis.Date = RealDate;
      }
    });

    it('shows a stored latest error as a sentence without the host', async () => {
      englishLabels();
      const latestError = await flushAccess({
        status: 'client_error',
        observer: 'backend',
        elapsedMs: 40,
        observedAt: '2026-10-05T11:31:00',
        detail: 'GetCapabilities geoserveis.icgc.cat/icc_bt25m/wms/service | HTTP 404',
      });

      expect(latestError.trim()).toBe('GetCapabilities returns HTTP 404');
      expect(latestError).not.toContain('geoserveis');
    });

    it('shows UnknownHostException as a sentence without the class or the host', async () => {
      englishLabels();
      const latestError = await flushAccess({
        status: 'unreachable',
        observer: 'backend',
        elapsedMs: 8,
        observedAt: '2026-10-05T11:32:00',
        detail: 'GetCapabilities blocked.example.com/wms | UnknownHostException blocked.example.com',
      });

      expect(latestError.trim()).toBe('GetCapabilities could not resolve the host');
      expect(latestError).not.toContain('UnknownHostException');
      expect(latestError).not.toContain('blocked.example.com');
    });

    it('shows None when an up check detail is empty', async () => {
      englishLabels();
      const latestError = await flushAccess({
        status: 'up',
        observer: 'backend',
        elapsedMs: 12,
        observedAt: '2026-10-05T11:30:00',
        detail: '',
      });

      expect(latestError.trim()).toBe('None');
    });

    it('shows the request alone when a stored detail has no evidence', async () => {
      englishLabels();
      const latestError = await flushAccess({
        status: 'client_error',
        observer: 'backend',
        elapsedMs: 40,
        observedAt: '2026-10-05T11:31:00',
        detail: 'GetCapabilities geoserveis.icgc.cat/icc_bt25m/wms/service | ',
      });

      expect(latestError.trim()).toBe('GetCapabilities');
      expect(latestError).not.toContain('returns');
      expect(latestError).not.toContain('geoserveis');
    });

    it('shows the evidence alone when a stored detail has no request', async () => {
      englishLabels();
      const latestError = await flushAccess({
        status: 'client_error',
        observer: 'backend',
        elapsedMs: 40,
        observedAt: '2026-10-05T11:31:00',
        detail: ' | HTTP 404',
      });

      expect(latestError.trim()).toBe('HTTP 404');
    });
  });

  describe('usage lists', () => {
    it('lists every application and drops only ViewerConfig from operations', () => {
      const applications = Array.from({length: 11}, (_, index) => ({
        applicationId: index + 1,
        name: `App ${index + 1}`,
        requests: 100 - index,
        failed: 0,
        viewerLoads: 0,
      }));
      component.usage = {
        measured: true,
        viewerLoads: 3,
        operations: [
          {operation: 'ViewerConfig', requests: 3, failed: 0},
          {operation: 'GetMap', requests: 8, failed: 1},
          {operation: 'GetLegendGraphic', requests: 2, failed: 0},
        ],
        applications,
      };

      expect(component.usageApplications().map((row) => row.applicationId)).toEqual(
        applications.map((row) => row.applicationId),
      );
      expect(component.usageOperations().map((row) => row.operation)).toEqual([
        'GetMap',
        'GetLegendGraphic',
      ]);
    });

    it('stacks successful and failed requests so each day sums to its total', () => {
      component.usage = {
        measured: true,
        viewerLoads: 0,
        series: [
          {index: '2026-10-05', value: 0, failed: 0},
          {index: '2026-10-06', value: 129, failed: 31},
        ],
      };

      const [successful, failed] = component.usageChartSeries();

      expect(successful.name).toBe('entity.service.usage.successful');
      expect(failed.name).toBe('entity.service.usage.failed');
      expect(successful.data.map((point) => point.value)).toEqual([0, 98]);
      expect(failed.data.map((point) => point.value)).toEqual([0, 31]);
      expect(component.usageChartTotalLabel()).toBe('entity.service.usage.requests');
    });

    it('keeps the same chart series between change detections so the bars can finish animating', () => {
      component.usage = {measured: true, viewerLoads: 0, series: [{index: '2026-10', value: 129, failed: 31}]};
      const first = component.usageChartSeries();

      expect(component.usageChartSeries()).toBe(first);

      component.usage = {measured: true, viewerLoads: 0, series: [{index: '2026-10-06', value: 129, failed: 31}]};

      expect(component.usageChartSeries()).not.toBe(first);
    });

    it('labels monthly buckets per month for the 12 month range', () => {
      component.usageRange = '90d';
      expect(component.usageChartTitleKey()).toBe('entity.service.usage.perDay');
      expect(component.usageChartPeriod()).toBe('day');
      expect(component.usageSlotsKey()).toBe('entity.service.usage.daysWithUse');

      component.usageRange = '12m';
      expect(component.usageChartTitleKey()).toBe('entity.service.usage.perMonth');
      expect(component.usageChartPeriod()).toBe('month');
      expect(component.usageSlotsKey()).toBe('entity.service.usage.monthsWithUse');
    });

    it('formats chart days in the interface language', () => {
      TestBed.inject(TranslateService).use('fr');

      expect(component.usageChartLocale()).toBe('fr');
    });
  });

  describe('latency chart', () => {
    const sample = {
      observedAt: '2026-10-06T10:00:00',
      elapsedMs: 40,
      status: 'up',
      statusRank: 0,
      observer: 'backend',
    };

    it('keeps the same latency series until samples or the limit change', () => {
      component.accessSamples = [sample];
      component.sampleTimeoutMs = 10000;
      const first = component.latencySeries();

      expect(component.latencySeries()).toBe(first);
      expect(component.latencyReference()).toBe(component.latencyReference());
      expect(component.latencyReference()?.value).toBe(10000);

      component.sampleTimeoutMs = 8000;
      const afterLimit = component.latencySeries();
      expect(afterLimit).not.toBe(first);

      component.accessSamples = [{...sample, elapsedMs: 90}];
      expect(component.latencySeries()).not.toBe(afterLimit);
    });

    function englishTimeoutLabels(): void {
      const translate = TestBed.inject(TranslateService);
      translate.setDefaultLang('en');
      translate.use('en');
      translate.setTranslation('en', {
        'entity.service.access.observer.backend': 'Backend',
        'entity.service.access.observer.proxy': 'Proxy',
        'entity.service.access.status.timeout': 'Timeout',
        'entity.service.access.status.up': 'Up',
        'entity.service.access.timedOut': 'timed out',
        'entity.service.access.timedOutAfter': 'Timed out after {{seconds}} s',
        'entity.service.access.lastCheck': 'Last check {{time}} · {{observer}} · {{elapsed}} ms',
        'entity.service.access.lastCheckTimeout': 'Last check {{time}} · {{observer}} · timed out at {{seconds}} s',
        'entity.service.access.timedOutAt': 'Timed out · {{time}} · {{observer}}',
        'entity.service.access.timedOutCount': '{{count}} checks timed out',
        'entity.service.access.timedOutOne': '1 check timed out',
      }, true);
    }

    const timeoutObservation = {
      status: 'timeout',
      statusRank: 70,
      observer: 'backend',
      elapsedMs: 10008,
      observedAt: '2026-10-07T00:07:00',
      detail: 'GetCapabilities host.example/wms | SocketTimeoutException Read timed out',
    };

    it('says the check timed out after the limit instead of the elapsed time', () => {
      englishTimeoutLabels();
      component.accessObservation = timeoutObservation;
      component.sampleTimeoutMs = 10000;
      const facts = component.monitoring()!;

      expect(component.accessVerdictText(facts)).toBe('Timed out after 10 s');
      expect(component.lastCheckText(facts)).toContain('Backend · timed out at 10 s');
      expect(component.lastCheckText(facts)).not.toContain('10008');

      component.accessObservation = {...timeoutObservation, status: 'up', elapsedMs: 717};
      const up = component.monitoring()!;
      expect(component.accessVerdictText(up)).toBe('Up');
      expect(component.lastCheckText(up)).toContain('Backend · 717 ms');
    });

    it('breaks the latency line at timeouts and marks them on the limit', () => {
      englishTimeoutLabels();
      component.accessObservation = timeoutObservation;
      component.sampleTimeoutMs = 10000;
      component.accessSamples = [
        {...sample, observedAt: '2026-10-06T10:00:00', elapsedMs: 700},
        {...sample, observedAt: '2026-10-06T10:10:00', elapsedMs: 10008, status: 'timeout', statusRank: 70},
        {...sample, observedAt: '2026-10-06T10:20:00', elapsedMs: 730},
      ];

      const [line, markers] = component.latencySeries();

      expect(line.kind).toBe('line');
      expect(line.data.map((point) => point.value)).toEqual([700, null, 730]);
      expect(markers.kind).toBe('scatter');
      expect(markers.color).toBe('#c62828');
      expect(markers.data).toEqual([
        {index: '2026-10-06T10:10:00', value: 10000, note: 'Timed out · 10:10 · Backend'},
      ]);
      expect(component.monitoring()?.p50).toBe(715);
      expect(component.timedOutText(component.monitoring()!)).toBe('1 check timed out');
    });

    it('names the check and the observer on each recent change', () => {
      englishTimeoutLabels();
      component.accessObservation = timeoutObservation;
      const hours: Array<ServiceAccessHour | null> = Array.from({length: 144}, () => null);
      hours[140] = {status: 'up', statusRank: 0, observers: ['backend']};
      hours[141] = {status: 'timeout', statusRank: 70, observers: ['proxy']};
      hours[142] = {status: 'up', statusRank: 0, observers: ['backend']};
      hours[143] = {status: 'timeout', statusRank: 70, observers: ['backend']};
      component.accessHours = hours;

      const rows = component.recentChanges();

      expect(rows.map((row) => row.what)).toEqual([
        'GetCapabilities timed out · Backend',
        'Backend',
        'Proxy',
      ]);
      expect(rows[0].failed).toBe(true);
      expect(component.loneDetail()).toBe(false);
    });
  });
});

