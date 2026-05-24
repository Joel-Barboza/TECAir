using TECAirAPI.Data;
using TECAirAPI.Models;

namespace TECAirAPI.Repositories;

public class UsuarioRepository
{
    private readonly AppDbContext _context;

    public UsuarioRepository(AppDbContext context)
    {
        _context = context;
    }

    //public async Task<List<Usuario>> GetAll()
    //{
    //    return await _context.usuario.ToListAsync();
    //}
}