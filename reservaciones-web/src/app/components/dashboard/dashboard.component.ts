import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  menu = [
    { nombre: 'Usuarios', valor: 'usuarios' },
    { nombre: 'Buscar vuelos', valor: 'vuelos' },
    { nombre: 'Reservas', valor: 'reservas' },
    { nombre: 'Promociones', valor: 'promociones' }
  ];

  constructor(private router: Router) {}

  get seccionActual(): string {
    const seg = this.router.url.split('/').pop() || 'usuarios';
    return this.menu.find(m => m.valor === seg)?.nombre ?? 'TECAir';
  }
}
