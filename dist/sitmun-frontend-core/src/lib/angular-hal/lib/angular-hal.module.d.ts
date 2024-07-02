import { ModuleWithProviders } from '@angular/core';
import 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export { ExternalService } from './external.service';
export { RestService } from './rest.service';
export { Resource } from './resource';
export { ResourceArray } from './resource-array';
export { ResourceService } from './resource.service';
export { Sort } from './sort';
export { ResourceHelper } from './resource-helper';
export { ExternalConfiguration } from './ExternalConfiguration';
export { ExternalConfigurationHandlerInterface } from './external-configuration.handler';
export { HalOptions, HalParam } from './rest.service';
export { SubTypeBuilder } from './subtype-builder';
/** Angular HAL module */
export declare class AngularHalModule {
    static forRoot(): ModuleWithProviders<AngularHalModule>;
    static ɵmod: i0.ɵɵNgModuleDefWithMeta<AngularHalModule, never, [typeof i1.HttpClientModule], [typeof i1.HttpClientModule]>;
    static ɵinj: i0.ɵɵInjectorDef<AngularHalModule>;
}
