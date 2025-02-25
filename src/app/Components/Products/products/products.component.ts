import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProductDialogComponent } from '../product-dialog/product-dialog.component';
import { ProductService } from '../../../Services/ProductService/product.service';
import { Product } from '../../../Models/product.model';
import { Subscription } from 'rxjs';
import { SnackbarService } from '../../../Services/PublicServices/snackbar.service';
import { HttpClient } from '@angular/common/http';
import { ConfirmDeleteDialogComponent } from '../confirm-delete-dialog/confirm-delete-dialog.component';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatDialogModule,MatPaginatorModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  products: Product[] = []; // Holds the current page of products
  displayedColumns: string[] = ['name', 'quantity', 'price', 'supplier', 'actions'];
  private productSub!: Subscription;

  // Pagination properties
  totalItems: number = 0;
  pageSize: number = 5;
  pageIndex: number = 0; // Current page number

  constructor(
    private http: HttpClient,
    private productService: ProductService,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
  ) { }

  // Loading paginated products
  loadProducts(): void {
    this.productService.loadProducts(this.pageIndex, this.pageSize); // understandigg :Passing current page and size
  }


  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex; //  1.) Updateing current page
    this.pageSize = event.pageSize; // 2.) Update page size (if changed)
    this.loadProducts();
  }

  ngOnInit(): void {
    // Subscribing to paginated products
    this.productSub = this.productService.getAllProducts().subscribe(data => {
      this.products = data.content; //  'content' from the paginated response
      this.totalItems = data.totalElements; // Updating total items for pagination...
    });

    this.loadProducts(); // Initial load
  }


  deleteProduct(id: number): void {
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.snackbarService.showMessage("Deletion success", "OK", 3000);
        this.loadProducts(); // Refresh the product list after deletion
      },
      error: (err) => {
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
      if (result === true) {
        this.deleteProduct(id);
      }
    });
  }

  openDialog(product?: Product): void {
    const dialogRef = this.dialog.open(ProductDialogComponent, {
      width: '270px',
      data: product ? { ...product } : null
    });
    dialogRef.afterClosed().subscribe((result: Product) => {
      if (result) {
        if (product) {
          this.productService.updateProduct(result.id, result).subscribe({
            next: () => {
              this.snackbarService.showMessage("Updation success", "OK", 3000);
              this.loadProducts();
            },
            error: () => {
              this.snackbarService.showMessage("Updation failed", "OK", 3000);
            }
          });
        } else {
          this.productService.createProduct(result).subscribe({
            next: () => {
              this.snackbarService.showMessage("Product created", "OK", 3000);
              this.loadProducts(); 
            },
            error: () => {
              this.snackbarService.showMessage("Creation Failed", "OK", 3000);
            }
          });
        }
      }
    });
  }
}
