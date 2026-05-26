namespace TECAirAPI.DTOs;

public class MaletaDto
{
    public int MaletaId { get; set; }
    public string NumeroMaleta { get; set; } // MAL-001, MAL-002, etc.
    public int ReservaId { get; set; }
    public string CodigoReserva { get; set; } // RES-001, RES-002, etc.
    public string NombreDueno { get; set; } // Pasajero dueño de la maleta
    public string DescripcionReserva { get; set; } // Información de la reserva para mostrar
    public decimal Peso { get; set; }
    public string Color { get; set; }
    public decimal CostoAdicional { get; set; }
    public int TotalMaletasReserva { get; set; }
    public decimal TotalCostoReserva { get; set; }
}
