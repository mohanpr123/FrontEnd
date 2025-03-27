import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { tap, catchError, of } from 'rxjs';
import { Product } from '../../../types/product.type';
import { ProductService } from '../../../Services/ProductService/product.service';
import { SnackbarService } from '../../../Services/PublicServices/snackbar.service';
import { NoSpacesValidatorDirective } from '../../../Services/PublicServices/no-spaces.validator';
import { ProductForm } from '../../../types/form.type';

@Component({
  selector: 'app-product-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
  ],
  templateUrl: './product-dialog.component.html',
  styleUrls: ['./product-dialog.component.css'],
})
export class ProductDialogComponent {
  productForm: ProductForm;
  isEdit: boolean;

  constructor(
    private snackbarService: SnackbarService,
    private productService: ProductService,
    public dialogRef: MatDialogRef<ProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Product,
    private form: FormBuilder
  ) {
    this.isEdit = !!data?.id;
    this.productForm = this.form.nonNullable.group({
      id: [data?.id ?? 0],
      name: [data?.name ?? '', [Validators.required, NoSpacesValidatorDirective.noSpacesValidator()]],
      quantity: [data?.quantity ?? 1, [Validators.required, Validators.min(1)]],
      price: [data?.price ?? 0.0, [Validators.required, Validators.min(0)]],
      supplier: [data?.supplier ?? '', [Validators.required, NoSpacesValidatorDirective.noSpacesValidator()]],
    }) as ProductForm;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.productForm.invalid) return;

    const { id, name, quantity, price, supplier } = this.productForm.value;
    const productData: Product = {
      id: id!,
      name: name!.trim(),
      quantity: quantity!,
      price: price!,
      supplier: supplier!.trim(),
    };

    const saveProduct = this.isEdit? this.productService.updateProduct(id!, productData): this.productService.createProduct(productData);

    saveProduct
      .pipe(
        tap(() => this.dialogRef.close({ action: this.isEdit ? 'edit' : 'add', product: productData })),
        catchError(() => {
          this.snackbarService.showMessage(`Failed to ${this.isEdit ? 'update' : 'create'} product`);
          return of();
        })
      )
      .subscribe();
  }
}
