import { Component } from '@angular/core';
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
export class ReservasComponent {
  reservas: Reserva[] = [];
  nuevaReserva: Reserva = {
    usuarioId: 0,
    vueloId: 0,
    fechaReserva: '',
    cantidadAsientos: 1
  };

  constructor(private reservasService: ReservasService) {
    this.cargarReservas();
  }

  cargarReservas() {
    this.reservasService.getReservas().subscribe(data => {
      this.reservas = data;
    });
  }

  agregarReserva() {
    this.reservasService.crearReserva(this.nuevaReserva).subscribe(() => {
      this.cargarReservas();
      this.nuevaReserva = {
        usuarioId: 0,
        vueloId: 0,
        fechaReserva: '',
        cantidadAsientos: 1
      };
    });
  }

  eliminarReserva(id: number) {
    this.reservasService.eliminarReserva(id).subscribe(() => {
      this.cargarReservas();
    });
  }
}