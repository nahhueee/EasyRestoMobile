export class FiltroPedido{
    pagina: number = 1;
    tamanioPagina: number = 15;

    idPedido: number = 0;
    tipoPedido: number = 1;
    responsable: number = 0;
    finalizado: boolean = false;
    idCaja: number = 0;
  
    constructor(data?: any) {
      if (data) {
        this.pagina = data.pagina;
        this.tamanioPagina = data.tamanioPagina;

        this.idPedido = data.idPedido;
        this.tipoPedido = data.tipoPedido;
        this.responsable = data.responsable;
        this.finalizado = data.finalizado;
        this.idCaja = data.idCaja;
       }
    }
  }
  