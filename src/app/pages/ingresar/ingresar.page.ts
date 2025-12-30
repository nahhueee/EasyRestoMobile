import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonSelectOption, IonItem, IonButton, IonSelect, LoadingController, IonRefresher, IonRefresherContent } from '@ionic/angular/standalone';
import { Usuario } from 'src/app/models/Usuario';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { Router } from '@angular/router';
import { RecargaService } from 'src/app/services/recarga.service';

@Component({
  selector: 'app-ingresar',
  templateUrl: './ingresar.page.html',
  styleUrls: ['./ingresar.page.scss'],
  standalone: true,
  imports: [IonContent, IonItem, IonSelectOption, IonButton, CommonModule, FormsModule, IonSelect, IonRefresher, IonRefresherContent]
})
export class IngresarPage implements OnInit {
  usuarios:Usuario[] = [];
  usuarioSeleccionado:Usuario = new Usuario();
  ipApi:string = "";

  constructor(
    private usuariosService:UsuariosService,
    private recargaService: RecargaService,
    private loadingCtrl: LoadingController,
    private router: Router
  ) {
    const url = localStorage.getItem('apiUrl') ?? '';
    this.ipApi = url.replace(/https?:\/\//, '').split(':')[0];
  }

  handleRefresh(event: any) {
    this.ObtenerUsuarios(); 
    setTimeout(() => {
      event.target.complete(); // detiene la animación de refresco
    }, 1000);
  }

  ngOnInit() {
    this.ObtenerUsuarios();
  }

  ObtenerUsuarios(){
    this.usuariosService.SelectorUsuarios()
     .subscribe(response=> {
      if (Array.isArray(response)) {
        this.usuarios = response;
      } 
    });
  }

  async Ingresar() {
    if (!this.usuarioSeleccionado.id) return;

    const loading = await this.loadingCtrl.create({
      message: `Bienvenido ${this.usuarioSeleccionado.nombre}`,
      duration: 2000, // 2 segundos
      spinner: 'circles'
    });

    await loading.present();

    // Simular carga
    setTimeout(() => {
      loading.dismiss();

      const sesion = {
        data: { 
          idUsuario: this.usuarioSeleccionado.id?.toString()!,
          nombre: this.usuarioSeleccionado.nombre!,
          cargo: this.usuarioSeleccionado.cargo
        },
        timestamp: new Date().getTime(), 
      };
      localStorage.setItem('sesion', JSON.stringify(sesion));
      this.recargaService.emitirRecarga('mesas'); //Para cuando vuelven a iniciar con otro usuario

      this.router.navigate(['/inicio']);
    }, 2000);
  }

  ConfigurarServidor() {
    this.router.navigate(['/servidor']);
  }
}
