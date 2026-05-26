using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TECAirAPI.Data;
using TECAirAPI.Models;
using TECAirAPI.DTOs;
using TECAirAPI.Helpers;

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

        private async Task<PromocionDto> ConvertirADto(Promocion promo)
        {
            var vuelo = await _context.Vuelos.FindAsync(promo.VueloId);

            return new PromocionDto
            {
                PromocionId = promo.PromocionId,
                VueloId = promo.VueloId,
                CodigoVuelo = CodeGenerator.GenerateVueloCode(promo.VueloId),
                DescripcionVuelo = vuelo == null
                    ? "Vuelo no encontrado"
                    : CodeGenerator.GenerateVueloDescripcion(vuelo.VueloId, vuelo.Salida, vuelo.Destino, vuelo.FechaSalida),
                Origen = promo.Origen,
                Destino = promo.Destino,
                Descuento = promo.Descuento,
                FechaInicio = promo.FechaInicio,
                FechaFin = promo.FechaFin
            };
        }

        // GET: api/aeropuerto/Promociones
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PromocionDto>>> GetPromociones()
        {
            try
            {
                var promociones = await _context.Promociones.ToListAsync();
                var promocionesDtos = new List<PromocionDto>();

                foreach (var promo in promociones)
                {
                    var dto = await ConvertirADto(promo);
                    promocionesDtos.Add(dto);
                }

                return Ok(promocionesDtos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al obtener promociones: {ex.Message}");
            }
        }

        // POST: api/aeropuerto/Promociones
        [HttpPost]
        public async Task<ActionResult<PromocionDto>> CrearPromocion(Promocion promo)
        {
            try
            {
                var vuelo = await _context.Vuelos.FindAsync(promo.VueloId);
                if (vuelo == null)
                    return BadRequest($"No existe el vuelo con id {promo.VueloId}");

                promo.Origen = vuelo.Salida;
                promo.Destino = vuelo.Destino;

                _context.Promociones.Add(promo);
                await _context.SaveChangesAsync();

                var promoDto = await ConvertirADto(promo);
                return CreatedAtAction(nameof(GetPromociones), new { id = promo.PromocionId }, promoDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al crear promoción: {ex.Message}");
            }
        }

        // PUT: api/aeropuerto/Promociones/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> ActualizarPromocion(int id, Promocion promo)
        {
            if (id != promo.PromocionId)
                return BadRequest("El ID de la URL no coincide con el ID de la promoción");

            try
            {
                var vuelo = await _context.Vuelos.FindAsync(promo.VueloId);
                if (vuelo == null)
                    return BadRequest($"No existe el vuelo con id {promo.VueloId}");

                promo.Origen = vuelo.Salida;
                promo.Destino = vuelo.Destino;

                _context.Entry(promo).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (DbUpdateConcurrencyException)
            {
                var existe = await _context.Promociones.AnyAsync(p => p.PromocionId == id);
                if (!existe)
                    return NotFound();
                throw;
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al actualizar promoción: {ex.Message}");
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
