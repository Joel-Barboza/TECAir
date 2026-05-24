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

        // GET: api/aeropuerto/Maletas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Maleta>>> GetMaletas()
        {
            return await _context.Maletas.ToListAsync();
        }

        // POST: api/aeropuerto/Maletas
        [HttpPost]
        public async Task<ActionResult<Maleta>> CrearMaleta(Maleta maleta)
        {
            _context.Maletas.Add(maleta);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetMaletas), new { id = maleta.MaletaId }, maleta);
        }

        // DELETE: api/aeropuerto/Maletas/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> EliminarMaleta(int id)
        {
            var maleta = await _context.Maletas.FindAsync(id);
            if (maleta == null) return NotFound();

            _context.Maletas.Remove(maleta);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}