using Microsoft.EntityFrameworkCore;
using RatingTutoredStudents.Server.Data;
using RatingTutoredStudents.Server.DataBase;
using RatingTutoredStudents.Server.Repositories;
using RatingTutoredStudents.Server.Services;

var builder = WebApplication.CreateBuilder(args);

// CORS
const string AllowFrontend = "AllowFrontend";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: AllowFrontend, policy =>
        policy
            .WithOrigins(
                "https://localhost:63562",
                "http://localhost:63562",
                "https://localhost:3000",
                "http://localhost:3000"
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
    // .AllowCredentials() // enable only if sending cookies/Authorization
    );
});

// DbContext
var connectionString = builder.Configuration.GetConnectionString("StudentInfoConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

// MVC + Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Repositories
builder.Services.AddScoped<IStudentRepository, StudentRepository>();
builder.Services.AddScoped<ISessionInfoRepository, SessionInfoRepository>();

// Services (register interface -> implementation)
builder.Services.AddScoped<StudentService>();
builder.Services.AddScoped<SessionInfoService>();

var app = builder.Build();

// Static files for SPA (if you serve React from the same app)
app.UseDefaultFiles();
app.UseStaticFiles();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors(AllowFrontend);

app.UseAuthorization();

app.MapControllers();

// If you serve a SPA, fallback to index.html
app.MapFallbackToFile("/index.html");

app.Run();
