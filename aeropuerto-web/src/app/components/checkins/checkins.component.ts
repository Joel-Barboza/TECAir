import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CheckinsService, CheckinDto, CrearCheckin } from '../../services/checkins.service';
import { ReservasService, ReservaDto } from '../../services/reservas.service';
import { VuelosService, VueloDto } from '../../services/vuelos.service';

@Component({
  selector: 'app-checkins',
  templateUrl: './checkins.component.html',
  styleUrls: ['./checkins.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class CheckinsComponent implements OnInit {
  checkins: CheckinDto[] = [];
  reservas: ReservaDto[] = [];
  vuelos: VueloDto[] = [];
  formulario: CrearCheckin = this.formularioVacio();
  mostrarFormulario = false;
  mensaje = '';
  error = '';
  reservaSeleccionada?: ReservaDto;
  vueloSeleccionado?: VueloDto;
  asientoOpciones: string[] = [];
  paseSeleccionado?: CheckinDto;

  tiposAsiento = ['Ventana', 'Pasillo', 'Centro', 'Preferencial'];
  metodosEnvio = [
    { valor: 'Correo', texto: 'Enviar por correo' },
    { valor: 'Impresora', texto: 'Enviar a impresora' },
    { valor: 'Movil', texto: 'Enviar a dispositivo móvil' }
  ];

  constructor(
    private checkinsService: CheckinsService,
    private reservasService: ReservasService,
    private vuelosService: VuelosService
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cargarCheckins();
    this.cargarReservas();
    this.cargarVuelos();
  }

  cargarCheckins(): void {
    this.checkinsService.getCheckins().subscribe({
      next: (data) => {
        this.checkins = data;
        this.actualizarSeleccionReserva();
      },
      error: (err) => {
        console.error('Error cargando check-ins:', err);
        this.error = 'No se pudieron cargar los check-ins.';
      }
    });
  }

  cargarReservas(): void {
    this.reservasService.getReservas().subscribe({
      next: (data) => {
        this.reservas = data;
        this.actualizarSeleccionReserva();
      },
      error: (err) => {
        console.error('Error cargando reservas:', err);
        this.error = 'No se pudieron cargar las reservas.';
      }
    });
  }

  cargarVuelos(): void {
    this.vuelosService.getVuelos().subscribe({
      next: (data) => {
        this.vuelos = data;
        this.actualizarSeleccionReserva();
      },
      error: (err) => {
        console.error('Error cargando vuelos:', err);
        this.error = 'No se pudieron cargar los vuelos.';
      }
    });
  }

  private formularioVacio(): CrearCheckin {
    return {
      reservaId: 0,
      numAsiento: '',
      tipo: 'Ventana',
      metodoEnvio: 'Impresora'
    };
  }

  get reservasPendientes(): ReservaDto[] {
    const reservasConCheckin = new Set(this.checkins.map(c => Number(c.reservaId)));
    return this.reservas.filter(r => !reservasConCheckin.has(Number(r.reservaId)));
  }

  abrirNuevoCheckin(): void {
    this.formulario = this.formularioVacio();
    this.reservaSeleccionada = undefined;
    this.vueloSeleccionado = undefined;
    this.asientoOpciones = [];
    this.paseSeleccionado = undefined;
    this.mostrarFormulario = true;
    this.mensaje = '';
    this.error = '';
  }

  cancelar(): void {
    this.formulario = this.formularioVacio();
    this.reservaSeleccionada = undefined;
    this.vueloSeleccionado = undefined;
    this.asientoOpciones = [];
    this.mostrarFormulario = false;
    this.error = '';
  }

  actualizarSeleccionReserva(): void {
    if (!this.formulario.reservaId) {
      this.reservaSeleccionada = undefined;
      this.vueloSeleccionado = undefined;
      this.asientoOpciones = [];
      this.formulario.numAsiento = '';
      return;
    }

    this.reservaSeleccionada = this.reservas.find(
      r => Number(r.reservaId) === Number(this.formulario.reservaId)
    );

    this.vueloSeleccionado = this.vuelos.find(
      v => Number(v.vueloId) === Number(this.reservaSeleccionada?.vueloId)
    );

    this.generarAsientosDisponibles();
  }

  generarAsientosDisponibles(): void {
    if (!this.vueloSeleccionado) {
      this.asientoOpciones = [];
      return;
    }

    const letras = ['A', 'B', 'C', 'D', 'E', 'F'];
    const cantidadAsientos = Number(this.vueloSeleccionado.asientos) || 0;
    const opciones: string[] = [];

    for (let i = 0; i < cantidadAsientos; i++) {
      const fila = Math.floor(i / letras.length) + 1;
      const letra = letras[i % letras.length];
      opciones.push(`${fila}${letra}`);
    }

    const ocupados = new Set(
      this.checkins
        .filter(c => Number(c.vueloId) === Number(this.vueloSeleccionado?.vueloId))
        .map(c => c.numAsiento?.toUpperCase())
    );

    this.asientoOpciones = opciones.filter(a => !ocupados.has(a.toUpperCase()));

    if (this.formulario.numAsiento && ocupados.has(this.formulario.numAsiento.toUpperCase())) {
      this.formulario.numAsiento = '';
    }
  }

  guardar(): void {
    this.error = '';
    this.mensaje = '';

    if (!this.formulario.reservaId || !this.formulario.numAsiento || !this.formulario.tipo) {
      this.error = 'Debe seleccionar una reserva, un asiento y el tipo de asiento.';
      return;
    }

    if (!this.vueloSeleccionado?.puertaAbordaje) {
      this.error = 'El vuelo de esta reserva no tiene puerta de abordaje. Primero edite el vuelo y agregue la puerta.';
      return;
    }

    this.checkinsService.crearCheckin(this.formulario).subscribe({
      next: (checkinCreado) => {
        this.mensaje = 'Check-in realizado correctamente. Ya puede imprimir o enviar el pase de abordar.';
        this.paseSeleccionado = checkinCreado;
        this.mostrarFormulario = false;
        this.formulario = this.formularioVacio();
        this.reservaSeleccionada = undefined;
        this.vueloSeleccionado = undefined;
        this.asientoOpciones = [];
        this.cargarCheckins();
      },
      error: (err) => {
        console.error('Error creando check-in:', err);
        this.error = this.extraerMensajeError(err, 'No se pudo realizar el check-in.');
      }
    });
  }

  eliminarCheckin(checkinId: number): void {
    this.checkinsService.eliminarCheckin(checkinId).subscribe({
      next: () => {
        this.mensaje = 'Check-in eliminado. El asiento quedó disponible nuevamente.';
        if (this.paseSeleccionado?.checkinId === checkinId) {
          this.paseSeleccionado = undefined;
        }
        this.cargarDatos();
      },
      error: (err) => {
        console.error('Error eliminando check-in:', err);
        this.error = 'No se pudo eliminar el check-in.';
      }
    });
  }

  verPase(checkin: CheckinDto): void {
    this.paseSeleccionado = checkin;
    this.mensaje = '';
    this.error = '';
  }

  cerrarPase(): void {
    this.paseSeleccionado = undefined;
  }

  imprimirPase(): void {
    window.print();
  }

  getInfoReservaSeleccionada(): string {
    if (!this.reservaSeleccionada || !this.vueloSeleccionado) {
      return '';
    }

    const puerta = this.vueloSeleccionado.puertaAbordaje || 'Sin puerta asignada';
    return `${this.reservaSeleccionada.nombreUsuario} | ${this.reservaSeleccionada.codigoVuelo} | ${this.vueloSeleccionado.origen} → ${this.vueloSeleccionado.destino} | Puerta ${puerta}`;
  }

  private extraerMensajeError(err: any, mensajeDefault: string): string {
    if (typeof err?.error === 'string') {
      return err.error;
    }

    if (err?.error?.message) {
      return err.error.message;
    }

    return mensajeDefault;
  }
}
