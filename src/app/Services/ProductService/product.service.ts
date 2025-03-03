import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Product } from '../../Models/product.model';
import { environment } from '../../../environments/environment';
import { jwtDecode } from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { AuthService } from '../Auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private BackEndApi = environment.productsApiUrl;
  private productsSubject = new BehaviorSubject<{ content: Product[], totalElements: number, totalPages: number }>({
    content: [],
    totalElements: 0,
    totalPages: 0
  });
  products$ = this.productsSubject.asObservable();

  constructor(private http: HttpClient,private authService:AuthService) {}

  loadProducts(page: number = 0, size: number = 5, sortBy: string = 'name', direction: string = 'asc', search: string = ''): void {
    const params = `?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}${search ? `&keyword=${search}` : ''}`;

    this.http.get<{ content: Product[], totalElements: number, totalPages: number }>(`${this.BackEndApi}/all${params}`)
      .subscribe({
        next: (response) => this.productsSubject.next(response),
        error: (err) =>{  this.authService.logout();
          console.error('Failed to load products', err)
        }
      });
  }

  searchProducts(keyword: string, page: number, size: number, sortBy: string, direction: string): Observable<any> {
    return this.http.get<any>(`${this.BackEndApi}/search`, {
      params: { keyword, page, size, sortBy, direction }
    });
  }

  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`${this.BackEndApi}/create`, product).pipe(
      tap(() => this.loadProducts())
    );
  }

  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.BackEndApi}/${id}`, product).pipe(
      tap(updatedProduct => {
        const current =this.productsSubject.getValue();
        const updatedContent = current.content.map(p=>
        p.id === id ? updatedProduct:p
       )

       this.productsSubject.next({
        ...current,
        content: updatedContent
       });
      })
    );
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.BackEndApi}/${id}`).pipe(
      tap(() => {
        const current = this.productsSubject.getValue();
        const updatedContent = current.content.filter(p => p.id !== id);
        const updatedTotal = current.totalElements - 1;
        const updatedTotalPages = Math.ceil(updatedTotal / 5);

        const newPage = updatedContent.length === 0 && updatedTotalPages > 0 ? updatedTotalPages - 1 : updatedTotalPages;

        this.productsSubject.next({
          content: updatedContent,
          totalElements: updatedTotal,
          totalPages: newPage
        });

        if (updatedContent.length === 0 && updatedTotalPages > 0) {
          this.loadProducts(newPage, 5);
        }
      })
    );
  }
}
