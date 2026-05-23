import { Component } from '@angular/core';
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
export class UsuariosComponent {
  usuarios: Usuario[] = [];
  nuevoUsuario: Usuario = {
    usuarioId: 0,
    nombre: '',
    apellido1: '',
    apellido2: '',
    email: '',
    telefono: '',
    carnet: undefined,
    universidad: ''
  };

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.usuarioService.getUsuarios().subscribe(data => {
      this.usuarios = data;
    });
  }

  agregarUsuario() {
    this.usuarioService.crearUsuario(this.nuevoUsuario).subscribe(() => {
      this.cargarUsuarios();
      this.nuevoUsuario = {
        usuarioId: 0,
        nombre: '',
        apellido1: '',
        apellido2: '',
        email: '',
        telefono: '',
        carnet: undefined,
        universidad: ''
      };
    });
  }

  eliminarUsuario(id: number) {
    if(confirm('¿Desea eliminar este usuario?')) {
      this.usuarioService.eliminarUsuario(id).subscribe(() => {
        this.cargarUsuarios();
      });
    }
  }
}