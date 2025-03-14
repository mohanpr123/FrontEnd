import { Injectable } from '@angular/core';
import { HttpWrapperService } from './http-wrapper.service';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private http:HttpWrapperService) { }

  uploadProfileImage(file: File): Observable<void> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${environment.authApiUrl}/upload`, formData,)
  }

  getProfileImage(): Observable<string> {
    return this.http.get<{imageUrl:string}>(`${environment.authApiUrl}/profile-image`).pipe(
      map((response) => response.imageUrl)
    )
  }

}
