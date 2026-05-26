namespace TECAirAPI.DTOs;

public class ReservaDto
{
    public int ReservaId { get; set; }
    public int UsuarioId { get; set; }
    public string NombreUsuario { get; set; }
    public string CodigoUsuario { get; set; } // USR-0001, etc.
    public int VueloId { get; set; }
    public string CodigoVuelo { get; set; } // VUE-001, etc.
    public string DescripcionVuelo { get; set; } // "VUE-001 - Origen → Destino - 26/05/2026"
    public DateTime FechaReserva { get; set; }
    public int AsientosReservados { get; set; }
    public string EstadoPago { get; set; }
}
