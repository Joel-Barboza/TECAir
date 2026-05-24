import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Usuario {
  usuarioId?: number;
  nombre: string;
  apellido1: string;
  apellido2?: string;
  email: string;
  telefono: string;
  carnet?: number;
  universidad?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'http://localhost:5005/api/aeropuerto/Usuarios'; // Ajusta al puerto correcto

  constructor(private http: HttpClient) { }

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  crearUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, usuario);
  }

  actualizarUsuario(usuario: Usuario): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${usuario.usuarioId}`, usuario);
  }

  eliminarUsuario(usuarioId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${usuarioId}`);
  }
}