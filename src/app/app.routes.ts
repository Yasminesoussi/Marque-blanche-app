import { Routes } from '@angular/router';
import { moduleGuard } from './core/modules/module.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
    canActivate: [moduleGuard],
  },
  {
    path: 'product-form',
    loadComponent: () =>
      import('./components/product-form/product-form').then((m) => m.ProductForm),
    canActivate: [moduleGuard],
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./components/product-list/product-list').then((m) => m.ProductList),
    canActivate: [moduleGuard],
  },
  {
    path: 'theme-config',
    loadComponent: () =>
      import('./pages/theme-config/theme-config').then((m) => m.ThemeConfig),
    canActivate: [moduleGuard],
  },
  { path: '**', redirectTo: '' },
];
