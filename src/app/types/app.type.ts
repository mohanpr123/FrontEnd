import { FormGroup, FormControl } from "@angular/forms";

export type LoginForm = FormGroup<{
  email: FormControl<string>;
  password: FormControl<string>;
}>;

export type RegisterForm = FormGroup<{
  username: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
  confirmpassword: FormControl<string>;
}>;

export type ProductForm = FormGroup<{
  id: FormControl<number>;
  name: FormControl<string>;
  quantity: FormControl<number>;
  price: FormControl<number>;
  supplier: FormControl<string>;
}>;


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

export interface JwtResponse {
  jwt: string;
  username:string;
}

export interface resetPassword{
  email:string;
  password:string;
}

export interface ResetResponse
{
  msg:string;
}

export interface User {
  username: string;
  email: string;
  password: string;
}

