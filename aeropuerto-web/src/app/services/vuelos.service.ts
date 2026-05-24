import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Vuelo {
  vueloId?: number;
  origen: string;
  destino: string;
  precio: number;
  periodo: string;
}

@Injectable({
  providedIn: 'root'
})
export class VuelosService {
  private apiUrl = 'https://localhost:5001/api/aeropuerto/Vuelos'; // Ajusta al puerto correcto

  constructor(private http: HttpClient) {}

  getVuelos(): Observable<Vuelo[]> {
    return this.http.get<Vuelo[]>(this.apiUrl);
  }

  crearVuelo(vuelo: Vuelo): Observable<Vuelo> {
    return this.http.post<Vuelo>(this.apiUrl, vuelo);
  }

  eliminarVuelo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}