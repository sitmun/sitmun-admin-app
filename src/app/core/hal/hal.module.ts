import {ModuleWithProviders, NgModule} from '@angular/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
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
export {ExternalConfiguration, ExternalConfigurationHandlerInterface} from './config/external-configuration-handler.interface';

/** HAL module */
@NgModule({
    imports: [HttpClientModule],
    declarations: [],
    exports: [HttpClientModule],
    providers: [
        ExternalService,
        HttpClient,
        {
            provide: ResourceService,
            useClass: ResourceService,
            deps: [ExternalService]
        }
    ]
})
export class HalModule {
    static forRoot(): ModuleWithProviders<HalModule> {
        return {
            ngModule: HalModule,
            providers: [
                ExternalService,
                HttpClient,
                {
                    provide: ResourceService,
                    useClass: ResourceService,
                    deps: [ExternalService]
                }
            ]
        };
    }
} 