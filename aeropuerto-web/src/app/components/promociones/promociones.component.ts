import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PromocionesService, Promocion } from '../../services/promociones.service';

@Component({
  selector: 'app-promociones',
  templateUrl: './promociones.component.html',
  styleUrls: ['./promociones.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class PromocionesComponent implements OnInit {
  promociones: Promocion[] = [];
  formulario: Promocion = this.formularioVacio();
  modoEdicion = false;
  mostrarFormulario = false;
  mensaje = '';
  error = '';

  constructor(private promocionesService: PromocionesService) {}

  ngOnInit(): void {
    this.cargarPromociones();
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

  abrirEditar(promocion: Promocion): void {
    this.formulario = { ...promocion };
    this.modoEdicion = true;
    this.mostrarFormulario = true;
    this.mensaje = '';
    this.error = '';
  }

  cancelar(): void {
    this.formulario = this.formularioVacio();
    this.modoEdicion = false;
    this.mostrarFormulario = false;
  }

  guardar(): void {
    this.error = '';
    this.mensaje = '';

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
