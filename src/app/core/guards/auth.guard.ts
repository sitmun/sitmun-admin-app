import {CanActivateFn, Router} from '@angular/router';
import {AuthService} from '@app/core/auth/auth.service';
import {inject} from '@angular/core';

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


