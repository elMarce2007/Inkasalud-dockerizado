import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: '',
    loadComponent: () => import('./layout/main-layout/main-layout.component')
      .then(m => m.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./features/dashboard/dashboard.routes')
          .then(m => m.DASHBOARD_ROUTES)
      },
      {
        path: 'clientes',
        loadChildren: () => import('./features/clientes/clientes.routes')
          .then(m => m.CLIENTES_ROUTES)
      },
      {
        path: 'catalogo',
        loadChildren: () => import('./features/catalogo/catalogo.routes')
          .then(m => m.CATALOGO_ROUTES)
      },
      {
        path: 'ventas',
        loadChildren: () => import('./features/ventas/ventas.routes')
          .then(m => m.VENTAS_ROUTES)
      },
      {
        path: 'personal',
        loadChildren: () => import('./features/personal/personal.routes')
          .then(m => m.PERSONAL_ROUTES)
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
