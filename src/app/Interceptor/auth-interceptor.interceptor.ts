import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import {jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { of } from 'rxjs';

export const authInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.includes('/login') || req.url.includes('/signup') || req.url.includes('/reset-password')) {
    return next(req);
  }

  const cookieService = inject(CookieService);
  const token = cookieService.get('jwt');
  const  router= inject(Router);

  if (token) {

    try{

      const decodedToken:number = jwtDecode(token);

      const time= Date.now()/1000;
      if(decodedToken<time)
      {
        cookieService.delete('jwt');
        router.navigate(['/login']);
        return of();
      }

    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  catch(error){
    console.error('Invalid Token: '+error);
    cookieService.delete('jwt');
    router.navigate(['/login']);
    return of();
  }
  }

  return next(req);
};
