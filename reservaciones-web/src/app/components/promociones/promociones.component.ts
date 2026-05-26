import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PromocionesService, Promocion } from '../../services/promociones.service';

@Component({
  selector: 'app-promociones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './promociones.component.html',
  styleUrls: ['./promociones.component.css']
})
export class PromocionesComponent implements OnInit {
  promociones: Promocion[] = [];
  error = '';

  constructor(private promocionesService: PromocionesService) {}

  ngOnInit(): void {
    this.cargarPromociones();
  }

  cargarPromociones(): void {
    this.error = '';

    this.promocionesService.getPromociones().subscribe({
      next: (data) => {
        this.promociones = data;
      },
      error: (err) => {
        this.error = 'No se pudieron cargar las promociones. Verifique que el servidor esté activo.';
        console.error(err);
      }
    });
  }
}
