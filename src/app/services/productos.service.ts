import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FiltroProducto } from '../models/FiltroProducto';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  apiUrl:string = localStorage.getItem('apiUrl')! ?? environment.apiUrl;
  constructor(private http: HttpClient) {}

  ObtenerProductos(filtro:FiltroProducto): Observable<any> {
    return this.http.post(`${this.apiUrl}/productos/obtener`, filtro)
  }
}
