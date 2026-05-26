import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VuelosService, Vuelo } from '../../services/vuelos.service';

@Component({
  selector: 'app-vuelos',
  templateUrl: './vuelos.component.html',
  styleUrls: ['./vuelos.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class VuelosComponent implements OnInit {
  vuelos: Vuelo[] = [];
  formulario: Vuelo = this.formularioVacio();
  modoEdicion = false;
  mostrarFormulario = false;
  mensaje = '';
  error = '';

  constructor(private vuelosService: VuelosService) {}

  ngOnInit(): void {
    this.cargarVuelos();
  }

  private formularioVacio(): Vuelo {
    return {
      aeropuertoId: 0,
      avionId: 0,
      asientos: 0,
      destino: '',
      salida: '',
      fechaSalida: '',
      fechaLlegada: ''
    };
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

  abrirEditar(vuelo: Vuelo): void {
    this.formulario = { ...vuelo };
    // Transformar fechas al formato correcto para datetime-local
    this.formulario.fechaSalida = this.formatearFecha(vuelo.fechaSalida);
    this.formulario.fechaLlegada = this.formatearFecha(vuelo.fechaLlegada);
    this.modoEdicion = true;
    this.mostrarFormulario = true;
    this.mensaje = '';
    this.error = '';
  }

  private formatearFecha(fecha: string): string {
    if (!fecha) return '';
    // Remover zona horaria si existe
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

    if (!this.formulario.aeropuertoId || !this.formulario.avionId || !this.formulario.asientos || 
        !this.formulario.destino || !this.formulario.salida || !this.formulario.fechaSalida || !this.formulario.fechaLlegada) {
      this.error = 'Debe completar todos los campos.';
      return;
    }

    if (this.modoEdicion && this.formulario.vueloId) {
      this.vuelosService.actualizarVuelo(this.formulario).subscribe({
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
      this.vuelosService.crearVuelo(this.formulario).subscribe({
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