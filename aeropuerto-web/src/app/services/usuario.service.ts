import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Usuario {
  usuarioId: number;
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
  private apiUrl = 'https://localhost:5001/api/Usuarios'; // Ajusta el puerto de tu API

  constructor(private http: HttpClient) { }

  // Obtener todos los usuarios
  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  // Crear un usuario
  crearUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, usuario);
  }

  // Actualizar un usuario
  actualizarUsuario(usuario: Usuario): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${usuario.usuarioId}`, usuario);
  }

  // Eliminar un usuario
  eliminarUsuario(usuarioId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${usuarioId}`);
  }
}