import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs-compat';
import {ResourceService} from '../angular-hal/src/lib/resource.service';
//import * as moment from 'moment';

/** Authentication service*/
@Injectable()
export class AuthService {
    
  /** API resource path */
  public AUTH_API = 'authenticate';

    /** constructor*/
    constructor(
        private http: HttpClient,
        private resourceService: ResourceService
    ) {}
    
    /** get current user jwt token from session storage*/
    getToken() {
        return  sessionStorage.getItem('authenticationToken');
    }

    /** login operation */
    login(credentials): Observable<any> {

        const data = {
            username: credentials.username,
            password: credentials.password
        };
        return this.http.post(this.resourceService.getResourceUrl(this.AUTH_API), data, {observe : 'response'}).map(authenticateSuccess.bind(this));

        function authenticateSuccess(resp) {
            if (resp.ok) {
                const jwt = resp.body.id_token;
                this.storeAuthenticationToken(jwt);
                //const expiresAt = moment().add( resp.headers.get('Token-Validity'),'milisecond');
                //sessionStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
                return jwt;
            }                    
        }
    }
    
    /** login operation with jwt token */
    loginWithToken(jwt) {
        if (jwt) {
            this.storeAuthenticationToken(jwt);
            return Promise.resolve(jwt);
        } else {
            return Promise.reject('auth-jwt-service Promise reject'); // Put appropriate error message here
        }
    }

    /** store jwt token in session storage*/
    storeAuthenticationToken(jwt) {
       sessionStorage.setItem('authenticationToken', jwt);
        
    }
    
    /** check whether current user is logged in*/
    public isLoggedIn() {
        //return moment().isBefore(this.getExpiration());
        return this.getToken();
    }
    
    /** check whether current user is logged out*/
    isLoggedOut() {
        return !this.isLoggedIn();
    }

    /** logout operation */
    logout(): Observable<any> {

        return new Observable((observer) => {
            //localStorage.removeItem('authenticationToken');
            sessionStorage.removeItem('authenticationToken');
            //sessionStorage.removeItem('expires_at');
            observer.complete();
        });
    }


    
}
