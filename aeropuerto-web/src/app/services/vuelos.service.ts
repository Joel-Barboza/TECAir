import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Vuelo {
  vueloId?: number;
  aeropuertoId: number;
  avionId: number;
  asientos: number;
  destino: string;
  salida: string;
  fechaSalida: string; // para datetime-local
  fechaLlegada: string;
}

export interface VueloDto {
  vueloId: number;
  codigoVisible: string; // VUE-001, VUE-002, etc.
  aeropuertoId: number;
  nombreAeropuerto: string;
  ubicacionAeropuerto: string;
  avionId: number;
  modeloAvion: string;
  capacidadAvion: number;
  asientos: number;
  origen: string;
  destino: string;
  rutaDescripcion: string; // "Origen → Destino"
  fechaSalida: string;
  fechaLlegada: string;
  descripcionCompleta: string; // "VUE-001 - Origen → Destino - 26/05/2026 10:30"
}

@Injectable({
  providedIn: 'root'
})
export class VuelosService {
  private apiUrl = 'http://localhost:5262/api/aeropuerto/Vuelos';

  constructor(private http: HttpClient) {}

  getVuelos(): Observable<VueloDto[]> {
    return this.http.get<VueloDto[]>(this.apiUrl);
  }

  crearVuelo(vuelo: Vuelo): Observable<VueloDto> {
    return this.http.post<VueloDto>(this.apiUrl, vuelo);
  }

  actualizarVuelo(vuelo: Vuelo): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${vuelo.vueloId}`, vuelo);
  }

  eliminarVuelo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
