import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth'; 
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterModule], 
  templateUrl: './login.html', 
})
export class Login {
  credentials = {
    correu: '',
    contrasenya: ''
  };
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.login(this.credentials).subscribe({
      next: (res) => {
        console.log('Login correcte', res);
        
        // === INICI DE LA MODIFICACIÓ ===
        // Comprovem el rol per a la redirecció
        if (this.authService.isVenedor()) {
          // Si és Venedor (role_id 2), va al seu panell
          this.router.navigate(['/dashboard']); 
        } else {
          // Si és Comprador (role_id 3) o Admin, va a la Home
          this.router.navigate(['/']); 
        }

      },
      error: (err) => {
        console.error('Error de login', err);
        this.errorMessage = 'Credencials incorrectes o error al servidor.';
      }
    });
  }
}