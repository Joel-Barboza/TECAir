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
  mensaje = '';
  error = '';

  constructor(private promocionesService: PromocionesService) {}

  ngOnInit(): void {
    this.promocionesService.getPromociones().subscribe({
      next: (data) => {
        this.promociones = data;
      },
      error: (err) => {
        this.error = 'No se pudieron cargar las promociones.';
        console.error(err);
      }
    });
  }
}
