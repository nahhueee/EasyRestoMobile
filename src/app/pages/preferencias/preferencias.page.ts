import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonButton, IonButtons, IonCheckbox, IonToggle, NavController } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { NotificacionesService } from 'src/app/services/notificaciones.service';
import { ParametrosService } from 'src/app/services/parametros.service';
import { ThemeService, TEMAS_VALIDOS, TemaColor } from 'src/app/services/theme.service';

// Hex de cada tema: mismos valores que theme/variables.scss (GetPrimario()
// en EasyRestoApp), acá solo para pintar los círculos del selector.
const TEMA_HEX: Record<TemaColor, string> = {
  red: '#FF1744',
  pink: '#F50057',
  blue: '#0091EA',
  green: '#00C853',
  yellow: '#FFD600',
  orange: '#FF9100'
};

@Component({
  selector: 'app-preferencias',
  templateUrl: './preferencias.page.html',
  styleUrls: ['./preferencias.page.scss'],
  standalone: true,
  imports: [IonButton, IonIcon, IonContent, IonHeader, IonTitle, IonButtons, IonToolbar, IonToggle, CommonModule, FormsModule]
})
export class PreferenciasPage implements OnInit {
  temas = TEMAS_VALIDOS.map(t => ({ id: t, hex: TEMA_HEX[t] }));
  temaSeleccionado:TemaColor = 'green';
  modoOscuro:boolean = false;

  constructor(
    private navCtrl: NavController,
    private Notificaciones:NotificacionesService,
    private parametrosService:ParametrosService,
    private themeService:ThemeService
  ) {
    // Apariencia sale de parametros_mobile (servidor), no de localStorage
    // propio: es lo mismo que ya cacheó home.page.ts en 'parametros'.
    const actuales = this.parametrosService.ObtenerParametrosLocal();
    this.temaSeleccionado = (actuales.tema as TemaColor) || 'green';
    this.modoOscuro = actuales.modoOscuro || false;
  }

  ngOnInit() {
  }

  // Previsualiza al toque, sin guardar todavía -confirma recién al tocar
  // "Guardar Preferencias", igual que el resto de la página.
  SeleccionarTema(tema:TemaColor){
    this.temaSeleccionado = tema;
    this.themeService.Aplicar(this.temaSeleccionado, this.modoOscuro);
  }

  CambiarModoOscuro(){
    this.themeService.Aplicar(this.temaSeleccionado, this.modoOscuro);
  }

  Confirmar(){
    // parametros_mobile es una sola fila: mandamos el objeto completo
    // (imagenes/todasMesas/impComprobante actuales + tema/modoOscuro nuevos),
    // no un patch parcial -ver ParametrosService.ActualizarParametrosMobile.
    const actuales = this.parametrosService.ObtenerParametrosLocal();
    const payload = {
      imagenes: actuales.imagenes ? 1 : 0,
      todasMesas: actuales.todasMesas ? 1 : 0,
      impComprobante: actuales.impComprobante ? 1 : 0,
      tema: this.temaSeleccionado,
      modoOscuro: this.modoOscuro ? 1 : 0
    };

    this.parametrosService.ActualizarParametrosMobile(payload).subscribe({
      next: () => {
        localStorage.setItem('parametros', JSON.stringify(payload));
        this.Notificaciones.success('Preferencias actualizadas');
        setTimeout(() => { window.location.reload(); }, 2000);
      },
      error: () => {
        this.Notificaciones.warn('No se pudo guardar la apariencia (sí se guardó el resto)');
        setTimeout(() => { window.location.reload(); }, 2000);
      }
    });
  }

  Volver() {
    // Si tocó un color/modo y no guardó, el preview quedó aplicado en vivo
    // sobre <html> -lo descartamos volviendo al último tema guardado.
    this.themeService.AplicarDesdeCache();
    this.navCtrl.back();
  }
}
