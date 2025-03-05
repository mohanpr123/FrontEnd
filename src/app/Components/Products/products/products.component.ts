import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Subject, debounceTime, catchError, of, tap } from 'rxjs';
import { Product } from '../../../types/app.type';
import { ProductService } from '../../../Services/ProductService/product.service';
import { SnackbarService } from '../../../Services/PublicServices/snackbar.service';
import { ProductDialogComponent } from '../product-dialog/product-dialog.component';
import { ConfirmDeleteDialogComponent } from '../confirm-delete-dialog/confirm-delete-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MESSAGE } from '../../../Constants/app.constants';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, Sort } from '@angular/material/sort';
import { ProductQuery } from '../../../types/app.type';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    MatPaginatorModule,
    MatSortModule
  ],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent {
  products: Product[] = [];
  DISPLAYED_COLUMNS = ['name', 'quantity', 'price', 'supplier', 'actions'];
  totalItems = 0;
  private searchSubject = new Subject<string>();

  pageIndex = 0;
  pageSize = 5;
  sortBy = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';
  searchKeyword = '';

  constructor(
    private productService: ProductService,
    private dialog: MatDialog,
    private snackbarService: SnackbarService
  ) {
    this.searchSubject.pipe(debounceTime(300)).subscribe((word) => {
      this.searchKeyword = word.trim();
      this.loadProducts();
    });
    this.loadProducts();
  }

  loadProducts(): void {
    const QUERY: ProductQuery = {
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      sortBy: this.sortBy,
      sortDirection: this.sortDirection,
      searchKeyword: this.searchKeyword
    };

    this.productService
      .loadProducts(QUERY)
      .pipe(
        tap(response => {
          this.products = response.content;
          this.totalItems = response.totalElements;
        })
      )
      .subscribe();
  }


  onPageChange({ pageIndex, pageSize }: PageEvent): void {
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.loadProducts();
  }

  toggleSort(column: string): void {
    if (this.sortBy === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = column;
      this.sortDirection = 'asc';
    }
    this.pageIndex = 0;
    this.loadProducts();
  }

  onSearchChange(event: Event): void {
    this.searchSubject.next((event.target as HTMLInputElement).value);
  }

  confirmDelete(id: number): void {
    this.dialog
      .open(ConfirmDeleteDialogComponent, { width: '250px', data: { productId: id } })
      .afterClosed()
      .pipe(tap((result) => result && this.deleteProduct(id)))
      .subscribe();
  }

  deleteProduct(id: number): void {
    this.productService
      .deleteProduct(id)
      .pipe(
        tap(() => {
          this.products = this.products.filter((data) => data.id !== id);
          this.snackbarService.showMessage(this.products.length ? MESSAGE.DELETEOK : 'No products found. Add Products');
        }),
        catchError(() => {
          this.snackbarService.showMessage(MESSAGE.BADRESPONSE);
          return of();
        })
      )
      .subscribe();
  }

  openDialog(product?: Product): void {
    this.dialog
      .open(ProductDialogComponent, { width: '400px', data: product ? { ...product } : null })
      .afterClosed()
      .pipe(
        tap((result) => {
          this.snackbarService.showMessage(result.action === 'add' ? MESSAGE.CREATEOK : MESSAGE.UPDATEOK);
          this.loadProducts();
        }),
        catchError(()=>{
          this.snackbarService.showMessage(MESSAGE.BADRESPONSE);
          return of();
        })
      )
      .subscribe();
  }
}
