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
    AeropuertoId: 0,
    AvionId: 0,
    Asientos: 0,
    Destino: '',
    Salida: '',
    FechaSalida: '',
    FechaLlegada: ''
  };

  constructor(private vuelosService: VuelosService) {
    this.cargarVuelos();
  }

  cargarVuelos() {
    this.vuelosService.getVuelos().subscribe(data => this.vuelos = data);
  }

  agregarVuelo() {
    console.log('Agregando vuelo:', this.nuevoVuelo);
    this.vuelosService.crearVuelo(this.nuevoVuelo).subscribe(() => {
      this.cargarVuelos();
      this.nuevoVuelo = {
        AeropuertoId: 0,
        AvionId: 0,
        Asientos: 0,
        Destino: '',
        Salida: '',
        FechaSalida: '',
        FechaLlegada: ''
      };
    });
  }

  eliminarVuelo(id: number) {
    this.vuelosService.eliminarVuelo(id).subscribe(() => this.cargarVuelos());
  }
}