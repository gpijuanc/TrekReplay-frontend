import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth'; // Import correcte

export const venedorGuard: CanActivateFn = (route, state) => {
  
  const authService = inject(AuthService);
  const router = inject(Router);

  // Comprovem DUES coses: Està loguejat I és Venedor (role_id == 2)?
  if (authService.isLoggedIn() && authService.isVenedor()) {
    return true; // Pot passar
  }

  // Si és un Comprador o no està loguejat, el redirigim a la pàgina principal
  router.navigate(['/']); 
  return false;
};