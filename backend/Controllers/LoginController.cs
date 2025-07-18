using backend.DtoModels;
using backend.ReposirotyService;
using backend.RepositoryInterface;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics.Eventing.Reader;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]

    public class LoginController : Controller
    {
        private readonly IEmailService _emailService;
        private readonly IUserService _userService;
        public LoginController(IEmailService emailService, IUserService userService)
        {
            _emailService = emailService;
            _userService = userService;
        }

        [HttpGet]
        [Route("SendOTP/{emailAddress}")]
        public ActionResult SendOTP(string emailAddress)
        {
            var responseResult = new ResponseMessage<UsersDto>();
            UsersDto objUsersDto =  _userService.GetByEmailId(emailAddress);
            if (objUsersDto != null) {
                var resultVal = _emailService.SendMail(emailAddress);
                if (resultVal.Success)
                {
                    var result = _emailService.AddLogin(emailAddress, objUsersDto.User_Id);
                    if (result.Success)
                    {
                        responseResult = new ResponseMessage<UsersDto> { Success = resultVal.Success, Data = objUsersDto, Message = resultVal.Message };
                    }
                }
                else
                {
                    responseResult = new ResponseMessage<UsersDto> { Success = resultVal.Success, ErrorMessage = resultVal.ErrorMessage };
                }
            }
            else
            {
                responseResult = new ResponseMessage<UsersDto> { Success = false, ErrorMessage = "Invalid user!" };
            }
            return Ok(responseResult);
        }

        [HttpPut]
        [Route("AddLogin")]
        public async Task<ActionResult> AddLogin([FromForm]LoginOTPDto userOTP)
        {
            var result = _userService.OtpVerification(userOTP);
            return Ok(result); // return bool
        }
    }

}
