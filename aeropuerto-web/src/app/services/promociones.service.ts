import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Promocion {
  promocionId?: number;
  vueloId: number;
  origen: string;
  destino: string;
  descuento: number;
  fechaInicio: string;
  fechaFin: string;
}

@Injectable({
  providedIn: 'root'
})
export class PromocionesService {
  private apiUrl = 'http://localhost:5262/api/aeropuerto/Promociones';

  constructor(private http: HttpClient) {}

  getPromociones(): Observable<Promocion[]> {
    return this.http.get<Promocion[]>(this.apiUrl);
  }

  crearPromocion(promo: Promocion): Observable<Promocion> {
    return this.http.post<Promocion>(this.apiUrl, promo);
  }

  actualizarPromocion(promo: Promocion): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${promo.promocionId}`, promo);
  }

  eliminarPromocion(promocionId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${promocionId}`);
  }
}