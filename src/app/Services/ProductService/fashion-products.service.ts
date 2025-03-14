import { Injectable } from '@angular/core';
import { HttpWrapperService } from '../PublicServices/http-wrapper.service';
import { HttpParams } from '@angular/common/http';
import { FashionProducts } from '../../types/product.type';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class FashionProductsService {

  private url=environment.url;

  constructor(private http:HttpWrapperService) { }

  getProducts(page: number, size: number): Observable<{ content: FashionProducts[] }> {
    const params = new HttpParams()
    .set('page', page.toString())
    .set('size', size.toString());
    return this.http.get<{ content: FashionProducts[] }>(this.url,params);
  }
}
