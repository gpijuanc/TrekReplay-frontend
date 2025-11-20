import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) { }

  // Mètode privat per obtenir les capçaleres BÀSIQUES (Token i Accept)
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    let headers = new HttpHeaders({
      'Accept': 'application/json'
    });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }


  get(endpoint: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${endpoint}`, { headers: this.getAuthHeaders() });
  }

  post(endpoint: string, data: any): Observable<any> {
    // Afegim la capçalera JSON
    const headers = this.getAuthHeaders().set('Content-Type', 'application/json');
    return this.http.post(`${this.baseUrl}/${endpoint}`, data, { headers: headers });
  }

  put(endpoint: string, data: any): Observable<any> {
    const headers = this.getAuthHeaders().set('Content-Type', 'application/json');
    return this.http.put(`${this.baseUrl}/${endpoint}`, data, { headers: headers });
  }

  delete(endpoint: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${endpoint}`, { headers: this.getAuthHeaders() });
  }


  // === NOU MÈTODE PER PUJAR FITXERS (FormData) ===

  postWithFormData(endpoint: string, formData: FormData): Observable<any> {
    // Important: NO afegim 'Content-Type'. 
    // El navegador ho farà automàticament amb el 'boundary' correcte per a FormData.
    return this.http.post(`${this.baseUrl}/${endpoint}`, formData, { 
      headers: this.getAuthHeaders() 
    });
  }
}