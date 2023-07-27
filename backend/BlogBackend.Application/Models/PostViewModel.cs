namespace BlogBackend.Application.Models;

public class PostViewModel
{
  public string Id { get; set; }
  public string Title { get; set; }
  public string Summary { get; set; }
  public string Content { get; set; }
  public string CoverImageUrl { get; set; }
}