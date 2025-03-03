import { Routes } from '@angular/router';
import { LoginComponent } from './Components/Auth/login/login.component';
import { RegisterComponent } from './Components/Auth/register/register.component';
import { authGuard } from './Guards/auth.guard';
import { ProductsComponent } from './Components/Products/products/products.component';
import { ResetPasswordComponent } from './Components/Auth/reset-password/reset-password.component';
import { loginGuardGuard } from './Guards/login-guard.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [loginGuardGuard] },
  { path: 'register', component: RegisterComponent , canActivate:[loginGuardGuard] },
  { path: 'reset-password', component: ResetPasswordComponent, canActivate: [loginGuardGuard] },
  { path: 'products', component: ProductsComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' }
];
