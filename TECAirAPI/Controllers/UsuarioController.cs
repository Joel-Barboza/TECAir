using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TECAirAPI.Data;
using TECAirAPI.Models;
using TECAirAPI.DTOs;
using TECAirAPI.Helpers;

namespace TECAirAPI.Controllers
{
    [Route("api/aeropuerto/[controller]")]
    [ApiController]
    public class UsuariosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsuariosController(AppDbContext context)
        {
            _context = context;
        }

        private UsuarioDto ConvertirADto(Usuario usuario)
        {
            var apellido2 = string.IsNullOrEmpty(usuario.Apellido2) ? "" : $" {usuario.Apellido2}";
            var nombreCompleto = $"{usuario.Nombre} {usuario.Apellido1}{apellido2}";

            return new UsuarioDto
            {
                UsuarioId = usuario.UsuarioId,
                CodigoVisible = CodeGenerator.GenerateUsuarioCode(usuario.UsuarioId),
                Nombre = usuario.Nombre,
                Apellido1 = usuario.Apellido1,
                Apellido2 = usuario.Apellido2,
                NombreCompleto = nombreCompleto,
                Email = usuario.Email,
                Telefono = usuario.Telefono,
                Carnet = usuario.Carnet,
                Universidad = usuario.Universidad
            };
        }

        // GET: api/aeropuerto/Usuarios
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UsuarioDto>>> GetUsuarios()
        {
            try
            {
                var usuarios = await _context.Usuarios.ToListAsync();
                var usuariosDtos = usuarios.Select(u => ConvertirADto(u)).ToList();
                return Ok(usuariosDtos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al obtener usuarios: {ex.Message}");
            }
        }

        // POST: api/aeropuerto/Usuarios
        [HttpPost]
        public async Task<ActionResult<UsuarioDto>> CrearUsuario(Usuario usuario)
        {
            try
            {
                _context.Usuarios.Add(usuario);
                await _context.SaveChangesAsync();
                var usuarioDto = ConvertirADto(usuario);
                return CreatedAtAction(nameof(GetUsuarios), new { id = usuario.UsuarioId }, usuarioDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al crear usuario: {ex.Message}");
            }
        }

        // PUT: api/aeropuerto/Usuarios/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> ActualizarUsuario(int id, Usuario usuario)
        {
            if (id != usuario.UsuarioId)
                return BadRequest("El ID del usuario no coincide.");

            _context.Entry(usuario).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Usuarios.Any(e => e.UsuarioId == id))
                    return NotFound();
                else
                    throw;
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al actualizar usuario: {ex.Message}");
            }
        }

        // DELETE: api/aeropuerto/Usuarios/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> EliminarUsuario(int id)
        {
            try
            {
                var usuario = await _context.Usuarios.FindAsync(id);
                if (usuario == null)
                    return NotFound($"No se encontró el usuario con id {id}");

                _context.Usuarios.Remove(usuario);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al eliminar usuario: {ex.Message}");
            }
        }
    }
}