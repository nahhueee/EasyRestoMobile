import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../models/Usuario';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  apiUrl:string = localStorage.getItem('apiUrl')! ?? environment.apiUrl;
  constructor(private http: HttpClient) {}
    
  SelectorUsuarios(): Observable<any> {
    console.log("Consultando a: " + this.apiUrl)
    return this.http.get(`${this.apiUrl}/usuarios/selector`)
  }

  GetSesion() {
    const raw = localStorage.getItem("sesion");
    return raw ? JSON.parse(raw) : null;
  }
}

