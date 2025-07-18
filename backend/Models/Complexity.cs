using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [Table("Complexity")]
    public class Complexity:BaseModel
    {
        [Key]
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public string Customer { get; set; }
        public int ProjectId { get; set; }
        public string Project { get; set; }
        public string ProjectComplexity { get; set; }
        public string? Remarks { get; set; }

    }
}
