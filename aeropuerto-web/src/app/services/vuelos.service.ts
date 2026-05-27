import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Vuelo {
  vueloId?: number;
  aeropuertoId: number;
  avionId: number;
  asientos: number;
  destino: string;
  salida: string;
  fechaSalida: string; // para datetime-local
  fechaLlegada: string;
  precioBoleto: number;
  precio_boleto?: number;
  puertaAbordaje?: string;
  estadoVuelo?: string;
  fechaApertura?: string | null;
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
  precioBoleto: number;
  puertaAbordaje?: string;
  puerta_abordaje?: string;
  estadoVuelo: string;
  estado_vuelo?: string;
  fechaApertura?: string | null;
  fecha_apertura?: string | null;
  descripcionCompleta: string; // "VUE-001 - Origen → Destino - 26/05/2026 10:30"
}

@Injectable({
  providedIn: 'root'
})
export class VuelosService {
  private apiUrl = 'http://localhost:5005/api/aeropuerto/Vuelos';

  constructor(private http: HttpClient) {}

  getVuelos(): Observable<VueloDto[]> {
    return this.http.get<VueloDto[]>(this.apiUrl).pipe(
      map(vuelos => vuelos.map(vuelo => ({
        ...vuelo,
        // Soporta tanto camelCase como snake_case por si el backend o PostgreSQL
        // devuelve el nombre de columna directamente en algún momento.
        precioBoleto: vuelo.precioBoleto ?? 0,
        puertaAbordaje: vuelo.puertaAbordaje ?? vuelo.puerta_abordaje ?? '',
        estadoVuelo: vuelo.estadoVuelo ?? vuelo.estado_vuelo ?? 'Programado',
        fechaApertura: vuelo.fechaApertura ?? vuelo.fecha_apertura ?? null
      })))
    );
  }

  crearVuelo(vuelo: Vuelo): Observable<VueloDto> {
    return this.http.post<VueloDto>(this.apiUrl, vuelo);
  }

  actualizarVuelo(vuelo: Vuelo): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${vuelo.vueloId}`, vuelo);
  }

  abrirVuelo(id: number): Observable<VueloDto> {
    return this.http.post<VueloDto>(`${this.apiUrl}/${id}/abrir`, {});
  }

  eliminarVuelo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
