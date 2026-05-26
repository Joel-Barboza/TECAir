import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AeropuertoDto {
  aeropuertoId: number;
  nombre: string;
  ubicacion: string;
  nombreYUbicacion: string; // "Nombre - Ubicacion"
}

@Injectable({
  providedIn: 'root'
})
export class AeropuertosService {
  private apiUrl = 'http://localhost:5262/api/aeropuerto/Aeropuertos';

  constructor(private http: HttpClient) { }

  getAeropuertos(): Observable<AeropuertoDto[]> {
    return this.http.get<AeropuertoDto[]>(this.apiUrl);
  }

  crearAeropuerto(aeropuerto: AeropuertoDto): Observable<AeropuertoDto> {
    return this.http.post<AeropuertoDto>(this.apiUrl, aeropuerto);
  }

  actualizarAeropuerto(aeropuerto: AeropuertoDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${aeropuerto.aeropuertoId}`, aeropuerto);
  }

  eliminarAeropuerto(aeropuertoId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${aeropuertoId}`);
  }
}
