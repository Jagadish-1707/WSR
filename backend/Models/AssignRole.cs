using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [Table("AssignRole")]
    public class AssignRole : BaseModel
    {
        [Key]
        public int Id { get; set; }
        public string? EmployeeId { get; set; }
        public string Employee { get; set; }
        public string? Role { get; set; }
        public int? RoleId { get; set; }
        public string? Department { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? Remarks { get; set; }
    }
}
