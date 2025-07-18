using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [Table("Role")]
    public class Role:BaseModel
    {
        [Key]
        public int Id { get; set; }
        public string RoleName { get; set; }
        public string? Remarks { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
}
