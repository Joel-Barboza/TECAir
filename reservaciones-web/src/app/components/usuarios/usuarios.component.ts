import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Usuario, UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent {
  nuevoUsuario: Usuario = {
    nombre: '',
    apellido1: '',
    apellido2: '',
    email: '',
    telefono: ''
  };
  esEstudiante = false;
  mensaje = '';
  error = '';

  constructor(private usuarioService: UsuarioService) {}

  toggleEstudiante(): void {
    if (!this.esEstudiante) {
      this.nuevoUsuario.carnet = undefined;
      this.nuevoUsuario.universidad = undefined;
    }
  }

  crearUsuario(): void {
    this.error = '';
    this.mensaje = '';

    if (!this.nuevoUsuario.nombre || !this.nuevoUsuario.apellido1 || !this.nuevoUsuario.email || !this.nuevoUsuario.telefono) {
      this.error = 'Debe completar nombre, apellido, correo y teléfono.';
      return;
    }

    if (this.esEstudiante && (!this.nuevoUsuario.universidad || !this.nuevoUsuario.carnet)) {
      this.error = 'Ingrese universidad y carnet para estudiantes.';
      return;
    }

    const usuarioAEnviar: Usuario = {
      ...this.nuevoUsuario,
      carnet: this.esEstudiante ? this.nuevoUsuario.carnet : undefined,
      universidad: this.esEstudiante ? this.nuevoUsuario.universidad : undefined
    };

    this.usuarioService.crearUsuario(usuarioAEnviar).subscribe({
      next: () => {
        this.mensaje = 'Perfil creado correctamente. Puedes buscar vuelos ahora.';
        this.nuevoUsuario = {
          nombre: '',
          apellido1: '',
          apellido2: '',
          email: '',
          telefono: ''
        };
        this.esEstudiante = false;
      },
      error: (err) => {
        this.error = 'No se pudo crear el perfil.';
        console.error(err);
      }
    });
  }
}
