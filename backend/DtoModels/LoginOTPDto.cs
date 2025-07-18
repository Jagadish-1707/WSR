using backend.Models;
using System.ComponentModel.DataAnnotations;

namespace backend.DtoModels
{
    public class LoginOTPDto:BaseModel
    {
        public int? Id { get; set; }
        public string? EmailAddress { get; set; }

        public long OneTimePassword { get; set; }

    }
    public class AddLoginOTPDto
    {

        public string? EmailAddress { get; set; }

        public long OneTimePassword { get; set; }

    }
}
