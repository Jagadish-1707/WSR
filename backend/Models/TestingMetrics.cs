using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class TestingMetrics
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("TaskDetails")]
        public int TaskDetailsId { get; set; }
        public int TaskId { get; set; } 
        public string? TestingMetricsName { get; set; }

    }
}
