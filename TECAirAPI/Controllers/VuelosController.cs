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
    public class VuelosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public VuelosController(AppDbContext context)
        {
            _context = context;
        }

        private VueloDto ConvertirADto(Vuelo vuelo, Aeropuerto aeropuerto, Avion avion)
        {
            return new VueloDto
            {
                VueloId = vuelo.VueloId,
                CodigoVisible = CodeGenerator.GenerateVueloCode(vuelo.VueloId),
                AeropuertoId = vuelo.AeropuertoId,
                NombreAeropuerto = aeropuerto?.Nombre ?? "Aeropuerto no encontrado",
                UbicacionAeropuerto = aeropuerto?.Ubicacion ?? "",
                AvionId = vuelo.AvionId,
                ModeloAvion = avion?.Modelo ?? "Avión no encontrado",
                CapacidadAvion = avion?.Capacidad ?? 0,
                Asientos = vuelo.Asientos,
                Origen = vuelo.Salida,
                Destino = vuelo.Destino,
                RutaDescripcion = CodeGenerator.GenerateRutaDescripcion(vuelo.Salida, vuelo.Destino),
                FechaSalida = vuelo.FechaSalida,
                FechaLlegada = vuelo.FechaLlegada,
                PuertaAbordaje = vuelo.PuertaAbordaje,
                DescripcionCompleta = CodeGenerator.GenerateVueloDescripcion(vuelo.VueloId, vuelo.Salida, vuelo.Destino, vuelo.FechaSalida)
            };
        }

        // GET: api/aeropuerto/Vuelos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<VueloDto>>> GetVuelos()
        {
            try
            {
                var vuelos = await _context.Vuelos.ToListAsync();
                var aeropuertos = await _context.Aeropuertos.ToDictionaryAsync(a => a.AeropuertoId);
                var aviones = await _context.Aviones.ToDictionaryAsync(a => a.AvionId);

                var vuelosDtos = vuelos.Select(v =>
                {
                    aeropuertos.TryGetValue(v.AeropuertoId, out var aeropuerto);
                    aviones.TryGetValue(v.AvionId, out var avion);
                    return ConvertirADto(v, aeropuerto, avion);
                }).ToList();

                return Ok(vuelosDtos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al obtener vuelos: {ex.Message}");
            }
        }

        // POST: api/aeropuerto/Vuelos
        [HttpPost]
        public async Task<ActionResult<VueloDto>> CrearVuelo(Vuelo vuelo)
        {
            try
            {
                var aeropuerto = await _context.Aeropuertos.FindAsync(vuelo.AeropuertoId);
                if (aeropuerto == null)
                    return BadRequest($"No existe el aeropuerto con id {vuelo.AeropuertoId}");

                vuelo.Salida = aeropuerto.Ubicacion;

                var avionExiste = await _context.Aviones.AnyAsync(a => a.AvionId == vuelo.AvionId);
                if (!avionExiste)
                    return BadRequest($"No existe el avión con id {vuelo.AvionId}");

                vuelo.PuertaAbordaje = string.IsNullOrWhiteSpace(vuelo.PuertaAbordaje)
                    ? null
                    : vuelo.PuertaAbordaje.Trim().ToUpper();

                _context.Vuelos.Add(vuelo);
                await _context.SaveChangesAsync();

                var avion = await _context.Aviones.FindAsync(vuelo.AvionId);

                var vueloDto = ConvertirADto(vuelo, aeropuerto!, avion!);
                return CreatedAtAction(nameof(GetVuelos), new { id = vuelo.VueloId }, vueloDto);
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
                return BadRequest("El ID de la URL no coincide con el ID del vuelo");

            try
            {
                var aeropuerto = await _context.Aeropuertos.FindAsync(vuelo.AeropuertoId);
                if (aeropuerto == null)
                    return BadRequest($"No existe el aeropuerto con id {vuelo.AeropuertoId}");

                vuelo.Salida = aeropuerto.Ubicacion;

                var avionExiste = await _context.Aviones.AnyAsync(a => a.AvionId == vuelo.AvionId);
                if (!avionExiste)
                    return BadRequest($"No existe el avión con id {vuelo.AvionId}");

                var vueloExistente = await _context.Vuelos.FindAsync(id);
                if (vueloExistente == null)
                    return NotFound($"No se encontró el vuelo con id {id}");

                // Se actualiza campo por campo para asegurar que puerta_abordaje sí se guarde
                // y para evitar problemas con entidades desconectadas del frontend.
                vueloExistente.AeropuertoId = vuelo.AeropuertoId;
                vueloExistente.AvionId = vuelo.AvionId;
                vueloExistente.Asientos = vuelo.Asientos;
                vueloExistente.Salida = aeropuerto.Ubicacion;
                vueloExistente.Destino = vuelo.Destino;
                vueloExistente.FechaSalida = vuelo.FechaSalida;
                vueloExistente.FechaLlegada = vuelo.FechaLlegada;
                vueloExistente.PuertaAbordaje = string.IsNullOrWhiteSpace(vuelo.PuertaAbordaje)
                    ? null
                    : vuelo.PuertaAbordaje.Trim().ToUpper();

                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (DbUpdateConcurrencyException)
            {
                var existe = await _context.Vuelos.AnyAsync(v => v.VueloId == id);
                if (!existe)
                    return NotFound();
                throw;
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al actualizar vuelo: {ex.Message}");
            }
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
