import { Routes } from '@angular/router';
import { authGuard } from './Guards/auth.guard';
import { homeGuard } from './Guards/home-guard.guard';
import { ROUTES } from './constants/app.constants';
import { LoginComponent } from './components/Auth/login/login.component';
import { ProductsComponent } from './components/Products/products/products.component';
import { FashionProductsComponent } from './components/Products/fashion-products/fashion-products.component';

export const routes: Routes = [
  { path: '', redirectTo: ROUTES.LOGIN, pathMatch: 'full' },
  {
    path: ROUTES.LOGIN,component:LoginComponent, canActivate: [homeGuard]
  },
  {
    path: ROUTES.REGISTER,
    loadComponent: () => import('./components/Auth/register/register.component').then(module => module.RegisterComponent),
    canActivate: [homeGuard]
  },
  {
    path: ROUTES.RESET_PASSWORD,
    loadComponent: () => import('./components/Auth/reset-password/reset-password.component').then(module => module.ResetPasswordComponent),
    canActivate: [homeGuard]
  },
  {
    path: ROUTES.PRODUCTS,component:ProductsComponent,canActivate: [authGuard]
  },
  {path:ROUTES.FASHIONPRODUCTS, component: FashionProductsComponent , canActivate:[authGuard]},
  { path: '**', redirectTo: ROUTES.LOGIN }
];
