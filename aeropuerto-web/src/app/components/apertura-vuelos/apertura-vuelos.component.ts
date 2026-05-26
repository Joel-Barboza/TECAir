import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VuelosService, VueloDto } from '../../services/vuelos.service';
import { CheckinsService, CheckinDto } from '../../services/checkins.service';
import { MaletasService, MaletaDto } from '../../services/maletas.service';

@Component({
  selector: 'app-apertura-vuelos',
  templateUrl: './apertura-vuelos.component.html',
  styleUrls: ['./apertura-vuelos.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class AperturaVuelosComponent implements OnInit {
  vuelos: VueloDto[] = [];
  checkins: CheckinDto[] = [];
  maletas: MaletaDto[] = [];
  vueloSeleccionado?: VueloDto;
  mensaje = '';
  error = '';

  constructor(
    private vuelosService: VuelosService,
    private checkinsService: CheckinsService,
    private maletasService: MaletasService
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.mensaje = '';
    this.error = '';

    this.vuelosService.getVuelos().subscribe({
      next: (vuelos) => {
        this.vuelos = vuelos.sort((a, b) => new Date(a.fechaSalida).getTime() - new Date(b.fechaSalida).getTime());
      },
      error: (err) => {
        console.error('Error cargando vuelos:', err);
        this.error = 'No se pudieron cargar los vuelos.';
      }
    });

    this.checkinsService.getCheckins().subscribe({
      next: (checkins) => {
        this.checkins = checkins;
      },
      error: (err) => {
        console.error('Error cargando check-ins:', err);
        this.error = 'No se pudieron cargar los pasajeros chequeados.';
      }
    });

    this.maletasService.getMaletas().subscribe({
      next: (maletas) => {
        this.maletas = maletas;
      },
      error: (err) => {
        console.error('Error cargando maletas:', err);
        this.error = 'No se pudieron cargar las maletas.';
      }
    });
  }

  seleccionarVuelo(vuelo: VueloDto): void {
    this.vueloSeleccionado = vuelo;
  }

  abrirVuelo(vuelo: VueloDto): void {
    this.mensaje = '';
    this.error = '';

    this.vuelosService.abrirVuelo(vuelo.vueloId).subscribe({
      next: (vueloActualizado) => {
        this.mensaje = `${vueloActualizado.codigoVisible} fue abierto correctamente para confirmar pasajeros y maletas.`;
        this.cargarDatos();
        this.vueloSeleccionado = vueloActualizado;
      },
      error: (err) => {
        console.error('Error abriendo vuelo:', err);
        this.error = err?.error || 'No se pudo abrir el vuelo.';
      }
    });
  }

  getCheckinsVuelo(vueloId: number): CheckinDto[] {
    return this.checkins.filter(c => Number(c.vueloId) === Number(vueloId));
  }

  getCantidadPasajeros(vueloId: number): number {
    return this.getCheckinsVuelo(vueloId).length;
  }

  getCantidadMaletas(vueloId: number): number {
    const reservasDelVuelo = new Set(this.getCheckinsVuelo(vueloId).map(c => Number(c.reservaId)));
    return this.maletas.filter(m => reservasDelVuelo.has(Number(m.reservaId))).length;
  }

  getPesoTotal(vueloId: number): number {
    const reservasDelVuelo = new Set(this.getCheckinsVuelo(vueloId).map(c => Number(c.reservaId)));
    return this.maletas
      .filter(m => reservasDelVuelo.has(Number(m.reservaId)))
      .reduce((total, m) => total + Number(m.peso || 0), 0);
  }

  getMaletasReserva(reservaId: number): MaletaDto[] {
    return this.maletas.filter(m => Number(m.reservaId) === Number(reservaId));
  }

  getPesoReserva(reservaId: number): number {
    return this.getMaletasReserva(reservaId)
      .reduce((total, maleta) => total + Number(maleta.peso || 0), 0);
  }

  getEstadoClase(vuelo: VueloDto): string {
    const estado = (vuelo.estadoVuelo || 'Programado').toLowerCase();
    if (estado === 'abierto') return 'estado-abierto';
    if (estado === 'cerrado') return 'estado-cerrado';
    return 'estado-programado';
  }
}
