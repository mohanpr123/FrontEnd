import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User, JwtResponse, resetPassword, ResetResponse } from '../../types/user.type';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { HttpWrapperService } from '../PublicServices/http-wrapper.service';
import { environment } from '../../../environments/environment';
import { ROUTES } from '../../Constants/app.constants';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private BackEndUrl = environment.authApiUrl;
  public username = '';

  constructor(
    private http: HttpWrapperService,
    private cookieService: CookieService,
    private router: Router
  ) { }

  login(user: User): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(`${this.BackEndUrl}/${ROUTES.LOGIN}`, user).pipe(
      tap(({ jwt }) => {
        if (jwt) this.storeToken(jwt);
      })
    );
  }

  register(user: User): Observable<User> {
    return this.http.post<User>(`${this.BackEndUrl}/signup`, user);
  }

  resetPassword(request: resetPassword): Observable<ResetResponse> {
    return this.http.post<ResetResponse>(`${this.BackEndUrl}/${ROUTES.RESET_PASSWORD}`, request);
  }

  storeToken(token: string): void {
    this.cookieService.set('jwt', token, 1, '/');
  }

  storeUsername(username: string): void {
    this.username = username;
  }

  getUsername(): string {
    return this.username;
  }

  getToken(): string {
    return this.cookieService.get('jwt');
  }

  clearToken(): void {
    this.cookieService.delete('jwt', '/');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    this.cookieService.deleteAll('/');
    this.clearToken();
    this.router.navigate([ROUTES.LOGIN]);
  }
}
