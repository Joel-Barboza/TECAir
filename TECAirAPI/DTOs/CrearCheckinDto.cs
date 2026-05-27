namespace TECAirAPI.DTOs;

public class CrearCheckinDto
{
    public int ReservaId { get; set; }
    public string NumAsiento { get; set; } = string.Empty;
    public string Tipo { get; set; } = string.Empty;
    public string? MetodoEnvio { get; set; }
}
