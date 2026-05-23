import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuariosComponent } from '../usuarios/usuarios.component'; // importa el componente standalone

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, UsuariosComponent]  // <-- agrega aquí
})
export class DashboardComponent {
  seccionSeleccionada = 'usuarios';

  menu = [
    { nombre: 'Usuarios', valor: 'usuarios' },
    { nombre: 'Vuelos', valor: 'vuelos' },
    { nombre: 'Reservas', valor: 'reservas' },
    { nombre: 'Promociones', valor: 'promociones' },
    { nombre: 'Maletas', valor: 'maletas' }
  ];

  seleccionarSeccion(valor: string) {
    this.seccionSeleccionada = valor;
  }
}