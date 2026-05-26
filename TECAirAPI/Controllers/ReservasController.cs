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
    public class ReservasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ReservasController(AppDbContext context)
        {
            _context = context;
        }

        private async Task<ReservaDto> ConvertirADto(Reserva reserva)
        {
            var usuario = await _context.Usuarios.FindAsync(reserva.UsuarioId);
            var vuelo = await _context.Vuelos.FindAsync(reserva.VueloId);

            var nombreUsuario = usuario == null
                ? "Usuario no encontrado"
                : $"{usuario.Nombre} {usuario.Apellido1}";

            var descripcionVuelo = vuelo == null
                ? "Vuelo no encontrado"
                : CodeGenerator.GenerateVueloDescripcion(vuelo.VueloId, vuelo.Salida, vuelo.Destino, vuelo.FechaSalida);

            return new ReservaDto
            {
                ReservaId = reserva.ReservaId,
                UsuarioId = reserva.UsuarioId,
                NombreUsuario = nombreUsuario,
                CodigoUsuario = CodeGenerator.GenerateUsuarioCode(reserva.UsuarioId),
                VueloId = reserva.VueloId,
                CodigoVuelo = CodeGenerator.GenerateVueloCode(reserva.VueloId),
                DescripcionVuelo = descripcionVuelo,
                FechaReserva = reserva.FechaReserva,
                AsientosReservados = reserva.AsientosReservados,
                EstadoPago = reserva.EstadoPago
            };
        }

        // GET: api/aeropuerto/Reservas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ReservaDto>>> GetReservas()
        {
            try
            {
                var reservas = await _context.Reservas.ToListAsync();
                var reservasDtos = new List<ReservaDto>();

                foreach (var reserva in reservas)
                {
                    var dto = await ConvertirADto(reserva);
                    reservasDtos.Add(dto);
                }

                return Ok(reservasDtos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al obtener reservas: {ex.Message}");
            }
        }

        // POST: api/aeropuerto/Reservas
        [HttpPost]
        public async Task<ActionResult<ReservaDto>> CrearReserva(Reserva reserva)
        {
            try
            {
                var usuarioExiste = await _context.Usuarios.AnyAsync(u => u.UsuarioId == reserva.UsuarioId);
                if (!usuarioExiste)
                    return BadRequest($"No existe el usuario con id {reserva.UsuarioId}");

                var vueloExiste = await _context.Vuelos.AnyAsync(v => v.VueloId == reserva.VueloId);
                if (!vueloExiste)
                    return BadRequest($"No existe el vuelo con id {reserva.VueloId}");

                _context.Reservas.Add(reserva);
                await _context.SaveChangesAsync();

                var reservaDto = await ConvertirADto(reserva);
                return CreatedAtAction(nameof(GetReservas), new { id = reserva.ReservaId }, reservaDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al crear reserva: {ex.Message}");
            }
        }

        // PUT: api/aeropuerto/Reservas/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> ActualizarReserva(int id, Reserva reserva)
        {
            if (id != reserva.ReservaId)
                return BadRequest("El ID de la URL no coincide con el ID de la reserva");

            try
            {
                var usuarioExiste = await _context.Usuarios.AnyAsync(u => u.UsuarioId == reserva.UsuarioId);
                if (!usuarioExiste)
                    return BadRequest($"No existe el usuario con id {reserva.UsuarioId}");

                var vueloExiste = await _context.Vuelos.AnyAsync(v => v.VueloId == reserva.VueloId);
                if (!vueloExiste)
                    return BadRequest($"No existe el vuelo con id {reserva.VueloId}");

                _context.Entry(reserva).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (DbUpdateConcurrencyException)
            {
                var existe = await _context.Reservas.AnyAsync(r => r.ReservaId == id);
                if (!existe)
                    return NotFound();
                throw;
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al actualizar reserva: {ex.Message}");
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
