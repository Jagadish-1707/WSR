using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [Table("TaskMetrics")]
    public class TaskMetrics : BaseModel
    {
        [Key]
        public int Id { get; set; }

        public int TaskId { get; set; }
        public int MetricsId { get; set; }        
    }
}
