namespace TECAirAPI.Models;

public class Reserva
{
    public int ReservaId { get; set; }  // reserva_id
    public int UsuarioId { get; set; }
    public int VueloId { get; set; }
    public DateTime FechaReserva { get; set; }
    public int AsientosReservados { get; set; }
    public string EstadoPago { get; set; }
}