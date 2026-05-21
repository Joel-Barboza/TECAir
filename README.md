# Proyecto #1

__TECAir - Bases de Datos (CE3101) - I Semestre 2026__

## Descripción

La empresa __TECAir__ es una empresa en el mercado de transporte aéreo de personas de bajo costo y surgió luego de una larga negociación de la mejor universidad pública de Costa Rica con las aerolíneas comerciales del área, su objetivo principal es proveer a los estudiantes la mejor alternativa para que logren realizar sus becas en el exterior.

## Estructura de Carpetas

### aeropuerto-web

### reservaciones-web

Las páginas se crean en /src/app

### Backend
__Models:__ Clases que reflejan tablas

__Repositories:__ Capa de acceso a datos

__Service:__ Lógica de negocio, llamada por los controladores e invoca repositorios

__Controllers:__ comunicación http


# Iniciar

## POSTGRESQL
En postgres pgAdmin 4, clic derecho en servers, register:

### En general

Name: TECAir

### En connection:
Hostname: localhost
Password: la que se colocó para postgres
Save Password? ON

Guardar la configuración

En servers/TECAir/Database clic derecho en postgres y seleccionar Query tool
Abrir y correr los archivos en Queries dentro del proyecto
Primero EmptyState y luego InitialState

Crear carpeta TECAirAPI en C:\inetpub y darle permiso de escritura
Crear carpetas AeropuertoWeb y ReservacionesWeb en C:\inetpub\wwwroot

En una terminal dentro de las carpetas (en ambas) aeropuerto-web y reservaciones-web hacer: 
```bash
npm i
npm run deploy
```


## Visual studio

En appsettings.json, poner los valores de acuerdo a lo que se tenga en postgresql
```json
  "ConnectionStrings": {
    "PostgresConnection": "Host=localhost;Port=5432;Database=postgres;Username=postgres;Password=SU_CONTRASEÑA"
  }
```

```bash
dotnet publish -c Release -o C:\inetpub\TECAirAPI
```


## IIS
En IIS, clic derecho en Sitios, agregar sitio web

Nombre: TECAirAPI
Puerto:  5005
Carpeta: C:\inetpub\TECAirAPI


Nombre: ReservacionesWeb
Puerto: 5006
Carpeta: C:\inetpub\wwwroot\ReservacionesWeb


Nombre: AeropuertoWeb
Puerto: 5007
Carpeta: C:\inetpub\wwwroot\AeropuertoWeb


