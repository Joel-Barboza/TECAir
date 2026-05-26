namespace TECAirAPI.Models;

public class CheckinRequest
{
    public int ReservaId { get; set; }

    public List<string> Asientos { get; set; }
}