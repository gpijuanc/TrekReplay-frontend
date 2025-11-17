import { Injectable } from '@angular/core';
import { ApiService } from './api'; // Importem el servei API principal
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ViatgeService {

  constructor(private api: ApiService) { }

  // Funció per obtenir TOTS els viatges (per al marketplace)
  getViatges(): Observable<any[]> {
    return this.api.get('viatges');
  }

  // Funció per obtenir UN viatge (per a la pàgina de detall)
  getViatgeById(id: number): Observable<any> {
    return this.api.get(`viatges/${id}`);
  }

  // (Aquí afegirem després les funcions protegides de crear, editar, etc.)
}