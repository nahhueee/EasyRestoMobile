import { DetallePedido } from "./DetallePedido";
import { Mesa } from "./Mesa";
import { PedidoPago } from "./PedidoPago";
import { TipoPedido } from "./TipoPedido";
import { Usuario } from "./Usuario";

export class Pedido{
    id : number = 0;
    idCaja: number = 0;
    fecha? : Date;
    hora? : string;
    total? : number;
    mesa? : Mesa;
    responsable? : Usuario;
    tipo? : TipoPedido;
    obs? : string;
    cliente? : string;
    finalizado?: number;
    ticketImp?: string;
    comandaImp?: string;

    pago? : PedidoPago;
    detalles : DetallePedido[] = [];
  
    constructor(data?: any) {
      if (data) {
        this.id = data.id;
        this.idCaja = data.idCaja;
        this.fecha = data.fecha;
        this.hora = data.hora;
        this.total = data.total;
        this.finalizado = data.finalizado;
        this.ticketImp = data.ticketImp;
        this.comandaImp = data.comandaImp;
        this.mesa = new Mesa(data.mesa);
        this.responsable = new Usuario(data.usuario);
        this.tipo = new TipoPedido(data.tipo);
        this.pago = new PedidoPago(data.pago);
        this.detalles = data.detalles;
        this.obs = data.obs;
        this.cliente = data.cliente;
      }
    }
  }
  
  