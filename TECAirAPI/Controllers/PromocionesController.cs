using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TECAirAPI.Data;
using TECAirAPI.Models;

namespace TECAirAPI.Controllers
{
    [Route("api/aeropuerto/[controller]")]
    [ApiController]
    public class PromocionesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PromocionesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/aeropuerto/Promociones
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Promocion>>> GetPromociones()
        {
            try
            {
                return await _context.Promociones.ToListAsync();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al obtener promociones: {ex.Message}");
            }
        }

        // POST: api/aeropuerto/Promociones
        [HttpPost]
        public async Task<ActionResult<Promocion>> CrearPromocion(Promocion promo)
        {
            try
            {
                _context.Promociones.Add(promo);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetPromociones), new { id = promo.PromocionId }, promo);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al crear promoción: {ex.Message}");
            }
        }

        // DELETE: api/aeropuerto/Promociones/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> EliminarPromocion(int id)
        {
            try
            {
                var promo = await _context.Promociones.FindAsync(id);
                if (promo == null) return NotFound();

                _context.Promociones.Remove(promo);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al eliminar promoción: {ex.Message}");
            }
        }
    }
}