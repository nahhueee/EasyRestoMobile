import { Component, ViewChild } from '@angular/core';
import {
  IonIcon,
  IonTab,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonList,
  IonItem,
  IonLabel,
  IonMenu, IonContent, IonMenuToggle, MenuController
} from '@ionic/angular/standalone';
import { MesasPage } from '../pages/mesas/mesas.page';
import { PedidosPage } from '../pages/pedidos/main-pedidos/pedidos.page';
import { Router } from '@angular/router';
import { UsuariosService } from '../services/usuarios.service';
import { environment } from 'src/environments/environment';
import { NotificacionesService } from '../services/notificaciones.service';

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
    IonList,
    IonItem,
    IonLabel,
    MesasPage,
    PedidosPage
  ],
})
export class HomePage {
  versionApp:string = "";
  usuario:string = "";
  cargo:string = "";

  constructor(
    private router: Router,
    private usuarioService:UsuariosService,
    private notificaciones:NotificacionesService,
    private menuCtrl: MenuController
  ) {
    const sesion = this.usuarioService.GetSesion();
    if (sesion) {
      this.usuario = sesion.data.nombre;
      this.cargo = sesion.data.cargo;
    }else{
      this.notificaciones.info('Es necesario iniciar sesión')
      this.router.navigateByUrl('/ingresar');
    }

    this.versionApp = environment.version;
  }

  AbrirPreferencias(){
    this.menuCtrl.close();
    this.router.navigate(['/preferencias']);
  }

  ConfigurarServidor() {
    this.menuCtrl.close();
    this.router.navigate(['/servidor']);
  }

  CerrarSesion() {
    this.menuCtrl.close();
    this.router.navigate(['/ingresar']);
  }

}
