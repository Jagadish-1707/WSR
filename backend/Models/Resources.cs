using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [Table("Resources")]
    public class Resources
    {
        [Key]
        public int Resource_Id { get; set; }
        public int? User_Id { get; set; }
        public string? Employee_Image { get; set; }
        public string? Employee_Id { get; set; }
        public string? Reporting_Manager { get; set; }
        public string? Tower { get; set; }
        public int? Fresher { get; set; }
        public string? YearOfExperience { get; set; }
        public string? PrimarySkillSet { get; set; }
        public string? SecondarySkillSet { get; set; }
        public string? DateOfJoining { get; set; }
        public string? ExcelenciaExperience { get; set; }
        public string? Profile { get; set; }
        public string? Status { get; set; }
        public string? Department { get; set; }
        public string? EmployeeCategory { get; set; }
        public DateTime? CreatedOn { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public int? ModifiedBy { get; set; }
        public string? UserName { get; set; }
        public string? DateofConfirmation { get; set; }
        public string? Date_of_birth { get; set; }
        public string? Designation { get; set; }
        public string? Age { get; set; }
        public string? Second_Reporting_To { get; set; }
        public string? EmailID { get; set; }
        public string? Gender { get; set; }
        public string? Mobile { get; set; }
        public string? Work_location { get; set; }
        public string? Entity { get; set; }
        public string? Business_unit { get; set; }
        public bool Is_Deleted { get; set; } = false;
    }
}