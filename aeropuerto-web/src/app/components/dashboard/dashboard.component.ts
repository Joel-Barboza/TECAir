import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuariosComponent } from '../usuarios/usuarios.component'; // importa el componente standalone
import { VuelosComponent } from '../vuelos/vuelos.component'; // nuevo
import { ReservasComponent } from '../reservas/reservas.component'; // nuevo
import { PromocionesComponent } from '../promociones/promociones.component'; // nuevo
import { MaletasComponent } from '../maletas/maletas.component';
import { CheckInComponent } from "../check-in/check-in.component"; // nuevo

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    UsuariosComponent,
    VuelosComponent,
    ReservasComponent,
    PromocionesComponent,
    MaletasComponent,
    CheckInComponent
]
})
export class DashboardComponent {
  seccionSeleccionada = 'usuarios';

  menu = [
    { nombre: 'Usuarios', valor: 'usuarios' },
    { nombre: 'Vuelos', valor: 'vuelos' },
    { nombre: 'Reservas', valor: 'reservas' },
    { nombre: 'Promociones', valor: 'promociones' },
    { nombre: 'Maletas', valor: 'maletas' },
    { nombre: 'Check-in', valor: 'check-in' }
  ];

  seleccionarSeccion(valor: string) {
    this.seccionSeleccionada = valor;
  }
}