// Promocion.cs
public class Promocion
{
    public int PromocionId { get; set; }  // promocion_id
    public int VueloId { get; set; }
    public string Origen { get; set; }
    public string Destino { get; set; }
    public decimal Descuento { get; set; }
    public DateTime FechaInicio { get; set; }
    public DateTime FechaFin { get; set; }
}