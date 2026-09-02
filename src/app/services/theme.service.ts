import { Injectable } from '@angular/core';

export const TEMAS_VALIDOS = ['red', 'pink', 'blue', 'green', 'yellow', 'orange'] as const;
export type TemaColor = typeof TEMAS_VALIDOS[number];

// Aplica color de marca + modo claro/oscuro sobre <html>, a mano -no según
// prefers-color-scheme del teléfono-, leyendo parametros_mobile.tema y
// .modoOscuro (ver theme/variables.scss para el detalle de los tokens).
//
// Dos entradas posibles:
// - AplicarDesdeCache(): lectura sincrónica de localStorage('parametros'),
//   para pintar el tema correcto en el primer render, antes de tener
//   respuesta del servidor. Se llama en AppComponent.
// - Aplicar(tema, modoOscuro): con la respuesta ya confirmada del servidor
//   (ObtenerParametrosMobile) o recién guardada desde Preferencias.
@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  AplicarDesdeCache(): void {
    let tema: string = 'green';
    let modoOscuro = false;

    const cache = localStorage.getItem('parametros');
    if (cache) {
      try {
        const parametros = JSON.parse(cache);
        tema = parametros.tema || 'green';
        modoOscuro = parametros.modoOscuro === true || parametros.modoOscuro === 1;
      } catch {
        // Cache corrupto o todavía sin el shape nuevo: seguimos con el default.
      }
    }

    this.Aplicar(tema, modoOscuro);
  }

  Aplicar(tema: string, modoOscuro: boolean): void {
    const temaValido = (TEMAS_VALIDOS as readonly string[]).includes(tema) ? tema : 'green';
    document.documentElement.setAttribute('data-tema', temaValido);
    document.documentElement.classList.toggle('ion-palette-dark', !!modoOscuro);
  }
}
