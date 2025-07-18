using backend.Common;
using backend.DtoModels;
using backend.Models;
using backend.RepositoryInterface;
using MailKit.Security;
using MailKit.Net.Smtp;
using Microsoft.AspNetCore.Mvc;
using MimeKit;
using System.Data;
using System.Net;
using System.Net.Mail;
using System.Runtime.Intrinsics.X86;

namespace backend.ReposirotyService
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly UnitOfWork _unitOfWork;
        private string OTP;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
            _unitOfWork = new UnitOfWork(configuration);
        }

        public ResponseMessage<bool> SendMail(string toMail) 
        {
            DateTime currentTime = DateTime.Now;
            DateTime futureTime = currentTime.AddMinutes(5);
            Random rand = new Random();
            OTP = rand.Next(100000,999999).ToString("D6");
            var subject = "OTP for MMS Login - "+OTP;
            var body = "<!DOCTYPE html>" +
                "         <html lang='en'>"+
                " <head>" +
                "<meta charset='utf-8'>" +
                " <title>Invoice</title>" +
                " <meta http-equiv='X-UA-Compatible' content='IE=edge,chrome=1'>" +
                " <meta name='viewport' content='width=device-width, initial-scale=1'> " +
                "  <link rel='stylesheet' href='./style.css'>"+
                " </head>" +
                "<body>" +
                "<p> Use the following one - time password(OTP) to sign in to your Excelencia MMS</p>\r\n\r\n" +
                "<h3>"+ OTP + "</h3>" +
                "<span>This OTP will be valid for 5 minutes till </span>" + "<span><b>" + futureTime + "</b></span>" + 
                "<p>If you didn't initiate this action or if you think you received this email by mistake please ignore the mail</p>" +
                "<p>Regards,</p>"+
                "<b><p>Excelencia</p></b>"+
                "</body>";
            //using (var smtp = new System.Net.Mail.SmtpClient("smtp.gmail.com", 587))
            using (var smtp = new System.Net.Mail.SmtpClient("smtp.office365.com", 587))

            {

                //smtp.Credentials = new NetworkCredential("no-reply@excelenciaconsulting.com", "Man11453");
                smtp.Credentials = new NetworkCredential("adhin.adish@excelenciaconsulting.com", "Neymar@1234");
                smtp.EnableSsl = true;
                smtp.UseDefaultCredentials = false;
                smtp.DeliveryMethod = SmtpDeliveryMethod.Network;
                try
                {
                    MailMessage message = new MailMessage("adhin.adish@excelenciaconsulting.com", toMail, subject, body);
                    message.IsBodyHtml = true;
                    smtp.Send(message);
                }
                catch (Exception ex)
                {
                    return new ResponseMessage<bool> { Success = false, ErrorMessage = ex.Message };
                }
                
            }
            return new ResponseMessage<bool> { Success = true, Message = "OTP Send Successfully " + toMail };
        }
         
        public ResponseMessage<bool> AddLogin(string emailAddress, int userId) 
        {
            long otp = Convert.ToInt64(OTP);
            LoginOTP? login = null;
            try
            {  
                using (var transaction = _unitOfWork.LoginRepository.Context.Database.BeginTransaction())
                {
                    login = new LoginOTP();
                    login.EmailAddress = emailAddress;
                    login.OneTimePassword = otp;
                    login.Status = 1;
                    login.Active = true;
                    login.User_Id = userId;
                    login.IsVerified = false;
                    login.CreatedBy = emailAddress;
                    login.CreatedOn = DateTime.Now;

                    _unitOfWork.LoginRepository.Insert(login); 
                    _unitOfWork.Save();
                    transaction.Commit();
                }
            }
            catch (Exception e)
            {
                return new ResponseMessage<bool> { Success = false, ErrorMessage = e.Message };
            }
            return new ResponseMessage<bool> { Success = true };
        }

        public async Task<ResponseMessage<bool>> SendTimesheetNotificationEmailAsync(
            string employeeEmail,
            string employeeName,
            DateTime logDate,
            string action,
            string ccEmail)
        {
            try
            {
                string subject = $"Timesheet {action} Notification - Excelencia MMS";

                // Simplified HTML structure similar to working OTP email
                //string commentsSection = string.IsNullOrEmpty(comments)
                //    ? ""
                //    : "<p><b>Rejection Reason:</b> " + comments + "</p>";

                string body = "<!DOCTYPE html>" +
                    "<html lang='en'>" +
                    "<head>" +
                    "<meta charset='utf-8'>" +
                    "<title>Timesheet " + action + " Notification</title>" +
                    "<meta http-equiv='X-UA-Compatible' content='IE=edge,chrome=1'>" +
                    "<meta name='viewport' content='width=device-width, initial-scale=1'>" +
                    "</head>" +
                    "<body>" +
                    "<h2>Timesheet " + action + "</h2>" +
                    "<hr/>" +
                    "<p>Dear " + employeeName + ",</p>" +
                    "<p>Your timesheet dated <b>" + logDate.ToString("dd MMM yyyy") + "</b> has been <b>" + action.ToLower() + "</b>.</p>" +                    
                    "<p>If you have any questions, please contact your manager.</p>" +
                    "<p>Regards,</p>" +
                    "<b><p>Excelencia MMS</p></b>" +
                    "</body>" +
                    "</html>";

                using (var smtp = new System.Net.Mail.SmtpClient("smtp.gmail.com", 587))
                {
                    smtp.Credentials = new NetworkCredential("ranjithsubramanian8828@gmail.com", "tksdrjibvttwetbd");
                    smtp.EnableSsl = true;
                    smtp.UseDefaultCredentials = false;
                    smtp.DeliveryMethod = SmtpDeliveryMethod.Network;

                    MailMessage message = new MailMessage(
                        "ranjithsubramanian8828@gmail.com",
                        employeeEmail,
                        subject,
                        body);

                    message.IsBodyHtml = true;

                    // Add CC recipient if provided
                    if (!string.IsNullOrEmpty(ccEmail))
                    {
                        message.CC.Add(ccEmail);
                    }

                    smtp.Send(message);
                    // await smtp.SendMailAsync(message);
                }

                return new ResponseMessage<bool> { Success = true, Message = "Notification email sent successfully to " + employeeEmail };
            }
            catch (Exception ex)
            {
                return new ResponseMessage<bool> { Success = false, ErrorMessage = ex.Message };
            }
        }



    }
}