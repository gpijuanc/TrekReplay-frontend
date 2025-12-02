import { Component, OnInit } from '@angular/core';
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
export class Header implements OnInit {
  
  isLoggedIn: boolean = false;
  isVenedor: boolean = false;
  usuariNom: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // Ens subscrivim: Aquest codi s'executa AUTOMÀTICAMENT
    this.authService.authStatus.subscribe(isAuthenticated => {
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