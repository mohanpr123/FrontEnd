import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { ROUTES } from '../../Constants/app.constants';

@Injectable({
  providedIn: 'root',
})
export class HttpWrapperService {
  constructor(private http: HttpClient, private cookieService: CookieService) {}

  private setHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const token = this.cookieService.get('jwt');
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  private skipAuth(url: string): boolean {
    return (
      url.includes(ROUTES.LOGIN) ||
      url.includes(ROUTES.REGISTER) ||
      url.includes(ROUTES.RESET_PASSWORD)
    );
  }

  get<T>(url: string, params?: HttpParams): Observable<T> {
    const headers = this.skipAuth(url) ? new HttpHeaders() : this.setHeaders();
    return this.http
      .get<T>(url, { headers, params })
      .pipe(catchError(this.handleError));
  }

  post<T>(url: string, body: any): Observable<T> {
    const headers = this.skipAuth(url) ? new HttpHeaders() : this.setHeaders();
    return this.http
      .post<T>(url, body, { headers })
      .pipe(catchError(this.handleError));
  }

  put<T>(url: string, body: any): Observable<T> {
    const headers = this.skipAuth(url) ? new HttpHeaders() : this.setHeaders();
    return this.http
      .put<T>(url, body, { headers })
      .pipe(catchError(this.handleError));
  }

  delete<T>(url: string): Observable<T> {
    const headers = this.skipAuth(url) ? new HttpHeaders() : this.setHeaders();
    return this.http
      .delete<T>(url, { headers })
      .pipe(catchError(this.handleError));
  }



  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('HTTP Error:', error);
    return throwError(() => new Error('Something went wrong'));
  }
}
