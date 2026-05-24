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
        return await _context.Vuelos.ToListAsync();
    }

    // POST: api/aeropuerto/Vuelos
    [HttpPost]
    public async Task<ActionResult<Vuelo>> CrearVuelo(Vuelo vuelo)
    {
        _context.Vuelos.Add(vuelo);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetVuelos), new { id = vuelo.VueloId }, vuelo);
    }

    // DELETE: api/aeropuerto/Vuelos/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> EliminarVuelo(int id)
    {
        var vuelo = await _context.Vuelos.FindAsync(id);
        if (vuelo == null) return NotFound();

        _context.Vuelos.Remove(vuelo);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}