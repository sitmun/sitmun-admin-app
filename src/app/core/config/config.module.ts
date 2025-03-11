import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ExternalConfigurationService } from './external-configuration.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    ExternalConfigurationService,
    { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService }
  ]
})
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