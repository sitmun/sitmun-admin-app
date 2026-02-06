import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import {ModuleWithProviders, NgModule} from '@angular/core';

import {ExternalConfigurationService} from './external-configuration.service';

@NgModule({ imports: [CommonModule], providers: [
        ExternalConfigurationService,
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService },
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class ConfigModule {
  static forRoot(): ModuleWithProviders<ConfigModule> {
    return {
      ngModule: ConfigModule,
      providers: [
        ExternalConfigurationService,
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService }
      ]
    };
  }
}
