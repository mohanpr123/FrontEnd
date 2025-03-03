import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProductDialogComponent } from '../product-dialog/product-dialog.component';
import { ProductService } from '../../../Services/ProductService/product.service';
import { Product } from '../../../Models/product.model';
import { Subscription } from 'rxjs';
import { SnackbarService } from '../../../Services/PublicServices/snackbar.service';
import { ConfirmDeleteDialogComponent } from '../confirm-delete-dialog/confirm-delete-dialog.component';
import { PageEvent } from '@angular/material/paginator';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { tap, catchError, of } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatPaginatorModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  displayedColumns: string[] = ['name', 'quantity', 'price', 'supplier', 'actions'];
  private productSub!: Subscription;

  totalItems = 0;
  pageSize = 5;
  pageIndex = 0;
  sortBy = 'name'; // Default sort column
  sortDirection: 'asc' | 'desc' = 'asc'; // Default direction
  searchKeyword = '';

  private searchTimeout!: any;
  msg!: string;

  constructor(
    private productService: ProductService,
    private dialog: MatDialog,
    private snackbarService: SnackbarService
  ) {}

  loadProducts(): void {
    this.productService.loadProducts(this.pageIndex, this.pageSize, this.sortBy, this.sortDirection, this.searchKeyword);
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
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
    const inputElement = event.target as HTMLInputElement;
    if (inputElement) {
      this.searchKeyword = inputElement.value.trim();

      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }

      this.searchTimeout = setTimeout(() => {
        this.pageIndex = 0;
        this.productService
          .searchProducts(this.searchKeyword, this.pageIndex, this.pageSize, this.sortBy, this.sortDirection)
          .pipe(
            tap(response => {
              if (response.content.length === 0) {
                this.snackbarService.showMessage("No products found", "Ok", 3000);
              }
              this.products = response.content;
              this.totalItems = response.totalElements;
            }),
            catchError(error => {
              console.error('Search failed', error);
              return of();
            })
          )
          .subscribe();
      }, 300);
    }
  }

  ngOnInit(): void {
    this.productSub = this.productService.products$.subscribe(data => {
      this.products = data.content;
      this.totalItems = data.totalElements;
    });
    this.loadProducts();
  }

  ngOnDestroy(): void {
    if (this.productSub) this.productSub.unsubscribe();
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
  }

  deleteProduct(id: number): void {
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.snackbarService.showMessage("Deletion success", "OK", 3000);
        this.products = this.products.filter(product => product.id !== id);
        this.totalItems = this.products.length;
        if (this.totalItems === 0) {
          this.msg = "No products found. Add Products";
        }
      },
      error: () => {
        this.snackbarService.showMessage("Deletion failed", "OK", 3000);
      }
    });
  }

  confirmDelete(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '250px',
      data: { productId: id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteProduct(id);
      }
    });
  }

  openDialog(product?: Product): void {
    const dialogRef = this.dialog.open(ProductDialogComponent, {
      width: '400px',
      data: product ? { ...product } : null
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.action === 'add') {
          this.snackbarService.showMessage("Product created successfully", "OK", 3000);
          this.loadProducts();
        }
        if (result.action === 'edit') {
          this.snackbarService.showMessage("Updation success", "OK", 3000);
          this.products = this.products.map(p => p.id === result.product.id ? result.product : p);
        }
      }
    });
  }
}
