import { RestService } from '../angular-hal/src/lib/rest.service';
import { UserConfiguration } from './user-configuration.model';
import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
/** User configuration manager service */
export class UserConfigurationService extends RestService {
    /** constructor */
    constructor(injector, http) {
        super(UserConfiguration, "user-configurations", injector);
        this.http = http;
        /** API resource path */
        this.USER_CONFIGURATION_API = 'user-configurations';
    }
    /** remove user configuration*/
    remove(item) {
        return this.http.delete(item._links.self.href);
    }
    /** save user configuration*/
    save(item) {
        let result;
        if (item._links != null) {
            result = this.http.put(item._links.self.href, item);
        }
        else {
            item.territory = item.territory._links.self.href;
            item.role = item.role != null ? item.role._links.self.href : null;
            item.user = item.user._links.self.href;
            item.roleChildren = item.roleChildren != null ? item.roleChildren._links.self.href : null;
            result = this.http.post(this.resourceService.getResourceUrl(this.USER_CONFIGURATION_API), item);
        }
        return result;
    }
}
UserConfigurationService.ɵfac = function UserConfigurationService_Factory(t) { return new (t || UserConfigurationService)(i0.ɵɵinject(i0.Injector), i0.ɵɵinject(i1.HttpClient)); };
UserConfigurationService.ɵprov = i0.ɵɵdefineInjectable({ token: UserConfigurationService, factory: UserConfigurationService.ɵfac });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(UserConfigurationService, [{
        type: Injectable
    }], function () { return [{ type: i0.Injector }, { type: i1.HttpClient }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci1jb25maWd1cmF0aW9uLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiQzovVXNlcnMvYWNvcm9taW5hcy9EZXNrdG9wL05leHVzL1NpdG11bjMvc2l0bXVuLWZyb250ZW5kLWNvcmUvcHJvamVjdHMvc2l0bXVuLWZyb250ZW5kLWNvcmUvc3JjL2xpYi8iLCJzb3VyY2VzIjpbInVzZXIvdXNlci1jb25maWd1cmF0aW9uLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLHFDQUFxQyxDQUFDO0FBQ2xFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQy9ELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUNsRCxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7O0FBR3JELHlDQUF5QztBQUV6QyxNQUFNLE9BQU8sd0JBQXlCLFNBQVEsV0FBOEI7SUFLMUUsa0JBQWtCO0lBQ2xCLFlBQVksUUFBa0IsRUFBVSxJQUFnQjtRQUN0RCxLQUFLLENBQUMsaUJBQWlCLEVBQUUscUJBQXFCLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFEcEIsU0FBSSxHQUFKLElBQUksQ0FBWTtRQUp4RCx3QkFBd0I7UUFDakIsMkJBQXNCLEdBQUcscUJBQXFCLENBQUM7SUFLdEQsQ0FBQztJQUVELCtCQUErQjtJQUMvQixNQUFNLENBQUMsSUFBdUI7UUFDNUIsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUVqRCxDQUFDO0lBRUQsNkJBQTZCO0lBQzdCLElBQUksQ0FBQyxJQUFTO1FBQ1osSUFBSSxNQUEwQixDQUFDO1FBQy9CLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLEVBQUU7WUFDdkIsTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztTQUNyRDthQUFNO1lBQ0wsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ2pELElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksSUFBRSxJQUFJLENBQUEsQ0FBQyxDQUFBLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUEsQ0FBQyxDQUFBLElBQUksQ0FBQztZQUM1RCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDdkMsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsWUFBWSxJQUFFLElBQUksQ0FBQSxDQUFDLENBQUEsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQSxDQUFDLENBQUEsSUFBSSxDQUFDO1lBQ3BGLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztTQUNqRztRQUNELE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUM7O2dHQTdCVSx3QkFBd0I7Z0VBQXhCLHdCQUF3QixXQUF4Qix3QkFBd0I7a0RBQXhCLHdCQUF3QjtjQURwQyxVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUmVzdFNlcnZpY2UgfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcbmltcG9ydCB7IFVzZXJDb25maWd1cmF0aW9uIH0gZnJvbSAnLi91c2VyLWNvbmZpZ3VyYXRpb24ubW9kZWwnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcblxyXG4vKiogVXNlciBjb25maWd1cmF0aW9uIG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBVc2VyQ29uZmlndXJhdGlvblNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxVc2VyQ29uZmlndXJhdGlvbj4ge1xyXG5cclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgVVNFUl9DT05GSUdVUkFUSU9OX0FQSSA9ICd1c2VyLWNvbmZpZ3VyYXRpb25zJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLCBwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKFVzZXJDb25maWd1cmF0aW9uLCBcInVzZXItY29uZmlndXJhdGlvbnNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuXHJcbiAgLyoqIHJlbW92ZSB1c2VyIGNvbmZpZ3VyYXRpb24qL1xyXG4gIHJlbW92ZShpdGVtOiBVc2VyQ29uZmlndXJhdGlvbikge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuXHJcbiAgfVxyXG5cclxuICAvKiogc2F2ZSB1c2VyIGNvbmZpZ3VyYXRpb24qL1xyXG4gIHNhdmUoaXRlbTogYW55KTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgIGlmIChpdGVtLl9saW5rcyAhPSBudWxsKSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGl0ZW0udGVycml0b3J5ID0gaXRlbS50ZXJyaXRvcnkuX2xpbmtzLnNlbGYuaHJlZjtcclxuICAgICAgaXRlbS5yb2xlID0gaXRlbS5yb2xlIT1udWxsP2l0ZW0ucm9sZS5fbGlua3Muc2VsZi5ocmVmOm51bGw7XHJcbiAgICAgIGl0ZW0udXNlciA9IGl0ZW0udXNlci5fbGlua3Muc2VsZi5ocmVmO1xyXG4gICAgICBpdGVtLnJvbGVDaGlsZHJlbiA9IGl0ZW0ucm9sZUNoaWxkcmVuIT1udWxsP2l0ZW0ucm9sZUNoaWxkcmVuLl9saW5rcy5zZWxmLmhyZWY6bnVsbDtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5VU0VSX0NPTkZJR1VSQVRJT05fQVBJKSwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuXHJcbn1cclxuIl19