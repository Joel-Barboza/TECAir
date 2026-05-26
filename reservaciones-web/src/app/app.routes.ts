import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { BuscarVuelosComponent } from './components/buscar-vuelos/buscar-vuelos.component';
import { ReservasComponent } from './components/reservas/reservas.component';
import { PromocionesComponent } from './components/promociones/promociones.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
    children: [
      { path: 'vuelos', component: BuscarVuelosComponent },
      { path: 'reservas', component: ReservasComponent },
      { path: 'promociones', component: PromocionesComponent },
      { path: '', redirectTo: 'vuelos', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
