using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TECAirAPI.Data;
using TECAirAPI.Models;

namespace TECAirAPI.Controllers
{
    [Route("api/aeropuerto/[controller]")]
    [ApiController]
    public class ReservasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ReservasController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/aeropuerto/Reservas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Reserva>>> GetReservas()
        {
            try
            {
                return await _context.Reservas.ToListAsync();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al obtener reservas: {ex.Message}");
            }
        }

        // POST: api/aeropuerto/Reservas
        [HttpPost]
        public async Task<ActionResult<Reserva>> CrearReserva(Reserva reserva)
        {
            try
            {
                _context.Reservas.Add(reserva);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetReservas), new { id = reserva.ReservaId }, reserva);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al crear reserva: {ex.Message}");
            }
        }

        // DELETE: api/aeropuerto/Reservas/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> EliminarReserva(int id)
        {
            try
            {
                var reserva = await _context.Reservas.FindAsync(id);
                if (reserva == null) return NotFound();

                _context.Reservas.Remove(reserva);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al eliminar reserva: {ex.Message}");
            }
        }
    }
}