using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class ProjectTypeMaster:BaseModel
    {
        [Key]
        public int Id { get; set; }
        public string? ProjectTypeName { get; set; }
        public string? Description { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? Remarks { get; set; }
    }
}
