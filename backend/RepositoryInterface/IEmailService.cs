using backend.DtoModels;
using backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.RepositoryInterface
{
    public interface IEmailService
    {
        ResponseMessage<bool> SendMail(string toMail);

        ResponseMessage<bool> AddLogin(string emailAddress, int userId);

        Task<ResponseMessage<bool>> SendTimesheetNotificationEmailAsync(
                   string employeeEmail,
                   string employeeName,
                   DateTime logDate,
                   string action,
                   string ccEmail);


    }
}
