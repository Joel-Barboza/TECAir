import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PromocionesService, Promocion } from '../../services/promociones.service';

@Component({
  selector: 'app-promociones',
  templateUrl: './promociones.component.html',
  styleUrls: ['./promociones.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class PromocionesComponent {
  promociones: Promocion[] = [];
  nuevaPromocion: Promocion = {
    origen: '',
    destino: '',
    precio: 0,
    fechaInicio: '',
    fechaFin: ''
  };

  constructor(private promocionesService: PromocionesService) {
    this.cargarPromociones();
  }

  cargarPromociones() {
    this.promocionesService.getPromociones().subscribe(data => {
      this.promociones = data;
    });
  }

  agregarPromocion() {
    this.promocionesService.crearPromocion(this.nuevaPromocion).subscribe(() => {
      this.cargarPromociones();
      this.nuevaPromocion = {
        origen: '',
        destino: '',
        precio: 0,
        fechaInicio: '',
        fechaFin: ''
      };
    });
  }

  eliminarPromocion(id: number) {
    this.promocionesService.eliminarPromocion(id).subscribe(() => {
      this.cargarPromociones();
    });
  }
}