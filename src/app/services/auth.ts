import { Injectable } from '@angular/core';
import { ApiService } from './api';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: any = null;

  constructor(private api: ApiService, private router: Router) {
    // Intentar recuperar l'usuari del localStorage si recarreguem la pàgina
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.user = JSON.parse(savedUser);
    }
  }

  // Registre (envia role_id, etc.)
  register(data: any): Observable<any> {
    return this.api.post('register', data).pipe(
      tap(response => this.setSession(response))
    );
  }

  // Login
  login(credentials: any): Observable<any> {
    return this.api.post('login', credentials).pipe(
      tap(response => this.setSession(response))
    );
  }

  // Tancar sessió
  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    this.user = null;
    this.router.navigate(['/login']);
  }

  // Guardar token i usuari al navegador
  private setSession(authResult: any) {
    localStorage.setItem('auth_token', authResult.access_token);
    localStorage.setItem('user', JSON.stringify(authResult.user));
    this.user = authResult.user;
  }

  // Helpers
  isLoggedIn(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  getUser() {
    return this.user;
  }

  isVenedor(): boolean {
    return this.user?.role_id === 2;
  }
}