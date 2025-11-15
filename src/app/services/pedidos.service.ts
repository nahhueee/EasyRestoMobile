import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FiltroPedido } from '../models/Filtros/FiltroPedido';
import { Pedido } from '../models/Pedido';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {
  apiUrl:string = localStorage.getItem('apiUrl')! ?? environment.apiUrl;
  constructor(private http: HttpClient) {}

  ObtenerPedidos(filtro:FiltroPedido): Observable<any> {
    return this.http.post(`${this.apiUrl}/pedidos/obtener`, filtro);
  }
  ObtenerPedido(idPedido:number): Observable<any> {
    return this.http.get(`${this.apiUrl}/pedidos/obtener-pedido/${idPedido}`)
  }
  ObtenerCategorias(): Observable<any> {
    return this.http.get(`${this.apiUrl}/categorias/selector`)
  }
  SelectorTipos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/misc/selector-tpedido`)
  }
  SelectorListas(): Observable<any> {
    return this.http.get(`${this.apiUrl}/listas-precio/selector`)
  }

  ActualizarEstadoImpreso(idPedido:number, ticketImp:string, comandaImp:string): Observable<any>{
    return this.http.put('pedidos/actualizar-impreso', {idPedido, ticketImp, comandaImp})
  }

   Guardar(ped:Pedido): Observable<any>{
    if(ped.id==0){
      return this.http.post(`${this.apiUrl}/pedidos/agregar`, ped)
    }else{
      return this.http.put(`${this.apiUrl}/pedidos/modificar`, ped)
    }
  }
}
