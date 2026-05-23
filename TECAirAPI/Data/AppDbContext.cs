using Microsoft.EntityFrameworkCore;
using TECAirAPI.Models;

namespace TECAirAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Vuelo> Vuelos { get; set; }
        public DbSet<Avion> Aviones { get; set; }
        public DbSet<Asiento> Asientos { get; set; }
        public DbSet<Reserva> Reservas { get; set; }
        public DbSet<Boleto> Boletos { get; set; }
        public DbSet<Maleta> Maletas { get; set; }
        public DbSet<Promocion> Promociones { get; set; }
        public DbSet<Aeropuerto> Aeropuertos { get; set; }
        public DbSet<Factura> Facturas { get; set; }
    }
}