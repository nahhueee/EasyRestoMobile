import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Pedido } from '../models/Pedido';

@Injectable({
  providedIn: 'root'
})
export class FilesService {
  apiUrl:string = localStorage.getItem('apiUrl')! ?? environment.apiUrl;
  constructor(private http: HttpClient) {}

  //Manda un pdf al server para impresion
  ImprimirPDF(tipoImpresion:string, pedido:Pedido, tipoComprobante:string): Observable<any> {
    return this.http.post(`${this.apiUrl}/files/imprimir-pdf`, {pedido, tipoImpresion, tipoComprobante})
  }

  VerComanda(pedido:Pedido): Observable<any>{
    return this.http.post(`${this.apiUrl}/files/ver-comanda`, pedido, {responseType: 'blob'})
  }

  VerComprobante(pedido:Pedido, tipoComprobante:string): Observable<any>{
    return this.http.post(`${this.apiUrl}/files/ver-comprobante/` + tipoComprobante, pedido, {responseType: 'blob'})
  }
}
