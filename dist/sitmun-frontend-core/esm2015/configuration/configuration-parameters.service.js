import { Injectable, Injector } from '@angular/core';
import { ConfigurationParameter } from './configuration-parameters.model';
import { HttpClient } from '@angular/common/http';
import { RestService } from '../angular-hal/src/lib/rest.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class ConfigurationParametersService extends RestService {
    /** constructor */
    constructor(injector, http) {
        super(ConfigurationParameter, "configuration-parameters", injector);
        this.http = http;
        /** API resource path */
        this.CONFIGURATION_PARAMETERS_API = 'configuration-parameters';
    }
}
ConfigurationParametersService.ɵfac = function ConfigurationParametersService_Factory(t) { return new (t || ConfigurationParametersService)(i0.ɵɵinject(i0.Injector), i0.ɵɵinject(i1.HttpClient)); };
ConfigurationParametersService.ɵprov = i0.ɵɵdefineInjectable({ token: ConfigurationParametersService, factory: ConfigurationParametersService.ɵfac, providedIn: 'root' });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(ConfigurationParametersService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], function () { return [{ type: i0.Injector }, { type: i1.HttpClient }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlndXJhdGlvbi1wYXJhbWV0ZXJzLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiQzovVXNlcnMvYWNvcm9taW5hcy9EZXNrdG9wL05leHVzL1NpdG11bjMvc2l0bXVuLWZyb250ZW5kLWNvcmUvcHJvamVjdHMvc2l0bXVuLWZyb250ZW5kLWNvcmUvc3JjL2xpYi8iLCJzb3VyY2VzIjpbImNvbmZpZ3VyYXRpb24vY29uZmlndXJhdGlvbi1wYXJhbWV0ZXJzLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDckQsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFDMUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ2xELE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxxQ0FBcUMsQ0FBQzs7O0FBS2hFLE1BQU0sT0FBTyw4QkFBK0IsU0FBUSxXQUFtQztJQUtyRixrQkFBa0I7SUFDbEIsWUFBWSxRQUFrQixFQUFTLElBQWdCO1FBQ3JELEtBQUssQ0FBQyxzQkFBc0IsRUFBRSwwQkFBMEIsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUQvQixTQUFJLEdBQUosSUFBSSxDQUFZO1FBSnZELHdCQUF3QjtRQUNqQixpQ0FBNEIsR0FBRywwQkFBMEIsQ0FBQztJQUtqRSxDQUFDOzs0R0FSVSw4QkFBOEI7c0VBQTlCLDhCQUE4QixXQUE5Qiw4QkFBOEIsbUJBRjdCLE1BQU07a0RBRVAsOEJBQThCO2NBSDFDLFVBQVU7ZUFBQztnQkFDVixVQUFVLEVBQUUsTUFBTTthQUNuQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IENvbmZpZ3VyYXRpb25QYXJhbWV0ZXIgfSBmcm9tICcuL2NvbmZpZ3VyYXRpb24tcGFyYW1ldGVycy5tb2RlbCc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuXHJcbkBJbmplY3RhYmxlKHtcclxuICBwcm92aWRlZEluOiAncm9vdCdcclxufSlcclxuZXhwb3J0IGNsYXNzIENvbmZpZ3VyYXRpb25QYXJhbWV0ZXJzU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPENvbmZpZ3VyYXRpb25QYXJhbWV0ZXI+IHtcclxuXHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIENPTkZJR1VSQVRJT05fUEFSQU1FVEVSU19BUEkgPSAnY29uZmlndXJhdGlvbi1wYXJhbWV0ZXJzJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoQ29uZmlndXJhdGlvblBhcmFtZXRlciwgXCJjb25maWd1cmF0aW9uLXBhcmFtZXRlcnNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICBcclxufVxyXG4iXX0=