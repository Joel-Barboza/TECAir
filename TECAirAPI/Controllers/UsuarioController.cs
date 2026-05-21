using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TECAirAPI.Data;
using TECAirAPI.Models;

namespace TECAirAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsuarioController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsuarioController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Usuario>>> GetUsuarios()
        {
            return await _context.usuario.ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Usuario>> CrearUsuario(Usuario usuario)
        {
            _context.usuario.Add(usuario);

            await _context.SaveChangesAsync();

            return Ok(usuario);
        }
    }
}