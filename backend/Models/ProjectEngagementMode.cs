using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [Table("Projectengagementmode")]
    public class ProjectMode 
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string ProjectEngagementMode { get; set; }
        public string? Remarks { get; set; }
        public int Status { get; set; }
        public DateTime? CreatedOn { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public string? ModifiedBy { get; set; }
        public  bool Active { get; set; }

    }
}
