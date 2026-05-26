import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservasService, Reserva, ReservaDto } from '../../services/reservas.service';
import { VuelosService, VueloDto } from '../../services/vuelos.service';
import { UsuarioService, UsuarioDto } from '../../services/usuario.service';

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ReservasComponent implements OnInit {
  reservas: ReservaDto[] = [];
  formulario: Reserva = this.formularioVacio();
  modoEdicion = false;
  mostrarFormulario = false;
  mensaje = '';
  error = '';
  vuelos: VueloDto[] = [];
  usuarios: UsuarioDto[] = [];

  constructor(
    private reservasService: ReservasService,
    private vuelosService: VuelosService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.cargarReservas();
    this.cargarVuelos();
    this.cargarUsuarios();
  }

  private cargarVuelos(): void {
    this.vuelosService.getVuelos().subscribe({
      next: (data) => {
        this.vuelos = data;
      },
      error: (err) => {
        console.error('Error cargando vuelos:', err);
      }
    });
  }

  private cargarUsuarios(): void {
    this.usuarioService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
      },
      error: (err) => {
        console.error('Error cargando usuarios:', err);
      }
    });
  }

  private formularioVacio(): Reserva {
    return {
      usuarioId: 0,
      vueloId: 0,
      fechaReserva: '',
      asientosReservados: 1,
      estadoPago: 'Pendiente'
    };
  }

  cargarReservas(): void {
    this.reservasService.getReservas().subscribe({
      next: (data) => {
        console.log('Reservas cargadas:', data);
        this.reservas = data;
      },
      error: (err) => {
        console.error('Error cargando reservas:', err);
        this.error = 'No se pudieron cargar las reservas.';
      }
    });
  }

  abrirEditar(reserva: ReservaDto): void {
    this.formulario = {
      reservaId: reserva.reservaId,
      usuarioId: reserva.usuarioId,
      vueloId: reserva.vueloId,
      fechaReserva: this.formatearFecha(reserva.fechaReserva),
      asientosReservados: reserva.asientosReservados,
      estadoPago: reserva.estadoPago
    };

    this.modoEdicion = true;
    this.mostrarFormulario = true;
    this.mensaje = '';
    this.error = '';
  }

  private formatearFecha(fecha: string): string {
    if (!fecha) return '';
    return fecha.split('+')[0].split('Z')[0].substring(0, 16);
  }

  cancelar(): void {
    this.formulario = this.formularioVacio();
    this.modoEdicion = false;
    this.mostrarFormulario = false;
  }

  guardar(): void {
    this.error = '';
    this.mensaje = '';

    if (!this.formulario.usuarioId || !this.formulario.vueloId || !this.formulario.fechaReserva ||
        !this.formulario.asientosReservados || !this.formulario.estadoPago) {
      this.error = 'Debe completar todos los campos.';
      return;
    }

    if (this.modoEdicion && this.formulario.reservaId) {
      this.reservasService.actualizarReserva(this.formulario).subscribe({
        next: () => {
          this.mensaje = 'Reserva actualizada correctamente.';
          this.modoEdicion = false;
          this.mostrarFormulario = false;
          this.formulario = this.formularioVacio();
          this.cargarReservas();
        },
        error: (err) => {
          console.error('Error actualizando reserva:', err);
          this.error = 'No se pudo actualizar la reserva.';
        }
      });
    } else {
      this.reservasService.crearReserva(this.formulario).subscribe({
        next: () => {
          this.mensaje = 'Reserva agregada correctamente.';
          this.formulario = this.formularioVacio();
          this.mostrarFormulario = false;
          this.cargarReservas();
        },
        error: (err) => {
          console.error('Error creando reserva:', err);
          this.error = 'No se pudo crear la reserva.';
        }
      });
    }
  }

  eliminarReserva(reservaId: number): void {
    this.reservasService.eliminarReserva(reservaId).subscribe({
      next: () => {
        this.mensaje = 'Reserva eliminada.';
        this.cargarReservas();
      },
      error: (err) => {
        console.error('Error eliminando reserva:', err);
        this.error = 'No se pudo eliminar la reserva.';
      }
    });
  }

  abrirNuevaReserva(): void {
    this.formulario = this.formularioVacio();
    this.modoEdicion = false;
    this.mostrarFormulario = true;
    this.mensaje = '';
    this.error = '';
  }
}
