using Backend.Application.Models;
using FluentValidation;

namespace Backend.Application.Validators;

public class CommentInputModelValidator : AbstractValidator<CommentInputModel>
{
    public CommentInputModelValidator()
    {
        RuleFor(model => model.Content).NotEmpty();
    }
}