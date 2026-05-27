import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Promocion {
  promocionId: number;
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
  private apiUrl = 'http://localhost:5005/api/aeropuerto/Promociones';

  constructor(private http: HttpClient) {}

  getPromociones(): Observable<Promocion[]> {
    return this.http.get<Promocion[]>(this.apiUrl);
  }
}
