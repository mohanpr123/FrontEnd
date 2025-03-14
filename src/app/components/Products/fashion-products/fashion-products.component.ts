import { Component, HostListener, OnInit } from '@angular/core';
import { FashionProducts } from '../../../types/product.type';
import { FashionProductsService } from '../../../Services/ProductService/fashion-products.service';
import { tap } from 'rxjs';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatCardModule } from '@angular/material/card';
import { MatSpinner } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-fashion-products',
  imports: [ScrollingModule,MatCardModule,MatSpinner,MatToolbarModule],
  templateUrl: './fashion-products.component.html',
  styleUrl: './fashion-products.component.css'
})
export class FashionProductsComponent  implements OnInit{
  products:FashionProducts[]=[];
  page=0;
  size=20;
  loading = false;
  index:number=0;

  constructor(private fashionService:FashionProductsService) {}

  ngOnInit() {
    this.loadMore();
  }

  loadMore() {
    if (this.loading) return;
    this.loading = true;
    this.fashionService.getProducts(this.page, this.size).pipe(
      tap(response => {
        this.products = [...this.products, ...response.content];
        this.page++;
        this.loading = false;
      })
    ).subscribe();
  }

  onScroll(index: number) {
    if (index + 9 >= this.products.length) {
      this.loadMore();
    }
  }
}
