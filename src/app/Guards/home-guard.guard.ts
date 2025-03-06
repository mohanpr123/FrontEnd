import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../Services/Auth/auth.service';
import { ROUTES } from '../Constants/app.constants';

export const homeGuard: CanActivateFn = () => {

  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.getToken()) router.navigate([ROUTES.PRODUCTS]);

  return !authService.getToken();;
};
