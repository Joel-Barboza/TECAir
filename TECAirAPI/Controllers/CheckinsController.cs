using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TECAirAPI.Data;
using TECAirAPI.DTOs;
using TECAirAPI.Helpers;
using TECAirAPI.Models;

namespace TECAirAPI.Controllers
{
    [Route("api/aeropuerto/[controller]")]
    [ApiController]
    public class CheckinsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CheckinsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/aeropuerto/Checkins
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CheckinDto>>> GetCheckins()
        {
            try
            {
                var checkins = await _context.Checkins
                    .OrderByDescending(c => c.FechaCheckin)
                    .ToListAsync();

                var resultado = new List<CheckinDto>();

                foreach (var checkin in checkins)
                {
                    var dto = await ConvertirADto(checkin);
                    if (dto != null)
                    {
                        resultado.Add(dto);
                    }
                }

                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al obtener check-ins: {ex.Message}");
            }
        }

        // POST: api/aeropuerto/Checkins
        [HttpPost]
        public async Task<ActionResult<CheckinDto>> CrearCheckin(CrearCheckinDto dto)
        {
            if (dto.ReservaId <= 0)
                return BadRequest("Debe seleccionar una reserva.");

            if (string.IsNullOrWhiteSpace(dto.NumAsiento))
                return BadRequest("Debe seleccionar o escribir un asiento.");

            if (string.IsNullOrWhiteSpace(dto.Tipo))
                return BadRequest("Debe indicar el tipo de asiento.");

            var metodosValidos = new[] { "Correo", "Impresora", "Movil" };
            if (!string.IsNullOrWhiteSpace(dto.MetodoEnvio) && !metodosValidos.Contains(dto.MetodoEnvio))
                return BadRequest("El método de envío debe ser Correo, Impresora o Movil.");

            await using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var reserva = await _context.Reservas.FindAsync(dto.ReservaId);
                if (reserva == null)
                    return BadRequest($"No existe la reserva con id {dto.ReservaId}");

                var vuelo = await _context.Vuelos.FindAsync(reserva.VueloId);
                if (vuelo == null)
                    return BadRequest($"No existe el vuelo asociado a la reserva {dto.ReservaId}");

                if (string.IsNullOrWhiteSpace(vuelo.PuertaAbordaje))
                    return BadRequest("El vuelo seleccionado no tiene puerta de abordaje asignada. Primero edite el vuelo y agregue la puerta.");

                var yaTieneCheckin = await _context.Checkins.AnyAsync(c => c.ReservaId == dto.ReservaId);
                if (yaTieneCheckin)
                    return BadRequest("Esta reserva ya tiene check-in realizado.");

                var yaTieneAsiento = await _context.Asientos.AnyAsync(a => a.ReservaId == dto.ReservaId);
                if (yaTieneAsiento)
                    return BadRequest("Esta reserva ya tiene un asiento asignado.");

                var asientoNormalizado = dto.NumAsiento.Trim().ToUpper();

                var reservasDelMismoVuelo = _context.Reservas
                    .Where(r => r.VueloId == reserva.VueloId)
                    .Select(r => r.ReservaId);

                var asientoOcupado = await _context.Asientos.AnyAsync(a =>
                    reservasDelMismoVuelo.Contains(a.ReservaId) &&
                    a.NumAsiento.ToUpper() == asientoNormalizado);

                if (asientoOcupado)
                    return BadRequest($"El asiento {asientoNormalizado} ya está ocupado para este vuelo.");

                var asiento = new Asiento
                {
                    ReservaId = dto.ReservaId,
                    NumAsiento = asientoNormalizado,
                    Tipo = dto.Tipo.Trim()
                };

                _context.Asientos.Add(asiento);
                await _context.SaveChangesAsync();

                var checkin = new Checkin
                {
                    ReservaId = dto.ReservaId,
                    AsientoId = asiento.AsientoId,
                    FechaCheckin = DateTime.UtcNow,
                    MetodoEnvio = string.IsNullOrWhiteSpace(dto.MetodoEnvio) ? null : dto.MetodoEnvio,
                    EstadoEnvio = string.IsNullOrWhiteSpace(dto.MetodoEnvio)
                        ? "Generado"
                        : $"Listo {dto.MetodoEnvio}"
                };

                _context.Checkins.Add(checkin);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                var checkinDto = await ConvertirADto(checkin);
                if (checkinDto == null)
                    return StatusCode(500, "El check-in fue creado, pero no se pudo generar el DTO de respuesta.");

                return CreatedAtAction(nameof(GetCheckins), new { id = checkin.CheckinId }, checkinDto);
            }
            catch (DbUpdateException ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, $"Error al guardar el check-in. Revise que no exista un asiento o check-in duplicado. Detalle: {ex.Message}");
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, $"Error al crear check-in: {ex.Message}");
            }
        }

        // DELETE: api/aeropuerto/Checkins/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> EliminarCheckin(int id)
        {
            await using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var checkin = await _context.Checkins.FindAsync(id);
                if (checkin == null)
                    return NotFound($"No se encontró el check-in con id {id}");

                var asiento = await _context.Asientos.FindAsync(checkin.AsientoId);

                _context.Checkins.Remove(checkin);
                await _context.SaveChangesAsync();

                if (asiento != null)
                {
                    _context.Asientos.Remove(asiento);
                    await _context.SaveChangesAsync();
                }

                await transaction.CommitAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, $"Error al eliminar check-in: {ex.Message}");
            }
        }

        private async Task<CheckinDto?> ConvertirADto(Checkin checkin)
        {
            var reserva = await _context.Reservas.FindAsync(checkin.ReservaId);
            if (reserva == null) return null;

            var usuario = await _context.Usuarios.FindAsync(reserva.UsuarioId);
            var vuelo = await _context.Vuelos.FindAsync(reserva.VueloId);
            var asiento = await _context.Asientos.FindAsync(checkin.AsientoId);

            if (usuario == null || vuelo == null || asiento == null) return null;

            var nombrePasajero = $"{usuario.Nombre} {usuario.Apellido1} {usuario.Apellido2}".Trim();
            var codigoReserva = $"RES-{reserva.ReservaId.ToString().PadLeft(3, '0')}";
            var codigoVuelo = CodeGenerator.GenerateVueloCode(vuelo.VueloId);
            var codigoUsuario = CodeGenerator.GenerateUsuarioCode(usuario.UsuarioId);
            var ruta = CodeGenerator.GenerateRutaDescripcion(vuelo.Salida, vuelo.Destino);

            return new CheckinDto
            {
                CheckinId = checkin.CheckinId,
                ReservaId = reserva.ReservaId,
                CodigoReserva = codigoReserva,
                UsuarioId = usuario.UsuarioId,
                CodigoUsuario = codigoUsuario,
                NombrePasajero = nombrePasajero,
                VueloId = vuelo.VueloId,
                CodigoVuelo = codigoVuelo,
                NumeroVuelo = codigoVuelo,
                Origen = vuelo.Salida,
                Destino = vuelo.Destino,
                HoraSalida = vuelo.FechaSalida,
                PuertaAbordaje = vuelo.PuertaAbordaje ?? "Sin asignar",
                AsientoId = asiento.AsientoId,
                NumAsiento = asiento.NumAsiento,
                TipoAsiento = asiento.Tipo,
                FechaCheckin = checkin.FechaCheckin,
                MetodoEnvio = checkin.MetodoEnvio,
                EstadoEnvio = checkin.EstadoEnvio,
                DescripcionReserva = $"{codigoReserva} - {nombrePasajero} - {codigoVuelo}",
                DescripcionPase = $"{codigoVuelo} - {ruta} - Asiento {asiento.NumAsiento} - Puerta {vuelo.PuertaAbordaje ?? "Sin asignar"}"
            };
        }
    }
}
