import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
  reservaConfirmada = false;
  vueloConfirmado: Vuelo | null = null;

  constructor(
    private vuelosService: VuelosService,
    private reservasService: ReservasService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.vuelosService.getVuelos().subscribe({
      next: (data) => {
        this.vuelos = data;
        this.resultados = data;
      },
      error: () => (this.error = 'No se pudieron cargar los vuelos.')
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

    this.mensaje = this.resultados.length === 0 ? 'No se encontraron vuelos con esos filtros.' : '';
    this.selectedVuelo = null;
  }

  limpiarBusqueda(): void {
    this.origen = '';
    this.destino = '';
    this.resultados = [...this.vuelos];
    this.mensaje = '';
    this.selectedVuelo = null;
  }

  seleccionarVuelo(vuelo: Vuelo): void {
    this.selectedVuelo = vuelo;
    this.error = '';
    this.asientosReservados = 1;
    this.tarjeta = '';
    this.vencimiento = '';
    this.cvc = '';
    this.reservaConfirmada = false;
  }

  // ── Formateo de tarjeta ─────────────────────────────
  onTarjetaInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '').slice(0, 16);
    this.tarjeta = digits.replace(/(.{4})/g, '$1 ').trim();
    input.value = this.tarjeta;
  }

  onVencimientoInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let digits = input.value.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) {
      digits = digits.slice(0, 2) + '/' + digits.slice(2);
    }
    this.vencimiento = digits;
    input.value = this.vencimiento;
  }

  onCvcInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.cvc = input.value.replace(/\D/g, '').slice(0, 3);
    input.value = this.cvc;
  }

  // ── Validaciones ────────────────────────────────────
  get tarjetaValida(): boolean {
    return this.tarjeta.replace(/\s/g, '').length === 16;
  }

  get vencimientoValido(): boolean {
    return /^\d{2}\/\d{2}$/.test(this.vencimiento);
  }

  get cvcValido(): boolean {
    return this.cvc.length === 3;
  }

  // ── Crear reserva ───────────────────────────────────
  crearReserva(): void {
    this.error = '';

    const usuario = this.authService.currentUser;
    if (!usuario?.usuarioId || !this.selectedVuelo) return;

    if (this.asientosReservados < 1) {
      this.error = 'Debe reservar al menos un asiento.';
      return;
    }

    if (!this.tarjetaValida || !this.vencimientoValido || !this.cvcValido) {
      this.error = 'Verifique los datos de la tarjeta.';
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
        this.vueloConfirmado = this.selectedVuelo;
        this.reservaConfirmada = true;
        this.selectedVuelo = null;
        this.asientosReservados = 1;
        this.tarjeta = '';
        this.vencimiento = '';
        this.cvc = '';
      },
      error: () => (this.error = 'No se pudo completar la reserva. Intente de nuevo.')
    });
  }

  irAReservas(): void {
    this.router.navigate(['/dashboard/reservas']);
  }
}
