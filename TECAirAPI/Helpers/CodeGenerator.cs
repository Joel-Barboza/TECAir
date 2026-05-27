namespace TECAirAPI.Helpers;

public static class CodeGenerator
{
    /// <summary>
    /// Genera un código visible para usuarios (USR-0001, USR-0002, etc.)
    /// </summary>
    public static string GenerateUsuarioCode(int usuarioId)
    {
        return $"USR-{usuarioId.ToString().PadLeft(4, '0')}";
    }

    /// <summary>
    /// Genera un código visible para vuelos (VUE-001, VUE-002, etc.)
    /// </summary>
    public static string GenerateVueloCode(int vueloId)
    {
        return $"VUE-{vueloId.ToString().PadLeft(3, '0')}";
    }

    /// <summary>
    /// Genera un código visible para promociones (PROMO-001, PROMO-002, etc.)
    /// </summary>
    public static string GeneratePromocionCode(int promocionId)
    {
        return $"PROMO-{promocionId.ToString().PadLeft(3, '0')}";
    }

    /// <summary>
    /// Genera una descripción de ruta (Origen → Destino)
    /// </summary>
    public static string GenerateRutaDescripcion(string origen, string destino)
    {
        return $"{origen} → {destino}";
    }

    /// <summary>
    /// Genera una descripción completa de vuelo con código, ruta y fecha
    /// </summary>
    public static string GenerateVueloDescripcion(int vueloId, string origen, string destino, DateTime fechaSalida)
    {
        var codigo = GenerateVueloCode(vueloId);
        var ruta = GenerateRutaDescripcion(origen, destino);
        var fecha = fechaSalida.ToString("dd/MM/yyyy");
        var hora = fechaSalida.ToString("HH:mm");
        return $"{codigo} - {ruta} - {fecha} {hora}";
    }

    /// <summary>
    /// Genera descripción de aeropuerto (Nombre - Ubicación)
    /// </summary>
    public static string GenerateAeropuertoDescripcion(string nombre, string ubicacion)
    {
        return $"{nombre} - {ubicacion}";
    }

    /// <summary>
    /// Genera descripción de avión (Modelo - Capacidad XX pasajeros)
    /// </summary>
    public static string GenerateAvionDescripcion(string modelo, int capacidad)
    {
        return $"{modelo} - Capacidad {capacidad} pasajeros";
    }
}
