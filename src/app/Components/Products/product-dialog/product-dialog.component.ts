import { Component, Inject, computed, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Product } from '../../../Models/product.model';
import { ProductService } from '../../../Services/ProductService/product.service';
import { SnackbarService } from '../../../Services/PublicServices/snackbar.service';
import { NoSpacesValidatorDirective } from '../../../Services/PublicServices/no-spaces.validator';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CommonModule
  ],
  templateUrl: './product-dialog.component.html',
  styleUrls: ['./product-dialog.component.css'],
})
export class ProductDialogComponent {
  productForm: FormGroup;

  isEdit = computed(() => !!this.data?.id);

  constructor(
    private snackbarService: SnackbarService,
    private productService: ProductService,
    public dialogRef: MatDialogRef<ProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Product | null,
    private fb: FormBuilder
  ) {
    this.productForm = this.fb.group({
      id: [data?.id ?? null],
      name: [data?.name ?? '', [Validators.required,]],
      quantity: [data?.quantity ?? 1, [Validators.required, Validators.min(1)]],
      price: [data?.price ?? 0.0, [Validators.required, Validators.min(0)]],
      supplier: [data?.supplier ?? '', [Validators.required, NoSpacesValidatorDirective.noSpacesValidator()]]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.productForm.valid) {
      const productData = this.productForm.value;
      productData.name = productData.name.trim();
      productData.supplier = productData.supplier.trim();

      if (this.data?.id) {
        this.productService.updateProduct(productData.id, productData).subscribe({
          next: () => {
            this.dialogRef.close({ action: 'edit', product: productData });
          },
          error: () => {
            this.snackbarService.showMessage('Failed to update product', 'OK', 3000);
          }
        });
      } else {
        this.productService.createProduct(productData).subscribe({
          next: () => {
            this.dialogRef.close({ action: 'add', product: productData });
          },
          error: () => {
            this.snackbarService.showMessage('Failed to create product', 'OK', 3000);
          }
        });
      }
    }
  }
}
