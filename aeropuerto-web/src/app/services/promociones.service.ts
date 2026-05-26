import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Promocion {
  promocionId?: number;
  vueloId: number;
  origen: string;
  destino: string;
  precioBoleto?: number;
  descuento: number;
  montoDescuento?: number;
  precioFinal?: number;
  fechaInicio: string;
  fechaFin: string;
}

export interface PromocionDto {
  promocionId: number;
  vueloId: number;
  codigoVuelo: string; // VUE-001, etc.
  descripcionVuelo: string; // "VUE-001 - Origen → Destino - 26/05/2026"
  origen: string;
  destino: string;
  precioBoleto?: number;
  descuento: number;
  montoDescuento?: number;
  precioFinal?: number;
  fechaInicio: string;
  fechaFin: string;
}

@Injectable({
  providedIn: 'root'
})
export class PromocionesService {
  private apiUrl = 'http://localhost:5262/api/aeropuerto/Promociones';

  constructor(private http: HttpClient) {}

  getPromociones(): Observable<PromocionDto[]> {
    return this.http.get<PromocionDto[]>(this.apiUrl);
  }

  crearPromocion(promo: Promocion): Observable<PromocionDto> {
    return this.http.post<PromocionDto>(this.apiUrl, promo);
  }

  actualizarPromocion(promo: Promocion): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${promo.promocionId}`, promo);
  }

  eliminarPromocion(promocionId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${promocionId}`);
  }
}
