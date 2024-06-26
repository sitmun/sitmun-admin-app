/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Principal } from './principal.service';
/**
 * Login service
 */
var LoginService = /** @class */ (function () {
    /** constructor */
    function LoginService(authServerProvider, principal) {
        this.authServerProvider = authServerProvider;
        this.principal = principal;
    }
    /**Login operation*/
    /**
     * Login operation
     * @param {?} credentials
     * @param {?=} callback
     * @return {?}
     */
    LoginService.prototype.login = /**
     * Login operation
     * @param {?} credentials
     * @param {?=} callback
     * @return {?}
     */
    function (credentials, callback) {
        var _this = this;
        /** @type {?} */
        var cb = callback || (/**
         * @return {?}
         */
        function () { });
        return new Promise((/**
         * @param {?} resolve
         * @param {?} reject
         * @return {?}
         */
        function (resolve, reject) {
            _this.authServerProvider.login(credentials).subscribe((/**
             * @param {?} data
             * @return {?}
             */
            function (data) {
                _this.principal.identity(true).then((/**
                 * @param {?} account
                 * @return {?}
                 */
                function (account) {
                    // After the login the language will be changed to
                    // the language selected by the user during his registration
                    resolve(data);
                }));
                return cb();
            }), (/**
             * @param {?} err
             * @return {?}
             */
            function (err) {
                _this.logout();
                reject(err);
                return cb(err);
            }));
        }));
    };
    /**login with jwt token */
    /**
     * login with jwt token
     * @param {?} jwt
     * @return {?}
     */
    LoginService.prototype.loginWithToken = /**
     * login with jwt token
     * @param {?} jwt
     * @return {?}
     */
    function (jwt) {
        return this.authServerProvider.loginWithToken(jwt);
    };
    /** logout operation */
    /**
     * logout operation
     * @return {?}
     */
    LoginService.prototype.logout = /**
     * logout operation
     * @return {?}
     */
    function () {
        this.authServerProvider.logout().subscribe();
        this.principal.authenticate(null);
    };
    LoginService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    LoginService.ctorParameters = function () { return [
        { type: AuthService },
        { type: Principal }
    ]; };
    return LoginService;
}());
export { LoginService };
if (false) {
    /**
     * @type {?}
     * @private
     */
    LoginService.prototype.authServerProvider;
    /**
     * @type {?}
     * @private
     */
    LoginService.prototype.principal;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW4uc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS8iLCJzb3VyY2VzIjpbImF1dGgvbG9naW4uc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDN0MsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLHFCQUFxQixDQUFDOzs7O0FBR2hEO0lBR0ksa0JBQWtCO0lBQ2xCLHNCQUNZLGtCQUErQixFQUMvQixTQUFvQjtRQURwQix1QkFBa0IsR0FBbEIsa0JBQWtCLENBQWE7UUFDL0IsY0FBUyxHQUFULFNBQVMsQ0FBVztJQUM3QixDQUFDO0lBRUosb0JBQW9COzs7Ozs7O0lBQ3BCLDRCQUFLOzs7Ozs7SUFBTCxVQUFNLFdBQVcsRUFBRSxRQUFTO1FBQTVCLGlCQW1CQzs7WUFsQlMsRUFBRSxHQUFHLFFBQVE7OztRQUFJLGNBQVksQ0FBQyxDQUFBO1FBRXBDLE9BQU8sSUFBSSxPQUFPOzs7OztRQUFDLFVBQUMsT0FBTyxFQUFFLE1BQU07WUFDL0IsS0FBSSxDQUFDLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQyxTQUFTOzs7O1lBQUMsVUFBQyxJQUFJO2dCQUN0RCxLQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJOzs7O2dCQUFDLFVBQUMsT0FBTztvQkFDdkMsa0RBQWtEO29CQUNsRCw0REFBNEQ7b0JBQzVELE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDbEIsQ0FBQyxFQUFDLENBQUM7Z0JBR0gsT0FBTyxFQUFFLEVBQUUsQ0FBQztZQUNoQixDQUFDOzs7O1lBQUUsVUFBQyxHQUFHO2dCQUNILEtBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDZCxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ1osT0FBTyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDbkIsQ0FBQyxFQUFDLENBQUM7UUFDUCxDQUFDLEVBQUMsQ0FBQztJQUNQLENBQUM7SUFDRCwwQkFBMEI7Ozs7OztJQUMxQixxQ0FBYzs7Ozs7SUFBZCxVQUFlLEdBQUc7UUFDZCxPQUFPLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDdkQsQ0FBQztJQUVELHVCQUF1Qjs7Ozs7SUFDdkIsNkJBQU07Ozs7SUFBTjtRQUNHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUM3QyxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNyQyxDQUFDOztnQkF2Q0osVUFBVTs7OztnQkFKRixXQUFXO2dCQUNYLFNBQVM7O0lBMkNsQixtQkFBQztDQUFBLEFBeENELElBd0NDO1NBdkNZLFlBQVk7Ozs7OztJQUlqQiwwQ0FBdUM7Ozs7O0lBQ3ZDLGlDQUE0QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQXV0aFNlcnZpY2UgfSBmcm9tICcuL2F1dGguc2VydmljZSc7XHJcbmltcG9ydCB7IFByaW5jaXBhbCB9IGZyb20gJy4vcHJpbmNpcGFsLnNlcnZpY2UnO1xyXG5cclxuLyoqIExvZ2luIHNlcnZpY2UqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBMb2dpblNlcnZpY2Uge1xyXG4gICAgXHJcbiAgICAvKiogY29uc3RydWN0b3IgKi9cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHByaXZhdGUgYXV0aFNlcnZlclByb3ZpZGVyOiBBdXRoU2VydmljZSwgXHJcbiAgICAgICAgcHJpdmF0ZSBwcmluY2lwYWw6IFByaW5jaXBhbFxyXG4gICAgKSB7fVxyXG5cclxuICAgIC8qKkxvZ2luIG9wZXJhdGlvbiovXHJcbiAgICBsb2dpbihjcmVkZW50aWFscywgY2FsbGJhY2s/KSB7XHJcbiAgICAgICAgY29uc3QgY2IgPSBjYWxsYmFjayB8fCBmdW5jdGlvbigpIHt9O1xyXG5cclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmF1dGhTZXJ2ZXJQcm92aWRlci5sb2dpbihjcmVkZW50aWFscykuc3Vic2NyaWJlKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnByaW5jaXBhbC5pZGVudGl0eSh0cnVlKS50aGVuKChhY2NvdW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gQWZ0ZXIgdGhlIGxvZ2luIHRoZSBsYW5ndWFnZSB3aWxsIGJlIGNoYW5nZWQgdG9cclxuICAgICAgICAgICAgICAgICAgICAvLyB0aGUgbGFuZ3VhZ2Ugc2VsZWN0ZWQgYnkgdGhlIHVzZXIgZHVyaW5nIGhpcyByZWdpc3RyYXRpb25cclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNiKCk7XHJcbiAgICAgICAgICAgIH0sIChlcnIpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9nb3V0KCk7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjYihlcnIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIC8qKmxvZ2luIHdpdGggand0IHRva2VuICovXHJcbiAgICBsb2dpbldpdGhUb2tlbihqd3QpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hdXRoU2VydmVyUHJvdmlkZXIubG9naW5XaXRoVG9rZW4oand0KTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogbG9nb3V0IG9wZXJhdGlvbiAqL1xyXG4gICAgbG9nb3V0KCkge1xyXG4gICAgICAgdGhpcy5hdXRoU2VydmVyUHJvdmlkZXIubG9nb3V0KCkuc3Vic2NyaWJlKCk7XHJcbiAgICAgICB0aGlzLnByaW5jaXBhbC5hdXRoZW50aWNhdGUobnVsbCk7XHJcbiAgICB9XHJcbn1cclxuIl19