using System.Security.Claims;
using backend.API.DTOs;
using backend.Core.Interfaces.Services;
using backend.Core.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.API.Controllers;

public class PostController : BaseApiController
{
  private readonly IPostService _postService;
  private readonly IUserService _userService;

  public PostController(IPostService postService, IUserService userService)
  {
    _postService = postService;
    _userService = userService;
  }

  [Authorize]
  [HttpPost]
  public async Task<ActionResult<Post>> CreatePost(PostDto model)
  {
    var currentUser = await _userService.GetCurrentUser(User.FindFirstValue(ClaimTypes.Email));

    var post = await _postService.CreatePost(model, currentUser);
    return Ok(post);
  }

  [Authorize]
  [HttpPut("{id}")]
  public async Task<IActionResult> UpdatePost(string id, PostDto model)
  {
    var currentUser = await _userService.GetCurrentUser(User.FindFirstValue(ClaimTypes.Email));
    var post = await _postService.UpdatePost(id, model, currentUser.Id);
    if (post == null)
      return NotFound();

    return Ok(post);
  }

  [HttpGet]
  public async Task<IActionResult> GetPosts()
  {
    var posts = await _postService.GetPosts();
    return Ok(posts);
  }

  [HttpGet("{id}")]
  public async Task<IActionResult> GetPost(string id)
  {
    var post = await _postService.GetPost(id);
    if (post == null)
      return NotFound();

    return Ok(post);
  }
}