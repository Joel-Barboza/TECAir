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

@Injectable({
  providedIn: 'root'
})
export class VuelosService {
  private apiUrl = 'http://localhost:5262/api/aeropuerto/Vuelos';

  constructor(private http: HttpClient) {}

  getVuelos(): Observable<Vuelo[]> {
    return this.http.get<Vuelo[]>(this.apiUrl);
  }

  crearVuelo(vuelo: Vuelo): Observable<Vuelo> {
    return this.http.post<Vuelo>(this.apiUrl, vuelo);
  }

  actualizarVuelo(vuelo: Vuelo): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${vuelo.vueloId}`, vuelo);
  }

  eliminarVuelo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}