using backend.DtoModels;

namespace backend.RepositoryInterface
{
    public interface IUserService
    {
        UsersDto GetByEmailId(string EmailAddress);

        ResponseMessage<bool> OtpVerification(LoginOTPDto userOTP);

        List<Models.Users> GetAllUsers();
    }
}
