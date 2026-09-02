export class Parametro {
    imagenes?:boolean;
    todasMesas?:boolean;
    impComprobante?:boolean;
    tema?:string;
    modoOscuro?:boolean;

    constructor(data?: any) {
        if (data) {
          this.imagenes = data.imagenes == 1 ? true : false;
          this.todasMesas = data.todasMesas == 1 ? true : false;
          this.impComprobante = data.impComprobante == 1 ? true : false;
          this.tema = data.tema || 'green';
          this.modoOscuro = data.modoOscuro == 1 ? true : false;
        }
    }
}