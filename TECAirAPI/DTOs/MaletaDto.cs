namespace TECAirAPI.DTOs;

public class MaletaDto
{
    public int MaletaId { get; set; }
    public int ReservaId { get; set; }
    public string DescripcionReserva { get; set; } // Información de la reserva para mostrar
    public decimal Peso { get; set; }
    public string Color { get; set; }
    public decimal CostoAdicional { get; set; }
}
