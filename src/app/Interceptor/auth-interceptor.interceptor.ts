import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ROUTES } from '../Constants/app.constants';

export const authInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.includes(ROUTES.LOGIN) || req.url.includes(ROUTES.REGISTER) || req.url.includes(ROUTES.RESET_PASSWORD)) {
    return next(req);
  }

  const cookieService = inject(CookieService);

  if (cookieService.get('jwt')) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${cookieService.get('jwt')}`
        }
      });
  }
  return next(req);
};
