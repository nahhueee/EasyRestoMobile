import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecargaService {
  private reloadSubject = new Subject<string>();
  reload$ = this.reloadSubject.asObservable();

  emitirRecarga(tab: string) {
    this.reloadSubject.next(tab);
  }
}
