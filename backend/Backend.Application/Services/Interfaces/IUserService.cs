using Backend.Application.Models.ViewModels;
using Backend.Core.Models;

using Microsoft.AspNetCore.Identity;

namespace Backend.Application.Services.Interfaces;

public interface IUserService
{
    Task<IEnumerable<AdminUserViewModel>> GetAllUsers();
    Task<User> GetUserById(string userId);
    Task<IdentityResult> CreateUser(string username, string email, string password, bool admin = false);
    Task<IdentityResult> UpdateUser(string userId, string newUserName, string newEmail);
    Task DeleteUser(string userId);
}