export class TipoPedido{
    id? : number;
    nombre? : string;
    icono? : string;
  
    constructor(data?: any) {
      if (data) {
        this.id = data.id;
        this.nombre = data.nombre;
        this.icono = data.icono;
      }
    }
}
  
  