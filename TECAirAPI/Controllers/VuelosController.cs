using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TECAirAPI.Data;
using TECAirAPI.Models;

namespace TECAirAPI.Controllers
{
    [Route("api/aeropuerto/[controller]")]
    [ApiController]
    public class VuelosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public VuelosController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/aeropuerto/Vuelos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Vuelo>>> GetVuelos()
        {
            try
            {
                return await _context.Vuelos.ToListAsync();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al obtener vuelos: {ex.Message}");
            }
        }

        // POST: api/aeropuerto/Vuelos
        [HttpPost]
        public async Task<ActionResult<Vuelo>> CrearVuelo(Vuelo vuelo)
        {
            try
            {
                _context.Vuelos.Add(vuelo);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetVuelos), new { id = vuelo.VueloId }, vuelo);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al crear vuelo: {ex.Message}");
            }
        }

        // PUT: api/aeropuerto/Vuelos/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> ActualizarVuelo(int id, Vuelo vuelo)
        {
            if (id != vuelo.VueloId)
                return BadRequest("El id no coincide.");

            _context.Entry(vuelo).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Vuelos.Any(v => v.VueloId == id))
                    return NotFound();
                throw;
            }

            return NoContent();
        }

        // DELETE: api/aeropuerto/Vuelos/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> EliminarVuelo(int id)
        {
            try
            {
                var vuelo = await _context.Vuelos.FindAsync(id);
                if (vuelo == null)
                    return NotFound($"No se encontró el vuelo con id {id}");

                _context.Vuelos.Remove(vuelo);
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al eliminar vuelo: {ex.Message}");
            }
        }
    }
}