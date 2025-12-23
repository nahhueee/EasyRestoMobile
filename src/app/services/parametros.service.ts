import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';
import { Parametro } from '../models/Parametro';

@Injectable({
  providedIn: 'root'
})
export class ParametrosService {
   apiUrl:string = localStorage.getItem('apiUrl')!;
   constructor(private http: HttpClient) {}

  ObtenerParametro(clave:string): Observable<any> {
    return this.http.get(`${this.apiUrl}/parametros/obtener/${clave}`)
  }

  ObtenerParametrosMobile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/parametros/obtener-mobile`)
  }

  ObtenerParametrosLocal():Parametro{
    const datosAlmacenados = localStorage.getItem('parametros');
    let parametros:Parametro;

    parametros = new Parametro(JSON.parse(datosAlmacenados!));
    return parametros;
  }

  ObtenerUltimaCajaActiva():Observable<any> {
    return this.http.get(`${this.apiUrl}/cajas/obtener-ultima-activa`)
  }
}
