import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../services/usuario.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  menu = [
    { nombre: 'Buscar Vuelos', valor: 'vuelos' },
    { nombre: 'Mis Reservas', valor: 'reservas' },
    { nombre: 'Promociones', valor: 'promociones' }
  ];

  constructor(private router: Router, private authService: AuthService) {}

  get currentUser(): Usuario | null {
    return this.authService.currentUser;
  }

  get seccionActual(): string {
    const seg = this.router.url.split('/').pop()?.split('?')[0] || 'vuelos';
    return this.menu.find(m => m.valor === seg)?.nombre ?? 'Dashboard';
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
