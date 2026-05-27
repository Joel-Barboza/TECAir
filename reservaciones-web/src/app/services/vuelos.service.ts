import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Vuelo {
  vueloId: number;
  aeropuertoId: number;
  avionId: number;
  asientos: number;
  destino: string;
  salida: string;
  fechaSalida: string;
  fechaLlegada: string;
}

@Injectable({
  providedIn: 'root'
})
export class VuelosService {
  private apiUrl = 'http://localhost:5005/api/aeropuerto/Vuelos';

  constructor(private http: HttpClient) {}

  getVuelos(): Observable<Vuelo[]> {
    return this.http.get<Vuelo[]>(this.apiUrl);
  }

  actualizarVuelo(vuelo: Vuelo): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${vuelo.vueloId}`, vuelo);
  }
}
