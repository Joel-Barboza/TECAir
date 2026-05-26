import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface ReservaCheckin {
  reservaId: number;
  asientosReservados: number;
  estadoPago: string;
  usuario: string;
  vuelo: {
    vueloId: number;
    salida: string;
    destino: string;
    fechaSalida: string;
    fechaLlegada: string;
  };
}

interface PaseAbordar {
  pasajero: string;
  vuelo: string;
  asiento: string;
  puerta: string;
  origen: string;
  destino: string;
  fechaSalida: string;
  horaSalida: string;
}

@Component({
  selector: 'app-check-in',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './check-in.component.html',
  styleUrls: ['./check-in.component.css']
})
export class CheckInComponent {

  private readonly API = 'http://localhost:5262/api/aeropuerto';

  // Búsqueda
  tipoBusqueda: 'email' | 'carnet' = 'email';
  valorBusqueda = '';

  // Resultados
  reservas: ReservaCheckin[] = [];
  reservaSeleccionada: ReservaCheckin | null = null;

  // Asientos
  filas = ['1','2','3','4','5','6','7','8','9','10','11','12'];
  columnas = ['A','B','C','D','E','F'];
  asientosOcupados: string[] = [];
  asientosSeleccionados: string[] = [];

  // Pases de abordar generados
  pasesGenerados: PaseAbordar[] = [];

  // Mensajes
  mensaje = '';
  error = '';
  cargando = false;

  constructor(private http: HttpClient) {}

  get labelBusqueda(): string {
    return this.tipoBusqueda === 'email' ? 'Email del pasajero' : 'Carnet del pasajero';
  }

  get placeholderBusqueda(): string {
    return this.tipoBusqueda === 'email' ? 'correo@gmail.com' : 'Número de carnet';
  }

  // Devuelve todos los códigos de asiento para la grilla
  get todosLosAsientos(): string[] {
    const asientos: string[] = [];
    for (const fila of this.filas) {
      for (const col of this.columnas) {
        asientos.push(fila + col);
      }
    }
    return asientos;
  }

  estaOcupado(asiento: string): boolean {
    return this.asientosOcupados.includes(asiento);
  }

  estaSeleccionado(asiento: string): boolean {
    return this.asientosSeleccionados.includes(asiento);
  }

  buscarReservas(): void {
    this.error = '';
    this.mensaje = '';
    this.reservas = [];
    this.reservaSeleccionada = null;
    this.pasesGenerados = [];

    const val = this.valorBusqueda.trim();
    if (!val) {
      this.error = 'Ingrese un valor para buscar.';
      return;
    }

    this.cargando = true;

    // El backend acepta email o carnet como parámetro en la misma ruta
    const url = this.tipoBusqueda === 'email'
      ? `${this.API}/Reservas/buscar-usuario/${encodeURIComponent(val)}`
      : `${this.API}/Reservas/buscar-carnet/${val}`;

    this.http.get<ReservaCheckin[]>(url).subscribe({
      next: (data) => {
        this.cargando = false;
        this.reservas = data;
        if (data.length === 0) {
          this.error = 'No se encontraron reservaciones para este pasajero.';
        }
      },
      error: (err) => {
        this.cargando = false;
        this.error = 'No se pudieron obtener las reservaciones.';
        console.error(err);
      }
    });
  }

  seleccionarReserva(reserva: ReservaCheckin): void {
    this.reservaSeleccionada = reserva;
    this.asientosSeleccionados = [];
    this.pasesGenerados = [];
    this.mensaje = '';
    this.error = '';
    this.cargarAsientosOcupados(reserva.vuelo.vueloId);
  }

  private cargarAsientosOcupados(vueloId: number): void {
    this.http.get<string[]>(`${this.API}/Reservas/asientos-ocupados/${vueloId}`).subscribe({
      next: (data) => {
        this.asientosOcupados = data;
      },
      error: (err) => {
        console.error('Error al cargar asientos ocupados:', err);
        this.asientosOcupados = [];
      }
    });
  }

  toggleAsiento(asiento: string): void {
    if (this.estaOcupado(asiento) || !this.reservaSeleccionada) return;

    this.error = '';
    const idx = this.asientosSeleccionados.indexOf(asiento);

    if (idx >= 0) {
      this.asientosSeleccionados.splice(idx, 1);
    } else {
      if (this.asientosSeleccionados.length >= this.reservaSeleccionada.asientosReservados) {
        this.error = `Solo puede seleccionar ${this.reservaSeleccionada.asientosReservados} asiento(s).`;
        return;
      }
      this.asientosSeleccionados.push(asiento);
    }
  }

  confirmarCheckin(): void {
    this.error = '';
    this.mensaje = '';

    if (!this.reservaSeleccionada) return;

    if (this.asientosSeleccionados.length !== this.reservaSeleccionada.asientosReservados) {
      this.error = `Debe seleccionar exactamente ${this.reservaSeleccionada.asientosReservados} asiento(s).`;
      return;
    }

    const dto = {
      reservaId: this.reservaSeleccionada.reservaId,
      asientos: this.asientosSeleccionados
    };

    this.cargando = true;

    this.http.post<{ mensaje: string; puertaAbordaje: string }>(
      `${this.API}/Reservas/checkin`, dto
    ).subscribe({
      next: (res) => {
        this.cargando = false;
        this.mensaje = res.mensaje;
        this.generarPases(res.puertaAbordaje);
        this.reservaSeleccionada = null;
        this.asientosSeleccionados = [];
      },
      error: (err) => {
        this.cargando = false;
        this.error = err.error ?? 'No se pudo realizar el check-in.';
        console.error(err);
      }
    });
  }

  private generarPases(puerta: string): void {
    if (!this.reservaSeleccionada) return;

    const r = this.reservaSeleccionada;
    const fechaSalida = new Date(r.vuelo.fechaSalida);

    this.pasesGenerados = this.asientosSeleccionados.map(asiento => ({
      pasajero: r.usuario,
      vuelo: `CR${r.vuelo.vueloId.toString().padStart(3, '0')}`,
      asiento,
      puerta,
      origen: r.vuelo.salida,
      destino: r.vuelo.destino,
      fechaSalida: fechaSalida.toLocaleDateString('es-CR', { dateStyle: 'medium' }),
      horaSalida: fechaSalida.toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' })
    }));
  }

  cancelar(): void {
    this.reservaSeleccionada = null;
    this.asientosSeleccionados = [];
    this.error = '';
    this.mensaje = '';
  }

  imprimirPase(pase: PaseAbordar): void {
    window.print();
  }

  enviarCorreo(pase: PaseAbordar): void {
    // Implementar según el servicio de correo disponible en el proyecto
    alert(`Pase enviado por correo para el vuelo ${pase.vuelo}, asiento ${pase.asiento}.`);
  }

  enviarMovil(pase: PaseAbordar): void {
    // Implementar según el servicio de mensajería disponible en el proyecto
    alert(`Pase enviado al dispositivo móvil, asiento ${pase.asiento}.`);
  }
}