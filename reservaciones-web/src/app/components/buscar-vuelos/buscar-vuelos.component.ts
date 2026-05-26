import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Vuelo, VuelosService } from '../../services/vuelos.service';
import { Reserva, ReservasService } from '../../services/reservas.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-buscar-vuelos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './buscar-vuelos.component.html',
  styleUrls: ['./buscar-vuelos.component.css']
})
export class BuscarVuelosComponent implements OnInit {
  origen = '';
  destino = '';
  vuelos: Vuelo[] = [];
  resultados: Vuelo[] = [];
  selectedVuelo: Vuelo | null = null;
  asientosReservados = 1;
  tarjeta = '';
  vencimiento = '';
  cvc = '';
  mensaje = '';
  error = '';
  buscado = false;

  constructor(
    private vuelosService: VuelosService,
    private reservasService: ReservasService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.vuelosService.getVuelos().subscribe({
      next: (data) => (this.vuelos = data),
      error: () => (this.error = 'No se pudieron cargar los vuelos.')
    });
  }

  buscar(): void {
    this.buscado = true;
    const origenTexto = this.origen.trim().toLowerCase();
    const destinoTexto = this.destino.trim().toLowerCase();

    this.resultados = this.vuelos.filter((vuelo) => {
      const cumpleOrigen = origenTexto ? vuelo.salida.toLowerCase().includes(origenTexto) : true;
      const cumpleDestino = destinoTexto ? vuelo.destino.toLowerCase().includes(destinoTexto) : true;
      return cumpleOrigen && cumpleDestino;
    });

    this.mensaje = this.resultados.length === 0 ? 'No se encontraron vuelos con esos aeropuertos.' : '';
    this.selectedVuelo = null;
  }

  seleccionarVuelo(vuelo: Vuelo): void {
    this.selectedVuelo = vuelo;
    this.mensaje = '';
    this.error = '';
    this.asientosReservados = 1;
    this.tarjeta = '';
    this.vencimiento = '';
    this.cvc = '';
  }

  crearReserva(): void {
    this.error = '';
    this.mensaje = '';

    const usuario = this.authService.currentUser;
    if (!usuario?.usuarioId || !this.selectedVuelo) return;

    if (this.asientosReservados < 1) {
      this.error = 'Debe reservar al menos un asiento.';
      return;
    }

    if (!this.tarjeta.trim() || !this.vencimiento.trim() || !this.cvc.trim()) {
      this.error = 'Complete todos los datos de la tarjeta de crédito.';
      return;
    }

    const nuevaReserva: Reserva = {
      usuarioId: usuario.usuarioId,
      vueloId: this.selectedVuelo.vueloId,
      fechaReserva: new Date().toISOString(),
      asientosReservados: this.asientosReservados,
      estadoPago: 'Pagado'
    };

    this.reservasService.crearReserva(nuevaReserva).subscribe({
      next: () => {
        this.mensaje = '¡Reserva confirmada! El pago fue procesado exitosamente.';
        this.selectedVuelo = null;
        this.asientosReservados = 1;
        this.tarjeta = '';
        this.vencimiento = '';
        this.cvc = '';
      },
      error: () => (this.error = 'No se pudo completar la reserva. Intente de nuevo.')
    });
  }
}
