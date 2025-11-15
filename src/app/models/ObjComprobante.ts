export class ObjComprobante {
    papel?:string;
    nombreLocal?:string;
    desLocal?:string;
    dirLocal?:string;
    fechaPedido?:string;
    horaPedido?:string;
    mesa?:string;
    descuento?:number;
    recargo?:number;
    filasTabla?:any[];
    totalProdVar?:number;
    totalFinal?:number;

    constructor(data?: any) {
        if (data) {
          this.papel = data.papel;
          this.nombreLocal = data.nombreLocal;
          this.desLocal = data.desLocal;
          this.dirLocal = data.dirLocal;
          this.fechaPedido = data.fechaPedido;
          this.horaPedido = data.horaPedido;
          this.descuento = data.descuento;
          this.mesa = data.mesa;
          this.recargo = data.recargo;
          this.filasTabla = data.filasTabla;
          this.totalProdVar = data.totalProdVar;
          this.totalFinal = data.totalFinal;
        }
    }
}