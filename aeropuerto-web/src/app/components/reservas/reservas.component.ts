import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservasService, Reserva } from '../../services/reservas.service';

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ReservasComponent implements OnInit {
  reservas: Reserva[] = [];
  formulario: Reserva = this.formularioVacio();
  modoEdicion = false;
  mostrarFormulario = false;
  mensaje = '';
  error = '';

  constructor(private reservasService: ReservasService) {}

  ngOnInit(): void {
    this.cargarReservas();
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

  abrirEditar(reserva: Reserva): void {
    this.formulario = { ...reserva };
    this.modoEdicion = true;
    this.mostrarFormulario = true;
    this.mensaje = '';
    this.error = '';
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