namespace backend.API.DTOs;

public class PostDto
{
  public string Title { get; set; }
  public string Summary { get; set; }
  public string Content { get; set; }
  public IFormFile File { get; set; }
}