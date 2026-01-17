import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';

import {AuthService} from '@app/core/auth/auth.service';

/** Functional guard to protect authenticated routes */
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const token = auth.getToken();
  if (token) {
    return true;
  }

  return router.createUrlTree(['/login']);
};


