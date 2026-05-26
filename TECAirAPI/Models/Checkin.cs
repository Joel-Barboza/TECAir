namespace TECAirAPI.Models;

public class Checkin
{
    public int CheckinId { get; set; }
    public int ReservaId { get; set; }
    public int AsientoId { get; set; }
    public DateTime FechaCheckin { get; set; }
    public string? MetodoEnvio { get; set; }
    public string? EstadoEnvio { get; set; }
}
