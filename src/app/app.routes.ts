import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { Home } from './pages/home/home';

export const routes: Routes = [
    // Ruta principal
    { path: '', component: Home },
    // Rutes d'autenticació
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    
    // Altres rutes (encara buides)
    // { path: '', component: HomeComponent }, 
];

