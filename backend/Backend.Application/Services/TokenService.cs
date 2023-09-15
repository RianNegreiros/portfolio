﻿using System.Text;
using System.Security.Claims;
using Backend.Core.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;

namespace Backend.Application.Services;

public class TokenService : ITokenService
{
  private readonly IConfiguration _config;
  private readonly SymmetricSecurityKey _key;

  public TokenService(IConfiguration config)
  {
    _config = config;
    _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JwtConfig:SecretKey"]));
  }

  public string GenerateJwtToken(User user, bool isAdmin = false)
  {
    SigningCredentials credentials = new(_key, SecurityAlgorithms.HmacSha256);

    List<Claim> claims = new()
    {
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.GivenName, user.UserName),
                new Claim(ClaimTypes.Role, isAdmin ? "Admin" : "User")
    };

    JwtSecurityToken token = new(
        issuer: _config["JwtConfig:Issuer"],
        audience: _config["JwtConfig:Audience"],
        claims,
        expires: DateTime.UtcNow.AddMinutes(30),
        signingCredentials: credentials
    );

    return new JwtSecurityTokenHandler().WriteToken(token);
  }
}
