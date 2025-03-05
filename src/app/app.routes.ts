import { Routes } from '@angular/router';
import { LoginComponent } from './Components/Auth/login/login.component';
import { RegisterComponent } from './Components/Auth/register/register.component';
import { authGuard } from './Guards/auth.guard';
import { ProductsComponent } from './Components/Products/products/products.component';
import { ResetPasswordComponent } from './Components/Auth/reset-password/reset-password.component';
import { loginGuardGuard } from './Guards/login-guard.guard';
import { ROUTES } from './Constants/app.constants';

export const routes: Routes = [
  { path: '', redirectTo: ROUTES.LOGIN, pathMatch: 'full' },
  { path: ROUTES.LOGIN, component: LoginComponent, canActivate: [loginGuardGuard] },
  { path: ROUTES.REGISTER, component: RegisterComponent , canActivate:[loginGuardGuard] },
  { path: ROUTES.RESET_PASSWORD, component: ResetPasswordComponent, canActivate: [loginGuardGuard] },
  { path: ROUTES.PRODUCTS, component: ProductsComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: ROUTES.LOGIN }
];
