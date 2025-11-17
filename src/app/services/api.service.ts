import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}
    
  CargarConfigServidor(): Promise<string> {
    return new Promise(resolve => {
      const url = 'server-info.json';

      this.http.get(url).subscribe({
        next: (data: any) => {
          try {
            const ip = data.ip;
            const puerto = data.puerto;

            const finalUrl = `http://${ip}:${puerto}/easyresto`;
            resolve(finalUrl);
          } catch {
            resolve(environment.apiUrl);
          }
        },
        error: () => {
            console.error("No se pudo obtener IP desde el archivo.")
          resolve(environment.apiUrl);
        }
      });
    });
  }
}

