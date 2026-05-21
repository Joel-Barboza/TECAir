namespace TECAirAPI.Models
{
    public class Usuario
    {
        public int UsuarioId { get; set; }

        public string Nombre { get; set; } = string.Empty;

        public string Apellido1 { get; set; } = string.Empty;

        public string? Apellido2 { get; set; }

        public string Email { get; set; } = string.Empty;

        public string Telefono { get; set; } = string.Empty;

        public int? Carnet { get; set; }

        public string? Universidad { get; set; }
    }
}
