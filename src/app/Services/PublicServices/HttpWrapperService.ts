import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HttpWrapperService {
  constructor(private http: HttpClient) {}

  private setHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }

  get<T>(url: string, params?: HttpParams): Observable<T> {
    const headers = this.setHeaders();
    return this.http
      .get<T>(url, { headers, params })
      .pipe(catchError(this.handleError));
  }

  post<T>(url: string, body: any): Observable<T> {
    const headers = this.setHeaders();
    return this.http
      .post<T>(url, body, { headers })
      .pipe(catchError(this.handleError));
  }

  put<T>(url: string, body: any): Observable<T> {
    const headers = this.setHeaders();
    return this.http
      .put<T>(url, body, { headers })
      .pipe(catchError(this.handleError));
  }

  delete<T>(url: string): Observable<T> {
    const headers = this.setHeaders();
    return this.http
      .delete<T>(url, { headers })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('HTTP Error:', error);
    return throwError(() => new Error('Something went wrong'));
  }
}
