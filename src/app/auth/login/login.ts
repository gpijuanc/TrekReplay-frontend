import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Necessari per als formularis (ngModel)
import { AuthService } from '../../services/auth'; // Importa el teu servei
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], // Importem mòduls aquí
  templateUrl: './login.html', // Assegura't que el fitxer HTML es diu així
  styleUrls: [] // Si tens CSS específic
})
export class Login {
  // Model de dades
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
        // Redirigir segons el rol? De moment al panell principal o home
        // Si és venedor -> /dashboard, si és comprador -> /home
        this.router.navigate(['/']); 
      },
      error: (err) => {
        console.error('Error de login', err);
        this.errorMessage = 'Credencials incorrectes o error al servidor.';
      }
    });
  }
}