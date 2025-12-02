import { Injectable } from '@angular/core';
import { ApiService } from './api';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarretService {

  constructor(private api: ApiService) { }

  // Funció per obtenir ELS MEUS items del carret
  getItems(): Observable<any[]> {
    return this.api.get('carret');
  }

  // Funció per afegir un Paquet Tancat al carret
  addItem(viatgeId: number): Observable<any> {
    return this.api.post('carret', { viatge_id: viatgeId });
  }

  // Funció per esborrar un Paquet Tancat del carret
  removeItem(viatgeId: number): Observable<any> {
    return this.api.delete(`carret/${viatgeId}`);
  }
}