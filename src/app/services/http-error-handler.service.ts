import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NotificacionesService } from './notificaciones.service';

@Injectable({
  providedIn: 'root'
})
export class HttpErrorHandlerService implements HttpInterceptor {

  constructor(private Notificaciones: NotificacionesService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err instanceof HttpErrorResponse) {
          switch (err.status) {
            case 0:
              this.Notificaciones.error('No se logró la conexión con el servidor');
              break;
            case 400:
              this.Notificaciones.error('Solicitud incorrecta (400)');
              break;
            case 404:
              this.Notificaciones.error('No se encontró el recurso solicitado (404)');
              break;
            case 500:
              this.Notificaciones.error('Ocurrió un error interno en el servidor (500)');
              break;
            default:
              this.Notificaciones.error(`Error desconocido (${err.status})`);
              break;
          }
        }

        return throwError(() => err);
      })
    );
  }
}
