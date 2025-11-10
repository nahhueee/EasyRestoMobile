import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MesasService {
  apiUrl:string = environment.apiUrl;
  constructor(private http: HttpClient) {}

  ObtenerMesas(idSalon: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/mesas/obtener/${idSalon}`);
  }

  ObtenerSalones(): Observable<any> {
    return this.http.get(`${this.apiUrl}/salones/obtener/`);
  }
}
