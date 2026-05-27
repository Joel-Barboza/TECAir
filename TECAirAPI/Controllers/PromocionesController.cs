using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TECAirAPI.Data;
using TECAirAPI.Models;
using TECAirAPI.DTOs;
using TECAirAPI.Helpers;

namespace TECAirAPI.Controllers
{
    [Route("api/aeropuerto/Promociones")]
    [ApiController]
    public class PromocionesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PromocionesController(AppDbContext context)
        {
            _context = context;
        }

        private static PromocionDto ConvertirADto(Promocion promo, Vuelo? vuelo)
        {
            decimal precioBoleto = vuelo?.PrecioBoleto ?? 0m;
            decimal montoDescuento = Math.Round(precioBoleto * (promo.Descuento / 100m), 2);
            decimal precioFinal = Math.Round(precioBoleto - montoDescuento, 2);

            string origen = vuelo?.Salida ?? promo.Origen ?? "Origen no disponible";
            string destino = vuelo?.Destino ?? promo.Destino ?? "Destino no disponible";

            return new PromocionDto
            {
                PromocionId = promo.PromocionId,
                VueloId = promo.VueloId,
                CodigoVuelo = CodeGenerator.GenerateVueloCode(promo.VueloId),
                DescripcionVuelo = vuelo == null
                    ? $"{CodeGenerator.GenerateVueloCode(promo.VueloId)} - Vuelo no encontrado"
                    : CodeGenerator.GenerateVueloDescripcion(vuelo.VueloId, vuelo.Salida, vuelo.Destino, vuelo.FechaSalida),
                Origen = origen,
                Destino = destino,
                PrecioBoleto = precioBoleto,
                Descuento = promo.Descuento,
                MontoDescuento = montoDescuento,
                PrecioFinal = precioFinal,
                FechaInicio = promo.FechaInicio,
                FechaFin = promo.FechaFin
            };
        }

        // GET: api/aeropuerto/Promociones
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PromocionDto>>> GetPromociones()
        {
            var promociones = await _context.Promociones
                .AsNoTracking()
                .OrderBy(p => p.PromocionId)
                .ToListAsync();

            var vuelos = await _context.Vuelos
                .AsNoTracking()
                .ToDictionaryAsync(v => v.VueloId);

            var promocionesDtos = promociones.Select(p =>
            {
                vuelos.TryGetValue(p.VueloId, out var vuelo);
                return ConvertirADto(p, vuelo);
            }).ToList();

            return Ok(promocionesDtos);
        }

        // GET: api/aeropuerto/Promociones/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<PromocionDto>> GetPromocion(int id)
        {
            var promo = await _context.Promociones.AsNoTracking().FirstOrDefaultAsync(p => p.PromocionId == id);
            if (promo == null)
                return NotFound();

            var vuelo = await _context.Vuelos.AsNoTracking().FirstOrDefaultAsync(v => v.VueloId == promo.VueloId);
            return Ok(ConvertirADto(promo, vuelo));
        }

        // POST: api/aeropuerto/Promociones
        [HttpPost]
        public async Task<ActionResult<PromocionDto>> CrearPromocion([FromBody] Promocion promo)
        {
            var vuelo = await _context.Vuelos.FirstOrDefaultAsync(v => v.VueloId == promo.VueloId);
            if (vuelo == null)
                return BadRequest($"No existe el vuelo con id {promo.VueloId}.");

            if (promo.Descuento <= 0 || promo.Descuento > 100)
                return BadRequest("El descuento debe ser mayor que 0 y menor o igual a 100.");

            if (promo.FechaFin.Date < promo.FechaInicio.Date)
                return BadRequest("La fecha final no puede ser anterior a la fecha inicial.");

            promo.Origen = vuelo.Salida;
            promo.Destino = vuelo.Destino;
            promo.FechaInicio = promo.FechaInicio.Date;
            promo.FechaFin = promo.FechaFin.Date;

            _context.Promociones.Add(promo);
            await _context.SaveChangesAsync();

            var promoDto = ConvertirADto(promo, vuelo);
            return CreatedAtAction(nameof(GetPromocion), new { id = promo.PromocionId }, promoDto);
        }

        // PUT: api/aeropuerto/Promociones/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> ActualizarPromocion(int id, [FromBody] Promocion promo)
        {
            if (id != promo.PromocionId)
                return BadRequest("El ID de la URL no coincide con el ID de la promoción.");

            var existente = await _context.Promociones.FirstOrDefaultAsync(p => p.PromocionId == id);
            if (existente == null)
                return NotFound();

            var vuelo = await _context.Vuelos.FirstOrDefaultAsync(v => v.VueloId == promo.VueloId);
            if (vuelo == null)
                return BadRequest($"No existe el vuelo con id {promo.VueloId}.");

            if (promo.Descuento <= 0 || promo.Descuento > 100)
                return BadRequest("El descuento debe ser mayor que 0 y menor o igual a 100.");

            if (promo.FechaFin.Date < promo.FechaInicio.Date)
                return BadRequest("La fecha final no puede ser anterior a la fecha inicial.");

            existente.VueloId = promo.VueloId;
            existente.Origen = vuelo.Salida;
            existente.Destino = vuelo.Destino;
            existente.Descuento = promo.Descuento;
            existente.FechaInicio = promo.FechaInicio.Date;
            existente.FechaFin = promo.FechaFin.Date;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/aeropuerto/Promociones/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> EliminarPromocion(int id)
        {
            var promo = await _context.Promociones.FindAsync(id);
            if (promo == null)
                return NotFound();

            _context.Promociones.Remove(promo);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
