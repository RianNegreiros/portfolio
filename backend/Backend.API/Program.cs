using Backend.API.Extensions;
using Backend.API.Middlewares;
using Backend.Core.Models;
using Backend.Infrastructure.Data;
using Backend.Infrastructure.Data.SeedData;

using HealthChecks.UI.Client;

using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Register services
builder.Services.AddApplicationServices();
builder.Services.AddIdentityServices(builder.Configuration);
builder.Services.AddMongoDb(builder.Configuration);
builder.Services.AddRedis(builder.Configuration);
builder.Services.AddHealthChecks(builder.Configuration);
builder.Services.AddHangfire();
builder.Services.AddResend(builder.Configuration);

// Configure middleware
builder.Services.AddCors(builder.Configuration);
builder.Services.AddControllers();
builder.Services.AddSwaggerDocumentation();

builder.Services.AddResponseCompression(options =>
{
    options.EnableForHttps = true;
    options.Providers.Add<GzipCompressionProvider>();
    options.Providers.Add<BrotliCompressionProvider>();
});

// Configure the HTTP request pipeline
var app = builder.Build();

app.UseResponseCompression();

app.UseMiddleware<ExceptionHandlingMiddleware>();

app.UseCors("CorsPolicy");
app.UseCookiePolicy();

app.UseSwaggerDocumentation();

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHealthChecks("/api/health", new HealthCheckOptions
{
    Predicate = _ => true,
    ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
});

// Seed data
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var loggerFactory = services.GetRequiredService<ILoggerFactory>();
    try
    {
        var context = services.GetRequiredService<IdentityDbContext>();
        await context.Database.MigrateAsync();
        await AdminUserSeed.SeedAsync(services.GetRequiredService<UserManager<User>>(), services.GetRequiredService<RoleManager<IdentityRole>>(), builder.Configuration);
    }
    catch (Exception ex)
    {
        var logger = loggerFactory.CreateLogger<Program>();
        logger.LogError(ex, "An error occurred during migration");
    }
}

app.Run();