import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonButton, IonButtons, IonCheckbox, NavController } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { NotificacionesService } from 'src/app/services/notificaciones.service';

@Component({
  selector: 'app-preferencias',
  templateUrl: './preferencias.page.html',
  styleUrls: ['./preferencias.page.scss'],
  standalone: true,
  imports: [IonButton, IonIcon, IonContent, IonHeader, IonTitle, IonButtons, IonToolbar, IonCheckbox, CommonModule, FormsModule]
})
export class PreferenciasPage implements OnInit {
  mostrarImg:boolean = false;
  todasLasMesas:boolean = false;

  constructor(
    private navCtrl: NavController,
    private Notificaciones:NotificacionesService
  ) { 
    const img = localStorage.getItem('mostrarImg');
    if(img){
      if(img=='true') this.mostrarImg = true;
    }

    const mesas = localStorage.getItem('todasLasMesas');
    if(mesas){
      if(mesas=='true') this.todasLasMesas = true;
    }
  }

  ngOnInit() {
  }

  Confirmar(){
    localStorage.setItem('mostrarImg', this.mostrarImg.toString());
    localStorage.setItem('todasLasMesas', this.todasLasMesas.toString());
    this.Notificaciones.success('Preferencias actualizadas');

    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }

  Volver() {
    this.navCtrl.back(); 
  }
}
