/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs-compat';
/**
 * Authentication service
 */
var AuthService = /** @class */ (function () {
    /** constructor*/
    function AuthService(http) {
        this.http = http;
        /**
         * API base URL
         */
        this.SERVER_API_URL = '/api';
    }
    /** get current user jwt token from session storage*/
    /**
     * get current user jwt token from session storage
     * @return {?}
     */
    AuthService.prototype.getToken = /**
     * get current user jwt token from session storage
     * @return {?}
     */
    function () {
        return sessionStorage.getItem('authenticationToken');
    };
    /** login operation */
    /**
     * login operation
     * @param {?} credentials
     * @return {?}
     */
    AuthService.prototype.login = /**
     * login operation
     * @param {?} credentials
     * @return {?}
     */
    function (credentials) {
        /** @type {?} */
        var data = {
            username: credentials.username,
            password: credentials.password
        };
        return this.http.post(this.SERVER_API_URL + '/authenticate', data, { observe: 'response' }).map(authenticateSuccess.bind(this));
        /**
         * @param {?} resp
         * @return {?}
         */
        function authenticateSuccess(resp) {
            /** @type {?} */
            var bearerToken = resp.headers.get('Authorization');
            if (bearerToken && bearerToken.slice(0, 7) === 'Bearer ') {
                /** @type {?} */
                var jwt = bearerToken.slice(7, bearerToken.length);
                this.storeAuthenticationToken(jwt);
                //const expiresAt = moment().add( resp.headers.get('Token-Validity'),'milisecond');
                //sessionStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
                return jwt;
            }
        }
    };
    /** login operation with jwt token */
    /**
     * login operation with jwt token
     * @param {?} jwt
     * @return {?}
     */
    AuthService.prototype.loginWithToken = /**
     * login operation with jwt token
     * @param {?} jwt
     * @return {?}
     */
    function (jwt) {
        if (jwt) {
            this.storeAuthenticationToken(jwt);
            return Promise.resolve(jwt);
        }
        else {
            return Promise.reject('auth-jwt-service Promise reject'); // Put appropriate error message here
        }
    };
    /** store jwt token in session storage*/
    /**
     * store jwt token in session storage
     * @param {?} jwt
     * @return {?}
     */
    AuthService.prototype.storeAuthenticationToken = /**
     * store jwt token in session storage
     * @param {?} jwt
     * @return {?}
     */
    function (jwt) {
        sessionStorage.setItem('authenticationToken', jwt);
    };
    /**
     * check whether current user is logged in
     * @return {?}
     */
    AuthService.prototype.isLoggedIn = /**
     * check whether current user is logged in
     * @return {?}
     */
    function () {
        //return moment().isBefore(this.getExpiration());
        return this.getToken();
    };
    /** check whether current user is logged out*/
    /**
     * check whether current user is logged out
     * @return {?}
     */
    AuthService.prototype.isLoggedOut = /**
     * check whether current user is logged out
     * @return {?}
     */
    function () {
        return !this.isLoggedIn();
    };
    /** logout operation */
    /**
     * logout operation
     * @return {?}
     */
    AuthService.prototype.logout = /**
     * logout operation
     * @return {?}
     */
    function () {
        return new Observable(function (observer) {
            //localStorage.removeItem('authenticationToken');
            sessionStorage.removeItem('authenticationToken');
            //sessionStorage.removeItem('expires_at');
            observer.complete();
        });
    };
    AuthService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    AuthService.ctorParameters = function () { return [
        { type: HttpClient }
    ]; };
    return AuthService;
}());
export { AuthService };
if (false) {
    /**
     * API base URL
     * @type {?}
     */
    AuthService.prototype.SERVER_API_URL;
    /** @type {?} */
    AuthService.prototype.http;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlLyIsInNvdXJjZXMiOlsiYXV0aC9hdXRoLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ2xELE9BQU8sRUFBRSxVQUFVLEVBQUMsTUFBTSxhQUFhLENBQUM7Ozs7O0lBVXBDLGlCQUFpQjtJQUNqQixxQkFDWTtRQUFBLFNBQUksR0FBSixJQUFJOzs7OzhCQUpRLE1BQU07S0FLMUI7SUFFSixxREFBcUQ7Ozs7O0lBQ3JELDhCQUFROzs7O0lBQVI7UUFDSSxNQUFNLENBQUUsY0FBYyxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0tBQ3pEO0lBRUQsc0JBQXNCOzs7Ozs7SUFDdEIsMkJBQUs7Ozs7O0lBQUwsVUFBTSxXQUFXOztRQUViLElBQU0sSUFBSSxHQUFHO1lBQ1QsUUFBUSxFQUFFLFdBQVcsQ0FBQyxRQUFRO1lBQzlCLFFBQVEsRUFBRSxXQUFXLENBQUMsUUFBUTtTQUNqQyxDQUFDO1FBQ0YsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLEdBQUcsZUFBZSxFQUFFLElBQUksRUFBRSxFQUFDLE9BQU8sRUFBRyxVQUFVLEVBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzs7Ozs7UUFFL0gsNkJBQTZCLElBQUk7O1lBQzdCLElBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQ3RELEVBQUUsQ0FBQyxDQUFDLFdBQVcsSUFBSSxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDOztnQkFDdkQsSUFBTSxHQUFHLEdBQUcsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUNyRCxJQUFJLENBQUMsd0JBQXdCLENBQUMsR0FBRyxDQUFDLENBQUM7OztnQkFHbkMsTUFBTSxDQUFDLEdBQUcsQ0FBQzthQUNkO1NBS0o7S0FDSjtJQUVELHFDQUFxQzs7Ozs7O0lBQ3JDLG9DQUFjOzs7OztJQUFkLFVBQWUsR0FBRztRQUNkLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDTixJQUFJLENBQUMsd0JBQXdCLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDbkMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDL0I7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLGlDQUFpQyxDQUFDLENBQUM7U0FDNUQ7S0FDSjtJQUVELHdDQUF3Qzs7Ozs7O0lBQ3hDLDhDQUF3Qjs7Ozs7SUFBeEIsVUFBeUIsR0FBRztRQUN6QixjQUFjLENBQUMsT0FBTyxDQUFDLHFCQUFxQixFQUFFLEdBQUcsQ0FBQyxDQUFDO0tBRXJEOzs7OztJQUdNLGdDQUFVOzs7Ozs7UUFFYixNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDOztJQUczQiw4Q0FBOEM7Ozs7O0lBQzlDLGlDQUFXOzs7O0lBQVg7UUFDSSxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7S0FDN0I7SUFFRCx1QkFBdUI7Ozs7O0lBQ3ZCLDRCQUFNOzs7O0lBQU47UUFFSSxNQUFNLENBQUMsSUFBSSxVQUFVLENBQUMsVUFBQyxRQUFROztZQUUzQixjQUFjLENBQUMsVUFBVSxDQUFDLHFCQUFxQixDQUFDLENBQUM7O1lBRWpELFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztTQUN2QixDQUFDLENBQUM7S0FDTjs7Z0JBN0VKLFVBQVU7Ozs7Z0JBTEYsVUFBVTs7c0JBRG5COztTQU9hLFdBQVciLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGV9IGZyb20gJ3J4anMtY29tcGF0JztcclxuLy9pbXBvcnQgKiBhcyBtb21lbnQgZnJvbSAnbW9tZW50JztcclxuXHJcbi8qKiBBdXRoZW50aWNhdGlvbiBzZXJ2aWNlKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgQXV0aFNlcnZpY2Uge1xyXG4gICAgXHJcbiAgICAvKiogQVBJIGJhc2UgVVJMICovXHJcbiAgICBwdWJsaWMgU0VSVkVSX0FQSV9VUkwgPSAnL2FwaSc7XHJcbiAgICBcclxuICAgIC8qKiBjb25zdHJ1Y3RvciovXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBwcml2YXRlIGh0dHA6IEh0dHBDbGllbnRcclxuICAgICkge31cclxuICAgIFxyXG4gICAgLyoqIGdldCBjdXJyZW50IHVzZXIgand0IHRva2VuIGZyb20gc2Vzc2lvbiBzdG9yYWdlKi9cclxuICAgIGdldFRva2VuKCkge1xyXG4gICAgICAgIHJldHVybiAgc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnYXV0aGVudGljYXRpb25Ub2tlbicpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBsb2dpbiBvcGVyYXRpb24gKi9cclxuICAgIGxvZ2luKGNyZWRlbnRpYWxzKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuXHJcbiAgICAgICAgY29uc3QgZGF0YSA9IHtcclxuICAgICAgICAgICAgdXNlcm5hbWU6IGNyZWRlbnRpYWxzLnVzZXJuYW1lLFxyXG4gICAgICAgICAgICBwYXNzd29yZDogY3JlZGVudGlhbHMucGFzc3dvcmRcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAucG9zdCh0aGlzLlNFUlZFUl9BUElfVVJMICsgJy9hdXRoZW50aWNhdGUnLCBkYXRhLCB7b2JzZXJ2ZSA6ICdyZXNwb25zZSd9KS5tYXAoYXV0aGVudGljYXRlU3VjY2Vzcy5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gYXV0aGVudGljYXRlU3VjY2VzcyhyZXNwKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGJlYXJlclRva2VuID0gcmVzcC5oZWFkZXJzLmdldCgnQXV0aG9yaXphdGlvbicpO1xyXG4gICAgICAgICAgICBpZiAoYmVhcmVyVG9rZW4gJiYgYmVhcmVyVG9rZW4uc2xpY2UoMCwgNykgPT09ICdCZWFyZXIgJykge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgand0ID0gYmVhcmVyVG9rZW4uc2xpY2UoNywgYmVhcmVyVG9rZW4ubGVuZ3RoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RvcmVBdXRoZW50aWNhdGlvblRva2VuKGp3dCk7XHJcbiAgICAgICAgICAgICAgICAvL2NvbnN0IGV4cGlyZXNBdCA9IG1vbWVudCgpLmFkZCggcmVzcC5oZWFkZXJzLmdldCgnVG9rZW4tVmFsaWRpdHknKSwnbWlsaXNlY29uZCcpO1xyXG4gICAgICAgICAgICAgICAgLy9zZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCdleHBpcmVzX2F0JywgSlNPTi5zdHJpbmdpZnkoZXhwaXJlc0F0LnZhbHVlT2YoKSkpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGp3dDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgXHJcblxyXG4gICAgICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKiBsb2dpbiBvcGVyYXRpb24gd2l0aCBqd3QgdG9rZW4gKi9cclxuICAgIGxvZ2luV2l0aFRva2VuKGp3dCkge1xyXG4gICAgICAgIGlmIChqd3QpIHtcclxuICAgICAgICAgICAgdGhpcy5zdG9yZUF1dGhlbnRpY2F0aW9uVG9rZW4oand0KTtcclxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShqd3QpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdCgnYXV0aC1qd3Qtc2VydmljZSBQcm9taXNlIHJlamVjdCcpOyAvLyBQdXQgYXBwcm9wcmlhdGUgZXJyb3IgbWVzc2FnZSBoZXJlXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKiBzdG9yZSBqd3QgdG9rZW4gaW4gc2Vzc2lvbiBzdG9yYWdlKi9cclxuICAgIHN0b3JlQXV0aGVudGljYXRpb25Ub2tlbihqd3QpIHtcclxuICAgICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oJ2F1dGhlbnRpY2F0aW9uVG9rZW4nLCBqd3QpO1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKiogY2hlY2sgd2hldGhlciBjdXJyZW50IHVzZXIgaXMgbG9nZ2VkIGluKi9cclxuICAgIHB1YmxpYyBpc0xvZ2dlZEluKCkge1xyXG4gICAgICAgIC8vcmV0dXJuIG1vbWVudCgpLmlzQmVmb3JlKHRoaXMuZ2V0RXhwaXJhdGlvbigpKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5nZXRUb2tlbigpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKiogY2hlY2sgd2hldGhlciBjdXJyZW50IHVzZXIgaXMgbG9nZ2VkIG91dCovXHJcbiAgICBpc0xvZ2dlZE91dCgpIHtcclxuICAgICAgICByZXR1cm4gIXRoaXMuaXNMb2dnZWRJbigpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBsb2dvdXQgb3BlcmF0aW9uICovXHJcbiAgICBsb2dvdXQoKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlKChvYnNlcnZlcikgPT4ge1xyXG4gICAgICAgICAgICAvL2xvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCdhdXRoZW50aWNhdGlvblRva2VuJyk7XHJcbiAgICAgICAgICAgIHNlc3Npb25TdG9yYWdlLnJlbW92ZUl0ZW0oJ2F1dGhlbnRpY2F0aW9uVG9rZW4nKTtcclxuICAgICAgICAgICAgLy9zZXNzaW9uU3RvcmFnZS5yZW1vdmVJdGVtKCdleHBpcmVzX2F0Jyk7XHJcbiAgICAgICAgICAgIG9ic2VydmVyLmNvbXBsZXRlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIFxyXG59XHJcbiJdfQ==