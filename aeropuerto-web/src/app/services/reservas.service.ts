import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Reserva {
  reservaId?: number;
  usuarioId: number;
  vueloId: number;
  fechaReserva: string;
  asientosReservados: number;
  estadoPago: string;
}

export interface ReservaDto {
  reservaId: number;
  usuarioId: number;
  nombreUsuario: string;
  codigoUsuario: string; // USR-0001, etc.
  vueloId: number;
  codigoVuelo: string; // VUE-001, etc.
  descripcionVuelo: string; // "VUE-001 - Origen → Destino - 26/05/2026"
  fechaReserva: string;
  asientosReservados: number;
  estadoPago: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReservasService {
  private apiUrl = 'http://localhost:5005/api/aeropuerto/Reservas';

  constructor(private http: HttpClient) {}

  getReservas(): Observable<ReservaDto[]> {
    return this.http.get<ReservaDto[]>(this.apiUrl);
  }

  crearReserva(reserva: Reserva): Observable<ReservaDto> {
    return this.http.post<ReservaDto>(this.apiUrl, reserva);
  }

  actualizarReserva(reserva: Reserva): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${reserva.reservaId}`, reserva);
  }

  eliminarReserva(reservaId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${reservaId}`);
  }
}
