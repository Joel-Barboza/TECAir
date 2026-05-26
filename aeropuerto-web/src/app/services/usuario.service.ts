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

export interface UsuarioDto {
  usuarioId: number;
  codigoVisible: string; // USR-0001, USR-0002, etc.
  nombre: string;
  apellido1: string;
  apellido2?: string;
  nombreCompleto: string;
  email: string;
  telefono: string;
  carnet?: number;
  universidad?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'http://localhost:5262/api/aeropuerto/Usuarios';

  constructor(private http: HttpClient) { }

  getUsuarios(): Observable<UsuarioDto[]> {
    return this.http.get<UsuarioDto[]>(this.apiUrl);
  }

  crearUsuario(usuario: Usuario): Observable<UsuarioDto> {
    return this.http.post<UsuarioDto>(this.apiUrl, usuario);
  }

  actualizarUsuario(usuario: Usuario): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${usuario.usuarioId}`, usuario);
  }

  eliminarUsuario(usuarioId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${usuarioId}`);
  }
}
