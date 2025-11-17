import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { ApiService } from './services/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor(
    private apiService:ApiService
  ) {
    this.ObtenerApiUrl();
  }
  async ObtenerApiUrl(){
    let apiUrl = environment.apiUrl;

    if(environment.production){
      apiUrl = await this.apiService.CargarConfigServidor();
    }

    localStorage.setItem('apiUrl', apiUrl);
    console.log("Consultando a: " + apiUrl)
  }
}
