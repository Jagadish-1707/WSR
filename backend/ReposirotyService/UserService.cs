using backend.Common;
using backend.DtoModels;
using backend.Models;
using backend.RepositoryInterface;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Net.Mail;
using static System.Net.WebRequestMethods;

namespace backend.ReposirotyService
{
    public class UserService : IUserService
    {
        private readonly IConfiguration _configuration;
        private readonly UnitOfWork _unitOfWork;
        private string OTP;

        public UserService(IConfiguration configuration)
        {
            _configuration = configuration;
            _unitOfWork = new UnitOfWork(configuration);
        }

        public UsersDto GetByEmailId(string EmailAddress)
        {
            var contextData = _unitOfWork.UsersRepository.Context;
            var userDto = contextData.Users.Where(w => w.Email_Address.Equals(EmailAddress) && w.Status.Equals("Active")).Select(s => new UsersDto
            {
                User_Id = s.User_Id,
                UserName = s.UserName,
                Email_Address = s.Email_Address,
                Cost_Per_Hour = s.Cost_Per_Hour,
                Created_Time = s.Created_Time,
                Employee_ID = s.Employee_ID,
                Last_accessed_on = s.Last_accessed_on,
                Status = s.Status,
                Profile = s.Profile,
                Last_Modified_Time = s.Last_Modified_Time,
                Role = s.Role,
                RoleId = s.RoleId,
                DeptId = s.DeptId


            }).FirstOrDefault();

            return userDto;
        }

        public ResponseMessage<bool> OtpVerification(LoginOTPDto userOTP)
        {
            try
            {
                var contextData = _unitOfWork.UsersRepository.Context;
                var verifyLogin = contextData.LoginOTPs.Where(w => w.EmailAddress.Equals(userOTP.EmailAddress) && w.IsVerified.Equals(false)).OrderByDescending(o => o.CreatedOn).FirstOrDefault();

                if (verifyLogin != null && verifyLogin.OneTimePassword.Equals(userOTP.OneTimePassword))
                {
                    
                    using (var transaction = _unitOfWork.LoginRepository.Context.Database.BeginTransaction())
                    {
                        verifyLogin.IsVerified = true;
                        verifyLogin.ModifiedOn = DateTime.Now;
                        _unitOfWork.LoginRepository.Update(verifyLogin);
                        _unitOfWork.Save();
                        transaction.Commit();
                    }
                }
                else
                {
                    return new ResponseMessage<bool> { Success = false, ErrorMessage = "OTP Invalid" };
                }
            }
            catch (Exception ex)
            {
                return new ResponseMessage<bool> { Success = false, ErrorMessage = "Error encountering when verify OTP, Please contact admin!" };
            }
            return new ResponseMessage<bool> { Success = true, Message = "Successfully logged in."};
        }
        public List<Models.Users> GetAllUsers()
        {
            var contextData = _unitOfWork.UsersRepository.Context;
            return contextData.Users.ToList();
        }
    }
}
