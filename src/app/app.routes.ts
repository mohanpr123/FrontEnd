import { Routes } from '@angular/router';
import { LoginComponent } from './Components/Auth/login/login.component';
import { RegisterComponent } from './Components/Auth/register/register.component';
import { authGuard } from './Guards/auth.guard';
import { ProductsComponent } from './Components/Products/products/products.component';
import { NfComponent } from './Components/nf/nf.component';
import { ResetPasswordComponent } from './Components/Auth/reset-password/reset-password.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {path : 'reset-password' ,  component:ResetPasswordComponent},
  { path: 'nf', component: NfComponent },
  { path: 'products', component: ProductsComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'nf' },
];
