namespace TECAirAPI.DTOs;

public class AeropuertoDto
{
    public int AeropuertoId { get; set; }
    public string Nombre { get; set; }
    public string Ubicacion { get; set; }
    public string NombreYUbicacion { get; set; } // "Nombre - Ubicacion" para mostrar en selects
}
