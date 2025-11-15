export class ObjComanda {
    papel?:string;
    nroPedido?:number;
    mesa?:string;
    mozo?:string;
    cliente?:string;
    fechaPedido?:string;
    horaPedido?:string;
    observacion?:string;
    filasTabla?:any[];

    constructor(data?: any) {
        if (data) {
          this.papel = data.papel;
          this.nroPedido = data.nroPedido;
          this.mesa = data.mesa;
          this.mozo = data.mozo;
          this.cliente = data.cliente;
          this.fechaPedido = data.fechaPedido;
          this.horaPedido = data.horaPedido;
          this.observacion = data.observacion;
          this.filasTabla = data.filasTabla;
        }
    }
}