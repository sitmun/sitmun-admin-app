import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';

import { Principal } from '@app/core/auth/principal.service';

import { authGuard } from './auth.guard';

describe('authGuard', () => {
  let principal: jest.Mocked<Pick<Principal, 'identity' | 'isAuthenticated'>>;
  let router: jest.Mocked<Pick<Router, 'createUrlTree'>>;

  beforeEach(() => {
    principal = {
      identity: jest.fn(),
      isAuthenticated: jest.fn(),
    };
    router = {
      createUrlTree: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: Principal, useValue: principal },
        { provide: Router, useValue: router },
      ],
    });
  });

  it('should force backend identity revalidation before allowing access', async () => {
    principal.identity.mockResolvedValue({ username: 'admin', administrator: true });

    const result = await TestBed.runInInjectionContext(() => authGuard({} as never, {} as never));

    expect(principal.identity).toHaveBeenCalledWith(true);
    expect(result).toBe(true);
  });

  it('should redirect to login when account is not an administrator', async () => {
    const loginUrlTree = {} as UrlTree;
    principal.identity.mockResolvedValue({ username: 'viewer', administrator: false });
    router.createUrlTree.mockReturnValue(loginUrlTree);

    const result = await TestBed.runInInjectionContext(() => authGuard({} as never, {} as never));

    expect(router.createUrlTree).toHaveBeenCalledWith(['/login']);
    expect(result).toBe(loginUrlTree);
  });

  it('should redirect to login when ROLE_ADMIN is only present in authorities', async () => {
    const loginUrlTree = {} as UrlTree;
    principal.identity.mockResolvedValue({ username: 'admin', authorities: ['ROLE_ADMIN'] });
    router.createUrlTree.mockReturnValue(loginUrlTree);

    const result = await TestBed.runInInjectionContext(() => authGuard({} as never, {} as never));

    expect(router.createUrlTree).toHaveBeenCalledWith(['/login']);
    expect(result).toBe(loginUrlTree);
  });

  it('should redirect to login when identity is missing and session is not authenticated', async () => {
    const loginUrlTree = {} as UrlTree;
    principal.identity.mockResolvedValue(null);
    principal.isAuthenticated.mockReturnValue(false);
    router.createUrlTree.mockReturnValue(loginUrlTree);

    const result = await TestBed.runInInjectionContext(() => authGuard({} as never, {} as never));

    expect(principal.identity).toHaveBeenCalledWith(true);
    expect(router.createUrlTree).toHaveBeenCalledWith(['/login']);
    expect(result).toBe(loginUrlTree);
  });

  it('should allow navigation when identity fetch fails but session remains authenticated', async () => {
    principal.identity.mockResolvedValue(null);
    principal.isAuthenticated.mockReturnValue(true);

    const result = await TestBed.runInInjectionContext(() => authGuard({} as never, {} as never));

    expect(result).toBe(true);
    expect(router.createUrlTree).not.toHaveBeenCalled();
  });
});
