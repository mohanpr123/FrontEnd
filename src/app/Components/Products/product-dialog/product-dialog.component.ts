import { Component, Inject, Signal, signal, computed } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Product } from '../../../Models/product.model';

@Component({
  selector: 'app-product-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <h1 mat-dialog-title>{{ isEdit() ? 'Edit Product' : 'Add Product' }}</h1>
    <div mat-dialog-content>
      <form [formGroup]="productForm">
        <input formControlName="id" type="hidden" />

        <mat-form-field appearance="fill">
          <mat-label>Name</mat-label>
          <input matInput formControlName="name" />
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Quantity</mat-label>
          <input matInput type="number" formControlName="quantity" />
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Price</mat-label>
          <input matInput type="number" formControlName="price" />
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Supplier</mat-label>
          <input matInput formControlName="supplier" />
        </mat-form-field>
      </form>
    </div>
    <div mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-button color="primary" [disabled]="!productForm.valid" (click)="onSave()">Save</button>
    </div>
  `
})
export class ProductDialogComponent {
  productForm: FormGroup;
  isEdit = computed(() => !!this.data?.id);

  constructor(
    public dialogRef: MatDialogRef<ProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Product | null,
    private fb: FormBuilder
  ) {
    this.productForm = this.fb.group({
      id: [data?.id ?? null],
      name: [data?.name ?? '', Validators.required],
      quantity: [data?.quantity ?? 0, [Validators.required, Validators.min(0)]],
      price: [data?.price ?? 0, [Validators.required, Validators.min(0)]],
      supplier: [data?.supplier ?? '', Validators.required]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.productForm.valid) {
      this.dialogRef.close(this.productForm.value);
    }
  }
}
