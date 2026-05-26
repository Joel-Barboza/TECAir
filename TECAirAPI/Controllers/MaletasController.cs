using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TECAirAPI.Data;
using TECAirAPI.Models;

namespace TECAirAPI.Controllers
{
    [Route("api/aeropuerto/[controller]")]
    [ApiController]
    public class MaletasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MaletasController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Maleta>>> GetMaletas()
        {
            try
            {
                return await _context.Maletas.ToListAsync();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al obtener maletas: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<ActionResult<Maleta>> CrearMaleta(Maleta maleta)
        {
            try
            {
                _context.Maletas.Add(maleta);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetMaletas), new { id = maleta.MaletaId }, maleta);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al crear maleta: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> ActualizarMaleta(int id, Maleta maleta)
        {
            if (id != maleta.MaletaId)
                return BadRequest("El ID de la URL no coincide con el ID de la maleta");

            _context.Entry(maleta).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (DbUpdateConcurrencyException)
            {
                var existe = await _context.Maletas.AnyAsync(m => m.MaletaId == id);
                if (!existe)
                    return NotFound();
                throw;
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al actualizar maleta: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> EliminarMaleta(int id)
        {
            try
            {
                var maleta = await _context.Maletas.FindAsync(id);
                if (maleta == null) return NotFound();

                _context.Maletas.Remove(maleta);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al eliminar maleta: {ex.Message}");
            }
        }
    }
}