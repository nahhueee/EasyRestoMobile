import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, IonIcon, NavController, IonInput } from '@ionic/angular/standalone';
import { NotificacionesService } from 'src/app/services/notificaciones.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-servidor',
  templateUrl: './servidor.page.html',
  styleUrls: ['./servidor.page.scss'],
  standalone: true,
  imports: [IonIcon, IonButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, IonInput, CommonModule, FormsModule]
})
export class ServidorPage implements OnInit {
  ipServidor:string = ""

  constructor(
    private navCtrl: NavController,
    private notificaciones:NotificacionesService,
    private router: Router
  ) {
    const apiUrl = localStorage.getItem('apiUrl');
    if (apiUrl) {
      this.ipServidor = new URL(apiUrl).hostname;
    }
  }

  ngOnInit() {
  }

  Confirmar(){
    const apiUrl = 'http://' + this.ipServidor + ':7600/easyresto';
    localStorage.setItem('apiUrl', apiUrl);
    this.notificaciones.success('Cambios guardados correctamente');
    this.router.navigate(['/ingresar']);
  }

  Volver() {
    this.navCtrl.back(); 
  }
}
