# ReservacionesWeb

Interfaz web para clientes de TECAir. Permite a los usuarios consultar vuelos, gestionar reservas, ver promociones y administrar su perfil.

Generado con [Angular CLI](https://github.com/angular/angular-cli) versión 21.2.7.

## Requisitos previos

- [Node.js](https://nodejs.org/) v18 o superior
- Angular CLI: `npm install -g @angular/cli`
- **TECAirAPI corriendo** en `http://localhost:5262` (ver `TECAirAPI/README.md`)
- Base de datos PostgreSQL inicializada con `EmptyState.sql` e `InitialState.sql`

## Instalación

```bash
npm install
```

## Servidor de desarrollo

```bash
ng serve
```

Abre el navegador en `http://localhost:4200/`

> **Nota:** La API debe estar corriendo antes de iniciar esta app, de lo contrario las llamadas a la base de datos fallarán

## Secciones

| Ruta | Descripción |
|------|-------------|
| `/usuarios` | Registro y gestión de usuarios (CRUD completo) |
| `/vuelos` | Búsqueda de vuelos por origen, destino y fecha; permite crear una reserva |
| `/reservas` | Listado de reservas filtrado por usuario |
| `/promociones` | Visualización de promociones activas por vuelo |

## Build

```bash
ng build
```

Los artefactos se generan en el directorio `dist/`.
