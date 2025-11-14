import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: []
})
export class Register {
  // Model de dades (amb valor per defecte per al rol)
  userData = {
    nom: '',
    correu: '',
    contrasenya: '',
    role_id: 3, // Per defecte Comprador
    OTA: false // Per defecte no és agència
  };
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    // Cridem al servei de registre
    this.authService.register(this.userData).subscribe({
      next: (res) => {
        console.log('Registre correcte', res);
        // Redirigim a l'inici (ja autenticats)
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Error de registre', err);
        // Gestionem l'error (ex: correu ja existeix)
        if (err.error && err.error.correu) {
            this.errorMessage = 'Aquest correu ja està registrat.';
        } else if (err.error && err.error.contrasenya) {
            this.errorMessage = 'La contrasenya ha de tenir mínim 8 caràcters.';
        } else {
            this.errorMessage = 'Error en el registre. Revisa les dades.';
        }
      }
    });
  }
}