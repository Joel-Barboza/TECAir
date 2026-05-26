namespace TECAirAPI.DTOs;

public class PromocionDto
{
    public int PromocionId { get; set; }
    public int VueloId { get; set; }
    public string CodigoVuelo { get; set; } // VUE-001, etc.
    public string DescripcionVuelo { get; set; } // "VUE-001 - Origen → Destino - 26/05/2026"
    public string Origen { get; set; }
    public string Destino { get; set; }
    public decimal Descuento { get; set; }
    public DateTime FechaInicio { get; set; }
    public DateTime FechaFin { get; set; }
}
