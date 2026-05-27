import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VuelosService, Vuelo, VueloDto } from '../../services/vuelos.service';
import { AeropuertosService, AeropuertoDto } from '../../services/aeropuertos.service';
import { AvionesService, AvionDto } from '../../services/aviones.service';

@Component({
  selector: 'app-vuelos',
  templateUrl: './vuelos.component.html',
  styleUrls: ['./vuelos.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class VuelosComponent implements OnInit {
  vuelos: VueloDto[] = [];
  formulario: Vuelo = this.formularioVacio();
  modoEdicion = false;
  mostrarFormulario = false;
  mensaje = '';
  error = '';
  aeropuertos: AeropuertoDto[] = [];
  aviones: AvionDto[] = [];

  constructor(
    private vuelosService: VuelosService,
    private aeropuertosService: AeropuertosService,
    private avionesService: AvionesService
  ) {}

  ngOnInit(): void {
    this.cargarVuelos();
    this.cargarAeropuertos();
    this.cargarAviones();
  }

  private cargarAeropuertos(): void {
    this.aeropuertosService.getAeropuertos().subscribe({
      next: (data) => {
        this.aeropuertos = data;
        this.sincronizarSalidaConAeropuerto();
      },
      error: (err) => {
        console.error('Error cargando aeropuertos:', err);
      }
    });
  }

  private cargarAviones(): void {
    this.avionesService.getAviones().subscribe({
      next: (data) => {
        this.aviones = data;
      },
      error: (err) => {
        console.error('Error cargando aviones:', err);
      }
    });
  }

  private formularioVacio(): Vuelo {
    return {
      aeropuertoId: 0,
      avionId: 0,
      asientos: 0,
      destino: '',
      salida: '',
      fechaSalida: '',
      fechaLlegada: '',
      precioBoleto: 0,
      puertaAbordaje: ''
    };
  }

  sincronizarSalidaConAeropuerto(): void {
    const aeropuertoSeleccionado = this.aeropuertos.find(
      aeropuerto => aeropuerto.aeropuertoId === Number(this.formulario.aeropuertoId)
    );

    this.formulario.salida = aeropuertoSeleccionado?.ubicacion ?? '';
  }

  cargarVuelos(): void {
    this.vuelosService.getVuelos().subscribe({
      next: (data) => {
        console.log('Vuelos cargados:', data);
        this.vuelos = data;
      },
      error: (err) => {
        console.error('Error cargando vuelos:', err);
        this.error = 'No se pudieron cargar los vuelos.';
      }
    });
  }

  abrirEditar(vuelo: VueloDto): void {
    this.formulario = {
      vueloId: vuelo.vueloId,
      aeropuertoId: vuelo.aeropuertoId,
      avionId: vuelo.avionId,
      asientos: vuelo.asientos,
      destino: vuelo.destino,
      salida: vuelo.origen,
      fechaSalida: this.formatearFecha(vuelo.fechaSalida),
      fechaLlegada: this.formatearFecha(vuelo.fechaLlegada),
      precioBoleto: vuelo.precioBoleto ?? 0,
      puertaAbordaje: vuelo.puertaAbordaje ?? ''
    };

    this.sincronizarSalidaConAeropuerto();

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

    this.sincronizarSalidaConAeropuerto();

    if (!this.formulario.aeropuertoId || !this.formulario.avionId || !this.formulario.asientos ||
        !this.formulario.destino || !this.formulario.salida || !this.formulario.fechaSalida || !this.formulario.fechaLlegada ||
        this.formulario.precioBoleto === null || this.formulario.precioBoleto === undefined || this.formulario.precioBoleto < 0 ||
        !this.formulario.puertaAbordaje) {
      this.error = 'Debe completar todos los campos.';
      return;
    }

    const vueloParaGuardar: Vuelo = {
      ...this.formulario,
      puertaAbordaje: this.formulario.puertaAbordaje?.trim().toUpperCase()
    };

    if (this.modoEdicion && this.formulario.vueloId) {
      this.vuelosService.actualizarVuelo(vueloParaGuardar).subscribe({
        next: () => {
          this.mensaje = 'Vuelo actualizado correctamente.';
          this.modoEdicion = false;
          this.mostrarFormulario = false;
          this.formulario = this.formularioVacio();
          this.cargarVuelos();
        },
        error: (err) => {
          console.error('Error actualizando vuelo:', err);
          this.error = 'No se pudo actualizar el vuelo.';
        }
      });
    } else {
      this.vuelosService.crearVuelo(vueloParaGuardar).subscribe({
        next: () => {
          this.mensaje = 'Vuelo agregado correctamente.';
          this.formulario = this.formularioVacio();
          this.mostrarFormulario = false;
          this.cargarVuelos();
        },
        error: (err) => {
          console.error('Error creando vuelo:', err);
          this.error = 'No se pudo crear el vuelo.';
        }
      });
    }
  }

  eliminarVuelo(vueloId: number): void {
    this.vuelosService.eliminarVuelo(vueloId).subscribe({
      next: () => {
        this.mensaje = 'Vuelo eliminado.';
        this.cargarVuelos();
      },
      error: (err) => {
        console.error('Error eliminando vuelo:', err);
        this.error = 'No se pudo eliminar el vuelo.';
      }
    });
  }

  abrirNuevoVuelo(): void {
    this.formulario = this.formularioVacio();
    this.modoEdicion = false;
    this.mostrarFormulario = true;
    this.mensaje = '';
    this.error = '';
  }
}
