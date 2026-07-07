import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';

import {Principal} from '@app/core/auth/principal.service';

/** Whether the resolved account may access the admin shell. */
export function isAdminAccount(identity: { administrator?: boolean } | null | undefined): boolean {
  return identity?.administrator === true;
}

/** Functional guard to protect authenticated admin routes */
export const authGuard: CanActivateFn = async () => {
  const principal = inject(Principal);
  const router = inject(Router);

  const identity = await principal.identity(true);

  if (identity) {
    if (isAdminAccount(identity)) {
      return true;
    }
    return router.createUrlTree(['/login']);
  }

  // Transient identity fetch failure: keep session if still considered authenticated.
  if (principal.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/login']);
};
