using Backend.Application.Models;
using Backend.Application.Services.Interfaces;
using Backend.Core.Interfaces.CloudServices;

using Hangfire;

namespace Backend.Application.Services.Implementations;

public class NotificationService : INotificationService
{
    private readonly IEmailService _emailService;
    private readonly ISubscriberService _subscriberService;
    private readonly IBackgroundJobClient _jobClient;

    public NotificationService(IEmailService emailService, IBackgroundJobClient jobClient, ISubscriberService subscriberService)
    {
        _emailService = emailService;
        _jobClient = jobClient;
        _subscriberService = subscriberService;
    }

    public void EnqueueNotification(string notificationType, NotificationContext context)
    {
        switch (notificationType)
        {
            case "PostConfirmation":
                var postConfirmationSubject = "Post Confirmation";
                var postConfirmationMessage = _emailService.GeneratePostConfirmationTemplate(context.Title, context.PostSlug);
                _jobClient.Enqueue(() => _emailService.SendEmailAsync(context.UserEmail, postConfirmationSubject, postConfirmationMessage));
                break;
            case "CommentReply":
                var replySubject = "Comment Reply Notification";
                var replyMessage = _emailService.GenerateReplyTemplate(context.UserName, context.Content, context.PostSlug);
                _jobClient.Enqueue(() => _emailService.SendEmailAsync(context.UserEmail, replySubject, replyMessage));
                break;
            case "CommentNotification":
                var commentSubject = "Comment Notification";
                var commentMessage = _emailService.GenerateReplyTemplate(context.UserName, context.Content, context.PostSlug);
                _jobClient.Enqueue(() => _emailService.SendEmailAsync(context.UserEmail, commentSubject, commentMessage));
                break;
            case "ProjectConfirmation":
                var projectConfirmationSubject = "Project Confirmation";
                var projectConfirmationMessage = _emailService.GenerateProjectConfirmationTemplate(context.Title);
                _jobClient.Enqueue(() => _emailService.SendEmailAsync(context.UserEmail, projectConfirmationSubject, projectConfirmationMessage));
                break;
            case "NewPostNotification":
                string emailSubject = "New Post Published";
                string emailMessage = _emailService.GenerateNewPostNotificationTemplate(context.Title, context.PostSlug);
                _jobClient.Enqueue(() => NotifyAllSubscribersAboutNewPost(context.UserEmail, emailSubject, emailMessage));
                break;
            default:
                throw new ArgumentException("Unsupported notification type.");
        }
    }

    public async Task NotifyAllSubscribersAboutNewPost(string postCreatorEmail, string emailSubject, string emailMessage)
    {
        var subscribedEmails = await _subscriberService.GetAllSubscribedEmailsAsync();

        foreach (var email in subscribedEmails)
        {
            if (!email.Equals(postCreatorEmail, StringComparison.OrdinalIgnoreCase))
                await _emailService.SendEmailAsync(email, emailSubject, emailMessage);
        }
    }
}
