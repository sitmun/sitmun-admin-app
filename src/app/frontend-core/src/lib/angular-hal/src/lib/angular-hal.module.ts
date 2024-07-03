import {ModuleWithProviders, NgModule} from '@angular/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {HalParam, RestService} from './rest.service';
import {ExternalService} from './external.service';
import {ResourceService} from './resource.service';
import {ExternalConfigurationHandlerInterface} from './external-configuration.handler';

import 'rxjs';

import {SubTypeBuilder} from './subtype-builder';

export {ExternalService} from './external.service';
export {RestService} from './rest.service';
export {Resource} from './resource';
export {ResourceArray} from './resource-array';
export {ResourceService} from './resource.service';
export {Sort} from './sort';
export {ResourceHelper} from './resource-helper';
export {ExternalConfiguration} from './ExternalConfiguration';
export {ExternalConfigurationHandlerInterface} from './external-configuration.handler';
export {HalOptions, HalParam} from './rest.service';
export {SubTypeBuilder} from './subtype-builder';


/** Angular HAL module */
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
        }]
})
export class AngularHalModule {
    static forRoot(): ModuleWithProviders<AngularHalModule> {
        return {
            ngModule: AngularHalModule,
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