import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('reservaciones-web');
  isServerOn = signal(false);

  async checkServerOn(): Promise<void> { 
    try {
      const response = await fetch('http://localhost:5262/api/aeropuerto/Usuarios');
 
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      } 

      this.isServerOn.set(true)

    } catch (err) {
      console.error(err + ': No se pudo conectar al servidor');
    }
  }

}
