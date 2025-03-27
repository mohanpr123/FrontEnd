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

export interface FashionProducts{
  id:number,
  productid:number,
  productname:string,
  brand:string,
  category:string,
  colour:string,
  price:number,
  size:string,
  rating:number
}