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
    public class MaletasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MaletasController(AppDbContext context)
        {
            _context = context;
        }

        private static decimal ObtenerCostoPorNumeroDeMaleta(int numeroMaletaDelPasajero)
        {
            if (numeroMaletaDelPasajero <= 1) return 0m;
            if (numeroMaletaDelPasajero == 2) return 50m;
            return 75m;
        }

        private async Task<bool> ReservaTieneCheckin(int reservaId)
        {
            return await _context.Checkins.AnyAsync(c => c.ReservaId == reservaId);
        }

        private async Task RecalcularCostosPorReserva(int reservaId)
        {
            var maletasReserva = await _context.Maletas
                .Where(m => m.ReservaId == reservaId)
                .OrderBy(m => m.MaletaId)
                .ToListAsync();

            for (int i = 0; i < maletasReserva.Count; i++)
            {
                var numeroMaletaDelPasajero = i + 1;
                maletasReserva[i].CostoAdicional = ObtenerCostoPorNumeroDeMaleta(numeroMaletaDelPasajero);
            }

            await _context.SaveChangesAsync();
        }

        private async Task<MaletaDto> ConvertirADto(Maleta maleta)
        {
            var reserva = await _context.Reservas.FindAsync(maleta.ReservaId);
            var usuario = reserva == null ? null : await _context.Usuarios.FindAsync(reserva.UsuarioId);
            var vuelo = reserva == null ? null : await _context.Vuelos.FindAsync(reserva.VueloId);

            var nombreUsuario = usuario == null ? "Usuario no encontrado" : $"{usuario.Nombre} {usuario.Apellido1}";
            var codigoVuelo = vuelo == null ? "Vuelo no encontrado" : CodeGenerator.GenerateVueloCode(vuelo.VueloId);
            var codigoReserva = $"RES-{maleta.ReservaId:D3}";
            var numeroMaleta = $"MAL-{maleta.MaletaId:D3}";
            var descripcionReserva = $"{codigoReserva} - {nombreUsuario} - {codigoVuelo}";

            var maletasDeLaReserva = await _context.Maletas
                .Where(m => m.ReservaId == maleta.ReservaId)
                .ToListAsync();

            return new MaletaDto
            {
                MaletaId = maleta.MaletaId,
                NumeroMaleta = numeroMaleta,
                ReservaId = maleta.ReservaId,
                CodigoReserva = codigoReserva,
                NombreDueno = nombreUsuario,
                DescripcionReserva = descripcionReserva,
                Peso = maleta.Peso,
                Color = maleta.Color,
                CostoAdicional = maleta.CostoAdicional,
                TotalMaletasReserva = maletasDeLaReserva.Count,
                TotalCostoReserva = maletasDeLaReserva.Sum(m => m.CostoAdicional)
            };
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MaletaDto>>> GetMaletas()
        {
            try
            {
                // Esto corrige también las maletas que ya existían antes de implementar
                // el cálculo automático. Así, al cargar la tabla, los costos quedan
                // consistentes con la regla: 0, 50, 75, 75, 75...
                var reservasConMaletas = await _context.Maletas
                    .Select(m => m.ReservaId)
                    .Distinct()
                    .ToListAsync();

                foreach (var reservaId in reservasConMaletas)
                {
                    await RecalcularCostosPorReserva(reservaId);
                }

                var maletas = await _context.Maletas
                    .OrderBy(m => m.ReservaId)
                    .ThenBy(m => m.MaletaId)
                    .ToListAsync();

                var maletasDtos = new List<MaletaDto>();

                foreach (var maleta in maletas)
                {
                    var dto = await ConvertirADto(maleta);
                    maletasDtos.Add(dto);
                }

                return Ok(maletasDtos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al obtener maletas: {ex.Message}");
            }
        }

        [HttpGet("reservas-chequeadas")]
        public async Task<ActionResult<IEnumerable<ReservaDto>>> GetReservasChequeadas()
        {
            try
            {
                var checkins = await _context.Checkins
                    .OrderByDescending(c => c.FechaCheckin)
                    .ToListAsync();

                var resultado = new List<ReservaDto>();

                foreach (var checkin in checkins)
                {
                    var reserva = await _context.Reservas.FindAsync(checkin.ReservaId);
                    if (reserva == null) continue;

                    var usuario = await _context.Usuarios.FindAsync(reserva.UsuarioId);
                    var vuelo = await _context.Vuelos.FindAsync(reserva.VueloId);

                    if (usuario == null || vuelo == null) continue;

                    var nombreUsuario = $"{usuario.Nombre} {usuario.Apellido1} {usuario.Apellido2}".Trim();
                    var codigoUsuario = CodeGenerator.GenerateUsuarioCode(usuario.UsuarioId);
                    var codigoVuelo = CodeGenerator.GenerateVueloCode(vuelo.VueloId);
                    var descripcionVuelo = CodeGenerator.GenerateVueloDescripcion(vuelo.VueloId, vuelo.Salida, vuelo.Destino, vuelo.FechaSalida);

                    resultado.Add(new ReservaDto
                    {
                        ReservaId = reserva.ReservaId,
                        UsuarioId = reserva.UsuarioId,
                        NombreUsuario = nombreUsuario,
                        CodigoUsuario = codigoUsuario,
                        VueloId = reserva.VueloId,
                        CodigoVuelo = codigoVuelo,
                        DescripcionVuelo = descripcionVuelo,
                        FechaReserva = reserva.FechaReserva,
                        AsientosReservados = reserva.AsientosReservados,
                        EstadoPago = reserva.EstadoPago
                    });
                }

                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al obtener reservas chequeadas: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<ActionResult<MaletaDto>> CrearMaleta(Maleta maleta)
        {
            try
            {
                var reservaExiste = await _context.Reservas.AnyAsync(r => r.ReservaId == maleta.ReservaId);
                if (!reservaExiste)
                    return BadRequest($"No existe la reserva con id {maleta.ReservaId}");

                var tieneCheckin = await ReservaTieneCheckin(maleta.ReservaId);
                if (!tieneCheckin)
                    return BadRequest("Solo se pueden asignar maletas a pasajeros que ya tienen check-in.");

                // El costo no se escribe desde la interfaz; se calcula según la cantidad de maletas del pasajero/reserva.
                maleta.CostoAdicional = 0m;

                _context.Maletas.Add(maleta);
                await _context.SaveChangesAsync();

                await RecalcularCostosPorReserva(maleta.ReservaId);

                var maletaActualizada = await _context.Maletas.FindAsync(maleta.MaletaId);
                if (maletaActualizada == null)
                    return NotFound();

                var maletaDto = await ConvertirADto(maletaActualizada);
                return CreatedAtAction(nameof(GetMaletas), new { id = maleta.MaletaId }, maletaDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al crear maleta: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> ActualizarMaleta(int id, Maleta maleta)
        {
            if (id != maleta.MaletaId)
                return BadRequest("El ID de la URL no coincide con el ID de la maleta");

            try
            {
                var maletaExistente = await _context.Maletas.AsNoTracking().FirstOrDefaultAsync(m => m.MaletaId == id);
                if (maletaExistente == null)
                    return NotFound();

                var reservaExiste = await _context.Reservas.AnyAsync(r => r.ReservaId == maleta.ReservaId);
                if (!reservaExiste)
                    return BadRequest($"No existe la reserva con id {maleta.ReservaId}");

                var tieneCheckin = await ReservaTieneCheckin(maleta.ReservaId);
                if (!tieneCheckin)
                    return BadRequest("Solo se pueden asignar maletas a pasajeros que ya tienen check-in.");

                // El costo se recalcula automáticamente. No se confía en el valor que venga del frontend.
                maleta.CostoAdicional = maletaExistente.CostoAdicional;

                _context.Entry(maleta).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                await RecalcularCostosPorReserva(maleta.ReservaId);

                if (maletaExistente.ReservaId != maleta.ReservaId)
                {
                    await RecalcularCostosPorReserva(maletaExistente.ReservaId);
                }

                return NoContent();
            }
            catch (DbUpdateConcurrencyException)
            {
                var existe = await _context.Maletas.AnyAsync(m => m.MaletaId == id);
                if (!existe)
                    return NotFound();
                throw;
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al actualizar maleta: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> EliminarMaleta(int id)
        {
            try
            {
                var maleta = await _context.Maletas.FindAsync(id);
                if (maleta == null) return NotFound();

                var reservaId = maleta.ReservaId;

                _context.Maletas.Remove(maleta);
                await _context.SaveChangesAsync();

                await RecalcularCostosPorReserva(reservaId);

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al eliminar maleta: {ex.Message}");
            }
        }
    }
}
