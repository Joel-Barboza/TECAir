import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Maleta {
  maletaId?: number;
  reservaId: number;
  peso: number;
  color: string;
  costoAdicional: number;
}

export interface MaletaDto {
  maletaId: number;
  numeroMaleta: string;
  reservaId: number;
  codigoReserva: string;
  nombreDueno: string;
  descripcionReserva: string; // "RES-001 - Juan Pérez - VUE-001"
  peso: number;
  color: string;
  costoAdicional: number;
  totalMaletasReserva: number;
  totalCostoReserva: number;
}


export interface ReservaChequeadaDto {
  reservaId: number;
  usuarioId: number;
  nombreUsuario: string;
  codigoUsuario: string;
  vueloId: number;
  codigoVuelo: string;
  descripcionVuelo: string;
  fechaReserva: string;
  asientosReservados: number;
  estadoPago: string;
}

export interface AeropuertoDto {
  aeropuertoId: number;
  nombre: string;
  ubicacion: string;
  nombreYUbicacion: string; // "Nombre - Ubicacion"
}

export interface AvionDto {
  avionId: number;
  modelo: string;
  capacidad: number;
  modeloYCapacidad: string; // "Modelo - Capacidad XX pasajeros"
}

@Injectable({
  providedIn: 'root'
})
export class MaletasService {
  private apiUrl = 'http://localhost:5262/api/aeropuerto/Maletas';

  constructor(private http: HttpClient) {}

  getMaletas(): Observable<MaletaDto[]> {
    return this.http.get<MaletaDto[]>(this.apiUrl);
  }

  getReservasChequeadas(): Observable<ReservaChequeadaDto[]> {
    return this.http.get<ReservaChequeadaDto[]>(`${this.apiUrl}/reservas-chequeadas`);
  }

  crearMaleta(maleta: Maleta): Observable<MaletaDto> {
    return this.http.post<MaletaDto>(this.apiUrl, maleta);
  }

  actualizarMaleta(maleta: Maleta): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${maleta.maletaId}`, maleta);
  }

  eliminarMaleta(maletaId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${maletaId}`);
  }
}
