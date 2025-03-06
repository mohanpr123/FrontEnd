import { Routes } from '@angular/router';
import { authGuard } from './Guards/auth.guard';
import { homeGuard } from './Guards/home-guard.guard';
import { ROUTES } from './Constants/app.constants';

export const routes: Routes = [
  { path: '', redirectTo: ROUTES.LOGIN, pathMatch: 'full' },
  {
    path: ROUTES.LOGIN,
    loadComponent: () => import('./Components/Auth/login/login.component').then(module => module.LoginComponent),
    canActivate: [(homeGuard)]
  },
  {
    path: ROUTES.REGISTER,
    loadComponent: () => import('./Components/Auth/register/register.component').then(module => module.RegisterComponent),
    canActivate: [(homeGuard)]
  },
  {
    path: ROUTES.RESET_PASSWORD,
    loadComponent: () => import('./Components/Auth/reset-password/reset-password.component').then(module => module.ResetPasswordComponent),
    canActivate: [(homeGuard)]
  },
  {
    path: ROUTES.PRODUCTS,
    loadComponent: () => import('./Components/Products/products/products.component').then(module => module.ProductsComponent),
    canActivate: [(authGuard)]
  },
  { path: '**', redirectTo: ROUTES.LOGIN }
];
