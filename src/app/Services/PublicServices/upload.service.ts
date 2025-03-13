import { Injectable } from '@angular/core';
import { HttpWrapperService } from './http-wrapper.service';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private http:HttpWrapperService) { }

  uploadProfileImage(file: File): Observable<number> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ imageId: number }>(`${environment.authApiUrl}/upload`, formData,).pipe(
      map((response) => response.imageId)
    );
  }

  getProfileImage(): Observable<string> {
    return this.http.getJpegImage(`${environment.authApiUrl}/profile-image`)
      .pipe(map((blob: Blob) => URL.createObjectURL(blob)));
  }

}
