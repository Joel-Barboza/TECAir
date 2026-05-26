import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { Usuario, UsuarioService } from './usuario.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly KEY = 'tecair_user';

  constructor(private usuarioService: UsuarioService) {}

  login(email: string): Observable<Usuario | null> {
    return this.usuarioService.getUsuarios().pipe(
      map(usuarios => {
        const user = usuarios.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
        if (user) {
          sessionStorage.setItem(this.KEY, JSON.stringify(user));
        }
        return user ?? null;
      })
    );
  }

  register(usuario: Usuario): Observable<Usuario> {
    return this.usuarioService.crearUsuario(usuario).pipe(
      tap(created => sessionStorage.setItem(this.KEY, JSON.stringify(created)))
    );
  }

  logout(): void {
    sessionStorage.removeItem(this.KEY);
  }

  get currentUser(): Usuario | null {
    const data = sessionStorage.getItem(this.KEY);
    return data ? JSON.parse(data) : null;
  }

  get isLoggedIn(): boolean {
    return !!this.currentUser;
  }
}
