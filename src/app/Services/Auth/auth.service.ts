import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User, JwtResponse, resetPassword, ResetResponse } from '../../types/user.type';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { HttpWrapperService } from '../PublicServices/http-wrapper.service';
import { environment } from '../../../environments/environment';
import { ROUTES } from '../../constants/app.constants';

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
    return this.http.post<JwtResponse>(`${this.BackEndUrl}/${ROUTES.LOGIN}`, user)
  }

  register(user: User): Observable<User> {
    return this.http.post<User>(`${this.BackEndUrl}/register`, user);
  }

  resetPassword(request: resetPassword): Observable<ResetResponse> {
    return this.http.post<ResetResponse>(`${this.BackEndUrl}/${ROUTES.RESET_PASSWORD}`, request);
  }

  storeToken(token: string): void {
    this.cookieService.set('jwt', token, 1, '/');
  }

  storeUsername(username: string): void {
    this.username = username;
    this.cookieService.set('username',username,1,'/')
  }

  getUsername(): string {
    return this.cookieService.get('username');
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
