namespace TECAirAPI.Models
{
    public class Usuario
    {
        public int UsuarioId { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Apellido1 { get; set; } = string.Empty;
        public string? Apellido2 { get; set; }
        public string Email { get; set; } = string.Empty;
        public string Telefono { get; set; } = string.Empty;
        public int? Carnet { get; set; }
        public string? Universidad { get; set; }
        public List<Reserva>? Reservas { get; set; } // Relación 1:N con reservas
    }

    public class Aeropuerto
    {
        public int AeropuertoId { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Ubicacion { get; set; } = string.Empty;
        public List<Vuelo>? Vuelos { get; set; } // 1:N vuelos
    }

    public class Avion
    {
        public int AvionId { get; set; }
        public int Capacidad { get; set; }
        public string Modelo { get; set; } = string.Empty;
        public List<Vuelo>? Vuelos { get; set; }
    }

    public class Vuelo
    {
        public int VueloId { get; set; }
        public int AeropuertoId { get; set; }
        public Aeropuerto? Aeropuerto { get; set; }
        public int AvionId { get; set; }
        public Avion? Avion { get; set; }
        public int Asientos { get; set; }
        public string Destino { get; set; } = string.Empty;
        public DateTime Salida { get; set; }
        public DateTime FechaSalida { get; set; }
        public DateTime FechaLlegada { get; set; }
        public List<Reserva>? Reservas { get; set; }
        public List<Promocion>? Promociones { get; set; }
    }

    public class Reserva
    {
        public int ReservaId { get; set; }
        public int UsuarioId { get; set; }
        public Usuario? Usuario { get; set; }
        public int VueloId { get; set; }
        public Vuelo? Vuelo { get; set; }
        public DateTime FechaReserva { get; set; }
        public int AsientosReservados { get; set; }
        public string EstadoPago { get; set; } = string.Empty;
        public List<Boleto>? Boletos { get; set; }
        public List<Maleta>? Maletas { get; set; }
    }

    public class Boleto
    {
        public int BoletoId { get; set; }
        public int ReservaId { get; set; }
        public Reserva? Reserva { get; set; }
        public decimal Precio { get; set; }
        public string Asiento { get; set; } = string.Empty;
        public DateTime Fecha { get; set; }
        public string EstadoPago { get; set; } = string.Empty;
        public Factura? Factura { get; set; }
    }

    public class Factura
    {
        public int FacturaId { get; set; }
        public int BoletoId { get; set; }
        public Boleto? Boleto { get; set; }
        public string MetodoPago { get; set; } = string.Empty;
        public decimal Total { get; set; }
        public DateTime FechaEmision { get; set; }
    }

    public class Maleta
    {
        public int MaletaId { get; set; }
        public int ReservaId { get; set; }
        public Reserva? Reserva { get; set; }
        public decimal Peso { get; set; }
        public string Color { get; set; } = string.Empty;
        public decimal CostoAdicional { get; set; }
    }

    public class Promocion
    {
        public int PromocionId { get; set; }
        public int VueloId { get; set; }
        public Vuelo? Vuelo { get; set; }
        public string Origen { get; set; } = string.Empty;
        public string Destino { get; set; } = string.Empty;
        public decimal Descuento { get; set; }
        public DateTime FechaInicio { get; set; }
        public DateTime FechaFin { get; set; }
    }

    public class Asiento
    {
        public int AsientoId { get; set; }
        public int ReservaId { get; set; }
        public Reserva? Reserva { get; set; }
        public string NumAsiento { get; set; } = string.Empty;
        public string Tipo { get; set; } = string.Empty; // ventana, pasillo, etc.
    }
}