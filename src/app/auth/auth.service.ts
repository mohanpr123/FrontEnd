import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './user.model';
import { JwtResponse } from './jwt-response.model';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private BackEndUrl = 'http://localhost:8080';

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  login(user: User): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(`${this.BackEndUrl}/login`, user);
  }

  register(user: User): Observable<any> {
    return this.http.post<any>(`${this.BackEndUrl}/signup`, user);
  }

  storeToken(token: string) {
    this.cookieService.set('jwt', token);
  }

  getToken(): string {
    return this.cookieService.get('jwt');
  }

  clearToken(): void {
    this.cookieService.delete('jwt', '/');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
