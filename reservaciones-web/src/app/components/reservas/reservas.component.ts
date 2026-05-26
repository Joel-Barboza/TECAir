import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservasService, Reserva } from '../../services/reservas.service';
import { Vuelo, VuelosService } from '../../services/vuelos.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css']
})
export class ReservasComponent implements OnInit {
  reservas: Reserva[] = [];
  vuelos: Vuelo[] = [];
  mensaje = '';
  error = '';

  constructor(
    private reservasService: ReservasService,
    private vuelosService: VuelosService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.error = '';
    this.mensaje = '';
    const usuarioId = this.authService.currentUser?.usuarioId;

    this.vuelosService.getVuelos().subscribe({
      next: (data) => (this.vuelos = data),
      error: () => {}
    });

    this.reservasService.getReservas().subscribe({
      next: (data) => {
        this.reservas = data.filter(r => r.usuarioId === usuarioId);
      },
      error: () => {
        this.error = 'No se pudieron cargar las reservas. Verifique que el servidor esté activo.';
      }
    });
  }

  getRutaVuelo(vueloId: number): string {
    const vuelo = this.vuelos.find(v => v.vueloId === vueloId);
    return vuelo ? `${vuelo.salida} → ${vuelo.destino}` : `Vuelo #${vueloId}`;
  }

  getFechaVuelo(vueloId: number): string {
    const vuelo = this.vuelos.find(v => v.vueloId === vueloId);
    return vuelo ? vuelo.fechaSalida : '';
  }

  cancelarReserva(reservaId: number): void {
    if (!confirm('¿Está seguro de que desea cancelar esta reserva?')) return;

    this.reservasService.eliminarReserva(reservaId).subscribe({
      next: () => {
        this.mensaje = 'Reserva cancelada exitosamente.';
        this.cargarDatos();
      },
      error: () => (this.error = 'No se pudo cancelar la reserva.')
    });
  }
}
