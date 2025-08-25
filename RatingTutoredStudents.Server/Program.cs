using Microsoft.EntityFrameworkCore;
using RatingTutoredStudents.Server.Data;

var builder = WebApplication.CreateBuilder(args);

// CORS
const string AllowFrontend = "AllowFrontend";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: AllowFrontend, policy =>
        policy
            .WithOrigins(
                "https://localhost:63562", // exact frontend origin
                "http://localhost:63562",
                "https://localhost:3000",
                "http://localhost:3000"
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
    // .AllowCredentials() // uncomment ONLY if you send cookies/Authorization across origins
    );
});

// Db + MVC + Swagger
var connectionString = builder.Configuration.GetConnectionString("StudentInfoConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Apply CORS BEFORE controllers (and before auth)
app.UseCors(AllowFrontend);

// If you have auth, it goes after CORS:
app.UseAuthorization();

app.MapControllers();
app.MapFallbackToFile("/index.html");

app.Run();
