/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AccountService } from '../account/account.service';
/**
 * Principal service
 */
export class Principal {
    /**
     * constructor
     * @param {?} account
     */
    constructor(account) {
        this.account = account;
        this.authenticated = false;
        this.authenticationState = new Subject();
    }
    /**
     * authenticate with given identity
     * @param {?} identity
     * @return {?}
     */
    authenticate(identity) {
        this.userIdentity = identity;
        this.authenticated = identity !== null;
        this.authenticationState.next(this.userIdentity);
    }
    /**
     * check whether current user has any of the given authorities
     * @param {?} authorities
     * @return {?}
     */
    hasAnyAuthority(authorities) {
        return Promise.resolve(this.hasAnyAuthorityDirect(authorities));
    }
    /**
     * check whether current user has any of the given authorities on the given territory
     * @param {?} authorities
     * @param {?} territory
     * @return {?}
     */
    hasAnyAuthorityOnTerritory(authorities, territory) {
        return Promise.resolve(this.hasAnyAuthorityDirectOnTerritory(authorities, territory));
    }
    /**
     * check whether current user has any of the given authorities without resolving promises
     * @param {?} authorities
     * @return {?}
     */
    hasAnyAuthorityDirect(authorities) {
        if (!this.authenticated || !this.userIdentity || !this.userIdentity.authorities) {
            return false;
        }
        for (let i = 0; i < authorities.length; i++) {
            if (this.userIdentity.authorities.includes(authorities[i])) {
                return true;
            }
        }
        return false;
    }
    /**
     * check whether current user has any of the given authorities on the given territory without resolving promises
     * @param {?} authorities
     * @param {?} territory
     * @return {?}
     */
    hasAnyAuthorityDirectOnTerritory(authorities, territory) {
        if (!this.authenticated || !this.userIdentity || !this.userIdentity.authorities) {
            return false;
        }
        for (let i = 0; i < authorities.length; i++) {
            if (this.userIdentity.authoritiesPerTerritory[territory] && this.userIdentity.authoritiesPerTerritory[territory].includes(authorities[i])) {
                return true;
            }
        }
        return false;
    }
    /**
     * check whether current user has the given authority
     * @param {?} authority
     * @return {?}
     */
    hasAuthority(authority) {
        if (!this.authenticated) {
            return Promise.resolve(false);
        }
        return this.identity().then((id) => {
            return Promise.resolve(id.authorities && id.authorities.includes(authority));
        }, () => {
            return Promise.resolve(false);
        });
    }
    /**
     * check whether current user has the given authority on the given territory
     * @param {?} authority
     * @param {?} territory
     * @return {?}
     */
    hasAuthorityOnTerritory(authority, territory) {
        if (!this.authenticated) {
            return Promise.resolve(false);
        }
        return this.identity().then((id) => {
            return Promise.resolve(id.authoritiesPerTerritory && id.authoritiesPerTerritory[territory] && id.authoritiesPerTerritory[territory].includes(authority));
        }, () => {
            return Promise.resolve(false);
        });
    }
    /**
     * check user identity
     * @param {?=} force
     * @return {?}
     */
    identity(force) {
        if (force === true) {
            this.userIdentity = undefined;
        }
        // check and see if we have retrieved the userIdentity data from the server.
        // if we have, reuse it by immediately resolving
        if (this.userIdentity) {
            return Promise.resolve(this.userIdentity);
        }
        // retrieve the userIdentity data from the server, update the identity object, and then resolve.
        return this.account.get().toPromise().then((response) => {
            /** @type {?} */
            const account = response;
            if (account) {
                this.userIdentity = account;
                this.authenticated = true;
            }
            else {
                this.userIdentity = null;
                this.authenticated = false;
            }
            this.authenticationState.next(this.userIdentity);
            return this.userIdentity;
        }).catch((err) => {
            this.userIdentity = null;
            this.authenticated = false;
            this.authenticationState.next(this.userIdentity);
            return null;
        });
    }
    /**
     * check whether current user is authenticated
     * @return {?}
     */
    isAuthenticated() {
        return this.authenticated;
    }
    /**
     * check whether current user identity is resolved
     * @return {?}
     */
    isIdentityResolved() {
        return this.userIdentity !== undefined;
    }
    /**
     * get current user authentication state
     * @return {?}
     */
    getAuthenticationState() {
        return this.authenticationState.asObservable();
    }
}
Principal.decorators = [
    { type: Injectable },
];
/** @nocollapse */
Principal.ctorParameters = () => [
    { type: AccountService }
];
if (false) {
    /** @type {?} */
    Principal.prototype.userIdentity;
    /** @type {?} */
    Principal.prototype.authenticated;
    /** @type {?} */
    Principal.prototype.authenticationState;
    /** @type {?} */
    Principal.prototype.account;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJpbmNpcGFsLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvIiwic291cmNlcyI6WyJhdXRoL3ByaW5jaXBhbC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxPQUFPLEVBQWMsTUFBTSxNQUFNLENBQUM7QUFDM0MsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLDRCQUE0QixDQUFDOzs7O0FBSTVELE1BQU07Ozs7O0lBTUYsWUFDWTtRQUFBLFlBQU8sR0FBUCxPQUFPOzZCQUxLLEtBQUs7bUNBQ0MsSUFBSSxPQUFPLEVBQU87S0FLNUM7Ozs7OztJQUdKLFlBQVksQ0FBQyxRQUFRO1FBQ2pCLElBQUksQ0FBQyxZQUFZLEdBQUcsUUFBUSxDQUFDO1FBQzdCLElBQUksQ0FBQyxhQUFhLEdBQUcsUUFBUSxLQUFLLElBQUksQ0FBQztRQUN2QyxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztLQUNwRDs7Ozs7O0lBR0QsZUFBZSxDQUFDLFdBQXFCO1FBQ2pDLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO0tBQ25FOzs7Ozs7O0lBR0QsMEJBQTBCLENBQUMsV0FBcUIsRUFBQyxTQUFpQjtRQUM5RCxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsZ0NBQWdDLENBQUMsV0FBVyxFQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7S0FDeEY7Ozs7OztJQUdELHFCQUFxQixDQUFDLFdBQXFCO1FBQ3ZDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLElBQUksQ0FBQyxJQUFJLENBQUMsWUFB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QjtRQUNkLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxLQUFLLFNBQVMsQ0FBQztLQUMxQzs7Ozs7SUFHRCxzQkFBc0I7UUFDbEIsTUFBTSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxZQUFZLEVBQUUsQ0FBQztLQUNsRDs7O1lBbElKLFVBQVU7Ozs7WUFIRixjQUFjIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBTdWJqZWN0LCBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IEFjY291bnRTZXJ2aWNlIH0gZnJvbSAnLi4vYWNjb3VudC9hY2NvdW50LnNlcnZpY2UnO1xyXG5cclxuLyoqIFByaW5jaXBhbCBzZXJ2aWNlKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgUHJpbmNpcGFsIHtcclxuICAgIHByaXZhdGUgdXNlcklkZW50aXR5OiBhbnk7XHJcbiAgICBwcml2YXRlIGF1dGhlbnRpY2F0ZWQgPSBmYWxzZTtcclxuICAgIHByaXZhdGUgYXV0aGVudGljYXRpb25TdGF0ZSA9IG5ldyBTdWJqZWN0PGFueT4oKTtcclxuXHJcbiAgICAvKiogY29uc3RydWN0b3IgKi9cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHByaXZhdGUgYWNjb3VudDogQWNjb3VudFNlcnZpY2VcclxuICAgICkge31cclxuXHJcbiAgICAvKiogYXV0aGVudGljYXRlIHdpdGggZ2l2ZW4gaWRlbnRpdHkqL1xyXG4gICAgYXV0aGVudGljYXRlKGlkZW50aXR5KSB7XHJcbiAgICAgICAgdGhpcy51c2VySWRlbnRpdHkgPSBpZGVudGl0eTtcclxuICAgICAgICB0aGlzLmF1dGhlbnRpY2F0ZWQgPSBpZGVudGl0eSAhPT0gbnVsbDtcclxuICAgICAgICB0aGlzLmF1dGhlbnRpY2F0aW9uU3RhdGUubmV4dCh0aGlzLnVzZXJJZGVudGl0eSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGNoZWNrIHdoZXRoZXIgY3VycmVudCB1c2VyIGhhcyBhbnkgb2YgdGhlIGdpdmVuIGF1dGhvcml0aWVzICovXHJcbiAgICBoYXNBbnlBdXRob3JpdHkoYXV0aG9yaXRpZXM6IHN0cmluZ1tdKTogUHJvbWlzZTxib29sZWFuPiB7XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzLmhhc0FueUF1dGhvcml0eURpcmVjdChhdXRob3JpdGllcykpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBjaGVjayB3aGV0aGVyIGN1cnJlbnQgdXNlciBoYXMgYW55IG9mIHRoZSBnaXZlbiBhdXRob3JpdGllcyBvbiB0aGUgZ2l2ZW4gdGVycml0b3J5ICovXHJcbiAgICBoYXNBbnlBdXRob3JpdHlPblRlcnJpdG9yeShhdXRob3JpdGllczogc3RyaW5nW10sdGVycml0b3J5OiBzdHJpbmcgKTogUHJvbWlzZTxib29sZWFuPiB7XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzLmhhc0FueUF1dGhvcml0eURpcmVjdE9uVGVycml0b3J5KGF1dGhvcml0aWVzLHRlcnJpdG9yeSkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBjaGVjayB3aGV0aGVyIGN1cnJlbnQgdXNlciBoYXMgYW55IG9mIHRoZSBnaXZlbiBhdXRob3JpdGllcyB3aXRob3V0IHJlc29sdmluZyBwcm9taXNlcyovXHJcbiAgICBoYXNBbnlBdXRob3JpdHlEaXJlY3QoYXV0aG9yaXRpZXM6IHN0cmluZ1tdKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmF1dGhlbnRpY2F0ZWQgfHwgIXRoaXMudXNlcklkZW50aXR5IHx8ICF0aGlzLnVzZXJJZGVudGl0eS5hdXRob3JpdGllcykge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGF1dGhvcml0aWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnVzZXJJZGVudGl0eS5hdXRob3JpdGllcy5pbmNsdWRlcyhhdXRob3JpdGllc1tpXSkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGNoZWNrIHdoZXRoZXIgY3VycmVudCB1c2VyIGhhcyBhbnkgb2YgdGhlIGdpdmVuIGF1dGhvcml0aWVzIG9uIHRoZSBnaXZlbiB0ZXJyaXRvcnkgd2l0aG91dCByZXNvbHZpbmcgcHJvbWlzZXMgKi9cclxuICAgIGhhc0FueUF1dGhvcml0eURpcmVjdE9uVGVycml0b3J5KGF1dGhvcml0aWVzOiBzdHJpbmdbXSx0ZXJyaXRvcnk6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICghdGhpcy5hdXRoZW50aWNhdGVkIHx8ICF0aGlzLnVzZXJJZGVudGl0eSB8fCAhdGhpcy51c2VySWRlbnRpdHkuYXV0aG9yaXRpZXMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhdXRob3JpdGllcy5sZW5ndGg7IGkrKykge1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMudXNlcklkZW50aXR5LmF1dGhvcml0aWVzUGVyVGVycml0b3J5W3RlcnJpdG9yeV0gJiYgdGhpcy51c2VySWRlbnRpdHkuYXV0aG9yaXRpZXNQZXJUZXJyaXRvcnlbdGVycml0b3J5XS5pbmNsdWRlcyhhdXRob3JpdGllc1tpXSkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGNoZWNrIHdoZXRoZXIgY3VycmVudCB1c2VyIGhhcyB0aGUgZ2l2ZW4gYXV0aG9yaXR5ICovXHJcbiAgICBoYXNBdXRob3JpdHkoYXV0aG9yaXR5OiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+IHtcclxuICAgICAgICBpZiAoIXRoaXMuYXV0aGVudGljYXRlZCkge1xyXG4gICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoZmFsc2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaWRlbnRpdHkoKS50aGVuKChpZCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGlkLmF1dGhvcml0aWVzICYmIGlkLmF1dGhvcml0aWVzLmluY2x1ZGVzKGF1dGhvcml0eSkpO1xyXG4gICAgICAgIH0sICgpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShmYWxzZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGNoZWNrIHdoZXRoZXIgY3VycmVudCB1c2VyIGhhcyB0aGUgZ2l2ZW4gYXV0aG9yaXR5IG9uIHRoZSBnaXZlbiB0ZXJyaXRvcnkqL1xyXG4gICAgaGFzQXV0aG9yaXR5T25UZXJyaXRvcnkoYXV0aG9yaXR5OiBzdHJpbmcsdGVycml0b3J5OiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+IHtcclxuICAgICAgICBpZiAoIXRoaXMuYXV0aGVudGljYXRlZCkge1xyXG4gICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoZmFsc2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaWRlbnRpdHkoKS50aGVuKChpZCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGlkLmF1dGhvcml0aWVzUGVyVGVycml0b3J5ICYmIGlkLmF1dGhvcml0aWVzUGVyVGVycml0b3J5W3RlcnJpdG9yeV0gJiYgaWQuYXV0aG9yaXRpZXNQZXJUZXJyaXRvcnlbdGVycml0b3J5XS5pbmNsdWRlcyhhdXRob3JpdHkpKTtcclxuICAgICAgICB9LCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoZmFsc2UpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBjaGVjayB1c2VyIGlkZW50aXR5Ki9cclxuICAgIGlkZW50aXR5KGZvcmNlPzogYm9vbGVhbik6IFByb21pc2U8YW55PiB7XHJcbiAgICAgICAgaWYgKGZvcmNlID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIHRoaXMudXNlcklkZW50aXR5ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gY2hlY2sgYW5kIHNlZSBpZiB3ZSBoYXZlIHJldHJpZXZlZCB0aGUgdXNlcklkZW50aXR5IGRhdGEgZnJvbSB0aGUgc2VydmVyLlxyXG4gICAgICAgIC8vIGlmIHdlIGhhdmUsIHJldXNlIGl0IGJ5IGltbWVkaWF0ZWx5IHJlc29sdmluZ1xyXG4gICAgICAgIGlmICh0aGlzLnVzZXJJZGVudGl0eSkge1xyXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMudXNlcklkZW50aXR5KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHJldHJpZXZlIHRoZSB1c2VySWRlbnRpdHkgZGF0YSBmcm9tIHRoZSBzZXJ2ZXIsIHVwZGF0ZSB0aGUgaWRlbnRpdHkgb2JqZWN0LCBhbmQgdGhlbiByZXNvbHZlLlxyXG4gICAgICAgIHJldHVybiB0aGlzLmFjY291bnQuZ2V0KCkudG9Qcm9taXNlKCkudGhlbigocmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgYWNjb3VudCA9IHJlc3BvbnNlO1xyXG4gICAgICAgICAgICBpZiAoYWNjb3VudCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy51c2VySWRlbnRpdHkgPSBhY2NvdW50O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hdXRoZW50aWNhdGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudXNlcklkZW50aXR5ID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXV0aGVudGljYXRlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuYXV0aGVudGljYXRpb25TdGF0ZS5uZXh0KHRoaXMudXNlcklkZW50aXR5KTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudXNlcklkZW50aXR5O1xyXG4gICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcclxuICAgICAgICAgICAgdGhpcy51c2VySWRlbnRpdHkgPSBudWxsO1xyXG4gICAgICAgICAgICB0aGlzLmF1dGhlbnRpY2F0ZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5hdXRoZW50aWNhdGlvblN0YXRlLm5leHQodGhpcy51c2VySWRlbnRpdHkpO1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogY2hlY2sgd2hldGhlciBjdXJyZW50IHVzZXIgaXMgYXV0aGVudGljYXRlZCAqL1xyXG4gICAgaXNBdXRoZW50aWNhdGVkKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmF1dGhlbnRpY2F0ZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGNoZWNrIHdoZXRoZXIgY3VycmVudCB1c2VyIGlkZW50aXR5IGlzIHJlc29sdmVkICovXHJcbiAgICBpc0lkZW50aXR5UmVzb2x2ZWQoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudXNlcklkZW50aXR5ICE9PSB1bmRlZmluZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdldCBjdXJyZW50IHVzZXIgYXV0aGVudGljYXRpb24gc3RhdGUgKi9cclxuICAgIGdldEF1dGhlbnRpY2F0aW9uU3RhdGUoKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hdXRoZW50aWNhdGlvblN0YXRlLmFzT2JzZXJ2YWJsZSgpO1xyXG4gICAgfVxyXG5cclxuXHJcbn1cclxuIl19