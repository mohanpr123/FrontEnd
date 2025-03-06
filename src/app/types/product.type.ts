export interface ProductQuery {
  pageIndex: number;
  pageSize: number;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  searchKeyword: string;
}

export interface Product {
  id: number;
  name: string;
  quantity: number;
  price: number;
  supplier: string;
}
