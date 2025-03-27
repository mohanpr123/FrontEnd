import { Injectable } from '@angular/core';
import { ProductQuery,Product } from '../../types/product.type';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpWrapperService } from '../PublicServices/http-wrapper.service';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private BackEndApi = environment.productsApiUrl;

  constructor(private http: HttpWrapperService) { }

  loadProducts(query: ProductQuery): Observable<{ content: Product[]; totalElements: number; totalPages?: number }> {
    let params = new HttpParams()
      .set('page', query.pageIndex.toString())
      .set('size', query.pageSize.toString())
      .set('sortBy', query.sortBy)
      .set('direction', query.sortDirection);

    if (query.searchKeyword) {
      params = params.set('keyword', query.searchKeyword);
    }

    return this.http.get<{ content: Product[]; totalElements: number; totalPages?: number }>(
      `${this.BackEndApi}/all`, params);
  }


  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`${this.BackEndApi}/create`, product);
  }

  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.BackEndApi}/${id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.BackEndApi}/${id}`);
  }
}
