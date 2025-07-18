using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [Table("LoginOTP")]
    public class LoginOTP: BaseModel
    {
        [Key]
        public int? Id { get; set; }

        public int User_Id { get; set; }
        public bool IsVerified { get; set; }

        [MaxLength(150)]
        public string? EmailAddress { get; set; }

        public long OneTimePassword { get; set; }

        [ForeignKey("User_Id")]
        public virtual Users User { get; set; }

    }
}
