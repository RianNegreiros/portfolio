using Backend.Core.Interfaces.CloudServices;

using Microsoft.Extensions.Configuration;

using Resend;

namespace Backend.Infrastructure.CloudServices;

public class EmailService(IResend resend, IConfiguration configuration) : IEmailService
{
    private readonly IResend _resend = resend;
    private readonly IConfiguration _config = configuration;

    public async Task SendEmailAsync(string email, string subject, string message)
    {
        var emailMessage = new EmailMessage
        {
            From = "no-reply@riannegreiros.dev",
            To = email,
            Subject = subject,
            HtmlBody = message
        };

        await _resend.EmailSendAsync(emailMessage);
    }

    public string GenerateUnsubscribeLink(string email)
    {
        string apiUrl = _config["ApiUrl"];
        return $"{apiUrl}/subscribers/unsubscribe?email={Uri.EscapeDataString(email)}";
    }

    public string GenerateNewPostNotificationTemplate(string subscriberEmail, string postTitle, string postSlug)
    {
        string clientUrl = _config["ClientUrl"];
        string postUrl = $"{clientUrl}/posts/{postSlug}";
        string unsubscribeUrl = GenerateUnsubscribeLink(subscriberEmail);

        string htmlTemplate = @"
            <!DOCTYPE html>
            <html>
            <head>
                <title>New Post Notification</title>
                <style>
                    body { font-family: Arial, sans-serif; }
                    h1 { color: #333; }
                    p { color: #666; }
                    a { color: #007bff; text-decoration: none; }
                </style>
            </head>
            <body>
                <h1>New Post: {post_title}</h1>
                <p>A new post titled '{post_title}' has been published.</p>
                <p>Click <a href='{post_url}'>here</a> to read the post.</p>
                <p>If you wish to unsubscribe, click <a href='{unsubscribe_url}'>here</a>.</p>
            </body>
            </html>
        ";

        string htmlMessage = htmlTemplate.Replace("{post_title}", postTitle)
                                          .Replace("{post_url}", postUrl)
                                          .Replace("{unsubscribe_url}", unsubscribeUrl);

        return htmlMessage;
    }

    public string GeneratePostConfirmationTemplate(string postTitle, string postSlug)
    {
        string htmlTemplate = @"
            <!DOCTYPE html>
            <html>
            <head>
                <title>Post Confirmation</title>
                <style>
                    body { font-family: Arial, sans-serif; }
                    h1 { color: #333; }
                    p { color: #666; }
                    a { color: #007bff; text-decoration: none; }
                </style>
            </head>
            <body>
                <h1>Post Confirmation</h1>
                <p>Your post titled '{post_title}' has been successfully created.</p>
                <p>Click <a href='{post_url}'>here</a> to view your post.</p>
            </body>
            </html>
            ";

        string clientUrl = _config["ClientUrl"];
        string postUrl = $"{clientUrl}/posts/{postSlug}";

        string htmlMessage = htmlTemplate.Replace("{post_title}", postTitle).Replace("{post_url}", postUrl);

        return htmlMessage;
    }

    public string GenerateProjectConfirmationTemplate(string projectTitle)
    {
        string htmlTemplate = @"
            <!DOCTYPE html>
            <html>
            <head>
                <title>Project Confirmation</title>
                <style>
                    body { font-family: Arial, sans-serif; }
                    h1 { color: #333; }
                    p { color: #666; }
                    a { color: #007bff; text-decoration: none; }
                </style>
            </head>
            <body>
                <h1>Project Confirmation</h1>
                <p>Your project titled '{post_title}' has been successfully created.</p>
                <p>Click <a href='{post_url}'>here</a> to view your check it out.</p>
            </body>
            </html>
            ";

        string clientUrl = _config["ClientUrl"];
        string postUrl = $"{clientUrl}/projects";

        string htmlMessage = htmlTemplate.Replace("{post_title}", projectTitle).Replace("{post_url}", postUrl);

        return htmlMessage;
    }

    public string GenerateCommentNotificationTemplate(string commenterName, string commentContent, string postSlug)
    {
        string htmlTemplate = @"
        <!DOCTYPE html>
        <html>
        <head>
            <title>Comment Notification</title>
            <style>
                    body { font-family: Arial, sans-serif; }
                    h1 { color: #333; }
                    p { color: #666; }
                    a { color: #007bff; text-decoration: none; }
            </style>
        </head>
        <body>
            <h1>Comment Notification</h1>
            <p>Dear Post Owner,</p>
            <p>{commenter_name} has commented on your post.</p>
            <p>The comment is: '{comment_content}'</p>
            <p>Click <a href='{post_url}'>here</a> to view the comment.</p>
        </body>
        </html>
        ";

        string clientUrl = _config["ClientUrl"];
        string postUrl = $"{clientUrl}/posts/{postSlug}";

        string htmlMessage = htmlTemplate.Replace("{commenter_name}", commenterName)
                                         .Replace("{comment_content}", commentContent)
                                         .Replace("{post_url}", postUrl);

        return htmlMessage;
    }

    public string GenerateReplyTemplate(string commenterName, string commentContent, string postSlug)
    {
        string htmlTemplate = @"
        <!DOCTYPE html>
        <html>
        <head>
            <title>Comment Reply Notification</title>
            <style>
                    body { font-family: Arial, sans-serif; }
                    h1 { color: #333; }
                    p { color: #666; }
                    a { color: #007bff; text-decoration: none; }
            </style>
        </head>
        <body>
            <h1>Comment Reply Notification</h1>
            <p>Dear {commenter_name},</p>
            <p>Someone has replied to your comment: '{comment_content}'.</p>
            <p>Click <a href='{post_url}'>here</a> to view the reply.</p>
        </body>
        </html>
        ";

        string clientUrl = _config["ClientUrl"];
        string postUrl = $"{clientUrl}/posts/{postSlug}";

        string htmlMessage = htmlTemplate.Replace("{commenter_name}", commenterName)
                                         .Replace("{comment_content}", commentContent)
                                         .Replace("{post_url}", postUrl);

        return htmlMessage;
    }
}