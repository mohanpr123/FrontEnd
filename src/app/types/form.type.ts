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
