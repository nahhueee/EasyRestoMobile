export class FiltroProducto {
    pagina: number = 1;
    tamanioPagina: number = 15;
    busqueda: string = "";
    categoria: number = 0;
    
    constructor(data?: any) {
        if (data) {
        this.pagina = data.pagina;
        this.tamanioPagina = data.tamanioPagina;
        this.busqueda = data.busqueda;
        this.categoria = data.categoria;    
        }
    }
}
  