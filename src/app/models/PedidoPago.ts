export class PedidoPago{
    idPedido? : number;
    tipoPago?: TipoPago;
    efectivo? : number;
    digital? : number;
    recargo : number = 0;
    descuento : number = 0;
    realizado? : boolean;
  
    constructor(data?: any) {
      if (data) {
        this.idPedido = data.idPedido;
        this.tipoPago = data.tipoPago;
        this.efectivo = data.efectivo;
        this.digital = data.digital;
        this.recargo = data.recargo;
        this.descuento = data.descuento;
        this.realizado = data.realizado;
      }
    }
}
    
export class TipoPago{
    id? : number;
    nombre? : string;

    constructor(data?: any) {
        if (data) {
        this.id = data.id;
        this.nombre = data.nombre;
        }
    }
}
  
  