import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaletasService, Maleta } from '../../services/maletas.service';

@Component({
  selector: 'app-maletas',
  templateUrl: './maletas.component.html',
  styleUrls: ['./maletas.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class MaletasComponent {
  maletas: Maleta[] = [];
  nuevaMaleta: Maleta = {
    reservaId: 0,
    peso: 0,
    color: '',
    costoAdicional: 0
  };

  constructor(private maletasService: MaletasService) {
    this.cargarMaletas();
  }

  cargarMaletas() {
    this.maletasService.getMaletas().subscribe(data => {
      this.maletas = data;
    });
  }

  agregarMaleta() {
    this.maletasService.crearMaleta(this.nuevaMaleta).subscribe(() => {
      this.cargarMaletas();
      this.nuevaMaleta = { reservaId: 0, peso: 0, color: '', costoAdicional: 0 };
    });
  }

  eliminarMaleta(id: number) {
    this.maletasService.eliminarMaleta(id).subscribe(() => {
      this.cargarMaletas();
    });
  }
}