import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../services/usuario.service';
import { PromocionesService, Promocion } from '../../services/promociones.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  modo: 'login' | 'registro' = 'login';

  // Login
  loginEmail = '';

  // Registro
  formulario: Usuario = this.formularioVacio();
  esEstudiante = false;

  // Promociones
  promociones: Promocion[] = [];

  mensaje = '';
  error = '';
  cargando = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private promocionesService: PromocionesService
  ) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn) {
      this.router.navigate(['/dashboard']);
    }
    this.cargarPromociones();
  }

  private formularioVacio(): Usuario {
    return { nombre: '', apellido1: '', apellido2: '', email: '', telefono: '' };
  }

  cambiarModo(modo: 'login' | 'registro'): void {
    this.modo = modo;
    this.error = '';
    this.mensaje = '';
  }

  iniciarSesion(): void {
    this.error = '';
    if (!this.loginEmail.trim()) {
      this.error = 'Ingrese su correo electrónico.';
      return;
    }
    this.cargando = true;
    this.authService.login(this.loginEmail).subscribe({
      next: (user) => {
        this.cargando = false;
        if (user) {
          this.router.navigate(['/dashboard']);
        } else {
          this.error = 'No se encontró una cuenta con ese correo. ¿Desea registrarse?';
        }
      },
      error: () => {
        this.cargando = false;
        this.error = 'Error al conectar con el servidor.';
      }
    });
  }

  registrarse(): void {
    this.error = '';
    this.mensaje = '';

    if (!this.formulario.nombre || !this.formulario.apellido1 || !this.formulario.email || !this.formulario.telefono) {
      this.error = 'Complete los campos obligatorios: nombre, apellido, correo y teléfono.';
      return;
    }

    if (this.esEstudiante && (!this.formulario.universidad || !this.formulario.carnet)) {
      this.error = 'Ingrese universidad y carnet para la cuenta estudiantil.';
      return;
    }

    const usuarioAEnviar: Usuario = {
      ...this.formulario,
      carnet: this.esEstudiante ? this.formulario.carnet : undefined,
      universidad: this.esEstudiante ? this.formulario.universidad : undefined
    };

    this.cargando = true;
    this.authService.register(usuarioAEnviar).subscribe({
      next: () => {
        this.cargando = false;
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.cargando = false;
        this.error = 'No se pudo crear la cuenta. Verifique que el correo no esté ya registrado.';
      }
    });
  }

  toggleEstudiante(): void {
    if (!this.esEstudiante) {
      this.formulario.carnet = undefined;
      this.formulario.universidad = undefined;
    }
  }

  cargarPromociones(): void {
    this.promocionesService.getPromociones().subscribe({
      next: (data) => (this.promociones = data),
      error: () => {}
    });
  }
}
