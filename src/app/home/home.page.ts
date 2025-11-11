import { Component, ViewChild } from '@angular/core';
import {
  IonIcon,
  IonTab,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonMenu, IonContent, IonMenuToggle
} from '@ionic/angular/standalone';
import { MesasPage } from '../pages/mesas/mesas.page';
import { PedidosPage } from '../pages/pedidos/main-pedidos/pedidos.page';
import { MenuController } from '@ionic/angular';

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
    IonMenu,
    IonContent,
    IonMenuToggle,
    MesasPage,
    PedidosPage
  ],
})
export class HomePage {
  
  constructor(private menuCtrl: MenuController) {}

  AbrirMenu() {
    console.log("Menu")
    this.menuCtrl.toggle('main-menu');
  }
}
