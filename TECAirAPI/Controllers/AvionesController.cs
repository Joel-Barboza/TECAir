using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TECAirAPI.Data;
using TECAirAPI.Models;
using TECAirAPI.DTOs;

namespace TECAirAPI.Controllers
{
    [Route("api/aeropuerto/[controller]")]
    [ApiController]
    public class AvionesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AvionesController(AppDbContext context)
        {
            _context = context;
        }

        private AvionDto ConvertirADto(Avion avion)
        {
            return new AvionDto
            {
                AvionId = avion.AvionId,
                Modelo = avion.Modelo,
                Capacidad = avion.Capacidad,
                ModeloYCapacidad = $"{avion.Modelo} - Capacidad {avion.Capacidad} pasajeros"
            };
        }

        // GET: api/aeropuerto/Aviones
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AvionDto>>> GetAviones()
        {
            try
            {
                var aviones = await _context.Aviones.ToListAsync();
                var avionesDtos = aviones.Select(a => ConvertirADto(a)).ToList();
                return Ok(avionesDtos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al obtener aviones: {ex.Message}");
            }
        }

        // GET: api/aeropuerto/Aviones/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<AvionDto>> GetAvion(int id)
        {
            try
            {
                var avion = await _context.Aviones.FindAsync(id);
                if (avion == null)
                    return NotFound();

                return Ok(ConvertirADto(avion));
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al obtener avión: {ex.Message}");
            }
        }

        // POST: api/aeropuerto/Aviones
        [HttpPost]
        public async Task<ActionResult<AvionDto>> CrearAvion(Avion avion)
        {
            try
            {
                _context.Aviones.Add(avion);
                await _context.SaveChangesAsync();
                var avionDto = ConvertirADto(avion);
                return CreatedAtAction(nameof(GetAvion), new { id = avion.AvionId }, avionDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al crear avión: {ex.Message}");
            }
        }

        // PUT: api/aeropuerto/Aviones/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> ActualizarAvion(int id, Avion avion)
        {
            if (id != avion.AvionId)
                return BadRequest("El ID no coincide");

            _context.Entry(avion).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Aviones.Any(a => a.AvionId == id))
                    return NotFound();
                throw;
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al actualizar avión: {ex.Message}");
            }
        }

        // DELETE: api/aeropuerto/Aviones/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> EliminarAvion(int id)
        {
            try
            {
                var avion = await _context.Aviones.FindAsync(id);
                if (avion == null)
                    return NotFound();

                _context.Aviones.Remove(avion);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al eliminar avión: {ex.Message}");
            }
        }
    }
}
