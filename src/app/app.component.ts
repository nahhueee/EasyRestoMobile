import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { ApiService } from './services/api.service';
import { ThemeService } from './services/theme.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor(
    private apiService:ApiService,
    private themeService:ThemeService
  ) {
    this.ObtenerApiUrl();

    // Tema/modo oscuro: se pinta desde cache ANTES de tener respuesta del
    // servidor (evita el flash del tema default en cada apertura de la app).
    // home.page.ts lo vuelve a aplicar con la respuesta real apenas llega.
    this.themeService.AplicarDesdeCache();
  }
  async ObtenerApiUrl(){
    let apiUrl = environment.apiUrl;

    if(environment.production){
      apiUrl = await this.apiService.CargarConfigServidor();
    } else {
      // Dev (ng serve): armamos la URL con el host desde el que se sirvio
      // la app en vez de usar el 127.0.0.1 fijo de environment.ts. Asi
      // funciona igual si se abre en localhost, por IP de LAN o desde el
      // celular, sin tener que tocar environment.ts para cada caso -asume
      // que la API corre en la misma maquina que "ng serve", puerto 7600
      // (igual que siempre).
      apiUrl = `http://${window.location.hostname}:7600/easyresto`;
    }

    localStorage.setItem('apiUrl', apiUrl);
    console.log("Consultando a: " + apiUrl)
  }
}
