# Sobre API

## Dependencias

```bash
dotnet add package Microsoft.EntityFrameworkCore
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL
dotnet add package Swashbuckle.AspNetCore
```


## Configuracion en appsettings.json
```json
...

  "ConnectionStrings": {
    "PostgresConnection": "Host=localhost;Port=5432;Database=TECAir;Username=postgres;Password=tecair"
  }

...
```

## Swagger

http://localhost:5262/swagger o el puerto que aparezca al correr al api en Visual Studio
