using Backend.Core.Models;

namespace Backend.Core.Interfaces.Repositories;

public interface ICommentsRepository
{
    Task<List<Comment>> GetAll();
    Task<Comment> GetById(string id);
    Task<Comment> AddComment(Comment comment);
    Task<Comment> AddReplyToComment(string commentId, Comment reply);
    Task<List<Comment>> GetCommentsForPostById(string postId);
    Task<List<Comment>> GetCommentsForPostBySlug(string postSlug);
    Task Delete(string id);
    Task<List<Comment>> GetCommentsForUserById(string userId);
}