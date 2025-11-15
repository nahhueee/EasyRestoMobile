import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonButton, IonButtons, IonCheckbox, NavController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-preferencias',
  templateUrl: './preferencias.page.html',
  styleUrls: ['./preferencias.page.scss'],
  standalone: true,
  imports: [IonButton, IonIcon, IonContent, IonHeader, IonTitle, IonButtons, IonToolbar, IonCheckbox, CommonModule, FormsModule]
})
export class PreferenciasPage implements OnInit {
  mostrarImg:boolean = false;

  constructor(
    private navCtrl: NavController,
  ) { 
    const img = localStorage.getItem('mostrarImg');
    if(img){
      if(img=='true') this.mostrarImg = true;
    }
  }

  ngOnInit() {
  }

  Confirmar(){
    localStorage.setItem('mostrarImg', this.mostrarImg.toString())
    this.navCtrl.back(); 
  }

  Volver() {
    this.navCtrl.back(); 
  }
}
