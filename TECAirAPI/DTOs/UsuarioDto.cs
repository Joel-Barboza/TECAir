namespace TECAirAPI.DTOs;

public class UsuarioDto
{
    public int UsuarioId { get; set; }
    public string CodigoVisible { get; set; } // USR-0001, USR-0002, etc.
    public string Nombre { get; set; }
    public string Apellido1 { get; set; }
    public string? Apellido2 { get; set; }
    public string NombreCompleto { get; set; } // Nombre Apellido1 Apellido2
    public string Email { get; set; }
    public string Telefono { get; set; }
    public int? Carnet { get; set; }
    public string? Universidad { get; set; }
}
