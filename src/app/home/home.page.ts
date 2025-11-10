import { Component, ViewChild } from '@angular/core';
import {
  IonIcon,
  IonTab,
  IonTabBar,
  IonTabButton,
  IonTabs
} from '@ionic/angular/standalone';
import { MesasPage } from '../pages/mesas/mesas.page';
import { PedidosPage } from '../pages/pedidos/main-pedidos/pedidos.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonTabButton,
    IonIcon,
    IonTab,
    IonTabBar,
    IonTabs,
    MesasPage,
    PedidosPage
  ],
})
export class HomePage {
}
