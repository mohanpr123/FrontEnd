import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from '../../Models/user.model';
import { JwtResponse } from '../../Models/jwt-response.model';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { ResetPasswordComponent } from '../../Components/Auth/reset-password/reset-password.component';
import { resetPassword } from '../../Models/ResetPassword.model';
import { ResetResponse } from '../../Models/ResetResponse.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private BackEndUrl = 'http://localhost:8080';

  private tokenSubject: BehaviorSubject<string | null>;
  private userLoggedInSubject = new BehaviorSubject<boolean>(false); // Renamed for clarity
  public userLoggedIn$: Observable<boolean> = this.userLoggedInSubject.asObservable(); // Exposed as Observable

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private router:Router
  ) {
    this.tokenSubject = new BehaviorSubject<string | null>(this.getToken());
    this.userLoggedInSubject.next(!!this.getToken()); // Initialize based on existing token
  }

  login(user: User): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(`${this.BackEndUrl}/login`, user).pipe(
      tap((response: JwtResponse) => {
        const token = response.jwt;
        if (token) {
          this.clearToken();
          this.storeToken(token);
          this.userLoggedInSubject.next(true); // Signal login
        }
      })
    );
  }

  register(user: User): Observable<User> {
    return this.http.post<User>(`${this.BackEndUrl}/signup`, user);
  }

  resetPassword(request: resetPassword): Observable<ResetResponse>
  {
    return this.http.post<ResetResponse>(`${this.BackEndUrl}/reset-password`,request);
  }


  storeToken(token: string): void {
    this.cookieService.set('jwt', token, 1, '/');
    this.tokenSubject.next(token);
  }

  getToken(): string {
    return this.cookieService.get('jwt');
  }

  clearToken(): void {
    this.cookieService.delete('jwt', '/');
    this.tokenSubject.next(null);
    this.userLoggedInSubject.next(false);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    this.cookieService.deleteAll('/');
    this.clearToken();
    this.router.navigate(['/login']);
  }

}
