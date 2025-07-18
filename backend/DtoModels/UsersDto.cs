using System.ComponentModel.DataAnnotations.Schema;

namespace backend.DtoModels
{
    public class UsersDto
    {
        public int User_Id { get; set; }
        public string? Employee_ID { get; set; }
        public string? UserName { get; set; }
        public string? Email_Address { get; set; }
        public string? Profile { get; set; }
        public string? Role { get; set; }
        public string Status { get; set; }
        public string? Last_accessed_on { get; set; }
        public string? Created_Time { get; set; }
        public string? Last_Modified_Time { get; set; }
        public int? Cost_Per_Hour { get; set; }
        public int? RoleId { get; set; }
        public int? DeptId { get; set; }

        [Column("Reporting_To")]
        public int? Reporting_To { get; set; }




    }
}
