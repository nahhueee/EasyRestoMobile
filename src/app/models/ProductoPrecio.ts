import { ListaPrecio } from "./ListaPrecio";

export class ProductoPrecio {
    id?:number;
    idProducto?:number;
    listaPrecio?:ListaPrecio;
    descripcion? : string;
    costo : number = 0;
    precio : number = 0;

    constructor(data?: any) {
        if (data) {
            this.id = data.id;
            this.idProducto = data.idProducto;
            this.listaPrecio = data.listaPrecio;
            this.descripcion = data.descripcion;
            this.costo = parseFloat(data.costo);
            this.precio = parseFloat(data.precio);
        }
    }
}