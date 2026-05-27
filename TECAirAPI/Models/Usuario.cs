namespace TECAirAPI.Models;

public class Usuario
{
    public int UsuarioId { get; set; }  // usuario_id
    public string Nombre { get; set; }
    public string Apellido1 { get; set; }
    public string? Apellido2 { get; set; }
    public string Email { get; set; }
    public string Telefono { get; set; }
    public int? Carnet { get; set; }
    public string? Universidad { get; set; }
}