import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { FormToolbarComponent } from '@app/components/shared/form-toolbar/form-toolbar.component';
import { ExternalConfigurationService } from '@app/core/config/external-configuration.service';
import { ExternalService, ResourceService } from '@app/core/hal';
import {
  CodeListService,
  ConfigurationParameter,
  ConfigurationParametersService,
  TranslationService,
} from '@app/domain';
import { SitmunFrontendGuiModule } from '@app/frontend-gui/src/lib/public_api';
import { MaterialModule } from '@app/material-module';
import { LoggerService } from '@app/services/logger.service';
import { configureLoggerForTests, provideErrorHandlerForTests } from '@app/testing/test-helpers';

import { ConfigurationParameterFormComponent } from './configuration-parameter-form.component';

describe('ConfigurationParameterFormComponent', () => {
  let component: ConfigurationParameterFormComponent;
  let fixture: ComponentFixture<ConfigurationParameterFormComponent>;
  let configurationParametersService: ConfigurationParametersService;

  beforeAll(async () => {
    await TestBed.configureTestingModule({
      teardown: { destroyAfterEach: 0 as any },
      declarations: [ConfigurationParameterFormComponent, FormToolbarComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forRoot([], {}),
        SitmunFrontendGuiModule,
        MaterialModule,
        RouterModule,
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
        provideHttpClient(),
        provideHttpClientTesting(),
        provideErrorHandlerForTests(),
        ConfigurationParametersService,
        CodeListService,
        TranslationService,
        ResourceService,
        ExternalService,
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationParameterFormComponent);
    component = fixture.componentInstance;
    configureLoggerForTests(TestBed.inject(LoggerService));
    configurationParametersService = TestBed.inject(ConfigurationParametersService);
    component.entityToEdit = component.empty();
    component.postFetchData();
    fixture.detectChanges();
  });

  afterEach(() => fixture?.destroy());
  afterAll(() => TestBed.resetTestingModule());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('keeps save-time warning keys and patches coerced value from create response', async () => {
    const created = Object.assign(new ConfigurationParameter(), {
      id: 42,
      name: 'proxy',
      value: 'https://cdn.example.com/middleware',
      warnings: ['entity.configurationParameter.warning.proxy-normalized'],
    });
    jest.spyOn(configurationParametersService, 'create').mockReturnValue(of(created));

    component.entityForm.patchValue({
      name: 'proxy',
      value: 'https://cdn.example.com:443/middleware/',
    });

    await component.createEntity();

    expect(component.saveInfoKeys).toEqual([
      'entity.configurationParameter.warning.proxy-normalized',
    ]);
    expect(component.entityForm.get('value')?.value).toBe('https://cdn.example.com/middleware');
  });

  it('keeps save-time warning keys and patches coerced value from update response', async () => {
    const updated = Object.assign(new ConfigurationParameter(), {
      id: 6,
      name: 'proxy',
      value: 'http://localhost:8080/middleware',
      warnings: ['entity.configurationParameter.warning.proxy-defaulted'],
    });
    jest.spyOn(configurationParametersService, 'update').mockReturnValue(of(updated));
    component.entityID = 6;
    component.entityForm.patchValue({ name: 'proxy', value: '' });

    await component.updateEntity();

    expect(component.saveInfoKeys).toEqual([
      'entity.configurationParameter.warning.proxy-defaulted',
    ]);
    expect(component.entityForm.get('value')?.value).toBe('http://localhost:8080/middleware');
  });

  it('syncs form from entityToEdit on afterSave so re-fetch keeps the stored value', () => {
    component.entityForm.patchValue({ name: 'proxy', value: 'https://cdn.example.com:443/middleware/' });
    component.entityToEdit = Object.assign(new ConfigurationParameter(), {
      id: 6,
      name: 'proxy',
      value: 'https://cdn.example.com/middleware',
    });
    component.saveInfoKeys = ['entity.configurationParameter.warning.proxy-normalized'];

    component.afterSave();

    expect(component.entityForm.get('value')?.value).toBe('https://cdn.example.com/middleware');
    expect(component.saveInfoKeys).toEqual([
      'entity.configurationParameter.warning.proxy-normalized',
    ]);
  });

  it('clears save info keys after the next form edit', () => {
    component.saveInfoKeys = ['entity.configurationParameter.warning.proxy-normalized'];
    component.afterSave();
    component.entityForm.patchValue({ value: 'https://other.example.com/middleware' });
    expect(component.saveInfoKeys).toEqual([]);
  });
});
