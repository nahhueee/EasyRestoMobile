import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'ingresar',
    pathMatch: 'full',
  },
  {
    path: 'inicio',
    loadComponent: () => import('./home/home.page').then(m => m.HomePage),
    children: [
      {
        path: 'mesas',
        loadComponent: () => import('./pages/mesas/mesas.page').then(m => m.MesasPage),
      },
      {
        path: 'pedidos',
        loadComponent: () => import('./pages/pedidos/main-pedidos/pedidos.page').then(m => m.PedidosPage),
      },
      {
        path: '',
        redirectTo: 'mesas',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'nuevo-pedido/:mesa',
    loadComponent: () => import('./pages/pedidos/nuevo-pedido/nuevo-pedido.page').then(m => m.NuevoPedidoPage)
  },
  {
    path: 'actualizar-pedido/:idPedido',
    loadComponent: () => import('./pages/pedidos/nuevo-pedido/nuevo-pedido.page').then(m => m.NuevoPedidoPage)
  },
  {
    path: 'ingresar',
    loadComponent: () => import('./pages/ingresar/ingresar.page').then( m => m.IngresarPage)
  },
  {
    path: 'servidor',
    loadComponent: () => import('./pages/servidor/servidor.page').then( m => m.ServidorPage)
  },
  {
    path: 'preferencias',
    loadComponent: () => import('./pages/preferencias/preferencias.page').then( m => m.PreferenciasPage)
  },

];
