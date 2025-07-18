using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    [Table("ZohoEmp")]
    public class ZohoEmp
    {
        [Key]
        public int ZohoEmp_Id { get; set; }

        public string? Employee_Id { get; set; }
        public string? UserName { get; set; }
        public string? Designation { get; set; }
        public string? Business_unit { get; set; }
        public string? Status { get; set; }
        public string? YearOfExperience { get; set; }
        public string? Mobile { get; set; }
        public string? EmailID { get; set; }
        public string? DateOfJoining { get; set; }
        public string? Department { get; set; }
        public string? EmployeeCategory { get; set; }
        public string? Reporting_Manager { get; set; }
        public string? Second_Reporting_To { get; set; }
        public string? Work_location { get; set; }
        public string? Entity { get; set; }
        public string? OwnerName { get; set; }
        public string? RecordId { get; set; }
        public string? ApprovalStatus { get; set; }
        public DateTime? CreatedOn { get; set; }
        public DateTime? ModifiedOn { get; set; }
    }

}
