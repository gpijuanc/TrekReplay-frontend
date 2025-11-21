import { Injectable } from '@angular/core';
import { ApiService } from './api';
import { Router } from '@angular/router';
import { Observable, tap, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: any = null;
  public authStatus = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private api: ApiService, private router: Router) {
    // Intentar recuperar l'usuari del localStorage si recarreguem la pàgina
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.user = JSON.parse(savedUser);
    }
  }

  // Helper privat per saber si hi ha token inicialment
  private hasToken(): boolean {
    return !!localStorage.getItem('auth_token');
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
    this.authStatus.next(false);
    this.router.navigate(['/login']);
  }

  // Guardar token i usuari al navegador
  private setSession(authResult: any) {
    localStorage.setItem('auth_token', authResult.access_token);
    localStorage.setItem('user', JSON.stringify(authResult.user));
    this.user = authResult.user;
    this.authStatus.next(true)
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