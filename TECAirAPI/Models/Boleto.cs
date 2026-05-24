// Boleto.cs
public class Boleto
{
    public int BoletoId { get; set; }  // boleto_id
    public int ReservaId { get; set; }
    public decimal Precio { get; set; }
    public string Asiento { get; set; }
    public DateTime Fecha { get; set; }
    public string EstadoPago { get; set; }
}