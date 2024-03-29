using Backend.Application.Models.InputModels;
using Backend.Application.Models.ViewModels;
using Backend.Core.Models;

namespace Backend.Application.Services.Interfaces;

public interface ICommentsService
{
    Task<Comment> AddCommentToPost(PostViewModel post, CommentInputModel comment, User author);
    Task<Comment> AddReplyToComment(CommentViewModel comment, CommentInputModel model, User author);
    Task<List<Comment>> GetCommentsForPostByIdentifier(string identifier);
    Task<CommentViewModel> GetCommentById(string id);
}