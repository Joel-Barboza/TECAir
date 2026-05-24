import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservasService, Reserva } from '../../services/reservas.service';
import { Usuario, UsuarioService } from '../../services/usuario.service';
import { Vuelo, VuelosService } from '../../services/vuelos.service';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css']
})
export class ReservasComponent implements OnInit {
  todasReservas: Reserva[] = [];
  reservas: Reserva[] = [];
  usuarios: Usuario[] = [];
  vuelos: Vuelo[] = [];
  usuarioFiltroId = 0;
  mensaje = '';
  error = '';

  constructor(
    private reservasService: ReservasService,
    private usuarioService: UsuarioService,
    private vuelosService: VuelosService
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.error = '';
    this.usuarioService.getUsuarios().subscribe({
      next: (data) => (this.usuarios = data),
      error: () => (this.error = 'No se pudieron cargar los usuarios.')
    });

    this.vuelosService.getVuelos().subscribe({
      next: (data) => (this.vuelos = data),
      error: () => (this.error = 'No se pudieron cargar los vuelos.')
    });

    this.reservasService.getReservas().subscribe({
      next: (data) => {
        this.todasReservas = data;
        this.aplicarFiltro();
      },
      error: () => (this.error = 'No se pudieron cargar las reservas.')
    });
  }

  aplicarFiltro(): void {
    if (this.usuarioFiltroId) {
      this.reservas = this.todasReservas.filter(r => r.usuarioId === +this.usuarioFiltroId);
    } else {
      this.reservas = [...this.todasReservas];
    }
  }

  getNombreUsuario(usuarioId: number): string {
    const usuario = this.usuarios.find((u) => u.usuarioId === usuarioId);
    return usuario ? `${usuario.nombre} ${usuario.apellido1}` : `Usuario #${usuarioId}`;
  }

  getRutaVuelo(vueloId: number): string {
    const vuelo = this.vuelos.find((v) => v.vueloId === vueloId);
    return vuelo ? `${vuelo.salida} → ${vuelo.destino}` : `Vuelo #${vueloId}`;
  }

  cancelarReserva(reservaId: number): void {
    if (!confirm('¿Desea cancelar esta reserva?')) return;

    this.reservasService.eliminarReserva(reservaId).subscribe({
      next: () => {
        this.mensaje = 'Reserva cancelada.';
        this.cargarDatos();
      },
      error: () => (this.error = 'No se pudo cancelar la reserva.')
    });
  }
}
