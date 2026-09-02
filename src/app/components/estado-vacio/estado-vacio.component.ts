import { Component, Input } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';

// Estado vacio reutilizable (grillas/listas sin datos: mesas sin asignar,
// pedidos sin resultados, etc). Mismo lenguaje visual que la pantalla de
// "Pedido guardado" (nuevo-pedido.page.scss: .icono-exito/.titulo-guardado/
// .subtitulo-guardado) pero con colores neutros -tokens genericos
// --surface-muted/--text-muted en vez de --success-*, para no inventar
// tokens nuevos fuera de los ya sincronizados 1:1 con EasyRestoApp
// (ver comentario en theme/variables.scss).
@Component({
  selector: 'app-estado-vacio',
  standalone: true,
  imports: [IonIcon],
  templateUrl: './estado-vacio.component.html',
  styleUrls: ['./estado-vacio.component.scss']
})
export class EstadoVacioComponent {
  @Input() icono: string = 'file-tray-outline';
  @Input() titulo: string = '';
  @Input() subtitulo?: string;
}
