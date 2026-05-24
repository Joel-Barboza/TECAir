using Microsoft.EntityFrameworkCore;
using TECAirAPI.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular",
        policy =>
        {
            //policy.WithOrigins("http://localhost:5006", "http://localhost:5007")
            policy.WithOrigins("*")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("PostgresConnection"))
);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseCors("AllowAngular");

app.UseSwagger();
app.UseSwaggerUI();

app.UseAuthorization();

app.MapControllers();

app.Run();



//app.UseDefaultFiles();

//app.UseStaticFiles();

//app.UseHttpsRedirection();

//app.UseAuthorization();

//app.MapControllers();

//app.MapFallbackToFile("index.html");

//app.Run();