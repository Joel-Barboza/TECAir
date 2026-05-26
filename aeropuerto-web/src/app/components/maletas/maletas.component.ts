import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaletasService, Maleta, MaletaDto, ReservaChequeadaDto } from '../../services/maletas.service';

@Component({
  selector: 'app-maletas',
  templateUrl: './maletas.component.html',
  styleUrls: ['./maletas.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class MaletasComponent implements OnInit {
  maletas: MaletaDto[] = [];
  formulario: Maleta = this.formularioVacio();
  modoEdicion = false;
  mostrarFormulario = false;
  mensaje = '';
  error = '';
  reservas: ReservaChequeadaDto[] = [];
  resumenSeleccionado = '';
  costoEstimado = 0;

  constructor(private maletasService: MaletasService) {}

  ngOnInit(): void {
    this.cargarMaletas();
    this.cargarReservas();
  }

  private cargarReservas(): void {
    this.maletasService.getReservasChequeadas().subscribe({
      next: (data) => {
        this.reservas = data;
      },
      error: (err) => {
        console.error('Error cargando reservas chequeadas:', err);
        this.error = 'No se pudieron cargar los pasajeros chequeados.';
      }
    });
  }

  private formularioVacio(): Maleta {
    return {
      reservaId: 0,
      peso: 0,
      color: '',
      costoAdicional: 0
    };
  }

  cargarMaletas(): void {
    this.maletasService.getMaletas().subscribe({
      next: (data) => {
        console.log('Maletas cargadas:', data);
        this.maletas = data;
        this.actualizarResumenReserva();
      },
      error: (err) => {
        console.error('Error cargando maletas:', err);
        this.error = 'No se pudieron cargar las maletas.';
      }
    });
  }

  abrirEditar(maleta: MaletaDto): void {
    this.formulario = {
      maletaId: maleta.maletaId,
      reservaId: maleta.reservaId,
      peso: maleta.peso,
      color: maleta.color,
      costoAdicional: maleta.costoAdicional
    };

    this.modoEdicion = true;
    this.mostrarFormulario = true;
    this.mensaje = '';
    this.error = '';
    this.actualizarResumenReserva();
  }

  cancelar(): void {
    this.formulario = this.formularioVacio();
    this.modoEdicion = false;
    this.mostrarFormulario = false;
    this.resumenSeleccionado = '';
    this.costoEstimado = 0;
  }

  guardar(): void {
    this.error = '';
    this.mensaje = '';

    if (!this.formulario.reservaId || !this.formulario.peso || !this.formulario.color) {
      this.error = 'Debe completar la reserva, el peso y el color de la maleta.';
      return;
    }

    // El backend recalcula el costo real. Este valor solo se envía para mantener la estructura del modelo.
    this.formulario.costoAdicional = this.costoEstimado;

    if (this.modoEdicion && this.formulario.maletaId) {
      this.maletasService.actualizarMaleta(this.formulario).subscribe({
        next: () => {
          this.mensaje = 'Maleta actualizada correctamente. Los costos fueron recalculados automáticamente.';
          this.modoEdicion = false;
          this.mostrarFormulario = false;
          this.formulario = this.formularioVacio();
          this.resumenSeleccionado = '';
          this.costoEstimado = 0;
          this.cargarMaletas();
        },
        error: (err) => {
          console.error('Error actualizando maleta:', err);
          this.error = err?.error || 'No se pudo actualizar la maleta.';
        }
      });
    } else {
      this.maletasService.crearMaleta(this.formulario).subscribe({
        next: () => {
          this.mensaje = 'Maleta agregada correctamente. El costo adicional fue calculado automáticamente.';
          this.formulario = this.formularioVacio();
          this.mostrarFormulario = false;
          this.resumenSeleccionado = '';
          this.costoEstimado = 0;
          this.cargarMaletas();
        },
        error: (err) => {
          console.error('Error creando maleta:', err);
          this.error = err?.error || 'No se pudo crear la maleta.';
        }
      });
    }
  }

  eliminarMaleta(maletaId: number): void {
    this.maletasService.eliminarMaleta(maletaId).subscribe({
      next: () => {
        this.mensaje = 'Maleta eliminada. Los costos del pasajero fueron recalculados.';
        this.cargarMaletas();
      },
      error: (err) => {
        console.error('Error eliminando maleta:', err);
        this.error = 'No se pudo eliminar la maleta.';
      }
    });
  }

  abrirNuevaMaleta(): void {
    this.formulario = this.formularioVacio();
    this.modoEdicion = false;
    this.mostrarFormulario = true;
    this.mensaje = '';
    this.error = '';
    this.resumenSeleccionado = '';
    this.costoEstimado = 0;
  }

  actualizarResumenReserva(): void {
    if (!this.formulario.reservaId) {
      this.resumenSeleccionado = '';
      this.costoEstimado = 0;
      return;
    }

    const reserva = this.reservas.find(r => Number(r.reservaId) === Number(this.formulario.reservaId));
    const maletasReserva = this.maletas.filter(m => Number(m.reservaId) === Number(this.formulario.reservaId));

    const cantidadActual = this.modoEdicion
      ? maletasReserva.filter(m => Number(m.maletaId) !== Number(this.formulario.maletaId)).length
      : maletasReserva.length;

    const numeroNuevaMaleta = cantidadActual + 1;
    this.costoEstimado = this.calcularCostoPorNumeroDeMaleta(numeroNuevaMaleta);

    const cantidadParaTotal = cantidadActual;
    let totalActual = 0;

    for (let i = 1; i <= cantidadParaTotal; i++) {
      totalActual += this.calcularCostoPorNumeroDeMaleta(i);
    }

    const totalEstimado = totalActual + this.costoEstimado;

    if (reserva) {
      this.resumenSeleccionado = `${reserva.nombreUsuario} | ${reserva.codigoVuelo} | maleta #${numeroNuevaMaleta} | cobro de esta maleta: $${this.costoEstimado} | total estimado: $${totalEstimado}`;
    } else {
      this.resumenSeleccionado = `Maleta #${numeroNuevaMaleta} | cobro de esta maleta: $${this.costoEstimado} | total estimado: $${totalEstimado}`;
    }
  }

  getNumeroMaleta(maleta: MaletaDto): string {
    if (maleta.numeroMaleta) {
      return maleta.numeroMaleta;
    }

    return `MAL-${String(maleta.maletaId).padStart(3, '0')}`;
  }

  getNombreDueno(maleta: MaletaDto): string {
    if (maleta.nombreDueno) {
      return maleta.nombreDueno;
    }

    const reserva = this.reservas.find(r => Number(r.reservaId) === Number(maleta.reservaId));
    if (reserva?.nombreUsuario) {
      return reserva.nombreUsuario;
    }

    if (maleta.descripcionReserva) {
      const partes = maleta.descripcionReserva.split(' - ');
      if (partes.length >= 2 && partes[1].trim()) {
        return partes[1].trim();
      }
    }

    return 'Sin dueño';
  }

  getNumeroMaletaEnReserva(maleta: MaletaDto): number {
    const maletasReserva = this.maletas
      .filter(m => Number(m.reservaId) === Number(maleta.reservaId))
      .sort((a, b) => Number(a.maletaId) - Number(b.maletaId));

    const indice = maletasReserva.findIndex(m => Number(m.maletaId) === Number(maleta.maletaId));
    return indice >= 0 ? indice + 1 : 1;
  }

  getCostoDeEstaMaleta(maleta: MaletaDto): number {
    return this.calcularCostoPorNumeroDeMaleta(this.getNumeroMaletaEnReserva(maleta));
  }

  getTotalMaletasReserva(maleta: MaletaDto): number {
    return this.maletas.filter(m => Number(m.reservaId) === Number(maleta.reservaId)).length;
  }

  getTotalCostoReserva(maleta: MaletaDto): number {
    const cantidad = this.getTotalMaletasReserva(maleta);
    let total = 0;

    for (let i = 1; i <= cantidad; i++) {
      total += this.calcularCostoPorNumeroDeMaleta(i);
    }

    return total;
  }

  private calcularCostoPorNumeroDeMaleta(numeroMaletaDelPasajero: number): number {
    if (numeroMaletaDelPasajero <= 1) return 0;
    if (numeroMaletaDelPasajero === 2) return 50;
    return 75;
  }
}
