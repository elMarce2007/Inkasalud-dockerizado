import { Routes } from '@angular/router';

export const VENTAS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./venta-list/venta-list.component')
      .then(m => m.VentaListComponent)
  },
  {
    path: 'nueva',
    loadComponent: () => import('./venta-nueva/venta-nueva.component')
      .then(m => m.VentaNuevaComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./venta-detalle/venta-detalle.component')
      .then(m => m.VentaDetalleComponent)
  }
];
