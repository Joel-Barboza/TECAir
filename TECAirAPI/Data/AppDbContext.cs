using Microsoft.EntityFrameworkCore;
using TECAirAPI.Models;

namespace TECAirAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Aeropuerto> Aeropuertos { get; set; }
        public DbSet<Avion> Aviones { get; set; }
        public DbSet<Vuelo> Vuelos { get; set; }
        public DbSet<Reserva> Reservas { get; set; }
        public DbSet<Boleto> Boletos { get; set; }
        public DbSet<Factura> Facturas { get; set; }
        public DbSet<Maleta> Maletas { get; set; }
        public DbSet<Asiento> Asientos { get; set; }
        public DbSet<Promocion> Promociones { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configuración opcional: mapear nombres de columnas exactos
            modelBuilder.Entity<Usuario>().ToTable("usuario")
                .HasKey(u => u.UsuarioId);
            modelBuilder.Entity<Aeropuerto>().ToTable("aeropuerto")
                .HasKey(a => a.AeropuertoId);
            modelBuilder.Entity<Avion>().ToTable("avion")
                .HasKey(a => a.AvionId);
            modelBuilder.Entity<Vuelo>().ToTable("vuelo")
                .HasKey(v => v.VueloId);
            modelBuilder.Entity<Reserva>().ToTable("reserva")
                .HasKey(r => r.ReservaId);
            modelBuilder.Entity<Boleto>().ToTable("boleto")
                .HasKey(b => b.BoletoId);
            modelBuilder.Entity<Factura>().ToTable("factura")
                .HasKey(f => f.FacturaId);
            modelBuilder.Entity<Maleta>().ToTable("maleta")
                .HasKey(m => m.MaletaId);
            modelBuilder.Entity<Asiento>().ToTable("asiento")
                .HasKey(a => a.AsientoId);
            modelBuilder.Entity<Promocion>().ToTable("promocion")
                .HasKey(p => p.PromocionId);

            // Opcional: configurar nombres de columnas si difieren de las propiedades
            modelBuilder.Entity<Vuelo>().Property(v => v.VueloId).HasColumnName("vuelo_id");
            modelBuilder.Entity<Vuelo>().Property(v => v.AeropuertoId).HasColumnName("aeropuerto_id");
            modelBuilder.Entity<Vuelo>().Property(v => v.AvionId).HasColumnName("avion_id");
            modelBuilder.Entity<Vuelo>().Property(v => v.Asientos).HasColumnName("asientos");
            modelBuilder.Entity<Vuelo>().Property(v => v.Destino).HasColumnName("destino");
            modelBuilder.Entity<Vuelo>().Property(v => v.Salida).HasColumnName("salida");
            modelBuilder.Entity<Vuelo>().Property(v => v.FechaSalida).HasColumnName("fecha_salida");
            modelBuilder.Entity<Vuelo>().Property(v => v.FechaLlegada).HasColumnName("fecha_llegada");

            // Repetir OnModelCreating para otras entidades 
        }
    }
}