# Sobre API

## Dependencias

```bash
dotnet add package Microsoft.EntityFrameworkCore
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL
dotnet add package Swashbuckle.AspNetCore
```


## Configuracion en appsettings.json
En crear el archivo appsettings.json, poner los valores de acuerdo a lo que se tenga en postgresql (usuario y contraseña)
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "ConnectionStrings": {
    "PostgresConnection": "Host=localhost;Port=5432;Database=TECAir;Username=SU_USERNAME;Password=SU_CONTRASEÑA"
  }
}
```

## Swagger

http://localhost:5262/swagger o el puerto que aparezca al correr al api en Visual Studio
