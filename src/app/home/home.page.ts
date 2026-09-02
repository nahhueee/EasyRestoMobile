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
import { ParametrosService } from '../services/parametros.service';
import { ThemeService } from '../services/theme.service';
import { RecargaService } from '../services/recarga.service';

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
  @ViewChild(IonTabs) tabs!: IonTabs;

  versionApp:string = "";
  usuario:string = "";
  cargo:string = "";

  constructor(
    private router: Router,
    private usuarioService:UsuariosService,
    private notificaciones:NotificacionesService,
    private menuCtrl: MenuController,
    private parametrosService:ParametrosService,
    private themeService:ThemeService,
    private recargaService:RecargaService
  ) {
    this.CargarSesion();
    this.versionApp = environment.version;
  }

  // HomePage es la raiz del ion-router-outlet y con IonicRouteStrategy
  // (ver main.ts) el router NO destruye/recrea esta pagina al navegar a
  // /ingresar y volver a /inicio -reutiliza la misma instancia, asi que el
  // constructor no vuelve a correr. Eso dejaba usuario/cargo del sidebar
  // con los datos de la sesion anterior tras un cierre+inicio de sesion.
  // ionViewWillEnter si se dispara en cada reingreso a la pagina, aunque la
  // instancia se reutilice, asi que releemos la sesion aca tambien.
  ionViewWillEnter(){
    this.CargarSesion();
  }

  private CargarSesion(){
    const sesion = this.usuarioService.GetSesion();
    if (sesion) {
      this.usuario = sesion.data.nombre;
      this.cargo = sesion.data.cargo;
    }else{
      this.notificaciones.info('Es necesario iniciar sesión')
      this.router.navigateByUrl('/ingresar');
    }
  }

  ngOnInit(){
    this.parametrosService.ObtenerParametrosMobile()
      .subscribe(async response => {
      localStorage.setItem('parametros', JSON.stringify(response));
      this.themeService.Aplicar(response.tema, response.modoOscuro == 1 || response.modoOscuro === true);

      // MesasPage (hijo estatico de este componente) se crea junto con Home
      // y ya lee "todasMesas" de este mismo localStorage.parametros en su
      // primer ObtenerMesas() -si esa lectura corre antes de que esta
      // respuesta llegue, localStorage.parametros todavia no existe (o esta
      // desactualizado) y todasMesas da falsy, filtrando por usuario y
      // mostrando "sin mesas" hasta que se refresca a mano. MesasPage ya
      // escucha reload$ (para otros refrescos), asi que reusamos el mismo
      // canal en vez de acoplar Home a MesasPage directamente.
      this.recargaService.emitirRecarga('mesas');
    });
  }

  ngAfterViewInit(){
    // "Mesas" es el tab declarado primero (default de ion-tabs). Si la
    // ultima pantalla usada fue "Pedidos" (ver GuardarUltimaPantalla,
    // disparado por ionTabsDidChange), arrancamos ahi en vez de Mesas.
    const ultimaPantalla = localStorage.getItem('ultimaPantallaInicio');
    if(ultimaPantalla === 'pedidos'){
      this.tabs.select('pedidos');
    }
  }

  GuardarUltimaPantalla(event: any){
    localStorage.setItem('ultimaPantallaInicio', event.tab);
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
