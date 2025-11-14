import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';

export const routes: Routes = [
    // Rutes d'autenticació
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    
    // Altres rutes (encara buides)
    // { path: '', component: HomeComponent }, 
];

