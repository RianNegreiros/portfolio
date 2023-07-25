using backend.Core.Interfaces.Services;
using Microsoft.EntityFrameworkCore;
using backend.Infrastructure.Services;
using backend.Infrastructure.Data;

namespace backend.API.Extensions;

public static class ApplicationServicesExtensions
{
  public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
  {
    services.AddScoped<ITokenService, TokenService>();
    services.AddScoped<IUserService, UserService>();
    services.AddScoped<IPostService, PostService>();
    services.AddScoped<CloudinaryService>();

    services.AddDbContext<IdentityDbContext>(opt =>
{
  var env = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");

  string connStr;

  if (env == "Development")
  {
    connStr = config.GetConnectionString("DefaultConnection");
  }
  else
  {
    connStr = config.GetConnectionString("IdentityConnection");
  }

  opt.UseNpgsql(connStr);
});

    return services;
  }
}