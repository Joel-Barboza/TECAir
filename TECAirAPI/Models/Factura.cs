namespace TECAirAPI.Models;

public class Factura
{
    public int FacturaId { get; set; }  // factura_id
    public int BoletoId { get; set; }
    public string MetodoPago { get; set; }
    public decimal Total { get; set; }
    public DateTime FechaEmision { get; set; }
}