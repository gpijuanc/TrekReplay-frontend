import { Injectable } from '@angular/core';
import { ApiService } from './api';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ViatgeService {

  constructor(private api: ApiService) { }

  // --- Funcions del Comprador (Públiques) ---

  getViatges(): Observable<any[]> {
    return this.api.get('viatges');
  }

  getViatgeById(id: number): Observable<any> {
    return this.api.get(`viatges/${id}`);
  }

  // --- Funcions del Venedor (Protegides) ---

  // Obtenir només els meus viatges (per al Dashboard)
  getMyViatges(): Observable<any[]> {
    return this.api.get('my-viatges');
  }

  // Crear un viatge (només dades de text)
  createViatge(data: any): Observable<any> {
    return this.api.post('viatges', data);
  }

  // Actualitzar un viatge (dades de text)
  updateViatge(id: number, data: any): Observable<any> {
    // Fem servir PUT per actualitzar. Laravel ho gestionarà.
    return this.api.put(`viatges/${id}`, data);
  }

  // Esborrar un viatge
  deleteViatge(id: number): Observable<any> {
    return this.api.delete(`viatges/${id}`);
  }

  // --- Funcions de Pujada d'Imatges (FormData) ---

  uploadImatgePrincipal(viatgeId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('imatge_principal', file, file.name);

    // Cridem el nou mètode per a FormData
    return this.api.postWithFormData(`viatges/${viatgeId}/upload-principal`, formData);
  }

  uploadFotoGaleria(viatgeId: number, file: File, altText: string): Observable<any> {
    const formData = new FormData();
    formData.append('foto', file, file.name);
    formData.append('alt_text', altText);

    return this.api.postWithFormData(`viatges/${viatgeId}/upload-foto`, formData);
  }

  generarEnllac(plataforma: string, urlOriginal: string): Observable<any> {
    return this.api.post('generar-enllac', { 
      plataforma: plataforma, 
      url: urlOriginal 
    });
  }
}