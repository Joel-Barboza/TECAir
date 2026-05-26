namespace TECAirAPI.DTOs;

public class AvionDto
{
    public int AvionId { get; set; }
    public string Modelo { get; set; }
    public int Capacidad { get; set; }
    public string ModeloYCapacidad { get; set; } // "Modelo - Capacidad XX pasajeros"
}
