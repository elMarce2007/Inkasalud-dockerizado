import { Routes } from '@angular/router';

export const CATALOGO_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'categorias',
    pathMatch: 'full'
  },
  {
    path: 'categorias',
    loadComponent: () => import('./categorias/categoria-list/categoria-list.component')
      .then(m => m.CategoriaListComponent)
  },
  {
    path: 'categorias/nuevo',
    loadComponent: () => import('./categorias/categoria-form/categoria-form.component')
      .then(m => m.CategoriaFormComponent)
  },
  {
    path: 'categorias/editar/:id',
    loadComponent: () => import('./categorias/categoria-form/categoria-form.component')
      .then(m => m.CategoriaFormComponent)
  },
  {
    path: 'productos',
    loadComponent: () => import('./productos/producto-list/producto-list.component')
      .then(m => m.ProductoListComponent)
  },
  {
    path: 'productos/nuevo',
    loadComponent: () => import('./productos/producto-form/producto-form.component')
      .then(m => m.ProductoFormComponent)
  },
  {
    path: 'productos/editar/:id',
    loadComponent: () => import('./productos/producto-form/producto-form.component')
      .then(m => m.ProductoFormComponent)
  }
];
