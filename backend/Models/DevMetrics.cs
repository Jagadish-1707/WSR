using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class DevMetrics
    {
        [Key]
        public int Id { get; set; }

        public int TaskId { get; set; }

        [ForeignKey("TaskDetails")]
        public int TaskDetailsId { get; set; }

        public string? DevMetricsName { get; set; }
    }
}
