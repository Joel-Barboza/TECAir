using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TECAirAPI.Data;
using TECAirAPI.Models;

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

        // GET: api/aeropuerto/Usuarios
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Usuario>>> GetUsuarios()
        {
            try
            {
                return await _context.Usuarios.ToListAsync();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al obtener usuarios: {ex.Message}");
            }
        }

        // POST: api/aeropuerto/Usuarios
        [HttpPost]
        public async Task<ActionResult<Usuario>> CrearUsuario(Usuario usuario)
        {
            try
            {
                _context.Usuarios.Add(usuario);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetUsuarios), new { id = usuario.UsuarioId }, usuario);
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