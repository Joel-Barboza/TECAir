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

@Injectable({
  providedIn: 'root'
})
export class MaletasService {
  private apiUrl = 'https://localhost:5001/api/aeropuerto/Maletas'; // Ajusta al puerto de tu API

  constructor(private http: HttpClient) {}

  getMaletas(): Observable<Maleta[]> {
    return this.http.get<Maleta[]>(this.apiUrl);
  }

  crearMaleta(maleta: Maleta): Observable<Maleta> {
    return this.http.post<Maleta>(this.apiUrl, maleta);
  }

  eliminarMaleta(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}