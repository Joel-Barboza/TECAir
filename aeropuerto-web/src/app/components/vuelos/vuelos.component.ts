import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VuelosService, Vuelo } from '../../services/vuelos.service';

@Component({
  selector: 'app-vuelos',
  templateUrl: './vuelos.component.html',
  styleUrls: ['./vuelos.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class VuelosComponent {
  vuelos: Vuelo[] = [];
  nuevoVuelo: Vuelo = {
    origen: '',
    destino: '',
    precio: 0,
    periodo: ''
  };

  constructor(private vuelosService: VuelosService) {
    this.cargarVuelos();
  }

  cargarVuelos() {
    this.vuelosService.getVuelos().subscribe(data => {
      this.vuelos = data;
    });
  }

  agregarVuelo() {
    this.vuelosService.crearVuelo(this.nuevoVuelo).subscribe(() => {
      this.cargarVuelos();
      this.nuevoVuelo = { origen: '', destino: '', precio: 0, periodo: '' };
    });
  }

  eliminarVuelo(id: number) {
    this.vuelosService.eliminarVuelo(id).subscribe(() => {
      this.cargarVuelos();
    });
  }
}