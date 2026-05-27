import { Routes } from '@angular/router';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

export const routes: Routes = [
  { path: 'usuarios', component: UsuariosComponent },
  { path: '', component: DashboardComponent },
  { path: '', redirectTo: '/usuarios', pathMatch: 'full' } // Redirige al inicio
];