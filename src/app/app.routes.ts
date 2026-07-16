import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'product-form',
    loadComponent: () =>
      import('./components/product-form/product-form').then((m) => m.ProductForm),
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./components/product-list/product-list').then((m) => m.ProductList),
  },
  { path: '**', redirectTo: '' },
];
