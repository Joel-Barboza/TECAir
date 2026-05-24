import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { BuscarVuelosComponent } from './components/buscar-vuelos/buscar-vuelos.component';
import { ReservasComponent } from './components/reservas/reservas.component';
import { PromocionesComponent } from './components/promociones/promociones.component';

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: 'usuarios', component: UsuariosComponent },
      { path: 'vuelos', component: BuscarVuelosComponent },
      { path: 'reservas', component: ReservasComponent },
      { path: 'promociones', component: PromocionesComponent },
      { path: '', redirectTo: 'usuarios', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '' }
];
