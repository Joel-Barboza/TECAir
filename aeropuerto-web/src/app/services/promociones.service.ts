import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Promocion {
  promocionId?: number;
  vueloId?: number;   // opcional, si la promo se asocia a un vuelo
  origen: string;
  destino: string;
  precio: number;
  fechaInicio: string;
  fechaFin: string;
  imagenUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PromocionesService {
  private apiUrl = 'https://localhost:5001/api/aeropuerto/Promociones';

  constructor(private http: HttpClient) {}

  getPromociones(): Observable<Promocion[]> {
    return this.http.get<Promocion[]>(this.apiUrl);
  }

  crearPromocion(promo: Promocion): Observable<Promocion> {
    return this.http.post<Promocion>(this.apiUrl, promo);
  }

  eliminarPromocion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}