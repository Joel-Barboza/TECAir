import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Usuario, UsuarioService } from '../../services/usuario.service';
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
  loginNombre = '';
  loginEmail = '';

  // Registro
  formulario: Usuario = this.formularioVacio();
  esEstudiante = false;

  // Promociones
  promociones: Promocion[] = [];

  mensaje = '';
  error = '';
  cargando = false;

  emailNoEncontrado = false;
  emailYaRegistrado = false;

  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private router: Router,
    private promocionesService: PromocionesService,
    private cdr: ChangeDetectorRef
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
    this.emailNoEncontrado = false;
    this.emailYaRegistrado = false;
  }

  iniciarSesion(): void {
    this.error = '';
    this.emailNoEncontrado = false;

    if (!this.loginNombre.trim() || !this.loginEmail.trim()) {
      this.error = 'Ingrese su nombre y correo electrónico.';
      this.cdr.detectChanges();
      return;
    }

    this.cargando = true;
    this.cdr.detectChanges();

    this.authService.login(this.loginEmail, this.loginNombre).subscribe({
      next: (user) => {
        this.cargando = false;
        if (user) {
          this.router.navigate(['/dashboard']);
        } else {
          this.emailNoEncontrado = true;
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.cargando = false;
        this.error = 'Error al conectar con el servidor.';
        this.cdr.detectChanges();
      }
    });
  }

  registrarse(): void {
    this.error = '';
    this.mensaje = '';
    this.emailYaRegistrado = false;

    if (!this.formulario.nombre || !this.formulario.apellido1 || !this.formulario.email || !this.formulario.telefono) {
      this.error = 'Complete los campos obligatorios: nombre, apellido, correo y teléfono.';
      this.cdr.detectChanges();
      return;
    }

    if (this.esEstudiante && (!this.formulario.universidad || !this.formulario.carnet)) {
      this.error = 'Ingrese universidad y carnet para la cuenta estudiantil.';
      this.cdr.detectChanges();
      return;
    }

    this.cargando = true;
    this.cdr.detectChanges();

    this.usuarioService.getUsuarios().subscribe({
      next: (usuarios) => {
        const existe = usuarios.some(u => u.email.toLowerCase() === this.formulario.email.trim().toLowerCase());
        if (existe) {
          this.cargando = false;
          this.emailYaRegistrado = true;
          this.cdr.detectChanges();
          return;
        }

        const usuarioAEnviar: Usuario = {
          ...this.formulario,
          carnet: this.esEstudiante ? this.formulario.carnet : undefined,
          universidad: this.esEstudiante ? this.formulario.universidad : undefined
        };

        this.authService.register(usuarioAEnviar).subscribe({
          next: () => {
            this.cargando = false;
            this.router.navigate(['/dashboard']);
            this.cdr.detectChanges();
          },
          error: () => {
            this.cargando = false;
            this.error = 'No se pudo crear la cuenta. Intente nuevamente.';
            this.cdr.detectChanges();
          }
        });
      },
      error: () => {
        this.cargando = false;
        this.error = 'Error al conectar con el servidor.';
        this.cdr.detectChanges();
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
      next: (data) => {
        this.promociones = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('No se pudieron cargar las promociones:', err)
    });
  }
}
