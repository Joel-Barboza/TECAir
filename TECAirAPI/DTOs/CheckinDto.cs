namespace TECAirAPI.DTOs;

public class CheckinDto
{
    public int CheckinId { get; set; }
    public int ReservaId { get; set; }
    public string CodigoReserva { get; set; } = string.Empty;
    public int UsuarioId { get; set; }
    public string CodigoUsuario { get; set; } = string.Empty;
    public string NombrePasajero { get; set; } = string.Empty;
    public int VueloId { get; set; }
    public string CodigoVuelo { get; set; } = string.Empty;
    public string NumeroVuelo { get; set; } = string.Empty;
    public string Origen { get; set; } = string.Empty;
    public string Destino { get; set; } = string.Empty;
    public DateTime HoraSalida { get; set; }
    public string PuertaAbordaje { get; set; } = string.Empty;
    public int AsientoId { get; set; }
    public string NumAsiento { get; set; } = string.Empty;
    public string TipoAsiento { get; set; } = string.Empty;
    public DateTime FechaCheckin { get; set; }
    public string? MetodoEnvio { get; set; }
    public string? EstadoEnvio { get; set; }
    public string DescripcionReserva { get; set; } = string.Empty;
    public string DescripcionPase { get; set; } = string.Empty;
}
