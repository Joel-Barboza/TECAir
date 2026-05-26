using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
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
        public DbSet<Checkin> Checkins { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            var dateTimeConverter = new ValueConverter<DateTime, DateTime>(
                v => v.Kind == DateTimeKind.Unspecified ? DateTime.SpecifyKind(v, DateTimeKind.Utc) : v.ToUniversalTime(),
                v => DateTime.SpecifyKind(v, DateTimeKind.Local));

            // USUARIO
            modelBuilder.Entity<Usuario>().ToTable("usuario");
            modelBuilder.Entity<Usuario>().HasKey(u => u.UsuarioId);
            modelBuilder.Entity<Usuario>().Property(u => u.UsuarioId).HasColumnName("usuario_id");
            modelBuilder.Entity<Usuario>().Property(u => u.Nombre).HasColumnName("nombre");
            modelBuilder.Entity<Usuario>().Property(u => u.Apellido1).HasColumnName("apellido1");
            modelBuilder.Entity<Usuario>().Property(u => u.Apellido2).HasColumnName("apellido2");
            modelBuilder.Entity<Usuario>().Property(u => u.Email).HasColumnName("email");
            modelBuilder.Entity<Usuario>().Property(u => u.Telefono).HasColumnName("telefono");
            modelBuilder.Entity<Usuario>().Property(u => u.Carnet).HasColumnName("carnet");
            modelBuilder.Entity<Usuario>().Property(u => u.Universidad).HasColumnName("universidad");

            // AEROPUERTO
            modelBuilder.Entity<Aeropuerto>().ToTable("aeropuerto");
            modelBuilder.Entity<Aeropuerto>().HasKey(a => a.AeropuertoId);
            modelBuilder.Entity<Aeropuerto>().Property(a => a.AeropuertoId).HasColumnName("aeropuerto_id");
            modelBuilder.Entity<Aeropuerto>().Property(a => a.Nombre).HasColumnName("nombre");
            modelBuilder.Entity<Aeropuerto>().Property(a => a.Ubicacion).HasColumnName("ubicacion");

            // AVION
            modelBuilder.Entity<Avion>().ToTable("avion");
            modelBuilder.Entity<Avion>().HasKey(a => a.AvionId);
            modelBuilder.Entity<Avion>().Property(a => a.AvionId).HasColumnName("avion_id");
            modelBuilder.Entity<Avion>().Property(a => a.Capacidad).HasColumnName("capacidad");
            modelBuilder.Entity<Avion>().Property(a => a.Modelo).HasColumnName("modelo");

            // VUELO
            modelBuilder.Entity<Vuelo>().ToTable("vuelo");
            modelBuilder.Entity<Vuelo>().HasKey(v => v.VueloId);
            modelBuilder.Entity<Vuelo>().Property(v => v.VueloId).HasColumnName("vuelo_id");
            modelBuilder.Entity<Vuelo>().Property(v => v.AeropuertoId).HasColumnName("aeropuerto_id");
            modelBuilder.Entity<Vuelo>().Property(v => v.AvionId).HasColumnName("avion_id");
            modelBuilder.Entity<Vuelo>().Property(v => v.Asientos).HasColumnName("asientos");
            modelBuilder.Entity<Vuelo>().Property(v => v.Destino).HasColumnName("destino");
            modelBuilder.Entity<Vuelo>().Property(v => v.Salida).HasColumnName("salida");
            modelBuilder.Entity<Vuelo>().Property(v => v.FechaSalida).HasColumnName("fecha_salida").HasConversion(dateTimeConverter);
            modelBuilder.Entity<Vuelo>().Property(v => v.FechaLlegada).HasColumnName("fecha_llegada").HasConversion(dateTimeConverter);
            modelBuilder.Entity<Vuelo>().Property(v => v.PrecioBoleto).HasColumnName("precio_boleto");
            modelBuilder.Entity<Vuelo>().Property(v => v.PuertaAbordaje).HasColumnName("puerta_abordaje");
            modelBuilder.Entity<Vuelo>().Property(v => v.EstadoVuelo).HasColumnName("estado_vuelo");
            modelBuilder.Entity<Vuelo>().Property(v => v.FechaApertura).HasColumnName("fecha_apertura").HasConversion(dateTimeConverter);

            // RESERVA
            modelBuilder.Entity<Reserva>().ToTable("reserva");
            modelBuilder.Entity<Reserva>().HasKey(r => r.ReservaId);
            modelBuilder.Entity<Reserva>().Property(r => r.ReservaId).HasColumnName("reserva_id");
            modelBuilder.Entity<Reserva>().Property(r => r.UsuarioId).HasColumnName("usuario_id");
            modelBuilder.Entity<Reserva>().Property(r => r.VueloId).HasColumnName("vuelo_id");
            modelBuilder.Entity<Reserva>().Property(r => r.FechaReserva).HasColumnName("fecha_reserva").HasConversion(dateTimeConverter);
            modelBuilder.Entity<Reserva>().Property(r => r.AsientosReservados).HasColumnName("asientos_reservados");
            modelBuilder.Entity<Reserva>().Property(r => r.EstadoPago).HasColumnName("estado_pago");

            // BOLETO
            modelBuilder.Entity<Boleto>().ToTable("boleto");
            modelBuilder.Entity<Boleto>().HasKey(b => b.BoletoId);
            modelBuilder.Entity<Boleto>().Property(b => b.BoletoId).HasColumnName("boleto_id");
            modelBuilder.Entity<Boleto>().Property(b => b.ReservaId).HasColumnName("reserva_id");
            modelBuilder.Entity<Boleto>().Property(b => b.Precio).HasColumnName("precio");
            modelBuilder.Entity<Boleto>().Property(b => b.Asiento).HasColumnName("asiento");
            modelBuilder.Entity<Boleto>().Property(b => b.Fecha).HasColumnName("fecha").HasConversion(dateTimeConverter);
            modelBuilder.Entity<Boleto>().Property(b => b.EstadoPago).HasColumnName("estado_pago");

            // FACTURA
            modelBuilder.Entity<Factura>().ToTable("factura");
            modelBuilder.Entity<Factura>().HasKey(f => f.FacturaId);
            modelBuilder.Entity<Factura>().Property(f => f.FacturaId).HasColumnName("factura_id");
            modelBuilder.Entity<Factura>().Property(f => f.BoletoId).HasColumnName("boleto_id");
            modelBuilder.Entity<Factura>().Property(f => f.MetodoPago).HasColumnName("metodo_pago");
            modelBuilder.Entity<Factura>().Property(f => f.Total).HasColumnName("total");
            modelBuilder.Entity<Factura>().Property(f => f.FechaEmision).HasColumnName("fecha_emision").HasConversion(dateTimeConverter);

            // MALETA
            modelBuilder.Entity<Maleta>().ToTable("maleta");
            modelBuilder.Entity<Maleta>().HasKey(m => m.MaletaId);
            modelBuilder.Entity<Maleta>().Property(m => m.MaletaId).HasColumnName("maleta_id");
            modelBuilder.Entity<Maleta>().Property(m => m.ReservaId).HasColumnName("reserva_id");
            modelBuilder.Entity<Maleta>().Property(m => m.Peso).HasColumnName("peso");
            modelBuilder.Entity<Maleta>().Property(m => m.Color).HasColumnName("color");
            modelBuilder.Entity<Maleta>().Property(m => m.CostoAdicional).HasColumnName("costo_adicional");

            // ASIENTO
            modelBuilder.Entity<Asiento>().ToTable("asiento");
            modelBuilder.Entity<Asiento>().HasKey(a => a.AsientoId);
            modelBuilder.Entity<Asiento>().Property(a => a.AsientoId).HasColumnName("asiento_id");
            modelBuilder.Entity<Asiento>().Property(a => a.ReservaId).HasColumnName("reserva_id");
            modelBuilder.Entity<Asiento>().Property(a => a.NumAsiento).HasColumnName("num_asiento");
            modelBuilder.Entity<Asiento>().Property(a => a.Tipo).HasColumnName("tipo");

            // PROMOCION
            modelBuilder.Entity<Promocion>().ToTable("promocion");
            modelBuilder.Entity<Promocion>().HasKey(p => p.PromocionId);
            modelBuilder.Entity<Promocion>().Property(p => p.PromocionId).HasColumnName("promocion_id");
            modelBuilder.Entity<Promocion>().Property(p => p.VueloId).HasColumnName("vuelo_id");
            modelBuilder.Entity<Promocion>().Property(p => p.Origen).HasColumnName("origen");
            modelBuilder.Entity<Promocion>().Property(p => p.Destino).HasColumnName("destino");
            modelBuilder.Entity<Promocion>().Property(p => p.Descuento).HasColumnName("descuento");
            modelBuilder.Entity<Promocion>().Property(p => p.FechaInicio).HasColumnName("fecha_inicio").HasConversion(dateTimeConverter);
            modelBuilder.Entity<Promocion>().Property(p => p.FechaFin).HasColumnName("fecha_fin").HasConversion(dateTimeConverter);

            // CHECKIN
            modelBuilder.Entity<Checkin>().ToTable("checkin");
            modelBuilder.Entity<Checkin>().HasKey(c => c.CheckinId);
            modelBuilder.Entity<Checkin>().Property(c => c.CheckinId).HasColumnName("checkin_id");
            modelBuilder.Entity<Checkin>().Property(c => c.ReservaId).HasColumnName("reserva_id");
            modelBuilder.Entity<Checkin>().Property(c => c.AsientoId).HasColumnName("asiento_id");
            modelBuilder.Entity<Checkin>().Property(c => c.FechaCheckin).HasColumnName("fecha_checkin").HasConversion(dateTimeConverter);
            modelBuilder.Entity<Checkin>().Property(c => c.MetodoEnvio).HasColumnName("metodo_envio");
            modelBuilder.Entity<Checkin>().Property(c => c.EstadoEnvio).HasColumnName("estado_envio");
        }
    }
}