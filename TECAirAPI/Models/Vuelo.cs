namespace TECAirAPI.Models;

public class Vuelo
{
    public int VueloId { get; set; }  // vuelo_id
    public int AeropuertoId { get; set; }
    public int AvionId { get; set; }
    public int Asientos { get; set; }
    public string Destino { get; set; }
    public string Salida { get; set; }
    public DateTime FechaSalida { get; set; }
    public DateTime FechaLlegada { get; set; }
}