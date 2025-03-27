import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FashionProductsComponent } from './fashion-products.component';

describe('FashionProductsComponent', () => {
  let component: FashionProductsComponent;
  let fixture: ComponentFixture<FashionProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FashionProductsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FashionProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
