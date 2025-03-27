import { TestBed } from '@angular/core/testing';

import { FashionProductsService } from './fashion-products.service';

describe('FashionProductsService', () => {
  let service: FashionProductsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FashionProductsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
