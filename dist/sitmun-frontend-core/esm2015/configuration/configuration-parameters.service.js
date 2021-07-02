/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Injectable, Injector } from '@angular/core';
import { ConfigurationParameter } from './configuration-parameters.model';
import { HttpClient } from '@angular/common/http';
import { RestService } from '../angular-hal/src/lib/rest.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class ConfigurationParametersService extends RestService {
    /**
     * constructor
     * @param {?} injector
     * @param {?} http
     */
    constructor(injector, http) {
        super(ConfigurationParameter, "configuration-parameters", injector);
        this.http = http;
        /**
         * API resource path
         */
        this.CONFIGURATION_PARAMETERS_API = 'configuration-parameters';
    }
}
ConfigurationParametersService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] },
];
/** @nocollapse */
ConfigurationParametersService.ctorParameters = () => [
    { type: Injector },
    { type: HttpClient }
];
/** @nocollapse */ ConfigurationParametersService.ngInjectableDef = i0.defineInjectable({ factory: function ConfigurationParametersService_Factory() { return new ConfigurationParametersService(i0.inject(i0.INJECTOR), i0.inject(i1.HttpClient)); }, token: ConfigurationParametersService, providedIn: "root" });
if (false) {
    /**
     * API resource path
     * @type {?}
     */
    ConfigurationParametersService.prototype.CONFIGURATION_PARAMETERS_API;
    /** @type {?} */
    ConfigurationParametersService.prototype.http;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlndXJhdGlvbi1wYXJhbWV0ZXJzLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvIiwic291cmNlcyI6WyJjb25maWd1cmF0aW9uL2NvbmZpZ3VyYXRpb24tcGFyYW1ldGVycy5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNyRCxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUMxRSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDbEQsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLHFDQUFxQyxDQUFDOzs7QUFLaEUsTUFBTSxxQ0FBc0MsU0FBUSxXQUFtQzs7Ozs7O0lBTXJGLFlBQVksUUFBa0IsRUFBUyxJQUFnQjtRQUNyRCxLQUFLLENBQUMsc0JBQXNCLEVBQUUsMEJBQTBCLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFEL0IsU0FBSSxHQUFKLElBQUksQ0FBWTs7Ozs0Q0FIakIsMEJBQTBCO0tBSy9EOzs7WUFYRixVQUFVLFNBQUM7Z0JBQ1YsVUFBVSxFQUFFLE1BQU07YUFDbkI7Ozs7WUFQb0IsUUFBUTtZQUVwQixVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQ29uZmlndXJhdGlvblBhcmFtZXRlciB9IGZyb20gJy4vY29uZmlndXJhdGlvbi1wYXJhbWV0ZXJzLm1vZGVsJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5cclxuQEluamVjdGFibGUoe1xyXG4gIHByb3ZpZGVkSW46ICdyb290J1xyXG59KVxyXG5leHBvcnQgY2xhc3MgQ29uZmlndXJhdGlvblBhcmFtZXRlcnNTZXJ2aWNlIGV4dGVuZHMgUmVzdFNlcnZpY2U8Q29uZmlndXJhdGlvblBhcmFtZXRlcj4ge1xyXG5cclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgQ09ORklHVVJBVElPTl9QQVJBTUVURVJTX0FQSSA9ICdjb25maWd1cmF0aW9uLXBhcmFtZXRlcnMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihDb25maWd1cmF0aW9uUGFyYW1ldGVyLCBcImNvbmZpZ3VyYXRpb24tcGFyYW1ldGVyc1wiLCBpbmplY3Rvcik7XHJcbiAgfVxyXG4gIFxyXG4gIFxyXG59XHJcbiJdfQ==