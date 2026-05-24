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
  private apiUrl = 'http://localhost:5005/api/aeropuerto/Maletas';

  constructor(private http: HttpClient) {}

  getMaletas(): Observable<Maleta[]> {
    return this.http.get<Maleta[]>(this.apiUrl);
  }

  crearMaleta(maleta: Maleta): Observable<Maleta> {
    return this.http.post<Maleta>(this.apiUrl, maleta);
  }

  eliminarMaleta(maletaId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${maletaId}`);
  }
}