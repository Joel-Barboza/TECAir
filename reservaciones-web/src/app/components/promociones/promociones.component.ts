import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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

  constructor(
    private promocionesService: PromocionesService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarPromociones();
  }

  cargarPromociones(): void {
    this.error = '';

    this.promocionesService.getPromociones().subscribe({
      next: (data) => {
        this.promociones = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'No se pudieron cargar las promociones.';
        this.cdr.detectChanges();
        console.error(err);
      }
    });
  }
}
