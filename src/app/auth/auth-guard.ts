import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth'; // Import correcte

export const authGuard: CanActivateFn = (route, state) => {
  
  // Injectem els serveis que necessitem
  const authService = inject(AuthService);
  const router = inject(Router);

  // Comprovem si l'usuari té un token vàlid
  if (authService.isLoggedIn()) {
    return true; // Pot passar
  }

  // Si no té token, el redirigim al login
  router.navigate(['/login']);
  return false;
};