import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CrearCheckin {
  reservaId: number;
  numAsiento: string;
  tipo: string;
  metodoEnvio?: string;
}

export interface CheckinDto {
  checkinId: number;
  reservaId: number;
  codigoReserva: string;
  usuarioId: number;
  codigoUsuario: string;
  nombrePasajero: string;
  vueloId: number;
  codigoVuelo: string;
  numeroVuelo: string;
  origen: string;
  destino: string;
  horaSalida: string;
  puertaAbordaje: string;
  asientoId: number;
  numAsiento: string;
  tipoAsiento: string;
  fechaCheckin: string;
  metodoEnvio?: string;
  estadoEnvio?: string;
  descripcionReserva: string;
  descripcionPase: string;
}

@Injectable({
  providedIn: 'root'
})
export class CheckinsService {
  private apiUrl = 'http://localhost:5005/api/aeropuerto/Checkins';

  constructor(private http: HttpClient) {}

  getCheckins(): Observable<CheckinDto[]> {
    return this.http.get<CheckinDto[]>(this.apiUrl);
  }

  crearCheckin(checkin: CrearCheckin): Observable<CheckinDto> {
    return this.http.post<CheckinDto>(this.apiUrl, checkin);
  }

  eliminarCheckin(checkinId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${checkinId}`);
  }
}
