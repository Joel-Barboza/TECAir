using Microsoft.EntityFrameworkCore;
using TECAirAPI.Models;

namespace TECAirAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Usuario> usuario { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Usuario>(entity =>
            {
                entity.ToTable("usuario");

                entity.HasKey(e => e.UsuarioId);

                entity.Property(e => e.UsuarioId)
                      .HasColumnName("usuario_id");

                entity.Property(e => e.Nombre)
                      .HasColumnName("nombre");

                entity.Property(e => e.Apellido1)
                      .HasColumnName("apellido1");

                entity.Property(e => e.Apellido2)
                      .HasColumnName("apellido2");

                entity.Property(e => e.Email)
                      .HasColumnName("email");

                entity.Property(e => e.Telefono)
                      .HasColumnName("telefono");

                entity.Property(e => e.Carnet)
                      .HasColumnName("carnet");

                entity.Property(e => e.Universidad)
                      .HasColumnName("universidad");
            });
        }
    }
}