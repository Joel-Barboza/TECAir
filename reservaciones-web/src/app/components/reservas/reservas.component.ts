import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservasService, Reserva } from '../../services/reservas.service';
import { Usuario, UsuarioService } from '../../services/usuario.service';
import { Vuelo, VuelosService } from '../../services/vuelos.service';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css']
})
export class ReservasComponent implements OnInit {
  reservas: Reserva[] = [];
  usuarios: Usuario[] = [];
  vuelos: Vuelo[] = [];
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
    this.mensaje = '';
    this.usuarioService.getUsuarios().subscribe({
      next: (data) => (this.usuarios = data),
      error: (err) => {
        this.error = 'No se pudieron cargar los usuarios.';
        console.error(err);
      }
    });

    this.vuelosService.getVuelos().subscribe({
      next: (data) => (this.vuelos = data),
      error: (err) => {
        this.error = 'No se pudieron cargar los vuelos.';
        console.error(err);
      }
    });

    this.reservasService.getReservas().subscribe({
      next: (data) => (this.reservas = data),
      error: (err) => {
        this.error = 'No se pudieron cargar las reservas.';
        console.error(err);
      }
    });
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
    if (!confirm('¿Desea cancelar esta reserva?')) {
      return;
    }

    this.reservasService.eliminarReserva(reservaId).subscribe({
      next: () => {
        this.mensaje = 'Reserva cancelada.';
        this.cargarDatos();
      },
      error: (err) => {
        this.error = 'No se pudo cancelar la reserva.';
        console.error(err);
      }
    });
  }
}
