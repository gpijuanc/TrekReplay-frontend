import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { Home } from './pages/home/home';
import { ViatgeDetall } from './pages/viatge-detall/viatge-detall';
import { Carret } from './pages/carret/carret';
import { authGuard } from './auth/auth-guard'
import { VenedorDashboard } from './pages/venedor-dashboard/venedor-dashboard';
import { venedorGuard } from './auth/venedor-guard';

export const routes: Routes = [
    // Ruta principal
    { path: '', component: Home },
    //Rutes
    { path: 'viatge/:id', component: ViatgeDetall },
    { path: 'carret', component: Carret, canActivate: [authGuard] },
    { path: 'dashboard', component: VenedorDashboard, canActivate: [authGuard, venedorGuard] 
  },
    // Rutes d'autenticació
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    
    // Altres rutes (encara buides)
    // { path: '', component: HomeComponent }, 
];

