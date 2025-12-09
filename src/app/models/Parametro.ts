export class Parametro {
    imagenes?:boolean;
    todasMesas?:boolean;
    impComprobante?:boolean;

    constructor(data?: any) {
        if (data) {
          this.imagenes = data.imagenes == 1 ? true : false;
          this.todasMesas = data.todasMesas == 1 ? true : false;
          this.impComprobante = data.impComprobante == 1 ? true : false;
        }
    }
}