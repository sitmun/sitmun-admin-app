import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RestService } from '../angular-hal/src/lib/rest.service';
import { Info } from './info.model';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class GetInfoService extends RestService {
    /** constructor */
    constructor(injector, http) {
        super(Info, "helpers/feature-type?url=", injector);
        this.http = http;
        /** API resource path */
        this.INFO_API = 'helpers/feature-type?url=';
    }
    /** save service*/
    getInfo(url) {
        let result;
        if (url) {
            const headerDict = {
                'Charset': 'UTF-8'
            };
            const requestOptions = {
                headers: new HttpHeaders(headerDict),
            };
            let finalUrl = this.resourceService.getResourceUrl(this.INFO_API);
            finalUrl = finalUrl.concat(url);
            console.log(finalUrl);
            result = this.http.get(finalUrl, requestOptions);
        }
        return result;
    }
}
GetInfoService.ɵfac = function GetInfoService_Factory(t) { return new (t || GetInfoService)(i0.ɵɵinject(i0.Injector), i0.ɵɵinject(i1.HttpClient)); };
GetInfoService.ɵprov = i0.ɵɵdefineInjectable({ token: GetInfoService, factory: GetInfoService.ɵfac, providedIn: 'root' });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(GetInfoService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], function () { return [{ type: i0.Injector }, { type: i1.HttpClient }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0SW5mby5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IkM6L1VzZXJzL2Fjb3JvbWluYXMvRGVza3RvcC9OZXh1cy9TaXRtdW4zL3NpdG11bi1mcm9udGVuZC1jb3JlL3Byb2plY3RzL3NpdG11bi1mcm9udGVuZC1jb3JlL3NyYy9saWIvIiwic291cmNlcyI6WyJnZXRJbmZvL2dldEluZm8uc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNyRCxPQUFPLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBRS9ELE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxxQ0FBcUMsQ0FBQztBQUNoRSxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sY0FBYyxDQUFDOzs7QUFNcEMsTUFBTSxPQUFPLGNBQWUsU0FBUSxXQUFpQjtJQUtuRCxrQkFBa0I7SUFDbEIsWUFBWSxRQUFrQixFQUFTLElBQWdCO1FBQ3JELEtBQUssQ0FBQyxJQUFJLEVBQUUsMkJBQTJCLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFEZCxTQUFJLEdBQUosSUFBSSxDQUFZO1FBSnZELHdCQUF3QjtRQUNqQixhQUFRLEdBQUcsMkJBQTJCLENBQUM7SUFLOUMsQ0FBQztJQUVDLGtCQUFrQjtJQUNsQixPQUFPLENBQUMsR0FBVztRQUNqQixJQUFJLE1BQTBCLENBQUM7UUFDL0IsSUFBRyxHQUFHLEVBQUM7WUFDTCxNQUFNLFVBQVUsR0FBRztnQkFDakIsU0FBUyxFQUFFLE9BQU87YUFDbkIsQ0FBQTtZQUVELE1BQU0sY0FBYyxHQUFHO2dCQUNyQixPQUFPLEVBQUUsSUFBSSxXQUFXLENBQUMsVUFBVSxDQUFDO2FBQ3JDLENBQUM7WUFDRixJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDbEUsUUFBUSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDaEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN0QixNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLGNBQWMsQ0FBQyxDQUFDO1NBQ2xEO1FBQ0QsT0FBTyxNQUFNLENBQUM7SUFFaEIsQ0FBQzs7NEVBNUJRLGNBQWM7c0RBQWQsY0FBYyxXQUFkLGNBQWMsbUJBRmIsTUFBTTtrREFFUCxjQUFjO2NBSDFCLFVBQVU7ZUFBQztnQkFDVixVQUFVLEVBQUUsTUFBTTthQUNuQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQsIEh0dHBIZWFkZXJzIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgSW5mbyB9IGZyb20gJy4vaW5mby5tb2RlbCc7XHJcblxyXG5cclxuQEluamVjdGFibGUoe1xyXG4gIHByb3ZpZGVkSW46ICdyb290J1xyXG59KVxyXG5leHBvcnQgY2xhc3MgR2V0SW5mb1NlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxJbmZvPiAge1xyXG5cclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgSU5GT19BUEkgPSAnaGVscGVycy9mZWF0dXJlLXR5cGU/dXJsPSc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKEluZm8sIFwiaGVscGVycy9mZWF0dXJlLXR5cGU/dXJsPVwiLCBpbmplY3Rvcik7XHJcbiAgfVxyXG5cclxuICAgIC8qKiBzYXZlIHNlcnZpY2UqL1xyXG4gICAgZ2V0SW5mbyh1cmw6IHN0cmluZyk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgICAgaWYodXJsKXtcclxuICAgICAgICBjb25zdCBoZWFkZXJEaWN0ID0ge1xyXG4gICAgICAgICAgJ0NoYXJzZXQnOiAnVVRGLTgnXHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IHJlcXVlc3RPcHRpb25zID0geyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgaGVhZGVyczogbmV3IEh0dHBIZWFkZXJzKGhlYWRlckRpY3QpLCBcclxuICAgICAgICB9O1xyXG4gICAgICAgIGxldCBmaW5hbFVybCA9IHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuSU5GT19BUEkpO1xyXG4gICAgICAgIGZpbmFsVXJsID0gZmluYWxVcmwuY29uY2F0KHVybCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coZmluYWxVcmwpO1xyXG4gICAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5nZXQoZmluYWxVcmwsIHJlcXVlc3RPcHRpb25zKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gcmVzdWx0O1xyXG4gXHJcbiAgICB9XHJcbiAgXHJcbn0iXX0=