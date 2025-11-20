import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrls: []
})
export class Header {
  // Variables per controlar l'estat
  isLoggedIn: boolean = false;
  isVenedor: boolean = false;
  usuariNom: string = '';

  constructor(private authService: AuthService) {
    // Comprovem l'estat inicial
    this.actualitzarEstat();
  }

  // Aquesta funció comprova l'estat. La cridarem sovint.
  actualitzarEstat() {
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      const usuari = this.authService.getUser();
      this.usuariNom = usuari?.nom || '';
      this.isVenedor = this.authService.isVenedor();
    }
  }

  // Funció de Logout
  logout() {
    this.authService.logout();
    // Un cop desloguejat, actualitzem l'estat del header
    this.actualitzarEstat();
  }
}