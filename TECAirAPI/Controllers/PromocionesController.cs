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
            return await _context.Promociones.ToListAsync();
        }

        // POST: api/aeropuerto/Promociones
        [HttpPost]
        public async Task<ActionResult<Promocion>> CrearPromocion(Promocion promo)
        {
            _context.Promociones.Add(promo);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetPromociones), new { id = promo.PromocionId }, promo);
        }

        // DELETE: api/aeropuerto/Promociones/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> EliminarPromocion(int id)
        {
            var promo = await _context.Promociones.FindAsync(id);
            if (promo == null) return NotFound();

            _context.Promociones.Remove(promo);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}