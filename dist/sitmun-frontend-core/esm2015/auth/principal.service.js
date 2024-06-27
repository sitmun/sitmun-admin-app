import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AccountService } from '../account/account.service';
import * as i0 from "@angular/core";
import * as i1 from "../account/account.service";
/** Principal service*/
export class Principal {
    /** constructor */
    constructor(account) {
        this.account = account;
        this.authenticated = false;
        this.authenticationState = new Subject();
    }
    /** authenticate with given identity*/
    authenticate(identity) {
        this.userIdentity = identity;
        this.authenticated = identity !== null;
        this.authenticationState.next(this.userIdentity);
    }
    /** check whether current user has any of the given authorities */
    hasAnyAuthority(authorities) {
        return Promise.resolve(this.hasAnyAuthorityDirect(authorities));
    }
    /** check whether current user has any of the given authorities on the given territory */
    hasAnyAuthorityOnTerritory(authorities, territory) {
        return Promise.resolve(this.hasAnyAuthorityDirectOnTerritory(authorities, territory));
    }
    /** check whether current user has any of the given authorities without resolving promises*/
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
    /** check whether current user has any of the given authorities on the given territory without resolving promises */
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
    /** check whether current user has the given authority */
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
    /** check whether current user has the given authority on the given territory*/
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
    /** check user identity*/
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
    /** check whether current user is authenticated */
    isAuthenticated() {
        return this.authenticated;
    }
    /** check whether current user identity is resolved */
    isIdentityResolved() {
        return this.userIdentity !== undefined;
    }
    /** get current user authentication state */
    getAuthenticationState() {
        return this.authenticationState.asObservable();
    }
}
Principal.ɵfac = function Principal_Factory(t) { return new (t || Principal)(i0.ɵɵinject(i1.AccountService)); };
Principal.ɵprov = i0.ɵɵdefineInjectable({ token: Principal, factory: Principal.ɵfac });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(Principal, [{
        type: Injectable
    }], function () { return [{ type: i1.AccountService }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJpbmNpcGFsLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiQzovVXNlcnMvYWNvcm9taW5hcy9EZXNrdG9wL05leHVzL1NpdG11bjMvc2l0bXVuLWZyb250ZW5kLWNvcmUvcHJvamVjdHMvc2l0bXVuLWZyb250ZW5kLWNvcmUvc3JjL2xpYi8iLCJzb3VyY2VzIjpbImF1dGgvcHJpbmNpcGFsLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsT0FBTyxFQUFjLE1BQU0sTUFBTSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQzs7O0FBRTVELHVCQUF1QjtBQUV2QixNQUFNLE9BQU8sU0FBUztJQUtsQixrQkFBa0I7SUFDbEIsWUFDWSxPQUF1QjtRQUF2QixZQUFPLEdBQVAsT0FBTyxDQUFnQjtRQUwzQixrQkFBYSxHQUFHLEtBQUssQ0FBQztRQUN0Qix3QkFBbUIsR0FBRyxJQUFJLE9BQU8sRUFBTyxDQUFDO0lBSzlDLENBQUM7SUFFSixzQ0FBc0M7SUFDdEMsWUFBWSxDQUFDLFFBQVE7UUFDakIsSUFBSSxDQUFDLFlBQVksR0FBRyxRQUFRLENBQUM7UUFDN0IsSUFBSSxDQUFDLGFBQWEsR0FBRyxRQUFRLEtBQUssSUFBSSxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ3JELENBQUM7SUFFRCxrRUFBa0U7SUFDbEUsZUFBZSxDQUFDLFdBQXFCO1FBQ2pDLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztJQUNwRSxDQUFDO0lBRUQseUZBQXlGO0lBQ3pGLDBCQUEwQixDQUFDLFdBQXFCLEVBQUMsU0FBaUI7UUFDOUQsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFD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c0Q7SUFDdEQsa0JBQWtCO1FBQ2QsT0FBTyxJQUFJLENBQUMsWUFBWSxLQUFLLFNBQVMsQ0FBQztJQUMzQyxDQUFDO0lBRUQsNENBQTRDO0lBQzVDLHNCQUFzQjtRQUNsQixPQUFPLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUNuRCxDQUFDOztrRUFqSVEsU0FBUztpREFBVCxTQUFTLFdBQVQsU0FBUztrREFBVCxTQUFTO2NBRHJCLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFN1YmplY3QsIE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgQWNjb3VudFNlcnZpY2UgfSBmcm9tICcuLi9hY2NvdW50L2FjY291bnQuc2VydmljZSc7XHJcblxyXG4vKiogUHJpbmNpcGFsIHNlcnZpY2UqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBQcmluY2lwYWwge1xyXG4gICAgcHJpdmF0ZSB1c2VySWRlbnRpdHk6IGFueTtcclxuICAgIHByaXZhdGUgYXV0aGVudGljYXRlZCA9IGZhbHNlO1xyXG4gICAgcHJpdmF0ZSBhdXRoZW50aWNhdGlvblN0YXRlID0gbmV3IFN1YmplY3Q8YW55PigpO1xyXG5cclxuICAgIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgcHJpdmF0ZSBhY2NvdW50OiBBY2NvdW50U2VydmljZVxyXG4gICAgKSB7fVxyXG5cclxuICAgIC8qKiBhdXRoZW50aWNhdGUgd2l0aCBnaXZlbiBpZGVudGl0eSovXHJcbiAgICBhdXRoZW50aWNhdGUoaWRlbnRpdHkpIHtcclxuICAgICAgICB0aGlzLnVzZXJJZGVudGl0eSA9IGlkZW50aXR5O1xyXG4gICAgICAgIHRoaXMuYXV0aGVudGljYXRlZCA9IGlkZW50aXR5ICE9PSBudWxsO1xyXG4gICAgICAgIHRoaXMuYXV0aGVudGljYXRpb25TdGF0ZS5uZXh0KHRoaXMudXNlcklkZW50aXR5KTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogY2hlY2sgd2hldGhlciBjdXJyZW50IHVzZXIgaGFzIGFueSBvZiB0aGUgZ2l2ZW4gYXV0aG9yaXRpZXMgKi9cclxuICAgIGhhc0FueUF1dGhvcml0eShhdXRob3JpdGllczogc3RyaW5nW10pOiBQcm9taXNlPGJvb2xlYW4+IHtcclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuaGFzQW55QXV0aG9yaXR5RGlyZWN0KGF1dGhvcml0aWVzKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGNoZWNrIHdoZXRoZXIgY3VycmVudCB1c2VyIGhhcyBhbnkgb2YgdGhlIGdpdmVuIGF1dGhvcml0aWVzIG9uIHRoZSBnaXZlbiB0ZXJyaXRvcnkgKi9cclxuICAgIGhhc0FueUF1dGhvcml0eU9uVGVycml0b3J5KGF1dGhvcml0aWVzOiBzdHJpbmdbXSx0ZXJyaXRvcnk6IHN0cmluZyApOiBQcm9taXNlPGJvb2xlYW4+IHtcclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuaGFzQW55QXV0aG9yaXR5RGlyZWN0T25UZXJyaXRvcnkoYXV0aG9yaXRpZXMsdGVycml0b3J5KSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGNoZWNrIHdoZXRoZXIgY3VycmVudCB1c2VyIGhhcyBhbnkgb2YgdGhlIGdpdmVuIGF1dGhvcml0aWVzIHdpdGhvdXQgcmVzb2x2aW5nIHByb21pc2VzKi9cclxuICAgIGhhc0FueUF1dGhvcml0eURpcmVjdChhdXRob3JpdGllczogc3RyaW5nW10pOiBib29sZWFuIHtcclxuICAgICAgICBpZiAoIXRoaXMuYXV0aGVudGljYXRlZCB8fCAhdGhpcy51c2VySWRlbnRpdHkgfHwgIXRoaXMudXNlcklkZW50aXR5LmF1dGhvcml0aWVzKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXV0aG9yaXRpZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMudXNlcklkZW50aXR5LmF1dGhvcml0aWVzLmluY2x1ZGVzKGF1dGhvcml0aWVzW2ldKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogY2hlY2sgd2hldGhlciBjdXJyZW50IHVzZXIgaGFzIGFueSBvZiB0aGUgZ2l2ZW4gYXV0aG9yaXRpZXMgb24gdGhlIGdpdmVuIHRlcnJpdG9yeSB3aXRob3V0IHJlc29sdmluZyBwcm9taXNlcyAqL1xyXG4gICAgaGFzQW55QXV0aG9yaXR5RGlyZWN0T25UZXJyaXRvcnkoYXV0aG9yaXRpZXM6IHN0cmluZ1tdLHRlcnJpdG9yeTogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmF1dGhlbnRpY2F0ZWQgfHwgIXRoaXMudXNlcklkZW50aXR5IHx8ICF0aGlzLnVzZXJJZGVudGl0eS5hdXRob3JpdGllcykge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGF1dGhvcml0aWVzLmxlbmd0aDsgaSsrKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy51c2VySWRlbnRpdHkuYXV0aG9yaXRpZXNQZXJUZXJyaXRvcnlbdGVycml0b3J5XSAmJiB0aGlzLnVzZXJJZGVudGl0eS5hdXRob3JpdGllc1BlclRlcnJpdG9yeVt0ZXJyaXRvcnldLmluY2x1ZGVzKGF1dGhvcml0aWVzW2ldKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogY2hlY2sgd2hldGhlciBjdXJyZW50IHVzZXIgaGFzIHRoZSBnaXZlbiBhdXRob3JpdHkgKi9cclxuICAgIGhhc0F1dGhvcml0eShhdXRob3JpdHk6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj4ge1xyXG4gICAgICAgIGlmICghdGhpcy5hdXRoZW50aWNhdGVkKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShmYWxzZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5pZGVudGl0eSgpLnRoZW4oKGlkKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoaWQuYXV0aG9yaXRpZXMgJiYgaWQuYXV0aG9yaXRpZXMuaW5jbHVkZXMoYXV0aG9yaXR5KSk7XHJcbiAgICAgICAgfSwgKCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGZhbHNlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogY2hlY2sgd2hldGhlciBjdXJyZW50IHVzZXIgaGFzIHRoZSBnaXZlbiBhdXRob3JpdHkgb24gdGhlIGdpdmVuIHRlcnJpdG9yeSovXHJcbiAgICBoYXNBdXRob3JpdHlPblRlcnJpdG9yeShhdXRob3JpdHk6IHN0cmluZyx0ZXJyaXRvcnk6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj4ge1xyXG4gICAgICAgIGlmICghdGhpcy5hdXRoZW50aWNhdGVkKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShmYWxzZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5pZGVudGl0eSgpLnRoZW4oKGlkKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoaWQuYXV0aG9yaXRpZXNQZXJUZXJyaXRvcnkgJiYgaWQuYXV0aG9yaXRpZXNQZXJUZXJyaXRvcnlbdGVycml0b3J5XSAmJiBpZC5hdXRob3JpdGllc1BlclRlcnJpdG9yeVt0ZXJyaXRvcnldLmluY2x1ZGVzKGF1dGhvcml0eSkpO1xyXG4gICAgICAgIH0sICgpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShmYWxzZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGNoZWNrIHVzZXIgaWRlbnRpdHkqL1xyXG4gICAgaWRlbnRpdHkoZm9yY2U/OiBib29sZWFuKTogUHJvbWlzZTxhbnk+IHtcclxuICAgICAgICBpZiAoZm9yY2UgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgdGhpcy51c2VySWRlbnRpdHkgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBjaGVjayBhbmQgc2VlIGlmIHdlIGhhdmUgcmV0cmlldmVkIHRoZSB1c2VySWRlbnRpdHkgZGF0YSBmcm9tIHRoZSBzZXJ2ZXIuXHJcbiAgICAgICAgLy8gaWYgd2UgaGF2ZSwgcmV1c2UgaXQgYnkgaW1tZWRpYXRlbHkgcmVzb2x2aW5nXHJcbiAgICAgICAgaWYgKHRoaXMudXNlcklkZW50aXR5KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy51c2VySWRlbnRpdHkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gcmV0cmlldmUgdGhlIHVzZXJJZGVudGl0eSBkYXRhIGZyb20gdGhlIHNlcnZlciwgdXBkYXRlIHRoZSBpZGVudGl0eSBvYmplY3QsIGFuZCB0aGVuIHJlc29sdmUuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYWNjb3VudC5nZXQoKS50b1Byb21pc2UoKS50aGVuKChyZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBhY2NvdW50ID0gcmVzcG9uc2U7XHJcbiAgICAgICAgICAgIGlmIChhY2NvdW50KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVzZXJJZGVudGl0eSA9IGFjY291bnQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmF1dGhlbnRpY2F0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy51c2VySWRlbnRpdHkgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hdXRoZW50aWNhdGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5hdXRoZW50aWNhdGlvblN0YXRlLm5leHQodGhpcy51c2VySWRlbnRpdHkpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy51c2VySWRlbnRpdHk7XHJcbiAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnVzZXJJZGVudGl0eSA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMuYXV0aGVudGljYXRlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLmF1dGhlbnRpY2F0aW9uU3RhdGUubmV4dCh0aGlzLnVzZXJJZGVudGl0eSk7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBjaGVjayB3aGV0aGVyIGN1cnJlbnQgdXNlciBpcyBhdXRoZW50aWNhdGVkICovXHJcbiAgICBpc0F1dGhlbnRpY2F0ZWQoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXV0aGVudGljYXRlZDtcclxuICAgIH1cclxuXHJcbiAgICAvKiogY2hlY2sgd2hldGhlciBjdXJyZW50IHVzZXIgaWRlbnRpdHkgaXMgcmVzb2x2ZWQgKi9cclxuICAgIGlzSWRlbnRpdHlSZXNvbHZlZCgpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpcy51c2VySWRlbnRpdHkgIT09IHVuZGVmaW5lZDtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZ2V0IGN1cnJlbnQgdXNlciBhdXRoZW50aWNhdGlvbiBzdGF0ZSAqL1xyXG4gICAgZ2V0QXV0aGVudGljYXRpb25TdGF0ZSgpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmF1dGhlbnRpY2F0aW9uU3RhdGUuYXNPYnNlcnZhYmxlKCk7XHJcbiAgICB9XHJcblxyXG5cclxufVxyXG4iXX0=