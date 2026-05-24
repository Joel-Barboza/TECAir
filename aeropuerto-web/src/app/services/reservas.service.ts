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

@Injectable({
  providedIn: 'root'
})
export class ReservasService {
  private apiUrl = 'http://localhost:5262/api/aeropuerto/Reservas';

  constructor(private http: HttpClient) {}

  getReservas(): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(this.apiUrl);
  }

  crearReserva(reserva: Reserva): Observable<Reserva> {
    return this.http.post<Reserva>(this.apiUrl, reserva);
  }

  eliminarReserva(reservaId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${reservaId}`);
  }
}