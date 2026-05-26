namespace TECAirAPI.DTOs;

public class VueloDto
{
    public int VueloId { get; set; }
    public string CodigoVisible { get; set; } // VUE-001, VUE-002, etc.
    public int AeropuertoId { get; set; }
    public string NombreAeropuerto { get; set; }
    public string UbicacionAeropuerto { get; set; }
    public int AvionId { get; set; }
    public string ModeloAvion { get; set; }
    public int CapacidadAvion { get; set; }
    public int Asientos { get; set; }
    public string Origen { get; set; }
    public string Destino { get; set; }
    public string RutaDescripcion { get; set; } // "Origen → Destino" para mostrar
    public DateTime FechaSalida { get; set; }
    public DateTime FechaLlegada { get; set; }
    public decimal PrecioBoleto { get; set; }
    public string? PuertaAbordaje { get; set; }
    public string DescripcionCompleta { get; set; } // "VUE-001 - Origen → Destino - 26/05/2026 10:30"
}
