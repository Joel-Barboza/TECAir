import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AvionDto {
  avionId: number;
  modelo: string;
  capacidad: number;
  modeloYCapacidad: string; // "Modelo - Capacidad XX pasajeros"
}

@Injectable({
  providedIn: 'root'
})
export class AvionesService {
  private apiUrl = 'http://localhost:5005/api/aeropuerto/Aviones';

  constructor(private http: HttpClient) { }

  getAviones(): Observable<AvionDto[]> {
    return this.http.get<AvionDto[]>(this.apiUrl);
  }

  crearAvion(avion: AvionDto): Observable<AvionDto> {
    return this.http.post<AvionDto>(this.apiUrl, avion);
  }

  actualizarAvion(avion: AvionDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${avion.avionId}`, avion);
  }

  eliminarAvion(avionId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${avionId}`);
  }
}
