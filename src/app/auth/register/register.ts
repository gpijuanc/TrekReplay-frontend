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
  userData = {
    nom: '',
    correu: '',
    contrasenya: '',
    role_id: 3, 
    OTA: false
  };
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.register(this.userData).subscribe({
      next: (res) => {
        console.log('Registre correcte', res);
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Error de registre', err);
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