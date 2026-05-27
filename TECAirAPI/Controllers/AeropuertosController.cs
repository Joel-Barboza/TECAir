using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TECAirAPI.Data;
using TECAirAPI.Models;
using TECAirAPI.DTOs;

namespace TECAirAPI.Controllers
{
    [Route("api/aeropuerto/[controller]")]
    [ApiController]
    public class AeropuertosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AeropuertosController(AppDbContext context)
        {
            _context = context;
        }

        private AeropuertoDto ConvertirADto(Aeropuerto aeropuerto)
        {
            return new AeropuertoDto
            {
                AeropuertoId = aeropuerto.AeropuertoId,
                Nombre = aeropuerto.Nombre,
                Ubicacion = aeropuerto.Ubicacion,
                NombreYUbicacion = $"{aeropuerto.Nombre} - {aeropuerto.Ubicacion}"
            };
        }

        // GET: api/aeropuerto/Aeropuertos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AeropuertoDto>>> GetAeropuertos()
        {
            try
            {
                var aeropuertos = await _context.Aeropuertos.ToListAsync();
                var aeropuertosDtos = aeropuertos.Select(a => ConvertirADto(a)).ToList();
                return Ok(aeropuertosDtos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al obtener aeropuertos: {ex.Message}");
            }
        }

        // GET: api/aeropuerto/Aeropuertos/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<AeropuertoDto>> GetAeropuerto(int id)
        {
            try
            {
                var aeropuerto = await _context.Aeropuertos.FindAsync(id);
                if (aeropuerto == null)
                    return NotFound();

                return Ok(ConvertirADto(aeropuerto));
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al obtener aeropuerto: {ex.Message}");
            }
        }

        // POST: api/aeropuerto/Aeropuertos
        [HttpPost]
        public async Task<ActionResult<AeropuertoDto>> CrearAeropuerto(Aeropuerto aeropuerto)
        {
            try
            {
                _context.Aeropuertos.Add(aeropuerto);
                await _context.SaveChangesAsync();
                var aeropuertoDto = ConvertirADto(aeropuerto);
                return CreatedAtAction(nameof(GetAeropuerto), new { id = aeropuerto.AeropuertoId }, aeropuertoDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al crear aeropuerto: {ex.Message}");
            }
        }

        // PUT: api/aeropuerto/Aeropuertos/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> ActualizarAeropuerto(int id, Aeropuerto aeropuerto)
        {
            if (id != aeropuerto.AeropuertoId)
                return BadRequest("El ID no coincide");

            _context.Entry(aeropuerto).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Aeropuertos.Any(a => a.AeropuertoId == id))
                    return NotFound();
                throw;
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al actualizar aeropuerto: {ex.Message}");
            }
        }

        // DELETE: api/aeropuerto/Aeropuertos/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> EliminarAeropuerto(int id)
        {
            try
            {
                var aeropuerto = await _context.Aeropuertos.FindAsync(id);
                if (aeropuerto == null)
                    return NotFound();

                _context.Aeropuertos.Remove(aeropuerto);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al eliminar aeropuerto: {ex.Message}");
            }
        }
    }
}
