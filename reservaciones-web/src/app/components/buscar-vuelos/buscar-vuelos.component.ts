import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Usuario, UsuarioService } from '../../services/usuario.service';
import { Vuelo, VuelosService } from '../../services/vuelos.service';
import { Reserva, ReservasService } from '../../services/reservas.service';

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
  usuarios: Usuario[] = [];
  usuarioSeleccionadoId = 0;
  selectedVuelo: Vuelo | null = null;
  asientosReservados = 1;
  tarjeta = '';
  vencimiento = '';
  cvc = '';
  mensaje = '';
  error = '';

  constructor(
    private vuelosService: VuelosService,
    private usuarioService: UsuarioService,
    private reservasService: ReservasService
  ) {}

  ngOnInit(): void {
    this.cargarVuelos();
    this.cargarUsuarios();
  }

  cargarVuelos(): void {
    this.vuelosService.getVuelos().subscribe({
      next: (data) => {
        this.vuelos = data;
        this.resultados = data;
      },
      error: (err) => {
        this.error = 'No se pudieron cargar los vuelos.';
        console.error(err);
      }
    });
  }

  cargarUsuarios(): void {
    this.usuarioService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
      },
      error: (err) => {
        this.error = 'No se pudieron cargar los usuarios.';
        console.error(err);
      }
    });
  }

  buscar(): void {
    const origenTexto = this.origen.trim().toLowerCase();
    const destinoTexto = this.destino.trim().toLowerCase();

    this.resultados = this.vuelos.filter((vuelo) => {
      const cumpleOrigen = origenTexto ? vuelo.salida.toLowerCase().includes(origenTexto) : true;
      const cumpleDestino = destinoTexto ? vuelo.destino.toLowerCase().includes(destinoTexto) : true;
      return cumpleOrigen && cumpleDestino;
    });

    if (this.resultados.length === 0) {
      this.mensaje = 'No se encontraron vuelos con esos aeropuertos.';
    } else {
      this.mensaje = '';
    }
    this.selectedVuelo = null;
  }

  seleccionarVuelo(vuelo: Vuelo): void {
    this.selectedVuelo = vuelo;
    this.mensaje = '';
    this.error = '';
    this.asientosReservados = 1;
  }

  crearReserva(): void {
    this.error = '';
    this.mensaje = '';

    if (!this.selectedVuelo) {
      this.error = 'Seleccione un vuelo antes de reservar.';
      return;
    }

    if (!this.usuarioSeleccionadoId) {
      this.error = 'Seleccione un usuario existente o cree uno en la sección Usuarios.';
      return;
    }

    if (this.asientosReservados < 1) {
      this.error = 'Debe reservar al menos un asiento.';
      return;
    }

    if (!this.tarjeta || !this.vencimiento || !this.cvc) {
      this.error = 'Complete los datos de la tarjeta para el pago.';
      return;
    }

    const nuevaReserva: Reserva = {
      usuarioId: this.usuarioSeleccionadoId,
      vueloId: this.selectedVuelo.vueloId,
      fechaReserva: new Date().toISOString(),
      asientosReservados: this.asientosReservados,
      estadoPago: 'Pagado'
    };

    this.reservasService.crearReserva(nuevaReserva).subscribe({
      next: () => {
        this.mensaje = 'Reserva realizada con éxito y pago confirmado.';
        this.selectedVuelo = null;
        this.usuarioSeleccionadoId = 0;
        this.asientosReservados = 1;
        this.tarjeta = '';
        this.vencimiento = '';
        this.cvc = '';
      },
      error: (err) => {
        this.error = 'No se pudo completar la reserva.';
        console.error(err);
      }
    });
  }
}
