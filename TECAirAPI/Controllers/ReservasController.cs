using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TECAirAPI.Data;
using TECAirAPI.Models;

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

        // GET: api/aeropuerto/Reservas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Reserva>>> GetReservas()
        {
            try
            {
                return await _context.Reservas.ToListAsync();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al obtener reservas: {ex.Message}");
            }
        }

        [HttpGet("buscar-usuario/{email}")]
        public async Task<ActionResult> BuscarReservasPorUsuario(string email)
        {
            try
            {
                var reservas = await (
                    from r in _context.Reservas
                    join u in _context.Usuarios
                        on r.UsuarioId equals u.UsuarioId
                    join v in _context.Vuelos
                        on r.VueloId equals v.VueloId
                    where u.Email == email
                    select new
                    {
                        reservaId = r.ReservaId,
                        asientosReservados = r.AsientosReservados,
                        estadoPago = r.EstadoPago,

                        usuario = u.Nombre + " " + u.Apellido1,

                        vuelo = new
                        {
                            vueloId = v.VueloId,
                            salida = v.Salida,
                            destino = v.Destino,
                            fechaSalida = v.FechaSalida,
                            fechaLlegada = v.FechaLlegada
                        }
                    }
                ).ToListAsync();

                return Ok(reservas);
            }
            catch (Exception ex)
            {
                return StatusCode(
                    500,
                    $"Error al buscar reservas: {ex.Message}"
                );
            }
        }


        [HttpGet("asientos-ocupados/{vueloId}")]
        public async Task<ActionResult> GetAsientosOcupados(int vueloId)
        {
            try
            {
                var asientos = await (
                    from a in _context.Asientos
                    join r in _context.Reservas
                        on a.ReservaId equals r.ReservaId
                    where r.VueloId == vueloId
                    select a.NumAsiento
                ).ToListAsync();

                return Ok(asientos);
            }
            catch (Exception ex)
            {
                return StatusCode(
                    500,
                    $"Error al obtener asientos: {ex.Message}"
                );
            }
        }

        // POST: api/aeropuerto/Reservas
        [HttpPost]
        public async Task<ActionResult<Reserva>> CrearReserva(Reserva reserva)
        {
            try
            {
                _context.Reservas.Add(reserva);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetReservas), new { id = reserva.ReservaId }, reserva);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al crear reserva: {ex.Message}");
            }
        }


        [HttpPost("checkin")]
        public async Task<ActionResult> RealizarCheckin([FromBody] CheckinRequest request)
        {
            try
            {
                var reserva = await _context.Reservas
                    .FirstOrDefaultAsync(r =>
                        r.ReservaId == request.ReservaId);

                if (reserva == null)
                    return NotFound("Reserva no encontrada.");

                var checkinExistente = await _context.Asientos
                    .AnyAsync(a =>
                        a.ReservaId == reserva.ReservaId);

                if (checkinExistente)
                {
                    return BadRequest(
                        "El check-in ya fue realizado."
                    );
                }

                if (
                    request.Asientos.Count !=
                    reserva.AsientosReservados
                )
                {
                    return BadRequest(
                        "Cantidad de asientos inválida."
                    );
                }

                foreach (var asiento in request.Asientos)
                {
                    var ocupado = await (
                        from a in _context.Asientos
                        join r in _context.Reservas
                            on a.ReservaId equals r.ReservaId
                        where r.VueloId == reserva.VueloId
                            && a.NumAsiento == asiento
                        select a
                    ).AnyAsync();

                    if (ocupado)
                    {
                        return BadRequest(
                            $"El asiento {asiento} ya está ocupado."
                        );
                    }

                    _context.Asientos.Add(new Asiento
                    {
                        ReservaId = reserva.ReservaId,
                        NumAsiento = asiento,
                        Tipo = "Económico"
                    });

                    _context.Boletos.Add(new Boleto
                    {
                        ReservaId = reserva.ReservaId,
                        Precio = 0,
                        Asiento = asiento,
                        Fecha = DateTime.UtcNow,
                        EstadoPago = reserva.EstadoPago
                    });
                }

                await _context.SaveChangesAsync();

                var puerta = "B" + Random.Shared.Next(1, 20);

                return Ok(new
                {
                    mensaje = "Check-in realizado correctamente.",
                    puertaAbordaje = puerta
                });
            }
            catch (Exception ex)
            {
                return StatusCode(
                    500,
                    $"Error al realizar check-in: {ex.Message}"
                );
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