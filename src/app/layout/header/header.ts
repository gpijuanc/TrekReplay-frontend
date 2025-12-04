import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrls: []
})
export class Header implements OnInit {
  readonly #destroyRef = inject(DestroyRef);
  isLoggedIn: boolean = false;
  isVenedor: boolean = false;
  usuariNom: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // Ens subscrivim: Aquest codi s'executa AUTOMÀTICAMENT
    this.authService.authStatus.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(isAuthenticated => {
      this.isLoggedIn = isAuthenticated;
      
      if (this.isLoggedIn) {
        const usuari = this.authService.getUser();
        this.usuariNom = usuari?.nom || '';
        this.isVenedor = this.authService.isVenedor();
      } else {
        this.isVenedor = false;
        this.usuariNom = '';
      }
    });
  }

  logout() {
    this.authService.logout();
  }
}