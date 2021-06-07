import { Observable } from 'rxjs';
import { AccountService } from '../account/account.service';
/** Principal service*/
export declare class Principal {
    private account;
    private userIdentity;
    private authenticated;
    private authenticationState;
    /** constructor */
    constructor(account: AccountService);
    /** authenticate with given identity*/
    authenticate(identity: any): void;
    /** check whether current user has any of the given authorities */
    hasAnyAuthority(authorities: string[]): Promise<boolean>;
    /** check whether current user has any of the given authorities on the given territory */
    hasAnyAuthorityOnTerritory(authorities: string[], territory: string): Promise<boolean>;
    /** check whether current user has any of the given authorities without resolving promises*/
    hasAnyAuthorityDirect(authorities: string[]): boolean;
    /** check whether current user has any of the given authorities on the given territory without resolving promises */
    hasAnyAuthorityDirectOnTerritory(authorities: string[], territory: string): boolean;
    /** check whether current user has the given authority */
    hasAuthority(authority: string): Promise<boolean>;
    /** check whether current user has the given authority on the given territory*/
    hasAuthorityOnTerritory(authority: string, territory: string): Promise<boolean>;
    /** check user identity*/
    identity(force?: boolean): Promise<any>;
    /** check whether current user is authenticated */
    isAuthenticated(): boolean;
    /** check whether current user identity is resolved */
    isIdentityResolved(): boolean;
    /** get current user authentication state */
    getAuthenticationState(): Observable<any>;
}
