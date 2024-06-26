/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Inject, Injectable } from '@angular/core';
import { ResourceHelper } from './resource-helper';
/**
 * ExternalService
 */
var ExternalService = /** @class */ (function () {
    /** constructor */
    function ExternalService(externalConfigurationService) {
        this.externalConfigurationService = externalConfigurationService;
        ResourceHelper.setProxyUri(externalConfigurationService.getProxyUri());
        ResourceHelper.setRootUri(externalConfigurationService.getRootUri());
        ResourceHelper.setHttp(externalConfigurationService.getHttp());
    }
    /** update ExternalConfigurationHandler */
    /**
     * update ExternalConfigurationHandler
     * @param {?} externalConfigurationService
     * @return {?}
     */
    ExternalService.prototype.updateExternalConfigurationHandlerInterface = /**
     * update ExternalConfigurationHandler
     * @param {?} externalConfigurationService
     * @return {?}
     */
    function (externalConfigurationService) {
        this.externalConfigurationService = externalConfigurationService;
        ResourceHelper.setProxyUri(externalConfigurationService.getProxyUri());
        ResourceHelper.setRootUri(externalConfigurationService.getRootUri());
        ResourceHelper.setHttp(externalConfigurationService.getHttp());
    };
    /** get ExternalConfiguration */
    /**
     * get ExternalConfiguration
     * @return {?}
     */
    ExternalService.prototype.getExternalConfiguration = /**
     * get ExternalConfiguration
     * @return {?}
     */
    function () {
        return this.externalConfigurationService.getExternalConfiguration();
    };
    /** get proxy URL */
    /**
     * get proxy URL
     * @return {?}
     */
    ExternalService.prototype.getProxyUri = /**
     * get proxy URL
     * @return {?}
     */
    function () {
        return this.externalConfigurationService.getProxyUri();
    };
    /** get Root URI */
    /**
     * get Root URI
     * @return {?}
     */
    ExternalService.prototype.getRootUri = /**
     * get Root URI
     * @return {?}
     */
    function () {
        return this.externalConfigurationService.getRootUri();
    };
    /** get URL */
    /**
     * get URL
     * @return {?}
     */
    ExternalService.prototype.getURL = /**
     * get URL
     * @return {?}
     */
    function () {
        return ResourceHelper.getURL();
    };
    /** get HttpClient */
    /**
     * get HttpClient
     * @return {?}
     */
    ExternalService.prototype.getHttp = /**
     * get HttpClient
     * @return {?}
     */
    function () {
        return ResourceHelper.getHttp();
    };
    ExternalService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    ExternalService.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: Inject, args: ['ExternalConfigurationService',] }] }
    ]; };
    return ExternalService;
}());
export { ExternalService };
if (false) {
    /**
     * @type {?}
     * @private
     */
    ExternalService.prototype.externalConfigurationService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXh0ZXJuYWwuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS8iLCJzb3VyY2VzIjpbImFuZ3VsYXItaGFsL3NyYy9saWIvZXh0ZXJuYWwuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQ0EsT0FBTyxFQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDakQsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLG1CQUFtQixDQUFDOzs7O0FBTWpEO0lBR0ksa0JBQWtCO0lBQ2xCLHlCQUE0RCw0QkFBbUU7UUFBbkUsaUNBQTRCLEdBQTVCLDRCQUE0QixDQUF1QztRQUMzSCxjQUFjLENBQUMsV0FBVyxDQUFDLDRCQUE0QixDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7UUFDdkUsY0FBYyxDQUFDLFVBQVUsQ0FBQyw0QkFBNEIsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDO1FBQ3JFLGNBQWMsQ0FBQyxPQUFPLENBQUMsNEJBQTRCLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztJQUNuRSxDQUFDO0lBRUQsMENBQTBDOzs7Ozs7SUFDbkMscUVBQTJDOzs7OztJQUFsRCxVQUFtRCw0QkFBbUU7UUFDekgsSUFBSSxDQUFDLDRCQUE0QixHQUFHLDRCQUE0QixDQUFDO1FBRTFELGNBQWMsQ0FBQyxXQUFXLENBQUMsNEJBQTRCLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztRQUN2RSxjQUFjLENBQUMsVUFBVSxDQUFDLDRCQUE0QixDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUM7UUFDckUsY0FBYyxDQUFDLE9BQU8sQ0FBQyw0QkFBNEIsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO0lBQ25FLENBQUM7SUFFRCxnQ0FBZ0M7Ozs7O0lBQ3pCLGtEQUF3Qjs7OztJQUEvQjtRQUNJLE9BQU8sSUFBSSxDQUFDLDRCQUE0QixDQUFDLHdCQUF3QixFQUFFLENBQUM7SUFDeEUsQ0FBQztJQUVELG9CQUFvQjs7Ozs7SUFDYixxQ0FBVzs7OztJQUFsQjtRQUNJLE9BQU8sSUFBSSxDQUFDLDRCQUE0QixDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQzNELENBQUM7SUFFRCxtQkFBbUI7Ozs7O0lBQ1osb0NBQVU7Ozs7SUFBakI7UUFDSSxPQUFPLElBQUksQ0FBQyw0QkFBNEIsQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUMxRCxDQUFDO0lBRUQsY0FBYzs7Ozs7SUFDUCxnQ0FBTTs7OztJQUFiO1FBQ0ksT0FBTyxjQUFjLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDbkMsQ0FBQztJQUVELHFCQUFxQjs7Ozs7SUFDZCxpQ0FBTzs7OztJQUFkO1FBQ0ksT0FBTyxjQUFjLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDcEMsQ0FBQzs7Z0JBMUNKLFVBQVU7Ozs7Z0RBSU0sTUFBTSxTQUFDLDhCQUE4Qjs7SUF1Q3RELHNCQUFDO0NBQUEsQUEzQ0QsSUEyQ0M7U0ExQ1ksZUFBZTs7Ozs7O0lBR1osdURBQW1IIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtIdHRwQ2xpZW50fSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7SW5qZWN0LCBJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtSZXNvdXJjZUhlbHBlcn0gZnJvbSAnLi9yZXNvdXJjZS1oZWxwZXInO1xyXG5pbXBvcnQge0V4dGVybmFsQ29uZmlndXJhdGlvbkhhbmRsZXJJbnRlcmZhY2V9IGZyb20gJy4vZXh0ZXJuYWwtY29uZmlndXJhdGlvbi5oYW5kbGVyJztcclxuaW1wb3J0IHtFeHRlcm5hbENvbmZpZ3VyYXRpb259IGZyb20gJy4vRXh0ZXJuYWxDb25maWd1cmF0aW9uJztcclxuXHJcblxyXG4vKiogRXh0ZXJuYWxTZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIEV4dGVybmFsU2VydmljZSB7XHJcblxyXG4gICAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgICBjb25zdHJ1Y3RvcihASW5qZWN0KCdFeHRlcm5hbENvbmZpZ3VyYXRpb25TZXJ2aWNlJykgcHJpdmF0ZSBleHRlcm5hbENvbmZpZ3VyYXRpb25TZXJ2aWNlOiBFeHRlcm5hbENvbmZpZ3VyYXRpb25IYW5kbGVySW50ZXJmYWNlKSB7XHJcbiAgICAgICAgUmVzb3VyY2VIZWxwZXIuc2V0UHJveHlVcmkoZXh0ZXJuYWxDb25maWd1cmF0aW9uU2VydmljZS5nZXRQcm94eVVyaSgpKTtcclxuICAgICAgICBSZXNvdXJjZUhlbHBlci5zZXRSb290VXJpKGV4dGVybmFsQ29uZmlndXJhdGlvblNlcnZpY2UuZ2V0Um9vdFVyaSgpKTtcclxuICAgICAgICBSZXNvdXJjZUhlbHBlci5zZXRIdHRwKGV4dGVybmFsQ29uZmlndXJhdGlvblNlcnZpY2UuZ2V0SHR0cCgpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogdXBkYXRlIEV4dGVybmFsQ29uZmlndXJhdGlvbkhhbmRsZXIgKi9cclxuICAgIHB1YmxpYyB1cGRhdGVFeHRlcm5hbENvbmZpZ3VyYXRpb25IYW5kbGVySW50ZXJmYWNlKGV4dGVybmFsQ29uZmlndXJhdGlvblNlcnZpY2U6IEV4dGVybmFsQ29uZmlndXJhdGlvbkhhbmRsZXJJbnRlcmZhY2UpIHtcclxuXHR0aGlzLmV4dGVybmFsQ29uZmlndXJhdGlvblNlcnZpY2UgPSBleHRlcm5hbENvbmZpZ3VyYXRpb25TZXJ2aWNlO1xyXG5cclxuICAgICAgICBSZXNvdXJjZUhlbHBlci5zZXRQcm94eVVyaShleHRlcm5hbENvbmZpZ3VyYXRpb25TZXJ2aWNlLmdldFByb3h5VXJpKCkpO1xyXG4gICAgICAgIFJlc291cmNlSGVscGVyLnNldFJvb3RVcmkoZXh0ZXJuYWxDb25maWd1cmF0aW9uU2VydmljZS5nZXRSb290VXJpKCkpO1xyXG4gICAgICAgIFJlc291cmNlSGVscGVyLnNldEh0dHAoZXh0ZXJuYWxDb25maWd1cmF0aW9uU2VydmljZS5nZXRIdHRwKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgRXh0ZXJuYWxDb25maWd1cmF0aW9uICovXHJcbiAgICBwdWJsaWMgZ2V0RXh0ZXJuYWxDb25maWd1cmF0aW9uKCk6IEV4dGVybmFsQ29uZmlndXJhdGlvbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZXh0ZXJuYWxDb25maWd1cmF0aW9uU2VydmljZS5nZXRFeHRlcm5hbENvbmZpZ3VyYXRpb24oKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IHByb3h5IFVSTCAqL1xyXG4gICAgcHVibGljIGdldFByb3h5VXJpKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZXh0ZXJuYWxDb25maWd1cmF0aW9uU2VydmljZS5nZXRQcm94eVVyaSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBnZXQgUm9vdCBVUkkgKi9cclxuICAgIHB1YmxpYyBnZXRSb290VXJpKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZXh0ZXJuYWxDb25maWd1cmF0aW9uU2VydmljZS5nZXRSb290VXJpKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCBVUkwgKi9cclxuICAgIHB1YmxpYyBnZXRVUkwoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gUmVzb3VyY2VIZWxwZXIuZ2V0VVJMKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCBIdHRwQ2xpZW50ICovXHJcbiAgICBwdWJsaWMgZ2V0SHR0cCgpOiBIdHRwQ2xpZW50IHtcclxuICAgICAgICByZXR1cm4gUmVzb3VyY2VIZWxwZXIuZ2V0SHR0cCgpO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==