import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Product } from '../../Models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private BackEndApi = 'http://localhost:8080/api/products';
  private productsSubject = new BehaviorSubject<{ content: Product[], totalElements: number, totalPages: number }>({
    content: [],
    totalElements: 0,
    totalPages: 0
  });
  products$ = this.productsSubject.asObservable();

  constructor(private http: HttpClient) { }

  // 1.) Loading paginated products from the backend
  loadProducts(page: number = 0, size: number = 5): void {
    this.http.get<{ content: Product[], totalElements: number, totalPages: number }>(
      `${this.BackEndApi}/all?page=${page}&size=${size}`
    ).subscribe({
      next: (response) => this.productsSubject.next(response),
      error: (err) => console.error('Failed to load products', err)
    });
  }

  // Get all products (paginated)
  getAllProducts(): Observable<{ content: Product[], totalElements: number, totalPages: number }> {
    return this.products$;
  }

  // Create
  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`${this.BackEndApi}/create`, product).pipe(
      tap(newProduct => {
        const current = this.productsSubject.getValue();
        this.productsSubject.next({
          content: [...current.content, newProduct],
          totalElements: current.totalElements + 1,
          totalPages: Math.ceil((current.totalElements + 1) / 5)
        });
      })
    );
  }

  // Update
  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.BackEndApi}/${id}`, product).pipe(
      tap(updatedProduct => {
        const current = this.productsSubject.getValue();
        const index = current.content.findIndex(p => p.id === id);
        if (index > -1) {
          current.content[index] = updatedProduct;
          this.productsSubject.next({ ...current });
        }
      })
    );
  }

  // Delete
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.BackEndApi}/${id}`).pipe(
      tap(() => {
        const current = this.productsSubject.getValue();
        this.productsSubject.next({
          content: current.content.filter(p => p.id !== id),
          totalElements: current.totalElements - 1,
          totalPages: Math.ceil((current.totalElements - 1) / 5)
        });
      })
    );
  }

  // Get total number of elements
  getTotalElements(): number {
    return this.productsSubject.getValue().totalElements;
  }

  // Get total number of pages (default size 5)
  getTotalPages(size: number = 5): number {
    const total = this.getTotalElements();
    return Math.ceil(total / size);
  }
}
