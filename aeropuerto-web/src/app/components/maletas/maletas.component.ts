import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaletasService, Maleta } from '../../services/maletas.service';

@Component({
  selector: 'app-maletas',
  templateUrl: './maletas.component.html',
  styleUrls: ['./maletas.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class MaletasComponent implements OnInit {
  maletas: Maleta[] = [];
  formulario: Maleta = this.formularioVacio();
  modoEdicion = false;
  mostrarFormulario = false;
  mensaje = '';
  error = '';

  constructor(private maletasService: MaletasService) {}

  ngOnInit(): void {
    this.cargarMaletas();
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
      },
      error: (err) => {
        console.error('Error cargando maletas:', err);
        this.error = 'No se pudieron cargar las maletas.';
      }
    });
  }

  abrirEditar(maleta: Maleta): void {
    this.formulario = { ...maleta };
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

    if (!this.formulario.reservaId || !this.formulario.peso || !this.formulario.color || this.formulario.costoAdicional === undefined) {
      this.error = 'Debe completar todos los campos.';
      return;
    }

    if (this.modoEdicion && this.formulario.maletaId) {
      this.maletasService.actualizarMaleta(this.formulario).subscribe({
        next: () => {
          this.mensaje = 'Maleta actualizada correctamente.';
          this.modoEdicion = false;
          this.mostrarFormulario = false;
          this.formulario = this.formularioVacio();
          this.cargarMaletas();
        },
        error: (err) => {
          console.error('Error actualizando maleta:', err);
          this.error = 'No se pudo actualizar la maleta.';
        }
      });
    } else {
      this.maletasService.crearMaleta(this.formulario).subscribe({
        next: () => {
          this.mensaje = 'Maleta agregada correctamente.';
          this.formulario = this.formularioVacio();
          this.mostrarFormulario = false;
          this.cargarMaletas();
        },
        error: (err) => {
          console.error('Error creando maleta:', err);
          this.error = 'No se pudo crear la maleta.';
        }
      });
    }
  }

  eliminarMaleta(maletaId: number): void {
    this.maletasService.eliminarMaleta(maletaId).subscribe({
      next: () => {
        this.mensaje = 'Maleta eliminada.';
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
  }
}