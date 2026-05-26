import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PromocionesService, Promocion, PromocionDto } from '../../services/promociones.service';
import { VuelosService, VueloDto } from '../../services/vuelos.service';

@Component({
  selector: 'app-promociones',
  templateUrl: './promociones.component.html',
  styleUrls: ['./promociones.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class PromocionesComponent implements OnInit {
  promociones: PromocionDto[] = [];
  formulario: Promocion = this.formularioVacio();
  modoEdicion = false;
  mostrarFormulario = false;
  mensaje = '';
  error = '';
  vuelos: VueloDto[] = [];

  constructor(
    private promocionesService: PromocionesService,
    private vuelosService: VuelosService
  ) {}

  ngOnInit(): void {
    this.cargarPromociones();
    this.cargarVuelos();
  }

  private cargarVuelos(): void {
    this.vuelosService.getVuelos().subscribe({
      next: (data) => {
        this.vuelos = data;
        this.sincronizarRutaConVuelo();
      },
      error: (err) => {
        console.error('Error cargando vuelos:', err);
      }
    });
  }

  private formularioVacio(): Promocion {
    return {
      vueloId: 0,
      origen: '',
      destino: '',
      descuento: 0,
      fechaInicio: '',
      fechaFin: ''
    };
  }

  sincronizarRutaConVuelo(): void {
    const vueloSeleccionado = this.vuelos.find(
      vuelo => vuelo.vueloId === Number(this.formulario.vueloId)
    );

    this.formulario.origen = vueloSeleccionado?.origen ?? '';
    this.formulario.destino = vueloSeleccionado?.destino ?? '';
  }


  obtenerVueloSeleccionado(): VueloDto | undefined {
    return this.vuelos.find(vuelo => vuelo.vueloId === Number(this.formulario.vueloId));
  }

  obtenerPrecioVueloSeleccionado(): number {
    return this.obtenerVueloSeleccionado()?.precioBoleto ?? 0;
  }

  obtenerMontoDescuentoFormulario(): number {
    const precio = this.obtenerPrecioVueloSeleccionado();
    const descuento = Number(this.formulario.descuento) || 0;
    return Math.round((precio * (descuento / 100)) * 100) / 100;
  }

  obtenerPrecioFinalFormulario(): number {
    const precio = this.obtenerPrecioVueloSeleccionado();
    return Math.round((precio - this.obtenerMontoDescuentoFormulario()) * 100) / 100;
  }

  cargarPromociones(): void {
    this.promocionesService.getPromociones().subscribe({
      next: (data) => {
        console.log('Promociones cargadas:', data);
        this.promociones = data;
      },
      error: (err) => {
        console.error('Error cargando promociones:', err);
        this.error = 'No se pudieron cargar las promociones.';
      }
    });
  }

  abrirEditar(promocion: PromocionDto): void {
    this.formulario = {
      promocionId: promocion.promocionId,
      vueloId: promocion.vueloId,
      origen: promocion.origen,
      destino: promocion.destino,
      descuento: promocion.descuento,
      fechaInicio: this.formatearFecha(promocion.fechaInicio),
      fechaFin: this.formatearFecha(promocion.fechaFin)
    };

    this.sincronizarRutaConVuelo();

    this.modoEdicion = true;
    this.mostrarFormulario = true;
    this.mensaje = '';
    this.error = '';
  }

  private formatearFecha(fecha: string): string {
    if (!fecha) return '';
    return fecha.split('+')[0].split('Z')[0].split('T')[0];
  }

  cancelar(): void {
    this.formulario = this.formularioVacio();
    this.modoEdicion = false;
    this.mostrarFormulario = false;
  }

  guardar(): void {
    this.error = '';
    this.mensaje = '';

    this.sincronizarRutaConVuelo();

    if (!this.formulario.vueloId || !this.formulario.origen || !this.formulario.destino ||
        !this.formulario.descuento || !this.formulario.fechaInicio || !this.formulario.fechaFin) {
      this.error = 'Debe completar todos los campos.';
      return;
    }

    if (this.modoEdicion && this.formulario.promocionId) {
      this.promocionesService.actualizarPromocion(this.formulario).subscribe({
        next: () => {
          this.mensaje = 'Promoción actualizada correctamente.';
          this.modoEdicion = false;
          this.mostrarFormulario = false;
          this.formulario = this.formularioVacio();
          this.cargarPromociones();
        },
        error: (err) => {
          console.error('Error actualizando promoción:', err);
          this.error = 'No se pudo actualizar la promoción.';
        }
      });
    } else {
      this.promocionesService.crearPromocion(this.formulario).subscribe({
        next: () => {
          this.mensaje = 'Promoción agregada correctamente.';
          this.formulario = this.formularioVacio();
          this.mostrarFormulario = false;
          this.cargarPromociones();
        },
        error: (err) => {
          console.error('Error creando promoción:', err);
          this.error = 'No se pudo crear la promoción.';
        }
      });
    }
  }

  eliminarPromocion(promocionId: number): void {
    this.promocionesService.eliminarPromocion(promocionId).subscribe({
      next: () => {
        this.mensaje = 'Promoción eliminada.';
        this.cargarPromociones();
      },
      error: (err) => {
        console.error('Error eliminando promoción:', err);
        this.error = 'No se pudo eliminar la promoción.';
      }
    });
  }

  abrirNuevaPromocion(): void {
    this.formulario = this.formularioVacio();
    this.modoEdicion = false;
    this.mostrarFormulario = true;
    this.mensaje = '';
    this.error = '';
  }
}
