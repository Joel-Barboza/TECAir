import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService, Usuario } from '../../services/usuario.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  formulario: Usuario = this.formularioVacio();
  esEstudiante = false;
  modoEdicion = false;
  mostrarFormulario = false;
  mensaje = '';
  error = '';

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  private formularioVacio(): Usuario {
    return { nombre: '', apellido1: '', apellido2: '', email: '', telefono: '' };
  }

  cargarUsuarios(): void {
    this.usuarioService.getUsuarios().subscribe({
      next: (data) => {
        console.log('Usuarios cargados:', data);
        this.usuarios = data;
      },
      error: (err) => {
        console.error('Error cargando usuarios:', err);
        this.error = 'No se pudieron cargar los usuarios.';
      }
    });
  }

  abrirEditar(usuario: Usuario): void {
    this.formulario = { ...usuario };
    this.esEstudiante = !!(usuario.carnet || usuario.universidad);
    this.modoEdicion = true;
    this.mostrarFormulario = true;
    this.mensaje = '';
    this.error = '';
  }

  cancelar(): void {
    this.formulario = this.formularioVacio();
    this.esEstudiante = false;
    this.modoEdicion = false;
    this.mostrarFormulario = false;
  }

  toggleEstudiante(): void {
    if (!this.esEstudiante) {
      this.formulario.carnet = undefined;
      this.formulario.universidad = undefined;
    }
  }

  guardar(): void {
    this.error = '';
    this.mensaje = '';

    if (!this.formulario.nombre || !this.formulario.apellido1 || !this.formulario.email || !this.formulario.telefono) {
      this.error = 'Debe completar nombre, apellido, correo y teléfono.';
      return;
    }

    if (this.esEstudiante && (!this.formulario.universidad || !this.formulario.carnet)) {
      this.error = 'Ingrese universidad y carnet para estudiantes.';
      return;
    }

    const usuarioAEnviar: Usuario = {
      ...this.formulario,
      carnet: this.esEstudiante ? this.formulario.carnet : undefined,
      universidad: this.esEstudiante ? this.formulario.universidad : undefined
    };

    if (this.modoEdicion) {
      this.usuarioService.actualizarUsuario(usuarioAEnviar).subscribe({
        next: () => {
          this.mensaje = 'Usuario actualizado correctamente.';
          this.modoEdicion = false;
          this.mostrarFormulario = false;
          this.formulario = this.formularioVacio();
          this.cargarUsuarios();
        },
        error: (err) => {
          console.error('Error actualizando usuario:', err);
          this.error = 'No se pudo actualizar el usuario.';
        }
      });
    } else {
      this.usuarioService.crearUsuario(usuarioAEnviar).subscribe({
        next: () => {
          this.mensaje = 'Usuario agregado correctamente.';
          this.formulario = this.formularioVacio();
          this.esEstudiante = false;
          this.mostrarFormulario = false;
          this.cargarUsuarios();
        },
        error: (err) => {
          console.error('Error creando usuario:', err);
          this.error = 'No se pudo crear el usuario.';
        }
      });
    }
  }

  eliminarUsuario(usuarioId: number): void {
    this.usuarioService.eliminarUsuario(usuarioId).subscribe({
      next: () => {
        this.mensaje = 'Usuario eliminado.';
        this.cargarUsuarios();
      },
      error: (err) => {
        console.error('Error eliminando usuario:', err);
        this.error = 'No se pudo eliminar el usuario.';
      }
    });
  }

  abrirNuevoUsuario(): void {
    this.formulario = this.formularioVacio();
    this.esEstudiante = false;
    this.modoEdicion = false;
    this.mostrarFormulario = true;
    this.mensaje = '';
    this.error = '';
  }
}