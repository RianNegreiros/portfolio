using BlogBackend.Application.Services;
using BlogBackend.Core.CloudServices;
using BlogBackend.Core.Inferfaces;
using BlogBackend.Infrastructure.CloudServices;
using BlogBackend.Infrastructure.Repositories;

namespace BlogBackend.API.Extensions;

public static class ApplicationServicesExtensions
{
  public static IServiceCollection AddApplicationServices(this IServiceCollection services)
  {
    services.AddScoped<IPostRepository, PostRepository>();
    services.AddScoped<IProjectsRepository, ProjectsRepository>();

    services.AddScoped<ITokenService, TokenService>();
    services.AddScoped<IPostService, PostService>();
    services.AddScoped<ICloudinaryService, CloudinaryService>();
    services.AddScoped<IProjectsService, ProjectsService>();

    return services;
  }
}