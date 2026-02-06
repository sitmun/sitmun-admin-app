import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import {ModuleWithProviders, NgModule} from '@angular/core';

import {ExternalService} from './config/external.service';
import {ResourceService} from './resource/resource.service';

import 'rxjs';

// Export all the public API
export {ExternalService} from './config/external.service';
export {RestService} from './rest/rest.service';
export {Resource} from './resource/resource.model';
export {ResourceArray} from './resource/resource-array.model';
export {ResourceService} from './resource/resource.service';
export {Sort} from './rest/sort.model';
export {ResourceHelper} from './resource/resource-helper';
export {HalOptions, HalParam} from './rest/rest.service';
export {SubTypeBuilder} from './common/subtype-builder';
export {ExternalConfigurationHandlerInterface} from './config/external-configuration-handler.interface';

/** HAL module */
@NgModule({
  declarations: [],
  imports: [],
  exports: [],
  providers: [
    ExternalService,
    {
      provide: ResourceService,
      useClass: ResourceService,
      deps: [ExternalService]
    },
    provideHttpClient(withInterceptorsFromDi())
  ]
})
export class HalModule {
    static forRoot(): ModuleWithProviders<HalModule> {
        return {
            ngModule: HalModule,
            providers: [
                ExternalService,
                {
                    provide: ResourceService,
                    useClass: ResourceService,
                    deps: [ExternalService]
                }
            ]
        };
    }
}
